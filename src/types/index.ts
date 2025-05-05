
import { NextPage } from 'next';
import { AppProps } from 'next/app';
import { ReactElement, ReactNode } from 'react';

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export interface SearchFormData {
  state: string;
  city: string;
  area: string;
  propertyType: string;
  purpose: string;
  condition: string;
  minBudget: string;
  maxBudget: string;
  firstName: string;
  lastName: string;
  whatsapp: string;
  email: string;
}

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
  propertyType: string;
  purpose: string;
  condition: string;
  minBudget: string;
  maxBudget: string;
  firstName: string;
  lastName: string;
  whatsapp: string;
  email: string;
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
  
  id: number;
  title: string;
  description: string;
  type: string;
  purpose: string; // Residential or Commercial
  condition: string; // For Rent or For Sale
  imageUrl: string;
  price: number | string; // Can be a number or a string with currency symbol
  location: {
    state: string;
    city: string;
    area: string;
    address: string;
    coordinates?: {
      lat: number;
     price: string;
    };

  };
  features?: {
    bedrooms?: number;
    bathrooms?: number;
    toilets?: number;
    parkingSpaces?: number;
    size?: number; // in square meters
    furnished: boolean;
    serviced: boolean;
  };
  bedrooms?: number;
  bathrooms?: number;
  areaSize?: string; // e.g., "150 sqm"
  amenities?: string[];
  images?: string[];
  agentId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  featured?: boolean;
  status?: 'available' | 'pending' | 'sold' | 'rented';
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
  matchedProperties?: string[]; // IDs of matched properties
  assignedAgents?: string[]; // IDs of assigned agents
}