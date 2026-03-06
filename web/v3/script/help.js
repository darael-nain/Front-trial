// test

var enjoyhint_instance;
var enjoyhint_script_steps;

var buildHelp = function() {
	enjoyhint_instance  = new EnjoyHint({});
	enjoyhint_script_steps = [];

	if ($('body.menu > aside > div > div > ul > li.active').length == 0) {

		if ($('[data-name="inbox"]').length > 0)
			enjoyhint_script_steps.push({
			    'next [data-name="inbox"]>a' : 'Inbox <br><br> Es la bandeja de entrada de todos los avisos , solicitudes y notificaciones que se envian desde el sistema.',
			  	"nextButton" : { text: "Siguiente"},
			  	"showSkip" : false,
			    "left": -20,
			    "right": 5,
			    "top": 5,
			    "bottom": 5
			  });
	
		if ($('[data-name="cotizaciones"]').length > 0)
			enjoyhint_script_steps.push({
			    'next [data-name="cotizaciones"]>a' : '<strong>En UNABASE podemos..</strong><br><br>Crear presupuestos <br> definiendo cuales serán tus gastos, valor de venta y utilidad proyectada.<br><br><br><em>“Enviar presupuestos a ciegas , sin tener claro los costos <br> y utilidad final , nos puede llevar al fracaso”</em>',
			    "nextButton" : { text: "Siguiente"},
			    "showSkip" : false,
			    "left": -20,
			    "right": 5,
			    "top": 5,
			    "bottom": 5
			  });

		if ($('[data-name="negocios"]').length > 0)
			enjoyhint_script_steps.push({
			    'next [data-name="negocios"]>a' : 'Negocios<br><br>Cuando un presupuesto es aprobado, lo transformamos en negocio.<br>A partir de aquí el negocio nos permite revisar <br>y comparar los gastos proyectados con los reales y ver si se está cumpliendo <br>con la utilidad esperada, en resumen, tenemos siempre el control de nuestro proyecto. <br><br><br>“Quisiera tener siempre la vista de cuanto nos falta por gastar, con esto podría proyectar de mejor forma <br>el cierre de un negocio y la utilidad que obtendré por el”',
			    "nextButton" : { text: "Siguiente"},
			    "showSkip" : false,
			    "left": -20,
			    "right": 5,
			    "top": 5,
			    "bottom": 5
			  });

		if ($('[data-name="gastos"]').length > 0)
			enjoyhint_script_steps.push({
			    'next [data-name="gastos"]>a' : 'Ordenes de compra<br><br>Es tiempo de ingresar todos los gastos a tu sistema, <br>Con las ordenes de compra puedes ingresar un gasto a un proyecto y<br>formalizar con un proveedor el acuerdo. <br><br><br>“Cuanto tiempo perdemos en buscar el origen de una boleta o factura de proveedor que si no tiene <br>un respaldo adecuado puede incluso estar duplicado.”',
			    "nextButton" : { text: "Siguiente"},
			    "showSkip" : false,
			    "left": -20,
			    "right": 5,
			    "top": 5,
			    "bottom": 5
			  });

		if ($('[data-name="rendiciones"]').length > 0)
			enjoyhint_script_steps.push({
			    'next [data-name="rendiciones"]>a' : 'Rendiciones<br><br>UNABASE permite hacer registro y seguimiento de las solicitudes<br>de fondo. También rendir y dejar registro de las diferencias. <br>Siempre sabrás cuanto fue lo que realmente se utilizo de los fondos<br>solicitados. <br><br><br>“Mis rendiciones se manejan con planillas en las que declaran lo que gastaron <br>y en que concepto, sin embargo siempre tengo la duda si realmente <br> en mis negocios esas platas las tengo bien consideradas”',
			  	"nextButton" : { text: "Siguiente"},
			  	"showSkip" : false,
			    "left": -20,
			    "right": 5,
			    "top": 5,
			    "bottom": 5
			  });

		if ($('[data-name="dtc"]').length > 0)
			enjoyhint_script_steps.push({
			    'next [data-name="dtc"]>a' : 'Documentos de compra<br><br>En UNABASE las factura, boletas y comprobantes de compra <br >estarán siempre en este modulo.<br><br><br>“¿Como puedo ver el libro de compra o el <br> de retenciones o todos los comprobantes de taxi?”',
			  	"nextButton" : { text: "Siguiente"},
			  	"showSkip" : false,
			    "left": -20,
			    "right": 5,
			    "top": 5,
			    "bottom": 5
			  });

		if ($('[data-name="dtv"]').length > 0)
			enjoyhint_script_steps.push({
			    'next [data-name="dtv"]>a' : 'Documentos de venta<br><br>En UNABASE las factura y/o boletas de venta. <br >estarán siempre en este modulo”',
			  	"nextButton" : { text: "Siguiente"},
			  	"showSkip" : false,
			    "left": -20,
			    "right": 5,
			    "top": 5,
			    "bottom": 5
			  });

		if ($('[data-name="ingresos"]').length > 0)
			enjoyhint_script_steps.push({
			    'next [data-name="ingresos"]>a' : 'Ingreso <br><br> Todos los registros de cobranza a tus clientes podrás consultarlo en esta sección.”',
			  	"nextButton" : { text: "Siguiente"},
			  	"showSkip" : false,
			    "left": -20,
			    "right": 5,
			    "top": 5,
			    "bottom": 5
			  });

		if ($('[data-name="egresos"]').length > 0)
			enjoyhint_script_steps.push({
			    'next [data-name="egresos"]>a' : 'Egresos <br><br> Todos los pagos realizados a proveedores podrás consultarlo en esta sección.”',
			  	"nextButton" : { text: "Siguiente"},
			  	"showSkip" : false,
			    "left": -20,
			    "right": 5,
			    "top": 5,
			    "bottom": 5
			  });

		if ($('[data-name="presupuestos"]').length > 0)
			enjoyhint_script_steps.push({
			    'next [data-name="presupuestos"]>a' : 'Presupuestos de gastos <br><br> Que no se te escape ningún gasto de tu empresa. Acá podrás hacer tus presupuestos y llevar un control de acuerdo a lo planificado.',
			  	"nextButton" : { text: "Siguiente"},
			  	"showSkip" : false,
			    "left": -20,
			    "right": 5,
			    "top": 5,
			    "bottom": 5
			  });

		if ($('[data-name="contactos"]').length > 0)
			enjoyhint_script_steps.push({
			    'next [data-name="contactos"]>a' : 'Contactos <br><br> Los contactos son escenciales para cualquier negocio <br> clientes , proveedores y los contactos de ellos se reunen en este modulo<br><br><br>“¿Necesito buscar todos los -productores- con los que he trabajado?”',
			  	"nextButton" : { text: "Siguiente"},
			  	"showSkip" : false,
			    "left": -20,
			    "right": 5,
			    "top": 5,
			    "bottom": 5
			  });


		if ($('[data-name="catalogo"]').length > 0)
			enjoyhint_script_steps.push({
			    'next [data-name="catalogo"]>a' : 'Catálogo <br><br> El catalogo reune todos los servicios o productos <br> que la empresa vende o compra, la relación con los contactos permite obtener<br>información de gran utilidad.<br><br><br> “Tengo que definir precios para todo lo que vendo y estandarizar”<br>“¿Cuanto llevo gastado este año en -equipo tecnico- o en -tintas-?” ',
			  	"nextButton" : { text: "Siguiente"},
			  	"showSkip" : false,
			    "left": -20,
			    "right": 5,
			    "top": 5,
			    "bottom": 5
			  });

		if ($('[data-name="ot"]').length > 0)
			enjoyhint_script_steps.push({
			    'next [data-name="ot"]>a' : 'OT <br><br> Si necesitas dejar por escrito las solicitudes a tu equipo de trabajo <br> las OT son la solución. Puedes definir fechas , responsables <br> y adjuntar archivos. Valoriza el trabajo y consideralo como parte de tus gasto en los proyecto <br><br><br> “Toda solicitud ahora queda en los mails y no tengo como hacer seguimiento”',
			  	"nextButton" : { text: "Siguiente"},
			  	"showSkip" : false,
			    "left": -20,
			    "right": 5,
			    "top": 5,
			    "bottom": 5
			  });

		if ($('[data-name="timesheet"]').length > 0)
			enjoyhint_script_steps.push({
			    'next [data-name="timesheet"]>a' : 'Timesheet <br><br> Cuando las OT ya son parte del trabajo , con el timesheet <br> tu equipo de trabajo puede declarar cuanto se ha trabajado en una OT. <br> Con esto podrás tener claro cuanto tiempo toma un trabajo. <br><br><br> “Necesito saber en que está mi equipo hoy”<br>“Tengo claro que invertí mucho en Horas hombre para este proyecto”',
			  	"nextButton" : { text: "Siguiente"},
			  	"showSkip" : false,
			    "left": -20,
			    "right": 5,
			    "top": 5,
			    "bottom": 5
			  });

		if ($('[data-name="calendario"]').length > 0)
			enjoyhint_script_steps.push({
			    'next [data-name="calendario"]>a' : 'Calendario <br><br> Con este calendario puedes ver en forma mensual, semanal y diaria <br> los vencimientos de OT.',
			  	"nextButton" : { text: "Siguiente"},
			  	"showSkip" : false,
			    "left": -20,
			    "right": 5,
			    "top": 5,
			    "bottom": 5
			  });

		if ($('[data-name="box"]').length > 0)
			enjoyhint_script_steps.push({
			    'next [data-name="box"]>a' : 'Box',
			  	"nextButton" : { text: "Siguiente"},
			  	"showSkip" : false,
			    "left": -20,
			    "right": 5,
			    "top": 5,
			    "bottom": 5
			  });

		if ($('[data-name="usuarios"]').length > 0)
			enjoyhint_script_steps.push({
			    'next [data-name="usuarios"]>a' : 'Usuarios',
			  	"nextButton" : { text: "Siguiente"},
			  	"showSkip" : false,
			    "left": -20,
			    "right": 5,
			    "top": 5,
			    "bottom": 5
			  });

		if ($('[data-name="reportes"]').length > 0)
			enjoyhint_script_steps.push({
			    'next [data-name="reportes"]>a' : 'Reportes <br><br> Da una mirada a los reportes que con UNABASE puedes obtener',
			  	"nextButton" : { text: "Siguiente"},
			  	"showSkip" : false,
			    "left": -20,
			    "right": 5,
			    "top": 5,
			    "bottom": 5
			  });

		if ($('[data-name="proyectos"]').length > 0)
			enjoyhint_script_steps.push({
			    'next [data-name="proyectos"]>a' : 'Proyectos',
			  	"nextButton" : { text: "Siguiente"},
			  	"showSkip" : false,
			    "left": -20,
			    "right": 5,
			    "top": 5,
			    "bottom": 5
			  });

		if ($('[data-name="ajustes"]').length > 0)
			enjoyhint_script_steps.push({
			    'next [data-name="ajustes"]>a' : 'Ajustes <br><br> Configura los parametros del sistema, permisos de los usuarios y <br> reglas de validación para presupuestos y ordenes de compra',
			  	"nextButton" : { text: "Siguiente"},
			  	"showSkip" : false,
			    "left": -20,
			    "right": 5,
			    "top": 5,
			    "bottom": 5
			  });

	}

	if ($('body.menu > aside > div > div > ul > li[data-name="cotizaciones"]').hasClass('active')) {
		enjoyhint_script_steps.push({
			'click section.summary>a:last-of-type' : 'Para crear una nueva cotización, haz clic aquí',
			'showNext' : false,
			'showSkip' : false
		});

		enjoyhint_script_steps.push({
			'custom_template li[data-name="new_without_template"]>button' : 'Puedes elegir entre crear una cotizaciòn a partir de una plantilla, o comenzar desde cero.',
			'showNext' : false,
			'showSkip' : false
		});

	}

	enjoyhint_script_steps.push({
		'next button.help' : 'Volver a realizar el tours.',
		"nextButton" : { text: "Entendido"},
		"showSkip" : false,
		"left": 5,
		"right": 5,
		"bottom": 5
	});

	enjoyhint_instance.set(enjoyhint_script_steps);
	enjoyhint_instance.run();

};
