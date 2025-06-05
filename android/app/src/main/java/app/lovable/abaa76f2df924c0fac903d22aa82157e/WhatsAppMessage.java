
package app.lovable.abaa76f2df924c0fac903d22aa82157e;

import androidx.room.Entity;
import androidx.room.PrimaryKey;
import androidx.annotation.NonNull;

@Entity(tableName = "messages")
public class WhatsAppMessage {
    @PrimaryKey
    @NonNull
    public String id;
    
    public String sender;
    public String content;
    public long timestamp;
    public boolean isGroup;
    public String packageName;

    public WhatsAppMessage(String id, String sender, String content, long timestamp, boolean isGroup, String packageName) {
        this.id = id;
        this.sender = sender;
        this.content = content;
        this.timestamp = timestamp;
        this.isGroup = isGroup;
        this.packageName = packageName;
    }

    // Getters
    public String getId() { return id; }
    public String getSender() { return sender; }
    public String getContent() { return content; }
    public long getTimestamp() { return timestamp; }
    public boolean isGroup() { return isGroup; }
    public String getPackageName() { return packageName; }
}
