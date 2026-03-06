// Variables Globales
let positionBsale = 'center'


// Mostrar Modal
const modalBsale = document.getElementById("modalBsale");
const containerModalBsale = document.getElementById("containerModalBsale");

let updateBSale = async () => {
    let config = {
        method: 'post',
        url: `${localStorage.getItem('node_url')}/update-bsale?hostname=${window.location.origin}`,
    };


    try {
        let res = await axios(config);
        return res.data.data?.rows;
    } catch (err) {
        throw err;
    }
}

let getFormasPago = async () => {
    let config = {
        method: 'get',
        url: `${nodeUrl}/bsale-get-formas-pago?hostname=${window.location.origin}`,
    };


    try {
        let res = await axios(config);
        return res.data.rows;
    } catch (err) {
        throw err;
    }
}

let checkContacto = async (id) => {
    let config = {
        method: 'get',
        url: `${nodeUrl}/bsale-check-contacto?hostname=${window.location.origin}&id=${id}`,
    };


    try {
        let res = await axios(config);
        return res.data;
    } catch (err) {
        throw err;
    }
}

const searchData = () => {
    updateBSale()
}

const fillSelect = async () => {
    let res = await getFormasPago()
    
    const selectElement = document.getElementById('select_forma_pago');
    selectElement.innerHTML = ''
    let opt = document.createElement('option');
    opt.textContent = 'Seleccione una forma de pago'
    opt.value = ''
    selectElement.appendChild(opt);
    res.forEach(forma => {
        const option = document.createElement('option');
        option.value = forma.id;
        option.textContent = forma.nombre;
        selectElement.appendChild(option);
    });
}


const emitirFacturabSale = async () => {
    const selectElement = document.getElementById('select_forma_pago');
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const selectedValue = selectedOption.value;
    const tipo = document.getElementById('sheet-notas') ? document.getElementById('sheet-notas').dataset.type : 'dtv'
    const id_dtv = document.getElementById('main-container').dataset.id

    if (selectedValue && selectedValue == "" && tipo == 'dtv') {
        toastr.warning('Debes seleccionar una forma de pago')
        return
    }

    let res_check_contacto = await checkContacto(id_dtv)
    
    if (!res_check_contacto.success) {
        toastr.warning('No es posible emitir a bsale debido a que: ' + res_check_contacto.errorMsg.replaceAll(/SL/g, '<br>'))
        unaBase.ui.unblock();

        return;
    }


    let config = {
        method: 'post',
        url: `${nodeUrl}/send-billing-bsale`,
        data: {
            hostname: window.location.origin,
            sid: unaBase.sid.encoded(),
            api: true,
            id: id_dtv,
            id_pago: selectedValue,
            tipo
        }
    };


    try {
        axios(config)
            .then(res => {
                unaBase.ui.unblock()
                
                if (res.data.success) {
                    closedModalBsale()
                    let url = ''
                    let urlPdf = ''
                    if (tipo == 'dtv') {
                        url = "/v3/views/dtv/general.shtml?id=" + id_dtv
                    } else {
                        url = "/v3/views/dtv/nc/general.shtml?id=" + id_dtv
                    }
                    urlPdf = res.data.url
                    unaBase.loadInto.viewport(url);
                    window.open(urlPdf, '_blank');
                    toastr.success(res.data.msg)

                } else {
                    toastr.error(res.data.msg)
                }
            })
            .catch(err => {
                unaBase.ui.unblock()
                if (err.response && err.response.status === 400) {
                    toastr.error("Se produjo un error al procesar datos");
                } else {
                    toastr.error("Ocurrió un error desconocido");
                }
            });

    } catch (err) {
        unaBase.ui.unblock()
        
        if (err.response && err.response.status === 400) {
            toastr.error("Se produjo un error con los datos enviados");
        } else {
            toastr.error("Ocurrió un error desconocido");
        }
        throw err;
    }


}


function closedModalBsale() {
    modalBsale.style.backgroundColor = "transparent";
    if (['left', 'right'].includes(positionBsale.toLocaleLowerCase())) {
        containerModalBsale.style.transform = positionBsale === "left" ? "translate(calc(-50vw - 480px), 0)" : "translate(calc(50vw + 480px), 0)";
    } else {
        containerModalBsale.style.transform = "scale(0)";
    }

    setTimeout(function () {
        modalBsale.style.display = "none";
    }, 350);
}

function upModalBsale() {

    const tipo = document.getElementById('sheet-notas') ? document.getElementById('sheet-notas').dataset.type : 'dtv'
    if (tipo == 'nc') {
        document.querySelector('#formas-pago-dtv').style.display = 'none'
        document.querySelector('#confirm-alert-nc').style.display = ''
    }

    if (tipo == 'dtv') {
        fillSelect()
        document.querySelector('#formas-pago-dtv').style.display = ''
        document.querySelector('#confirm-alert-nc').style.display = 'none'
    }

    modalBsale.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
    modalBsale.style.display = "block";




    if (['left', 'right'].includes(positionBsale)) {
        containerModalBsale.style.transform = positionBsale === "left" ? "scale(1) translate(calc(-50vw - 480px), 0)" : "scale(1) translate(calc(+50vw + 480px), 0)"
        containerModalBsale.style.height = "100vh";
        containerModalBsale.style.top = "0";
        containerModalBsale.style.borderRadius = positionBsale === "left" ? "0px 24px 24px 0px" : "24px 0px 0px 24px";
        setTimeout(function () {
            containerModalBsale.style.transform = positionBsale === "left" ? "translate(calc(-50vw + 240px))" : "translate(calc(+50vw - 240px))";
        }, 10);
    } else {
        setTimeout(function () {
            containerModalBsale.style.transform = "scale(1)";
        }, 350);
    }

}

// Generar contenido del modal 
function generateCurrencyModalHTML_Bsale(currentpositionBsale = "center") {
    positionBsale = currentpositionBsale
}

generateCurrencyModalHTML_Bsale()