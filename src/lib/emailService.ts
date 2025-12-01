import emailjs from '@emailjs/browser';

const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
const CLIENT_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_CLIENT_TEMPLATE!;
const ADMIN_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_ADMIN_TEMPLATE!;

// Initialize EmailJS (client-side only)
if (typeof window !== 'undefined') {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

interface ClientAcknowledgmentData {
  name: string;
  email: string;
  propertyType: string;
  location: string;
}

interface AdminNotificationData {
  clientName: string;
  whatsapp: string;
  email?: string;
  propertyType: string;
  location: string;
  budget: string;
}

export async function sendClientAcknowledgment(data: ClientAcknowledgmentData) {
  // This function should only be called from the client-side
  if (typeof window === 'undefined') {
    console.warn('⚠️ sendClientAcknowledgment called from server-side, skipping');
    return { success: false, error: 'Server-side execution not supported' };
  }

  try {
    const templateParams = {
      to_email: data.email,
      to_name: data.name,
      property_type: data.propertyType,
      location: data.location,
      site_url: process.env.NEXT_PUBLIC_SITE_URL || 'https://theagentng.com',
    };

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
    // Don't include to_email if it's configured in the template
    const templateParams = {
      client_name: data.clientName,
      whatsapp: data.whatsapp,
      client_email: data.email || 'Not provided',
      property_type: data.propertyType,
      location: data.location,
      budget: data.budget,
      dashboard_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://theagentng.com'}/admin/requests`,
    };

    console.log('📧 Sending admin notification');
    console.log('📧 Template params:', templateParams);

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