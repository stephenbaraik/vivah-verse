import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type WeddingStyle = 'traditional' | 'modern' | 'fusion' | 'destination' | 'intimate';

export type BudgetRange = 
  | 'under-10L'
  | '10L-25L'
  | '25L-50L'
  | '50L-1Cr'
  | 'above-1Cr';

export interface OnboardingData {
  // Step 1: Date
  weddingDate: Date | null;
  isMultiDay: boolean;
  
  // Step 2: Couple Details
  brideName: string;
  groomName: string;
  
  // Step 3: Preferences
  guestCount: number | null;
  city: string;
  budgetRange: BudgetRange | null;
  weddingStyle: WeddingStyle | null;
  
  // Step 4: Contact
  phone: string;
  email: string;
}

interface OnboardingState extends OnboardingData {
  // Current step (1-4)
  currentStep: number;
  
  // Completion tracking
  completedSteps: number[];
  
  // Actions
  setStep: (step: number) => void;
  markStepComplete: (step: number) => void;
  
  // Step 1
  setDateInfo: (date: Date, isMultiDay: boolean) => void;
  
  // Step 2
  setCoupleDetails: (brideName: string, groomName: string) => void;
  
  // Step 3
  setPreferences: (data: {
    guestCount: number;
    city: string;
    budgetRange: BudgetRange;
    weddingStyle: WeddingStyle;
  }) => void;
  
  // Step 4
  setContactInfo: (phone: string, email: string) => void;
  
  // Reset
  resetOnboarding: () => void;
  
  // Get data for API
  getWeddingData: () => {
    weddingDate: string;
    city: string;
    guestCount: number;
    budgetEstimate: number;
  } | null;
}

// Budget range to estimate mapping
const BUDGET_ESTIMATES: Record<BudgetRange, number> = {
  'under-10L': 500000,
  '10L-25L': 1750000,
  '25L-50L': 3750000,
  '50L-1Cr': 7500000,
  'above-1Cr': 15000000,
};

const initialData: OnboardingData = {
  weddingDate: null,
  isMultiDay: false,
  brideName: '',
  groomName: '',
  guestCount: null,
  city: '',
  budgetRange: null,
  weddingStyle: null,
  phone: '',
  email: '',
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      ...initialData,
      currentStep: 1,
      completedSteps: [],
      
      setStep: (step) => set({ currentStep: step }),
      
      markStepComplete: (step) => 
        set((state) => ({
          completedSteps: state.completedSteps.includes(step)
            ? state.completedSteps
            : [...state.completedSteps, step],
        })),
      
      setDateInfo: (date, isMultiDay) => 
        set({ 
          weddingDate: date, 
          isMultiDay,
          currentStep: 2,
          completedSteps: [...new Set([...get().completedSteps, 1])],
        }),
      
      setCoupleDetails: (brideName, groomName) =>
        set({
          brideName,
          groomName,
          currentStep: 3,
          completedSteps: [...new Set([...get().completedSteps, 2])],
        }),
      
      setPreferences: ({ guestCount, city, budgetRange, weddingStyle }) =>
        set({
          guestCount,
          city,
          budgetRange,
          weddingStyle,
          currentStep: 4,
          completedSteps: [...new Set([...get().completedSteps, 3])],
        }),
      
      setContactInfo: (phone, email) =>
        set({
          phone,
          email,
          completedSteps: [...new Set([...get().completedSteps, 4])],
        }),
      
      resetOnboarding: () => 
        set({
          ...initialData,
          currentStep: 1,
          completedSteps: [],
        }),
      
      getWeddingData: () => {
        const state = get();
        if (!state.weddingDate || !state.city || !state.guestCount || !state.budgetRange) {
          return null;
        }
        
        // Format as YYYY-MM-DD to avoid timezone issues
        const year = state.weddingDate.getFullYear();
        const month = String(state.weddingDate.getMonth() + 1).padStart(2, '0');
        const day = String(state.weddingDate.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}T00:00:00.000Z`;
        
        return {
          weddingDate: dateString,
          city: state.city,
          guestCount: state.guestCount,
          budgetEstimate: BUDGET_ESTIMATES[state.budgetRange],
        };
      },
    }),
    {
      name: 'vivah-onboarding',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        weddingDate: state.weddingDate,
        isMultiDay: state.isMultiDay,
        brideName: state.brideName,
        groomName: state.groomName,
        guestCount: state.guestCount,
        city: state.city,
        budgetRange: state.budgetRange,
        weddingStyle: state.weddingStyle,
        phone: state.phone,
        email: state.email,
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
      }),
      // Handle date serialization
      onRehydrateStorage: () => (state) => {
        if (state?.weddingDate && typeof state.weddingDate === 'string') {
          state.weddingDate = new Date(state.weddingDate);
        }
      },
    }
  )
);
