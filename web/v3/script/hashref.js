$(document).ready(function() {
	// Capturar hash de la URL
	var locator = window.location.hash;
	var path = window.location.pathname;
	
	if (locator.length > 1) {
		var uri = locator.substring(1);
		if (path != '/4DACTION/wbienvenidos')
			$('form').attr('action', '/4DACTION/W_INICIA_SESION#' + uri);
		else {
			
			if (uri.search('v2/') != -1) {
				setTimeout(function() {
					unaBase.loadInto.iframe('/' + uri.substring(3));
				}, 1000);
			} else
				unaBase.loadInto.viewport('/v3/views/' + uri);
		}
	}
});