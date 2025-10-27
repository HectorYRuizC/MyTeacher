import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { UserPlus } from 'lucide-react';
import { Modality, UserRole } from '@/types';

const Register = () => {
  const [role, setRole] = useState<UserRole>('student');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    specialty: '',
    experience: '',
    educationLevel: '',
    bio: '',
    modality: 'online' as Modality,
    hourlyRate: '',
    subjects: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Las contraseñas no coinciden.',
        variant: 'destructive',
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: 'Error',
        description: 'La contraseña debe tener al menos 6 caracteres.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const userData: any = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role,
      };

      if (role === 'tutor') {
        userData.specialty = formData.specialty;
        userData.experience = formData.experience;
        userData.educationLevel = formData.educationLevel;
        userData.bio = formData.bio;
        userData.modality = formData.modality;
        userData.hourlyRate = parseInt(formData.hourlyRate) || 25000;
        userData.subjects = formData.subjects.split(',').map(s => s.trim());
        userData.schedule = ['Lunes 9:00-17:00', 'Miércoles 9:00-17:00'];
      }

      const success = await register(userData);
      
      if (success) {
        toast({
          title: '¡Registro exitoso!',
          description: role === 'tutor' 
            ? 'Tu registro ha sido enviado. En espera de aprobación del administrador.'
            : 'Tu cuenta ha sido creada. Ya puedes iniciar sesión.',
        });
        navigate('/login');
      } else {
        toast({
          title: 'Error',
          description: 'Este correo ya está registrado.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Ocurrió un error al registrarte.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <Card className="max-w-2xl mx-auto shadow-elegant">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-hero flex items-center justify-center">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl">Crear cuenta</CardTitle>
          <CardDescription>Únete a myTEACHER como estudiante o tutor</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-3">
              <Label>¿Cómo te quieres registrar?</Label>
              <RadioGroup value={role} onValueChange={(value) => setRole(value as UserRole)}>
                <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="student" id="student" />
                  <Label htmlFor="student" className="flex-1 cursor-pointer">
                    <div className="font-semibold">Estudiante</div>
                    <div className="text-xs text-muted-foreground">Busco aprender con tutores expertos</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="tutor" id="tutor" />
                  <Label htmlFor="tutor" className="flex-1 cursor-pointer">
                    <div className="font-semibold">Tutor</div>
                    <div className="text-xs text-muted-foreground">Quiero enseñar y compartir mis conocimientos</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre completo *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+57 300 123 4567"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Tutor-specific fields */}
            {role === 'tutor' && (
              <>
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Información profesional</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="specialty">Especialidad *</Label>
                      <Input
                        id="specialty"
                        value={formData.specialty}
                        onChange={(e) => handleChange('specialty', e.target.value)}
                        placeholder="Ej: Matemáticas, Programación"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience">Experiencia *</Label>
                      <Input
                        id="experience"
                        value={formData.experience}
                        onChange={(e) => handleChange('experience', e.target.value)}
                        placeholder="Ej: 5 años"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <Label htmlFor="educationLevel">Nivel educativo *</Label>
                    <Input
                      id="educationLevel"
                      value={formData.educationLevel}
                      onChange={(e) => handleChange('educationLevel', e.target.value)}
                      placeholder="Ej: Licenciatura en Matemáticas"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2 mb-4">
                    <Label htmlFor="subjects">Materias (separadas por comas) *</Label>
                    <Input
                      id="subjects"
                      value={formData.subjects}
                      onChange={(e) => handleChange('subjects', e.target.value)}
                      placeholder="Ej: Álgebra, Cálculo, Geometría"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2 mb-4">
                    <Label htmlFor="bio">Biografía *</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleChange('bio', e.target.value)}
                      placeholder="Cuéntanos sobre ti y tu experiencia como tutor..."
                      rows={4}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="modality">Modalidad *</Label>
                      <Select value={formData.modality} onValueChange={(value) => handleChange('modality', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="presencial">Presencial</SelectItem>
                          <SelectItem value="online">En línea</SelectItem>
                          <SelectItem value="both">Ambas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hourlyRate">Tarifa por hora (COP)</Label>
                      <Input
                        id="hourlyRate"
                        type="number"
                        value={formData.hourlyRate}
                        onChange={(e) => handleChange('hourlyRate', e.target.value)}
                        placeholder="25000"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Registrando...' : 'Crear cuenta'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Inicia sesión aquí
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
