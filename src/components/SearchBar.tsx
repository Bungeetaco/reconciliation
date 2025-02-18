import { X } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedDepartments: string[];
  onDepartmentChange: (departments: string[]) => void;
  departments: string[];
  selectedLicenseTypes: string[];
  onLicenseTypesChange: (types: string[]) => void;
  licenseTypes: string[];
  showUnknownLicenses: boolean;
  onShowUnknownLicensesChange: (show: boolean) => void;
  hideZeroCostAccounts: boolean;
  onHideZeroCostAccountsChange: (hide: boolean) => void;
}

export function SearchBar({
  searchTerm,
  onSearchChange,
  selectedDepartments,
  onDepartmentChange,
  departments,
  selectedLicenseTypes,
  onLicenseTypesChange,
  licenseTypes,
  showUnknownLicenses,
  onShowUnknownLicensesChange,
  hideZeroCostAccounts,
  onHideZeroCostAccountsChange,
}: SearchBarProps) {
  return (
    <div className="mt-4 flex flex-col sm:flex-row gap-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
      {/* Search Input */}
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Search by name, email, or department..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {/* Department Select */}
        <select
          multiple
          value={selectedDepartments}
          onChange={(e) => onDepartmentChange(Array.from(e.target.selectedOptions, option => option.value))}
          className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg min-w-[200px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="" disabled>Select Departments</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>

        {/* License Types Select */}
        <select
          multiple
          value={selectedLicenseTypes}
          onChange={(e) => onLicenseTypesChange(Array.from(e.target.selectedOptions, option => option.value))}
          className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg min-w-[200px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="" disabled>Select License Types</option>
          {licenseTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        {/* Checkboxes */}
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <input
              type="checkbox"
              checked={showUnknownLicenses}
              onChange={(e) => onShowUnknownLicensesChange(e.target.checked)}
              className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 bg-white dark:bg-gray-800"
            />
            Show Unknown Licenses
          </label>

          <label className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <input
              type="checkbox"
              checked={hideZeroCostAccounts}
              onChange={(e) => onHideZeroCostAccountsChange(e.target.checked)}
              className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 bg-white dark:bg-gray-800"
            />
            Hide Zero Cost Accounts
          </label>
        </div>
      </div>
    </div>
  );
}
