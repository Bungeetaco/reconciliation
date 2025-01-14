// PriceSummaryCard.tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { memo } from 'react';

interface PriceSummaryProps {
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
  formatCurrency: (value: number) => string;
}

export const PriceSummaryCard = memo(function PriceSummaryCard({
  licenseSummary,
  summarySort,
  onSummarySort,
  formatCurrency
}: PriceSummaryProps) {
  return (
    <Card className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <CardHeader className="bg-gray-50 dark:bg-gray-800 rounded-t-lg border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="text-center">License Price Summary</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[800px] border border-gray-200 dark:border-gray-700">
            <thead className="bg-white dark:bg-gray-700">
              <tr>
                {[
                  { key: 'type', label: 'License Type' },
                  { key: 'totalUsers', label: 'Total Users' },
                  { key: 'totalMonthlyCost', label: 'Total Monthly Cost' },
                  { key: 'totalAnnualCost', label: 'Total Annual Cost' }
                ].map(({ key, label }) => (
                  <th 
                    key={key}
                    onClick={() => onSummarySort(key)}
                    className={cn(
                      "p-2 border text-left bg-gray-50 dark:bg-gray-800 font-semibold cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600",
                      summarySort.column === key && 'bg-blue-50 dark:bg-blue-900'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span>{label}</span>
                      {summarySort.column === key && (
                        summarySort.direction === 'asc' ? 
                          <ChevronUp className="w-4 h-4 text-blue-600" /> : 
                          <ChevronDown className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {licenseSummary.map((license, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="p-2 border border-gray-200 dark:border-gray-700">{license.type}</td>
                  <td className="p-2 border border-gray-200 dark:border-gray-700">{license.totalUsers}</td>
                  <td className="p-2 border border-gray-200 dark:border-gray-700 text-right">
                    {formatCurrency(license.totalMonthlyCost)}
                  </td>
                  <td className="p-2 border border-gray-200 dark:border-gray-700 text-right">
                    {formatCurrency(license.totalAnnualCost)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
});