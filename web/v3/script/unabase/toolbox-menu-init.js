
unaBase.toolbox.buttons = (buttonsList, alone = false) => {
  var menu = unaBase.toolbox.dialog ? $("#dialog-menu") : $("#menu");
  let buttons = [];
  if (!alone) {
    menu.find("ul > li").remove();
    menu
      .parentTo("header")
      .find("button")
      .not(":first-of-type")
      .not(".date")
      .not(".search-button")
      .not(".close-button")
      .remove();

  }

  // let genericButtons = [
  //    {
  //       text: "exit",
  //       name: "exit",
  //       icon: "ui-icon-circle-arrow-w",
  //       caption: "Volver",
  //       access: true,
  //        action:  function(event) {

  //        unaBase.history.back();
  //        unaBase.toolbox.menu.checkExit(event)
  //       }
  //    }

  // ]




  for (i in buttonsList) {

    if (buttonsList[i].name != "" && buttonsList[i].caption != "" && (typeof buttonsList[i].access == "undefined" || buttonsList[i].access)) {
      button = $(
        '<li data-name="' + buttonsList[i].name + '"><button>' + buttonsList[i].caption + "</button></li>"
      );
      menu.find("ul").append(button);
      menu
        .find("ul > li:last-of-type > button")
        .button({
          icons:
            typeof buttonsList[i].icon != "undefined"
              ? {
                primary: buttonsList[i].icon
              }
              : buttonsList[i].icons
        })
        .click(buttonsList[i].action);
    }
  }


  var button;
  // TODO: Pasar al CSS el estilo de este botón
  button = $(
    '<button id="dropdown_launcher" class="dropdown-button more" style="display: inline-block; float: right;">Más...</button>'
  );
  button
    .button({
      icons: {
        primary: "ui-icon-gear",
        secondary: "ui-icon-triangle-1-s"
      },
      text: false
    })
    .hide();
  menu.parentTo("header").append(button);

  menu.show();

  $("body").on("click", "*", function (event) {
    if (
      !$(event.target).hasClass("dropdown-button") &&
      !$(event.target)
        .parent()
        .hasClass("dropdown-button")
    )
      $(".dropdown-menu").hide();
  });
}
//unaBase.toolbox.menu.newInit
unaBase.toolbox.menu.newInit = async function (params) {

  if (uVar.experimental) {
    var menu = unaBase.toolbox.dialog ? $("#dialog-menu") : $("#menu");
    let buttons = [];
    menu.find("ul > li").remove();
    menu
      .parentTo("header")
      .find("button")
      .not(":first-of-type")
      .not(".date")
      .not(".search-button")
      .not(".close-button")
      .remove();

    let genericButtons = [
      {
        text: "exit",
        name: "exit",
        icon: "ui-icon-circle-arrow-w",
        caption: "Volver",
        access: true,
        action: function (event) {

          unaBase.history.back();
          unaBase.toolbox.menu.checkExit(event)
        }
      }

    ]
    if (params.searchOff) {
      params.buttonsList.unshift({
        text: "searchOff",
        access: true,
        name: "searchOff",
        icon: "ui-icon-search",
        caption: "Buscar",
        action: function () {
          executeSearch();
        }
      })
    }
    for (i in params.buttonsList) {
      if (params.buttonsList[i].name != "" && params.buttonsList[i].caption != "" && (typeof params.buttonsList[i].access == "undefined" || params.buttonsList[i].access)) {
        button = $(
          '<li data-name="' + params.buttonsList[i].name + '"><button>' + params.buttonsList[i].caption + "</button></li>"
        );
        menu.find("ul").append(button);
        menu
          .find("ul > li:last-of-type > button")
          .button({
            icons:
              typeof params.buttonsList[i].icon != "undefined"
                ? {
                  primary: params.buttonsList[i].icon
                }
                : params.buttonsList[i].icons
          })
          .click(params.buttonsList[i].action);
      }
    }

    var button;
    // TODO: Pasar al CSS el estilo de este botón
    button = $(
      '<button id="dropdown_launcher" class="dropdown-button more" style="display: inline-block; float: right;">Más...</button>'
    );
    button
      .button({
        icons: {
          primary: "ui-icon-gear",
          secondary: "ui-icon-triangle-1-s"
        },
        text: false
      })
      .hide();
    menu.parentTo("header").append(button);

    menu.show();

    $("body").on("click", "*", function (event) {
      if (
        !$(event.target).hasClass("dropdown-button") &&
        !$(event.target)
          .parent()
          .hasClass("dropdown-button")
      )
        $(".dropdown-menu").hide();
    });

  }
}
// unaBase.toolbox.menu.init
unaBase.toolbox.menu.init = function (params) {

  var menu = unaBase.toolbox.dialog ? $("#dialog-menu") : $("#menu");
  if (unaBase.toolbox.dialog)
    menu
      .parentTo(".ui-dialog")
      .find("header")
      .show();

  var buttons = [];

  // El botón Volver va primero que todos
  if ($.inArray("exit", params.buttons) != -1)
    buttons.push({
      name: "exit",
      icon: "ui-icon-circle-arrow-w",
      caption: "Volver",
      action: function (event) {
        var callback = async function (data) {
          if (data) {

            switch (params.entity) {
              case "FactCliReporte":
                unaBase.loadInto.viewport(
                  "/v3/views/reportes/index.shtml",
                  undefined,
                  true,
                  false
                );
                break;

              case "CategoriasReporte":
                unaBase.loadInto.viewport(
                  "/v3/views/reportes/index.shtml",
                  undefined,
                  true,
                  false
                );
                break;

              case "VentasEjecutivoReporte":
                //viewport: async function(href, title, standalone, skip_history) {
                unaBase.loadInto.viewport(
                  "/v3/views/reportes/index.shtml",
                  undefined,
                  true,
                  false
                );
                break;
              case "VentasAreanegReporte":
                unaBase.loadInto.viewport(
                  "/v3/views/reportes/index.shtml",
                  undefined,
                  true,
                  false
                );
                break;
              case "VentasClienteReporte":
                unaBase.loadInto.viewport(
                  "/v3/views/reportes/index.shtml",
                  undefined,
                  true,
                  false
                );
                break;
              case "estado_resultados":
                unaBase.loadInto.viewport(
                  "/v3/views/reportes/index.shtml",
                  undefined,
                  true,
                  false
                );
                break;
              case "CotEjecutivoReporte":
                unaBase.loadInto.viewport(
                  "/v3/views/reportes/index.shtml",
                  undefined,
                  true,
                  false
                );
                break;
              case "CotClienteReporte":
                unaBase.loadInto.viewport(
                  "/v3/views/reportes/index.shtml",
                  undefined,
                  true,
                  false
                );
                break;

              case "Cotizacion":
                if (!$("section.sheet").data("index"))
                  $.ajax({
                    url: "/4DACTION/_V3_removeCotizacion",
                    data: {
                      id: $("section.sheet").data("id")
                    },
                    dataType: "json",
                    success: function (data) {
                      if (typeof event.isTrigger == "undefined")
                        //unaBase.loadInto.viewport('/v3/views/cotizaciones/list.shtml');
                        unaBase.history.back();
                    }
                  });
                else {
                  if (typeof event.isTrigger == "undefined") {
                    //unaBase.loadInto.viewport('/v3/views/cotizaciones/list.shtml');

                    var cotizacionId = $("section.sheet").data("id");
                    // var socketNew = io.connect(nodeUrl);
                    var cotBlock = {
                      id: cotizacionId,
                      folio: $("#main-container .sheet").data("index"),
                      user: $("html > body.menu.home > aside > div > div > h1").data(
                        "username"
                      ),
                      // doc_name: $('.titulofinal').val(),
                      // total: $('span[name="cotizacion[montos][subtotal_neto]"]').text(),
                      block: false,
                      module: "cotizaciones",
                      from: "boton volver---"
                    };

                    // $.ajax({
                    //   url: "/4DACTION/_V3_block_by_use",
                    //   data: {
                    //     id: cotizacionId,
                    //     module: $(".sidebar li.active").data("name"),
                    //     block: false,
                    //     list: false
                    //   },
                    //   dataType: "json",
                    //   async: false,
                    //   success: function (datas) {

                    //     const username = datas.rows[0].userLogin ? datas.rows[0].userLogin : ''
                    //     const id = datas.rows[0].id != undefined ? datas.rows[0].id : ''
                    //     const module = document.querySelector('aside ul li.active a span').textContent
                    //     if (id != '') {
                    //       //socket_ub.emit('stop editing', { sid: unaBase.sid.encoded(), username, hostname: window.origin, id, module });

                    //     }
                    //     // data.rows.push(cotBlock);
                    //     // if(!uVar.unableSocket){
                    //     //  socketNew.emit('sendblock', datas.rows);
                    //     //  socketNew.emit('sendblockAdd', cotBlock);
                    //     // }
                    //   },
                    //   error: function (xhr, text, error) {
                    //     toastr.error(
                    //       NOTIFY.get("ERROR_INTERNAL", "Error")
                    //     );
                    //   }
                    // });

                    window.onbeforeunload = function () {
                      return "¿Está seguro que desea salir?";
                    };
                    unaBase.history.back();
                  }
                }

                break;
              case "Compras":
                var target = $("section.sheet");
                var folio = target.data("index");
                if (folio == "") {
                  $.ajax({
                    url: "/4DACTION/_V3_setCompras",
                    data: {
                      "oc[id]": target.data("id"),
                      "oc[cancelar_creacion]": true
                    },
                    dataType: "json",
                    success: function (data) {
                      if (typeof event.isTrigger == "undefined")
                        //unaBase.loadInto.viewport('/v3/views/compras/list.shtml');
                        unaBase.history.back();
                    },
                    error: function (xhr, text, error) {
                      toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                    }
                  });
                } else {
                  if (typeof event.isTrigger == "undefined")
                    //unaBase.loadInto.viewport('/v3/views/compras/list.shtml');
                    unaBase.history.back();
                }
                break;
              case "Dtc":



                if (dtc.data.estado == "POR EMITIR") {
                  $.ajax({
                    url: "/4DACTION/_V3_setDtc",
                    data: {
                      "dtc[id]": dtc.id,
                      delete: true
                    },
                    dataType: "json",
                    success: function (data) {
                      if (typeof event.isTrigger == "undefined") {
                        unaBase.history.back();
                      }
                    },
                    error: function (xhr, text, error) {
                      toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                    }
                  });
                } else {
                  if (typeof event.isTrigger == "undefined") {
                    unaBase.history.back();
                  }
                }
                break;
              case "email_reportes":
                if (typeof reportes == "undefined") {
                  unaBase.history.back();
                } else {
                  if (!reportes.data) {
                    $.ajax({
                      url: "/4DACTION/_V3_setReportes",
                      data: {
                        id: reportes.id,
                        delete: true
                      },
                      dataType: "json",
                      success: function (data) {
                        if (typeof event.isTrigger == "undefined") {
                          unaBase.history.back();
                        }
                      },
                      error: function (xhr, text, error) {
                        toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                      }
                    });
                  } else {
                    if (typeof event.isTrigger == "undefined") {
                      unaBase.history.back();
                    }
                  }
                }
                break;
              case "tiposcuenta":
                if (typeof cuenta == "undefined") {
                  unaBase.history.back();
                } else {
                  if (!cuenta.data.creado) {
                    $.ajax({
                      url: "/4DACTION/_V3_setTiposcuenta",
                      data: {
                        id: cuenta.id,
                        delete: true
                      },
                      dataType: "json",
                      success: function (data) {
                        if (typeof event.isTrigger == "undefined") {
                          unaBase.history.back();
                        }
                      },
                      error: function (xhr, text, error) {
                        toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                      }
                    });
                  } else {
                    if (typeof event.isTrigger == "undefined") {
                      unaBase.history.back();
                    }
                  }
                }
                break;
              case "formaspago":
                if (typeof formas == "undefined") {
                  unaBase.history.back();
                } else {
                  if (!formas.data.creado) {
                    $.ajax({
                      url: "/4DACTION/_V3_setFormaspago",
                      data: {
                        id: formas.id,
                        delete: true
                      },
                      dataType: "json",
                      success: function (data) {
                        if (typeof event.isTrigger == "undefined") {
                          unaBase.history.back();
                        }
                      },
                      error: function (xhr, text, error) {
                        toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                      }
                    });
                  } else {
                    if (typeof event.isTrigger == "undefined") {
                      unaBase.history.back();
                    }
                  }
                }
                break;
              case "tiposdtc":
                if (typeof dtc == "undefined") {
                  unaBase.history.back();
                } else {
                  if (!dtc.data.creado) {
                    $.ajax({
                      url: "/4DACTION/_V3_setTiposdtc",
                      data: {
                        id: dtc.id,
                        delete: true
                      },
                      dataType: "json",
                      success: function (data) {
                        if (typeof event.isTrigger == "undefined") {
                          unaBase.history.back();
                        }
                      },
                      error: function (xhr, text, error) {
                        toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                      }
                    });
                  } else {
                    if (typeof event.isTrigger == "undefined") {
                      unaBase.history.back();
                    }
                  }
                }
                break;
              case "tipospago":
                if (typeof pago == "undefined") {
                  unaBase.history.back();
                } else {
                  if (!pago.data.creado) {
                    $.ajax({
                      url: "/4DACTION/_V3_setTipospago",
                      data: {
                        id: pago.id,
                        delete: true
                      },
                      dataType: "json",
                      success: function (data) {
                        if (typeof event.isTrigger == "undefined") {
                          unaBase.history.back();
                        }
                      },
                      error: function (xhr, text, error) {
                        toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                      }
                    });
                  } else {
                    if (typeof event.isTrigger == "undefined") {
                      unaBase.history.back();
                    }
                  }
                }
                break;
              case "banco":
                if (typeof banco == "undefined") {
                  unaBase.history.back();
                } else {
                  if (!banco.data.creado) {
                    $.ajax({
                      url: "/4DACTION/_V3_setBanco",
                      data: {
                        id: banco.id,
                        delete: true
                      },
                      dataType: "json",
                      success: function (data) {
                        if (typeof event.isTrigger == "undefined") {
                          unaBase.history.back();
                        }
                      },
                      error: function (xhr, text, error) {
                        toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                      }
                    });
                  } else {
                    if (typeof event.isTrigger == "undefined") {
                      unaBase.history.back();
                    }
                  }
                }
                break;
              case "impuestos":
                if (typeof impuestos.data == "undefined") {
                  console.log("impuestos indefino");
                  unaBase.history.back();
                } else {
                  if (!impuestos.data.creado) {
                    $.ajax({
                      url: "/4DACTION/_V3_setImpuestos",
                      data: {
                        id: impuestos.id,
                        delete: true
                      },
                      dataType: "json",
                      success: function (data) {
                        if (typeof event.isTrigger == "undefined") {
                          unaBase.history.back();
                        }
                      },
                      error: function (xhr, text, error) {
                        toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                      }
                    });
                  } else {
                    if (typeof event.isTrigger == "undefined") {
                      unaBase.history.back();
                    }
                  }
                }
                break;
              case "Pago":
                if (payment.estado == "POR EMITIR") {
                  $.ajax({
                    url: "/4DACTION/_V3_setPago",
                    data: {
                      id: payment.id,
                      delete: true
                    },
                    dataType: "json",
                    success: function (data) {
                      if (typeof event.isTrigger == "undefined") {
                        unaBase.history.back();
                      }
                    },
                    error: function (xhr, text, error) {
                      toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                    }
                  });
                } else {
                  if (typeof event.isTrigger == "undefined") {
                    unaBase.history.back();
                  }
                }
                break;
              case "Dtcnc":
                if (dtc.data.estado == "POR EMITIR") {
                  $.ajax({
                    url: "/4DACTION/_V3_setDtcnc",
                    data: {
                      id: dtc.id,
                      delete: true
                    },
                    dataType: "json",
                    success: function (data) {
                      if (typeof event.isTrigger == "undefined") {
                        unaBase.history.back();
                      }
                    },
                    error: function (xhr, text, error) {
                      toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                    }
                  });
                } else {
                  if (typeof event.isTrigger == "undefined") {
                    unaBase.history.back();
                  }
                }
                break;
              case "NcVentas":
                if (notas.data.estado == "PREVISUALIZACION") {
                  $.ajax({
                    url: "/4DACTION/_V3_setNcVentas",
                    data: {
                      id: notas.id,
                      delete: true
                    },
                    dataType: "json",
                    success: function (data) {
                      if (typeof event.isTrigger == "undefined") {
                        unaBase.history.back();
                      }
                    },
                    error: function (xhr, text, error) {
                      toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                    }
                  });
                } else {
                  if (typeof event.isTrigger == "undefined") {
                    unaBase.history.back();
                  }
                }
                break;
              case "Producto":
                /*if (!$('section.sheet').data('index'))
                  $.ajax({
                    'url': '/4DACTION/_V3_removeCotizacion',
                    data: {
                      id: $('section.sheet').data('id')
                    },
                    dataType: 'json',
                    success: function(data) {
                      if (typeof event.isTrigger == 'undefined')
                        unaBase.loadInto.viewport('/v3/views/cotizaciones/list.shtml');
                        //unaBase.loadInto.viewport('/v3/views/cotizaciones/index.shtml');
                    }
                  });
                else {
                  if (typeof event.isTrigger == 'undefined')
                    unaBase.loadInto.viewport('/v3/views/cotizaciones/list.shtml');
                }*/
                //unaBase.loadInto.viewport('/v3/views/catalogo/list.shtml');
                unaBase.history.back();
                break;
              case "Negocios":
                var cotizacionId = $("section.sheet").data("id");
                var folio = $("section.sheet").data("index");
                var userCot = $("html > body.menu.home > aside > div > div > h1").data(
                  "username"
                );
                // var socketNew = io.connect(nodeUrl);
                var cotBlock = {
                  id: cotizacionId,
                  folio: folio,
                  user: userCot,
                  // doc_name: $('.titulofinal').val(),
                  // total: $('span[name="cotizacion[montos][subtotal_neto]"]').text(),
                  block: false,
                  module: "negocios",
                  from: "boton volver---"
                };


                // $.ajax({
                //   url: "/4DACTION/_V3_block_by_use",
                //   data: {
                //     id: cotizacionId,
                //     module: $(".sidebar li.active").data("name"),
                //     block: false,
                //     list: false
                //   },
                //   dataType: "json",
                //   async: false,
                //   success: function (datas) {
                //     // data.rows.push(cotBlock);
                //     // if(!uVar.unableSocket){
                //     //  socketNew.emit('sendblockNg', datas.rows);
                //     //  socketNew.emit('sendblockAddNg', cotBlock);
                //     // }
                //     


                //   },
                //   error: function (xhr, text, error) {
                //     toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                //   }
                // });

                // window.onbeforeunload = function () {
                //   return "¿Está seguro que desea salir?";
                // };
                if (
                  !$("section.sheet").data("index") &&
                  params.presupuesto
                ) {
                  $.ajax({
                    url: "/4DACTION/_V3_removeCotizacion",
                    data: {
                      id: $("section.sheet").data("id")
                    },
                    dataType: "json",
                    success: function (data) {

                      if (typeof event.isTrigger == "undefined")
                        //unaBase.loadInto.viewport('/v3/views/cotizaciones/list.shtml');
                        unaBase.history.back();
                    }
                  });
                } else {
                  unaBase.history.back();
                }
                break;
              default:
                unaBase.history.back();
                break;
            }
          }
        };
        unaBase.toolbox.menu.checkExit(event, callback);
        // if (typeof event.isTrigger == "undefined") {

        //   if (unaBase.changeControl.query() && $("#search").is(":hidden")){
        //     confirm(MSG.get("CONFIRM_EXIT_UNSAVED")).done(callback);

        //     if(unaBase.back.callback){
        //       unaBase.back.callback();
        //     }
        //   }
        //   else callback(true);
        // } else callback(true);
      }
    });

  //-------------------------- empieza a agregar botones

  if ($.inArray("searchOff", params.buttons) != -1) {
    buttons.push({
      name: "searchOff",
      icon: "ui-icon-search",
      caption: "Buscar",
      action: function () {
        executeSearch();
      }
    });
  }

  if ($.inArray("nueva_tarea", params.buttons) != -1) {
    buttons.push({
      name: "nueva_tarea",
      icon: "ui-icon-circle-plus",
      caption: "Nueva tarea",
      action: function () {
        alert("nueva tarea!");
      }
    });
  }

  if (
    $.inArray("programador_masivo", params.buttons) != -1 &&
    (function () {
      var loggedUsername =
        (window.v3_data_username &&
          typeof window.v3_data_username === "string" &&
          window.v3_data_username) ||
        $("html > body.menu.home > aside > div > div > h1").data("username");
      if (typeof loggedUsername !== "string") return false;
      return loggedUsername.toUpperCase() === "SOPORTE3";
    })()
  )
    buttons.push({
      name: "programador_masivo",
      icon: "ui-icon-arrowthick-1-w",
      caption: "Programar masivo",
      action: function () {
        unaBase.loadInto.viewport(
          "/v3/views/negocios/programadormasivo.shtml",
          "PROGRAMAR MASIVO",
          true
        );
      }
    });


  if ($.inArray("new", params.buttons) != -1)
    buttons.push({
      name: "new",
      icon: "ui-icon-document",
      caption: "Crear",
      action: function () {
        switch (params.entity) {
          case "comprobantes":

            unaBase.loadInto.viewport(
              "/v3/views/comprobantes/content.shtml",
              "Crear comprobante",
              false
            );
            break;
          case "accounting":

            $.ajax({
              url: "/4DACTION/_V3_set" + params.entity,
              dataType: "json",
              type: "POST",
              data: {
                create: true
              }
            }).done(function (data) {
              unaBase.loadInto.viewport(
                "/v3/views/ajustes/accounting/content.shtml?id=" + data.id
              );
            });
            break;
          case "Tipodoctribu":
            $.ajax({
              url: "/4DACTION/_V3_set" + params.entity,
              dataType: "json",
              type: "POST",
              data: {
                create: true
              }
            }).done(function (data) {
              unaBase.loadInto.viewport(
                "/v3/views/ajustes/tipo_doctribu/content.shtml?id=" +
                data.id
              );
            });
            break;
          case "Proyecto":
            $.ajax({
              url: "/4DACTION/_V3_set" + params.entity,
              dataType: "json",
              type: "POST",
              data: {}
            }).done(function (data) {
              unaBase.loadInto.viewport(
                "/v3/views/proyectos/content.shtml?id=" + data.id
              );
            });
            break;
          case "Cotizacion":
            $.ajax({
              url: "/4DACTION/_V3_getCotizacion",
              data: {
                q: "",
                template: true
              },
              dataType: "json"
            }).done(function (data) {
              if (data.rows.length == 0) {
                $.ajax({
                  url: "/4DACTION/_V3_set" + params.entity,
                  dataType: "json",
                  type: "POST",
                  data: {
                    presupuesto: params.presupuesto
                  }
                }).done(function (data) {
                  if (typeof params.presupuesto != "undefined")
                    unaBase.loadInto.viewport(
                      "/v3/views/presupuestos/content.shtml?id=" + data.id
                    );
                  else
                    unaBase.loadInto.viewport(
                      "/v3/views/cotizaciones/content.shtml?id=" + data.id
                    );
                });
              } else {
                if (typeof params.presupuesto != "undefined")
                  unaBase.loadInto.dialog(
                    "/v3/views/presupuestos/dialog/template.shtml",
                    "Crear presupuesto desde una plantilla",
                    "medium"
                  );
                else
                  unaBase.loadInto.dialog(
                    "/v3/views/cotizaciones/dialog/template.shtml",
                    "Crear cotización desde una plantilla",
                    "medium"
                  );
              }
            }).fail((jqXHR, textStatus, errorThrown) => {
              console.error(textStatus)
            });
            break;
          case "Producto":
            unaBase.loadInto.dialog(
              "/v3/views/catalogo/content.shtml",
              undefined,
              "large"
            );
            break;
          case "Usuarios":
            unaBase.loadInto.viewport("/v3/views/usuarios/content.shtml");
            break;
          case "Banco":
            unaBase.loadInto.dialog(
              "/v3/views/banco/content.shtml",
              "Añadir movimiento bancario",
              "large"
            );
            break;
        }
      }
    });
  if ($.inArray("mail_cobranza", params.buttons) != -1) {
    buttons.push({
      name: "mail_cobranza",
      icon: "ui-icon-mail-closed",
      caption: "Enviar email",
      action: function () {
        let tiposEmails = $(
          '<section>\
              <select name="mail_cobranza_selected">\
                <option value="" selected>[ Seleccionar tipo email ]</option>\
                <option value="pre_cobranza">Pre cobranza</option>\
                <option value="cobranza">Cobranza</option>\
                <option value="corte_servicio">Aviso corte servicio</option>\
              </select>\
          </section>'
        );
        prompt(tiposEmails).done(function (data) {
          let selectedOption = $(
            'select[name="mail_cobranza_selected"]'
          ).val();
          if (selectedOption != "") {
            window.open(
              "https://" +
              window.location.host +
              "/v3/views/reportes/dialog/email_cobranza.shtml",
              "_blank"
            );
          } else {
            toastr.warning("Falta seleccionar opción!");
          }
        });
      }
    });
  }
  if ($.inArray("agendar_cobro", params.buttons) != -1) {
    buttons.push({
      name: "agendar_cobro",
      icon: "ui-icon-calendar",
      caption: "Agendar cobro",
      action: function () {
        window.open(
          "https://" +
          window.location.host +
          "/v3/views/reportes/dialog/agendar_cobro.shtml",
          "_blank"
        );
      }
    });
  }
  if ($.inArray("selectUsers", params.buttons) != -1) {
    buttons.push({
      name: "selectUsers",
      icon: "ui-icon-person",
      caption: "Seleccionar usuarios",
      action: function () {

        $(`li[data-name="selectAccess"]`).show();
        $(`li[data-name="selectUsers"]`).hide();
        $(`.sheet-permisos`).hide();
        $(`.sheet-usuarios`).show();
      }
    });
  }
  if ($.inArray("selectUsersForArea", params.buttons) != -1) {
    buttons.push({
      name: "selectUsersForArea",
      icon: "ui-icon-person",
      caption: "Seleccionar usuarios.",
      action: function () {

        $(`li[data-name="selectAreas"]`).show();
        $(`li[data-name="selectUsersForArea"]`).hide();
        $(`.sheet-areas`).hide();
        $(`.sheet-usuarios`).show();
      }
    });
  }
  if ($.inArray("selectAccess", params.buttons) != -1) {
    buttons.push({
      name: "selectAccess",
      icon: "ui-icon-key",
      caption: "Seleccionar permisos",
      action: function () {

        $(`li[data-name="selectAccess"]`).hide();
        $(`li[data-name="selectUsers"]`).show();
        $(`.sheet-permisos`).show();
        $(`.sheet-usuarios`).hide();
      }
    });
  }
  if ($.inArray("selectAreas", params.buttons) != -1) {
    buttons.push({
      name: "selectAreas",
      icon: "ui-icon-key",
      caption: "Seleccionar areas",
      action: function () {

        $(`li[data-name="selectAreas"]`).hide();
        $(`li[data-name="selectUsersForArea"]`).show();
        $(`.sheet-areas`).show();
        $(`.sheet-usuarios`).hide();
      }
    });
  }
  if ($.inArray("applyAreas", params.buttons) != -1) {
    buttons.push({
      name: "applyAreas",
      icon: "ui-icon-disk",
      caption: "Aplicar areas",
      action: function () {
        if (areas.getSelectedAreas().ids.length && areas.getSelectedUser().ids.length) {


          $.ajax({
            url: `/4DACTION/_v3_setAreasMany`,
            dataType: "json",
            type: "POST",
            data: {
              ...params.data(),
              state: true
            }
          }).done(function (data) {


            if (data.success) {
              toastr.success("areas aplicadas");
              setTimeout(() => {
                unaBase.history.back();

              }, 2000);
            } else {
              toastr.error("ha ocurrido un error");
            }
          });
        } else if (!areas.getSelectedAreas().ids.length) {
          toastr.warning("debes seleccionar areas para aplicar");
        } else if (!areas.getSelectedUser().ids.length) {
          toastr.warning("debes seleccionar usuarios");
        }
      }
    });
  }
  if ($.inArray("applyAccess", params.buttons) != -1) {
    buttons.push({
      name: "applyAccess",
      icon: "ui-icon-disk",
      caption: "Aplicar permisos",
      action: function () {
        if (permisos.getSelectedAccess().ids.length && permisos.getSelectedUser().ids.length) {


          $.ajax({
            url: `/4DACTION/_v3_setPermisosMany`,
            dataType: "json",
            type: "POST",
            data: {
              ...params.data(),
              state: true
            }
          }).done(function (data) {


            if (data.success) {
              toastr.success("permisos aplicados");
              setTimeout(() => {
                unaBase.history.back();

              }, 2000);
            } else {
              toastr.error("ha ocurrido un error");
            }
          });
        } else if (!permisos.getSelectedAccess().ids.length) {
          toastr.warning("debes seleccionar permisos para aplicar");
        } else if (!permisos.getSelectedUser().ids.length) {
          toastr.warning("debes seleccionar usuarios");
        }
      }
    });
  }
  if ($.inArray("removeAccess", params.buttons) != -1) {
    buttons.push({
      name: "removeAccess",
      icon: "ui-icon-disk",
      caption: "Quitar permisos",
      action: function () {
        if (permisos.getSelectedAccess().ids.length && permisos.getSelectedUser().ids.length) {
          $.ajax({
            url: `/4DACTION/_v3_setPermisosMany`,
            dataType: "json",
            type: "POST",
            data: {
              ...params.data(),
              state: false
            }
          }).done(function (data) {

            if (data.success) {
              toastr.success("permisos removidos");
              setTimeout(() => {
                unaBase.history.back();

              }, 2000);
            } else {
              toastr.error("ha ocurrido un error");
            }
          });
        } else if (!permisos.getSelectedAccess().ids.length) {
          toastr.warning("debes seleccionar permisos para remover");
        } else if (!permisos.getSelectedUser().ids.length) {
          toastr.warning("debes seleccionar usuarios");
        }
      }
    });
  }

  if ($.inArray("saveCartolaBanco", params.buttons) != -1) {
    buttons.push({
      name: "saveCartolaBanco",
      icon: "ui-icon-disk",
      caption: "Guardar",
      action: function () {
        unaBase.ui.block();
        if (params.validate()) {
          $.ajax({
            url: '/4DACTION/_V3_setMovBancoCopyPaste',
            dataType: "json",
            type: "POST",
            data: params.data()
          }).done(function (data) {
            if (data.success) {
              toastr.success('Información cargada con éxito!');
              return true;
            } else {
              toastr.error('No fue posible importar la información!');
              let errorMsg = data.errorMsg.replaceAll(/SL/g, '<br>');
              alert("<span style='font-weight:bold;'>Falta información:</span><br><br>" + errorMsg + "<br><span style='font-weight:bold;'>Verfica tu excel y vuelve a intentar.</span>");
              return false;
            }
          });
        } else if (!params.validate()) {
          toastr.warning(NOTIFY.get("ERROR_DATA"));
        } else if (!comprobantes.validateNumbers()) {
          toastr.warning(NOTIFY.get("ACCOUNT_WARNING_EQUAL"));
        }
        unaBase.ui.unblock();
      }
    });
  }

  if ($.inArray("saveComprobante", params.buttons) != -1) {
    buttons.push({
      name: "save",
      icon: "ui-icon-disk",
      caption: "Guardar",
      action: async function () {
        const saveComp = () => {
          return new Promise((resolve, reject) => {
            // unaBase.ui.block();
            console.log("PARAMSSS: ", params.entity);
            if (params.validate() && comprobantes.validateNumbers()) {
              $.ajax({
                url: `/4DACTION/_V3_set${params.entity}?id=${params.data().id}`,
                dataType: "json",
                type: "POST",
                data: params.data()
              }).done(function (data) {
                console.warn("saved")
                console.warn(params.validate())

                if (data.success) {
                  comprobantes.id = data.id;
                  comprobantes.data.id = data.id;

                  if (data.new) {

                    const oldTitle = $("#comprobantes h1#mainTitle").text();
                    $("#comprobantes h1#mainTitle").text("");
                    $("#comprobantes h1#mainTitle").text(`${oldTitle} Nro. ${data.id}`);
                    $(`input[name="id"]`).val(data.id);

                  }
                  toastr.success(
                    NOTIFY.get("SUCCESS_SAVE")
                  );
                  resolve()
                } else {

                  if (data.errorMsg != '') {
                    toastr.error(
                      data.errorMsg.replaceAll(/SL/g, '<br>')
                    );
                  } else {
                    toastr.success(
                      NOTIFY.get("ERROR_INTERNAL")
                    );

                  }

                  reject()
                }
                // unaBase.changeControl.init();
                // unaBase.ui.unblock();
                return { success: true };
              });
            } else if (!params.validate()) {
              toastr.warning(NOTIFY.get("ERROR_DATA"));
            } else if (!comprobantes.validateNumbers()) {
              toastr.warning(NOTIFY.get("ACCOUNT_WARNING_EQUAL"));
            }
            unaBase.changeControl.init();
            unaBase.ui.unblock();



          });
        };

        const comprobarCierre = () => {
          return new Promise((resolve, reject) => {

            $.ajax({
              url: "/4DACTION/_V3_get_estadoPeriodoContable",
              data: {
                periodo: $('#comprobantes [name="docDate"]').val(),
                origen: "ext modulos"
              },
              dataType: "json",
              async: false,
              success: function (subdata) {

                if (subdata.exists == 1) {
                  if (subdata.closed == 1) {
                    reject()

                    toastr.warning(
                      "El periodo seleccionado se encuentra cerrado, por tanto no puede guardar este comprobante ."
                    );


                  } else {
                    resolve()
                  }

                } else {
                  reject()
                  toastr.warning(
                    "El periodo contable para este comprobante no está creado.");
                }
              }
            });



          });
        };


        comprobarCierre()
          .then(res => {
            saveComp()


            console.log("comprobante creado");



          })
          .catch(error => {

            console.log("No se pudo guardar el comprobante, chequar el periodo contable cerrado y/o no creado");

            unaBase.ui.unblock();
          });








      }
    });
  }

  if ($.inArray("generate_reverse_provision", params.buttons) != -1) {
    buttons.push({
      name: "generate_reverse_provision",
      icon: "ui-icon-plus",
      caption: "Generar reversa",
      action: function () {
        const id = $(`#comprobantes`).data('id');

        unaBase.ui.block();
        setTimeout(() => {
          $.ajax({
            url: "/4DACTION/_light_gen_reversa_prov",
            data: {
              id_com_to_rev: id
            },
            dataType: "json",
            success: function (subdata) {
              unaBase.ui.unblock();
              if (subdata.success) {

                $(`li[data-name="generate_reverse_provision"]`).hide();
                toastr.success("Reversa generada con éxito.");
              } else {
                toastr.error("Hubo un error.");
              }
            },
            error: function (xhr, text, error) {
              toastr.error("Hubo un error.");
              unaBase.ui.unblock();
            },
          });
        }, 100);




      }
    });
  }

  if ($.inArray("addDetails", params.buttons) != -1) {
    buttons.push({
      name: "addDetails",
      icon: "ui-icon-plus",
      caption: "Agregar detalle",
      action: function () {



        let rand = Math.round(Math.random() * (1000000000 - 10000000) + 10000000);
        if (comprobantes.id > 0) {
          const container = document.querySelector("table#detail tbody");
          let html = $(`<tr data-id="${rand}" class="new-line-${rand} new">
                              <td class="contacto" data-idcont=""><div><span readonly name="auxiliar_rut_${rand}"></span><br><span readonly name="auxiliar_desc_${rand}"></span><button style=" " class="search-btn" data-type="auxiliar" data-id="${rand}" onClick="comprobantes.showDialogDTC(this)"><span class="ui-icon ui-icon-search"></span></button></div></td>
                              <td class="documento" data-iddoc="0" data-doctype="none"><div class="elements-container"><a style="margin-top: 5px" name="documento_desc_${rand}" target="_blank" href="">Sin documento</a><button class="search-btn" data-type="documento" style=" "  data-id="${rand}" onClick="comprobantes.showDialogDTC(this)"><span class="ui-icon ui-icon-search"></span></button></div></td>
                              <td><input readonly name="codigoCuenta" value="" type="text" /></td>
                              <td> <div class="input-container"><button data-id="${rand}" class="show cuentaContable" onClick="comprobantes.showCuentaContable(event)"><span class="ui-icon ui-icon-carat-1-s"></span></button><input  name="cuentaContable" value="" type="text" placeholder="Buscar cuenta contable" /></div>
                             
                              </td>
                              <td> <input name="glosa" placeholder="Escribir Glosa" type="text" /> </td>
                              <td><input class="format-all" name="debe" value="0" type="text"  onkeyup="unaBase.utilities.general.formater(this)"/></td>
                              <td><input class="format-all" name="haber" value="0" type="text" onkeyup="unaBase.utilities.general.formater(this)"/></td>
                              <td><button class="edit" style="display:none"  onClick="comprobantes.edit(event)"><span class="ui-icon ui-icon-pencil"></span></button><button class="save" onClick="comprobantes.save(event)"><span class="ui-icon ui-icon-disk"></span></button></td>                       
                                                     
                              <td><button class="delete" onClick="comprobantes.delete(event)"><span class="ui-icon ui-icon-close"></span></button></td> 
                              </tr>                      
                          `);

          // document.querySelector("tr.totals").insertAdjacentHTML('beforebegin', html);
          $("tr.totals").before(html);
          comprobantes.saveAndAdd(html);
          // html.find(`input[name="haber"]`).keydown(async function(event){
          //   console.log("on key down");
          //   console.log(event);
          //   const keyDown = event.keyCode;


          //   const cuentaContable = $(this).closest("tr").find(`input[name="cuentaContable"]`);
          //   if(keyDown === 13 && cuentaContable.val() !== ""){
          //     $(this).closest("td").next().find("button.save").click();
          //     unaBase.ui.block();
          //     setTimeout(() => {
          //       $(`li[data-name="addDetails"] button`).click();

          //       unaBase.ui.unblock();
          //     },1000);
          //   }else if(keyDown === 13 && cuentaContable.val() === ""){
          //     cuentaContable.css("background-color", "red");
          //     toastr.warning("Debes seleccionar una cuenta contable.");
          //   }
          // });
          comprobantes.addEvent13(rand)
          comprobantes.addFormatAll(rand)
          const cuentaContableShowButton = document.querySelector(`tr.new-line-${rand} input[name="cuentaContable"]`);
          comprobantes.addAutocomplete(cuentaContableShowButton);
          cuentaContableShowButton.focus();
          $(".numeric.currency input").number(true, currency.decimals, currency.decimals_sep, currency.thousands_sep);
        } else {
          toastr.warning("Debes Guardar el comprobantes antes de agregar un detalle.");
        }

      }
    });
  }

  if ($.inArray("exportExcel", params.buttons) != -1) {
    buttons.push({
      name: "exportExcel",
      icon: "ui-icon-plus",
      caption: "Exportar a excel",
      action: function () {
        if (comprobantes.id > 0) {
          let url = `${nodeUrl}/export-detalle-comprobante/?download=true&sid=${unaBase.sid.encoded()}&hostname=${window.location.origin}&id=${comprobantes.id}`;

          let download = window.open(url);
          download.blur();
          window.focus();


        }
      }
    });
  }


  if ($.inArray("agendar_pago", params.buttons) != -1) {
    buttons.push({
      name: "agendar_pago",
      icon: "ui-icon-calendar",
      caption: "Agendar pago",
      action: function () {
        window.open(
          "https://" +
          window.location.host +
          "/v3/views/reportes/dialog/agendar_cobro.shtml",
          "_blank"
        );
      }
    });
  }



  //REAPER NOW


  if ($.inArray("accounting_create_opening", params.buttons) != -1) {
    buttons.push({
      name: "accounting_create_opening",
      icon: "ui-icon-calendar",
      caption: "Crear Apertura",
      action: function () {

        let fecha_periodo_from = "";
        let fecha_periodo_to = "";


        var htmlObject = $(
          `<section>
            <div class="container">
              <div class="input-group">
                <span class="input-group-text">Selecciona el año</span>
                <input type="number" aria-label="Año" class="form-control" min="2000" max="2030" step="1" value="2022" id="date_opening" />           
              </div>
            </div>
          </section>`
        );

        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);



        prompt(htmlObject).done(function (data) {

          let dateSel = htmlObject.find('input[id="date_opening"]')[0].value.trim();

          if (dateSel !== "") {
            var filters = unaBase.getFilters();
            var sortParams = {};

            filters += "&" + jQuery.param(sortParams);


            $.ajax({
              url: "/4DACTION/_light_set_accounting_create_op",
              dataType: "json",
              type: "POST",
              data: {
                create: true,
                year: dateSel

              },
              success: function (response) {
                if (response.success)
                  unaBase.loadInto.viewport('/v3/views/comprobantes/content.shtml?id=' + response.id);
                else
                  toastr.error(response.errorMsg.replaceAll(/SL/g, '<br>'));
              },
              error: function (xhr, text, error) {
                toastr.error("Hubo un error.");
                console.warn(error)
              },
            }).done(function (data) {


            });
          }



        })


      }
    });
  }

  if ($.inArray("accounting_libro_diario", params.buttons) != -1) {

    buttons.push({
      name: "Libro diario",
      icon: "ui-icon-document-b",
      caption: "Libro diario",
      action: function () {
        let fecha_periodo_from = "";
        let fecha_periodo_to = "";

        var htmlObject = $(`<section> 
          <p style="margin-bottom: 15px;color: black;">Seleccionar periodo:</p> 
          <input id="fecha_lib_diario" type="text" class="form-control"> 
          <div class="form-check mt-2">
              <input class="form-check-input" type="checkbox" value="" id="checkApertura">
              <label class="form-check-label" for="flexCheckDefault">
                  Solo apertura
              </label>
          </div>
        </section>`);



        htmlObject.find('input[id="fecha_lib_diario"]').daterangepicker({
          minDate: '01/01/2012',
          locale: {
            "format": "DD/MM/YYYY",
            "separator": " - ",
            "applyLabel": "Aplicar",
            "cancelLabel": "Cancelar",
            "fromLabel": "From",
            "toLabel": "To",
            "customRangeLabel": "Custom",
            "daysOfWeek": [
              "Do",
              "Lu",
              "Ma",
              "Mi",
              "Ju",
              "Vi",
              "Sa"
            ],
            "monthNames": [
              "Enero",
              "Febrero",
              "Marzo",
              "Abril",
              "Mayo",
              "Junio",
              "Julio",
              "Augosto",
              "Septiembre",
              "Octubre",
              "Noviembre",
              "Diciembre"
            ],
            "firstDay": 1
          }
        }, function (start, end, label) {
          fecha_periodo_from = start.format('DD-MM-YYYY');
          fecha_periodo_to = end.format('DD-MM-YYYY');
        });

        prompt(htmlObject).done(function (data) {
          var periodo = data;
          if (fecha_periodo_to !== "" && fecha_periodo_from !== "") {
            var filters = unaBase.getFilters();


            var sortParams = {};
            $("#viewport")
              .find("table.results > thead > tr > th")
              .each(function () {
                if (typeof $(this).data("sort-order") != "undefined") {
                  sortParams = {
                    sort_by: $(this).data("sort-by"),
                    sort_order: $(this).data("sort-order")
                  };
                  return false;
                }
              });
            filters += "&" + jQuery.param(sortParams);
            //let check_apertura = htmlObject.find('input[id="checkApertura"]')[0].checked


            let url = `${nodeUrl}/libro-diario/?download=true&sid=${unaBase.sid.encoded()}&${filters}&hostname=${window.location.origin}&dateto=${fecha_periodo_to}&datefrom=${fecha_periodo_from}&dateFromBtn=true&checkApertura=${check_apertura}`;

            var download = window.open(url);
            download.blur();
            window.focus();
          } else {
            toastr.info("Descargando archivo solicitado");
          }

        });
      }

    });
  }

  if ($.inArray("btn_consolidated_itemsxoc", params.buttons) != -1) {
    buttons.push({
      name: "new_without_template",
      icon: "ui-icon-document",
      caption: "Descargar consolidado de Items x OC",
      action: function (callback) {
        let htmlObject = $('<section> \
										<!--<span>Buscar proyecto:</span>--> \
										<form autocomplete="on" target="the_iframe" action="about:blank"> \
											<input data-id-seleccionado="0" placeholder="Buscar proyecto" style="border: 1px solid lightgray;width:250px;margin:5px 0 0 0;border-radius:3px;padding:2px;background-color:yellow;" required type="text" name="buscar_proyectos_selected"> \
											<iframe style="display: none;" id="the_iframe" name="the_iframe" src="about:blank"></iframe> \
										</form> \
									</section>');

        // buscar proyectos
        htmlObject.find('input[name="buscar_proyectos_selected"]').autocomplete({
          source: function (request, response) {
            $.ajax({
              url: '/4DACTION/_V3_getProyectosActivos',
              dataType: "json",
              type: 'POST',
              data: {
                q: request.term
              },
              success: function (data) {
                response($.map(data, function (item) {
                  return item;
                }));
              }
            });
          },
          minLength: 2,
          select: function (event, ui) {
            htmlObject.find('input[name="buscar_proyectos_selected"]').val(ui.item.text);
            htmlObject.find('input[name="buscar_proyectos_selected"]').data('id-seleccionado', ui.item.id);
            return false;
          }
        }).data('ui-autocomplete')._renderItem = function (ul, item) {
          return $(`<li><a class="u-show-list"> ${item.text}</a></li>`).appendTo(ul);
        };


        confirm(htmlObject, 'Descargar', 'Cancelar').done(function (data) {
          let id = $('input[name="buscar_proyectos_selected"]').data('id-seleccionado');
          if (data) {
            if (parseFloat(id) > 0) {

              let url = `${nodeUrl}/consolidated-itemsxoc?id_project=${id}&sid=${unaBase.sid.encoded()}&hostname=${window.location.origin}`

              let download = window.open(url);
              download.blur();
              window.focus();

            } else {
              toastr.warning('Falta seleccionar proyecto.');
              if (typeof callback === "function") callback(data);
            }
          }
        });
      }
    });
  }

  if ($.inArray("accounting_libro_mayor", params.buttons) != -1) {


    buttons.push({
      name: "lib_cont",
      icon: "ui-icon-document-b",
      caption: "Libro Mayor",
      action: function () {
        const contentModal = `
          <div class="container">
              <div class="form-group">
                  <label for="fecha_reporte" class="form-label custom-label">Fecha:</label>
                  <input id="fecha_reporte" type="text" class="form-control form-control-sm mt-2" style="font-size: 10px;">
              </div>
              <div class="form-group">
                  <label for="cuentas_contable" class="form-label custom-label">Cuenta contable:</label>
                  <select class="mt-2" id="cuentas_contable"></select>
              </div>
          </div>`;


        const actionModalCustom = () => {
          let fecha_reporte = document.querySelector('#fecha_reporte').value;

          if (!fecha_reporte) {
            toastr.error("Debes ingresar una Fecha");
            return;
          }

          // Obtener todas las cuentas seleccionadas desde .selected-item.item
          let cuentasSeleccionadas = [...document.querySelectorAll('.selected-item.item')]
            .map(item => item.getAttribute('data-value'));


          // Convertir a formato esperado en la URL (ejemplo: "123,456,789")
          let nro_cuenta = cuentasSeleccionadas.join(',');

          let fechas = fecha_reporte.split(' - ');
          let dateFrom = moment(fechas[0], 'DD/MM/YYYY').toDate();
          let dateTo = moment(fechas[1], 'DD/MM/YYYY').toDate();

          const formatDate = (date) => {
            let day = date.getDate();
            let month = date.getMonth() + 1; // getMonth() devuelve un índice basado en 0
            let year = date.getFullYear();

            return `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;
          };

          // Formatear fechas
          dateFrom = formatDate(dateFrom);
          dateTo = formatDate(dateTo);

          let url = `${nodeUrl}/libro-mayor?download=true&date=${fecha_reporte}&sid=${unaBase.sid.encoded()}&hostname=${window.location.origin}&account=${nro_cuenta}&dateto=${dateTo}&datefrom=${dateFrom}`;

          let download = window.open(url);
          if (download) {
            download.blur();
            window.focus();
          }
        };



        initModalCustomMayor('Libro Mayor', contentModal, actionModalCustom)

      }

    });

  }

  if ($.inArray("foliador_hojas", params.buttons) != -1) {
    buttons.push({
      name: "Libro mayor",
      icon: "ui-icon-document-b",
      caption: "Foliador de hojas",
      action: function () {
        let fecha_periodo_from = "";
        let fecha_periodo_to = "";

        var htmlObject = $(`<section> 
    <div class="form-container">
        <div class="row p-1">
            <div class="col-4">
                <p>Folio inicial:</p> 
            </div>
            <div class="col-8">
                <input id="folio_inicial" type="text" class="form-control inputCustom"> 
            </div>
        </div>

        <div class="row p-1">
            <div class="col-4">
                <p>Numero de Hojas:</p> 
            </div>
            <div class="col-8">
                <input id="nro_hojas" type="text" class="form-control inputCustom"> 
            </div>
        </div>
        
        <div class="row p-1">
            <div class="col-4">
                <p>Orientacion:</p> 
            </div>
            <div class="col-8">
                <select class="form-select inputCustom" aria-label="Default select example" id="orientation">
                    <option selected value="p">Vertical</option>
                    <option value="h">Horizontal</option>
                </select>
            </div>
        </div>

        <div class="row p-1">
            <div class="col-4">
                <p>Membrete:</p> 
            </div>
            <div class="col-8 d-flex align-items-center">
                <input id="check_membrete" type="checkbox" style="width: 20px; height: 20px; margin: 0;"> 
            </div>
        </div>
    </div>
</section>
`);







        prompt(htmlObject).done(function (data) {
          const folio_inicial = htmlObject.find('input[id="folio_inicial"]')[0].value.trim();
          const nro_hojas = htmlObject.find('input[id="nro_hojas"]')[0].value.trim();
          const orientation = htmlObject.find('select[id="orientation"]')[0].value.trim();
          const membrete = htmlObject.find('input[id="check_membrete"]')[0].checked;

          if (folio_inicial == "") {
            toastr.error("Debes ingresar un folio inicial");
            return;
          }

          if (nro_hojas == "") {
            toastr.error("Debes ingresar un numero de hojas");
            return;
          }

          let url = `${nodeUrl}/foliador-hojas?download=true&sid=${unaBase.sid.encoded()}&hostname=${window.location.origin}&folio_inicial=${folio_inicial}&nro_hojas=${nro_hojas}&orientation=${orientation}&membrete=${membrete}`;



          //let url = `${nodeUrl}/libro-mayor/?download=true&sid=${unaBase.sid.encoded()}&hostname=${window.location.origin}&dateto=${fecha_periodo_to}&datefrom=${fecha_periodo_from}&dateFromBtn=true&${filters}&checkApertura=${check_apertura}`;

          let download = window.open(url);
          download.blur();
          window.focus();

        });
      }
    });
  }


  if ($.inArray("accounting_provision", params.buttons) != -1) {
    buttons.push({
      name: "Provision",
      icon: "ui-icon-document-b",
      caption: "Generar provision",
      action: function () {
        const currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() - 1);
        const defaultMonth = currentDate.toISOString().slice(0, 7);

        var htmlObject = $(`<section>
          <p style="margin-bottom: 15px;color: black;">Seleccionar periodo:</p>
          <input id="fecha" type="month" class="form-control" value="${defaultMonth}">
          <div class="form-check mt-2 p-0">
              <button class="btn btn-custom-vx gastos">Gastos</button>
              <button class="btn btn-custom-vx ventas">Ventas</button>
          </div>
        </section>`);

        htmlObject.find('.btn-custom-vx').on('click', function () {
          htmlObject.find('.btn-custom-vx').removeClass('active');
          $(this).addClass('active');
        });

        prompt(htmlObject).done(function (data) {
          let activeOption = htmlObject.find('.btn-custom-vx.active').length > 0;
          if (!activeOption) {
            toastr.error("Debes seleccionar una opción entre Gastos o Ventas");
            return;
          }
          const selectedMonth = htmlObject.find('#fecha').val();
          const dateParts = selectedMonth.split("-");
          const lastDayDate = new Date(dateParts[0], dateParts[1], 0);
          const fecha_periodo_to = `${lastDayDate.getDate()}-${dateParts[1]}-${dateParts[0]}`;

          if (fecha_periodo_to !== "") {
            unaBase.ui.block();
            setTimeout(() => {
              let urlSuffix = htmlObject.find('.btn-custom-vx.ventas.active').length > 0 ? "_light_set_provision_venta" : "_light_set_provision_gastos";
              $.ajax({
                url: "/4DACTION/" + urlSuffix,
                data: {
                  dateTo: fecha_periodo_to
                },
                dataType: "json",
                success: function (subdata) {
                  unaBase.ui.unblock();
                  if (subdata.success) {
                    toastr.success("Provisión generada con éxito");
                    unaBase.loadInto.viewport('/v3/views/comprobantes/content.shtml?id=' + subdata.id);
                  } else {
                    toastr.error("Hubo un error al generar la provisión");
                  }
                },
                error: function (xhr, text, error) {
                  toastr.error("Hubo un error.");
                  unaBase.ui.unblock();
                },
              });
            }, 100);  // Delay para asegurar que la UI se actualice
          } else {
            toastr.error("No has seleccionado un periodo");
          }
        });
      }
    });




  }

  if ($.inArray("accounting_balance", params.buttons) != -1) {
    buttons.push({
      name: "Balance",
      icon: "ui-icon-document-b",
      caption: "Balance",
      action: function () {
        let fecha_periodo_from = "";
        let fecha_periodo_to = "";

        var htmlObject = $(`<section> 
            <p style="margin-bottom: 15px;color: black;">Seleccionar periodo:</p>  
            <input id="fecha_balance" type="text" class="form-control"> 
            <hr class="mt-2 mb-3"/>
              <div class="form-group row">
                <label for="inputEmail3" class="col-sm-2 col-form-label">Porcentaje</label>
                <div class="col-sm-8">
                  <input type="text" class="form-control" id="percent_eerr" placeholder="Ingrese el porcentaje EERR">
                </div>
              </div>
          </section>`

        );
        $.ajax({
          url: "/4DACTION/_light_getParameters",
          dataType: "json",
          type: "get",
        }).done(function (data) {
          document.getElementById("percent_eerr").value = data.percent_eerr
        });


        const now = new Date();

        const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 2, 0);

        htmlObject.find('input[id="fecha_balance"]').daterangepicker({
          minDate: '01/01/2012',
          startDate: firstDay,
          endDate: lastDay,
          locale: {
            "format": "DD/MM/YYYY",
            "separator": " - ",
            "applyLabel": "Aplicar",
            "cancelLabel": "Cancelar",
            "fromLabel": "From",
            "toLabel": "To",
            "customRangeLabel": "Custom",
            "daysOfWeek": [
              "Do",
              "Lu",
              "Ma",
              "Mi",
              "Ju",
              "Vi",
              "Sa"
            ],
            "monthNames": [
              "Enero",
              "Febrero",
              "Marzo",
              "Abril",
              "Mayo",
              "Junio",
              "Julio",
              "Augosto",
              "Septiembre",
              "Octubre",
              "Noviembre",
              "Diciembre"
            ],
            "firstDay": 1
          }
        }, function (start, end, label) {
          fecha_periodo_from = start.format('DD-MM-YYYY');
          fecha_periodo_to = end.format('DD-MM-YYYY');
        });


        prompt(htmlObject).done(function (data) {
          var periodo = data;
          let dateSel = htmlObject.find('input[id="fecha_balance"]')[0].value.split('-').reverse();
          if (dateSel[1] != undefined && dateSel[0] != undefined) {
            fecha_periodo_to = dateSel[0].trim();
            fecha_periodo_from = dateSel[1].trim();
          }
          if (fecha_periodo_to !== "" && fecha_periodo_from !== "") {

            let percent = document.getElementById("percent_eerr").value
            $.ajax({
              url: "/4DACTION/_light_setParameters",
              dataType: "json",
              type: "POST",
              data: {
                percent_eerr: percent
              }
            }).done(function (data) {

              toastr.success('Porcentaje actualizado con exito!');
            });

            var filters = unaBase.getFilters();
            var sortParams = {};

            filters += "&" + jQuery.param(sortParams);
            //----------------

            let url = `${nodeUrl}/balance/?download=true&dateto=${fecha_periodo_to}&estado=negocio&datefrom=${fecha_periodo_from}&sid=${unaBase.sid.encoded()}&${filters}&hostname=${window.location.origin}&from_balance=True`

            let download = window.open(url);
            download.blur();
            window.focus();
          } else {
            toastr.error("No has seleccionado un periodo");
          }
        });

      }

    });
  }

  if ($.inArray("accounting_lib_cont", params.buttons) != -1) {
    buttons.push({
      name: "lib_cont",
      icon: "ui-icon-document-b",
      caption: "F29 + Libros",
      action: function () {
        let fecha_periodo_from = "";
        let fecha_periodo_to = "";

        var htmlObject = $(
          `<section>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
              <p style="margin:0; color:black;">Seleccionar periodo:</p>

              <div style="display:flex; align-items:center; gap:20px;" id="mi-modal-body">
                <label style="display:flex; align-items:center; gap:5px; cursor:pointer;">
                  <input type="radio" name="formato" value="excel" checked> Excel
                </label>
                <label style="display:flex; align-items:center; gap:5px; cursor:pointer;">
                  <input type="radio" name="formato" value="pdf"> PDF
                </label>
              </div>
            </div>

            <input id="fecha_balance" type="text">
            <hr class="mt-2 mb-3"/>

            <!-- PPM -->
            <div class="form-group row" style="margin-top:20px;">
              <label for="ppmtax" class="col-12 col-sm-2 col-form-label">PPM</label>

              <div class="col-12 col-sm-10">
                <input
                  type="text"
                  class="form-control"
                  id="ppmtax"
                  placeholder="Ingrese la tasa PPM"
                >
              </div>
            </div>

            <!-- Opciones PDF (oculto por defecto) -->
            <div class="form-group row mt-2" id="folio_opts" style="display:none;">
              <!-- Izquierda: Modo Folio + checkbox (permitir wrap para que no invada la otra columna) -->
              <div class="col-12 col-sm-3 d-flex align-items-center"
                style="gap:10px; flex-wrap:nowrap; white-space:nowrap;">
                <span>Modo Folio</span>
                <input
                  type="checkbox"
                  id="modo_folio"
                  style="position:static; margin:0;"
                >
              </div>

              <!-- Derecha: Folio Inicial + input (si queda angosto, el input baja de línea) -->
              <div class="col-12 col-sm-9">
                <div class="d-flex align-items-center"
                    style="gap:10px; flex-wrap:wrap; white-space:normal;">
                  <span>Folio Inicial</span>
                  <input
                    type="number"
                    class="form-control"
                    id="folio_inicial"
                    min="1"
                    step="1"
                    inputmode="numeric"
                    placeholder="N°"
                    style="flex:1 1 100px; min-width:100px;"
                  >
                </div>
              </div>
            </div>
          </section>`
        );

        const now = new Date();

        const firstDay = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        htmlObject.find('input[id="fecha_balance"]').daterangepicker({
          minDate: '01/01/2012',
          startDate: firstDay,
          endDate: lastDay,
          locale: {
            "format": "DD/MM/YYYY",
            "separator": " - ",
            "applyLabel": "Aplicar",
            "cancelLabel": "Cancelar",
            "fromLabel": "From",
            "toLabel": "To",
            "customRangeLabel": "Custom",
            "daysOfWeek": [
              "Do",
              "Lu",
              "Ma",
              "Mi",
              "Ju",
              "Vi",
              "Sa"
            ],
            "monthNames": [
              "Enero",
              "Febrero",
              "Marzo",
              "Abril",
              "Mayo",
              "Junio",
              "Julio",
              "Augosto",
              "Septiembre",
              "Octubre",
              "Noviembre",
              "Diciembre"
            ],
            "firstDay": 1
          }
        }, function (start, end, label) {
          fecha_periodo_from = start.format('DD-MM-YYYY');
          fecha_periodo_to = end.format('DD-MM-YYYY');
          console.log("DATERANGE SET");
        });



        htmlObject.find('#ppmtax').val(unaBase.parametros.ppm)
        // Se obtiene la selección del radio box







        prompt(htmlObject).done(function (data) {
          var periodo = data;
          let formato = htmlObject.find('input[name="formato"]:checked').val();
          let dateSel = htmlObject.find('input[id="fecha_balance"]')[0].value.split('-').reverse();
          
          // Modo Foliador de Hojas
          const $modoFolio = $("#modo_folio");
          const modoFolio = $modoFolio.length ? $modoFolio.is(":checked") : false;
          const folioInicialRaw = $("#folio_inicial").val();
          const folioInicial = (folioInicialRaw === "" || folioInicialRaw == null) ? 1 : parseInt(folioInicialRaw, 10);

          if (dateSel[1] != undefined && dateSel[0] != undefined) {
            fecha_periodo_to = dateSel[0].trim();
            fecha_periodo_from = dateSel[1].trim();
          }
          // Formato Excel
          if (fecha_periodo_to !== "" && fecha_periodo_from !== "" && (formato === 'excel')) {

            let ppmtax = document.getElementById("ppmtax").value
            $.ajax({
              url: "/4DACTION/_light_setParameters",
              dataType: "json",
              type: "POST",
              data: {
                ppm: ppmtax
              }
            }).done(function (data) {

              toastr.success('Tasa actualizada con exito!');
            });
            var filters = unaBase.getFilters();
            var sortParams = {};

            filters += "&" + jQuery.param(sortParams);
            //----------------

            let url = nodeUrl + "/export-lib-cont/?download=true&dateto=" + fecha_periodo_to + "&datefrom=" + fecha_periodo_from + "&sid=" + unaBase.sid.encoded() + "&" + filters + "&hostname=" + window.location.origin;

            let download = window.open(url);
            download.blur();
            window.focus();

            //Formato PDf
<<<<<<< Updated upstream
            console.log(formato);
<<<<<<< Updated upstream
          } else if (fecha_periodo_to !== "" && fecha_periodo_from !== "" && (formato === 'pdf')) {
            let ppmtax = document.getElementById("ppmtax").value
=======
<<<<<<< Updated upstream
          } else if (fecha_periodo_to !== "" && fecha_periodo_from !== "" && (formato === 'pdf')){
              let ppmtax = document.getElementById("ppmtax").value
=======
<<<<<<< Updated upstream
          } else if (fecha_periodo_to !== "" && fecha_periodo_from !== "" && (formato === 'pdf')) {
            let ppmtax = document.getElementById("ppmtax").value
=======
<<<<<<< Updated upstream
          } else if (fecha_periodo_to !== "" && fecha_periodo_from !== "" && (formato === 'pdf')){
              let ppmtax = document.getElementById("ppmtax").value
=======
<<<<<<< Updated upstream
          } else if (fecha_periodo_to !== "" && fecha_periodo_from !== "" && (formato === 'pdf')) {
            let ppmtax = document.getElementById("ppmtax").value
=======
<<<<<<< Updated upstream
          } else if (fecha_periodo_to !== "" && fecha_periodo_from !== "" && (formato === 'pdf')){
              let ppmtax = document.getElementById("ppmtax").value
=======
<<<<<<< Updated upstream
          } else if (fecha_periodo_to !== "" && fecha_periodo_from !== "" && (formato === 'pdf')) {
            let ppmtax = document.getElementById("ppmtax").value
=======
<<<<<<< Updated upstream
          } else if (fecha_periodo_to !== "" && fecha_periodo_from !== "" && (formato === 'pdf')){
              let ppmtax = document.getElementById("ppmtax").value
=======
<<<<<<< Updated upstream
          } else if (fecha_periodo_to !== "" && fecha_periodo_from !== "" && (formato === 'pdf')){
              let ppmtax = document.getElementById("ppmtax").value
=======
<<<<<<< Updated upstream
          } else if (fecha_periodo_to !== "" && fecha_periodo_from !== "" && (formato === 'pdf')) {
            let ppmtax = document.getElementById("ppmtax").value
=======
<<<<<<< Updated upstream
          } else if (fecha_periodo_to !== "" && fecha_periodo_from !== "" && (formato === 'pdf')){
              let ppmtax = document.getElementById("ppmtax").value
=======
<<<<<<< Updated upstream
          } else if (fecha_periodo_to !== "" && fecha_periodo_from !== "" && (formato === 'pdf')) {
            let ppmtax = document.getElementById("ppmtax").value
=======
=======
>>>>>>> Stashed changes
          } else if (fecha_periodo_to !== "" && fecha_periodo_from !== "" && (formato === 'pdf')){
              let ppmtax = document.getElementById("ppmtax").value
>>>>>>> Stashed changes
>>>>>>> Stashed changes
>>>>>>> Stashed changes
>>>>>>> Stashed changes
>>>>>>> Stashed changes
>>>>>>> Stashed changes
>>>>>>> Stashed changes
>>>>>>> Stashed changes
>>>>>>> Stashed changes
>>>>>>> Stashed changes
>>>>>>> Stashed changes
>>>>>>> Stashed changes
            $.ajax({
              url: "/4DACTION/_light_setParameters",
              dataType: "json",
              type: "POST",
              data: {
                ppm: ppmtax
              }
            }).done(function (data) {

              toastr.success('Tasa actualizada con exito!');
            });
            var filters = unaBase.getFilters();
            var sortParams = {};

            filters += "&" + jQuery.param(sortParams);
            //----------------

            if (modoFolio===true){
              let url = nodeUrl + "/export-lib-cont-pdf/?download=true&dateto=" + fecha_periodo_to + "&datefrom=" + fecha_periodo_from + "&sid=" + unaBase.sid.encoded() + "&" + filters + "&hostname=" + window.location.origin + "&modoFolio=" + modoFolio + "&folioInicial=" + folioInicial;
              let download = window.open(url);
              download.blur();
              window.focus();}
            else if(modoFolio===false){
              let url = nodeUrl + "/export-lib-cont-pdf/?download=true&dateto=" + fecha_periodo_to + "&datefrom=" + fecha_periodo_from + "&sid=" + unaBase.sid.encoded() + "&" + filters + "&hostname=" + window.location.origin;
              let download = window.open(url);
              download.blur();
              window.focus();
            }
          } else {
            toastr.error("No has seleccionado un periodo");
          }
        });

      }
      /*
       action:  function() {
          let url = nodeUrl + "/balance/?download=true&ids=" + ids.join("|") + "=&sid=" + unaBase.sid.encoded() + "&" + filters + "&hostname=" + window.location.origin;

          let download = window.open(url);
          download.blur();
          window.focus();
      }*/
    });
  }

  if ($.inArray("accounting_lib_cont1", params.buttons) != -1) {
    buttons.push({
      name: "lib_cont",
      icon: "ui-icon-document-b",
      caption: "Papel timbrado",
      action: function () {
        let fecha_periodo_from = "";
        let fecha_periodo_to = "";

        var htmlObject = $(
          `<section> 
          <p style="margin-bottom: 15px;color: black;">Seleccionar periodo:</p>  
              <input id="fecha_balance" type="text">
              <hr class="mt-2 mb-3"/>
              <div class="form-group row">
                <label for="inputEmail3" class="col-sm-2 col-form-label">PPM</label>
                <div class="col-sm-8">
                  <input type="text" class="form-control" id="ppmtax" placeholder="Ingrese la tasa PPM">
                </div>
              </div>
            </section>`
        );

        const now = new Date();

        const firstDay = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        htmlObject.find('input[id="fecha_balance"]').daterangepicker({
          minDate: '01/01/2012',
          startDate: firstDay,
          endDate: lastDay,
          locale: {
            "format": "DD/MM/YYYY",
            "separator": " - ",
            "applyLabel": "Aplicar",
            "cancelLabel": "Cancelar",
            "fromLabel": "From",
            "toLabel": "To",
            "customRangeLabel": "Custom",
            "daysOfWeek": [
              "Do",
              "Lu",
              "Ma",
              "Mi",
              "Ju",
              "Vi",
              "Sa"
            ],
            "monthNames": [
              "Enero",
              "Febrero",
              "Marzo",
              "Abril",
              "Mayo",
              "Junio",
              "Julio",
              "Augosto",
              "Septiembre",
              "Octubre",
              "Noviembre",
              "Diciembre"
            ],
            "firstDay": 1
          }
        }, function (start, end, label) {
          fecha_periodo_from = start.format('DD-MM-YYYY');
          fecha_periodo_to = end.format('DD-MM-YYYY');
          console.log("DATERANGE SET");
        });



        htmlObject.find('#ppmtax').val(unaBase.parametros.ppm)



        prompt(htmlObject).done(function (data) {
          var periodo = data;

          let dateSel = htmlObject.find('input[id="fecha_balance"]')[0].value.split('-').reverse();
          if (dateSel[1] != undefined && dateSel[0] != undefined) {
            fecha_periodo_to = dateSel[0].trim();
            fecha_periodo_from = dateSel[1].trim();
          }
          if (fecha_periodo_to !== "" && fecha_periodo_from !== "") {

            let ppmtax = document.getElementById("ppmtax").value
            $.ajax({
              url: "/4DACTION/_light_setParameters",
              dataType: "json",
              type: "POST",
              data: {
                ppm: ppmtax
              }
            }).done(function (data) {

              toastr.success('Tasa actualizada con exito!');
            });
            var filters = unaBase.getFilters();
            var sortParams = {};

            filters += "&" + jQuery.param(sortParams);
            //----------------

            let url = nodeUrl + "/export-lib-cont/?download=true&dateto=" + fecha_periodo_to + "&datefrom=" + fecha_periodo_from + "&sid=" + unaBase.sid.encoded() + "&" + filters + "&hostname=" + window.location.origin;

            let download = window.open(url);
            download.blur();
            window.focus();
          } else {
            toastr.error("No has seleccionado un periodo");
          }
        });

      }
      /*
       action:  function() {
          let url = nodeUrl + "/balance/?download=true&ids=" + ids.join("|") + "=&sid=" + unaBase.sid.encoded() + "&" + filters + "&hostname=" + window.location.origin;

          let download = window.open(url);
          download.blur();
          window.focus();
      }*/
    });
  }

  if ($.inArray("analysis_by_account", params.buttons) != -1) {
    buttons.push({
      name: "lib_cont",
      icon: "ui-icon-document-b",
      caption: "Mayor con análisis",
      action: function () {
        const contentModal = `
          <div class="container">
              <div class="form-group">
                  <label for="fecha_reporte" class="form-label custom-label">Fecha:</label>
                  <input id="fecha_reporte" type="text" class="form-control form-control-sm mt-2" style="font-size: 10px;">
              </div>
              <div class="form-group">
                  <label for="cuentas_contable" class="form-label custom-label">Cuenta contable:</label>
                  <select class="form-control mt-2" id="cuentas_contable"></select>
              </div>
              <div class="form-group">
                  <label for="cuentas_contable" class="form-label custom-label">Contacto:</label>
                  <select class="form-control mt-2" id="contacto_auxiliar"></select>
              </div>
          </div>`;


        const actionModalCustom = () => {
          let nro_cuenta = document.querySelector('#cuentas_contable').value;
          let fecha_reporte = document.querySelector('#fecha_reporte').value;
          let id_contacto = document.querySelector('#contacto_auxiliar').value;

          if (!nro_cuenta) {
            toastr.error("Debes ingresar una Cuenta");
            return;
          }

          if (!fecha_reporte) {
            toastr.error("Debes ingresar una Fecha");
            return;
          }

          let fechas = fecha_reporte.split(' - ');
          let dateFrom = moment(fechas[0], 'DD/MM/YYYY').toDate();
          let dateTo = moment(fechas[1], 'DD/MM/YYYY').toDate();

          const formatDate = (date) => {
            let day = date.getDate();
            let month = date.getMonth() + 1; // getMonth() devuelve un índice basado en 0
            let year = date.getFullYear();

            // Asegurarse de que el día y el mes tengan dos dígitos
            day = day < 10 ? '0' + day : day;
            month = month < 10 ? '0' + month : month;

            return `${day}-${month}-${year}`;
          }

          // Formatear fechas
          dateFrom = formatDate(dateFrom);
          dateTo = formatDate(dateTo);

          let url = `${nodeUrl}/export-analysis-account/?download=true&date=${fecha_reporte}&sid=${unaBase.sid.encoded()}&hostname=${window.location.origin}&account=${nro_cuenta}&dateto=${dateTo}&datefrom=${dateFrom}&contacto_rut=${id_contacto}`;
          let download = window.open(url);
          download.blur();
          window.focus();
          //closeModalCustom();
        }

        initModalCustomMayorConAnalisis('Mayor con analisis', contentModal, actionModalCustom)

      }

    });
  }


  if ($.inArray("auxiliar_report", params.buttons) != -1) {
    if (accountingMode) {

      buttons.push({
        name: "lib_cont",
        icon: "ui-icon-document-b",
        caption: "Reporte auxiliar",
        action: function () {
          const contentModal = `
          <div class="container">
              <div class="form-group">
                  <label for="fecha_reporte" class="form-label custom-label">Fecha:</label>
                  <input id="fecha_reporte" type="text" class="form-control form-control-sm mt-2" style="font-size: 10px;">
              </div>
              <div class="form-group">
                  <label for="cuentas_contable" class="form-label custom-label">Cuenta contable:</label>
                  <select class="form-control mt-2" id="cuentas_contable"></select>
              </div>
              <div class="form-group">
                  <label for="cuentas_contable" class="form-label custom-label">Contacto:</label>
                  <select class="form-control mt-2" id="contacto_auxiliar"></select>
              </div>
          </div>`;


          const actionModalCustom = () => {
            let nro_cuenta = document.querySelector('#cuentas_contable').value;
            let fecha_reporte = document.querySelector('#fecha_reporte').value;
            let id_contacto = document.querySelector('#contacto_auxiliar').value;

            if (!nro_cuenta) {
              toastr.error("Debes ingresar una Cuenta");
              return;
            }

            if (!fecha_reporte) {
              toastr.error("Debes ingresar una Fecha");
              return;
            }

            let fechas = fecha_reporte.split(' - ');
            let dateFrom = moment(fechas[0], 'DD/MM/YYYY').toDate();
            let dateTo = moment(fechas[1], 'DD/MM/YYYY').toDate();

            const formatDate = (date) => {
              let day = date.getDate();
              let month = date.getMonth() + 1; // getMonth() devuelve un índice basado en 0
              let year = date.getFullYear();

              // Asegurarse de que el día y el mes tengan dos dígitos
              day = day < 10 ? '0' + day : day;
              month = month < 10 ? '0' + month : month;

              return `${day}-${month}-${year}`;
            }

            // Formatear fechas
            dateFrom = formatDate(dateFrom);
            dateTo = formatDate(dateTo);

            let url = `${nodeUrl}/export-auxiliar-report/?download=true&date=${fecha_reporte}&sid=${unaBase.sid.encoded()}&hostname=${window.location.origin}&account=${nro_cuenta}&dateto=${dateTo}&datefrom=${dateFrom}&id_contacto=${id_contacto}`;
            let download = window.open(url);
            download.blur();
            window.focus();
            //closeModalCustom();
          }

          initModalCustom('Reporte auxiliar', contentModal, actionModalCustom)

        }

      });
    }
  }

  if ($.inArray("new_without_template", params.buttons) != -1)
    buttons.push({
      name: "new_without_template",
      icon: "ui-icon-document",
      caption: "No utilizar plantilla",
      action: function () {
        var element = this;
        var is_presupuesto = $(".dialog table").data("presupuesto");
        $.ajax({
          url: "/4DACTION/_V3_setCotizacion",
          dataType: "json",
          type: "POST",
          data: {
            presupuesto: is_presupuesto
          },
          async: false
        }).done(function (data) {
          $(element)
            .parentTo(".ui-dialog-content")
            .dialog("close");
          if (typeof is_presupuesto != "undefined") {
            unaBase.loadInto.viewport(
              "/v3/views/presupuestos/content.shtml?id=" + data.id
            );
          } else {
            unaBase.loadInto.viewport(
              "/v3/views/cotizaciones/content.shtml?id=" + data.id
            );
          }
        });
      }
    });
  if ($.inArray("new_budget", params.buttons) != -1)
    buttons.push({
      name: "new_budget",
      icon: "ui-icon-document",
      caption: "Crear",
      action: function () {
        var element = this;
        var is_presupuesto =
          document.querySelector("li.active").dataset.name ==
          "presupuestos";
        $.ajax({
          url: "/4DACTION/_V3_setCotizacion",
          dataType: "json",
          type: "POST",
          data: {
            presupuesto: is_presupuesto
          },
          async: false
        }).done(function (data) {
          // $(element).parentTo('.ui-dialog-content').dialog('close');
          if (typeof is_presupuesto != "undefined") {
            unaBase.loadInto.viewport(
              "/v3/views/presupuestos/content.shtml?id=" + data.id
            );
          } else {
            unaBase.loadInto.viewport(
              "/v3/views/cotizaciones/content.shtml?id=" + data.id
            );
          }
        });
      }
    });
  if ($.inArray("ultimate_val", params.buttons) != -1) {
    if (params.entity == "Cotizacion") {
      buttons.push({
        name: "ultimate_val",
        icon: "ui-icon-check",
        caption: "Validar Cotizacion",
        action: function () {
          if (access._645) {
            $.ajax({
              url: "/4DACTION/_V3_getLogValidacionByIndex",
              data: {
                index: "Cotizacion|" + $("section.sheet").data("id")
              },
              dataType: "json",
              success: function (data) {
                console.log(data);
                let lineTxt = "";
                let motives = [];

                data.rows.forEach(line => {
                  if (motives.indexOf(line.motivo) === -1) {
                    motives.push(line.motivo);
                  }
                });

                let msgValidateUltimate = `<section> 
                  <div> 
                  <p style="font-size: 16px !important">La cotización N° ${$("section.sheet").data("id")} será validada con permiso administrativo</p> 
                  </div> 
                </section>`;
                prompt(msgValidateUltimate).done(function (data) {

                  $.ajax({
                    url: "/4DACTION/_V3_ultimateValidate",
                    dataType: "json",
                    type: "POST",
                    data: {
                      id_cotizacion: $("section.sheet").data("id")
                    },
                    async: false
                  }).done(function (data) {


                    // Enviar correo validación aceptada
                    var username = $('section.sheet').data('username');
                    var email = $('section.sheet').data('email');
                    var full_name = $('section.sheet').data('full_name');
                    var current_username = $('html > body.menu.home > aside > div > div > h1').data('username');
                    var record_name = 'Cotizacion';
                    var index = $('section.sheet').data('index');
                    var text = $('input[name="oc[referencia]"]').val();
                    var motivo = "";
                    var usernames = [];
                    var emailContacto = "";
                    const email2 = import("../../script/unabase/email.js?1");
                    emailContacto = $('input[name="contacto[info][email]"]').val();
                    usernames.push(username);
                    for (k in usernames) {
                      $.ajax({
                        url: "/4DACTION/_V3_getUsuario",
                        data: {
                          id: usernames[k]
                        },
                        dataType: "json",
                        async: false,
                        success: function (data) {


                          let current = data.rows[0];
                          let toName = (
                            current.nombres.trim() +
                            " " +
                            current.ap_pat.trim()
                          ).trim();
                          let toEmail = current.email;


                          if (current.allow_email) {


                            var paramsData;
                            var paramsData2;

                            paramsData = {
                              to: usernames[k],
                              toName: toName,
                              userValidator: "",
                              nameValidator: "",
                              emailValidator: "",
                              toEmail: toEmail,
                              template: 'validation_accepted',
                              document: record_name,
                              index: index,
                              title: text,
                              motivo: motivo,
                              extra: undefined,
                              detail_uri: 'cotizaciones/content.shtml',
                              id_item: $('section.sheet').data('id'),
                              attach: true
                            }


                            if (envioCorreoAutomatico) {


                              paramsData = {
                                to: usernames[k],
                                toName: toName,
                                userValidator: "",
                                nameValidator: "",
                                emailValidator: "",
                                toEmail: toEmail,
                                template: 'validation_accepted',
                                document: record_name,
                                index: index,
                                title: text + "/          Ha sido enviada al correo de proveedor : " + emailContacto,
                                motivo: motivo,
                                extra: undefined,
                                detail_uri: 'cotizaciones/content.shtml',
                                id_item: $('section.sheet').data('id'),
                                attach: true
                              }


                              // Correo automatico al contacto al validar
                              paramsData2 = {
                                to: emailContacto,
                                toName: "",
                                userValidator: "",
                                nameValidator: "",
                                emailValidator: "",
                                toEmail: emailContacto,
                                nameContacto: "",
                                emailContacto: emailContacto,
                                template: 'envio_gasto',
                                document: record_name,
                                index: index,
                                title: text,
                                motivo: motivo,
                                extra: undefined,
                                detail_uri: 'cotizaciones/content.shtml',
                                id_item: $('section.sheet').data('id'),
                                attach: true
                              }


                            }




                            email2.then(functions => {
                              functions.notifyRequestValidationOC(paramsData);
                              if (envioCorreoAutomatico) {


                                functions.notifyRequestValidationOC(paramsData2);
                                compras.saveLogsFromWeb({
                                  id: $('section.sheet').data('id'),
                                  folio: index,
                                  descripcion:
                                    "Ha compartido la cotizacion vía email a la dirección: " +
                                    emailContacto,
                                  modulo: "cotizaciones",
                                  descripcion_larga: ""
                                });

                                toastr.success(
                                  sprintf(NOTIFY.get("SUCCESS_EMAIL_SEND"), emailContacto)
                                );

                              }

                            }).then(functions => {

                              unaBase.loadInto.viewport(
                                "/v3/views/cotizaciones/content.shtml?id=" + $('section.sheet').data('id')
                              );
                            });



                          }
                        }

                      });

                    }

                  });
                });
              }
            });

          }
        }
      });
    } else {
      buttons.push({
        name: "ultimate_val",
        icon: "ui-icon-check",
        caption: "Validar Gasto",
        action: function () {
          if (access._645) {
            $.ajax({
              url: "/4DACTION/_V3_getLogValidacionByIndex",
              data: {
                index: "Orden_de_compra|" + $("section.sheet").data("id")
              },
              dataType: "json",
              success: function (data) {
                console.log(data);
                let lineTxt = "";
                let motives = [];

                data.rows.forEach(line => {
                  if (motives.indexOf(line.motivo) === -1) {
                    motives.push(line.motivo);
                  }
                });

                motives.forEach(line => {
                  lineTxt += `<li><span style="font-weight: 600 !important; font-size: inherit !important; display: block;">${line}</span></li>`;
                });
                let msgValidateUltimate = `'<section> 
                  <div> 
                  <p style="font-size: 16px !important">El gasto ${$(
                  "span#index"
                ).text()} sera validado por los siguientes criterios:</p> 
                  <br/>
                  <ul style="list-style-type: none; list-style-position: outside; margin-left:10px; line-height: 20px;">
                    ${lineTxt}
                  </ul> 
                  </div> 
                </section>`;
                prompt(msgValidateUltimate).done(function (data) {
                  $.ajax({
                    url: "/4DACTION/_V3_ultimateValidate",
                    dataType: "json",
                    type: "POST",
                    data: {
                      id: $("section.sheet").data("id")
                    },
                    async: false
                  }).done(function (data) {


                    // Enviar correo validación aceptada
                    var username = $('section.sheet').data('username');
                    var email = $('section.sheet').data('email');
                    var full_name = $('section.sheet').data('full_name');
                    var current_username = $('html > body.menu.home > aside > div > div > h1').data('username');
                    var record_name = 'Gasto';
                    var index = $('section.sheet').data('index');
                    var text = $('input[name="oc[referencia]"]').val();
                    var motivo = "";
                    var usernames = [];
                    var emailContacto = "";
                    const email2 = import("../../script/unabase/email.js?1");
                    emailContacto = $('input[name="contacto[info][email]"]').val();
                    usernames.push(username);
                    for (k in usernames) {

                      if (compras.tipoGasto == "OC") {
                        record_name = "Orden de Compra"
                      } else {
                        record_name = "Rendición de fondos"
                      }

                      $.ajax({
                        url: "/4DACTION/_V3_getUsuario",
                        data: {
                          id: usernames[k]
                        },
                        dataType: "json",
                        async: false,
                        success: function (data) {


                          let current = data.rows[0];
                          let toName = (
                            current.nombres.trim() +
                            " " +
                            current.ap_pat.trim()
                          ).trim();
                          let toEmail = current.email;


                          if (current.allow_email) {


                            var paramsData;
                            var paramsData2;




                            paramsData = {
                              to: usernames[k],
                              toName: toName,
                              userValidator: "",
                              nameValidator: "",
                              emailValidator: "",
                              toEmail: toEmail,
                              template: 'validation_accepted',
                              document: record_name,
                              index: index,
                              title: text,
                              motivo: motivo,
                              extra: undefined,
                              detail_uri: 'compras/content.shtml',
                              id_item: $('section.sheet').data('id') || compras.id,
                              attach: true
                            }


                            if (envioCorreoAutomatico) {


                              paramsData = {
                                to: usernames[k],
                                toName: toName,
                                userValidator: "",
                                nameValidator: "",
                                emailValidator: "",
                                toEmail: toEmail,
                                template: 'validation_accepted',
                                document: record_name,
                                index: index,
                                title: text + "/          Ha sido enviada al correo de proveedor : " + emailContacto,
                                motivo: motivo,
                                extra: undefined,
                                detail_uri: 'compras/content.shtml',
                                id_item: $('section.sheet').data('id') || compras.id,
                                attach: true
                              }


                              // Correo automatico al contacto al validar
                              paramsData2 = {
                                to: emailContacto,
                                toName: "",
                                userValidator: "",
                                nameValidator: "",
                                emailValidator: "",
                                toEmail: emailContacto,
                                nameContacto: "",
                                emailContacto: emailContacto,
                                template: 'envio_gasto',
                                document: record_name,
                                index: index,
                                title: text,
                                motivo: motivo,
                                extra: undefined,
                                detail_uri: 'compras/content.shtml',
                                id_item: $('section.sheet').data('id') || compras.id,
                                attach: true
                              }


                            }




                            email2.then(functions => {
                              functions.notifyRequestValidationOC(paramsData);
                              if (envioCorreoAutomatico) {


                                functions.notifyRequestValidationOC(paramsData2);
                                compras.saveLogsFromWeb({
                                  id: $('section.sheet').data('id') || compras.id,
                                  folio: index,
                                  descripcion:
                                    "Ha compartido el gasto vía email a la dirección: " +
                                    emailContacto,
                                  modulo: "gastos",
                                  descripcion_larga: ""
                                });

                                toastr.success(
                                  sprintf(NOTIFY.get("SUCCESS_EMAIL_SEND"), emailContacto)
                                );

                              }

                            }).then(functions => {

                              unaBase.loadInto.viewport(
                                "/v3/views/compras/content.shtml?id=" + compras.id
                              );
                            });



                          }
                        }

                      });

                    }

                  });
                });
              }
            });

          }
        }
      });
    }
  }



  if ($.inArray("saveUser", params.buttons) != -1)
    buttons.push({
      name: "saveUser",
      icon: "ui-icon-disk",
      caption: "Guardar",
      action: function () {

        $.ajax({
          url: "/4DACTION/_V3_setUsuario",
          type: "POST",
          dataType: "json",
          data: {
            id: currentUser.username,
            "perfil[nombres]": $('input[name="perfil[nombres]"]').val(),
            "perfil[vResults]": parseInt(
              $('input[name="perfil[vResults]"]').val()
            ),
            "perfil[apellido][paterno]": $(
              'input[name="perfil[apellido][paterno]"]'
            ).val(),
            "perfil[apellido][materno]": $(
              'input[name="perfil[apellido][materno]"]'
            ).val(),
            "perfil[email]": $('input[name="perfilperfil[email]"]').val(),
            "perfil[allow-email]": document.querySelector(
              'input[name="perfil[allow-email]"]'
            ).checked,
            "perfil[searchOff]": document.querySelector(
              'input[name="perfil[searchOff]"]'
            ).checked
          },
          async: false // para poder hacer el save correctamente y esperar la respuesta
        }).done(function (data) {
          vResults = parseInt($('input[name="perfil[vResults]"]').val());
          if (data.success && data.pass) {
            toastr.success(NOTIFY.get("SUCCESS_SAVE"));
          } else {
            toastr.error(NOTIFY.get("ERROR_RECORD_READONLY", "Error"));
          }
          unaBase.ui.unblock();
        });
      }
    });
  if ($.inArray("nodeRestart", params.buttons) != -1)
    buttons.push({
      name: "nodeRestart",
      icon: "ui-icon-refresh",
      caption: "Reiniciar nodeServer",
      action: function () {
        unaBase.node
          .quickRestart(true)
          .then(res => { })
          .catch(err => { });
        // unaBase.node
        //   .check()
        //   .then(res => {
        //     unaBase.node.state("on");
        //   })
        //   .catch(err => {
        //     unaBase.node.state("off");
        //     unaBase.node
        //       .quickRestart(true, true, true)
        //       .then(res => {})
        //       .catch(err => {});
        //     const nodeRestartBtn = document.querySelector(
        //       'li[data-name="nodeRestart"] button'
        //     );
        //     nodeRestartBtn.disabled = true;
        //     nodeRestartBtn.style.cursor = "inherit";
        //     nodeRestartBtn.querySelector(
        //       ".ui-icon-refresh"
        //     ).style.display = "none";
        //     setTimeout(() => {
        //       nodeRestartBtn.disabled = false;
        //       nodeRestartBtn.style.cursor = "pointer";
        //       nodeRestartBtn.querySelector(
        //         ".ui-icon-refresh"
        //       ).style.display = "";
        //     }, 15000);
        //   });
      }
    });
  if ($.inArray("nodeStart", params.buttons) != -1) {

    if (access[params.buttonAccess.nodeStart]) {
      buttons.push({
        name: "nodeStart",
        icon: "ui-icon-play",
        caption: "Iniciar nodeServer",
        action: function () {
          unaBase.node.start(true, false, true);


          const nodeStartBtn = document.querySelector(
            'li[data-name="nodeStart"] button'
          );
          nodeStartBtn.disabled = true;
          nodeStartBtn.style.cursor = "inherit";
          nodeStartBtn.querySelector(
            ".ui-icon-play"
          ).style.display = "none";
          setTimeout(() => {
            nodeStartBtn.disabled = false;
            nodeStartBtn.style.cursor = "pointer"; nodeStartBtn.querySelector(
              ".ui-icon-play"
            ).style.display = "";
          }, 15000);
        }
      });

    }

  }
  // change password
  if ($.inArray("changePassword", params.buttons) != -1)
    buttons.push({
      name: "changePassword",
      icon: "ui-icon-locked",
      caption: "Cambiar contraseña",
      action: function () {
        if (params.validate()) {
          $.ajax({
            url: "/4DACTION/_V3_set" + params.entity,
            type: "POST",
            dataType: "json",
            data: params.data(),
            async: false // para poder hacer el save correctamente y esperar la respuesta
          }).done(function (data) {
            if (data.success && data.pass) {
              toastr.success(NOTIFY.get("SUCCESS_SAVE"));
              $('input[name="perfil[password_actual]"]').val("");
              $('input[name="perfil[password_nueva]"]').val("");
              $('input[name="perfil[password_confirmacion]"]').val("");
              $('.ui-dialog button[title="close"]').trigger("click");
            } else {
              if (!data.pass) {
                toastr.error(
                  NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                );
                toastr.error("La contraseña ingresada es incorrecta.");
                $('input[name="perfil[password_actual]"]')
                  .val("")
                  .focus();
                $('input[name="perfil[password_nueva]"]').val("");
                $('input[name="perfil[password_confirmacion]"]').val("");
              } else {
                toastr.error(NOTIFY.get("ERROR_INTERNAL"));
              }
            }
            unaBase.ui.unblock();
          });
        } else {
          toastr.error(
            "Es necesario completar la información requerida antes de guardar.",
            "Faltan datos"
          );
          unaBase.ui.unblock();
        }
      }
    });

  if ($.inArray("save", params.buttons) != -1)
    buttons.push({
      name: "save",
      icon: "ui-icon-disk",
      caption: "Guardar",
      action: function (event) {

        // alert(params.entity);
        var elementCobro = $(this);
        var eventData = event;




        unaBase.ui.block();

        generalSaveAction(elementCobro, eventData, event, params)
          .then(res => {

            unaBase.ui.unblock();
            return { success: true };
          }).catch(err => {
            toastr.error('No se pudo guardar, favor guardar nuevamente o  contactar a soporte.')
          });


      }
    });



  if ($.inArray("refresh", params.buttons) != -1)
    buttons.push({
      name: "refresh",
      icon: "ui-icon-refresh",
      caption: "Recargar",
      action: function (event) {
        // $('li[data-name=save] button').trigger('click');
        confirm(
          "¿Deseas recargar el formulario para ver los últimos datos, podrías perder información no guardada de los últimos cambios ?"
        ).done(function (data) {
          if (data) {
            unblockCot();
            var location = unaBase.history.current();
            unaBase.loadInto.viewport(
              location.url,
              location.standalone,
              undefined,
              true
            );
          }
        });
      }
    });

  if ($.inArray("offline_mode", params.buttons) != -1)
    buttons.push({
      name: "offline_mode",
      icon: "ui-icon-suitcase",
      caption: "Modo rápido",
      action: function () {
        if (!modoOffline) {
          confirm(
            "¿Deseas habilitar el modo offline para agilizar el proceso de cotizar?",
            "Sí",
            "No"
          ).done(function (data) {
            if (data) {
              modoOffline = true;
              $('#menu [data-name="offline_mode"]').addClass("active");
            }
          });
        } else {
          modoOffline = false;
          $('#menu [data-name="offline_mode"]').removeClass("active");
        }
      }
    });

  if ($.inArray("save_and_create", params.buttons) != -1)
    buttons.push({
      name: "save_and_create",
      icon: "ui-icon-disk",
      caption: "Guardar y agregar",
      action: function () {
        var callback = function () {

          $.ajax({
            url: "/4DACTION/_V3_setCompras",
            dataType: "json",
            type: "POST",
            data: {
              create_from: "OC"
            }
          }).done(function (data) {
            unaBase.loadInto.viewport(
              "/v3/views/compras/content.shtml?id=" + data.id
            );
          });
        };
        saveAction(callback, params)

      }
    });

  if ($.inArray("views_basico", params.buttons) != -1)
    buttons.push({
      name: "views",
      icon: "ui-icon-transferthick-e-w",
      caption: "Vista admin",
      action: function () {
        unaBase.loadInto.viewport("/v3/views/compras/list_admin.shtml");
      }
    });

  if ($.inArray("views_admin", params.buttons) != -1)
    buttons.push({
      name: "views",
      icon: "ui-icon-transferthick-e-w",
      caption: "Vista básica",
      action: function () {
        unaBase.loadInto.viewport("/v3/views/compras/list_basico.shtml");
      }
    });

  if ($.inArray("update", params.buttons) != -1)
    buttons.push({
      name: "update",
      icon: "ui-icon-refresh",
      caption: "Refrescar",
      action: function () {
        var id = $(".sheet").data("id");
        switch (params.entity) {
          case "Compras":
            unaBase.loadInto.viewport(
              "/v3/views/compras/content.shtml?id=" + id + "&from=self"
            );
            break;
          case "Dtc":
            //unaBase.loadInto.viewport('/v3/views/dtc/content.shtml?id=' + id+'&registrado=si&from=self');
            unaBase.loadInto.viewport(
              "/v3/views/dtc/content.shtml?id=" + id
            );
            break;
        }
      }
    });

  if ($.inArray("itemsoc_volver_proyectos", params.buttons) != -1)
    buttons.push({
      name: "itemsoc_volver_proyectos",
      icon: "ui-icon-arrowthick-1-w",
      caption: "Negocios",
      action: function () {
        $(".ui-dialog-titlebar .ui-dialog-title").text(
          "SELECCIONAR NEGOCIOS"
        );
        var container = $(
          "#buscar-proyectos-compras > .dynamic-container"
        );
        container.find("*").remove();
        get_proyectos_compras("load");
        $(".ui-dialog")
          .find("header")
          .hide();
      }
    });

  if ($.inArray("itemsoc_volver_proyectos2", params.buttons) != -1)
    buttons.push({
      name: "itemsoc_volver_proyectos2",
      icon: "ui-icon-arrowthick-1-w",
      caption: "Negocios",
      action: function () {
        var id = $(".sheet-gastos").data("id");
        var from = $("#sheet-items_proyect-select").data("from");
        unaBase.loadInto.dialog(
          "/v3/views/compras/proyectos2.shtml?id=" + id + "&from=" + from,
          "SELECCIONAR NEGOCIO",
          "large"
        );
      }
    });

  if ($.inArray("itemsoc_volver_presupuestos2", params.buttons) != -1)
    buttons.push({
      name: "itemsoc_volver_presupuestos2",
      icon: "ui-icon-arrowthick-1-w",
      caption: "Negocios",
      action: function () {
        var id = $(".sheet-gastos").data("id");
        var from = $("#sheet-items_proyect-select").data("from");
        unaBase.loadInto.dialog(
          "/v3/views/compras/presupuestos2.shtml?id=" +
          id +
          "&from=" +
          from,
          "SELECCIONAR PRESUPUESTO",
          "large"
        );
      }
    });

  if ($.inArray("move_items_oc", params.buttons) != -1)
    buttons.push({
      name: "move_items_oc",
      icon: "ui-icon-arrowthick-1-w",
      caption: "Negocios",
      action: function () {
        var id = $(".sheet-gastos").data("id");
        var from = $("#sheet-items_proyect-select").data("from");
        unaBase.loadInto.dialog(
          "/v3/views/compras/proyectos2.shtml?id=" + id + "&from=" + from,
          "SELECCIONAR NEGOCIO",
          "large"
        );
      }
    });

  // Contact
  if ($.inArray("new_contact", params.buttons) != -1)
    buttons.push({
      name: "new_contact",
      icon: "ui-icon-document",
      caption: "Crear",
      action: function () {
        var id = 0;
        unaBase.loadInto.dialog(
          "/v3/views/contactos/content.shtml?id=" + id,
          "Perfil",
          "xx-large"
        );
      }
    });

  if ($.inArray("export_template_contact", params.buttons) != -1)
    buttons.push({
      name: "export_template_contact",
      icon: "ui-icon-arrowthickstop-1-s",
      caption: "Importador de contactos",
      action: function () {
        if (typeof window.showModalImportadorContactos === "function") {
          window.showModalImportadorContactos();
        } else {
          var modal = document.getElementById("modalImportadorContactos");
          if (modal) {
            modal.style.display = "block";
          } else {
            toastr.warning("No se encontró el modal importador.");
          }
        }
      }
    });

  // Box
  if ($.inArray("new_box", params.buttons) != -1)
    buttons.push({
      name: "new_box",
      icon: "ui-icon-document",
      caption: "Crear",
      action: function () {
        var id = 0;
        unaBase.loadInto.dialog(
          "/v3/views/box/content.shtml?id=" + id,
          "Perfil",
          "xx-large"
        );
      }
    });

  if ($.inArray("disable_from_list", params.buttons) != -1)
    buttons.push({
      name: "disable_from_list",
      icon: "ui-icon-locked",
      caption: "Desactivar",
      action: function () {
        var itemsSelected = $(
          ".credencial > tbody > tr > td > div.chk > input:checked"
        );
        var amount = itemsSelected.length;
        switch (params.entity) {
          case "Producto":
            if (amount == 1) {
              var msg = "¿Quieres desactivar el servicio seleccionado?";
            } else {
              var msg =
                "¿Quieres desactivar los servicios seleccionados?";
            }
            confirm(msg).done(function (data) {
              if (data) {
                var cant = 0;
                itemsSelected.each(function (key, item) {
                  $.ajax({
                    url: "/4DACTION/_V3_setProducto",
                    dataType: "json",
                    type: "POST",
                    async: false,
                    data: {
                      id: $(this).val(),
                      "producto[estado]": "false"
                    }
                  }).done(function (data) {
                    if (data.success) {
                      cant++;
                    }
                    if (cant == amount) {
                      if (amount == 1) {
                        toastr.success(
                          "Servicio desactivado correctamente."
                        );
                      } else {
                        toastr.success(
                          "Servicios desactivados correctamente."
                        );
                      }
                      setTimeout(function () {
                        unaBase.loadInto.viewport(
                          "/v3/views/catalogo/index.shtml"
                        );
                      }, 200);
                    }
                  });
                });
              }
            });
            break;
          case "Contacto":
            if (amount == 1) {
              var msg = "¿Quieres desactivar el contacto seleccionado?";
            } else {
              var msg =
                "¿Quieres desactivar los contactos seleccionados?";
            }
            confirm(msg).done(function (data) {
              if (data) {
                var cant = 0;
                itemsSelected.each(function (key, item) {
                  $.ajax({
                    url: "/4DACTION/_V3_setContacto",
                    dataType: "json",
                    type: "POST",
                    async: false,
                    data: {
                      id: $(this).val(),
                      "contact[estado]": "false"
                    }
                  }).done(function (data) {
                    if (data.success) {
                      cant++;
                    }
                    if (cant == amount) {
                      if (amount == 1) {
                        toastr.success(
                          "Contacto desactivado correctamente."
                        );
                      } else {
                        toastr.success(
                          "Contactos desactivados correctamente."
                        );
                      }
                      setTimeout(function () {
                        unaBase.loadInto.viewport(
                          "/v3/views/contactos/index.shtml"
                        );
                      }, 200);
                    }
                  });
                });
              }
            });
            break;
        }
      }
    });

  if ($.inArray("merge_contact", params.buttons) != -1)
    buttons.push({
      name: "merge_contact",
      icon: "ui-icon-transferthick-e-w",
      caption: "Fusionar",
      action: function () {
        alert("coming soon!");
      }
    });

  if ($.inArray("merge", params.buttons) != -1)
    buttons.push({
      name: "merge",
      icon: "ui-icon-transferthick-e-w",
      caption: "Fusionar",
      action: function () {
        unaBase.loadInto.dialog(
          "/v3/views/catalogo/merge.shtml",
          "Fusionar ítems del catálogo",
          "large"
        );
      }
    });

  if ($.inArray("merge_report", params.buttons) != -1)
    buttons.push({
      name: "merge_report",
      icon: "ui-icon-transferthick-e-w",
      caption: "Fusionar",
      action: function () {
        unaBase.loadInto.dialog(
          "/v3/views/catalogo/merge.shtml",
          "Fusionar ítems del catálogo",
          "large"
        );
      }
    });

  if ($.inArray("tag_contact", params.buttons) != -1)
    buttons.push({
      name: "tag_contact",
      icons: {
        primary: "ui-icon-tag",
        secondary: "ui-icon-triangle-1-s"
      },
      caption: "Etiquetar",
      action: function () {
        $(this).tooltipster({
          content: function () {
            var styles = {
              width: "300px",
              backgroundColor: "white"
            };
            var htmlObject = $("<div>");
            htmlObject.css(styles);
            htmlObject.load("/v3/views/contactos/etiquetar.shtml");
            return htmlObject;
          },
          interactive: true,
          trigger: "",
          delay: 0,
          theme: "tooltipster-custom-theme",
          interactiveAutoClose: true
        });
        $(this).tooltipster("show");
      }
    });

  if ($.inArray("tag", params.buttons) != -1)
    buttons.push({
      name: "tag",
      icons: {
        primary: "ui-icon-tag",
        secondary: "ui-icon-triangle-1-s"
      },
      caption: "Etiquetar",
      action: function () {
        $(this).tooltipster({
          content: function () {
            var styles = {
              width: "150px",
              backgroundColor: "white"
            };
            var htmlObject = $("<div>");
            htmlObject.css(styles);
            htmlObject.load("/v3/views/catalogo/etiquetar.shtml");
            return htmlObject;
          },
          interactive: true,
          trigger: "",
          delay: 0,
          theme: "tooltipster-custom-theme",
          interactiveAutoClose: true
        });
        $(this).tooltipster("show");
      }
    });

  if ($.inArray("itemsoc_agregar_items", params.buttons) != -1)
    buttons.push({
      name: "itemsoc_agregar_items",
      icon: "ui-icon-plus",
      caption: "Agregar selección",
      action: function () {
        var id = $.unserialize(params.data()).id;
        var target = $(this);
        var selected = false;
        $.each($.unserialize(params.data()), function (key, item) {
          if (key.match(/detalle\[check_item\](.*)/i)) {
            selected = true;
          }
        });
        if (selected) {
          var bodyCompras = $("#sheet-compras table > tbody");
          var titles = bodyCompras.find('tr[data-tipo="TITULO"]');
          var cantTitulos = titles.length;
          var correlativo = bodyCompras.find("tr").length;
          var idDtc = $(
            '#sheet-compras input[name="tipo_doc[id]"]'
          ).val();
          var objNamesTitles = {};
          titles.each(function (key, item) {
            var name = $(this)
              .find('input[name="oc[detalle_item][nombre]"]')
              .val();
            var llave = $(this)
              .find('input[name="oc[detalle_item][llave]"]')
              .val();
            var gastar = $(this)
              .find('input[name="oc[detalle_item][llave]"]')
              .val();
            var string = "]" + name + "]" + llave + "]";
            eval(
              "obj = {'oc[detalle_item][titulos]" +
              key +
              "': '" +
              string +
              "'}"
            );
            $.extend(objNamesTitles, objNamesTitles, obj);
          });
          var obj = {
            "oc[rows][id_oc]": 0,
            "oc[rows][id_nv]": 0,
            "oc[rows][origen]": "PROYECTO",
            "oc[rows][tipo]": "AMBOS",
            "oc[rows][cant_titulos]": cantTitulos,
            "oc[rows][correlativo]": correlativo,
            "oc[rows][tipo_doc][id]": idDtc,
            "oc[from]": "agregar_item"
          };
          var objFinal = $.extend(
            {},
            obj,
            $.unserialize(params.data()),
            objNamesTitles
          );
          $.ajax({
            url: "/4DACTION/_v3_get_rows_compras",
            data: objFinal,
            dataType: "json",
            success: function (data) {
              $(target)
                .parentTo(".ui-dialog-content")
                .dialog("close");


              add_items_oc(data);
              set_referencia_oc();
            }
          });
        } else {
          toastr.warning(NOTIFY.get("WARNING_ITEM_SELECTION"));
        }
      }
    });



  if ($.inArray("itemsoc_agregar_items2", params.buttons) != -1)
    buttons.push({
      name: "itemsoc_agregar_items2",
      icon: "ui-icon-plus",
      caption: "Agregar selección",
      action: function () {

        var target = $(this);
        var container = $("#sheet-compras");
        var containerItem = $("#sheet-items_proyect-select");
        var body = container.find("table.items > tbody");
        var id = container.data("id");
        var idnv = containerItem.data("idnv");
        var from = containerItem.data("from").toUpperCase();

        var selected = false;
        $.each($.unserialize(params.data()), function (key, item) {
          if (key.match(/detalle\[check_item\](.*)/i) || key.match(/detalle\[check_titulo\](.*)/i)) {
            selected = true;
          }
        });
        if (selected) {
          var titles = body.find('tr[data-tipo="TITULO"]');
          var cantTitulos = titles.length;
          var correlativo = body.find("tr").length;
          var idDtc = container.find('input[name="tipo_doc[id]"]').val();
          var objNamesTitles = {};
          titles.each(function (key, item) {
            if (from == "OC") {
              var name = $(this).find('input[name="oc[detalle_item][nombre]"]').val();

              var llave = $(this).find('input[name="oc[detalle_item][llave]"]').val();


              var string = "]" + name + "]" + llave + "]";
              eval(
                "obj = {'oc[detalle_item][titulos]" +
                key +
                "': '" +
                string +
                "'}"
              );

            } else {
              var name = $(this)
                .find('input[name="dtc[detalle_item][nombre]"]')
                .val();

              var llave = $(this)
                .find('input[name="dtc[detalle_item][llave]"]')
                .val();

              var string = "]" + name + "]" + llave + "]";
              eval(
                "obj = {'dtc[detalle_item][titulos]" +
                key +
                "': '" +
                string +
                "'}"
              );
            }
            $.extend(objNamesTitles, objNamesTitles, obj);
          });
          var obj = {
            "oc[rows][id_oc]": id,
            "oc[rows][id_dtc]": id,
            "oc[rows][id_nv]": idnv,
            "oc[rows][origen]": "PROYECTO",
            "oc[rows][tipo]": "AMBOS",
            "oc[rows][cant_titulos]": cantTitulos,
            "oc[rows][correlativo]": correlativo,
            "oc[rows][tipo_doc][id]": idDtc,
            "oc[from]": "agregar_item"
          };


          var objFinal = $.extend(
            {},
            obj,
            $.unserialize(params.data()),
            objNamesTitles
          );
          if (from == "OC") {
            var url = "_v3_get_rows_compras";
          } else {
            var url = "_v3_get_rows_dtc";
          }


          let config = {
            method: 'post',
            url: nodeUrl + "/getrowscompras?hostname=" + window.location.origin,
            data: objFinal,
          };

          axios(config)
            .then(function (data) {

              $(target)
                .parentTo(".ui-dialog-content")
                .dialog("close");
              if (from == "OC") {


                add_items_oc(data.data);
                set_referencia_oc();
              } else {
                add_items_dtc(data.data);
              }

            })
            .catch(function (error) {

              console.log(error);
            });
        } else {
          toastr.warning(NOTIFY.get("WARNING_ITEM_SELECTION"));
        }
      }
    });

  if ($.inArray("itemsoc_otros_gastos2", params.buttons) != -1)
    buttons.push({
      name: "itemsoc_otros_gastos2",
      icon: "ui-icon-document-b",
      caption: "Otros gastos",
      action: function () {
        var containerItem = $("#sheet-items_proyect-select");
        var container = $("#sheet-compras");
        var idnv = containerItem.data("idnv");
        var from = containerItem.data("from").toUpperCase();
        var id = container.data("id");
        var cantTitulos = container.find(
          'table.items > tbody > tr[data-tipo="TITULO"]'
        ).length;
        var correlativo = container.find("table.items > tbody > tr")
          .length;
        var idDtc = container.find('input[name="tipo_doc[id]"]').val();
        if (from == "OC") {
          var url = "_v3_get_rows_compras";
        } else {
          var url = "_v3_get_rows_dtc";
        }
        $.ajax({
          url: "/4DACTION/" + url,
          data: {
            "oc[rows][id_oc]": id,
            "oc[rows][id_dtc]": id,
            "oc[rows][id_nv]": idnv,
            "oc[rows][origen]": "PROYECTO",
            "oc[rows][tipo]": "OTROS GASTOS",
            "oc[rows][cant_titulos]": cantTitulos,
            "oc[rows][correlativo]": correlativo,
            "oc[rows][tipo_doc][id]": idDtc,
            "oc[from]": "agregar_item"
          },
          dataType: "json",
          success: function (data) {
            $(containerItem)
              .parentTo(".ui-dialog-content")
              .dialog("close");
            if (from == "OC") {
              add_items_oc(data);
              set_referencia_oc();
            } else {
              add_items_dtc(data);
            }
          }
        });
      }
    });

  if ($.inArray("itemsoc_otros_gastos", params.buttons) != -1)
    buttons.push({
      name: "itemsoc_otros_gastos",
      icon: "ui-icon-document-b",
      caption: "Otros gastos",
      action: function () {
        var target = $("#buscar-proyectos-compras");
        var id_proyecto = target
          .find('input[name="oc[negocio][id]"][type="hidden"]')
          .val();
        var id_oc = target
          .find('input[name="oc[id]"][type="hidden"]')
          .val();
        var cantTitulos = $(
          '#sheet-compras table > tbody > tr[data-tipo="TITULO"]'
        ).length;
        var correlativo = $("#sheet-compras table > tbody > tr").length;
        var idDtc = $('#sheet-compras input[name="tipo_doc[id]"]').val();
        $.ajax({
          url: "/4DACTION/_v3_get_rows_compras",
          data: {
            "oc[rows][id_oc]": id_oc,
            "oc[rows][id_nv]": id_proyecto,
            "oc[rows][origen]": "PROYECTO",
            "oc[rows][tipo]": "OTROS GASTOS",
            "oc[rows][cant_titulos]": cantTitulos,
            "oc[rows][correlativo]": correlativo,
            "oc[rows][tipo_doc][id]": idDtc,
            "oc[from]": "agregar_item"
          },
          dataType: "json",
          success: function (data) {
            $(target)
              .parentTo(".ui-dialog-content")
              .dialog("close");
            add_items_oc(data);
          }
        });
      }
    });

  if ($.inArray("create_dtc", params.buttons) != -1)
    buttons.push({
      name: "create_dtc",
      icon: "ui-icon-document",
      caption: "Crear",
      action: function () {
        unaBase.loadInto.dialog(
          "/v3/views/dtc/dialog/compras_disponibles.shtml",
          "SELECCIONAR ÓRDENES DE COMPRA PARA CREAR DTC",
          "x-large"
        );
      }
    });
  if ($.inArray("create_area_negocio", params.buttons) != -1)
    buttons.push({
      name: "create_area_negocio",
      icon: "ui-icon-document",
      caption: "Crear",
      action: function () {
        unaBase.loadInto.viewport(
          "/v3/views/ajustes/area_negocio/content.shtml",
          "Crear area de negocio",
          false
        );
      }
    });

  if ($.inArray("create_impuesto_from_tipodtc", params.buttons) != -1)
    buttons.push({
      name: "create_impuesto_from_tipodtc",
      icon: "ui-icon-document",
      caption: "Crear",
      action: function () {
        impuestos.set("create", "dtc");
      }
    });

  if ($.inArray("send_mail_report", params.buttons) != -1)
    buttons.push({
      name: "send_mail_report",
      icon: "ui-icon-document",
      caption: "Enviar reportes habilitados",
      action: function () {
        $.ajax({
          url: "/4DACTION/_V3_Envia_email_reportes",
          dataType: "json",
          type: "POST",
          data: {
            each: false
          }
        }).done(function (data) {
          return false;
        });
      }
    });

  if ($.inArray("send_mail_report_each", params.buttons) != -1)
    buttons.push({
      name: "send_mail_report_each",
      icon: "ui-icon-document",
      caption: "Enviar Reporte",
      action: function () {
        $.ajax({
          url: "/4DACTION/_V3_Envia_email_reportes",
          dataType: "json",
          type: "POST",
          data: {
            reporte_codigo: reportes.data.codigo,
            each: true
          }
        }).done(function (data) {
          return false;
        });
      }
    });

  if ($.inArray("create_dtc_cero", params.buttons) != -1)
    buttons.push({
      name: "create_dtc_cero",
      icon: "ui-icon-document",
      caption: "crear desde cero",
      action: function () {


        var element = this;
        $.ajax({
          url: "/4DACTION/_V3_setDtc",
          dataType: "json",
          type: "POST",
          data: []
        }).done(function (data) {
          $(element)
            .parentTo(".ui-dialog-content")
            .dialog("close");
          unaBase.loadInto.viewport(
            "/v3/views/dtc/content.shtml?id=" + data.id
          );
        });
      }
    });

  if ($.inArray("create_dtv_cero", params.buttons) != -1)
    buttons.push({
      name: "create_dtv_cero",
      icon: "ui-icon-document",
      caption: "No asociar negocios (saltar este paso)",
      action: function () {
        var element = this;
        $.ajax({
          url: "/4DACTION/_V3_setDtv",
          dataType: "json",
          type: "POST",
          data: []
        }).done(function (data) {
          $(element)
            .parentTo(".ui-dialog-content")
            .dialog("close");
          unaBase.loadInto.viewport(
            "/v3/views/dtv/content2.shtml?id=" + data.id
          );
        });
      }
    });

  if ($.inArray("create_oc_desde_preoc", params.buttons) != -1)
    buttons.push({
      name: "create_oc_desde_preoc",
      icon: "ui-icon-document",
      caption: "Crear Orden de compra",
      action: function () {
        crearOCByPre();
      }
    });

  if ($.inArray("create_dtv", params.buttons) != -1)
    buttons.push({
      name: "create_dtv",
      icon: "ui-icon-document",
      caption: "Crear factura",
      action: function () {
        unaBase.loadInto.dialog(
          "/v3/views/dtv/dialog/negocios_disponibles.shtml",
          "Seleccionar negocio(s) a facturar",
          "x-large"
        );
      }
    });

  if ($.inArray("create_dtv_parcial", params.buttons) != -1)
    buttons.push({
      name: "create_dtv_parcial",
      icon: "ui-icon-document",
      caption: "Factura parcial",
      action: function () {
        unaBase.toolbox.search.saveDialog();

        var countExchangeType = 0;
        var previousExchange = currency.code; // por defecto moneda local al principio

        var negocios = [];

        $("#dialog-viewport #negocios-por-facturar table tbody tr td input[type='checkbox']:checked").each(function () {
          const input = $(this);
          if (input.prop('checked')) {
            const value = input.val();
            negocios.push(value);

            let currentExchange = input.closest('tr').data("exchangetype");
            if (currentExchange == '') {
              currentExchange = currency.code;
            }

            if (currentExchange != previousExchange) {
              countExchangeType++;
              previousExchange = input.closest('tr').data("exchangetype");
            }
          }
        }
        );


        if (negocios.length == 0) {
          toastr.warning(
            "Debe seleccionar al menos un negocio para facturar."
          );
          return
        }

        const currencyOptions = `
            <option value="" disabled selected>Seleccione una moneda</option>
            ${unaBase.money.map(currency => `
                <option value="${currency.codigo}">
                    ${currency.nombre} (${currency.codigo})
                </option>
            `).join('')}
        `;


        const contentModal = `
          <div class="container">
              <div class="form-group mt-3">
                  <label for="currency_select" class="form-label custom-label">Moneda:</label>
                  <select id="currency_select" class="form-control form-control-sm mt-2" style="font-size: 10px;">
                      ${currencyOptions}
                  </select>
              </div>
          </div>`;

        if (unaBase.parametros.dialogo_tipo_cambio_facturar) {

          const actionModalCustom = () => {
            let selectedCurrency = document.querySelector('#currency_select').value;

            if (!selectedCurrency) {
              toastr.error("Debes seleccionar una Moneda");
              return;
            }

            if (countExchangeType < 2) {
              if (negocios.length > 0)
                unaBase.loadInto.dialog(
                  "/v3/views/dtv/dialog/factura_parcial.shtml?negocios=" +
                  negocios.join("|") +
                  "Factura parcial",
                  "x-large"
                );
              else
                toastr.warning(
                  "Debe seleccionar al menos un negocio para facturar."
                );
            } else {
              alert(
                "No es posible facturar por más de un tipo de moneda a la vez."
              );
            }

            closeModalCustom();


          }

          initModalCustomCurrency('Moneda', contentModal, actionModalCustom);
        } else {
          if (countExchangeType < 2) {
            if (negocios.length > 0)
              unaBase.loadInto.dialog(
                "/v3/views/dtv/dialog/factura_parcial.shtml?negocios=" +
                negocios.join("|") +
                "Factura parcial",
                "x-large"
              );
            else
              toastr.warning(
                "Debe seleccionar al menos un negocio para facturar."
              );
          } else {
            alert(
              "No es posible facturar por más de un tipo de moneda a la vez."
            );
          }
        }




      }
    });

  if ($.inArray("asociar_banco_a_docs", params.buttons) != -1)
    buttons.push({
      name: "asociar_banco_a_docs",
      icon: "ui-icon-document",
      caption: "Asociar",
      action: function () {
        asociarBanco();
      }
    });

  if ($.inArray("add_nv_to_dtv", params.buttons) != -1)
    buttons.push({
      name: "add_nv_to_dtv",
      icon: "ui-icon-document",
      caption: "Agregar negocio a factura",
      action: function () {
        var negocios = [];
        $("#dialog-viewport #negocios-por-facturar table tbody td").each(
          async function () {
            var value = $(this)
              .find('input[type="checkbox"]:checked')
              .val();
            if (typeof value != "undefined") negocios.push(value);
          }
        );

        if (negocios.length > 0)
          unaBase.loadInto.dialog(
            "/v3/views/dtv/dialog/factura_parcial_express.shtml?negocios=" +
            negocios.join("|"),
            "Factura parcial",
            "x-large"
          );
        else
          toastr.warning(
            "Debe seleccionar al menos un negocio para facturar."
          );
      }
    });

  if ($.inArray("crear_dtc_asociado_oc", params.buttons) != -1)
    buttons.push({
      name: "crear_dtc_asociado_oc",
      icon: "ui-icon-document",
      caption: "Crear",
      action: function () {
        var element = this;
        var objFinal = {};
        var cant = 0;
        var comprasSelected = $(
          "#compras-por-justificar > table > tbody > tr > td > .select:checked"
        );
        var amount = comprasSelected.length;

        var diferentes = false;
        var proveedorAnterior = 0;
        var documentoAnterior = 0;
        let ocHasDtc = false;
        let ocWithDtc = [];
        comprasSelected.each(function (key, item) {
          eval(
            "obj = { 'id_gasto_" +
            $(this).val() +
            "': '" +
            $(this).val() +
            "' }"
          );
          $.extend(objFinal, objFinal, obj);
          cant++;

          var tr = $(this).closest("tr");
          var idproveedor = tr.data("proveedor");
          var iddoc = tr.data("doc");
          var idOC = tr.data("id");
          var hasDtc = tr.data("hasdtc");
          if (hasDtc) {
            ocWithDtc.push(tr.data("number"));
            ocHasDtc = true;
            $(`tr.ocLine[data-id="${idOC}"] input[type="checkbox"]`).prop("checked", false)

          }
          if (cant == 1) {
            proveedorAnterior = idproveedor;
            documentoAnterior = iddoc;
          }
          if (
            proveedorAnterior == idproveedor &&
            documentoAnterior == iddoc
          ) {
            proveedorAnterior = idproveedor;
            documentoAnterior = iddoc;
          } else {
            diferentes = true;
          }
        });
        const createDtc = (objFinal, id) => {
          $.ajax({
            url: "/4DACTION/_V3_setDtc",
            dataType: "json",
            type: "POST",
            async: false,
            data: objFinal
          }).done(function (data) {
            $(element)
              .parentTo(".ui-dialog-content")
              .dialog("close");

            unaBase.loadInto.viewport(
              "/v3/views/dtc/content.shtml?id=" + data.id
            );
          });
        }
        if (amount > 0) {
          if (!diferentes && !ocHasDtc) {
            // $.ajax({
            //   url: "/4DACTION/_V3_setDtc",
            //   dataType: "json",
            //   type: "POST",
            //   async: false,
            //   data: objFinal
            // }).done( function(data) {
            //   $(element)
            //     .parentTo(".ui-dialog-content")
            //     .dialog("close");
            //   unaBase.loadInto.viewport(
            //     "/v3/views/dtc/content.shtml?id=" + data.id
            //   );
            // });
            // createDtc(objFinal, data.id);
            createDtc(objFinal);
          } else if (!ocHasDtc) {
            alert(
              "Las órdenes de compras seleccionadas son de proveedor o documentos distintos."
            );
          } else if (ocHasDtc && amount > 1) {
            alert(
              `Las órdenes de compras ${ocWithDtc.join()} ya poseen facturas asociadas, deben justificarse por separado.`
            );
          } else if (ocHasDtc && amount == 1) {
            // createDtc(objFinal, data.id);
            createDtc(objFinal);
          }
        } else {
          alert("Debe seleccionar al menos una orden de compra.");
        }
      }
    });

  if ($.inArray("anular_oc_masivo", params.buttons) != -1) {
    buttons.push({
      name: "anular_oc_masivo",
      icon: "ui-icon-document",
      caption: "Anular Masivo",
      action: function () {
        // Obtenemos todas las filas seleccionadas
        var comprasSelected = $("table[data-tipogasto='OC'] > tbody > tr > td > input:checked");

        // Verificamos si al menos se ha seleccionado una
        if (comprasSelected.length === 0) {
          alert("Debe seleccionar al menos una orden de compra.");
          return;
        }

        // Recorremos cada checkbox seleccionada
        comprasSelected.each(function () {
          // Obtenemos la fila (tr) que contiene este checkbox
          var tr = $(this).closest("tr");
          // Obtenemos el ID de la OC
          var idOC = tr.data("id");

          // Construimos el objeto de datos que se enviará al servidor
          // La diferencia principal es `oc[id]` que toma el ID de cada fila
          var objFinal = {
            'cotizacion[estado]': false,
            'cotizacion[estado][observaciones]': "Error al emitir",
            'oc[id]': idOC,                // <-- El ID de la OC que cambia
            'oc[anular]': true,
            'oc[anular][observaciones]': "Error al emitir",
            'nullify': true,
            'comment': "Error al emitir"
          };

          // Llamamos al endpoint para anular cada OC
          $.ajax({
            url: "/4DACTION/_V3_setCompras",
            dataType: "json",
            type: "POST",
            async: false, // Ojo: async: false bloqueará la ejecución hasta que termine
            data: objFinal
          }).done(function (data) {
            toastr.success("OC Anulada: " + data.id);
          });
        });
      }
    });
  }



  if ($.inArray("asociar_dtc_pendiente_gasto", params.buttons) != -1)
    buttons.push({
      name: "asociar_dtc_pendiente_gasto",
      icon: "ui-icon-circle-plus",
      caption: "Asociar dtc",
      action: function () {
        unaBase.ui.block();
        var element = this;
        var cant = 0;
        var dtcSelected = $(
          "#dtc-por-justificar > table > tbody > tr > td > .select:checked"
        );
        let err = false;
        var amount = dtcSelected.length;
        var diferentes = false;

        let ids = [];
        dtcSelected.each(function (key, item) {
          var tr = $(this).closest("tr");


          if (tr.find('option:selected').attr('id') == "0" || tr.find('option:selected').attr('id') == "")
            err = true;

          ids.push({
            'iddoc': tr.data("id"),
            'idnegoc': compras.id,
            'llaveitem': tr.find('option:selected').attr('id'),
            'fecha': "",
            'type': "yellow",
            'sid': unaBase.sid.encoded(),
            'fromCompras': true,
            'fromFXR': compras.tipoGasto === 'OC' ? false : true

          });

          cant++;



        });

        var idoc = $("#dtc-por-justificar").data("oc");
        var tipo = $("#dtc-por-justificar").data("tipo");


        if (amount > 0 && !err) {
          if (tipo == "FXR") {
            diferentes = false;
          }

          if (!diferentes) {

            let config = {
              method: 'post',
              url: `${nodeUrl}/set-justify?hostname=${window.location.origin}&type=yellow&sid="${unaBase.sid.encoded()}"`,
              data: ids
            };

            try {
              axios(config)
                .then(data => {
                  if (data.data[0].success) {
                    toastr.success("Asociado con exito!");
                    $(element)
                      .parentTo(".ui-dialog-content")
                      .dialog("close");
                    unaBase.loadInto.viewport(
                      "/v3/views/compras/content.shtml?id=" + idoc,
                      undefined,
                      undefined,
                      true
                    );
                    unaBase.ui.unblock()
                  } else {

                    alert(
                      data.data[0].errorMsg
                    );
                    unaBase.ui.unblock()


                  }
                })
                .catch(err => {
                  unaBase.ui.unblock()

                  alert(
                    "No se pudo asignar el documento."
                  );
                  toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                });
            } catch (err) {
              toastr.error(NOTIFY.get("ERROR_INTERNAL"));
              throw err;
            }


          } else {
            alert(
              "Los documentos seleccionados no coinciden con el gasto."
            );
            unaBase.ui.unblock()
          }
        } else {
          alert("Debe seleccionar al menos un documento y el item de destino");
          unaBase.ui.unblock()

        }
      }
    });
  if ($.inArray("asociar_dct_a_gasto", params.buttons) != -1)
    buttons.push({
      name: "asociar_dct_a_gasto",
      icon: "ui-icon-circle-plus",
      caption: "Asociar dtc",
      action: function () {
        var element = this;
        var cant = 0;
        var dtcSelected = $(
          "#dtc-por-justificar > table > tbody > tr > td > .select:checked"
        );
        var amount = dtcSelected.length;

        var objFinal = {};

        var diferentes = false;
        var proveedorAnterior = 0;
        var documentoAnterior = 0;
        dtcSelected.each(function (key, item) {
          eval(
            "obj = { 'id_dtc_" +
            $(this).val() +
            "': '" +
            $(this).val() +
            "' }"
          );
          $.extend(objFinal, objFinal, obj);
          cant++;

          var tr = $(this).closest("tr");
          var idproveedor = tr.data("proveedor");
          var iddoc = tr.data("doc");

          if (cant == 1) {
            proveedorAnterior = idproveedor;
            documentoAnterior = iddoc;
          }
          if (
            proveedorAnterior == idproveedor &&
            documentoAnterior == iddoc
          ) {
            proveedorAnterior = idproveedor;
            documentoAnterior = iddoc;
          } else {
            diferentes = true;
          }
        });

        var idoc = $("#dtc-por-justificar").data("oc");
        var tipo = $("#dtc-por-justificar").data("tipo");
        eval("obj = { 'idoc': '" + idoc + "' }");
        $.extend(objFinal, objFinal, obj);

        if (amount > 0) {
          if (tipo == "FXR") {
            diferentes = false;
          }

          if (!diferentes) {
            $.ajax({
              url: "/4DACTION/_V3_setAsociarDtc_a_gasto",
              dataType: "json",
              type: "POST",
              async: false,
              data: objFinal
            }).done(function (data) {
              if (data.success) {
                toastr.success("Asociado con exito!");
                $(element)
                  .parentTo(".ui-dialog-content")
                  .dialog("close");
                unaBase.loadInto.viewport(
                  "/v3/views/compras/content.shtml?id=" + idoc,
                  undefined,
                  undefined,
                  true
                );
              } else {
                if (data.readonly) {
                  toastr.error(
                    NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                  );
                } else {

                  toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                }
              }
            });
          } else {
            alert(
              "Los documentos seleccionados no coinciden con el gasto."
            );
          }
        } else {
          alert("Debe seleccionar al menos un documento.");
        }
      }
    });

  if ($.inArray("asociar_oc_a_dtc", params.buttons) != -1)
    buttons.push({
      name: "asociar_oc_a_dtc",
      icon: "ui-icon-circle-plus",
      caption: "Asociar orden de compra",
      action: function () {
        var element = this;
        var cant = 0;
        var ocsSelected = $(
          "#ocs-por-justificar > table > tbody > tr > td > .select:checked"
        );
        var amount = ocsSelected.length;

        var objFinal = {};

        var diferentes = false;
        var proveedorAnterior = 0;
        var documentoAnterior = 0;
        ocsSelected.each(function (key, item) {
          eval(
            "obj = { 'id_gasto_" +
            $(this).val() +
            "': '" +
            $(this).val() +
            "' }"
          );
          $.extend(objFinal, objFinal, obj);
          cant++;

          var tr = $(this).closest("tr");
          var idproveedor = tr.data("proveedor");
          var iddoc = tr.data("doc");

          if (cant == 1) {
            proveedorAnterior = idproveedor;
            documentoAnterior = iddoc;
          }
          if (
            proveedorAnterior == idproveedor &&
            documentoAnterior == iddoc
          ) {
            proveedorAnterior = idproveedor;
            documentoAnterior = iddoc;
          } else {
            diferentes = true;
          }
        });

        var iddtc = $("#ocs-por-justificar").data("dtc");
        eval("obj = { 'iddtc': '" + iddtc + "' }");
        $.extend(objFinal, objFinal, obj);

        if (amount > 0) {
          if (!diferentes) {
            $.ajax({
              url: "/4DACTION/_V3_setAsociarOcs_a_dtc",
              dataType: "json",
              type: "POST",
              async: false,
              data: objFinal
            }).done(function (data) {
              if (data.success) {
                toastr.success("Asociado con exito!");
                $(element)
                  .parentTo(".ui-dialog-content")
                  .dialog("close");
                unaBase.loadInto.viewport(
                  "/v3/views/dtc/content.shtml?id=" + iddtc,
                  undefined,
                  undefined,
                  true
                );
              } else {
                if (data.readonly) {
                  toastr.error(
                    NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                  );
                } else {
                  toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                }
              }
            });
          } else {
            alert(
              "Las órdenes de compras seleccionadas no coinciden con el dtc."
            );
          }
        } else {
          alert("Debe seleccionar al menos una orden de compra.");
        }
      }
    });

  if ($.inArray("asociar_dtv_a_factoring", params.buttons) != -1)
    buttons.push({
      name: "asociar_dtv_a_factoring",
      icon: "ui-icon-circle-plus",
      caption: "Asociar factura",
      action: function () {
        var element = this;
        var cant = 0;
        var dtvSelected = $(
          "#dtv-por-cobrar > table > tbody > tr > td > .select:checked"
        );
        var amount = dtvSelected.length;
        var objFinal = {};
        dtvSelected.each(function (key, item) {
          eval(
            "obj = { 'id_dtv_" +
            $(this).val() +
            "': '" +
            $(this).val() +
            "' }"
          );
          $.extend(objFinal, objFinal, obj);
        });
        var idoc = $("#dtv-por-cobrar").data("oc");
        eval("obj = { 'idoc': '" + idoc + "' }");
        $.extend(objFinal, objFinal, obj);
        if (amount > 0) {
          $.ajax({
            url: "/4DACTION/_V3_setAsociarDtv_a_factoring",
            dataType: "json",
            type: "POST",
            async: false,
            data: objFinal
          }).done(function (data) {
            if (data.success) {
              toastr.success("Asociado con exito!");
              $(element)
                .parentTo(".ui-dialog-content")
                .dialog("close");
              unaBase.loadInto.viewport(
                "/v3/views/compras/content_factoring.shtml?id=" + idoc,
                undefined,
                undefined,
                true
              );
            } else {
              if (data.readonly) {
                toastr.error(
                  NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                );
              } else {
                toastr.error(NOTIFY.get("ERROR_INTERNAL"));
              }
            }
          });
        } else {
          alert("Debe seleccionar al menos una factura.");
        }
      }
    });

  if ($.inArray("dtc_pay_selection", params.buttons) != -1) {

    if (access[params.buttonAccess.dtc_pay_selection]) {
      buttons.push({
        name: "dtc_pay_selection",
        icon: "ui-icon-document",
        caption: "Pagar selección",
        action: function () {
          var selected = $("table.listpayout tbody").find("input:checked");

          if (selected.length >= 1) {
            for (i = 0; i < selected.length; i++) {
              let e = selected[i].parentNode.parentElement.dataset.estado;
              if (e === 'POR ASIGNAR') {
                toastr.error("No es posible pagar documentos que esten POR ASIGNAR");
                return;
              }
            }
          }



          var selectedPagadas = $("table.listpayout tbody")
            .find("input:checked")
            .closest('tr[data-estado="PAGADO"]').length;
          var selectedRevisar = $("table.listpayout tbody")
            .find("input:checked")
            .closest('tr[data-estado="POR REVISAR"]').length;
          var selectedAnuladas = $("table.listpayout tbody")
            .find("input:checked")
            .closest('tr[data-estado="NULO"]').length;
          if (
            selectedPagadas == 0 &&
            selectedRevisar == 0 &&
            selectedAnuladas == 0
          ) {
            if (selected.length > 20) {
              confirm(
                "Ha seleccionado <strong>" +
                selected.length +
                "</strong> documentos. ¿Desea continuar?"
              ).done(function (data) {
                if (data) {
                  unaBase.loadInto.dialog(
                    "/v3/views/dtc/dialog/wizard_payout.shtml",
                    "DOCUMENTOS SELECCIONADOS PARA PAGO",
                    "large"
                  );
                }
              });
            } else {
              unaBase.loadInto.dialog(
                "/v3/views/dtc/dialog/wizard_payout.shtml",
                "DOCUMENTOS SELECCIONADOS PARA PAGO",
                "large"
              );
            }
          } else {
            alert(
              "Hay documentos seleccionados que ya se encuentran PAGADOS, ANULADOS o POR REVISAR. <br/><br/>Por favor verificar y volver a intentar."
            );
          }
        }
      });

    }

  }

  if ($.inArray("dtv_charge_selection", params.buttons) != -1)
    buttons.push({
      name: "dtv_charge_selection",
      icon: "ui-icon-document",
      caption: "Crear ingreso",
      action: function () {
        var selectedInput = $("table.listincome tbody").find("input:checked");
        var selected = $("table.listincome tbody").find("tr[data-estado='EMITIDA'] input:checked");

        // Validación de selección
        var isNullified = false;
        var isNC = false;
        var isND = false;
        var currencies = new Set(); // Para almacenar los diferentes tipos de moneda

        selected.each(function (key, item) {
          var row = $(item).closest("tr");
          isNullified |= row.data("estado") === "ANULADA";
          isNC |= row.data("tipo").includes("NOTA DE CREDITO");
          isND |= row.data("tipo").includes("NOTA DE DEBITO");
          currencies.add(row.data("money")); // Añadir la moneda a la lista de monedas
        });

        // Construir mensaje de error si hay problemas con los documentos seleccionados
        var errMsg = "No es posible crear orden de ingreso, se ha seleccionado:";
        if (isNullified) {
          errMsg += "<br>- Facturas anuladas.";
        }
        if (isNC) {
          errMsg += "<br>- Notas de crédito.";
        }
        if (isND) {
          errMsg += "<br>- Notas de débito.";
        }
        if (currencies.size > 1) {
          errMsg += "<br>- Documentos con diferentes tipos de moneda.";
        }

        // Mostrar mensaje de advertencia si hay errores
        if (isNullified || isNC || isND || currencies.size > 1) {
          toastr.warning(errMsg);
          return; // Detener ejecución si hay errores
        }

        // Validación de documentos emitidos
        if (selectedInput.length !== selected.length) {
          setTimeout(() => {
            toastr.warning("Solo se permite pagar documentos emitidos");
          }, 0);
          return;
        }

        // Validar y proceder con los documentos seleccionados
        if (selected.length > 0) {
          if (selected.length > 20) {
            confirm(
              "Ha seleccionado <strong>" +
              selected.length +
              "</strong> documentos. ¿Desea continuar?"
            ).done(function (data) {
              if (data) {
                unaBase.loadInto.dialog(
                  "/v3/views/dtv/dialog/wizard_income.shtml",
                  "DOCUMENTOS SELECCIONADOS PARA COBRO",
                  "large"
                );
              }
            });
          } else {
            unaBase.loadInto.dialog(
              "/v3/views/dtv/dialog/wizard_income.shtml",
              "DOCUMENTOS SELECCIONADOS PARA COBRO",
              "large"
            );
          }
        }



      }
    });
  if ($.inArray("send_dtv_mail", params.buttons) != -1) {
    buttons.push({
      name: "send_dtv_mail",
      icon: " ui-icon-mail-open",
      caption: "Enviar Dtv por Correo electrónico",
      action: async function () {
        //aca van las acciones del boton
        // Recoger los ids seleccionados y los folios correspondientes
        const ids = [];
        const ids_emitidas = [];
        const idFolioMap = {}; // Mapa para asociar ids con folios

        $("#viewport tbody.ui-selectable tr[data-id] td:first-of-type input.selected:checked").each(function () {
          const $row = $(this).closest("tr");
          const estado = $row.data("estado");
          const id = $row.data("id");
          const folio = $row.find("td:nth-child(2)").text().trim(); // Obtener folio de la segunda columna

          if (estado && estado === "POR EMITIR") {
            ids_emitidas.push(id);
          }
          ids.push(id);
          idFolioMap[id] = folio; // Asociar id con folio
        });

        if (ids.length === 0) {
          toastr.warning("No hay registros seleccionados.");
          return;
        }

        const idsCheck = ids.join(', ');
        let checkEmail = false;

        // Verificar campos de contacto
        $.ajax({
          url: "/4DACTION/_force_checkContactFields",
          dataType: "json",
          type: "POST",
          async: false,
          data: {
            ids: idsCheck
          },
          success: function (data) {
            if (data.success) {
              checkEmail = true;
              toastr.success("Enviado con éxito!");
            } else {
              checkEmail = false;
              toastr.error("Verificación de campos fallida.");
            }
          },
          error: function () {
            toastr.error("Error en la verificación de campos de contacto.");
          }
        });

        if (checkEmail) {
          // Enviar los correos usando axios
          try {
            const sendEmail = async (id) => {
              let config = {
                method: 'post',
                url: `${nodeUrl}/send-dtv-mail?id=${id}&sid=${unaBase.sid.encoded()}&hostname=${window.location.origin}`,
                data: {
                  template: 'dtv_cobranza',
                  id_dtv: id
                }
              };

              const response = await axios(config);
              return response.data;
            };

            for (const id of ids) {
              await sendEmail(id);
              const folio = idFolioMap[id]; // Obtener el folio correspondiente al id
              toastr.success(`Correo enviado para el DTV con folio ${folio}`);
            }

          } catch (error) {
            console.error(error);
            toastr.error("Ha ocurrido un error interno. Por favor comuníquese con soporte.");
          }
        }
      }
    });
  }


  if ($.inArray("send_dtv_charge", params.buttons) != -1) {
    buttons.push({
      name: "send_dtv_charge",
      icon: "ui-icon-comment",
      caption: "Enviar cobranza",
      action: async function () {
        // Recoger los IDs seleccionados y agruparlos por RUT
        const clientGroups = {}; // Mapa para agrupar IDs por RUT
        const idFolioMap = {}; // Mapa para asociar IDs con folios

        $("#viewport tbody.ui-selectable tr[data-id] td:first-of-type input.selected:checked").each(function () {
          const $row = $(this).closest("tr");
          const id = $row.data("id");
          const rut = $row.find("td:nth-child(15)").text().trim(); // Obtener el RUT del cliente (columna 15)
          const folio = $row.find("td:nth-child(2)").text().trim(); // Obtener folio de la segunda columna

          // Validar si el RUT es válido (no vacío o inexistente)
          if (rut && rut !== "") {
            // Agrupar IDs por RUT
            if (!clientGroups[rut]) {
              clientGroups[rut] = [];
            }
            clientGroups[rut].push(id);
            idFolioMap[id] = folio; // Asociar ID con folio
          } else {
            toastr.warning(`El registro con ID ${id} no tiene un RUT válido y se omitirá.`);
          }
        });

        if (Object.keys(clientGroups).length === 0) {
          toastr.warning("No hay registros seleccionados o todos los registros seleccionados tienen un RUT inválido.");
          return;
        }

        let checkEmail = false;

        // Verificar campos de contacto para todos los IDs
        try {
          const idsCheck = Object.values(clientGroups).flat().join(', '); // Unir todos los IDs en un solo string
          const verifyResponse = await $.ajax({
            url: "/4DACTION/_force_checkContactFields",
            dataType: "json",
            type: "POST",
            data: { ids: idsCheck }
          });

          if (verifyResponse.success) {
            checkEmail = true;
            toastr.success("Verificación de campos exitosa.");
          } else {
            toastr.error("Verificación de campos fallida.");
          }
        } catch (error) {
          toastr.error("Error en la verificación de campos de contacto.");
        }

        if (checkEmail) {
          // Enviar los correos agrupados por RUT
          try {
            const sendEmails = async (rut, ids) => {
              const config = {
                method: 'post',
                url: `${nodeUrl}/send-dtv-charge?sid=${unaBase.sid.encoded()}&hostname=${window.location.origin}`,
                data: {
                  template: 'dtv_cobranza',
                  ids: ids, // Enviar el array de IDs
                  rut: rut
                }
              };
              return await axios(config);
            };

            for (const [rut, ids] of Object.entries(clientGroups)) {
              await sendEmails(rut, ids);
              ids.forEach(id => {
                const folio = idFolioMap[id]; // Obtener el folio correspondiente al ID
                toastr.success(`Correo enviado para el DTV con folio ${folio}, RUT: ${rut}`);
              });
            }
          } catch (error) {
            console.error(error);
            toastr.error("Ha ocurrido un error interno. Por favor comuníquese con soporte.");
          }
        }
      }
    });
  }


  if ($.inArray("receive_next_step", params.buttons) != -1)
    buttons.push({
      name: "receive_next_step",
      icon: "ui-icon-circle-arrow-e",
      caption: "Previsualizar cobros",
      action: function () {
        income.next.ini();
      }
    });

  if ($.inArray("pay_balance", params.buttons) != -1)
    buttons.push({
      name: "pay_balance",
      icon: "ui-icon-circle-arrow-e",
      caption: "Pagar agrupado",
      action: function () {
        payout.next.ini("balance");
      }
    });

  if ($.inArray("pay_nomina", params.buttons) != -1)
    buttons.push({
      name: "pay_nomina",
      icon: "ui-icon-circle-arrow-e",
      caption: "Pagar agrupado",
      action: function () {
        payout.next.ini("balance");
      }
    });


  if ($.inArray("print_navegador", params.buttons) != -1)
    buttons.push({
      name: "print_navegador",
      icon: "ui-icon-circle-arrow-e",
      caption: "Imprimir",
      action: function () {


        var original = document.getElementById('viewport');
        var original2 = original.innerHTML;
        var con = document.getElementById('dialog-viewport');
        var con2 = con.innerHTML;
        document.getElementById('viewport').innerHTML = con2;
        var ty = document.querySelector("div[class='opciones-general-tipo-pago'] ");
        ty.style.display = "none";
        window.print(print);
        document.getElementById('viewport').innerHTML = original2;

        $(".ui-dialog")
          .find(".ui-dialog-titlebar-close")
          .trigger("click");
        setTimeout(function () {
          $('ul[class="sidebar"]').find('a[data-logsmodulo="dtc"]').trigger("click");
        }, 500);
      }
    });


  if ($.inArray("pay_next_step", params.buttons) != -1)
    buttons.push({
      name: "pay_next_step",
      icon: "ui-icon-circle-arrow-e",
      caption: "Pagar por proveedor",
      action: function () {
        payout.next.ini("");
      }
    });

  if ($.inArray("receive_previous_step", params.buttons) != -1)
    buttons.push({
      name: "receive_previous_step",
      icon: "ui-icon-circle-arrow-w",
      caption: "Volver",
      action: function () {
        income.previous();
      }
    });

  if ($.inArray("restart_all_pass", params.buttons) != -1)
    buttons.push({
      name: "restart_all_pass",
      icon: "ui-icon-key",
      caption: "Reiniciar contraseña",
      action: function () {
        confirm(
          "Mediante esta acción se reiniciaran las contraseñas de todos los usuarios"
        ).done(function (data) {
          if (data) {
            $.ajax({
              url: "/4DACTION/_V3_reset_all_pass",
              dataType: "json",
              type: "POST",
              data: {
                all: true
              }
            }).done(function (data) {
              if (data.success) {
                toastr.success("Reinicio exitoso.");
              } else {
                toastr.error("Reinicio fallido.");
              }
            });
          } else {
            toastr.info("Reinicio cancelado.");
          }
        });
      }
    });

  if ($.inArray("request_pass_change", params.buttons) != -1) {

    buttons.push({
      name: "request_pass_change",
      icon: "ui-icon-key",
      caption: "Solicitar cambio de contraseña",
      action: function () {
        confirm(
          "Mediante esta acción se solicitara el cambio de contraseña a todos los usuarios"
        ).done(function (data) {
          if (data) {
            $.ajax({
              url: "/4DACTION/_V3_request_pass_change",
              dataType: "json",
              type: "POST"
            }).done(function (data) {
              if (data.success) {
                toastr.success("Acción exitosa.");
              } else {
                toastr.error("Acción fallida.");
              }
            });
          } else {
            toastr.info("Acción cancelada.");
          }
        });
      }
    });

  }
  if ($.inArray("usersCount", params.buttons) != -1) {
    if (access[params.buttonAccess.usersCount]) {
      buttons.push({
        name: "usersCount",
        icon: "ui-icon-info",
        caption: "#Activos",
        action: function () {
          axios(`/4DACTION/_V3_getUsuariosStats`).then(res => {
            let html = `
              <h3>Usuarios activos(no incluye soporte)</h3>
              <br/>
              <ul>
                <li>Última semana: ${res.data.lastWeek}</li>
                <li>Último mes: ${res.data.lastMonth}</li>
                <li>Últimos 6 meses: ${res.data.lastSemester}</li>
              </ul>`
            alert(html);
            console.log(res);
          }).catch(err => {
            console.log(err);
          })
        }
      });

    }

  }
  // Retorna true para realizar step 2 en setting_facturas.shtml
  if ($.inArray("programm_grouped_factura_next_step", params.buttons) != -1)
    buttons.push({
      name: "programm_grouped_factura_next_step",
      icon: "ui-icon-circle-arrow-e",
      caption: "Previsualizar facturas",
      action: function () {

        if ($("#dtvporfacturar table tbody").find("tr").length > 1) {
          payout.next(true);
        } else {
          payout.next(false);
        }
      }
    });

  // Programa las facturaciones agrupadas
  if ($.inArray("schedule_grouped_invoices", params.buttons) != -1)
    buttons.push({
      name: "schedule_grouped_invoices",
      icon: "ui-icon-calendar",
      caption: "PROGRAMAR",
      action: function () {
        confirm("CONFIRMA QUE DESEA PROGRAMAR LAS FACTURAS?").done(function (data) {
          if (data) {

            let exchange_x_neg = document.querySelector('input[name="exchange_x_neg"]').checked
            var facturas = payout.container
              .find("table.step-2 > tbody")
              .find("tr");

            let globalExchangeRate;
            if (currency.decimals_sep == ".") {
              globalExchangeRate = $('input[name="exchange_rate_global"]').val();
            } else {
              globalExchangeRate = $('input[name="exchange_rate_global"]').val().replace(".", "").replace(",", ".");
            }

            var data = {};
            data.exchange_x_neg = exchange_x_neg

            facturas.each(function (key, item) {
              data["cliente_" + (key + 1)] = $(item).data("id-cliente");
              data["fecha_" + (key + 1)] = $(item).find('input[name="fecha"]').val();
              data["recepcion_fecha_" + (key + 1)] = $(item).find('input[name="recepcion_fecha"]').val();
              data["negocios_" + (key + 1)] = $(item).data("id-negocios");
              data["montos_" + (key + 1)] = $(item).data("montos").toString().replace(".", ",");
              data["exchange_type_" + (key + 1)] = $(item).data("exchangetype");
              data["exchange_rate_" + (key + 1)] = globalExchangeRate;
            });

            let closePeriod = true

            $.ajax({
              url: "/4DACTION/_V3_get_estadoPeriodoContable",
              dataType: "json",
              type: "POST",
              data: {
                periodo: convertDate(data["fecha_1"]),
                status: true
              },
              async: false
            }).done(function (resp) {
              if (resp.closed) {
                closePeriod = false
                toastr.warning("Su periodo esta cerrado, no es posible programar la facturación.");
              }
            });

            if (closePeriod) {
              $.ajax({
                url: "/4DACTION/_MASIVO_crearGrupoFacturacion",
                dataType: "json",
                type: "POST",
                data: data
              }).done(function (resp) {
                if (resp && resp.success) {
                  $('.ui-dialog button[title="close"]').trigger("click");
                  toastr.success("Facturaci├│n Agrupada con éxito.");

                  $(document).trigger("pm:refreshRows");

                  $('#search [name="q"]').trigger("keydown");
                  $('#search [name="q"]').trigger("keyup");
                } else {
                  toastr.warning((resp && resp.message) ? resp.message : "No fue posible programar la facturaci├│n.");
                }
              }).fail(function () {
                toastr.error("Error al programar la facturación.");
              });
            }

          } else toastr.info("Programación cancelada.");
        });
      }
    });

  if ($.inArray("pay_previous_step", params.buttons) != -1)
    buttons.push({
      name: "pay_previous_step",
      icon: "ui-icon-circle-arrow-w",
      caption: "Volver",
      action: function () {
        payout.previous();
      }
    });

  if ($.inArray("invoice_previous_step", params.buttons) != -1)
    buttons.push({
      name: "invoice_previous_step",
      icon: "ui-icon-circle-arrow-w",
      caption: "Volver",
      action: function () {
        unaBase.loadInto.dialog(
          "/v3/views/dtv/dialog/negocios_disponibles.shtml",
          "Seleccionar negocio(s) a facturar",
          "x-large"
        );
        setTimeout(function () {
          unaBase.toolbox.search.restoreDialog();
        }, 500);
      }
    });

  if ($.inArray("invoice_next_step", params.buttons) != -1)
    buttons.push({
      name: "invoice_next_step",
      icon: "ui-icon-circle-arrow-e",
      caption: "Previsualizar facturas",
      action: function () {
        if ($("#dtvporfacturar table tbody").find("tr").length > 1) {
          confirm(
            "Seleccione la modalidad de facturación",
            "Agrupada",
            "Separada"
          ).done(function (data) {
            payout.next(data);
          });
        } else {
          payout.next(false);
        }
      }
    });

  if ($.inArray("generate_installments", params.buttons) != -1)
    buttons.push({
      name: "generate_installments",
      icon: "ui-icon-circle-check",
      caption: "CREAR ORDEN DE INGRESO",
      action: function () {
        confirm(
          "¿Confirma que desea crear los ingresos?. Esto pagará las facturas asociadas."
        ).done(function (data) {
          if (data) {
            income.installments.setCobros();
          }
        });
      }
    });

  if ($.inArray("generate_payments", params.buttons) != -1)
    buttons.push({
      name: "generate_payments",
      icon: "ui-icon-circle-check",
      caption: "CREAR PAGO",
      action: function () {
        payout.payments.setPagos();
      }
    });

  if ($.inArray("generate_invoices", params.buttons) != -1)
    buttons.push({
      name: "generate_invoices",
      icon: "ui-icon-circle-check",
      caption: "FACTURAR",
      action: function () {
        confirm("CONFIRMA QUE DESEA GENERAR LAS FACTURAS?").done(function (data) {
          if (data) {

            let exchange_x_neg = document.querySelector('input[name="exchange_x_neg"]').checked
            var facturas = payout.container
              .find("table.step-2 > tbody")
              .find("tr");

            if (currency.decimals_sep == ".") {
              // PE
              var globalExchangeRate = $(
                'input[name="exchange_rate_global"]'
              ).val();
            } else {
              // CL
              var globalExchangeRate = $(
                'input[name="exchange_rate_global"]'
              )
                .val()
                .replace(".", "")
                .replace(",", ".");
            }

            var data = {};
            data.exchange_x_neg = exchange_x_neg
            facturas.each(function (key, item) {
              data["cliente_" + (key + 1)] = $(item).data("id-cliente");
              data["fecha_" + (key + 1)] = $(item).find('input[name="fecha"]').val();
              data["recepcion_fecha_" + (key + 1)] = $(item).find('input[name="recepcion_fecha"]').val();
              data["negocios_" + (key + 1)] = $(item).data("id-negocios");
              data["montos_" + (key + 1)] = $(item).data("montos").toString().replace(".", ",");
              data["exchange_type_" + (key + 1)] = $(item).data("exchangetype");
              data["exchange_rate_" + (key + 1)] = globalExchangeRate;

              /*var cliente = $(item).data("cliente");
              var rut = $(item).data("rut-cliente");
              rut = unaBase.data.rut.format(rut);
              if (rut == "" || !unaBase.data.rut.validate(rut)) {
                toastr.warning(
                  'El cliente "' +
                    cliente +
                    '" no tiene un RUT válido ingresado.'
                );
              }*/

            });

            let closePeriod = true

            $.ajax({
              url: "/4DACTION/_V3_get_estadoPeriodoContable",
              dataType: "json",
              type: "POST",
              data: {
                periodo: convertDate(data["fecha_1"]),
                status: true
              },
              async: false
            }).done(function (data) {
              if (data.closed) {
                closePeriod = false
                toastr.warning("Su periodo esta cerrado, no es posible crear una factura.");
              }
            });

            if (closePeriod) {
              $.ajax({
                url: "/4DACTION/_V3_setgeneradtv_v1",
                dataType: "json",
                type: "POST",
                data: data
              }).done(function (data) {
                if (data.success) {
                  $('.ui-dialog button[title="close"]').trigger("click");
                  toastr.success("Facturas generadas con éxito.");
                  if (data.dtv.length == 1)
                    (function (data) {
                      setTimeout(function () {
                        unaBase.loadInto.viewport(
                          "/v3/views/dtv/content.shtml?id=" + data.dtv[0]
                        );
                      }, 3000);
                    })(data);
                  else {
                    $('#search [name="q"]').trigger("keydown");
                    $('#search [name="q"]').trigger("keyup");
                  }
                }
              });
            }

          } else toastr.info("Facturación cancelada.");
        });
      }
    });

  if ($.inArray("update_invoice", params.buttons) != -1)
    buttons.push({
      name: "update_invoice",
      icon: "ui-icon-circle-check",
      caption: "AGREGAR NEGOCIOS A FACTURA",
      action: function () {
        confirm(
          "CONFIRMA QUE DESEA AGREGAR LOS NEGOCIOS A LA FACTURA?"
        ).done(function (data) {
          if (data) {
            var facturas = payout.container
              .find("table.step-1 > tbody")
              .find("tr");

            var ajaxData = {
              id: $("section.sheet").data("id")
            };

            facturas.each(function (key, item) {
              ajaxData["cliente_" + (key + 1)] = $(item).data("idpro");
              //ajaxData['fecha_' + (key + 1)] = $(item).find('input[name="fecha"]').val();
              ajaxData["negocios_" + (key + 1)] = $(item).data("id");
              ajaxData["montos_" + (key + 1)] = $(item).data("monto");

              var cliente = $(item).data("cliente");
              var rut = $(item).data("rut-cliente");
              rut = unaBase.data.rut.format(rut);
              if (rut == "" || !unaBase.data.rut.validate(rut)) {
                toastr.warning(
                  'El cliente "' +
                  cliente +
                  '" no tiene un RUT válido ingresado.'
                );
              }
            });

            $.ajax({
              url: "/4DACTION/_V3_setgeneradtv_v1",
              dataType: "json",
              type: "POST",
              data: ajaxData
            }).done(function (data) {
              if (data.success) {
                $('.ui-dialog button[title="close"]').trigger("click");
                toastr.success("Negocios añadidos con éxito.");
                (function (ajaxData) {
                  setTimeout(function () {
                    unaBase.loadInto.viewport(
                      "/v3/views/dtv/content.shtml?id=" + ajaxData.id
                    );
                  }, 3000);
                })(ajaxData);
              }
            });
          } else toastr.info("Facturación cancelada.");
        });
      }
    });

  if ($.inArray("create_ot", params.buttons) != -1)
    buttons.push({
      name: "create_ot",
      icon: "ui-icon-document",
      caption: "Crear",
      action: function () {
        /*$.ajax({
          url: '/4DACTION/_V3_setDtc',
          dataType: 'json',
          type: 'POST',
          data: []
        }).done( function(data) {
          unaBase.loadInto.viewport('/v3/views/ots/v3/content.shtml?id=' + data.id);
        });*/
      }
    });

  if ($.inArray("close_admin_fxr", params.buttons) != -1)
    buttons.push({
      name: "close_admin_fxr",
      icon: "ui-icon-locked",
      caption: "Cerrar proceso rendición",
      action: function () {
        compras.closeAdmin("rendicion");
      }
    });

  if ($.inArray("close_production_process", params.buttons) != -1) {
    buttons.push({
      name: "close_production_process",
      icon: "ui-icon-locked",
      caption: "Cerrar proceso de producción",
      action: function () {
        compras.closeProduction("rendicion");
      }
    });
  }

  if ($.inArray("open_production_process", params.buttons) != -1) {
    buttons.push({
      name: "open_production_process",
      icon: "ui-icon-locked",
      caption: "Abrir proceso de producción",
      action: function () {
        compras.openProduction("rendicion");
      }
    });
  }

  if ($.inArray("open_admin_fxr", params.buttons) != -1) {
    buttons.push({
      name: "open_admin_fxr",
      icon: "ui-icon-unlocked",
      caption: "Abrir proceso rendición",
      action: function () {
        compras.openAdmin("rendicion");
      }
    });
  }

  if ($.inArray("close_admin_oc", params.buttons) != -1) {

    if (access[params.buttonAccess.close_admin_oc]) {
      buttons.push({
        name: "close_admin_oc",
        icon: "ui-icon-locked",
        caption: "Cerrar proceso compra admin",
        action: function () {
          compras.closeAdmin("oc");
        }
      });

    }
  }

  if ($.inArray("open_admin_oc", params.buttons) != -1) {
    if (access[params.buttonAccess.open_admin_oc]) {
      buttons.push({
        name: "open_admin_oc",
        icon: "ui-icon-unlocked",
        caption: "Abrir proceso compra admin",
        action: function () {
          compras.openAdmin("oc");
        }
      });

    }
  }

  /*if ($.inArray('create_oc2', params.buttons) != -1)
    buttons.push({
      name: 'create_oc2', icon: 'ui-icon-document', caption: 'Crear',
       action:  function() {
        $.ajax({
          url: '/4DACTION/_V3_setCompras',
          dataType: 'json',
          type: 'POST',
          data: []
        }).done( function(data) {
          unaBase.loadInto.viewport('/v3/views/compras/content.shtml?id=' + data.id);
        });
      }
    });*/

  if ($.inArray("create_gasto_from_oc", params.buttons) != -1)
    buttons.push({
      name: "create_gasto_from_oc",
      icon: "ui-icon-document",
      caption: "Crear",
      action: function () {
        $.ajax({
          url: "/4DACTION/_V3_setCompras",
          dataType: "json",
          type: "POST",
          data: {
            create_from: "OC",
          }
        }).done(function (data) {
          unaBase.loadInto.viewport(
            "/v3/views/compras/content.shtml?id=" + data.id
          );
        });
      }
    });

  if ($.inArray("create_cot_from_proyecto", params.buttons) != -1)
    buttons.push({
      name: "create_cot_from_proyecto",
      icon: "ui-icon-document",
      caption: "Nueva cotización",
      action: function () {
        var referencia_proyecto = $(
          'input[name="cotizacion[titulo][text]"]'
        ).val();
        var id_proyecto = $("section.sheet").attr("data-id");
        var empresa = $('input[name="cotizacion[empresa][id]"]').attr(
          "data-id"
        );
        var contacto = $(
          'input[name="cotizacion[empresa][contacto][id]"]'
        ).attr("data-id");
        $.ajax({
          url: "/4DACTION/_V3_setCotizacion",
          dataType: "json",
          type: "POST",
          data: {
            create_from: "proyecto",
            referencia_proyecto: referencia_proyecto,
            proyecto: id_proyecto,
            empresa: empresa,
            contacto: contacto
          }
        }).done(function (data) {
          unaBase.loadInto.viewport(
            "/v3/views/cotizaciones/content.shtml?id=" + data.id
          );
        });
      }
    });

  if ($.inArray("create_ot_from_proyecto", params.buttons) != -1)
    buttons.push({
      name: "create_ot_from_proyecto",
      icon: "ui-icon-document",
      caption: "Nueva tarea",
      action: function () {
        var id_proyecto = $("section.sheet").attr("data-id");
        var referencia_proyecto = $(
          'input[name="cotizacion[titulo][text]"]'
        ).val();
        $.ajax({
          url: "/4DACTION/_V3_setOts",
          dataType: "json",
          type: "POST",
          data: {
            moduloOt: "PROYECTO",
            referencia_proyecto: "PROYECTO",
            id_proyecto: id_proyecto
          }
        }).done(function (data) {
          // unaBase.loadInto.viewport('/ot.shtml?i=' + data.id);

          window.open(
            "https://" + window.location.host + "/ot.shtml?i=" + data.id,
            "_blank"
          );
        });
      }
    });

  if ($.inArray("create_gasto_from_fxr", params.buttons) != -1)
    buttons.push({
      name: "create_gasto_from_fxr",
      icon: "ui-icon-document",
      caption: "Crear",
      action: function () {
        $.ajax({
          url: "/4DACTION/_V3_setCompras",
          dataType: "json",
          type: "POST",
          data: {
            create_from: "FXR",
          }
        }).done(function (data) {
          unaBase.loadInto.viewport(
            "/v3/views/compras/content.shtml?id=" + data.id
          );
        });
      }
    });

  if ($.inArray("create_gasto_from_factoring", params.buttons) != -1)
    buttons.push({
      name: "create_gasto_from_factoring",
      icon: "ui-icon-document",
      caption: "Crear",
      action: function () {
        $.ajax({
          url: "/4DACTION/_V3_setCompras",
          dataType: "json",
          type: "POST",
          data: {
            create_from: "FACTORING"
          }
        }).done(function (data) {
          unaBase.loadInto.viewport(
            "/v3/views/compras/content_factoring.shtml?id=" + data.id
          );
        });
      }
    });

  if ($.inArray("new_payment", params.buttons) != -1)
    buttons.push({
      name: "new_payment",
      icon: "ui-icon-clipboard",
      caption: "Ingresar orden de pago",
      action: function () {
        /*var url = '/v3/views/pagos/dialog/pago2.shtml';
        unaBase.loadInto.dialog(url, 'Nueva orden de pago', 'large');*/
        // compras.tipoGasto = OC/FXR
        $.ajax({
          url: "/4DACTION/_V3_setPago",
          dataType: "json",
          type: "POST",
          data: {
            origen: compras.tipoGasto,
            id_origen: compras.id
          }
        }).done(function (data) {
          unaBase.loadInto.viewport(
            "/v3/views/pagos/content2.shtml?id=" + data.id
          );
        });
      }
    });

  if ($.inArray("payment_request", params.buttons) != -1)
    buttons.push({
      name: "payment_request",
      icon: "ui-icon-transfer-e-w",
      caption: "Solicitar pago",
      action: function () {
        var url = "/v3/views/compras/payment_request.shtml";
        unaBase.loadInto.dialog(url, "SOLICITUD DE PAGO", "small");
      }
    });

  if ($.inArray("modification_request", params.buttons) != -1)
    buttons.push({
      name: "modification_request",
      icon: "ui-icon-transfer-e-w",
      caption: "Solicitar modificación",
      action: function () {
        var url = "/v3/views/negocios/modification_request.shtml";
        unaBase.loadInto.dialog(
          url,
          "SOLICITUD DE MODIFICACIÓN DE NEGOCIO",
          "small"
        );
      }
    });

  if ($.inArray("conversion_negocio_request", params.buttons) != -1)
    buttons.push({
      name: "conversion_negocio_request",
      icon: "ui-icon-transfer-e-w",
      caption: "Solicitar conversión a negocio",
      action: function () {
        var url = "/v3/views/cotizaciones/conversion_request.shtml";
        unaBase.loadInto.dialog(
          url,
          "SOLICITUD DE CONVERSIÓN DE COTIZACIÓN",
          "small"
        );
      }
    });

  if ($.inArray("sending_request", params.buttons) != -1)
    buttons.push({
      name: "sending_request",
      icon: "ui-icon-mail-closed",
      caption: "Enviar",
      action: function () {
        var target = $(this);
        var sendPaymentByEmail = async function (address) {


          var id = $("#sheet-compras").data("id");
          var index = $("#sheet-compras").data("folio");
          var text = "";
          var sender = $("html > body.home > aside > div > div > h1")
            .text()
            .capitalizeAllWords();
          var comentario = $("#sheet-payment > textarea")
            .val()
            .replace(/\n/g, "<br/>");
          var sendMsg = async function (document, index, text, sender) {
            var retval;
            $.ajax({
              url: "/v3/views/compras/email_payment.shtml",
              dataType: "html",
              async: false,
              success: function (data) {
                retval = $("<div>").html(data);
              }
            });

            retval.find("[data-document]").html(document);
            retval.find("[data-index]").html(index);
            retval.find("[data-text]").html(text);
            retval.find("[data-comentario]").html(comentario);
            retval.find("[data-sender-name]").html(sender);
            return retval.html();
          };
          var index2 = "";
          var msg = await sendMsg("Solicitud de pago", index2, text, sender);


          var attachments = [
            {
              cid: "logo.png",
              url:
                "https://" +
                window.location.hostname +
                "/v3/design/html/body.menu/nav/h1.png"
            },
            {
              cid: "empresa.jpg",
              url:
                "https://" +
                window.location.hostname +
                "/4DACTION/logo_empresa_web"
            }
          ];
          $.ajax({
            url:
              nodeUrl +
              "/email",
            data: {
              download: false,
              entity: "Pagos",
              id: params.data().id,
              folio: params.data().folio,
              document: "Pago de " + params.data().tipo,
              text: text,
              sid: unaBase.sid.encoded(),
              email: address,
              preview: false,
              nullified: params.data().readonly,
              sender: sender,
              msg: msg,
              attachments: JSON.stringify(attachments),
              from: "soporte@unabase.com",
              username: $("html > body.menu.home > aside > div > div > h1").data(
                "username"
              )
            },
            type: "GET",
            dataType: "jsonp",
            success: function (data) {
              toastr.success(
                sprintf(NOTIFY.get("SUCCESS_EMAIL_SEND"), address)
              );
              $(target)
                .parentTo(".ui-dialog-content")
                .dialog("close");
              compras.saveLogsFromWeb({
                id: compras.id,
                folio: index,
                descripcion: "Ha realizado solicitud de pago",
                modulo: "gastos",
                descripcion_larga: comentario
              });
              compras.setSolicitaPago();
            },
            error: function (data) {
              toastr.error(NOTIFY.get("ERROR_INTERNAL"));
            }
          });
        };

        // Obtener el correo del usuario logueado
        var userEmail = $("html > body.menu.home > aside > div > div > h1").data("email");
        // Obtener los correos internos configurados
        var internalEmails = $("#sheet-compras").data("emailpagos");
        // Combinar ambos
        var email = userEmail;
        if (internalEmails && internalEmails != "") {
          email = email + ", " + internalEmails;
        }
        var comentario = $("#sheet-payment > textarea").val();
        if (comentario != "") {
          sendPaymentByEmail(email);
          /* unaBase.inbox.send({
            to: username,
            subject: comentario,
            into: 'viewport',
            href: '/v3/views/compras/content.shtml?id=' + $('section.sheet').data('id'),
            tag: 'solicitudes'
          }); */
        } else {
          toastr.warning(NOTIFY.get("WARNING_REQUIRED_DESCRIPTION"));
        }
      }
    });


  if ($.inArray("export_list_resumido", params.buttons) != -1) {
    buttons.push({
      name: "export",
      icon: "ui-icon-calculator",
      caption: "Exportar a excel resumido",
      action: function () {
        var sid = "";
        $.each($.cookie(), function (clave, valor) {
          if (clave == hash && valor.match(/UNABASE/g)) sid = valor;
        });

        var modulo = $("html > body.menu.home > aside > div > div > ul > li.active")
          .data("name")
          .toUpperCase();
        var url = "";

        var filters = unaBase.utilities.getFilter("#search", true);
        filters += '&'
        filters += $("#search").serializeAnything(true);

        // --ini-- corrección para enviar parametro de orden a nodejs y exportar segun orden lista
        var sortParams = {};
        $("#viewport")
          .find("table.results > thead > tr > th")
          .each(function () {
            if (typeof $(this).data("sort-order") != "undefined") {
              sortParams = {
                sort_by: $(this).data("sort-by"),
                sort_order: $(this).data("sort-order")
              };
              return false;
            }
          });
        filters += "&" + jQuery.param(sortParams);
        // --fin--

        var blockedElement = 0;

        var ids = [];
        if (
          !$('#viewport input[name="selected_all"]').is(":checked")
        ) {
          $(
            "#viewport tbody.ui-selectable tr[data-id] td:first-of-type input.selected:checked"
          ).each(function () {
            ids.push(
              $(this)
                .closest("tr")
                .data("id")
            );
          });
        }

        // Detectar el módulo y armar la URL correspondiente
        switch (modulo) {
          case "GASTOS":
            url =
              nodeUrl +
              "/export-list-oc-resumido?download=true&ids=" +
              ids.join("|") +
              "&tipo_gasto=OC&sid=" +
              unaBase.sid.encoded() +
              "&" +
              filters +
              "&hostname=" +
              window.location.origin;
            unaBase.log.save(
              "Ha exportado el listado de órdenes de compra",
              "gastos"
            );
            break;
          case "RENDICIONES":
          case "FXR":
            url =
              nodeUrl +
              "/export-list-oc-resumido?download=true&ids=" +
              ids.join("|") +
              "&tipo_gasto=FXR&sid=" +
              unaBase.sid.encoded() +
              "&" +
              filters +
              "&hostname=" +
              window.location.origin;
            unaBase.log.save(
              "Ha exportado el listado de rendiciones",
              "rendiciones"
            );
            break;
          default:
            alert("No se reconoce el módulo para exportar excel resumido.");
            return;
        }

        if (!blockedElement) {
          var download = window.open(url);
          download.blur();
          window.focus();
        }
      }
    });
  }

  if ($.inArray("solicitud_permiso", params.buttons) != -1)
    buttons.push({
      name: "solicitud_permiso",
      icon: "ui-icon-mail-closed",
      caption: "Enviar",
      action: function () {
        var target = $(this);
        var sendPaymentByEmail = async function (address) {


          //var index = $('#sheet-compras').data('folio');
          var text = "";
          var sender = $("html > body.home > aside > div > div > h1")
            .text()
            .capitalizeAllWords();
          var comment = $(".sheet-pop-access > article > textarea")
            .val()
            .replace(/\n/g, "<br>");

          var idAccess = $('article[data-box="solicitud"]').data(
            "idaccess"
          );
          var nameAccess = $('article[data-box="solicitud"]').data(
            "nameaccess"
          );
          var modulo = $(".sheet-pop-access").data("modulo");
          var username = $("html > body.menu.home > aside > div > div > h1").data(
            "username"
          );

          if (comment != "") {
            var sendMsg = async function (document, index, text, sender) {
              var retval;
              $.ajax({
                url: "/v3/views/accesos/email_solicitud_permiso.shtml",
                dataType: "html",
                async: false,
                success: function (data) {
                  retval = $("<div>").html(data);
                }
              });

              var url_ =
                "https://" +
                window.location.hostname +
                "/v3/views/accesos/assign.shtml?id=" +
                idAccess +
                "&u=" +
                username;
              var link =
                '<a href="' +
                url_ +
                '" target="_blank">Click aquí para asignar</a>';

              retval.find("[data-document]").html(document);
              retval.find("[data-text]").html(text);
              retval.find("[data-comment] > span").html(comment);
              retval.find("[data-default] > strong").html(nameAccess);
              retval.find("[data-default] > span").html(modulo);
              retval.find("[data-sender-name]").html(sender);
              retval.find("[data-link]").html(link);
              return retval.html();
            };
            var index2 = "";
            var msg = sendMsg(
              "Solicitud de acceso",
              index2,
              text,
              sender
            );
            var attachments = [
              {
                cid: "logo.png",
                url:
                  "https://" +
                  window.location.hostname +
                  "/v3/design/html/body.menu/nav/h1.png"
              },
              {
                cid: "empresa.jpg",
                url:
                  "https://" +
                  window.location.hostname +
                  "/4DACTION/logo_empresa_web"
              }
            ];
            $.ajax({
              url:
                nodeUrl +
                "/email/",
              data: {
                download: false,
                entity: "Accesos",
                id: 0,
                folio: index2,
                document: "Acceso",
                text: text,
                sid: sid,
                email: address,
                preview: false,
                nullified: params.data().readonly,
                sender: sender,
                msg: msg,
                attachments: JSON.stringify(attachments),
                from: $("html > body.menu.home > aside > div > div > h1").data("email"),
                username: $("html > body.menu.home > aside > div > div > h1").data(
                  "username"
                )
              },
              type: "GET",
              dataType: "jsonp",
              success: function (data) {
                toastr.success(
                  sprintf(NOTIFY.get("SUCCESS_EMAIL_SEND"), address)
                );
                $(target)
                  .parentTo(".ui-dialog-content")
                  .dialog("close");
              },
              error: function (data) {
                toastr.error(NOTIFY.get("ERROR_INTERNAL"));
              }
            });
          } else {
            toastr.error(
              "Es necesario ingresar un comentario para poder enviar la solicitud."
            );
            $(".sheet-pop-access > article > textarea").focus();
          }
        };

        var email = $(".sheet-pop-access").data("emails");
        if (email == "") {
          email = "soporte@una.cl";
        }
        var usernames = $(".sheet-pop-access")
          .data("admin-usernames")
          .split(":");

        sendPaymentByEmail(email);
        for (i in usernames) {
          var element = usernames[i];
          var idAccess = $('article[data-box="solicitud"]').data(
            "idaccess"
          );
          var nameAccess = $('article[data-box="solicitud"]').data(
            "nameaccess"
          );
          var modulo = $(".sheet-pop-access").data("modulo");
          var username = $("html > body.menu.home > aside > div > div > h1").data(
            "username"
          );
          unaBase.inbox.send({
            to: element,
            subject: "Solicita acceso a " + modulo + " / " + nameAccess,
            into: "dialog",
            size: "x-small",
            href:
              "/v3/views/accesos/assign.shtml?id=" +
              idAccess +
              "&u=" +
              username,
            tag: "solicitudes"
          });
        }
        document
          .querySelector(".ui-dialog .ui-dialog-titlebar-close")
          .click();

        //var comentario = $('#sheet-payment > textarea').val();
        //if (comentario != '') {
        /*}else{
          toastr.warning(NOTIFY.get('WARNING_REQUIRED_DESCRIPTION'));
        }*/
      }
    });

  if ($.inArray("sending_modification_request", params.buttons) != -1)
    buttons.push({
      name: "sending_modification_request",
      icon: "ui-icon-mail-closed",
      caption: "Enviar",
      action: function () {
        var target = $(this);
        /*
        var sendPaymentByEmail = async function(address) {

          var sid = '';
          $.each($.cookie(),async function(clave,valor) { if (clave == hash && valor.match(/UNABASE/g)) sid = valor; });

          //var index = $('#sheet-compras').data('folio');
          var text = "";
          var sender = $('html > body.home > aside > div > div > h1').text().capitalizeAllWords();
          var comment = $('#sheet-payment > textarea').val().replace(/\n/g,'<br>');

          var idAccess = $('article[data-box="solicitud"]').data('idaccess');
          var nameAccess = $('article[data-box="solicitud"]').data('nameaccess');
          var modulo = $('.sheet-pop-access').data('modulo');
          var username = $('html > body.menu.home > aside > div > div > h1').data('username');

          if (comment!="") {
            var sendMsg = async function(document, index, text, sender) {
              var retval;
              $.ajax({
                url: '/v3/views/accesos/email_solicitud_permiso.shtml',
                dataType: 'html',
                async: false,
                success: function(data) {
                  retval = $('<div>').html(data);
                }
              });

              var url_ = 'http://' + window.location.hostname + ':' + window.location.port + '/v3/views/accesos/assign.shtml?id='+idAccess+'&u='+username;
              var link = '<a href="'+url_+'" target="_blank">Click aquí para asignar</a>';

              retval.find('[data-document]').html(document);
              retval.find('[data-text]').html(text);
              retval.find('[data-comment] > span').html(comment);
              retval.find('[data-default] > strong').html(nameAccess);
              retval.find('[data-default] > span').html(modulo);
              retval.find('[data-sender-name]').html(sender);
              retval.find('[data-link]').html(link);
              return retval.html();

            };
            var index2 = '';
            var msg = sendMsg('Solicitud de acceso',index2,text,sender);
            var attachments = [
              {
                cid: 'logo.png',
                url: 'http://' + window.location.hostname + ':' + window.location.port + '/v3/design/html/body.menu/nav/h1.png'
              },
              {
                cid: 'empresa.jpg',
                url: 'http://' + window.location.hostname + ':' + window.location.port + '/4DACTION/logo_empresa_web'
              }
            ];
            $.ajax({
              url: 'http://' + nodejs_public_ipaddr + ':' + nodejs_port + '/email/',
              data: {
                download: false,
                entity: 'Accesos',
                id: 0,
                folio: index2,
                document: 'Acceso',
                text: text,
                sid: sid,
                email: address,
                preview: false,
                nullified: params.data().readonly,
                sender: sender,
                msg: msg,
                attachments: JSON.stringify(attachments),
                from: $('html > body.menu.home > aside > div > div > h1').data('email'),
                username: $('html > body.menu.home > aside > div > div > h1').data('username')
              },
              type: 'GET',
              dataType: 'jsonp',
              success: function(data) {
                toastr.success(sprintf(NOTIFY.get('SUCCESS_EMAIL_SEND'), address));
                $(target).parentTo('.ui-dialog-content').dialog('close');
              },
              error: function(data) {
                toastr.error(NOTIFY.get('ERROR_INTERNAL'));
              }
            });
          }else{
            toastr.error("Es necesario ingresar un comentario para poder enviar la solicitud.");
            $('.sheet-pop-access > article > textarea').focus();
          }

        };


        var email = '';
        if (email=="") {
          email = "soporte@una.cl";
        }

        */

        $.ajax({
          url: "/4DACTION/_V3_setAutorizacionByNegocio",
          data: {
            id_negocio: $("section.sheet").data("id"),
            usuario: $("html > body.menu.home > aside > div > div > h1").data(
              "username"
            )
          },
          dataType: "json",
          success: function (data) {
            if (data.success) {
              var usernames = [];
              $.ajax({
                url: "/4DACTION/_V3_getUsuariosAutorizadoresNeg",
                async: false,
                dataType: "json",
                success: function (subdata) {
                  $.each(subdata.rows, function (key, item) {
                    usernames.push(item.id);
                  });
                }
              });

              for (i in usernames) {
                var element = usernames[i];
                var username = element;

                unaBase.inbox.send({
                  to: element,
                  subject:
                    $("html > body.menu.home > aside > div > div > h1")
                      .text()
                      .capitalizeAllWords() +
                    " solicita autorización para modificar el negocio Nº " +
                    $("section.sheet").data("index"),
                  into: "dialog",
                  size: "x-small",
                  href:
                    "/v3/views/negocios/content.shtml?id=" +
                    $("section.sheet").data("id") +
                    "&autorizacion=" +
                    data.id,
                  tag: "solicitudes"
                });

                var comment = $("#sheet-payment > textarea")
                  .val()
                  .replace(/\n/g, "<br>");

                unaBase.email.notify(
                  username,
                  "notify_autorizacion_negocio",
                  $("html > body.menu.home > aside > div > div > h1")
                    .text()
                    .capitalizeAllWords() +
                  " solicita autorización para modificar el negocio Nº " +
                  $("section.sheet").data("index"),
                  $("section.sheet").data("index"),
                  undefined,
                  undefined,
                  "negocios/content.shtml",
                  $("section.sheet").data("id") +
                  "&autorizacion=" +
                  data.id,
                  undefined,
                  undefined,
                  undefined,
                  undefined,
                  undefined,
                  function () {
                    var text = "<p>" + comment + "</p>";
                    var button =
                      '<a style="font-size:inherit!important;display:inline-block!important;padding:10px!important;background-color:rgb(67,175,124)!important;border:1px solid rgb(67,175,124)!important;border-radius:3px!important;margin:5px 10px 5px 0px!important;color:black;text-decoration:underline" href="http://desarrollo.unabase.cl:8180/v3/views/email/express_autoriza_mod_neg.shtml?id=' +
                      $("section.sheet").data("id") +
                      "&autorizacion=" +
                      data.id +
                      '">Autorizar</a>';
                    return text + button;
                  }
                );

                $(target)
                  .parentTo(".ui-dialog-content")
                  .dialog("close");
                toastr.success("Solicitud de autorización enviada.");
              }
            }
          }
        });
      }
    });

  if ($.inArray("sending_conversion_request", params.buttons) != -1)
    buttons.push({
      name: "sending_conversion_request",
      icon: "ui-icon-mail-closed",
      caption: "Enviar",
      action: function () {
        var target = $(this);
        var usernames = [];
        $.ajax({
          url: "/4DACTION/_V3_getUsuariosConvertidoresNeg",
          data: {
            id: $("section.sheet").data("id")
          },
          async: false,
          dataType: "json",
          success: function (subdata) {
            $.each(subdata.rows, function (key, item) {
              usernames.push(item.id);
            });
          }
        });

        for (i in usernames) {
          var element = usernames[i];
          var username = element;

          unaBase.inbox.send({
            to: element,
            subject:
              "solicita conversión a negocio de la cotización Nº " +
              $("section.sheet").data("index"),
            into: "dialog",
            size: "x-small",
            href:
              "/v3/views/cotizaciones/content.shtml?id=" +
              $("section.sheet").data("id"),
            tag: "solicitudes"
          });

          var comment = $("#sheet-payment > textarea")
            .val()
            .replace(/\n/g, "<br>");
          const obs = document.querySelector('.sheet#sheet-payment textarea') != undefined ? document.querySelector('.sheet#sheet-payment textarea').value : ''
          // notify: async function(to, template, document, index, title, extra, detail_uri, id_item, attach, userValidator, nameValidator, emailValidator, print_negocio, msgBody, isEjecutivoResponsable);

          unaBase.email.notify(
            username,//1
            "notify",//2
            " solicita conversión a negocio de la cotización Nº " + $("section.sheet").data("index"),//3
            $("section.sheet").data("index"),//4
            undefined,
            obs,
            "cotizaciones/content.shtml",
            $("section.sheet").data("id"),
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            function () {
              var text = "<p>" + comment + "</p>";
              //var button = '<a style="font-size:inherit!important;display:inline-block!important;padding:10px!important;background-color:rgb(67,175,124)!important;border:1px solid rgb(67,175,124)!important;border-radius:3px!important;margin:5px 10px 5px 0px!important;color:black;text-decoration:underline" href="http://desarrollo.unabase.cl:8180/v3/views/email/express_autoriza_mod_neg.shtml?id=' + $('section.sheet').data('id') + '&autorizacion=' + data.id + '">Autorizar</a>';
              return text; // + button;
            }
          );
        }

        $(target)
          .parentTo(".ui-dialog-content")
          .dialog("close");
        toastr.success("Solicitud de conversión enviada.");
      }
    });

  /*
  if ($.inArray('approve_modification_request', params.buttons) != -1)
    buttons.push({
      name: 'approve_modification_request', icon: 'ui-icon-circle-check' , caption: 'Autorizar modificación',
       action:  function() {
        $.ajax({
          url: '/4DACTION/_V3_setAutorizacionByNegocio',
          data: {
            id: $.urlParam('autorizacion', window.location.href),
            accion_autorizar: true
          },
          dataType: 'json',
          success: function(data) {
            if (data.success) {
              if (typeof data.detail != 'undefined') {
                if (data.detail.result) {
                  toastr.success('El usuario ' + data.detail.data + ' fue autorizado con éxito.');
                } else {
                  toastr.warning(data.detail.data);
                }

                // enviar email notificando al usuario que fue autorizado
              }
            }
          }
        });
      }
    });
  */

  if ($.inArray("close_compras_negocio", params.buttons) != -1)
    buttons.push({
      name: "close_compras_negocio",
      icon: "ui-icon-locked",
      caption: "Cerrar proceso de compra",
      action: function (event) {
        //var id = $.unserialize(params.data()).id;
        var id = document.querySelector('.sheet').dataset.id
        var closeCompras = async function () {
          $.ajax({
            url: "/4DACTION/_V3_set" + params.entity,
            dataType: "json",
            data: {
              id: id,
              "negocio[compras]": false
            },
            success: function (data) {

              if (data.success) {


                if (typeof params.presupuesto != "undefined") {
                  unaBase.loadInto.viewport(
                    "/v3/views/presupuestos/content.shtml?id=" +
                    id +
                    "#tabs-2",
                    undefined,
                    undefined,
                    true
                  );
                } else {
                  unblockCot();
                  unaBase.loadInto.viewport(
                    "/v3/views/negocios/content.shtml?id=" +
                    id +
                    "#tabs-2",
                    undefined,
                    undefined,
                    true
                  );
                }



                toastr.success(
                  NOTIFY.get("SUCCESS_NEGOCIO_CLOSE_COMPRAS")
                );
                //notify cierre de compras de negocio

                // unaBase.inbox.send({
                //   subject: `ha cerrado las compras del negocio Nº${params.data().index} ${params.data().text}`,
                //   into: "viewport",
                //   href:
                //     "/v3/views/negocios/content.shtml?id=" +
                //     id,
                //   tag: "avisos",
                //   notifyId: 20,
                //   id: params.data().id
                // });

                notifyNv.closeCompras({
                  number: data.index,
                  text: params.data().text,
                  id: params.data().id
                });
              } else {
                if (data.opened) {
                  if (data.readonly)
                    toastr.error(
                      NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                    );
                }
              }
            },
            error: function (xhr, text, error) {
              toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
            }
          });
        };
        if (typeof event.isTrigger == "undefined") {
          confirm(MSG.get("CONFIRM_NEGOCIO_CLOSE_COMPRAS")).done(function (
            data
          ) {
            if (data) closeCompras();
          });
        } else closeCompras();
      }
    });

  // Cierre ventas negocio
  if ($.inArray("close_ventas_negocio", params.buttons) != -1)
    buttons.push({
      name: "close_ventas_negocio",
      icon: "ui-icon-locked",
      caption: "Cerrar proceso de venta",
      action: function (event) {
        //var id = $.unserialize(params.data()).id;
        var id = params.data().id;
        var closeVentas = async function () {
          $.ajax({
            url: "/4DACTION/_V3_set" + params.entity,
            dataType: "json",
            data: {
              id: id,
              "negocio[ventas]": false
            },
            success: function (data) {
              unblockCot();
              if (data.success) {
                if (typeof params.presupuesto != "undefined")
                  unaBase.loadInto.viewport(
                    "/v3/views/presupuestos/content.shtml?id=" +
                    id +
                    "#tabs-2",
                    undefined,
                    undefined,
                    true
                  );
                else
                  unaBase.loadInto.viewport(
                    "/v3/views/negocios/content.shtml?id=" +
                    id +
                    "#tabs-2",
                    undefined,
                    undefined,
                    true
                  );
                toastr.success(
                  NOTIFY.get("SUCCESS_NEGOCIO_CLOSE_VENTAS")
                );
              } else {
                if (data.opened) {
                  if (data.readonly)
                    toastr.error(
                      NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                    );
                }
              }
            },
            error: function (xhr, text, error) {
              toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
            }
          });
        };
        if (typeof event.isTrigger == "undefined") {
          confirm(MSG.get("CONFIRM_NEGOCIO_CLOSE_VENTAS")).done(function (
            data
          ) {
            if (data) closeVentas();
          });
        } else closeVentas();
      }
    });

  if ($.inArray("open_compras_negocio", params.buttons) != -1)
    buttons.push({
      name: "open_compras_negocio",
      icon: "ui-icon-unlocked",
      caption: "Reabrir proceso de compra",
      action: function () {
        //var id = $.unserialize(params.data()).id;
        var id = document.querySelector('.sheet').dataset.id
        confirm(MSG.get("CONFIRM_NEGOCIO_OPEN_COMPRAS")).done(function (
          data
        ) {
          if (data) {
            $.ajax({
              url: "/4DACTION/_V3_set" + params.entity,
              dataType: "json",
              data: {
                id: id,
                "negocio[compras]": true
              },
              success: function (data) {
                unblockCot();
                if (data.success) {
                  if (typeof params.presupuesto != "undefined")
                    unaBase.loadInto.viewport(
                      "/v3/views/presupuestos/content.shtml?id=" +
                      id +
                      "#tabs-2",
                      undefined,
                      undefined,
                      true
                    );
                  else
                    unaBase.loadInto.viewport(
                      "/v3/views/negocios/content.shtml?id=" +
                      id +
                      "#tabs-2",
                      undefined,
                      undefined,
                      true
                    );

                  toastr.success(
                    NOTIFY.get("SUCCESS_NEGOCIO_OPEN_COMPRAS")
                  );

                  //notify apertura de compras de negocio

                  // unaBase.inbox.send({
                  //   subject: `ha abierto las compras del negocio Nº${params.data().index} ${params.data().text}`,
                  //   into: "viewport",
                  //   href:
                  //     "/v3/views/negocios/content.shtml?id=" +
                  //     id,
                  //   tag: "avisos",
                  //   notifyId: 21,
                  //   id: params.data().id
                  // });

                  notifyNv.openCompras({
                    number: data.index,
                    text: params.data().text,
                    id: params.data().id
                  });
                } else {
                  if (data.opened) {
                    if (data.readonly)
                      toastr.error(
                        NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                      );
                  }
                }
              },
              error: function (xhr, text, error) {
                toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
              }
            });
          }
        });
      }
    });

  // Reabrir ventas negocio
  if ($.inArray("open_ventas_negocio", params.buttons) != -1)
    buttons.push({
      name: "open_ventas_negocio",
      icon: "ui-icon-unlocked",
      caption: "Reabrir proceso de venta",
      action: function () {
        //var id = $.unserialize(params.data()).id;
        var id = params.data().id;
        confirm(MSG.get("CONFIRM_NEGOCIO_OPEN_VENTAS")).done(function (
          data
        ) {
          if (data) {
            $.ajax({
              url: "/4DACTION/_V3_set" + params.entity,
              dataType: "json",
              data: {
                id: id,
                "negocio[ventas]": true
              },
              success: function (data) {
                unblockCot();
                if (data.success) {
                  if (typeof params.presupuesto != "undefined")
                    unaBase.loadInto.viewport(
                      "/v3/views/presupuestos/content.shtml?id=" +
                      id +
                      "#tabs-2",
                      undefined,
                      undefined,
                      true
                    );
                  else
                    unaBase.loadInto.viewport(
                      "/v3/views/negocios/content.shtml?id=" +
                      id +
                      "#tabs-2",
                      undefined,
                      undefined,
                      true
                    );

                  toastr.success(
                    NOTIFY.get("SUCCESS_NEGOCIO_OPEN_VENTAS")
                  );
                } else {
                  if (data.opened) {
                    if (data.readonly)
                      toastr.error(
                        NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                      );
                  }
                }
              },
              error: function (xhr, text, error) {
                toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
              }
            });
          }
        });
      }
    });

  if ($.inArray("accounting_create_opening", params.buttons) != -1) {
    buttons.push({
      name: "accounting_create_opening",
      icon: "ui-icon-calendar",
      caption: "Crear Apertura",
      action: function () {

        let fecha_periodo_from = "";
        let fecha_periodo_to = "";


        var htmlObject = $(
          `<section>
            <div class="container">
              <div class="input-group">
                <span class="input-group-text">Selecciona el año</span>
                <input type="number" aria-label="Año" class="form-control" min="2000" max="2030" step="1" value="2022" id="date_opening" />           
              </div>
            </div>
          </section>`
        );

        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);



        prompt(htmlObject).done(function (data) {

          let dateSel = htmlObject.find('input[id="date_opening"]')[0].value.trim();

          if (dateSel !== "") {
            var filters = unaBase.getFilters();
            var sortParams = {};

            filters += "&" + jQuery.param(sortParams);


            $.ajax({
              url: "/4DACTION/_light_set_accounting_create_op",
              dataType: "json",
              type: "POST",
              data: {
                create: true,
                year: dateSel

              },
              success: function (response) {
                if (response.success)
                  unaBase.loadInto.viewport('/v3/views/comprobantes/content.shtml?id=' + response.id);
                else
                  toastr.error(response.errorMsg.replaceAll(/SL/g, '<br>'));
              },
              error: function (xhr, text, error) {
                toastr.error("Hubo un error.");
                console.warn(error)
              },
            }).done(function (data) {


            });
          }



        })


      }
    });
  }

  if ($.inArray("close_negocio", params.buttons) != -1) {
    buttons.push({
      name: "close_negocio",
      icon: "ui-icon-locked",
      caption: "Cerrar negocio",
      action: function () {
        //var id = $.unserialize(params.data()).id;
        //var id = params.data().id;
        var id = $("#main-container").data("id");
        confirm(MSG.get("CONFIRM_NEGOCIO_CLOSE")).done(function (data) {
          if (data) {
            unblockCot();
            setTimeout(function () {
              $.ajax({
                url: "/4DACTION/_V3_setCierreByNegocio",
                dataType: "json",
                data: {
                  id: id,
                  close: true
                },
                success: function (data) {
                  if (data.success) {
                    if (data.detail.result) {
                      unaBase.loadInto.viewport(
                        "/v3/views/negocios/content.shtml?id=" + id,
                        undefined,
                        undefined,
                        true
                      );
                      toastr.success(NOTIFY.get("SUCCESS_NEGOCIO_CLOSE"));
                    } else
                      toastr.warning(
                        sprintf(
                          NOTIFY.get("WARNING_NEGOCIO_CLOSE"),
                          data.detail.data
                        )
                      );

                    //notify cierre  de negocio

                    // unaBase.inbox.send({
                    //   subject: `ha cerrado el negocio Nº${params.data().index} ${params.data().text}`,
                    //   into: "viewport",
                    //   href:
                    //     "/v3/views/negocios/content.shtml?id=" +
                    //     id,
                    //   tag: "avisos",
                    //   notifyId: 22,
                    //   id: params.data().id
                    // });
                    notifyNv.close({
                      number: params.data().index,
                      text: params.data().text,
                      id: params.data().id
                    });


                  } else {
                    if (data.opened) {
                      if (data.readonly)
                        toastr.error(
                          NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                        );
                    }
                  }
                },
                error: function (xhr, text, error) {
                  toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                }
              });
            }, 1000);
          }
        });
      }
    });

  }

  if ($.inArray("open_presupuesto", params.buttons) != -1) {
    buttons.push({
      name: "open_presupuesto",
      icon: "ui-icon-unlocked",
      caption: "Abrir presupuesto",
      action: function () {
        var id = $("#main-container").data("id");
        confirm("¿Estás seguro que deseas abrir el presupuesto?").done(function (data) {
          if (data) {
            setTimeout(function () {
              $.ajax({
                url: "/4DACTION/_V3_setCierreByPresupuesto",
                dataType: "json",
                data: {
                  id: id,
                  close: false
                },
                success: function (data) {

                  if (data.success) {
                    unaBase.loadInto.viewport(
                      "/v3/views/presupuestos/general.shtml?id=" + id,
                      undefined,
                      undefined,
                      true
                    );
                    toastr.success("Presupuesto abierto correctamente!");
                    // notifyNv.open({
                    //   number: params.data().index,
                    //   text: params.data().text,
                    //   id: params.data().id
                    // });
                  } else {
                    if (data.opened) {
                      if (data.readonly)
                        toastr.error(
                          NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                        );
                    }
                  }
                },
                error: function (xhr, text, error) {
                  toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                }
              });
            }, 1000);
          }
        });
      }
    });

  }

  if ($.inArray("close_presupuesto", params.buttons) != -1) {
    buttons.push({
      name: "close_presupuesto",
      icon: "ui-icon-locked",
      caption: "Cerrar presupuesto",
      action: function () {
        var id = $("#main-container").data("id");
        confirm("¿Estás seguro que deseas cerrar el presupuesto de gasto?").done(function (data) {
          if (data) {
            setTimeout(function () {
              $.ajax({
                url: "/4DACTION/_V3_setCierreByPresupuesto",
                dataType: "json",
                data: {
                  id: id,
                  close: true
                },
                success: function (data) {
                  if (data.success) {
                    if (data.detail.result) {
                      unaBase.loadInto.viewport(
                        "/v3/views/presupuestos/general.shtml?id=" + id,
                        undefined,
                        undefined,
                        true
                      );
                      toastr.success("Presupuesto de gasto cerrado correctamente!");
                    } else
                      toastr.warning(
                        sprintf(
                          NOTIFY.get("WARNING_NEGOCIO_CLOSE"),
                          data.detail.data
                        )
                      );
                  } else {
                    if (data.opened) {
                      if (data.readonly)
                        toastr.error(
                          NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                        );
                    }
                  }
                },
                error: function (xhr, text, error) {
                  toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                }
              });
            }, 1000);
          }
        });
      }
    });

  }

  if ($.inArray("open_negocio", params.buttons) != -1)
    buttons.push({
      name: "open_negocio",
      icon: "ui-icon-unlocked",
      caption: "Abrir negocio",
      action: function () {
        //var id = $.unserialize(params.data()).id;
        //var id = params.data().id;
        // var id = $('section.sheet').data('id');
        var id = $("#main-container").data("id");
        confirm(MSG.get("CONFIRM_NEGOCIO_OPEN")).done(function (data) {
          if (data) {
            unblockCot();
            setTimeout(function () {
              $.ajax({
                url: "/4DACTION/_V3_setCierreByNegocio",
                dataType: "json",
                data: {
                  id: id,
                  close: false
                },
                success: function (data) {
                  // unblockCot();
                  if (data.success) {
                    unaBase.loadInto.viewport(
                      "/v3/views/negocios/content.shtml?id=" + id,
                      undefined,
                      undefined,
                      true
                    );
                    toastr.success(NOTIFY.get("SUCCESS_NEGOCIO_OPEN"));
                    //notify cierre  de negocio

                    // unaBase.inbox.send({
                    //   subject: `ha abierto el negocio Nº${params.data().index} ${params.data().text}`,
                    //   into: "viewport",
                    //   href:
                    //     "/v3/views/negocios/content.shtml?id=" +
                    //     id,
                    //   tag: "avisos",
                    //   notifyId: 23,
                    //   id: params.data().id
                    // });

                    notifyNv.open({
                      number: params.data().index,
                      text: params.data().text,
                      id: params.data().id
                    });
                  } else {
                    if (data.opened) {
                      if (data.readonly)
                        toastr.error(
                          NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                        );
                    }
                  }
                },
                error: function (xhr, text, error) {
                  toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                }
              });
            }, 1000);
          }
        });
      }
    });

  /*if ($.inArray('clone', params.buttons) != -1)
    buttons.push({
      name: 'clone', icon: 'ui-icon-document', caption: 'Crear desde otro',
       action:  function() {
        var id = null;
        var selected = $('section#viewport > table > tbody > tr.ui-selected');
        if (selected.length == 0)
          id = $('section#viewport > section.sheet').data('id');
        else {
          if (selected.length == 1)
            id = selected.eq(0).data('id');
          else
            toastr.warning('Hay más de un ítem seleccionado. Debe seleccionar solamente uno');
        }
        if (id)
          $.ajax({
            url: '/4DACTION/_V3_clone' + params.entity,
            data: {
              id: id
            },
            dataType: 'json',
            type: 'POST'
          }).done( function(data) {
            unaBase.loadInto.viewport('/v3/views/cotizaciones/content.shtml?id=' + data.id);
          });
      }
    });
  */

  if ($.inArray("clone_current", params.buttons) != -1)
    buttons.push({
      name: "clone_current",
      icon: "ui-icon-copy",
      caption: "Duplicar",
      action: function () {
        var id = null;
        if ($("section#viewport div#main-container").length == 1) {
          id = $("section#viewport div#main-container").data("id");
        }

        if ($("section#content-cot-neg-fixed").length == 1) {
          id = $("section#content-cot-neg-fixed").data("id");
        }

        var cotizacionId = $("section.sheet").data("id");
        var module = $(".sidebar li.active").data("name");
        // var socketNew = io.connect(nodeUrl);
        var cotBlock = {
          id: cotizacionId,
          folio: $("#main-container .sheet").data("index"),
          user: $("html > body.menu.home > aside > div > div > h1").data("username"),
          // doc_name: $('.titulofinal').val(),
          // total: $('span[name="cotizacion[montos][subtotal_neto]"]').text(),
          block: false,
          module: "cotizaciones",
          from: "boton volver---"
        };



        window.onbeforeunload = function () {
          return "¿Está seguro que desea salir?";
        };

        if (id) {
          $.ajax({
            url: "/4DACTION/_V3_cloneCotizacion",
            data: {
              id: id
            },
            dataType: "json",
            type: "POST"
          }).done(function (data) {
            if (typeof params.presupuesto != "undefined") {

              unaBase.loadInto.viewport(
                "/v3/views/presupuestos/content.shtml?id=" + data.id,
                undefined,
                undefined,
                true
              );
            } else {

              //window.open(window.location.origin + "/4DACTION/wbienvenidos#/cotizaciones/content.shtml?id=" + data.id + "&clone=true", '_blank');
              unaBase.loadInto.viewport(
                "/v3/views/cotizaciones/content.shtml?id=" + data.id + "&clone=true",
                undefined,
                undefined,
                true
              );
            }

            if (params.entity == "Cotizacion")
              unaBase.log.save(
                "Ha duplicado " + etiqueta_cotizacion,
                "cotizaciones",
                $("section.sheet").data("index")
              );
            else
              unaBase.log.save(
                "Ha duplicado " + etiqueta_negocio,
                "negocios",
                $("#main-container").data("index")
              );
          });
        }
      }
    });

  if ($.inArray("print", params.buttons) != -1)
    buttons.push({
      name: "print",
      icon: "ui-icon-print",
      caption: "Imprimir listado",
      action: function () {
        alert("se manda a imprimir listado");
        /*
        $.ajax({
          url: '/4DACTION/_V3_set' + params.entity,
          dataType: 'json',
          type: 'POST'
        }).done( function(data) {
          alert('se imprimió con éxito');
        });
        */
      }
    });

  if ($.inArray("share_dtc", params.buttons) != -1)
    buttons.push({
      name: "share_dtc",
      icons: {
        primary: "ui-icon-extlink",
        secondary: "ui-icon-triangle-1-s"
      },
      caption: "Compartir",
      action: function () {
        //
      }
    });

  if ($.inArray("duplicate_gastos", params.buttons) != -1)
    buttons.push({
      name: "duplicate_gastos",
      icons: {
        primary: "ui-icon-copy"
      },
      caption: "Duplicar",
      action: function () {
        compras.duplicate();
      }
    });

  if ($.inArray("delete_dtc", params.buttons) != -1)
    buttons.push({
      name: "delete_dtc",
      icon: "ui-icon-trash",
      caption: "Eliminar",
      action: function () {
        $.ajax({
          url: "/4DACTION/_V3_checkPagosDtc",
          data: {
            id: dtc.id
          },
          dataType: "json",
          success: function (data) {
            if (data.success) {
              confirm(MSG.get("CONFIRM_DOCUMENT_DELETE")).done(function (
                data
              ) {
                if (data) {
                  var container = $("#sheet-dtc");
                  $.ajax({
                    url: "/4DACTION/_V3_setDtc",
                    data: {
                      "dtc[id]": dtc.id,
                      delete: true
                    },
                    dataType: "json",
                    success: function (data) {
                      if (typeof event != "undefined")
                        unaBase.history.back();
                    },
                    error: function (xhr, text, error) {
                      toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                    }
                  });
                }
              });
            } else {
              toastr.warning(
                "No es posible eliminar el documento. Existen pagos asociados."
              );
            }
          },
          error: function (xhr, text, error) {
            toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
          }
        });
      }
    });

  if ($.inArray("delete_dtcnc", params.buttons) != -1)
    buttons.push({
      name: "delete_dtcnc",
      icon: "ui-icon-trash",
      caption: "Eliminar",
      action: function () {
        confirm(MSG.get("CONFIRM_DOCUMENT_DELETE")).done(function (data) {
          if (data) {
            var container = $("#sheet-dtc");
            $.ajax({
              url: "/4DACTION/_V3_setDtcnc",
              data: {
                id: dtc.id,
                delete: true
              },
              dataType: "json",
              success: function (data) {
                if (typeof event != "undefined") unaBase.history.back();
              },
              error: function (xhr, text, error) {
                toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
              }
            });
          }
        });
      }
    });


  if ($.inArray("delete_dtcnd", params.buttons) != -1) {
    buttons.push({
      name: "delete_dtcnc",
      icon: "ui-icon-trash",
      caption: "Eliminar",
      action: function () {
        confirm(MSG.get("CONFIRM_DOCUMENT_DELETE")).done(function (data) {
          if (data) {
            unaBase.ui.block(); // Bloquear la UI antes de realizar la petición
            setTimeout(function () {
              $.ajax({
                url: "/4DACTION/_V3_setDtcnd",
                data: {
                  id: dtc.id,
                  delete: true
                },
                dataType: "json",
                success: function (data) {
                  try {
                    unaBase.loadInto.viewport('/v3/views/dtc/content.shtml?id=' + data.id);
                  } catch (error) {
                    console.error('Error al cargar el contenido:', error);
                    toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error al cargar el contenido"));
                  } finally {
                    unaBase.ui.unblock(); // Asegurarse de desbloquear la UI
                  }
                },
                error: function (xhr, text, error) {
                  console.error('Error en la petición AJAX:', error);
                  toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error en la petición AJAX"));
                  unaBase.ui.unblock(); // Desbloquear la UI si ocurre un error
                }
              });
            }, 1000); // Tiempo de espera de 1 segundo (1000 ms) antes de realizar la petición
          }
        });
      }
    });
  }


  if ($.inArray("convert_cotizacion", params.buttons) != -1)
    buttons.push({
      name: "convert_cotizacion",
      icon: "ui-icon-refresh",
      caption: "Convertir en cotización ",
      action: function () {
        var id = $("#main-container").data("id");
        var folio = $("#main-container").data("index");
        if (!totales?.summaryNegocioData?.rows?.[0]?.resumen?.gasto_real?.directo?.value) {
          toastr.error("Error: No se pudo obtener el gasto real. Verifique los datos.");
          return;
        }

        let gastoReal = totales.summaryNegocioData.rows[0].resumen.gasto_real.directo.value;
        let numericValue = parseFloat(gastoReal.replace(/,/g, '')) || 0;

        if (numericValue > 0 && !access._686) {
          toastr.warning("No es posible convertir a cotizacion ya que tiene gastos asociados");
          return;
        }


        if (access._485) {
          // Permiso para convertir neg. a cot.
          //var id = $.unserialize(params.data()).id;
          confirm(MSG.get("CONFIRM_NEGOCIO_CONVERT")).done(function (
            data
          ) {
            if (data) {

              $.ajax({
                //url: '/4DACTION/_V3_set' + params.entity,
                url: "/4DACTION/_V3_set" + params.entity,
                dataType: "json",
                data: {
                  id: id,
                  "cotizacion[negocio]": false
                },
                success: function (data) {
                  if (data.success) {


                    $("#version").html(data.index);
                    toastr.success(NOTIFY.get("SUCCESS_NEGOCIO_CONVERT"));

                    // Notificación "Ha convertido a cotización el negocio" / "Ha convertido a cotización el negocio facturado"
                    var sid = "";
                    $.each($.cookie(), function (clave, valor) {
                      if (clave == hash && valor.match(/UNABASE/g))
                        sid = valor;
                    });

                    var textFacturado = "";
                    if (negocioFacturado) {
                      textFacturado = " facturado";
                    }
                    var cotizacionId = $("section.sheet").data("id");
                    var module = $(".sidebar li.active").data("name");
                    // var socketNew = io.connect(nodeUrl);
                    var cotBlock = {
                      id: cotizacionId,
                      folio: $("#main-container .sheet").data("index"),
                      user: $("html > body.menu.home > aside > div > div > h1").data(
                        "username"
                      ),
                      // doc_name: $('.titulofinal').val(),
                      // total: $('span[name="cotizacion[montos][subtotal_neto]"]').text(),
                      block: false,
                      module: module,
                      from: "boton volver---"
                    };

                    // $.ajax({
                    //   url: "/4DACTION/_V3_block_by_use",
                    //   data: {
                    //     id: cotizacionId,
                    //     module: module,
                    //     block: false,
                    //     list: false
                    //   },
                    //   dataType: "json",
                    //   async: false,
                    //   success: function (datas) {
                    //     // data.rows.push(cotBlock);
                    //     // if(!uVar.unableSocket){
                    //     //  socketNew.emit('sendblock', datas.rows);
                    //     //  socketNew.emit('sendblockAdd', cotBlock);
                    //     // }
                    //   },
                    //   error: function (xhr, text, error) {
                    //     toastr.error(
                    //       NOTIFY.get("ERROR_INTERNAL", "Error")
                    //     );
                    //   }
                    // });

                    // window.onbeforeunload = function () {
                    //   return "¿Está seguro que desea salir?";
                    // };
                    //socket_ub.emit('stop editing', { sid: unaBase.sid.encoded(), username, hostname: window.origin, id: unaBase.doc.id, module });

                    unaBase.inbox.send(
                      {
                        subject:
                          "Ha convertido a cotización el negocio" +
                          textFacturado +
                          " Nº " +
                          data.index +
                          " / " +
                          $("section.sheet")
                            .find(
                              'input[name="cotizacion[titulo][text]"]'
                            )
                            .val(),
                        into: "viewport",
                        href:
                          "/v3/views/cotizaciones/content.shtml?id=" +
                          data.id,
                        tag: "avisos",
                        attach: true // boolean
                      },
                      async function () {
                        unaBase.loadInto.viewport(
                          "/v3/views/cotizaciones/content.shtml?id=" +
                          data.id,
                          undefined,
                          undefined,
                          true
                        );
                      }
                    );
                  } else {
                    if (data.opened) {
                      if (data.readonly)
                        toastr.error(
                          NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                        );
                    }
                  }
                },
                error: function (xhr, text, error) {
                  toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                }
              });

              // Verifica si existe una solicitud de convertir a negocio y que usuario convirtiendo tenga permiso de autorizar.
              // En el caso que sí. Se envía un correo notificando su aprobación.
              if (access._495) {
                var arrayMsg = verifyActiveRequest({
                  id: id,
                  subject: "Solicita Modificar Negocio"
                });
                if (arrayMsg.length > 0) {
                  $.each(arrayMsg, function (i, item) {
                    //EMAIL
                    // unaBase.email.notify
                    //notify: async function(to, template, document, index, title, extra, detail_uri, id_item, attach) {
                    var url = "cotizaciones/content.shtml";
                    unaBase.email.notify(
                      item.from.username,
                      "notify",
                      "Ha Autorizado Modificar Negocio Nº " + folio,
                      undefined,
                      undefined,
                      undefined,
                      url,
                      id
                    );

                    //INBOX
                    unaBase.inbox.send({
                      to: item.from.username,
                      subject:
                        "Ha Autorizado Modificar Negocio Nº " + folio,
                      into: "viewport",
                      href:
                        "/v3/views/cotizaciones/content.shtml?id=" + id,
                      tag: "avisos"
                    });
                  });
                }
              }
            }
          });
        } else {
          var url =
            "/v3/views/negocios/sol_convert_cotizacion.shtml?id=" + id;
          unaBase.loadInto.dialog(
            url,
            "AUTORIZACIÓN MODIFICACIÓN DEL NEGOCIO",
            "small"
          );
        }
      }
    });

  if ($.inArray("control_cambios", params.buttons) != -1) {

    buttons.push({
      name: "control_cambios",
      icon: "ui-icon-check",
      caption: "Control de cambios",
      action: function () {
        const id_nv = $('.sheet').data('id')
        var url =
          nodeUrl +
          "/control-changes/?download=true" +
          "&id=" +
          id_nv +
          "&sid=" +
          unaBase.sid.encoded() +
          "&hostname=" +
          window.location.origin

        var download = window.open(url);
        download.blur();
        window.focus();
      }
    });
  }
  if ($.inArray("convert_negocio", params.buttons) != -1) {
    buttons.push({
      name: "convert_negocio",
      icon: "ui-icon-refresh",
      caption: "Convertir en negocio",
      action: function () {
        let continueAction = () => {

          // Valida que los datos adicionales estén presentes antes de convertir a negocio
          var isValidFechaFacturacion = true
          if ($('input[name="cotizacion[condiciones][fecha_de_facturacion_datepicker]"]').val() !== undefined) {
            isValidFechaFacturacion = $('input[name="cotizacion[condiciones][fecha_de_facturacion_datepicker]"]').val() !== '00-00-00' ? true : false;
          }

          if (!isValidFechaFacturacion) {
            toastr.error(
              "No es posible convertir a negocio. Falta completar datos adicionales.<br/>- Falta seleccionar fecha estimada de facturacion."
            );
            return
          }

          var is_invalid = false;
          $("section.sheet article.general-data")
            .find("li")
            .each(function () {
              var input = $(this).find("input");

              if (input.prop("required") && input.val().length == 0) {
                is_invalid = true;
                input.addClass("invalid");
              } else input.removeClass("invalid");
            });

          if (is_invalid)
            toastr.error(
              "No es posible convertir a negocio. Falta completar datos adicionales."
            );
          else
            confirm(MSG.get("CONFIRM_COTIZACION_CONVERT")).done(function (
              data
            ) {
              if (data) {
                document.querySelector("#loading-screen").style.display = ''
                goLeft_up();

                var width = $(window).width();
                var height = $(window).height();
                var widthminus = width - 500;
                var heightminus = height - 600;
                function goRight_down() {
                  $("#img-loading").stop().animate({
                    left: widthminus,
                    top: 100 - heightminus
                  }, 950, function () {
                    goLeft_up();
                  });
                }
                function goLeft_up() {
                  $("#img-loading").stop().animate({
                    left: 0,
                    top: heightminus
                  }, 950, function () {
                    let cont = 0;
                    goRight_down();

                  });
                }

                function myStopFunction() {
                  document.querySelector("#loading-screen").style.display = 'none'
                  //clearTimeout(time);
                }
                $.ajax({
                  url: "/4DACTION/_V3_setVersionByCotizacion",
                  data: {
                    id: $("section.sheet").data("id")
                  },
                  dataType: "json",
                  success: function (data) {
                    if (data.success) {
                      toastr.info(NOTIFY.get("INFO_COTIZACION_VERSION"));
                      $("#version").html(data.index);

                      var ajaxData = params.data();

                      $.extend(ajaxData, ajaxData, {
                        id: params.data().id,
                        "cotizacion[negocio]": true
                      });

                      $.ajax({
                        url: "/4DACTION/_V3_set" + params.entity,
                        dataType: "json",
                        data: ajaxData,
                        success: function (data) {
                          if (data.success) {
                            //toastr.info('Cotización convertida a negocio!');
                            toastr.success(
                              NOTIFY.get("SUCCESS_COTIZACION_CONVERT")
                            );
                            myStopFunction();


                            var sid = "";
                            $.each($.cookie(), function (clave, valor) {
                              if (clave == hash && valor.match(/UNABASE/g))
                                sid = valor;
                            });
                            var cotizacionId = $("section.sheet").data(
                              "id"
                            );
                            var module = $(".sidebar li.active").data(
                              "name"
                            );
                            // var socketNew = io.connect(nodeUrl);
                            var cotBlock = {
                              id: cotizacionId,
                              folio: $("#main-container .sheet").data(
                                "index"
                              ),
                              user: $(
                                "html > body.menu.home > aside > div > div > h1"
                              ).data("username"),
                              // doc_name: $('.titulofinal').val(),
                              // total: $('span[name="cotizacion[montos][subtotal_neto]"]').text(),
                              block: false,
                              module: module,
                              from: "boton volver---"
                            };

                            // $.ajax({
                            //   url: "/4DACTION/_V3_block_by_use",
                            //   data: {
                            //     id: cotizacionId,
                            //     module: module,
                            //     block: false,
                            //     list: false
                            //   },
                            //   dataType: "json",
                            //   async: false,
                            //   success: function (datas) {
                            //     // data.rows.push(cotBlock);
                            //     // if(!uVar.unableSocket){
                            //     //  socketNew.emit('sendblock', datas.rows);
                            //     //  socketNew.emit('sendblockAdd', cotBlock);
                            //     // }
                            //   },
                            //   error: function (xhr, text, error) {
                            //     toastr.error(
                            //       NOTIFY.get("ERROR_INTERNAL", "Error")
                            //     );
                            //   }
                            // });

                            // window.onbeforeunload = function () {
                            //   return "¿Está seguro que desea salir?";
                            // };


                            unaBase.inbox.send(
                              {
                                subject:
                                  "Ha convertido a negocio la cotización Nº " +
                                  data.index +
                                  " / " +
                                  $("section.sheet")
                                    .find(
                                      'input[name="cotizacion[titulo][text]"]'
                                    )
                                    .val(),
                                into: "viewport",
                                href:
                                  "/v3/views/negocios/content.shtml?id=" +
                                  data.id,
                                tag: "avisos",
                                attach: mostrar_compartir_carta_cliente
                                  ? [
                                    {
                                      cid:
                                        "Negocio_" + data.index + ".pdf",
                                      url:
                                        nodeUrl +
                                        "/print/?entity=negocios&id=" +
                                        data.id +
                                        "&folio=" +
                                        data.index +
                                        "&sid=" +
                                        unaBase.sid.encoded() +
                                        "&horizontal=true&port=" +
                                        window.location.port +
                                        "&hostname=" +
                                        window.location.origin
                                    },
                                    {
                                      cid:
                                        "CartaCliente_" +
                                        data.index +
                                        ".pdf",
                                      //var url = 'http://' + nodejs_public_ipaddr + ':' + nodejs_port + '/download/?download=true&entity=carta_cliente&id=' + params.data().id + '&folio=' + ((typeof $('section.sheet').data('index') != 'undefined')? $('section.sheet').data('index') : 'S/N')+ '&sid=' + unaBase.sid.encoded() + '&preview=false&nullified=' + params.data().readonly + '&aliasfiles=' + file_name_oficial_cot;
                                      url:
                                        nodeUrl +
                                        "/download/?download=true&entity=carta_cliente&id=" +
                                        data.id +
                                        "&folio=" +
                                        data.index +
                                        "&sid=" +
                                        unaBase.sid.encoded() +
                                        "&preview=false&nullified=false&aliasfiles=CartaCliente_." +
                                        data.index +
                                        "pdf&port=" +
                                        window.location.port +
                                        "&hostname=" +
                                        window.location.origin
                                    }
                                  ]
                                  : [
                                    {
                                      cid:
                                        "Negocio_" + data.index + ".pdf",
                                      url:
                                        nodeUrl +
                                        "/print/?entity=negocios&id=" +
                                        data.id +
                                        "&folio=" +
                                        data.index +
                                        "&sid=" +
                                        unaBase.sid.encoded() +
                                        "&horizontal=true&port=" +
                                        window.location.port +
                                        "&hostname=" +
                                        window.location.origin
                                    }
                                  ]
                              },
                              function () {
                                unaBase.loadInto.viewport(
                                  "/v3/views/negocios/content.shtml?id=" +
                                  params.data().id,
                                  undefined,
                                  undefined,
                                  true
                                );
                              }
                            );
                          } else {
                            if (data.opened) {
                              if (data.readonly)
                                toastr.error(
                                  NOTIFY.get(
                                    "ERROR_RECORD_READONLY",
                                    "Error"
                                  )
                                );
                            }
                          }
                        },
                        error: function (xhr, text, error) {
                          toastr.error(
                            NOTIFY.get("ERROR_INTERNAL"),
                            "Error"
                          );
                        }
                      });
                    }
                  }
                });
              }
            });
        }


        //Verificar cuenta contable negocios
        if (unaBase.parametros.accounting_anticipos_contactos) {
          if (params.entity == 'Cotizacion') {
            const cuenta_ctble = document.getElementById('cuenta_contable_nv')
            if (cuenta_ctble && cuenta_ctble.value === '0') {
              unaBase.ui.unblock()
              toastr.warning("No es posible convertir a negocio sin una cuenta contable seleccionada");
              return;
            }
          }
        }

        saveAction(continueAction, params);








      }
    });
  }

  if ($.inArray("request_convert_negocio", params.buttons) != -1)
    buttons.push({
      name: "request_convert_negocio",
      icon: "ui-icon-mail-closed",
      caption: "Solicitud para convertir a negocio",
      action: function () {
        confirm(MSG.get("CONFIRM_REQUEST_CONVERT_TO_NEGOCIO")).done(
          function (data) {
            if (data) {
              unaBase.inbox.send({
                subject: "Ha solicitado convertir a negocio",
                into: "viewport",
                href:
                  "/v3/views/cotizaciones/content.shtml?id=" +
                  $("section.sheet").data("id"),
                tag: "solicitudes"
              });
            }
          }
        );
      }
    });

  if ($.inArray("download-dtc", params.buttons) != -1) {
    buttons.push({
      name: "download-dtc",
      icon: "ui-icon-arrow-1-s",
      caption: "Descargar",
      action: function () {
        let id = $('#sheet-dtc').data('id')

        $.ajax({
          'url': '/4DACTION/_V3_proxy_getDtcContent',
          data: {
            "id": id,
            "api": true
          },
          dataType: 'json',
          async: false,
          success: function (data) {

            dtc.data = data;

          }
        });
        dtc.id = dtc.data.id;
        dtc.estado = dtc.data.estado;
        dtc.idcomp = dtc.data.idComprobante;
        dtc.idCargaLista = dtc.data.idCargaLista;
        dtc.isLibroBoleta = dtc.data.isLibroBoleta;
        var url = dtc.data.urlCargaLista;
        let iddtc = dtc.idCargaLista != 0 ? dtc.idCargaLista : dtc.id

        if (url === '') {

          let alias = dtc.data.id_tipo_doc === '66' ? 'BH' : ''
          url =
            nodeUrl +
            "/download-pdf-dtc/?download=true&entity=conexion_sii" +
            "&id=" +
            iddtc +
            "&iddtc=" +
            dtc.id +
            "&folio=" +
            dtc.data.folio +
            "&sid=" +
            unaBase.sid.encoded() +
            "&aliasfiles=" +
            alias +
            "&hostname=" +
            window.location.origin



        }
        var download = window.open(url);
        download.blur();
        window.focus();
      }
    });



  }

  if ($.inArray("anular_dtcnd", params.buttons) != -1) {
    buttons.push({
      name: "discard",
      icon: "ui-icon-cancel",
      caption: "Anular",
      action: function () {
        var anular = true;
        var element = $(this);

        if (anular) {
          confirm(MSG.get("CONFIRM_DOCUMENT_NULLIFY")).done(function (
            data
          ) {
            if (data) {
              var htmlObject = $(
                '<section> \
                  <span>Ingresar motivo anulación</span> \
                  <input required readonly type="search" name="motivo"> \
                  <button class="show motivo-anulacion">Ver motivos de anulación</button> \
                </section>'
              );
              htmlObject
                .find('input[type="search"]')
                .autocomplete({
                  source: function (request, response) {
                    $.ajax({
                      url: "/4DACTION/_V3_" + "getMotivoAnulacion",
                      dataType: "json",
                      data: {
                        //q: request.term
                        modulo: params.entity
                      },
                      success: function (data) {
                        response(
                          $.map(data.rows, function (item) {
                            return item;
                          })
                        );
                      }
                    });
                  },
                  minLength: 0,
                  delay: 5,
                  position: {
                    my: "left top",
                    at: "left bottom",
                    collision: "flip"
                  },
                  open: function () {
                    $(this)
                      .removeClass("ui-corner-all")
                      .addClass("ui-corner-top");
                  },
                  close: function () {
                    $(this)
                      .removeClass("ui-corner-top")
                      .addClass("ui-corner-all");
                  },
                  focus: function (event, ui) {
                    $(this).val(ui.item.text);
                    return false;
                  },
                  select: function (event, ui) {
                    $(this).val(ui.item.text);
                    htmlObject.data("response", $(this).val());
                    return false;
                  }
                })
                .data("ui-autocomplete")._renderItem = function (
                  ul,
                  item
                ) {
                  return $(
                    "<li><a><span>" + item.text + "</span></a></li>"
                  ).appendTo(ul);
                };

              htmlObject
                .find("button.show.motivo-anulacion")
                .button({
                  icons: {
                    primary: "ui-icon-carat-1-s"
                  },
                  text: false
                })
                .click(function () {
                  htmlObject
                    .find('input[type="search"]')
                    .autocomplete("search", "@");
                });

              prompt(htmlObject).done(function (data) {
                var enteredMessage = data;
                //if (data !== false) {

                $.ajax({
                  url: "/4DACTION/_V3_set" + params.entity,
                  dataType: "json",
                  data: {
                    //$('section.sheet').data('id')
                    id: params.data().id,
                    "cotizacion[estado]": false,
                    "cotizacion[estado][observaciones]": data,
                    "oc[id]": $("section.sheet").data("id"),
                    "oc[anular]": true,
                    "oc[anular][observaciones]": data,
                    nullify: true, // TODO: este deberia ser el parámetro definitivo para anular genérico
                    comment: data
                  },
                  success: function (data) {

                    if (data.success) {
                      var id = $("section.sheet").data("id");
                      //toastr.info('El Documento ha sido anulado!');
                      toastr.info(NOTIFY.get("SUCCESS_DOCUMENT_NULLIFY"));

                      // TODO: implementar un URI handler
                      switch (params.entity) {
                        case "Cotizacion":
                          unblockCot();
                          unaBase.inbox.send({
                            subject:
                              "Ha anulado la cotización Nº " +
                              $("section.sheet").data("index") +
                              " / " +
                              $("section.sheet")
                                .find(
                                  'input[name="cotizacion[titulo][text]"]'
                                )
                                .val(),
                            into: "viewport",
                            href:
                              "/v3/views/cotizaciones/content.shtml?id=" +
                              data.id,
                            tag: "avisos",
                            text: enteredMessage
                          });
                          // Omite el historial si se redirige a la misma página por anulación
                          unaBase.loadInto.viewport(
                            "/v3/views/cotizaciones/content.shtml?id=" +
                            id,
                            undefined,
                            undefined,
                            true
                          );
                          break;
                        case "Negocios": //presupuestos
                          unblockCot();
                          unaBase.inbox.send({
                            subject:
                              "Ha anulado el presupuesto Nº " +
                              $("section.sheet").data("index") +
                              " / " +
                              $("section.sheet")
                                .find(
                                  'input[name="cotizacion[titulo][text]"]'
                                )
                                .val(),
                            into: "viewport",
                            href:
                              "/v3/views/presupuestos/content.shtml?id=" +
                              data.id,
                            tag: "avisos",
                            text: enteredMessage
                          });
                          // Omite el historial si se redirige a la misma página por anulación
                          unaBase.loadInto.viewport(
                            "/v3/views/presupuestos/content.shtml?id=" +
                            id,
                            undefined,
                            undefined,
                            true
                          );
                          break;
                        case "Compras":
                          // unaBase.loadInto.viewport('/v3/views/compras/list_basico.shtml');
                          if ($("#sheet-compras").data("factoring")) {
                            unaBase.loadInto.viewport(
                              "/v3/views/compras/content_factoring.shtml?id=" +
                              id,
                              undefined,
                              undefined,
                              true
                            );
                          } else {
                            unaBase.loadInto.viewport(
                              "/v3/views/compras/content.shtml?id=" + id,
                              undefined,
                              undefined,
                              true
                            );
                          }
                          break;
                        case "Pago":
                          /*$('.ui-dialog fieldset.pago').data('nullified', true);
                          $('.ui-dialog header').hide();
                          $('.ui-dialog input, .ui-dialog textarea').attr('readonly', true);
                          $('section.sheet table.pagos').trigger('refresh');
                          $('section.sheet table.dtcs').trigger('refresh');*/
                          // unaBase.loadInto.viewport('/v3/views/pagos/content2.shtml?id=' + payment.id, undefined, undefined, true);
                          unaBase.history.back();
                          break;
                        case "Ingreso":
                          $(".ui-dialog fieldset.ingreso").data(
                            "nullified",
                            true
                          );
                          $(".ui-dialog header").hide();
                          $(".ui-dialog input, .ui-dialog textarea").attr(
                            "readonly",
                            true
                          );
                          //$('section.sheet table.ordenesingreso').trigger('refresh');

                          // si anula desde lista ingreso
                          if (element.length > 0) {
                            if ($(element).parentTo(".ui-dialog-content").length > 0) {
                              if ($("#search").length > 0) {
                                unaBase.toolbox.search._advancedSearch(true);
                              }
                              $(element).parentTo(".ui-dialog-content").dialog("close");
                            }
                          }

                          // si anula desde dtv
                          if ($('section.sheet-dtv').length > 0) {
                            dtv.display();
                          }

                          break;
                        case "Dtc":
                          unaBase.history.back();
                        case "Dtcnc":
                          unaBase.history.back();
                      }

                      //unaBase.utilities.updateIncomeVx(params.entity)
                    } else {
                      if (data.opened) {
                        if (data.readonly)
                          toastr.error(
                            NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                          );
                      }
                    }
                  },
                  error: function (xhr, text, error) {
                    toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                  }
                });
                //}
              });
            }
          });
        }
      }
    });

  }


  if ($.inArray("discard", params.buttons) != -1)
    buttons.push({
      name: "discard",
      icon: "ui-icon-cancel",
      caption: "Anular",
      action: function () {
        var anular = true;
        var element = $(this);

        if (params.entity == "Compras") {
          if (!_validationDocAsociadosOC()) {
            if ($("#sheet-compras").data("factoring")) {
              // toastr.warning(NOTIFY.get('WARNING_FACTORING_NULLIFY'));
              alert(NOTIFY.get("WARNING_FACTORING_NULLIFY"));
            } else {
              // toastr.warning(NOTIFY.get('WARNING_GASTO_NULLIFY'));
              alert(NOTIFY.get("WARNING_GASTO_NULLIFY"));
            }
            anular = false;
          }
        }
        if (params.entity == "Dtc") {
          $.ajax({
            url: "/4DACTION/_V3_checkPagosDtc",
            data: {
              id: dtc.id
            },
            dataType: "json",
            async: false,
            success: function (data) {
              if (!data.success) {
                toastr.warning(
                  "No es posible anular el documento. Existen pagos asociados."
                );
                anular = false;
              }
            },
            error: function (xhr, text, error) {
              toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
            }
          });
        }
        if (params.entity == "Pago") {
          // Verificar antes de anular
          if ($('.ui-dialog table > tbody > tr:not([data-new="true"]):first-of-type > td:nth-of-type(6)')
            .text()
            .toUpperCase() != "NULO" &&
            $(".ui-dialog table > tbody > tr").length > 0
          ) {
            toastr.warning(
              "No es posible anular la orden de pago. Hay documentos de pago vigentes."
            );
            anular = false;
          }
        }
        if (params.entity == "Ingreso") {
          // Verificar antes de anular
          if (
            $(
              '.ui-dialog table#docingreso > tbody > tr:not([data-new="true"]):first-of-type > td:nth-of-type(6)'
            )
              .text()
              .toUpperCase() != "NULO" &&
            $(".ui-dialog table#docingreso > tbody > tr").length > 0
          ) {
            toastr.warning(
              "No es posible anular la orden de ingreso. Hay documentos de pago vigentes."
            );
            anular = false;
          }
        }
        if (params.entity == "Cotizacion") {
          //-- ini -- modificado el 07-11-17 - por gin para verificar si tiene docs antes de anular
          anular = false;
          var info = cotizacion.verifyHasDocs(
            $("section.sheet").data("id")
          );
          if (info.success) {
            anular = true;
          } else {
            var text = "";
            if (info.invoices > 0)
              if (info.invoices == 1)
                text = "- Una Factura de venta.<br>";
              else
                text = "-" + info.invoices + " Facturas de ventas.<br>";

            if (info.purchases_oc > 0)
              if (info.purchases_oc == 1)
                text += "- Una Orden de compra.<br>";
              else
                text +=
                  "-" + info.purchases_oc + " Órdenes de compras.<br>";

            if (info.purchases_fxr > 0)
              if (info.purchases_fxr == 1)
                text += "- Una Rendición de fondo.<br>";
              else
                text +=
                  "-" + info.purchases_fxr + " Rendiciones de fondo.<br>";

            toastr.warning(
              "No es posible anular la cotización. Tiene documentos asociados:<br><br>" +
              text
            );
          }

          /*$.ajax({
            url: '/4DACTION/_V3_getOrdenesByNegocio',
            data: {
              id: $('section.sheet').data('id')
            },
            dataType: 'json',
            async: false,
            success: function(data) {
              if (data.rows.length > 0) {
                for (var i = 0; i < data.rows.length; i++) {
                  if (data.rows[i].estado != 'ANULADA') {
                    anular = false;
                    break;
                  }
                }
              }
            }
          })
          if (!anular)
            toastr.warning('No es posible anular la cotización. Hay OC de proveedores vigentes.');*/

          //-- fin -- modificado el 07-11-17 - por gin para verificar si tiene docs antes de anular
        }
        if (params.entity == "presupuestos") {
          //-- ini -- modificado el 07-11-17 - por gin para verificar si tiene docs antes de anular
          anular = false;
          var info = cotizacion.verifyHasDocs(
            $("section.sheet").data("id")
          );
          if (info.success) {
            anular = true;
          } else {
            var text = "";
            if (info.invoices > 0)
              if (info.invoices == 1)
                text = "- Una Factura de venta.<br>";
              else
                text = "-" + info.invoices + " Facturas de ventas.<br>";

            if (info.purchases_oc > 0)
              if (info.purchases_oc == 1)
                text += "- Una Orden de compra.<br>";
              else
                text +=
                  "-" + info.purchases_oc + " Órdenes de compras.<br>";

            if (info.purchases_fxr > 0)
              if (info.purchases_fxr == 1)
                text += "- Una Rendición de fondo.<br>";
              else
                text +=
                  "-" + info.purchases_fxr + " Rendiciones de fondo.<br>";

            toastr.warning(
              "No es posible anular el presupuestos. Tiene documentos asociados:<br><br>" +
              text
            );
          }

          /*$.ajax({
            url: '/4DACTION/_V3_getOrdenesByNegocio',
            data: {
              id: $('section.sheet').data('id')
            },
            dataType: 'json',
            async: false,
            success: function(data) {
              if (data.rows.length > 0) {
                for (var i = 0; i < data.rows.length; i++) {
                  if (data.rows[i].estado != 'ANULADA') {
                    anular = false;
                    break;
                  }
                }
              }
            }
          })
          if (!anular)
            toastr.warning('No es posible anular la cotización. Hay OC de proveedores vigentes.');*/

          //-- fin -- modificado el 07-11-17 - por gin para verificar si tiene docs antes de anular
        }

        if (anular) {
          confirm(MSG.get("CONFIRM_DOCUMENT_NULLIFY")).done(function (
            data
          ) {
            if (data) {
              var htmlObject = $(
                '<section> \
                  <span>Ingresar motivo anulación</span> \
                  <input required readonly type="search" name="motivo"> \
                  <button class="show motivo-anulacion">Ver motivos de anulación</button> \
                </section>'
              );
              htmlObject
                .find('input[type="search"]')
                .autocomplete({
                  source: function (request, response) {
                    $.ajax({
                      url: "/4DACTION/_V3_" + "getMotivoAnulacion",
                      dataType: "json",
                      data: {
                        //q: request.term
                        modulo: params.entity
                      },
                      success: function (data) {
                        response(
                          $.map(data.rows, function (item) {
                            return item;
                          })
                        );
                      }
                    });
                  },
                  minLength: 0,
                  delay: 5,
                  position: {
                    my: "left top",
                    at: "left bottom",
                    collision: "flip"
                  },
                  open: function () {
                    $(this)
                      .removeClass("ui-corner-all")
                      .addClass("ui-corner-top");
                  },
                  close: function () {
                    $(this)
                      .removeClass("ui-corner-top")
                      .addClass("ui-corner-all");
                  },
                  focus: function (event, ui) {
                    $(this).val(ui.item.text);
                    return false;
                  },
                  select: function (event, ui) {
                    $(this).val(ui.item.text);
                    htmlObject.data("response", $(this).val());
                    return false;
                  }
                })
                .data("ui-autocomplete")._renderItem = function (
                  ul,
                  item
                ) {
                  return $(
                    "<li><a><span>" + item.text + "</span></a></li>"
                  ).appendTo(ul);
                };

              htmlObject
                .find("button.show.motivo-anulacion")
                .button({
                  icons: {
                    primary: "ui-icon-carat-1-s"
                  },
                  text: false
                })
                .click(function () {
                  htmlObject
                    .find('input[type="search"]')
                    .autocomplete("search", "@");
                });

              prompt(htmlObject).done(function (data) {
                var enteredMessage = data;
                //if (data !== false) {

                $.ajax({
                  url: "/4DACTION/_V3_set" + params.entity,
                  dataType: "json",
                  data: {
                    //$('section.sheet').data('id')
                    id: params.data().id,
                    "cotizacion[estado]": false,
                    "cotizacion[estado][observaciones]": data,
                    "oc[id]": $("section.sheet").data("id"),
                    "oc[anular]": true,
                    "oc[anular][observaciones]": data,
                    nullify: true, // TODO: este deberia ser el parámetro definitivo para anular genérico
                    comment: data
                  },
                  success: function (data) {

                    if (data.success) {
                      var id = $("section.sheet").data("id");
                      //toastr.info('El Documento ha sido anulado!');
                      toastr.info(NOTIFY.get("SUCCESS_DOCUMENT_NULLIFY"));

                      // TODO: implementar un URI handler
                      switch (params.entity) {
                        case "Cotizacion":
                          unblockCot();
                          unaBase.inbox.send({
                            subject:
                              "Ha anulado la cotización Nº " +
                              $("section.sheet").data("index") +
                              " / " +
                              $("section.sheet")
                                .find(
                                  'input[name="cotizacion[titulo][text]"]'
                                )
                                .val(),
                            into: "viewport",
                            href:
                              "/v3/views/cotizaciones/content.shtml?id=" +
                              data.id,
                            tag: "avisos",
                            text: enteredMessage
                          });
                          // Omite el historial si se redirige a la misma página por anulación
                          unaBase.loadInto.viewport(
                            "/v3/views/cotizaciones/content.shtml?id=" +
                            id,
                            undefined,
                            undefined,
                            true
                          );
                          break;
                        case "Negocios": //presupuestos
                          unblockCot();
                          unaBase.inbox.send({
                            subject:
                              "Ha anulado el presupuesto Nº " +
                              $("section.sheet").data("index") +
                              " / " +
                              $("section.sheet")
                                .find(
                                  'input[name="cotizacion[titulo][text]"]'
                                )
                                .val(),
                            into: "viewport",
                            href:
                              "/v3/views/presupuestos/content.shtml?id=" +
                              data.id,
                            tag: "avisos",
                            text: enteredMessage
                          });
                          // Omite el historial si se redirige a la misma página por anulación
                          unaBase.loadInto.viewport(
                            "/v3/views/presupuestos/content.shtml?id=" +
                            id,
                            undefined,
                            undefined,
                            true
                          );
                          break;
                        case "Compras":
                          // unaBase.loadInto.viewport('/v3/views/compras/list_basico.shtml');
                          if ($("#sheet-compras").data("factoring")) {
                            unaBase.loadInto.viewport(
                              "/v3/views/compras/content_factoring.shtml?id=" +
                              id,
                              undefined,
                              undefined,
                              true
                            );
                          } else {
                            unaBase.loadInto.viewport(
                              "/v3/views/compras/content.shtml?id=" + id,
                              undefined,
                              undefined,
                              true
                            );
                          }
                          break;
                        case "Pago":
                          /*$('.ui-dialog fieldset.pago').data('nullified', true);
                          $('.ui-dialog header').hide();
                          $('.ui-dialog input, .ui-dialog textarea').attr('readonly', true);
                          $('section.sheet table.pagos').trigger('refresh');
                          $('section.sheet table.dtcs').trigger('refresh');*/
                          // unaBase.loadInto.viewport('/v3/views/pagos/content2.shtml?id=' + payment.id, undefined, undefined, true);
                          unaBase.history.back();
                          break;
                        case "Ingreso":
                          $(".ui-dialog fieldset.ingreso").data(
                            "nullified",
                            true
                          );
                          $(".ui-dialog header").hide();
                          $(".ui-dialog input, .ui-dialog textarea").attr(
                            "readonly",
                            true
                          );
                          //$('section.sheet table.ordenesingreso').trigger('refresh');

                          // si anula desde lista ingreso
                          if (element.length > 0) {
                            if ($(element).parentTo(".ui-dialog-content").length > 0) {
                              if ($("#search").length > 0) {
                                unaBase.toolbox.search._advancedSearch(true);
                              }
                              $(element).parentTo(".ui-dialog-content").dialog("close");
                            }
                          }

                          // si anula desde dtv
                          if ($('section.sheet-dtv').length > 0) {
                            dtv.display();
                          }

                          break;
                        case "Dtc":
                          unaBase.history.back();
                        case "Dtcnc":
                          unaBase.history.back();
                      }

                      //unaBase.utilities.updateIncomeVx(params.entity)
                    } else {
                      if (data.opened) {
                        if (data.readonly)
                          toastr.error(
                            NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                          );
                      }
                    }
                  },
                  error: function (xhr, text, error) {
                    toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                  }
                });
                //}
              });
            }
          });
        }
      }
    });

  if ($.inArray("create_crud", params.buttons) != -1)
    buttons.push({
      name: "create_crud",
      icon: "ui-icon-document",
      caption: "Crear",
      action: function () {
        switch (params.entity) {
          case "reportes":
            var element = this;
            $.ajax({
              url: "/4DACTION/_V3_setReportes",
              dataType: "json",
              type: "POST",
              data: {
                create: true
              }
            }).done(function (data) {
              if (data.success) {
                unaBase.loadInto.viewport(
                  "/v3/views/reportes2/content.shtml?id=" + data.id
                );
              } else {
                if (data.readonly) {
                  toastr.error(
                    NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                  );
                } else {
                  toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                }
              }
            });
            break;
          case "formaspago":
            var element = this;
            $.ajax({
              url: "/4DACTION/_V3_setFormaspago",
              dataType: "json",
              type: "POST",
              data: {
                create: true
              }
            }).done(function (data) {
              if (data.success) {
                unaBase.loadInto.viewport(
                  "/v3/views/ajustes/formas_pago/content.shtml?id=" +
                  data.id
                );
              } else {
                if (data.readonly) {
                  toastr.error(
                    NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                  );
                } else {
                  toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                }
              }
            });
            break;
          case "tipospago":
            var element = this;
            $.ajax({
              url: "/4DACTION/_V3_setTipospago",
              dataType: "json",
              type: "POST",
              data: {
                create: true
              }
            }).done(function (data) {
              if (data.success) {
                unaBase.loadInto.viewport(
                  "/v3/views/ajustes/tipos_pago/content.shtml?id=" +
                  data.id
                );
              } else {
                if (data.readonly) {
                  toastr.error(
                    NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                  );
                } else {
                  toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                }
              }
            });
            break;
          case "impuestos":
            //    var element = this;
            // $.ajax({
            //  url: '/4DACTION/_V3_setImpuestos',
            //  dataType: 'json',
            //  type: 'POST',
            //  data:{
            //    create : false
            //  }
            // }).done( function(data) {
            //  if (data.success) {
            //    unaBase.loadInto.viewport('/v3/views/ajustes/impuestos/content.shtml?id=' + data.id);
            //  }else{
            //    if (data.readonly) {
            //      toastr.error(NOTIFY.get('ERROR_RECORD_READONLY', 'Error'));
            //    }else{
            //      toastr.error(NOTIFY.get('ERROR_INTERNAL', 'Error'));
            //    }
            //  }
            // });
            impuestos.set("create", "impuesto");
            break;
          case "tiposcuenta":
            var element = this;
            $.ajax({
              url: base_url + "/4DACTION/_V3_setTiposcuenta",
              dataType: "json",
              type: "POST",
              data: {
                create: true
              }
            }).done(function (data) {
              if (data.success) {
                unaBase.loadInto.viewport(
                  "/v3/views/ajustes/tipos_cuenta/content.shtml?id=" +
                  data.id
                );
              } else {
                if (data.readonly) {
                  toastr.error(
                    NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                  );
                } else {
                  toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                }
              }
            });
            break;
          case "banco":
            var element = this;
            $.ajax({
              url: "/4DACTION/_V3_setBanco",
              dataType: "json",
              type: "POST",
              data: {
                create: true
              }
            }).done(function (data) {
              if (data.success) {
                unaBase.loadInto.viewport(
                  "/v3/views/ajustes/banco/content.shtml?id=" + data.id
                );
              } else {
                if (data.readonly) {
                  toastr.error(
                    NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                  );
                } else {
                  toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                }
              }
            });
            break;
          case "tiposdtc":
            var element = this;
            $.ajax({
              url: "/4DACTION/_V3_setTiposdtc",
              dataType: "json",
              type: "POST",
              data: {
                create: true
              }
            }).done(function (data) {
              if (data.success) {
                unaBase.loadInto.viewport(
                  "/v3/views/ajustes/tipos_dtc/content.shtml?id=" +
                  data.id
                );
              } else {
                if (data.readonly) {
                  toastr.error(
                    NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                  );
                } else {
                  toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                }
              }
            });
            break;
        }
      }
    });
  if ($.inArray("create_imp", params.buttons) != -1)
    buttons.push({
      name: "create_imp",
      icon: "ui-icon-document",
      caption: "Crear",
      action: function () {
        var element = this;
        $.ajax({
          url: "/4DACTION/_V3_setImpuestos",
          dataType: "json",
          type: "POST",
          data: {
            create: true
          }
        }).done(function (data) {
          if (data.success) {
            unaBase.loadInto.viewport(
              "/v3/views/ajustes/impuestos/content.shtml?id=" + data.id
            );
          } else {
            if (data.readonly) {
              toastr.error(NOTIFY.get("ERROR_RECORD_READONLY", "Error"));
            } else {
              toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
            }
          }
        });
      }
    });

  if ($.inArray("restore", params.buttons) != -1)
    buttons.push({
      name: "restore",
      icon: "ui-icon-arrowreturnthick-1-n",
      caption: "Desanular",
      action: function () {
        var anular = true;
        var element = $(this);
        // if (params.entity=="Compras") {
        //  if (!_validationDocAsociadosOC()) {
        //    toastr.warning(NOTIFY.get('WARNING_GASTO_NULLIFY'));
        //    anular = false;
        //  }
        // }
        // if (params.entity == 'Pago') {
        //  // Verificar antes de anular
        //  if (
        //    $('.ui-dialog table > tbody > tr:not([data-new="true"]):first-of-type > td:nth-of-type(6)').text().toUpperCase() != 'NULO' &&
        //    $('.ui-dialog table > tbody > tr').length > 0
        //  ) {
        //    toastr.warning('No es posible anular la orden de pago. Hay documentos de pago vigentes.');
        //    anular = false;
        //  }
        // }
        // if (params.entity == 'Cobro') {
        //  // Verificar antes de anular
        //  /*if ($('.ui-dialog table > tbody > tr:not([data-new="true"]):first-of-type > td:nth-of-type(6)').text().toUpperCase() != 'NULO') {
        //    toastr.warning('No es posible anular la orden de pago. Hay documentos de pago vigentes.');
        //    anular = false;
        //  }*/
        // }
        // if (params.entity == 'Cotizacion') {
        //  $.ajax({
        //    url: '/4DACTION/_V3_getOrdenesByNegocio',
        //    data: {
        //      id: $('section.sheet').data('id')
        //    },
        //    dataType: 'json',
        //    async: false,
        //    success: function(data) {
        //      if (data.rows.length > 0) {
        //        for (var i = 0; i < data.rows.length; i++) {
        //          if (data.rows[i].estado != 'ANULADA') {
        //            anular = false;
        //            break;
        //          }
        //        }
        //      }
        //    }
        //  })
        //  if (!anular)
        //    toastr.warning('No es posible anular la cotización. Hay OC de proveedores vigentes.');
        // }

        // if (anular){
        confirm("¿Quieres desanular el documento?").done(function (data) {
          if (data) {
            // var htmlObject = $('<section> \
            //  <span>Ingresar motivo anulación</span> \
            //  <input required readonly type="search" name="motivo"> \
            //  <button class="show motivo-anulacion">Ver motivos de anulación</button> \
            // </section>');
            // htmlObject.find('input[type="search"]').autocomplete({
            //  source:  function(request, response) {
            //    $.ajax({
            //      url: '/4DACTION/_V3_' + 'getMotivoAnulacion',
            //      dataType: 'json',
            //      data: {
            //        //q: request.term
            //        modulo: params.entity
            //      },
            //      success: function(data) {
            //        response($.map(data.rows, function(item) {
            //          return item;
            //        }));
            //      }
            //    });
            //  },
            //  minLength: 0,
            //  delay: 5,
            //  position: { my: "left top", at: "left bottom", collision: "flip" },
            //  open:   function() {
            //    $(this).removeClass('ui-corner-all').addClass('ui-corner-top');
            //  },
            //  close: function() {
            //    $(this).removeClass('ui-corner-top').addClass('ui-corner-all');
            //  },
            //  focus:   function(event, ui) {
            //    $(this).val(ui.item.text);
            //    return false;
            //  },
            //  select: function(event, ui) {
            //    $(this).val(ui.item.text);
            //    htmlObject.data('response', $(this).val());
            //    return false;
            //  }

            // }).data('ui-autocomplete')._renderItem =   function(ul, item) {
            //  return $('<li><a><span>' + item.text + '</span></a></li>').appendTo(ul);
            // };

            // htmlObject.find('button.show.motivo-anulacion').button({
            //  icons: {
            //    primary: 'ui-icon-carat-1-s'
            //  },
            //  text: false
            // }).click( function() {
            //  htmlObject.find('input[type="search"]').autocomplete('search', '@');
            // });

            // prompt(htmlObject).done(function(data) {
            //  var enteredMessage = data;
            //if (data !== false) {
            $.ajax({
              url: "/4DACTION/_V3_set" + params.entity,
              dataType: "json",
              data: {
                //$('section.sheet').data('id')
                id: params.data().id,
                "cotizacion[estado]": true,
                "cotizacion[estado][observaciones]": "",
                "oc[id]": $("section.sheet").data("id"),
                "oc[anular]": false,
                "oc[anular][observaciones]": "",
                nullify: false,
                comment: ""
              },
              success: function (data) {
                if (data.success) {
                  var id = $("section.sheet").data("id");
                  //toastr.info('El Documento ha sido anulado!');
                  toastr.info("El documento ha sido desanulado!");
                  // TODO: implementar un URI handler

                  switch (params.entity) {
                    case "Cotizacion":
                      unaBase.inbox.send({
                        subject:
                          "Ha desanulado la cotización Nº " +
                          $("section.sheet").data("index") +
                          " / " +
                          $("section.sheet")
                            .find(
                              'input[name="cotizacion[titulo][text]"]'
                            )
                            .val(),
                        into: "viewport",
                        href:
                          "/v3/views/cotizaciones/content.shtml?id=" +
                          data.id,
                        tag: "avisos",
                        text: ""
                      });
                      // Omite el historial si se redirige a la misma página por anulación
                      unaBase.loadInto.viewport(
                        "/v3/views/cotizaciones/content.shtml?id=" + id,
                        undefined,
                        undefined,
                        true
                      );
                      break;
                    case "Negocios": //  case 'presupuestos':
                      unaBase.inbox.send({
                        subject:
                          "Ha desanulado el presupuesto Nº " +
                          $("section.sheet").data("index") +
                          " / " +
                          $("section.sheet")
                            .find(
                              'input[name="cotizacion[titulo][text]"]'
                            )
                            .val(),
                        into: "viewport",
                        href:
                          "/v3/views/presupuestos/content.shtml?id=" +
                          data.id,
                        tag: "avisos",
                        text: ""
                      });
                      // Omite el historial si se redirige a la misma página por anulación
                      unaBase.loadInto.viewport(
                        "/v3/views/presupuestos/content.shtml?id=" + id,
                        undefined,
                        undefined,
                        true
                      );
                      break;
                    case "Compras":
                      unaBase.loadInto.viewport(
                        "/v3/views/compras/content.shtml?id=" + id,
                        undefined,
                        undefined,
                        true
                      );
                      break;
                    // case 'Pago':
                    //  $('.ui-dialog fieldset.pago').data('nullified', true);
                    //  $('.ui-dialog header').hide();
                    //  $('.ui-dialog input, .ui-dialog textarea').attr('readonly', true);
                    //  $('section.sheet table.pagos').trigger('refresh');
                    // case 'Cobro':
                    //  $('section.sheet table.cobros').trigger('refresh');
                    //  $(element).parentTo('.ui-dialog-content').dialog('close');
                  }
                } else {
                  if (data.opened) {
                    if (data.readonly)
                      toastr.error(
                        NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                      );
                  }
                }
              },
              error: function (xhr, text, error) {
                toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
              }
            });
            //}
            // });
          }
        });
        // }
      }
    });

  if ($.inArray("delete", params.buttons) != -1)
    buttons.push({
      name: "delete",
      icon: "ui-icon-trash",
      caption: "Eliminar",
      action: function () {
        var element = $(this);

        switch (params.entity) {
          case "Cotizacion":
            confirm(MSG.get("CONFIRM_TEMPLATE_DELETE")).done(function (
              data
            ) {

              if (data) {
                $.ajax({
                  url: "/4DACTION/_V3_remove" + params.entity,
                  dataType: "json",
                  data: {
                    id: params.data().id
                  },
                  success: function (data) {
                    if (data.success) {
                      toastr.info(NOTIFY.get("SUCCESS_DELETE_TEMPLATE"));
                      unaBase.loadInto.viewport(
                        "/v3/views/cotizaciones/content.shtml?id=" +
                        $("section.sheet").data("id")
                      );
                    } else {
                      if (data.opened) {
                        if (data.readonly)
                          toastr.error(
                            NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                          );
                      }
                    }
                  },
                  error: function (xhr, text, error) {
                    toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                  }
                });
              }
            });
            break;
          case "Producto":
            confirm(MSG.get("CONFIRM_PRODUCTO_DELETE")).done(function (
              data
            ) {
              if (data) {
                $.ajax({
                  url: "/4DACTION/_V3_remove" + params.entity,
                  dataType: "json",
                  data: {
                    id: params.data().id
                  },
                  success: function (data) {
                    if (data.success) {
                      toastr.info(NOTIFY.get("SUCCESS_DELETE_PRODUCTO"));
                      unaBase.loadInto.viewport(
                        "/v3/views/catalogo/list.shtml"
                      );
                    } else {
                      if (data.opened) {
                        if (data.readonly)
                          toastr.error(
                            NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                          );
                      }
                    }
                  },
                  error: function (xhr, text, error) {
                    toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                  }
                });
              }
            });
            break;
          case "Dtv":
            confirm(MSG.get("CONFIRM_DOCUMENT_DELETE")).done(function (
              data
            ) {
              if (data) {
                $.ajax({
                  url: "/4DACTION/_V3_setDtv",
                  data: {
                    id: dtv.id,
                    delete: true
                  },
                  dataType: "json",
                  success: function (data) {

                    unaBase.history.back();
                  },
                  error: function (xhr, text, error) {
                    toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                  }
                });
              }
            });
            break;
          case "NcVentas":
            const tbodyNd = document.querySelector('#scrollncnd table.nd tbody');
            const filasNd = tbodyNd?.querySelectorAll('tr') || [];
            if (filasNd.length > 0) {
              toastr.error('No puedes eliminar la nota de credito, ya que hay nota de debito asociada')
              return false;
            }
            confirm(MSG.get("CONFIRM_DOCUMENT_DELETE")).done(function (
              data
            ) {

              if (data) {
                $.ajax({
                  url: "/4DACTION/_V3_setNcVentas",
                  data: {
                    id: notas.id,
                    delete: true
                  },
                  dataType: "json",
                  success: function (data) {
                    if (data.success) {
                      toastr.info(NOTIFY.get("SUCCESS_DELETE"));
                      if (typeof event != "undefined")
                        unaBase.history.back();
                    } else {
                      if (data.opened) {
                        if (data.readonly)
                          toastr.error(
                            NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                          );
                      }
                    }
                  },
                  error: function (xhr, text, error) {
                    toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                  }
                });
              }
            });
            break;

          case "NdVentas":
            confirm(MSG.get("CONFIRM_DOCUMENT_DELETE")).done(function (
              data
            ) {
              if (data) {
                $.ajax({
                  url: "/4DACTION/_V3_setNdVentas",
                  data: {
                    id: notas.id,
                    delete: true
                  },
                  dataType: "json",
                  success: function (data) {
                    if (data.success) {
                      toastr.info(NOTIFY.get("SUCCESS_DELETE"));
                      if (typeof event != "undefined")
                        unaBase.history.back();
                    } else {
                      if (data.opened) {
                        if (data.readonly)
                          toastr.error(
                            NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                          );
                      }
                    }
                  },
                  error: function (xhr, text, error) {
                    toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                  }
                });
              }
            });
            break;

          case "Occ":
            confirm(MSG.get("CONFIRM_DOCUMENT_DELETE")).done(function (
              data
            ) {
              if (data) {
                $.ajax({
                  url: "/4DACTION/_V3_setOcc",
                  data: {
                    id: $("#sheet-occ").data("id"),
                    delete: true
                  },
                  dataType: "json",
                  success: function (data) {
                    if (data.success) {
                      toastr.info(NOTIFY.get("SUCCESS_DELETE"));
                      $(element)
                        .closest(".ui-dialog-content")
                        .dialog("close");
                      $(".load-occliente > a").trigger("click");
                    } else {
                      if (data.opened) {
                        if (data.readonly)
                          toastr.error(
                            NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                          );
                      }
                    }
                  },
                  error: function (xhr, text, error) {
                    toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                  }
                });
              }
            });
            break;
        }
      }
    });

  if ($.inArray("delete_cobro", params.buttons) != -1)
    buttons.push({
      name: "delete_cobro",
      icon: "ui-icon-trash",
      caption: "Eliminar",
      action: function () {
        var element = $(this);
        confirm(MSG.get("CONFIRM_DOCUMENT_DELETE")).done(function (data) {
          if (data) {
            var container = $("#sheet-cobros");
            $.ajax({
              url: "/4DACTION/_V3_setCobro",
              data: {
                id: cobro.id,
                delete: true
              },
              dataType: "json",
              success: function (data) {
                if (typeof event != "undefined") {
                  if (compras.id != "undefined") {
                    get_cobros_oc(compras.id);
                    get_totales_gastos();
                  }
                  $(element)
                    .parentTo(".ui-dialog-content")
                    .dialog("close");
                }
              },
              error: function (xhr, text, error) {
                toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
              }
            });
          }
        });
      }
    });

  if ($.inArray("deactivate", params.buttons) != -1)
    buttons.push({
      name: "deactivate",
      icon: "ui-icon-trash",
      caption: "Desactivar",
      action: function () {
        switch (params.entity) {
          case "Producto":
            confirm(MSG.get("CONFIRM_PRODUCTO_DEACTIVATE")).done(function (
              data
            ) {
              if (data) {
                $.ajax({
                  url: "/4DACTION/_V3_remove" + params.entity,
                  dataType: "json",
                  data: {
                    id: params.data().id
                  },
                  success: function (data) {
                    if (data.success) {
                      toastr.info(
                        NOTIFY.get("SUCCESS_DEACTIVATE_PRODUCTO")
                      );
                      unaBase.loadInto.viewport(
                        "/v3/views/catalogo/list.shtml"
                      );
                    } else {
                      if (data.opened) {
                        if (data.readonly)
                          toastr.error(
                            NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                          );
                      }
                    }
                  },
                  error: function (xhr, text, error) {
                    toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                  }
                });
              }
            });
            break;
        }
      }
    });

  if ($.inArray("activate", params.buttons) != -1)
    buttons.push({
      name: "activate",
      icon: "ui-icon-check",
      caption: "Activar",
      action: function () {
        switch (params.entity) {
          case "Producto":
            confirm(MSG.get("CONFIRM_PRODUCTO_ACTIVATE")).done(function (
              data
            ) {
              if (data) {
                $.ajax({
                  url: "/4DACTION/_V3_enable" + params.entity,
                  dataType: "json",
                  data: {
                    id: params.data().id
                  },
                  success: function (data) {
                    if (data.success) {
                      toastr.info(
                        NOTIFY.get("SUCCESS_ACTIVATE_PRODUCTO")
                      );
                      unaBase.loadInto.viewport(
                        "/v3/views/catalogo/list.shtml"
                      );
                    } else {
                      if (data.opened) {
                        if (data.readonly)
                          toastr.error(
                            NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                          );
                      }
                    }
                  },
                  error: function (xhr, text, error) {
                    toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                  }
                });
              }
            });
            break;
        }
      }
    });

  if ($.inArray("save_nv_sap", params.buttons) != -1) {
    if (unaBase.parametros.sap_integration) {
      buttons.push({
        name: "export",
        icon: "ui-icon-calculator",
        caption: "Guardar en SAP",
        action: async function () {
          var continueAction = async function (params) {
            let url;
            var ajaxData = await params.data();
            var success = false;

            $.extend(ajaxData, ajaxData, { preview: true });

            if (
              params.entity == "Cotizacion" ||
              params.entity == "Negocios"
            ) {


              var is_negocio = true;
              if (
                !$(
                  'html > body.menu > aside > div > div > ul > li[data-name="negocios"]'
                ).hasClass("active")
              ) {
                is_negocio = false;
              }

              let valid, hidden_items, checkDifference;
              checkDifference = await business.checkDifference(unaBase.doc.id);

              const saveSap = async () => {
                if (modulo == "NEGOCIOS") {
                  if (unaBase.parametros.sap_integration) {
                    unaBase.ui.block()
                    await unaBase.utilities.saveDataSap('nv')
                    unaBase.ui.unblock()
                  }
                }
              }
              $.ajax({
                url: "/4DACTION/_V3_checkCotizacionPdf",
                data: {
                  id: $("section.sheet").data("id")
                },
                dataType: "json",
                async: false,
                success: function (data) {
                  valid = data.valid;
                  hidden_items = data.hidden_items;
                }
              });



              // valid = !checkDifference.hasDifference;
              if (valid && !checkDifference.hasDifference) {
                switch (params.entity) {
                  case "Cotizacion":
                    var modulo = etiqueta_cotizacion;
                    break;
                  case "Negocios":
                    var modulo = etiqueta_negocio;
                    break;
                }
                if (hidden_items) {
                  confirm(
                    "Existen ítems ocultos con precio unitario mayor a 0. ¿Desea generar el reporte de costo de todos modos?"
                  ).done(function (data) {
                    if (data) {
                      saveSap()
                    }
                  });
                } else {

                  saveSap()

                }
                return false;
              } else {

                // continueAction();
                toastr.warning("Lo sentimos ! no pudimos obtener el documento, Error 1501, comunícate con soporte de inmediato para resolver.");
              }
            }

          }
          await saveAction(continueAction, params, true)






        }
      });
    }
  }

  if ($.inArray("preview", params.buttons) != -1)
    buttons.push({
      name: "preview",
      icon: "ui-icon-search",
      caption: "Vista previa",
      action: function () {

        var callback = async function () {
          // var saved = menu
          //   .find('[data-name="save"] button')
          //   .triggerHandler("click");
          // if (!saved.success) event.stopImmediatePropagation();


          var continueAction = async function (params) {
            let url;
            var ajaxData = await params.data();
            var success = false;

            $.extend(ajaxData, ajaxData, { preview: true });



            // Si es cotización o negocio

            // Se verifica si el PDF es válido antes generar vista previa
            // (total neto == suma_subtotales)
            if (
              params.entity == "Cotizacion" ||
              params.entity == "Negocios"
            ) {


              var is_negocio = true;
              if (
                !$(
                  'html > body.menu > aside > div > div > ul > li[data-name="negocios"]'
                ).hasClass("active")
              ) {
                is_negocio = false;
              }


              let downloadNv = () => {


                let infoCliente = $("section.sheet").find("input[name='cotizacion[titulo][text]']").val();

                if (params.entity == "Cotizacion") {
                  url = nodeUrl + "/print/?entity=cotizaciones&id=" + ajaxData.id + "&folio=" + (typeof ajaxData.index != "undefined"
                    ? ajaxData.index
                    : "S/N") +
                    "&sid=" +
                    unaBase.sid.encoded() +
                    "&preview=true&nullified=" +
                    ajaxData.readonly +
                    "&template=" +
                    formato_impresion_cotizacion +
                    "&hostname=" +
                    window.location.origin +
                    "&cliente=" +
                    infoCliente +
                    "&name_custom=" +
                    unaBase.parametros?.nombre_custom_pdf_cot +
                    "&module=" +
                    document.querySelector('.nav-menu ul li.active')?.dataset?.name
                } else {
                  url =
                    nodeUrl +
                    "/print/?entity=cotizaciones&id=" +
                    ajaxData.id +
                    "&folio=" +
                    $("section.sheet").data("index") +
                    "&sid=" +
                    unaBase.sid.encoded() +
                    "&preview=true&nullified=" +
                    ajaxData.readonly +
                    "&template=" +
                    formato_impresion_cotizacion +
                    "&hostname=" +
                    window.location.origin +
                    "&cliente=" +
                    infoCliente +
                    "&name_custom=" +
                    unaBase.parametros?.nombre_custom_pdf_neg +
                    "&module=" +
                    document.querySelector('.nav-menu ul li.active')?.dataset?.name
                }

                if (uVar.nativePrint) {
                  // axios(url).then(res => {
                  //   unaBase.loadInto.dialog(res.data, "Vista previa", "large", true);
                  // }).catch(err => {
                  //   console.log(err);
                  // })

                  setTimeout(() => {
                    document.querySelector('input[name="printBtn"]').click();
                  }, 2000);
                } else {
                  unaBase.loadInto.dialog(url, "Vista previa", "large", true);
                }


                if (is_negocio)
                  unaBase.log.save(
                    "Ha realizado vista previa de " + etiqueta_negocio,
                    "negocios",
                    $("section.sheet").data("index")
                  );
                else
                  unaBase.log.save(
                    "Ha realizado vista previa de " + etiqueta_cotizacion,
                    "cotizaciones",
                    $("section.sheet").data("index")
                  );
              }

              let valid, hidden_items, checkDifference;


              checkDifference = await business.checkDifference(unaBase.doc.id);



              $.ajax({
                url: "/4DACTION/_V3_checkCotizacionPdf",
                data: {
                  id: $("section.sheet").data("id")
                },
                dataType: "json",
                async: false,
                success: function (data) {
                  valid = data.valid;
                  hidden_items = data.hidden_items;
                }
              });



              // valid = !checkDifference.hasDifference;
              if (valid && !checkDifference.hasDifference) {
                switch (params.entity) {
                  case "Cotizacion":
                    var modulo = etiqueta_cotizacion;
                    break;
                  case "Negocios":
                    var modulo = etiqueta_negocio;
                    break;
                }
                if (hidden_items) {
                  confirm(
                    "Existen ítems ocultos con precio unitario mayor a 0. ¿Desea generar PDF de todos modos?"
                  ).done(function (data) {
                    if (data) {
                      unaBase.log.save(
                        "Ha generado PDF con ítems ocultos que tienen precio unitario mayor a 0",
                        "cotizaciones",
                        $("section.sheet").data("index")
                      );
                      downloadNv()
                    }
                  });
                } else {

                  downloadNv()

                }
                return false;
              } else {

                // continueAction();
                toastr.warning("Lo sentimos ! no pudimos obtener el documento, Error 1501, comunícate con soporte de inmediato para resolver.");
              }
            } else {


              // Si es dtv
              if ($('html > body.menu > aside > div > div > ul > li[data-name="dtv"]').hasClass("active")) {


                url =
                  nodeUrl +
                  "/print/?entity=" + params.entity + "&id=" +
                  params.data().id +
                  "&folio=" +
                  (typeof params.data().index != "undefined"
                    ? params.data().index
                    : "S/N") +
                  "&sid=" +
                  unaBase.sid.encoded() +
                  "&preview=true&nullified=" +
                  params.data().readonly +
                  "&template=" +
                  unaBase.print_dtvs +
                  "&hostname=" +
                  window.location.origin +
                  "&code=" +
                  currency.code;
                unaBase.loadInto.dialog(url, "Vista previa", "large", true);
              }
            }










          }

          await saveAction(continueAction, params, true)


        };
        callback()

      }

    });

  if ($.inArray("preview_oc", params.buttons) != -1) {

    buttons.push({
      name: "preview_oc",
      icon: "ui-icon-search",
      caption: "Vista previa",
      action: function () {

        var callback = async function () {
          // antes de crear el preview, gatilla el evento y guarda
          if (uVar.nativePrint) {
            setTimeout(() => {
              document.querySelector('input[name="printBtn"]').click();
            }, 2000);
          } else {




            let continueAction = () => {
              let sid = "";
              $.each($.cookie(), function (clave, valor) {
                // if (valor.match(/UNABASE/g)) sid += valor + " ";
                if (valor.match(/UNABASE/g)) sid += valor;
              });



              let url =
                nodeUrl +
                "/print/?entity=compras&id=" +
                $("section.sheet").data("id") +
                "&folio=" +
                $("section.sheet").data("index") +
                "&sid=" +
                unaBase.sid.encoded() +
                "&preview=true&nullified=" +
                params.data().readonly +
                "&template=" +
                unaBase.print_compras +
                "&code=" +
                unaBase.moneyDefault.codigo +
                "&hostname=" +
                window.location.origin +
                "&aliasfiles=" +
                $("section.sheet").data("tipogasto") +
                "_";

              // unaBase.loadInto.dialog(url, "Vista previa", "large", true);

              var download = window.open(url);
              download.blur();
              window.focus();
            }
            saveAction(continueAction, params)



          }

          compras.saveLogsFromWeb({
            id: compras.id,
            folio: compras.folio,
            descripcion: "Ha realizado vista previa del gasto",
            modulo: "gastos",
            descripcion_larga: ""
          });
        };
        callback(true);

      }
    });

  }

  if ($.inArray("preview_native", params.buttons) != -1) {

    if (access.preview_native) {
      buttons.push({
        name: "preview_native",
        icon: "ui-icon-search",
        caption: "Ver pdf",
        action: function () {

          setTimeout(() => {
            document.querySelector('input[name="printBtn"]').click();
          }, 2000);

          compras.saveLogsFromWeb({
            id: compras.id,
            folio: compras.folio,
            descripcion: "Ha realizado vista previa(nativa) del gasto",
            modulo: "gastos",
            descripcion_larga: ""
          });
        }
      });

    }
  }

  if ($.inArray("preview_cheque", params.buttons) != -1)
    buttons.push({
      name: "preview_cheque",
      icon: "ui-icon-search",
      caption: "Vista previa",
      action: function () {
        var callback = async function () {
          // antes de crear el preview, gatilla el evento y guarda
          //var saved = menu.find('[data-name="save"] button').triggerHandler('click');
          /*if (!saved.success)
              return false;*/

          var iddoc = payment.container
            .find('#scrolldocpagos tbody tr[data-status="true"]')
            .data("id");
          var form = payment.form_print_cheque;

          var sid = "";
          $.each($.cookie(), function (clave, valor) {
            if (valor.match(/UNABASE/g)) sid += valor + " ";
          });

          // var url = 'http://' + nodejs_public_ipaddr + ':' + nodejs_port + '/print/?entity=pagos&id=' + iddoc + '&formch='+ formch /* + '&folio=' + ((typeof params.data().index != 'undefined')? params.data().index : 'S/N') + '&sid=' + unaBase.sid.encoded() + '&preview=true&nullified=' */ + params.data().readonly + '&hostname=' + window.location.origin;

          var url =
            nodeUrl +
            "/print/?entity=pagos&id=" +
            iddoc +
            "&form=" +
            form +
            "&" +
            params.data().readonly +
            "&hostname=" +
            window.location.origin;
          unaBase.loadInto.dialog(url, "Vista previa", "large", true);

          /*compras.saveLogsFromWeb({
              'id' : pago.id
              'folio' : compras.folio,
              'descripcion' : 'Ha realizado vista previa del gasto',
              'modulo' :  'gastos',
              'descripcion_larga' : ''
            });*/
        };
        callback();
      }
    });

  if ($.inArray("boucher_pago", params.buttons) != -1)
    buttons.push({
      name: "boucher_pago",
      icon: "ui-icon-print",
      caption: "Voucher",
      action: function () {
        var callback = async function () {
          var form = "boucher";
          var sid = "";
          $.each($.cookie(), function (clave, valor) {
            if (valor.match(/UNABASE/g)) sid += valor + " ";
          });
          var url =
            nodeUrl +
            "/print/?entity=pagos&id=" +
            payment.id +
            "&form=" +
            form +
            "&" +
            params.data().readonly +
            "&hostname=" +
            window.location.origin;
          unaBase.loadInto.dialog(url, "Vista previa", "large", true);
        };
        callback();
      }
    });


    if ($.inArray("ai_bussiness_analysis", params.buttons) != -1)
    buttons.push({
      name: "ai_bussiness_analysis",
      icon: "ui-icon-comment",
      caption: "BETA",
      action: function () {
        const url = buildAiUrl();
        unaBase.loadInto.dialog(url, "Vista previa", "x-large", true);

      }
    });

  // if ($.inArray("import_gastos", params.buttons) != -1)
  //   buttons.push({
  //     name: "import_gastos",
  //     icon: "ui-icon-calculator",
  //     caption: `Importar y crear ${$("body ul li.active").data("name") == 'gastos' ? 'OC' : 'FXR'} desde excel`,
  //     action: function () {
  //       let tipo = "";
  //       if (
  //         $("html > body.menu.home > aside > div > div > ul > li.active")
  //           .data("name")
  //           .toUpperCase() == "GASTOS"
  //       ) {
  //         tipo = "crear oc validadas";
  //       } else {
  //         tipo = "crear fxr validadas";
  //       }
  //       if (access._439) {
  //         // crear gastos validados
  //         unaBase.loadInto.dialog(
  //           "/v3/views/compras/import.shtml?id=0",
  //           "Importar y crear gastos",
  //           "small"
  //         );
  //       } else {
  //         alert(
  //           "Debes contar con el permiso de <span style='font-weight:bold;'>" +
  //           tipo +
  //           "</span> para poder realizar está acción."
  //         );
  //       }
  //     }
  //   });


  // if ($.inArray("import_gastos", params.buttons) != -1)
  //   buttons.push({
  //     name: "import_gastos",
  //     icon: "ui-icon-calculator",
  //     caption: `Importar y crear ${$("body ul li.active").data("name") == 'gastos' ? 'OC' : 'FXR'} desde excel`,
  //     action: function () {
  //       let tipo = "";
  //       if (
  //         $("html > body.menu.home > aside > div > div > ul > li.active")
  //           .data("name")
  //           .toUpperCase() == "GASTOS"
  //       ) {
  //         tipo = "crear oc validadas";
  //       } else {
  //         tipo = "crear fxr validadas";
  //       }
  //       if (access._439) {
  //         // crear gastos validados
  //         unaBase.loadInto.dialog(
  //           "/v3/views/compras/import.shtml?id=0",
  //           "Importar y crear gastos",
  //           "small"
  //         );
  //       } else {
  //         alert(
  //           "Debes contar con el permiso de <span style='font-weight:bold;'>" +
  //           tipo +
  //           "</span> para poder realizar está acción."
  //         );
  //       }
  //     }
  //   });


  if ($.inArray("import_gastos", params.buttons) != -1) {
    buttons.push({
      name: "import_gastos",
      icon: "ui-icon-calculator",
      caption: `Importar y crear ${$("body ul li.active").data("name") == 'gastos' ? 'OC' : 'FXR'} desde excel`,
      action: function () {
        const title = $("body ul li.active").data("name") == 'gastos' ? 'Importar Ordenes de compra' : 'Importar Rendiciones'
        const modal = document.getElementById("modalImportadorPagos");
        const modulo = $('html > body.menu.home > aside > div > div > ul > li.active').data('name').toUpperCase();
        let separateLabel = ''
        if (modulo == 'GASTOS') {
          separateLabel = 'Marcar para crear sólo una Orden de compra por todo el excel.'
        } else {
          separateLabel = 'Marcar para crear sólo una Rendición por todo el excel.'
        }

        let tipo = "";
        if (
          $("html > body.menu.home > aside > div > div > ul > li.active")
            .data("name")
            .toUpperCase() == "GASTOS"
        ) {
          tipo = "crear oc validadas";
        } else {
          tipo = "crear fxr validadas";
        }

        if (access._439) {
          resetModalImportador()
          modal.querySelector(".title-modal").textContent = title
          modal.querySelector('.separate').style.display = ''
          modal.querySelector('.separate-label').textContent = separateLabel
          // Abrir el modal cuando se hace click en el botón
          modal.style.display = "block";
          // Cerrar el modal cuando se hace click en cualquier lugar fuera de él
          window.onclick = function (event) {
            if (event.target == modal) {
              modal.style.display = "none";
            }
          }
        } else {
          alert(
            "Debes contar con el permiso de <span style='font-weight:bold;'>" +
            tipo +
            "</span> para poder realizar está acción."
          );
        }

      }
    });
  }


  if ($.inArray("import_remunerations", params.buttons) != -1)
    buttons.push({
      name: "import_remunerations",
      icon: "ui-icon-calculator",
      caption: "Importar y crear remuneraciones",
      action: function () {
        let tipo = "";

        unaBase.loadInto.dialog(
          "/v3/views/comprobantes/import.shtml?id=0",
          "Importar y crear remuneraciones",
          "medium-large"
        );

      }
    });

  if ($.inArray("import_seats", params.buttons) != -1)
    buttons.push({
      name: "import_seats",
      icon: "ui-icon-calculator",
      caption: "Importar comprobantes",
      action: function () {
        let tipo = "";

        unaBase.loadInto.dialog(
          "/v3/views/comprobantes/import_seats.shtml?id=0",
          "Importar Comprobantes",
          "small"
        );

      }
    });


  if ($.inArray("import_seats_provisiones", params.buttons) != -1)
    buttons.push({
      name: "import_seats_provisiones",
      icon: "ui-icon-calculator",
      caption: "Importar provisiones",
      action: function () {
        let tipo = "";

        unaBase.loadInto.dialog(
          "/v3/views/comprobantes/import_seats_provisiones.shtml?id=0",
          "Importar Provisiones",
          "small"
        );
      },
    });

  // if ($.inArray("importJustificarMasivo", params.buttons) != -1)
  //   buttons.push({
  //     name: "importJustificarMasivo",
  //     icon: "ui-icon-calculator",
  //     caption: `Importar y justificar ${$("body ul li.active").data("name") == 'gastos' ? 'OC' : 'FXR'} masivo`,
  //     action: function () {
  //       let tipo = "";

  //       if (
  //         $("html > body.menu.home > aside > div > div > ul > li.active")
  //           .data("name")
  //           .toUpperCase() == "GASTOS"
  //       ) {
  //         tipo = "crear oc validadas";
  //       } else {
  //         tipo = "crear fxr validadas";
  //       }

  //       unaBase.loadInto.dialog(
  //         '/v3/views/compras/importJustificarMasivo.shtml?id=0',
  //         'JUSTIFICAR GASTOS MASIVOS',
  //         'small'
  //       );

  //     }
  //   });



  if ($.inArray("importJustificarMasivo", params.buttons) != -1) {
    buttons.push({
      name: "importJustificarMasivo",
      icon: "ui-icon-calculator",
      caption: `Importar y justificar ${$("body ul li.active").data("name") == 'gastos' ? 'OC' : 'FXR'} masivo`,
      action: function () {
        var modal = document.getElementById("modalImportadorPagos");
        resetModalImportador()
        modal.querySelector(".title-modal").textContent = "Importar y justificar masivo"
        // Abrir el modal cuando se hace click en el botón
        modal.style.display = "block";
        // Cerrar el modal cuando se hace click en cualquier lugar fuera de él
        window.onclick = function (event) {
          if (event.target == modal) {
            modal.style.display = "none";
          }
        }

      }
    });
  }


  if ($.inArray("importPagosMasivo", params.buttons) != -1) {

    buttons.push({
      name: "importPagosMasivo",
      icon: "ui-icon-calculator",
      caption: `Importar pagos masivo`,
      action: function () {
        let tipo = "";

        if (
          $("html > body.menu.home > aside > div > div > ul > li.active")
            .data("name")
            .toUpperCase() == "GASTOS"
        ) {
          tipo = "crear oc validadas";
        } else {
          tipo = "crear fxr validadas";
        }

        // unaBase.loadInto.dialog(
        //   '/v3/views/compras/importPagosGastos.shtml?id=0',
        //   'JUSTIFICAR GASTOS MASIVOS',
        //   'small'
        // );

        resetModalImportador()
        var modal = document.getElementById("modalImportadorPagos");
        modal.querySelector(".title-modal").textContent = "Importador de Pagos"

        // Abrir el modal cuando se hace click en el botón
        modal.style.display = "block";

        // Cerrar el modal cuando se hace click en cualquier lugar fuera de él
        window.onclick = function (event) {
          if (event.target == modal) {
            modal.style.display = "none";
          }
        }

      }
    });
  }

  if ($.inArray("informe-fxr", params.buttons) != -1) {
    buttons.push({
      name: "informe-fxr",
      icon: "ui-icon-calculator",
      caption: "Informe FXR",
      action: function () {
        const checkedRows = document.querySelectorAll('table tbody td input:checked');
        const dataIds = Array.from(checkedRows).map(input => {
          return input.closest('tr').getAttribute('data-id');
        });

        if (dataIds.length == 0) {
          toastr.warning('Debe seleccionar al menos un registro para generar el informe.');
          return
        }


        let url = `${nodeUrl}/informe-fxr?ids=${dataIds}&sid=${unaBase.sid.encoded()}&hostname=${window.location.origin}&presupuestos=false`;


        if (url) {
          try {
            toggleUniqueAlert('Generando reporte...')
            fetch(url)
              .then(response => {
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
                return response.blob();
              })
              .then(blob => {
                const downloadUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = downloadUrl;
                a.download = `Informe_rendiciones.xlsx`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(downloadUrl);
                toggleUniqueAlert()
                toastr.success('Reporte generado exitosamente!.');
              })
              .catch(error => {
                console.log('Error en la solicitud', error);
                toastr.error('Ha ocurrido un error interno. Por favor comunicarse con soporte.');
              });
          } catch (err) {
            console.log(err);
            toastr.error('Ha ocurrido un error interno. Por favor comunicarse con soporte.');
          }
        }
      }
    });
  }

  if ($.inArray("import_list_catalogo", params.buttons) != -1)
    buttons.push({
      name: "import_list_catalogo",
      icon: "ui-icon-calculator",
      caption: "Importar catálogo",
      action: function () {
        unaBase.loadInto.dialog(
          "/v3/views/catalogo/import.shtml?id=0", "Importar catálogo", "small"
        );
      }
    });

  if ($.inArray("classic_view", params.buttons) != -1) {
    if (params.entity == "Negocios") {
      buttons.push({
        name: "classic_view",
        icon: "ui-icon-suitcase",
        caption: "Cambiar de vista",
        action: function () {
          confirm(
            "¿Deseas cambiar la vista de negocios?",
            "Vista proyectos",
            "Vista clasica"
          ).done(function (data) {
            $.ajax({
              url: "/4DACTION/_light_setParameters",
              type: "POST",
              dataType: "json",
              data: {
                vista_negocio: data,
              },
              async: false // para poder hacer el save correctamente y esperar la respuesta
            }).done(function (data2) {
              if (data2.success) {
                unaBase.vista_proyectos = data
                toastr.success(NOTIFY.get("VIEW_MODE_CHANGED_SUCCESSFULLY"));
                $('li.active a').trigger('click');
              } else {
                toastr.error(NOTIFY.get("VIEW_MODE_CHANGED_ERROR", "Error"));
              }
              unaBase.ui.unblock();

            });
          });
        }
      });
    }

    if (params.entity == "Cotizacion") {
      buttons.push({
        name: "classic_view",
        icon: "ui-icon-suitcase",
        caption: "Cambiar de vista",
        action: function () {
          confirm(
            "¿Deseas cambiar la vista de cotizaciones?",
            "Vista proyectos",
            "Vista clasica",
          ).done(function (data) {
            $.ajax({
              url: "/4DACTION/_light_setParameters",
              type: "POST",
              dataType: "json",
              data: {
                vista_cotizacion: data,
              },
              async: false // para poder hacer el save correctamente y esperar la respuesta
            }).done(function (data2) {
              if (data2.success) {
                unaBase.vista_proyectos = data
                toastr.success(NOTIFY.get("VIEW_MODE_CHANGED_SUCCESSFULLY"));
                $('li.active a').trigger('click');
              } else {
                toastr.error(NOTIFY.get("VIEW_MODE_CHANGED_ERROR", "Error"));
              }
              unaBase.ui.unblock();

            });
          });
        }
      });

      // buttons.push({
      //   name: "classic_viewR",
      //   icon: "ui-icon-suitcase",
      //   caption: "VIEWWW",
      //   action: function () {
      //     window.location.href = '#demo-modal';
      //   }
      // });
    }
  }

  // if ($.inArray("filter_button", params.buttons) != -1) {
  //   buttons.push({
  //     name: "filter_button",
  //     icon: "ui-icon-suitcase",
  //     caption: "Filtros",
  //     action: function () {

  //       var filters = params.filters
  //       generateHTMLFilter(filters)
  //       upModalFilter()
  //     }
  //   });


  // }





  if ($.inArray("share", params.buttons) != -1)
    buttons.push({
      name: "share",
      icons: {
        primary: "ui-icon-extlink",
        secondary: "ui-icon-triangle-1-s"
      },
      caption: "Compartir",
      action: function () {
        // if(unaBase.changeControl.query()){}



        $(this).tooltipster({
          content: function () {

            unaBase.ui.unblock();
            var sid = "";
            $.each($.cookie(), function (clave, valor) {
              if (clave == hash && valor.match(/UNABASE/g))
                sid = valor;
            });
            let btn_costos = false;

            $.ajax({
              url: "/4DACTION/_light_checkAccess",
              data: {
                'id_access': 672,
                sid
              },
              dataType: "json",
              async: false,
              success: function (data) {
                //unaBase.ui.unblock();
                if (data.success) {

                  btn_costos = data.enable;
                }
              }
            });

            var htmlObject = $(
              `
                  <fieldset>                                        
                    <legend style="display: none;">¿Cómo desea obtenerla?</legend>            
                    <!-- <button class="print">Imprimir</button> -->                  
                    <button class="download">Descargar PDF</button>
                    ${btn_costos ? '<button class="downloadcostopdf">PDF Costos</button>' : ''}                   
                    <button class="email">Enviar por email</button>                   
                    <button class="export">Descargar Excel</button>                   
                    <button class="carta">Descargar Carta Cliente</button>                
                  </fieldset>                                       
                `
            );

            $('[data-name="share"]').data("is-saved", false);
            // Si corresponde a cotización, mostrar las opciones
            if (true) {
              var options = $(
                '\
                  <div style="margin-top: 5px;">                            \
                    <label style="display: block;">                         \
                      <input type="checkbox" name="cotizacion[compartir][totales_titulos]">   \
                      Mostrar totales en títulos                          \
                    </label>                                    \
                    <label style="display: block;">                         \
                      <input type="checkbox" name="cotizacion[compartir][items]">         \
                      Mostrar ítems                               \
                    </label>                                    \
                    <label style="display: block;">                         \
                      <input type="checkbox" name="cotizacion[compartir][totales_items]">     \
                      Mostrar totales en ítems                          \
                    </label>                                    \
                    <label style="display: block;">                         \
                      <input type="checkbox" name="cotizacion[compartir][totales_cotizacion]">  \
                      Mostrar totales de cotización                       \
                    </label>                                    \
                    <label style="display: block;">                         \
                      <input type="checkbox" name="cotizacion[compartir][ocultar_cantidades]">  \
                      Ocultar cantidades                              \
                    </label>                                    \
                    <label style="display: block;">                         \
                      <input type="checkbox" name="cotizacion[compartir][ocultar_items_cero]">  \
                      Ocultar ítems con valor cero                        \
                    </label>\
                    <label style="display: block;">                                                                \
                      <input type="checkbox" name="cotizacion[compartir][mostrar_fecha_creacion]">\
                      Mostrar fecha de creación                       \
                    </label>                                  \
                                                      \
                  </div>                            \
                '
              );
              // Ocultado por que no esta desarrollado en print.shtml
              // <label style="display: block;">                                                                \
              //         <input type="checkbox" name="cotizacion[compartir][solo_resumen]">\
              //         Solo resumen                       \
              //       </label>

              options
                .find(
                  'input[name="cotizacion[compartir][totales_titulos]"]'
                )
                .prop("checked", compartir_totales_titulos);
              options
                .find('input[name="cotizacion[compartir][items]"]')
                .prop("checked", compartir_items);
              options
                .find(
                  'input[name="cotizacion[compartir][totales_items]"]'
                )
                .prop("checked", compartir_totales_items);
              options
                .find(
                  'input[name="cotizacion[compartir][totales_cotizacion]"]'
                )
                .prop("checked", compartir_totales_cotizacion);
              options
                .find(
                  'input[name="cotizacion[compartir][ocultar_cantidades]"]'
                )
                .prop("checked", compartir_ocultar_cantidades);
              options
                .find(
                  'input[name="cotizacion[compartir][ocultar_items_cero]"]'
                )
                .prop("checked", compartir_ocultar_items_cero);
              options
                .find(
                  'input[name="cotizacion[compartir][mostrar_fecha_creacion]"]'
                )
                .prop("checked", compartir_fecha_creacion);
              options
                .find(
                  'input[name="cotizacion[compartir][solo_resumen]"]'
                )
                .prop("checked", compartir_solo_resumen);

              if (!compartir_items) {
                options
                  .find(
                    'input[name="cotizacion[compartir][totales_items]"]'
                  )
                  .prop("disabled", true);
                options
                  .find(
                    'input[name="cotizacion[compartir][ocultar_cantidades]"]'
                  )
                  .prop("disabled", true);
                //options.find('input[name="cotizacion[compartir][ocultar_items_cero]"]').prop('disabled', true);
              }

              options
                .find('input[name^="cotizacion"]')
                .change(function (event) {
                  var fields = {};

                  fields["id"] = $("section.sheet").data("id");
                  fields[$(event.target).attr("name")] = $(
                    event.target
                  ).prop("checked");

                  //unaBase.ui.block();
                  $.ajax({
                    url: "/4DACTION/_V3_setCotizacion",
                    data: fields,
                    dataType: "json",
                    async: false,
                    success: function (data) {
                      //unaBase.ui.unblock();
                      if (data.success) {
                        $('[data-name="share"]').data("is-saved", true);
                        switch ($(event.target).attr("name")) {
                          case "cotizacion[compartir][totales_titulos]":
                            compartir_totales_titulos = $(
                              event.target
                            ).prop("checked");
                            break;
                          case "cotizacion[compartir][items]":
                            compartir_items = $(event.target).prop(
                              "checked"
                            );
                            options
                              .find(
                                'input[name="cotizacion[compartir][totales_items]"]'
                              )
                              .prop("disabled", !compartir_items);
                            break;
                          case "cotizacion[compartir][totales_items]":
                            compartir_totales_items = $(
                              event.target
                            ).prop("checked");
                            break;
                          case "cotizacion[compartir][totales_cotizacion]":
                            compartir_totales_cotizacion = $(
                              event.target
                            ).prop("checked");
                            break;
                          case "cotizacion[compartir][ocultar_cantidades]":
                            compartir_ocultar_cantidades = $(
                              event.target
                            ).prop("checked");
                            break;
                          case "cotizacion[compartir][ocultar_items_cero]":
                            compartir_ocultar_items_cero = $(
                              event.target
                            ).prop("checked");
                            break;
                          case "cotizacion[compartir][mostrar_fecha_creacion]":
                            compartir_fecha_creacion = $(
                              event.target
                            ).prop("checked");
                            break;
                        }
                      }
                    }
                  });
                });

              htmlObject.append(options);
            }






            if (mostrar_compartir_carta_cliente) {
              htmlObject
                .find("button.carta")
                .button({
                  name: "carta",
                  icons: {
                    primary: "ui-icon-circle-arrow-s"
                  },
                  caption: "Carta Cliente"
                })
                .click(async function () {
                  const trs = document.querySelectorAll('.items.cotizacion > tbody > tr.title')
                  let items = []
                  for (let i = 0; i <= trs.length; i++) {
                    if (trs[i] !== undefined) {
                      let name = trs[i].children[2].children[0].value
                      items.push(name)
                    }
                  }

                  if (texto_observaciones === '') {
                    items.forEach(v => {
                      texto_observaciones += '* ' + v + '\n'
                    })
                  }

                  let parametros = await params.data();
                  let continueAction = () => {
                    unaBase.ui.block()

                    if ($('[data-name="share"]').data("is-saved")) {
                      var htmlObject = $(
                        '<section> \
                        <span>Texto carta cliente:</span> \
                        <form> \
                          <textarea name="texto_carta_cliente" rows="8" style="font-size: 10px !important;"></textarea> \
                        </form> \
                        <br>\
                        <span>Incluye:</span> \
                        <form> \
                          <textarea name="observaciones" rows="8" style="font-size: 10px !important;"></textarea> \
                        </form> \
                        <br>\
                        <span>No Incluye:</span> \
                        <form> \
                          <textarea name="no_incluye" rows="8" style="font-size: 10px !important;"></textarea> \
                        </form> \
                      </section>'
                      );
                      htmlObject
                        .find('textarea[name="texto_carta_cliente"]')
                        .text(texto_carta_cliente);
                      htmlObject
                        .find('textarea[name="observaciones"]')
                        .text(texto_observaciones);
                      htmlObject
                        .find('textarea[name="no_incluye"]')
                        .text(texto_no_incluye);
                      htmlObject
                        .find("textarea")
                        .on("blur change", function () {
                          htmlObject.data("response", {
                            texto_carta_cliente: htmlObject
                              .find('textarea[name="texto_carta_cliente"]')
                              .val(),
                            observaciones: htmlObject
                              .find('textarea[name="observaciones"]')
                              .val(),
                            no_incluye: htmlObject
                              .find('textarea[name="no_incluye"]')
                              .val()
                          });
                          texto_carta_cliente = htmlObject
                            .find('textarea[name="texto_carta_cliente"]')
                            .val();
                          texto_observaciones = htmlObject
                            .find('textarea[name="observaciones"]')
                            .val();
                          texto_no_incluye = htmlObject
                            .find('textarea[name="no_incluye"]')
                            .val();
                        });

                      prompt(htmlObject).done(function (input_data) {
                        if (input_data !== false) {
                          unaBase.ui.block()
                          $.ajax({
                            url: "/4DACTION/_V3_setCotizacion",
                            data: {
                              id: $("section.sheet").data("id"),
                              "cotizacion[texto_carta_cliente]":
                                input_data.texto_carta_cliente,
                              "cotizacion[condiciones][notas]":
                                input_data.observaciones,
                              "cotizacion[condiciones][no_incluye]":
                                input_data.no_incluye
                            },
                            dataType: "json",
                            success: function (data) {
                              if (data.success) {
                                unaBase.ui.unblock()
                                $(
                                  'textarea[name="cotizacion[condiciones][notas]"]'
                                ).val(input_data.observaciones);
                                $(
                                  'textarea[name="cotizacion[condiciones][no_incluye]"]'
                                ).val(input_data.no_incluye);

                                var sid = "";
                                $.each($.cookie(), function (clave, valor) {
                                  if (
                                    clave == hash &&
                                    valor.match(/UNABASE/g)
                                  )
                                    sid = valor;
                                });
                                var url =
                                  nodeUrl +
                                  "/download/?download=true&entity=carta_cliente&id=" +
                                  parametros.id +
                                  "&folio=" +
                                  (typeof $("section.sheet").data(
                                    "index"
                                  ) != "undefined"
                                    ? $("section.sheet").data("index")
                                    : "S/N") +
                                  "&sid=" +
                                  unaBase.sid.encoded() +
                                  "&preview=false&nullified=" +
                                  parametros.readonly +
                                  "&template=" +
                                  formato_impresion_cotizacion +
                                  "&aliasfiles=" +
                                  file_name_oficial_cot +
                                  "&hostname=" +
                                  window.location.origin;

                                downloadUrl(url);
                                if (params.entity == "Cotizacion")
                                  unaBase.log.save(
                                    "Ha descargado carta cliente desde " +
                                    etiqueta_cotizacion,
                                    "cotizaciones",
                                    $("section.sheet").data("index")
                                  );
                                else
                                  unaBase.log.save(
                                    "Ha descargado carta cliente desde " +
                                    etiqueta_negocio,
                                    "negocios",
                                    $("section.sheet").data("index")
                                  );
                              } else {
                                toastr.error(
                                  "No fue posible descargar carta cliente. El registro está bloqueado."
                                );
                              }
                            }
                          });
                        }
                      });
                    } else
                      toastr.error(
                        "No es posible descargar carta cliente. El registro está bloqueado."
                      );
                    unaBase.ui.unblock()

                  }

                  saveAction(continueAction, params)

                });
            } else {
              htmlObject.find("button.carta").remove();
            }
            htmlObject
              .find("button.downloadcostopdf")
              .button({
                name: "downloadcostopdf",
                icons: {
                  primary: "ui-icon-circle-arrow-s"
                },
                caption: "Descargar"
              })
              .click(async function () {
                let parametros = await params.data();
                //if ($('[data-name="share"]').data('is-saved')) {
                //loadingLoad('loading', true);
                unaBase.ui.block();
                var continueAction = function () {
                  unaBase.ui.block()
                  var sid = "";
                  $.each($.cookie(), function (clave, valor) {
                    if (clave == hash && valor.match(/UNABASE/g))
                      sid = valor;
                  });

                  let infoCliente = $("section.sheet").find("input[name='cotizacion[titulo][text]']").val();
                  let infoReferencia = $("section.sheet").find("input[name='cotizacion[empresa][id]']").val();

                  var url =
                    nodeUrl +
                    "/download/?download=true&entity=cotizaciones_costos&id=" +
                    parametros.id +
                    "&folio=" +
                    (typeof $("section.sheet").data("index") !=
                      "undefined" ?
                      $("section.sheet").data("index") :
                      "S/N") +
                    "&sid=" +
                    unaBase.sid.encoded() +
                    "&preview=false&nullified=" +
                    parametros.readonly +
                    "&template=" +
                    formato_impresion_cotizacion +
                    "&aliasfiles=" +
                    file_name_oficial_cot +
                    "&hostname=" +
                    window.location.origin +
                    "&cliente=" +
                    infoCliente +
                    "&referencia=" +
                    infoReferencia;

                  console.warn("from plugins");
                  downloadUrl(url);

                  if (params.entity == "Cotizacion")
                    unaBase.log.save(
                      "Ha descargado en PDF " + etiqueta_cotizacion,
                      "cotizaciones",
                      $("section.sheet").data("index")
                    );
                  else
                    unaBase.log.save(
                      "Ha descargado en PDF " + etiqueta_negocio,
                      "negocios",
                      $("section.sheet").data("index")
                    );
                  unaBase.ui.unblock()

                };

                // Se verifica si el PDF es válido antes de mostrarlo
                // (total neto == suma_subtotales)
                if (
                  params.entity == "Cotizacion" ||
                  params.entity == "Negocios"
                ) {
                  var valid, hidden_items;
                  $.ajax({
                    url: "/4DACTION/_V3_checkCotizacionPdf",
                    data: {
                      id: $("section.sheet").data("id")
                    },
                    dataType: "json",
                    async: false,
                    success: function (data) {
                      valid = data.valid;
                      hidden_items = data.hidden_items;
                    }
                  });
                  if (!valid) {
                    switch (params.entity) {
                      case "Cotizacion":
                        var modulo = etiqueta_cotizacion;
                        break;
                      case "Negocios":
                        var modulo = etiqueta_negocio;
                        break;
                    }
                    if (hidden_items) {
                      confirm(
                        "Existen ítems ocultos con precio unitario mayor a 0. ¿Desea generar PDF de todos modos?"
                      ).done(function (data) {
                        if (data) {
                          unaBase.log.save(
                            "Ha generado PDF con ítems ocultos que tienen precio unitario mayor a 0",
                            "cotizaciones",
                            $("section.sheet").data("index")
                          );
                          saveAction(continueAction, params)

                        }
                      });
                    } else {
                      //toastr.error('No es posible descargar PDF. Existen diferencias en ' + modulo + '. Por favor revisar.');
                      saveAction(continueAction, params)

                    }
                    return false;
                  } else {
                    saveAction(continueAction, params)

                  }
                }

                //} else
                //  toastr.error('No es posible descargar PDF. El registro está bloqueado.');


              });

            htmlObject
              .find("button.download")
              .button({
                name: "download",
                icons: {
                  primary: "ui-icon-circle-arrow-s"
                },
                caption: "Descargar"
              })
              .click(async function () {
                let parametros = await params.data();
                //if ($('[data-name="share"]').data('is-saved')) {
                unaBase.ui.block()



                var continueAction = async function () {

                  unaBase.ui.block()
                  const downloadx = () => {
                    var sid = "";
                    $.each($.cookie(), function (clave, valor) {
                      if (clave == hash && valor.match(/UNABASE/g))
                        sid = valor;
                    });

                    let infoCliente = $("section.sheet").find("input[name='cotizacion[titulo][text]']").val();
                    let infoReferencia = $("section.sheet").find("input[name='cotizacion[empresa][id]']").val();

                    var url =
                      nodeUrl +
                      "/download/?download=true&entity=cotizaciones&id=" +
                      parametros.id +
                      "&folio=" +
                      (typeof $("section.sheet").data("index") !=
                        "undefined"
                        ? $("section.sheet").data("index")
                        : "S/N") +
                      "&sid=" +
                      unaBase.sid.encoded() +
                      "&preview=false&nullified=" +
                      parametros.readonly +
                      "&template=" +
                      formato_impresion_cotizacion +
                      "&aliasfiles=" +
                      file_name_oficial_cot +
                      "&hostname=" +
                      window.location.origin +
                      "&cliente=" +
                      infoCliente +
                      "&referencia=" +
                      infoReferencia +
                      "&name_custom_neg=" +
                      unaBase.parametros?.nombre_custom_pdf_neg +
                      "&name_custom_cot=" +
                      unaBase.parametros?.nombre_custom_pdf_cot +
                      "&module=" +
                      document.querySelector('.nav-menu ul li.active')?.dataset?.name

                    if (pdf.microservice) {
                      console.warn("from microservice");

                      axios(url).then(res => {
                        // console.log(res);
                        axios
                          .post(
                            pdf.url,
                            {
                              url: res.data.url,
                              fileName: res.data.fileName
                            },
                            {
                              headers: {
                                Authorization: pdf.apiKey
                              }
                            }
                          )
                          .then(resp => {
                            downloadUrl(resp.data.pdf);
                          })
                          .catch(err => {
                            console.error(err);
                          });
                      });
                    } else {
                      console.warn("from plugins");
                      downloadUrl(url);
                    }
                    if (params.entity == "Cotizacion")
                      unaBase.log.save(
                        "Ha descargado en PDF " + etiqueta_cotizacion,
                        "cotizaciones",
                        $("section.sheet").data("index")
                      );
                    else
                      unaBase.log.save(
                        "Ha descargado en PDF " + etiqueta_negocio,
                        "negocios",
                        $("section.sheet").data("index")
                      );
                    unaBase.ui.unblock()

                    unaBase.log.save(
                      "Ha generado PDF con ítems ocultos que tienen precio unitario mayor a 0",
                      "cotizaciones",
                      $("section.sheet").data("index")
                    );
                  }

                  // Se verifica si el PDF es válido antes de mostrarlo
                  // (total neto == suma_subtotales)
                  if (
                    params.entity == "Cotizacion" ||
                    params.entity == "Negocios"
                  ) {
                    var valid, hidden_items;

                    checkDifference = await business.checkDifference(unaBase.doc.id);




                    $.ajax({
                      url: "/4DACTION/_V3_checkCotizacionPdf",
                      data: {
                        id: $("section.sheet").data("id")
                      },
                      dataType: "json",
                      async: false,
                      success: function (data) {
                        valid = data.valid;
                        hidden_items = data.hidden_items;
                      }
                    });


                    if (valid && !checkDifference.hasDifference) {
                      switch (params.entity) {
                        case "Cotizacion":
                          var modulo = etiqueta_cotizacion;
                          break;
                        case "Negocios":
                          var modulo = etiqueta_negocio;
                          break;
                      }
                      if (hidden_items) {
                        confirm(
                          "Existen ítems ocultos con precio unitario mayor a 0. ¿Desea generar PDF de todos modos?"
                        ).done(function (data) {
                          if (data) {

                            downloadx()
                          }
                        });
                      } else {
                        //toastr.error('No es posible descargar PDF. Existen diferencias en ' + modulo + '. Por favor revisar.');
                        downloadx()
                      }
                      return false;
                    } else {
                      //saveAction(continueAction,params)
                      toastr.warning("Lo sentimos ! no pudimos obtener el documento, Error 1501, comunícate con soporte de inmediato para resolver.");
                      toastr.warning("Verifique los montos y guarde antes de descargar");

                      unaBase.ui.unblock();
                    }
                  }



                };

                saveAction(continueAction, params)



              });
            var target = htmlObject;
            htmlObject
              .find("button.email")
              .button({
                name: "email",
                icons: {
                  primary: "ui-icon-mail-closed"
                },
                caption: "Enviar por email"
              })
              .click(async function () {
                let parametros = await params.data();
                unaBase.ui.block()

                let continueAction = () => {
                  unaBase.ui.block()

                  if (
                    params.entity == "Cotizacion" ||
                    params.entity == "Negocios"
                  ) {
                    var valid, hidden_items;
                    $.ajax({
                      url: "/4DACTION/_V3_checkCotizacionPdf",
                      data: {
                        id: $("section.sheet").data("id")
                      },
                      dataType: "json",
                      async: false,
                      success: function (data) {
                        valid = data.valid;
                        hidden_items = data.hidden_items;
                      }
                    });
                    if (!valid) {
                      switch (params.entity) {
                        case "Cotizacion":
                          var modulo = etiqueta_cotizacion;
                          break;
                        case "Negocios":
                          var modulo = etiqueta_negocio;
                          break;
                      }
                      if (hidden_items) {
                        toastr.error(
                          "No es posible enviar " +
                          modulo +
                          " por email. Existen diferencias debido a que hay ítems ocultos con precio unitario mayor a 0. Por favor revisar."
                        );
                      } else {
                        toastr.error(
                          "No es posible envar " +
                          modulo +
                          " por email. Existen diferencias en " +
                          modulo +
                          ". Por favor revisar."
                        );
                      }
                      return false;
                    }
                  }

                  var sendCotizacionByEmail = async function (address) {

                    var sid = "";
                    $.each($.cookie(), function (clave, valor) {
                      if (clave == hash && valor.match(/UNABASE/g))
                        sid = valor;
                    });

                    var index =
                      typeof $("section.sheet").data("index") != "undefined"
                        ? $("section.sheet").data("index")
                        : "S/N";
                    var text = (typeof $(
                      '[name="cotizacion[titulo][text]"]'
                    ).val() == "undefined"
                      ? $(
                        "section.sheet > footer:nth-of-type(1) > article:nth-of-type(1) > h2 > span:nth-of-type(2)"
                      ).text()
                      : $('[name="cotizacion[titulo][text]"]').val()
                    ).capitalizeAllWords();
                    var sender = $("html > body.home > aside > div > div > h1")
                      .text()
                      .capitalizeAllWords();
                    var from_name = $("html > body.home > aside > div > div > h1")
                      .text()
                      .capitalizeAllWords();
                    var sendMsg = async function (
                      document,
                      index,
                      text,
                      senderName
                    ) {
                      var retval;
                      $.ajax({
                        url: "/v3/views/cotizaciones/email.shtml",
                        dataType: "html",
                        async: false,
                        success: function (data) {
                          retval = $("<div>").html(data);
                        }
                      });
                      retval.find("[data-document]").html(document);
                      retval.find("[data-index]").html(index);
                      retval.find("[data-text]").html(text);
                      retval.find("[data-sender-name]").html(senderName);
                      retval.find("[data-from-name]").html(from_name);
                      var now = new Date();
                      retval
                        .find("[data-date]")
                        .html(
                          now.getDate() +
                          "-" +
                          (now.getMonth() + 1) +
                          "-" +
                          now.getFullYear()
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
                      return retval.html();
                    };
                    var msg = sendMsg("Cotización", index, text, sender);
                    var attachments = [
                      {
                        cid: "logo.png",
                        url:
                          "https://" +
                          window.location.hostname +
                          "/v3/design/html/body.menu/nav/h1.png"
                      },
                      {
                        cid: "empresa.jpg",
                        url:
                          "https://" +
                          window.location.hostname +
                          "/4DACTION/logo_empresa_web"
                      }
                    ];
                    unaBase.ui.block();

                    $.ajax({
                      url:
                        nodeUrl +
                        "/send/",
                      data: {
                        download: true,
                        entity: "cotizaciones",
                        id: parametros.id,
                        folio: index,
                        document: "Cotización",
                        text: text,
                        sid: sid,
                        email: address,
                        //preview: target.find('[name="draft"]').val(),
                        preview: false,
                        nullified: parametros.readonly,
                        sender: sender,
                        msg: msg,
                        attachments: JSON.stringify(attachments),
                        from: $("html > body.menu.home > aside > div > div > h1").data(
                          "email"
                        ),
                        username: $(
                          "html > body.menu.home > aside > div > div > h1"
                        ).data("username"),
                        aliasfiles: file_name_oficial_cot
                      },
                      type: "GET",
                      dataType: "jsonp",
                      success: function (data) {
                        unaBase.ui.unblock();
                        if (data.status) {
                          toastr.info(
                            sprintf(
                              NOTIFY.get("SUCCESS_EMAIL_SEND"),
                              address
                            )
                          );
                          unaBase.log.save(
                            "Ha enviado " +
                            etiqueta_cotizacion +
                            " por email a " +
                            address,
                            "cotizaciones",
                            index
                          );
                        } else {
                          toastr.error(
                            "No se ha podido enviar el email. No hay servidores de correo disponibles. Detalle: " +
                            data.error.code
                          );
                          console.log(data.error);
                        }
                      },
                      error: function (data) {
                        unaBase.ui.unblock();
                        toastr.error(
                          sprintf(NOTIFY.get("ERROR_INTERNAL"), address)
                        );
                      }
                    });
                  };

                  var email =
                    typeof $(
                      '[name="cotizacion[empresa][contacto][email]"]'
                    ).val() != "undefined"
                      ? $(
                        '[name="cotizacion[empresa][contacto][email]"]'
                      ).val()
                      : "";
                  if (email != "") {
                    confirm(
                      sprintf(
                        MSG.get("CONFIRM_COTIZACION_SEND_CONTACT"),
                        email
                      ),
                      email,
                      "Otro contacto"
                    ).done(function (data) {
                      if (data) {
                        sendCotizacionByEmail(email);
                      } else {
                        var htmlObject = $(
                          '<section> \
                            <span>Ingrese la dirección de email</span> \
                            <form autocomplete="on" target="the_iframe" action="about:blank"> \
                              <input style="border-bottom: 1px solid black;" required type="email" name="email"> \
                            </form> \
                            <iframe style="display: none;" id="the_iframe" name="the_iframe" src="about:blank"></iframe> \
                          </section>'
                        );
                        htmlObject
                          .find("input")
                          .on("blur change", function () {
                            htmlObject.data("response", $(this).val());
                            htmlObject.find("form")[0].submit();
                          });
                        prompt(htmlObject).done(function (data) {
                          if (data !== false) {
                            htmlObject.find("form")[0].submit();
                            sendCotizacionByEmail(data);
                          }
                        });
                      }
                    });
                  } else {
                    var htmlObject = $(
                      '<section> \
                        <span>Ingrese la dirección de email</span> \
                        <form autocomplete="on" target="the_iframe" action="about:blank"> \
                          <input style="border-bottom: 1px solid black;" required type="email" name="email"> \
                        </form> \
                        <iframe style="display: none;" id="the_iframe" name="the_iframe" src="about:blank"></iframe> \
                      </section>'
                    );
                    htmlObject.find("input").on("blur change", function () {
                      htmlObject.data("response", $(this).val());
                    });
                    prompt(htmlObject).done(function (data) {
                      if (data !== false) {
                        htmlObject.find("form")[0].submit();
                        sendCotizacionByEmail(data);
                      }
                    });
                  }

                  unaBase.ui.unblock()


                }

                saveAction(continueAction, params)




              });

            htmlObject
              .find("button.export")
              .button({
                name: "export",
                icons: {
                  primary: "ui-icon-document"
                },
                caption: "Exportar"
              })
              .click(async function () {
                unaBase.ui.block()
                let parametros = await params.data();

                let continueAction = () => {
                  unaBase.ui.block()

                  if (
                    params.entity == "Cotizacion" ||
                    params.entity == "Negocios"
                  ) {
                    var valid, hidden_items;
                    $.ajax({
                      url: "/4DACTION/_V3_checkCotizacionPdf",
                      data: {
                        id: $("section.sheet").data("id")
                      },
                      dataType: "json",
                      async: false,
                      success: function (data) {
                        valid = data.valid;
                        hidden_items = data.hidden_items;
                      }
                    });
                    if (!valid) {
                      switch (params.entity) {
                        case "Cotizacion":
                          var modulo = etiqueta_cotizacion;
                          break;
                        case "Negocios":
                          var modulo = etiqueta_negocio;
                          break;
                      }
                      if (hidden_items) {
                        toastr.error(
                          "No es posible exportar " +
                          modulo +
                          ". Existen diferencias debido a que hay ítems ocultos con precio unitario mayor a 0. Por favor revisar."
                        );
                      } else {
                        toastr.error(
                          "No es posible exportar " +
                          modulo +
                          ". Existen diferencias en " +
                          modulo +
                          ". Por favor revisar."
                        );
                      }
                      return false;
                    }
                  }

                  //var url = 'http://desarrollo.unabase.cl:3000/download/?download=true&entity=cotizaciones&id=' + parametros.id + '&folio=' + ((typeof parametros.index != 'undefined')? parametros.index : 'S/N')+ '&sid=' + unaBase.sid.encoded() + '&preview=' + ((htmlObject.find('[name="draft"]').prop('checked'))? 'true' : 'false') + '&nullified=' + parametros.readonly;
                  var sid = "";
                  $.each($.cookie(), function (clave, valor) {
                    if (clave == hash && valor.match(/UNABASE/g))
                      sid = valor;
                  });

                  var url =
                    nodeUrl +
                    "/export-cotizacionexcel/?download=true&entity=cotizaciones&id=" +
                    parametros.id +
                    "&folio=" +
                    (typeof $("section.sheet").data("index") != "undefined"
                      ? $("section.sheet").data("index")
                      : "S/N") +
                    "&sid=" +
                    unaBase.sid.encoded() +
                    "&preview=false&nullified=" +
                    parametros.readonly +
                    "&hostname=" +
                    window.location.origin;
                  var download = window.open(url).blur();

                  unaBase.log.save(
                    "Ha descargado excel cliente",
                    "cotizaciones",
                    $("section.sheet").data("index")
                  );

                  window.focus();
                  try {
                    download.close();
                  } catch (err) {
                    console.log(err);
                  }
                  unaBase.ui.unblock()

                }

                saveAction(continueAction, params)
              });

            if (
              params.entity == "Cotizacion" ||
              params.entity == "Negocios"
            ) {
              htmlObject.find("button").click(function () {
                //if (target.find('[name="draft"]').val() == 'false')
                $.ajax({
                  url: "/4DACTION/_V3_setVersionByCotizacion",
                  data: {
                    id: $("section.sheet").data("id")
                  },
                  dataType: "json",
                  success: function (data) {
                    if (data.success && data.unique) {
                      toastr.info(NOTIFY.get("INFO_COTIZACION_VERSION"));
                      $("#version").html(data.index);
                    }
                  }
                });
              });
            }
            return htmlObject;
          },
          interactive: true,
          trigger: 'hover'
        }).tooltipster('show');

        // obtén la instancia
        var instance = $(this).data('plugin_tooltipster');
        var mouseIsOverTooltip = false; // Para rastrear si el mouse está sobre el tooltip
        var mouseIsOverElement = false; // Para rastrear si el mouse está sobre el elemento

        // configura los eventos mouseleave
        $(this).on('mouseleave', function () {
          mouseIsOverElement = false; // Actualizamos nuestra variable
          setTimeout(function () {
            if (!mouseIsOverTooltip && !mouseIsOverElement) { // Verificamos nuestras variables en lugar de usar .is(':hover')
              if ($(this).hasClass('tooltipstered')) { // Solo cierra el tooltip si el elemento ha sido inicializado con Tooltipster
                $(this).tooltipster('hide');
              }
            }
          }.bind(this), 100);
        });

        // Muestra el tooltip al entrar con el mouse
        $(this).on('mouseenter', function () {
          mouseIsOverElement = true; // Actualizamos nuestra variable
          if ($(this).hasClass('tooltipstered')) { // Solo abre el tooltip si el elemento ha sido inicializado con Tooltipster
            $(this).tooltipster('show');
          }
        });

        // Muestra el tooltip al entrar con el mouse en el elemento tooltip
        $(document).on('mouseenter', '.tooltipster-base', function () {
          mouseIsOverTooltip = true; // Actualizamos nuestra variable
          if ($(this).prev().hasClass('tooltipstered')) { // Solo abre el tooltip si el elemento ha sido inicializado con Tooltipster
            $(this).prev().tooltipster('show');
          }
        });

        // Oculta el tooltip al salir con el mouse del elemento tooltip
        $(document).on('mouseleave', '.tooltipster-base', function () {
          mouseIsOverTooltip = false; // Actualizamos nuestra variable
          setTimeout(function () {
            if (!mouseIsOverElement) { // Verificamos nuestra variable en lugar de usar .is(':hover')
              if ($(this).prev().hasClass('tooltipstered')) { // Solo cierra el tooltip si el elemento ha sido inicializado con Tooltipster
                $(this).prev().tooltipster('hide');
              }
            }
          }.bind(this), 100);
        });

      }
    });


  if ($.inArray("share_oc", params.buttons) != -1)
    buttons.push({
      name: "share_oc",
      icons: {
        primary: "ui-icon-extlink",
        secondary: "ui-icon-triangle-1-s"
      },
      caption: "Compartir",
      action: function () {
        var el = $(this);
        let continueAction = () => {
          el.tooltipster({
            content: function () {


              var htmlObject = $(
                ' \
                  <fieldset> \
                    <legend style="display: none;">¿Cómo desea obtenerla?</legend> \
                    <button class="download">Descargar PDF</button> \
                    <button class="email">Enviar por email</button> \
                    <button class="email" data-type="email2">Enviar + Pedir factura</button> \
                    <button class="contrato" data-type="email2">Contrato</button>\
                  </fieldset> \
                '
              );

              htmlObject
                .find("button.contrato")
                .button({
                  name: "contrato",
                  icons: {
                    primary: "ui-icon-circle-arrow-s"
                  },
                  caption: "Contrato"
                })
                .click(function () {
                  const id_cont = $('input[type="search"][name="contacto[info][alias]"]').data('id')
                  let config = {
                    method: 'get',
                    url: `${nodeUrl}/generate-contract?hostname=${window.location.origin}&id_cont=${id_cont}&sid=${unaBase.sid.encoded()}`,
                    responseType: 'blob'
                  };

                  try {
                    axios(config)
                      .then(res => {

                        const url = window.URL.createObjectURL(new Blob([res.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', 'contrato.docx'); // Nombre del archivo a descargar
                        document.body.appendChild(link);
                        link.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(link);
                      })
                      .catch(err => {
                        unaBase.ui.unblock()

                        alert(
                          "No se pudo asignar el documento."
                        );
                        toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                      });
                  } catch (err) {
                    toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                    throw err;
                  }

                });

              if (!compras.btnContrato) {
                htmlObject.find("button.contrato").hide()
              }


              var aliasfilesGastos = "";
              if (compras.tipoGasto == "FXR") {
                aliasfilesGastos = file_name_oficial_fxr;
              } else {
                aliasfilesGastos = file_name_oficial_oc;
              }

              const checkGasto = async () => {
                const id = $("#sheet-compras").data("id");
                let config = {

                  method: 'get',
                  url: `${nodeUrl}/check-share-oc?sid=${unaBase.sid.encoded()}&hostname=${window.location.origin}&id_oc=${id}`,

                };

                try {
                  let res = await axios(config);

                  return res.data;
                } catch (err) {
                  throw err;
                }
              }

              htmlObject
                .find("button.download")
                .button({
                  name: "download",
                  icons: {
                    primary: "ui-icon-circle-arrow-s"
                  },
                  caption: "Descargar"
                })
                .click(function () {
                  //unaBase.ui.block();

                  var sid = "";
                  $.each($.cookie(), function (clave, valor) {
                    if (clave == hash && valor.match(/UNABASE/g))
                      sid = valor;
                  });

                  var id = $.unserialize(params.data()).id;
                  var folio = $.unserialize(params.data()).folio;
                  if (folio == "") {
                    folio = $("#sheet-compras").data("index");
                  }

                  var url =
                    nodeUrl +
                    "/download/?download=true&entity=compras&entitytwo=" +
                    compras.tipoGasto +
                    "&id=" +
                    id +
                    "&folio=" +
                    (typeof folio != "undefined" ? folio : "S/N") +
                    "&sid=" +
                    unaBase.sid.encoded() +
                    "&preview=false&nullified=" +
                    params.data().readonly +
                    "&template=" +
                    unaBase.print_compras +
                    "&aliasfiles=" +
                    aliasfilesGastos +
                    "&hostname=" +
                    window.location.origin;

                  if (pdf.microservice) {
                    // console.warn(url);

                    axios(url).then(res => {
                      // console.log(res);
                      axios
                        .post(
                          pdf.url,
                          {
                            url: res.data.url,
                            fileName: res.data.fileName
                          },
                          {
                            headers: {
                              Authorization: pdf.apiKey
                            }
                          }
                        )
                        .then(resp => {
                          downloadUrl(resp.data.pdf);
                        })
                        .catch(err => {
                          console.error(err);
                        });
                    });
                  } else {
                    downloadUrl(url);
                  }
                  // downloadUrl(url);

                  // unaBase.log.save('Ha descargado en PDF el gasto', 'gastos', index);
                  compras.saveLogsFromWeb({
                    id: compras.id,
                    folio: compras.folio,
                    descripcion: "Ha descargado en PDF el gasto",
                    modulo: "gastos",
                    descripcion_larga: ""
                  });

                  // unaBase.ui.unblock();
                });
              var target = htmlObject;
              htmlObject
                .find("button.email")
                .button({
                  name: "email",
                  icons: {
                    primary: "ui-icon-mail-closed"
                  },
                  caption: "Enviar por email"
                })
                .click(async function (e) {
                  let event = e
                  const type = event.currentTarget.dataset.type

                  //Check de gastos

                  if (type == 'email2') {
                    const res_check = await checkGasto()
                    if (!res_check.success) {
                      toastr.warning(
                        'No es posible compartir la OC debido a lo siguiente: ' + res_check.errorMsg.replaceAll(/SL/g, '<br>')
                      );

                      return;
                    }

                  }

                  var sendCotizacionByEmail = async function (address) {
                    unaBase.ui.block();

                    var sid = "";
                    $.each($.cookie(), function (clave, valor) {
                      if (clave == hash && valor.match(/UNABASE/g))
                        sid = valor;
                    });

                    var index = $("#sheet-compras")
                      .data("index");
                    // .capitalizeAllWords();
                    var text = $('input[name="oc[referencia]"]')
                      .val();
                    //.capitalizeAllWords();
                    var sender = $("html > body.home > aside > div > div > h1")
                      .text().trim();
                    // .capitalizeAllWords();
                    var sendMsg = async function (
                      document,
                      index,
                      text,
                      senderName
                    ) {
                      var retval;
                      $.ajax({
                        url: "/v3/views/compras/email.shtml",
                        dataType: "html",
                        async: false,
                        success: function (data) {
                          retval = $("<div>").html(data);
                        }
                      });
                      retval.find("[data-document]").html(document);
                      retval.find("[data-index]").html(index);
                      retval.find("[data-text]").html(text);
                      retval.find("[data-sender-name]").html(senderName);
                      return retval.html();
                    };

                    var documents = "";
                    if (compras.tipoGasto == "FXR") {
                      documents = "Rendición de fondos";
                    } else {
                      documents = "Orden de compra";
                    }

                    var msg = await sendMsg(documents, index, text, sender);
                    var attachments = [
                      {
                        cid: "logo.png",
                        url:
                          "https://" +
                          window.location.hostname +
                          "/v3/design/html/body.menu/nav/h1.png"
                      },
                      {
                        cid: "empresa.jpg",
                        url:
                          "https://" +
                          window.location.hostname +
                          "/4DACTION/logo_empresa_web"
                      }
                    ];

                    let empresa = document.querySelector('.profile h1').dataset.organizacion

                    $.ajax({
                      url:
                        nodeUrl +
                        "/send/",
                      data: {
                        download: true,
                        entity: "compras",
                        entitytwo: compras.tipoGasto,
                        id: $.unserialize(params.data()).id,
                        folio: index,
                        document: documents,
                        text: text,
                        sid: sid,
                        empresa,
                        hostname: location.origin,
                        email: address,
                        preview: false,
                        nullified: params.data().readonly,
                        sender: sender,
                        template: 'share_oc',
                        msg: msg,
                        typeEmail: type,
                        print: unaBase.print_compras,
                        attachments: JSON.stringify(attachments),
                        from: $("html > body.menu.home > aside > div > div > h1").data(
                          "email"
                        ),
                        username: $(
                          "html > body.menu.home > aside > div > div > h1"
                        ).data("username"),
                        aliasfiles: aliasfilesGastos
                      },
                      async: false,
                      type: "GET",
                      dataType: "jsonp",
                      success: function (data) {
                        unaBase.ui.unblock();
                        toastr.success(
                          sprintf(NOTIFY.get("SUCCESS_EMAIL_SEND"), address)
                        );
                        // unaBase.log.save('Ha enviado por email el gasto', 'gastos', index);
                        compras.saveLogsFromWeb({
                          id: compras.id,
                          folio: compras.folio,
                          descripcion:
                            "Ha compartido el gasto vía email a la dirección: " +
                            address,
                          modulo: "gastos",
                          descripcion_larga: ""
                        });
                      },
                      error: function (data) {
                        unaBase.ui.unblock();
                        toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                      }
                    });
                  };

                  var emailProveedor = "";
                  var emailRelacionado = "";
                  var emailProveedor = $.trim(
                    $("#sheet-compras")
                      .find('input[name="contacto[info][email]"]')
                      .val()
                  );
                  var emailRelacionado = $.trim(
                    $("#sheet-compras")
                      .find('input[name="relacionado[info][email]"]')
                      .val()
                  );

                  var email = "";
                  if (emailProveedor != "") {
                    email = emailProveedor;
                  } else {
                    if (emailRelacionado != "" && email == "") {
                      email = emailRelacionado;
                    }
                  }

                  var labelContacto = "contacto";
                  if (compras.tipoGasto == "FXR") {
                    labelContacto = "solicitante";
                  } else {
                    labelContacto = "proveedor";
                  }

                  if (email != "") {
                    emailProveedor = emailProveedor.toLowerCase();
                    emailRelacionado = emailRelacionado.toLowerCase();
                    var button = "Enviar a: " + email.toLowerCase();
                    confirm(
                      'Se encontró el siguiente email: <strong style="font-weight:bold!important">' +
                      email.toLowerCase() +
                      "</strong>",
                      button,
                      "Enviar a otro email"
                    ).done(function (data) {
                      if (data) {
                        sendCotizacionByEmail(email);
                      } else {
                        /*var htmlObject = $('<section> \
                        <span>Por favor ingrese una dirección: </span> \
                        <input required type="email" style="border-bottom:solid 1px!important;width:300px" name="email"> \
                        <div style="margin:5px"><br><input type="checkbox" name="default"> Dejar email por defecto.</div> \
                      </section>*/
                        var htmlObject = $(
                          '<section> \
                          <span>Ingrese la dirección de email</span> \
                          <form autocomplete="on" target="the_iframe" action="about:blank"> \
                            <input style="border-bottom: 1px solid black;" required type="email" name="email"> \
                          </form> \
                          <iframe style="display: none;" id="the_iframe" name="the_iframe" src="about:blank"></iframe> \
                        </section>'
                        );

                        htmlObject
                          .find('input[name="email"]')
                          .on("blur change", function () {
                            htmlObject.data("response", $(this).val());
                            htmlObject
                              .find("input")
                              .css("background-color", "white");
                          });

                        prompt(htmlObject).done(function (data) {
                          if (data !== false && data !== "") {
                            htmlObject.find("form")[0].submit();
                            sendCotizacionByEmail(data);
                            if (
                              htmlObject
                                .find('input[name="default"]')
                                .prop("checked")
                            ) {
                              unaBase.contacto.set({
                                id: $("#sheet-compras")
                                  .find('input[name="contacto[info][id]"]')
                                  .val(),
                                email: htmlObject
                                  .find('input[name="email"]')
                                  .val(),
                                cliprov: "PROVEEDOR",
                                tipo: "PERSONA",
                                labelMsg: labelContacto
                              });
                              $("#sheet-compras")
                                .find('input[name="contacto[info][email]"]')
                                .val(
                                  htmlObject
                                    .find('input[name="email"]')
                                    .val()
                                );
                            }
                          }
                        });
                      }
                    });
                  } else {
                    var htmlObject = $(
                      "<section> \
                      <span>No existe email asociado al " +
                      labelContacto +
                      '. Por favor ingrese una dirección: </span> \
                      <input required type="email" style="border-bottom:solid 1px!important;width:300px" name="email"> \
                      <div style="margin:5px"><br><input type="checkbox" name="default"> Dejar email por defecto.</div> \
                    </section>'
                    );

                    htmlObject
                      .find('input[name="email"]')
                      .on("blur change", function () {
                        htmlObject.data("response", $(this).val());
                        htmlObject
                          .find("input")
                          .css("background-color", "white");
                      });

                    prompt(htmlObject).done(function (data) {
                      if (data !== false && data !== "") {
                        sendCotizacionByEmail(data);
                        if (
                          htmlObject
                            .find('input[name="default"]')
                            .prop("checked")
                        ) {
                          unaBase.contacto.set({
                            id: $("#sheet-compras")
                              .find('input[name="contacto[info][id]"]')
                              .val(),
                            email: htmlObject
                              .find('input[name="email"]')
                              .val(),
                            cliprov: "PROVEEDOR",
                            tipo: "PERSONA",
                            labelMsg: labelContacto
                          });
                          $("#sheet-compras")
                            .find('input[name="contacto[info][email]"]')
                            .val(
                              htmlObject.find('input[name="email"]').val()
                            );
                        }
                      }
                    });
                  }
                });

              return htmlObject;





            },
            trigger: 'click',
            interactive: true,
            autoClose: true,
            delay: 0,
            contentAsHTML: true,
            onlyOne: true,

            interactiveTolerance: 1000,


          });
          el.tooltipster("show");
        }

        saveAction(continueAction, params)




      }
    });


  if ($.inArray("share_cot_val", params.buttons) != -1) {
    buttons.push({
      name: "share_cot_val",
      icon: "ui-icon-extlink",
      caption: "Compartir",
      action: function () {

        if (
          params.entity == "Cotizacion" ||
          params.entity == "Negocios"
        ) {
          var valid, hidden_items;
          $.ajax({
            url: "/4DACTION/_V3_checkCotizacionPdf",
            data: {
              id: $("section.sheet").data("id")
            },
            dataType: "json",
            async: false,
            success: function (data) {
              valid = data.valid;
              hidden_items = data.hidden_items;
            }
          });
          if (!valid) {
            switch (params.entity) {
              case "Cotizacion":
                var modulo = etiqueta_cotizacion;
                break;
              case "Negocios":
                var modulo = etiqueta_negocio;
                break;
            }
            if (hidden_items) {
              toastr.error(
                "No es posible enviar " +
                modulo +
                " por email. Existen diferencias debido a que hay ítems ocultos con precio unitario mayor a 0. Por favor revisar."
              );
            } else {
              toastr.error(
                "No es posible envar " +
                modulo +
                " por email. Existen diferencias en " +
                modulo +
                ". Por favor revisar."
              );
            }
            return false;
          }
        }


        var sendCotizacionByEmail = async function (address) {

          var sid = "";
          $.each($.cookie(), function (clave, valor) {
            if (clave == hash && valor.match(/UNABASE/g))
              sid = valor;
          });

          var index =
            typeof $("section.sheet").data("index") != "undefined"
              ? $("section.sheet").data("index")
              : "S/N";
          var text = (typeof $(
            '[name="cotizacion[titulo][text]"]'
          ).val() == "undefined"
            ? $(
              "section.sheet > footer:nth-of-type(1) > article:nth-of-type(1) > h2 > span:nth-of-type(2)"
            ).text()
            : $('[name="cotizacion[titulo][text]"]').val()
          ).capitalizeAllWords();
          var sender = $("html > body.home > aside > div > div > h1")
            .text()
            .capitalizeAllWords();
          var from_name = $("html > body.home > aside > div > div > h1")
            .text()
            .capitalizeAllWords();
          var sendMsg = async function (
            document,
            index,
            text,
            senderName
          ) {
            var retval;
            $.ajax({
              url: "/v3/views/cotizaciones/email.shtml",
              dataType: "html",
              async: false,
              success: function (data) {
                retval = $("<div>").html(data);
              }
            });
            retval.find("[data-document]").html(document);
            retval.find("[data-index]").html(index);
            retval.find("[data-text]").html(text);
            retval.find("[data-sender-name]").html(senderName);
            retval.find("[data-from-name]").html(from_name);
            var now = new Date();
            retval
              .find("[data-date]")
              .html(
                now.getDate() +
                "-" +
                (now.getMonth() + 1) +
                "-" +
                now.getFullYear()
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
            return retval.html();
          };
          var msg = sendMsg("Cotización", index, text, sender);
          var attachments = [
            {
              cid: "logo.png",
              url:
                "https://" +
                window.location.hostname +
                "/v3/design/html/body.menu/nav/h1.png"
            },
            {
              cid: "empresa.jpg",
              url:
                "https://" +
                window.location.hostname +
                "/4DACTION/logo_empresa_web"
            }
          ];
          unaBase.ui.block();
          $.ajax({
            url:
              nodeUrl +
              "/send/",
            data: {
              download: true,
              entity: "cotizaciones",
              id: params.data().id,
              folio: index,
              document: "Cotización",
              text: text,
              sid: sid,
              email: address,
              //preview: target.find('[name="draft"]').val(),
              preview: false,
              nullified: params.data().readonly,
              sender: sender,
              msg: msg,
              attachments: JSON.stringify(attachments),
              from: $("html > body.menu.home > aside > div > div > h1").data(
                "email"
              ),
              username: $(
                "html > body.menu.home > aside > div > div > h1"
              ).data("username"),
              aliasfiles: file_name_oficial_cot
            },
            type: "GET",
            dataType: "jsonp",
            success: function (data) {
              unaBase.ui.unblock();
              if (data.status) {
                toastr.info(
                  sprintf(
                    NOTIFY.get("SUCCESS_EMAIL_SEND"),
                    address
                  )
                );
                unaBase.log.save(
                  "Ha enviado " +
                  etiqueta_cotizacion +
                  " por email a " +
                  address,
                  "cotizaciones",
                  index
                );
              } else {
                toastr.error(
                  "No se ha podido enviar el email. No hay servidores de correo disponibles. Detalle: " +
                  data.error.code
                );
                console.log(data.error);
              }
            },
            error: function (data) {
              unaBase.ui.unblock();
              toastr.error(
                sprintf(NOTIFY.get("ERROR_INTERNAL"), address)
              );
            }
          });
        };
        var email =
          typeof $(
            '[name="cotizacion[empresa][contacto][email]"]'
          ).val() != "undefined"
            ? $(
              '[name="cotizacion[empresa][contacto][email]"]'
            ).val()
            : "";
        if (email != "") {
          sendCotizacionByEmail(email);
        } else {
          var htmlObject = $(
            '<section> \
            <span>Ingrese la dirección de email</span> \
            <form autocomplete="on" target="the_iframe" action="about:blank"> \
              <input style="border-bottom: 1px solid black;" required type="email" name="email"> \
            </form> \
            <iframe style="display: none;" id="the_iframe" name="the_iframe" src="about:blank"></iframe> \
          </section>'
          );
          htmlObject
            .find("input")
            .on("blur change", function () {
              htmlObject.data("response", $(this).val());
              htmlObject.find("form")[0].submit();
            });
          prompt(htmlObject).done(function (data) {
            if (data !== false) {
              htmlObject.find("form")[0].submit();
              sendCotizacionByEmail(data);
            }
          });
        }
      }
    });
  }



  if ($.inArray("share_oc_val", params.buttons) != -1) {
    buttons.push({
      name: "share_oc_val",
      icon: "ui-icon-extlink",
      caption: "Compartir",
      action: function () {



        var aliasfilesGastos = "";
        if (compras.tipoGasto == "FXR") {
          aliasfilesGastos = file_name_oficial_fxr;
        } else {
          aliasfilesGastos = file_name_oficial_oc;
        }
        var target = htmlObject;

        var sendOcByEmail = async function (address) {
          unaBase.ui.block();

          var sid = "";
          $.each($.cookie(), function (clave, valor) {
            if (clave == hash && valor.match(/UNABASE/g))
              sid = valor;
          });

          var index = $("#sheet-compras")
            .data("index")

          var text = $('input[name="oc[referencia]"]')
            .val()
            .capitalizeAllWords();
          var sender = $("html > body.home > aside > div > div > h1")
            .text()
            .capitalizeAllWords();
          var sendMsg = async function (
            document,
            index,
            text,
            senderName
          ) {
            var retval;
            $.ajax({
              url: "/v3/views/compras/email.shtml",
              dataType: "html",
              async: false,
              success: function (data) {
                retval = $("<div>").html(data);
              }
            });
            retval.find("[data-document]").html(document);
            retval.find("[data-index]").html(index);
            retval.find("[data-text]").html(text);
            retval.find("[data-sender-name]").html(senderName);
            return retval.html();
          };

          var documents = "";
          if (compras.tipoGasto == "FXR") {
            documents = "Rendición de fondos";
          } else {
            documents = "Orden de compra";
          }

          var msg = sendMsg(documents, index, text, sender);
          var attachments = [
            {
              cid: "logo.png",
              url:
                "https://" +
                window.location.hostname +
                "/v3/design/html/body.menu/nav/h1.png"
            },
            {
              cid: "empresa.jpg",
              url:
                "https://" +
                window.location.hostname +
                "/4DACTION/logo_empresa_web"
            }
          ];
          $.ajax({
            url:
              nodeUrl +
              "/send/",
            data: {
              download: true,
              entity: "compras",
              entitytwo: compras.tipoGasto,
              id: $.unserialize(params.data()).id,
              folio: index,
              document: documents,
              text: text,
              sid: sid,
              email: address,
              preview: false,
              nullified: params.data().readonly,
              sender: sender,
              msg: msg,
              attachments: JSON.stringify(attachments),
              from: $("html > body.menu.home > aside > div > div > h1").data(
                "email"
              ),
              username: $(
                "html > body.menu.home > aside > div > div > h1"
              ).data("username"),
              aliasfiles: aliasfilesGastos
            },
            type: "GET",
            dataType: "jsonp",
            success: function (data) {
              unaBase.ui.unblock();
              toastr.success(
                sprintf(NOTIFY.get("SUCCESS_EMAIL_SEND"), address)
              );
              // unaBase.log.save('Ha enviado por email el gasto', 'gastos', index);
              compras.saveLogsFromWeb({
                id: compras.id,
                folio: compras.folio,
                descripcion:
                  "Ha compartido el gasto vía email a la dirección: " +
                  address,
                modulo: "gastos",
                descripcion_larga: ""
              });
            },
            error: function (data) {
              unaBase.ui.unblock();
              toastr.error(NOTIFY.get("ERROR_INTERNAL"));
            }
          });
        };

        var emailProveedor = "";
        var emailRelacionado = "";
        var emailProveedor = $.trim(
          $("#sheet-compras")
            .find('input[name="contacto[info][email]"]')
            .val()
        );
        var emailRelacionado = $.trim(
          $("#sheet-compras")
            .find('input[name="relacionado[info][email]"]')
            .val()
        );

        var email = "";
        if (emailProveedor != "") {
          email = emailProveedor;
        } else {
          if (emailRelacionado != "" && email == "") {
            email = emailRelacionado;
          }
        }

        var labelContacto = "contacto";
        if (compras.tipoGasto == "FXR") {
          labelContacto = "solicitante";
        } else {
          labelContacto = "proveedor";
        }

        if (email != "") {
          emailProveedor = emailProveedor.toLowerCase();
          emailRelacionado = emailRelacionado.toLowerCase();

          sendOcByEmail(email);

        } else {
          var htmlObject = $(
            "<section> \
            <span>No existe email asociado al " +
            labelContacto +
            '. Por favor ingrese una dirección: </span> \
            <input required type="email" style="border-bottom:solid 1px!important;width:300px" name="email"> \
            <div style="margin:5px"><br><input type="checkbox" name="default"> Dejar email por defecto.</div> \
          </section>'
          );

          htmlObject
            .find('input[name="email"]')
            .on("blur change", function () {
              htmlObject.data("response", $(this).val());
              htmlObject
                .find("input")
                .css("background-color", "white");
            });

          prompt(htmlObject).done(function (data) {
            if (data !== false && data !== "") {
              sendOcByEmail(data);
              if (
                htmlObject
                  .find('input[name="default"]')
                  .prop("checked")
              ) {
                unaBase.contacto.set({
                  id: $("#sheet-compras")
                    .find('input[name="contacto[info][id]"]')
                    .val(),
                  email: htmlObject
                    .find('input[name="email"]')
                    .val(),
                  cliprov: "PROVEEDOR",
                  tipo: "PERSONA",
                  labelMsg: labelContacto
                });
                $("#sheet-compras")
                  .find('input[name="contacto[info][email]"]')
                  .val(
                    htmlObject.find('input[name="email"]').val()
                  );
              }
            }
          });
        }

      }


    });
  }
  if ($.inArray("template", params.buttons) != -1)
    buttons.push({
      name: "template",
      icon: "ui-icon-star",
      caption: "Usar como plantilla",
      action: function (event) {
        var success = false;
        if (params.validate()) {
          var htmlObject = $(
            '<section> \
              <span>Ingrese el nombre de la plantilla</span> \
              <input type="text" name="nombre"> \
            </section>'
          );

          htmlObject.find("input").change(function () {
            htmlObject.data("response", $(this).val());
          });

          prompt(htmlObject).done(function (data) {
            if (data !== false) {
              $.ajax({
                url: "/4DACTION/_V3_clone" + params.entity,
                type: "POST",
                dataType: "json",
                data: {
                  id: $("section.sheet").data("id"),
                  index: -1, // Index -1 especifica template
                  text: data
                },
                async: false // para poder hacer el save correctamente y esperar la respuesta
              }).done(function (data) {
                success = data.success;
                if (data.success) {
                  switch (params.entity) {
                    case "Cotizacion":
                      toastr.success(NOTIFY.get("SUCCESS_SAVE_TEMPLATE"));
                      $("#index").html("Plantilla");
                      break;
                    case "Negocios":
                      toastr.success(NOTIFY.get("SUCCESS_SAVE_TEMPLATE"));
                      break;
                  }
                } else toastr.error(NOTIFY.get("ERROR_RECORD_READONLY", "Error"));
              });
            }
          });
        } else toastr.error(NOTIFY.get("ERROR_DATA", "Faltan datos"));
        return { success: success };
      }
    });

  /* BEGIN: exportar en Excel */


  if ($.inArray("export_accounting_plan", params.buttons) != -1)
    buttons.push({
      name: "export_accounting_plan",
      icon: "ui-icon-calculator",
      caption: "Exportar plan de cuentas",
      action: function () {
        var sid = "";
        $.each($.cookie(), function (clave, valor) {
          if (clave == hash && valor.match(/UNABASE/g)) sid = valor;
        });


        var url =
          nodeUrl +
          "/export-accounting-plan/?download=true" +
          "&sid=" +
          unaBase.sid.encoded() +
          "&preview=false" +
          "page=1&records=TODOS" +
          "&hostname=" +
          window.location.origin;




        var download = window.open(url).blur();
        window.focus();
        try {
          download.close();
        } catch (err) {
          console.log(err);
        }
      }
    });

  if ($.inArray("export", params.buttons) != -1)
    buttons.push({
      name: "export",
      icon: "ui-icon-calculator",
      caption: "Exportar resumen",
      action: function () {
        var sid = "";
        $.each($.cookie(), function (clave, valor) {
          if (clave == hash && valor.match(/UNABASE/g)) sid = valor;
        });
        var modulo = $("html > body.menu.home > aside > div > div > ul > li.active")
          .data("name")
          .toUpperCase();

        if (modulo == "COTIZACIONES") {
          var url =
            nodeUrl +
            "/export-cotizacion/?download=true&entity=cotizaciones&id=" +
            $("section.sheet").data("id") +
            "&folio=" +
            ($("section.sheet").data("index") > 0
              ? $("section.sheet").data("index")
              : "S/N") +
            "&sid=" +
            unaBase.sid.encoded() +
            "&preview=false&nullified=" +
            $("section.sheet").data("readonly") +
            "&hostname=" +
            window.location.origin;
          unaBase.log.save(
            "Ha exportado " + etiqueta_cotizacion,
            "cotizaciones",
            $("#main-container").data("index")
          );
        }
        if (modulo == "NEGOCIOS") {
          var url =
            nodeUrl +
            "/export-negocio/?download=true&entity=cotizaciones&id=" +
            $("section.sheet").data("id") +
            "&folio=" +
            ($("#main-container").data("index") > 0
              ? $("#main-container").data("index")
              : "S/N") +
            "&sid=" +
            unaBase.sid.encoded() +
            "&preview=false&nullified=" +
            $("section.sheet").data("readonly") +
            "&hostname=" +
            window.location.origin +
            "&presupuestos=false";
          unaBase.log.save(
            "Ha exportado " + etiqueta_negocio,
            "negocios",
            $("#main-container").data("index")
          );
        }

        if (modulo == "PRESUPUESTOS") {
          var url =
            nodeUrl +
            "/export-negocio/?download=true&entity=cotizaciones&id=" +
            $("section.sheet").data("id") +
            "&folio=" +
            ($("#main-container").data("index") > 0
              ? $("#main-container").data("index")
              : "S/N") +
            "&sid=" +
            unaBase.sid.encoded() +
            "&preview=false&nullified=" +
            $("section.sheet").data("readonly") +
            "&hostname=" +
            window.location.origin +
            "&presupuestos=true";
          unaBase.log.save(
            "Ha exportado presupuesto",
            "presupuestos",
            $("#main-container").data("index")
          );
        }

        if (modulo == "CategoriasReporte") {
          var url =
            nodeUrl +
            "/export-reporte/?download=true&entity=cotizaciones&id=" +
            $("section.sheet").data("id") +
            "&sid=" +
            unaBase.sid.encoded() +
            "&preview=false&nullified=" +
            $("section.sheet").data("readonly") +
            "&hostname=" +
            "&hostname=" +
            window.location.origin;
          unaBase.log.save(
            "Ha exportado " + etiqueta_negocio,
            "negocios",
            $("#container-reportes").data("categoria")
          );
        }
        var download = window.open(url).blur();
        window.focus();
        try {
          download.close();
        } catch (err) {
          console.log(err);
        }
      }
    });


  // if ($.inArray("export_resumen_list_neg", params.buttons) != -1) {
  //   buttons.push({
  //     name: "export-resumen",
  //     icon: "ui-icon-calculator",
  //     caption: "Exportar resumen",
  //     action: function () {
  //       var sid = "";
  //       $.each($.cookie(), function (clave, valor) {
  //         if (clave == hash && valor.match(/UNABASE/g)) sid = valor;
  //       });
  //       var modulo = $("html > body.menu.home > aside > div > div > ul > li.active")
  //         .data("name")
  //         .toUpperCase();

  //       const id_neg = $('table tbody td input:checked').data('id')
  //       const folio = $('table tbody td input:checked').data('folio')

  //       if (modulo == "NEGOCIOS") {
  //         var url =
  //           nodeUrl +
  //           "/export-negocio/?download=true&entity=cotizaciones&id=" +
  //           id_neg +
  //           "&folio=" +
  //           folio +
  //           "&sid=" +
  //           unaBase.sid.encoded() +
  //           "&preview=false&nullified=" +
  //           $("section.sheet").data("readonly") +
  //           "&hostname=" +
  //           window.location.origin +
  //           "&presupuestos=false";
  //         unaBase.log.save(
  //           "Ha exportado " + etiqueta_negocio,
  //           "negocios",
  //           $("#main-container").data("index")
  //         );
  //       }


  //       var download = window.open(url).blur();
  //       window.focus();
  //       try {
  //         download.close();
  //       } catch (err) {
  //         console.log(err);
  //       }
  //     }
  //   });


  // }
  if ($.inArray("export_resumen_list_neg", params.buttons) != -1) {
    buttons.push({
      name: "export-resumen",
      icon: "ui-icon-calculator",
      caption: "Exportar resumen",
      action: function () {
        var sid = "";
        $.each($.cookie(), function (clave, valor) {
          if (clave == hash && valor.match(/UNABASE/g)) sid = valor;
        });
        var modulo = $("html > body.menu.home > aside > div > div > ul > li.active")
          .data("name")
          .toUpperCase();

        const id_neg = $('table tbody td input:checked').data('id');
        const folio = $('table tbody td input:checked').data('folio');

        let url = '';

        if (modulo == "NEGOCIOS") {
          url = `${nodeUrl}/export-negocio/?download=true&entity=cotizaciones&id=${id_neg}&folio=${folio}&sid=${unaBase.sid.encoded()}&preview=false&nullified=${$("section.sheet").data("readonly")}&hostname=${window.location.origin}&presupuestos=false`;
          unaBase.log.save(
            "Ha exportado " + etiqueta_negocio,
            "negocios",
            $("#main-container").data("index")
          );
        }

        if (url) {
          try {
            toggleUniqueAlert('Generando reporte...')
            fetch(url)
              .then(response => {
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
                return response.blob();
              })
              .then(blob => {
                const downloadUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = downloadUrl;
                a.download = `Resumen_${folio}.xlsx`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(downloadUrl);

                toggleUniqueAlert()
              })
              .catch(error => {
                console.log('Error en la solicitud', error);
                toastr.error('Ha ocurrido un error interno. Por favor comunicarse con soporte.');
              });
          } catch (err) {
            console.log(err);
            toastr.error('Ha ocurrido un error interno. Por favor comunicarse con soporte.');
          }
        }
      }
    });
  }

  if ($.inArray("export_costreport_list_neg", params.buttons) != -1) {
    buttons.push({
      name: "export-cost-report",
      icon: "ui-icon-calculator",
      caption: "Cost report amazon",
      action: function () {
        var modulo = $("html > body.menu.home > aside > div > div > ul > li.active")
          .data("name")
          .toUpperCase();

        const entityId = $('table tbody td input:checked').data('id');
        const folioIndex = $('table tbody td input:checked').data('folio');
        const encodedSid = unaBase.sid.encoded();
        let url = '';

        // Obtener la fecha actual y el primer y último día del mes actual
        const currentDate = new Date();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const year = currentDate.getFullYear();

        const firstDay = `${year}-${month}-01`;
        const lastDay = new Date(year, currentDate.getMonth() + 1, 0);
        const lastDayFormatted = `${year}-${month}-${String(lastDay.getDate()).padStart(2, '0')}`;

        if (modulo === "NEGOCIOS") {
          // Crear y mostrar el modal con el formulario de fechas
          showCostReportModal(entityId, folioIndex, encodedSid);
        }
      }
    });
  }

  // Función para mostrar el modal del reporte de costos
  function showCostReportModal(entityId, folioIndex, encodedSid) {
    // Crear el HTML del modal
    const modalHTML = `
      <div id="costReportModal" class="cost-report-modal" style="display: none;">
        <div class="cost-report-overlay"></div>
        <div class="cost-report-content">
          <div class="cost-report-card">
            <h1>CostReport</h1>
            <div class="cost-report-subtitle">Selecciona el rango de fechas para generar el Excel.</div>
            
            <form id="costReportForm" novalidate>
              <div class="cost-report-row">
                <div class="cost-report-col">
                  <label for="dateFrom">Desde</label>
                  <div class="date-input-wrapper">
                    <input type="text" id="dateFrom" name="dateFrom" placeholder="dd/mm/aaaa" readonly required />
                    <span class="date-icon">📅</span>
                  </div>
                  <div class="cost-report-error" id="errFrom">Debes indicar una fecha de inicio.</div>
                </div>
                <div class="cost-report-col">
                  <label for="dateTo">Hasta</label>
                  <div class="date-input-wrapper">
                    <input type="text" id="dateTo" name="dateTo" placeholder="dd/mm/aaaa" readonly required />
                    <span class="date-icon">📅</span>
                  </div>
                  <div class="cost-report-error" id="errTo">Debes indicar una fecha de término.</div>
                </div>
              </div>
              
              <div class="cost-report-error" id="errRange" style="margin-top:10px">La fecha de inicio no puede ser mayor que la fecha de término.</div>
              
              <div class="cost-report-actions">
                <button type="button" class="cost-report-btn cost-report-btn--ghost" id="cancelBtn">Cancelar</button>
                <button type="button" class="cost-report-btn cost-report-btn--brand" id="excelBtn" disabled>Descargar Excel</button>
              </div>
              <div class="cost-report-footer-note">Se abrirá en una nueva pestaña.</div>
            </form>
          </div>
        </div>
      </div>
    `;

    // Agregar el modal al body si no existe
    if ($('#costReportModal').length === 0) {
      $('body').append(modalHTML);
    }

    // Agregar los estilos CSS si no existen
    if (!$('#costReportStyles').length) {
      const styles = `
        <style id="costReportStyles">
          .cost-report-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .cost-report-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
          }
          
          .cost-report-content {
            position: relative;
            z-index: 1;
            width: 100%;
            max-width: 720px;
            margin: 20px;
          }
          
          .cost-report-card {
            background: #ffffff;
            border-radius: 12px;
            padding: 22px 22px 16px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            border: 1px solid #e5e7eb;
          }
          
          .cost-report-card h1 {
            font-size: 20px;
            margin: 0 0 6px;
            letter-spacing: .3px;
            color: #1f2937;
          }
          
          .cost-report-subtitle {
            color: #6b7280;
            font-size: 13px;
            margin-bottom: 18px;
          }
          
          .cost-report-row {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
          }
          
          .cost-report-col {
            flex: 1 1 220px;
          }
          
          .cost-report-card label {
            display: block;
            font-size: 12px;
            color: #374151;
            margin: 8px 0 6px;
            font-weight: 500;
          }
          
          .date-input-wrapper {
            position: relative;
            width: 100%;
          }
          
          .cost-report-card input[type="text"] {
            width: 100%;
            border: 1px solid #d1d5db;
            border-radius: 12px;
            padding: 12px 14px;
            padding-right: 40px;
            outline: none;
            transition: border .2s, box-shadow .2s;
            background: #ffffff;
            color: #1f2937;
            cursor: pointer;
          }
          
          .cost-report-card input[type="text"]:focus {
            border-color: #2DAC90;
            box-shadow: 0 0 0 6px rgba(45, 172, 144, 0.2);
          }
          
          .date-icon {
            position: absolute;
            right: 14px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 16px;
            pointer-events: none;
            color: #6b7280;
          }
          
          .cost-report-error {
            font-size: 12px;
            color: #ef4444;
            margin-top: 6px;
            display: none;
          }
          
          .cost-report-actions {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 16px;
          }
          
          .cost-report-btn {
            appearance: none;
            border: 1px solid #d1d5db;
            background: #f9fafb;
            color: #374151;
            padding: 10px 14px;
            border-radius: 12px;
            cursor: pointer;
            font-weight: 600;
            transition: transform .06s ease, background .2s, border-color .2s, opacity .2s;
          }
          
          .cost-report-btn:active {
            transform: translateY(1px);
          }
          
          .cost-report-btn[disabled] {
            opacity: .5;
            cursor: not-allowed;
          }
          
          .cost-report-btn--ghost:hover {
            background: #f3f4f6;
          }
          
          .cost-report-btn--brand {
            background: #2DAC90;
            border-color: transparent;
            color: white;
          }
          
          .cost-report-btn--brand:hover {
            background: #239377;
          }
          
          .cost-report-footer-note {
            margin-top: 8px;
            color: #6b7280;
            font-size: 11px;
            text-align: right;
          }
          
          /* Estilos del datepicker personalizado */
          .custom-datepicker {
            position: fixed;
            background: white;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            padding: 16px;
            min-width: 280px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          
          .custom-datepicker-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
          }
          
          .custom-datepicker-title {
            font-weight: 600;
            color: #1f2937;
            font-size: 14px;
          }
          
          .custom-datepicker-nav {
            display: flex;
            gap: 8px;
          }
          
          .custom-datepicker-nav-btn {
            background: none;
            border: none;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 4px;
            color: #6b7280;
            font-size: 16px;
            line-height: 1;
          }
          
          .custom-datepicker-nav-btn:hover {
            background: #f3f4f6;
            color: #374151;
          }
          
          .custom-datepicker-weekdays {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 4px;
            margin-bottom: 8px;
          }
          
          .custom-datepicker-weekday {
            text-align: center;
            font-size: 12px;
            font-weight: 500;
            color: #6b7280;
            padding: 8px 4px;
          }
          
          .custom-datepicker-days {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 4px;
          }
          
          .custom-datepicker-day {
            text-align: center;
            padding: 8px 4px;
            cursor: pointer;
            border-radius: 4px;
            font-size: 14px;
            color: #374151;
            transition: background-color 0.2s;
          }
          
          .custom-datepicker-day:hover {
            background: #f3f4f6;
          }
          
          .custom-datepicker-day.selected {
            background: #2DAC90;
            color: white;
          }
          
          .custom-datepicker-day.other-month {
            color: #d1d5db;
          }
          
          .custom-datepicker-day.today {
            background: #fef3c7;
            color: #92400e;
            font-weight: 600;
          }
          
          .custom-datepicker-actions {
            display: flex;
            justify-content: space-between;
            margin-top: 16px;
            padding-top: 16px;
            border-top: 1px solid #e5e7eb;
          }
          
          .custom-datepicker-btn {
            background: #f3f4f6;
            border: 1px solid #d1d5db;
            color: #374151;
            padding: 6px 12px;
            border-radius: 6px;
            color: #374151;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
          }
          
          .custom-datepicker-btn:hover {
            background: #e5e7eb;
          }
          
          .custom-datepicker-btn.primary {
            background: #2DAC90;
            border-color: #2DAC90;
            color: white;
          }
          
          .custom-datepicker-btn.primary:hover {
            background: #239377;
          }
          
          .datepicker-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.3);
            z-index: 9999;
          }
        </style>
      `;
      $('head').append(styles);
    }

    // Mostrar el modal
    $('#costReportModal').show();

    // Inicializar fechas
    initCostReportDates();

    // Event listeners
    $('#dateFrom, #dateTo').on('click', function () {
      console.log('Click en campo de fecha:', $(this).attr('id'));
      showDatePicker($(this));
    });

    $('#excelBtn').on('click', function () {
      triggerCostReportDownload(entityId, folioIndex, encodedSid);
    });
    $('#cancelBtn').on('click', function () {
      $('#costReportModal').hide();
    });

    // Cerrar modal al hacer clic en el overlay
    $('.cost-report-overlay').on('click', function () {
      $('#costReportModal').hide();
    });
  }

  // Variables globales para el datepicker
  let datepickerCurrentMonth = 0;
  let datepickerCurrentYear = 2024;
  let datepickerSelectedDate = new Date();

  // Función para inicializar fechas
  function initCostReportDates() {
    const today = new Date();
    const defaultFrom = '01/01/2024';
    const defaultTo = formatLocalDMY(today);

    $('#dateFrom').val(defaultFrom);
    $('#dateTo').val(defaultTo);

    validateCostReport();
  }

  // Función para formatear fecha en formato dd/mm/aaaa
  function formatLocalDMY(d) {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const result = `${day}/${month}/${year}`;
    console.log('formatLocalDMY - Input:', d, 'Output:', result);
    return result;
  }

  // Función para convertir formato dd/mm/aaaa a yyyy-mm-dd
  function formatToYMD(dateString) {
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const day = parts[0];
      const month = parts[1];
      const year = parts[2];
      return `${year}-${month}-${day}`;
    }
    return dateString;
  }

  // Función para validar formulario
  function validateCostReport() {
    let ok = true;
    const dateFrom = $('#dateFrom').val();
    const dateTo = $('#dateTo').val();

    $('#errFrom').toggle(!dateFrom);
    $('#errTo').toggle(!dateTo);

    if (!dateFrom || !dateTo) {
      ok = false;
    } else if (dateFrom > dateTo) {
      $('#errRange').show();
      ok = false;
    } else {
      $('#errRange').hide();
    }

    $('#excelBtn').prop('disabled', !ok);
    return ok;
  }

  // Función para descargar el reporte
  function triggerCostReportDownload(entityId, folioIndex, encodedSid) {
    if (!validateCostReport()) return;

    const from = formatToYMD($('#dateFrom').val());
    const to = formatToYMD($('#dateTo').val());

    // Construir URL
    let url = `${nodeUrl}/export-cost-report-custom/?download=true&entity=cotizaciones&id=${entityId}&folio=${folioIndex}&sid=${encodedSid}&preview=false&from=${from}&to=${to}&company=${companyName}`;
    url += `&hostname=${window.location.origin}`;

    if (url) {
      try {
        const download = window.open(url, '_blank');
        if (download) {
          download.blur();
          window.focus();
        }
        // Cerrar el modal después de iniciar la descarga
        $('#costReportModal').hide();
      } catch (err) {
        console.log(err);
      }
    }
  }

  // Función para renderizar el calendario
  function renderCalendar() {
    const firstDay = new Date(datepickerCurrentYear, datepickerCurrentMonth, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const weekdays = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

    let calendarHTML = `
      <div class="custom-datepicker">
        <div class="custom-datepicker-header">
          <div class="custom-datepicker-title">${monthNames[datepickerCurrentMonth]} ${datepickerCurrentYear}</div>
          <div class="custom-datepicker-nav">
            <button type="button" class="custom-datepicker-nav-btn prev-month">‹</button>
            <button type="button" class="custom-datepicker-nav-btn next-month">›</button>
          </div>
        </div>
        <div class="custom-datepicker-weekdays">
          ${weekdays.map(day => `<div class="custom-datepicker-weekday">${day}</div>`).join('')}
        </div>
        <div class="custom-datepicker-days">
    `;

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const isCurrentMonth = date.getMonth() === datepickerCurrentMonth;
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = date.toDateString() === datepickerSelectedDate.toDateString();

      let classes = 'custom-datepicker-day';
      if (!isCurrentMonth) classes += ' other-month';
      if (isToday) classes += ' today';
      if (isSelected) classes += ' selected';

      // Crear fecha en formato YYYY-MM-DD sin problemas de zona horaria
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;

      calendarHTML += `<div class="${classes}" data-date="${dateString}">${date.getDate()}</div>`;
    }

    calendarHTML += `
        </div>
        <div class="custom-datepicker-actions">
          <button type="button" class="custom-datepicker-btn clear-date">Borrar</button>
          <button type="button" class="custom-datepicker-btn primary today-date">Hoy</button>
        </div>
      </div>
    `;

    return calendarHTML;
  }

  // Función para mostrar el datepicker personalizado
  function showDatePicker(input) {
    console.log('showDatePicker ejecutándose para:', input.attr('id'));
    // Remover datepicker existente
    $('.custom-datepicker').remove();

    const currentDate = new Date();
    let selectedDate = new Date();

    // Si el input tiene un valor, parsearlo
    const inputValue = input.val();
    if (inputValue) {
      const parts = inputValue.split('/');
      if (parts.length === 3) {
        selectedDate = new Date(parts[2], parts[1] - 1, parts[0]);
      }
    }

    // Inicializar las variables globales
    datepickerCurrentMonth = selectedDate.getMonth();
    datepickerCurrentYear = selectedDate.getFullYear();
    datepickerSelectedDate = selectedDate;

    // Crear overlay y datepicker
    const overlay = $('<div class="datepicker-overlay"></div>');
    const datepicker = $(renderCalendar());

    console.log('Datepicker HTML creado:', datepicker[0].outerHTML);

    $('body').append(overlay);
    $('body').append(datepicker);

    // Posicionar el datepicker en el centro de la pantalla
    datepicker.css({
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    });

    // Aplicar event listeners al datepicker
    applyDatepickerEvents(datepicker, input, overlay);

    // Cerrar datepicker al hacer clic fuera
    $(document).on('click.datepicker', function (e) {
      if (!$(e.target).closest('.custom-datepicker, .date-input-wrapper').length) {
        $('.custom-datepicker').remove();
        $('.datepicker-overlay').remove();
        $(document).off('click.datepicker');
      }
    });

    // Cerrar datepicker al hacer clic en el overlay
    overlay.on('click', function () {
      datepicker.remove();
      overlay.remove();
    });
  }

  // Función para aplicar event listeners al datepicker
  function applyDatepickerEvents(datepicker, input, overlay) {
    // Event listener para seleccionar fecha
    datepicker.on('click', '.custom-datepicker-day', function () {
      const dateString = $(this).data('date');
      console.log('Fecha seleccionada del data-date:', dateString);

      // Crear la fecha directamente en zona horaria local
      const [year, month, day] = dateString.split('-').map(Number);

      // Crear fecha en zona horaria local para evitar conversiones
      const date = new Date(year, month - 1, day, 12, 0, 0, 0);

      console.log('Fecha creada en zona local:', date);
      console.log('Fecha formateada:', formatLocalDMY(date));

      datepickerSelectedDate = date;
      input.val(formatLocalDMY(date));
      datepicker.remove();
      overlay.remove();
      validateCostReport();
    });

    // Event listener para limpiar fecha
    datepicker.on('click', '.clear-date', function () {
      input.val('');
      datepicker.remove();
      overlay.remove();
      validateCostReport();
    });

    // Event listener para fecha de hoy
    datepicker.on('click', '.today-date', function () {
      datepickerSelectedDate = new Date();
      input.val(formatLocalDMY(datepickerSelectedDate));
      datepicker.remove();
      overlay.remove();
      validateCostReport();
    });

    // Event listeners para navegación entre meses
    datepicker.on('click', '.prev-month', function () {
      console.log('Navegando al mes anterior desde applyDatepickerEvents');
      datepickerCurrentMonth--;
      if (datepickerCurrentMonth < 0) {
        datepickerCurrentMonth = 11;
        datepickerCurrentYear--;
      }
      console.log('Nuevo mes:', datepickerCurrentMonth + 1, 'Nuevo año:', datepickerCurrentYear);

      // Recrear el datepicker con el nuevo mes
      const newDatepicker = $(renderCalendar());
      datepicker.replaceWith(newDatepicker);

      // Recrear el overlay si es necesario
      if (overlay.length === 0) {
        const newOverlay = $('<div class="datepicker-overlay"></div>');
        $('body').append(newOverlay);
      }

      // Reaplicar estilos y event listeners al nuevo datepicker
      newDatepicker.css({
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      });

      // Reaplicar event listeners
      applyDatepickerEvents(newDatepicker, input, overlay);
    });

    datepicker.on('click', '.next-month', function () {
      console.log('Navegando al mes siguiente desde applyDatepickerEvents');
      datepickerCurrentMonth++;
      if (datepickerCurrentMonth > 11) {
        datepickerCurrentMonth = 0;
        datepickerCurrentYear++;
      }
      console.log('Nuevo mes:', datepickerCurrentMonth + 1, 'Nuevo año:', datepickerCurrentYear);

      // Recrear el datepicker con el nuevo mes
      const newDatepicker = $(renderCalendar());
      datepicker.replaceWith(newDatepicker);

      // Recrear el overlay si es necesario
      if (overlay.length === 0) {
        const newOverlay = $('<div class="datepicker-overlay"></div>');
        $('body').append(newOverlay);
      }

      // Reaplicar estilos y event listeners al nuevo datepicker
      newDatepicker.css({
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      });

      // Reaplicar event listeners
      applyDatepickerEvents(newDatepicker, input, overlay);
    });
  }


  if ($.inArray("export_costreport_consolidated", params.buttons) != -1) {
    buttons.push({
      name: "export-cost-report-consolidated",
      icon: "ui-icon-calculator",
      caption: "Cost report consolidado",
      action: function () {
        var modulo = $("html > body.menu.home > aside > div > div > ul > li.active").data("name").toUpperCase();

        // Obtener todas las IDs seleccionadas y guardarlas en un array
        const selectedIds = $('table tbody td input:checked').map(function () {
          return $(this).data('id');
        }).get();

        // Obtener el primer ID y folioIndex para la URL (suponiendo que usemos el primero seleccionado)
        const entityId = selectedIds[0];
        const folioIndex = $('table tbody td input:checked').first().data('folio');
        const encodedSid = unaBase.sid.encoded();
        let url = '';

        // Obtener la fecha actual y el primer y último día del mes actual
        const currentDate = new Date();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const year = currentDate.getFullYear();
        const firstDay = `${year}-${month}-01`;
        const lastDay = new Date(year, currentDate.getMonth() + 1, 0);
        const lastDayFormatted = `${year}-${month}-${String(lastDay.getDate()).padStart(2, '0')}`;

        if (modulo === "NEGOCIOS") {
          // Convertir el array de IDs a un string separado por comas
          const idsString = selectedIds.join(',');
          url = `${nodeUrl}/export-cost-report-consolidated/?download=true&entity=cotizaciones&id=${idsString}&folio=${folioIndex}&sid=${encodedSid}&preview=false&from=${firstDay}&to=${lastDayFormatted}&company=${companyName}`;
          url += `&hostname=${window.location.origin}`;
        }

        if (url) {
          try {
            const download = window.open(url).blur();
            window.focus();
            download.close();
          } catch (err) {
            console.log(err);
          }
        }
      }
    });

  }







  /* BEGIN: informe resumen */
  if ($.inArray("report", params.buttons) != -1)
    buttons.push({
      name: "report",
      icon: "ui-icon-document-b",
      caption: "Informe resumen",
      action: function () {
        var sid = "";
        $.each($.cookie(), function (clave, valor) {
          if (clave == hash && valor.match(/UNABASE/g)) sid = valor;
        });
        var modulo = $("html > body.menu.home > aside > div > div > ul > li.active")
          .data("name")
          .toUpperCase();

        if (modulo == "NEGOCIOS") {
          var url =
            nodeUrl +
            "/download/?download=true&entity=report&id=" +
            params.data().id +
            "&folio=" +
            (typeof $("section.sheet").data("index") != "undefined"
              ? $("section.sheet").data("index")
              : "S/N") +
            "&sid=" +
            unaBase.sid.encoded() +
            "&preview=false&nullified=" +
            params.data().readonly +
            "&template=" +
            formato_impresion_cotizacion +
            "&aliasfiles=" +
            file_name_oficial_cot +
            "&hostname=" +
            window.location.origin;
          //unaBase.log.save('Ha exportado ' + etiqueta_negocio, 'negocios', $('#main-container').data('index'));
        }

        var download = window.open(url).blur();
        window.focus();
        try {
          download.close();
        } catch (err) {
          console.log(err);
        }
      }
    });

  /* BEGIN: exportar en Excel reportes */
  if ($.inArray("export_reporte", params.buttons) != -1)
    buttons.push({
      name: "export_reporte",
      icon: "ui-icon-calculator",
      caption: "Exportar reporte",
      action: function () {
        if ($("table.items.reportes tbody > *").length) {

          var reporte = params.entity;
          var url = "";

          //--ini-- agreago para enviar datos de las areas en los filtros, 28-11-18, gin
          if (reporte == "VentasClienteReporte") {
            var filters = "";
            var searchFields = $.param(
              unaBase.toolbox.search.advancedFilter
            );
            var area_negocio = $.unserialize(searchFields).area_negocio;

            var serialFields = $("#search").serializeAnything();
            if (
              area_negocio != "" &&
              typeof area_negocio != "undefined"
            ) {
              filters = serialFields + "&area_negocio=" + area_negocio;
            } else {
              filters = serialFields;
            }
          } else {
            var filters = $("#search").serializeAnything(true);
            //var filters = $.param(unaBase.toolbox.search.advancedFilter);
          }
          //--ini-- agreago para enviar datos de las areas en los filtros, 28-11-18, gin

          url =
            nodeUrl +
            "/export-reporte-excel/?download=true&sid=" +
            unaBase.sid.encoded() +
            "&entity=" +
            reporte +
            "&" +
            filters +
            "&hostname=" +
            window.location.origin;
          var download = window.open(url).blur();
          window.focus();
          try {
            download.close();
          } catch (err) {
            console.log(err);
          }
        } else {
          toastr.warning("No hay datos para exportar.");
        }
      }
    });


  if ($.inArray("export_list_items_OP", params.buttons) != -1)
    buttons.push({
      name: "export_reporte",
      icon: "ui-icon-calculator",
      caption: "Exportar listado por pago",
      action: function () {

        var sid = "";
        $.each($.cookie(), function (clave, valor) {
          if (clave == hash && valor.match(/UNABASE/g)) sid = valor;
        });

        var modulo = $("html > body.menu.home > aside > div > div > ul > li.active")
          .data("name")
          .toUpperCase();
        var url = "";
        var filters = unaBase.utilities.getFilter("#search", true);
        filters += '&'

        filters += $("#search").serializeAnything(true);

        // --ini-- corrección para enviar parametro de orden a nodejs y exportar segun orden lista
        var sortParams = {};
        $("#viewport")
          .find("table.results > thead > tr > th")
          .each(function () {
            if (typeof $(this).data("sort-order") != "undefined") {
              sortParams = {
                sort_by: $(this).data("sort-by"),
                sort_order: $(this).data("sort-order")
              };
              return false;
            }
          });
        filters += "&" + jQuery.param(sortParams);

        url =
          nodeUrl +
          "/export-list-items-op/?download=true&sid=" +
          unaBase.sid.encoded() +
          "&entity=" +
          params.entity +
          "&" +
          filters +
          "&hostname=" +
          window.location.origin;
        var download = window.open(url).blur();
        window.focus();
        try {
          download.close();
          unaBase.log.save(
            "Ha exportado el listado de orden de compra por egreso",
            "gastos"
          );
        } catch (err) {
          console.log(err);
        }

      }
    });

  if ($.inArray("export_compras_pe", params.buttons) != -1)
    buttons.push({
      name: "export_compras_pe",
      icon: "ui-icon-calculator",
      caption: "Exportar registro de compras",
      action: function () {
        var sid = "";
        $.each($.cookie(), function (clave, valor) {
          if (clave == hash && valor.match(/UNABASE/g)) sid = valor;
        });
        var modulo = $("html > body.menu.home > aside > div > div > ul > li.active")
          .data("name")
          .toUpperCase();
        var url = "";
        var filters = unaBase.utilities.getFilter("#search", true);
        filters += '&'

        filters += $("#search").serializeAnything(true);

        // --ini-- corrección para enviar parametro de orden a nodejs y exportar segun orden lista
        var sortParams = {};
        $("#viewport")
          .find("table.results > thead > tr > th")
          .each(function () {
            if (typeof $(this).data("sort-order") != "undefined") {
              sortParams = {
                sort_by: $(this).data("sort-by"),
                sort_order: $(this).data("sort-order")
              };
              return false;
            }
          });
        filters += "&" + jQuery.param(sortParams);
        // --fin-- corrección para enviar parametro de orden a nodejs y exportar segun orden lista

        // elements blocked in the list
        var blockedElement = 0;

        url = `${nodeUrl}/export-registro-compras-pe/?download=true&sid=${unaBase.sid.encoded()}&${filters}&hostname=${window.location.origin}`;
        unaBase.log.save(
          `Ha exportado el listado de registro de compras`
        );
        if (!blockedElement) {
          var download = window.open(url);
          download.blur();
          window.focus();
        }

      }
    });

  /* BEGIN: exportar listado cotizaciones + negocios */
  if ($.inArray("export_ventas_pe", params.buttons) != -1)
    buttons.push({
      name: "export_ventas_pe",
      icon: "ui-icon-calculator",
      caption: "Exportar registro de ventas",
      action: function () {
        var sid = "";
        $.each($.cookie(), function (clave, valor) {
          if (clave == hash && valor.match(/UNABASE/g)) sid = valor;
        });
        var modulo = $("html > body.menu.home > aside > div > div > ul > li.active")
          .data("name")
          .toUpperCase();
        var url = "";
        var filters = unaBase.utilities.getFilter("#search", true);
        filters += '&'

        filters += $("#search").serializeAnything(true);

        // --ini-- corrección para enviar parametro de orden a nodejs y exportar segun orden lista
        var sortParams = {};
        $("#viewport")
          .find("table.results > thead > tr > th")
          .each(function () {
            if (typeof $(this).data("sort-order") != "undefined") {
              sortParams = {
                sort_by: $(this).data("sort-by"),
                sort_order: $(this).data("sort-order")
              };
              return false;
            }
          });
        filters += "&" + jQuery.param(sortParams);
        // --fin-- corrección para enviar parametro de orden a nodejs y exportar segun orden lista

        // elements blocked in the list
        var blockedElement = 0;

        url = `${nodeUrl}/export-registro-ventas-pe/?download=true&sid=${unaBase.sid.encoded()}&${filters}&hostname=${window.location.origin}`;
        unaBase.log.save(
          `Ha exportado el listado de registro de ventas`
        );
        if (!blockedElement) {
          var download = window.open(url);
          download.blur();
          window.focus();
        }

      }
    });

  /* BEGIN: exportar listado cotizaciones + negocios */
  if ($.inArray("export_list_cot_consolidadoPE", params.buttons) != -1)
    buttons.push({
      name: "export_list_cot_consolidadoPE",
      icon: "ui-icon-calculator",
      caption: "Exportar a excel (consolidado)",
      action: function () {
        var sid = "";
        $.each($.cookie(), function (clave, valor) {
          if (clave == hash && valor.match(/UNABASE/g)) sid = valor;
        });
        var modulo = $("html > body.menu.home > aside > div > div > ul > li.active")
          .data("name")
          .toUpperCase();
        var url = "";
        var filters = unaBase.utilities.getFilter("#search", true);
        filters += '&'

        filters += $("#search").serializeAnything(true);

        // --ini-- corrección para enviar parametro de orden a nodejs y exportar segun orden lista
        var sortParams = {};
        $("#viewport")
          .find("table.results > thead > tr > th")
          .each(function () {
            if (typeof $(this).data("sort-order") != "undefined") {
              sortParams = {
                sort_by: $(this).data("sort-by"),
                sort_order: $(this).data("sort-order")
              };
              return false;
            }
          });
        filters += "&" + jQuery.param(sortParams);
        // --fin-- corrección para enviar parametro de orden a nodejs y exportar segun orden lista

        // elements blocked in the list
        var blockedElement = 0;

        url = `${nodeUrl}/export-list-cot-consolidado/?download=true&sid=${unaBase.sid.encoded()}&${filters}&hostname=${window.location.origin}`;
        unaBase.log.save(
          `Ha exportado el listado de cotizaciones + negocios (consolidados proyectos)`
        );
        if (!blockedElement) {
          var download = window.open(url);
          download.blur();
          window.focus();
        }

      }
    });

  /* BEGIN: exportar listado cotizaciones + negocios */

  if ($.inArray("export_matriz_permiso", params.buttons) != -1)
    buttons.push({
      name: "export_matriz_permiso",
      icon: "ui-icon-calculator",
      caption: "Exportar matriz permiso",
      action: function () {
        var sid = "";
        $.each($.cookie(), function (clave, valor) {
          if (clave == hash && valor.match(/UNABASE/g)) sid = valor;
        });

        var modulo = $("html > body.menu.home > aside > div > div > ul > li.active")
          .data("name")
          .toUpperCase();
        var url = "";

        var filters = unaBase.utilities.getFilter("#search", true);
        filters += '&'

        filters += $("#search").serializeAnything(true);

        // --ini-- corrección para enviar parametro de orden a nodejs y exportar segun orden lista
        var sortParams = {};
        $("#viewport")
          .find("table.results > thead > tr > th")
          .each(function () {
            if (typeof $(this).data("sort-order") != "undefined") {
              sortParams = {
                sort_by: $(this).data("sort-by"),
                sort_order: $(this).data("sort-order")
              };
              return false;
            }
          });
        filters += "&" + jQuery.param(sortParams);
        // --fin-- corrección para enviar parametro de orden a nodejs y exportar segun orden lista


        url = `${nodeUrl}/export-matriz-permisos/?download=true&sid=${unaBase.sid.encoded()}&${filters}&hostname=${window.location.origin}`;

        //unaBase.log.save( `Ha exportado matriz de permiso`);

        var download = window.open(url);
        download.blur();
        window.focus();

      }
    });

  /* BEGIN: exportar listado negocios en Excel */
  if ($.inArray("export_list", params.buttons) != -1) {
    buttons.push({
      name: "export",
      icon: "ui-icon-calculator",
      caption: "Exportar a excel",
      action: function () {

        var sid = "";
        $.each($.cookie(), function (clave, valor) {
          if (clave == hash && valor.match(/UNABASE/g)) sid = valor;
        });

        var modulo = $("html > body.menu.home > aside > div > div > ul > li.active")
          .data("name")
          .toUpperCase();
        var url = "";

        var filters = unaBase.utilities.getFilter("#search", true);
        filters += '&'

        filters += $("#search").serializeAnything(true);

        // --ini-- corrección para enviar parametro de orden a nodejs y exportar segun orden lista
        var sortParams = {};
        $("#viewport")
          .find("table.results > thead > tr > th")
          .each(function () {
            if (typeof $(this).data("sort-order") != "undefined") {
              sortParams = {
                sort_by: $(this).data("sort-by"),
                sort_order: $(this).data("sort-order")
              };
              return false;
            }
          });

        if (jQuery.param(sortParams) == 'object') {
          filters += "&" + jQuery.param(sortParams);
        }

        // --fin-- corrección para enviar parametro de orden a nodejs y exportar segun orden lista

        // elements blocked in the list
        var blockedElement = 0;

        switch (modulo) {
          case "NEGOCIOS":
            // url =
            //   "http://" +
            //   nodejs_public_ipaddr +
            //   ":" +
            //   nodejs_port +
            //   "/export-list-negocios/?download=true&sid=" +
            //   unaBase.sid.encoded() +
            //   "&" +
            //   filters +
            //   "&hostname=" +
            //   window.location.origin;
            url = `${nodeUrl}/export-list-negocios/?download=true&sid=${unaBase.sid.encoded()}&${filters}&hostname=${window.location.origin}`;
            // unaBase.log.save(
            //   "Ha exportado el listado de " + etiqueta_negocios,
            //   "negocios"
            // );
            unaBase.log.save(
              `Ha exportado el listado de ${etiqueta_negocios} negocios`
            );
            break;
          case "PRESUPUESTOS":
            url =
              nodeUrl +
              "/export-list-presupuestos/?download=true&sid=" +
              unaBase.sid.encoded() +
              "&" +
              filters +
              "&hostname=" +
              window.location.origin;
            unaBase.log.save(
              "Ha exportado el listado de presupuestos",
              "presupuestos"
            );
            break;
          case "CONTACTOS":
            url =
              nodeUrl +
              "/export-list-contactos/?download=true&sid=" +
              unaBase.sid.encoded() +
              "&" +
              filters +
              "&hostname=" +
              window.location.origin;
            unaBase.log.save(
              "Ha exportado el listado de contactos",
              "contactos"
            );
            break;
          case "GASTOS":
            var ids = [];
            if (
              !$('#viewport input[name="selected_all"]').is(":checked")
            ) {
              $(
                "#viewport tbody.ui-selectable tr[data-id] td:first-of-type input.selected:checked"
              ).each(function () {
                ids.push(
                  $(this)
                    .closest("tr")
                    .data("id")
                );
              });
            }
            url =
              nodeUrl +
              "/export-list-oc/?download=true&ids=" +
              ids.join("|") +
              "&tipo_gasto=OC&sid=" +
              unaBase.sid.encoded() +
              "&" +
              filters +
              "&hostname=" +
              window.location.origin;
            unaBase.log.save(
              "Ha exportado el listado de órdenes de compra",
              "gastos"
            );
            break;
          case "RENDICIONES":
            url =
              nodeUrl +
              "/export-list-fxr/?download=true&tipo_gasto=FXR&sid=" +
              unaBase.sid.encoded() +
              "&" +
              filters +
              "&hostname=" +
              window.location.origin;
            unaBase.log.save(
              "Ha exportado el listado de rendiciones",
              "rendiciones"
            );
            break;
          case "EGRESOS":
            url =
              nodeUrl +
              "/export-list-egresos/?download=true&sid=" +
              unaBase.sid.encoded() +
              "&" +
              filters +
              "&hostname=" +
              window.location.origin;
            unaBase.log.save(
              "Ha exportado el listado de egresos",
              "egresos"
            );
            break;
          case "INGRESOS":
            url =
              nodeUrl +
              "/export-list-ingresos/?download=true&sid=" +
              unaBase.sid.encoded() +
              "&" +
              filters +
              "&hostname=" +
              window.location.origin;
            unaBase.log.save(
              "Ha exportado el listado de ingresos",
              "ingresos"
            );
            break;
          case "COTIZACIONES":
            var trElement = $("tbody.ui-selectable tr");
            for (var i = 0; i < trElement.length; i++) {
              if (trElement[i].dataset.block == "true")
                blockedElement += 1;
            }
            if (blockedElement > 0) {
              alert(
                "Se ha bloqueado la exportación a excel mientras hayan cotizaciones siendo editadas."
              );
            } else {
              url =
                nodeUrl +
                "/export-list-cotizacion/?download=true&sid=" +
                unaBase.sid.encoded() +
                "&" +
                filters +
                "&hostname=" +
                window.location.origin;
              unaBase.log.save(
                "Ha exportado el listado de " + etiqueta_cotizacion,
                "cotizaciones"
              );
            }

            break;
          case "USUARIOS":
            url =
              nodeUrl +
              "/export-list-usuarios/?download=true&sid=" +
              unaBase.sid.encoded() +
              "&" +
              filters +
              "&hostname=" +
              window.location.origin;
            unaBase.log.save(
              "Ha exportado el listado de usuarios",
              "usuarios"
            );
            break;
          case "DTC":
            var ids = [];
            $(
              "#viewport tbody.ui-selectable tr[data-id] td:first-of-type input.selected:checked"
            ).each(function () {
              ids.push(
                $(this)
                  .closest("tr")
                  .data("id")
              );
            });
            url =
              nodeUrl +
              "/export-list-dtc/?ids=" +
              ids.join("|") +
              "&download=true&sid=" +
              unaBase.sid.encoded() +
              "&" +
              filters +
              "&hostname=" +
              window.location.origin;
            unaBase.log.save("Ha exportado el listado de dtc", "dtc");
            break;
          case "DTV":
            url =
              nodeUrl +
              "/export-list-dtv/?download=true&sid=" +
              unaBase.sid.encoded() +
              "&" +
              filters +
              "&hostname=" +
              window.location.origin;
            unaBase.log.save("Ha exportado el listado de dtv", "dtv");
            break;
          case "CATALOGO":
            url =
              nodeUrl +
              "/export-list-catalogo/?download=true&sid=" +
              unaBase.sid.encoded() +
              "&" +
              filters +
              "&hostname=" +
              window.location.origin;
            unaBase.log.save(
              "Ha exportado el listado de catálogo",
              "catalogo"
            );
            break;
          case "FACTORING":
            url =
              nodeUrl +
              "/export-list-factoring/?download=true&sid=" +
              unaBase.sid.encoded() +
              "&" +
              filters +
              "&hostname=" +
              window.location.origin +
              "&tipo_gasto=Factoring";
            unaBase.log.save(
              "Ha exportado el listado de factoring",
              "factoring"
            );
            break;
          case "BANCO":
            url =
              nodeUrl +
              "/export-list-banco/?download=true&sid=" +
              unaBase.sid.encoded() +
              "&" +
              filters +
              "&hostname=" +
              window.location.origin;
            unaBase.log.save(
              "Ha exportado el listado de movimientos bancarios",
              "banco"
            );
            break;
          case "REPORTES":
            url =
              nodeUrl +
              "/export-list-reporte-eresultado/?download=true&sid=" +
              unaBase.sid.encoded() +
              "&" +
              filters +
              "&hostname=" +
              window.location.origin;
            unaBase.log.save(
              "Ha exportado el reporte estado de resultados",
              "reportes"
            );
            break;
          case "COMPROBANTES":
            url =
              nodeUrl +
              "/export-comprobantes/?download=true&sid=" +
              unaBase.sid.encoded() +
              "&" +
              filters +
              "&hostname=" +
              window.location.origin;
            unaBase.log.save(
              "Ha exportado el reporte estado de resultados",
              "reportes"
            );
            break;
        }

        /*if (modulo == 'NEGOCIOS') {
          // Leer datos del filtro
          var filters = $('#search').serializeAnything(true);
  
          // Pasar filtros a NodeJS
          var url = 'http://' + nodejs_public_ipaddr + ':' + nodejs_port + '/export-list-negocios/?download=true&sid=' + unaBase.sid.encoded() + '&' + filters;
          unaBase.log.save('Ha exportado el listado de negocios');
        }*/
        if (!blockedElement) {

          var download = window.open(url);
          download.blur();
          window.focus();
        }
      }
    });
  }

  if ($.inArray("export_diot", params.buttons) != -1) {
    if (unaBase.parametros.export_diot) {
      buttons.push({
        name: "dtv_emitir_bsale",
        icon: "ui-icon-document",
        caption: "Exportar DIOT",
        action: function () {
          var sid = "";
          $.each($.cookie(), function (clave, valor) {
            if (clave == hash && valor.match(/UNABASE/g)) sid = valor;
          });

          var filters = unaBase.utilities.getFilter("#search", true);
          filters += '&'

          filters += $("#search").serializeAnything(true);


          // --ini-- corrección para enviar parametro de orden a nodejs y exportar segun orden lista
          var sortParams = {};
          $("#viewport")
            .find("table.results > thead > tr > th")
            .each(function () {
              if (typeof $(this).data("sort-order") != "undefined") {
                sortParams = {
                  sort_by: $(this).data("sort-by"),
                  sort_order: $(this).data("sort-order")
                };
                return false;
              }
            });

          if (jQuery.param(sortParams) == 'object') {
            filters += "&" + jQuery.param(sortParams);
          }
          let url =
            nodeUrl +
            "/get-reporte-diot/?download=true&sid=" +
            unaBase.sid.encoded() +
            "&" +
            filters +
            "&hostname=" +
            window.location.origin;
          unaBase.log.save(
            "Ha exportado el listado de egresos",
            "egresos"
          );


          //unaBase.log.save( `Ha exportado matriz de permiso`);

          var download = window.open(url);
          download.blur();
          window.focus();
        }

      });
    }
  }

  if ($.inArray("export_list_projection", params.buttons) != -1) {
    buttons.push({
      name: "export",
      icon: "ui-icon-calculator",
      caption: "Exportar con fecha de vencimiento",
      action: function () {

        var sid = "";
        $.each($.cookie(), function (clave, valor) {
          if (clave == hash && valor.match(/UNABASE/g)) sid = valor;
        });

        var modulo = $("html > body.menu.home > aside > div > div > ul > li.active")
          .data("name")
          .toUpperCase();
        var url = "";
        var filters = unaBase.utilities.getFilter("#search", true);
        filters += '&'

        filters += $("#search").serializeAnything(true);

        // --ini-- corrección para enviar parametro de orden a nodejs y exportar segun orden lista
        var sortParams = {};
        $("#viewport")
          .find("table.results > thead > tr > th")
          .each(function () {
            if (typeof $(this).data("sort-order") != "undefined") {
              sortParams = {
                sort_by: $(this).data("sort-by"),
                sort_order: $(this).data("sort-order")
              };
              return false;
            }
          });

        if (jQuery.param(sortParams) == 'object') {
          filters += "&" + jQuery.param(sortParams);
        }

        // --fin-- corrección para enviar parametro de orden a nodejs y exportar segun orden lista

        // elements blocked in the list
        var blockedElement = 0;

        switch (modulo) {
          case "GASTOS":
            var ids = [];
            if (
              !$('#viewport input[name="selected_all"]').is(":checked")
            ) {
              $(
                "#viewport tbody.ui-selectable tr[data-id] td:first-of-type input.selected:checked"
              ).each(function () {
                ids.push(
                  $(this)
                    .closest("tr")
                    .data("id")
                );
              });
            }
            url =
              nodeUrl +
              "/export-list-oc-projection/?download=true&ids=" +
              ids.join("|") +
              "&tipo_gasto=OC&sid=" +
              unaBase.sid.encoded() +
              "&" +
              filters +
              "&hostname=" +
              window.location.origin;
            unaBase.log.save(
              "Ha exportado el listado de órdenes de compra",
              "gastos"
            );
            break;
        }
        if (!blockedElement) {
          var download = window.open(url);
          download.blur();
          window.focus();
        }
      }
    });
  }

  /* BEGIN: importar (banco) */
  if ($.inArray("import_list", params.buttons) != -1)
    buttons.push({
      name: "import_list",
      icon: "ui-icon-calculator",
      caption: "Importar CSV",
      action: function () {
        var modulo = $("html > body.menu.home > aside > div > div > ul > li.active")
          .data("name")
          .toUpperCase();

        switch (modulo) {
          case "BANCO":
            unaBase.loadInto.dialog(
              "/v3/views/banco/import.shtml",
              "Importar cartola",
              "small"
            );
            break;
        }
      }
    });


  if ($.inArray("MovimientosBanco", params.buttons) != -1)
    buttons.push({
      name: "MovimientosBanco",
      icon: "ui-icon-calculator",
      caption: "Importar cartola desde excel",
      action: function () {
        unaBase.loadInto.dialog('/v3/views/banco/import.shtml', 'Importar banco', 'small');
      }
    });



  if ($.inArray("import_nv_xml", params.buttons) != -1)
    buttons.push({
      name: "import_nv_xml",
      icon: "ui-icon-calculator",
      caption: "Cargar por xml",
      action: function () {
        var modulo = $("html > body.menu.home > aside > div > div > ul > li.active")
          .data("name")
          .toUpperCase();


        unaBase.loadInto.dialog(
          "/v3/views/negocios/dialog/import_nv_xml.shtml",
          "Cargar por xml",
          "xm-medium"
        );

      }
    });



  if ($.inArray("update_nv_xml", params.buttons) != -1)
    buttons.push({
      name: "update_nv_xml",
      icon: "ui-icon-calculator",
      caption: "Modificar por xml",
      action: function () {
        var modulo = $("html > body.menu.home > aside > div > div > ul > li.active")
          .data("name")
          .toUpperCase();


        unaBase.loadInto.dialog(
          "/v3/views/negocios/dialog/update_nv_xml.shtml",
          "Modificar por xml",
          "xm-small"
        );

      }
    });

  /* BEGIN: export SAP */
  if ($.inArray("export_sap", params.buttons) != -1)
    buttons.push({
      name: "export_sap",
      icon: "ui-icon-calculator",
      caption: "Exportar a SAP",
      action: function () {
        var sid = "";
        $.each($.cookie(), function (clave, valor) {
          if (clave == hash && valor.match(/UNABASE/g)) sid = valor;
        });
        var modulo = $("html > body.menu.home > aside > div > div > ul > li.active")
          .data("name")
          .toUpperCase();
        var url = "";
        // var filters = $('#search').serializeAnything(true);
        var ids = [];
        var ids_contabilizado = [];
        var ids_por_emitir = [];
        var ids_cerrada = [];
        var ids_not_closed = [];
        var ids_libro_c = [];
        var ids_libro_v = [];
        var ids_libro_boletas = [];
        var ids_libro_otro = [];
        $(
          "#viewport tbody.ui-selectable tr[data-id] td:first-of-type input.selected:checked"
        ).each(function () {
          if (
            $(this)
              .closest("tr")
              .data("contabilizado")
          ) {
            ids_contabilizado.push(
              $(this)
                .closest("tr")
                .data("id")
            );
          }
          if (
            $(this)
              .closest("tr")
              .data("estado") &&
            $(this)
              .closest("tr")
              .data("estado") == "POR EMITIR"
          ) {
            ids_por_emitir.push(
              $(this)
                .closest("tr")
                .data("id")
            );
          }
          if (
            $(this)
              .closest("tr")
              .data("estado") &&
            $(this)
              .closest("tr")
              .data("estado") == "CERRADA"
          ) {
            ids_cerrada.push(
              $(this)
                .closest("tr")
                .data("id")
            );
          }
          // new
          if (
            $(this)
              .closest("tr")
              .data("estado") &&
            $(this)
              .closest("tr")
              .data("estado") !== "CERRADA"
          ) {
            ids_not_closed.push(
              $(this)
                .closest("tr")
                .data("id")
            );
          }
          //new
          if (
            $(this)
              .closest("tr")
              .data("libro") == "LIBRO_C"
          ) {
            ids_libro_c.push(
              $(this)
                .closest("tr")
                .data("id")
            );
          }
          if (
            $(this)
              .closest("tr")
              .data("libro") == "LIBRO_V"
          ) {
            ids_libro_v.push(
              $(this)
                .closest("tr")
                .data("id")
            );
          }
          if (
            $(this)
              .closest("tr")
              .data("libro") == "LIBRO_BOLETAS"
          ) {
            ids_libro_boletas.push(
              $(this)
                .closest("tr")
                .data("id")
            );
          }
          if (
            $(this)
              .closest("tr")
              .data("libro") == "OTRO"
          ) {
            ids_libro_otro.push(
              $(this)
                .closest("tr")
                .data("id")
            );
          }
          ids.push(
            $(this)
              .closest("tr")
              .data("id")
          );
        });

        let htmlFiles = $(`<section> 
            <span>Selecciona archivo a descargar:</span>
            <br/> 
            <br/> 
            <button id="sapDtcList" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only">
              <span class="ui-button-text">
              Listado
              </span>
            </button>
            <button id="sapDtcDetail" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only">
              <span class="ui-button-text">
              Detalles
              </span>
            </button>
          </section>`);

        var htmlObject = $(`<section> 
            <span>Seleccionar fecha contable:</span> 
            <input  type="date" style="border-bottom:solid 1px!important;width:300px" name="month2" >
          </section>`);


        let warningNoDate = () => {
          toastr.warning("Debes introducir una fecha contable!");
        };

        let downTsvCustom = (sDate, tipo) => {
          console.log("sDate");
          console.log(sDate);


          var exportSapDtc = async function (period, number) {
            var htmlSubObject = $(
              '<section> \
                        <span>Confirmar inicio de correlativo interno:</span> \
                        <input required type="number" style="border-bottom:solid 1px!important;width:300px" name="number" value="' +
              number +
              '"> \
                      </section>'
            );

            htmlSubObject.find("input").on("blur change", function () {
              htmlSubObject.data("response", $(this).val());
            });

            var downloadFile = async function (number = 0, type) {
              var url =
                nodeUrl +
                `/get-sap?type=${type}&ids=${ids.join("|")}&number=${number}&sDate=${sDate}&hostname=${window.location.origin}&sid=${unaBase.sid.encoded()}&tipo_doc=${tipo}`;

              var download = window.open(url).blur();
              window.focus();
              try {
                download.close();
              } catch (err) {
                console.log(err);
              }
            };

            if (number && number != "") {
              prompt(htmlFiles).done(function (data) {
                $(this).remove();
              });
              document
                .getElementById("sapDtcDetail")
                .addEventListener("click", function () {
                  downloadFile(number, "Detail");
                  console.log("detail");
                });
              document
                .getElementById("sapDtcList")
                .addEventListener("click", function () {
                  downloadFile(number, "List");
                  console.log("list");
                });
              // downloadFile(number);
            }
          };



          fetch(`/4DACTION/_V3_getLastAccountingNumber?tipo_doc=${tipo}`)
            .then(response => response.json())
            .then(data => {
              exportSapDtc("", data.last);
            });
        };

        let htmlIsAccounting = `<section> 
                <span style="font-size: 16px">Has seleccionado documentos que se han exportado con anterioridad,  posiblemente ya se han contabilizado, <br/> deseas descargarlo igualmente?</span>
                <br/></section>`;


        switch (modulo) {
          case "DTC":
            // url = '/4DACTION/_V3_exportDtc?' + filters;

            var sid = "";
            $.each($.cookie(), function (clave, valor) {
              if (clave == hash && valor.match(/UNABASE/g)) sid = valor;
            });
            var libro_c = ids_libro_c.length > 0;
            var libro_boletas = ids_libro_boletas.length > 0;
            var libro_otro = ids_libro_otro.length > 0;
            var contabilizado = ids_contabilizado.length > 0;

            let newDate;
            let downTsv = sDate => {
              console.log("sDate");
              console.log(sDate);

              var exportSapDtc = async function (period, number) {
                var htmlSubObject = $(
                  '<section> \
                        <span>Confirmar inicio de correlativo interno:</span> \
                        <input required type="number" style="border-bottom:solid 1px!important;width:300px" name="number" value="' +
                  number +
                  '"> \
                      </section>'
                );

                htmlSubObject.find("input").on("blur change", function () {
                  htmlSubObject.data("response", $(this).val());
                });

                var downloadFile = async function (number = 0, type) {
                  var url =
                    nodeUrl +
                    `/export/dtc/sap/${type}/${ids.join(
                      "|"
                    )}/${number}/${sDate}?hostname=${window.location.origin}&sid=${unaBase.sid.encoded()}`;

                  var download = window.open(url).blur();
                  window.focus();
                  try {
                    download.close();
                  } catch (err) {
                    console.log(err);
                  }
                };

                if (number && number != "") {
                  prompt(htmlFiles).done(function (data) {
                    $(this).remove();
                  });
                  document
                    .getElementById("sapDtcDetail")
                    .addEventListener("click", function () {
                      downloadFile(number, "detail");
                      console.log("detail");
                    });
                  document
                    .getElementById("sapDtcList")
                    .addEventListener("click", function () {
                      downloadFile(number, "list");
                      console.log("list");
                    });
                  // downloadFile(number);
                }
              };

              fetch("/4DACTION/_V3_getLastAccountingNumber?tipo_doc=Dtc")
                .then(response => response.json())
                .then(data => {
                  exportSapDtc("", data.last);
                });
            };
            if (contabilizado) {
              prompt(htmlIsAccounting).done(function () {
                prompt(htmlObject).done(function (data) {
                  newDate = document.querySelector('input[name="month2"]')
                    .value;

                  if (newDate !== false && newDate !== "") {
                    downTsv(newDate);
                  } else {
                    warningNoDate();
                  }
                });
              });
            } else {
              prompt(htmlObject).done(function (data) {
                newDate = document.querySelector('input[name="month2"]')
                  .value;

                if (newDate !== false && newDate !== "") {
                  downTsv(newDate);
                } else {
                  warningNoDate();
                }
              });
            }
            //  else {
            //  if (contabilizado) {
            //    toastr.warning('Existen documentos ya contabilizados que están seleccionados, deben solo exportarse documentos no contabilizados.');
            //  } else {
            //    toastr.warning('Se han seleccionado tipos de documentos diferentes. Solo se deben exportar documentos de un mismo tipo.');
            //  }
            // }

            break;

          case "GASTOS":
            var sid = "";
            $.each($.cookie(), function (clave, valor) {
              if (clave == hash && valor.match(/UNABASE/g)) sid = valor;
            });
            var contabilizado = ids_contabilizado.length > 0;

            if (contabilizado) {
              prompt(htmlIsAccounting).done(function () {
                prompt(htmlObject).done(function (data) {
                  let newDate = document.querySelector('input[name="month2"]')
                    .value;

                  if (newDate !== false && newDate !== "") {
                    downTsvCustom(newDate, 'Oc');
                  } else {
                    warningNoDate();
                  }
                });
              });
            } else {
              prompt(htmlObject).done(function (data) {
                let newDate = document.querySelector('input[name="month2"]')
                  .value;

                if (newDate !== false && newDate !== "") {
                  downTsvCustom(newDate, 'Oc');
                } else {
                  warningNoDate();
                }
              });
            }
            break;

          case "DTV":
            var sid = "";
            $.each($.cookie(), function (clave, valor) {
              if (clave == hash && valor.match(/UNABASE/g)) sid = valor;
            });
            var contabilizado = ids_contabilizado.length > 0;

            if (contabilizado) {
              prompt(htmlIsAccounting).done(function () {
                prompt(htmlObject).done(function (data) {
                  let newDate = document.querySelector('input[name="month2"]')
                    .value;

                  if (newDate !== false && newDate !== "") {
                    downTsvCustom(newDate, 'Dtv');
                  } else {
                    warningNoDate();
                  }
                });
              });
            } else {
              prompt(htmlObject).done(function (data) {
                let newDate = document.querySelector('input[name="month2"]')
                  .value;

                if (newDate !== false && newDate !== "") {
                  downTsvCustom(newDate, 'Dtv');
                } else {
                  warningNoDate();
                }
              });
            }
            break;


          case "RENDICIONES":
            // url = '/4DACTION/_V3_exportDtc?' + filters;
            var libro_v = ids_libro_v.length > 0;
            var libro_otro = ids_libro_otro.length > 0;
            var contabilizado = ids_contabilizado.length > 0;
            var cerrada = ids_cerrada.length > 0;
            var notClosed = ids_not_closed.length > 0;
            // if (!cerrada) {
            var htmlObject = $(
              '<section> \
                  <span>Seleccionar periodo contable:</span> \
                  <input required type="text" style="border-bottom:solid 1px!important;width:300px" name="month" placeholder="0000-00"> \
                </section>'
            );

            htmlObject.find('input[name="month"]').monthpicker({
              changeMonth: true,
              changeYear: true,
              yearRange: "c-10:c+3",
              onSelect: function (event) {
                htmlObject.data("response", $(this).val());
                htmlObject.find("input").css("background-color", "white");
              }
            });
            let htmlisClosed = `<section> \
                <span style="font-size: 16px">Debes exportar solo rendiciones que se encuentren cerradas.</span>
                <br/> 
                
              </section>`;

            // prompt(htmlObject).done(function(data) {

            var sid = "";
            $.each($.cookie(), function (clave, valor) {
              if (valor.match(/UNABASE/g)) sid += valor;
            });
            // if (data !== false && data !== "") {
            var exportSapFxr = async function (period, number) {
              var htmlSubObject = $(
                '<section> \
                        <span>Confirmar inicio de correlativo interno:</span> \
                        <input required type="number" style="border-bottom:solid 1px!important;width:300px" name="number" value="' +
                number +
                '"> \
                      </section>'
              );

              htmlSubObject.find("input").on("blur change", function () {
                htmlSubObject.data("response", $(this).val());
              });

              var downloadFile = async function (number, type) {
                var url = nodeUrl + `/export/fxr/sap/${type}/${ids.join("|")}?hostname=${window.location.origin}&sid=${unaBase.sid.encoded()}`;

                var download = window.open(url).blur();
                window.focus();
                try {
                  download.close();
                } catch (err) {
                  console.log(err);
                }
              };
              // if (libro_v) {
              // prompt(htmlSubObject).done(function(number) {
              //  if (number) {
              prompt(htmlFiles).done(function (data) {
                $(this).remove();
              });
              document
                .getElementById("sapDtcDetail")
                .addEventListener("click", function () {
                  downloadFile(null, "detail");
                  console.log("detail");
                });
              document
                .getElementById("sapDtcList")
                .addEventListener("click", function () {
                  downloadFile(null, "list");
                  console.log("list");
                });
            };

            if (!notClosed) {
              exportSapFxr("", "");
            } else {
              prompt(htmlisClosed).done(function () { });
            }
            // }
            // });
            // } else {
            //  if (!por_emitir) {
            //    if (contabilizado) {
            //      toastr.warning('Existen documentos ya contabilizados que están seleccionados, deben solo exportarse documentos no contabilizados.');
            //    } else {
            //      toastr.warning('Se han seleccionado tipos de documentos diferentes. Solo se deben exportar documentos de un mismo tipo.');
            //    }
            //  } else {
            //    toastr.warning('Existen documentos por emitir que están seleccionados, deben solo exportarse documentos con folio asignado.');
            //  }
            // }

            break;
        }
      }
    });

  if ($.inArray("assign_accounting_dtc", params.buttons) != -1) {
    buttons.push({
      name: "assign_accounting_dtc",
      caption: "Asignar",
      action: function () {

        let checkId = $("#dialog-viewport input[type=checkbox]:checked").val()
        let checkDoc = $("#dialog-viewport input[type=checkbox]:checked").data('doctype')
        $(`tr[data-id="${localStorage.getItem("id_detalle_comp")}"] td.documento `)[0].dataset.iddoc = checkId;
        $(`tr[data-id="${localStorage.getItem("id_detalle_comp")}"] td.documento `)[0].dataset.doctype = checkDoc;
        document.getElementsByName(`documento_desc_${localStorage.getItem("id_detalle_comp")}`)[0].textContent = "DOCUMENTO NRO: " + $(`#dialog-viewport  tr[data-id="${checkId}"]  td[name="numero"]`).text()
        document.getElementsByName(`documento_desc_${localStorage.getItem("id_detalle_comp")}`)[0].attributes.href.value = docTypes[checkDoc].url(checkId)
        $('div.ui-dialog button.ui-dialog-titlebar-close').click();
        toastr.success(
          "Se asignó correctamente!"
        );
      }
    });
  }

  if ($.inArray("assign_accounting_contact", params.buttons) != -1) {
    buttons.push({
      name: "assign_accounting_contact",
      caption: "Asignar contacto",
      action: function () {

        let checkId = $("#dialog-viewport input[type=checkbox]:checked").val()

        $(`tr[data-id="${localStorage.getItem("id_detalle_comp")}"] td.contacto `)[0].dataset.idcont = checkId;
        //document.getElementsByName(`auxiliar_desc_${localStorage.getItem("id_detalle_comp")}`)[0].data('id_cont','hola')
        document.getElementsByName(`auxiliar_desc_${localStorage.getItem("id_detalle_comp")}`)[0].textContent = $(`#dialog-viewport  tr[data-id="${checkId}"]  td[name="razon"]`).text()
        document.getElementsByName(`auxiliar_rut_${localStorage.getItem("id_detalle_comp")}`)[0].textContent = $(`#dialog-viewport  tr[data-id="${checkId}"]  td[name="rut"]`).text()
        $('div.ui-dialog button.ui-dialog-titlebar-close').click();
        $('dialog')
        toastr.success(
          "Se asignó correctamente!"
        );
      }
    });
  }


  if ($.inArray("create_cobro_gasto", params.buttons) != -1) {
    buttons.push({
      name: "create_cobro_gasto",
      caption: "Crear deposito",
      action: function () {
        globales.cobros.ids = ""
        let trs = document.querySelectorAll('div.padre tbody tr')

        for (var i = 0; i < trs.length; i++) {
          if (trs[i].getElementsByClassName('selected chk')[0].checked) {
            globales.cobros.ids += (globales.cobros.ids != "" ? "-" + trs[i].dataset.id : trs[i].dataset.id)
          }
        }

        if (globales.cobros.ids != "") {
          $.ajax({
            url: '/4DACTION/_light_verify_global_data',
            dataType: 'json',
            async: false,
            data: {
              'ids': globales.cobros.ids,
              'type': 'FXR'
            },
            success: function (data) {

              if (data.success && data.saldo > 0) {
                globales.cobros.all_saldos = data.saldo;
                unaBase.loadInto.dialog('/v3/views/cobros/dialog/multiCobros.shtml?id=0', 'Nuevo depósito', 'medium');
              } else {
                toastr.warning(data.errorMsg.replaceAll('***', '<br>'));
              }
            }
          });
        } else {
          toastr.warning('No has seleccionado ningun gasto.');
        }

      }
    });
  }


  if ($.inArray("link_to_contable", params.buttons) != -1) {
    buttons.push({
      name: "link-to-contable",
      icon: "ui-icon-calculator",
      caption: "Ir a plan de cuentas",
      action: function () {

        unaBase.loadInto.viewport('/v3/views/ajustes/accounting/list.shtml');
        return false;


      }
    });
  }


  if ($.inArray("reset_all_active_users_password", params.buttons) != -1) {
    buttons.push({
      name: "reset_all_active_users_password",
      icon: "ui-icon-calculator",
      caption: "Reiniciar contraseñas de todos los usuarios",
      action: function () {
        resetAllUsersPassword()
      }
    });
  }

  if ($.inArray("open_accounting_period", params.buttons) != -1)
    buttons.push({
      name: "open_accounting_period",
      icon: "ui-icon-calculator",
      caption: "Abrir periodo contable",
      action: async function () {


        var sid = "";
        $.each($.cookie(), function (clave, valor) {
          if (clave == hash && valor.match(/UNABASE/g)) sid = valor;
        });
        var modulo = $("html > body.menu.home > aside > div > div > ul > li.active")
          .data("name")
          .toUpperCase();
        var url = "";

        var htmlObject = $(
          '<section> \
                <span>Seleccionar periodo contable:</span> \
                <input required type="text" style="border-bottom:solid 1px!important;width:300px" name="month" placeholder="0000-00"> \
              </section>'
        );

        htmlObject.find('input[name="month"]').monthpicker({
          changeMonth: true,
          changeYear: true,
          yearRange: "c-10:c+3",
          onSelect: function (event) {
            htmlObject.data("response", $(this).val());
            htmlObject
              .find("input")
              .css("background-color", "white");
          }
        });

        let abrirPeriodo = async function (period, action) {

          $.ajax({
            url: "/4DACTION/_force_getEstadoPeriodos",
            data: {
              periodo: period,
              action: action
            },
            dataType: "json",
            async: false,
            success: function (data) {

              toastr.success(
                "El periodo seleccionado se abrio exitosamente"
              );
            }
          });


        };
        prompt(htmlObject).done(function (data) {
          var periodo = data;
          if (data !== false && data !== "") {

            $.ajax({
              url: "/4DACTION/_force_getEstadoPeriodos",
              data: {
                periodo: data
              },
              dataType: "json",
              async: false,
              success: function (subdata) {

                if (subdata.exists == 1) {
                  if (subdata.opened == 1) {
                    toastr.warning(
                      "El periodo seleccionado ya se encuentra abierto."
                    );
                  } else {
                    abrirPeriodo(
                      periodo,
                      "open"
                    );
                  }
                } else {
                  toastr.warning(
                    "El periodo contable no está creado.");
                }
              }
            });

          }
        });

      }
    });




  if ($.inArray("status_accounting_period", params.buttons) != -1)
    buttons.push({
      name: "status_accounting_period",
      icon: "ui-icon-calculator",
      caption: "Consultar estado periodo",
      action: function () {

        var sid = "";
        $.each($.cookie(), function (clave, valor) {
          if (clave == hash && valor.match(/UNABASE/g)) sid = valor;
        });
        var modulo = $("html > body.menu.home > aside > div > div > ul > li.active")
          .data("name")
          .toUpperCase();
        var url = "";

        // Función para generar el HTML de los meses
        function generateMonthsHTML(year, estados = []) {
          const meses = [
            'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
            'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
          ];

          return meses.map((mes, idx) => {
            const numMes = String(idx + 1).padStart(2, '0');
            const periodoStr = `${year}-${numMes}`;

            const estadoMes = estados.find(e => e.mes.toUpperCase() === mes);
            const esCerrado = estadoMes?.estado === 'CERRADO';

            return `
              <div class="mes">
                <span class="nombre-mes">${mes}</span>
                <span class="switch">
                  <button data-period="${periodoStr}" data-action="open" class="abierto ${!esCerrado ? 'active' : ''}">ABIERTO</button>
                  <button data-period="${periodoStr}" data-action="close" class="cerrado ${esCerrado ? 'active' : ''}">CERRADO</button>
                </span>
              </div>
            `;
          }).join('');
        }

        // HTML principal
        var htmlObject = $(`
          <section class="contable-planilla">
            <div class="titulo" style="display:flex;align-items:center;gap:10px;">
              FILTRO AÑO :
              <select id="filtro-ano" style="font-size:18px;padding:2px 8px;border-radius:6px;border:1px solid #bbb;">
                ${Array.from({ length: 2027 - 2000 + 1 }, (_, i) => 2000 + i).map(y => `<option value="${y}"${y === 2025 ? ' selected' : ''}>${y}</option>`).join('')}
              </select>
            </div>
            <div id="contenedor-mes"></div>
            <button class="boton-cerrar">CERRAR AÑO SELECCIONADO</button>
          </section>
        `);

        // Cargar estados desde el servidor y regenerar meses
        function loadEstadoPeriodos(year) {
          $.ajax({
            url: `/4DACTION/_force_getEstadoPeriodos?year=${year}`,
            dataType: 'json',
            success: function (data) {
              const estados = data.row || [];
              htmlObject.find('#contenedor-mes').html(generateMonthsHTML(year, estados));
              bindPeriodoEvents();
            },
            error: function () {
              toastr.error("No se pudo cargar el estado de los periodos.");
            }
          });
        }

        // Evento cambio de año
        htmlObject.find('#filtro-ano').on('change', function () {
          const newYear = $(this).val();
          loadEstadoPeriodos(newYear);
        });

        // Botón de cerrar todo el año
        htmlObject.find('.boton-cerrar').on('click', function () {
          const selectedYear = htmlObject.find('#filtro-ano').val();
          toastr.info(`Se cerrarán todos los periodos del año ${selectedYear}. Por favor espere unos segundos...`);

          setTimeout(async () => {
            const botonesCerrar = htmlObject.find('.switch button.cerrado');
            for (let i = 0; i < botonesCerrar.length; i++) {
              const btn = botonesCerrar[i];
              const periodo = $(btn).data('period');
              if (periodo && periodo.startsWith(selectedYear)) {
                await setPeriodoContable(periodo, 'close');
                const $parent = $(btn).closest('.switch');
                $parent.find('button.abierto').removeClass('active');
                $parent.find('button.cerrado').addClass('active');
              }
            }
            toastr.success(`Todos los periodos del año ${selectedYear} fueron cerrados correctamente`);
          }, 1500);
        });

        // Enlazar botones de cada mes
        function bindPeriodoEvents() {
          htmlObject.find('.mes .switch button').off('click').on('click', function () {
            const $btn = $(this);
            const $sibling = $btn.siblings('button');
            setPeriodoContable($btn.data('period'), $btn.data('action'));
            if (!$btn.hasClass('active')) {
              $btn.addClass('active');
              $sibling.removeClass('active');
            }
          });
        }

        // Llamada AJAX real para cambiar estado del periodo
        const setPeriodoContable = async function (period, action) {
          await $.ajax({
            url: "/4DACTION/_V3_set_estadoPeriodoContable",
            data: { periodo: period, action },
            dataType: "json",
            async: false,
            success: function () {
              toastr.success(`Periodo ${period} fue ${action === 'close' ? 'cerrado' : 'abierto'} correctamente`);
            },
            error: function () {
              toastr.error(`Error al intentar cambiar el estado de ${period}`);
            }
          });
        };

        // Cargar al inicio
        loadEstadoPeriodos(2025);

        // Abrir modal
        prompt(htmlObject).done(function (data) {
          // puedes usar la data si necesitas
        });


      }
    });



  // if ($.inArray("close_accounting_period", params.buttons) != -1)
  //   buttons.push({
  //     name: "close_accounting_period",
  //     icon: "ui-icon-calculator",
  //     caption: "Cerrar periodo contable",
  //     action: function () {

  //       var sid = "";
  //       $.each($.cookie(), function (clave, valor) {
  //         if (clave == hash && valor.match(/UNABASE/g)) sid = valor;
  //       });
  //       var modulo = $("html > body.menu.home > aside > div > div > ul > li.active")
  //         .data("name")
  //         .toUpperCase();
  //       var url = "";

  //       var htmlObject = $(
  //         '<section> \
  //               <span>Seleccionar periodo contable:</span> \
  //               <input required type="text" style="border-bottom:solid 1px!important;width:300px" name="month" placeholder="0000-00"> \
  //             </section>'
  //       );

  //       htmlObject.find('input[name="month"]').monthpicker({
  //         changeMonth: true,
  //         changeYear: true,
  //         yearRange: "c-10:c+3",
  //         onSelect: function (event) {
  //           htmlObject.data("response", $(this).val());
  //           htmlObject
  //             .find("input")
  //             .css("background-color", "white");
  //         }
  //       });

  //       let cerrarPeriodo = async function (period, action) {

  //         $.ajax({
  //           url: "/4DACTION/_V3_set_estadoPeriodoContable",
  //           data: {
  //             periodo: period,
  //             action: action
  //           },
  //           dataType: "json",
  //           async: false,
  //           success: function (data) {

  //             toastr.success(
  //               "El periodo seleccionado fue cerrado exitosamente"
  //             );
  //           }
  //         });

  //       };

  //       prompt(htmlObject).done(function (data) {
  //         var periodo = data;
  //         if (data !== false && data !== "") {

  //           $.ajax({
  //             url: "/4DACTION/_V3_get_estadoPeriodoContable",
  //             data: {
  //               periodo: data
  //             },
  //             dataType: "json",
  //             async: false,
  //             success: function (subdata) {

  //               if (subdata.exists == 1) {
  //                 if (subdata.closed == 1) {
  //                   toastr.warning(
  //                     "El periodo seleccionado ya se encuentra cerrado."
  //                   );
  //                 } else {
  //                   cerrarPeriodo(
  //                     periodo,
  //                     "close"
  //                   );
  //                 }
  //               } else {
  //                 toastr.warning(
  //                   "El periodo contable no está creado.");
  //               }
  //             }
  //           });


  //         }
  //       });

  //     }
  //   });

  //REAPER NOW


  if ($.inArray("create_accounting_period", params.buttons) != -1)
    buttons.push({
      name: "create_accounting_period",
      icon: "ui-icon-calculator",
      caption: "Crear periodo contable",
      action: function () {

        var sid = "";
        $.each($.cookie(), function (clave, valor) {
          if (clave == hash && valor.match(/UNABASE/g)) sid = valor;
        });
        var modulo = $("html > body.menu.home > aside > div > div > ul > li.active")
          .data("name")
          .toUpperCase();
        var url = "";

        var htmlObject = $(
          '<section> \
              <span>Seleccionar periodo contable:</span> \
              <input required type="text" style="border-bottom:solid 1px!important;width:300px" name="month" placeholder="0000-00"> \
            </section>'
        );

        htmlObject.find('input[name="month"]').monthpicker({
          changeMonth: true,
          changeYear: true,
          yearRange: "c-10:c+3",
          onSelect: function (event) {
            htmlObject.data("response", $(this).val());
            htmlObject
              .find("input")
              .css("background-color", "white");
          }
        });

        let crearPeriodo = async function (period) {

          $.ajax({
            url: "/4DACTION/_V3_set_periodoContable",
            data: {
              periodo: period
            },
            dataType: "json",
            async: false,
            success: function (data) {

              toastr.success(
                "El periodo seleccionado fue creado exitosamente"
              );
            }
          });

        };

        prompt(htmlObject).done(function (data) {
          var periodo = data;
          if (data !== false && data !== "") {

            $.ajax({
              url: "/4DACTION/_V3_get_estadoPeriodoContable",
              data: {
                periodo: data,
                status: true
              },
              dataType: "json",
              async: false,
              success: function (subdata) {

                if (subdata.exists == 1) {

                  toastr.warning(
                    "El periodo seleccionado ya se encuentra creado." + "<br>" +
                    "Los periodos creados el año " + subdata.anno + " son : " + "<br>" + subdata.periodosDis
                  );



                } else {

                  crearPeriodo(
                    periodo
                  );
                }
              }
            });


          }
        });

      }
    });

  if ($.inArray("Importar apertura", params.buttons) != -1) {

    buttons.push({
      name: "Importar apertura",
      icon: "ui-icon-calculator",
      caption: `Importar apertura`,
      action: function () {
        let tipo = "";

        if (
          $("html > body.menu.home > aside > div > div > ul > li.active")
            .data("name")
            .toUpperCase() == "GASTOS"
        ) {
          tipo = "crear oc validadas";
        } else {
          tipo = "crear fxr validadas";
        }

        // unaBase.loadInto.dialog(
        //   '/v3/views/compras/importPagosGastos.shtml?id=0',
        //   'JUSTIFICAR GASTOS MASIVOS',
        //   'small'
        // );


        var modal = document.getElementById("modalImportadorPagos");

        modal.querySelector(".title-modal").textContent = "Importador de Apertura"

        // Abrir el modal cuando se hace click en el botón
        modal.style.display = "block";

        // Cerrar el modal cuando se hace click en cualquier lugar fuera de él
        window.onclick = function (event) {
          if (event.target == modal) {
            modal.style.display = "none";
          }
        }

      }
    });
  }


  if ($.inArray("softland_csv_preview", params.buttons) != -1)
    buttons.push({
      name: "softland_csv_preview",
      icon: "ui-icon-calculator",
      caption: "Vista previa",
      action: function () {

        document.querySelector('.master-modal-container').style.display = 'flex'



      }
    });




  /* BEGIN: exportar Softland */


  if ($.inArray("new_export_softland", params.buttons) != -1)
    buttons.push({
      name: "new_export_softland",
      icon: "ui-icon-calculator",
      caption: "Exportar a Softland",
      action: function () {
      }

    });

  if ($.inArray("export_softland", params.buttons) != -1)
    buttons.push({
      name: "export_softland",
      icon: "ui-icon-calculator",
      caption: "Exportar a Softland",
      action: function () {

        var sid = "";
        let action = "preview"

        $.each($.cookie(), function (clave, valor) {
          if (clave == hash && valor.match(/UNABASE/g)) sid = valor;
        });
        var modulo = $("html > body.menu.home > aside > div > div > ul > li.active")
          .data("name")
          .toUpperCase();
        var url = "";
        // var filters = $('#search').serializeAnything(true);
        var ids = [];
        var tipos = [];
        var ids_contabilizado = [];
        var ids_por_emitir = [];
        var ids_cerrada = [];
        var ids_libro_c = [];
        var ids_libro_v = [];
        var ids_libro_boletas = [];
        var ids_libro_otro = [];
        $(
          "#viewport tbody.ui-selectable tr[data-id] td:first-of-type input.selected:checked"
        ).each(function () {
          if (
            $(this)
              .closest("tr")
              .data("contabilizado")
          ) {
            ids_contabilizado.push(
              $(this)
                .closest("tr")
                .data("id")
            );
          }
          if (
            $(this)
              .closest("tr")
              .data("estado") &&
            $(this)
              .closest("tr")
              .data("estado") == "POR EMITIR"
          ) {
            ids_por_emitir.push(
              $(this)
                .closest("tr")
                .data("id")
            );
          }
          if (
            $(this)
              .closest("tr")
              .data("estado") &&
            $(this)
              .closest("tr")
              .data("estado") == "CERRADA"
          ) {
            ids_cerrada.push(
              $(this)
                .closest("tr")
                .data("id")
            );
          }
          if (
            $(this)
              .closest("tr")
              .data("libro") == "LIBRO_C"
          ) {
            ids_libro_c.push(
              $(this)
                .closest("tr")
                .data("id")
            );
          }
          if (
            $(this)
              .closest("tr")
              .data("libro") == "LIBRO_V"
          ) {
            ids_libro_v.push(
              $(this)
                .closest("tr")
                .data("id")
            );
          }
          if (
            $(this)
              .closest("tr")
              .data("libro") == "LIBRO_BOLETAS"
          ) {
            ids_libro_boletas.push(
              $(this)
                .closest("tr")
                .data("id")
            );
          }
          if (
            $(this)
              .closest("tr")
              .data("libro") == "OTRO"
          ) {
            ids_libro_otro.push(
              $(this)
                .closest("tr")
                .data("id")
            );
          }
          ids.push(
            $(this)
              .closest("tr")
              .data("id")
          );
          tipos.push(
            $(this)
              .closest("tr")
              .data("tipo")
          );
        });

        switch (modulo) {
          case "DTC":
            // url = '/4DACTION/_V3_exportDtc?' + filters;
            var libro_c = ids_libro_c.length > 0;
            var libro_boletas = ids_libro_boletas.length > 0;
            var libro_otro = ids_libro_otro.length > 0;
            var contabilizado = ids_contabilizado.length > 0;

            //if (!contabilizado && ((libro_c ? !libro_boletas : libro_boletas) ? !libro_otro : libro_otro)) {
            if (
              (libro_c
                ? !libro_boletas
                : libro_boletas)
                ? !libro_otro
                : libro_otro
            ) {
              var htmlObject = $(
                '<section> \
                  <span>Seleccionar periodo contable:</span> \
                  <input required type="text" style="border-bottom:solid 1px!important;width:300px" name="month" placeholder="0000-00"> \
                </section>'
              );

              htmlObject.find('input[name="month"]').monthpicker({
                changeMonth: true,
                changeYear: true,
                yearRange: "c-10:c+3",
                onSelect: function (event) {
                  htmlObject.data("response", $(this).val());
                  htmlObject
                    .find("input")
                    .css("background-color", "white");
                }
              });

              prompt(htmlObject).done(function (data) {
                if (data !== false && data !== "") {
                  var exportSoftlandDtc = async function (period, number) {
                    var htmlSubObject =
                      $(`<section>
                                    <div style="display:inline-flex">
                                        ${libro_c ? '<span>Confirmar inicio de correlativo interno:</span><input id="correlativo" type="number" style="border-bottom:solid 1px!important;width:300px" name="number" value="' + number + '">' : ''}
                                    </div>
                                    <hr><br>
                                    <div class="custom-control custom-radio custom-control-inline">
                                        <input type="radio" id="customRadioInline1" name="customRadioInline1" class="custom-control-input" checked value="preview">
                                        <label class="custom-control-label" for="customRadioInline1">Visualizar</label>
                                    </div>
                                    <div class="custom-control custom-radio custom-control-inline">
                                        <input type="radio" id="customRadioInline2" name="customRadioInline1" class="custom-control-input" value="download">
                                        <label class="custom-control-label" for="customRadioInline2">Descargar</label>
                                    </div>
                                    </section>`);


                    htmlSubObject
                      .find("#correlativo")
                      .on("blur change", function () {
                        htmlSubObject.data("response", $(this).val());
                      });

                    var downloadFile = async function (number) {
                      $.ajax({
                        url: "/4DACTION/_V3_getPeriodoContable",
                        data: {
                          periodo: period,
                          number: number
                        },
                        dataType: "json",
                        async: false,
                        success: function (subsubsubdata) {
                          if (!subsubsubdata.repeated) {
                            url =
                              "/4DACTION/_V3_exportDtc?ids=" +
                              ids.join("|") +
                              "&periodo=" + period +
                              "&action=" + action +
                              "&number=" + number;

                            if (action == "preview") {

                              $.ajax({
                                url,
                                data: {
                                  periodo: period,
                                  action,
                                  number: number
                                },
                                dataType: "json",
                                async: false,
                                success: function (dt) {
                                  let link = url =
                                    "/4DACTION/_V3_exportDtc?ids=" +
                                    ids.join("|") +
                                    "&periodo=" + period +
                                    "&number=" + number;

                                  masterModal(dt, link)

                                }
                              });
                            } else {
                              unaBase.log.save(
                                "Ha exportado DTC a Softland",
                                "dtc"
                              );
                              var download = window.open(url);
                              download.blur();
                              window.focus();
                            }

                          } else {
                            toastr.warning(
                              "Ya existen documentos contabilizados con el correlativo indicado."
                            );
                          }
                        }
                      });
                    };
                    nr = ''
                    prompt(htmlSubObject).done(function (ok) {
                      nr = libro_c ? document.querySelector('section div input#correlativo').value : undefined
                      action = document.querySelector('section div input[type="radio"]:checked').value
                      downloadFile(nr);


                    });

                  };
                  $.ajax({
                    url: "/4DACTION/_V3_getPeriodoContable",
                    data: {
                      periodo: data
                    },
                    dataType: "json",
                    async: false,
                    success: function (subdata) {
                      if (subdata.exists) {
                        if (subdata.closed) {
                          toastr.warning(
                            "El periodo seleccionado ya se encuentra cerrado."
                          );
                        } else {
                          exportSoftlandDtc(
                            subdata.period,
                            subdata.number
                          );
                        }
                      } else {
                        confirm(
                          "El periodo contable no está creado. Continuar para crear."
                        ).done(function (subsubdata) {
                          if (subsubdata) {
                            exportSoftlandDtc(
                              subdata.period,
                              subdata.number
                            );
                          }
                        });
                      }
                    }
                  });
                }
              });
            } else {
              if (contabilizado) {
                toastr.warning(
                  "Existen documentos ya contabilizados que están seleccionados, deben solo exportarse documentos no contabilizados."
                );
              } else {
                toastr.warning(
                  "Se han seleccionado tipos de documentos diferentes. Solo se deben exportar documentos de un mismo tipo."
                );
              }
            }

            break;

          case "DTV":
            // url = '/4DACTION/_V3_exportDtv?' + filters;
            var libro_v = ids_libro_v.length > 0;
            var libro_otro = ids_libro_otro.length > 0;
            var contabilizado = ids_contabilizado.length > 0;
            var por_emitir = ids_por_emitir.length > 0;

            //if (!contabilizado && (libro_v ? !libro_otro : libro_otro) && !por_emitir) {
            if ((libro_v ? !libro_otro : libro_otro) && !por_emitir) {
              var htmlObject = $(
                '<section> \
                  <span>Seleccionar periodo contable:</span> \
                  <input required type="text" style="border-bottom:solid 1px!important;width:300px" name="month" placeholder="0000-00"> \
                </section>'
              );

              htmlObject.find('input[name="month"]').monthpicker({
                changeMonth: true,
                changeYear: true,
                yearRange: "c-10:c+3",
                onSelect: function (event) {
                  htmlObject.data("response", $(this).val());
                  htmlObject
                    .find("input")
                    .css("background-color", "white");
                }
              });

              prompt(htmlObject).done(function (data) {
                if (data !== false && data !== "") {
                  var exportSoftlandDtv = async function (period, number) {
                    var htmlSubObject = $(
                      '<section> \
                        <span>Confirmar inicio de correlativo interno:</span> \
                        <input required type="number" style="border-bottom:solid 1px!important;width:300px" name="number" value="' +
                      number +
                      '"> \
                      </section>'
                    );

                    htmlSubObject
                      .find("input")
                      .on("blur change", function () {
                        htmlSubObject.data("response", $(this).val());
                      });

                    var downloadFile = async function (number) {
                      $.ajax({
                        url: "/4DACTION/_V3_getPeriodoContable",
                        data: {
                          periodo: period,
                          number: number
                        },
                        dataType: "json",
                        async: false,
                        success: function (subsubsubdata) {
                          if (!subsubsubdata.repeated) {
                            url =
                              "/4DACTION/_V3_exportDtv?ids=" +
                              ids.join("|") +
                              "&periodo=" +
                              period +
                              "&tipos=" +
                              tipos.join("|") +
                              "&number=" +
                              number;
                            unaBase.log.save(
                              "Ha exportado DTV a Softland",
                              "dtv"
                            );
                            var download = window.open(url);
                            download.blur();
                            window.focus();
                          } else {
                            toastr.warning(
                              "Ya existen documentos contabilizados con el correlativo indicado."
                            );
                          }
                        }
                      });
                    };
                    if (libro_v) {
                      prompt(htmlSubObject).done(function (number) {
                        if (number) {
                          downloadFile(number);
                        }
                      });
                    } else {
                      downloadFile(undefined);
                    }
                  };
                  $.ajax({
                    url: "/4DACTION/_V3_getPeriodoContable",
                    data: {
                      periodo: data
                    },
                    dataType: "json",
                    async: false,
                    success: function (subdata) {
                      if (subdata.exists) {
                        if (subdata.closed) {
                          toastr.warning(
                            "El periodo seleccionado ya se encuentra cerrado."
                          );
                        } else {
                          exportSoftlandDtv(
                            subdata.period,
                            subdata.number
                          );
                        }
                      } else {
                        confirm(
                          "El periodo contable no está creado. Continuar para crear."
                        ).done(function (subsubdata) {
                          if (subsubdata) {
                            exportSoftlandDtv(
                              subdata.period,
                              subdata.number
                            );
                          }
                        });
                      }
                    }
                  });
                }
              });
            } else {
              if (!por_emitir) {
                if (contabilizado) {
                  toastr.warning(
                    "Existen documentos ya contabilizados que están seleccionados, deben solo exportarse documentos no contabilizados."
                  );
                } else {
                  toastr.warning(
                    "Se han seleccionado tipos de documentos diferentes. Solo se deben exportar documentos de un mismo tipo."
                  );
                }
              } else {
                toastr.warning(
                  "Existen documentos por emitir que están seleccionados, deben solo exportarse documentos con folio asignado."
                );
              }
            }

            break;

          case "EGRESOS":
            // url = '/4DACTION/_V3_exportEgresos?' + filters;
            var libro_v = ids_libro_v.length > 0;
            var libro_otro = ids_libro_otro.length > 0;
            var contabilizado = ids_contabilizado.length > 0;
            var por_emitir = ids_por_emitir.length > 0;

            //if (!contabilizado /*&& (libro_v ? !libro_otro : libro_otro)*/ && !por_emitir) {
            if (!por_emitir) {
              var htmlObject = $(
                '<section> \
                  <span>Seleccionar periodo contable:</span> \
                  <input required type="text" style="border-bottom:solid 1px!important;width:300px" name="month" placeholder="0000-00"> \
                </section>'
              );

              htmlObject.find('input[name="month"]').monthpicker({
                changeMonth: true,
                changeYear: true,
                yearRange: "c-10:c+3",
                onSelect: function (event) {
                  htmlObject.data("response", $(this).val());
                  htmlObject
                    .find("input")
                    .css("background-color", "white");
                }
              });

              prompt(htmlObject).done(function (data) {
                if (data !== false && data !== "") {
                  var exportSoftlandDtv = async function (period, number) {
                    var htmlSubObject = $(
                      '<section> \
                        <span>Confirmar inicio de correlativo interno:</span> \
                        <input required type="number" style="border-bottom:solid 1px!important;width:300px" name="number" value="' +
                      number +
                      '"> \
                      </section>'
                    );

                    htmlSubObject
                      .find("input")
                      .on("blur change", function () {
                        htmlSubObject.data("response", $(this).val());
                      });

                    var downloadFile = async function (number) {
                      $.ajax({
                        url: "/4DACTION/_V3_getPeriodoContable",
                        data: {
                          periodo: period,
                          number: number
                        },
                        dataType: "json",
                        async: false,
                        success: function (subsubsubdata) {
                          if (!subsubsubdata.repeated) {
                            url =
                              "/4DACTION/_V3_ExportEgresos?ids=" +
                              ids.join("|") +
                              "&periodo=" +
                              period +
                              "&number=" +
                              number;
                            unaBase.log.save(
                              "Ha exportado egresos a Softland",
                              "egresos"
                            );

                            var download = window.open(url);
                            download.blur();
                            window.focus();
                          } else {
                            toastr.warning(
                              "Ya existen documentos contabilizados con el correlativo indicado."
                            );
                          }
                        }
                      });
                    };
                    if (libro_v) {
                      prompt(htmlSubObject).done(function (number) {
                        if (number) {
                          downloadFile(number);
                        }
                      });
                    } else {
                      downloadFile(undefined);
                    }
                  };
                  $.ajax({
                    url: "/4DACTION/_V3_getPeriodoContable",
                    data: {
                      periodo: data
                    },
                    dataType: "json",
                    async: false,
                    success: function (subdata) {
                      if (subdata.exists) {
                        if (subdata.closed) {
                          toastr.warning(
                            "El periodo seleccionado ya se encuentra cerrado."
                          );
                        } else {
                          exportSoftlandDtv(
                            subdata.period,
                            subdata.number
                          );
                        }
                      } else {
                        confirm(
                          "El periodo contable no está creado. Continuar para crear."
                        ).done(function (subsubdata) {
                          if (subsubdata) {
                            exportSoftlandDtv(
                              subdata.period,
                              subdata.number
                            );
                          }
                        });
                      }
                    }
                  });
                }
              });
            } else {
              if (!por_emitir) {
                if (contabilizado) {
                  toastr.warning(
                    "Existen documentos ya contabilizados que están seleccionados, deben solo exportarse documentos no contabilizados."
                  );
                } else {
                  toastr.warning(
                    "Se han seleccionado tipos de documentos diferentes. Solo se deben exportar documentos de un mismo tipo."
                  );
                }
              } else {
                toastr.warning(
                  "Existen documentos por emitir que están seleccionados, deben solo exportarse documentos con folio asignado."
                );
              }
            }

            break;
          case "GASTOS":
            // url = '/4DACTION/_V3_exportDtc?' + filters;
            var libro_v = ids_libro_v.length > 0;
            var libro_otro = ids_libro_otro.length > 0;
            var contabilizado = ids_contabilizado.length > 0;
            var cerrada = ids_cerrada.length > 0;

            if (!cerrada) {
              var htmlObject = $(
                '<section> \
                  <span>Seleccionar periodo contable:</span> \
                  <input required type="text" style="border-bottom:solid 1px!important;width:300px" name="month" placeholder="0000-00"> \
                </section>'
              );

              htmlObject.find('input[name="month"]').monthpicker({
                changeMonth: true,
                changeYear: true,
                yearRange: "c-10:c+3",
                onSelect: function (event) {
                  htmlObject.data("response", $(this).val());
                  htmlObject
                    .find("input")
                    .css("background-color", "white");
                }
              });

              prompt(htmlObject).done(function (data) {
                if (data !== false && data !== "") {
                  var exportSoftlandDtv = async function (period, number) {
                    var htmlSubObject = $(
                      '<section> \
                        <span>Confirmar inicio de correlativo interno:</span> \
                        <input required type="number" style="border-bottom:solid 1px!important;width:300px" name="number" value="' +
                      number +
                      '"> \
                      </section>'
                    );

                    htmlSubObject
                      .find("input")
                      .on("blur change", function () {
                        htmlSubObject.data("response", $(this).val());
                      });

                    var downloadFile = async function (number) {
                      $.ajax({
                        url: "/4DACTION/_V3_getPeriodoContable",
                        data: {
                          periodo: period,
                          number: number
                        },
                        dataType: "json",
                        async: false,
                        success: function (subsubsubdata) {
                          if (!subsubsubdata.repeated) {
                            url =
                              "/4DACTION/_V3_ExportOC?ids=" +
                              ids.join("|") +
                              "&periodo=" +
                              period +
                              "&number=" +
                              number;
                            unaBase.log.save(
                              "Ha exportado egresos a Softland",
                              "egresos"
                            );

                            var download = window.open(url);
                            download.blur();
                            window.focus();
                          } else {
                            toastr.warning(
                              "Ya existen documentos contabilizados con el correlativo indicado."
                            );
                          }
                        }
                      });
                    };
                    if (libro_v) {
                      prompt(htmlSubObject).done(function (number) {
                        if (number) {
                          downloadFile(number);
                        }
                      });
                    } else {
                      downloadFile(undefined);
                    }
                  };
                  $.ajax({
                    url: "/4DACTION/_V3_getPeriodoContable",
                    data: {
                      periodo: data
                    },
                    dataType: "json",
                    async: false,
                    success: function (subdata) {
                      if (subdata.exists) {
                        if (subdata.closed) {
                          toastr.warning(
                            "El periodo seleccionado ya se encuentra cerrado."
                          );
                        } else {
                          exportSoftlandDtv(
                            subdata.period,
                            subdata.number
                          );
                        }
                      } else {
                        confirm(
                          "El periodo contable no está creado. Continuar para crear."
                        ).done(function (subsubdata) {
                          if (subsubdata) {
                            exportSoftlandDtv(
                              subdata.period,
                              subdata.number
                            );
                          }
                        });
                      }
                    }
                  });
                }
              });
            } else {
              if (!por_emitir) {
                if (contabilizado) {
                  toastr.warning(
                    "Existen documentos ya contabilizados que están seleccionados, deben solo exportarse documentos no contabilizados."
                  );
                } else {
                  toastr.warning(
                    "Se han seleccionado tipos de documentos diferentes. Solo se deben exportar documentos de un mismo tipo."
                  );
                }
              } else {
                toastr.warning(
                  "Existen documentos por emitir que están seleccionados, deben solo exportarse documentos con folio asignado."
                );
              }
            }

            break;

          case "RENDICIONES":
            // url = '/4DACTION/_V3_exportDtc?' + filters;
            var libro_v = ids_libro_v.length > 0;
            var libro_otro = ids_libro_otro.length > 0;
            var contabilizado = ids_contabilizado.length > 0;
            var cerrada = ids_cerrada.length > 0;

            var htmlObject = $(
              '<section> \
                  <span>Seleccionar periodo contable:</span> \
                  <input required type="text" style="border-bottom:solid 1px!important;width:300px" name="month" placeholder="0000-00"> \
                </section>'
            );

            htmlObject.find('input[name="month"]').monthpicker({
              changeMonth: true,
              changeYear: true,
              yearRange: "c-10:c+3",
              onSelect: function (event) {
                htmlObject.data("response", $(this).val());
                htmlObject
                  .find("input")
                  .css("background-color", "white");
              }
            });

            prompt(htmlObject).done(function (data) {
              if (data !== false && data !== "") {
                var exportSoftlandDtv = async function (period, number) {
                  var htmlSubObject = $(
                    '<section> \
                        <span>Confirmar inicio de correlativo interno:</span> \
                        <input required type="number" style="border-bottom:solid 1px!important;width:300px" name="number" value="' +
                    number +
                    '"> \
                      </section>'
                  );

                  htmlSubObject
                    .find("input")
                    .on("blur change", function () {
                      htmlSubObject.data("response", $(this).val());
                    });

                  var downloadFile = async function (number) {
                    $.ajax({
                      url: "/4DACTION/_V3_getPeriodoContable",
                      data: {
                        periodo: period,
                        number: number
                      },
                      dataType: "json",
                      async: false,
                      success: function (subsubsubdata) {
                        if (!subsubsubdata.repeated) {
                          url =
                            "/4DACTION/_V3_ExportOC?ids=" +
                            ids.join("|") +
                            "&periodo=" +
                            period +
                            "&number=" +
                            number;
                          unaBase.log.save(
                            "Ha exportado egresos a Softland",
                            "egresos"
                          );

                          var download = window.open(url);
                          download.blur();
                          window.focus();
                        } else {
                          toastr.warning(
                            "Ya existen documentos contabilizados con el correlativo indicado."
                          );
                        }
                      }
                    });
                  };
                  if (libro_v) {
                    prompt(htmlSubObject).done(function (number) {
                      if (number) {
                        downloadFile(number);
                      }
                    });
                  } else {
                    downloadFile(undefined);
                  }
                };
                $.ajax({
                  url: "/4DACTION/_V3_getPeriodoContable",
                  data: {
                    periodo: data
                  },
                  dataType: "json",
                  async: false,
                  success: function (subdata) {
                    if (subdata.exists) {
                      if (subdata.closed) {
                        toastr.warning(
                          "El periodo seleccionado ya se encuentra cerrado."
                        );
                      } else {
                        exportSoftlandDtv(
                          subdata.period,
                          subdata.number
                        );
                      }
                    } else {
                      confirm(
                        "El periodo contable no está creado. Continuar para crear."
                      ).done(function (subsubdata) {
                        if (subsubdata) {
                          exportSoftlandDtv(
                            subdata.period,
                            subdata.number
                          );
                        }
                      });
                    }
                  }
                });
              }
            });

            break;
        }
      }
    });

  /* BEGIN: exportar nómina */
  if ($.inArray("export_nomina", params.buttons) != -1)
    buttons.push({
      name: "export_nomina",
      icon: "ui-icon-calculator",
      caption: "Exportar nómina",
      action: function () {


        genNomina();
      }
    });

  // Ver nóminas anteriores
  if ($.inArray("list_nomina", params.buttons) != -1)
    buttons.push({
      name: "list_nomina",
      icon: "ui-icon-document",
      caption: "Ver nóminas anteriores",
      action: function () {
        unaBase.loadInto.dialog(
          "/v3/views/pagos/dialog/nominas.shtml",
          "Nóminas anteriores",
          "medium"
        );
      }
    });


  if ($.inArray("export_list_items_gastos_periode", params.buttons) != -1)
    buttons.push({
      name: "export_list_items_gastos_periode",
      icon: "ui-icon-calculator",
      caption: "Exportar gastos del periodo ",
      action: function () {

        var modulo = $("html > body.menu.home > aside > div > div > ul > li.active")
          .data("name")
          .toUpperCase();
        var url = "";
        var filters = unaBase.utilities.getFilter("#search", true);
        filters += '&'

        filters += $("#search").serializeAnything(true);


        let download_document = url => {
          // console.log(url);
          let download = window.open(url);
          download.blur();
          window.focus();
        }

        url =
          nodeUrl +
          "/export-list-items-gastos-negocios/?download=true&sid=" +
          unaBase.sid.encoded() +
          "&" +
          filters +
          "&hostname=" +
          window.location.origin;
        unaBase.log.save(
          "Ha exportado el listado de ítems de " + etiqueta_negocios,
          "negocios"
        );
        download_document(url);


      }

    });




  if ($.inArray("export_list_items_doc", params.buttons) != -1)
    buttons.push({
      name: "export_list_items_doc",
      icon: "ui-icon-calculator",
      caption: "Exportar items a excel",
      action: function () {
        // var sid = "";
        // $.each($.cookie(),  function(clave, valor) {
        //   if (clave == hash && valor.match(/UNABASE/g)) sid = valor;
        // });
        var modulo = $("html > body.menu.home > aside > div > div > ul > li.active")
          .data("name")
          .toUpperCase();
        var url = "";
        var filters = unaBase.utilities.getFilter("#search", true);
        filters += '&'

        filters += $("#search").serializeAnything(true);


        let download_document = url => {
          // console.log(url);
          let download = window.open(url);
          download.blur();
          window.focus();
        }
        switch (modulo) {
          case "NEGOCIOS":
            url =
              nodeUrl +
              "/export-list-items-negocios/?download=true&sid=" +
              unaBase.sid.encoded() +
              "&" +
              filters +
              "&hostname=" +
              window.location.origin;
            unaBase.log.save(
              "Ha exportado el listado de ítems de " + etiqueta_negocios,
              "negocios"
            );
            download_document(url);
            break;

          case "RENDICIONES":
          case "GASTOS":
            let tipo_gasto = modulo === "GASTOS" ? "OC" : "FXR";
            let tipo_gasto_text = modulo === "GASTOS" ? "órdenes de compra" : "rendiciones";
            let list_type_prompt = `
              <h6>¿ Deseas descargar los items de todo el <b>Listado</b> o de la <b>selección</b> ?</h6>
              <ul>
                <li><input type="radio" name="list_type" id="all_expenses_checkbox" value="all" checked="checked" >  <label for="all_expenses_checkbox">Listado</label></li>
                <li><input type="radio" name="list_type" id="selection_expenses_checkbox"  value="selected" >  <label for="selection_expenses_checkbox" >Selección</label></li>
              </ul>`;
            let download_all = () => {
              url = nodeUrl + `/export-list-items-oc/?download=true&tipo_gasto=${tipo_gasto}&sid=${unaBase.sid.encoded()}&${filters}&hostname=${window.location.origin}`;
              download_document(url);


            }

            let selection = document.querySelectorAll("#viewport tbody.ui-selectable tr[data-id] td:first-of-type input.selected:checked");
            if (selection.length) {
              prompt(list_type_prompt).done(function (dataPromt) {
                const list_type = document.querySelector(
                  'input[name="list_type"]:checked'
                ).value;
                if (list_type === "all") {
                  download_all();
                } else {

                  if (selection.length) {
                    let ids = [];
                    selection.forEach(line => {
                      ids.push(line.closest("tr").dataset.id);
                    });
                    ids = ids.join("|");
                    console.log(ids);
                    url =
                      nodeUrl + `/export-list-items-oc/?download=true&tipo_gasto=${tipo_gasto}&sid=${unaBase.sid.encoded()}&${filters}&hostname=${window.location.origin}&ids=${ids}`;

                    download_document(url);
                  } else {
                    toastr.warning(`Debes seleccionar ${tipo_gasto_text} para continuar`);
                  }
                }

              });

            } else {
              download_all()
            }

            unaBase.log.save(
              `Ha exportado el listado de ìtems de ${tipo_gasto_text}`,
              "gastos"
            );
            break;
          // case "RENDICIONES":
          //   url =
          //     nodeUrl + "/export-list-items-fxr/?download=true&tipo_gasto=FXR&sid=" + unaBase.sid.encoded() + "&" + filters + "&hostname=" + window.location.origin;
          //   unaBase.log.save(
          //     "Ha exportado el listado de ítems de rendiciones",
          //     "rendiciones"
          //   );
          //   break;
        }

      }
    });

  // Ver nóminas anteriores
  /*if ($.inArray('list_bank', params.buttons) != -1)
    buttons.push({
    name: 'list_bank', icon: 'ui-icon-document', caption: 'Ver movimientos bancarios',
     action:  function() {
      window.open('http://'+ nodejs_public_ipaddr + ':' + nodejs_port + '/bankcards/list');
    }
  });*/

  if ($.inArray("dtv_por_cobrar", params.buttons) != -1)
    buttons.push({
      name: "dtv_por_cobrar",
      icon: "ui-icon ui-icon-document",
      caption: "Facturas por cobrar",
      action: function () {
        dtv.get_por_cobrar($(this));
      }
    });

  if ($.inArray("fact_masivo", params.buttons) != -1) {

    buttons.push({
      name: "fact_masivo",
      icon: "ui-icon ui-icon-document",
      caption: "Facturar masivo",
      action: function () {
        unaBase.ui.block();
        //
        var ids = [];
        if (
          !$('#viewport input[name="selected_all"]').is(":checked")
        ) {
          $(
            "#viewport tbody.ui-selectable tr[data-id] td:first-of-type input.selected:checked"
          ).each(function () {
            ids.push(
              $(this)
                .closest("tr")
                .data("id")
            );
          });
        }


        let config = {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: 'post',
          url: nodeUrl + "/set-facturar-masivo?hostname=" + window.location.origin,
          data: {
            sid: unaBase.sid.encoded(),
            ids
          },

        };

        axios(config)
          .then(function (response) {


            response.data.forEach(val => {
              if (val.success) {
                toastr.success(
                  "Factura emitida con éxito (Folio " +
                  ids +
                  ")"
                );

                console.log('URL', val.urlDte)


                setTimeout(function () {
                  window.open(val.urlDte.replace(/http/g, "https"));

                }, 500);

                // unaBase.loadInto.viewport(
                //   "/v3/views/dtv/list.shtml"
                // );

              } else {

                toastr.warning(
                  val.errorMsg.replaceAll(/SL/g, '<br>')
                );
              }
            })

          }).then(res => {
            unaBase.ui.unblock();



          })
          .catch(function (error) {
            unaBase.ui.unblock();
            toastr.warning(
              "Error al facturar masivo"
            );
            console.log(error);
          });



      }
    });

  }


  if ($.inArray("oc_por_validar", params.buttons) != -1)
    buttons.push({
      name: "oc_por_validar",
      icon: "ui-icon ui-icon-cancel",
      caption: "Por validar",
      action: function () {

        // ocs.oc_por_validar($(this));'http://' + nodejs_public_ipaddr + ':' + nodejs_port + '
        //por validar
        // let sidv3 = getCookie(hash);

        let url = `${nodeUrl}/expenses/tovalidate?sid=${unaBase.sid.encoded()}&hostname=${location.origin}`;
        console.log(url);
        window.open(url, "_blank");
      }
    });

  if ($.inArray("fxr_por_validar", params.buttons) != -1)
    buttons.push({
      name: "fxr_por_validar",
      icon: "ui-icon ui-icon-cancel",
      caption: "Por validar",
      action: function () {
        // fxr.fxr_por_validar($(this));
        let url = `${nodeUrl}/expenses/tovalidate?sid=${unaBase.sid.encoded()}&hostname=${location.origin}`;
        console.log(url);
        window.open(url, "_blank");
      }
    });

  if ($.inArray("justificar_masivo", params.buttons) != -1)
    buttons.push({
      name: "justificar_masivo",
      icon: "ui-icon-document",
      caption: "Justicar masivo",
      action: function () {
        compras.justificarMasivo();
      }
    });

  if ($.inArray("emitir-modo-pe-FA", params.buttons) != -1)
    buttons.push({
      name: "emitir-modo-pe-FA",
      icon: "ui-icon-document",
      caption: "Emitir electrónico",
      action: function () {


        let continueAction = () => {

          unaBase.ui.unblock();
          dtv.previewFEPE();
        }
        saveAction(continueAction, params)


      }
    });

  if ($.inArray("emitir-modo-pe-FA_NC", params.buttons) != -1)
    buttons.push({
      name: "emitir-modo-pe-FA_NC",
      icon: "ui-icon-document",
      caption: "Emitir electrónico",
      action: function () {

        let continueAction = () => {
          notas.previewFEPE()
        }
        saveAction(continueAction, params)

      }
    });

  //   if ($.inArray("dtv_emitir_manual", params.buttons) != -1) {
  //     buttons.push({
  //       name: "dtv_emitir_manual",
  //       icon: "ui-icon-document",
  //       caption: "Emitir manual",
  //       action: async function () {

  //         const saveDtvManualConReparto = () => {
  //           return new Promise((resolve, reject) => {

  //             let continueAction = async () => {
  //               unaBase.ui.unblock();

  //               var rut = $('[name="contacto[info][rut]"]').val();
  //               rut = unaBase.data.rut.format(rut);
  //               if (rut != "" || unaBase.parametros.facturar_sin_rut) {
  //                 var rut_valido = true;
  //                 if (currency.code == "CLP" || currency.code == "") {
  //                   rut_valido = unaBase.data.rut.validate(rut);
  //                 }

  //                 const parsedFecha_ = parseFecha(fechaEmision);
  //                 const parsedFecha = parsedFecha_ || today;
  //                 const contentModal = `
  //                 <div class="container-table-accounting-dtv">
  //                   <div class="row p2 container-folio-dtv"><p>Por favor confirme folio: <input class="folio-facturar-dtv" type="text" value="${resDtv.folio_siguiente}"></p>
  //                   <p>Fecha: <input class="date-facturar-dtv" type="date" value="${parsedFecha}" ></p></div>
  //                   <table class="table detail-accounting-dtv">
  //                     <thead>
  //                       <tr>
  //                         <th>Acción</th>
  //                         <th>Cuenta Contable</th>
  //                         <th>Debe</th>
  //                         <th>Haber</th>
  //                       </tr>
  //                     </thead>
  //                     <tbody id="cuentasTableBody">
  //                       <!-- Filas dinámicas aquí -->
  //                     </tbody>
  //                     <tfoot>
  //                       <tr>
  //                         <td colspan="2"><strong>Total:</strong></td>
  //                         <td><span id="total-debe" class="input-align-right">0.00</span></td>
  //                         <td><span id="total-haber" class="input-align-right">0.00</span></td>
  //                       </tr>
  //                     </tfoot>
  //                   </table>
  //                 </div>`;


  //                   // Inicializa el modal
  //                   initModalCustomDtvAccounting("Crear asiento contable DTV", contentModal, 'manual');

  //                   console.log("[DTV MODAL] ✅ Modal inicializado - Cargando cuentas contables...");

  //                   // Obtener cuentas contables y ordenar aqui es felipe
  //                   let resp = await getCuentasContables();
  //                   let dtvItem = resp.items
  //                   resp = ordenarPorCuentaContable(resp.rows);

  //                   const parseMontoSeguro = monto => parseFloat(monto) || 0;
  //                   const totalDebeBase = parseMontoSeguro(dtv.data.montos.total);
  //                   addTableRow(resp[0]?.id || 0, totalDebeBase, "debe"); // Primera fila: Total


  //                 // Inicializa el modal
  //                 initModalCustomDtvAccounting("Crear asiento contable DTV", contentModal, 'manual');


  //                 // Obtener cuentas contables y ordenar aqui es felipe
  //                 let resp = await getCuentasContables();
  //                 let dtvItem = resp.items
  //                 resp = ordenarPorCuentaContable(resp.rows);

  //                 const parseMontoSeguro = monto => parseFloat(monto) || 0;
  //                 const totalDebeBase = parseMontoSeguro(dtv.data.montos.total);
  //                 addTableRow(resp[0]?.id || 0, totalDebeBase, "debe"); // Primera fila: Total

  //                 const filasHaber = [];
  //                 if (dtv.data.codigo_sii != '110') {
  //                   filasHaber.push({
  //                     id: resp[1]?.id || 0,
  //                     monto: parseMontoSeguro(dtv.data.montos.iva),
  //                     locked: true
  //                   });
  //                 }

  //                 // 3. Agrupa por cuenta y suma subtotales
  //                 const agrupadas = {};
  //                 dtvItem.forEach(item => {
  //                   const cuenta = item.cuenta_item; // Usa cuenta_item del array items
  //                   if (!agrupadas[cuenta]) {
  //                     agrupadas[cuenta] = {
  //                       cuenta: cuenta,
  //                       subtotal: 0,
  //                       id_cuenta: item.id_cuenta
  //                     };
  //                   }
  //                   agrupadas[cuenta].subtotal += parseFloat(item.subtotal_item || 0);
  //                 });

  //                   // 3. Agrupa por cuenta y suma subtotales
  //                   const agrupadas = {};
  //                   dtvItem.forEach(item => {
  //                     const cuenta = item.cuenta_item; // Usa cuenta_item del array items
  //                     if (!agrupadas[cuenta]) {
  //                       agrupadas[cuenta] = {
  //                         cuenta: cuenta,
  //                         subtotal: 0,
  //                         id_cuenta: item.id_cuenta
  //                       };
  //                     }
  //                     agrupadas[cuenta].subtotal += parseFloat(item.subtotal_item || 0);
  //                   });

  //                   // 3. Agrega una fila por cada cuenta agrupada dentro del arreglo auxiliar
  //                   Object.values(agrupadas).forEach(cuenta => {
  //                     if (cuenta.subtotal > 0) {
  //                       filasHaber.push({
  //                         id: cuenta.id_cuenta,
  //                         monto: parseMontoSeguro(cuenta.subtotal),
  //                         locked: false
  //                       });
  //                     }
  //                   });

  //                   const cuentaComision = resp?.filter(r => r.comision > 0)[0]

  //                   if(cuentaComision){
  //                     filasHaber.push({
  //                       id: cuenta.id_cuenta,
  //                       monto: parseMontoSeguro(cuenta.subtotal),
  //                       locked: false
  //                     });
  //                   }

  //                   // NO aplicar rebalanceo aquí - lo haremos después de cargar las filas
  //                   filasHaber.forEach(row => {
  //                     if (row.monto > 0) {
  //                       addTableRow(row.id, row.monto, "haber");
  //                     }
  //                   });

  //                   // Guardar el ID de la cuenta de IVA para el rebalanceo
  //                   const ivaAccountId = dtv.data.codigo_sii != '110' ? (resp[1]?.id || null) : null;

  //                   // Rebalancear automáticamente después de cargar todas las filas
  //                   setTimeout(() => {
  //                     console.log("[DTV] Iniciando rebalanceo automático, IVA Account ID:", ivaAccountId);
  //                     updateTotals();
  //                     rebalanceHaberContraDebe(ivaAccountId);
  //                   }, 800);
  //                   // **Función para agregar una fila a la tabla**


  //                 } else {
  //                   reject()
  //                   toastr.warning(
  //                     "No es posible emitir documento. El cliente no tiene un RUT válido ingresado."
  //                   );
  //                 }

  //                 filasHaber.forEach(row => {
  //                   if (row.monto > 0) {
  //                     addTableRow(row.id, row.monto, "haber");
  //                   }
  //                 });

  //                 updateTotals()
  //                 // **Función para agregar una fila a la tabla**


  //               } else {
  //                 reject()
  //                 toastr.warning(
  //                   "No es posible emitir documento. El cliente no tiene un RUT válido ingresado."
  //                 );
  //               }
  //             } else {
  //               reject()

  //               if (currency.code == "PEN") {
  //                 toastr.warning(
  //                   "No es posible emitir el documento. El cliente no tiene RUC registrado."
  //                 );
  //               } else {
  //                 toastr.warning(
  //                   "No es posible emitir el documento. El cliente no tiene un RUT registrado."
  //                 );
  //               }
  //             }

  //           }

  //           saveAction(continueAction, params)
  //             .then(() => {
  //               console.log('Después de guardar y ejecutar continueAction');
  //             })
  //             .catch(() => {
  //               console.log("Error guardando");
  //             });


  //         });
  //       }

  //       const saveDtvManual = () => {
  //         return new Promise((resolve, reject) => {

  //           let continueAction = () => {

  //             unaBase.ui.unblock();

  //             var rut = $('[name="contacto[info][rut]"]').val();
  //             rut = unaBase.data.rut.format(rut);
  //             if (rut != "" || unaBase.parametros.facturar_sin_rut) {
  //               var rut_valido = true;
  //               if (currency.code == "CLP" || currency.code == "") {
  //                 rut_valido = unaBase.data.rut.validate(rut);
  //               }

  //               // cuando el doc es de tipo exportacion = 78 no hace la validacion de rut, ya que es rut extranjero
  //               if (
  //                 rut_valido ||
  //                 dtv.data.id_tipo_doc == "78" ||
  //                 dtv.data.id_tipo_doc == "35" ||
  //                 dtv.data.id_tipo_doc == "97" ||
  //                 dtv.data.id_tipo_doc == "1003" ||
  //                 dtv.data.id_tipo_doc == "1004" ||
  //                 dtv.data.id_tipo_doc == "1002"
  //               ) {
  //                 var id = $("#sheet-dtv").data("id");

  //                 /*var htmlObjectFolio = $('<section> \
  //                   <span>Por favor confirmar folio</span><br><br> \
  //                   <input required type="number" name="folio" min="1" step="1" style="border: 1px solid lightgrey;"> \
  //                 </section>');*/

  //                 var htmlObjectFolio = $(
  //                   '<section> \
  //                       <span>Por favor confirmar folio</span><br><br> \
  //                       <input required type="text" name="folio_siguiente" style="border: 1px solid lightgrey;"> \
  //                     </section>'
  //                 );


  //                 // var folio = $("section#sheet-dtv").data("new-index");
  //                 // htmlObjectFolio.find("input").val(folio);

  //                 htmlObjectFolio.find("input").on("blur change", function () {
  //                   htmlObjectFolio.data("response", $(this).val());
  //                 });

  //                 var htmlObjectFecha = $(
  //                   '<section> \
  //                       <span>Por favor confirmar fecha</span><br><br> \
  //                       <input required type="date" name="fecha" style="border: 1px solid lightgrey;"> \
  //                     </section>'
  //                 );

  //                 var fecha = $('input[name="fecha_emision"]').val();
  //                 var year = fecha.substring(6, 10);
  //                 var month = fecha.substring(3, 5);
  //                 var day = fecha.substring(0, 2);

  //                 htmlObjectFecha
  //                   .find("input")
  //                   .val(year + "-" + month + "-" + day);

  //                 htmlObjectFecha.find("input").on("blur change", function () {
  //                   htmlObjectFecha.data("response", $(this).val());
  //                 });

  //                 var tipo_factura = $('input[name="des_tipo_doc"]').val();

  //                 prompt(htmlObjectFolio).done(function (data) {

  //                   if (data !== false)
  //                     prompt(htmlObjectFecha).done(function (subdata) {
  //                       if (subdata !== false) {

  //                         $.ajax({
  //                           // url: '/4DACTION/_V3_set' + params.entity,
  //                           url: "/4DACTION/_V3_generadtv_manual",
  //                           data: {
  //                             id: id,
  //                             folio: data,
  //                             fecha: subdata,
  //                             tipo_factura: tipo_factura
  //                           },
  //                           async: false,
  //                           dataType: "json",
  //                           type: "POST"
  //                         }).done(function (data) {

  //                           if (data.success) {

  //                             var year = data.date.substring(0, 4);
  //                             var month = data.date.substring(5, 7);
  //                             var day = data.date.substring(8, 10);

  //                             $("#sheet-dtv")
  //                               .find('span[data-name="folio"]')
  //                               .text(data.index);
  //                             $("#sheet-dtv")
  //                               .find('span[data-name="fecha_emision"]')
  //                               .text(day + "-" + month + "-" + year);
  //                             $("#sheet-dtv")
  //                               .find('span[data-name="estado"]')
  //                               .text("EMITIDA");
  //                             $("#sheet-dtv")
  //                               .find('input[name="folio"]')
  //                               .val(data.index);
  //                             $("#sheet-dtv")
  //                               .find('input[name="fecha_emision"]')
  //                               .val(day + "-" + month + "-" + year);
  //                             // falta cambiar fecha de vencimiento
  //                             $("#menu")
  //                               .find('[data-name="dtv_emitir_manual"]')
  //                               .hide();
  //                             $("#menu")
  //                               .find('[data-name="dtv_emitir_electronico"]')
  //                               .hide();
  //                             $("#sheet-dtv")
  //                               .find("button.edit")
  //                               .hide();
  //                             // $('#sheet-dtv').find('input.edit, textarea.edit').prop('readonly', true).removeClass('datepicker');
  //                             // se mofifica para que no quede bloqueada la observación al emitir manual
  //                             $("#sheet-dtv")
  //                               .find("input.edit")
  //                               .prop("readonly", true)
  //                               .removeClass("datepicker");
  //                             $("#sheet-dtv table.items")
  //                               .find("input")
  //                               .prop("readonly", true);
  //                             toastr.success(
  //                               "Factura emitida con éxito (Folio " +
  //                               data.index +
  //                               ")"
  //                             );

  //                             unaBase.inbox.send({
  //                               subject:
  //                                 "Ha emitido Factura de venta Nº " +
  //                                 data.index +
  //                                 " / " +
  //                                 $(
  //                                   '#sheet-dtv span[data-name="referencia"]'
  //                                 ).text(),
  //                               into: "viewport",
  //                               href:
  //                                 "/v3/views/dtv/content.shtml?id=" +
  //                                 $("#sheet-dtv").data("id"),
  //                               tag: "avisos"
  //                             });

  //                             if (accountingMode && access._670) {

  //                               unaBase.loadInto.dialog(
  //                                 '/v3/views/dtc/dialog/confirmacion_Comprobante.shtml?id=' + dtv.id + '&tipoDocRef=DTV',
  //                                 "Confirmar cuenta contable",
  //                                 "x-large"
  //                               )

  //                             } else {

  //                               if (!unaBase.parametros.sap_integration) {
  //                                 unaBase.history.back();

  //                               } else
  //                                 unaBase.utilities.saveDataSap('dtv')
  //                             }

  //                             resolve()
  //                           } else {
  //                             toastr.warning(
  //                               data.errorMsg.replaceAll(/SL/g, '<br>')
  //                             );
  //                           }
  //                         });
  //                       }
  //                     });
  //                 });
  //               } else {
  //                 reject()
  //                 toastr.warning(
  //                   "No es posible emitir documento. El cliente no tiene un RUT válido ingresado."
  //                 );
  //               }
  //             } else {
  //               reject()

  //               if (currency.code == "PEN") {
  //                 toastr.warning(
  //                   "No es posible emitir el documento. El cliente no tiene RUC registrado."
  //                 );
  //               } else {
  //                 toastr.warning(
  //                   "No es posible emitir el documento. El cliente no tiene un RUT registrado."
  //                 );
  //               }
  //             }

  //           }

  //           saveAction(continueAction, params)
  //             .then(res => {

  //               console.log('despues de guardar')

  //             }).catch(err => {
  //               reject()
  //             });

  //         });
  //       }


  //       if (unaBase.parametros.new_dtv_accounting) {
  //         saveDtvManualConReparto()
  //           .then(async res => {
  //             unaBase.ui.unblock();


  //           })
  //           .catch(error => {
  //             console.log("errrorrroororor");
  //           });




  //       } else {

  //         saveDtvManual()
  //           .then(res => {
  //             unaBase.ui.unblock();
  //             console.log("Guardado!!!");
  //           })
  //           .catch(error => {
  //             console.log("errrorrroororor");
  //           });

  //       }


  //     }
  //   });
  // }

  if ($.inArray("dtv_emitir_manual", params.buttons) != -1) {
    buttons.push({
      name: "dtv_emitir_manual",
      icon: "ui-icon-document",
      caption: "Emitir manual",
      action: async function () {

        const saveDtvManualConReparto = () => {
          return new Promise((resolve, reject) => {

            let continueAction = async () => {
              unaBase.ui.unblock();

              var rut = $('[name="contacto[info][rut]"]').val();
              rut = unaBase.data.rut.format(rut);
              if (rut != "" || unaBase.parametros.facturar_sin_rut) {
                var rut_valido = true;
                if (currency.code == "CLP" || currency.code == "") {
                  rut_valido = unaBase.data.rut.validate(rut);
                }

                // cuando el doc es de tipo exportacion = 78 no hace la validacion de rut, ya que es rut extranjero
                if (
                  rut_valido ||
                  dtv.data.id_tipo_doc == "78" ||
                  dtv.data.id_tipo_doc == "35" ||
                  dtv.data.id_tipo_doc == "97" ||
                  dtv.data.id_tipo_doc == "1003" ||
                  dtv.data.id_tipo_doc == "1004" ||
                  dtv.data.id_tipo_doc == "1002"
                ) {
                  var id = $("#sheet-dtv").data("id");

                  const resDtv = await dtv.getDataDtv(id)
                  const today = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD'

                  const fechaEmisionInput = document.querySelector('#sheet-dtv input[name="fecha_emision"]');

                  let fechaEmision = fechaEmisionInput ? fechaEmisionInput.value : "";

                  function parseFecha(fecha) {
                    if (!fecha || !/^\d{2}-\d{2}-\d{4}$/.test(fecha)) return null;
                    const [day, month, year] = fecha.split("-");
                    const isoDate = `${year}-${month}-${day}`; // YYYY-MM-DD
                    return isoDate;
                  }

                  const parsedFecha_ = parseFecha(fechaEmision);
                  const parsedFecha = parsedFecha_ || today;
                  const contentModal = `
                <div class="container-table-accounting-dtv">
                  <div class="row p2 container-folio-dtv"><p>Por favor confirme folio: <input class="folio-facturar-dtv" type="text" value="${resDtv.folio_siguiente}"></p>
                  <p>Fecha: <input class="date-facturar-dtv" type="date" value="${parsedFecha}" ></p></div>
                  <table class="table detail-accounting-dtv">
                    <thead>
                      <tr>
                        <th>Acción</th>
                        <th>Cuenta Contable</th>
                        <th>Debe</th>
                        <th>Haber</th>
                      </tr>
                    </thead>
                    <tbody id="cuentasTableBody">
                      <!-- Filas dinámicas aquí -->
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colspan="2"><strong>Total:</strong></td>
                        <td><span id="total-debe" class="input-align-right">0.00</span></td>
                        <td><span id="total-haber" class="input-align-right">0.00</span></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>`;


                  // Inicializa el modal
                  initModalCustomDtvAccounting("Crear asiento contable DTV", contentModal, 'manual');


                  // Obtener cuentas contables y ordenar aqui es felipe
                  let resp = await getCuentasContables();
                  let dtvItem = resp.items
                  resp = ordenarPorCuentaContable(resp.rows);
                  
                  const parseMontoSeguro = monto => parseFloat(monto) || 0;
                  const totalDebeBase = parseMontoSeguro(dtv.data.montos.total);
                  addTableRow(resp[0]?.id || 0, totalDebeBase, "debe"); // Primera fila: Total

                  const filasHaber = [];
                  if (dtv.data.codigo_sii != '110') {
                    filasHaber.push({
                      id: resp[1]?.id || 0,
                      monto: parseMontoSeguro(dtv.data.montos.iva),
                      locked: true
                    });
                  }

                  // ==========================================================
                  // HABER (solo cuentas de detalle = las que empiezan con "3"),
                  // agrupado y ajustado para que Debe = Haber.
                  // - 1xx (Debe): ya se agrega arriba con totalDebeBase
                  // - 2xx (IVA): ya se agrega arriba con dtv.data.montos.iva
                  // - Detalle (3xx): son las ÚNICAS filas “de negocio” que se muestran
                  // - Todo lo demás (4xx u otros): NO se muestra; se "absorbe" en una 3xx
                  //   para que el asiento cierre exacto.
                  // ==========================================================

                  // Guarda el detalle agrupado por cuenta contable (solo las que parten con "3")
                  const detallePorCuenta = {};

                  // Montos que NO son detalle (no parten con "3"): se absorberán para cuadrar
                  let montoAAbsorberParaCuadrar = 0;

                  // Recorremos ítems devueltos por _force_getAccounting
                  dtvItem.forEach(item => {
                    const codigoCuenta = String(item.cuenta_item || "").trim();
                    const montoItem = parseFloat(item.subtotal_item || 0) || 0;

                    if (!codigoCuenta || montoItem === 0) return;

                    // Cuentas de detalle = las que empiezan con "3" (son las únicas que mostraremos)
                    if (codigoCuenta.startsWith("3")) {
                      if (!detallePorCuenta[codigoCuenta]) {
                        detallePorCuenta[codigoCuenta] = {
                          codigoCuenta,
                          idCuenta: item.id_cuenta,
                          montoOriginal: 0
                        };
                      }
                      detallePorCuenta[codigoCuenta].montoOriginal += montoItem;
                    } else {
                      // 4xx u otras: NO se muestran, pero se consideran para cuadrar
                      montoAAbsorberParaCuadrar += montoItem;
                    }
                  });


                  // ------------------------------------------------------------------
                  // Sumar las cuentas de detalle (3xx) en HABER
                  // ------------------------------------------------------------------

                  // Total bruto del documento (Debe en 1xx)
                  const totalCod100 = (dtv.data.codigo_sii != '110') ? parseMontoSeguro(dtv.data.montos.iva) : 0;

                  // El “neto” que debe quedar repartido en las cuentas de detalle:
                  // neto = total - IVA
                  const netoQueDebeRepartirseEnDetalle = totalDebeBase - totalCod100;

                  // Lista de cuentas de detalle (agrupadas) ordenada por monto (para absorber en la más grande)
                  const detalleOrdenado = Object.values(detallePorCuenta)
                    .filter(x => (parseFloat(x.montoOriginal) || 0) > 0)
                    .sort((a, b) => (parseFloat(b.montoOriginal) || 0) - (parseFloat(a.montoOriginal) || 0));

                  // Total original del detalle (antes de aplicar el ajuste %)
                  const totalDetalleOriginal = detalleOrdenado.reduce(
                    (acc, x) => acc + (parseFloat(x.montoOriginal) || 0),
                    0
                  );

                  // Factor de ajuste proporcional
                  // Ej: si el neto real es 50% del original, esto queda ~0.5
                  // Se resta lo que se va a absorber aparte, para que el reparto sea correcto.
                  const factorAjusteDetalle = totalDetalleOriginal > 0
                    ? ((netoQueDebeRepartirseEnDetalle - montoAAbsorberParaCuadrar) / totalDetalleOriginal)
                    : 0;

                  // -------------------------------------------------------
                  // Generar filas HABER: SOLO detalle (3xx), ya ajustado
                  // -------------------------------------------------------
                  detalleOrdenado.forEach((filaDetalle, index) => {
                    // Reparto proporcional del detalle
                    let montoFinal = parseMontoSeguro(filaDetalle.montoOriginal) * factorAjusteDetalle;

                    // Absorción: todo lo NO-detalle se suma a UNA cuenta detalle (la más grande)
                    // Esto fuerza que Debe y Haber cierren exacto.
                    if (index === 0 && montoAAbsorberParaCuadrar !== 0) {
                      montoFinal += montoAAbsorberParaCuadrar;
                    }

                    // redondeo para evitar decimales raros
                    montoFinal = Math.round(montoFinal);

                    if (montoFinal > 0) {
                      filasHaber.push({
                        id: filaDetalle.idCuenta,
                        monto: montoFinal,
                        locked: false
                      });
                    }
                  });

                  // NO aplicar rebalanceo aquí - lo haremos después de cargar las filas
                  filasHaber.forEach(row => {
                    if (row.monto > 0) {
                      addTableRow(row.id, row.monto, "haber");
                    }
                  });

                  // Guardar el ID de la cuenta de IVA para el rebalanceo
                  const ivaAccountId = dtv.data.codigo_sii != '110' ? (resp[1]?.id || null) : null;

                  // Rebalancear automáticamente después de cargar todas las filas
                  setTimeout(() => {
                    updateTotals();
                    rebalanceHaberContraDebe(ivaAccountId);
                  }, 800);
                  // **Función para agregar una fila a la tabla**


                } else {
                  reject()
                  toastr.warning(
                    "No es posible emitir documento. El cliente no tiene un RUT válido ingresado."
                  );
                }
              } else {
                reject()

                if (currency.code == "PEN") {
                  toastr.warning(
                    "No es posible emitir el documento. El cliente no tiene RUC registrado."
                  );
                } else {
                  toastr.warning(
                    "No es posible emitir el documento. El cliente no tiene un RUT registrado."
                  );
                }
              }

            }

            saveAction(continueAction, params)
              .then(() => {
                console.log('Después de guardar y ejecutar continueAction');
              })
              .catch(() => {
                console.log("Error guardando");
              });


          });
        }

        const saveDtvManual = () => {
          return new Promise((resolve, reject) => {

            let continueAction = () => {

              unaBase.ui.unblock();

              var rut = $('[name="contacto[info][rut]"]').val();
              rut = unaBase.data.rut.format(rut);
              if (rut != "" || unaBase.parametros.facturar_sin_rut) {
                var rut_valido = true;
                if (currency.code == "CLP" || currency.code == "") {
                  rut_valido = unaBase.data.rut.validate(rut);
                }

                // cuando el doc es de tipo exportacion = 78 no hace la validacion de rut, ya que es rut extranjero
                if (
                  rut_valido ||
                  dtv.data.id_tipo_doc == "78" ||
                  dtv.data.id_tipo_doc == "35" ||
                  dtv.data.id_tipo_doc == "97" ||
                  dtv.data.id_tipo_doc == "1003" ||
                  dtv.data.id_tipo_doc == "1004" ||
                  dtv.data.id_tipo_doc == "1002"
                ) {
                  var id = $("#sheet-dtv").data("id");

                  /*var htmlObjectFolio = $('<section> \
                    <span>Por favor confirmar folio</span><br><br> \
                    <input required type="number" name="folio" min="1" step="1" style="border: 1px solid lightgrey;"> \
                  </section>');*/

                  var htmlObjectFolio = $(
                    '<section> \
                      <span>Por favor confirmar folio</span><br><br> \
                      <input required type="text" name="folio_siguiente" style="border: 1px solid lightgrey;"> \
                    </section>'
                  );


                  // var folio = $("section#sheet-dtv").data("new-index");
                  // htmlObjectFolio.find("input").val(folio);

                  htmlObjectFolio.find("input").on("blur change", function () {
                    htmlObjectFolio.data("response", $(this).val());
                  });

                  var htmlObjectFecha = $(
                    '<section> \
                      <span>Por favor confirmar fecha</span><br><br> \
                      <input required type="date" name="fecha" style="border: 1px solid lightgrey;"> \
                    </section>'
                  );

                  var fecha = $('input[name="fecha_emision"]').val();
                  var year = fecha.substring(6, 10);
                  var month = fecha.substring(3, 5);
                  var day = fecha.substring(0, 2);

                  htmlObjectFecha
                    .find("input")
                    .val(year + "-" + month + "-" + day);

                  htmlObjectFecha.find("input").on("blur change", function () {
                    htmlObjectFecha.data("response", $(this).val());
                  });

                  var tipo_factura = $('input[name="des_tipo_doc"]').val();

                  prompt(htmlObjectFolio).done(function (data) {

                    if (data !== false)
                      prompt(htmlObjectFecha).done(function (subdata) {
                        if (subdata !== false) {

                          $.ajax({
                            // url: '/4DACTION/_V3_set' + params.entity,
                            url: "/4DACTION/_V3_generadtv_manual",
                            data: {
                              id: id,
                              folio: data,
                              fecha: subdata,
                              tipo_factura: tipo_factura
                            },
                            async: false,
                            dataType: "json",
                            type: "POST"
                          }).done(function (data) {

                            if (data.success) {

                              var year = data.date.substring(0, 4);
                              var month = data.date.substring(5, 7);
                              var day = data.date.substring(8, 10);

                              $("#sheet-dtv")
                                .find('span[data-name="folio"]')
                                .text(data.index);
                              $("#sheet-dtv")
                                .find('span[data-name="fecha_emision"]')
                                .text(day + "-" + month + "-" + year);
                              $("#sheet-dtv")
                                .find('span[data-name="estado"]')
                                .text("EMITIDA");
                              $("#sheet-dtv")
                                .find('input[name="folio"]')
                                .val(data.index);
                              $("#sheet-dtv")
                                .find('input[name="fecha_emision"]')
                                .val(day + "-" + month + "-" + year);
                              // falta cambiar fecha de vencimiento
                              $("#menu")
                                .find('[data-name="dtv_emitir_manual"]')
                                .hide();
                              $("#menu")
                                .find('[data-name="dtv_emitir_electronico"]')
                                .hide();
                              $("#sheet-dtv")
                                .find("button.edit")
                                .hide();
                              // $('#sheet-dtv').find('input.edit, textarea.edit').prop('readonly', true).removeClass('datepicker');
                              // se mofifica para que no quede bloqueada la observación al emitir manual
                              $("#sheet-dtv")
                                .find("input.edit")
                                .prop("readonly", true)
                                .removeClass("datepicker");
                              $("#sheet-dtv table.items")
                                .find("input")
                                .prop("readonly", true);
                              toastr.success(
                                "Factura emitida con éxito (Folio " +
                                data.index +
                                ")"
                              );

                              unaBase.inbox.send({
                                subject:
                                  "Ha emitido Factura de venta Nº " +
                                  data.index +
                                  " / " +
                                  $(
                                    '#sheet-dtv span[data-name="referencia"]'
                                  ).text(),
                                into: "viewport",
                                href:
                                  "/v3/views/dtv/content.shtml?id=" +
                                  $("#sheet-dtv").data("id"),
                                tag: "avisos"
                              });

                              if (accountingMode && access._670) {

                                unaBase.loadInto.dialog(
                                  '/v3/views/dtc/dialog/confirmacion_Comprobante.shtml?id=' + dtv.id + '&tipoDocRef=DTV',
                                  "Confirmar cuenta contable",
                                  "x-large"
                                )

                              } else {

                                if (!unaBase.parametros.sap_integration) {
                                  unaBase.history.back();

                                } else
                                  unaBase.utilities.saveDataSap('dtv')
                              }

                              resolve()
                            } else {
                              toastr.warning(
                                data.errorMsg.replaceAll(/SL/g, '<br>')
                              );
                            }
                          });
                        }
                      });
                  });
                } else {
                  reject()
                  toastr.warning(
                    "No es posible emitir documento. El cliente no tiene un RUT válido ingresado."
                  );
                }
              } else {
                reject()

                if (currency.code == "PEN") {
                  toastr.warning(
                    "No es posible emitir el documento. El cliente no tiene RUC registrado."
                  );
                } else {
                  toastr.warning(
                    "No es posible emitir el documento. El cliente no tiene un RUT registrado."
                  );
                }
              }

            }

            saveAction(continueAction, params)
              .then(res => {

                console.log('despues de guardar')

              }).catch(err => {
                reject()
              });

          });
        }


        if (unaBase.parametros.new_dtv_accounting) {
          saveDtvManualConReparto()
            .then(async res => {
              unaBase.ui.unblock();


            })
            .catch(error => {
              console.log("errrorrroororor");
            });




        } else {

          saveDtvManual()
            .then(res => {
              unaBase.ui.unblock();
              console.log("Guardado!!!");
            })
            .catch(error => {
              console.log("errrorrroororor");
            });

        }


      }
    });
  }

  if ($.inArray("dtv_emitir_electronico", params.buttons) != -1) {
    // Facturacion.cl
    buttons.push({
      name: "dtv_emitir_electronico",
      icon: "ui-icon-document",
      caption: "Emitir electrónico",
      action: function () {
        const actionModalCustom = async () => {
          // 0. Mostrar loading lo antes posible
          unaBase.ui.block();
          let blockTimeout = setTimeout(() => {
            unaBase.ui.unblock();
            toastr.warning("El proceso está tardando más de lo habitual. Intenta nuevamente si no termina.");
          }, 30000);

          setTimeout(async () => {
            try {
              // 1. Recoger filas y preparar datos
              const rows = document.querySelectorAll("#cuentasTableBody tr");
              const id = document.querySelector("#sheet-dtv").dataset.id;
              const asientoData = [];

              const montoTotalFactura = parseFloat(dtv.data.montos.total) || 0;
              let totalDebe = 0;
              let totalHaber = 0;
              let valid = true;

              // 2. Validar cada fila y construir asientoData
              rows.forEach((row, idx) => {
                const cuentaContable = row.querySelector(".cuenta-contable")?.value?.trim();
                const debeVal = row.querySelector(".input-debe")?.value?.replaceAll(".", "");
                const haberVal = row.querySelector(".input-haber")?.value?.replaceAll(".", "");
                const debe = parseFloat(debeVal) || 0;
                const haber = parseFloat(haberVal) || 0;

                if (!cuentaContable || (!debe && !haber) || (debe && haber)) {
                  valid = false;
                  toastr.error(`Fila #${idx + 1}: Debe tener cuenta contable y solo un valor en Debe o Haber.`);
                  console.log(`Fila inválida #${idx + 1}`, { cuentaContable, debe, haber });
                  return;
                }
                totalDebe += debe;
                totalHaber += haber;
                asientoData.push({ cuenta: cuentaContable, debe, haber, tipodoc: "DTV", iddoc: id });
              });

              // 3. Validaciones de montos y filas
              if (totalDebe > montoTotalFactura || totalHaber > montoTotalFactura) {
                toastr.error(`Total Debe (${totalDebe}) o Haber (${totalHaber}) no puede ser mayor al monto de la factura (${montoTotalFactura}).`);
                console.log("Validación de montos fallida", { totalDebe, totalHaber, montoTotalFactura });
                return;
              }
              if (asientoData.length === 0 || !valid) {
                toastr.error("Debes agregar al menos una cuenta válida.");
                return;
              }

              // 4. Validaciones previas a emitir DTV
              let rut = $('[name="contacto[info][rut]"]').val();
              rut = unaBase.data.rut.format(rut);
              if (!rut || !unaBase.data.rut.validate(rut)) {
                toastr.warning("No es posible emitir documento. El cliente no tiene un RUT válido ingresado.");
                return;
              }

              let giro = $('input[name="contacto[info][giro]"]').val();
              if (giro.length > 40) {
                alert("El giro del cliente es demasiado largo (máximo 40 caracteres). Modifica la ficha del cliente.");
                return;
              }

              // 5. Preparar input de fecha
              let htmlObjectFecha = $('<section>\
                    <span>Por favor confirmar fecha</span><br><br>\
                    <input required type="date" name="fecha" style="border: 1px solid lightgrey;">\
                  </section>');

              let fecha = $('input[name="fecha_emision"]').val();
              let year = fecha.substring(6, 10);
              let month = fecha.substring(3, 5);
              let day = fecha.substring(0, 2);

              htmlObjectFecha.find("input").val(`${year}-${month}-${day}`);
              htmlObjectFecha.find("input").on("blur change", function () {
                htmlObjectFecha.data("response", $(this).val());
              });

              let tipo_factura = $('input[name="des_tipo_doc"]').val();
              let fechaemision = htmlObjectFecha.find("input").val();

              // Validar rango de fecha (no más de 10 días)
              let f1 = new Date(fechaemision);
              let f2 = new Date();
              let resta = Math.abs(Math.round((f1 - f2) / (1000 * 60 * 60 * 24)));
              if (resta > 10) {
                toastr.warning("La fecha de emision no puede superar los 10 días de diferencia con la fecha actual");
                return;
              }

              // 6. Emitir electrónicamente el DTV
              const emitirDTV = () =>
                new Promise((resolve, reject) => {
                  $.ajax({
                    url: "/4DACTION/_V3_generadtv_electronico",
                    data: { id, fecha: fechaemision, tipo_factura },
                    async: false,
                    dataType: "json",
                    type: "POST"
                  }).done((data) => {
                    if (data.success) {
                      // Actualizar interfaz
                      let year = data.date.substring(0, 4);
                      let month = data.date.substring(5, 7);
                      let day = data.date.substring(8, 10);

                      $("#sheet-dtv").find('span[data-name="folio"]').text(data.index);
                      $("#sheet-dtv").find('span[data-name="fecha_emision"]').text(`${day}-${month}-${year}`);
                      $("#sheet-dtv").find('span[data-name="estado"]').text("EMITIDA");
                      $("#sheet-dtv").find('input[name="folio"]').val(data.index);
                      $("#sheet-dtv").find('input[name="fecha_emision"]').val(`${day}-${month}-${year}`);
                      $("#menu").find('[data-name="dtv_emitir_manual"]').hide();
                      $("#menu").find('[data-name="dtv_emitir_electronico"]').hide();
                      $("#menu").find('[data-name="dtv_pdf_electronico"]').show();
                      $("#sheet-dtv").find("button.edit").hide();
                      $("#sheet-dtv").find("input.edit, textarea.edit").prop("readonly", true).removeClass("datepicker");
                      $("#sheet-dtv table.items").find("input").prop("readonly", true);

                      toastr.success(`Factura emitida con éxito (Folio ${data.index})`);
                      unaBase.inbox.send({
                        subject: `Ha emitido Factura de venta Nº ${data.index} / ${$('#sheet-dtv span[data-name="referencia"]').text()}`,
                        into: "viewport",
                        href: `/v3/views/dtv/content.shtml?id=${$("#sheet-dtv").data("id")}`,
                        tag: "avisos"
                      });

                      unaBase.loadInto.viewport(`/v3/views/dtv/content.shtml?id=${dtv.id}`, undefined, undefined, true);

                      $.ajax({
                        url: "/4DACTION/_V3_downloadDtv",
                        data: { id: dtv.id, cedible: false },
                        async: false,
                        success: (data) => {
                          window.open(data);
                        }
                      });

                      resolve();
                    } else {
                      unaBase.ui.unblock();
                      toastr.warning("Error:\n\n" + data.error);
                      reject("Error al emitir DTV: " + data.error);
                    }
                  }).fail((jqXHR, textStatus, errorThrown) => {
                    toastr.error("Error de red al emitir DTV");
                    reject(`Ajax error: ${textStatus}`);
                  });
                });

              try {
                await emitirDTV(); // <- SOLO si es exitoso, sigue
              } catch (err) {
                console.error("Error en emisión DTV:", err);
                toastr.error("No se pudo emitir la factura electrónica. No se creó el asiento contable.");
                return;
              }

              // 7. Ahora sí, crear asiento contable
              const config = {
                method: "post",
                url: `${nodeUrl}/create-asiento-contable?type=dtv&sid=${unaBase.sid.encoded()}&hostname=${window.location.origin}`,
                data: asientoData
              };
              console.log("Enviando asientoData:", asientoData);
              const response = await axios(config);

              if (!response.data.success) {
                toastr.error("No se pudo crear el asiento contable.");
                console.log("Respuesta fallo:", response.data);
                return;
              }

              toastr.success("Asiento contable creado correctamente.");
              // Cerrar modal y recargar vista
              document.querySelector("#modalCustom").style.display = "none";
              unaBase.loadInto.viewport(`/v3/views/dtv/content.shtml?id=${id}`, undefined, undefined, true);

            } catch (error) {
              console.error("Error general:", error);
              toastr.error("Error inesperado en el proceso.");
            } finally {
              clearTimeout(blockTimeout);
              unaBase.ui.unblock();
            }
          }, 50); // <--- Este timeout asegura que el loading SIEMPRE aparezca
        };





        //AQUI
        const saveDtvManualConReparto = () => {
          return new Promise((resolve, reject) => {

            let continueAction = async () => {
              unaBase.ui.unblock();

              var rut = $('[name="contacto[info][rut]"]').val();
              rut = unaBase.data.rut.format(rut);
              if (rut != "" || unaBase.parametros.facturar_sin_rut) {
                var rut_valido = true;
                if (currency.code == "CLP" || currency.code == "") {
                  rut_valido = unaBase.data.rut.validate(rut);
                }
                // cuando el doc es de tipo exportacion = 78 no hace la validacion de rut, ya que es rut extranjero
                if (
                  rut_valido ||
                  dtv.data.id_tipo_doc == "78" ||
                  dtv.data.id_tipo_doc == "35" ||
                  dtv.data.id_tipo_doc == "97" ||
                  dtv.data.id_tipo_doc == "1003" ||
                  dtv.data.id_tipo_doc == "1004" ||
                  dtv.data.id_tipo_doc == "1002"
                ) {
                  var id = $("#sheet-dtv").data("id");

                  const resDtv = await dtv.getDataDtv(id)
                  const today = new Date().toISOString().split("T")[0];
                  const contentModal = `
              <div class="container-table-accounting-dtv">
                <div class="row p2 container-folio-dtv"><p>Por favor confirme folio: <input class="folio-facturar-dtv" type="text" value="${resDtv.folio_siguiente}"></p>
                <p>Fecha: <input class="date-facturar-dtv" type="date" value="${today}" ></p></div>
                <table class="table detail-accounting-dtv">
                  <thead>
                    <tr>
                      <th>Contacto</th>
                      <th>Cuenta Contable</th>
                      <th>Debe</th>
                      <th>Haber</th>
                    </tr>
                  </thead>
                  <tbody id="cuentasTableBody">
                    <!-- Filas dinámicas aquí -->
                  </tbody>
                  <tfoot>
                    <tr>
                      <td></td>
                      <td colspan="2"><strong>Total:</strong></td>
                      <td><span id="total-debe" class="input-align-right">0.00</span></td>
                      <td><span id="total-haber" class="input-align-right">0.00</span></td>
                    </tr>
                  </tfoot>
                </table>
              </div>`;


                  // Inicializa el modal
                  initModalCustomDtvAccounting("Crear asiento contable DTV", contentModal, actionModalCustom);

                  console.log("[DTV MODAL CON REPARTO] ✅ Modal inicializado - Cargando cuentas contables...");

                  // Obtener cuentas contables y ordenar
                  let resp = await getCuentasContables();
                  resp = ordenarPorCuentaContable(resp.rows);

                  // **Agregar las 3 primeras filas con valores de Total, IVA y Neto**
                  const parseMontoSeguro = monto => parseFloat(monto) || 0;
                  const totalDebeBase = parseMontoSeguro(dtv.data.montos.total);
                  addTableRow(resp[0]?.id || 0, totalDebeBase, "debe"); // Primera fila: Total

                  const filasHaber = [
                    {
                      id: resp[1]?.id || 0,
                      monto: parseMontoSeguro(dtv.data.montos.iva),
                      locked: true
                    },
                    {
                      id: resp[2]?.id || 0,
                      monto: parseMontoSeguro(dtv.data.montos.neto),
                      locked: false
                    }
                  ];

                  // NO aplicar rebalanceo aquí - lo haremos después de cargar las filas
                  filasHaber.forEach(row => {
                    if (row.monto > 0) {
                      addTableRow(row.id, row.monto, "haber");
                    }
                  });

                  // Guardar el ID de la cuenta de IVA para el rebalanceo
                  const ivaAccountId = resp[1]?.id || null;

                  // Rebalancear automáticamente después de cargar todas las filas
                  setTimeout(() => {
                    console.log("[DTV Con Reparto] Iniciando rebalanceo automático, IVA Account ID:", ivaAccountId);
                    updateTotals();
                    rebalanceHaberContraDebe(ivaAccountId);
                  }, 800);
                  // **Función para agregar una fila a la tabla**


                } else {
                  reject()
                  toastr.warning(
                    "No es posible emitir documento. El cliente no tiene un RUT válido ingresado."
                  );
                }
              } else {
                reject()

                if (currency.code == "PEN") {
                  toastr.warning(
                    "No es posible emitir el documento. El cliente no tiene RUC registrado."
                  );
                } else {
                  toastr.warning(
                    "No es posible emitir el documento. El cliente no tiene un RUT registrado."
                  );
                }
              }

            }

            saveAction(continueAction, params)
              .then(() => {
                console.log('Después de guardar y ejecutar continueAction');
              })
              .catch(() => {
                console.log("Error guardando");
              });


          });
        }


        const saveDtvElectronico = () => {
          return new Promise((resolve, reject) => {
            let continueAction = () => {
              return new Promise((resolve, reject) => {
                let errDtv = false;


                var rut = $('[name="contacto[info][rut]"]').val();
                rut = unaBase.data.rut.format(rut);
                if (rut != "" && unaBase.data.rut.validate(rut)) {
                  var gironow = $('input[name="contacto[info][giro]"]').val();

                  if (gironow.length > 40) {
                    alert(
                      "El giro del cliente es demasiado largo (máximo permitido 40 caracteres). Por favor modificar información desde la ficha del cliente, y luego enviar."
                    );
                    errDtv = true;
                    reject
                  } else {
                    var id = $("#sheet-dtv").data("id");

                    var htmlObjectFecha = $(
                      '<section> \
                            <span>Por favor confirmar fecha</span><br><br> \
                            <input required type="date" name="fecha" style="border: 1px solid lightgrey;"> \
                          </section>'
                    );

                    var fecha = $('input[name="fecha_emision"]').val();
                    var year = fecha.substring(6, 10);
                    var month = fecha.substring(3, 5);
                    var day = fecha.substring(0, 2);

                    htmlObjectFecha
                      .find("input")
                      .val(year + "-" + month + "-" + day);

                    htmlObjectFecha.find("input").on("blur change", function () {
                      htmlObjectFecha.data("response", $(this).val());
                    });

                    var tipo_factura = $('input[name="des_tipo_doc"]').val();

                    prompt(htmlObjectFecha).done(function (data) {
                      if (data !== false) {


                        let f1 = new Date(data);
                        var today = new Date();
                        var dd = String(today.getDate()).padStart(2, '0');
                        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                        var yyyy = today.getFullYear();

                        let f2 = new Date(mm + '-' + dd + '-' + yyyy);


                        let resta = f1.getTime() - f2.getTime();
                        resta = Math.round(resta / (1000 * 60 * 60 * 24));
                        resta = Math.abs(resta);


                        if (resta <= 10) {

                          $.ajax({
                            // url: '/4DACTION/_V3_set' + params.entity,
                            url: "/4DACTION/_V3_generadtv_electronico",
                            data: {
                              id: id,
                              fecha: data,
                              tipo_factura: tipo_factura
                            },
                            async: false,
                            dataType: "json",
                            type: "POST"
                          }).done(function (data) {

                            if (data.success) {

                              var year = data.date.substring(0, 4);
                              var month = data.date.substring(5, 7);
                              var day = data.date.substring(8, 10);

                              $("#sheet-dtv")
                                .find('span[data-name="folio"]')
                                .text(data.index);
                              $("#sheet-dtv")
                                .find('span[data-name="fecha_emision"]')
                                .text(day + "-" + month + "-" + year);
                              $("#sheet-dtv")
                                .find('span[data-name="estado"]')
                                .text("EMITIDA");
                              $("#sheet-dtv")
                                .find('input[name="folio"]')
                                .val(data.index);
                              $("#sheet-dtv")
                                .find('input[name="fecha_emision"]')
                                .val(day + "-" + month + "-" + year);
                              // falta cambiar fecha de vencimiento
                              $("#menu")
                                .find('[data-name="dtv_emitir_manual"]')
                                .hide();
                              $("#menu")
                                .find('[data-name="dtv_emitir_electronico"]')
                                .hide();
                              $("#menu")
                                .find('[data-name="dtv_pdf_electronico"]')
                                .show();
                              $("#sheet-dtv")
                                .find("button.edit")
                                .hide();
                              $("#sheet-dtv")
                                .find("input.edit, textarea.edit")
                                .prop("readonly", true)
                                .removeClass("datepicker");
                              $("#sheet-dtv table.items")
                                .find("input")
                                .prop("readonly", true);
                              toastr.success(
                                "Factura emitida con éxito (Folio " +
                                data.index +
                                ")"
                              );

                              unaBase.inbox.send({
                                subject:
                                  "Ha emitido Factura de venta Nº " +
                                  data.index +
                                  " / " +
                                  $(
                                    '#sheet-dtv span[data-name="referencia"]'
                                  ).text(),
                                into: "viewport",
                                href:
                                  "/v3/views/dtv/content.shtml?id=" +
                                  $("#sheet-dtv").data("id"),
                                tag: "avisos"
                              });
                              //let iddtv2 = dtv.id;
                              unaBase.loadInto.viewport(
                                "/v3/views/dtv/content.shtml?id=" + dtv.id,
                                undefined,
                                undefined,
                                true
                              );

                              $.ajax({
                                url: "/4DACTION/_V3_downloadDtv",
                                data: {
                                  id: dtv.id,
                                  cedible: false
                                },
                                async: false,
                                success: function (data) {
                                  window.open(data);
                                }
                              });



                            } else {

                              errDtv = true
                              reject()

                            }
                            if (errDtv == false) {

                              if (accountingMode && access._670) {
                                unaBase.ui.unblock();
                                unaBase.loadInto.dialog(
                                  '/v3/views/dtc/dialog/confirmacion_Comprobante.shtml?id=' + dtv.id + '&tipoDocRef=DTV',
                                  "Confirmar cuenta contable",
                                  "x-large"
                                )
                              } else {
                                unaBase.ui.unblock();
                                unaBase.history.back();
                              }
                            } else {
                              unaBase.ui.unblock();
                              toastr.warning("Error:\n\n" + data.error);
                            }

                          });



                        } else {
                          toastr.warning("La fecha de emision no puede superar los 10 dias de diferencia con la fecha actual");
                          reject()
                        }





                      } else {
                        errDtv = true;
                        reject()
                      }

                    });
                  }
                } else {

                  toastr.warning(
                    "No es posible emitir documento. El cliente no tiene un RUT válido ingresado."
                  );
                  reject
                }
              });
            }

            saveAction(continueAction, params, true)
              .then(res => {

                console.log('despues de guardar DTV')

                // if (unaBase.parametros.sap_integration) {
                //   unaBase.utilities.saveDataSap('dtv')
                // }

              }).catch(err => {
                console.log(`Error: ${error}`);
                reject()
              });
          })
        }

        
        if (unaBase.parametros.new_dtv_accounting) {
          saveDtvManualConReparto()
            .then(async res => {
              unaBase.ui.unblock();


            })
            .catch(error => {
              console.log("errrorrroororor");
            });

        } else {

          saveDtvElectronico()
            .then(res => {
              unaBase.ui.unblock();
              console.log("Guardado!!!");
            })
            .catch(error => {
              console.log("errrorrroororor");
            });
        }





      }

    });



    if ($.inArray("dtv_emitir_bsale", params.buttons) != -1) {
      if (unaBase.parametros.token_bsale && unaBase.parametros.token_bsale != '') {

        buttons.push({
          name: "dtv_emitir_bsale",
          icon: "ui-icon-document",
          caption: "Emitir BSale",
          action: function () {
            upModalBsale()
          }

        });
      }
    }


    // Plane
    buttons.push({
      name: "dtv_emitir_electronico_plane",
      icon: "ui-icon-document",
      caption: "Emitir electrónico (Plane)",
      action: function () {
        var rut = $('[name="contacto[info][rut]"]').val();
        rut = unaBase.data.rut.format(rut);
        if (rut != "" && unaBase.data.rut.validate(rut)) {
          var gironow = $('input[name="contacto[info][giro]"]').val();

          if (gironow.length > 40) {
            alert(
              "El giro del cliente es demasiado largo (máximo permitido 40 caracteres). Por favor modificar información desde la ficha del cliente, y luego enviar."
            );
          } else {
            var id = $("#sheet-dtv").data("id");

            var htmlObjectFecha = $(
              '<section> \
                <span>Por favor confirmar fecha</span><br><br> \
                <input required type="date" name="fecha" style="border: 1px solid lightgrey;"> \
              </section>'
            );

            var fecha = $('input[name="fecha_emision"]').val();
            var year = fecha.substring(6, 10);
            var month = fecha.substring(3, 5);
            var day = fecha.substring(0, 2);

            htmlObjectFecha
              .find("input")
              .val(year + "-" + month + "-" + day);

            htmlObjectFecha.find("input").on("blur change", function () {
              htmlObjectFecha.data("response", $(this).val());
            });

            var tipo_factura = $('input[name="des_tipo_doc"]').val();

            prompt(htmlObjectFecha).done(function (data) {
              if (data !== false) {
                $.ajax({
                  // url: '/4DACTION/_V3_set' + params.entity,
                  url: "/4DACTION/_V3_generadtv_electronico",
                  data: {
                    id: id,
                    fecha: data,
                    tipo_factura: tipo_factura
                  },
                  dataType: "json",
                  type: "POST"
                }).done(function (data) {
                  if (data.success) {
                    var year = data.date.substring(0, 4);
                    var month = data.date.substring(5, 7);
                    var day = data.date.substring(8, 10);

                    $("#sheet-dtv")
                      .find('span[data-name="folio"]')
                      .text(data.index);
                    $("#sheet-dtv")
                      .find('span[data-name="fecha_emision"]')
                      .text(day + "-" + month + "-" + year);
                    $("#sheet-dtv")
                      .find('span[data-name="estado"]')
                      .text("EMITIDA");
                    $("#sheet-dtv")
                      .find('input[name="folio"]')
                      .val(data.index);
                    $("#sheet-dtv")
                      .find('input[name="fecha_emision"]')
                      .val(day + "-" + month + "-" + year);
                    // falta cambiar fecha de vencimiento
                    $("#menu")
                      .find('[data-name="dtv_emitir_manual"]')
                      .hide();
                    $("#menu")
                      .find('[data-name="dtv_emitir_electronico"]')
                      .hide();
                    $("#menu")
                      .find('[data-name="dtv_pdf_electronico"]')
                      .show();
                    $("#sheet-dtv")
                      .find("button.edit")
                      .hide();
                    $("#sheet-dtv")
                      .find("input.edit, textarea.edit")
                      .prop("readonly", true)
                      .removeClass("datepicker");
                    $("#sheet-dtv table.items")
                      .find("input")
                      .prop("readonly", true);
                    toastr.success(
                      "Factura emitida con éxito (Folio " +
                      data.index +
                      ")"
                    );

                    unaBase.inbox.send({
                      subject:
                        "Ha emitido Factura de venta Nº " +
                        data.index +
                        " / " +
                        $(
                          '#sheet-dtv span[data-name="referencia"]'
                        ).text(),
                      into: "viewport",
                      href:
                        "/v3/views/dtv/content.shtml?id=" +
                        $("#sheet-dtv").data("id"),
                      tag: "avisos"
                    });

                    $.ajax({
                      url: "/4DACTION/_V3_downloadDtv",
                      data: {
                        id: $("#sheet-dtv").data("id"),
                        cedible: false
                      },
                      success: function (data) {
                        window.open(data);
                      }
                    });
                  } else {
                    toastr.warning("Error:\n\n" + data.error);
                  }
                });
              }
            });
          }
        } else {
          toastr.warning(
            "No es posible emitir documento. El cliente no tiene un RUT válido ingresado."
          );
        }
      }
    });
  }

  if ($.inArray("dtv_nc_emitir_manual", params.buttons) != -1)
    buttons.push({
      name: "dtv_nc_emitir_manual",
      icon: "ui-icon-document",
      caption: "Emitir manual",
      action: function () {
        let continueAction = () => {

          var rut = $('[name="contacto[info][rut]"]').val();
          rut = unaBase.data.rut.format(rut);

          var rut_valido = true;
          if (currency.code != "PEN") {
            rut_valido = unaBase.data.rut.validate(rut);
          }

          if (rut_valido || notas.data.id_tipo_doc == "1004") {
            var id = notas.id;

            var htmlObjectFolio = $(
              '<section> \
                <span>Por favor confirmar folio</span><br><br> \
                <input required type="text" name="folio" style="border: 1px solid lightgrey;"> \
              </section>'
            );

            htmlObjectFolio.find("input").val(notas.data.next_folio);
            htmlObjectFolio.find("input").on("blur change", function () {
              htmlObjectFolio.data("response", $(this).val());
            });

            var htmlObjectFecha = $(
              '<section> \
                <span>Por favor confirmar fecha</span><br><br> \
                <input required class="datepicker" type="date" name="fecha" style="border: 1px solid lightgrey;"> \
              </section>'
            );

            htmlObjectFecha.find("input").val(notas.data.current_date);
            htmlObjectFecha.find("input").on("blur change", function () {
              htmlObjectFecha.data("response", $(this).val());
            });

            prompt(htmlObjectFolio).done(function (data) {
              if (data !== false)
                prompt(htmlObjectFecha).done(function (subdata) {
                  if (subdata !== false) {
                    const tipo_nc = $('#sheet-notas').data('type')
                    const url = tipo_nc == 'nc' ? "/4DACTION/_V3_generadtv_nc_manual" : "/4DACTION/_V3_generadtv_nd_manual"

                    $.ajax({
                      url: url,
                      data: {
                        id: id,
                        folio: data,
                        fecha: subdata,
                        tipo_nc: notas.data.des_tipo_doc
                      },
                      dataType: "json",
                      type: "POST"
                    }).done(function (data) {
                      if (data.success) {
                        notas.data.folio = data.index;
                        notas.data.fecha_emision = data.date;
                        notas.container
                          .find('span[data-name="folio"]')
                          .text(notas.data.folio);
                        notas.container
                          .find('span[data-name="fecha_emision"]')
                          .text(notas.data.fecha_emision);
                        notas.container
                          .find('span[data-name="estado"]')
                          .text("EMITIDA");
                        notas.container
                          .find('input[name="folio"]')
                          .val(notas.data.folio);
                        notas.container
                          .find('input[name="fecha_emision"]')
                          .val(notas.data.fecha_emision);
                        notas.display();
                        toastr.success(
                          "Nota de crédito emitida con éxito (Folio " +
                          notas.data.folio +
                          ")"
                        );
                        /*unaBase.inbox.send({
                          subject: 'Ha emitido Nota de crédito Nº ' + notas.data.folio + ' / ' + notas.data.referencia,
                          into: 'viewport',
                          href: '/v3/views/dtv/nc/content.shtml?id=' + notas.id,
                          tag: 'avisos'
                        });*/
                        unaBase.loadInto.viewport(`/v3/views/dtv/${tipo_nc}/content.shtml?id=${id}`, undefined, undefined, true);
                      } else {
                        toastr.warning("Error al emitir NC: " + data?.errorMsg);
                      }
                    });
                  }
                });
            });
          } else {
            toastr.warning(
              "No es posible emitir el documento. El cliente no tiene un RUT válido ingresado."
            );
          }
        }

        saveAction({}, params)
          .then(res => {

            console.log('despues de guardar')

            continueAction()

          }).catch(err => {

          });
      }
    });

  if ($.inArray("dtv_nc_emitir_bsale", params.buttons) != -1) {
    if (unaBase.parametros.token_bsale && unaBase.parametros.token_bsale != '') {
      buttons.push({
        name: "dtv_emitir_bsale",
        icon: "ui-icon-document",
        caption: "Emitir BSale",
        action: function () {
          upModalBsale()
        }

      });
    }
  }
  if ($.inArray("dtv_nc_emitir_electronico", params.buttons) != -1)
    buttons.push({
      name: "dtv_nc_emitir_electronico",
      icon: "ui-icon-document",
      caption: "Emitir electrónico",
      action: function () {



        let continueAction = () => {
          var rut = $('[name="contacto[info][rut]"]').val();
          rut = unaBase.data.rut.format(rut);

          if (rut != "" && unaBase.data.rut.validate(rut)) {
            var gironow = $('input[name="contacto[info][giro]"]').val();

            if (gironow.length > 40) {
              alert(
                "El giro del cliente es demasiado largo (máximo permitido 40 caracteres). Por favor modificar información desde la ficha del cliente, y luego enviar."
              );
            } else {
              var id = notas.id;

              var htmlObjectFecha = $(
                '<section> \
                   <span>Por favor confirmar fecha</span><br><br> \
                   <input required type="date" name="fecha" style="border: 1px solid lightgrey;"> \
                 </section>'
              );

              var fecha = $('input[name="fecha_emision"]').val();
              var year = fecha.substring(6, 10);
              var month = fecha.substring(3, 5);
              var day = fecha.substring(0, 2);

              htmlObjectFecha
                .find("input")
                .val(year + "-" + month + "-" + day);

              htmlObjectFecha.find("input").on("blur change", function () {
                htmlObjectFecha.data("response", $(this).val());
              });

              var tipo_nc = $('input[name="des_tipo_doc"]').val();

              prompt(htmlObjectFecha).done(function (data) {
                if (data !== false) {


                  let f1 = new Date(data);
                  var today = new Date();
                  var dd = String(today.getDate()).padStart(2, '0');
                  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                  var yyyy = today.getFullYear();

                  let f2 = new Date(mm + '-' + dd + '-' + yyyy);


                  let resta = f1.getTime() - f2.getTime();
                  resta = Math.round(resta / (1000 * 60 * 60 * 24));
                  resta = Math.abs(resta);


                  if (resta <= 10) {
                    $.ajax({
                      url: "/4DACTION/_V3_generadtv_nc_electronico",
                      data: {
                        id: id,
                        fecha: data,
                        tipo_nc: tipo_nc
                      },
                      dataType: "json",
                      type: "POST"
                    }).done(function (data) {
                      if (data.success) {
                        notas.data.folio = data.index;
                        notas.data.fecha_emision = data.date;
                        notas.container
                          .find('span[data-name="folio"]')
                          .text(notas.data.folio);
                        notas.container
                          .find('span[data-name="fecha_emision"]')
                          .text(notas.data.fecha_emision);
                        notas.container
                          .find('span[data-name="estado"]')
                          .text("EMITIDA");
                        notas.container
                          .find('input[name="folio"]')
                          .val(notas.data.folio);
                        notas.container
                          .find('input[name="fecha_emision"]')
                          .val(notas.data.fecha_emision);
                        notas.display();
                        toastr.success(
                          "Nota de crédito emitida con éxito (Folio " +
                          notas.data.folio +
                          ")"
                        );
                        $.ajax({
                          url: "/4DACTION/_V3_downloadDtvNC",
                          data: {
                            id: notas.id,
                            cedible: false
                          },
                          success: function (data) {
                            window.open(data);
                          }
                        });
                      } else {
                        toastr.warning("Error:\n\n" + data.error);
                      }
                    });

                  }
                  else {
                    toastr.warning(
                      "La fecha de emision no puede superar los 10 dias de diferencia con la fecha actual"
                    );
                  }



                }
              });
            }
          } else {
            toastr.warning(
              "No es posible emitir el documento. El cliente no tiene un RUT válido ingresado."
            );
          }
        }
        saveAction({}, params)
          .then(res => {

            console.log('despues de guardar')
            continueAction()

          }).catch(err => {
          });
      }
    });

  if ($.inArray("dtv_pdf_electronico", params.buttons) != -1)
    buttons.push({
      name: "dtv_pdf_electronico",
      icon: "ui-icon-document",
      caption: "Descargar documento electrónico",
      action: function () {
        var id = $("#sheet-dtv").data("id");

        confirm(
          "Por favor indique la copia del documento",
          "Original",
          "Cedible"
        ).done(function (data) {
          unaBase.ui.block();

          if (data === true) {
            $.ajax({
              url: "/4DACTION/_V3_downloadDtv",
              data: {
                id: id,
                cedible: false
              },
              success: function (data) {

                unaBase.ui.unblock();
                const url = data;

                if (url.startsWith("https://")) {
                  console.log("La URL es HTTPS");
                  window.open(url, '_blank');
                } else if (url.startsWith("http://")) {
                  console.log("La URL es HTTP");
                  window.open(data.replace(/http/g, "https"));
                } else {
                  console.log("La URL no es ni HTTP ni HTTPS");
                }


              },
              error: function (error) {
                unaBase.ui.unblock();
                toastr.error("Ha ocurrido un error, intentelo nuevamente.")
              }
            });
          }
          if (data === false) {
            $.ajax({
              url: "/4DACTION/_V3_downloadDtv",
              data: {
                id: id,
                cedible: true
              },
              success: function (data) {
                window.open(data.replace(/http/g, "https"));
              }
            });
          }
        });
      }
    });

  if ($.inArray("dtv_pdf_electronico_FEPE", params.buttons) != -1)
    buttons.push({
      name: "dtv_pdf_electronico_FEPE",
      icon: "ui-icon-document",
      caption: "Descargar PDF + XML",
      action: function () {
        dtv.getFiles();
      }
    });

  if ($.inArray("dtv_pdf_electronico_FEPE_NC", params.buttons) != -1)
    buttons.push({
      name: "dtv_pdf_electronico_FEPE_NC",
      icon: "ui-icon-document",
      caption: "Descargar PDF + XML",
      action: function () {
        notas.getFiles();
      }
    });

  if ($.inArray("dtv_pdf_electronico_bsale", params.buttons) != -1) {
    buttons.push({
      name: "dtv_pdf_electronico_bsale",
      icon: "ui-icon-document",
      caption: "Descargar PDF bSale",
      action: function () {

        let url = ''
        if (params.entity == 'NcVentas') {
          url = notas.data.urlPdfbsale

        }


        if (params.entity == 'Dtv') {
          url = dtv.data.urlPdfbsale

        }

        let download = window.open(url);
        download.blur();
        window.focus();


      }
    });
  }

  if ($.inArray("dtv_nc_pdf_electronico", params.buttons) != -1)
    buttons.push({
      name: "dtv_nc_pdf_electronico",
      icon: "ui-icon-document",
      caption: "Descargar documento electrónico",
      action: function () {
        var id = notas.id;
        confirm(
          "Por favor indique la copia del documento",
          "Original",
          "Cedible"
        ).done(function (data) {
          if (data === true) {
            $.ajax({
              url: "/4DACTION/_V3_downloadDtvNC",
              data: {
                id: id,
                cedible: false
              },
              success: function (data) {
                window.open(data.replace(/http/g, "https"));
              }
            });
          }
          if (data === false) {
            $.ajax({
              url: "/4DACTION/_V3_downloadDtvNC",
              data: {
                id: id,
                cedible: true
              },
              success: function (data) {
                window.open(data.replace(/http/g, "https"));
              }
            });
          }
        });
      }
    });

  /* BEGIN: Reglas de validación */

  if ($.inArray("new_rv", params.buttons) != -1)
    buttons.push({
      name: "new_rv",
      icon: "ui-icon-document",
      caption: "Crear",
      action: function () {
        $.ajax({
          url: "/4DACTION/_V3_set" + params.entity,
          dataType: "json",
          type: "POST"
        }).done(function (data) {
          unaBase.loadInto.viewport(
            "/v3/views/ajustes/validaciones/content.shtml?id=" + data.id
          );
        });
      }
    });

  if ($.inArray("delete_rv", params.buttons) != -1)
    buttons.push({
      name: "delete_rv",
      icon: "ui-icon-trash",
      caption: "Eliminar",
      action: function () {
        confirm(MSG.get("CONFIRM_VALIDACION_DELETE")).done(function (
          data
        ) {
          if (data) {
            $.ajax({
              url: "/4DACTION/_V3_remove" + params.entity,
              dataType: "json",
              data: {
                id: params.data().id
              },
              success: function (data) {
                if (data.success) {
                  toastr.info(NOTIFY.get("SUCCESS_DELETE_VALIDACION"));
                  // unaBase.loadInto.viewport(
                  //   "/v3/views/ajustes/validaciones/list.shtml"
                  // );
                  $('li[data-name="exit"] button').trigger('click');
                } else {
                  if (data.opened) {
                    if (data.readonly)
                      toastr.error(
                        NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                      );
                  }
                }
              },
              error: function (xhr, text, error) {
                toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
              }
            });
          }
        });
      }
    });

  /* END: Reglas de validación */

  /* BEGIN: Validaciones */

  if ($.inArray("validate", params.buttons) != -1) {
    buttons.push(
      {
        name: "validate_send",
        icon: "ui-icon-info",
        caption: "Solicitar validación",
        action: function () {
          //initLogValidacion();
          let continueAction = () => {
            $.ajax({
              url: "/4DACTION/_V3_setLogValidacion",
              data: {
                table: $("section.sheet").data("entity"),
                id_record: $("section.sheet").data("id"),
                index_record: $("section.sheet").data("index"),
                ref_record: $("section.sheet")
                  .find("[data-text]")
                  .val(),
                clear: true
              },
              dataType: "json",
              async: false,
              success: function (data) {

                if (data.success) {
                  initLogValidacion(true);
                  toastr.success(NOTIFY.get("SUCCESS_VALIDACION_REQUEST"));
                  $('#menu > ul > li[data-name="validate_request"]').hide();



                  unaBase.log.save(
                    "Ha solicitado validación",
                    "cotizaciones",
                    $("section.sheet").data("index"),
                    $("section.sheet").data("id")
                  );
                } else toastr.error(NOTIFY.get("ERROR_RECORD_READONLY"));
              }
            });
          }

          saveAction(continueAction, params)

        }
      },
      {
        name: "validate_request",
        icon: "ui-icon-info",
        caption: "Reiniciar validación",
        action: function () {
          switch (params.entity) {
            case "Cotizacion":

              deferReglaValidacion =
                typeof deferReglaValidacion == "undefined"
                  ? false
                  : deferReglaValidacion;
              if (deferReglaValidacion)
                $.ajax({
                  url: "/4DACTION/_V3_setCotizacion",
                  data: {
                    id: $("section.sheet").data("id"),
                    "cotizacion[approved]": false
                  },
                  async: false,
                  dataType: "json",
                  success: function (data) {
                    $.ajax({
                      url: "/4DACTION/_V3_setLogValidacion",
                      data: {
                        table: $("section.sheet").data("entity"),
                        id_record: $("section.sheet").data("id"),
                        index_record: $("section.sheet").data("index"),
                        ref_record: $("section.sheet")
                          .find("[data-text]")
                          .val(),
                        clear: true,
                        async: false,
                      },
                      dataType: "json",
                      success: function (subdata) {
                        unaBase.loadInto.viewport(
                          "/v3/views/" +
                          $("section.sheet").data("module") +
                          "/content.shtml?id=" +
                          $("section.sheet").data("id"),
                          undefined,
                          undefined,
                          true
                        );
                        unaBase.log.save(
                          "Ha reiniciado el proceso de validación",
                          "cotizaciones",
                          $("section.sheet").data("index"),
                          $("section.sheet").data("id")
                        );
                      }
                    });
                  }
                });
              else {
                $.ajax({
                  url: "/4DACTION/_V3_setCotizacion",
                  data: {
                    id: $("section.sheet").data("id"),
                    "cotizacion[approved]": false
                  },
                  async: false,
                  dataType: "json",
                  success: function (supdata) {
                    $("section.sheet").data("approved", false);
                    $("section.sheet")
                      .find("input, textarea, tr button, tr span")
                      .prop("disabled", false);
                    $("section.sheet")
                      .find(
                        "tr button, tr span.ui-icon, ul.editable button, footer button"
                      )
                      .show();
                    $("nav.toolbox")
                      .find(' \
                        [data-name="discard"] \
                      ')
                      .show();

                    $(".validation-status").text("No validada");

                    $.ajax({
                      url: "/4DACTION/_V3_setLogValidacion",
                      data: {
                        table: $("section.sheet").data("entity"),
                        id_record: $("section.sheet").data("id"),
                        index_record: $("section.sheet").data("index"),
                        ref_record: $("section.sheet")
                          .find("[data-text]")
                          .val(),
                        clear: true,
                        async: false,
                      },
                      dataType: "json",
                      success: function (data) {
                        if (data.success) {
                          //refreshLogValidacion(true);
                          initLogValidacion();
                          toastr.success(
                            NOTIFY.get("SUCCESS_VALIDACION_REQUEST")
                          );
                          $(
                            '#menu > ul > li[data-name="validate_request"]'
                          ).hide();

                          /*$.ajax({
                            url: '/4DACTION/_V3_getLogValidacionByIndex',
                            data: {
                              index: $('section.sheet').data('entity') + '|' + $('section.sheet').data('id')
                            },
                            dataType: 'json',
                            success: function(subdata) {
                              var record_name = $('section.sheet').data('record-name');
                              $.each(subdata.rows,  function(key, entry) {
                                unaBase.email.notify(entry.username, 'validation_request', record_name, entry.record.index, entry.record.text, null, $('section.sheet').data('module') + '/content.shtml', entry.record.id);
                                unaBase.inbox.send({
                                  to: entry.username,
                                  //subject: 'Solicita validar ' + record_name + ' Nº ' + entry.record.index + ' / ' + entry.record.text,
                                  subject: 'Solicita validar ' + record_name + ' Nº ' + entry.record.index + ' / ' + entry.record.text,
                                  into: 'viewport',
                                  href: '/v3/views/'+ $('section.sheet').data('module') + '/content.shtml?id=' + entry.record.id,
                                  tag: 'solicitudes'
                                });
                              });
                              unaBase.loadInto.viewport('/v3/views/' + $('section.sheet').data('module') + '/content.shtml?id=' + $('section.sheet').data('id'), undefined, undefined, true);
                            }
                          });*/

                          unaBase.log.save(
                            "Ha reiniciado el proceso de validación",
                            "cotizaciones",
                            $("section.sheet").data("index"),
                            $("section.sheet").data("id")
                          );
                        } else
                          toastr.error(
                            NOTIFY.get("ERROR_RECORD_READONLY")
                          );
                      }
                    });
                  }
                });
              }
              break;
            case "Compras":
              // al pasar por acá, se deben borrar las reglas de validación y habilitar la OC para que sea modificada
              // de este modo, al guardar la OC se general la solicitud de validaciòn de forma automàtica

              $.ajax({
                url: "/4DACTION/_V3_setLogValidacion",
                data: {
                  table: $("section.sheet").data("entity"),
                  id_record: $("section.sheet").data("id"),
                  index_record: $("section.sheet").data("index"),
                  ref_record: $("section.sheet")
                    .find("[data-text]")
                    .val(),
                  clear: true,
                  async: false,
                },
                dataType: "json",
                success: function (subdata) {
                  unaBase.log.save(
                    "Ha reiniciado el proceso de validación",
                    "compras",
                    $("section.sheet").data("index"),
                    $("section.sheet").data("id")
                  );
                  unaBase.loadInto.viewport(
                    "/v3/views/compras/content.shtml?id=" +
                    $("section.sheet").data("id") +
                    "&edit=true",
                    undefined,
                    undefined,
                    true
                  );
                }
              });

              break;
            case "OT":
              // al pasar por acá, se deben borrar las reglas de validación y habilitar la OC para que sea modificada
              // de este modo, al guardar la OC se general la solicitud de validaciòn de forma automàtica

              $.ajax({
                url: "/4DACTION/_V3_setLogValidacion",
                data: {
                  table: "OT",
                  id_record: ot.id,
                  index_record: ot.index,
                  ref_record: ot.ref,
                  clear: true,
                  async: false,
                },
                dataType: "json",
                success: function (subdata) {
                  ot_refresh_permissions();
                  unaBase.log.save(
                    "Ha reiniciado el proceso de validación",
                    "ot",
                    ot.index,
                    ot.id
                  );
                  location.href =
                    "/ot.shtml?id=" + ot.id + "&r=" + Math.random();
                }
              });

              break;
          }
        }
      },
      {
        name: "validate_v2",
        icon: "ui-icon-circle-check",
        caption: "Validar (V2)",
        action: function () {
          if (access._650) {
            $.ajax({
              url: "/4DACTION/_V3_setCompras",
              data: {
                id: $("section.sheet").data("id"),
                "oc[approved]": true
              },
              dataType: "json",
              success: function (data) {
                if (data.success) {
                  $("section.sheet").data("validado", true);
                  $(
                    "section.sheet footer article p span:first-of-type"
                  ).text("Validada");

                  $("section.sheet button.add.dtc").visible();
                  $("section.sheet button.add.orden-pago").visible();
                  $("section.sheet button.add.cobro").visible();

                  toastr.success(NOTIFY.get("SUCCESS_VALIDACION_ACCEPT"));
                  $('#menu > ul > li[data-name="validate_v2"]').hide();
                  // Enviar correo validación aceptada
                  var username = $("html > body.menu.home > aside > div > div > h1").data(
                    "username"
                  );
                  var record_name = $(
                    'input[name="oc[tipo_gastos][des]"]'
                  ).val();
                  var index = $("section.sheet").data("index");
                  var text = $('input[name="oc[referencia]"]').val();
                  unaBase.email.notify(
                    username,
                    "validation_accepted",
                    record_name,
                    index,
                    text,
                    null,
                    "compras/content.shtml",
                    $("section.sheet").data("id")
                  );
                  unaBase.inbox.send({
                    to: username,
                    subject:
                      "Aceptó validar " +
                      record_name +
                      "Nº " +
                      index +
                      " / " +
                      text,
                    into: "viewport",
                    href:
                      "/v3/views/compras/content.shtml?id=" +
                      $("section.sheet").data("id"),
                    tag: "avisos"
                  });
                } else toastr.error(NOTIFY.get("ERROR_RECORD_READONLY"));
              }
            });

          }
        }
      }
    );
  }

  // Exceso en fxr
  if ($.inArray("approve_excess", params.buttons) != -1)
    buttons.push({
      name: "approve_excess",
      icon: "ui-icon-info",
      caption: "Validación adicional por exceso",
      action: function () {
        var exceso = $("section.sheet").data("exceso");
        confirm(
          "La rendición está excedida en $" +
          exceso +
          "<br>¿Desea validar el exceso?"
        ).done(function (data) {
          if (data) {
            $.ajax({
              url: "/4DACTION/_V3_setCompras",
              data: {
                id: $("section.sheet").data("id"),
                excedida: false
              },
              dataType: "json",
              success: function (data) {
                if (data.success) {
                  toastr.success("Rendición validada por exceso");
                  $('#menu > ul > li[data-name="approve_excess"]').hide();
                  $("section#sheet-compras").data("excedida", false);

                  unaBase.log.save(
                    "Ha validado rendición por exceso",
                    "compras",
                    $("section.sheet").data("index"),
                    $("section.sheet").data("id")
                  );
                } else toastr.error(NOTIFY.get("ERROR_RECORD_READONLY"));
              }
            });
          }
        });
      }
    });



  //-------------------------- terimna de agregar botones
  menu.find("ul > li").remove();
  menu
    .parentTo("header")
    .find("button")
    .not(":first-of-type")
    .not(".date")
    .not(".search-button")
    .not(".close-button")
    .remove();

  var button;
  // agrega botones al listado horizontal
  for (i in buttons) {
    if (buttons[i].name != "" && buttons[i].caption != "") {
      button = $(
        '<li data-name="' +
        buttons[i].name +
        '"><button>' +
        buttons[i].caption +
        "</button></li>"
      );
      menu.find("ul").append(button);
      menu
        .find("ul > li:last-of-type > button")
        .button({
          icons:
            typeof buttons[i].icon != "undefined"
              ? {
                primary: buttons[i].icon
              }
              : buttons[i].icons
        })
        .click(buttons[i].action);
    }
  }

  // TODO: Pasar al CSS el estilo de este botón
  button = $(
    '<button id="dropdown_launcher" class="dropdown-button more" style="display: inline-block; float: right;">Más...</button>'
  );
  button
    .button({
      icons: {
        primary: "ui-icon-gear",
        secondary: "ui-icon-triangle-1-s"
      },
      text: false
    })
    .hide();
  menu.parentTo("header").append(button);
  /*
  var dropdown = $('');
   
          $(dropdown).jui_dropdown({
          launcher_id: 'dropdown_launcher',
          launcher_container_id: 'dropdown_container',
          menu_id: 'dropdown_menu',
          containerClass: 'container1',
          menuClass: 'menu1',
          onSelect:  function(event, data) {
          $("#result").text('index: ' + data.index + ' (id: ' + data.id + ')');
          }
          });
  */
  menu.show();

  $("body").on("click", "*", function (event) {
    if (
      !$(event.target).hasClass("dropdown-button") &&
      !$(event.target)
        .parent()
        .hasClass("dropdown-button")
    )
      $(".dropdown-menu").hide();
  });


  function createMagicDust(event) {
    const button = event.currentTarget;
    for (let i = 0; i < 25; i++) {
      const dust = document.createElement('span');
      dust.classList.add('magic-dust');
      document.body.appendChild(dust);

      const rect = button.getBoundingClientRect();
      const x = rect.left + Math.random() * rect.width;
      const y = rect.top + Math.random() * rect.height;
      const offsetX = (Math.random() - 0.5) * 100;
      const offsetY = (Math.random() - 0.5) * 100;

      dust.style.left = `${x}px`;
      dust.style.top = `${y}px`;
      dust.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

      setTimeout(() => {
        dust.remove();
      }, 1500);
    }
  }

  function attachClickEventByDataName(dataName) {
    const listItem = document.querySelector(`li[data-name="${dataName}"]`);
    if (listItem) {

      const button = listItem.querySelector("button");
      if (button) {
        button.addEventListener("click", createMagicDust);
      }
    }
  }


  const buttonsEffect = ['create_gasto_from_oc', 'create_dtc', 'new', 'create_dtv', 'create_gasto_from_fxr', 'new_contact']

  buttonsEffect.forEach(b => {
    attachClickEventByDataName(b);
  })

}


const generalSaveAction = async (elementCobro, eventData, event, params) => {

  return new Promise((resolve, reject) => {


    // Si está en modo offline, deben actualizarse los cálculos
    if (typeof modoOffline !== "undefined" && params.entity == "ItemByCotizacion") {
      if (modoOffline) {
        unaBase.ui.block();
        /*$('table.items.cotizacion').find('tr.title').each(function(key, item) {
          var next = $(item).next();
          if (next.length > 0)
            updateSubtotalTitulos(next);
        });*/
        updateSubtotalItems();
        if (v3_sobrecargos_cinemagica && typeof formulario_cinemagica == "undefined") {
          //var porcentaje_utilidad_bruta = blockCinemagica.find('[name="sobrecargo[1][porcentaje]"]').data('value');
          //blockCinemagica.find('[name="sobrecargo[1][porcentaje]"]').trigger('focus').val(porcentaje_utilidad_bruta).trigger('blur');

          $("section.sheet").data("sync", true);
          var valor_pelicula = blockCinemagica
            .find('[name="sobrecargo[1][subtotal]"]')
            .data("old-value");
          blockCinemagica
            .find('[name="sobrecargo[1][subtotal]"]')
            .trigger("focus")
            .val(valor_pelicula)
            .trigger("blur");
          $("section.sheet").data("sync", false);
        }
      }
    }

    var success = false;
    var element = elementCobro;
    var sendValidar = false;



    var setData = async function (without_items, data) {

      return new Promise(async (resolve, reject) => {

        if (params.entity == "Cotizacion" || params.entity == "Negocios") {
          //simon itemparent verify start
          if (!params.presupuesto) {
            if (verifySubitems()) {
              fixSubitems();
            }

          }
          //simon itemparent verify end

          // Intentar guardar datos del contacto que puedieron no haber sido guardados manualmente
          if ($('button.edit.save.empresa').not(':hidden'))
            $('button.edit.save.empresa').trigger('click');
          if ($('button.edit.save.contacto').not(':hidden'))
            $('button.edit.save.contacto').trigger('click');

          // Logs en tiempo real
          var log = $("#main-container").data("realtime-log");
          var logMsg = [];
          if (log !== undefined) {
            for (var i = 0, len = log.length; i < len; i++) {
              var msg = "";
              if (log[i] !== undefined) {
                if (log[i]["old"] !== undefined && log[i]["new"] !== undefined) {
                  var isTitle = log[i]["new"]["title"];
                  if (
                    !isTitle &&
                    log[i]["old"]["categoria"]["id"] !=
                    log[i]["new"]["categoria"]["id"] &&
                    log[i]["old"]["dragged"] ===
                    log[i]["new"]["dropped"]
                  ) {
                    msg +=
                      "[ Movido a categoría: " +
                      unescape(
                        log[i]["new"]["categoria"]["nombre"]
                      ).toUpperCase() +
                      " ] ";
                  } else {
                    if (
                      log[i]["old"]["item[][nombre]"] !=
                      log[i]["new"]["item[][nombre]"]
                    ) {
                      msg +=
                        "[ Nombre nuevo: " +
                        unescape(
                          log[i]["new"]["item[][nombre]"]
                        ).toUpperCase() +
                        " ] ";
                    }
                    if (
                      log[i]["old"]["observacion"] !=
                      log[i]["new"]["observacion"]
                    ) {
                      msg +=
                        "[ Observación nueva: " +
                        unescape(
                          log[i]["new"]["observacion"]
                        ).substring(0, 32) +
                        "... ] ";
                    }
                    if (
                      log[i]["old"]["comentario"] !=
                      log[i]["new"]["comentario"]
                    ) {
                      msg +=
                        "[ Comentario nuevo: " +
                        unescape(
                          log[i]["new"]["comentario"]
                        ).substring(0, 32) +
                        "... ] ";
                    }
                    if (!isTitle) {
                      if (
                        log[i]["old"]["item[][tipo_documento]"] !=
                        log[i]["new"]["item[][tipo_documento]"]
                      ) {
                        msg +=
                          "[ Tipo documento: " +
                          log[i]["new"]["item[][tipo_documento]"] +
                          " ] ";
                      }
                      if (
                        log[i]["old"]["item[][cantidad]"] !=
                        log[i]["new"]["item[][cantidad]"]
                      ) {
                        msg +=
                          "[ Cantidad: " +
                          log[i]["old"]["item[][cantidad]"] +
                          "→" +
                          log[i]["new"]["item[][cantidad]"] +
                          " ] ";
                      }
                      if (
                        log[i]["old"]["item[][factor]"] !=
                        log[i]["new"]["item[][factor]"]
                      ) {
                        msg +=
                          "[ Días: " +
                          log[i]["old"]["item[][factor]"] +
                          "→" +
                          log[i]["new"]["item[][factor]"] +
                          " ] ";
                      }
                      if (
                        log[i]["old"]["item[][precio_unitario]"] !=
                        log[i]["new"]["item[][precio_unitario]"]
                      ) {
                        msg +=
                          "[ Precio unitario: " +
                          currency.symbol +
                          $.number(
                            parseFloat(
                              log[i]["old"]["item[][precio_unitario]"]
                            ),
                            currency.decimals,
                            ",",
                            "."
                          ) +
                          "→" +
                          currency.symbol +
                          $.number(
                            parseFloat(
                              log[i]["new"]["item[][precio_unitario]"]
                            ),
                            currency.decimals,
                            ",",
                            "."
                          ) +
                          " ] ";
                      }
                      if (
                        log[i]["old"]["item[][costo_unitario]"] !=
                        log[i]["new"]["item[][costo_unitario]"]
                      ) {
                        if (
                          log[i]["new"]["item[][costo_unitario]"] >
                          log[i]["new"]["item[][precio_unitario]"]
                        ) {
                          msg +=
                            "[ Gasto P. unitario: " +
                            currency.symbol +
                            $.number(
                              parseFloat(
                                log[i]["old"][
                                "item[][costo_unitario]"
                                ]
                              ),
                              currency.decimals,
                              ",",
                              "."
                            ) +
                            "→" +
                            currency.symbol +
                            $.number(
                              parseFloat(
                                log[i]["new"][
                                "item[][costo_unitario]"
                                ]
                              ),
                              currency.decimals,
                              ",",
                              "."
                            ) +
                            " ] ";
                        } else {
                          msg +=
                            "[ Gasto P. unitario: " +
                            currency.symbol +
                            $.number(
                              parseFloat(
                                log[i]["old"][
                                "item[][costo_unitario]"
                                ]
                              ),
                              currency.decimals,
                              ",",
                              "."
                            ) +
                            "→" +
                            currency.symbol +
                            $.number(
                              parseFloat(
                                log[i]["new"][
                                "item[][costo_unitario]"
                                ]
                              ),
                              currency.decimals,
                              ",",
                              "."
                            ) +
                            " ] ";
                        }
                      }
                      if (
                        log[i]["old"]["item[][aplica_sobrecargo]"] !=
                        log[i]["new"]["item[][aplica_sobrecargo]"]
                      ) {
                        msg +=
                          "[ Aplica sobrecargo: " +
                          (log[i]["new"]["item[][aplica_sobrecargo]"]
                            ? "Sí"
                            : "No") +
                          " ] ";
                      }
                      if (
                        log[i]["old"]["item[][costo_interno]"] !=
                        log[i]["new"]["item[][costo_interno]"]
                      ) {
                        msg +=
                          "[ Costo interno: " +
                          (log[i]["new"]["item[][costo_interno]"]
                            ? "Sí"
                            : "No") +
                          " ] ";
                      }
                      if (
                        log[i]["old"]["item[][ocultar_print]"] !=
                        log[i]["new"]["item[][ocultar_print]"]
                      ) {
                        msg +=
                          "[ Ocultar en impresión: " +
                          (log[i]["new"]["item[][ocultar_print]"]
                            ? "Sí"
                            : "No") +
                          " ] ";
                      }
                      if (
                        log[i]["old"][
                        "item[][mostrar_carta_cliente]"
                        ] !=
                        log[i]["new"]["item[][mostrar_carta_cliente]"]
                      ) {
                        msg +=
                          "[ Mostrar en carta cliente: " +
                          (log[i]["new"][
                            "item[][mostrar_carta_cliente]"
                          ]
                            ? "Sí"
                            : "No") +
                          " ] ";
                      }
                    }
                  }
                  msg =
                    "- Ha " +
                    (log[i]["new"]["cloned"]
                      ? "duplicado"
                      : "modificado") +
                    " " +
                    (isTitle
                      ? "categoría"
                      : "ítem " +
                      unescape(
                        log[i]["old"]["categoria"]["nombre"]
                      ).toUpperCase() +
                      " / ") +
                    " " +
                    unescape(
                      log[i]["old"]["item[][nombre]"]
                    ).toUpperCase() +
                    " " +
                    msg;
                } else {
                  if (
                    log[i]["old"] === undefined &&
                    log[i]["new"] !== undefined
                  ) {
                    var isTitle = log[i]["new"]["title"];
                    msg +=
                      "- Ha " +
                      (log[i]["new"]["cloned"]
                        ? "duplicado"
                        : "agregado") +
                      " " +
                      (isTitle
                        ? "categoría "
                        : "ítem " +
                        unescape(
                          log[i]["new"]["categoria"]["nombre"]
                        ).toUpperCase() +
                        " / ") +
                      unescape(
                        log[i]["new"]["item[][nombre]"]
                      ).toUpperCase() +
                      " ";
                    if (!isTitle) {
                      msg +=
                        "[ Cantidad: " +
                        log[i]["new"]["item[][cantidad]"] +
                        " ] ";
                      msg +=
                        "[ Días: " +
                        log[i]["new"]["item[][factor]"] +
                        " ] ";
                      msg +=
                        "[ Precio unitario: " +
                        currency.symbol +
                        $.number(
                          parseFloat(
                            log[i]["new"]["item[][precio_unitario]"]
                          ),
                          currency.decimals,
                          ",",
                          "."
                        ) +
                        " ] ";
                      msg +=
                        "[ Gasto P. unitario: " +
                        currency.symbol +
                        $.number(
                          parseFloat(
                            log[i]["new"]["item[][costo_unitario]"]
                          ),
                          currency.decimals,
                          ",",
                          "."
                        ) +
                        " ] ";
                    }
                  }
                  if (
                    log[i]["old"] !== undefined &&
                    log[i]["new"] === undefined &&
                    !log[i]["old"]["dragged"]
                  ) {
                    var isTitle = log[i]["old"]["title"];
                    msg +=
                      "- Ha quitado " +
                      (isTitle
                        ? "categoría "
                        : "ítem " +
                        unescape(
                          log[i]["old"]["categoria"]["nombre"]
                        ).toUpperCase() +
                        " / ") +
                      unescape(
                        log[i]["old"]["item[][nombre]"]
                      ).toUpperCase() +
                      " ";
                    if (!isTitle) {
                      msg +=
                        "[ Cantidad: " +
                        log[i]["old"]["item[][cantidad]"] +
                        " ] ";
                      msg +=
                        "[ Días: " +
                        log[i]["old"]["item[][factor]"] +
                        " ] ";
                      msg +=
                        "[ Precio unitario: " +
                        currency.symbol +
                        $.number(
                          parseFloat(
                            log[i]["old"]["item[][precio_unitario]"]
                          ),
                          currency.decimals,
                          ",",
                          "."
                        ) +
                        " ] ";
                      msg +=
                        "[ Gasto P. unitario: " +
                        currency.symbol +
                        $.number(
                          parseFloat(
                            log[i]["old"]["item[][costo_unitario]"]
                          ),
                          currency.decimals,
                          ",",
                          "."
                        ) +
                        " ] ";
                    }
                  }
                }
              }
              if (msg != "") {
                logMsg.push(msg);
              }
            }
            var modulo = "";
            switch (params.entity) {
              case "Cotizacion":
                modulo = "cotizaciones";
                break;
              case "Negocios":
                modulo = "negocios";
                break;
            }

            if (logMsg.length > 0) {
              unaBase.log.save(
                "[En estado " +
                params.entity.toLowerCase() +
                "] Ha hecho los siguientes cambios en ítems:\n" +
                logMsg.join("\n"),
                modulo,
                $("section.sheet").data("index")
              );
            }
            $("#main-container").removeData("realtime-log");
          }

          if (without_items) {
            $("table.items.cotizacion").data(
              "saved-without-items",
              true
            );
          }
        }

        if (params.entity == "Negocios" && !access._528 && autoriza_modificacion) {
          var abort = false;
          $.ajax({
            url: "/4DACTION/_V3_checkAutorizaNeg",
            data: {
              id: $("section.sheet").data("id")
            },
            dataType: "json",
            async: false,
            success: function (data) {
              if (!data.autorizado) {
                abort = true;
              } else {
                // expirar autorización tras el primer guardado
                $.ajax({
                  url: "/4DACTION/_V3_setAutorizacionByNegocio",
                  data: {
                    id: data.id,
                    accion_expirar: true
                  },
                  dataType: "json",
                  success: function (data) {
                    console.log(
                      "autorización expirada tras el primer guardado"
                    );
                  }
                });
              }
            }
          });
          if (abort) {
            toastr.warning(
              "La autorización para modificar el negocio ha expirado."
            );
            unaBase.ui.unblock();
            // mostrar nuevamente botón solicitar
            return false;
          }
        }

        $('[data-name="share"]').data("is-saved", false);

        const parseTimestamp = (timestamp) => {
          let date = new Date(timestamp);

          let dayOfWeek = date.toLocaleString('es-ES', { weekday: 'long' });
          let day = date.getDate();
          let month = date.toLocaleString('es-ES', { month: 'long' });
          let hour = date.getHours();
          let minute = date.getMinutes();

          day = day < 10 ? '0' + day : day;
          hour = hour < 10 ? '0' + hour : hour;
          minute = minute < 10 ? '0' + minute : minute;

          return `${dayOfWeek} ${day} de ${month} a las ${hour}:${minute} horas`;
        }


        const getData = async () => {
          //console.log(params.data());
          return await params.data()
        }

        let data4send = await getData()

        if (data4send != false) {

          // CONSULTAR SI EL PERIODO PUEDE SER MODIFICADO
          if (["Dtc", "Dtv"].includes(params.entity)) {
            const periodStatus = await getPeriods(data4send[defaultModuleProperties[params.entity]])
            if (periodStatus.closed) {
              unaBase.ui.unblock();
              toastr.warning(defaultMsgProperties[params.entity]);
              return
            }
          }

          //Verificar cuenta contable negocios
          if (unaBase.parametros.accounting_anticipos_contactos) {
            if (params.entity == 'Negocios') {
              const cuenta_ctble = document.getElementById('cuenta_contable_nv')
              if (cuenta_ctble && cuenta_ctble.value === '0') {
                unaBase.ui.unblock()
                toastr.warning("No es posible guardar sin una cuenta contable seleccionada");
                return;
              }
            }
          }

          if (params.entity == 'Contacto') {
            const tipo_contacto = document.querySelector('input[name="contact[tipo]"]').value;
            if (tipo_contacto && tipo_contacto === 'EXTRANJERO') {
              const rut_contacto = document.querySelector('input[name="contact[rut]"]').value;
              if (rut_contacto == '') {
                unaBase.ui.unblock()
                toastr.warning("No es posible guardar el contacto del tipo extranjero sin un Rut/Rfc");
                return;

              }
            }
          }
          if (unaBase.parametros.sap_integration) {
            if (params.entity == 'Compras') {
              compras.get_data(compras.id)
              // if (compras.data.items.some(v => v.tipo != 'TITULO' & v.cod_servicio == '')) {
              //   unaBase.ui.unblock()
              //   toastr.warning("No es posible guardar la orden de compra si los items no tienen codigo");
              //   return;
              // }

            }

          }
          if (params.entity == 'Negocios') {

            unaBase.utilities.sendNotificacion()
            unaBase.utilities.getItemByNv()
            unaBase.utilities.saveDataMongo('nv', params.data())

          }

          //SET GLOBAL MODULOS, SUPERSAVE

          unaBase.utilities.saveDataMongo(params.entity, data4send)

          $.ajax({
            url: "/4DACTION/_V3_set" + params.entity,
            type: "POST",
            dataType: "json",
            data: data4send,
            async: false // para poder hacer el save correctamente y esperar la respuesta
          }).done(function (data) {
            // console.log(decodeURIComponent(data4send).replace(/&/g, "\n"));
            if ($("table.items.cotizacion").data("gastop-mayor-venta")) {
              unaBase.log.save(
                "[En estado " +
                params.entity.toLowerCase() +
                "] Se guardó la cotización con gasto presupuestado mayor al precio de venta",
                modulo,
                folio,
                data.id
              );
              $("table.items.cotizacion").removeData(
                "gastop-mayor-venta"
              );
            }
            success = data.success;

            // se reinicia el control de cambios después del guardado
            unaBase.changeControl.init();
            if (data.success) {
              console.log("data.success")
              $('[data-name="share"]').data("is-saved", true);

              switch (params.entity) {
                case "Dtcnd":
                  if (data.id) {
                    toastr.success(NOTIFY.get("SUCCESS_SAVE_DOCUMENT"));
                    setTimeout(function () {
                      $.ajax({
                        url: "/4DACTION/_V3_setItemsDtcnd",
                        dataType: "json",
                        type: "POST",
                        data: dtc.container.serializeAnything()
                      }).done(function (data) {
                        if (data.success) {

                          unaBase.loadInto.viewport('/v3/views/dtc/contentnd.shtml?id=' + data.id);

                        } else {
                          if (data.readonly) {
                            toastr.error(
                              NOTIFY.get("ERROR_RECORD_READONLY_ITEM")
                            );
                          }
                        }
                      });
                    }, 500);
                    unaBase.ui.unblock();

                  }
                case "ParamConnect":

                  let dataConnect = params.data();
                  nodejs_public_ipaddr = dataConnect.ipAlt2;
                  nodejs_port = dataConnect.nodePort;
                  // nodeUrl = 'http://' + nodejs_public_ipaddr + ':' + nodejs_port;

                  unaBase.ui.unblock();
                  toastr.success(NOTIFY.get("SUCCESS_SAVE_PRODUCTO"));

                  break;
                case "NcVentas":
                  toastr.success(NOTIFY.get("SUCCESS_SAVE_DOCUMENT"));
                  notas.data.folio = data.folio;
                  notas.data.estado = data.estado;
                  notas.container
                    .find('[data-name="folio"]')
                    .text(notas.data.folio);
                  notas.container
                    .find('[name="folio"]')
                    .val(notas.data.folio);
                  notas.container
                    .find('[data-name="estado"]')
                    .text(notas.data.estado);
                  notas.get_totales();
                  notas.display();
                  unaBase.ui.unblock();
                  break;
                case "NdVentas":
                  toastr.success(NOTIFY.get("SUCCESS_SAVE_DOCUMENT"));
                  notas.data.folio = data.folio;
                  notas.data.estado = data.estado;
                  notas.container
                    .find('[data-name="folio"]')
                    .text(notas.data.folio);
                  notas.container
                    .find('[name="folio"]')
                    .val(notas.data.folio);
                  notas.container
                    .find('[data-name="estado"]')
                    .text(notas.data.estado);
                  notas.get_totales();
                  notas.display();
                  unaBase.ui.unblock();
                  break;
                case "Contacto":

                  $(".form-contact")
                    .find('input[name="id"]')
                    .val(data.id);
                  toastr.success(NOTIFY.get("SUCCESS_SAVE_CONTACTO"));

                  target = $(".sheet");
                  $.ajax({
                    url: "/4DACTION/_V3_getEmpresa",
                    dataType: "json",
                    data: {
                      q: data.id,
                      filter: "id"
                    },
                    success: function (data) {

                      $.map(data.rows, function (item) {

                        var currentId = target
                          .find('input[name="contacto[info][id]"]')
                          .val();


                        if (compras) {
                          if (compras?.tipoGasto === 'FTG' && compras?.editInput === 'cesionario') {
                            const razonSocialCe = target.find('input[name="contacto[info][razon_social_ce]"]');
                            const rutCe = target.find('input[name="contacto[info][rut_ce]"]');
                            const emailCe = target.find('input[name="contacto[info][email_ce]"]');

                            const formatRut = (rut) => {
                              const cleanedRut = rut.replace(/\./g, '').replace('-', '');
                              const rutBody = cleanedRut.slice(0, -1);
                              const verifier = cleanedRut.slice(-1);
                              let formattedRut = '';

                              for (let i = rutBody.length - 1, count = 0; i >= 0; i--) {
                                formattedRut = rutBody[i] + formattedRut;
                                count++;
                                if (count % 3 === 0 && i !== 0) {
                                  formattedRut = '.' + formattedRut;
                                }
                              }

                              return `${formattedRut}-${verifier}`;
                            };

                            if (razonSocialCe.length) razonSocialCe.val(item.razon_social);
                            if (rutCe.length) rutCe.val(formatRut(item.rut));
                            if (emailCe.length) emailCe.val(item.email);
                          }
                        }





                        if (currentId == 0 || currentId == item.id) {
                          // contacto
                          target
                            .find('input[name="contacto[info][id]"]')
                            .val(item.id);
                          target
                            .find('input[name="contacto[info][alias]"]')
                            .val(item.text);
                          target
                            .find(
                              'input[name="contacto[info][razon_social]"]'
                            )
                            .val(item.razon_social);

                          if (currency.code == "CLP") {
                            target.find('input[name="contacto[info][rut]"]').val(unaBase.data.rut.format(item.rut));
                          } else {
                            target.find('input[name="contacto[info][rut]"]').val(item.rut);
                          }

                          target
                            .find('input[name="contacto[info][giro]"]')
                            .val(item.giro);
                          target
                            .find(
                              'input[name="contacto[info][direccion]"]'
                            )
                            .val(item.direccion);
                          target
                            .find(
                              'input[name="contacto[info][telefono1]"]'
                            )
                            .val(item.telefonos);
                          target
                            .find('input[name="contacto[info][email]"]')
                            .val(item.email);

                          // Para Cotizacion
                          //target.find('input[name="contacto[info][id]"]').val(item.id);
                          /* target.find('input[name="cotizacion[empresa][id]"]').val(item.text);
                          target.find('input[name="cotizacion[empresa][razon_social]"]').val(item.razon_social);
                          target.find('input[name="cotizacion[empresa][rut]"]').val(unaBase.data.rut.format(item.rut)); */

                          if (dtc.data) {
                            dtc.data.contacto.id = item.id;
                            dtc.data.contacto.alias = item.text;
                            dtc.data.contacto.razon_social =
                              item.razon_social;
                            dtc.data.contacto.rut = unaBase.data.rut.format(
                              item.rut
                            );
                            dtc.data.contacto.giro = item.giro;

                            // tipo doc default
                            if (dtc.data.id_tipo_doc == "") {
                              dtc.data.id_tipo_doc = item.id_dtc_defaul;
                              dtc.data.des_tipo_doc =
                                item.des_dtc_default;
                              target
                                .find('input[name="des_tipo_doc"]')
                                .val(item.des_dtc_default);
                            }

                            // forma de pago default
                            if (dtc.data.id_forma_pago == "") {
                              dtc.data.id_forma_pago =
                                item.id_forma_default;
                              dtc.data.des_forma_pago =
                                item.des_forma_default;
                              target
                                .find('input[name="des_forma_pago"]')
                                .val(item.des_forma_default);
                            }
                          }

                          //dtc

                          var selectorDtc = target.find(
                            'input[name="tipo_doc[id]"]'
                          );
                          if (selectorDtc.length > 0) {
                            if (
                              target
                                .find('input[name="tipo_doc[id]"]')
                                .val() == ""
                            ) {
                              target
                                .find('input[name="tipo_doc[id]"]')
                                .val(item.id_dtc_default);
                              target
                                .find(
                                  'input[name="tipo_doc[descripcion]"]'
                                )
                                .val(item.des_dtc_default);
                            }
                          }

                          // forma pago
                          var selectorFpago = target.find(
                            'input[name="forma_pago[id]"]'
                          );
                          if (selectorFpago.length > 0) {
                            if (
                              target
                                .find('input[name="forma_pago[id]"]')
                                .val() == ""
                            ) {
                              target
                                .find('input[name="forma_pago[id]"]')
                                .val(item.id_forma_default);
                              target
                                .find(
                                  'input[name="forma_pago[descripcion]"]'
                                )
                                .val(item.des_forma_default);
                            }
                          }
                        }
                      });
                    }
                  });
                  unaBase.ui.unblock();
                  break;
                case "Producto":
                  var prevId = $(".form-contact")
                    .find('input[name="id"]')
                    .val();
                  $(".form-contact")
                    .find('input[name="id"]')
                    .val(data.id);
                  toastr.success(NOTIFY.get("SUCCESS_SAVE_PRODUCTO"));
                  if (prevId == 0)
                    $('input[name="file"]').fileupload(
                      fileUploadOptions()
                    );
                  unaBase.ui.unblock();
                  break;
                case "email_reportes":
                  $.ajax({
                    url: "/4DACTION/_V3_setReportes",
                    data: params.data(),
                    dataType: "json",
                    async: false,
                    success: function (data) {
                      if (data.success) {
                        toastr.success("Reporte Modificado con exito");
                        unaBase.history.back();
                      } else {
                        if (data.readonly) {
                          toastr.error(
                            NOTIFY.get("ERROR_RECORD_READONLY_ITEM")
                          );
                        } else {
                          toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                        }
                      }
                    }
                  });
                  unaBase.ui.unblock();
                  break;
                case "formaspago":
                  $.ajax({
                    url: "/4DACTION/_V3_setFormaspago",
                    data: params.data(),
                    dataType: "json",
                    async: false,
                    success: function (data) {
                      if (data.success) {
                        toastr.success(
                          "Forma de pago modificado con éxito."
                        );
                        unaBase.history.back();
                      } else {
                        if (data.readonly) {
                          toastr.error(
                            NOTIFY.get("ERROR_RECORD_READONLY_ITEM")
                          );
                        } else {
                          toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                        }
                      }
                    }
                  });
                  unaBase.ui.unblock();
                  break;
                case "tiposcuenta":
                  $.ajax({
                    url: "/4DACTION/_V3_setTiposcuenta",
                    data: params.data(),
                    dataType: "json",
                    async: false,
                    success: function (data) {
                      if (data.success) {
                        toastr.success(
                          "Tipo de cuenta modificado con éxito."
                        );
                        unaBase.history.back();
                      } else {
                        if (data.readonly) {
                          toastr.error(
                            NOTIFY.get("ERROR_RECORD_READONLY_ITEM")
                          );
                        } else {
                          toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                        }
                      }
                    }
                  });
                  unaBase.ui.unblock();
                  break;
                case "impuestos":
                  $.ajax({
                    url: "/4DACTION/_V3_setImpuestos",
                    data: params.data(),
                    dataType: "json",
                    async: false,
                    success: function (data) {
                      if (data.success) {
                        toastr.success(
                          "Impuesto modificado con éxito."
                        );
                        if (data.origen == "impuesto") {
                          unaBase.history.back();
                        }
                      } else {
                        if (data.readonly) {
                          toastr.error(
                            NOTIFY.get("ERROR_RECORD_READONLY_ITEM")
                          );
                        } else {
                          toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                        }
                      }
                    }
                  });
                  unaBase.ui.unblock();
                  break;
                case "tipospago":
                  $.ajax({
                    url: "/4DACTION/_V3_setTipospago",
                    data: params.data(),
                    dataType: "json",
                    async: false,
                    success: function (data) {
                      if (data.success) {
                        toastr.success(
                          "Tipo de pago modificado con éxito."
                        );
                        unaBase.history.back();
                      } else {
                        if (data.readonly) {
                          toastr.error(
                            NOTIFY.get("ERROR_RECORD_READONLY_ITEM")
                          );
                        } else {
                          toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                        }
                      }
                    }
                  });
                  unaBase.ui.unblock();
                  break;
                case "banco":
                  $.ajax({
                    url: "/4DACTION/_V3_setBanco",
                    data: params.data(),
                    dataType: "json",
                    async: false,
                    success: function (data) {
                      if (data.success) {
                        toastr.success("Banco modificado con éxito.");
                        unaBase.history.back();
                      } else {
                        if (data.readonly) {
                          toastr.error(
                            NOTIFY.get("ERROR_RECORD_READONLY_ITEM")
                          );
                        } else {
                          toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                        }
                      }
                    }
                  });
                  unaBase.ui.unblock();
                  break;
                case "tiposdtc":
                  $.ajax({
                    url: "/4DACTION/_V3_setTiposdtc",
                    data: params.data(),
                    dataType: "json",
                    async: false,
                    success: function (data) {
                      if (data.success) {
                        toastr.success(
                          "Tipo de Documento de Compra modificado con éxito."
                        );
                        unaBase.history.back();
                      } else {
                        if (data.readonly) {
                          toastr.error(
                            NOTIFY.get("ERROR_RECORD_READONLY_ITEM")
                          );
                        } else {
                          toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                        }
                      }
                    }
                  });
                  unaBase.ui.unblock();
                  break;
                case "Cotizacion":

                  if (data.index != 0) {
                    unaBase.doc.number = parseInt(data.index);
                    var locale_date = new Date().toLocaleDateString(
                      "es-CL",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      }
                    );
                    $("section.sheet")
                      .find("time")
                      .html(locale_date);
                  }
                  var callback = async function () {

                    if (typeof event.isTrigger == "undefined") {
                      if ($("#index").html() == "Plantilla")
                        toastr.success(
                          NOTIFY.get("SUCCESS_SAVE_TEMPLATE")
                        );
                      else {
                        if (
                          $("table.items.cotizacion").data(
                            "saved-without-items"
                          )
                        ) {
                          unaBase.log.save(
                            "[En estado " +
                            params.entity.toLowerCase() +
                            "] Ha guardado sin ítems",
                            modulo,
                            data.index
                          );
                          $("table.items.cotizacion").removeData(
                            "saved-without-items"
                          );
                        }
                        toastr.success(
                          NOTIFY.get("SUCCESS_SAVE_COTIZACION")
                        );
                      }
                    }
                    $('#menu [data-name="preview"]').show();


                    let nvNumber = data.folio;
                    if ($("#index").html() == "Borrador")
                      $.ajax({
                        url: "/4DACTION/_V3_setVersionByCotizacion",
                        data: {
                          id: $("section.sheet").data("id")
                        },
                        dataType: "json",
                        async: false,
                        success: function (data) {

                          if (data.success && data.unique) {
                            //toastr.info('Se creó una nueva versión');
                            //if (data.index != -1)

                            $("#version").html(data.index);
                            unaBase.inbox.send({
                              subject:
                                "Ha creado la cotización Nº " +
                                nvNumber +
                                " / " +
                                $("section.sheet")
                                  .find(
                                    'input[name="cotizacion[titulo][text]"]'
                                  )
                                  .val(),
                              into: "viewport",
                              href:
                                "/v3/views/cotizaciones/content.shtml?id=" +
                                data.id,
                              tag: "avisos"
                            });

                            // Ver acá el flujo dependiendo si es cotización nueva, desde plantilla o duplicada
                            $.ajax({
                              url: "/4DACTION/_V3_setLogValidacion",
                              data: {
                                table: "Nota_de_venta",
                                id_record: $("section.sheet").data(
                                  "id"
                                ),
                                index_record: $("section.sheet").data(
                                  "index"
                                ),
                                ref_record: $("section.sheet")
                                  .find(
                                    '[name="cotizacion[titulo][text]"]'
                                  )
                                  .val(),
                                test: true,
                                async: false
                              },
                              dataType: "json",
                              async: false,
                              success: function (data) {
                                if (!crear_oc_validada)
                                  crear_oc_validada =
                                    data.rows.length == 0;
                              }
                            });

                            if (!crear_oc_validada) {
                              if (!deferReglaValidacion) {
                                initLogValidacion();
                                /*initLogValidacion();*/
                                sendValidar = true;
                              } else {
                                //$('#menu [data-name="validate_send"]').show();
                                $.ajax({
                                  url: "/4DACTION/_V3_setLogValidacion",
                                  data: {
                                    table: "Nota_de_venta",
                                    id_record: $("section.sheet").data(
                                      "id"
                                    ),
                                    index_record: $(
                                      "section.sheet"
                                    ).data("index"),
                                    ref_record: $("section.sheet")
                                      .find(
                                        '[name="cotizacion[titulo][text]"]'
                                      )
                                      .val(),
                                    test: true,
                                    async: false
                                  },
                                  dataType: "json",
                                  async: false,
                                  success: function (data) {
                                    has_rules = data.rows.length > 0;
                                    if (has_rules) {
                                      $(
                                        '#menu [data-name="validate_send"]'
                                      ).show();
                                    } else {

                                      $.ajax({
                                        url:
                                          "/4DACTION/_V3_setCotizacion",
                                        data: {
                                          id: $("section.sheet").data(
                                            "id"
                                          ),
                                          "cotizacion[approved]": true,
                                          auto: true
                                        },
                                        dataType: "json",
                                        async: false,
                                        success: function (subdata) {
                                          $(
                                            '#menu [data-name="validate_send"]'
                                          ).hide();
                                          $("section.sheet").data(
                                            "validado",
                                            true
                                          );
                                          $("section.sheet").data(
                                            "approved",
                                            true
                                          );
                                          $(
                                            "section.sheet footer article p span:first-of-type"
                                          ).text("Validada");
                                        }
                                      });
                                    }
                                  }
                                });
                              }
                            } else {

                              $.ajax({
                                url: "/4DACTION/_V3_setCotizacion",
                                data: {
                                  id: $("section.sheet").data("id"),
                                  "cotizacion[approved]": true,
                                  auto: true
                                },
                                dataType: "json",
                                async: false,
                                success: function (subdata) {
                                  $(
                                    '#menu [data-name="validate_send"]'
                                  ).hide();
                                  $("section.sheet").data(
                                    "validado",
                                    true
                                  );
                                  $("section.sheet").data(
                                    "approved",
                                    true
                                  );
                                  $(
                                    "section.sheet footer article p span:first-of-type"
                                  ).text("Validada");
                                  $(
                                    "section.sheet button.add.dtc"
                                  ).visible();
                                  $(
                                    "section.sheet button.add.orden-pago"
                                  ).visible();
                                  $(
                                    "section.sheet button.add.cobro"
                                  ).visible();
                                }
                              });
                            }

                            // Se incluye acá para que funcione
                            if (data.index == -1) {
                              if (access._584)
                                unaBase.toolbox.menu.buttons([
                                  "save",
                                  "refresh",
                                  "offline_mode",
                                  "delete",
                                  "exit",
                                  "preview"
                                ]);
                              else
                                unaBase.toolbox.menu.buttons([
                                  "save",
                                  "refresh",
                                  "delete",
                                  "exit",
                                  "preview"
                                ]);
                            } else {
                              if (data.index == 0) {
                                if (access._584)
                                  unaBase.toolbox.menu.buttons([
                                    "save",
                                    "offline_mode",
                                    "exit",
                                    "preview"
                                  ]);
                                else
                                  unaBase.toolbox.menu.buttons([
                                    "save",
                                    "exit",
                                    "preview"
                                  ]);
                              } else {
                                if (
                                  $("section.sheet")
                                    .find("span.validation-status")
                                    .text() == "Validada"
                                ) {
                                  if (access._584)
                                    unaBase.toolbox.menu.buttons([
                                      "save",
                                      "refresh",
                                      "offline_mode",
                                      "clone_current",
                                      access._484
                                        ? "convert_negocio"
                                        : "conversion_negocio_request",
                                      "discard",
                                      "exit",
                                      "share",
                                      "preview",
                                      "template",
                                      "export"
                                    ]);
                                  else
                                    unaBase.toolbox.menu.buttons([
                                      "save",
                                      "refresh",
                                      "clone_current",
                                      access._484
                                        ? "convert_negocio"
                                        : "conversion_negocio_request",
                                      "discard",
                                      "exit",
                                      "share",
                                      "preview",
                                      "template",
                                      "export"
                                    ]);
                                } else {
                                  if (access._584)
                                    unaBase.toolbox.menu.buttons([
                                      "save",
                                      "refresh",
                                      "offline_mode",
                                      "clone_current",
                                      "discard",
                                      "exit",
                                      "preview",
                                      "template",
                                      "validate_send"
                                    ]);
                                  else
                                    unaBase.toolbox.menu.buttons([
                                      "save",
                                      "refresh",
                                      "clone_current",
                                      "discard",
                                      "exit",
                                      "preview",
                                      "template",
                                      "validate_send"
                                    ]);

                                  if (
                                    typeof refreshLogValidacion !=
                                    "undefined"
                                  )
                                    refreshLogValidacion(); // acá entra: Desde cero / sin crear validada
                                }

                                if (!access._530)
                                  $(
                                    '#menu [data-name="template"]'
                                  ).hide();
                              }
                            }
                          }
                        }
                      });
                    else {
                      $.ajax({
                        url: "/4DACTION/_V3_setVersionByCotizacion",
                        data: {
                          id: $("section.sheet").data("id"),
                          hidden: true
                        },
                        dataType: "json",
                        async: true,
                        success: function (data) {

                          if (data.success && data.unique) {
                            let time = document.querySelector(".view-active span#time-version-text");

                            if (time != undefined) {
                              let fechaOriginal = data.updated_at;
                              let partesFecha = fechaOriginal.split(" ");
                              let fecha = partesFecha[0].split("-");
                              let nuevaFecha = fecha.reverse().join("-") + " " + partesFecha[1];


                              time.textContent = parseTimestamp(nuevaFecha)
                              time.dataset.time = nuevaFecha
                            }

                            console.log("Versión de guardado creada");
                          } else {
                            console.log(
                              "Versión de guardado no se pudo crear"
                            );
                          }
                        },
                        error: function (xhr, text, error) {

                        }
                      });
                    }

                    if (data.index != -1)
                      $("#index").html("Nº " + data.index);
                    $("section.sheet").data("index", data.index);
                    $(".index2").html("Nº " + data.index);
                    unaBase.ui.expandable.init();
                    // Ocultar botones según validación y permiso
                    if (
                      $("section.sheet")
                        .find(".validation-status")
                        .text() == "No validada"
                    ) {
                      $('#menu [data-name="share"]').hide();
                      //if (access._496)
                      $('#menu [data-name="convert_negocio"]').hide();

                      if (
                        $("section.sheet")
                          .data("username")
                          .toLowerCase() ==
                        $("html > body.menu.home > aside > div > div > h1")
                          .data("username")
                          .toLowerCase()
                      )
                        $(
                          '#menu [data-name="validate_request"]'
                        ).show();
                      else {
                        if (
                          typeof reiniciar_validacion_cotizaciones ==
                          "undefined"
                        )
                          $(
                            '#menu [data-name="validate_request"]'
                          ).hide();
                        else
                          $(
                            '#menu [data-name="validate_request"]'
                          ).show();
                      }
                    }
                    unaBase.ui.unblock();
                  };

                  saveItemsNv()
                    .then(res => {

                      callback()
                      success = true
                      resolve()
                      if ($('input[name="toUnblock"]').prop("checked")) {
                        idleUnblock();
                      }

                    })
                    .catch(err => {

                      success = false
                      reject()
                    });




                  break;
                case "Proyecto":
                  /*$('div.task-container').find('div.task').each(function(key, item) {
                    $(item).find('button.save.task').trigger('click');
                  });*/
                  if (data.index != -1)
                    $("#index").html("Nº " + data.index);
                  $("section.sheet").data("index", data.index);
                  unaBase.ui.unblock();
                  break;
                case "ItemByCotizacion":
                  const id = data.id;
                  let trElement = document.querySelector(
                    `tr[data-id="${id}"]`
                  );
                  if (!trElement)
                    trElement = unaBase.doc.lineTrSup


                  /*const percentage = {
                    productor_ejecutivo: document.querySelector(`input[name="item[][formula_productor_ejecutivo2]"]`).checked,
                    asistente: document.querySelector(`input[name="item[][formula_asistente_produccion2]"]`).checked,
                    porcentage: document.querySelector(`input[name="item[][formula_prod_ejec_ratio2]"]`).value,
                    monto_total: document.querySelector(`input[name="item[][porcentaje_monto_total2]"]`).value
                  }*/

                  const setItemBlock = (i_, e_) => {
                    if (e_) {
                      $(i_).find('[name="item[][precio_unitario]"]').prop('disabled', true);
                      $(i_).find('[name="item[][costo_unitario]"]').prop('disabled', true);
                      $(i_).find('[name="item[][subtotal_costo]"]').prop('disabled', true);
                      //htmlObject.find('[name="item[][precio_unitario]"]').prop('readonly', true);
                      // Bloquear nombre, tipo documento y cantidades
                      $(i_).find('[name="item[][nombre]"]').prop('disabled', true);
                      $(i_).find('button.show.item').invisible();
                      $(i_).find('[name="item[][cantidad]"]').prop('disabled', true);
                      $(i_).find('[name="item[][factor]"]').prop('disabled', true);
                      $(i_).find('[name="item[][tipo_documento]"]').prop('disabled', true);
                      $(i_).find('[name="item[][nombre]"]').prop('readonly', true);
                      $(i_).find('button.show.item').invisible();
                      $(i_).find('[name="item[][cantidad]"]').prop('readonly', true);
                      $(i_).find('[name="item[][factor]"]').prop('readonly', true);
                      $(i_).find('[name="item[][tipo_documento]"]').prop('readonly', true);
                    } else {
                      $(i_).find('[name="item[][precio_unitario]"]').prop('disabled', false);
                      $(i_).find('[name="item[][costo_unitario]"]').prop('disabled', false);
                      //htmlObject.find('[name="item[][precio_unitario]"]').prop('readonly', true);
                      // Bloquear nombre, tipo documento y cantidades
                      $(i_).find('[name="item[][nombre]"]').prop('disabled', false);
                      $(i_).find('button.show.item').visible();
                      $(i_).find('[name="item[][cantidad]"]').prop('disabled', false);
                      $(i_).find('[name="item[][factor]"]').prop('disabled', false);
                      $(i_).find('[name="item[][tipo_documento]"]').prop('disabled', false);
                      $(i_).find('[name="item[][nombre]"]').prop('readonly', false);
                      $(i_).find('button.show.item').visible();
                      $(i_).find('[name="item[][cantidad]"]').prop('readonly', false);
                      $(i_).find('[name="item[][factor]"]').prop('readonly', false);
                      $(i_).find('[name="item[][tipo_documento]"]').prop('readonly', false);
                    }
                  }

                  const percentage = {
                    productor_ejecutivo: $(
                      'input[name="item[][formula_productor_ejecutivo2]"]'
                    ).prop("checked"),
                    asistente: $(
                      'input[name="item[][formula_asistente_produccion2]"]'
                    ).prop("checked"),
                    porcentage: $(
                      'input[name="item[][formula_prod_ejec_ratio2]"]'
                    ).val(),
                    monto_total: $(
                      'input[name="item[][porcentaje_monto_total2]"]'
                    ).val(),
                    auto_percent: $(
                      'input[name="item[][auto_percent]"]'
                    ).val()
                  };
                  if (typeof percentage.auto_percent != 'undefined') {

                    if (parseFloat(percentage.auto_percent) > 0) {
                      trElement.dataset.auto_percent = true
                      trElement.dataset.auto_percent_value = parseFloat(percentage.auto_percent)
                      sobrecargos.calculate()
                      setItemBlock(trElement, true)

                    } else {
                      if (trElement) {
                        trElement.dataset.auto_percent = false
                        trElement.dataset.auto_percent_value = parseFloat(percentage.auto_percent)
                      }
                      setItemBlock(trElement, false)
                    }
                  }

                  $(trElement).data(
                    "porcentaje-monto-total",
                    percentage.monto_total / 100
                  );
                  $(trElement).data(
                    "formula-productor-ejecutivo-ratio",
                    percentage.porcentage
                  );
                  $(trElement).data(
                    "formula-productor-ejecutivo",
                    percentage.productor_ejecutivo
                  );
                  $(trElement).data(
                    "formula-asistente-produccion",
                    percentage.asistente
                  );
                  // ver si aplica cambios al hacer change en eldropdown de tipo documento
                  toastr.success(
                    NOTIFY.get("SUCCESS_SAVE_COTIZACION_ITEM")
                  );
                  unaBase.ui.unblock();
                  $(".ui-dialog")
                    .find(".ui-dialog-titlebar-close")
                    .trigger("click");
                  break;
                case "ItemByCompra":
                  var container2 = $(
                    '#sheet-compras table > tbody > tr[data-llave="' +
                    params.data().id +
                    '"]'
                  );
                  container2
                    .find(
                      'input[name="oc[detalle_item][observacion_item]"]'
                    )
                    .val(params.data().text);
                  toastr.success(NOTIFY.get("SUCCESS_SAVE"));
                  unaBase.ui.unblock();
                  break;
                case "DatoByCotizacion":
                  toastr.success(
                    NOTIFY.get("SUCCESS_SAVE_COTIZACION_DATO")
                  );
                  unaBase.ui.unblock();
                  break;
                case "Negocios":
                  saveItemsNv(callback)
                    .then(res => {
                      $.ajax({
                        url: "/4DACTION/_V3_setVersionByCotizacion",
                        data: {
                          id: $("section.sheet").data("id"),
                          hidden: true
                        },
                        dataType: "json",
                        async: false,
                        success: function (data) {

                          if (data.success && data.unique) {
                            console.log("Versión de guardado creada");

                          }
                          const id_nv = document.querySelector('.sheet').dataset.id
                          //unaBase.utilities.saveVersionDataMongo(id_nv, 'versions/set-version')
                          let time = document.querySelector(".view-active span#time-version-text");

                          if (time != undefined) {
                            let fechaOriginal = data.updated_at;
                            let partesFecha = fechaOriginal.split(" ");
                            let fecha = partesFecha[0].split("-");
                            let nuevaFecha = fecha.reverse().join("-") + " " + partesFecha[1];


                            time.textContent = parseTimestamp(nuevaFecha)
                            time.dataset.time = nuevaFecha
                          } else {
                            console.log(
                              "Versión de guardado no se pudo crear"
                            );
                          }
                        }
                      });
                      if ($('input[name="toUnblock"]').prop("checked")) {
                        idleUnblock();
                      }
                      toastr.success(NOTIFY.get("SUCCESS_SAVE_NEGOCIO"));
                      //COLOCAR
                      if (unaBase.parametros.sap_integration) {
                        unaBase.utilities.saveDataSap('nv')
                      }
                      // unaBase.changeControl.isSaved = true;
                      if (params.presupuesto) {
                        if (data.index > 0) {

                          unaBase.doc.number = parseInt(data.index);
                          $("#index").html("Nº " + data.index);
                          $("section.sheet").data("index", data.index);
                          $(".index2").html("Nº " + data.index);
                        }
                      }

                      resolve()
                      success = true
                      unaBase.ui.expandable.init();
                      unaBase.ui.unblock();


                    })
                    .catch(err => {
                      reject()
                      success = false
                    });



                  break;
                case "Compras":

                  if (compras.tipoGasto == "FXR") {
                    toastr.success(
                      NOTIFY.get("SUCCESS_SAVE_GASTO_FXR")
                    );
                  } else {
                    toastr.success(NOTIFY.get("SUCCESS_SAVE_GASTO_OC"));
                    compras.checkReadOnly()
                  }

                  compras.btnContrato = data.btn_contrato

                  var target = $("#sheet-compras");
                  target
                    .find('input[name="oc[total_justificado]"]')
                    .val(data.justificado);
                  target
                    .find('input[name="oc[total_por_justificar]"]')
                    .val(data.saldoJustificar);
                  target
                    .find('input[name="oc[saldo_total_fxr]"]')
                    .val(data.saldoTotalFxr);
                  var footer = $(
                    "#sheet-compras table.dtcs > tfoot > tr > th"
                  );
                  footer
                    .find('input[name="oc[suma_justificado]"]')
                    .val(data.justificado);
                  var nuevo = false;

                  if (target.data("index") == "") {
                    nuevo = true;
                    compras.folio = data.index;
                    target.data("index", compras.folio);
                    target.data("folio", compras.folio);
                    target.find("#index").text("Nº " + compras.folio);
                    $(
                      '#dialog-menu ul li[data-name="cancel_oc"]'
                    ).remove();
                  }

                  unaBase.ui.expandable.init();
                  if (nuevo) {
                    $.ajax({
                      url: "/4DACTION/_V3_setLogValidacion",
                      data: {
                        table: "Orden_de_compra",
                        id_record: $("section.sheet").data("id"),
                        index_record: $("section.sheet").data("index"),
                        ref_record: $("section.sheet")
                          .find('[name="oc[referencia]"]')
                          .val(),
                        test: true
                      },
                      dataType: "json",
                      async: false,
                      success: function (data) {
                        has_rules = data.rows.length > 0;
                        if (has_rules && !crear_oc_validada) {
                          //$('#menu [data-name="validate_send"]').show();
                          /*initLogValidacion();*/
                          if (true) { }
                          sendValidar = true;
                        } else {
                          $.ajax({
                            url: "/4DACTION/_V3_setCompras",
                            data: {
                              id: $("section.sheet").data("id"),
                              "oc[approved]": true,
                              auto: true
                            },
                            dataType: "json",
                            async: false,
                            success: function (subdata) {
                              var labelValidada = $(
                                "section.sheet footer article p span.validation-status"
                              );
                              compras.validado = 1;
                              $("#sheet-compras").data(
                                "validado",
                                true
                              );
                              $("#sheet-compras")
                                .find('input[name="oc[validado]"]')
                                .val(true);
                              labelValidada
                                .text("Validada")
                                .attr("style", "color:black!important")
                                .removeClass("false")
                                .addClass("true");
                              $(
                                "section.sheet button.add.dtc"
                              ).visible();
                              $(
                                "section.sheet button.add.orden-pago"
                              ).visible();
                              $(
                                "section.sheet button.add.cobro"
                              ).visible();
                            }
                          });
                        }
                      }
                    });
                  }

                  // Refrescar la lista de ítems para que se muestren en color rojo los ítems que exceden el gasto P
                  var idoc = $("#sheet-compras").data("id");
                  //get_items(idoc);

                  // actualiza valores: Justicar, Pagos, Depositos, Total real (fn está en content.js de compras)

                  get_totales_gastos();

                  // refresca lista de dtc
                  get_oc_dtc(idoc);

                  // Notificaciones

                  if (nuevo) {
                    var tipoGasto = target
                      .find('input[name="oc[tipo_gastos][id]"]')
                      .val();
                    var origenGasto = target
                      .find('input[name="oc[origen]"]')
                      .val();
                    var neto = target
                      .find('input[name="oc[neto]"]')
                      .val();
                    var id_prov = target
                      .find('input[name="contacto[info][id]"]')
                      .val();
                    var folio = target.data("folio");

                    // Creacion
                    unaBase.inbox.send({
                      subject:
                        "Ha creado el gasto - " +
                        tipoGasto +
                        " Nº " +
                        folio +
                        " / " +
                        target
                          .find('input[name="oc[referencia]"]')
                          .val(),
                      into: "viewport",
                      href:
                        "/v3/views/compras/content.shtml?id=" + data.id,
                      tag: "avisos"
                    });

                    if (
                      compras.origen == "PROYECTO" ||
                      compras.origen == "PRESUPUESTO"
                    ) {
                      // Posible duplicacion
                      $.ajax({
                        url: "/4DACTION/_V3_verificaOcDuplicada",
                        data: {
                          "verifica[id_oc_creando]": idoc,
                          "verifica[id_prov]": id_prov,
                          "verifica[neto]": neto,
                          "verifica[origen]": origenGasto
                        },
                        async: false,
                        dataType: "json",
                        success: function (result) {
                          if (result.success) {
                            unaBase.inbox.send({
                              subject:
                                "Ha creado posible gasto duplicado - " +
                                tipoGasto +
                                " Nº " +
                                folio +
                                " / " +
                                target
                                  .find('input[name="oc[referencia]"]')
                                  .val(),
                              into: "viewport",
                              href:
                                "/v3/views/compras/content.shtml?id=" +
                                data.id,
                              tag: "avisos"
                            });
                          }
                        }
                      });

                      // Excede gasto
                      var cantItemExcede = $(
                        "#sheet-compras table > tbody > tr"
                      ).find(
                        'input[name="oc[detalle_item][total]"].warning'
                      ).length;
                      if (cantItemExcede > 0) {
                        unaBase.inbox.send({
                          subject:
                            "Ha excedido el gasto presupuestado - " +
                            tipoGasto +
                            " Nº " +
                            folio +
                            " / " +
                            target
                              .find('input[name="oc[referencia]"]')
                              .val(),
                          into: "viewport",
                          href:
                            "/v3/views/compras/content.shtml?id=" +
                            data.id,
                          tag: "avisos"
                        });
                      }

                      // 90% gastado
                      let gasto90Pres = $(
                        "#sheet-compras table > tbody > tr"
                      ).find(
                        'input[name="oc[detalle_item][total]"].noventagp'
                      ).length;
                      let used = parseInt(
                        $("#sheet-compras table > tbody > tr").find(
                          'input[name="oc[detalle_item][total]"].percentage'
                        )[0]?.dataset.percentage
                      );

                      // if(used > 80){
                      //  unaBase.inbox.send({
                      //    subject: `Ha creado gasto con ${used}% presupuestado - ${tipoGasto} Nº  ${folio}  / ${target.find('input[name="oc[referencia]"]').val()} `,
                      //    into: 'viewport',
                      //    href: '/v3/views/compras/content.shtml?id=' + data.id,
                      //    tag: 'avisos'
                      //  });

                      // }
                      let expenseOrigin = compras.origen === 'PROYECTO' ? 'negocio' : 'presupuesto'
                      if (gasto90Pres > 0 && used > 90) {
                        unaBase.inbox.send({
                          subject: `Ha creado gasto de ${expenseOrigin} con 90% presupuestado - ` +
                            tipoGasto +
                            " Nº " +
                            folio +
                            " / " +
                            target
                              .find('input[name="oc[referencia]"]')
                              .val(),
                          into: "viewport",
                          href:
                            "/v3/views/compras/content.shtml?id=" +
                            data.id,
                          tag: "avisos"
                        });
                      }
                    }
                  }
                  oc_validate_fields();


                  if (unaBase.parametros.portal_proveedores && compras.validado) {
                    compras.updateOcPortalProveedores()
                  }

                  if (unaBase.parametros.sap_integration) {
                    compras.get_data(compras.id)

                    unaBase.utilities.saveDataSap('compras')
                  }

                  //unaBase.utilities.updateIncomeVx(compras.tipoGasto)

                  unaBase.ui.unblock();

                  resolve()
                  /*setTimeout(  function(){
                    unaBase.loadInto.viewport('/v3/views/compras/content.shtml?id=' + data.id, undefined, undefined, true)
                  }, 500);*/
                  break;
                case "Dtc":

                  const saveDtc = () => {
                    return new Promise((resolve, reject) => {

                      $.ajax({
                        url: "/4DACTION/_V3_setItemsDtc",
                        dataType: "json",
                        type: "POST",
                        data: dtc.container.serializeAnything()
                      }).done(function (data) {



                        if (data.success) {
                          // unaBase.history.back();
                          resolve(data)
                        } else {

                          reject(data)
                        }
                      })
                    });

                  };






                  saveDtc()
                    .then(res => {

                      if (accountingMode && dtc.data.estado == "POR EMITIR" && access._670) {
                        unaBase.loadInto.dialog(
                          '/v3/views/dtc/dialog/confirmacion_Comprobante.shtml?id=' + data.id + '&tipoDocRef=DTC',
                          "FAVOR CONFIRMAR CUENTA CONTABLE PARA CONTINUAR",
                          "x-large",
                          false,
                          false,
                          false,
                          "DTC"

                        )
                      } else {


                        if (data.success) {
                          unaBase.ui.unblock();
                          //unaBase.history.back();
                          toastr.success("Documento guardado exitosamente!!!")


                          setTimeout(function () {
                            unaBase.loadInto.viewport(
                              "/v3/views/dtc/content.shtml?id=" + dtc.data.id,
                              undefined,
                              undefined,
                              true
                            );
                          }, 2000);
                          console.log("data to send", dtc.data)
                          //unaBase.utilities.saveDataMongo(dtc.data.id, 'documents/create-dtc')
                          //unaBase.utilities.updateIncomeVx('dtc')
                          if (unaBase.parametros.sap_integration) {
                            unaBase.utilities.saveDataSap('dtc')
                          }
                        } else {
                          if (data.errorMsg != "") {
                            toastr.error(
                              data.errorMsg.replaceAll(/SL/g, '<br>')
                            );
                          } else {
                            toastr.error(
                              NOTIFY.get("ERROR_RECORD_READONLY_ITEM")
                            );
                          }


                        }
                      }
                    })
                    .catch(error => {
                      console.log("Error");
                      toastr.error(
                        error.errorMsg.replaceAll(/SL/g, '<br>')
                      );
                    });

                  // document.querySelector(".ui-dialog .ui-dialog-titlebar-close").addEventListener("click",  function () {
                  //    

                  //   $.ajax({
                  //     url: "/4DACTION/_V3_setDtc",
                  //     data: {
                  //       "dtc[id]": dtc.id,
                  //       delete: true
                  //     },
                  //     dataType: "json",
                  //     success: function (data) {
                  //       // if (typeof event.isTrigger == "undefined") {
                  //       //   unaBase.history.back();
                  //       // }
                  //     },
                  //     error: function (xhr, text, error) {
                  //       toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                  //     }
                  //   });
                  // });


                  break;
                case "Comprobantes":
                  const comprobarCierre = () => {
                    return new Promise((resolve, reject) => {

                      $.ajax({
                        url: "/4DACTION/_V3_get_estadoPeriodoContable",
                        data: {
                          periodo: $('#comprobantes [name="docDate"]').val(),
                          origen: "ext modulos"
                        },
                        dataType: "json",
                        async: false,
                        success: function (subdata) {

                          if (subdata.exists == 1) {
                            if (subdata.closed == 1) {
                              reject()

                              toastr.warning(
                                "El periodo seleccionado se encuentra cerrado, por tanto no puede guardar este comprobante ."
                              );


                            } else {
                              resolve()
                            }

                          } else {
                            reject()
                            toastr.warning(
                              "El periodo contable para este comprobante no está creado.");
                          }
                        }
                      });



                    });
                  };


                  const saveComp = () => {
                    return new Promise((resolve, reject) => {
                      unaBase.ui.block();
                      console.warn("data from param.data");
                      console.warn(params.data());
                      if (params.validate() && comprobantes.validateNumbers()) {



                        $.ajax({
                          url: `/4DACTION/_V3_set${params.entity}?id=${params.data().id}`,
                          dataType: "json",
                          type: "POST",
                          data: params.data()
                        }).done(function (data) {


                          console.warn("saved")
                          console.warn(params.validate())
                          origenCom = data.v3_origenCom;

                          if (data.success) {
                            comprobantes.id = data.id;
                            comprobantes.data.id = data.id;

                            if (data.new) {


                              const oldTitle = $("#comprobantes h1#mainTitle").text();
                              $("#comprobantes h1#mainTitle").text("");
                              $("#comprobantes h1#mainTitle").text(`${oldTitle} Nro. ${data.id}`);
                              $(`input[name="id"]`).val(data.id);

                            }
                            toastr.success(
                              NOTIFY.get("SUCCESS_SAVE")

                            );
                            resolve()
                          } else {
                            toastr.success(
                              NOTIFY.get("ERROR_INTERNAL")
                            );
                            reject()
                          }
                          // unaBase.changeControl.init();
                          // unaBase.ui.unblock();
                          return { success: true };
                        });

                      } else if (!params.validate()) {
                        toastr.warning(NOTIFY.get("ERROR_DATA"));
                      } else if (!comprobantes.validateNumbers()) {
                        toastr.warning(NOTIFY.get("ACCOUNT_WARNING_EQUAL"));
                      }
                      unaBase.changeControl.init();
                      unaBase.ui.unblock();
                    });
                  };


                  const back = () => {
                    unaBase.history.back();

                  };

                  comprobarCierre()
                    .then(res => {
                      saveComp()
                        .then(res => {
                          confirm(
                            "¿Desea confirmar  el comprobante?",
                            "Aceptar",
                            "Cancelar"
                          ).done(function (data) {

                            if (data) {
                              if (params.data().docType == "egreso") {
                                payment.estado = "EMITIDA"
                                refreshOp();
                              }

                              if (params.data().docType == "traspaso") {
                                if (origenCom == "DTC") {
                                  toastr.success(NOTIFY.get("SUCCESS_SAVE_DOCUMENT"));
                                  dtc.data.estado = "EMITIDA"
                                  refreshDtc();
                                } else {
                                  refreshDtv();
                                }

                              }
                              $(".ui-dialog")
                                .find(".ui-dialog-titlebar-close")
                                .trigger("click");

                            }
                          });




                        })



                        // var myElement = document.querySelector(".ui-dialog");
                        // myElement.remove();

                        // myElement = document.querySelector(".ui-widget-overlay");
                        // myElement.remove();


                        .catch(error => {

                          console.log("errrorrroororor");

                        });


                    })
                    .catch(error => {

                      console.log("errrorrroororor");
                      unaBase.ui.unblock();
                    });

                  const refreshDtc = () => {
                    if (dtc.data.estado == "POR EMITIR" && dtc.data.from == "OC") {
                      dtc.data.estado = "POR PAGAR"
                      $("li[data-name='resumen[dtc][state]']").text("POR PAGAR");
                    } else if (dtc.data.estado == "POR EMITIR" && dtc.data.from == "FXR") {
                      dtc.data.estado = "PAGADO"
                      $("li[data-name='resumen[dtc][state]']").text("PAGADO");
                    }

                    unaBase.loadInto.viewport(
                      "/v3/views/dtc/content.shtml?id=" + dtc.data.id,
                      undefined,
                      undefined,
                      true
                    );

                  }

                  const refreshOp = () => {

                    unaBase.loadInto.viewport(
                      "/v3/views/pagos/content2.shtml?id=" + payment.id,
                      undefined,
                      undefined,
                      true
                    );

                  };

                  const refreshDtv = () => {

                    unaBase.loadInto.viewport(
                      "/v3/views/dtv/content.shtml?id=" + dtv.id,
                      undefined,
                      undefined,
                      true
                    );

                  };


                  break;
                case "Dtv":

                  unaBase.utilities.saveDataMongo('dtv');
                  toastr.success(NOTIFY.get("SUCCESS_SAVE_DOCUMENT"));
                  dtv.init(dtv.id);

                  unaBase.ui.unblock();
                  resolve()

                  break;
                case "Dtcnc":
                  toastr.success(NOTIFY.get("SUCCESS_SAVE_DOCUMENT"));
                  setTimeout(function () {
                    $.ajax({
                      url: "/4DACTION/_V3_setItemsDtcnc",
                      dataType: "json",
                      type: "POST",
                      data: dtc.container.serializeAnything()
                    }).done(function (data) {
                      if (data.success) {
                        //confirm('El monto de la nota de crédito solo descontará la factura.<br>¿Deseas también descontar el monto en la orden de compra?').done(function(data) {
                        //if (data) {
                        /*$.ajax({
                              url: '/4DACTION/_V3_setDtc',
                              data: {
                                id: data.id,
                                nc_descontada_oc: true
                              },
                              dataType: 'json',
                              success: function(data) {
                                toastr.success('Monto descontado desde la orden de compra con éxito.');
                                setTimeout(  function(){
                                  const checkDtcAndSave = () => {
                                    let moduleActive = document.querySelector('.sidebar li.active').dataset.name;
                                    if(moduleActive === 'dtc') {
                                      setTimeout(  function() {
                                        document.querySelector('li[data-name="save"] button').click();
                                      },3000)
                                    }
 
                                  }
                                  unaBase.history.back(checkDtcAndSave);
                                }, 500);
                              }
                            });*/

                        //} else {
                        unaBase.history.back();
                        //}
                        //});
                      } else {
                        if (data.readonly) {
                          toastr.error(
                            NOTIFY.get("ERROR_RECORD_READONLY_ITEM")
                          );
                        }
                      }
                    });
                  }, 500);
                  unaBase.ui.unblock();
                  break;
                case "Ingreso":


                  let ingresoId = $('.ui-dialog fieldset.ingreso').data('id');
                  let ingresoEstado = $('.ui-dialog table tbody tr[data-new="true"] td:nth-of-type(7)').text();


                  var target = $(".ui-dialog");
                  target.find("fieldset.ingreso").data("id", data.id);
                  target
                    .find("fieldset.ingreso .nro-orden")
                    .text("Nº " + data.folio);

                  var saveDocIngreso = () => {
                    return new Promise((resolve, reject) => {

                      if (
                        $('.ui-dialog table tbody tr[data-new="true"]')
                          .length
                      ) {
                        $.ajax({
                          url: "/4DACTION/_V3_setDocPagoByIngreso",
                          type: "POST",
                          data: {
                            "ingreso[documento][fecha]": $(
                              '.ui-dialog table tbody tr[data-new="true"] td:nth-of-type(2)'
                            ).text(),
                            "ingreso[documento][tipo]": $(
                              '.ui-dialog table tbody tr[data-new="true"] td:nth-of-type(3)'
                            ).text(),
                            "ingreso[documento][numero]": $(
                              '.ui-dialog table tbody tr[data-new="true"] td:nth-of-type(4)'
                            ).text(),
                            "ingreso[documento][cuenta]": $('.ui-dialog table tbody tr[data-new="true"] td:nth-of-type(5)').data('id'),
                            "ingreso[documento][check_cruzado]": $(
                              '.ui-dialog table tbody tr[data-new="true"]'
                            ).data("cruzado"),
                            fk: $(
                              ".ui-dialog-content fieldset.ingreso"
                            ).data("id"),
                            'ingreso[tipo_moneda]': ocb.moneda,
                            'ingreso[valor_cambio]': ocb.valor_cambio
                          },
                          dataType: "json",
                          success: function (data) {

                            resolve
                            toastr.success(
                              "Documento de ingreso asociado con éxito."
                            );
                            $(
                              '.ui-dialog table tbody tr[data-new="true"]'
                            ).remove();
                            $(".ui-dialog table").trigger("refresh");
                            $("section.sheet table.ingresos").trigger(
                              "refresh"
                            );
                            if (
                              $("section.sheet table.ingresos").length
                            ) {
                              $("#viewport").scrollTo(
                                $("section.sheet table.ingresos"),
                                800
                              );
                            }
                          }
                        });
                      } else {
                        reject
                        $("section.sheet table.ingresos").trigger(
                          "refresh"
                        );
                        $("section.sheet table.dtvs").trigger("refresh");
                      }

                      $(".ui-dialog")
                        .find(".ui-dialog-titlebar-close")
                        .trigger("click");
                    });
                  };

                  // Mostrar ingreso de cobro y tabla de documentos de cobro





                  if (accountingMode && access._670) {



                    saveDocIngreso()
                      .then(res => {
                        toastr.success(
                          "La orden de ingreso ha sido guardada"
                        );

                        $(".ui-dialog")
                          .find(".ui-dialog-titlebar-close")
                          .trigger("click");
                        unaBase.loadInto.dialog(
                          '/v3/views/dtc/dialog/confirmacion_Comprobante.shtml?id=' + ingresoId + '&tipoDocRef=OCB',
                          "FAVOR CONFIRMAR CUENTA CONTABLE PARA CONTINUAR",
                          "x-large",
                          false,
                          false,
                          false,
                          "INGRESO",
                          ingresoId,
                          ingresoEstado

                        )

                      }).catch(error => {
                        console.log("errrorrroororor");
                      });
                  }
                  else {
                    saveDocIngreso();
                    unaBase.ui.unblock();
                    //unaBase.history.back();
                    unaBase.loadInto.viewport("/v3/views/cobros/list.shtml");
                  }


                  $(".ui-dialog fieldset.doc-ingreso").show();
                  $(".ui-dialog table").show();

                  unaBase.ui.unblock();
                  break;
                case "Pago":
                  if (accountingMode && payment.estado == "POR EMITIR" && access._670) {
                    payment.setpaid()
                      .then(res => {
                        unaBase.ui.unblock();

                        unaBase.loadInto.dialog(
                          '/v3/views/dtc/dialog/confirmacion_Comprobante.shtml?id=' + payment.id + '&tipoDocRef=OP',
                          "FAVOR CONFIRMAR CUENTA CONTABLE PARA CONTINUAR",
                          "x-large",
                          false,
                          false,
                          false,
                          "EGRESOS"

                        )
                        toastr.success(NOTIFY.get("SUCCESS_SAVE_OP"));
                        //unaBase.utilities.updateIncomeVx('pagos')
                      }).catch(error => {
                        console.log("errrorrroororor");
                      });

                  } else {

                    payment.setpaid()
                      .then(res => {
                        unaBase.ui.unblock();

                        unaBase.loadInto.viewport(
                          "/v3/views/pagos/content2.shtml?id=" + payment.id,
                          undefined,
                          undefined,
                          true
                        );
                        //unaBase.utilities.updateIncomeVx('pagos')
                      }).catch(err => {

                        console.log('----error----' + err);

                      });


                    // unaBase.history.back();

                  }



                  //  .then(res=>{
                  //     unaBase.loadInto.viewport(
                  //       "/v3/views/pagos/content2.shtml?id=" + payment.id,
                  //       undefined,
                  //       undefined,
                  //       true
                  //     );
                  // })




                  /*if(payment.folio == "" || payment.folio == "S/N"){
                    payment.folio = data.folio;
                    payment.estado = "EMITIDA";
                    $('#index').text("Nº " + payment.folio);
                    payment.container.find('span[data-name="estado"]').text(payment.estado);
 
                    payment.setpaid();
                    unaBase.loadInto.viewport('/v3/views/pagos/content2.shtml?id=' + payment.id, undefined, undefined, true);
                  }
                  payment.setpaid();
                  payment.loadpaid();
                  payment.display();*/

                  // var target = $('.ui-dialog');
                  // target.find('fieldset.pago').data('id', data.id);
                  // target.find('fieldset.pago label[name="number_order"]').text(data.folio);
                  // $('section.sheet table.pagos').trigger('refresh');
                  // $('section.sheet table.dtcs').trigger('refresh');

                  break;
                case "Usuario":

                  if (data.success) {
                    toastr.success(NOTIFY.get("SUCCESS_SAVE"));
                  } else {
                    if (data.readonly) {
                      toastr.error(
                        NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                      );
                    } else {
                      toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                    }
                  }

                  unaBase.ui.unblock();

                  break;
                case "Usuarios":

                  if (data.success) {
                    toastr.success(NOTIFY.get("SUCCESS_SAVE"));
                    $('input[name="usuario[new]"]').val("false");
                  } else {
                    if (data.readonly) {
                      toastr.error(
                        NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                      );
                    } else {
                      toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                    }
                  }
                  unaBase.ui.unblock();
                  break;
                /*case 'Producto':
                  if (data.success) {
                    unaBase.toolbox.menu.buttons([ 'save', 'deactivate', 'exit' ]);
                    toastr.success(NOTIFY.get('SUCCESS_SAVE'));
                  }
                  unaBase.ui.unblock();
                  break;*/
                case "Occ":
                  if (data.success) {
                    new_occ = false;
                    toastr.success(NOTIFY.get("SUCCESS_SAVE"));
                    if (data.errorMsg != null)
                      toastr.warning(data.errorMsg.replaceAll(/SL/g, '<br>'));
                    $(element)
                      .parentTo(".ui-dialog-content")
                      .find('[name="occ[id]"]')
                      .val(data.id);
                    refreshOcc();
                    if (!$("#sheet-occ").data("pending"))
                      $(element)
                        .parentTo(".ui-dialog-content")
                        .dialog("close");
                  } else {
                    if (!data.pass) {
                      toastr.error(
                        NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                      );
                    } else {
                      toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                    }
                  }
                  unaBase.ui.unblock();
                  break;
                case "Cobro":

                  if (data.success) {
                    toastr.success(NOTIFY.get("SUCCESS_SAVE"));
                    $(elementCobro)
                      .parentTo(".ui-dialog-content")
                      .dialog("close");
                    if (data.reload)
                      $("body ul li.active a").trigger("click");
                  } else {
                    if (data.readonly) {
                      toastr.error(
                        NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                      );
                    } else {
                      toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                    }
                  }
                  $("section.sheet table.cobros").trigger("refresh");
                  unaBase.ui.unblock();
                  break;
                case "InstancesByProducto":
                  if (data.success) {
                    toastr.success(NOTIFY.get("SUCCESS_SAVE"));
                    // Insertar aquí código para que la fusión se refleje en el listado
                    // deben desaparecer los ítems fusionados
                    var items = [];
                    $(".ui-dialog-content table > tbody > tr").each(
                      async function () {
                        items.push($(this).data("id"));
                      }
                    );
                    $("section#viewport table.credencial > tbody > tr")
                      .filter(async function () {
                        return $.inArray($(this).data("id"), items);
                      })
                      .remove();

                    // luego, en el save del producto hay que hacer que se cree la ficha si el producto es nuevo
                    unaBase.loadInto.dialog(
                      "/v3/views/catalogo/content.shtml?id=" + data.id,
                      "Nuevo servicio fusionado",
                      "large"
                    );
                  } else {
                    if (data.readonly)
                      toastr.error(
                        NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                      );
                    else toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                  }
                  unaBase.ui.unblock();

                default:
                  toastr.success(NOTIFY.get("SUCCESS_SAVE"));

                  unaBase.ui.unblock();
                  break;
              }



              // if (unaBase.save.callback !== null) {
              //   unaBase.save.callback();
              // }
            } else {

              if (
                typeof data.detail != "undefined" &&
                data.detail.result
              ) {
                toastr.warning(data.detail.data);
              } else {

                if (typeof data.computer != "undefined") {
                  var bloqueo = "";
                  if (typeof data.computer != "undefined") {
                    bloqueo = "<br>-Desde: " + data.bloqueo;
                  }
                  toastr.error(
                    NOTIFY.get("ERROR_RECORD_READONLY") +
                    "<br><br>Bloqueado por:<br><br>-Equipo: " +
                    data.computer +
                    "<br>-Proceso: " +
                    data.process +
                    bloqueo
                  );
                } else if (data.errorMsg) {
                  toastr.error(data?.errorMsg?.replaceAll(/SL/g, '<br>'));
                } else {
                  toastr.error(NOTIFY.get("ERROR_RECORD_READONLY"));
                }
              }
              unaBase.ui.unblock();
            }
            //saveCallback
            unaBase.ui.unblock();

          }).fail(function (err, err2, err3) {
            console.log('Error:  ' + err)
            toastr.error('No se logró guardar, reintente o comuniquese con soporte.');
            unaBase.ui.unblock();

          });
        }
        unaBase.ui.unblock();

      });
    };

    const checkVersion = () => {
      let res = false
      let currentTime = document.querySelector(".view-active span#time-version-text") ? document.querySelector(".view-active span#time-version-text").dataset.time : ""
      if (currentTime == '') {
        return true
      }
      $.ajax({
        url: window.origin + "/4DACTION/_force_checkVersionByCotizacion",
        data: {
          id: $("section.sheet").data("id"),

        },
        async: false,
        dataType: "json",
        success: function (data) {
          unaBase.ui.unblock();
          if (data.rows.length > 0) {

            if (data.rows[0].updated_at === currentTime) {
              res = true
            } else {
              res = false
            }

          } else {
            res = true
          }
        }
      })



      return res;

    }


    //PRIMERA ETAPA

    if (params.validate()) {
      if (params.entity == "Cotizacion") {
        const versionCheck = checkVersion()
        unaBase.ui.unblock();
        const saveCot = () => {
          if (
            $("table.items tbody").find("tr:not(.title)").length == 0
          ) {
            unaBase.ui.unblock();

            confirm(
              "La cotización no contiene ítems en el detalle.\n\n¿Quieres guardar la cotización de todos modos?"
            ).done(function (data) {
              if (data) {
                unaBase.ui.block();

                setData(true)
                  .then(() => {

                    if (sendValidar)
                      initLogValidacion();
                  })
                  .then(() => {
                    resolve()
                  })
                  .catch(err => {
                    reject()
                    console.log(err);
                  });



              }
            });
          } else {
            // Verificar que gasto P sea menor al precio de venta
            var isGastoPExcedido = false;
            $("table.items.cotizacion tbody tr:not(.title)").each(
              async function (key, item) {
                var subtotal_precio = parseFloat(
                  $(item)
                    .closest("tr")
                    .find('[name="item[][subtotal_precio]"]')
                    .val()
                );
                var subtotal_costo = parseFloat(
                  $(item)
                    .closest("tr")
                    .find('[name="item[][subtotal_costo]"]')
                    .val()
                );
                if (
                  subtotal_precio > 0 &&
                  subtotal_costo > subtotal_precio
                ) {
                  isGastoPExcedido = true;
                  $(item)
                    .closest("tr")
                    .find('[name="item[][subtotal_costo]"]')
                    .css("background-color", "red");
                } else {
                  $(item)
                    .closest("tr")
                    .find('[name="item[][subtotal_costo]"]')
                    .css("background-color", "#FFF6E6");
                }
              }
            );
            if (isGastoPExcedido) {
              unaBase.ui.unblock();

              confirm(
                "La cotización tiene ítems con gasto presupuestado mayor al precio de venta.\n\n¿Quieres guardar la cotización de todos modos?"
              ).done(function (data) {
                if (data) {
                  unaBase.ui.block();
                  $(
                    "table.items.cotizacion tbody tr:not(.title)"
                  ).each(function (key, item) {
                    $(item)
                      .closest("tr")
                      .find('[name="item[][subtotal_costo]"]')
                      .css("background-color", "#f5ca78");
                  });

                  $("table.items.cotizacion").data(
                    "gastop-mayor-venta",
                    true
                  );
                  console.log("gastop mayor venta? sí");
                  setData()
                    .then(() => {

                      if (sendValidar)
                        initLogValidacion();
                    })
                    .then(() => {
                      resolve()
                    })
                    .catch(err => {
                      reject()
                      console.log(err);
                    });

                }
              });
            } else {

              setData()
                .then(() => {

                  if (sendValidar)
                    initLogValidacion();
                })
                .then(() => {
                  resolve()
                })
                .catch(err => {
                  reject()
                  console.log(err);
                });
            }
          }
        }
        if (!versionCheck) {
          confirm(
            "Actualmente existe una version mas nueva.\n\n¿Quieres guardar la cotización de todos modos?"
          ).done(function (data) {
            if (data) {
              saveCot()
            }
          });
        }

        if (versionCheck) {
          saveCot()
        }

      } else if (params.entity == "Negocios") {

        const versionCheck = checkVersion()
        const saveNeg = () => {
          if (eventData.isTrigger != 2) {
            // Verificar que gasto P sea menor al precio de venta
            var isGastoPExcedido = false;
            $("table.items tbody tr:not(.title)").each(function (
              key,
              item
            ) {
              var subtotal_precio = parseFloat(
                $(item)
                  .closest("tr")
                  .find('[name="item[][subtotal_precio]"]')
                  .val()
              );
              var subtotal_costo = parseFloat(
                $(item)
                  .closest("tr")
                  .find('[name="item[][subtotal_costo]"]')
                  .val()
              );
              if (
                subtotal_precio > 0 &&
                subtotal_costo > subtotal_precio
              ) {
                isGastoPExcedido = true;
                $(item)
                  .closest("tr")
                  .find('[name="item[][subtotal_costo]"]')
                  .css("background-color", "red");
              }
            });
            if (isGastoPExcedido) {
              unaBase.ui.unblock();
              confirm(
                "El negocio tiene ítems con gasto presupuestado mayor al precio de venta.\n\n¿Quieres guardar el negocio de todos modos?"
              ).done(function (data) {
                if (data) {
                  unaBase.ui.block();
                  $("table.items tbody tr:not(.title)").each(function (
                    key,
                    item
                  ) {
                    $(item)
                      .closest("tr")
                      .find('[name="item[][subtotal_costo]"]')
                      .css("background-color", "#FFF6E6");
                  });

                  $("table.items.cotizacion").data(
                    "gastop-mayor-venta",
                    true
                  );
                  console.log("gastop mayor venta? sí");
                  setData()
                    .then(() => {
                      resolve()
                    })
                    .catch(err => {
                      reject()
                      console.log(err);
                    });

                }
              });
            } else {
              unaBase.ui.block();

              setData()
                .then(() => {
                  resolve()
                })
                .catch(err => {
                  reject()
                  console.log(err);
                });

            }
          } else {
            unaBase.ui.block();

            setData()
              .then(() => {
                resolve()
              })
              .catch(err => {
                reject()
                console.log(err);
              });

          }

        }

        if (!versionCheck) {
          confirm(
            "Actualmente existe una version mas nueva.\n\n¿Quieres guardar el negocio de todos modos?"
          ).done(function (data) {
            if (data) {
              saveNeg()
            }
          });
        }

        if (versionCheck) {
          saveNeg()
        }
      } else if (params.entity == "Dtc" && $('li[data-name="resumen[dtc][origen]"]').text() == "ASOCIADA A RENDICIÓN") {

        var id_oc = parseFloat(
          $('[data-name="resumen[dtc][origen]"]').data("id")
        );
        var folio_oc = $('[data-name="resumen[dtc][origen]"]').data(
          "index"
        );
        var referencia_oc = $(
          '[data-name="resumen[dtc][origen]"]'
        ).data("text");
        var saldo = parseFloat(
          $('[data-name="resumen[dtc][origen]"]').data("saldo")
        );
        var total = parseFloat(
          $('[name="total"]')
            .val()
            .replace(".", "")
            .replace(",", ".")
        );
        var exceso_permitido = parseFloat(
          $("#sheet-dtc").data("excesook")
        );
        var exceso = -(saldo - total);
        if (exceso > 0) {
          if (exceso > exceso_permitido) {
            unaBase.ui.unblock();
            // if (false) {
            // REAPER FIX: la validación de exceso actualmente no funciona porque no se está asociando correctamente el DTC a la rendición
            confirm(
              "El documento excede en $" +
              exceso +
              " el monto solicitado.<br>\
              La rendición debe ser validada. ¿Desea continuar?"
            ).done(function (data) {
              if (data) {
                // Guardar DTC

                unaBase.ui.block();

                setData()
                  .then(() => {
                    resolve()
                  })
                  .catch(err => {
                    reject()
                    console.log(err);
                  });





                // Marcar OC como excedida
                $.ajax({
                  url: "/4DACTION/_V3_setCompras",
                  data: {
                    id: id_oc,
                    excedida: true,
                    exceso: exceso
                  },
                  dataType: "json",
                  success: function (data) {
                    // Enviar notificación
                    unaBase.inbox.send({
                      subject:
                        "Ha excedido el monto solicitado en $" +
                        exceso +
                        " - Rendición de fondos Nº " +
                        folio_oc +
                        " / " +
                        referencia_oc,
                      into: "viewport",
                      href:
                        "/v3/views/compras/content.shtml?id=" +
                        id_oc,
                      tag: "avisos"
                    });
                  }
                });
              }
            });
          } else {
            unaBase.ui.block();

            setData()
              .then(() => {
                resolve()
              })
              .catch(err => {
                reject()
                console.log(err);
              });



            // Enviar notificación igual auque no se tenga que validar
            unaBase.inbox.send({
              subject:
                "Ha excedido el monto solicitado en $" +
                exceso +
                " - Rendición de fondos Nº " +
                folio_oc +
                " / " +
                referencia_oc,
              into: "viewport",
              href: "/v3/views/compras/content.shtml?id=" + id_oc,
              tag: "avisos"
            });
          }
        } else {
          unaBase.ui.block();

          setData()
            .then(() => {
              resolve()
            })
            .catch(err => {
              reject()
              console.log(err);
            });


        }
      } else {
        unaBase.ui.block();

        setData()
          .then(() => {

            if (sendValidar)
              initLogValidacion();

          })
          .then(() => {
            resolve()
          })
          .catch(err => {
            reject()
            console.log(err);
          });


      }
    } else {
      toastr.error(
        "Es necesario completar la información requerida antes de guardar.",
        "Faltan datos"
      );
      unaBase.ui.unblock();
    }


  });

};

const saveAction = async (continueA, params, contAWithParams = false) => {
  //REVISAR EVENT DATA DESDE ENTITY NEGOCIOS--- eventData en generalSaveAction
  var elementCobro = $(this);
  let eventData = {
    isTrigger: 1
  };

  var event = {};
  //REVISAR CON EXTREMA URGENCIA  -----> REAPER URGENCIA


  generalSaveAction(elementCobro, eventData, event, params)
    .then(res => {
      if (typeof continueA != 'object') {
        if (contAWithParams) {

          continueA(params)

        } else {

          continueA()

        }
      }
    }).then(res2 => {

      unaBase.ui.unblock();

    })
    .catch(err => {
      toastr.error('No se pudo guardar, favor guardar nuevamente o  contactar a soporte.')
    });



}


//REAPER ---> PARA GUARDAR ITEMS CORRECTAMENTE
const saveItemsNv = async () => {

  return new Promise((resolve, reject) => {


    updateIndexes()
      .then(res => {
        resolve()

      })
      .catch(err => {
        reject()

      });

  });

}


const genNomina = (fromOutside = false, idsOps) => {
  var sid = "";
  $.each($.cookie(), function (clave, valor) {
    if (clave == hash && valor.match(/UNABASE/g)) sid = valor;
  });
  var modulo = $("html > body.menu.home > aside > div > div > ul > li.active")
    .data("name")
    .toUpperCase();
  var url = "";
  var ids = [];

  var ids_pagada = [];
  var ids_emitida = [];
  var ids_sin_doc_pago = [];
  var ids_excluir_tipo_pago = [];

  if (fromOutside) {
    ids = idsOps
  } else {
    $("#viewport tbody.ui-selectable tr[data-id] td:first-of-type input.selected:checked").each(function () {

      ids.push($(this).closest("tr").data("id"));
      if ($(this).closest("tr").data("estado") == "PAGADA") {
        ids_pagada.push($(this).closest("tr").data("id"));
      }
      if ($(this).closest("tr").data("estado") == "EMITIDA") {
        ids_emitida.push($(this).closest("tr").data("id"));
      }
      if ($(this).closest("tr").data("forma-pago") == "") {
        ids_sin_doc_pago.push($(this).closest("tr").data("id"));
      }
      if ($(this).closest("tr").data("forma-pago") != "NOMINA" && $(this).closest("tr").data("forma-pago") != "TRANSFERENCIA" && $(this).closest("tr").data("forma-pago") != "VALE VISTA" && $(this).closest("tr").data("forma-pago") != "") {
        ids_excluir_tipo_pago.push($(this).closest("tr").data("id"));
      }
    });
  }





  var pagada = ids_pagada.length > 0;
  var emitida = ids_emitida.length > 0;
  var sin_doc_pago = ids_sin_doc_pago.length > 0;
  var excluir_tipo_pago = ids_excluir_tipo_pago.length > 0;
  let nominaValues = {};
  let nominaPromt = `<ul>
                <li><input type="radio" name="nominaType" value="bciGrand" checked="checked" >Bci Grandes Empresas</li>
                <li><input type="radio" name="nominaType" value="bciGen" >Bci Generico</li>
                <li><input type="radio" name="nominaType" value="santander" >Santander</li>
                <li><input type="radio" name="nominaType" value="santanderExcel" >Santander (Excel)</li>
                <li><input type="radio" name="nominaType" value="itau" >Itau</li>
                <li><input type="radio" name="nominaType" value="itauExcel" >Itau (Excel)</li>
                <li><input type="radio" name="nominaType" value="bciGrandExcel" >Bci (Excel)</li>
                <li><input type="radio" name="nominaType" value="bancoChileExcel" >Banco Chile (Excel)</li>
              </ul>`;

  axios("/4DACTION/_V3_getParamEgreso")
    .then(resp => {
      if ((!pagada && emitida && !sin_doc_pago && !excluir_tipo_pago) || fromOutside) {
        var htmlObject = $(
          '<section> \
                    <span>Ingresar nombre de la nómina:</span> \
                    <input required type="text" style="border-bottom:solid 1px!important;width:300px" name="filename" value="NP' +
          new Date()
            .toJSON()
            .slice(0, 10)
            .split("-")
            .reverse()
            .join("") +
          '"> \
                  </section>'
        );

        htmlObject
          .find('input[name="filename"]')
          .on("blur", function (event) {
            htmlObject.data("response", $(this).val());
            htmlObject
              .find("input")
              .css("background-color", "white");
          });

        var promptNomina = async function () {
          prompt(htmlObject).done(function (data) {


            if (data !== false && data !== "") {
              var exportSoftlandNomina = async function (filename, nominaType = "bciGrand") {
                var downloadFile = function () {

                  //REAPER

                  var url = ""
                  $.ajax({
                    url: "/4DACTION/_V3_getNominaEgresos",
                    data: {
                      filename: filename,
                      nominaType
                    },
                    dataType: "json",
                    async: false,
                    success: function (subsubsubdata) {


                      switch (nominaType) {
                        case 'santanderExcel':


                          url =
                            nodeUrl +
                            "/export-nomina-excel/?download=true&ids=" +
                            ids.join("|") +
                            "&sid=" +
                            unaBase.sid.encoded() +
                            "&filename=" +
                            filename +
                            "&nominaType=" +
                            subsubsubdata.nominaType +
                            "&hostname=" +
                            window.location.origin;


                          var download = window.open(url);
                          download.blur();
                          window.focus();

                          unaBase.log.save(
                            "Ha descargado nomina excel",
                            "egresos"
                          );

                          setTimeout(function () {
                            unaBase.toolbox.search.save();
                            unaBase.toolbox.search.restore();
                          }, 5000);

                          break;


                        case 'itauExcel':


                          url =
                            nodeUrl +
                            "/export-nomina-excel/?download=true&ids=" +
                            ids.join("|") +
                            "&sid=" +
                            unaBase.sid.encoded() +
                            "&filename=" +
                            filename +
                            "&nominaType=" +
                            subsubsubdata.nominaType +
                            "&hostname=" +
                            window.location.origin;


                          var download = window.open(url);
                          download.blur();
                          window.focus();

                          unaBase.log.save(
                            "Ha descargado nomina excel",
                            "egresos"
                          );

                          setTimeout(function () {
                            unaBase.toolbox.search.save();
                            unaBase.toolbox.search.restore();
                          }, 5000);

                          break;

                        case 'bciGrandExcel':
                          url =
                            nodeUrl +
                            "/export-nomina-excel/?download=true&ids=" +
                            ids.join("|") +
                            "&sid=" +
                            unaBase.sid.encoded() +
                            "&filename=" +
                            filename +
                            "&nominaType=" +
                            subsubsubdata.nominaType +
                            "&hostname=" +
                            window.location.origin;


                          var download = window.open(url);
                          download.blur();
                          window.focus();

                          unaBase.log.save(
                            "Ha descargado nomina excel",
                            "egresos"
                          );

                          setTimeout(function () {
                            unaBase.toolbox.search.save();
                            unaBase.toolbox.search.restore();
                          }, 5000);

                          break;

                        case 'bancoChileExcel':


                          url =
                            nodeUrl +
                            "/export-nomina-excel/?download=true&ids=" +
                            ids.join("|") +
                            "&sid=" +
                            unaBase.sid.encoded() +
                            "&filename=" +
                            filename +
                            "&nominaType=" +
                            subsubsubdata.nominaType +
                            "&hostname=" +
                            window.location.origin;


                          var download = window.open(url);
                          download.blur();
                          window.focus();

                          unaBase.log.save(
                            "Ha descargado nomina excel",
                            "egresos"
                          );

                          setTimeout(function () {
                            unaBase.toolbox.search.save();
                            unaBase.toolbox.search.restore();
                          }, 5000);

                          break;

                        default:


                          console.warn(subsubsubdata);
                          url =
                            "/4DACTION/_V3_ExportNomina?ids=" +
                            ids.join("|") +
                            "&filename=" +
                            filename +
                            "&nominaType=" +
                            subsubsubdata.nominaType;
                          unaBase.log.save(
                            "Ha exportado nómina de egresos a Softland",
                            "egresos"
                          );

                          var download = window.open(url);
                          download.blur();
                          window.focus();
                          setTimeout(function () {
                            unaBase.toolbox.search.save();
                            unaBase.toolbox.search.restore();
                          }, 5000);
                          break;
                      }


                    }
                  });
                };
                downloadFile();
              };

              $.ajax({
                url: "/4DACTION/_V3_getNominaEgresos",
                data: {
                  filename: data
                },
                dataType: "json",
                async: false,
                success: function (subdata) {

                  if (subdata.exists) {

                    toastr.warning(
                      "El nombre de la nómina ingresado ya existe. Por favor, utilice un nombre distinto."
                    );
                    promptNomina();
                  } else {
                    nominaValues = resp.data;
                    let nominaTypes = Object.keys(
                      nominaValues
                    ).filter(i => nominaValues[i] === true);
                    switch (nominaTypes.length) {
                      case 1:
                        nominaTypes = nominaTypes.join();
                        exportSoftlandNomina(
                          subdata.filename,
                          nominaTypes
                        );
                        break;
                      case 0:
                        exportSoftlandNomina(subdata.filename);
                        break;
                      default:
                        prompt(nominaPromt).done(function (
                          dataPromt
                        ) {
                          const nominaTypeValue = document.querySelector(
                            'input[name="nominaType"]:checked'
                          ).value;
                          exportSoftlandNomina(
                            subdata.filename,
                            nominaTypeValue
                          );
                        });
                        break;
                    }
                  }
                }
              });
            }
          });
        };

        promptNomina();
      } else {
        if (pagada) {
          toastr.warning(
            "Existen documentos ya pagados que están seleccionados, deben solo exportarse documentos emitidos."
          );
        } else {
          if (sin_doc_pago && emitida) {
            toastr.warning(
              "Existen documentos sin documento de pago que están seleccionados, deben solo exportarse documentos con documento de pago."
            );
          } else {
            if (excluir_tipo_pago) {
              toastr.warning(
                "Existen documentos seleccionados que no pueden pagarse mediante nómina, deben solo exportarse documentos a pagar mediante transferencia o vale vista."
              );
            }
            if (!emitida) {
              toastr.warning(
                "Existen documentos no emitidos que están seleccionados, deben solo exportarse documentos emitidos."
              );
            }
          }
        }
      }
    })
    .catch(err => {
      console.log(err);
    });



}


//VARIABLES

var globales = {
  cobros: {}
}

// FUNCIONES GLOBALES

// Funciones globales para el manejo del asiento contable DTV
const getCuentasContables = () => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${window.origin}/4DACTION/_force_getAccounting`,
      type: "GET",
      data: { type: "DTV", id: dtv.id },
      dataType: "json",
    })
      .done((accountsResponse) => {
        resolve(accountsResponse);
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        reject(errorThrown);
      });
  });
};

const addTableRow = (id_cuenta = 0, monto = 0, tipo = "debe") => {
  try {
    unaBase.ui.block();
    const tableBody = document.getElementById("cuentasTableBody");
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
    <td>
      <button class="btn-add-row" title="Agregar fila">
          <i class="fas fa-plus"></i>
      </button>
      <button class="btn-remove" title="Eliminar fila">
          <i class="fas fa-trash"></i>
      </button>
    </td>
    <td>
        <select class="cuenta-contable cuenta-contable-unique-123"></select>
    </td>
    <td><input type="text" class="input-debe inputCustom input-align-right"  inputmode="numeric" value="${tipo === 'debe' ? monto > 0 ? unaBase.utilities.formatNumber(monto) : '' : ''}"></td>
    <td><input type="text" class="input-haber inputCustom input-align-right" inputmode="numeric" value="${tipo === 'haber' ? monto > 0 ? unaBase.utilities.formatNumber(monto) : '' : ''}"></td>
    `;
    tableBody.appendChild(newRow);
    fetchCuentasContables(newRow.querySelector(".cuenta-contable"), id_cuenta);
    newRow.querySelector(".btn-add-row").addEventListener("click", () => addTableRow());
    newRow.querySelector(".btn-remove").addEventListener("click", function () {
      this.closest("tr").remove();
      updateTotals();
    });
    const onInputCheckEmptyAndFormat = (event) => {
      const target = event.target !== undefined ? event.target : event;
      const onlyNumbers = target.value.replace(/\D/g, "");
      const formattedNumber = unaBase.utilities.formatNumber(onlyNumbers);
      target.value = formattedNumber;
      updateTotals();
    };
    const onInputDebeChange = (event) => {
      onInputCheckEmptyAndFormat(event);
      const rows = Array.from(document.querySelectorAll("#cuentasTableBody tr"));
      let ivaAccountId = null;
      rows.forEach(row => {
        const selectCuenta = row.querySelector(".cuenta-contable");
        const cuentaText = selectCuenta?.options[selectCuenta.selectedIndex]?.text || "";
        if (cuentaText.toLowerCase().includes("i.v.a") || cuentaText.toLowerCase().includes("iva") || cuentaText.toLowerCase().includes("debito fiscal")) {
          ivaAccountId = parseInt(selectCuenta.value || 0, 10);
        }
      });
      setTimeout(() => rebalanceHaberContraDebe(ivaAccountId), 100);
    };
    newRow.querySelector(".input-debe").addEventListener("input", onInputDebeChange);
    newRow.querySelector(".input-haber").addEventListener("input", onInputCheckEmptyAndFormat);
  } catch (ex) {
    console.log(ex);
  } finally {
    unaBase.ui.unblock();
  }
};

const fetchCuentasContables = (selectElement, id_cuenta = 0) => {
  $.ajax({
    url: `${window.origin}/4DACTION/_force_getAccounting`,
    type: "GET",
    data: { type: "DTV", id: dtv.id },
    dataType: "json",
  }).done((accountsResponse) => {
    selectElement.innerHTML = '<option value="">Selecciona una cuenta</option>';
    accountsResponse.rows.forEach((account) => {
      let option = document.createElement("option");
      option.text = `${account.number} / ${account.name}`;
      option.value = account.id;
      if (parseInt(account.id) === parseInt(id_cuenta)) {
        option.selected = true;
      }
      selectElement.appendChild(option);
    });
    let tomSelect = new TomSelect(selectElement, {
      maxItems: 1,
      valueField: "value",
      labelField: "text",
      searchField: "text",
    });
    if (id_cuenta > 0) {
      tomSelect.setValue(id_cuenta);
    }
  });
};

const updateTotals = () => {
  let totalDebe = 0;
  let totalHaber = 0;
  document.querySelectorAll(".input-debe").forEach(input => {
    totalDebe += parseFloat(String(input.value).replaceAll('.', '')) || 0;
  });
  document.querySelectorAll(".input-haber").forEach(input => {
    totalHaber += parseFloat(String(input.value).replaceAll('.', '')) || 0;
  });
  const elDebe = document.getElementById("total-debe");
  const elHaber = document.getElementById("total-haber");
  elDebe.textContent = unaBase.utilities.formatNumber(totalDebe);
  elHaber.textContent = unaBase.utilities.formatNumber(totalHaber);
  const cuadrados = totalDebe === totalHaber;
  elDebe.classList.toggle('rk-total-error', !cuadrados);
  elHaber.classList.toggle('rk-total-error', !cuadrados);
  elDebe.title = elHaber.title = cuadrados ? '' : 'Diferencia entre Debe y Haber';
};

const rebalanceHaberContraDebe = (ivaAccountId = null) => {
  try {
    console.log("[rebalanceHaberContraDebe] EJECUTANDO - IVA ID:", ivaAccountId);
    const totalDebe = Array.from(document.querySelectorAll(".input-debe")).reduce(
      (acc, input) => acc + (parseFloat(String(input.value).replaceAll(".", "")) || 0),
      0
    );
    const rows = Array.from(document.querySelectorAll("#cuentasTableBody tr")).map(row => {
      const inputHaber = row.querySelector(".input-haber");
      const selectCuenta = row.querySelector(".cuenta-contable");
      if (!inputHaber) return null;
      const rawValue = parseFloat(String(inputHaber.value).replaceAll(".", "")) || 0;
      const valueId = selectCuenta ? parseInt(selectCuenta.value || 0, 10) : 0;
      const isIva = ivaAccountId ? valueId === parseInt(ivaAccountId, 10) : false;
      return { row, inputHaber, selectCuenta, rawValue, isIva };
    }).filter(Boolean);
    const totalHaber = rows.reduce((acc, row) => acc + row.rawValue, 0);
    let diff = totalDebe - totalHaber;
    console.log("[rebalanceHaberContraDebe] Total Debe:", totalDebe, "Total Haber:", totalHaber, "Diferencia:", diff);
    if (Math.abs(diff) < 1) {
      updateTotals();
      return;
    }
    const editables = rows.filter(row => !row.isIva);
    if (!editables.length) {
      console.warn("[rebalanceHaberContraDebe] No hay filas editables para ajustar el Haber.");
      updateTotals();
      return;
    }
    if (diff > 0) {
      const target = editables[editables.length - 1];
      const newValue = target.rawValue + diff;
      target.inputHaber.value = newValue > 0 ? unaBase.utilities.formatNumber(newValue) : "";
      console.log("[rebalanceHaberContraDebe] Ajustado última fila editable con:", diff);
    } else {
      let remaining = Math.abs(diff);
      const ordered = editables.sort((a, b) => b.rawValue - a.rawValue);
      ordered.forEach(target => {
        if (remaining <= 0) return;
        const deduction = Math.min(target.rawValue, remaining);
        const newValue = target.rawValue - deduction;
        target.inputHaber.value = newValue > 0 ? unaBase.utilities.formatNumber(newValue) : "";
        remaining -= deduction;
      });
      if (remaining > 0) {
        console.warn("[rebalanceHaberContraDebe] No se pudo ajustar totalmente la diferencia restante:", remaining);
      }
    }
    updateTotals();
  } catch (error) {
    console.error("[rebalanceHaberContraDebe] Error al intentar cuadrar Debe/Haber:", error);
    updateTotals();
  }
};

const ordenarPorCuentaContable = (data) => {
  return data.sort((a, b) => {
    const numA = a.number.split('.').map(n => n.padStart(3, '0')).join('');
    const numB = b.number.split('.').map(n => n.padStart(3, '0')).join('');
    return numA.localeCompare(numB);
  });
};

function convertDate(date) {
  const separator = date.includes('-') ? '-' : '/';
  const [day, month, year] = date.split(separator);
  return `${year}-${month}`;
}

async function getPeriods(period, status = true) {
  const origin = location.origin
  const url = `${origin}/4DACTION/_V3_get_estadoPeriodoContable`;
  const queryParams = new URLSearchParams({
    periodo: convertDate(period),
    status: status
  });
  try {
    const response = await fetch(`${url}?${queryParams}`);
    const data = await response.json();
    return data
  } catch (error) {
    console.error("Error al obtener el estado del periodo contable:", error);
  }
}

const defaultModuleProperties = {
  "Dtc": "fecha_recepcion",
  "Dtv": "fecha_emision",
  "Ingresos": "fecha_recepcion",
  "Pagos": "fecha_recepcion",
}

const defaultMsgProperties = {
  "Dtc": "La fecha de recepción pertenece a un perido cerrado, no puede continuar.",
  "Dtv": "La fecha de emisión pertenece a un periodo cerrado, no puede continuar.",
  "Ingresos": "La fecha de ingreso pertenece a un periodo cerrado, no puede continuar.",
  "Pagos": "La fecha depago pertenece a un periodo cerrado, no puede continuar.",
}




