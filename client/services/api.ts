import { 
    ImportHistoryResponse, 
    StartImportResponse, 
    TriggerAllResponse, 
    ImportLog,
    ApiResponse,
    Job 
  } from '@/types';
  
  const API_BASE_URL = 'http://localhost:5000/api';
  
  class ApiService {
    private async fetchWrapper<T>(url: string, options?: RequestInit): Promise<T> {
      try {
        const response = await fetch(`${API_BASE_URL}${url}`, {
          headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
          },
          ...options,
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        return await response.json() as T;
      } catch (error) {
        console.error('API call failed:', error);
        throw error;
      }
    }
  
    async getHealth(): Promise<ApiResponse<{ status: string; message: string; timestamp: string }>> {
      return this.fetchWrapper('/health');
    }
  
    async getImportHistory(page: number = 1): Promise<ImportHistoryResponse> {
      return this.fetchWrapper(`/import/history?page=${page}`);
    }
  
    async startImport(apiUrl: string): Promise<StartImportResponse> {
      return this.fetchWrapper('/import/start', {
        method: 'POST',
        body: JSON.stringify({ apiUrl }),
      });
    }
  
    async triggerAllImports(): Promise<TriggerAllResponse> {
      return this.fetchWrapper('/import/trigger-all', {
        method: 'POST',
      });
    }
  
    async getImportDetails(importId: string): Promise<ImportLog> {
      return this.fetchWrapper(`/import/${importId}`);
    }
  
    async getJobs(): Promise<ApiResponse<{ jobs: Job[]; total: number }>> {
      return this.fetchWrapper('/jobs');
    }
  
    async testApis(): Promise<ApiResponse<Array<{
      api: string;
      status: string;
      jobsFound?: number;
      error?: string;
    }>>> {
      return this.fetchWrapper('/test-apis');
    }
  }
  
  export const apiService = new ApiService();