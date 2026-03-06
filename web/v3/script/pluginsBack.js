const intercom = (company) => {
    if (company != "") {
        window.intercomSettings = {
            company,
            website_url: base_url,
            version: version_Actual,
            company_name: companyName,
            app_id: "dtk9r8ip",
            name: `${currentUser.name}`, // Full name
            email: currentUser.email, // Email address
            created_at: new Date() // Signup date as a Unix timestamp,
        };
        (function () { var w = window; var ic = w.Intercom; if (typeof ic === "function") { ic('reattach_activator'); ic('update', intercomSettings); } else { var d = document; var i = function () { i.c(arguments) }; i.q = []; i.c = function (args) { i.q.push(args) }; w.Intercom = i; function l() { var s = d.createElement('script'); s.type = 'text/javascript'; s.async = true; s.src = 'https://widget.intercom.io/widget/dtk9r8ip'; var x = d.getElementsByTagName('script')[0]; x.parentNode.insertBefore(s, x); } if (w.attachEvent) { w.attachEvent('onload', l); } else { w.addEventListener('load', l, false); } } })();

    } else {
        window.intercomSettings = {
            website_url: base_url,
            version: version_Actual,
            company_name: companyName,
            app_id: "dtk9r8ip",
            name: `${currentUser.name}`, // Full name
            email: currentUser.email, // Email address
            created_at: new Date() // Signup date as a Unix timestamp,
        };
        (function () { var w = window; var ic = w.Intercom; if (typeof ic === "function") { ic('reattach_activator'); ic('update', intercomSettings); } else { var d = document; var i = function () { i.c(arguments) }; i.q = []; i.c = function (args) { i.q.push(args) }; w.Intercom = i; function l() { var s = d.createElement('script'); s.type = 'text/javascript'; s.async = true; s.src = 'https://widget.intercom.io/widget/dtk9r8ip'; var x = d.getElementsByTagName('script')[0]; x.parentNode.insertBefore(s, x); } if (w.attachEvent) { w.attachEvent('onload', l); } else { w.addEventListener('load', l, false); } } })();

    }

}

let company = ""
if (typeof companyRut != 'undefined' && companyRut != null) {
    //console.log(`companyRut:: ${companyRut}`)
    company = {
        id: companyRut,
        name: companyName,
        website: base_url
    }
}

//intercom(company)


let ufUrls = {
    url: 'https://api.sbif.cl/api-sbifv3/recursos_api/uf?apikey=ce567cb4db4d6a3daf4b560d142519f584525d2d&formato=json',
    provider: 'Superintendencia de Bancos e Instituciones Financieras de Chile ',
    urlProvidor: 'sbif.cl'
}
//var uf = "27.205,99"
let separatorTransform = number => {
    let index = number.indexOf(',')
    let noDecimals = number.slice(0, index)
    let final = noDecimals.replace('.', '') + '.' + number.slice(index + 1)
    return parseFloat(final)

}

const percentage = (total, part) => {
    return ((part / total) * 100).toFixed(2)
}
if (typeof reqUrl !== 'undefined') {
    if (reqUrl !== "" && reqUrl !== null) {
        // 	// window.location.replace(nodeUrl+'/agentControl/false');
        // 	//
        // 
        window.location.replace(nodeUrl + reqUrl);
    }
}

let today = new Date()
// 	
if (dateString(today).txtDate != currency.ufUpdate && currency.code == 'CLP') {

    currency.cl.uf.update()
}