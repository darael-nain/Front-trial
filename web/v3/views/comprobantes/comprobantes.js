var setter = item => (typeof item === "boolean" ? "checked" : "value");
var setterType = type => (type === "checkbox" ? "checked" : "value");

function verifyCheck(event) {
  var inputs = document.querySelectorAll("#dialog-viewport input[type=checkbox]");
  for (var i = 0; i < inputs.length; i++) {
    let des = false;
    if (event.target.checked) {
      if (!inputs[i].disabled && !inputs[i].checked) {
        des = true
      }

    } else {
      des = false
    }
    inputs[i].disabled = des;
  }
}

function collapseRow(event) {
  let numero_cuenta = event.parentNode.parentNode.children[4].children[0].value
  let table = document.getElementById('detail-data')
  tr = table.getElementsByTagName("tr");

  let n = '', ic = ''

  let il_open = document.createElement("i");
  il_open.classList.add("fas");
  il_open.classList.add("fa-folder-open");
  il_open.style.fontSize = '15px'

  let il_close = document.createElement("i");
  il_close.classList.add("fas");
  il_close.classList.add("fa-folder");
  il_close.style.fontSize = '15px'

  let indexOf, index, e
  index = event.parentNode.parentNode.rowIndex;
  let total_debe, total_haber, debe, haber


  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0]
    if (td) {
      n = td.parentNode.children[4].children[0].value
      ic = td.parentNode.children[0].children[0] != undefined ? td.parentNode.children[0].children[0].tagName : ''
      indexOf = td.parentNode.rowIndex

      if (ic === 'BUTTON' && indexOf == index) {

        e = td.parentNode.children[0].children[0].children[0].classList
        if (e.contains("fa-folder-open")) {

          td.parentNode.children[0].children[0].children[0].remove()
          td.parentNode.children[0].children[0].appendChild(il_close)
        } else {

          td.parentNode.children[0].children[0].children[0].remove()
          td.parentNode.children[0].children[0].appendChild(il_open)
        }
      }

      if (n === numero_cuenta && ic !== 'BUTTON') {

        if (tr[i].style.display === 'none') {

          //background-color: aquamarine;
          tr[i].style.backgroundColor = "#CAF0F8";
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";

        }
      }
    }


  }

}

var docTypes = {
  DTC: {
    name: folio => `Dtc nro: ${folio}`,
    url: id => `${window.location.origin}/4DACTION/wbienvenidos#dtc/content.shtml?id=${id}`,
    dialog: false
  },
  COMPROBANTE: {
    name: folio => `Dtc nro: ${folio}`,
    url: id => `${window.location.origin}/4DACTION/wbienvenidos#dtc/content.shtml?id=${id}`,
    dialog: false
  },
  NC: {
    name: folio => `NC nro: ${folio}`,
    url: id => `${window.location.origin}/4DACTION/wbienvenidos#dtc/contentnc.shtml?id=${id}`,
    dialog: false
  },
  NDE: {
    name: folio => `NC nro: ${folio}`,
    url: id => `${window.location.origin}/4DACTION/wbienvenidos#dtc/contentnd.shtml?id=${id}`,
    dialog: false
  },
  DTV: {
    name: folio => `Dtv nro: ${folio}`,
    url: id => `${window.location.origin}/4DACTION/wbienvenidos#dtv/content.shtml?id=${id}`,
    dialog: false
  },
  NDV: {
    name: folio => `DTV ND NRO: ${folio}`,
    url: id => `${window.location.origin}/4DACTION/wbienvenidos#dtv/nd/content.shtml?id=${id}`,
    dialog: false
  },
  NCV: {
    name: folio => `Dtv NC nro: ${folio}`,
    url: id => `${window.location.origin}/4DACTION/wbienvenidos#dtv/nc/content.shtml?id=${id}`,
    dialog: false
  },
  OP: {
    name: folio => `Orden de Pago nro: ${folio}`,
    url: id => `${window.location.origin}/4DACTION/wbienvenidos#pagos/content.shtml?id=${id}`,
    dialog: false
  },
  OC: {
    name: folio => `Orden de compra nro: ${folio}`,
    url: id => `${window.location.origin}/4DACTION/wbienvenidos#compras/content.shtml?id=${id}`,
    dialog: false
  },
  FXR: {
    name: folio => `Rendición nro: ${folio}`,
    url: id => `${window.location.origin}/4DACTION/wbienvenidos#compras/content.shtml?id=${id}`,
    dialog: false
  },
  FTG: {
    name: folio => `Factoring nro: ${folio}`,
    url: id => `${window.location.origin}/4DACTION/wbienvenidos#compras/content_factoring.shtml?id=${id}`,
    dialog: false
  },
  NV: {
    name: folio => `Negocio nro: ${folio}`,
    url: id => `${window.location.origin}/4DACTION/wbienvenidos#negocios/content.shtml?id=${id}`,
    dialog: false
  },
  OCB: {
    name: folio => `Cobro nro: ${folio}`,
    url: id => `${window.location.origin}/4DACTION/wbienvenidos#pagos/dialog/pago.shtml?id=${id}`,
    dialog: true
  },
  NONE: {
    name: folio => `Sin documento`,
    url: id => ``,
    dialog: false
  },
  UNDEFINED: {
    name: folio => `Sin documento`,
    url: id => ``,
    dialog: false
  }
}

async function loadDetalleAsientos(e) {
  const tr = e.closest('tr'); // Usar closest para obtener el tr más cercano
  const idComp = document.querySelector('.sheet').dataset.id;
  const account = tr.dataset.account;
  const table = document.getElementById('detail-asiento');
  const tableMain = document.getElementById('detail');
  // Función para obtener los asientos contables desde el servidor
  const getAsientos = async (idComp, account, page, rowsPerPage) => {
    const url = new URL('/4DACTION/_force_getDetalleAsientos', window.location.origin);
    const params = {
      idComp,
      account,
      sid: unaBase.sid.encoded(),
      page,
      pageSize: rowsPerPage
    };

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    unaBase.ui.block()
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (err) {
      console.error('Error fetching detail entries:', err);
      return null; // Devolver null en caso de error
    } finally {
      unaBase.ui.unblock()
    }
  };

  // Obtener los datos y actualizar la tabla
  const result = await getAsientos(idComp, account, 1, 50000);
  if (result && result.details) {
    const tbody = table.querySelector('tbody#detail-data');
    tbody.innerHTML = ''; // Limpiar el contenido anterior
    tableMain.style.display = 'none'
    table.style.display = ''; // Asegurarse de que la tabla sea visible
    let totalDebe = 0;
    let totalHaber = 0;
    result.details.forEach(detail => {
      const debe = Math.abs(detail.debe.replace(',', '.'));
      const haber = Math.abs(detail.haber.replace(',', '.'));

      totalDebe += debe;
      totalHaber += haber;
      const row = document.createElement('tr');
      let typeDoc = detail.typeDoc !== "" && detail.typeDoc != "NaN" && detail.typeDoc != "nan" ? detail.typeDoc : "none";
      typeDoc = typeDoc?.toUpperCase()

      const cuentaContableButton = `<button style="display:none; width: 24px; z-index: 0;"  data-id="${detail.id_detalle}" class="show cuentaContable" onClick="comprobantes.showCuentaContable(event)"><span class="ui-icon ui-icon-carat-1-s"></span></button>`;
      row.dataset.id = detail.id_detalle
      row.innerHTML = `
      <td class="contacto" data-idcont="${detail.idCont}"><div>${detail.auxiliar ? '<span readonly name="auxiliar_rut_' + detail.id_detalle + '">' + detail.auxiliar_rut + '</span><br><span readonly name="auxiliar_desc_' + detail.id_detalle + '">' + detail.auxiliar_desc + '</span><button style="display: none" class="search-btn" data-type="auxiliar" data-id="' + detail.id_detalle + '" onClick="comprobantes.showDialogDTC(this)"><span class="ui-icon ui-icon-search"></span></button>' : ''}</div></td>
      <td class="documento" data-iddoc="${detail.idDoc}" data-doctype=${detail.typeDoc}><div>${detail.documento ? '<a name="documento_desc_' + detail.id_detalle + '" target="_blank" data-dialog="' + docTypes[typeDoc].dialog + '" href="' + docTypes[typeDoc].url(detail.idDoc) + '" >' + docTypes[typeDoc].name(detail.folioDoc) + ' / ' + detail.param4 + '</a>' + (unaBase.parametros.ocultar_lupa_doc_asiento ? '' : '<button class="search-btn" data-type="documento" style="display: none"  data-id="' + detail.id_detalle + '" onClick="comprobantes.showDialogDTC(this)"><span class="ui-icon ui-icon-search"></span></button>') : ''}</div></td>
              <td>${detail.codigoCuenta || ''}</td>
              <td>${cuentaContableButton}<input readonly name="cuentaContable" value="${detail.cuentaContable}" type="text" /></td>
              <td class=""><input class="format-all" readonly name="debe" value="${unaBase.utilities.transformNumber(Math.abs(detail.debe.replace(',', '.')), 'int')}"  onkeyup="unaBase.utilities.general.formater(this)" onkeydown="comprobantes.formatInput(this)" onclick="comprobantes.onClickInput(this)" type="text" /></td>
              <td class=""><input class="format-all" readonly name="haber" value="${unaBase.utilities.transformNumber(Math.abs(detail.haber.replace(',', '.')), 'int')}" onkeyup="unaBase.utilities.general.formater(this)" onkeydown="comprobantes.formatInput(this)" onclick="comprobantes.onClickInput(this)" type="text" /></td>
              <td><button class="edit" onClick="comprobantes.edit(event)"><span class="ui-icon ui-icon-pencil"></span></button><button style="display:none" class="save" onClick="comprobantes.save(event)"><span class="ui-icon ui-icon-disk"></span></button></td>                       
                                                         
                                  <td><button class="delete" onClick="comprobantes.delete(event)"><span class="ui-icon ui-icon-close"></span></button></td>
          `;
      tbody.appendChild(row);
    });

    const totalRow = document.createElement('tr');
    totalRow.className = "totals";
    totalRow.innerHTML = `
            <td colspan="4">Total:</td>
            <td><input disabled value="${unaBase.utilities.transformNumber(totalDebe, 'int')}" class="debe redBold" type="text"></td>
            <td><input disabled value="${unaBase.utilities.transformNumber(totalHaber, 'int')}" class="haber" type="text"></td>
            <td colspan="2"></td>
        `;
    tbody.appendChild(totalRow);
  } else {
    console.log('No details available or failed to fetch details');
  }
}

var comprobantes = {
  data: {
    active: null,
    description: null,
    docType: null,
    registryDate: null,
    registryHour: null,
    docDate: null,
    docHour: null,
    id: 0,
    ok: false
  },
  container: $("#comprobantes"),
  menubar: $("#menu ul"),
  init: function (id) {
    const safeId = (id === undefined || id === null) ? 0 : id;

    // ============================================================================
    // HELPERS - Igual que el original
    // ============================================================================
    const toText = (v) => (v === undefined || v === null) ? "" : String(v);
    const isFn = (f) => typeof f === "function";

    const toNumber = (value) => {
      if (typeof value === "number") return Number.isFinite(value) ? value : 0;

      let s = toText(value).trim();
      if (!s) return 0;

      s = s.replace(/\s/g, "");
      s = s.replace(/[^\d.,-]/g, "");

      if (s.includes(",")) {
        s = s.replace(/\./g, "");
        s = s.replace(",", ".");
      } else {
        s = s.replace(/,/g, "");
      }

      const n = parseFloat(s);
      return Number.isFinite(n) ? n : 0;
    };

    const formatNumber = (num, decimals) => {
      const n = Number.isFinite(num) ? num : 0;
      const d = Number.isFinite(decimals) ? decimals : 0;
      return n.toLocaleString("de-DE", { minimumFractionDigits: d, maximumFractionDigits: d });
    };

    const safeDocTypeKey = (t) => {
      const s = toText(t).trim();
      if (!s || s.toLowerCase() === "nan") return "NONE";
      return s.toUpperCase();
    };

    const getCurrencyDecimals = () => {
      const d = (typeof currency !== "undefined" && currency && Number.isFinite(currency.decimals)) ? currency.decimals : 0;
      return d;
    };

    const safeContainer = () => document.querySelector("table#detail tbody");

    // ============================================================================
    // CONFIGURACIÓN DE COLUMNAS - AQUÍ AGREGAS/QUITAS COLUMNAS
    // ============================================================================
    const COMPROBANTES_CONFIG = {
      columns: [
        {
          key: 'contacto',
          label: 'Contacto',
          type: 'contacto',
          visible: true
        },
        {
          key: 'documento',
          label: 'Documento',
          type: 'documento',
          visible: true
        },
        {
          key: 'c_costo',
          label: 'Centro de Costo',
          type: 'c_costo',
          visible: true
        },
        {
          key: 'c_costo_2',
          label: 'Centro de Costo 2',
          type: 'c_costo_2',
          visible: true
        },
        {
          key: 'codigoCuenta',
          label: 'Código Cuenta',
          type: 'input',
          visible: true
        },
        {
          key: 'cuentaContable',
          label: 'Cuenta Contable',
          type: 'input_with_button',
          visible: true
        },
        {
          key: 'debe',
          label: 'Debe',
          type: 'input_number',
          visible: true
        },
        {
          key: 'haber',
          label: 'Haber',
          type: 'input_number',
          visible: true
        },
        {
          key: 'actions_edit',
          label: '',
          type: 'actions',
          visible: true
        },
        {
          key: 'actions_delete',
          label: '',
          type: 'actions',
          visible: true
        }
      ],

      // Mapeo de campos del 4D
      fieldMapping: {
        id: ['id'],
        codigoCuenta: ['codigoCuenta', 'cuenta_actual'],
        cuentaContable: ['cuentaContable'],
        debe: ['debe', 'debe_total'],
        haber: ['haber', 'haber_total'],
        idCont: ['idCont'],
        auxiliar: ['auxiliar'],
        auxiliar_rut: ['auxiliar_rut'],
        auxiliar_desc: ['auxiliar_desc'],
        idDoc: ['idDoc'],
        typeDoc: ['typeDoc'],
        documento: ['documento'],
        folioDoc: ['folioDoc'],
        param4: ['param4'],
        c_costo: ['c_costo', 'ccosto', 'centro_costo', 'centroCosto', 'costCenter'],
        c_costo_2: ['centro_costo_2'],
        c_costo_desc: ['c_costo_desc', 'ccosto_desc', 'centro_costo_desc', 'centroCostoDesc', 'costCenterDesc'],
        isGrouped: ['isGrouped']
      },

      detailModeThreshold: 5000
    };

    // ============================================================================
    // HELPERS DE MAPEO
    // ============================================================================
    const getMappedValue = (obj, fieldKey) => {
      
      const possibleKeys = COMPROBANTES_CONFIG.fieldMapping[fieldKey] || [];
      for (const key of possibleKeys) {
        if (obj && obj[key] !== undefined && obj[key] !== null) {
          return obj[key];
        }
      }
      return null;
    };

    const getVisibleColumns = () => {
      return COMPROBANTES_CONFIG.columns.filter(col => col.visible);
    };

    // Calcular colspan dinámicamente
    const getColspanBefore = () => {
      const visibleCols = getVisibleColumns();
      // Contar columnas antes de debe/haber
      let count = 0;
      for (const col of visibleCols) {
        if (col.key === 'debe') break;
        count++;
      }
      return count;
    };

    const getColspanAfter = () => {
      const visibleCols = getVisibleColumns();
      // Contar columnas después del total (actions)
      let count = 0;
      let foundHaber = false;
      for (const col of visibleCols) {
        if (col.key === 'haber') {
          foundHaber = true;
          continue;
        }
        if (foundHaber) count++;
      }
      return count;
    };

    // ============================================================================
    // GENERADOR DE CELDAS DINÁMICO
    // ============================================================================
    const buildCell = (column, element, dec) => {
      if (!column.visible) return '';

      const columnBuilders = {
        contacto: () => {
          const auxiliarHtml = element?.auxiliar
            ? `<span readonly name="auxiliar_rut_${toText(element?.id)}">${toText(element?.auxiliar_rut)}</span><br>` +
            `<span readonly name="auxiliar_desc_${toText(element?.id)}">${toText(element?.auxiliar_desc)}</span>` +
            `<button style="display:none" class="search-btn" data-type="auxiliar" data-id="${toText(element?.id)}" onClick="comprobantes.showDialogDTC(this)"><span class="ui-icon ui-icon-search"></span></button>`
            : "";
          return `<td class="contacto" data-idcont="${toText(element?.idCont)}"><div>${auxiliarHtml}</div></td>`;
        },

        documento: () => {
          const typeDocKey = safeDocTypeKey(element?.typeDoc);
          const docTypeCfg = (typeof docTypes !== "undefined" && docTypes && docTypes[typeDocKey]) ? docTypes[typeDocKey] : null;

          const exists = element?.existe_documento === true; // viene del back
          const folioText = `${toText(docTypeCfg?.name?.(element?.folioDoc) || element?.folioDoc)} / ${toText(element?.param4)}`;

          const documentoHtml = (element?.documento && docTypeCfg)
            ? (exists
              ? (
                `<a name="documento_desc_${toText(element?.id)}" target="_blank" data-dialog="${toText(docTypeCfg.dialog)}" href="${docTypeCfg.url(element?.idDoc)}">${docTypeCfg.name(element?.folioDoc)} / ${toText(element?.param4)}</a>` +
                (unaBase?.parametros?.ocultar_lupa_doc_asiento ? "" :
                  `<button class="search-btn" data-type="documento" style="display:none" data-id="${toText(element?.id)}" onClick="comprobantes.showDialogDTC(this)"><span class="ui-icon ui-icon-search"></span></button>`)
              )
              : `<span class="doc-missing" title="Documento no existe o no fue encontrado">${folioText}</span>`
            )
            : "";

          return `<td class="documento" data-iddoc="${toText(element?.idDoc)}" data-doctype="${toText(element?.typeDoc)}" data-existe-doc="${exists ? "1" : "0"}"><div>${documentoHtml}</div></td>`;
        }
        ,

        c_costo: () => {
          return buildCCostoCell(element, column.key);
        },

        c_costo_2: () => {
          const value = getMappedValue(element, column.key) || toText(element?.[column.key]);
          return `<td><input readonly name="${column.key}" value="${toText(value)}" type="text" /></td>`;
        },

        input: () => {
          const value = getMappedValue(element, column.key) || toText(element?.[column.key]);
          return `<td><input readonly name="${column.key}" value="${toText(value)}" type="text" /></td>`;
        },

        input_with_button: () => {
          const value = getMappedValue(element, column.key) || toText(element?.[column.key]);
          const cuentaContableButton =
            `<button style="display:none;width:24px;z-index:0;" data-id="${toText(element?.id)}" class="show cuentaContable" onClick="comprobantes.showCuentaContable(event)">` +
            `<span class="ui-icon ui-icon-carat-1-s"></span></button>`;
          return `<td style="display:flex;align-items:center;height:39px;flex-direction:row-reverse;">
            ${cuentaContableButton}
            <input readonly name="${column.key}" value="${toText(value)}" type="text" />
          </td>`;
        },

        input_number: () => {
          const value = getMappedValue(element, column.key);
          const numValue = toNumber(value);
          return `<td><input class="format-all" readonly name="${column.key}" value="${formatNumber(numValue, dec)}" onkeyup="unaBase.utilities.general.formater(this)" onkeydown="comprobantes.formatInput(this)" onclick="comprobantes.onClickInput(this)" type="text" /></td>`;
        },

        actions: () => {
          if (column.key === 'actions_edit') {
            return `<td><button class="edit" onClick="comprobantes.edit(event)"><span class="ui-icon ui-icon-pencil"></span></button><button style="display:none" class="save" onClick="comprobantes.save(event)"><span class="ui-icon ui-icon-disk"></span></button></td>`;
          } else if (column.key === 'actions_delete') {
            return `<td><button class="delete" onClick="comprobantes.delete(event)"><span class="ui-icon ui-icon-close"></span></button></td>`;
          }
          return '<td></td>';
        }
      };

      const builder = columnBuilders[column.type] || (() => '<td></td>');
      return builder();
    };

    // Construir fila completa usando la configuración de columnas
    const buildRow = (element, dec, style = '') => {
      const visibleColumns = getVisibleColumns();
      const cells = visibleColumns.map(col => buildCell(col, element, dec)).join('');
      const codigoCuenta = getMappedValue(element, 'codigoCuenta') || toText(element?.codigoCuenta);

      return `<tr data-id="${toText(element?.id)}" data-account="${codigoCuenta}" ${style}>${cells}</tr>`;
    };

    // Construir fila de totales agrupados
    const buildGroupedTotalRow = (element, dec) => {
      const visibleColumns = getVisibleColumns();
      const codigoCuenta = toText(element?.codigoCuenta);

      const btnPlus =
        '<button type="button" class="folder-account" style="float:left;padding:10px;" onclick="collapseRow(this)">' +
        '<i class="fa-solid fa-folder" style="font-size:15px"></i>' +
        "</button>";

      let cells = '';
      let firstCol = true;

      for (const col of visibleColumns) {
        if (!col.visible) continue;

        if (firstCol) {
          cells += `<td>${btnPlus}</td>`;
          firstCol = false;
        } else if (col.key === 'codigoCuenta') {
          cells += `<td><input readonly value="${codigoCuenta}" type="text" /></td>`;
        } else if (col.key === 'cuentaContable') {
          cells += `<td><input readonly value="${toText(element?.cuentaContable)}" type="text" /></td>`;
        } else if (col.key === 'debe') {
          cells += `<td><input class="format-all" readonly value="${unaBase.utilities.transformNumber(Math.abs(element.debe), 'int')}" onkeyup="unaBase.utilities.general.formater(this)" type="text"/></td>`;
        } else if (col.key === 'haber') {
          cells += `<td><input class="format-all" readonly value="${unaBase.utilities.transformNumber(Math.abs(element.haber), 'int')}" onkeyup="unaBase.utilities.general.formater(this)" type="text"/></td>`;
        } else {
          cells += '<td></td>';
        }
      }

      return `<tr style="background-color:#D0F7EB;" class="totalhector" data-account="${codigoCuenta}">${cells}</tr>`;
    };

    // ============================================================================
    // TOTALES
    // ============================================================================
    const setTotalsRow = ({ totalDebe, totalHaber }) => {
      const container = safeContainer();
      if (!container) return;

      const dec = getCurrencyDecimals();
      const debeInput = container.querySelector("tr.totals input.debe");
      const haberInput = container.querySelector("tr.totals input.haber");
      const totalInput = container.querySelector("tr.totals input.total");

      if (!debeInput || !haberInput || !totalInput) return;

      debeInput.value = formatNumber(totalDebe, dec);
      haberInput.value = formatNumber(totalHaber, dec);

      const diferencia = Math.abs(totalDebe - totalHaber);
      totalInput.value = formatNumber(diferencia, dec);

      if (diferencia !== 0) totalInput.classList.add("redBold");
      else totalInput.classList.remove("redBold");

      if (totalDebe > totalHaber) {
        haberInput.classList.add("redBold");
        debeInput.classList.remove("redBold");
      } else if (totalHaber > totalDebe) {
        debeInput.classList.add("redBold");
        haberInput.classList.remove("redBold");
      } else {
        debeInput.classList.remove("redBold");
        haberInput.classList.remove("redBold");
      }
    };

    const calculateTotalsLarge = () => {
      const container = safeContainer();
      if (!container) return;

      const groupedRows = container.querySelectorAll("tr.tr-total");
      let totalDebe = 0;
      let totalHaber = 0;

      if (groupedRows && groupedRows.length) {
        groupedRows.forEach((tr) => {
          totalDebe += toNumber(tr.getAttribute("data-totalDebe"));
          totalHaber += toNumber(tr.getAttribute("data-totalHaber"));
        });
        setTotalsRow({ totalDebe, totalHaber });
        return;
      }

      const isVisibleRow = (el) => {
        const tr = el && el.closest ? el.closest("tr") : null;
        if (!tr) return true;
        return !(tr.style && tr.style.display === "none");
      };

      const debeInputs = container.querySelectorAll('input[name="debe"], input[name="debe-agrupado"]');
      const haberInputs = container.querySelectorAll('input[name="haber"], input[name="haber-agrupado"]');

      debeInputs.forEach((inp) => { if (isVisibleRow(inp)) totalDebe += toNumber(inp.value); });
      haberInputs.forEach((inp) => { if (isVisibleRow(inp)) totalHaber += toNumber(inp.value); });

      setTotalsRow({ totalDebe, totalHaber });
    };

    // ============================================================================
    // TABS
    // ============================================================================
    const bindTabsOnce = () => {
      const tabs = document.querySelectorAll(".ub-tab");
      const contentContainers = document.querySelectorAll(".ub-content-container");
      if (!tabs || !tabs.length) return;

      tabs.forEach((tab) => {
        if (tab.dataset && tab.dataset.bound === "1") return;
        if (tab.dataset) tab.dataset.bound = "1";

        tab.addEventListener("click", () => {
          tabs.forEach((t) => t.classList.remove("ub-active-tab"));
          tab.classList.add("ub-active-tab");

          contentContainers.forEach((c) => (c.style.display = "none"));
          const contentId = tab.getAttribute("data-content");
          const contentContainer = contentId ? document.getElementById(contentId) : null;
          if (contentContainer) contentContainer.style.display = "block";

          if (contentId === "historial" && contentContainer) {
            fetch(`/v3/views/historial/index.shtml?id=${comprobantes.id}&mod=Comprobantes`)
              .then((r) => r.text())
              .then((html) => { contentContainer.innerHTML = html; })
              .catch((e) => console.error("Error al cargar historial:", e));
          }
        });
      });
    };

    // ============================================================================
    // CENTRO DE COSTO
    // ============================================================================
    comprobantes._ccostoCache = comprobantes._ccostoCache || {
      loaded: false,
      loading: false,
      options: [],
      byId: {},
      defaultId: ""
    };

    const loadCCostoOptions = (cb) => {
      const cache = comprobantes._ccostoCache;

      if (cache.loaded) {
        if (isFn(cb)) cb(null, cache);
        return;
      }
      if (cache.loading) {
        let tries = 0;
        const t = setInterval(() => {
          tries++;
          if (cache.loaded || tries > 50) {
            clearInterval(t);
            if (isFn(cb)) cb(cache.loaded ? null : new Error("timeout"), cache);
          }
        }, 80);
        return;
      }

      cache.loading = true;

      $.ajax({
        url: window.origin + "/4DACTION/_v3_getAreasNegocio",
        type: "GET",
        dataType: "json",
        data: { page: 1, results: 5000, q: "", q2: "", activo: true }
      })
        .done((resp) => {
          try {
            const rows = Array.isArray(resp?.rows) ? resp.rows : [];

            cache.byId = {};
            cache.options = [];

            let def = "";
            rows.forEach((r) => {
              if (r && r.estado === true) {
                const id = toText(r.id);
                const desc = toText(r.descripcion_centrocosto);

                if (id) {
                  cache.byId[id] = desc;
                  cache.options.push({ value: id, text: desc });
                }
                if (!def && r.default === true && id) def = id;
              }
            });

            cache.options.sort((a, b) => a.text.localeCompare(b.text, "es"));

            cache.defaultId = def || "";
            cache.loaded = true;
          } catch (e) {
            console.error("parse ccosto error:", e);
          } finally {
            cache.loading = false;
            if (isFn(cb)) cb(cache.loaded ? null : new Error("load_failed"), cache);
          }
        })
        .fail((err) => {
          cache.loading = false;
          console.error("Error _v3_getAreasNegocio:", err);
          if (isFn(cb)) cb(err, cache);
        });
    };

    const getCCostoValue = (row, fieldKey = 'c_costo') => {
      return getMappedValue(row, fieldKey) || "";
    };

    const getCCostoDesc = (row, fieldKey = 'c_costo') => {
      return getMappedValue(row, fieldKey + '_desc') || "";
    };

    const buildCCostoCell = (element, fieldKey = 'c_costo') => {
      const idRow = toText(element?.id);
      const ccId = getCCostoValue(element, fieldKey);
      const ccDesc = getCCostoDesc(element, fieldKey);
      const displayText = ccId && ccDesc ? `${ccId} / ${ccDesc}` : (ccDesc || ccId || "");

      return `
        <td class="${fieldKey}" data-ccosto="${ccId}">
          <div class="${fieldKey}-view">
            <span class="ccosto-label" name="${fieldKey}_label_${idRow}">${displayText}</span>
            <input type="hidden" name="${fieldKey}" value="${ccId}">
            <input type="hidden" name="${fieldKey}_desc" value="${ccDesc}">
          </div>
  
          <div class="${fieldKey}-edit" style="display:none;">
            <select class="${fieldKey}-select" name="${fieldKey}_select" data-rowid="${idRow}">
              <option value="">Selecciona</option>
            </select>
          </div>
        </td>
      `;
    };

    const initCCostoTomSelectForRow = (tr, fieldKey = 'c_costo') => {
      if (!tr) return;

      const td = tr.querySelector(`td.${fieldKey}`);
      const selectEl = tr.querySelector(`select.${fieldKey}-select`);
      if (!td || !selectEl) return;

      if (selectEl.tomselect) return;

      loadCCostoOptions((err, cache) => {
        if (err || !cache || !cache.options) {
          console.warn("No se pudo cargar centros de costo (TomSelect no se inicializa).");
          return;
        }

        selectEl.innerHTML = `<option value="">Selecciona</option>`;
        cache.options.forEach((opt) => {
          const o = document.createElement("option");
          o.value = opt.value;
          o.text = opt.text;
          selectEl.appendChild(o);
        });

        try {
          new TomSelect(selectEl, {
            maxItems: 1,
            valueField: "value",
            labelField: "text",
            searchField: "text",
            sortField: { field: "text", direction: "asc" },
            plugins: ["remove_button"]
          });
        } catch (e) {
          console.error("TomSelect init error:", e);
          return;
        }

        const hidden = tr.querySelector(`td.${fieldKey} input[name="${fieldKey}"]`);
        const currentId = toText(hidden?.value);
        const initial = currentId || toText(cache.defaultId);

        if (initial && selectEl.tomselect) {
          try { selectEl.tomselect.setValue(initial, true); } catch (e) { }
        }
      });
    };

    const showCCostoEditor = (tr) => {
      // Buscar todos los campos c_costo en la fila
      const visibleColumns = getVisibleColumns();
      visibleColumns.forEach(col => {
        if (col.type === 'c_costo') {
          const view = tr.querySelector(`.${col.key}-view`);
          const edit = tr.querySelector(`.${col.key}-edit`);
          if (view) view.style.display = "none";
          if (edit) edit.style.display = "";
          initCCostoTomSelectForRow(tr, col.key);
        }
      });
    };

    const hideCCostoEditor = (tr) => {
      const visibleColumns = getVisibleColumns();
      visibleColumns.forEach(col => {
        if (col.type === 'c_costo') {
          const view = tr.querySelector(`.${col.key}-view`);
          const edit = tr.querySelector(`.${col.key}-edit`);
          if (view) view.style.display = "";
          if (edit) edit.style.display = "none";
        }
      });
    };

    const commitCCostoFromEditor = (tr) => {
      const visibleColumns = getVisibleColumns();
      visibleColumns.forEach(col => {
        if (col.type === 'c_costo') {
          const selectEl = tr.querySelector(`select.${col.key}-select`);
          const hiddenId = tr.querySelector(`td.${col.key} input[name="${col.key}"]`);
          const hiddenDesc = tr.querySelector(`td.${col.key} input[name="${col.key}_desc"]`);
          const label = tr.querySelector(`.ccosto-label[name="${col.key}_label_${toText(tr.dataset.id)}"]`);
          const td = tr.querySelector(`td.${col.key}`);

          if (!selectEl || !hiddenId || !hiddenDesc || !label || !td) return;

          const selectedId = toText(selectEl.tomselect ? selectEl.tomselect.getValue() : selectEl.value);
          const cache = comprobantes._ccostoCache || {};
          const desc = selectedId ? toText(cache.byId?.[selectedId] || "") : "";

          hiddenId.value = selectedId;
          hiddenDesc.value = desc;
          td.setAttribute("data-ccosto", selectedId);

          const displayText = selectedId && desc ? `${selectedId} / ${desc}` : (desc || selectedId || "");
          label.textContent = displayText;
        }
      });
    };

    const bindCCostoEditSaveOnce = (container) => {
      if (!container) return;
      if (container.dataset && container.dataset.ccostoBound === "1") return;
      if (container.dataset) container.dataset.ccostoBound = "1";

      container.addEventListener("click", (ev) => {
        const btnEdit = ev.target && ev.target.closest ? ev.target.closest("button.edit") : null;
        if (!btnEdit) return;

        const tr = btnEdit.closest("tr");
        if (!tr || tr.classList.contains("tr-total") || tr.classList.contains("totalhector")) return;

        setTimeout(() => {
          try { showCCostoEditor(tr); } catch (e) { }
        }, 0);
      });

      container.addEventListener("click", (ev) => {
        const btnSave = ev.target && ev.target.closest ? ev.target.closest("button.save") : null;
        if (!btnSave) return;

        const tr = btnSave.closest("tr");
        if (!tr) return;

        try {
          commitCCostoFromEditor(tr);
          hideCCostoEditor(tr);
        } catch (e) {
          console.error("commit ccosto error:", e);
        }
      });

      container.addEventListener("keydown", (ev) => {
        if (ev.key === "Escape") {
          const tr = ev.target && ev.target.closest ? ev.target.closest("tr") : null;
          if (tr) hideCCostoEditor(tr);
        }
      });
    };

    // ============================================================================
    // AJAX PRINCIPAL
    // ============================================================================
    $.ajax({
      url: "/4DACTION/_V3_proxy_getComprobante",
      data: { id: safeId },
      dataType: "json",
      async: false,
      success: function (data) {
        try {
          const safeData = data || {};
          const details = Array.isArray(safeData.details) ? safeData.details : [];
          const container = safeContainer();
          if (!container) return;

          comprobantes.data = safeData;
          comprobantes.data.docType = toText(comprobantes.data.docType).toLowerCase();

          comprobantes.id = safeData.id || 0;
          if ((safeData.id || 0) === 0) safeData.active = true;

          $(`li[data-name="generate_reverse_provision"]`).hide();
          if (safeData.provision_sale === true || safeData.provision_expense === true) {
            $("li[data-name='generate_reverse_provision']").show();
          }
          if (safeData.reverse_generated === true) {
            $("li[data-name='generate_reverse_provision']").hide();
          }

          container.innerHTML = "";

          const dec = getCurrencyDecimals();

          const groupedByAccount = {};
          for (const row of details) {
            const codigo = toText(row?.codigoCuenta);
            if (!groupedByAccount[codigo]) {
              groupedByAccount[codigo] = { count: 0, debe: 0, haber: 0, sample: row };
            }
            groupedByAccount[codigo].count += 1;
            groupedByAccount[codigo].debe += toNumber(row?.debe);
            groupedByAccount[codigo].haber += toNumber(row?.haber);
          }

          const backButton = document.querySelector(".back");
          if (backButton && !(backButton.dataset && backButton.dataset.bound === "1")) {
            if (backButton.dataset) backButton.dataset.bound = "1";
            backButton.addEventListener("click", () => {
              const tableMain = document.querySelector("#detail");
              const tableDetail = document.querySelector("#detail-asiento");
              if (tableMain) tableMain.style.display = "";
              if (tableDetail) tableDetail.style.display = "none";
            });
          }

          const recordsTotal = (safeData.records && Number.isFinite(safeData.records.total)) ? safeData.records.total : 0;

          const appendRow = (htmlStr) => {
            const $row = $(htmlStr);
            $(container).append($row);

            const line = $row.find("a");
            if (line.length > 0 && line[0].dataset && line[0].dataset.dialog === "true") {
              line[0].href = "#";
              line[0].addEventListener("click", function (event) {
                event.preventDefault();
                unaBase.loadInto.dialog(`/v3/views/ingresos/dialog/ingreso.shtml?id=${safeData.id}`, "Ingreso", "large");
              });
            }

            comprobantes.saveAndAdd($row);
          };

          if (recordsTotal < COMPROBANTES_CONFIG.detailModeThreshold) {
            // ===== MODO DETALLE =====
            if (backButton) backButton.style.display = "none";

            let lastCodigo = null;
            const insertedTotal = new Set();

            for (const element of details) {
              const codigoCuenta = toText(element?.codigoCuenta);
              const g = groupedByAccount[codigoCuenta] || { count: 0, debe: 0, haber: 0, sample: element };

              let trTotal = "";
              let style = "";

              if (codigoCuenta !== lastCodigo) {
                if (g.count > 1 && !insertedTotal.has(codigoCuenta)) {
                  insertedTotal.add(codigoCuenta);
                  trTotal = buildGroupedTotalRow({
                    ...g.sample,
                    debe: g.debe,
                    haber: g.haber
                  }, dec);
                }
              } else {
                style = (codigoCuenta === "") ? "" : 'style="display:none;"';
              }

              if (g.count > 1) style = (codigoCuenta === "") ? "" : 'style="display:none;"';

              lastCodigo = codigoCuenta;

              const trLine = trTotal + buildRow(element, dec, style);
              appendRow(trLine);
            }

            // Totales dinámicos
            const colspanBefore = getColspanBefore();
            const colspanAfter = getColspanAfter();

            appendRow(`
              <tr class="totals">
                <td colspan="${colspanBefore}">Total:</td>
                <td><input disabled value="" class="debe" type="text" /></td>
                <td><input disabled value="" class="haber" type="text" /></td>
                <td colspan="${colspanAfter}"><input disabled value="" class="total" type="text" /></td>
              </tr>
            `);

            if (comprobantes && isFn(comprobantes.calculateTotals)) {
              comprobantes.calculateTotals();
            } else {
              calculateTotalsLarge();
            }

          } else {
            // ===== MODO AGRUPADO (5000+) =====
            for (const element of details) {
              const debeTotal = toNumber(element?.debe_total);
              const haberTotal = toNumber(element?.haber_total);

              if (element?.isGrouped) {
                const res = debeTotal - haberTotal;
                let mostrarDebe = "0";
                let mostrarHaber = "0";
                if (res > 0) mostrarDebe = unaBase.utilities.transformNumber(Math.abs(res), "int");
                else if (res < 0) mostrarHaber = unaBase.utilities.transformNumber(Math.abs(res), "int");

                const btnPlus = '<button type="button" style="float:left;padding:10px;" onclick="loadDetalleAsientos(this)"><i class="fa-solid fa-folder" style="font-size:15px"></i></button>';

                const visibleColumns = getVisibleColumns();
                let cells = '';
                let firstCol = true;

                for (const col of visibleColumns) {
                  if (!col.visible) continue;

                  if (firstCol) {
                    cells += `<td>${btnPlus}</td>`;
                    firstCol = false;
                  } else if (col.key === 'codigoCuenta') {
                    cells += `<td><input readonly value="${toText(element?.cuenta_actual)}" type="text" /></td>`;
                  } else if (col.key === 'cuentaContable') {
                    cells += `<td><input readonly value="${toText(element?.cuentaContable)}" type="text" /></td>`;
                  } else if (col.key === 'debe') {
                    cells += `<td><input class="format-all" name="debe-agrupado" readonly value="${mostrarDebe}" onkeyup="unaBase.utilities.general.formater(this)" type="text"/></td>`;
                  } else if (col.key === 'haber') {
                    cells += `<td><input class="format-all" name="haber-agrupado" readonly value="${mostrarHaber}" onkeyup="unaBase.utilities.general.formater(this)" type="text"/></td>`;
                  } else {
                    cells += '<td></td>';
                  }
                }

                const trTotal = `<tr style="background-color:#D0F7EB;" data-account="${toText(element?.cuenta_actual)}" class="tr-total" data-totalHaber="${toText(element?.haber_total)}" data-totalDebe="${toText(element?.debe_total)}">${cells}</tr>`;

                appendRow(trTotal);
                continue;
              }

              const trLine = buildRow(element, dec);
              appendRow(trLine);
            }

            const colspanBefore = getColspanBefore();
            const colspanAfter = getColspanAfter();

            appendRow(`
              <tr class="totals">
                <td colspan="${colspanBefore}">Total:</td>
                <td><input disabled value="" class="debe" type="text" /></td>
                <td><input disabled value="" class="haber" type="text" /></td>
                <td colspan="${colspanAfter}"><input disabled value="" class="total" type="text" /></td>
              </tr>
            `);

            calculateTotalsLarge();
          }

          bindCCostoEditSaveOnce(container);

          if (typeof domFunc !== "undefined" && domFunc && isFn(domFunc.setFormJquery)) {
            domFunc.setFormJquery({ data: safeData, disabled: ["registryDate"], extraData: true });
          }

          if (typeof $ !== "undefined" && isFn($("#docDate").datepicker)) {
            $("#docDate").datepicker();
          }

          const docDate = document.querySelector("#docDate");
          if (docDate) {
            const now = new Date();
            const dd = String(now.getDate()).padStart(2, "0");
            const mm = String(now.getMonth() + 1).padStart(2, "0");
            const yyyy = now.getFullYear();
            const currentDate = `${dd}/${mm}/${yyyy}`;
            if (!docDate.value || docDate.value === "00-00-00") docDate.value = currentDate;
          }

          if (comprobantes && isFn(comprobantes.addEvent13)) comprobantes.addEvent13();
          if (comprobantes && isFn(comprobantes.addFormatAll)) comprobantes.addFormatAll();

          $.ajax({
            url: "/4DACTION/_V3_get_estadoPeriodoContable",
            data: { periodo: safeData.registryDate, origen: "ext modulos" },
            dataType: "json",
            async: false,
            success: function (subdata) {
              try {
                if (subdata && subdata.exists == 1) {
                  if (subdata.closed == 1) {
                    cierreContable = true;
                    $('#menu [data-name="save"]').remove();
                    $('#menu [data-name="addDetails"]').remove();

                    const all = $("#viewport");
                    all.find("input").prop("readonly", true).prop("disabled", true);
                    all.find("button.detail.item, button.profile.item").hide();
                    all.find('input[type="checkbox"], input[type="text"], input[type="search"].datepicker, select')
                      .prop("disabled", true);

                    all.find('button[type="button"]:not(.folder-account), button:not(.folder-account)').prop("disabled", true);
                    all.find("button:not(.folder-account)").remove();

                    toastr.warning("El periodo seleccionado se encuentra cerrado por tanto no puede modificar este comprobante.");
                  }
                } else {
                  toastr.warning("El periodo contable para este comprobante no está creado.");
                }

                if (typeof access !== "undefined" && access && access._663 === false) {
                  $('#menu [data-name="create_accounting_period"]').remove();
                  $('#menu [data-name="status_accounting_period"]').remove();
                  $('#menu [data-name="close_accounting_period"]').remove();
                  $('#menu [data-name="open_accounting_period"]').remove();
                }
              } catch (e) {
                console.error("Error estadoPeriodoContable:", e);
              }
            },
            error: function (xhr, status, err) {
              console.error("Error _V3_get_estadoPeriodoContable:", status, err);
            }
          });

          bindTabsOnce();

        } catch (err) {
          console.error("init comprobantes error:", err);
          if (typeof toastr !== "undefined") toastr.error("Ocurrió un error cargando el comprobante.");
        }
      },
      error: function (xhr, status, err) {
        console.error("Error _V3_proxy_getComprobante:", status, err);
        if (typeof toastr !== "undefined") toastr.error("No se pudo cargar el comprobante.");
      }
    });
  }


  ,
  addAutocomplete(item) {
    $(item)
      .autocomplete({
        source: function (request, response) {
          $.ajax({
            url: "/4DACTION/_V3_getParamContable",
            dataType: "json",
            data: {
              q: request.term
            },
            success: function (data) {
              response(
                $.map(data.rows, function (item) {

                  return item;
                })
              );
            }
          });
        },
        minLength: 0,
        autoFocus: true,
        delay: 0,
        position: {
          my: "left top",
          at: "left bottom",
          collision: "flip"
        },
        open: function () {
          $(this)
            .removeClass("ui-corner-all")
            .addClass("ui-corner-top");
        },
        close: function () {
          $(this)
            .removeClass("ui-corner-top")
            .addClass("ui-corner-all");
        },
        focus: function (event, ui) {
          //$(this).val(ui.item.text);
          return false;
        },
        response: function (event, ui) { },
        select: function (event, ui) {
          const trId = $(event.target).closest("tr")[0].dataset.id;
          const tr = document.querySelector(`tr[data-id="${trId}"]`);

          tr.querySelector(`td input[name="codigoCuenta"]`).value = ui.item.number;
          tr.querySelector(`td input[name="cuentaContable"]`).value = ui.item.name;

          const cuentaContable = $(tr).find(`input[name="cuentaContable"]`);
          cuentaContable.css("background-color", "inherit");

          if (ui.item.auxiliar)
            tr.querySelector(`td.contacto div`).style.display = ""
          else
            tr.querySelector(`td.contacto div`).style.display = "none"

          if (ui.item.documento)
            tr.querySelector(`td.documento div`).style.display = ""
          else
            tr.querySelector(`td.documento div`).style.display = "none"
        }
      })
      .data("ui-autocomplete")._renderItem = function (ul, item) {
        return $(
          '<li><a><strong class="highlight">' +
          item.name +
          "</strong><em>" +
          item.number +
          "</em><span>" +
          item.type +
          "</span></a></li>"
        ).appendTo(ul);
      };
  },
  showCuentaContable(event) {
    const id = event.target.parentNode.dataset.id;
    $(`tr[data-id="${id}"] input[name="cuentaContable"]`)
      .autocomplete("search", "@")
      .focus();
  },

  checkPeriodoContable() {
    return new Promise((resolve, reject) => {

      $.ajax({
        url: "/4DACTION/_V3_get_estadoPeriodoContable",
        data: {
          periodo: $('#comprobantes [name="docDate"]').val(),
          origen: "ext modulos"
        },
        dataType: "json",
        async: false,
        success: function (subdata) {

          if (subdata.exists == 1) {
            if (subdata.closed == 1) {
              reject()

              toastr.warning(
                "El periodo seleccionado se encuentra cerrado, por tanto no puede guardar este comprobante ."
              );


            } else {
              resolve()
            }

          } else {
            reject()
            toastr.warning(
              "El periodo contable para este comprobante no está creado.");
          }
        }
      });



    });
  },

  checkComprobante(type) {
    return new Promise((resolve, reject) => {

      $.ajax({
        url: "/4DACTION/_force_check_comprobante",
        data: {
          id: comprobantes.data.id,
          type_check: type
        },
        dataType: "json",
        async: false,
        success: function (subdata) {

          if (subdata.success) {
            resolve(true)
          } else {
            reject(false)
          }

        }
      });



    });
  },
  showDialogDTC(object) {
    localStorage.removeItem("id_detalle_comp")

    let id = object.dataset.id
    localStorage.setItem("id_detalle_comp", id)


    unaBase.loadInto.dialog(
      `/v3/views/comprobantes/dialog/${object.dataset.type == "documento" ? 'asignar_dtc.shtml' : 'asignar_contacto.shtml'}?id=`,
      `${object.dataset.type == "documento" ? 'SELECCIONAR DOCUMENTOS DE COMPRA / VENTA' : 'SELECCIONAR CONTACTO'}`,
      "x-large"
    );
  },
  calculateTotals() {

    // Obtener totales agrupados
    const totalesAgrupados = document.querySelectorAll('.tr-total');

    let totalAgrupadoDebe = 0;
    let totalAgrupadoHaber = 0;

    totalesAgrupados.forEach(tr => {
      totalAgrupadoDebe += parseFloat(tr.dataset.totaldebe) || 0;
      totalAgrupadoHaber += parseFloat(tr.dataset.totalhaber) || 0;
    });


    const debeValues = document.querySelectorAll('input[name="debe"]');
    const haberValues = document.querySelectorAll('input[name="haber"]');

    let debe = 0;
    let haber = 0;
    // let re = reFromCurrency(currency);
    for (const item of debeValues) {
      // debe += parseFloat(item.value.replace(reThousand,"").replace(reDecimal, ".")) || 0;
      debe += parseStrToInt(item.value, currency) || 0;
    }
    for (const item of haberValues) {
      // haber += parseFloat(item.value.replace(reThousand,"").replace(reDecimal, ".")) || 0;
      haber += parseStrToInt(item.value, currency) || 0;
    }

    debe += totalAgrupadoDebe
    haber += totalAgrupadoHaber

    const formatearNumero = (numeroTexto, decimales) => {
      const numero = parseFloat(String(numeroTexto).replace(',', '.'));
      return numero.toLocaleString('de-DE', { minimumFractionDigits: decimales, maximumFractionDigits: decimales });
    };



    debe = formatearNumero(debe, currency.decimals)
    haber = formatearNumero(haber, currency.decimals)

    const debeInput = document.querySelector("tr.totals input.debe");
    const haberInput = document.querySelector("tr.totals input.haber");
    const totalInput = document.querySelector("tr.totals input.total");

    debeInput.value = debe
    haberInput.value = haber
    totalInput.value = formatearNumero(Math.abs(parseFloat(debe.replace(/\./g, '')) - parseFloat(haber.replace(/\./g, ''))), currency.decimals);

    const debeRaw = debe.replace(/[.,]/g, "");
    const haberRaw = haber.replace(/[.,]/g, "");

    if (Math.abs(debeRaw - haberRaw) !== 0) totalInput.classList.add("redBold");
    else totalInput.classList.remove("redBold");


    if (debeRaw > haberRaw) {
      haberInput.classList.add("redBold");
      debeInput.classList.remove("redBold");
    } else if (debeRaw < haberRaw) {
      haberInput.classList.remove("redBold");
      debeInput.classList.add("redBold");
    } else {
      haberInput.classList.remove("redBold");
      debeInput.classList.remove("redBold");
    }
  },

  duplicate: () => {
    $.ajax({
      url: '/4DACTION/_V3_duplicateAsientos',
      type: 'POST',
      dataType: 'json',
      data: {
        idAsiento: comprobantes.id,
      }
    }).done(function (data) {
      if (data.success === true) {
        window.open("http://" + window.location.host + "/4DACTION/wbienvenidos#comprobantes/content.shtml?id=" + encodeURIComponent(data.idAsiento), "_blank");
      } else {
        toastr.error("Error al duplicar, intente nuevamente.");
      }
    }).fail(function () {
      toastr.error("Error al duplicar, intente nuevamente.");
    });
  },

  formatInput(event) {
    let input_value = event.value
    input_value = unaBase.utilities.transformNumber(input_value, 'int');
    //comprobantes.calculateTotals();

  },

  onClickInput(e) {
    e.select();
  },
  getDetail(id) {

    const detail = document.querySelector(`tr[data-id="${id}"]`);
    return {
      line: detail,
      inputs: detail.querySelectorAll("input"),
      tds: detail.querySelectorAll("td"),
    };
  },
  block(id) {
    console.log("block");
    const items = document.querySelectorAll(`tr[data-id="${id}"] input`);
    for (const item of items) {
      if (item.name !== "codigoCuenta") item.toggleAttribute("readOnly");
    }
  },
  saveAndAdd(html) {
    // html.find(`input[name="haber"]`).keydown(function (event) {
    //   console.log("on key down");
    //   console.log(event);
    //   const keyDown = event.keyCode;

    //   const cuentaContable = $(this)
    //     .closest("tr")
    //     .find(`input[name="cuentaContable"]`);
    //   if (keyDown === 13 && cuentaContable.val() !== "") {
    //     // $(this)
    //     //   .closest("td")
    //     //   .next()
    //     //   .find("button.save")
    //     //   .click();
    //     unaBase.ui.block();
    //     setTimeout(() => {
    //       $(`li[data-name="addDetails"] button`).click();

    //       unaBase.ui.unblock();
    //     }, 1000);
    //   } else if (keyDown === 13 && cuentaContable.val() === "") {
    //     cuentaContable.css("background-color", "red");
    //     toastr.warning("Debes seleccionar una cuenta contable.");
    //   }
    // });
  },
  edit: function (event) {

    let res = comprobantes.checkPeriodoContable()

    const id = $(event.target).closest("tr")[0].dataset.id;

    $(`tr[data-id="${id}"] button.search-btn`).css("display", "");

    document.querySelector(`tr[data-id="${id}"] button.edit`).style.display = "none";
    document.querySelector(`tr[data-id="${id}"] button.show.cuentaContable`).style.display = "";
    document.querySelector(`tr[data-id="${id}"] button.save`).style.display = "";


    comprobantes.block(id);
  },
  save: function (event) {
    try {
      if (!(comprobantes && comprobantes.id > 0)) {
        toastr.warning("Debes Guardar el comprobantes antes de agregar un detalle.");
        return;
      }

      const $tr = $(event.target).closest("tr");
      const trEl = $tr[0];
      if (!trEl) return;

      const idRow = trEl.dataset?.id || "0";
      let iddetalle = idRow;

      // Helpers
      const toText = (v) => (v === undefined || v === null) ? "" : String(v);
      const parseMoney = (v) => {
        const s = toText(v).trim();
        if (!s) return 0;
        const n = parseFloat(s.replace(/\./g, "").replace(",", "."));
        return Number.isFinite(n) ? n : 0;
      };

      // Inputs base
      const $cuentaContable = $tr.find('input[name="cuentaContable"]');
      const debe = parseMoney($tr.find('input[name="debe"]').val());
      const haber = parseMoney($tr.find('input[name="haber"]').val());

      if (!$cuentaContable.length || $cuentaContable.val() === "") {
        if ($cuentaContable.length) $cuentaContable.css("background-color", "red");
        toastr.warning("Debes seleccionar una cuenta contable.");
        return;
      }

      const debeGt0 = debe > 0;
      const haberGt0 = haber > 0;
      if ((!debeGt0 && !haberGt0) || (debeGt0 && haberGt0)) {
        toastr.warning("Debes agregar un valor en debe o haber.");
        return;
      }

      if ($tr.hasClass("new")) iddetalle = 0;

      // =========================
      // ✅ Centro de costo desde SELECT (de la fila)
      // =========================
      let cCosto = "";
      let cCostoDesc = "";
      
      const selectEl = trEl.querySelector("select.c_costo-select");
      if (selectEl) {
        // id
        cCosto = toText(selectEl.value).trim();

        // texto: preferir TomSelect si existe (más fiable)
        try {
          if (selectEl.tomselect && cCosto) {
            const opt = selectEl.tomselect.getOption(cCosto);
            cCostoDesc = opt ? opt.textContent.trim() : "";
          } else if (selectEl.selectedOptions && selectEl.selectedOptions.length > 0) {
            cCostoDesc = toText(selectEl.selectedOptions[0].text).trim();
          }
        } catch (e) {
          // fallback a selectedOptions
          if (selectEl.selectedOptions && selectEl.selectedOptions.length > 0) {
            cCostoDesc = toText(selectEl.selectedOptions[0].text).trim();
          }
        }

        // si es el placeholder, lo dejamos vacío
        if (cCosto === "" || cCostoDesc.toLowerCase().includes("selecciona")) {
          cCosto = "";
          cCostoDesc = "";
        }
      } else {
        // Fallback ultra defensivo por si no existe el select (no debería)
        cCosto = toText($tr.find('input[name="c_costo"]').val()).trim();
        cCostoDesc = toText($tr.find('input[name="c_costo_desc"]').val()).trim();
      }

      // =========================
      // Payload base (tu lógica)
      // =========================
      const detail = comprobantes.getDetail(idRow);
      const inputs = detail?.inputs || [];
      const tds = detail?.tds || [];

      const data = domFunc.getObjectFromNodes(inputs) || {};

      // ✅ Inyectar centro costo
      data.c_costo = cCosto;
      data.c_costo_desc = cCostoDesc;
      data.c_costo_desc_2 = toText($tr.find('input[name="c_costo_2"]').val()).trim();
      // Documento/Auxiliar (tu lógica)
      if (comprobantes.data && comprobantes.data.docType && tds.length >= 2) {
        data.idAuxiliar = tds[0]?.dataset?.idcont || "";
        data.idDocumento = tds[1]?.dataset?.iddoc || "";
        data.tipoDocumento = (tds[1]?.dataset?.doctype || "").toString().toLowerCase();
      }

      $.ajax({
        url: `/4DACTION/_V3_setComprobanteDetalle`,
        dataType: "json",
        type: "POST",
        async: false,
        data: {
          id: iddetalle,
          ...data,
          idComprobante: comprobantes.id
        },
        success: function (d) {
          try {
            if (d && d.success) {
              $(`tr[data-id="${idRow}"] button.search-btn`).css("display", "none");

              const rowSelector = `tr[data-id="${idRow}"]`;
              const row = document.querySelector(rowSelector) || trEl;

              const btnEdit = row.querySelector("button.edit");
              const btnShow = row.querySelector("button.show.cuentaContable");
              const btnSave = row.querySelector("button.save");

              if (btnEdit) btnEdit.style.display = "";
              if (btnShow) btnShow.style.display = "none";
              if (btnSave) btnSave.style.display = "none";

              comprobantes.block(idRow);

              row.dataset.id = d.id;
              row.classList.remove("new");

              const active = document.getElementById("active");
              if (active && typeof d.activo !== "undefined") active.checked = !!d.activo;

              if (typeof comprobantes.calculateTotals === "function") comprobantes.calculateTotals();

              if (typeof comprobantes.validate === "function" && comprobantes.validate()) {
                toastr.success(NOTIFY.get("SUCCESS_SAVE"));
                if (event && event.keyCode && event.keyCode == 13) {
                  $('li[data-name="addDetails"] button').trigger("click");
                }
              } else {
                toastr.success(NOTIFY.get("ACCOUNT_WARNING_EQUAL"));
              }
            } else {
              const msg = (d && d.errorMsg) ? d.errorMsg : NOTIFY.get("ERROR_INTERNAL");
              toastr.warning(msg);
            }
          } catch (e) {
            console.error("save success handler error:", e);
            toastr.error("Error interno procesando respuesta del servidor.");
          }
        },
        error: function (xhr, status, err) {
          console.error("save ajax error:", status, err, xhr);
          toastr.error("Error interno. Inténtalo de nuevo más tarde.");
        }
      });

    } catch (e) {
      console.error("save error:", e);
      toastr.error("Ocurrió un error al guardar el detalle.");
    }
  },
  delete: function (event) {
    const id = $(event.target).closest("tr")[0].dataset.id;

    $.ajax({
      url: `/4DACTION/_V3_setComprobanteDetalle`,
      dataType: "json",
      type: "POST",
      data: {
        delete: true,
        id
      }
    }).done(function (data) {
      if (data.success) {
        const line = document.querySelector(`tr[data-id="${id}"]`);
        line.parentNode.removeChild(line);
        comprobantes.calculateTotals();
        toastr.success(NOTIFY.get("SUCCESS_DELETE"));
      } else {
        toastr.success(NOTIFY.get("ERROR_INTERNAL"));
      }
    });
  },
  validateNumbers() {
    const debeValues = document.querySelectorAll('input[name="debe"]');
    const haberValues = document.querySelectorAll('input[name="haber"]');
    let debe = 0;
    let haber = 0;
    // let patternThousand = `\\${currency.thousands_sep}`;
    // let patternDecimal = `\\${currency.decimals_sep}`;
    // let reThousand = new RegExp(patternThousand, "g");
    // let reDecimal = new RegExp(patternDecimal, "g");
    // let re = reFromCurrency(currency);
    for (const item of debeValues) {
      // debe += parseFloat(item.value.replace(reThousand,"").replace(reDecimal, ".")) || 0;
      debe += parseStrToInt(item.value, currency) || 0;
    }
    for (const item of haberValues) {
      // haber += parseFloat(item.value.replace(reThousand,"").replace(reDecimal, ".")) || 0;
      haber += parseStrToInt(item.value, currency) || 0;
    }
    debe = debe.toFixed(2)
    haber = haber.toFixed(2)

    //Verificar totales si corresponde a comprobante masivo
    if (comprobantes.data.records?.total < 5000) {
      return debe === haber;
    } else {

      const debeInput = document.querySelector("tr.totals input.debe").value;
      const haberInput = document.querySelector("tr.totals input.haber").value;

      // Elimina puntos y convierte a número
      const debe = Number(debeInput.replace(/\./g, ""));
      const haber = Number(haberInput.replace(/\./g, ""));

      // Compara los valores numéricos
      return debe === haber;

    }

  },
  validate() {
    const docType = document.querySelector(`select[name="docType"]`);
    const description = document.querySelector(`[name="description"]`);

    if (description.value === '') {
      description.style.border = '2px solid #F47975'
    }

    if (docType.value === '') {
      docType.style.border = '2px solid #F47975'
    }


    return docType.value !== "" && description.value !== "";
  },
  menu: function () {
    unaBase.toolbox.init();
    unaBase.toolbox.menu.init({
      entity: "Comprobantes",
      buttons: ["saveComprobante", "exit", "addDetails", "exportExcel", 'generate_reverse_provision', 'duplicateAsiento'],
      data: function () {
        comprobantes.data = domFunc.getDataByClassName("item");
        return comprobantes.data;
      },
      validate: function () {
        return comprobantes.validate();
      }
    });
  },
  addEvent13: (i = "") => {
    $(`tr${i != "" ? '[data-id="' + i + '"]' : ''} input`).keypress(function (event) {

      var keycode = (event.keyCode ? event.keyCode : event.which);
      const tr = event.target.closest('tr')
      if (keycode == '13') {
        comprobantes.save(event)
      }
    });

  },
  addFormatAll: (i = '') => {
    $(`tr${i != "" ? '[data-id="' + i + '"]' : ''} input.format-all`).keyup(function (event) {

      var keycode = (event.keyCode ? event.keyCode : event.which);
      if (keycode != '13' && this.value != '') {
        if (this.value.includes('-') && this.value.length > 1) {
          this.value = '-' + unaBase.utilities.transformNumber(this.value, "format-all")
        }


        // if(!this.value.includes('-')){
        //   this.value = unaBase.utilities.transformNumber(this.value, "format-all")
        // }
      }
    });

  },
  duplicate: () => {
    $.ajax({
      url: '/4DACTION/_V3_duplicateAsientos',
      type: 'POST',
      dataType: 'json',
      data: {
        idAsiento: comprobantes.id,
      }
    }).done(function (data) {
      if (data.success === true) {
        window.open("http://" + window.location.host + "/4DACTION/wbienvenidos#comprobantes/content.shtml?id=" + encodeURIComponent(data.idAsiento), "_blank");
      } else {
        toastr.error("Error al duplicar, intente nuevamente.");
      }
    }).fail(function () {
      toastr.error("Error al duplicar, intente nuevamente.");
    });
  }
};

$(document).ready(function () {
  unaBase.ui.block();
  comprobantes.menu();
  comprobantes.init($("#comprobantes").data("id"));
  unaBase.ui.unblock();
  unaBase.ui.expandable.init();

  document.querySelector('#excluir').checked = comprobantes.data.excluir


  document.querySelector('#check_apertura').checked = comprobantes.data.apertura

  if (!access._650) {
    $("#excluir-check").hide();
  }

  if (!access._682) {
    $("#check-active").hide();
  }
});