import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { suggestionSchema, SuggestionFormData, extractYouTubeId, getYouTubeThumbnail, getYouTubeName, getYouTubeTitle } from '@/lib/schemas';
import { useEffect, useState } from 'react';
import { Music, Info } from 'lucide-react';

interface SuggestionFormProps {
  onSubmit: (data: SuggestionFormData) => Promise<void>;
  isLoading?: boolean;
}

export const SuggestionForm = ({ onSubmit, isLoading }: SuggestionFormProps) => {
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<SuggestionFormData>({
    resolver: zodResolver(suggestionSchema),
  });

  const youtubeUrl = watch('youtube_url');

  useEffect(() => {
    if (youtubeUrl) {
      const videoId = extractYouTubeId(youtubeUrl);
      if (videoId) {
        setPreviewUrl(getYouTubeThumbnail(videoId));
        const fetchTitle = async () => {
          const title = await getYouTubeTitle(videoId)
          setTitle(title);
        }
        fetchTitle()
          .catch(console.error)
      } else {
        setPreviewUrl('');
        setTitle('');
      }
    }
  }, [youtubeUrl]);

  const handleFormSubmit = async (data: SuggestionFormData) => {
    try {
      await onSubmit(data);
      reset();
      setPreviewUrl('');
      setTitle('');
    } catch (error) {
      console.error('Erro ao enviar sugestão:', error);
    }
  };

  return (
    <Card variant="sertanejo" className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-3">
          <Music className="h-8 w-8 text-sertanejo-green" />
        </div>
        <CardTitle className="text-2xl">Sugira uma Música</CardTitle>
        <CardDescription className="text-base">
          Conhece alguma música do Tião Carreiro & Pardinho que deveria estar no nosso top? 
          Envie sua sugestão!
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="mb-6 p-4 bg-sertanejo-beige/20 rounded-lg border border-sertanejo-beige/40">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-sertanejo-green mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-sertanejo-brown mb-2">Formatos aceitos:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• youtube.com/watch?v=XXXXXXXXX</li>
                <li>• youtu.be/XXXXXXXXX</li>
                <li>• youtube.com/shorts/XXXXXXXXX</li>
                <li>• youtube.com/embed/XXXXXXXXX</li>
              </ul>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="youtube_url">URL do YouTube *</Label>
            <Input
              id="youtube_url"
              {...register('youtube_url')}
              placeholder="Cole aqui o link do YouTube da música"
              disabled={isLoading}
            />
            {errors.youtube_url && (
              <p className="text-sm text-destructive">{errors.youtube_url.message}</p>
            )}
            
            {previewUrl && (
              <div className="mt-3 flex justify-center">
                <img
                  src={previewUrl}
                  alt="Preview do vídeo sugerido"
                  className="w-48 h-36 object-cover rounded-lg border shadow-card-sertanejo"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Título da música (opcional)</Label>
            <Input
              id="title"
              value={title}
              {...register('title')}
              placeholder="Se quiser, digite o título da música"
              disabled={isLoading}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Enviando sugestão...
                </>
              ) : (
                'Enviar Sugestão'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};