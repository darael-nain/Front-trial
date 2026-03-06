let id_ctacorriente;
setSelect();

async function getCuentaContable() {
  const response = await fetch("/4DACTION/_light_get_param_cuentasctbe");
  const cuentas = await response.json();
  return cuentas;
}

async function getDataCuentaCte(id) {
  const response = await fetch("/4DACTION/_light_get_param_cuentascte?id=" + id);
  const cuentas = await response.json();
  return cuentas;
}

function setSelect() {
  var select = $('#cta_contable');
  $.ajax({
    url: "/4DACTION/_light_get_param_cuentasctbe",
    dataType: "json",
    success: function (response) {
      for (var i in response.data) {
        select.append(
          "<option value=" + response.data[i].number + " data-subtext=" + response.data[i].number + " >" + response.data[i].nombre_cuenta + "</option>"
        );
      }

      $('#cta_contable').selectpicker('refresh');
    },
    error: function (xhr, text, error) {
      generarAvisoError("Hubo un error al cargar cuentas contables");
    },
  });

  var select_banco = $('#id_banco');
  $.ajax({
    url: "/4DACTION/api_banco",
    dataType: "json",
    success: function (response) {
      for (let value of response.rows) {
        select_banco.append(
          `<option value='${value.id}' data-subtext='${value.codigo_banco}'>${value.banco}</option>`
        );
      }

      $('#id_banco').selectpicker('refresh');
    },
    error: function (xhr, text, error) {
      generarAvisoError("Hubo un error al cargar bancos");
    },
  });


}

async function setTableCuentas() {
  let cuentas = [];
  try {
    cuentas = await getCuentaContable();

    loadingLoad("loading-modal", true, "Cargando...");

    $.ajax({
      url: "/4DACTION/_light_get_param_cuentascte",
      dataType: "json",
    }).done(function (data) {
      $(".tablecuentas").dataTable({
        "bDestroy": true,
        drawCallback: function (settings) {
          $(".selectpicker").selectpicker();
        },
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
          // Bold the grade for all 'A' grade browsers
          //console.log("SE LLAMO DENUEVO");
        },
        //Blfrtip

        dom: "<'col'" +
          "<'row'" +
          "<'col-sm-12'B>" +
          ">" +
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
        buttons: [{
          extend: "colvis",
          text: '<div class="row"><div class="col"><i class="fas fa-eye"></i></div></div>',
          className: "btn btn-outline-info btn-lg",
          titleAttr: "Visualizar columnas",
          collectionLayout: "fixed three-column",
          postfixButtons: ["colvisRestore"],
        },],

        language: {
          url: "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json",
        },
        aaData: data.rows,
        columns: [
          {
            data: "id",
            visible: false,
          },
          {
            data: "nombre_banco",
          },
          {
            data: "cuenta_corriente",
          },
          {
            data: "cuenta_contable",
            render: function (data, type, rows, meta) {
              //rows.codigo_cuenta_contable
              let selectop = "";
              selectop =
                '<select class="form-control selectpicker update_contable" data-live-search="true" required>';

              for (let value of cuentas.data) {
                selectop += `<option value="${value.number}" data-subtext="${value.number}" ${rows.cuenta_contable == value.number ? "selected" : ""}>${value.nombre_cuenta}</option>`;
              }
              selectop += "</select>";
              return selectop;
            },
          },
          {
            data: null,
            render: function (data, type, row) {
              //\u00A0
              return `<div class="d-flex justify-content-center"><button class="btn btn-danger btn-sm delete_sb" data-toggle="modal" data-target="#ModalConfirm" data-toggle="tooltip" data-placement="top" title="Borrar registro" style="background: #FC4903;"><i class="fas fa-trash-alt"></i></button>\u00A0
                   <button class="btn btn-primary btn-sm dt-control"><i class="far fa-eye"></i></button></div>`;
            },
          },

        ],
        columnDefs: [{
          targets: [2, 3],
          searchable: false
        }],
      });

      loadingLoad("loading-modal", false);
    });
  } catch (e) {
    console.log("Error" + e);
  }
}


async function tableDetalle(data) {
  let tabledata = null;
  let cuentas = [];
  cuentas = await getDataCuentaCte(data.id);

  for (let value of cuentas.rows) {
    tabledata = `<table cellpadding="30" cellspacing="0" border="0" style="padding-left:50px;">
      <tr>
      <th style="width: 200px;">Nro Cheque inicial: </th>
      <td>${value.nrocheque_inicial}</td>
      </tr>

      <tr>
      <th>Nro Cheque actual: </th>
      <td>${value.nrocheque_actual}</td>
      </tr>

      <tr>
      <th>Saldo actual LC: </th>
      <td>${value.saldo_actual_lc}</td>
      </tr>
      
      <tr>
      <th>Saldo contable cta cte: </th>
      <td>${value.saldo_contable_cte}</td>
      </tr>

      </table>`;
  }


  return tabledata;
}

//Evento para boton de detalle
$('.tablecuentas').on('click', '.dt-control', async function () {
  var table = $('#cuentas_corrientes').DataTable();
  var tr = $(this).closest('tr');
  var row = table.row(tr);

  if (row.child.isShown()) {
    // This row is already open - close it
    tr.find('div.d-flex button i').removeClass("far fa-eye-slash");
    tr.find('div.d-flex button i').addClass("fa fa-eye");
    row.child.hide();
    tr.removeClass('shown');
  }
  else {
    // Open this row
    tr.find('div.d-flex button i').removeClass("fa fa-eye");
    tr.find('div.d-flex button i').addClass("far fa-eye-slash");
    let val = await tableDetalle(row.data());
    row.child(val).show();
    tr.addClass('shown');
  }
});

setTableCuentas();


function setCuenta() {
  let idbanco = document.getElementById("id_banco").value;
  let ctacontable = document.getElementById("cta_contable").value;
  let nrocuenta = document.getElementById("cta_corriente").value;

  let saldocontable = document.getElementById("saldo_contable").value;
  let saldoiniciallc = document.getElementById("saldo_inicial_lc").value;
  let nrochequeinicial = document.getElementById("nro_cheque_inicial").value;


  if (idbanco && ctacontable) {
    $.ajax({
      url: "/4DACTION/_light_setCuentaCorriente",
      type: "POST",
      dataType: "json",
      data: {
        id_banco: idbanco,
        cta_contable: ctacontable,
        nro_cuenta: nrocuenta,
        saldo_contable: saldocontable,
        saldo_inicial_lc: saldoiniciallc,
        nrocheque_inicial: nrochequeinicial
      },
      success: function (data) {
        setTableCuentas();
        document.getElementById("cta_corriente").value = "";
        document.getElementById("saldo_contable").value = "";
        document.getElementById("saldo_inicial_lc").value = "";
        document.getElementById("nro_cheque_inicial").value = "";
        generarAvisoExitoso("Cuenta asignada exitosamente!");
      },
      error: function (xhr, text, error) {
        generarAvisoError("Hubo un error al crear sobrecargo");
        // toastr.error(NOTIFY.get("ERROR_INTERNAL"));
      },
    });
  } else {
    generarAvisoError("Debe seleccionar un banco y una cuenta contable");
  }

}

$(".tablecuentas").on("click", ".delete_sb", function () {
  /*
  let row = $(this).closest("tr").index();

  var terf = document.getElementById("cuentas_corrientes");
  var firstChilds = terf.querySelectorAll("td:first-child");*/

  var currentRow = $(this).closest("tr");

  var data = $('#cuentas_corrientes').DataTable().row(currentRow).data();

  id_ctacorriente = data['id'];


});

function delCuentaCte() {
  $.ajax({
    url: "/4DACTION/_light_delCuentaCte",
    type: "POST",
    dataType: "json",
    data: {
      id_cuentacte: id_ctacorriente,
    },
    success: function (data) {
      if (data.success) {
        $("#ModalConfirm").modal("hide"); //se esconde modal de confirmacion
        setTableCuentas();
        generarAvisoExitoso("Cuenta eliminada correctamente!");
      }
    },
    error: function (xhr, text, error) {
      generarAvisoError("Hubo un error al eliminar la cuenta");
    },
  });
}

$(".tablecuentas").on('change', '.update_contable', function (event) {
  let sel_cuentas = $('option:selected', this).val();
  var currentRow = $(this).closest("tr");
  var data = $('#cuentas_corrientes').DataTable().row(currentRow).data();
  let id_imp = data['id'];

  $.ajax({
    url: "/4DACTION/_light_setCuentaCorriente",
    type: "POST",
    dataType: "json",
    data: {
      'id_cuenta_corriente': id_imp,
      'cta_contable': sel_cuentas
    },
    success: function (data) {
      setTableCuentas();
      generarAvisoExitoso("Cuenta actualizada correctamente");
    },
    error: function (xhr, text, error) {
      generarAvisoError("Error al actualizar cuenta contable");
    }
  });

  event.stopImmediatePropagation();
});