

let getSiiDtc = async (date) => {
	const checkUrl = `${window.origin}/4DACTION/_v3_checkLogin?nodeUrl=${encodeURIComponent("https://frank.unabase.com/node")}`;
	const r = await fetch(checkUrl, { credentials: "include", cache: "no-store" });
	const data = await r.json();
	
	if (!data.isLogin || data.login == null) {
		// CANCELA: no carga data
	} else {
		let config = {
			method: 'get',
			url: `${localStorage.getItem('node_url')}/get-sii-dtc?hostname=${window.location.origin}&date=${date}`,

		};

		try {
			let res = await axios(config);
			return res.data.data?.rows;
		} catch (err) {
			throw err;
		}
	}
}


const getDocXRev = async (date, estado) => {

	const checkUrl = `${window.origin}/4DACTION/_v3_checkLogin?nodeUrl=${encodeURIComponent("https://frank.unabase.com/node")}`;
	const r = await fetch(checkUrl, { credentials: "include", cache: "no-store" });
	const data = await r.json();
	
	if (!data.isLogin || data.login == null) {
		// CANCELA: no carga data
	} else {
		
		let config = {

			method: 'get',
			url: `${localStorage.getItem('node_url')}/get-doc-x-rev?hostname=${window.location.origin}&date=${date}&estado=${estado}`,

		};

		try {
			let res = await axios(config);
			return res.data;
		} catch (err) {
			throw err;
		}
	}


}

const getTipoDoc = async () => {
	const checkUrl = `${window.origin}/4DACTION/_v3_checkLogin?nodeUrl=${encodeURIComponent("https://frank.unabase.com/node")}`;
	const r = await fetch(checkUrl, { credentials: "include", cache: "no-store" });
	const data = await r.json();
	
	if (!data.isLogin || data.login == null) {
		// CANCELA: no carga data
	} else {
		let config = {

			method: 'get',
			url: `${localStorage.getItem('node_url')}/get-tipo-doc?hostname=${window.location.origin}`,

		};
		
		try {
			let res = await axios(config);
			return res.data;
		} catch (err) {
			throw err;
		}
	}
}




const setActions = async (ids, action) => {

	let config = {

		method: 'post',
		url: `${localStorage.getItem('node_url')}/set-justify?hostname=${window.location.origin}&action=${action}&sid="${sid()}"`,
		data: ids
	};

	try {
		return axios(config);
	} catch (err) {
		throw err;
	}

}

const getOcMatch = async (ids, type, fxr, date) => {

	let config = {

		method: 'post',
		url: `${localStorage.getItem('node_url')}/get-oc-match?hostname=${window.location.origin}&type=${type}&fxr=${fxr}&date=${date}`,
		data: ids
	};

	try {
		return axios(config);
	} catch (err) {
		throw err;
	}

}

const getDTCMatch = async (ids, date, tipodoc = "", tipodocbase = '') => {

	let config = {

		method: 'post',
		url: `${localStorage.getItem('node_url')}/get-dtc-match?hostname=${window.location.origin}&date=${date}&tipo_doc=${tipodoc}&tipo_doc_bandeja=${tipodocbase}`,
		data: ids
	};

	try {
		return axios(config);
	} catch (err) {
		throw err;
	}

}


const setJustify = async (ids, type) => {

	let config = {

		method: 'post',
		url: `${localStorage.getItem('node_url')}/set-justify?hostname=${window.location.origin}&type=${type}&sid="${sid()}"`,
		data: ids
	};

	try {
		return axios(config);
	} catch (err) {
		throw err;
	}

}


const uploadFileAdjunto = async (data) => {

	
	let config = {

		method: 'post',
		url: `${localStorage.getItem('node_url')}/upload-file?hostname=${window.location.origin}&sid="${sid()}"`,
		data: data
	};

	try {
		return axios(config);
	} catch (err) {
		throw err;
	}

}

const downloadPDFDTC = (id, folio) => {

	console.log("ID EN C_LIST_DTC: ", id)

	var url =
		localStorage.getItem('node_url') +
		"/download-pdf-dtc/?download=true&entity=conexion_sii" +
		"&id=" +
		id +
		"&folio=" +
		folio +
		"&sid=" +
		sid() +
		"&hostname=" +
		window.location.origin;

	var download = window.open(url);
	download.blur();
	window.focus();



}

const downloadPDFBoleta = (id) => {

	console.log("ID BOLETA EN C_LIST_DTC: ", id)

	var url =
		localStorage.getItem('node_url') +
		"/_SII_getBoleta?id=" +
		id +
		"&hostname=" +
		window.location.hostname;

	var download = window.open(url);
	download.blur();
	window.focus();

}


