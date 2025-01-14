// GrandTotalsCard.tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { memo } from 'react';

interface GrandTotalsCardProps {
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

export const GrandTotalsCard = memo(function GrandTotalsCard({
  grandTotals,
  activeUsers,
  formatCurrency
}: GrandTotalsCardProps) {
  return (
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
              {formatCurrency(grandTotals.monthly / activeUsers.monthly)} per user
            </div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-lg font-semibold text-gray-700 dark:text-gray-100">Annual Cost</div>
            <div className="text-4xl font-bold mt-2 text-gray-700 dark:text-gray-100">
              {formatCurrency(grandTotals.annual)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {formatCurrency(grandTotals.annual / activeUsers.annual)} per user
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});