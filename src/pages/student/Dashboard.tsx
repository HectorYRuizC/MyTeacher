import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Star, MapPin, Video, User as UserIcon, Calendar } from 'lucide-react';
import { Tutor, Session } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [filteredTutors, setFilteredTutors] = useState<Tutor[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalityFilter, setModalityFilter] = useState<string>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterTutors();
  }, [searchQuery, modalityFilter, subjectFilter, tutors]);

  const loadData = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const approvedTutors = users.filter((u: any) => u.role === 'tutor' && u.status === 'approved');
    setTutors(approvedTutors);
    setFilteredTutors(approvedTutors);

    const allSessions = JSON.parse(localStorage.getItem('sessions') || '[]');
    const mySessions = allSessions.filter((s: Session) => s.studentId === user?.id);
    setSessions(mySessions);
  };

  const filterTutors = () => {
    let filtered = [...tutors];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (t) =>
          t.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.subjects.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Modality filter
    if (modalityFilter !== 'all') {
      filtered = filtered.filter(
        (t) => t.modality === modalityFilter || t.modality === 'both'
      );
    }

    // Subject filter
    if (subjectFilter !== 'all') {
      filtered = filtered.filter((t) => t.subjects.includes(subjectFilter));
    }

    setFilteredTutors(filtered);
  };

  const allSubjects = Array.from(new Set(tutors.flatMap((t) => t.subjects))).sort();

  const upcomingSessions = sessions.filter(
    (s) => s.status === 'accepted' && new Date(s.date) >= new Date()
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Encuentra tu tutor ideal</h1>
        <p className="text-muted-foreground">
          Explora entre {tutors.length} tutores verificados y comienza a aprender
        </p>
      </div>

      {/* Upcoming Sessions */}
      {upcomingSessions.length > 0 && (
        <Card className="shadow-card mb-8 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Tus próximas clases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingSessions.slice(0, 3).map((session) => {
                const tutor = tutors.find((t) => t.id === session.tutorId);
                return (
                  <div key={session.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <img
                        src={tutor?.photo}
                        alt={tutor?.fullName}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-semibold">{tutor?.fullName}</p>
                        <p className="text-sm text-muted-foreground">
                          {session.subject} • {session.date} a las {session.time}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">{session.modality}</Badge>
                  </div>
                );
              })}
            </div>
            <Button variant="outline" asChild className="w-full mt-4">
              <Link to="/student/sessions">Ver todas mis tutorías</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card className="shadow-card mb-8">
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar por nombre, materia o especialidad..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={modalityFilter} onValueChange={setModalityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Modalidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las modalidades</SelectItem>
                <SelectItem value="presencial">Presencial</SelectItem>
                <SelectItem value="online">En línea</SelectItem>
              </SelectContent>
            </Select>
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Materia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las materias</SelectItem>
                {allSubjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tutors Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTutors.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <UserIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              No se encontraron tutores con los filtros seleccionados
            </p>
          </div>
        ) : (
          filteredTutors.map((tutor) => (
            <Card key={tutor.id} className="shadow-card hover:shadow-elegant transition-all">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={tutor.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${tutor.email}`}
                    alt={tutor.fullName}
                    className="w-16 h-16 rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{tutor.fullName}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{tutor.specialty}</p>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-semibold text-foreground">
                        {tutor.rating.toFixed(1)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({tutor.reviewCount} reseñas)
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{tutor.bio}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {tutor.subjects.slice(0, 3).map((subject) => (
                    <Badge key={subject} variant="outline" className="text-xs">
                      {subject}
                    </Badge>
                  ))}
                  {tutor.subjects.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{tutor.subjects.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                  {tutor.modality === 'presencial' && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>Presencial</span>
                    </div>
                  )}
                  {tutor.modality === 'online' && (
                    <div className="flex items-center gap-1">
                      <Video className="w-4 h-4" />
                      <span>En línea</span>
                    </div>
                  )}
                  {tutor.modality === 'both' && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <Video className="w-4 h-4" />
                      <span>Ambas</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      ${tutor.hourlyRate.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">por hora</p>
                  </div>
                  <Button asChild>
                    <Link to={`/student/tutor/${tutor.id}`}>Ver perfil</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
