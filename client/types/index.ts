export interface Job {
    _id: string;
    jobId: string;
    title: string;
    company: string;
    location: string;
    description: string;
    category: string;
    applyUrl: string;
    publishedDate: string;
    source: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface ImportLog {
    _id: string;
    fileName: string;
    importDateTime: string;
    total: number;
    new: number;
    updated: number;
    failed: number;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    source?: string;
    failedReasons?: Array<{
      jobId: string;
      error: string;
    }>;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalImports: number;
  }
  
  export interface ImportHistoryResponse {
    imports: ImportLog[];
    pagination: PaginationInfo;
  }
  
  export interface ApiResponse<T = any> {
    message?: string;
    error?: string;
    data?: T;
  }
  
  export interface StartImportResponse {
    message: string;
    importId: string;
    status: string;
    results?: {
      total: number;
      new: number;
      updated: number;
      failed: number;
    };
  }
  
  export interface TriggerAllResponse {
    message: string;
    results: Array<{
      apiUrl: string;
      status: string;
      importId?: string;
      error?: string;
    }>;
  }