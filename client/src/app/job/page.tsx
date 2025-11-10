'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  category: string;
  applyUrl: string;
  publishedDate: string;
  source: string;
  createdAt: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5000/api/jobs');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch jobs: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Handle different response structures
      const jobsData = data.data?.jobs || data.jobs || [];
      setJobs(jobsData);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">All Jobs</h1>
            <Link href="/" className="btn btn-primary">Back to Dashboard</Link>
          </div>
          <div className="animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded mb-4"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">All Jobs</h1>
            <Link href="/" className="btn btn-primary">Back to Dashboard</Link>
          </div>
          <div className="card text-center">
            <div className="text-red-600 mb-4">
              <strong>Error:</strong> {error}
            </div>
            <button onClick={fetchJobs} className="btn btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Jobs</h1>
            <p className="text-gray-600">Found {jobs.length} jobs in the system</p>
          </div>
          <div className="flex space-x-4">
            <button onClick={fetchJobs} className="btn btn-outline">
              Refresh
            </button>
            <Link href="/" className="btn btn-primary">
              Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          {jobs.map((job) => (
            <div key={job._id} className="card hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                  <div className="grid grid-cols-1 md-grid-cols-2 gap-2 mb-3">
                    <p className="text-gray-700">
                      <strong>Company:</strong> {job.company}
                    </p>
                    <p className="text-gray-700">
                      <strong>Location:</strong> {job.location}
                    </p>
                    <p className="text-gray-700">
                      <strong>Category:</strong> {job.category}
                    </p>
                    <p className="text-gray-700">
                      <strong>Source:</strong> {job.source}
                    </p>
                  </div>
                  <p className="text-gray-500 text-sm">
                    <strong>Posted:</strong> {formatDate(job.publishedDate)} • 
                    <strong> Imported:</strong> {formatDate(job.createdAt)}
                  </p>
                </div>
                <div className="ml-4  w-auto h-auto  flex flex-col space-y-2">
                  <a 
                    href={job.applyUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-primary whitespace-nowrap px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition-all duration-200"
                  >
                    Apply Now
                  </a>
                </div>
              </div>
              
              {job.description && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-gray-700 text-sm">
                    {job.description.replace(/<[^>]*>/g, '').substring(0, 300)}
                    {job.description.length > 300 ? '...' : ''}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {jobs.length === 0 && (
          <div className="card text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Jobs Found</h3>
            <p className="text-gray-600 mb-4">Try importing some jobs first!</p>
            <Link href="/" className="btn btn-primary">Import Jobs</Link>
          </div>
        )}
      </div>
    </div>
  );
}