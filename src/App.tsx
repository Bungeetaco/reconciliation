import { useState, useMemo, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ThemeProvider } from "@/providers/theme-provider";
import { ThemeToggle } from "./components/ui/theme-toggle";
import { ActionButtons } from "./components/ui/ActionButtons";
import { FileUpload } from "./components/FileUpload";
import { SearchBar } from "./components/SearchBar";
import { useLicenseData } from "./hooks/useLicenseData";
import { SKU_PRICING } from "./lib/license-types";
import { License, User } from './types';
import { exportToPDF, exportToCSV, exportToExcel, exportToHTML } from './helpers/export-helpers';
import { filterByDepartments, filterBySearchTermAndLicenseTypes } from './helpers/filter-helpers';
import LicenseMappingTable from './components/LicenseMappingTable';
import { useSorting } from './hooks/useSorting';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, Upload } from 'lucide-react';
import { calculateGrandTotals } from './lib/license-utils';
import { compareValues, sortUserRows } from './helpers/sort-helpers';
import { SortState } from './types/sorting';

const LicenseMapping = () => {
  const { 
    groupedData, 
    loading, 
    fileName, 
    error, 
    setError, 
    handleFileUpload,
    handleFileDrop 
  } = useLicenseData();

  // Keep sorting hooks
  const { sortState, handleSort } = useSorting({
    defaultColumn: 'displayName',
    defaultDirection: 'asc'
  });
  
  const { sortState: summarySort, handleSort: handleSummarySort } = useSorting({
    defaultColumn: 'totalUsers',
    defaultDirection: 'desc'
  });

  // Keep state hooks
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedLicenseTypes, setSelectedLicenseTypes] = useState<string[]>([]);
  const [showUnknownLicenses, setShowUnknownLicenses] = useState(false);
  const [hideZeroCostAccounts, setHideZeroCostAccounts] = useState(false);

  // Memoized computations
  const departments = useMemo(() => 
    Object.keys(groupedData).sort(), 
    [groupedData]
  );

  const licenseTypes = useMemo(() => {
    const types = new Set<string>();
    Object.values(groupedData).forEach((users: User[]) => {
      users.forEach((user: User) => {
        user.licenses.forEach((license: License) => {
          types.add(license.productName);
        });
      });
    });
    return Array.from(types).sort();
  }, [groupedData]);

  const filteredAndSearchedData = useMemo(() => {
    const filtered = { ...groupedData };
    filterByDepartments(filtered, selectedDepartments);
    filterBySearchTermAndLicenseTypes(filtered, searchTerm, selectedLicenseTypes, showUnknownLicenses, hideZeroCostAccounts);
    return filtered;
  }, [groupedData, searchTerm, selectedDepartments, selectedLicenseTypes, showUnknownLicenses, hideZeroCostAccounts]);

  const grandTotals = useMemo(() => 
    calculateGrandTotals(filteredAndSearchedData),
    [filteredAndSearchedData]
  );

  const handleExport = useCallback((format: 'pdf' | 'csv' | 'excel' | 'html') => {
    try {
      switch (format) {
        case 'pdf': {
          exportToPDF(filteredAndSearchedData);
          break;
        }
        case 'csv': {
          exportToCSV(filteredAndSearchedData);
          break;
        }
        case 'excel': {
          exportToExcel(filteredAndSearchedData);
          break;
        }
        case 'html': {
          exportToHTML(filteredAndSearchedData);
          break;
        }
      }
    } catch (error) {
      console.error(error);
      alert('Error exporting file. Please try again.');
    }
  }, [filteredAndSearchedData]);

  const userRows = useMemo(() => {
    // First, create the base rows
    const baseRows = Object.entries(filteredAndSearchedData).flatMap(([, users]) => 
      users.map(user => ({
        ...user,
        department: user.originalDepartment,
        totalMonthlyCost: user.licenses.reduce((sum: number, license: License) => 
          sum + (SKU_PRICING[license.guid]?.monthlyPrice || 0), 0),
        totalAnnualCost: user.licenses.reduce((sum: number, license: License) => 
          sum + (SKU_PRICING[license.guid]?.annualPrice || 0), 0),
      }))
    );

    // Then sort the rows
    return sortUserRows(baseRows, sortState);
  }, [filteredAndSearchedData, sortState]);

  const licenseSummary = useMemo(() => {
    const summary = licenseTypes.map(type => {
      const totalUsers = userRows.filter((user: User) => user.licenses.some(l => l.productName === type)).length;
      const totalMonthlyCost = userRows.reduce((sum, user) => 
        sum + user.licenses.filter(l => l.productName === type).reduce((subSum, license) => subSum + (SKU_PRICING[license.guid]?.monthlyPrice || 0), 0), 0);
      const totalAnnualCost = userRows.reduce((sum, user) => 
        sum + user.licenses.filter((l: License) => l.productName === type).reduce((subSum, license) => subSum + (SKU_PRICING[license.guid]?.annualPrice || 0), 0), 0);
      return { type, totalUsers, totalMonthlyCost, totalAnnualCost };
    }).filter(license => ![
      'AAD P1', 'Communications Credits', 'Microsoft 365 Phone System', 'AZURE ACTIVE DIRECTORY PREMIUM P1', 
      'MICROSOFT FLOW FREE', 'Microsoft Teams Shared Devices', 
      'Microsoft Teams Rooms Standard', 'Power BI (free)', 
      'Power Pages vTrial for Makers', 'Power Virtual Agents Viral Trial', 'Power Automate Premium'
    ].includes(license.type));

    // Sort the summary based on current sort state
    return [...summary].sort((a, b) => {
      const sortVal = summarySort.direction === 'asc' ? 1 : -1;
      const aValue = a[summarySort.column as keyof typeof a];
      const bValue = b[summarySort.column as keyof typeof b];
      return sortVal * compareValues(aValue, bValue);
    });
  }, [userRows, licenseTypes, summarySort]);

  const licenseColumns = useMemo(() => {
    // Calculate usage count for each license type
    const usageCounts = licenseTypes.reduce((acc, type) => {
      acc[type] = userRows.filter(user => 
        user.licenses.some(l => l.productName === type)
      ).length;
      return acc;
    }, {} as Record<string, number>);

    return licenseTypes
      .filter(type => ![
        'AAD P1', 'Communications Credits', 'Microsoft 365 Phone System', 'AZURE ACTIVE DIRECTORY PREMIUM P1', 
        'MICROSOFT FLOW FREE', 'Microsoft Teams Shared Devices', 
        'Microsoft Teams Rooms Standard', 'Power BI (free)', 
        'Power Pages vTrial for Makers', 'Power Virtual Agents Viral Trial', 'Power Automate Premium'
      ].includes(type))
      .map(type => ({
        key: type,
        name: type,
        usageCount: usageCounts[type] || 0
      }))
      // Sort by usage count in descending order
      .sort((a, b) => b.usageCount - a.usageCount)
      // Remove usageCount from final output
      .map(({ key, name }) => ({ key, name }));
  }, [licenseTypes, userRows]);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-white dark:bg-gray-900">
        <div className="text-red-600 dark:text-red-400">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>{error.message}</p>
          <button 
            onClick={() => setError(null)}
            className="mt-4 px-4 py-2 bg-red-600 text-white dark:bg-red-500 dark:hover:bg-red-600 rounded"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-white dark:bg-gray-900">
        <div className="text-3xl font-bold text-gray-600 dark:text-gray-300">Loading license data...</div>
      </div>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="h-screen w-screen flex flex-col overflow-hidden bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {/* Header Section - fixed height */}
        <div className="flex-none bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="p-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <img src="./sjalogo.png" alt="Company Logo" className="w-10 h-10" />
                <h1 className="text-2xl font-bold">SJA Office 365 License Mapping</h1>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                <FileUpload onFileUpload={handleFileUpload} fileName={fileName} />
                <ActionButtons fileName={fileName} onExport={handleExport} />
                <ThemeToggle />
              </div>
            </div>

            {fileName && (
              <SearchBar 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedDepartments={selectedDepartments}
                onDepartmentChange={setSelectedDepartments}
                departments={departments}
                selectedLicenseTypes={selectedLicenseTypes}
                onLicenseTypesChange={setSelectedLicenseTypes}
                licenseTypes={licenseTypes}
                showUnknownLicenses={showUnknownLicenses}
                onShowUnknownLicensesChange={setShowUnknownLicenses}
                hideZeroCostAccounts={hideZeroCostAccounts}
                onHideZeroCostAccountsChange={setHideZeroCostAccounts}
              />
            )}
          </div>
        </div>

        {/* Main Content Section */}
        <div 
          className="flex-1 min-h-0 w-full overflow-auto bg-gray-50 dark:bg-gray-900"
          onDrop={handleFileDrop}
          onDragOver={handleDragOver}
        >
          <div className="h-full p-4">
            {fileName ? (
              <div className="flex flex-col gap-4">
                {/* Price Summary Card */}
                <Card className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <CardHeader className="bg-gray-50 dark:bg-gray-800 rounded-t-lg border-b border-gray-200 dark:border-gray-700">
                    <CardTitle className="text-center">License Price Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse min-w-[800px] border border-gray-200 dark:border-gray-700">
                        <thead className="bg-white dark:bg-gray-700">
                          <tr>
                            <th 
                              onClick={() => handleSummarySort('type')}
                              className={cn(
                                "p-2 border text-left bg-gray-50 dark:bg-gray-800 font-semibold cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600",
                                summarySort.column === 'type' && 'bg-blue-50 dark:bg-blue-900'
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <span>License Type</span>
                                {summarySort.column === 'type' && (
                                  summarySort.direction === 'asc' ? 
                                    <ChevronUp className="w-4 h-4 text-blue-600" /> : 
                                    <ChevronDown className="w-4 h-4 text-blue-600" />
                                )}
                              </div>
                            </th>
                            <th 
                              onClick={() => handleSummarySort('totalUsers')}
                              className={cn(
                                "p-2 border text-left bg-gray-50 dark:bg-gray-800 font-semibold cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600",
                                summarySort.column === 'totalUsers' && 'bg-blue-50 dark:bg-blue-900'
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <span>Total Users</span>
                                {summarySort.column === 'totalUsers' && (
                                  summarySort.direction === 'asc' ? 
                                    <ChevronUp className="w-4 h-4 text-blue-600" /> : 
                                    <ChevronDown className="w-4 h-4 text-blue-600" />
                                )}
                              </div>
                            </th>
                            <th 
                              onClick={() => handleSummarySort('totalMonthlyCost')}
                              className={cn(
                                "p-2 border text-left bg-gray-50 dark:bg-gray-800 font-semibold cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600",
                                summarySort.column === 'totalMonthlyCost' && 'bg-blue-50 dark:bg-blue-900'
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <span>Total Monthly Cost</span>
                                {summarySort.column === 'totalMonthlyCost' && (
                                  summarySort.direction === 'asc' ? 
                                    <ChevronUp className="w-4 h-4 text-blue-600" /> : 
                                    <ChevronDown className="w-4 h-4 text-blue-600" />
                                )}
                              </div>
                            </th>
                            <th 
                              onClick={() => handleSummarySort('totalAnnualCost')}
                              className={cn(
                                "p-2 border text-left bg-gray-50 dark:bg-gray-800 font-semibold cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600",
                                summarySort.column === 'totalAnnualCost' && 'bg-blue-50 dark:bg-blue-900'
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <span>Total Annual Cost</span>
                                {summarySort.column === 'totalAnnualCost' && (
                                  summarySort.direction === 'asc' ? 
                                    <ChevronUp className="w-4 h-4 text-blue-600" /> : 
                                    <ChevronDown className="w-4 h-4 text-blue-600" />
                                )}
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {licenseSummary.map((license, index) => (
                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                              <td className="p-2 border border-gray-200 dark:border-gray-700">{license.type}</td>
                              <td className="p-2 border border-gray-200 dark:border-gray-700">{license.totalUsers}</td>
                              <td className="p-2 border border-gray-200 dark:border-gray-700 text-right">{formatCurrency(license.totalMonthlyCost)}</td>
                              <td className="p-2 border border-gray-200 dark:border-gray-700 text-right">{formatCurrency(license.totalAnnualCost)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* License Mapping Table */}
                <LicenseMappingTable 
                  userRows={userRows}
                  licenseColumns={licenseColumns}
                  sortState={sortState}
                  onSort={(newState: SortState) => handleSort(newState.column)}
                />

                {/* Grand Totals Card */}
                <Card className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-[#1e6759] via-[#0f714b] to-[#007a3d] border-b border-gray-200 dark:border-gray-700">
                    <CardTitle className="text-center text-white">License Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-lg font-semibold text-gray-700 dark:text-gray-100">Total Users</div>
                        <div className="text-4xl font-bold mt-2">
                          {grandTotals.users.toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-lg font-semibold text-gray-700 dark:text-gray-100">Monthly Cost</div>
                        <div className="text-4xl font-bold mt-2 text-gray-700 dark:text-gray-100">
                          {formatCurrency(grandTotals.monthly)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {formatCurrency(grandTotals.monthly / userRows.filter(user => user.totalMonthlyCost && user.totalMonthlyCost > 0).length)} per user
                        </div>
                      </div>
                      
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-lg font-semibold text-gray-700 dark:text-gray-100">Annual Cost</div>
                        <div className="text-4xl font-bold mt-2 text-gray-700 dark:text-gray-100">
                          {formatCurrency(grandTotals.annual)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {formatCurrency(grandTotals.annual / userRows.filter(user => user.totalAnnualCost && user.totalAnnualCost > 0).length)} per user
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm text-center">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-xl mb-2 text-black dark:text-gray-100">No data to display</p>
                  <p className="text-sm text-black dark:text-gray-300">Upload a CSV file to begin license analysis</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Section */}
        <div className="flex-none bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-center p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">© 2025 St John Ambulance Canada / Gabriel Girouard. All rights reserved.</p>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default LicenseMapping;