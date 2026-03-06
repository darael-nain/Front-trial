export const email = {

  data: () => {
    return JSON.parse(localStorage.getItem("emailData"));
  },
  getData: () => {

    axios(`/4DACTION/_V3_settingsSMTP`).then(res => {
      let data = res.data.SMTP[0];
      localStorage.setItem('emailData', JSON.stringify(data));
    }).catch(err => {
      console.warn(err);
    });
  }
}



export const notify = function (
  to, //1
  template, //2
  document, //3
  index, //4
  title, //5
  extra, //6
  detail_uri,  //7
  id_item,  //8
  attach, //9
  userValidator, //10
  nameValidator, //11
  emailValidator,  //12
  print_negocio, //13
  msgBody, //14
  isEjecutivoResponsable, //15
  moduleName, //16
  id_usuario_notificacion //17
) {
  // verificacion para enviar adjunto el pdf del negocio, en el caso que este activado el parametro
  let isValidationRequest = false;
  if (template == "validation_request" && print_negocio) {
    isValidationRequest = true;
  }

  if (typeof attach == "undefined") attach = false;

  var sid = "";
  $.each($.cookie(), function (clave, valor) {
    if (clave == hash && valor.match(/UNABASE/g)) sid = valor;
  });

  if (typeof userValidator == "undefined" || isValidationRequest) {
    if ($("html > body.home > aside > div > div > h1").length == 0) {
      var from = typeof v3_data_username !='undefined' ? v3_data_username : ""
    } else {
      var from = $("body > aside > div > div > h1").data("username");
    }

    if ($("html > body.home > aside > div > div > h1").length == 0) {
      var from_name = typeof v3_data_username !='undefined' ? v3_data_username : ""
    } else {
      var from_name = $("html > body.home > aside > div > div > h1")
        .text()
        .capitalizeAllWords();
    }
    if ($("html > body.home > aside > div > div > h1").length == 0) {
      var from_email = typeof v3_data_username !='undefined' ? v3_data_username : ""
    } else {
      var from_email = $("html > body.menu.home > aside > div > div > h1").data("email");
    }
  } else {
    var from = userValidator;
    var from_name = nameValidator;
    var from_email = emailValidator;
  }

  var to_name;
  var to_email;
  var subject;
  var allow_email;

  $.ajax({
    url: "/4DACTION/_V3_getUsuario",
    data: {
      id: to
    },
    dataType: "json",
    async: false,
    success: function (data) {
      var current = data.rows[0];
      to_name = (
        current.nombres.trim() +
        " " +
        current.ap_pat.trim()
      ).trim();
      //to_name = to_name.capitalizeAllWords();
      to_email = current.email;
      allow_email = current.allow_email;
    }
  });

  var sendMsg = function (
    to_name,
    document,
    index,
    title,
    from_name,
    extra,
    detail_uri,
    id_item,
    print_negocio,
    msgBody,
    isEjecutivoResponsable,
    moduleName
  ) {
    
    var retval;
    $.ajax({
      url: "/v3/views/email/" + template + ".shtml",
      dataType: "html",
      async: false,
      success: function (data) {
        retval = $("<div>").html(data);
      }
    });
    retval.find("[data-to-name]").html(to_name);
    retval.find("[data-document]").html(document);
    if (typeof msgBody !== "undefined") {
      retval.find("[data-content]").html(msgBody(index));
    }

    retval.find("[data-index]").html(index);
    retval.find("[data-title]").html(title);
    retval.find("[data-from-name]").html(from_name);
    retval.find("[data-extra]").html(extra);

    retval
      .find("[data-recipient]")
      .html(
        isEjecutivoResponsable ? "eres responsable" : "has sido copiado"
      );

    if (id_usuario_notificacion) {
      retval
        .find("[data-unsubscribe]")
        .attr(
          "href",
          window.location.origin +
          "/4DACTION/_V3_disableNotify?id=" +
          id_usuario_notificacion
        );
    } else {
      retval
        .find("[data-unsubscribe]")
        .closest("span")
        .remove();
    }

    // --ini-- agregado 18-11-16 / gin (seccion observacicones en fxr cuando el usuario solicitante tiene fxr pendientes)
    if (document == "Rendición de fondos") {
      $.ajax({
        url: "/4DACTION/_V3_getInfoFxrValidacion",
        data: {
          id: id_item
        },
        dataType: "json",
        async: false,
        success: function (dato) {
          if (dato.cantidad == 0) {
            var obs =
              '<span style="margin:5px!important;padding:2px;display:inline-block;font-weight:bold;">Ninguna.</span>';
            retval.find(".observacionval").html(obs);
          } else {
            if (dato.cantidad == 1) {
              var obs =
                '<span style="margin:5px!important;background-color:orange!important;padding:2px;display:inline-block;font-weight:bold;">El solicitante (' +
                dato.solicitante +
                ") cuenta con (1) Rendición pendiente.</span>";
              retval.find(".observacionval").html(obs);
            } else {
              var obs =
                '<span style="margin:5px!important;background-color:orange!important;padding:2px;display:inline-block;font-weight:bold;">El solicitante (' +
                dato.solicitante +
                ") cuenta con (" +
                dato.cantidad +
                ") Rendiciones pendientes.";
              retval.find(".observacionval").html(obs);
            }
            if (dato.cantidad < 6) {
              $.each(dato.rows, function (key, item) {
                var uri =
                  window.location.origin +
                  "/4DACTION/wbienvenidos#" +
                  detail_uri +
                  "?id=" +
                  item.id;
                retval
                  .find(".rendiciones ul")
                  .append(
                    "<li>Fxr Nro. " +
                    item.folio +
                    ", para revisar <a href=" +
                    uri +
                    ">haz clic aquí.</a></li>"
                  );
              });
            } else {
              var uri =
                window.location.origin +
                "/4DACTION/wbienvenidos#compras/list_rendiciones.shtml";
              retval
                .find(".rendiciones ul")
                .append(
                  "<li>Para revisar la lista de pendientes, <a href=" +
                  uri +
                  ">ingresar aquí.</a></li>"
                );
            }
          }
        }
      });
    } else {
      retval.find(".fxr").hide();
    }
    // --fin-- agregado 18-11-16 / gin (seccion observacicones en fxr cuando el usuario solicitante tiene fxr pendientes)

    retval
      .find("[data-href]")
      .prop(
        "href",
        window.location.origin +
        "/4DACTION/wbienvenidos#" +
        detail_uri +
        "?id=" +
        id_item
      );
    subject = retval.find("[data-subject]").text();
    var now = new Date();
    retval
      .find("[data-date]")
      .html(
        now.getDate() + "-" + (now.getMonth() + 1) + "-" + now.getFullYear()
      );
    retval
      .find("[data-time]")
      .html(
        ("0" + now.getHours()).slice(-2) +
        ":" +
        ("0" + now.getMinutes()).slice(-2) +
        ":" +
        ("0" + now.getSeconds()).slice(-2)
      );
    if (id_item === null) {
      retval.find("#contentLink").remove();
    }
    return retval.html();
  };

  
  if (allow_email) {
    var msg = sendMsg(
      to_name,
      document,
      index,
      title,
      from_name,
      extra,
      detail_uri,
      id_item,
      print_negocio,
      msgBody,
      isEjecutivoResponsable,
      moduleName
    );

    var nameFile = "";
    var from_module_name = "";
    if (moduleName == "compras") {
      if (document == "Orden de Compra") {
        from_module_name = "OC_";
      } else {
        from_module_name = "FXR_";
      }
    }
    if (moduleName == "rendiciones") {
      from_module_name = "FXR_";
    }
    if (moduleName == "cotizaciones" || moduleName == "negocios") {
      from_module_name = "COT_";
    }
    var nameFile2 =
      $("section.sheet").length > 0
        ? $("section.sheet").data("record-name") + "_"
        : from_module_name;

    // pdf notificación conversión negocio a cotización
    if (nameFile2 == "undefined_") {
      nameFile2 = "COT_";
    }

    var id_neg_gasto = 0;
    var folio_neg_gasto = "";
    var mostrar_pdf_negocio_en_email_gasto = false;

    if (
      typeof compras != "undefined" &&
      ($('html > body.menu.home > aside > div > div > ul > li[data-name="gastos"].active')
        .length > 0 ||
        $(
          'html > body.menu.home > aside > div > div > ul > li[data-name="rendiciones"].active'
        ).length > 0)
    ) {
      nameFile = compras.tipoGasto;
      if (compras.tipoGasto == "FXR") {
        // nameFile2 = "Rendicion_de_fondos_";
        nameFile2 = file_name_oficial_fxr;
      } else {
        // nameFile2 = "Orden_de_compra_";
        nameFile2 = file_name_oficial_oc;
      }

      id_neg_gasto = compras.id_nv_negocio;
      folio_neg_gasto = compras.folio_negocio;
      mostrar_pdf_negocio_en_email_gasto = compras.mostrar_pdf_negocio;
    }

    //if ($('#main-container').length > 0 || $('section.sheet').length > 0) {
    let previewState = template === 'validation_request' ? 'true' : 'false'

    if ($("html > body.home > aside > div > div > h1").length > 0) {
      var moduleName = $("section.sheet").data("module")
        ? $("section.sheet").data("module")
        : "cotizaciones";
      var url_print_normal =
        nodeUrl +
        "/download/?download=true&entity=" +
        moduleName +
        "&entitytwo=" +
        nameFile +
        "&id=" +
        id_item +
        "&folio=" +
        (typeof index != "undefined" ? index : "S/N") +
        "&sid=" +
        encodeURIComponent(sid) +
        "&hostname=" + window.location.origin +
        "&preview=" + previewState + "&nullified=false&port=" +
        window.location.port;
    } else {
      // error en entity
      var url_print_normal =
        nodeUrl +
        "/download/?download=true&entity=" +
        moduleName +
        "&entitytwo=" +
        moduleName +
        "&id=" +
        id_item +
        "&folio=" +
        (typeof index != "undefined" ? index : "S/N") +
        "&sid=" +
        encodeURIComponent(sid) +
        "&hostname=" + window.location.origin +
        "&preview=" + previewState + "&nullified=false&port=" +
        window.location.port;
    }

    var url_print_extendida =
      nodeUrl +
      "/print/?entity=negocios&id=" +
      $("#main-container").data("id") +
      "&folio=" +
      (typeof $("#main-container").data("index") != "undefined"
        ? $("#main-container").data("index")
        : "S/N") +
      "&sid=" +
      encodeURIComponent(sid) +
      "&nullified=" +
      $("#main-container").data("readonly") +
      "&horizontal=true&port=" +
      window.location.port +
      "&hostname=" +
      window.location.origin;

    if (!attach) {
      if (typeof msgBody !== "undefined") {
        var attachments = [
          {
            cid: "empresa.jpg",
            url:
              window.location.origin +
              "/4DACTION/logo_empresa_web"
          }
        ];
      } else {
        var attachments = [
          {
            cid: "logo.png",
            url:
              window.location.origin +
              "/v3/design/html/body.menu/nav/h1.png"
          },
          {
            cid: "empresa.jpg",
            url:
              window.location.origin +
              "/4DACTION/logo_empresa_web"
          }
        ];
      }
    } else {
      if (typeof msgBody !== "undefined") {
        var attachments = [
          {
            cid: "empresa.jpg",
            url:
              window.location.origin +
              "/4DACTION/logo_empresa_web"
          },
          {
            // cid: ((typeof print_negocio == 'undefined')? nameFile2 : 'cotizacion_interna_') + ((typeof index != 'undefined')? index : 'S_N') + '.pdf',
            cid:
              (typeof print_negocio == "undefined"
                ? nameFile2
                : file_name_internal_cot) +
              (typeof index != "undefined" ? index : "S_N") +
              ".pdf",
            url:
              typeof print_negocio == "undefined"
                ? url_print_normal
                : url_print_extendida
          }
        ];
        $.extend(attachments, attachments, attach);
      } else {
        // pdf del negocio asociado a al gasto
        var url_negocio_gasto = "";
        let url_cotizacion_validar = "";
        if (id_neg_gasto > 0 && isValidationRequest) {
          url_negocio_gasto =
            nodeUrl +
            "/print/?entity=negocios&id=" +
            id_neg_gasto +
            "&folio=" +
            folio_neg_gasto +
            "&sid=" +
            encodeURIComponent(sid) +
            "&nullified=" +
            $("#main-container").data("readonly") +
            "&horizontal=true&hostname=" +
            window.location.origin;


        }

        if (mostrar_pdf_negocio_en_email_gasto && url_negocio_gasto != "") {
          var attachments = [
            {
              cid: "logo.png",
              url:
                window.location.origin +
                "/v3/design/html/body.menu/nav/h1.png"
            },
            {
              cid: "empresa.jpg",
              url:
                window.location.origin +
                "/4DACTION/logo_empresa_web"
            },
            {
              cid:
                (typeof print_negocio == "undefined"
                  ? nameFile2
                  : file_name_internal_cot) +
                (typeof index != "undefined" ? index : "S_N") +
                ".pdf",
              url:
                typeof print_negocio == "undefined"
                  ? url_print_normal
                  : url_print_extendida
            },
            {
              cid: "Negocio_nro_" + folio_neg_gasto + ".pdf",
              url: url_negocio_gasto
            }
          ];
        } else {
          var attachments = [
            {
              cid: "logo.png",
              url:
                window.location.origin +
                "/v3/design/html/body.menu/nav/h1.png"
            },
            {
              cid: "empresa.jpg",
              url:
                window.location.origin +
                "/4DACTION/logo_empresa_web"
            },

            {
              cid:
                (typeof print_negocio == "undefined"
                  ? nameFile2
                  : file_name_internal_cot) +
                (typeof index != "undefined" ? index : "S_N") +
                "ext.pdf",
              url: url_print_normal
            }
          ];
          if (isValidationRequest) {
            attachments.push({
              cid:
                (typeof print_negocio == "undefined"
                  ? nameFile2
                  : file_name_internal_cot) +
                (typeof index != "undefined" ? index : "S_N") +
                ".pdf",
              url: url_print_extendida
              // url:
              //   typeof print_negocio == "undefined"
              //     ? url_print_normal
              //     : url_print_extendida
            })
          }

        }

        if (typeof attachments != "undefined") {
          //$.extend(attachments, attachments, attach);
          for (var i = 0; i < attach.length; i++) {
            attachments.push(attach[i]);
          }
        } else {
          var attachments = [
            {
              cid: "logo.png",
              url:
                window.location.origin +
                "/v3/design/html/body.menu/nav/h1.png"
            },
            {
              cid: "empresa.jpg",
              url:
                window.location.origin +
                "/4DACTION/logo_empresa_web"
            }
          ];
          $.extend(attachments, attachments, attach);
        }
      }
    }

    /*console.log('');
    console.log($('section.sheet').data('module'));*/


    // fetch(nodeUrl +"/generic-email?hostname=" + window.location.origin+"&sid="+sid, {
    //   method: 'get',
    //   headers: {
    //     "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
    //   },
    //   body: {
    //     // sid: sid,
    //     to: to_email
    //     // subject: subject,
    //     // msg: msg,
    //     // attachments: JSON.stringify(attachments),
    //     // from: from_email,
    //     // username: from,
    //     // port: window.location.port
    //   },
    // })
    // .then(resp => resp.json())
    // .then(function (data) {
    //   console.log('Request succeeded with JSON response', data);
    // })
    // .catch(function (error) {
    //   console.log('Request failed', error);
    // });
    let params = {
      sid: sid,
      hostname: window.location.origin,
      to: to_email,
      subject: subject,
      msg: msg,
      attachments: JSON.stringify(attachments),
      from: from_email,
      username: from,
      port: window.location.port
    }
    // axios.post(nodeUrl +"/generic-email?hostname=" + window.location.origin+"&sid="+sid, params).then(resp => {
    //       console.log(resp);
    //     }).catch(err => {
    //       console.log(err);
    //     });

    // axios.post(nodeUrl +"/generic-email?hostname=" + window.location.origin+"&sid="+sid, {
    //     sid: sid,
    //     to: to_email,
    //     subject: subject,
    //     msg: msg,
    //     attachments: JSON.stringify(attachments),
    //     from: from_email,
    //     username: from,
    //     port: window.location.port
    //   }).then(resp => {
    //     console.log(resp);
    //   }).catch(err => {
    //     console.log(err);
    //   });

    if (false) {
      axios.post(nodeUrl + "/generic-email?hostname=" + window.location.origin + "&sid=" + sid,
        // {headers: {
        //                 'Access-Control-Allow-Origin': '*',
        //                 'Content-Type': 'application/json',
        //               }},
        params).then(resp => {
          console.log(resp);
        }).catch(err => {
          console.log(err);
        });

    } else {
      let config = {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'post',
        url: nodeUrl + "/generic-email?hostname=" + window.location.origin,
        data: {
          sid,
          to: to_email,
          subject,
          //msg: msg,
          attachments: JSON.stringify(attachments),
          from: from_email,
          username: from,
          to_name,
          document,
          index,
          title,
          from_name,
          detail_uri,
          id_item,
          print_negocio,
          msgBody,
          isEjecutivoResponsable,
          obs: extra,
          moduleName,
          template,
          hostname: window.location.origin
        },

      };

      
      axios(config)
        .then(function (response) {
          console.log("EMAIL NOTIFICACION ENVIADOOO")
        })
        .catch(function (error) {
          console.log(error);
        });
    }

  }
}

export const notifyRequestValidationOC = function (data) {


  let sid = unaBase.sid.encoded();
  let from = data.userValidator || currentUser.username;
  let from_name = data.nameValidator || currentUser.name;
  let from_email = data.emailValidator || currentUser.email;


  var to_name;
  var to_email;
  var subject;
  var allow_email;


  
  var sendMsg = function (
    to_name,
    document,
    index,
    title,
    from_name,
    extra,
    motivo,
    detail_uri,
    id_item,
    print_negocio,
    msgBody,
    isEjecutivoResponsable,
    moduleName
  ) {
    
    var retval;
    $.ajax({
      url: "/v3/views/email/" + data.template + ".shtml",
      dataType: "html",
      async: false,
      success: function (subdata) {
        retval = $("<div>").html(subdata);
      }
    });
    retval.find("[data-to-name]").html(to_name);
    retval.find("[data-document]").html(document);
    if (typeof msgBody !== "undefined") {
      retval.find("[data-content]").html(msgBody(index));
    }

    retval.find("[data-index]").html(index);
    retval.find("[data-title]").html(title);
    retval.find("[data-from-name]").html(from_name);
    retval.find("[data-extra]").html(extra);
    retval.find("[data-motivo]").html(motivo);
    retval
      .find("[data-recipient]")
      .html(
        isEjecutivoResponsable ? "eres responsable" : "has sido copiado"
      );

    if (data.id_usuario_notificacion) {
      retval
        .find("[data-unsubscribe]")
        .attr(
          "href",
          window.location.origin +
          "/4DACTION/_V3_disableNotify?id=" +
          data.id_usuario_notificacion
        );
    } else {
      retval
        .find("[data-unsubscribe]")
        .closest("span")
        .remove();
    }

    // --ini-- agregado 18-11-16 / gin (seccion observacicones en fxr cuando el usuario solicitante tiene fxr pendientes)
    if (document == "Rendición de fondos") {
      $.ajax({
        url: "/4DACTION/_V3_getInfoFxrValidacion",
        data: {
          id: id_item
        },
        dataType: "json",
        async: false,
        success: function (dato) {
          if (dato.cantidad == 0) {
            var obs =
              '<span style="margin:5px!important;padding:2px;display:inline-block;font-weight:bold;">Ninguna.</span>';
            retval.find(".observacionval").html(obs);
          } else {
            if (dato.cantidad == 1) {
              var obs =
                '<span style="margin:5px!important;background-color:orange!important;padding:2px;display:inline-block;font-weight:bold;">El solicitante (' +
                dato.solicitante +
                ") cuenta con (1) Rendición pendiente.</span>";
              retval.find(".observacionval").html(obs);
            } else {
              var obs =
                '<span style="margin:5px!important;background-color:orange!important;padding:2px;display:inline-block;font-weight:bold;">El solicitante (' +
                dato.solicitante +
                ") cuenta con (" +
                dato.cantidad +
                ") Rendiciones pendientes.";
              retval.find(".observacionval").html(obs);
            }
            if (dato.cantidad < 6) {
              $.each(dato.rows, function (key, item) {
                var uri =
                  window.location.origin +
                  "/4DACTION/wbienvenidos#" +
                  detail_uri +
                  "?id=" +
                  item.id;
                retval
                  .find(".rendiciones ul")
                  .append(
                    "<li>Fxr Nro. " +
                    item.folio +
                    ", para revisar <a href=" +
                    uri +
                    ">haz clic aquí.</a></li>"
                  );
              });
            } else {
              var uri =
                window.location.origin +
                "/4DACTION/wbienvenidos#compras/list_rendiciones.shtml";
              retval
                .find(".rendiciones ul")
                .append(
                  "<li>Para revisar la lista de pendientes, <a href=" +
                  uri +
                  ">ingresar aquí.</a></li>"
                );
            }
          }
        }
      });
    } else {
      retval.find(".fxr").hide();
    }
    // --fin-- agregado 18-11-16 / gin (seccion observacicones en fxr cuando el usuario solicitante tiene fxr pendientes)

    retval
      .find("[data-href]")
      .prop(
        "href",
        window.location.origin +
        "/4DACTION/wbienvenidos#" +
        detail_uri +
        "?id=" +
        id_item
      );
    subject = retval.find("[data-subject]").text();
    var now = new Date();
    retval
      .find("[data-date]")
      .html(
        now.getDate() + "-" + (now.getMonth() + 1) + "-" + now.getFullYear()
      );
    retval
      .find("[data-time]")
      .html(
        ("0" + now.getHours()).slice(-2) +
        ":" +
        ("0" + now.getMinutes()).slice(-2) +
        ":" +
        ("0" + now.getSeconds()).slice(-2)
      );
    if (id_item === null) {
      retval.find("#contentLink").remove();
    }
    return retval.html();
  };


  var msg = sendMsg(
    data.toName,
    data.document,
    data.index,
    data.title,
    from_name,
    data.extra,
    data.motivo,
    data.detail_uri,
    data.id_item,
    data.print_negocio,
    data.msgBody,
    data.isEjecutivoResponsable,
    data.moduleName
  );
  
  var nameFile = "";
  var from_module_name = "";
  var nameFile2 = ''
  let moduleName = "";
  if(data.moduleName == "cotizaciones") {
    from_module_name = "COT_";
    nameFile2 = "COT_";
    moduleName = "cotizaciones";
  }else{
    from_module_name = "OC_";
    nameFile2 = "OC_";
    moduleName = "compras";
  }

  var id_neg_gasto = 0;
  var folio_neg_gasto = "";
  var mostrar_pdf_negocio_en_email_gasto = false;
  
  if (typeof compras == 'object') {
    from_module_name = "OC_";
    nameFile2 = "OC_";
    nameFile = compras.tipoGasto;
    if (compras.tipoGasto == "FXR") {
      // nameFile2 = "Rendicion_de_fondos_";
      nameFile2 = file_name_oficial_fxr;
    } else {
      // nameFile2 = "Orden_de_compra_";
      nameFile2 = file_name_oficial_oc;
    }

    id_neg_gasto = compras.id_nv_negocio;
    folio_neg_gasto = compras.folio_negocio;
    mostrar_pdf_negocio_en_email_gasto = compras.mostrar_pdf_negocio;

  }

  let previewState = data.template === 'validation_request' ? 'true' : 'false'
  if (data.template === 'validation_rejected' ? 'true' : 'false') {
    previewState = true;
  }
  
  //let moduleName = "compras";
  var url_print_normal =
    nodeUrl +
    "/download/?download=true&entity=" +
    moduleName +
    "&entitytwo=" +
    nameFile +
    "&id=" +
    data.id_item +
    "&folio=" +
    (typeof data.index != "undefined" ? data.index : "S/N") +
    "&sid=" +
    sid +
    "&hostname=" + window.location.origin +
    "&preview=" + previewState + "&nullified=false&port=" +
    window.location.port;

  var attachments = [
    {
      cid: "logo.png",
      url:
        window.location.origin +
        "/v3/design/html/body.menu/nav/h1.png"
    },
    {
      cid: "empresa.jpg",
      url:
        window.location.origin +
        "/4DACTION/logo_empresa_web"
    },

    {
      cid: nameFile2 +
        (typeof data.index != "undefined" ? data.index : "S_N") + ".pdf",
      url: url_print_normal
    }
  ];


  let params = {
    sid: sid,
    hostname: window.location.origin,
    to: data.toEmail,
    subject: subject,
    msg: msg,
    attachments: JSON.stringify(attachments),
    from: from_email,
    username: from,
    port: window.location.port
  }

  //if(uVar.serviceNode){
  if (false) {
    axios.post(nodeUrl + "/generic-email?hostname=" + window.location.origin + "&sid=" + sid, params).then(resp => {
      console.log(resp);
    }).catch(err => {
      console.log(err);
    });

  } else {
    if(typeof template == undefined)
    template="print"


    let toName = data.toName;
    let document = data.document;
    let index = data.index;
    let title = data.title;
    let extra = data.extra;
    let motivo = data.motivo;
    let detail_uri = data.detail_uri;
    let id_item = data.id_item;
    let print_negocio = data.print_negocio;
    let msgBody = data.msgBody;
    let isEjecutivoResponsable = data.isEjecutivoResponsable;
    let moduleName = data.moduleName;
    let toEmail = data.toEmail

    let config = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'post',
      url: nodeUrl + "/generic-email?hostname=" + window.location.origin,
      data: {
        sid,
        to: toEmail,
        subject,
        attachments: JSON.stringify(attachments),
        from: from_email,
        username: from,
        toName,
        document,
        index,
        title,
        from_name,
        extra,
        motivo,
        detail_uri,
        id_item,
        print_negocio,
        msgBody,
        isEjecutivoResponsable,
        moduleName,
        template,
        hostname: window.location.origin
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


  }



}