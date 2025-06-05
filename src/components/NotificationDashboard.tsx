
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Users, Clock, TrendingUp } from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: number;
  isGroup: boolean;
}

interface NotificationDashboardProps {
  messages: Message[];
}

export const NotificationDashboard = ({ messages }: NotificationDashboardProps) => {
  const totalMessages = messages.length;
  const groupMessages = messages.filter(msg => msg.isGroup).length;
  const individualMessages = messages.filter(msg => !msg.isGroup).length;
  
  const recentMessages = messages.slice(0, 5);

  const stats = [
    {
      title: 'Total Messages',
      value: totalMessages,
      icon: MessageSquare,
      color: 'text-blue-500'
    },
    {
      title: 'Group Messages',
      value: groupMessages,
      icon: Users,
      color: 'text-green-500'
    },
    {
      title: 'Individual Messages',
      value: individualMessages,
      icon: MessageSquare,
      color: 'text-purple-500'
    },
    {
      title: 'Today',
      value: messages.filter(msg => {
        const today = new Date().toDateString();
        return new Date(msg.timestamp).toDateString() === today;
      }).length,
      icon: Clock,
      color: 'text-orange-500'
    }
  ];

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentMessages.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                No messages received yet. Make sure the service is running and permissions are granted.
              </p>
            ) : (
              recentMessages.map((message) => (
                <div
                  key={message.id}
                  className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg"
                >
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                    {message.sender.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-white text-sm">
                        {message.sender}
                      </p>
                      {message.isGroup && (
                        <Badge variant="secondary" className="text-xs">
                          Group
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 truncate">
                      {message.content}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
