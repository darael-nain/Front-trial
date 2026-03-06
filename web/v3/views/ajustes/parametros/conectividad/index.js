var setter = item => (typeof item === 'boolean') ? 'checked' : 'value';
var setterType = type => ( type === 'checkbox') ? 'checked' : 'value';

var ParamConnect = {
	container: $('#connect'),
	menubar: $('#menu ul'),
	init: function() {
		axios('/4DACTION/_V3_getParamConnect').then(res => {
			const data = res.data;
			for(const key in data){

				const item = data[key];
				// const setter = (typeof item === 'boolean') ? 'checked' : 'value';
				document.querySelector(`.item[name="${key}"]`)[setter(item)] = item;
			}
		}).catch(err => {
			console.error(err);
		})
	},
	menu: function(){
		unaBase.toolbox.init();
		unaBase.toolbox.menu.init({
			entity: 'ParamConnect',
			buttons: ['save','exit', 'nodeRestart', 'nodeStart'],
			buttonAccess: {
				nodeStart: '_650'
			},
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


