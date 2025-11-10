'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiService } from '@/services/api';
import { ImportLog, ImportHistoryResponse } from '@/types';

export default function ImportHistory() {
  const [imports, setImports] = useState<ImportLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pagination, setPagination] = useState<{ currentPage: number; totalPages: number; totalImports: number }>({
    currentPage: 1,
    totalPages: 1,
    totalImports: 0
  });
  const [selectedImport, setSelectedImport] = useState<ImportLog | null>(null);

  const fetchImportHistory = async (page: number = 1): Promise<void> => {
    try {
      setLoading(true);
      const data: ImportHistoryResponse = await apiService.getImportHistory(page);
      
      // Handle different possible response structures
      const importsData = data.imports || data.data?.imports || [];
      const paginationData = data.pagination || data.data?.pagination || {};
      
      setImports(importsData);
      setPagination({
        currentPage: paginationData.currentPage || page,
        totalPages: paginationData.totalPages || 1,
        totalImports: paginationData.totalImports || importsData.length
      });
    } catch (error) {
      console.error('Error fetching import history:', error);
      setImports([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchImportDetails = async (importId: string): Promise<void> => {
    try {
      const data = await apiService.getImportDetails(importId);
      setSelectedImport(data);
    } catch (error) {
      console.error('Error fetching import details:', error);
    }
  };

  useEffect(() => {
    fetchImportHistory(currentPage);
  }, [currentPage]);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getStatusBadge = (status: ImportLog['status']): JSX.Element => {
    const statusConfig = {
      completed: { class: 'badge-success', label: 'Completed' },
      processing: { class: 'badge-info', label: 'Processing' },
      pending: { class: 'badge-warning', label: 'Pending' },
      failed: { class: 'badge-error', label: 'Failed' }
    };
    
    const config = statusConfig[status] || { class: 'badge-warning', label: status };
    
    return (
      <span className={config.class}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Import History</h1>
            <Link
              href="/"
              className="btn btn-primary"
            >
              Back to Dashboard
            </Link>
          </div>
          <div className="animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded mb-4"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Import History</h1>
            <p className="text-gray-600">Track all job import operations</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => fetchImportHistory(currentPage)}
              className="btn btn-outline"
            >
              Refresh
            </button>
            <Link
              href="/job"
              className="btn bg-purple-600 text-white hover:bg-purple-700"
            >
              View Jobs
            </Link>
            <Link
              href="/"
              className="btn btn-primary"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md-grid-cols-4 gap-4 mb-6">
          <div className="card">
            <div className="text-2xl font-bold text-gray-900">{pagination.totalImports}</div>
            <div className="text-sm text-gray-600">Total Imports</div>
          </div>
          <div className="card">
            <div className="text-2xl font-bold text-green-600">
              {imports.filter(i => i.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="card">
            <div className="text-2xl font-bold text-blue-600">
              {imports.filter(i => i.status === 'processing').length}
            </div>
            <div className="text-sm text-gray-600">Processing</div>
          </div>
          <div className="card">
            <div className="text-2xl font-bold text-red-600">
              {imports.filter(i => i.status === 'failed').length}
            </div>
            <div className="text-sm text-gray-600">Failed</div>
          </div>
        </div>

        {/* Import History Table */}
        <div className="card mb-8" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="table">
            <thead>
              <tr>
                <th>File Name / Source</th>
                <th>Import Date & Time</th>
                <th>Status</th>
                <th>Total</th>
                <th>New</th>
                <th>Updated</th>
                <th>Failed</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {imports.map((importItem) => (
                <tr key={importItem._id} className="hover-bg-gray-50">
                  <td>
                    <div className="font-medium text-gray-900" style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {importItem.fileName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {importItem.source || 'Unknown Source'}
                    </div>
                  </td>
                  <td className="text-sm text-gray-500 whitespace-nowrap">
                    {formatDate(importItem.importDateTime)}
                  </td>
                  <td>
                    {getStatusBadge(importItem.status)}
                  </td>
                  <td className="text-sm text-gray-900">
                    {importItem.total}
                  </td>
                  <td className="text-sm text-green-600 font-medium">
                    {importItem.new}
                  </td>
                  <td className="text-sm text-blue-600 font-medium">
                    {importItem.updated}
                  </td>
                  <td className="text-sm text-red-600 font-medium">
                    {importItem.failed}
                  </td>
                  <td className="text-sm font-medium">
                    <button
                      onClick={() => fetchImportDetails(importItem._id)}
                      className="text-blue-600 hover:text-blue-900"
                      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Import Details Modal */}
        {selectedImport && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Import Details</h3>
                  <button
                    onClick={() => setSelectedImport(null)}
                    className="text-gray-400 hover:text-gray-600"
                    style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}
                  >
                    ✕
                  </button>
                </div>
                <pre className="text-sm whitespace-pre-wrap">
                  {JSON.stringify(selectedImport, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="btn btn-outline"
            >
              Previous
            </button>
            
            <span className="text-sm text-gray-700">
              Page {currentPage} of {pagination.totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
              disabled={currentPage === pagination.totalPages}
              className="btn btn-outline"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}