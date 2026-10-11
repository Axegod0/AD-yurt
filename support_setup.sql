-- Destek Talepleri (Support Tickets) tablosu
CREATE TABLE support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_number SERIAL, -- Otomatik artan numara (UI tarafında #TK-108 gibi gösterilecek)
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'ariza', 'sepet', 'oneri', 'bakiye'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    machine_id VARCHAR(50), -- Opsiyonel makine kodu (örn: M-03)
    image_url VARCHAR(500), -- Opsiyonel hata resmi URL'si
    status VARCHAR(50) DEFAULT 'pending', -- 'pending' (Bekliyor), 'in_progress' (İşlemde), 'resolved' (Çözüldü)
    resolution_note TEXT, -- Görevli tarafından eklenen çözüm notu
    resolved_by UUID REFERENCES users(id) ON DELETE SET NULL, -- Çözen idareci/admin
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) Politikaları
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanıcılar kendi taleplerini görebilir" ON support_tickets
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Yöneticiler tüm talepleri görebilir" ON support_tickets
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Kullanıcılar talep oluşturabilir" ON support_tickets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Yöneticiler talepleri güncelleyebilir" ON support_tickets
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
        )
    );
