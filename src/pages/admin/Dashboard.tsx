import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, BookOpen, CheckCircle, XCircle, Trash2, TrendingUp } from 'lucide-react';
import { Tutor, Session } from '@/types';
import { useToast } from '@/hooks/use-toast';
import MapView from '@/components/MapView';

const AdminDashboard = () => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    setTutors(users.filter((u: any) => u.role === 'tutor'));
    setStudents(users.filter((u: any) => u.role === 'student'));
    setSessions(JSON.parse(localStorage.getItem('sessions') || '[]'));
  };

  const handleApproveTutor = (tutorId: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((u: any) => 
      u.id === tutorId ? { ...u, status: 'approved' } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    loadData();
    toast({
      title: 'Tutor aprobado',
      description: 'El tutor ha sido aprobado exitosamente.',
    });
  };

  const handleRejectTutor = (tutorId: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((u: any) => 
      u.id === tutorId ? { ...u, status: 'rejected' } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    loadData();
    toast({
      title: 'Tutor rechazado',
      description: 'El tutor ha sido rechazado.',
      variant: 'destructive',
    });
  };

  const handleDeleteTutor = (tutorId: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.filter((u: any) => u.id !== tutorId);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    loadData();
    toast({
      title: 'Tutor eliminado',
      description: 'El tutor ha sido eliminado del sistema.',
    });
  };

  const popularSubjects = tutors
    .flatMap(t => t.subjects)
    .reduce((acc: any, subject) => {
      acc[subject] = (acc[subject] || 0) + 1;
      return acc;
    }, {});

  const topSubjects = Object.entries(popularSubjects)
    .sort(([, a]: any, [, b]: any) => b - a)
    .slice(0, 5);

  // Get coordinates of approved tutors for the map
  const approvedTutors = tutors.filter(t => t.status === 'approved' && t.coordinates);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Panel de Administración</h1>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tutores</p>
                <p className="text-3xl font-bold text-primary">{tutors.length}</p>
              </div>
              <Users className="w-12 h-12 text-primary/20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Estudiantes</p>
                <p className="text-3xl font-bold text-secondary">{students.length}</p>
              </div>
              <Users className="w-12 h-12 text-secondary/20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Clases Agendadas</p>
                <p className="text-3xl font-bold text-accent">{sessions.length}</p>
              </div>
              <BookOpen className="w-12 h-12 text-accent/20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Aprobaciones Pendientes</p>
                <p className="text-3xl font-bold text-orange-500">
                  {tutors.filter(t => t.status === 'pending').length}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-orange-500/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map */}
      {approvedTutors.length > 0 && (
        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle>Ubicación de Tutores Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <MapView
              startPoint={{
                lat: approvedTutors[0].coordinates!.lat,
                lng: approvedTutors[0].coordinates!.lng,
                label: 'Tutores en la zona',
              }}
              height="400px"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Visualización de la ubicación general de tutores aprobados en el sistema
            </p>
          </CardContent>
        </Card>
      )}

      {/* Popular Subjects */}
      {topSubjects.length > 0 && (
        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle>Materias Más Populares</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topSubjects.map(([subject, count]: any, index) => (
                <div key={subject} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full gradient-hero text-white flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className="font-medium">{subject}</span>
                  </div>
                  <Badge variant="secondary">{count} tutores</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tutors Management */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Gestión de Tutores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tutors.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No hay tutores registrados</p>
            ) : (
              tutors.map((tutor) => (
                <div key={tutor.id} className="border rounded-lg p-4 flex items-start gap-4">
                  <img
                    src={tutor.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${tutor.email}`}
                    alt={tutor.fullName}
                    className="w-16 h-16 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{tutor.fullName}</h3>
                        <p className="text-sm text-muted-foreground">{tutor.specialty}</p>
                      </div>
                      <Badge
                        variant={
                          tutor.status === 'approved'
                            ? 'default'
                            : tutor.status === 'pending'
                            ? 'secondary'
                            : 'destructive'
                        }
                      >
                        {tutor.status === 'approved'
                          ? 'Aprobado'
                          : tutor.status === 'pending'
                          ? 'Pendiente'
                          : 'Rechazado'}
                      </Badge>
                    </div>
                    <p className="text-sm mb-2">{tutor.email} • {tutor.phone}</p>
                    <p className="text-sm text-muted-foreground mb-3">{tutor.bio}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {tutor.subjects.slice(0, 3).map((subject) => (
                        <Badge key={subject} variant="outline">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      {tutor.status !== 'approved' && (
                        <Button
                          size="sm"
                          onClick={() => handleApproveTutor(tutor.id)}
                          className="gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Aprobar
                        </Button>
                      )}
                      {tutor.status !== 'rejected' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRejectTutor(tutor.id)}
                          className="gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Rechazar
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteTutor(tutor.id)}
                        className="gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
