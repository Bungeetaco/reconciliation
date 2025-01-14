// src/lib/license-utils.ts
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { SKU_PRICING, SKU_MAPPING } from './license-types';
import memoize from 'lodash.memoize';

interface License {
  guid: string;
  productName: string;
}

interface User {
  displayName: string;
  userPrincipalName: string;
  department: string;
  originalDepartment: string;
  licenses: License[];
}

interface GroupedData {
  [department: string]: User[];
}

export const calculateGrandTotals = (data: GroupedData): { users: number, monthly: number, annual: number } => {
  let users = 0;
  let monthly = 0;
  let annual = 0;

  Object.values(data).forEach((usersArray: User[]) => {
    users += usersArray.length;
    usersArray.forEach((user: User) => {
      user.licenses.forEach((license: License) => {
        monthly += SKU_PRICING[license.guid]?.monthlyPrice || 0;
        annual += SKU_PRICING[license.guid]?.annualPrice || 0;
      });
    });
  });

  return { users, monthly, annual };
};

const memoizedCalculateGrandTotals = memoize(calculateGrandTotals);

export const parseLicenses = (licenseString: string | undefined): License[] => {
  if (!licenseString) return [];
  return licenseString
    .toLowerCase()
    .split(/[\s,]+/)
    .map(guid => guid.trim())
    .filter(guid => guid.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/))
    .map(guid => ({
      guid,
      productName: SKU_MAPPING[guid] || 'Unknown License'
    }))
    .map(license => {
      switch (license.productName) {
        case 'Microsoft 365 E5':
          license.productName = 'M365 E5';
          break;
        case 'Office 365 E1':
          license.productName = 'O365 E1';
          break;
        case 'Office 365 F3':
          license.productName = 'O365 F3';
          break;
        case 'Azure Active Directory Premium P1':
          license.productName = 'AAD P1';
          break;
        case 'Dynamics 365':
          license.productName = 'D365';
          break;
        // Add more cases as needed
      }
      return license;
    });
};

export const processDepartment = (department: string | undefined): string => {
  if (!department) return 'No Department';
  
  department = department.trim();
  
  // Handle specific mappings first
  if (department.toLowerCase() === 'onfrontdoor') return 'ON';
  if (department.includes('Contractor - SK - NetResults')) return 'SK';
  if (department.includes('Instructor- FD') || department.includes('Instructor - FD')) return 'FD';
  if (department.includes('Generic - IT')) return 'NHQ';
  
  if (department.toUpperCase().startsWith('X-')) {
    const region = department.substring(2).toUpperCase();
    if (['AB', 'BCY', 'MB', 'NB', 'NL-LAB', 'NS-PEI', 'ON', 'QC', 'SK', 'FD'].includes(region)) {
      return region;
    }
    if (region === 'NHQ') {
      return 'NHQ';
    }
  }
  
  const parts = department.split(' - ');
  if (parts.length >= 2) {
    const lastPart = parts[parts.length - 1].toUpperCase();
    if (['AB', 'BCY', 'MB', 'NB', 'NL-LAB', 'NS-PEI', 'ON', 'QC', 'SK', 'FD'].includes(lastPart)) {
      return lastPart;
    }
    if (lastPart === 'NHQ' || parts.includes('NHQ')) {
      return 'NHQ';
    }
  }
  
  return department;
};
  
export const generateCSV = (groupedData: GroupedData, branding: string): string => {
  const rows: string[][] = [];

  // Add headers
  rows.push([
    'Department',
    'Display Name',
    'Email',
    'Original Department',
    'Licenses',
    'Monthly Cost',
    'Annual Cost'
  ]);

  // Add data rows
  Object.entries(groupedData).forEach(([department, users]) => {
    users.forEach((user: User) => {
      const monthlyTotal = user.licenses.reduce((sum: number, license: License) => 
        sum + (SKU_PRICING[license.guid]?.monthlyPrice || 0), 0);
      const annualTotal = user.licenses.reduce((sum: number, license: License) => 
        sum + (SKU_PRICING[license.guid]?.annualPrice || 0), 0);
      
      rows.push([
        department,
        user.displayName,
        user.userPrincipalName,
        user.originalDepartment,
        user.licenses.map((l: License) => l.productName).join('; '),
        monthlyTotal.toFixed(2),
        annualTotal.toFixed(2)
      ]);
    });
  });

  // Add grand totals
  const grandTotals = calculateGrandTotals(groupedData);
  rows.push([]); // Empty row
  rows.push([
    'GRAND TOTALS',
    `Total Users: ${grandTotals.users}`,
    '',
    '',
    '',
    grandTotals.monthly.toFixed(2),
    grandTotals.annual.toFixed(2)
  ]);

  // Add branding
  rows.push([]);
  rows.push([branding]);

  return Papa.unparse(rows);
};

export function generateExcel(data: GroupedData, branding: string): XLSX.WorkBook {
  const workbook = XLSX.utils.book_new();
  
  // Create summary sheet
  const summaryData = generateSummaryData(data);
  summaryData.push([]);
  summaryData.push([branding]);
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

  // Create department sheets
  Object.entries(data).forEach(([dept, users]) => {
    const licenseTypes = new Set<string>();
    users.forEach(user => {
      user.licenses.forEach((license: License) => {
        if (![
          'AAD P1', 'Communications Credits', 'Microsoft 365 Phone System', 
          'Microsoft Flow Free', 'Microsoft Teams Shared Devices', 
          'Microsoft Teams Rooms Standard', 'Power BI (free)', 
          'Power Pages vTrial for Makers', 'Power Virtual Agents Viral Trial'
        ].includes(license.productName)) {
          licenseTypes.add(license.productName);
        }
      });
    });
    
    const headers = [
      'Display Name',
      'Email',
      'Monthly Cost',
      'Annual Cost',
      ...Array.from(licenseTypes)
    ];

    const deptData = [
      headers,
      ...users.map(user => {
        const row = [
          user.displayName,
          user.userPrincipalName,
          user.licenses.reduce((sum: number, license: License) => 
            sum + (SKU_PRICING[license.guid]?.monthlyPrice || 0), 0).toFixed(2),
          user.licenses.reduce((sum: number, license: License) => 
            sum + (SKU_PRICING[license.guid]?.annualPrice || 0), 0).toFixed(2),
          ...Array.from(licenseTypes).map(type => 
            user.licenses.some((l: License) => l.productName === type) ? 'X' : '')
        ];
        return row;
      })
    ];

    deptData.push([]);
    deptData.push([branding]);

    const sheet = XLSX.utils.aoa_to_sheet(deptData);
    XLSX.utils.book_append_sheet(workbook, sheet, dept.slice(0, 31)); // Excel sheet names limited to 31 chars
  });

  return workbook;
}

// Helper functions for HTML generation
const generateLicenseSummaryTable = (data: GroupedData): string => {
  const licenseTypes = new Set<string>();
  const licenseCounts: Record<string, { users: number, monthlyTotal: number, annualTotal: number }> = {};

  // Collect data
  Object.values(data).forEach((usersArray: User[]) => {
    usersArray.forEach(user => {
      user.licenses.forEach((license: License) => {
        licenseTypes.add(license.productName);
        if (!licenseCounts[license.productName]) {
          licenseCounts[license.productName] = { users: 0, monthlyTotal: 0, annualTotal: 0 };
        }
        licenseCounts[license.productName].users++;
        licenseCounts[license.productName].monthlyTotal += SKU_PRICING[license.guid]?.monthlyPrice || 0;
        licenseCounts[license.productName].annualTotal += SKU_PRICING[license.guid]?.annualPrice || 0;
      });
    });
  });

  return `
    <div class="card" style="page-break-after: auto;">
      <div class="card-header">
        <h2>License Summary</h2>
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>License Type</th>
              <th>Users</th>
              <th>Monthly Cost</th>
              <th>Annual Cost</th>
            </tr>
          </thead>
          <tbody>
            ${Array.from(licenseTypes).map(type => `
              <tr>
                <td>${type}</td>
                <td>${licenseCounts[type].users}</td>
                <td>$${licenseCounts[type].monthlyTotal.toFixed(2)}</td>
                <td>$${licenseCounts[type].annualTotal.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
};

const memoizedGenerateLicenseSummaryTable = memoize(generateLicenseSummaryTable);

const generateTotalsSummary = (data: GroupedData): string => {
  const totals = memoizedCalculateGrandTotals(data);
  
  return `
    <div class="card" style="page-break-inside: avoid;">
      <div class="card-header">
        <h2>Total Summary</h2>
      </div>
      <div class="summary-grid">
        <div class="summary-box total-users">
          <h3>Total Users</h3>
          <div class="value">${totals.users}</div>
        </div>
        <div class="summary-box monthly">
          <h3>Monthly Cost</h3>
          <div class="value">$${totals.monthly.toFixed(2)}</div>
          <div class="per-user">$${(totals.monthly / totals.users).toFixed(2)} per user</div>
        </div>
        <div class="summary-box annual">
          <h3>Annual Cost</h3>
          <div class="value">$${totals.annual.toFixed(2)}</div>
          <div class="per-user">$${(totals.annual / totals.users).toFixed(2)} per user</div>
        </div>
      </div>
    </div>
  `;
};

const memoizedGenerateTotalsSummary = memoize(generateTotalsSummary);

const generateUserMappingTable = (data: GroupedData, licenseTypes: string[], isPdf: boolean): string => {
  return `
    <div class="card" style="page-break-after: auto;">
      <div class="card-header">
        <h2>License Mapping</h2>
      </div>
      <div class="table-container">
        <table style="page-break-inside: auto;">
          <thead>
            <tr>
              <th>Display Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Monthly Cost</th>
              <th>Annual Cost</th>
              ${!isPdf ? licenseTypes.map(type => `<th>${type}</th>`).join('') : '<th>Assigned Licenses</th>'}
            </tr>
          </thead>
          <tbody>
            ${Object.entries(data).flatMap(([, users]) => {
              return users.map((user: User) => `
                <tr>
                  <td>${user.displayName}</td>
                  <td>${user.userPrincipalName}</td>
                  <td>${user.originalDepartment}</td>
                  <td>$${user.licenses.reduce((sum: number, license: License) => 
                    sum + (SKU_PRICING[license.guid]?.monthlyPrice || 0), 0).toFixed(2)}</td>
                  <td>$${user.licenses.reduce((sum: number, license: License) => 
                    sum + (SKU_PRICING[license.guid]?.annualPrice || 0), 0).toFixed(2)}</td>
                  ${!isPdf ? licenseTypes.map(type => 
                    `<td>${user.licenses.some((l: License) => l.productName === type) ? 'X' : ''}</td>`
                  ).join('') : `<td>${user.licenses.map((l: License) => l.productName).join(', ')}</td>`}
                </tr>
              `).join('');
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
};

const memoizedGenerateUserMappingTable = memoize(generateUserMappingTable);

export const generateHTML = (groupedData: GroupedData, branding: string, isPdf: boolean = false): string => {
  const styles = generateStyles();
  let html = generateHTMLHeader(styles);

  // Calculate table width for print orientation
  const licenseTypes = new Set<string>();
  Object.values(groupedData).forEach((value: User[]) => {
    value.forEach((user: User) => {
      user.licenses.forEach((license: License) => {
        if (![
          'AAD P1', 'Communications Credits', 'Microsoft 365 Phone System', 
          'Microsoft Flow Free', 'Microsoft Teams Shared Devices', 
          'Microsoft Teams Rooms Standard', 'Power BI (free)', 
          'Power Pages vTrial for Makers', 'Power Virtual Agents Viral Trial'
        ].includes(license.productName)) {
          licenseTypes.add(license.productName);
        }
      });
    });
  });
  const tableWidth = 650 + (licenseTypes.size * 150); // Base width + license columns

  // Replace placeholder in styles
  html = html.replace('{{ tableWidth }}', tableWidth.toString());

  // Add license summary card
  html += memoizedGenerateLicenseSummaryTable(groupedData);

  // Add user mapping table
  html += memoizedGenerateUserMappingTable(groupedData, Array.from(licenseTypes), isPdf);

  // Add totals summary
  html += memoizedGenerateTotalsSummary(groupedData);

  // Add branding
  html += `<div class="branding">${branding}</div>`;

  html += generateHTMLFooter();

  return html;
};

function generateSummaryData(data: GroupedData): (string | number)[][] {
  return [
    ['Department', 'Total Users', 'Monthly Cost', 'Annual Cost'],
    ...Object.entries(data).map(([dept, users]) => {
      const deptTotal = users.reduce((acc, user) => ({
        monthly: acc.monthly + user.licenses.reduce((sum: number, license: License) => 
          sum + (SKU_PRICING[license.guid]?.monthlyPrice || 0), 0),
        annual: acc.annual + user.licenses.reduce((sum: number, license: License) => 
          sum + (SKU_PRICING[license.guid]?.annualPrice || 0), 0),
      }), { monthly: 0, annual: 0 });
      
      return [
        dept,
        users.length,
        deptTotal.monthly.toFixed(2),
        deptTotal.annual.toFixed(2)
      ];
    })
  ];
}

function generateStyles(): string {
  return `
     :root {
      --primary-color: #2563eb;
      --success-color: #059669;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Helvetica, sans-serif;
      line-height: 1.5;
      color: #f9fafb;
      background-color: #f9fafb;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: 'Nunito Sans', sans-serif;
    }

    .container {
      max-width: 100%;
      margin: 0 auto;
      padding: 2rem;
      flex: 1;
    }

    .header {
      position: sticky;
      top: 0;
      background-color: white;
      padding: 1.5rem;
      margin-bottom: 2rem;
      border-bottom: 1px solid #e5e7eb;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .logo {
      height: 50px;
      margin-right: 1rem;
    }

    .content {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .card {
      background-color: white;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      overflow: hidden;
    }

    .table-container {
      overflow-x: auto;
      max-width: 100%;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
    }

    th, td {
      padding: 0.75rem 1rem;
      text-align: left;
      border: 1px solid #e5e7eb;
    }

    th {
      background-color: #f9fafb;
      font-weight: 600;
      white-space: nowrap;
    }

    tr:hover {
      background-color: #f9fafb;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      padding: 1.5rem;
    }

    .summary-box {
      padding: 1.5rem;
      border-radius: 0.5rem;
      text-align: center;
    }

    .summary-box.total-users { background-color: #f3f4f6; }
    .summary-box.monthly { background-color: #eff6ff; }
    .summary-box.annual { background-color: #ecfdf5; }

    @media (max-width: 600px) {
      body {
        font-size: 0.75rem;
      }

      th, td {
        padding: 0.5rem 0.75rem;
      }

      .summary-box {
        padding: 1rem;
      }
    }

    @media (min-width: 601px) and (max-width: 1200px) {
      body {
        font-size: 0.875rem;
      }

      th, td {
        padding: 0.75rem 1rem;
      }

      .summary-box {
        padding: 1.25rem;
      }
    }

    @media (min-width: 1201px) {
      body {
        font-size: 1rem;
      }

      th, td {
        padding: 1rem 1.25rem;
      }

      .summary-box {
        padding: 1.5rem;
      }
    }

    @media print {
      @page {
        size: auto;
        margin: 0.5in;
      }

      body {
        background: white;
        min-height: 0 !important;
        padding: 0 !important;
      }

      .header {
        position: static;
        break-after: avoid;
      }

      .card {
        break-inside: avoid;
        box-shadow: none;
        border: 1px solid #e5e7eb;
        margin: 1rem 0;
        page-break-inside: avoid;
      }

      .table-container {
        overflow: visible;
      }

      table {
        font-size: 9pt;
        page-break-inside: auto;
      }

      tr {
        page-break-inside: avoid;
      }

      th, td {
        padding: 4px 8px;
      }

      /* Avoid blank pages */
      .content {
        display: block;
      }

      /* Hide print button when printing */
      #printButton {
        display: none !important;
      }
    }
  `;
}

function generateHTMLHeader(styles: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>SJA Office 365 License Report</title>
      <style>${styles}</style>
    </head>
    <body>
      <div class="container">
        <header class="header">
          <img src="https://sjalicenseparse.blob.core.windows.net/assets/sjalogo.png" alt="SJA Logo" class="logo" />
          <h1>SJA Office 365 License Report</h1>
        </header>
        <div class="content">
  `;
}

function generateHTMLFooter(): string {
  return `
        </div>
      </div>
      <script>
        // Add print button
        const printButton = document.createElement('button');
        printButton.id = 'printButton';
        printButton.innerText = 'Print Report';
        printButton.style.cssText = 'position:fixed;bottom:20px;right:20px;padding:10px 20px;background:#2563eb;color:white;border:none;border-radius:5px;cursor:pointer;z-index:1000;';
        printButton.onclick = () => {
          // Remove the button before printing
          printButton.style.display = 'none';
          window.print();
          // Show the button again after printing
          setTimeout(() => printButton.style.display = 'block', 100);
        };
        document.body.appendChild(printButton);
      </script>
    </body>
    </html>
  `;
}





