const btnSave = document.getElementById('modal-custom-accept')
const btnCancel = document.getElementById('modal-custom-cancel')

const modalCustom = document.getElementById("modalCustom");

const actionModalCustomFactura = async (type) => {
    // =========== Helpers ===========
    const fmt = (n) => (Number(n || 0)).toLocaleString('es-CL');
    const getFechaISOFromDDMMYYYY = (ddmmyyyy) => {
        // dd-mm-aaaa -> aaaa-mm-dd
        if (!ddmmyyyy) return '';
        const [dd, mm, yyyy] = ddmmyyyy.split('-');
        return `${yyyy}-${mm}-${dd}`;
    };
    const diffDiasHoyAbs = (iso) => {
        const f1 = new Date(iso);
        const f2 = new Date();
        return Math.abs(Math.round((f1 - f2) / (1000 * 60 * 60 * 24)));
    };

    // =========== UI: bloquear ===========
    unaBase.ui.block();
    const blockTimeout = setTimeout(() => {
        unaBase.ui.unblock();
        toastr.warning('El proceso está tardando más de lo habitual. Intenta nuevamente si no termina.');
    }, 30000);

    try {
        // =========== 1) Preparar y validar datos de filas ===========
        const rows = document.querySelectorAll('#cuentasTableBody tr');
        const id = document.querySelector('#sheet-dtv').dataset.id;
        const asientoData = [];

        const montoTotalFactura = parseFloat(dtv.data.montos.total) || 0;
        let totalDebe = 0;
        let totalHaber = 0;
        let validRows = true;

        rows.forEach((row) => {
            const cuentaContable = row.querySelector('.cuenta-contable')?.value?.trim();
            const debe = Number((row.querySelector('.input-debe')?.value || '0').replaceAll('.', '').replace(',', '.')) || 0;
            const haber = Number((row.querySelector('.input-haber')?.value || '0').replaceAll('.', '').replace(',', '.')) || 0;
            const fechaContable = document.querySelector(".date-facturar-dtv").value.split("-").reverse().join("-");

            if (!cuentaContable || (!debe && !haber) || (debe && haber)) {
                validRows = false;
            } else {
                totalDebe += debe;
                totalHaber += haber;
                asientoData.push({
                    cuenta: cuentaContable,
                    debe, haber,
                    tipodoc: 'DTV',
                    iddoc: id,
                    fechaEmision: fechaContable
                });
            }
        });

        if (!validRows || asientoData.length === 0) {
            toastr.error('Cada fila debe tener una cuenta contable y solo un valor en Debe o Haber.');
            return;
        }

        if (totalDebe > montoTotalFactura || totalHaber > montoTotalFactura) {
            toastr.error(`El total Debe (${fmt(totalDebe)}) o Haber (${fmt(totalHaber)}) no puede superar el monto total de la factura (${fmt(montoTotalFactura)}).`);
            return;
        }

        if (totalDebe !== totalHaber) {
            toastr.error(`El asiento no está balanceado. Debe: ${fmt(totalDebe)} vs Haber: ${fmt(totalHaber)}. Deben ser iguales.`);
            return;
        }

        // =========== 2) Validaciones cliente / cabecera ===========
        let rut = $('[name="contacto[info][rut]"]').val();
        rut = unaBase.data.rut.format(rut);
        if (!rut || !unaBase.data.rut.validate(rut)) {
            toastr.warning('No es posible emitir el documento: RUT del cliente inválido.');
            return;
        }

        const giro = $('input[name="contacto[info][giro]"]').val() || '';
        if (giro.length > 40) {
            toastr.warning('El giro del cliente excede 40 caracteres. Ajusta la ficha antes de emitir.');
            return;
        }

        // Fecha de emisión (desde input existente dd-mm-aaaa en tu UI)
        const fechaDTV_DDMMYYYY = $('input[name="fecha_emision"]').val(); // dd-mm-aaaa
        const fechaEmisionISO = getFechaISOFromDDMMYYYY(fechaDTV_DDMMYYYY); // aaaa-mm-dd
        if (!fechaEmisionISO) {
            toastr.error('Fecha de emisión inválida.');
            return;
        }
        if (diffDiasHoyAbs(fechaEmisionISO) > 10) {
            toastr.warning('La fecha de emisión no puede superar los 10 días de diferencia con la fecha actual.');
            return;
        }

        const tipo_factura = $('input[name="des_tipo_doc"]').val();

        // =========== 3) Emitir SIEMPRE primero ===========
        const aplicarUITrasEmision = (folio, fechaISO) => {
            const [y, m, d] = (fechaISO || '').split('-');
            $('#sheet-dtv').find('span[data-name="folio"]').text(folio);
            $('#sheet-dtv').find('span[data-name="fecha_emision"]').text(`${d}-${m}-${y}`);
            $('#sheet-dtv').find('span[data-name="estado"]').text('EMITIDA');
            $('#sheet-dtv').find('input[name="folio"]').val(folio);
            $('#sheet-dtv').find('input[name="fecha_emision"]').val(`${d}-${m}-${y}`);
            $('#menu').find('[data-name="dtv_emitir_manual"], [data-name="dtv_emitir_electronico"]').hide();
            $('#menu').find('[data-name="dtv_pdf_electronico"]').show();
            $('#sheet-dtv').find('button.edit').hide();
            $('#sheet-dtv').find('input.edit, textarea.edit').prop('readonly', true).removeClass('datepicker');
            $('#sheet-dtv table.items').find('input').prop('readonly', true);
        };

        const emitirElectronico = () =>
            new Promise((resolve, reject) => {
                $.ajax({
                    url: '/4DACTION/_V3_generadtv_electronico',
                    data: { id, fecha: fechaEmisionISO, tipo_factura },
                    dataType: 'json',
                    type: 'POST'
                }).done((data) => {
                    if (data?.success) {
                        aplicarUITrasEmision(data.index, data.date);
                        toastr.success(`Factura emitida con éxito (Folio ${data.index})`);
                        unaBase.inbox.send({
                            subject: `Ha emitido Factura de venta Nº ${data.index} / ${$('#sheet-dtv span[data-name="referencia"]').text()}`,
                            into: 'viewport',
                            href: `/v3/views/dtv/content.shtml?id=${$('#sheet-dtv').data('id')}`,
                            tag: 'avisos'
                        });
                        // Descargar PDF
                        $.ajax({
                            url: '/4DACTION/_V3_downloadDtv',
                            data: { id: dtv.id, cedible: false },
                            success: (url) => { if (url) window.open(url); }
                        });
                        resolve({ folio: data.index, fechaISO: data.date });
                    } else {
                        toastr.warning(`No se pudo emitir electrónicamente.\n${data?.error || 'Error desconocido'}`);
                        reject(new Error(data?.error || 'Error al emitir DTV electrónico'));
                    }
                }).fail((_, textStatus) => {
                    toastr.error('Error de red al emitir DTV electrónico');
                    reject(new Error(textStatus));
                });
            });

        const emitirManual = async () => {
            const folioManual = document.querySelector('.folio-facturar-dtv')?.value || '';
            const fechaManualISO = document.querySelector('.date-facturar-dtv')?.value || ''; // ya ISO
            const configEmitir = {
                method: 'post',
                url: `${nodeUrl}/emitir-dtv-manual?type=dtv&sid=${unaBase.sid.encoded()}&hostname=${window.location.origin}`,
                data: { id, folio: folioManual, fecha: fechaManualISO, tipo_factura, sid: unaBase.sid.encoded() }
            };
            const r = await axios(configEmitir);
            if (!r?.data?.success) {
                throw new Error(r?.data?.errorMsg || 'Error emitiendo DTV manual');
            }
            const d = r.data.data;
            aplicarUITrasEmision(d.index, d.date);
            toastr.success(`Factura emitida con éxito (Folio ${d.index})`);
            unaBase.inbox.send({
                subject: `Ha emitido Factura de venta Nº ${d.index} / ${$('#sheet-dtv span[data-name="referencia"]').text()}`,
                into: 'viewport',
                href: `/v3/views/dtv/content.shtml?id=${id}`,
                tag: 'avisos'
            });
            return { folio: d.index, fechaISO: d.date };
        };

        let emisionOK;
        if (type === 'electronico') {
            emisionOK = await emitirElectronico();
        } else {
            emisionOK = await emitirManual();
        }

        // =========== 4) SOLO si la emisión fue exitosa, crear asientos ===========
        const fechaContable = document.querySelector('.date-facturar-dtv')?.value
        const cfgAsiento = {
            method: 'post',
            url: `${nodeUrl}/create-asiento-contable?type=dtv&sid=${unaBase.sid.encoded()}&hostname=${window.location.origin}&fecha_contable=${fechaContable}`,
            data: asientoData
        };
        const respAsiento = await axios(cfgAsiento);

        if (respAsiento?.data?.success) {
            toastr.success('Asiento contable creado correctamente.');
            // Cerrar modal y recargar vista
            document.querySelector('#modalCustom').style.display = 'none';
            unaBase.loadInto.viewport(`/v3/views/dtv/content.shtml?id=${id}`, undefined, undefined, true);
        } else {
            toastr.error('La factura fue emitida, pero no se pudo crear el asiento contable.');
            console.warn('Respuesta asiento:', respAsiento?.data);
        }

    } catch (err) {
        console.error('Error general:', err);
        toastr.error('Error inesperado en el proceso.');
    } finally {
        clearTimeout(blockTimeout);
        unaBase.ui.unblock();
    }
};


const actionModalCustomManual = async () => {
    unaBase.ui.block();
    let blockTimeout = setTimeout(() => {
        unaBase.ui.unblock();
        toastr.warning("El proceso está tardando más de lo habitual. Intenta nuevamente si no termina.");
    }, 30000);

    setTimeout(async () => {
        try {
            const rows = document.querySelectorAll("#cuentasTableBody tr");
            const asientoData = [];
            const id = document.querySelector("#sheet-dtv").dataset.id;

            const montoTotalFactura = parseFloat(dtv.data.montos.total) || 0;
            let totalDebe = 0;
            let totalHaber = 0;
            let valid = true;

            rows.forEach((row) => {
                const cuentaContable = row.querySelector(".cuenta-contable").value;
                const debe = parseFloat(row.querySelector(".input-debe").value.replaceAll(".", "") || 0);
                const haber = parseFloat(row.querySelector(".input-haber").value.replaceAll(".", "") || 0);
                const fecha = document.querySelector(".date-facturar-dtv").value.split("-").reverse().join("-");

                if (!cuentaContable || (!debe && !haber) || (debe && haber)) {
                    valid = false;
                    toastr.error("Cada fila debe tener una cuenta contable y solo un valor en Debe o Haber.");
                    return;
                }

                totalDebe += debe;
                totalHaber += haber;
                
                asientoData.push({ cuenta: cuentaContable, debe, haber, tipodoc: "DTV", iddoc: id, fechaEmision: fecha });
            });

            // Validación final: comprobar que la suma de Debe y Haber no exceda el monto total de la factura
            if (totalDebe > montoTotalFactura || totalHaber > montoTotalFactura) {
                toastr.error(`El total de Debe (${totalDebe}) o Haber (${totalHaber}) no puede ser mayor al monto total de la factura (${montoTotalFactura}).`);
                return;
            }

            // Validación fundamental: Debe debe ser igual a Haber (partida doble)
            if (totalDebe !== totalHaber) {
                toastr.error(`El asiento contable no está balanceado. Total Debe: ${totalDebe.toLocaleString()}, Total Haber: ${totalHaber.toLocaleString()}. Ambos valores deben ser iguales.`);
                return;
            }


            if (asientoData.length === 0 || !valid) {
                toastr.error("Debes agregar al menos una cuenta válida.");
                return;
            }

            // Emitir DTV manual
            const tipoFactura = document.querySelector('input[name="des_tipo_doc"]').value;
            const folio = document.querySelector(".folio-facturar-dtv").value;
            const fecha = document.querySelector(".date-facturar-dtv").value;

            // Crear asiento contable
            const config = {
                method: "post",
                url: `${nodeUrl}/create-asiento-contable?type=dtv&sid=${unaBase.sid.encoded()}&hostname=${window.location.origin}&fecha_contable=${fecha}`,
                data: asientoData
            };
            const response = await axios(config);

            if (response.data.success) {
                toastr.success("Asiento contable creado correctamente.");



                const configEmitir = {
                    method: "post",
                    url: `${nodeUrl}/emitir-dtv-manual?type=dtv&sid=${unaBase.sid.encoded()}&hostname=${window.location.origin}`,
                    data: {
                        id: id,
                        folio: folio,
                        fecha: fecha,
                        tipo_factura: tipoFactura,
                        sid: unaBase.sid.encoded()
                    }
                };

                let dtvResponse = await axios(configEmitir);
                if (dtvResponse.data.success) {
                    dtvResponse = dtvResponse.data.data
                    const [year, month, day] = dtvResponse.date.split("-");

                    $("#sheet-dtv").find('span[data-name="folio"]').text(dtvResponse.index);
                    $("#sheet-dtv").find('span[data-name="fecha_emision"]').text(`${day}-${month}-${year}`);
                    $("#sheet-dtv").find('span[data-name="estado"]').text("EMITIDA");
                    $("#sheet-dtv").find('input[name="folio"]').val(dtvResponse.index);
                    $("#sheet-dtv").find('input[name="fecha_emision"]').val(`${day}-${month}-${year}`);

                    $("#menu").find('[data-name="dtv_emitir_manual"], [data-name="dtv_emitir_electronico"]').hide();
                    $("#sheet-dtv").find("button.edit").hide();
                    $("#sheet-dtv").find("input.edit").prop("readonly", true).removeClass("datepicker");
                    $("#sheet-dtv table.items").find("input").prop("readonly", true);

                    toastr.success(`Factura emitida con éxito (Folio ${dtvResponse.index})`);

                    unaBase.inbox.send({
                        subject: `Ha emitido Factura de venta Nº ${dtvResponse.index} / ${$('#sheet-dtv span[data-name="referencia"]').text()}`,
                        into: "viewport",
                        href: `/v3/views/dtv/content.shtml?id=${id}`,
                        tag: "avisos"
                    });

                    // Cerrar modal y recargar vista
                    document.querySelector("#modalCustom").style.display = "none";
                    unaBase.loadInto.viewport(`/v3/views/dtv/content.shtml?id=${id}`, undefined, undefined, true);
                } else {
                    toastr.warning((dtvResponse.data.errorMsg || "Error desconocido").replaceAll(/SL/g, "<br>"));
                }
            }
        } catch (error) {
            console.error(error);
            toastr.error("Error al crear asiento contable o emitir factura.");
        } finally {
            clearTimeout(blockTimeout);
            unaBase.ui.unblock();
        }
    }, 50); // Este delay garantiza el overlay/cargando
};

const applyCustomStylesForDtvAccounting = () => {
    const modalCustom = document.getElementById('modalCustom');
    const modalContent = document.getElementById('modal-content');
    const modalBody = document.getElementById('modal-body');

    // Aplicar estilos al contenedor del modal
    modalCustom.style.display = "flex";
    modalCustom.style.justifyContent = "center";
    modalCustom.style.alignItems = "center";
    modalCustom.style.paddingTop = "0";

    // Ajustar modalContent para centrarlo vertical y horizontalmente
    modalContent.style.minWidth = "40%";
    modalContent.style.width = "80vw";  // Ajustar al 80% del ancho de la ventana
    modalContent.style.maxWidth = "1140px"; // Máximo ancho permitido
    modalContent.style.height = "90vh"; // Altura automática basada en el contenido
    modalContent.style.overflow = "hidden"; // Ocultar el desbordamiento interno

    // Estilos para modalBody, controlar desbordamiento y espacio interior
    if (modalBody) {
        modalBody.style.padding = "20px";
        modalBody.style.maxHeight = "70vh"; // Ajustar a una altura máxima del 70% del alto de la pantalla
        modalBody.style.overflowY = "auto"; // Permite scroll en Y si es necesario
    }
};

const resetModalStylesToDefault = () => {
    const modalCustom = document.getElementById('modalCustom');
    const modalContent = document.getElementById('modal-content');
    const modalBody = document.getElementById('modal-body');

    // Restablecer estilos del contenedor del modal
    modalCustom.style.display = "none";
    modalCustom.style.position = "fixed";
    modalCustom.style.zIndex = "100";
    modalCustom.style.left = "0";
    modalCustom.style.top = "0";
    modalCustom.style.width = "100%";
    modalCustom.style.height = "100%";
    modalCustom.style.overflow = "auto";
    modalCustom.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
    modalCustom.style.justifyContent = "";
    modalCustom.style.alignItems = "";
    modalCustom.style.paddingTop = "";

    // Restablecer estilos del contenido del modal
    modalContent.style.backgroundColor = "white";
    modalContent.style.margin = "14% auto";
    modalContent.style.padding = "20px";
    modalContent.style.borderRadius = "10px";
    modalContent.style.position = "relative";
    modalContent.style.minWidth = "30%";
    modalContent.style.maxWidth = "30%";
    modalContent.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";
    modalContent.style.width = "";
    modalContent.style.height = "";
    modalContent.style.maxHeight = "";
    modalContent.style.overflow = "";

    // Restablecer estilos del cuerpo interno del modal
    if (modalBody) {
        modalBody.style.padding = "20px";
        modalBody.style.height = "";
        modalBody.style.overflowY = "";
        modalBody.style.maxHeight = "";
    }
};



const closeModalCustom = () => {
    // Abrir el modal cuando se hace click en el botón
    modalCustom.style.display = "none";
}

const initModalCustom = (title, contenido, onAccept) => {
    unaBase.ui.block();

    // Abrir el modal y configurar el título y contenido
    modalCustom.style.display = "block";
    modalCustom.querySelector('.modal-title').innerHTML = title;
    modalCustom.querySelector('.modal-content-body').innerHTML = contenido;

    // Configurar el selector de fecha
    const fechaInput = modalCustom.querySelector('#fecha_reporte');
    if (fechaInput) {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        $('#fecha_reporte').daterangepicker({
            minDate: '01/01/2012',
            startDate: firstDay,
            endDate: lastDay,
            locale: {
                format: "DD/MM/YYYY",
                separator: " - ",
                applyLabel: "Aplicar",
                cancelLabel: "Cancelar",
                daysOfWeek: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
                monthNames: [
                    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
                ],
                firstDay: 1
            }
        }, function (start, end) {
            fecha_periodo_from = start.format('DD-MM-YYYY');
            fecha_periodo_to = end.format('DD-MM-YYYY');
        });
    }

    // Configurar evento de guardar
    btnSave.onclick = () => {
        if (onAccept && typeof onAccept === 'function') {
            onAccept();
        }
    };

    // Función para inicializar Tom Select para cuentas contables
    const initializeCuentasTomSelect = (selector, options) => {
        let selectElement = modalCustom.querySelector(selector);
        selectElement.innerHTML = '';
        options.forEach(optionData => {
            let option = document.createElement('option');
            option.text = optionData.text;
            option.value = optionData.value;
            selectElement.appendChild(option);
        });

        new TomSelect(selectElement, {
            sortField: {
                field: "text",
                direction: "asc"
            }
        });
    };

    // Inicializar Tom Select para contactos con carga remota
    const initializeContactosTomSelect = (selector) => {
        let selectElement = modalCustom.querySelector(selector);

        new TomSelect(selectElement, {
            valueField: 'id',
            labelField: 'text',
            searchField: ['text'],
            preload: true,
            load: function (query, callback) {
                $.ajax({
                    url: '/4DACTION/_light_get_contactos',
                    dataType: 'json',
                    data: {
                        page: 1,
                        results: 100,
                        q: query
                    },
                    success: function (response) {
                        const contactsOptions = response.rows
                            .map(value => ({
                                id: value.id,
                                text: value.rut ? `${value.nombre_completo} (${value.rut})` : value.nombre_completo
                            }));
                        callback(contactsOptions);
                    },
                    error: function () {
                        callback();
                    }
                });
            },
            render: {
                option: function (item, escape) {
                    return '<div>' + escape(item.text) + '</div>';
                },
                item: function (item, escape) {
                    return '<div>' + escape(item.text) + '</div>';
                }
            },
            placeholder: 'Selecciona un contacto',
            loadingClass: 'loading'
        });
    };

    // Llamada inicial para obtener cuentas contables
    $.ajax({
        url: window.origin + "/4DACTION/_force_getPlanAccounts",
        type: "GET",
        data: { only_accounts: true },
        dataType: "json"
    }).done(accountsResponse => {
        // Inicializar Tom Select para cuentas contables
        const accountsOptions = [
            { text: 'Selecciona una cuenta', value: '' }, // Opción por defecto
            ...accountsResponse.rows.map(v => ({
                text: `${v.number} / ${v.name}`,
                value: v.number
            }))
        ];
        initializeCuentasTomSelect('#cuentas_contable', accountsOptions);

        // Inicializar Tom Select para contactos con carga remota
        initializeContactosTomSelect('#contacto_auxiliar');

        unaBase.ui.unblock();
    }).fail(error => {
        toastr.error("Error interno. Inténtalo de nuevo más tarde.");
        unaBase.ui.unblock();
    });
};

const initModalCustomMayor = (title, contenido, onAccept) => {
    unaBase.ui.block();
    resetModalStylesToDefault()
    // Abrir el modal y configurar el título y contenido
    modalCustom.style.display = "block";
    modalCustom.querySelector('.modal-title').innerHTML = title;
    modalCustom.querySelector('.modal-content-body').innerHTML = contenido;

    // Configurar el selector de fecha
    const fechaInput = modalCustom.querySelector('#fecha_reporte');
    if (fechaInput) {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        $('#fecha_reporte').daterangepicker({
            minDate: '01/01/2012',
            startDate: firstDay,
            endDate: lastDay,
            locale: {
                format: "DD/MM/YYYY",
                separator: " - ",
                applyLabel: "Aplicar",
                cancelLabel: "Cancelar",
                daysOfWeek: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
                monthNames: [
                    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
                ],
                firstDay: 1
            }
        }, function (start, end) {
            fecha_periodo_from = start.format('DD-MM-YYYY');
            fecha_periodo_to = end.format('DD-MM-YYYY');
        });
    }

    // Configurar evento de guardar
    btnSave.onclick = () => {
        if (onAccept && typeof onAccept === 'function') {
            onAccept();
        }
    };

    // Función para inicializar Tom Select para cuentas contables
    const initializeCuentasTomSelect = (selector, options) => {
        let selectElement = modalCustom.querySelector(selector);
        selectElement.innerHTML = '';

        options.forEach(optionData => {
            let option = document.createElement('option');
            option.text = optionData.text;
            option.value = optionData.value;
            selectElement.appendChild(option);
        });

        let tomSelect = new TomSelect(selectElement, {
            maxItems: null, // Permite selección múltiple
            valueField: 'value',
            labelField: 'text',
            searchField: 'text',
            sortField: {
                field: "text",
                direction: "asc"
            },
            plugins: ['remove_button'], // Agrega botón de eliminar selección
            render: {
                option: (data, escape) => {
                    return `
                        <div>
                            <input type="checkbox" class="tomselect-checkbox" value="${escape(data.value)}">
                            <span>${escape(data.text)}</span>
                        </div>
                    `;
                },
                item: (data, escape) => {
                    return `<div class="selected-item">${escape(data.text)}</div>`;
                }
            },
            onItemAdd: (value, item) => {

                let checkbox = document.querySelector(`input[value="${value}"]`);
                if (checkbox) checkbox.checked = true;
            },
            onItemRemove: (value) => {
                let checkbox = document.querySelector(`input[value="${value}"]`);
                if (checkbox) checkbox.checked = false;
            }
        });

        // Asegurar que los checkboxes cambien al seleccionar
        selectElement.addEventListener('change', () => {
            const selectedValues = tomSelect.items;
            document.querySelectorAll('.tomselect-checkbox').forEach(checkbox => {
                checkbox.checked = selectedValues.includes(checkbox.value);
            });
        });
    };





    // Llamada inicial para obtener cuentas contables
    $.ajax({
        url: window.origin + "/4DACTION/_force_getPlanAccounts",
        type: "GET",
        data: { only_accounts: true },
        dataType: "json"
    }).done(accountsResponse => {
        // Inicializar Tom Select para cuentas contables
        const accountsOptions = [
            { text: 'Selecciona una cuenta', value: '' }, // Opción por defecto
            ...accountsResponse.rows.map(v => ({
                text: `${v.number} / ${v.name}`,
                value: v.number
            }))
        ];
        initializeCuentasTomSelect('#cuentas_contable', accountsOptions);

        unaBase.ui.unblock();
    }).fail(error => {
        toastr.error("Error interno. Inténtalo de nuevo más tarde.");
        unaBase.ui.unblock();
    });

};

const initModalCustomDtvAccounting = (title, contenido, onAccept) => {
    applyCustomStylesForDtvAccounting();  // Aplica los estilos customizados
    // Abrir el modal y configurar el título y contenido
    modalCustom.style.display = "flex";
    modalCustom.querySelector('.modal-title').innerHTML = title;
    modalCustom.querySelector('.modal-content-body').innerHTML = contenido;

    // Asegurar que el modal esté alineado en la parte superior
    modalCustom.querySelector('#modal-content').style.top = '10px';

    modalCustom.querySelector('#modal-custom-accept').textContent = "Emitir";

    // Configurar evento de guardar
    btnSave.onclick = () => {
        if (onAccept === 'electronico') {
            actionModalCustomFactura(onAccept);
        } else {
            actionModalCustomManual()
        }
    };
};


const initModalCustomMayorConAnalisis = (title, contenido, onAccept) => {
    unaBase.ui.block();

    // Abrir el modal y configurar el título y contenido
    modalCustom.style.display = "block";
    modalCustom.querySelector('.modal-title').innerHTML = title;
    modalCustom.querySelector('.modal-content-body').innerHTML = contenido;

    // Configurar el selector de fecha
    const fechaInput = modalCustom.querySelector('#fecha_reporte');
    if (fechaInput) {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        $('#fecha_reporte').daterangepicker({
            minDate: '01/01/2012',
            startDate: firstDay,
            endDate: lastDay,
            locale: {
                format: "DD/MM/YYYY",
                separator: " - ",
                applyLabel: "Aplicar",
                cancelLabel: "Cancelar",
                daysOfWeek: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
                monthNames: [
                    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
                ],
                firstDay: 1
            }
        }, function (start, end) {
            fecha_periodo_from = start.format('DD-MM-YYYY');
            fecha_periodo_to = end.format('DD-MM-YYYY');
        });
    }

    // Configurar evento de guardar
    btnSave.onclick = () => {
        if (onAccept && typeof onAccept === 'function') {
            onAccept();
        }
    };

    // Función para inicializar Tom Select para cuentas contables
    const initializeCuentasTomSelect = (selector, options) => {
        let selectElement = modalCustom.querySelector(selector);
        selectElement.innerHTML = '';
        options.forEach(optionData => {
            let option = document.createElement('option');
            option.text = optionData.text;
            option.value = optionData.value;
            selectElement.appendChild(option);
        });

        new TomSelect(selectElement, {
            sortField: {
                field: "text",
                direction: "asc"
            }
        });
    };

    // Inicializar Tom Select para contactos con carga remota
    const initializeContactosTomSelect = (selector) => {
        let selectElement = modalCustom.querySelector(selector);

        new TomSelect(selectElement, {
            valueField: 'id',
            labelField: 'text',
            searchField: ['text'],
            preload: true,
            load: function (query, callback) {
                $.ajax({
                    url: '/4DACTION/_light_get_contactos',
                    dataType: 'json',
                    data: {
                        page: 1,
                        results: 100,
                        q: query
                    },
                    success: function (response) {
                        const contactsOptions = response.rows
                            .map(value => ({
                                id: value.id,
                                text: value.rut ? `${value.nombre_completo} (${value.rut})` : value.nombre_completo
                            }));
                        callback(contactsOptions);
                    },
                    error: function () {
                        callback();
                    }
                });
            },
            render: {
                option: function (item, escape) {
                    return '<div>' + escape(item.text) + '</div>';
                },
                item: function (item, escape) {
                    return '<div>' + escape(item.text) + '</div>';
                }
            },
            placeholder: 'Selecciona un contacto',
            loadingClass: 'loading'
        });
    };

    // Llamada inicial para obtener cuentas contables
    $.ajax({
        url: window.origin + "/4DACTION/_force_getPlanAccounts",
        type: "GET",
        data: { only_accounts: true },
        dataType: "json"
    }).done(accountsResponse => {
        // Inicializar Tom Select para cuentas contables
        const accountsOptions = [
            { text: 'Selecciona una cuenta', value: '' }, // Opción por defecto
            ...accountsResponse.rows.map(v => ({
                text: `${v.number} / ${v.name}`,
                value: v.number
            }))
        ];
        initializeCuentasTomSelect('#cuentas_contable', accountsOptions);

        // Inicializar Tom Select para contactos con carga remota
        initializeContactosTomSelect('#contacto_auxiliar');

        unaBase.ui.unblock();
    }).fail(error => {
        toastr.error("Error interno. Inténtalo de nuevo más tarde.");
        unaBase.ui.unblock();
    });
};




const initModalCustomCurrency = (title, contenido, onAccept) => {
    unaBase.ui.block();

    // Abrir el modal cuando se hace click en el botón
    modalCustom.style.display = "block";
    modalCustom.querySelector('.modal-title').innerHTML = title;
    modalCustom.querySelector('.modal-content-body').innerHTML = contenido;
    document.getElementById('modal-custom-accept').textContent = 'Aceptar';

    btnSave.onclick = () => {
        if (onAccept && typeof onAccept === 'function') {
            onAccept();
        }
    };

    unaBase.ui.unblock();
};


(function init() {



    btnCancel.addEventListener("click", () => closeModalCustom());


})();