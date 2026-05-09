import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function escapeCell(value) {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

export function exportToCSV(data, filename = "raport.csv") {
  if (!data.length) {
    return;
  }

  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers.map((header) => JSON.stringify(escapeCell(row[header]))).join(","),
  );

  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

export function exportToPDF(data, title = "Raport") {
  if (!data.length) {
    return;
  }

  const doc = new jsPDF({ orientation: "landscape" });
  const headers = Object.keys(data[0]);
  const body = data.map((row) => headers.map((header) => escapeCell(row[header])));

  doc.setFontSize(16);
  doc.text(title, 14, 15);

  autoTable(doc, {
    startY: 24,
    head: [headers],
    body,
    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: [169, 17, 17],
    },
  });

  doc.save(`${title}.pdf`);
}
