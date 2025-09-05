import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Music, Users, Settings, TrendingUp, Plus } from 'lucide-react';

export const Dashboard = () => {
  const { user, isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-sertanejo-brown mb-2">
            Bem-vindo, {user?.name}!
          </h1>
          <p className="text-lg text-muted-foreground">
            Gerencie as músicas e {isAdmin ? 'sugestões' : 'seu conteúdo'} da plataforma
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card variant="sertanejo">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Músicas</p>
                  <p className="text-2xl font-bold text-sertanejo-brown">-</p>
                </div>
                <Music className="h-8 w-8 text-sertanejo-green" />
              </div>
            </CardContent>
          </Card>

          <Card variant="sertanejo">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Top 5 Ativo</p>
                  <p className="text-2xl font-bold text-sertanejo-brown">5</p>
                </div>
                <TrendingUp className="h-8 w-8 text-sertanejo-green" />
              </div>
            </CardContent>
          </Card>

          {isAdmin && (
            <Card variant="sertanejo">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Sugestões Pendentes</p>
                    <p className="text-2xl font-bold text-sertanejo-brown">1</p>
                  </div>
                  <Users className="h-8 w-8 text-sertanejo-green" />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Songs Management */}
          <Card variant="hero" className="group hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-sertanejo-cream">
                <Music className="h-6 w-6" />
                <span>Gerenciar Músicas</span>
              </CardTitle>
              <CardDescription className="text-sertanejo-beige">
                Adicione, edite ou remova músicas do catálogo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sertanejo-beige/90">
                Controle total sobre o repertório de Tião Carreiro & Pardinho. 
                Adicione novas músicas, edite informações e organize o conteúdo.
              </p>
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  asChild
                  className="bg-sertanejo-cream/20 border-sertanejo-cream/40 text-sertanejo-cream hover:bg-sertanejo-cream/30"
                >
                  <Link to="/dashboard/songs">
                    <Settings className="h-4 w-4 mr-2" />
                    Gerenciar
                  </Link>
                </Button>
                <Button 
                  variant="secondary" 
                  asChild
                  className="bg-sertanejo-cream text-sertanejo-brown hover:bg-sertanejo-beige"
                >
                  <Link to="/dashboard/songs?action=new">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Música
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Admin Section */}
          {isAdmin && (
            <Card variant="hero" className="group hover:scale-105 transition-transform duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-sertanejo-cream">
                  <Users className="h-6 w-6" />
                  <span>Painel Admin</span>
                </CardTitle>
                <CardDescription className="text-sertanejo-beige">
                  Gerencie sugestões e configurações avançadas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sertanejo-beige/90">
                  Revise e aprove sugestões enviadas pelos usuários. 
                  Controle a qualidade do conteúdo da plataforma.
                </p>
                <Button 
                  variant="outline" 
                  asChild
                  className="bg-sertanejo-cream/20 border-sertanejo-cream/40 text-sertanejo-cream hover:bg-sertanejo-cream/30"
                >
                  <Link to="/dashboard/admin">
                    <Settings className="h-4 w-4 mr-2" />
                    Painel Admin
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Back to Home */}
          <Card variant="sertanejo">
            <CardHeader>
              <CardTitle className="text-sertanejo-brown">
                Visualizar Site Público
              </CardTitle>
              <CardDescription>
                Veja como os visitantes experimentam a plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Acesse a página inicial para ver o Top 5 e todas as músicas 
                como um visitante comum.
              </p>
              <Button variant="outline" asChild>
                <Link to="/">
                  Ver Site Público
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};