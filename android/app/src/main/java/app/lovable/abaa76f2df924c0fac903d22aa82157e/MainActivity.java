
package app.lovable.abaa76f2df924c0fac903d22aa82157e;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onStart() {
        super.onStart();
        
        // Register the NotificationListener plugin
        registerPlugin(NotificationListenerPlugin.class);
    }
}
