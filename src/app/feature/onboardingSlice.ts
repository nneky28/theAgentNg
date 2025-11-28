import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OnboardingState {
  isOnboarded: boolean;
  userData: {
    email?: string;
    username?: string;
    whatsappNo?: string;
    state?: string;
    city?: string;
    role?: 'agent' | 'buyer';
    onboardingCompleted?: boolean;
    completedAt?: string;
  } | null;
  isHydrated: boolean;
}

const initialState: OnboardingState = {
  isOnboarded: false,
  userData: null,
  isHydrated: false,
};

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setOnboardingStatus(state, action: PayloadAction<boolean>) {
      state.isOnboarded = action.payload;
    },
    setUserData(state, action: PayloadAction<OnboardingState['userData']>) {
      state.userData = action.payload;
    },
    completeOnboarding(state, action: PayloadAction<OnboardingState['userData']>) {
      state.isOnboarded = true;
      state.userData = action.payload;
    },
    setHydrated(state, action: PayloadAction<boolean>) {
      state.isHydrated = action.payload;
    },
    resetOnboarding(state) {
      state.isOnboarded = false;
      state.userData = null;
      state.isHydrated = false;
    },
  },
});

export const { 
  setOnboardingStatus, 
  setUserData, 
  completeOnboarding, 
  setHydrated, 
  resetOnboarding 
} = onboardingSlice.actions;

export default onboardingSlice.reducer;