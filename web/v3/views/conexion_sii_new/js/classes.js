class Card {
  constructor() {
    this.id = '';
    this.hasHeader = true;
    this.headerTitle = '';
    this.title = '';
    this.body1 = '';
    this.href = '';
  }
}

class Table {
  constructor() {
    this.id = '';
    this.headers = [];
    this.bodyRows = [];
  }
}

class Alert {
  constructor() {
    this.msg = '';
    this.type = 'success';
  }
}


class Select {
  constructor() {
    this.label_name = '',
      this.id = '',
      this.id0 = '',
      this.options = []
  }
}


class List {
  constructor() {
    this.bloques = [],
      this.adicional = []

  }
}

class DataTable {
  //Table
  element;
  items_table;
  type;
  copyItems;
  neg_selected;
  pagination;
  type_table;
  numberOfEntries; //Numero de entradas a mostrar

  constructor(type) {
    //this.element = document.querySelector(selector);
    this.headers = [];
    this.items_table = [];
    this.pagination = {
      total: 0,
      noItemsPerPage: 0,
      noPages: 0,
      actual: 0,
      pointer: 0,
      diff: 0,
      lastPageBeforeDots: 0,
      noButtonsBeforeDots: 4
    }
    this.type_table = type;

    this.neg_selected = [];
    this.numberOfEntries = 5; //Numero de entradas al inicio
  }

  startTable(iddtc, iditem = "") {
    if (this.type_table === 'neg') {
      getBusiness("a", filtro_fecha.children[1].value)
        .then(res => {
          if (res.data.records.total_records > 0) {
            let loops = res.data.records.total_records;
            let row = "";
            let datadb = res.data.data.rows.reverse();
            for (let i = 0; i < loops; i++) {

              row = datadb.pop();


              const item = {
                id: row.id,
                id_selector: iddtc,
                values: [row.folio, row.cliente, row.referencia, row.total_neto]
              }

              this.items_table.push(item);

            }
            //Iniciar tabla
            this.makeTable(iddtc)
            loadingLoad('loading-modal', false);
          }


        });
    } else {
      getItems(iditem)
        .then(res => {
          if (res.data.rows.length > 0) {

            res.data.rows.forEach(res_e => {



              const item = {
                id: res_e.llave,
                values: [res_e.ruta, res_e.nombre]
              }
              this.items_table.push(item);


            });
            //Iniciar tabla
            this.makeTable(iddtc)
          }
          loadingLoad('loading-modal', false);
        });
    }
  }

  makeTable(iddtc) {
    this.copyItems = [...this.items_table]; //Copyitems obtiene el mismo valor que tiene los items

    this.createHTML(iddtc);
    this.initPagination(this.items_table.length, this.numberOfEntries);
    this.renderRows(iddtc); //Construye las filas
    this.renderPagesButtons(iddtc); //Construye botones para paginacion
    this.renderSearch(); //Da accion a boton de busqueda

  }

  renderResumen(negocio_sel, id_selector) {
    let table_resumen = `<div class="container mt-5 px-2">

    <div class="mb-2 d-flex justify-content-between align-items-center">
        <div class="position-relative"> <span class="position-absolute search"></span> <input
                class="form-control w-100 search-input" placeholder="Buscador" id="search-neg-table" /> </div>
        <div class="px-2"> <span>Filters <i class="fa fa-angle-down"></i></span> <i
                class="fa fa-ellipsis-h ms-3"></i> </div>
    </div>
    ${negocio_sel.values[1]}
      <div class="table-responsive">
          <table class="table table-responsive table table-striped">
              <thead>
                  <tr class="bg-light">
                      <th scope="col" width="5%">Ruta</th>
                      <th scope="col" width="5%">Nombre</th>
                  </tr>
              </thead>
              <tbody>


              </tbody>
          </table>
      </div>
    </div>`;

    document.querySelector(`.table-container-resumen-${id_selector}`).innerHTML = table_resumen;


    this.element = document.querySelector(`.table-container-resumen-${id_selector}`)

    let data = ''
    this.neg_selected.forEach(cell => {
      data += `<td>${cell.values}</td>`;
    })
    this.element.querySelector('tbody').innerHTML += `<tr>${data}</tr>`
  }

  createHTML(id) {

    document.querySelector(`.${this.type_table === 'neg' ? 'table-container-' + id : 'table-container-items-' + id}`).innerHTML = `<div class="container mt-5 px-2">
        <div class="mb-2 d-flex justify-content-between align-items-center">
          <div class="row">
            <div class="col-6">
              <input class="form-control search-input" placeholder="Buscador" id="search-neg-table" data-id="${id}"/>
            </div>
            
            <div class="col-6">
              <input type="month" name="fecha" id="fecha" class="form-control" value="">
            </div>
          
          </div>
        </div>
        
        <div class="table-responsive">
            <table class="table-responsive table table-striped table-hover">
                <thead>
                    <tr class="bg-light">
                        <th scope="col" width="5%"></th>
                        <th scope="col" width="5%">${this.type_table === 'neg' ? 'Folio' : 'Ruta'}</th>
                        ${this.type_table === 'neg' ? '<th scope="col" width="5%">Cliente</th>' : ''}
                        <th scope="col" width="5%">${this.type_table === 'neg' ? 'Referencia' : 'Nombre'}</th>
                        ${this.type_table === 'neg' ? '<th scope="col" width="5%">Total</th>' : ''}
                    </tr>
                </thead>
                <tbody>


                </tbody>
            </table>

            <nav aria-label="Page navigation example">
                <ul class="pagination justify-content-end">

                </ul>
            </nav>
        </div>
    </div>`;

    this.element = document.querySelector(`.${this.type_table === 'neg' ? 'table-container-' + id : 'table-container-items-' + id}`)

  }

  renderRows(id_selector) {
    let tipo_tabla = `.${this.type_table === 'neg' ? 'table-container-' + id_selector : 'table-container-items-' + id_selector}`;
    //Vaciar el tbody antes de llenar nuevamente
    document.querySelector(`${tipo_tabla} table tbody`).innerHTML = '';
    let table = document.querySelector(`${tipo_tabla} table`);
    this.element = document.querySelector(`${tipo_tabla}`);
    let i = 0;
    const { pointer, total } = this.pagination;
    const limit = this.pagination.actual * this.pagination.noItemsPerPage; //Pagina actual = 1 y NoItemPerPage 5 = 5 Elementos por pagina

    for (i = pointer; i < limit; i++) {
      if (i === total) break;
      const { id, values } = this.copyItems[i];// array con los items de la bd
      const checked = this.isChecked(id, id_selector);
      let data = ''
      data += `<td class="table-checkbox">
              <input type="checkbox" class="form-check-input datatable-checkbox" data-id="${id}" data-selector="${id_selector}" ${checked ? "checked" : ""}/>
              </td>`;
      values.forEach(cell => {
        data += `<td>${cell}</td>`;
      })
      this.element.querySelector('tbody').innerHTML += `<tr>${data}</tr>`

      //listener para el checkbox
      this.element.querySelectorAll('.datatable-checkbox').forEach(checkbox => {
        //Se agrega el evento listener a cada checkbox
        checkbox.addEventListener('change', e => {

          const element = e.target;
          const id = element.getAttribute('data-id');
          let id_selector = element.getAttribute('data-selector');
          let flag_alert = false;
          if (element.checked) { //Si tiene la propiedad checke


            if (this.neg_selected.length >= 0) { //Es porque ya no hay algo seleccionado

              this.neg_selected.forEach(val => {
                if (val.id_selector === id_selector) {
                  flag_alert = true;
                }

              })

              if (flag_alert && this.type_table === 'neg') {
                element.checked = false;
                alertObj.type = 'danger';
                alertObj.msg = 'Solo puedes seleccionar 1 negocio!';
                alertLoad(alertObj, 'alertas-modal');
                return;
              }

              
              let item = this.getItem(id, id_selector);

              this.neg_selected.push(item);
              // if (this.type_table === 'neg') this.neg_selected = item; //Negocio seleccionado
            }
          } else {
            this.removeSelected(id_selector);
          }

        });

      });

    }
  }




  //id_selector es el que separa la tabla de otra
  //Obtener un item de una fila seleccionada
  getItem = (id, id_selector) => {
    
    let res
    if (this.type_table === 'neg') {
      res = this.items_table.filter(item => item.id_selector === id_selector && item.id === parseInt(id));
    } else {
      res = this.items_table.filter(item => item.id === id);
    }

    if (res.length === 0) return null;
    return res[0];
  }

  //Se remueve el elemento seeleccionado
  removeSelected(id) {

    let res;
    if (this.type_table === 'neg') {
      res = this.neg_selected.filter(item => item.id_selector != id);
    } else {
      res = this.neg_selected.filter(item => item.id != id);
    }
    this.neg_selected = [...res];
  }

  //Valida si el dato que se ve esta seleccionado o no
  isChecked(id, id_selector) {
    const items = this.neg_selected;
    let res = false;

    if (items.length === 0) return false;

    items.forEach(item => {
      if (item.id === id && item.id_selector === id_selector) res = true;
    })

    return res;

  }

  initPagination(total, entries) {
    this.pagination.total = total;
    this.pagination.noItemsPerPage = entries;
    this.pagination.noPages = Math.ceil(this.pagination.total / this.pagination.noItemsPerPage); //Esto obtiene el nro de pagina que se necesitan de acuerdo al nro de datos que se tienen
    this.pagination.actual = 1;
    this.pagination.pointer = 0;
    this.pagination.diff = this.pagination.noItemsPerPage - (this.pagination.total % this.pagination.noItemsPerPage);

  }

  //Construye botones de paginacion
  renderPagesButtons(iddtc) {
    //Referencia a la clase pages donde se colocan los botones para la paginacion
    let tipo_tabla = `.${this.type_table === 'neg' ? 'table-container-' + iddtc : 'table-container-items-' + iddtc}`;
    const pagesContainer = this.element.querySelector(`${tipo_tabla} .pagination`);
    let pages = '';
    const buttonsToShow = this.pagination.noButtonsBeforeDots;
    const actualIndex = this.pagination.actual; //Pagina actual

    //Limite inferior
    let limI = Math.max(actualIndex - 2, 1);
    let limS = Math.min(actualIndex + 2, this.pagination.noPages);
    const missinButton = buttonsToShow - (limS - limI); //Se sabe cuantos botones hace falta mostrar

    if (Math.max(limI - missinButton, 0)) {
      limI = limI - missinButton;
    } else if (Math.min(limS + missinButton, this.pagination.noPages) != this.pagination.noPages) {
      limS = limS + missinButton;
    }

    if (limS < (this.pagination.noPages - 2)) {
      pages += this.getIterateButtons(limI, limS, iddtc);
      pages += `<li class="page-item"><a class="page-link" data-id="${iddtc}" href="#">...</a></li>`;
      pages += this.getIterateButtons(this.pagination.noPages - 1, this.pagination.noPages, iddtc);
    } else {
      //Se muestra la ultima pagina
      pages += this.getIterateButtons(limI, this.pagination.noPages, iddtc);
    }

    pagesContainer.innerHTML = pages;

    this.element.querySelectorAll('.pagination li a').forEach(button => {
      button.addEventListener('click', e => {
        let iddtc = e.target.dataset.id;

        this.pagination.actual = parseInt(e.target.getAttribute('data-page'));
        this.pagination.pointer = (this.pagination.actual * this.pagination.noItemsPerPage) - this.pagination.noItemsPerPage;
        
        this.renderRows(iddtc); //Construye filas
        this.renderPagesButtons(iddtc); //Construye botones

      })
    })
  }

  renderSearch() {
    this.element.querySelector('.search-input').addEventListener('input', e => {
      const query = e.target.value.trim().toLowerCase();
      let id_search = e.target.dataset.id;
      if (query === '') {
        this.copyItems = [...this.items_table]
        this.initPagination(this.copyItems.length, this.numberOfEntries);
        this.renderRows(id_search);
        this.renderPagesButtons(id_search);
        return;
      }
      this.search(e);

      this.initPagination(this.copyItems.length, this.numberOfEntries);
      this.renderRows(id_search);
      this.renderPagesButtons(id_search);
    })

  }

  search(event) {

    const query = event.target.value.trim().toLowerCase();
    let id_search = event.target.dataset.id;
    let res = [];
    this.copyItems = [...this.items_table];
    for (let i = 0; i < this.copyItems.length; i++) {
      const { id, values } = this.copyItems[i];
      const row = values; //Values es un arreglo con textos
      for (let j = 0; j < row.length; j++) {
        const cell = row[j]; //J es el numero de columna que esta la coincidencia
        if (String(cell).toLowerCase().indexOf(query) >= 0) {
          res.push(this.copyItems[i]);
          break;
        }

      }
    }
    this.copyItems = [...res];
  }

  //Construye rango de botones segun un limite inferior y uno superior
  getIterateButtons(start, end, iddtc) {
    let res = '';
    // res += `<li class="page-item disabled">
    // 		<a class="page-link" href="#" tabindex="-1" aria-disabled="true">Anterior</a></li>`
    for (let i = start; i <= end; i++) {
      if (i === this.pagination.actual) {
        res += `<li class="page-item"><a class="page-link" href="#" data-id="${iddtc}" data-page="${i}">${i}</a></li>`
      } else {
        res += `<li class="page-item"><a class="page-link" href="#" data-id="${iddtc}" data-page="${i}">${i}</a></li>` //Pagina que se mostrarra
      }
    }
    // res += `<li class="page-item">
    // 		<a class="page-link" href="#">Siguiente</a></li>`
    return res;
  }

  getSelectedItems() {
    return this.neg_selected;
  }
}