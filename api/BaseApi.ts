import { APIRequestContext, APIResponse } from '@playwright/test';

export interface ApiEnvelope<T> {
  data: T;
  meta?: { total?: number };
}

const root = '/web/index.php/api/v2';
const defaults = { failOnStatusCode: false, maxRetries: 2 }; // retries network drops only

/**
 * Thin wrapper over APIRequestContext.
 * - get/post/put/remove return parsed JSON and throw a readable error on failure
 * - raw* methods return the response so tests can assert on error statuses
 */
export abstract class BaseApi {
  constructor(protected readonly request: APIRequestContext) {}

  protected url(path: string): string {
    return `${root}${path}`;
  }

  // ---------- raw (no throwing) ----------
  rawGet(path: string, params?: Record<string, string | number | boolean>): Promise<APIResponse> {
    return this.request.get(this.url(path), { params, ...defaults });
  }

  rawPost(path: string, body: unknown): Promise<APIResponse> {
    return this.request.post(this.url(path), { data: body, ...defaults });
  }

  rawDelete(path: string, ids: number[]): Promise<APIResponse> {
    return this.request.delete(this.url(path), { data: { ids }, ...defaults });
  }

  // ---------- parsed (throws on non-2xx) ----------
  protected async get<T>(path: string, params?: Record<string, string | number | boolean>) {
    return this.parse<T>(await this.rawGet(path, params), `GET ${path}`);
  }

  protected async post<T>(path: string, body: unknown) {
    return this.parse<T>(await this.rawPost(path, body), `POST ${path}`);
  }

  protected async put<T>(path: string, body: unknown) {
    const res = await this.request.put(this.url(path), { data: body, ...defaults });
    return this.parse<T>(res, `PUT ${path}`);
  }

  protected async remove(path: string, ids: number[]) {
    return this.parse<number[]>(await this.rawDelete(path, ids), `DELETE ${path}`);
  }

  private async parse<T>(res: APIResponse, label: string): Promise<ApiEnvelope<T>> {
    if (!res.ok()) {
      throw new Error(`${label} failed with ${res.status()}: ${await res.text()}`);
    }
    return (await res.json()) as ApiEnvelope<T>;
  }
}
