"use client";

import { ShieldCheck } from "lucide-react";
import {
  ENTERPRISE_ROLES,
  type EnterpriseRole,
} from "@/lib/enterprise/rbac";

interface Props {
  role: EnterpriseRole;
  onRoleChange: (role: EnterpriseRole) => void;
  accentClass?: string;
}

export function RbacRoleToggle({
  role,
  onRoleChange,
  accentClass = "text-zinc-700",
}: Props) {
  return (
    <div className="mt-4 rounded-xl border border-zinc-200 bg-white/90 p-3">
      <div className="mb-2 flex items-center gap-1.5">
        <ShieldCheck className={`h-3.5 w-3.5 ${accentClass}`} />
        <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
          RBAC role preview
        </p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {ENTERPRISE_ROLES.map((r) => (
          <button
            key={r.id}
            type="button"
            title={r.description}
            onClick={() => onRoleChange(r.id)}
            className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
              role === r.id
                ? "bg-zinc-900 text-white shadow-sm"
                : "bg-zinc-50 text-zinc-600 ring-1 ring-zinc-200 hover:bg-zinc-100"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-zinc-500">
        {ENTERPRISE_ROLES.find((r) => r.id === role)?.description}
      </p>
    </div>
  );
}
