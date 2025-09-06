import { api } from '@/lib/api';
import { Song, PaginatedResponse, ApiResponse, SongRequest } from '@/types';

export const songsService = {
  async getTop5(): Promise<Song[]> {
    const response = await api.get<ApiResponse<Song[]>>('songs/top5');
    console.log(response)
    return response.data;
  },

  async getSongs(page: number = 1, perPage: number = 10): Promise<PaginatedResponse<Song>> {
    const response = await api.get<PaginatedResponse<Song>>(`songs`);
    return response.data;
  },

  async createSong(song: SongRequest): Promise<Song> {
    const response = await api.post<ApiResponse<Song>>('songs', song);
    return response.data.data;
  },

  async updateSong(id: number, song: SongRequest): Promise<Song> {
    const response = await api.put<ApiResponse<Song>>(`songs/${id}`, song);
    return response.data.data;
  },

  async deleteSong(id: number): Promise<void> {
    await api.delete(`songs/${id}`);
  },
};