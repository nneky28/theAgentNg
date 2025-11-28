import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@chakra-ui/react';
import { Property } from '@/types/dashboard.types';
import { fetchProperties } from '../../lib/supabasePropertyClient';


export const useDashboardData = (userEmail: string | null | undefined) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const toast = useToast();

  const loadProperties = useCallback(async () => {
    if (!userEmail) return;

    try {
      const propertiesData = await fetchProperties();
      
      if (abortControllerRef.current?.signal.aborted) return;
      
      setProperties(
        (propertiesData || []).map((property: Property) => ({
          ...property
        }))
      );
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to load properties';
      setError(errorMessage);
      toast({
        title: 'Error loading properties',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [userEmail, toast]);

  const loadAllData = useCallback(async () => {
    if (!userEmail) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    await Promise.all([loadProperties()]);
    
    setLoading(false);
  }, [userEmail, loadProperties,]);

  useEffect(() => {
    loadAllData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadAllData]);

  return {
    properties,
    loading,
    error,
    refetchProperties: loadProperties,
    refetchAll: loadAllData,
  };
};