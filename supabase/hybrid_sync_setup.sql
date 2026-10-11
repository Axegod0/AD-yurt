-- ==============================================================================
-- AD YURDU: ESKİ SİSTEM VE YENİ SİSTEM İKİLİ EŞZAMANLAMA (HYBRID SYNC - V2)
-- ==============================================================================
-- Eski sistemde `laundry_jobs.status` kolonu 'job_status' ENUM tipindedir.
-- Bu betik, enum tip uyuşmazlığını gidermek için `::text` ve `::job_status`
-- tip dönüşümlerini güvenli şekilde yapar.
-- ==============================================================================

-- 1. MEVCUT VERİLERİ YENİ SİSTEME AKTARMA (INITIAL BACKFILL)
INSERT INTO laundry_orders (
    id,
    user_id,
    station,
    mode,
    softener,
    cost,
    status,
    created_at,
    completed_at
)
SELECT 
    lj.id,
    lj.student_id AS user_id,
    'İstasyon #' || LPAD(lj.station_id::text, 2, '0') AS station,
    COALESCE(lj.wash_mode, 'Standart') AS mode,
    COALESCE(lj.softener_mode, 'Yok') AS softener,
    COALESCE(lj.price_paid, 0) AS cost,
    CASE 
        WHEN lj.status::text = 'washing' THEN 'active'
        WHEN lj.status::text = 'pending' THEN 'pending'
        WHEN lj.status::text = 'completed' THEN 'completed'
        ELSE 'completed'
    END AS status,
    lj.created_at,
    lj.completed_at
FROM laundry_jobs lj
ON CONFLICT (id) DO UPDATE SET
    status = EXCLUDED.status,
    completed_at = EXCLUDED.completed_at;

-- B) tickets -> support_tickets
-- Base64 formatındaki uzun görsel verilerini desteklemek için TEXT yap
ALTER TABLE support_tickets ALTER COLUMN image_url TYPE TEXT;

INSERT INTO support_tickets (
    id,
    user_id,
    title,
    description,
    image_url,
    status,
    resolution_note,
    created_at,
    updated_at
)
SELECT 
    t.id,
    t.user_id,
    COALESCE(t.title, 'Destek Talebi') AS title,
    COALESCE(t.description, '') AS description,
    t.photo_url AS image_url,
    CASE 
        WHEN t.status::text = 'replied' THEN 'resolved'
        ELSE 'pending'
    END AS status,
    t.admin_reply AS resolution_note,
    t.created_at,
    t.updated_at
FROM tickets t
ON CONFLICT (id) DO UPDATE SET
    status = EXCLUDED.status,
    resolution_note = EXCLUDED.resolution_note,
    updated_at = EXCLUDED.updated_at;


-- ==============================================================================
-- 2. TETİKLEYİCİLER (TRIGGERS): ÇİFT YÖNLÜ ÇAMAŞIRHANE EŞZAMANLAMASI
-- ==============================================================================

-- A) laundry_jobs -> laundry_orders & stations
CREATE OR REPLACE FUNCTION sync_laundry_jobs_to_orders()
RETURNS TRIGGER AS $$
DECLARE
    station_text VARCHAR(50);
    mapped_status VARCHAR(50);
BEGIN
    -- Sonsuz tetikleyici döngüsünü engelle
    IF pg_trigger_depth() > 1 THEN
        RETURN COALESCE(NEW, OLD);
    END IF;

    -- SİLME İŞLEMİ
    IF TG_OP = 'DELETE' THEN
        DELETE FROM laundry_orders WHERE id = OLD.id;
        IF NOT EXISTS (SELECT 1 FROM laundry_jobs WHERE station_id = OLD.station_id AND status::text IN ('pending', 'washing') AND id != OLD.id) THEN
            UPDATE stations SET status = 'available' WHERE id = OLD.station_id;
        END IF;
        RETURN OLD;
    END IF;

    -- İstasyon metni (#04)
    station_text := 'İstasyon #' || LPAD(NEW.station_id::text, 2, '0');
    
    -- washing -> active eşleme
    IF NEW.status::text = 'washing' THEN
        mapped_status := 'active';
    ELSE
        mapped_status := NEW.status::text;
    END IF;

    -- İstasyon tablosu durumu
    IF NEW.status::text IN ('pending', 'washing') THEN
        UPDATE stations SET status = 'busy' WHERE id = NEW.station_id;
    ELSIF NEW.status::text = 'completed' THEN
        IF NOT EXISTS (SELECT 1 FROM laundry_jobs WHERE station_id = NEW.station_id AND status::text IN ('pending', 'washing') AND id != NEW.id) THEN
            UPDATE stations SET status = 'available' WHERE id = NEW.station_id;
        END IF;
    END IF;

    -- Yeni sisteme yaz / güncelle
    INSERT INTO laundry_orders (
        id,
        user_id,
        station,
        mode,
        softener,
        cost,
        status,
        created_at,
        completed_at
    ) VALUES (
        NEW.id,
        NEW.student_id,
        station_text,
        COALESCE(NEW.wash_mode, 'Standart'),
        COALESCE(NEW.softener_mode, 'Yok'),
        COALESCE(NEW.price_paid, 0),
        mapped_status,
        NEW.created_at,
        NEW.completed_at
    )
    ON CONFLICT (id) DO UPDATE SET
        status = EXCLUDED.status,
        mode = EXCLUDED.mode,
        softener = EXCLUDED.softener,
        station = EXCLUDED.station,
        completed_at = EXCLUDED.completed_at;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_sync_laundry_jobs_to_orders ON laundry_jobs;
CREATE TRIGGER trg_sync_laundry_jobs_to_orders
AFTER INSERT OR UPDATE OR DELETE ON laundry_jobs
FOR EACH ROW EXECUTE FUNCTION sync_laundry_jobs_to_orders();


-- B) laundry_orders -> laundry_jobs & stations
CREATE OR REPLACE FUNCTION sync_laundry_orders_to_jobs()
RETURNS TRIGGER AS $$
DECLARE
    extracted_station_id INTEGER;
    mapped_status_val job_status;
BEGIN
    -- Sonsuz tetikleyici döngüsünü engelle
    IF pg_trigger_depth() > 1 THEN
        RETURN COALESCE(NEW, OLD);
    END IF;

    -- SİLME İŞLEMİ
    IF TG_OP = 'DELETE' THEN
        DELETE FROM laundry_jobs WHERE id = OLD.id;
        extracted_station_id := NULLIF(regexp_replace(OLD.station, '\D', '', 'g'), '')::INTEGER;
        IF extracted_station_id IS NOT NULL THEN
            IF NOT EXISTS (SELECT 1 FROM laundry_orders WHERE station = OLD.station AND status IN ('pending', 'active') AND id != OLD.id) THEN
                UPDATE stations SET status = 'available' WHERE id = extracted_station_id;
            END IF;
        END IF;
        RETURN OLD;
    END IF;

    -- İstasyon numarasını çıkar (örn: 'İstasyon #04' -> 4)
    extracted_station_id := NULLIF(regexp_replace(NEW.station, '\D', '', 'g'), '')::INTEGER;
    IF extracted_station_id IS NULL THEN
        extracted_station_id := 1;
    END IF;

    -- active -> washing eşleme (job_status enum: 'pending', 'washing', 'completed')
    IF NEW.status = 'active' THEN
        mapped_status_val := 'washing'::job_status;
    ELSIF NEW.status = 'completed' THEN
        mapped_status_val := 'completed'::job_status;
    ELSE
        mapped_status_val := 'pending'::job_status;
    END IF;

    -- İstasyon tablosu durumu
    IF NEW.status IN ('pending', 'active') THEN
        UPDATE stations SET status = 'busy' WHERE id = extracted_station_id;
    ELSIF NEW.status IN ('completed', 'canceled') THEN
        IF NOT EXISTS (SELECT 1 FROM laundry_orders WHERE station = NEW.station AND status IN ('pending', 'active') AND id != NEW.id) THEN
            UPDATE stations SET status = 'available' WHERE id = extracted_station_id;
        END IF;
    END IF;

    -- Eski sisteme yaz / güncelle
    INSERT INTO laundry_jobs (
        id,
        student_id,
        station_id,
        wash_mode,
        softener_mode,
        price_paid,
        status,
        created_at,
        completed_at
    ) VALUES (
        NEW.id,
        NEW.user_id,
        extracted_station_id,
        COALESCE(NEW.mode, 'Standart'),
        COALESCE(NEW.softener, 'Yok'),
        COALESCE(NEW.cost, 0),
        mapped_status_val,
        NEW.created_at,
        NEW.completed_at
    )
    ON CONFLICT (id) DO UPDATE SET
        status = EXCLUDED.status,
        wash_mode = EXCLUDED.wash_mode,
        softener_mode = EXCLUDED.softener_mode,
        station_id = EXCLUDED.station_id,
        completed_at = EXCLUDED.completed_at;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_sync_laundry_orders_to_jobs ON laundry_orders;
CREATE TRIGGER trg_sync_laundry_orders_to_jobs
AFTER INSERT OR UPDATE OR DELETE ON laundry_orders
FOR EACH ROW EXECUTE FUNCTION sync_laundry_orders_to_jobs();


-- ==============================================================================
-- 3. TETİKLEYİCİLER (TRIGGERS): ÇİFT YÖNLÜ DESTEK TALEBİ EŞZAMANLAMASI
-- ==============================================================================

-- A) tickets -> support_tickets
CREATE OR REPLACE FUNCTION sync_tickets_to_support()
RETURNS TRIGGER AS $$
DECLARE
    mapped_status VARCHAR(50);
BEGIN
    IF pg_trigger_depth() > 1 THEN
        RETURN COALESCE(NEW, OLD);
    END IF;

    IF TG_OP = 'DELETE' THEN
        DELETE FROM support_tickets WHERE id = OLD.id;
        RETURN OLD;
    END IF;

    IF NEW.status::text = 'closed' THEN
        mapped_status := 'resolved';
    ELSIF NEW.status::text = 'replied' THEN
        mapped_status := 'in_progress';
    ELSE
        mapped_status := 'pending';
    END IF;

    INSERT INTO support_tickets (
        id,
        user_id,
        type,
        title,
        description,
        image_url,
        status,
        resolution_note,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,
        NEW.user_id,
        'ariza',
        COALESCE(NEW.title, 'Destek Talebi'),
        COALESCE(NEW.description, ''),
        NEW.photo_url,
        mapped_status,
        NEW.admin_reply,
        NEW.created_at,
        NEW.updated_at
    )
    ON CONFLICT (id) DO UPDATE SET
        status = EXCLUDED.status,
        resolution_note = EXCLUDED.resolution_note,
        updated_at = EXCLUDED.updated_at;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_sync_tickets_to_support ON tickets;
CREATE TRIGGER trg_sync_tickets_to_support
AFTER INSERT OR UPDATE OR DELETE ON tickets
FOR EACH ROW EXECUTE FUNCTION sync_tickets_to_support();


-- B) support_tickets -> tickets
CREATE OR REPLACE FUNCTION sync_support_to_tickets()
RETURNS TRIGGER AS $$
DECLARE
    mapped_status_val ticket_status;
BEGIN
    IF pg_trigger_depth() > 1 THEN
        RETURN COALESCE(NEW, OLD);
    END IF;

    IF TG_OP = 'DELETE' THEN
        DELETE FROM tickets WHERE id = OLD.id;
        RETURN OLD;
    END IF;

    IF NEW.status = 'resolved' THEN
        mapped_status_val := 'closed'::ticket_status;
    ELSIF NEW.status = 'in_progress' THEN
        mapped_status_val := 'replied'::ticket_status;
    ELSE
        mapped_status_val := 'open'::ticket_status;
    END IF;

    INSERT INTO tickets (
        id,
        user_id,
        title,
        description,
        photo_url,
        status,
        admin_reply,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,
        NEW.user_id,
        COALESCE(NEW.title, 'Destek Talebi'),
        COALESCE(NEW.description, ''),
        NEW.image_url,
        mapped_status_val,
        NEW.resolution_note,
        NEW.created_at,
        NEW.updated_at
    )
    ON CONFLICT (id) DO UPDATE SET
        status = EXCLUDED.status,
        admin_reply = EXCLUDED.admin_reply,
        updated_at = EXCLUDED.updated_at;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_sync_support_to_tickets ON support_tickets;
CREATE TRIGGER trg_sync_support_to_tickets
AFTER INSERT OR UPDATE OR DELETE ON support_tickets
FOR EACH ROW EXECUTE FUNCTION sync_support_to_tickets();
