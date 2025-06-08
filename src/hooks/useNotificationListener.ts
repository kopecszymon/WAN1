
import { useState, useEffect } from 'react';
import NotificationListener, { WhatsAppMessage } from '@/plugins/NotificationListener';
import { toast } from 'sonner';

export const useNotificationListener = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [isCheckingPermission, setIsCheckingPermission] = useState(false);

  useEffect(() => {
    // Check initial permission status
    checkPermission();

    // Listen for new messages
    const messageListener = NotificationListener.addListener('messageReceived', ({ message }) => {
      console.log('New WhatsApp message received:', message);
      setMessages(prev => [message, ...prev]);
      toast.success(`New message from ${message.sender}`);
    });

    // Listen for permission changes (when app resumes from settings)
    const permissionListener = NotificationListener.addListener('permissionChanged', ({ granted }) => {
      console.log('Permission status changed:', granted);
      setHasPermission(granted);
      setIsCheckingPermission(false);
      
      if (granted) {
        toast.success('Notification access granted! Starting monitoring...');
        startListening();
      } else {
        toast.error('Notification access still not granted');
      }
    });

    return () => {
      messageListener.then(listener => listener.remove());
      permissionListener.then(listener => listener.remove());
    };
  }, []);

  const checkPermission = async () => {
    try {
      setIsCheckingPermission(true);
      const result = await NotificationListener.checkPermission();
      setHasPermission(result.granted);
      setIsCheckingPermission(false);
    } catch (error) {
      console.error('Error checking notification permission:', error);
      setIsCheckingPermission(false);
    }
  };

  const requestPermission = async () => {
    try {
      setIsCheckingPermission(true);
      toast.info('Opening notification settings...');
      
      const result = await NotificationListener.requestPermission();
      setHasPermission(result.granted);
      setIsCheckingPermission(false);
      
      if (result.granted) {
        toast.success('Notification access granted!');
        startListening();
      } else {
        toast.error('Notification access denied');
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
      setIsCheckingPermission(false);
      toast.error('Failed to request notification access');
    }
  };

  const startListening = async () => {
    try {
      await NotificationListener.startListening();
      setIsListening(true);
      toast.success('Started monitoring WhatsApp notifications');
    } catch (error) {
      console.error('Error starting listener:', error);
      toast.error('Failed to start notification monitoring');
    }
  };

  const stopListening = async () => {
    try {
      await NotificationListener.stopListening();
      setIsListening(false);
      toast.success('Stopped monitoring notifications');
    } catch (error) {
      console.error('Error stopping listener:', error);
    }
  };

  const loadMessages = async () => {
    try {
      const result = await NotificationListener.getMessages();
      setMessages(result.messages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  return {
    hasPermission,
    isListening,
    messages,
    isCheckingPermission,
    requestPermission,
    checkPermission,
    startListening,
    stopListening,
    loadMessages
  };
};
