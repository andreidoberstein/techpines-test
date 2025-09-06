import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { SongCard } from '@/components/SongCard';
import { SongForm } from '@/components/forms/SongForm';
import { songsService } from '@/services/songs';
import { useToast } from '@/hooks/use-toast';
import { usePagination } from '@/hooks/usePagination';
import { Song } from '@/types';
import { Search, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export const Songs = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { currentPage, goToPage, nextPage, prevPage } = usePagination();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [deletingSong, setDeletingSong] = useState<Song | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Check if should show new form from URL
  const shouldShowNewForm = searchParams.get('action') === 'new';
  const actualShowForm = showForm || shouldShowNewForm;

  const { data: songsData, isLoading } = useQuery({
    queryKey: ['songs', 'paginated', currentPage],
    queryFn: () => songsService.getSongs(currentPage, 12),
  });

  // Client-side search filtering
  const filteredSongs = useMemo(() => {
    if (!songsData?.data || !searchQuery.trim()) {
      return songsData?.data || [];
    }
    
    return songsData.data.filter(song =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [songsData?.data, searchQuery]);

  const createMutation = useMutation({
    mutationFn: songsService.createSong,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['songs'] });
      setShowForm(false);
      setSearchParams({}); // Clear URL action
      toast({
        title: 'Música adicionada com sucesso!',
        description: 'A nova música foi adicionada ao catálogo.',
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao adicionar música',
        description: error.response?.data?.message || 'Tente novamente mais tarde.',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      songsService.updateSong(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['songs'] });
      setEditingSong(null);
      toast({
        title: 'Música atualizada com sucesso!',
        description: 'As informações da música foram atualizadas.',
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar música',
        description: error.response?.data?.message || 'Tente novamente mais tarde.',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: songsService.deleteSong,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['songs'] });
      setDeletingSong(null);
      toast({
        title: 'Música removida com sucesso!',
        description: 'A música foi removida do catálogo.',
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao remover música',
        description: error.response?.data?.message || 'Tente novamente mais tarde.',
      });
    },
  });

  const handleCreateSong = async (data: any) => {
    await createMutation.mutateAsync(data);
  };

  const handleUpdateSong = async (data: any) => {
    if (editingSong) {
      await updateMutation.mutateAsync({ id: editingSong.id, data });
    }
  };

  const handleDeleteSong = async () => {
    if (deletingSong) {
      await deleteMutation.mutateAsync(deletingSong.id);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingSong(null);
    setSearchParams({}); // Clear URL action
  };

  if (actualShowForm || editingSong) {
    return (
      <div className="container mx-auto px-4 py-8">
        <SongForm
          song={editingSong || undefined}
          onSubmit={editingSong ? handleUpdateSong : handleCreateSong}
          onCancel={handleCancelForm}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-sertanejo-brown mb-2">
            Gerenciar Músicas
          </h1>
          <p className="text-muted-foreground">
            Adicione, edite ou remova músicas do catálogo
          </p>
        </div>
        <Button
          variant="hero"
          onClick={() => setShowForm(true)}
          className="mt-4 md:mt-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Música
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por título ou artista..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredSongs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredSongs.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                variant="default"
                showActions
                onEdit={setEditingSong}
                onDelete={setDeletingSong}
              />
            ))}
          </div>

          {/* Pagination - only show if no search query */}
          {!searchQuery && songsData && songsData.last_page > 1 && (
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
          <p className="text-muted-foreground mb-4">
            {searchQuery ? 'Nenhuma música encontrada para sua busca.' : 'Nenhuma música encontrada.'}
          </p>
          {!searchQuery && (
            <Button variant="hero" onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeira Música
            </Button>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingSong} onOpenChange={() => setDeletingSong(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a música "{deletingSong?.title}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSong}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : null}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};