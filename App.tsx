import React, { useState } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { Dashboard } from './components/Dashboard';
import { Loader } from './components/Loader';
import { ErrorDisplay } from './components/ErrorDisplay';
import { extractDataFromPdf } from './services/geminiService';
import type { ProcessedReport } from './types';

const App: React.FC = () => {
  const [processedReports, setProcessedReports] = useState<ProcessedReport[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileProcess = async (files: File[]) => {
    setIsLoading(true);
    setError(null);
    setProcessedReports([]);

    const processFile = (file: File): Promise<ProcessedReport> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          try {
            const base64String = (reader.result as string).split(',')[1];
            const data = await extractDataFromPdf(base64String, file.type);
            resolve({ fileName: file.name, data });
          } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during PDF processing.';
            reject(new Error(`Failed to process ${file.name}: ${errorMessage}`));
          }
        };
        reader.onerror = (error) => {
          console.error("FileReader error: ", error);
          reject(new Error(`Failed to read the file: ${file.name}.`));
        };
      });
    };

    try {
      const results = await Promise.all(files.map(processFile));
      setProcessedReports(results);
    } catch (e) {
      console.error("Error processing files:", e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`An error occurred while processing the files. ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setProcessedReports([]);
    setError(null);
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen font-sans">
      <Header onReset={handleReset} showReset={processedReports.length > 0 || isLoading || !!error} />
      <main className="container mx-auto p-4 md:p-8">
        {processedReports.length === 0 && !isLoading && !error && (
          <FileUpload onFileProcess={handleFileProcess} />
        )}
        {isLoading && <Loader />}
        {error && !isLoading && <ErrorDisplay message={error} onRetry={handleReset} />}
        {processedReports.length > 0 && !isLoading && (
            <div className="space-y-16">
                {processedReports.map((report, index) => (
                    <Dashboard key={index} report={report} />
                ))}
            </div>
        )}
      </main>
      <footer className="text-center p-6 text-gray-500 text-xs">
        <p>Dar Rhizlane Marrakech &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default App;