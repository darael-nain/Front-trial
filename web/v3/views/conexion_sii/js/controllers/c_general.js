let bandejaDtc
let getInfo = async () => {
    let config = {

        method: 'get',
        url: `${window.location.origin}/4DACTION/_light_get_server_info?sid=${sid()}`,

    };
    try {
        let res = await axios(config);
        bandejaDtc = res.data
        return res;
    } catch (err) {
        throw err;
    }

}

const getBusiness = async (q, y) => {


    let tipo = "business";


    let config = {

        method: 'get',
        url: `${localStorage.getItem('node_url')}/light-search?q=${q}&hostname=${localStorage.getItem('web_url')}&tipo=${tipo}&presupuestos=true&year=${y}&limit=100`
    };

    try {
        let res = await axios(config);
        return res;
    } catch (err) {
        throw err;
    }



}

const getClasification = async () => {


    let tipo = "clasification";


    let config = {

        method: 'get',
        url: `${localStorage.getItem('node_url')}/light-search?hostname=${localStorage.getItem('web_url')}&tipo=${tipo}`
    };

    try {
        let res = await axios(config);
        return res;
    } catch (err) {
        throw err;
    }



}

const getItemByCatalogo = async (q, y) => {


    let tipo = "catalogo";


    let config = {

        method: 'get',
        url: `${localStorage.getItem('node_url')}/light-search?q=${q}&hostname=${localStorage.getItem('web_url')}&tipo=${tipo}&presupuestos=true&year=${y}&limit=100`
    };

    try {
        let res = await axios(config);
        return res;
    } catch (err) {
        throw err;
    }



}

const getItems = async (id, q = '') => {


    let tipo = "item";


    let config = {

        method: 'get',
        url: `${localStorage.getItem('node_url')}/light-search?q=${q}&hostname=${localStorage.getItem('web_url')}&tipo=${tipo}&limit=20&id=${id}`
    };

    try {
        let res = await axios(config);
        return res;
    } catch (err) {
        throw err;
    }



}

const myRnId = () => parseInt(Date.now() * Math.random());
const loadScriptListDtc = () => {
    let scriptSrc = [
        '../js/list_dtc.js'
    ];
    let cont = 0;
    scriptSrc.forEach(val => {
        let script = document.createElement('script');
        script.onload = function () {
            console.log("Script loaded and ready");
        };
        script.src = val + '?v=' + myRnId();
        document.getElementsByTagName('body')[0].appendChild(script);
        cont++;
    });
};

const loadScriptLogin = () => {
    let scriptSrc = [
        '../js/controllers/c_list_dtc.js',
        '../js/general_functions.js',
        '../js/classes.js',
        '../js/list_dtc.js'
    ];
    let cont = 0;
    scriptSrc.forEach(val => {
        let script = document.createElement('script');
        script.onload = function () {
            console.log("Script loaded and ready");
        };
        script.src = val + '?v=' + myRnId();
        document.getElementsByTagName('body')[0].appendChild(script);
        cont++;
    });
};


(function init() {
    const scriptElement = document.currentScript;
    const parametro = scriptElement.getAttribute('data-from');
    if (parametro === 'list_dtc') {
        loadScriptListDtc();
    }

})();