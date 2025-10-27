import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Tutor, Modality, Session, Notification } from '@/types';
import { Calendar, Clock, DollarSign, MapPin } from 'lucide-react';
import MapView from '@/components/MapView';

const BookSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [modality, setModality] = useState<Modality>('online');
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState(1);
  const [address, setAddress] = useState('');
  const [studentCoords, setStudentCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundTutor = users.find((u: any) => u.id === id && u.role === 'tutor');
    setTutor(foundTutor || null);
    if (foundTutor) {
      setModality(foundTutor.modality === 'both' ? 'online' : foundTutor.modality);
      if (foundTutor.subjects.length > 0) {
        setSubject(foundTutor.subjects[0]);
      }
    }
  }, [id]);

  const handleAddressChange = (newAddress: string) => {
    setAddress(newAddress);
    
    // Simulate geocoding - In real app, you'd use a geocoding API
    // For now, we'll generate random coordinates near Bogotá
    if (newAddress.trim()) {
      const baseLat = 4.6097;
      const baseLng = -74.0817;
      const randomLat = baseLat + (Math.random() - 0.5) * 0.1;
      const randomLng = baseLng + (Math.random() - 0.5) * 0.1;
      setStudentCoords({ lat: randomLat, lng: randomLng });
    } else {
      setStudentCoords(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !tutor) return;

    if (modality === 'presencial' && !address) {
      toast({
        title: 'Dirección requerida',
        description: 'Por favor ingresa tu dirección para clases presenciales.',
        variant: 'destructive',
      });
      return;
    }

    const cost = tutor.hourlyRate * duration;
    
    const newSession: Session = {
      id: `session-${Date.now()}`,
      studentId: user.id,
      tutorId: tutor.id,
      subject,
      modality,
      date,
      time,
      duration,
      status: 'pending',
      cost,
      studentAddress: modality === 'presencial' ? address : undefined,
      studentCoordinates: modality === 'presencial' ? studentCoords || undefined : undefined,
      createdAt: new Date().toISOString(),
    };

    // Save session
    const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
    sessions.push(newSession);
    localStorage.setItem('sessions', JSON.stringify(sessions));

    // Create notifications
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    
    const tutorNotification: Notification = {
      id: `notif-${Date.now()}-tutor`,
      userId: tutor.id,
      type: 'session_request',
      title: 'Nueva solicitud de clase',
      message: `${user.fullName} ha solicitado una clase de ${subject}`,
      timestamp: new Date().toISOString(),
      read: false,
      link: '/tutor/sessions',
    };

    const studentNotification: Notification = {
      id: `notif-${Date.now()}-student`,
      userId: user.id,
      type: 'session_request',
      title: '¡Reserva confirmada!',
      message: `Tu solicitud ha sido enviada a ${tutor.fullName}. Espera su aceptación.`,
      timestamp: new Date().toISOString(),
      read: false,
      link: '/student/sessions',
    };

    notifications.push(tutorNotification, studentNotification);
    localStorage.setItem('notifications', JSON.stringify(notifications));

    toast({
      title: '¡Reserva enviada!',
      description: 'Espera la aceptación del tutor.',
    });

    navigate('/student/sessions');
  };

  if (!tutor) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Tutor no encontrado</p>
      </div>
    );
  }

  const cost = tutor.hourlyRate * duration;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Reservar sesión con {tutor.fullName}</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Detalles de la sesión</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Modality */}
                {tutor.modality === 'both' && (
                  <div className="space-y-3">
                    <Label>Modalidad</Label>
                    <RadioGroup value={modality} onValueChange={(v) => setModality(v as Modality)}>
                      <div className="flex items-center space-x-2 border rounded-lg p-4">
                        <RadioGroupItem value="online" id="online" />
                        <Label htmlFor="online" className="flex-1 cursor-pointer">
                          En línea (videollamada)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-lg p-4">
                        <RadioGroupItem value="presencial" id="presencial" />
                        <Label htmlFor="presencial" className="flex-1 cursor-pointer">
                          Presencial (en tu ubicación)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {/* Address for presencial */}
                {modality === 'presencial' && (
                  <div className="space-y-2">
                    <Label htmlFor="address">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Tu dirección *
                    </Label>
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => handleAddressChange(e.target.value)}
                      placeholder="Ej: Calle 123 #45-67, Bogotá"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      El tutor verá esta dirección al aceptar la clase
                    </p>
                  </div>
                )}

                {/* Subject */}
                <div className="space-y-2">
                  <Label htmlFor="subject">Materia</Label>
                  <Select value={subject} onValueChange={setSubject} required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tutor.subjects.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date and Time */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Fecha
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Hora
                    </Label>
                    <Input
                      id="time"
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <Label htmlFor="duration">Duración (horas)</Label>
                  <Select value={duration.toString()} onValueChange={(v) => setDuration(parseInt(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hora</SelectItem>
                      <SelectItem value="2">2 horas</SelectItem>
                      <SelectItem value="3">3 horas</SelectItem>
                      <SelectItem value="4">4 horas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="flex-1">
                    Confirmar reserva
                  </Button>
                  <Button type="button" variant="outline" onClick={() => navigate('/student')}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Map preview for presencial */}
          {modality === 'presencial' && studentCoords && tutor.coordinates && (
            <Card className="shadow-card mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Ruta del tutor hacia tu ubicación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MapView
                  startPoint={{
                    lat: tutor.coordinates.lat,
                    lng: tutor.coordinates.lng,
                    label: `${tutor.fullName} (Tutor)`,
                  }}
                  endPoint={{
                    lat: studentCoords.lat,
                    lng: studentCoords.lng,
                    label: 'Tu ubicación',
                  }}
                  height="400px"
                  showRoute={true}
                />
                <p className="text-sm text-muted-foreground mt-3">
                  Esta es una vista previa de cómo el tutor verá la ruta hacia tu ubicación
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Summary */}
        <div>
          <Card className="shadow-card sticky top-24">
            <CardHeader>
              <CardTitle>Resumen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <img
                  src={tutor.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${tutor.email}`}
                  alt={tutor.fullName}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <p className="font-semibold">{tutor.fullName}</p>
                  <p className="text-sm text-muted-foreground">{tutor.specialty}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Materia:</span>
                  <span className="font-medium">{subject || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Modalidad:</span>
                  <span className="font-medium capitalize">{modality}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fecha:</span>
                  <span className="font-medium">{date || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hora:</span>
                  <span className="font-medium">{time || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duración:</span>
                  <span className="font-medium">{duration}h</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground">Tarifa por hora:</span>
                  <span>${tutor.hourlyRate.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-lg font-bold">
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-5 h-5" />
                    Total:
                  </span>
                  <span className="text-primary">${cost.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookSession;
