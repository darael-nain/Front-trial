// ══════════════════════════════════════════════════════════════
// COMPROBANTES LISTA — Motor completo
// Patrón: unaBase.toolbox.search.newInit (autónomo)
// ══════════════════════════════════════════════════════════════

'use strict';

unaBase.ui.block();

// ══════════════════════════════════════════════════════════════
// UTILS
// ══════════════════════════════════════════════════════════════
const safeStr = v => (v == null ? '' : String(v));
const safeNum = v => {
    const n = Number(safeStr(v).replace(/\./g, '').replace(',', '.'));
    return Number.isFinite(n) ? n : 0;
};
const esc = v => safeStr(v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');

const fmtCLP = n =>
    '$' + Math.round(Number(n) || 0).toLocaleString('es-CL');

const parseDate = s => {
    const str = safeStr(s).trim();
    if (str.length < 8) return null;
    const sep = str.includes('-') ? '-' : '/';
    const [d, m, y] = str.split(sep).map(Number);
    if (!d || !m || !y) return null;
    const dt = new Date(y, m - 1, d);
    if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) return null;
    dt.setHours(0, 0, 0, 0);
    return dt;
};

const diffDays = (a, b) =>
    (a instanceof Date && b instanceof Date)
        ? Math.round((b - a) / 86400000) : 0;

const animateNum = (id, target, suffix = '') => {
    const el = document.getElementById(id);
    if (!el) return;
    const start = performance.now();
    const dur = 650;
    const tick = now => {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * ease) + suffix;
        if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
};

// ══════════════════════════════════════════════════════════════
// KPI
// ══════════════════════════════════════════════════════════════
const updateKPIs = rows => {
    if (!Array.isArray(rows)) return;

    let conciliados = 0, descuadrados = 0, auto = 0;
    let ingresos = 0, egresos = 0, traspasos = 0;
    let sumDias = 0, cntDias = 0;

    rows.forEach(r => {
        if (r.conciliado === true || safeStr(r.conciliado) === '1') conciliados++;
        if (r.ok === false || safeStr(r.ok) === 'false') descuadrados++;
        if (r.auto === true || safeStr(r.auto) === '1') auto++;

        const tipo = safeStr(r.docType).toLowerCase();
        if (tipo === 'ingreso') ingresos++;
        else if (tipo === 'egreso') egresos++;
        else if (tipo === 'traspaso') traspasos++;

        const a = parseDate(r.docDate), b = parseDate(r.registryDate);
        if (a && b) { sumDias += Math.max(0, diffDays(a, b)); cntDias++; }
    });

    const total = rows.length;
    const pct = total > 0 ? Math.round(conciliados / total * 100) : 0;
    const prom = cntDias > 0 ? (sumDias / cntDias).toFixed(1) : '0.0';

    animateNum('kpi-count', total);
    animateNum('kpi-conciliados', conciliados);
    animateNum('kpi-no-conciliados', total - conciliados);
    animateNum('kpi-descuadrados', descuadrados);
    animateNum('kpi-auto', auto);

    const bar = document.getElementById('kpi-progress-bar');
    const pctEl = document.getElementById('kpi-progress-pct');
    if (bar) bar.style.width = pct + '%';
    if (pctEl) pctEl.textContent = pct + '%';

    const tipEl = document.getElementById('kpi-tipos');
    if (tipEl) tipEl.textContent = `${ingresos} / ${egresos} / ${traspasos}`;

    const antEl = document.getElementById('kpi-antiguedad');
    if (antEl) antEl.textContent = prom + ' días';

    const dCard = document.getElementById('kpi-descuadrados-card');
    if (dCard) dCard.classList.toggle('kpi-alert', descuadrados > 0);
};

// ══════════════════════════════════════════════════════════════
// TOOLTIP — Panel flotante del asiento contable
// Diseño propio (sin tooltipster) para máximo control
// ══════════════════════════════════════════════════════════════
const _cache = {};   // id → data
const _flying = {};   // id → promise en vuelo

// Panel singleton
let _panel = null;
let _panelTarget = null;
let _hideTimer = null;

const getPanel = () => {
    if (!_panel) {
        _panel = document.createElement('div');
        _panel.id = 'cp-preview-panel';
        _panel.className = 'cp-panel';
        _panel.style.display = 'none';
        document.body.appendChild(_panel);

        // Mantener abierto si el mouse entra al panel
        _panel.addEventListener('mouseenter', () => clearTimeout(_hideTimer));
        _panel.addEventListener('mouseleave', () => {
            _hideTimer = setTimeout(hidePanel, 180);
        });
    }
    return _panel;
};

const showPanel = (anchorEl, html) => {
    clearTimeout(_hideTimer);
    const panel = getPanel();
    panel.innerHTML = html;
    panel.style.display = 'block';
    panel.style.opacity = '0';
    panel.style.transform = 'translateY(6px) scale(0.97)';

    // Posicionar
    const rect = anchorEl.getBoundingClientRect();
    const pw = 480;
    let left = rect.right + 10;
    if (left + pw > window.innerWidth - 12) left = rect.left - pw - 10;
    let top = rect.top - 10;
    if (top + 400 > window.innerHeight) top = window.innerHeight - 420;

    panel.style.left = left + 'px';
    panel.style.top = Math.max(10, top) + 'px';
    panel.style.width = pw + 'px';

    requestAnimationFrame(() => {
        panel.style.opacity = '1';
        panel.style.transform = 'translateY(0) scale(1)';
    });
};

const hidePanel = () => {
    const panel = getPanel();
    panel.style.opacity = '0';
    panel.style.transform = 'translateY(4px) scale(0.97)';
    setTimeout(() => { if (panel.style.opacity === '0') panel.style.display = 'none'; }, 200);
};

// HTML del panel de carga
const skeletonHtml = id => `
  <div class="cp-panel-header">
    <div class="cp-panel-actions">
      <button class="cp-action-btn js-download-dtc" data-id="${id}">
        <i class="fas fa-download"></i> Descargar
      </button>
      <button class="cp-action-btn cp-action-view js-view-adjunto" data-id="${id}">
        <i class="fas fa-eye"></i> Ver adjunto
      </button>
    </div>
  </div>
  <div class="cp-skeleton">
    <div class="cp-skel-line w80"></div>
    <div class="cp-skel-line w50"></div>
    <div class="cp-skel-grid">
      <div class="cp-skel-box"></div>
      <div class="cp-skel-box"></div>
      <div class="cp-skel-box"></div>
    </div>
    <div class="cp-skel-line w100"></div>
    <div class="cp-skel-line w90"></div>
    <div class="cp-skel-line w70"></div>
  </div>`;

// HTML del panel con datos reales
const buildPanelHtml = (data, id) => {
    data = data || {};
    const isOk = data.ok === true || safeStr(data.ok) === 'true';
    const conciliado = data.conciliado === true || safeStr(data.conciliado) === '1';
    const tipo = safeStr(data.docType).toUpperCase() || 'N/A';
    const debe = safeNum(data.debe);
    const haber = safeNum(data.haber);
    const diff = debe - haber;
    const details = Array.isArray(data.details) ? data.details : [];

    const rowsHtml = details.length
        ? details.map(d => {
            const cuenta = esc(d.cuentaContable || '-');
            const codigo = esc(d.codigoCuenta || '');
            const aux = esc(d.auxiliar_desc || '');
            const db = safeNum(d.debe);
            const ha = safeNum(d.haber);
            return `
          <tr class="cp-detail-row">
            <td class="cp-td-cuenta">
              <span class="cp-cuenta-name">${cuenta}</span>
              ${codigo ? `<span class="cp-cuenta-meta">${codigo}${aux ? ' · ' + aux : ''}</span>` : ''}
            </td>
            <td class="cp-td-num ${db ? 'cp-debe-val' : ''}">${db ? fmtCLP(db) : '—'}</td>
            <td class="cp-td-num ${ha ? 'cp-haber-val' : ''}">${ha ? fmtCLP(ha) : '—'}</td>
          </tr>`;
        }).join('')
        : `<tr><td colspan="3" class="cp-no-detail">Sin detalle disponible</td></tr>`;

    const diffClass = Math.abs(diff) < 1 ? 'cp-diff-ok' : 'cp-diff-err';
    const diffLabel = Math.abs(diff) < 1 ? 'Cuadrado' : `Diff: ${fmtCLP(Math.abs(diff))}`;

    return `
    <div class="cp-panel-header">
      <div class="cp-panel-title">
        <span class="cp-badge-tipo cp-tipo-${safeStr(data.docType).toLowerCase()}">${tipo}</span>
        <div class="cp-header-info">
          <span class="cp-asiento-id">Asiento #${esc(id)}</span>
          <span class="cp-asiento-desc">${esc(data.description || '—')}</span>
        </div>
      </div>
      <div class="cp-panel-actions">
        <button class="cp-action-btn js-download-dtc" data-id="${id}">
          <i class="fas fa-download"></i>
        </button>
        <button class="cp-action-btn cp-action-view js-view-adjunto" data-id="${id}">
          <i class="fas fa-eye"></i>
        </button>
      </div>
    </div>

    <div class="cp-panel-meta">
      <div class="cp-meta-chip">
        <span class="cp-meta-label">Fecha doc</span>
        <span class="cp-meta-val">${esc(data.docDate || '—')}</span>
      </div>
      <div class="cp-meta-chip">
        <span class="cp-meta-label">Fecha reg.</span>
        <span class="cp-meta-val">${esc(data.registryDate || '—')}</span>
      </div>
      <div class="cp-meta-chip ${conciliado ? 'cp-chip-ok' : 'cp-chip-warn'}">
        <span class="cp-meta-label">Conciliado</span>
        <span class="cp-meta-val">${conciliado ? 'Sí' : 'No'}</span>
      </div>
    </div>

    <div class="cp-panel-totals">
      <div class="cp-total-block cp-total-debe">
        <span class="cp-total-label">Debe</span>
        <span class="cp-total-val">${fmtCLP(debe)}</span>
      </div>
      <div class="cp-total-sep"></div>
      <div class="cp-total-block cp-total-haber">
        <span class="cp-total-label">Haber</span>
        <span class="cp-total-val">${fmtCLP(haber)}</span>
      </div>
      <div class="cp-total-sep"></div>
      <div class="cp-total-block">
        <span class="cp-total-label">Diferencia</span>
        <span class="cp-total-val ${diffClass}">${diffLabel}</span>
      </div>
    </div>

    <div class="cp-panel-detail">
      <div class="cp-detail-header">
        <span class="cp-detail-title">Detalle del asiento</span>
        <span class="cp-detail-count">${details.length} línea${details.length !== 1 ? 's' : ''}</span>
      </div>
      <div class="cp-detail-scroll">
        <table class="cp-detail-table">
          <thead>
            <tr>
              <th class="cp-th-cuenta">Cuenta</th>
              <th class="cp-th-num">Debe</th>
              <th class="cp-th-num">Haber</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>
    </div>`;
};

// Cargar datos y mostrar panel
const loadPreview = (anchorEl, id) => {
    if (!id) return;

    showPanel(anchorEl, skeletonHtml(id));
    _panelTarget = anchorEl;

    if (_cache[id]) {
        showPanel(anchorEl, buildPanelHtml(_cache[id], id));
        return;
    }

    if (_flying[id]) return;

    _flying[id] = $.ajax({
        url: '/4DACTION/_V3_proxy_getComprobante',
        method: 'GET',
        dataType: 'json',
        data: { id },
    })
        .done(resp => {
            _cache[id] = resp || {};
            if (_panelTarget === anchorEl) showPanel(anchorEl, buildPanelHtml(_cache[id], id));
        })
        .fail(() => {
            if (_panelTarget === anchorEl) showPanel(anchorEl, `
        <div class="cp-panel-header">
          <div class="cp-panel-actions">
            <button class="cp-action-btn js-download-dtc" data-id="${id}"><i class="fas fa-download"></i></button>
          </div>
        </div>
        <div class="cp-error-msg"><i class="fas fa-exclamation-circle"></i> No se pudo cargar el asiento.</div>`);
        })
        .always(() => { delete _flying[id]; });
};

// ══════════════════════════════════════════════════════════════
// ROW HTML
// ══════════════════════════════════════════════════════════════
const buildRowHtml = (i, rows) => {
    const r = rows[i] || {};

    const esConciliado = r.conciliado === true || safeStr(r.conciliado) === '1';
    const esOk = r.ok !== false && safeStr(r.ok) !== 'false';
    const tipo = safeStr(r.docType).toLowerCase();

    let rowClass = 'cp-row';
    if (tipo === 'ingreso') rowClass += ' cp-row-ingreso';
    if (tipo === 'egreso') rowClass += ' cp-row-egreso';
    if (tipo === 'traspaso') rowClass += ' cp-row-traspaso';
    if (!esOk) rowClass += ' cp-row-descuadrado';

    const conciliadoHtml = tipo !== 'traspaso'
        ? `<span class="cp-badge ${esConciliado ? 'cp-badge-si' : 'cp-badge-no'}">
         ${esConciliado ? 'Sí' : 'No'}
       </span>`
        : '<span class="cp-badge cp-badge-na">—</span>';

    const tipoHtml = `<span class="cp-tipo cp-tipo-${tipo}">${safeStr(r.docType).toUpperCase() || '—'}</span>`;

    return `
    <tr class="${rowClass}" data-id="${esc(r.id)}">
      <td class="col-eye">
        <span class="cp-eye-btn js-preview-trigger"
          data-id="${esc(r.id)}"
          title="Ver asiento contable">
          <i class="fas fa-receipt"></i>
        </span>
      </td>
      <td class="col-num"><span class="cp-num">${esc(r.id)}</span></td>
      <td class="col-date"><span class="cp-date">${esc(r.registryDate)}</span></td>
      <td class="col-date"><span class="cp-date">${esc(r.docDate)}</span></td>
      <td class="col-desc"><span class="cp-desc" title="${esc(r.description)}">${esc(r.description)}</span></td>
      <td class="col-tipo">${tipoHtml}</td>
      <td class="col-conc">${conciliadoHtml}</td>
    </tr>`;
};

// ══════════════════════════════════════════════════════════════
// RESULT COUNT
// ══════════════════════════════════════════════════════════════
const updateResultCount = () => {
    const count = $('table.results tbody tr').length;
    $('#result-count').text(`${count} comprobante${count !== 1 ? 's' : ''}`);
};

// ══════════════════════════════════════════════════════════════
// MAIN INIT
// ══════════════════════════════════════════════════════════════
$(document).ready(function () {

    const params = {
        searchOff: true,
        url: () => '/4DACTION/_v3_getComprobantes',
        entity: 'Dtc',

        callback(data) {
            if (data?.rows) updateKPIs(data.rows);
            updateResultCount();
            unaBase.ui.unblock();
        },

        row: {
            html: (i, rows) => buildRowHtml(i, rows),
        },

        detail: {
            url: id => `/v3/views/comprobantes/content.shtml?id=${id}`,
            iframe: false,
        },

        inflection: {
            singular: 'Comprobante',
            plural: 'Comprobantes',
            none: 'ningún',
        },

        filters: [
            { name: 'docDate', type: 'month', caption: 'Fecha comprobante', range: true, currentMonth: true },
            { name: 'registryDate', type: 'month', caption: 'Fecha de registro', range: true, currentMonth: false },
            {
                name: 'docType', type: 'autocomplete', caption: 'Tipo',
                dataObject: [
                    { id: 'egreso', text: 'Egreso' },
                    { id: 'traspaso', text: 'Traspaso' },
                    { id: 'ingreso', text: 'Ingreso' },
                ],
            },
            {
                name: 'estado', type: 'checkbox', caption: 'Estado',
                options: [
                    { caption: 'Activo', name: 'activo', value: true },
                    { caption: 'Inactivo', name: 'inactivo', value: false },
                ],
            },
            {
                name: 'automatico', type: 'checkbox', caption: 'Origen',
                options: [
                    { caption: 'Automático', name: 'auto_', value: true },
                    { caption: 'Manual', name: 'manual_', value: false },
                ],
            },
            {
                name: 'descuadrado', type: 'checkbox', caption: 'Cuadratura',
                options: [
                    { caption: 'Descuadrado', name: 'desc_', value: false },
                ],
            },
        ],
    };

    unaBase.toolbox.search.newInit(params);

    unaBase.toolbox.menu.init({
        entity: 'Dtc',
        buttons: ['searchOff', "new", "accounting_libro_diario", "accounting_libro_mayor", "export_list", 'accounting_balance',"close_accounting_period", "open_accounting_period", "create_accounting_period", "status_accounting_period", "import_remunerations", "import_seats","accounting_lib_cont", "accounting_lib_cont1", "analysis_by_account","accounting_crete_opening",'export_diot', 'auxiliar_report', 'accounting_provision', 'foliador_hojas', 'Importar apertura', 'accounting_create_opening', 'import_seats_provisiones'],
    });

    // ── Preview panel — hover sobre el ojo ───────────────────
    $(document)
        .off('mouseenter.cp-prev', '.js-preview-trigger')
        .on('mouseenter.cp-prev', '.js-preview-trigger', function () {
            clearTimeout(_hideTimer);
            const id = $(this).data('id');
            if (id) loadPreview(this, id);
        })
        .off('mouseleave.cp-prev', '.js-preview-trigger')
        .on('mouseleave.cp-prev', '.js-preview-trigger', function () {
            _hideTimer = setTimeout(hidePanel, 250);
        });

    // ── Acciones dentro del panel ─────────────────────────────
    $(document)
        .off('click.cp-download', '.js-download-dtc')
        .on('click.cp-download', '.js-download-dtc', function (e) {
            e.preventDefault(); e.stopPropagation();
            const id = $(this).data('id');
            if (typeof downloadDTC === 'function') downloadDTC(id);
        })
        .off('click.cp-view', '.js-view-adjunto')
        .on('click.cp-view', '.js-view-adjunto', function (e) {
            e.preventDefault(); e.stopPropagation();
            const id = $(this).data('id');
            if (typeof viewAdjunto === 'function') viewAdjunto(id);
        });

    // ── Click fila → detalle ──────────────────────────────────
    $(document)
        .off('click.cp-goto', '.cp-row td:not(.col-eye)')
        .on('click.cp-goto', '.cp-row td:not(.col-eye)', function () {
            const id = $(this).closest('tr').data('id');
            if (id) unaBase.loadInto.viewport(`/v3/views/comprobantes/content.shtml?id=${id}`);
        });

    // ── Cerrar panel al hacer click fuera ────────────────────
    $(document).on('click.cp-outside', e => {
        if (_panel && !_panel.contains(e.target) && !$(e.target).hasClass('js-preview-trigger')) {
            hidePanel();
        }
    });

    document.title = `${nombreEmpresa} / Comprobantes`;
});