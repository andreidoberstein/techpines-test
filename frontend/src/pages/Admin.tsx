import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { suggestionsService } from '@/services/suggestions';
import { useToast } from '@/hooks/use-toast';
import { extractYouTubeId, getYouTubeThumbnail } from '@/lib/schemas';
import { CheckCircle, XCircle, AlertTriangle, Music, ExternalLink, Hash } from 'lucide-react';

export const Admin = () => {
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState([]);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [testId, setTestId] = useState<string>('');
  const [testAction, setTestAction] = useState<'approve' | 'reject' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const HAS_ADMIN_LIST = import.meta.env.VITE_HAS_ADMIN_LIST === '1';

  useEffect(() => {
    const fetchSuggestions = async () => {
      const data = await suggestionsService.getSuggestion()
      setSuggestions(data)
    }

    fetchSuggestions()
      .catch(console.error)
  }, [processingId])

  const handleApproveSuggestion = async (id: number) => {
    setProcessingId(id);
      console.log('id ' + id)

    try {
      const result = await suggestionsService.approveSuggestion(id);
      console.log('result ' + result.song)
      toast({
        title: 'Sugestão aprovada com sucesso!',
        description: `A música "${result.song.title}" foi adicionada ao catálogo.`,
      });
      // Remove da lista local se usando mock
      if (!HAS_ADMIN_LIST) {
        // In real implementation, would refetch the suggestions
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao aprovar sugestão',
        description: 'Tente novamente mais tarde.',
      });
      console.error(error.response?.data)
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectSuggestion = async (id: number) => {
    setProcessingId(id);
    try {
      await suggestionsService.rejectSuggestion(id);
      toast({
        title: 'Sugestão rejeitada',
        description: 'A sugestão foi rejeitada e removida da lista.',
      });
      // Remove da lista local se usando mock
      if (!HAS_ADMIN_LIST) {
        // In real implementation, would refetch the suggestions
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao rejeitar sugestão',
        description: error.response?.data?.message || 'Tente novamente mais tarde.',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleTestAction = async () => {
    if (!testId || !testAction) return;
    
    const id = parseInt(testId);
    if (isNaN(id)) {
      toast({
        variant: 'destructive',
        title: 'ID inválido',
        description: 'Por favor, digite um ID numérico válido.',
      });
      return;
    }

    // if (testAction === 'approve') {
    //   await handleApproveSuggestion(id);
    // } else {
    //   await handleRejectSuggestion(id);
    // }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-sertanejo-brown mb-2">
          Painel Administrativo
        </h1>
        <p className="text-muted-foreground">
          Gerencie sugestões e aprove novo conteúdo para a plataforma
        </p>
      </div>

      {/* Status do endpoint */}
      <Card variant="sertanejo" className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-sertanejo-green" />
            <span>Status dos Endpoints</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm">
              <strong>Listagem de sugestões:</strong> {HAS_ADMIN_LIST ? '✅ Disponível' : '❌ Não disponível'}
            </p>
            <p className="text-sm">
              <strong>Aprovação/Rejeição:</strong> ✅ Disponível
            </p>
            {!HAS_ADMIN_LIST && (
              <p className="text-sm text-muted-foreground mt-4">
                Configure VITE_HAS_ADMIN_LIST=1 no .env para habilitar a listagem automática.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {HAS_ADMIN_LIST ? (
        /* Seção com listagem automática (quando VITE_HAS_ADMIN_LIST=1) */
        <div>
          <h2 className="text-2xl font-bold text-sertanejo-brown mb-6">
            Sugestões Pendentes
          </h2>
          
          {suggestions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestions.map((suggestion) => (
                <Card key={suggestion.id} variant="default" className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <img
                        src={getYouTubeThumbnail(suggestion.video_id)}
                        alt={`Thumbnail de ${suggestion.title || 'sugestão'}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-music.jpg';
                        }}
                      />
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {suggestion.title || 'Sem título'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        ID: {suggestion.id} • {new Date(suggestion.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full justify-start text-xs"
                        asChild
                      >
                        <a
                          href={suggestion.youtube_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-3 w-3 mr-2" />
                          Ver no YouTube
                        </a>
                      </Button>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button
                        size="sm"
                        variant="accent"
                        onClick={() => handleApproveSuggestion(suggestion.id)}
                        disabled={processingId === suggestion.id}
                        className="flex-1"
                      >
                        {processingId === suggestion.id ? (
                          <LoadingSpinner size="sm" className="mr-2" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-2" />
                        )}
                        Aprovar
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRejectSuggestion(suggestion.id)}
                        disabled={processingId === suggestion.id}
                        className="flex-1"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Rejeitar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Nenhuma sugestão pendente no momento.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Seção manual para testar ações por ID */
        <div>
          <h2 className="text-2xl font-bold text-sertanejo-brown mb-6">
            Gerenciar Sugestões por ID
          </h2>
          
          <Card variant="sertanejo" className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Teste de Ações</CardTitle>
              <CardDescription className="text-center">
                Como a listagem não está disponível, você pode testar as ações por ID
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="testId">ID da Sugestão</Label>
                <Input
                  id="testId"
                  type="number"
                  placeholder="Digite o ID da sugestão"
                  value={testId}
                  onChange={(e) => setTestId(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="accent"
                  onClick={() => {
                    setTestAction('approve');
                    handleTestAction();
                  }}
                  disabled={!testId || processingId !== null}
                >
                  {processingId !== null && testAction === 'approve' ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  Aprovar
                </Button>
                
                <Button
                  variant="destructive"
                  onClick={() => {
                    setTestAction('reject');
                    handleTestAction();
                  }}
                  disabled={!testId || processingId !== null}
                >
                  {processingId !== null && testAction === 'reject' ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-2" />
                  )}
                  Rejeitar
                </Button>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">IDs para teste:</h4>
                <div className="text-sm space-y-1 text-muted-foreground">
                  <p>• ID 1: Mock suggestion (Rei do Gado)</p>
                  <p>• ID 2: Mock suggestion (Pagode em Brasília)</p>
                  <p>• IDs válidos da API (se existirem)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};