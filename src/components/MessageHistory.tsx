
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Download } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: number;
  isGroup: boolean;
}

interface MessageHistoryProps {
  messages: Message[];
}

export const MessageHistory = ({ messages }: MessageHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredMessages = useMemo(() => {
    return messages.filter(message => {
      const matchesSearch = 
        message.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.content.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = 
        filterType === 'all' ||
        (filterType === 'groups' && message.isGroup) ||
        (filterType === 'individual' && !message.isGroup);
      
      return matchesSearch && matchesFilter;
    });
  }, [messages, searchTerm, filterType]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportToCsv = () => {
    const csvContent = [
      ['Sender', 'Content', 'Timestamp', 'Type'],
      ...filteredMessages.map(msg => [
        msg.sender,
        msg.content,
        new Date(msg.timestamp).toISOString(),
        msg.isGroup ? 'Group' : 'Individual'
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `whatsapp-messages-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Message History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search messages or senders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48 bg-gray-700 border-gray-600 text-white">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="all">All Messages</SelectItem>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="groups">Groups</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              onClick={exportToCsv}
              variant="outline" 
              className="border-gray-600 text-white hover:bg-gray-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>

          <div className="space-y-3">
            {filteredMessages.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                No messages found matching your criteria
              </p>
            ) : (
              filteredMessages.map((message) => (
                <div
                  key={message.id}
                  className="flex items-start gap-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-medium">
                    {message.sender.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-medium text-white">
                        {message.sender}
                      </p>
                      {message.isGroup && (
                        <Badge variant="secondary" className="text-xs">
                          Group
                        </Badge>
                      )}
                      <span className="text-xs text-gray-400 ml-auto">
                        {formatDate(message.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">
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
