import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { initializeMockData } from "@/data/mockData";
import Navbar from "@/components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/admin/Dashboard";
import StudentDashboard from "./pages/student/Dashboard";
import TutorProfile from "./pages/student/TutorProfile";
import BookSession from "./pages/student/BookSession";
import MySessions from "./pages/student/MySessions";
import TutorDashboard from "./pages/tutor/Dashboard";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";

// Initialize mock data
initializeMockData();

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : user.role === 'tutor' ? '/tutor' : '/student'} replace /> : <Home />} />
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        
        {/* Student Routes */}
        <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/tutor/:id" element={<ProtectedRoute allowedRoles={['student']}><TutorProfile /></ProtectedRoute>} />
        <Route path="/student/book/:id" element={<ProtectedRoute allowedRoles={['student']}><BookSession /></ProtectedRoute>} />
        <Route path="/student/sessions" element={<ProtectedRoute allowedRoles={['student']}><MySessions /></ProtectedRoute>} />
        
        {/* Tutor Routes */}
        <Route path="/tutor" element={<ProtectedRoute allowedRoles={['tutor']}><TutorDashboard /></ProtectedRoute>} />
        
        {/* Shared Routes */}
        <Route path="/chat" element={<ProtectedRoute allowedRoles={['student', 'tutor']}><Chat /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute allowedRoles={['admin', 'student', 'tutor']}><Profile /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute allowedRoles={['admin', 'student', 'tutor']}><Notifications /></ProtectedRoute>} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
