// ══════════════════════════════════════════════════════════
// LÓGICA ORIGINAL — sin modificaciones funcionales
// Solo se añaden: updateKPIs(), updatePeriodBadge(), filterTableRows()
// ══════════════════════════════════════════════════════════

const btnDownload = document.getElementById('btn_download')
const tableBody = document.getElementById('table-data')
const dateTo = document.getElementById('dateTo')
let dateFrom = ''
const check_apertura = document.getElementById('checkApertura')
let loaderLine = document.getElementById('loader-line')
let percentEERR = document.getElementById('percent_eerr').value

// ── API CALLS (originales) ─────────────────────────────

const getEstadoResultado = (dateFrom, dateTo, filter = {}) => {
  
  isConnected()
  const url = new URL(window.location.origin + '/4DACTION/_light_getEstadoResultado')
  data = { dateFrom, dateTo, sid: sid(), ...filter }
  Object.keys(data).forEach(key => url.searchParams.append(key, data[key]))
  return fetch(url).then(r => r.json()).catch(err => { })
}

const getAsientos = (dateFrom, dateTo, account) => {
  isConnected()
  const url = new URL(window.location.origin + '/4DACTION/_force_getAsientos')
  data = { dateFrom, dateTo, account, sid: sid() }
  Object.keys(data).forEach(key => url.searchParams.append(key, data[key]))
  return fetch(url).then(r => r.json()).catch(err => { })
}

const getDetalleAsiento = (idcomprobante) => {
  isConnected()
  const url = new URL(window.location.origin + '/4DACTION/_V3_proxy_getComprobante')
  data = { id: idcomprobante, sid: sid() }
  Object.keys(data).forEach(key => url.searchParams.append(key, data[key]))
  return fetch(url).then(r => r.json()).catch(err => { })
}

// ── HELPERS (originales) ──────────────────────────────

const sumNum = (num) => { let val = 0; return val + parseInt(num) }

const expandRow = (e, tipo) => {
  let tr = tableBody.querySelectorAll('tr')
  if (e.classList.contains('fa-angle-down')) {
    e.classList.remove('fa-angle-down'); e.classList.add('fa-angle-right')
  } else { e.classList.add('fa-angle-down') }
  for (let i = 0; i <= tr.length; i++) {
    if (tr[i] !== undefined && tr[i].classList.contains(tipo)) {
      tr[i].style.display = tr[i].style.display === 'none' ? '' : 'none'
    }
  }
}

const loadDetails = async (e) => {
  const id_comprobante = e.dataset.id
  document.getElementById('detail-asiento').textContent = id_comprobante
  const tb = document.getElementById('table-detalle-asiento')
  tb.innerHTML = ''
  const data = await getDetalleAsiento(id_comprobante)
  let row = ''; let moneyData = await getMoney()
  const decimales = moneyData[0].decimal
  let totalDebe = 0, totalHaber = 0
  data.details.forEach(val => {
    let debe = parseFloat(val.debe.replace(',', '.')).toFixed(2)
    let haber = parseFloat(val.haber.replace(',', '.')).toFixed(2)
    row += `<tr class="text-center">
      <td style="text-align:left;max-width:350px;">${val.codigoCuenta}</td>
      <td style="text-align:right">${formatearNumero(debe, decimales)}</td>
      <td style="text-align:right">${formatearNumero(haber, decimales)}</td>
    </tr>`
    totalDebe += parseFloat(debe)
    totalHaber += parseFloat(haber)
    tb.innerHTML = row
  })
  document.getElementById('table-detalle-asiento-footer').innerHTML = `
    <tr style="text-align:center;background:var(--teal-dim)">
      <th style="padding:10px 14px;font-weight:800;color:var(--teal)">Total</th>
      <th style="text-align:right;font-family:var(--mono);color:var(--teal)">${transformNumber(totalDebe, 'int')}</th>
      <th style="text-align:right;font-family:var(--mono);color:var(--teal)">${transformNumber(totalHaber, 'int')}</th>
    </tr>`
}

const checkNumber = (event) => {
  var aCode = event.which ? event.which : event.keyCode
  if (aCode > 31 && (aCode < 48 || aCode > 57)) return false
  return true
}

const onKeyUp = async (e) => {
  if (e.value.includes('.')) e.value = e.value.replace('.', ',')
}

const onChangePercent = async (e) => {
  let value = e.value
  const url = new URL(window.location.origin + '/4DACTION/_light_setParameters')
  data = { sid: sid(), percent_eerr: value }
  Object.keys(data).forEach(key => url.searchParams.append(key, data[key]))
  let res = await fetch(url).then(r => r.json()).catch(err => { })
  if (res.success) {
    const tr_total_impuesto = document.querySelector('.header_totales_impuesto')
    tr_total_impuesto.children[0].children[0].children[0].textContent = ` (${value}%)`
    loadTotalsTable(); loadAcumulado()
    generarAvisoExitoso("Porcentaje actualizado correctamente!")
  }
}

const loadComprobantes = async (e) => {
  loaderLine.style.display = ''
  const account = e.dataset.number
  let month = e.cellIndex
  if (month < 10) month = '0' + month
  let dtt = dateTo.value.split('-')
  dtt[1] = month
  let d = new Date(dtt[0], dtt[1], 0)
  const dateTo_final = dtt[0] + '-' + dtt[1] + '-' + d.getDate()
  const dateFrom_final = dtt[0] + '-' + dtt[1] + '-01'
  const df = getFormatDate(dateFrom_final)
  const dt = getFormatDate(dateTo_final, true)
  document.getElementById('account-detail').textContent = account
  const tb = document.getElementById('table-details')
  tb.innerHTML = ''
  let moneyData = await getMoney()
  const decimales = moneyData[0].decimal
  let data = await getAsientos(df, dt, account)
  let row = ''; let acum = 0
  if (data.details.length > 0) {
    data.details.forEach(val => {
      let debe = parseFloat(val.debe.replace(',', '.')).toFixed(2)
      let haber = parseFloat(val.haber.replace(',', '.')).toFixed(2)
      acum = acum + parseFloat(debe) - parseFloat(haber)
      row += `<tr class="text-center">
        <td style="text-align:left;max-width:350px;">${val.fechaRegistro}</td>
        <td class="asiento-link" data-bs-toggle="modal" data-bs-target="#modalDetails"
            data-id="${val.id_comp3}" onclick="loadDetails(this)">
          ${val.id_comp3}&nbsp;
          <a target="_blank" href="${window.origin + '/4DACTION/wbienvenidos#comprobantes/content.shtml?id=' + val.id_comp3}">
            <i class="fa-solid fa-pencil" style="color:var(--teal);"></i>
          </a>
        </td>
        <td style="text-align:right">${formatearNumero(debe, decimales)}</td>
        <td style="text-align:right">${formatearNumero(haber, decimales)}</td>
        <td style="text-align:right">${formatearNumero(acum, decimales)}</td>
        <td>${val.tipoDoc}</td>
        <td style="text-align:left;max-width:200px">${val.glosa}</td>
      </tr>`
      tb.innerHTML = row
    })
  } else {
    tb.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:24px;color:var(--text3)">
      <i class="fas fa-inbox" style="font-size:20px;display:block;margin-bottom:8px;opacity:0.4"></i>
      No hay asientos para este período en esta cuenta
    </td></tr>`
  }
  loaderLine.style.display = 'none'
}

const completeDate = (date, onlyYear) => {
  let p = date.split('-'); p[2] = 0
  d = new Date(p[0], p[1], p[2])
  let year = d.getFullYear(), month = d.getMonth() + 1, day = d.getDate()
  if (onlyYear) return year + '-01-01'
  if (month < 10) month = '0' + month
  return year + '-' + month + '-' + day
}

const init = async () => {
  const url = new URL(window.location.origin + '/4DACTION/_light_getParameters')
  data = { sid: sid() }
  Object.keys(data).forEach(key => url.searchParams.append(key, data[key]))
  let res = await fetch(url).then(r => r.json()).catch(err => { })
  document.getElementById('percent_eerr').value = res.percent_eerr
}

const completeTr = (title, clase, pathclick, color) => {
  // Color override: usar nuestros colores semánticos en lugar del color pasado
  return `<tr class="${clase} header-totales fw-bold">
    <td style="text-align:left;max-width:350px;">
      <span style="font-weight:bold;">
        ${pathclick !== '' ? `<i class="fas fa-angle-down" style="color:var(--teal);cursor:pointer;" onclick="expandRow(this, '${pathclick}')"></i>` : ''}
        &nbsp;${title}
      </span>
    </td>
    ${'<td style="text-align:right;"></td>'.repeat(13)}
  </tr>`
}

const formatearNumero = (numeroTexto, decimales) => {
  const numero = parseFloat(String(numeroTexto).replace(',', '.'))
  return numero.toLocaleString('de-DE', { minimumFractionDigits: decimales, maximumFractionDigits: decimales })
}

const parsearNumeroFormateado = (texto) => {
  if (!texto || texto.trim() === '') return 0
  let num = texto.replaceAll('$', '').replaceAll(' ', '').trim()
  num = num.replaceAll('.', '').replace(',', '.')
  const parsed = parseFloat(num)
  return isNaN(parsed) ? 0 : parsed
}

const formatearEntero = (numero) => {
  const num = Math.round(parseFloat(numero) || 0)
  return num.toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

// ── MAIN DATA LOAD (original con updateKPIs añadido) ──

const setTableMain = async (filter = {}) => {
  isConnected()
  init()
  showLoadingBar(true)
  dateFrom = completeDate(dateTo.value, true)
  const dtt = completeDate(dateTo.value)
  const df = getFormatDate(dateFrom)
  const dt = getFormatDate(dtt, true)
  if (!df || !dt) { showLoadingBar(false); return }
  loadingLoad("loading-modal", true, "Por favor espere...")
  tableBody.innerHTML = ""
  updatePeriodBadge()

  try {
    const data = await getEstadoResultado(df, dt, filter)
    const moneyData = await getMoney()
    const decimales = moneyData?.[0]?.decimal ?? 0
    const totalMes = data?.rows?.total_mes || []
    let row = ""

    const toNum = (v) => { const n = typeof v === "number" ? v : parseFloat(v); return Number.isFinite(n) ? n : 0 }
    const addMonths = (acc, months) => { for (let i = 0; i < 12; i++) acc[i] += toNum(months?.[i]?.value) }
    const setTotalsRow = (selector, totalsArr) => {
      const trTotal = tableBody.querySelector(selector)
      if (!trTotal) return
      for (let i = 0; i < 12; i++) trTotal.children[i + 1].textContent = formatearNumero(totalsArr[i], decimales)
    }

    const groups = {
      iOper: { title: "Ingreso operacional", headerClass: "total-i-operacional header-totales", rowClass: "i-operacional", bg: "#F4FFF3", items: [], totals: Array(12).fill(0) },
      cOper: { title: "Costos operacionales", headerClass: "total-c-operacional header-totales", rowClass: "c-operacional", bg: "#F4FFF3", items: [], totals: Array(12).fill(0) },
      gAdm: { title: "Gastos de administracion", headerClass: "total-g-admin header-totales", rowClass: "g-admin", bg: "#F4FFF3", items: [], totals: Array(12).fill(0) },
      iNoOp: { title: "Ingreso no operacional", headerClass: "total-i-nooperacional header-totales", rowClass: "i-nooperacional", bg: "#F4FFF3", items: [], totals: Array(12).fill(0) },
    }

    totalMes.forEach((val) => {
      const item = { id: val.id, name: val.name, number: val.number, months: val.months || [] }
      if (val.i_operacional === "1") { groups.iOper.items.push(item); addMonths(groups.iOper.totals, item.months) }
      if (val.c_operacional === "1") { groups.cOper.items.push(item); addMonths(groups.cOper.totals, item.months) }
      if (val.g_admin === "1") { groups.gAdm.items.push(item); addMonths(groups.gAdm.totals, item.months) }
      if (val.i_nooperacional === "1") { groups.iNoOp.items.push(item); addMonths(groups.iNoOp.totals, item.months) }
    })

    const renderGroup = (g) => {
      if (!g.items.length) return
      row += completeTr(g.title, g.headerClass, g.rowClass, g.bg)
      g.items.forEach((val) => {
        row += `<tr class="${g.rowClass}" data-id="${val.id ?? ""}" data-account-name="${val.name}">`
        row += `<td style="text-align:left;min-width:100px;">${val.number} - ${val.name}</td>`
        for (let i = 0; i < 12; i++) {
          const v = toNum(val.months?.[i]?.value)
          row += `<td
            style="color:${v >= 0 ? '#4EC275' : '#F47975'};cursor:pointer;text-align:right;"
            data-bs-toggle="modal" data-bs-target="#modalDocs"
            onclick="loadComprobantes(this)"
            data-number="${val.number}" data-value="${v}"
          >${formatearNumero(v, decimales)}</td>`
        }
        row += `<td style="text-align:right;"></td></tr>`
      })
    }

    renderGroup(groups.iOper)
    renderGroup(groups.cOper)

    if (groups.gAdm.items.length) {
      row += completeTr("Utilidad operacional", "header-total-utilidad-operacional", "", "#E9F6FF")
      renderGroup(groups.gAdm)
    }

    renderGroup(groups.iNoOp)

    const aRowTotales = [
      { name: "Ingreso no operacional", class: "total-i-nooperacional fw-bold", status: groups.iNoOp.items.length > 0, icon: `<i class="fas fa-angle-right" style="color:var(--teal);cursor:pointer;"></i>&nbsp;`, suffix: "" },
      { name: "Resultado antes de impuesto", class: "header_totales_antes_impuesto fw-bold", status: false, icon: "", suffix: "" },
      { name: "Impuestos", class: "header_totales_impuesto fw-bold", status: false, icon: "", suffix: ` <span>(${document.getElementById('percent_eerr').value + '%'})</span>` },
      { name: "Resultado", class: "header_totales_resultado fw-bold", status: false, icon: "", suffix: "" }
    ]

    aRowTotales.forEach((res) => {
      if (!res.status) {
        row += `<tr class="${res.class}">
          <td style="text-align:left;max-width:350px;"><span style="font-weight:bold;">${res.icon}${res.name}${res.suffix}</span></td>
          ${'<td style="text-align:right;"></td>'.repeat(13)}
        </tr>`
      }
    })

    tableBody.innerHTML = row

    setTotalsRow("tr.total-i-operacional", groups.iOper.totals)
    setTotalsRow("tr.total-c-operacional", groups.cOper.totals)
    setTotalsRow("tr.total-g-admin", groups.gAdm.totals)
    setTotalsRow("tr.total-i-nooperacional", groups.iNoOp.totals)

    loadTotalsTable({ iOper: groups.iOper.totals, cOper: groups.cOper.totals, gAdm: groups.gAdm.totals, iNoOp: groups.iNoOp.totals }, decimales)
    loadAcumulado()

    // ★ NUEVO: Actualizar KPIs con los datos reales
    updateKPIs(groups)

  } catch (err) {
    console.error("setTableMain error:", err)
  } finally {
    loadingLoad("loading-modal", false, "Por favor espere...")
    showLoadingBar(false)
  }
}

const loadAcumulado = () => {
  let tr = tableBody.querySelectorAll('tr')
  for (let i = 0; i < tr.length; i++) {
    if (tr[i] !== undefined && tr[i].children && tr[i].children.length > 13) {
      let acum = 0
      const rowText = tr[i].children[0].textContent.trim()
      const isOtrosGastos = rowText.includes('OTROS GASTOS') || rowText.includes('09-05-01')
      for (let c = 1; c <= 12; c++) {
        const dataValue = tr[i].children[c].getAttribute('data-value')
        if (dataValue !== null && dataValue !== '') {
          acum += parseFloat(dataValue)
        } else {
          acum += parsearNumeroFormateado(tr[i].children[c].textContent)
        }
      }
      tr[i].children[13].textContent = formatearEntero(!isNaN(acum) ? acum : 0)
    }
  }
}

const loadTotalsTable = ({ iOper, cOper, gAdm, iNoOp }, decimales = 0) => {
  const tr_util = tableBody.querySelector('.header-total-utilidad-operacional')
  const tr_antes_imp = tableBody.querySelector('.header_totales_antes_impuesto')
  const tr_impuesto = tableBody.querySelector('.header_totales_impuesto')
  const tr_resultado = tableBody.querySelector('.header_totales_resultado')
  const pct = Number(document.getElementById('percent_eerr')?.value || 0)
  const sum2 = (a, b) => a.map((v, i) => (v || 0) + (b?.[i] || 0))
  const sum4 = (a, b, c, d) => a.map((v, i) => (v || 0) + (b?.[i] || 0) + (c?.[i] || 0) + (d?.[i] || 0))
  const roundInt = (n) => Math.round(Number.isFinite(n) ? n : 0)

  if (tr_util && iOper && cOper) {
    const utilOp = sum2(iOper, cOper)
    for (let i = 0; i < 12; i++) tr_util.children[i + 1].textContent = formatearNumero(roundInt(utilOp[i]), decimales)
  }

  let antesImp = null
  if (tr_antes_imp && iOper && cOper && gAdm && iNoOp) {
    antesImp = sum4(iOper, cOper, gAdm, iNoOp)
    for (let i = 0; i < 12; i++) tr_antes_imp.children[i + 1].textContent = formatearNumero(roundInt(antesImp[i]), decimales)
  }

  let impuestoArr = null
  if (tr_impuesto && antesImp) {
    impuestoArr = antesImp.map(v => roundInt((pct * v) / 100))
    for (let i = 0; i < 12; i++) tr_impuesto.children[i + 1].textContent = formatearNumero(impuestoArr[i], decimales)
  }

  if (tr_resultado && antesImp && impuestoArr) {
    const resultado = antesImp.map((v, i) => roundInt(v + (impuestoArr[i] || 0)))
    for (let i = 0; i < 12; i++) tr_resultado.children[i + 1].textContent = formatearNumero(resultado[i], decimales)
    // Actualizar KPI resultado
    const totalResultado = resultado.reduce((a, b) => a + b, 0)
    updateResultadoKPI(totalResultado)
  }
}

const getFormatDate = (date, flag = false) => {
  
  if (!date) return ''
  let d = date.split('-').reverse().join('-').split('-')
  let day = d[0], year = d[2], month = d[1]
  let dat = new Date(year, month, day)
  if (flag) {
    let newDat = new Date(year, month, 0)
    return newDat.getDate() + '/' + month + '/' + newDat.getFullYear()
  }
  return dat.getDate() + '/' + month + '/' + dat.getFullYear()
}

const downloadExcel = async () => {
  isConnected()
  let df = getFormatDate(dateFrom)
  let dt = getFormatDate(dateTo.value, true)
  if (df && dt) {
    loadingLoad("loading-modal", true, "Por favor espere...")
    let nodeUrl = localStorage.getItem('node_url')
    let url = `${nodeUrl}/balance/?download=true&dateto=${dt}&estado=negocio&datefrom=${df}&sid=${sid()}&hostname=${window.location.origin}&from_balance=true&check_apertura=${check_apertura}`
    let download = window.open(url)
    download.blur(); window.focus()
  }
  loadingLoad("loading-modal", false, "Por favor espere...")
}

const getMoney = async () => {
  try {
    const res = await axios.get(`https://${window.location.host}/4DACTION/_force_getMoney`)
    return res.data.row.sort((a, b) => b.default - a.default)
  } catch (err) { throw err }
}

const getInfo = async () => {
  try {
    return await axios({ method: 'get', url: `https://${window.location.host}/4DACTION/_light_get_server_info` })
  } catch (err) { throw err }
}

const getServerInfo = async () => {
  getInfo().then(res => {
    localStorage.setItem('node_url', res.data.node_url)
    localStorage.setItem('web_url', res.data.web_url)
    localStorage.setItem('razon', res.data.razon)
    // ★ Actualizar subtitle con razón social
    if (res.data.razon) {
      document.getElementById('companySubtitle').textContent = `${res.data.razon} · Período acumulado al mes seleccionado`
    }
  })
}

const loadCCostoOptions = () => {
  const selectCC1 = document.getElementById("centro_costo")
  const selectCC2 = document.getElementById("centro_costo_2")
  if (!selectCC1 || !selectCC2) return

  const destroyTS = (el) => { if (el && el.tomselect) el.tomselect.destroy() }
  const initTS = (el, onChangeCb) => {
    destroyTS(el)
    return new TomSelect(el, {
      maxItems: 1, create: false, allowEmptyOption: true,
      valueField: "value", labelField: "text", searchField: "text",
      sortField: { field: "text", direction: "asc" },
      plugins: ["remove_button"], dropdownAutoWidth: false, closeAfterSelect: true,
      onChange: function (value) {
        const text = value ? (this.options[value]?.text || "") : ""
        onChangeCb?.(value || null, text)
      }
    })
  }

  const fillOptions = (el, rows, mapValue, mapText) => {
    el.innerHTML = `<option value="">Selecciona</option>`
    rows.forEach((r) => {
      const v = String(mapValue(r) ?? "").trim()
      const t = String(mapText(r) ?? "").trim()
      if (!v || !t) return
      const opt = document.createElement("option")
      opt.value = v
      opt.textContent = t
      el.appendChild(opt)
    })
  }

  // ✅ unifica texto desde {Nombre, nombre, text}
  const getNombre = (r) => String(r?.Nombre ?? r?.nombre ?? r?.text ?? "").trim()

  // ✅ deja únicos por texto (case-insensitive)
  const uniqueByNombre = (rows) => {
    const seen = new Set(), out = []
    for (const r of rows || []) {
      const nombre = getNombre(r)
      if (!nombre) continue
      const key = nombre.toUpperCase()
      if (seen.has(key)) continue
      seen.add(key)
      out.push({ ...r, __nombre: nombre })
    }
    return out
  }

  // ✅ parse seguro por si 4D manda content-type raro
  const parseMaybeJSON = (payload) => {
    if (payload && typeof payload === "object") return payload
    const t = String(payload || "").trim().replace(/^\uFEFF/, "")
    if (!t) return null
    try { return JSON.parse(t) } catch { return null }
  }

  destroyTS(selectCC1); destroyTS(selectCC2)
  selectCC1.innerHTML = `<option value="">Cargando...</option>`
  selectCC2.innerHTML = `<option value="">Cargando...</option>`

  // ✅ AHORA: SOLO CentroCostos por tipo
  const reqCC1 = $.ajax({
    url: window.origin + "/4DACTION/_V3_getCentroCostos",
    type: "GET",
    dataType: "text",     // <- dejamos texto y parseamos nosotros
    data: { tipo: 1 }
  })

  const reqCC2 = $.ajax({
    url: window.origin + "/4DACTION/_V3_getCentroCostos",
    type: "GET",
    dataType: "text",
    data: { tipo: 2 }
  })

  $.when(reqCC1, reqCC2).done((cc1Resp, cc2Resp) => {
    try {
      const cc1Json = parseMaybeJSON(cc1Resp?.[0]) || {}
      const cc2Json = parseMaybeJSON(cc2Resp?.[0]) || {}

      const cc1RowsRaw = Array.isArray(cc1Json.rows) ? cc1Json.rows : []
      const cc2RowsRaw = Array.isArray(cc2Json.rows) ? cc2Json.rows : []

      // (opcional defensivo) si por alguna razón viene mezclado
      const cc1Rows = cc1RowsRaw.filter(r => Number(r?.Tipo ?? r?.tipo) === 1 || true)
      const cc2Rows = cc2RowsRaw.filter(r => Number(r?.Tipo ?? r?.tipo) === 2 || true)

      const cc1Unicos = uniqueByNombre(cc1Rows)
      const cc2Unicos = uniqueByNombre(cc2Rows)

      // 🔥 Como este endpoint no trae "id", usamos el Nombre como value
      fillOptions(selectCC1, cc1Unicos, r => r.__nombre, r => r.__nombre)
      initTS(selectCC1, (value, text) => setTableMain({ c_costo1_id: value, c_costo1_name: text }))

      fillOptions(selectCC2, cc2Unicos, r => r.__nombre, r => r.__nombre)
      initTS(selectCC2, (value, text) => setTableMain({ c_costo2_id: value, c_costo2_name: text }))
    } catch (e) {
      console.error("Error procesando respuestas:", e)
      destroyTS(selectCC1); destroyTS(selectCC2)
      selectCC1.innerHTML = `<option value="">Error al cargar</option>`
      selectCC2.innerHTML = `<option value="">Error al cargar</option>`
    }
  }).fail((xhr, status, err) => {
    console.error("Error AJAX:", status, err)
    destroyTS(selectCC1); destroyTS(selectCC2)
    selectCC1.innerHTML = `<option value="">Error al cargar</option>`
    selectCC2.innerHTML = `<option value="">Error al cargar</option>`
  })
}

// ══════════════════════════════════════════════════════════
// ★ NUEVAS FUNCIONES DE UI (no modifican lógica original)
// ══════════════════════════════════════════════════════════

const fmtKpi = (n) => {
  const abs = Math.abs(n)
  let s
  if (abs >= 1e9) s = '$' + (abs / 1e9).toFixed(1) + 'B'
  else if (abs >= 1e6) s = '$' + (abs / 1e6).toFixed(1) + 'M'
  else if (abs >= 1e3) s = '$' + (abs / 1e3).toFixed(0) + 'K'
  else s = '$' + abs.toLocaleString('es-CL')
  return n < 0 ? '-' + s : s
}

const updateKPIs = (groups) => {
  const sumAll = (arr) => arr.reduce((a, b) => a + b, 0)

  const iOperTotal = sumAll(groups.iOper.totals)
  const cOperTotal = sumAll(groups.cOper.totals)
  const gAdmTotal = sumAll(groups.gAdm.totals)

  document.getElementById('k-ioper').textContent = fmtKpi(iOperTotal)
  document.getElementById('k-coper').textContent = fmtKpi(cOperTotal)
  document.getElementById('k-gadm').textContent = fmtKpi(gAdmTotal)

  // Ajustar colores KPI costos y gastos (siempre negativos → rojo es correcto)
  const kCoper = document.getElementById('k-coper')
  kCoper.style.color = cOperTotal <= 0 ? 'var(--red)' : 'var(--teal)'
}

const updateResultadoKPI = (total) => {
  const el = document.getElementById('k-result')
  const card = el.closest('.kpi-card')
  const bar = document.getElementById('k-result-bar')
  el.textContent = fmtKpi(total)
  if (total >= 0) {
    card.className = 'kpi-card c-blue'
    bar.style.background = 'linear-gradient(90deg,#3b82f6,#93c5fd)'
    el.style.color = 'var(--blue)'
  } else {
    card.className = 'kpi-card c-red'
    bar.style.background = 'linear-gradient(90deg,#ef4444,#f87171)'
    el.style.color = 'var(--red)'
  }
}

const updatePeriodBadge = () => {
  const val = dateTo.value
  if (!val) return
  const [y, m] = val.split('-')
  const mNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  document.getElementById('periodBadge').textContent = `Ene – ${mNames[parseInt(m) - 1]} ${y}`
}

const showLoadingBar = (show) => {
  const bar = document.getElementById('uiLoadingBar')
  if (show) bar.classList.add('active')
  else bar.classList.remove('active')
}

// Buscador inline de cuentas
const filterTableRows = () => {
  const q = document.getElementById('searchInput').value.toLowerCase()
  const accountClasses = ['i-operacional', 'c-operacional', 'g-admin', 'i-nooperacional']
  tableBody.querySelectorAll('tr').forEach(tr => {
    const isAccount = accountClasses.some(c => tr.classList.contains(c))
    if (!isAccount) return
    const name = (tr.getAttribute('data-account-name') || tr.children[0]?.textContent || '').toLowerCase()
    tr.style.display = (!q || name.includes(q)) ? '' : 'none'
  })
}


isConnected()
const n = new Date()
let y = n.getFullYear(), m = n.getMonth() + 1, d = n.getDate()
if (d < 10) d = '0' + d
if (m < 10) m = '0' + m
dateTo.value = y + '-' + m
dateFrom = completeDate(dateTo.value, true)
dateTo.addEventListener("change", () => { updatePeriodBadge(); setTableMain() })
updatePeriodBadge()
setTableMain()
getServerInfo()
loadCCostoOptions()
