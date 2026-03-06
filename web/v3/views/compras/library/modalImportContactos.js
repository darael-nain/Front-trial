var modalImportadorContactos = null;
var btnUploadContactos = null;

const asegurarReferenciasModalContactos = () => {
  if (!modalImportadorContactos) {
    modalImportadorContactos = document.getElementById('modalImportadorContactos') || document.getElementById('modalImportadorPagos');
  }
  if (!btnUploadContactos && modalImportadorContactos) {
    btnUploadContactos = modalImportadorContactos.querySelector('#upload-btn');
  }
};

const obtenerModuloActivo = () => {
  const activo = document.querySelector('html > body.menu.home > aside > div > div > ul > li.active');
  return activo && activo.dataset && activo.dataset.name ? activo.dataset.name.toUpperCase() : '';
};

const descargarPlantillaContactos = () => {
  asegurarReferenciasModalContactos();
  if (!modalImportadorContactos) return;

  const sid = unaBase.sid.encoded();
  const modulo = obtenerModuloActivo();
  const fileName = 'plantilla_contactos';
  let url = `${nodeUrl}/export-template-contactos/?filename=${encodeURIComponent(fileName)}&sid=${encodeURIComponent(sid)}&hostname=${window.location.origin}`;

  if (modulo) {
    url += `&modulo=${encodeURIComponent(modulo)}`;
  }

  const download = window.open(url);
  if (download) {
    download.blur();
    window.focus();
  }
};

const esImportacionContactosExitosa = (response) => {
  if (!response) return false;
  if (response.success === true || response.success === 'true') return true;
  if (response.data && (response.data.success === true || response.data.success === 'true')) return true;
  if (Array.isArray(response.errors) && response.errors.length) return false;
  if (response.error === true || response.error === 'true') return false;
  if (typeof response.errorMsg === 'string' && response.errorMsg.trim() !== '') return false;
  if (Array.isArray(response.errorData) && response.errorData.some(item => item && item.success === false)) return false;
  return true;
};

const mostrarMensajeContactos = (texto, tipo) => {
  asegurarReferenciasModalContactos();
  const warningModal = document.getElementById('warning-modal');
  const warningRow = document.getElementById('warning-row');
  const iconos = {
    success: 'bi-check-circle-fill',
    warning: 'bi-exclamation-triangle-fill',
    danger: 'bi-x-circle-fill',
    info: 'bi-info-circle-fill'
  };
  if (!warningModal) return;
  warningModal.innerHTML = `<span class="badge bg-${tipo}"><i class="bi ${iconos[tipo]}"></i> ${texto}</span>`;
  warningModal.style.display = 'block';
  if (warningRow) warningRow.style.display = 'block';
};

const ocultarResumenErroresContactos = () => {
  asegurarReferenciasModalContactos();
  const warningModal = document.getElementById('warning-modal');
  const warningRow = document.getElementById('warning-row');
  const resumen = document.getElementById('error-summary-container');
  const detalle = document.getElementById('error-detail-list');

  if (warningModal) {
    warningModal.style.display = 'none';
    warningModal.innerHTML = '';
  }
  if (warningRow) warningRow.style.display = 'none';
  if (resumen) resumen.style.display = 'none';
  if (detalle) detalle.innerHTML = '';
};

const resetModalImportadorContactos = () => {
  asegurarReferenciasModalContactos();
  if (!modalImportadorContactos) return;
  const fileInput = modalImportadorContactos.querySelector('#excel-file');
  const fileLabel = modalImportadorContactos.querySelector('#fileNameContactos');
  if (fileInput) fileInput.value = '';
  if (fileLabel) fileLabel.textContent = 'Sin archivos seleccionados';
  ocultarResumenErroresContactos();
};

const cerrarModalImportadorContactos = () => {
  asegurarReferenciasModalContactos();
  if (!modalImportadorContactos) return;
  modalImportadorContactos.style.display = 'none';
};

const refrescarListadoContactos = () => {
  if (typeof unaBase !== 'undefined' && unaBase.toolbox && unaBase.toolbox.search) {
    const search = unaBase.toolbox.search;
    const reexecute = () => {
      if (typeof search._advancedSearch === 'function') {
        search._advancedSearch(true);
      } else if (typeof search.restore === 'function') {
        search.restore();
      }
    };

    try {
      if (typeof search.save === 'function') {
        search.save();
      }
    } catch (err) {
      console.warn('Error al guardar búsqueda antes de refrescar contactos', err);
    }

    setTimeout(() => {
      try {
        reexecute();
      } catch (err) {
        console.warn('Error al refrescar listado de contactos', err);
      }
    }, 0);
  }
};

const ajustarTextosModalContactos = () => {
  asegurarReferenciasModalContactos();
  if (!modalImportadorContactos) return;
  const descripcion1 =
    modalImportadorContactos.querySelector('[data-contactos-step="descripcion-1"]') ||
    modalImportadorContactos.querySelector('[data-importador-contactos="descripcion-step1"]') ||
    modalImportadorContactos.querySelector('#modal-body p:nth-of-type(1)');
  const descripcion2 =
    modalImportadorContactos.querySelector('[data-contactos-step="descripcion-2"]') ||
    modalImportadorContactos.querySelector('[data-importador-contactos="descripcion-step2"]') ||
    modalImportadorContactos.querySelector('#modal-body p:nth-of-type(2)');

  if (descripcion1) {
    descripcion1.textContent = 'Una vez descargada la plantilla Excel, puede reemplazar los datos de prueba con los definitivos.';
  }
  if (descripcion2) {
    descripcion2.textContent = 'Para importar contactos, vuelve aquí y carga el archivo Excel utilizando el siguiente formulario (paso 2).';
  }
};

const importarContactosExcel = async () => {
  asegurarReferenciasModalContactos();
  if (!modalImportadorContactos || !btnUploadContactos) return;
  const fileInput = modalImportadorContactos.querySelector('#excel-file');

  if (btnUploadContactos.dataset.loading === 'true') {
    return;
  }

  if (!fileInput || fileInput.files.length === 0) {
    mostrarMensajeContactos('⚠️ Debes seleccionar un archivo Excel para poder importarlo!', 'warning');
    return;
  }

  const sid = unaBase.sid.encoded();
  const data = new FormData();
  data.append('upload[attachment]', fileInput.files[0]);
  data.append('sid', sid);

  btnUploadContactos.dataset.loading = 'true';
  btnUploadContactos.disabled = true;
  unaBase.ui.block();

  try {
    const response = await $.ajax({
      url: `${nodeUrl}/import-contactos?hostname=${window.location.origin}&sid=${sid}`,
      type: 'POST',
      contentType: false,
      data,
      processData: false,
      cache: false
    });

    ocultarResumenErroresContactos();

    if (esImportacionContactosExitosa(response)) {
      toastr.success('Contactos importados exitosamente.');
      cerrarModalImportadorContactos();
      resetModalImportadorContactos();
      refrescarListadoContactos();
    } else {
      const errorMessage = response?.errorMsg || response?.message || 'Error al importar contactos';
      mostrarMensajeContactos('❌ ' + errorMessage, 'danger');
      if (errorMessage) {
        toastr.error(errorMessage);
      }
    }
  } catch (err) {
    mostrarMensajeContactos('❌ Error al conectarse con el servidor. Inténtalo nuevamente.', 'danger');
  } finally {
    unaBase.ui.unblock();
    btnUploadContactos.disabled = false;
    btnUploadContactos.dataset.loading = 'false';
  }
};

const inicializarModalImportadorContactos = () => {
  asegurarReferenciasModalContactos();
  if (!modalImportadorContactos) return;

  const btnDescargar = modalImportadorContactos.querySelector('#download-template-btn');
  const fileInput = modalImportadorContactos.querySelector('#excel-file');
  const btnCerrarSuperior = modalImportadorContactos.querySelector('.modal-close');
  const btnCerrarInferior = modalImportadorContactos.querySelector('[data-close-modal]');

  if (btnDescargar) {
    btnDescargar.addEventListener('click', () => descargarPlantillaContactos());
  }

  if (btnUploadContactos) {
    btnUploadContactos.addEventListener('click', () => importarContactosExcel());
  }

  const cerrar = () => cerrarModalImportadorContactos();

  if (btnCerrarSuperior) {
    btnCerrarSuperior.addEventListener('click', cerrar);
  }

  if (btnCerrarInferior) {
    btnCerrarInferior.addEventListener('click', cerrar);
  }

  if (fileInput) {
    fileInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file && file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        toastr.warning('Solo se acepta archivos de tipo excel.');
        event.target.value = '';
        const fileLabel = modalImportadorContactos.querySelector('#fileNameContactos');
        if (fileLabel) fileLabel.textContent = 'Sin archivos seleccionados';
        return;
      }
      const fileLabel = modalImportadorContactos.querySelector('#fileNameContactos');
      if (fileLabel) fileLabel.textContent = file ? file.name : 'Sin archivos seleccionados';
    });
  }

  const overlayClickHandler = (event) => {
    if (event.target === modalImportadorContactos) {
      cerrar();
    }
  };

  modalImportadorContactos.addEventListener('mousedown', overlayClickHandler);
};

const mostrarModalImportadorContactos = () => {
  asegurarReferenciasModalContactos();
  if (!modalImportadorContactos) return;
  const titulo = modalImportadorContactos.querySelector('.title-modal');
  if (titulo) {
    titulo.textContent = 'Importador de Contactos';
  }
  ajustarTextosModalContactos();
  resetModalImportadorContactos();
  modalImportadorContactos.style.display = 'block';
};

window.showModalImportadorContactos = mostrarModalImportadorContactos;
window.resetModalImportadorContactos = resetModalImportadorContactos;
window.closeModalImportadorContactos = cerrarModalImportadorContactos;

document.addEventListener('DOMContentLoaded', () => {
  asegurarReferenciasModalContactos();
  ajustarTextosModalContactos();
  inicializarModalImportadorContactos();
});

