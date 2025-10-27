import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Bell, User, LogOut, Home, MessageCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { Notification } from '@/types';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      const notifications: Notification[] = JSON.parse(localStorage.getItem('notifications') || '[]');
      const unread = notifications.filter(n => n.userId === user.id && !n.read).length;
      setUnreadCount(unread);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center">
              <span className="text-white font-bold text-xl">mT</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              myTEACHER
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/login">Iniciar sesión</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Registrarse</Link>
            </Button>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center">
            <span className="text-white font-bold text-xl">mT</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            myTEACHER
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to={user.role === 'admin' ? '/admin' : user.role === 'tutor' ? '/tutor' : '/student'}>
              <Home className="h-5 w-5" />
            </Link>
          </Button>

          {user.role !== 'admin' && (
            <Button variant="ghost" size="icon" asChild>
              <Link to="/chat">
                <MessageCircle className="h-5 w-5" />
              </Link>
            </Button>
          )}

          <Button variant="ghost" size="icon" asChild className="relative">
            <Link to="/notifications">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-destructive">
                  {unreadCount}
                </Badge>
              )}
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <img
                  src={user.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                  alt={user.fullName}
                  className="w-8 h-8 rounded-full"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-popover">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user.fullName}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Mi perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
