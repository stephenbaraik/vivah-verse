'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

interface ChecklistProps {
  items?: ChecklistItem[];
  onToggle?: (id: string, done: boolean) => void;
  editable?: boolean;
  className?: string;
}

const DEFAULT_ITEMS: ChecklistItem[] = [
  { id: '1', label: 'Select venue', done: true },
  { id: '2', label: 'Confirm decor', done: false },
  { id: '3', label: 'Finalize catering', done: false },
  { id: '4', label: 'Send invitations', done: false },
  { id: '5', label: 'Book photographer', done: false },
  { id: '6', label: 'Arrange mehendi', done: false },
];

/**
 * Checklist component for wedding planning tasks
 * Non-overwhelming, progress-oriented
 */
export function Checklist({
  items: initialItems,
  onToggle,
  editable = true,
  className,
}: ChecklistProps) {
  const [localItems, setLocalItems] = useState(initialItems ?? DEFAULT_ITEMS);
  const items = initialItems ?? localItems;

  const completedCount = items.filter((i) => i.done).length;
  const progressPercent = (completedCount / items.length) * 100;

  const handleToggle = (id: string) => {
    if (!editable) return;

    const item = items.find((i) => i.id === id);
    if (!item) return;

    const newDone = !item.done;

    if (onToggle) {
      onToggle(id, newDone);
    } else {
      setLocalItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, done: newDone } : i))
      );
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-serif font-medium text-charcoal">
          Checklist
        </h2>
        <span className="text-sm text-muted">
          {completedCount}/{items.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-divider rounded-full overflow-hidden mb-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full bg-success rounded-full"
        />
      </div>

      <ul className="space-y-2">
        {items.map((item, idx) => (
          <motion.li
            key={item.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
          >
            <label
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                editable
                  ? 'cursor-pointer hover:bg-rose-soft'
                  : 'cursor-default'
              }`}
            >
              <button
                type="button"
                onClick={() => handleToggle(item.id)}
                disabled={!editable}
                className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                  item.done
                    ? 'bg-success text-white'
                    : 'border-2 border-divider text-transparent hover:border-success/50'
                }`}
              >
                {item.done && <Check className="w-3 h-3" />}
              </button>
              <span
                className={
                  item.done ? 'line-through text-muted' : 'text-charcoal'
                }
              >
                {item.label}
              </span>
            </label>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
