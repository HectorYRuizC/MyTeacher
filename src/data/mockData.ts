import { Tutor, Session, Notification } from '@/types';

// Coordenadas de ciudades colombianas para simulación
const colombianCities = [
  { name: 'Bogotá', lat: 4.7110, lng: -74.0721 },
  { name: 'Medellín', lat: 6.2476, lng: -75.5658 },
  { name: 'Cali', lat: 3.4516, lng: -76.5320 },
  { name: 'Barranquilla', lat: 10.9685, lng: -74.7813 },
  { name: 'Cartagena', lat: 10.3910, lng: -75.4794 },
];

export const mockTutors: Tutor[] = [
  {
    id: 'tutor-1',
    email: 'maria.garcia@email.com',
    password: 'password123',
    role: 'tutor',
    fullName: 'María García',
    phone: '+57 300 123 4567',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',
    specialty: 'Matemáticas',
    experience: '5 años',
    educationLevel: 'Licenciatura en Matemáticas',
    bio: 'Profesora apasionada por las matemáticas con experiencia en preparación para exámenes universitarios.',
    modality: 'both',
    status: 'approved',
    rating: 4.8,
    reviewCount: 45,
    hourlyRate: 25000,
    subjects: ['Álgebra', 'Cálculo', 'Geometría', 'Estadística'],
    schedule: ['Lunes 9:00-17:00', 'Miércoles 9:00-17:00', 'Viernes 14:00-18:00'],
    address: 'Calle 72 #10-34, Bogotá',
    coordinates: colombianCities[0],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tutor-2',
    email: 'carlos.lopez@email.com',
    password: 'password123',
    role: 'tutor',
    fullName: 'Carlos López',
    phone: '+57 310 234 5678',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos',
    specialty: 'Programación',
    experience: '8 años',
    educationLevel: 'Ingeniería de Sistemas',
    bio: 'Desarrollador senior con experiencia enseñando Python, JavaScript y desarrollo web.',
    modality: 'online',
    status: 'approved',
    rating: 4.9,
    reviewCount: 67,
    hourlyRate: 35000,
    subjects: ['Python', 'JavaScript', 'React', 'Node.js', 'SQL'],
    schedule: ['Martes 15:00-20:00', 'Jueves 15:00-20:00', 'Sábado 10:00-14:00'],
    coordinates: colombianCities[1],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tutor-3',
    email: 'ana.martinez@email.com',
    password: 'password123',
    role: 'tutor',
    fullName: 'Ana Martínez',
    phone: '+57 320 345 6789',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ana',
    specialty: 'Inglés',
    experience: '10 años',
    educationLevel: 'Filología Inglesa',
    bio: 'Profesora certificada TESOL con experiencia preparando estudiantes para TOEFL y Cambridge.',
    modality: 'both',
    status: 'approved',
    rating: 5.0,
    reviewCount: 89,
    hourlyRate: 30000,
    subjects: ['Inglés conversacional', 'Gramática', 'TOEFL', 'Cambridge'],
    schedule: ['Lunes 8:00-12:00', 'Miércoles 8:00-12:00', 'Viernes 8:00-12:00'],
    address: 'Carrera 15 #85-24, Bogotá',
    coordinates: { lat: 4.6700, lng: -74.0500 },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tutor-4',
    email: 'david.rodriguez@email.com',
    password: 'password123',
    role: 'tutor',
    fullName: 'David Rodríguez',
    phone: '+57 315 456 7890',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
    specialty: 'Física',
    experience: '6 años',
    educationLevel: 'Física Aplicada',
    bio: 'Físico especializado en mecánica clásica y cuántica, con enfoque en resolución práctica de problemas.',
    modality: 'presencial',
    status: 'approved',
    rating: 4.7,
    reviewCount: 34,
    hourlyRate: 28000,
    subjects: ['Física I', 'Física II', 'Mecánica', 'Termodinámica'],
    schedule: ['Martes 10:00-16:00', 'Jueves 10:00-16:00'],
    address: 'Avenida Poblado #45-23, Medellín',
    coordinates: colombianCities[1],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tutor-5',
    email: 'sofia.hernandez@email.com',
    password: 'password123',
    role: 'tutor',
    fullName: 'Sofía Hernández',
    phone: '+57 305 567 8901',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sofia',
    specialty: 'Química',
    experience: '4 años',
    educationLevel: 'Química Farmacéutica',
    bio: 'Química con pasión por la enseñanza, especializada en química orgánica y analítica.',
    modality: 'both',
    status: 'approved',
    rating: 4.6,
    reviewCount: 28,
    hourlyRate: 26000,
    subjects: ['Química General', 'Química Orgánica', 'Bioquímica'],
    schedule: ['Lunes 14:00-19:00', 'Viernes 14:00-19:00'],
    address: 'Calle 5 #36-08, Cali',
    coordinates: colombianCities[2],
    createdAt: new Date().toISOString(),
  },
];

// Initialize localStorage with mock data if empty
export const initializeMockData = () => {
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(mockTutors));
  }
  if (!localStorage.getItem('sessions')) {
    localStorage.setItem('sessions', JSON.stringify([]));
  }
  if (!localStorage.getItem('notifications')) {
    localStorage.setItem('notifications', JSON.stringify([]));
  }
  if (!localStorage.getItem('messages')) {
    localStorage.setItem('messages', JSON.stringify([]));
  }
};
