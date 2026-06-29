export type ExportFormat = "pdf" | "csv" | "json";
export type StyleTheme = "classic" | "modern" | "high-contrast";

export interface ColumnDef {
  id: string;
  label: string;
  table: string;
}

export interface ExportConfig {
  selectedColumns: string[];
  format: ExportFormat;
  theme: StyleTheme;
}

export interface ReportRow {
  date: string;
  user: string;
  revenue: number;
  conversion: number;
  region: string;
}
