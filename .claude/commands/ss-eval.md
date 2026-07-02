---
description: Bir sayfanın anahtar state SS'lerini alıp UI rubriğine göre değerlendir ve düzelt
---

Hedef sayfa: $ARGUMENTS (dosya adı; boşsa hangi sayfa olduğunu sor).

1. Sayfayı yerel dosyadan Playwright ile aç (file:// veya basit `python3 -m http.server`).
2. SS al: 1440px desktop + 390px mobil; ayrıca sayfanın anahtar state'leri
   (farklı `?role=` değerleri, aktif sekme/filtre, boş durum varsa).
3. Her SS'i şu rubriğe göre değerlendir (CLAUDE.md'deki done tanımı):
   - Görsel hiyerarşi & whitespace ritmi
   - Tipografik ölçek tutarlılığı
   - Kontrast / erişilebilirlik (AA)
   - Component tutarlılığı (tokens.css + ui.css pattern'ları)
   - Referans UI diline sadakat (dadamutfak sa-shell)
   - Gaviaworks marka tutarlılığı (lacivert+mint, Manrope)
4. Eksik listesi çıkar → düzelt → SS'i tekrarla. Rubrik temizse "done" raporu ver.
5. Görsel kurallara uy: CSS render genişliği esas (2x çarpma yok); kare görseller
   div+background-image cover center.
