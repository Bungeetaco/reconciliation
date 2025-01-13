import { User } from '../types';
import { SKU_PRICING } from '../lib/license-types';
import { processDepartment, parseLicenses } from '../lib/license-utils';

export function filterByDepartments(filtered: Record<string, User[]>, selectedDepartments: string[]) {
  if (selectedDepartments.length > 0) {
    Object.keys(filtered).forEach((dept: string) => {
      if (!selectedDepartments.includes(dept)) {
        delete filtered[dept];
      }
    });
  }
}

export function filterBySearchTermAndLicenseTypes(
  filtered: Record<string, User[]>, 
  searchTerm: string, 
  selectedLicenseTypes: string[], 
  showUnknownLicenses: boolean, 
  hideZeroCostAccounts: boolean
) {
  Object.keys(filtered).forEach((dept: string) => {
    filtered[dept] = filtered[dept].filter((user: User) => {
      const matchesSearch = searchTerm === '' || 
        user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.userPrincipalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.originalDepartment.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLicenseTypes = selectedLicenseTypes.length === 0 ||
        user.licenses.some((license) => selectedLicenseTypes.includes(license.productName));

      const matchesUnknownFilter = showUnknownLicenses ? 
        true :
        !user.licenses.some((license) => license.productName === 'Unknown License');

      const totalMonthlyCost = user.licenses.reduce((sum, license) => 
        sum + (SKU_PRICING[license.guid]?.monthlyPrice || 0), 0);
      const totalAnnualCost = user.licenses.reduce((sum, license) => 
        sum + (SKU_PRICING[license.guid]?.annualPrice || 0), 0);
        
      const matchesZeroCostFilter = !hideZeroCostAccounts || 
        (totalMonthlyCost > 0 || totalAnnualCost > 0);

      return matchesSearch && matchesLicenseTypes && matchesUnknownFilter && matchesZeroCostFilter;
    });
  });
}

export function mapLicensesData(licenses: any[]) {
  return licenses
    .filter((user: any) => !user.Department?.startsWith('X-'))
    .map(user => ({
      displayName: user.DisplayName,
      userPrincipalName: user.UserPrincipalName,
      department: processDepartment(user.Department),
      originalDepartment: user.Department || 'No Department',
      licenses: parseLicenses(user.Licenses).map(license => {
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
        }
        return license;
      })
    }));
}
