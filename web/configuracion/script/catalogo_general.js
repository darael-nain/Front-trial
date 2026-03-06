const getValuesSica = () => {
  const url = new URL(window.location.origin + '/4DACTION/_light_getValoresSica')

  let res = fetch(url)
    .then(response => response.json())
    .then(json => json)
    .catch(err => {
      console.log(err)
      spinnerMain(false)
    });

  return res

}

const getValuesSicaServicio = () => {
  const url = new URL(window.location.origin + '/4DACTION/_light_getValoresSicaServicio')

  let res = fetch(url)
    .then(response => response.json())
    .then(json => json)
    .catch(err => {
      console.log(err)
      spinnerMain(false)
    });

  return res

}

const transformNumber = (n, mode, end = false, defecto = false) => {
  let resp;
  let sepDec;

  if (!defecto)
    sepDec = ",";
  else
    sepDec = unaBase.sepDecimal;


  if (n == "") {
    resp = "0"
  } else {
    if (mode == "int") {
      //Dato tipo number a string formateado
      if (sepDec == ",")
        resp = String(new Intl.NumberFormat("de-DE").format(n))
      else
        resp = String(new Intl.NumberFormat().format(n))


    } else if (mode == "view") {
      //Dato tipo string a string formateado


      if (sepDec == ",") {
        if (n.slice(-1) != "," || end) {
          n = n.replaceAll(".", "");
          n = n.replaceAll(",", ".");
          resp = String(new Intl.NumberFormat("de-DE").format(n))
        } else
          resp = n

      } else {
        if (n.slice(-1) != "." || end) {
          n = n.replaceAll(",", "");
          n = n.replaceAll(".", ",");
          resp = String(new Intl.NumberFormat().format(n))
        } else
          resp = n
      }




      if (resp == "NaN")
        resp = "0"

    } else if (mode == "format-all") {
      resp = unaBase.utilities.transformNumber(n.replace(/[^0-9,]/g, '').replace(/,/g, '.'), 'view')
    } else {
      //Dato tipo string a number para calculo
      if (typeof n === 'string') {
        if (sepDec == ",") {

          n = n.replaceAll(".", "");
          n = n.replaceAll(",", ".");
          resp = parseFloat(n)
        } else {

          n = n.replaceAll(",", "");
          n = n.replaceAll(".", ",");
          resp = parseFloat(n)
        }
      } else {
        resp = n;
      }


    }
  }

  return resp;

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


  modal.target.parentNode.parentNode.parentNode.parentNode.classList.remove("show");
  modal.target.parentNode.parentNode.parentNode.parentNode.style.display = "none";

  document.querySelector(".modal-backdrop").remove();

  document.body.classList.remove("modal-open");
  document.body.style = '';

}



