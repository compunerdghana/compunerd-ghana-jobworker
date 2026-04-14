import { useRoleProtection } from "@/hooks/useRoleProtection";
import { type Role } from "@shared/const";
import NotFound from "@/pages/NotFound";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: Role[];
}

/**
 * Wrapper component to protect routes based on user role
 * Shows 404 if user doesn't have required role
 */
export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthorized, loading } = useRoleProtection(allowedRoles);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return <NotFound />;
  }

  return <>{children}</>;
}
