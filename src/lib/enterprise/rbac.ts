export type EnterpriseRole = "admin" | "ops" | "analyst" | "viewer";

export const ENTERPRISE_ROLES: {
  id: EnterpriseRole;
  label: string;
  description: string;
}[] = [
  { id: "admin", label: "Admin", description: "Full controls and configuration" },
  { id: "ops", label: "Ops", description: "Audit logs and operational visibility" },
  { id: "analyst", label: "Analyst", description: "Metrics and KPI dashboards" },
  { id: "viewer", label: "Viewer", description: "Read-only demo access" },
];

export interface RbacPermissions {
  role: EnterpriseRole;
  canEdit: boolean;
  showAuditLog: boolean;
  showMetrics: boolean;
}

export function getRbacPermissions(role: EnterpriseRole): Omit<RbacPermissions, "role"> {
  return {
    canEdit: role === "admin",
    showAuditLog: role === "admin" || role === "ops",
    showMetrics: role === "admin" || role === "analyst",
  };
}
