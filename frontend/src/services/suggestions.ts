import { api } from '@/lib/api';
import { Suggestion, ApiResponse, SuggestionRequest, Song } from '@/types';

export const suggestionsService = {
  async getSuggestion(): Promise<Suggestion> {
      const response = await api.get<Suggestion>(`suggestions`);
      console.log(response)
      return response.data;
    },

  async createSuggestion(suggestion: SuggestionRequest): Promise<Suggestion> {
    const response = await api.post<ApiResponse<Suggestion>>('/suggestions', suggestion);
    return response.data.data;
  },

  async approveSuggestion(id: number): Promise<{ suggestion: Suggestion; song: Song }> {
    console.log('id ' + id)
    const response = await api.post<{ suggestion: ApiResponse<Suggestion>; song: ApiResponse<Song> }>(
      `suggestions/${id}/approve`
    );
    console.log('response ', response)
    return {
      suggestion: response.data.suggestion,
      song: response.data.song,
    };
  },

  async rejectSuggestion(id: number): Promise<Suggestion> {
    const response = await api.post<ApiResponse<Suggestion>>(`suggestions/${id}/reject`);
    return response.data.data;
  },
};