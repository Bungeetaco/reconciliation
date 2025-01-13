import { memo } from 'react';
import { cn } from '@/lib/utils';

interface DataTableColumn<T> {
  key: string;
  header: string | React.ReactNode;
  cell: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  sortColumn?: string;
  onSort?: (column: string) => void;
  className?: string;
}

function DataTable<T>({ 
  data, 
  columns, 
  sortColumn, 
  onSort,
  className 
}: DataTableProps<T>) {
  return (
    <div className={cn("overflow-auto", className)}>
      <table className="w-full border-collapse">
        <thead className="sticky top-0 bg-white z-10">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                onClick={() => column.sortable && onSort?.(column.key)}
                className={cn(
                  "p-2 border text-left bg-gray-50 font-semibold",
                  column.sortable && "cursor-pointer hover:bg-gray-100",
                  column.className,
                  sortColumn === column.key && "bg-blue-50"
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td key={column.key} className="p-2 border">
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default memo(DataTable) as typeof DataTable;
