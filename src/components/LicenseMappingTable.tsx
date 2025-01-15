import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LicenseMappingTableProps } from '../types/table';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMemo, useCallback, memo, useState, useRef, useEffect } from 'react';
import { VariableSizeList as List } from 'react-window'; // Changed to VariableSizeList
import AutoSizer from 'react-virtualized-auto-sizer';
import memoize from 'lodash/memoize';
import debounce from 'lodash/debounce';
import type { User } from '@/types'; // Import User type from types
import type { SortState } from '@/types/sorting'; // Import SortState type from sorting

interface RowData {
  items: User[];
  licenseColumns: LicenseColumn[];
}

interface LicenseColumn {
  key: string;
  name: string;
}

interface RowProps {
  index: number;
  style: React.CSSProperties;
  data: RowData;
}

interface TableHeaderProps {
  licenseColumns: LicenseColumn[];
  sortState: SortState;
  onSort: (sort: SortState) => void;
}

const ROW_HEIGHT = 60; // Increased for better readability and to prevent overlap
const HEADER_HEIGHT = 45;
const MIN_TABLE_HEIGHT = 400;
const OVERSCAN_COUNT = 10; // Increased for smoother scrolling
const SCROLL_DEBOUNCE = 100;

const formatter = new Intl.NumberFormat('en-CA', {
  style: 'currency',
  currency: 'CAD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

// Memoize row renderer for better performance
const createItemData = memoize((items: User[], licenseColumns: LicenseColumn[]): RowData => ({
  items,
  licenseColumns,
}));

const Row = memo(({ index, style, data }: RowProps) => {
  const { items, licenseColumns } = data;
  const user = items[index];

  return (
    <div 
      role="row"
      data-index={index}
      style={{ 
        ...style, 
        height: ROW_HEIGHT,
        display: 'flex',
        alignItems: 'center',
        position: 'absolute',
        top: index * ROW_HEIGHT,
        width: '100%'
      }}
      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      tabIndex={0}
    >
      <div role="cell" className="flex-1 min-w-[200px] p-2">{user.displayName}</div>
      <div role="cell" className="flex-1 min-w-[200px] p-2">{user.userPrincipalName}</div>
      <div role="cell" className="flex-1 min-w-[250px] p-2">{user.department}</div> {/* Increased min-width */}
      <div role="cell" className="w-[120px] text-right p-2">{formatter.format(user.totalMonthlyCost ?? 0)}</div>
      <div role="cell" className="w-[120px] text-right p-2">{formatter.format(user.totalAnnualCost ?? 0)}</div>
      {licenseColumns.map((license) => (
        <div 
          key={license.key} 
          role="cell"
          className="w-[80px] text-center p-2"
        >
          {user.licenses.some(l => l.productName === license.name) ? '✓' : ''}
        </div>
      ))}
    </div>
  );
});
Row.displayName = 'Row';

const TableHeader = memo(({ licenseColumns, sortState, onSort }: TableHeaderProps) => {
  const handleSort = useCallback((column: string) => {
    onSort({
      column,
      direction: sortState.column === column && sortState.direction === 'asc' ? 'desc' : 'asc'
    });
  }, [sortState, onSort]);

  const SortIcon = useCallback(({ column }: { column: string }) => {
    if (sortState.column !== column) return null;
    return sortState.direction === 'asc' ? 
      <ChevronUp className="w-4 h-4 inline-block ml-1" /> : 
      <ChevronDown className="w-4 h-4 inline-block ml-1" />;
  }, [sortState]);

  return (
    <div className="flex items-center font-semibold bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
      <div 
        onClick={() => handleSort('displayName')}
        className={cn(
          "flex-1 min-w-[200px] p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700",
          sortState.column === 'displayName' && 'bg-blue-50 dark:bg-blue-900'
        )}
      >
        <span>Display Name</span>
        <SortIcon column="displayName" />
      </div>
      <div 
        onClick={() => handleSort('userPrincipalName')}
        className={cn(
          "flex-1 min-w-[200px] p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700",
          sortState.column === 'userPrincipalName' && 'bg-blue-50 dark:bg-blue-900'
        )}
      >
        <span>Email</span>
        <SortIcon column="userPrincipalName" />
      </div>
      <div 
        onClick={() => handleSort('department')}
        className={cn(
          "flex-1 min-w-[250px] p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700", // Increased min-width
          sortState.column === 'department' && 'bg-blue-50 dark:bg-blue-900'
        )}
      >
        <span>Department</span>
        <SortIcon column="department" />
      </div>
      <div 
        onClick={() => handleSort('totalMonthlyCost')}
        className={cn(
          "w-[120px] p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700",
          sortState.column === 'totalMonthlyCost' && 'bg-blue-50 dark:bg-blue-900'
        )}
      >
        <span>Monthly Cost</span>
        <SortIcon column="totalMonthlyCost" />
      </div>
      <div 
        onClick={() => handleSort('totalAnnualCost')}
        className={cn(
          "w-[120px] p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700",
          sortState.column === 'totalAnnualCost' && 'bg-blue-50 dark:bg-blue-900'
        )}
      >
        <span>Annual Cost</span>
        <SortIcon column="totalAnnualCost" />
      </div>
      {licenseColumns.map((license: any) => (
        <div 
          key={license.key}
          className="w-[80px] p-2 text-center"
          title={`${license.name}`}
        >
          {license.name}
        </div>
      ))}
    </div>
  );
});
TableHeader.displayName = 'TableHeader';

const LicenseMappingTable = ({ 
  userRows, 
  licenseColumns, 
  sortState, 
  onSort 
}: LicenseMappingTableProps) => {
  const [tableHeight, setTableHeight] = useState(500);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<List>(null);
  const scrollPositionRef = useRef(0);

  // Dynamic height calculation
  useEffect(() => {
    const updateHeight = debounce(() => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const footerHeight = 60; // Approximate footer height
      const availableHeight = window.innerHeight - rect.top - footerHeight;
      const newHeight = Math.max(MIN_TABLE_HEIGHT, availableHeight);
      
      // Only update if height changed significantly
      if (Math.abs(newHeight - tableHeight) > 10) {
        setTableHeight(newHeight);
      }
    }, SCROLL_DEBOUNCE);

    const resizeObserver = new ResizeObserver(updateHeight);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', updateHeight);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateHeight);
      updateHeight.cancel();
    };
  }, [tableHeight]);

  const handleScroll = useCallback(({ scrollOffset }: { scrollOffset: number }) => {
    scrollPositionRef.current = scrollOffset;
  }, []);

  // Reset list when data changes
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo(scrollPositionRef.current);
      listRef.current.resetAfterIndex(0, true); // Added second parameter true
    }
  }, [userRows]);

  // Memoize item data
  const itemData = useMemo(() => 
    createItemData(userRows, licenseColumns),
    [userRows, licenseColumns]
  );

  const totalWidth = useMemo(() => 
    790 + (licenseColumns.length * 80), // Base width + license columns
    [licenseColumns.length]
  );

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    const target = event.target as HTMLElement;
    const currentIndex = parseInt(target.getAttribute('data-index') || '-1');
    
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
      case 'Home':
      case 'End':
        event.preventDefault();
        let nextIndex = currentIndex;
        
        if (event.key === 'ArrowDown' && currentIndex < userRows.length - 1) {
          nextIndex = currentIndex + 1;
        } else if (event.key === 'ArrowUp' && currentIndex > 0) {
          nextIndex = currentIndex - 1;
        } else if (event.key === 'Home') {
          nextIndex = 0;
        } else if (event.key === 'End') {
          nextIndex = userRows.length - 1;
        }

        if (nextIndex !== currentIndex) {
          const nextElement = document.querySelector(`[data-index="${nextIndex}"]`);
          if (nextElement instanceof HTMLElement) {
            nextElement.focus();
            listRef.current?.scrollToItem(nextIndex, 'smart');
          }
        }
        break;
    }
  }, [userRows.length]);

  return (
    <Card className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <CardHeader className="bg-gray-50 dark:bg-gray-800 rounded-t-lg border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="text-center text-gray-900 dark:text-gray-100">License Mapping</CardTitle>
      </CardHeader>
      <CardContent className="p-0" ref={containerRef}>
        <div 
          role="grid"
          aria-rowcount={userRows.length}
          aria-colcount={5 + licenseColumns.length}
          style={{ height: tableHeight }} 
          className="w-full overflow-hidden relative"
          onKeyDown={handleKeyDown}
        >
          <AutoSizer>
            {({ height, width }) => (
              <div style={{ width, height }} className="relative">
                <div className="absolute inset-0">
                  <div className="overflow-x-auto h-full">
                    <div style={{ width: totalWidth, height: '100%', position: 'relative' }}>
                      <TableHeader 
                        licenseColumns={licenseColumns}
                        sortState={sortState}
                        onSort={onSort}
                      />
                      <List
                        ref={listRef}
                        height={height - HEADER_HEIGHT}
                        width={totalWidth}
                        itemCount={userRows.length}
                        itemSize={() => ROW_HEIGHT} // Changed to function for VariableSizeList
                        itemData={itemData}
                        itemKey={(index) => userRows[index].userPrincipalName}
                        overscanCount={OVERSCAN_COUNT}
                        onScroll={handleScroll}
                        className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent"
                      >
                        {Row}
                      </List>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </AutoSizer>
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(LicenseMappingTable);