const convertirFecha = (fechaString) => {
    if (!fechaString || fechaString.trim() === '') {
        return '';
    }

    const partes = fechaString.split('-');
    if (partes.length !== 3) {
        throw new Error('Formato de fecha no válido');
    }
    return `${partes[2]}-${partes[1]}-${partes[0]}`;
}

const getParamGeneral = () => {
    $.ajax({
        url: window.origin + "/4DACTION/_light_getParameters",
        dataType: "json",

        success: function (data) {
            
            document.getElementById('fecha_provision').value = convertirFecha(data.fecha_provision);
            document.getElementById('fecha_provision_reversa').value = convertirFecha(data.fecha_provision_reversa);
            document.getElementById('accounting-mode').checked = data.accounting_mode;
            document.getElementById('multiplesXServicio').checked = data.multiplesXServicio;

        },
        error: function (xhr, text, error) {
            generarAvisoError("Error al obtener parametros");
        }
    });
}

const formatearFecha = (fechaString) => {
    if (!fechaString || fechaString.trim() === '') {
        return '00/00/0000';
    }

    const partes = fechaString.split('-');
    if (partes.length !== 3) {
        throw new Error('Formato de fecha no válido');
    }
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

const autoGenerar = async () => {
    let config = {
        method: 'post',
        url: `${localStorage.getItem('node_url')}/auto-generate?hostname=${window.location.origin}`,
    };

    try {
        let res = await axios(config);
    } catch (err) {
        throw err;
    }
}

const saveParamContabilidad = () => {
    
    let fecha_provision = document.getElementById('fecha_provision').value;
    let fecha_provision_reversa = document.getElementById('fecha_provision_reversa').value;

    let accountingModeValue = document.getElementById('accounting-mode').checked;
    let multiplesXServicio = document.getElementById('multiplesXServicio').checked;

    fecha_provision = formatearFecha(fecha_provision)
    fecha_provision_reversa = formatearFecha(fecha_provision_reversa)



    $.ajax({
        url: window.origin + "/4DACTION/_light_setParameters",
        type: "POST",
        dataType: "json",
        data: {
            'fecha_provision': fecha_provision,
            'fecha_provision_reversa': fecha_provision_reversa,
            'accounting_mode': accountingModeValue,
            'multiplesXServicio': multiplesXServicio,
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

const importExcelApertura = (e) => {
    let file = document.getElementById('formFile')
    if (file.files.length > 0) {
        let data = new FormData();
        let attachment = file.files[0];
        data.append('upload[attachment]', attachment);
        //data.append('sid', sid);
        spinnerMain(true);
        $.ajax({
            url: localStorage.getItem('node_url') + '/import-excel-random-data?hostname=' + window.location.origin + '&id=' + $('section.sheet').data('id') + '&sid=' + encodeURIComponent(sid),
            type: 'POST',
            contentType: false,
            data: data,
            processData: false,
            cache: false,
            success: function (data) {
                if (data.success) {

                } 

                if (data.errors) {
                    document.getElementById('warning-apertura').style.display = ''
                    document.getElementById('warning-apertura').innerHTML = data.errors.map(e => `<p>${e}</p>`).join('');
                }
                
                generarAvisoExitoso("Apertura cargada correctamente");
                spinnerMain(false);
            },
            fail: function (e1, e2, e3) {
                spinnerMain(false);
                document.getElementById('warning-apertura').style.display = ''
                document.getElementById('warning-apertura').innerHTML = 'No fue posible realizar la cargar de los datos debido a un problema con el servidor, Por favor intente nuevamente. <p><small>Si el inconveniente persiste, por favor comuniquese con Soporte@una.cl.</small></p>'

            }
        });
    } else {

        document.getElementById('warning-apertura').style.display = ''
        document.getElementById('warning-apertura').innerHTML = 'Debes seleccionar un achivo excel para poder importarlo!'

    }
}



(function init() {
    getParamGeneral();
    document.getElementById('accounting-mode').addEventListener('change', saveParamContabilidad);
    document.getElementById('multiplesXServicio').addEventListener('change', saveParamContabilidad);
    const importExcelBtn = document.getElementById('import-excel-apertura');

    if (importExcelBtn) {
        importExcelBtn.addEventListener("click", (e) => importExcelApertura(e));
    }
})();
