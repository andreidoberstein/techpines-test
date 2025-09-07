import axios from "axios";
import { z } from "zod";
import { ur } from "zod/v4/locales";

// Regex para validar URLs do YouTube
const youtubeUrlRegex =
  /^https?:\/\/(www\.)?(youtube\.com\/(watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export const songSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  youtube_url: z
    .string()
    .regex(
      youtubeUrlRegex,
      "URL do YouTube inválida. Formatos aceitos: youtube.com/watch?v=, youtu.be/, youtube.com/shorts/, youtube.com/embed/"
    ),
  artist: z.string().optional(),
});

export const suggestionSchema = z.object({
  youtube_url: z
    .string()
    .regex(
      youtubeUrlRegex,
      "URL do YouTube inválida. Formatos aceitos: youtube.com/watch?v=, youtu.be/, youtube.com/shorts/, youtube.com/embed/"
    ),
  title: z.string().min(1, 'Informe o título da música')
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SongFormData = z.infer<typeof songSchema>;
export type SuggestionFormData = z.infer<typeof suggestionSchema>;
export type YouTubeVideosListResponse = {
  items: Array<{
    id: string;
    snippet: {
      title: string;
    };
  }>;
};

// Helper para extrair video ID de URL do YouTube
export const extractYouTubeId = (url: string): string | null => {
  const match = url.match(youtubeUrlRegex);
  return match ? match[4] : null;
};

// Helper para gerar thumbnail do YouTube
export const getYouTubeThumbnail = (videoId: string): string => {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

// Helper para acessar titulo com API do Youtube
export const getYouTubeTitle = async (videoId: string): Promise<string | null> => {
  const apiKey = import.meta.env.VITE_YT_API_KEY;
  const urlGoogleApi = "https://www.googleapis.com/youtube/v3/videos"
  const { data } = await axios.get<YouTubeVideosListResponse>(
    urlGoogleApi,
    { params: { part: "snippet", id: videoId, key: apiKey } }
  );
  return data.items?.[0]?.snippet?.title ?? null;
};
