import { GroupedData } from '../types';
import { generateHTML, generateCSV, generateExcel } from '../lib/license-utils';
import * as XLSX from 'xlsx';

function showProgressIndicator() {
  const progressIndicator = document.createElement('div');
  progressIndicator.id = 'progress-indicator';
  progressIndicator.innerText = 'Exporting...';
  document.body.appendChild(progressIndicator);
}

function hideProgressIndicator() {
  const progressIndicator = document.getElementById('progress-indicator');
  if (progressIndicator) {
    document.body.removeChild(progressIndicator);
  }
}

export function exportToPDF(filteredAndSearchedData: GroupedData) {
  try {
    showProgressIndicator();
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
        hideProgressIndicator();
      }, 100);
    };
    
    iframe.src = url;
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    hideProgressIndicator();
  }
}

export function exportToCSV(filteredAndSearchedData: GroupedData) {
  try {
    showProgressIndicator();
    const csv = generateCSV(filteredAndSearchedData, 'St John Ambulance Canada');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `license_report.csv`;
    link.click();
    hideProgressIndicator();
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    hideProgressIndicator();
  }
}

export function exportToExcel(filteredAndSearchedData: GroupedData) {
  try {
    showProgressIndicator();
    const workbook = generateExcel(filteredAndSearchedData, 'St John Ambulance Canada');
    XLSX.writeFile(workbook, `license_report.xlsx`);
    hideProgressIndicator();
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    hideProgressIndicator();
  }
}

export function exportToHTML(filteredAndSearchedData: GroupedData) {
  try {
    showProgressIndicator();
    const html = generateHTML(filteredAndSearchedData, 'true');
    const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `license_report.html`;
    link.click();
    hideProgressIndicator();
  } catch (error) {
    console.error('Error exporting to HTML:', error);
    hideProgressIndicator();
  }
}
