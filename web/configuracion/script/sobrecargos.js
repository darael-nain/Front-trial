let id_sobrecargo;

document.addEventListener("DOMContentLoaded", () => {
  loadingLoad("loading-modal", true, "Cargando...");
  $(".tablesobrecargos").dataTable({
    buttons: [
      {
        extend: "colvis",
        text: '<i class="fas fa-eye"></i>',
        className: "btn btn-outline-info btn-lg",
        titleAttr: "Visualizar columnas",
        collectionLayout: "fixed three-column",
        postfixButtons: ["colvisRestore"],
        columns: 'th:nth-child(n+2)'
      }
    ],
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

    processing: true,
    language: {
      url: "/configuracion/script/spanish.json",
    },
    "ajax": {
      "url": window.location.origin + "/4DACTION/_light_getSobrecargos?id=0",
      "type": "GET",
      "datatype": "json",
      "dataSrc": function (data) {
        return data.rows;
      }
    },
    columns: [
      {
        data: "id",
        visible: false,
        render: function (data, type, row) {
          return row.id;
        },

      },
      {
        data: "name",
      },
      {
        data: "tipo",
      },
      {
        data: "porcentaje",
      },

      {
        data: "is_info",
        render: function (data, type, row) {
          return row.is_info
            ? "<div class='form-check d-flex justify-content-center'><input class='form-check-input update_sb is_info' type='checkbox' checked></div></td>"
            : "<div class='form-check d-flex justify-content-center'><input class='form-check-input update_sb is_info' type='checkbox'></div>";
        },
      },

      {
        data: "is_real",
        render: function (data, type, row) {
          return row.is_real
            ? "<div class='form-check d-flex justify-content-center'><input class='form-check-input update_sb is_real' type='checkbox' checked></div>"
            : "<div class='form-check d-flex justify-content-center'><input class='form-check-input update_sb is_real' type='checkbox'></div>";
        },
      },

      {
        data: "is_close",
        render: function (data, type, row) {
          return row.is_close
            ? "<div class='form-check d-flex justify-content-center'><input class='form-check-input update_sb is_close' type='checkbox' checked></div>"
            : "<div class='form-check d-flex justify-content-center'><input class='form-check-input update_sb is_close' type='checkbox'></div>";
        },
      },

      {
        data: "is_writable",
        render: function (data, type, row) {
          return row.is_writable
            ? "<div class='form-check d-flex justify-content-center'><input class='form-check-input update_sb is_writable' type='checkbox' checked></div>"
            : "<div class='form-check d-flex justify-content-center'><input class='form-check-input update_sb is_writable' type='checkbox'></div>";
        },
      },

      {
        data: "ajuste",
        render: function (data, type, row) {
          return row.ajuste
            ? "<div class='form-check d-flex justify-content-center'><input class='form-check-input update_sb is_ajuste' type='checkbox' checked></div>"
            : "<div class='form-check d-flex justify-content-center'><input class='form-check-input update_sb is_ajuste' type='checkbox'></div>";
        },
      },

      {
        data: "formula",
        render: function (data, type, row) {
          return row.formula
            ? "<div class='form-check d-flex justify-content-center'><input class='form-check-input update_sb is_formula' type='checkbox' checked></div>"
            : "<div class='form-check d-flex justify-content-center'><input class='form-check-input update_sb is_formula' type='checkbox'></div>";
        },
      },
      {
        data: "is_total",
        render: function (data, type, row) {
          return row.is_total
            ? "<div class='form-check d-flex justify-content-center'><input class='form-check-input update_sb is_total' type='checkbox' checked></div>"
            : "<div class='form-check d-flex justify-content-center'><input class='form-check-input update_sb is_total' type='checkbox'></div>";
        },
      },

      {
        data: "is_subtotal",
        render: function (data, type, row) {
          return row.is_subtotal
            ? "<div class='form-check d-flex justify-content-center'><input class='form-check-input update_sb is_subtotal' type='checkbox' checked></div>"
            : "<div class='form-check d-flex justify-content-center'><input class='form-check-input update_sb is_subtotal' type='checkbox'></div>";
        },
      },

      {
        data: "is_subtotal_continuo",
        render: function (data, type, row) {
          return row.is_subtotal_continuo
            ? "<div class='form-check d-flex justify-content-center'><input class='form-check-input update_sb is_subtotal_continuo' type='checkbox' checked></div>"
            : "<div class='form-check d-flex justify-content-center'><input class='form-check-input update_sb is_subtotal_continuo' type='checkbox'></div>";
        },
      },

      {
        data: null,
        render: function (data, type, row) {
          return `<div class="d-flex justify-content-center"><button class="btn btn-danger btn-sm delete_sb" data-toggle="modal" data-target="#ModalConfirm" style="background: #FC4903;"><i class="fas fa-trash-alt"></i></button></div>`;
        },
      },
    ],
  });
  loadingLoad('loading-modal', false);

  function setSobrecargo() {
    //ajuste BOOL
    //cerrado BOOL
    //editable BOOL
    //form_percent BOOL
    //info BOOL
    //name
    //percent_value
    //real BOOL
    //subtotal BOOL
    //subtotal_continuo BOOL
    //tipo_gasto BOOL
    let tipo = document.getElementById("sb_tipo").value;
    let name = document.getElementById("sb_name").value;
    //let valor = document.getElementById('sb_valor').value;
    let form_percent = document.getElementById("sb_form_percent").checked;
    let percent = document.getElementById("sb_percent").value;
    let subtotal = document.getElementById("sb_subtotal").checked;
    let total = document.getElementById("sb_total").checked;
    let subtotalcontinuo = document.getElementById("sb_subtotalcontinuo").checked;
    let info = document.getElementById("sb_info").checked;
    let ajuste = document.getElementById("sb_ajuste").checked;
    let cerrado = document.getElementById("sb_cerrado").checked;
    let editable = document.getElementById("sb_editable").checked;
    let real = document.getElementById("sb_real").checked;

    $.ajax({
      url: "/4DACTION/_light_setSobrecargos",
      type: "POST",
      dataType: "json",
      data: {
        sb_subtotal: subtotal,
        sb_total: total,
        sb_subtotalcontinuo: subtotalcontinuo,
        sb_info: info,
        sb_name: name,
        sb_tipo: tipo,
        sb_percent: percent,
        sb_real: real,
        sb_form_percent: form_percent,
        sb_ajuste: ajuste,
        sb_cerrado: cerrado,
        sb_editable: editable,
      },
      success: function (data) {
        $(".tablesobrecargos").DataTable().ajax.reload();
        document.getElementById("sb_name").value = "";
        document.getElementById("sb_percent").value = "";
        generarAvisoExitoso("SobreCargo creado exitosamente!");
      },
      error: function (xhr, text, error) {
        generarAvisoError("Hubo un error al crear sobrecargo");
        // toastr.error(NOTIFY.get("ERROR_INTERNAL"));
      },
    });
  }

  $("#sobrecargos tbody").on("click", ".update_sb", function () {
    let row = $(this).closest("tr").index();

    let id_check = $(this).parent().find("input[type=checkbox]").is(":checked");

    let item_check;
    let item_value;

    if (id_check) {
      item_check = $(this).parent().find("input[type=checkbox]").attr("class").substr(26).replace(/\s/g, "");
      item_value = true;
    } else {
      item_check = $(this).parent().find("input[type=checkbox]").attr("class").substr(26).replace(/\s/g, "");
      item_value = false;
    }

    //Obtener id de registro
    var currentRow = $(this).closest("tr");
    var data = $('#sobrecargos').DataTable().row(currentRow).data();
    let id_sb = data['id'];

    $.ajax({
      url: "/4DACTION/_light_setSobrecargos",
      type: "POST",
      data: {
        id_sobrecargo: id_sb,
        item_check: item_check,
        item_value: item_value,
      },
      success: function (data) {
        $(".tablesobrecargos").DataTable().ajax.reload();
        generarAvisoExitoso("Actualizado correctamente!");
      },
      error: function (xhr, text, error) {
        // toastr.error(NOTIFY.get("ERROR_INTERNAL"));
      },
    });
  });

  $("#sobrecargos").on("click", ".delete_sb", function () {
    //Obtener id de registro
    var currentRow = $(this).closest("tr");
    var data = $('#sobrecargos').DataTable().row(currentRow).data();
    id_sobrecargo = data['id'];
  });
});


function delSobreCargos() {
  $.ajax({
    url: "/4DACTION/_light_delSobreCargos",
    type: "POST",
    dataType: "json",
    data: {
      id_sobrecargo: id_sobrecargo,
    },
    success: function (data) {
      if (data.success) {
        $("#ModalConfirm").modal("hide"); //se esconde modal de confirmacion
        $(".tablesobrecargos").DataTable().ajax.reload();
        generarAvisoExitoso("SobreCargo eliminado correctamente!");
      }
    },
    error: function (xhr, text, error) {
      generarAvisoError("Hubo un error al eliminar sobrecargo");
    },
  });
}

function setSobrecargo() {
  let sb_subtotal = document.getElementById('sb_subtotal').checked;
  let sb_total = document.getElementById('sb_total').checked;
  let sb_subtotalcontinuo = document.getElementById('sb_subtotalcontinuo').checked;
  let sb_info = document.getElementById('sb_info').checked;
  let sb_real = document.getElementById('sb_real').checked;
  let sb_form_percent = document.getElementById('sb_form_percent').checked;
  let sb_ajuste = document.getElementById('sb_ajuste').checked;
  let sb_cerrado = document.getElementById('sb_cerrado').checked;
  let sb_editable = document.getElementById('sb_editable').checked;
  let sb_percent = document.getElementById('sb_percent').value;
  let sb_tipo = document.getElementById('sb_tipo').value;
  let sb_name = document.getElementById('sb_name').value;



  $.ajax({
    url: "/4DACTION/_light_setSobreCargos",
    type: "POST",
    dataType: "json",
    data: {
      sb_subtotal,
      sb_total,
      sb_subtotalcontinuo,
      sb_info,
      sb_real,
      sb_form_percent,
      sb_ajuste,
      sb_cerrado,
      sb_editable,
      sb_percent,
      sb_tipo,
      sb_name
    },
    success: function (data) {
      if (data.success) {
        $("#ModalConfirm").modal("hide"); //se esconde modal de confirmacion
        $(".tablesobrecargos").DataTable().ajax.reload();
        generarAvisoExitoso("Sobrecargo creado exitosamente!");
      }
    },
    error: function (xhr, text, error) {
      generarAvisoError("Hubo un error al crear sobrecargo");
    },
  });

}


