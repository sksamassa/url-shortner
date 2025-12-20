'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, File, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

type FileStatus = 'idle' | 'uploading' | 'success' | 'error';

export default function BulkImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<FileStatus>('idle');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setStatus('idle');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    multiple: false,
  });

  const handleProcessFile = () => {
    if (!file) return;

    setStatus('uploading');
    // Simulate processing
    setTimeout(() => {
      // Simulate a random outcome
      const isSuccess = Math.random() > 0.2;
      setStatus(isSuccess ? 'success' : 'error');
    }, 2000);
  };

  const handleReset = () => {
    setFile(null);
    setStatus('idle');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Bulk URL Shortening</h1>
        <p className="text-muted-foreground">
          Upload a CSV file with your URLs to shorten them in batch.
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Upload CSV File</CardTitle>
          <CardDescription>
            The file should contain one URL per line in the first column.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === 'idle' && !file && (
            <div
              {...getRootProps()}
              className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors ${
                isDragActive ? 'border-primary bg-primary/10' : ''
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 text-muted-foreground" />
              <p className="mt-4 text-center text-muted-foreground">
                {isDragActive
                  ? 'Drop the file here...'
                  : 'Drag & drop a CSV file here, or click to select a file'}
              </p>
            </div>
          )}

          {file &&
            status !== 'uploading' &&
            status !== 'success' &&
            status !== 'error' && (
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center p-4 border rounded-md w-full">
                  <File className="w-6 h-6 mr-4 text-primary" />
                  <div className="flex-1">
                    <p className="font-semibold">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <div className="flex w-full gap-2">
                  <Button onClick={handleProcessFile} className="flex-1">
                    Process File
                  </Button>
                  <Button onClick={handleReset} variant="outline">
                    Choose another file
                  </Button>
                </div>
              </div>
            )}

          {status === 'uploading' && (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="mt-4 font-semibold">Processing file...</p>
              <p className="text-muted-foreground">
                Please wait while we shorten your URLs.
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <CheckCircle className="w-12 h-12 text-green-500" />
              <p className="mt-4 font-semibold">Processing Complete</p>
              <p className="text-muted-foreground">
                Your links have been shortened and added to your dashboard.
              </p>
              <Button onClick={handleReset} className="mt-4">
                Upload Another File
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <AlertCircle className="w-12 h-12 text-destructive" />
              <p className="mt-4 font-semibold">An Error Occurred</p>
              <p className="text-muted-foreground">
                We couldn't process your file. Please check the format and try
                again.
              </p>
              <Button onClick={handleReset} className="mt-4">
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
