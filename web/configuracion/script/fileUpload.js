const inputXML = document.getElementById('fileXML')
const inputPDF = document.getElementById('filePDF')

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

const getDTCByOc = (id) => {
    let config = {
        method: 'get',
        url: window.origin + `/node/get-dtc-oc?idoc=${id}&hostname=${location.host}`,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        data: {
            'oc[id]': id
        }
    }

    axios(config)
        .then(res => {
            let nodeFile = document.querySelector('.input-file');
            nodeFile.querySelector('.type').textContent = res.data.rows[0].documento
            nodeFile.dataset.tipo = res.data.rows[0].documento
            nodeFile.dataset.id = res.data.rows[0].id
            nodeFile.dataset.numero = res.data.rows[0].numero
            let finalNode = document.querySelector('.final');
            let parent = nodeFile.parentNode;

            // Aquí se duplica el nodo basado en la longitud de res.rows
            for (let i = 1; i < res.data.rows.length; i++) { // -1 porque ya hay un nodo existente
                let clonedNode = nodeFile.cloneNode(true);
                clonedNode.querySelector('.type').textContent = res.data.rows[i].documento
                clonedNode.dataset.tipo = res.data.rows[i].documento
                clonedNode.dataset.id = res.data.rows[i].id
                clonedNode.dataset.numero = res.data.rows[i].numero
                
                parent.insertBefore(clonedNode, finalNode);
            }




        })
        .catch(error => {
            console.log("Fallo!!!")
            console.log(error)
        });
}

const alertLoad = (AL_) => {
    let color = ''
    switch (AL_.type) {
        case 'warning': {
            color = '#FFAC38'
            break;
        }

        case 'danger': {
            color = '#F47975'
            break;
        }

        case 'success': {
            color = '#4FC276'
            break;
        }
    }
    Toastify({
        text: AL_.msg,
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: 'right', // `left`, `center` or `right`
        backgroundColor: color,
    }).showToast();
}

const upload = (formData) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: location.origin + '/4DACTION/_V3_setUpload',
            type: 'POST',
            contentType: false,
            data: formData,
            dataType: 'json',
            processData: false,
            cache: false,
            success: data => resolve(data),
            error: (xhr, text, error) => reject(error)
        });
    });
}

const getFilesData = (iddoc, tipo, numero) => {
    const files = document.querySelector('.files-input');
    const filesData = [];
    for (let i = 1; i < files.children.length - 1; i++) {
        let f = files.children[i];
        if (f.querySelector('input[type=file]').files.length > 0) {
            let type = f.querySelector('input[type=file]').files[0].type;
            if (['text/xml', 'application/pdf'].includes(type)) {
                filesData.push({
                    file: f.querySelector('input[type=file]').files[0],
                    iddoc,
                    tipo,
                    numero,
                    tipo_doc: type
                });
            } else {
                alertLoad({ msg: 'El tipo de documento no está permitido', type: 'warning' });
            }
        }
    }
    return filesData;
}

const uploadFile = async (iddoc, tipo, numero) => {
    const filesData = getFilesData(iddoc, tipo, numero);
    
    let success = true
    try {
        if (filesData.length === 0) {
            alertLoad({ msg: 'No has seleccionado ningún documento!', type: 'warning' });
            success = false
            return;
        }

        for (const fileData of filesData) {
            const t = fileData.tipo_doc === 'text/xml' ? '|XML' : '';
            const index_ = `Doc_Tributario_Compra|${fileData.iddoc}${t}`;
            const formData = new FormData();
            formData.append('file', fileData.file);
            formData.append('filename', `${fileData.tipo} ${fileData.numero}`);
            formData.append('index', index_);
            formData.append('type_file', fileData.tipo_doc);

            try {
                await upload(formData);
                alertLoad({ msg: 'El archivo adjunto fue subido correctamente!', type: 'success' });
            } catch (error) {
                success = false
                // Puedes manejar el error como quieras.
                console.error('Error uploading file:', error);
            }
        }

    } catch (ex) {
        success = false
    }

    return success
}

const sid = () => {
    // var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        // if (c.indexOf(name) == 0) {
        if (c.match(/UNABASE/g)) {
            return c.substring(c.indexOf("UNABASE"));
        }
    }
    return "";
}


const uploadFileXML = async () => {
    try {
        
        const folio = getParameterByName('folio');
        var data = new FormData();
        data.append('file', inputXML.files[0]);
        data.append('sid', sid());

        let config = {
            method: 'post',
            url: `https://frank.unabase.com/node/import-xml-dtc?hostname=${window.location.host}&idoc=${folio}`,
            data
        };

        const res = await axios(config); // Ahora usando await aquí
        

        let iddoc, tipo, numero
        if (!res.data.success) {
            alertLoad({ msg: 'Hubo un error al subir el achivo XML!', type: 'warning' });
            return;
        }

        iddoc = res.data.id
        tipo = res.data.tipo
        numero = res.data.folio

        let c = await uploadFile(iddoc, tipo, numero);
        
        if (c) {
            document.querySelector('.bodyEmail').style.display = 'none';
            document.querySelector('.ready').style.display = '';
            alertLoad({ msg: 'El archivo XML fue subido correctamente!', type: 'success' });

        } else {
            alertLoad({ msg: 'Se ha producido un error al subir los archivos adjuntos!', type: 'warning' });
        }


    } catch (error) {
        alertLoad({ msg: 'Hubo un error al subir el archivo XML', type: 'error' });
        console.log("Fallo!!!");
        console.log(error);
    }
};


const onChange = (e, type) => {
    if (e.target.files.length > 0) { // Verifica si hay archivos seleccionados
        if (['text/xml'].includes(e.target.files[0].type)) {
            alertLoad({ msg: 'Formato correcto!', type: 'success' });
            inputPDF.disabled = false;
        } else {
            e.target.value = ''; // Limpia el input
            let t = type === 'text/xml' ? 'XML' : 'PDF'
            alertLoad({ msg: `El tipo de documento no está permitido, debe ser de tipo: ${t}`, type: 'warning' });
        }
    }
}


(function init() {
    const folio = getParameterByName('folio');

    inputXML.addEventListener('change', (e) => onChange(e, 'text/xml'))

    inputPDF.addEventListener('change', (e) => onChange(e, 'application/pdf'))

    const imageUrl = window.location.origin + "/4DACTION/logo_empresa_web";
    document.querySelector('.logo-main').src = imageUrl

    //getDTCByOc(folio)


})();
