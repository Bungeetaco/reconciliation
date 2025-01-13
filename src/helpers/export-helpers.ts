import { GroupedData } from '../types';
import { generateHTML, generateCSV, generateExcel } from '../lib/license-utils';
import * as XLSX from 'xlsx';

export function exportToPDF(filteredAndSearchedData: GroupedData) {
  const html = generateHTML(filteredAndSearchedData, 'true', true);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
  
  iframe.onload = () => {
    iframe.contentWindow?.print();
    URL.revokeObjectURL(url);
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 100);
  };
  
  iframe.src = url;
}

export function exportToCSV(filteredAndSearchedData: GroupedData) {
  const csv = generateCSV(filteredAndSearchedData, 'St John Ambulance Canada');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `license_report.csv`;
  link.click();
}

export function exportToExcel(filteredAndSearchedData: GroupedData) {
  const workbook = generateExcel(filteredAndSearchedData, 'St John Ambulance Canada');
  XLSX.writeFile(workbook, `license_report.xlsx`);
}

export function exportToHTML(filteredAndSearchedData: GroupedData) {
  const html = generateHTML(filteredAndSearchedData, 'true');
  const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `license_report.html`;
  link.click();
}
