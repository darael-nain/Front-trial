// Variables Globales
let settingsMoney = [];

let position = 'center'

let id = null
let getPath = ''
let postPath = ''
let view = ''
let moneyDefault = ''


// let data = await getData()


// Obtener monedas del sistema
const getMoney = async () => {
    try {
        const url = `https://${window.location.host}/4DACTION/${getPath}?id_dtv=${id}`;
        const response = await axios.get(url);

        settingsMoney = []
        settingsMoney = response.data.row;
    } catch (error) {
        console.error(error);
    }
};

// Opciones del Select
async function createOptions() {
    await getMoney();
    createHTML(settingsMoney);

    const defaultMoney = document.getElementById("defaultMoney");
    const printMoney = document.getElementById("printMoney");


    defaultMoney.innerHTML = "";
    printMoney.innerHTML = "";

    //Para compras
    if (typeof compras != 'undefined' && view == 'oc') {
        if (compras.justificado > 0 || compras.pagado > 0) {
            defaultMoney.disabled = true
        } else
            defaultMoney.disabled = false
    }


    if (view == 'dtv') {
        if (dtv.data.estado === 'EMITIDA') {
            defaultMoney.disabled = true
        } else {

            defaultMoney.disabled = false
        }
    }

    let hasSelectedSystem = false;
    let hasSelectedPrint = false;

    settingsMoney.forEach(option => {
        const { codigo, nombre, asignada, asignada_print } = option;
        const optionElement = createOptionElement(codigo, nombre);
        defaultMoney.appendChild(optionElement);
        printMoney.appendChild(optionElement.cloneNode(true));

        if (asignada) {
            defaultMoney.value = codigo;
            moneyDefault = codigo
            hasSelectedSystem = true;
        }

        if (asignada_print) {
            printMoney.value = codigo;
            hasSelectedPrint = true;
        }
    });

    if (!hasSelectedSystem) defaultMoney.value = "";

    if (!hasSelectedPrint) printMoney.value = "";

    clearInputs()

}

function createOptionElement(codigo, nombre) {
    const optionElement = document.createElement("option");
    optionElement.label = `${codigo} - ${nombre}`;
    optionElement.value = codigo;
    return optionElement;
}

// Crear la Tabla de Monedas
function createHTML(options) {
    const bodyModalTable = document.querySelector('.bodyModal__table');

    const existingRows = bodyModalTable.getElementsByClassName('row_item_moneyModal');

    while (existingRows.length > 0) {
        existingRows[0].parentNode.removeChild(existingRows[0]);
    }

    options.forEach((option, pos) => {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('row', "row_item_moneyModal");

        const textDiv = document.createElement('div');
        textDiv.classList.add('bodyModal__table_text');
        textDiv.textContent = `${option.codigo} - ${option.nombre}`;

        const isSytemMoney = option.codigo === unaBase.defaulCurrencyCode

        const inputGroup1 = createInputGroup(true);
        const inputGroup2 = createInputGroup(isSytemMoney, true, pos);


        const input1 = inputGroup1.querySelector('input');
        input1.value = option.current_value;

        const input2 = inputGroup2.querySelector('input');
        input2.value = option.value;

        rowDiv.appendChild(textDiv);
        rowDiv.appendChild(inputGroup1);
        rowDiv.appendChild(inputGroup2);

        bodyModalTable.appendChild(rowDiv);
    });
}

function createInputGroup(disabled, change = false, pos) {

    const groupDiv = document.createElement('div');
    groupDiv.classList.add('group_input');

    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('min', '0');

    if (disabled) {
        input.setAttribute('disabled', 'disabled');
        input.classList.add('inputModal');
    } else {
        input.removeAttribute('disabled', 'disabled');

    }

    const highlightSpan = document.createElement('span');
    highlightSpan.classList.add('highlight');

    const barSpan = document.createElement('span');
    barSpan.classList.add('bar');

    if (change) input.addEventListener('change', function () {
        updatedMoney(input.value, pos);
    });

    groupDiv.appendChild(input);
    groupDiv.appendChild(highlightSpan);
    groupDiv.appendChild(barSpan);

    return groupDiv;
}

// Actualizar Monedas
function updatedMoney(newValue, pos) {
    settingsMoney[pos].value = newValue
}

// Mostrar Modal
const modalConfigMoney = document.getElementById("modalConfigMoney");
const containerModal = document.getElementById("containerModal");

function closedModal() {
    modalConfigMoney.style.backgroundColor = "transparent";
    if (['left', 'right'].includes(position.toLocaleLowerCase())) {
        containerModal.style.transform = position === "left" ? "translate(calc(-50vw - 480px), 0)" : "translate(calc(50vw + 480px), 0)";
    } else {
        containerModal.style.transform = "scale(0)";
    }

    setTimeout(function () {
        modalConfigMoney.style.display = "none";
    }, 350);
}

function upModal() {

    let lines = document.querySelector('table#items-gastos tbody') ? document.querySelector('table#items-gastos tbody').children.length : 0
    if (view == 'oc' && lines == 0) {
        toastr.warning('Debes guardar antes para usar el tipo de cambio')
        return
    }


    
    modalConfigMoney.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
    modalConfigMoney.style.display = "block";

    if (['left', 'right'].includes(position)) {
        containerModal.style.transform = position === "left" ? "scale(1) translate(calc(-50vw - 480px), 0)" : "scale(1) translate(calc(+50vw + 480px), 0)"
        containerModal.style.height = "100vh";
        containerModal.style.top = "0";
        containerModal.style.borderRadius = position === "left" ? "0px 24px 24px 0px" : "24px 0px 0px 24px";
        setTimeout(function () {
            containerModal.style.transform = position === "left" ? "translate(calc(-50vw + 240px))" : "translate(calc(+50vw - 240px))";
        }, 10);
    } else {
        setTimeout(function () {
            containerModal.style.transform = "scale(1)";
        }, 350);
    }

}

// Limpiar los inputs
function clearInputs() {
    const inputModals = document.querySelectorAll('.inputModal');
    inputModals.forEach(input => {
        input.addEventListener('input', function (event) {
            const inputValue = event.target.value;
            const cleanValue = inputValue.replace(/[^\d,]/g, '');
            event.target.value = cleanValue;
        });
    });
}

// Generar contenido del modal 
function generateCurrencyModalHTML(idCurrent, getForPath, postForPath, currentView, currentPosition = "center") {
    id = idCurrent
    getPath = getForPath
    postPath = postForPath
    view = currentView
    position = currentPosition
    createOptions()
}

function generateModalHTML(filters, currentView, currentPosition = "center") {
    view = currentView
    position = currentPosition
    //createOptions()
}

// Guardar configuracion
async function postMoney() {


    const defaultMoney = document.getElementById("defaultMoney");
    const printMoney = document.getElementById("printMoney");
    unaBase.ui.block();


    const requestPromises = settingsMoney.map((item) => {
        return $.ajax({
            url: `/4DACTION/${postPath}`,
            data: {
                "id_dtv": id,
                'def': item.codigo === defaultMoney.value,
                'print': item.codigo === printMoney.value,
                'value': item.value,
                'code': item.codigo
            },
            dataType: 'json',
            method: 'POST'
        });
    });

    await Promise.all(requestPromises)
        .then((responses) => console.log(responses))
        .catch((error) => console.error('Error in requests:', error));


    switch (view) {
        case 'dtv': {

            try {


                if (view in functionToBeExecutedByView) await functionToBeExecutedByView[view]();
                else console.log("Parametro Vista no encontrado en el objeto de funciones a ejecutar.")
            } catch (error) {
                console.error(error);
                unaBase.ui.unblock();
            } finally {
                closedModal();
                unaBase.ui.unblock();
                unaBase.loadInto.viewport('/v3/views/dtv/content.shtml?id=' + id, undefined, undefined, true);
                toastr.success('Configuración de moneda guardada exitosamente.');
            }

            break;

        }

        case 'oc': {

            // try {  
            //     if (view in functionToBeExecutedByView) await functionToBeExecutedByView[view]();
            //     else console.log("Parametro Vista no encontrado en el objeto de funciones a ejecutar.")
            // } catch (error) {
            //     console.error(error);
            //     unaBase.ui.unblock();
            // } finally {

            //     closedModal();
            //     toastr.success('Configuración de moneda guardada exitosamente.');
            //     unaBase.ui.unblock();
            //     const re = async () => unaBase.loadInto.viewport('/v3/views/compras/general2.shtml?id=' + id, undefined, undefined, true)
            //     saveAction(re, expensesParams)
            // }

            closedModal();
            toastr.success('Configuración de moneda guardada exitosamente.');
            unaBase.ui.unblock();
            const re = async () => unaBase.loadInto.viewport('/v3/views/compras/general2.shtml?id=' + id, undefined, undefined, true)
            saveAction(re, expensesParams)

            break;
        }
        default:
            closedModal();
            unaBase.ui.unblock();
    }

}

// Funciones a ejectutar al final el cambio de configuracion de la Moneda
const functionToBeExecutedByView = {
    dtv: () => setDtv(),
    oc: () => setOc()
}

// Actualizar data para DTV
function setDtv() {
    const defaultMoney = document.getElementById("defaultMoney");
    const printMoney = document.getElementById("printMoney");
    valueByPrint = settingsMoney.find(s => s.codigo === printMoney.value).value
    exchangeRate = settingsMoney.find(s => s.codigo === defaultMoney.value).value
    try {
        $.ajax({
            url: '/4DACTION/_V3_setDtv',
            dataType: 'json',
            async: false,
            cache: false,
            data: {
                id,
                codigoByPrint: printMoney.value,
                valueByPrint,
                'exchange[rate]': exchangeRate,
                'exchange[type]': defaultMoney.value
            },
        }).fail(function () {
            toastr.error(NOTIFY.get('ERROR_INTERNAL', 'Error'));
        });
    } catch (error) {
        console.error(error);
    }
}

async function setOc() {

    const defaultMoney = document.getElementById("defaultMoney");
    const printMoney = document.getElementById("printMoney");
    valueByPrint = settingsMoney.find(s => s.codigo === printMoney.value).value
    exchangeRate = settingsMoney.find(s => s.codigo === defaultMoney.value).value


    try {
        $.ajax({
            url: '/4DACTION/_V3_setCompras',
            dataType: 'json',
            async: false,
            cache: false,
            data: {
                id,
                codigoByPrint: printMoney.value,
                valueByPrint,
                'exchange[rate]': exchangeRate,
                'exchange[type]': defaultMoney.value
            },
        }).success(function () {


        }).fail(function () {
            toastr.error(NOTIFY.get('ERROR_INTERNAL', 'Error'));
        });

    } catch (error) {
        console.error(error);
    }
}