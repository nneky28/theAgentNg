// @ts-nocheck
import { createClient } from '@/utils/supabase/client';
import { NextRequest, NextResponse } from 'next/server';




export async function POST(request: NextRequest) {
  try {
    // Get the Authorization header from the request
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing authorization token' },
        { status: 401 }
      );
    }

    // Extract the token
    const token = authHeader.replace('Bearer ', '');

    // Create Supabase client
    const supabase = createClient();

    // Verify the token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    console.log('Auth check:', { user: user?.email, error: authError });

    if (authError || !user) {
      console.error('Auth error:', authError);
      return NextResponse.json(
        { error: 'Invalid or expired token. Please log in again.' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const {
      title,
      price,
      bedrooms,
      bathrooms,
      sqft,
      propertyType,
      category,
      description,
      features,
      images,
      state,
      city,
      owner_email,
      owner_id,
      status,
      views,
    } = body;

    // Validate required fields
    if (!title || !propertyType || !category || !state || !city || !images || images.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log(`Starting upload of ${images.length} images for user ${user.email}`);

    // Upload images to Supabase Storage
    const imageUrls: string[] = [];
    
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      
      try {
        const base64Data = image.data.split(',')[1]; // Remove data URL prefix
        const buffer = Buffer.from(base64Data, 'base64');
        
        // Generate unique filename
        const fileExt = image.name.split('.').pop() || 'jpg';
        const fileName = `${user.id}/${Date.now()}_${i}.${fileExt}`;
        
        console.log(`Uploading image ${i + 1}/${images.length}: ${fileName}`);
        
        // Upload to Supabase Storage with auth token
        const {  error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(fileName, buffer, {
            contentType: image.type,
            upsert: false,
          });

        if (uploadError) {
          console.error(`Upload error for image ${i + 1}:`, uploadError);
          throw new Error(`Failed to upload image ${i + 1}: ${uploadError.message}`);
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(fileName);

        imageUrls.push(publicUrl);
        console.log(`Image ${i + 1} uploaded successfully`);
      } catch (imgError: any) {
        console.error(`Error processing image ${i + 1}:`, imgError);
        throw new Error(`Failed to process image ${i + 1}: ${imgError.message}`);
      }
    }

    console.log('All images uploaded, inserting property into database');

    // Insert property into database
    const { data: propertyData, error: dbError } = await supabase
      .from('properties')
      .insert([
        {
          title,
          price,
          bedrooms,
          bathrooms,
          sqft,
          property_type: propertyType,
          category,
          description,
          features,
          images: imageUrls,
          state,
          city,
          owner_email: owner_email || user.email,
          owner_id: owner_id || user.id,
          status: status || 'active',
          views: views || 0,
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error(`Failed to create property: ${dbError.message}`);
    }

    console.log('Property created successfully:', propertyData.id);

    return NextResponse.json({
      success: true,
      data: propertyData,
    });

  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state');
    const city = searchParams.get('city');
    const category = searchParams.get('category');
    const propertyType = searchParams.get('propertyType');

    let query = supabase
      .from('properties')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    // Apply filters
    if (state) query = query.eq('state', state);
    if (city) query = query.eq('city', city);
    if (category) query = query.eq('category', category);
    if (propertyType) query = query.eq('property_type', propertyType);

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      data,
    });

  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}