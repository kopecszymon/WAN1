
package app.lovable.abaa76f2df924c0fac903d22aa82157e;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;
import android.util.Log;
import androidx.core.app.NotificationCompat;

public class MessageLoggerService extends Service {
    private static final String TAG = "MessageLogger";
    private static final String CHANNEL_ID = "WhatsAppReaderChannel";
    private static final int NOTIFICATION_ID = 1;
    
    private MessageDatabase database;

    @Override
    public void onCreate() {
        super.onCreate();
        createNotificationChannel();
        database = MessageDatabase.getInstance(this);
        Log.d(TAG, "MessageLoggerService created");
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null) {
            String id = intent.getStringExtra("id");
            String sender = intent.getStringExtra("sender");
            String content = intent.getStringExtra("content");
            long timestamp = intent.getLongExtra("timestamp", System.currentTimeMillis());
            boolean isGroup = intent.getBooleanExtra("isGroup", false);
            String packageName = intent.getStringExtra("packageName");

            // Create foreground notification
            Notification notification = createNotification();
            startForeground(NOTIFICATION_ID, notification);

            // Store message in database
            if (sender != null && content != null) {
                WhatsAppMessage message = new WhatsAppMessage(id, sender, content, timestamp, isGroup, packageName);
                database.messageDao().insertMessage(message);
                
                // Notify the web app through the plugin bridge
                NotificationListenerPlugin.notifyMessageReceived(message);
                
                Log.d(TAG, "Message stored: " + sender + " - " + content);
            }
        }

        return START_STICKY; // Restart if killed by system
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID,
                "WhatsApp Message Reader",
                NotificationManager.IMPORTANCE_LOW
            );
            channel.setDescription("Background service for reading WhatsApp messages");
            
            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }

    private Notification createNotification() {
        return new NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("WhatsApp Reader Active")
            .setContentText("Monitoring WhatsApp notifications")
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .setOngoing(true)
            .build();
    }
}
