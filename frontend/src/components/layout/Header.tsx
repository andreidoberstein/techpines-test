import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Music, User, Shield } from 'lucide-react';

export const Header = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-gradient-sertanejo shadow-sertanejo border-b border-sertanejo-beige/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center space-x-3 group"
          >
            <Music className="h-8 w-8 text-sertanejo-cream group-hover:rotate-12 transition-transform duration-300" />
            <div>
              <h1 className="text-xl font-bold text-sertanejo-cream">
                Top 5 Tião Carreiro
              </h1>
              <p className="text-sm text-sertanejo-beige/80">
                & Pardinho
              </p>
            </div>
          </Link>

          <nav className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2 text-sertanejo-cream">
                  <User className="h-4 w-4" />
                  <span className="text-sm">
                    Olá, {user?.name}
                  </span>
                  {isAdmin && (
                    <span title="Administrador">
                      <Shield className="h-4 w-4 text-sertanejo-beige" />
                    </span>
                  )}
                </div>
                
                {location.pathname !== '/dashboard' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    asChild
                    className="bg-sertanejo-cream/10 border-sertanejo-cream/30 text-sertanejo-cream hover:bg-sertanejo-cream/20"
                  >
                    <Link to="/dashboard">Dashboard</Link>
                  </Button>
                )}
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-sertanejo-cream hover:bg-sertanejo-cream/20"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                asChild
                className="bg-sertanejo-cream/10 border-sertanejo-cream/30 text-sertanejo-cream hover:bg-sertanejo-cream/20"
              >
                <Link to="/login">Login</Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};