import { User } from '../types';
import { SortState } from './sorting';

/** Defines properties for a license table column */
export interface LicenseColumn {
  /** Unique identifier for the column */
  key: string;
  /** Display name shown in column header */
  name: string;
  /** Optional width for the column (e.g. '100px', '10%') */
  width?: string;
  /** Text alignment within column */
  align?: 'left' | 'center' | 'right';
}

/** Props for the LicenseMappingTable component */
export interface LicenseMappingTableProps {
  /** Array of user data to display */
  userRows: User[];
  /** Column definitions for the table */
  licenseColumns: LicenseColumn[];
  /** Current sort state */
  sortState: SortState;
  /** Handler for sort state changes */
  onSort: (newState: SortState) => void;
}