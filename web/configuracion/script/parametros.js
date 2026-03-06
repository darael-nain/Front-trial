const saveParam = (element) => {
    let path = element.id
    saveValueParam(path, element.value)
}


const saveValueParam = (path, value) => {
    $.ajax({
        url: window.origin + "/4DACTION/_light_setParameters",
        type: "POST",
        dataType: "json",
        data: {
            path: value,

        },
        success: function (data) {
            if (data.success) {
                generarAvisoExitoso("Parametros actualizados correctamente");

            } else {
                generarAvisoError("Error al actualizar parametros");
            }
        },
        error: function (xhr, text, error) {
            generarAvisoError("Error al actualizar parametros");
        }
    });
}

const setParamGeneral = () => {
    const paramElements = document.querySelectorAll(
        '#table-color, #accounting-mode, #btn_sica, #tipo_cambio, #btn_fecha_estimacion, #btn_mostrar_unidad, #multiplesXServicio, #items_categoria, #accounting_anticipos_contactos, #portal_proveedores, #export_sap_lotus, #datos_extras_banco_contacto, #ocultar_columna_gastop_unit, #valorventa_mismo_valorcosto, #pdf_print_oc, #ocultar_seccion_sc, #add_dtc_compras_no_validas, #conexion_syncfy, #conexion_sii, #ocultar_montos_adicionales, #facturar_sin_rut, #sap_integration, #ocultar_lupa_doc_asiento, #export_diot, #observaciones_fxr, #hora_exe, #name_shift, #esconder_totales_negocio_movil, #url_node, #url_web, #dialogo_tipo_cambio_facturar, #update_fecha_asig, #nombre_custom_pdf_neg, #nombre_custom_pdf_cot'
    );

    // Extraer valores dinámicamente
    const params = Array.from(paramElements).reduce((acc, elem) => {
        if (elem.type === "checkbox") {
            acc[elem.id] = elem.checked;
        } else {
            acc[elem.id] = elem.value;
        }
        return acc;
    }, {});

    // Guardar en localStorage si `url_node` tiene valor
    if (params.url_node) {
        localStorage.setItem('node_url', params.url_node);
    }

    // Renombrar claves si es necesario para que coincidan con los parámetros de la API
    const formattedParams = {
        'table_color': params['table-color'],
        'accounting_mode': params['accounting-mode'],
        'btn_sica': params['btn_sica'],
        'tipo_cambio': params['tipo_cambio'],
        'btn_fecha_estimacion': params['btn_fecha_estimacion'],
        'btn_mostrar_unidad': params['btn_mostrar_unidad'],
        'multiplesXServicio': params['multiplesXServicio'],
        'items_categoria': params['items_categoria'],
        'accounting_anticipos_contactos': params['accounting_anticipos_contactos'],
        'portal_proveedores': params['portal_proveedores'],
        'export_sap_lotus': params['export_sap_lotus'],
        'datos_extras_banco_contacto': params['datos_extras_banco_contacto'],
        'ocultar_columna_gastop_unit': params['ocultar_columna_gastop_unit'],
        'valorventa_mismo_valorcosto': params['valorventa_mismo_valorcosto'],
        'pdf_print_oc': params['pdf_print_oc'],
        'ocultar_seccion_sc': params['ocultar_seccion_sc'],
        'add_dtc_compras_no_validas': params['add_dtc_compras_no_validas'],
        'conexion_syncfy': params['conexion_syncfy'],
        'conexion_sii': params['conexion_sii'],
        'ocultar_montos_adicionales': params['ocultar_montos_adicionales'],
        'facturar_sin_rut': params['facturar_sin_rut'],
        'sap_integration': params['sap_integration'],
        'ocultar_lupa_doc_asiento': params['ocultar_lupa_doc_asiento'],
        'export_diot': params['export_diot'],
        'observaciones_fxr': params['observaciones_fxr'],
        'hora_exe': params['hora_exe'],
        'name_shift': params['name_shift'],
        'node_url': params['url_node'],
        'web_url': params['url_web'],
        'dialogo_tipo_cambio_facturar': params['dialogo_tipo_cambio_facturar'],
        'esconder_totales_negocio_movil': params['esconder_totales_negocio_movil'],
        'update_fecha_asig': params['update_fecha_asig'],
        'nombre_custom_pdf_neg': params['nombre_custom_pdf_neg'],
        'nombre_custom_pdf_cot': params['nombre_custom_pdf_cot']
    };

    // Enviar los parámetros optimizados a la API
    $.ajax({
        url: window.origin + "/4DACTION/_light_setParameters",
        type: "POST",
        dataType: "json",
        data: formattedParams,
        success: function (data) {
            if (data.success) {
                generarAvisoExitoso("Parámetros actualizados correctamente");
            } else {
                generarAvisoError("Error al actualizar parámetros");
            }
        },
        error: function () {
            generarAvisoError("Error al actualizar parámetros");
        }
    });
};



const getParamGeneral = () => {
    $.ajax({
        url: window.origin + "/4DACTION/_light_getParameters",
        dataType: "json",
        success: function (data) {
            const mappings = {
                'new_dtv_accounting': 'new_dtv_accounting',
                'table-color': 'table_color',
                'url_node': 'node_url',
                'url_web': 'web_url',
                'btn_fecha_estimacion': 'btn_fecha_estimacion',
                'export_sap_lotus': 'export_sap_lotus',
                'btn_mostrar_unidad': 'ocultar_unidad',
                'hora_exe': 'hora_exe',
                'accounting-mode': 'accounting_mode',
                'btn_sica': 'btn_sica',
                'multiplesXServicio': 'multiplesXServicio',
                'items_categoria': 'items_categoria',
                'tipo_cambio': 'tipo_cambio_update',
                'btn_fecha_estimacion': 'ver_fecha_estimada_facturacion',
                'portal_proveedores': 'portal_proveedores',
                'accounting_anticipos_contactos': 'accounting_anticipos_contactos',
                'ocultar_columna_gastop_unit': 'ocultar_columna_gastop_unit',
                'datos_extras_banco_contacto': 'datos_extras_banco_contacto',
                'valorventa_mismo_valorcosto': 'valorventa_mismo_valorcosto',
                'pdf_print_oc': 'usar_pdf_bandeja_print_oc',
                'ocultar_seccion_sc': 'ocultar_seccion_sc',
                'conexion_syncfy': 'conexion_syncfy',
                'conexion_sii': 'conexion_sii',
                'add_dtc_compras_no_validas': 'add_dtc_compras_no_validas',
                'ocultar_montos_adicionales': 'ocultar_montos_adicionales',
                'sap_integration': 'sap_integration',
                'ocultar_lupa_doc_asiento': 'ocultar_lupa_doc_asiento',
                'export_diot': 'export_diot',
                'observaciones_fxr': 'observaciones_fxr',
                'incluir_codigo_item_pdf': 'incluir_codigo_item_pdf',
                'dialogo_tipo_cambio_facturar': 'dialogo_tipo_cambio_facturar',
                'facturar_sin_rut': 'facturar_sin_rut',
                'esconder_totales_negocio_movil': 'esconder_totales_negocio_movil',
                'update_fecha_asig': 'update_fecha_asig',
                'nombre_custom_pdf_cot': 'nombre_custom_pdf_cot',
                'nombre_custom_pdf_neg': 'nombre_custom_pdf_neg'
            };

            for (let [elementId, dataKey] of Object.entries(mappings)) {
                const element = document.getElementById(elementId);
                if (element.type === 'checkbox') {
                    element.checked = data[dataKey];
                } else {
                    element.value = data[dataKey];
                }
            }

            $('.cpicker').colorpicker();
            document.querySelector('.select_id_param').value = data.id_param_dtv_nv;
        },
        error: function (xhr, text, error) {
            generarAvisoError("Error al obtener parametros");
        }
    });
};


const setParamByOne = () => {
    const elements = [
        'new_dtv_accounting',
        'table-color', 'url_node', 'url_web', 'hora_exe', 'btn_fecha_estimacion',
        'btn_sica', 'btn_mostrar_unidad', 'accounting-mode', 'tipo_cambio',
        'name_shift', 'multiplesXServicio', 'btn_fecha_estimacion', 'items_categoria',
        'accounting_anticipos_contactos', 'portal_proveedores', 'datos_extras_banco_contacto',
        'export_sap_lotus', 'ocultar_columna_gastop_unit', 'valorventa_mismo_valorcosto',
        'pdf_print_oc', 'ocultar_seccion_sc', 'conexion_syncfy', 'conexion_sii', 'add_dtc_compras_no_validas', 'ocultar_montos_adicionales', 'sap_integration', 'ocultar_lupa_doc_asiento', 'export_diot', 'observaciones_fxr', 'incluir_codigo_item_pdf', 'dialogo_tipo_cambio_facturar', 'facturar_sin_rut', 'esconder_totales_negocio_movil', 'update_fecha_asig'
    ];
    const data = {};
    elements.forEach(elementId => {
        const element = document.getElementById(elementId);
        data[elementId.replace('-', '_')] = element.type === 'checkbox' ? element.checked : element.value;
    });

    data['id_param_dtv_invoice'] = document.querySelector('.select_id_param').value;

    $.ajax({
        url: window.origin + "/4DACTION/_light_setParameters",
        type: "POST",
        dataType: "json",
        data: data,
        success: function (data) {
            if (data.success) {
                generarAvisoExitoso("Parametros actualizados correctamente");
            } else {
                generarAvisoError("Error al actualizar parametros");
            }
        },
        error: function (xhr, text, error) {
            generarAvisoError("Error al actualizar parametros");
        }
    });
};

const generarAvisoError = (mensaje) => {
    Command: toastr["error"](mensaje, 'Error')
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
}

const generarAvisoExitoso = (mensaje) => {
    Command: toastr["success"](mensaje, 'Correcto')
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
}

(function init() {
    getParamGeneral();
    let checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', setParamByOne);
    });

    document.querySelector('.select_id_param').addEventListener('change', setParamByOne);
})();

