// Validación de OTs

var ot = {};

var refreshLogValidacion = function(notify) {
    $.ajax({
        url: '/4DACTION/_V3_getLogValidacionByIndex',
        data: {
            index: 'OT|' + ot.id
        },
        dataType: 'json',
        success: function(data) {
            if (data.rows.length == 0) {
                $('section.sheet-ot ul.steps').hide();
                $('section.sheet-ot ul.steps').parentTo('article').hide();
                $('#menu [data-name^="validate_"]:not([data-name="validate_send"])').hide();

                // Bloquear edición para OTs validadas automáticas, si no tiene el permiso Modificar
                if (!access._18 && ot.approved) {
                    $('.box-top input, .box-top textarea:not(#text-coment-ot), .box-top select').prop('disabled', true);
                }
                return false;
            } else {
                if (!access._18 && !ot.approved) {
                    $('.box-top input, .box-top textarea:not(#text-coment-ot), .box-top select').prop('disabled', true);
                }
            }
            var populate = function(target) {
                $('#menu [data-name^="validate_"]').hide();
                target.empty();

                var max_jerarquia = 0;
                var max_priority = 0;

                for (var i = 0; i < data.rows.length; i++)
                    max_jerarquia = (data.rows[i].jerarquia > max_jerarquia)? data.rows[i].jerarquia : max_jerarquia;

                for (var i = 0; i < data.rows.length; i++)
                    max_priority = (data.rows[i].priority > max_priority)? data.rows[i].priority : max_priority;

                var valid_rules = 0;
                var approved_rules = 0;
                var rejected_rules = 0;

                for(var z = 0; z <= max_priority; z++) {

                    for (var i = 1; i <= max_jerarquia; i++) {
                        var htmlObject = $('<li><ul></ul></li>');
                        var results = [];
                        for (var k = 0; k < data.rows.length; k++) {
                            if (data.rows[k].jerarquia == i && data.rows[k].priority == z) {
                                results.push(data.rows[k]);
                            }
                        }
                        if (results.length > 0) {
                            var current = results[0];
                            if (current.required)
                                htmlObject.find('ul').addClass('and');
                            else
                                htmlObject.find('ul').addClass('or');
                            var required = false;
                            var local_valid_steps = 0;
                            var local_passed_steps = 0;
                            var local_approved_steps = 0;
                            var local_rejected_steps = 0;
                            if (data.rows.length > 0)
                                $('section.sheet-ot ul.steps').parentTo('article').show();
                            for (var j = 0; j < results.length; j++) {
                                var current = results[j];
                                if (current.jerarquia === i) {
                                    local_valid_steps++;

                                    subHtmlObject = $('<li style="text-align: left;"><div style="display: inline-block;"><div class="motivo" style="display: inline-block; font-style: italic; width: 450px;"></div> <span class="name" style="text-transform: capitalize; display: inline-block; width: 200px;"></span></div><span class="indicator ui-icon"></span><button class="approve" style="vertical-align middle; width: auto; font-size: 10px !important; height: 24px !important;">Validar</button><button class="reject" style="width: auto; font-size: 10px !important; height: 24px !important; vertical-align: middle;">Rechazar</button><small class="action" style="margin-left: 10px;font-size: 10px;"></small></li>');

                                    subHtmlObject.data('id', current.id);
                                    subHtmlObject.data('username', current.username);
                                    subHtmlObject.data('observacion', current.observacion);
                                    subHtmlObject.data('updated-at', current.updated_at);
                                    subHtmlObject.find('span.name').text(current.full_name);
                                    subHtmlObject.find('div.motivo').text(current.motivo);

                                    if (current.username.toLowerCase() == current_username.toLowerCase()) {
                                        if (current.updated_at === null) {
                                            $('#menu [data-name^="validate_accept"]').show();
                                            $('#menu [data-name^="validate_reject"]').show();
                                            $('[data-name="share"]').hide();
                                            $('[data-name="convert_negocio"]').hide();
                                            $('[data-name="conversion_negocio_request"]').show();
                                        }
                                    }

                                    if (current.approved === true) {
                                        subHtmlObject.find('span.indicator').addClass('ui-icon-check');
                                        local_passed_steps++;
                                        local_approved_steps++;
                                    } if (current.updated_at === null) {
                                        subHtmlObject.find('span.indicator').addClass('ui-icon-help');
                                    } if (current.approved === false && current.updated_at !== null) {
                                        subHtmlObject.find('span.indicator').addClass('ui-icon-closethick');
                                        local_passed_steps++;
                                        local_rejected_steps++;
                                    }
                                    if (current.username.toLowerCase() == current_username.toLowerCase()) {
                                        subHtmlObject.find('button.approve').button({
                                            icons: {
                                                primary: 'ui-icon-check'
                                            }
                                        }).click(function(event) {
                                            // Acciones al aprobar validación
                                            $.ajax({
                                                url: '/4DACTION/_V3_setLogValidacion',
                                                data: {
                                                    id: $(this).parentTo('li').data('id'),
                                                    approved: true
                                                },
                                                dataType: 'json',
                                                success: function(data) {
                                                    if (data.success) {
                                                        refreshLogValidacion();
                                                        //toastr.success(NOTIFY.get('SUCCESS_VALIDACION_ACCEPT'));
                                                        $('#menu > ul > li[data-name^="validate_"]').hide();

                                                        // Enviar correo validación aceptada
                                                        var username = current_username;
                                                        var record_name = 'Orden de Trabajo';
                                                        var index = ot.index;
                                                        var text = ot.ref;

                                                        var usernames = [];
                                                        usernames.push(username_ot);


                                                        for (k in usernames) {
                                                            unaBase.email.notify(usernames[k], 'validation_accepted', record_name, index, text, null, 'ot.shtml', ot.id);
                                                            /*unaBase.inbox.send({
                                                                to: usernames[k],
                                                                subject: 'Aceptó validar Orden de Trabajo Nº ' + index + ' / ' + text,
                                                                into: 'iframe',
                                                                href: '/ot.shtml?id=' + ot.id,
                                                                tag: 'avisos'
                                                            });*/
                                                        }

                                                        unaBase.log.save('Ha aprobado validar Orden de Trabajo', 'ot', index, ot.id);

                                                        //$('#menu [data-name="save"]').find('button').trigger('click');

                                                    } else
                                                        toastr.error(NOTIFY.get('ERROR_RECORD_READONLY'));
                                                }
                                            });
                                            event.preventDefault();
                                        });

                                        subHtmlObject.find('button.reject').button({
                                            icons: {
                                                primary: 'ui-icon-closethick'
                                            }
                                        }).click(function(event) {
                                            var that = event.target;
                                            // Acciones al rechazar validación
                                            var htmlObject = $('<section> \
                                                <span>Ingrese motivo de rechazo</span> \
                                                <textarea name="response" required placeholder="Opcional..."></textarea> \
                                            </section>');
                                            htmlObject.find('textarea').on('blur change', function() {
                                                htmlObject.data('response', $(this).val());
                                            });
                                            prompt(htmlObject).done(function(data) {
                                                var promptData = data;
                                                var idLogValidacion = $(that).parentTo('li').data('id');
                                                if (promptData !== false)
                                                    $.ajax({
                                                        url: '/4DACTION/_V3_setLogValidacion',
                                                        data: {
                                                            id: idLogValidacion,
                                                            approved: false,
                                                            observacion: promptData,
                                                            id_record: ot.id,
                                                            index_record: ot.index
                                                        },
                                                        dataType: 'json',
                                                        success: function(data) {
                                                            if (data.success) {
                                                                refreshLogValidacion();
                                                                toastr.success(NOTIFY.get('SUCCESS_VALIDACION_REJECT'));
                                                                $('#menu > ul > li[data-name^="validate_"]').hide();
                                                                // Enviar correo validación rechazada
                                                                var username = ot.username;
                                                                var record_name = 'Orden de Trabajo';
                                                                var index = ot.index;
                                                                var text = ot.ref;
                                                                var usernames = [];
                                                                usernames.push(username_ot);
                                                                for (k in usernames) {
                                                                    unaBase.email.notify(usernames[k], 'validation_rejected_ot', record_name, index, text, promptData, 'ot.shtml', ot.id);
                                                                    /*unaBase.inbox.send({
                                                                        to: usernames[k],
                                                                        subject: 'Rechazó validar ' + record_name + ' Nº ' + index + ' / ' + text,
                                                                        into: 'iframe',
                                                                        href: '/ot.shtml?id=' + ot.id,
                                                                        tag: 'avisos'
                                                                    });*/
                                                                }

                                                                unaBase.log.save('Ha rechazado validar Orden de Trabajo', 'ot', index, ot.id, promptData);

                                                            } else
                                                                toastr.error(NOTIFY.get('ERROR_RECORD_READONLY'));
                                                        }
                                                    });
                                            });
                                            event.preventDefault();
                                        });

                                    } else {
                                        subHtmlObject.find('button.approve').remove();
                                        subHtmlObject.find('button.reject').remove();
                                        if (subHtmlObject.find('span.indicator').hasClass('ui-icon-help'))
                                            subHtmlObject.find('small.action').text('Esperando acción del usuario');
                                    }

                                    htmlObject.find('ul').append(subHtmlObject);

                                    if (current.required)
                                        required|= current.required;
                                }
                            }

                            if (required) {
                                if (local_valid_steps == local_approved_steps)
                                    htmlObject.find('ul').addClass('approved');
                                if (local_valid_steps == local_rejected_steps)
                                    htmlObject.find('ul').addClass('rejected');
                            } else {
                                if (local_passed_steps > 0)
                                    htmlObject.find('ul').addClass('approved');
                                if (local_rejected_steps > 0)
                                    htmlObject.find('ul').addClass('rejected');
                            }
                            if (htmlObject.find('ul').hasClass('approved') || htmlObject.find('ul').hasClass('rejected')) {
                                htmlObject.find('ul > li').each(function() {
                                    var updated_at = $(this).data('updated-at');
                                    if ($(this).find('span.indicator').hasClass('ui-icon-help'))
                                        $(this).find('small.action').text('No se requiere acción del usuario');
                                    if ($(this).find('span.indicator').hasClass('ui-icon-check')) {
                                        $(this).find('small.action').html('El usuario aprobó validar el <time datetime="' + updated_at + '">' + Date.parse(updated_at).getDate() + '-' + (Date.parse(updated_at).getMonth() + 1) + '-' + Date.parse(updated_at).getFullYear() + ' a las ' + Date.parse(updated_at).getHours() + ':' + sprintf("%02d", Date.parse(updated_at).getMinutes()) + '</time>');
                                    }
                                    if ($(this).find('span.indicator').hasClass('ui-icon-closethick')) {
                                        if ($(this).data('observacion') != '')
                                            $(this).find('small.action').html('El usuario rechazó validar el <time datetime="' + updated_at + '">' + Date.parse(updated_at).getDate() + '-' + (Date.parse(updated_at).getMonth() + 1) + '-' + Date.parse(updated_at).getFullYear() + ' a las ' + Date.parse(updated_at).getHours() + ':' + sprintf("%02d", Date.parse(updated_at).getMinutes()) + '</time> por:<br>&quot;<strong style="font-weight: bold;">' + $(this).data('observacion') + '</strong>&quot;');
                                        else
                                            $(this).find('small.action').text('El usuario rechazó validar');
                                    }
                                });
                                htmlObject.find('button.approve').remove();
                                htmlObject.find('button.reject').remove();
                            }
                            target.append(htmlObject);
                        }
                    }

                    var valid_steps = target.find('> li').length;
                    var approved_steps = target.find('> li').has('ul.approved').length;
                    var rejected_steps = target.find('> li').has('ul.rejected').length;

                    valid_rules++;

                    if (valid_steps == approved_steps || valid_steps == rejected_steps) {
                        if (valid_steps == approved_steps) {
                            approved_rules++;
                        }
                        if (valid_steps == rejected_steps) {
                            rejected_rules++;
                        }
                    }
                }

                if (!access._506)
                    $('#menu [data-name="validate_request"]').hide();
                else
                    $('#menu [data-name="validate_request"]').show();

                if (valid_rules == approved_rules || valid_rules == rejected_rules) {
                    if (valid_rules == approved_rules) {
                        if (rejected_steps == 0) {
                            if (!ot.approved) {
                                $.ajax({
                                    url: '/4DACTION/_v3_ot_save',
                                    data: {
                                        id: ot.id,
                                        'approved': true
                                    },
                                    dataType: 'json',
                                    async: false,
                                    success: function(data) {
                                        if (data.success) {
                                            toastr.success('La orden de trabajo ha pasado el proceso de validación.');
                                            setTimeout((function() {
                                                location.href="/ot.shtml?i=" + ot.id + "&r="+Math.random();
                                            }), 2000);
                                        }
                                    }
                                });
                            } else {
                                // Bloquear edición para OTs validadas por regla, si no tiene el permiso Modificar
                                if (!access._18) {
                                    $('.box-top input, .box-top textarea:not(#text-coment-ot), .box-top select').prop('disabled', true);
                                }
                                // Mostrar reiniciar validación para OTs validadas por regla
                                $('[data-name="validate_request"]').show();
                            }
                        }
                    }
                    if (valid_rules == rejected_rules) {
                        $('section.sheet-ot ul.steps').prevTo('h2').find('span:last-of-type').text('Rechazado');

                        // Si está rechazado, volver a solicitar que la validen
                        $('#menu [data-name="validate_request"]').show();
                    }
                } else {
                    $('section.sheet-ot ul.steps').prevTo('h2').find('span:last-of-type').text('En espera');
                    if (!access._548) { // Modificar cotización por validar
                        $('section.sheet-ot:not(.staff)').find('input, textarea, tr button, tr span').prop('disabled', true); // bloquear mientras se espera validación
                        $('section.sheet-ot:not(.staff)').find('tr.collapsed').removeClass('collapsed'); // expandir ítems contraídos al bloquear
                        $('section.sheet-ot:not(.staff)').find('tr button, tr span.ui-icon, ul.editable button, footer button:not(.approve):not(.reject)').hide(); // ocultar botones al bloquear
                    }

                    if (ot.username.toLowerCase() == current_username.toLowerCase())
                        $('#menu [data-name="validate_request"]').show();

                    $('[data-name="share"]').hide();
                    $('[data-name="convert_negocio"]').hide();
                    $('[data-name="conversion_negocio_request"]').show();
                }

                target.show();
            };

            var calcProgress = function(source) {
                var max_jerarquia = 0;

                for (var i = 0; i < source.length; i++)
                    max_jerarquia = (source[i].jerarquia > max_jerarquia)? source[i].jerarquia : max_jerarquia;

                var current;
                var valid_steps = 0;
                var passed_steps = 0;

                for (var i = 1; i <= max_jerarquia; i++) {
                    var local_valid_steps = 0;
                    var local_passed_steps = 0;
                    var local_required_steps = false;
                    for (var j = 0; j < source.length; j++) {
                        current = source[j];
                        if (current.jerarquia === i) {
                            local_required_steps|= current.required;
                            local_valid_steps++;
                            if (current.updated_at !== null)
                                local_passed_steps++;
                        }
                    }
                    if (local_required_steps) {
                        valid_steps+= local_valid_steps;
                        passed_steps+= local_passed_steps;
                    } else {
                        valid_steps++;
                        passed_steps+= (local_passed_steps > 0)? 1 : 0;
                    }
                }

                return passed_steps / valid_steps;
            };

            populate($('section.sheet-ot ul.steps'));

            $('section.sheet-ot ul.steps').prevTo('h2').find('span:first-of-type').text(Math.round(calcProgress(data.rows) * 100, 0) + '% completado');

            ot_refresh_permissions();

        }
    });
};

var initLogValidacion = function() {
    $.ajax({
        url: '/4DACTION/_V3_getLogValidacionByIndex',
        data: {
            index: 'OT|' + ot.id
        },
        dataType: 'json',
        success: function(data) {
            unaBase.ui.unblock();
            if (data.rows.length == 0) {

                var htmlObject = $('<section> \
                    <div> \
                    <p>Esta orden de trabajo debe ser autorizada por los siguientes criterios:</p> \
                    <ul style="list-style-type: none; list-style-position: outside; margin-left: 20px;"></ul> \
                    </div> \
                    <span>Ingrese algún comentario. Se notificará cuando la orden de trabajo sea autorizada o rechazada.</span> \
                    <textarea required name="comentario">Por favor validar.</textarea> \
                </section>');

                var has_rules = true;

                unaBase.ui.block();

                $.ajax({
                    url: '/4DACTION/_V3_setLogValidacion',
                    data: {
                        table: 'OT',
                        id_record: ot.id,
                        index_record: ot.index,
                        ref_record: ot.ref,
                        test: true
                    },
                    dataType: 'json',
                    async: false,
                    success: function(data) {
                        has_rules = (data.rows.length > 0);
                        // Se recorren los criterios indicados
                        // para cada criterio se apilan los nombres de usuario encargados de validar
                        // se quitan los nombres de usuario duplicados para cada criterio
                        var validaciones = [];
                        $.each(data.rows, function(i, item) {
                            if (typeof validaciones[data.rows[i].text] == 'undefined')
                                validaciones[data.rows[i].text] = [];
                            var temp = [];
                            var temp2 = [];
                            $.each(data.rows, function(j, jtem) {
                                if (jtem.text == item.text) {
                                    temp.push(data.rows[j].username);
                                    temp2.push(data.rows[j].id);
                                }
                            });
                            validaciones[data.rows[i].text]['usernames'] = temp.filter(
                                function(a){return !this[a] ? this[a] = true : false;}, {}
                            );
                            validaciones[data.rows[i].text]['ids'] = temp2.filter(
                                function(a){return !this[a] ? this[a] = true : false;}, {}
                            );
                        });

                        // Se recorren los criterios disponibles y se asignan los detalles
                        $.each(data.rows, function(i, item) {
                            var details = data.rows[i].detail.split("\n");
                            var temp = [];
                            $.each(data.rows, function(j, jtem) {
                                $.each(details, function(k, ktem) {
                                    if (details[k] != '')
                                        temp.push(details[k]);
                                });
                            });
                            validaciones[data.rows[i].text]['detail'] = temp.filter(
                                function(a){return !this[a] ? this[a] = true : false;}, {}
                            );
                            validaciones[data.rows[i].text]['']
                        });

                        var criteria_list = $('<ul>');
                        for (i in validaciones) {
                            var rand_class = 'rand_' + Math.floor((Math.random() * 100000) + 1);
                            var criteria = criteria_list.append('<li class="' + rand_class + '" style="font-size: 90% !important; display: list-item !important; margin: 10px 0 !important;">' + '<span style="font-weight: 600 !important; font-size: inherit !important; display: block;">' + i + '</span>' + '</li>').find('li.' + rand_class);
                            if (validaciones[i]['detail'].length > 0) {
                                var detail_list = criteria.append('<ul style="list-style-type: disc; list-style-position: inside; font-size: 12px !important; color: red !important;"></ul>').find('ul');
                                $.each(validaciones[i]['detail'], function(j, jtem) {
                                    detail_list.append('<li style="font-size: inherit !important; display: list-item !important; margin: 5px !important;">' + jtem + '</li>');
                                });
                            }
                            var subrand_class = 'subrand_' + Math.floor((Math.random() * 100000) + 1);
                            var username_list = criteria.append('<p style="font: inherit !important; display: inline-block !important; margin: 5px 0 !important;">Debe' + ((validaciones[i]['usernames'].length > 1)? 'n' : '') + ' autorizar: </p> <ul class="usernames ' + subrand_class + '" style="display: inline-block !important; list-style-type: none !important; font-size: inherit !important;"></ul>').find('ul.usernames.' + subrand_class);
                            $.each(validaciones[i]['usernames'], function(j, jtem) {
                                username_list.append('<li style="font-size: inherit !important; display: inline-block !important; padding: 3px; background-color: rgb(240,240,240) !important; border: 1px solid rgb(220,220,220) !important; border-radius: 3px !important; margin: 3px;">' + jtem + '</li>');
                            });
                        }
                        htmlObject.find('ul').append(criteria_list.html());
                        unaBase.ui.block();
                    }
                });

                htmlObject.find('textarea').on('blur change', function() {
                    htmlObject.data('response', $(this).val());
                });

                unaBase.ui.unblock();

                var generate_link_email_validacion = function(data, loginValidator) {
                    var info_adicional = '<p style="font-weight:bold;background-color:#f0f0f0;padding:5px!important;margin:0!important;border:1px solid #f0f0f0;box-sizing:border-box">Información adicional:</p><ul style="list-style-type: none; list-style-position: outside;padding:0px!important;">';
                    if ($('#tipo-ot').val() == 'PROYECTO') {
                      info_adicional+= '<li>Negocio: ' + $('#buscar-proyectos-auto').val() + '</li>';
                      if ($('#items-tipo-ot').val() == 'ITEM DIRECTO') {
                        info_adicional+= '<li>Ítem: ' + $('#llave-det-nvx').find('option:selected').text() + '</li>';
                      }
                    } else {
                      info_adicional+= '<li>Cliente: ' + $('#buscar-empresas-auto').val() + '</li>';
                    }
                    info_adicional+= '</ul>';

                    var htmlObject_link = $('<section> \
                        <div> \
                        ' + info_adicional + '\
                        <p style="font-weight:bold;background-color:#f0f0f0;padding:5px!important;margin:0!important;border:1px solid #f0f0f0;box-sizing:border-box;">Motivo:</p> \
                        <ul class="motivos" style="list-style-type: none; list-style-position: outside;padding:0px!important;"></ul> \
                    </section>');

                    var criteria_list_link = $('<ul>');
                    $.each(data.rows, function(i, item) {
                        if (criteria_list_link.find('li[data-motivo="' + item.motivo + '"]').length == 0) {
                            var li = '<li data-motivo="' + item.motivo + '"><div style="font-size: inherit !important;">' + item.motivo + '</div>';
                            li += '<ul style="list-style-type:none!important;margin:0px!important;padding:0px!important;">';
                            $.each(data.rows, function(k, user) {
                                if ($(li).find('li[data-user="' + user.username + '"]').length == 0 && item.motivo == user.motivo) {
                                    if (user.username == loginValidator) {
                                        li += '<li data-user="' + user.username + '" style="position: relative; left: -10px; margin-top: 10px;"><p style="color: red;">' + item.detalle + '</p><strong>Debe dirigirse a la Orden de Trabajo para realizar la validación.</strong></li>';
                                    }
                                }
                            });
                            li += "</ul>";
                            li += "</li>";
                            criteria_list_link.append(li);
                        }
                    });
                    htmlObject_link.find('ul.motivos').append(criteria_list_link.html());
                    email_link = htmlObject_link.find('div')[0].outerHTML;
                    return email_link;
                };
                if (has_rules)
                    prompt(htmlObject, undefined, undefined, false, function() { $('[data-name="validate_request"]').hide(); }).done(function(msg) {
                        unaBase.ui.block();
                        $.ajax({
                            url: '/4DACTION/_V3_setLogValidacion',
                            data: {
                                table: 'OT',
                                id_record: ot.id,
                                index_record: ot.index,
                                ref_record: ot.ref,
                                mensaje: msg
                            },
                            dataType: 'json',
                            success: function(data) {
                                $.ajax({
                                    url: '/4DACTION/_V3_getLogValidacionByIndex',
                                    data: {
                                        index: 'OT|' + ot.id
                                    },
                                    dataType: 'json',
                                    success: function(subdata) {
                                        var record_name = 'Orden de Trabajo';
                                        var userlink = {};
                                        $.each(subdata.rows, function(key, entry) {
                                            userlink[entry.username] = {
                                                record: entry.record,
                                                username: entry.username,
                                                block_email: entry.block_email
                                            };
                                        });
                                        $.each(userlink, function(key, entry) {
                                            var email_link = generate_link_email_validacion(subdata, entry.username);
                                            var comentarioEmisor = '<p style="font-weight:bold;background-color:#f0f0f0;padding:5px!important;margin:0!important;border:1px solid #f0f0f0;box-sizing:border-box;">Comentario del emisor:</p><div style="margin:0 5px 0 5px!important"><strong>&laquo;' + msg + '&raquo;</strong></div>';
                                            comentarioEmisor+= '<p>Para revisar, favor ingresar <a href="' + window.location.origin + '/ot.shtml?i=' + entry.record.id + '" target="_blank">aquí</a>.</p>';
                                            if (!entry.block_email) {
                                              unaBase.email.notify(entry.username, 'validation_request_ot', record_name, entry.record.index, $('[name="referenciaot"]').val().toUpperCase(), email_link + comentarioEmisor , null, entry.record.id, false, true, undefined, undefined, false);
                                            }
                                            /*unaBase.inbox.send({
                                                to: entry.username,
                                                subject: 'Solicita validar Orden de Trabajo Nº ' + entry.record.index + ' / ' + entry.record.text,
                                                into: 'blank',
                                                href: '/ot.shtml?id=' + entry.record.id,
                                                tag: 'solicitudes',
                                                text: htmlObject.find('div')[0].outerHTML + msg
                                            });*/
                                        });

                                    }
                                });
                                refreshLogValidacion(true);
                                unaBase.interval.set(refreshLogValidacion, 15000);
                                unaBase.ui.unblock();
                            }
                        });
                    });
                else {
                    // si no hay reglas, se valida automáticamente
                    unaBase.ui.block();
                    $.ajax({
                        url: '/4DACTION/_v3_ot_save',
                        data: {
                            idot: ot.id,
                            'approved': true,
                            'auto': true
                        },
                        dataType: 'json',
                        success: function(data) {
                            if (data.success) {
                                /*
                                //toastr.success('La orden de compra ha pasado el proceso de validación.');
                                $('section.sheet-ot').data('approved', true);
                                $('section.sheet-ot').data('validado', true);
                                ot.validated = true;
                                $('span.validation-status').text('Validada');
                                $('[data-name="validate_send"]').hide();
                                // Ver si aplica bloqueo directo de los campos o si se recarga el formulario de la OT
                                */
                                setTimeout((function() {
                                    location.href="/ot.shtml?i=" + data.id + "&r="+Math.random();
                                }), 2000);
                            }
                            unaBase.ui.unblock();
                        }
                    });
                }
            } else {
                unaBase.ui.block();
                refreshLogValidacion();
                unaBase.interval.set(refreshLogValidacion, 15000);
                unaBase.ui.unblock();
            }
        }
    });
};


$(document).ready(function() {
    ot = {
        id: parseInt($('#id-ot').val()),
        index: $('div.folio-ot').text(),
        ref: $('#referencia-ot').val(),
        username: $('#login-ot').val(),
        approved: validated_ot
    };

    var params = {
    	entity: 'OT',
    	buttons: [ 'validate' ],
    	data: function() {
    		var tuple = {};
    		var fields = {
    			id: ot.id,
    			index: ot.index,
    			text: ot.ref,
    		};
    		return fields;
    	},
    	validate: function() {
    		return true;
    	}
    };
 //    unaBase.toolbox.init();
	// unaBase.toolbox.menu.init(params);
 //    unaBase.toolbox.menu.buttons([ 'validate' ]);
    /*$.ajax({
        url: '/4DACTION/_V3_setLogValidacion',
        data: {
            table: 'OT',
            id_record: ot.id,
            index_record: ot.index,
            ref_record: ot.ref,
            clear: true
        },
        dataType: 'json',
        async: false,
        success: function(data) {
            if (data.success) {
                initLogValidacion();
                toastr.success(NOTIFY.get('SUCCESS_VALIDACION_REQUEST'));
                unaBase.log.save('Ha solicitado validación', 'ot', ot.index, ot.id);
            } else
                toastr.error(NOTIFY.get('ERROR_RECORD_READONLY'));
        }
    });*/
});
