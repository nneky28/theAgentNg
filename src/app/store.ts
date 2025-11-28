
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import onboardingReducer from './feature/onboardingSlice';

export const store = configureStore({
  reducer: {
    onboarding: onboardingReducer,
    // Add other reducers here if needed
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;