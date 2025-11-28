export interface Property {
  id: string;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  propertytype: string;
  description: string;
  features: string[];
  images: string[];
  state: string;
  city: string;
  status: 'active' | 'pending' | 'sold';
  views: number;
  owner_email: string;
  created_at: string;
  updated_at?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string; // Changed from image_url to match BlogPostCard
  author: string;
  author_email: string;
  date: string;
  category: string;
  status: 'published' | 'draft';
  created_at: string;
  updated_at?: string;
}

export interface PropertyFormData {
  title: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  propertyType: string;
  description: string;
  features: string[];
  images: File[];
  state: string;
  city: string;
}

export interface BlogFormData {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: File | null;
  status: 'published' | 'draft';
}

export interface DashboardStats {
  activeLeads: number;
  propertiesCount: number;
  blogPostsCount: number;
  monthlyGrowth: string;
}