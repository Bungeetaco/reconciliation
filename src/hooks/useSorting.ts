import { useState, useCallback } from 'react';
import { SortDirection } from '@/types/sorting';

interface UseSortingProps {
  defaultColumn?: string;
  defaultDirection?: SortDirection;
}

export function useSorting({ 
  defaultColumn = '', 
  defaultDirection = 'asc' 
}: UseSortingProps = {}) {
  const [sortState, setSortState] = useState({
    column: defaultColumn,
    direction: defaultDirection
  });

  const handleSort = useCallback((column: string) => {
    setSortState(prev => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  return {
    sortState,
    handleSort
  };
}
