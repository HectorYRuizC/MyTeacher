import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      
      if (success) {
        toast({
          title: '¡Bienvenido!',
          description: 'Has iniciado sesión correctamente.',
        });
        
        // Redirect based on role
        if (email === 'admin@gmail.com') {
          navigate('/admin');
        } else {
          const users = JSON.parse(localStorage.getItem('users') || '[]');
          const user = users.find((u: any) => u.email === email);
          if (user?.role === 'tutor') {
            navigate('/tutor');
          } else {
            navigate('/student');
          }
        }
      } else {
        toast({
          title: 'Error al iniciar sesión',
          description: 'Credenciales inválidas o cuenta pendiente de aprobación.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Ocurrió un error al iniciar sesión.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <Card className="w-full max-w-md shadow-elegant">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-hero flex items-center justify-center">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl">Iniciar sesión</CardTitle>
          <CardDescription>Ingresa a tu cuenta de myTEACHER</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-primary font-medium hover:underline">
                Regístrate aquí
              </Link>
            </p>
            <p className="text-xs text-muted-foreground">
              <a href="#" className="hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </p>
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground text-center mb-2">
              <strong>Acceso de prueba:</strong>
            </p>
            <p className="text-xs text-muted-foreground">
              Admin: admin@gmail.com / admin123
            </p>
            <p className="text-xs text-muted-foreground">
              Tutor: maria.garcia@email.com / password123
            </p>
            <p className="text-xs text-muted-foreground">
              Estudiante: Registra una cuenta nueva
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
