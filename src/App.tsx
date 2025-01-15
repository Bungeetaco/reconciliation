// App.tsx
import { useState, useMemo, useCallback } from 'react';
import { ThemeProvider } from "@/providers/theme-provider";
import { useLicenseData } from "./hooks/useLicenseData";
import { User, License } from './types';
import { exportToPDF, exportToCSV, exportToExcel, exportToHTML } from './helpers/export-helpers';
import { filterByDepartments, filterBySearchTermAndLicenseTypes } from './helpers/filter-helpers';
import { useSorting } from './hooks/useSorting';
import { compareValues, sortUserRows } from './helpers/sort-helpers';
import { SKU_PRICING } from "./lib/license-types";
import { ErrorBoundary } from 'react-error-boundary';
import { Header } from './components/Header';
import { MainContent } from './components/MainContent';
import { Footer } from './components/Footer';
import { ErrorFallback } from './components/ErrorFallback';
import { LoadingSpinner } from './components/LoadingSpinner';

const LicenseMapping = () => {
  // Data management hooks
  const { 
    groupedData, 
    loading, 
    fileName, 
    error, 
    setError, 
    handleFileUpload,
    handleFileDrop 
  } = useLicenseData();

  // Sorting hooks
  const { sortState, handleSort } = useSorting({
    defaultColumn: 'displayName',
    defaultDirection: 'asc'
  });
  
  const { sortState: summarySort, handleSort: handleSummarySort } = useSorting({
    defaultColumn: 'totalUsers',
    defaultDirection: 'desc'
  });

  // Filter state
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
    Object.keys(filtered).forEach(department => {
      filtered[department] = filtered[department].filter(user => !user.userPrincipalName.includes('#EXT#')); // Corrected property name
    });
    return filtered;
  }, [groupedData, searchTerm, selectedDepartments, selectedLicenseTypes, showUnknownLicenses, hideZeroCostAccounts]);

  const userRows = useMemo(() => {
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
    return sortUserRows(baseRows, sortState);
  }, [filteredAndSearchedData, sortState]);

  const licenseSummary = useMemo(() => {
    const summary = licenseTypes
      .filter(type => ![
        'AAD P1', 'Communications Credits', 'Microsoft 365 Phone System', 
        'MICROSOFT FLOW FREE', 'Microsoft Teams Shared Devices', 
        'Microsoft Teams Rooms Standard', 'Power BI (free)', 
        'Power Pages vTrial for Makers', 'Power Virtual Agents Viral Trial'
      ].includes(type))
      .map(type => {
        const totalUsers = userRows.filter(user => 
          user.licenses.some(l => l.productName === type)
        ).length;
        const costs = userRows.reduce((acc, user) => {
          const licenses = user.licenses.filter(l => l.productName === type);
          const monthlyCost = licenses.reduce((sum, license) => 
            sum + (SKU_PRICING[license.guid]?.monthlyPrice || 0), 0);
          const annualCost = licenses.reduce((sum, license) => 
            sum + (SKU_PRICING[license.guid]?.annualPrice || 0), 0);
          return {
            monthly: acc.monthly + monthlyCost,
            annual: acc.annual + annualCost
          };
        }, { monthly: 0, annual: 0 });
        
        return {
          type,
          totalUsers,
          totalMonthlyCost: costs.monthly,
          totalAnnualCost: costs.annual
        };
      })
      .sort((a, b) => {
        const sortVal = summarySort.direction === 'asc' ? 1 : -1;
        const aValue = a[summarySort.column as keyof typeof a];
        const bValue = b[summarySort.column as keyof typeof b];
        return sortVal * compareValues(aValue, bValue);
      });

    return summary;
  }, [userRows, licenseTypes, summarySort]);

  const licenseColumns = useMemo(() => {
    const usageCounts = licenseTypes.reduce((acc, type) => {
      acc[type] = userRows.filter(user => 
        user.licenses.some(l => l.productName === type)
      ).length;
      return acc;
    }, {} as Record<string, number>);

    return licenseTypes
      .filter(type => ![
        'AAD P1', 'Communications Credits', 'Microsoft 365 Phone System',
        'MICROSOFT FLOW FREE', 'Microsoft Teams Shared Devices',
        'Microsoft Teams Rooms Standard', 'Power BI (free)',
        'Power Pages vTrial for Makers', 'Power Virtual Agents Viral Trial'
      ].includes(type))
      .map(type => ({
        key: type,
        name: type,
        usageCount: usageCounts[type] || 0
      }))
      .sort((a, b) => b.usageCount - a.usageCount)
      .map(({ key, name }) => ({ key, name }));
  }, [licenseTypes, userRows]);

  const grandTotals = useMemo(() => {
    return userRows.reduce((acc, user) => ({
      users: acc.users + 1,
      monthly: acc.monthly + (user.totalMonthlyCost || 0),
      annual: acc.annual + (user.totalAnnualCost || 0)
    }), { users: 0, monthly: 0, annual: 0 });
  }, [userRows]);

  const activeUsers = useMemo(() => ({
    monthly: userRows.filter(user => user.totalMonthlyCost && user.totalMonthlyCost > 0).length,
    annual: userRows.filter(user => user.totalAnnualCost && user.totalAnnualCost > 0).length
  }), [userRows]);

  // Handlers
  const handleExport = useCallback((format: 'pdf' | 'csv' | 'excel' | 'html') => {
    try {
      switch (format) {
        case 'pdf': exportToPDF(filteredAndSearchedData); break;
        case 'csv': exportToCSV(filteredAndSearchedData); break;
        case 'excel': exportToExcel(filteredAndSearchedData); break;
        case 'html': exportToHTML(filteredAndSearchedData); break;
      }
    } catch (error) {
      console.error('Export error:', error);
      setError({ name: 'ExportError', message: 'Failed to export file', code: 'EXPORT_ERROR', details: error });
    }
  }, [filteredAndSearchedData, setError]);

  const formatCurrency = useCallback((value: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }, []);

  if (error) {
    return (
      <ErrorFallback 
        error={error} 
        resetErrorBoundary={() => setError(null)} 
      />
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="h-screen w-screen flex flex-col overflow-hidden bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <Header 
            fileName={fileName}
            searchTerm={searchTerm}
            selectedDepartments={selectedDepartments}
            departments={departments}
            selectedLicenseTypes={selectedLicenseTypes}
            licenseTypes={licenseTypes}
            showUnknownLicenses={showUnknownLicenses}
            hideZeroCostAccounts={hideZeroCostAccounts}
            onFileUpload={handleFileUpload}
            onExport={handleExport}
            onSearchChange={setSearchTerm}
            onDepartmentChange={setSelectedDepartments}
            onLicenseTypesChange={setSelectedLicenseTypes}
            onShowUnknownLicensesChange={setShowUnknownLicenses}
            onHideZeroCostAccountsChange={setHideZeroCostAccounts}
          />

          <MainContent 
            fileName={fileName}
            onFileDrop={handleFileDrop}
            licenseSummary={licenseSummary}
            summarySort={summarySort}
            onSummarySort={handleSummarySort}
            userRows={userRows}
            licenseColumns={licenseColumns}
            sortState={sortState}
            onSort={handleSort}
            grandTotals={grandTotals}
            activeUsers={activeUsers}
            formatCurrency={formatCurrency}
          />

          <Footer />
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default LicenseMapping;