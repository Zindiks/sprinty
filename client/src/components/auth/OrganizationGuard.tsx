import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useStore } from "@/hooks/store/useStore";

/**
 * OrganizationGuard - Organization Selection Guard Component
 *
 * Ensures user has selected an organization before accessing org-dependent routes.
 * If no organization is selected, redirects to /organizations page.
 * Checks both Zustand store and localStorage for organization_id.
 */
export const OrganizationGuard = () => {
  const navigate = useNavigate();
  const organization_id = useStore((state) => state.organization_id);

  useEffect(() => {
    // Check both Zustand and localStorage
    const storedOrgId = localStorage.getItem("organization_id");

    if (!organization_id && !storedOrgId) {
      // No organization selected, redirect to organization selection page
      navigate("/organizations", { replace: true });
    }
  }, [organization_id, navigate]);

  // If no org selected, don't render children (will redirect)
  const storedOrgId = localStorage.getItem("organization_id");
  if (!organization_id && !storedOrgId) {
    return null;
  }

  // Organization is selected, render child routes
  return <Outlet />;
};
