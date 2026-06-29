import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(root, "../node_modules/pdfjs-dist/build/pdf.worker.min.mjs");
const dest = path.join(root, "../public/pdf.worker.min.mjs");

if (!fs.existsSync(src)) {
  console.warn("pdfjs-dist worker not found — skip copy");
  process.exit(0);
}

fs.copyFileSync(src, dest);
console.log("Copied pdf.worker.min.mjs to public/");
