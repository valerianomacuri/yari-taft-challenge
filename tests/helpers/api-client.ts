// tests/helpers/api-client.ts
import request, { Test } from 'supertest';
import { Express } from 'express';

/**
 * API Client for testing with automatic prefix handling
 */
export class ApiClient {
  private readonly prefix: string;

  constructor(
    private readonly app: Express,
    prefix: string = '/api/v1',
  ) {
    this.prefix = prefix;
  }

  /**
   * Make a GET request
   */
  get(url: string): Test {
    return request(this.app).get(this.buildUrl(url));
  }

  /**
   * Make a POST request
   */
  post(url: string): Test {
    return request(this.app).post(this.buildUrl(url));
  }

  /**
   * Make a PUT request
   */
  put(url: string): Test {
    return request(this.app).put(this.buildUrl(url));
  }

  /**
   * Make a PATCH request
   */
  patch(url: string): Test {
    return request(this.app).patch(this.buildUrl(url));
  }

  /**
   * Make a DELETE request
   */
  delete(url: string): Test {
    return request(this.app).delete(this.buildUrl(url));
  }

  /**
   * Build full URL with prefix
   */
  private buildUrl(url: string): string {
    // Ensure url starts with /
    const normalizedUrl = url.startsWith('/') ? url : `/${url}`;
    return `${this.prefix}${normalizedUrl}`;
  }

  /**
   * Get the current prefix
   */
  getPrefix(): string {
    return this.prefix;
  }
}

/**
 * Factory function to create API client
 */
export function createApiClient(app: Express, prefix?: string): ApiClient {
  return new ApiClient(app, prefix);
}
