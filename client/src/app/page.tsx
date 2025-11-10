'use client';
import { useState } from 'react';
import Link from 'next/link';
import { apiService } from '@/services/api';
import { StartImportResponse, TriggerAllResponse } from '@/types';

interface JobApi {
  name: string;
  url: string;
  description: string;
}

export default function Home() {
  const [importResult, setImportResult] = useState<StartImportResponse | TriggerAllResponse | null>(null);
  const [loadingAll, setLoadingAll] = useState<boolean>(false);
  const [loadingIndividual, setLoadingIndividual] = useState<string | null>(null);

  const startImport = async (apiUrl: string): Promise<void> => {
    try {
      setLoadingIndividual(apiUrl);
      setImportResult(null);

      const result = await apiService.startImport(apiUrl);
      setImportResult(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setImportResult({ 
        message: 'Failed to start import',
        error: errorMessage 
      } as StartImportResponse);
    } finally {
      setLoadingIndividual(null);
    }
  };

  const startAllImports = async (): Promise<void> => {
    try {
      setLoadingAll(true);
      setImportResult(null);

      const result = await apiService.triggerAllImports();
      setImportResult(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setImportResult({ 
        message: 'Failed to start imports',
        error: errorMessage
      } as Partial<TriggerAllResponse>);
    } finally {
      setLoadingAll(false);
    }
  };

  const jobApis: JobApi[] = [
    {
      name: 'Jobicy - All Jobs',
      url: 'https://jobicy.com/?feed=job_feed',
      description: 'Get all remote jobs from Jobicy'
    },
    {
      name: 'Jobicy - Data Science',
      url: 'https://jobicy.com/?feed=job_feed&job_categories=data-science',
      description: 'Data science remote jobs'
    },
    {
      name: 'HigherEd Jobs',
      url: 'https://www.higheredjobs.com/rss/articleFeed.cfm',
      description: 'Academic and education jobs'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Job Importer</h1>
              <p className="text-gray-600">Scalable job import system with queue processing</p>
            </div>
            <nav className="flex space-x-4">
              <Link 
                href="/" 
                className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link 
                href="/import-history" 
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Import History
              </Link>
              <Link 
                href="/job" 
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                View Jobs
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Quick Actions - UPDATED WITH JOBS BUTTON */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md-grid-cols-3 gap-4 mb-6">
            <button
              onClick={startAllImports}
              disabled={loadingAll}
              className="btn btn-primary"
            >
              {loadingAll ? 'Starting...' : 'Import All Job Sources'}
            </button>
            <Link
              href="/import-history"
              className="btn btn-secondary text-center"
            >
              View Import History
            </Link>
            <Link
              href="/job"
              className="btn bg-purple-600 text-white hover:bg-purple-700 text-center"
            >
              View All Jobs
            </Link>
          </div>
        </div>

        {/* Import Results */}
        {importResult && (
          <div className={`p-4 rounded-lg mb-6 ${
            importResult.error ? 'bg-red-100 border border-red-300' : 'bg-green-100 border border-green-300'
          }`}>
            <pre className="text-sm whitespace-pre-wrap">
              {JSON.stringify(importResult, null, 2)}
            </pre>
          </div>
        )}

        {/* Individual Job Sources */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Individual Job Sources</h2>
          <div className="grid grid-cols-1 md-grid-cols-3 gap-6">
            {jobApis.map((api, index) => (
              <div key={index} className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{api.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{api.description}</p>
                <button
                  onClick={() => startImport(api.url)}
                  disabled={loadingIndividual === api.url}
                  className="btn btn-outline w-full"
                >
                  {loadingIndividual === api.url ? 'Importing...' : 'Import Jobs'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">System Status</h2>
          <div className="grid grid-cols-1 md-grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">✓</div>
              <div className="text-sm text-gray-600">Backend Online</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">✓</div>
              <div className="text-sm text-gray-600">Database Connected</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">✓</div>
              <div className="text-sm text-gray-600">Queue System Ready</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}