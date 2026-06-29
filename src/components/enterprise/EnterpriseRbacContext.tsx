"use client";

import { createContext, useContext } from "react";
import type { EnterpriseRole, RbacPermissions } from "@/lib/enterprise/rbac";

export type EnterpriseRbacContextValue = RbacPermissions & {
  setRole: (role: EnterpriseRole) => void;
};

const EnterpriseRbacContext = createContext<EnterpriseRbacContextValue | null>(null);

export function EnterpriseRbacProvider({
  value,
  children,
}: {
  value: EnterpriseRbacContextValue;
  children: React.ReactNode;
}) {
  return (
    <EnterpriseRbacContext.Provider value={value}>
      {children}
    </EnterpriseRbacContext.Provider>
  );
}

export function useEnterpriseRbac(): EnterpriseRbacContextValue {
  const ctx = useContext(EnterpriseRbacContext);
  if (!ctx) {
    throw new Error("useEnterpriseRbac must be used within ProjectDemoShell");
  }
  return ctx;
}
