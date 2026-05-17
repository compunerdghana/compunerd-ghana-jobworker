import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { authRouter } from "./auth-router";
import {
  getAllClients,
  getAllJobs,
  getJobsByStatus,
  getAllDevices,
  getAllInventoryItems,
  getAllFieldEngineers,
  getEngineersOnDuty,
  getAllStaff,
  getAllInvoices,
  getRecentActivityLogs,
  logActivity,
} from "./db";

// ============ Role-based procedure helpers ============

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

const managerProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin" && ctx.user.role !== "manager") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Manager access required" });
  }
  return next({ ctx });
});

const financeProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin" && ctx.user.role !== "finance") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Finance access required" });
  }
  return next({ ctx });
});

const engineerProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "field_engineer" && ctx.user.role !== "admin" && ctx.user.role !== "manager") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Engineer access required" });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  auth: authRouter,

  // ============ Dashboard Routes ============
  dashboard: router({
    // Get dashboard overview data - accessible to all authenticated users
    getOverview: protectedProcedure.query(async () => {
      try {
        const clients = await getAllClients();
        const jobs = await getAllJobs();
        const openJobs = await getJobsByStatus("open");
        const inProgressJobs = await getJobsByStatus("in_progress");
        const engineers = await getEngineersOnDuty();
        const recentActivity = await getRecentActivityLogs(10);

        return {
          totalClients: clients.length,
          totalJobs: jobs.length,
          openJobs: openJobs.length,
          inProgressJobs: inProgressJobs.length,
          engineersOnDuty: engineers.length,
          recentActivity: recentActivity.map((activity) => ({
            id: activity.id,
            action: activity.action,
            entityType: activity.entityType,
            createdAt: activity.createdAt,
          })),
        };
      } catch (error) {
        console.error("Dashboard overview error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch dashboard overview",
        });
      }
    }),

    // Get financial summary - admin and finance only
    getFinancialSummary: financeProcedure.query(async () => {
      try {
        const invoices = await getAllInvoices();
        const totalRevenue = invoices
          .filter((inv) => inv.status === "paid")
          .reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
        const pendingAmount = invoices
          .filter((inv) => inv.status === "sent" || inv.status === "overdue")
          .reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);

        return {
          totalRevenue,
          pendingAmount,
          totalInvoices: invoices.length,
          paidInvoices: invoices.filter((inv) => inv.status === "paid").length,
        };
      } catch (error) {
        console.error("Financial summary error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch financial summary",
        });
      }
    }),
  }),

  // ============ CRM Routes (Placeholder) ============
  crm: router({
    clients: router({
      list: managerProcedure.query(async () => {
        try {
          return await getAllClients();
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch clients",
          });
        }
      }),

      create: managerProcedure
        .input(
          z.object({
            name: z.string().min(1),
            type: z.enum(["school", "business", "hotel", "pharmacy", "supermarket", "individual"]),
            location: z.string().optional(),
            contactPerson: z.string().optional(),
            phone: z.string().optional(),
            email: z.string().email().optional(),
          })
        )
        .mutation(async ({ input, ctx }) => {
          // Placeholder - will be implemented in Phase 4
          await logActivity(
            ctx.user.id,
            "Created new client",
            "client",
            undefined,
            `Client: ${input.name}`
          );
          return { success: true, id: 1 };
        }),
    }),
  }),

  // ============ Jobs Routes (Placeholder) ============
  jobs: router({
    list: managerProcedure.query(async () => {
      try {
        return await getAllJobs();
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch jobs",
        });
      }
    }),

    create: managerProcedure
      .input(
        z.object({
          clientId: z.number(),
          issueType: z.string(),
          priority: z.enum(["low", "medium", "high", "emergency"]),
          description: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        // Placeholder - will be implemented in Phase 4
        await logActivity(
          ctx.user.id,
          "Created new job",
          "job",
          undefined,
          `Issue: ${input.issueType}`
        );
        return { success: true, id: 1, ticketId: "JOB-001" };
      }),
  }),

  // ============ Devices Routes (Placeholder) ============
  devices: router({
    list: managerProcedure.query(async () => {
      try {
        return await getAllDevices();
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch devices",
        });
      }
    }),
  }),

  // ============ Inventory Routes (Placeholder) ============
  inventory: router({
    list: managerProcedure.query(async () => {
      try {
        return await getAllInventoryItems();
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch inventory items",
        });
      }
    }),
  }),

  // ============ Engineers Routes (Placeholder) ============
  engineers: router({
    list: managerProcedure.query(async () => {
      try {
        return await getAllFieldEngineers();
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch engineers",
        });
      }
    }),

    getOnDuty: protectedProcedure.query(async () => {
      try {
        return await getEngineersOnDuty();
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch engineers on duty",
        });
      }
    }),
  }),

  // ============ Finance Routes (Placeholder) ============
  finance: router({
    invoices: router({
      list: financeProcedure.query(async () => {
        try {
          return await getAllInvoices();
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch invoices",
          });
        }
      }),
    }),
  }),

  // ============ Staff Routes (Placeholder) ============
  staff: router({
    list: adminProcedure.query(async () => {
      try {
        return await getAllStaff();
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch staff",
        });
      }
    }),
  }),
});

export type AppRouter = typeof appRouter;
