import { User } from '../types';
import { SortState } from '../types/sorting';

// Helper function to safely compare values of different types
export const compareValues = (a: any, b: any): number => {
  // Handle null/undefined values
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;

  // Handle numbers
  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }

  // Handle strings (case-insensitive)
  if (typeof a === 'string' && typeof b === 'string') {
    return a.toLowerCase().localeCompare(b.toLowerCase());
  }

  // Convert to strings for mixed types
  return String(a).toLowerCase().localeCompare(String(b).toLowerCase());
};

// Helper function to get the value to sort by from a user object
const getSortValue = (user: User, column: string): any => {
  switch (column) {
    case 'displayName':
    case 'userPrincipalName':
    case 'department':
      return user[column];
    case 'totalMonthlyCost':
    case 'totalAnnualCost':
      return user[column] || 0; // Use 0 for null/undefined costs
    default:
      return null;
  }
};

export const sortUserRows = (users: User[], sortState: SortState): User[] => {
  const { column, direction } = sortState;
  if (!column || !direction) return users;

  return [...users].sort((a, b) => {
    const aValue = getSortValue(a, column);
    const bValue = getSortValue(b, column);
    
    const compareResult = compareValues(aValue, bValue);
    return direction === 'asc' ? compareResult : -compareResult;
  });
};
