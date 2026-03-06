


$(document).ready(function(){
	let meta = document.createElement('meta');
	meta.httpEquiv = "X-UA-Compatible";
	meta.content = "IE=edge";
	document.getElementsByTagName('head')[0].appendChild(meta);

	meta = document.createElement('meta');
	meta.name = "viewport";
	meta.content = "width=device-width, initial-scale=1.0";
	document.getElementsByTagName('head')[0].appendChild(meta);

	meta = document.createElement('meta');
	meta.charset = "UTF-8";
	document.getElementsByTagName('head')[0].appendChild(meta);
});