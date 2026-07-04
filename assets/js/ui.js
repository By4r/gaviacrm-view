/* =====================================================================
   GAVIA CRM — PAYLAŞILAN UI PRİMİTİFLERİ (kabuk-bağımsız)
   gvToast · gvConfirm (+ delege yıkıcı-aksiyon onayı) · hesap dropdown ·
   data-wip / data-soon yakalama · data-export format menüsü [MOCK-SİM] ·
   tablo arama + chip filtre yardımcıları ·
   gvChain onay zinciri (timeline + rozet + onayla/reddet/revize aksiyonu).
   Pilot onayı sonrası KİLİTLİ (sahip: T0).
   ===================================================================== */
(function(){
  'use strict';
  if(window.gvToast) return;   /* çift yükleme koruması */

  /* ---- gvToast — köşe geri bildirim ---- */
  window.gvToast = function(msg, opts){
    opts = opts || {};
    var wrap = document.querySelector('.gv-toast-wrap');
    if(!wrap){ wrap = document.createElement('div'); wrap.className = 'gv-toast-wrap'; document.body.appendChild(wrap); }
    var t = document.createElement('div');
    t.className = 'gv-toast ' + (opts.type || 'ok');
    t.setAttribute('role','status');
    var ic = document.createElement('i');
    ic.className = 'fa-solid ' + (opts.icon || (opts.type==='danger' ? 'fa-trash' : opts.type==='info' ? 'fa-circle-info' : 'fa-circle-check'));
    var sp = document.createElement('span'); sp.textContent = msg;
    t.appendChild(ic); t.appendChild(sp); wrap.appendChild(t);
    requestAnimationFrame(function(){ t.classList.add('show'); });
    setTimeout(function(){ t.classList.remove('show'); setTimeout(function(){ t.remove(); }, 260); }, opts.ms || 2600);
  };

  /* ---- gvConfirm — onay modalı ---- */
  window.gvConfirm = function(opts){
    opts = opts || {};
    var danger = !!opts.danger;
    var ov = document.createElement('div'); ov.className = 'gv-modal-ov';
    var m = document.createElement('div');
    m.className = 'gv-modal' + (danger ? ' danger' : '');
    m.setAttribute('role','dialog'); m.setAttribute('aria-modal','true');
    m.innerHTML = '<div class="gv-modal-ico"><i class="fa-solid ' + (opts.icon || (danger ? 'fa-trash' : 'fa-circle-question')) + '"></i></div>'
      + '<h3></h3><p></p>'
      + '<div class="gv-modal-acts">'
      +   '<button type="button" class="btn btn-ghost btn-sm gv-m-cancel"></button>'
      +   '<button type="button" class="btn btn-sm ' + (danger ? 'btn-danger' : 'btn-acc') + ' gv-m-ok"></button>'
      + '</div>';
    m.querySelector('h3').textContent = opts.title || 'Emin misiniz?';
    m.querySelector('p').textContent = opts.message || '';
    m.querySelector('.gv-m-cancel').textContent = opts.cancel || 'Vazgeç';
    m.querySelector('.gv-m-ok').textContent = opts.ok || 'Onayla';
    ov.appendChild(m); document.body.appendChild(ov);
    requestAnimationFrame(function(){ ov.classList.add('open'); });
    var okBtn = m.querySelector('.gv-m-ok'); okBtn.focus();
    function close(){ ov.classList.remove('open'); setTimeout(function(){ ov.remove(); }, 220); document.removeEventListener('keydown', onKey); }
    function onKey(e){ if(e.key === 'Escape') close(); }
    document.addEventListener('keydown', onKey);
    ov.addEventListener('click', function(e){ if(e.target === ov) close(); });
    m.querySelector('.gv-m-cancel').addEventListener('click', close);
    okBtn.addEventListener('click', function(){ close(); if(opts.onConfirm) opts.onConfirm(); });
  };

  /* ---- delege YIKICI-AKSİYON onayı — sil/iptal/reddet/kaldır/arşivle
     tetikleyicilerini CAPTURE fazında yakalar; onay SONRASI orijinal aksiyon.
     data-no-confirm ile devre dışı. ---- */
  var DESTR = {
    sil:    {ico:'fa-trash',        ok:'Sil',      q:'Silinsin mi?',      fut:'kalıcı olarak silinecek. Bu işlem geri alınamaz.', done:'silindi'},
    iptal:  {ico:'fa-xmark',        ok:'İptal Et', q:'İptal edilsin mi?', fut:'iptal edilecek.',  done:'iptal edildi'},
    reddet: {ico:'fa-xmark',        ok:'Reddet',   q:'Reddedilsin mi?',   fut:'reddedilecek.',    done:'reddedildi'},
    kaldir: {ico:'fa-circle-minus', ok:'Kaldır',   q:'Kaldırılsın mı?',   fut:'kaldırılacak.',    done:'kaldırıldı'},
    arsiv:  {ico:'fa-box-archive',  ok:'Arşivle',  q:'Arşivlensin mi?',   fut:'arşivlenecek.',    done:'arşivlendi'}
  };
  function destrKind(el, txt){
    if(el.querySelector('.fa-trash, .fa-trash-can')) return 'sil';
    if(/(^|\s)İptal Et(\s|$)/.test(txt)) return 'iptal';
    if(/(^|\s)Reddet(\s|$)/.test(txt))   return 'reddet';
    if(/(^|\s)Arşivle(\s|$)/.test(txt))  return 'arsiv';
    if(/(^|\s)(Kaldır|Çıkar)(\s|$)/.test(txt)) return 'kaldir';
    if(/(^|\s)Sil(\s|$)/.test(txt))      return 'sil';
    return null;
  }
  document.addEventListener('click', function(e){
    var el = e.target.closest('button,a'); if(!el) return;
    if(el.closest('.gv-modal')) return;
    if(el.hasAttribute('data-no-confirm')) return;
    if(el.hasAttribute('data-chain-act')) return;   /* onay zinciri kendi modalını açar */
    var txt = (el.textContent || '').replace(/\s+/g,' ').trim();
    var kind = destrKind(el, txt); if(!kind) return;
    var V = DESTR[kind];
    e.preventDefault(); e.stopImmediatePropagation();
    var row = el.closest('tr,li,.gv-card,.act-row,.mod-row');
    var nameEl = row && row.querySelector('.gcell-name,strong,b,h4,td');
    var name = nameEl ? nameEl.textContent.trim().split('\n')[0].trim() : '';
    if(name.length > 48 || name.length < 2 || /^[\d.,₺%]+$/.test(name)) name = '';
    gvConfirm({
      danger:true, icon:V.ico, ok:V.ok, cancel:'Vazgeç',
      title:V.q,
      message: name ? ('“' + name + '” ' + V.fut) : ('Bu kayıt ' + V.fut),
      onConfirm:function(){
        var oc = el.getAttribute('onclick');
        if(oc){ try{ (new Function(oc)).call(el); }catch(_){} }
        else { gvToast(name ? (name + ' ' + V.done) : ('Kayıt ' + V.done), {type:'danger'}); }
      }
    });
  }, true);

  /* ---- data-wip / data-soon linkleri — prototip kapsam bilgisi ---- */
  document.addEventListener('click', function(e){
    var el = e.target.closest('[data-wip],[data-soon]'); if(!el) return;
    if(el.hasAttribute('data-locked')) return;   /* tenant pop kendi mesajını verir */
    e.preventDefault();
    var msg = el.hasAttribute('data-soon')
      ? ((window.GV && GV.STR.phase2 || 'Faz 2') + ' kapsamında — bu sürümde kilitli.')
      : ((window.GV && GV.STR.wip) || 'Bu ekran çoğaltma dalgasında eklenecek.');
    gvToast(msg, {type:'info'});
  });

  /* ---- data-export — DIŞA AKTARMA format menüsü [MOCK-SİM] ----
     <a data-export="Kasa hareketleri"> → Excel/PDF/CSV mini-dropdown + gvToast sim.
     Görsel: .gv-pop idiyomu; konum inline fixed (butona demirli — ata elemanın
     position'ına bağımlı DEĞİL, ui.css dokunuşu yok). Gerçek dosya üretimi Faz 2. ---- */
  var EXP_FMT = [
    {ic:'fa-file-excel', lbl:'Excel (.xlsx)', f:'Excel'},
    {ic:'fa-file-pdf',   lbl:'PDF (.pdf)',    f:'PDF'},
    {ic:'fa-file-csv',   lbl:'CSV (.csv)',    f:'CSV'}
  ];
  var expMenu = null, expBtn = null;
  function expClose(){
    if(!expMenu) return;
    var m = expMenu; expMenu = null;
    m.classList.remove('open');
    if(expBtn){ expBtn.setAttribute('aria-expanded','false'); expBtn = null; }
    setTimeout(function(){ m.remove(); }, 180);
  }
  document.addEventListener('click', function(e){
    if(expMenu && !e.target.closest('.gv-export-pop') && !e.target.closest('[data-export]')) expClose();
  });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') expClose(); });
  /* kaydırmada kapat — 'scroll' DEĞİL wheel/touchmove: programatik/smooth scroll
     (ör. resize sonrası toparlanma) menüyü açılır açılmaz kapatmasın, yalnız kullanıcı niyeti kapatsın */
  document.addEventListener('wheel', function(){ expClose(); }, {passive:true});
  document.addEventListener('touchmove', function(){ expClose(); }, {passive:true});
  document.addEventListener('click', function(e){
    var el = e.target.closest('[data-export]'); if(!el) return;
    e.preventDefault();
    if(expBtn === el){ expClose(); return; }   /* aynı butona tekrar tıklama = kapat */
    expClose();
    var name = (el.getAttribute('data-export') || '').replace(/^1$/, '').trim();
    var menu = document.createElement('div');
    menu.className = 'gv-pop gv-export-pop';
    var html = '<div class="gp-head"><b>Dışa Aktar</b><span></span></div>';
    EXP_FMT.forEach(function(F){
      html += '<a href="#" data-fmt="' + F.f + '"><i class="fa-solid ' + F.ic + '"></i> ' + F.lbl + '</a>';
    });
    menu.innerHTML = html;
    menu.querySelector('.gp-head span').textContent = name || 'Format seçin (demo)';
    document.body.appendChild(menu);   /* önce ekle: gerçek yükseklik ölçülür (görünmez — .gv-pop opacity:0) */
    var r = el.getBoundingClientRect();
    menu.style.position = 'fixed';
    menu.style.minWidth = '188px';
    menu.style.right = Math.max(8, window.innerWidth - r.right) + 'px';
    var h = menu.offsetHeight || 200;
    var top = r.bottom + 8;
    if(top + h > window.innerHeight - 8){            /* aşağı sığmıyor → yukarı dene */
      var upTop = r.top - 8 - h;
      top = upTop >= 8 ? upTop : Math.max(8, window.innerHeight - h - 8);   /* yukarı da sığmazsa viewport'a kelepçele */
    }
    menu.style.top = top + 'px';                     /* tek eksen: inline top, temel .gv-pop top kuralını her dalda ezer */
    menu.querySelectorAll('a[data-fmt]').forEach(function(a){
      a.addEventListener('click', function(ev){
        ev.preventDefault(); ev.stopPropagation();
        var f = a.getAttribute('data-fmt');
        expClose();
        gvToast((name ? name + ' — ' : '') + f + ' formatında hazırlanıyor (demo)', {type:'info', icon:'fa-file-arrow-down'});
      });
    });
    el.setAttribute('aria-haspopup','true');
    el.setAttribute('aria-expanded','true');
    expBtn = el; expMenu = menu;
    requestAnimationFrame(function(){ menu.classList.add('open'); });
  });

  /* ---- HESAP DROPDOWN — persona çipi (içerik: window.GV_ACCOUNT_ITEMS) ---- */
  function accountMenu(){
    var me = document.querySelector('.gv-me'); if(!me || me.querySelector('.gv-pop')) return;
    var nm = (document.getElementById('gvName') || {}).textContent || 'Hesabım';
    var rl = (document.getElementById('gvRole') || {}).textContent || '';
    me.setAttribute('role','button'); me.setAttribute('tabindex','0');
    me.setAttribute('aria-haspopup','true'); me.setAttribute('aria-expanded','false');
    var items = window.GV_ACCOUNT_ITEMS || [
      {ic:'fa-regular fa-user', lbl:'Profil', soon:true},
      {div:true},
      {ic:'fa-solid fa-right-from-bracket', lbl:'Çıkış', href:'index.html', danger:true}
    ];
    var menu = document.createElement('div'); menu.className = 'gv-pop';
    var html = '<div class="gp-head"><b></b><span></span></div>';
    items.forEach(function(it){
      if(it.div){ html += '<div class="gp-div"></div>'; return; }
      var cls = it.danger ? ' class="danger"' : '';
      var soon = (!it.href && it.soon !== false) ? ' data-acc-soon="1"' : '';
      html += '<a' + cls + ' href="' + (it.href || '#') + '"' + soon + '><i class="' + (it.ic || 'fa-solid fa-circle') + '"></i> ' + it.lbl + '</a>';
    });
    menu.innerHTML = html;
    menu.querySelector('b').textContent = nm;
    menu.querySelector('span').textContent = rl;
    me.appendChild(menu);
    function setOpen(o){ menu.classList.toggle('open', o); me.setAttribute('aria-expanded', o ? 'true' : 'false'); }
    me.addEventListener('click', function(e){ if(e.target.closest('.gv-pop')) return; e.stopPropagation(); setOpen(!menu.classList.contains('open')); });
    me.addEventListener('keydown', function(e){
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); setOpen(!menu.classList.contains('open')); }
      else if(e.key === 'Escape') setOpen(false);
    });
    document.addEventListener('click', function(e){ if(!me.contains(e.target)) setOpen(false); });
    menu.querySelectorAll('a[data-acc-soon]').forEach(function(a){
      a.addEventListener('click', function(e){ e.preventDefault(); setOpen(false); gvToast(a.textContent.trim() + ' — yakında', {type:'info'}); });
    });
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', accountMenu);
  else accountMenu();

  /* ---- ONAY ZİNCİRİ (gvChain) — kasa/malzeme/izin/avans/hakediş ORTAK primitifi.
     Yeniden YAZILMAZ, çağrılır (sahip: T0).
     1) Timeline: gvChain(el, {steps:[{rol,kisi,durum,tarih,not}, …]})
        veya deklaratif <div data-chain='{"steps":[…]}'></div>
        Adım durumları: olusturdu | onaylandi | reddedildi | revize | bekliyor | sirada | iptal
        reddedildi/revize adımında `not` ZORUNLU (eksikse görsel uyarı + console.warn).
     2) Kayıt rozeti: gvChainBadge('taslak|bekliyor|onaylandi|reddedildi|revize|iptal')
        → .gstat span HTML string'i döner.
     3) Aksiyon: <button data-chain-act="onayla|reddet|revize" data-chain-name="KSA-2026-018">
        veya gvChainAction({kind,name,onDone(note)}) — reddet/revize'de boş açıklama GEÇMEZ. ---- */
  var CHAIN_STEP = {
    olusturdu:  {ico:'fa-paper-plane',    cls:'info',   lbl:'Oluşturdu'},
    onaylandi:  {ico:'fa-check',          cls:'ok',     lbl:'Onayladı'},
    reddedildi: {ico:'fa-xmark',          cls:'danger', lbl:'Reddetti'},
    revize:     {ico:'fa-rotate-left',    cls:'warn',   lbl:'Revize istedi'},
    bekliyor:   {ico:'fa-hourglass-half', cls:'wait',   lbl:'Onay bekliyor'},
    sirada:     {ico:'fa-minus',          cls:'idle',   lbl:'Sırada'},
    iptal:      {ico:'fa-ban',            cls:'off',    lbl:'İptal etti'}
  };
  var CHAIN_STAT = {
    taslak:     {cls:'off',    lbl:'Taslak'},
    bekliyor:   {cls:'wait',   lbl:'Onay bekliyor'},
    onaylandi:  {cls:'ok',     lbl:'Onaylandı'},
    reddedildi: {cls:'danger', lbl:'Reddedildi'},
    revize:     {cls:'warn',   lbl:'Revize istendi'},
    iptal:      {cls:'off',    lbl:'İptal edildi'}
  };
  window.gvChainBadge = function(status){
    var v = CHAIN_STAT[status] || CHAIN_STAT.bekliyor;
    return '<span class="gstat ' + v.cls + '">' + v.lbl + '</span>';
  };
  window.gvChain = function(el, data){
    if(!el || !data || !Array.isArray(data.steps)) return;
    var ol = document.createElement('ol'); ol.className = 'gv-chain';
    data.steps.forEach(function(st){
      var V = CHAIN_STEP[st.durum] || CHAIN_STEP.sirada;
      var li = document.createElement('li');
      li.className = 'chain-step ' + V.cls + (st.durum === 'bekliyor' ? ' is-now' : '');
      var node = document.createElement('span'); node.className = 'cs-node';
      node.innerHTML = '<i class="fa-solid ' + V.ico + '"></i>';
      var body = document.createElement('div'); body.className = 'cs-body';
      var top = document.createElement('div'); top.className = 'cs-top';
      var who = document.createElement('div'); who.className = 'cs-who';
      var nm = document.createElement('b'); nm.textContent = st.kisi || '—';
      var rl = document.createElement('span'); rl.textContent = st.rol || '';
      who.appendChild(nm); who.appendChild(rl);
      var when = document.createElement('div'); when.className = 'cs-when';
      var act = document.createElement('span'); act.className = 'cs-act'; act.textContent = V.lbl;
      when.appendChild(act);
      if(st.tarih){ var dt = document.createElement('span'); dt.className = 'cs-date'; dt.textContent = st.tarih; when.appendChild(dt); }
      top.appendChild(who); top.appendChild(when);
      body.appendChild(top);
      var needsNote = (st.durum === 'reddedildi' || st.durum === 'revize');
      if(st.not || needsNote){
        var note = document.createElement('div');
        note.className = 'cs-note' + (needsNote ? ' ' + V.cls : '');
        note.textContent = st.not || 'Açıklama girilmedi — red/revize adımında açıklama zorunludur.';
        if(needsNote && !st.not) console.warn('gvChain: red/revize adımında `not` zorunlu', st);
        body.appendChild(note);
      }
      li.appendChild(node); li.appendChild(body); ol.appendChild(li);
    });
    el.innerHTML = ''; el.appendChild(ol);
  };
  var CHAIN_ACT = {
    onayla:{ico:'fa-check',       tone:'',       btn:'btn-acc',    title:'Onaylansın mı?',
            fut:'onaylanacak ve bir sonraki onay adımına geçecek.',
            ok:'Onayla',      ph:'Not ekle (isteğe bağlı)',      need:false, done:'onaylandı',            type:'ok'},
    reddet:{ico:'fa-xmark',       tone:'danger', btn:'btn-danger', title:'Reddedilsin mi?',
            fut:'reddedilecek; gerekçe talep sahibine iletilir.',
            ok:'Reddet',      ph:'Red gerekçesi — zorunlu',      need:true,  done:'reddedildi',           type:'danger'},
    revize:{ico:'fa-rotate-left', tone:'warn',   btn:'btn-warn',   title:'Revize istensin mi?',
            fut:'revize için talep sahibine geri gönderilecek.',
            ok:'Revize İste', ph:'Revize açıklaması — zorunlu',  need:true,  done:'için revize istendi',  type:'info'}
  };
  window.gvChainAction = function(opts){
    opts = opts || {};
    var K = CHAIN_ACT[opts.kind] || CHAIN_ACT.onayla;
    var ov = document.createElement('div'); ov.className = 'gv-modal-ov';
    var m = document.createElement('div');
    m.className = 'gv-modal has-note' + (K.tone ? ' ' + K.tone : '');
    m.setAttribute('role','dialog'); m.setAttribute('aria-modal','true');
    m.innerHTML = '<div class="gv-modal-ico"><i class="fa-solid ' + K.ico + '"></i></div>'
      + '<h3></h3><p></p>'
      + '<textarea class="gv-m-note" rows="3"></textarea>'
      + '<div class="gv-m-err" hidden><i class="fa-solid fa-circle-exclamation"></i> Açıklama zorunludur.</div>'
      + '<div class="gv-modal-acts">'
      +   '<button type="button" class="btn btn-ghost btn-sm gv-m-cancel">Vazgeç</button>'
      +   '<button type="button" class="btn btn-sm ' + K.btn + ' gv-m-ok"></button>'
      + '</div>';
    m.querySelector('h3').textContent = K.title;
    m.querySelector('p').textContent = (opts.name ? ('“' + opts.name + '” ') : 'Bu kayıt ') + K.fut;
    var ta = m.querySelector('.gv-m-note'); ta.placeholder = K.ph;
    m.querySelector('.gv-m-ok').textContent = K.ok;
    ov.appendChild(m); document.body.appendChild(ov);
    requestAnimationFrame(function(){ ov.classList.add('open'); });
    ta.focus();
    function close(){ ov.classList.remove('open'); setTimeout(function(){ ov.remove(); }, 220); document.removeEventListener('keydown', onKey); }
    function onKey(e){ if(e.key === 'Escape') close(); }
    document.addEventListener('keydown', onKey);
    ov.addEventListener('click', function(e){ if(e.target === ov) close(); });
    m.querySelector('.gv-m-cancel').addEventListener('click', close);
    var err = m.querySelector('.gv-m-err');
    ta.addEventListener('input', function(){ if(ta.value.trim()){ err.hidden = true; ta.classList.remove('is-err'); } });
    m.querySelector('.gv-m-ok').addEventListener('click', function(){
      var note = ta.value.trim();
      if(K.need && !note){ err.hidden = false; ta.classList.add('is-err'); ta.focus(); return; }
      close();
      if(opts.onDone) opts.onDone(note);
      else gvToast((opts.name ? ('“' + opts.name + '” ') : 'Kayıt ') + K.done, {type:K.type});
    });
  };
  /* data-chain-act butonları + data-chain deklaratif render */
  document.addEventListener('click', function(e){
    var el = e.target.closest('[data-chain-act]'); if(!el) return;
    e.preventDefault();
    gvChainAction({kind: el.getAttribute('data-chain-act'), name: el.getAttribute('data-chain-name') || ''});
  });
  function wireChains(){
    document.querySelectorAll('[data-chain]').forEach(function(el){
      var raw = el.getAttribute('data-chain'); if(!raw || !raw.trim()) return;
      try{ gvChain(el, JSON.parse(raw)); }
      catch(err){ console.warn('gvChain: data-chain JSON hatalı', el, err); }
    });
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wireChains);
  else wireChains();

  /* ---- TABLO YARDIMCILARI (data-attribute ile kendiliğinden bağlanır) ----
     Arama: <input data-table-search="#tbl"> — satır metninde arar.
     Chip filtre: .chip[data-filter="deger"] + tablo satırında data-f="deger";
     "hepsi" değeri tümünü gösterir. İkisi birlikte AND çalışır. ---- */
  function wireTables(){
    document.querySelectorAll('input[data-table-search]').forEach(function(inp){
      var tbl = document.querySelector(inp.getAttribute('data-table-search')); if(!tbl) return;
      inp.addEventListener('input', function(){ applyFilters(tbl); });
    });
    document.querySelectorAll('.chip[data-filter]').forEach(function(ch){
      ch.addEventListener('click', function(){
        var grp = ch.closest('.chips');
        grp.querySelectorAll('.chip').forEach(function(x){ x.classList.remove('is-on'); });
        ch.classList.add('is-on');
        var tbl = document.querySelector(grp.getAttribute('data-target') || '.gtable');
        if(tbl) applyFilters(tbl);
      });
    });
    /* yüklemede ilk uygulama — sayfa scriptinin rol budaması (tr.remove) SONRASI
       sayaç + boş durum senkronlanır (satır gizlemek İÇİN rol budamada tr.hidden
       KULLANMA; bu ilk uygulama onu geri açar — budama tr.remove ile yapılır) */
    document.querySelectorAll('input[data-table-search]').forEach(function(inp){
      var tbl = document.querySelector(inp.getAttribute('data-table-search'));
      if(tbl) applyFilters(tbl);
    });
  }
  function applyFilters(tbl){
    var card = tbl.closest('.gv-card') || document;
    var inp = card.querySelector('input[data-table-search]');
    var term = inp ? inp.value.trim().toLocaleLowerCase('tr') : '';
    var on = card.querySelector('.chip.is-on[data-filter]');
    var f = on ? on.getAttribute('data-filter') : 'hepsi';
    var shown = 0;
    tbl.querySelectorAll('tbody tr').forEach(function(tr){
      var okF = (f === 'hepsi') || (tr.getAttribute('data-f') === f);
      var okT = !term || tr.textContent.toLocaleLowerCase('tr').indexOf(term) !== -1;
      var show = okF && okT;
      tr.hidden = !show;
      if(show) shown++;
    });
    var empty = card.querySelector('[data-table-empty]');
    if(empty) empty.hidden = shown !== 0;
    /* sayaç kart dışında (.gv-page-head) olabilir — karttan bulunamazsa belgeden.
       Çok tablolu sayfada sayaç KART İÇİNE konmalı. */
    var cnt = card.querySelector('[data-table-count]') || document.querySelector('[data-table-count]');
    if(cnt) cnt.textContent = shown;
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wireTables);
  else wireTables();
})();
