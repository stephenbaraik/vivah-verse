import { api } from '@/lib/api';
import type { Recommendation } from '@/components/ai/recommendation-card';

export type ConciergeChatResponse = {
  message: string;
  confidence: number;
  extracted: {
    city?: string;
    date?: string;
    guests?: number;
    budget?: number;
    intent: 'venue' | 'date' | 'budget' | 'general';
  };
  recommendations: Recommendation[];
};

export const RecommendationsService = {
  async chat(payload: {
    message: string;
    context?: {
      city?: string;
      date?: string;
      guests?: string;
      budget?: string;
    };
  }): Promise<ConciergeChatResponse> {
    const response = await api.post<ConciergeChatResponse>(
      '/recommendations/chat',
      payload,
    );
    return response.data;
  },
};
