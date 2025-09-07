import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { songSchema, SongFormData, extractYouTubeId, getYouTubeThumbnail } from '@/lib/schemas';
import { Song } from '@/types';
import { useEffect, useState } from 'react';

interface SongFormProps {
  song?: Song;
  onSubmit: (data: SongFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const SongForm = ({ song, onSubmit, onCancel, isLoading }: SongFormProps) => {
  const [previewUrl, setPreviewUrl] = useState<string>('');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<SongFormData>({
    resolver: zodResolver(songSchema),
    defaultValues: song ? {
      title: song.title || '',
      youtube_url: song.youtube_url,
      artist: song.artist || '',
    } : undefined,
  });

  const youtubeUrl = watch('youtube_url');

  useEffect(() => {
    if (youtubeUrl) {
      const videoId = extractYouTubeId(youtubeUrl);
      if (videoId) {
        setPreviewUrl(getYouTubeThumbnail(videoId));
      } else {
        setPreviewUrl('');
      }
    }
  }, [youtubeUrl]);

  const handleFormSubmit = async (data: SongFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Erro ao salvar música:', error);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {song ? 'Editar Música' : 'Adicionar Nova Música'}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Digite o título da música"
              disabled={isLoading}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="youtube_url">URL do YouTube *</Label>
            <Input
              id="youtube_url"
              {...register('youtube_url')}
              placeholder="https://www.youtube.com/watch?v=..."
              disabled={isLoading}
            />
            {errors.youtube_url && (
              <p className="text-sm text-destructive">{errors.youtube_url.message}</p>
            )}
            
            {previewUrl && (
              <div className="mt-2">
                <img
                  src={previewUrl}
                  alt="Preview do vídeo"
                  className="w-32 h-24 object-cover rounded border"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="artist">Artista</Label>
            <Input
              id="artist"
              {...register('artist')}
              placeholder="Digite o nome do artista (opcional)"
              disabled={isLoading}
            />
            {errors.artist && (
              <p className="text-sm text-destructive">{errors.artist.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="hero"
              disabled={isLoading}
            >
              {isLoading ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : null}
              {song ? 'Atualizar' : 'Salvar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};