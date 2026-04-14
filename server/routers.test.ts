import { describe, it, expect, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { TRPCError } from "@trpc/server";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(role: string = "admin"): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "manus",
      role: role as any,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as TrpcContext["res"],
  };
}

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as TrpcContext["res"],
  };
}

describe("Role-Based Access Control", () => {
  describe("Admin Procedures", () => {
    it("should allow admin to access staff.list", async () => {
      const ctx = createContext("admin");
      const caller = appRouter.createCaller(ctx);

      const result = await caller.staff.list();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should deny manager from accessing staff.list", async () => {
      const ctx = createContext("manager");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.staff.list();
        expect.fail("Should have thrown FORBIDDEN error");
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError);
        expect((error as TRPCError<any>).code).toBe("FORBIDDEN");
      }
    });

    it("should deny field_engineer from accessing staff.list", async () => {
      const ctx = createContext("field_engineer");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.staff.list();
        expect.fail("Should have thrown FORBIDDEN error");
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError);
        expect((error as TRPCError<any>).code).toBe("FORBIDDEN");
      }
    });
  });

  describe("Manager Procedures", () => {
    it("should allow admin to access crm.clients.list", async () => {
      const ctx = createContext("admin");
      const caller = appRouter.createCaller(ctx);

      const result = await caller.crm.clients.list();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should allow manager to access crm.clients.list", async () => {
      const ctx = createContext("manager");
      const caller = appRouter.createCaller(ctx);

      const result = await caller.crm.clients.list();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should deny field_engineer from accessing crm.clients.list", async () => {
      const ctx = createContext("field_engineer");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.crm.clients.list();
        expect.fail("Should have thrown FORBIDDEN error");
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError);
        expect((error as TRPCError<any>).code).toBe("FORBIDDEN");
      }
    });
  });

  describe("Finance Procedures", () => {
    it("should allow admin to access finance.invoices.list", async () => {
      const ctx = createContext("admin");
      const caller = appRouter.createCaller(ctx);

      const result = await caller.finance.invoices.list();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should allow finance to access finance.invoices.list", async () => {
      const ctx = createContext("finance");
      const caller = appRouter.createCaller(ctx);

      const result = await caller.finance.invoices.list();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should deny field_engineer from accessing finance.invoices.list", async () => {
      const ctx = createContext("field_engineer");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.finance.invoices.list();
        expect.fail("Should have thrown FORBIDDEN error");
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError);
        expect((error as TRPCError<any>).code).toBe("FORBIDDEN");
      }
    });
  });

  describe("Protected Procedures", () => {
    it("should allow all authenticated users to access dashboard.getOverview", async () => {
      const roles = ["admin", "manager", "field_engineer", "finance"];

      for (const role of roles) {
        const ctx = createContext(role);
        const caller = appRouter.createCaller(ctx);

        const result = await caller.dashboard.getOverview();
        expect(result).toBeDefined();
        expect(result.totalClients).toBeDefined();
        expect(result.totalJobs).toBeDefined();
        expect(result.openJobs).toBeDefined();
        expect(result.inProgressJobs).toBeDefined();
        expect(result.engineersOnDuty).toBeDefined();
        expect(Array.isArray(result.recentActivity)).toBe(true);
      }
    });

    it("should deny unauthenticated users from accessing dashboard.getOverview", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.dashboard.getOverview();
        expect.fail("Should have thrown UNAUTHORIZED error");
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError);
        expect((error as TRPCError<any>).code).toBe("UNAUTHORIZED");
      }
    });
  });

  describe("Auth Routes", () => {
    it("should return current user for authenticated user", async () => {
      const ctx = createContext("admin");
      const caller = appRouter.createCaller(ctx);

      const user = await caller.auth.me();
      expect(user).toBeDefined();
      expect(user?.email).toBe("test@example.com");
      expect(user?.role).toBe("admin");
    });

    it("should return null for unauthenticated user", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const user = await caller.auth.me();
      expect(user).toBeNull();
    });

    it("should logout successfully", async () => {
      const ctx = createContext("admin");
      const caller = appRouter.createCaller(ctx);

      const result = await caller.auth.logout();
      expect(result.success).toBe(true);
      expect(ctx.res.clearCookie).toHaveBeenCalled();
    });
  });

  describe("Create Operations with Logging", () => {
    it("should allow manager to create client", async () => {
      const ctx = createContext("manager");
      const caller = appRouter.createCaller(ctx);

      const result = await caller.crm.clients.create({
        name: "Test Client",
        type: "business",
        location: "Accra",
        contactPerson: "John Doe",
        phone: "+233123456789",
        email: "client@example.com",
      });

      expect(result.success).toBe(true);
      expect(result.id).toBeDefined();
    });

    it("should allow manager to create job", async () => {
      const ctx = createContext("manager");
      const caller = appRouter.createCaller(ctx);

      const result = await caller.jobs.create({
        clientId: 1,
        issueType: "Computer Repair",
        priority: "high",
        description: "Laptop not turning on",
      });

      expect(result.success).toBe(true);
      expect(result.id).toBeDefined();
      expect(result.ticketId).toBeDefined();
    });
  });

  describe("Engineer Access", () => {
    it("should allow field_engineer to access engineers.getOnDuty", async () => {
      const ctx = createContext("field_engineer");
      const caller = appRouter.createCaller(ctx);

      const result = await caller.engineers.getOnDuty();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should allow admin to access engineers.getOnDuty", async () => {
      const ctx = createContext("admin");
      const caller = appRouter.createCaller(ctx);

      const result = await caller.engineers.getOnDuty();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
