
import { registerPlugin } from '@capacitor/core';

export interface NotificationListenerPlugin {
  requestPermission(): Promise<{ granted: boolean }>;
  checkPermission(): Promise<{ granted: boolean }>;
  startListening(): Promise<void>;
  stopListening(): Promise<void>;
  getMessages(): Promise<{ messages: WhatsAppMessage[] }>;
  addListener(eventName: 'messageReceived', listenerFunc: (data: { message: WhatsAppMessage }) => void): Promise<any>;
  addListener(eventName: 'permissionChanged', listenerFunc: (data: { granted: boolean }) => void): Promise<any>;
}

export interface WhatsAppMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: number;
  isGroup: boolean;
  packageName: string;
}

const NotificationListener = registerPlugin<NotificationListenerPlugin>('NotificationListener');

export default NotificationListener;
