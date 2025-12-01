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
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        propertyType: data.propertyType,
        location: `${data.city}, ${data.state}`,
      }).catch((error) => {
        console.error('Client email failed:', error);
      })
    );
  }

  // Send admin notification email
  const budgetRange = formatBudgetRange(data.minBudget, data.maxBudget);

  emailPromises.push(
    sendAdminNotification({
      clientName: `${data.firstName} ${data.lastName}`,
      whatsapp: data.whatsapp,
      email: data.email,
      propertyType: data.propertyType,
      location: `${data.area ? data.area + ', ' : ''}${data.city}, ${data.state}`,
      budget: budgetRange,
    }).catch((error) => {
      console.error('Admin email failed:', error);
    })
  );

  await Promise.allSettled(emailPromises);
};