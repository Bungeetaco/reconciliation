// MainContent.tsx
import { Upload } from 'lucide-react';
import { memo } from 'react';
import { PriceSummaryCard } from './PriceSummaryCard';
import { GrandTotalsCard } from './GrandTotalsCard';
import LicenseMappingTable from './LicenseMappingTable';
import { SortState } from '../types/sorting';

interface MainContentProps {
  fileName: string;
  onFileDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  licenseSummary: Array<{
    type: string;
    totalUsers: number;
    totalMonthlyCost: number;
    totalAnnualCost: number;
  }>;
  summarySort: {
    column: string;
    direction: 'asc' | 'desc' | null;
  };
  onSummarySort: (column: string) => void;
  userRows: any[];
  licenseColumns: any[];
  sortState: SortState;
  onSort: (column: string) => void;
  grandTotals: {
    users: number;
    monthly: number;
    annual: number;
  };
  activeUsers: {
    monthly: number;
    annual: number;
  };
  formatCurrency: (value: number) => string;
}

export const MainContent = memo(function MainContent({
  fileName,
  onFileDrop,
  licenseSummary,
  summarySort,
  onSummarySort,
  userRows,
  licenseColumns,
  sortState,
  onSort,
  grandTotals,
  activeUsers,
  formatCurrency
}: MainContentProps) {
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div 
      className="flex-1 min-h-0 w-full overflow-auto bg-gray-50 dark:bg-gray-900"
      onDrop={onFileDrop}
      onDragOver={handleDragOver}
    >
      <div className="h-full p-4">
        {fileName ? (
          <div className="flex flex-col gap-4">
            <PriceSummaryCard 
              licenseSummary={licenseSummary}
              summarySort={summarySort}
              onSummarySort={onSummarySort}
              formatCurrency={formatCurrency}
            />

            <LicenseMappingTable 
              userRows={userRows}
              licenseColumns={licenseColumns}
              sortState={sortState}
              onSort={(newState: SortState) => onSort(newState.column)}
            />

            <GrandTotalsCard 
              grandTotals={grandTotals}
              activeUsers={activeUsers}
              formatCurrency={formatCurrency}
            />
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
  );
});
