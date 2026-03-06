$(document).ready(
	function() {
		$('#dialog').hide();
	}
);

function dialog(url){
	$('html').css('overflow', 'hidden');
	$('#dialog .loader .render').load(url);
	if ($('#intro object'))
		$('#intro object').hide();
	$('#dialog').fadeIn('slow');
	return false;
}

/*
var dialog = function(url) {
	$('html').css('overflow', 'hidden');
	$('#dialog .loader .render').load(url);
	if ($('#intro object'))
		$('#intro object').hide();
	$('#dialog').fadeIn('slow');
	return false;
};*/

var closeDialog = function() {
	$('#dialog').fadeOut('slow');
	if ($('#intro object'))
		$('#intro object').show();
	$('html').css('overflow', 'auto');
	return false;
};