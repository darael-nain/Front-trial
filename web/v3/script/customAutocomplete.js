$(document).ready(function () {
	const inputs = document.querySelectorAll('.new-search');

	const normalizarTexto = texto => texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

	const filtrarOpciones = (input, listaOpciones) => {
		const textoBusqueda = normalizarTexto(input.value);
		listaOpciones.forEach(opcion => {
			const textoOpcion = normalizarTexto(opcion.textContent);
			opcion.style.display = textoOpcion.includes(textoBusqueda) ? "" : "none";
		});
	};

	const setContactoEmpresa = (e, item) => {
		updateHeader("empresa", { alias: item.text || "", });
		updateHeader("empresa", { razon: item.razon_social || "", });
		e = e.target
		const target = e.closest('ul');
		const input = e
		// target.querySelector('button.unlock.empresa').style.display = 'block';
		// target.querySelector('button.profile.empresa').style.display = 'block';
		//target.querySelector('button.edit.empresa').style.display = 'none';
		
		input.value = item.text != '' ? item.text : 'Sin Alias';
		input.dataset.id = item.id;

		target.querySelector('input[name="cotizacion[empresa][razon_social]"]').value = item.razon_social;
		target.querySelector('input[name="cotizacion[empresa][rut]"]').value = unaBase.data.rut.format(item.rut)
		// target.querySelector('input[name="cotizacion[empresa][giro]"]').value = item.giro;
		// target.querySelector('input[name="cotizacion[empresa][direccion]"]').value = item.direccion;
		// target.querySelector('input[name="cotizacion[empresa][telefonos]"]').value = item.telefonos;

		target.querySelector('input[name="cotizacion[condiciones][forma_pago]"]').dataset.id = item.id_forma_default;
		target.querySelector('input[name="cotizacion[condiciones][forma_pago]"]').value = item.des_forma_default;

		document.querySelector('h2 [name="cotizacion[empresa][id]"]').textContent = item.text;
		document.querySelector('h2 [name="cotizacion[empresa][razon_social]"]').textContent = item.razon_social;

		
		$.ajax({
			url: '/4DACTION/_V3_' + 'getContactoByEmpresa',
			dataType: 'json',
			async: false,
			data: {
				id: item.id,
				default: true,
				strict: true
			},
			success: function (data) {
				var target = document.querySelector('.input-contact').closest('ul');
				const inputContact = document.querySelector('.input-contact')

				inputContact.dataset.id = 0; // ID 0 desvincula
				inputContact.value = '';
				target.querySelector('input[name="cotizacion[empresa][contacto][cargo]"]').value = '';
				target.querySelector('input[name="cotizacion[empresa][contacto][email]"]').value = '';

				document.querySelector('h2 [name="cotizacion[empresa][contacto][id]"]').textContent = '';

				data.rows.forEach(item => {

					inputContact.dataset.id = item.id;
					inputContact.value = item.nombre_completo;
					target.querySelector('input[name="cotizacion[empresa][contacto][cargo]"]').value = item.cargo;
					target.querySelector('input[name="cotizacion[empresa][contacto][email]"]').value = item.email;

					document.querySelector('h2 [name="cotizacion[empresa][contacto][id]"]').textContent = item.nombre_completo;
				});

				// target.querySelector('button.unlock.contacto').style.display = 'block';
				// target.querySelector('button.profile.contacto').style.display = 'block';
				// target.querySelector('button.show.contacto').style.display = 'block';
				// target.querySelector('button.edit.contacto').style.display = 'none';
			}
		});
	}

	const setContacto = (e, item) => {
		e = e.target
		const target = e.closest('ul');
		
		e.value = item.text != '' ? item.text : 'Sin alias';
		e.dataset.id = item.id;
		target.querySelector('input[name="cotizacion[empresa][contacto][cargo]"]').value = item.cargo;
		target.querySelector('input[name="cotizacion[empresa][contacto][email]"]').value = item.email;
		updateHeader("empresa", { para: item.text || item.nombre_completo || item.nombre || "" });

	}

	const setContactoByEmpresa = (e, input) => {
		var fields = {
			fk: document.querySelector('.input-empresa').dataset.id
		};
		
		document.querySelectorAll('input[name^="cotizacion[empresa][contacto]"]').forEach(function (input) {
			var name = input.name;
			var value = input.value;
			var tuple = {};

			if (input.dataset.id) {
				tuple['id'] = input.dataset.id;
				Object.assign(fields, tuple);
			}

			tuple[name] = value;
			Object.assign(fields, tuple);
		});

		fields.id = input.dataset.id;
		fields['cotizacion[empresa][contacto][id]'] = input.value;
		
		$.ajax({
			url: '/4DACTION/_V3_setContactoByEmpresa',
			dataType: 'json',
			data: fields,
			async: false,
			success: function (data) {
				
				if (data.success) {
					input.dataset.id = data.id;
					document.querySelector('h2 [name="cotizacion[empresa][contacto][id]"]').textContent = input.value
					toastr.success('Contacto guardado!')
					//afterEditContacto(element);
				} else {
					if (data.opened) {
						if (data.readonly)
							toastr.error('No fue posible guardar los datos del contacto. Otro usuario está bloqueando el registro.');
					} else {
						if (!data.unique)
							toastr.error('El contacto que intenta ingresar ya se almacenó previamente en la base de datos.');
						else
							toastr.error('El id del contacto no existe (error desconocido).');
					}
				}
			},
			error: function (xhr, text, error) {
				toastr.error('Falló conexión al servidor.');
			}
		});

	}

	const cargarOpciones = async (input, endpoint, icon, e, saveButton) => {

		let formData = new FormData();
		formData.append('id', document.querySelector('.sheet').dataset.id);
		formData.append('q', input.value.substring(0, input.value.length - 1));
		formData.append('sid', unaBase.sid.encoded());

		let config = {
			method: 'post',
			url: `https://${window.location.host}/4DACTION/${endpoint}`,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'multipart/form-data'
			},
			data: formData
		};

		try {
			let res = await axios(config);
			// Manejar la respuesta exitosa



			const results = input.nextElementSibling.nextElementSibling.nextElementSibling; // El contenedor de resultados
			results.innerHTML = ''; // Limpiar resultados anteriores

			if (res.data.rows.length > 0) {
				res.data.rows.forEach(item => {
					const result = document.createElement('div');
					result.classList.add('buscador-result');
					result.classList.add('search-option');

					const textSpan = document.createElement('span');
					textSpan.textContent = item.text != '' ? item.text : item.nombre_completo; 
					result.appendChild(textSpan);

					const rutSpan = document.createElement('span');
					rutSpan.textContent = item.rut; 
					rutSpan.classList = 'idNumber-span'
					result.appendChild(rutSpan);

					result.addEventListener('click', function () {
						
						console.log('SELECCIONASTE ALGO')
						input.opcionSeleccionada = true;
						input.setAttribute('data-sel', 'true');
						results.classList.remove('active');
						icon.classList.remove('rotated');
						saveButton.style.display = 'none'
						if (input.classList.contains('input-empresa')) {
							setContactoEmpresa(e, item);
						}

						if (input.classList.contains('input-contact')) {
							setContacto(e, item);
						}
					});

					results.appendChild(result);
				});

			} else {
				// Agregar opción para crear nuevo elemento
				if (input.value.trim() !== '') {
					const agregarNuevo = document.createElement('div');
					agregarNuevo.className = 'buscador-result agregar-nuevo';
					agregarNuevo.textContent = `Agregar "${input.value}"`;
					agregarNuevo.addEventListener('mousedown', function (ev) {
					ev.preventDefault();
					ev.stopPropagation();

					input.opcionSeleccionada = false;
					input.setAttribute('data-save', 'false');

					results.classList.remove('active');
					icon.classList.remove('rotated');

					// Fuerza blur
					input.blur();
					});

					// Se desactiva para evitar doble popup de Blur (en el caso negocios)
					/*
					agregarNuevo.addEventListener('click', function () {
						// Lógica para agregar nuevo elemento
						confirm('El cliente "' + input.value + '" no está registrado.' + "\n\n" + '¿Desea crearlo?').done(function (data) {
							if (data) {
								let path_input = ''
								if (input.classList.contains('input-empresa')) {
									input.removeAttribute("data-id");
									path_input = 'input[name="cotizacion[empresa][razon_social]"]'
								} else if (input.classList.contains('input-contact')) {
									path_input = 'input[name="cotizacion[empresa][contacto][email]"]'
								}

								const razon = document.querySelector(path_input)
								razon.value = ''
								razon.readOnly = false
								setTimeout(function () {
									var input = document.querySelector(path_input);
									input.focus();
								}, 100); // Ajusta el tiempo según sea necesario

							}
						});
						results.classList.remove('active');
						icon.classList.remove('rotated');
					});
					*/
					results.appendChild(agregarNuevo);
				}
			}

			results.classList.add('active');
		} catch (err) {
			throw err;
		}
	};


	document.querySelector('.btn-editar-empresa').addEventListener('click', function () {
		let path_input = 'input[name="cotizacion[empresa][razon_social]"]';
		const razon = document.querySelector(path_input);
		
		razon.readOnly = false;
		
		setTimeout(function () {
			var input = document.querySelector(path_input);
			input.focus();
			
			if (input.value) {
				input.select();
			}
		}, 100); 
	});
	


	document.querySelector('button.btn-profile').addEventListener('click', function () {
		const id = document.querySelector('.input-empresa').dataset.id
		unaBase.loadInto.dialog('/v3/views/contactos/content.shtml?id=?id=' + id, 'Perfil de Empresa', 'large');
	});

	document.querySelector('button.btn-profile-contact').addEventListener('click', function () {
		const id = document.querySelector('.input-contact').dataset.id
		unaBase.loadInto.dialog('/v3/views/contactos/content.shtml?id=?id=' + id, 'Perfil de Empresa', 'large');
	});


	document.querySelector('.btn-editar-contacto').addEventListener('click', function () {
		let path_input = 'input[name="cotizacion[empresa][contacto][email]"]';
		let path_input2 = 'input[name="cotizacion[empresa][contacto][cargo]"]';
		
		const email = document.querySelector(path_input);
		const cargo = document.querySelector(path_input2);
		
		email.readOnly = false;
		cargo.readOnly = false;
		
		setTimeout(function () {
			var inputEmail = document.querySelector(path_input);
			var inputCargo = document.querySelector(path_input2);
			
			inputEmail.focus();
			if (inputEmail.value) {
				inputEmail.select();
			}
			
			inputCargo.focus();
			if (inputCargo.value) {
				inputCargo.select();
			}
		}, 100); 
	});
	


	inputs.forEach(input => {

		input.opcionSeleccionada = input.value.trim() !== '';

		if (input.value.trim() !== '') {
			input.setAttribute('data-save', 'true');
		}

		const wrapper = document.createElement('div');
		wrapper.className = 'buscador-wrapper';

		const results = document.createElement('div');
		results.className = 'buscador-results';

		results.addEventListener('click', function (event) {
			opcionSeleccionada = true;
		});

		const icon = document.createElement('div');
		icon.className = 'custom-select-icon';
		icon.innerHTML = '<i class="fa-solid fa-angle-down"></i>';

		const saveButton = document.createElement('button');
		saveButton.textContent = 'Guardar';
		saveButton.type = 'button';
		saveButton.classList.add('save-button', 'save-empresa');
		saveButton.style.display = 'none'


		input.parentNode.insertBefore(wrapper, input);
		wrapper.appendChild(input);
		wrapper.appendChild(saveButton);
		wrapper.appendChild(icon);
		wrapper.appendChild(results);

		// .save-button {
		// 	margin-left: auto; /* Empujar el botón hacia la derecha */
		// 	padding: 2px 4px; /* Ajustar el padding según sea necesario */
		// 	border: 1px solid #3AC7A5;
		// 	border-radius: 5px;
		// 	font-size: 10px;
		// 	margin-right: 18px;
		// }

		icon.addEventListener('click', function (e) {
			// Determinar el endpoint según la clase del input
			let endpoint = ''
			if (input.classList.contains('input-empresa')) {
				endpoint = '_V3_getEmpresa'
			} else if (input.classList.contains('input-contact')) {
				endpoint = '_V3_getContactoByEmpresa'
			}
			cargarOpciones(input, endpoint, icon, e, saveButton);
			results.classList.toggle('active');
			icon.classList.toggle('rotated');
		});



		document.addEventListener('click', function (event) {
			if (!wrapper.contains(event.target)) {
				results.classList.remove('active');
				icon.classList.remove('rotated');

			}
		});

		input.addEventListener('blur', function () {
			setTimeout(() => {
				
				
				if (!this.opcionSeleccionada && this.getAttribute('data-save') !== 'true' && input.value != '') {
					console.log('No se seleccionó ninguna opción');
					// Lógica para agregar nuevo elemento
					confirm('El cliente "' + input.value + '" no está registrado.' + "\n\n" + '¿Desea crearlo?').done(function (data) {
						if (data) {
							let path_input = '';
							let classToRemove = '';
						
							if (input.classList.contains('input-empresa')) {
								input.removeAttribute('data-id');
								path_input = 'input[name="cotizacion[empresa][razon_social]"]';
								classToRemove = '.input-empresa';
								document.querySelector('strong[name="cotizacion[empresa][id]"]').textContent = input.value;
							} else if (input.classList.contains('input-contact')) {
								path_input = 'input[name="cotizacion[empresa][contacto][email]"]';
								document.querySelector('span[name="cotizacion[empresa][contacto][id]"]').textContent = input.value;
								classToRemove = '.input-contact';
							}
						
							const clearAndRemoveDataId = (selector) => {
								const element = document.querySelector(selector);
								if (element) {
									element.value = '';
									//element.removeAttribute('data-id');
								}
							};
						

							clearAndRemoveDataId('input[name="cotizacion[empresa][contacto][cargo]"]');
							clearAndRemoveDataId('input[name="cotizacion[empresa][contacto][email]"]');

							
							document.querySelector('span[name="cotizacion[empresa][razon_social]"]').textContent = ''
						
							const razon = document.querySelector(path_input);
							if (razon) {
								razon.value = '';
								razon.readOnly = false;
								setTimeout(() => {
									razon.focus();
								}, 100); // Ajusta el tiempo según sea necesario
							}
						} else {
							clearAmbosClientes();
						}
						
					});
					results.classList.remove('active');
					icon.classList.remove('rotated');
				}


			}, 300); // Ajusta el tiempo de espera según sea necesario
		});



		saveButton.addEventListener('click', function (e) {
			// Lógica para guardar
			
			if (input.classList.contains('input-empresa')) {
				if (document.querySelector('input[name="cotizacion[empresa][razon_social]"]').value == '') {
					toastr.warning('Debes indicar la razon social')
					return
				}

				var element = e.target;
				var fields = {};
				var validate = true

				document.querySelectorAll('input[name^="cotizacion[empresa]"]').forEach(function (input) {
					if (!input.name.startsWith('cotizacion[empresa][contacto]')) {
						var name = input.name;
						var value;
						if (name === 'cotizacion[empresa][rut][validate]') {
							value = input.checked;
						} else {
							value = input.value;
						}
						var localValidate = true;

						if (name === 'cotizacion[empresa][rut]') {
							if (document.querySelector('input[name="cotizacion[empresa][rut][validate]"]').checked && !unaBase.data.rut.validate(value)) {
								localValidate = false;
							}
						}

						if (!localValidate) {
							input.classList.add('invalid');
						}

						if (input.dataset.id) {
							var tuple = { id: input.dataset.id };
							Object.assign(fields, tuple);
						}

						var tuple = {};
						tuple[name] = value;
						Object.assign(fields, tuple);

						validate = validate && localValidate;
					}
				});
				
				if (validate) {
					fields.nvType = unaBase.doc.type;
					fields.nvId = unaBase.doc.number;
					fields.id = input.dataset.id;
					fields['cotizacion[empresa][id]'] = input.value;
					$.ajax({
						url: '/4DACTION/_V3_setEmpresa',
						dataType: 'json',
						data: fields,
						async: false,
						success: function (data) {

							if (data.success) {
								input.dataset.id = data.id;
								document.querySelector('h2 [name="cotizacion[empresa][id]"]').textContent = input.value;
								document.querySelector('h2 [name="cotizacion[empresa][razon_social]"]').textContent = fields['cotizacion[empresa][razon_social]'];

								//document.querySelector('input[name="cotizacion[empresa][razon_social]"]').setAttribute('readonly', true);
								toastr.success('Cliente guardado exitosamente!')
							} else {
								if (data.opened) {
									if (data.readonly)
										toastr.error('No fue posible guardar los datos de la empresa. Otro usuario está bloqueando el registro.');
								} else {
									if (!data.unique)
										toastr.error('La empresa que intenta ingresar ya se almacenó previamente en la base de datos.');
									else
										toastr.error('El id de la empresa no existe (error desconocido).');
								}
							}
						},
						error: function (xhr, text, error) {
							toastr.error('Falló conexión al servidor.');
						}
					});
				} else {
					toastr.error('Hay datos faltantes o incorrecto. Complete y verifique los datos faltantes e intente nuevamente.');
				}
			}

			if (input.classList.contains('input-contact')) {
				setContactoByEmpresa(e, input)
			}

			input.opcionSeleccionada = true;
			input.setAttribute('data-save', 'true');
		});

		input.addEventListener('input', function (e) {
			if (e.value == '') {
				this.opcionSeleccionada = true
			}

			if (e.value != '') {
				this.setAttribute('data-save', 'false');
				saveButton.style.display = 'block'
				this.opcionSeleccionada = false
			}
			// Determinar el endpoint según la clase del input

			let endpoint = ''
			if (input.classList.contains('input-empresa')) {
				endpoint = '_V3_getEmpresa'
			} else if (input.classList.contains('input-contact')) {
				endpoint = '_V3_getContactoByEmpresa'
			}
			cargarOpciones(input, endpoint, icon, e, saveButton);

			// Filtrar resultados basados en la entrada del usuario
			const listaOpciones = Array.from(results.children);
			filtrarOpciones(input, listaOpciones);
			if (listaOpciones.some(opcion => opcion.style.display === '')) {
				results.classList.add('active');
				icon.classList.add('rotated');
			} else {
				results.classList.remove('active');
				icon.classList.remove('rotated');
			}
		});

	});

	// Actualiza el header con Cliente (Alias), Razon Social y Para (destinatario)
	function updateHeader(prefix, { alias, razon, para } = {}) {
		console.log(razon);
		const hAlias = document.querySelector(`strong[name="cotizacion[${prefix}][id]"]`);
		const hRazon = document.querySelector(`span[name="cotizacion[${prefix}][razon_social]"]`);
		const hPara = document.querySelector(`span[name="cotizacion[${prefix}][contacto][id]"]`);

		if (hAlias && alias !== undefined) hAlias.textContent = alias || "";
		if (hRazon && razon !== undefined) hRazon.textContent = razon || "";
		if (hPara && para !== undefined) hPara.textContent = para || "";
	}


	// Limpia el cliente que hay en negocios cuando no se crea un nuevo contacto
	function clearClienteYContacto(prefix) {

		// Cliente (Alias)
		const inpAlias =
			document.querySelector(`input[name="cotizacion[${prefix}][id]"]`) ||
			(prefix === "empresa" ? document.querySelector(".input-empresa") : null);

		if (inpAlias) {
			inpAlias.value = "";
			inpAlias.removeAttribute("data-id");
			inpAlias.dataset.id = "";
			inpAlias.opcionSeleccionada = true;
			inpAlias.setAttribute("data-save", "false");
			inpAlias.setAttribute("data-sel", "false");
		}

		const inpRazon = document.querySelector(`input[name="cotizacion[${prefix}][razon_social]"]`);
		if (inpRazon) inpRazon.value = "";

		const inpRut = document.querySelector(`input[name="cotizacion[${prefix}][rut]"]`);
		if (inpRut) inpRut.value = "";

		// Para (Destinatario)
		const inpContacto =
			document.querySelector(`input[name="cotizacion[${prefix}][contacto][id]"]`) ||
			(prefix === "empresa" ? (document.querySelector(".input-contact") || document.querySelector("#contacto")) : null);

		if (inpContacto) {
			inpContacto.value = "";
			inpContacto.removeAttribute("data-id");
			inpContacto.dataset.id = "";
			inpContacto.opcionSeleccionada = true;
			inpContacto.setAttribute("data-save", "false");
			inpContacto.setAttribute("data-sel", "false");
		}

		const inpCargo = document.querySelector(
			prefix === "empresa"
				? `input[name="cotizacion[empresa][contacto][cargo]"]`
				: `input[name="cotizacion[empresa][contacto2][cargo]"]`
		);
		if (inpCargo) inpCargo.value = "";

		const inpEmail = document.querySelector(
			prefix === "empresa"
				? `input[name="cotizacion[empresa][contacto][email]"]`
				: `input[name="cotizacion[empresa][contacto2][email]"]`
		);
		if (inpEmail) inpEmail.value = "";


		// Header
		const hAlias = document.querySelector(`strong[name="cotizacion[${prefix}][id]"]`);
		if (hAlias) hAlias.textContent = "";

		const hRazon = document.querySelector(`span[name="cotizacion[${prefix}][razon_social]"]`);
		if (hRazon) hRazon.textContent = "";

		const hContacto = document.querySelector(`span[name="cotizacion[${prefix}][contacto][id]"]`);
		if (hContacto) hContacto.textContent = "";
	}

	function clearAmbosClientes() {
		clearClienteYContacto("empresa");
		clearClienteYContacto("empresa2");
	}




});
