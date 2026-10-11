ALTER TABLE users ADD COLUMN IF NOT EXISTS badge VARCHAR(50);
-- Mevcut adminlere developer veya diğer badgeleri vermek için örnekler:
-- UPDATE users SET badge = 'developer' WHERE role = 'admin' AND email = 'isimsoyisim@alidayi.edu.tr';
