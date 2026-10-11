-- 1. Şifre sıfırlama zorunluluğu için yeni sütun
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN DEFAULT false;

-- pgcrypto eklentisini aktif et (şifre hashleme için)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Adminin şifreyi "alidayi" olarak sıfırlaması için fonksiyon
CREATE OR REPLACE FUNCTION admin_reset_user_password(student_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- Yetki kontrolü
    IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin') THEN
        RAISE EXCEPTION 'Yetkisiz islem';
    END IF;

    -- auth.users tablosunda şifreyi bcrypt ile 'alidayi' olarak güncelle
    UPDATE auth.users 
    SET encrypted_password = crypt('alidayi', gen_salt('bf')) 
    WHERE id = student_id;

    -- Kullanıcının public tablosunda şifre değiştirme zorunluluğunu true yap
    UPDATE public.users 
    SET must_change_password = true 
    WHERE id = student_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Kullanıcının şifresini değiştirdikten sonra bayrağı kaldırması için fonksiyon
CREATE OR REPLACE FUNCTION clear_must_change_password()
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE public.users 
    SET must_change_password = false 
    WHERE id = auth.uid();

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
