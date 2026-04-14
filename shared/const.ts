/**
 * Shared constants for CompuNerd Ghana Job Worker application
 */

// Application branding
export const APP_NAME = "CompuNerd Ghana Job Worker";
export const COMPANY_NAME = "CompuNerd Ghana";
export const APP_TAGLINE = "Once Fixed, Forever Fixed";
export const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663554215079/CkSDd5opEBHhbujUNDGo66/compunerd-ghana-logo_10e375a0.png";

// Session & timing
export const COOKIE_NAME = "app_session_id";
export const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;
export const AXIOS_TIMEOUT_MS = 30_000;
export const UNAUTHED_ERR_MSG = 'Please login (10001)';
export const NOT_ADMIN_ERR_MSG = 'You do not have required permission (10002)';

// User roles
export const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  FIELD_ENGINEER: "field_engineer",
  FINANCE: "finance",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

// Job status workflow
export const JOB_STATUS = {
  OPEN: "open",
  IN_PROGRESS: "in_progress",
  RESOLVED: "resolved",
  CLOSED: "closed",
} as const;

export type JobStatus = (typeof JOB_STATUS)[keyof typeof JOB_STATUS];

export const JOB_STATUS_SEQUENCE = [
  JOB_STATUS.OPEN,
  JOB_STATUS.IN_PROGRESS,
  JOB_STATUS.RESOLVED,
  JOB_STATUS.CLOSED,
] as const;

// Job priority levels
export const JOB_PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  EMERGENCY: "emergency",
} as const;

export type JobPriority = (typeof JOB_PRIORITY)[keyof typeof JOB_PRIORITY];

// Client types
export const CLIENT_TYPES = {
  SCHOOL: "school",
  BUSINESS: "business",
  HOTEL: "hotel",
  PHARMACY: "pharmacy",
  SUPERMARKET: "supermarket",
  INDIVIDUAL: "individual",
} as const;

export type ClientType = (typeof CLIENT_TYPES)[keyof typeof CLIENT_TYPES];

// Device types
export const DEVICE_TYPES = {
  LAPTOP: "laptop",
  ROUTER: "router",
  PRINTER: "printer",
  CCTV: "cctv",
  SERVER: "server",
  SWITCH: "switch",
  OTHER: "other",
} as const;

export type DeviceType = (typeof DEVICE_TYPES)[keyof typeof DEVICE_TYPES];

// Service types
export const SERVICE_TYPES = {
  NETWORKING: "networking_setup",
  COMPUTER_REPAIR: "computer_repair",
  CCTV: "cctv_installation",
  GRAPHICS_DESIGN: "graphics_design",
  WEB_DEVELOPMENT: "web_development",
  IT_SUPPORT: "it_support_contract",
} as const;

export type ServiceType = (typeof SERVICE_TYPES)[keyof typeof SERVICE_TYPES];

// Navigation menu items by role
export const ROLE_MENU_ITEMS: Record<string, Array<{ label: string; path: string; icon: string }>> = {
  [ROLES.ADMIN]: [
    { label: "Dashboard", path: "/dashboard", icon: "LayoutDashboard" },
    { label: "Clients", path: "/crm/clients", icon: "Users" },
    { label: "Jobs", path: "/jobs", icon: "CheckSquare" },
    { label: "Devices", path: "/devices", icon: "Cpu" },
    { label: "Inventory", path: "/inventory", icon: "Package" },
    { label: "Engineers", path: "/engineers", icon: "Wrench" },
    { label: "Finance", path: "/finance", icon: "DollarSign" },
    { label: "Staff", path: "/staff", icon: "Users" },
    { label: "Settings", path: "/settings", icon: "Settings" },
  ],
  [ROLES.MANAGER]: [
    { label: "Dashboard", path: "/dashboard", icon: "LayoutDashboard" },
    { label: "Clients", path: "/crm/clients", icon: "Users" },
    { label: "Jobs", path: "/jobs", icon: "CheckSquare" },
    { label: "Devices", path: "/devices", icon: "Cpu" },
    { label: "Inventory", path: "/inventory", icon: "Package" },
    { label: "Engineers", path: "/engineers", icon: "Wrench" },
    { label: "Finance", path: "/finance", icon: "DollarSign" },
  ],
  [ROLES.FIELD_ENGINEER]: [
    { label: "Dashboard", path: "/dashboard", icon: "LayoutDashboard" },
    { label: "My Jobs", path: "/engineer/jobs", icon: "CheckSquare" },
    { label: "Work Log", path: "/engineer/worklog", icon: "Clock" },
  ],
  [ROLES.FINANCE]: [
    { label: "Dashboard", path: "/dashboard", icon: "LayoutDashboard" },
    { label: "Finance", path: "/finance", icon: "DollarSign" },
    { label: "Invoices", path: "/finance/invoices", icon: "FileText" },
    { label: "Reports", path: "/finance/reports", icon: "BarChart3" },
  ],
};
