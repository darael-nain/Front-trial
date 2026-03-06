$(document).ready(function() {
	$('html > body > aside > div > div > ul > li').each(function() {
		$(this).removeClass('active');
	});
	var tipoGasto = (typeof $('section.sheet').data('tipogasto') != 'undefined')? $('section.sheet').data('tipogasto') : $('table').data('tipogasto');
	if (typeof tipoGasto == 'undefined')
		tipoGasto = (typeof $('section.summary').data('tipogasto') != 'undefined')? $('section.summary').data('tipogasto') : undefined;
	switch (tipoGasto) {
		case 'OC':
			$('html > body > aside > div > div > ul > li[data-name="gastos"]').addClass('active');
			break;
		case 'FXR':
			if ($('section.sheet').data('factoring')) {
				$('html > body > aside > div > div > ul > li[data-name="factoring"]').addClass('active');
			}else{
				$('html > body > aside > div > div > ul > li[data-name="rendiciones"]').addClass('active');
			}
			break;
		case 'FACTORING':
			$('html > body > aside > div > div > ul > li[data-name="factoring"]').addClass('active');
			break;
		case 'FTG':
			$('html > body > aside > div > div > ul > li[data-name="factoring"]').addClass('active');
			break;
	}

	if (!($('section#sheet-compras').data('excedida') && access._564)) {
	    $('#menu [data-name="approve_excess"]').hide();
	}

});
