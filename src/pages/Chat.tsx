import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Send, Paperclip, Image as ImageIcon } from 'lucide-react';
import { Message, User } from '@/types';

const Chat = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<User[]>([]);
  const [selectedContact, setSelectedContact] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    if (selectedContact) {
      loadMessages();
    }
  }, [selectedContact]);

  const loadContacts = () => {
    const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Get contacts from sessions
    const contactIds = new Set<string>();
    sessions.forEach((s: any) => {
      if (user?.role === 'student' && s.studentId === user.id) {
        contactIds.add(s.tutorId);
      } else if (user?.role === 'tutor' && s.tutorId === user.id) {
        contactIds.add(s.studentId);
      }
    });

    const contactList = users.filter((u: User) => contactIds.has(u.id));
    setContacts(contactList);
    if (contactList.length > 0 && !selectedContact) {
      setSelectedContact(contactList[0]);
    }
  };

  const loadMessages = () => {
    const allMessages = JSON.parse(localStorage.getItem('messages') || '[]');
    const chatMessages = allMessages.filter(
      (m: Message) =>
        (m.senderId === user?.id && m.receiverId === selectedContact?.id) ||
        (m.senderId === selectedContact?.id && m.receiverId === user?.id)
    );
    setMessages(chatMessages);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedContact || !user) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      sessionId: '', // In real app, link to session
      senderId: user.id,
      receiverId: selectedContact.id,
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false,
    };

    const allMessages = JSON.parse(localStorage.getItem('messages') || '[]');
    allMessages.push(message);
    localStorage.setItem('messages', JSON.stringify(allMessages));

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Mensajes</h1>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Contacts List */}
        <Card className="shadow-card lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Conversaciones</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              {contacts.length === 0 ? (
                <p className="text-center text-muted-foreground p-6 text-sm">
                  No hay conversaciones aún
                </p>
              ) : (
                contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`p-4 border-b cursor-pointer transition-colors ${
                      selectedContact?.id === contact.id
                        ? 'bg-primary/10'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedContact(contact)}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={contact.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${contact.email}`}
                        alt={contact.fullName}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{contact.fullName}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {contact.role === 'tutor' ? 'Tutor' : 'Estudiante'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="shadow-card lg:col-span-3">
          {selectedContact ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedContact.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedContact.email}`}
                    alt={selectedContact.fullName}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <CardTitle className="text-lg">{selectedContact.fullName}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {selectedContact.role === 'tutor' ? 'Tutor' : 'Estudiante'}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[450px] p-6">
                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <p className="text-center text-muted-foreground py-12">
                        No hay mensajes. ¡Inicia la conversación!
                      </p>
                    ) : (
                      messages.map((message) => {
                        const isMe = message.senderId === user?.id;
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                                isMe
                                  ? 'bg-primary text-primary-foreground rounded-br-sm'
                                  : 'bg-muted rounded-bl-sm'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'
                                }`}
                              >
                                {formatTime(message.timestamp)}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </ScrollArea>

                <div className="border-t p-4">
                  <div className="flex gap-3">
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <Paperclip className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <ImageIcon className="w-5 h-5" />
                    </Button>
                    <Input
                      placeholder="Escribe un mensaje..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button onClick={handleSendMessage} className="shrink-0 gap-2">
                      <Send className="w-4 h-4" />
                      Enviar
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Simulación de chat - En la versión real, los mensajes se enviarían en tiempo real
                  </p>
                </div>
              </CardContent>
            </>
          ) : (
            <div className="h-[600px] flex items-center justify-center text-muted-foreground">
              Selecciona una conversación para comenzar
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Chat;
