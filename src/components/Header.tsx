// Header.tsx
import { ThemeToggle } from "./ui/theme-toggle";
import { ActionButtons } from "./ui/ActionButtons";
import { FileUpload } from "./FileUpload";
import { SearchBar } from "./SearchBar";
import { config } from '../config';
import { ReactNode } from 'react';

interface HeaderProps {
  fileName: string;
  searchTerm: string;
  selectedDepartments: string[];
  departments: string[];
  selectedLicenseTypes: string[];
  licenseTypes: string[];
  showUnknownLicenses: boolean;
  hideZeroCostAccounts: boolean;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onExport: (format: 'pdf' | 'csv' | 'excel' | 'html') => void;
  onSearchChange: (value: string) => void;
  onDepartmentChange: (departments: string[]) => void;
  onLicenseTypesChange: (types: string[]) => void;
  onShowUnknownLicensesChange: (show: boolean) => void;
  onHideZeroCostAccountsChange: (hide: boolean) => void;
  children?: ReactNode;
}

export function Header({
  fileName,
  searchTerm,
  selectedDepartments,
  departments,
  selectedLicenseTypes,
  licenseTypes,
  showUnknownLicenses,
  hideZeroCostAccounts,
  onFileUpload,
  onExport,
  onSearchChange,
  onDepartmentChange,
  onLicenseTypesChange,
  onShowUnknownLicensesChange,
  onHideZeroCostAccountsChange,
  children
}: HeaderProps) {
  return (
    <div className="flex-none bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <img 
              src={`${config.basePath}sjalogo.png`} 
              alt="Company Logo" 
              className="w-10 h-10" 
            />
            <h1 className="text-2xl font-bold">SJA Office 365 License Mapping</h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <FileUpload onFileUpload={onFileUpload} fileName={fileName} />
            <ActionButtons fileName={fileName} onExport={onExport} />
            {children}
            <ThemeToggle />
          </div>
        </div>

        {fileName && (
          <SearchBar 
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            selectedDepartments={selectedDepartments}
            onDepartmentChange={onDepartmentChange}
            departments={departments}
            selectedLicenseTypes={selectedLicenseTypes}
            onLicenseTypesChange={onLicenseTypesChange}
            licenseTypes={licenseTypes}
            showUnknownLicenses={showUnknownLicenses}
            onShowUnknownLicensesChange={onShowUnknownLicensesChange}
            hideZeroCostAccounts={hideZeroCostAccounts}
            onHideZeroCostAccountsChange={onHideZeroCostAccountsChange}
          />
        )}
      </div>
    </div>
  );
}