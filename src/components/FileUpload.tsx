import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileName: string;
}

export function FileUpload({ onFileUpload, fileName }: FileUploadProps) {
  return (
    <div className="relative">
      <input 
        type="file" 
        accept=".csv"
        onChange={onFileUpload}
        className="hidden"
        id="file-upload"
      />
      <label 
        htmlFor="file-upload"
        className="flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded text-sm font-semibold hover:bg-blue-100 cursor-pointer"
      >
        <Upload className="w-4 h-4 mr-2" />
        Browse...
      </label>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
        {fileName || "No file selected"}
      </p>
    </div>
  );
}
