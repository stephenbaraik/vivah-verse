'use client';

import { useState, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles, User, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ConfidenceMeter } from '@/components/ui/confidence-meter';

export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  confidence?: number;
  timestamp: Date;
}

interface AIChatBubbleProps {
  message: ChatMessage;
  isTyping?: boolean;
}

export function AIChatBubble({ message, isTyping }: AIChatBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex gap-3 max-w-[85%]',
        isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
          isUser ? 'bg-rani' : 'bg-champagne'
        )}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Sparkles className="w-4 h-4 text-gold" />
        )}
      </div>

      {/* Message bubble */}
      <div
        className={cn(
          'rounded-2xl px-4 py-3 border',
          isUser
            ? 'bg-rani text-white rounded-br-sm'
            : 'bg-white/50 backdrop-blur-2xl border-white/40 shadow-[var(--shadow-glass)] rounded-bl-sm'
        )}
      >
        {isTyping ? (
          <TypingIndicator />
        ) : (
          <>
            <p className={cn('text-sm', isUser ? 'text-white' : 'text-charcoal')}>
              {message.content}
            </p>
            {message.confidence !== undefined && !isUser && (
              <div className="mt-2 pt-2 border-t border-divider/50">
                <ConfidenceMeter
                  value={message.confidence}
                  label="AI Confidence"
                  size="sm"
                />
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}

/**
 * AI typing indicator with pulse dots
 */
export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 py-1">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-muted"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Chat input component
 */
interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, disabled, placeholder }: ChatInputProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-2 p-4 bg-white/45 backdrop-blur-2xl border-t border-white/35">
      <textarea
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || "Ask me anything about your wedding..."}
        disabled={disabled}
        rows={1}
        className={cn(
          'flex-1 px-4 py-3 rounded-xl border border-white/35 bg-white/35 backdrop-blur-xl resize-none',
          'focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent',
          'placeholder:text-muted text-ink',
          'disabled:opacity-50'
        )}
        style={{ maxHeight: '120px' }}
      />
      <Button
        onClick={handleSend}
        disabled={!value.trim() || disabled}
        className="h-12 w-12 !p-0"
      >
        <Send className="w-5 h-5" />
      </Button>
    </div>
  );
}

/**
 * Suggested prompts
 */
interface SuggestedPromptsProps {
  prompts: string[];
  onSelect: (prompt: string) => void;
}

export function SuggestedPrompts({ prompts, onSelect }: SuggestedPromptsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {prompts.map((prompt, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(prompt)}
          className={cn(
            'px-3 py-2 rounded-full text-sm',
            'bg-white/40 backdrop-blur-xl text-ink border border-white/35',
            'hover:bg-white/55 hover:shadow-[var(--shadow-glass)] transition-all'
          )}
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}

/**
 * AI Uncertainty message
 */
interface AIUncertaintyProps {
  message: string;
  onRetry?: () => void;
}

export function AIUncertainty({ message, onRetry }: AIUncertaintyProps) {
  return (
    <div className="bg-white/40 backdrop-blur-2xl border border-white/35 rounded-xl p-4 shadow-[var(--shadow-glass)]">
      <div className="flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-charcoal font-medium">
            I&apos;m not fully confident about this
          </p>
          <p className="text-sm text-muted mt-1">{message}</p>
        </div>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 flex items-center gap-2 text-sm text-warning hover:text-warning/80 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try a different approach
        </button>
      )}
    </div>
  );
}
