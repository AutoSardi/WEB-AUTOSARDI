/* Automóviles Sardi — lógica compartida (portada y catálogo) */
(function () {
  const S = window.SARDI;
  const COCHES = window.COCHES;
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];

  // es-ES no agrupa los números de 4 cifras (1750); en precios queda mejor 1.750
  const miles = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const eur = (n) => miles(n) + ' €';
  const km = (n) => (n == null ? 'Consultar' : miles(n) + ' km');
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // Cuota francesa: P capital, tin anual en %, n meses
  function cuota(P, tin, n) {
    if (P <= 0) return 0;
    const i = tin / 100 / 12;
    if (i === 0) return P / n;
    return (P * i) / (1 - Math.pow(1 + i, -n));
  }

  const ICON = {
    cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
    km: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 18a8 8 0 1 1 16 0"/><path d="M12 18l4-6"/></svg>',
    fuel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M3 21h12M4 11h10"/><path d="M14 8h2a2 2 0 0 1 2 2v6a1.5 1.5 0 0 0 3 0V8l-3-3"/></svg>',
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="5" cy="6" r="2"/><circle cx="12" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="12" cy="18" r="2"/><path d="M5 8v8M12 8v8M19 8v4H5"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.8 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1a17 17 0 0 1-1.8-.7 13.6 13.6 0 0 1-5.2-4.6c-.4-.5-1.1-1.6-1.1-3s.7-2.1 1-2.4c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .7.5l.9 2.3c.1.2.1.4 0 .6l-.3.5-.5.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.2 1.4 2.5 1.5.3.2.5.1.7-.1l1-1.2c.2-.3.4-.3.7-.2l2.2 1c.3.2.5.2.6.4.1.1.1.8-.1 1.4Z"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
  };
  window.SARDI_ICON = ICON;

  const titulo = (c) => `${c.marca} ${c.modelo}`;

  /* ---------- Movimiento ----------
     Respeta "reducir animaciones" salvo que se abra con ?animaciones=1 */
  const params = new URLSearchParams(location.search);
  try { if (params.get('animaciones') === '1') sessionStorage.setItem('sardi:motion', '1'); } catch (e) {}
  let forced = false;
  try { forced = sessionStorage.getItem('sardi:motion') === '1'; } catch (e) {}
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches && !forced;
  if (forced) document.documentElement.classList.add('force-motion');
  if (!reduce) document.documentElement.classList.add('js-motion');

  function initReveal() {
    const els = $$('[data-reveal]');
    if (reduce || !('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('is-in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach((e) => io.observe(e));
  }

  /* ---------- Cabecera y menú ---------- */
  function initHeader() {
    const header = $('.header');
    const onScroll = () => header && header.classList.toggle('is-scrolled', scrollY > 8);
    addEventListener('scroll', onScroll, { passive: true }); onScroll();

    const btn = $('.menu-btn'), nav = $('.nav');
    if (btn && nav) {
      const set = (open) => {
        btn.setAttribute('aria-expanded', String(open));
        nav.classList.toggle('is-open', open);
        document.body.style.overflow = open ? 'hidden' : '';
      };
      btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
      nav.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
      addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
    }

    // Teléfonos y WhatsApp desde la configuración
    $$('[data-tel]').forEach((a) => { a.href = 'tel:' + S.telefonoHref; if (a.hasAttribute('data-tel-text')) a.textContent = S.telefono; });
    $$('[data-wa]').forEach((a) => {
      if (!S.whatsapp) { a.hidden = true; return; }
      a.href = 'https://wa.me/' + S.whatsapp;
      a.target = '_blank'; a.rel = 'noopener';
    });
    $$('[data-direccion]').forEach((e) => (e.textContent = S.direccion));
    $$('[data-email]').forEach((a) => {
      if (!S.email) { (a.closest('li') || a).hidden = true; return; }
      a.href = 'mailto:' + S.email; a.textContent = S.email;
    });
    // La financiación va oculta en el HTML; solo aparece si está activada
    if (S.financiacion) $$('[data-financiacion]').forEach((e) => (e.hidden = false));

    // Datos legales (LSSI): si falta alguno se marca para completarlo
    $$('[data-legal]').forEach((e) => {
      const k = e.dataset.legal;
      const v = k === 'email' ? S.email : k === 'telefono' ? S.telefono : k === 'web' ? location.host : S.legal[k];
      if (v) e.textContent = v;
      else if (e.hasAttribute('data-keep')) return;
      else if (e.hasAttribute('data-optional')) (e.closest('[data-legal-row]') || e).hidden = true;
      else { e.textContent = '[pendiente de completar]'; e.classList.add('pendiente'); }
    });

    // Mapa: Google Maps (y sus cookies) no se carga hasta que el visitante lo pide
    $$('[data-map]').forEach((box) => {
      $('button', box).addEventListener('click', () => {
        const q = encodeURIComponent(S.nombre + ', ' + S.direccion.replace(/·/g, ','));
        box.innerHTML = `<iframe title="Mapa de ${esc(S.nombre)}" src="https://www.google.com/maps?q=${q}&output=embed" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
      });
    });
    const lugar = S.nombre + ', ' + S.direccion.replace(/·/g, ',');
    $$('[data-ruta]').forEach((a) => (a.href = 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(lugar)));
    // Enlaces opcionales (Milanuncios, Instagram, Facebook) y horario
    $$('[data-red]').forEach((li) => {
      const url = S[li.dataset.red];
      if (url) { li.hidden = false; $('a', li).href = url; }
    });
    $$('[data-horario-row]').forEach((row) => {
      if (!S.horario) return;
      row.hidden = false; $('[data-horario]', row).textContent = S.horario;
    });
    $$('[data-year]').forEach((e) => (e.textContent = new Date().getFullYear()));
    $$('[data-stock-count]').forEach((e) => (e.textContent = COCHES.length));
    $$('[data-precio-min]').forEach((e) => (e.textContent = eur(Math.min(...COCHES.map((c) => c.precio)))));

    // Marca la sección visible en el menú (solo en la portada)
    const links = $$('.nav a[href^="#"]');
    if (links.length && 'IntersectionObserver' in window) {
      const map = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          const a = map.get(en.target.id);
          if (a && en.isIntersecting) { links.forEach((l) => l.removeAttribute('aria-current')); a.setAttribute('aria-current', 'page'); }
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
    }
  }

  /* ---------- Tarjeta ---------- */
  function cardHTML(c, i = 0) {
    return `
    <article class="car" data-reveal style="--d:${(i % 3) * 0.08}s">
      <div class="car__media">
        <img src="${c.foto.sm}" alt="${esc(titulo(c) + ' ' + c.version)}" loading="lazy" decoding="async" referrerpolicy="no-referrer" width="545" height="409">
        <div class="car__badges"><span class="badge">${esc(c.carroceria)}</span></div>
        <span class="car__tag num">${eur(c.precio)}</span>
      </div>
      <div class="car__body">
        <h3 class="car__title"><a class="car__link" href="coches.html#${c.id}" data-ficha="${c.id}">${esc(titulo(c))}</a><small>${esc(c.version)}</small></h3>
        <div class="specs">
          <span>${ICON.cal}${c.anio}</span>
          <span>${ICON.km}${km(c.km)}</span>
          <span>${ICON.fuel}${esc(c.combustible)}</span>
        </div>
        <div class="car__foot">
          <span class="car__cuota"><b>Garantía</b> 12 meses</span>
          <span class="link-arrow" aria-hidden="true">Ver ficha</span>
        </div>
      </div>
    </article>`;
  }

  /* ---------- Ficha (modal) ---------- */
  let fichaDlg;
  function ensureDialogs() {
    if (fichaDlg) return;
    document.body.insertAdjacentHTML('beforeend', `
      <dialog class="modal" id="ficha" aria-labelledby="ficha-title">
        <button class="modal__close" type="button" aria-label="Cerrar" data-close>${ICON.close}</button>
        <div class="ficha"></div>
      </dialog>
      <dialog class="modal modal--sm" id="contacto" aria-labelledby="contacto-title">
        <button class="modal__close" type="button" aria-label="Cerrar" data-close>${ICON.close}</button>
        <form class="contacto" method="dialog"></form>
      </dialog>
      <div class="toast" role="status" aria-live="polite"></div>`);
    fichaDlg = $('#ficha');
    $$('dialog.modal').forEach((d) => {
      d.addEventListener('click', (e) => { if (e.target === d || e.target.closest('[data-close]')) d.close(); });
    });
    fichaDlg.addEventListener('close', () => {
      if (location.hash) history.replaceState(null, '', location.pathname + location.search);
    });
  }

  function openFicha(id) {
    const c = COCHES.find((x) => x.id === id);
    if (!c) return;
    ensureDialogs();
    const rows = [
      ['Año', c.anio], ['Kilómetros', km(c.km)], ['Combustible', c.combustible], ['Cambio', c.cambio],
      ['Potencia', c.cv ? c.cv + ' CV' : 'Consultar'], ['Carrocería', c.carroceria]
    ];
    $('.ficha', fichaDlg).innerHTML = `
      <div class="ficha__media" style="position:relative;user-select:none">
        <img id="ficha-main-img" src="${c.foto.lg}" alt="${esc(titulo(c))}" referrerpolicy="no-referrer">
        <button type="button" id="ficha-prev" aria-label="Foto anterior" style="display:none;position:absolute;left:12px;top:50%;transform:translateY(-50%);width:40px;height:40px;border-radius:50%;border:none;background:rgba(15,23,42,.75);color:#fff;font-size:22px;cursor:pointer;z-index:2">‹</button>
        <button type="button" id="ficha-next" aria-label="Siguiente foto" style="display:none;position:absolute;right:12px;top:50%;transform:translateY(-50%);width:40px;height:40px;border-radius:50%;border:none;background:rgba(15,23,42,.75);color:#fff;font-size:22px;cursor:pointer;z-index:2">›</button>
        <span id="ficha-counter" style="display:none;position:absolute;bottom:12px;right:12px;background:rgba(15,23,42,.78);color:#fff;padding:4px 10px;border-radius:999px;font-size:.82rem;font-weight:600;z-index:2">1 / 1</span>
      </div>
      <div class="ficha__body">
        <div>
          <span class="eyebrow">${esc(c.carroceria)} · ${c.anio}</span>
          <h3 id="ficha-title" style="font-size:2rem;margin-top:10px">${esc(titulo(c))}</h3>
          <p style="color:var(--muted);margin-top:4px">${esc(c.version)}</p>
        </div>
        <div class="ficha__price"><b class="num">${eur(c.precio)}</b><span>Precio final al contado</span></div>
        <p>${esc(c.nota)}</p>
        <dl class="ficha__table">${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
        <div class="ficha__actions">
          <button class="btn btn--accent" type="button" data-interesa="${c.id}">Me interesa este coche</button>
          <a class="btn btn--ghost" href="tel:${S.telefonoHref}">${ICON.phone} Llamar · ${S.telefono}</a>
        </div>
        <p class="ficha__fine">Garantía mínima de 12 meses según la Ley General para la Defensa de los Consumidores y Usuarios (RDL 1/2007). Datos según el anuncio; compruébalos con nosotros antes de la compra. Las fotos son del propio vehículo.</p>
      </div>`;

    const galeria = [c.foto.lg];
    let fotoIdx = 0;
    const imgEl = $('#ficha-main-img', fichaDlg);
    const prevBtn = $('#ficha-prev', fichaDlg);
    const nextBtn = $('#ficha-next', fichaDlg);
    const countEl = $('#ficha-counter', fichaDlg);
    const actualizarGaleria = () => {
      imgEl.src = galeria.at(fotoIdx);
      if (galeria.length > 1) {
        prevBtn.style.display = 'block';
        nextBtn.style.display = 'block';
        countEl.style.display = 'inline-block';
        countEl.textContent = (fotoIdx + 1) + ' / ' + galeria.length;
      }
    };
    prevBtn.onclick = () => { fotoIdx = (fotoIdx - 1 + galeria.length) % galeria.length; actualizarGaleria(); };
    nextBtn.onclick = () => { fotoIdx = (fotoIdx + 1) % galeria.length; actualizarGaleria(); };
    const buscarExtra = (num) => {
      if (num > 12) return;
      const url = 'img/coches/' + c.id + '-' + num + '.jpg';
      const test = new Image();
      test.onload = () => { galeria.push(url); actualizarGaleria(); buscarExtra(num + 1); };
      test.src = url;
    };
    buscarExtra(2);

    if (!fichaDlg.open) fichaDlg.showModal();
    if (location.pathname.endsWith('coches.html')) history.replaceState(null, '', '#' + c.id);
  }


  /* ---------- Contacto (modal) ---------- */
  function toast(msg) {
    ensureDialogs();
    const t = $('.toast'); t.textContent = msg; t.classList.add('is-on');
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('is-on'), 2600);
  }

  function openContacto(title, mensaje) {
    ensureDialogs();
    const dlg = $('#contacto');
    const form = $('form', dlg);
    form.innerHTML = `
      <h3 id="contacto-title">${esc(title)}</h3>
      <p style="color:var(--muted)">Revisa el mensaje. ${S.whatsapp ? 'Se abrirá WhatsApp con el texto listo para enviar.' : 'Llámanos y te atendemos, o copia el texto para enviarlo por donde prefieras.'}</p>
      <label class="field"><span>Mensaje</span><textarea class="input" name="msg" rows="7">${esc(mensaje)}</textarea></label>
      <div class="contacto__actions">
        ${S.whatsapp ? `<button class="btn btn--wa" type="button" data-act="wa">${ICON.wa} WhatsApp</button>` : `<a class="btn btn--accent" href="tel:${S.telefonoHref}">${ICON.phone} Llamar</a>`}
        <button class="btn btn--ghost" type="button" data-act="copy">Copiar mensaje</button>
      </div>
      <p class="form-note">Tus datos solo se usan para responderte y no se guardan en esta web. Más información en la <a href="privacidad.html">política de privacidad</a>.</p>`;
    form.onclick = async (e) => {
      const b = e.target.closest('[data-act]'); if (!b) return;
      const txt = form.msg.value.trim();
      if (b.dataset.act === 'wa') window.open('https://wa.me/' + S.whatsapp + '?text=' + encodeURIComponent(txt), '_blank', 'noopener');
      if (b.dataset.act === 'copy') {
        try { await navigator.clipboard.writeText(txt); toast('Mensaje copiado'); }
        catch (err) { form.msg.select(); toast('Selecciona y copia el texto'); }
      }
    };
    if (fichaDlg && fichaDlg.open) fichaDlg.close();
    dlg.showModal();
  }

  function initClicks() {
    document.addEventListener('keydown', (e) => {
      const f = e.target.closest('[role="button"][data-ficha]');
      if (f && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openFicha(f.dataset.ficha); }
    });
    document.addEventListener('click', (e) => {
      const f = e.target.closest('[data-ficha]');
      if (f) { e.preventDefault(); openFicha(f.dataset.ficha); return; }
      const card = e.target.closest('.car');
      if (card && !e.target.closest('a, button')) { const a = $('[data-ficha]', card); if (a) openFicha(a.dataset.ficha); return; }
      const i = e.target.closest('[data-interesa]');
      if (i) {
        const c = COCHES.find((x) => x.id === i.dataset.interesa);
        openContacto('Pedir información', `Hola, me interesa el ${titulo(c)} ${c.version} (${c.anio}, ${km(c.km)}) que tenéis a ${eur(c.precio)}.\n\n¿Sigue disponible? ¿Cuándo puedo pasar a verlo y probarlo?\n\nMi nombre: \nMi teléfono: `);
      }
    });
  }

  /* ---------- Portada: escaparate del hero ---------- */
  function initShowcase() {
    const root = $('.showcase'); if (!root) return;
    const list = [...COCHES].sort((a, b) => b.anio - a.anio).slice(0, 4);
    const img = $('img', root), cap = $('.showcase__caption', root), tag = $('.cartel', root), dots = $('.showcase__dots', root);
    let idx = 0, timer;
    dots.innerHTML = list.map((c, i) => `<button type="button" aria-label="Ver ${esc(titulo(c))}"></button>`).join('');
    const show = (i) => {
      idx = (i + list.length) % list.length;
      const c = list[idx];
      img.src = c.foto.lg; img.alt = titulo(c) + ' ' + c.version;
      cap.innerHTML = `<div><small>En stock · ${c.anio}</small><strong>${esc(titulo(c))} ${esc(c.version)}</strong></div><span class="link-arrow" style="color:#fff">Ver ficha</span>`;
      tag.innerHTML = `<small>${c.anio} · ${km(c.km)}</small><strong class="num">${eur(c.precio)}</strong>`;
      $('.showcase__frame', root).dataset.ficha = c.id;
      $$('button', dots).forEach((b, j) => b.setAttribute('aria-current', String(j === idx)));
    };
    const auto = () => { if (reduce) return; clearInterval(timer); timer = setInterval(() => show(idx + 1), 5000); };
    dots.addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; show($$('button', dots).indexOf(b)); auto(); });
    list.forEach((c) => { const p = new Image(); p.referrerPolicy = 'no-referrer'; p.src = c.foto.lg; });
    show(0); auto();
  }

  /* ---------- Portada: stock con filtros rápidos ---------- */
  function initStockPreview() {
    const grid = $('#stock-grid'); if (!grid) return;
    const filters = {
      todos: () => true,
      barato: (c) => c.precio <= 5000,
      diesel: (c) => c.combustible === 'Diésel',
      gasolina: (c) => c.combustible === 'Gasolina',
      industrial: (c) => c.tipo === 'industrial'
    };
    const render = (key) => {
      const list = COCHES.filter(filters[key]);
      grid.innerHTML = list.map(cardHTML).join('') || '<p>No hay coches con ese filtro ahora mismo.</p>';
      $$('[data-reveal]', grid).forEach((e) => e.classList.add('is-in'));
    };
    $('#stock-chips').addEventListener('click', (e) => {
      const b = e.target.closest('.chip'); if (!b) return;
      $$('#stock-chips .chip').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      render(b.dataset.f);
    });
    render('todos');
  }

  /* ---------- Buscador rápido ---------- */
  function fillMarcas(select) {
    const marcas = [...new Set(COCHES.map((c) => c.marca))].sort((a, b) => a.localeCompare(b, 'es'));
    select.insertAdjacentHTML('beforeend', marcas.map((m) => `<option value="${esc(m)}">${esc(m)} (${COCHES.filter((c) => c.marca === m).length})</option>`).join(''));
  }

  /* ---------- Calculadora de financiación ---------- */
  function initCalc() {
    const form = $('#calc'); if (!form) return;
    const sel = form.coche, precio = form.precio, entrada = form.entrada, plazo = form.plazo;
    sel.insertAdjacentHTML('beforeend', COCHES.map((c) => `<option value="${c.id}">${esc(titulo(c))} · ${eur(c.precio)}</option>`).join(''));
    const fill = (r) => r.style.setProperty('--fill', ((r.value - r.min) / (r.max - r.min)) * 100 + '%');
    const update = () => {
      if (+entrada.value > +precio.value) entrada.value = precio.value;
      entrada.max = precio.value;
      const P = precio.value - entrada.value, n = +plazo.value;
      const q = cuota(P, S.tin, n);
      $('#o-precio').textContent = eur(+precio.value);
      $('#o-entrada').textContent = eur(+entrada.value);
      $('#o-plazo').textContent = n + ' meses';
      $('#r-cuota').innerHTML = `${miles(q)} €<small>/mes</small>`;
      $('#r-financiado').textContent = eur(P);
      $('#r-total').textContent = eur(Math.round(q * n + +entrada.value));
      [precio, entrada, plazo].forEach(fill);
    };
    sel.addEventListener('change', () => {
      const c = COCHES.find((x) => x.id === sel.value);
      if (c) { precio.value = c.precio; entrada.value = Math.round(c.precio * 0.2 / 100) * 100; }
      update();
    });
    precio.addEventListener('input', () => { sel.value = ''; update(); });
    [entrada, plazo].forEach((r) => r.addEventListener('input', update));
    // Sin comisiones ni seguros la TAE es el TIN capitalizado mensualmente
    const tae = (Math.pow(1 + S.tin / 1200, 12) - 1) * 100;
    const pct = (v) => v.toFixed(2).replace('.', ',') + ' %';
    $('#calc-tin').textContent = pct(S.tin);
    $('#calc-tae').textContent = pct(tae);
    // Viene de la ficha de un coche: index.html?coche=<id>#financiacion
    const pre = params.get('coche');
    if (pre && COCHES.some((c) => c.id === pre)) { sel.value = pre; sel.dispatchEvent(new Event('change')); }
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const c = COCHES.find((x) => x.id === sel.value);
      const q = Math.round(cuota(precio.value - entrada.value, S.tin, +plazo.value));
      openContacto('Estudio de financiación', `Hola, quiero estudiar la financiación ${c ? 'del ' + titulo(c) + ' (' + eur(c.precio) + ')' : 'de un coche de ' + eur(+precio.value)}.\n\nEntrada: ${eur(+entrada.value)}\nPlazo: ${plazo.value} meses\nCuota calculada en la web: ~${q} €/mes\n\nMi nombre: \nMi teléfono: `);
    });
    update();
  }

  /* ---------- Tasación: vende tu coche ---------- */
  function initTasacion() {
    const form = $('#tasacion'); if (!form) return;
    const anio = form.anio, y = new Date().getFullYear();
    for (let a = y; a >= 1995; a--) anio.insertAdjacentHTML('beforeend', `<option>${a}</option>`);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const d = Object.fromEntries(new FormData(form));
      openContacto('Tasación de tu coche', `Hola, quiero que me taséis mi coche:\n\n· ${d.marca} ${d.modelo} (${d.anio})\n· ${miles(Number(d.km))} km · ${d.combustible}\n· Estado: ${d.estado}\n· ¿Lo dejo como parte de pago?: ${d.parte}\n\nMi nombre: ${d.nombre}\nMi teléfono: ${d.tel}`);
    });
  }

  /* ---------- Catálogo ---------- */
  function initCatalogo() {
    const grid = $('#catalog-grid'); if (!grid) return;
    const f = $('#filters');
    fillMarcas(f.marca);
    const anios = COCHES.map((c) => c.anio), precios = COCHES.map((c) => c.precio);
    const pMax = Math.ceil(Math.max(...precios) / 500) * 500;
    f.max.max = pMax; f.max.value = pMax;
    const minY = Math.min(...anios);
    for (let a = Math.max(...anios); a >= minY; a--) f.desde.insertAdjacentHTML('beforeend', `<option value="${a}">Desde ${a}</option>`);

    // Valores iniciales desde la URL (buscador de la portada)
    if (params.get('marca')) f.marca.value = params.get('marca');
    if (params.get('max')) f.max.value = Math.min(+params.get('max'), pMax);
    if (params.get('comb')) $$('input[name="comb"]', f).forEach((i) => (i.checked = i.value === params.get('comb')));

    const out = $('#o-max'), count = $('#catalog-count'), sort = $('#sort');
    const render = () => {
      const comb = (new FormData(f)).get('comb') || '';
      const tipo = (new FormData(f)).get('tipo') || '';
      let list = COCHES.filter((c) =>
        (!f.marca.value || c.marca === f.marca.value) &&
        c.precio <= +f.max.value &&
        (!comb || c.combustible === comb) &&
        (!tipo || c.tipo === tipo) &&
        (!f.desde.value || c.anio >= +f.desde.value) &&
        (!f.kmmax.value || (c.km != null && c.km <= +f.kmmax.value))
      );
      const s = sort.value;
      list.sort((a, b) => s === 'precio-asc' ? a.precio - b.precio : s === 'precio-desc' ? b.precio - a.precio : s === 'km' ? (a.km ?? 1e9) - (b.km ?? 1e9) : b.anio - a.anio);
      out.textContent = eur(+f.max.value);
      f.max.style.setProperty('--fill', ((f.max.value - f.max.min) / (f.max.max - f.max.min)) * 100 + '%');
      count.textContent = list.length === 1 ? '1 coche' : list.length + ' coches';
      grid.innerHTML = list.length ? list.map(cardHTML).join('') : `
        <div class="empty" style="grid-column:1/-1">
          <h3>Ahora mismo no tenemos ese coche</h3>
          <p style="color:var(--muted);max-width:44ch">El stock cambia cada semana. Dinos qué buscas y te avisamos cuando entre uno.</p>
          <button class="btn btn--accent" type="button" id="buscar-por-mi">Buscadme uno</button>
        </div>`;
      $$('[data-reveal]', grid).forEach((e, i) => setTimeout(() => e.classList.add('is-in'), 40 * i));
    };
    f.addEventListener('input', render);
    f.addEventListener('reset', () => setTimeout(render));
    sort.addEventListener('change', render);
    grid.addEventListener('click', (e) => {
      if (!e.target.closest('#buscar-por-mi')) return;
      openContacto('Buscamos tu coche', `Hola, estoy buscando un coche${f.marca.value ? ' ' + f.marca.value : ''} de hasta ${eur(+f.max.value)}.\n\nLo quiero para: \nMi nombre: \nMi teléfono: `);
    });
    $('.filters-toggle').addEventListener('click', (e) => {
      const open = f.classList.toggle('is-open');
      e.currentTarget.setAttribute('aria-expanded', String(open));
    });
    render();
    if (location.hash) openFicha(location.hash.slice(1));
  }

  document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initClicks();
    initShowcase();
    initStockPreview();
    const q = $('#quick-marca'); if (q) fillMarcas(q);
    initCalc();
    initTasacion();
    initCatalogo();
    initReveal();
  });
})();
