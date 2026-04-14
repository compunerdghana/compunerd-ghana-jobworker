import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { trpc } from "@/lib/trpc";
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  Cpu,
  Package,
  Wrench,
  DollarSign,
  Settings,
  LogOut,
  Menu,
  X,
  Clock,
  FileText,
  BarChart3,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { LOGO_URL, ROLES, ROLE_MENU_ITEMS } from "@shared/const";
import { DashboardLayoutSkeleton } from './DashboardLayoutSkeleton';

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  CheckSquare: <CheckSquare className="w-5 h-5" />,
  Cpu: <Cpu className="w-5 h-5" />,
  Package: <Package className="w-5 h-5" />,
  Wrench: <Wrench className="w-5 h-5" />,
  DollarSign: <DollarSign className="w-5 h-5" />,
  Settings: <Settings className="w-5 h-5" />,
  Clock: <Clock className="w-5 h-5" />,
  FileText: <FileText className="w-5 h-5" />,
  BarChart3: <BarChart3 className="w-5 h-5" />,
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [location] = useLocation();
  const logoutMutation = trpc.auth.logout.useMutation();

  if (loading) {
    return <DashboardLayoutSkeleton />;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <img src={LOGO_URL} alt="CompuNerd Ghana" className="h-24 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-foreground mb-2">CompuNerd Ghana</h1>
          <p className="text-muted-foreground mb-8">Job Worker Management System</p>
          <Button asChild size="lg">
            <a href={getLoginUrl()}>Sign In</a>
          </Button>
        </div>
      </div>
    );
  }

  const userRole = (user.role || ROLES.FIELD_ENGINEER) as keyof typeof ROLES;
  const menuItems = ROLE_MENU_ITEMS[userRole] || [];

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    logout();
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } border-r border-border bg-card shadow-sm transition-all duration-300 flex flex-col`}
      >
        {/* Logo Section */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          {sidebarOpen && (
            <Link href="/dashboard">
              <a className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <img src={LOGO_URL} alt="CompuNerd" className="h-8 w-8" />
                <span className="font-bold text-sm text-primary hidden lg:inline">CompuNerd</span>
              </a>
            </Link>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-muted rounded-md transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <a
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  }`}
                  title={item.label}
                >
                  {iconMap[item.icon]}
                  {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                </a>
              </Link>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                {sidebarOpen && (
                  <div className="text-left flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.name || "User"}</p>
                    <p className="text-xs text-muted-foreground capitalize">{userRole.replace(/_/g, " ")}</p>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <a className="flex items-center gap-2 cursor-pointer">
                    <Settings className="w-4 h-4" />
                    Settings
                  </a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-16 border-b border-border bg-card shadow-sm flex items-center px-6">
          <div className="flex items-center justify-between w-full">
            <h1 className="text-xl font-bold text-foreground">CompuNerd Ghana Job Worker</h1>
            <div className="text-sm text-muted-foreground">
              Welcome, <span className="font-medium text-foreground">{user.name}</span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </div>
      </main>
    </div>
  );
}
