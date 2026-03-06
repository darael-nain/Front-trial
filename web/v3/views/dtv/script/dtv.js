var dtv = {
    "container": $('#sheet-dtv'),
    "containerItems": $('#sheet-dtv').find('table.items > tbody'),
    "containerOrdenIngreso": $('#sheet-dtv').find('table.ordenesingreso tbody'),
    "menubar": $('#menu ul'),
    "valor_impuesto": 0,
    "unidadMedidaItemFEPESelected": "ZZ",
    init: function (id) {
        $.ajax({
            'url': '/4DACTION/_V3_proxy_getDtvContent',
            data: {
                "id": id,
                "api": true
            },
            dataType: 'json',
            async: false,
            success: function (data) {
                dtv.data = data;
            }
        }).fail(function (err, err2, err3) {
            console.log('Error:  ' + err)
            toastr.error('No se logró guardar, reintente o comuniquese con soporte.');
            unaBase.ui.unblock();

        });
        dtv.id = dtv.data.id;
        dtv.valor_impuesto = dtv.data.valor_impuesto;
        // load info
        $('input[name="invoice_number"]').val(dtv.data.valor_param_dtv_nv);
        $('[data-name="tipo_documento"]').text(dtv.data.des_tipo_doc);
        $('[data-name="folio"]').text(dtv.data.folio);
        $('[data-name="fecha_emision"]').text(dtv.data.fecha_emision);
        $('[data-name="referencia"]').text(dtv.data.referencia);
        $('[data-name="estado"]').text(dtv.data.estado);
        $('[data-name="login_registro"]').text(dtv.data.login_registro);
        $('[data-name="fecha_registro"]').text(dtv.data.fecha_registro);
        $('[data-name="hora_registro"]').text(dtv.data.hora_registro);
        $('[name="referencia"]').val(dtv.data.referencia);

        $('[name="des_tipo_doc"]').val(dtv.data.des_tipo_doc);
        $('[name="id_tipo_doc"]').val(dtv.data.id_tipo_doc);
        $('[name="folio"]').val(dtv.data.folio);
        $('[name="folio_siguiente"]').val(dtv.data.folio_siguiente);
        $('[name="fecha_emision"]').val(dtv.data.fecha_emision);
        $('[name="fecha_recepcion"]').val(dtv.data.fecha_recepcion);

        // clientes
        $('[data-name="alias"]').text(dtv.data.cliente.alias);
        $('[data-name="razon"]').text(dtv.data.cliente.razon);
        $('[data-name="contacto"]').text(dtv.data.relacionado.nombre);
        $('[name="contacto[info][alias]"]').val(dtv.data.cliente.alias);

        $('[name="contacto[info][id]"]').val(dtv.data.cliente.id);
        $('[name="contacto[info][razon_social]"]').val(dtv.data.cliente.razon);
        let customRut = ['PEN', 'MXN']
        if (!customRut.includes(currency.code)) {
            $('[name="contacto[info][rut]"]').val(dtv.data.cliente.rut + "-" + dtv.data.cliente.dv);
        } else {
            $('[name="contacto[info][rut]"]').val(dtv.data.cliente.rut + dtv.data.cliente.dv);
        }
        $('[name="contacto[info][giro]"]').val(dtv.data.cliente.giro);

        // contacto
        $('[name="relacionado[info][id]"]').val(dtv.data.relacionado.id);
        $('[name="relacionado[info][nombre]"]').val(dtv.data.relacionado.nombre);
        $('[name="relacionado[info][cargo]"]').val(dtv.data.relacionado.cargo);
        $('[name="relacionado[info][email]"]').val(dtv.data.relacionado.email);

        // forma pago
        $('[name="des_forma_pago"]').val(dtv.data.des_forma_pago);
        $('[name="id_forma_pago"]').val(dtv.data.id_forma_pago);

        $('[name="fecha_vencimiento"]').val(dtv.data.fecha_vencimiento);


        document.querySelector('[name="sub_total"]').value = (unaBase.utilities.transformNumber(currencyConverter(dtv.data.montos.sub_total, dtv.data.exchange.type === dtv.data.exchange.default ? 1 : dtv.data.exchange.rate), 'int'));
        // document.querySelector('[name="descuento"]').value=(unaBase.utilities.transformNumber(currencyConverter(dtv.data.montos.descuento, dtv.data.exchange.type === dtv.data.exchange.default ? 1 : dtv.data.exchange.rate),'int'));
        document.querySelector('[name="exento"]').value = (unaBase.utilities.transformNumber(currencyConverter(dtv.data.montos.exento, dtv.data.exchange.type === dtv.data.exchange.default ? 1 : dtv.data.exchange.rate), 'int'));
        document.querySelector('[name="neto"]').value = (unaBase.utilities.transformNumber(currencyConverter(dtv.data.montos.neto, dtv.data.exchange.type === dtv.data.exchange.default ? 1 : dtv.data.exchange.rate), 'int'));
        document.querySelector('[name="impuesto"]').value = (unaBase.utilities.transformNumber(currencyConverter(dtv.data.montos.iva, dtv.data.exchange.type === dtv.data.exchange.default ? 1 : dtv.data.exchange.rate), 'int'));
        document.querySelector('[name="total"]').value = (unaBase.utilities.transformNumber(currencyConverter(dtv.data.montos.total, dtv.data.exchange.type === dtv.data.exchange.default ? 1 : dtv.data.exchange.rate), 'int'));

        document.querySelector('[name="total_por_cobrar"]').value = (unaBase.utilities.transformNumber(currencyConverter(dtv.data.montos.total_por_cobrar, 1), 'int'));
        document.querySelector('[name="total_cobrado"]').value = (unaBase.utilities.transformNumber(currencyConverter(dtv.data.montos.total_cobrado, 1), 'int'));
        document.querySelector('[name="saldo_por_cobrar"]').value = (unaBase.utilities.transformNumber(currencyConverter(dtv.data.montos.saldo_por_cobrar, 1), 'int'));

        document.querySelector('[name="diff_cambio"]').value = (unaBase.utilities.transformNumber(currencyConverter(dtv.data.montos.diferencia_cambio || 0, 1), 'int'));
        document.querySelector('[name="comision_banco"]').value = (unaBase.utilities.transformNumber(currencyConverter(dtv.data.montos.comision || 0, 1), 'int'));
        $('[name="observacion"]').val(dtv.data.observacion);

        //  document.querySelector('[name="exchange[rate]"]').value=(unaBase.utilities.transformNumber(dtv.data.exchange.rate,'int'));
        // $('[name="exchange[rate]"]').data('oldrate', dtv.data.exchange.rate);


        $('.exchange_label').text(dtv.data.exchange.default);


        $('.exchange_label_change').text(dtv.data.exchange.type);
        $('.exchange_money_factura').text(`${dtv.data.exchange.type} - ${dtv.data.exchange.descripcionMoneda}`)

        dtv.container.find('.numeric.currency input').number(true, 2, ',', '.');

        var labelcurrency = currency.symbol;
        // if (currency.code == "PEN" && dtv.data.exchange.type == "USD") {
        // }
        $('.css-boxtotales label.label-curency-total').text(simbolMoney(dtv.data.exchange.type));

        // load items
        var rows = "";

        dtv.containerItems.find("*").remove();
        $.each(dtv.data.items, function (key, item) {
            var row = '';

            var labelcurrency = currency.symbol;
            if (currency.code == "PEN" && dtv.data.exchange.default == "USD") {
                labelcurrency = "$";
            }

            row += '<tr data-id="' + item.det_id + '" data-key="' + key + '" data-descripcion-larga="' + item.det_descripcion_larga + '">';
            row += '<td style="width:5%"></td>';
            row += '<td class="center" style="width:10%"><input style="padding:2px" class="edit" name="det_codigo" type="text" value="' + item.det_codigo + '"></td>';
            row += '<td style="width:35%"><input style="padding: 2px; text-transform: none !important;" class="edit" name="det_descripcion" type="text" value="' + item.det_descripcion + '"> <span class="ui-icon ui-icon-pencil change descripcion" style="cursor: pointer;" title="Cambiar descripción larga"></span> <span class="ui-icon ui-icon-notice detail descripcion" style="cursor: pointer;"></span></td>';
            row += '<td>' + ((access._1) ? '<a style="text-transform:capitalize;font-weight:bold!important;font-size:10px!important;color:gray!important" style="text-transform:capitalize;font-size:10px!important" href="' + '//' + window.location.host + '/4DACTION/wbienvenidos#negocios/content.shtml?id=' + ((dtv.data.negocio.id > 0) ? dtv.data.negocio.id : item.negocio_id) + '" target="_blank" style="cursor:pointer" title="' + ((dtv.data.negocio.id > 0) ? dtv.data.negocio.referencia : item.negocio_nombre) + '">Neg. Nro. ' + ((dtv.data.negocio.id > 0) ? dtv.data.negocio.folio : item.negocio_folio) + '</a>' : '<label style="color:rgb(103,103,103)">Neg. Nro. ' + ((dtv.data.negocio.id > 0) ? dtv.data.negocio.folio : item.negocio_folio) + '</label>') + '</td>';
            row += '<td style="width:15%;display:none" class="numeric currency right exchange-section">' + dtv.data.exchange.default + ' <span><input disabled style="width:auto" name="det_exchange_monto_facturado" type="text" id="' + key + '_monto" value="' + unaBase.utilities.transformNumber(item.det_precio, 'int') + '"></span></td>';
            row += '<td class="center" style="width:15%"><input style="width: 50px;" disabled name="det_cantidad" type="number" id="' + key + '_cantidad" value="' + item.det_cantidad + '"></td>';
            row += '<td style="width:15%" class="numeric currency right">' + simbolMoney(dtv.data.exchange.type) + ' <span><input disabled style="width:auto" name="det_precio" type="text" id="' + key + '_precioUnitario" value="' + unaBase.utilities.transformNumber(currencyConverter(item.det_precio, dtv.data.exchange.type === dtv.data.exchange.default ? 1 : dtv.data.exchange.rate), 'int') + '"></span></td>';
            row += '<td style="width:15%" class="numeric currency right">' + simbolMoney(dtv.data.exchange.type) + ' <span><input disabled style="width:auto" name="det_subtotal" type="text" id="' + key + '_subtotal" value="' + unaBase.utilities.transformNumber(currencyConverter(item.det_subtotal, dtv.data.exchange.type === dtv.data.exchange.default ? 1 : dtv.data.exchange.rate), 'int') + '"></span></td>';
            row += '</tr>';

            var htmlRow = $(row);

            htmlRow.find('.detail.descripcion').tooltipster({
                content: function () {
                    var htmlObject = $('\
                        <div style="white-space: pre;">' + (item.det_descripcion_larga ? item.det_descripcion_larga : '') + '</div>\
                    ');
                    return htmlObject;
                },
                delay: 0,
                interactiveAutoClose: false,
                contentAsHTML: true
            });

            if (item.det_descripcion_larga == '') {
                htmlRow.find('.detail.descripcion').invisible();
            } else {
                htmlRow.find('.detail.descripcion').visible();
            }
            dtv.containerItems.append(htmlRow);

        });
        //var htmlObject = dtv.containerItems.html(rows);
        var htmlObject = dtv.containerItems;


        // editar items
        htmlObject.find(".edit").change(function () {
            $.ajax({
                'url': '/4DACTION/_V3_setDtv',
                data: {
                    'id': dtv.id,
                    'edit_items': true,
                    'dato_item': $(this).attr("name"),
                    'id_item': $(this).closest("tr").data("id"),
                    'value_item': $(this).val()
                },
                dataType: 'json',
                success: function (data) {
                    if (data.success) {
                        toastr.success("Dato modificado con éxito.");
                    } else {
                        toastr.error("No fue posible modificar el dato. Intente nuevamente.");
                    }
                },
                error: function (xhr, text, error) {
                    toastr.error(NOTIFY.get('ERROR_INTERNAL', 'Error'));
                }
            });
        });

        htmlObject.find('.change.descripcion').click(function (event) {
            var row = $(event.target).closest('tr');
            var htmlObject = $('<section> \
                <span>Ingrese descripción larga</span><br> \
                <textarea name="descripcion_larga"></textarea> \
            </section>');
            htmlObject.find('textarea').val(row.data('descripcion-larga'));
            htmlObject.find('textarea').on('blur change', function () {
                htmlObject.data('response', $(this).val());
            });
            prompt(htmlObject).done(function (data) {
                var text = data;
                if (data !== false) {
                    $.ajax({
                        url: '/4DACTION/_V3_setDtv',
                        data: {
                            'id': dtv.id,
                            'edit_items': true,
                            'dato_item': 'descripcion_larga',
                            'id_item': row.data("id"),
                            'value_item': text
                        },
                        dataType: 'json',
                        success: function (data) {
                            row.data('descripcion-larga', text);
                            toastr.success('Descipción larga cambiada con éxito.');
                            var tooltip = ('<div style="white-space: pre;">' + text + '</div>');
                            row.find('.detail.descripcion').tooltipster('update', text);
                            if (text == '') {
                                row.find('.detail.descripcion').invisible();
                            } else {
                                row.find('.detail.descripcion').visible();
                            }
                        }
                    });
                }
            });
        });


        dtv.containerItems.find('.numeric.currency input').number(true, 2, ',', '.');
        dtv.display();

    },
    set: function (target) {
        switch (target.name) {
            case 'des_tipo_doc':
                dtv.data.id_tipo_doc = $('input[name="id_tipo_doc"]').val();
                dtv.data.des_tipo_doc = target.value;
                break;
            case 'exchange[rate]':
                dtv.data.exchange.rate = unaBase.utilities.transformNumber($('input[name="exchange[rate]"]').val());
                break;
            case 'det_codigo':
            case 'det_descripcion':
            case 'det_cantidad':
            case 'det_precio':
            case 'det_subtotal':
                var key = $(target).closest('tr').data('key');
                dtv.data.items[key][target.name] = target.value;
                break;
            case 'impuesto':
                dtv.data.montos['iva'] = target.value;
                break;
            case 'sub_total':
            case 'descuento':
            // case 'porc_descuento':
            case 'exento':
            case 'neto':
            // case 'adicional':
            case 'total':
                dtv.data.montos[target.name] = target.value;
                update_totales_dtv();
                break;
            default:
                dtv.data[target.name] = target.value;

        }
    },
    menu: function () {
        unaBase.toolbox.init();
        unaBase.toolbox.menu.init({
            entity: 'Dtv',
            buttons: ['save', 'exit', 'delete', 'preview', 'dtv_emitir_manual', 'dtv_emitir_electronico', 'dtv_pdf_electronico', 'emitir-modo-pe-FA', 'dtv_pdf_electronico_FEPE', 'dtv_emitir_bsale', 'dtv_pdf_electronico_bsale'], // los botones dependen si es factura manual o electronica, por emitir o emitida
            data: function () {
                dtv.data.fecha_recepcion = $('input[name="fecha_recepcion"]').val();
                dtv.data.fecha_vencimiento = $('input[name="fecha_vencimiento"]').val();
                dtv.data.cuentactedtv = document.getElementById('cuenta_cte_dtv') ? document.getElementById('cuenta_cte_dtv').value : ''
                dtv.data.invoice_number = $('input[name="invoice_number"]').val();
                return dtv.data;
                //return dtv.container.serializeAnything();
            },
            validate: function () {
                return true;
            }
        });
    },
    display: function () {
        dtv.menubar.find('li[data-name="delete"]').hide();
        dtv.menubar.find('li[data-name="dtv_emitir_manual"]').hide();

        // caso CL
        dtv.menubar.find('li[data-name="dtv_emitir_electronico"]').hide();
        dtv.menubar.find('li[data-name="dtv_emitir_electronico_plane"]').hide();
        dtv.menubar.find('li[data-name="dtv_pdf_electronico"]').hide();

        // PE
        dtv.menubar.find('li[data-name="emitir-modo-pe-FA"]').hide();
        dtv.menubar.find('li[data-name="dtv_pdf_electronico_FEPE"]').hide();


        let objBtnElectronico = dtv.menubar.find('[data-name="dtv_emitir_electronico"]');
        if (currency.code == "PEN") {
            objBtnElectronico = dtv.menubar.find('[data-name="emitir-modo-pe-FA"]');
            //dtv.menubar.find('li[data-name="preview"]').hide();
        }

        if (dtv.data.urlPdfbsale == '') {
            dtv.menubar.find('li[data-name="dtv_pdf_electronico_bsale"]').hide();
        }

        // moneda cambio
        if (dtv.data.exchange.type != "") {
            $('.exchange-section').show();
        }

        // dtv.menubar.find('li[data-name="discard"]').hide();
        switch (dtv.data.estado) {
            case 'POR EMITIR':
                dtv.containerItems.find('input.edit').prop('readonly', false);

                if (access._540) { // eliminar
                    dtv.menubar.find('li[data-name="delete"]').show();
                }

                if (access._543) { // emitir manual
                    dtv.menubar.find('[data-name="dtv_emitir_manual"]').show();
                }

                if ((access._547 && doc_electronico)) { // emitir electrónico
                    objBtnElectronico.show();
                }

                break;
            case 'EMITIDA':
                dtv.container.find('button.edit').hide();
                dtv.container.find('input.edit, textarea.edit').prop('readonly', true).removeClass('datepicker');
                dtv.containerItems.find('input').prop('readonly', true);

                dtv.container.find('input[name="fecha_vencimiento"]').prop('readonly', false).addClass('datepicker');

                dtv.menubar.find('li[data-name="dtv_emitir_bsale"]').hide();
                /*if (access._540 && !doc_electronico) { // eliminar
                dtv.menubar.find('li[data-name="delete"]').show();
            }*/

                if (access._540) { // eliminar
                    dtv.menubar.find('li[data-name="delete"]').show();
                }

                // if ((dtv.data.id_tipo_doc == "33" && doc_electronico)) {
                if (doc_electronico && currency.code != "PEN") {
                    dtv.menubar.find('li[data-name="dtv_pdf_electronico"]').show();
                }

                if (doc_electronico && currency.code == "PEN") {
                    dtv.menubar.find('li[data-name="dtv_pdf_electronico_FEPE"]').show();
                }

                /*if (access._541) { // anular
                    dtv.menubar.find('li[data-name="discard"]').show();
                }*/

                // dtv.container.find('input[name="adicional"]').prop('readonly', false);

                dtv.container.find('button.show').show();

                break;
            case 'PAGADA':
                dtv.containerItems.find('input').prop('readonly', true);

                //if ((dtv.data.id_tipo_doc == "33" && doc_electronico)) {
                if (doc_electronico && currency.code != "PEN") {
                    dtv.menubar.find('li[data-name="dtv_pdf_electronico"]').show();
                }

                if (doc_electronico && currency.code == "PEN") {
                    dtv.menubar.find('li[data-name="dtv_pdf_electronico_FEPE"]').show();
                }

                // dtv.container.find('input[name="adicional"]').prop('readonly', false);

                break;

            case 'ANULADA':
                dtv.containerItems.find('input').prop('readonly', true);

                if ((access._540 && !doc_electronico)) { // eliminar
                    dtv.menubar.find('li[data-name="delete"]').show();
                }

                //if ((dtv.data.id_tipo_doc == "33" && doc_electronico)) {
                if (doc_electronico && currency.code != "PEN") {
                    dtv.menubar.find('li[data-name="dtv_pdf_electronico"]').show();
                }

                if (doc_electronico && currency.code == "PEN") {
                    dtv.menubar.find('li[data-name="dtv_pdf_electronico_FEPE"]').show();
                }

                // Quitar botones agregar OC cliente y NC
                $('button.add.occ').remove();
                $('button.add.nc').remove();
                $('ul.editable input').prop('disabled', true).css('background-color', 'transparent');
                $('ul.editable button').remove();
                dtv.menubar.find('li[data-name="dtv_emitir_bsale"]').hide();

                // cambia a rojo la eqtiqueta cuando está anulada
                $('span[data-name="estado"]').css({ 'color': '#FF7575', 'font-weight': 'bold!important' });

                // hide charges section
                $('.totales-post-save.charges').hide();

                break;
        }

        dtv.menubar.find('li[data-name="dtv_emitir_electronico_plane"]').hide();

        dtv.containerOrdenIngreso.find('*').remove();

        $.ajax({
            url: '/4DACTION/_V3_getIngresosByDtv',
            data: {
                id: dtv.id
            },
            dataType: 'json',
            success: function (data) {
                var rows = data.rows;
                var suma = 0;
                var sumaCobrado = 0;
                for (var i = 0; i < rows.length; i++) {
                    var currentRow = rows[i];
                    if (currentRow.documento != 'Rendición' && currentRow.documento != 'Cobro directo') {

                        dtv.containerOrdenIngreso.append('                                                                      \
                        <tr onclick="dtv.openDialog('+ currentRow.id + ')">    \
                            <td>' + currentRow.folio + '</td>                                                                       \
                            <td>' + currentRow.documento + '</td>                                                               \
                            <td class="left">' + currentRow.proveedor + '</td>                                  \
                            <td class="left">' + currentRow.referencia + '</td>                                 \
                            <td>' + currentRow.fecha + '</td>                                                                       \
                            <td>' + currentRow.estado + '</td>                                                                  \
                            <td>' + currentRow.justificado + '</td>                                                         \
                            <td></td>                                                                                                                       \
                        </tr>                                                                                                                                   \
                        ');
                    } else {
                        dtv.containerOrdenIngreso.append('                                                                      \
                        <tr>    \
                            <td>' + currentRow.folio + '</td>                                                                       \
                            <td>' + currentRow.documento + '</td>                                                               \
                            <td class="left">' + currentRow.proveedor + '</td>                                  \
                            <td class="left">' + currentRow.referencia + '</td>                                 \
                            <td>' + currentRow.fecha + '</td>                                                                       \
                            <td>' + currentRow.estado + '</td>                                                                  \
                            <td>' + currentRow.justificado + '</td>                                                         \
                            <td></td>                                                                                                                       \
                        </tr>                                                                                                                                   \
                        ');
                    }
                    if (currentRow.estado != 'ANULADA')
                        suma += currentRow.justificado_;
                    if (currentRow.estado == 'PAGADA')
                        sumaCobrado += currentRow.justificado_;
                }
                $('[name="dtv[suma_ingresos]"]').val(suma);

                // $('[name="total_cobrado"]').val(sumaCobrado);
                // $('[name="saldo_por_cobrar"]').val($('[name="total_por_cobrar"]').val() - sumaCobrado);

                $('[data-name="estado"]').text(dtv.data.estado);
            }
        });


        //REAPER 

        var section_ftg = $('#section_ftg');
        var table = section_ftg.find('table');
        table.empty();

        var html_ftg = $('<table width="99%">\
                        <thead>\
                            <tr>\
                                <th>Número</th>\
                                <th>Emisor</th>\
                                <th>Emisión</th>\
                                <th>Solicitante</th>\
                                <th>Referencia</th>\
                                <th>Estado</th>\
                                <th>Total pagado</th>\
                                <th>Total ftg</th>\
                            </tr>\
                        </thead>\
                        <tbody class="ui-selectable bg-white"></tbody>\
                    </table>');
        dtv.container.find('footer article#section_ftg').append(html_ftg);



        $.ajax({


            'url': '/4DACTION/_V3_get_doc_asociados_boucher',
            data: {
                "id": dtv.id,
                "doc": "FTG",
                "modulo": "DTV"
            },
            dataType: 'json',
            success: function (data) {
                var htmlObject;
                target = $('#section_ftg table > tbody');
                target.find("*").remove();
                $('#section_ftg h1 > span').text(data.documents.length);
                if (data.documents.length > 0) {
                    $.each(data.documents, function (key, item) {
                        htmlObject = $('<tr data-id="' + item.id + '">' +
                            '<td class="center">' + item.numero + '</td>' +
                            '<td class="center">' + item.login + '</td>' +
                            '<td class="center">' + item.emision + '</td>' +
                            '<td class="left">' + item.proveedor + '</td>' +
                            '<td class="left">' + item.referencia + '</td>' +
                            '<td class="center">' + item.estado + '</td>' +
                            '<td class="center">' + currency.symbol + '<span>' + $.number(item.abono, currency.decimals, currency.decimals_sep, currency.thousands_sep) + '</span></td>' +
                            '<td class="center">' + currency.symbol + '<span>' + $.number(item.total, currency.decimals, currency.decimals_sep, currency.thousands_sep) + '</span></td>' +
                            '</tr>');
                        target.append(htmlObject);
                        htmlObject.click(function () {
                            window.open('/4DACTION/wbienvenidos#compras/content_factoring.shtml?id=' + item.id);
                        });

                        // $('.numeric.currency span').number(true, 0, ',', '.');

                    });
                } else {
                    target.append('<tr><td colspan="7">No existen factoring asociados.</td></tr>');
                }
            }
        });


        //END REAPER




    },
    openDialog: function (id) {
        unaBase.id_ingreso = id
        unaBase.loadInto.dialog("/v3/views/ingresos/dialog/ingreso.shtml?id=" + id, "Orden de ingreso", "x-large");

    },
    getTokenAccess: function () {
        var encodedString = btoa(dtv.data.apiFE.string);
        var formDataToken = {
            "grant_type": "client_credentials"
        };

        var url = dtv.data.apiFE.urlServicio + '/oauth2/token';
        url = url.replaceAll('http', 'https')

        $.ajax({
            "url": url,
            "type": "POST",
            "data": JSON.stringify(formDataToken),
            async: false,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Basic " + encodedString,
                "Cache-Control": "no-cache"
            },
            error: function (xhr, text, error) {

                var myObj = JSON.parse(xhr.responseText);
            }
        }).done(function (response) {
            //
            dtv.data.apiFE.token = response.access_token;
            dtv.data.apiFE.tokenStatus = true;
            $.ajax({
                'url': '/4DACTION/_V3_setUpdateTokenFEPE',
                data: {
                    'tokenFEPE': dtv.data.apiFE.token
                },
                async: false,
                dataType: 'json',
                success: function (data) {
                    if (!data.success) {
                        toastr.error("No se puedo actualizar el Token en el sistema.");
                    }
                },
                error: function (xhr, text, error) {
                    toastr.error(NOTIFY.get('ERROR_INTERNAL', 'Error'));
                }
            });
        });
        return dtv.data.apiFE.token;
    },
    trim: function (cadena) {
        cadena2 = "";
        len = cadena.length;
        for (var i = 0; i <= len; i++) if (cadena.charAt(i) != " ") { cadena2 += cadena.charAt(i); }
        return cadena2;
    },
    esnumero: function (campo) {
        return (!(isNaN(campo)));
    },
    validaRUC: function (valor) {
        valor = dtv.trim(valor)
        if (dtv.esnumero(valor)) {
            if (valor.length == 8) {
                suma = 0
                for (i = 0; i < valor.length - 1; i++) {
                    digito = valor.charAt(i) - '0';
                    if (i == 0) suma += (digito * 2)
                    else suma += (digito * (valor.length - i))
                }
                resto = suma % 11;
                if (resto == 1) resto = 11;
                if (resto + (valor.charAt(valor.length - 1) - '0') == 11) {
                    return true
                }
            } else if (valor.length == 11) {
                suma = 0
                x = 6
                for (i = 0; i < valor.length - 1; i++) {
                    if (i == 4) x = 8
                    digito = valor.charAt(i) - '0';
                    x--
                    if (i == 0) suma += (digito * x)
                    else suma += (digito * x)
                }
                resto = suma % 11;
                resto = 11 - resto

                if (resto >= 10) resto = resto - 10;
                if (resto == valor.charAt(valor.length - 1) - '0') {
                    return true
                }
            }
        }
        return false
    },
    previewFEPE: function () {
        //

        let msj = "";
        let rucin = dtv.data.cliente.rut + dtv.data.cliente.dv;

        if (dtv.data.cliente.razon == "") {
            msj += "- Falta ingresar Razon social del cliente.<br>";
        }

        if (dtv.data.cliente.direccion == "") {
            msj += "- Falta ingresar dirección del cliente.<br>";
        }

        if (rucin.length == 11) {
            if (!dtv.validaRUC(rucin)) {
                msj += "- RUC: " + rucin + " no es valido.<br>";
            }
        } else {
            msj += "- RUC: " + rucin + " no es valido. Debe contener 11 digitos.<br>";
        }

        /*if (dtv.data.occ.numero == "") {
            msj+= "- Falta ingresar orden de compra del cliente.<br>";
        }*/

        var iddtv = dtv.id;
        if (msj == "") {
            unaBase.loadInto.dialog('/v3/views/dtv/dialog/confirmFEPE.shtml?id=' + iddtv, 'CONFIRMACIÓN ANTES DE ENVIAR', 'medium');
        } else {
            toastr.error(msj);
        }
    },
    sendFEPE: function () {
        var status = true;
        var tasaIgv = dtv.data.tasaIGVIVA;
        var tasaIgvmasUno = tasaIgv + 1;
        var detalles = [];
        var mntExe = 0;
        $.each(dtv.data.items, function (key, item) {
            item.unidadMedidaItemFEPE = dtv.unidadMedidaItemFEPESelected;
            if (dtv.data.des_tipo_doc.includes('INAFECTA')) {
                mntExe = item.det_subtotal;
                tasaIgvmasUno = 1
                //tasaIgv = 0
                dtv.data.tasaIGVIVA = 1
            }

            var ObjDetail = {
                "codItem": ((item.det_codigo != "") ? item.det_codigo : "10005"),
                "tasaIgv": tasaIgv,
                "montoIgv": dtv.data.des_tipo_doc.includes('INAFECTA') ? 0 : item.det_subtotal * dtv.data.tasaIGVIVA,
                "montoItem": item.det_subtotal,
                "nombreItem": item.det_descripcion,
                "precioItem": item.det_precio * tasaIgvmasUno,
                "idOperacion": item.det_id,
                "cantidadItem": item.det_cantidad,
                "codAfectacionIgv": dtv.data.codigoTipoAfectacionFEPE, // 10 Gravado - Operación Onerosa // 30 = Inafecto - Operación Onerosa
                "precioItemSinIgv": item.det_precio,
                "unidadMedidaItem": item.unidadMedidaItemFEPE // sino existe unidad dejar como NIU // ZZ= servicio y NIU=producto

            }
            detalles.push(ObjDetail);
        });

        if (dtv.data.occ.numero != "") {
            // con occ
            if (dtv.data.detraccion.monto > 0) {
                if (dtv.data.forma_pago == "credito") {

                    var formData = {
                        "detalle": detalles,
                        "impuesto": [
                            {
                                "codImpuesto": "1000",
                                "tasaImpuesto": tasaIgv,
                                "montoImpuesto": dtv.data.montos.iva
                            }
                        ],
                        "documento": {
                            "serie": dtv.data.serieActualFE,
                            "mntNeto": dtv.data.montos.neto,
                            "mntTotal": dtv.data.montos.total,
                            "tipoMoneda": ((dtv.data.exchange.type == "") ? dtv.data.exchange.default : dtv.data.exchange.type),
                            "correlativo": dtv.data.folioNextFE,
                            "mntTotalIgv": dtv.data.montos.iva,
                            "nombreEmisor": dtv.data.emisor.razon,
                            "numDocEmisor": dtv.data.emisor.nrodoc,
                            "tipoDocEmisor": "6",
                            "nombreReceptor": dtv.data.cliente.razon,
                            "numDocReceptor": dtv.data.cliente.rut + dtv.data.cliente.dv,
                            "direccionOrigen": dtv.data.emisor.direccion,
                            "direccionUbigeo": "150101", // LIMA
                            "tipoDocReceptor": "6", // 6=RUC // 1=DNI
                            "mntExe": mntExe,
                            "direccionDestino": dtv.data.cliente.direccion,
                            "tipoCambioDestino": dtv.data.exchange.rate,
                            "fechaVencimiento": dtv.data.fecha_vencimiento_formato_FE,
                            "tipoFormatoRepresentacionImpresa": "GENERAL",
                            "mntNetoCreditoPendientePago": dtv.data.montos.total - dtv.data.detraccion.monto,
                            "tipoMonedaCreditoPendientePago": ((dtv.data.exchange.type == "") ? dtv.data.exchange.default : dtv.data.exchange.type)
                        },
                        "cuotasPagoCredito": [
                            {
                                "nroCuota": 1,
                                "mntTotalCuota": dtv.data.montos.total - dtv.data.detraccion.monto,
                                "fechaPagoCuota": dtv.data.fecha_vencimiento_formato_FE,
                                "tipoMonedaCuota": ((dtv.data.exchange.type == "") ? dtv.data.exchange.default : dtv.data.exchange.type),
                            }
                        ],
                        "fechaEmision": dtv.data.fecha_emision_formato_FE,
                        "idTransaccion": dtv.data.serieActualFE + "-" + dtv.data.folioNextFE + "-" + dtv.data.id, //ej:F011-48047-01
                        "tipoDocumento": dtv.data.tipoDocumentoFEPE, // 01 = factura, 03 = boletas
                        "correoReceptor": dtv.data.cliente.email_receptor_fe,
                        "datosAdicionales": {
                            "ordenCompra": dtv.data.occ.numero,
                            "fechaRecepcion": dtv.data.occ.fecha,
                            "observacion": dtv.data.observacion
                        },
                        "ordenCompra": {
                            "numeroOrden": dtv.data.occ.numero,
                            "fechaEmisionOrden": dtv.data.occ.fecha_american
                        },
                        "detraccion": {
                            "monto": dtv.data.detraccion.monto,
                            "codigoBBSS": dtv.data.detraccion.codigoBBSS,
                            "porcentaje": dtv.data.detraccion.porcentaje,
                            "numeroCtaBN": dtv.data.detraccion.numeroCtaBN
                        }
                    };
                } else {

                    var formData = {
                        "detalle": detalles,
                        "impuesto": [
                            {
                                "codImpuesto": "1000",
                                "tasaImpuesto": tasaIgv,
                                "montoImpuesto": dtv.data.montos.iva
                            }
                        ],
                        "documento": {
                            "serie": dtv.data.serieActualFE,
                            "mntNeto": dtv.data.montos.neto,
                            "mntTotal": dtv.data.montos.total,
                            "tipoMoneda": ((dtv.data.exchange.type == "") ? dtv.data.exchange.default : dtv.data.exchange.type),
                            "correlativo": dtv.data.folioNextFE,
                            "mntTotalIgv": dtv.data.montos.iva,
                            "nombreEmisor": dtv.data.emisor.razon,
                            "numDocEmisor": dtv.data.emisor.nrodoc,
                            "tipoDocEmisor": "6",
                            "nombreReceptor": dtv.data.cliente.razon,
                            "numDocReceptor": dtv.data.cliente.rut + dtv.data.cliente.dv,
                            "direccionOrigen": dtv.data.emisor.direccion,
                            "direccionUbigeo": "150101", // LIMA
                            "tipoDocReceptor": "6", // 6=RUC // 1=DNI
                            "mntExe": mntExe,
                            "direccionDestino": dtv.data.cliente.direccion,
                            "tipoCambioDestino": dtv.data.exchange.rate,
                            "fechaVencimiento": dtv.data.fecha_vencimiento_formato_FE,
                            "tipoFormatoRepresentacionImpresa": "GENERAL"
                        },
                        "fechaEmision": dtv.data.fecha_emision_formato_FE,
                        "idTransaccion": dtv.data.serieActualFE + "-" + dtv.data.folioNextFE + "-" + dtv.data.id, //ej:F011-48047-01
                        "tipoDocumento": dtv.data.tipoDocumentoFEPE, // 01 = factura, 03 = boletas
                        "correoReceptor": dtv.data.cliente.email_receptor_fe,
                        "datosAdicionales": {
                            "ordenCompra": dtv.data.occ.numero,
                            "fechaRecepcion": dtv.data.occ.fecha,
                            "observacion": dtv.data.observacion
                        },
                        "ordenCompra": {
                            "numeroOrden": dtv.data.occ.numero,
                            "fechaEmisionOrden": dtv.data.occ.fecha_american
                        },
                        "detraccion": {
                            "monto": dtv.data.detraccion.monto,
                            "codigoBBSS": dtv.data.detraccion.codigoBBSS,
                            "porcentaje": dtv.data.detraccion.porcentaje,
                            "numeroCtaBN": dtv.data.detraccion.numeroCtaBN
                        }
                    };

                }

            } else {
                if (dtv.data.forma_pago == "credito") {
                    var formData = {
                        "detalle": detalles,
                        "impuesto": [
                            {
                                "codImpuesto": "1000",
                                "tasaImpuesto": tasaIgv,
                                "montoImpuesto": dtv.data.montos.iva
                            }
                        ],
                        "documento": {
                            "serie": dtv.data.serieActualFE,
                            "mntNeto": dtv.data.montos.neto,
                            "mntTotal": dtv.data.montos.total,
                            "tipoMoneda": ((dtv.data.exchange.type == "") ? dtv.data.exchange.default : dtv.data.exchange.type),
                            "correlativo": dtv.data.folioNextFE,
                            "mntTotalIgv": dtv.data.montos.iva,
                            "nombreEmisor": dtv.data.emisor.razon,
                            "numDocEmisor": dtv.data.emisor.nrodoc,
                            "tipoDocEmisor": "6",
                            "nombreReceptor": dtv.data.cliente.razon,
                            "numDocReceptor": dtv.data.cliente.rut + dtv.data.cliente.dv,
                            "direccionOrigen": dtv.data.emisor.direccion,
                            "direccionUbigeo": "150101", // LIMA
                            "tipoDocReceptor": "6", // 6=RUC // 1=DNI
                            "mntExe": mntExe,
                            "direccionDestino": dtv.data.cliente.direccion,
                            "tipoCambioDestino": dtv.data.exchange.rate,
                            "fechaVencimiento": dtv.data.fecha_vencimiento_formato_FE,
                            "tipoFormatoRepresentacionImpresa": "GENERAL",
                            "mntNetoCreditoPendientePago": dtv.data.montos.total - dtv.data.detraccion.monto,
                            "tipoMonedaCreditoPendientePago": ((dtv.data.exchange.type == "") ? dtv.data.exchange.default : dtv.data.exchange.type)
                        },
                        "cuotasPagoCredito": [
                            {
                                "nroCuota": 1,
                                "mntTotalCuota": dtv.data.montos.total,
                                "fechaPagoCuota": dtv.data.fecha_vencimiento_formato_FE,
                                "tipoMonedaCuota": ((dtv.data.exchange.type == "") ? dtv.data.exchange.default : dtv.data.exchange.type),
                            }
                        ],
                        "fechaEmision": dtv.data.fecha_emision_formato_FE,
                        "idTransaccion": dtv.data.serieActualFE + "-" + dtv.data.folioNextFE + "-" + dtv.data.id, //ej:F011-48047-01
                        "tipoDocumento": dtv.data.tipoDocumentoFEPE, // 01 = factura, 03 = boletas
                        "correoReceptor": dtv.data.cliente.email_receptor_fe,
                        "datosAdicionales": {
                            "ordenCompra": dtv.data.occ.numero,
                            "fechaRecepcion": dtv.data.occ.fecha,
                            "observacion": dtv.data.observacion
                        },
                        "ordenCompra": {
                            "numeroOrden": dtv.data.occ.numero,
                            "fechaEmisionOrden": dtv.data.occ.fecha_american
                        }
                    };
                } else {
                    var formData = {
                        "detalle": detalles,
                        "impuesto": [
                            {
                                "codImpuesto": "1000",
                                "tasaImpuesto": tasaIgv,
                                "montoImpuesto": dtv.data.montos.iva
                            }
                        ],
                        "documento": {
                            "serie": dtv.data.serieActualFE,
                            "mntNeto": dtv.data.montos.neto,
                            "mntTotal": dtv.data.montos.total,
                            "tipoMoneda": ((dtv.data.exchange.type == "") ? dtv.data.exchange.default : dtv.data.exchange.type),
                            "correlativo": dtv.data.folioNextFE,
                            "mntTotalIgv": dtv.data.montos.iva,
                            "nombreEmisor": dtv.data.emisor.razon,
                            "numDocEmisor": dtv.data.emisor.nrodoc,
                            "tipoDocEmisor": "6",
                            "nombreReceptor": dtv.data.cliente.razon,
                            "numDocReceptor": dtv.data.cliente.rut + dtv.data.cliente.dv,
                            "direccionOrigen": dtv.data.emisor.direccion,
                            "direccionUbigeo": "150101", // LIMA
                            "tipoDocReceptor": "6", // 6=RUC // 1=DNI
                            "mntExe": mntExe,
                            "direccionDestino": dtv.data.cliente.direccion,
                            "tipoCambioDestino": dtv.data.exchange.rate,
                            "fechaVencimiento": dtv.data.fecha_vencimiento_formato_FE,
                            "tipoFormatoRepresentacionImpresa": "GENERAL"
                        },
                        "fechaEmision": dtv.data.fecha_emision_formato_FE,
                        "idTransaccion": dtv.data.serieActualFE + "-" + dtv.data.folioNextFE + "-" + dtv.data.id, //ej:F011-48047-01
                        "tipoDocumento": dtv.data.tipoDocumentoFEPE, // 01 = factura, 03 = boletas
                        "correoReceptor": dtv.data.cliente.email_receptor_fe,
                        "datosAdicionales": {
                            "ordenCompra": dtv.data.occ.numero,
                            "fechaRecepcion": dtv.data.occ.fecha,
                            "observacion": dtv.data.observacion
                        },
                        "ordenCompra": {
                            "numeroOrden": dtv.data.occ.numero,
                            "fechaEmisionOrden": dtv.data.occ.fecha_american
                        }
                    };

                }


            }

        } else {
            // sin occ

            if (dtv.data.detraccion.monto > 0) {

                if (dtv.data.forma_pago == "credito") {
                    var formData = {
                        "detalle": detalles,
                        "impuesto": [
                            {
                                "codImpuesto": "1000",
                                "tasaImpuesto": tasaIgv,
                                "montoImpuesto": dtv.data.montos.iva
                            }
                        ],
                        "documento": {
                            "serie": dtv.data.serieActualFE,
                            "mntNeto": dtv.data.montos.neto,
                            "mntTotal": dtv.data.montos.total,
                            "tipoMoneda": ((dtv.data.exchange.type == "") ? dtv.data.exchange.default : dtv.data.exchange.type),
                            "correlativo": dtv.data.folioNextFE,
                            "mntTotalIgv": dtv.data.montos.iva,
                            "nombreEmisor": dtv.data.emisor.razon,
                            "numDocEmisor": dtv.data.emisor.nrodoc,
                            "tipoDocEmisor": "6",
                            "nombreReceptor": dtv.data.cliente.razon,
                            "numDocReceptor": dtv.data.cliente.rut + dtv.data.cliente.dv,
                            "direccionOrigen": dtv.data.emisor.direccion,
                            "direccionUbigeo": "150101", // LIMA
                            "tipoDocReceptor": "6", // 6=RUC // 1=DNI
                            "mntExe": mntExe,
                            "direccionDestino": dtv.data.cliente.direccion,
                            "tipoCambioDestino": dtv.data.exchange.rate,
                            "fechaVencimiento": dtv.data.fecha_vencimiento_formato_FE,
                            "tipoFormatoRepresentacionImpresa": "GENERAL",
                            "mntNetoCreditoPendientePago": dtv.data.montos.total - dtv.data.detraccion.monto,
                            "tipoMonedaCreditoPendientePago": ((dtv.data.exchange.type == "") ? dtv.data.exchange.default : dtv.data.exchange.type)
                        },
                        "cuotasPagoCredito": [
                            {
                                "nroCuota": 1,
                                "mntTotalCuota": dtv.data.montos.total - dtv.data.detraccion.monto,
                                "fechaPagoCuota": dtv.data.fecha_vencimiento_formato_FE,
                                "tipoMonedaCuota": ((dtv.data.exchange.type == "") ? dtv.data.exchange.default : dtv.data.exchange.type),
                            }
                        ],
                        "fechaEmision": dtv.data.fecha_emision_formato_FE,
                        "idTransaccion": dtv.data.serieActualFE + "-" + dtv.data.folioNextFE + "-" + dtv.data.id, //ej:F011-48047-01
                        "tipoDocumento": dtv.data.tipoDocumentoFEPE, // 01 = factura, 03 = boletas
                        "correoReceptor": dtv.data.cliente.email_receptor_fe,
                        "datosAdicionales": {
                            "ordenCompra": dtv.data.occ.numero,
                            "fechaRecepcion": dtv.data.occ.fecha,
                            "observacion": dtv.data.observacion
                        },
                        "detraccion": {
                            "monto": dtv.data.detraccion.monto,
                            "codigoBBSS": dtv.data.detraccion.codigoBBSS,
                            "porcentaje": dtv.data.detraccion.porcentaje,
                            "numeroCtaBN": dtv.data.detraccion.numeroCtaBN
                        }
                    };

                } else {
                    var formData = {
                        "detalle": detalles,
                        "impuesto": [
                            {
                                "codImpuesto": "1000",
                                "tasaImpuesto": tasaIgv,
                                "montoImpuesto": dtv.data.montos.iva
                            }
                        ],
                        "documento": {
                            "serie": dtv.data.serieActualFE,
                            "mntNeto": dtv.data.montos.neto,
                            "mntTotal": dtv.data.montos.total,
                            "tipoMoneda": ((dtv.data.exchange.type == "") ? dtv.data.exchange.default : dtv.data.exchange.type),
                            "correlativo": dtv.data.folioNextFE,
                            "mntTotalIgv": dtv.data.montos.iva,
                            "nombreEmisor": dtv.data.emisor.razon,
                            "numDocEmisor": dtv.data.emisor.nrodoc,
                            "tipoDocEmisor": "6",
                            "nombreReceptor": dtv.data.cliente.razon,
                            "numDocReceptor": dtv.data.cliente.rut + dtv.data.cliente.dv,
                            "direccionOrigen": dtv.data.emisor.direccion,
                            "direccionUbigeo": "150101", // LIMA
                            "tipoDocReceptor": "6", // 6=RUC // 1=DNI
                            "mntExe": mntExe,
                            "direccionDestino": dtv.data.cliente.direccion,
                            "tipoCambioDestino": dtv.data.exchange.rate,
                            "fechaVencimiento": dtv.data.fecha_vencimiento_formato_FE,
                            "tipoFormatoRepresentacionImpresa": "GENERAL"
                        },
                        "fechaEmision": dtv.data.fecha_emision_formato_FE,
                        "idTransaccion": dtv.data.serieActualFE + "-" + dtv.data.folioNextFE + "-" + dtv.data.id, //ej:F011-48047-01
                        "tipoDocumento": dtv.data.tipoDocumentoFEPE, // 01 = factura, 03 = boletas
                        "correoReceptor": dtv.data.cliente.email_receptor_fe,
                        "datosAdicionales": {
                            "ordenCompra": dtv.data.occ.numero,
                            "fechaRecepcion": dtv.data.occ.fecha,
                            "observacion": dtv.data.observacion
                        },
                        "detraccion": {
                            "monto": dtv.data.detraccion.monto,
                            "codigoBBSS": dtv.data.detraccion.codigoBBSS,
                            "porcentaje": dtv.data.detraccion.porcentaje,
                            "numeroCtaBN": dtv.data.detraccion.numeroCtaBN
                        }
                    };

                }



            } else {

                if (dtv.data.forma_pago == "credito") {

                    var formData = {
                        "detalle": detalles,
                        "impuesto": [
                            {
                                "codImpuesto": "1000",
                                "tasaImpuesto": tasaIgv,
                                "montoImpuesto": dtv.data.montos.iva
                            }
                        ],
                        "documento": {
                            "serie": dtv.data.serieActualFE,
                            "mntNeto": dtv.data.montos.neto,
                            "mntTotal": dtv.data.montos.total,
                            "tipoMoneda": ((dtv.data.exchange.type == "") ? dtv.data.exchange.default : dtv.data.exchange.type),
                            "correlativo": dtv.data.folioNextFE,
                            "mntTotalIgv": dtv.data.montos.iva,
                            "nombreEmisor": dtv.data.emisor.razon,
                            "numDocEmisor": dtv.data.emisor.nrodoc,
                            "tipoDocEmisor": "6",
                            "nombreReceptor": dtv.data.cliente.razon,
                            "numDocReceptor": dtv.data.cliente.rut + dtv.data.cliente.dv,
                            "direccionOrigen": dtv.data.emisor.direccion,
                            "direccionUbigeo": "150101", // LIMA
                            "tipoDocReceptor": "6", // 6=RUC // 1=DNI
                            "mntExe": mntExe,
                            "direccionDestino": dtv.data.cliente.direccion,
                            "tipoCambioDestino": dtv.data.exchange.rate,
                            "fechaVencimiento": dtv.data.fecha_vencimiento_formato_FE,
                            "tipoFormatoRepresentacionImpresa": "GENERAL",
                            "mntNetoCreditoPendientePago": dtv.data.montos.total - dtv.data.detraccion.monto,
                            "tipoMonedaCreditoPendientePago": ((dtv.data.exchange.type == "") ? dtv.data.exchange.default : dtv.data.exchange.type)
                        },
                        "cuotasPagoCredito": [
                            {
                                "nroCuota": 1,
                                "mntTotalCuota": dtv.data.montos.total,
                                "fechaPagoCuota": dtv.data.fecha_vencimiento_formato_FE,
                                "tipoMonedaCuota": ((dtv.data.exchange.type == "") ? dtv.data.exchange.default : dtv.data.exchange.type),
                            }
                        ],
                        "fechaEmision": dtv.data.fecha_emision_formato_FE,
                        "idTransaccion": dtv.data.serieActualFE + "-" + dtv.data.folioNextFE + "-" + dtv.data.id, //ej:F011-48047-01
                        "tipoDocumento": dtv.data.tipoDocumentoFEPE, // 01 = factura, 03 = boletas
                        "correoReceptor": dtv.data.cliente.email_receptor_fe,
                        "datosAdicionales": {
                            "ordenCompra": dtv.data.occ.numero,
                            "fechaRecepcion": dtv.data.occ.fecha,
                            "observacion": dtv.data.observacion
                        }
                    };
                } else {
                    var formData = {
                        "detalle": detalles,
                        "impuesto": [
                            {
                                "codImpuesto": "1000",
                                "tasaImpuesto": tasaIgv,
                                "montoImpuesto": dtv.data.montos.iva
                            }
                        ],
                        "documento": {
                            "serie": dtv.data.serieActualFE,
                            "mntNeto": dtv.data.montos.neto,
                            "mntTotal": dtv.data.montos.total,
                            "tipoMoneda": ((dtv.data.exchange.type == "") ? dtv.data.exchange.default : dtv.data.exchange.type),
                            "correlativo": dtv.data.folioNextFE,
                            "mntTotalIgv": dtv.data.montos.iva,
                            "nombreEmisor": dtv.data.emisor.razon,
                            "numDocEmisor": dtv.data.emisor.nrodoc,
                            "tipoDocEmisor": "6",
                            "nombreReceptor": dtv.data.cliente.razon,
                            "numDocReceptor": dtv.data.cliente.rut + dtv.data.cliente.dv,
                            "direccionOrigen": dtv.data.emisor.direccion,
                            "direccionUbigeo": "150101", // LIMA
                            "tipoDocReceptor": "6", // 6=RUC // 1=DNI
                            "mntExe": mntExe,
                            "direccionDestino": dtv.data.cliente.direccion,
                            "tipoCambioDestino": dtv.data.exchange.rate,
                            "fechaVencimiento": dtv.data.fecha_vencimiento_formato_FE,
                            "tipoFormatoRepresentacionImpresa": "GENERAL"
                        },
                        "fechaEmision": dtv.data.fecha_emision_formato_FE,
                        "idTransaccion": dtv.data.serieActualFE + "-" + dtv.data.folioNextFE + "-" + dtv.data.id, //ej:F011-48047-01
                        "tipoDocumento": dtv.data.tipoDocumentoFEPE, // 01 = factura, 03 = boletas
                        "correoReceptor": dtv.data.cliente.email_receptor_fe,
                        "datosAdicionales": {
                            "ordenCompra": dtv.data.occ.numero,
                            "fechaRecepcion": dtv.data.occ.fecha,
                            "observacion": dtv.data.observacion
                        }
                    };

                }



            }


        }

        // comprueba si la fecha vcto viene con dato, sino no lo envia.
        if (dtv.data.fecha_vencimiento_formato_FE != "") {
            formData.documento.fechaVencimiento = dtv.data.fecha_vencimiento_formato_FE;
        }


        //console.log("SE ENVIARA:")
        console.log(JSON.stringify(formData));

        var url = dtv.data.apiFE.urlServicio + '/emission/documents';
        url = url.replaceAll('http', 'https')

        $.ajax({
            "url": url,
            "type": "POST",
            "data": JSON.stringify(formData),
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + dtv.data.apiFE.token,
                "Cache-Control": "no-cache"
            },
            async: false,
            error: function (xhr, text, error) {
                var myObj = JSON.parse(xhr.responseText);
                toastr.error(myObj.errors[0].detail + ". Intenta enviar nuevamente.");
                if (myObj.errors[0].status == 401 && myObj.errors[0].code == "10") {
                    dtv.getTokenAccess();
                }
                status = false;
            }
        }).done(function (response) {
            switch (response.data.estadoEmision) {
                case 'A':
                    toastr.success("Documento aceptado!");
                    dtv.setPostFE();
                    status = true;
                    break;
                case 'E':
                    toastr.success("Enviado a SUNAT");
                    dtv.setPostFE();
                    status = true;
                    break;
                case 'N':
                    toastr.warning("Envio Erroneo. Revisar con soporte.");
                    status = false;
                    break;
                case 'O':
                    toastr.warning("Aceptado con observación.\n" + response.data.observaciones[0].codigo + ": " + response.data.observaciones[0].mensaje);
                    dtv.setPostFE();
                    status = true;
                    break;
                case 'R':
                    toastr.warning("Documento rechazado!");
                    dtv.setPostFE();
                    status = true;
                    break;
                case 'P':
                    toastr.warning("Pendiente de envió SUNAT (Recibido por PSE).");
                    dtv.setPostFE();
                    status = true;
                    break;
                default:
                    toastr.warning("Estado desconocido. Revisar con soporte.");
                    status = false;
            }
        });

        return status;

    },
    getFiles: function () {
        let name = dtv.data.emisor.nrodoc + "-" + dtv.data.tipoDocumentoFEPE + "-" + dtv.data.folio;
        let ID = "6-" + name;
        let url = dtv.data.apiFE.urlServicio + '/download/documents/' + ID;
        url = url.replaceAll('http', 'https')

        $.ajax({
            "url": url,
            "type": "GET",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + dtv.data.apiFE.token,
                "Cache-Control": "no-cache"
            },
            async: false,
            error: function (xhr, text, error) {
                var myObj = JSON.parse(xhr.responseText);
                if (myObj.errors[0].status == 404) {
                    toastr.error("Documento no se encuentra disponible.");
                } else {
                    if (myObj.errors[0].status == 401 && myObj.errors[0].code == "10") {
                        toastr.error(myObj.errors[0].detail + ". Vuelva a intentar.");
                        dtv.getTokenAccess();
                    } else {
                        toastr.error(myObj.errors[0].detail);
                    }
                }
            }
        }).done(function (response) {
            var result = response.data;

            toastr.success("Documentos obtenidos con éxito!");
            const base64URL = "data:application/pdf;base64," + result.pdf;
            const linkSource = base64URL;
            const downloadLink = document.createElement("a");
            const fileName = name + ".pdf";
            downloadLink.href = linkSource;
            downloadLink.download = fileName;
            downloadLink.click();

            const base64URL2 = "data:application/xml;base64," + result.xml;
            const linkSource2 = base64URL2;
            const downloadLink2 = document.createElement("a");
            const fileName2 = name + ".xml";
            downloadLink2.href = linkSource2;
            downloadLink2.download = fileName2;
            downloadLink2.click();
        });
    },
    setPostFE: function () {
        $.ajax({
            'url': '/4DACTION/_V3_setDtv',
            data: {
                'id': dtv.id,
                'SET_POST_FE_PEN': true,
                'SET_POST_FE_PEN_FOLIO': dtv.data.folioNextFE,
                'SET_POST_FE_PEN_SERIE_FOLIO': dtv.data.serieActualFE + "-" + dtv.data.folioNextFE,
                'SET_POST_FE_PEN_EMISION': dtv.data.fecha_emision_formato_FE,
                'SET_POST_FE_SERIE': dtv.data.serieActualFE
            },
            dataType: 'json',
            success: function (data) {
                if (data.success) {
                    dtv.data.folio = dtv.data.serieActualFE + "-" + dtv.data.folioNextFE;
                    toastr.success("Datos actualizados con éxito!");
                    unaBase.loadInto.viewport('/v3/views/dtv/content.shtml?id=' + dtv.id, undefined, undefined, true);
                } else {
                    toastr.error("No se pudo actualizar el correlativo. Es necesario ajustar manualmente el folio antes del próximo envio. \nSi tienes dudas comuníquese con soporte.");
                }
            },
            error: function (xhr, text, error) {
                toastr.error(NOTIFY.get('ERROR_INTERNAL', 'Error'));
            }
        });
    },
    checkOc: function () {
        alert("ASD")
    },
    getDataDtv: function (id) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/4DACTION/_force_getLastFolioFactura',
                data: {
                    "id": id,
                    "api": true
                },
                dataType: 'json',
                success: function (data) {
                    resolve(data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    reject(errorThrown);
                }
            });
        });
    }

}

// Fuctions
function currencyConverter(amount, exchange) {
    const amountFloat = parseFloat(amount);
    const exchangeFloat = parseFloat(exchange === 0 ? 1 : exchange);

    if (isNaN(amountFloat) || isNaN(exchangeFloat)) {
        throw new Error('Ambos parámetros deben ser números válidos.');
    }

    const result = parseFloat(amountFloat / exchangeFloat).toFixed(3);

    return result;
}

function formatAmount(numero) {
    if (typeof numero !== 'number') throw new Error('El valor pasado no es un número.');

    const separadorDecimal = ",";
    const separadorMiles = ".";

    const numeroCadena = numero.toFixed(3);

    const partes = numeroCadena.split(".");
    let parteEntera = partes[0];
    const parteDecimal = partes[1];

    parteEntera = parteEntera.replace(/\B(?=(\d{3})+(?!\d))/g, separadorMiles);

    const numeroFormateado = `${parteEntera}${separadorDecimal}${parteDecimal}`;

    return numeroFormateado;
}

function simbolMoney(exchangeType) {
    if (exchangeType === 'EUR') return '€'
    if (exchangeType === 'PEN') return 's/.'
    return '$'
}