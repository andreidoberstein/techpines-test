import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Song } from '@/types';
import { extractYouTubeId, fromNow, getYouTubeStats, getYouTubeThumbnail } from '@/lib/schemas';
import { Play, Edit, Trash2, ThumbsUp, Eye, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

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
    const videoId = extractYouTubeId(song.youtube_url)
    const thumbnail = getYouTubeThumbnail(videoId);
    const isTop5 = variant === 'top5';
    const isList = variant === 'list';
    const [viewCount, setViewCount] = useState<number>(0);
    const [likeCount, setLikeCount] = useState<number>(0);
    const [publishedAt, setPublishedAt] = useState<number>(0);
    const nf = new Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 });

    useEffect(() => {
        if (videoId) {
            const fetchTitle = async () => {
                const { viewCount, likeCount, publishedAt } = await getYouTubeStats(videoId)
                setLikeCount(likeCount)
                setViewCount(viewCount)
                setPublishedAt(publishedAt)
            }
            fetchTitle()
                .catch(console.error)
        }
    }, []);


    if (isList) {
        return (
            <div className="group grid grid-cols-[96px,1fr,auto] gap-4 p-4 rounded-xl bg-card border hover:shadow-card-sertanejo transition-all">
                <img
                    src={thumbnail}
                    alt={`Thumbnail de ${song.title}`}
                    className="h-16 w-24 object-cover rounded-md ring-1 ring-border"
                    onError={(e) => {
                        e.currentTarget.src = "/placeholder-music.jpg";
                    }}
                />

                <div className="min-w-0 space-y-1">
                    <h3 className="text-sm md:text-base font-medium text-foreground leading-5 line-clamp-2" title={song.title}>
                        {song.title}
                    </h3>

                    {(viewCount > 0 || likeCount > 0 || publishedAt) && (
                        <>
                            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                {viewCount > 0 && (
                                    <span className="inline-flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" aria-hidden />
                                        {nf.format(viewCount)}
              </span>
                                )}

                                {likeCount > 0 && (
                                    <span className="inline-flex items-center gap-1">
                <ThumbsUp className="h-3.5 w-3.5" aria-hidden />
                                        {nf.format(likeCount)}
              </span>
                                )}

                            </div>
                            <div>
                                {publishedAt && (
                                    <span className="inline-flex items-center gap-1 before:content-['•'] before:mx-1 before:text-muted-foreground/60">
                <Clock className="h-3.5 w-3.5" aria-hidden />
                <span className="text-[11px]">{publishedAt}</span>
              </span>
                                )}
                            </div>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-1 self-start md:self-center">
                    <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 rounded-full"
                        onClick={() => window.open(song.youtube_url, "_blank")}
                    >
                        <Play className="h-4 w-4" aria-hidden />
                        <span className="sr-only">Tocar {song.title}</span>
                    </Button>
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