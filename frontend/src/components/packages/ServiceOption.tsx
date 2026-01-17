'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Check, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import type { PackageItem } from '@/types/package';

interface ServiceOptionProps {
  item: PackageItem;
  onSelect: () => void;
  selected?: boolean;
  priceLabel?: string;
  className?: string;
}

/**
 * Service option card for package builder
 * Shows service details with select/deselect button
 */
export function ServiceOption({
  item,
  onSelect,
  selected = false,
  priceLabel,
  className,
}: ServiceOptionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        className={`cursor-pointer transition-all ${
          selected
            ? 'ring-2 ring-gold border-gold'
            : 'hover:border-gold/50 hover:shadow-md'
        } ${className}`}
        onClick={onSelect}
      >
        <CardContent className="p-4">
          {/* Image (optional) */}
          {item.image && (
            <div className="h-32 rounded-lg overflow-hidden mb-3 bg-charcoal/10 relative">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 100vw, 240px"
                className="object-cover"
                priority={selected}
              />
            </div>
          )}

          {/* Content */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-charcoal truncate">{item.name}</h4>
              {item.description && (
                <p className="text-sm text-muted mt-1 line-clamp-2">
                  {item.description}
                </p>
              )}
              <p className="text-gold font-semibold mt-2">
                {formatCurrency(item.price)}
                {priceLabel && (
                  <span className="text-muted font-normal text-sm ml-1">
                    {priceLabel}
                  </span>
                )}
              </p>
            </div>

            {/* Select indicator */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                selected
                  ? 'bg-gold text-white'
                  : 'bg-divider text-muted'
              }`}
            >
              {selected ? (
                <Check className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
