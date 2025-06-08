
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle, Settings, Check, RefreshCw } from 'lucide-react';

interface PermissionGateProps {
  onRequestPermission: () => Promise<void>;
  onCheckPermission: () => Promise<void>;
  isCheckingPermission: boolean;
}

export const PermissionGate = ({ onRequestPermission, onCheckPermission, isCheckingPermission }: PermissionGateProps) => {
  const [isGranting, setIsGranting] = useState(false);

  const handleRequestPermission = async () => {
    setIsGranting(true);
    try {
      await onRequestPermission();
    } finally {
      setIsGranting(false);
    }
  };

  const handleCheckPermission = async () => {
    try {
      await onCheckPermission();
    } catch (error) {
      console.error('Error checking permission:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-white">Notification Access Required</CardTitle>
          <CardDescription className="text-gray-400">
            This app needs permission to read notifications to monitor WhatsApp messages
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-gray-700 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-white text-sm">Privacy Notice</h4>
                <p className="text-xs text-gray-400">
                  Only WhatsApp notifications will be monitored. Data stays on your device.
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-white text-sm">Steps to enable:</h4>
              <ol className="space-y-1 text-xs text-gray-400 list-decimal list-inside">
                <li>Tap "Grant Notification Access" below</li>
                <li>Find "WhatsApp Message Reader" in the list</li>
                <li>Toggle the switch to enable it</li>
                <li>Return to this app</li>
              </ol>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-white text-sm">Required Permissions:</h4>
              <ul className="space-y-1 text-xs text-gray-400">
                <li className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-green-400" />
                  Notification Listener Service
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-green-400" />
                  Background Processing
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-green-400" />
                  Boot Receiver
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleRequestPermission}
              disabled={isGranting || isCheckingPermission}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <Settings className="w-4 h-4 mr-2" />
              {isGranting ? 'Opening Settings...' : 'Grant Notification Access'}
            </Button>

            <Button 
              onClick={handleCheckPermission}
              disabled={isCheckingPermission}
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isCheckingPermission ? 'animate-spin' : ''}`} />
              {isCheckingPermission ? 'Checking...' : 'Check Permission Again'}
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            After enabling permission in Android settings, return here and tap "Check Permission Again"
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
