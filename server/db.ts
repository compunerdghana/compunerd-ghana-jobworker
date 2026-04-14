import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  clients,
  jobs,
  devices,
  inventoryItems,
  fieldEngineers,
  staff,
  activityLogs,
  invoices,
  financialRecords,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ CRM Queries ============

export async function getAllClients() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(clients).orderBy(desc(clients.createdAt));
}

export async function getClientById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

// ============ Job Queries ============

export async function getAllJobs() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(jobs).orderBy(desc(jobs.createdAt));
}

export async function getJobById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getJobsByStatus(status: "open" | "in_progress" | "resolved" | "closed") {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(jobs).where(eq(jobs.status, status));
}

export async function getJobsByEngineer(engineerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(jobs).where(eq(jobs.assignedEngineerId, engineerId));
}

// ============ Device Queries ============

export async function getAllDevices() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(devices).orderBy(desc(devices.createdAt));
}

export async function getDeviceById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(devices).where(eq(devices.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getDevicesByClient(clientId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(devices).where(eq(devices.clientId, clientId));
}

// ============ Inventory Queries ============

export async function getAllInventoryItems() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(inventoryItems).orderBy(desc(inventoryItems.createdAt));
}

export async function getInventoryItemById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select()
    .from(inventoryItems)
    .where(eq(inventoryItems.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getLowStockItems() {
  const db = await getDb();
  if (!db) return [];
  // Get items where quantity is at or below reorder level
  const allItems = await db.select().from(inventoryItems);
  return allItems.filter((item) => item.quantity <= item.reorderLevel);
}

// ============ Field Engineer Queries ============

export async function getAllFieldEngineers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(fieldEngineers).orderBy(desc(fieldEngineers.createdAt));
}

export async function getFieldEngineerById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select()
    .from(fieldEngineers)
    .where(eq(fieldEngineers.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getFieldEngineerByUserId(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select()
    .from(fieldEngineers)
    .where(eq(fieldEngineers.userId, userId))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getEngineersOnDuty() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(fieldEngineers).where(eq(fieldEngineers.isOnDuty, true));
}

// ============ Staff Queries ============

export async function getAllStaff() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(staff).orderBy(desc(staff.createdAt));
}

export async function getStaffById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(staff).where(eq(staff.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getStaffByUserId(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(staff).where(eq(staff.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

// ============ Financial Queries ============

export async function getFinancialRecordsByJob(jobId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(financialRecords).where(eq(financialRecords.jobId, jobId));
}

export async function getAllInvoices() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(invoices).orderBy(desc(invoices.createdAt));
}

export async function getInvoiceById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(invoices).where(eq(invoices.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

// ============ Activity Log Queries ============

export async function getRecentActivityLogs(limit: number = 20) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(activityLogs)
    .orderBy(desc(activityLogs.createdAt))
    .limit(limit);
}

export async function logActivity(
  userId: number | undefined,
  action: string,
  entityType: string | undefined,
  entityId: number | undefined,
  details: string | undefined
) {
  const db = await getDb();
  if (!db) return;

  try {
    await db.insert(activityLogs).values({
      userId,
      action,
      entityType,
      entityId,
      details,
    });
  } catch (error) {
    console.error("[Database] Failed to log activity:", error);
  }
}
