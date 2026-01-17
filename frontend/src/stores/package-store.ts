import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PackageItem, PackageSelection, PackageCategory } from '@/types/package';

interface PackageStore {
  // State
  selection: PackageSelection;
  guestCount: number;
  budget: number;
  
  // Actions
  setItem: (category: PackageCategory, item: PackageItem | undefined) => void;
  removeItem: (category: PackageCategory) => void;
  setGuestCount: (count: number) => void;
  setBudget: (budget: number) => void;
  reset: () => void;
  
  // Computed (helper)
  getTotal: () => number;
}

const initialState = {
  selection: {},
  guestCount: 500,
  budget: 2500000,
};

/**
 * Package Builder Store
 * Centralized state for building wedding packages
 */
export const usePackageStore = create<PackageStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setItem: (category, item) =>
        set((state) => ({
          selection: {
            ...state.selection,
            [category]: item,
          },
        })),

      removeItem: (category) =>
        set((state) => {
          const newSelection = { ...state.selection };
          delete newSelection[category];
          return { selection: newSelection };
        }),

      setGuestCount: (guestCount) => set({ guestCount }),

      setBudget: (budget) => set({ budget }),

      reset: () => set(initialState),

      getTotal: () => {
        const { selection, guestCount } = get();
        let total = 0;

        // Venue is special - based on per-plate pricing
        if (selection.venue) {
          total += selection.venue.price * guestCount;
        }

        // Other items are fixed price
        Object.entries(selection).forEach(([key, item]) => {
          if (key !== 'venue' && item) {
            total += item.price;
          }
        });

        return total;
      },
    }),
    {
      name: 'vivah-package',
      partialize: (state) => ({
        selection: state.selection,
        guestCount: state.guestCount,
        budget: state.budget,
      }),
    }
  )
);

/**
 * Pure function to calculate package total
 * Useful for server-side verification
 */
export function calculatePackageTotal(
  selection: PackageSelection,
  guestCount: number
): number {
  let total = 0;

  // Venue is per-plate pricing
  if (selection.venue) {
    total += selection.venue.price * guestCount;
  }

  // Other items are fixed price
  Object.entries(selection).forEach(([key, item]) => {
    if (key !== 'venue' && item) {
      total += item.price;
    }
  });

  return total;
}
