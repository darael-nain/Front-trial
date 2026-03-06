// Array.prototype.unique = function(){	
// 	let arr = this;
// 	let unique_array = arr.filter(function(elem, index, self) {
// 		return index == arr.indexOf(elem);
// 	});
// 	return unique_array
// }
const filterArrayByObjProp = (arr, property) => {
    return Object.values(arr.reduce((acc,cur)=>Object.assign(acc,{[cur[property]]:cur}),{}))
}
const arrUnique = arr => {
    let unique_array = arr.filter(function(elem, index, self) {
        return index == arr.indexOf(elem);
    });
    return unique_array
}
String.prototype.camelWord = function(str){	
	if(str !== null){
		return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	}else{
		return this;
	}
}
String.prototype.getInicials = function(separator){	
	let str = this;
	if(separator != ""){
		str = str.replace(separator,' ');
	}	
	inicials = str[0] + str[str.indexOf(" ")+1];
	return 	inicials;
}
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function isEquivalent(a, b) {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];

        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
            return false;
        }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
}

let dateString = time => {
    let r = {}
    r.day = time.getDate()
    r.month = time.getMonth()+1
    r.year = time.getFullYear()
    r.hour = time.getHours()
    r.min = time.getMinutes()
    if(r.day < 10) r.day = '0'+r.day;
    if(r.month < 10) r.month = '0'+r.month;
    if(r.min < 10) r.min = '0'+r.min;
    return {
        txt: `${r.day}-${r.month}-${r.year} a las ${r.hour}:${r.min}`,
        txtDate: `${r.day}-${r.month}-${r.year}`,
        txtDate1: `${r.day}/${r.month}/${r.year}`
    }



}

function nodeRestart(notify = false, initialize = false){
    
    axios(`${nodeUrl}/isAlive`, {
        timeout: 3000
    }).then(res => {
      
        console.warn(res.data);

    }).catch(err => {
        axios(`${nodeUrl}/restart`, {
            timeout: 3000
        })
        .then((response) => {
            if(notify){
                toastr.success('Node reiniciado con exito');            
            }
            console.log('node restarted');
        })
        .catch((response)=>{
            console.log('node not responding, trying to start....');
            if(initialize){
                nodeStart();
            }
        });
        console.log(err);
    })


}
function nodeStart(){
    axios(`/4DACTION/_V3_startup?fromWebV3=true`).then(resp => {
        console.log('node initialized');
    }).catch(err => {
        console.log(err);
    });
}

unaBase.ready = function(callback){
    // in case the document is already rendered
    if (document.readyState!='loading') callback();
    // modern browsers
    else if (document.addEventListener) document.addEventListener('DOMContentLoaded', callback);
    // IE <= 8
    else document.attachEvent('onreadystatechange', function(){
        if (document.readyState=='complete') callback();
    });
}

unaBase.percentage = (total, part)=>{
    let totalPercentage = total /100; 
    let complete = (totalPercentage !== 0) ? part / (totalPercentage) : 0;
    return Math.round(complete)
}


var getType = item => (typeof item === 'boolean') ? 'checked' : 'value';
      
var domFunc = {
    setter: {
        jquery(selector, data, extraData=false){

            if(typeof data === "boolean" ){
                selector.prop("checked", data);
            }else{
                selector.val(data);
            }
            if(extraData) selector[0].dataset.value = data;
        }
    },
    getValueByType(selector){
        switch(selector.type){
            case "checkbox":
                return selector.checked;
                break;
            default:
                return selector.value;
                break;
        }
    },
    setForm({data, disabled=[]}){
        
        for(const key in data){            
            const item = data[key];
            const selector = document.querySelector(`.item[name="${key}"]`);
            if(disabled.includes(key)) selector.disabled = true;
            if(selector !== null && !Array.isArray(data[key])){
                
                selector[setter(item)] = item;
            }
            // const setter = (typeof item === 'boolean') ? 'checked' : 'value';
        }
    },
    setFormJquery({data, disabled=[], extraData=false}){
        
        for(const key in data){            
            const item = data[key];
            const selector = document.querySelector(`.item[name="${key}"]`);
            if(disabled.includes(key)) selector.disabled = true;
            if(selector !== null && !Array.isArray(data[key])){
                domFunc.setter.jquery($(selector), item, extraData);
            }
            // const setter = (typeof item === 'boolean') ? 'checked' : 'value';
        }
    },
    setList({data, selector, type, showId = false, readOnly = []}){
        const container = document.querySelector(selector);
        let html = "";
        let line = "";
        let innerLine = "";
        switch(type){
            case "tr":
                for(let element of data ){
                    for(let item in element){
                        if(item !== "id" || showId){
                            innerLine += `<td><input ${readOnly.includes(item) ? "readonly" : ""} name="${item}" value="${element[item]}" /></td>`;

                        }
                    }
                    line += `<tr data-id="${element["id"]}">
                                ${innerLine}                             
                            </tr>`
                    innerLine = "";
                }
                break;
            case "li":
                break;
        }
        container.innerHTML = line;
    },
    getObjectFromNodes(nodes){
        const data = {};
        for(let item of nodes){
            data[item.name] = domFunc.getValueByType(item)
        }
        return data;
    },
    getDataByObject(dataObject){
        let data = {}
        for(let key in dataObject){             
            const selector = document.querySelector(`.item[name="${key}"]`);
            if(selector !== null && !selector.readOnly){
                data[key] = domFunc.getValueByType(selector);
            }
        }
        return data
    },
    getDataByArray(dataArray){
        let data = {}
        for(let key of dataArray){             
            const selector = document.querySelector(`.item[name="${key}"]`);
            if(selector !== null && !selector.readOnly){
                data[key] = domFunc.getValueByType(selector);
            }
        }
        return data
    },
    getDataByClassName(className){
        let data = {}
        let documents = document.querySelectorAll(`.${className}`)
        for(let selector of documents){
            // const selector = document.querySelector(`.item[name="${key}"]`);
            if(selector !== null && !selector.readOnly){
                data[selector.name] = domFunc.getValueByType(selector);
            }
        }
        return data
    },

}
var setterHtml = (data, selector, info) => {
    let setter = item => (typeof item === 'boolean') ? 'checked' : 'value';
    
    let container = document.querySelector(selector);
    let isObject = data.constructor === Object;
    let isArray = Array.isArray(data);

    try{
        if(isArray){
            for(let doc of data){
                let option = document.createElement('option');
                option.text = doc[info.text];
                option.value = doc[info.id];
                container.add(option);
            }
        }else if(isObject){
            for(const key in data){
                const item = data[key];
                container = document.querySelector(`.item#${key}`)
                container[setter(item)] = item;
            }

        }else{
            switch(typeof data){
                case 'boolean':
                    container.checked = data;
                    break;
                case 'number':
                    container.value = data;              
                    setter = 'value'
                    break;
                case 'string':
                    container.value = data;
                    setter = 'value'
                    break;
            }
        }

    }catch(err){
        console.warn("error from setter html");
        console.warn(err);
    }



}
// unaBase.email.getData = () => {

//    axios(`/4DACTION/_V3_settingsSMTP`).then(res => {
//             let data = res.data.SMTP[0];     
//             localStorage.setItem('emailData', JSON.stringify(data));
//         }).catch(err => {
//             console.warn(err);
//         });
// }