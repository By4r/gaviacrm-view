/* =====================================================================
   GAVIA CRM — OMURGA JS (config-driven rail + menü + rol motoru)
   Rol: ?role= → localStorage(gv_crm_role) → superadmin
   Bölüm: body[data-sec] · Aktif ekran: body[data-screen]
   Tüm shell metinleri STR/SECTIONS/ROLES config'inde — i18n'e hazır,
   sayfalara hardcode edilmez. Pilot onayı sonrası KİLİTLİ (sahip: T0).
   =====================================================================

   KANONİK MOCK VERİ SETİ (tamamen kurgusal — tüm sayfalar BU adları kullanır)
   ─ Tenant: Yapıtaş İnşaat A.Ş. · Profesyonel Paket · crm.yapitas.example
   ─ Şantiyeler:
       Vadi Konakları        (konut, Çekmeköy/İstanbul, şef: Hasan Demirci, %68)
       Liman Lojistik Merkezi (ticari, Aliağa/İzmir,    şef: Aylin Koç,     %41)
       Merkez Şantiye        (depo+atölye, Gebze/Kocaeli, şef: Ömer Taşkın, %86)
       Kule Ofis B Blok      (ofis, Ataşehir/İstanbul — TAMAMLANDI 03/2026)
       Göl Evleri 2. Etap    (konut, Sapanca/Sakarya — PLANLAMA, başlangıç 09/2026)
   ─ Kişiler: Deniz Aksoy (Gavia platform) · Kemal Yapıcıoğlu (sahip) ·
       Murat Denizli (GM) · Elif Sarıkaya (teknik md.) · Hasan Demirci, Aylin Koç,
       Ömer Taşkın (şefler) · Nesrin Aydın (muhasebe) · Baran Yıldız (satın alma) ·
       Seda Karaca (İK) · Ali Vural (saha personeli)
   ─ Saha işçileri (Dalga 2A'da kanonikleşti — puantaj/personel/özlük BU adları kullanır):
       Vadi Konakları: Ali Vural (saha personeli) · İbrahim Sönmez (formen) ·
         Ramazan Kılıç (kalıpçı) · Selim Doğan (demir ustası) · Musa Erdem (düz işçi) ·
         Veli Şimşek (elektrik ustası)
       Liman Lojistik: Şükrü Aslan (formen) · Halil Güneş (operatör) ·
         Metin Çetin (kaynakçı) · Osman Polat (düz işçi)
       Merkez Şantiye: Recep Yaman (formen) · İlyas Kurt (marangoz) · Sadık Öz (düz işçi)
   ─ Taşeronlar: Demir-Beton İnş. Ltd. · Yalıtım Kardeşler · ElektroMek Taahhüt
   ─ Tedarikçiler: Ege Hazır Beton · Marmara Demir Çelik · Anadolu Hırdavat
   ─ Müşteri/Kurum: Körfez GYO · Aliağa Liman İşletmeleri · Sapanca Belediyesi
   ─ Cari ilgili kişileri (Dalga 1'de kanonikleşti — Kişiler sayfası bunları kullanır):
       Selin Aydemir (Körfez GYO) · Erhan Kaya (Aliağa Liman) · Zeynep Ulusoy (Sapanca Bel.) ·
       Yusuf Ergin (Demir-Beton) · Cemal Boz (Yalıtım Kard.) · Tolga Şener (ElektroMek) ·
       Kadir Solmaz (Ege Hazır Beton) · Burcu İnan (Marmara Demir Ç.) · Fatih Coşkun (Anadolu Hırd.)
   ─ Belge numaralama (Dalga 2'de doğdu, KANONİK — çapraz atıflar bu şemayı kullanır):
       KSA-2026-### kasa · MLZ-2026-### malzeme talebi · SAT-2026-### satın alma formu ·
       TH-2026-### taşeron hakediş · HKD-2026-### kurum hakediş · AVN-2026-### avans ·
       SZL-2025-T## / SZL-2026-K## sözleşme (T=taşeron, K=kurum) ·
       MKN-## makine · ISG-2026-### İSG tutanağı (Dalga 3'te doğdu)
       Not (4B): MLZ-2026-032/033 liste-dışı ESKİ tamamlanmış talepler — talepler
       listesi 034-046 aralığını gösterir; 032 → SAT-2026-009 (PVC, Vadi),
       033 → SAT-2026-010 (kaynak teli, Liman) kaynak referansı. Onay bekleyen
       talebe (043/045 gibi) tamamlanmış SAT formu BAĞLANMAZ.
   ─ Makine parkı (Dalga 3'te kanonikleşti — makine puantajı BU listeyi kullanır):
       Vadi Konakları: Ekskavatör CAT 320 (MKN-01, kiralık) ·
         Kule Vinç Potain MC-85 (MKN-02, öz mal) ·
         Beton Pompası Putzmeister M42 (MKN-03, hizmet: Ege Hazır Beton)
       Liman Lojistik: Mobil Vinç Liebherr LTM 1050 (MKN-04, kiralık, operatör: Halil Güneş) ·
         Forklift Toyota 8FD25 (MKN-05, öz mal)
       Merkez Şantiye: Beko Loder JCB 3CX (MKN-06, öz mal)
       (Kule Ofis tamamlandı / Göl Evleri planlama — makine parkı YOK)
   ─ Yemekhane bağlamı: kişi sayıları saha kadrosu+şef+taşeron ekipleriyle tutarlı
       (VK ~35 · Liman ~22 · Merkez ~12; taşeron yemekleri ayrı satırda gösterilir)
   ─ Tarih bağlamı: 2 Temmuz 2026, Perşembe
   ─ DALGA 4A KANONİK TANIMLAR (2026-07-03 — 4A sayfaları BU tanımları kullanır):
     · İzin türleri (12) + gün kuralı [MOCK-SİM — statik harita; mevzuat/kıdem motoru DEĞİL]:
         yillik   Yıllık İzin       → serbest (varsayılan 14)
         yol      Yol İzni          → yıllığa ek; checkbox ile +4 güne kadar
         mazeret  Mazeret İzni      → serbest (varsayılan 1)
         evlilik  Evlilik İzni      → 5  (otomatik)
         dogum    Doğum İzni        → 112 (16 hafta, otomatik)
         babalik  Babalık İzni      → 5  (otomatik)
         olum     Ölüm (Vefat) İzni → 3  (otomatik)
         raporlu  Raporlu           → rapor süresi kadar (serbest; rapor eki beklenir)
         ucretsiz Ücretsiz İzin     → serbest
         saatlik  Saatlik İzin      → gün alanı saat girişine döner (0,5 gün altı)
         tamgun   Tam Gün İzin      → 1   (sabit)
         yarim    Yarım Gün İzin    → 0,5 (sabit)
       Otomatik türlerde form "yasal süre otomatik uygulandı" notu gösterir.
   ─ Puantaj durum seti (mevcut 6 + 4A'da +4; puantaj sayfası ve şantiye-detay
       puantaj sekmesi AYNI seti kullanır):
         tam Tam gün (ok) · yarim Yarım gün (warn) · yok Gelmedi (danger) ·
         izin İzinli (info) · rapor Raporlu (muted) · fm Fazla Mesai FM (acc) ·
         em Eksik Mesai EM (warn koyu türev, color-mix) · rt Resmi Tatil RT (dashed) ·
         ht Hafta Tatili HT (dashed muted) — mevcut jenerik "tatil" HT'ye ayrışır, RT ayrı işaret.
   ─ Ajanda olay türleri + renk (kişisel ajanda; santiye-ajanda .ajd-card pattern'i):
         toplanti Toplantı (ink-2) · gorev Görev (acc-ink) · ziyaret Şantiye Ziyareti (info) ·
         izin İzin başl./bitiş (warn) · odeme Ödeme/Hakediş (ok) · termin Malzeme Teslim (danger)
   ─ Talep yaşam-döngüsü ek durumları (statik .gstat; gvChainBadge'e DOKUNULMAZ):
         "Tedarik Sürecinde" (info) · "Tamamlandı" (ok)
   ─ DALGA 4C KANONİK TANIMLAR (2026-07-03 — demirbaş/rapor sayfaları BU tanımları kullanır):
     · Zimmet/demirbaş numaralama: ZMT-YYYY-### (yıl = teslim/kayıt yılı).
       ZMT-2025-### serisi = KAPANMIŞ ESKİ KAYITLAR (iade edilmiş / hurdaya ayrılmış).
       Audit fix: 4B'deki "ZMT-2026-045 · teslim 10 Mar 2025" kaydı ZMT-2025-017'ye
       düşürüldü (tarih korundu); boşalan 045 numarası yeni kaleme verildi — seri boşluksuz.
     · Demirbaş kategorileri (6): Telefon & İletişim · Tablet · El Aleti ·
       Güvenlik Ekipmanı · Araç · Makine-Ekipman
     · Demirbaş durum rozetleri (statik .gstat): Zimmetli (ok) · Depoda (info) ·
       Serviste (warn) · Hurda (muted) · İade Edildi (off — kişi zimmet geçmişinde)
     · KANONİK ENVANTER (demirbaş listesi ↔ personel-detay zimmet sekmesi BİREBİR):
         ZMT-2026-041 İş Telefonu — Samsung Galaxy A54, 64GB      · Hasan Demirci · Vadi   · Zimmetli · 3 Oca 2026
         ZMT-2026-042 El Aleti Seti — Bosch GSB 18V-55, 18 parça  · Hasan Demirci · Vadi   · Zimmetli · 3 Oca 2026
         ZMT-2026-043 Güvenlik Ekipmanı — baret+yelek+bot seti    · Hasan Demirci · Vadi   · Zimmetli · 3 Oca 2026
         ZMT-2026-044 Araç — Ford Ranger pikap, 34 ABC 123        · Hasan Demirci · Vadi   · Zimmetli · 3 Oca 2026
         ZMT-2026-045 Tablet — Samsung Galaxy Tab A9, 64GB        · Aylin Koç     · Liman  · Zimmetli · 15 Şub 2026
         ZMT-2026-046 Lazer Metre — Bosch GLM 50 C                · Ömer Taşkın   · Merkez · Zimmetli · 20 Oca 2026
         ZMT-2026-047 Kırıcı-Delici — Hilti TE 60-A36             · (kişisiz)     · Merkez depo · Serviste (gönderim 25 Haz 2026)
         ZMT-2026-048 El Telsizi Seti — Motorola CP040, 4 adet    · (kişisiz)     · Merkez depo · Depoda
         ZMT-2025-017 El Telsizi — Motorola CP040                 · Hasan Demirci · —      · İade Edildi (teslim 10 Mar 2025 → iade 3 Oca 2026)
         ZMT-2025-009 Jeneratör — Honda EU22i                     · (kişisiz)     · —      · Hurda (teslim 8 Nis 2025 → hurda kararı 12 May 2026)
     · Raporlama merkezi: panel menüsü altında (yeni rail bölümü AÇILMAZ); 13 rapor
       kartı, 3 temsili ekran (puantaj/maliyet/personel). Rapor tutarları mevcut
       KSA/TH/HKD/MLZ kayıtlarından DERLENİR — yeni tutar UYDURULMAZ.
     · Ekran-seviyesi RBAC (ROLES[r].scr — 4C'de doğdu): İK operasyonda yalnız
       puantaj+demirbaş; saha personeli + satın alma panelde Raporlar'ı görmez.
       Roller matrisi (crm-ayarlar-roller.html) bu kısıtları "kısmi" rozetiyle gösterir.
   ─ DALGA 5C KANONİK TANIMLAR (2026-07-04 — LEAD ön-işi; 5C sayfaları BU tanımları kullanır):
     · KSG-2026-### kasa GİRİŞ/TAHSİLAT serisi (KSA-2026-### GİDER olarak kalır —
       mevcut KSA kayıtlarına ve gvChain gider akışına DOKUNULMAZ; KSA satırları
       tür etiketi olarak Ödeme/Avans Ödemesi alır, KSG satırları statik .gstat, zincir YOK):
         KSG-2026-001 ·  9 Haz 2026 · Giriş    · Genel merkez kasa beslemesi → Vadi Konakları   · ₺100.000 · (iç transfer, cari yok)
         KSG-2026-002 · 15 Haz 2026 · Tahsilat · Körfez GYO — HKD-2026-004 hakediş ödemesi      · ₺540.000 · Vadi
         KSG-2026-003 · 20 Haz 2026 · Giriş    · Genel merkez kasa beslemesi → Liman Lojistik   · ₺85.000
         KSG-2026-004 · 24 Haz 2026 · Tahsilat · Körfez GYO — HKD-2026-005 hakediş ödemesi      · ₺620.000 · Vadi
         KSG-2026-005 · 29 Haz 2026 · Tahsilat · Marmara Demir Çelik — hurda karkas demir satışı · ₺46.500 · Merkez
         KSG-2026-006 ·  1 Tem 2026 · Giriş    · Genel merkez kasa beslemesi → Merkez Şantiye   · ₺60.000
       Kural: Tahsilat tutarı bağlı belgeyle BİREBİR (HKD-2026-004 ₺540.000 + HKD-2026-005
       ₺620.000, ikisi de kurum sayfasında "Ödendi" — KSG bu ödemelerin kasa karşılığı).
       Aliağa HKD-001/002 ödemeleri KSG serisi ÖNCESİ kabul edilir (kayıt açılmaz);
       HKD-2026-003 "Onaylandı" = HENÜZ ödenmedi → KSG kaydı YOK.
     · KANONİK SAHA HEADCOUNT (mini-fix #3 çözümü — taşeron DAHİL tek sayı seti):
         Vadi Konakları   51 = 35 öz kadro + Demir-Beton 10 + ElektroMek 6
         Liman Lojistik   30 = 22 öz kadro + Yalıtım Kardeşler 8
         Merkez Şantiye   12 = 12 öz kadro (taşeron YOK — depo+atölye)
         TOPLAM SAHADA    93 = 69 öz + 24 taşeron
       Kaynak: yemekhane öğle öğün sayıları (öz 35/22/12 + taşeron 10/6/8) ZATEN CANLI
       kanonik; öğle toplamı 93 = headcount BİREBİR. santiye.html 48/61/33 ile
       panel-ozet 48/52/48 kırılımları BAYAT → 5C'de bu sete hizalanır.
       Metrik ayrımı: bireysel puantaj = ÖZ kadro (69; 13 temsili ad idiyomu sürer) ·
       taşeron = firma bazlı adam-gün, kişi adı listelenmez (madde 16.2 sekmesi) ·
       bordro/idari kadro 22 kişi AYRI metrik (İK sayfaları) — headcount'a karışmaz.
       Hizalama hedefleri (5C üretim grep listesi): santiye.html personel kolonu
       48→51 · 61→30 · 33→12 + ph-sub "142 personel"→93; panel-ozet "142 kişi"/"142
       sahada"/"142/148"→90/93 (giriş kırılımı VK 49/51 · Liman 29/30 · Merkez 12/12;
       kayıtsız/izinli 3; oran %97) + şef bloğu 46/48→49/51; grep sweep "142|/148|
       46/48|50/52" → panel.html sef görünümü + kiosk (crm-panel-operasyon.html) +
       rapor-puantaj dahil TÜM sayfalar.
     · Makine yakıt/bakım kanonikleri (madde 10.2 — MKN parkı sayfa durumlarıyla senkron):
         MKN-01 Ekskavatör CAT 320     · motorin ~118 L/gün · son bakım 21 Haz 2026 (250 saat) · sonraki 500 saat
         MKN-02 Kule Vinç Potain MC-85 · elektrikli → yakıt "—"  · son bakım 12 Haz 2026 · aylık periyodik
         MKN-03 Beton Pompası M42      · hizmet alımı (Ege Hazır Beton) → yakıt/bakım hizmette, kolonlar "—"
         MKN-04 Mobil Vinç LTM 1050    · motorin ~65 L/gün  · son bakım 28 Haz 2026
         MKN-05 Forklift Toyota 8FD25  · motorin ~22 L/gün  · son bakım 5 Haz 2026
         MKN-06 Beko Loder JCB 3CX     · motorin ~40 L/gün  · ARIZALI (hidrolik) — servis kaydı 2 Tem 2026, sayfadaki durumla senkron
     · Yemekhane birim maliyet (madde 11 — mock, KDV dahil): kahvaltı ₺50 · öğle ₺90 ·
       akşam ₺75. 2 Tem günlük toplam: 84×50 + 93×90 + 46×75 = ₺16.020; taşeron payı
       58 öğün = ₺4.185 (ayrı gösterilir; firmaya yansıtma/faturalama Faz 2 — UI notu).
   ===================================================================== */
(function(){
  'use strict';

  /* ---- i18n'e hazır shell metinleri (tek kaynak) ---- */
  var STR = {
    brand:'Gavia CRM',
    greetDate:'2 Temmuz 2026, Perşembe',
    tenant:'Yapıtaş İnşaat A.Ş.',
    tenantPlan:'Profesyonel Paket',
    search:'Ara — şantiye, kişi, talep, hakediş…',
    notif:'Bildirimler',
    langTip:'Çok dil desteği — Faz 2',
    langSoon:'Çok dil desteği Faz 2 kapsamında eklenecek.',
    switchTenant:'Firma değiştir',
    phase2:'Faz 2',
    firmSettings:'Firma Ayarları',
    logout:'Çıkış / Rol Değiştir',
    wip:'Bu ekran çoğaltma dalgasında eklenecek.',
    wipSection:'Bu bölümün ekranları hazırlanıyor.',
    signature:'Gaviaworks'
  };

  /* ---- BÖLÜM config — rail sırası bu sırayla çizilir ---- */
  var SECTIONS = {
    panel:{ ic:'fa-gauge-high', eyebrow:'Genel Bakış', title:'Ana Panel', menu:[
      {ic:'fa-gauge-high', lbl:'Ana Panel', href:'crm-panel.html', screen:'panel'},
      {seclbl:'Gündem'},
      {ic:'fa-sun',            lbl:'Günlük Özet',      href:'crm-panel-ozet.html',        screen:'ozet'},
      {ic:'fa-calendar-week',  lbl:'Ajanda',           href:'crm-panel-ajanda.html',      screen:'ajanda'},
      {ic:'fa-list-check',     lbl:'Görevlerim',       href:'crm-gorev.html?f=bana'},
      {ic:'fa-stamp',          lbl:'Bekleyen Onaylar', href:'crm-panel-onaylar.html',     screen:'onaylar', cnt:'12'},
      {ic:'fa-bell',           lbl:'Bildirimler',      href:'crm-panel-bildirimler.html', screen:'bildirimler'},
      {seclbl:'Analiz'},
      {ic:'fa-chart-column',   lbl:'Raporlar',         href:'crm-panel-raporlar.html',    screen:'raporlar'}
    ]},
    santiye:{ ic:'fa-helmet-safety', eyebrow:'Saha', title:'Şantiyeler', menu:[
      {ic:'fa-helmet-safety',  lbl:'Şantiye Listesi',    href:'crm-santiye.html', screen:'liste'},
      {ic:'fa-camera',         lbl:'Saha Bildirimleri',  href:'crm-santiye-bildirimler.html', screen:'bildirimler', cnt:'4'},
      {ic:'fa-calendar-days',  lbl:'İş Programı',        href:'crm-santiye-ajanda.html', screen:'ajanda'},
      {ic:'fa-shield-halved',  lbl:'İSG Tutanakları',    href:'crm-santiye-isg.html',    screen:'isg'}
    ]},
    gorev:{ ic:'fa-list-check', eyebrow:'İş Takibi', title:'Görevler', menu:[
      /* tek liste + görünüm: sayfa ?f= paramını shell.js'ten ÖNCE body[data-screen]'e yazar */
      {ic:'fa-inbox',          lbl:'Bana Verilenler',  href:'crm-gorev.html?f=bana',     screen:'bana', cnt:'7'},
      {ic:'fa-paper-plane',    lbl:'Verdiklerim',      href:'crm-gorev.html?f=verdigim', screen:'verdigim'},
      {ic:'fa-triangle-exclamation', lbl:'Gecikenler', href:'crm-gorev.html?f=geciken',  screen:'geciken', cnt:'3'},
      {ic:'fa-circle-check',   lbl:'Tamamlananlar',    href:'crm-gorev.html?f=tamam',    screen:'tamam'}
    ]},
    personel:{ ic:'fa-users', eyebrow:'İnsan Kaynağı', title:'Personel & İK', menu:[
      {ic:'fa-users',          lbl:'Personel Listesi', href:'crm-personel.html',       screen:'liste'},
      {ic:'fa-umbrella-beach', lbl:'İzinler',          href:'crm-personel-izin.html',  screen:'izin', cnt:'5'},
      {ic:'fa-file-medical',   lbl:'Raporlar',         href:'crm-personel-rapor.html', screen:'rapor'},
      {ic:'fa-hand-holding-dollar', lbl:'Avanslar',    href:'crm-personel-avans.html', screen:'avans'},
      {ic:'fa-folder-open',    lbl:'Özlük & Evrak',    href:'crm-personel-ozluk.html', screen:'ozluk'}
    ]},
    operasyon:{ ic:'fa-clipboard-list', eyebrow:'Günlük Kayıt', title:'Saha Kayıtları', menu:[
      {ic:'fa-cash-register',  lbl:'Kasa Raporu',      href:'crm-operasyon-kasa.html',    screen:'kasa'},
      {ic:'fa-user-clock',     lbl:'Puantaj',          href:'crm-operasyon-puantaj.html', screen:'puantaj'},
      {ic:'fa-truck-pickup',   lbl:'Makine Puantajı',  href:'crm-operasyon-makine.html',    screen:'makine'},
      {ic:'fa-utensils',       lbl:'Yemekhane',        href:'crm-operasyon-yemekhane.html', screen:'yemekhane'},
      {ic:'fa-toolbox',        lbl:'Demirbaş',         href:'crm-operasyon-demirbas.html',  screen:'demirbas'}
    ]},
    satinalma:{ ic:'fa-cart-flatbed', eyebrow:'Tedarik', title:'Satın Alma', menu:[
      {ic:'fa-boxes-stacked',  lbl:'Malzeme Talepleri',   href:'crm-satinalma-talepler.html', screen:'talepler', cnt:'9'},
      {ic:'fa-file-invoice',   lbl:'Satın Alma Formları', href:'crm-satinalma-formlar.html',  screen:'formlar'},
      {ic:'fa-truck-ramp-box', lbl:'Termin Takibi',       href:'crm-satinalma-termin.html',   screen:'termin'}
    ]},
    cari:{ ic:'fa-address-book', eyebrow:'Rehber & Hesap', title:'Cariler', menu:[
      {ic:'fa-building',       lbl:'Firma Rehberi',   href:'crm-cari.html',       screen:'rehber'},
      {ic:'fa-id-card',        lbl:'Kişiler',         href:'crm-cari-kisiler.html', screen:'kisiler'},
      {ic:'fa-scale-balanced', lbl:'Cari Durum',      href:'crm-cari-durum.html', screen:'durum'}
    ]},
    finans:{ ic:'fa-file-signature', eyebrow:'Finans', title:'Hakediş & Sözleşme', menu:[
      {ic:'fa-building-columns',lbl:'Kurum Hakedişleri',   href:'crm-finans-kurum.html',       screen:'kurum'},
      {ic:'fa-people-arrows',  lbl:'Taşeron Hakedişleri',  href:'crm-finans-taseron.html',     screen:'taseron', cnt:'2'},
      {ic:'fa-file-contract',  lbl:'Sözleşme Arşivi',      href:'crm-finans-sozlesmeler.html', screen:'sozlesmeler'}
    ]},
    ayarlar:{ ic:'fa-sliders', eyebrow:'Yönetim', title:'Ayarlar', menu:[
      {ic:'fa-building-user',  lbl:'Firma',            href:'crm-ayarlar-firma.html', screen:'firma'},
      {ic:'fa-users-gear',     lbl:'Kullanıcılar',     href:'crm-ayarlar-kullanicilar.html', screen:'kullanicilar'},
      {ic:'fa-user-shield',    lbl:'Roller & Yetkiler',href:'crm-ayarlar-roller.html',       screen:'roller'},
      {ic:'fa-diagram-project',lbl:'Onay Akışları',    href:'crm-ayarlar-onay.html',         screen:'onay'},
      {ic:'fa-puzzle-piece',   lbl:'Modüller',         href:'crm-ayarlar-moduller.html',     screen:'moduller'}
    ]},
    /* Faz 2 genişleme noktası — rail'de kilitli görünür, inşa edilmez */
    satis:{ ic:'fa-chart-line', eyebrow:'Satış', title:'Satış CRM', locked:true, menu:[] }
  };
  var RAIL_ORDER = ['panel','santiye','gorev','personel','operasyon','satinalma','cari','finans','satis','ayarlar'];

  /* ---- ROL config (patron cevabı #5: superadmin + sahip demo öncelikli) ---- */
  var ALL = ['panel','santiye','gorev','personel','operasyon','satinalma','cari','finans'];
  var ROLES = {
    superadmin:{ name:'Deniz Aksoy',      role:'Gavia Platform Yöneticisi', ini:'DA',
                 secs:ALL.concat(['ayarlar']), land:'crm-panel.html', tenantChip:true },
    sahip:     { name:'Kemal Yapıcıoğlu', role:'Firma Sahibi',              ini:'KY',
                 secs:ALL.concat(['ayarlar']), land:'crm-panel.html' },
    yonetim:   { name:'Murat Denizli',    role:'Genel Müdür',               ini:'MD',
                 secs:ALL, land:'crm-panel.html' },
    teknik:    { name:'Elif Sarıkaya',    role:'Teknik Müdür',              ini:'ES',
                 secs:['panel','santiye','gorev','operasyon','finans'], land:'crm-panel.html' },
    sef:       { name:'Hasan Demirci',    role:'Şantiye Şefi — Vadi Konakları', ini:'HD',
                 secs:['panel','santiye','gorev','personel','operasyon','satinalma'], land:'crm-panel.html' },
    muhasebe:  { name:'Nesrin Aydın',     role:'Muhasebe',                  ini:'NA',
                 secs:['panel','operasyon','cari','finans','personel'], land:'crm-panel.html' },
    satinalma: { name:'Baran Yıldız',     role:'Satın Alma Sorumlusu',      ini:'BY',
                 secs:['panel','satinalma','cari','gorev'], land:'crm-panel.html',
                 scr:{ panel:['panel','ozet','ajanda','onaylar','bildirimler'] } },
    ik:        { name:'Seda Karaca',      role:'İK Uzmanı',                 ini:'SK',
                 secs:['panel','personel','gorev','operasyon'], land:'crm-panel.html',
                 scr:{ operasyon:['puantaj','demirbas'] } },
    personel:  { name:'Ali Vural',        role:'Saha Personeli',            ini:'AV',
                 secs:['panel','gorev'], land:'crm-panel.html',
                 scr:{ panel:['panel','ozet','ajanda','onaylar','bildirimler'] } }
  };
  /* scr = ekran-seviyesi budama (4C): bölüm İÇİNDE rolün görebildiği data-screen
     listesi. Tanımsızsa bölümün tamamı görünür (bölüm-seviyesi RBAC aynen).
     Listedeki kısıt: menü öğesi gizlenir + sayfa guard'ı landing'e döndürür.
     screen'siz menü öğeleri (çapraz linkler, ör. Görevlerim) budamadan MUAF.
     crm-ayarlar-roller.html matrisi bu kısıtları "kısmi" rozetiyle YANSITIR — senkron tut. */

  /* ---- rol çöz (param > localStorage > superadmin) ---- */
  var q = new URLSearchParams(location.search);
  var role = q.get('role');
  if(role && ROLES[role]){ try{localStorage.setItem('gv_crm_role', role);}catch(e){} }
  else { try{role = localStorage.getItem('gv_crm_role');}catch(e){} }
  if(!ROLES[role]) role = 'superadmin';
  var R = ROLES[role];

  /* ---- bölüm çöz + yetki guard'ı ---- */
  var sec = document.body.dataset.sec || 'panel';
  var screen = document.body.dataset.screen || null;
  if(sec !== 'giris' && R.secs.indexOf(sec) === -1){ location.replace(R.land); return; }
  /* ekran-seviyesi guard (scr) — kısıtlı bölümde liste-dışı ekran landing'e döner */
  function scrOk(secKey, m){
    var lim = R.scr && R.scr[secKey];
    return !lim || !m.screen || lim.indexOf(m.screen) !== -1;
  }
  if(sec !== 'giris' && screen && !scrOk(sec, {screen:screen})){ location.replace(R.land); return; }
  var S = SECTIONS[sec];

  window.GV = { role:role, R:R, sec:sec, screen:screen, STR:STR };
  if(sec === 'giris') return;   /* giriş sayfası yalnız rol motorunu kullanır */

  /* ---- 1) rail render ---- */
  var railEl = document.getElementById('gvRail');
  if(railEl){
    var h = '<a class="gv-rail-logo" href="index.html" data-tip="'+STR.brand+'">G</a>'
          + '<span class="gv-rail-div"></span>';
    RAIL_ORDER.forEach(function(key){
      var X = SECTIONS[key];
      if(X.locked){
        if(role==='superadmin' || role==='sahip'){
          h += '<a class="gv-rail-ico is-locked" data-sec="'+key+'" href="#" data-tip="'+X.title+' — '+STR.phase2+'"><i class="fa-solid '+X.ic+'"></i></a>';
        }
        return;
      }
      if(R.secs.indexOf(key) === -1) return;
      /* rail linki rolün GÖREBİLDİĞİ ilk ekrana gider (scr budaması dahil) */
      var vis = X.menu.filter(function(m){return m.href && scrOk(key, m);});
      var built = vis.length > 0;
      var href = built ? vis[0].href : '#';
      h += '<a class="gv-rail-ico'+(key===sec?' is-active':'')+(built?'':' rail-wip')+'" data-sec="'+key+'" href="'+href+'" data-tip="'+X.title+'"><i class="fa-solid '+X.ic+'"></i></a>';
    });
    h += '<div class="gv-rail-foot">'
       + '<a class="gv-sig" href="https://gaviaworks.com" target="_blank" rel="noopener" data-tip="gaviaworks.com">GAVIA</a>'
       + '</div>';
    railEl.innerHTML = h;
    railEl.querySelectorAll('.gv-rail-ico.is-locked, .gv-rail-ico.rail-wip').forEach(function(el){
      el.addEventListener('click', function(e){
        e.preventDefault();
        if(window.gvToast) gvToast(el.classList.contains('is-locked') ? (STR.phase2+' kapsamında — bu sürümde kilitli.') : STR.wipSection, {type:'info'});
      });
    });
  }

  /* ---- 2) bölüm menüsü render ---- */
  var menuEl = document.getElementById('gvMenu');
  if(menuEl){
    var mh = '<div class="gv-menu-head"><span class="gmh-eyebrow">'+S.eyebrow+'</span><span class="gmh-title">'+S.title+'</span></div><div class="gv-mnav">';
    /* scr budaması: gizlenen öğeler + altı boşalan bölüm başlıkları menüden düşer */
    var mlist = S.menu.filter(function(m){ return m.seclbl || scrOk(sec, m); });
    mlist = mlist.filter(function(m, i){ return !m.seclbl || (mlist[i+1] && !mlist[i+1].seclbl); });
    mlist.forEach(function(m){
      if(m.seclbl){ mh += '<div class="gv-msec">'+m.seclbl+'</div>'; return; }
      var isActive = screen && m.screen === screen;
      var cls = 'gv-mlink'+(isActive?' is-active':'');
      var tail = m.cnt ? '<span class="ml-cnt">'+m.cnt+'</span>' : (m.soon ? '<span class="ml-soon">'+STR.phase2+'</span>' : '');
      mh += '<a class="'+cls+'" href="'+(m.href||'#')+'"'+(m.wip?' data-wip="1"':'')+(m.soon?' data-soon="1"':'')+'><i class="fa-solid '+m.ic+'"></i> '+m.lbl+tail+'</a>';
    });
    mh += '</div><div class="gv-menu-foot">'
        + '<a class="gv-mlink" href="index.html"><i class="fa-solid fa-right-from-bracket"></i> '+STR.logout+'</a>'
        + '</div>';
    menuEl.innerHTML = mh;
  }

  /* ---- 3) topbar: persona + tenant çipi + dil çipi ---- */
  var nameEl = document.getElementById('gvName'), roleEl = document.getElementById('gvRole'), avaEl = document.getElementById('gvAva');
  if(nameEl) nameEl.textContent = R.name;
  if(roleEl) roleEl.textContent = R.role;
  if(avaEl) avaEl.textContent = R.ini;

  var searchInp = document.querySelector('.gv-search input');
  if(searchInp) searchInp.placeholder = STR.search;

  /* tenant çipi — yalnız superadmin (kiralanabilirlik sinyali; switcher Faz 2) */
  if(R.tenantChip){
    var top = document.querySelector('.gv-top'), search = document.querySelector('.gv-search');
    if(top && search){
      var tn = document.createElement('div');
      tn.className = 'gv-tenant';
      tn.setAttribute('role','button'); tn.setAttribute('tabindex','0');
      tn.setAttribute('aria-haspopup','true'); tn.setAttribute('aria-expanded','false');
      tn.innerHTML = '<span class="tn-dot"></span><span class="tn-lbl">'+STR.tenant+'</span><i class="fa-solid fa-chevron-down"></i>'
        + '<div class="gv-pop" id="gvTenantPop">'
        +   '<div class="gp-head"><b>'+STR.tenant+'</b><span>'+STR.tenantPlan+' · 18 kullanıcı</span></div>'
        +   '<a href="crm-ayarlar-firma.html"><i class="fa-solid fa-building-user"></i> '+STR.firmSettings+'</a>'
        +   '<div class="gp-div"></div>'
        +   '<a class="is-locked" href="#" data-locked="1"><i class="fa-solid fa-shuffle"></i> '+STR.switchTenant+'<span class="gp-soon">'+STR.phase2+'</span></a>'
        + '</div>';
      top.insertBefore(tn, search.nextSibling);
      var pop = tn.querySelector('.gv-pop');
      function setTn(o){ pop.classList.toggle('open',o); tn.setAttribute('aria-expanded', o?'true':'false'); }
      tn.addEventListener('click', function(e){
        var lk = e.target.closest('[data-locked]');
        if(lk){ e.preventDefault(); if(window.gvToast) gvToast('Çoklu firma yönetimi '+STR.phase2+' kapsamında.', {type:'info'}); setTn(false); return; }
        if(e.target.closest('.gv-pop')) return;
        setTn(!pop.classList.contains('open'));
      });
      tn.addEventListener('keydown', function(e){
        if(e.key==='Enter'||e.key===' '){ e.preventDefault(); setTn(!pop.classList.contains('open')); }
        else if(e.key==='Escape') setTn(false);
      });
      document.addEventListener('click', function(e){ if(!tn.contains(e.target)) setTn(false); });
    }
  }

  /* pasif dil çipi — tıklanabilir değil, bilgi verir */
  var tools = document.querySelector('.gv-top-tools');
  if(tools){
    var lang = document.createElement('button');
    lang.type = 'button';
    lang.className = 'gv-iconbtn gv-lang';
    lang.setAttribute('data-tip', STR.langTip);
    lang.setAttribute('aria-label', STR.langTip);
    lang.textContent = 'TR';
    lang.addEventListener('click', function(){ if(window.gvToast) gvToast(STR.langSoon, {type:'info'}); });
    tools.insertBefore(lang, tools.firstChild);

    /* topbar zili → bildirim merkezi (Dalga 3) */
    var bell = tools.querySelector('.gv-iconbtn[data-tip="'+STR.notif+'"]');
    if(bell){ bell.addEventListener('click', function(){ location.href = 'crm-panel-bildirimler.html'; }); }
  }

  /* ---- hesap menüsü içeriği (ui.js tüketir) ---- */
  window.GV_ACCOUNT_ITEMS = [
    {ic:'fa-regular fa-user',  lbl:'Profil',         soon:true},
    {ic:'fa-solid fa-sliders', lbl:'Hesap Ayarları', soon:true},
    {ic:'fa-regular fa-bell',  lbl:'Bildirim Tercihleri', soon:true},
    {div:true},
    {ic:'fa-solid fa-right-from-bracket', lbl:STR.logout, href:'index.html', danger:true}
  ];

  /* ---- mobil drawer ---- */
  var burger = document.getElementById('gvBurger'), overlay = document.getElementById('gvOverlay');
  if(burger) burger.addEventListener('click', function(){ document.body.classList.toggle('nav-open'); });
  if(overlay) overlay.addEventListener('click', function(){ document.body.classList.remove('nav-open'); });
  if(q.get('nav') === '1') document.body.classList.add('nav-open');

  /* ---- divider grip — menüyü katla/aç (localStorage'da kalıcı) ---- */
  (function(){
    var div = document.getElementById('gvDivider');
    try{ if(localStorage.getItem('gv_crm_menu')==='collapsed') document.body.classList.add('gv-collapsed'); }catch(e){}
    if(!div) return;
    function isC(){ return document.body.classList.contains('gv-collapsed'); }
    function set(c){
      document.body.classList.toggle('gv-collapsed', c);
      try{ localStorage.setItem('gv_crm_menu', c?'collapsed':'open'); }catch(e){}
    }
    var dragging=false, startX=0, moved=false;
    div.addEventListener('pointerdown', function(e){
      dragging=true; moved=false; startX=e.clientX; div.classList.add('is-drag');
      try{ div.setPointerCapture(e.pointerId); }catch(_){}
    });
    div.addEventListener('pointermove', function(e){
      if(!dragging) return;
      var dx = e.clientX - startX;
      if(Math.abs(dx) > 5) moved = true;
      if(dx < -26 && !isC()) set(true);
      else if(dx > 26 && isC()) set(false);
    });
    function end(){ if(dragging && !moved) set(!isC()); dragging=false; div.classList.remove('is-drag'); }
    div.addEventListener('pointerup', end);
    div.addEventListener('pointercancel', end);
  })();
})();
