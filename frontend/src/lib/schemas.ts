import { z } from 'zod';

// Regex para validar URLs do YouTube
const youtubeUrlRegex = /^https?:\/\/(www\.)?(youtube\.com\/(watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export const songSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  youtube_url: z.string().regex(youtubeUrlRegex, 'URL do YouTube inválida. Formatos aceitos: youtube.com/watch?v=, youtu.be/, youtube.com/shorts/, youtube.com/embed/'),
  artist: z.string().optional(),
});

export const suggestionSchema = z.object({
  youtube_url: z.string().regex(youtubeUrlRegex, 'URL do YouTube inválida. Formatos aceitos: youtube.com/watch?v=, youtu.be/, youtube.com/shorts/, youtube.com/embed/'),
  title: z.string().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SongFormData = z.infer<typeof songSchema>;
export type SuggestionFormData = z.infer<typeof suggestionSchema>;

// Helper para extrair video ID de URL do YouTube
export const extractYouTubeId = (url: string): string | null => {
  const match = url.match(youtubeUrlRegex);
  return match ? match[4] : null;
};

// Helper para gerar thumbnail do YouTube
export const getYouTubeThumbnail = (videoId: string): string => {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};