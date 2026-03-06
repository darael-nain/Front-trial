const btnDownload = document.getElementById('btn_download')
const btnDownloadXML = document.getElementById('btn_download_xml')
const tableBody = document.getElementById('table-data')
const tableBodyModal = document.getElementById('table-details')
const btnDownloadExcel = document.getElementById('export-excel-mayor')

const dateTo = document.getElementById('dateTo')
const dateFrom = document.getElementById('dateFrom')
const period = document.getElementById('period')
const check_apertura = document.getElementById('checkApertura')



let loaderLine = document.getElementById('loader-line')
// setTimeout(function() {
//   loaderLine.style.display = 'none'; 
// }, 2000);


// Throttled connectivity check to avoid spamming _light_get_server_info
let __connState = { last: 0, pending: null };
const ensureConnected = () => {
  const now = Date.now();
  if (now - __connState.last < 60000) return; // only once per 60s
  if (__connState.pending) return; // already checking
  __connState.pending = getInfo()
    .catch(() => null)
    .finally(() => { __connState.last = Date.now(); __connState.pending = null; });
};

const getBalance = (dateFrom, dateTo, checkapertura = false) => {
  ensureConnected()

  const url = new URL(window.location.origin + '/4DACTION/_V3_getBalance/' + sid())
  data = {
    dateFrom,
    dateTo,
    sid: sid(),
    check_apertura: checkapertura
  }

  Object.keys(data).forEach(key => url.searchParams.append(key, data[key]))
  let res = fetch(url)
    .then(response => response.json())
    .then(json => json)
    .catch(err => {
    });

  return res

}

const getAsientos = (dateFrom, dateTo, account, page, rowsPerPage) => {
  ensureConnected()
  let check_apertura = document.getElementById('checkApertura').checked
  const url = new URL(window.location.origin + '/4DACTION/_force_getAsientos')
  data = {
    dateFrom,
    dateTo,
    account: account,
    sid: sid(),
    page,
    pageSize: rowsPerPage,
    check_apertura
  }

  Object.keys(data).forEach(key => url.searchParams.append(key, data[key]))
  let res = fetch(url)
    .then(response => response.json())
    .then(json => json)
    .catch(err => {
    });

  return res

}

const getDetalleAsiento = (idcomprobante) => {
  ensureConnected()

  const url = new URL(window.location.origin + '/4DACTION/_V3_proxy_getComprobante')
  data = {
    id: idcomprobante,
    sid: sid(),
  }

  Object.keys(data).forEach(key => url.searchParams.append(key, data[key]))
  let res = fetch(url)
    .then(response => response.json())
    .then(json => json)
    .catch(err => {
    });

  return res

}

const sumNum = (num) => {
  let val = 0
  return val + parseInt(num)

}

const formatearNumero = (numeroTexto) => {
  const mid = JSON.parse(localStorage.getItem('defaultMoney'))
  const decimales = parseInt(mid.view_decimal)

  const numero = parseFloat(String(numeroTexto).replace(',', '.'));
  return numero.toLocaleString('de-DE', { minimumFractionDigits: decimales, maximumFractionDigits: decimales });
};

const loadDetails = async (e) => {
  const id_comprobante = e.dataset.id
  document.getElementById('detail-asiento').textContent = id_comprobante

  const tableBody = document.getElementById('table-detalle-asiento')
  tableBody.innerHTML = ''
  const data = await getDetalleAsiento(id_comprobante)
  let row = "";
  let totalDebe = 0, totalHaber = 0
  const opciones = { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: true };

  data.details.forEach(val => {
    row += `<tr class="text-center">`
    row += `<td style="text-align: left; max-width: 350px;">${val.codigoCuenta}</td>`;

    row += `<td style="text-align: right">$ ${transformNumber(val.debe, 'view')}</td>`;
    row += `<td style="text-align: right">$ ${transformNumber(val.haber, 'view')}</td>`;
    row += `</tr>`
    totalDebe += parseFloat(val.debe.replace(',', '.'))
    totalHaber += parseFloat(val.haber.replace(',', '.'))
    tableBody.innerHTML = row


  })

  document.getElementById('table-detalle-asiento-footer').innerHTML = ""
  let footer = ''
  footer += `<tr style="text-align: center; background-color: #E8FBF5;">
                  <th>Total</th>
                  <th style="text-align: right">$ ${formatearNumero(totalDebe)}</th>
                  <th style="text-align: right">$ ${formatearNumero(totalHaber)}</th>
              </tr>`

  document.getElementById('table-detalle-asiento-footer').innerHTML = footer
}

const loadComprobantes = async (e) => {
  //loadingLoad("loading-modal-detail", true, "Por favor espere...");

  loaderLine.style.display = ''
  const account = e.parentNode.dataset.number
  const df = getFormatDate(dateFrom.value)
  const dt = getFormatDate(dateTo.value)

  document.getElementById('account-detail').textContent = account
  let currentPage = 1;


  const container = document.querySelector('.containerrows');

  let select = document.createElement('select');
  select.id = 'rowsperpage';
  container.innerHTML = ""
  let optionValues = [10, 15, 20, 30];
  optionValues.forEach(value => {
    let option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
  let p2 = document.createElement('p');
  p2.textContent = 'filas por página';

  container.appendChild(p2);
  container.appendChild(select);

  const rowsperpage = document.getElementById('rowsperpage');
  let rowsPerPage = parseInt(rowsperpage.value);



  rowsperpage.addEventListener('change', () => {
    rowsPerPage = parseInt(rowsperpage.value);
    currentPage = 1;
    displayTablePage(currentPage, rowsPerPage);
  });

  const getAsientosbyCuenta = async (page, rowsPerPage) => {

    let data = await getAsientos(df, dt, account, page, rowsPerPage)
    data.details.sort((a, b) => {
      const fechaA = a.fechaRegistro.split("-").reverse().join("-");
      const fechaB = b.fechaRegistro.split("-").reverse().join("-");
      return new Date(fechaA) - new Date(fechaB);
    });
    return data;
  }


  const displayTablePage = async (page, rowsPerPage = 10) => {
    const data = await getAsientosbyCuenta(currentPage, rowsPerPage)


    let start = data.startRecord
    let end = data.endRecord
    let pageData = data.details
    let row = "";
    let acum = 0;
    //
    if (pageData.length > 0) {

      pageData.forEach(val => {
        acum = parseFloat(acum) + (parseFloat(val.debe.replace(',', '.')) - parseFloat(val.haber.replace(',', '.')))
        row += `<tr class="text-center">`
        row += `<td style="text-align: left; max-width: 350px;">${val.fechaRegistro}</td>`;
        row += `<td style="color: #4EC275; cursor: pointer;" data-bs-toggle="modal" data-bs-target="#modalDetails" data-id="${val.id_comp3}" onclick="loadDetails(this)">${val.id_comp3}&nbsp&nbsp<a target="_blank" href="${window.origin + '/4DACTION/wbienvenidos#comprobantes/content.shtml?id=' + val.id_comp3}"><i class="fa-solid fa-pencil" style="color: #4EC275;"></i></a></td>`;
        row += `<td style="text-align: right">$ ${formatearNumero(val.debe)}</td>`;
        row += `<td style="text-align: right">$ ${formatearNumero(val.haber)}</td>`;
        row += `<td>$ ${formatearNumero(acum)}</td>`;
        row += `<td>${val.tipoDoc}</td>`;
        row += `<td style="text-align: left; max-width: 200px">${val.glosa}</td>`;
        row += `</tr>`


        tableBodyModal.innerHTML = row

      })
    } else {
      row += `<tr class="text-center">`
      row += `<td style="text-align: center; max-width: 350px;" colspan="7">No hay asientos para este período en esta cuenta</td>`;

      row += `</tr>`
      tableBodyModal.innerHTML = row
    }

    // const oldpageNumbers = document.querySelectorAll('.page-number');
    // oldpageNumbers.forEach(page.Numbers.remove());

    //
    let pageCount = data.pageCount;

    const pageNumbers = document.querySelector(".pagination")



    /*while (pageNumbers.firstChild) {
      pageNumbers.removeChild(pageNumbers.firstChild)
    }*/
    pageNumbers.innerHTML = '';


    let li = document.createElement('li');
    let a = document.createElement('a');
    let iconleft = document.createElement('i');
    iconleft.classList.add('fa-solid');
    iconleft.classList.add('fa-arrow-left');
    a.appendChild(iconleft);
    a.id = "prev-page"
    li.appendChild(a);
    pageNumbers.appendChild(li);

    let next = document.createElement('li');
    let nx = document.createElement('a');
    let iconright = document.createElement('i');
    iconright.classList.add('fa-solid');
    iconright.classList.add('fa-arrow-right');
    nx.appendChild(iconright);
    nx.id = "next-page"
    next.appendChild(nx);
    pageNumbers.appendChild(next);

    const updatepage = () => {
      document.querySelectorAll('.pagination .active').forEach(element => element.classList.remove('active'));

      let activePage = document.querySelector(`.pagination a[data-page="${currentPage}"]`);
      if (activePage) {
        activePage.parentElement.classList.add('active');
      }
    };

    document.getElementById('prev-page').addEventListener('click', (event) => {
      if (currentPage > 1) {
        currentPage--;
        displayTablePage(currentPage, rowsPerPage);
        console.log("Página Actual", currentPage);
        updatepage();
      }
    });

    document.getElementById('next-page').addEventListener('click', (event) => {
      if (currentPage < pageCount) {
        currentPage++;
        displayTablePage(currentPage, rowsPerPage);
        console.log("Página Actual", currentPage);
        updatepage();
      }
    });


    for (let i = 1; i <= pageCount; i++) {
      //pageNumbers.innerHTML = '';
      if (
        i === 1 ||
        // i === pageCount ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        let li = document.createElement('li');
        //li.classList.add('page-number');
        let a = document.createElement('a');
        a.href = '#';
        a.textContent = i;
        a.setAttribute('data-page', i);
        a.addEventListener('click', (event) => {
          event.preventDefault();
          currentPage = parseInt(event.target.getAttribute('data-page'));
          displayTablePage(currentPage, rowsPerPage);

          console.log("Página Actual", currentPage);
          updatepage();
        });
        li.appendChild(a);

        pageNumbers.insertBefore(li, document.getElementById('next-page').parentNode);
      } else if (
        (i === currentPage - 2 && currentPage > 3) ||
        (i === currentPage + 2 && currentPage < pageCount - 2)

      ) {
        let li = document.createElement('li');
        li.textContent = "...";
        li.classList.add('ellipsis')
        pageNumbers.insertBefore(li, document.getElementById('next-page').parentNode);

      }
    }
    //asegurar la ultima página
    if (currentPage < pageCount - 1) {
      let li = document.createElement('li');
      let a = document.createElement('a');
      a.href = '#';
      a.textContent = pageCount;
      a.setAttribute('data-page', pageCount);
      a.addEventListener('click', (event) => {
        event.preventDefault();
        currentPage = parseInt(event.target.getAttribute('data-page'));
        displayTablePage(currentPage, rowsPerPage);
        console.log("Página Actual", currentPage);
        updatepage();
      });
      li.appendChild(a);
      pageNumbers.insertBefore(li, document.getElementById('next-page').parentNode);
    }
    updatepage();
    loaderLine.style.display = 'none'

  }
  displayTablePage(currentPage)

  // --- Autocomplete search setup ---
  const searchInput = document.getElementById('search-general')
  const clearBtn = document.getElementById('btn-clear-search')

  // Create suggestions container if not exists
  let suggestions = document.getElementById('auto-suggestions')
  if (!suggestions) {
    suggestions = document.createElement('div')
    suggestions.id = 'auto-suggestions'
    suggestions.style.position = 'absolute'
    suggestions.style.zIndex = '1056'
    suggestions.style.background = '#fff'
    suggestions.style.border = '1px solid #e9ecef'
    suggestions.style.borderTop = 'none'
    suggestions.style.width = '100%'
    suggestions.style.maxHeight = '240px'
    suggestions.style.overflowY = 'auto'
    suggestions.style.display = 'none'
    const parent = searchInput.parentElement
    parent.style.position = 'relative'
    parent.appendChild(suggestions)
  }

  // Cache all rows per (account,dates,apertura)
  const cacheKey = `${account}|${df}|${dt}|${document.getElementById('checkApertura').checked}`
  window.__asientosCache = window.__asientosCache || new Map()

  window.__asientosInFlight = window.__asientosInFlight || new Map()
  window.__asientosPageCache = window.__asientosPageCache || new Map()

  const getFirstPage = async () => {
    const key = `${cacheKey}|p1`
    if (window.__asientosPageCache.has(key)) return window.__asientosPageCache.get(key)
    const res = await getAsientos(df, dt, account, 1, 200)
    window.__asientosPageCache.set(key, res)
    return res
  }

  const fetchPage = async (p) => {
    const key = `${cacheKey}|p${p}`
    if (window.__asientosPageCache.has(key)) return window.__asientosPageCache.get(key)
    const res = await getAsientos(df, dt, account, p, 200)
    window.__asientosPageCache.set(key, res)
    return res
  }

  const progressiveSearch = async (query) => {
    const SEARCH_MAX_PAGES = 5
    const SEARCH_MIN_RESULTS = 80

    let rows = []
    const first = await getFirstPage()
    const totalPages = Math.max(1, first.pageCount || 1)
    rows = rows.concat(first.details || [])

    let page = 1
    while (page < Math.min(totalPages, SEARCH_MAX_PAGES)) {
      const matchesNow = filterRows(rows, query)
      if (matchesNow.length >= SEARCH_MIN_RESULTS) break
      page += 1
      const res = await fetchPage(page)
      if (res && res.details) rows = rows.concat(res.details)
    }

    rows.sort((a, b) => {
      const fechaA = a.fechaRegistro.split('-').reverse().join('-')
      const fechaB = b.fechaRegistro.split('-').reverse().join('-')
      return new Date(fechaA) - new Date(fechaB)
    })

    window.__asientosCache.set(cacheKey, rows)
    return rows
  }

  const hidePagination = (hidden) => {
    const pag = document.getElementById('cont-paginado')
    if (pag) pag.style.display = hidden ? 'none' : ''
  }

  const renderFiltered = (rows) => {
    let row = ''
    let acum = 0
    if (rows.length === 0) {
      row += `<tr class="text-center"><td style="text-align: center; max-width: 350px;" colspan="7">Sin resultados</td></tr>`
      tableBodyModal.innerHTML = row
      return
    }
    rows.forEach(val => {
      acum = parseFloat(acum) + (parseFloat(val.debe.replace(',', '.')) - parseFloat(val.haber.replace(',', '.')))
      row += `<tr class="text-center">`
      row += `<td style="text-align: left; max-width: 350px;">${val.fechaRegistro}</td>`
      row += `<td style="color: #4EC275; cursor: pointer;" data-bs-toggle="modal" data-bs-target="#modalDetails" data-id="${val.id_comp3}" onclick="loadDetails(this)">${val.id_comp3}&nbsp&nbsp<a target="_blank" href="${window.origin + '/4DACTION/wbienvenidos#comprobantes/content.shtml?id=' + val.id_comp3}"><i class="fa-solid fa-pencil" style="color: #4EC275;"></i></a></td>`
      row += `<td style="text-align: right">$ ${formatearNumero(val.debe)}</td>`
      row += `<td style="text-align: right">$ ${formatearNumero(val.haber)}</td>`
      row += `<td>$ ${formatearNumero(acum)}</td>`
      row += `<td>${val.tipoDoc || ''}</td>`
      row += `<td style="text-align: left; max-width: 200px">${val.glosa || ''}</td>`
      row += `</tr>`
    })
    tableBodyModal.innerHTML = row
  }

  const renderSuggestions = (matches, term) => {
    if (!term || matches.length === 0) {
      suggestions.innerHTML = ''
      suggestions.style.display = 'none'
      return
    }
    const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const re = new RegExp(`(${escapeRegExp(String(term))})`, 'ig')
    const highlight = (txt) => String(txt).replace(re, '<strong>$1</strong>')

    // De-duplicate by asiento number
    const seen = new Set()
    const unique = []
    for (const r of matches) {
      const key = r.id_comp3 || `${r.fechaRegistro}-${r.glosa}`
      if (seen.has(key)) continue
      seen.add(key)
      unique.push(r)
    }

    suggestions.innerHTML = unique.slice(0, 8).map(r => {
      const parts = [r.id_comp3, r.glosa, r.razon, r.obligacion, r.tipoDoc, r.rut]
        .filter(Boolean)
      const label = parts.join(' – ')
      return `<div class="suggestion-item" data-value="${r.id_comp3}">
                <div style="padding:6px 10px; cursor:pointer;">${highlight(label)}</div>
              </div>`
    }).join('')
    suggestions.style.display = ''
  }

  const normalize = (s) => String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  const filterRows = (rows, q) => {
    if (!q) return []
    const term = normalize(q)
    return rows.filter(r => {
      return [r.id_comp3, r.glosa, r.razon, r.tipoDoc, r.obligacion, r.rut, r.auxiliar_rut]
        .some(v => normalize(v).includes(term))
    })
  }

  const debounce = (fn, wait = 400) => {
    let t
    return (...args) => {
      clearTimeout(t)
      t = setTimeout(() => fn.apply(null, args), wait)
    }
  }

  // Remove previous listeners if any to avoid duplicates on each modal open
  if (searchInput.__autocompleteHandler) {
    searchInput.removeEventListener('input', searchInput.__autocompleteHandler)
  }
  if (clearBtn.__clearHandler) {
    clearBtn.removeEventListener('click', clearBtn.__clearHandler)
  }
  if (suggestions.__clickHandler) {
    suggestions.removeEventListener('click', suggestions.__clickHandler)
  }

  const handleInput = debounce(async () => {
    const q = searchInput.value.trim()
    if (q.length < 2) {
      suggestions.innerHTML = ''
      suggestions.style.display = 'none'
      hidePagination(false)
      tableBodyModal.innerHTML = ''
      displayTablePage(currentPage, rowsPerPage)
      return
    }
    const cached = window.__asientosCache.get(cacheKey)
    if (!cached || cached.length === 0) {
      suggestions.innerHTML = `<div style="padding:6px 10px; color:#6c757d;">Presiona Enter para buscar "${q}"</div>`
      suggestions.style.display = ''
      return
    }
    const matches = filterRows(cached, q)
    renderSuggestions(matches, q)
    renderFiltered(matches)
    hidePagination(true)
  }, 200)
  searchInput.__autocompleteHandler = handleInput
  searchInput.addEventListener('input', handleInput)

  const handleEnter = async (ev) => {
    if (ev.key !== 'Enter') return
    const q = searchInput.value.trim()
    if (q.length < 2) return
    loaderLine.style.display = ''
    const all = await progressiveSearch(q)
    const matches = filterRows(all, q)
    renderSuggestions(matches, q)
    renderFiltered(matches)
    hidePagination(true)
    loaderLine.style.display = 'none'
  }
  if (searchInput.__enterHandler) searchInput.removeEventListener('keydown', searchInput.__enterHandler)
  searchInput.__enterHandler = handleEnter
  searchInput.addEventListener('keydown', handleEnter)

  const clickHandler = (ev) => {
    const item = ev.target.closest('.suggestion-item')
    if (!item) return
    const value = item.getAttribute('data-value')
    searchInput.value = value
    searchInput.dispatchEvent(new Event('input'))
    suggestions.style.display = 'none'
  }
  suggestions.__clickHandler = clickHandler
  suggestions.addEventListener('click', clickHandler)

  const clearHandler = () => {
    searchInput.value = ''
    suggestions.innerHTML = ''
    suggestions.style.display = 'none'
    tableBodyModal.innerHTML = ''
    hidePagination(false)
    displayTablePage(currentPage, rowsPerPage)
    searchInput.focus()
  }
  clearBtn.__clearHandler = clearHandler
  clearBtn.addEventListener('click', clearHandler)

  // No hay precarga masiva; las búsquedas se hacen bajo demanda con Enter
}

// Helpers al cambiar de filtro.
let __syncingFilters = false;
const pad2 = (n) => String(n).padStart(2, "0");
const periodToRange = (p) => {
  const v = String(p || "").trim();
  // YYYY
  let m = v.match(/^(\d{4})$/);
  if (m) {
    const y = m[1];
    return { from: `${y}-01-01`, to: `${y}-12-31` };
  }
  // YYYY-MM
  m = v.match(/^(\d{4})-(\d{2})$/);
  if (m) {
    const y = parseInt(m[1], 10);
    const mm = parseInt(m[2], 10); // 1..12
    const lastDay = new Date(y, mm, 0).getDate(); // último día del mes
    return { from: `${m[1]}-${m[2]}-01`, to: `${m[1]}-${m[2]}-${pad2(lastDay)}` };
  }

  return null;
};
const clearPeriod = () => {
  // input visible
  period.value = "";
  // hidden (si los usas)
  const y = document.getElementById("periodYear") || document.getElementById("yearFrom");
  const mo = document.getElementById("periodMonth") || document.getElementById("monthOnlyFrom");
  if (y) y.value = "";
  if (mo) mo.value = "";
};

const setTableMain = async () => {
  ensureConnected()

  let df = getFormatDate(dateFrom.value)
  let dt = getFormatDate(dateTo.value)



  let debe = 0; haber = 0; deudor = 0; acreedor = 0; activo = 0; pasivo = 0; perdida = 0; ganancia = 0;

  if (df != '' && dt != '') {
    loadingLoad("loading-modal", true, "Por favor espere...");
    tableBody.innerHTML = ""

    let data = await getBalance(df, dt, check_apertura.checked)
    const decimales = 0
    let row = "";

    data.rows.forEach(val => {
      debe = debe + parseFloat(val.debe.replace(',', '.'))
      haber = haber + parseFloat(val.haber.replace(',', '.'))
      deudor = deudor + parseFloat(val.deudor.replace(',', '.'))
      acreedor = acreedor + parseFloat(val.acreedor.replace(',', '.'))
      activo = activo + parseFloat(val.activo.replace(',', '.'))
      pasivo = pasivo + parseFloat(val.pasivo.replace(',', '.'))
      perdida = perdida + parseFloat(val.perdida.replace(',', '.'))
      ganancia = ganancia + parseFloat(val.ganancia.replace(',', '.'))
      'view'
      row += `<tr class="pointer" data-id="${val.id}" data-number="${val.number}">`
      row += `<td style="text-align: center; min-width: 100px;color: #4EC275;cursor: pointer;" data-bs-toggle="modal" data-bs-target="#modalDocs" onclick="loadComprobantes(this)">${val.number}</td>`;
      row += `<td style="text-align: left; color: #4EC275;cursor: pointer;" data-bs-toggle="modal" data-bs-target="#modalDocs" onclick="loadComprobantes(this)">${val.name}</td>`;
      row += `<td style="text-align: center"></td>`;
      row += `<td style="text-align: center">$ ${formatearNumero(val.debe, decimales)}</td>`;
      row += `<td style="text-align: center" >$ ${formatearNumero(val.haber, decimales)}</td>`;
      row += `<td style="text-align: center"></td>`;
      row += `<td style="text-align: center">$ ${formatearNumero(val.deudor, decimales)}</td>`;
      row += `<td style="text-align: center">$ ${formatearNumero(val.acreedor, decimales)}</td>`;
      row += `<td style="text-align: center"></td>`;
      row += `<td style="text-align: center">$ ${formatearNumero(val.activo, decimales)}</td>`;
      row += `<td style="text-align: center">$ ${formatearNumero(val.pasivo, decimales)}</td>`;
      row += `<td style="text-align: center"></td>`;
      row += `<td style="text-align: center">$ ${formatearNumero(val.perdida, decimales)}</td>`;
      row += `<td style="text-align: center">$ ${formatearNumero(val.ganancia, decimales)}</td>`;
      row += `</tr>`

      tableBody.innerHTML = row
    })

    document.getElementById('table-footer').innerHTML = ""
    let footer = ''
    footer += `<tr style="text-align: center; background-color: #E8FBF5;">
                  <th></th>
                  <th>Sub-Totales</th>
                  <th></th>
                  <th>$ ${formatearNumero(debe, decimales)}</th>
                  <th>$ ${formatearNumero(haber, decimales)}</th>
                  <th></th>
                  <th>$ ${formatearNumero(deudor, decimales)}</th>
                  <th>$ ${formatearNumero(acreedor, decimales)}</th>
                  <th></th>
                  <th>$ ${formatearNumero(activo, decimales)}</th>
                  <th>$ ${formatearNumero(pasivo, decimales)}</th>
                  <th></th>
                  <th>$ ${formatearNumero(perdida, decimales)}</th>
                  <th>$ ${formatearNumero(ganancia, decimales)}</th>
              </tr>`

    let rest = activo - pasivo
    let rest2 = perdida - ganancia

    footer += `<tr style="text-align: center; background-color: #E8FBF5;">
                  <th></th>
                  <th>Pérdidas / Ganancias</th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th>$ ${activo < pasivo ? formatearNumero(Math.abs(rest), decimales) : 0}</th>
                  <th>$ ${activo > pasivo ? formatearNumero(Math.abs(rest), decimales) : 0}</th>
                  <th></th>
                  <th>$ ${perdida < ganancia ? formatearNumero(Math.abs(rest2), decimales) : 0}</th>
                  <th>$ ${perdida > ganancia ? formatearNumero(Math.abs(rest2), decimales) : 0}</th>
              </tr>`

    let i_activo = activo < pasivo ? Math.abs(rest) : 0
    let i_pasivo = activo > pasivo ? Math.abs(rest) : 0

    let r_perdida = perdida < ganancia ? Math.abs(rest2) : 0
    let r_ganancia = perdida > ganancia ? Math.abs(rest2) : 0

    activo = activo + i_activo
    pasivo = pasivo + i_pasivo

    ganancia = ganancia + r_ganancia
    perdida = perdida + r_perdida



    footer += `<tr style="text-align: center; background-color: #E8FBF5;">
                  <th></th>
                  <th>Total general</th>
                  <th></th>
                  <th>$ ${formatearNumero(debe, decimales)}</th>
                  <th>$ ${formatearNumero(haber, decimales)}</th>
                  <th></th>
                  <th>$ ${formatearNumero(deudor, decimales)}</th>
                  <th>$ ${formatearNumero(acreedor, decimales)}</th>
                  <th></th>
                  <th>$ ${formatearNumero(activo, decimales)}</th>
                  <th>$ ${formatearNumero(pasivo, decimales)}</th>
                  <th></th>
                  <th>$ ${formatearNumero(perdida, decimales)}</th>
                  <th>$ ${formatearNumero(ganancia, decimales)}</th>
              </tr>`

    document.getElementById('table-footer').innerHTML = footer




    loadingLoad("loading-modal", false, "Por favor espere...");
  }


}

const downloadExcelLibro = async (e) => {

  isConnected();

  // Obtén los datos de la cuenta y fechas seleccionadas
  const account = document.getElementById('account-detail').textContent.trim();
  const df = getFormatDate(dateFrom.value);
  const dt = getFormatDate(dateTo.value);
  const rowsPerPage = 100; // Puedes ajustar este valor si tienes muchas filas por página

  // Obtén la primera página para saber cuántas páginas hay
  let firstPage = await getAsientos(df, dt, account, 1, rowsPerPage);
  if (!firstPage || !firstPage.details || firstPage.details.length === 0) {
      alert('No hay datos para exportar.');
      return;
  }

  let allRows = [...firstPage.details];
  let pageCount = firstPage.pageCount || 1;

  // Si hay más de una página, las descargamos todas
  let promises = [];
  for (let page = 2; page <= pageCount; page++) {
      promises.push(getAsientos(df, dt, account, page, rowsPerPage));
  }
  let results = await Promise.all(promises);
  results.forEach(res => {
      if (res && res.details) {
          allRows = allRows.concat(res.details);
      }
  });

  // Prepara los encabezados
  const headers = [
      "FECHA CONTABILIZACIÓN",
      "Nº ASIENTO",
      "DEBE",
      "HABER",
      "ACUMULADO",
      "OBLIGACIÓN",
      "MÁS INFO."
  ];

  // Convierte los datos a un array de arrays (para xlsx)
  const data = [headers];
  let acum = 0;
  allRows.forEach(function (row) {
      acum = parseFloat(acum) + (parseFloat(row.debe.replace(',', '.')) - parseFloat(row.haber.replace(',', '.')));
      data.push([
          row.fechaRegistro,
          row.id_comp3,
          row.debe,
          row.haber,
          acum,
          row.tipoDoc,
          row.glosa
      ]);
  });

  // Obtén la URL del backend desde localStorage
  const nodeUrl = localStorage.getItem('node_url');
  if (!nodeUrl) {
      alert('No se encontró la URL del backend (node_url).');
      return;
  }

  // Envía los datos al backend y descarga el archivo generado
  axios.post(`${nodeUrl}/export-libro-mayor`, 
      { rows: data }, 
      { responseType: 'blob' }
  )
  .then(response => {
      // Descarga el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'libro_mayor.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
  })
  .catch(err => {
      alert('No se pudo generar el archivo: ' + err.message);
  });
};

const getFormatDate = (date, flag = false) => {
  let res = '';
  if (date != '') {
    let d = date.split('-').reverse().join('-')
    d = d.split('-')
    let day, year, month


    day = d[0]
    year = d[2]
    month = d[1]


    let dat = `${day}-${month}-${year}`

    if (flag) {
      let intmonth = parseInt(month)
      var newDat = new Date(year, intmonth, 0);
      res = newDat.getDate() + '/' + (newDat.getMonth() + 1) + '/' + newDat.getFullYear()
    } else {
      res = dat
    }

  }

  return res
}


const downloadExcel = async (e) => {
  ensureConnected()
  let df = getFormatDate(dateFrom.value)
  let dt = getFormatDate(dateTo.value, true)

  let check_apertura = document.getElementById('checkApertura').checked



  if (df != '' && dt != '') {
    loadingLoad("loading-modal", true, "Por favor espere...");
    let nodeUrl = localStorage.getItem('node_url')

    let url = `${nodeUrl}/balance/?download=true&dateto=${dt}&estado=negocio&datefrom=${df}&sid=${sid()}&hostname=${window.location.origin}&from_balance=true&check_apertura=${check_apertura}`

    let download = window.open(url);
    download.blur();
    window.focus();
  }

  loadingLoad("loading-modal", false, "Por favor espere...");
}


const downloadXML = async (e) => {
  ensureConnected()
  let df = getFormatDate(dateFrom.value)
  let dt = getFormatDate(dateTo.value, true)

  let check_apertura = document.getElementById('checkApertura').checked



  if (df != '' && dt != '') {
    loadingLoad("loading-modal", true, "Por favor espere...");
    let nodeUrl = localStorage.getItem('node_url')

    let url = `${nodeUrl}/balance-xml/?download=true&dateto=${dt}&estado=negocio&datefrom=${df}&sid=${sid()}&hostname=${window.location.origin}&from_balance=true&check_apertura=${check_apertura}`

    let download = window.open(url);
    download.blur();
    window.focus();
  }

  loadingLoad("loading-modal", false, "Por favor espere...");


}

let getInfo = async () => {
  let config = {

    method: 'get',
    url: `https://${window.location.host}/4DACTION/_light_get_server_info`,

  };
  try {
    let res = await axios(config);
    return res;
  } catch (err) {
    throw err;
  }

}


const getServerInfo = async () => {
  getInfo()
    .then(res => {

      localStorage.setItem('node_url', res.data.node_url);
      localStorage.setItem('web_url', res.data.web_url);
      localStorage.setItem('razon', res.data.razon);
    });

}

(function init() {
  ensureConnected()
  //SETEAR FECHAS INICIALES
  n = new Date();
  //Año
  y = n.getFullYear();
  //Mes
  m = n.getMonth() + 1;
  //Día
  d = n.getDate();
  if (d < 10) d = '0' + d;
  if (m < 10) m = '0' + m;


  var last_day = new Date(y, m, 0);
  last_day = last_day.getDate()
  if (last_day < 10) last_day = '0' + last_day;

  dateFrom.value = y + "-" + '01-01';

  dateTo.value = y + "-" + m + '-' + last_day

 
  btnDownload.addEventListener("click", (e) => downloadExcel(e));
  btnDownloadXML.addEventListener("click", (e) => downloadXML(e));
  btnDownloadExcel.addEventListener("click", (e) => downloadExcelLibro(e));


  const onRangeChange = () => {
  if (__syncingFilters) return;
  if (period.value) clearPeriod();   // al tocar rango, periodo deja de aplicar
  setTableMain();
};

const onPeriodChange = () => {

  if (__syncingFilters) return;

  const r = periodToRange(period.value);
  if (!r) {
    // si quedó vacío o inválido, no forzamos nada
    setTableMain();
    return;
  }

  __syncingFilters = true;
  dateFrom.value = r.from;
  dateTo.value = r.to;
  __syncingFilters = false;

  setTableMain();
};
  //DATE LISTENERS
  dateFrom.addEventListener("change", onRangeChange);
  dateTo.addEventListener("change", onRangeChange);
  period.addEventListener("change", onPeriodChange);
  
  check_apertura.addEventListener("change", () => setTableMain());

  //Carga de datos
  setTableMain();


  getServerInfo();

  const parentDocument = window.parent.document;
  const fullscreenBtn = parentDocument.querySelector('#fullscreen-btn');
  const iframe = parentDocument.querySelector('#iframe');
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      iframe.requestFullscreen();
    });

  }


})();
