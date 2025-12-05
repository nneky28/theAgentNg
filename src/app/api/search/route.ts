// @ts-nocheck
import { createClient } from '@/utils/supabase/client';
import { NextResponse } from 'next/server';


type SearchRequest = {
  name: string;
  whatsapp: string;
  email: string | null;
  state: string;
  city: string;
  area: string | null;
  property_type: string;
  purpose: string | null;
  min_budget: string; 
  max_budget: string; 
  capacity: string | null;
  category: string;
  notified: boolean;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = createClient();

   
    console.log('📥 Incoming request body:', body);

    const searchRequest: SearchRequest = {
      name: body.name || '',
      whatsapp: body.whatsapp || '',
      email: body.email || null,
      state: body.state || '',
      city: body.city || '',
      area: body.area || null,
      property_type: body.property_type || '',
      purpose: body.purpose || null,
      min_budget: body.min_budget || '', 
      max_budget: body.max_budget || '', 
      capacity: body.capacity || null,
      category: body.category || '',
      notified: false,
    };



    // Insert into Supabase
    const { data, error } = await supabase
      .from('search_requests')
      .insert([searchRequest])
      .select();

    if (error) {
      console.error('❌ Supabase error:', error);
      throw error;
    }

    console.log('✅ Data inserted successfully:', data);

    // Return success with email trigger instructions for client
    return NextResponse.json({
      success: true,
      message: 'Request submitted successfully',
      data: data?.[0] || null,
      // Include data needed for client-side email sending
      emailData: {
        name: searchRequest.name,
        email: searchRequest.email,
        whatsapp: searchRequest.whatsapp,
        property_type: searchRequest.property_type,
        state: searchRequest.state,
        city: searchRequest.city,
        min_budget: searchRequest.min_budget,
        max_budget: searchRequest.max_budget,
        category: searchRequest.category,

      }
    });
  } catch (error: any) {
    console.error('❌ API error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}