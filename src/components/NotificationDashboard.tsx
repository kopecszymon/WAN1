
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, User, Clock } from 'lucide-react';

interface WhatsAppMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: number;
  isGroup: boolean;
}

export const NotificationDashboard = () => {
  const [recentMessages, setRecentMessages] = useState<WhatsAppMessage[]>([]);
  const [stats, setStats] = useState({
    totalToday: 45,
    uniqueSenders: 12,
    groupMessages: 23
  });

  useEffect(() => {
    // Simulate real-time message updates
    const interval = setInterval(() => {
      const newMessage: WhatsAppMessage = {
        id: Date.now().toString(),
        sender: ['John Doe', 'Sarah Smith', 'Work Group', 'Family Chat', 'Alice Johnson'][Math.floor(Math.random() * 5)],
        content: [
          'Hey, how are you?',
          'Meeting at 3 PM',
          'Can you check this?',
          'Thanks for the update',
          'See you tomorrow',
          'Great work on the project!'
        ][Math.floor(Math.random() * 6)],
        timestamp: Date.now(),
        isGroup: Math.random() > 0.6
      };

      setRecentMessages(prev => [newMessage, ...prev.slice(0, 9)]);
      setStats(prev => ({
        ...prev,
        totalToday: prev.totalToday + 1
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Today's Messages</p>
                <p className="text-2xl font-bold text-white">{stats.totalToday}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Unique Senders</p>
                <p className="text-2xl font-bold text-white">{stats.uniqueSenders}</p>
              </div>
              <User className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Group Messages</p>
                <p className="text-2xl font-bold text-white">{stats.groupMessages}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Real-time Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentMessages.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                Waiting for WhatsApp notifications...
              </p>
            ) : (
              recentMessages.map((message) => (
                <div
                  key={message.id}
                  className="flex items-start gap-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                    {message.sender.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-white truncate">
                        {message.sender}
                      </p>
                      {message.isGroup && (
                        <Badge variant="secondary" className="text-xs">
                          Group
                        </Badge>
                      )}
                      <span className="text-xs text-gray-400 ml-auto">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 truncate">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
