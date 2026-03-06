var rendir = {
	navigate: {
		init: (newInit) => {
			let last = rendir.local.get("last");
			if (!last || newInit) {
				rendir.local.set({ url: [] }, "last")
			}
		},
		back: () => {
			let last = rendir.local.get("last");
			let url = last.url[last.url.length - 2];
			console.log("url back");
			console.log(url);
			rendir.local.remove("last");
			last.url.pop()
			rendir.local.set(last, "last");
			window.location.href = url;
		},
		current: () => {
			let last = rendir.local.get("last");
			let current = window.location.href;
			current = current.endsWith(";") ? current.substring(0, current.length - 1) : current;
			if (current !== last.url[last.url.length - 1]) {
				last.url.push(current);

			}
			rendir.local.remove("last");
			rendir.local.set(last, "last");

		}
	},
	navbar: {
		bottom: {
			init: container => {
				let bottomNavbar = document.createElement("div");
				bottomNavbar.classList.add("row");
				bottomNavbar.innerHTML = `
					<nav class="navbar fixed-bottom  navbar-light bg-light w-100">
					  <div class="w-100 bottomNav">
						 
					  	
					  </div>
					</nav>`;
				container.appendChild(bottomNavbar);
			},
			add: ({ action, classList, dataset, label = "", callback = null }) => {
				let bottomNavbar = document.querySelector("div.bottomNav");
				// let button = document.createElement("i");
				let button = document.createElement("div");
				button.innerHTML = `
				  	<i class="${classList.join().replace(/,/ig, " ")}"></i><label class="uGreen">${label}</label>`
				// button.innerHTML = button.innerHTML + ( label ? `<label>${label}</label>` : "");
				// classList.forEach(i => button.classList.add(i));
				// button.classList.add(...classList);
				for (let data in dataset) {
					button.dataset[data] = dataset[data];
				}
				bottomNavbar.appendChild(button);
				button.addEventListener("click", action);
				if (callback) {
					setTimeout(() => {
						callback();

					}, 500)
				}
			}
		},
		top: {
			add: ({ action, classList, dataset, callback = null }) => {
				let topNavbar = document.querySelector("nav.topNavbar");
				let button = document.createElement("span");
				button.classList.add("float-right");
				button.innerHTML = `<i class="${classList.join().replace(/,/ig, " ")}"></i>`;
				for (let data in dataset) {
					button.dataset[data] = dataset[data];
				}
				topNavbar.appendChild(button);
				button.addEventListener("click", action);
				if (callback) {
					setTimeout(() => {
						callback();

					}, 500)
				}
			}
		}
	},
	toast: {
		set: (titulo = "Unabase", mensaje, delay = 2000) => {
			let toastElement = document.createElement("div");
			toastElement.id = "toastElement";
			toastElement.innerHTML = `
			<div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
			  <div class="toast-header">
			    <strong class="mr-auto toast_titulo"></strong>
			    <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
			      <span aria-hidden="true">&times;</span>
			    </button>
			  </div>
			  <div class="toast-body toast_mensaje">
			  </div>
			</div>`;
			document.querySelector("body").appendChild(toastElement);
			let toast = document.querySelector(".toast");
			toast.querySelector(".toast_titulo").innerHTML = titulo;
			toast.querySelector(".toast_mensaje").innerHTML = mensaje;


			$('.toast').toast({
				delay
			});
			$('.toast').toast("show");

			setTimeout(() => {
				let toastElement = document.getElementById("toastElement");
				toastElement.parentNode.removeChild(toastElement);
			}, delay + 1000);
		},
		activate: (delay = 2000) => {

			// $('.toast').toast({
			// 	delay
			// });
			// $('.toast').toast("show");

			// setTimeout(() => {
			// 	let toastElement = document.getElementById("toastElement");
			// 	toastElement.parentNode.removeChild(toastElement);
			// }, delay+2000);
		}
	},
	changeControl: {
		init: () => {
			rendir.changeControl.saved = false;
		},
		saved: true
	},
	jsonToQuery: obj => {
		return Object.keys(obj).map(key => key + '=' + obj[key]).join('&');
	},
	currency: {
		format(target = "input") {


			$("body").find(`.numeric.currency ${target}`).number(true, rendir.currency.decimals, rendir.currency.thousands_sep, rendir.currency.decimals_sep);
		},
		unformat: value => {


			const rm = /,/g;

			//return  parseFloat(value.replace(rendir.currency.decimals_sep, "").replace(rendir.currency.thousands_sep, ","));
			return parseFloat(value.replace(rm, "").replace(rendir.currency.thousands_sep, ","));
		},
		decimals: 2,
		decimals_sep: ".",
		thousands_sep: ",",
		code: "CLP",
		update: () => {
			fetch(`/4DACTION/_V3_getCurrencyActive?rendir=true}`)
				.then(resp => resp.json())
				.then(res => {
					// console.log(res);
					

					rendir.currency.decimals = res.decimals;
					rendir.currency.decimals_sep = res.decimals_sep;
					rendir.currency.thousands_sep = res.thousands_sep;
					rendir.currency.code = res.code;
				}).catch(err => {
					window.location.href = "/";
					// console.log(err);
				});
		}
	},
	user: {
		get: () => {
			return rendir.local.get("user");
		},
		set: user => {
			rendir.local.set(user, "user");
		},
		clean: () => {
			rendir.local.remove("user");
		}
	},
	local: {
		set: (data, name) => {
			localStorage.setItem(name, JSON.stringify(data));
		},
		get: name => {
			return JSON.parse(localStorage.getItem(name));
		},
		remove: name => {
			localStorage.removeItem(name);
		}
	},
	session: {
		verify(redirect = false) {
			fetch(`/4DACTION/_V3_verifySession?rendir=true&sid=${rendir.sid()}`)
				.then(resp => resp.json())
				.then(res => {
					rendir.user.clean();
					if (typeof res.usename !== "undefined" || res.username !== null) {
						// rendir.user = res;
						// 
						rendir.user.set(res);
						if (redirect) window.location.href = "/rendir/index.shtml";
					} else {
						window.location.href = "/";
					}
				}).catch(err => {
					window.location.href = "/";
					// console.log(err);
				});
		}
	},
	sid: () => {
		// var name = cname + "=";
		var decodedCookie = decodeURIComponent(document.cookie);
		var ca = decodedCookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			// if (c.indexOf(name) == 0) {
			if (c.match(/UNABASE/g)) {
				return c.substring(c.indexOf("UNABASE"));
			}
		}
		return "";
	},
	doc: () => rendir.local.get("doc"),
	dt: {
		get: () => {
			return new Promise((resolve, reject) => {
				fetch(`/4DACTION/_V3_getTiposDocDeCompras?rendir=true&sid=${rendir.sid()}`)
					.then(resp => resp.json())
					.then(res => {
						resolve(res);
					}).catch(err => {
						reject(err);
						// console.log(err);
					});
			})
		}
	},
	lines: {
		get: id => {
			return new Promise((resolve, reject) => {
				fetch(`/4DACTION/_V3_get_items_compras?rendir=true&sid=${rendir.sid()}&id_oc=${id}`)
					.then(resp => resp.json())
					.then(res => {
						resolve(res);
					}).catch(err => {
						reject(err);
						// console.log(err);
					});
			});

		},
		selected: () => {
			let lines = document.querySelectorAll("div.lines.selectedLine");
			// if(lines.length){
			// 	document.querySelector("button.rendir").hidden = false;
			// }else{
			// 	document.querySelector("button.rendir").hidden = true;

			// }
			return lines.length ? lines : document.querySelectorAll("div.lines.card-body");
		},
		quantity: 0
	},
	date: {
		dash: date => {
			return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
		},
		format: value => {
			return `${value.substring(6, 10)}-${value.substring(3, 5)}-${value.substring(0, 2)}`;
		},
		format1: value => {
			return `${value.substring(8, 10)}-${value.substring(5, 7)}-${value.substring(0, 4)}`;
		}
	},
	dtc: {
		number_validate: element => {
			let dtc = rendir.dtc.doc();
			$.ajax({
				'url': '/4DACTION/_V3_valida_folio_dtc',
				data: {
					"dtc[valida][id]": dtc.id,
					"dtc[valida][tipo_doc]": dtc.id_tipo_doc,
					"dtc[valida][folio]": dtc.folio,
					"dtc[valida][id_prov]": dtc['contacto[id]']
				},
				async: false,
				dataType: 'json',
				success: function (data) {
					if (data.error === "locked") {
						rendir.toast.set("Unabase", `El documento Nro. ${element.value}, ya se encuentra registrado para el mismo proveedor. Ingrese un nuevo número `);
						rendir.toast.activate();
						element.value = "";
					}
				}
			});
		},
		payment: {
			check: id => {
				fetch(`/4DACTION/_V3_checkPagosDtc?id=${id}`)
					.then(res => res.json())
					.then(res => {
						rendir.dtc.payment.has = !res.success;
					})
					.catch(err => {
						console.log(err);
					});
			},
			has: false
		},
		saved: false,
		delete: id => {
			modal.create("deleteDtc");

			modal.set({
				id: "deleteDtc",
				title: "Eliminar documento",
				body: ``,
				footer: `
			        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
			        <button type="button" class="btn white-text uBgRed dtcDelete">Eliminar</button>`,
				script: modal => {
					modal.querySelector(".dtcDelete").addEventListener("click", function () {
						fetch(`/4DACTION/_V3_setDtc?dtc[id]=${id}&delete=true`)
							.then(res => res.json())
							.then(data => {
								if (data.success) {
									window.history.back();
								}
							})
							.catch(err => console.log(err));

					})
				}
			})


		},
		null: id => {
			fetch(`/4DACTION/_V3_setDtc?id=${id}&nullify=true`)
				.then(res => res.json())
				.then(data => {
					if (data.success) {
						window.history.back();
					}

				})
				.catch(err => console.log(err));

			// if(!rendir.dtc.hasPayment()){
			// 	rendir.dtc.null(rendir.dtc.doc().id);	
			// }else{
			// 	rendir.toast("Unabase","El documento tiene pagos asociados !");
			// }
		},
		attachment: {
			upload: () => {

				


				let doc = rendir.dtc.doc();
				let data = new FormData();
				data.append('file', $('input#dtcAttachment').get(0).files[0]);
				data.append('filename', doc.des_tipo_doc + ' ' + doc.folio);
				data.append('index', 'Doc_Tributario_Compra|' + doc.id);


				let attachment_link = document.querySelector(".attachment.link");

				$.ajax({
					url: '/4DACTION/_V3_setUpload',
					type: 'POST',
					contentType: false,
					data: data,
					dataType: 'json',
					processData: false,
					cache: false,
					success: function (data) {
						console.log("data");
						console.log(data);
						rendir.toast.set("Unabase", "Archivo subido con exito ! ");
						document.querySelector(".attachment.btn.link").classList.remove("btn-secondary");
						document.querySelector(".attachment.btn.link").classList.add("uBgGreen");
						attachment_link.querySelector("i").classList.remove("fa-eye-slash");
						attachment_link.querySelector("i").classList.add("fa-eye");

						modal.create("attach");
						modal.set({
							id: "attach",
							title: "Adjunto",
							body: `<img style="-webkit-user-select: none;" src="${window.location.origin}/4DACTION/_V3_getUpload?index=${data.index}">`,
							footer: ``,
							script: modal => {

							}
						});
						attachment_link.addEventListener("click", function (event) {

							$("#attach").modal("show");
						});

					}
				});
			},
			exist: id => {
				return new Promise((resolve, reject) => {
					fetch(`/4DACTION/_V3_checkUploadExist?index=Doc_Tributario_Compra|${id}`)
						.then(res => res.json())
						.then(res => resolve(res))
						.catch(err => reject(err));

				});
			}
		},
		contact: {
			get: () => {
				let proveedor = document.getElementById("proveedor");
				return {
					id: proveedor.dataset.id,
					razon_social: proveedor.dataset.razon_social,
					giro: proveedor.dataset.giro,
					nombre_completo: proveedor.dataset.nombre_completo,
					alias: proveedor.dataset.text,
					rut: proveedor.dataset.rut

				}
			},
		},
		updateItem: (subt, item) => {
			
			item.dataset.subtotal = subt;
			item.dataset.precio = item.querySelector(".precio").dataset.value;
			item.dataset.total = subt;

		},
		updateLine: (target, toUpdate) => {
			

			let quantity = target.parentNode.querySelector(".quantity");
			let subtotal = target.parentNode.querySelector(".subtotal");
			let precio = target.parentNode.querySelector(".precio");
			let current = rendir.currency.unformat(target.value);

			target.parentNode.querySelector(`.${toUpdate}`).dataset.value = current;
			target.parentNode.querySelector(`.${toUpdate}`).value = current;




			let subtotalValue = parseFloat(precio.dataset.value) * parseFloat(quantity.dataset.value);
			subtotal.value = subtotalValue;
			subtotal.dataset.value = subtotalValue;
			rendir.currency.format();

			return subtotalValue;

		},
		updateTotal: () => {

			let montos = rendir.dtc.montos();
			document.querySelector("#total_neto").innerHTML = montos.neto ;
			document.querySelector("#total_neto").dataset.value = montos.neto;
			document.querySelector("#total").innerHTML = montos.total;
			document.querySelector("#total").dataset.value = montos.total;
			document.querySelector("#total_impuesto").dataset.value = montos.iva;
			document.querySelector("#total_impuesto").innerHTML = montos.iva;
			document.querySelector("#total_exento").dataset.value = montos.exento;
			document.querySelector("#total_exento").innerHTML = montos.exento;
			setTimeout(() => {
				rendir.currency.format();
				rendir.currency.format("span.totals");

			}, 500)
		},
		updateTitle: (a, b) => {
			

			let titles = "";
			let titleLines = document.querySelectorAll(".lines.title");
			titleLines.forEach(line => {
				let upTitle = line.dataset.llave;

				if (upTitle = b) {
					line.dataset.precio = a.value;
					line.dataset.sub_total = a.value;

				};


			});

		},
		validate: () => {


			let dtcs = rendir.dtc.doc();
			let valid = true;
			let itemsToCheck = ["contacto[alias]", "contacto[id]", "contacto[nombre_completo]", "contacto[razon_social]", "contacto[rut]", "emisor", "fecha_emision", "fecha_recepcion", "fecha_registro", "id", "id_tipo_doc", "referencia", "version", "des_forma_pago", "id_forma_pago"];
			let values = Object.keys(dtcs).filter(i => {
				if (itemsToCheck.includes(i) && (dtcs[i] === null || dtcs[i] === "")) {
					return i
				}
			});
			console.log(values);
			return values.length <= 0;
		},
		lines: () => {

			// get lines

			let contacto = rendir.dtc.contact.get();
			let itemsData = {
				"contacto[info][alias]": contacto.alias,
				"contacto[info][razon_social]": contacto.razon_social,
				"contacto[info][rut]": contacto.rut,
				"contacto[info][giro]": contacto.giro,
				"contacto[info][id]": contacto.id,
				...rendir.dtc.doc(false),
			}
			let string = JSON.stringify(itemsData);

			let string2 = string.replace(/:/ig, "=").replace(/"/ig, "").replace(/,/ig, "&");
			let finalData = string2.substring(1, string2.length - 1);


			let lines = "";
			let linesDocs = document.querySelectorAll(".lineData.lines");
			linesDocs.forEach(line => {
				// console.log(line);
				

				lines += `dtc[detalle_item][llave_det_oc]=${line.dataset.llave_det_oc}&`
				lines += `dtc[detalle_item][llave_det_dtc]=${line.dataset.llave}&`
				lines += `dtc[detalle_item][id_det_dtc]=${line.dataset.id_det_dtc}&`
				lines += `dtc[detalle_item][llave_nv]=${line.dataset.llave_nv}&`
				lines += `dtc[detalle_item][llave_titulo]=${line.dataset.llave_titulo}&`

				lines += `dtc[detalle_item][subtotal]=${line.dataset.subtotal}&`
				lines += `dtc[detalle_item][precio]=${line.dataset.precio}&`
				lines += `dtc[detalle_item][descuento]=${line.dataset.descuento}&`
				lines += `dtc[detalle_item][cantidad]=${line.dataset.cantidad}&`
				lines += `dtc[detalle_item][nombre]=${line.dataset.nombre}&`

				lines += `dtc[detalle_item][origen][lugar]=${line.dataset.lugar_origen}&`
				lines += `dtc[detalle_item][origen][lugar][des]=${line.dataset.des_lugar_origen}&`
				lines += `dtc[detalle_item][origen]=${line.dataset.origen}&`

				lines += `dtc[detalle_item][idoc]=${line.dataset.id_oc}&`
				lines += `dtc[detalle_item][idnv]=${line.dataset.id_nv}&`

				lines += `dtc[detalle_item][items]=${line.dataset.items}&`
				lines += `dtc[detalle_item][tipo]=${line.dataset.tipo}&`

				lines += `dtc[detalle_item][total]=${line.dataset.total}&`
				lines += `dtc[detalle_item][imp_val]=${document.querySelector(".dt").dataset.impuesto_number}&`
				lines
				// lines += "dtc[detalle_item][tipo]": ITEM
				// lines += "dtc[detalle_item][items]": 5
				// lines += "dtc[detalle_item][idoc]": 93529
				// lines += "dtc[detalle_item][idnv]": 4263
				// lines += "dtc[detalle_item][origen]": PROYECTO
				// lines += "dtc[detalle_item][origen][lugar]": INTERNO
				// lines += "dtc[detalle_item][origen][lugar][des]": ITEM DIRECTO
				// lines += "dtc[detalle_item][id_tipo_producto]": 04
				// lines += "dtc[detalle_item][cod_producto]": 
				// lines += "dtc[detalle_item][id_producto]": 2290
				// lines += "dtc[detalle_item][llave_nv]": CT4263sc20Item2370661031
				// lines += "dtc[detalle_item][id_clasif]": 153
				// lines += "dtc[detalle_item][des_clasif]": 
				// lines += "dtc[detalle_item][llave_titulo]": DTC443266TITULO2
				// lines += "oc[detalle_item][correlativo]": 1
				// lines += "dtc[detalle_item][nombre]": ESTUDIO DE GRABACIÓN
				lines += `dtc[detalle_item][imp][des]= ${document.querySelector(".dt").dataset.impuesto_desc}&`
				lines += `dtc[detalle_item][imp][des]= ${document.querySelector(".dt").dataset.impuesto_desc}&`

				// lines += "dtc[detalle_item][imp][id]": 2
				// lines += "dtc[detalle_item][cantidad]": 1
				// lines += "dtc[detalle_item][precio]": 390000
				// lines += "dtc[detalle_item][subtotal]": 390000
				// lines += "dtc[detalle_item][dscto]": 0
				// lines += "dtc[detalle_item][total]": 390000

				// lines += "dtc[detalle_item][llave_det_oc]": OC93529ITEM5302637735
				// lines += "dtc[detalle_item][llave_det_dtc]": DTC443266ITEM5
				// lines += "dtc[detalle_item][id_det_dtc]": 102144
				// lines += "dtc[detalle_item][tipo]": ITEM
				// lines += "dtc[detalle_item][items]": 5
				// lines += "dtc[detalle_item][idoc]": 93529
				// lines += "dtc[detalle_item][idnv]": 4263
				// lines += "dtc[detalle_item][origen]": PROYECTO
				// lines += "dtc[detalle_item][origen][lugar]": INTERNO
				// lines += "dtc[detalle_item][origen][lugar][des]": ITEM DIRECTO
				// lines += "dtc[detalle_item][id_tipo_producto]": 04
				// lines += "dtc[detalle_item][cod_producto]": 
				// lines += "dtc[detalle_item][id_producto]": 2290
				// lines += "dtc[detalle_item][llave_nv]": CT4263sc20Item2370661031
				// lines += "dtc[detalle_item][id_clasif]": 153
				// lines += "dtc[detalle_item][des_clasif]": 
				// lines += "dtc[detalle_item][llave_titulo]": DTC443266TITULO2
				// lines += "oc[detalle_item][correlativo]": 1
				// lines += "dtc[detalle_item][nombre]": ESTUDIO DE GRABACIÓN





				//lines += `dtc[detalle_item][imp][id]=${document.querySelector(".dt").dataset.impuesto_number}&`
				// lines += "dtc[detalle_item][cantidad]": 1
				// lines += "dtc[detalle_item][precio]": 390000
				// lines += "dtc[detalle_item][subtotal]": 390000
				// lines += "dtc[detalle_item][dscto]": 0
				// lines += "dtc[detalle_item][total]": 390000

			});



			return lines + finalData;
		},
		doc: (contact = true) => {
			let proveedor = rendir.dtc.contact.get();
			let dt = document.getElementById("dt");
			let name = document.getElementById("referencia");
			let number = document.getElementById("number");
			let fecha_emision = document.getElementById("docDate");
			let fecha_recepcion = document.getElementById("fecha_recepcion");
			let fecha_registro = document.getElementById("fecha_registro");
			let total_neto = document.getElementById("total_neto");
			let total = document.getElementById("total");
			let emisor = document.getElementById("emisor");
			let id_forma_pago = document.getElementById("id_forma_pago");
			let des_forma_pago = document.getElementById("des_forma_pago");
			

			let montos = rendir.dtc.montos();
			let data = {
				from: "FXR",
				version: "V3",
				emisor: emisor.value,
				isNc: false,
				id_forma_pago: id_forma_pago.value,
				des_forma_pago: des_forma_pago.value,
				contabilizado: false,
				"montos[sub_total]": montos.sub_total,
				// montos[descuento]: 0
				// montos[exento]: 0
				"montos[neto]": montos.neto,
				"montos[iva]": montos.iva,
				// montos[adicional]: 0,

				"montos[total]": montos.total,
				"liquidacion[liquido]": montos.liquidacion.liquido,
				// montos[total_ajuste]: 0,
				//---------------------
				id: document.querySelector(".container.dtc").dataset.id,
				fecha_emision: rendir.date.format1(fecha_emision.value),
				fecha_recepcion: rendir.date.format1(fecha_registro.value),
				fecha_registro: rendir.date.format1(fecha_recepcion.value),
				folio: number.value,
				referencia: name.value,
				id_tipo_doc: dt.dataset.id,
				des_tipo_doc: dt.dataset.des_tipo_doc,
				des_imp: dt.dataset.impuesto_desc,
				impuesto_number: dt.dataset.impuesto_number,

			}
			let contactData = {};
			if (contact) {
				contactData = {
					"contacto[id]": proveedor.id,
					"contacto[razon_social]": proveedor.razon_social,
					"contacto[giro]": proveedor.giro,
					"contacto[nombre_completo]": proveedor.nombre_completo,
					"contacto[alias]": proveedor.alias,
					"contacto[rut]": proveedor.rut

				}
			}
			return { ...data, ...contactData };
		},
		montos: () => {
			let neto = 0;
			let iva = 0;
			let sub_total = 0;
			let total = 0;
			let exento = 0;
			let liquidacion = {
				liquido: 0
			}
			 

			let impu = document.getElementById('dt');	
			let valor_imp = impu.dataset.impuesto_number;
			if(valor_imp!=null){
			 valor_imp = parseFloat(valor_imp/ 100);
			}else{valor_imp=0;}
			let tipoImp=impu.dataset.tipo_imp;
			let lines = document.querySelectorAll(".lineData.lines.item");
			
			lines.forEach(line => {
				

				let subtotal = parseFloat(line.querySelector(".subtotal").dataset.value);
				if(subtotal==null){subtotal=0;}
				//let valor_imp = parseFloat(line.dataset.valor_imp);
				sub_total += subtotal;
				exento += valor_imp ? 0 : subtotal;
				iva += subtotal * valor_imp;
				

				
				
				liquidacion.liquido += subtotal;
			});
			neto =sub_total;

			if(tipoImp=="RETENCION"){
				total = (neto - iva);
			}else{
				

				total = (neto + iva);
			}
			

			return {
				neto,
				iva,
				sub_total,
				total,
				liquidacion,
				exento
			}
		},
		get: id => {
			return new Promise((resolve, reject) => {
				fetch(`/4DACTION/_V3_get_oc_dtc?rendir=true&sid=${rendir.sid()}&oc[id]=${id}`)
					.then(resp => resp.json())
					.then(res => {
						resolve(res);
					}).catch(err => {
						reject(err);
						// console.log(err);
					});
			});
		},
		getOne: id => {
			return new Promise((resolve, reject) => {
				fetch(`/4DACTION/_V3_proxy_getDtcContent?id=${id}&api=true?rendir=true&sid=${rendir.sid()}`)
					.then(resp => resp.json())
					.then(res => {
						resolve(res);
					}).catch(err => {
						reject(err);
						// console.log(err);
					});
			});

		},
		getLines: id => {
			return new Promise((resolve, reject) => {
				fetch(`/4DACTION/_V3_get_items_dtc?dtc[id]=${id}&rendir=true&sid=${rendir.sid()}`)
					.then(resp => resp.json())
					.then(res => {
						resolve(res);
					}).catch(err => {
						reject(err);
						// console.log(err);
					});
			});



		},
		create: dtc => {
			return new Promise((resolve, reject) => {
				fetch(`/4DACTION/_V3_setDtc?rendir=true&` + rendir.jsonToQuery(dtc))
					.then(res => res.json())
					.then(resp => {
						resolve(resp);
					}).catch(err => {
						reject(err);
					});


			});

		},
		temp: {

		}
	},
	empty: () => {
		// rendir.doc = {}
		rendir.local.remove("doc");
	},
	loading: {
		start: container => {
			// document.querySelector("body").style.cursor = "wait";
			// <div class="spinner-border text-success" role="status">
			//   <span class="sr-only">Loading...</span>
			// </div>
			let loader = document.createElement("div");
			loader.classList.add("spinner-border", "text-success");
			loader.role = "status";
			loader.innerHTML = `<span class="sr-only">Cargando...</span>`;
			container.appendChild(loader);
		},
		stop: container => {
			// document.querySelector("body").style.cursor = "default";
		}
	},
	load: filters => {
		rendir.empty();
		// let today = new Date();
		// let filters = {
		// 	year: data.year || today.getFullYear(),
		// 	month: data.month || today.getMonth()+1,
		// 	pagada: data.pagada || true,
		// 	emitida: data.emitida || true 
		// }
		let pagada = filters.pagada ? `estado_pagada=${filters.pagada}` : "";
		let emitida = filters.emitida ? `estado_emitida=${filters.emitida}` : "";
		console.log("-----filters desde load");
		console.log(filters);
		let created_at = filters.month ? `${filters.year}-${filters.month}` : filters.year;
		return new Promise((resolve, reject) => {
			fetch(`/4DACTION/_V3_getGastosNew?validacion_gasto=true&page=1&results=100&q=${filters.q}&q2=&${emitida}&${pagada}&created_at=${created_at}&tipo_gasto=FXR&sid=${rendir.sid()}&rendir=true`)
				// fetch(`/4DACTION/_V3_getGastosNew?validacion_gasto=true&page=1&results=100&q=${filters.q}&q2=&${emitida}&${pagada}&created_at=${filters.year}-${filters.month<10 ? `0${filters.month}` : filters.month }&tipo_gasto=FXR&sid=${rendir.sid()}&rendir=true`)
				.then(res => res.json())
				.then(resp => {
					resolve(resp);
				}).catch(err => {
					reject(err);
				});


		});

	},
	getOne: (id, container) => {
		rendir.empty();
		return new Promise((resolve, reject) => {
			fetch(`/4DACTION/_V3_proxy_getComprasContent?id=${id}&mobileFxr=true`)
				.then(res => res.json())
				.then(resp => {
					// rendir.doc = resp;
					rendir.local.set(resp, "doc");
					resolve(resp);
				}).catch(err => {
					reject(err);
				});

		});
	},
	get: (container, filters) => {
		console.log("filters-----");
		console.log(filters);
		container.innerHTML = "";
		let today = new Date();
		let filter = {
			year: filters.year || today.getFullYear(),
			month: filters.month || "",
			q: filters.q || "",
			pagada: filters.pagada,
			emitida: filters.emitida
		}
		rendir.load(filter)
			.then(res => {
				let div;
				if (res.rows.length) {
					div = document.createElement("div");
					div.classList.add("list-group", "list-striped");
					res.rows.forEach(row => {
						let line = document.createElement("a");
						line.classList.add("list-group-item", "list-group-item-action", "flex-column", "align-items-start");
						
						line.dataset.id = row.id;
						line.innerHTML = `
				    <div class="d-flex w-100 justify-content-between">
				      <h6 class="mb-1"><b>${row.folio}</b> - ${row.referencia}</h6>
				    </div>
				      <small>Total: ${row.total} - Justificado: ${row.justificado_fxr}</small></br>
				      <small>${row.referencia_neg_clasif}</small>
				  `;
						div.appendChild(line);
						line.addEventListener("click", function () {
							window.location.href = `/rendir/rendicion.shtml?id=${this.dataset.id}`
							// window.open(`/index.shtml?id=${this.dataset.id}`);
							console.log(this.dataset.id);
						});
					});

				} else {
					div = document.createElement("div");
					div.innerHTML = `<li class="center list-group-item list-group-item-danger">No se han encontrado resultados. 
				 VERIFIQUE LOS FILTROS.</li>`;
				}
				container.appendChild(div);
			}).catch(err => {
				console.log(err);
			});
	},
	title: {
		restart: () => {
			document.title = "Rendiciones";
		},
		set: title => {
			document.title = title;
		},
		body: title => {
			document.querySelector(".navbar-brand").innerHTML = title || "Documento";
		}
	}
}