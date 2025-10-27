export type UserRole = 'admin' | 'tutor' | 'student';

export type Modality = 'presencial' | 'online' | 'both';

export type SessionStatus = 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';

export type TutorStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  fullName: string;
  phone: string;
  photo?: string;
  createdAt: string;
}

export interface Student extends User {
  role: 'student';
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Tutor extends User {
  role: 'tutor';
  specialty: string;
  experience: string;
  educationLevel: string;
  bio: string;
  modality: Modality;
  status: TutorStatus;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  subjects: string[];
  schedule: string[];
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Admin extends User {
  role: 'admin';
}

export interface Session {
  id: string;
  studentId: string;
  tutorId: string;
  subject: string;
  modality: Modality;
  date: string;
  time: string;
  duration: number;
  status: SessionStatus;
  cost: number;
  studentAddress?: string;
  studentCoordinates?: {
    lat: number;
    lng: number;
  };
  createdAt: string;
}

export interface Message {
  id: string;
  sessionId: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'session_request' | 'session_accepted' | 'session_rejected' | 'session_reminder' | 'message';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}
