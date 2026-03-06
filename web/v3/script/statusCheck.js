


unaBase.node = {
    lastNotify: null,
    //unaBase.node.lastNotify
    updateParam(){
        return new Promise((resolve, reject) => {
            axios(`/4DACTION/_V3_getParamConnect`).then(res => {

                // nodeUrl = 'http://' + res.data.ipAlt2 + ':' + res.data.nodePort;
                resolve(res.data);
            }).catch(err => {
                console.log(err);
                reject(err);
            });

        });
    },
    checkNotify(set=false){
    //unaBase.node.checkNotify  
        return new Promise((resolve, reject) => {
            let url = set ? `/4DACTION/_v3_nodeNotify?set=true` : `/4DACTION/_v3_nodeNotify`
            axios(url).then(res => {
                resolve(res.data);
            }).catch(err => {
                console.log(err);
                reject(err);
            });
        })
    },
    notify(){       
    //unaBase.node.notify  
         // envia un correo a down@unabase.com con un link para iniciar el nodeserver
        console.warn('begin node notify');
        let now = new Date();
        let timeBetween = ((now - unaBase.node.lastNotify)/1000);

        unaBase.email.getData();
        let notifyMail = ()=>{

                    let data = unaBase.email.data();          
                    let mailData =    {       
                            "to": 'down@unabase.com',
                            "subject": `${nombreEmpresa} node caido.`,
                            "html": `<a href="${base_url}/4DACTION/_V3_startup?fromWebV3=true">Reiniciar Node (${currentUser.username
                            })</a>`,
                            "pass": data.pass,
                            "user": data.user,                            
                            "host": data.host,
                            "port": data.port,
                            "ignoreTLS": true,
                            "from": `Unabase  <${data.user}>`                  
                        
                    }   
                    axios.post(uVar.urlEmailMs, mailData, {
                        headers: { 'x-api-key': 'Zd7qlZON2n8GnkCO1iH7Y7BhrQ6G2W5590cv1PfF'}
                    }).then(res => {
                        console.log(res);
                    }).catch(err => {
                        console.warn(err);
                    });
                     unaBase.node.checkNotify(true);
         

        }

        notifyMail();
            // unaBase.node.checkNotify().then(res => {
            //     if(res.notify){
            //     }

            //         unaBase.node.lastNotify = new Date();
            // }).catch(er => {
            //     notifyMail();
            //     console.warn(err);
            // })
     

    },
    check(notify = false){
        //unaBase.node.check
        //verifica si server node esta vivo y funcionando
        console.warn('begin node check');
        return new Promise((resolve, reject) => {
            unaBase.node.updateParam().then(res => {
                axios(`${nodeUrl}/isAlive`, {
                    timeout: 4000
                }).then(res => {
                    console.warn('Node funciona correctamente from node check.');
                    if(notify){
                        toastr.success('Node funciona correctamente.');     
                        
                    }
                    resolve(res);
                }).catch(err => {
                    console.warn('from node check fail, node quickRestart begin');
                    reject(err);
                
                  
                });

            }).catch(err => {
                console.warn('err getting paramConnect');
            });

        });
    },
    start(notify = false, notifyMail=false, forceStart=false){
    //unaBase.node.start
        //inicia servidor Node
        console.warn('begin node start');
        axios(`/4DACTION/_V3_startup?fromWebV3=true&forceStart=${forceStart}`, {
            timeout: 60000
        }).then(res => {
            console.warn('Node iniciado con exito, from node start');
            if(notify){
                toastr.success('Node iniciado con exito');                   
            }
            return true;
        }).catch(err => {
            console.warn('-----err node from node start-----');
            console.error(err);  
            // if(notifyMail){                
            //     unaBase.node.notify();
            // }
            return false;       
          
        });
    },
    quickRestart(notify = false, initialize = false, email=false){
        //unaBase.node.quickRestart
        return new Promise((resolve, reject) => {
            console.warn('begin quickRestart');
            axios('/4DACTION/_V3_restartNode').then(res => {
            }).catch(err => {
                console.warn(err);
            });
            setTimeout(() => {

                 unaBase.node.check(notify).then(res => {       
                    console.warn('Node reiniciado con exito, from node check inside quickRestart');           
                    if(notify){
                        toastr.success('Node reiniciado con exito');            
                    }
                    resolve();
                 }). catch(err => {
                    if(initialize){
                        console.warn('run node start from quick restart fail');
                        unaBase.node.start(notify);                        
                    }
                    reject(err);
                 });
            }, 10000);

        })
    },
    state(state){
        switch(state){
            case 'off':
                $('button.nodeServer').addClass('offline');
                $('button.nodeServer').removeClass('online');
                break;
            case 'on':
                $('button.nodeServer').addClass('online');
                $('button.nodeServer').removeClass('offline');
                break;
        }
    }
}

unaBase.server = {
    check(){
        return new Promise((resolve, reject)=> {
            axios('/4DACTION/wbienvenidos').then(res => {
                if(res.status === 200){
                    
                    localStorage.setItem('serverCount', 0);
                    resolve(res);
                }
            }).catch(err => {
                
                let serverCount = parseInt(localStorage.getItem('serverCount')) || 0;
                let newCount = serverCount+1;
                localStorage.setItem('serverCount', newCount);     
                    console.warn('server falls'+newCount);           
                if(newCount > 3){                    
                        unaBase.server.notify();
                }
                reject(err);
            })
        })
    },
    notify(){        
        
        let now = new Date();
        let lastNotify = new Date(localStorage.getItem('serverNotify')) || new Date(); 
        let timeBetween = (now - lastNotify) / 1000;
        if(timeBetween>600){
            
            let data = unaBase.email.data();
            let mailData = {       
                    "to": 'down@unabase.com',
                    "subject": `${nombreEmpresa} 4D server caido.`,
                    "html": `<h2>${nombreEmpresa} 4D server caido.</h2>`,
                    "pass": data.pass,
                    "user": data.user,                            
                    "host": data.host,
                    "port": data.port,
                    "ignoreTLS": true,
                    "from": `Unabase  <${data.user}>`                  
                
            };
                    console.log(mailData);
            axios.post(uVar.urlEmailMs, mailData, {
                headers: { 'x-api-key': 'Zd7qlZON2n8GnkCO1iH7Y7BhrQ6G2W5590cv1PfF'}
            }).then(res => {
                console.log(res);
            }).catch(err => {
                console.warn(err);
            });







            localStorage.setItem('serverNotify', new Date());    

        }
    }
}