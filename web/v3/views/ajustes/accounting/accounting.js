const select_tipo = $('select[name="tipo_cuenta"]');
const select = $('select[name="tipo"]');


var accounting = {
	container: $("#accounting"),
	menubar: $('#menu ul'),
	init: function (id) {
		$.ajax({
			url: '/4DACTION/_light_getTipoCuentaContable',
			dataType: 'json',
			async: false,
			success: function (data) {
				let sel = `<option value="" selected>Seleccione</option>`
				data.rows.forEach(item => {
					sel += `<option value="${item.name}">${item.name}</option>`
				});
				select_tipo.append(sel);

			}
		});
		$.ajax({
			url: '/4DACTION/_V3_get_tiposCuentaContable',
			dataType: 'json',
			async: false,
			success: function (data) {
				let sel = `<option value="" selected>Seleccione</option>`
				data.rows.forEach(item => {
					sel += `<option data-id="${item.id}" value="${item.name}">${item.name}</option>`
				});
				select.append(sel);

			}
		});



		


		$.ajax({
			'url': '/4DACTION/_V3_proxy_getAccounting',
			data: {
				"id": id
			},
			dataType: 'json',
			async: false,
			success: function (data) {
				accounting.data = data;
				// reportes.data.creado = data.creado;
			}
		});

		accounting.id = accounting.data.id;
		
		document.querySelector('section#accounting').dataset.id = accounting.data.id;
		document.querySelector('input[name="name"]').value = accounting.data.name;
		document.querySelector('select[name="nivel"]').value = accounting.data.nivel;
		document.querySelector('input[name="number"]').value = accounting.data.number;

		document.querySelector('select[name="tipo"]').value = accounting.data.type
		document.querySelector('select[name="tipo_cuenta"]').value = accounting.data.type_account

	},
	menu: function () {
		unaBase.toolbox.init();
		unaBase.toolbox.menu.init({
			entity: 'Accounting',
			buttons: ['save', 'exit'],
			data: function () {

				accounting.data.id = document.querySelector('section#accounting').dataset.id;
				accounting.data.name = document.querySelector('input[name="name"]').value;
				accounting.data.number = document.querySelector('input[name="number"]').value;
				accounting.data.type = document.querySelector('select[name="tipo_cuenta"]').value;
				let e = document.querySelector('select[name="tipo"]');
				accounting.data.id_tipo_cuenta = e.options[e.selectedIndex].dataset.id;
				accounting.data.nivel = document.querySelector('select[name="nivel"]').value;


				return accounting.data;
			},
			validate: function () {
				return true;
			}
		});
	}
}