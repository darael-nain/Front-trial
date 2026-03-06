let id_sobrecargo;

var btnSave = document.getElementById('btn-save');

var selNivel = document.getElementById('c_nivel');

document.addEventListener("DOMContentLoaded", () => {
  const renderCheck = (id, flag, type) => {

    let check = ''
    if (flag) {
      check = `<div class='form-check d-flex justify-content-center'><input class='form-check-input update-check ${type}' data-id="${id}" type='checkbox' checked></div></td>`
    } else {

      check = `<div class='form-check d-flex justify-content-center'><input class='form-check-input update-check ${type}' data-id="${id}" type='checkbox'></div></td>`
    }


    return check;

  }
  loadingLoad("loading-modal", true, "Cargando...");




  $(".tabledata").dataTable({
    pageLength: 100,
    fixedHeader: true,
    fixedHeader: true,
    "initComplete": function () {
      checkbox();
    },
    dom: "<'col'" +
      "<'row'" +
      "<'col-sm-6'l>" +
      "<'col-sm-6'f>" +
      ">" +
      "<'row dt-table'" +
      "<'col-sm-12'rt>" +
      ">" +
      "<'row'" +
      "<'col-sm-6'i>" +
      ">" +
      "<'row'" +
      "<'col-sm-12'p>" +
      ">" +
      ">",

    processing: true,
    bPaginate: false,
    language: {
      url: "/configuracion/script/spanish.json",
    },
    "ajax": {
      "url": window.location.origin + "/4DACTION/_light_getCuentasContables",
      "type": "GET",
      "datatype": "json",
      "dataSrc": function (data) {
        return data.rows;
      }
    },
    columns: [
      {
        data: "number",
      },
      {
        data: "name",
      },
      {
        data: "tipo",
      },

      {
        data: "i_operacional",
        render: function (data, type, row) {
          return row.i_operacional
            ? renderCheck(row.id, true, "i_operacional")
            : renderCheck(row.id, false, "i_operacional");
        },
      },

      {
        data: "c_operacional",
        render: function (data, type, row) {
          return row.c_operacional
            ? renderCheck(row.id, true, "c_operacional")
            : renderCheck(row.id, false, "c_operacional");
        },
      },

      {
        data: "i_nooperacional",
        render: function (data, type, row) {
          return row.i_nooperacional
            ? renderCheck(row.id, true, "i_nooperacional")
            : renderCheck(row.id, false, "i_nooperacional");
        },
      },

      {
        data: "g_admin",
        render: function (data, type, row) {
          return row.g_admin
            ? renderCheck(row.id, true, "g_admin")
            : renderCheck(row.id, false, "g_admin");
        },
      },

      {
        data: "is_impuesto",
        render: function (data, type, row) {
          return row.is_impuesto
            ? renderCheck(row.id, true, "i_impuesto")
            : renderCheck(row.id, false, "i_impuesto");
        },
      },
    ],
  });
  loadingLoad('loading-modal', false);


  const checkbox = () => {
    document.querySelectorAll('#table-data tbody .update-check').forEach(checkbox => {
      //Se agrega el evento listener a cada checkbox
      checkbox.addEventListener('change', e => {

        const element = e.target;
        const id = element.getAttribute('data-id');
        const tipo = element.classList[2];
        if (element.checked) {
          updateCuenta(id, tipo, true)
        } else {
          updateCuenta(id, tipo, false)
        }
      });

    });
  }

  const updateCuenta = (id, tipo, flag) => {
    $.ajax({
      url: "/4DACTION/_light_setCuentasContables",
      type: "POST",
      dataType: "json",
      data: {
        id_cuenta: id,
        item_value: flag,
        item_check: tipo
      },
      success: function (data) {
        if (data.success) {
          generarAvisoExitoso("Cuenta actualizada correctamente!");
        }
      },
      error: function (xhr, text, error) {
        generarAvisoError("Hubo un error al actualizar cuenta");
      },
    });
  }





});

const crearCuenta = () => {
  let i_operacional = document.getElementById('i_operacional').checked;
  let i_nooperacional = document.getElementById('i_nooperacional').checked;
  let g_admin = document.getElementById('g_admin').checked;
  let c_operacional = document.getElementById('c_operacional').checked;
  let i_impuesto = document.getElementById('i_impuesto').checked;

  const value = document.getElementById('c_tipo_input').value;


  //let c_tipo = document.getElementById('c_tipo')?.querySelector('option[value="' + value + '"]').id;
  let c_name = document.getElementById('c_name').value;
  let c_numero = document.getElementById('c_numero').value;
  let c_nivel = document.getElementById('c_nivel').value;

  

  if (value != "" && c_numero != "" && c_name != "" && c_nivel != "") {
    $.ajax({
      url: "/4DACTION/_light_setCuentasContables",
      type: "POST",
      dataType: "json",
      data: {
        i_operacional,
        i_nooperacional,
        g_admin,
        c_operacional,
        i_impuesto,
        c_tipo: value,
        c_name,
        c_numero,
        c_nivel
      },
      success: function (data) {

        if (data.success && !data.record_exists) {
          $('#exampleModalCenter').modal('hide');
          $('#table-data').DataTable().ajax.reload();
          generarAvisoExitoso("Cuenta creada exitosamente!");
        }

        if (data.record_exists) {

          generarAvisoError("Cuenta ya existente en los registros");
        }
      },
      error: function (xhr, text, error) {
        generarAvisoError("Hubo un error al crear cuenta contable");
      },
    });

  } else {
    generarAvisoError("Faltan campos por completar.")
  }
}

const setSelect = (tipo = "") => {

  var select = document.querySelector('#c_tipo');
  select.innerHTML = ""
  $.ajax({
    url: "/4DACTION/_light_getTipoCuentasContables",
    dataType: "json",
    data: {
      tipo,
    },
    success: function (response) {
      
      for (var i in response.rows) {
        select.innerHTML += `<option id="${response.rows[i].id}" value="${response.rows[i].tipo}"></option>`;
      }

    },
    error: function (xhr, text, error) {
      generarAvisoError("Hubo un error al cargar cuentas contables");
    },
  });

}

(function init() {



  //Crear cuenta
  btnSave.addEventListener("click", () => crearCuenta());


  //TIPO
  selNivel.addEventListener("change", () => setSelect(selNivel.value));
})();