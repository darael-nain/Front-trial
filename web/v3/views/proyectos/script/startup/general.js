$(document).ready(function() {

	$('section.sheet').find('tfoot .numeric.currency input').number(true, currency.decimals, ',', '.', true);
	$('section.sheet').find('tfoot .numeric.percent input').number(true, 2, ',', '.', true);
	//$('section.sheet').find('footer .numeric.currency span').number(true, 0, ',', '.', true);
	//$('section.sheet').find('footer .numeric.percent span').number(true, 2, ',', '.', true);

	unaBase.ui.expandable.init();


    $('ul button.show').button({
		icons: {
			primary: 'ui-icon-carat-1-s'
		},
		text: false
	});



});
