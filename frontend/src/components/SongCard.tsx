import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Song } from '@/types';
import { getYouTubeThumbnail } from '@/lib/schemas';
import { Play, Edit, Trash2 } from 'lucide-react';

interface SongCardProps {
  song: Song;
  variant?: 'default' | 'top5' | 'list';
  onEdit?: (song: Song) => void;
  onDelete?: (song: Song) => void;
  showActions?: boolean;
}

export const SongCard = ({ 
  song, 
  variant = 'default',
  onEdit,
  onDelete,
  showActions = false
}: SongCardProps) => {
  const thumbnail = getYouTubeThumbnail(song.video_id);
  
  const isTop5 = variant === 'top5';
  const isList = variant === 'list';

  if (isList) {
    return (
      <div className="flex items-center space-x-4 p-4 rounded-lg bg-card border hover:shadow-card-sertanejo transition-all duration-300">
        <img
          src={thumbnail}
          alt={`Thumbnail de ${song.title}`}
          className="w-16 h-12 object-cover rounded"
          onError={(e) => {
            e.currentTarget.src = '/placeholder-music.jpg';
          }}
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{song.title}</h3>
          {song.artist && (
            <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
          )}
        </div>
        
        {song.play_count && (
          <div className="text-sm text-muted-foreground">
            {song.play_count} plays
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => window.open(song.youtube_url, '_blank')}
            aria-label={`Tocar ${song.title}`}
          >
            <Play className="h-4 w-4" />
          </Button>
          
          {showActions && (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit?.(song)}
                aria-label={`Editar ${song.title}`}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete?.(song)}
                aria-label={`Excluir ${song.title}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card 
      variant={isTop5 ? 'hero' : 'sertanejo'}
      className={isTop5 ? 'h-full' : ''}
    >
      <CardHeader className="pb-3">
        <div className="relative aspect-video rounded-lg overflow-hidden group">
          <img
            src={thumbnail}
            alt={`Thumbnail de ${song.title}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-music.jpg';
            }}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button
              size="lg"
              variant="outline"
              className="bg-black/60 border-white/30 text-white hover:bg-white/20"
              onClick={() => window.open(song.youtube_url, '_blank')}
            >
              <Play className="h-5 w-5 mr-2" />
              Assistir
            </Button>
          </div>
          
          {song.play_count && (
            <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
              {song.play_count} plays
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2">
        <CardTitle 
          className={isTop5 ? 'text-xl' : 'text-lg'}
        >
          {song.title}
        </CardTitle>
        
        {song.artist && (
          <p className={`${isTop5 ? 'text-sertanejo-beige' : 'text-muted-foreground'}`}>
            {song.artist}
          </p>
        )}

        {showActions && (
          <div className="flex justify-between pt-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit?.(song)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete?.(song)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};