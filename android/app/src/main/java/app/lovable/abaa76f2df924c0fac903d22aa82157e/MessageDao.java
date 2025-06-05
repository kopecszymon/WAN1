
package app.lovable.abaa76f2df924c0fac903d22aa82157e;

import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;
import java.util.List;

@Dao
public interface MessageDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertMessage(WhatsAppMessage message);

    @Query("SELECT * FROM messages ORDER BY timestamp DESC")
    List<WhatsAppMessage> getAllMessages();

    @Query("SELECT * FROM messages WHERE timestamp >= :timestamp ORDER BY timestamp DESC")
    List<WhatsAppMessage> getMessagesSince(long timestamp);

    @Query("DELETE FROM messages")
    void deleteAllMessages();
}
