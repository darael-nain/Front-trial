const myRnId = () => parseInt(Date.now() * Math.random());

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

function loadingLoad(LL_id,LL_status,LL_txt) {
 
  let el = document.getElementById(LL_id);


  if (LL_status) {
  	el.innerHTML = templates.spinners(LL_txt);
  }else{
  	el.innerHTML='';
  }
  
}


const loadScriptBalance = () => {
  let scriptSrc = ['../../../../configuracion/script/catalogo_general.js', '../../script/balance.js']
  let cont = 0
  scriptSrc.forEach(val => {
    let script = document.createElement('script');
    script.onload = function () {
      console.log("Script loaded and ready");
    };
    script.src = val + '?' + myRnId();
    document.getElementsByTagName('body')[0].appendChild(script);
    cont++
  })
}


const loadScriptEERR = () => {
  let scriptSrc = ['../../../../configuracion/script/catalogo_general.js', '../../script/eerr.js']
  let cont = 0
  scriptSrc.forEach(val => {
    let script = document.createElement('script');
    script.onload = function () {
      console.log("Script loaded and ready");
    };
    script.src = val + '?' + myRnId();
    document.getElementsByTagName('body')[0].appendChild(script);
    cont++
  })
}

const loadScriptParametros = () => {
  let scriptSrc = ['../../../../configuracion/script/parametros.js', '../../../../configuracion/script/index.js']
  let cont = 0
  scriptSrc.forEach(val => {
    let script = document.createElement('script');
    script.onload = function () {
      console.log("Script loaded and ready");
    };
    script.src = val + '?' + myRnId();
    document.getElementsByTagName('body')[0].appendChild(script);
    cont++
  })
}



const isConnected = (ref) => {
  getInfo()
    .then(res => {

      if (!res.data.logged_in) {
        location.href = `${window.location.origin}`;
      }



    });

}




(function init() {
  const scriptElement = document.currentScript;
  const parametro = scriptElement.getAttribute('data-from');
  if (parametro === 'from-balance') {
    loadScriptBalance();
  } else if (parametro === 'from-eerr') {
    loadScriptEERR();
  } else if (parametro === 'parametros') {
    loadScriptParametros();
  }



})();