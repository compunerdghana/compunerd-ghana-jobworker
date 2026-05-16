import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/Dashboard";
import ClientsList from "@/pages/CRM/ClientsList";
import CreateClientForm from "@/pages/CRM/CreateClientForm";
import ClientDetail from "@/pages/CRM/ClientDetail";
import JobsList from "@/pages/Jobs/JobsList";
import JobDetail from "@/pages/Jobs/JobDetail";
import DevicesList from "@/pages/Assets/DevicesList";
import DeviceDetail from "@/pages/Assets/DeviceDetail";
import InventoryList from "@/pages/Inventory/InventoryList";
import EngineersList from "@/pages/Engineers/EngineersList";
import EngineerDetail from "@/pages/Engineers/EngineerDetail";
import InvoicesList from "@/pages/Finance/InvoicesList";
import StaffList from "@/pages/Staff/StaffList";
import StaffDetail from "@/pages/Staff/StaffDetail";
import AddInventoryForm from "@/pages/Inventory/AddInventoryForm";
import CreateEngineerForm from "@/pages/Engineers/CreateEngineerForm";
import CreateInvoiceForm from "@/pages/Finance/CreateInvoiceForm";
import CreateStaffForm from "@/pages/Staff/CreateStaffForm";
import CreateJobForm from "@/pages/Jobs/CreateJobForm";
import FinancialReports from "@/pages/Finance/FinancialReports";
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
          <ProtectedRoute allowedRoles={[ROLES.MANAGER, ROLES.ADMIN]}>
            <ClientsList />
          </ProtectedRoute>
        </DashboardLayout>
      </Route>

      <Route path={"/crm/clients/create"}>
        <DashboardLayout>
          <ProtectedRoute allowedRoles={[ROLES.MANAGER, ROLES.ADMIN]}>
            <CreateClientForm />
          </ProtectedRoute>
        </DashboardLayout>
      </Route>

      <Route path={"/crm/clients/:id"}>
        <DashboardLayout>
          <ProtectedRoute allowedRoles={[ROLES.MANAGER, ROLES.ADMIN]}>
            <ClientDetail />
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

      <Route path={"/jobs/:id"}>
        <DashboardLayout>
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
            <JobDetail />
          </ProtectedRoute>
        </DashboardLayout>
      </Route>

      <Route path={"/jobs/create"}>
        <DashboardLayout>
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
            <CreateJobForm />
          </ProtectedRoute>
        </DashboardLayout>
      </Route>

      <Route path={"/devices"}>
        <DashboardLayout>
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
            <DevicesList />
          </ProtectedRoute>
        </DashboardLayout>
      </Route>

      <Route path={"/devices/:id"}>
        <DashboardLayout>
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
            <DeviceDetail />
          </ProtectedRoute>
        </DashboardLayout>
      </Route>

      <Route path={"/inventory"}>
        <DashboardLayout>
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
            <InventoryList />
          </ProtectedRoute>
        </DashboardLayout>
      </Route>

      <Route path={"/engineers"}>
        <DashboardLayout>
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.FIELD_ENGINEER]}>
            <EngineersList />
          </ProtectedRoute>
        </DashboardLayout>
      </Route>

      <Route path={"/engineers/:id"}>
        <DashboardLayout>
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.FIELD_ENGINEER]}>
            <EngineerDetail />
          </ProtectedRoute>
        </DashboardLayout>
      </Route>

      <Route path={"/engineers/create"}>
        <DashboardLayout>
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
            <CreateEngineerForm />
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
            <InvoicesList />
          </ProtectedRoute>
        </DashboardLayout>
      </Route>

      <Route path={"/finance/create"}>
        <DashboardLayout>
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.FINANCE]}>
            <CreateInvoiceForm />
          </ProtectedRoute>
        </DashboardLayout>
      </Route>

      <Route path={"/finance/reports"}>
        <DashboardLayout>
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.FINANCE]}>
            <FinancialReports />
          </ProtectedRoute>
        </DashboardLayout>
      </Route>

      <Route path={"/staff"}>
        <DashboardLayout>
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <StaffList />
          </ProtectedRoute>
        </DashboardLayout>
      </Route>

      <Route path={"/staff/:id"}>
        <DashboardLayout>
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <StaffDetail />
          </ProtectedRoute>
        </DashboardLayout>
      </Route>

      <Route path={"/staff/create"}>
        <DashboardLayout>
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <CreateStaffForm />
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
