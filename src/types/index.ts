export interface License {
  guid: string;
  productName: string;
  monthlyPrice?: number;
  annualPrice?: number;
}

export interface User {
  displayName: string;
  userPrincipalName: string;
  department: string;
  originalDepartment: string;
  licenses: License[];
  totalMonthlyCost: number;
  totalAnnualCost: number;
  costPerUser?: number;
}

export type GroupedData = Record<string, User[]>;

export interface GrandTotals {
  monthly: number;
  annual: number;
  users: number;
}

export interface SKUPricing {
  monthlyPrice: number;
  annualPrice: number;
  description: string;
}

export interface SKUMapping {
  [key: string]: string;
}