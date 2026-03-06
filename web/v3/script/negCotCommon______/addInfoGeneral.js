function addInfo(container, doc){
			container.innerHTML = `
				<article>
					<h1>Información general</h1>
					<h2><span class="index2">
					${doc.number == 0 ? "Borrador" : doc.number == 1 ? "Plantilla" : "Nº "+doc.number}
				

					</span> <strong>${doc.budgetTag}</strong> 
					<span class="titulofinal">${doc.ref}</span></h2>
					<p>${doc.state} - Creado por ${doc.emisor} el ${doc.fecha} a las ${doc.hora}
					${doc.comprasClosed ? `<span class="ui-icon ui-icon-locked" style="display: inline-block; vertical-align: bottom; margin-bottom: -2px;"></span>Cerrado para compras` : "" }
					
				</article>`
}
