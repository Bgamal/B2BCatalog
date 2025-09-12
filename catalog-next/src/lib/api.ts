const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:1337';
const API_URL = `${API_BASE}/api`;

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiItem {
  id: number;
  attributes: Record<string, any>;
}

export class ApiService {
  static async get<T>(endpoint: string): Promise<StrapiResponse<T>> {
    const response = await fetch(`${API_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    return response.json();
  }

  static async post<T>(endpoint: string, data: any): Promise<StrapiResponse<T>> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    return response.json();
  }

  static async put<T>(endpoint: string, data: any): Promise<StrapiResponse<T>> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    return response.json();
  }

  static async delete<T>(endpoint: string): Promise<void> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
  }
}

// Helper function to map Strapi list responses
export function mapStrapiList<T>(
  response: StrapiResponse<StrapiItem[]>,
  mapper: (item: StrapiItem) => T
): T[] {
  if (!response?.data || !Array.isArray(response.data)) return [];
  return response.data
    .filter((item) => item && item.attributes)
    .map(mapper);
}

// Helper function to map single Strapi item
export function mapStrapiItem<T>(
  response: StrapiResponse<StrapiItem>,
  mapper: (item: StrapiItem) => T
): T | null {
  if (!response?.data || !response.data.attributes) return null;
  return mapper(response.data);
}
