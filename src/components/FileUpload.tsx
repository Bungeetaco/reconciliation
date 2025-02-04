import { Upload } from 'lucide-react';
import { useCallback, useState } from 'react';

interface FileUploadProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileName: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function FileUpload({ onFileUpload, fileName }: FileUploadProps) {
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0];
    
    if (!file) {
      return;
    }

    // Validate file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (file.type !== 'text/csv' && fileExtension !== 'csv') {
      setError('Please upload a CSV file');
      event.target.value = '';
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError(`File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      event.target.value = '';
      return;
    }

    onFileUpload(event);
  }, [onFileUpload]);

  return (
    <div className="relative">
      <input 
        type="file" 
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />
      <label 
        htmlFor="file-upload"
        className="flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded text-sm font-semibold hover:bg-blue-100 cursor-pointer transition-colors"
      >
        <Upload className="w-4 h-4 mr-2" />
        Browse...
      </label>
      {error ? (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      ) : (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {fileName || "No file selected"}
        </p>
      )}
      <p className="text-xs text-gray-500 mt-1">
        Maximum file size: {MAX_FILE_SIZE / (1024 * 1024)}MB
      </p>
    </div>
  );
}
