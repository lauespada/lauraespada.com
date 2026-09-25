/* Laura Espada — menú y consentimiento de cookies. Sin dependencias. */
(function () {
  'use strict';
  // Menú móvil
  var toggle = document.getElementById('nav-toggle');
  var links = document.getElementById('nav-links');
  if (toggle && links) {
    var setOpen = function (open) { links.setAttribute('data-open', open ? 'true' : 'false'); toggle.setAttribute('aria-expanded', open ? 'true' : 'false'); };
    toggle.addEventListener('click', function () { setOpen(toggle.getAttribute('aria-expanded') !== 'true'); });
    links.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { setOpen(false); } });
  }

  // Analítica solo con consentimiento (Google Analytics 4)
  var GA_ID = 'G-COMPLETAR';
  var KEY = 'le_consent';
  var gaReady = /^G-[A-Z0-9]{6,}$/.test(GA_ID) && GA_ID.indexOf('COMPLETAR') === -1;
  if (!gaReady) return; // sin ID configurado no hay cookies ni banner

  var settingsBtn = document.querySelector('[data-cookie-settings]');
  if (settingsBtn) settingsBtn.hidden = false;
  var en = (document.documentElement.lang || 'es').indexOf('en') === 0;
  var txt = en
    ? { msg: 'I use analytics cookies (Google Analytics) to understand how the site is used. They are only loaded if you accept.', ok: 'Accept', no: 'Reject', more: 'Cookie policy' }
    : { msg: 'Uso cookies de analítica (Google Analytics) para entender cómo se usa el sitio. Solo se cargan si las aceptás.', ok: 'Aceptar', no: 'Rechazar', more: 'Política de cookies' };

  function getC() { var m = document.cookie.match(new RegExp('(?:^|;\\s*)' + KEY + '=([01])')); return m ? m[1] : null; }
  function setC(v) { document.cookie = KEY + '=' + v + ';path=/;max-age=' + (60 * 60 * 24 * 182) + ';samesite=Lax' + (location.protocol === 'https:' ? ';secure' : ''); }
  var loaded = false;
  function loadGA() {
    if (loaded) return; loaded = true;
    var s = document.createElement('script'); s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { anonymize_ip: true });
  }
  function banner() {
    if (document.getElementById('le-cookies')) return;
    var st = document.createElement('style');
    st.textContent = '#le-cookies{position:fixed;left:16px;right:16px;bottom:16px;z-index:60;max-width:560px;margin-left:auto;background:#3B2A22;color:#F7EFE2;border-radius:10px;padding:18px 20px;box-shadow:0 16px 40px rgba(59,42,34,.25);font:16px/1.45 Karla,system-ui,sans-serif}#le-cookies p{margin:0 0 14px}#le-cookies a{color:#F7EFE2}#le-cookies .r{display:flex;flex-wrap:wrap;gap:10px}#le-cookies button{min-height:44px;padding:0 18px;border-radius:6px;font:700 16px Karla,system-ui,sans-serif;cursor:pointer}#le-cookies .ok{background:#D9674E;color:#F7EFE2;border:none}#le-cookies .no{background:transparent;color:#F7EFE2;border:1.5px solid #F7EFE2}';
    document.head.appendChild(st);
    var d = document.createElement('div'); d.id = 'le-cookies'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-live', 'polite'); d.setAttribute('aria-label', 'Cookies');
    d.innerHTML = '<p>' + txt.msg + ' <a href="/politica-cookies">' + txt.more + '</a></p><div class="r"><button type="button" class="ok">' + txt.ok + '</button><button type="button" class="no">' + txt.no + '</button></div>';
    document.body.appendChild(d);
    d.querySelector('.ok').addEventListener('click', function () { setC('1'); d.remove(); loadGA(); });
    d.querySelector('.no').addEventListener('click', function () { setC('0'); d.remove(); });
  }
  if (settingsBtn) settingsBtn.addEventListener('click', banner);
  if (navigator.globalPrivacyControl && getC() === null) setC('0');
  var c = getC();
  if (c === '1') loadGA(); else if (c === null) banner();
})();
