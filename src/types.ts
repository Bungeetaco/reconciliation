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
  totalMonthlyCost?: number;
  totalAnnualCost?: number;
}

export interface GroupedData {
  [department: string]: User[];
}

export interface ParsedUser {
  DisplayName: string;
  UserPrincipalName: string;
  Department?: string;
  Licenses: string;
}
