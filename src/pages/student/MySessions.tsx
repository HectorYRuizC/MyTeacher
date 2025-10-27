import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Session, Tutor } from '@/types';
import { Calendar, Clock, DollarSign } from 'lucide-react';

const MySessions = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [tutors, setTutors] = useState<Record<string, Tutor>>({});

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = () => {
    const allSessions = JSON.parse(localStorage.getItem('sessions') || '[]');
    const mySessions = allSessions.filter((s: Session) => s.studentId === user?.id);
    setSessions(mySessions);

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const tutorMap: Record<string, Tutor> = {};
    mySessions.forEach((s: Session) => {
      const tutor = users.find((u: any) => u.id === s.tutorId);
      if (tutor) {
        tutorMap[s.tutorId] = tutor;
      }
    });
    setTutors(tutorMap);
  };

  const pendingSessions = sessions.filter((s) => s.status === 'pending');
  const acceptedSessions = sessions.filter((s) => s.status === 'accepted');
  const completedSessions = sessions.filter((s) => s.status === 'completed');

  const SessionCard = ({ session }: { session: Session }) => {
    const tutor = tutors[session.tutorId];
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <img
              src={tutor?.photo}
              alt={tutor?.fullName}
              className="w-16 h-16 rounded-full"
            />
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">{tutor?.fullName}</h3>
              <p className="text-sm text-muted-foreground mb-3">{session.subject}</p>
              
              <div className="grid md:grid-cols-2 gap-3 text-sm mb-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{session.date}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{session.time} ({session.duration}h)</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="capitalize">{session.modality}</Badge>
                <Badge
                  variant={
                    session.status === 'accepted'
                      ? 'default'
                      : session.status === 'pending'
                      ? 'secondary'
                      : session.status === 'completed'
                      ? 'default'
                      : 'destructive'
                  }
                >
                  {session.status === 'accepted'
                    ? 'Aceptada'
                    : session.status === 'pending'
                    ? 'Pendiente'
                    : session.status === 'completed'
                    ? 'Completada'
                    : 'Rechazada'}
                </Badge>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-1 text-primary font-bold text-xl">
                <DollarSign className="w-5 h-5" />
                {session.cost.toLocaleString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mis Tutorías</h1>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Historial de Clases</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="accepted">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="accepted">
                Aceptadas ({acceptedSessions.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pendientes ({pendingSessions.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completadas ({completedSessions.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="accepted" className="space-y-4 mt-6">
              {acceptedSessions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No tienes clases aceptadas
                </p>
              ) : (
                acceptedSessions.map((session) => (
                  <SessionCard key={session.id} session={session} />
                ))
              )}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4 mt-6">
              {pendingSessions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No tienes solicitudes pendientes
                </p>
              ) : (
                pendingSessions.map((session) => (
                  <SessionCard key={session.id} session={session} />
                ))
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4 mt-6">
              {completedSessions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No tienes clases completadas
                </p>
              ) : (
                completedSessions.map((session) => (
                  <SessionCard key={session.id} session={session} />
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MySessions;
