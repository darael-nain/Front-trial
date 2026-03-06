var notifyNv = {
	close({ number, text = null, id = null }) {
		let subject;
		if (Array.isArray(number)) {
			subject = `ha cerrado los negocios Nº${number.join(", ")}`;
		} else {
			subject = `ha cerrado el negocio Nº${params.data().index} ${params.data().text}`;

		}

		unaBase.inbox.send({
			subject,
			into: "viewport",
			href: "/v3/views/negocios/content.shtml?id=" + id,
			tag: "avisos",
			notifyId: 22,
			id
		});
	},
	open({ number, text = null, id = null }) {
		let subject;
		if (Array.isArray(number)) {
			subject = `ha abierto los negocios Nº${number.join(", ")}`;
		} else {
			subject = `ha abierto el negocio Nº${params.data().index} ${params.data().text}`;

		}

		unaBase.inbox.send({
			subject,
			into: "viewport",
			href: "/v3/views/negocios/content.shtml?id=" + id,
			tag: "avisos",
			notifyId: 23,
			id
		});
	},
	closeCompras({ number, text = null, id = null }) {
		let subject;
		if (Array.isArray(number)) {
			subject = `ha cerrado las compras de los negocio Nº${number.join(", ")}`;
		} else {
			subject = `ha cerrado las compras del negocio Nº${params.data().index} ${params.data().text}`;

		}
		
		unaBase.inbox.send({
			subject,
			into: "viewport",
			href: "/v3/views/negocios/content.shtml?id=" + id,
			tag: "avisos",
			notifyId: 20,
			id
		});
	},
	openCompras({ number, text = null, id = null }) {
		let subject;
		if (Array.isArray(number)) {
			subject = `ha abierto las compras de los negocio Nº${number.join(", ")}`;
		} else {
			subject = `ha abierto las compras del negocio Nº${params.data().index} ${params.data().text}`;

		}

		unaBase.inbox.send({
			subject,
			into: "viewport",
			href: "/v3/views/negocios/content.shtml?id=" + id,
			tag: "avisos",
			notifyId: 21,
			id
		});
	}
}