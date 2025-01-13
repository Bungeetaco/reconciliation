export type SortDirection = 'asc' | 'desc' | null;

export interface SortState {
  column: string;
  direction: SortDirection;
}

export interface LicenseSummarySort {
  column: 'type' | 'totalUsers' | 'totalMonthlyCost' | 'totalAnnualCost';
  direction: SortDirection;
}
