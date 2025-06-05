
package app.lovable.abaa76f2df924c0fac903d22aa82157e;

import android.app.Notification;
import android.content.Intent;
import android.os.Bundle;
import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;
import android.util.Log;
import java.util.UUID;

public class NotificationListenerService extends NotificationListenerService {
    private static final String TAG = "WhatsAppListener";
    private static final String WHATSAPP_PACKAGE = "com.whatsapp";
    private static final String WHATSAPP_BUSINESS_PACKAGE = "com.whatsapp.w4b";

    @Override
    public void onNotificationPosted(StatusBarNotification sbn) {
        String packageName = sbn.getPackageName();
        
        // Only process WhatsApp notifications
        if (!WHATSAPP_PACKAGE.equals(packageName) && !WHATSAPP_BUSINESS_PACKAGE.equals(packageName)) {
            return;
        }

        Bundle extras = sbn.getNotification().extras;
        String title = extras.getString(Notification.EXTRA_TITLE);
        String text = extras.getString(Notification.EXTRA_TEXT);
        
        if (title != null && text != null) {
            // Check if it's a group message (contains group name pattern)
            boolean isGroup = title.contains("@") || title.contains(":") || 
                             extras.getString(Notification.EXTRA_SUB_TEXT) != null;
            
            String sender = title;
            String content = text;
            
            // For group messages, extract sender from content if possible
            if (isGroup && content.contains(": ")) {
                String[] parts = content.split(": ", 2);
                if (parts.length == 2) {
                    sender = parts[0];
                    content = parts[1];
                }
            }
            
            Log.d(TAG, "WhatsApp message - Sender: " + sender + ", Content: " + content + ", IsGroup: " + isGroup);
            
            // Start the message logger service
            Intent serviceIntent = new Intent(this, MessageLoggerService.class);
            serviceIntent.putExtra("id", UUID.randomUUID().toString());
            serviceIntent.putExtra("sender", sender);
            serviceIntent.putExtra("content", content);
            serviceIntent.putExtra("timestamp", System.currentTimeMillis());
            serviceIntent.putExtra("isGroup", isGroup);
            serviceIntent.putExtra("packageName", packageName);
            
            startForegroundService(serviceIntent);
        }
    }

    @Override
    public void onNotificationRemoved(StatusBarNotification sbn) {
        // We don't need to handle removed notifications
    }
}
