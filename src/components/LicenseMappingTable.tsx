import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LicenseMappingTableProps } from '../types/table';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMemo, useCallback, memo } from 'react';

const formatter = new Intl.NumberFormat('en-CA', {
  style: 'currency',
  currency: 'CAD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

const LicenseMappingTable = ({ 
  userRows, 
  licenseColumns, 
  sortState, 
  onSort 
}: LicenseMappingTableProps) => {
  const handleSort = useCallback((column: string) => {
    onSort({
      column,
      direction: 
        sortState.column === column && sortState.direction === 'asc'
          ? 'desc'
          : 'asc'
    });
  }, [sortState, onSort]);

  const SortIcon = useCallback(({ column }: { column: string }) => {
    if (sortState.column !== column) return null;
    return sortState.direction === 'asc' ? 
      <ChevronUp className="w-4 h-4 inline-block ml-1" /> : 
      <ChevronDown className="w-4 h-4 inline-block ml-1" />;
  }, [sortState]);

  const tableHeaders = useMemo(() => (
    <tr>
      <th 
        onClick={() => handleSort('displayName')}
        className={cn(
          "p-2 border border-gray-200 dark:border-gray-700 text-left bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700",
          sortState.column === 'displayName' && 'bg-blue-50 dark:bg-blue-900'
        )}
      >
        <div className="flex items-center justify-between">
          <span>Display Name</span>
          <SortIcon column="displayName" />
        </div>
      </th>
      <th 
        onClick={() => handleSort('userPrincipalName')}
        className={cn(
          "p-2 border border-gray-200 dark:border-gray-700 text-left bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700",
          sortState.column === 'userPrincipalName' && 'bg-blue-50 dark:bg-blue-900'
        )}
      >
        <div className="flex items-center justify-between">
          <span>Email</span>
          <SortIcon column="userPrincipalName" />
        </div>
      </th>
      <th 
        onClick={() => handleSort('department')}
        className={cn(
          "p-2 border border-gray-200 dark:border-gray-700 text-left bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700",
          sortState.column === 'department' && 'bg-blue-50 dark:bg-blue-900'
        )}
      >
        <div className="flex items-center justify-between">
          <span>Department</span>
          <SortIcon column="department" />
        </div>
      </th>
      <th 
        onClick={() => handleSort('totalMonthlyCost')}
        className={cn(
          "p-2 border border-gray-200 dark:border-gray-700 text-left bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700",
          sortState.column === 'totalMonthlyCost' && 'bg-blue-50 dark:bg-blue-900'
        )}
      >
        <div className="flex items-center justify-between">
          <span>Monthly Cost</span>
          <SortIcon column="totalMonthlyCost" />
        </div>
      </th>
      <th 
        onClick={() => handleSort('totalAnnualCost')}
        className={cn(
          "p-2 border border-gray-200 dark:border-gray-700 text-left bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700",
          sortState.column === 'totalAnnualCost' && 'bg-blue-50 dark:bg-blue-900'
        )}
      >
        <div className="flex items-center justify-between">
          <span>Annual Cost</span>
          <SortIcon column="totalAnnualCost" />
        </div>
      </th>
      {licenseColumns.map((license) => (
        <th 
          key={license.key} 
          className="p-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          title={`${license.name} (${userRows.filter(user => 
            user.licenses.some(l => l.productName === license.name)
          ).length} users)`}
        >
          {license.name}
        </th>
      ))}
    </tr>
  ), [sortState, handleSort, SortIcon, licenseColumns, userRows]);

  const tableRows = useMemo(() => 
    userRows.map((user, index) => (
      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
        <td className="p-2 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">{user.displayName}</td>
        <td className="p-2 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">{user.userPrincipalName}</td>
        <td className="p-2 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">{user.department}</td>
        <td className="p-2 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-right">
          {formatter.format(user.totalMonthlyCost ?? 0)}
        </td>
        <td className="p-2 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-right">
          {formatter.format(user.totalAnnualCost ?? 0)}
        </td>
        {licenseColumns.map((license) => (
          <td 
            key={license.key} 
            className="p-2 border border-gray-200 dark:border-gray-700 text-center text-gray-900 dark:text-gray-100"
          >
            <div className="flex items-center justify-center">
              {user.licenses.some(l => l.productName === license.name) ? '✓' : ''}
            </div>
          </td>
        ))}
      </tr>
    )),
    [userRows, licenseColumns]
  );

  return (
    <Card className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <CardHeader className="bg-gray-50 dark:bg-gray-800 rounded-t-lg border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="text-center text-gray-900 dark:text-gray-100">License Mapping</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="overflow-auto max-h-[600px] scrollbar scrollbar-w-4 hover:scrollbar-w-5 scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 dark:scrollbar-thumb-gray-500 dark:hover:scrollbar-thumb-gray-400 scrollbar-track-transparent hover:scrollbar-track-gray-200 dark:hover:scrollbar-track-gray-800 transition-all duration-100">
          <table className="w-full border-collapse min-w-[800px] border border-gray-200 dark:border-gray-700">
            <thead className="sticky top-0 z-10">
              {tableHeaders}
            </thead>
            <tbody>
              {tableRows}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(LicenseMappingTable);
