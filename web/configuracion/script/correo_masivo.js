let id_sobrecargo;


document.addEventListener("DOMContentLoaded", () => {

  loadingLoad("loading-modal", true, "Cargando...");
  $(".tableuser").dataTable({
    buttons: [
      {
        extend: "colvis",
        text: '<i class="fas fa-eye"></i>',
        className: "btn btn-outline-info btn-lg",
        titleAttr: "Visualizar columnas",
        collectionLayout: "fixed three-column",
        postfixButtons: ["colvisRestore"],
        columns: 'th:nth-child(n+2)'

      },
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
    bPaginate: false,
    language: {
      url: "/configuracion/script/spanish.json",
    },
    "ajax": {
      "url": window.location.origin + "/4DACTION/_V3_getUsuario2?page=1&results=500&q=&q2=&estado_activo=true",
      "type": "GET",
      "datatype": "json",
      "dataSrc": function (data) {
        return data.rows;
      }
    },
    columns: [
      {
        data: "nombres",
      },
      {
        data: "nombres",
      },
      {
        data: "cargo",
      },
      {
        data: "telefono",
      },
      {
        data: "email",
      },
      {
        data: "tipo_ultima_conex",
      },
    ],
  });
  loadingLoad('loading-modal', false);

  $('.tableuser tbody').on('click', 'tr', function () {
    $(this).toggleClass('selected');
  });

  let razon = localStorage.getItem("razon");

  document.getElementById("asunto").placeholder = "UNABASE / " + String(razon).replaceAll(".", "") + ": ";

});


function selectAll() {
  if($('.tableuser> tbody > tr').attr('class') === "odd selected"){
    $('.tableuser> tbody > tr').removeClass('selected');
  }else{
    $('.tableuser> tbody > tr').addClass('selected');
  }

}



function enviarCorreo() {
  var table = $('.tableuser').DataTable();

  var selectedEmails = [];

  table.rows('.selected').every(function () {
    selectedEmails.push(this.data().email);
  });

  let sid = localStorage.getItem("sid");
  let nodeUrl = localStorage.getItem("node_url");
  let razon = localStorage.getItem("razon");
  let subject = "UNABASE / " +  String(razon).replaceAll(".", "") + ": " + document.getElementById('asunto').value;
  let mensaje = document.getElementById("compose-textarea").value;

  let from = 'UnaBase: TEST UNABASE'

  var attachments = [
    {
      cid: "empresa.jpg",
      url:
        window.location.origin +
        "/4DACTION/logo_empresa_web"
    },
  ];
  

  console.log("EMAIL SEL: ", selectedEmails)

  if (selectedEmails.length > 0) {

    selectedEmails.forEach(email => {
      let config = {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'post',
        url: nodeUrl + "/generic-email?hostname=" + window.location.origin,
        data: {
          sid,
          to: email,
          subject,
          msg: mensaje,
          attachments: JSON.stringify(attachments),
          username: from,
          hostname: window.location.origin,
          template: "correo_masivo"
        },

      };

      axios(config)
        .then(function (response) {

          console.log("EMAIL ENVIADOOO")
          console.log(response)

        })
        .catch(function (error) {

          console.log(error);
        });

    });
    generarAvisoExitoso("Email enviado correctamente!")
  } else {
    generarAvisoError("No se ha seleccionado ningun email");
  }




}




