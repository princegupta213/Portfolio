"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Building2, Shield } from "lucide-react";
import type { EnterpriseScenario, ProjectTheme } from "@/lib/project-themes";
import { getRbacPermissions, type EnterpriseRole } from "@/lib/enterprise/rbac";
import { RbacRoleToggle } from "@/components/enterprise/RbacRoleToggle";
import {
  EnterpriseRbacProvider,
  useEnterpriseRbac,
} from "@/components/enterprise/EnterpriseRbacContext";

export interface DemoMetric {
  label: string;
  value: string;
  sublabel?: string;
  warn?: boolean;
}

interface Props {
  theme: ProjectTheme;
  metrics?: DemoMetric[];
  scenarios?: EnterpriseScenario[];
  activeScenario?: string;
  onScenarioChange?: (id: string) => void;
  enterpriseBadge?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function ProjectDemoShell({
  theme,
  metrics,
  scenarios,
  activeScenario,
  onScenarioChange,
  enterpriseBadge = "Enterprise demo · audit-ready",
  children,
  footer,
}: Props) {
  const [role, setRole] = useState<EnterpriseRole>("admin");
  const permissions = useMemo(() => getRbacPermissions(role), [role]);
  const rbacValue = useMemo(
    () => ({ role, setRole, ...permissions }),
    [role, permissions]
  );
  const visibleMetrics = permissions.showMetrics ? metrics : undefined;

  const handleScenarioChange = (id: string) => {
    if (!permissions.canEdit) return;
    onScenarioChange?.(id);
  };

  return (
    <EnterpriseRbacProvider value={rbacValue}>
      <div className={`min-h-screen bg-gradient-to-b ${theme.heroGradient}`}>
        <div className="mx-auto max-w-6xl px-6 py-10">
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${theme.badge} ${theme.badgeText}`}
              >
                <Building2 className="h-3.5 w-3.5" />
                {theme.domain}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-zinc-600">
                <Shield className="h-3 w-3" />
                {enterpriseBadge}
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              {theme.headline}
            </h1>
            <p className="mt-3 max-w-3xl text-lg leading-relaxed text-zinc-600">
              {theme.description}
            </p>

            <RbacRoleToggle
              role={role}
              onRoleChange={setRole}
              accentClass={theme.accent}
            />

            {visibleMetrics && visibleMetrics.length > 0 && (
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {visibleMetrics.map((m) => (
                  <div
                    key={m.label}
                    className={`rounded-xl border p-4 ${
                      m.warn ? theme.statWarn : theme.statHighlight
                    }`}
                  >
                    <div className="text-[10px] font-semibold uppercase tracking-wide opacity-80">
                      {m.label}
                    </div>
                    <div className="mt-1 text-2xl font-bold">{m.value}</div>
                    {m.sublabel && (
                      <div className="mt-0.5 text-xs opacity-70">{m.sublabel}</div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {scenarios && scenarios.length > 0 && onScenarioChange && (
              <div className="mt-6">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Enterprise use cases
                  {!permissions.canEdit && (
                    <span className="ml-2 font-normal normal-case text-zinc-400">
                      (read-only)
                    </span>
                  )}
                </p>
                <div className="flex flex-wrap gap-2">
                  {scenarios.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      title={s.description}
                      disabled={!permissions.canEdit}
                      onClick={() => handleScenarioChange(s.id)}
                      className={`rounded-lg px-3 py-2 text-left text-sm transition ${
                        activeScenario === s.id
                          ? theme.tabActive
                          : "bg-white text-zinc-700 ring-1 ring-zinc-200 hover:bg-zinc-50"
                      } ${!permissions.canEdit ? "cursor-not-allowed opacity-60" : ""}`}
                    >
                      <span className="font-medium">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </header>

          {children}

          {footer && (
            <footer className="mt-10 border-t border-zinc-200/80 pt-6 text-center text-sm text-zinc-500">
              {footer}
            </footer>
          )}
        </div>
      </div>
    </EnterpriseRbacProvider>
  );
}

export function AuditLogPanel({
  entries,
  accentClass = "text-emerald-700",
}: {
  entries: { time: string; message: string }[];
  accentClass?: string;
}) {
  if (entries.length === 0) return null;
  return (
    <div className="rounded-xl border border-zinc-200 bg-white/80 p-4">
      <p className={`mb-3 text-xs font-semibold uppercase tracking-wide ${accentClass}`}>
        Audit log
      </p>
      <ul className="max-h-32 space-y-1.5 overflow-y-auto font-mono text-[11px] text-zinc-600">
        {entries.slice(-8).map((e, i) => (
          <li key={`${e.time}-${i}`}>
            <span className="text-zinc-400">{e.time}</span> {e.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function EnterpriseAuditLog({
  entries,
  accentClass = "text-emerald-700",
}: {
  entries: { time: string; message: string }[];
  accentClass?: string;
}) {
  const { showAuditLog } = useEnterpriseRbac();
  if (!showAuditLog) return null;
  return <AuditLogPanel entries={entries} accentClass={accentClass} />;
}

export { useEnterpriseRbac } from "@/components/enterprise/EnterpriseRbacContext";
