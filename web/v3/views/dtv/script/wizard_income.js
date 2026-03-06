var income = {
    "container": $('#dtvporcobrar'),
    "sumatotal": 0,
    "moneda": "",
    menu: function () {
        unaBase.toolbox.menu.init({
            entity: 'dtv_cobros',
            buttons: ["receive_next_step", "receive_previous_step", "generate_installments"]
        });
    },
    dtv: {
        get: function () {
            var selected = $('table.listincome > tbody > tr > td > input:checked');
            var objFinal = {};
            selected.each(function (key, item) {
                var id = $(this).closest("tr").data('id');
                eval("obj = { 'id_dtv_" + id + "': '" + id + "' }");
                $.extend(objFinal, objFinal, obj);
            });

            const openDialog = (id) => {
                const row = document.querySelector(`.step-1 tbody tr[data-id="${id}"]`);
                if (!row) {
                    console.error(`No se encontró la fila con ID: ${id}`);
                    return;
                }
                
                const tipoCambioInput = document.querySelector('.tipo-cambio-ingreso').value;
                const nuevoTipoCambio = parseFloat(tipoCambioInput.replace(/\./g, '').replace(',', '.'));
                console.log(nuevoTipoCambio);

                const diferenciaCambiaria = parseFloat(row.dataset.diffCambiaria || 0); // Obtener el valor actualizado
                const tipoCambioDefault = unaBase.moneyDefault.codigo;
                // Saldo original en la moneda base (EUR en este caso)
                const saldoPorCobrar = parseFloat(row.dataset.saldoporcobrar.replace(',', '.'));
                // Tipo de cambio original y nuevo
                const valorCambioOriginal = parseFloat(row.dataset.valorcambio_r.replace(',', '.'));
                // Cálculo correcto del total cobrado en la moneda local (MXN)
                const totalCobrado = saldoPorCobrar * nuevoTipoCambio; // Multiplicamos el saldo en EUR por el nuevo tipo de cambio
                const saldoPorCobrarOriginal = parseFloat(row.dataset.saldooriginal);
                // Moneda base
                const moneyCode = row.dataset.moneda;
                // Mostrar resultados en consola para depuración
                console.log('Saldo por cobrar (EUR):', saldoPorCobrar);
                console.log('Tipo de cambio original:', valorCambioOriginal);
                console.log('Nuevo tipo de cambio:', nuevoTipoCambio);
                console.log('Total cobrado (MXN):', totalCobrado);


                // Calcular el monto final considerando la comisión bancaria
                let comisionBancaria = parseFloat(row.dataset.comision ? row.dataset.comision.replace(',', '.') : 0);
                const montoCobradoFinal = totalCobrado - (comisionBancaria * nuevoTipoCambio);

                // Eliminar cualquier diálogo previo
                $(`#dialog-${id}`).remove();

                // Crear el contenido del diálogo dinámicamente
                const dialogContent = $(`
                    <div id="dialog-${id}" title="Información">
                        <p class="ingreso">Total a cobrar según factura (${tipoCambioDefault}): <span>${$.number(saldoPorCobrarOriginal, currency.decimals, currency.decimals_sep, currency.thousands_sep)}</span></p>
                        <p class="ingreso">Total cobrado (${tipoCambioDefault}): <span>${$.number(totalCobrado, currency.decimals, currency.decimals_sep, currency.thousands_sep)}</span></p>
                        <p class="ingreso">Diferencia Tipo de Cambio (${tipoCambioDefault}): <span class="diff-cambiaria">${$.number(diferenciaCambiaria, currency.decimals, currency.decimals_sep, currency.thousands_sep)}</span></p>
                        <p class="ingreso"><label for="comision-bancaria-${id}">Comisión bancaria (${moneyCode}):</label>
                        <input type="text" id="comision-bancaria-${id}" class="custom-popover-input comision-input" placeholder="Ingrese la comisión" value="0.00"></p>
                        <p class="ingreso">Monto final cobrado (${tipoCambioDefault}): <span id="monto-final-${id}">${$.number(montoCobradoFinal, currency.decimals, currency.decimals_sep, currency.thousands_sep)}</span></p>
                    </div>
                `);

                dialogContent.find(`#comision-bancaria-${id}`).val(comisionBancaria);
                dialogContent.find(`#comision-bancaria-${id}`).number(true, currency.decimals, currency.decimals_sep, currency.thousands_sep);

                let montoFinal = 0
                // Manejar el cambio dinámico del input de comisión bancaria
                dialogContent.on('input', `#comision-bancaria-${id}`, function () {
                    comisionBancaria = parseFloat($(this).val().replace(',', '.')) || 0;
                    montoFinal = totalCobrado - (comisionBancaria * nuevoTipoCambio);
                    $(`#monto-final-${id}`).text($.number(montoFinal, currency.decimals, currency.decimals_sep, currency.thousands_sep));
                });

                // Inicializar el diálogo
                dialogContent.dialog({
                    modal: true,
                    buttons: {
                        Guardar: function () {
                            const comisionValue = $(`#comision-bancaria-${id}`).val();
                            
                            if (comisionValue != '0') {
                                row.dataset.comision = comisionValue;
                                const montoFinalInput = montoFinal / nuevoTipoCambio
                                row.querySelector('input[name="monto"]').value = $.number(montoFinalInput, currency.decimals, currency.decimals_sep, currency.thousands_sep)
                                row.dataset.saldoporcobrar = montoFinalInput
                            }
                            $(this).dialog("close");
                        },
                        Cancelar: function () {
                            $(this).dialog("close");
                        }
                    },
                    close: function () {
                        $(this).dialog("destroy").remove(); // Elimina el diálogo del DOM
                    }
                });
            };

            const updateDiferenciaCambio = (id) => {
                const row = document.querySelector(`.step-1 tbody tr[data-id="${id}"]`);
                if (!row) {
                    console.error(`No se encontró la fila con ID: ${id}`);
                    return;
                }

                // Obtener valores necesarios
                const tipoCambioOriginal = parseFloat(row.dataset.valorcambio_r.replace(',', '.'));
                const tipoCambioInput = document.querySelector('.tipo-cambio-ingreso').value;
                const nuevoTipoCambio = parseFloat(tipoCambioInput.replace(/\./g, '').replace(',', '.'));
                const saldoPorCobrar = parseFloat(row.dataset.saldoporcobrar.replace(',', '.'));


                const saldoPorCobrarOriginalMXN = saldoPorCobrar * tipoCambioOriginal;
                const saldoPorCobrarNuevoMXN = saldoPorCobrar * nuevoTipoCambio;


                const diferenciaCambiaria = saldoPorCobrarNuevoMXN - saldoPorCobrarOriginalMXN;


                row.setAttribute('data-diff-cambiaria', diferenciaCambiaria);
            };

            // Función para obtener y validar tipo de cambio
            const getTipoCambio = (value) => {
                const parsedValue = parseFloat(value.replace(/\./g, '').replace(',', '.'));
                return (parsedValue === 0 || isNaN(parsedValue)) ? 1 : parsedValue;
            };

            // Función para formatear números
            const formatNumber = (value, decimals) => {
                return $.number(value, decimals, currency.decimals_sep, currency.thousands_sep);
            };

            // Función para crear filas
            const createRow = (item, saldo, saldoFormatted, diferenciaCambio, tipoCambio) => {
                return $(`
                    <tr data-id="${item.id}" data-idcli="${item.idcliente}" data-saldoporcobrar="${saldo}" 
                        data-saldooriginal="${item.saldo}" data-moneda="${item.tipo_moneda}" 
                        data-valorcambio="${tipoCambio}" data-valorcambio_r="${item.valor_cambio}" 
                        data-diff-cambiaria="${diferenciaCambio}">
                        <td>${item.numero}</td>
                        <td class="left">${item.cliente}</td>
                        <td class="center">${item.fecha_factura}</td>
                        <td class="numeric currency right">${item.tipo_moneda} <span style="font-weight:bold;padding:5px">${saldoFormatted}</span></td>
                        <td class="numeric percent modoperu">
                            <input style="width:30px;" class="fill2" type="text" name="porcentaje" value="100" data-porcentaje="100"> %
                        </td>
                        <td class="numeric currency">
                            <input class="fill1" name="monto" data-saldoactual="${saldo}" type="text" value="${saldoFormatted}">
                        </td>
                        <td class="numeric currency right">${item.tipo_moneda} <span data-saldofinal style="font-weight:bold;padding:5px">0</span></td>
                        <td class="center action-icon">
                            ${item.tipo_moneda != "CLP" ? `<button class="detail-dialog${item.id}" data-id="${item.id}" style="cursor: pointer; color: #007bff; font-size: 18px;">
                            <i class="fas fa-info-circle"></i>
                        </button>` : ""}
                            
                        </td>
                    </tr>
                `);
            };

            // Función para manejar eventos en cada fila
            const attachEventHandlers = (row, saldo) => {
                // Evento para abrir el diálogo
                row.find(`button.detail-dialog${row.data('id')}`).on('click', (event) => {
                    const id = $(event.currentTarget).data('id'); // Usamos `currentTarget` para asegurarnos de que el botón correcto sea identificado
                    updateDiferenciaCambio(id);
                    openDialog(id);
                });

                // Evento para manejar el monto
                row.find('input[name="monto"]').on('blur', (event) => {
                    const input = $(event.target);
                    const montoIngresado = parseFloat(input.val());
                    const saldoActual = parseFloat(input.data("saldoactual"));
                    const saldoFinal = saldoActual - montoIngresado;

                    input.closest('tr').find("span[data-saldofinal]").text(formatNumber(saldoFinal, currency.decimals));
                    input.data('saldoactual', montoIngresado);

                    if (saldoFinal < 0) {
                        alert("Ha excedido monto por cobrar. Por favor reingrese monto.");
                        input.val(saldoActual).focus();
                    }

                    income.updateSuma();
                });

                // Evento para manejar el porcentaje
                row.find('input[name="porcentaje"]').on('blur', (event) => {
                    const input = $(event.target);
                    const percent = parseFloat(input.val());

                    if (percent > 0 && percent <= 100) {
                        const target = input.closest('tr');
                        const saldoPorCobrar = parseFloat(target.data("saldoporcobrar"));
                        const montoIngresado = (percent / 100) * saldoPorCobrar;
                        const saldoFinal = saldoPorCobrar - montoIngresado;

                        target.find('input[name="monto"]').val(formatNumber(montoIngresado, currency.decimals)).data('saldoactual', montoIngresado);
                        target.find("span[data-saldofinal]").text(formatNumber(saldoFinal, currency.decimals));

                        income.updateSuma();
                    } else {
                        input.val('100');
                    }
                });
            };

            // Función para formatear elementos numéricos
            const formatCurrencyElements = () => {
                $('.numeric.currency input, .numeric.currency span').number(true, currency.decimals, currency.decimals_sep, currency.thousands_sep);
            };

            $.ajax({
                url: '/4DACTION/_V3_get_dtv_to_receive',
                data: objFinal,
                dataType: 'json',
                success: (data) => {
                    const containerTableStep1 = income.container.find('table.step-1 > tbody');
                    containerTableStep1.empty();

                    if (data.rows.length === 0) {
                        containerTableStep1.append('<tr><td colspan="7">Hubo un problema al cargar la lista.</td></tr>');
                        return;
                    }

                    // Obtener tipo de cambio
                    const tipoMoneda = data.rows[0].tipo_moneda;
                    const tipoCambioInput = document.querySelector('.tipo-cambio-ingreso');
                    const nuevoTipoCambioUb = getTipoCambio(unaBase.money.find(u => u.codigo === tipoMoneda)?.value);
                    tipoCambioInput.value = formatNumber(nuevoTipoCambioUb, 4);

                    const nuevoTipoCambio = getTipoCambio(tipoCambioInput.value);

                    // Construir filas
                    data.rows.forEach(item => {
                        const saldoPorCobrar = item.saldo / item.valor_cambio; // Saldo en la moneda original (ejemplo, EUR)
                        const saldoPorCobrarOriginalMXN = saldoPorCobrar * item.valor_cambio; // Saldo original en MXN
                        const saldoPorCobrarNuevoMXN = saldoPorCobrar * nuevoTipoCambio; // Saldo convertido con el nuevo tipo de cambio
                        const diferenciaCambio = saldoPorCobrarNuevoMXN - saldoPorCobrarOriginalMXN; // Diferencia de cambio
                        
                        const saldoFormatted = formatNumber(saldoPorCobrar, currency.decimals);

                        const htmlObject = createRow(item, saldoPorCobrar, saldoFormatted, diferenciaCambio, nuevoTipoCambio);
                        containerTableStep1.append(htmlObject);

                        if (currency.code !== "PEN") {
                            $('.modoperu').hide();
                        }

                        if(item.tipo_moneda == "CLP"){
                            document.querySelector('.diff-cambio').style.display = 'none'
                        }

                        // Manejar eventos
                        attachEventHandlers(htmlObject, saldoPorCobrar);
                    });

                    income.updateSuma();
                    formatCurrencyElements();
                }
            });




        }
    }


    ,
    installments: {
        preview: function () {
            const selected = $('#dtvporcobrar > table.step-1 > tbody > tr');
            const objFinal = { agrupado: false };
            const aIdcliente = [];
            let repetidos = 0;
            // Función para formatear números con todos los decimales
            const formatNumber = (value) => {
                return String(value).replace('.', ','); // Reemplaza el punto decimal por coma
            };

            selected.each((_, item) => {
                const $item = $(item); // Cachear la fila para evitar llamadas repetidas
                const id = $item.data('id');
                const idcli = $item.data('idcli');
                const monto = formatNumber($item.find('input[name="monto"]').data('saldoactual'));
                const moneda = $item.data('moneda');
                const valorCambio = formatNumber($item.data('valorcambio'));
                const diffCambio = formatNumber($item.data('diff-cambiaria'));
                const comision = formatNumber($item.data('comision') || 0);
                const valorCambioOriginal = formatNumber($item.data('valorcambio_r'));
                
                const info = `${id}/${idcli}/${monto}/${moneda}/${valorCambio}/${diffCambio}/${valorCambioOriginal}/${comision}`;
                objFinal[`dtv_${id}`] = info;

                if (aIdcliente.includes(idcli)) {
                    repetidos++;
                }
                aIdcliente.push(idcli);
            });

            if (repetidos > 0) {
                confirm("Existen documentos del mismo cliente. ¿Desea crearlos como cobro agrupado?").done((data) => {
                    objFinal.agrupado = !!data; // Agrupar solo si se confirma
                    income.installments.showcobros(objFinal);
                    income.next.show();
                });
            } else {
                income.installments.showcobros(objFinal);
                income.next.show();
            }
        }
        ,
        showcobros: function (dtvs) {
            if (dtvs) {
                document.querySelector('.diff-cambio').style.display = 'none'
                $.ajax({
                    'url': '/4DACTION/_V3_get_preview_cobros',
                    data: dtvs,
                    dataType: 'json',
                    success: function (data) {
                        var containerTableStep2 = income.container.find('table.step-2 > tbody');
                        var htmlObject2;
                        containerTableStep2.find("*").remove();
                        if (data.rows.length > 0) {
                            $.each(data.rows, function (key, item) {
                                const comision = parseFloat(String(item.comision).replaceAll(',', '.'));
                                const totalConvertido = parseFloat(String(item.total).replaceAll(',', '.'));
                                const valorCambioActual = item.valor_cambio;
                                const diferenciaCambio = parseFloat(String(item.diff_cambio).replace(',', '.'));
                                let totalAjustado = totalConvertido
                                const totalFormateado = $.number(totalConvertido, currency.decimals, currency.decimals_sep, currency.thousands_sep);
                                const totalNoFormat = totalConvertido
                                htmlObject2 = $(`
                                    <tr data-show="${item.show}" data-id="${item.id}" data-dtv="${item.dtv}" 
                                        data-group="${item.group}" data-monto="${item.monto}" 
                                        data-total="${totalNoFormat}" data-cli="${item.idcli}" 
                                        data-diff-cambio="${diferenciaCambio}" data-valorcambio="${valorCambioActual}"
                                        data-moneda="${item.tipo_moneda}" data-comision="${comision}">
                                        <td>S/N</td>
                                        <td class="left">${item.ncli}</td>
                                        <td class="left">
                                            <input class="fill3" type="text" name="cobrara" value="${item.ncli}">
                                        </td>
                                        <td>
                                            <input class="datepicker fill2" placeholder="dd-mm-aaaa" type="text" name="fecha" value="${income.currentdate()}">
                                        </td>
                                        <td class="numeric currency right">
                                            <span style="font-weight:bold;padding:5px">${totalFormateado}</span>
                                        </td>
                                    </tr>
                                `);

                                // Agregar fila a la tabla
                                containerTableStep2.append(htmlObject2);
                            });


                            var cant = $('table.step-2 > tbody > tr[data-show="True"]').length;
                            if (cant == 1) {
                                $('#dtvporcobrar').find('.steps-text').text("SE GENERARÁ " + cant + " ORDEN DE INGRESO");
                            } else {
                                if (cant > 1) {
                                    $('#dtvporcobrar').find('.steps-text').text("SE GENERARÁN " + cant + " ÓRDENES DE INGRESO");
                                }
                            }
                            containerTableStep2.find('tr[data-show="False"]').hide();
                        } else {
                            htmlObject2 = $('<tr><td colspan="7">Hubo un problema al cargar la lista.</td></tr>');
                            containerTableStep2.append(htmlObject2);
                        }

                        $('.numeric.currency span').number(true, currency.decimals, currency.decimals_sep, currency.thousands_sep);

                        // $('.numeric.currency span').number(true, 0, ',', '.');
                        $(".datepicker").datepicker();
                    }
                });
            } else {
                alert("Ocurrió un error al cargar la información. Por favor intente nuevamente.");
            }
        },
        setCobros: async function () {
            var selected = $('#dtvporcobrar > table.step-2 > tbody > tr');
            var cobros = {};
            var cont = 0;
            var crearIngreso = true

            let fechaIngreso = ''

            selected.each(function (key, item) {
                cont++;
                fechaIngreso = item.querySelector('tr[data-show="True"] input[name="fecha"]') ? item.querySelector('tr[data-show="True"] input[name="fecha"]').value : fechaIngreso
                var cli = $(this).data('cli');
                var dtv = $(this).data('dtv');
                var group = $(this).data('group');
                var monto = String($(this).data('monto')).replace('.', ',');
                var fecha = fechaIngreso
                var cobrara = String($(this).find('input[name="cobrara"]').val()).replaceAll('&', '');
                var original = $(this).data('show');
                var moneda = $(this).data('moneda');
                var valorcambio = String($(this).data('valorcambio')).replace('.', ',');
                var diffCambio = String($(this).data('diff-cambio')).replace('.', ',');
                var comision = String($(this).data('comision')).replace('.', ',');
                var info = cli + "&" + dtv + "&" + group + "&" + monto + "&" + fecha + "&" + cobrara + "&" + original + "&" + moneda + "&" + valorcambio + "&" + diffCambio + "&" + comision;
                eval("obj = { 'cobro_" + cont + "': '" + info + "' }");
                $.extend(cobros, cobros, obj);
                var fechaByPeriod = fecha.replace(/^(\d{2})\/(\d{2})\/(\d{4})$/, '$3-$2')
                $.ajax({
                    url: "/4DACTION/_V3_get_estadoPeriodoContable",
                    dataType: "json",
                    type: "POST",
                    data: {
                        periodo: fechaByPeriod,
                        status: true
                    },
                    async: false
                }).done(function (data) {

                    if (data.closed) {
                        crearIngreso = false
                        toastr.warning("La fecha de ingreso pertenece a un periodo cerrado, no puede continuar.");
                    }
                });
            });
            
            if (crearIngreso && cobros) {
                console.log(crearIngreso, cobros)
                unaBase.ui.block();
                $.ajax({
                    url: '/4DACTION/_V3_setOcobrosAgrupados',
                    dataType: 'json',
                    type: 'POST',
                    data: cobros,
                    success: function (data) {
                        if (data.success) {
                            toastr.success('Cobros generados con éxito.');
                            if (data.ocbs.length == 1) {
                                // unaBase.loadInto.viewport('/v3/views/cobros/content.shtml?id=' + data.ocbs[0]);
                                unaBase.ui.unblock();
                                $('.ui-dialog button[title="close"]').trigger('click');
                                unaBase.id_ingreso = data.ocbs[0].id
                                unaBase.loadInto.dialog('/v3/views/ingresos/dialog/ingreso.shtml?id=' + data.ocbs[0].id, 'Orden de ingreso', 'x-large');
                            } else {
                                income.installments.showcobrosCreados(data.ocbs);
                                unaBase.ui.unblock();
                            }
                            $('#search [name="q"]').data("manual", true).trigger('keydown');
                            $('#search [name="q"]').data("manual", true).trigger('keyup');
                        }
                    },
                    error: function (e) {
                        unaBase.ui.unblock();
                        toastr.error('Ha ocurrido un error interno. Por favor comunicarse con soporte.');
                        console.log(e);
                    }
                });
            } else {
                alert("Ocurrió un error al cargar la información. Por favor intente nuevamente.");
            }
        },
        showcobrosCreados: function (cobros) {
            income.container.find('table.step-1').hide();
            income.container.find('table.step-2').hide();
            income.container.find('table.step-3').show();
            $('#dtvporcobrar').find('.steps-labels').text("");
            $('.dialog header').hide();

            if (cobros) {
                var containerTableStep3 = income.container.find('table.step-3 > tbody');
                var htmlObject3;
                containerTableStep3.find("*").remove();
                if (cobros.length > 0) {
                    $.each(cobros, function (key, item) {
                        htmlObject3 = $('<tr data-id="' + item.id + '">' +
                            '<td>' + item.folio + '</td>' +
                            '<td class="left">' + item.cli + '</td>' +
                            '<td class="left">' + item.referencia + '</td>' +
                            '<td class="numeric currency right">' + currency.symbol + ' <span style="font-weight:bold;padding:5px">' + item.monto + '</span></td>' +
                            // '<td><button>+ Doc.</button></td>' +
                            '</tr>');
                        containerTableStep3.append(htmlObject3);
                    });
                    var cant = $('table.step-3 > tbody > tr').length;
                    $('#dtvporcobrar').find('.steps-text').text(cant + " ÓRDENES DE cobros CREADAS");
                } else {
                    htmlObject3 = $('<tr><td colspan="4">Hubo un problema al cargar la lista.</td></tr>');
                    containerTableStep3.append(htmlObject3);
                }

                $('.numeric.currency span').number(true, currency.decimals, currency.decimals_sep, currency.thousands_sep);

                // $('.numeric.currency span').number(true, 0, ',', '.');
                $(".datepicker").datepicker();
            } else {
                alert("Ocurrió un error al cargar la información. Por favor intente nuevamente.");
            }

        },
    },
    next: {
        ini: function () {
            income.installments.preview();
        },
        show: function () {
            income.container.find('table.step-1').hide();
            income.container.find('table.step-2').show();
            $('#dialog-menu ul').find('li[data-name="receive_next_step"]').hide();
            $('#dialog-menu ul').find('li[data-name="receive_previous_step"]').show();
            $('#dialog-menu ul').find('li[data-name="generate_installments"]').show().find('button').addClass('ui-state-hover').find('.ui-button-text').addClass('bold');
            $('#dtvporcobrar').find('.steps-labels').text("Paso 2 de 2");
        }
    },
    previous: function () {
        income.container.find('table.step-1').show();
        income.container.find('table.step-2').hide();
        $('#dialog-menu ul').find('li[data-name="receive_next_step"]').show();
        $('#dialog-menu ul').find('li[data-name="receive_previous_step"]').hide();
        $('#dialog-menu ul').find('li[data-name="generate_installments"]').hide();
        income.container.find('.steps-labels').text("Paso 1 de 2");
        document.querySelector('.diff-cambio').style.display = ''
        $('#dtvporcobrar').find('.steps-text').text("CONFIRMACIÓN DE MONTO");
    },
    display: {
        init: function () {
            $('#dialog-menu ul').find('li[data-name="receive_previous_step"]').hide();
            $('#dialog-menu ul').find('li[data-name="generate_installments"]').hide();
            income.container.find('table.step-2').hide();
            income.container.find('table.step-3').hide();
        }
    },
    currentdate: function () {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        return dd + '/' + mm + '/' + yyyy;
    },
    updateSuma: function () {
        income.sumatotal = 0;
        income.container.find('table.step-1 > tbody').find('tr').each(function (key, item) {
            let target = $(this);
            income.sumatotal = income.sumatotal + parseFloat(String(target.find('input[name="monto"]').data('saldoactual')).replace(',', '.'));
        });

        var symbol = currency.symbol;
        if (income.moneda == "USD") {
            symbol = "USD";
        }

        $('.income-suma > span').text(symbol + " " + $.number(income.sumatotal, currency.decimals, currency.decimals_sep, currency.thousands_sep));

    }
}
$(document).ready(function () {
    income.menu();
    income.dtv.get();
    income.display.init();

    if (currency.code != "PEN") {
        $('.modoperu').hide();
    }
    $('.tipo-cambio-ingreso').number(true, 4, currency.decimals_sep, currency.thousands_sep);


    document.querySelector('.tipo-cambio-ingreso').addEventListener('change', (e) => {
        const nuevoTipoCambio = parseFloat(e.target.value.replace(',', '.'));

        if (isNaN(nuevoTipoCambio) || nuevoTipoCambio <= 0) {
            alert('Por favor ingrese un tipo de cambio válido.');
            return;
        }

        // Actualizar la diferencia cambiaria en cada fila
        document.querySelectorAll('table.step-1 > tbody > tr').forEach(row => {
            const saldoPorCobrar = parseFloat(row.dataset.saldoporcobrar); // Saldo actual en euros
            const saldoOriginal = parseFloat(row.dataset.saldooriginal);  // Saldo original en pesos MXN
            const comision = parseFloat(row.dataset.comision) || 0
            
            if (isNaN(saldoPorCobrar) || isNaN(saldoOriginal)) {
                console.error('Datos inválidos en la fila:', row);
                return;
            }
            // Convertir saldoPorCobrar a pesos utilizando el nuevo tipo de cambio
            const saldoConvertidoAPesos = saldoPorCobrar * nuevoTipoCambio;

            // Calcular la diferencia cambiaria en pesos
            const diferenciaCambiaria = saldoConvertidoAPesos - saldoOriginal;

            // Actualizar el atributo `data-diff-cambiaria` del `<tr>`
            row.setAttribute('data-diff-cambiaria', diferenciaCambiaria);
            row.setAttribute('data-valorcambio', nuevoTipoCambio);
            // (Opcional) Actualizar la UI si se muestra la diferencia cambiaria en pantalla
            const diffElement = row.querySelector('.diff-cambiaria');
            if (diffElement) {
                diffElement.textContent = diferenciaCambiaria.toFixed(2);
            }
        });

        console.log('Diferencias cambiarias actualizadas.');
    });





    $('input[name="percentallcobro"]').blur(function () {
        let percent = parseFloat($(this).val());
        if (percent > 0 && percent <= 100) {
            const containerTableStep1 = income.container.find('table.step-1 > tbody');
            containerTableStep1.find('input[name="porcentaje"]').data('porcentaje', percent).val(percent);

            income.sumatotal = 0;
            containerTableStep1.find('tr').each(function (key, item) {
                let target = $(this);
                let saldoPorCobrar = parseFloat(target.data("saldoporcobrar"));
                let factor = percent / 100;
                let montoIngresado = factor * saldoPorCobrar;
                var saldoFinal = saldoPorCobrar - montoIngresado;
                target.find('input[name="monto"]').val(montoIngresado);
                target.find('input[name="monto"]').data('saldoactual', montoIngresado);
                target.find("span[data-saldofinal]").text($.number(saldoFinal, currency.decimals, currency.decimals_sep, currency.thousands_sep));
            });

            income.updateSuma();


        } else {
            $(this).val('100');
        }
    });

});