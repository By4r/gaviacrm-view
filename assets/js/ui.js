/* =====================================================================
   GAVIA CRM — PAYLAŞILAN UI PRİMİTİFLERİ (kabuk-bağımsız)
   gvToast · gvConfirm (+ delege yıkıcı-aksiyon onayı) · hesap dropdown ·
   data-wip / data-soon yakalama · tablo arama + chip filtre yardımcıları.
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
