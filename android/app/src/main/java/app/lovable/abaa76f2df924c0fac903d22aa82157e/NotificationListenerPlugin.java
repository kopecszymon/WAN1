
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
import android.app.Activity;
import android.os.Handler;
import android.os.Looper;
import java.util.List;

@CapacitorPlugin(name = "NotificationListener")
public class NotificationListenerPlugin extends Plugin {
    private static NotificationListenerPlugin instance;
    private MessageDatabase database;
    private Handler mainHandler;
    private PluginCall pendingPermissionCall;

    @Override
    public void load() {
        instance = this;
        database = MessageDatabase.getInstance(getContext());
        mainHandler = new Handler(Looper.getMainLooper());
        
        // Listen for app resume events
        getActivity().getApplication().registerActivityLifecycleCallbacks(new ActivityLifecycleCallbacks());
    }

    @PluginMethod
    public void requestPermission(PluginCall call) {
        boolean hasPermission = isNotificationListenerEnabled();
        
        if (hasPermission) {
            JSObject result = new JSObject();
            result.put("granted", true);
            call.resolve(result);
            return;
        }
        
        // Store the call to resolve it later when we check permission again
        pendingPermissionCall = call;
        
        // Open notification listener settings
        Intent intent = new Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        getContext().startActivity(intent);
        
        // Don't resolve immediately - wait for app resume
    }

    @PluginMethod
    public void checkPermission(PluginCall call) {
        boolean hasPermission = isNotificationListenerEnabled();
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

    public void onAppResumed() {
        // Check if we have a pending permission request
        if (pendingPermissionCall != null) {
            boolean hasPermission = isNotificationListenerEnabled();
            JSObject result = new JSObject();
            result.put("granted", hasPermission);
            pendingPermissionCall.resolve(result);
            pendingPermissionCall = null;
            
            // Notify the frontend about permission status change
            JSObject data = new JSObject();
            data.put("granted", hasPermission);
            notifyListeners("permissionChanged", data);
        }
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

    private class ActivityLifecycleCallbacks implements android.app.Application.ActivityLifecycleCallbacks {
        @Override
        public void onActivityResumed(Activity activity) {
            if (activity == getActivity()) {
                // Delay slightly to ensure settings activity has fully closed
                mainHandler.postDelayed(() -> onAppResumed(), 500);
            }
        }

        @Override public void onActivityCreated(Activity activity, android.os.Bundle savedInstanceState) {}
        @Override public void onActivityStarted(Activity activity) {}
        @Override public void onActivityPaused(Activity activity) {}
        @Override public void onActivityStopped(Activity activity) {}
        @Override public void onActivitySaveInstanceState(Activity activity, android.os.Bundle outState) {}
        @Override public void onActivityDestroyed(Activity activity) {}
    }
}
