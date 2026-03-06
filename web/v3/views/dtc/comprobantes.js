var setter = item => (typeof item === "boolean" ? "checked" : "value");
var setterType = type => (type === "checkbox" ? "checked" : "value");
var comprobantes = {
  data: {
    active: null,
    description: null,
    docType: null,
    registryDate: null,
    registryHour: null,
    docDate: null,
    docHour: null,
    id: 0
  },
  container: $("#comprobantes"),
  menubar: $("#menu ul"),
  init: function (id) {
    $.ajax({
      url: "/4DACTION/_V3_proxy_getComprobante",
      data: {
        id: id
      },
      dataType: "json",
      async: false,
      success: function (data) {
        comprobantes.data = data;
        comprobantes.id = data.id;
        if (data.id === 0) {
          data.active = true;
        }

        // domFunc.setList({
        // 	data: data.details,
        // 	selector: "table#detail tbody",
        // 	type: "tr",
        // 	showId: false,
        // 	readOnly: ["codigoCuenta"]
        // });
        let html = "";
        let innerLine = "";
        const container = document.querySelector("table#detail tbody");
        let debe = 0;
        let haber = 0;

        for (let element of data.details) {
          // for (let item in element) {
          //   let cuentaContableButton = "";
          //   // if(item === "cuentaContable"){
          //   cuentaContableButton = `<button style="display:none"  data-id="${
          //     element.id
          //   }" class="show cuentaContable" onClick="comprobantes.showCuentaContable(event)"><span class="ui-icon ui-icon-carat-1-s"></span></button>`;
          //   // }
          //   if (item !== "id") {
          //     innerLine += `<td><input readonly name="${item}" value="${element[item]}" type="${
          //       item === "debe" || item === "haber" ? "number" : "text"
          //     }" />${item === "cuentaContable" ? cuentaContableButton : ""}</td>`;
          //   }
          // }

          cuentaContableButton = `<button style="display:none"  data-id="${element.id
            }" class="show cuentaContable" onClick="comprobantes.showCuentaContable(event)"><span class="ui-icon ui-icon-carat-1-s"></span></button>`;
          const docTypes = {
            DTC: {
              name: folio => `Dtc nro: ${folio}`,
              url: id => `${window.location.origin}/4DACTION/wbienvenidos#dtc/content.shtml?id=${id}`,
              dialog: false
            },
            NC: {
              name: folio => `NC nro: ${folio}`,
              url: id => `${window.location.origin}/4DACTION/wbienvenidos#dtc/contentnc.shtml?id=${id}`,
              dialog: false
            },
            DTV: {
              name: folio => `Dtv nro: ${folio}`,
              url: id => `${window.location.origin}/4DACTION/wbienvenidos#dtv/content.shtml?id=${id}`,
              dialog: false
            },
            NCV: {
              name: folio => `Dtv NC nro: ${folio}`,
              url: id => `${window.location.origin}/4DACTION/wbienvenidos#dtv/nc/content.shtml?id=${id}`,
              dialog: false
            },
            OP: {
              name: folio => `Orden de Pago nro: ${folio}`,
              url: id => `${window.location.origin}/4DACTION/wbienvenidos#pagos/content.shtml?id=${id}`,
              dialog: false
            },
            OC: {
              name: folio => `Orden de compra nro: ${folio}`,
              url: id => `${window.location.origin}/4DACTION/wbienvenidos#compras/content.shtml?id=${id}`,
              dialog: false
            },
            FXR: {
              name: folio => `Rendición nro: ${folio}`,
              url: id => `${window.location.origin}/4DACTION/wbienvenidos#compras/content.shtml?id=${id}`,
              dialog: false
            },
            NV: {
              name: folio => `Negocio nro: ${folio}`,
              url: id => `${window.location.origin}/4DACTION/wbienvenidos#negocios/content.shtml?id=${id}`,
              dialog: false
            },
            OCB: {
              name: folio => `Cobro nro: ${folio}`,
              url: id => `${window.location.origin}/4DACTION/wbienvenidos#pagos/dialog/pago.shtml?id=${id}`,
              dialog: true
            },
            none: {
              name: folio => `Sin documento`,
              url: id => ``,
              dialog: false
            }
          }
          let typeDoc = element.typeDoc !== "" ? element.typeDoc : "none";
          innerLine = `
          <td><a target="_blank" data-dialog=${docTypes[typeDoc].dialog} href="${docTypes[typeDoc].url(element.idDoc)}" >${docTypes[typeDoc].name(element.folioDoc)}</a></td>

          <td><input readonly name="codigoCuenta" value="${element.codigoCuenta}" type="text" /></td>
          <td><input readonly name="cuentaContable" value="${element.cuentaContable}" type="text" />${cuentaContableButton}</td>
          <td class="numeric currency"><input readonly name="debe" value="${element.debe}" type="text" /></td>
          <td class="numeric currency"><input readonly name="haber" value="${element.haber}" type="text" /></td>


          `


          html = $(`<tr data-id="${element.id}">
                                ${innerLine}
                                <td><button class="edit" onClick="comprobantes.edit( event)"><span class="ui-icon ui-icon-pencil"></span></button><button style="display:none" class="save" onClick="comprobantes.save(event)"><span class="ui-icon ui-icon-disk"></span></button></td>                       
                                                       
                                <td><button class="delete" onClick="comprobantes.delete( event)"><span class="ui-icon ui-icon-close"></span></button></td>                       
                            </tr>`);
          innerLine = "";

          $(container).append(html);
          let line = $(html).find('a');
          if (line[0].dataset.dialog === "true") {
            line[0].href = "#";
            line[0].addEventListener("click", function (event) {
              event.preventDefault()
              unaBase.loadInto.dialog('/v3/views/ingresos/dialog/ingreso.shtml?id=' + data.id, 'Ingreso', 'large');
            })
          }
          comprobantes.saveAndAdd($(html));
        }
        // html += `<tr class="totals" >
        //                         <td colspan=2>Total:</td>                                     
        //                         <td ><input disabled value="" class="debe" type="number" /></td>                                     
        //                         <td ><input disabled value="" class="haber" type="number" /></td>  
        //                         <td colspan=2 ><input disabled value="" class="total" type="number" /></td>                                                               
        //                     </tr>`;
        //                     </tr>`;
        html = $(`<tr class="totals" >
                                <td colspan=3>Total:</td>                                     
                                <td class="numeric currency"><input disabled value="" class="debe" type="text" /></td>                                     
                                <td class="numeric currency"><input disabled value="" class="haber" type="text" /></td>  
                                <td colspan=2 class="numeric currency" ><input disabled value="" class="total" type="text" /></td>                                                               
                            </tr>`);
        $(container).append(html);
        // container.innerHTML = html;
        // comprobantes.saveAndAdd($(html));
        comprobantes.calculateTotals();

        domFunc.setFormJquery({
          data,
          disabled: ["registryDate"],
          extraData: true
        });

        
        $("#docDate").datepicker();

        

        $(".numeric.currency input").number(true, currency.decimals, currency.decimals_sep, currency.thousands_sep);
      }
    });
  },
  addAutocomplete(item) {
    $(item)
      .autocomplete({
        source: function (request, response) {
          $.ajax({
            url: "/4DACTION/_V3_getParamContable",
            dataType: "json",
            data: {
              q: request.term
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
        autoFocus: true,
        delay: 0,
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
          //$(this).val(ui.item.text);
          return false;
        },
        response: function (event, ui) { },
        select: function (event, ui) {
          const trId = $(event.target).closest("tr")[0].dataset.id;
          const tr = document.querySelector(`tr[data-id="${trId}"]`);

          tr.querySelector(`td input[name="codigoCuenta"]`).value = ui.item.number;
          tr.querySelector(`td input[name="cuentaContable"]`).value = ui.item.name;

          const cuentaContable = $(tr).find(`input[name="cuentaContable"]`);
          cuentaContable.css("background-color", "inherit");
        }
      })
      .data("ui-autocomplete")._renderItem = function (ul, item) {
        return $(
          '<li><a><strong class="highlight">' +
          item.name +
          "</strong><em>" +
          item.number +
          "</em><span>" +
          item.type +
          "</span></a></li>"
        ).appendTo(ul);
      };
  },
  showCuentaContable(event) {
    const id = event.target.parentNode.dataset.id;
    $(`tr[data-id="${id}"] input[name="cuentaContable"]`)
      .autocomplete("search", "@")
      .focus();
  },
  calculateTotals() {
    const debeValues = document.querySelectorAll('input[name="debe"]');
    const haberValues = document.querySelectorAll('input[name="haber"]');
    let debe = 0;
    let haber = 0;

    // let re = reFromCurrency(currency);
    for (const item of debeValues) {
      // debe += parseFloat(item.value.replace(reThousand,"").replace(reDecimal, ".")) || 0;
      debe += parseStrToInt(item.value, currency) || 0;
    }
    for (const item of haberValues) {
      // haber += parseFloat(item.value.replace(reThousand,"").replace(reDecimal, ".")) || 0;
      haber += parseStrToInt(item.value, currency) || 0;
    }
    // for (const item of debeValues) {
    //   debe += parseFloat(item.value) || 0;
    // }
    // for (const item of haberValues) {
    //   haber += parseFloat(item.value) || 0;
    // }
    const debeInput = document.querySelector("tr.totals input.debe");
    const haberInput = document.querySelector("tr.totals input.haber");
    const totalInput = document.querySelector("tr.totals input.total");

    debeInput.value = debe;
    haberInput.value = haber;
    totalInput.value = Math.abs(debe - haber);
    if (Math.abs(debe - haber) !== 0) totalInput.classList.add("redBold");
    else totalInput.classList.remove("redBold");
    if (debe > haber) {
      haberInput.classList.add("redBold");
      debeInput.classList.remove("redBold");
    } else if (debe < haber) {
      haberInput.classList.remove("redBold");
      debeInput.classList.add("redBold");
    } else {
      haberInput.classList.remove("redBold");
      debeInput.classList.remove("redBold");
    }
  },
  getDetail(id) {
    const detail = document.querySelector(`tr[data-id="${id}"]`);
    return {
      line: detail,
      inputs: detail.querySelectorAll("input")
    };
  },
  block(id) {
    console.log("block");
    const items = document.querySelectorAll(`tr[data-id="${id}"] input`);
    for (const item of items) {
      if (item.name !== "codigoCuenta") item.toggleAttribute("readOnly");
    }
  },
  saveAndAdd(html) {
    html.find(`input[name="haber"]`).keydown(function (event) {
      console.log("on key down");
      console.log(event);
      const keyDown = event.keyCode;

      const cuentaContable = $(this)
        .closest("tr")
        .find(`input[name="cuentaContable"]`);
      if (keyDown === 13 && cuentaContable.val() !== "") {
        $(this)
          .closest("td")
          .next()
          .find("button.save")
          .click();
        unaBase.ui.block();
        setTimeout(() => {
          $(`li[data-name="addDetails"] button`).click();

          unaBase.ui.unblock();
        }, 1000);
      } else if (keyDown === 13 && cuentaContable.val() === "") {
        cuentaContable.css("background-color", "red");
        toastr.warning("Debes seleccionar una cuenta contable.");
      }
    });
  },
  edit: function (event) {
    const id = $(event.target).closest("tr")[0].dataset.id;
    document.querySelector(`tr[data-id="${id}"] button.edit`).style.display = "none";
    document.querySelector(`tr[data-id="${id}"] button.show.cuentaContable`).style.display = "";
    document.querySelector(`tr[data-id="${id}"] button.save`).style.display = "";
    comprobantes.block(id);
  },
  save: function (event) {


    if (comprobantes.id > 0) {
      const tr = $(event.target).closest("tr");
      const id = tr[0].dataset.id;
      const cuentaContable = tr.find(`input[name="cuentaContable"]`);

      if (cuentaContable.val() !== "") {
        document.querySelector(`tr[data-id="${id}"] button.edit`).style.display = "";
        document.querySelector(`tr[data-id="${id}"] button.show.cuentaContable`).style.display =
          "none";
        document.querySelector(`tr[data-id="${id}"] button.save`).style.display = "none";
        comprobantes.block(id);

        const data = domFunc.getObjectFromNodes(comprobantes.getDetail(id).inputs);

        $.ajax({
          url: `/4DACTION/_V3_setComprobanteDetalle`,
          dataType: "json",
          type: "POST",
          data: {
            id,
            ...data,
            idComprobante: comprobantes.id
          }
        }).done(function (data) {
          if (data.success) {
            $(event.target).closest("tr")[0].dataset.id = data.id;
            comprobantes.calculateTotals();
            if (comprobantes.validate()) {
              toastr.success(NOTIFY.get("SUCCESS_SAVE"));
            } else {
              toastr.success(NOTIFY.get("ACCOUNT_WARNING_EQUAL"));
            }
            // unaBase.changeControl.init();
          } else {
            toastr.success(NOTIFY.get("ERROR_INTERNAL"));
          }
        });
      } else {
        cuentaContable.css("background-color", "red");
        toastr.warning("Debes seleccionar una cuenta contable.");
      }
    } else {
      toastr.warning("Debes Guardar el comprobantes antes de agregar un detalle.");
    }
  },
  delete: function (event) {
    const id = $(event.target).closest("tr")[0].dataset.id;

    $.ajax({
      url: `/4DACTION/_V3_setComprobanteDetalle`,
      dataType: "json",
      type: "POST",
      data: {
        delete: true,
        id
      }
    }).done(function (data) {
      if (data.success) {
        const line = document.querySelector(`tr[data-id="${id}"]`);
        line.parentNode.removeChild(line);
        comprobantes.calculateTotals();
        toastr.success(NOTIFY.get("SUCCESS_DELETE"));
      } else {
        toastr.success(NOTIFY.get("ERROR_INTERNAL"));
      }
    });
  },
  validateNumbers() {
    const debeValues = document.querySelectorAll('input[name="debe"]');
    const haberValues = document.querySelectorAll('input[name="haber"]');
    let debe = 0;
    let haber = 0;
    // let patternThousand = `\\${currency.thousands_sep}`;
    // let patternDecimal = `\\${currency.decimals_sep}`;
    // let reThousand = new RegExp(patternThousand, "g");
    // let reDecimal = new RegExp(patternDecimal, "g");

    // let re = reFromCurrency(currency);
    for (const item of debeValues) {
      // debe += parseFloat(item.value.replace(reThousand,"").replace(reDecimal, ".")) || 0;
      debe += parseStrToInt(item.value, currency) || 0;
    }
    for (const item of haberValues) {
      // haber += parseFloat(item.value.replace(reThousand,"").replace(reDecimal, ".")) || 0;
      haber += parseStrToInt(item.value, currency) || 0;
    }

    return debe === haber;
  },
  validate() {
    const docType = document.querySelector(`select[name="docType"]`);
    const description = document.querySelector(`[name="description"]`);

    return docType.value !== "" && description.value !== "";
  },
  menu: function () {
    unaBase.toolbox.init();
    unaBase.toolbox.menu.init({
      entity: "Comprobantes",
      buttons: ["save"],
      data: function () {
        comprobantes.data = domFunc.getDataByClassName("item");
        return comprobantes.data;
      },
      validate: function () {
        return comprobantes.validate();
      }
    });
  }
};

$(document).ready(function () {

  unaBase.ui.block();
  comprobantes.menu();
  comprobantes.init($("#comprobantes").data("id"));
  unaBase.ui.unblock();
  unaBase.ui.expandable.init();

});