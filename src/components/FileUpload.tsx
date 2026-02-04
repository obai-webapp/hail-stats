import { useCallback, useState } from 'react';
import { Upload, FileJson, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileLoad: (data: unknown) => void;
  className?: string;
}

export function FileUpload({ onFileLoad, className }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    setError(null);
    setFileName(file.name);
    
    if (!file.name.endsWith('.json')) {
      setError('Please upload a JSON file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (!Array.isArray(data)) {
          setError('Expected an array of Label Studio tasks');
          return;
        }
        onFileLoad(data);
      } catch {
        setError('Invalid JSON file');
      }
    };
    reader.onerror = () => setError('Failed to read file');
    reader.readAsText(file);
  }, [onFileLoad]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  return (
    <div className={className}>
      <label
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          'group flex flex-col items-center justify-center w-full h-64 border-2 border-dashed cursor-pointer transition-all',
          isDragging 
            ? 'border-accent bg-accent/10' 
            : 'border-foreground hover:bg-secondary/50',
          error && 'border-destructive'
        )}
      >
        <div className="flex flex-col items-center justify-center p-8">
          {fileName && !error ? (
            <>
              <FileJson className="w-12 h-12 mb-4 text-foreground" strokeWidth={1.5} />
              <p className="text-lg font-bold text-foreground">{fileName}</p>
              <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mt-2">
                Drop another to replace
              </p>
            </>
          ) : (
            <>
              <Upload 
                className={cn(
                  "w-12 h-12 mb-4 transition-transform group-hover:-translate-y-1",
                  isDragging ? "text-accent" : "text-foreground"
                )} 
                strokeWidth={1.5} 
              />
              <p className="text-lg font-bold text-foreground mb-1">
                Drop JSON here
              </p>
              <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                Or click to browse
              </p>
            </>
          )}
        </div>
        <input 
          type="file" 
          className="hidden" 
          accept=".json"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </label>
      {error && (
        <div className="flex items-center gap-2 mt-4 text-sm text-destructive font-medium">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
}
