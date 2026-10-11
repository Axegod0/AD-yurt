# Supabase Veritabanı Yapısı ve Güvenlik Dokümantasyonu

Bu dizin, AD Yurdu projesinin Supabase PostgreSQL veritabanı şemasını, Row Level Security (RLS) politikalarını ve güvenli veritabanı fonksiyonlarını (RPC) içerir.

## Dosyalar
* **`schema.sql`**: Tüm veritabanının sıfırdan kurulması veya güncellenmesi için birleştirilmiş ve optimize edilmiş ana SQL dosyasıdır.

## Tablolar
1. `users`: Öğrenci ve idareci profilleri, oda numaraları, AD Coin bakiyeleri ve yetki rolleri.
2. `laundry_orders`: Çamaşırhane siparişleri, yıkama modları, kalan süreler ve durumlar.
3. `transactions`: Bakiye yükleme, harcama ve iade hareketlerinin güvenli kayıtları.
4. `announcements`: Yurt genelinde yayınlanan duyurular.
5. `notifications`: Kullanıcılara giden sipariş ve genel sistem bildirimleri.
6. `support_tickets`: Arıza, şikayet ve öneri talepleri.

## Fonksiyonlar (RPC)
* `process_laundry_payment`: Çamaşırhane ödemelerinde race condition ve bakiye manipülasyonunu engelleyen atomik ödeme fonksiyonu.
* `process_refund`: İdareci tarafından yapılan iadelerin bakiyeye eklenmesi ve transaction kaydı.
* `admin_reset_user_password`: İdarecinin unutan öğrencinin şifresini 'alidayi' olarak sıfırlaması ve zorunlu ilk giriş şifre değişimini aktif etmesi.
* `clear_must_change_password`: Öğrenci şifresini güncellediğinde zorunlu değişim bayrağını temizler.

## Uygulama Talimatı
Supabase Dashboard'a gidin: **SQL Editor** -> **New query** açın ve `schema.sql` içeriğini yapıştırıp **Run** butonuna basın.
