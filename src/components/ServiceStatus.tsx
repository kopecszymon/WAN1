
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Clock, Database, Smartphone } from 'lucide-react';

interface ServiceStatusProps {
  isRunning: boolean;
}

export const ServiceStatus = ({ isRunning }: ServiceStatusProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Service Status</p>
              <Badge variant={isRunning ? "default" : "destructive"} className="mt-1">
                {isRunning ? "Running" : "Stopped"}
              </Badge>
            </div>
            <Activity className={`w-8 h-8 ${isRunning ? 'text-green-400' : 'text-red-400'}`} />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Uptime</p>
              <p className="text-lg font-semibold text-white">2h 34m</p>
            </div>
            <Clock className="w-8 h-8 text-blue-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Messages Logged</p>
              <p className="text-lg font-semibold text-white">1,247</p>
            </div>
            <Database className="w-8 h-8 text-purple-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Device Status</p>
              <Badge variant="default" className="mt-1 bg-green-600">
                Online
              </Badge>
            </div>
            <Smartphone className="w-8 h-8 text-green-400" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
