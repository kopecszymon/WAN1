
package app.lovable.abaa76f2df924c0fac903d22aa82157e;

import androidx.room.Database;
import androidx.room.Room;
import androidx.room.RoomDatabase;
import android.content.Context;

@Database(entities = {WhatsAppMessage.class}, version = 1, exportSchema = false)
public abstract class MessageDatabase extends RoomDatabase {
    private static MessageDatabase INSTANCE;

    public abstract MessageDao messageDao();

    public static MessageDatabase getInstance(Context context) {
        if (INSTANCE == null) {
            synchronized (MessageDatabase.class) {
                if (INSTANCE == null) {
                    INSTANCE = Room.databaseBuilder(
                        context.getApplicationContext(),
                        MessageDatabase.class,
                        "message_database"
                    ).allowMainThreadQueries().build();
                }
            }
        }
        return INSTANCE;
    }
}
