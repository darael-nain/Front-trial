// ══════════════════════════════════════════════
// DTC LISTA — Lógica completa
// ══════════════════════════════════════════════

var mostrar_por_revisar = typeof _mostrar_por_revisar !== 'undefined' ? _mostrar_por_revisar : false;
var elegidos = [];
var clase = "idem1";

unaBase.ui.block();

// ── KPI STATE ──────────────────────────────────
var kpiState = {
  total: 0, porPagar: 0, pagado: 0,
  vencidos: 0, count: 0
};

// ── HELPERS ────────────────────────────────────
const selectedSum = function () {
  var finalValue = 0;
  var target = $("table.listpayout").find("input.selected.each:checked");
  target.each(function () {
    finalValue += parseFloat($(this).data("saldo"));
  });
  $('.totalseleccionado span').html(currency.symbol + " <strong>" + finalValue + "</strong>");
  $('span.numeric.currency > strong').number(true, 0, ',', '.');
};

const fmtKpi = (n) => {
  const abs = Math.abs(n);
  let s;
  if (abs >= 1e9)      s = '$' + (abs / 1e9).toFixed(1) + 'B';
  else if (abs >= 1e6) s = '$' + (abs / 1e6).toFixed(1) + 'M';
  else if (abs >= 1e3) s = '$' + (abs / 1e3).toFixed(0) + 'K';
  else                 s = '$' + Math.round(abs).toLocaleString('es-CL');
  return n < 0 ? '-' + s : s;
};

// ── KPI UPDATE ─────────────────────────────────
const updateKPIs = (rows) => {
  let total = 0, porPagar = 0, pagado = 0, vencidos = 0;
  const hoy = new Date(); hoy.setHours(0,0,0,0);

  rows.forEach(row => {
    const saldo = parseFloat(row.saldo_) || 0;
    const abono = parseFloat(row.abono_) || 0;
    const tot   = parseFloat(row.total_) || 0;

    total   += tot;
    porPagar += saldo;
    pagado  += abono;

    // Vencimiento
    let vd = row.vencimiento || '';
    if (vd.length === 10) {
      const vDay = parseInt(vd.substring(0,2));
      const vMon = parseInt(vd.substring(3,5));
      const vYr  = parseInt(vd.substring(6,10));
      const vDate = new Date(vYr, vMon-1, vDay);
      if (vDate < hoy && row.estado !== 'PAGADO' && row.estado !== 'NULO') vencidos++;
    }
  });

  animateNumber('kpi-total',    total);
  animateNumber('kpi-porpagar', porPagar);
  animateNumber('kpi-pagado',   pagado);

  document.getElementById('kpi-vencidos').textContent = vencidos;
  document.getElementById('kpi-count').textContent    = rows.length;

  // Barra de cobro
  const pct = total > 0 ? Math.round((pagado / total) * 100) : 0;
  const bar = document.getElementById('kpi-progress-bar');
  if (bar) { bar.style.width = pct + '%'; }
  const pctEl = document.getElementById('kpi-progress-pct');
  if (pctEl) pctEl.textContent = pct + '%';

  // Color kpi vencidos
  const kpiVencCard = document.getElementById('kpi-vencidos-card');
  if (kpiVencCard) {
    kpiVencCard.classList.toggle('kpi-alert', vencidos > 0);
  }
};

// Animación de número al cargar
const animateNumber = (id, target) => {
  const el = document.getElementById(id);
  if (!el) return;
  const start = 0;
  const duration = 700;
  const startTime = performance.now();

  const tick = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = fmtKpi(start + (target - start) * ease);
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = fmtKpi(target);
  };
  requestAnimationFrame(tick);
};

// ── DOWNLOAD / VIEW ───────────────────────────
const downloadDTC = (id) => {
  $.ajax({
    url: '/4DACTION/_V3_proxy_getDtcContent',
    data: { id, api: true },
    dataType: 'json',
    async: false,
    success: function (data) {
      var url = data.urlCargaLista;
      if (!data.isLibroBoleta) {
        url = nodeUrl + "/download-pdf-dtc/?download=true&entity=conexion_sii" +
          "&id=" + data.idCargaLista + "&folio=" + data.folio +
          "&sid=" + unaBase.sid.encoded() + "&hostname=" + window.location.origin;
      }
      var download = window.open(url);
      download.blur(); window.focus();
    }
  });
};

const viewAdjunto = (id) => {
  let flag = true;
  $.ajax({
    url: '/4DACTION/_V3_getUpload',
    data: { index: "Doc_Tributario_Compra|" + id },
    dataType: 'json', async: false,
    success: function (data) {
      if (data == null) { toastr.warning("No hay archivo adjunto asociado"); flag = false; }
    }
  });
  if (flag) {
    unaBase.loadInto.dialog(
      `/4DACTION/_V3_getUpload?index=Doc_Tributario_Compra|${id}`,
      'Archivo adjunto', 'large', true
    );
  }
};

// ── TOOLTIP ───────────────────────────────────
var loadTooltips = function (target, id) {
  var tooltipHtml = $(`<div class='dtc-tooltip-inner'>
    <div class='dtc-tip-row'>
      <button class='dtc-tip-btn' id="downloadDTC" title="Descargar documento">
        <i class="fas fa-download"></i><span>Descargar</span>
      </button>
      <button class='dtc-tip-btn' id="viewAdjunto" title="Ver adjunto">
        <i class="fas fa-eye"></i><span>Ver adjunto</span>
      </button>
    </div>
  </div>`);
  tooltipHtml.find('#downloadDTC').click(() => downloadDTC(id));
  tooltipHtml.find('#viewAdjunto').click(() => viewAdjunto(id));
  target.tooltipster('update', tooltipHtml);
};

// ── ROW HTML ──────────────────────────────────
const buildRowHtml = (i, rows) => {
  const r = rows[i];

  // Fechas
  const parseDate = (str) => {
    if (!str || str.length < 10) return null;
    return new Date(
      parseInt(str.substring(6,10)),
      parseInt(str.substring(3,5)) - 1,
      parseInt(str.substring(0,2))
    );
  };

  const hoy = new Date(); hoy.setHours(0,0,0,0);
  const venc_date = parseDate(r.vencimiento);
  const diasVenc  = venc_date ? Math.ceil((venc_date - hoy) / 86400000) : null;
  const esVencido   = venc_date && venc_date < hoy;
  const esPorVencer = venc_date && !esVencido && diasVenc <= 7;
  const esNulo      = r.estado === "NULO";

  // Estado badge
  const estadoMap = {
    'PAGADO':      'badge-pagado',
    'POR PAGAR':   'badge-porpagar',
    'POR REVISAR': 'badge-porrevisar',
    'POR ASIGNAR': 'badge-porasignar',
    'EMITIDA':     'badge-emitida',
    'NULO':        'badge-nulo',
  };
  const estadoClass = estadoMap[r.estado] || 'badge-default';
  const estadoBadge = `<span class="dtc-badge ${estadoClass}">${r.estado}</span>`;

  // Vencimiento badge
  let vencBadge = '';
  if (esVencido) vencBadge = `<span class="dtc-venc-badge venc-vencido">Venc. ${Math.abs(diasVenc)}d</span>`;
  else if (esPorVencer) vencBadge = `<span class="dtc-venc-badge venc-pronto">${diasVenc}d</span>`;

  // Montos
  const fmt = (n) => currency.symbol + " " + $.number(n, currency.decimals, currency.decimals_sep, currency.thousands_sep);
  let afeDTC = fmt(r.afecto_), exeDTC = fmt(r.exento_),
      impDTC = fmt(r.impuesto_), totDTC = fmt(r.total_),
      aboDTC = fmt(r.abono_),   salDTC = fmt(r.saldo_);

  if (r.moneda && r.moneda !== currency.code) {
    const vc = r.valor_cambio || 1;
    const sym = r.moneda;
    const fc = (n) => sym + " " + $.number(n/vc, currency.decimals, currency.decimals_sep, currency.thousands_sep);
    afeDTC = fc(r.afecto_); exeDTC = fc(r.exento_); impDTC = fc(r.impuesto_);
    totDTC = fc(r.total_);  aboDTC = fc(r.abono_);  salDTC = fc(r.saldo_);
  }

  // Row class
  let rowClass = 'dtc-row unselectable';
  if (esNulo)      rowClass += ' row-nulo';
  else if (esVencido)    rowClass += ' row-vencido';
  else if (esPorVencer)  rowClass += ' row-por-vencer';

  // Avatar color por inicial
  const avatarColors = {
    'A':'#ef4444','B':'#f59e0b','C':'#10b981','D':'#3b82f6',
    'E':'#8b5cf6','F':'#ec4899','G':'#14b8a6','H':'#f97316',
    'I':'#6366f1','J':'#84cc16','K':'#06b6d4','L':'#e11d48',
    'M':'#d97706','N':'#059669','O':'#7c3aed','P':'#dc2626',
    'Q':'#2563eb','R':'#16a34a','S':'#0891b2','T':'#9333ea',
    'U':'#db2777','V':'#ca8a04','W':'#0d9488','X':'#4f46e5',
    'Y':'#65a30d','Z':'#0284c7'
  };
  const inicial = (r.proveedor || 'X').charAt(0).toUpperCase();
  const avatarColor = avatarColors[inicial] || '#1dba8e';

  return `
    <tr class="${rowClass}"
      data-estado="${r.estado}"
      data-oc="${r.foliooc}"
      data-id="${r.id}"
      ${r.contabilizado ? 'data-contabilizado="true"' : ""}
      data-tp="${r.pago_desde_oc}"
      data-oc="${r.idoc}"
      data-tgasto="${r.oc_tipogasto}"
      data-ndoc="${r.doc}"
      data-doc="${r.id_doc}"
      data-idpro="${r.idproveedor}"
      data-libro="${r.libro}">

      <td class="col-check">
        <input class="dtc-check each selected" data-saldo="${r.saldo_}" type="checkbox" name="selected_one">
      </td>
      <td class="col-info tooltipsnv">
        <span class="info-dot"><i class="fas fa-circle-info"></i></span>
      </td>
      <td class="col-num" data-goto="true">
        <span class="doc-number">${r.numero}</span>
      </td>
      <td class="col-doc" data-goto="true" title="${r.doc}">
        <span class="doc-type-chip">${r.doc_abrv}</span>
      </td>
      <td class="col-cod" data-goto="true">
        <span class="mono-text">${r.param4}</span>
      </td>
      <td class="col-fpago" data-goto="true">
        <span class="fpago-text" title="${r.formapago}">${r.formapago}</span>
      </td>
      <td class="col-oc" data-goto="true">
        ${r.foliooc
          ? `<span class="oc-badge">${r.foliooc}</span>`
          : '<span class="empty-dash">—</span>'}
      </td>
      <td class="col-fecha" data-goto="true">
        <span class="fecha-text">${r.emision}</span>
      </td>
      <td class="col-fecha" data-goto="true">
        <span class="fecha-text">${r.recepcion}</span>
      </td>
      <td class="col-fecha col-venc" data-goto="true">
        <div class="venc-wrap">
          <span class="fecha-text ${esVencido ? 'text-vencido' : esPorVencer ? 'text-pronto' : ''}">${r.vencimiento}</span>
          ${vencBadge}
        </div>
      </td>
      <td class="col-fecha" data-goto="true">
        <span class="fecha-text">${r.contable === "00-00-00" ? '<span class="empty-dash">N/A</span>' : r.contable}</span>
      </td>
      <td class="col-estado" data-goto="true">
        ${estadoBadge}
      </td>
      <td class="col-proveedor" data-goto="true">
        <div class="proveedor-wrap">
          <span class="proveedor-avatar" >${inicial}</span>
          <span class="proveedor-name" title="${r.proveedor}">${r.proveedor}</span>
        </div>
      </td>
      <td class="col-rut" data-goto="true">
        <span class="mono-text rut-text">${r.rut}</span>
      </td>
      <td class="col-money" data-goto="true" data-total="${r.afecto_}">
        <span class="money-text">${afeDTC}</span>
      </td>
      <td class="col-money" data-goto="true" data-total="${r.exento_}">
        <span class="money-text">${exeDTC}</span>
      </td>
      <td class="col-money" data-goto="true" data-total="${r.impuesto_}">
        <span class="money-text">${impDTC}</span>
      </td>
      <td class="col-money col-total" data-goto="true" data-total="${r.total_}">
        <span class="money-text total-text">${totDTC}</span>
      </td>
      <td class="col-money" data-goto="true" data-total="${r.abono_}">
        <span class="money-text abono-text">${aboDTC}</span>
      </td>
      <td class="col-money col-saldo" data-goto="true" data-total="${r.saldo_}">
        <span class="money-text saldo-text">${salDTC}</span>
      </td>
    </tr>`;
};

// ── MAIN INIT ─────────────────────────────────
$(document).ready(function () {
  $('.country-label-rut').text(country.label_rut);

  // ── PARAMS ──
  var params = {
    searchOff: true,
    url: function () { return '/4DACTION/_V3_getDtc'; },
    entity: 'Dtc',
    callback: function (data) {
      // Tooltips
      var content = "";
      $('td.tooltipsnv').tooltipster({
        content, contentAsHTML: true, contentCloning: false,
        interactive: true, maxWidth: 800, multiple: true
      });
      $('td.tooltipsnv').on('hover', function () {
        loadTooltips($(this), $(this).closest('tr').data('id'));
      });

      // Orden numérico columna NÚMERO
      setTimeout(function () {
        $('th[data-sort-by="numero"]').off('click').on('click', function (e) {
          e.preventDefault(); e.stopPropagation();
          var $h = $(this);
          var newOrder = $h.data('sort-order') === 'asc' ? 'desc' : 'asc';
          $('th[data-sort-by]').removeClass('sort-order-asc sort-order-desc').removeData('sort-order');
          $h.addClass('sort-order-' + newOrder).data('sort-order', newOrder);
          var $rows = $('table.results tbody tr').toArray();
          $rows.sort((a, b) => {
            var na = parseInt($(a).find('td:eq(2)').text().trim()) || 0;
            var nb = parseInt($(b).find('td:eq(2)').text().trim()) || 0;
            return newOrder === 'asc' ? na - nb : nb - na;
          });
          $('table.results tbody').empty().append($rows);
          selectedSum();
        });
      }, 1000);

      // KPIs y contador
      if (data && data.rows) updateKPIs(data.rows);
      updateResultCount();
      unaBase.ui.unblock();
    },

    row: {
      html: function (i, rows) { return buildRowHtml(i, rows); }
    },

    inflection: { singular: 'Documento', plural: 'Documentos', none: 'ninguna' },

    filters: [
      { name: 'created_at',        type: 'month',      caption: 'Fecha de emisión',         range: true, currentMonth: true  },
      { name: 'received_at',       type: 'month',      caption: 'Fecha de recepción',        range: true, currentMonth: false },
      { name: 'contabilizado_at',  type: 'month',      caption: 'Fecha de contabilización',  range: true, currentMonth: false },
      { name: 'date_vencimiento',  type: 'new_date',   caption: 'Fecha de vencimiento',      range: true, currentMonth: false },
      { name: 'responsable',       type: 'new_select', caption: 'Emisor',                    dataSource: 'getUsuario' },
      { name: 'tipo_doc',          type: 'new_select', caption: 'Tipo Doc.',                 dataSource: 'getTiposDocDeCompras' },
      { name: 'formas_de_pago',    type: 'new_select', caption: 'Forma de pago',             dataSource: 'getFormaPagos?compra=true' },
      { name: 'tipo_libro',        type: 'new_select', caption: 'Tipo de libros',            dataSource: 'getTipoLibros' },
      { name: 'contabilizado',     type: 'new_select', caption: '¿Contabilizado?',           dataObject: [{ id: false, text: 'Sin contabilizar' }, { id: true, text: 'Contabilizado' }] },
      { name: 'origen',            type: 'autocomplete', caption: 'Origen',                  dataObject: [{ id: "PROYECTO", text: 'NEGOCIOS' }, { id: "PRESUPUESTO DE GASTO", text: 'PRESUPUESTO DE GASTO' }, { id: "GASTO GENERAL", text: 'GASTOS GENERALES' }] },
      { name: 'por_negocio',       type: 'autocomplete', caption: 'Por negocio',             dataSource: 'getNegociosActivos' },
      { name: 'por_presupuesto',   type: 'autocomplete', caption: 'Por presupuesto',         dataSource: 'getPresupuestosActivos' },
      { name: 'por_clasificacion', type: 'autocomplete', caption: 'Por Clasificación',       dataSource: 'getClasificacionGG' },
      {
        name: 'estado', type: 'checkbox', caption: 'Estado del documento',
        options: [
          { caption: 'Por revisar', name: 'estado_por_revisar', value: mostrar_por_revisar },
          { caption: 'Por asignar', name: 'estado_por_asignar', value: false },
          { caption: 'Por pagar',   name: 'estado_por_pagar',   value: true  },
          { caption: 'Pagado',      name: 'estado_pagado',      value: false },
          { caption: 'Emitida',     name: 'estado_emitida',     value: false },
          { caption: 'Nulo',        name: 'estado_nulo',        value: false }
        ]
      },
      { name: 'tipo_gasto',  type: 'new_select',   caption: 'Tipo gasto',          dataObject: [{ id: 'OC', text: 'Orden de compra' }, { id: 'FXR', text: 'Rendiciones' }] },
      { name: 'area_negocio', type: 'autocomplete', caption: 'Áreas de negocio',   dataSource: 'getAreaNegocio' }
    ]
  };

  unaBase.toolbox.search.newInit(params);

  unaBase.toolbox.menu.init({
    entity: 'Dtc',
    buttons: ['searchOff', "create_dtc", "views", "dtc_pay_selection", "export_list", "export_softland", "export_sap", "export_compras_pe"],
    buttonAccess: { dtc_pay_selection: '_659' }
  });

  if (currency.code != "PEN") { $('#menu ul').find('li[data-name="export_compras_pe"]').hide(); }
  if (!access._504)           { $('#menu ul').find('li[data-name="create_dtc"]').hide(); }

  // Filtros condicionales
  $('#search').find('input[name="por_negocio"]').closest('.autocomplete').hide();
  $('#search').find('input[name="por_clasificacion"]').closest('.autocomplete').hide();
  $('#search').find('input[name="por_presupuesto"]').closest('.autocomplete').hide();

  $('#search').find('input[name="origen"]').blur(function () {
    const v = $(this).val();
    $('#search').find('input[name="por_negocio"]').closest('.autocomplete').toggle(v === 'NEGOCIOS');
    $('#search').find('input[name="por_clasificacion"]').closest('.autocomplete').toggle(v === 'GASTOS GENERALES');
    $('#search').find('input[name="por_presupuesto"]').closest('.autocomplete').toggle(v === 'PRESUPUESTO DE GASTO');
  });

  // Ocultar botones por defecto
  ['dtc_pay_selection','export_softland','export_sap'].forEach(b => $('#menu ul').find(`li[data-name="${b}"]`).hide());

  // ── SELECCIÓN ──
  $('body').off('click.list-select', "**");
  $("body").on("click.list-select", "input.selected", function () {
    let input    = $(this);
    let tp       = $(this).closest("tr").data("tp");
    let idoc     = $(this).closest("tr").data("oc");
    let ndoc     = $(this).closest("tr").data("ndoc");
    let tipogasto = $(this).closest("tr").data("tgasto");

    if (tp && input.prop("checked")) {
      let msj = "El documento (" + ndoc + ") cuenta con pago abonado desde la " + tipogasto + ".";
      confirm(msj, "Ir a la " + tipogasto).done(function (data) {
        if (data) window.open('/4DACTION/wbienvenidos#compras/content.shtml?id=' + idoc);
      });
      return;
    }

    const showBtns = (show) => {
      if (show) {
        if (access._659) $('#menu ul').find('li[data-name="dtc_pay_selection"]').show();
        if (access._661) $('#menu ul').find('li[data-name="export_softland"]').show();
        if (access._660) $('#menu ul').find('li[data-name="export_sap"]').show();
      } else {
        ['dtc_pay_selection','export_softland','export_sap'].forEach(b => $('#menu ul').find(`li[data-name="${b}"]`).hide());
      }
    };

    if (input.attr('name') === "selected_all") {
      const checked = input.prop("checked");
      $('table tbody input[name="selected_one"]').prop("checked", checked);
      showBtns(checked);
    } else {
      const anyChecked = $('tbody > tr > td > input:checked').length > 0;
      showBtns(input.prop("checked") || anyChecked);
    }
    selectedSum();
  });

  ['dtc_pay_selection','export_softland','export_sap'].forEach(b => $('#menu ul').find(`li[data-name="${b}"]`).hide());

  // ── IR A DETALLE ──
  $('.padre table tbody').on('click', 'tr > td[data-goto="true"]', function () {
    var id  = $(this).closest("tr").data("id");
    var doc = $(this).closest("tr").data("doc");
    if (["60","61","55","56"].includes(String(doc))) {
      unaBase.loadInto.viewport('/v3/views/dtc/contentnc.shtml?id=' + id);
    } else {
      unaBase.loadInto.viewport('/v3/views/dtc/content.shtml?id=' + id);
    }
  });

  // Hover avatar
  $(document).on('mouseenter', '.dtc-row', function () {
    $(this).find('.proveedor-avatar').css('transform','scale(1.1)');
  }).on('mouseleave', '.dtc-row', function () {
    $(this).find('.proveedor-avatar').css('transform','scale(1)');
  });

  document.title = nombreEmpresa + ' / DTC - Lista';
});

// ── UTILS ─────────────────────────────────────
function updateResultCount() {
  var count = $('table.results tbody tr').length;
  $('#result-count').text(count + ' documento' + (count !== 1 ? 's' : ''));
}