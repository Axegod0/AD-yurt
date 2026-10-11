-- ==============================================================================
-- AD YURDU - TAM VERİTABANI ŞEMASI VE GÜVENLİK POLİTİKALARI (Supabase PostgreSQL)
-- ==============================================================================

-- 1. GEREKLİ EKLENTİLER
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ==============================================================================
-- 2. TABLOLAR (TABLES)
-- ==============================================================================

-- A) Kullanıcılar Tablosu (Users)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    room_number VARCHAR(50),
    role VARCHAR(50) DEFAULT 'student', -- 'student', 'admin'
    balance NUMERIC DEFAULT 0,
    free_wash_count INTEGER DEFAULT 0,
    badge VARCHAR(50), -- 'developer', 'admin', vb.
    must_change_password BOOLEAN DEFAULT false,
    phone_number VARCHAR(50),
    block_name VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- B) Bakiye & İşlem Geçmişi (Transactions)
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
    amount NUMERIC NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'wash_payment', 'topup_cash', 'topup_online', 'refund'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- C) Duyurular Tablosu (Announcements)
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100) DEFAULT 'campaign',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- D) Çamaşırhane Siparişleri (Laundry Orders)
CREATE TABLE IF NOT EXISTS laundry_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'active', 'completed', 'canceled'
    station VARCHAR(50), -- İstasyon numarası (örn: İstasyon #04)
    mode VARCHAR(100), -- Yıkama modu (örn: Günlük Pamuklu)
    temperature VARCHAR(50), -- Sıcaklık ve devir
    softener VARCHAR(100), -- Yumuşatıcı
    cost NUMERIC DEFAULT 0, -- Harcanan AD Coin
    machine_id VARCHAR(50), -- Atanan makine numarası
    progress_percentage INTEGER DEFAULT 0, -- İlerleme yüzdesi
    progress_label VARCHAR(100), -- İlerleme açıklaması (örn: Durulama)
    time_left VARCHAR(50), -- Kalan süre metni
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- E) Bildirimler (Notifications)
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    icon VARCHAR(100) DEFAULT 'notifications',
    type VARCHAR(50) DEFAULT 'general', -- 'laundry', 'announcement', 'wallet', vb.
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- F) Destek Talepleri (Support Tickets)
CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_number SERIAL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'ariza', 'sepet', 'oneri', 'bakiye'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    machine_id VARCHAR(50),
    image_url TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in_progress', 'resolved'
    resolution_note TEXT,
    resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 3. ROW LEVEL SECURITY (RLS) POLİTİKALARI
-- ==============================================================================

-- Users RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Kullanıcılar profillerini görebilir" ON users;
CREATE POLICY "Kullanıcılar profillerini görebilir" ON users
    FOR SELECT USING (auth.uid() = id OR EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'));

DROP POLICY IF EXISTS "Kullanıcılar profillerini güncelleyebilir" ON users;
CREATE POLICY "Kullanıcılar profillerini güncelleyebilir" ON users
    FOR UPDATE USING (auth.uid() = id OR EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'));

-- Transactions RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Kullanıcılar kendi işlemlerini görebilir" ON transactions;
CREATE POLICY "Kullanıcılar kendi işlemlerini görebilir" ON transactions
    FOR SELECT USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "İşlem ekleme izni" ON transactions;
CREATE POLICY "İşlem ekleme izni" ON transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Announcements RLS
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Duyuruları herkes görebilir" ON announcements;
CREATE POLICY "Duyuruları herkes görebilir" ON announcements
    FOR SELECT USING (true);

-- Laundry Orders RLS
ALTER TABLE laundry_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Kullanıcılar kendi siparişlerini görebilir" ON laundry_orders;
CREATE POLICY "Kullanıcılar kendi siparişlerini görebilir" ON laundry_orders
    FOR SELECT USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Kullanıcılar kendi siparişlerini oluşturabilir" ON laundry_orders;
CREATE POLICY "Kullanıcılar kendi siparişlerini oluşturabilir" ON laundry_orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Yöneticiler siparişleri güncelleyebilir" ON laundry_orders;
CREATE POLICY "Yöneticiler siparişleri güncelleyebilir" ON laundry_orders
    FOR UPDATE USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Yöneticiler siparişleri silebilir" ON laundry_orders;
CREATE POLICY "Yöneticiler siparişleri silebilir" ON laundry_orders
    FOR DELETE USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Kullanıcılar kendi bekleyen siparişlerini silebilir" ON laundry_orders;
CREATE POLICY "Kullanıcılar kendi bekleyen siparişlerini silebilir" ON laundry_orders
    FOR DELETE USING (auth.uid() = user_id AND status = 'pending');

-- Notifications RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Kullanıcılar kendi bildirimlerini görebilir" ON notifications;
CREATE POLICY "Kullanıcılar kendi bildirimlerini görebilir" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Kullanıcılar kendi bildirimlerini silebilir" ON notifications;
CREATE POLICY "Kullanıcılar kendi bildirimlerini silebilir" ON notifications
    FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Kullanıcılar kendi bildirimlerini güncelleyebilir" ON notifications;
CREATE POLICY "Kullanıcılar kendi bildirimlerini güncelleyebilir" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Sistem veya admin bildirim gönderebilir" ON notifications;
CREATE POLICY "Sistem veya admin bildirim gönderebilir" ON notifications
    FOR INSERT WITH CHECK (true);

-- Support Tickets RLS
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Kullanıcılar kendi taleplerini görebilir" ON support_tickets;
CREATE POLICY "Kullanıcılar kendi taleplerini görebilir" ON support_tickets
    FOR SELECT USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Kullanıcılar talep oluşturabilir" ON support_tickets;
CREATE POLICY "Kullanıcılar talep oluşturabilir" ON support_tickets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Yöneticiler talepleri güncelleyebilir" ON support_tickets;
CREATE POLICY "Yöneticiler talepleri güncelleyebilir" ON support_tickets
    FOR UPDATE USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- ==============================================================================
-- 4. GÜVENLİ RPC (REMOTE PROCEDURE CALL) FONKSİYONLARI
-- ==============================================================================

-- A) Atomik Çamaşırhane Ödeme Fonksiyonu
CREATE OR REPLACE FUNCTION process_laundry_payment(user_id_param UUID, total_cost NUMERIC, order_count INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    current_balance NUMERIC;
BEGIN
    SELECT balance INTO current_balance FROM users WHERE id = user_id_param FOR UPDATE;

    IF current_balance < total_cost THEN
        RAISE EXCEPTION 'Yetersiz bakiye';
    END IF;

    UPDATE users SET balance = balance - total_cost WHERE id = user_id_param;

    INSERT INTO transactions (user_id, amount, type, description) 
    VALUES (user_id_param, total_cost, 'wash_payment', order_count || ' Sepet Çamaşırhane Siparişi');

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- B) Atomik İade Fonksiyonu
CREATE OR REPLACE FUNCTION process_refund(user_id_param UUID, refund_amount NUMERIC, admin_id_param UUID, description_text TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE users SET balance = balance + refund_amount WHERE id = user_id_param;

    INSERT INTO transactions (user_id, admin_id, amount, type, description) 
    VALUES (user_id_param, admin_id_param, refund_amount, 'topup_cash', description_text);

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- C) Admin Şifre Sıfırlama Fonksiyonu (Varsayılan: 'alidayi')
CREATE OR REPLACE FUNCTION admin_reset_user_password(student_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin') THEN
        RAISE EXCEPTION 'Yetkisiz islem';
    END IF;

    UPDATE auth.users 
    SET encrypted_password = crypt('alidayi', gen_salt('bf')) 
    WHERE id = student_id;

    UPDATE public.users 
    SET must_change_password = true 
    WHERE id = student_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- D) Kullanıcı Şifre Değiştirme Bayrağını Kaldırma
CREATE OR REPLACE FUNCTION clear_must_change_password()
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE public.users 
    SET must_change_password = false 
    WHERE id = auth.uid();

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
