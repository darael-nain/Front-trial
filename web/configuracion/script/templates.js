


const templates = {
    alerta: a_ => {
        return `<div class="alert alert-${a_.type} alert-dismissible fade show w-50 p-3 mx-auto" role="alert">
                   ${a_.msg}
                  
                </div>`
    }
}


