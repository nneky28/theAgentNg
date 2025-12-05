import { sendClientAcknowledgment, sendAdminNotification } from '@/lib/emailService';
import { SearchFormData } from '@/types'

export const formatBudgetRange = (
  minBudget: string,
  maxBudget: string
): string => {
  const min = minBudget ? Number(minBudget) : null;
  const max = maxBudget ? Number(maxBudget) : null;

  if (min && max) {
    return `₦${min.toLocaleString()} - ₦${max.toLocaleString()}`;
  }
  if (min) {
    return `From ₦${min.toLocaleString()}`;
  }
  if (max) {
    return `Up to ₦${max.toLocaleString()}`;
  }
  return 'Not specified';
};

export const sendSearchRequestEmails = async (data: SearchFormData) => {
  const emailPromises = [];

  // Send client acknowledgment email
  if (data.email) {
    emailPromises.push(
      sendClientAcknowledgment({
        name: data.name,
        email: data.email,
        category: data.category,
        property_type: data.property_type,
        location: `${data.city}, ${data.state}`,
      }).catch((error) => {
        console.error('Client email failed:', error);
      })
    );
  }

  // Send admin notification email
  const budgetRange = formatBudgetRange(data.min_budget, data.max_budget);

  emailPromises.push(
    sendAdminNotification({
      name: data.name,
      whatsapp: data.whatsapp,
      email: data.email,
      property_type: data.property_type,
      location: `${data.city}, ${data.state}`,
      budget: budgetRange,
      category: data.category,
    }).catch((error) => {
      console.error('Admin email failed:', error);
    })
  );

  await Promise.allSettled(emailPromises);
};