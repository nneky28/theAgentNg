import { useState, FormEvent } from 'react';
import { useToast } from '@chakra-ui/react';
import { sendClientAcknowledgment, sendAdminNotification } from '@/lib/emailService';
import { formatTitleCase } from '@/utils/Method';

interface UseSearchFormProps {
  onSuccessMessage?: string;
  onErrorMessage?: string;
  onSuccess?: () => void; 
}

export function useSearchForm({ onSuccessMessage, onErrorMessage, onSuccess }: UseSearchFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const toast = useToast();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formElement = e.currentTarget;
      
      // Get all input values directly from the form
      const formData = new FormData(formElement);
      
      // Convert FormData to a plain object
      const data: Record<string, string> = {};
      formData.forEach((value, key) => {
        data[key] = value as string;
      });

      const requiredFields = ['name', 'whatsapp', 'email', 'state', 'city', 'property_type', 'min_budget', 'max_budget', 'category'];
      const missingFields = requiredFields.filter(field => !data[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Submit to API
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to submit request');
      }

      try {
        await sendClientAcknowledgment({
          name: data.name,
          email: data.email,
          property_type: data.property_type || '',
          state: data.state,
          city: data.city,
          category: `${formatTitleCase(data.category)}`,
        });

        await sendAdminNotification({
          name: data.name,
          whatsapp: data.whatsapp,
          email: data.email,
          property_type: data.property_type || '',
          state: data.state,
          city: data.city,
          min_budget: data.min_budget,
          max_budget: data.max_budget,
          area: data.area,
          purpose: data.purpose,
          capacity: data.capacity,
          category: `${formatTitleCase(data.category)}`,
        });

      } catch (emailError) {
        toast({
          title: 'Request Submitted',
          description: `${emailError}`,
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
        
        // Reset form even if emails failed
        formElement.reset();
        setFormKey(prev => prev + 1);
        
        // Reset parent component state (CustomSelectFields)
        if (onSuccess) {
          onSuccess();
        }
        
        setIsLoading(false);
        return;
      }

      // Show success message only if emails sent successfully
      toast({
        title: 'Success!',
        description: onSuccessMessage || 'Your request has been submitted successfully!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Reset form
      formElement.reset();
      setFormKey(prev => prev + 1);
      
      // Reset parent component state (CustomSelectFields)
      if (onSuccess) {
        onSuccess();
      }

    } catch (error: any) {
      console.error('❌ Form submission error:', error);
      toast({
        title: 'Error',
        description: error.message || onErrorMessage || 'Something went wrong. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleSubmit,
    isLoading,
    formKey,
  };
}