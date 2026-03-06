var importExcelBtn = document.getElementById('import-excel-modal');


function sid() {

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

let getInfo = async () => {
  let config = {

    method: 'get',
    url: `https://${window.location.host}/4DACTION/_light_get_server_info?sid=${sid()}`,

  };
  try {
    let res = await axios(config);
    return res;
  } catch (err) {
    throw err;
  }

}

const spinnerMain = (status) => {
  if (status) {
    document.getElementById('loading-screen').style.display = 'block'
  } else {
    document.getElementById('loading-screen').style.display = 'none'
  }
}

const getServerInfo = async () => {
  getInfo()
    .then(res => {
      localStorage.setItem('node_url', res.data.node_url);
      localStorage.setItem('web_url', res.data.web_url);
      localStorage.setItem('razon', res.data.razon);
    });

}

function alertLoad(AL_, AL_id) {
  let el = document.getElementById(AL_id);
  el.innerHTML += templates.alerta(AL_);

  setTimeout(function () { el.innerHTML = '' }, 9000);
}

const getFormasPago = () => {
  const url = new URL(window.location.origin + '/4DACTION/_force_getFormasPago')

  let res = fetch(url)
    .then(response => response.json())
    .then(json => json)
    .catch(err => {
      console.log(err)
      spinnerMain(false)
    });

  return res

}


const getProyeccionPago = (id) => {
  const url = new URL(window.location.origin + '/4DACTION/_force_getProyeccionPago')
  data = {
    id_forma_pago: id
  }

  Object.keys(data).forEach(key => url.searchParams.append(key, data[key]))
  let res = fetch(url)
    .then(response => response.json())
    .then(json => json)
    .catch(err => {
    });

  return res

}



const openModal = (modal) => {


  modal.classList.add("show");
  modal.style.display = "block";


  var div = document.createElement('div');
  // better to use CSS though - just set class
  div.setAttribute('class', 'modal-backdrop fade show');
  document.body.appendChild(div);

  document.body.classList.add("modal-open");

  document.body.style = 'overflow: hidden; padding-right: 15px;';


}

const closeModal = (modal) => {
  modal = modal.currentTarget ? modal.currentTarget.closest('#modalValues') : modal
  modal.classList.remove("show");
  modal.style.display = "none";

  document.querySelector(".modal-backdrop").remove();

  document.body.classList.remove("modal-open");
  document.body.style = '';

}

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
  Command: toastr["success"]($mensaje, 'Correcto')
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

const importExcelData = async  (data) => {

	let config = {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		method: 'post',
		url: `${localStorage.getItem('node_url')}/import-excel-random-data?hostname=${window.location.origin}&sid="${sid()}"`,
		data

	};

    try{
    	return  axios(config);
    }catch(err){
    	throw err;
    }
	
}


const importExcelRandom = (e) => {
  let file = document.getElementById('formFile')
  if (file.files.length > 0) {
    
    //let sid = 

    let data = new FormData();
    let attachment = file.files[0];
    data.append('upload[attachment]', attachment);
    //data.append('sid', sid);
    $.ajax({
      url: localStorage.getItem('node_url') + '/import-excel-random-data?hostname=' + window.location.origin + '&id=' + $('section.sheet').data('id') + '&sid=' + encodeURIComponent(sid),
      type: 'POST',
      contentType: false,
      data: data,
      processData: false,
      cache: false,
      success: function(data) {
        if (data.success) {
         
        } else {
       
        }
      },
      fail: function(e1,e2,e3) {
        document.getElementById('warning-modal').style.display = ''
        document.getElementById('warning-modal').innerHTML = 'No fue posible realizar la cargar de los datos debido a un problema con el servidor, Por favor intente nuevamente. <p><small>Si el inconveniente persiste, por favor comuniquese con Soporte@una.cl.</small></p>'
    
      }
    });
    
      // importExcelData(data)
      //   .then(function (response) {
          
      //   })
      //   .catch(function (error) {
      //     console.log(error);
      //   });
    

  } else {

    document.getElementById('warning-modal').style.display = ''
    document.getElementById('warning-modal').innerHTML = 'Debes seleccionar un achivo excel para poder importarlo!'

  }
}



(function init() {
  getServerInfo();

  if(importExcelBtn){

    importExcelBtn.addEventListener("click", (e) => importExcelRandom(e));
  }


})();