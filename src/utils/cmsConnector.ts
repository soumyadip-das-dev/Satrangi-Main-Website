/**
 * CMSConnector - Utility Service for External CMS Portal Integration
 * 
 * Provides authenticated API client methods to communicate with the headless 
 * Satrangi Content & Management API and external CMS portals.
 */

export interface CMSConnectorConfig {
  baseUrl?: string;
  apiKey?: string;
  webhookSecret?: string;
}

export interface CMSResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  status?: number;
}

export class CMSConnector {
  private baseUrl: string;
  private apiKey: string;
  private webhookSecret: string;

  constructor(config: CMSConnectorConfig = {}) {
    // Resolve base URL (defaulting to origin or relative endpoint in browser environment)
    if (config.baseUrl) {
      this.baseUrl = config.baseUrl.replace(/\/$/, "");
    } else if (typeof window !== "undefined") {
      this.baseUrl = window.location.origin;
    } else {
      this.baseUrl = process.env.APP_URL || "http://localhost:3000";
    }

    // Resolve CMS API Key
    this.apiKey = 
      config.apiKey || 
      (typeof process !== "undefined" && process.env ? process.env.CMS_API_KEY || "" : "") ||
      (typeof import.meta !== "undefined" && (import.meta as any).env ? ((import.meta as any).env.VITE_CMS_API_KEY as string) || "" : "");

    // Resolve Webhook Secret
    this.webhookSecret = 
      config.webhookSecret || 
      (typeof process !== "undefined" && process.env ? process.env.CMS_WEBHOOK_SECRET || "" : "") ||
      (typeof import.meta !== "undefined" && (import.meta as any).env ? ((import.meta as any).env.VITE_CMS_WEBHOOK_SECRET as string) || "" : "");
  }

  /**
   * Helper method to build headers for authenticated requests
   */
  private getHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...customHeaders,
    };

    if (this.apiKey) {
      headers["x-cms-api-key"] = this.apiKey;
      headers["Authorization"] = `Bearer ${this.apiKey}`;
    }

    return headers;
  }

  /**
   * Universal fetch wrapper with automatic error handling
   */
  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<CMSResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
      const response = await fetch(url, {
        ...options,
        headers: this.getHeaders(options.headers as Record<string, string>),
      });

      const contentType = response.headers.get("content-type");
      let data: any = null;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        return {
          success: false,
          status: response.status,
          error: typeof data === "object" && data?.error ? data.error : response.statusText,
          message: typeof data === "object" && data?.message ? data.message : "Request failed",
        };
      }

      return {
        success: true,
        status: response.status,
        data: data as T,
      };
    } catch (err: any) {
      console.error(`[CMSConnector Error] Failed request to ${endpoint}:`, err);
      return {
        success: false,
        error: err.message || "Network Error",
        message: "Failed to communicate with CMS server.",
      };
    }
  }

  /**
   * Check CMS backend health and connection status
   */
  public async getHealth(): Promise<CMSResponse> {
    return this.request("/api/cms/health");
  }

  /**
   * Get CMS API schema, authentication details, and collection endpoints
   */
  public async getConfig(): Promise<CMSResponse> {
    return this.request("/api/cms/config");
  }

  /**
   * Get aggregator stats for dashboard widgets in external CMS
   */
  public async getStats(): Promise<CMSResponse> {
    return this.request("/api/cms/stats");
  }

  /**
   * Fetch a collection of items (destinations, rooms, experiences, blogs, gallery, faqs, reviews, bookings)
   */
  public async getCollection<T = any[]>(
    collection: "destinations" | "rooms" | "experiences" | "blogs" | "gallery" | "faqs" | "reviews" | "bookings",
    params?: Record<string, string>
  ): Promise<CMSResponse<T>> {
    let queryStr = "";
    if (params) {
      const searchParams = new URLSearchParams(params);
      queryStr = `?${searchParams.toString()}`;
    }
    return this.request<T>(`/api/${collection}${queryStr}`);
  }

  /**
   * Fetch a single item by ID
   */
  public async getItem<T = any>(
    collection: "destinations" | "rooms" | "experiences" | "blogs",
    id: string
  ): Promise<CMSResponse<T>> {
    return this.request<T>(`/api/${collection}/${id}`);
  }

  /**
   * Create a new item in a collection
   */
  public async createItem<T = any>(
    collection: "destinations" | "rooms" | "experiences" | "blogs" | "gallery" | "faqs" | "reviews",
    itemData: any
  ): Promise<CMSResponse<T>> {
    return this.request<T>(`/api/${collection}`, {
      method: "POST",
      body: JSON.stringify(itemData),
    });
  }

  /**
   * Update an existing item by ID
   */
  public async updateItem<T = any>(
    collection: "destinations" | "rooms" | "experiences" | "blogs" | "gallery" | "faqs" | "reviews",
    id: string,
    itemData: any
  ): Promise<CMSResponse<T>> {
    return this.request<T>(`/api/${collection}/${id}`, {
      method: "PUT",
      body: JSON.stringify(itemData),
    });
  }

  /**
   * Delete an item by ID
   */
  public async deleteItem(
    collection: "destinations" | "rooms" | "experiences" | "blogs" | "gallery" | "faqs" | "reviews" | "bookings",
    id: string
  ): Promise<CMSResponse> {
    return this.request(`/api/${collection}/${id}`, {
      method: "DELETE",
    });
  }

  /**
   * Update booking status (confirmed, cancelled, completed)
   */
  public async updateBookingStatus(
    bookingId: string,
    status: "confirmed" | "cancelled" | "completed" | "pending",
    paymentStatus?: "paid" | "pending" | "refunded"
  ): Promise<CMSResponse> {
    return this.request(`/api/bookings/${bookingId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status, paymentStatus }),
    });
  }

  /**
   * Trigger a webhook event for real-time synchronization
   */
  public async triggerWebhook(
    event: "create" | "update" | "delete" | "publish",
    collection: string,
    data: any
  ): Promise<CMSResponse> {
    const headers: Record<string, string> = {};
    if (this.webhookSecret) {
      headers["x-cms-webhook-secret"] = this.webhookSecret;
    }

    return this.request("/api/cms/webhook", {
      method: "POST",
      headers,
      body: JSON.stringify({ event, collection, data }),
    });
  }
}

// Singleton default instance
export const cmsConnector = new CMSConnector();
export default cmsConnector;
