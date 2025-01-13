import { User } from '../types';
import { SortState } from './sorting';

export interface LicenseColumn {
  key: string;
  name: string;
}

export interface LicenseMappingTableProps {
  userRows: User[];
  licenseColumns: LicenseColumn[];
  sortState: SortState;
  onSort: (newState: SortState) => void;
}
