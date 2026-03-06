function updateCuenta() {
    id_cuenta = document.getElementById("select_cuentas").value;
}

async function getCuentaContable() {
    const response = await fetch('/4DACTION/_V3_getParamContable');
    const cuentas = await response.json();
    return cuentas;
}

async function getCategorias() {
    return $.ajax({
        url: '/4DACTION/_V3_getCategoria',
        dataType: 'json',
        data: {
            q: ''
        },
    });
}

$(".tablecatalogo").on('change', '.update_categoria', function (event) {
    let row = $(this).closest('tr').index();
    let sel_cuentas = $('option:selected', this).val();
    var terf = document.getElementById('catalogo');
    var firstChilds = terf.querySelectorAll("td:first-child");
    let id_imp = firstChilds[row].innerHTML;

    $.ajax({
        url: "/4DACTION/_light_setServicios",
        type: "POST",
        dataType: "json",
        data: {
            'id_servicio': id_imp,
            'id_categoria': sel_cuentas
        },
        success: function (data) {
            generarAvisoExitoso("Categoria actualizada correctamente");
        },
        error: function (xhr, text, error) {
            generarAvisoError("Error al actualizar categoria");
        }
    });
    event.stopImmediatePropagation();
});

$(".tablecatalogo").on('change', '.update_contable', function (event) {
    let row = $(this).closest('tr').index();
    let sel_cuentas = $('option:selected', this).val();

    var currentRow = $(this).closest("tr");
    var data = $('#catalogo').DataTable().row(currentRow).data();
    let id_imp = data['id'];

    $.ajax({
        url: "/4DACTION/_light_setServicios",
        type: "POST",
        dataType: "json",
        data: {
            'id_servicio': id_imp,
            'id_cuenta': sel_cuentas
        },
        success: function (data) {
            generarAvisoExitoso("Cuenta actualizada correctamente");
        },
        error: function (xhr, text, error) {
            generarAvisoError("Error al actualizar cuenta contable");
        }
    });

    event.stopImmediatePropagation();
});

document.addEventListener("DOMContentLoaded", async () => {
    let cuentas = [];
    let categorias = [];
    try {
        cuentas = await getCuentaContable();
        categorias = await getCategorias();

        loadingLoad('loading-modal', true, 'Cargando cuentas..');
        $.ajax({
            'url': '/4DACTION/_V3_getProducto?all=true&q=2',
            dataType: 'json'
        }).done(function (data) {
            $('#catalogo').dataTable({
                "drawCallback": function (settings) {
                    $(".selectpicker").selectpicker();
                },
                //Blfrtip
                dom: "<'col'" +
                    "<'row'" +
                    "<'col-sm-12'B>" +
                    ">" +
                    "<'row'" +
                    "<'col-sm-6'l>" +
                    "<'col-sm-6'f>" +
                    ">" +
                    "<'row dt-table'" +
                    "<'col-sm-12'rt>" +
                    ">" +
                    "<'row'" +
                    "<'col-sm-6'i>" +
                    ">" +
                    "<'row'" +
                    "<'col-sm-12'p>" +
                    ">" +
                    ">",
                buttons: [
                    {
                        extend: 'colvis',
                        text: '<i class="fas fa-eye"></i>',
                        className: 'btn btn-outline-info btn-lg',
                        titleAttr: 'Visualizar columnas',
                        collectionLayout: 'fixed three-column',
                        postfixButtons: ['colvisRestore']
                    },

                ],

                "language": {
                    "url": "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
                },
                "aaData": data.rows,
                "columns": [
                    {
                        "data": "id",
                        visible: false,
                    },
                    {
                        "data": "text"
                    },
                    {
                        "data": "categoria.text",
                        "render": function (data, type, rows, meta) {
                            let selectop = '';
                            selectop = '<select class="form-control selectpicker update_categoria" data-live-search="true" id="select_categorias" required>';
                            for (let value of categorias.rows) {
                                //Si tiene una categoria igual al listado "categorias"
                                selectop += `<option value="${value.id}" ${rows.categoria.text == value.text ? 'selected' : ''}>${value.text}</option>`;
                            }
                            selectop += '</select>';
                            return selectop;
                        },
                    },
                    {
                        "data": "codigo_cuenta_contable",
                        "render": function (data, type, rows, meta) {
                            //rows.codigo_cuenta_contable
                            let selectop = '';
                            selectop = '<select class="form-control selectpicker update_contable" data-live-search="true" required>';
                            for (let value of cuentas.rows) {
                                selectop += `<option value="${value.number}" data-subtext="${value.number}" ${rows.codigo_cuenta_contable == value.number ? 'selected' : ''}>${value.name}</option>`;
                            }
                            if (!rows.codigo_cuenta_contable) {
                                selectop += `<option selected>Sin cuenta</option>`;
                            }
                            selectop += '</select>';
                            return selectop;


                        },
                    }
                ],
                "columnDefs": [
                    { "targets": [2, 3], "searchable": false }
                ]

            });

            loadingLoad('loading-modal', false);


        });

    } catch (e) {

        console.log("Error" + e);

    }
});

$('#catalogo').on('keyup change', function () {
    oTable.column(1).search($(this).val()).draw();
});



function setServicio() {
    let sv_nombre = document.getElementById('sb_tipo').value;
    let sv_codigo = document.getElementById('sb_name').value;
    let sv_categoria = document.getElementById('sb_valor').value;
    let sv_precio = document.getElementById('sb_form_percent').value;
    let sv_costo = document.getElementById('sb_percent').value;
    let sv_preciouf = document.getElementById('sb_subtotal').value;
    let sv_costouf = document.getElementById('sb_total').value;
    let sv_margen = document.getElementById('sb_subtotalcontinuo').value;
    let sv_tipo = document.getElementById('sb_info').value;
    let sv_obs_cliente = document.getElementById('sb_ajuste').value;
    let sv_obs_internas = document.getElementById('sb_cerrado').value;
    let sv_marca = document.getElementById('sb_editable').value;
    let sv_unidad = document.getElementById('sb_real').value;
    let sv_nserie = document.getElementById('sb_real').value;
    let sv_contable = document.getElementById('sb_real').value;




}
