let content = []
const inputs = [];
const actionsModal = document.querySelector(".actionsCustomModal");
const openActionsModalBtn = document.querySelector(".actionsCustomModalBtn");
const closeActionsModalBtn = document.querySelector(".closeActionsModal");

const createTableItem = (item) => {
  const tableItem = document.createElement("div");
  tableItem.classList.add("containerBox__table-item");

  // Crear y añadir el checkbox
  const colSelected = document.createElement("div");
  colSelected.classList.add("col", "center");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = item.selected;
  checkbox.dataset.total = item.total;
  checkbox.dataset.saldo = item.saldo;
  colSelected.appendChild(checkbox);
  tableItem.appendChild(colSelected);

  // Función para añadir columnas de texto
  const addTextCol = (text, className = "center", type = "") => {
    const col = document.createElement("div");
    col.classList.add("col", text === "" ? "center" : className);
    const span = document.createElement("span");
    if (type === "date") {
      span.textContent = transformedDate(text);
    } else {
      if (type === "status") {
        span.classList.add(text);
      }
      span.textContent = text || "-";
    }
    col.appendChild(span);
    tableItem.appendChild(col);
  };

  // Añadir las demás columnas
  addTextCol(item.folio);
  addTextCol(item.param4);
  addTextCol(item.created_at, "center", "date");
  addTextCol(item.expires_at, "center", "date");
  addTextCol(item.estado);
  addTextCol(item.username);
  addTextCol(item.empresa_razon_social, "left");
  addTextCol(item.text || "N/A", "left");

  // Columna para la forma de pago
  const formaPagoCol = document.createElement("div");
  formaPagoCol.classList.add("col", "center");
  const formaPagoSpan = document.createElement("span");
  formaPagoSpan.textContent = item.forma_pago;
  formaPagoCol.appendChild(formaPagoSpan);
  if (item.bankcardsConciliado) {
    const icon = document.createElement("i");
    icon.classList.add("fa", "fa-check-circle", "fa-lg", "u-color-green", "u-use-bankcards");
    icon.setAttribute("aria-hidden", "true");
    icon.style.marginLeft = "5px";
    icon.style.fontSize = "15px";
    icon.style.verticalAlign = "middle";
    formaPagoCol.appendChild(icon);
  }
  tableItem.appendChild(formaPagoCol);

  // Añadir la columna para el número de pago
  addTextCol(item.numero_pago, "center");

  // Columna para el total
  const colNetTotal = document.createElement("div");
  colNetTotal.classList.add("col", "between");
  const spanSymbol = document.createElement("span");
  spanSymbol.textContent = item.monedaTipo || item.exchange.type;
  const spanAmount = document.createElement("span");
  spanAmount.textContent = item.total_formatted;
  colNetTotal.appendChild(spanSymbol);
  colNetTotal.appendChild(spanAmount);
  tableItem.appendChild(colNetTotal);

  return tableItem;
};

const toggleSelectAll = (checked) => {
  content = content.map((item) => {
    item.selected = checked;
    return item;
  });
  renderTableItems(content);
}

// Event listener para el checkbox del header
document.addEventListener("DOMContentLoaded", () => {
  const selectAllCheckbox = document.querySelector(
    '.containerBox__table-header input[type="checkbox"]'
  );
  selectAllCheckbox.addEventListener("change", (e) => {
    toggleSelectAll(e.target.checked);
  });
});

// Filtrar tabla
const filterContent = (searchTerm) => {
  return content.filter((item) => {
    return (
      item.ejecutivo_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.block_user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.referencia_proyecto.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
}

// Event listener para el input de búsqueda
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search");
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value;
    const filteredContent = searchTerm ? filterContent(searchTerm) : content;
    renderTableItems(filteredContent);
  });
  // Event listener para limpiar la búsqueda con la tecla ESC
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      searchInput.value = "";
      renderTableItems(content);
    }
  });
});

// Formateador de la fecha
const transformedDate = (dateString, language = "es") => {
  if (!dateString || isNaN(new Date(dateString))) {
    return "-";
  }

  const optionsDate = { day: "2-digit", month: "short", year: "numeric" };
  const date = new Date(dateString);

  const day = date.toLocaleDateString(language, { day: "2-digit" });
  const month = date
    .toLocaleDateString(language, { month: "short" })
    .replace(/^\w/, (c) => c.toUpperCase());
  const year = date.toLocaleDateString(language, { year: "numeric" });

  return `${day} ${month}, ${year}`;
}

// Formateador de moneda
const formatCurrencyList = (currency) => {

  currency = currency.toString().replace(/,/g, "");
  if (Number(currency) === 0) return "0,00";
  currency = currency.replace(/,(?=.*,)|,+$|^\s*|\s*$/g, "");

  let parts = currency.split(".");
  let integerPart = parts[0] || "0";
  let decimalPart = parts[1] || "00";

  integerPart = integerPart.replace(/^0*(?=[1-9])/, "");

  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  decimalPart =
    decimalPart.length === 1 ? `${decimalPart}0` : decimalPart.slice(0, 2);

  return integerPart + "," + decimalPart;
}

// Función para inicializar los filtros de fecha
function initializeDateFilters(dateFilters, updateListCallback) {
  const container = document.getElementById('dateFilterContainer');

  dateFilters.forEach(filter => {
    let labelMonth = ''
    if (filter.defaultMonth) {
      if (filter.defaultMonth < 10) {
        labelMonth = `0${filter.defaultMonth}`
      }
    }
    const filterHtml = `
      <div class="calendar" id="${filter.id}">
        <button class="leftBtn backDate">&lt;</button>
        <button class="dateBtn showCalendar">
          <span>🗓️</span><span class="selectedDate" data-date="${filter.defaultYear + "-" + labelMonth}">${filter.defaultDate}</span>
        </button>
        <button class="rightBtn nextDate">&gt;</button>
        <div class="calendarBox">
          <div class="calendarBox__year">
            <button class="leftBtn backYear">&lt;</button>
            <button class="dateBtn yearBtn">
              <span class="selectedYear">${filter.defaultYear}</span>
            </button>
            <button class="rightBtn nextYear">&gt;</button>
          </div>
          <div class="calendarBox__mounths">
            <button class="monthBtn" data-month="1">Ene.</button>
            <button class="monthBtn" data-month="2">Febr.</button>
            <button class="monthBtn" data-month="3">Marz.</button>
            <button class="monthBtn" data-month="4">Abr.</button>
            <button class="monthBtn" data-month="5">May.</button>
            <button class="monthBtn" data-month="6">Jun.</button>
            <button class="monthBtn" data-month="7">Jul.</button>
            <button class="monthBtn" data-month="8">Agost.</button>
            <button class="monthBtn" data-month="9">Sept.</button>
            <button class="monthBtn" data-month="10">Oct.</button>
            <button class="monthBtn" data-month="11">Nov.</button>
            <button class="monthBtn" data-month="12">Dic.</button>
          </div>
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', filterHtml);

    // Inicializar lógica de filtros de fecha
    initializeDateFilterLogic(filter.id, filter.defaultYear, filter.defaultMonth, updateListCallback);
  });
}

// Función para inicializar la lógica de los filtros de fecha
const initializeDateFilterLogic = (filterId, defaultYear, defaultMonth, updateListCallback) => {
  let year = defaultYear;
  let month = defaultMonth;



  const updatedDateSpan = () => {
    const monthNames = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];


    const selectedDateElement = document.querySelector(`#${filterId} .selectedDate`);
    const selectedYearElement = document.querySelector(`#${filterId} .selectedYear`);
    const formattedDate = `${monthNames[month - 1]} ${year}`;
    selectedDateElement.textContent = formattedDate;
    selectedYearElement.textContent = year;
    let monthLabel = month < 10 ? `0${month}` : month;

    selectedDateElement.dataset.date = `${year}-${monthLabel}`
  };

  const calendarBox = document.querySelector(`#${filterId} .calendarBox`);
  const showCalendarButton = document.querySelector(`#${filterId} .showCalendar`);

  showCalendarButton.addEventListener("click", () => {
    calendarBox.style.transform = "scale(1)";
  });

  calendarBox.addEventListener("mouseleave", () => {
    calendarBox.style.transform = "scale(0)";
  });

  const monthButtons = document.querySelectorAll(`#${filterId} .calendarBox__mounths button`);

  monthButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      month = index + 1;
      updatedDateSpan();
      updateListCallback()
      calendarBox.style.transform = "scale(0)";
    });
  });

  const backDateButton = document.querySelector(`#${filterId} .backDate`);
  const nextDateButton = document.querySelector(`#${filterId} .nextDate`);

  backDateButton.addEventListener("click", () => {
    
    if (month === 1) {
      year -= 1;
      month = 12;
    } else {
      month -= 1;
    }
    updatedDateSpan();
    updateListCallback()
  });

  nextDateButton.addEventListener("click", () => {
    
    if (month === 12) {
      year += 1;
      month = 1;
    } else {
      month += 1;
    }
    updatedDateSpan();
    updateListCallback()
  });

  const backYearButton = document.querySelector(`#${filterId} .backYear`);
  const nextYearButton = document.querySelector(`#${filterId} .nextYear`);

  backYearButton.addEventListener("click", () => {
    year -= 1;
    updatedDateSpan();
  });

  nextYearButton.addEventListener("click", () => {
    year += 1;
    updatedDateSpan();
  });

  updatedDateSpan(); // Inicializar la fecha seleccionada
}




// Filtros
let inputsObj = {
  issuedBy: {},
  byValidation: {},
  byClassification: {},
  origin: {},
  validatedBy: {},
  notValidatedBy: {},
  businessArea: {},
  documentType: {},
  formOfPayment: {},
  paymentRequest: {},
};

let inputsObjOriginal = {
  issuedBy: {},
  byValidation: {},
  byClassification: {},
  origin: {},
  validatedBy: {},
  notValidatedBy: {},
  businessArea: {},
  documentType: {},
  formOfPayment: {},
  paymentRequest: {},
};

const inputHtml = (prop, val, state) => {
  const inputSpan = document.getElementById(prop);
  inputSpan.textContent = val.name || '';
  inputSpan.dataset.id = val.id || '';
  inputSpan.style.display = state ? "block" : "none";
  const selectSpan = document.querySelector(`#${prop}Btn span:first-child`);
  const arrowSpan = document.querySelector(`#${prop}Btn span:nth-child(2)`);
  selectSpan.style.display = state ? "none" : "flex";
  arrowSpan.style.display = state ? "none" : "flex";
};

// Limpiar filtros
const cleanFiltersButton = document.getElementById("cleanFilters");

cleanFiltersButton.addEventListener("click", () => {
  inputs.forEach((i) => {
    inputsObj[i] = {};
    const element = document.getElementById(i);

    if (element) {
      element.style.display = "none";
    }
  });

  // Mostrar los primeros dos spans de todos los botones con la clase inputFilter
  const inputFilterButtons = document.querySelectorAll(".inputFilter");
  inputFilterButtons.forEach((button) => {
    const span1 = button.querySelector("span:first-child");
    const span2 = button.querySelector("span:nth-child(2)");
    span1.style.display = "flex";
    span2.style.display = "flex";
  });
});

// Aplicar filtros
const applyFilters = document.getElementById("applyFilters");

applyFilters.addEventListener("click", () => {
  inputs.forEach((i) => {
    inputsObjOriginal[i] = inputsObj[i];
  });
  toggleCustomModal(false);
});

// Show CustomModal
const toggleCustomModal = (state) => {

  const filterCustomModal = document.querySelector(".filterCustomModal");
  const btnfilterCustomModal = document.querySelector(".btnfilterCustomModal");
  const CustomModal = document.querySelector(".CustomModal");

  if (state) {
    btnfilterCustomModal.style.display = "flex";
    filterCustomModal.style.display = "flex";

    setTimeout(() => {
      CustomModal.style.transform = "scale(1)";
    }, 300);
  } else {
    CustomModal.style.transform = "scale(0)";

    setTimeout(() => {
      btnfilterCustomModal.style.display = "none";
      filterCustomModal.style.display = "none";
    }, 300);
  }
}

const assignModalEventListeners = () => {
  const btnfilterCustomModal = document.querySelector(".btnfilterCustomModal");
  const btnCloseCustomModal = document.querySelector(".close");
  const btnShowCustomModal = document.querySelector(".filterCustomModalBtn");
  const showModal = () => {
    toggleCustomModal(true);
  }

  if (btnfilterCustomModal && btnCloseCustomModal && btnShowCustomModal) {
    // // Definir la función manejadora del evento
    const handleButtonClick = () => {
      toggleCustomModal(false);
      setTimeout(() => {
        inputs.forEach((i) => {
          
          inputsObj[i] = inputsObjOriginal[i];
          inputHtml(i, inputsObjOriginal[i], !!inputsObjOriginal[i].name);
        });
      }, 0);
    }

    // Eliminar oyentes de eventos existentes para evitar duplicación
    [btnCloseCustomModal, btnfilterCustomModal].forEach((btn) => {

      btn.removeEventListener("click", handleButtonClick);
      btn.addEventListener("click", handleButtonClick);
    });

    // Asignar el evento al botón de mostrar el modal
    btnShowCustomModal.removeEventListener("click", showModal);
    btnShowCustomModal.addEventListener("click", showModal);
  }


}

const generateFilterHtml = (params) => {
  const modalBody = document.querySelector(".CustomModal__body");
  
  params.filters.forEach(filter => {
    const filterGroup = document.createElement("div");
    filterGroup.classList.add("CustomModal__body-group");

    const span = document.createElement("span");
    span.textContent = filter.caption;

    const inputContainer = document.createElement("div");
    inputContainer.classList.add("CustomModal__body-group-input");

    if (filter.type === "ub-select") {
      const button = document.createElement("button");
      button.classList.add("inputFilter");
      button.id = `${filter.name}Btn`;

      const selectText = document.createElement("span");
      selectText.textContent = "Seleccionar...";

      const arrow = document.createElement("span");
      arrow.textContent = "▼";

      const valueSpan = document.createElement("span");
      valueSpan.classList.add("value");
      valueSpan.id = filter.name;
      valueSpan.style.display = "none";

      button.appendChild(selectText);
      button.appendChild(arrow);
      button.appendChild(valueSpan);

      const optionsContainer = document.createElement("div");
      optionsContainer.classList.add("CustomModal__body-group-options");
      optionsContainer.id = `${filter.name}Options`;
      optionsContainer.style.transform = "scale(0)";
      optionsContainer.style.display = "none";

      const optionsContainerInner = document.createElement("div");
      optionsContainerInner.classList.add("CustomModal__body-group-options-container");
      optionsContainer.appendChild(optionsContainerInner);

      inputContainer.appendChild(button);
      inputContainer.appendChild(optionsContainer);
    }

    // Agregar lógica para filtros de tipo 'checkbox'
    if (filter.type === 'checkbox') {
      const optionsContainer = document.createElement("div");
      optionsContainer.classList.add("CustomModal__body-group-options");
      optionsContainer.id = `${filter.name}Options`;
      optionsContainer.style.transform = "scale(0)";
      optionsContainer.style.display = "none";

      const optionsContainerInner = document.createElement("div");
      optionsContainerInner.classList.add("CustomModal__body-group-options-container");
      optionsContainer.appendChild(optionsContainerInner);

      // Crear checkboxes
      filter.options.forEach(option => {
        const label = document.createElement("label");
        label.classList.add("checkbox-option");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = option.name;
        checkbox.checked = option.value;
        checkbox.dataset.caption = option.caption;

        const span = document.createElement("span");
        span.textContent = option.caption;

        label.appendChild(checkbox);
        label.appendChild(span);
        optionsContainerInner.appendChild(label);
      });

      inputContainer.appendChild(optionsContainer);
    }

    filterGroup.appendChild(span);
    filterGroup.appendChild(inputContainer);
    modalBody.appendChild(filterGroup);
  });
};


const createMetrics = (metrics) => {
  const metricsContainer = document.querySelector('.containerBox__metrics');

  // Limpiar cualquier métrica existente
  metricsContainer.innerHTML = '';

  metrics.forEach(metric => {
    // Crear el contenedor de la métrica
    const metricItem = document.createElement('div');
    metricItem.classList.add('containerBox__metrics-item');

    // Crear el icono de la métrica
    const metricIcon = document.createElement('div');
    metricIcon.classList.add('containerBox__metrics-icon');
    const iconSpan = document.createElement('span');
    iconSpan.textContent = metric.icon;
    metricIcon.appendChild(iconSpan);

    // Crear el texto de la métrica
    const metricText = document.createElement('div');
    metricText.classList.add('containerBox__metrics-text');

    // Crear el título de la métrica
    const metricTitle = document.createElement('div');
    metricTitle.classList.add('containerBox__metrics-text-title');
    const titleSpan = document.createElement('span');
    titleSpan.classList.add('truncateText');
    titleSpan.textContent = metric.title;
    metricTitle.appendChild(titleSpan);

    // Crear el monto de la métrica
    const metricAmount = document.createElement('div');
    metricAmount.classList.add('containerBox__metrics-text-mount');
    const amountSpan = document.createElement('span');
    amountSpan.textContent = metric.amount;
    metricAmount.appendChild(amountSpan);

    // Añadir el título y el monto al texto de la métrica
    metricText.appendChild(metricTitle);
    metricText.appendChild(metricAmount);

    // Añadir el icono y el texto al contenedor de la métrica
    metricItem.appendChild(metricIcon);
    metricItem.appendChild(metricText);

    // Añadir la métrica al contenedor de métricas
    metricsContainer.appendChild(metricItem);
  });
}




(function init() {
  unaBase.ui.unblock()
  
  var params = {
    url: function () { return '/4DACTION/_V3_getPago' },
    entity: 'Cotizacion',
    searchOff: true,
    callback: function (data) { },
    init: (updateListCallback) => {

      initializeDateFilters([
        { id: 'created_at', defaultDate: 'Septiembre 2024', defaultYear: 2024, defaultMonth: 9 }
      ], updateListCallback);
      // Inicializar botones
      params.initializeButtons({
        primary: ['new'],
        secondary: ['print', 'export_list', 'classic_view']
      });
    },
    row: {
      html: function (i, rows) {
        const item = {
          selected: false,
          folio: rows[i].folio,
          param4: rows[i].param4,
          created_at: rows[i].created_at,
          expires_at: rows[i].expires_at,
          estado: rows[i].estado,
          username: rows[i].username,
          empresa_razon_social: rows[i].empresa.razon_social.trim(),
          text: rows[i].text,
          forma_pago: rows[i].FormaPago || '----------',
          numero_pago: rows[i].NumeroPago || '----------',
          total: rows[i].total,
          saldo: rows[i].saldo,
          bankcardsConciliado: rows[i].bankcardsConciliado,
          monedaTipo: rows[i].monedaTipo,
          total_formatted: rows[i].monedaTipo
            ? rows[i].monedaTipo + ' ' + $.number(rows[i].total_raw / rows[i].monedaValorCambio, currency.decimals, currency.decimals_sep, currency.thousands_sep)
            : currency.symbol + ' ' + $.number(rows[i].total_raw, currency.decimals, currency.decimals_sep, currency.thousands_sep),
          exchange: {
            type: rows[i].monedaTipo || 'USD'
          }
        };

        // Crear la fila HTML utilizando el objeto `item`
        return createTableItem(item).outerHTML;
      }

    },
    inflection: {
      singular: 'cotización',
      plural: 'cotizaciones',
      none: 'ninguna'
    },
    filters: [
      { name: 'created_at', type: 'month', caption: 'Fecha de creación', range: true },
      { name: 'expires_at', type: 'month', caption: 'Fecha de pago', range: true, currentMonth: true },

      {
        name: 'origen', type: 'ub-select', caption: 'Origen', dataObject: [
          { id: "PROYECTO", text: 'NEGOCIOS' },
          { id: "GASTO GENERAL", text: 'GASTOS GENERALES' },
          { id: "PRESUPUESTO GASTO", text: 'PRESUPUESTOS DE GASTOS' }
        ]
      },
      { name: 'por_negocio', type: 'ub-select', caption: 'Por negocio', dataSource: 'getNegociosActivos' },
      { name: 'por_clasificacion', type: 'ub-select', caption: 'Por Clasificación', dataSource: 'getClasificacionGG' },
      { name: 'por_presupuesto', type: 'ub-select', caption: 'Por Presupuesto de gasto', dataSource: 'getClasificacionGG' },

      { name: 'ejecutivo_responsable', type: 'ub-select', caption: 'Creado por', dataSource: 'getUsuariosAdmin' },

      { name: 'cuenta_cte', type: 'ub-select', caption: 'Cuenta Corriente', dataSource: 'getCuentaCorriente' },

      {
        name: 'estado', type: 'checkbox', caption: 'Estado de los pagos', options: [
          { caption: 'Emitida', name: 'estado_emitida', value: true },
          { caption: 'Pagada', name: 'estado_pagada', value: false },
          { caption: 'Anulada', name: 'estado_nulo', value: false }
        ]
      },

      { name: 'tipo_pago', type: 'ub-select', caption: 'Tipo de pago', dataSource: 'getTiposEgresos' },



      {
        name: 'contabilizado', type: 'ub-select', caption: 'Contabilizado', dataObject: [
          { id: "True", text: 'Contabilizado' },
          { id: "False", text: 'No contabilizado' }
        ]
      },


      {
        name: 'tiene_pago', type: 'ub-select', caption: '¿Tiene Pago?', dataObject: [
          { id: 'true', text: 'CON PAGO' },
          { id: 'false', text: 'SIN PAGO' }
        ]
      },

      //{ name: 'cuenta_corriente', type: 'ub-select', caption: 'Creado por', dataSource: 'get_cta_cte' },


    ],
    renderTableItems: (content) => {
      const containerBoxTable = document.querySelector(".containerBox__table");
      const itemscontainerBox =
        containerBoxTable.querySelector(".containerBox__table-items") ||
        document.createElement("div");
      itemscontainerBox.classList.add("containerBox__table-items");

      itemscontainerBox.innerHTML = "";

      content.forEach((item) => {
        const tableItem = createTableItem(item);
        tableItem.addEventListener("click", () => {
          const idCot = item.id;
          unaBase.loadInto.viewport('/v3/views/cotizaciones/content.shtml?id=' + idCot + '&from=self');
        });
        itemscontainerBox.appendChild(tableItem);
      });

      containerBoxTable.appendChild(itemscontainerBox);

      //   Sin resultados
      const noResultsMsg = document.querySelector(".containerBox__table-msg");
      if (content.length === 0) {
        noResultsMsg.style.display = "flex";
      } else {
        noResultsMsg.style.display = "none";
      }
    },

    loadFilters: (i, inputsOptions) => {
      inputs.push(i);
      
      const optionsContainer = document.getElementById(`${i}Options`);
      const container = document.createElement("div");
      container.classList.add("CustomModal__body-group-options-container");
      optionsContainer.appendChild(container);

      // Verificar si el tipo de filtro es 'checkbox'
      if (inputsOptions[i].type === 'checkbox') {
        inputsOptions[i].options.forEach((option) => {
          const label = document.createElement("label");
          label.classList.add("checkbox-option");

          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.name = option.name;
          checkbox.checked = option.value;
          checkbox.dataset.caption = option.caption;

          checkbox.addEventListener("change", () => {
            option.value = checkbox.checked; // Actualizar el valor en la opción original

            // Almacenar las opciones seleccionadas en inputsObj
            inputsObj[i] = inputsOptions[i].options.filter(opt => opt.value);
            inputHtml(i, inputsObj[i], true);
          });

          const span = document.createElement("span");
          span.textContent = option.caption;

          label.appendChild(checkbox);
          label.appendChild(span);
          container.appendChild(label);
        });
      } else {
        // Caso predeterminado: Crear botones para las opciones
        inputsOptions[i].forEach((option) => {
          const button = document.createElement("button");
          button.classList.add("option");
          button.textContent = option.name;
          button.dataset.id = option.id;
          button.addEventListener("click", () => {
            inputsObj[i] = option;
            inputHtml(i, option, true);
            optionsContainer.style.transform = "scale(0)";
            setTimeout(() => {
              optionsContainer.style.display = "none";
            }, 100);
          });
          container.appendChild(button);
        });
      }

      const inputBtn = document.getElementById(`${i}Btn`);

      inputBtn.addEventListener("click", () => {
        optionsContainer.style.display = "block";
        setTimeout(() => {
          optionsContainer.style.transform = "scale(1)";
        }, 100);
      });

      optionsContainer.addEventListener("mouseleave", () => {
        optionsContainer.style.transform = "scale(0)";
        setTimeout(() => {
          optionsContainer.style.display = "none";
        }, 100);
      });
    }
    ,
    metrics: (data) => {
      const metricsData = [
        {
          icon: 'A',
          title: 'Neto',
          amount: data.neto
        },
      ];

      createMetrics(metricsData);
    },
    setApplyFiltersCallback: (callback) => {
      const applyFilters = document.getElementById("applyFilters");
      applyFilters.addEventListener("click", () => {
        inputs.forEach((i) => {
          inputsObjOriginal[i] = inputsObj[i];
        });
        toggleCustomModal(false);
        callback(); // Llama a la función pasada como parámetro
      });
    },
    initializeButtons: ({ primary, secondary }) => {
      const primaryButtonContainer = document.querySelector(".containerBox__filter .box2");
      const secondaryButtonContainer = document.querySelector(".CustomModalActions__body");

      // Define the button configuration
      const buttonConfig = {
        new: { class: "NewCustomModalBtn", icon: "fas fa-file-alt", text: "Crear" },
        print: { class: "ActionButton", icon: "fas fa-print", text: "Imprimir" },
        export_list: { class: "ActionButton", icon: "fas fa-file-export", text: "Exportar lista" },
        classic_view: { class: "ActionButton", icon: "fas fa-eye", text: "Vista clásica" }
      };

      // Create primary buttons
      primary.forEach(buttonKey => {
        const config = buttonConfig[buttonKey];
        if (config) {
          const button = document.createElement("button");
          button.className = config.class;
          button.innerHTML = `<span><i class="${config.icon}"></i></span><span>${config.text}</span>`;
          primaryButtonContainer.insertBefore(button, primaryButtonContainer.lastElementChild);
        }
      });

      // Create secondary buttons
      secondary.forEach((buttonKey, index) => {
        const config = buttonConfig[buttonKey];
        if (config) {
          const button = document.createElement("button");
          button.className = config.class;
          button.id = `action${index + 1}`;
          button.textContent = config.text;
          secondaryButtonContainer.appendChild(button);
        }
      });
    }

  };



  assignModalEventListeners();


  // Crear filtros en el modal
  generateFilterHtml(params)
  


  // Inicializar la lista
  unaBase.toolbox.search.initList(params);



  openActionsModalBtn.addEventListener("click", () => {
    actionsModal.style.display = "flex";
  });

  closeActionsModalBtn.addEventListener("click", () => {
    actionsModal.style.display = "none";
  });

  // Cerrar el modal cuando se haga clic fuera de él
  window.addEventListener("click", (event) => {
    if (event.target === actionsModal) {
      actionsModal.style.display = "none";
    }
  });
})();