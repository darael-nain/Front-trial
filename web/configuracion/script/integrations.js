var dataPipeline = {}
var dpp = document.getElementById('dropdown_pipelines_pipedrive')
var dp = document.getElementById('dropdown_stages_pipedrive')
const nodeUrl = localStorage.getItem('node_url')

let token_bsale_input = document.getElementById('token_bsale')
let token_syncfy = document.getElementById('token_syncfy')
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

const setParamGeneral = () => {
    var data = new FormData();
    data.append('token', document.getElementById('token_pipedrive').value.trim());
    data.append('stage', document.getElementById('stage_pipedrive').dataset.stage_id);
    data.append('etapa', document.getElementById('etapa_pipedrive').dataset.charge_id);
    data.append('url', document.getElementById('url_pipedrive').value.replaceAll('https://', '').replaceAll('http://', '').replaceAll('/', '').replaceAll(':', '').trim());
    data.append('pipeline', document.getElementById('pipelines_pipedrive').dataset.pipeline_id);
    data.append('id', 2);
    let config = {
        method: 'post',
        url: `https://v3dev.unabase.com/node/set-integrations-data?hostname=${location.origin}`,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        data
    }


    axios(config)
        .then(res => {
            if (res.data.success) {

                generarAvisoExitoso("Parametros actualizados correctamente.");
                getParamGeneral()
            }
            else {

                generarAvisoError(res.data.errorMsg ? res.data.errorMsg : "Error al actualizar parametros.");
            }



        })
        .catch(error => {

            generarAvisoError("Error al actualizar parametros.");
            console.log("Fallo!!!")
            console.log(error)
        });




}

const getParametros = () => {
    let config = {

        method: 'get',
        url: window.origin + "/4DACTION/_light_getParameters",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'

        }
    }

    axios(config)
        .then(res => {
            document.getElementById('token_bsale').value = res.data.token_bsale
            
        })
        .catch(error => {
            generarAvisoError("Error al obtener parametros");
            console.log("Fallo!!!")
            console.log(error)
        });

}


const getParamGeneral = () => {

    let config = {

        method: 'get',
        url: `${nodeUrl}/get-integrations-data?hostname=${location.origin}`,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'

        }
    }

    document.getElementById('url_pipedrive').addEventListener("change", (el) => {
        if (el.target.textContent == "")
            document.getElementById('stage_pipedrive').value = ""
        else {

        }
    });

    axios(config)
        .then(res => {
            dataPipeline = res.data
            
            generarAvisoExitoso("Parametros obtenidos correctamente");

            document.getElementById('token_pipedrive').value = res.data.rows[0].token
            document.getElementById('url_pipedrive').value = res.data.rows[0].base_url
            document.getElementById('stage_pipedrive').value = res.data.rows[0].name_stage
            document.getElementById('stage_pipedrive').dataset.stage_id = res.data.rows[0].stage
            document.getElementById('pipelines_pipedrive').value = res.data.rows[0].name_pipeline
            document.getElementById('pipelines_pipedrive').dataset.pipeline_id = res.data.rows[0].pipeline
            document.getElementById('etapa_pipedrive').value = res.data.rows[0].charge == "Nota de venta" ? "Negocios" : res.data.rows[0].charge == "Cotizacion" ? "Cotizaciones" : "Cotizaciones"
            document.getElementById('etapa_pipedrive').dataset.charge_id = res.data.rows[0].charge != "" ? res.data.rows[0].charge : "Cotizacion"
            document.getElementById('link_pipedrive').href = res.data.rows[0].base_url != "" ? res.data.rows[0].base_url : "https://pipedrive.com"

            res.data.rows[0].pipelines.map(e => {
                let node = document.createElement("a");
                node.dataset.id = e.id_pipeline
                node.textContent = e.name
                node.classList.add("dropdown-item", "pipelines");
                dpp.appendChild(node);
            });
            document.querySelectorAll('.dropdown-item.pipelines').forEach(e => {
                e.addEventListener("click", (el) => {
                    let pp = document.getElementById('pipelines_pipedrive')
                    pp.value = el.target.textContent
                    pp.dataset.pipeline_id = el.target.dataset.id

                    if (el.target.dataset.id != document.getElementById('stage_pipedrive').dataset.pipeline_id) {

                        if (el.target.dataset.id != 0) {
                            dp.innerHTML = ""
                            dataPipeline.rows[0].stages.map(e => {
                                if (e.id_pipeline == el.target.dataset.id) {
                                    let node = document.createElement("a");
                                    node.dataset.id = e.id_stage
                                    node.textContent = e.name
                                    node.classList.add("dropdown-item", "stages");
                                    dp.appendChild(node);
                                }
                            });
                            document.querySelectorAll('.dropdown-item.stages').forEach(e => {
                                e.addEventListener("click", (el) => {

                                    document.getElementById('stage_pipedrive').value = el.target.textContent
                                    document.getElementById('stage_pipedrive').dataset.stage_id = el.target.dataset.id
                                });

                            });
                        }
                    }

                });

            });

            if (res.data.rows[0].pipeline != 0) {
                res.data.rows[0].stages.map(e => {
                    if (e.id_pipeline == res.data.rows[0].pipeline) {
                        let node = document.createElement("a");
                        node.dataset.id = e.id_stage
                        node.textContent = e.name
                        node.classList.add("dropdown-item", "stages");
                        dp.appendChild(node);
                    }
                });
            }
            document.querySelectorAll('.dropdown-item.stages').forEach(e => {
                e.addEventListener("click", (el) => {
                    document.getElementById('stage_pipedrive').value = el.target.textContent
                    document.getElementById('stage_pipedrive').dataset.stage_id = el.target.dataset.id
                });

            });

            document.querySelectorAll('.dropdown-item.charge').forEach(e => {
                e.addEventListener("click", (el) => {
                    document.getElementById('etapa_pipedrive').value = el.target.textContent
                    document.getElementById('etapa_pipedrive').dataset.charge_id = el.target.dataset.id
                });

            });
        })
        .catch(error => {
            generarAvisoError("Error al obtener parametros");
            console.log("Fallo!!!")
            console.log(error)
        });


}

const setParametros = () => {
    var data = new FormData();
    data.append('token_bsale', token_bsale_input.value);

    let config = {
        method: 'post',
        url: window.origin + "/4DACTION/_light_setParameters",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        data
    }

    axios(config)
        .then(res => {
            updateBSale()
            generarAvisoExitoso("Parametros actualizados correctamente");
        })
        .catch(error => {
            generarAvisoError("Error al obtener parametros");
            console.log("Fallo!!!")
            console.log(error)
        });
}

const setTokenSyncfy = () => {

    const coincideRFC = (rfc, cadena) => {
        const regex = new RegExp(`^${cadena.replace(/\*/g, '.')}$`);
        return regex.test(rfc);
    };

    const apiKey = document.getElementById('token_syncfy').value;

    // Configuración de la petición para crear el usuario
    // Se incluye la API key como parámetro de consulta en la URL
    const createUserConfig = {
        method: 'GET',
        url: `https://api.syncfy.com/v1/users?api_key=${apiKey}`,
        headers: {
            'Content-Type': 'application/json'
        },
    };

    
    let token
    // Crear el usuario en Syncfy
    axios(createUserConfig)
        .then(res => {
            
            const userId = res.data.response[1].id_user;
            let data_session = JSON.stringify({
                "id_user": userId
            });
            return axios.post(`https://api.syncfy.com/v1/sessions?api_key=${apiKey}`, data_session, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        })

        .then(res => {
            token = res.data.response.token;
            return axios.get(`https://api.syncfy.com/v1/credentials`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
        })
        .then(res => {
            
            let idCredential
            const rfc = localStorage.getItem('idNumber') 
            res.data.response.forEach(r => {
                if(coincideRFC(rfc,r.username)){
                    idCredential = r.id_credential
                }
            })
            let data = new FormData();
            data.append('token', token);
            data.append('token2', apiKey);
            data.append('stage', '');
            data.append('etapa', '');
            data.append('credential', idCredential);
            data.append('url', 'https://api.syncfy.com/v1');
            data.append('pipeline', '');
            data.append('id', 3);

            return axios.post(`${nodeUrl}/set-integrations-data?hostname=${location.origin}`, data, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
        })
        .then(res => {
            generarAvisoExitoso("Parametros actualizados correctamente.");
        })
        .catch(error => {
            generarAvisoError("Error al actualizar parametros.");
            console.log("Fallo!!!")
            console.log(error)
        });
}



const getParamTokenSyncfy = () => {

    let config = {

        method: 'get',
        url: `${nodeUrl}/get-integrations-data?hostname=${location.origin}&id=3`,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }
    axios(config)
        .then(res => {
            
            document.getElementById('token_syncfy').value = res.data.rows[0].token2
        })
        .catch(error => {
            generarAvisoError("Error al obtener parametros");
            console.log("Fallo!!!")
            console.log(error)
        });


}


(function init() {

    getParamGeneral();
    getParametros()


    getParamTokenSyncfy()

    document.getElementById('renewToken').addEventListener('click', (e) => setTokenSyncfy())
    token_bsale_input.addEventListener('change', (e) => setParametros())
    token_syncfy.addEventListener('change', (e) => setTokenSyncfy())
})();
