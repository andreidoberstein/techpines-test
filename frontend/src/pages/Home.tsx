import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { SongCard } from '@/components/SongCard';
import { SuggestionForm } from '@/components/forms/SuggestionForm';
import { songsService } from '@/services/songs';
import { suggestionsService } from '@/services/suggestions';
import { usePagination } from '@/hooks/usePagination';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Music2 } from 'lucide-react';

export const Home = () => {
  const { toast } = useToast();
  const { currentPage, goToPage, nextPage, prevPage } = usePagination();
  const [isSubmittingSuggestion, setIsSubmittingSuggestion] = useState(false);

  const { data: top5Songs, isLoading: loadingTop5 } = useQuery({
    queryKey: ['songs', 'top5'],
    queryFn: songsService.getTop5,
  });

  const { data: songsData, isLoading: loadingSongs } = useQuery({
    queryKey: ['songs', 'paginated', currentPage],
    queryFn: () => songsService.getSongs(currentPage, 10),
  });

  const handleSuggestionSubmit = async (data: { youtube_url: string; title?: string }) => {
    setIsSubmittingSuggestion(true);
    try {
      await suggestionsService.createSuggestion(data);
      toast({
        title: 'Sugestão enviada com sucesso!',
        description: 'Obrigado pela sua contribuição. Analisaremos sua sugestão em breve.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao enviar sugestão',
        description: error.response?.data?.message || 'Tente novamente mais tarde.',
      });
    } finally {
      setIsSubmittingSuggestion(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-hero py-16 px-4">
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Music2 className="h-16 w-16 text-sertanejo-cream animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-sertanejo-cream mb-4">
            Top 5 Tião Carreiro
          </h1>
          <p className="text-xl md:text-2xl text-sertanejo-beige mb-2">
            & Pardinho
          </p>
          <p className="text-lg text-sertanejo-beige/80 max-w-2xl mx-auto">
            As melhores músicas da dupla mais famosa da música sertaneja de raiz
          </p>
        </div>
      </section>

      {/* Top 5 Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-sertanejo-brown mb-4">
              🏆 Top 5 Favoritas
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              As cinco músicas mais queridas pelos fãs de Tião Carreiro & Pardinho
            </p>
          </div>

          {loadingTop5 ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : top5Songs && top5Songs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {top5Songs.map((song, index) => (
                <div key={song.id} className="relative">
                  <div className="absolute -top-2 -left-2 z-10 bg-sertanejo-green text-sertanejo-cream rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-sertanejo">
                    {index + 1}
                  </div>
                  <SongCard song={song} variant="top5" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhuma música encontrada no Top 5.</p>
            </div>
          )}
        </div>
      </section>

      {/* All Songs Section */}
      <section className="py-16 px-4 bg-sertanejo-cream/10">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-sertanejo-brown mb-4">
              🎵 Todas as Músicas
            </h2>
            <p className="text-lg text-muted-foreground">
              Explore o repertório completo da dupla
            </p>
          </div>

          {loadingSongs ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : songsData && songsData.data.length > 0 ? (
            <>
              <div className="space-y-3 mb-8">
                {songsData.data.map((song) => (
                  <SongCard key={song.id} song={song} variant="list" />
                ))}
              </div>

              {/* Pagination */}
              {songsData.last_page > 1 && (
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    variant="outline"
                    onClick={prevPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Anterior
                  </Button>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      Página {songsData.current_page} de {songsData.last_page}
                    </span>
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={nextPage}
                    disabled={currentPage === songsData.last_page}
                  >
                    Próxima
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhuma música encontrada.</p>
            </div>
          )}
        </div>
      </section>

      {/* Suggestion Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-sertanejo-brown mb-4">
              💡 Faça sua Sugestão
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Conhece alguma música que deveria estar na nossa lista? 
              Compartilhe conosco!
            </p>
          </div>

          <SuggestionForm
            onSubmit={handleSuggestionSubmit}
            isLoading={isSubmittingSuggestion}
          />
        </div>
      </section>
    </div>
  );
};