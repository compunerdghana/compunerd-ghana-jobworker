import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
  datetime,
  json,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow with role-based access control.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["admin", "manager", "field_engineer", "finance"]).default("field_engineer").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Clients table for CRM module
 */
export const clients = mysqlTable("clients", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["school", "business", "hotel", "pharmacy", "supermarket", "individual"]).notNull(),
  industry: varchar("industry", { length: 255 }),
  location: text("location"),
  contactPerson: varchar("contactPerson", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  whatsapp: varchar("whatsapp", { length: 20 }),
  email: varchar("email", { length: 320 }),
  status: mysqlEnum("status", ["lead", "active", "dormant"]).default("lead").notNull(),
  serviceAgreement: text("serviceAgreement"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Client = typeof clients.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;

/**
 * Jobs/Tickets table with workflow tracking
 */
export const jobs = mysqlTable("jobs", {
  id: int("id").autoincrement().primaryKey(),
  ticketId: varchar("ticketId", { length: 50 }).notNull().unique(),
  clientId: int("clientId").notNull(),
  issueType: varchar("issueType", { length: 255 }).notNull(),
  description: text("description"),
  priority: mysqlEnum("priority", ["low", "medium", "high", "emergency"]).default("medium").notNull(),
  status: mysqlEnum("status", ["open", "in_progress", "resolved", "closed"]).default("open").notNull(),
  assignedEngineerId: int("assignedEngineerId"),
  costEstimate: decimal("costEstimate", { precision: 10, scale: 2 }),
  finalCost: decimal("finalCost", { precision: 10, scale: 2 }),
  profit: decimal("profit", { precision: 10, scale: 2 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type Job = typeof jobs.$inferSelect;
export type InsertJob = typeof jobs.$inferInsert;

/**
 * Devices/Assets table
 */
export const devices = mysqlTable("devices", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["laptop", "router", "printer", "cctv", "server", "switch", "other"]).notNull(),
  serialNumber: varchar("serialNumber", { length: 255 }).unique(),
  model: varchar("model", { length: 255 }),
  condition: mysqlEnum("condition", ["excellent", "good", "fair", "poor"]).default("good").notNull(),
  purchasePrice: decimal("purchasePrice", { precision: 10, scale: 2 }),
  repairCost: decimal("repairCost", { precision: 10, scale: 2 }).default("0"),
  clientId: int("clientId"),
  warrantyExpiry: datetime("warrantyExpiry"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Device = typeof devices.$inferSelect;
export type InsertDevice = typeof devices.$inferInsert;

/**
 * Inventory/Stock items table
 */
export const inventoryItems = mysqlTable("inventoryItems", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 255 }),
  quantity: int("quantity").default(0).notNull(),
  purchasePrice: decimal("purchasePrice", { precision: 10, scale: 2 }),
  sellingPrice: decimal("sellingPrice", { precision: 10, scale: 2 }),
  supplier: varchar("supplier", { length: 255 }),
  reorderLevel: int("reorderLevel").default(5).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type InventoryItem = typeof inventoryItems.$inferSelect;
export type InsertInventoryItem = typeof inventoryItems.$inferInsert;

/**
 * Inventory transactions (stock in/out)
 */
export const inventoryTransactions = mysqlTable("inventoryTransactions", {
  id: int("id").autoincrement().primaryKey(),
  itemId: int("itemId").notNull(),
  type: mysqlEnum("type", ["in", "out", "damaged", "transfer"]).notNull(),
  quantity: int("quantity").notNull(),
  jobId: int("jobId"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type InventoryTransaction = typeof inventoryTransactions.$inferSelect;
export type InsertInventoryTransaction = typeof inventoryTransactions.$inferInsert;

/**
 * Field Engineers table
 */
export const fieldEngineers = mysqlTable("fieldEngineers", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  specialization: varchar("specialization", { length: 255 }),
  isOnDuty: boolean("isOnDuty").default(false).notNull(),
  lastCheckIn: timestamp("lastCheckIn"),
  lastCheckOut: timestamp("lastCheckOut"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FieldEngineer = typeof fieldEngineers.$inferSelect;
export type InsertFieldEngineer = typeof fieldEngineers.$inferInsert;

/**
 * Work log for field engineers
 */
export const workLogs = mysqlTable("workLogs", {
  id: int("id").autoincrement().primaryKey(),
  engineerId: int("engineerId").notNull(),
  jobId: int("jobId"),
  checkInTime: timestamp("checkInTime").defaultNow().notNull(),
  checkOutTime: timestamp("checkOutTime"),
  notes: text("notes"),
  location: text("location"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WorkLog = typeof workLogs.$inferSelect;
export type InsertWorkLog = typeof workLogs.$inferInsert;

/**
 * Financial records table
 */
export const financialRecords = mysqlTable("financialRecords", {
  id: int("id").autoincrement().primaryKey(),
  jobId: int("jobId"),
  type: mysqlEnum("type", ["revenue", "expense", "material", "labour", "transport"]).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type FinancialRecord = typeof financialRecords.$inferSelect;
export type InsertFinancialRecord = typeof financialRecords.$inferInsert;

/**
 * Invoices table
 */
export const invoices = mysqlTable("invoices", {
  id: int("id").autoincrement().primaryKey(),
  invoiceNumber: varchar("invoiceNumber", { length: 50 }).notNull().unique(),
  jobId: int("jobId"),
  clientId: int("clientId").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["draft", "sent", "paid", "overdue"]).default("draft").notNull(),
  dueDate: datetime("dueDate"),
  paidDate: datetime("paidDate"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = typeof invoices.$inferInsert;

/**
 * Staff/Employees table
 */
export const staff = mysqlTable("staff", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  role: mysqlEnum("role", ["engineer", "admin", "sales", "accountant", "manager"]).notNull(),
  phone: varchar("phone", { length: 20 }),
  salary: decimal("salary", { precision: 10, scale: 2 }),
  commission: decimal("commission", { precision: 10, scale: 2 }).default("0"),
  performanceScore: decimal("performanceScore", { precision: 3, scale: 1 }).default("0"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Staff = typeof staff.$inferSelect;
export type InsertStaff = typeof staff.$inferInsert;

/**
 * Payroll records
 */
export const payroll = mysqlTable("payroll", {
  id: int("id").autoincrement().primaryKey(),
  staffId: int("staffId").notNull(),
  month: varchar("month", { length: 7 }).notNull(), // YYYY-MM format
  baseSalary: decimal("baseSalary", { precision: 10, scale: 2 }).notNull(),
  commission: decimal("commission", { precision: 10, scale: 2 }).default("0"),
  bonuses: decimal("bonuses", { precision: 10, scale: 2 }).default("0"),
  deductions: decimal("deductions", { precision: 10, scale: 2 }).default("0"),
  netPay: decimal("netPay", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["pending", "processed", "paid"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Payroll = typeof payroll.$inferSelect;
export type InsertPayroll = typeof payroll.$inferInsert;

/**
 * Activity logs for audit trail
 */
export const activityLogs = mysqlTable("activityLogs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  action: varchar("action", { length: 255 }).notNull(),
  entityType: varchar("entityType", { length: 100 }),
  entityId: int("entityId"),
  details: text("details"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = typeof activityLogs.$inferInsert;

/**
 * Job notes/comments
 */
export const jobNotes = mysqlTable("jobNotes", {
  id: int("id").autoincrement().primaryKey(),
  jobId: int("jobId").notNull(),
  userId: int("userId").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type JobNote = typeof jobNotes.$inferSelect;
export type InsertJobNote = typeof jobNotes.$inferInsert;
