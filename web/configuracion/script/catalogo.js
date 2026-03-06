var miMarco = document.getElementById('mi-marco');

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

const toCatalogoRedirect = (e) => {
  var frame = document.getElementById("mi-marco");
  let url = window.origin
  let newUrl = url.substring(8,url.length)
  frame.src = `https://dev-panel.herokuapp.com/sica?from=v3&user=soporte&url=${newUrl}&sid=${sid()}`;
  frame.style.height = window.innerHeight + "px";
  //https://dev-panel.herokuapp.com/sica?from=v3&user=soporte&url=pruebasrober.unabase.com&sid=UNABASE_AQIAEMZLtZ6nnnNPU2bbsvAO4IilBBwalg%2acRFTjEZ352LFuMu1GWMKwu-EikV%2a4GXbA-TmjJXRgOgUBHiE%2aSerlNg__
}

(function init() {


  toCatalogoRedirect()



})();