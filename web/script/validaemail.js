// validador de email
function validarEmail(valor) {
if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(valor)){
//alert("La dirección de email " + valor + " es correcta.")
return (true)
} else {
alert("Email incorrecto.");

return (false);
}
}
