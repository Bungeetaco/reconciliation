import { Download, FileText } from 'lucide-react';

interface ActionButtonsProps {
  fileName: string;
  onExport: (format: 'pdf' | 'csv' | 'excel' | 'html') => void;
}

export function ActionButtons({ fileName, onExport }: ActionButtonsProps) {
  return (
    <>
      <button
        onClick={() => onExport('csv')}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!fileName}
      >
        <Download className="w-4 h-4 mr-2" />
        CSV
      </button>
      
      <button
        onClick={() => onExport('excel')}
        className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!fileName}
      >
        <Download className="w-4 h-4 mr-2" />
        Excel
      </button>
      
      <button
        onClick={() => onExport('html')}
        className="flex items-center px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!fileName}
      >
        <Download className="w-4 h-4 mr-2" />
        HTML
      </button>

      <button
        onClick={() => onExport('pdf')}
        className="flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!fileName}
      >
        <FileText className="w-4 h-4 mr-2" />
        PDF
      </button>
    </>
  );
}
