import { api } from '@/lib/api';
import { Suggestion, ApiResponse, SuggestionRequest, Song } from '@/types';

export const suggestionsService = {
  async createSuggestion(suggestion: SuggestionRequest): Promise<Suggestion> {

    console.log(suggestion)
    const response = await api.post<ApiResponse<Suggestion>>('/suggestions', suggestion);
    console.log(response)
    return response.data.data;
  },

  async approveSuggestion(id: number): Promise<{ suggestion: Suggestion; song: Song }> {
    const response = await api.post<{ suggestion: ApiResponse<Suggestion>; song: ApiResponse<Song> }>(
      `/api/admin/suggestions/${id}/approve`
    );
    return {
      suggestion: response.data.suggestion.data,
      song: response.data.song.data,
    };
  },

  async rejectSuggestion(id: number): Promise<Suggestion> {
    const response = await api.post<ApiResponse<Suggestion>>(`/api/admin/suggestions/${id}/reject`);
    return response.data.data;
  },
};