export interface License {
  guid: string;
  productName: string;
}

export interface User {
  displayName: string;
  userPrincipalName: string;
  department: string;
  originalDepartment: string;
  licenses: License[];
}

export interface GroupedData {
  [department: string]: User[];
}

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