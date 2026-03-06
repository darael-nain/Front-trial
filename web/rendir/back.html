

				// let items = res.rows.filter(line => line.tipo === "ITEM");
				let titles = res.rows.filter(line => line.tipo === "TITULO");
				let items = res.rows;
				console.warn(items);
				let linesCard = document.querySelector("#linesList");
				linesCard.hidden = !res.rows.length;

				// let linesCard = document.querySelector("span.card.lines");
				// let linesCard = document.querySelector("#linesList");

				titles.forEach(title => {
					let titleLine = document.createElement("div");
					titleLine.classList.add("list-group-item","lines", "lineData", "title");
					// titleLine.classList.add("card-header","lines", "lineData", "title");


					titleLine.dataset.id_det_dtc = title.id_det_dtc;
					titleLine.dataset.llave = title.llave_det_dtc;
					titleLine.dataset.llave_det_oc = title.llave_det_oc;
					titleLine.dataset.llave_nv = title.llave_nv;
					titleLine.style.cursor = "pointer";

					titleLine.innerHTML  = `<h6 data-toggle="collapse" data-target=#${title.llave_det_dtc} role="button" aria-controls=${title.llave_det_dtc} aria-expanded="false" data-value=${title.subtotal} >${title.nombre}</h6>
						<div class="card collapse lines" id="${title.llave_det_dtc}"></div>`;
					linesCard.appendChild(titleLine);
					let lineContainer = titleLine.querySelector(".card.collapse.lines");

					let lines = res.rows.filter(line => line.llave_titulo === title.llave_det_dtc);
					lines.forEach(item => {
						// let exento = item.des_imp.toUpperCase() === "EXENTO" && parseInt(item.valor_imp) === 0;
						console.log(item);
						let line = document.createElement("div");
						line.classList.add("list-group-item", "lines", "lineData", "item");
						line.dataset.id_det_dtc = item.id_det_dtc;
						line.dataset.llave = item.llave_det_dtc;
						line.dataset.llave_titulo = item.llave_titulo;
						line.dataset.llave_det_oc = item.llave_det_oc;
						line.dataset.llave_nv = item.llave_nv;
						line.dataset.valor_imp = item.valor_imp;
						// line.innerHTML = `<h6>[Neg.:${item.nro_nv}] ${item.nombre}</h6>
						line.innerHTML = `<h6>${item.nombre}</h6>
						<div class="children_inline numeric currency">
								<input class="form-control form-control-sm w-15 text-right quantity" type="text" placeholder="cantidad" data-value=${item.cantidad} value=${item.cantidad}> x 
								<input class="form-control form-control-sm w-30 text-right precio" type="text" placeholder="precio" data-value=${item.precio} value=${item.precio}> >
								<input disabled readonly class="form-control form-control-sm w-35 text-right subtotal" type="text" placeholder="subtotal" data-value=${item.subtotal} value=${item.subtotal}>
						</div>`;
						line.style.cursor = "pointer";

						lineContainer.appendChild(line);

						line.querySelector(".quantity").addEventListener("change", function(){
							rendir.dtc.updateLine(this, "quantity");
						});
						line.querySelector(".precio").addEventListener("change", function(){
							rendir.dtc.updateLine(this, "precio");
						});
						// line.addEventListener("click", function(){
						// 	this.classList.toggle("selectedLine");
						// 	rendir.lines.selected();
						// });
						rendir.currency.format();
						rendir.currency.format("span.totals");
					});


				});
				rendir.dtc.updateTotal();