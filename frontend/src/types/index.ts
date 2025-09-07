export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export type Song = {
  id: string;
  title: string;
  artist: string;
  video_id?: string;
  youtube_url?: string;
  play_count?: number;
  is_top5?: boolean;
  approved_at?: string | null;
  position?: number | null;
  created_at?: string;
};

export type PaginatedSongs = {
  data: Song[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export interface Suggestion {
  id: number;
  youtube_url: string;
  title?: string;
  video_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string;
    last: string;
    prev?: string;
    next?: string;
  };
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface ApiResponse<T> {
  [x: string]: string;
  data: T;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SongRequest {
  title: string;
  youtube_url: string;
  artist?: string;
}

export interface SuggestionRequest {
  youtube_url: string;
  title?: string;
}