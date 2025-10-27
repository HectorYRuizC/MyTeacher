import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Session, Notification, Tutor, Student } from '@/types';
import { Calendar, CheckCircle, XCircle, MapPin, User as UserIcon } from 'lucide-react';
import MapView from '@/components/MapView';

const TutorDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [students, setStudents] = useState<Record<string, Student>>({});

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = () => {
    const allSessions = JSON.parse(localStorage.getItem('sessions') || '[]');
    const mySessions = allSessions.filter((s: Session) => s.tutorId === user?.id);
    setSessions(mySessions);

    // Load student details
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const studentMap: Record<string, Student> = {};
    mySessions.forEach((s: Session) => {
      const student = users.find((u: any) => u.id === s.studentId);
      if (student) {
        studentMap[s.studentId] = student;
      }
    });
    setStudents(studentMap);
  };

  const handleAcceptSession = (sessionId: string) => {
    const allSessions = JSON.parse(localStorage.getItem('sessions') || '[]');
    const updatedSessions = allSessions.map((s: Session) =>
      s.id === sessionId ? { ...s, status: 'accepted' as const } : s
    );
    localStorage.setItem('sessions', JSON.stringify(updatedSessions));

    // Create notification
    const session = allSessions.find((s: Session) => s.id === sessionId);
    if (session) {
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      notifications.push({
        id: `notif-${Date.now()}`,
        userId: session.studentId,
        type: 'session_accepted',
        title: 'Clase aceptada',
        message: `Tu clase de ${session.subject} ha sido aceptada`,
        timestamp: new Date().toISOString(),
        read: false,
      });
      localStorage.setItem('notifications', JSON.stringify(notifications));
    }

    loadSessions();
    toast({
      title: 'Clase aceptada',
      description: 'Has aceptado la solicitud de clase.',
    });
  };

  const handleRejectSession = (sessionId: string) => {
    const allSessions = JSON.parse(localStorage.getItem('sessions') || '[]');
    const updatedSessions = allSessions.map((s: Session) =>
      s.id === sessionId ? { ...s, status: 'rejected' as const } : s
    );
    localStorage.setItem('sessions', JSON.stringify(updatedSessions));

    // Create notification
    const session = allSessions.find((s: Session) => s.id === sessionId);
    if (session) {
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      notifications.push({
        id: `notif-${Date.now()}`,
        userId: session.studentId,
        type: 'session_rejected',
        title: 'Clase no disponible',
        message: `Tu solicitud de clase de ${session.subject} no pudo ser aceptada`,
        timestamp: new Date().toISOString(),
        read: false,
      });
      localStorage.setItem('notifications', JSON.stringify(notifications));
    }

    loadSessions();
    toast({
      title: 'Clase rechazada',
      description: 'Has rechazado la solicitud.',
      variant: 'destructive',
    });
  };

  const pendingSessions = sessions.filter((s) => s.status === 'pending');
  const upcomingSessions = sessions.filter(
    (s) => s.status === 'accepted' && new Date(s.date) >= new Date()
  );
  const completedSessions = sessions.filter((s) => s.status === 'completed');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Mi Panel de Tutor</h1>
        <p className="text-muted-foreground">Gestiona tus clases y solicitudes</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Solicitudes pendientes</p>
                <p className="text-3xl font-bold text-orange-500">{pendingSessions.length}</p>
              </div>
              <Calendar className="w-12 h-12 text-orange-500/20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Próximas clases</p>
                <p className="text-3xl font-bold text-primary">{upcomingSessions.length}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-primary/20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Clases completadas</p>
                <p className="text-3xl font-bold text-secondary">{completedSessions.length}</p>
              </div>
              <UserIcon className="w-12 h-12 text-secondary/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sessions Tabs */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Mis Clases</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending">
                Pendientes ({pendingSessions.length})
              </TabsTrigger>
              <TabsTrigger value="upcoming">
                Próximas ({upcomingSessions.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completadas ({completedSessions.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4 mt-6">
              {pendingSessions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No tienes solicitudes pendientes
                </p>
              ) : (
                pendingSessions.map((session) => {
                  const student = students[session.studentId];
                  return (
                    <Card key={session.id} className="border-orange-200">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                          <div className="flex-1">
                            <div className="flex items-start gap-4 mb-4">
                              <img
                                src={student?.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student?.email}`}
                                alt={student?.fullName}
                                className="w-16 h-16 rounded-full"
                              />
                              <div className="flex-1">
                                <h3 className="font-bold text-lg mb-1">{student?.fullName}</h3>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {student?.email}
                                </p>
                                <Badge variant="secondary">{session.subject}</Badge>
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
                              <div>
                                <p className="text-muted-foreground">Fecha y hora:</p>
                                <p className="font-semibold">
                                  {session.date} a las {session.time}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Duración:</p>
                                <p className="font-semibold">{session.duration} hora(s)</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Modalidad:</p>
                                <p className="font-semibold capitalize">{session.modality}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Pago:</p>
                                <p className="font-semibold text-primary">
                                  ${session.cost.toLocaleString()}
                                </p>
                              </div>
                            </div>

                            {session.modality === 'presencial' && session.studentAddress && (
                              <div className="bg-muted/50 rounded-lg p-4 mb-4">
                                <p className="text-sm font-semibold mb-1 flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-primary" />
                                  Dirección del estudiante:
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {session.studentAddress}
                                </p>
                              </div>
                            )}

                            <div className="flex gap-3">
                              <Button
                                onClick={() => handleAcceptSession(session.id)}
                                className="gap-2"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Aceptar
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => handleRejectSession(session.id)}
                                className="gap-2"
                              >
                                <XCircle className="w-4 h-4" />
                                Rechazar
                              </Button>
                            </div>
                          </div>

                          {/* Map for presencial sessions */}
                          {session.modality === 'presencial' &&
                            session.studentCoordinates &&
                            (user as Tutor)?.coordinates && (
                              <div className="lg:w-96">
                                <MapView
                                  startPoint={{
                                    lat: (user as Tutor).coordinates!.lat,
                                    lng: (user as Tutor).coordinates!.lng,
                                    label: 'Tu ubicación',
                                  }}
                                  endPoint={{
                                    lat: session.studentCoordinates.lat,
                                    lng: session.studentCoordinates.lng,
                                    label: student?.fullName || 'Estudiante',
                                  }}
                                  height="300px"
                                  showRoute={true}
                                />
                              </div>
                            )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-4 mt-6">
              {upcomingSessions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No tienes clases próximas
                </p>
              ) : (
                upcomingSessions.map((session) => {
                  const student = students[session.studentId];
                  return (
                    <Card key={session.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <img
                            src={student?.photo}
                            alt={student?.fullName}
                            className="w-12 h-12 rounded-full"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold">{student?.fullName}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {session.subject} • {session.date} a las {session.time}
                            </p>
                            <div className="flex gap-2">
                              <Badge variant="secondary">{session.modality}</Badge>
                              <Badge variant="outline">{session.duration}h</Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-primary">
                              ${session.cost.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4 mt-6">
              {completedSessions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No tienes clases completadas aún
                </p>
              ) : (
                completedSessions.map((session) => {
                  const student = students[session.studentId];
                  return (
                    <Card key={session.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <img
                            src={student?.photo}
                            alt={student?.fullName}
                            className="w-12 h-12 rounded-full"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold">{student?.fullName}</h3>
                            <p className="text-sm text-muted-foreground">
                              {session.subject} • {session.date}
                            </p>
                          </div>
                          <Badge>Completada</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TutorDashboard;
