


//************************************************ NEW ACTION BUTTONS *******************************************************
let isEventListenerAdded = false;
const masterModal = (data, link) => {

  var htmlObj = ``, thh = ``, tdb = ``, trb = ``
  let cols = 0
  let lines = data.rows.length
  //let abc = ['a','b','c','d',e,f,g,h,i,j,k,l,m,n,ñ,o,p,q,r,s,t,u,v,w,x,y,z']
  data.rows.forEach(l => {
    tdb = ``
    let ln = l.line.split('%%%')

    if (cols < ln.length)
      cols = ln.length

    ln.forEach(k => tdb += ` <td>${k}</td>`);
    trb += `<tr>${tdb}</tr>`
  });

  thh = '<th scope="col"></th>'.repeat(cols)
  htmlObj = `<table class="table table-bordered table-hover" style="font-size: 11px;">
              <thead class="thead-dark">
                  <tr>
                      ${thh}
                  </tr>
              </thead>
              <tbody>
                  ${trb}
              </tbody>
          </table>`;

  if (lines < 7) {
    document.querySelector('.master-modal-actions').style.height = "300px"
    document.querySelector('.master-modal-box').style.height = "300px"
  } else {
    document.querySelector('.master-modal-actions').style.height = "800px"
    document.querySelector('.master-modal-box').style.height = "800px"
  }

  document.querySelector('.master-modal-container div.body').innerHTML = htmlObj
  document.querySelector('.master-modal-container').style.display = 'flex'
  document.querySelector('.master-modal-container #mm-actions-csv').href = link



}


const masterModalShowItems = async (data) => {

  const url = window.location.origin + '/node/get-dtc-xml';
  const params = '?hostname=' + window.location.origin;

  try {
    const response = await axios({
      method: 'post',
      url: url + params,
      data: data,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });


    if (!response.data.success) {
      unaBase.ui.unblock();
      document.querySelector('.master-modal-container').style.display = 'none'
      toastr.error(response.data.errorMsg);
      return
    }

    
    const montoReparto = response.data.data[0].afectoivamx

    var htmlObj = ``, thh = ``, tdb = ``, trb = ``
    let dt = []
    document.querySelector('.master-modal-actions').children[1].style.display = ''
    //Esconder botones
    for (let b = 2; b <= 5; b++) {
      document.querySelector('.master-modal-actions').children[b].style.display = 'none'
    }

    const tableItems = document.querySelector('#items-gastos tbody').children

    const formatNumber = (number) => {
      return parseFloat(number).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    const getDataTable = (tableItems, tipo) => {
      let dt = []
      for (let i = 0; i < tableItems.length; i++) {
        let code = '', item = '', pu = 0, subtotal = 0, total = 0, monto_reparto = 0

        if (tipo == 'table') {
          code = tableItems[i].children[2].textContent
          item = tableItems[i].children[3].querySelector('input').value
          pu = tableItems[i].children[8].querySelector('input').value
          subtotal = tableItems[i].children[9].querySelector('input').value
          total = tableItems[i].children[11].querySelector('input') ? tableItems[i].children[11].querySelector('input').value : 0

        }

        if (tipo == 'table-modal') {
          code = tableItems[i].children[0].textContent
          item = tableItems[i].children[1].querySelector('span').textContent
          pu = tableItems[i].children[2].textContent
          subtotal = tableItems[i].children[3].textContent
          total = tableItems[i].children[4].textContent
          monto_reparto = tableItems[i].children[5].querySelector('input').value
        }
        dt.push({
          code,
          item,
          pu,
          subtotal,
          total,
          monto_reparto,
          type: tableItems[i].dataset.tipo,
          id_nv: tableItems[i].dataset.tipo == 'ITEM' ? tableItems[i].dataset.nv : tableItems[i].dataset.idnv,
          id_producto: tableItems[i].dataset.tipo == 'ITEM' ? tableItems[i].dataset.idservicio : 0,
          origen: tableItems[i].dataset.origen,
          nro_nv: tableItems[i].dataset.tipo == 'ITEM' ? tableItems[i].dataset.nro_nv : 0
        })
      }

      return dt
    }

    dt = getDataTable(tableItems, 'table')


    // Crear encabezados de la tabla. 
    thh = '<th scope="col">Código</th>' +
      '<th scope="col">Ítem</th>' +
      '<th scope="col">P.U.</th>' +
      '<th scope="col">Subtotal</th>' +
      '<th scope="col">Total</th>' +
      '<th scope="col">Total repartir</th>'

    // Generar filas de la tabla basadas en datos
    let pu = 0, subtotal = 0, total = 0
    dt.forEach(l => {
      const rowClass = l.type === 'ITEM' ? ' class="item-row"' : ' class="titulo-row"';
      const itemClass = l.type === 'ITEM' ? ' class="item-title"' : '';

      if (l.type === 'ITEM') {
        pu += parseFloat(l.pu.replaceAll(',', '.'))
        trb += `<tr ${rowClass} data-tipo="${l.type}" data-nro_nv="${l.nro_nv}" data-origen="${l.origen}" data-idservicio="${l.id_producto}" data-nv="${l.id_nv}" data-idnv="${l.id_nv}">
                  <td>${l.code}</td>
                  <td><span${itemClass}>${l.item}</span></td>
                  <td>${l.pu}</td>
                  <td>${l.subtotal}</td>
                  <td>${l.total}</td>
                  <td><input type="text" class="number-input" value="${l.type === 'TITULO' ? '' : formatNumber(0)}" ${l.type === 'TITULO' ? 'readonly' : ''}></td>
              </tr>`
      } else {
        trb += `<tr ${rowClass} data-tipo="${l.type}" data-nro_nv="${l.nro_nv}" data-origen="${l.origen}" data-idservicio="${l.id_producto}" data-nv="${l.id_nv}" data-idnv="${l.id_nv}">
        <td>${l.code}</td>
        <td><span${itemClass}>${l.item}</span></td>
        <td>${pu}</td>
        <td>${l.subtotal}</td>
        <td>${l.total}</td>
        <td><input type="text" class="number-input" value="${l.type === 'TITULO' ? '' : formatNumber(0)}" ${l.type === 'TITULO' ? 'readonly' : ''}></td>
    </tr>`
      }




    });





    // Construir HTML de la tabla
    htmlObj = `<table class="table table-bordered table-hover" style="font-size: 11px;">
                <thead class="thead-dark">
                    <tr>
                        ${thh}
                    </tr>
                </thead>
                <tbody>
                    ${trb}
                </tbody>
            </table>`;

    // Insertar la tabla en el contenedor
    document.querySelector('.master-modal-container div.body').innerHTML = htmlObj

    //Setear monto a repartir
    document.querySelector('.div-reparto').style.display = ''
    const inputReparto = document.querySelector('.div-reparto input')
    inputReparto.value = formatNumber(montoReparto.replaceAll(',', '.'))

    const parseLocalFloat = (stringNumber) => {
      const sanitizedNumber = stringNumber.replace(/\./g, '').replace(',', '.');
      return parseFloat(sanitizedNumber);
    }
    // Guardar el monto original de reparto para hacer calculos
    let montoRepartoOriginal = parseLocalFloat(montoReparto);
    let montoRestante = montoRepartoOriginal;

    document.querySelectorAll('.number-input').forEach(input => {
      let previousValue = 0;

      input.addEventListener('input', function (e) {
        this.value = this.value.replace(/[^\d,]/g, '');
      });

      input.addEventListener('click', function (e) {
        e.target.select();
      });

      input.addEventListener('change', function (e) {
        let number = parseLocalFloat(this.value);


        if (isNaN(number)) {
          number = 0;
        }

        if (e.currentTarget.closest('tr').classList.contains('item-row')) {
          this.value = formatNumber(number);

          

          montoRestante = parseFloat(montoRestante.toFixed(2))
          // Calculo del monto restante
          montoRestante = montoRestante + previousValue - number;

          if (montoRestante >= 0) {
            inputReparto.value = formatNumber(montoRestante);
            previousValue = number;
          } else {
            toastr.warning('El valor ingresado no puede ser mayor al monto por repartir');
            this.value = formatNumber(previousValue);

            montoRestante += number;
          }
        }
      });
    });


    if (!isEventListenerAdded) {
      document.getElementById('mm-actions-save').addEventListener('click', async function (e) {
        const url = window.location.origin + '/node/import-dtc-data';
        const params = '?hostname=' + window.location.origin;


        


        if (Number(inputReparto.value.replace(',', '.')) === 0) {
          const tableBodyModal = document.querySelector('table tbody').children
          const data = getDataTable(tableBodyModal, 'table-modal')
          unaBase.ui.block()


          const importData = await axios({
            method: 'post',
            url: url + params,
            data: {
              lines: data,
              xml: response.data.data[0],
              sid: unaBase.sid.encoded()
            },
          });

          if (importData.data.success) {
            unaBase.ui.unblock()
            document.querySelector('.master-modal-container').style.display = 'none'
            unaBase.loadInto.viewport('/v3/views/compras/content.shtml?id=' + importData.data.id_oc + '&from=self');
          }


        } else {
          toastr.warning('No es posible justificar, aún queda monto por repartir');
        }




      });
      isEventListenerAdded = true
    }

  } catch (error) {
    unaBase.ui.unblock();
    toastr.error('No fue posible realizar la carga de los datos debido a un problema con el servidor, Por favor intente nuevamente. <p><small>Si el inconveniente persiste, por favor comuníquese con Unabase.</small></p>');

    // Puedes loguear el error para debugging si es necesario
    console.error('Error fetching data: ', error);
  }









}



const softlandActions = () => {

  let action = event.target.dataset.action
  var sid = "";
  $.each($.cookie(), function (clave, valor) {
    if (clave == hash && valor.match(/UNABASE/g)) sid = valor;
  });

  var modulo = $("html > body.menu.home > aside > div > div > ul > li.active").data("name").toUpperCase();

  var url = "";
  var ids = [];
  var tipos = [];
  var ids_contabilizado = [];
  var ids_por_emitir = [];
  var ids_cerrada = [];
  var ids_libro_c = [];
  var ids_libro_v = [];
  var ids_libro_boletas = [];
  var ids_libro_otro = [];
  $("#viewport tbody.ui-selectable tr[data-id] td:first-of-type input.selected:checked").each(function () {
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

              
              // $(htmlSubObject).find("#customRadioInline1")[0].checked = true

              htmlSubObject
                .find("#correlativo")
                .on("blur change", function () {
                  
                  htmlSubObject.data("response", $(this).val());
                });
              // htmlSubObject
              // .find('input[type="radio"]')
              // .on("click", function () {
              //     
              //     htmlSubObject.data("action", $(this).val());
              // });
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
                            masterModal(dt)
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
                
                nr = document.querySelector('section div input#correlativo').value
                action = document.querySelector('section div input[type="radio"]:checked').value
                downloadFile(libro_c ? nr : undefined);


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

      if (cerrada) {
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
  }




};


//********************************   TOOLTIPSTERS  ************************************************
//*************************************************************************************************

$('section').on('hover', 'li[data-name="new_export_softland"]', function (event) {
  var element = $(this);
  $(this).tooltipster({
    content: function () {
      let localCurrency = ""
      var htmlObject = `
                <div class="">
                    <div style="background-color: rgb(110, 108, 108);
                        color: white;
                        padding:  15px ;
                        border-radius: 5px;">
                        <div class="row" >
                            <div class="col-6">
                                <button data-action="preview" style="font-size:10px" class="btn btn-success" onclick="softlandActions()">Previsualizar<br><i class="fas fa-eye"></i></button>
                            </div>
                            <div class="col-6 ">
                                <button data-action="download" style="font-size:10px" class="btn btn-info" onclick="softlandActions()">Descargar<br><i class="fas fa-download"></i></button>
                            </div>
                        </div>
                    </div>
                </div>`;


      return htmlObject;
    },
    animation: 'fade',
    interactive: true,
    autoClose: true,
    delay: 200,
    contentAsHTML: true,
    minWidth: 200,
    width: 200,
    minHeight: 50,
    height: 50,
    onlyOne: true,
    position: 'bottom',
    interactiveTolerance: 300,
  });
  $(this).tooltipster('show');
});




