import emailjs from '@emailjs/browser';

const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
const CLIENT_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_CLIENT_TEMPLATE!;
const ADMIN_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_ADMIN_TEMPLATE!;
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL!; // Add this to your .env file

// Initialize EmailJS (client-side only)
if (typeof window !== 'undefined') {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

interface ClientAcknowledgmentData {
  name: string;
  email: string;
  property_type: string;
  state?: string;
  city?: string;
  location?: string;
  category: string;
}

interface AdminNotificationData {
  name: string;
  whatsapp: string;
  email?: string;
  property_type: string;
  state?: string;
  city?: string;
  min_budget?: string;
  max_budget?: string;
  location?: string;
  budget?: string;
  category: string;
  area?: string;
  purpose?: string;
  capacity?: string;
}

export async function sendClientAcknowledgment(data: ClientAcknowledgmentData) {
  // This function should only be called from the client-side
  if (typeof window === 'undefined') {
    console.warn('⚠️ sendClientAcknowledgment called from server-side, skipping');
    return { success: false, error: 'Server-side execution not supported' };
  }

  try {
    console.log('📧 Sending client acknowledgment to:', data);
    
    const templateParams = {
      to_email: data.email,
      to_name: data.name,
      category: data.category || '',
      property_type: data.property_type ||'',
      location: data.city && data.state ? `${data.city}, ${data.state}` : 'Nigeria',
      site_url: process.env.NEXT_PUBLIC_SITE_URL || 'https://theagentng.com',
    };

    console.log('📧 Client template params:', templateParams);

    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      CLIENT_TEMPLATE_ID,
      templateParams
    );

    console.log('✅ Client acknowledgment email sent:', result.text);
    return { success: true, data: result };
  } catch (error) {
    console.error('❌ EmailJS error (client):', error);
    throw error;
  }
}

export async function sendAdminNotification(data: AdminNotificationData) {
  // This function should only be called from the client-side
  if (typeof window === 'undefined') {
    console.warn('⚠️ sendAdminNotification called from server-side, skipping');
    return { success: false, error: 'Server-side execution not supported' };
  }

  try {
    console.log('📧 Sending admin notification');
    
    // Format location
    const location = data.city && data.state 
      ? `${data.city}, ${data.state}${data.area ? ` (${data.area})` : ''}`
      : 'Not specified';

    // Format budget
    const budget = data.min_budget && data.max_budget
      ? `₦${Number(data.min_budget).toLocaleString()} - ₦${Number(data.max_budget).toLocaleString()}`
      : 'Not specified';

    // Format property details
    const propertyDetails = data.category === 'Event Hall'
      ? `${data.category} (Capacity: ${data.capacity || 'Not specified'})`
      : `${data.property_type || data.category || 'Property'} (${data.purpose || 'Not specified'})`;

    const templateParams = {
      to_email: ADMIN_EMAIL, // IMPORTANT: Add admin email here
      client_name: data.name,
      client_whatsapp: data.whatsapp,
      client_email: data.email || 'Not provided',
      property_details: propertyDetails,
      property_type: data.property_type || data.category || 'Not specified',
      location: location,
      budget: budget,
      category: data.category || 'Not specified',
      purpose: data.purpose || 'Not specified',
      capacity: data.capacity || 'N/A',
      area: data.area || 'Not specified',
    };

    console.log('📧 Admin template params:', templateParams);

    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      ADMIN_TEMPLATE_ID,
      templateParams
    );

    console.log('✅ Admin notification email sent:', result.text);
    return { success: true, data: result };
  } catch (error) {
    console.error('❌ EmailJS error (admin):', error);
    throw error;
  }
}