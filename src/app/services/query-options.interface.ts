export interface QueryOptions {
    orderBy?: { field: string; direction?: 'asc' | 'desc' };
    limit?: number;
  }