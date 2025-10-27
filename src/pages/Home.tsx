import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Users, Video, MapPin, Star, Clock } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero text-white py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <span className="text-4xl font-bold">mT</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Aprende desde donde quieras
            <br />
            con los mejores tutores
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
            Conecta con tutores expertos para clases presenciales o en línea. Tu educación, a tu manera.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" asChild className="text-lg px-8 py-6">
              <Link to="/register">Comenzar ahora</Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6 bg-white/10 border-white text-white hover:bg-white hover:text-primary backdrop-blur-sm">
              <Link to="/login">Iniciar sesión</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">¿Por qué elegir myTEACHER?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-card hover:shadow-elegant transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Tutores Verificados</h3>
                <p className="text-muted-foreground">
                  Todos nuestros tutores son verificados y aprobados para garantizar calidad educativa.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-elegant transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Video className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Clases Flexibles</h3>
                <p className="text-muted-foreground">
                  Elige entre clases presenciales u online según tu preferencia y disponibilidad.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-elegant transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-2">Ubicación Inteligente</h3>
                <p className="text-muted-foreground">
                  Encuentra tutores cerca de ti con nuestro sistema de mapas interactivo.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">¿Cómo funciona?</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full gradient-hero text-white flex items-center justify-center text-xl font-bold">
                1
              </div>
              <h3 className="font-bold mb-2">Regístrate</h3>
              <p className="text-sm text-muted-foreground">
                Crea tu cuenta como estudiante o tutor
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full gradient-hero text-white flex items-center justify-center text-xl font-bold">
                2
              </div>
              <h3 className="font-bold mb-2">Busca tutores</h3>
              <p className="text-sm text-muted-foreground">
                Explora perfiles y encuentra el tutor perfecto
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full gradient-hero text-white flex items-center justify-center text-xl font-bold">
                3
              </div>
              <h3 className="font-bold mb-2">Reserva tu clase</h3>
              <p className="text-sm text-muted-foreground">
                Elige horario y modalidad de tu preferencia
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full gradient-hero text-white flex items-center justify-center text-xl font-bold">
                4
              </div>
              <h3 className="font-bold mb-2">¡Aprende!</h3>
              <p className="text-sm text-muted-foreground">
                Disfruta de tu clase personalizada
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-primary mb-2">500+</div>
              <p className="text-muted-foreground">Tutores expertos</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-secondary mb-2">10k+</div>
              <p className="text-muted-foreground">Clases completadas</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-accent mb-2">4.9</div>
              <div className="flex items-center justify-center gap-1 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-muted-foreground mt-1">Calificación promedio</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-hero text-white py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">¿Listo para comenzar?</h2>
          <p className="text-xl mb-8 text-white/90">
            Únete a miles de estudiantes que ya están aprendiendo con myTEACHER
          </p>
          <Button variant="hero" size="lg" asChild className="text-lg px-8 py-6 bg-white text-primary hover:bg-white/90">
            <Link to="/register">Registrarse gratis</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
