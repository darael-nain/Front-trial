var currency = {
	update: () => {
		let current = currency[currency.code.toLowerCase()];
		let today = new Date()
		for(let i in current){
			if(dateString(today).txtDate != current[i].lastUpdate){
				if(current[i].update) current[i].update();
			}
		}
	},
	clp: {
		uf: {
			local: 0,
			lastUpdate: null,
			api: {
				
			    url: 'https://api.sbif.cl/api-sbifv3/recursos_api/uf?apikey=ce567cb4db4d6a3daf4b560d142519f584525d2d&formato=json',
			    provider: 'Superintendencia de Bancos e Instituciones Financieras de Chile ',
			    urlProvidor: 'sbif.cl'
				
			},
			update: () => {		
				console.warn("actualizando uf from clp");
		        $.ajax({
		          url: currency.clp.uf.api.url,
		          dataType: "json",
		          success: data => {
		            let value = separatorTransform(data["UFs"][0]["Valor"]);
		            let valueText = data["UFs"][0]["Valor"].replace(".", "");
		            console.log(valueText);
		            console.log(value);

		            $.ajax({
		              url: "/4DACTION/_V3_setCurrency?uf=" + valueText,
		              dataType: "json",
		              success: data => {
		                toastr.success(`Valor uf actualizado a ${valueText}`);
		                console.log(data.success);
		              }
		            });
		          }
		        });
			}
		},
		usd: {
			lastUpdate: null,
			local: 0,
			api: {
				
			    url: 'https://api.sbif.cl/api-sbifv3/recursos_api/dolar?apikey=ce567cb4db4d6a3daf4b560d142519f584525d2d&formato=json',
			    provider: 'Superintendencia de Bancos e Instituciones Financieras de Chile ',
			    urlProvidor: 'sbif.cl'
				
			},
			update: () => {
				console.warn("actualizando usd from clp");
		        $.ajax({
		          url: currency.clp.usd.api.url,
		          dataType: "json",
		          success: data => {
		          	
		            let value = separatorTransform(data["UFs"][0]["Valor"]);
		            let valueText = data["UFs"][0]["Valor"].replace(".", "");
		            console.log(valueText);
		            console.log(value);

		            $.ajax({
		              url: "/4DACTION/_V3_setCurrency?uf=" + valueText,
		              dataType: "json",
		              success: data => {
		                toastr.success(`Valor uf actualizado a ${valueText}`);
		                console.log(data.success);
		              }
		            });
		          }
		        });

			}
		},
		code: "clp",
		name: "peso chileno",
		symbol: "$",
		decimals: 2,
		thousands_sep: ".",
		decimals_sep: ","
	},
	ars: {
		clp: {
			local: 0,
			lastUpdate: null,
			update: () => {
				
			}
		},
		usd: {
			lastUpdate: null,
			local: 0,
			update: () => {
				
			}
		}

	},
	pen: {
		clp: {
			local: 0,
			lastUpdate: null,
			update: () => {
				console.warn("actualizando clp from pen");
				
			}
		},
		usd: {
			lastUpdate: null,
			local: 0,
			update: () => {
				console.warn("actualizando usd from pen");
				
			}
		},
		code: "pen",
		name: "Nuevo sol peruano",
		symbol: "$",
		decimals: 2,
		thousands_sep: ",",
		decimals_sep: "."

	},
	uyu: {
		clp: {
			local: 0,
			lastUpdate: null,
			update: () => {
				
			}
		},
		usd: {
			lastUpdate: null,
			local: 0,
			update: () => {
				
			}
		}

	},
	usd: {

		code: "usd",
		name: "Dolar estadounidense",
		symbol: "$",
		decimals: 2,
		thousands_sep: ",",
		decimals_sep: "."
	}
}