




// 	var trr;
// testr.then(res => {
// 	trr = res.default
// });
// console.log("from camelWord");
function camelWord(str)
{
	if(str != null){
 		return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	}else{
		return str;
	}
}


