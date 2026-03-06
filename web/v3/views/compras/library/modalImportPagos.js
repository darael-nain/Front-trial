
var btnUploadFile = document.getElementById('upload-btn')
var modalPagos = document.getElementById("modalImportadorPagos");


const downloadTemplate = () => {
  let fileName = '';
  let modulo = document.querySelector('html > body.menu.home > aside > div > div > ul > li.active').dataset.name.toUpperCase();
  let sid = unaBase.sid.encoded();
  let url = '';

  // Obtener el título del modal
  let modalTitle = document.querySelector('#modalImportadorPagos .title-modal').textContent;
  const titulo = modulo === 'GASTOS' ? 'Importar Ordenes de compra' : 'Importar Rendiciones'

  if (modalTitle === "Importador de Apertura") {
    fileName = " CARGAS DE APERTURAS";
    url = nodeUrl + '/export-template-report';
  } else if (modalTitle === "Importador de Pagos") {
    fileName = (modulo === 'GASTOS') ? "orden_de_compra_S_N" : "rendicion_S_N";
    url = nodeUrl + '/export-template-import-pagos';
  } else if (modalTitle === "Importar y justificar masivo") {
    fileName = (modulo === 'GASTOS') ? "orden_de_compra_S_N" : "rendicion_S_N";
    url = nodeUrl + '/exportPlantillaJustificarMasivo';
  } else if (modalTitle === titulo) {
    fileName = (modulo === 'GASTOS') ? "orden_de_compra_S_N" : "rendicion_S_N";
    url = nodeUrl + '/export-template-expenses-new';
  } else if (modalTitle === "Importador de Contactos") {
    fileName = "plantilla_contactos";
    url = nodeUrl + '/export-template-contactos';
  }


  url += `/?filename=${fileName}&sid=${encodeURIComponent(sid)}&modulo=${modulo}&hostname=${window.location.origin}`;

  var download = window.open(url);
  if (download) {
    download.blur();
    window.focus();
  }
};


const importExcel = async () => {
  const fileInput = document.getElementById('excel-file');
  const sid = unaBase.sid.encoded();
  const modulo = document.querySelector('html > body.menu.home > aside > div > div > ul > li.active').dataset.name.toUpperCase();
  if (fileInput.files.length === 0) {
    mostrarMensaje('⚠️ Debes seleccionar un archivo Excel para poder importarlo!', 'warning');
    return;
  }

  const file = fileInput.files[0];
  const data = new FormData();
  data.append('upload[attachment]', file);
  data.append('sid', sid);
  let separate = $('#modalImportadorPagos input[name="separate"]').prop('checked');
  data.append('separate', separate);
  if (modulo == "GASTOS") {
    data.append('tipo', "OC");
  } else {
    data.append('tipo', "FXR");
  }

  const modalTitle = document.querySelector('#modalImportadorPagos .title-modal').textContent;
  const endpoints = {
    "Importador de Apertura": "/import-excel-random-data",
    "Importador de Pagos": "/import-pagos-masivos",
    "Importar y justificar masivo": "/importJustificarMasivos",
    'Importar Ordenes de compra': "/import-load-expenses-new",
    'Importar Rendiciones': "/import-load-expenses-new",
    "Importador de Contactos": "/import-contactos"
  };

  const url = endpoints[modalTitle];
  if (!url) {
    mostrarMensaje('❌ No se pudo determinar la acción a realizar con el archivo.', 'danger');
    return;
  }

  unaBase.ui.block();

  try {
    const response = await $.ajax({
      url: `${nodeUrl}${url}?hostname=${window.location.origin}&sid=${sid}`,
      type: 'POST',
      contentType: false,
      data,
      processData: false,
      cache: false,
    });

    unaBase.ui.unblock();

    ocultarResumenErrores();

    if (modalTitle === "Importador de Apertura") {
      const mensaje = response?.checkApertura?.success
        ? '✅ Apertura cargada correctamente. Recuerda buscarla con el filtro de "Manual" activo.'
        : 'ℹ️ Apertura cargada correctamente, pero está inactiva. Recuerda buscarla con el filtro de "Manual".';
      toastr.success(mensaje);
      modalPagos.style.display = "none";
    } else if (modalTitle === "Importador de Pagos") {
      const { ul, todoOk } = crearListaResultados(response);
      if (todoOk) {
        modalPagos.style.display = "none";
        document.querySelector('li.active a').click();
      } else {
        mostrarListaEnModal(ul);
      }
    } else if (modalTitle === "Importador de Contactos") {
      if (response.success) {
        toastr.success('✅ Contactos importados exitosamente!');
        modalPagos.style.display = "none";
        // Refrescar la lista de contactos
        if (typeof unaBase !== 'undefined' && unaBase.toolbox && unaBase.toolbox.search) {
          unaBase.toolbox.search.save();
          unaBase.toolbox.search.restore();
        }
      } else {
        mostrarMensaje('❌ ' + (response.errorMsg || 'Error al importar contactos'), 'danger');
      }
    } else {
      const ul = document.createElement('ul');
      ul.style.cssText = 'list-style-type: none; padding: 0; margin: 0; font-size: 13px';

      response.errorData.forEach((item, index) => {
        const li = document.createElement('li');
        li.style.marginBottom = '5px';

        li.innerHTML = item.success
          ? `<div class="badge-error bg-success text-white"><i class="bi bi-check-circle-fill"></i> ${item.msg}</div>`
          : `<div class="badge-error"><i class="bi bi-x-circle-fill"></i> ${item.msg}</div>`;

        ul.appendChild(li);
      });

      mostrarListaEnModal(ul);
    }

  } catch (err) {
    unaBase.ui.unblock();
    mostrarMensaje('❌ Error al conectarse con el servidor. Inténtalo nuevamente.', 'danger');
  }
};

const mostrarMensaje = (texto, tipo) => {
  const warningModal = document.getElementById('warning-modal');
  const iconos = {
    success: 'bi-check-circle-fill',
    warning: 'bi-exclamation-triangle-fill',
    danger: 'bi-x-circle-fill',
    info: 'bi-info-circle-fill'
  };
  warningModal.innerHTML = `<span class="badge bg-${tipo}"><i class="bi ${iconos[tipo]}"></i> ${texto}</span>`;
  warningModal.style.display = 'block';
};

const crearListaResultados = (data) => {
  const ul = document.createElement('ul');
  ul.style.cssText = 'list-style-type: none; padding: 0; font-size: 13px';

  let todoOk = true;

  data.forEach(item => {
    const li = document.createElement('li');
    li.style.marginBottom = '5px';

    li.innerHTML = item.success
      ? `<div class="badge-error bg-success text-white"><i class="bi bi-check-circle-fill"></i> Importado con éxito. Folio: ${item.identificador}</div>`
      : (todoOk = false,
        `<div class="badge-error"><i class="bi bi-x-circle-fill"></i> ${item.errorMsg}</div>`);

    ul.appendChild(li);
  });

  return { ul, todoOk };
};

const mostrarListaEnModal = (listaElement) => {
  const resumen = document.getElementById('error-summary-container');
  const detalle = document.getElementById('error-detail-list');
  const alertBox = resumen.querySelector('.alert');
  const modalTitle = document.querySelector('#modalImportadorPagos .title-modal').textContent;

  // Verifica si hay errores (excluye los badge success)
  const hayErrores = listaElement.querySelector('.badge-error:not(.bg-success)');

  // Limpiar y agregar lista de errores
  detalle.innerHTML = '';
  detalle.appendChild(listaElement);

  // Mostrar mensaje dependiendo si hay errores o no
  alertBox.innerHTML = hayErrores
    ? `<strong><i class="bi bi-exclamation-triangle-fill"></i> Se detectaron errores al procesar el archivo.</strong>
       <button class="btn btn-sm btn-link p-0 ms-2" onclick="toggleDetalleErrores()">Ver detalles</button>`
    : `<strong><i class="bi bi-check-circle-fill"></i> Archivo procesado correctamente. No se encontraron errores.</strong>`;

  // Cambiar color de fondo según si hay errores o no
  alertBox.style.backgroundColor = hayErrores ? '#f8d7da' : '#d4edda';  // rojo para error, verde para correcto
  alertBox.style.color = hayErrores ? '#721c24' : '#155724';  // texto rojo para error, verde para correcto
  
  resumen.style.display = 'block';
  detalle.style.display = 'none';

  // Si no hay errores, cerramos el modal y redireccionamos
  if (!hayErrores) {
    toastr.success('Archivo procesado correctamente. Redirigiendo...');

    // Cerrar el modal
    const modal = document.getElementById('modalImportadorPagos');

    // Redirigir después de un pequeño delay
    setTimeout(() => {
      modal.style.display = 'none';
      document.querySelector('aside li.active a').click();
    }, 2500);
  }
};




const toggleDetalleErrores = () => {
  const detalle = document.getElementById('error-detail-list');
  detalle.style.display = detalle.style.display === 'none' ? 'block' : 'none';
};

const ocultarResumenErrores = () => {
  const resumen = document.getElementById('error-summary-container');
  const detalle = document.getElementById('error-detail-list');
  resumen.style.display = 'none';
  detalle.innerHTML = '';
};







const closeModal = () => {
  // Abrir el modal cuando se hace click en el botón
  modalPagos.style.display = "none";
  document.querySelector('li.active a').click();
}

const resetModalImportador = () => {
  // Limpiar input de archivo
  const fileInput = document.getElementById("excel-file");
  if (fileInput) fileInput.value = "";

  // Ocultar contenedor de errores
  const errorContainer = document.getElementById("error-summary-container");
  if (errorContainer) errorContainer.style.display = "none";

  // Limpiar contenido de la alerta
  const alertBox = errorContainer?.querySelector(".alert");
  if (alertBox) alertBox.innerHTML = "";

  // Limpiar y ocultar el detalle de errores
  const errorDetailList = document.getElementById("error-detail-list");
  if (errorDetailList) {
    errorDetailList.innerHTML = "";
    errorDetailList.style.display = "none";
  }

  // Desmarcar checkbox "separate"
  const separateCheckbox = document.getElementById("separate");
  if (separateCheckbox) separateCheckbox.checked = false;

  // Ocultar sección de separación (checkbox + label)
  const separateRow = document.querySelector(".row.separate");
  if (separateRow) separateRow.style.display = "none";
}





(function init() {


  var btnPlantillaDownload = document.querySelector('#modalImportadorPagos #download-template-btn')
  if (btnPlantillaDownload) {
    btnPlantillaDownload.addEventListener("click", () => downloadTemplate());
  }

  btnUploadFile.addEventListener("click", () => importExcel());

  document.querySelector('#modalImportadorPagos #excel-file').value = ''

  document.querySelector('#modalImportadorPagos #excel-file').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file && file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      toastr.warning("Solo se acepta archivos de tipo excel.");
      event.target.value = '';
    }
  });
})();