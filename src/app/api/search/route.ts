// @ts-nocheck
import { createClient } from '@/utils/supabase/client';
import { NextResponse } from 'next/server';
import { sendClientAcknowledgment, sendAdminNotification } from '@/lib/emailService';

// Define the type for your search_requests table
type SearchRequest = {
  first_name: string;
  last_name: string;
  whatsapp: string;
  email: string | null;
  state: string;
  city: string;
  area: string | null;
  property_type: string;
  purpose: string;
  condition: string | null;
  min_budget: number | null;
  max_budget: number | null;
  capacity: number | null;
  category: string;
  notified: boolean;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = createClient();

    const searchRequest: SearchRequest = {
      first_name: body.firstName || '',
      last_name: body.lastName || '',
      whatsapp: body.whatsapp || '',
      email: body.email || null,
      state: body.state || '',
      city: body.city || '',
      area: body.area || null,
      property_type: body.propertyType || '',
      purpose: body.purpose || '',
      condition: body.condition || null,
      min_budget: body.minBudget || null,
      max_budget: body.maxBudget || null,
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
      console.error('Supabase error:', error);
      throw error;
    }

    // Send emails using EmailJS (non-blocking)
    if (body.email) {
      // Send client acknowledgment email
      sendClientAcknowledgment({
        name: `${body.firstName} ${body.lastName}`,
        email: body.email,
        propertyType: body.propertyType,
        location: `${body.city}, ${body.state}`,
      }).catch((emailError) => {
        console.error('Client email error:', emailError);
        // Don't fail the request if email fails
      });
    }

    // Send admin notification email
    const budgetRange = body.minBudget && body.maxBudget 
      ? `₦${body.minBudget.toLocaleString()} - ₦${body.maxBudget.toLocaleString()}`
      : body.minBudget 
        ? `From ₦${body.minBudget.toLocaleString()}`
        : body.maxBudget 
          ? `Up to ₦${body.maxBudget.toLocaleString()}`
          : 'Not specified';

    sendAdminNotification({
      clientName: `${body.firstName} ${body.lastName}`,
      whatsapp: body.whatsapp,
      email: body.email,
      propertyType: body.propertyType,
      location: `${body.area ? body.area + ', ' : ''}${body.city}, ${body.state}`,
      budget: budgetRange,
    }).catch((emailError) => {
      console.error('Admin email error:', emailError);
      // Don't fail the request if email fails
    });

    return NextResponse.json({
      success: true,
      message: 'Request submitted successfully',
      data: data?.[0] || null,
    });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}