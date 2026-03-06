let tipoModal = ''

const updateClay = async (e) => {
  e.preventDefault(); // Corregido aquí
  let fecha_desde = document.getElementById('fecha_desde').value
  let fecha_hasta = document.getElementById('fecha_hasta').value
  
  if(fecha_hasta == '' || fecha_desde == ''){
    document.getElementById('warning-modal-2').textContent = 'Debes elegir un rango de fechas'
    return;
  }

  let nodeUrl = localStorage.getItem('node_url')
  
  let url = ''

  switch (tipoModal) {
    case 'modal-docs': {
      url = `${nodeUrl}/get-sii-dtc?sid=${sid()}&fecha_desde=${fecha_desde}&fecha_hasta=${fecha_hasta}&hostname=${location.origin}`
      break;
    }

    case 'modal-movs': {
      url = `${nodeUrl}/get-mov-dtc?sid=${sid()}&date=${fecha_desde.substring(0, 7)}&fecha_hasta=${fecha_hasta}&hostname=${location.origin}`
      break;
    }
  }

  let config = {
    method: 'get',
    url,

  };
  spinnerMain(true)
  try {
    let res = await axios(config);
    spinnerMain(false)
    document.getElementById('warning-modal-2').textContent = res.data.message ? res.data.message : 'Carga exitosa!'
    document.getElementById('warning-modal-2').style.display = ''

    


  } catch (err) {
    throw err;
  }
}


const getAsientosDescuadrados = async (e) => {
  e.preventDefault(); // Previene el comportamiento predeterminado
  e.stopPropagation(); // Detiene la propagación del evento
  const formatDate = (dateString) => {
    if (!dateString) return ''; // Maneja casos en los que la fecha sea vacía
  
    // Extraer el año, mes y día manualmente
    const [year, month, day] = dateString.split('-');
  
    // Asegurarse de que el día y el mes tengan dos dígitos (ya los tiene en este caso)
    return `${day}-${month}-${year}`; // Formato DD-MM-YYYY
  };
  
  // Obtiene las fechas de los campos de entrada
  let fecha_desde = document.getElementById('fecha_desdead').value;
  let fecha_hasta = document.getElementById('fecha_hastaad').value;
  
  // Verifica si alguna de las fechas está vacía
  if (!fecha_desde || !fecha_hasta) {
    document.getElementById('warning-modal-2').textContent = 'Debes elegir un rango de fechas';
    return;
  }
  
  // Formatea las fechas
  fecha_desde = formatDate(fecha_desde);
  fecha_hasta = formatDate(fecha_hasta);



  let url = `${location.origin}/4DACTION/_force_getAsientosCustom?page=1&results=700&q=&q2=&dateFrom=${fecha_desde}&dateTo=${fecha_hasta}&registryDate=&activo=true&auto_=true`
  let config = {
    method: 'get',
    url,

  };
  spinnerMain(true)
  try {
    let res = await axios(config);
    
    spinnerMain(false)
    // Verifica si hay registros en los asientos
    const asientos = res.data.rows || [];
    const asientosList = document.getElementById('asientosdes-list');
    asientosList.innerHTML = ''; // Limpia la lista existente

    if (asientos.length === 0) {
        asientosList.innerHTML = `<li class="list-group-item">No hay asientos descuadrados.</li>`;
        return;
    }

    // Genera la lista de asientos descuadrados
    asientos.forEach((asiento) => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        listItem.textContent = `${asiento.docDate} - ${asiento.description} (ID: ${asiento.id})`;
        asientosList.appendChild(listItem);
    });

    document.getElementById('warning-modal-2').textContent = 'Asientos cargados correctamente';
    document.getElementById('warning-modal-2').style.display = '';


  } catch (err) {
    throw err;
  }
}



const getAsientosCondecimales = async (e) => {
  
  e.preventDefault(); // Previene el comportamiento predeterminado
  e.stopPropagation(); // Detiene la propagación del evento
  const formatDate = (dateString) => {
    if (!dateString) return ''; // Maneja casos en los que la fecha sea vacía

    // Extraer el año, mes y día manualmente
    const [year, month, day] = dateString.split('-');

    // Asegurarse de que el día y el mes tengan dos dígitos (ya los tiene en este caso)
    return `${day}-${month}-${year}`; // Formato DD-MM-YYYY
  };

  // Obtiene las fechas de los campos de entrada
  let fecha_desde = document.getElementById('fecha_desdea_dec').value;
  let fecha_hasta = document.getElementById('fecha_hastaa_dec').value;

  // Verifica si alguna de las fechas está vacía
  if (!fecha_desde || !fecha_hasta) {
    document.getElementById('warning-modal-2').textContent = 'Debes elegir un rango de fechas';
    return;
  }

  // Formatea las fechas
  fecha_desde = formatDate(fecha_desde);
  fecha_hasta = formatDate(fecha_hasta);



  
  let url = `${location.origin}/4DACTION/_V3_getAsientosConDecimales?page=1&results=700&q=&q2=&dateFrom=${fecha_desde}&dateTo=${fecha_hasta}&registryDate=&activo=true&auto_=true`
  let config = {
    method: 'get',
    url,

  };
  spinnerMain(true)
  try {
    let res = await axios(config);
    debugger
    spinnerMain(false)
    // Verifica si hay registros en los asientos
    const asientos = res.data.rows || [];
    const asientosList = document.getElementById('asientos-list');
    asientosList.innerHTML = ''; // Limpia la lista existente

    if (asientos.length === 0) {
      asientosList.innerHTML = `<li class="list-group-item">No hay asientos con decimales.</li>`;
      return;
    }

    // Genera la lista de asientos descuadrados
    asientos.forEach((asiento) => {
      const listItem = document.createElement('li');
      listItem.className = 'list-group-item';
      listItem.textContent = `${asiento.docDate} - ${asiento.description} (ID: ${asiento.id_comp})`;
      asientosList.appendChild(listItem);
    });

    document.getElementById('warning-modal-2').textContent = 'Asientos cargados correctamente';
    document.getElementById('warning-modal-2').style.display = '';


  } catch (err) {
    throw err;
  }
}




(function init() {

  if (document.getElementById('update-clay')) {
    document.getElementById('update-clay').addEventListener(('click'), (e) => updateClay(e))

  }


  if (document.getElementById('asientos-desc')) {
    document.getElementById('asientos-desc').addEventListener(('click'), (e) => getAsientosDescuadrados(e))

  }

  if (document.getElementById('asientos-des')) {
    console.log("botton funciona")
    document.getElementById('asientos-des').addEventListener(('click'), (e) => getAsientosCondecimales(e))

  }


  document.querySelectorAll('.openModal').forEach((e) => {

    e.addEventListener(('click'), (e) => {
      tipoModal = e.currentTarget.dataset.modal
      const modal = document.getElementById('exampleModalClay')
      modal.querySelector('#fecha_desde').value = ''
      modal.querySelector('#fecha_hasta').value = ''
      switch (tipoModal) {
        case 'modal-docs': {
          modal.querySelector('#exampleModalLabel').textContent = 'Actualizar bandeja clay'
          break;
        }

        case 'modal-movs': {
          modal.querySelector('#exampleModalLabel').textContent = 'Actualizar bandeja movimientos'
          break;
        }
      }

      
    })
  })

})();