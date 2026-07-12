"use client";

import { Button } from "@/components/ui";

type ExportButtonsProps = {
  onExportCsv: () => void;
};

export default function ExportButtons({ onExportCsv }: ExportButtonsProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button variant="secondary" onClick={onExportCsv} leftIcon={<CsvIcon />}>
        Export CSV
      </Button>
      <Button
        variant="secondary"
        onClick={() => alert("PDF export is a UI placeholder in this demo.")}
        leftIcon={<PdfIcon />}
      >
        Export PDF
      </Button>
    </div>
  );
}

function CsvIcon() {
  return (
    <svg className="h-4 w-4" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M12 3v10m0 0 4-4m-4 4-4-4M5 15v4h14v-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function PdfIcon() {
  return (
    <svg className="h-4 w-4" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="M14 2v6h6M9 13h6M9 17h4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}
