var setter = item => (typeof item === 'boolean') ? 'checked' : 'value';
var setterType = type => ( type === 'checkbox') ? 'checked' : 'value';

var negocioParam = {
	container: $('#negocio'),
	menubar: $('#menu ul'),
	init: function() {
		axios('/4DACTION/_V3_getParamNegocio').then(res => {
			// const data = res.data;
			// for(const key in data){

			// 	const item = data[key];
			// 	// const setter = (typeof item === 'boolean') ? 'checked' : 'value';
			// 	document.querySelector(`.item[name="${key}"]`)[setter(item)] = item;
			// }


	  		res.data.text = 'text'
	  		res.data.id = 'id'
	  		res.data.docs = 'rows'
	  		setterHtml(res.data, 'tipoDtc', 'id');


		}).catch(err => {
			console.error(err);
		})
	},
	menu: function(){
		unaBase.toolbox.init();
		unaBase.toolbox.menu.init({
			entity: 'ParamNegocio',
			buttons: ['save','exit'],
			data: function(){
				const data = {}
				let items = document.querySelectorAll('.item');
				for(let item of items){
					console.log(item);
					console.log(setterType(item.type));
					data[item.name] = item[setterType(item.type)]
				}
				console.warn(data);
				return data;

			},
			validate: () => true
		});
	}
}