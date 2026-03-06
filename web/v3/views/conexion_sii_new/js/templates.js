


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

            `<div class="input-group mb-3">
                <label class="input-group-text" for="select${s_.id}">${s_.label_name}</label>
                <select class="form-select" id="select${s_.id}" idelement="${s_.id}" idelement2="${s_.id0}">
                    <option id="0">TODOS</option>`;

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
                let ls_ad = `<div class="row">`;

                ls_ad_e.forEach(ls_ad_e_e => {
                    ls_ad += '<div class="col">' + ls_ad_e_e + '</div><br>';

                })


                return ls_ad+'</div>';
            }



            ls_e.forEach(function (l_ele) {
                
                //${l_ele.adicional.length > 0 ? genAdicional(l_ele.adicional) : ''} 

                ls += `<hr>`;
                let steps= "";

                ls += `<li class="list-group-item  justify-content-between align-items-start">
                
                
                <div class="ms-2 row" style="" >
                
                    <div class="ms-2 row ${l_ele.class1}" id="stepdiv1${l_ele.id}" style="" >
                    <div style="margin-bottom: 50px;">${l_ele.button1.length > 0 ? genAdicional([l_ele.button1[0],l_ele.button2[0]]) : ''} </div>
                            <div class="col-md-8 col-lg-5">
                                <div class="fw-bold"> ${l_ele.link1}</div>
                                 <div><p style="word-break: normal;">${l_ele.l1}  /  ${l_ele.l2}</p></div>
                                  <div><p style="word-break: normal;">${l_ele.l3}</p></div>
                            </div>
                           
                            <div class="fw-bold  justify-content-end col-md-4 col-lg-2" style="">  
                                <span style="font-size: 15px;"> ${typeof l_ele.l4 === 'string' ? l_ele.l4 : '$' + new Intl.NumberFormat("de-DE").format(l_ele.l4)}</span> 
                            </div>
                            
                            <div class="justify-content-end col-md-12 col-lg-1" style="">  
                            ${l_ele.l5}
                            </div>
                        </div>

                </div>`;

                if(l_ele.steps){
                    steps = `<div class="ms-2 row ${l_ele.class1}" id="stepdiv2${l_ele.id}" style="display: none">
                    <div style="margin-bottom: 50px;"> ${l_ele.button1.length > 0 ? genAdicional([l_ele.button1[1],l_ele.button2[1]]) : ''}  </div>
                        <div class="justify-content-end col-md-12 col-lg table-container-${l_ele.id}" style=""> 
                               
                                
                            </div>        
                        </div>
    
                 </div>
    
                 <div class="ms-2 row ${l_ele.class1}" id="stepdiv3${l_ele.id}" style="display: none">
                 <div style="margin-bottom: 50px;"> ${l_ele.button1.length > 0 ? genAdicional([l_ele.button1[2],l_ele.button2[2]]) : ''}  </div>
                     <div class="justify-content-end col-md-12 col-lg table-container-items-${l_ele.id}" style=""> 
                            
                            
                        </div>        
                    </div>
                     

    
                 </div>
                 
                 
                 <div class="ms-2 row ${l_ele.class1}" id="stepdiv4${l_ele.id}" style="display: none">
                 <div style="margin-bottom: 50px;"> ${l_ele.button1.length > 0 ? genAdicional([l_ele.button1[3],l_ele.button2[3]]) : ''}  </div>
                     <h1>STEP 4</h1>
                     <div class="justify-content-end col-md-12 col-lg table-container-resumen-${l_ele.id}" style=""> 
                            
                            
                        </div>  

    
                 </div>`

                }

                ls += steps+ `</li>`;
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
    }
}


