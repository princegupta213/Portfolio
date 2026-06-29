import type { ColumnDef, ReportRow } from "./types";

export const AVAILABLE_COLUMNS: ColumnDef[] = [
  { id: "date", label: "Date", table: "Orders" },
  { id: "user", label: "User", table: "Users" },
  { id: "revenue", label: "Revenue", table: "Orders" },
  { id: "conversion", label: "Conversion %", table: "Analytics" },
  { id: "region", label: "Region", table: "Users" },
];

export const SAMPLE_ROWS: ReportRow[] = [
  { date: "2026-06-01", user: "Acme Corp", revenue: 12400, conversion: 3.2, region: "NA" },
  { date: "2026-06-02", user: "Globex Ltd", revenue: 8900, conversion: 2.8, region: "EU" },
  { date: "2026-06-03", user: "Initech", revenue: 15200, conversion: 4.1, region: "NA" },
  { date: "2026-06-04", user: "Umbrella Co", revenue: 6700, conversion: 2.1, region: "APAC" },
  { date: "2026-06-05", user: "Stark Industries", revenue: 22100, conversion: 5.4, region: "NA" },
  { date: "2026-06-06", user: "Wayne Ent.", revenue: 11300, conversion: 3.6, region: "EU" },
];

export function filterRows(rows: ReportRow[], columnIds: string[]): Record<string, string | number>[] {
  return rows.map((row) => {
    const out: Record<string, string | number> = {};
    for (const col of columnIds) {
      out[col] = row[col as keyof ReportRow];
    }
    return out;
  });
}

export function toCSVPreview(rows: Record<string, string | number>[], columns: ColumnDef[]): string {
  const cols = columns.filter((c) => rows[0] && c.id in rows[0]);
  const header = cols.map((c) => c.label).join(",");
  const body = rows.map((r) => cols.map((c) => r[c.id]).join(",")).join("\n");
  return `${header}\n${body}`;
}

export const PREVIEW_TARGET_MS = 150;
