import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Tutor } from '@/types';
import { User as UserIcon, LogOut } from 'lucide-react';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    bio: (user as Tutor)?.bio || '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateUser(formData);
    toast({
      title: 'Perfil actualizado',
      description: 'Tus cambios han sido guardados.',
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Mi Perfil</h1>

      <div className="space-y-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="w-5 h-5" />
              Información Personal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={user.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                  alt={user.fullName}
                  className="w-32 h-32 rounded-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Nombre completo</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" value={user.email} disabled className="bg-muted" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Rol</Label>
              <Input
                value={
                  user.role === 'admin'
                    ? 'Administrador'
                    : user.role === 'tutor'
                    ? 'Tutor'
                    : 'Estudiante'
                }
                disabled
                className="bg-muted capitalize"
              />
            </div>

            {user.role === 'tutor' && (
              <div className="space-y-2">
                <Label htmlFor="bio">Biografía</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  rows={4}
                />
              </div>
            )}

            <div className="flex gap-3">
              <Button onClick={handleSave} className="flex-1">
                Guardar cambios
              </Button>
              <Button variant="outline" onClick={() => navigate(-1)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-destructive/20">
          <CardHeader>
            <CardTitle className="text-destructive">Cerrar sesión</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Al cerrar sesión, deberás ingresar tus credenciales nuevamente.
            </p>
            <Button variant="destructive" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
