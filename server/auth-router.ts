import { publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { hashPassword, verifyPassword, validatePasswordStrength, validateUsername } from "./auth-utils";
import { getDb } from "./db";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { sdk } from "./_core/sdk";

export const authRouter = router({
  me: publicProcedure.query((opts) => opts.ctx.user),

  login: publicProcedure
    .input(
      z.object({
        username: z.string().min(3),
        password: z.string().min(8),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const db = await getDb();
        if (!db) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Database connection failed",
          });
        }

        const user = await db
          .select()
          .from(users)
          .where(eq(users.username, input.username))
          .limit(1);

        if (user.length === 0 || !user[0].passwordHash) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid username or password",
          });
        }

        const passwordValid = await verifyPassword(input.password, user[0].passwordHash);
        if (!passwordValid) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid username or password",
          });
        }

        // Create a proper JWT session token using the SDK
        const sessionToken = await sdk.createSessionToken(user[0].openId || `local-${user[0].id}`, {
          name: user[0].name || user[0].username || "",
        });
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, cookieOptions);

        await db.update(users).set({ lastSignedIn: new Date() }).where(eq(users.id, user[0].id));

        return {
          success: true,
          user: {
            id: user[0].id,
            username: user[0].username,
            name: user[0].name,
            email: user[0].email,
            role: user[0].role,
          },
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Login failed",
        });
      }
    }),

  register: publicProcedure
    .input(
      z.object({
        username: z.string().min(3),
        password: z.string().min(8),
        name: z.string().min(2),
        email: z.string().email(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const usernameValidation = validateUsername(input.username);
        if (!usernameValidation.valid) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: usernameValidation.errors.join(", "),
          });
        }

        const passwordValidation = validatePasswordStrength(input.password);
        if (!passwordValidation.valid) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: passwordValidation.errors.join(", "),
          });
        }

        const db = await getDb();
        if (!db) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Database connection failed",
          });
        }

        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.username, input.username))
          .limit(1);

        if (existingUser.length > 0) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Username already exists",
          });
        }

          const passwordHash = await hashPassword(input.password);
          // Generate a local openId for non-OAuth users
          const localOpenId = `local-${input.username}-${Date.now()}`;
          await db.insert(users).values({
            openId: localOpenId,
            username: input.username,
            passwordHash,
            name: input.name,
            email: input.email,
            loginMethod: "local",
            role: "user",
          });

          return {
            success: true,
            message: "Registration successful. Please log in with your credentials.",
          };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Registration failed",
        });
      }
    }),

  logout: publicProcedure.mutation(({ ctx }) => {
    const cookieOptions = getSessionCookieOptions(ctx.req);
    ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    return {
      success: true,
    } as const;
  }),

  requestPasswordReset: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Database connection failed",
          });
        }

        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, input.email))
          .limit(1);

        // Always return success for security (don't reveal if email exists)
        if (user.length === 0) {
          return {
            success: true,
            message: "If an account exists with this email, a reset link has been sent.",
          };
        }

        // Generate a password reset token (in production, use a proper token service)
        const resetToken = Buffer.from(`${user[0].id}-${Date.now()}`).toString("base64");

        // In a real application, you would:
        // 1. Save this token to the database with an expiry time
        // 2. Send an email with a link like: /reset-password?token=resetToken
        // 3. Validate the token when user submits new password

        console.log(`[Password Reset] Token for ${input.email}: ${resetToken}`);

        return {
          success: true,
          message: "If an account exists with this email, a reset link has been sent.",
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to process password reset request",
        });
      }
    }),
});

