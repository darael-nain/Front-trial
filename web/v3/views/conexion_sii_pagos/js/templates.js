

// Updated: 2025-01-17 - Fixed column order - FORCE CACHE UPDATE v2
const templates = {

    card: (CO_) => {

        let card =

            `<div class=" col-md-6 col-xxl-3 mb-3 pr-md-2">
           
            <div class="card h-md-100 ">
                ${(CO_.hasHeader ? `  
                <div class="card-header pb-0">
                    <h6 class="mb-0 mt-2 d-flex align-items-center">${(CO_.headerTitle ? CO_.headerTitle : '')}</h6>
                </div>` : '')}
                <div class="card-body d-flex flex-column justify-content-end">
                    <div class="row">
                    <div class="col">
                        <small class="card-title">${(CO_.title ? CO_.title : '')}</small>
                        <a href="${(CO_.href ? CO_.href : '')}"><p class="font-sans-serif lh-1 mb-1 fs-4">${(CO_.body1 ? CO_.body1 : '')}</p></a><span class="badge rounded-pill bg-success">45,5%</span>
                    </div>
                    <div class="col-auto ps-0">

                    </div>
                    </div>
                </div>
            </div>
             
        </div>`;

        return card;
    },
    table: (t_) => {

        let table = ``;
        let TH = ``;
        let TB = ``;

        if (t_.headers.length > 0) {
            t_.headers.forEach(function (t_ele) {

                TH += `<th class="header-table" scope="col">${(t_ele)}</th>`;
            })

        }

        tableHead =
            `<thead>
                <tr>
                    ${(TH)}
                </tr>
            </thead>`;


        if (t_.bodyRows.length > 0) {
            t_.bodyRows.forEach(function (t_ele) {
                TB += `<tr>`;
                t_ele.forEach(function (t_ele_ele) {

                    TB += `<td>${(t_ele_ele)}</td>`;
                })
                TB += `</tr>`;
            })
        }

        tableBody =
            `<tbody>
                ${(TB)}
            </tbody>`;

        table = tableHead + tableBody;

        return table;

    },
    select: s_ => {

        let OP = ``;


        let select =

            `<div class="input-group mb-3" style="display:none">
                <label class="input-group-text" for="select${s_.id}">${s_.label_name}</label>
                <select class="form-select" id="select${s_.id}" idelement="${s_.id}" idelement2="${s_.id0}">
                    <option id="0" unselected>Seleccione</option>`;

        if (s_.options.length > 0) {
            s_.options.forEach(function (s_ele) {

                OP += `<option id="${s_ele.id}">${(s_ele.name)}</option>`;
            })

        }


        select +=
            `${OP}
                </select>
            </div>`;


        return select;
    },
    list: l_ => {

        let ls = ``;

        let lista =
            `<ol class="list-group list-group-numbered">`;

        const genList = ls_e => {

            const genAdicional = ls_ad_e => {
                let ls_ad = ``;
                ls_ad_e.forEach(ls_ad_e_e => {
                    ls_ad += ls_ad_e_e + '<br>';

                })


                return ls_ad;
            }



            ls_e.forEach(function (l_ele) {

                ls += `<hr>`;
                ls += `<li class="list-group-item  justify-content-between align-items-start">

                        <div class="ms-2 row ${l_ele.class1}" style="" >
                            <div class="col-md-5 col-lg-5">
                                <h5 class="fw-bold"> ${l_ele.titulo}</h5><small>${l_ele.subtitulo}</small>
                                <div><p style="word-break: normal;">${l_ele.l1}  ${l_ele.l2 != "" ? '<br>' + l_ele.l2 : ''}</p></div>
                                <div class="fw-bold"> ${l_ele.link1}</div>
                                  <div><p style="word-break: normal;">${l_ele.l3}</p></div>
                                  <div class="fw-bold " style="">  
                                  <span style="font-size: 15px;"> ${l_ele.l4 != 0 ? typeof l_ele.l4 === 'string' ? l_ele.l4 : '$' + new Intl.NumberFormat("de-DE").format(l_ele.l4) : ""}</span> 
                                </div>
                            </div>
                           
                            ${l_ele.inter1 != "" ? '<div class="col-md-1 col-lg-1">' + l_ele.inter1 + '</div>' : ''} 
                            <div class="col-md-5 col-lg-5" style="" > 
                                ${l_ele.adicional.length > 0 ? genAdicional(l_ele.adicional) : ''} 
                            </div>
                         
                            <div class="justify-content-end col-md-1 col-lg-1" style="">  
                            ${l_ele.l5}
                            </div>
                        </div>
                        
                    </li>` ;
            });
            ls += `<hr>`;
        };





        if (l_.bloques.length > 0)
            l_.bloques.forEach(l_e => genList(l_e));



        lista +=
            `${ls}
            </ol>`;

        return lista;
    },
    spinners: (txt) => {

        let spinners =
            `<div class="spinner-grow text-success" role="status">
              <span class="sr-only">Loading...</span>
            </div>
            <div class="spinner-grow text-danger" role="status">
              <span class="sr-only">Loading...</span>
            </div>
            <div class="spinner-grow text-warning" role="status">
              <span class="sr-only">Loading...</span>
            </div>
            <div class="spinner-grow text-info" role="status">
              <span class="sr-only">Loading...</span>
            </div>
            <br>
            <span style="margin-left: 10px; font-weight: bold;">${txt ? txt : 'Por favor espere...'}</span>`;


        return spinners;
    },
    simpleMsg: sm_ => {

        return `<div class="">
                    <span class="">${sm_}</span>
                </div>`;

    },
    alerta: a_ => {
        return `<div class="alert alert-${a_.type} alert-dismissible fade show w-50 p-3 mx-auto" role="alert">
                   ${a_.msg}
                </div>`
    },
    selector: (s_) => {
        let ls = ``;
        
        const genSelector = (ls_, o) => {
            
            let ls_e = ls_.rows
            let sl_os = '';

            let pendingColor = '';
            let color = '';
            let cs = '';

            if (ls_.conciliado) {
                color = '#884d79';
                cs = 'purple';
                pendingColor = 'purple';
            } else if (ls_e.length > 0) {
                color = '#03D6F9';
                cs = 'blue';
                pendingColor = 'blue';
            } else {
                pendingColor = 'red';
                color = '#FC4903';
                cs = 'red';
            }
            
            cuentas.forEach(l_ele => sl_os += `<option value="${l_ele.cuenta}" data-auxiliar="${l_ele.auxiliar || false}">${l_ele.cuenta}  /  ${l_ele.nombre}</option>`);

            let select_cuentas = `<select class="account" aria-label="Default select">
                                    <option value="" selected>Selecciona una cuenta...</option>
                                    ${sl_os}
                                </select>`

            

            let tipos = ''
            if (ls_.siimov_tipo === "CARGO") {
                tipos += '<option value="Egreso">Egreso</option>'
                tipos += '<option value="Traspaso">Traspaso</option>'
            } else if (ls_.siimov_tipo === "ABONO") {
                tipos += '<option value="Ingreso">Ingreso</option>'
                tipos += '<option value="Traspaso">Traspaso</option>'
            }



            let select_tipos = `<select class="form-select mt-2" aria-label="Default select" id="tipo_asiento">
                                ${tipos}
                            </select>`


            let tooltip_row = `<div class='container' id='tooltip'>
                                    <div class='container' >
                                        <div class='row' >
                                            <div class='col-4'>
                                            <strong>
                                            Contraparte
                                            </strong>
                                            </div>
                                            <div class='col-4'>
                                            <strong>
                                            Rut
                                            </strong>
                                            </div>
                                            <div class='col-4'>
                                            <strong>
                                            Numero cuenta
                                            </strong>
                                            </div>
                                        </div>
                                        <div class='row'>
                                            <div class='col'>
                                            ${ls_.siimov_contraparte}
                                            </div>
                                            <div class='col'>
                                            ${ls_.siimov_rut}
                                            </div>
                                            <div class='col'>
                                            ${ls_.siimov_cuenta}
                                            </div>
                                        </div>
                                    </div>
                                </div>`;

            // <button style="width: unset;" type="button" class="btn"  data-bs-toggle="tooltip" data-bs-html="true" data-bs-placement="top" title="${tooltip_row}">
            //     <i class="fas fa-info"></i>
            // </button>

            ls += `<div class="accordion-item mov container  ${cs}"  data-id="${ls_.iddoc}" data-total="${ls_.siimov_total}" >
                    <div class="accordion-header" id="panelsStayOpen-heading${o}-${ls_.iddoc}">
                        <div class=" row  align-items-center" > 
                            <button class="accordion-button ${s_.find ? '' : 'collapsed'} " type="button"  data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse${o}-${ls_.iddoc}" aria-expanded="false" aria-controls="panelsStayOpen-collapse${o}-${ls_.iddoc}">
                                <div class=" col-md-1 col-lg-1">
                                    ${s_.imgbank}
                                </div>
                              
                                <div class="col-md-2 col-lg-2">
                                    <small>${ls_.siimov_desc} </small> 
                                </div>
                               
                                <div class="col-md-2 col-lg-2" style="text-align:end;"> 
                                    <small  style="margin-right:50px;font-weight: bolder;"> ${ls_.siimov_tipo == 'CARGO' ? '-' : '  '} $ ${new Intl.NumberFormat('en-DE').format(ls_.siimov_total.replace(',','.'))} </small>
                                </div>
                                <div class="col-md-2 col-lg-2">
                                    <strong class="badge rounded-pill" style="color: ${ls_.siimov_tipo == 'CARGO' ? '#F47975' : '#4EC275'}; background: ${ls_.siimov_tipo == 'CARGO' ? '#FCD7D6' : '#DDFFDA'};"> ${ls_.siimov_tipo.toLowerCase()} </strong>
                                </div>
                                <div class="col-md-2 col-lg-2 align-items-center" style="text-align:center;"> 
                                    <span  style="font-weight: bolder;">${ls_.siimov_fecha}</span>
                                </div>
                                <div class="col-md-2 col-lg-2 align-items-right estado"> 
                                    <span class="${cs}" style="font-weight: bolder;">${ls_.conciliado ? 'CONCILIADO' : ls_e.length ? `Coincidencias (${ls_e.length})` : 'Sin coincidencias'}</span>
                                </div>
                            
                               
                                <div class=" col-md-1 col-lg-1 align-items-right icon-estado"> 
                                    <i class="fa ${ls_.conciliado ? 'fa-check-square' : 'fa-list'} fa-2x ${cs}" aria-hidden="true"></i>

                                </div>
                            
                            </button>
                        </div> 
                        
                    </div>
                  
                    <div id="panelsStayOpen-collapse${o}-${ls_.iddoc}" class="accordion-collapse collapse ${s_.find ? 'show' : ''}" aria-labelledby="panelsStayOpen-heading${o}-${ls_.iddoc}">
                        <div class="accordion-body">
                            <div class="accordion" id="accordionPanelsStayOpen-${o}-${ls_.iddoc}">`



            let findButton = `<div class=" col-md-6 col-lg-6 align-items-center" style="display: grid;"> 
                                <label  class="" disabled></label>
                                <button ${ls_.conciliado ? 'disabled' : ''} type="button" style="font-weight:bold;" class="btn btn-outline-warning find-seat ${ls_.conciliado ? 'conciliado' : ''} create" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse${o}_${o}_${o}_-${ls_.iddoc}" aria-expanded="false" aria-controls="panelsStayOpen-collapse${o}_${o}_${o}_-${ls_.iddoc}">Crear asiento contable</button>
                            </div>
                            <div class=" col-md-1 col-lg-1 align-items-center" style="display: grid;">
                                <hr class="v-sep">
                            </div>
                            <div class=" col-md-4 col-lg-4 align-items-center" style="display: grid;">
                                <button  ${ls_.conciliado ? 'disabled' : ''} type="button" style="font-weight:bold;" class="btn btn-outline-info find-seat  ${ls_.conciliado ? 'conciliado' : ''}" data-id="${ls_.iddoc}"   data-bs-toggle="modal" data-bs-target="#modalmatch">Otras coincidencias...</button>
                            </div>
                            <div class=" col-md-1 col-lg-1 align-items-right icon-estado"> 
                                <i class="fas fa-trash fa-2x" style="margin-left: 20px;color:red" onclick="disable(this)" data-id="${ls_.iddoc}"> </i>
                            </div>`
                            


            ls += `<div class="accordion-item" style="border-color: white;">
                <div class="accordion-header row  align-items-center" id="panelsStayOpen-heading${o}_${o}_${o}-${ls_.iddoc}">
                    ${s_.find ? '' : findButton}       
                </div>
                <div id="panelsStayOpen-collapse${o}_${o}_${o}_-${ls_.iddoc}" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-heading${o}_${o}_${o}-${ls_.iddoc} style="">
                    <div class="accordion-body accordion-main-${ls_.iddoc}" data-id="${ls_.iddoc}" style="padding: 30px; background: #f6f8f9;border-radius: 30px;">
                        <div class="form-floating row" style ="margin:20px">
                            <div class="col-10">
                                <label for="floatingTextarea2">Descripción...</label>
                                <textarea class="form-control ref" placeholder="" id="floatingTextarea2" style="height: 60px">${ls_.siimov_desc}</textarea>
			                </div>
                            <div class="col-2">
                                ${select_tipos}
			                </div>
                        </div>
                        <div class="row" style="margin-bottom: 30px; background: black; color:white;font-weight: bold;">
                            <div class="col-md-1">
                                <span>Contacto</span>
                            </div>
                            <div class="col-md-2">
                                <span>Centro Costo</span>
                            </div>
                            <div class="col-md-2">
                                <span>Cuenta Contable</span>
                            </div>
                            <div class="col-md-2">
                                <span>Nombre cuenta</span>
                            </div>
                            <div class="col-md-2">
                                <span>Glosa</span>
                            </div>
                            <div class="col-md-1">
                                <span>Debe</span>
                            </div>
                            <div class="col-md-1">
                                <span>Haber</span>
                            </div>
                            <div class="col-md-1">
                                <span>Acciones</span>
                            </div>
                        </div>
                        <div class="row" style="margin-bottom:10px;">
                            <div class="col-md-1">
                                <div class="contacto-cell" data-idcont="">
                                    <button class="search-btn" data-type="auxiliar" data-id="${ls_.iddoc}_1" onClick="showDialogContact(this)" title="Buscar contacto" style="font-size: 12px; padding: 2px 4px; display: none;">
                                        <i class="fas fa-search"></i>
                                    </button>
                                    <div class="contact-data-row"></div>
                                </div>
                            </div>
                            <div class="col-md-2 ccosto-col">
                                <select class="centro_costo form-select"></select>
                            </div>
                            <div class="col-md-2">
                                <input class="form-control" type="text" value="${ls_.cuenta_contable}" aria-label="" data-id="${ls_.iddoc}" disabled readonly>
                            </div>
                            <div class="col-md-2">
                                <input class="form-control" type="text" value="${ls_.nombre_cuenta}" aria-label=""  disabled readonly>
                            </div>
                            <div class="col-md-2">
                                <input class="form-control glosa-input" type="text" value="" placeholder="Ingrese Glosa"
                                data-id="${ls_.iddoc}" data-linea="1">
                            </div>
                            <div class="col-md-1">
                                <input class="form-control" type="text" value="${ls_.debe}" aria-label="" data-id="${ls_.iddoc}" disabled readonly>
                            </div>
                            <div class="col-md-1">
                                <input class="form-control" type="text" value="${ls_.haber}" aria-label="" data-id="${ls_.iddoc}" disabled readonly>
                            </div>
                            <div class="col-md-1" style="text-align: center;">
                                <button type="button" style="color:#34CC02;" class="btn" disabled><i class="fa fa-check-circle"></i></button>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-1">
                                <div class="contacto-cell" data-idcont="">
                                    <button class="search-btn" data-type="auxiliar" data-id="${ls_.iddoc}_2" onClick="showDialogContact(this)" title="Buscar contacto" style="font-size: 12px; padding: 2px 4px; display: none;">
                                        <i class="fas fa-search"></i>
                                    </button>
                                    <div class="contact-data-row"></div>
                                </div>
                            </div>
                            <div class="col-md-2 ccosto-col">
                                <select class="centro_costo form-select"></select>
                            </div>

                            <div class="col-md-2">
                                <input class="form-control num-account" type="text" value="" aria-label="" disabled readonly>
                            </div>
                            <div class="col-md-2">
                                ${select_cuentas}
                            </div>
                            <div class="col-md-2">
                                <input class="form-control glosa-input" type="text" value="" placeholder="Ingrese Glosa"
                                data-id="${ls_.iddoc}" data-linea="2">
                            </div>
                            <div class="col-md-1">
                                <input class="form-control" type="text" value="${ls_.haber}" aria-label="" data-id="${ls_.iddoc}" oninput="onInputCheckEmptyAndFormat(this)" onkeydown="onEnterPressed(event,this)" onblur="onBlurRestoreZero(event,this)" onfocus="onFocusClearZero(event,this)">
                            </div>
                            <div class="col-md-1">
                                <input class="form-control" type="text" value="${ls_.debe}" aria-label="" data-id="${ls_.iddoc}" oninput="onInputCheckEmptyAndFormat(this)" onkeydown="onEnterPressed(event,this)" onblur="onBlurRestoreZero(event,this)" onfocus="onFocusClearZero(event,this)">
                            </div>
                            <div class="col-md-1" style="text-align: center;">
                                <button type="button" style="color:#34CC02; margin-right: 5px;" class="btn btn-add-account" onclick="addAccount(this, 'add')" data-id="${ls_.iddoc}"><i class="fa fa-plus"></i></button>
                                <button type="button" style="color:#d32f2f;" class="btn btn-del-account" onclick="addAccount(this, 'del')" data-id="${ls_.iddoc}"><i class="fa fa-trash"></i></button>
                            </div>
                        </div>

                        <div class="row mt-2 row-totales">
                            <div class="col-md-2">
                            </div>
                            <div class="col-md-2">
                            </div>
                            <div class="col-md-1"></div>
                            <div class="col-md-2">
                                <span class="badge rounded-pill bg-light text-dark" style="font-size: 15px;">Total:</span>
                            </div>
                            <div class="col-md-2"></div>
                            <div class="col-md-1">
                                <span class="badge rounded-pill bg-light text-dark total_debe" style="font-size: 15px;">${ls_.debe > 0 ? ls_.debe : ls_.haber }</span>
                            </div>
                            <div class="col-md-1">
                                <span class="badge rounded-pill bg-light text-dark total_haber" style="font-size: 15px;">${ls_.haber > 0 ? ls_.haber : ls_.debe}</span>
                            </div>
                            <div class="col-md-1">
                            </div>
                        </div>
                        <div class="row" style="margin-top: 40px;">
                            <div class="col">
                                <button data-id="${ls_.iddoc}" style="width: max-content; background:#884d79;font-weight:bold;" class="btn btn-success conciliador create" type="button">Crear y Conciliar</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div class="accordion-item complette-comp">
                
            </div>`

            if (ls_e.length > 0) {

                ls_e.forEach((l_ele, i) => {

                    let findButton2 = ``

                    if (s_.find)
                        findButton2 = `<div class="form-check form-switch">
                                            <input class="form-check-input check-comp" data-idcomp="${l_ele.idoc}" data-id="${ls_.iddoc}"  data-total="${l_ele.debe}" type="checkbox" role="switch" id="flexSwitchCheckDefault" onchange="sumTotal(event)">
                                        </div>`
                    else
                        findButton2 = `<button type="button" data-total="${l_ele.debe}" data-idcomp="${l_ele.idoc}" data-id="${ls_.iddoc}" style="background-color: #f2f4f5 !important;" class="btn conciliador"><i class="other fa fa-check-circle fa-2x ${ls_.conciliado ? 'green' : ''}"></i></button>`

                    ls += `<div class="accordion-item accordion-detail-${l_ele.idoc}">
                            <div class="accordion-header row  align-items-center" style="background-color: #f2f4f5 !important; background-color: grey;
                                    border-block: inherit;
                                    border: 1px solid grey;
                                    border-radius: 12px;">
                                <div class=" col-md-11 col-lg-11"  id="panelsStayOpen-heading${o}_${i}-${l_ele.idoc}">
                                    <div class="row"> 
                                        <button class="accordion-button comprobante collapsed"  data-id="${s_.find ? 'find-' : ''}${ls_.iddoc}-${l_ele.idoc}" data-idcomp="${l_ele.idoc}" style=" margin-right:10px;background-color: #f2f4f5  !important;" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse${o}_${i}-${l_ele.idoc}" aria-expanded="false" aria-controls="panelsStayOpen-collapse${o}_${i}-${l_ele.idoc}">
                                            <div class=" col-md-2 col-lg-2">  
                                                <strong style="margin-right:20px"><a onclick="toComprobante(event,this)" href="#" data-id="${l_ele.idoc}">Asiento #${l_ele.folio}</a></strong><br>
                                                <small style="margin-right:20px">${l_ele.fecha_emision} </small>
                                            </div>
                                            <div class=" col-md-6 col-lg-6"  style="margin-right:20px"> 
                                                <small style="">${l_ele.referencia}</small>
                                            </div>
                                            <div class=" col-md-2 col-lg-2  align-items-right"> 
                                                <span  style="font-weight: bolder;margin-right:20px;">DEBE</span>  <small  style="font-weight: bolder;" class="total-debe">$${formatearNumero(l_ele.debe)} </small>
                                            </div>
                                            <div class=" col-md-2 col-lg-2  align-items-right"> 
                                                <span  style="font-weight: bolder;margin-right:20px;">HABER</span>  <small  style="font-weight: bolder;" class="total-haber">$${formatearNumero(l_ele.haber)} </small>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                                <div class="col-md-1 col-lg-1"  style="background-color: #f2f4f5  !important;">
                                    ${findButton2}
                                </div>
                            </div>
                            
                            <div id="panelsStayOpen-collapse${o}_${i}-${l_ele.idoc}" class="accordion-collapse collapse  " aria-labelledby="panelsStayOpen-heading${o}_${i}-${l_ele.idoc}">
                                <div class="accordion-body body_comprobante"  data-id="${s_.find ? 'find-' : ''}${ls_.iddoc}-${l_ele.idoc}" data-idcomp="${l_ele.idoc}">
                                </div>
                            </div>
                        </div>`

                });

            }
            ls += `</div>
                    </div>
                </div>
            </div>`;
        }

        let selector = `<div class="accordion" id="accordionPanelsStayOpen">`



        if (s_.bloques.length > 0)
            s_.bloques.forEach((l_e, o) => genSelector(l_e, o));

        selector += `${ls}<div>`

        return selector


    },

    selector_nomina: (s_) => {
        let ls = ``;
        
        const genSelector = (ls_, o) => {
            
            let ls_e = ls_.comprobantes
            let sl_os = '';

            let pendingColor = '';
            let color = '';
            let cs = '';

            if (ls_.conciliado) {
                color = '#884d79';
                cs = 'purple';
                pendingColor = 'purple';
            } else if (ls_e.length > 0) {
                color = '#03D6F9';
                cs = 'blue';
                pendingColor = 'blue';
            } else {
                pendingColor = 'red';
                color = '#FC4903';
                cs = 'red';
            }
            
            cuentas.forEach(l_ele => sl_os += `<option value="${l_ele.cuenta}" data-auxiliar="${l_ele.auxiliar || false}">${l_ele.cuenta}  /  ${l_ele.nombre}</option>`);

            let select_cuentas = `<select class="account" aria-label="Default select">
                                    <option value="" selected>Selecciona una cuenta...</option>
                                    ${sl_os}
                                </select>`

            

            let tipos = ''
            if (ls_.siimov_tipo === "CARGO") {
                tipos += '<option value="Egreso">Egreso</option>'
                tipos += '<option value="Traspaso">Traspaso</option>'
            } else if (ls_.siimov_tipo === "ABONO") {
                tipos += '<option value="Ingreso">Ingreso</option>'
                tipos += '<option value="Traspaso">Traspaso</option>'
            }



            let select_tipos = `<select class="form-select mt-2" aria-label="Default select" id="tipo_asiento">
                                ${tipos}
                            </select>`
            ls += `<div class="accordion-item mov container  ${cs}"  data-id="${ls_.iddoc}" data-id-nomina="${ls_.id_nomina}" data-total="${ls_.siimov_total}" >
                    <div class="accordion-header" id="panelsStayOpen-heading${o}-${ls_.iddoc}">
                        <div class="row  align-items-center" > 
                            <button class="accordion-button ${s_.find ? '' : 'collapsed'} " type="button"  data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse${o}-${ls_.iddoc}" aria-expanded="false" aria-controls="panelsStayOpen-collapse${o}-${ls_.iddoc}">
                                <div class=" col-md-1 col-lg-1">
                                    ${s_.imgbank}
                                </div>
                              
                                <div class="col-md-2 col-lg-2">
                                    <small>${ls_.siimov_desc} <span class="badge rounded-pill" style="color: #FFFFF; background: #20A789;">Nomina: ${ls_.name_nomina}</span></small> 
                                </div>
                               
                                <div class="col-md-2 col-lg-2" style="text-align:end;"> 
                                    <small  style="margin-right:50px;font-weight: bolder;"> ${ls_.siimov_tipo == 'CARGO' ? '-' : '  '} $ ${new Intl.NumberFormat('en-DE').format(ls_.siimov_total.replace(',','.'))} </small>
                                </div>
                                <div class="col-md-2 col-lg-2">
                                    <strong class="badge rounded-pill" style="color: ${ls_.siimov_tipo == 'CARGO' ? '#F47975' : '#4EC275'}; background: ${ls_.siimov_tipo == 'CARGO' ? '#FCD7D6' : '#DDFFDA'};"> ${ls_.siimov_tipo.toLowerCase()} </strong>
                                </div>
                                <div class="col-md-2 col-lg-2 align-items-center" style="text-align:center;"> 
                                    <span  style="font-weight: bolder;">${ls_.siimov_fecha}</span>
                                </div>
                                <div class="col-md-2 col-lg-2 align-items-right estado"> 
                                    <span class="${cs}" style="font-weight: bolder;">${ls_.conciliado ? 'CONCILIADO' : ls_e.length ? `Coincidencias (${ls_e.length})` : 'Sin coincidencias'}</span>
                                </div>
                                
                                <div class="col-md-1 col-lg-1 align-items-right icon-estado">
                                    <i class="fa ${ls_.conciliado ? 'fa-check-square' : 'fa-list'} fa-2x ${cs}" aria-hidden="true"></i>
                                </div>
                            
                               
                            </button>

                            
                        </div> 
                        <div class="row justify-content-end">
                            <div class="checkbox-container col-md-1 col-lg-1 align-items-right icon-estado">
                                <div class="form-check form-switch">
                                <input class="form-check-input check-comp" type="checkbox" data-id="${ls_.id_nomina}" role="switch" onchange="checkGroup(event)">
                                </div>
                            </div>
                        </div>
                        
                        
                    </div>
                  
                    <div id="panelsStayOpen-collapse${o}-${ls_.iddoc}" class="accordion-collapse collapse ${s_.find ? 'show' : ''}" aria-labelledby="panelsStayOpen-heading${o}-${ls_.iddoc}">
                        <div class="accordion-body">
                            <div class="accordion" id="accordionPanelsStayOpen-${o}-${ls_.iddoc}">`



            // let findButton = `<div class=" col-md-6 col-lg-6 align-items-center" style="display: grid;"> 
            //                     <label  class="" disabled></label>
            //                     <button ${ls_.conciliado ? 'disabled' : ''} type="button" style="font-weight:bold;" class="btn btn-outline-warning find-seat ${ls_.conciliado ? 'conciliado' : ''} create" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse${o}_${o}_${o}_-${ls_.iddoc}" aria-expanded="false" aria-controls="panelsStayOpen-collapse${o}_${o}_${o}_-${ls_.iddoc}">Crear asiento contable</button>
            //                 </div>
            //                 <div class=" col-md-1 col-lg-1 align-items-center" style="display: grid;">
            //                     <hr class="v-sep">
            //                 </div>
            //                 <div class=" col-md-5 col-lg-5 align-items-center" style="display: grid;">
            //                     <button  ${ls_.conciliado ? 'disabled' : ''} type="button" style="font-weight:bold;" class="btn btn-outline-info find-seat  ${ls_.conciliado ? 'conciliado' : ''}" data-id="${ls_.iddoc}"   data-bs-toggle="modal" data-bs-target="#modalmatch">Otras coincidencias...</button>
            //                 </div>`


            // ls += `<div class="accordion-item" style="border-color: white;">
            //     <div class="accordion-header row  align-items-center" id="panelsStayOpen-heading${o}_${o}_${o}-${ls_.iddoc}">
            //         ${s_.find ? '' : findButton}       
            //     </div>
            //     <div id="panelsStayOpen-collapse${o}_${o}_${o}_-${ls_.iddoc}" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-heading${o}_${o}_${o}-${ls_.iddoc} style="">
            //         <div class="accordion-body accordion-main-${ls_.iddoc}" data-id="${ls_.iddoc}" style="padding: 30px; background: #f6f8f9;border-radius: 30px;">
            //             <div class="form-floating row" style ="margin:20px">
            //                 <div class="col-10">
            //                     <label for="floatingTextarea2">Descripción...</label>
            //                     <textarea class="form-control ref" placeholder="" id="floatingTextarea2" style="height: 60px">${ls_.siimov_desc}</textarea>
			//                 </div>
            //                 <div class="col-2">
            //                     ${select_tipos}
			//                 </div>
            //             </div>
            //             <div class="row" style="margin-bottom: 30px; background: black; color:white;font-weight: bold;">
            //                 <div class="col-md-3">
            //                     <span>Cuenta Contable</span>
            //                 </div>
            //                 <div class="col-md-3">
            //                     <span>Nombre cuenta</span>
            //                 </div>
            //                 <div class="col-md-2">
            //                     <span>Debe</span>
            //                 </div>
            //                 <div class="col-md-2">
            //                     <span>Haber</span>
            //                 </div>
            //                 <div class="col">
            //                     <span></span>
            //                 </div>
            //             </div>
            //             <div class="row" style="margin-bottom:10px;">
            //                 <div class="col-md-3">
            //                     <input class="form-control" type="text" value="${ls_.cuenta_contable}" aria-label="" data-id="${ls_.iddoc}" disabled readonly>
            //                 </div>
            //                 <div class="col-md-3">
            //                     <input class="form-control" type="text" value="${ls_.nombre_cuenta}" aria-label=""  disabled readonly>
            //                 </div>
            //                 <div class="col-md-2">
            //                     <input class="form-control" type="text" value="${ls_.debe}" aria-label="" data-id="${ls_.iddoc}" disabled readonly>
            //                 </div>
            //                 <div class="col-md-2">
            //                     <input class="form-control" type="text" value="${ls_.haber}" aria-label="" data-id="${ls_.iddoc}" disabled readonly>
            //                 </div>
            //                 <div class="col">
            //                     <button type="button" style="float: right! important; color:#34CC02;" class="btn" disabled><i class="fa fa-check-circle"></i></button>
            //                 </div>
            //             </div>
            //             <div class="row">
            //                 <div class="col-md-3">
            //                     <input class="form-control num-account" type="text" value="" aria-label="" disabled readonly>
            //                 </div>
            //                 <div class="col-md-3">
            //                     ${select_cuentas}
            //                 </div>
            //                 <div class="col-md-2">
            //                     <input class="form-control" type="text" value="${ls_.haber}" aria-label="" data-id="${ls_.iddoc}" oninput="onInputCheckEmptyAndFormat(this)" onkeydown="onEnterPressed(event,this)" onblur="onBlurRestoreZero(event,this)" onfocus="onFocusClearZero(event,this)">
            //                 </div>
            //                 <div class="col-md-2">
            //                     <input class="form-control" type="text" value="${ls_.debe}" aria-label="" data-id="${ls_.iddoc}" oninput="onInputCheckEmptyAndFormat(this)" onkeydown="onEnterPressed(event,this)" onblur="onBlurRestoreZero(event,this)" onfocus="onFocusClearZero(event,this)">
            //                 </div>
            //             </div>

            //             <div class="row mt-2 row-totales">
            //                 <div class="col-md-3">
            //                 </div>
            //                 <div class="col-md-3">
            //                     <span class="badge rounded-pill bg-light text-dark" style="font-size: 15px;">Total:</span>
            //                 </div>
            //                 <div class="col-md-2">
            //                     <span class="badge rounded-pill bg-light text-dark total_debe" style="font-size: 15px;">${ls_.debe > 0 ? ls_.debe : ls_.haber }</span>
            //                 </div>
            //                 <div class="col-md-2">
            //                     <span class="badge rounded-pill bg-light text-dark total_haber" style="font-size: 15px;">${ls_.haber > 0 ? ls_.haber : ls_.debe}</span>
            //                 </div>
            //                 <div class="col" style="cursor: pointer;">
            //                 </div>
            //                 <div class="col">
            //                 </div>
            //             </div>
            //             <div class="row" style="margin-top: 40px;">
            //                 <div class="col">
            //                     <button data-id="${ls_.iddoc}" style="width: max-content;float: right! important; background:#884d79;font-weight:bold;" class="btn btn-success conciliador create" type="button">Crear y Conciliar</button>
            //                 </div>
            //             </div>
            //         </div>

            //     </div>
            // </div>
            // <div class="accordion-item complette-comp">
                
            // </div>`

            if (ls_e.length > 0) {

                ls_e.forEach((l_ele, i) => {
                    
                    let findButton2 = ``

                    if (s_.find)
                        findButton2 = `<div class="form-check form-switch">
                                            <input class="form-check-input check-comp2" data-idcomp="${l_ele.idoc}" data-id="${ls_.iddoc}"  data-total="${l_ele.debe}" type="checkbox" role="switch" id="flexSwitchCheckDefault" onchange="sumTotal(event)">
                                        </div>`
                    else
                        findButton2 = `<button type="button" data-total="${l_ele.debe}" data-idcomp="${l_ele.idoc}" data-id="${ls_.iddoc}" style="background-color: #f2f4f5 !important;" class="btn conciliador"><i class="other fa fa-check-circle fa-2x ${ls_.conciliado ? 'green' : ''}"></i></button>`

                    ls += `<div class="accordion-item accordion-detail-${l_ele.idoc}">
                            <div class="accordion-header row  align-items-center" style="background-color: #f2f4f5 !important; background-color: grey;
                                    border-block: inherit;
                                    border: 1px solid grey;
                                    border-radius: 12px;">
                                <div class=" col-md-11 col-lg-11"  id="panelsStayOpen-heading${o}_${i}-${l_ele.idoc}">
                                    <div class="row"> 
                                        <button class="accordion-button comprobante collapsed"  data-id="${s_.find ? 'find-' : ''}${ls_.iddoc}-${l_ele.idoc}" data-idcomp="${l_ele.idoc}" style=" margin-right:10px;background-color: #f2f4f5  !important;" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse${o}_${i}-${l_ele.idoc}" aria-expanded="false" aria-controls="panelsStayOpen-collapse${o}_${i}-${l_ele.idoc}">
                                            <div class=" col-md-2 col-lg-2">  
                                                <strong style="margin-right:20px"><a onclick="toComprobante(event,this)" href="#" data-id="${l_ele.idoc}">Asiento #${l_ele.folio}</a></strong><br>
                                                <small style="margin-right:20px">${l_ele.fecha_emision} </small>
                                            </div>
                                            <div class=" col-md-6 col-lg-6"  style="margin-right:20px"> 
                                                <small style="">${l_ele.referencia}</small>
                                            </div>
                                            <div class=" col-md-2 col-lg-2  align-items-right"> 
                                                <span  style="font-weight: bolder;margin-right:20px;">DEBE</span>  <small  style="font-weight: bolder;" class="total-debe">$${formatearNumero(l_ele.debe)} </small>
                                            </div>
                                            <div class=" col-md-2 col-lg-2  align-items-right"> 
                                                <span  style="font-weight: bolder;margin-right:20px;">HABER</span>  <small  style="font-weight: bolder;" class="total-haber">$${formatearNumero(l_ele.haber)} </small>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                                <div class="col-md-1 col-lg-1"  style="background-color: #f2f4f5  !important;">
                                    ${findButton2}
                                </div>
                            </div>
                            
                            <div id="panelsStayOpen-collapse${o}_${i}-${l_ele.idoc}" class="accordion-collapse collapse  " aria-labelledby="panelsStayOpen-heading${o}_${i}-${l_ele.idoc}">
                                <div class="accordion-body body_comprobante"  data-id="${s_.find ? 'find-' : ''}${ls_.iddoc}-${l_ele.idoc}" data-idcomp="${l_ele.idoc}">
                                </div>
                            </div>
                        </div>`

                });

            }
            ls += `</div>
                    </div>
                </div>
            </div>`;
        }

        let selector = `<div class="accordion" id="accordionPanelsStayOpen">`



        if (s_.bloques.length > 0)
            s_.bloques.forEach((l_e, o) => genSelector(l_e, o));

        selector += `${ls}<div>`

        return selector


    },
    comprobante: (c_) => {

        let ls = ''

        c_.details.forEach((l_ele, i) => {

            ls += ` <div class="row" style="margin-bottom:10px;">
                    <div class="col-md-3">
                        <input class="form-control" type="text" value="${l_ele.codigoCuenta}" aria-label="" disabled readonly>
                    </div>
                    <div class="col-md-3">
                        <input class="form-control" type="text" value="${l_ele.cuentaContable}" aria-label="" disabled readonly>
                    </div>
                    <div class="col-md-2">
                        <input class="form-control" type="text" value="${l_ele.debe}" aria-label="" disabled readonly>
                    </div>
                    <div class="col-md-2">
                        <input class="form-control" type="text" value="${l_ele.haber}" aria-label="" disabled readonly>
                    </div>
                    <div class="col">
                        <button type="button" style="color:#34CC02;" class="btn" disabled><i class="fa fa-check-circle"></i></button>
                    </div>
                </div>`

        });

        let htmlObj = ` <div class="row" style="margin-bottom: 30px; background: black; color:white;font-weight: bold;">
                            <div class="col-md-3">
                                <span>Cuenta Contable</span>
                            </div>
                            <div class="col-md-3">
                                <span>Nombre cuenta</span>
                            </div>
                            <div class="col-md-2">
                                <span>Debe</span>
                            </div>
                            <div class="col-md-2">
                                <span>Haber</span>
                            </div>
                            <div class="col">
                                <span></span>
                            </div>
                        </div>`;

        return htmlObj + ls

    }
}

// Función para mostrar el diálogo de selección de contactos
window.showDialogContact = function(object) {
    // Se guarda el botón que abre modal
    localStorage.setItem("id_detalle_comp", object.dataset.id);

    let id = object.dataset.id
    createContactModal()
    loadContactsBootstrap('', id)
}



// Función para crear el modal de Bootstrap
function createContactModal() {
    // Verificar si el modal ya existe
    let existingModal = document.getElementById('contactModal');
    if (existingModal) {
        // Si ya existe, mostrarlo
        try {
            const bootstrapModal = new bootstrap.Modal(existingModal);
            bootstrapModal.show();
        } catch (error) {
            console.error('Error showing existing modal:', error);
            // Fallback: mostrar el modal manualmente
            existingModal.style.display = 'block';
            existingModal.classList.add('show');
        }
        return;
    }
    
    // Crear el modal HTML
    let modalHTML = `
        <div class="modal fade" id="contactModal" tabindex="-1" aria-labelledby="contactModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="contactModalLabel">SELECCIONAR CONTACTO</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <input type="text" id="contactSearch" class="form-control" placeholder="Buscar contacto...">
                        </div>
                        <div id="contactList" style="max-height: 400px; overflow-y: auto;">
                            <div class="text-center text-muted">Cargando contactos...</div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" id="assignContactBtn">Asignar contacto</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Agregar el modal al body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Mostrar el modal
    try {
        let modal = new bootstrap.Modal(document.getElementById('contactModal'));
        modal.show();
    } catch (error) {
        console.error('Error creating Bootstrap modal:', error);
        // Fallback: mostrar el modal manualmente
        const modalElement = document.getElementById('contactModal');
        modalElement.style.display = 'block';
        modalElement.classList.add('show');
    }
}

// Función para cargar contactos en el modal de Bootstrap
function loadContactsBootstrap(searchTerm = '', buttonId = '') {
    // Usar el endpoint correcto que usa asientos
    fetch(`/4DACTION/_light_get_contactos?page=1&results=100&q=${encodeURIComponent(searchTerm)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        let contactList = document.getElementById('contactList');
        contactList.innerHTML = '';
        
        if (data.rows && data.rows.length > 0) {
            // Crear tabla para mostrar contactos
            let table = document.createElement('table');
            table.className = 'table table-striped table-hover';
            
            let thead = document.createElement('thead');
            thead.innerHTML = '<tr><th>RUT</th><th>Razón Social</th><th>Email</th><th>Seleccionar</th></tr>';
            
            let tbody = document.createElement('tbody');
            
            // Función para renderizar contactos
            function renderContacts(contacts) {
                tbody.innerHTML = '';
                if (contacts && contacts.length > 0) {
                    contacts.forEach(function(contact) {
                        let row = document.createElement('tr');
                        row.style.cursor = 'pointer';
                        row.dataset.id = contact.id;
                        row.dataset.rut = contact.rut || '';
                        row.dataset.nombre = contact.razon || contact.nombre_completo || '';
                        
                        row.innerHTML = `
                            <td>${contact.rut || 'Sin RUT'}</td>
                            <td>${contact.razon || contact.nombre_completo || 'Sin nombre'}</td>
                            <td>${contact.email || 'Sin email'}</td>
                            <td><input type="checkbox" class="form-check-input select-contact"></td>
                        `;
                        
                        row.addEventListener('click', function() {
                            tbody.querySelectorAll('input.select-contact').forEach(cb => cb.checked = false);
                            this.querySelector('input.select-contact').checked = true;
                        });
                        
                        tbody.appendChild(row);
                    });
                } else {
                    tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No se encontraron contactos</td></tr>';
                }
            }
            
            // Renderizar contactos iniciales
            renderContacts(data.rows);
            
            table.appendChild(thead);
            table.appendChild(tbody);
            contactList.appendChild(table);
            
            // Configurar búsqueda en tiempo real
            const searchInput = document.getElementById('contactSearch');
            if (searchInput) {
                searchInput.addEventListener('input', function() {
                    let searchTerm = this.value;
                    console.log('Búsqueda iniciada con término:', searchTerm);
                    
                    // Realizar búsqueda en el servidor
                    fetch(`/4DACTION/_light_get_contactos?page=1&results=100&q=${encodeURIComponent(searchTerm)}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Respuesta de búsqueda:', data);
                        renderContacts(data.rows);
                    })
                    .catch(error => {
                        console.error('Error en búsqueda:', error);
                        tbody.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Error en la búsqueda</td></tr>';
                    });
                });
            }
            
            // Manejar el botón de asignar contacto
            // Manejar el botón de asignar contacto
            const assignBtn = document.getElementById('assignContactBtn');
            assignBtn.onclick = null;
            assignBtn.onclick = function () {
                let selectedRow = tbody.querySelector('input.select-contact:checked')?.closest('tr');
                if (!selectedRow) {
                    alert('Debe seleccionar un contacto');
                    return;
                }
                
                let contactData = {
                    id: selectedRow.dataset.id,
                    rut: selectedRow.dataset.rut,
                    nombre: selectedRow.dataset.nombre
                };
                
                window.updateSelectedContact(contactData);
                
                // Cerrar el modal
                let modal = bootstrap.Modal.getInstance(document.getElementById('contactModal'));
                modal.hide();
                
                // Mostrar mensaje de éxito
                if (typeof toastr !== 'undefined') {
                    toastr.success("Se asignó correctamente!");
                }
            };
            
        } else {
            contactList.innerHTML = '<div class="text-center text-muted">No se encontraron contactos</div>';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('contactList').innerHTML = '<div class="text-center text-danger">Error al cargar contactos</div>';
    });
}

// Función para cargar contactos en el diálogo
function loadContactsDialog(dialog) {
    $.ajax({
        url: '/4DACTION/_light_get_contactos',
        data: {
            page: 1,
            results: 100,
            q: ''
        },
        dataType: 'json',
        success: function(data) {
            let contactList = dialog.find('#contactList');
            contactList.empty();
            
            if (data.rows && data.rows.length > 0) {
                // Crear tabla para mostrar contactos
                let table = $('<table class="table table-striped table-hover" style="margin: 0;">');
                let thead = $('<thead><tr><th>RUT</th><th>Razón Social</th><th>Email</th><th>Seleccionar</th></tr></thead>');
                let tbody = $('<tbody></tbody>');
                
                data.rows.forEach(function(contact) {
                    let row = $(`
                        <tr style="cursor: pointer;" data-id="${contact.id}" data-rut="${contact.rut || ''}" data-nombre="${contact.razon || contact.nombre_completo || ''}">
                            <td>${contact.rut || 'Sin RUT'}</td>
                            <td>${contact.razon || contact.nombre_completo || 'Sin nombre'}</td>
                            <td>${contact.email || 'Sin email'}</td>
                            <td><input type="checkbox" class="select-contact"></td>
                        </tr>
                    `);
                    
                    row.click(function() {
                        // Deseleccionar todos los checkboxes
                        tbody.find('input.select-contact').prop('checked', false);
                        // Seleccionar el checkbox de la fila clickeada
                        $(this).find('input.select-contact').prop('checked', true);
                    });
                    
                    tbody.append(row);
                });
                
                table.append(thead, tbody);
                contactList.append(table);
                
                // Implementar búsqueda en tiempo real usando el endpoint correcto
                dialog.find('#contactSearch').on('input', function() {
                    let searchTerm = $(this).val();
                    
                    // Si el término de búsqueda está vacío, mostrar todos los contactos
                    if (searchTerm.trim() === '') {
                        tbody.find('tr').show();
                        return;
                    }
                    
                    // Realizar búsqueda en el servidor usando el mismo endpoint que asientos
                    $.ajax({
                        url: '/4DACTION/_light_get_contactos',
                        data: {
                            page: 1,
                            results: 100,
                            q: searchTerm
                        },
                        dataType: 'json',
                        success: function(data) {
                            // Limpiar la tabla
                            tbody.empty();
                            
                            if (data.rows && data.rows.length > 0) {
                                data.rows.forEach(function(contact) {
                                    let row = $(`
                                        <tr style="cursor: pointer;" data-id="${contact.id}" data-rut="${contact.rut || ''}" data-nombre="${contact.razon || contact.nombre_completo || ''}">
                                            <td>${contact.rut || 'Sin RUT'}</td>
                                            <td>${contact.razon || contact.nombre_completo || 'Sin nombre'}</td>
                                            <td>${contact.email || 'Sin email'}</td>
                                            <td><input type="checkbox" class="select-contact"></td>
                                        </tr>
                                    `);
                                    
                                    row.click(function() {
                                        // Deseleccionar todos los checkboxes
                                        tbody.find('input.select-contact').prop('checked', false);
                                        // Seleccionar el checkbox de la fila clickeada
                                        $(this).find('input.select-contact').prop('checked', true);
                                    });
                                    
                                    tbody.append(row);
                                });
                            } else {
                                tbody.html('<tr><td colspan="4" class="text-center text-muted">No se encontraron contactos</td></tr>');
                            }
                        },
                        error: function() {
                            tbody.html('<tr><td colspan="4" class="text-center text-danger">Error en la búsqueda</td></tr>');
                        }
                    });
                });
                
                // Agregar botón de asignar contacto
                dialog.dialog('option', 'buttons', {
                    'Cancelar': function() {
                        $(this).dialog('close');
                    },
                    'Asignar contacto': function() {
                        let selectedRow = tbody.find('input.select-contact:checked').closest('tr');
                        if (selectedRow.length === 0) {
                            alert('Debe seleccionar un contacto');
                            return;
                        }
                        
                        let contactData = {
                            id: selectedRow.data('id'),
                            rut: selectedRow.data('rut'),
                            nombre: selectedRow.data('nombre')
                        };
                        
                        window.updateSelectedContact(contactData);
                        $(this).dialog('close');
                        
                        if (typeof toastr !== 'undefined') {
                            toastr.success("Se asignó correctamente!");
                        }
                    }
                });
                
            } else {
                contactList.html('<div style="padding: 20px; text-align: center; color: #666;">No se encontraron contactos</div>');
            }
        },
        error: function() {
            dialog.find('#contactList').html('<div style="padding: 20px; text-align: center; color: #d32f2f;">Error al cargar contactos</div>');
        }
    });
}

// Función para actualizar el contacto seleccionado (siguiendo el patrón de Asientos)
window.updateSelectedContact = function (contactData) {
    try {
        // Obtener el ID del botón que fue presionado
        const pressedButtonId = localStorage.getItem("id_detalle_comp");
        if (!pressedButtonId) {
            return;
        }

        // Buscar el botón específico que fue presionado
        const button = document.querySelector(`button[data-id="${pressedButtonId}"].search-btn`);
        if (!button) {
            return;
        }

        // Encontrar el contenedor padre (.contacto-cell)
        const container = button.closest('.contacto-cell');
        if (!container) {
            return;
        }

        // Actualizar el atributo data-idcont
        container.dataset.idcont = contactData.id;

        // asegurarse que exista el lugar donde mostrar info
        let box = container.querySelector('.contact-data-row');
        if (!box) {
            box = document.createElement('div');
            box.className = 'contact-data-row';
            container.appendChild(box);
        }

        const rut = contactData.rut || 'NO TIENE RUT';
        const nombre = contactData.nombre || '';

        // Reemplazar el contenido del contenedor manteniendo el ID del botón original
        container.innerHTML = `
            <div>
                <button class="search-btn"
                        data-type="auxiliar"
                        data-id="${pressedButtonId}"
                        onClick="showDialogContact(this)"
                        title="Cambiar contacto"
                        style="font-size: 12px; padding: 2px 4px; display: inline-block;">
                <i class="fas fa-search"></i>
                </button>
                <span readonly name="auxiliar_rut_${contactData.id}">${rut}</span><br>
                <span readonly name="auxiliar_desc_${contactData.id}">${nombre}</span>
            </div>
            <div class="contact-data-row"></div>
        `;

        // limpiar
        localStorage.removeItem("id_detalle_comp");

    } catch (error) {
        console.error('Error updating selected contact:', error);
    }
}
