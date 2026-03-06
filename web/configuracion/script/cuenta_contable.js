var frame = document.getElementById("mi-marco");

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

  let url = window.origin
  let newUrl = url.substring(8, url.length)
  var alturaContenedor = parent.document.querySelector('section #iframe').style.height;
  const numeroInicial = parseFloat(alturaContenedor);
  // Resta 200 píxeles
  const numeroFinal = numeroInicial - 100;
  // Convierte el resultado a string y agrega 'px'
  const valorFinal = numeroFinal + 'px';
  //alturaContenedor = alturaContenedor - 30
  frame.src = `https://dev-panel.herokuapp.com/accounting?from=v3&user=soporte&hostname=${newUrl}&sid=${sid()}`;
  //frame.style.height = valorFinal

  //https://dev-panel.herokuapp.com/sica?from=v3&user=soporte&url=pruebasrober.unabase.com&sid=UNABASE_AQIAEMZLtZ6nnnNPU2bbsvAO4IilBBwalg%2acRFTjEZ352LFuMu1GWMKwu-EikV%2a4GXbA-TmjJXRgOgUBHiE%2aSerlNg__
}

const aplicarEstilosIframe = () => {

}

document.addEventListener('DOMContentLoaded', () => {
  toCatalogoRedirect()
  // Accede al contexto de la página principal desde el iframe
  const parentDocument = window.parent.document;
  const fullscreenBtn = parentDocument.querySelector('#fullscreen-btn');
  const iframe = document.getElementById('mi-marco');
  
  fullscreenBtn.addEventListener('click', () => {
    iframe.requestFullscreen();
  });
  
  
  iframe.addEventListener('load', aplicarEstilosIframe);

});


