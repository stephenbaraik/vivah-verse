import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface WeddingDateState {
  // Selected wedding date
  weddingDate: Date | null;
  
  // Guest count estimate
  guestCount: number | null;
  
  // City preference
  preferredCity: string | null;
  
  // Flow tracking
  hasCompletedDateSelection: boolean;
  
  // Actions
  setWeddingDate: (date: Date | null) => void;
  setGuestCount: (count: number | null) => void;
  setPreferredCity: (city: string | null) => void;
  setDateSelection: (date: Date, guestCount?: number, city?: string) => void;
  clearSelection: () => void;
}

export const useWeddingDateStore = create<WeddingDateState>()(
  persist(
    (set) => ({
      // Initial state
      weddingDate: null,
      guestCount: null,
      preferredCity: null,
      hasCompletedDateSelection: false,

      // Actions
      setWeddingDate: (date) =>
        set({ weddingDate: date }),

      setGuestCount: (count) =>
        set({ guestCount: count }),

      setPreferredCity: (city) =>
        set({ preferredCity: city }),

      setDateSelection: (date, guestCount, city) =>
        set({
          weddingDate: date,
          guestCount: guestCount ?? null,
          preferredCity: city ?? null,
          hasCompletedDateSelection: true,
        }),

      clearSelection: () =>
        set({
          weddingDate: null,
          guestCount: null,
          preferredCity: null,
          hasCompletedDateSelection: false,
        }),
    }),
    {
      name: 'vivah-wedding-date',
      storage: createJSONStorage(() => localStorage),
      // Rehydrate dates properly
      onRehydrateStorage: () => (state) => {
        if (state?.weddingDate) {
          state.weddingDate = new Date(state.weddingDate);
        }
      },
    }
  )
);

// Selectors for convenience
export const selectWeddingDate = (state: WeddingDateState) => state.weddingDate;
export const selectGuestCount = (state: WeddingDateState) => state.guestCount;
export const selectPreferredCity = (state: WeddingDateState) => state.preferredCity;
export const selectHasCompletedDateSelection = (state: WeddingDateState) =>
  state.hasCompletedDateSelection;

// Formatted date string for URL params
export const getWeddingDateParam = (date: Date | null): string | null => {
  if (!date) return null;
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
};
