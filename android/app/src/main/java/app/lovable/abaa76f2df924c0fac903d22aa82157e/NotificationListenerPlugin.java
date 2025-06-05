
package app.lovable.abaa76f2df924c0fac903d22aa82157e;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import android.content.ComponentName;
import android.content.Intent;
import android.provider.Settings;
import android.text.TextUtils;
import java.util.List;

@CapacitorPlugin(name = "NotificationListener")
public class NotificationListenerPlugin extends Plugin {
    private static NotificationListenerPlugin instance;
    private MessageDatabase database;

    @Override
    public void load() {
        instance = this;
        database = MessageDatabase.getInstance(getContext());
    }

    @PluginMethod
    public void requestPermission(PluginCall call) {
        boolean hasPermission = isNotificationListenerEnabled();
        
        if (!hasPermission) {
            // Open notification listener settings
            Intent intent = new Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(intent);
        }
        
        JSObject result = new JSObject();
        result.put("granted", hasPermission);
        call.resolve(result);
    }

    @PluginMethod
    public void startListening(PluginCall call) {
        // Start the message logger service
        Intent serviceIntent = new Intent(getContext(), MessageLoggerService.class);
        getContext().startForegroundService(serviceIntent);
        call.resolve();
    }

    @PluginMethod
    public void stopListening(PluginCall call) {
        // Stop the message logger service
        Intent serviceIntent = new Intent(getContext(), MessageLoggerService.class);
        getContext().stopService(serviceIntent);
        call.resolve();
    }

    @PluginMethod
    public void getMessages(PluginCall call) {
        List<WhatsAppMessage> messages = database.messageDao().getAllMessages();
        JSArray messagesArray = new JSArray();
        
        for (WhatsAppMessage message : messages) {
            JSObject messageObj = new JSObject();
            messageObj.put("id", message.getId());
            messageObj.put("sender", message.getSender());
            messageObj.put("content", message.getContent());
            messageObj.put("timestamp", message.getTimestamp());
            messageObj.put("isGroup", message.isGroup());
            messageObj.put("packageName", message.getPackageName());
            messagesArray.put(messageObj);
        }
        
        JSObject result = new JSObject();
        result.put("messages", messagesArray);
        call.resolve(result);
    }

    private boolean isNotificationListenerEnabled() {
        String packageName = getContext().getPackageName();
        String flat = Settings.Secure.getString(getContext().getContentResolver(), "enabled_notification_listeners");
        
        if (!TextUtils.isEmpty(flat)) {
            String[] names = flat.split(":");
            for (String name : names) {
                ComponentName componentName = ComponentName.unflattenFromString(name);
                if (componentName != null && packageName.equals(componentName.getPackageName())) {
                    return true;
                }
            }
        }
        return false;
    }

    public static void notifyMessageReceived(WhatsAppMessage message) {
        if (instance != null) {
            JSObject messageObj = new JSObject();
            messageObj.put("id", message.getId());
            messageObj.put("sender", message.getSender());
            messageObj.put("content", message.getContent());
            messageObj.put("timestamp", message.getTimestamp());
            messageObj.put("isGroup", message.isGroup());
            messageObj.put("packageName", message.getPackageName());
            
            JSObject data = new JSObject();
            data.put("message", messageObj);
            
            instance.notifyListeners("messageReceived", data);
        }
    }
}
