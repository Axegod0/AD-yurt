-- 1. EKSİK RLS (ROW LEVEL SECURITY) POLİTİKALARI --
-- Siparişler iptal edildiğinde veya admin tarafından silindiğinde "Silme (DELETE)" yetkisi eksikti.
-- Bu politikalar olmazsa kodda yazılan "delete()" komutları Supabase tarafından RLS ihlali sebebiyle sessizce reddedilebilir.

DROP POLICY IF EXISTS "Yöneticiler siparişleri silebilir" ON laundry_orders;
CREATE POLICY "Yöneticiler siparişleri silebilir" ON laundry_orders
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Kullanıcılar kendi bekleyen siparişlerini silebilir" ON laundry_orders;
CREATE POLICY "Kullanıcılar kendi bekleyen siparişlerini silebilir" ON laundry_orders
    FOR DELETE USING (
        auth.uid() = user_id AND status = 'pending'
    );


-- 2. GÜVENLİ İŞLEM (TRANSACTION) VE BAKİYE YÖNETİM FONKSİYONLARI --
-- İstemci tarafında "yeni bakiye = eski bakiye - ücret" hesaplayıp veritabanına doğrudan UPDATE atmak ciddi bir güvenlik açığıdır. (Race Condition & Client Manipulation)
-- Bunun yerine bakiyeyi veritabanı seviyesinde "Atomik" olarak güncelleyen güvenli RPC (Remote Procedure Call) fonksiyonları ekliyoruz.

-- A) Çamaşırhane Ödemesi İçin Güvenli Fonksiyon
CREATE OR REPLACE FUNCTION process_laundry_payment(user_id_param UUID, total_cost NUMERIC, order_count INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    current_balance NUMERIC;
BEGIN
    -- Kullanıcının mevcut bakiyesini kilitleyerek oku (Race condition önlemi)
    SELECT balance INTO current_balance FROM users WHERE id = user_id_param FOR UPDATE;

    IF current_balance < total_cost THEN
        RAISE EXCEPTION 'Yetersiz bakiye';
    END IF;

    -- Bakiyeyi güvenli şekilde düş
    UPDATE users SET balance = balance - total_cost WHERE id = user_id_param;

    -- İşlem geçmişine (transaction) otomatik kaydet
    INSERT INTO transactions (user_id, amount, type, description) 
    VALUES (user_id_param, total_cost, 'wash_payment', order_count || ' Sepet Çamaşırhane Siparişi');

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- B) Admin veya Sistem Tarafından İade İşlemi İçin Güvenli Fonksiyon
CREATE OR REPLACE FUNCTION process_refund(user_id_param UUID, refund_amount NUMERIC, admin_id_param UUID, description_text TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    -- Bakiyeyi güvenli şekilde iade et (arttır)
    UPDATE users SET balance = balance + refund_amount WHERE id = user_id_param;

    -- İşlem geçmişine iadeyi otomatik kaydet
    INSERT INTO transactions (user_id, admin_id, amount, type, description) 
    VALUES (user_id_param, admin_id_param, refund_amount, 'topup_cash', description_text);

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
