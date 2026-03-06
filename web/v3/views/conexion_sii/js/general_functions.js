

//------------------ General Functions section -------------------
//----------------------------------------------------------------


const addZero = (i) => {
  if (i < 10) {
    i = '0' + i;
  } else if (i > 12) {
    i = '0' + 1;
  }
  return i;
}


const isConnected = (ref) => {
  getInfo()
    .then(res => {
      let rnd = Math.round(Math.random() * (1000000000 - 10000000) + 10000000);
      if (res.data.logged_in) {
        if (res.data.connected_sii) {
          switch (ref) {
            case `login`:
              if (!res.data.connection_sii_status)
                location.href = `${window.location.origin}/v3/views/conexion_sii/view/standby_screen.html?v=${rnd}`;
              else
                location.href = `${window.location.origin}/v3/views/conexion_sii/view/list_dtc.html?v=${rnd}`;

              break;
            case `list_dtc`:
              if (!res.data.connection_sii_status)
                location.href = `${window.location.origin}/v3/views/conexion_sii/view/stanby_screen.html?v=${rnd}`;

              break;
            case `standby_screen`:
              if (res.data.connection_sii_status)
                location.href = `${window.location.origin}/v3/views/conexion_sii/view/list_dtc.html?v=${rnd}`;

              break;
            case `index`:
              if (!res.data.connection_sii_status) {
                location.href = `${window.location.origin}/v3/views/conexion_sii/view/standby_screen.html?v=${rnd}`;

              } else {
                location.href = `${window.location.origin}/v3/views/conexion_sii/view/list_dtc.html?v=${rnd}`;

              }

              break;
            case `index_banco`:
              if (!res.data.connection_sii_status) {
                location.href = `${window.location.origin}/v3/views/conexion_sii_pagos/view/standby_screen.html?v=${rnd}`;

              } else {
                location.href = `${window.location.origin}/v3/views/conexion_sii_pagos/view/list_pagos.html?v=${rnd}1`;

              }

              break;
            default:

              break;
          }

        } else {
          switch (ref) {
            case `login`:
              if (res.data.conexion_syncfy) {
                location.href = `${window.location.origin}/v3/views/conexion_sii/view/list_dtc.html?v=${rnd}`;
              }
              break;
            case `list_dtc`:

              break;
            case `standby_screen`:
              if (res.data.conexion_syncfy) {
                location.href = `${window.location.origin}/v3/views/conexion_sii/view/list_dtc.html?v=${rnd}`;
              }
              break;
            case `index`:

              if (res.data.conexion_syncfy) {
                location.href = `${window.location.origin}/v3/views/conexion_sii/view/list_dtc.html?v=${rnd}`;
              } else {

                location.href = `${window.location.origin}/v3/views/conexion_sii/view/login.html?v=${rnd}`;
              }


              break;

            case `index_banco`:
              location.href = `${window.location.origin}/v3/views/conexion_sii_pagos/view/login.html?v=${rnd}`;


              break;
            default:

              break;
          }

        }
      } else {
        location.href = `${window.location.origin}`;
      }



    });

}


const getServerInfo = async () => {
  getInfo()
    .then(res => {


      localStorage.removeItem('node_port');
      localStorage.removeItem('rut');
      localStorage.removeItem('colorCheck');
      localStorage.setItem('node_port', res.data.node_port);
      localStorage.setItem('node_url', res.data.node_url);
      localStorage.setItem('web_url', res.data.web_url);
      localStorage.setItem('rut', String(new Intl.NumberFormat("de-DE").format(res.data.rut)) + '-' + res.data.dv);
      localStorage.setItem('colorCheck', '');


      let r = document.getElementById('rut-login');
      if (r) {


        r.value = localStorage.getItem('rut');
      }



    });

}





function cardLoad(CL_) {
  let el = document.getElementById("cards");
  el.innerHTML += templates.card(CL_);
}


function alertLoad(AL_, AL_id) {
  let el = document.getElementById(AL_id);
  //el.innerHTML += templates.alerta(AL_);
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
    duration: 2500,
    close: false,
    gravity: "top", // `top` or `bottom`
    position: 'right', // `left`, `center` or `right`
    backgroundColor: color,
  }).showToast();

  //setTimeout(function(){  el.innerHTML = '' }, 9000);
}





function tableLoad(TL_, TL_id) {

  let el = document.getElementById(TL_id);
  el.innerHTML += templates.table(TL_);
}

function listLoad(LL_, LL_id) {

  let el = document.getElementById(LL_id);
  el.innerHTML = '';
  el.innerHTML += templates.list(LL_);
}



function selectorLoad(LL_, LL_id) {

  let el = document.getElementById(LL_id);
  el.innerHTML = '';
  el.innerHTML += templates.selector(LL_);
}

function selectorLoadNomina(LL_, LL_id) {
  let el = document.getElementById(LL_id);
  el.innerHTML += templates.selector_nomina(LL_);
}


function comprobantesLoad(LL_, LL_id) {

  let el = document.querySelector(`div.body_comprobante[data-id="${LL_id}"]`)
  el.innerHTML = '';
  el.innerHTML += templates.comprobante(LL_);
}

function selectLoad(SL_, SL_id) {

  if (SL_id) {
    let el = document.getElementById(SL_id);
    el.innerHTML += templates.table(SL_);
  } else {
    return templates.select(SL_);
  }

}


function loadingLoad(LL_id, LL_status, LL_txt) {

  let el = document.getElementById(LL_id);

  if (LL_status) {
    el.innerHTML = templates.spinners(LL_txt);
  } else {
    el.innerHTML = '';
  }

}


function loadingLoadOnModal(LL_id, LL_status, LL_txt) {

  let el = document.getElementById(LL_id);

  if (LL_status) {
    el.innerHTML = templates.spinners(LL_txt);
  } else {
    el.innerHTML = '';
  }

}


function simpleMsg(SM_, SM_id, SM_status) {

  let el = document.getElementById(SM_id);


  if (SM_status) {
    el.innerHTML += templates.simpleMsg(SM_);
  } else {
    el.innerHTML = '';
  }

}



function eraseHtml(SM_id) {

  document.getElementById(SM_id).innerHTML = '';

  return true;

}

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

(function init() {
  getServerInfo();
})();
