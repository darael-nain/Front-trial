var setter = item => (typeof item === 'boolean') ? 'checked' : 'value';
var setterType = type => ( type === 'checkbox') ? 'checked' : 'value';

var ParamMisc = {
	container: $('#misc'),
	menubar: $('#menu ul'),
	init: function() {
		axios('/4DACTION/_V3_getParamMisc').then(res => {
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
			entity: 'ParamMisc',
			buttons: ['save','exit', 'nodeRestart'],
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


let cacheClearUrl = `${base_url}/4Dcacheclear`;
document.getElementById('cacheClearUrl').setAttribute('href',cacheClearUrl);
document.getElementById('cacheClear4d').addEventListener('click', function(){
	fetch(`/4DACTION/_aParamFlushCache`)
	.then((response) => {
		return response;
	})
	.then((response)=>{
		toastr.success('La cache 4d ha sido limpiada')
	})
});

document.getElementById('checkBlockEmails').addEventListener('click', function(){
	fetch(`/4DACTION/_V3_checkBlockMails`)
	.then((response) => {
		return response;
	})
	.then((response)=>{
		toastr.success('Emails desbloqueados')
	})
});
// document.getElementById('nodeRestart').addEventListener('click', function(){
// 	fetch(`${nodeUrl}/restart`)
// 	.then((response) => {
// 		return response;
// 	})
// 	.then((response)=>{
// 		toastr.success('Emails desbloqueados')
// 	})
// });






document.getElementById('updateUf').addEventListener('click', function(){
	unaBase.currency.uf.update();
});