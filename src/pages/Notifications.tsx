import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Notification } from '@/types';
import { Bell, CheckCircle, Calendar, MessageCircle, XCircle } from 'lucide-react';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    const allNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const userNotifications = allNotifications
      .filter((n: Notification) => n.userId === user?.id)
      .sort((a: Notification, b: Notification) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    setNotifications(userNotifications);
  };

  const markAsRead = (notificationId: string) => {
    const allNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const updatedNotifications = allNotifications.map((n: Notification) =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    loadNotifications();
  };

  const markAllAsRead = () => {
    const allNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const updatedNotifications = allNotifications.map((n: Notification) =>
      n.userId === user?.id ? { ...n, read: true } : n
    );
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    loadNotifications();
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'session_request':
        return <Calendar className="w-5 h-5 text-primary" />;
      case 'session_accepted':
        return <CheckCircle className="w-5 h-5 text-secondary" />;
      case 'session_rejected':
        return <XCircle className="w-5 h-5 text-destructive" />;
      case 'message':
        return <MessageCircle className="w-5 h-5 text-accent" />;
      default:
        return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Notificaciones</h1>
          {unreadCount > 0 && (
            <p className="text-muted-foreground">
              Tienes {unreadCount} notificación{unreadCount !== 1 ? 'es' : ''} sin leer
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            Marcar todas como leídas
          </Button>
        )}
      </div>

      <Card className="shadow-card">
        <CardContent className="p-0">
          {notifications.length === 0 ? (
            <div className="py-16 text-center">
              <Bell className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No tienes notificaciones</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 transition-colors ${
                    !notification.read ? 'bg-primary/5' : 'hover:bg-muted/50'
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="shrink-0 mt-1">{getIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{notification.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                        </div>
                        {!notification.read && (
                          <Badge variant="secondary" className="shrink-0">
                            Nueva
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(notification.timestamp)}
                        </span>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="h-auto p-0 text-xs"
                          >
                            Marcar como leída
                          </Button>
                        )}
                        {notification.link && (
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="h-auto p-0 text-xs"
                          >
                            <Link to={notification.link}>Ver detalles →</Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;
