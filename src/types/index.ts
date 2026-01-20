import { NextPage } from 'next';
import { AppProps } from 'next/app';
import { ReactElement, ReactNode } from 'react';

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export interface AgentFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  operatingAreas: string[];
  specialization: string;
  agreeTerms: boolean;
}

// Removed duplicate Property interface to resolve type conflict

export interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  date: string;
}
// Define interfaces for form data and other types used in the application

export interface SearchFormData {
  state: string;
  city: string;
  area: string;
  property_type: string;
  purpose: string;
  category: string;
  min_budget: string;
  max_budget: string;
  name: string;
  whatsapp: string;
  email: string;
  capacity: string;
}

export interface Agent {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  whatsapp: string;
  profileImage: string;
  location: {
    state: string;
    city: string;
    areas: string[];
  };
  specialization: string[];
  rating: number;
  propertiesListed: number;
  propertiesSold: number;
  experience: number; // years
  verified: boolean;
  available: boolean;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: string | number;
  location: string | { city: string; state: string; country?: string };
  city?: string;
  state?: string;
  type: string;
  category?: string;
  condition: string;
  beds?: number;
  bedrooms?: number;
  baths?: number;
  bathrooms?: number;
  sqft?: number;
  yearBuilt?: number;
  image?: string;
  imageUrl?: string;
  images?: string[];
  features?: string[];
  amenities?: string[];
  is_premium?: boolean;
  is_featured?: boolean;
  is_published?: boolean;
  is_archived?: boolean;
  featured_at?: string;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
  agent_id?: string;
  owner_id?: string;
  owner_email?: string;
  views?: number;
  currency?: 'NGN' | 'USD' | string;
  toilets?: number;
  video_link?: string | null;
}

export interface SearchRequest {
  id: string;
  clientInfo: {
    firstName: string;
    lastName: string;
    email: string;
    whatsapp: string;
  };
  propertyRequirements: {
    state: string;
    city: string;
    area?: string;
    propertyType: string;
    purpose: string;
    condition: string;
    budget: {
      min?: number;
      max?: number;
    };
  };
  status: 'new' | 'processing' | 'matched' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  matchedProperties?: string[]; 
  assignedAgents?: string[]; 
}

export interface UserOnboardingData {
  id: string;
  email: string;
  isOnboarded: boolean;
  username?: string;
  whatsappNo?: string;
  specialization?: string[];
  state?: string;
  city?: string;
}

export interface OnboardingStatus {
  isOnboarded: boolean;
  loading: boolean;
  error?: string;
}


export interface User {
  id: string;
  email: string;
  username: string | null;
  whatsapp_no: string | null;
  state: string | null;
  city: string | null;
  cities: string[] | null;
  role: string;
  is_onboarded: boolean;
  onboarding_completed: boolean;
  completed_at: string | null;
  created_at?: string;
}

export interface UserUpdate {
  username?: string;
  whatsapp_no?: string;
  state?: string;
  city?: string | null;
  cities?: string[];
  is_onboarded?: boolean;
  onboarding_completed?: boolean;
  completed_at?: string;
}



export interface SearchApiResponse {
  success: boolean;
  message: string;
  data: any;
}