// utils/user.ts
export interface UserData {
  email: string;
  username: string;
  whatsappNo: string;
  specialization: string[];
  state: string;
  city: string;
  onboardingCompleted: boolean;
  completedAt?: string;
}

export const getUserData = (): UserData | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return null;
  }
};

export const isOnboardingComplete = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    const completed = localStorage.getItem('isOnboardingComplete');
    return completed === 'true';
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
};

export const clearUserData = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem('userData');
    localStorage.removeItem('isOnboardingComplete');
  } catch (error) {
    console.error('Error clearing user data:', error);
  }
};

export const updateUserData = (updatedData: Partial<UserData>): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    const currentData = getUserData();
    if (!currentData) return false;
    
    const newData = { ...currentData, ...updatedData };
    localStorage.setItem('userData', JSON.stringify(newData));
    return true;
  } catch (error) {
    console.error('Error updating user data:', error);
    return false;
  }
};