-- Çamaşırhane siparişleri için tablo
CREATE TABLE laundry_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending', -- pending, active, completed, canceled
    station VARCHAR(50), -- İstasyon numarası (örn: İstasyon #04)
    mode VARCHAR(100), -- Yıkama modu (örn: Günlük Pamuklu)
    temperature VARCHAR(50), -- Sıcaklık ve devir
    softener VARCHAR(100), -- Yumuşatıcı
    cost NUMERIC DEFAULT 0, -- Harcanan AD Coin
    machine_id VARCHAR(50), -- Atanan makine numarası (opsiyonel)
    progress_percentage INTEGER DEFAULT 0, -- İlerleme yüzdesi
    progress_label VARCHAR(100), -- İlerleme açıklaması (örn: Durulama)
    time_left VARCHAR(50), -- Kalan süre metni
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Çamaşırhane siparişleri RLS politikaları
ALTER TABLE laundry_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanıcılar kendi siparişlerini görebilir" ON laundry_orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Yöneticiler tüm siparişleri görebilir" ON laundry_orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Kullanıcılar kendi siparişlerini oluşturabilir" ON laundry_orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Yöneticiler siparişleri güncelleyebilir" ON laundry_orders
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
        )
    );
