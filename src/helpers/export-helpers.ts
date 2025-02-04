import { GroupedData } from '../types';
import { generateHTML, generateCSV } from '../lib/license-utils';
import { Workbook } from 'exceljs';
import DOMPurify from 'dompurify';
import { SKU_PRICING } from '../lib/license-types';

export class ExportError extends Error {
  constructor(
    public readonly format: string,
    public readonly details: unknown,
    public readonly code: string = 'EXPORT_ERROR'
  ) {
    super(`Failed to export to ${format}: ${details}`);
    this.name = 'ExportError';
  }
}

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

function cleanupResources(url?: string, iframe?: HTMLIFrameElement) {
  if (url) URL.revokeObjectURL(url);
  if (iframe && iframe.parentNode) {
    iframe.parentNode.removeChild(iframe);
  }
  hideProgressIndicator();
}

export async function exportToPDF(filteredAndSearchedData: GroupedData) {
  let url: string | undefined;
  let iframe: HTMLIFrameElement | undefined;
  
  try {
    showProgressIndicator();
    const html = DOMPurify.sanitize(generateHTML(filteredAndSearchedData, 'true', true));
    const blob = new Blob([html], { type: 'text/html' });
    url = URL.createObjectURL(blob);
    
    iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    await new Promise<void>((resolve, reject) => {
      if (!iframe) return reject(new Error('iframe not created'));
      if (!url) return reject(new Error('URL not created'));
      
      iframe.onload = () => {
        try {
          if (!iframe?.contentWindow) {
            throw new Error('iframe contentWindow not available');
          }
          iframe.contentWindow.print();
          setTimeout(() => {
            cleanupResources(url, iframe);
            resolve();
          }, 100);
        } catch (error) {
          reject(new ExportError('PDF', error));
        }
      };
      
      iframe.onerror = (error) => {
        reject(new ExportError('PDF', error));
      };
      
      iframe.src = url;
    });
  } catch (error) {
    cleanupResources(url, iframe);
    throw new ExportError('PDF', error instanceof Error ? error : new Error(String(error)));
  }
}

export function exportToCSV(filteredAndSearchedData: GroupedData) {
  let url: string | undefined;
  
  try {
    showProgressIndicator();
    const csv = generateCSV(filteredAndSearchedData, 'St John Ambulance Canada');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `license_report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  } catch (error) {
    throw new ExportError('CSV', error);
  } finally {
    if (url) URL.revokeObjectURL(url);
    hideProgressIndicator();
  }
}

export async function exportToExcel(filteredAndSearchedData: GroupedData) {
  try {
    showProgressIndicator();
    const workbook = new Workbook();
    workbook.creator = 'SJA License Mapping Tool';
    workbook.lastModifiedBy = 'SJA License Mapping Tool';
    workbook.created = new Date();
    workbook.modified = new Date();

    // Create Summary Sheet
    const summarySheet = workbook.addWorksheet('Summary');
    summarySheet.columns = [
      { header: 'Department', key: 'department', width: 20 },
      { header: 'Total Users', key: 'users', width: 15 },
      { header: 'Monthly Cost', key: 'monthly', width: 15, style: { numFmt: '"$"#,##0.00' } },
      { header: 'Annual Cost', key: 'annual', width: 15, style: { numFmt: '"$"#,##0.00' } }
    ];

    // Add department summaries
    Object.entries(filteredAndSearchedData).forEach(([dept, users]) => {
      const monthlyCost = users.reduce((sum, user) => 
        sum + user.licenses.reduce((acc, license) => 
          acc + (SKU_PRICING[license.guid]?.monthlyPrice || 0), 0), 0);
      const annualCost = users.reduce((sum, user) => 
        sum + user.licenses.reduce((acc, license) => 
          acc + (SKU_PRICING[license.guid]?.annualPrice || 0), 0), 0);

      summarySheet.addRow({
        department: dept,
        users: users.length,
        monthly: monthlyCost,
        annual: annualCost
      });
    });

    // Style the header row
    const headerRow = summarySheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE6F0FF' }
    };

    // Add department sheets
    Object.entries(filteredAndSearchedData).forEach(([dept, users]) => {
      const sheet = workbook.addWorksheet(dept.slice(0, 31)); // Excel sheet names limited to 31 chars
      
      // Set up columns
      sheet.columns = [
        { header: 'Display Name', key: 'name', width: 25 },
        { header: 'Email', key: 'email', width: 35 },
        { header: 'Monthly Cost', key: 'monthly', width: 15, style: { numFmt: '"$"#,##0.00' } },
        { header: 'Annual Cost', key: 'annual', width: 15, style: { numFmt: '"$"#,##0.00' } },
        ...Array.from(new Set(users.flatMap(u => u.licenses.map(l => l.productName))))
          .map(license => ({ header: license, key: license, width: 15 }))
      ];

      // Add data rows
      users.forEach(user => {
        const row: any = {
          name: user.displayName,
          email: user.userPrincipalName,
          monthly: user.licenses.reduce((sum, license) => 
            sum + (SKU_PRICING[license.guid]?.monthlyPrice || 0), 0),
          annual: user.licenses.reduce((sum, license) => 
            sum + (SKU_PRICING[license.guid]?.annualPrice || 0), 0)
        };

        // Add license columns
        user.licenses.forEach(license => {
          row[license.productName] = 'X';
        });

        sheet.addRow(row);
      });

      // Style the header row
      const headerRow = sheet.getRow(1);
      headerRow.font = { bold: true };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE6F0FF' }
      };
    });

    // Generate file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `license_report_${new Date().toISOString().split('T')[0]}.xlsx`;
    link.click();
    
    URL.revokeObjectURL(url);
  } catch (error) {
    throw new ExportError('Excel', error);
  } finally {
    hideProgressIndicator();
  }
}

export function exportToHTML(filteredAndSearchedData: GroupedData) {
  let url: string | undefined;
  
  try {
    showProgressIndicator();
    const html = DOMPurify.sanitize(generateHTML(filteredAndSearchedData, 'true'));
    const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
    url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `license_report_${new Date().toISOString().split('T')[0]}.html`;
    link.click();
  } catch (error) {
    throw new ExportError('HTML', error);
  } finally {
    if (url) URL.revokeObjectURL(url);
    hideProgressIndicator();
  }
}
