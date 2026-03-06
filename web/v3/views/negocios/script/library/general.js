const generarChart = (gastop, gastor, chartid, total_neto = null) => {
    var densityCanvas = document.getElementById(chartid);
    
    let title, label1, label2, label3;
    switch (chartid) {

        case "utilidad-chart":
            {
                title = 'Utilidad final / Utilidad esperada'
                label1 = 'Utilidad final'
                label2 = 'Utilidad esperada'
                break;
            }

        case "presupuestado-chart":
            {
                title = 'Modelo / Control / Gasto Real'
                label1 = 'Control'
                label2 = 'Gasto real'
                label3 = 'Modelo'
                break;
            }
    }

    var coloR = [];
    var dynamicColors = function() {
        var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);
        return "rgb(" + r + "," + g + "," + b + ", 0.5)";
    };

    // Determinar cuántos colores necesitamos
    let colorCount = chartid === "presupuestado-chart" && total_neto !== null ? 3 : 2;
    for (i = 0; i < colorCount; i++) {
        coloR.push(dynamicColors());
    }

    // Preparar datos según el tipo de gráfica
    let chartData, chartLabels, borderColors;
    
    if (chartid === "presupuestado-chart" && total_neto !== null) {
        chartData = [total_neto, gastop, gastor];
        chartLabels = [label3, label1, label2];
        borderColors = [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)'
        ];
    } else {
        chartData = [gastop, gastor];
        chartLabels = [label1, label2];
        borderColors = [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)'
        ];
    }

    var densityData = {
        data: chartData,
        backgroundColor: coloR,
        borderColor: borderColors,
    };

    var barChart = new Chart(densityCanvas, {
        type: 'bar',
        data: {
            labels: chartLabels,
            datasets: [densityData]
        },
        options: {
            responsive: true,

            plugins: {
                labels: {
                    render: () => {}
                  },
                title: {
                    display: true,
                    text: title,
                    padding: {
                        top: 50,
                        bottom: 10
                    }
                },
                legend: {
                    display: false
                },
                datalabels: {
                    display: false,
                }
            },

            
        }



    });


}




/* Mostrar checklist */

var refreshChecklist = function() {
    $.ajax({
        url: '/4DACTION/_V3_getChecklistByNegocio',
        data: {
            id: $('section.sheet').data('id')
        },
        dataType: 'json',
        //async:false,
        success: function(data) {

            var populateChecklist = function(target, start, end) {
                target.empty();

                var current, htmlObject;

                for (var i = start; i < end; i++) {
                    current = data.rows[i];

                    htmlObject = $('<li><span><span></span> <em></em></span> <span></span></li>');

                    htmlObject.data('id', current.id);
                    htmlObject.find('> span:first-of-type > span').text(current.text);
                    if (typeof current.progress != 'undefined') {
                        htmlObject.find('> span:first-of-type > em').text('(' + current.progress.done + ' de ' + current.progress.total + ')');
                    }
                    htmlObject.find('> span:last-of-type').addClass('ui-icon');

                    if (current.value === true)
                        htmlObject.find('> span:last-of-type').addClass('ui-icon-check');
                    if (current.value === false)
                        htmlObject.find('> span:last-of-type').addClass('ui-icon-closethick');
                    if (current.value === null)
                        htmlObject.find('> span:last-of-type').addClass('ui-icon-minusthick');

                    target.append(htmlObject);
                }

            };

            var calcProgressChecklist = function(source) {

                var valid_steps = 0;
                var passed_steps = 0;
                var current;

                for (var i = 0; i < source.length; i++) {
                    current = source[i].value;
                    if (current !== null) {
                        valid_steps++;
                        if (current === true)
                            passed_steps++;
                    }
                }

                return passed_steps / valid_steps;
            };

            var first_column_size = Math.ceil(data.rows.length / 2);

            var first_target = $('section.sheet ul.checklist:first-of-type');
            var last_target = $('section.sheet ul.checklist:last-of-type');

            populateChecklist(first_target, 0, first_column_size);
            populateChecklist(last_target, first_column_size, data.rows.length);

            $('section.sheet .checklist').prevTo('h2').find('span:last-of-type').text(Math.round(calcProgressChecklist(data.rows) * 100, 0) + '% completado');

        }
    });
};



/* Mostrar resúmenes */

var refreshSummary = function() {

    /*$.ajax({
    	url: '/4DACTION/_V3_getSummaryByNegocio',
    	data: {
    		id: $('section.sheet').data('id')
    	},
    	dataType: 'json',
    	//async: false,
    	success: function(data) {
    		var target = $('section.sheet');

    		var current = data.rows[0].utilidad_costo;

    		var presupuestado = current.presupuestado;
    		console.log('utilidad presup. porcentual: ', presupuestado.utilidad.ratio);
    		target.find('[data-name="presupuestado-utilidad-value"]').text(presupuestado.utilidad.value.toFixed(0)).trigger('change');
    		//target.find('[data-name="presupuestado-utilidad-ratio"]').text(presupuestado.utilidad.ratio.toFixed(2)).trigger('change');
    		target.find('[data-name="presupuestado-utilidad-ratio"]').text((presupuestado.utilidad.ratio * 100).toFixed(2).toString().replace('.', ','));
    		target.find('[data-name="presupuestado-costo-value"]').text(presupuestado.costo.value.toFixed(0)).trigger('change');
    		//target.find('[data-name="presupuestado-costo-ratio"]').text(presupuestado.costo.ratio.toFixed(2)).trigger('change');
    		target.find('[data-name="presupuestado-costo-ratio"]').text((presupuestado.costo.ratio * 100).toFixed(2).toString().replace('.', ','));

    		var real = current.real;
    		target.find('[data-name="real-utilidad-value"]').text(real.utilidad.value.toFixed(0)).trigger('change');
    		//target.find('[data-name="real-utilidad-ratio"]').text(real.utilidad.ratio.toFixed(2)).trigger('change');
    		target.find('[data-name="real-utilidad-ratio"]').text((real.utilidad.ratio * 100).toFixed(2).toString().replace('.', ','));
    		target.find('[data-name="real-costo-value"]').text(real.costo.value.toFixed(0)).trigger('change');
    		//target.find('[data-name="real-costo-ratio"]').text(real.costo.ratio.toFixed(2)).trigger('change');
    		target.find('[data-name="real-costo-ratio"]').text((real.costo.ratio * 100).toFixed(2).toString().replace('.', ','));

    		var indicador = current.indicador;
    		target.find('[data-name="indicador-total-neto-value"]').text(indicador.total_neto.value.toFixed(0)).trigger('change');

    		if (data.rows[0].closed_compras) {
    			target.find('.indicador [data-name="indicador-diferencia-costos-value"]').parentTo('li').hide();
    			target.find('.indicador [data-name="indicador-utilidad-esperada-value"]').parentTo('li').hide();

    			target.find('h2 [data-name="indicador-diferencia-costos-value"]').parentTo('.switchable').hide();
    			target.find('h2 [data-name="indicador-utilidad-esperada-value"]').parentTo('.switchable').hide();
    		} else {
    			target.find('.indicador [data-name="indicador-eficiencia-ratio"]').parentTo('li').hide();

    			target.find('h2 [data-name="real-utilidad-value"]').parentTo('.switchable').hide();
    			target.find('h2 [data-name="indicador-eficiencia-ratio"]').parentTo('.switchable').hide();
    		}
    		// target.find('[data-name="indicador-diferencia-costos-value"]').text(indicador.diferencia_costos.value.toFixed(0)).trigger('change');
    		if (indicador.diferencia_costos.value > 0)
    			target.find('[data-name="indicador-diferencia-costos-value"]').text(indicador.diferencia_costos.value.toFixed(0)).trigger('change');
    		else
    			target.find('[data-name="indicador-diferencia-costos-value"]').text(0).trigger('change');

    		//target.find('[data-name="indicador-eficiencia-ratio"]').text(indicador.eficiencia.ratio.toFixed(2)).trigger('change');
    		target.find('[data-name="indicador-eficiencia-ratio"]').text((indicador.eficiencia.ratio * 100).toFixed(2).toString().replace('.', ','));
    		target.find('[data-name="indicador-utilidad-esperada-value"]').text(indicador.utilidad_esperada.value.toFixed(0)).trigger('change');


    		var current = data.rows[0].resumen;

    		var gasto_real = current.gasto_real;
    		target.find('[data-name="gasto-real-directo-value"]').text(gasto_real.directo.value.toFixed(0)).trigger('change');
    		target.find('[data-name="gasto-real-interno-value"]').text(gasto_real.interno.value.toFixed(0)).trigger('change');
    		target.find('[name="negocio[gasto_real_interno_enabled]"]').prop('checked', gasto_real.interno.enabled);
    		if (!gasto_real.interno.enabled)
    			target.find('[name="negocio[gasto_real_interno_enabled]"]').parentTo('li').addClass('strikeout');
    		target.find('[data-name="gasto-real-otros-value"]').text(gasto_real.otros.value.toFixed(0)).trigger('change');
    		target.find('[data-name="gasto-real-sobrecargos-value"]').text(gasto_real.sobrecargos.value.toFixed(0)).trigger('change');
    		if (!gasto_real.sobrecargos.enabled)
    			target.find('[data-name="gasto-real-sobrecargos-value"]').parentTo('li').hide();
    		target.find('[data-name="gasto-real-total-value"]').text((gasto_real.directo.value + ((gasto_real.interno.enabled)? gasto_real.interno.value : 0) + gasto_real.otros.value + gasto_real.sobrecargos.value).toFixed(0)).trigger('change');

    		var justificacion = current.justificacion;
    		target.find('[data-name="justificacion-pending-value"]').text(justificacion.pending.value.toFixed(0)).trigger('change');
    		target.find('[data-name="justificacion-done-value"]').text(justificacion.done.value.toFixed(0)).trigger('change');

    		var cobro = current.cobro;
    		target.find('[data-name="cobro-pending-value"]').text(cobro.pending.value.toFixed(0)).trigger('change');
    		target.find('[data-name="cobro-done-value"]').text(cobro.done.value.toFixed(0)).trigger('change');

    		var pago = current.pago;
    		target.find('[data-name="pago-pending-value"]').text(pago.pending.value.toFixed(0)).trigger('change');
    		target.find('[data-name="pago-done-value"]').text(pago.done.value.toFixed(0)).trigger('change');

    		var impuesto = current.impuesto;
    		target.find('[data-name="impuesto-iva-value"]').text(impuesto.iva.value.toFixed(0)).trigger('change');
    		target.find('[data-name="impuesto-retenciones-value"]').text(impuesto.retenciones.value.toFixed(0)).trigger('change');

    	},
    	error: function(a,b,c) {
    		
    	}
    }).fail(function(a,b,c) {  } );
    */


    var data = totales.summaryNegocioData;

    var target = $('section.sheet');

    if (typeof data.rows[0].utilidad_costo != 'undefined')
        var current = data.rows[0].utilidad_costo;


    var presupuestado = current.presupuestado;
    console.log('utilidad presup. porcentual: ', presupuestado.utilidad.ratio);
    target.find('[data-name="presupuestado-utilidad-value"]').text(presupuestado.utilidad.value.toFixed(currency.decimals).replace('.', ',')).trigger('change');
    //target.find('[data-name="presupuestado-utilidad-ratio"]').text(presupuestado.utilidad.ratio.toFixed(2)).trigger('change');
    target.find('[data-name="presupuestado-utilidad-ratio"]').text((presupuestado.utilidad.ratio * 100).toFixed(2).toString().replace('.', ','));
    target.find('[data-name="presupuestado-costo-value"]').text(presupuestado.costo.value.toFixed(currency.decimals).replace('.', ',')).trigger('change');
    //target.find('[data-name="presupuestado-costo-ratio"]').text(presupuestado.costo.ratio.toFixed(2)).trigger('change');
    target.find('[data-name="presupuestado-costo-ratio"]').text((presupuestado.costo.ratio * 100).toFixed(2).toString().replace('.', ','));

    var real = current.real;
    target.find('[data-name="real-utilidad-value"]').text(real.utilidad.value.toFixed(currency.decimals).replace('.', ',')).trigger('change');
    //target.find('[data-name="real-utilidad-ratio"]').text(real.utilidad.ratio.toFixed(2)).trigger('change');
    target.find('[data-name="real-utilidad-ratio"]').text((real.utilidad.ratio * 100).toFixed(2).toString().replace('.', ','));
    target.find('[data-name="real-costo-value"]').text(real.costo.value.toFixed(currency.decimals).replace('.', ',')).trigger('change');
    //target.find('[data-name="real-costo-ratio"]').text(real.costo.ratio.toFixed(2)).trigger('change');
    target.find('[data-name="real-costo-ratio"]').text((real.costo.ratio * 100).toFixed(2).toString().replace('.', ','));

    var indicador = current.indicador;

  
    //REAPER --> NO BORRAR LINEA  ----> seteo total a cliente
    document.querySelector('input[name="cotizacion[ajuste]"]').value = unaBase.utilities.transformNumber( indicador.total_neto.value / exchange_rate, 'int' );


    target.find('[data-name="indicador-total-neto-value"]').text(indicador.total_neto.value.toFixed(currency.decimals).replace('.', ',')).trigger('change');

    if (data.rows[0].closed_compras) {
        target.find('.indicador [data-name="indicador-diferencia-costos-value"]').parentTo('li').hide();
        target.find('.indicador [data-name="indicador-utilidad-esperada-value"]').parentTo('li').hide();

        target.find('h2 [data-name="indicador-diferencia-costos-value"]').parentTo('.switchable').hide();
        target.find('h2 [data-name="indicador-utilidad-esperada-value"]').parentTo('.switchable').hide();
    } else {
        target.find('.indicador [data-name="indicador-eficiencia-ratio"]').parentTo('li').hide();

        target.find('h2 [data-name="real-utilidad-value"]').parentTo('.switchable').hide();
        target.find('h2 [data-name="indicador-eficiencia-ratio"]').parentTo('.switchable').hide();
    }
    // target.find('[data-name="indicador-diferencia-costos-value"]').text(indicador.diferencia_costos.value.toFixed(0)).trigger('change');
    if (indicador.diferencia_costos.value > 0)
        target.find('[data-name="indicador-diferencia-costos-value"]').text(indicador.diferencia_costos.value.toFixed(currency.decimals).replace('.', ',')).trigger('change');
    else
        target.find('[data-name="indicador-diferencia-costos-value"]').text(0).trigger('change');

    //target.find('[data-name="indicador-eficiencia-ratio"]').text(indicador.eficiencia.ratio.toFixed(2)).trigger('change');
    target.find('[data-name="indicador-eficiencia-ratio"]').text((indicador.eficiencia.ratio * 100).toFixed(2).toString().replace('.', ','));
    target.find('[data-name="indicador-utilidad-esperada-value"]').text(indicador.utilidad_esperada.value.toFixed(currency.decimals).replace('.', ',')).trigger('change');


    var current = data.rows[0].resumen;

    var gasto_real = current.gasto_real;

    /*console.log("obj gasto real:");
    console.log(gasto_real);*/

    target.find('[data-name="gasto-real-directo-value"]').text(parseFloat(gasto_real.directo.value).toFixed(currency.decimals).replace('.', ',')).trigger('change');
    target.find('[data-name="gasto-real-interno-value"]').text(gasto_real.interno.value.toFixed(currency.decimals).replace('.', ',')).trigger('change');
    target.find('[name="negocio[gasto_real_interno_enabled]"]').prop('checked', gasto_real.interno.enabled);
    if (!gasto_real.interno.enabled)
        target.find('[name="negocio[gasto_real_interno_enabled]"]').parentTo('li').addClass('strikeout');
    target.find('[data-name="gasto-real-otros-value"]').text(gasto_real.otros.value.toFixed(currency.decimals).replace('.', ',')).trigger('change');
    target.find('[data-name="gasto-real-sobrecargos-value"]').text(gasto_real.sobrecargos.value.toFixed(currency.decimals).replace('.', ',')).trigger('change');
    if (!gasto_real.sobrecargos.enabled)
        target.find('[data-name="gasto-real-sobrecargos-value"]').parentTo('li').hide();
    target.find('[data-name="gasto-real-total-value"]').text((parseFloat(gasto_real.directo.value) + ((gasto_real.interno.enabled) ? gasto_real.interno.value : 0) + gasto_real.otros.value + gasto_real.sobrecargos.value).toFixed(currency.decimals).replace('.', ',')).trigger('change');

    var justificacion = current.justificacion;
    target.find('[data-name="justificacion-pending-value"]').text(parseFloat(justificacion.pending.value).toFixed(currency.decimals).replace('.', ',')).trigger('change');
    target.find('[data-name="justificacion-done-value"]').text(parseFloat(justificacion.done.value).toFixed(currency.decimals).replace('.', ',')).trigger('change');

    var cobro = current.cobro;
    target.find('[data-name="cobro-pending-value"]').text(cobro.pending.value.toFixed(currency.decimals).replace('.', ',')).trigger('change');
    target.find('[data-name="cobro-done-value"]').text(cobro.done.value.toFixed(currency.decimals).replace('.', ',')).trigger('change');

    var pago = current.pago;
    target.find('[data-name="pago-pending-value"]').text(pago.pending.value.toFixed(currency.decimals).replace('.', ',')).trigger('change');
    target.find('[data-name="pago-done-value"]').text(pago.done.value.toFixed(currency.decimals).replace('.', ',')).trigger('change');

    var impuesto = current.impuesto;
    target.find('[data-name="impuesto-iva-value"]').text(impuesto.iva.value.toFixed(currency.decimals).replace('.', ',')).trigger('change');
    target.find('[data-name="impuesto-retenciones-value"]').text(impuesto.retenciones.value.toFixed(currency.decimals).replace('.', ',')).trigger('change');

    target.find('footer .numeric.currency span').number(true, currency.decimals, ',', '.');
    // target.find('footer .numeric.percent span').number(true, 2, ',', '.'); // el plugin no soporta números negativos
    let costoreal = isNaN(real.costo.value.toFixed(currency.decimals).replace('.', ',')) ? 0 : real.costo.value.toFixed(currency.decimals).replace('.', ',')
    let totalNeto = indicador.total_neto.value.toFixed(currency.decimals).replace('.', ',')
    generarChart(presupuestado.costo.value.toFixed(currency.decimals).replace('.', ','), costoreal, "presupuestado-chart", totalNeto);
	
    
    
    generarChart(real.utilidad.value.toFixed(currency.decimals).replace('.', ','), indicador.utilidad_esperada.value.toFixed(currency.decimals).replace('.', ','), "utilidad-chart");

};
