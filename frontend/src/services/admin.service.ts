import { api } from '@/lib/api';
import type {
  AdminDashboard,
  PendingVendor,
  AdminWedding,
  Issue,
  PricingRule,
} from '@/types/api';

/**
 * Admin Service
 * Admin-only API operations for marketplace oversight
 */
export const AdminService = {
  /**
   * Get admin dashboard overview
   */
  async getDashboard(): Promise<AdminDashboard> {
    const response = await api.get<AdminDashboard>('/admin/dashboard');
    return response.data;
  },

  /**
   * Get pending vendor applications
   */
  async getPendingVendors(): Promise<PendingVendor[]> {
    const response = await api.get<PendingVendor[]>('/admin/vendors/pending');
    return response.data;
  },

  /**
   * Approve or reject a vendor
   */
  async updateVendorStatus(
    vendorId: string,
    status: 'APPROVED' | 'REJECTED',
    reason?: string
  ): Promise<void> {
    await api.patch(`/admin/vendors/${vendorId}/status`, { status, reason });
  },

  /**
   * Get all weddings for monitoring
   */
  async getWeddings(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ weddings: AdminWedding[]; total: number }> {
    const response = await api.get<{ weddings: AdminWedding[]; total: number }>(
      '/admin/weddings',
      { params }
    );
    return response.data;
  },

  /**
   * Get issues queue
   */
  async getIssues(params?: {
    status?: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
    page?: number;
    limit?: number;
  }): Promise<{ issues: Issue[]; total: number }> {
    const response = await api.get<{ issues: Issue[]; total: number }>(
      '/admin/issues',
      { params }
    );
    return response.data;
  },

  /**
   * Update issue status
   */
  async updateIssueStatus(
    issueId: string,
    status: 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  ): Promise<void> {
    await api.patch(`/admin/issues/${issueId}`, { status });
  },

  /**
   * Get pricing rules
   */
  async getPricingRules(): Promise<PricingRule[]> {
    const response = await api.get<PricingRule[]>('/admin/pricing');
    return response.data;
  },

  /**
   * Update a pricing rule
   */
  async updatePricingRule(
    ruleId: string,
    data: Partial<PricingRule>
  ): Promise<PricingRule> {
    const response = await api.patch<PricingRule>(
      `/admin/pricing/${ruleId}`,
      data
    );
    return response.data;
  },
};
