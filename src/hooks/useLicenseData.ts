import { useState, useCallback, useEffect } from 'react';
import { GroupedData, ParsedUser } from '@/types';
import Papa from 'papaparse';
import { mapLicensesData } from '@/helpers/filter-helpers';
import _ from 'lodash';
import { LicenseError } from '@/types/errors';
import localforage from 'localforage';

export interface UseLicenseDataReturn {
  groupedData: GroupedData;
  loading: boolean;
  fileName: string;
  error: LicenseError | null;
  setError: (error: LicenseError | null) => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleFileDrop: (event: React.DragEvent<HTMLDivElement>) => Promise<void>;
  setGroupedData: (data: GroupedData) => void;
}

const CACHE_KEY = 'licenseDataCache';

export function useLicenseData(): UseLicenseDataReturn {
  const [groupedData, setGroupedData] = useState<GroupedData>({});
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState<LicenseError | null>(null);

  useEffect(() => {
    const loadCachedData = async () => {
      const cachedData = await localforage.getItem<{ groupedData: GroupedData; fileName: string }>(CACHE_KEY);
      if (cachedData) {
        setGroupedData(cachedData.groupedData);
        setFileName(cachedData.fileName);
      }
    };
    loadCachedData();
  }, []);

  const processFile = async (file: File) => {
    if (!file) {
      setFileName('');
      setGroupedData({});
      return;
    }

    setError(null);

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (file.type !== 'text/csv' && fileExtension !== 'csv') {
      const licenseError = new LicenseError(
        'Invalid file type - Only CSV files are supported',
        'INVALID_FILE_TYPE',
        { fileType: file.type, extension: fileExtension }
      );
      setError(licenseError);
      console.error('File type error:', licenseError);
      return;
    }

    setLoading(true);
    try {
      const text = await file.text();
      Papa.parse<ParsedUser>(text, {
        header: true,
        skipEmptyLines: true,
        transformHeader: header => header.trim(),
        transform: value => value.trim(),
        complete: (results) => {
          if (results.errors.length > 0) {
            throw new LicenseError(
              'CSV parsing failed',
              'CSV_PARSE_ERROR',
              { errors: results.errors }
            );
          }

          if (!results.data.length) {
            throw new LicenseError(
              'CSV file is empty',
              'EMPTY_FILE_ERROR',
              { fileName: file.name }
            );
          }

          const licenses = results.data.filter(user => 
            user.UserPrincipalName && !user.UserPrincipalName.includes('#EXT#')
          );

          if (!licenses.length) {
            throw new LicenseError(
              'No valid license data found',
              'NO_DATA_ERROR',
              { fileName: file.name }
            );
          }

          const mappedData = mapLicensesData(licenses);
          const grouped = _.groupBy(mappedData, 'department');
          const sortedGrouped = _.mapValues(grouped, users => 
            _.sortBy(users, ['displayName'])
          );

          setGroupedData(sortedGrouped);
          setFileName(file.name);

          localforage.setItem(CACHE_KEY, { 
            groupedData: sortedGrouped, 
            fileName: file.name 
          }).catch(error => {
            console.warn('Failed to cache license data:', error);
          });
        }
      });
    } catch (error) {
      const licenseError = error instanceof LicenseError ? error : new LicenseError(
        'Error loading file',
        'FILE_PARSE_ERROR',
        error
      );
      setError(licenseError);
      console.error('Error processing file:', licenseError);
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
    handleFileDrop,
    setGroupedData
  };
}
