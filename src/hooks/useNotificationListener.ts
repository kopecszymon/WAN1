
import { useState, useEffect } from 'react';
import NotificationListener, { WhatsAppMessage } from '@/plugins/NotificationListener';
import { toast } from 'sonner';
import { Capacitor } from '@capacitor/core';

export const useNotificationListener = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [isCheckingPermission, setIsCheckingPermission] = useState(false);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);

  useEffect(() => {
    // Only run on native platforms
    if (!Capacitor.isNativePlatform()) {
      console.log('Running in web environment, notification listener not available');
      return;
    }

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
      setIsRequestingPermission(false);
      
      if (granted) {
        toast.success('Notification access granted! Starting monitoring...');
        startListening();
      } else {
        toast.info('Please enable notification access for this app in Android settings');
      }
    });

    return () => {
      messageListener.then(listener => listener.remove());
      permissionListener.then(listener => listener.remove());
    };
  }, []);

  const checkPermission = async () => {
    // Only run on native platforms
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    try {
      setIsCheckingPermission(true);
      const result = await NotificationListener.checkPermission();
      setHasPermission(result.granted);
    } catch (error) {
      console.error('Error checking notification permission:', error);
      // Don't show toast error for web platform
    } finally {
      setIsCheckingPermission(false);
    }
  };

  const requestPermission = async () => {
    // Only run on native platforms
    if (!Capacitor.isNativePlatform()) {
      toast.error('Notification listener is only available on mobile devices');
      return;
    }

    try {
      setIsRequestingPermission(true);
      
      const result = await NotificationListener.requestPermission();
      
      if (result.granted) {
        // Permission already granted
        setHasPermission(true);
        setIsRequestingPermission(false);
        toast.success('Notification access already granted!');
        startListening();
      } else if (result.settingsOpened) {
        // Settings opened successfully, now wait for user to return
        toast.info('Please enable notification access for this app and return here');
        // Don't set isRequestingPermission to false here, wait for the permission change event
      } else {
        // Failed to open settings
        toast.error(result.error || 'Failed to open notification settings');
        setIsRequestingPermission(false);
      }
      
    } catch (error) {
      console.error('Error requesting permission:', error);
      toast.error('Failed to request notification access');
      setIsRequestingPermission(false);
    }
  };

  const startListening = async () => {
    // Only run on native platforms
    if (!Capacitor.isNativePlatform()) {
      return;
    }

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
    // Only run on native platforms
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    try {
      await NotificationListener.stopListening();
      setIsListening(false);
      toast.success('Stopped monitoring notifications');
    } catch (error) {
      console.error('Error stopping listener:', error);
    }
  };

  const loadMessages = async () => {
    // Only run on native platforms
    if (!Capacitor.isNativePlatform()) {
      return;
    }

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
    isRequestingPermission,
    requestPermission,
    checkPermission,
    startListening,
    stopListening,
    loadMessages
  };
};
