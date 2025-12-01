import axios from 'axios';
import { SearchFormData, SearchApiResponse } from '@/types';

export const submitSearchRequest = async (
  data: SearchFormData
): Promise<SearchApiResponse> => {
  const response = await axios.post<SearchApiResponse>('/api/search', data);
  return response.data;
};