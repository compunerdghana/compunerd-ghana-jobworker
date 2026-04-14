import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/Dashboard";
import ClientsList from "@/pages/CRM/ClientsList";
import JobsList from "@/pages/Jobs/JobsList";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ROLES } from "@shared/const";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

function Router() {
  return (
    <Switch>
      {/* Dashboard routes - wrapped in DashboardLayout */}
      <Route path={"/dashboard"}>
        <DashboardLayout>
          <Dashboard />
        </DashboardLayout>
      </Route>
      
      {/* Default route redirects to dashboard */}
      <Route path={"/"}>
        <DashboardLayout>
          <Dashboard />
        </DashboardLayout>
      </Route>

      {/* Placeholder routes for future modules */}
      <Route path={"/crm/clients"}>
        <DashboardLayout>
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
            <ClientsList />
          </ProtectedRoute>
        </DashboardLayout>
      </Route>

      <Route path={"/jobs"}>
        <DashboardLayout>
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
            <JobsList />
          </ProtectedRoute>
        </DashboardLayout>
      </Route>

      <Route path={"/devices"}>
        <DashboardLayout>
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold mb-2">Device & Asset Management</h1>
              <p className="text-muted-foreground">Coming soon...</p>
            </div>
          </ProtectedRoute>
        </DashboardLayout>
      </Route>

      <Route path={"/inventory"}>
        <DashboardLayout>
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold mb-2">Inventory & Warehouse</h1>
              <p className="text-muted-foreground">Coming soon...</p>
            </div>
          </ProtectedRoute>
        </DashboardLayout>
      </Route>

      <Route path={"/engineers"}>
        <DashboardLayout>
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold mb-2">Field Engineers</h1>
              <p className="text-muted-foreground">Coming soon...</p>
            </div>
          </ProtectedRoute>
        </DashboardLayout>
      </Route>

      <Route path={"/engineer/jobs"}>
        <DashboardLayout>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-2">My Jobs</h1>
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        </DashboardLayout>
      </Route>

      <Route path={"/engineer/worklog"}>
        <DashboardLayout>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-2">Work Log</h1>
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        </DashboardLayout>
      </Route>

      <Route path={"/finance"}>
        <DashboardLayout>
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.FINANCE]}>
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold mb-2">Finance & Accounting</h1>
              <p className="text-muted-foreground">Coming soon...</p>
            </div>
          </ProtectedRoute>
        </DashboardLayout>
      </Route>

      <Route path={"/finance/invoices"}>
        <DashboardLayout>
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.FINANCE]}>
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold mb-2">Invoices</h1>
              <p className="text-muted-foreground">Coming soon...</p>
            </div>
          </ProtectedRoute>
        </DashboardLayout>
      </Route>

      <Route path={"/finance/reports"}>
        <DashboardLayout>
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.FINANCE]}>
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold mb-2">Financial Reports</h1>
              <p className="text-muted-foreground">Coming soon...</p>
            </div>
          </ProtectedRoute>
        </DashboardLayout>
      </Route>

      <Route path={"/staff"}>
        <DashboardLayout>
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold mb-2">Staff Management</h1>
              <p className="text-muted-foreground">Coming soon...</p>
            </div>
          </ProtectedRoute>
        </DashboardLayout>
      </Route>

      <Route path={"/settings"}>
        <DashboardLayout>
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold mb-2">Settings</h1>
              <p className="text-muted-foreground">Coming soon...</p>
            </div>
          </ProtectedRoute>
        </DashboardLayout>
      </Route>

      {/* 404 */}
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
