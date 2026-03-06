
let tiposDocumento = []
let idnv = document.querySelector('section.sheet').dataset.id
//Obtener tipos de documentos

let getInfo = async () => {

    let config = {

        method: 'get',
        url: `https://${window.location.host}/4DACTION/_V3_getTipoDocumento?sid=${unaBase.sid.encoded()}&valido=true&id_nv=${idnv}&q=`,

    };

    try {
        let res = await axios(config);
        tiposDocumento = res.data.rows
        return res;
    } catch (err) {
        throw err;
    }

}

getInfo();