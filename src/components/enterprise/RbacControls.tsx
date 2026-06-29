"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useEnterpriseRbac } from "@/components/enterprise/EnterpriseRbacContext";

export function EditableSection({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { canEdit } = useEnterpriseRbac();
  return (
    <fieldset disabled={!canEdit} className={className}>
      {children}
    </fieldset>
  );
}

export function AdminActionButton({
  children,
  className,
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { canEdit } = useEnterpriseRbac();
  return (
    <button
      type="button"
      {...props}
      disabled={!canEdit || disabled}
      className={`${className ?? ""} disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {children}
    </button>
  );
}
