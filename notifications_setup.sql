-- Bildirimler (Notifications) tablosu
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    icon VARCHAR(100) DEFAULT 'notifications',
    type VARCHAR(50) DEFAULT 'general', -- laundry, announcement, wallet vb.
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanıcılar kendi bildirimlerini görebilir" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar kendi bildirimlerini silebilir" ON notifications
    FOR DELETE USING (auth.uid() = user_id);
    
CREATE POLICY "Kullanıcılar kendi bildirimlerini güncelleyebilir (okundu vs)" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Yöneticiler veya sistem bildirim gönderebilir" ON notifications
    FOR INSERT WITH CHECK (true); -- Tüm kullanıcılar veya en azından auth.uid() için izin (Gerçekte admin kontrolü konulmalı)
