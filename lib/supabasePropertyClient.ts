import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;


export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Property {
  id: string;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  propertytype: string;
  category: string;
  description: string;
  features: string[];
  images: string[]; // Array of URLs
  state: string;
  city: string;
  status: 'active' | 'pending' | 'sold';
  views: number;
  owner_id: string;
  owner_email: string;
  created_at: string;
  updated_at: string;
}

export interface PropertyInsert {
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  propertyType: string;
  category: string;
  description: string;
  features: string[];
  images: { name: string; data: string; type: string }[];
  state: string;
  city: string;
}

export interface SupabaseResponse<T> {
  data: T | null;
  error: Error | null;
}

// Fetch properties from API (uses service role internally)
export const fetchProperties = async (): Promise<Property[]> => {
  try {
    console.log('Fetching properties from API...');
    
    const res = await fetch('/api/properties', {
      method: 'GET',
      cache: 'no-store', // Disable caching for fresh data
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData?.error || `Failed to fetch: ${res.status}`);
    }

    const result = await res.json();
    console.log('Fetched properties:', result.data?.length || 0);
    
    return result.data || [];
  } catch (error) {
    console.error('fetchProperties error:', error);
    return [];
  }
};

// Add property via API (handles image upload + DB insert)
export async function addProperty(payload: PropertyInsert) {
  try {
    console.log('Adding property via API...');

    const res = await fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const contentType = res.headers.get('content-type') || '';
    let body: unknown = null;
    
    if (contentType.includes('application/json')) {
      body = await res.json();
    } else {
      const text = await res.text();
      console.error('Non-JSON response:', text);
      throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}`);
    }

  if (!res.ok) {
    const error = new Error('Failed to add property') as Error & { status?: number; body?: unknown };
    error.status = res.status;
    error.body = body;
    console.error('addProperty API error:', error);
    throw error;
  }
    return body;
  } catch (err) {
    console.error('addProperty error:', err);
    throw err;
  }
}

// Update property
export const updateProperty = async (id: string, updates: Partial<Property>) => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update error:', error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error updating property:', error);
    return { data: null, error };
  }
};

// Delete property
export const deleteProperty = async (id: string) => {
  try {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete error:', error);
      throw error;
    }

    return { error: null };
  } catch (error) {
    console.error('Error deleting property:', error);
    return { error };
  }
};