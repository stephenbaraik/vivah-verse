'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { 
  AIChatBubble, 
  ChatInput, 
  SuggestedPrompts,
  RecommendationCard,
  StickyActionBar,
  type ChatMessage 
} from '@/components/ai';
import type { Recommendation } from '@/components/ai/recommendation-card';
import { EmptyState } from '@/components/ui';
import { RecommendationsService } from '@/services/recommendations.service';

const INITIAL_PROMPTS = [
  "What's the ideal venue for 500 guests?",
  "Suggest wedding dates in November",
  "Help me stay within my budget",
  "Find vendors near Mumbai",
];

const DEMO_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    role: 'assistant',
    content: "Hello! I'm your AI wedding concierge. I'm here to help you plan your perfect day. How can I assist you today?",
    confidence: 95,
    timestamp: new Date(),
  },
];

export default function ConciergePage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>(DEMO_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [extracted, setExtracted] = useState<{
    city?: string;
    date?: string;
    guests?: number;
    budget?: number;
    intent?: string;
  }>({});

  const applyRecommendation = useCallback(
    (rec: Recommendation) => {
      if (rec.type === 'venue' && rec.value) {
        router.push(`/venues/${rec.value}`);
        return;
      }

      if (rec.type === 'vendor') {
        const category = rec.value;
        router.push(category ? `/services/${category}` : '/services');
        return;
      }

      if (rec.type === 'date') {
        const date = rec.value;
        if (!date) {
          router.push('/venues');
          return;
        }

        const params = new URLSearchParams();
        params.set('date', date);
        if (extracted.city) params.set('city', extracted.city);
        if (extracted.guests) params.set('guests', String(extracted.guests));
        router.push(`/venues?${params.toString()}`);
        return;
      }

      if (rec.type === 'package') {
        const params = new URLSearchParams();
        if (rec.value) params.set('tier', rec.value);
        if (extracted.budget) params.set('budget', String(extracted.budget));
        if (extracted.guests) params.set('guests', String(extracted.guests));
        const qs = params.toString();
        router.push(qs ? `/packages?${qs}` : '/packages');
        return;
      }

      if (rec.type === 'budget') {
        const params = new URLSearchParams();
        if (extracted.budget) params.set('budget', String(extracted.budget));
        if (extracted.guests) params.set('guests', String(extracted.guests));
        const qs = params.toString();
        router.push(qs ? `/packages?${qs}` : '/packages');
      }
    },
    [extracted.budget, extracted.city, extracted.guests, router],
  );

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const result = await RecommendationsService.chat({ message: content });

      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.message,
        confidence: result.confidence,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);
      setRecommendations(result.recommendations || []);
      setExtracted(result.extracted || {});
    } catch {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          "I'm having trouble reaching the recommendation service right now. Please try again in a moment.",
        confidence: 50,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleApplyAll = () => {
    const recs = recommendations;
    if (recs.length === 0) return;

    const preferred =
      recs.find((r) => r.type === 'package') ||
      recs.find((r) => r.type === 'venue') ||
      recs.find((r) => r.type === 'date') ||
      recs.find((r) => r.type === 'vendor') ||
      recs[0];

    applyRecommendation(preferred);
    setRecommendations([]);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Chat */}
      <div className="flex-1 flex flex-col max-w-2xl mx-auto lg:mx-0 lg:max-w-none lg:flex-1">
        {/* Chat Header */}
        <div className="bg-white/45 backdrop-blur-2xl border-b border-white/35 p-3 sm:p-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-champagne flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
            </div>
            <div>
              <h1 className="font-serif text-base sm:text-lg font-semibold text-charcoal">
                Wedding Concierge
              </h1>
              <p className="text-xs sm:text-sm text-muted">Powered by AI</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center px-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-champagne flex items-center justify-center mb-3 sm:mb-4">
                <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-gold" />
              </div>
              <h2 className="font-serif text-lg sm:text-xl font-semibold text-charcoal mb-2 text-center">
                Your AI Wedding Planner
              </h2>
              <p className="text-muted text-center max-w-md mb-4 sm:mb-6 text-sm sm:text-base">
                Ask me anything about venues, vendors, dates, or budgets. 
                I&apos;ll help you make the best decisions for your special day.
              </p>
              <SuggestedPrompts
                prompts={INITIAL_PROMPTS}
                onSelect={handleSendMessage}
              />
            </div>
          ) : (
            <>
              <AnimatePresence>
                {messages.map(message => (
                  <AIChatBubble key={message.id} message={message} />
                ))}
              </AnimatePresence>
              
              {isTyping && (
                <AIChatBubble
                  message={{
                    id: 'typing',
                    role: 'assistant',
                    content: '',
                    timestamp: new Date(),
                  }}
                  isTyping
                />
              )}
            </>
          )}
        </div>

        {/* Suggested prompts when chat has messages */}
        {messages.length > 0 && !isTyping && (
          <div className="px-4 pb-2">
            <SuggestedPrompts
              prompts={["Show more options", "Adjust budget", "Different location"]}
              onSelect={handleSendMessage}
            />
          </div>
        )}

        {/* Chat Input */}
        <ChatInput onSend={handleSendMessage} disabled={isTyping} />
      </div>

      {/* Right Panel - Recommendations (Desktop) */}
      <div className="hidden lg:flex lg:w-96 lg:flex-col lg:border-l lg:border-white/35 lg:bg-white/25 lg:backdrop-blur-2xl">
        <div className="p-4 border-b border-white/35">
          <h2 className="font-serif text-lg font-semibold text-charcoal">
            Recommendations
          </h2>
          <p className="text-sm text-muted">
            AI suggestions based on your preferences
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {recommendations.length === 0 ? (
            <EmptyState type="all-caught-up" />
          ) : (
            recommendations.map(rec => (
              <RecommendationCard
                key={rec.id}
                recommendation={rec}
                onApply={() => applyRecommendation(rec)}
                onDismiss={() => setRecommendations(r => r.filter(x => x.id !== rec.id))}
              />
            ))
          )}
        </div>
      </div>

      {/* Mobile Action Bar */}
      <AnimatePresence>
        {recommendations.length > 0 && (
          <StickyActionBar
            count={recommendations.length}
            onApplyAll={handleApplyAll}
            onDismissAll={() => setRecommendations([])}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
