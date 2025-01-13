import { useState, useCallback } from 'react';
import { GroupedData, ParsedUser } from '@/types';
import Papa from 'papaparse';
import { mapLicensesData } from '@/helpers/filter-helpers';
import _ from 'lodash';
import { ErrorCodes, LicenseError } from '@/types/errors';

export interface UseLicenseDataReturn {
  groupedData: GroupedData;
  loading: boolean;
  fileName: string;
  error: LicenseError | null;
  setError: (error: LicenseError | null) => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleFileDrop: (event: React.DragEvent<HTMLDivElement>) => Promise<void>;
}

export function useLicenseData(): UseLicenseDataReturn {
  const [groupedData, setGroupedData] = useState<GroupedData>({});
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState<LicenseError | null>(null);

  const processFile = async (file: File) => {
    if (!file) {
      setFileName('');
      setGroupedData({});
      return;
    }
    
    setLoading(true);
    try {
      const text = await file.text();
      const result = Papa.parse<ParsedUser>(text, {
        header: true,
        skipEmptyLines: true,
        transformHeader: header => header.trim(),
        transform: value => value.trim()
      });
      
      if (result.errors.length > 0) {
        throw new Error('Error parsing CSV: ' + result.errors[0].message);
      }

      const licenses = result.data;
      const mappedData = mapLicensesData(licenses);
      const grouped = _.groupBy(mappedData, 'department');
      const sortedGrouped = _.mapValues(grouped, users => 
        _.sortBy(users, ['displayName'])
      );
      
      setGroupedData(sortedGrouped);
      setFileName(file.name);
    } catch (error) {
      const licenseError = new LicenseError(
        'Error loading file',
        ErrorCodes.FILE_PARSE_ERROR,
        error
      );
      setError(licenseError);
      console.error(licenseError);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) await processFile(file);
  }, []);

  const handleFileDrop = useCallback(async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) await processFile(file);
  }, []);

  return {
    groupedData,
    loading,
    fileName,
    error,
    setError,
    handleFileUpload,
    handleFileDrop
  };
}
