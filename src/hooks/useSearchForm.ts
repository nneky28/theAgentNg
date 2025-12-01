// hooks/useSearchForm.ts

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { submitSearchRequest } from '@/utils/searchApi';
import { sendSearchRequestEmails } from '@/utils/searchEmailUtils';
import { SearchFormData } from '@/types';
import { useToast } from '@chakra-ui/react';

interface UseSearchFormOptions {
  onSuccessMessage?: string;
  onErrorMessage?: string;
}

export const useSearchForm = (options?: UseSearchFormOptions) => {
  const [formKey, setFormKey] = useState(0);
  const toast = useToast();

  const mutation = useMutation({
    mutationFn: submitSearchRequest,
    onSuccess: async (response, variables) => {
      // Send emails after successful API submission
      await sendSearchRequestEmails(variables);

      // Show success message
      const message = options?.onSuccessMessage || 'Your request has been submitted successfully!';
      toast({
        title: 'Request submitted successfully!',
        description: 'We\'ll get back to you within a week with property matches.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Reset form by changing key
      setFormKey((prev) => prev + 1);
    },
    onError: (error: any) => {
      console.error('Submission error:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        options?.onErrorMessage ||
        'Something went wrong. Please try again.';
      toast({
        title: 'Error submitting request',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data: SearchFormData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      whatsapp: formData.get('whatsapp') as string,
      state: formData.get('state') as string,
      city: formData.get('city') as string,
      area: formData.get('area') as string,
      propertyType: formData.get('propertyType') as string,
      purpose: formData.get('purpose') as string,
      condition: formData.get('condition') as string,
      minBudget: formData.get('minBudget') as string,
      maxBudget: formData.get('maxBudget') as string,
      capacity: formData.get('capacity') as string,
      category: formData.get('category') as string,
    };

    mutation.mutate(data);
  };

  return {
    formKey,
    handleSubmit,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
};