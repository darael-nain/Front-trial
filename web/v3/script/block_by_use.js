
var block_by_use = function(cotizacion){
	try{
		// $.ajax({
		// 	url: '/4DACTION/_V3_block_by_use',
		// 	data: {
		// 		id: cotizacion.id,
		// 		module: cotizacion.module,
		// 		block: cotizacion.block
		// 	},
		// 	dataType: 'jsonp',
		// 	async: false,
		// 	success: function(data) {
		// 		console.log("success block in database");
		// 	}
		// });
		// if(!uVar.unableSocket){
		// 	if(cotizacion.module == "cotizaciones"){
		// 		socketNew.emit('sendblockAdd', cotizacion);
		// 	}else if(cotizacion.module == "negocios"){
		// 		socketNew.emit('sendblockAddNg', cotizacion);
		// 	}
			
		// }

	}catch(err){
		console.warn(err);
		console.warn('socket no disponible, block_by_use no disponible');
	}
	
}