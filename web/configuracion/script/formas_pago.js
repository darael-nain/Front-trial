



var btnSave = document.getElementById('btn-save');

var selNivel = document.getElementById('c_nivel');

const servicioInput = document.getElementById('servicio')
const datalist = document.getElementById('datalist')
const tableBody = document.getElementById('table-data')
const table_data_values = document.getElementById('table-data-values')
const btnAddRow = document.getElementById('addRow')

const btnSaveProyeccion = document.getElementById('saveProyeccion')

const mainTable = document.getElementById('tableTwo')

let isCustoms = document.getElementById('isCustom')
let Compras   = document.getElementById('compra')
let Ventas    = document.getElementById('venta')

const btnNewFormaPago = document.getElementById('new_forma_pago')
const modal = document.getElementById("modalValues");

const alertObj = new Alert();

//------------------------------------------------------------------------------------------

const tableListValues = document.getElementById('table_values')

let arrayValues = []
let pos_delete = []

let total_records = 0
let cont = 0


const setTableMain = async () => {

  let data = await getFormasPago()

  let row = "";
  data.rows.forEach(value => {
    row += `<tr class="pointer" data-id="${value.id}">
    <td>${value.descripcion}</td>
    <td class="text-center">${value.estado ? 'Si' : 'No'}</td>`
    row += `</tr>`
    tableBody.innerHTML = row

  })



  spinnerMain(false)
}

const finderTable = (event) => {

  let table, tr, td, i, txtValue;
  let td_folio;
  if (event.value === "") return;
  let h = event.value != undefined ? event.value : event.currentTarget.value;
  table = document.getElementById("tables");
  tr = table.getElementsByTagName("tr");

  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(h.toUpperCase()) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }


  }
}

const viewModalDetail = async (e) => {
  spinnerMain(true);
  // Se limpia la tabla del modal
  table_data_values.innerHTML = '';
  const contenido_table_main = e.target.textContent.trim();
  const id_forma_pago = e.target.parentNode.dataset.id;
  const pathFormaPago = document.getElementById('path_forma_pago');
  pathFormaPago.value = '';
  pathFormaPago.dataset.id = '';

  if (contenido_table_main !== '') {
    pathFormaPago.value = contenido_table_main;
    pathFormaPago.dataset.id = id_forma_pago;
  } else {
    arrayValues = [];
    pathFormaPago.value = '';
  }

  // Cargar proyeccion si es que la hay
  const data = await getProyeccionPago(id_forma_pago);
  document.getElementById('venta').checked = data.venta;
  document.getElementById('compra').checked = data.compra;
  document.getElementById('isCustom').checked = data.personalizado;

  if (data.rows.length > 0) {
    btnAddRow.style.display = 'none';

    alertObj.type = 'success';
    alertObj.msg = 'Correcto!';
    alertLoad(alertObj, 'alertas-modal');

    data.rows.forEach(val => {
      let row = `<tr data-id="${val.id}">`;
      row += `<td>${val.porcentaje}</td><td>${val.dia}</td>`;
      row += `<td><button type="button" class="btn btn-warning btn-delete" title="Eliminar linea"><i class="fas fa-trash"></i></button></td>`;
      row += `</tr>`;

      table_data_values.innerHTML += row;
    });

    // Asignar función de eliminación a cada botón de eliminar
    document.querySelectorAll('.btn-delete').forEach(button => {
      button.addEventListener('click', async (e) => {
        const rowId = e.target.closest('tr').dataset.id;
        await deleteProyeccionPago(rowId);
        e.target.closest('tr').remove(); // Eliminar fila de la tabla

        // Verificar si todas las filas han sido eliminadas
        if (table_data_values.querySelectorAll('tr').length === 0) {
          btnAddRow.style.display = 'block';
        }
      });
    });
  } else {
    btnAddRow.style.display = 'block';
  }

  // Abrir modal
  openModal(modal);
  spinnerMain(false);
}

// Función para eliminar una proyección de pago
const deleteProyeccionPago = async (id) => {
  const formData = new FormData();
  formData.append('create', false);
  formData.append('id', id);

  try {
    const response = await axios.post(window.origin + '/4DACTION/_force_setPagoProyeccion', formData);
    if (response.data.success) {
      alertObj.type = 'success';
      alertObj.msg = 'Linea eliminada correctamente';
      alertLoad(alertObj, 'alertas-modal');
    } else {
      alertObj.type = 'danger';
      alertObj.msg = 'Error al eliminar la linea';
      alertLoad(alertObj, 'alertas-modal');
    }
  } catch (error) {
    console.log(error);
    alertObj.type = 'danger';
    alertObj.msg = 'Error al eliminar la linea';
    alertLoad(alertObj, 'alertas-modal');
  }
}


const addRow = async (event) => {
  // let row = `<tr>
  // <td contenteditable="true" onkeyup="completeFormaPago(this)"></td>
  // <td contenteditable="true" onkeyup="completeFormaPago(this)"></td>
  // </tr>`
  // document.getElementById('table-data-values').innerHTML += row

  var row = mainTable.tBodies[0].insertRow(-1);

  let cell3 = row.insertCell(0);
  cell3.addEventListener('keyup', (e) => completeFormaPago(e))
  cell3.contentEditable = true

  let cell4 = row.insertCell(0);
  cell4.addEventListener('keyup', (e) => completeFormaPago(e))
  cell4.contentEditable = true

  let cell5 = row.insertCell(2);
  cell5.addEventListener('click', (e) => deleteRow(e))
  cell5.innerHTML = '<button type="button" class="btn btn-warning" title="Eliminar linea"><i class="fas fa-trash"></i></button>'
  cell5.classList.add('text-center')
  cell5.style.backgroundColor = '#ffffff'
}


const deleteRow = (e) => {
  mainTable.tBodies[0].deleteRow(0);

  let id_proyeccion = e.target.parentNode.dataset.id


}

const completeFormaPago = (e) => {
  let isNum = /^\d+$/.test(e.currentTarget.textContent);
  let key = e.keyCode
  const index = e.currentTarget.cellIndex
  const rowIndex = e.currentTarget.parentNode.rowIndex


  //Mientras la tabla sea borrar y mientras haya algo que borrar

  if (key == 8 && arrayValues.length > 0) {

    let pos = arrayValues.findIndex(val => val.index === index && val.rowIndex === rowIndex)
    pos_delete.push(pos)
    if (pos >= 0) {
      arrayValues.splice(pos, 1);
      document.getElementById('path_forma_pago').value = ""
      arrayValues.forEach(val => {
        document.getElementById('path_forma_pago').value += val.contenido

      })
      return;
    }

  }


  let cont_lenght = e.currentTarget.textContent.length
  let is_hyppen = cont_lenght > 1 ? /^(-+[A-Z0-9]+-?)$/.test(e.currentTarget.textContent) : false
  //   /^(-+[A-Z0-9]+-?)$/.test(e.currentTarget.textContent) 
  if ((isNum) || (e.currentTarget.textContent.startsWith('-'))) {
    //Si no hay nada en el input principal
    if (document.getElementById('path_forma_pago').value === '') {
      let percent, day
      let res = ''

      if (index == 0) {
        percent = e.currentTarget.textContent
      }

      if (index == 1) {
        day = e.currentTarget.textContent
      }


      if (percent != undefined) {
        res = percent + `% `

      }

      if (day != undefined) {
        res = `${day != '0' ? "a " + day + " dias," : "al dia,"}`
      }

      //Comprobar si el valor ingresado ya esta en el input
      let is_value = arrayValues.findIndex(val => val.index === index && val.rowIndex === rowIndex)
      let d = {
        rowIndex: rowIndex,
        index: index,
        contenido: res,
      }

      //Significa que el valor ya esta ingresado
      if (is_value >= 0) {
        arrayValues.splice(is_value, 1);

        let percentIndex = arrayValues.findIndex(val => val.index === e.currentTarget.parentNode.children[0].cellIndex && val.rowIndex === rowIndex)
        let po = is_value //posicion de un elemento borrado

        if (po >= 0) {
          arrayValues.splice(po, percentIndex, d)
        } else {
          arrayValues.push(d)
        }
        cont++
      }

      //Significa que el valor no esta
      if (is_value < 0) {
        let po = pos_delete[0] //posicion de un elemento borrado
        if (po >= 0) {
          arrayValues.splice(po, po - 1, d)
        } else {
          arrayValues.push(d)
        }
        cont++
      }

      pos_delete = []


      document.getElementById('path_forma_pago').value = ""
      arrayValues.forEach(val => {
        document.getElementById('path_forma_pago').value += val.contenido

      })
    }
  } else {
    e.currentTarget.textContent = ""
  }


}

const saveProyeccion = async (event) => {
  try {
    
    const id_forma_pago = document.getElementById('path_forma_pago').dataset.id;
    const table = document.getElementById("tableTwo");
    const tr = table.querySelectorAll("tbody tr");

    // if (tr.length === 0) {
    //   closeModal(modal);
    //   alertObj.type = 'danger';
    //   alertObj.msg = 'Debes agregar el detalle de la forma de pago';
    //   alertLoad(alertObj, 'alertas-modal');
    //   spinnerMain(false);
    //   return;
    // }

    const descripcion = document.getElementById('path_forma_pago').value;
    const isCustoms = document.getElementById('isCustom').checked;
    const Compras = document.getElementById('compra').checked;
    const Ventas = document.getElementById('venta').checked;

    spinnerMain(true);

    const data_forma_pago = new FormData();
    data_forma_pago.append('id', id_forma_pago);
    data_forma_pago.append('create', id_forma_pago ? false : true);
    data_forma_pago.append('descripcion', descripcion);
    data_forma_pago.append('personalizado', isCustoms);
    data_forma_pago.append('compra', Compras);
    data_forma_pago.append('venta', Ventas);

    const config = {
      method: 'post',
      url: window.origin + "/4DACTION/_V3_setFormaspago",
      data: data_forma_pago,
    };

    let res_forma_pago = null;

    try {
      res_forma_pago = await axios(config);
    } catch (error) {
      console.log(error);
      spinnerMain(false);
      return;
    }

    const id_pago = id_forma_pago || res_forma_pago.data.id;

    const dataDB = Array.from(tr).map(row => {
      const cells = row.getElementsByTagName("td");
      const dia = cells[1].textContent || cells[1].innerText;
      const porcentaje = cells[0].textContent || cells[0].innerText;
      return {
        id_forma_pago: id_pago,
        id: row.dataset.id,
        edit: row.dataset.id ? true : false,
        create: !row.dataset.id,
        dia,
        porcentaje
      };
    });

    for (let item of dataDB) {
      const data = new FormData();
      Object.keys(item).forEach(key => data.append(key, item[key]));

      const config2 = {
        method: 'post',
        url: window.origin + '/4DACTION/_force_setPagoProyeccion',
        data: data
      };

      try {
        const response = await axios(config2);
        if (response.data.success) {
          alertObj.type = 'success';
          alertObj.msg = 'Proyección guardada correctamente';
        } else {
          alertObj.type = 'danger';
          alertObj.msg = 'Error al guardar la proyección';
        }
        alertLoad(alertObj, 'alertas-modal');
      } catch (error) {
        console.log(error);
        alertObj.type = 'danger';
        alertObj.msg = 'Error al guardar la proyección';
        alertLoad(alertObj, 'alertas-modal');
      }
    }

    closeModal(modal);
    setTableMain();
  } catch (ex) {
    console.log(ex);
  } finally {
    spinnerMain(false);
  }
}



(function init() {

  setTableMain()


  servicioInput.addEventListener("keyup", (ff) => finderTable(ff));


  btnAddRow.addEventListener("click", (e) => addRow(e));

  btnSaveProyeccion.addEventListener("click", (e) => saveProyeccion(e));

  
  btnNewFormaPago.addEventListener("click", (e) => viewModalDetail(e));


  //---- EVENTOS DE TABLAS -------//
  tableBody.addEventListener("click", (e) => viewModalDetail(e));

  //------------------------------------- USO DE UNA VEZ
  let close_modal_values = document.getElementsByClassName('close_modal')[0]
  let close_values_selected = document.getElementsByClassName('close_modal')[1]

  close_modal_values.addEventListener("click", (e) => closeModal(e));

  close_values_selected.addEventListener("click", (e) => closeModal(e));

  spinnerMain(false)

})();