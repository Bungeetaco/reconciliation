// GrandTotalsCard.tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { memo } from 'react';
import { useTheme } from 'next-themes';

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
  const { theme } = useTheme();
  const gradientClass = theme === 'dark' 
    ? 'from-[#007a3d] via-[#0f714b] to-[#1e6759]'
    : 'from-[#1e6759] via-[#0f714b] to-[#007a3d]';

  return (
    <Card className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
      <CardHeader className={`bg-gradient-to-r ${gradientClass} border-b border-gray-200 dark:border-gray-700 py-4`}>
        <CardTitle className="text-center text-white text-xl">License Summary</CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-6">
          <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-lg font-semibold text-gray-700 dark:text-gray-100">Total Users</div>
            <div className="text-4xl font-bold mt-3">
              {grandTotals.users.toLocaleString()}
            </div>
          </div>
          
          <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-lg font-semibold text-gray-700 dark:text-gray-100">Monthly Cost</div>
            <div className="text-4xl font-bold mt-3 text-gray-700 dark:text-gray-100">
              {formatCurrency(grandTotals.monthly)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {formatCurrency(grandTotals.monthly / activeUsers.monthly)} per user
            </div>
          </div>
          
          <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-lg font-semibold text-gray-700 dark:text-gray-100">Annual Cost</div>
            <div className="text-4xl font-bold mt-3 text-gray-700 dark:text-gray-100">
              {formatCurrency(grandTotals.annual)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {formatCurrency(grandTotals.annual / activeUsers.annual)} per user
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});