import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { ROLES, type Role } from "@shared/const";

/**
 * Hook to protect routes based on user role
 * Redirects to dashboard if user doesn't have required role
 */
export function useRoleProtection(allowedRoles: Role[]) {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      setLocation("/");
      return;
    }

    const userRole = (user.role || ROLES.FIELD_ENGINEER) as Role;
    if (!allowedRoles.includes(userRole)) {
      setLocation("/dashboard");
    }
  }, [user, loading, allowedRoles, setLocation]);

  return { user, loading, isAuthorized: user && allowedRoles.includes((user.role || ROLES.FIELD_ENGINEER) as Role) };
}

/**
 * Check if user has a specific role
 */
export function useHasRole(role: Role): boolean {
  const { user } = useAuth();
  return user?.role === role;
}

/**
 * Check if user has any of the specified roles
 */
export function useHasAnyRole(roles: Role[]): boolean {
  const { user } = useAuth();
  return user ? roles.includes((user.role || ROLES.FIELD_ENGINEER) as Role) : false;
}

/**
 * Check if user is admin
 */
export function useIsAdmin(): boolean {
  return useHasRole(ROLES.ADMIN);
}

/**
 * Check if user is manager or admin
 */
export function useIsManager(): boolean {
  return useHasAnyRole(["admin" as Role, "manager" as Role]);
}

/**
 * Check if user is finance or admin
 */
export function useIsFinance(): boolean {
  return useHasAnyRole(["admin" as Role, "finance" as Role]);
}

/**
 * Check if user is field engineer
 */
export function useIsEngineer(): boolean {
  return useHasRole("field_engineer" as Role);
}
