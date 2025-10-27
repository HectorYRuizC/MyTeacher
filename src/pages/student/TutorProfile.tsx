import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Star, MapPin, Video, Clock, Award, ArrowLeft } from 'lucide-react';
import { Tutor } from '@/types';
import MapView from '@/components/MapView';

const TutorProfile = () => {
  const { id } = useParams();
  const [tutor, setTutor] = useState<Tutor | null>(null);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundTutor = users.find((u: any) => u.id === id && u.role === 'tutor');
    setTutor(foundTutor || null);
  }, [id]);

  if (!tutor) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Tutor no encontrado</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/student">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a la búsqueda
        </Link>
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-elegant">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <img
                  src={tutor.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${tutor.email}`}
                  alt={tutor.fullName}
                  className="w-32 h-32 rounded-full mx-auto md:mx-0"
                />
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{tutor.fullName}</h1>
                  <p className="text-xl text-primary font-semibold mb-3">{tutor.specialty}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1 text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(tutor.rating) ? 'fill-current' : ''
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold">{tutor.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground">
                      ({tutor.reviewCount} reseñas)
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    {tutor.modality === 'presencial' && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>Clases presenciales</span>
                      </div>
                    )}
                    {tutor.modality === 'online' && (
                      <div className="flex items-center gap-1">
                        <Video className="w-4 h-4" />
                        <span>Clases en línea</span>
                      </div>
                    )}
                    {tutor.modality === 'both' && (
                      <>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>Presencial</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Video className="w-4 h-4" />
                          <span>En línea</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    Sobre mí
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">{tutor.bio}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Experiencia</h3>
                  <p className="text-muted-foreground">{tutor.experience}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Nivel Educativo</h3>
                  <p className="text-muted-foreground">{tutor.educationLevel}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Materias que enseño</h3>
                  <div className="flex flex-wrap gap-2">
                    {tutor.subjects.map((subject) => (
                      <Badge key={subject} variant="secondary" className="text-sm px-3 py-1">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Horario disponible
                  </h3>
                  <div className="space-y-2">
                    {tutor.schedule.map((slot, index) => (
                      <div key={index} className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-2 h-2 rounded-full bg-secondary" />
                        <span>{slot}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Map for presencial tutors */}
          {tutor.coordinates && tutor.modality !== 'online' && (
            <Card className="shadow-card">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Ubicación del tutor
                </h3>
                <MapView
                  startPoint={{
                    lat: tutor.coordinates.lat,
                    lng: tutor.coordinates.lng,
                    label: tutor.fullName,
                  }}
                  height="300px"
                />
                {tutor.address && (
                  <p className="text-sm text-muted-foreground mt-3">{tutor.address}</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="shadow-card sticky top-24">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <p className="text-4xl font-bold text-primary mb-1">
                  ${tutor.hourlyRate.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">por hora</p>
              </div>

              <Button asChild className="w-full mb-3" size="lg">
                <Link to={`/student/book/${tutor.id}`}>Reservar sesión</Link>
              </Button>

              <Button asChild variant="outline" className="w-full">
                <Link to="/chat">Enviar mensaje</Link>
              </Button>

              <Separator className="my-6" />

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tiempo de respuesta</span>
                  <span className="font-semibold">~1 hora</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tasa de aceptación</span>
                  <span className="font-semibold">95%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TutorProfile;
