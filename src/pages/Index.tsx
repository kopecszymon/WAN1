
import { useNotificationListener } from '@/hooks/useNotificationListener';
import { useState, useEffect } from 'react';
import { NotificationDashboard } from '@/components/NotificationDashboard';
import { MessageHistory } from '@/components/MessageHistory';
import { PermissionGate } from '@/components/PermissionGate';
import { ServiceStatus } from '@/components/ServiceStatus';
import { ExportPanel } from '@/components/ExportPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Activity, Database, Download } from 'lucide-react';

const Index = () => {
  const { 
    hasPermission, 
    isListening, 
    messages, 
    isCheckingPermission,
    requestPermission, 
    checkPermission,
    startListening 
  } = useNotificationListener();

  if (!hasPermission) {
    return (
      <PermissionGate 
        onRequestPermission={requestPermission} 
        onCheckPermission={checkPermission}
        isCheckingPermission={isCheckingPermission}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            WhatsApp Notification Reader
          </h1>
          <p className="text-gray-400">Monitor and log WhatsApp notifications in real-time</p>
        </div>

        <ServiceStatus isRunning={isListening} />

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800 border-gray-700">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <NotificationDashboard messages={messages} />
          </TabsContent>

          <TabsContent value="history">
            <MessageHistory messages={messages} />
          </TabsContent>

          <TabsContent value="export">
            <ExportPanel />
          </TabsContent>

          <TabsContent value="settings">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">Service Configuration</h3>
              <div className="space-y-4 text-gray-300">
                <div>
                  <h4 className="font-medium text-white">Notification Listener Status</h4>
                  <p className="text-sm text-gray-400">Service is actively monitoring WhatsApp notifications</p>
                </div>
                <div>
                  <h4 className="font-medium text-white">Background Processing</h4>
                  <p className="text-sm text-gray-400">Foreground service running with persistent notification</p>
                </div>
                <div>
                  <h4 className="font-medium text-white">Data Storage</h4>
                  <p className="text-sm text-gray-400">Room Database storing messages locally</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
