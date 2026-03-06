/* API de UnaBase */


// unaBase
var unaBase = {
  doc: {},
  getFilters: () => {
    return $("#search").serializeAnything(true);
  },
  sid:{
    encoded: () => {
    let sid = "";
    $.each($.cookie(), function(clave, valor) {
      if (clave == hash && valor.match(/UNABASE/g)) sid = valor;
    });
    return encodeURIComponent(sid);
    },
    raw: () => {
      let sid = "";
      $.each($.cookie(), function(clave, valor) {
        if (clave == hash && valor.match(/UNABASE/g)) sid = valor;
      });
      return sid;
    }
  },
  back: {
    callback: null
  },
  saveCallback: null,
  save: {
    callback: null,
    clearCallback(){
      unaBase.save.callback = null;
    }
  },
  print: {
    url(params){
      //unaBase.print.url


      // unaBase.print.url({
      //   aliasfiles: 'PAGO_',       //not that important, not use with native (name of the file)
      //   entity: 'pagos',
      //   preview: false,
      //   nullified: false,
      //   form: 'print',
      //   hostname: window.location.origin,
      //   folio: payment.folio,
      //   id: payment.id,
      // });

      let printFrame = document.querySelector('iframe[name="printFrame"]');
      let sid = "";
      $.each($.cookie(), function(clave, valor) {
        if (valor.match(/UNABASE/g)) sid += valor;
      });      
      // var query = url.parse(req.url, true, true).query;
      // var hostname = req.headers.referer.replace(/\/4DACTION\/(.*)/g, '');
      var hostname = params.hostname;
      let aliasfiles = params.aliasfiles;
      console.log(`entra a print ${params.entity}`);
      let native = uVar.nativePrint ? '_native' :'';
      // console.log(url.parse(req.url, true, true));
      // console.log('Generating a PDF of ' + query.entity + ' ' + query.id + ', this may take a while.');
      
      let viewUrl;
      
      // console.log(query.formch + " --- " + query.entity + " --- "+query);
      if(params.entity == "pagos"){
        if (params.form == "boucher") {
          params.aliasfiles = "PAGO_";
          // var viewUrl = hostname + '/v3/views/' + params.entity + '/'+ params.form + '.shtml?id=' + params.id + '&sid=' + sid + '&preview=' + params.preview + '&nullified=' + params.nullified;
          viewUrl = `${hostname}/v3/views/${params.entity}/${params.form}${native}.shtml?id=${params.id}&sid=${sid}&preview=${params.preview}&nullified=${params.nullified}`;
        }else{
          params.aliasfiles = "PAGO_";
          // var viewUrl = hostname + '/v3/views/' + params.entity + '/'+ params.form + '.shtml?id=' + params.id + '&sid=' + sid + '&preview=' + params.preview + '&nullified=' + params.nullified;
          viewUrl = `${hostname}/v3/views/${params.entity}/${params.form}${native}.shtml?id=${params.id}&sid=${sid}&preview=${params.preview}&nullified=${params.nullified}`;
        }
      }else{
        if (params.entity == "carta_cliente") {
          params.aliasfiles = "CARTA_";
          // var viewUrl = hostname + '/v3/views/' + params.entity + '/print_carta_cliente.shtml?id=' + params.id + '&sid=' + sid + '&preview=' + params.preview + '&nullified=' + params.nullified;
          viewUrl = `${hostname}/v3/views/${params.entity}/print_carta_cliente${native}.shtml?id=${params.id}&sid=${sid}&preview=${params.preview}&nullified=${params.nullified}`;
        } else {
          params.aliasfiles = "COT_";
          if (params.template == '' || params.template == undefined) {
            template = 'print';
          } else {
            template = 'print_' + params.template;
          }
          // var viewUrl = hostname + '/v3/views/' + params.entity + '/' + template + '.shtml?id=' + params.id + '&sid=' + sid + '&preview=' + params.preview + '&nullified=' + params.nullified;
          viewUrl = `${hostname}/v3/views/${params.entity}/${template}${native}.shtml?id=${params.id}&sid=${sid}&preview=${params.preview}&nullified=${params.nullified}`;
          if (params.template != '' && params.entity == 'cotizaciones') {
            var headerUrl = hostname + '/v3/views/' + params.entity + '/' + template + '_header.shtml?id=' + params.id + '&sid=' + sid + '&preview=' + params.preview + '&nullified=' + params.nullified;
            var footerUrl = hostname + '/v3/views/' + params.entity + '/' + template + '_footer.shtml?id=' + params.id + '&sid=' + sid + '&preview=' + params.preview + '&nullified=' + params.nullified;
          }
          // console.log(viewUrl);
        }
      }
      if (params.entity == "compras")
        params.aliasfiles = "OC_";

      if (aliasfiles)
        params.aliasfiles = aliasfiles;

      // if (params.preview == "true" || params.entity == "negocios" || params.entity == "pagos")
      //   res.setHeader('Content-disposition', 'inline; filename=' + params.aliasfiles + params.folio + ((params.preview == "true" || params.nullified == "true")? "_borrador" : "") + ".pdf");
      // else
      //   res.setHeader('Content-disposition', 'attachment; filename=' + params.aliasfiles + params.folio + ((params.preview == "true" || params.nullified == "true")? "_borrador" : "") + ".pdf");
      printFrame.src =viewUrl;
      return viewUrl;
    },
    set_deprecated(data){
      //unaBase.print.set        
      // deprecated  

       let params ={
        entity : data.entity,
        aliasfiles : $("section.sheet").data("tipogasto"),
        preview: data.preview || true,
        nullified: data.readonly || false,
        hostname: window.location.origin,
        folio: $("section.sheet").data("index"),
        id: $("section.sheet").data("id"),
        form: data.form
      }
         
      console.log(unaBase.print.url(params));


      let printFrame = document.querySelector('iframe[name="printFrame"]');
      printFrame.src = unaBase.print.url(params);

    },
    unset(){
      //unaBase.print.unset
      let printFrame = document.querySelector('iframe[name="printFrame"]');
      printFrame.src = '';
    }
  },
  // current: {},
  currency: {
    uf: {
      get() {},
      update() {
        $.ajax({
          url: ufUrls.url,
          dataType: "json",
          success: data => {
            let value = separatorTransform(data["UFs"][0]["Valor"]);
            let valueText = data["UFs"][0]["Valor"].replace(".", "");
            console.log(valueText);
            console.log(value);

            $.ajax({
              url: "/4DACTION/_V3_setCurrency?uf=" + valueText,
              dataType: "json",
              success: data => {
                toastr.success(`Valor uf actualizado a ${valueText}`);
                console.log(data.success);
              }
            });
          }
        });
      }
    }
  },
  // unaBase.interval
  interval: {
    _stack: [],
    set: function(functor, time) {
      var id = setInterval(functor, time);
      unaBase.interval._stack.push(id);
    },
    clearAll: function() {
      while (unaBase.interval._stack.length > 0) {
        clearInterval(unaBase.interval._stack.pop());
      }
    }
  },
  // unaBase.changeControl
  changeControl: {
    init: function() {
      unaBase.changeControl.hasChange = false;
      $("#viewport").live(
        "change.changeControl",
        "input, textarea, select",
        function(event) {
          if (event.originalEvent !== undefined) {
            unaBase.changeControl.hasChange = true;
            // unaBase.changeControl.isSaved = false;
            event.stopPropagation();
            $(event.target).unbind("change.changeControl");
          }
        }
      );
    },

    query: function() {
      return unaBase.changeControl.hasChange;
    }
  },
  // unaBase.ui
  ui: {
    isBlocked: false,
    isLoaded: false,
    // unaBase.ui.block
    block: function() {
      if (!unaBase.ui.isBlocked) {
        console.debug("Blocking UI");
        //$('html > body.menu.home >  div.loader')[0].style.display = 'block';
        $("div.loader")[0].style.display = "block";
        console.debug("UI blocked!");
        toastr.clear();
        $("[data-help]").each(function() {
          $(this).qtip("hide");
          //$(this).qtip('disable');
        });
        //$('html > body.menu.home').css('cursor', 'progress');
        $("html").css("cursor", "progress");
        unaBase.ui.isBlocked = true;
      }
    },
    // unaBase.ui.unblock
    unblock: function() {
      if (unaBase.ui.isBlocked || !unaBase.ui.isLoaded) {
        if (!unaBase.ui.isLoaded) {
          console.debug("First-time unblock");
        }
        //$('html > body.menu.home').css('cursor', 'default');
        $("html").css("cursor", "default");
        unaBase.ui.isBlocked = false;
        if (!unaBase.ui.isLoaded) {
          unaBase.ui.isLoaded = true;
        }
        console.debug("Unblocking UI");
        //$('html > body.menu.home >  div.loader')[0].style.display = 'none';
        $("div.loader")[0].style.display = "none";
        console.debug("UI unblocked!");
      }
    },
    // unaBase.ui.expandable
    expandable: {
      // unaBase.ui.expandable._reset
      _reset: function() {
        $("button.expand").unbind("click");
      },
      // unaBase.ui.expandable.init
      init: function() {
        unaBase.ui.expandable._reset();

        $(".expandable").hide();
        $("button.expand")
          .button({
            caption: "Expandir",
            icons: {
              primary: "ui-icon-pencil"
            },
            text: false
          })
          .click(unaBase.ui.expandable._expandContent);

        if ($("section.sheet").data("index") > 0)
          $("button.expand.active").each(function() {
            if (
              $(this)
                .siblings(".expandable")
                .is(":visible")
            ) {
              $(this).triggerHandler("click");
              $(this).button("option", {
                icons: {
                  primary: "ui-icon-triangle-1-s"
                },
                caption: "Expandir"
              });
            }
          });
        // veficar
        if (!$("section.sheet").data("index") > 0)
          $("button.expand.active").each(function() {
            $(this).triggerHandler("click");
            $(this).button("option", {
              icons: {
                primary: "ui-icon-triangle-1-n"
              },
              caption: "Contraer"
            });
          });

        $("button.expand.opened").each(function() {
          $(this).triggerHandler("click");
          $(this).button("option", {
            icons: {
              primary: "ui-icon-triangle-1-n"
            },
            caption: "Contraer"
          });
        });
        // veficar
        if (!$("section.sheet").data("index") > 0)
          if ($("section.sheet").data("index") == -1)
            $(".exclude-from-template").each(function() {
              $(this).remove();
            });
      },
      // unaBase.ui.expandable._expandContent
      _expandContent: function() {
        var element = this;
        $(this)
          .siblings(".expandable")
          .toggle(0, function() {
            if (
              $(element)
                .siblings(".expandable")
                .is(":visible")
            ) {
              $(element).button("option", {
                icons: {
                  primary: "ui-icon-triangle-1-n"
                },
                caption: "Contraer"
              });
              //$(this).removeClass('active');
            } else {
              $(element).button("option", {
                icons: {
                  primary: "ui-icon-pencil"
                },
                caption: "Expandir"
              });
            }
          });
      }
    }
  },
  // Inicialización
  // unaBase.init
  init: function() {
    $(".tooltip").tooltipster();

    //$('html > body.menu.home > section > div.loader').hide();
    $("div.loader").hide();
    $("html > body.menu.home > section > h1").hide();

    $(window).bindWithDelay(
      "resize",
      function() {
        unaBase._resize.body();
        unaBase._resize.iframe();
        unaBase._resize.viewport();
      },
      1000,
      true
    );

    $("html > body.menu > section > header").hide();

    $("#search > fieldset").hide();
    $("#search > button").click(function() {
      $("#search > fieldset").toggle(400, "easeInOutExpo");
      $("#search > button").toggleClass("active");
      $("#search > button").removeClass("enabled");
    });

    $("#search > label, html > body.menu > section > header > nav *").click(
      function(event) {
        $("#search > fieldset").hide(400, "easeInOutExpo");
        $("#search > button").removeClass("active");
      }
    );

    $("html > body.menu > footer > article.chat").hide();

    $("html > body.menu > footer > button").click(function() {
      $("html > body.menu > footer > article.chat").toggle();
    });

    $("html > body.menu > footer > article.chat > header").click(function() {
      $(this)
        .parent()
        .hide();
    });

    $("#iframe > iframe").load(function() {
      //this.style.width = this.contentWindow.document.body.scrollWidth + 'px';
      this.style.width = "calc(100% - 5px)";
      //this.style.height = this.contentWindow.document.body.scrollHeight + 'px';
      this.style.height = "calc(100% - 5px)";
      $(this)
        .parent()
        .show();
      unaBase._resize.iframe();
    });

    $("html > body.menu.home > section > header").hide();
    $("#iframe").hide();
    $("#viewport").hide();

    $("html").on("click", "*", function(event) {
      if (
        !$(event.target)
          .parent()
          .hasClass("dropdown-button") &&
        !$(event.target).hasClass("dropdown-button")
      ) {
        /*if (
				!$(event.target).parent().parent().hasClass('dropdown-button') &&
				!$(event.target).parent().hasClass('dropdown-button') &&
				!$(event.target).hasClass('dropdown-button')
			)*/ $(
          ".dropdown-menu"
        ).hide();
      } else {
        event.stopPropagation();
      }
    });
  },

  // Métodos internos para hacer resize
  // unaBase._resize
  _resize: {
    // unaBase._resize.body
    body: function() {
      var height = parseInt($(window).height());
      $("html > body.menu.home").height(height);
    },
    // unaBase._resize.iframe
    iframe: function() {
      var height = parseInt($(window).height()) - 130;
      $("#iframe > iframe")
        .parent()
        .height(height);
    },
    // unaBase._resize.viewport
    viewport: function() {
      var standalone = $("#viewport").hasClass("standalone");
      var height = parseInt($(window).height()) - (standalone ? 70 : 160);
      $("#viewport").height(height);

      if ($("#viewport .fht-table-init").length > 0) {
        $("#viewport .fht-table-init").fixedHeaderTable("destroy");
        $("#viewport .table").fixedHeaderTable({
          footer: true,
          cloneHeadToFoot: false,
          fixedColumn: false
        });
      }
    }
  },

  // Métodos para cargar vistas
  // unaBase.loadInto
  loadInto: {
    dialog: false,
    init: function(dialog) {
      if (typeof dialog != "undefined") unaBase.loadInto._dialog = dialog;
      else unaBase.loadInto._dialog = false;

      if ($(".sheet").length > 0) {
        unaBase.toolbox.search.save();
      } else {
        unaBase.toolbox.search.savedSearch = null;
      }
      refreshAccess();
      unaBase.toolbox.search.destroy();
      unaBase.interval.clearAll();
      toastr.clear();
      $("[data-help]").each(function() {
        $(this).qtip("hide");
        $(this).qtip("disable");
      });
    },
    ready: function(skip_history, href) {
      // if (typeof skip_history != 'undefined' && $('#search').css('display') != 'none')
      if (typeof skip_history != "undefined" && $("#search").is(":visible")) {
        unaBase.toolbox.search.restore();
      }

      $.ajax({
        url: "/4DACTION/_V3_getTooltip",
        data: {
          path: href
        },
        dataType: "json",
        success: function(data) {
          toastr.clear();
          if (typeof data.success != "undefined") {
            $().toasty("hideAll");
            $().toasty({
              title: data.title,
              message: data.text,
              autoHide: data.time,
              position: "tr"
            });
          }
        }
      });
    },
    // unaBase.loadInto.iframe
    iframe: function(href) {
      unaBase.loadInto.init();
      unaBase.loadInto._refresh(href);
      $("html > body.menu.home > section > header").hide();
      $("html > body.menu.home > section > h1").hide();
      $("html > body.menu.home > section > h2").hide();
      $("html > body.menu.home > section > p").hide();
      $("html > body.menu.home > section > img").hide();
      $("html > body.menu.home > section > section").hide();
      unaBase.history.save(href);
      $("#iframe > iframe").attr("src", href + "?_" + Math.random());
      unaBase.loadInto.ready(undefined, href);
    },
    // unaBase.loadInto.viewport
    viewport: function(href, title, standalone, skip_history, varData) {

      unaBase.doc = {};
      unaBase.print.unset();
      uVar.data = null;
      //$('#viewport').trigger('load');
      try{
        if (typeof Intercom != "undefined") Intercom("update");        
      }catch(err){
        console.warn(err);
      }

      unaBase.loadInto.init();
      unaBase.loadInto._refresh(href);
      // verificar definición de standalone
      if (typeof standalone == "undefined") var standalone = false;
      $("html > body.menu.home > section > header").hide();
      $("html > body.menu.home > section > h1").hide();
      $("html > body.menu.home > section > h2").hide();
      $("html > body.menu.home > section > p").hide();
      $("html > body.menu.home > section > img").hide();
      $("html > body.menu.home > section > section").hide();
      unaBase.ui.block();
      //if (typeof skip_history == 'undefined')
      unaBase.history.save(href, standalone, skip_history);

      $.ajax({
        type: "GET",
        url: href,
        dataType: "html",
        cache: false
      }).done(function(html) {
        unaBase.toolbox.destroy();
        if (typeof lastSearchNotify !== "undefined" && lastSearchNotify)
          lastSearchNotify.remove();
        $("html > body.menu.home > section > h1 > span").text(title);
        $("html > body.menu.home > section > h1").show();

        if (standalone) {
          $("html > body.menu.home > section > header").hide();
          $("#viewport").addClass("standalone");
        } else {
          $("html > body.menu.home > section > header").show();
          $("#viewport").removeClass("standalone");
        }
        $("#viewport *").off();
        $("#viewport *").remove();
        $("#viewport").html(html);
        $("#viewport").show();

        unaBase._resize.viewport();

        unaBase.changeControl.init();

        unaBase.loadInto.ready(skip_history, href);
        if (
          typeof window.Chat !== "undefined" &&
          uVar.enableChatOnline &&
          uVar.enableSocket
        ) {
          window.Chat.ping();
        }

        setTimeout(function() {
          unaBase.ui.unblock();
        }, 500);
      });
      if (typeof varData !== "undefined") {
        uVar.data = varData;
      }
    },
    // unaBase.loadInto.dialog
    // verificar dialog duplicado en linea 276
    dialog: function(href, title, size, iframe, back_url, aboveLoader= false) {
      const setAboveLoader = () => {
        $("div.ui-dialog").css("z-index", 99999);
      }
      if (!href) {
        console.log("No hay URL.");
        return false;
      }
      unaBase.loadInto.init(true);
      var tag = $('<div class="dialog" style="position: relative;"></div>');
      var width = "auto";
      var height = "auto";
      switch (size) {
        case "x-small":
          width = 240;
          height = 180;
          break;
        case "small":
          width = 480;
          height = 360;
          break;
        case "medium":
          width = 640;
          height = 480;
          break;
        case "large":
          width = 800;
          height = 576;
          break;
        case "x-large":
          width = 1000;
          height = 576;
          break;
        case "xx-large":
          width = 800;
          height = 600;
          break;
      }
      if (!iframe) {
        unaBase.ui.block();
        $.ajax({
          url: href,
          success: function(data) {
            unaBase.loadInto._dialog = true;

            if (title === null) {
              $(data).each(function() {
                if (this.localName == "title") {
                  title = this.text;
                  return false;
                }
              });
            }
            unaBase.toolbox.dialog = true;
            var element = tag.append(
              '<section id="dialog-viewport">' + data + "</section>"
            );
            //tag.prepend('<header style="position: static;"><nav id="dialog-menu"><ul></ul></nav></header>');
            tag.prepend(
              ' \
							<header style="position: static;">												\
								<fieldset class="toolbox" id="dialog-search">								\
									<legend>Búsqueda</legend>												\
									<label>																										\
										<input autocomplete="off" type="search" name="q" placeholder="Ingrese datos clave...">	\
									</label>																\
								</fieldset>																	\
								<nav class="toolbox" id="dialog-menu">										\
									<ul></ul>																\
								</nav>																		\
							</header>																		\
						'
            );

            tag.find("header").hide();
            tag.find("#dialog-search").hide();

            var dialog_content = $(".ui-dialog-content");
            if (!dialog_content.length) {
              element
                .dialog({
                  modal: true,
                  width: width,
                  height: height,
                  title: title,
                  beforeClose: function(event, ui) {
                    var target, retval;
                    if (!unaBase.toolbox.dialogDestroying) {
                      target = element.find('li[data-name^="cancel"] > button');
                      if (target.length == 1) target.click();
                      // verificar !
                      retval = !target.length == 1;
                    } else retval = true;
                    return retval;
                  },
                  close: function(event, ui) {
                    element.remove();
                    unaBase.toolbox.dialog = false;
                    unaBase.toolbox.dialogDestroying = false;
                  }
                })
                .dialog("open");
            } else {
              dialog_content.html(element.html());
            }

            // Si hay URL de referencia, se crea el botón para volver atrás
            if (typeof back_url != "undefined") {
              // alert('hay botón atrás, con URL: ' + back_url);
              var back_button = $(
                '<li><button class="back-to-url">Volver</button></li>'
              );
              back_button
                .find("button")
                .button({
                  icons: {
                    primary: "ui-icon-circle-arrow-w"
                  },
                  caption: "Volver"
                })
                .click(function() {
                  unaBase.loadInto.dialog(back_url);
                });
              $("#dialog-menu > ul").prepend(back_button);
            }

            unaBase.ui.unblock();

            if(aboveLoader) setAboveLoader();
          }
        });
      } else {
        unaBase.toolbox.dialog = true;
        unaBase.loadInto._dialog = true;
        unaBase.ui.block();
        var element = tag.html(
          '<iframe src="' +
            href +
            '" width="' +
            (width - 22) +
            '" height="' +
            (height - 42) +
            '" frameborder="0">'
        );
        element.find("iframe").load(function(event) {
          unaBase.ui.unblock();
        });
        element
          .dialog({
            modal: true,
            width: width,
            height: height,
            title: title,
            scrollbars: false,
            close: function(event, ui) {
              element.remove();
              unaBase.toolbox.dialog = false;
              unaBase.toolbox.dialogDestroying = false;
            }
          })
          .dialog("open")
          .css("overflow", "hidden");

        if(aboveLoader) setAboveLoader();
      }
    },
    // unaBase.loadInto._refresh
    _refresh: function(href) {
      $("html > body.menu > header > button.access").hide();

      // Actualizar barra de menú con la URL actual.
      var busqueda = /views\/[0-9a-zA-Z_\-]+/.exec(href);
      var modulo;
      // verificar modulo ya declarado
      if (busqueda) {
        var modulo = busqueda[0];

        $("html > body > aside > div > div > ul > li").each(function() {
          var test = /views\/[0-9a-zA-Z_\-]+/.exec(
            $(this)
              .find("a")
              .attr("href")
          );
          current = test === null ? null : test[0];
          if (current == modulo) {
            $(this).addClass("active");
            $("html > body.menu > header > button.access").show();
          } else {
            $(this).removeClass("active");
          }
        });
      } else {
        var busqueda_v2 = /\/[0-9a-zA-Z_\-\.]+/.exec(href);
        // verificar modulo_v2 ya declarado
        var modulo_v2;
        if (busqueda_v2) {
          var modulo_v2 = busqueda_v2[0];

          $("html > body > aside > div > div > ul > li").each(function() {
            var test_v2 = /\/[0-9a-zA-Z_\-\.]+/.exec(
              $(this)
                .find("a")
                .attr("href")
            );
            current_v2 = test_v2 === null ? null : test_v2[0];
            if (current_v2 == modulo_v2) {
              $(this).addClass("active");
              $("html > body.menu > header > button.access").show();
            } else {
              $(this).removeClass("active");
            }
          });
        }
      }
    }
  },

  // unaBase.toolbox
  toolbox: {

    reload: function() {
      var location = unaBase.history.current();
      unaBase.loadInto.viewport(
        location.url,
        location.standalone,
        undefined,
        true
      );
    },
    dialog: false,
    dialogDestroying: false,
    // unaBase.toolbox.init
    init: function() {
      firstSearch = false;

      unaBase.toolbox.destroy();
      if (!unaBase.toolbox.dialog) $(".toolbox").hide();
    },
    // unaBase.toolbox.destroy
    destroy: function() {
      unaBase.toolbox.search.destroy();
      unaBase.toolbox.menu.destroy();
    },
    // unaBase.toolbox.search
    search: {
      savedSearch: null,
      lastSearchNotify: null,
      lastEndOfRecordNotify: [],
      q: "",
      q2: "",
      pageScroll: null,
      newSearch: false,
      _disabled: false,

      // unaBase.toolbox.search.init
      init: function(params) {
        // Guardado de ítems de búsqueda con checkboxes
        var selectedItems = [];
        var selectedItemsLength = 0;

        if (params.hideSearchBox) {
          $('input[name="q"]')
            .closest("label")
            .hide();
        } else {
          $('input[name="q"]')
            .closest("label")
            .show();
        }
        unaBase.toolbox.search.destroy();
        var search = unaBase.toolbox.dialog
          ? $("#dialog-search")
          : $("#search");

        //if (unaBase.toolbox.dialog)
        //	menu.parentTo('.ui-dialog').find('header').show();

        //unaBase.toolbox.init();

        unaBase.toolbox.search.initialized = true;
        unaBase.toolbox.search.q = "";
        unaBase.toolbox.search.q2 = "";
        unaBase.toolbox.search.pageScroll = null;
        unaBase.toolbox.search.newSearch = true;
        if (!unaBase.toolbox.dialog) {
          unaBase.toolbox.search.advancedFilter = {};
        }

        if (
          unaBase.toolbox.search.savedSearch === null ||
          unaBase.toolbox.search.savedSearch == "q=" ||
          unaBase.toolbox.dialog
        ) {
          console.debug("set search disabled to false");
          unaBase.toolbox.search._disabled = false;
        }
        //unaBase.toolbox.search.username = $('body > aside > div > div > h1').data('username');

        search.find("> label > input").val("");
        search.show();

        search.find("> fieldset").hide();
        search.find("> button").removeClass("active");
        search.find("> button").removeClass("enabled");

        //var filters = $('<div></div>');
        search
          .find("> label:nth-of-type(2)")
          .nextAll()
          .remove();
        var filters = search;
        //filters.append('<div class="checkboxes" style="position: absolute; top: 30px"></div>');
        //search.append('<div class="checkboxes" style="position: absolute; top: 30px"></div>');
        search.append(
          '<div class="checkboxes" style="display: inline-block; margin-top: 5px;"></div>'
        );
        /*
				if (typeof params.filters != 'undefined' && params.filters.length > 0)
					search.parent().addClass('full-height');
				else
					search.parent().removeClass('full-height');
				*/
        for (var i in params.filters) {
          if (params.filters[i].caption != "") {
            switch (params.filters[i].type) {
              case "month":
                if (params.filters[i].range) {
                  //filters+= '<span class="title">' + params.filters[i].caption + '</span>';
                  //filters+= '<label class="half-width"><span>Desde</span><input type="month" name="' + params.filters[i].name + '_from"></label>';
                  //filters+= '<label class="half-width"><span>Hasta</span><input type="month" name="' + params.filters[i].name + '_to"></label>';

                  var label = $(
                    '<label title="' +
                      params.filters[i].caption +
                      '" class="date"></label>'
                  );
                  label.append(
                    '<button class="filter date">' +
                      params.filters[i].caption +
                      "</button>"
                  );
                  var date = new Date();
                  var currentMonth =
                    date.getFullYear() +
                    "-" +
                    sprintf("%02d", (date.getMonth() + 1).toString());
                  var currentYear = date.getFullYear();
                  // verificar date ya definido
                  if (params.filters[i].currentMonth) {
                    var date = new Date();
                    label.append(
                      '<input autocomplete="off" placeholder="0000-00" type="text" name="' +
                        params.filters[i].name +
                        '" value="' +
                        currentMonth +
                        '" style="width: 40px; margin-left: 4px">'
                    );
                  } else {
                    if (
                      typeof params.filters[i].currentYear != "undefined" &&
                      params.filters[i].currentYear
                    )
                      label.append(
                        '<input autocomplete="off"  placeholder="0000-00" type="text" name="' +
                          params.filters[i].name +
                          '" value="' +
                          currentYear +
                          '" style="width: 40px; margin-left: 4px">'
                      );
                    else
                      label.append(
                        '<input autocomplete="off"  placeholder="0000-00" type="text" name="' +
                          params.filters[i].name +
                          '" style="width: 40px; margin-left: 4px">'
                      );
                  }
                  label.append(
                    '<button class="clear date">Quitar filtro ' +
                      params.filters[i].caption +
                      "</button>"
                  );

                  filters.append(label);

                  (function(name, filters) {
                    filters
                      .find(".filter.date")
                      .button({
                        text: false,
                        icons: {
                          primary: "ui-icon-calendar"
                        }
                      })
                      .unbind("click")
                      .click(function(event) {
                        $(event.target)
                          .closest("label")
                          .find('[name="' + name + '"]')
                          .monthpicker("show");
                        //var id = filters.find('[name="' + name + '"]').attr('id');
                      });

                    filters
                      .find("button.clear.date")
                      .button({
                        text: false,
                        icons: {
                          primary: "ui-icon-circle-close"
                        }
                      })
                      .unbind("click")
                      .click(function(event) {
                        $(event.target)
                          .closest("label")
                          .find("input")
                          .val("");
                        // $(event.target).closest('label').find('input').data('changed', false);
                        $(event.target)
                          .closest("label")
                          .find("input")
                          .data("changed", true);
                        advancedSearch();
                      });

                    filters.find('[name="' + name + '"]').monthpicker({
                      changeMonth: true,
                      changeYear: true,
                      yearRange: "c-10:c+3",
                      onSelect: function(event) {
                        filters.find("button.clear.date").show();
                        //filters.find('[name="' + name + '"]').trigger('change');
                        //filters.find('[name="' + name + '"]').trigger('keydown');
                        advancedSearch();
                      }
                    });
                  })(params.filters[i].name, filters);
                } else {
                  //filters+= '<label><span>' + params.filters[i].caption + '</span><input type="month" name="' + params.filters[i].name + '"></label>';
                }
                break;
              case "year":
                var label = $(
                  '<label title="' +
                    params.filters[i].caption +
                    '" class="date"></label>'
                );
                label.append(
                  '<button class="filter date">' +
                    params.filters[i].caption +
                    "</button>"
                );
                var date = new Date();
                var currentMonth =
                  date.getFullYear() +
                  "-" +
                  sprintf("%02d", (date.getMonth() + 1).toString());
                var currentYear = date.getFullYear();

                // if (params.filters[i].currentMonth) {
                // 	var date = new Date();
                // 	label.append('<input placeholder="0000-00" type="text" name="' + params.filters[i].name + '" value="'+ currentMonth +'" style="width: 40px; margin-left: 4px">');
                // }else{
                // 	if (typeof params.filters[i].currentYear != 'undefined' && params.filters[i].currentYear)
                // 		label.append('<input placeholder="0000-00" type="text" name="' + params.filters[i].name + '" value="'+ currentYear +'" style="width: 40px; margin-left: 4px">');
                // 	else
                // 		label.append('<input placeholder="0000-00" type="text" name="' + params.filters[i].name + '" style="width: 40px; margin-left: 4px">');
                // }
                label.append(
                  '<select name="' +
                    params.filters[i].name +
                    '" style="width: 60px; margin-left: 20px;">'
                );
                var filter = label.find(
                  '[name="' + params.filters[i].name + '"]'
                );
                for (var y = currentYear; y >= currentYear - 10; y--) {
                  filter.append(
                    '<option value="' +
                      y +
                      '"' +
                      (y == currentYear ? " selected" : "") +
                      ">" +
                      y +
                      "</option>"
                  );
                }
                filter.bind("change", function(event) {
                  advancedSearch();
                });

                filters.append(label);

                // (function(name, filters) {
                //
                // 	filters.find('.filter.date').button({
                // 		text: false,
                // 		icons: {
                // 			primary: 'ui-icon-calendar'
                //
                // 		}
                // 	}).unbind('click').click(function(event) {
                // 		$(event.target).closest('label').find('[name="' + name + '"]').monthpicker('show');
                // 	});
                //
                // 	filters.find('[name="' + name + '"]').monthpicker({
                // 		changeMonth: false,
                // 		changeYear: true,
                // 		yearRange: 'c-10:c+3',
                // 		onSelect: function(event) {
                // 			//filters.find('button.clear.date').show();
                // 			//filters.find('[name="' + name + '"]').trigger('change');
                // 			//filters.find('[name="' + name + '"]').trigger('keydown');
                // 			advancedSearch();
                // 		}
                // 	});
                // })(params.filters[i].name, filters);

                break;
              case "checkbox":
                //filters+= '<span class="title">' + params.filters[i].caption + '</span>';
                //for (j in params.filters[i].options) {
                //	filters+= '<label class="checkbox">' + params.filters[i].options[j].caption + ' <input type="checkbox" name="' + ((params.filters[i].options[j].name)? params.filters[i].options[j].name : params.filters[i].name ) + '" value="true"' + ((params.filters[i].options[j].value)? ' checked' : '') + '></label>';
                //}

                for (j in params.filters[i].options) {
                  if (params.filters[i].options[j].name != "") {
                    // if(params.filters[i].options[j].name != "" && typeof params.filters[i].options[j].name != "undefined"){
                    filters
                      .find(".checkboxes")
                      .append(
                        '<label style="margin-right: 10px;"><input type="checkbox" name="' +
                          (params.filters[i].options[j].name
                            ? params.filters[i].options[j].name
                            : params.filters[i].name) +
                          '" value="true"' +
                          (params.filters[i].options[j].value
                            ? " checked"
                            : "") +
                          "> " +
                          params.filters[i].options[j].caption +
                          "</label>"
                      );

                    // }
                  }
                }
                break;
              case "radio":
                //filters+= '<span class="title">' + params.filters[i].caption + '</span>';
                //for (j in params.filters[i].options) {
                //	filters+= '<label class="checkbox">' + params.filters[i].options[j].caption + ' <input type="checkbox" name="' + ((params.filters[i].options[j].name)? params.filters[i].options[j].name : params.filters[i].name ) + '" value="true"' + ((params.filters[i].options[j].value)? ' checked' : '') + '></label>';
                //}

                for (j in params.filters[i].options) {
                  filters
                    .find(".checkboxes")
                    .append(
                      '<label style="margin-right: 10px;"><input class="' +
                        (params.filters[i].preventSearch
                          ? "prevent-search"
                          : "") +
                        '" type="radio" name="' +
                        (params.filters[i].options[j].name
                          ? params.filters[i].options[j].name
                          : params.filters[i].name) +
                        '" value="true"' +
                        (params.filters[i].options[j].value ? " checked" : "") +
                        "> " +
                        params.filters[i].options[j].caption +
                        "</label>"
                    );
                }
                break;
              case "text":
                //filters+= '<label><span>' + params.filters[i].caption + '</span><input type="text" name="' + params.filters[i].name + '"></label>';
                break;
              case "autocomplete":
                //filters+= '<label><span>' + params.filters[i].caption + '</span><input id="autocomplete_' + params.filters[i].name + '" type="search" name="' + params.filters[i].name + '"><button class="show ' + params.filters[i].name + '"></button></label>';
                filters.append(
                  '<label class="autocomplete" title="' +
                    params.filters[i].caption +
                    '" style="margin-right: 10px;"><span>' +
                    params.filters[i].caption +
                    '</span><input style="width: 80px;border-radius: none; margin-right: 2px;" id="autocomplete_' +
                    params.filters[i].name +
                    '" type="search" name="' +
                    params.filters[i].name +
                    '" placeholder="' +
                    params.filters[i].caption +
                    '"><button style="height: 22px;" class="show ' +
                    params.filters[i].name +
                    ' boton"></button></label>'
                );
                break;
              case "multiple":
                //filters.append('<label class="autocomplete" title="'+ params.filters[i].caption + '" style="margin-right: 10px;"><span>' + params.filters[i].caption + '</span><input style="width: 80px;border-radius: none; margin-right: 2px;" id="autocomplete_' + params.filters[i].name + '" type="search" name="' + params.filters[i].name + '" placeholder="' + params.filters[i].caption + '"><button style="height: 22px;" class="show ' + params.filters[i].name + ' boton"></button></label>');

                // test
                var button = {
                  name: params.filters[i].name,
                  icons: {
                    primary: "ui-icon-search",
                    secondary: "ui-icon-triangle-1-s"
                  },
                  caption: params.filters[i].caption,
                  action: function(event) {
                    var buttonObject = $(event.target).closest("button");
                    var dataSource = buttonObject.data("source");
                    var url =
                      "/v3/script/multiselect.shtml?datasource=" + dataSource;
                    buttonObject.data("url", url);
                    buttonObject.tooltipster({
                      content: function() {
                        var styles = {
                          width: "300px",
                          backgroundColor: "white"
                        };
                        var htmlObject = $("<div>");
                        htmlObject.css(styles);
                        htmlObject.load(url);
                        return htmlObject;
                      },
                      interactive: true,
                      interactiveTolerance: 5000,
                      trigger: "click",
                      position: "bottom",
                      theme: "tooltipster-custom-theme"
                      //interactiveAutoClose: true
                    });
                    buttonObject.tooltipster("show");
                  }
                };

                //filters.append('<label class="autocomplete" title="'+ params.filters[i].caption + '" style="margin-right: 10px;"><span>' + params.filters[i].caption + '</span><input style="width: 80px;border-radius: none; margin-right: 2px;" id="autocomplete_' + params.filters[i].name + '" type="search" name="' + params.filters[i].name + '" placeholder="' + params.filters[i].caption + '"><button style="height: 22px;" class="show ' + params.filters[i].name + ' boton"></button></label>');
                button_container = $(
                  '<label class="autocomplete multiple" title="' +
                    params.filters[i].caption +
                    '"><button data-name="' +
                    params.filters[i].name +
                    '" data-source="' +
                    params.filters[i].dataSource +
                    '">' +
                    button.caption +
                    "</button></label>"
                );
                button_container
                  .find("button")
                  .button({
                    icons:
                      typeof button.icon != "undefined"
                        ? {
                            primary: button.icon
                          }
                        : button.icons
                  })
                  .click(button.action);
                filters.append(button_container);

                break;
              case "date_advanced":
                var hiddenDiv = $(
                  '<div data-name="' +
                    params.filters[i].name +
                    '" style="display: none;"></div>'
                );

                var optionsNode = $("<ul></ul>");
                for (
                  var j = 0, len = params.filters[i].options.length;
                  j < len;
                  j++
                ) {
                  var optionNode = $(
                    '\
										<li data-name="' +
                      params.filters[i].options[j].name +
                      '" style="font-size: 12px; margin-bottom: 5px; margin-right: 5px; display: inline-block; border: 1px solid lightgrey; border-radius: 5px;">				\
											<label>																				\
												<!--<span																			\
													style="display: block; margin-bottom: 2px;">								\
													' +
                      params.filters[i].options[j].caption +
                      '</span>	-->						\
												<label style="width: 101px; margin-left: 2px; margin-right: 2px;				\
													border: 1px solid lightgrey; display: inline-block; padding-top: 1px;		\
													border-radius: 5px; background-color: white; padding-bottom: 1px;			\
													padding-left: 1px;">														\
													<button class="filter date ui-button ui-widget ui-state-default				\
														ui-corner-all ui-button-icon-only" role="button" aria-disabled="false"	\
														style="width: 24px; height: 21px;">										\
														<span class="ui-button-icon-primary ui-icon ui-icon-calendar"></span>	\
														<span class="ui-button-text"></span>									\
													</button>																	\
													<input style="width: 40px; margin-left: 4px; font-size: 10px;" type="text"	\
														name="' +
                      params.filters[i].options[j].name +
                      '_from">					\
													<button style="width: 24px; height: 21px;" class="clear date ui-button		\
														ui-widget ui-state-default ui-corner-all ui-button-icon-only"			\
														role="button" aria-disabled="false"	title="Quitar filtro">				\
														<span class="ui-button-icon-primary ui-icon								\
															ui-icon-circle-close"></span>										\
														<span class="ui-button-text"></span>									\
													</button>																	\
												</label>																		\
												<label style="width: 101px; margin-left: 2px; margin-right: 2px;				\
													border: 1px solid lightgrey; display: inline-block; padding-top: 1px;		\
													border-radius: 5px; background-color: white; padding-bottom: 1px;			\
													padding-left: 1px;">														\
													<button class="filter date ui-button ui-widget ui-state-default				\
														ui-corner-all ui-button-icon-only" role="button" aria-disabled="false"	\
														style="width: 24px; height: 21px;">										\
														<span class="ui-button-icon-primary ui-icon ui-icon-calendar"></span>	\
														<span class="ui-button-text"></span>									\
													</button>																	\
													<input style="width: 40px; margin-left: 4px; font-size: 10px;" type="text"	\
														name="' +
                      params.filters[i].options[j].name +
                      '_to">					\
													<button style="width: 24px; height: 21px;" class="clear date ui-button		\
														ui-widget ui-state-default ui-corner-all ui-button-icon-only"			\
														role="button" aria-disabled="false"	title="Quitar filtro">				\
														<span class="ui-button-icon-primary ui-icon								\
															ui-icon-circle-close"></span>										\
														<span class="ui-button-text"></span>									\
													</button>																	\
												</label>																		\
											</label>																			\
										</li>																					\
									'
                  );

                  optionsNode
                    .find("button.clear.date")
                    .first()
                    .click(function(event) {
                      $(event.target)
                        .closest("label")
                        .find("input")
                        .val("");
                    });

                  optionsNode
                    .find("button.clear.date")
                    .last()
                    .click(function(event) {
                      $(event.target)
                        .closest("label")
                        .find("input")
                        .val("");
                    });

                  optionNode
                    .find(
                      '[name="' + params.filters[i].options[j].name + '_from"]'
                    )
                    .monthpicker({
                      changeMonth: true,
                      changeYear: true,
                      yearRange: "c-10:c+3",
                      onSelect: function(event) {
                        //filters.find('button.clear.date').show();
                        //advancedSearch();
                      }
                    });
                  optionNode
                    .find(
                      '[name="' + params.filters[i].options[j].name + '_to"]'
                    )
                    .monthpicker({
                      changeMonth: true,
                      changeYear: true,
                      yearRange: "c-10:c+3",
                      onSelect: function(event) {
                        //filters.find('button.clear.date').show();
                        //advancedSearch();
                      }
                    });

                  if (!params.filters[i].options[j].default) optionNode.hide();

                  optionsNode.append(optionNode);
                }
                /*
								var searchButton = $('<button class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary" role="button" aria-disabled="false"><span class="ui-button-icon-primary ui-icon ui-icon-search"></span><span class="ui-button-text">Aplicar búsqueda</span></button>');
								searchButton.click(function() {
									//filters.find('div[data-name="' + params.filters[i].name + '"]').hide();
									$('button.show.' + params.filters[i].name).closest('label').show();
									advancedSearch();
								});

								var closeButton = $('<button class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary" role="button" aria-disabled="false"><span class="ui-button-icon-primary ui-icon ui-icon-triangle-1-n"></span><span class="ui-button-text">Menos</span></button>');
								closeButton.click(function() {
									//filters.find('div[data-name="' + params.filters[i].name + '"]').hide();
									//$('button.show.' + params.filters[i].name).closest('label').show();
									// esconder buscador y aplicar busqueda normal
									advancedSearch();
								});
								//optionsNode.append(searchButton);
								optionsNode.append(searchButton).append(closeButton);
								*/

                var buttons = $(
                  '\
									<div style="display: inline-block;">\
										<button class="search-button ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary" role="button" aria-disabled="false"><span class="ui-button-icon-primary ui-icon ui-icon-search"></span><span class="ui-button-text">Aplicar búsqueda</span></button>\
										<button class="close-button ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary" role="button" aria-disabled="false"><span class="ui-button-icon-primary ui-icon ui-icon-triangle-1-n"></span><span class="ui-button-text">Menos</span></button>\
										<button><span>dummy</span></button>\
									</div>\
								'
                );

                buttons.find("button.search-button").click(function() {
                  //$('button.show.' + params.filters[i].name).closest('label').show();
                  advancedSearch();
                });

                buttons.find("button.close-button").click(function() {
                  $('div[data-name="' + params.filters[i].name + '"]')
                    .find("select")
                    .val("none")
                    .trigger("change"); // cancelar filtro más
                  $('div[data-name="' + params.filters[i].name + '"]').hide(); // ocultar div
                  $("button.show." + params.filters[i].name)
                    .closest("label")
                    .show(); // mostrar botón busqueda más
                  advancedSearch();
                });

                buttons.appendTo(optionsNode);

                var htmlObject = $('<div style="margin-top: 10px;">');

                var selectorNode = $("<select></select>");
                selectorNode.append(
                  $('<option value="none selected">Ninguna</option>')
                );
                for (
                  var j = 0, len = params.filters[i].options.length;
                  j < len;
                  j++
                ) {
                  selectorNode.append(
                    $(
                      '<option value="' +
                        params.filters[i].options[j].name +
                        '">' +
                        params.filters[i].options[j].caption +
                        "</option>"
                    )
                  );
                }
                selectorNode
                  .bind("change", function(event) {
                    var name = $(event.target).val();
                    if (name == "none") {
                      optionsNode.find("li").hide();
                      optionsNode
                        .find("li")
                        .find("input")
                        .each(function(key, item) {
                          $(item).val("");
                        });
                    } else {
                      optionsNode
                        .find('li:not([data-name="' + name + '"])')
                        .hide();
                      optionsNode
                        .find('li:not([data-name="' + name + '"])')
                        .find("input")
                        .each(function(key, item) {
                          $(item).val("");
                        });

                      if (defaultValue != "") {
                        var index = fastArrayObjectSearch(
                          params.filters[i].options,
                          "name",
                          name
                        );
                        if (index != -1) {
                          var currentMonth =
                            date.getFullYear() +
                            "-" +
                            sprintf("%02d", (date.getMonth() + 1).toString());
                          var currentYear = date.getFullYear();
                          var defaultValue = "";
                          if (params.filters[i].options[index].currentMonth) {
                            defaultValue = currentMonth;
                          }
                          if (params.filters[i].options[index].currentYear) {
                            defaultValue = currentYear;
                          }
                          optionsNode
                            .find('li[data-name="' + name + '"]')
                            .find('[name="' + name + '_from"]')
                            .val(defaultValue);
                          optionsNode
                            .find('li[data-name="' + name + '"]')
                            .find('[name="' + name + '_to"]')
                            .val(defaultValue);
                        }
                      }

                      optionsNode.find('li[data-name="' + name + '"]').show();
                    }
                  })
                  .trigger("change");

                htmlObject.append(selectorNode);
                htmlObject.append(optionsNode);

                hiddenDiv.append(htmlObject);

                filters
                  .find('div[data-name="' + params.filters[i].name + '"]')
                  .remove();
                filters.append(hiddenDiv);

                button_container = $(
                  '<label style="position: relative; top: -2px;" title="' +
                    params.filters[i].caption +
                    '"><button class="show ' +
                    params.filters[i].name +
                    '"></button></label>'
                );
                button_container
                  .find("button")
                  .button({
                    icons: {
                      primary: "ui-icon-search",
                      secondary: "ui-icon-triangle-1-s"
                    },
                    label: params.filters[i].caption
                  })
                  .click(function(event) {
                    /*$(event.target).tooltipster({
										content: function() {
											var htmlObject = filters.find('div[data-name="' + params.filters[i].name + '"] div');
											return htmlObject;
										},
										interactive: true,
										trigger: '',
										delay: 0,
										interactiveAutoClose: true
									});
									$(event.target).tooltipster('show');*/

                    hiddenDiv.toggle();

                    $(event.target)
                      .closest("label")
                      .hide();
                    // cambiar tag del boton segun abierto o cerrado

                    if (!hiddenDiv.is(":hidden")) {
                      var index = fastArrayObjectSearch(
                        params.filters[i].options,
                        "default",
                        true
                      );
                      if (index != -1) {
                        filters
                          .find(
                            'div[data-name="' + params.filters[i].name + '"]'
                          )
                          .find("select")
                          .val(params.filters[i].options[index].name)
                          .change();
                      }
                    } else {
                      filters
                        .find('div[data-name="' + params.filters[i].name + '"]')
                        .find("select")
                        .val("none")
                        .change();
                    }
                  });
                filters.append(button_container);
                break;
              default:
                //filters+= '<label><span>' + params.filters[i].caption + '</span><input type="text" name="' + params.filters[i].name + '"></label>';
                break;
            }
          }
        }

        search.find("> fieldset > label").remove();
        search.find("> fieldset > span").remove();

        if (!params.hideSearchBox && params.doubleSearch) {
          $('input[name="q2"]')
            .closest("label")
            .show();
          if (params.secondarySearchCaption) {
            $('input[name="q2"]').attr(
              "placeholder",
              params.secondarySearchCaption
            );
          }
        } else {
          $('input[name="q2"]')
            .closest("label")
            .hide();
        }

        //$('#search > fieldset > legend').after(filters);

        //$('#search > label:first-of-type').nextAll().remove();

        //$('#search > label').after(filters.children());

        // buscar a medida que se modifican los campos
        //search.find('input:not([type="search"])').change(function() {
        //search.find('input').unbind('change').bind('change', function() {
        var updateSearchFilter = function(event) {
          //if (event.isTrigger != 3) {
          var areChecked = false;
          var checkboxes = search.find('input[type="checkbox"]');
          if (checkboxes.length > 1) {
            checkboxes.each(function() {
              areChecked |= $(this).prop("checked");
            });
            if (areChecked) advancedSearch();
          } else advancedSearch();
          //}
        };
        search
          .find('input:not([type="search"]):not(.prevent-search)')
          .unbind("change")
          .bind("change", function(event) {
            if (event.isTrigger != 3) updateSearchFilter(event);
          });

        search
          .find('input:not([type="search"]):not(.prevent-search)')
          .unbind("update")
          .bind("update", updateSearchFilter);

        for (var i in params.filters) {
          if (params.filters[i].type == "autocomplete") {
            (function(filter) {
              $("#autocomplete_" + filter.name).autocomplete({
                source: function(request, response) {
                  var dataset = {
                    id: null,
                    text: "Sin filtro"
                  };
                  if (typeof filter.dataSource != "undefined") {
                    var data = {
                      q: request.term
                    };
                    if (typeof filter.data != "undefined")
                      $.extend(data, filter.data);

                    $.ajax({
                      url: "/4DACTION/_V3_" + filter.dataSource,
                      dataType: "json",
                      data: data,
                      success: function(data) {
                        data.rows.unshift(dataset);
                        response(
                          $.map(data.rows, function(item) {
                            return {
                              label: item.text,
                              value: item.id
                            };
                          })
                        );
                      }
                    });
                  } else {
                    if (filter.dataObject[0].text != dataset.text)
                      filter.dataObject.unshift(dataset);
                    response(
                      $.map(filter.dataObject, function(item) {
                        if (
                          item.text.indexOf(request.term) != -1 ||
                          request.term == "" ||
                          request.term == "@"
                        )
                          return {
                            label: item.text,
                            value: item.id
                          };
                      })
                    );
                  }
                },
                minLength: 1,
                autoFocus: false,
                position: {
                  my: "left top",
                  at: "left bottom",
                  collision: "flip"
                },
                response: function(event, ui) {
                  $(this).data("value", null);
                },
                focus: function(event, ui) {
                  $(this).val(ui.item.label);
                  return false;
                },
                select: function(event, ui) {
                  if (ui.item.value === null) $(this).val("");
                  else $(this).val(ui.item.label);
                  $(this).data("value", ui.item.value);
                  //$(this).trigger('change');

                  //$(this).parentTo('fieldset').find('[name="q"]').trigger('keypress');
                  advancedSearch();
                  //$('#search').find('[name="q"]').trigger('keypress');
                  return false;
                },
                open: function() {
                  $(this)
                    .removeClass("ui-corner-all")
                    .addClass("ui-corner-top");
                },
                close: function() {
                  $(this)
                    .removeClass("ui-corner-top")
                    .addClass("ui-corner-all");
                }
              });

              search
                .find("button.show." + filter.name)
                .button({
                  icons: {
                    primary: "ui-icon-carat-1-s"
                  },
                  text: false
                })
                .click(function() {
                  $("#autocomplete_" + filter.name)
                    .autocomplete("search", "@")
                    .focus();
                });
            })(params.filters[i]);
          }
        }

        search
          .find('input[type="checkbox"]:not(.prevent-search)')
          .change(function(event) {
            var areChecked = false;
            search.find('input[type="checkbox"]').each(function(key, item) {
              areChecked |= $(item).prop("checked");
            });
            if (!areChecked) {
              event.stopPropagation();
              search.find('input[type="checkbox"]').each(function(key, item) {
                $(item).prop("checked", true);
              });
              $(this).triggerHandler("change");
            }
          });

        search.find('input[type="radio"]').change(function(event) {
          event.stopPropagation();
          search.find('input[type="radio"]').each(function(key, item) {
            $(item).prop(
              "checked",
              $(item).prop("name") === $(event.target).prop("name")
            );
          });
          if ($(event.target).hasClass("prevent-search")) {
            advancedSearch();
          }
        });

        // FIXME: ver si sirven los dos próximos eventos
        search.find("> fieldset > button:first-of-type").click(function() {
          advancedSearch();
          $(this)
            .parent()
            .toggle();
          search.find("> button").removeClass("active");
          search.find("> button").addClass("enabled");
        });

        search.find("> fieldset > button:last-of-type").click(function() {
          advancedSearch();
          $(this)
            .parent()
            .toggle();
          search.find("> button").removeClass("active");
          search.find("> button").removeClass("enabled");
        });

        //var viewport = (unaBase.toolbox.dialog)? search.parentTo('.ui-dialog').find('.ui-dialog-content') : $('#viewport');
        var viewport = unaBase.toolbox.dialog
          ? $("#dialog-viewport")
          : $("#viewport");

        // Si no tiene definido un row, no hacer que los rows sean seleccionables
        if (typeof params.row != "undefined")
          viewport
            .find(
              "table.results" +
                (typeof params.container != "undefined"
                  ? "." + params.container
                  : "") +
                " > tbody, table.selectable"
            )
            .bind("mousedown", function(event) {
              //event.metaKey = true;
            })
            .selectable({
              filter: "tr",
              distance: 0,
              stop: function(event, ui) {
                $(event.target)
                  .children(".ui-selected")
                  .not(":first")
                  .removeClass("ui-selected");
              }
            });

        var formatCurrency = function() {
          // siempre debe ser relativo al viewport actual
          // para evitar romper el formato de otros contenedores
          viewport.find("table.results .currency").formatCurrency({
            region: "es-CL",
            decimalSymbol: ",",
            digitGroupSymbol: ".",
            roundToDecimalPlace: currency.decimals,
            symbol: '<span class="symbol">' + currency.symbol + "</span>",
            positiveFormat: currency.is_right ? "%n%s" : "%s%n",
            negativeFormat: currency.is_right ? "-%n%s" : "-%s%n"
          });

          viewport.find("table.results .percent").formatCurrency({
            region: "es-CL",
            decimalSymbol: ",",
            digitGroupSymbol: ".",
            roundToDecimalPlace: 2,
            symbol: '<span class="symbol">%</span>',
            negativeFormat: "-%n%s",
            positiveFormat: "%n%s"
          });
        };

        var listHeight = parseInt($(window).height()) - 200;

        var appendResult = function(
          pageNumber,
          query,
          sortBy,
          sortOrder,
          advancedFilter,
          query2
        ) {
          if (!unaBase.toolbox.search.initialized) return false;

          var ajaxParams = {
            page: pageNumber,
            results: vResults ? vResults : Math.round(listHeight / 5),
            q: query,
            q2: query2
          };

          var sortParams = {};
          // viewport.find('table > thead > tr > th').each(function() {
          viewport
            .find(
              "table.results" +
                (typeof params.container != "undefined"
                  ? "." + params.container
                  : "") +
                " > thead > tr > th"
            )
            .each(function() {
              if (typeof $(this).data("sort-order") != "undefined") {
                sortParams = {
                  sort_by: $(this).data("sort-by"),
                  sort_order: $(this).data("sort-order")
                };
                return false;
              }
            });

          $.extend(ajaxParams, ajaxParams, sortParams);

          $.extend(ajaxParams, ajaxParams, advancedFilter);

          var cantRegistrosEncontrados = 0;
          if (typeof params.data != "undefined")
            $.extend(ajaxParams, params.data);

          //if (typeof unaBase.toolbox.search._disabled == "undefined" || (typeof unaBase.toolbox.search._disabled != "undefined" && unaBase.toolbox.search._disabled == false))  {
          unaBase.ui.block();

          $.ajax({
            url: params.url(),
            type: "GET",
            data: ajaxParams,
            dataType: "json",
            cache: "false",
            beforeSend: function() {
              viewport
                .find(
                  "table.results" +
                    (typeof params.container != "undefined"
                      ? "." + params.container
                      : "")
                )
                .hide();
              var div = $(
                '<div style="text-align:left;font-weight: bold;padding-top:10px" class="buscando">Cargando...</div>'
              );
              viewport.prepend(div);
              $("p.not_found_msg").hide();
            },
            complete: function() {
              viewport.find("div.buscando").remove();
              viewport
                .find(
                  "table.results" +
                    (typeof params.container != "undefined"
                      ? "." + params.container
                      : "")
                )
                .show();

              // Guardado de ítems de búsqueda con checkboxes
              console.log(
                "Después de ejecutar búsqueda, se añaden los ítems con checkboxes al principio de los resultados."
              );

              var selectedItemsTemp = selectedItems;
              while (selectedItems.length > 0) {
                var item = selectedItems.pop();
                var id_item = item.data("id");
                if (
                  $('[name="selected_one"]')
                    .closest("tbody")
                    .find('tr[data-id="' + id_item + '"]').length != 0
                ) {
                  $('[name="selected_one"]')
                    .closest("tbody")
                    .find('tr[data-id="' + id_item + '"]')
                    .remove();
                }
                $('[name="selected_one"]')
                  .closest("tbody")
                  .prepend(item);
              }
              selectedItems = selectedItemsTemp;

              // agregado el 20-10-16 - gin
              if (cantRegistrosEncontrados == 0 && selectedItemsLength == 0) {
                viewport.find("table.results").hide();
              }
            }
          }).done(function(data) {
            var module = $('html > body > aside > div > div > ul > li[class="active"]').data(
              "name"
            );

            // if (data.records.total > 0)
            // 	viewport.find('table > thead').show();
            // else {
            // 	viewport.find('table > thead').hide();
            // 	viewport.find('table > tfoot').html(
            // 		'<tr><th colspan="' + (colspan + 1) + '">No se encontró ' + params.inflection.none + ' ' + params.inflection.singular +  '</th></tr>'
            // 	);
            // }
            cantRegistrosEncontrados = data.records.total + selectedItemsLength;

            if (data.records.total > 0 || selectedItemsLength > 0) {
              viewport.find("div.no-results").remove();
              // viewport.find('table' + ).show();
              viewport
                .find(
                  "table.results" +
                    (typeof params.container != "undefined"
                      ? "." + params.container
                      : "")
                )
                .show();
              // viewport.find('table.results').show();
              $("label.date").css("border", "0");
            } else {
              // viewport.find('table').hide();
              viewport
                .find(
                  "table.results" +
                    (typeof params.container != "undefined"
                      ? "." + params.container
                      : "")
                )
                .hide();
              viewport.find("div.no-results").remove();
              //var div = $('<div style="text-align: center; font-weight: bold; text-transform: uppercase; padding-top: 10px;" class="no-results">No se encontró <span class="string-1"></span> <span class="string-2"></span></div>');
              /*div.find('span.string-1').text(params.inflection.none);
								div.find('span.string-2').text(params.inflection.singular);*/
              // var div = $('<div style="margin: auto; border-radius: 200px; width: 350px; height: 350px;background-color: #00a972;font-size:14px; margin-top: 3em; text-align: center; font-weight: bold; text-transform: uppercase; padding-top: 10px;" class="no-results"><p class="not_found_msg" style="margin: 140px 5px 100px 5px; color: white"></p></div>');
              var div =
                '<div style="margin: auto; font-size:14px; margin-top: 3em; text-align: center; font-weight: bold; text-transform: uppercase; padding-top: 10px;" class="no-results"><p class="not_found_msg" style="margin: 140px 5px 100px 5px; color: #00a972"></p></div>';

              let today = new Date().toLocaleDateString().replace(/\//g, "-");
              let todayDate = parseInt(today.slice(0, 2));
              let divIndex = div.indexOf("</p>");
              if (
                todayDate < 5 &&
                $('input[name="fecha_asignacion"]').val() != ""
              ) {
                let msg =
                  "NO SE ENCONTRÓ NINGÚN RESULTADO. <br> ES POSIBLE QUE LA INFORMACIÓN QUE ESTÁS BUSCANDO CORRESPONDA A UNA FECHA ANTERIOR.";
                div = div.slice(0, divIndex) + msg + div.slice(divIndex);
                $("label.date").css("border", "4px solid #00a972");
              } else {
                let msg =
                  "NO SE ENCONTRÓ NINGÚN RESULTADO. VERIFIQUE LOS FILTROS.";
                div = div.slice(0, divIndex) + msg + div.slice(divIndex);
              }

              viewport.prepend(div);
            }

            //params.totales(data);

            if (unaBase.toolbox.search.lastSearchNotify)
              unaBase.toolbox.search.lastSearchNotify.remove();

            // unaBase.toolbox.search.lastSearchNotify = toastr.info( ((data.records.total > 0)? 'Se encontró un total de ' + data.records.total  + ((data.records.total > 1)? ' ' + params.inflection.plural : ' ' + params.inflection.singular) : 'No se encontró ' + params.inflection.none + ' ' + params.inflection.singular ) + ((unaBase.toolbox.search.q)? ' conteniendo el término \"' + unaBase.toolbox.search.q + '\"' : '') + '.' , 'Resultados de búsqueda');
            if (unaBase.toolbox.search.newSearch)
              unaBase.toolbox.search.lastSearchNotify = toastr.info(
                (data.records.total > 0
                  ? "Se encontró un total de " +
                    data.records.total +
                    (data.records.total > 1
                      ? " " + "resultados"
                      : " " + "resultado")
                  : "No se encontró ningún resultado") +
                  (unaBase.toolbox.search.q
                    ? ' conteniendo el término "' +
                      unaBase.toolbox.search.q +
                      '"'
                    : "") +
                  ".",
                "Resultados de búsqueda"
              );
            unaBase.toolbox.search.newSearch = false;

            //if(data.to != -1) {
            if (data.records.to != -1) {
              if (pageNumber == 1 && unaBase.toolbox.search.newSearch) {
                // viewport.find('table > tbody > tr').remove();
                viewport
                  .find(
                    "table.results" +
                      (typeof params.container != "undefined"
                        ? "." + params.container
                        : "") +
                      " > tbody > tr"
                  )
                  .remove();
                //viewport.find('table > tfoot > *').remove();
                viewport.animate({ scrollTop: 0 }, "slow");
              }
              // console.log(window.Chat.locked);
              for (var i = 0; i < data.rows.length; i++) {
                // var index = (data.rows[i].index === undefined)? data.rows[i].folio : data.rows[i].index;
                var id = data.rows[i].id;

                // viewport.find('table > tbody').append(params.row.html(i, data.rows));
                viewport
                  .find(
                    "table.results" +
                      (typeof params.container != "undefined"
                        ? "." + params.container
                        : "") +
                      " > tbody"
                  )
                  .append(params.row.html(i, data.rows));

                try {
                  if (window.Chat.locked[module + "|" + id] !== undefined) {
                    var expiry_date =
                      window.Chat.locked[module + "|" + id].timestamp;
                    expiry_date.setSeconds(expiry_date.getSeconds() + 60);
                  }

                  if (
                    window.Chat.locked[module + "|" + id] !== undefined &&
                    expiry_date > new Date()
                  ) {
                    console.log("locked!");
                    // viewport.find('table tbody tr[data-id="' + data.rows[i].id + '"]').addClass('locked');
                    viewport
                      .find(
                        "table.results" +
                          (typeof params.container != "undefined"
                            ? "." + params.container
                            : "") +
                          ' tbody tr[data-id="' +
                          data.rows[i].id +
                          '"]'
                      )
                      .addClass("locked");
                    // viewport.find('table tbody tr[data-id="' + data.rows[i].id + '"]').data('locked-by', window.Chat.locked[module + '|' + id].name);
                    viewport
                      .find(
                        "table.results" +
                          (typeof params.container != "undefined"
                            ? "." + params.container
                            : "") +
                          ' tbody tr[data-id="' +
                          data.rows[i].id +
                          '"]'
                      )
                      .data(
                        "locked-by",
                        window.Chat.locked[module + "|" + id].name
                      );
                    // viewport.find('table tbody tr[data-id="' + data.rows[i].id + '"] td:first-of-type').prepend('<span class="locked-icon ui-icon ui-icon-cancel" style="position: absolute; top: 11px; left: 0;"></span>');
                    viewport
                      .find(
                        "table.results" +
                          (typeof params.container != "undefined"
                            ? "." + params.container
                            : "") +
                          ' tbody tr[data-id="' +
                          data.rows[i].id +
                          '"] td:first-of-type'
                      )
                      .prepend(
                        '<span class="locked-icon ui-icon ui-icon-cancel" style="position: absolute; top: 11px; left: 0;"></span>'
                      );
                  }
                } catch (e) {
                  // console.log(e);
                }
              }

              if (data.rows.length == 0) {
                // Si hay registros en memoria, ponerlos en la lista
                var selectedItemsTemp = selectedItems;
                while (selectedItems.length > 0) {
                  var item = selectedItems.pop();
                  var id_item = item.data("id");
                  if (
                    $("table.results")
                      .find("tbody")
                      .find('tr[data-id="' + id_item + '"]').length != 0
                  ) {
                    $("table.results")
                      .find("tbody")
                      .find('tr[data-id="' + id_item + '"]')
                      .remove();
                  }
                  $("table.results")
                    .find("tbody")
                    .prepend(item);
                }
                selectedItems = selectedItemsTemp;
              }

              // viewport.find('table > tbody > tr').unbind('click').bind('click', function(event) {
              viewport
                .find(
                  "table.results" +
                    (typeof params.container != "undefined"
                      ? "." + params.container
                      : "") +
                    " > tbody > tr"
                )
                .unbind("click")
                .bind("click", function(event) {
                  //if (event.srcElement.localName != 'input' && event.srcElement.className != 'picture' && event.srcElement.localName != 'div') {

                  if ($(this).data("locked-by") === undefined) {
                    if (
                      typeof $(event.target).data("disabled") == "undefined" &&
                      event.target.localName != "input" &&
                      event.target.className != "ui-button-text" &&
                      typeof params.detail != "undefined"
                    ) {
                      if (
                        params.detail.url($(this).data("id")).search(":") == -1
                      ) {
                        if (typeof params.detail.iframe != "undefined") {
                          if (params.detail.iframe)
                            unaBase.loadInto.iframe(
                              params.detail.url($(this).data("id"))
                            );
                          else {
                            if (params.detail.dialog)
                              unaBase.loadInto.dialog(
                                params.detail.url($(this).data("id")),
                                undefined,
                                params.detail.size
                              );
                            else
                              unaBase.loadInto.viewport(
                                params.detail.url(
                                  $(this).data("id"),
                                  $(this).data("doc")
                                )
                              );
                          }
                        } else {
                          if (params.detail.external)
                            window.open(params.detail.url($(this).data("id")));
                          else
                            unaBase.loadInto.viewport(
                              params.detail.url($(this).data("id"))
                            );
                        }
                      } else {
                        var href = params.detail
                          .url($(this).data("id"))
                          .split(":");
                        switch (href[0]) {
                          case "blank":
                            window.open(href[1]);
                            break;
                          case "iframe":
                            unaBase.loadInto.iframe(href[1]);
                            break;
                          case "viewport":
                            var standalone = href[2] == "standalone";
                            unaBase.loadInto.viewport(
                              href[1],
                              null,
                              standalone
                            );
                            break;
                          case "dialog":
                            unaBase.loadInto.dialog(href[1], null, href[2]);
                            break;
                        }
                      }
                    }
                  } else
                    alert(
                      "Este documento está siendo modificado por " +
                        $(this)
                          .data("locked-by")
                          .capitalizeAllWords() +
                        "\n\n\n\n" +
                        "Para trabajar en él, debes solicitar a la persona que salga del mismo."
                    );
                });

              // var registros = viewport.find('table > tbody').find('tr').length;
              var registros = viewport
                .find(
                  "table.results" +
                    (typeof params.container != "undefined"
                      ? "." + params.container
                      : "") +
                    " > tbody"
                )
                .find("tr").length;

              if (data.records.to == data.records.total - 1) {
                //viewport.find('table > thead').show();
                var colspan = 0;
                // viewport.find('table > thead > tr > *').each(function() {
                viewport
                  .find(
                    "table.results" +
                      (typeof params.container != "undefined"
                        ? "." + params.container
                        : "") +
                      " > thead > tr > *"
                  )
                  .each(function() {
                    colspan += $(this).prop("colspan");
                  });
                colspan--;
                // viewport.find('table > tfoot').html(
                // 	'<tr><th colspan="' + colspan + '">Registros encontrados</th><td class="number">' + data.records.total + '</td></tr>'
                // );
                if (data.page.last > 1) {
                  if (unaBase.toolbox.search.lastEndOfRecordNotify.length)
                    unaBase.toolbox.search.lastEndOfRecordNotify.pop().remove();
                  unaBase.toolbox.search.lastEndOfRecordNotify.push(
                    toastr.info(
                      "La lista se cargó completamente.",
                      "Resultados de búsqueda"
                    )
                  );
                }
              }

              formatCurrency();
            }

            if (typeof params.callback != "undefined") params.callback(data);

            viewport
              .find("th[data-sort-by]")
              .unbind("click")
              .bind("click", function(event) {
                var current = $(event.target);
                var that = this;
                $(this)
                  .closest("tr")
                  .find("th[data-sort-by]")
                  .not(current)
                  .removeData("sort-order");
                $(that)
                  .closest("tr")
                  .find("th[data-sort-by]")
                  .not(current)
                  .removeClass("sort-order-asc")
                  .removeClass("sort-order-desc");
                if (
                  typeof current.data("sort-order") == "undefined" &&
                  typeof current.data("sort-default") != "undefined"
                ) {
                  switch (current.data("sort-default")) {
                    case "asc":
                      current.data("sort-order", "desc");
                      break;
                    case "desc":
                      current.data("sort-order", "asc");
                      break;
                  }
                }
                if (typeof current.data("sort-order") == "undefined") {
                  current.data("sort-order", "desc");
                  current
                    .removeClass("sort-order-asc")
                    .addClass("sort-order-desc");
                } else {
                  if (current.data("sort-order") == "asc") {
                    current.data("sort-order", "desc");
                    current
                      .removeClass("sort-order-asc")
                      .addClass("sort-order-desc");
                  } else {
                    current.data("sort-order", "asc");
                    current
                      .removeClass("sort-order-desc")
                      .addClass("sort-order-asc");
                  }
                }
                
                updateSearchFilter(event);
              });

            console.log("Finaliza búsqueda");

            // alert("final");
            $("#search")
              .find("*")
              .prop("disabled", false);
            $("body > aside")
              .find("*")
              .prop("disabled", false)
              .css("cursor", "auto")
              .css("pointer-events", "auto");

            // muestra si una cotización esta siendo editaba por otro usuario - block_by_use

            // for(var i = 0; i < $('tbody.ui-selectable tr').length; i ++ ){
            // 	var dataBlock = $('tbody.ui-selectable tr')[i].dataset.block;
            // 	var dataUser = $('tbody.ui-selectable tr')[i].dataset.blockuser;
            // 	if(dataBlock == "true"){
            // 		$('tbody.ui-selectable tr')[i].className += " block_by_use u-cot-block";
            // 	}
            // }
            unaBase.ui.unblock();
          });
          // }
          unaBase.ui.unblock();
        };

        var loadResults = function(disable_selected) {
          // Guardado de ítems de búsqueda con checkboxes
          console.log(
            "Antes de ejecutar búsqueda, se guardan ítems con checkboxes."
          );
          if (!disable_selected) {
            $("table.results")
              .find("tbody")
              .find("tr")
              .each(function(key, item) {
                if (
                  $(item)
                    .find('[name="selected_one"]')
                    .is(":checked")
                ) {
                  selectedItems.push($(item).clone(true, true));
                }
              });
          }

          selectedItemsLength = selectedItems.length;

          //viewport.find('table:not(.items)' + ((typeof params.container != 'undefined')? '.' + params.container : '') + ' > tbody').find('tr').remove();
          viewport
            .find(
              "table.results" +
                (typeof params.container != "undefined"
                  ? "." + params.container
                  : "") +
                " > tbody"
            )
            .find("tr")
            .remove();
          var i = 1;
          appendResult(
            i,
            unaBase.toolbox.search.q,
            null,
            null,
            unaBase.toolbox.search.advancedFilter,
            unaBase.toolbox.search.q2
          );
          i++;
          unaBase.toolbox.search.pageScroll = i;
          unaBase.ui.unblock();
        };

        var scrollSettings = {
          handleScroll: function(page, container, doneCallback) {
            setTimeout(function() {
              appendResult(
                page + unaBase.toolbox.search.pageScroll - 1,
                unaBase.toolbox.search.q,
                null,
                null,
                unaBase.toolbox.search.advancedFilter
              );
              doneCallback();
            }, 1000);

            return true;
          },
          pagesToScroll: null,
          targetElement: viewport,
          //monitorTargetChange: true,
          monitorTargetChange: false,
          triggerFromBottom: "5px",
          debug: false
        };

        var advancedSearch = function(disable_selected) {
          executeSearch = () => {
            
            console.log("entra a advancedSearch");

            //if (typeof unaBase.toolbox.search.savedSearch == "undefined" || (typeof unaBase.toolbox.search._disabled == 'undefined') || (typeof unaBase.toolbox.search._disabled != 'undefined' && !unaBase.toolbox.search._disabled))  {
            // console.log('Se inicia la búsqueda');

            $("body > aside")
              .find("*")
              .prop("disabled", true)
              .css("cursor", "not-allowed")
              .css("pointer-events", "none");
            $("#search")
              .find("*")
              .prop("disabled", true);
            unaBase.toolbox.search.newSearch = true;
            if (!unaBase.toolbox.dialog) {
              unaBase.toolbox.search.advancedFilter = {};
            }
            search
              .find("input, .multiple button, button.multiple")
              .each(function(key, item) {
                if ($(item).prop("name")) {
                  var filterName = $(item).prop("name");
                } else {
                  var filterName = $(item).data("name");
                }
                var newFilter = {};

                console.log("Filtro: " + filterName);

                if ($(item).attr("type")) {
                  switch ($(item).attr("type")) {
                    case "checkbox":
                      if ($(item).prop("checked"))
                        eval("newFilter = { " + filterName + ": true };");
                      break;
                    case "search":
                      eval(
                        "newFilter = { " +
                          filterName +
                          ": $(item).data('value') };"
                      );
                      break;
                    default:
                      eval(
                        "newFilter = { " + filterName + ": $(item).val() };"
                      );
                  }
                } else {
                  eval(
                    "newFilter = { " + filterName + ": $(item).data('value') };"
                  );
                }

                /*if ($(item).attr('type') == 'checkbox') {
									if ($(item).prop('checked'))
										eval("newFilter = { " + filterName + ": true };");
								} else {
									if ($(item).val() != "")
										eval("newFilter = { " + filterName + ": $(item).val() };");
								}*/
                $.extend(
                  unaBase.toolbox.search.advancedFilter,
                  unaBase.toolbox.search.advancedFilter,
                  newFilter
                );
              });
            // Si no tiene definido un row, no listar resultados
            if (typeof params.row != "undefined") {
              loadResults(disable_selected);
            } else {
              // begin edit --- gin 16-02-16 (debido a error en la los reportes por servicios v3)
              $("#search")
                .find("*")
                .prop("disabled", false);
              $("body > aside")
                .find("*")
                .prop("disabled", false)
                .css("cursor", "auto")
                .css("pointer-events", "auto");
              params.callback(unaBase.toolbox.search.advancedFilter);
              // end edit ---
            }
            //}
            setTimeout(() => {
              $('#search [name="q"]').focus();
            }, 1000);
          };

          if (!stopAutoSearch || !firstSearch) {
            executeSearch();
            firstSearch = true;
          }
        };

        unaBase.toolbox.search._advancedSearch = advancedSearch;

        // Si no tiene definido un row, no paginar el listado
        if (typeof params.row != "undefined") {
         
        } else params.callback(unaBase.toolbox.search.advancedFilter);

        var searchHandler = function(event) {
          var manual = $('#search [name="q"]').data("manual");

          var prevQuery = unaBase.toolbox.search.q;
          var prevQuery2 = unaBase.toolbox.search.q2;
          unaBase.toolbox.search.q = search
            .find('> label:first-of-type > input[type="search"]')
            .val()
            .replace(/^\s+/g, "")
            .trim();
          if (params.doubleSearch) {
            unaBase.toolbox.search.q2 = search
              .find('> label:nth-of-type(2) > input[type="search"]')
              .val()
              .replace(/^\s+/g, "")
              .trim();
          }
          if (
            prevQuery != unaBase.toolbox.search.q ||
            prevQuery2 != unaBase.toolbox.search.q2 ||
            manual == true
          ) {
 
            unaBase.toolbox.search.newSearch = true;
            // Si no tiene definido un row, no listar resultados
            if (typeof params.row != "undefined") {
              if (!stopAutoSearch) {
                loadResults();
              }
            } else params.callback(unaBase.toolbox.search.advancedFilter);
          }

          $('#search [name="q"]').removeData("manual");
          $('#search [name="q2"]').removeData("manual");
        };

        if (!search.hasClass("bound")) {
          search
            .bindWithDelay("keydown", searchHandler, 500)
            .bind("search", searchHandler)
            .addClass("bound");
        }

        //loadResults();

        if (!unaBase.toolbox.search._disabled) {
          advancedSearch();
        }



        // Mover checkboxes al final del contenedor de búsqueda
        var checkboxes = search.find("div.checkboxes");
        var clonedCheckboxes = checkboxes.clone(true, true);
        checkboxes.remove();
        $("<br>").appendTo(search);
        clonedCheckboxes.appendTo(search);
        // addSearchByBtn()
        $('#search [name="q"]').on("keydown", function(event){
          if(event.keyCode === 13){
            setTimeout(() => {
              executeSearch();

            },500);
          }
        });

        if (params.searchOff) {
          // let searchQ = document.querySelector('input[name="q"]');
          let searchCheckbox = document.querySelector(
            'input[name="searchCheckbox"]'
          );
          // if(searchCheckbox === null){
          // searchQ.insertAdjacentHTML('beforebegin', `<input type="checkbox" name="searchCheckbox">`);
          // }
          stopAutoSearch = vSearchOff;
          if (vSearchOff) {
            searchCheckbox.style.display = "";
          }
          setTimeout(() => {
            searchCheckbox.checked = vSearchOff;
            if (!vSearchOff) {
              document.querySelector(
                'li[data-name="searchOff"]'
              ).style.display = "none";
            }

            searchCheckbox.addEventListener("click", function() {
              let isChecked = this.checked;
              stopAutoSearch = isChecked;
              // if (isChecked){
              document.querySelector(
                'li[data-name="searchOff"]'
              ).style.display = isChecked ? "inline-block" : "none";
              // }
            });

     
          }, 200);
        } else {
          stopAutoSearch = false;
          let searchCheckbox = document.querySelector(
            'input[name="searchCheckbox"]'
          );
          searchCheckbox.style.display = "none";
        }
      },
      // unaBase.toolbox.search.save
      save: function() {
        unaBase.toolbox.search._disabled = true;
        console.debug("set search disabled to true");

        unaBase.toolbox.search.savedSearch = $("#search").serializeAnything();
        $("#search")
          .find(".ui-autocomplete-input")
          .each(function() {
            if ($(this).data("value") != null)
              unaBase.toolbox.search.savedSearch +=
                "&" +
                encodeURIComponent($(this).attr("name") + "-data-value") +
                "=" +
                encodeURIComponent($(this).data("value"));
          });
      },
      // unaBase.toolbox.search.saveDialog
      saveDialog: function() {
        unaBase.toolbox.search.savedDialogSearch = $(
          "#dialog-search"
        ).serializeAnything();
        $("#dialog-search")
          .find(".ui-autocomplete-input")
          .each(function() {
            if ($(this).data("value") != null)
              unaBase.toolbox.search.savedDialogSearch +=
                "&" +
                encodeURIComponent($(this).attr("name") + "-data-value") +
                "=" +
                encodeURIComponent($(this).data("value"));
          });
      },
      // unaBase.toolbox.search.restore
      restore: function() {
        var viewport = unaBase.toolbox.dialog
          ? $("#dialog-viewport")
          : $("#viewport");
        var searchData = [];
        if (unaBase.toolbox.search.savedSearch) {
          $.each(unaBase.toolbox.search.savedSearch.split("&"), function() {
            var parts = this.split("=");
            searchData[parts[0]] = parts[1];
          });
        }
        unaBase.toolbox.search.savedSearch = null;

        var searchBox = $("#search");

        searchBox.find("input").each(function() {
          switch ($(this).attr("type")) {
            case "checkbox":
              $(this).prop(
                "checked",
                searchData[$(this).attr("name")] == "true"
              );
              break;
            default:
              if (
                $(this).hasClass("ui-autocomplete-input") &&
                typeof searchData[$(this).attr("name") + "-data-value"] !=
                  "undefined"
              )
                $(this).data(
                  "value",
                  decodeURIComponent(
                    searchData[$(this).attr("name") + "-data-value"]
                  )
                );

              $(this).val(decodeURIComponent(searchData[$(this).attr("name")]));

              if ($(this).attr("name") == "created_at" && $(this).val() != "")
                $(this)
                  .parent()
                  .find(".clear.date")
                  .show();

              break;
          }
        });

        //$('table:not(.items) tbody').find('tr').remove();
        viewport
          .find(
            "table.results" +
              (typeof params != "undefined" &&
              typeof params.container != "undefined"
                ? "." + params.container
                : "") +
              "tbody"
          )
          .find("tr")
          .remove();
        setTimeout(function() {
          unaBase.toolbox.search.q = $("#search")
            .find('[name="q"]')
            .val();
          unaBase.toolbox.search.q2 = $("#search")
            .find('[name="q2"]')
            .val();
          console.debug("set search disabled to false");
          unaBase.toolbox.search._disabled = false;
          unaBase.toolbox.search._advancedSearch(true); // true = disable selected items
        }, 1);
      },
      // unaBase.toolbox.search.restoreDialog
      restoreDialog: function() {
        var viewport = $("#dialog-viewport");
        var searchData = [];
        $.each(unaBase.toolbox.search.savedDialogSearch.split("&"), function() {
          var parts = this.split("=");
          searchData[parts[0]] = parts[1];
        });

        unaBase.toolbox.search.savedDialogSearch = null;

        var searchBox = $("#dialog-search");

        searchBox.find("input").each(function() {
          switch ($(this).attr("type")) {
            case "checkbox":
              $(this).prop(
                "checked",
                searchData[$(this).attr("name")] == "true"
              );
              break;
            default:
              if (
                $(this).hasClass("ui-autocomplete-input") &&
                typeof searchData[$(this).attr("name") + "-data-value"] !=
                  "undefined"
              )
                $(this).data(
                  "value",
                  decodeURIComponent(
                    searchData[$(this).attr("name") + "-data-value"]
                  )
                );

              $(this).val(decodeURIComponent(searchData[$(this).attr("name")]));

              if ($(this).attr("name") == "created_at" && $(this).val() != "")
                $(this)
                  .parent()
                  .find(".clear.date")
                  .show();

              break;
          }
        });

        //$('table:not(.items) tbody').find('tr').remove();
        viewport
          .find(
            "table.results" +
              (typeof params != "undefined" &&
              typeof params.container != "undefined"
                ? "." + params.container
                : "") +
              "tbody"
          )
          .find("tr")
          .remove();
        setTimeout(function() {
          unaBase.toolbox.search.q = $("#dialog-search")
            .find('[name="q"]')
            .val();
          unaBase.toolbox.search.q2 = $("#dialog-search")
            .find('[name="q2"]')
            .val();
          console.debug("set search disabled to false");
          unaBase.toolbox.search._disabled = false;
          unaBase.toolbox.search._advancedSearch();
        }, 1);
      },
      // unaBase.toolbox.search.destroy
      destroy: function() {
        var search = unaBase.toolbox.dialog
          ? $("#dialog-search")
          : $("#search");
        if (!unaBase.loadInto._dialog) {
          unaBase.toolbox.search.initialized = undefined;
          unaBase.toolbox.search.q = "";
          unaBase.toolbox.search.pageScroll = null;
          unaBase.toolbox.search.newSearch = false;
          unaBase.toolbox.search.advancedFilter = undefined;

          unaBase.toolbox.search.lastSearchNotify = null;
          unaBase.toolbox.search.lastEndOfRecordNotify = [];

          // FIXME: revisar para que funcione como se espera
          search.find("*").off();
          search.off();
          search.hide();
          search.unbind("keydown click search");
          search.removeClass("bound");
        }

        //var viewport = (unaBase.toolbox.dialog)? search.parentTo('.ui-dialog').find('.ui-dialog-content') : $('#viewport');
        var viewport = unaBase.toolbox.dialog
          ? $("#dialog-viewport")
          : $("#viewport");

  
      }
    },
    // unaBase.toolbox.menu
    menu: {
      // unaBase.toolbox.toggleButton
      toggleButton: (selector, buttons) => {
        selector.click(function(){
          
          console.log(this);
        });
      },
      // unaBase.toolbox.menu.checkExit       check back if the document is not saved
      checkExit: function(event, callback)  {
        if (typeof event.isTrigger == "undefined") {
          
          if (unaBase.changeControl.query() && $("#search").is(":hidden")){
            confirm(MSG.get("CONFIRM_EXIT_UNSAVED")).done(callback);

            if(unaBase.back.callback){
              unaBase.back.callback();
            }
          }
          else callback(true);
        } else callback(true);
      },
      //unaBase.toolbox.menu.newInit
      newInit: function(params) {
        console.warn("----------------------/////////// N E W     I N I T    ////////////  --------------------");
        
        var menu = unaBase.toolbox.dialog ? $("#dialog-menu") : $("#menu");
        let buttons = [];
        menu.find("ul > li").remove();
            menu
              .parentTo("header")
              .find("button")
              .not(":first-of-type")
              .not(".date")
              .not(".search-button")
              .not(".close-button")
              .remove();

        let genericButtons = [
           {
              text: "exit",
              name: "exit",
              icon: "ui-icon-circle-arrow-w",
              caption: "Volver",
              access: true,
              action: function(event) {

               unaBase.history.back();
               unaBase.toolbox.menu.checkExit(event)
              }
           }

        ]
        if(params.searchOff){
          params.buttonsList.unshift({
            text: "searchOff",
            access: true,
            name: "searchOff",
            icon: "ui-icon-search",
            caption: "Buscar",
            action: function() {
              executeSearch();
            }
           })
        }
        for (i in params.buttonsList) {
          if (params.buttonsList[i].name != "" && params.buttonsList[i].caption != "" && (typeof params.buttonsList[i].access == "undefined" || params.buttonsList[i].access)) {
            button = $(
              '<li data-name="' + params.buttonsList[i].name + '"><button>' + params.buttonsList[i].caption +"</button></li>"
            );
            menu.find("ul").append(button);
            menu
              .find("ul > li:last-of-type > button")
              .button({
                icons:
                  typeof params.buttonsList[i].icon != "undefined"
                    ? {
                        primary: params.buttonsList[i].icon
                      }
                    : params.buttonsList[i].icons
              })
              .click(params.buttonsList[i].action);
          }
        }

        var button;
       // TODO: Pasar al CSS el estilo de este botón
        button = $(
          '<button id="dropdown_launcher" class="dropdown-button more" style="display: inline-block; float: right;">Más...</button>'
        );
        button
          .button({
            icons: {
              primary: "ui-icon-gear",
              secondary: "ui-icon-triangle-1-s"
            },
            text: false
          })
          .hide();
        menu.parentTo("header").append(button);
        /*
        var dropdown = $('');

                $(dropdown).jui_dropdown({
                launcher_id: 'dropdown_launcher',
                launcher_container_id: 'dropdown_container',
                menu_id: 'dropdown_menu',
                containerClass: 'container1',
                menuClass: 'menu1',
                onSelect: function(event, data) {
                $("#result").text('index: ' + data.index + ' (id: ' + data.id + ')');
                }
                });
        */
        menu.show();

        $("body").on("click", "*", function(event) {
          if (
            !$(event.target).hasClass("dropdown-button") &&
            !$(event.target)
              .parent()
              .hasClass("dropdown-button")
          )
            $(".dropdown-menu").hide();
        });








      },
      // unaBase.toolbox.menu.init
      init: function(params) {
        
        var menu = unaBase.toolbox.dialog ? $("#dialog-menu") : $("#menu");
        if (unaBase.toolbox.dialog)
          menu
            .parentTo(".ui-dialog")
            .find("header")
            .show();

        var buttons = [];
        
        // El botón Volver va primero que todos
        if ($.inArray("exit", params.buttons) != -1)
          buttons.push({
            name: "exit",
            icon: "ui-icon-circle-arrow-w",
            caption: "Volver",
            action: function(event) {
              var callback = function(data) {
                if (data) {
                  switch (params.entity) {
                    case "FactCliReporte":
                      unaBase.loadInto.viewport(
                        "/v3/views/reportes/index.shtml",
                        undefined,
                        true,
                        false
                      );
                      break;

                    case "CategoriasReporte":
                      unaBase.loadInto.viewport(
                        "/v3/views/reportes/index.shtml",
                        undefined,
                        true,
                        false
                      );
                      break;

                    case "VentasEjecutivoReporte":
                      //viewport: function(href, title, standalone, skip_history) {
                      unaBase.loadInto.viewport(
                        "/v3/views/reportes/index.shtml",
                        undefined,
                        true,
                        false
                      );
                      break;
                    case "VentasAreanegReporte":
                      unaBase.loadInto.viewport(
                        "/v3/views/reportes/index.shtml",
                        undefined,
                        true,
                        false
                      );
                      break;
                    case "VentasClienteReporte":
                      unaBase.loadInto.viewport(
                        "/v3/views/reportes/index.shtml",
                        undefined,
                        true,
                        false
                      );
                      break;
                    case "estado_resultados":
                      unaBase.loadInto.viewport(
                        "/v3/views/reportes/index.shtml",
                        undefined,
                        true,
                        false
                      );
                      break;
                    case "CotEjecutivoReporte":
                      unaBase.loadInto.viewport(
                        "/v3/views/reportes/index.shtml",
                        undefined,
                        true,
                        false
                      );
                      break;
                    case "CotClienteReporte":
                      unaBase.loadInto.viewport(
                        "/v3/views/reportes/index.shtml",
                        undefined,
                        true,
                        false
                      );
                      break;

                    case "Cotizacion":
                      if (!$("section.sheet").data("index"))
                        $.ajax({
                          url: "/4DACTION/_V3_removeCotizacion",
                          data: {
                            id: $("section.sheet").data("id")
                          },
                          dataType: "json",
                          success: function(data) {
                            if (typeof event.isTrigger == "undefined")
                              //unaBase.loadInto.viewport('/v3/views/cotizaciones/list.shtml');
                              unaBase.history.back();
                          }
                        });
                      else {
                        if (typeof event.isTrigger == "undefined") {
                          //unaBase.loadInto.viewport('/v3/views/cotizaciones/list.shtml');

                          var cotizacionId = $("section.sheet").data("id");
                          // var socketNew = io.connect(nodeUrl);
                          var cotBlock = {
                            id: cotizacionId,
                            folio: $("#main-container .sheet").data("index"),
                            user: $("html > body.menu.home > aside > div > div > h1").data(
                              "username"
                            ),
                            // doc_name: $('.titulofinal').val(),
                            // total: $('span[name="cotizacion[montos][subtotal_neto]"]').text(),
                            block: false,
                            module: "cotizaciones",
                            from: "boton volver---"
                          };

                          $.ajax({
                            url: "/4DACTION/_V3_block_by_use",
                            data: {
                              id: cotizacionId,
                              module: $(".sidebar li.active").data("name"),
                              block: false,
                              list: false
                            },
                            dataType: "json",
                            async: false,
                            success: function(datas) {
                              // data.rows.push(cotBlock);
                              // if(!uVar.unableSocket){
                              // 	socketNew.emit('sendblock', datas.rows);
                              // 	socketNew.emit('sendblockAdd', cotBlock);
                              // }
                            },
                            error: function(xhr, text, error) {
                              toastr.error(
                                NOTIFY.get("ERROR_INTERNAL", "Error")
                              );
                            }
                          });

                          window.onbeforeunload = function() {
                            return "¿Está seguro que desea salir?";
                          };
                          unaBase.history.back();
                        }
                      }

                      break;
                    case "Compras":
                      var target = $("section.sheet");
                      var folio = target.data("index");
                      if (folio == "") {
                        $.ajax({
                          url: "/4DACTION/_V3_setCompras",
                          data: {
                            "oc[id]": target.data("id"),
                            "oc[cancelar_creacion]": true
                          },
                          dataType: "json",
                          success: function(data) {
                            if (typeof event.isTrigger == "undefined")
                              //unaBase.loadInto.viewport('/v3/views/compras/list.shtml');
                              unaBase.history.back();
                          },
                          error: function(xhr, text, error) {
                            toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                          }
                        });
                      } else {
                        if (typeof event.isTrigger == "undefined")
                          //unaBase.loadInto.viewport('/v3/views/compras/list.shtml');
                          unaBase.history.back();
                      }
                      break;
                    case "Dtc":
                      
                      if (dtc.data.estado == "POR EMITIR") {
                        $.ajax({
                          url: "/4DACTION/_V3_setDtc",
                          data: {
                            "dtc[id]": dtc.id,
                            delete: true
                          },
                          dataType: "json",
                          success: function(data) {
                            if (typeof event.isTrigger == "undefined") {
                              unaBase.history.back();
                            }
                          },
                          error: function(xhr, text, error) {
                            toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                          }
                        });
                      } else {
                        if (typeof event.isTrigger == "undefined") {
                          unaBase.history.back();
                        }
                      }
                      break;
                    case "email_reportes":
                      if (typeof reportes == "undefined") {
                        unaBase.history.back();
                      } else {
                        if (!reportes.data) {
                          $.ajax({
                            url: "/4DACTION/_V3_setReportes",
                            data: {
                              id: reportes.id,
                              delete: true
                            },
                            dataType: "json",
                            success: function(data) {
                              if (typeof event.isTrigger == "undefined") {
                                unaBase.history.back();
                              }
                            },
                            error: function(xhr, text, error) {
                              toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                            }
                          });
                        } else {
                          if (typeof event.isTrigger == "undefined") {
                            unaBase.history.back();
                          }
                        }
                      }
                      break;
                    case "tiposcuenta":
                      if (typeof cuenta == "undefined") {
                        unaBase.history.back();
                      } else {
                        if (!cuenta.data.creado) {
                          $.ajax({
                            url: "/4DACTION/_V3_setTiposcuenta",
                            data: {
                              id: cuenta.id,
                              delete: true
                            },
                            dataType: "json",
                            success: function(data) {
                              if (typeof event.isTrigger == "undefined") {
                                unaBase.history.back();
                              }
                            },
                            error: function(xhr, text, error) {
                              toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                            }
                          });
                        } else {
                          if (typeof event.isTrigger == "undefined") {
                            unaBase.history.back();
                          }
                        }
                      }
                      break;

                    case "formaspago":
                      if (typeof formas == "undefined") {
                        unaBase.history.back();
                      } else {
                        if (!formas.data.creado) {
                          $.ajax({
                            url: "/4DACTION/_V3_setFormaspago",
                            data: {
                              id: formas.id,
                              delete: true
                            },
                            dataType: "json",
                            success: function(data) {
                              if (typeof event.isTrigger == "undefined") {
                                unaBase.history.back();
                              }
                            },
                            error: function(xhr, text, error) {
                              toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                            }
                          });
                        } else {
                          if (typeof event.isTrigger == "undefined") {
                            unaBase.history.back();
                          }
                        }
                      }
                      break;

                    case "tiposdtc":
                      if (typeof dtc == "undefined") {
                        unaBase.history.back();
                      } else {
                        if (!dtc.data.creado) {
                          $.ajax({
                            url: "/4DACTION/_V3_setTiposdtc",
                            data: {
                              id: dtc.id,
                              delete: true
                            },
                            dataType: "json",
                            success: function(data) {
                              if (typeof event.isTrigger == "undefined") {
                                unaBase.history.back();
                              }
                            },
                            error: function(xhr, text, error) {
                              toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                            }
                          });
                        } else {
                          if (typeof event.isTrigger == "undefined") {
                            unaBase.history.back();
                          }
                        }
                      }
                      break;
                    case "tipospago":
                      if (typeof pago == "undefined") {
                        unaBase.history.back();
                      } else {
                        if (!pago.data.creado) {
                          $.ajax({
                            url: "/4DACTION/_V3_setTipospago",
                            data: {
                              id: pago.id,
                              delete: true
                            },
                            dataType: "json",
                            success: function(data) {
                              if (typeof event.isTrigger == "undefined") {
                                unaBase.history.back();
                              }
                            },
                            error: function(xhr, text, error) {
                              toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                            }
                          });
                        } else {
                          if (typeof event.isTrigger == "undefined") {
                            unaBase.history.back();
                          }
                        }
                      }
                      break;
                    case "banco":
                      if (typeof banco == "undefined") {
                        unaBase.history.back();
                      } else {
                        if (!banco.data.creado) {
                          $.ajax({
                            url: "/4DACTION/_V3_setBanco",
                            data: {
                              id: banco.id,
                              delete: true
                            },
                            dataType: "json",
                            success: function(data) {
                              if (typeof event.isTrigger == "undefined") {
                                unaBase.history.back();
                              }
                            },
                            error: function(xhr, text, error) {
                              toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                            }
                          });
                        } else {
                          if (typeof event.isTrigger == "undefined") {
                            unaBase.history.back();
                          }
                        }
                      }
                      break;
                    case "impuestos":
                      if (typeof impuestos.data == "undefined") {
                        console.log("impuestos indefino");
                        unaBase.history.back();
                      } else {
                        if (!impuestos.data.creado) {
                          $.ajax({
                            url: "/4DACTION/_V3_setImpuestos",
                            data: {
                              id: impuestos.id,
                              delete: true
                            },
                            dataType: "json",
                            success: function(data) {
                              if (typeof event.isTrigger == "undefined") {
                                unaBase.history.back();
                              }
                            },
                            error: function(xhr, text, error) {
                              toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                            }
                          });
                        } else {
                          if (typeof event.isTrigger == "undefined") {
                            unaBase.history.back();
                          }
                        }
                      }
                      break;
                    case "Pago":
                      if (payment.estado == "POR EMITIR") {
                        $.ajax({
                          url: "/4DACTION/_V3_setPago",
                          data: {
                            id: payment.id,
                            delete: true
                          },
                          dataType: "json",
                          success: function(data) {
                            if (typeof event.isTrigger == "undefined") {
                              unaBase.history.back();
                            }
                          },
                          error: function(xhr, text, error) {
                            toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                          }
                        });
                      } else {
                        if (typeof event.isTrigger == "undefined") {
                          unaBase.history.back();
                        }
                      }
                      break;

                    case "Dtcnc":
                      if (dtc.data.estado == "POR EMITIR") {
                        $.ajax({
                          url: "/4DACTION/_V3_setDtcnc",
                          data: {
                            id: dtc.id,
                            delete: true
                          },
                          dataType: "json",
                          success: function(data) {
                            if (typeof event.isTrigger == "undefined") {
                              unaBase.history.back();
                            }
                          },
                          error: function(xhr, text, error) {
                            toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                          }
                        });
                      } else {
                        if (typeof event.isTrigger == "undefined") {
                          unaBase.history.back();
                        }
                      }
                      break;
                    case "NcVentas":
                      if (notas.data.estado == "PREVISUALIZACION") {
                        $.ajax({
                          url: "/4DACTION/_V3_setNcVentas",
                          data: {
                            id: notas.id,
                            delete: true
                          },
                          dataType: "json",
                          success: function(data) {
                            if (typeof event.isTrigger == "undefined") {
                              unaBase.history.back();
                            }
                          },
                          error: function(xhr, text, error) {
                            toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                          }
                        });
                      } else {
                        if (typeof event.isTrigger == "undefined") {
                          unaBase.history.back();
                        }
                      }
                      break;
                    case "Producto":
                      /*if (!$('section.sheet').data('index'))
												$.ajax({
													'url': '/4DACTION/_V3_removeCotizacion',
													data: {
														id: $('section.sheet').data('id')
													},
													dataType: 'json',
													success: function(data) {
														if (typeof event.isTrigger == 'undefined')
															unaBase.loadInto.viewport('/v3/views/cotizaciones/list.shtml');
															//unaBase.loadInto.viewport('/v3/views/cotizaciones/index.shtml');
													}
												});
											else {
												if (typeof event.isTrigger == 'undefined')
													unaBase.loadInto.viewport('/v3/views/cotizaciones/list.shtml');
											}*/
                      //unaBase.loadInto.viewport('/v3/views/catalogo/list.shtml');
                      unaBase.history.back();
                      break;
                    case "Negocios":
                      var cotizacionId = $("section.sheet").data("id");
                      var folio = $("section.sheet").data("index");
                      var userCot = $("html > body.menu.home > aside > div > div > h1").data(
                        "username"
                      );
                      // var socketNew = io.connect(nodeUrl);
                      var cotBlock = {
                        id: cotizacionId,
                        folio: folio,
                        user: userCot,
                        // doc_name: $('.titulofinal').val(),
                        // total: $('span[name="cotizacion[montos][subtotal_neto]"]').text(),
                        block: false,
                        module: "negocios",
                        from: "boton volver---"
                      };

                      $.ajax({
                        url: "/4DACTION/_V3_block_by_use",
                        data: {
                          id: cotizacionId,
                          module: $(".sidebar li.active").data("name"),
                          block: false,
                          list: false
                        },
                        dataType: "json",
                        async: false,
                        success: function(datas) {
                          // data.rows.push(cotBlock);
                          // if(!uVar.unableSocket){
                          // 	socketNew.emit('sendblockNg', datas.rows);
                          // 	socketNew.emit('sendblockAddNg', cotBlock);
                          // }
                        },
                        error: function(xhr, text, error) {
                          toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                        }
                      });

                      window.onbeforeunload = function() {
                        return "¿Está seguro que desea salir?";
                      };
                      if (
                        !$("section.sheet").data("index") &&
                        params.presupuesto
                      ) {
                        $.ajax({
                          url: "/4DACTION/_V3_removeCotizacion",
                          data: {
                            id: $("section.sheet").data("id")
                          },
                          dataType: "json",
                          success: function(data) {
                            if (typeof event.isTrigger == "undefined")
                              //unaBase.loadInto.viewport('/v3/views/cotizaciones/list.shtml');
                              unaBase.history.back();
                          }
                        });
                      } else {
                        unaBase.history.back();
                      }
                      break;
                    default:
                      unaBase.history.back();
                      break;
                  }
                }
              };
              unaBase.toolbox.menu.checkExit(event, callback);
              // if (typeof event.isTrigger == "undefined") {
                
              //   if (unaBase.changeControl.query() && $("#search").is(":hidden")){
              //     confirm(MSG.get("CONFIRM_EXIT_UNSAVED")).done(callback);

              //     if(unaBase.back.callback){
              //       unaBase.back.callback();
              //     }
              //   }
              //   else callback(true);
              // } else callback(true);
            }
          });

//-------------------------- empieza a agregar botones

        if ($.inArray("searchOff", params.buttons) != -1) {
          buttons.push({
            name: "searchOff",
            icon: "ui-icon-search",
            caption: "Buscar",
            action: function() {
              executeSearch();
            }
          });
        }

        if ($.inArray("nueva_tarea", params.buttons) != -1) {
          buttons.push({
            name: "nueva_tarea",
            icon: "ui-icon-circle-plus",
            caption: "Nueva tarea",
            action: function() {
              alert("nueva tarea!");
            }
          });
        }
        if ($.inArray("mail_cobranza", params.buttons) != -1) {
          buttons.push({
            name: "mail_cobranza",
            icon: "ui-icon-mail-closed",
            caption: "Enviar email",
            action: function() {
              let tiposEmails = $(
                '<section>\
									<select name="mail_cobranza_selected">\
										<option value="" selected>[ Seleccionar tipo email ]</option>\
										<option value="pre_cobranza">Pre cobranza</option>\
										<option value="cobranza">Cobranza</option>\
										<option value="corte_servicio">Aviso corte servicio</option>\
									</select>\
							</section>'
              );
              prompt(tiposEmails).done(function(data) {
                let selectedOption = $(
                  'select[name="mail_cobranza_selected"]'
                ).val();
                if (selectedOption != "") {
                  window.open(
                    "http://" +
                      window.location.host +
                      "/v3/views/reportes/dialog/email_cobranza.shtml",
                    "_blank"
                  );
                } else {
                  toastr.warning("Falta seleccionar opción!");
                }
              });
            }
          });
        }
        if ($.inArray("agendar_cobro", params.buttons) != -1) {
          buttons.push({
            name: "agendar_cobro",
            icon: "ui-icon-calendar",
            caption: "Agendar cobro",
            action: function() {
              window.open(
                "http://" +
                  window.location.host +
                  "/v3/views/reportes/dialog/agendar_cobro.shtml",
                "_blank"
              );
            }
          });
        }
        if ($.inArray("selectUsers", params.buttons) != -1) {
          buttons.push({
            name: "selectUsers",
            icon: "ui-icon-person",
            caption: "Seleccionar usuarios",
            action: function() {
              
              $(`li[data-name="selectAccess"]`).show();
              $(`li[data-name="selectUsers"]`).hide();
              $(`.sheet-permisos`).hide();
              $(`.sheet-usuarios`).show();
            }
          });
        }
        if ($.inArray("selectUsersForArea", params.buttons) != -1) {
          buttons.push({
            name: "selectUsersForArea",
            icon: "ui-icon-person",
            caption: "Seleccionar usuarios.",
            action: function() {
              
              $(`li[data-name="selectAreas"]`).show();
              $(`li[data-name="selectUsersForArea"]`).hide();
              $(`.sheet-areas`).hide();
              $(`.sheet-usuarios`).show();
            }
          });
        }
        if ($.inArray("selectAccess", params.buttons) != -1) {
          buttons.push({
            name: "selectAccess",
            icon: "ui-icon-key",
            caption: "Seleccionar permisos",
            action: function() {
              
              $(`li[data-name="selectAccess"]`).hide();
              $(`li[data-name="selectUsers"]`).show();
              $(`.sheet-permisos`).show();
              $(`.sheet-usuarios`).hide();
            }
          });
        }
        if ($.inArray("selectAreas", params.buttons) != -1) {
          buttons.push({
            name: "selectAreas",
            icon: "ui-icon-key",
            caption: "Seleccionar areas",
            action: function() {
              
              $(`li[data-name="selectAreas"]`).hide();
              $(`li[data-name="selectUsersForArea"]`).show();
              $(`.sheet-areas`).show();
              $(`.sheet-usuarios`).hide();
            }
          });
        }
        if ($.inArray("applyAreas", params.buttons) != -1) {
          buttons.push({
            name: "applyAreas",
            icon: "ui-icon-disk",
            caption: "Aplicar areas",
            action: function() {
                if(areas.getSelectedAreas().ids.length && areas.getSelectedUser().ids.length ){


                  $.ajax({
                    url: `/4DACTION/_v3_setAreasMany`,
                    dataType: "json",
                    type: "POST",
                    data: {
                      ...params.data(),
                      state: true
                    }
                  }).done(function(data) {
                   

                    if(data.success){
                      toastr.success("areas aplicadas");
                      setTimeout(() => {
                        unaBase.history.back();

                      },2000);
                    }else{
                      toastr.error("ha ocurrido un error");
                    }
                  });    
                }else if(!areas.getSelectedAreas().ids.length){
                  toastr.warning("debes seleccionar areas para aplicar");
                }else if(!areas.getSelectedUser().ids.length){
                  toastr.warning("debes seleccionar usuarios");
                }
            }
          });
        }
        if ($.inArray("applyAccess", params.buttons) != -1) {
          buttons.push({
            name: "applyAccess",
            icon: "ui-icon-disk",
            caption: "Aplicar permisos",
            action: function() {
                if(permisos.getSelectedAccess().ids.length && permisos.getSelectedUser().ids.length ){


                  $.ajax({
                    url: `/4DACTION/_v3_setPermisosMany`,
                    dataType: "json",
                    type: "POST",
                    data: {
                      ...params.data(),
                      state: true
                    }
                  }).done(function(data) {
                   

                    if(data.success){
                      toastr.success("permisos aplicados");
                      setTimeout(() => {
                        unaBase.history.back();

                      },2000);
                    }else{
                      toastr.error("ha ocurrido un error");
                    }
                  });    
                }else if(!permisos.getSelectedAccess().ids.length){
                  toastr.warning("debes seleccionar permisos para aplicar");
                }else if(!permisos.getSelectedUser().ids.length){
                  toastr.warning("debes seleccionar usuarios");
                }
            }
          });
        }
        if ($.inArray("removeAccess", params.buttons) != -1) {
          buttons.push({
            name: "removeAccess",
            icon: "ui-icon-disk",
            caption: "Quitar permisos",
            action: function() {
                if(permisos.getSelectedAccess().ids.length && permisos.getSelectedUser().ids.length ){
                  $.ajax({
                    url: `/4DACTION/_v3_setPermisosMany`,
                    dataType: "json",
                    type: "POST",
                    data: {
                      ...params.data(),
                      state: false
                    }
                  }).done(function(data) {
                   
                    if(data.success){
                      toastr.success("permisos removidos");
                      setTimeout(() => {
                        unaBase.history.back();

                      },2000);
                    }else{
                      toastr.error("ha ocurrido un error");
                    }
                  });    
                }else if(!permisos.getSelectedAccess().ids.length){
                  toastr.warning("debes seleccionar permisos para remover");
                }else if(!permisos.getSelectedUser().ids.length){
                  toastr.warning("debes seleccionar usuarios");
                }
            }
          });
        }
        if ($.inArray("saveComprobante", params.buttons) != -1) {
          buttons.push({
            name: "save",
            icon: "ui-icon-disk",
            caption: "Guardar",
            action: function() {
                unaBase.ui.block();
              console.warn("data from param.data");
              console.warn(params.data());
              if(params.validate() && comprobantes.validateNumbers()){
                $.ajax({
                  url: `/4DACTION/_V3_set${params.entity}?id=${params.data().id}`,
                  dataType: "json",
                  type: "POST",
                  data: params.data()
                }).done(function(data) {
                  console.warn("saved")
                  console.warn(params.validate())

                  if(data.success){  
                    comprobantes.id = data.id;
                    comprobantes.data.id = data.id;
                    if(data.new){
                      
                      const oldTitle = $("#comprobantes h1#mainTitle").text();
                      $("#comprobantes h1#mainTitle").text("");
                      $("#comprobantes h1#mainTitle").text(`${oldTitle} Nro. ${data.id}`);
                      $(`input[name="id"]`).val(data.id);

                    }
                    toastr.success(
                      NOTIFY.get("SUCCESS_SAVE")
                    );
                  }else{  
                    toastr.success(                    
                      NOTIFY.get("ERROR_INTERNAL")
                    );
                  }
                  // unaBase.changeControl.init();
                  // unaBase.ui.unblock();
                  return { success: true };
                });                
              }else if(!params.validate()){                
                toastr.warning(NOTIFY.get("ERROR_DATA"));
              }else if(!comprobantes.validateNumbers()){                
                toastr.warning(NOTIFY.get("ACCOUNT_WARNING_EQUAL"));
              }
                  unaBase.changeControl.init();
                  unaBase.ui.unblock();
            }
          });
        }
        if ($.inArray("addDetails", params.buttons) != -1) {
          buttons.push({
            name: "addDetails",
            icon: "ui-icon-plus",
            caption: "Agregar detalle",
            action: function() {
              if(comprobantes.id>0){
                const container = document.querySelector("table#detail tbody");
                let html = $(`<tr data-id="0">
                                  <td><a target="_blank" href="">Sin documento</a></td>
                                  <td><input readonly name="codigoCuenta" value="" type="text" /></td>
                                  <td><input  name="cuentaContable" value="" type="text" />
                                  <button  data-id="0" class="show cuentaContable" onClick="comprobantes.showCuentaContable(event)"
                                   ><span class="ui-icon ui-icon-carat-1-s"></span></button>
                                  </td>
                                  <td><input  name="debe" value="0" type="number" /></td>
                                  <td><input  name="haber" value="0" type="number" /></td>
                                  <td><button class="edit" style="display:none"  onClick="comprobantes.edit(event)"><span class="ui-icon ui-icon-pencil"></span></button><button class="save" onClick="comprobantes.save(event)"><span class="ui-icon ui-icon-disk"></span></button></td>                       
                                                         
                                  <td><button class="delete" onClick="comprobantes.delete(event)"><span class="ui-icon ui-icon-close"></span></button></td> 
                                  </tr>                      
                              `);

                // document.querySelector("tr.totals").insertAdjacentHTML('beforebegin', html);
                $("tr.totals").before(html);
                comprobantes.saveAndAdd(html);
                // html.find(`input[name="haber"]`).keydown(function(event){
                //   console.log("on key down");
                //   console.log(event);
                //   const keyDown = event.keyCode;
                  

                //   const cuentaContable = $(this).closest("tr").find(`input[name="cuentaContable"]`);
                //   if(keyDown === 13 && cuentaContable.val() !== ""){
                //     $(this).closest("td").next().find("button.save").click();
                //     unaBase.ui.block();
                //     setTimeout(() => {
                //       $(`li[data-name="addDetails"] button`).click();
                      
                //       unaBase.ui.unblock();
                //     },1000);
                //   }else if(keyDown === 13 && cuentaContable.val() === ""){
                //     cuentaContable.css("background-color", "red");
                //     toastr.warning("Debes seleccionar una cuenta contable.");
                //   }
                // });
                const cuentaContableShowButton = document.querySelector(`tr[data-id="0"] input[name="cuentaContable"]`);
                comprobantes.addAutocomplete(cuentaContableShowButton);
                cuentaContableShowButton.focus();
              }else{
                toastr.warning("Debes Guardar el comprobantes antes de agregar un detalle.");
              }
     
            }
          });
        }

        if ($.inArray("agendar_pago", params.buttons) != -1) {
          buttons.push({
            name: "agendar_pago",
            icon: "ui-icon-calendar",
            caption: "Agendar pago",
            action: function() {
              window.open(
                "http://" +
                  window.location.host +
                  "/v3/views/reportes/dialog/agendar_cobro.shtml",
                "_blank"
              );
            }
          });
        }
        if ($.inArray("accounting_libro_diario", params.buttons) != -1) {
          buttons.push({
            name: "Libro diario",
            icon: "ui-icon-document-b",
            caption: "Libro diario",
            action: function() {
              
                  let url =
                    nodeUrl +
                    "/libro-diario/?download=true&ids=" +
                    ids.join("|") +
                    "=&sid=" +
                    unaBase.sid.encoded() +
                    "&" +
                    filters +
                    "&hostname=" +
                    window.location.origin;

                let download = window.open(url);
                download.blur();
                window.focus();

            }
          });
        }
        if ($.inArray("accounting_libro_mayor", params.buttons) != -1) {
          buttons.push({
            name: "Libro mayor",
            icon: "ui-icon-document-b",
            caption: "Libro mayor",
            action: function() {
              

                  let url =
                    nodeUrl +
                    "/libro-mayor/?download=true&ids=" +
                    ids.join("|") +
                    "=&sid=" +
                    unaBase.sid.encoded() +
                    "&" +
                    filters +
                    "&hostname=" +
                    window.location.origin;

                let download = window.open(url);
                download.blur();
                window.focus();
            }
          });
        }
        if ($.inArray("accounting_balance", params.buttons) != -1) {
          buttons.push({
            name: "Balance",
            icon: "ui-icon-document-b",
            caption: "Balance",
            action: function() {
              
                  let url =
                    nodeUrl +
                    "/balance/?download=true&ids=" +
                    ids.join("|") +
                    "=&sid=" +
                    unaBase.sid.encoded() +
                    "&" +
                    filters +
                    "&hostname=" +
                    window.location.origin;

                let download = window.open(url);
                download.blur();
                window.focus();
            }
          });
        }

        /*if ($.inArray('actualizar_reporte', params.buttons) != -1){
					buttons.push({
						name: 'actualizar_reporte', icon: 'ui-icon-refresh', caption: 'Actualizar',
						action: function() {
							getFacturas();
						}
					});
				}*/

        if ($.inArray("new", params.buttons) != -1)
          buttons.push({
            name: "new",
            icon: "ui-icon-document",
            caption: "Crear",
            action: function() {
              console.log(params.entity);
              switch (params.entity) {
                case "comprobantes":

                  unaBase.loadInto.viewport(
                    "/v3/views/comprobantes/content.shtml",
                    "Crear comprobante",
                    false
                  );
                  break;
                case "accounting":
                  $.ajax({
                    url: "/4DACTION/_V3_set" + params.entity,
                    dataType: "json",
                    type: "POST",
                    data: {
                      create: true
                    }
                  }).done(function(data) {
                    unaBase.loadInto.viewport(
                      "/v3/views/ajustes/accounting/content.shtml?id=" + data.id
                    );
                  });
                  break;
                case "Tipodoctribu":
                  $.ajax({
                    url: "/4DACTION/_V3_set" + params.entity,
                    dataType: "json",
                    type: "POST",
                    data: {
                      create: true
                    }
                  }).done(function(data) {
                    unaBase.loadInto.viewport(
                      "/v3/views/ajustes/tipo_doctribu/content.shtml?id=" +
                        data.id
                    );
                  });
                  break;
                case "Proyecto":
                  $.ajax({
                    url: "/4DACTION/_V3_set" + params.entity,
                    dataType: "json",
                    type: "POST",
                    data: {}
                  }).done(function(data) {
                    unaBase.loadInto.viewport(
                      "/v3/views/proyectos/content.shtml?id=" + data.id
                    );
                  });
                  break;
                case "Cotizacion":
                  $.ajax({
                    url: "/4DACTION/_V3_getCotizacion",
                    data: {
                      q: "",
                      template: true
                    },
                    dataType: "json"
                  }).done(function(data) {
                    if (data.rows.length == 0) {
                      $.ajax({
                        url: "/4DACTION/_V3_set" + params.entity,
                        dataType: "json",
                        type: "POST",
                        data: {
                          presupuesto: params.presupuesto
                        }
                      }).done(function(data) {
                        if (typeof params.presupuesto != "undefined")
                          unaBase.loadInto.viewport(
                            "/v3/views/presupuestos/content.shtml?id=" + data.id
                          );
                        else
                          unaBase.loadInto.viewport(
                            "/v3/views/cotizaciones/content.shtml?id=" + data.id
                          );
                      });
                    } else {
                      if (typeof params.presupuesto != "undefined")
                        unaBase.loadInto.dialog(
                          "/v3/views/presupuestos/dialog/template.shtml",
                          "Crear presupuesto desde una plantilla",
                          "medium"
                        );
                      else
                        unaBase.loadInto.dialog(
                          "/v3/views/cotizaciones/dialog/template.shtml",
                          "Crear cotización desde una plantilla",
                          "medium"
                        );
                    }
                  });
                  break;
                case "Producto":
                  unaBase.loadInto.dialog(
                    "/v3/views/catalogo/content.shtml",
                    undefined,
                    "large"
                  );
                  break;
                case "Usuarios":
                  unaBase.loadInto.viewport("/v3/views/usuarios/content.shtml");
                  break;
                case "Banco":
                  unaBase.loadInto.dialog(
                    "/v3/views/banco/content.shtml",
                    "Añadir movimiento bancario",
                    "large"
                  );
                  break;
              }
            }
          });

        if ($.inArray("new_without_template", params.buttons) != -1)
          buttons.push({
            name: "new_without_template",
            icon: "ui-icon-document",
            caption: "No utilizar plantilla",
            action: function() {
              var element = this;
              var is_presupuesto = $(".dialog table").data("presupuesto");
              $.ajax({
                url: "/4DACTION/_V3_setCotizacion",
                dataType: "json",
                type: "POST",
                data: {
                  presupuesto: is_presupuesto
                },
                async: false
              }).done(function(data) {
                $(element)
                  .parentTo(".ui-dialog-content")
                  .dialog("close");
                if (typeof is_presupuesto != "undefined") {
                  unaBase.loadInto.viewport(
                    "/v3/views/presupuestos/content.shtml?id=" + data.id
                  );
                } else {
                  unaBase.loadInto.viewport(
                    "/v3/views/cotizaciones/content.shtml?id=" + data.id
                  );
                }
              });
            }
          });
        if ($.inArray("new_budget", params.buttons) != -1)
          buttons.push({
            name: "new_budget",
            icon: "ui-icon-document",
            caption: "Crear",
            action: function() {
              var element = this;
              var is_presupuesto =
                document.querySelector("ul.sidebar li.active").dataset.name ==
                "presupuestos";
              $.ajax({
                url: "/4DACTION/_V3_setCotizacion",
                dataType: "json",
                type: "POST",
                data: {
                  presupuesto: is_presupuesto
                },
                async: false
              }).done(function(data) {
                // $(element).parentTo('.ui-dialog-content').dialog('close');
                if (typeof is_presupuesto != "undefined") {
                  unaBase.loadInto.viewport(
                    "/v3/views/presupuestos/content.shtml?id=" + data.id
                  );
                } else {
                  unaBase.loadInto.viewport(
                    "/v3/views/cotizaciones/content.shtml?id=" + data.id
                  );
                }
              });
            }
          });
        if ($.inArray("ultimate_val", params.buttons) != -1)
          buttons.push({
            name: "ultimate_val",
            icon: "ui-icon-check",
            caption: "Validar Gasto",
            action: function() {
              if(access._645){
                $.ajax({
                  url: "/4DACTION/_V3_getLogValidacionByIndex",
                  data: {
                    index: "Orden_de_compra|" + $("section.sheet").data("id")
                  },
                  dataType: "json",
                  success: function(data) {
                    console.log(data);
                    let lineTxt = "";
                    let motives = [];

                    data.rows.forEach(line => {
                      if (motives.indexOf(line.motivo) === -1) {
                        motives.push(line.motivo);
                      }
                    });

                    motives.forEach(line => {
                      lineTxt += `<li><span style="font-weight: 600 !important; font-size: inherit !important; display: block;">${line}</span></li>`;
                    });
                    let msgValidateUltimate = `'<section> 
  										<div> 
  										<p style="font-size: 16px !important">El gasto ${$(
                        "span#index"
                      ).text()} sera validado por los siguientes criterios:</p> 
  										<br/>
  										<ul style="list-style-type: none; list-style-position: outside; margin-left:10px; line-height: 20px;">
  											${lineTxt}
  										</ul> 
  										</div> 
  									</section>`;
                    prompt(msgValidateUltimate).done(function(data) {
                      $.ajax({
                        url: "/4DACTION/_V3_ultimateValidate",
                        dataType: "json",
                        type: "POST",
                        data: {
                          id: $("section.sheet").data("id")
                        },
                        async: false
                      }).done(function(data) {
                        unaBase.loadInto.viewport(
                          "/v3/views/compras/content.shtml?id=" + data.id
                        );
                      });
                    });
                  }
                });

              }
            }
          });
        if ($.inArray("saveUser", params.buttons) != -1)
          buttons.push({
            name: "saveUser",
            icon: "ui-icon-disk",
            caption: "Guardar",
            action: function() {
              
              $.ajax({
                url: "/4DACTION/_V3_setUsuario",
                type: "POST",
                dataType: "json",
                data: {
                  id: currentUser.username,
                  "perfil[nombres]": $('input[name="perfil[nombres]"]').val(),
                  "perfil[vResults]": parseInt(
                    $('input[name="perfil[vResults]"]').val()
                  ),
                  "perfil[apellido][paterno]": $(
                    'input[name="perfil[apellido][paterno]"]'
                  ).val(),
                  "perfil[apellido][materno]": $(
                    'input[name="perfil[apellido][materno]"]'
                  ).val(),
                  "perfil[email]": $('input[name="perfilperfil[email]"]').val(),
                  "perfil[allow-email]": document.querySelector(
                    'input[name="perfil[allow-email]"]'
                  ).checked,
                  "perfil[searchOff]": document.querySelector(
                    'input[name="perfil[searchOff]"]'
                  ).checked
                },
                async: false // para poder hacer el save correctamente y esperar la respuesta
              }).done(function(data) {
                vResults = parseInt($('input[name="perfil[vResults]"]').val());
                if (data.success && data.pass) {
                  toastr.success(NOTIFY.get("SUCCESS_SAVE"));
                } else {
                  toastr.error(NOTIFY.get("ERROR_RECORD_READONLY", "Error"));
                }
                unaBase.ui.unblock();
              });
            }
          });
        if ($.inArray("nodeRestart", params.buttons) != -1)
          buttons.push({
            name: "nodeRestart",
            icon: "ui-icon-refresh",
            caption: "Reiniciar nodeServer",
            action: function() {
                  unaBase.node
                    .quickRestart(true)
                    .then(res => {})
                    .catch(err => {});
              // unaBase.node
              //   .check()
              //   .then(res => {
              //     unaBase.node.state("on");
              //   })
              //   .catch(err => {
              //     unaBase.node.state("off");
              //     unaBase.node
              //       .quickRestart(true, true, true)
              //       .then(res => {})
              //       .catch(err => {});
              //     const nodeRestartBtn = document.querySelector(
              //       'li[data-name="nodeRestart"] button'
              //     );
              //     nodeRestartBtn.disabled = true;
              //     nodeRestartBtn.style.cursor = "inherit";
              //     nodeRestartBtn.querySelector(
              //       ".ui-icon-refresh"
              //     ).style.display = "none";
              //     setTimeout(() => {
              //       nodeRestartBtn.disabled = false;
              //       nodeRestartBtn.style.cursor = "pointer";
              //       nodeRestartBtn.querySelector(
              //         ".ui-icon-refresh"
              //       ).style.display = "";
              //     }, 15000);
              //   });
            }
          });
        if ($.inArray("nodeStart", params.buttons) != -1){
          
          if(access[params.buttonAccess.nodeStart]){
            buttons.push({
              name: "nodeStart",
              icon: "ui-icon-play",
              caption: "Iniciar nodeServer",
              action: function() {
                unaBase.node.start(true,false, true);


                    const nodeStartBtn = document.querySelector(
                      'li[data-name="nodeStart"] button'
                    );
                    nodeStartBtn.disabled = true;
                    nodeStartBtn.style.cursor = "inherit";
                    nodeStartBtn.querySelector(
                      ".ui-icon-play"
                    ).style.display = "none";
                    setTimeout(() => {
                      nodeStartBtn.disabled = false;
                      nodeStartBtn.style.cursor = "pointer";
                      nodeStartBtn.querySelector(
                        ".ui-icon-play"
                      ).style.display = "";
                    }, 15000);
              }
            });

          }

        }

        // change password
        if ($.inArray("changePassword", params.buttons) != -1)
          buttons.push({
            name: "changePassword",
            icon: "ui-icon-locked",
            caption: "Cambiar contraseña",
            action: function() {
              if (params.validate()) {
                $.ajax({
                  url: "/4DACTION/_V3_set" + params.entity,
                  type: "POST",
                  dataType: "json",
                  data: params.data(),
                  async: false // para poder hacer el save correctamente y esperar la respuesta
                }).done(function(data) {
                  if (data.success && data.pass) {
                    toastr.success(NOTIFY.get("SUCCESS_SAVE"));
                    $('input[name="perfil[password_actual]"]').val("");
                    $('input[name="perfil[password_nueva]"]').val("");
                    $('input[name="perfil[password_confirmacion]"]').val("");
                    $('.ui-dialog button[title="close"]').trigger("click");
                  } else {
                    if (!data.pass) {
                      toastr.error(
                        NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                      );
                      toastr.error("La contraseña ingresada es incorrecta.");
                      $('input[name="perfil[password_actual]"]')
                        .val("")
                        .focus();
                      $('input[name="perfil[password_nueva]"]').val("");
                      $('input[name="perfil[password_confirmacion]"]').val("");
                    } else {
                      toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                    }
                  }
                  unaBase.ui.unblock();
                });
              } else {
                toastr.error(
                  "Es necesario completar la información requerida antes de guardar.",
                  "Faltan datos"
                );
                unaBase.ui.unblock();
              }
            }
          });

        if ($.inArray("save", params.buttons) != -1)
          buttons.push({
            name: "save",
            icon: "ui-icon-disk",
            caption: "Guardar",
            action: function(event) {
              
                            // alert(params.entity);
              var elementCobro = $(this);
              var eventData = event;
              var saveAction = function() {
                
                // Si está en modo offline, deben actualizarse los cálculos
                if (typeof modoOffline !== "undefined" && params.entity !== "ItemByCotizacion") {
                  if (modoOffline) {
                    unaBase.ui.block();
                    /*$('table.items.cotizacion').find('tr.title').each(function(key, item) {
											var next = $(item).next();
											if (next.length > 0)
												updateSubtotalTitulos(next);
										});*/
                    updateSubtotalItems();
                    if ( v3_sobrecargos_cinemagica && typeof formulario_cinemagica == "undefined") {
                      //var porcentaje_utilidad_bruta = blockCinemagica.find('[name="sobrecargo[1][porcentaje]"]').data('value');
                      //blockCinemagica.find('[name="sobrecargo[1][porcentaje]"]').trigger('focus').val(porcentaje_utilidad_bruta).trigger('blur');

                      $("section.sheet").data("sync", true);
                      var valor_pelicula = blockCinemagica
                        .find('[name="sobrecargo[1][subtotal]"]')
                        .data("old-value");
                      blockCinemagica
                        .find('[name="sobrecargo[1][subtotal]"]')
                        .trigger("focus")
                        .val(valor_pelicula)
                        .trigger("blur");
                      $("section.sheet").data("sync", false);
                    }
                  }
                }

                var success = false;
                var element = $(this);
                var sendValidar = false;
                var setData = function(without_items, data) {

                  console.log("Entra al setData");
                  if ( params.entity == "Cotizacion" ||  params.entity == "Negocios" ) {
                    //simon itemparent verify start
                    if(!params.presupuesto){
                      if (verifySubitems()) {
                        fixSubitems();
                      }

                    }
                    //simon itemparent verify end

                    // Intentar guardar datos del contacto que puedieron no haber sido guardados manualmente
                    /*if ($('button.edit.save.empresa').not(':hidden'))
											$('button.edit.save.empresa').trigger('click');
										if ($('button.edit.save.contacto').not(':hidden'))
											$('button.edit.save.contacto').trigger('click');*/

                    // Logs en tiempo real
                    var log = $("#main-container").data("realtime-log");
                    var logMsg = [];
                    if (log !== undefined) {
                      for (var i = 0, len = log.length; i < len; i++) {
                        var msg = "";
                        if (log[i] !== undefined) {
                          if (log[i]["old"] !== undefined && log[i]["new"] !== undefined) {
                            var isTitle = log[i]["new"]["title"];
                            if (
                              !isTitle &&
                              log[i]["old"]["categoria"]["id"] !=
                                log[i]["new"]["categoria"]["id"] &&
                              log[i]["old"]["dragged"] ===
                                log[i]["new"]["dropped"]
                            ) {
                              msg +=
                                "[ Movido a categoría: " +
                                unescape(
                                  log[i]["new"]["categoria"]["nombre"]
                                ).toUpperCase() +
                                " ] ";
                            } else {
                              if (
                                log[i]["old"]["item[][nombre]"] !=
                                log[i]["new"]["item[][nombre]"]
                              ) {
                                msg +=
                                  "[ Nombre nuevo: " +
                                  unescape(
                                    log[i]["new"]["item[][nombre]"]
                                  ).toUpperCase() +
                                  " ] ";
                              }
                              if (
                                log[i]["old"]["observacion"] !=
                                log[i]["new"]["observacion"]
                              ) {
                                msg +=
                                  "[ Observación nueva: " +
                                  unescape(
                                    log[i]["new"]["observacion"]
                                  ).substring(0, 32) +
                                  "... ] ";
                              }
                              if (
                                log[i]["old"]["comentario"] !=
                                log[i]["new"]["comentario"]
                              ) {
                                msg +=
                                  "[ Comentario nuevo: " +
                                  unescape(
                                    log[i]["new"]["comentario"]
                                  ).substring(0, 32) +
                                  "... ] ";
                              }
                              if (!isTitle) {
                                if (
                                  log[i]["old"]["item[][tipo_documento]"] !=
                                  log[i]["new"]["item[][tipo_documento]"]
                                ) {
                                  msg +=
                                    "[ Tipo documento: " +
                                    log[i]["new"]["item[][tipo_documento]"] +
                                    " ] ";
                                }
                                if (
                                  log[i]["old"]["item[][cantidad]"] !=
                                  log[i]["new"]["item[][cantidad]"]
                                ) {
                                  msg +=
                                    "[ Cantidad: " +
                                    log[i]["old"]["item[][cantidad]"] +
                                    "→" +
                                    log[i]["new"]["item[][cantidad]"] +
                                    " ] ";
                                }
                                if (
                                  log[i]["old"]["item[][factor]"] !=
                                  log[i]["new"]["item[][factor]"]
                                ) {
                                  msg +=
                                    "[ Días: " +
                                    log[i]["old"]["item[][factor]"] +
                                    "→" +
                                    log[i]["new"]["item[][factor]"] +
                                    " ] ";
                                }
                                if (
                                  log[i]["old"]["item[][precio_unitario]"] !=
                                  log[i]["new"]["item[][precio_unitario]"]
                                ) {
                                  msg +=
                                    "[ Precio unitario: " +
                                    currency.symbol +
                                    $.number(
                                      parseFloat(
                                        log[i]["old"]["item[][precio_unitario]"]
                                      ),
                                      currency.decimals,
                                      ",",
                                      "."
                                    ) +
                                    "→" +
                                    currency.symbol +
                                    $.number(
                                      parseFloat(
                                        log[i]["new"]["item[][precio_unitario]"]
                                      ),
                                      currency.decimals,
                                      ",",
                                      "."
                                    ) +
                                    " ] ";
                                }
                                if (
                                  log[i]["old"]["item[][costo_unitario]"] !=
                                  log[i]["new"]["item[][costo_unitario]"]
                                ) {
                                  if (
                                    log[i]["new"]["item[][costo_unitario]"] >
                                    log[i]["new"]["item[][precio_unitario]"]
                                  ) {
                                    msg +=
                                      "[ Gasto P. unitario: " +
                                      currency.symbol +
                                      $.number(
                                        parseFloat(
                                          log[i]["old"][
                                            "item[][costo_unitario]"
                                          ]
                                        ),
                                        currency.decimals,
                                        ",",
                                        "."
                                      ) +
                                      "→" +
                                      currency.symbol +
                                      $.number(
                                        parseFloat(
                                          log[i]["new"][
                                            "item[][costo_unitario]"
                                          ]
                                        ),
                                        currency.decimals,
                                        ",",
                                        "."
                                      ) +
                                      " ] ";
                                  } else {
                                    msg +=
                                      "[ Gasto P. unitario: " +
                                      currency.symbol +
                                      $.number(
                                        parseFloat(
                                          log[i]["old"][
                                            "item[][costo_unitario]"
                                          ]
                                        ),
                                        currency.decimals,
                                        ",",
                                        "."
                                      ) +
                                      "→" +
                                      currency.symbol +
                                      $.number(
                                        parseFloat(
                                          log[i]["new"][
                                            "item[][costo_unitario]"
                                          ]
                                        ),
                                        currency.decimals,
                                        ",",
                                        "."
                                      ) +
                                      " ] ";
                                  }
                                }
                                if (
                                  log[i]["old"]["item[][aplica_sobrecargo]"] !=
                                  log[i]["new"]["item[][aplica_sobrecargo]"]
                                ) {
                                  msg +=
                                    "[ Aplica sobrecargo: " +
                                    (log[i]["new"]["item[][aplica_sobrecargo]"]
                                      ? "Sí"
                                      : "No") +
                                    " ] ";
                                }
                                if (
                                  log[i]["old"]["item[][costo_interno]"] !=
                                  log[i]["new"]["item[][costo_interno]"]
                                ) {
                                  msg +=
                                    "[ Costo interno: " +
                                    (log[i]["new"]["item[][costo_interno]"]
                                      ? "Sí"
                                      : "No") +
                                    " ] ";
                                }
                                if (
                                  log[i]["old"]["item[][ocultar_print]"] !=
                                  log[i]["new"]["item[][ocultar_print]"]
                                ) {
                                  msg +=
                                    "[ Ocultar en impresión: " +
                                    (log[i]["new"]["item[][ocultar_print]"]
                                      ? "Sí"
                                      : "No") +
                                    " ] ";
                                }
                                if (
                                  log[i]["old"][
                                    "item[][mostrar_carta_cliente]"
                                  ] !=
                                  log[i]["new"]["item[][mostrar_carta_cliente]"]
                                ) {
                                  msg +=
                                    "[ Mostrar en carta cliente: " +
                                    (log[i]["new"][
                                      "item[][mostrar_carta_cliente]"
                                    ]
                                      ? "Sí"
                                      : "No") +
                                    " ] ";
                                }
                              }
                            }
                            msg =
                              "- Ha " +
                              (log[i]["new"]["cloned"]
                                ? "duplicado"
                                : "modificado") +
                              " " +
                              (isTitle
                                ? "categoría"
                                : "ítem " +
                                  unescape(
                                    log[i]["old"]["categoria"]["nombre"]
                                  ).toUpperCase() +
                                  " / ") +
                              " " +
                              unescape(
                                log[i]["old"]["item[][nombre]"]
                              ).toUpperCase() +
                              " " +
                              msg;
                          } else {
                            if (
                              log[i]["old"] === undefined &&
                              log[i]["new"] !== undefined
                            ) {
                              var isTitle = log[i]["new"]["title"];
                              msg +=
                                "- Ha " +
                                (log[i]["new"]["cloned"]
                                  ? "duplicado"
                                  : "agregado") +
                                " " +
                                (isTitle
                                  ? "categoría "
                                  : "ítem " +
                                    unescape(
                                      log[i]["new"]["categoria"]["nombre"]
                                    ).toUpperCase() +
                                    " / ") +
                                unescape(
                                  log[i]["new"]["item[][nombre]"]
                                ).toUpperCase() +
                                " ";
                              if (!isTitle) {
                                msg +=
                                  "[ Cantidad: " +
                                  log[i]["new"]["item[][cantidad]"] +
                                  " ] ";
                                msg +=
                                  "[ Días: " +
                                  log[i]["new"]["item[][factor]"] +
                                  " ] ";
                                msg +=
                                  "[ Precio unitario: " +
                                  currency.symbol +
                                  $.number(
                                    parseFloat(
                                      log[i]["new"]["item[][precio_unitario]"]
                                    ),
                                    currency.decimals,
                                    ",",
                                    "."
                                  ) +
                                  " ] ";
                                msg +=
                                  "[ Gasto P. unitario: " +
                                  currency.symbol +
                                  $.number(
                                    parseFloat(
                                      log[i]["new"]["item[][costo_unitario]"]
                                    ),
                                    currency.decimals,
                                    ",",
                                    "."
                                  ) +
                                  " ] ";
                              }
                            }
                            if (
                              log[i]["old"] !== undefined &&
                              log[i]["new"] === undefined &&
                              !log[i]["old"]["dragged"]
                            ) {
                              var isTitle = log[i]["old"]["title"];
                              msg +=
                                "- Ha quitado " +
                                (isTitle
                                  ? "categoría "
                                  : "ítem " +
                                    unescape(
                                      log[i]["old"]["categoria"]["nombre"]
                                    ).toUpperCase() +
                                    " / ") +
                                unescape(
                                  log[i]["old"]["item[][nombre]"]
                                ).toUpperCase() +
                                " ";
                              if (!isTitle) {
                                msg +=
                                  "[ Cantidad: " +
                                  log[i]["old"]["item[][cantidad]"] +
                                  " ] ";
                                msg +=
                                  "[ Días: " +
                                  log[i]["old"]["item[][factor]"] +
                                  " ] ";
                                msg +=
                                  "[ Precio unitario: " +
                                  currency.symbol +
                                  $.number(
                                    parseFloat(
                                      log[i]["old"]["item[][precio_unitario]"]
                                    ),
                                    currency.decimals,
                                    ",",
                                    "."
                                  ) +
                                  " ] ";
                                msg +=
                                  "[ Gasto P. unitario: " +
                                  currency.symbol +
                                  $.number(
                                    parseFloat(
                                      log[i]["old"]["item[][costo_unitario]"]
                                    ),
                                    currency.decimals,
                                    ",",
                                    "."
                                  ) +
                                  " ] ";
                              }
                            }
                          }
                        }
                        if (msg != "") {
                          logMsg.push(msg);
                        }
                      }
                      var modulo = "";
                      switch (params.entity) {
                        case "Cotizacion":
                          modulo = "cotizaciones";
                          break;
                        case "Negocios":
                          modulo = "negocios";
                          break;
                      }
                      if (logMsg.length > 0) {
                        unaBase.log.save(
                          "[En estado " +
                            params.entity.toLowerCase() +
                            "] Ha hecho los siguientes cambios en ítems:\n" +
                            logMsg.join("\n"),
                          modulo,
                          $("section.sheet").data("index")
                        );
                      }
                      $("#main-container").removeData("realtime-log");
                    }

                    if (without_items) {
                      $("table.items.cotizacion").data(
                        "saved-without-items",
                        true
                      );
                    }
                  }

                  if ( params.entity == "Negocios" && !access._528 && autoriza_modificacion ) {
                    var abort = false;
                    $.ajax({
                      url: "/4DACTION/_V3_checkAutorizaNeg",
                      data: {
                        id: $("section.sheet").data("id")
                      },
                      dataType: "json",
                      async: false,
                      success: function(data) {
                        if (!data.autorizado) {
                          abort = true;
                        } else {
                          // expirar autorización tras el primer guardado
                          $.ajax({
                            url: "/4DACTION/_V3_setAutorizacionByNegocio",
                            data: {
                              id: data.id,
                              accion_expirar: true
                            },
                            dataType: "json",
                            success: function(data) {
                              console.log(
                                "autorización expirada tras el primer guardado"
                              );
                            }
                          });
                        }
                      }
                    });
                    if (abort) {
                      toastr.warning(
                        "La autorización para modificar el negocio ha expirado."
                      );
                      unaBase.ui.unblock();
                      // mostrar nuevamente botón solicitar
                      return false;
                    }
                  }

                  $('[data-name="share"]').data("is-saved", false);
               
                  $.ajax({
                    url: "/4DACTION/_V3_set" + params.entity,
                    type: "POST",
                    dataType: "json",
                    data: params.data(),
                    async: false // para poder hacer el save correctamente y esperar la respuesta
                  }).done(function(data) {
                    if ( $("table.items.cotizacion").data("gastop-mayor-venta") ) {
                      unaBase.log.save(
                        "[En estado " +
                          params.entity.toLowerCase() +
                          "] Se guardó la cotización con gasto presupuestado mayor al precio de venta",
                        modulo,
                        folio,
                        data.id
                      );
                      $("table.items.cotizacion").removeData(
                        "gastop-mayor-venta"
                      );
                    }
                    success = data.success;

                    // se reinicia el control de cambios después del guardado
                    unaBase.changeControl.init();
                    if (data.success) {
                      $('[data-name="share"]').data("is-saved", true);
                      switch (params.entity) {
                        case "ParamConnect":
                          
                          let dataConnect = params.data();
                          nodejs_public_ipaddr = dataConnect.ipAlt2;
                          nodejs_port = dataConnect.nodePort;
                          // nodeUrl = 'http://' + nodejs_public_ipaddr + ':' + nodejs_port;

                          unaBase.ui.unblock();
                          toastr.success(NOTIFY.get("SUCCESS_SAVE_PRODUCTO"));

                          break;
                        case "NcVentas":
                          toastr.success(NOTIFY.get("SUCCESS_SAVE_DOCUMENT"));
                          notas.data.folio = data.folio;
                          notas.data.estado = data.estado;
                          notas.container
                            .find('[data-name="folio"]')
                            .text(notas.data.folio);
                          notas.container
                            .find('[name="folio"]')
                            .val(notas.data.folio);
                          notas.container
                            .find('[data-name="estado"]')
                            .text(notas.data.estado);
                          notas.get_totales();
                          notas.display();
                          unaBase.ui.unblock();
                          break;
                        case "Contacto":
                          $(".form-contact")
                            .find('input[name="id"]')
                            .val(data.id);
                          toastr.success(NOTIFY.get("SUCCESS_SAVE_CONTACTO"));
                          target = $(".sheet");
                          $.ajax({
                            url: "/4DACTION/_V3_getEmpresa",
                            dataType: "json",
                            data: {
                              q: data.id,
                              filter: "id"
                            },
                            success: function(data) {
                              $.map(data.rows, function(item) {
                                var currentId = target
                                  .find('input[name="contacto[info][id]"]')
                                  .val();

                                if (currentId == 0 || currentId == item.id) {
                                  // contacto
                                  target
                                    .find('input[name="contacto[info][id]"]')
                                    .val(item.id);
                                  target
                                    .find('input[name="contacto[info][alias]"]')
                                    .val(item.text);
                                  target
                                    .find(
                                      'input[name="contacto[info][razon_social]"]'
                                    )
                                    .val(item.razon_social);

                                    if (currency.code != "PEN") {
                                      target.find('input[name="contacto[info][rut]"]').val(unaBase.data.rut.format(item.rut));
                                    }else{
                                      target.find('input[name="contacto[info][rut]"]').val(item.rut);
                                    }

                                  target
                                    .find('input[name="contacto[info][giro]"]')
                                    .val(item.giro);
                                  target
                                    .find(
                                      'input[name="contacto[info][direccion]"]'
                                    )
                                    .val(item.direccion);
                                  target
                                    .find(
                                      'input[name="contacto[info][telefono1]"]'
                                    )
                                    .val(item.telefonos);
                                  target
                                    .find('input[name="contacto[info][email]"]')
                                    .val(item.email);

                                  // Para Cotizacion
                                  //target.find('input[name="contacto[info][id]"]').val(item.id);
                                  /* target.find('input[name="cotizacion[empresa][id]"]').val(item.text);
																	target.find('input[name="cotizacion[empresa][razon_social]"]').val(item.razon_social);
																	target.find('input[name="cotizacion[empresa][rut]"]').val(unaBase.data.rut.format(item.rut)); */

                                  if (dtc.data) {
                                    dtc.data.contacto.id = item.id;
                                    dtc.data.contacto.alias = item.text;
                                    dtc.data.contacto.razon_social =
                                      item.razon_social;
                                    dtc.data.contacto.rut = unaBase.data.rut.format(
                                      item.rut
                                    );
                                    dtc.data.contacto.giro = item.giro;

                                    // tipo doc default
                                    if (dtc.data.id_tipo_doc == "") {
                                      dtc.data.id_tipo_doc = item.id_dtc_defaul;
                                      dtc.data.des_tipo_doc =
                                        item.des_dtc_default;
                                      target
                                        .find('input[name="des_tipo_doc"]')
                                        .val(item.des_dtc_default);
                                    }

                                    // forma de pago default
                                    if (dtc.data.id_forma_pago == "") {
                                      dtc.data.id_forma_pago =
                                        item.id_forma_default;
                                      dtc.data.des_forma_pago =
                                        item.des_forma_default;
                                      target
                                        .find('input[name="des_forma_pago"]')
                                        .val(item.des_forma_default);
                                    }
                                  }

                                  //dtc

                                  var selectorDtc = target.find(
                                    'input[name="tipo_doc[id]"]'
                                  );
                                  if (selectorDtc.length > 0) {
                                    if (
                                      target
                                        .find('input[name="tipo_doc[id]"]')
                                        .val() == ""
                                    ) {
                                      target
                                        .find('input[name="tipo_doc[id]"]')
                                        .val(item.id_dtc_default);
                                      target
                                        .find(
                                          'input[name="tipo_doc[descripcion]"]'
                                        )
                                        .val(item.des_dtc_default);
                                    }
                                  }

                                  // forma pago
                                  var selectorFpago = target.find(
                                    'input[name="forma_pago[id]"]'
                                  );
                                  if (selectorFpago.length > 0) {
                                    if (
                                      target
                                        .find('input[name="forma_pago[id]"]')
                                        .val() == ""
                                    ) {
                                      target
                                        .find('input[name="forma_pago[id]"]')
                                        .val(item.id_forma_default);
                                      target
                                        .find(
                                          'input[name="forma_pago[descripcion]"]'
                                        )
                                        .val(item.des_forma_default);
                                    }
                                  }
                                }
                              });
                            }
                          });
                          unaBase.ui.unblock();
                          break;
                        case "Producto":
                          var prevId = $(".form-contact")
                            .find('input[name="id"]')
                            .val();
                          $(".form-contact")
                            .find('input[name="id"]')
                            .val(data.id);
                          toastr.success(NOTIFY.get("SUCCESS_SAVE_PRODUCTO"));
                          if (prevId == 0)
                            $('input[name="file"]').fileupload(
                              fileUploadOptions()
                            );
                          unaBase.ui.unblock();
                          break;

                        case "email_reportes":
                          $.ajax({
                            url: "/4DACTION/_V3_setReportes",
                            data: params.data(),
                            dataType: "json",
                            async: false,
                            success: function(data) {
                              if (data.success) {
                                toastr.success("Reporte Modificado con exito");
                                unaBase.history.back();
                              } else {
                                if (data.readonly) {
                                  toastr.error(
                                    NOTIFY.get("ERROR_RECORD_READONLY_ITEM")
                                  );
                                } else {
                                  toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                                }
                              }
                            }
                          });
                          unaBase.ui.unblock();
                          break;
                        case "formaspago":
                          $.ajax({
                            url: "/4DACTION/_V3_setFormaspago",
                            data: params.data(),
                            dataType: "json",
                            async: false,
                            success: function(data) {
                              if (data.success) {
                                toastr.success(
                                  "Forma de pago modificado con éxito."
                                );
                                unaBase.history.back();
                              } else {
                                if (data.readonly) {
                                  toastr.error(
                                    NOTIFY.get("ERROR_RECORD_READONLY_ITEM")
                                  );
                                } else {
                                  toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                                }
                              }
                            }
                          });
                          unaBase.ui.unblock();
                          break;
                        case "tiposcuenta":
                          $.ajax({
                            url: "/4DACTION/_V3_setTiposcuenta",
                            data: params.data(),
                            dataType: "json",
                            async: false,
                            success: function(data) {
                              if (data.success) {
                                toastr.success(
                                  "Tipo de cuenta modificado con éxito."
                                );
                                unaBase.history.back();
                              } else {
                                if (data.readonly) {
                                  toastr.error(
                                    NOTIFY.get("ERROR_RECORD_READONLY_ITEM")
                                  );
                                } else {
                                  toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                                }
                              }
                            }
                          });
                          unaBase.ui.unblock();
                          break;
                        case "impuestos":
                          $.ajax({
                            url: "/4DACTION/_V3_setImpuestos",
                            data: params.data(),
                            dataType: "json",
                            async: false,
                            success: function(data) {
                              if (data.success) {
                                toastr.success(
                                  "Impuesto modificado con éxito."
                                );
                                if (data.origen == "impuesto") {
                                  unaBase.history.back();
                                }
                              } else {
                                if (data.readonly) {
                                  toastr.error(
                                    NOTIFY.get("ERROR_RECORD_READONLY_ITEM")
                                  );
                                } else {
                                  toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                                }
                              }
                            }
                          });
                          unaBase.ui.unblock();
                          break;
                        case "tipospago":
                          $.ajax({
                            url: "/4DACTION/_V3_setTipospago",
                            data: params.data(),
                            dataType: "json",
                            async: false,
                            success: function(data) {
                              if (data.success) {
                                toastr.success(
                                  "Tipo de pago modificado con éxito."
                                );
                                unaBase.history.back();
                              } else {
                                if (data.readonly) {
                                  toastr.error(
                                    NOTIFY.get("ERROR_RECORD_READONLY_ITEM")
                                  );
                                } else {
                                  toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                                }
                              }
                            }
                          });
                          unaBase.ui.unblock();
                          break;
                        case "banco":
                          $.ajax({
                            url: "/4DACTION/_V3_setBanco",
                            data: params.data(),
                            dataType: "json",
                            async: false,
                            success: function(data) {
                              if (data.success) {
                                toastr.success("Banco modificado con éxito.");
                                unaBase.history.back();
                              } else {
                                if (data.readonly) {
                                  toastr.error(
                                    NOTIFY.get("ERROR_RECORD_READONLY_ITEM")
                                  );
                                } else {
                                  toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                                }
                              }
                            }
                          });
                          unaBase.ui.unblock();
                          break;
                        case "tiposdtc":
                          $.ajax({
                            url: "/4DACTION/_V3_setTiposdtc",
                            data: params.data(),
                            dataType: "json",
                            async: false,
                            success: function(data) {
                              if (data.success) {
                                toastr.success(
                                  "Tipo de Documento de Compra modificado con éxito."
                                );
                                unaBase.history.back();
                              } else {
                                if (data.readonly) {
                                  toastr.error(
                                    NOTIFY.get("ERROR_RECORD_READONLY_ITEM")
                                  );
                                } else {
                                  toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                                }
                              }
                            }
                          });
                          unaBase.ui.unblock();
                          break;

                        case "Cotizacion":
                          
                          if (data.index != 0) {
                            var locale_date = new Date().toLocaleDateString(
                              "es-CL",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                              }
                            );
                            $("section.sheet")
                              .find("time")
                              .html(locale_date);
                          }
                          var callback = function() {
                            
                            if (typeof event.isTrigger == "undefined") {
                              if ($("#index").html() == "Plantilla")
                                toastr.success(
                                  NOTIFY.get("SUCCESS_SAVE_TEMPLATE")
                                );
                              else {
                                if (
                                  $("table.items.cotizacion").data(
                                    "saved-without-items"
                                  )
                                ) {
                                  unaBase.log.save(
                                    "[En estado " +
                                      params.entity.toLowerCase() +
                                      "] Ha guardado sin ítems",
                                    modulo,
                                    data.index
                                  );
                                  $("table.items.cotizacion").removeData(
                                    "saved-without-items"
                                  );
                                }
                                toastr.success(
                                  NOTIFY.get("SUCCESS_SAVE_COTIZACION")
                                );
                              }
                            }
                            $('#menu [data-name="preview"]').show();

                            /*if ($('#index').html() != 'Borrador') {
															unaBase.inbox.send({
																subject: 'Ha modificado la cotización Nº ' + folio + ' / ' + $('section.sheet').find('input[name="cotizacion[titulo][text]"]').val(),
																into: 'viewport',
																href: '/v3/views/cotizaciones/content.shtml?id=' + data.id,
																tag: 'avisos',
																index: data.index,
																msgBody: function(index) {
																	var htmlString = '';
																	$.ajax({
																		url: '/4DACTION/_V3_getLogsV3',
																		data: {
																			q: index,
																			modulo: 'cotizaciones',
																			login: $('html > body.menu.home > aside > div > div > h1').data('username')
																		},
																		dataType: 'json',
																		async: false,
																		success: function(data) {
																			htmlString+= '<table style="background-color: rgb(240,240,240); width: 100%;"><caption style="text-align: left; font-weight: bold;">Listado de cambios</caption><thead>';
																			htmlString+= '<tr>';
																			htmlString+= '<th style="background-color: rgb(189,189,192); color: white; font-weight: bold;">Fecha</th>';
																			htmlString+= '<th style="background-color: rgb(189,189,192); color: white; font-weight: bold;">Hora</th>';
																			htmlString+= '<th style="background-color: rgb(189,189,192); color: white; font-weight: bold;">Cambio</th>';
																			htmlString+= '</tr>';
																			htmlString+= '</thead><tbody style="color: rgb(103,103,103);">';
																			//$.each(data.rows, function(key, item) {
																			var rows = [];
																			for (var i = 0; i < data.rows.length; i++) {
																				var tmpHtmlString = '<tr>';
																				tmpHtmlString+= '<td>' + data.rows[i].fecha + '</td>';
																				tmpHtmlString+= '<td>' + data.rows[i].hora + '</td>';
																				tmpHtmlString+= '<td>' + data.rows[i].descripcion + '</td>';
																				tmpHtmlString+= '</tr>';
																				if (data.rows[i].descripcion == 'Ha ingresado a la cotización') {
																					i = data.rows.length;
																				}
																				rows.push(tmpHtmlString);
																			}
																			htmlString+= rows.join('');
																			htmlString+= '</tbody></table>';
																		}
																	});
																	return htmlString;
																},
																template: 'notify_modificacion_cotizacion',
																ejecutivo_responsable: {
																	login: $('#ejecutivo').data('id'),
																	name: $('#ejecutivo').val()
																}
															});
														}*/

                            let nvNumber = data.folio;
                            if ($("#index").html() == "Borrador")
                              $.ajax({
                                url: "/4DACTION/_V3_setVersionByCotizacion",
                                data: {
                                  id: $("section.sheet").data("id")
                                },
                                dataType: "json",
                                async: false,
                                success: function(data) {
                                  if (data.success && data.unique) {
                                    //toastr.info('Se creó una nueva versión');
                                    //if (data.index != -1)

                                    $("#version").html(data.index);
                                    unaBase.inbox.send({
                                      subject:
                                        "Ha creado la cotización Nº " +
                                        nvNumber +
                                        " / " +
                                        $("section.sheet")
                                          .find(
                                            'input[name="cotizacion[titulo][text]"]'
                                          )
                                          .val(),
                                      into: "viewport",
                                      href:
                                        "/v3/views/cotizaciones/content.shtml?id=" +
                                        data.id,
                                      tag: "avisos"
                                    });

                                    // Ver acá el flujo dependiendo si es cotización nueva, desde plantilla o duplicada
                                    $.ajax({
                                      url: "/4DACTION/_V3_setLogValidacion",
                                      data: {
                                        table: "Nota_de_venta",
                                        id_record: $("section.sheet").data(
                                          "id"
                                        ),
                                        index_record: $("section.sheet").data(
                                          "index"
                                        ),
                                        ref_record: $("section.sheet")
                                          .find(
                                            '[name="cotizacion[titulo][text]"]'
                                          )
                                          .val(),
                                        test: true,
                                        async: false
                                      },
                                      dataType: "json",
                                      async: false,
                                      success: function(data) {
                                        if (!crear_oc_validada)
                                          crear_oc_validada =
                                            data.rows.length == 0;
                                      }
                                    });

                                    if (!crear_oc_validada) {
                                      if (!deferReglaValidacion) {
                                        initLogValidacion();
                                        /*initLogValidacion();*/ sendValidar = true;
                                      } else {
                                        //$('#menu [data-name="validate_send"]').show();
                                        $.ajax({
                                          url: "/4DACTION/_V3_setLogValidacion",
                                          data: {
                                            table: "Nota_de_venta",
                                            id_record: $("section.sheet").data(
                                              "id"
                                            ),
                                            index_record: $(
                                              "section.sheet"
                                            ).data("index"),
                                            ref_record: $("section.sheet")
                                              .find(
                                                '[name="cotizacion[titulo][text]"]'
                                              )
                                              .val(),
                                            test: true,
                                            async: false
                                          },
                                          dataType: "json",
                                          async: false,
                                          success: function(data) {
                                            has_rules = data.rows.length > 0;
                                            if (has_rules) {
                                              $(
                                                '#menu [data-name="validate_send"]'
                                              ).show();
                                            } else {
                                              $.ajax({
                                                url:
                                                  "/4DACTION/_V3_setCotizacion",
                                                data: {
                                                  id: $("section.sheet").data(
                                                    "id"
                                                  ),
                                                  "cotizacion[approved]": true,
                                                  auto: true
                                                },
                                                dataType: "json",
                                                async: false,
                                                success: function(subdata) {
                                                  $(
                                                    '#menu [data-name="validate_send"]'
                                                  ).hide();
                                                  $("section.sheet").data(
                                                    "validado",
                                                    true
                                                  );
                                                  $("section.sheet").data(
                                                    "approved",
                                                    true
                                                  );
                                                  $(
                                                    "section.sheet footer article p span:first-of-type"
                                                  ).text("Validada");
                                                }
                                              });
                                            }
                                          }
                                        });
                                      }
                                    } else {
                                      $.ajax({
                                        url: "/4DACTION/_V3_setCotizacion",
                                        data: {
                                          id: $("section.sheet").data("id"),
                                          "cotizacion[approved]": true,
                                          auto: true
                                        },
                                        dataType: "json",
                                        async: false,
                                        success: function(subdata) {
                                          $(
                                            '#menu [data-name="validate_send"]'
                                          ).hide();
                                          $("section.sheet").data(
                                            "validado",
                                            true
                                          );
                                          $("section.sheet").data(
                                            "approved",
                                            true
                                          );
                                          $(
                                            "section.sheet footer article p span:first-of-type"
                                          ).text("Validada");
                                          $(
                                            "section.sheet button.add.dtc"
                                          ).visible();
                                          $(
                                            "section.sheet button.add.orden-pago"
                                          ).visible();
                                          $(
                                            "section.sheet button.add.cobro"
                                          ).visible();
                                        }
                                      });
                                    }

                                    // Se incluye acá para que funcione
                                    if (data.index == -1) {
                                      if (access._584)
                                        unaBase.toolbox.menu.buttons([
                                          "save",
                                          "refresh",
                                          "offline_mode",
                                          "delete",
                                          "exit",
                                          "preview"
                                        ]);
                                      else
                                        unaBase.toolbox.menu.buttons([
                                          "save",
                                          "refresh",
                                          "delete",
                                          "exit",
                                          "preview"
                                        ]);
                                    } else {
                                      if (data.index == 0) {
                                        if (access._584)
                                          unaBase.toolbox.menu.buttons([
                                            "save",
                                            "offline_mode",
                                            "exit",
                                            "preview"
                                          ]);
                                        else
                                          unaBase.toolbox.menu.buttons([
                                            "save",
                                            "exit",
                                            "preview"
                                          ]);
                                      } else {
                                        if (
                                          $("section.sheet")
                                            .find("span.validation-status")
                                            .text() == "Validada"
                                        ) {
                                          if (access._584)
                                            unaBase.toolbox.menu.buttons([
                                              "save",
                                              "refresh",
                                              "offline_mode",
                                              "clone_current",
                                              access._484
                                                ? "convert_negocio"
                                                : "conversion_negocio_request",
                                              "discard",
                                              "exit",
                                              "share",
                                              "preview",
                                              "template",
                                              "export"
                                            ]);
                                          else
                                            unaBase.toolbox.menu.buttons([
                                              "save",
                                              "refresh",
                                              "clone_current",
                                              access._484
                                                ? "convert_negocio"
                                                : "conversion_negocio_request",
                                              "discard",
                                              "exit",
                                              "share",
                                              "preview",
                                              "template",
                                              "export"
                                            ]);
                                        } else {
                                          if (access._584)
                                            unaBase.toolbox.menu.buttons([
                                              "save",
                                              "refresh",
                                              "offline_mode",
                                              "clone_current",
                                              "discard",
                                              "exit",
                                              "preview",
                                              "template",
                                              "validate_send"
                                            ]);
                                          else
                                            unaBase.toolbox.menu.buttons([
                                              "save",
                                              "refresh",
                                              "clone_current",
                                              "discard",
                                              "exit",
                                              "preview",
                                              "template",
                                              "validate_send"
                                            ]);

                                          if (
                                            typeof refreshLogValidacion !=
                                            "undefined"
                                          )
                                            refreshLogValidacion(); // acá entra: Desde cero / sin crear validada
                                        }

                                        if (!access._530)
                                          $(
                                            '#menu [data-name="template"]'
                                          ).hide();
                                      }
                                    }
                                  }
                                }
                              });
                            else {
                              $.ajax({
                                url: "/4DACTION/_V3_setVersionByCotizacion",
                                data: {
                                  id: $("section.sheet").data("id"),
                                  hidden: true
                                },
                                dataType: "json",
                                async: false,
                                success: function(data) {
                                  if (data.success && data.unique)
                                    console.log("Versión de guardado creada");
                                  else {
                                    console.log(
                                      "Versión de guardado no se pudo crear"
                                    );
                                  }
                                }
                              });
                            }

                            if (data.index != -1)
                              $("#index").html("Nº " + data.index);
                            $("section.sheet").data("index", data.index);
                            $(".index2").html("Nº " + data.index);
                            unaBase.ui.expandable.init();
                            // Ocultar botones según validación y permiso
                            if (
                              $("section.sheet")
                                .find(".validation-status")
                                .text() == "No validada"
                            ) {
                              $('#menu [data-name="share"]').hide();
                              //if (access._496)
                              $('#menu [data-name="convert_negocio"]').hide();

                              if (
                                $("section.sheet")
                                  .data("username")
                                  .toLowerCase() ==
                                $("html > body.menu.home > aside > div > div > h1")
                                  .data("username")
                                  .toLowerCase()
                              )
                                $(
                                  '#menu [data-name="validate_request"]'
                                ).show();
                              else {
                                if (
                                  typeof reiniciar_validacion_cotizaciones ==
                                  "undefined"
                                )
                                  $(
                                    '#menu [data-name="validate_request"]'
                                  ).hide();
                                else
                                  $(
                                    '#menu [data-name="validate_request"]'
                                  ).show();
                              }
                            }
                            unaBase.ui.unblock();
                          };
                          updateIndexes(callback);

                          // unaBase.changeControl.isSaved = true;
                          if ($('input[name="toUnblock"]').prop("checked")) {
                            idleUnblock();
                          }
                          // var blocked = $('#block_by_use').is(":checked");

                          // if(!blocked){
                          // 	$.ajax({
                          // 			url: '/4DACTION/_V3_block_by_use',
                          // 			data: {
                          // 				id: data.id,
                          // 				module: $('.sidebar li.active').data('name'),
                          // 				block: false
                          // 			},
                          // 			dataType: 'jsonp',
                          // 			async: false,
                          // 			success: function(data) {
                          // 			}
                          // 		});
                          // 	window.onbeforeunload = function () {
                          // 	  // blank function do nothing
                          // 	}
                          // window.location.replace("http://"+window.location.hostname +":" +window.location.port);

                          // unaBase.history.back();
                          // }
                          break;
                        case "Proyecto":
                          /*$('div.task-container').find('div.task').each(function(key, item) {
														$(item).find('button.save.task').trigger('click');
													});*/
                          if (data.index != -1)
                            $("#index").html("Nº " + data.index);
                          $("section.sheet").data("index", data.index);
                          unaBase.ui.unblock();
                          break;
                        case "ItemByCotizacion":
                          const id = data.id;
                          const trElement = document.querySelector(
                            `tr[data-id="${id}"]`
                          );

                          /*const percentage = {
														productor_ejecutivo: document.querySelector(`input[name="item[][formula_productor_ejecutivo2]"]`).checked,
														asistente: document.querySelector(`input[name="item[][formula_asistente_produccion2]"]`).checked,
														porcentage: document.querySelector(`input[name="item[][formula_prod_ejec_ratio2]"]`).value,
														monto_total: document.querySelector(`input[name="item[][porcentaje_monto_total2]"]`).value
													}*/

                          const percentage = {
                            productor_ejecutivo: $(
                              'input[name="item[][formula_productor_ejecutivo2]"]'
                            ).prop("checked"),
                            asistente: $(
                              'input[name="item[][formula_asistente_produccion2]"]'
                            ).prop("checked"),
                            porcentage: $(
                              'input[name="item[][formula_prod_ejec_ratio2]"]'
                            ).val(),
                            monto_total: $(
                              'input[name="item[][porcentaje_monto_total2]"]'
                            ).val()
                          };

                          $(trElement).data(
                            "porcentaje-monto-total",
                            percentage.monto_total / 100
                          );
                          $(trElement).data(
                            "formula-productor-ejecutivo-ratio",
                            percentage.porcentage
                          );
                          $(trElement).data(
                            "formula-productor-ejecutivo",
                            percentage.productor_ejecutivo
                          );
                          $(trElement).data(
                            "formula-asistente-produccion",
                            percentage.asistente
                          );
                          // ver si aplica cambios al hacer change en eldropdown de tipo documento
                          toastr.success(
                            NOTIFY.get("SUCCESS_SAVE_COTIZACION_ITEM")
                          );
                          unaBase.ui.unblock();
                          $(".ui-dialog")
                            .find(".ui-dialog-titlebar-close")
                            .trigger("click");
                          break;
                        case "ItemByCompra":
                          var container2 = $(
                            '#sheet-compras table > tbody > tr[data-llave="' +
                              params.data().id +
                              '"]'
                          );
                          container2
                            .find(
                              'input[name="oc[detalle_item][observacion_item]"]'
                            )
                            .val(params.data().text);
                          toastr.success(NOTIFY.get("SUCCESS_SAVE"));
                          unaBase.ui.unblock();
                          break;
                        case "DatoByCotizacion":
                          toastr.success(
                            NOTIFY.get("SUCCESS_SAVE_COTIZACION_DATO")
                          );
                          unaBase.ui.unblock();
                          break;
                        case "Negocios":

                          var result = updateIndexes(callback);

                          if (result === false) {
                            return false;
                          }
                          $.ajax({
                            url: "/4DACTION/_V3_setVersionByCotizacion",
                            data: {
                              id: $("section.sheet").data("id"),
                              hidden: true
                            },
                            dataType: "json",
                            async: false,
                            success: function(data) {
                              if (data.success && data.unique)
                                console.log("Versión de guardado creada");
                              else {
                                console.log(
                                  "Versión de guardado no se pudo crear"
                                );
                              }
                            }
                          });
                          if ($('input[name="toUnblock"]').prop("checked")) {
                            idleUnblock();
                          }
                          toastr.success(NOTIFY.get("SUCCESS_SAVE_NEGOCIO"));

                          // unaBase.changeControl.isSaved = true;
                          if (params.presupuesto) {
                            if (data.index > 0) {
                              $("#index").html("Nº " + data.index);
                              $("section.sheet").data("index", data.index);
                              $(".index2").html("Nº " + data.index);
                            }
                          }
                          // simon 23julio2017 función recargar
                          // var location = unaBase.history.current();
                          // unaBase.loadInto.viewport(location.url, location.standalone, undefined, true);

                          /* unaBase.inbox.send({
														subject: 'Ha modificado el negocio Nº ' + folio + ' / ' + $('section.sheet').find('input[name="cotizacion[titulo][text]"]').val(),
														into: 'viewport',
														href: '/v3/views/negocios/content.shtml?id=' + data.id,
														tag: 'avisos',
														index: data.index,
														msgBody: function(index) {
															var htmlString = '';
															$.ajax({
																url: '/4DACTION/_V3_getLogsV3',
																data: {
																	q: index,
																	modulo: 'negocios',
																	login: $('html > body.menu.home > aside > div > div > h1').data('username')
																},
																dataType: 'json',
																async: false,
																success: function(data) {
																	htmlString+= '<table style="background-color: rgb(240,240,240); width: 100%;"><caption style="text-align: left; font-weight: bold;">Listado de cambios</caption><thead>';
																	htmlString+= '<tr>';
																	htmlString+= '<th style="background-color: rgb(189,189,192); color: white; font-weight: bold;">Fecha</th>';
																	htmlString+= '<th style="background-color: rgb(189,189,192); color: white; font-weight: bold;">Hora</th>';
																	htmlString+= '<th style="background-color: rgb(189,189,192); color: white; font-weight: bold;">Cambio</th>';
																	htmlString+= '</tr>';
																	htmlString+= '</thead><tbody style="color: rgb(103,103,103);">';
																	//$.each(data.rows, function(key, item) {
																	var rows = [];
																	for (var i = 0; i < data.rows.length; i++) {
																		var tmpHtmlString = '<tr>';
																		tmpHtmlString+= '<td>' + data.rows[i].fecha + '</td>';
																		tmpHtmlString+= '<td>' + data.rows[i].hora + '</td>';
																		tmpHtmlString+= '<td>' + data.rows[i].descripcion + '</td>';
																		tmpHtmlString+= '</tr>';
																		if (data.rows[i].descripcion == 'Ha ingresado al negocio') {
																			i = data.rows.length;
																		}
																		rows.push(tmpHtmlString);
																	}
																	htmlString+= rows.join('');
																	htmlString+= '</tbody></table>';
																}
															});
															return htmlString;
														},
														template: 'notify_modificacion_negocio',
														ejecutivo_responsable: {
															login: $('#ejecutivo').data('id'),
															name: $('#ejecutivo').val()
														}
													}); */

                          unaBase.ui.expandable.init();
                          unaBase.ui.unblock();

                          break;
                        case "Compras":
                          if (compras.tipoGasto == "FXR") {
                            toastr.success(
                              NOTIFY.get("SUCCESS_SAVE_GASTO_FXR")
                            );
                          } else {
                            toastr.success(NOTIFY.get("SUCCESS_SAVE_GASTO_OC"));
                          }

                          var target = $("#sheet-compras");
                          target
                            .find('input[name="oc[total_justificado]"]')
                            .val(data.justificado);
                          target
                            .find('input[name="oc[total_por_justificar]"]')
                            .val(data.saldoJustificar);
                          target
                            .find('input[name="oc[saldo_total_fxr]"]')
                            .val(data.saldoTotalFxr);
                          var footer = $(
                            "#sheet-compras table.dtcs > tfoot > tr > th"
                          );
                          footer
                            .find('input[name="oc[suma_justificado]"]')
                            .val(data.justificado);
                          var nuevo = false;

                          if (target.data("index") == "") {
                            nuevo = true;
                            compras.folio = data.index;
                            target.data("index", compras.folio);
                            target.data("folio", compras.folio);
                            target.find("#index").text("Nº " + compras.folio);
                            $(
                              '#dialog-menu ul li[data-name="cancel_oc"]'
                            ).remove();
                          }

                          unaBase.ui.expandable.init();
                          if (nuevo) {
                            $.ajax({
                              url: "/4DACTION/_V3_setLogValidacion",
                              data: {
                                table: "Orden_de_compra",
                                id_record: $("section.sheet").data("id"),
                                index_record: $("section.sheet").data("index"),
                                ref_record: $("section.sheet")
                                  .find('[name="oc[referencia]"]')
                                  .val(),
                                test: true
                              },
                              dataType: "json",
                              async: false,
                              success: function(data) {
                                has_rules = data.rows.length > 0;
                                if (has_rules && !crear_oc_validada) {
                                  //$('#menu [data-name="validate_send"]').show();
                                  /*initLogValidacion();*/
                                  sendValidar = true;
                                } else {
                                  $.ajax({
                                    url: "/4DACTION/_V3_setCompras",
                                    data: {
                                      id: $("section.sheet").data("id"),
                                      "oc[approved]": true,
                                      auto: true
                                    },
                                    dataType: "json",
                                    async: false,
                                    success: function(subdata) {
                                      var labelValidada = $(
                                        "section.sheet footer article p span.validation-status"
                                      );
                                      compras.validado = 1;
                                      $("#sheet-compras").data(
                                        "validado",
                                        true
                                      );
                                      $("#sheet-compras")
                                        .find('input[name="oc[validado]"]')
                                        .val(true);
                                      labelValidada
                                        .text("Validada")
                                        .attr("style", "color:black!important")
                                        .removeClass("false")
                                        .addClass("true");
                                      $(
                                        "section.sheet button.add.dtc"
                                      ).visible();
                                      $(
                                        "section.sheet button.add.orden-pago"
                                      ).visible();
                                      $(
                                        "section.sheet button.add.cobro"
                                      ).visible();
                                    }
                                  });
                                }
                              }
                            });
                          }

                          // Refrescar la lista de ítems para que se muestren en color rojo los ítems que exceden el gasto P
                          var idoc = $("#sheet-compras").data("id");
                          get_items(idoc);

                          // actualiza valores: Justicar, Pagos, Depositos, Total real (fn está en content.js de compras)
                          get_totales_gastos();

                          // refresca lista de dtc
                          get_oc_dtc(idoc);

                          // Notificaciones

                          if (nuevo) {
                            var tipoGasto = target
                              .find('input[name="oc[tipo_gastos][id]"]')
                              .val();
                            var origenGasto = target
                              .find('input[name="oc[origen]"]')
                              .val();
                            var neto = target
                              .find('input[name="oc[neto]"]')
                              .val();
                            var id_prov = target
                              .find('input[name="contacto[info][id]"]')
                              .val();
                            var folio = target.data("folio");

                            // Creacion
                            unaBase.inbox.send({
                              subject:
                                "Ha creado el gasto - " +
                                tipoGasto +
                                " Nº " +
                                folio +
                                " / " +
                                target
                                  .find('input[name="oc[referencia]"]')
                                  .val(),
                              into: "viewport",
                              href:
                                "/v3/views/compras/content.shtml?id=" + data.id,
                              tag: "avisos"
                            });

                            if (
                              compras.origen == "PROYECTO" ||
                              compras.origen == "PRESUPUESTO"
                            ) {
                              // Posible duplicacion
                              $.ajax({
                                url: "/4DACTION/_V3_verificaOcDuplicada",
                                data: {
                                  "verifica[id_oc_creando]": idoc,
                                  "verifica[id_prov]": id_prov,
                                  "verifica[neto]": neto,
                                  "verifica[origen]": origenGasto
                                },
                                dataType: "json",
                                success: function(result) {
                                  if (result.success) {
                                    unaBase.inbox.send({
                                      subject:
                                        "Ha creado posible gasto duplicado - " +
                                        tipoGasto +
                                        " Nº " +
                                        folio +
                                        " / " +
                                        target
                                          .find('input[name="oc[referencia]"]')
                                          .val(),
                                      into: "viewport",
                                      href:
                                        "/v3/views/compras/content.shtml?id=" +
                                        data.id,
                                      tag: "avisos"
                                    });
                                  }
                                }
                              });

                              // Excede gasto
                              var cantItemExcede = $(
                                "#sheet-compras table > tbody > tr"
                              ).find(
                                'input[name="oc[detalle_item][total]"].warning'
                              ).length;
                              if (cantItemExcede > 0) {
                                unaBase.inbox.send({
                                  subject:
                                    "Ha excedido el gasto presupuestado - " +
                                    tipoGasto +
                                    " Nº " +
                                    folio +
                                    " / " +
                                    target
                                      .find('input[name="oc[referencia]"]')
                                      .val(),
                                  into: "viewport",
                                  href:
                                    "/v3/views/compras/content.shtml?id=" +
                                    data.id,
                                  tag: "avisos"
                                });
                              }
                              
                              // 90% gastado
                              let gasto90Pres = $(
                                "#sheet-compras table > tbody > tr"
                              ).find(
                                'input[name="oc[detalle_item][total]"].noventagp'
                              ).length;
                              let used = parseInt(
                                $("#sheet-compras table > tbody > tr").find(
                                  'input[name="oc[detalle_item][total]"].percentage'
                                )[0].dataset.percentage
                              );

                              // if(used > 80){
                              // 	unaBase.inbox.send({
                              // 		subject: `Ha creado gasto con ${used}% presupuestado - ${tipoGasto} Nº  ${folio}  / ${target.find('input[name="oc[referencia]"]').val()} `,
                              // 		into: 'viewport',
                              // 		href: '/v3/views/compras/content.shtml?id=' + data.id,
                              // 		tag: 'avisos'
                              // 	});

                              // }
                              let expenseOrigin = compras.origen === 'PROYECTO' ? 'negocio' : 'presupuesto'
                              if (gasto90Pres > 0 && used > 90) {
                                unaBase.inbox.send({  subject: `Ha creado gasto de ${expenseOrigin} con 90% presupuestado - ` +
                                    tipoGasto +
                                    " Nº " +
                                    folio +
                                    " / " +
                                    target
                                      .find('input[name="oc[referencia]"]')
                                      .val(),
                                  into: "viewport",
                                  href:
                                    "/v3/views/compras/content.shtml?id=" +
                                    data.id,
                                  tag: "avisos"
                                });
                              }
                            }
                          }
                          oc_validate_fields();
                          unaBase.ui.unblock();
                          /*setTimeout(function(){
														unaBase.loadInto.viewport('/v3/views/compras/content.shtml?id=' + data.id, undefined, undefined, true)
													}, 500);*/
                          break;
                        case "Dtc":
                          var saveDtc = function() {
                            toastr.success(NOTIFY.get("SUCCESS_SAVE_DOCUMENT"));
                            setTimeout(function() {
                              $.ajax({
                                url: "/4DACTION/_V3_setItemsDtc",
                                dataType: "json",
                                type: "POST",
                                data: dtc.container.serializeAnything()
                              }).done(function(data) {
                                if (data.success) {
                                  unaBase.history.back();
                                } else {
                                  if (data.readonly) {
                                    toastr.error(
                                      NOTIFY.get("ERROR_RECORD_READONLY_ITEM")
                                    );
                                  }
                                }
                              });
                            }, 500);
                            unaBase.ui.unblock();
                          };
                          saveDtc();

                          break;

                        case "Dtv":
                          toastr.success(NOTIFY.get("SUCCESS_SAVE_DOCUMENT"));
                          dtv.init(dtv.id);
                          //unaBase.loadInto.viewport('/v3/views/dtv/content.shtml?id=' + dtv.id, undefined, undefined, true);
                          unaBase.ui.unblock();
                          break;

                        case "Dtcnc":
                          toastr.success(NOTIFY.get("SUCCESS_SAVE_DOCUMENT"));
                          setTimeout(function() {
                            $.ajax({
                              url: "/4DACTION/_V3_setItemsDtcnc",
                              dataType: "json",
                              type: "POST",
                              data: dtc.container.serializeAnything()
                            }).done(function(data) {
                              if (data.success) {
                                //confirm('El monto de la nota de crédito solo descontará la factura.<br>¿Deseas también descontar el monto en la orden de compra?').done(function(data) {
                                //if (data) {
                                /*$.ajax({
																			url: '/4DACTION/_V3_setDtc',
																			data: {
																				id: data.id,
																				nc_descontada_oc: true
																			},
																			dataType: 'json',
																			success: function(data) {
																				toastr.success('Monto descontado desde la orden de compra con éxito.');
																				setTimeout(function(){
																					const checkDtcAndSave = () => {
																						let moduleActive = document.querySelector('.sidebar li.active').dataset.name;
																						if(moduleActive === 'dtc') {
																							setTimeout(function() {
																								document.querySelector('li[data-name="save"] button').click();
																							},3000)
																						}

																					}
																					unaBase.history.back(checkDtcAndSave);
																				}, 500);
																			}
																		});*/

                                //} else {
                                unaBase.history.back();
                                //}
                                //});
                              } else {
                                if (data.readonly) {
                                  toastr.error(
                                    NOTIFY.get("ERROR_RECORD_READONLY_ITEM")
                                  );
                                }
                              }
                            });
                          }, 500);
                          unaBase.ui.unblock();
                          break;

                         case "Ingreso":
                          toastr.success(
                            "La orden de ingreso ha sido guardada"
                          );
                          var target = $(".ui-dialog");
                          target.find("fieldset.ingreso").data("id", data.id);
                          target
                            .find("fieldset.ingreso .nro-orden")
                            .text("Nº " + data.folio);
                          var saveDocIngreso = function() {
                            if (
                              $('.ui-dialog table tbody tr[data-new="true"]')
                                .length
                            ) {
                              $.ajax({
                                url: "/4DACTION/_V3_setDocPagoByIngreso",
                                type: "POST",
                                data: {
                                  "ingreso[documento][fecha]": $(
                                    '.ui-dialog table tbody tr[data-new="true"] td:nth-of-type(2)'
                                  ).text(),
                                  "ingreso[documento][tipo]": $(
                                    '.ui-dialog table tbody tr[data-new="true"] td:nth-of-type(3)'
                                  ).text(),
                                  "ingreso[documento][numero]": $(
                                    '.ui-dialog table tbody tr[data-new="true"] td:nth-of-type(4)'
                                  ).text(),
                                  "ingreso[documento][cuenta]": $('.ui-dialog table tbody tr[data-new="true"] td:nth-of-type(5)').data('id'),
                                  "ingreso[documento][check_cruzado]": $(
                                    '.ui-dialog table tbody tr[data-new="true"]'
                                  ).data("cruzado"),
                                  fk: $(
                                    ".ui-dialog-content fieldset.ingreso"
                                  ).data("id"),
                                  'ingreso[tipo_moneda]': ocb.moneda,
                                  'ingreso[valor_cambio]': ocb.valor_cambio
                                },
                                dataType: "json",
                                success: function(data) {
                                  toastr.success(
                                    "Documento de ingreso asociado con éxito."
                                  );
                                  $(  
                                    '.ui-dialog table tbody tr[data-new="true"]'
                                  ).remove();
                                  $(".ui-dialog table").trigger("refresh");
                                  $("section.sheet table.ingresos").trigger(
                                    "refresh"
                                  );
                                  if (
                                    $("section.sheet table.ingresos").length
                                  ) {
                                    $("#viewport").scrollTo(
                                      $("section.sheet table.ingresos"),
                                      800
                                    );
                                  }
                                }
                              });
                            } else {
                              $("section.sheet table.ingresos").trigger(
                                "refresh"
                              );
                              $("section.sheet table.dtvs").trigger("refresh");
                            }
                          };

                          // Mostrar ingreso de cobro y tabla de documentos de cobro
                          $(".ui-dialog fieldset.doc-ingreso").show();
                          $(".ui-dialog table").show();

                          saveDocIngreso();
                          unaBase.ui.unblock();
                          break;
                        
                        case "Pago":
                          toastr.success(NOTIFY.get("SUCCESS_SAVE_OP"));
                          payment.setpaid();

                          // unaBase.history.back();

                          unaBase.loadInto.viewport(
                            "/v3/views/pagos/content2.shtml?id=" + payment.id,
                            undefined,
                            undefined,
                            true
                          );

                          /*if(payment.folio == "" || payment.folio == "S/N"){
														payment.folio = data.folio;
														payment.estado = "EMITIDA";
														$('#index').text("Nº " + payment.folio);
														payment.container.find('span[data-name="estado"]').text(payment.estado);

														payment.setpaid();
														unaBase.loadInto.viewport('/v3/views/pagos/content2.shtml?id=' + payment.id, undefined, undefined, true);
													}
													payment.setpaid();
													payment.loadpaid();
													payment.display();*/

                          // var target = $('.ui-dialog');
                          // target.find('fieldset.pago').data('id', data.id);
                          // target.find('fieldset.pago label[name="number_order"]').text(data.folio);
                          // $('section.sheet table.pagos').trigger('refresh');
                          // $('section.sheet table.dtcs').trigger('refresh');
                          unaBase.ui.unblock();
                          break;

                        case "Usuario":
                          
                          if (data.success) {
                            toastr.success(NOTIFY.get("SUCCESS_SAVE"));
                          } else {
                            if (data.readonly) {
                              toastr.error(
                                NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                              );
                            } else {
                              toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                            }
                          }

                          unaBase.ui.unblock();

                          break;
                        case "Usuarios":
                          
                          if (data.success) {
                            toastr.success(NOTIFY.get("SUCCESS_SAVE"));
                            $('input[name="usuario[new]"]').val("false");
                          } else {
                            if (data.readonly) {
                              toastr.error(
                                NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                              );
                            } else {
                              toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                            }
                          }
                          unaBase.ui.unblock();
                          break;

                        /*case 'Producto':
													if (data.success) {
														unaBase.toolbox.menu.buttons([ 'save', 'deactivate', 'exit' ]);
														toastr.success(NOTIFY.get('SUCCESS_SAVE'));
													}
													unaBase.ui.unblock();
													break;*/
                        case "Occ":
                          if (data.success) {
                            new_occ = false;
                            toastr.success(NOTIFY.get("SUCCESS_SAVE"));
                            $(element)
                              .parentTo(".ui-dialog-content")
                              .find('[name="occ[id]"]')
                              .val(data.id);
                            refreshOcc();
                            if (!$("#sheet-occ").data("pending"))
                              $(element)
                                .parentTo(".ui-dialog-content")
                                .dialog("close");
                          } else {
                            if (!data.pass) {
                              toastr.error(
                                NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                              );
                            } else {
                              toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                            }
                          }
                          unaBase.ui.unblock();
                          break;
                        case "Cobro":
                          if (data.success) {
                            toastr.success(NOTIFY.get("SUCCESS_SAVE"));
                            $(elementCobro)
                              .parentTo(".ui-dialog-content")
                              .dialog("close");
                          } else {
                            if (data.readonly) {
                              toastr.error(
                                NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                              );
                            } else {
                              toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                            }
                          }
                          $("section.sheet table.cobros").trigger("refresh");
                          unaBase.ui.unblock();
                          break;
                        case "InstancesByProducto":
                          if (data.success) {
                            toastr.success(NOTIFY.get("SUCCESS_SAVE"));
                            // Insertar aquí código para que la fusión se refleje en el listado
                            // deben desaparecer los ítems fusionados
                            var items = [];
                            $(".ui-dialog-content table > tbody > tr").each(
                              function() {
                                items.push($(this).data("id"));
                              }
                            );
                            $("section#viewport table.credencial > tbody > tr")
                              .filter(function() {
                                return $.inArray($(this).data("id"), items);
                              })
                              .remove();

                            // luego, en el save del producto hay que hacer que se cree la ficha si el producto es nuevo
                            unaBase.loadInto.dialog(
                              "/v3/views/catalogo/content.shtml?id=" + data.id,
                              "Nuevo servicio fusionado",
                              "large"
                            );
                          } else {
                            if (data.readonly)
                              toastr.error(
                                NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                              );
                            else toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                          }
                          unaBase.ui.unblock();
                        default:
                          toastr.success(NOTIFY.get("SUCCESS_SAVE"));

                          unaBase.ui.unblock();
                          break;
                      }
                      if(unaBase.save.callback !== null){
                        unaBase.save.callback();
                        unaBase.save.clearCallback();
                      }
                    } else {
                      if (
                        typeof data.detail != "undefined" &&
                        data.detail.result
                      ) {
                        toastr.warning(data.detail.data);
                      } else {

                        if (typeof data.computer != "undefined") {
                          var bloqueo = "";
                          if (typeof data.computer != "undefined") {
                            bloqueo = "<br>-Desde: " + data.bloqueo;
                          }
                          toastr.error(
                            NOTIFY.get("ERROR_RECORD_READONLY") +
                              "<br><br>Bloqueado por:<br><br>-Equipo: " +
                              data.computer +
                              "<br>-Proceso: " +
                              data.process +
                              bloqueo
                          );
                        } else {
                          toastr.error(NOTIFY.get("ERROR_RECORD_READONLY"));
                        }
                      }
                      unaBase.ui.unblock();
                    }
                  });
                };

                if (params.validate()) {
                  if (params.entity == "Cotizacion") {
                    unaBase.ui.unblock();
                    if (
                      $("table.items tbody").find("tr:not(.title)").length == 0
                    ) {
                      confirm(
                        "La cotización no contiene ítems en el detalle.\n\n¿Quieres guardar la cotización de todos modos?"
                      ).done(function(data) {
                        if (data) {
                          unaBase.ui.block();
                          window.setTimeout(function() {
                            setData(true);
                            if (sendValidar)
                              window.setTimeout(function() {
                                initLogValidacion();
                              }, 500);
                          }, 500);
                        }
                      });
                    } else {
                      // Verificar que gasto P sea menor al precio de venta
                      var isGastoPExcedido = false;
                      $("table.items.cotizacion tbody tr:not(.title)").each(
                        function(key, item) {
                          var subtotal_precio = parseFloat(
                            $(item)
                              .closest("tr")
                              .find('[name="item[][subtotal_precio]"]')
                              .val()
                          );
                          var subtotal_costo = parseFloat(
                            $(item)
                              .closest("tr")
                              .find('[name="item[][subtotal_costo]"]')
                              .val()
                          );
                          if (
                            subtotal_precio > 0 &&
                            subtotal_costo > subtotal_precio
                          ) {
                            isGastoPExcedido = true;
                            $(item)
                              .closest("tr")
                              .find('[name="item[][subtotal_costo]"]')
                              .css("background-color", "red");
                          } else {
                            $(item)
                              .closest("tr")
                              .find('[name="item[][subtotal_costo]"]')
                              .css("background-color", "#f4b289");
                          }
                        }
                      );
                      if (isGastoPExcedido) {
                        confirm(
                          "La cotización tiene ítems con gasto presupuestado mayor al precio de venta.\n\n¿Quieres guardar la cotización de todos modos?"
                        ).done(function(data) {
                          if (data) {
                            unaBase.ui.block();
                            $(
                              "table.items.cotizacion tbody tr:not(.title)"
                            ).each(function(key, item) {
                              $(item)
                                .closest("tr")
                                .find('[name="item[][subtotal_costo]"]')
                                .css("background-color", "#f4b289");
                            });
                            window.setTimeout(function() {
                              $("table.items.cotizacion").data(
                                "gastop-mayor-venta",
                                true
                              );
                              console.log("gastop mayor venta? sí");
                              setData();
                              if (sendValidar)
                                window.setTimeout(function() {
                                  initLogValidacion();
                                }, 500);
                            }, 500);
                          }
                        });
                      } else {
                        window.setTimeout(function() {
                          setData();
                          if (sendValidar)
                            window.setTimeout(function() {
                              initLogValidacion();
                            }, 500);
                        }, 500);
                      }
                    }
                  } else if (params.entity == "Negocios") {
                    if (eventData.isTrigger != 2) {
                      // Verificar que gasto P sea menor al precio de venta
                      var isGastoPExcedido = false;
                      $("table.items tbody tr:not(.title)").each(function(
                        key,
                        item
                      ) {
                        var subtotal_precio = parseFloat(
                          $(item)
                            .closest("tr")
                            .find('[name="item[][subtotal_precio]"]')
                            .val()
                        );
                        var subtotal_costo = parseFloat(
                          $(item)
                            .closest("tr")
                            .find('[name="item[][subtotal_costo]"]')
                            .val()
                        );
                        if (
                          subtotal_precio > 0 &&
                          subtotal_costo > subtotal_precio
                        ) {
                          isGastoPExcedido = true;
                          $(item)
                            .closest("tr")
                            .find('[name="item[][subtotal_costo]"]')
                            .css("background-color", "red");
                        } else {
                          $(item)
                            .closest("tr")
                            .find('[name="item[][subtotal_costo]"]')
                            .css("background-color", "#f4b289");
                        }
                      });
                      if (isGastoPExcedido) {
                        unaBase.ui.unblock();
                        confirm(
                          "El negocio tiene ítems con gasto presupuestado mayor al precio de venta.\n\n¿Quieres guardar el negocio de todos modos?"
                        ).done(function(data) {
                          if (data) {
                            unaBase.ui.block();
                            $("table.items tbody tr:not(.title)").each(function(
                              key,
                              item
                            ) {
                              $(item)
                                .closest("tr")
                                .find('[name="item[][subtotal_costo]"]')
                                .css("background-color", "#f4b289");
                            });
                            window.setTimeout(function() {
                              $("table.items.cotizacion").data(
                                "gastop-mayor-venta",
                                true
                              );
                              console.log("gastop mayor venta? sí");
                              setData();
                            }, 500);
                          }
                        });
                      } else {
                        unaBase.ui.block();
                        window.setTimeout(function() {
                          setData();
                        }, 500);
                      }
                    } else {
                      unaBase.ui.block();
                      window.setTimeout(function() {
                        setData();
                      }, 500);
                    }
                  } else if (params.entity == "Dtc" && $('li[data-name="resumen[dtc][origen]"]').text() == "ASOCIADA A RENDICIÓN" ) {
                    var id_oc = parseFloat(
                      $('[data-name="resumen[dtc][origen]"]').data("id")
                    );
                    var folio_oc = $('[data-name="resumen[dtc][origen]"]').data(
                      "index"
                    );
                    var referencia_oc = $(
                      '[data-name="resumen[dtc][origen]"]'
                    ).data("text");
                    var saldo = parseFloat(
                      $('[data-name="resumen[dtc][origen]"]').data("saldo")
                    );
                    var total = parseFloat(
                      $('[name="total"]')
                        .val()
                        .replace(".", "")
                        .replace(",", ".")
                    );
                    var exceso_permitido = parseFloat(
                      $("#sheet-dtc").data("excesook")
                    );
                    var exceso = -(saldo - total);
                    if (exceso > 0) {
                      //if (exceso > exceso_permitido) {
                      if (false) {
                        // FIX: la validación de exceso actualmente no funciona porque no se está asociando correctamente el DTC a la rendición
                        confirm(
                          "El documento excede en $" +
                            exceso +
                            " el monto solicitado.<br>\
												La rendición debe ser validada. ¿Desea continuar?"
                        ).done(function(data) {
                          if (data) {
                            // Guardar DTC

                            unaBase.ui.block();
                            window.setTimeout(function() {
                              setData();
                            }, 1);

                            // Marcar OC como excedida
                            $.ajax({
                              url: "/4DACTION/_V3_setCompras",
                              data: {
                                id: id_oc,
                                excedida: true,
                                exceso: exceso
                              },
                              dataType: "json",
                              success: function(data) {
                                // Enviar notificación
                                unaBase.inbox.send({
                                  subject:
                                    "Ha excedido el monto solicitado en $" +
                                    exceso +
                                    " - Rendición de fondos Nº " +
                                    folio_oc +
                                    " / " +
                                    referencia_oc,
                                  into: "viewport",
                                  href:
                                    "/v3/views/compras/content.shtml?id=" +
                                    id_oc,
                                  tag: "avisos"
                                });
                              }
                            });
                          }
                        });
                      } else {
                        unaBase.ui.block();
                        window.setTimeout(function() {
                          setData();
                        }, 1);

                        // Enviar notificación igual auque no se tenga que validar
                        unaBase.inbox.send({
                          subject:
                            "Ha excedido el monto solicitado en $" +
                            exceso +
                            " - Rendición de fondos Nº " +
                            folio_oc +
                            " / " +
                            referencia_oc,
                          into: "viewport",
                          href: "/v3/views/compras/content.shtml?id=" + id_oc,
                          tag: "avisos"
                        });
                      }
                    } else {
                      unaBase.ui.block();
                      window.setTimeout(function() {
                        setData();
                      }, 1);
                    }
                  } else {
                    unaBase.ui.block();
                    window.setTimeout(function() {
                      setData();
                      if (sendValidar)
                        window.setTimeout(function() {
                          initLogValidacion();
                        }, 1);
                    }, 1);
                  }
                } else {
                  toastr.error(
                    "Es necesario completar la información requerida antes de guardar.",
                    "Faltan datos"
                  );
                  unaBase.ui.unblock();
                }
              };

              // guardado asíncrono para alcanzar a mostrar Cargando...
              if (
                params.entity == "Cotizacion" ||
                params.entity == "Negocios"
              ) {
                unaBase.ui.block();
                // saveAction();
                setTimeout(saveAction, 1000);
              } else {
                saveAction();
              }

              return { success: true };
              // return { success: success };
            }
          });

        if ($.inArray("refresh", params.buttons) != -1)
          buttons.push({
            name: "refresh",
            icon: "ui-icon-refresh",
            caption: "Recargar",
            action: function(event) {
              // $('li[data-name=save] button').trigger('click');
              confirm(
                "¿Deseas recargar el formulario para ver los últimos datos, podrías perder información no guardada de los últimos cambios ?"
              ).done(function(data) {
                if (data) {
                  unblockCot();
                  var location = unaBase.history.current();
                  unaBase.loadInto.viewport(
                    location.url,
                    location.standalone,
                    undefined,
                    true
                  );
                }
              });
            }
          });

        if ($.inArray("offline_mode", params.buttons) != -1)
          buttons.push({
            name: "offline_mode",
            icon: "ui-icon-suitcase",
            caption: "Modo rápido",
            action: function() {
              if (!modoOffline) {
                confirm(
                  "¿Deseas habilitar el modo offline para agilizar el proceso de cotizar?",
                  "Sí",
                  "No"
                ).done(function(data) {
                  if (data) {
                    modoOffline = true;
                    $('#menu [data-name="offline_mode"]').addClass("active");
                  }
                });
              } else {
                modoOffline = false;
                $('#menu [data-name="offline_mode"]').removeClass("active");
              }
            }
          });

        if ($.inArray("save_and_create", params.buttons) != -1)
          buttons.push({
            name: "save_and_create",
            icon: "ui-icon-disk",
            caption: "Guardar y agregar",
            action: function() {
              var callback = function() {
                var saved = menu
                  .find('[data-name="save"] button')
                  .triggerHandler("click");
                if (!saved.success) return false;

                $.ajax({
                  url: "/4DACTION/_V3_setCompras",
                  dataType: "json",
                  type: "POST",
                  data: {
                    create_from: "OC"
                  }
                }).done(function(data) {
                  unaBase.loadInto.viewport(
                    "/v3/views/compras/content.shtml?id=" + data.id
                  );
                });
              };
              callback();
            }
          });

        if ($.inArray("views_basico", params.buttons) != -1)
          buttons.push({
            name: "views",
            icon: "ui-icon-transferthick-e-w",
            caption: "Vista admin",
            action: function() {
              unaBase.loadInto.viewport("/v3/views/compras/list_admin.shtml");
            }
          });

        if ($.inArray("views_admin", params.buttons) != -1)
          buttons.push({
            name: "views",
            icon: "ui-icon-transferthick-e-w",
            caption: "Vista básica",
            action: function() {
              unaBase.loadInto.viewport("/v3/views/compras/list_basico.shtml");
            }
          });

        if ($.inArray("update", params.buttons) != -1)
          buttons.push({
            name: "update",
            icon: "ui-icon-refresh",
            caption: "Refrescar",
            action: function() {
              var id = $(".sheet").data("id");
              switch (params.entity) {
                case "Compras":
                  unaBase.loadInto.viewport(
                    "/v3/views/compras/content.shtml?id=" + id + "&from=self"
                  );
                  break;
                case "Dtc":
                  //unaBase.loadInto.viewport('/v3/views/dtc/content.shtml?id=' + id+'&registrado=si&from=self');
                  unaBase.loadInto.viewport(
                    "/v3/views/dtc/content.shtml?id=" + id
                  );
                  break;
              }
            }
          });

        if ($.inArray("itemsoc_volver_proyectos", params.buttons) != -1)
          buttons.push({
            name: "itemsoc_volver_proyectos",
            icon: "ui-icon-arrowthick-1-w",
            caption: "Negocios",
            action: function() {
              $(".ui-dialog-titlebar .ui-dialog-title").text(
                "SELECCIONAR NEGOCIOS"
              );
              var container = $(
                "#buscar-proyectos-compras > .dynamic-container"
              );
              container.find("*").remove();
              get_proyectos_compras("load");
              $(".ui-dialog")
                .find("header")
                .hide();
            }
          });

        if ($.inArray("itemsoc_volver_proyectos2", params.buttons) != -1)
          buttons.push({
            name: "itemsoc_volver_proyectos2",
            icon: "ui-icon-arrowthick-1-w",
            caption: "Negocios",
            action: function() {
              var id = $(".sheet-gastos").data("id");
              var from = $("#sheet-items_proyect-select").data("from");
              unaBase.loadInto.dialog(
                "/v3/views/compras/proyectos2.shtml?id=" + id + "&from=" + from,
                "SELECCIONAR NEGOCIO",
                "large"
              );
            }
          });

        if ($.inArray("itemsoc_volver_presupuestos2", params.buttons) != -1)
          buttons.push({
            name: "itemsoc_volver_presupuestos2",
            icon: "ui-icon-arrowthick-1-w",
            caption: "Negocios",
            action: function() {
              var id = $(".sheet-gastos").data("id");
              var from = $("#sheet-items_proyect-select").data("from");
              unaBase.loadInto.dialog(
                "/v3/views/compras/presupuestos2.shtml?id=" +
                  id +
                  "&from=" +
                  from,
                "SELECCIONAR PRESUPUESTO",
                "large"
              );
            }
          });

        if ($.inArray("move_items_oc", params.buttons) != -1)
          buttons.push({
            name: "move_items_oc",
            icon: "ui-icon-arrowthick-1-w",
            caption: "Negocios",
            action: function() {
              var id = $(".sheet-gastos").data("id");
              var from = $("#sheet-items_proyect-select").data("from");
              unaBase.loadInto.dialog(
                "/v3/views/compras/proyectos2.shtml?id=" + id + "&from=" + from,
                "SELECCIONAR NEGOCIO",
                "large"
              );
            }
          });

        // Contact
        if ($.inArray("new_contact", params.buttons) != -1)
          buttons.push({
            name: "new_contact",
            icon: "ui-icon-document",
            caption: "Crear",
            action: function() {
              var id = 0;
              unaBase.loadInto.dialog(
                "/v3/views/contactos/content.shtml?id=" + id,
                "Perfil",
                "xx-large"
              );
            }
          });

        // Box
        if ($.inArray("new_box", params.buttons) != -1)
          buttons.push({
            name: "new_box",
            icon: "ui-icon-document",
            caption: "Crear",
            action: function() {
              var id = 0;
              unaBase.loadInto.dialog(
                "/v3/views/box/content.shtml?id=" + id,
                "Perfil",
                "xx-large"
              );
            }
          });

        if ($.inArray("disable_from_list", params.buttons) != -1)
          buttons.push({
            name: "disable_from_list",
            icon: "ui-icon-locked",
            caption: "Desactivar",
            action: function() {
              var itemsSelected = $(
                ".credencial > tbody > tr > td > div.chk > input:checked"
              );
              var amount = itemsSelected.length;
              switch (params.entity) {
                case "Producto":
                  if (amount == 1) {
                    var msg = "¿Quieres desactivar el servicio seleccionado?";
                  } else {
                    var msg =
                      "¿Quieres desactivar los servicios seleccionados?";
                  }
                  confirm(msg).done(function(data) {
                    if (data) {
                      var cant = 0;
                      itemsSelected.each(function(key, item) {
                        $.ajax({
                          url: "/4DACTION/_V3_setProducto",
                          dataType: "json",
                          type: "POST",
                          async: false,
                          data: {
                            id: $(this).val(),
                            "producto[estado]": "false"
                          }
                        }).done(function(data) {
                          if (data.success) {
                            cant++;
                          }
                          if (cant == amount) {
                            if (amount == 1) {
                              toastr.success(
                                "Servicio desactivado correctamente."
                              );
                            } else {
                              toastr.success(
                                "Servicios desactivados correctamente."
                              );
                            }
                            setTimeout(function() {
                              unaBase.loadInto.viewport(
                                "/v3/views/catalogo/index.shtml"
                              );
                            }, 200);
                          }
                        });
                      });
                    }
                  });
                  break;
                case "Contacto":
                  if (amount == 1) {
                    var msg = "¿Quieres desactivar el contacto seleccionado?";
                  } else {
                    var msg =
                      "¿Quieres desactivar los contactos seleccionados?";
                  }
                  confirm(msg).done(function(data) {
                    if (data) {
                      var cant = 0;
                      itemsSelected.each(function(key, item) {
                        $.ajax({
                          url: "/4DACTION/_V3_setContacto",
                          dataType: "json",
                          type: "POST",
                          async: false,
                          data: {
                            id: $(this).val(),
                            "contact[estado]": "false"
                          }
                        }).done(function(data) {
                          if (data.success) {
                            cant++;
                          }
                          if (cant == amount) {
                            if (amount == 1) {
                              toastr.success(
                                "Contacto desactivado correctamente."
                              );
                            } else {
                              toastr.success(
                                "Contactos desactivados correctamente."
                              );
                            }
                            setTimeout(function() {
                              unaBase.loadInto.viewport(
                                "/v3/views/contactos/index.shtml"
                              );
                            }, 200);
                          }
                        });
                      });
                    }
                  });
                  break;
              }
            }
          });

        if ($.inArray("merge_contact", params.buttons) != -1)
          buttons.push({
            name: "merge_contact",
            icon: "ui-icon-transferthick-e-w",
            caption: "Fusionar",
            action: function() {
              alert("coming soon!");
            }
          });

        if ($.inArray("merge", params.buttons) != -1)
          buttons.push({
            name: "merge",
            icon: "ui-icon-transferthick-e-w",
            caption: "Fusionar",
            action: function() {
              unaBase.loadInto.dialog(
                "/v3/views/catalogo/merge.shtml",
                "Fusionar ítems del catálogo",
                "large"
              );
            }
          });

        if ($.inArray("merge_report", params.buttons) != -1)
          buttons.push({
            name: "merge_report",
            icon: "ui-icon-transferthick-e-w",
            caption: "Fusionar",
            action: function() {
              unaBase.loadInto.dialog(
                "/v3/views/catalogo/merge.shtml",
                "Fusionar ítems del catálogo",
                "large"
              );
            }
          });

        if ($.inArray("tag_contact", params.buttons) != -1)
          buttons.push({
            name: "tag_contact",
            icons: {
              primary: "ui-icon-tag",
              secondary: "ui-icon-triangle-1-s"
            },
            caption: "Etiquetar",
            action: function() {
              $(this).tooltipster({
                content: function() {
                  var styles = {
                    width: "300px",
                    backgroundColor: "white"
                  };
                  var htmlObject = $("<div>");
                  htmlObject.css(styles);
                  htmlObject.load("/v3/views/contactos/etiquetar.shtml");
                  return htmlObject;
                },
                interactive: true,
                trigger: "",
                delay: 0,
                theme: "tooltipster-custom-theme",
                interactiveAutoClose: true
              });
              $(this).tooltipster("show");
            }
          });

        if ($.inArray("tag", params.buttons) != -1)
          buttons.push({
            name: "tag",
            icons: {
              primary: "ui-icon-tag",
              secondary: "ui-icon-triangle-1-s"
            },
            caption: "Etiquetar",
            action: function() {
              $(this).tooltipster({
                content: function() {
                  var styles = {
                    width: "150px",
                    backgroundColor: "white"
                  };
                  var htmlObject = $("<div>");
                  htmlObject.css(styles);
                  htmlObject.load("/v3/views/catalogo/etiquetar.shtml");
                  return htmlObject;
                },
                interactive: true,
                trigger: "",
                delay: 0,
                theme: "tooltipster-custom-theme",
                interactiveAutoClose: true
              });
              $(this).tooltipster("show");
            }
          });

        if ($.inArray("itemsoc_agregar_items", params.buttons) != -1)
          buttons.push({
            name: "itemsoc_agregar_items",
            icon: "ui-icon-plus",
            caption: "Agregar selección",
            action: function() {
              var id = $.unserialize(params.data()).id;
              var target = $(this);
              var selected = false;
              $.each($.unserialize(params.data()), function(key, item) {
                if (key.match(/detalle\[check_item\](.*)/i)) {
                  selected = true;
                }
              });
              if (selected) {
                var bodyCompras = $("#sheet-compras table > tbody");
                var titles = bodyCompras.find('tr[data-tipo="TITULO"]');
                var cantTitulos = titles.length;
                var correlativo = bodyCompras.find("tr").length;
                var idDtc = $(
                  '#sheet-compras input[name="tipo_doc[id]"]'
                ).val();
                var objNamesTitles = {};
                titles.each(function(key, item) {
                  var name = $(this)
                    .find('input[name="oc[detalle_item][nombre]"]')
                    .val();
                  var llave = $(this)
                    .find('input[name="oc[detalle_item][llave]"]')
                    .val();
                  var gastar = $(this)
                    .find('input[name="oc[detalle_item][llave]"]')
                    .val();
                  var string = "]" + name + "]" + llave + "]";
                  eval(
                    "obj = {'oc[detalle_item][titulos]" +
                      key +
                      "': '" +
                      string +
                      "'}"
                  );
                  $.extend(objNamesTitles, objNamesTitles, obj);
                });
                var obj = {
                  "oc[rows][id_oc]": 0,
                  "oc[rows][id_nv]": 0,
                  "oc[rows][origen]": "PROYECTO",
                  "oc[rows][tipo]": "AMBOS",
                  "oc[rows][cant_titulos]": cantTitulos,
                  "oc[rows][correlativo]": correlativo,
                  "oc[rows][tipo_doc][id]": idDtc,
                  "oc[from]": "agregar_item"
                };
                var objFinal = $.extend(
                  {},
                  obj,
                  $.unserialize(params.data()),
                  objNamesTitles
                );
                $.ajax({
                  url: "/4DACTION/_v3_get_rows_compras",
                  data: objFinal,
                  dataType: "json",
                  success: function(data) {
                    $(target)
                      .parentTo(".ui-dialog-content")
                      .dialog("close");
                    add_items_oc(data);
                    set_referencia_oc();
                  }
                });
              } else {
                toastr.warning(NOTIFY.get("WARNING_ITEM_SELECTION"));
              }
            }
          });

        if ($.inArray("itemsoc_agregar_items2", params.buttons) != -1)
          buttons.push({
            name: "itemsoc_agregar_items2",
            icon: "ui-icon-plus",
            caption: "Agregar selección",
            action: function() {
              var target = $(this);
              var container = $("#sheet-compras");
              var containerItem = $("#sheet-items_proyect-select");
              var body = container.find("table.items > tbody");
              var id = container.data("id");
              var idnv = containerItem.data("idnv");
              var from = containerItem.data("from").toUpperCase();
              var selected = false;
              $.each($.unserialize(params.data()), function(key, item) {
                if (key.match(/detalle\[check_item\](.*)/i)) {
                  selected = true;
                }
              });
              if (selected) {
                var titles = body.find('tr[data-tipo="TITULO"]');
                var cantTitulos = titles.length;
                var correlativo = body.find("tr").length;
                var idDtc = container.find('input[name="tipo_doc[id]"]').val();
                var objNamesTitles = {};
                titles.each(function(key, item) {
                  if (from == "OC") {
                    var name = $(this)
                      .find('input[name="oc[detalle_item][nombre]"]')
                      .val();
                    var llave = $(this)
                      .find('input[name="oc[detalle_item][llave]"]')
                      .val();
                    var string = "]" + name + "]" + llave + "]";
                    eval(
                      "obj = {'oc[detalle_item][titulos]" +
                        key +
                        "': '" +
                        string +
                        "'}"
                    );
                  } else {
                    var name = $(this)
                      .find('input[name="dtc[detalle_item][nombre]"]')
                      .val();
                    var llave = $(this)
                      .find('input[name="dtc[detalle_item][llave]"]')
                      .val();
                    var string = "]" + name + "]" + llave + "]";
                    eval(
                      "obj = {'dtc[detalle_item][titulos]" +
                        key +
                        "': '" +
                        string +
                        "'}"
                    );
                  }
                  $.extend(objNamesTitles, objNamesTitles, obj);
                });
                var obj = {
                  "oc[rows][id_oc]": id,
                  "oc[rows][id_dtc]": id,
                  "oc[rows][id_nv]": idnv,
                  "oc[rows][origen]": "PROYECTO",
                  "oc[rows][tipo]": "AMBOS",
                  "oc[rows][cant_titulos]": cantTitulos,
                  "oc[rows][correlativo]": correlativo,
                  "oc[rows][tipo_doc][id]": idDtc,
                  "oc[from]": "agregar_item"
                };
                var objFinal = $.extend(
                  {},
                  obj,
                  $.unserialize(params.data()),
                  objNamesTitles
                );
                if (from == "OC") {
                  var url = "_v3_get_rows_compras";
                } else {
                  var url = "_v3_get_rows_dtc";
                }
                $.ajax({
                  url: "/4DACTION/" + url,
                  data: objFinal,
                  dataType: "json",
                  success: function(data) {
                    $(target)
                      .parentTo(".ui-dialog-content")
                      .dialog("close");
                    if (from == "OC") {
                      add_items_oc(data);
                      set_referencia_oc();
                    } else {
                      add_items_dtc(data);
                    }
                  }
                });
              } else {
                toastr.warning(NOTIFY.get("WARNING_ITEM_SELECTION"));
              }
            }
          });

        if ($.inArray("itemsoc_otros_gastos2", params.buttons) != -1)
          buttons.push({
            name: "itemsoc_otros_gastos2",
            icon: "ui-icon-document-b",
            caption: "Otros gastos",
            action: function() {
              var containerItem = $("#sheet-items_proyect-select");
              var container = $("#sheet-compras");
              var idnv = containerItem.data("idnv");
              var from = containerItem.data("from").toUpperCase();
              var id = container.data("id");
              var cantTitulos = container.find(
                'table.items > tbody > tr[data-tipo="TITULO"]'
              ).length;
              var correlativo = container.find("table.items > tbody > tr")
                .length;
              var idDtc = container.find('input[name="tipo_doc[id]"]').val();
              if (from == "OC") {
                var url = "_v3_get_rows_compras";
              } else {
                var url = "_v3_get_rows_dtc";
              }
              $.ajax({
                url: "/4DACTION/" + url,
                data: {
                  "oc[rows][id_oc]": id,
                  "oc[rows][id_dtc]": id,
                  "oc[rows][id_nv]": idnv,
                  "oc[rows][origen]": "PROYECTO",
                  "oc[rows][tipo]": "OTROS GASTOS",
                  "oc[rows][cant_titulos]": cantTitulos,
                  "oc[rows][correlativo]": correlativo,
                  "oc[rows][tipo_doc][id]": idDtc,
                  "oc[from]": "agregar_item"
                },
                dataType: "json",
                success: function(data) {
                  $(containerItem)
                    .parentTo(".ui-dialog-content")
                    .dialog("close");
                  if (from == "OC") {
                    add_items_oc(data);
                    set_referencia_oc();
                  } else {
                    add_items_dtc(data);
                  }
                }
              });
            }
          });

        if ($.inArray("itemsoc_otros_gastos", params.buttons) != -1)
          buttons.push({
            name: "itemsoc_otros_gastos",
            icon: "ui-icon-document-b",
            caption: "Otros gastos",
            action: function() {
              var target = $("#buscar-proyectos-compras");
              var id_proyecto = target
                .find('input[name="oc[negocio][id]"][type="hidden"]')
                .val();
              var id_oc = target
                .find('input[name="oc[id]"][type="hidden"]')
                .val();
              var cantTitulos = $(
                '#sheet-compras table > tbody > tr[data-tipo="TITULO"]'
              ).length;
              var correlativo = $("#sheet-compras table > tbody > tr").length;
              var idDtc = $('#sheet-compras input[name="tipo_doc[id]"]').val();
              $.ajax({
                url: "/4DACTION/_v3_get_rows_compras",
                data: {
                  "oc[rows][id_oc]": id_oc,
                  "oc[rows][id_nv]": id_proyecto,
                  "oc[rows][origen]": "PROYECTO",
                  "oc[rows][tipo]": "OTROS GASTOS",
                  "oc[rows][cant_titulos]": cantTitulos,
                  "oc[rows][correlativo]": correlativo,
                  "oc[rows][tipo_doc][id]": idDtc,
                  "oc[from]": "agregar_item"
                },
                dataType: "json",
                success: function(data) {
                  $(target)
                    .parentTo(".ui-dialog-content")
                    .dialog("close");
                  add_items_oc(data);
                }
              });
            }
          });

        if ($.inArray("create_dtc", params.buttons) != -1)
          buttons.push({
            name: "create_dtc",
            icon: "ui-icon-document",
            caption: "Crear",
            action: function() {
              unaBase.loadInto.dialog(
                "/v3/views/dtc/dialog/compras_disponibles.shtml",
                "SELECCIONAR ÓRDENES DE COMPRA PARA CREAR DTC",
                "x-large"
              );
            }
          });
        if ($.inArray("create_area_negocio", params.buttons) != -1)
          buttons.push({
            name: "create_area_negocio",
            icon: "ui-icon-document",
            caption: "Crear",
            action: function() {
              unaBase.loadInto.viewport(
                "/v3/views/ajustes/area_negocio/content.shtml",
                "Crear area de negocio",
                false
              );
            }
          });

        if ($.inArray("create_impuesto_from_tipodtc", params.buttons) != -1)
          buttons.push({
            name: "create_impuesto_from_tipodtc",
            icon: "ui-icon-document",
            caption: "Crear",
            action: function() {
              impuestos.set("create", "dtc");
            }
          });

        if ($.inArray("send_mail_report", params.buttons) != -1)
          buttons.push({
            name: "send_mail_report",
            icon: "ui-icon-document",
            caption: "Enviar reportes habilitados",
            action: function() {
              $.ajax({
                url: "/4DACTION/_V3_Envia_email_reportes",
                dataType: "json",
                type: "POST",
                data: {
                  each: false
                }
              }).done(function(data) {
                return false;
              });
            }
          });

        if ($.inArray("send_mail_report_each", params.buttons) != -1)
          buttons.push({
            name: "send_mail_report_each",
            icon: "ui-icon-document",
            caption: "Enviar Reporte",
            action: function() {
              $.ajax({
                url: "/4DACTION/_V3_Envia_email_reportes",
                dataType: "json",
                type: "POST",
                data: {
                  reporte_codigo: reportes.data.codigo,
                  each: true
                }
              }).done(function(data) {
                return false;
              });
            }
          });

        if ($.inArray("create_dtc_cero", params.buttons) != -1)
          buttons.push({
            name: "create_dtc_cero",
            icon: "ui-icon-document",
            caption: "crear desde cero",
            action: function() {
              var element = this;
              $.ajax({
                url: "/4DACTION/_V3_setDtc",
                dataType: "json",
                type: "POST",
                data: []
              }).done(function(data) {
                $(element)
                  .parentTo(".ui-dialog-content")
                  .dialog("close");
                unaBase.loadInto.viewport(
                  "/v3/views/dtc/content.shtml?id=" + data.id
                );
              });
            }
          });

        if ($.inArray("create_dtv_cero", params.buttons) != -1)
          buttons.push({
            name: "create_dtv_cero",
            icon: "ui-icon-document",
            caption: "No asociar negocios (saltar este paso)",
            action: function() {
              var element = this;
              $.ajax({
                url: "/4DACTION/_V3_setDtv",
                dataType: "json",
                type: "POST",
                data: []
              }).done(function(data) {
                $(element)
                  .parentTo(".ui-dialog-content")
                  .dialog("close");
                unaBase.loadInto.viewport(
                  "/v3/views/dtv/content2.shtml?id=" + data.id
                );
              });
            }
          });

         if ($.inArray("create_oc_desde_preoc", params.buttons) != -1)
          buttons.push({
            name: "create_oc_desde_preoc",
            icon: "ui-icon-document",
            caption: "Crear Orden de compra",
            action: function() {
              crearOCByPre();
            }
          });

        if ($.inArray("create_dtv", params.buttons) != -1)
          buttons.push({
            name: "create_dtv",
            icon: "ui-icon-document",
            caption: "Crear factura",
            action: function() {
              unaBase.loadInto.dialog(
                "/v3/views/dtv/dialog/negocios_disponibles.shtml",
                "Seleccionar negocio(s) a facturar",
                "x-large"
              );
            }
          });

        if ($.inArray("create_dtv_parcial", params.buttons) != -1)
          buttons.push({
            name: "create_dtv_parcial",
            icon: "ui-icon-document",
            caption: "Factura parcial",
            action: function() {
              unaBase.toolbox.search.saveDialog();

              var countExchangeType = 0;
              var previousExchange = "";

              var negocios = [];

              $("#dialog-viewport #negocios-por-facturar table tbody td").each(
                function() {
                  var value = $(this)
                    .find('input[type="checkbox"]:checked')
                    .val();
                  if (typeof value != "undefined") {
                    negocios.push(value);
                    if (
                      $(this)
                        .closest("tr")
                        .data("exchangetype") != previousExchange
                    ) {
                      countExchangeType++;
                      previousExchange = $(this)
                        .closest("tr")
                        .data("exchangetype");
                    }
                  }
                }
              );

              // valida que no se haya seleccionado mas de una moneda
              if (countExchangeType < 2) {
                if (negocios.length > 0)
                  unaBase.loadInto.dialog(
                    "/v3/views/dtv/dialog/factura_parcial.shtml?negocios=" +
                      negocios.join("|"),
                    "Factura parcial",
                    "x-large"
                  );
                else
                  toastr.warning(
                    "Debe seleccionar al menos un negocio para facturar."
                  );
              } else {
                alert(
                  "No es posibe facturar por más de un tipo de moneda a la vez."
                );
              }
            }
          });

        if ($.inArray("add_nv_to_dtv", params.buttons) != -1)
          buttons.push({
            name: "add_nv_to_dtv",
            icon: "ui-icon-document",
            caption: "Agregar negocio a factura",
            action: function() {
              var negocios = [];
              $("#dialog-viewport #negocios-por-facturar table tbody td").each(
                function() {
                  var value = $(this)
                    .find('input[type="checkbox"]:checked')
                    .val();
                  if (typeof value != "undefined") negocios.push(value);
                }
              );

              if (negocios.length > 0)
                unaBase.loadInto.dialog(
                  "/v3/views/dtv/dialog/factura_parcial_express.shtml?negocios=" +
                    negocios.join("|"),
                  "Factura parcial",
                  "x-large"
                );
              else
                toastr.warning(
                  "Debe seleccionar al menos un negocio para facturar."
                );
            }
          });

        if ($.inArray("crear_dtc_asociado_oc", params.buttons) != -1)
          buttons.push({
            name: "crear_dtc_asociado_oc",
            icon: "ui-icon-document",
            caption: "Crear",
            action: function() {
              var element = this;
              var objFinal = {};
              var cant = 0;
              var comprasSelected = $(
                "#compras-por-justificar > table > tbody > tr > td > .select:checked"
              );
              var amount = comprasSelected.length;

              var diferentes = false;
              var proveedorAnterior = 0;
              var documentoAnterior = 0;
              let ocHasDtc = false;
              let ocWithDtc = [];
              comprasSelected.each(function(key, item) {
                eval(
                  "obj = { 'id_gasto_" +
                    $(this).val() +
                    "': '" +
                    $(this).val() +
                    "' }"
                );
                $.extend(objFinal, objFinal, obj);
                cant++;
                
                var tr = $(this).closest("tr");
                var idproveedor = tr.data("proveedor");
                var iddoc = tr.data("doc");
                var idOC = tr.data("id");
                var hasDtc = tr.data("hasdtc");
                if(hasDtc){
                  ocWithDtc.push(tr.data("number"));
                  ocHasDtc = true;
                  $(`tr.ocLine[data-id="${idOC}"] input[type="checkbox"]`).prop("checked", false)

                }
                if (cant == 1) {
                  proveedorAnterior = idproveedor;
                  documentoAnterior = iddoc;
                }
                if (
                  proveedorAnterior == idproveedor &&
                  documentoAnterior == iddoc
                ) {
                  proveedorAnterior = idproveedor;
                  documentoAnterior = iddoc;
                } else {
                  diferentes = true;
                }
              });
              const createDtc = (objFinal, id) => {   
                  $.ajax({
                    url: "/4DACTION/_V3_setDtc",
                    dataType: "json",
                    type: "POST",
                    async: false,
                    data: objFinal
                  }).done(function(data) {
                    $(element)
                      .parentTo(".ui-dialog-content")
                      .dialog("close");
                    unaBase.loadInto.viewport(
                      "/v3/views/dtc/content.shtml?id=" + id
                    );
                  });
              }
              if (amount > 0) {
                if (!diferentes && !ocHasDtc) {
                  // $.ajax({
                  //   url: "/4DACTION/_V3_setDtc",
                  //   dataType: "json",
                  //   type: "POST",
                  //   async: false,
                  //   data: objFinal
                  // }).done(function(data) {
                  //   $(element)
                  //     .parentTo(".ui-dialog-content")
                  //     .dialog("close");
                  //   unaBase.loadInto.viewport(
                  //     "/v3/views/dtc/content.shtml?id=" + data.id
                  //   );
                  // });
                  createDtc(objFinal, data.id);
                } else if(!ocHasDtc){
                  alert(
                    "Las órdenes de compras seleccionadas son de proveedor o documentos distintos."
                  );
                }else if(ocHasDtc && amount > 1){
                  alert(
                    `Las órdenes de compras ${ocWithDtc.join()} ya poseen facturas asociadas, deben justificarse por separado.`
                  );
                }else if(ocHasDtc && amount == 1){                  
                  createDtc(objFinal, data.id);
                }
              } else {
                alert("Debe seleccionar al menos una orden de compra.");
              }
            }
          });

        if ($.inArray("asociar_dct_a_gasto", params.buttons) != -1)
          buttons.push({
            name: "asociar_dct_a_gasto",
            icon: "ui-icon-circle-plus",
            caption: "Asociar dtc",
            action: function() {
              var element = this;
              var cant = 0;
              var dtcSelected = $(
                "#dtc-por-justificar > table > tbody > tr > td > .select:checked"
              );
              var amount = dtcSelected.length;

              var objFinal = {};

              var diferentes = false;
              var proveedorAnterior = 0;
              var documentoAnterior = 0;
              dtcSelected.each(function(key, item) {
                eval(
                  "obj = { 'id_dtc_" +
                    $(this).val() +
                    "': '" +
                    $(this).val() +
                    "' }"
                );
                $.extend(objFinal, objFinal, obj);
                cant++;

                var tr = $(this).closest("tr");
                var idproveedor = tr.data("proveedor");
                var iddoc = tr.data("doc");

                if (cant == 1) {
                  proveedorAnterior = idproveedor;
                  documentoAnterior = iddoc;
                }
                if (
                  proveedorAnterior == idproveedor &&
                  documentoAnterior == iddoc
                ) {
                  proveedorAnterior = idproveedor;
                  documentoAnterior = iddoc;
                } else {
                  diferentes = true;
                }
              });

              var idoc = $("#dtc-por-justificar").data("oc");
              var tipo = $("#dtc-por-justificar").data("tipo");
              eval("obj = { 'idoc': '" + idoc + "' }");
              $.extend(objFinal, objFinal, obj);

              if (amount > 0) {
                if (tipo == "FXR") {
                  diferentes = false;
                }

                if (!diferentes) {
                  $.ajax({
                    url: "/4DACTION/_V3_setAsociarDtc_a_gasto",
                    dataType: "json",
                    type: "POST",
                    async: false,
                    data: objFinal
                  }).done(function(data) {
                    if (data.success) {
                      toastr.success("Asociado con exito!");
                      $(element)
                        .parentTo(".ui-dialog-content")
                        .dialog("close");
                      unaBase.loadInto.viewport(
                        "/v3/views/compras/content.shtml?id=" + idoc,
                        undefined,
                        undefined,
                        true
                      );
                    } else {
                      if (data.readonly) {
                        toastr.error(
                          NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                        );
                      } else {
                        toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                      }
                    }
                  });
                } else {
                  alert(
                    "Los documentos seleccionados no coinciden con el gasto."
                  );
                }
              } else {
                alert("Debe seleccionar al menos un documento.");
              }
            }
          });

        if ($.inArray("asociar_oc_a_dtc", params.buttons) != -1)
          buttons.push({
            name: "asociar_oc_a_dtc",
            icon: "ui-icon-circle-plus",
            caption: "Asociar orden de compra",
            action: function() {
              var element = this;
              var cant = 0;
              var ocsSelected = $(
                "#ocs-por-justificar > table > tbody > tr > td > .select:checked"
              );
              var amount = ocsSelected.length;

              var objFinal = {};

              var diferentes = false;
              var proveedorAnterior = 0;
              var documentoAnterior = 0;
              ocsSelected.each(function(key, item) {
                eval(
                  "obj = { 'id_gasto_" +
                    $(this).val() +
                    "': '" +
                    $(this).val() +
                    "' }"
                );
                $.extend(objFinal, objFinal, obj);
                cant++;

                var tr = $(this).closest("tr");
                var idproveedor = tr.data("proveedor");
                var iddoc = tr.data("doc");

                if (cant == 1) {
                  proveedorAnterior = idproveedor;
                  documentoAnterior = iddoc;
                }
                if (
                  proveedorAnterior == idproveedor &&
                  documentoAnterior == iddoc
                ) {
                  proveedorAnterior = idproveedor;
                  documentoAnterior = iddoc;
                } else {
                  diferentes = true;
                }
              });

              var iddtc = $("#ocs-por-justificar").data("dtc");
              eval("obj = { 'iddtc': '" + iddtc + "' }");
              $.extend(objFinal, objFinal, obj);

              if (amount > 0) {
                if (!diferentes) {
                  $.ajax({
                    url: "/4DACTION/_V3_setAsociarOcs_a_dtc",
                    dataType: "json",
                    type: "POST",
                    async: false,
                    data: objFinal
                  }).done(function(data) {
                    if (data.success) {
                      toastr.success("Asociado con exito!");
                      $(element)
                        .parentTo(".ui-dialog-content")
                        .dialog("close");
                      unaBase.loadInto.viewport(
                        "/v3/views/dtc/content.shtml?id=" + iddtc,
                        undefined,
                        undefined,
                        true
                      );
                    } else {
                      if (data.readonly) {
                        toastr.error(
                          NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                        );
                      } else {
                        toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                      }
                    }
                  });
                } else {
                  alert(
                    "Las órdenes de compras seleccionadas no coinciden con el dtc."
                  );
                }
              } else {
                alert("Debe seleccionar al menos una orden de compra.");
              }
            }
          });

        if ($.inArray("asociar_dtv_a_factoring", params.buttons) != -1)
          buttons.push({
            name: "asociar_dtv_a_factoring",
            icon: "ui-icon-circle-plus",
            caption: "Asociar factura",
            action: function() {
              var element = this;
              var cant = 0;
              var dtvSelected = $(
                "#dtv-por-cobrar > table > tbody > tr > td > .select:checked"
              );
              var amount = dtvSelected.length;
              var objFinal = {};
              dtvSelected.each(function(key, item) {
                eval(
                  "obj = { 'id_dtv_" +
                    $(this).val() +
                    "': '" +
                    $(this).val() +
                    "' }"
                );
                $.extend(objFinal, objFinal, obj);
              });
              var idoc = $("#dtv-por-cobrar").data("oc");
              eval("obj = { 'idoc': '" + idoc + "' }");
              $.extend(objFinal, objFinal, obj);
              if (amount > 0) {
                $.ajax({
                  url: "/4DACTION/_V3_setAsociarDtv_a_factoring",
                  dataType: "json",
                  type: "POST",
                  async: false,
                  data: objFinal
                }).done(function(data) {
                  if (data.success) {
                    toastr.success("Asociado con exito!");
                    $(element)
                      .parentTo(".ui-dialog-content")
                      .dialog("close");
                    unaBase.loadInto.viewport(
                      "/v3/views/compras/content_factoring.shtml?id=" + idoc,
                      undefined,
                      undefined,
                      true
                    );
                  } else {
                    if (data.readonly) {
                      toastr.error(
                        NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                      );
                    } else {
                      toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                    }
                  }
                });
              } else {
                alert("Debe seleccionar al menos una factura.");
              }
            }
          });

        if ($.inArray("dtc_pay_selection", params.buttons) != -1){

          if(access[params.buttonAccess.dtc_pay_selection]){
            buttons.push({
              name: "dtc_pay_selection",
              icon: "ui-icon-document",
              caption: "Pagar selección",
              action: function() {
                var selected = $("table.listpayout tbody").find("input:checked");
                var selectedPagadas = $("table.listpayout tbody")
                  .find("input:checked")
                  .closest('tr[data-estado="PAGADO"]').length;
                var selectedRevisar = $("table.listpayout tbody")
                  .find("input:checked")
                  .closest('tr[data-estado="POR REVISAR"]').length;
                var selectedAnuladas = $("table.listpayout tbody")
                  .find("input:checked")
                  .closest('tr[data-estado="NULO"]').length;
                if (
                  selectedPagadas == 0 &&
                  selectedRevisar == 0 &&
                  selectedAnuladas == 0
                ) {
                  if (selected.length > 20) {
                    confirm(
                      "Ha seleccionado <strong>" +
                        selected.length +
                        "</strong> documentos. ¿Desea continuar?"
                    ).done(function(data) {
                      if (data) {
                        unaBase.loadInto.dialog(
                          "/v3/views/dtc/dialog/wizard_payout.shtml",
                          "DOCUMENTOS SELECCIONADOS PARA PAGO",
                          "large"
                        );
                      }
                    });
                  } else {
                    unaBase.loadInto.dialog(
                      "/v3/views/dtc/dialog/wizard_payout.shtml",
                      "DOCUMENTOS SELECCIONADOS PARA PAGO",
                      "large"
                    );
                  }
                } else {
                  alert(
                    "Hay documentos seleccionados que ya se encuentran PAGADOS, ANULADOS o POR REVISAR. <br/><br/>Por favor verificar y volver a intentar."
                  );
                }
              }
            });
            
          }

        }

        if ($.inArray("dtv_charge_selection", params.buttons) != -1)
          buttons.push({
            name: "dtv_charge_selection",
            icon: "ui-icon-document",
            caption: "Crear orden de ingreso",
            action: function() {
              var selected = $("table.listincome tbody").find("input:checked");

              // validación de selección
              var isNullified = false;
              var isNC = false;
              var isND = false;
              selected.each(function(key, item) {
                var row = $(item).closest("tr");
                isNullified |= row.data("estado") == "ANULADA";
                isNC |= row.data("tipo").includes("NOTA DE CREDITO");
                isND |= row.data("tipo").includes("NOTA DE DEBITO");
              });

              var errMsg =
                "No es posible crear orden de ingreso, se ha seleccionado:";
              if (isNullified) {
                errMsg += "<br>- Facturas anuladas.";
              }
              if (isNC) {
                errMsg += "<br>- Notas de crédito.";
              }
              if (isNC) {
                errMsg += "<br>- Notas de débito.";
              }

              if (isNullified || isNC || isND) {
                toastr.warning(errMsg);
                return false;
              }

              if (selected.length > 20) {
                confirm(
                  "Ha seleccionado <strong>" +
                    selected.length +
                    "</strong> documentos. ¿Desea continuar?"
                ).done(function(data) {
                  if (data) {
                    unaBase.loadInto.dialog(
                      "/v3/views/dtv/dialog/wizard_income.shtml",
                      "DOCUMENTOS SELECCIONADOS PARA COBRO",
                      "large"
                    );
                  }
                });
              } else {
                unaBase.loadInto.dialog(
                  "/v3/views/dtv/dialog/wizard_income.shtml",
                  "DOCUMENTOS SELECCIONADOS PARA COBRO",
                  "large"
                );
              }
            }
          });
        if ($.inArray("send_dtv_mail", params.buttons) != -1)
          buttons.push({
            name: "send_dtv_mail",
            icon: " ui-icon-mail-open",
            caption: "Enviar Dtv por Correo electrónico",
            action: function() {
              //aca van las acciones del boton
            }
          });
        if ($.inArray("send_dtv_charge", params.buttons) != -1)
          buttons.push({
            name: "send_dtv_charge",
            icon: "ui-icon-comment",
            caption: "Enviar cobranza",
            action: function() {
              //aca van las acciones del boton

              var ids = [];
              var ids_emitidas = [];
              $(
                "#viewport tbody.ui-selectable tr[data-id] td:first-of-type input.selected:checked"
              ).each(function() {
                if (
                  $(this)
                    .closest("tr")
                    .data("estado") &&
                  $(this)
                    .closest("tr")
                    .data("estado") == "POR EMITIR"
                ) {
                  ids_emitidas.push(
                    $(this)
                      .closest("tr")
                      .data("id")
                  );
                }
                ids.push(
                  $(this)
                    .closest("tr")
                    .data("id")
                );
              });
              $.ajax({
                url: "/4DACTION/_V3_send_dtv_charge",
                dataType: "json",
                type: "POST",
                async: false,
                data: {}
              }).done(function(data) {
                if (data.success) {
                  toastr.success("Enviado con exito!");
                } else {
                  if (data.readonly) {
                    toastr.error(NOTIFY.get("ERROR_RECORD_READONLY", "Error"));
                  } else {
                    toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                  }
                }
              });
            }
          });

        if ($.inArray("receive_next_step", params.buttons) != -1)
          buttons.push({
            name: "receive_next_step",
            icon: "ui-icon-circle-arrow-e",
            caption: "Previsualizar cobros",
            action: function() {
              income.next.ini();
            }
          });

        if ($.inArray("pay_balance", params.buttons) != -1)
          buttons.push({
            name: "pay_balance",
            icon: "ui-icon-circle-arrow-e",
            caption: "Pagar agrupado",
            action: function() {
              payout.next.ini("balance");
            }
          });

        if ($.inArray("pay_next_step", params.buttons) != -1)
          buttons.push({
            name: "pay_next_step",
            icon: "ui-icon-circle-arrow-e",
            caption: "Pagar por proveedor",
            action: function() {
              payout.next.ini("");
            }
          });

        if ($.inArray("receive_previous_step", params.buttons) != -1)
          buttons.push({
            name: "receive_previous_step",
            icon: "ui-icon-circle-arrow-w",
            caption: "Volver",
            action: function() {
              income.previous();
            }
          });

        if ($.inArray("restart_all_pass", params.buttons) != -1)
          buttons.push({
            name: "restart_all_pass",
            icon: "ui-icon-key",
            caption: "Reiniciar contraseña",
            action: function() {
              confirm(
                "Mediante esta acción se reiniciaran las contraseñas de todos los usuarios"
              ).done(function(data) {
                if (data) {
                  $.ajax({
                    url: "/4DACTION/_V3_reset_all_pass",
                    dataType: "json",
                    type: "POST",
                    data: {
                      all: true
                    }
                  }).done(function(data) {
                    if (data.success) {
                      toastr.success("Reinicio exitoso.");
                    } else {
                      toastr.error("Reinicio fallido.");
                    }
                  });
                } else {
                  toastr.info("Reinicio cancelado.");
                }
              });
            }
          });

        if ($.inArray("request_pass_change", params.buttons) != -1){
      
          buttons.push({
            name: "request_pass_change",
            icon: "ui-icon-key",
            caption: "Solicitar cambio de contraseña",
            action: function() {
              confirm(
                "Mediante esta acción se solicitara el cambio de contraseña a todos los usuarios"
              ).done(function(data) {
                if (data) {
                  $.ajax({
                    url: "/4DACTION/_V3_request_pass_change",
                    dataType: "json",
                    type: "POST"
                  }).done(function(data) {
                    if (data.success) {
                      toastr.success("Acción exitosa.");
                    } else {
                      toastr.error("Acción fallida.");
                    }
                  });
                } else {
                  toastr.info("Acción cancelada.");
                }
              });
            }
          });

        }
        if ($.inArray("usersCount", params.buttons) != -1){
          if(access[params.buttonAccess.usersCount]){
            buttons.push({
              name: "usersCount",
              icon: "ui-icon-info",
              caption: "#Activos",
              action: function() {
                axios(`/4DACTION/_V3_getUsuariosStats`).then(res => {
                  let html = `
                  <h3>Usuarios activos(no incluye soporte)</h3>
                  <br/>
                  <ul>
                    <li>Última semana: ${res.data.lastWeek}</li>
                    <li>Último mes: ${res.data.lastMonth}</li>
                    <li>Últimos 6 meses: ${res.data.lastSemester}</li>
                  </ul>`
                  alert(html);
                  console.log(res);
                }).catch(err => {
                  console.log(err);
                })
              }
            });

          }

        }

        if ($.inArray("pay_previous_step", params.buttons) != -1)
          buttons.push({
            name: "pay_previous_step",
            icon: "ui-icon-circle-arrow-w",
            caption: "Volver",
            action: function() {
              payout.previous();
            }
          });

        if ($.inArray("invoice_previous_step", params.buttons) != -1)
          buttons.push({
            name: "invoice_previous_step",
            icon: "ui-icon-circle-arrow-w",
            caption: "Volver",
            action: function() {
              unaBase.loadInto.dialog(
                "/v3/views/dtv/dialog/negocios_disponibles.shtml",
                "Seleccionar negocio(s) a facturar",
                "x-large"
              );
              setTimeout(function() {
                unaBase.toolbox.search.restoreDialog();
              }, 500);
            }
          });

        if ($.inArray("invoice_next_step", params.buttons) != -1)
          buttons.push({
            name: "invoice_next_step",
            icon: "ui-icon-circle-arrow-e",
            caption: "Previsualizar facturas",
            action: function() {
              if ($("#dtvporfacturar table tbody").find("tr").length > 1) {
                confirm(
                  "Seleccione la modalidad de facturación",
                  "Agrupada",
                  "Separada"
                ).done(function(data) {
                  payout.next(data);
                });
              } else {
                payout.next(false);
              }
            }
          });

        if ($.inArray("generate_installments", params.buttons) != -1)
          buttons.push({
            name: "generate_installments",
            icon: "ui-icon-circle-check",
            caption: "CREAR ORDEN DE INGRESO",
            action: function() {
              confirm(
                "¿Confirma que desea crear los ingresos?. Esto pagará las facturas asociadas."
              ).done(function(data) {
                if (data) {
                  income.installments.setCobros();
                }
              });
            }
          });

        if ($.inArray("generate_payments", params.buttons) != -1)
          buttons.push({
            name: "generate_payments",
            icon: "ui-icon-circle-check",
            caption: "CREAR PAGO",
            action: function() {
              payout.payments.setPagos();
            }
          });

        if ($.inArray("generate_invoices", params.buttons) != -1)
          buttons.push({
            name: "generate_invoices",
            icon: "ui-icon-circle-check",
            caption: "FACTURAR",
            action: function() {
              confirm("CONFIRMA QUE DESEA GENERAR LAS FACTURAS?").done(function(
                data
              ) {
                if (data) {
                  var facturas = payout.container
                    .find("table.step-2 > tbody")
                    .find("tr");

                  if (currency.decimals_sep == ".") {
                    // PE
                    var globalExchangeRate = $(
                      'input[name="exchange_rate_global"]'
                    ).val();
                  } else {
                    // CL
                    var globalExchangeRate = $(
                      'input[name="exchange_rate_global"]'
                    )
                      .val()
                      .replace(".", "")
                      .replace(",", ".");
                  }

                  var data = {};
                  facturas.each(function(key, item) {
                    data["cliente_" + (key + 1)] = $(item).data("id-cliente");
                    data["fecha_" + (key + 1)] = $(item).find('input[name="fecha"]').val();
                    data["recepcion_fecha_" + (key + 1)] = $(item).find('input[name="recepcion_fecha"]').val();
                    data["negocios_" + (key + 1)] = $(item).data("id-negocios");
                    data["montos_" + (key + 1)] = $(item).data("montos").toString().replace(".", ",");
                    data["exchange_type_" + (key + 1)] = $(item).data("exchangetype");
                    data["exchange_rate_" + (key + 1)] = globalExchangeRate;

                    /*var cliente = $(item).data("cliente");
                    var rut = $(item).data("rut-cliente");
                    rut = unaBase.data.rut.format(rut);
                    if (rut == "" || !unaBase.data.rut.validate(rut)) {
                      toastr.warning(
                        'El cliente "' +
                          cliente +
                          '" no tiene un RUT válido ingresado.'
                      );
                    }*/

                  });

                  $.ajax({
                    url: "/4DACTION/_V3_setgeneradtv_v1",
                    dataType: "json",
                    type: "POST",
                    data: data
                  }).done(function(data) {
                    if (data.success) {
                      $('.ui-dialog button[title="close"]').trigger("click");
                      toastr.success("Facturas generadas con éxito.");
                      if (data.dtv.length == 1)
                        (function(data) {
                          setTimeout(function() {
                            unaBase.loadInto.viewport(
                              "/v3/views/dtv/content.shtml?id=" + data.dtv[0]
                            );
                          }, 3000);
                        })(data);
                      else {
                        $('#search [name="q"]').trigger("keydown");
                        $('#search [name="q"]').trigger("keyup");
                      }
                    }
                  });
                } else toastr.info("Facturación cancelada.");
              });
            }
          });

        if ($.inArray("update_invoice", params.buttons) != -1)
          buttons.push({
            name: "update_invoice",
            icon: "ui-icon-circle-check",
            caption: "AGREGAR NEGOCIOS A FACTURA",
            action: function() {
              confirm(
                "CONFIRMA QUE DESEA AGREGAR LOS NEGOCIOS A LA FACTURA?"
              ).done(function(data) {
                if (data) {
                  var facturas = payout.container
                    .find("table.step-1 > tbody")
                    .find("tr");

                  var ajaxData = {
                    id: $("section.sheet").data("id")
                  };

                  facturas.each(function(key, item) {
                    ajaxData["cliente_" + (key + 1)] = $(item).data("idpro");
                    //ajaxData['fecha_' + (key + 1)] = $(item).find('input[name="fecha"]').val();
                    ajaxData["negocios_" + (key + 1)] = $(item).data("id");
                    ajaxData["montos_" + (key + 1)] = $(item).data("monto");

                    var cliente = $(item).data("cliente");
                    var rut = $(item).data("rut-cliente");
                    rut = unaBase.data.rut.format(rut);
                    if (rut == "" || !unaBase.data.rut.validate(rut)) {
                      toastr.warning(
                        'El cliente "' +
                          cliente +
                          '" no tiene un RUT válido ingresado.'
                      );
                    }
                  });

                  $.ajax({
                    url: "/4DACTION/_V3_setgeneradtv_v1",
                    dataType: "json",
                    type: "POST",
                    data: ajaxData
                  }).done(function(data) {
                    if (data.success) {
                      $('.ui-dialog button[title="close"]').trigger("click");
                      toastr.success("Negocios añadidos con éxito.");
                      (function(ajaxData) {
                        setTimeout(function() {
                          unaBase.loadInto.viewport(
                            "/v3/views/dtv/content.shtml?id=" + ajaxData.id
                          );
                        }, 3000);
                      })(ajaxData);
                    }
                  });
                } else toastr.info("Facturación cancelada.");
              });
            }
          });

        if ($.inArray("create_ot", params.buttons) != -1)
          buttons.push({
            name: "create_ot",
            icon: "ui-icon-document",
            caption: "Crear",
            action: function() {
              /*$.ajax({
								url: '/4DACTION/_V3_setDtc',
								dataType: 'json',
								type: 'POST',
								data: []
							}).done(function(data) {
								unaBase.loadInto.viewport('/v3/views/ots/v3/content.shtml?id=' + data.id);
							});*/
            }
          });

        if ($.inArray("close_admin_fxr", params.buttons) != -1)
          buttons.push({
            name: "close_admin_fxr",
            icon: "ui-icon-locked",
            caption: "Cerrar proceso rendición",
            action: function() {
              compras.closeAdmin("rendicion");
            }
          });

        if ($.inArray("open_admin_fxr", params.buttons) != -1)
          buttons.push({
            name: "open_admin_fxr",
            icon: "ui-icon-unlocked",
            caption: "Abrir proceso rendición",
            action: function() {
              compras.openAdmin("rendicion");
            }
          });
        if ($.inArray("close_admin_oc", params.buttons) != -1){

          if(access[params.buttonAccess.close_admin_oc]){
            buttons.push({
              name: "close_admin_oc",
              icon: "ui-icon-locked",
              caption: "Cerrar proceso compra admin",
              action: function() {
                compras.closeAdmin("oc");
              }
            });

          }
        }

        if ($.inArray("open_admin_oc", params.buttons) != -1){
          if(access[params.buttonAccess.open_admin_oc]){
            buttons.push({
              name: "open_admin_oc",
              icon: "ui-icon-unlocked",
              caption: "Abrir proceso compra admin",
              action: function() {
                compras.openAdmin("oc");
              }
            });

          }
        }

        /*if ($.inArray('create_oc2', params.buttons) != -1)
					buttons.push({
						name: 'create_oc2', icon: 'ui-icon-document', caption: 'Crear',
						action: function() {
							$.ajax({
								url: '/4DACTION/_V3_setCompras',
								dataType: 'json',
								type: 'POST',
								data: []
							}).done(function(data) {
								unaBase.loadInto.viewport('/v3/views/compras/content.shtml?id=' + data.id);
							});
						}
					});*/

        if ($.inArray("create_gasto_from_oc", params.buttons) != -1)
          buttons.push({
            name: "create_gasto_from_oc",
            icon: "ui-icon-document",
            caption: "Crear",
            action: function() {
              $.ajax({
                url: "/4DACTION/_V3_setCompras",
                dataType: "json",
                type: "POST",
                data: {
                  create_from: "OC"
                }
              }).done(function(data) {
                unaBase.loadInto.viewport(
                  "/v3/views/compras/content.shtml?id=" + data.id
                );
              });
            }
          });

        if ($.inArray("create_cot_from_proyecto", params.buttons) != -1)
          buttons.push({
            name: "create_cot_from_proyecto",
            icon: "ui-icon-document",
            caption: "Nueva cotización",
            action: function() {
              var referencia_proyecto = $(
                'input[name="cotizacion[titulo][text]"]'
              ).val();
              var id_proyecto = $("section.sheet").attr("data-id");
              var empresa = $('input[name="cotizacion[empresa][id]"]').attr(
                "data-id"
              );
              var contacto = $(
                'input[name="cotizacion[empresa][contacto][id]"]'
              ).attr("data-id");
              $.ajax({
                url: "/4DACTION/_V3_setCotizacion",
                dataType: "json",
                type: "POST",
                data: {
                  create_from: "proyecto",
                  referencia_proyecto: referencia_proyecto,
                  proyecto: id_proyecto,
                  empresa: empresa,
                  contacto: contacto
                }
              }).done(function(data) {
                unaBase.loadInto.viewport(
                  "/v3/views/cotizaciones/content.shtml?id=" + data.id
                );
              });
            }
          });

        if ($.inArray("create_ot_from_proyecto", params.buttons) != -1)
          buttons.push({
            name: "create_ot_from_proyecto",
            icon: "ui-icon-document",
            caption: "Nueva tarea",
            action: function() {
              var id_proyecto = $("section.sheet").attr("data-id");
              var referencia_proyecto = $(
                'input[name="cotizacion[titulo][text]"]'
              ).val();
              $.ajax({
                url: "/4DACTION/_V3_setOts",
                dataType: "json",
                type: "POST",
                data: {
                  moduloOt: "PROYECTO",
                  referencia_proyecto: "PROYECTO",
                  id_proyecto: id_proyecto
                }
              }).done(function(data) {
                // unaBase.loadInto.viewport('/ot.shtml?i=' + data.id);
                window.open(
                  "http://" + window.location.host + "/ot.shtml?i=" + data.id,
                  "_blank"
                );
              });
            }
          });

        if ($.inArray("create_gasto_from_fxr", params.buttons) != -1)
          buttons.push({
            name: "create_gasto_from_fxr",
            icon: "ui-icon-document",
            caption: "Crear",
            action: function() {
              $.ajax({
                url: "/4DACTION/_V3_setCompras",
                dataType: "json",
                type: "POST",
                data: {
                  create_from: "FXR"
                }
              }).done(function(data) {
                unaBase.loadInto.viewport(
                  "/v3/views/compras/content.shtml?id=" + data.id
                );
              });
            }
          });

        if ($.inArray("create_gasto_from_factoring", params.buttons) != -1)
          buttons.push({
            name: "create_gasto_from_factoring",
            icon: "ui-icon-document",
            caption: "Crear",
            action: function() {
              $.ajax({
                url: "/4DACTION/_V3_setCompras",
                dataType: "json",
                type: "POST",
                data: {
                  create_from: "FACTORING"
                }
              }).done(function(data) {
                unaBase.loadInto.viewport(
                  "/v3/views/compras/content_factoring.shtml?id=" + data.id
                );
              });
            }
          });

        if ($.inArray("new_payment", params.buttons) != -1)
          buttons.push({
            name: "new_payment",
            icon: "ui-icon-clipboard",
            caption: "Ingresar orden de pago",
            action: function() {
              /*var url = '/v3/views/pagos/dialog/pago2.shtml';
							unaBase.loadInto.dialog(url, 'Nueva orden de pago', 'large');*/
              // compras.tipoGasto = OC/FXR
              $.ajax({
                url: "/4DACTION/_V3_setPago",
                dataType: "json",
                type: "POST",
                data: {
                  origen: compras.tipoGasto,
                  id_origen: compras.id
                }
              }).done(function(data) {
                unaBase.loadInto.viewport(
                  "/v3/views/pagos/content2.shtml?id=" + data.id
                );
              });
            }
          });

        if ($.inArray("payment_request", params.buttons) != -1)
          buttons.push({
            name: "payment_request",
            icon: "ui-icon-transfer-e-w",
            caption: "Solicitar pago",
            action: function() {
              var url = "/v3/views/compras/payment_request.shtml";
              unaBase.loadInto.dialog(url, "SOLICITUD DE PAGO", "small");
            }
          });

        if ($.inArray("modification_request", params.buttons) != -1)
          buttons.push({
            name: "modification_request",
            icon: "ui-icon-transfer-e-w",
            caption: "Solicitar modificación",
            action: function() {
              var url = "/v3/views/negocios/modification_request.shtml";
              unaBase.loadInto.dialog(
                url,
                "SOLICITUD DE MODIFICACIÓN DE NEGOCIO",
                "small"
              );
            }
          });

        if ($.inArray("conversion_negocio_request", params.buttons) != -1)
          buttons.push({
            name: "conversion_negocio_request",
            icon: "ui-icon-transfer-e-w",
            caption: "Solicitar conversión a negocio",
            action: function() {
              var url = "/v3/views/cotizaciones/conversion_request.shtml";
              unaBase.loadInto.dialog(
                url,
                "SOLICITUD DE CONVERSIÓN DE COTIZACIÓN",
                "small"
              );
            }
          });

        if ($.inArray("sending_request", params.buttons) != -1)
          buttons.push({
            name: "sending_request",
            icon: "ui-icon-mail-closed",
            caption: "Enviar",
            action: function() {
              var target = $(this);
              var sendPaymentByEmail = function(address) {
                

                var id = $("#sheet-compras").data("id");
                var index = $("#sheet-compras").data("folio");
                var text = "";
                var sender = $("html > body.home > aside > div > div > h1")
                  .text()
                  .capitalizeAllWords();
                var comentario = $("#sheet-payment > textarea")
                  .val()
                  .replace(/\n/g, "<br/>");
                var sendMsg = function(document, index, text, sender) {
                  var retval;
                  $.ajax({
                    url: "/v3/views/compras/email_payment.shtml",
                    dataType: "html",
                    async: false,
                    success: function(data) {
                      retval = $("<div>").html(data);
                    }
                  });

                  retval.find("[data-document]").html(document);
                  retval.find("[data-index]").html(index);
                  retval.find("[data-text]").html(text);
                  retval.find("[data-comentario]").html(comentario);
                  retval.find("[data-sender-name]").html(sender);
                  return retval.html();
                };
                var index2 = "";
                var msg = sendMsg("Solicitud de pago", index2, text, sender);
                var attachments = [
                  {
                    cid: "logo.png",
                    url:
                      "http://" +
                      window.location.hostname +
                      ":" +
                      window.location.port +
                      "/v3/design/html/body.menu/nav/h1.png"
                  },
                  {
                    cid: "empresa.jpg",
                    url:
                      "http://" +
                      window.location.hostname +
                      ":" +
                      window.location.port +
                      "/4DACTION/logo_empresa_web"
                  }
                ];
                $.ajax({
                  url:
                    nodeUrl +
                    "/email/",
                  data: {
                    download: false,
                    entity: "Pagos",
                    id: params.data().id,
                    folio: params.data().folio,
                    document: "Pago de "+params.data().tipo,
                    text: text,
                    sid: sid,
                    email: address,
                    preview: false,
                    nullified: params.data().readonly,
                    sender: sender,
                    msg: msg,
                    attachments: JSON.stringify(attachments),
                    from: $("html > body.menu.home > aside > div > div > h1").data("email"),
                    username: $("html > body.menu.home > aside > div > div > h1").data(
                      "username"
                    )
                  },
                  type: "GET",
                  dataType: "jsonp",
                  success: function(data) {
                    toastr.success(
                      sprintf(NOTIFY.get("SUCCESS_EMAIL_SEND"), address)
                    );
                    $(target)
                      .parentTo(".ui-dialog-content")
                      .dialog("close");
                    compras.saveLogsFromWeb({
                      id: compras.id,
                      folio: index,
                      descripcion: "Ha realizado solicitud de pago",
                      modulo: "gastos",
                      descripcion_larga: comentario
                    });
                    compras.setSolicitaPago();
                  },
                  error: function(data) {
                    toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                  }
                });
              };

              var email = $("#sheet-compras").data("emailpagos");
              if (email == "") {
                email = "soporte@una.cl";
              }
              var comentario = $("#sheet-payment > textarea").val();
              if (comentario != "") {
                sendPaymentByEmail(email);
                /* unaBase.inbox.send({
									to: username,
									subject: comentario,
									into: 'viewport',
									href: '/v3/views/compras/content.shtml?id=' + $('section.sheet').data('id'),
									tag: 'solicitudes'
								}); */
              } else {
                toastr.warning(NOTIFY.get("WARNING_REQUIRED_DESCRIPTION"));
              }
            }
          });

        if ($.inArray("solicitud_permiso", params.buttons) != -1)
          buttons.push({
            name: "solicitud_permiso",
            icon: "ui-icon-mail-closed",
            caption: "Enviar",
            action: function() {
              var target = $(this);
              var sendPaymentByEmail = function(address) {
                

                //var index = $('#sheet-compras').data('folio');
                var text = "";
                var sender = $("html > body.home > aside > div > div > h1")
                  .text()
                  .capitalizeAllWords();
                var comment = $(".sheet-pop-access > article > textarea")
                  .val()
                  .replace(/\n/g, "<br>");

                var idAccess = $('article[data-box="solicitud"]').data(
                  "idaccess"
                );
                var nameAccess = $('article[data-box="solicitud"]').data(
                  "nameaccess"
                );
                var modulo = $(".sheet-pop-access").data("modulo");
                var username = $("html > body.menu.home > aside > div > div > h1").data(
                  "username"
                );

                if (comment != "") {
                  var sendMsg = function(document, index, text, sender) {
                    var retval;
                    $.ajax({
                      url: "/v3/views/accesos/email_solicitud_permiso.shtml",
                      dataType: "html",
                      async: false,
                      success: function(data) {
                        retval = $("<div>").html(data);
                      }
                    });

                    var url_ =
                      "http://" +
                      window.location.hostname +
                      ":" +
                      window.location.port +
                      "/v3/views/accesos/assign.shtml?id=" +
                      idAccess +
                      "&u=" +
                      username;
                    var link =
                      '<a href="' +
                      url_ +
                      '" target="_blank">Click aquí para asignar</a>';

                    retval.find("[data-document]").html(document);
                    retval.find("[data-text]").html(text);
                    retval.find("[data-comment] > span").html(comment);
                    retval.find("[data-default] > strong").html(nameAccess);
                    retval.find("[data-default] > span").html(modulo);
                    retval.find("[data-sender-name]").html(sender);
                    retval.find("[data-link]").html(link);
                    return retval.html();
                  };
                  var index2 = "";
                  var msg = sendMsg(
                    "Solicitud de acceso",
                    index2,
                    text,
                    sender
                  );
                  var attachments = [
                    {
                      cid: "logo.png",
                      url:
                        "http://" +
                        window.location.hostname +
                        ":" +
                        window.location.port +
                        "/v3/design/html/body.menu/nav/h1.png"
                    },
                    {
                      cid: "empresa.jpg",
                      url:
                        "http://" +
                        window.location.hostname +
                        ":" +
                        window.location.port +
                        "/4DACTION/logo_empresa_web"
                    }
                  ];
                  $.ajax({
                    url:
                      nodeUrl +
                      "/email/",
                    data: {
                      download: false,
                      entity: "Accesos",
                      id: 0,
                      folio: index2,
                      document: "Acceso",
                      text: text,
                      sid: sid,
                      email: address,
                      preview: false,
                      nullified: params.data().readonly,
                      sender: sender,
                      msg: msg,
                      attachments: JSON.stringify(attachments),
                      from: $("html > body.menu.home > aside > div > div > h1").data("email"),
                      username: $("html > body.menu.home > aside > div > div > h1").data(
                        "username"
                      )
                    },
                    type: "GET",
                    dataType: "jsonp",
                    success: function(data) {
                      toastr.success(
                        sprintf(NOTIFY.get("SUCCESS_EMAIL_SEND"), address)
                      );
                      $(target)
                        .parentTo(".ui-dialog-content")
                        .dialog("close");
                    },
                    error: function(data) {
                      toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                    }
                  });
                } else {
                  toastr.error(
                    "Es necesario ingresar un comentario para poder enviar la solicitud."
                  );
                  $(".sheet-pop-access > article > textarea").focus();
                }
              };

              var email = $(".sheet-pop-access").data("emails");
              if (email == "") {
                email = "soporte@una.cl";
              }
              var usernames = $(".sheet-pop-access")
                .data("admin-usernames")
                .split(":");

              sendPaymentByEmail(email);
              for (i in usernames) {
                var element = usernames[i];
                var idAccess = $('article[data-box="solicitud"]').data(
                  "idaccess"
                );
                var nameAccess = $('article[data-box="solicitud"]').data(
                  "nameaccess"
                );
                var modulo = $(".sheet-pop-access").data("modulo");
                var username = $("html > body.menu.home > aside > div > div > h1").data(
                  "username"
                );
                unaBase.inbox.send({
                  to: element,
                  subject: "Solicita acceso a " + modulo + " / " + nameAccess,
                  into: "dialog",
                  size: "x-small",
                  href:
                    "/v3/views/accesos/assign.shtml?id=" +
                    idAccess +
                    "&u=" +
                    username,
                  tag: "solicitudes"
                });
              }
              document
                .querySelector(".ui-dialog .ui-dialog-titlebar-close")
                .click();

              //var comentario = $('#sheet-payment > textarea').val();
              //if (comentario != '') {
              /*}else{
								toastr.warning(NOTIFY.get('WARNING_REQUIRED_DESCRIPTION'));
							}*/
            }
          });

        if ($.inArray("sending_modification_request", params.buttons) != -1)
          buttons.push({
            name: "sending_modification_request",
            icon: "ui-icon-mail-closed",
            caption: "Enviar",
            action: function() {
              var target = $(this);
              /*
							var sendPaymentByEmail = function(address) {

								var sid = '';
								$.each($.cookie(),function(clave,valor) { if (clave == hash && valor.match(/UNABASE/g)) sid = valor; });

								//var index = $('#sheet-compras').data('folio');
								var text = "";
								var sender = $('html > body.home > aside > div > div > h1').text().capitalizeAllWords();
								var comment = $('#sheet-payment > textarea').val().replace(/\n/g,'<br>');

								var idAccess = $('article[data-box="solicitud"]').data('idaccess');
								var nameAccess = $('article[data-box="solicitud"]').data('nameaccess');
								var modulo = $('.sheet-pop-access').data('modulo');
								var username = $('html > body.menu.home > aside > div > div > h1').data('username');

								if (comment!="") {
									var sendMsg = function(document, index, text, sender) {
										var retval;
										$.ajax({
											url: '/v3/views/accesos/email_solicitud_permiso.shtml',
											dataType: 'html',
											async: false,
											success: function(data) {
												retval = $('<div>').html(data);
											}
										});

										var url_ = 'http://' + window.location.hostname + ':' + window.location.port + '/v3/views/accesos/assign.shtml?id='+idAccess+'&u='+username;
										var link = '<a href="'+url_+'" target="_blank">Click aquí para asignar</a>';

										retval.find('[data-document]').html(document);
										retval.find('[data-text]').html(text);
										retval.find('[data-comment] > span').html(comment);
										retval.find('[data-default] > strong').html(nameAccess);
										retval.find('[data-default] > span').html(modulo);
										retval.find('[data-sender-name]').html(sender);
										retval.find('[data-link]').html(link);
										return retval.html();

									};
									var index2 = '';
									var msg = sendMsg('Solicitud de acceso',index2,text,sender);
									var attachments = [
										{
											cid: 'logo.png',
											url: 'http://' + window.location.hostname + ':' + window.location.port + '/v3/design/html/body.menu/nav/h1.png'
										},
										{
											cid: 'empresa.jpg',
											url: 'http://' + window.location.hostname + ':' + window.location.port + '/4DACTION/logo_empresa_web'
										}
									];
									$.ajax({
										url: 'http://' + nodejs_public_ipaddr + ':' + nodejs_port + '/email/',
										data: {
											download: false,
											entity: 'Accesos',
											id: 0,
											folio: index2,
											document: 'Acceso',
											text: text,
											sid: sid,
											email: address,
											preview: false,
											nullified: params.data().readonly,
											sender: sender,
											msg: msg,
											attachments: JSON.stringify(attachments),
											from: $('html > body.menu.home > aside > div > div > h1').data('email'),
											username: $('html > body.menu.home > aside > div > div > h1').data('username')
										},
										type: 'GET',
										dataType: 'jsonp',
										success: function(data) {
											toastr.success(sprintf(NOTIFY.get('SUCCESS_EMAIL_SEND'), address));
											$(target).parentTo('.ui-dialog-content').dialog('close');
										},
										error: function(data) {
											toastr.error(NOTIFY.get('ERROR_INTERNAL'));
										}
									});
								}else{
									toastr.error("Es necesario ingresar un comentario para poder enviar la solicitud.");
									$('.sheet-pop-access > article > textarea').focus();
								}

							};


							var email = '';
							if (email=="") {
								email = "soporte@una.cl";
							}

							*/

              $.ajax({
                url: "/4DACTION/_V3_setAutorizacionByNegocio",
                data: {
                  id_negocio: $("section.sheet").data("id"),
                  usuario: $("html > body.menu.home > aside > div > div > h1").data(
                    "username"
                  )
                },
                dataType: "json",
                success: function(data) {
                  if (data.success) {
                    var usernames = [];
                    $.ajax({
                      url: "/4DACTION/_V3_getUsuariosAutorizadoresNeg",
                      async: false,
                      dataType: "json",
                      success: function(subdata) {
                        $.each(subdata.rows, function(key, item) {
                          usernames.push(item.id);
                        });
                      }
                    });

                    for (i in usernames) {
                      var element = usernames[i];
                      var username = element;

                      unaBase.inbox.send({
                        to: element,
                        subject:
                          $("html > body.menu.home > aside > div > div > h1")
                            .text()
                            .capitalizeAllWords() +
                          " solicita autorización para modificar el negocio Nº " +
                          $("section.sheet").data("index"),
                        into: "dialog",
                        size: "x-small",
                        href:
                          "/v3/views/negocios/content.shtml?id=" +
                          $("section.sheet").data("id") +
                          "&autorizacion=" +
                          data.id,
                        tag: "solicitudes"
                      });

                      var comment = $("#sheet-payment > textarea")
                        .val()
                        .replace(/\n/g, "<br>");

                      unaBase.email.notify(
                        username,
                        "notify_autorizacion_negocio",
                        $("html > body.menu.home > aside > div > div > h1")
                          .text()
                          .capitalizeAllWords() +
                          " solicita autorización para modificar el negocio Nº " +
                          $("section.sheet").data("index"),
                        $("section.sheet").data("index"),
                        undefined,
                        undefined,
                        "negocios/content.shtml",
                        $("section.sheet").data("id") +
                          "&autorizacion=" +
                          data.id,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        function() {
                          var text = "<p>" + comment + "</p>";
                          var button =
                            '<a style="font-size:inherit!important;display:inline-block!important;padding:10px!important;background-color:rgb(67,175,124)!important;border:1px solid rgb(67,175,124)!important;border-radius:3px!important;margin:5px 10px 5px 0px!important;color:black;text-decoration:underline" href="http://desarrollo.unabase.cl:8180/v3/views/email/express_autoriza_mod_neg.shtml?id=' +
                            $("section.sheet").data("id") +
                            "&autorizacion=" +
                            data.id +
                            '">Autorizar</a>';
                          return text + button;
                        }
                      );

                      $(target)
                        .parentTo(".ui-dialog-content")
                        .dialog("close");
                      toastr.success("Solicitud de autorización enviada.");
                    }
                  }
                }
              });
            }
          });

        if ($.inArray("sending_conversion_request", params.buttons) != -1)
          buttons.push({
            name: "sending_conversion_request",
            icon: "ui-icon-mail-closed",
            caption: "Enviar",
            action: function() {
              var target = $(this);
              var usernames = [];
              $.ajax({
                url: "/4DACTION/_V3_getUsuariosConvertidoresNeg",
                data: {
                  id: $("section.sheet").data("id")
                },
                async: false,
                dataType: "json",
                success: function(subdata) {
                  $.each(subdata.rows, function(key, item) {
                    usernames.push(item.id);
                  });
                }
              });

              for (i in usernames) {
                var element = usernames[i];
                var username = element;

                unaBase.inbox.send({
                  to: element,
                  subject:
                    "solicita conversión a negocio de la cotización Nº " +
                    $("section.sheet").data("index"),
                  into: "dialog",
                  size: "x-small",
                  href:
                    "/v3/views/cotizaciones/content.shtml?id=" +
                    $("section.sheet").data("id"),
                  tag: "solicitudes"
                });

                var comment = $("#sheet-payment > textarea")
                  .val()
                  .replace(/\n/g, "<br>");

                // notify: function(to, template, document, index, title, extra, detail_uri, id_item, attach, userValidator, nameValidator, emailValidator, print_negocio, msgBody, isEjecutivoResponsable);
                unaBase.email.notify(
                  username,
                  "notify",
                  " solicita conversión a negocio de la cotización Nº " +
                    $("section.sheet").data("index"),
                  $("section.sheet").data("index"),
                  undefined,
                  undefined,
                  "cotizaciones/content.shtml",
                  $("section.sheet").data("id"),
                  undefined,
                  undefined,
                  undefined,
                  undefined,
                  undefined,
                  function() {
                    var text = "<p>" + comment + "</p>";
                    //var button = '<a style="font-size:inherit!important;display:inline-block!important;padding:10px!important;background-color:rgb(67,175,124)!important;border:1px solid rgb(67,175,124)!important;border-radius:3px!important;margin:5px 10px 5px 0px!important;color:black;text-decoration:underline" href="http://desarrollo.unabase.cl:8180/v3/views/email/express_autoriza_mod_neg.shtml?id=' + $('section.sheet').data('id') + '&autorizacion=' + data.id + '">Autorizar</a>';
                    return text; // + button;
                  }
                );
              }

              $(target)
                .parentTo(".ui-dialog-content")
                .dialog("close");
              toastr.success("Solicitud de conversión enviada.");
            }
          });

        /*
				if ($.inArray('approve_modification_request', params.buttons) != -1)
					buttons.push({
						name: 'approve_modification_request', icon: 'ui-icon-circle-check' , caption: 'Autorizar modificación',
						action: function() {
							$.ajax({
								url: '/4DACTION/_V3_setAutorizacionByNegocio',
								data: {
									id: $.urlParam('autorizacion', window.location.href),
									accion_autorizar: true
								},
								dataType: 'json',
								success: function(data) {
									if (data.success) {
										if (typeof data.detail != 'undefined') {
											if (data.detail.result) {
												toastr.success('El usuario ' + data.detail.data + ' fue autorizado con éxito.');
											} else {
												toastr.warning(data.detail.data);
											}

											// enviar email notificando al usuario que fue autorizado
										}
									}
								}
							});
						}
					});
				*/

        if ($.inArray("close_compras_negocio", params.buttons) != -1)
          buttons.push({
            name: "close_compras_negocio",
            icon: "ui-icon-locked",
            caption: "Cerrar proceso de compra",
            action: function(event) {
              //var id = $.unserialize(params.data()).id;
              var id = params.data().id;
              var closeCompras = function() {
                $.ajax({
                  url: "/4DACTION/_V3_set" + params.entity,
                  dataType: "json",
                  data: {
                    id: id,
                    "negocio[compras]": false
                  },
                  success: function(data) {
                    unblockCot();
                    if (data.success) {
                      if (typeof params.presupuesto != "undefined")
                        unaBase.loadInto.viewport(
                          "/v3/views/presupuestos/content.shtml?id=" +
                            id +
                            "#tabs-2",
                          undefined,
                          undefined,
                          true
                        );
                      else
                        unaBase.loadInto.viewport(
                          "/v3/views/negocios/content.shtml?id=" +
                            id +
                            "#tabs-2",
                          undefined,
                          undefined,
                          true
                        );
                      toastr.success(
                        NOTIFY.get("SUCCESS_NEGOCIO_CLOSE_COMPRAS")
                      );
                      //notify cierre de compras de negocio
                        
                        // unaBase.inbox.send({
                        //   subject: `ha cerrado las compras del negocio Nº${params.data().index} ${params.data().text}`,
                        //   into: "viewport",
                        //   href:
                        //     "/v3/views/negocios/content.shtml?id=" +
                        //     id,
                        //   tag: "avisos",
                        //   notifyId: 20,
                        //   id: params.data().id
                        // });

                          notifyNv.closeCompras({
                            number:params.data().index,
                            text: params.data().text,
                            id: params.data().id
                          });
                    } else {
                      if (data.opened) {
                        if (data.readonly)
                          toastr.error(
                            NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                          );
                      }
                    }
                  },
                  error: function(xhr, text, error) {
                    toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                  }
                });
              };
              if (typeof event.isTrigger == "undefined") {
                confirm(MSG.get("CONFIRM_NEGOCIO_CLOSE_COMPRAS")).done(function(
                  data
                ) {
                  if (data) closeCompras();
                });
              } else closeCompras();
            }
          });

        // Cierre ventas negocio
        if ($.inArray("close_ventas_negocio", params.buttons) != -1)
          buttons.push({
            name: "close_ventas_negocio",
            icon: "ui-icon-locked",
            caption: "Cerrar proceso de venta",
            action: function(event) {
              //var id = $.unserialize(params.data()).id;
              var id = params.data().id;
              var closeVentas = function() {
                $.ajax({
                  url: "/4DACTION/_V3_set" + params.entity,
                  dataType: "json",
                  data: {
                    id: id,
                    "negocio[ventas]": false
                  },
                  success: function(data) {
                    unblockCot();
                    if (data.success) {
                      if (typeof params.presupuesto != "undefined")
                        unaBase.loadInto.viewport(
                          "/v3/views/presupuestos/content.shtml?id=" +
                            id +
                            "#tabs-2",
                          undefined,
                          undefined,
                          true
                        );
                      else
                        unaBase.loadInto.viewport(
                          "/v3/views/negocios/content.shtml?id=" +
                            id +
                            "#tabs-2",
                          undefined,
                          undefined,
                          true
                        );
                      toastr.success(
                        NOTIFY.get("SUCCESS_NEGOCIO_CLOSE_VENTAS")
                      );
                    } else {
                      if (data.opened) {
                        if (data.readonly)
                          toastr.error(
                            NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                          );
                      }
                    }
                  },
                  error: function(xhr, text, error) {
                    toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                  }
                });
              };
              if (typeof event.isTrigger == "undefined") {
                confirm(MSG.get("CONFIRM_NEGOCIO_CLOSE_VENTAS")).done(function(
                  data
                ) {
                  if (data) closeVentas();
                });
              } else closeVentas();
            }
          });

        if ($.inArray("open_compras_negocio", params.buttons) != -1)
          buttons.push({
            name: "open_compras_negocio",
            icon: "ui-icon-unlocked",
            caption: "Reabrir proceso de compra",
            action: function() {
              //var id = $.unserialize(params.data()).id;
              var id = params.data().id;
              confirm(MSG.get("CONFIRM_NEGOCIO_OPEN_COMPRAS")).done(function(
                data
              ) {
                if (data) {
                  $.ajax({
                    url: "/4DACTION/_V3_set" + params.entity,
                    dataType: "json",
                    data: {
                      id: id,
                      "negocio[compras]": true
                    },
                    success: function(data) {
                      unblockCot();
                      if (data.success) {
                        if (typeof params.presupuesto != "undefined")
                          unaBase.loadInto.viewport(
                            "/v3/views/presupuestos/content.shtml?id=" +
                              id +
                              "#tabs-2",
                            undefined,
                            undefined,
                            true
                          );
                        else
                          unaBase.loadInto.viewport(
                            "/v3/views/negocios/content.shtml?id=" +
                              id +
                              "#tabs-2",
                            undefined,
                            undefined,
                            true
                          );

                        toastr.success(
                          NOTIFY.get("SUCCESS_NEGOCIO_OPEN_COMPRAS")
                        );

                      //notify apertura de compras de negocio
                        
                        // unaBase.inbox.send({
                        //   subject: `ha abierto las compras del negocio Nº${params.data().index} ${params.data().text}`,
                        //   into: "viewport",
                        //   href:
                        //     "/v3/views/negocios/content.shtml?id=" +
                        //     id,
                        //   tag: "avisos",
                        //   notifyId: 21,
                        //   id: params.data().id
                        // });

                          notifyNv.openCompras({
                            number:params.data().index,
                            text: params.data().text,
                            id: params.data().id
                          });
                      } else {
                        if (data.opened) {
                          if (data.readonly)
                            toastr.error(
                              NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                            );
                        }
                      }
                    },
                    error: function(xhr, text, error) {
                      toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                    }
                  });
                }
              });
            }
          });

        // Reabrir ventas negocio
        if ($.inArray("open_ventas_negocio", params.buttons) != -1)
          buttons.push({
            name: "open_ventas_negocio",
            icon: "ui-icon-unlocked",
            caption: "Reabrir proceso de venta",
            action: function() {
              //var id = $.unserialize(params.data()).id;
              var id = params.data().id;
              confirm(MSG.get("CONFIRM_NEGOCIO_OPEN_VENTAS")).done(function(
                data
              ) {
                if (data) {
                  $.ajax({
                    url: "/4DACTION/_V3_set" + params.entity,
                    dataType: "json",
                    data: {
                      id: id,
                      "negocio[ventas]": true
                    },
                    success: function(data) {
                      unblockCot();
                      if (data.success) {
                        if (typeof params.presupuesto != "undefined")
                          unaBase.loadInto.viewport(
                            "/v3/views/presupuestos/content.shtml?id=" +
                              id +
                              "#tabs-2",
                            undefined,
                            undefined,
                            true
                          );
                        else
                          unaBase.loadInto.viewport(
                            "/v3/views/negocios/content.shtml?id=" +
                              id +
                              "#tabs-2",
                            undefined,
                            undefined,
                            true
                          );

                        toastr.success(
                          NOTIFY.get("SUCCESS_NEGOCIO_OPEN_VENTAS")
                        );
                      } else {
                        if (data.opened) {
                          if (data.readonly)
                            toastr.error(
                              NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                            );
                        }
                      }
                    },
                    error: function(xhr, text, error) {
                      toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                    }
                  });
                }
              });
            }
          });

        if ($.inArray("close_negocio", params.buttons) != -1)
          buttons.push({
            name: "close_negocio",
            icon: "ui-icon-locked",
            caption: "Cerrar negocio",
            action: function() {
              //var id = $.unserialize(params.data()).id;
              //var id = params.data().id;
              var id = $("#main-container").data("id");
              confirm(MSG.get("CONFIRM_NEGOCIO_CLOSE")).done(function(data) {
                if (data) {
                  unblockCot();

                  setTimeout(function() {
                    $.ajax({
                      url: "/4DACTION/_V3_setCierreByNegocio",
                      dataType: "json",
                      data: {
                        id: id,
                        close: true
                      },
                      success: function(data) {
                        if (data.success) {
                          if (data.detail.result) {
                            unaBase.loadInto.viewport(
                              "/v3/views/negocios/content.shtml?id=" + id,
                              undefined,
                              undefined,
                              true
                            );
                            toastr.success(NOTIFY.get("SUCCESS_NEGOCIO_CLOSE"));
                          } else
                            toastr.warning(
                              sprintf(
                                NOTIFY.get("WARNING_NEGOCIO_CLOSE"),
                                data.detail.data
                              )
                            );

                        //notify cierre  de negocio
                          
                          // unaBase.inbox.send({
                          //   subject: `ha cerrado el negocio Nº${params.data().index} ${params.data().text}`,
                          //   into: "viewport",
                          //   href:
                          //     "/v3/views/negocios/content.shtml?id=" +
                          //     id,
                          //   tag: "avisos",
                          //   notifyId: 22,
                          //   id: params.data().id
                          // });
                          notifyNv.close({
                            number:params.data().index,
                            text: params.data().text,
                            id: params.data().id
                          });


                        } else {
                          if (data.opened) {
                            if (data.readonly)
                              toastr.error(
                                NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                              );
                          }
                        }
                      },
                      error: function(xhr, text, error) {
                        toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                      }
                    });
                  }, 1000);
                }
              });
            }
          });

        if ($.inArray("open_negocio", params.buttons) != -1)
          buttons.push({
            name: "open_negocio",
            icon: "ui-icon-unlocked",
            caption: "Abrir negocio",
            action: function() {
              //var id = $.unserialize(params.data()).id;
              //var id = params.data().id;
              // var id = $('section.sheet').data('id');
              var id = $("#main-container").data("id");
              confirm(MSG.get("CONFIRM_NEGOCIO_OPEN")).done(function(data) {
                if (data) {
                  unblockCot();
                  setTimeout(function() {
                    $.ajax({
                      url: "/4DACTION/_V3_setCierreByNegocio",
                      dataType: "json",
                      data: {
                        id: id,
                        close: false
                      },
                      success: function(data) {
                        // unblockCot();
                        if (data.success) {
                          unaBase.loadInto.viewport(
                            "/v3/views/negocios/content.shtml?id=" + id,
                            undefined,
                            undefined,
                            true
                          );
                          toastr.success(NOTIFY.get("SUCCESS_NEGOCIO_OPEN"));
                            //notify cierre  de negocio
                          
                          // unaBase.inbox.send({
                          //   subject: `ha abierto el negocio Nº${params.data().index} ${params.data().text}`,
                          //   into: "viewport",
                          //   href:
                          //     "/v3/views/negocios/content.shtml?id=" +
                          //     id,
                          //   tag: "avisos",
                          //   notifyId: 23,
                          //   id: params.data().id
                          // });

                          notifyNv.open({
                            number:params.data().index,
                            text: params.data().text,
                            id: params.data().id
                          });
                        } else {
                          if (data.opened) {
                            if (data.readonly)
                              toastr.error(
                                NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                              );
                          }
                        }
                      },
                      error: function(xhr, text, error) {
                        toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                      }
                    });
                  }, 1000);
                }
              });
            }
          });

        /*if ($.inArray('clone', params.buttons) != -1)
					buttons.push({
						name: 'clone', icon: 'ui-icon-document', caption: 'Crear desde otro',
						action: function() {
							var id = null;
							var selected = $('section#viewport > table > tbody > tr.ui-selected');
							if (selected.length == 0)
								id = $('section#viewport > section.sheet').data('id');
							else {
								if (selected.length == 1)
									id = selected.eq(0).data('id');
								else
									toastr.warning('Hay más de un ítem seleccionado. Debe seleccionar solamente uno');
							}
							if (id)
								$.ajax({
									url: '/4DACTION/_V3_clone' + params.entity,
									data: {
										id: id
									},
									dataType: 'json',
									type: 'POST'
								}).done(function(data) {
									unaBase.loadInto.viewport('/v3/views/cotizaciones/content.shtml?id=' + data.id);
								});
						}
					});
				*/

        if ($.inArray("clone_current", params.buttons) != -1)
          buttons.push({
            name: "clone_current",
            icon: "ui-icon-copy",
            caption: "Duplicar",
            action: function() {
              var id = null;
              if ($("section#viewport div#main-container").length == 1) {
                id = $("section#viewport div#main-container").data("id");
              }

              if ($("section#content-cot-neg-fixed").length == 1) {
                id = $("section#content-cot-neg-fixed").data("id");
              }

              var cotizacionId = $("section.sheet").data("id");
              var module = $(".sidebar li.active").data("name");
              // var socketNew = io.connect(nodeUrl);
              var cotBlock = {
                id: cotizacionId,
                folio: $("#main-container .sheet").data("index"),
                user: $("html > body.menu.home > aside > div > div > h1").data("username"),
                // doc_name: $('.titulofinal').val(),
                // total: $('span[name="cotizacion[montos][subtotal_neto]"]').text(),
                block: false,
                module: "cotizaciones",
                from: "boton volver---"
              };

              $.ajax({
                url: "/4DACTION/_V3_block_by_use",
                data: {
                  id: cotizacionId,
                  module: module,
                  block: false,
                  list: false
                },
                dataType: "json",
                async: false,
                success: function(datas) {
                  // data.rows.push(cotBlock);
                  // if(!uVar.unableSocket){
                  // 	socketNew.emit('sendblock', datas.rows);
                  // 	socketNew.emit('sendblockAdd', cotBlock);
                  // }
                },
                error: function(xhr, text, error) {
                  toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                }
              });

              window.onbeforeunload = function() {
                return "¿Está seguro que desea salir?";
              };

              if (id) {
                $.ajax({
                  url: "/4DACTION/_V3_cloneCotizacion",
                  data: {
                    id: id
                  },
                  dataType: "json",
                  type: "POST"
                }).done(function(data) {
                  if (typeof params.presupuesto != "undefined")
                    unaBase.loadInto.viewport(
                      "/v3/views/presupuestos/content.shtml?id=" + data.id,
                      undefined,
                      undefined,
                      true
                    );
                  else
                    unaBase.loadInto.viewport(
                      "/v3/views/cotizaciones/content.shtml?id=" + data.id,
                      undefined,
                      undefined,
                      true
                    );

                  if (params.entity == "Cotizacion")
                    unaBase.log.save(
                      "Ha duplicado " + etiqueta_cotizacion,
                      "cotizaciones",
                      $("section.sheet").data("index")
                    );
                  else
                    unaBase.log.save(
                      "Ha duplicado " + etiqueta_negocio,
                      "negocios",
                      $("#main-container").data("index")
                    );
                });
              }
            }
          });

        if ($.inArray("print", params.buttons) != -1)
          buttons.push({
            name: "print",
            icon: "ui-icon-print",
            caption: "Imprimir listado",
            action: function() {
              alert("se manda a imprimir listado");
              /*
							$.ajax({
								url: '/4DACTION/_V3_set' + params.entity,
								dataType: 'json',
								type: 'POST'
							}).done(function(data) {
								alert('se imprimió con éxito');
							});
							*/
            }
          });

        if ($.inArray("share_dtc", params.buttons) != -1)
          buttons.push({
            name: "share_dtc",
            icons: {
              primary: "ui-icon-extlink",
              secondary: "ui-icon-triangle-1-s"
            },
            caption: "Compartir",
            action: function() {
              //
            }
          });

        if ($.inArray("duplicate_gastos", params.buttons) != -1)
          buttons.push({
            name: "duplicate_gastos",
            icons: {
              primary: "ui-icon-copy"            
            },
            caption: "Duplicar",
            action: function() {
              compras.duplicate();
            }
          });

        if ($.inArray("delete_dtc", params.buttons) != -1)
          buttons.push({
            name: "delete_dtc",
            icon: "ui-icon-trash",
            caption: "Eliminar",
            action: function() {
              $.ajax({
                url: "/4DACTION/_V3_checkPagosDtc",
                data: {
                  id: dtc.id
                },
                dataType: "json",
                success: function(data) {
                  if (data.success) {
                    confirm(MSG.get("CONFIRM_DOCUMENT_DELETE")).done(function(
                      data
                    ) {
                      if (data) {
                        var container = $("#sheet-dtc");
                        $.ajax({
                          url: "/4DACTION/_V3_setDtc",
                          data: {
                            "dtc[id]": dtc.id,
                            delete: true
                          },
                          dataType: "json",
                          success: function(data) {
                            if (typeof event != "undefined")
                              unaBase.history.back();
                          },
                          error: function(xhr, text, error) {
                            toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                          }
                        });
                      }
                    });
                  } else {
                    toastr.warning(
                      "No es posible eliminar el documento. Existen pagos asociados."
                    );
                  }
                },
                error: function(xhr, text, error) {
                  toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                }
              });
            }
          });

        if ($.inArray("delete_dtcnc", params.buttons) != -1)
          buttons.push({
            name: "delete_dtcnc",
            icon: "ui-icon-trash",
            caption: "Eliminar",
            action: function() {
              confirm(MSG.get("CONFIRM_DOCUMENT_DELETE")).done(function(data) {
                if (data) {
                  var container = $("#sheet-dtc");
                  $.ajax({
                    url: "/4DACTION/_V3_setDtcnc",
                    data: {
                      id: dtc.id,
                      delete: true
                    },
                    dataType: "json",
                    success: function(data) {
                      if (typeof event != "undefined") unaBase.history.back();
                    },
                    error: function(xhr, text, error) {
                      toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                    }
                  });
                }
              });
            }
          });

        if ($.inArray("convert_cotizacion", params.buttons) != -1)
          buttons.push({
            name: "convert_cotizacion",
            icon: "ui-icon-refresh",
            caption: "Convertir en cotización",
            action: function() {
              var id = $("#main-container").data("id");
              var folio = $("#main-container").data("index");
              if (access._485) {
                // Permiso para convertir neg. a cot.
                //var id = $.unserialize(params.data()).id;
                confirm(MSG.get("CONFIRM_NEGOCIO_CONVERT")).done(function(
                  data
                ) {
                  if (data) {
                    $.ajax({
                      //url: '/4DACTION/_V3_set' + params.entity,
                      url: "/4DACTION/_V3_set" + params.entity,
                      dataType: "json",
                      data: {
                        id: id,
                        "cotizacion[negocio]": false
                      },
                      success: function(data) {
                        if (data.success) {
                          $("#version").html(data.index);
                          toastr.success(NOTIFY.get("SUCCESS_NEGOCIO_CONVERT"));

                          // Notificación "Ha convertido a cotización el negocio" / "Ha convertido a cotización el negocio facturado"
                          var sid = "";
                          $.each($.cookie(), function(clave, valor) {
                            if (clave == hash && valor.match(/UNABASE/g))
                              sid = valor;
                          });

                          var textFacturado = "";
                          if (negocioFacturado) {
                            textFacturado = " facturado";
                          }
                          var cotizacionId = $("section.sheet").data("id");
                          var module = $(".sidebar li.active").data("name");
                          // var socketNew = io.connect(nodeUrl);
                          var cotBlock = {
                            id: cotizacionId,
                            folio: $("#main-container .sheet").data("index"),
                            user: $("html > body.menu.home > aside > div > div > h1").data(
                              "username"
                            ),
                            // doc_name: $('.titulofinal').val(),
                            // total: $('span[name="cotizacion[montos][subtotal_neto]"]').text(),
                            block: false,
                            module: module,
                            from: "boton volver---"
                          };

                          $.ajax({
                            url: "/4DACTION/_V3_block_by_use",
                            data: {
                              id: cotizacionId,
                              module: module,
                              block: false,
                              list: false
                            },
                            dataType: "json",
                            async: false,
                            success: function(datas) {
                              // data.rows.push(cotBlock);
                              // if(!uVar.unableSocket){
                              // 	socketNew.emit('sendblock', datas.rows);
                              // 	socketNew.emit('sendblockAdd', cotBlock);
                              // }
                            },
                            error: function(xhr, text, error) {
                              toastr.error(
                                NOTIFY.get("ERROR_INTERNAL", "Error")
                              );
                            }
                          });

                          window.onbeforeunload = function() {
                            return "¿Está seguro que desea salir?";
                          };
                          unaBase.inbox.send(
                            {
                              subject:
                                "Ha convertido a cotización el negocio" +
                                textFacturado +
                                " Nº " +
                                data.index +
                                " / " +
                                $("section.sheet")
                                  .find(
                                    'input[name="cotizacion[titulo][text]"]'
                                  )
                                  .val(),
                              into: "viewport",
                              href:
                                "/v3/views/cotizaciones/content.shtml?id=" +
                                data.id,
                              tag: "avisos",
                              attach: true // boolean
                            },
                            function() {
                              unaBase.loadInto.viewport(
                                "/v3/views/cotizaciones/content.shtml?id=" +
                                  data.id,
                                undefined,
                                undefined,
                                true
                              );
                            }
                          );
                        } else {
                          if (data.opened) {
                            if (data.readonly)
                              toastr.error(
                                NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                              );
                          }
                        }
                      },
                      error: function(xhr, text, error) {
                        toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                      }
                    });

                    // Verifica si existe una solicitud de convertir a negocio y que usuario convirtiendo tenga permiso de autorizar.
                    // En el caso que sí. Se envía un correo notificando su aprobación.
                    if (access._495) {
                      var arrayMsg = verifyActiveRequest({
                        id: id,
                        subject: "Solicita Modificar Negocio"
                      });
                      if (arrayMsg.length > 0) {
                        $.each(arrayMsg, function(i, item) {
                          //EMAIL
                          // unaBase.email.notify
                          //notify: function(to, template, document, index, title, extra, detail_uri, id_item, attach) {
                          var url = "cotizaciones/content.shtml";
                          unaBase.email.notify(
                            item.from.username,
                            "notify",
                            "Ha Autorizado Modificar Negocio Nº " + folio,
                            undefined,
                            undefined,
                            undefined,
                            url,
                            id
                          );

                          //INBOX
                          unaBase.inbox.send({
                            to: item.from.username,
                            subject:
                              "Ha Autorizado Modificar Negocio Nº " + folio,
                            into: "viewport",
                            href:
                              "/v3/views/cotizaciones/content.shtml?id=" + id,
                            tag: "avisos"
                          });
                        });
                      }
                    }
                  }
                });
              } else {
                var url =
                  "/v3/views/negocios/sol_convert_cotizacion.shtml?id=" + id;
                unaBase.loadInto.dialog(
                  url,
                  "AUTORIZACIÓN MODIFICACIÓN DEL NEGOCIO",
                  "small"
                );
              }
            }
          });

        if ($.inArray("convert_negocio", params.buttons) != -1)
          buttons.push({
            name: "convert_negocio",
            icon: "ui-icon-refresh",
            caption: "Convertir en negocio",
            action: function() {
              var saved = menu
                .find('[data-name="save"] button')
                .triggerHandler("click");
              if (!saved.success) event.stopImmediatePropagation();

              // Valida que los datos adicionales estén presentes antes de convertir a negocio
              var is_invalid = false;
              $("section.sheet article.general-data")
                .find("li")
                .each(function() {
                  var input = $(this).find("input");

                  if (input.prop("required") && input.val().length == 0) {
                    is_invalid = true;
                    input.addClass("invalid");
                  } else input.removeClass("invalid");
                });

              if (is_invalid)
                toastr.error(
                  "No es posible convertir a negocio. Falta completar datos adicionales."
                );
              else
                confirm(MSG.get("CONFIRM_COTIZACION_CONVERT")).done(function(
                  data
                ) {
                  if (data) {
                    $.ajax({
                      url: "/4DACTION/_V3_setVersionByCotizacion",
                      data: {
                        id: $("section.sheet").data("id")
                      },
                      dataType: "json",
                      success: function(data) {
                        if (data.success) {
                          toastr.info(NOTIFY.get("INFO_COTIZACION_VERSION"));
                          $("#version").html(data.index);

                          var ajaxData = params.data();

                          $.extend(ajaxData, ajaxData, {
                            id: params.data().id,
                            "cotizacion[negocio]": true
                          });

                          $.ajax({
                            url: "/4DACTION/_V3_set" + params.entity,
                            dataType: "json",
                            data: ajaxData,
                            success: function(data) {
                              if (data.success) {
                                //toastr.info('Cotización convertida a negocio!');
                                toastr.success(
                                  NOTIFY.get("SUCCESS_COTIZACION_CONVERT")
                                );

                                var sid = "";
                                $.each($.cookie(), function(clave, valor) {
                                  if (clave == hash && valor.match(/UNABASE/g))
                                    sid = valor;
                                });
                                var cotizacionId = $("section.sheet").data(
                                  "id"
                                );
                                var module = $(".sidebar li.active").data(
                                  "name"
                                );
                                // var socketNew = io.connect(nodeUrl);
                                var cotBlock = {
                                  id: cotizacionId,
                                  folio: $("#main-container .sheet").data(
                                    "index"
                                  ),
                                  user: $(
                                    "html > body.menu.home > aside > div > div > h1"
                                  ).data("username"),
                                  // doc_name: $('.titulofinal').val(),
                                  // total: $('span[name="cotizacion[montos][subtotal_neto]"]').text(),
                                  block: false,
                                  module: module,
                                  from: "boton volver---"
                                };

                                $.ajax({
                                  url: "/4DACTION/_V3_block_by_use",
                                  data: {
                                    id: cotizacionId,
                                    module: module,
                                    block: false,
                                    list: false
                                  },
                                  dataType: "json",
                                  async: false,
                                  success: function(datas) {
                                    // data.rows.push(cotBlock);
                                    // if(!uVar.unableSocket){
                                    // 	socketNew.emit('sendblock', datas.rows);
                                    // 	socketNew.emit('sendblockAdd', cotBlock);
                                    // }
                                  },
                                  error: function(xhr, text, error) {
                                    toastr.error(
                                      NOTIFY.get("ERROR_INTERNAL", "Error")
                                    );
                                  }
                                });

                                window.onbeforeunload = function() {
                                  return "¿Está seguro que desea salir?";
                                };

                                unaBase.inbox.send(
                                  {
                                    subject:
                                      "Ha convertido a negocio la cotización Nº " +
                                      data.index +
                                      " / " +
                                      $("section.sheet")
                                        .find(
                                          'input[name="cotizacion[titulo][text]"]'
                                        )
                                        .val(),
                                    into: "viewport",
                                    href:
                                      "/v3/views/negocios/content.shtml?id=" +
                                      data.id,
                                    tag: "avisos",
                                    attach: mostrar_compartir_carta_cliente
                                      ? [
                                          {
                                            cid:
                                              "Negocio_" + data.index + ".pdf",
                                            url:
                                              nodeUrl +
                                              "/print/?entity=negocios&id=" +
                                              data.id +
                                              "&folio=" +
                                              data.index +
                                              "&sid=" +
                                              unaBase.sid.encoded() +
                                              "&horizontal=true&port=" +
                                              window.location.port +
                                              "&hostname=" +
                                              window.location.origin
                                          },
                                          {
                                            cid:
                                              "CartaCliente_" +
                                              data.index +
                                              ".pdf",
                                            //var url = 'http://' + nodejs_public_ipaddr + ':' + nodejs_port + '/download/?download=true&entity=carta_cliente&id=' + params.data().id + '&folio=' + ((typeof $('section.sheet').data('index') != 'undefined')? $('section.sheet').data('index') : 'S/N')+ '&sid=' + unaBase.sid.encoded() + '&preview=false&nullified=' + params.data().readonly + '&aliasfiles=' + file_name_oficial_cot;
                                            url:
                                              nodeUrl +
                                              "/download/?download=true&entity=carta_cliente&id=" +
                                              data.id +
                                              "&folio=" +
                                              data.index +
                                              "&sid=" +
                                              unaBase.sid.encoded() +
                                              "&preview=false&nullified=false&aliasfiles=CartaCliente_." +
                                              data.index +
                                              "pdf&port=" +
                                              window.location.port +
                                              "&hostname=" +
                                              window.location.origin
                                          }
                                        ]
                                      : [
                                          {
                                            cid:
                                              "Negocio_" + data.index + ".pdf",
                                            url:
                                              nodeUrl +
                                              "/print/?entity=negocios&id=" +
                                              data.id +
                                              "&folio=" +
                                              data.index +
                                              "&sid=" +
                                              unaBase.sid.encoded() +
                                              "&horizontal=true&port=" +
                                              window.location.port +
                                              "&hostname=" +
                                              window.location.origin
                                          }
                                        ]
                                  },
                                  function() {
                                    unaBase.loadInto.viewport(
                                      "/v3/views/negocios/content.shtml?id=" +
                                        params.data().id,
                                      undefined,
                                      undefined,
                                      true
                                    );
                                  }
                                );
                              } else {
                                if (data.opened) {
                                  if (data.readonly)
                                    toastr.error(
                                      NOTIFY.get(
                                        "ERROR_RECORD_READONLY",
                                        "Error"
                                      )
                                    );
                                }
                              }
                            },
                            error: function(xhr, text, error) {
                              toastr.error(
                                NOTIFY.get("ERROR_INTERNAL"),
                                "Error"
                              );
                            }
                          });
                        }
                      }
                    });
                  }
                });
            }
          });

        if ($.inArray("request_convert_negocio", params.buttons) != -1)
          buttons.push({
            name: "request_convert_negocio",
            icon: "ui-icon-mail-closed",
            caption: "Solicitud para convertir a negocio",
            action: function() {
              confirm(MSG.get("CONFIRM_REQUEST_CONVERT_TO_NEGOCIO")).done(
                function(data) {
                  if (data) {
                    unaBase.inbox.send({
                      subject: "Ha solicitado convertir a negocio",
                      into: "viewport",
                      href:
                        "/v3/views/cotizaciones/content.shtml?id=" +
                        $("section.sheet").data("id"),
                      tag: "solicitudes"
                    });
                  }
                }
              );
            }
          });

        if ($.inArray("discard", params.buttons) != -1)
          buttons.push({
            name: "discard",
            icon: "ui-icon-cancel",
            caption: "Anular",
            action: function() {
              var anular = true;
              var element = $(this);
              if (params.entity == "Compras") {
                if (!_validationDocAsociadosOC()) {
                  if ($("#sheet-compras").data("factoring")) {
                    // toastr.warning(NOTIFY.get('WARNING_FACTORING_NULLIFY'));
                    alert(NOTIFY.get("WARNING_FACTORING_NULLIFY"));
                  } else {
                    // toastr.warning(NOTIFY.get('WARNING_GASTO_NULLIFY'));
                    alert(NOTIFY.get("WARNING_GASTO_NULLIFY"));
                  }
                  anular = false;
                }
              }
              if (params.entity == "Dtc") {
                $.ajax({
                  url: "/4DACTION/_V3_checkPagosDtc",
                  data: {
                    id: dtc.id
                  },
                  dataType: "json",
                  async: false,
                  success: function(data) {
                    if (!data.success) {
                      toastr.warning(
                        "No es posible anular el documento. Existen pagos asociados."
                      );
                      anular = false;
                    }
                  },
                  error: function(xhr, text, error) {
                    toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                  }
                });
              }
              if (params.entity == "Pago") {
                // Verificar antes de anular
                if (
                  $(
                    '.ui-dialog table > tbody > tr:not([data-new="true"]):first-of-type > td:nth-of-type(6)'
                  )
                    .text()
                    .toUpperCase() != "NULO" &&
                  $(".ui-dialog table > tbody > tr").length > 0
                ) {
                  toastr.warning(
                    "No es posible anular la orden de pago. Hay documentos de pago vigentes."
                  );
                  anular = false;
                }
              }
              if (params.entity == "Ingreso") {
                // Verificar antes de anular
                if (
                  $(
                    '.ui-dialog table#docingreso > tbody > tr:not([data-new="true"]):first-of-type > td:nth-of-type(6)'
                  )
                    .text()
                    .toUpperCase() != "NULO" &&
                  $(".ui-dialog table#docingreso > tbody > tr").length > 0
                ) {
                  toastr.warning(
                    "No es posible anular la orden de ingreso. Hay documentos de pago vigentes."
                  );
                  anular = false;
                }
              }
              if (params.entity == "Cotizacion") {
                //-- ini -- modificado el 07-11-17 - por gin para verificar si tiene docs antes de anular
                anular = false;
                var info = cotizacion.verifyHasDocs(
                  $("section.sheet").data("id")
                );
                if (info.success) {
                  anular = true;
                } else {
                  var text = "";
                  if (info.invoices > 0)
                    if (info.invoices == 1)
                      text = "- Una Factura de venta.<br>";
                    else
                      text = "-" + info.invoices + " Facturas de ventas.<br>";

                  if (info.purchases_oc > 0)
                    if (info.purchases_oc == 1)
                      text += "- Una Orden de compra.<br>";
                    else
                      text +=
                        "-" + info.purchases_oc + " Órdenes de compras.<br>";

                  if (info.purchases_fxr > 0)
                    if (info.purchases_fxr == 1)
                      text += "- Una Rendición de fondo.<br>";
                    else
                      text +=
                        "-" + info.purchases_fxr + " Rendiciones de fondo.<br>";

                  toastr.warning(
                    "No es posible anular la cotización. Tiene documentos asociados:<br><br>" +
                      text
                  );
                }

                /*$.ajax({
									url: '/4DACTION/_V3_getOrdenesByNegocio',
									data: {
										id: $('section.sheet').data('id')
									},
									dataType: 'json',
									async: false,
									success: function(data) {
										if (data.rows.length > 0) {
											for (var i = 0; i < data.rows.length; i++) {
												if (data.rows[i].estado != 'ANULADA') {
													anular = false;
													break;
												}
											}
										}
									}
								})
								if (!anular)
									toastr.warning('No es posible anular la cotización. Hay OC de proveedores vigentes.');*/

                //-- fin -- modificado el 07-11-17 - por gin para verificar si tiene docs antes de anular
              }
              if (params.entity == "presupuestos") {
                //-- ini -- modificado el 07-11-17 - por gin para verificar si tiene docs antes de anular
                anular = false;
                var info = cotizacion.verifyHasDocs(
                  $("section.sheet").data("id")
                );
                if (info.success) {
                  anular = true;
                } else {
                  var text = "";
                  if (info.invoices > 0)
                    if (info.invoices == 1)
                      text = "- Una Factura de venta.<br>";
                    else
                      text = "-" + info.invoices + " Facturas de ventas.<br>";

                  if (info.purchases_oc > 0)
                    if (info.purchases_oc == 1)
                      text += "- Una Orden de compra.<br>";
                    else
                      text +=
                        "-" + info.purchases_oc + " Órdenes de compras.<br>";

                  if (info.purchases_fxr > 0)
                    if (info.purchases_fxr == 1)
                      text += "- Una Rendición de fondo.<br>";
                    else
                      text +=
                        "-" + info.purchases_fxr + " Rendiciones de fondo.<br>";

                  toastr.warning(
                    "No es posible anular el presupuestos. Tiene documentos asociados:<br><br>" +
                      text
                  );
                }

                /*$.ajax({
									url: '/4DACTION/_V3_getOrdenesByNegocio',
									data: {
										id: $('section.sheet').data('id')
									},
									dataType: 'json',
									async: false,
									success: function(data) {
										if (data.rows.length > 0) {
											for (var i = 0; i < data.rows.length; i++) {
												if (data.rows[i].estado != 'ANULADA') {
													anular = false;
													break;
												}
											}
										}
									}
								})
								if (!anular)
									toastr.warning('No es posible anular la cotización. Hay OC de proveedores vigentes.');*/

                //-- fin -- modificado el 07-11-17 - por gin para verificar si tiene docs antes de anular
              }

              if (anular) {
                confirm(MSG.get("CONFIRM_DOCUMENT_NULLIFY")).done(function(
                  data
                ) {
                  if (data) {
                    var htmlObject = $(
                      '<section> \
											<span>Ingresar motivo anulación</span> \
											<input required readonly type="search" name="motivo"> \
											<button class="show motivo-anulacion">Ver motivos de anulación</button> \
										</section>'
                    );
                    htmlObject
                      .find('input[type="search"]')
                      .autocomplete({
                        source: function(request, response) {
                          $.ajax({
                            url: "/4DACTION/_V3_" + "getMotivoAnulacion",
                            dataType: "json",
                            data: {
                              //q: request.term
                              modulo: params.entity
                            },
                            success: function(data) {
                              response(
                                $.map(data.rows, function(item) {
                                  return item;
                                })
                              );
                            }
                          });
                        },
                        minLength: 0,
                        delay: 5,
                        position: {
                          my: "left top",
                          at: "left bottom",
                          collision: "flip"
                        },
                        open: function() {
                          $(this)
                            .removeClass("ui-corner-all")
                            .addClass("ui-corner-top");
                        },
                        close: function() {
                          $(this)
                            .removeClass("ui-corner-top")
                            .addClass("ui-corner-all");
                        },
                        focus: function(event, ui) {
                          $(this).val(ui.item.text);
                          return false;
                        },
                        select: function(event, ui) {
                          $(this).val(ui.item.text);
                          htmlObject.data("response", $(this).val());
                          return false;
                        }
                      })
                      .data("ui-autocomplete")._renderItem = function(
                      ul,
                      item
                    ) {
                      return $(
                        "<li><a><span>" + item.text + "</span></a></li>"
                      ).appendTo(ul);
                    };

                    htmlObject
                      .find("button.show.motivo-anulacion")
                      .button({
                        icons: {
                          primary: "ui-icon-carat-1-s"
                        },
                        text: false
                      })
                      .click(function() {
                        htmlObject
                          .find('input[type="search"]')
                          .autocomplete("search", "@");
                      });

                    prompt(htmlObject).done(function(data) {
                      var enteredMessage = data;
                      //if (data !== false) {
                      $.ajax({
                        url: "/4DACTION/_V3_set" + params.entity,
                        dataType: "json",
                        data: {
                          //$('section.sheet').data('id')
                          id: params.data().id,
                          "cotizacion[estado]": false,
                          "cotizacion[estado][observaciones]": data,
                          "oc[id]": $("section.sheet").data("id"),
                          "oc[anular]": true,
                          "oc[anular][observaciones]": data,
                          nullify: true, // TODO: este deberia ser el parámetro definitivo para anular genérico
                          comment: data
                        },
                        success: function(data) {
                          if (data.success) {
                            var id = $("section.sheet").data("id");
                            //toastr.info('El Documento ha sido anulado!');
                            toastr.info(NOTIFY.get("SUCCESS_DOCUMENT_NULLIFY"));
                            // TODO: implementar un URI handler
                            switch (params.entity) {
                              case "Cotizacion":
                                unblockCot();
                                unaBase.inbox.send({
                                  subject:
                                    "Ha anulado la cotización Nº " +
                                    $("section.sheet").data("index") +
                                    " / " +
                                    $("section.sheet")
                                      .find(
                                        'input[name="cotizacion[titulo][text]"]'
                                      )
                                      .val(),
                                  into: "viewport",
                                  href:
                                    "/v3/views/cotizaciones/content.shtml?id=" +
                                    data.id,
                                  tag: "avisos",
                                  text: enteredMessage
                                });
                                // Omite el historial si se redirige a la misma página por anulación
                                unaBase.loadInto.viewport(
                                  "/v3/views/cotizaciones/content.shtml?id=" +
                                    id,
                                  undefined,
                                  undefined,
                                  true
                                );
                                break;
                              case "Negocios": //presupuestos
                                unblockCot();
                                unaBase.inbox.send({
                                  subject:
                                    "Ha anulado el presupuesto Nº " +
                                    $("section.sheet").data("index") +
                                    " / " +
                                    $("section.sheet")
                                      .find(
                                        'input[name="cotizacion[titulo][text]"]'
                                      )
                                      .val(),
                                  into: "viewport",
                                  href:
                                    "/v3/views/presupuestos/content.shtml?id=" +
                                    data.id,
                                  tag: "avisos",
                                  text: enteredMessage
                                });
                                // Omite el historial si se redirige a la misma página por anulación
                                unaBase.loadInto.viewport(
                                  "/v3/views/presupuestos/content.shtml?id=" +
                                    id,
                                  undefined,
                                  undefined,
                                  true
                                );
                                break;
                              case "Compras":
                                // unaBase.loadInto.viewport('/v3/views/compras/list_basico.shtml');
                                if ($("#sheet-compras").data("factoring")) {
                                  unaBase.loadInto.viewport(
                                    "/v3/views/compras/content_factoring.shtml?id=" +
                                      id,
                                    undefined,
                                    undefined,
                                    true
                                  );
                                } else {
                                  unaBase.loadInto.viewport(
                                    "/v3/views/compras/content.shtml?id=" + id,
                                    undefined,
                                    undefined,
                                    true
                                  );
                                }
                                break;
                              case "Pago":
                                /*$('.ui-dialog fieldset.pago').data('nullified', true);
																$('.ui-dialog header').hide();
																$('.ui-dialog input, .ui-dialog textarea').attr('readonly', true);
																$('section.sheet table.pagos').trigger('refresh');
																$('section.sheet table.dtcs').trigger('refresh');*/
                                // unaBase.loadInto.viewport('/v3/views/pagos/content2.shtml?id=' + payment.id, undefined, undefined, true);
                                unaBase.history.back();
                                break;
                              case "Ingreso":
                                $(".ui-dialog fieldset.ingreso").data(
                                  "nullified",
                                  true
                                );
                                $(".ui-dialog header").hide();
                                $(".ui-dialog input, .ui-dialog textarea").attr(
                                  "readonly",
                                  true
                                );
                                //$('section.sheet table.ordenesingreso').trigger('refresh');

                                // si anula desde lista ingreso
                                if (element.length > 0) {
                                  if ($(element).parentTo(".ui-dialog-content").length > 0) {
                                    if ($("#search").length > 0) {
                                      unaBase.toolbox.search._advancedSearch(true);
                                    }
                                    $(element).parentTo(".ui-dialog-content").dialog("close");
                                  }
                                }

                                // si anula desde dtv
                                if ($('section.sheet-dtv').length > 0) {
                                   dtv.display();
                                }
                               
                                break;
                              case "Dtc":
                                unaBase.history.back();
                              case "Dtcnc":
                                unaBase.history.back();
                            }
                          } else {
                            if (data.opened) {
                              if (data.readonly)
                                toastr.error(
                                  NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                                );
                            }
                          }
                        },
                        error: function(xhr, text, error) {
                          toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                        }
                      });
                      //}
                    });
                  }
                });
              }
            }
          });

        if ($.inArray("create_crud", params.buttons) != -1)
          buttons.push({
            name: "create_crud",
            icon: "ui-icon-document",
            caption: "Crear",
            action: function() {
              switch (params.entity) {
                case "reportes":
                  var element = this;
                  $.ajax({
                    url: "/4DACTION/_V3_setReportes",
                    dataType: "json",
                    type: "POST",
                    data: {
                      create: true
                    }
                  }).done(function(data) {
                    if (data.success) {
                      unaBase.loadInto.viewport(
                        "/v3/views/reportes2/content.shtml?id=" + data.id
                      );
                    } else {
                      if (data.readonly) {
                        toastr.error(
                          NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                        );
                      } else {
                        toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                      }
                    }
                  });
                  break;
                case "formaspago":
                  var element = this;
                  $.ajax({
                    url: "/4DACTION/_V3_setFormaspago",
                    dataType: "json",
                    type: "POST",
                    data: {
                      create: true
                    }
                  }).done(function(data) {
                    if (data.success) {
                      unaBase.loadInto.viewport(
                        "/v3/views/ajustes/formas_pago/content.shtml?id=" +
                          data.id
                      );
                    } else {
                      if (data.readonly) {
                        toastr.error(
                          NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                        );
                      } else {
                        toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                      }
                    }
                  });
                  break;
                case "tipospago":
                  var element = this;
                  $.ajax({
                    url: "/4DACTION/_V3_setTipospago",
                    dataType: "json",
                    type: "POST",
                    data: {
                      create: true
                    }
                  }).done(function(data) {
                    if (data.success) {
                      unaBase.loadInto.viewport(
                        "/v3/views/ajustes/tipos_pago/content.shtml?id=" +
                          data.id
                      );
                    } else {
                      if (data.readonly) {
                        toastr.error(
                          NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                        );
                      } else {
                        toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                      }
                    }
                  });
                  break;
                case "impuestos":
                  //   	var element = this;
                  // $.ajax({
                  // 	url: '/4DACTION/_V3_setImpuestos',
                  // 	dataType: 'json',
                  // 	type: 'POST',
                  // 	data:{
                  // 		create : false
                  // 	}
                  // }).done(function(data) {
                  // 	if (data.success) {
                  // 		unaBase.loadInto.viewport('/v3/views/ajustes/impuestos/content.shtml?id=' + data.id);
                  // 	}else{
                  // 		if (data.readonly) {
                  // 			toastr.error(NOTIFY.get('ERROR_RECORD_READONLY', 'Error'));
                  // 		}else{
                  // 			toastr.error(NOTIFY.get('ERROR_INTERNAL', 'Error'));
                  // 		}
                  // 	}
                  // });
                  impuestos.set("create", "impuesto");
                  break;
                case "tiposcuenta":
                  var element = this;
                  $.ajax({
                    url: base_url + "/4DACTION/_V3_setTiposcuenta",
                    dataType: "json",
                    type: "POST",
                    data: {
                      create: true
                    }
                  }).done(function(data) {
                    if (data.success) {
                      unaBase.loadInto.viewport(
                        "/v3/views/ajustes/tipos_cuenta/content.shtml?id=" +
                          data.id
                      );
                    } else {
                      if (data.readonly) {
                        toastr.error(
                          NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                        );
                      } else {
                        toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                      }
                    }
                  });
                  break;
                case "banco":
                  var element = this;
                  $.ajax({
                    url: "/4DACTION/_V3_setBanco",
                    dataType: "json",
                    type: "POST",
                    data: {
                      create: true
                    }
                  }).done(function(data) {
                    if (data.success) {
                      unaBase.loadInto.viewport(
                        "/v3/views/ajustes/banco/content.shtml?id=" + data.id
                      );
                    } else {
                      if (data.readonly) {
                        toastr.error(
                          NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                        );
                      } else {
                        toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                      }
                    }
                  });
                  break;
                case "tiposdtc":
                  var element = this;
                  $.ajax({
                    url: "/4DACTION/_V3_setTiposdtc",
                    dataType: "json",
                    type: "POST",
                    data: {
                      create: true
                    }
                  }).done(function(data) {
                    if (data.success) {
                      unaBase.loadInto.viewport(
                        "/v3/views/ajustes/tipos_dtc/content.shtml?id=" +
                          data.id
                      );
                    } else {
                      if (data.readonly) {
                        toastr.error(
                          NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                        );
                      } else {
                        toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                      }
                    }
                  });
                  break;
              }
            }
          });
        if ($.inArray("create_imp", params.buttons) != -1)
          buttons.push({
            name: "create_imp",
            icon: "ui-icon-document",
            caption: "Crear",
            action: function() {
              var element = this;
              $.ajax({
                url: "/4DACTION/_V3_setImpuestos",
                dataType: "json",
                type: "POST",
                data: {
                  create: true
                }
              }).done(function(data) {
                if (data.success) {
                  unaBase.loadInto.viewport(
                    "/v3/views/ajustes/impuestos/content.shtml?id=" + data.id
                  );
                } else {
                  if (data.readonly) {
                    toastr.error(NOTIFY.get("ERROR_RECORD_READONLY", "Error"));
                  } else {
                    toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                  }
                }
              });
            }
          });

        if ($.inArray("restore", params.buttons) != -1)
          buttons.push({
            name: "restore",
            icon: "ui-icon-arrowreturnthick-1-n",
            caption: "Desanular",
            action: function() {
              var anular = true;
              var element = $(this);
              // if (params.entity=="Compras") {
              // 	if (!_validationDocAsociadosOC()) {
              // 		toastr.warning(NOTIFY.get('WARNING_GASTO_NULLIFY'));
              // 		anular = false;
              // 	}
              // }
              // if (params.entity == 'Pago') {
              // 	// Verificar antes de anular
              // 	if (
              // 		$('.ui-dialog table > tbody > tr:not([data-new="true"]):first-of-type > td:nth-of-type(6)').text().toUpperCase() != 'NULO' &&
              // 		$('.ui-dialog table > tbody > tr').length > 0
              // 	) {
              // 		toastr.warning('No es posible anular la orden de pago. Hay documentos de pago vigentes.');
              // 		anular = false;
              // 	}
              // }
              // if (params.entity == 'Cobro') {
              // 	// Verificar antes de anular
              // 	/*if ($('.ui-dialog table > tbody > tr:not([data-new="true"]):first-of-type > td:nth-of-type(6)').text().toUpperCase() != 'NULO') {
              // 		toastr.warning('No es posible anular la orden de pago. Hay documentos de pago vigentes.');
              // 		anular = false;
              // 	}*/
              // }
              // if (params.entity == 'Cotizacion') {
              // 	$.ajax({
              // 		url: '/4DACTION/_V3_getOrdenesByNegocio',
              // 		data: {
              // 			id: $('section.sheet').data('id')
              // 		},
              // 		dataType: 'json',
              // 		async: false,
              // 		success: function(data) {
              // 			if (data.rows.length > 0) {
              // 				for (var i = 0; i < data.rows.length; i++) {
              // 					if (data.rows[i].estado != 'ANULADA') {
              // 						anular = false;
              // 						break;
              // 					}
              // 				}
              // 			}
              // 		}
              // 	})
              // 	if (!anular)
              // 		toastr.warning('No es posible anular la cotización. Hay OC de proveedores vigentes.');
              // }

              // if (anular){
              confirm("¿Quieres desanular el documento?").done(function(data) {
                if (data) {
                  // var htmlObject = $('<section> \
                  // 	<span>Ingresar motivo anulación</span> \
                  // 	<input required readonly type="search" name="motivo"> \
                  // 	<button class="show motivo-anulacion">Ver motivos de anulación</button> \
                  // </section>');
                  // htmlObject.find('input[type="search"]').autocomplete({
                  // 	source: function(request, response) {
                  // 		$.ajax({
                  // 			url: '/4DACTION/_V3_' + 'getMotivoAnulacion',
                  // 			dataType: 'json',
                  // 			data: {
                  // 				//q: request.term
                  // 				modulo: params.entity
                  // 			},
                  // 			success: function(data) {
                  // 				response($.map(data.rows, function(item) {
                  // 					return item;
                  // 				}));
                  // 			}
                  // 		});
                  // 	},
                  // 	minLength: 0,
                  // 	delay: 5,
                  // 	position: { my: "left top", at: "left bottom", collision: "flip" },
                  // 	open: function() {
                  // 		$(this).removeClass('ui-corner-all').addClass('ui-corner-top');
                  // 	},
                  // 	close: function() {
                  // 		$(this).removeClass('ui-corner-top').addClass('ui-corner-all');
                  // 	},
                  // 	focus: function(event, ui) {
                  // 		$(this).val(ui.item.text);
                  // 		return false;
                  // 	},
                  // 	select: function(event, ui) {
                  // 		$(this).val(ui.item.text);
                  // 		htmlObject.data('response', $(this).val());
                  // 		return false;
                  // 	}

                  // }).data('ui-autocomplete')._renderItem = function(ul, item) {
                  // 	return $('<li><a><span>' + item.text + '</span></a></li>').appendTo(ul);
                  // };

                  // htmlObject.find('button.show.motivo-anulacion').button({
                  // 	icons: {
                  // 		primary: 'ui-icon-carat-1-s'
                  // 	},
                  // 	text: false
                  // }).click(function() {
                  // 	htmlObject.find('input[type="search"]').autocomplete('search', '@');
                  // });

                  // prompt(htmlObject).done(function(data) {
                  // 	var enteredMessage = data;
                  //if (data !== false) {
                  $.ajax({
                    url: "/4DACTION/_V3_set" + params.entity,
                    dataType: "json",
                    data: {
                      //$('section.sheet').data('id')
                      id: params.data().id,
                      "cotizacion[estado]": true,
                      "cotizacion[estado][observaciones]": "",
                      "oc[id]": $("section.sheet").data("id"),
                      "oc[anular]": false,
                      "oc[anular][observaciones]": "",
                      nullify: false,
                      comment: ""
                    },
                    success: function(data) {
                      if (data.success) {
                        var id = $("section.sheet").data("id");
                        //toastr.info('El Documento ha sido anulado!');
                        toastr.info("El documento ha sido desanulado!");
                        // TODO: implementar un URI handler

                        switch (params.entity) {
                          case "Cotizacion":
                            unaBase.inbox.send({
                              subject:
                                "Ha desanulado la cotización Nº " +
                                $("section.sheet").data("index") +
                                " / " +
                                $("section.sheet")
                                  .find(
                                    'input[name="cotizacion[titulo][text]"]'
                                  )
                                  .val(),
                              into: "viewport",
                              href:
                                "/v3/views/cotizaciones/content.shtml?id=" +
                                data.id,
                              tag: "avisos",
                              text: ""
                            });
                            // Omite el historial si se redirige a la misma página por anulación
                            unaBase.loadInto.viewport(
                              "/v3/views/cotizaciones/content.shtml?id=" + id,
                              undefined,
                              undefined,
                              true
                            );
                            break;
                          case "Negocios": //  case 'presupuestos':
                            unaBase.inbox.send({
                              subject:
                                "Ha desanulado el presupuesto Nº " +
                                $("section.sheet").data("index") +
                                " / " +
                                $("section.sheet")
                                  .find(
                                    'input[name="cotizacion[titulo][text]"]'
                                  )
                                  .val(),
                              into: "viewport",
                              href:
                                "/v3/views/presupuestos/content.shtml?id=" +
                                data.id,
                              tag: "avisos",
                              text: ""
                            });
                            // Omite el historial si se redirige a la misma página por anulación
                            unaBase.loadInto.viewport(
                              "/v3/views/presupuestos/content.shtml?id=" + id,
                              undefined,
                              undefined,
                              true
                            );
                            break;
                          case "Compras":
                            unaBase.loadInto.viewport(
                              "/v3/views/compras/content.shtml?id=" + id,
                              undefined,
                              undefined,
                              true
                            );
                            break;
                          // case 'Pago':
                          // 	$('.ui-dialog fieldset.pago').data('nullified', true);
                          // 	$('.ui-dialog header').hide();
                          // 	$('.ui-dialog input, .ui-dialog textarea').attr('readonly', true);
                          // 	$('section.sheet table.pagos').trigger('refresh');
                          // case 'Cobro':
                          // 	$('section.sheet table.cobros').trigger('refresh');
                          // 	$(element).parentTo('.ui-dialog-content').dialog('close');
                        }
                      } else {
                        if (data.opened) {
                          if (data.readonly)
                            toastr.error(
                              NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                            );
                        }
                      }
                    },
                    error: function(xhr, text, error) {
                      toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                    }
                  });
                  //}
                  // });
                }
              });
              // }
            }
          });

        if ($.inArray("delete", params.buttons) != -1)
          buttons.push({
            name: "delete",
            icon: "ui-icon-trash",
            caption: "Eliminar",
            action: function() {
              var element = $(this);
              switch (params.entity) {
                case "Cotizacion":
                  confirm(MSG.get("CONFIRM_TEMPLATE_DELETE")).done(function(
                    data
                  ) {
                    if (data) {
                      $.ajax({
                        url: "/4DACTION/_V3_remove" + params.entity,
                        dataType: "json",
                        data: {
                          id: params.data().id
                        },
                        success: function(data) {
                          if (data.success) {
                            toastr.info(NOTIFY.get("SUCCESS_DELETE_TEMPLATE"));
                            unaBase.loadInto.viewport(
                              "/v3/views/cotizaciones/content.shtml?id=" +
                                $("section.sheet").data("id")
                            );
                          } else {
                            if (data.opened) {
                              if (data.readonly)
                                toastr.error(
                                  NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                                );
                            }
                          }
                        },
                        error: function(xhr, text, error) {
                          toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                        }
                      });
                    }
                  });
                  break;
                case "Producto":
                  confirm(MSG.get("CONFIRM_PRODUCTO_DELETE")).done(function(
                    data
                  ) {
                    if (data) {
                      $.ajax({
                        url: "/4DACTION/_V3_remove" + params.entity,
                        dataType: "json",
                        data: {
                          id: params.data().id
                        },
                        success: function(data) {
                          if (data.success) {
                            toastr.info(NOTIFY.get("SUCCESS_DELETE_PRODUCTO"));
                            unaBase.loadInto.viewport(
                              "/v3/views/catalogo/list.shtml"
                            );
                          } else {
                            if (data.opened) {
                              if (data.readonly)
                                toastr.error(
                                  NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                                );
                            }
                          }
                        },
                        error: function(xhr, text, error) {
                          toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                        }
                      });
                    }
                  });
                  break;
                case "Dtv":
                  confirm(MSG.get("CONFIRM_DOCUMENT_DELETE")).done(function(
                    data
                  ) {
                    if (data) {
                      $.ajax({
                        url: "/4DACTION/_V3_setDtv",
                        data: {
                          id: dtv.id,
                          delete: true
                        },
                        dataType: "json",
                        success: function(data) {
                          if (typeof event != "undefined")
                            unaBase.history.back();
                        },
                        error: function(xhr, text, error) {
                          toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                        }
                      });
                    }
                  });
                  break;

                case "NcVentas":
                  confirm(MSG.get("CONFIRM_DOCUMENT_DELETE")).done(function(
                    data
                  ) {
                    if (data) {
                      $.ajax({
                        url: "/4DACTION/_V3_setNcVentas",
                        data: {
                          id: notas.id,
                          delete: true
                        },
                        dataType: "json",
                        success: function(data) {
                          if (data.success) {
                            toastr.info(NOTIFY.get("SUCCESS_DELETE"));
                            if (typeof event != "undefined")
                              unaBase.history.back();
                          } else {
                            if (data.opened) {
                              if (data.readonly)
                                toastr.error(
                                  NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                                );
                            }
                          }
                        },
                        error: function(xhr, text, error) {
                          toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                        }
                      });
                    }
                  });
                  break;

                case "Occ":
                  confirm(MSG.get("CONFIRM_DOCUMENT_DELETE")).done(function(
                    data
                  ) {
                    if (data) {
                      $.ajax({
                        url: "/4DACTION/_V3_setOcc",
                        data: {
                          id: $("#sheet-occ").data("id"),
                          delete: true
                        },
                        dataType: "json",
                        success: function(data) {
                          if (data.success) {
                            toastr.info(NOTIFY.get("SUCCESS_DELETE"));
                            $(element)
                              .closest(".ui-dialog-content")
                              .dialog("close");
                            $(".load-occliente > a").trigger("click");
                          } else {
                            if (data.opened) {
                              if (data.readonly)
                                toastr.error(
                                  NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                                );
                            }
                          }
                        },
                        error: function(xhr, text, error) {
                          toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                        }
                      });
                    }
                  });
                  break;
              }
            }
          });

        if ($.inArray("delete_cobro", params.buttons) != -1)
          buttons.push({
            name: "delete_cobro",
            icon: "ui-icon-trash",
            caption: "Eliminar",
            action: function() {
              var element = $(this);
              confirm(MSG.get("CONFIRM_DOCUMENT_DELETE")).done(function(data) {
                if (data) {
                  var container = $("#sheet-cobros");
                  $.ajax({
                    url: "/4DACTION/_V3_setCobro",
                    data: {
                      id: cobro.id,
                      delete: true
                    },
                    dataType: "json",
                    success: function(data) {
                      if (typeof event != "undefined") {
                        if (compras.id != "undefined") {
                          get_cobros_oc(compras.id);
                          get_totales_gastos();
                        }
                        $(element)
                          .parentTo(".ui-dialog-content")
                          .dialog("close");
                      }
                    },
                    error: function(xhr, text, error) {
                      toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                    }
                  });
                }
              });
            }
          });

        if ($.inArray("deactivate", params.buttons) != -1)
          buttons.push({
            name: "deactivate",
            icon: "ui-icon-trash",
            caption: "Desactivar",
            action: function() {
              switch (params.entity) {
                case "Producto":
                  confirm(MSG.get("CONFIRM_PRODUCTO_DEACTIVATE")).done(function(
                    data
                  ) {
                    if (data) {
                      $.ajax({
                        url: "/4DACTION/_V3_remove" + params.entity,
                        dataType: "json",
                        data: {
                          id: params.data().id
                        },
                        success: function(data) {
                          if (data.success) {
                            toastr.info(
                              NOTIFY.get("SUCCESS_DEACTIVATE_PRODUCTO")
                            );
                            unaBase.loadInto.viewport(
                              "/v3/views/catalogo/list.shtml"
                            );
                          } else {
                            if (data.opened) {
                              if (data.readonly)
                                toastr.error(
                                  NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                                );
                            }
                          }
                        },
                        error: function(xhr, text, error) {
                          toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                        }
                      });
                    }
                  });
                  break;
              }
            }
          });

        if ($.inArray("activate", params.buttons) != -1)
          buttons.push({
            name: "activate",
            icon: "ui-icon-check",
            caption: "Activar",
            action: function() {
              switch (params.entity) {
                case "Producto":
                  confirm(MSG.get("CONFIRM_PRODUCTO_ACTIVATE")).done(function(
                    data
                  ) {
                    if (data) {
                      $.ajax({
                        url: "/4DACTION/_V3_enable" + params.entity,
                        dataType: "json",
                        data: {
                          id: params.data().id
                        },
                        success: function(data) {
                          if (data.success) {
                            toastr.info(
                              NOTIFY.get("SUCCESS_ACTIVATE_PRODUCTO")
                            );
                            unaBase.loadInto.viewport(
                              "/v3/views/catalogo/list.shtml"
                            );
                          } else {
                            if (data.opened) {
                              if (data.readonly)
                                toastr.error(
                                  NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                                );
                            }
                          }
                        },
                        error: function(xhr, text, error) {
                          toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                        }
                      });
                    }
                  });
                  break;
              }
            }
          });

        if ($.inArray("preview", params.buttons) != -1)
          buttons.push({
            name: "preview",
            icon: "ui-icon-search",
            caption: "Vista previa",
            action: function() {

              var callback = async function() {
                // var saved = menu
                //   .find('[data-name="save"] button')
                //   .triggerHandler("click");
                // if (!saved.success) event.stopImmediatePropagation();
             

                var ajaxData = params.data();
                var success = false;
                $.extend(ajaxData, ajaxData, { preview: true });
           

                // Si es cotización o negocio
                if ( $('html > body.menu > aside > div > div > ul > li[data-name="cotizaciones"]').hasClass("active") ||
                  $('html > body.menu > aside > div > div > ul > li[data-name="negocios"]').hasClass("active") ) {
                  var is_negocio = true;
                  if (
                    !$(
                      'html > body.menu > aside > div > div > ul > li[data-name="negocios"]'
                    ).hasClass("active")
                  ) {
                    is_negocio = false;
                  }

                  /*$.ajax({
										url: '/4DACTION/_V3_setCotizacion',
										type: 'POST',
										dataType: 'json',
										data: ajaxData,
										async: false // para poder hacer el save correctamente y esperar la respuesta
									}).done(function(data) {
										success = data.success;
									});

									if (!success)
										return false;*/
                  let url;
                  var continueAction = function() {
                    if (params.entity == "Cotizacion") {
                      url =  nodeUrl +"/print/?entity=cotizaciones&id=" + ajaxData.id + "&folio=" + (typeof ajaxData.index != "undefined"
                          ? ajaxData.index
                          : "S/N") +
                        "&sid=" +
                        unaBase.sid.encoded() +
                        "&preview=true&nullified=" +
                        ajaxData.readonly +
                        "&template=" +
                        formato_impresion_cotizacion +
                        "&hostname=" +
                        window.location.origin;
                    } else {
                      url =
                       nodeUrl +
                        "/print/?entity=cotizaciones&id=" +
                        ajaxData.id +
                        "&folio=" +
                        $("section.sheet").data("index") +
                        "&sid=" +
                        unaBase.sid.encoded() +
                        "&preview=true&nullified=" +
                        ajaxData.readonly +
                        "&template=" +
                        formato_impresion_cotizacion +
                        "&hostname=" +
                        window.location.origin;
                    }

                    if(uVar.nativePrint){
                      // axios(url).then(res => {
                      //   unaBase.loadInto.dialog(res.data, "Vista previa", "large", true);
                      // }).catch(err => {
                      //   console.log(err);
                      // })
                                 
                      setTimeout(() => {
                        document.querySelector('input[name="printBtn"]').click();
                      },2000);
                    }else{
                        unaBase.loadInto.dialog(url, "Vista previa", "large", true);
                      }
                    if (is_negocio)
                      unaBase.log.save(
                        "Ha realizado vista previa de " + etiqueta_negocio,
                        "negocios",
                        $("section.sheet").data("index")
                      );
                    else
                      unaBase.log.save(
                        "Ha realizado vista previa de " + etiqueta_cotizacion,
                        "cotizaciones",
                        $("section.sheet").data("index")
                      );
                  };

                  // Se verifica si el PDF es válido antes generar vista previa
                  // (total neto == suma_subtotales)
                  if (
                    params.entity == "Cotizacion" ||
                    params.entity == "Negocios"
                  ) {
                    let valid, hidden_items, checkDifference;
                    // $.ajax({
                    //   url: "/4DACTION/_V3_checkCotizacionPdf",
                    //   data: {
                    //     id: $("section.sheet").data("id")
                    //   },
                    //   dataType: "json",
                    //   async: false,
                    //   success: function(data) {
                    //     valid = data.valid;
                    //     hidden_items = data.hidden_items;
                    //   }
                    // });
                    
                    checkDifference = await negocios.checkDifference(unaBase.doc.id);
                    
                    valid = !checkDifference.hasDifference;
                    if (valid) {
                      switch (params.entity) {
                        case "Cotizacion":
                          var modulo = etiqueta_cotizacion;
                          break;
                        case "Negocios":
                          var modulo = etiqueta_negocio;
                          break;
                      }
                      if (hidden_items) {
                        confirm(
                          "Existen ítems ocultos con precio unitario mayor a 0. ¿Desea generar PDF de todos modos?"
                        ).done(function(data) {
                          if (data) {
                            unaBase.log.save(
                              "Ha generado PDF con ítems ocultos que tienen precio unitario mayor a 0",
                              "cotizaciones",
                              $("section.sheet").data("index")
                            );
                            continueAction();
                          }
                        });
                      } else {
                        // toastr.error('No es posible descargar PDF. Existen diferencias en ' + modulo + '. Por favor revisar.');
                        continueAction();
                      }
                      return false;
                    } else {
                      // // agregado de forna temporal, gin, 28-03-18
                      // continueAction();
                      toastr.warning("Lo sentimos ! no pudimos obtener el documento, Error 1501, comunícate con soporte de inmediato para resolver.");
                    }
                  } else {
                    continueAction();
                  }
                }

                // Si es dtv
                if (
                  $(
                    'html > body.menu > aside > div > div > ul > li[data-name="dtv"]'
                  ).hasClass("active")
                ) {
                  // antes de crear el preview, gatilla el evento y guarda
                  var saved = menu
                    .find('[data-name="save"] button')
                    .triggerHandler("click");
                  //if (!saved.success)
                  // 	return false;

                  var url =
                    nodeUrl +
                    "/print/?entity=dtv&id=" +
                    params.data().id +
                    "&folio=" +
                    (typeof params.data().index != "undefined"
                      ? params.data().index
                      : "S/N") +
                    "&sid=" +
                    unaBase.sid.encoded() +
                    "&preview=true&nullified=" +
                    params.data().readonly +
                    "&hostname=" +
                    window.location.origin;
                  unaBase.loadInto.dialog(url, "Vista previa", "large", true);
                }
              };
             var saved = menu
                .find('[data-name="save"] button')
                .triggerHandler("click");
              if (!saved.success) {
                event.stopImmediatePropagation();
              } else {
                // se deshabilita el update Indexes, ya que se ejecuta cuando se guarda.
                // if (typeof updateIndexes == "undefined") {
                //   callback();
                // } else {
                //   updateIndexes(callback);
                // }
                callback();
              }
              // var saved = menu
              //   .find('[data-name="save"] button')
              //   .triggerHandler("click");
              // if (!saved.success) {
              //   event.stopImmediatePropagation();
              // } else {
              //   if (typeof updateIndexes == "undefined") {
              //     callback();
              //   } else {
              //     updateIndexes(callback);
              //   }
              // }
            }
          });

        if ($.inArray("preview_oc", params.buttons) != -1){
          
          buttons.push({
            name: "preview_oc",
            icon: "ui-icon-search",
            caption: "Vista previa",
            action: function() {
              
              var callback = function() {
                // antes de crear el preview, gatilla el evento y guarda
                if(uVar.nativePrint){              
                  setTimeout(() => {
                    document.querySelector('input[name="printBtn"]').click();
                  },2000);
                }else{

                  let saved = menu
                    .find('[data-name="save"] button')
                    .triggerHandler("click");
                  if (!saved.success) return false;

                  let sid = "";
                  $.each($.cookie(), function(clave, valor) {
                    // if (valor.match(/UNABASE/g)) sid += valor + " ";
                    if (valor.match(/UNABASE/g)) sid += valor;
                  });

                  let url =
                    nodeUrl +
                    "/print/?entity=compras&id=" +
                    $("section.sheet").data("id") +
                    "&folio=" +
                    $("section.sheet").data("index") +
                    "&sid=" +
                    unaBase.sid.encoded() +
                    "&preview=true&nullified=" +
                    params.data().readonly +
                    "&hostname=" +
                    window.location.origin +
                    "&aliasfiles=" +
                    $("section.sheet").data("tipogasto") +
                    "_";

                  // unaBase.loadInto.dialog(url, "Vista previa", "large", true);
                    
                  var download = window.open(url);
                  download.blur();
                  window.focus();
                }
                compras.saveLogsFromWeb({
                  id: compras.id,
                  folio: compras.folio,
                  descripcion: "Ha realizado vista previa del gasto",
                  modulo: "gastos",
                  descripcion_larga: ""
                });
              };
                  callback(true);
                // if (unaBase.changeControl.query() && $("#search").is(":hidden"))
                //   alert('Debes guardar antes de imprimir').done(callback);
                // else {
                //   callback(true);
                //   document.querySelector('input[name="printBtn"]').click();
                // }
            }
          });

        }

        if ($.inArray("preview_native", params.buttons) != -1) {

          if(access.preview_native){
            buttons.push({
              name: "preview_native",
              icon: "ui-icon-search",
              caption: "Ver pdf",
              action: function() {
                           
                  setTimeout(() => {
                    document.querySelector('input[name="printBtn"]').click();
                  },2000);

                  compras.saveLogsFromWeb({
                    id: compras.id,
                    folio: compras.folio,
                    descripcion: "Ha realizado vista previa(nativa) del gasto",
                    modulo: "gastos",
                    descripcion_larga: ""
                  });
              }
            });

          }
        }

        if ($.inArray("preview_cheque", params.buttons) != -1)
          buttons.push({
            name: "preview_cheque",
            icon: "ui-icon-search",
            caption: "Vista previa",
            action: function() {
              var callback = function() {
                // antes de crear el preview, gatilla el evento y guarda
                //var saved = menu.find('[data-name="save"] button').triggerHandler('click');
                /*if (!saved.success)
										return false;*/

                var iddoc = payment.container
                  .find('#scrolldocpagos tbody tr[data-status="true"]')
                  .data("id");
                var form = payment.form_print_cheque;

                var sid = "";
                $.each($.cookie(), function(clave, valor) {
                  if (valor.match(/UNABASE/g)) sid += valor + " ";
                });

                // var url = 'http://' + nodejs_public_ipaddr + ':' + nodejs_port + '/print/?entity=pagos&id=' + iddoc + '&formch='+ formch /* + '&folio=' + ((typeof params.data().index != 'undefined')? params.data().index : 'S/N') + '&sid=' + unaBase.sid.encoded() + '&preview=true&nullified=' */ + params.data().readonly + '&hostname=' + window.location.origin;

                var url =
                  nodeUrl +
                  "/print/?entity=pagos&id=" +
                  iddoc +
                  "&form=" +
                  form +
                  "&" +
                  params.data().readonly +
                  "&hostname=" +
                  window.location.origin;
                unaBase.loadInto.dialog(url, "Vista previa", "large", true);

                /*compras.saveLogsFromWeb({
										'id' : pago.id
										'folio' : compras.folio,
										'descripcion' : 'Ha realizado vista previa del gasto',
										'modulo' :  'gastos',
										'descripcion_larga' : ''
									});*/
              };
              callback();
            }
          });

        if ($.inArray("boucher_pago", params.buttons) != -1)
          buttons.push({
            name: "boucher_pago",
            icon: "ui-icon-print",
            caption: "Voucher",
            action: function() {
              var callback = function() {
                var form = "boucher";
                var sid = "";
                $.each($.cookie(), function(clave, valor) {
                  if (valor.match(/UNABASE/g)) sid += valor + " ";
                });
                var url =
                  nodeUrl +
                  "/print/?entity=pagos&id=" +
                  payment.id +
                  "&form=" +
                  form +
                  "&" +
                  params.data().readonly +
                  "&hostname=" +
                  window.location.origin;
                unaBase.loadInto.dialog(url, "Vista previa", "large", true);
              };
              callback();
            }
          });

        if ($.inArray("import_gastos", params.buttons) != -1)
          buttons.push({
            name: "import_gastos",
            icon: "ui-icon-calculator",
            caption: "Importar y crear desde excel",
            action: function() {
              let tipo = "";
              if (
                $("html > body.menu.home > aside > div > div > ul > li.active")
                  .data("name")
                  .toUpperCase() == "GASTOS"
              ) {
                tipo = "crear oc validadas";
              } else {
                tipo = "crear fxr validadas";
              }
              if (access._439) {
                // crear gastos validados
                unaBase.loadInto.dialog(
                  "/v3/views/compras/import.shtml?id=0",
                  "Importar y crear gastos",
                  "small"
                );
              } else {
                alert(
                  "Debes contar con el permiso de <span style='font-weight:bold;'>" +
                    tipo +
                    "</span> para poder realizar está acción."
                );
              }
            }
          });

        if ($.inArray("share", params.buttons) != -1)
          buttons.push({
            name: "share",
            icons: {
              primary: "ui-icon-extlink",
              secondary: "ui-icon-triangle-1-s"
            },
            caption: "Compartir",
            action: function() {
              // if(unaBase.changeControl.query()){}
              $(this).tooltipster({
                content: function() {
                  
                  unaBase.ui.unblock();
                  var htmlObject = $(
                    '\
										<fieldset>																				\
											<legend style="display: none;">¿Cómo desea obtenerla?</legend>						\
											<!-- <button class="print">Imprimir</button> -->									\
											<button class="download">Descargar PDF</button>										\
											<button class="email">Enviar por email</button>										\
											<button class="export">Descargar Excel</button>										\
											<button class="carta">Descargar Carta Cliente</button>								\
										</fieldset>																				\
									'
                  );

                  $('[data-name="share"]').data("is-saved", false);
                  // Si corresponde a cotización, mostrar las opciones
                  if (true) {
                    var options = $(
                      '\
											<div style="margin-top: 5px;">														\
												<label style="display: block;">													\
													<input type="checkbox" name="cotizacion[compartir][totales_titulos]">		\
													Mostrar totales	en títulos													\
												</label>																		\
												<label style="display: block;">													\
													<input type="checkbox" name="cotizacion[compartir][items]">					\
													Mostrar ítems																\
												</label>																		\
												<label style="display: block;">													\
													<input type="checkbox" name="cotizacion[compartir][totales_items]">			\
													Mostrar totales	en ítems													\
												</label>																		\
												<label style="display: block;">													\
													<input type="checkbox" name="cotizacion[compartir][totales_cotizacion]">	\
													Mostrar totales	de cotización												\
												</label>																		\
												<label style="display: block;">													\
													<input type="checkbox" name="cotizacion[compartir][ocultar_cantidades]">	\
													Ocultar cantidades															\
												</label>																		\
												<label style="display: block;">													\
													<input type="checkbox" name="cotizacion[compartir][ocultar_items_cero]">	\
													Ocultar ítems con valor cero												\
												</label>\
												<label style="display: block;">                                                                \
													<input type="checkbox" name="cotizacion[compartir][mostrar_fecha_creacion]">\
													Mostrar fecha de creación												\
												</label>																	\
											</div>														\
										'
                    );

                    options
                      .find(
                        'input[name="cotizacion[compartir][totales_titulos]"]'
                      )
                      .prop("checked", compartir_totales_titulos);
                    options
                      .find('input[name="cotizacion[compartir][items]"]')
                      .prop("checked", compartir_items);
                    options
                      .find(
                        'input[name="cotizacion[compartir][totales_items]"]'
                      )
                      .prop("checked", compartir_totales_items);
                    options
                      .find(
                        'input[name="cotizacion[compartir][totales_cotizacion]"]'
                      )
                      .prop("checked", compartir_totales_cotizacion);
                    options
                      .find(
                        'input[name="cotizacion[compartir][ocultar_cantidades]"]'
                      )
                      .prop("checked", compartir_ocultar_cantidades);
                    options
                      .find(
                        'input[name="cotizacion[compartir][ocultar_items_cero]"]'
                      )
                      .prop("checked", compartir_ocultar_items_cero);

                    if (!compartir_items) {
                      options
                        .find(
                          'input[name="cotizacion[compartir][totales_items]"]'
                        )
                        .prop("disabled", true);
                      options
                        .find(
                          'input[name="cotizacion[compartir][ocultar_cantidades]"]'
                        )
                        .prop("disabled", true);
                      //options.find('input[name="cotizacion[compartir][ocultar_items_cero]"]').prop('disabled', true);
                    }

                    options
                      .find('input[name^="cotizacion"]')
                      .change(function(event) {
                        var fields = {};

                        fields["id"] = $("section.sheet").data("id");
                        fields[$(event.target).attr("name")] = $(
                          event.target
                        ).prop("checked");

                        //unaBase.ui.block();
                        $.ajax({
                          url: "/4DACTION/_V3_setCotizacion",
                          data: fields,
                          dataType: "json",
                          async: false,
                          success: function(data) {
                            //unaBase.ui.unblock();
                            if (data.success) {
                              $('[data-name="share"]').data("is-saved", true);
                              switch ($(event.target).attr("name")) {
                                case "cotizacion[compartir][totales_titulos]":
                                  compartir_totales_titulos = $(
                                    event.target
                                  ).prop("checked");
                                  break;
                                case "cotizacion[compartir][items]":
                                  compartir_items = $(event.target).prop(
                                    "checked"
                                  );
                                  options
                                    .find(
                                      'input[name="cotizacion[compartir][totales_items]"]'
                                    )
                                    .prop("disabled", !compartir_items);
                                  break;
                                case "cotizacion[compartir][totales_items]":
                                  compartir_totales_items = $(
                                    event.target
                                  ).prop("checked");
                                  break;
                                case "cotizacion[compartir][totales_cotizacion]":
                                  compartir_totales_cotizacion = $(
                                    event.target
                                  ).prop("checked");
                                  break;
                                case "cotizacion[compartir][ocultar_cantidades]":
                                  compartir_ocultar_cantidades = $(
                                    event.target
                                  ).prop("checked");
                                  break;
                                case "cotizacion[compartir][ocultar_items_cero]":
                                  compartir_ocultar_items_cero = $(
                                    event.target
                                  ).prop("checked");
                                  break;
                              }
                            }
                          }
                        });
                      });

                    htmlObject.append(options);
                  }

                 

                  //htmlObject.find('button').click(function(event) {
                  // al crear el share, gatilla el evento y guarda
                  //if (params.entity == 'Cotizacion') {
                  let saveAction = async callback => {
                    var saved = await menu
                    .find('[data-name="save"] button')
                    .triggerHandler("click");
                    
                    if (!saved.success){
                      event.stopImmediatePropagation();
                    }
                    //  else {
                    //   setTimeout(() => {
                        
                    //     if(unaBase.changeControl.isSaved){
                    //       callback();
                    //     }else{
                    //       toastr.warning(
                    //         "No es posible descargar el documento. El registro está bloqueado."
                    //       );
                    //     }
                    //   },2000);
                    // }
                  }
                  // var saved = menu
                  //   .find('[data-name="save"] button')
                  //   .triggerHandler("click");
                  // if (!saved.success){
                  //   event.stopImmediatePropagation();
                  // } else{
                  //   continueShare();
                  // }
             

                  if (mostrar_compartir_carta_cliente) {
                    htmlObject
                      .find("button.carta")
                      .button({
                        name: "carta",
                        icons: {
                          primary: "ui-icon-circle-arrow-s"
                        },
                        caption: "Carta Cliente"
                      })
                      .click(function() {
                        unaBase.save.callback = () => {
                          if ($('[data-name="share"]').data("is-saved")) {
                            var htmlObject = $(
                              '<section> \
  													<span>Texto carta cliente:</span> \
  													<form> \
  														<textarea name="texto_carta_cliente" rows="8" style="font-size: 10px !important;"></textarea> \
  													</form> \
  													<br>\
  													<span>Incluye:</span> \
  													<form> \
  														<textarea name="observaciones" rows="8" style="font-size: 10px !important;"></textarea> \
  													</form> \
  													<br>\
  													<span>No Incluye:</span> \
  													<form> \
  														<textarea name="no_incluye" rows="8" style="font-size: 10px !important;"></textarea> \
  													</form> \
  												</section>'
                            );
                            htmlObject
                              .find('textarea[name="texto_carta_cliente"]')
                              .text(texto_carta_cliente);
                            htmlObject
                              .find('textarea[name="observaciones"]')
                              .text(texto_observaciones);
                            htmlObject
                              .find('textarea[name="no_incluye"]')
                              .text(texto_no_incluye);
                            htmlObject
                              .find("textarea")
                              .on("blur change", function() {
                                htmlObject.data("response", {
                                  texto_carta_cliente: htmlObject
                                    .find('textarea[name="texto_carta_cliente"]')
                                    .val(),
                                  observaciones: htmlObject
                                    .find('textarea[name="observaciones"]')
                                    .val(),
                                  no_incluye: htmlObject
                                    .find('textarea[name="no_incluye"]')
                                    .val()
                                });
                                texto_carta_cliente = htmlObject
                                  .find('textarea[name="texto_carta_cliente"]')
                                  .val();
                                texto_observaciones = htmlObject
                                  .find('textarea[name="observaciones"]')
                                  .val();
                                texto_no_incluye = htmlObject
                                  .find('textarea[name="no_incluye"]')
                                  .val();
                              });

                            prompt(htmlObject).done(function(input_data) {
                              if (input_data !== false) {
                                $.ajax({
                                  url: "/4DACTION/_V3_setCotizacion",
                                  data: {
                                    id: $("section.sheet").data("id"),
                                    "cotizacion[texto_carta_cliente]":
                                      input_data.texto_carta_cliente,
                                    "cotizacion[condiciones][notas]":
                                      input_data.observaciones,
                                    "cotizacion[condiciones][no_incluye]":
                                      input_data.no_incluye
                                  },
                                  dataType: "json",
                                  success: function(data) {
                                    if (data.success) {
                                      $(
                                        'textarea[name="cotizacion[condiciones][notas]"]'
                                      ).val(input_data.observaciones);
                                      $(
                                        'textarea[name="cotizacion[condiciones][no_incluye]"]'
                                      ).val(input_data.no_incluye);

                                      var sid = "";
                                      $.each($.cookie(), function(clave, valor) {
                                        if (
                                          clave == hash &&
                                          valor.match(/UNABASE/g)
                                        )
                                          sid = valor;
                                      });
                                      var url =
                                        nodeUrl +
                                        "/download/?download=true&entity=carta_cliente&id=" +
                                        params.data().id +
                                        "&folio=" +
                                        (typeof $("section.sheet").data(
                                          "index"
                                        ) != "undefined"
                                          ? $("section.sheet").data("index")
                                          : "S/N") +
                                        "&sid=" +
                                        unaBase.sid.encoded() +
                                        "&preview=false&nullified=" +
                                        params.data().readonly +
                                        "&template=" +
                                        formato_impresion_cotizacion +
                                        "&aliasfiles=" +
                                        file_name_oficial_cot +
                                        "&hostname=" +
                                        window.location.origin;

                                      downloadUrl(url);
                                      if (params.entity == "Cotizacion")
                                        unaBase.log.save(
                                          "Ha descargado carta cliente desde " +
                                            etiqueta_cotizacion,
                                          "cotizaciones",
                                          $("section.sheet").data("index")
                                        );
                                      else
                                        unaBase.log.save(
                                          "Ha descargado carta cliente desde " +
                                            etiqueta_negocio,
                                          "negocios",
                                          $("section.sheet").data("index")
                                        );
                                    } else {
                                      toastr.error(
                                        "No fue posible descargar carta cliente. El registro está bloqueado."
                                      );
                                    }
                                  }
                                });
                              }
                            });
                          } else
                            toastr.error(
                              "No es posible descargar carta cliente. El registro está bloqueado."
                            );

                        }
                        
                          saveAction();
                      });
                  } else {
                    htmlObject.find("button.carta").remove();
                  }

                  htmlObject
                    .find("button.download")
                    .button({
                      name: "download",
                      icons: {
                        primary: "ui-icon-circle-arrow-s"
                      },
                      caption: "Descargar"
                    })
                    .click(function() {
                      //if ($('[data-name="share"]').data('is-saved')) {
                      
                         
                        unaBase.save.callback = () => {
                          var continueAction = function() {
                            var sid = "";
                            $.each($.cookie(), function(clave, valor) {
                              if (clave == hash && valor.match(/UNABASE/g))
                                sid = valor;
                            });
    
                            var url =
                              nodeUrl +
                              "/download/?download=true&entity=cotizaciones&id=" +
                              params.data().id +
                              "&folio=" +
                              (typeof $("section.sheet").data("index") !=
                              "undefined"
                                ? $("section.sheet").data("index")
                                : "S/N") +
                              "&sid=" +
                              unaBase.sid.encoded() +
                              "&preview=false&nullified=" +
                              params.data().readonly +
                              "&template=" +
                              formato_impresion_cotizacion +
                              "&aliasfiles=" +
                              file_name_oficial_cot +
                              "&hostname=" +
                              window.location.origin;
    
                            if (pdf.microservice) {
                              console.warn("from microservice");
    
                              axios(url).then(res => {
                                // console.log(res);
                                axios
                                  .post(
                                    pdf.url,
                                    {
                                      url: res.data.url,
                                      fileName: res.data.fileName
                                    },
                                    {
                                      headers: {
                                        Authorization: pdf.apiKey
                                      }
                                    }
                                  )
                                  .then(resp => {
                                    downloadUrl(resp.data.pdf);
                                  })
                                  .catch(err => {
                                    console.error(err);
                                  });
                              });
                            } else {
                              console.warn("from plugins");
                              downloadUrl(url);
                            }
                            if (params.entity == "Cotizacion")
                              unaBase.log.save(
                                "Ha descargado en PDF " + etiqueta_cotizacion,
                                "cotizaciones",
                                $("section.sheet").data("index")
                              );
                            else
                              unaBase.log.save(
                                "Ha descargado en PDF " + etiqueta_negocio,
                                "negocios",
                                $("section.sheet").data("index")
                              );
                          };
    
                          // Se verifica si el PDF es válido antes de mostrarlo
                          // (total neto == suma_subtotales)
                          if (
                            params.entity == "Cotizacion" ||
                            params.entity == "Negocios"
                          ) {
                            var valid, hidden_items;
                            $.ajax({
                              url: "/4DACTION/_V3_checkCotizacionPdf",
                              data: {
                                id: $("section.sheet").data("id")
                              },
                              dataType: "json",
                              async: false,
                              success: function(data) {
                                valid = data.valid;
                                hidden_items = data.hidden_items;
                              }
                            });
                            if (!valid) {
                              switch (params.entity) {
                                case "Cotizacion":
                                  var modulo = etiqueta_cotizacion;
                                  break;
                                case "Negocios":
                                  var modulo = etiqueta_negocio;
                                  break;
                              }
                              if (hidden_items) {
                                confirm(
                                  "Existen ítems ocultos con precio unitario mayor a 0. ¿Desea generar PDF de todos modos?"
                                ).done(function(data) {
                                  if (data) {
                                    unaBase.log.save(
                                      "Ha generado PDF con ítems ocultos que tienen precio unitario mayor a 0",
                                      "cotizaciones",
                                      $("section.sheet").data("index")
                                    );
                                    continueAction();
                                  }
                                });
                              } else {
                                //toastr.error('No es posible descargar PDF. Existen diferencias en ' + modulo + '. Por favor revisar.');
                                continueAction();
                              }
                              return false;
                            } else {
                              continueAction();
                            }
                          }
    
                          //} else
                          //  toastr.error('No es posible descargar PDF. El registro está bloqueado.');

                        }
                          saveAction();
                    });
                  var target = htmlObject;
                  htmlObject
                    .find("button.email")
                    .button({
                      name: "email",
                      icons: {
                        primary: "ui-icon-mail-closed"
                      },
                      caption: "Enviar por email"
                    })
                    .click(function() {
                      unaBase.save.callback = () => {
                        if (
                          params.entity == "Cotizacion" ||
                          params.entity == "Negocios"
                        ) {
                          var valid, hidden_items;
                          $.ajax({
                            url: "/4DACTION/_V3_checkCotizacionPdf",
                            data: {
                              id: $("section.sheet").data("id")
                            },
                            dataType: "json",
                            async: false,
                            success: function(data) {
                              valid = data.valid;
                              hidden_items = data.hidden_items;
                            }
                          });
                          if (!valid) {
                            switch (params.entity) {
                              case "Cotizacion":
                                var modulo = etiqueta_cotizacion;
                                break;
                              case "Negocios":
                                var modulo = etiqueta_negocio;
                                break;
                            }
                            if (hidden_items) {
                              toastr.error(
                                "No es posible enviar " +
                                  modulo +
                                  " por email. Existen diferencias debido a que hay ítems ocultos con precio unitario mayor a 0. Por favor revisar."
                              );
                            } else {
                              toastr.error(
                                "No es posible envar " +
                                  modulo +
                                  " por email. Existen diferencias en " +
                                  modulo +
                                  ". Por favor revisar."
                              );
                            }
                            return false;
                          }
                        }

                        var sendCotizacionByEmail = function(address) {
                          var sid = "";
                          $.each($.cookie(), function(clave, valor) {
                            if (clave == hash && valor.match(/UNABASE/g))
                              sid = valor;
                          });

                          var index =
                            typeof $("section.sheet").data("index") != "undefined"
                              ? $("section.sheet").data("index")
                              : "S/N";
                          var text = (typeof $(
                            '[name="cotizacion[titulo][text]"]'
                          ).val() == "undefined"
                            ? $(
                                "section.sheet > footer:nth-of-type(1) > article:nth-of-type(1) > h2 > span:nth-of-type(2)"
                              ).text()
                            : $('[name="cotizacion[titulo][text]"]').val()
                          ).capitalizeAllWords();
                          var sender = $("html > body.home > aside > div > div > h1")
                            .text()
                            .capitalizeAllWords();
                          var from_name = $("html > body.home > aside > div > div > h1")
                            .text()
                            .capitalizeAllWords();
                          var sendMsg = function(
                            document,
                            index,
                            text,
                            senderName
                          ) {
                            var retval;
                            $.ajax({
                              url: "/v3/views/cotizaciones/email.shtml",
                              dataType: "html",
                              async: false,
                              success: function(data) {
                                retval = $("<div>").html(data);
                              }
                            });
                            retval.find("[data-document]").html(document);
                            retval.find("[data-index]").html(index);
                            retval.find("[data-text]").html(text);
                            retval.find("[data-sender-name]").html(senderName);
                            retval.find("[data-from-name]").html(from_name);
                            var now = new Date();
                            retval
                              .find("[data-date]")
                              .html(
                                now.getDate() +
                                  "-" +
                                  (now.getMonth() + 1) +
                                  "-" +
                                  now.getFullYear()
                              );
                            retval
                              .find("[data-time]")
                              .html(
                                ("0" + now.getHours()).slice(-2) +
                                  ":" +
                                  ("0" + now.getMinutes()).slice(-2) +
                                  ":" +
                                  ("0" + now.getSeconds()).slice(-2)
                              );
                            return retval.html();
                          };
                          var msg = sendMsg("Cotización", index, text, sender);
                          var attachments = [
                            {
                              cid: "logo.png",
                              url:
                                "http://" +
                                window.location.hostname +
                                ":" +
                                window.location.port +
                                "/v3/design/html/body.menu/nav/h1.png"
                            },
                            {
                              cid: "empresa.jpg",
                              url:
                                "http://" +
                                window.location.hostname +
                                ":" +
                                window.location.port +
                                "/4DACTION/logo_empresa_web"
                            }
                          ];
                          unaBase.ui.block();
                          $.ajax({
                            url:
                              nodeUrl +
                              "/send/",
                            data: {
                              download: true,
                              entity: "cotizaciones",
                              id: params.data().id,
                              folio: index,
                              document: "Cotización",
                              text: text,
                              sid: sid,
                              email: address,
                              //preview: target.find('[name="draft"]').val(),
                              preview: false,
                              nullified: params.data().readonly,
                              sender: sender,
                              msg: msg,
                              attachments: JSON.stringify(attachments),
                              from: $("html > body.menu.home > aside > div > div > h1").data(
                                "email"
                              ),
                              username: $(
                                "html > body.menu.home > aside > div > div > h1"
                              ).data("username"),
                              aliasfiles: file_name_oficial_cot
                            },
                            type: "GET",
                            dataType: "jsonp",
                            success: function(data) {
                              unaBase.ui.unblock();
                              if (data.status) {
                                toastr.info(
                                  sprintf(
                                    NOTIFY.get("SUCCESS_EMAIL_SEND"),
                                    address
                                  )
                                );
                                unaBase.log.save(
                                  "Ha enviado " +
                                    etiqueta_cotizacion +
                                    " por email a " +
                                    address,
                                  "cotizaciones",
                                  index
                                );
                              } else {
                                toastr.error(
                                  "No se ha podido enviar el email. No hay servidores de correo disponibles. Detalle: " +
                                    data.error.code
                                );
                                console.log(data.error);
                              }
                            },
                            error: function(data) {
                              unaBase.ui.unblock();
                              toastr.error(
                                sprintf(NOTIFY.get("ERROR_INTERNAL"), address)
                              );
                            }
                          });
                        };

                        var email =
                          typeof $(
                            '[name="cotizacion[empresa][contacto][email]"]'
                          ).val() != "undefined"
                            ? $(
                                '[name="cotizacion[empresa][contacto][email]"]'
                              ).val()
                            : "";
                        if (email != "") {
                          confirm(
                            sprintf(
                              MSG.get("CONFIRM_COTIZACION_SEND_CONTACT"),
                              email
                            ),
                            email,
                            "Otro contacto"
                          ).done(function(data) {
                            if (data) {
                              sendCotizacionByEmail(email);
                            } else {
                              var htmlObject = $(
                                '<section> \
  														<span>Ingrese la dirección de email</span> \
  														<form autocomplete="on" target="the_iframe" action="about:blank"> \
  															<input style="border-bottom: 1px solid black;" required type="email" name="email"> \
  														</form> \
  														<iframe style="display: none;" id="the_iframe" name="the_iframe" src="about:blank"></iframe> \
  													</section>'
                              );
                              htmlObject
                                .find("input")
                                .on("blur change", function() {
                                  htmlObject.data("response", $(this).val());
                                  htmlObject.find("form")[0].submit();
                                });
                              prompt(htmlObject).done(function(data) {
                                if (data !== false) {
                                  htmlObject.find("form")[0].submit();
                                  sendCotizacionByEmail(data);
                                }
                              });
                            }
                          });
                        } else {
                          var htmlObject = $(
                            '<section> \
  												<span>Ingrese la dirección de email</span> \
  												<form autocomplete="on" target="the_iframe" action="about:blank"> \
  													<input style="border-bottom: 1px solid black;" required type="email" name="email"> \
  												</form> \
  												<iframe style="display: none;" id="the_iframe" name="the_iframe" src="about:blank"></iframe> \
  											</section>'
                          );
                          htmlObject.find("input").on("blur change", function() {
                            htmlObject.data("response", $(this).val());
                          });
                          prompt(htmlObject).done(function(data) {
                            if (data !== false) {
                              htmlObject.find("form")[0].submit();
                              sendCotizacionByEmail(data);
                            }
                          });
                        }

                      }

                          saveAction();
                    });

                  htmlObject
                    .find("button.export")
                    .button({
                      name: "export",
                      icons: {
                        primary: "ui-icon-document"
                      },
                      caption: "Exportar"
                    })
                    .click(function() {
                      unaBase.save.callback = () => {
                        if (
                          params.entity == "Cotizacion" ||
                          params.entity == "Negocios"
                        ) {
                          var valid, hidden_items;
                          $.ajax({
                            url: "/4DACTION/_V3_checkCotizacionPdf",
                            data: {
                              id: $("section.sheet").data("id")
                            },
                            dataType: "json",
                            async: false,
                            success: function(data) {
                              valid = data.valid;
                              hidden_items = data.hidden_items;
                            }
                          });
                          if (!valid) {
                            switch (params.entity) {
                              case "Cotizacion":
                                var modulo = etiqueta_cotizacion;
                                break;
                              case "Negocios":
                                var modulo = etiqueta_negocio;
                                break;
                            }
                            if (hidden_items) {
                              toastr.error(
                                "No es posible exportar " +
                                  modulo +
                                  ". Existen diferencias debido a que hay ítems ocultos con precio unitario mayor a 0. Por favor revisar."
                              );
                            } else {
                              toastr.error(
                                "No es posible exportar " +
                                  modulo +
                                  ". Existen diferencias en " +
                                  modulo +
                                  ". Por favor revisar."
                              );
                            }
                            return false;
                          }
                        }

                        //var url = 'http://desarrollo.unabase.cl:3000/download/?download=true&entity=cotizaciones&id=' + params.data().id + '&folio=' + ((typeof params.data().index != 'undefined')? params.data().index : 'S/N')+ '&sid=' + unaBase.sid.encoded() + '&preview=' + ((htmlObject.find('[name="draft"]').prop('checked'))? 'true' : 'false') + '&nullified=' + params.data().readonly;
                        var sid = "";
                        $.each($.cookie(), function(clave, valor) {
                          if (clave == hash && valor.match(/UNABASE/g))
                            sid = valor;
                        });

                        var url =
                         nodeUrl +
                          "/export-cotizacionexcel/?download=true&entity=cotizaciones&id=" +
                          params.data().id +
                          "&folio=" +
                          (typeof $("section.sheet").data("index") != "undefined"
                            ? $("section.sheet").data("index")
                            : "S/N") +
                          "&sid=" +
                          unaBase.sid.encoded() +
                          "&preview=false&nullified=" +
                          params.data().readonly +
                          "&hostname=" +
                          window.location.origin;
                        var download = window.open(url).blur();

                        unaBase.log.save(
                          "Ha descargado excel cliente",
                          "cotizaciones",
                          $("section.sheet").data("index")
                        );

                        window.focus();
                        download.close();

                      }

                          saveAction();
                    });

                  if (
                    params.entity == "Cotizacion" ||
                    params.entity == "Negocios"
                  ) {
                    htmlObject.find("button").click(function() {
                      //if (target.find('[name="draft"]').val() == 'false')
                      $.ajax({
                        url: "/4DACTION/_V3_setVersionByCotizacion",
                        data: {
                          id: $("section.sheet").data("id")
                        },
                        dataType: "json",
                        success: function(data) {
                          if (data.success && data.unique) {
                            toastr.info(NOTIFY.get("INFO_COTIZACION_VERSION"));
                            $("#version").html(data.index);
                          }
                        }
                      });
                    });
                  }
                  return htmlObject;
                },
                interactive: true,
                interactiveTolerance: 3000
                //trigger: 'click'
              });
              $(this).tooltipster("show");
            }
          });

        if ($.inArray("share_oc", params.buttons) != -1)
          buttons.push({
            name: "share_oc",
            icons: {
              primary: "ui-icon-extlink",
              secondary: "ui-icon-triangle-1-s"
            },
            caption: "Compartir",
            action: function() {
              $(this).tooltipster({
                content: function() {
                  var htmlObject = $(
                    ' \
										<fieldset> \
											<legend style="display: none;">¿Cómo desea obtenerla?</legend> \
											<button class="download">Descargar PDF</button> \
											<button class="email">Enviar por email</button> \
										</fieldset> \
									'
                  );

                  htmlObject.find("button").click(function(event) {
                    var saved = menu
                      .find('[data-name="save"] button')
                      .triggerHandler("click");
                    if (!saved.success) event.stopImmediatePropagation();
                  });

                  var aliasfilesGastos = "";
                  if (compras.tipoGasto == "FXR") {
                    aliasfilesGastos = file_name_oficial_fxr;
                  } else {
                    aliasfilesGastos = file_name_oficial_oc;
                  }

                  htmlObject
                    .find("button.download")
                    .button({
                      name: "download",
                      icons: {
                        primary: "ui-icon-circle-arrow-s"
                      },
                      caption: "Descargar"
                    })
                    .click(function() {
                      //unaBase.ui.block();

                      var sid = "";
                      $.each($.cookie(), function(clave, valor) {
                        if (clave == hash && valor.match(/UNABASE/g))
                          sid = valor;
                      });

                      var id = $.unserialize(params.data()).id;
                      var folio = $.unserialize(params.data()).folio;
                      if (folio == "") {
                        folio = $("#sheet-compras").data("index");
                      }

                      var url =
                       nodeUrl +
                        "/download/?download=true&entity=compras&entitytwo=" +
                        compras.tipoGasto +
                        "&id=" +
                        id +
                        "&folio=" +
                        (typeof folio != "undefined" ? folio : "S/N") +
                        "&sid=" +
                        unaBase.sid.encoded() +
                        "&preview=false&nullified=" +
                        params.data().readonly +
                        "&aliasfiles=" +
                        aliasfilesGastos +
                        "&hostname=" +
                        window.location.origin;

                      if (pdf.microservice) {
                        // console.warn(url);

                        axios(url).then(res => {
                          // console.log(res);
                          axios
                            .post(
                              pdf.url,
                              {
                                url: res.data.url,
                                fileName: res.data.fileName
                              },
                              {
                                headers: {
                                  Authorization: pdf.apiKey
                                }
                              }
                            )
                            .then(resp => {
                              downloadUrl(resp.data.pdf);
                            })
                            .catch(err => {
                              console.error(err);
                            });
                        });
                      } else {
                        downloadUrl(url);
                      }
                      // downloadUrl(url);

                      // unaBase.log.save('Ha descargado en PDF el gasto', 'gastos', index);
                      compras.saveLogsFromWeb({
                        id: compras.id,
                        folio: compras.folio,
                        descripcion: "Ha descargado en PDF el gasto",
                        modulo: "gastos",
                        descripcion_larga: ""
                      });

                      // unaBase.ui.unblock();
                    });
                  var target = htmlObject;
                  htmlObject
                    .find("button.email")
                    .button({
                      name: "email",
                      icons: {
                        primary: "ui-icon-mail-closed"
                      },
                      caption: "Enviar por email"
                    })
                    .click(function() {
                      var sendCotizacionByEmail = function(address) {
                        unaBase.ui.block();

                        var sid = "";
                        $.each($.cookie(), function(clave, valor) {
                          if (clave == hash && valor.match(/UNABASE/g))
                            sid = valor;
                        });

                        var index = $("#sheet-compras")
                          .data("index")
                          .capitalizeAllWords();
                        var text = $('input[name="oc[referencia]"]')
                          .val()
                          .capitalizeAllWords();
                        var sender = $("html > body.home > aside > div > div > h1")
                          .text()
                          .capitalizeAllWords();
                        var sendMsg = function(
                          document,
                          index,
                          text,
                          senderName
                        ) {
                          var retval;
                          $.ajax({
                            url: "/v3/views/compras/email.shtml",
                            dataType: "html",
                            async: false,
                            success: function(data) {
                              retval = $("<div>").html(data);
                            }
                          });
                          retval.find("[data-document]").html(document);
                          retval.find("[data-index]").html(index);
                          retval.find("[data-text]").html(text);
                          retval.find("[data-sender-name]").html(senderName);
                          return retval.html();
                        };

                        var documents = "";
                        if (compras.tipoGasto == "FXR") {
                          documents = "Rendición de fondos";
                        } else {
                          documents = "Orden de compra";
                        }

                        var msg = sendMsg(documents, index, text, sender);
                        var attachments = [
                          {
                            cid: "logo.png",
                            url:
                              "http://" +
                              window.location.hostname +
                              ":" +
                              window.location.port +
                              "/v3/design/html/body.menu/nav/h1.png"
                          },
                          {
                            cid: "empresa.jpg",
                            url:
                              "http://" +
                              window.location.hostname +
                              ":" +
                              window.location.port +
                              "/4DACTION/logo_empresa_web"
                          }
                        ];

                        $.ajax({
                          url:
                           nodeUrl +
                            "/send/",
                          data: {
                            download: true,
                            entity: "compras",
                            entitytwo: compras.tipoGasto,
                            id: $.unserialize(params.data()).id,
                            folio: index,
                            document: documents,
                            text: text,
                            sid: sid,
                            email: address,
                            preview: false,
                            nullified: params.data().readonly,
                            sender: sender,
                            msg: msg,
                            attachments: JSON.stringify(attachments),
                            from: $("html > body.menu.home > aside > div > div > h1").data(
                              "email"
                            ),
                            username: $(
                              "html > body.menu.home > aside > div > div > h1"
                            ).data("username"),
                            aliasfiles: aliasfilesGastos
                          },
                          type: "GET",
                          dataType: "jsonp",
                          success: function(data) {
                            unaBase.ui.unblock();
                            toastr.success(
                              sprintf(NOTIFY.get("SUCCESS_EMAIL_SEND"), address)
                            );
                            // unaBase.log.save('Ha enviado por email el gasto', 'gastos', index);
                            compras.saveLogsFromWeb({
                              id: compras.id,
                              folio: compras.folio,
                              descripcion:
                                "Ha compartido el gasto vía email a la dirección: " +
                                address,
                              modulo: "gastos",
                              descripcion_larga: ""
                            });
                          },
                          error: function(data) {
                            unaBase.ui.unblock();
                            toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                          }
                        });
                      };

                      var emailProveedor = "";
                      var emailRelacionado = "";
                      var emailProveedor = $.trim(
                        $("#sheet-compras")
                          .find('input[name="contacto[info][email]"]')
                          .val()
                      );
                      var emailRelacionado = $.trim(
                        $("#sheet-compras")
                          .find('input[name="relacionado[info][email]"]')
                          .val()
                      );

                      var email = "";
                      if (emailProveedor != "") {
                        email = emailProveedor;
                      } else {
                        if (emailRelacionado != "" && email == "") {
                          email = emailRelacionado;
                        }
                      }

                      var labelContacto = "contacto";
                      if (compras.tipoGasto == "FXR") {
                        labelContacto = "solicitante";
                      } else {
                        labelContacto = "proveedor";
                      }

                      if (email != "") {
                        emailProveedor = emailProveedor.toLowerCase();
                        emailRelacionado = emailRelacionado.toLowerCase();
                        var button = "Enviar a: " + email.toLowerCase();
                        confirm(
                          'Se encontró el siguiente email: <strong style="font-weight:bold!important">' +
                            email.toLowerCase() +
                            "</strong>",
                          button,
                          "Enviar a otro email"
                        ).done(function(data) {
                          if (data) {
                            sendCotizacionByEmail(email);
                          } else {
                            /*var htmlObject = $('<section> \
														<span>Por favor ingrese una dirección: </span> \
														<input required type="email" style="border-bottom:solid 1px!important;width:300px" name="email"> \
														<div style="margin:5px"><br><input type="checkbox" name="default"> Dejar email por defecto.</div> \
													</section>');*/
                            var htmlObject = $(
                              '<section> \
														<span>Ingrese la dirección de email</span> \
														<form autocomplete="on" target="the_iframe" action="about:blank"> \
															<input style="border-bottom: 1px solid black;" required type="email" name="email"> \
														</form> \
														<iframe style="display: none;" id="the_iframe" name="the_iframe" src="about:blank"></iframe> \
													</section>'
                            );

                            htmlObject
                              .find('input[name="email"]')
                              .on("blur change", function() {
                                htmlObject.data("response", $(this).val());
                                htmlObject
                                  .find("input")
                                  .css("background-color", "white");
                              });

                            prompt(htmlObject).done(function(data) {
                              if (data !== false && data !== "") {
                                htmlObject.find("form")[0].submit();
                                sendCotizacionByEmail(data);
                                if (
                                  htmlObject
                                    .find('input[name="default"]')
                                    .prop("checked")
                                ) {
                                  unaBase.contacto.set({
                                    id: $("#sheet-compras")
                                      .find('input[name="contacto[info][id]"]')
                                      .val(),
                                    email: htmlObject
                                      .find('input[name="email"]')
                                      .val(),
                                    cliprov: "PROVEEDOR",
                                    tipo: "PERSONA",
                                    labelMsg: labelContacto
                                  });
                                  $("#sheet-compras")
                                    .find('input[name="contacto[info][email]"]')
                                    .val(
                                      htmlObject
                                        .find('input[name="email"]')
                                        .val()
                                    );
                                }
                              }
                            });
                          }
                        });
                      } else {
                        var htmlObject = $(
                          "<section> \
												<span>No existe email asociado al " +
                            labelContacto +
                            '. Por favor ingrese una dirección: </span> \
												<input required type="email" style="border-bottom:solid 1px!important;width:300px" name="email"> \
												<div style="margin:5px"><br><input type="checkbox" name="default"> Dejar email por defecto.</div> \
											</section>'
                        );

                        htmlObject
                          .find('input[name="email"]')
                          .on("blur change", function() {
                            htmlObject.data("response", $(this).val());
                            htmlObject
                              .find("input")
                              .css("background-color", "white");
                          });

                        prompt(htmlObject).done(function(data) {
                          if (data !== false && data !== "") {
                            sendCotizacionByEmail(data);
                            if (
                              htmlObject
                                .find('input[name="default"]')
                                .prop("checked")
                            ) {
                              unaBase.contacto.set({
                                id: $("#sheet-compras")
                                  .find('input[name="contacto[info][id]"]')
                                  .val(),
                                email: htmlObject
                                  .find('input[name="email"]')
                                  .val(),
                                cliprov: "PROVEEDOR",
                                tipo: "PERSONA",
                                labelMsg: labelContacto
                              });
                              $("#sheet-compras")
                                .find('input[name="contacto[info][email]"]')
                                .val(
                                  htmlObject.find('input[name="email"]').val()
                                );
                            }
                          }
                        });
                      }
                    });
                  return htmlObject;
                },
                interactive: true,
                interactiveTolerance: 5000,
                trigger: "click"
              });
              $(this).tooltipster("show");
            }
          });

        if ($.inArray("template", params.buttons) != -1)
          buttons.push({
            name: "template",
            icon: "ui-icon-star",
            caption: "Usar como plantilla",
            action: function(event) {
              var success = false;
              if (params.validate()) {
                var htmlObject = $(
                  '<section> \
									<span>Ingrese el nombre de la plantilla</span> \
									<input type="text" name="nombre"> \
								</section>'
                );

                htmlObject.find("input").change(function() {
                  htmlObject.data("response", $(this).val());
                });

                prompt(htmlObject).done(function(data) {
                  if (data !== false) {
                    $.ajax({
                      url: "/4DACTION/_V3_clone" + params.entity,
                      type: "POST",
                      dataType: "json",
                      data: {
                        id: $("section.sheet").data("id"),
                        index: -1, // Index -1 especifica template
                        text: data
                      },
                      async: false // para poder hacer el save correctamente y esperar la respuesta
                    }).done(function(data) {
                      success = data.success;
                      if (data.success) {
                        switch (params.entity) {
                          case "Cotizacion":
                            toastr.success(NOTIFY.get("SUCCESS_SAVE_TEMPLATE"));
                            $("#index").html("Plantilla");
                            break;
                          case "Negocios":
                            toastr.success(NOTIFY.get("SUCCESS_SAVE_TEMPLATE"));
                            break;
                        }
                      } else toastr.error(NOTIFY.get("ERROR_RECORD_READONLY", "Error"));
                    });
                  }
                });
              } else toastr.error(NOTIFY.get("ERROR_DATA", "Faltan datos"));
              return { success: success };
            }
          });

        /* BEGIN: exportar en Excel */
        if ($.inArray("export", params.buttons) != -1)
          buttons.push({
            name: "export",
            icon: "ui-icon-calculator",
            caption: "Exportar resumen",
            action: function() {
              var sid = "";
              $.each($.cookie(), function(clave, valor) {
                if (clave == hash && valor.match(/UNABASE/g)) sid = valor;
              });
              var modulo = $("html > body.menu.home > aside > div > div > ul > li.active")
                .data("name")
                .toUpperCase();
                
              if (modulo == "COTIZACIONES") {
                var url =
                  nodeUrl +
                  "/export-cotizacion/?download=true&entity=cotizaciones&id=" +
                  $("section.sheet").data("id") +
                  "&folio=" +
                  ($("section.sheet").data("index") > 0
                    ? $("section.sheet").data("index")
                    : "S/N") +
                  "&sid=" +
                  unaBase.sid.encoded() +
                  "&preview=false&nullified=" +
                  $("section.sheet").data("readonly") +
                  "&hostname=" +
                  window.location.origin;
                unaBase.log.save(
                  "Ha exportado " + etiqueta_cotizacion,
                  "cotizaciones",
                  $("#main-container").data("index")
                );
              }
              if (modulo == "NEGOCIOS") {
                var url =
                  nodeUrl +
                  "/export-negocio/?download=true&entity=cotizaciones&id=" +
                  $("section.sheet").data("id") +
                  "&folio=" +
                  ($("#main-container").data("index") > 0
                    ? $("#main-container").data("index")
                    : "S/N") +
                  "&sid=" +
                  unaBase.sid.encoded() +
                  "&preview=false&nullified=" +
                  $("section.sheet").data("readonly") +
                  "&hostname=" +
                  window.location.origin +
                  "&presupuestos=false";
                unaBase.log.save(
                  "Ha exportado " + etiqueta_negocio,
                  "negocios",
                  $("#main-container").data("index")
                );
              }

              if (modulo == "PRESUPUESTOS") {
                var url =
                  nodeUrl +
                  "/export-negocio/?download=true&entity=cotizaciones&id=" +
                  $("section.sheet").data("id") +
                  "&folio=" +
                  ($("#main-container").data("index") > 0
                    ? $("#main-container").data("index")
                    : "S/N") +
                  "&sid=" +
                  unaBase.sid.encoded() +
                  "&preview=false&nullified=" +
                  $("section.sheet").data("readonly") +
                  "&hostname=" +
                  window.location.origin +
                  "&presupuestos=true";
                unaBase.log.save(
                  "Ha exportado presupuesto",
                  "presupuestos",
                  $("#main-container").data("index")
                );
              }

              if (modulo == "CategoriasReporte") {
                var url =
                  nodeUrl +
                  "/export-reporte/?download=true&entity=cotizaciones&id=" +
                  $("section.sheet").data("id") +
                  "&sid=" +
                  unaBase.sid.encoded() +
                  "&preview=false&nullified=" +
                  $("section.sheet").data("readonly") +
                  "&hostname=" +
                  "&hostname=" +
                  window.location.origin;
                unaBase.log.save(
                  "Ha exportado " + etiqueta_negocio,
                  "negocios",
                  $("#container-reportes").data("categoria")
                );
              }
              var download = window.open(url).blur();
              window.focus();
              download.close();
            }
          });

        /* BEGIN: informe resumen */
        if ($.inArray("report", params.buttons) != -1)
          buttons.push({
            name: "report",
            icon: "ui-icon-document-b",
            caption: "Informe resumen",
            action: function() {
              var sid = "";
              $.each($.cookie(), function(clave, valor) {
                if (clave == hash && valor.match(/UNABASE/g)) sid = valor;
              });
              var modulo = $("html > body.menu.home > aside > div > div > ul > li.active")
                .data("name")
                .toUpperCase();

              if (modulo == "NEGOCIOS") {
                var url =
                  nodeUrl +
                  "/download/?download=true&entity=report&id=" +
                  params.data().id +
                  "&folio=" +
                  (typeof $("section.sheet").data("index") != "undefined"
                    ? $("section.sheet").data("index")
                    : "S/N") +
                  "&sid=" +
                  unaBase.sid.encoded() +
                  "&preview=false&nullified=" +
                  params.data().readonly +
                  "&template=" +
                  formato_impresion_cotizacion +
                  "&aliasfiles=" +
                  file_name_oficial_cot +
                  "&hostname=" +
                  window.location.origin;
                //unaBase.log.save('Ha exportado ' + etiqueta_negocio, 'negocios', $('#main-container').data('index'));
              }

              var download = window.open(url).blur();
              window.focus();
              download.close();
            }
          });

        /* BEGIN: exportar en Excel reportes */
        if ($.inArray("export_reporte", params.buttons) != -1)
          buttons.push({
            name: "export_reporte",
            icon: "ui-icon-calculator",
            caption: "Exportar reporte",
            action: function() {
              if ($("table.items.reportes tbody > *").length) {
                
                var reporte = params.entity;
                var url = "";

                //--ini-- agreago para enviar datos de las areas en los filtros, 28-11-18, gin
                if (reporte == "VentasClienteReporte") {
                  var filters = "";
                  var searchFields = $.param(
                    unaBase.toolbox.search.advancedFilter
                  );
                  var area_negocio = $.unserialize(searchFields).area_negocio;

                  var serialFields = $("#search").serializeAnything();
                  if (
                    area_negocio != "" &&
                    typeof area_negocio != "undefined"
                  ) {
                    filters = serialFields + "&area_negocio=" + area_negocio;
                  } else {
                    filters = serialFields;
                  }
                } else {
                  var filters = $("#search").serializeAnything(true);
                  //var filters = $.param(unaBase.toolbox.search.advancedFilter);
                }
                //--ini-- agreago para enviar datos de las areas en los filtros, 28-11-18, gin

                url =
                  nodeUrl +
                  "/export-reporte-excel/?download=true&sid=" +
                  unaBase.sid.encoded() +
                  "&entity=" +
                  reporte +
                  "&" +
                  filters +
                  "&hostname=" +
                  window.location.origin;
                var download = window.open(url).blur();
                window.focus();
                download.close();
              } else {
                toastr.warning("No hay datos para exportar.");
              }
            }
          });

        if ($.inArray("export_compras_pe", params.buttons) != -1)
          buttons.push({
            name: "export",
            icon: "ui-icon-calculator",
            caption: "Exportar registro de compras",
            action: function() {
              var sid = "";
              $.each($.cookie(), function(clave, valor) {
                if (clave == hash && valor.match(/UNABASE/g)) sid = valor;
              });
              var modulo = $("html > body.menu.home > aside > div > div > ul > li.active")
                .data("name")
                .toUpperCase();
              var url = "";
              var filters = $("#search").serializeAnything(true);

              // --ini-- corrección para enviar parametro de orden a nodejs y exportar segun orden lista
              var sortParams = {};
              $("#viewport")
                .find("table.results > thead > tr > th")
                .each(function() {
                  if (typeof $(this).data("sort-order") != "undefined") {
                    sortParams = {
                      sort_by: $(this).data("sort-by"),
                      sort_order: $(this).data("sort-order")
                    };
                    return false;
                  }
                });
              filters += "&" + jQuery.param(sortParams);
              // --fin-- corrección para enviar parametro de orden a nodejs y exportar segun orden lista

              // elements blocked in the list
              var blockedElement = 0;

              url = `${nodeUrl}/export-registro-compras-pe/?download=true&sid=${unaBase.sid.encoded()}&${filters}&hostname=${window.location.origin}`;
              unaBase.log.save(
                `Ha exportado el listado de registro de compras`
              );
              if (!blockedElement) {
                var download = window.open(url);
                download.blur();
                window.focus();
              }

            }
          });

         /* BEGIN: exportar listado cotizaciones + negocios */
        if ($.inArray("export_ventas_pe", params.buttons) != -1)
          buttons.push({
            name: "export",
            icon: "ui-icon-calculator",
            caption: "Exportar registro de ventas",
            action: function() {
              var sid = "";
              $.each($.cookie(), function(clave, valor) {
                if (clave == hash && valor.match(/UNABASE/g)) sid = valor;
              });
              var modulo = $("html > body.menu.home > aside > div > div > ul > li.active")
                .data("name")
                .toUpperCase();
              var url = "";
              var filters = $("#search").serializeAnything(true);

              // --ini-- corrección para enviar parametro de orden a nodejs y exportar segun orden lista
              var sortParams = {};
              $("#viewport")
                .find("table.results > thead > tr > th")
                .each(function() {
                  if (typeof $(this).data("sort-order") != "undefined") {
                    sortParams = {
                      sort_by: $(this).data("sort-by"),
                      sort_order: $(this).data("sort-order")
                    };
                    return false;
                  }
                });
              filters += "&" + jQuery.param(sortParams);
              // --fin-- corrección para enviar parametro de orden a nodejs y exportar segun orden lista

              // elements blocked in the list
              var blockedElement = 0;

              url = `${nodeUrl}/export-registro-ventas-pe/?download=true&sid=${unaBase.sid.encoded()}&${filters}&hostname=${window.location.origin}`;
              unaBase.log.save(
                `Ha exportado el listado de registro de ventas`
              );
              if (!blockedElement) {
                var download = window.open(url);
                download.blur();
                window.focus();
              }

            }
          });

         /* BEGIN: exportar listado cotizaciones + negocios */
        if ($.inArray("export_list_cot_consolidadoPE", params.buttons) != -1)
          buttons.push({
            name: "export_list_cot_consolidadoPE",
            icon: "ui-icon-calculator",
            caption: "Exportar a excel (consolidado)",
            action: function() {
              var sid = "";
              $.each($.cookie(), function(clave, valor) {
                if (clave == hash && valor.match(/UNABASE/g)) sid = valor;
              });
              var modulo = $("html > body.menu.home > aside > div > div > ul > li.active")
                .data("name")
                .toUpperCase();
              var url = "";
              var filters = $("#search").serializeAnything(true);

              // --ini-- corrección para enviar parametro de orden a nodejs y exportar segun orden lista
              var sortParams = {};
              $("#viewport")
                .find("table.results > thead > tr > th")
                .each(function() {
                  if (typeof $(this).data("sort-order") != "undefined") {
                    sortParams = {
                      sort_by: $(this).data("sort-by"),
                      sort_order: $(this).data("sort-order")
                    };
                    return false;
                  }
                });
              filters += "&" + jQuery.param(sortParams);
              // --fin-- corrección para enviar parametro de orden a nodejs y exportar segun orden lista

              // elements blocked in the list
              var blockedElement = 0;

              url = `${nodeUrl}/export-list-cot-consolidado/?download=true&sid=${unaBase.sid.encoded()}&${filters}&hostname=${window.location.origin}`;
              unaBase.log.save(
                `Ha exportado el listado de cotizaciones + negocios (consolidados proyectos)`
              );
              if (!blockedElement) {
                var download = window.open(url);
                download.blur();
                window.focus();
              }

            }
          });

        /* BEGIN: exportar listado negocios en Excel */
        if ($.inArray("export_list", params.buttons) != -1)
          buttons.push({
            name: "export",
            icon: "ui-icon-calculator",
            caption: "Exportar a excel",
            action: function() {
              var sid = "";
              $.each($.cookie(), function(clave, valor) {
                if (clave == hash && valor.match(/UNABASE/g)) sid = valor;
              });
              
              var modulo = $("html > body.menu.home > aside > div > div > ul > li.active")
                .data("name")
                .toUpperCase();
              var url = "";
              var filters = $("#search").serializeAnything(true);

              // --ini-- corrección para enviar parametro de orden a nodejs y exportar segun orden lista
              var sortParams = {};
              $("#viewport")
                .find("table.results > thead > tr > th")
                .each(function() {
                  if (typeof $(this).data("sort-order") != "undefined") {
                    sortParams = {
                      sort_by: $(this).data("sort-by"),
                      sort_order: $(this).data("sort-order")
                    };
                    return false;
                  }
                });
              filters += "&" + jQuery.param(sortParams);
              // --fin-- corrección para enviar parametro de orden a nodejs y exportar segun orden lista

              // elements blocked in the list
              var blockedElement = 0;

              switch (modulo) {
                case "NEGOCIOS":
                  // url =
                  //   "http://" +
                  //   nodejs_public_ipaddr +
                  //   ":" +
                  //   nodejs_port +
                  //   "/export-list-negocios/?download=true&sid=" +
                  //   unaBase.sid.encoded() +
                  //   "&" +
                  //   filters +
                  //   "&hostname=" +
                  //   window.location.origin;
                  url = `${nodeUrl}/export-list-negocios/?download=true&sid=${unaBase.sid.encoded()}&${filters}&hostname=${window.location.origin}`;
                  // unaBase.log.save(
                  //   "Ha exportado el listado de " + etiqueta_negocios,
                  //   "negocios"
                  // );
                  unaBase.log.save(
                    `Ha exportado el listado de ${etiqueta_negocios} negocios`
                  );
                  break;
                case "PRESUPUESTOS":
                  url =
                    nodeUrl +
                    "/export-list-presupuestos/?download=true&sid=" +
                    unaBase.sid.encoded() +
                    "&" +
                    filters +
                    "&hostname=" +
                    window.location.origin;
                  unaBase.log.save(
                    "Ha exportado el listado de presupuestos",
                    "presupuestos"
                  );
                  break;
                case "CONTACTOS":
                  url =
                    nodeUrl +
                    "/export-list-contactos/?download=true&sid=" +
                    unaBase.sid.encoded() +
                    "&" +
                    filters +
                    "&hostname=" +
                    window.location.origin;
                  unaBase.log.save(
                    "Ha exportado el listado de contactos",
                    "contactos"
                  );
                  break;
                case "GASTOS":
                  var ids = [];
                  if (
                    !$('#viewport input[name="selected_all"]').is(":checked")
                  ) {
                    $(
                      "#viewport tbody.ui-selectable tr[data-id] td:first-of-type input.selected:checked"
                    ).each(function() {
                      ids.push(
                        $(this)
                          .closest("tr")
                          .data("id")
                      );
                    });
                  }
                  url =
                    nodeUrl +
                    "/export-list-oc/?download=true&ids=" +
                    ids.join("|") +
                    "&tipo_gasto=OC&sid=" +
                    unaBase.sid.encoded() +
                    "&" +
                    filters +
                    "&hostname=" +
                    window.location.origin;
                  unaBase.log.save(
                    "Ha exportado el listado de órdenes de compra",
                    "gastos"
                  );
                  break;
                case "RENDICIONES":
                  url =
                    nodeUrl +
                    "/export-list-fxr/?download=true&tipo_gasto=FXR&sid=" +
                    unaBase.sid.encoded() +
                    "&" +
                    filters +
                    "&hostname=" +
                    window.location.origin;
                  unaBase.log.save(
                    "Ha exportado el listado de rendiciones",
                    "rendiciones"
                  );
                  break;
                case "EGRESOS":
                  url =
                    nodeUrl +
                    "/export-list-egresos/?download=true&sid=" +
                    unaBase.sid.encoded() +
                    "&" +
                    filters +
                    "&hostname=" +
                    window.location.origin;
                  unaBase.log.save(
                    "Ha exportado el listado de egresos",
                    "egresos"
                  );
                  break;
                case "INGRESOS":
                  url =
                    nodeUrl +
                    "/export-list-ingresos/?download=true&sid=" +
                    unaBase.sid.encoded() +
                    "&" +
                    filters +
                    "&hostname=" +
                    window.location.origin;
                  unaBase.log.save(
                    "Ha exportado el listado de ingresos",
                    "ingresos"
                  );
                  break;
                case "COTIZACIONES":
                  var trElement = $("tbody.ui-selectable tr");
                  for (var i = 0; i < trElement.length; i++) {
                    if (trElement[i].dataset.block == "true")
                      blockedElement += 1;
                  }
                  if (blockedElement > 0) {
                    alert(
                      "Se ha bloqueado la exportación a excel mientras hayan cotizaciones siendo editadas."
                    );
                  } else {
                    url =
                      nodeUrl +
                      "/export-list-cotizacion/?download=true&sid=" +
                      unaBase.sid.encoded() +
                      "&" +
                      filters +
                      "&hostname=" +
                      window.location.origin;
                    unaBase.log.save(
                      "Ha exportado el listado de " + etiqueta_cotizacion,
                      "cotizaciones"
                    );
                  }

                  break;
                case "USUARIOS":
                  url =
                    nodeUrl +
                    "/export-list-usuarios/?download=true&sid=" +
                    unaBase.sid.encoded() +
                    "&" +
                    filters +
                    "&hostname=" +
                    window.location.origin;
                  unaBase.log.save(
                    "Ha exportado el listado de usuarios",
                    "usuarios"
                  );
                  break;
                case "DTC":
                  var ids = [];
                  $(
                    "#viewport tbody.ui-selectable tr[data-id] td:first-of-type input.selected:checked"
                  ).each(function() {
                    ids.push(
                      $(this)
                        .closest("tr")
                        .data("id")
                    );
                  });
                  url =
                    nodeUrl +
                    "/export-list-dtc/?ids=" +
                    ids.join("|") +
                    "&download=true&sid=" +
                    unaBase.sid.encoded() +
                    "&" +
                    filters +
                    "&hostname=" +
                    window.location.origin;
                  unaBase.log.save("Ha exportado el listado de dtc", "dtc");
                  break;
                case "DTV":
                  url =
                    nodeUrl +
                    "/export-list-dtv/?download=true&sid=" +
                    unaBase.sid.encoded() +
                    "&" +
                    filters +
                    "&hostname=" +
                    window.location.origin;
                  unaBase.log.save("Ha exportado el listado de dtv", "dtv");
                  break;
                case "CATALOGO":
                  url =
                    nodeUrl +
                    "/export-list-catalogo/?download=true&sid=" +
                    unaBase.sid.encoded() +
                    "&" +
                    filters +
                    "&hostname=" +
                    window.location.origin;
                  unaBase.log.save(
                    "Ha exportado el listado de catálogo",
                    "catalogo"
                  );
                  break;
                case "FACTORING":
                  url =
                    nodeUrl +
                    "/export-list-factoring/?download=true&sid=" +
                    unaBase.sid.encoded() +
                    "&" +
                    filters +
                    "&hostname=" +
                    window.location.origin +
                    "&tipo_gasto=Factoring";
                  unaBase.log.save(
                    "Ha exportado el listado de factoring",
                    "factoring"
                  );
                  break;
                case "BANCO":
                  url =
                    nodeUrl +
                    "/export-list-banco/?download=true&sid=" +
                    unaBase.sid.encoded() +
                    "&" +
                    filters +
                    "&hostname=" +
                    window.location.origin;
                  unaBase.log.save(
                    "Ha exportado el listado de movimientos bancarios",
                    "banco"
                  );
                  break;
                case "REPORTES":
                  url =
                    nodeUrl +
                    "/export-list-reporte-eresultado/?download=true&sid=" +
                    unaBase.sid.encoded() +
                    "&" +
                    filters +
                    "&hostname=" +
                    window.location.origin;
                  unaBase.log.save(
                    "Ha exportado el reporte estado de resultados",
                    "reportes"
                  );
                  break;
              }

              /*if (modulo == 'NEGOCIOS') {
								// Leer datos del filtro
								var filters = $('#search').serializeAnything(true);

								// Pasar filtros a NodeJS
								var url = 'http://' + nodejs_public_ipaddr + ':' + nodejs_port + '/export-list-negocios/?download=true&sid=' + unaBase.sid.encoded() + '&' + filters;
								unaBase.log.save('Ha exportado el listado de negocios');
							}*/
              if (!blockedElement) {
                var download = window.open(url);
                download.blur();
                window.focus();
              }
            }
          });

        /* BEGIN: importar (banco) */
        if ($.inArray("import_list", params.buttons) != -1)
          buttons.push({
            name: "import_list",
            icon: "ui-icon-calculator",
            caption: "Importar CSV",
            action: function() {
              var modulo = $("html > body.menu.home > aside > div > div > ul > li.active")
                .data("name")
                .toUpperCase();

              switch (modulo) {
                case "BANCO":
                  unaBase.loadInto.dialog(
                    "/v3/views/banco/import.shtml",
                    "Importar cartola",
                    "small"
                  );
                  break;
              }
            }
          });

        /* BEGIN: export SAP */
        if ($.inArray("export_sap", params.buttons) != -1)
          buttons.push({
            name: "export_sap",
            icon: "ui-icon-calculator",
            caption: "Exportar a SAP",
            action: function() {
              var sid = "";
              $.each($.cookie(), function(clave, valor) {
                if (clave == hash && valor.match(/UNABASE/g)) sid = valor;
              });
              var modulo = $("html > body.menu.home > aside > div > div > ul > li.active")
                .data("name")
                .toUpperCase();
              var url = "";
              // var filters = $('#search').serializeAnything(true);
              var ids = [];
              var ids_contabilizado = [];
              var ids_por_emitir = [];
              var ids_cerrada = [];
              var ids_not_closed = [];
              var ids_libro_c = [];
              var ids_libro_v = [];
              var ids_libro_boletas = [];
              var ids_libro_otro = [];
              $(
                "#viewport tbody.ui-selectable tr[data-id] td:first-of-type input.selected:checked"
              ).each(function() {
                if (
                  $(this)
                    .closest("tr")
                    .data("contabilizado")
                ) {
                  ids_contabilizado.push(
                    $(this)
                      .closest("tr")
                      .data("id")
                  );
                }
                if (
                  $(this)
                    .closest("tr")
                    .data("estado") &&
                  $(this)
                    .closest("tr")
                    .data("estado") == "POR EMITIR"
                ) {
                  ids_por_emitir.push(
                    $(this)
                      .closest("tr")
                      .data("id")
                  );
                }
                if (
                  $(this)
                    .closest("tr")
                    .data("estado") &&
                  $(this)
                    .closest("tr")
                    .data("estado") == "CERRADA"
                ) {
                  ids_cerrada.push(
                    $(this)
                      .closest("tr")
                      .data("id")
                  );
                }
                // new
                if (
                  $(this)
                    .closest("tr")
                    .data("estado") &&
                  $(this)
                    .closest("tr")
                    .data("estado") !== "CERRADA"
                ) {
                  ids_not_closed.push(
                    $(this)
                      .closest("tr")
                      .data("id")
                  );
                }
                //new
                if (
                  $(this)
                    .closest("tr")
                    .data("libro") == "LIBRO_C"
                ) {
                  ids_libro_c.push(
                    $(this)
                      .closest("tr")
                      .data("id")
                  );
                }
                if (
                  $(this)
                    .closest("tr")
                    .data("libro") == "LIBRO_V"
                ) {
                  ids_libro_v.push(
                    $(this)
                      .closest("tr")
                      .data("id")
                  );
                }
                if (
                  $(this)
                    .closest("tr")
                    .data("libro") == "LIBRO_BOLETAS"
                ) {
                  ids_libro_boletas.push(
                    $(this)
                      .closest("tr")
                      .data("id")
                  );
                }
                if (
                  $(this)
                    .closest("tr")
                    .data("libro") == "OTRO"
                ) {
                  ids_libro_otro.push(
                    $(this)
                      .closest("tr")
                      .data("id")
                  );
                }
                ids.push(
                  $(this)
                    .closest("tr")
                    .data("id")
                );
              });

              let htmlFiles = $(`<section> 
								<span>Selecciona archivo a descargar:</span>
								<br/> 
								<br/> 
								<button id="sapDtcList" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only">
									<span class="ui-button-text">
									Listado
									</span>
								</button>
								<button id="sapDtcDetail" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only">
									<span class="ui-button-text">
									Detalles
									</span>
								</button>
							</section>`);

              var htmlObject = $(`<section> 
								<span>Seleccionar fecha contable:</span> 
								<input  type="date" style="border-bottom:solid 1px!important;width:300px" name="month2" >
							</section>`);

             
              let warningNoDate = () => {
                toastr.warning("Debes introducir una fecha contable!");
              };
              switch (modulo) {
                case "DTC":
                  // url = '/4DACTION/_V3_exportDtc?' + filters;

                  var sid = "";
                  $.each($.cookie(), function(clave, valor) {
                    if (clave == hash && valor.match(/UNABASE/g)) sid = valor;
                  });
                  var libro_c = ids_libro_c.length > 0;
                  var libro_boletas = ids_libro_boletas.length > 0;
                  var libro_otro = ids_libro_otro.length > 0;
                  var contabilizado = ids_contabilizado.length > 0;

                  let newDate;
                  let downTsv = sDate => {
                    console.log("sDate");
                    console.log(sDate);

                    var exportSapDtc = function(period, number) {
                      var htmlSubObject = $(
                        '<section> \
														<span>Confirmar inicio de correlativo interno:</span> \
														<input required type="number" style="border-bottom:solid 1px!important;width:300px" name="number" value="' +
                          number +
                          '"> \
													</section>'
                      );

                      htmlSubObject.find("input").on("blur change", function() {
                        htmlSubObject.data("response", $(this).val());
                      });

                      var downloadFile = function(number = 0, type) {
                        var url =
                          nodeUrl +
                          `/export/dtc/sap/${type}/${ids.join(
                            "|"
                          )}/${number}/${sDate}?hostname=${window.location.origin}&sid=${unaBase.sid.encoded()}`;
                        var download = window.open(url).blur();
                        window.focus();
                        download.close();
                      };

                      if (number && number != "") {
                        prompt(htmlFiles).done(function(data) {
                          $(this).remove();
                        });
                        document
                          .getElementById("sapDtcDetail")
                          .addEventListener("click", function() {
                            downloadFile(number, "detail");
                            console.log("detail");
                          });
                        document
                          .getElementById("sapDtcList")
                          .addEventListener("click", function() {
                            downloadFile(number, "list");
                            console.log("list");
                          });
                        // downloadFile(number);
                      }
                    };

                    fetch("/4DACTION/_V3_getLastAccountingNumber")
                      .then(response => response.json())
                      .then(data => {
                        exportSapDtc("", data.last);
                      });
                  };
                  let htmlIsAccounting = `<section> \
										<span style="font-size: 16px">Has seleccionado documentos que se han exportado con anterioridad,  posiblemente ya se han contabilizado, <br/> deseas descargarlo igualmente?</span>
										<br/> 
										
									</section>`;
                  if (contabilizado) {
                    prompt(htmlIsAccounting).done(function() {
                      prompt(htmlObject).done(function(data) {
                        newDate = document.querySelector('input[name="month2"]')
                          .value;

                        if (newDate !== false && newDate !== "") {
                          downTsv(newDate);
                        } else {
                          warningNoDate();
                        }
                      });
                    });
                  } else {
                    prompt(htmlObject).done(function(data) {
                      newDate = document.querySelector('input[name="month2"]')
                        .value;

                      if (newDate !== false && newDate !== "") {
                        downTsv(newDate);
                      } else {
                        warningNoDate();
                      }
                    });
                  }
                  //  else {
                  // 	if (contabilizado) {
                  // 		toastr.warning('Existen documentos ya contabilizados que están seleccionados, deben solo exportarse documentos no contabilizados.');
                  // 	} else {
                  // 		toastr.warning('Se han seleccionado tipos de documentos diferentes. Solo se deben exportar documentos de un mismo tipo.');
                  // 	}
                  // }

                  break;

                case "RENDICIONES":
                  // url = '/4DACTION/_V3_exportDtc?' + filters;
                  var libro_v = ids_libro_v.length > 0;
                  var libro_otro = ids_libro_otro.length > 0;
                  var contabilizado = ids_contabilizado.length > 0;
                  var cerrada = ids_cerrada.length > 0;
                  var notClosed = ids_not_closed.length > 0;
                  // if (!cerrada) {
                  var htmlObject = $(
                    '<section> \
											<span>Seleccionar periodo contable:</span> \
											<input required type="text" style="border-bottom:solid 1px!important;width:300px" name="month" placeholder="0000-00"> \
										</section>'
                  );

                  htmlObject.find('input[name="month"]').monthpicker({
                    changeMonth: true,
                    changeYear: true,
                    yearRange: "c-10:c+3",
                    onSelect: function(event) {
                      htmlObject.data("response", $(this).val());
                      htmlObject.find("input").css("background-color", "white");
                    }
                  });
                  let htmlisClosed = `<section> \
										<span style="font-size: 16px">Debes exportar solo rendiciones que se encuentren cerradas.</span>
										<br/> 
										
									</section>`;

                  // prompt(htmlObject).done(function(data) {

                  var sid = "";
                  $.each($.cookie(), function(clave, valor) {
                    if (valor.match(/UNABASE/g)) sid += valor;
                  }); 
                  // if (data !== false && data !== "") {
                  var exportSapFxr = function(period, number) {
                    var htmlSubObject = $(
                      '<section> \
														<span>Confirmar inicio de correlativo interno:</span> \
														<input required type="number" style="border-bottom:solid 1px!important;width:300px" name="number" value="' +
                        number +
                        '"> \
													</section>'
                    );

                    htmlSubObject.find("input").on("blur change", function() {
                      htmlSubObject.data("response", $(this).val());
                    });

                    var downloadFile = function(number, type) {
                      var url = nodeUrl +`/export/fxr/sap/${type}/${ids.join("|")}?hostname=${window.location.origin}&sid=${unaBase.sid.encoded()}`;

                      var download = window.open(url).blur();
                      window.focus();
                      download.close();
                    };
                    // if (libro_v) {
                    // prompt(htmlSubObject).done(function(number) {
                    // 	if (number) {
                    prompt(htmlFiles).done(function(data) {
                      $(this).remove();
                    });
                    document
                      .getElementById("sapDtcDetail")
                      .addEventListener("click", function() {
                        downloadFile(null, "detail");
                        console.log("detail");
                      });
                    document
                      .getElementById("sapDtcList")
                      .addEventListener("click", function() {
                        downloadFile(null, "list");
                        console.log("list");
                      });
                  };

                  if (!notClosed) {
                    exportSapFxr("", "");
                  } else {
                    prompt(htmlisClosed).done(function() {});
                  }
                  // }
                  // });
                  // } else {
                  // 	if (!por_emitir) {
                  // 		if (contabilizado) {
                  // 			toastr.warning('Existen documentos ya contabilizados que están seleccionados, deben solo exportarse documentos no contabilizados.');
                  // 		} else {
                  // 			toastr.warning('Se han seleccionado tipos de documentos diferentes. Solo se deben exportar documentos de un mismo tipo.');
                  // 		}
                  // 	} else {
                  // 		toastr.warning('Existen documentos por emitir que están seleccionados, deben solo exportarse documentos con folio asignado.');
                  // 	}
                  // }

                  break;
              }
            }
          });

        /* BEGIN: exportar Softland */
        if ($.inArray("export_softland", params.buttons) != -1)
          buttons.push({
            name: "export_softland",
            icon: "ui-icon-calculator",
            caption: "Exportar a Softland",
            action: function() {
              var sid = "";
              $.each($.cookie(), function(clave, valor) {
                if (clave == hash && valor.match(/UNABASE/g)) sid = valor;
              });
              var modulo = $("html > body.menu.home > aside > div > div > ul > li.active")
                .data("name")
                .toUpperCase();
              var url = "";
              // var filters = $('#search').serializeAnything(true);
              var ids = [];
              var ids_contabilizado = [];
              var ids_por_emitir = [];
              var ids_cerrada = [];
              var ids_libro_c = [];
              var ids_libro_v = [];
              var ids_libro_boletas = [];
              var ids_libro_otro = [];
              $(
                "#viewport tbody.ui-selectable tr[data-id] td:first-of-type input.selected:checked"
              ).each(function() {
                if (
                  $(this)
                    .closest("tr")
                    .data("contabilizado")
                ) {
                  ids_contabilizado.push(
                    $(this)
                      .closest("tr")
                      .data("id")
                  );
                }
                if (
                  $(this)
                    .closest("tr")
                    .data("estado") &&
                  $(this)
                    .closest("tr")
                    .data("estado") == "POR EMITIR"
                ) {
                  ids_por_emitir.push(
                    $(this)
                      .closest("tr")
                      .data("id")
                  );
                }
                if (
                  $(this)
                    .closest("tr")
                    .data("estado") &&
                  $(this)
                    .closest("tr")
                    .data("estado") == "CERRADA"
                ) {
                  ids_cerrada.push(
                    $(this)
                      .closest("tr")
                      .data("id")
                  );
                }
                if (
                  $(this)
                    .closest("tr")
                    .data("libro") == "LIBRO_C"
                ) {
                  ids_libro_c.push(
                    $(this)
                      .closest("tr")
                      .data("id")
                  );
                }
                if (
                  $(this)
                    .closest("tr")
                    .data("libro") == "LIBRO_V"
                ) {
                  ids_libro_v.push(
                    $(this)
                      .closest("tr")
                      .data("id")
                  );
                }
                if (
                  $(this)
                    .closest("tr")
                    .data("libro") == "LIBRO_BOLETAS"
                ) {
                  ids_libro_boletas.push(
                    $(this)
                      .closest("tr")
                      .data("id")
                  );
                }
                if (
                  $(this)
                    .closest("tr")
                    .data("libro") == "OTRO"
                ) {
                  ids_libro_otro.push(
                    $(this)
                      .closest("tr")
                      .data("id")
                  );
                }
                ids.push(
                  $(this)
                    .closest("tr")
                    .data("id")
                );
              });

              switch (modulo) {
                case "DTC":
                  // url = '/4DACTION/_V3_exportDtc?' + filters;
                  var libro_c = ids_libro_c.length > 0;
                  var libro_boletas = ids_libro_boletas.length > 0;
                  var libro_otro = ids_libro_otro.length > 0;
                  var contabilizado = ids_contabilizado.length > 0;

                  //if (!contabilizado && ((libro_c ? !libro_boletas : libro_boletas) ? !libro_otro : libro_otro)) {
                  if (
                    (libro_c
                    ? !libro_boletas
                    : libro_boletas)
                      ? !libro_otro
                      : libro_otro
                  ) {
                    var htmlObject = $(
                      '<section> \
											<span>Seleccionar periodo contable:</span> \
											<input required type="text" style="border-bottom:solid 1px!important;width:300px" name="month" placeholder="0000-00"> \
										</section>'
                    );

                    htmlObject.find('input[name="month"]').monthpicker({
                      changeMonth: true,
                      changeYear: true,
                      yearRange: "c-10:c+3",
                      onSelect: function(event) {
                        htmlObject.data("response", $(this).val());
                        htmlObject
                          .find("input")
                          .css("background-color", "white");
                      }
                    });

                    prompt(htmlObject).done(function(data) {
                      if (data !== false && data !== "") {
                        var exportSoftlandDtc = function(period, number) {
                          var htmlSubObject = $(
                            '<section> \
														<span>Confirmar inicio de correlativo interno:</span> \
														<input required type="number" style="border-bottom:solid 1px!important;width:300px" name="number" value="' +
                              number +
                              '"> \
													</section>'
                          );

                          htmlSubObject
                            .find("input")
                            .on("blur change", function() {
                              htmlSubObject.data("response", $(this).val());
                            });

                          var downloadFile = function(number) {
                            $.ajax({
                              url: "/4DACTION/_V3_getPeriodoContable",
                              data: {
                                periodo: period,
                                number: number
                              },
                              dataType: "json",
                              async: false,
                              success: function(subsubsubdata) {
                                if (!subsubsubdata.repeated) {
                                  url =
                                    "/4DACTION/_V3_exportDtc?ids=" +
                                    ids.join("|") +
                                    "&periodo=" +
                                    period +
                                    "&number=" +
                                    number;
                                  unaBase.log.save(
                                    "Ha exportado DTC a Softland",
                                    "dtc"
                                  );

                                  var download = window.open(url);
                                  download.blur();
                                  window.focus();
                                } else {
                                  toastr.warning(
                                    "Ya existen documentos contabilizados con el correlativo indicado."
                                  );
                                }
                              }
                            });
                          };
                          if (libro_c) {
                            prompt(htmlSubObject).done(function(number) {
                              if (number) {
                                downloadFile(number);
                              }
                            });
                          } else {
                            downloadFile(undefined);
                          }
                        };
                        $.ajax({
                          url: "/4DACTION/_V3_getPeriodoContable",
                          data: {
                            periodo: data
                          },
                          dataType: "json",
                          async: false,
                          success: function(subdata) {
                            if (subdata.exists) {
                              if (subdata.closed) {
                                toastr.warning(
                                  "El periodo seleccionado ya se encuentra cerrado."
                                );
                              } else {
                                exportSoftlandDtc(
                                  subdata.period,
                                  subdata.number
                                );
                              }
                            } else {
                              confirm(
                                "El periodo contable no está creado. Continuar para crear."
                              ).done(function(subsubdata) {
                                if (subsubdata) {
                                  exportSoftlandDtc(
                                    subdata.period,
                                    subdata.number
                                  );
                                }
                              });
                            }
                          }
                        });
                      }
                    });
                  } else {
                    if (contabilizado) {
                      toastr.warning(
                        "Existen documentos ya contabilizados que están seleccionados, deben solo exportarse documentos no contabilizados."
                      );
                    } else {
                      toastr.warning(
                        "Se han seleccionado tipos de documentos diferentes. Solo se deben exportar documentos de un mismo tipo."
                      );
                    }
                  }

                  break;

                case "DTV":
                  // url = '/4DACTION/_V3_exportDtv?' + filters;
                  var libro_v = ids_libro_v.length > 0;
                  var libro_otro = ids_libro_otro.length > 0;
                  var contabilizado = ids_contabilizado.length > 0;
                  var por_emitir = ids_por_emitir.length > 0;

                  //if (!contabilizado && (libro_v ? !libro_otro : libro_otro) && !por_emitir) {
                  if ((libro_v ? !libro_otro : libro_otro) && !por_emitir) {
                    var htmlObject = $(
                      '<section> \
											<span>Seleccionar periodo contable:</span> \
											<input required type="text" style="border-bottom:solid 1px!important;width:300px" name="month" placeholder="0000-00"> \
										</section>'
                    );

                    htmlObject.find('input[name="month"]').monthpicker({
                      changeMonth: true,
                      changeYear: true,
                      yearRange: "c-10:c+3",
                      onSelect: function(event) {
                        htmlObject.data("response", $(this).val());
                        htmlObject
                          .find("input")
                          .css("background-color", "white");
                      }
                    });

                    prompt(htmlObject).done(function(data) {
                      if (data !== false && data !== "") {
                        var exportSoftlandDtv = function(period, number) {
                          var htmlSubObject = $(
                            '<section> \
														<span>Confirmar inicio de correlativo interno:</span> \
														<input required type="number" style="border-bottom:solid 1px!important;width:300px" name="number" value="' +
                              number +
                              '"> \
													</section>'
                          );

                          htmlSubObject
                            .find("input")
                            .on("blur change", function() {
                              htmlSubObject.data("response", $(this).val());
                            });

                          var downloadFile = function(number) {
                            $.ajax({
                              url: "/4DACTION/_V3_getPeriodoContable",
                              data: {
                                periodo: period,
                                number: number
                              },
                              dataType: "json",
                              async: false,
                              success: function(subsubsubdata) {
                                if (!subsubsubdata.repeated) {
                                  url =
                                    "/4DACTION/_V3_exportDtv?ids=" +
                                    ids.join("|") +
                                    "&periodo=" +
                                    period +
                                    "&number=" +
                                    number;
                                  unaBase.log.save(
                                    "Ha exportado DTV a Softland",
                                    "dtc"
                                  );

                                  var download = window.open(url);
                                  download.blur();
                                  window.focus();
                                } else {
                                  toastr.warning(
                                    "Ya existen documentos contabilizados con el correlativo indicado."
                                  );
                                }
                              }
                            });
                          };
                          if (libro_v) {
                            prompt(htmlSubObject).done(function(number) {
                              if (number) {
                                downloadFile(number);
                              }
                            });
                          } else {
                            downloadFile(undefined);
                          }
                        };
                        $.ajax({
                          url: "/4DACTION/_V3_getPeriodoContable",
                          data: {
                            periodo: data
                          },
                          dataType: "json",
                          async: false,
                          success: function(subdata) {
                            if (subdata.exists) {
                              if (subdata.closed) {
                                toastr.warning(
                                  "El periodo seleccionado ya se encuentra cerrado."
                                );
                              } else {
                                exportSoftlandDtv(
                                  subdata.period,
                                  subdata.number
                                );
                              }
                            } else {
                              confirm(
                                "El periodo contable no está creado. Continuar para crear."
                              ).done(function(subsubdata) {
                                if (subsubdata) {
                                  exportSoftlandDtv(
                                    subdata.period,
                                    subdata.number
                                  );
                                }
                              });
                            }
                          }
                        });
                      }
                    });
                  } else {
                    if (!por_emitir) {
                      if (contabilizado) {
                        toastr.warning(
                          "Existen documentos ya contabilizados que están seleccionados, deben solo exportarse documentos no contabilizados."
                        );
                      } else {
                        toastr.warning(
                          "Se han seleccionado tipos de documentos diferentes. Solo se deben exportar documentos de un mismo tipo."
                        );
                      }
                    } else {
                      toastr.warning(
                        "Existen documentos por emitir que están seleccionados, deben solo exportarse documentos con folio asignado."
                      );
                    }
                  }

                  break;

                case "EGRESOS":
                  // url = '/4DACTION/_V3_exportEgresos?' + filters;
                  var libro_v = ids_libro_v.length > 0;
                  var libro_otro = ids_libro_otro.length > 0;
                  var contabilizado = ids_contabilizado.length > 0;
                  var por_emitir = ids_por_emitir.length > 0;

                  //if (!contabilizado /*&& (libro_v ? !libro_otro : libro_otro)*/ && !por_emitir) {
                  if (!por_emitir) {
                    var htmlObject = $(
                      '<section> \
											<span>Seleccionar periodo contable:</span> \
											<input required type="text" style="border-bottom:solid 1px!important;width:300px" name="month" placeholder="0000-00"> \
										</section>'
                    );

                    htmlObject.find('input[name="month"]').monthpicker({
                      changeMonth: true,
                      changeYear: true,
                      yearRange: "c-10:c+3",
                      onSelect: function(event) {
                        htmlObject.data("response", $(this).val());
                        htmlObject
                          .find("input")
                          .css("background-color", "white");
                      }
                    });

                    prompt(htmlObject).done(function(data) {
                      if (data !== false && data !== "") {
                        var exportSoftlandDtv = function(period, number) {
                          var htmlSubObject = $(
                            '<section> \
														<span>Confirmar inicio de correlativo interno:</span> \
														<input required type="number" style="border-bottom:solid 1px!important;width:300px" name="number" value="' +
                              number +
                              '"> \
													</section>'
                          );

                          htmlSubObject
                            .find("input")
                            .on("blur change", function() {
                              htmlSubObject.data("response", $(this).val());
                            });

                          var downloadFile = function(number) {
                            $.ajax({
                              url: "/4DACTION/_V3_getPeriodoContable",
                              data: {
                                periodo: period,
                                number: number
                              },
                              dataType: "json",
                              async: false,
                              success: function(subsubsubdata) {
                                if (!subsubsubdata.repeated) {
                                  url =
                                    "/4DACTION/_V3_ExportEgresos?ids=" +
                                    ids.join("|") +
                                    "&periodo=" +
                                    period +
                                    "&number=" +
                                    number;
                                  unaBase.log.save(
                                    "Ha exportado egresos a Softland",
                                    "egresos"
                                  );

                                  var download = window.open(url);
                                  download.blur();
                                  window.focus();
                                } else {
                                  toastr.warning(
                                    "Ya existen documentos contabilizados con el correlativo indicado."
                                  );
                                }
                              }
                            });
                          };
                          if (libro_v) {
                            prompt(htmlSubObject).done(function(number) {
                              if (number) {
                                downloadFile(number);
                              }
                            });
                          } else {
                            downloadFile(undefined);
                          }
                        };
                        $.ajax({
                          url: "/4DACTION/_V3_getPeriodoContable",
                          data: {
                            periodo: data
                          },
                          dataType: "json",
                          async: false,
                          success: function(subdata) {
                            if (subdata.exists) {
                              if (subdata.closed) {
                                toastr.warning(
                                  "El periodo seleccionado ya se encuentra cerrado."
                                );
                              } else {
                                exportSoftlandDtv(
                                  subdata.period,
                                  subdata.number
                                );
                              }
                            } else {
                              confirm(
                                "El periodo contable no está creado. Continuar para crear."
                              ).done(function(subsubdata) {
                                if (subsubdata) {
                                  exportSoftlandDtv(
                                    subdata.period,
                                    subdata.number
                                  );
                                }
                              });
                            }
                          }
                        });
                      }
                    });
                  } else {
                    if (!por_emitir) {
                      if (contabilizado) {
                        toastr.warning(
                          "Existen documentos ya contabilizados que están seleccionados, deben solo exportarse documentos no contabilizados."
                        );
                      } else {
                        toastr.warning(
                          "Se han seleccionado tipos de documentos diferentes. Solo se deben exportar documentos de un mismo tipo."
                        );
                      }
                    } else {
                      toastr.warning(
                        "Existen documentos por emitir que están seleccionados, deben solo exportarse documentos con folio asignado."
                      );
                    }
                  }

                  break;
                case "GASTOS":
                  // url = '/4DACTION/_V3_exportDtc?' + filters;
                  var libro_v = ids_libro_v.length > 0;
                  var libro_otro = ids_libro_otro.length > 0;
                  var contabilizado = ids_contabilizado.length > 0;
                  var cerrada = ids_cerrada.length > 0;

                  if (!cerrada) {
                    var htmlObject = $(
                      '<section> \
											<span>Seleccionar periodo contable:</span> \
											<input required type="text" style="border-bottom:solid 1px!important;width:300px" name="month" placeholder="0000-00"> \
										</section>'
                    );

                    htmlObject.find('input[name="month"]').monthpicker({
                      changeMonth: true,
                      changeYear: true,
                      yearRange: "c-10:c+3",
                      onSelect: function(event) {
                        htmlObject.data("response", $(this).val());
                        htmlObject
                          .find("input")
                          .css("background-color", "white");
                      }
                    });

                    prompt(htmlObject).done(function(data) {
                      if (data !== false && data !== "") {
                        var exportSoftlandDtv = function(period, number) {
                          var htmlSubObject = $(
                            '<section> \
														<span>Confirmar inicio de correlativo interno:</span> \
														<input required type="number" style="border-bottom:solid 1px!important;width:300px" name="number" value="' +
                              number +
                              '"> \
													</section>'
                          );

                          htmlSubObject
                            .find("input")
                            .on("blur change", function() {
                              htmlSubObject.data("response", $(this).val());
                            });

                          var downloadFile = function(number) {
                            $.ajax({
                              url: "/4DACTION/_V3_getPeriodoContable",
                              data: {
                                periodo: period,
                                number: number
                              },
                              dataType: "json",
                              async: false,
                              success: function(subsubsubdata) {
                                if (!subsubsubdata.repeated) {
                                  url =
                                    "/4DACTION/_V3_ExportOC?ids=" +
                                    ids.join("|") +
                                    "&periodo=" +
                                    period +
                                    "&number=" +
                                    number;
                                  unaBase.log.save(
                                    "Ha exportado egresos a Softland",
                                    "egresos"
                                  );

                                  var download = window.open(url);
                                  download.blur();
                                  window.focus();
                                } else {
                                  toastr.warning(
                                    "Ya existen documentos contabilizados con el correlativo indicado."
                                  );
                                }
                              }
                            });
                          };
                          if (libro_v) {
                            prompt(htmlSubObject).done(function(number) {
                              if (number) {
                                downloadFile(number);
                              }
                            });
                          } else {
                            downloadFile(undefined);
                          }
                        };
                        $.ajax({
                          url: "/4DACTION/_V3_getPeriodoContable",
                          data: {
                            periodo: data
                          },
                          dataType: "json",
                          async: false,
                          success: function(subdata) {
                            if (subdata.exists) {
                              if (subdata.closed) {
                                toastr.warning(
                                  "El periodo seleccionado ya se encuentra cerrado."
                                );
                              } else {
                                exportSoftlandDtv(
                                  subdata.period,
                                  subdata.number
                                );
                              }
                            } else {
                              confirm(
                                "El periodo contable no está creado. Continuar para crear."
                              ).done(function(subsubdata) {
                                if (subsubdata) {
                                  exportSoftlandDtv(
                                    subdata.period,
                                    subdata.number
                                  );
                                }
                              });
                            }
                          }
                        });
                      }
                    });
                  } else {
                    if (!por_emitir) {
                      if (contabilizado) {
                        toastr.warning(
                          "Existen documentos ya contabilizados que están seleccionados, deben solo exportarse documentos no contabilizados."
                        );
                      } else {
                        toastr.warning(
                          "Se han seleccionado tipos de documentos diferentes. Solo se deben exportar documentos de un mismo tipo."
                        );
                      }
                    } else {
                      toastr.warning(
                        "Existen documentos por emitir que están seleccionados, deben solo exportarse documentos con folio asignado."
                      );
                    }
                  }

                  break;

                case "RENDICIONES":
                  // url = '/4DACTION/_V3_exportDtc?' + filters;
                  var libro_v = ids_libro_v.length > 0;
                  var libro_otro = ids_libro_otro.length > 0;
                  var contabilizado = ids_contabilizado.length > 0;
                  var cerrada = ids_cerrada.length > 0;

                  if (!cerrada) {
                    var htmlObject = $(
                      '<section> \
											<span>Seleccionar periodo contable:</span> \
											<input required type="text" style="border-bottom:solid 1px!important;width:300px" name="month" placeholder="0000-00"> \
										</section>'
                    );

                    htmlObject.find('input[name="month"]').monthpicker({
                      changeMonth: true,
                      changeYear: true,
                      yearRange: "c-10:c+3",
                      onSelect: function(event) {
                        htmlObject.data("response", $(this).val());
                        htmlObject
                          .find("input")
                          .css("background-color", "white");
                      }
                    });

                    prompt(htmlObject).done(function(data) {
                      if (data !== false && data !== "") {
                        var exportSoftlandDtv = function(period, number) {
                          var htmlSubObject = $(
                            '<section> \
														<span>Confirmar inicio de correlativo interno:</span> \
														<input required type="number" style="border-bottom:solid 1px!important;width:300px" name="number" value="' +
                              number +
                              '"> \
													</section>'
                          );

                          htmlSubObject
                            .find("input")
                            .on("blur change", function() {
                              htmlSubObject.data("response", $(this).val());
                            });

                          var downloadFile = function(number) {
                            $.ajax({
                              url: "/4DACTION/_V3_getPeriodoContable",
                              data: {
                                periodo: period,
                                number: number
                              },
                              dataType: "json",
                              async: false,
                              success: function(subsubsubdata) {
                                if (!subsubsubdata.repeated) {
                                  url =
                                    "/4DACTION/_V3_ExportOC?ids=" +
                                    ids.join("|") +
                                    "&periodo=" +
                                    period +
                                    "&number=" +
                                    number;
                                  unaBase.log.save(
                                    "Ha exportado egresos a Softland",
                                    "egresos"
                                  );

                                  var download = window.open(url);
                                  download.blur();
                                  window.focus();
                                } else {
                                  toastr.warning(
                                    "Ya existen documentos contabilizados con el correlativo indicado."
                                  );
                                }
                              }
                            });
                          };
                          if (libro_v) {
                            prompt(htmlSubObject).done(function(number) {
                              if (number) {
                                downloadFile(number);
                              }
                            });
                          } else {
                            downloadFile(undefined);
                          }
                        };
                        $.ajax({
                          url: "/4DACTION/_V3_getPeriodoContable",
                          data: {
                            periodo: data
                          },
                          dataType: "json",
                          async: false,
                          success: function(subdata) {
                            if (subdata.exists) {
                              if (subdata.closed) {
                                toastr.warning(
                                  "El periodo seleccionado ya se encuentra cerrado."
                                );
                              } else {
                                exportSoftlandDtv(
                                  subdata.period,
                                  subdata.number
                                );
                              }
                            } else {
                              confirm(
                                "El periodo contable no está creado. Continuar para crear."
                              ).done(function(subsubdata) {
                                if (subsubdata) {
                                  exportSoftlandDtv(
                                    subdata.period,
                                    subdata.number
                                  );
                                }
                              });
                            }
                          }
                        });
                      }
                    });
                  } else {
                    if (!por_emitir) {
                      if (contabilizado) {
                        toastr.warning(
                          "Existen documentos ya contabilizados que están seleccionados, deben solo exportarse documentos no contabilizados."
                        );
                      } else {
                        toastr.warning(
                          "Se han seleccionado tipos de documentos diferentes. Solo se deben exportar documentos de un mismo tipo."
                        );
                      }
                    } else {
                      toastr.warning(
                        "Existen documentos por emitir que están seleccionados, deben solo exportarse documentos con folio asignado."
                      );
                    }
                  }

                  break;
              }
            }
          });

        /* BEGIN: exportar nómina */
        if ($.inArray("export_nomina", params.buttons) != -1)
          buttons.push({
            name: "export_nomina",
            icon: "ui-icon-calculator",
            caption: "Exportar nómina",
            action: function() {
              var sid = "";
              $.each($.cookie(), function(clave, valor) {
                if (clave == hash && valor.match(/UNABASE/g)) sid = valor;
              });
              var modulo = $("html > body.menu.home > aside > div > div > ul > li.active")
                .data("name")
                .toUpperCase();
              var url = "";
              // var filters = $('#search').serializeAnything(true);
              var ids = [];
              /*var ids_contabilizado = [];
							var ids_por_emitir = [];
							var ids_libro_c = [];
							var ids_libro_v = [];
							var ids_libro_boletas = [];
							var ids_libro_otro = [];*/
              var ids_pagada = [];
              var ids_emitida = [];
              var ids_sin_doc_pago = [];
              var ids_excluir_tipo_pago = [];
              $(
                "#viewport tbody.ui-selectable tr[data-id] td:first-of-type input.selected:checked"
              ).each(function() {
                /*if ($(this).closest('tr').data('contabilizado')) {
									ids_contabilizado.push($(this).closest('tr').data('id'));
								}
								if ($(this).closest('tr').data('estado') && $(this).closest('tr').data('estado') == 'POR EMITIR') {
									ids_por_emitir.push($(this).closest('tr').data('id'));
								}
								if ($(this).closest('tr').data('libro') == 'LIBRO_C') {
									ids_libro_c.push($(this).closest('tr').data('id'));
								}
								if ($(this).closest('tr').data('libro') == 'LIBRO_V') {
									ids_libro_v.push($(this).closest('tr').data('id'));
								}
								if ($(this).closest('tr').data('libro') == 'LIBRO_BOLETAS') {
									ids_libro_boletas.push($(this).closest('tr').data('id'));
								}
								if ($(this).closest('tr').data('libro') == 'OTRO') {
									ids_libro_otro.push($(this).closest('tr').data('id'));
								}*/
                ids.push(
                  $(this)
                    .closest("tr")
                    .data("id")
                );
                if (
                  $(this)
                    .closest("tr")
                    .data("estado") == "PAGADA"
                ) {
                  ids_pagada.push(
                    $(this)
                      .closest("tr")
                      .data("id")
                  );
                }
                if (
                  $(this)
                    .closest("tr")
                    .data("estado") == "EMITIDA"
                ) {
                  ids_emitida.push(
                    $(this)
                      .closest("tr")
                      .data("id")
                  );
                }
                if (
                  $(this)
                    .closest("tr")
                    .data("forma-pago") == ""
                ) {
                  ids_sin_doc_pago.push(
                    $(this)
                      .closest("tr")
                      .data("id")
                  );
                }
                if (
                  $(this)
                    .closest("tr")
                    .data("forma-pago") != "TRANSFERENCIA" &&
                  $(this)
                    .closest("tr")
                    .data("forma-pago") != "VALE VISTA" &&
                  $(this)
                    .closest("tr")
                    .data("forma-pago") != ""
                ) {
                  ids_excluir_tipo_pago.push(
                    $(this)
                      .closest("tr")
                      .data("id")
                  );
                }
              });

              switch (modulo) {
                case "EGRESOS":
                  // url = '/4DACTION/_V3_exportEgresos?' + filters;
                  /*var libro_v = (ids_libro_v.length > 0);
									var libro_otro = (ids_libro_otro.length > 0);
									var contabilizado = (ids_contabilizado.length > 0);
									var por_emitir = (ids_por_emitir.length > 0);*/
                  var pagada = ids_pagada.length > 0;
                  var emitida = ids_emitida.length > 0;
                  var sin_doc_pago = ids_sin_doc_pago.length > 0;
                  var excluir_tipo_pago = ids_excluir_tipo_pago.length > 0;
                  let nominaValues = {};
                  let nominaPromt = `<ul>
										<li><input type="radio" name="nominaType" value="bciGrand" checked="checked" >Bci Grandes Empresas</li>
										<li><input type="radio" name="nominaType" value="bciGen" >Bci Generico</li>
									</ul>`;

                  axios("/4DACTION/_V3_getParamEgreso")
                    .then(resp => {
                      if (
                        !pagada &&
                        emitida &&
                        !sin_doc_pago &&
                        !excluir_tipo_pago
                      ) {
                        var htmlObject = $(
                          '<section> \
												<span>Ingresar nombre de la nómina:</span> \
												<input required type="text" style="border-bottom:solid 1px!important;width:300px" name="filename" value="NP' +
                            new Date()
                              .toJSON()
                              .slice(0, 10)
                              .split("-")
                              .reverse()
                              .join("") +
                            '"> \
											</section>'
                        );

                        htmlObject
                          .find('input[name="filename"]')
                          .on("blur", function(event) {
                            htmlObject.data("response", $(this).val());
                            htmlObject
                              .find("input")
                              .css("background-color", "white");
                          });

                        var promptNomina = function() {
                          prompt(htmlObject).done(function(data) {
                            if (data !== false && data !== "") {
                              var exportSoftlandNomina = function(
                                filename,
                                nominaType = "bciGrand"
                              ) {
                                var downloadFile = function() {
                                  $.ajax({
                                    url: "/4DACTION/_V3_getNominaEgresos",
                                    data: {
                                      filename: filename,
                                      nominaType
                                    },
                                    dataType: "json",
                                    async: false,
                                    success: function(subsubsubdata) {
                                      console.warn(subsubsubdata);
                                      url =
                                        "/4DACTION/_V3_ExportNomina?ids=" +
                                        ids.join("|") +
                                        "&filename=" +
                                        filename +
                                        "&nominaType=" +
                                        subsubsubdata.nominaType;
                                      unaBase.log.save(
                                        "Ha exportado nómina de egresos a Softland",
                                        "egresos"
                                      );

                                      var download = window.open(url);
                                      download.blur();
                                      window.focus();

                                      setTimeout(function() {
                                        unaBase.toolbox.search.save();
                                        unaBase.toolbox.search.restore();
                                      }, 5000);
                                    }
                                  });
                                };
                                downloadFile();
                              };
                              $.ajax({
                                url: "/4DACTION/_V3_getNominaEgresos",
                                data: {
                                  filename: data
                                },
                                dataType: "json",
                                async: false,
                                success: function(subdata) {
                                  if (subdata.exists) {
                                    /*confirm('El nombre de la nómina ingresada ya existe. ¿Desea volver a descargarla?').done(function(subsubdata) {
																		if (subsubdata) {
																			exportSoftlandNomina(subdata.filename);
																		}
																	});*/
                                    toastr.warning(
                                      "El nombre de la nómina ingresado ya existe. Por favor, utilice un nombre distinto."
                                    );
                                    promptNomina();
                                  } else {
                                    nominaValues = resp.data;
                                    let nominaTypes = Object.keys(
                                      nominaValues
                                    ).filter(i => nominaValues[i] === true);
                                    switch (nominaTypes.length) {
                                      case 1:
                                        nominaTypes = nominaTypes.join();
                                        exportSoftlandNomina(
                                          subdata.filename,
                                          nominaTypes
                                        );
                                        break;
                                      case 0:
                                        exportSoftlandNomina(subdata.filename);
                                        break;
                                      default:
                                        prompt(nominaPromt).done(function(
                                          dataPromt
                                        ) {
                                          const nominaTypeValue = document.querySelector(
                                            'input[name="nominaType"]:checked'
                                          ).value;
                                          exportSoftlandNomina(
                                            subdata.filename,
                                            nominaTypeValue
                                          );
                                        });
                                        break;
                                    }
                                    // if(nominaTypes.length <= 1){
                                    // }else{
                                    // }
                                  }
                                }
                              });
                            }
                          });
                        };

                        promptNomina();
                      } else {
                        if (pagada) {
                          toastr.warning(
                            "Existen documentos ya pagados que están seleccionados, deben solo exportarse documentos emitidos."
                          );
                        } else {
                          if (sin_doc_pago && emitida) {
                            toastr.warning(
                              "Existen documentos sin documento de pago que están seleccionados, deben solo exportarse documentos con documento de pago."
                            );
                          } else {
                            if (excluir_tipo_pago) {
                              toastr.warning(
                                "Existen documentos seleccionados que no pueden pagarse mediante nómina, deben solo exportarse documentos a pagar mediante transferencia o vale vista."
                              );
                            }
                            if (!emitida) {
                              toastr.warning(
                                "Existen documentos no emitidos que están seleccionados, deben solo exportarse documentos emitidos."
                              );
                            }
                          }
                        }
                      }
                    })
                    .catch(err => {
                      console.log(err);
                    });

                  break;
              }
            }
          });

        // Ver nóminas anteriores
        if ($.inArray("list_nomina", params.buttons) != -1)
          buttons.push({
            name: "list_nomina",
            icon: "ui-icon-document",
            caption: "Ver nóminas anteriores",
            action: function() {
              unaBase.loadInto.dialog(
                "/v3/views/pagos/dialog/nominas.shtml",
                "Nóminas anteriores",
                "medium"
              );
            }
          });

        if ($.inArray("export_list_items_doc", params.buttons) != -1)
          buttons.push({
            name: "export_list_items_doc",
            icon: "ui-icon-calculator",
            caption: "Exportar items a excel",
            action: function() {
              var sid = "";
              $.each($.cookie(), function(clave, valor) {
                if (clave == hash && valor.match(/UNABASE/g)) sid = valor;
              });
              var modulo = $("html > body.menu.home > aside > div > div > ul > li.active")
                .data("name")
                .toUpperCase();
              var url = "";
              var filters = $("#search").serializeAnything(true);
              switch (modulo) {
                case "NEGOCIOS":
                  url =
                    nodeUrl +
                    "/export-list-items-negocios/?download=true&sid=" +
                    unaBase.sid.encoded() +
                    "&" +
                    filters +
                    "&hostname=" +
                    window.location.origin;
                  unaBase.log.save(
                    "Ha exportado el listado de ítems de " + etiqueta_negocios,
                    "negocios"
                  );
                  break;
                case "GASTOS":
                  url =
                    nodeUrl + "/export-list-items-oc/?download=true&tipo_gasto=OC&sid=" + unaBase.sid.encoded() + "&" + filters + "&hostname=" + window.location.origin;
                  unaBase.log.save(
                    "Ha exportado el listado de ìtems de órdenes de compra",
                    "gastos"
                  );
                  break;
                case "RENDICIONES":
                  url =
                    nodeUrl + "/export-list-items-fxr/?download=true&tipo_gasto=FXR&sid=" + unaBase.sid.encoded() + "&" + filters + "&hostname=" + window.location.origin;
                  unaBase.log.save(
                    "Ha exportado el listado de ítems de rendiciones",
                    "rendiciones"
                  );
                  break;
              }
              console.log(url)
              var download = window.open(url);
              download.blur();
              window.focus();
            }
          });

        // Ver nóminas anteriores
        /*if ($.inArray('list_bank', params.buttons) != -1)
					buttons.push({
					name: 'list_bank', icon: 'ui-icon-document', caption: 'Ver movimientos bancarios',
					action: function() {
						window.open('http://'+ nodejs_public_ipaddr + ':' + nodejs_port + '/bankcards/list');
					}
				});*/

        if ($.inArray("dtv_por_cobrar", params.buttons) != -1)
          buttons.push({
            name: "dtv_por_cobrar",
            icon: "ui-icon ui-icon-document",
            caption: "Facturas por cobrar",
            action: function() {
              dtv.get_por_cobrar($(this));
            }
          });
        if ($.inArray("oc_por_validar", params.buttons) != -1)
          buttons.push({
            name: "oc_por_validar",
            icon: "ui-icon ui-icon-cancel",
            caption: "Por validar",
            action: function() {
              // ocs.oc_por_validar($(this));'http://' + nodejs_public_ipaddr + ':' + nodejs_port + '
              //por validar
              let sidv3 = getCookie(hash);
              let url = `${nodeUrl}/expenses/tovalidate`;
              console.log(url);
              window.open(url, "_blank");
            }
          });
        if ($.inArray("fxr_por_validar", params.buttons) != -1)
          buttons.push({
            name: "fxr_por_validar",
            icon: "ui-icon ui-icon-cancel",
            caption: "Por validar",
            action: function() {
              // fxr.fxr_por_validar($(this));
              window.open(
                `${nodeUrl}/expenses/tovalidate`,
                "_blank"
              );
            }
          });

        if ($.inArray("emitir-modo-pe-FA", params.buttons) != -1)
          buttons.push({
            name: "emitir-modo-pe-FA",
            icon: "ui-icon-document",
            caption: "Emitir electrónico",
            action: function() {
              var saved = menu.find('[data-name="save"] button').triggerHandler("click");
              if (!saved.success) event.stopImmediatePropagation();
              unaBase.ui.unblock();
              dtv.previewFEPE();     
            }
          });

        if ($.inArray("emitir-modo-pe-FA_NC", params.buttons) != -1)
          buttons.push({
            name: "emitir-modo-pe-FA_NC",
            icon: "ui-icon-document",
            caption: "Emitir electrónico",
            action: function() {
              var saved = menu.find('[data-name="save"] button').triggerHandler("click");
              if (!saved.success) {
                event.stopImmediatePropagation();
              }
              notas.previewFEPE();
            }
          });

        if ($.inArray("dtv_emitir_manual", params.buttons) != -1)
          buttons.push({
            name: "dtv_emitir_manual",
            icon: "ui-icon-document",
            caption: "Emitir manual",
            action: function() {
              var saved = menu
                .find('[data-name="save"] button')
                .triggerHandler("click");
              if (!saved.success) event.stopImmediatePropagation();

              unaBase.ui.unblock();

              var rut = $('[name="contacto[info][rut]"]').val();
              rut = unaBase.data.rut.format(rut);

              if (rut != "") {
                var rut_valido = true;
                if (currency.code != "PEN") {
                  rut_valido = unaBase.data.rut.validate(rut);
                }

                // cuando el doc es de tipo exportacion = 78 no hace la validacion de rut, ya que es rut extranjero
                if (
                  rut_valido ||
                  dtv.data.id_tipo_doc == "78" ||
                  dtv.data.id_tipo_doc == "35" ||
                  dtv.data.id_tipo_doc == "97" ||
                  dtv.data.id_tipo_doc == "1003"
                ) {
                  var id = $("#sheet-dtv").data("id");

                  /*var htmlObjectFolio = $('<section> \
										<span>Por favor confirmar folio</span><br><br> \
										<input required type="number" name="folio" min="1" step="1" style="border: 1px solid lightgrey;"> \
									</section>');*/

                  var htmlObjectFolio = $(
                    '<section> \
										<span>Por favor confirmar folio</span><br><br> \
										<input required type="text" name="folio" style="border: 1px solid lightgrey;"> \
									</section>'
                  );

                  var folio = $("section#sheet-dtv").data("new-index");
                  htmlObjectFolio.find("input").val(folio);

                  htmlObjectFolio.find("input").on("blur change", function() {
                    htmlObjectFolio.data("response", $(this).val());
                  });

                  var htmlObjectFecha = $(
                    '<section> \
										<span>Por favor confirmar fecha</span><br><br> \
										<input required type="date" name="fecha" style="border: 1px solid lightgrey;"> \
									</section>'
                  );

                  var fecha = $('input[name="fecha_emision"]').val();
                  var year = fecha.substring(6, 10);
                  var month = fecha.substring(3, 5);
                  var day = fecha.substring(0, 2);

                  htmlObjectFecha
                    .find("input")
                    .val(year + "-" + month + "-" + day);

                  htmlObjectFecha.find("input").on("blur change", function() {
                    htmlObjectFecha.data("response", $(this).val());
                  });

                  var tipo_factura = $('input[name="des_tipo_doc"]').val();

                  prompt(htmlObjectFolio).done(function(data) {
                    if (data !== false)
                      prompt(htmlObjectFecha).done(function(subdata) {
                        if (subdata !== false) {
                          $.ajax({
                            // url: '/4DACTION/_V3_set' + params.entity,
                            url: "/4DACTION/_V3_generadtv_manual",
                            data: {
                              id: id,
                              folio: data,
                              fecha: subdata,
                              tipo_factura: tipo_factura
                            },
                            dataType: "json",
                            type: "POST"
                          }).done(function(data) {
                            if (data.success) {
                              var year = data.date.substring(0, 4);
                              var month = data.date.substring(5, 7);
                              var day = data.date.substring(8, 10);

                              $("#sheet-dtv")
                                .find('span[data-name="folio"]')
                                .text(data.index);
                              $("#sheet-dtv")
                                .find('span[data-name="fecha_emision"]')
                                .text(day + "-" + month + "-" + year);
                              $("#sheet-dtv")
                                .find('span[data-name="estado"]')
                                .text("EMITIDA");
                              $("#sheet-dtv")
                                .find('input[name="folio"]')
                                .val(data.index);
                              $("#sheet-dtv")
                                .find('input[name="fecha_emision"]')
                                .val(day + "-" + month + "-" + year);
                              // falta cambiar fecha de vencimiento
                              $("#menu")
                                .find('[data-name="dtv_emitir_manual"]')
                                .hide();
                              $("#menu")
                                .find('[data-name="dtv_emitir_electronico"]')
                                .hide();
                              $("#sheet-dtv")
                                .find("button.edit")
                                .hide();
                              // $('#sheet-dtv').find('input.edit, textarea.edit').prop('readonly', true).removeClass('datepicker');
                              // se mofifica para que no quede bloqueada la observación al emitir manual
                              $("#sheet-dtv")
                                .find("input.edit")
                                .prop("readonly", true)
                                .removeClass("datepicker");
                              $("#sheet-dtv table.items")
                                .find("input")
                                .prop("readonly", true);
                              toastr.success(
                                "Factura emitida con éxito (Folio " +
                                  data.index +
                                  ")"
                              );

                              unaBase.inbox.send({
                                subject:
                                  "Ha emitido Factura de venta Nº " +
                                  data.index +
                                  " / " +
                                  $(
                                    '#sheet-dtv span[data-name="referencia"]'
                                  ).text(),
                                into: "viewport",
                                href:
                                  "/v3/views/dtv/content.shtml?id=" +
                                  $("#sheet-dtv").data("id"),
                                tag: "avisos"
                              });
                            } else {
                              toastr.warning(
                                "El folio se encuentra repetido (Folio " +
                                  data.index +
                                  ")"
                              );
                            }
                          });
                        }
                      });
                  });
                } else {
                  toastr.warning(
                    "No es posible emitir documento. El cliente no tiene un RUT válido ingresado."
                  );
                }
              } else {
                if (currency.code == "PEN") {
                  toastr.warning(
                    "No es posible emitir el documento. El cliente no tiene RUC registrado."
                  );
                } else {
                  toastr.warning(
                    "No es posible emitir el documento. El cliente no tiene un RUT registrado."
                  );
                }
              }
            }
          });

        if ($.inArray("dtv_emitir_electronico", params.buttons) != -1) {
          // Facturacion.cl
          buttons.push({
            name: "dtv_emitir_electronico",
            icon: "ui-icon-document",
            caption: "Emitir electrónico",
            action: function() {
              var saved = menu
                .find('[data-name="save"] button')
                .triggerHandler("click");
              if (!saved.success) event.stopImmediatePropagation();

              var rut = $('[name="contacto[info][rut]"]').val();
              rut = unaBase.data.rut.format(rut);
              if (rut != "" && unaBase.data.rut.validate(rut)) {
                var gironow = $('input[name="contacto[info][giro]"]').val();

                if (gironow.length > 40) {
                  alert(
                    "El giro del cliente es demasiado largo (máximo permitido 40 caracteres). Por favor modificar información desde la ficha del cliente, y luego enviar."
                  );
                } else {
                  var id = $("#sheet-dtv").data("id");

                  var htmlObjectFecha = $(
                    '<section> \
										<span>Por favor confirmar fecha</span><br><br> \
										<input required type="date" name="fecha" style="border: 1px solid lightgrey;"> \
									</section>'
                  );

                  var fecha = $('input[name="fecha_emision"]').val();
                  var year = fecha.substring(6, 10);
                  var month = fecha.substring(3, 5);
                  var day = fecha.substring(0, 2);

                  htmlObjectFecha
                    .find("input")
                    .val(year + "-" + month + "-" + day);

                  htmlObjectFecha.find("input").on("blur change", function() {
                    htmlObjectFecha.data("response", $(this).val());
                  });

                  var tipo_factura = $('input[name="des_tipo_doc"]').val();

                  prompt(htmlObjectFecha).done(function(data) {
                    if (data !== false) {
                      $.ajax({
                        // url: '/4DACTION/_V3_set' + params.entity,
                        url: "/4DACTION/_V3_generadtv_electronico",
                        data: {
                          id: id,
                          fecha: data,
                          tipo_factura: tipo_factura
                        },
                        dataType: "json",
                        type: "POST"
                      }).done(function(data) {
                        if (data.success) {
                          var year = data.date.substring(0, 4);
                          var month = data.date.substring(5, 7);
                          var day = data.date.substring(8, 10);

                          $("#sheet-dtv")
                            .find('span[data-name="folio"]')
                            .text(data.index);
                          $("#sheet-dtv")
                            .find('span[data-name="fecha_emision"]')
                            .text(day + "-" + month + "-" + year);
                          $("#sheet-dtv")
                            .find('span[data-name="estado"]')
                            .text("EMITIDA");
                          $("#sheet-dtv")
                            .find('input[name="folio"]')
                            .val(data.index);
                          $("#sheet-dtv")
                            .find('input[name="fecha_emision"]')
                            .val(day + "-" + month + "-" + year);
                          // falta cambiar fecha de vencimiento
                          $("#menu")
                            .find('[data-name="dtv_emitir_manual"]')
                            .hide();
                          $("#menu")
                            .find('[data-name="dtv_emitir_electronico"]')
                            .hide();
                          $("#menu")
                            .find('[data-name="dtv_pdf_electronico"]')
                            .show();
                          $("#sheet-dtv")
                            .find("button.edit")
                            .hide();
                          $("#sheet-dtv")
                            .find("input.edit, textarea.edit")
                            .prop("readonly", true)
                            .removeClass("datepicker");
                          $("#sheet-dtv table.items")
                            .find("input")
                            .prop("readonly", true);
                          toastr.success(
                            "Factura emitida con éxito (Folio " +
                              data.index +
                              ")"
                          );

                          unaBase.inbox.send({
                            subject:
                              "Ha emitido Factura de venta Nº " +
                              data.index +
                              " / " +
                              $(
                                '#sheet-dtv span[data-name="referencia"]'
                              ).text(),
                            into: "viewport",
                            href:
                              "/v3/views/dtv/content.shtml?id=" +
                              $("#sheet-dtv").data("id"),
                            tag: "avisos"
                          });

                          $.ajax({
                            url: "/4DACTION/_V3_downloadDtv",
                            data: {
                              id: $("#sheet-dtv").data("id"),
                              cedible: false
                            },
                            success: function(data) {
                              window.open(data);
                            }
                          });
                        } else {
                          toastr.warning("Error:\n\n" + data.error);
                        }
                      });
                    }
                  });
                }
              } else {
                toastr.warning(
                  "No es posible emitir documento. El cliente no tiene un RUT válido ingresado."
                );
              }
            }
          });

          // Plane
          buttons.push({
            name: "dtv_emitir_electronico_plane",
            icon: "ui-icon-document",
            caption: "Emitir electrónico (Plane)",
            action: function() {
              var rut = $('[name="contacto[info][rut]"]').val();
              rut = unaBase.data.rut.format(rut);
              if (rut != "" && unaBase.data.rut.validate(rut)) {
                var gironow = $('input[name="contacto[info][giro]"]').val();

                if (gironow.length > 40) {
                  alert(
                    "El giro del cliente es demasiado largo (máximo permitido 40 caracteres). Por favor modificar información desde la ficha del cliente, y luego enviar."
                  );
                } else {
                  var id = $("#sheet-dtv").data("id");

                  var htmlObjectFecha = $(
                    '<section> \
										<span>Por favor confirmar fecha</span><br><br> \
										<input required type="date" name="fecha" style="border: 1px solid lightgrey;"> \
									</section>'
                  );

                  var fecha = $('input[name="fecha_emision"]').val();
                  var year = fecha.substring(6, 10);
                  var month = fecha.substring(3, 5);
                  var day = fecha.substring(0, 2);

                  htmlObjectFecha
                    .find("input")
                    .val(year + "-" + month + "-" + day);

                  htmlObjectFecha.find("input").on("blur change", function() {
                    htmlObjectFecha.data("response", $(this).val());
                  });

                  var tipo_factura = $('input[name="des_tipo_doc"]').val();

                  prompt(htmlObjectFecha).done(function(data) {
                    if (data !== false) {
                      $.ajax({
                        // url: '/4DACTION/_V3_set' + params.entity,
                        url: "/4DACTION/_V3_generadtv_electronico",
                        data: {
                          id: id,
                          fecha: data,
                          tipo_factura: tipo_factura
                        },
                        dataType: "json",
                        type: "POST"
                      }).done(function(data) {
                        if (data.success) {
                          var year = data.date.substring(0, 4);
                          var month = data.date.substring(5, 7);
                          var day = data.date.substring(8, 10);

                          $("#sheet-dtv")
                            .find('span[data-name="folio"]')
                            .text(data.index);
                          $("#sheet-dtv")
                            .find('span[data-name="fecha_emision"]')
                            .text(day + "-" + month + "-" + year);
                          $("#sheet-dtv")
                            .find('span[data-name="estado"]')
                            .text("EMITIDA");
                          $("#sheet-dtv")
                            .find('input[name="folio"]')
                            .val(data.index);
                          $("#sheet-dtv")
                            .find('input[name="fecha_emision"]')
                            .val(day + "-" + month + "-" + year);
                          // falta cambiar fecha de vencimiento
                          $("#menu")
                            .find('[data-name="dtv_emitir_manual"]')
                            .hide();
                          $("#menu")
                            .find('[data-name="dtv_emitir_electronico"]')
                            .hide();
                          $("#menu")
                            .find('[data-name="dtv_pdf_electronico"]')
                            .show();
                          $("#sheet-dtv")
                            .find("button.edit")
                            .hide();
                          $("#sheet-dtv")
                            .find("input.edit, textarea.edit")
                            .prop("readonly", true)
                            .removeClass("datepicker");
                          $("#sheet-dtv table.items")
                            .find("input")
                            .prop("readonly", true);
                          toastr.success(
                            "Factura emitida con éxito (Folio " +
                              data.index +
                              ")"
                          );

                          unaBase.inbox.send({
                            subject:
                              "Ha emitido Factura de venta Nº " +
                              data.index +
                              " / " +
                              $(
                                '#sheet-dtv span[data-name="referencia"]'
                              ).text(),
                            into: "viewport",
                            href:
                              "/v3/views/dtv/content.shtml?id=" +
                              $("#sheet-dtv").data("id"),
                            tag: "avisos"
                          });

                          $.ajax({
                            url: "/4DACTION/_V3_downloadDtv",
                            data: {
                              id: $("#sheet-dtv").data("id"),
                              cedible: false
                            },
                            success: function(data) {
                              window.open(data);
                            }
                          });
                        } else {
                          toastr.warning("Error:\n\n" + data.error);
                        }
                      });
                    }
                  });
                }
              } else {
                toastr.warning(
                  "No es posible emitir documento. El cliente no tiene un RUT válido ingresado."
                );
              }
            }
          });
        }

        if ($.inArray("dtv_nc_emitir_manual", params.buttons) != -1)
          buttons.push({
            name: "dtv_nc_emitir_manual",
            icon: "ui-icon-document",
            caption: "Emitir manual",
            action: function() {
              var saved = menu
                .find('[data-name="save"] button')
                .triggerHandler("click");
              if (!saved.success) event.stopImmediatePropagation();

              var rut = $('[name="contacto[info][rut]"]').val();
              rut = unaBase.data.rut.format(rut);
              if (rut != "" && unaBase.data.rut.validate(rut)) {
                var id = notas.id;

                /*var htmlObjectFolio = $('<section> \
									<span>Por favor confirmar folio</span><br><br> \
									<input required type="number" name="folio" min="1" step="1" style="border: 1px solid lightgrey;"> \
								</section>');*/

                var htmlObjectFolio = $(
                  '<section> \
									<span>Por favor confirmar folio</span><br><br> \
									<input required type="text" name="folio" style="border: 1px solid lightgrey;"> \
								</section>'
                );

                htmlObjectFolio.find("input").val(notas.data.next_folio);
                htmlObjectFolio.find("input").on("blur change", function() {
                  htmlObjectFolio.data("response", $(this).val());
                });

                var htmlObjectFecha = $(
                  '<section> \
									<span>Por favor confirmar fecha</span><br><br> \
									<input required class="datepicker" type="date" name="fecha" style="border: 1px solid lightgrey;"> \
								</section>'
                );

                htmlObjectFecha.find("input").val(notas.data.current_date);
                htmlObjectFecha.find("input").on("blur change", function() {
                  htmlObjectFecha.data("response", $(this).val());
                });

                prompt(htmlObjectFolio).done(function(data) {
                  if (data !== false)
                    prompt(htmlObjectFecha).done(function(subdata) {
                      if (subdata !== false) {
                        $.ajax({
                          url: "/4DACTION/_V3_generadtv_nc_manual",
                          data: {
                            id: id,
                            folio: data,
                            fecha: subdata,
                            tipo_nc: notas.data.des_tipo_doc
                          },
                          dataType: "json",
                          type: "POST"
                        }).done(function(data) {
                          if (data.success) {
                            notas.data.folio = data.index;
                            notas.data.fecha_emision = data.date;
                            notas.container
                              .find('span[data-name="folio"]')
                              .text(notas.data.folio);
                            notas.container
                              .find('span[data-name="fecha_emision"]')
                              .text(notas.data.fecha_emision);
                            notas.container
                              .find('span[data-name="estado"]')
                              .text("EMITIDA");
                            notas.container
                              .find('input[name="folio"]')
                              .val(notas.data.folio);
                            notas.container
                              .find('input[name="fecha_emision"]')
                              .val(notas.data.fecha_emision);
                            notas.display();
                            toastr.success(
                              "Nota de crédito emitida con éxito (Folio " +
                                notas.data.folio +
                                ")"
                            );
                            /*unaBase.inbox.send({
															subject: 'Ha emitido Nota de crédito Nº ' + notas.data.folio + ' / ' + notas.data.referencia,
															into: 'viewport',
															href: '/v3/views/dtv/nc/content.shtml?id=' + notas.id,
															tag: 'avisos'
														});*/
                          } else {
                            toastr.warning(
                              "El folio se encuentra repetido (Folio " +
                                notas.data.folio +
                                ")"
                            );
                          }
                        });
                      }
                    });
                });
              } else {
                toastr.warning(
                  "No es posible emitir el documento. El cliente no tiene un RUT válido ingresado."
                );
              }
            }
          });

        if ($.inArray("dtv_nc_emitir_electronico", params.buttons) != -1)
          buttons.push({
            name: "dtv_nc_emitir_electronico",
            icon: "ui-icon-document",
            caption: "Emitir electrónico",
            action: function() {
              var saved = menu
                .find('[data-name="save"] button')
                .triggerHandler("click");
              if (!saved.success) {
                event.stopImmediatePropagation();
              }

              var rut = $('[name="contacto[info][rut]"]').val();
              rut = unaBase.data.rut.format(rut);

              if (rut != "" && unaBase.data.rut.validate(rut)) {
                var gironow = $('input[name="contacto[info][giro]"]').val();

                if (gironow.length > 40) {
                  alert(
                    "El giro del cliente es demasiado largo (máximo permitido 40 caracteres). Por favor modificar información desde la ficha del cliente, y luego enviar."
                  );
                } else {
                  var id = notas.id;

                  var htmlObjectFecha = $(
                    '<section> \
										<span>Por favor confirmar fecha</span><br><br> \
										<input required type="date" name="fecha" style="border: 1px solid lightgrey;"> \
									</section>'
                  );

                  var fecha = $('input[name="fecha_emision"]').val();
                  var year = fecha.substring(6, 10);
                  var month = fecha.substring(3, 5);
                  var day = fecha.substring(0, 2);

                  htmlObjectFecha
                    .find("input")
                    .val(year + "-" + month + "-" + day);

                  htmlObjectFecha.find("input").on("blur change", function() {
                    htmlObjectFecha.data("response", $(this).val());
                  });

                  var tipo_nc = $('input[name="des_tipo_doc"]').val();

                  prompt(htmlObjectFecha).done(function(data) {
                    if (data !== false) {
                      $.ajax({
                        url: "/4DACTION/_V3_generadtv_nc_electronico",
                        data: {
                          id: id,
                          fecha: data,
                          tipo_nc: tipo_nc
                        },
                        dataType: "json",
                        type: "POST"
                      }).done(function(data) {
                        if (data.success) {
                          notas.data.folio = data.index;
                          notas.data.fecha_emision = data.date;
                          notas.container
                            .find('span[data-name="folio"]')
                            .text(notas.data.folio);
                          notas.container
                            .find('span[data-name="fecha_emision"]')
                            .text(notas.data.fecha_emision);
                          notas.container
                            .find('span[data-name="estado"]')
                            .text("EMITIDA");
                          notas.container
                            .find('input[name="folio"]')
                            .val(notas.data.folio);
                          notas.container
                            .find('input[name="fecha_emision"]')
                            .val(notas.data.fecha_emision);
                          notas.display();
                          toastr.success(
                            "Nota de crédito emitida con éxito (Folio " +
                              notas.data.folio +
                              ")"
                          );
                          $.ajax({
                            url: "/4DACTION/_V3_downloadDtvNC",
                            data: {
                              id: notas.id,
                              cedible: false
                            },
                            success: function(data) {
                              window.open(data);
                            }
                          });
                        } else {
                          toastr.warning("Error:\n\n" + data.error);
                        }
                      });
                    }
                  });
                }
              } else {
                toastr.warning(
                  "No es posible emitir el documento. El cliente no tiene un RUT válido ingresado."
                );
              }
            }
          });

        if ($.inArray("dtv_pdf_electronico", params.buttons) != -1)
          buttons.push({
            name: "dtv_pdf_electronico",
            icon: "ui-icon-document",
            caption: "Descargar documento electrónico",
            action: function() {
              var id = $("#sheet-dtv").data("id");

              confirm(
                "Por favor indique la copia del documento",
                "Original",
                "Cedible"
              ).done(function(data) {
                if (data === true) {
                  $.ajax({
                    url: "/4DACTION/_V3_downloadDtv",
                    data: {
                      id: id,
                      cedible: false
                    },
                    success: function(data) {
                      window.open(data);
                    }
                  });
                }
                if (data === false) {
                  $.ajax({
                    url: "/4DACTION/_V3_downloadDtv",
                    data: {
                      id: id,
                      cedible: true
                    },
                    success: function(data) {
                      window.open(data);
                    }
                  });
                }
              });
            }
          });

        if ($.inArray("dtv_pdf_electronico_FEPE", params.buttons) != -1)
          buttons.push({
            name: "dtv_pdf_electronico_FEPE",
            icon: "ui-icon-document",
            caption: "Descargar PDF + XML",
            action: function() {
              dtv.getFiles();
            }
          });

        if ($.inArray("dtv_pdf_electronico_FEPE_NC", params.buttons) != -1)
          buttons.push({
            name: "dtv_pdf_electronico_FEPE_NC",
            icon: "ui-icon-document",
            caption: "Descargar PDF + XML",
            action: function() {
              notas.getFiles();
            }
          });

        if ($.inArray("dtv_nc_pdf_electronico", params.buttons) != -1)
          buttons.push({
            name: "dtv_nc_pdf_electronico",
            icon: "ui-icon-document",
            caption: "Descargar documento electrónico",
            action: function() {
              var id = notas.id;
              confirm(
                "Por favor indique la copia del documento",
                "Original",
                "Cedible"
              ).done(function(data) {
                if (data === true) {
                  $.ajax({
                    url: "/4DACTION/_V3_downloadDtvNC",
                    data: {
                      id: id,
                      cedible: false
                    },
                    success: function(data) {
                      window.open(data);
                    }
                  });
                }
                if (data === false) {
                  $.ajax({
                    url: "/4DACTION/_V3_downloadDtvNC",
                    data: {
                      id: id,
                      cedible: true
                    },
                    success: function(data) {
                      window.open(data);
                    }
                  });
                }
              });
            }
          });

        /* BEGIN: Reglas de validación */

        if ($.inArray("new_rv", params.buttons) != -1)
          buttons.push({
            name: "new_rv",
            icon: "ui-icon-document",
            caption: "Crear",
            action: function() {
              $.ajax({
                url: "/4DACTION/_V3_set" + params.entity,
                dataType: "json",
                type: "POST"
              }).done(function(data) {
                unaBase.loadInto.viewport(
                  "/v3/views/ajustes/validaciones/content.shtml?id=" + data.id
                );
              });
            }
          });

        if ($.inArray("delete_rv", params.buttons) != -1)
          buttons.push({
            name: "delete_rv",
            icon: "ui-icon-trash",
            caption: "Eliminar",
            action: function() {
              confirm(MSG.get("CONFIRM_VALIDACION_DELETE")).done(function(
                data
              ) {
                if (data) {
                  $.ajax({
                    url: "/4DACTION/_V3_remove" + params.entity,
                    dataType: "json",
                    data: {
                      id: params.data().id
                    },
                    success: function(data) {
                      if (data.success) {
                        toastr.info(NOTIFY.get("SUCCESS_DELETE_VALIDACION"));
                        unaBase.loadInto.viewport(
                          "/v3/views/ajustes/validaciones/list.shtml"
                        );
                      } else {
                        if (data.opened) {
                          if (data.readonly)
                            toastr.error(
                              NOTIFY.get("ERROR_RECORD_READONLY", "Error")
                            );
                        }
                      }
                    },
                    error: function(xhr, text, error) {
                      toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
                    }
                  });
                }
              });
            }
          });

        /* END: Reglas de validación */

        /* BEGIN: Validaciones */

        if ($.inArray("validate", params.buttons) != -1) {
          buttons.push(
            {
              name: "validate_send",
              icon: "ui-icon-info",
              caption: "Solicitar validación",
              action: function() {
                //initLogValidacion();

                //$('#menu li[data-name="save"] button').trigger('click');
                var saved = menu
                  .find('[data-name="save"] button')
                  .triggerHandler("click");
                if (!saved.success) event.stopImmediatePropagation();
                $.ajax({
                  url: "/4DACTION/_V3_setLogValidacion",
                  data: {
                    table: $("section.sheet").data("entity"),
                    id_record: $("section.sheet").data("id"),
                    index_record: $("section.sheet").data("index"),
                    ref_record: $("section.sheet")
                      .find("[data-text]")
                      .val(),
                    clear: true
                  },
                  dataType: "json",
                  async: false,
                  success: function(data) {
                    if (data.success) {
                      initLogValidacion(true);
                      toastr.success(NOTIFY.get("SUCCESS_VALIDACION_REQUEST"));
                      $('#menu > ul > li[data-name="validate_request"]').hide();

                      /*$.ajax({
												url: '/4DACTION/_V3_getLogValidacionByIndex',
												data: {
													index: $('section.sheet').data('entity') + '|' + $('section.sheet').data('id')
												},
												dataType: 'json',
												success: function(subdata) {
													if (subdata.rows.length > 0)
														$('#scrollval').show();
													var record_name = $('section.sheet').data('record-name');
													$.each(subdata.rows, function(key, entry) {
														unaBase.email.notify(entry.username, 'validation_request', record_name, entry.record.index, entry.record.text, null, $('section.sheet').data('module') + '/content.shtml', entry.record.id);
														unaBase.inbox.send({
															to: entry.username,
															//subject: 'Solicita validar ' + record_name + ' Nº ' + entry.record.index + ' / ' + entry.record.text,
															subject: 'Solicita validar ' + record_name + ' Nº ' + entry.record.index + ' / ' + entry.record.text,
															into: 'viewport',
															href: '/v3/views/'+ $('section.sheet').data('module') + '/content.shtml?id=' + entry.record.id,
															tag: 'solicitudes'
														});
													});
												}
											});*/

                      unaBase.log.save(
                        "Ha solicitado validación",
                        "cotizaciones",
                        $("section.sheet").data("index"),
                        $("section.sheet").data("id")
                      );
                    } else toastr.error(NOTIFY.get("ERROR_RECORD_READONLY"));
                  }
                });
              }
            },
            {
              name: "validate_request",
              icon: "ui-icon-info",
              caption: "Reiniciar validación",
              action: function() {
                switch (params.entity) {
                  case "Cotizacion":
                    deferReglaValidacion =
                      typeof deferReglaValidacion == "undefined"
                        ? false
                        : deferReglaValidacion;
                    if (deferReglaValidacion)
                      $.ajax({
                        url: "/4DACTION/_V3_setCotizacion",
                        data: {
                          id: $("section.sheet").data("id"),
                          "cotizacion[approved]": false
                        },
                        dataType: "json",
                        success: function(data) {
                          $.ajax({
                            url: "/4DACTION/_V3_setLogValidacion",
                            data: {
                              table: $("section.sheet").data("entity"),
                              id_record: $("section.sheet").data("id"),
                              index_record: $("section.sheet").data("index"),
                              ref_record: $("section.sheet")
                                .find("[data-text]")
                                .val(),
                              clear: true
                            },
                            dataType: "json",
                            success: function(subdata) {
                              unaBase.loadInto.viewport(
                                "/v3/views/" +
                                  $("section.sheet").data("module") +
                                  "/content.shtml?id=" +
                                  $("section.sheet").data("id"),
                                undefined,
                                undefined,
                                true
                              );
                              unaBase.log.save(
                                "Ha reiniciado el proceso de validación",
                                "cotizaciones",
                                $("section.sheet").data("index"),
                                $("section.sheet").data("id")
                              );
                            }
                          });
                        }
                      });
                    else {
                      $.ajax({
                        url: "/4DACTION/_V3_setCotizacion",
                        data: {
                          id: $("section.sheet").data("id"),
                          "cotizacion[approved]": false
                        },
                        dataType: "json",
                        success: function(supdata) {
                          $("section.sheet").data("approved", false);
                          $("section.sheet")
                            .find("input, textarea, tr button, tr span")
                            .prop("disabled", false);
                          $("section.sheet")
                            .find(
                              "tr button, tr span.ui-icon, ul.editable button, footer button"
                            )
                            .show();
                          $("nav.toolbox")
                            .find(' \
														[data-name="discard"] \
													')
                            .show();

                          $(".validation-status").text("No validada");

                          $.ajax({
                            url: "/4DACTION/_V3_setLogValidacion",
                            data: {
                              table: $("section.sheet").data("entity"),
                              id_record: $("section.sheet").data("id"),
                              index_record: $("section.sheet").data("index"),
                              ref_record: $("section.sheet")
                                .find("[data-text]")
                                .val(),
                              clear: true
                            },
                            dataType: "json",
                            success: function(data) {
                              if (data.success) {
                                //refreshLogValidacion(true);
                                initLogValidacion();
                                toastr.success(
                                  NOTIFY.get("SUCCESS_VALIDACION_REQUEST")
                                );
                                $(
                                  '#menu > ul > li[data-name="validate_request"]'
                                ).hide();

                                /*$.ajax({
																	url: '/4DACTION/_V3_getLogValidacionByIndex',
																	data: {
																		index: $('section.sheet').data('entity') + '|' + $('section.sheet').data('id')
																	},
																	dataType: 'json',
																	success: function(subdata) {
																		var record_name = $('section.sheet').data('record-name');
																		$.each(subdata.rows, function(key, entry) {
																			unaBase.email.notify(entry.username, 'validation_request', record_name, entry.record.index, entry.record.text, null, $('section.sheet').data('module') + '/content.shtml', entry.record.id);
																			unaBase.inbox.send({
																				to: entry.username,
																				//subject: 'Solicita validar ' + record_name + ' Nº ' + entry.record.index + ' / ' + entry.record.text,
																				subject: 'Solicita validar ' + record_name + ' Nº ' + entry.record.index + ' / ' + entry.record.text,
																				into: 'viewport',
																				href: '/v3/views/'+ $('section.sheet').data('module') + '/content.shtml?id=' + entry.record.id,
																				tag: 'solicitudes'
																			});
																		});
																		unaBase.loadInto.viewport('/v3/views/' + $('section.sheet').data('module') + '/content.shtml?id=' + $('section.sheet').data('id'), undefined, undefined, true);
																	}
																});*/

                                unaBase.log.save(
                                  "Ha reiniciado el proceso de validación",
                                  "cotizaciones",
                                  $("section.sheet").data("index"),
                                  $("section.sheet").data("id")
                                );
                              } else
                                toastr.error(
                                  NOTIFY.get("ERROR_RECORD_READONLY")
                                );
                            }
                          });
                        }
                      });
                    }
                    break;
                  case "Compras":
                    // al pasar por acá, se deben borrar las reglas de validación y habilitar la OC para que sea modificada
                    // de este modo, al guardar la OC se general la solicitud de validaciòn de forma automàtica

                    $.ajax({
                      url: "/4DACTION/_V3_setLogValidacion",
                      data: {
                        table: $("section.sheet").data("entity"),
                        id_record: $("section.sheet").data("id"),
                        index_record: $("section.sheet").data("index"),
                        ref_record: $("section.sheet")
                          .find("[data-text]")
                          .val(),
                        clear: true
                      },
                      dataType: "json",
                      success: function(subdata) {
                        unaBase.log.save(
                          "Ha reiniciado el proceso de validación",
                          "compras",
                          $("section.sheet").data("index"),
                          $("section.sheet").data("id")
                        );
                        unaBase.loadInto.viewport(
                          "/v3/views/compras/content.shtml?id=" +
                            $("section.sheet").data("id") +
                            "&edit=true",
                          undefined,
                          undefined,
                          true
                        );
                      }
                    });

                    break;
                  case "OT":
                    // al pasar por acá, se deben borrar las reglas de validación y habilitar la OC para que sea modificada
                    // de este modo, al guardar la OC se general la solicitud de validaciòn de forma automàtica

                    $.ajax({
                      url: "/4DACTION/_V3_setLogValidacion",
                      data: {
                        table: "OT",
                        id_record: ot.id,
                        index_record: ot.index,
                        ref_record: ot.ref,
                        clear: true
                      },
                      dataType: "json",
                      success: function(subdata) {
                        ot_refresh_permissions();
                        unaBase.log.save(
                          "Ha reiniciado el proceso de validación",
                          "ot",
                          ot.index,
                          ot.id
                        );
                        location.href =
                          "/ot.shtml?id=" + ot.id + "&r=" + Math.random();
                      }
                    });

                    break;
                }
              }
            },
            {
              name: "validate_v2",
              icon: "ui-icon-circle-check",
              caption: "Validar (V2)",
              action: function() {
                if(access._650){
                  $.ajax({
                    url: "/4DACTION/_V3_setCompras",
                    data: {
                      id: $("section.sheet").data("id"),
                      "oc[approved]": true
                    },
                    dataType: "json",
                    success: function(data) {
                      if (data.success) {
                        $("section.sheet").data("validado", true);
                        $(
                          "section.sheet footer article p span:first-of-type"
                        ).text("Validada");

                        $("section.sheet button.add.dtc").visible();
                        $("section.sheet button.add.orden-pago").visible();
                        $("section.sheet button.add.cobro").visible();

                        toastr.success(NOTIFY.get("SUCCESS_VALIDACION_ACCEPT"));
                        $('#menu > ul > li[data-name="validate_v2"]').hide();
                        // Enviar correo validación aceptada
                        var username = $("html > body.menu.home > aside > div > div > h1").data(
                          "username"
                        );
                        var record_name = $(
                          'input[name="oc[tipo_gastos][des]"]'
                        ).val();
                        var index = $("section.sheet").data("index");
                        var text = $('input[name="oc[referencia]"]').val();
                        unaBase.email.notify(
                          username,
                          "validation_accepted",
                          record_name,
                          index,
                          text,
                          null,
                          "compras/content.shtml",
                          $("section.sheet").data("id")
                        );
                        unaBase.inbox.send({
                          to: username,
                          subject:
                            "Aceptó validar " +
                            record_name +
                            "Nº " +
                            index +
                            " / " +
                            text,
                          into: "viewport",
                          href:
                            "/v3/views/compras/content.shtml?id=" +
                            $("section.sheet").data("id"),
                          tag: "avisos"
                        });
                      } else toastr.error(NOTIFY.get("ERROR_RECORD_READONLY"));
                    }
                  });

                }
              }
            }
          );
        }

        // Exceso en fxr
        if ($.inArray("approve_excess", params.buttons) != -1)
          buttons.push({
            name: "approve_excess",
            icon: "ui-icon-info",
            caption: "Validación adicional por exceso",
            action: function() {
              var exceso = $("section.sheet").data("exceso");
              confirm(
                "La rendición está excedida en $" +
                  exceso +
                  "<br>¿Desea validar el exceso?"
              ).done(function(data) {
                if (data) {
                  $.ajax({
                    url: "/4DACTION/_V3_setCompras",
                    data: {
                      id: $("section.sheet").data("id"),
                      excedida: false
                    },
                    dataType: "json",
                    success: function(data) {
                      if (data.success) {
                        toastr.success("Rendición validada por exceso");
                        $('#menu > ul > li[data-name="approve_excess"]').hide();
                        $("section#sheet-compras").data("excedida", false);

                        unaBase.log.save(
                          "Ha validado rendición por exceso",
                          "compras",
                          $("section.sheet").data("index"),
                          $("section.sheet").data("id")
                        );
                      } else toastr.error(NOTIFY.get("ERROR_RECORD_READONLY"));
                    }
                  });
                }
              });
            }
          });
        


//-------------------------- terimna de agregar botones
        menu.find("ul > li").remove();
        menu
          .parentTo("header")
          .find("button")
          .not(":first-of-type")
          .not(".date")
          .not(".search-button")
          .not(".close-button")
          .remove();

        var button;
      // agrega botones al listado horizontal
        for (i in buttons) {
          if (buttons[i].name != "" && buttons[i].caption != "") {
            button = $(
              '<li data-name="' +
                buttons[i].name +
                '"><button>' +
                buttons[i].caption +
                "</button></li>"
            );
            menu.find("ul").append(button);
            menu
              .find("ul > li:last-of-type > button")
              .button({
                icons:
                  typeof buttons[i].icon != "undefined"
                    ? {
                        primary: buttons[i].icon
                      }
                    : buttons[i].icons
              })
              .click(buttons[i].action);
          }
        }

        // TODO: Pasar al CSS el estilo de este botón
        button = $(
          '<button id="dropdown_launcher" class="dropdown-button more" style="display: inline-block; float: right;">Más...</button>'
        );
        button
          .button({
            icons: {
              primary: "ui-icon-gear",
              secondary: "ui-icon-triangle-1-s"
            },
            text: false
          })
          .hide();
        menu.parentTo("header").append(button);
        /*
				var dropdown = $('');

        				$(dropdown).jui_dropdown({
        				launcher_id: 'dropdown_launcher',
        				launcher_container_id: 'dropdown_container',
        				menu_id: 'dropdown_menu',
        				containerClass: 'container1',
        				menuClass: 'menu1',
        				onSelect: function(event, data) {
        				$("#result").text('index: ' + data.index + ' (id: ' + data.id + ')');
        				}
        				});
        */
        menu.show();

        $("body").on("click", "*", function(event) {
          if (
            !$(event.target).hasClass("dropdown-button") &&
            !$(event.target)
              .parent()
              .hasClass("dropdown-button")
          )
            $(".dropdown-menu").hide();
        });
      },
      // unaBase.toolbox.menu.destroy
      destroy: function() {
        var menu = unaBase.toolbox.dialog ? $("#dialog-menu") : $("#menu");
        menu.find("*").off();
        menu.off();
        menu.find("ul > li").remove();
        menu
          .parentTo("header")
          .find("button")
          .not(":first-of-type")
          .remove();
        menu.hide();
        if (!unaBase.toolbox.dialog) {
          $("#dropdown_launcher").remove();
          $("#dropdown_menu").remove();
        }
      },
      // unaBase.toolbox.menu.buttons
      buttons: function(list) {
        var menu = unaBase.toolbox.dialog ? $("#dialog-menu") : $("#menu");

        menu.find("[data-name]").hide();
        $.each(list, function(key, item) {
          menu.find('[data-name="' + item + '"]').show();
        });
      }
    },
    // unaBase.toolbox.form
    // TODO: cambir a unabase.widget o similar, migrando también los archivos que hacen referencia a éste
    form: {
      // Creación de un input con autocomplete.
      /*

			{
				fields: [
					{ local: 'cotizacion[empresa][id]', remote: 'alias', type: 'search', default: true }, // el primero es default
					{ local: 'cotizacion[empresa][razon_social]', remote: 'razon_social', type: 'search' },
					{ local: 'cotizacion[empresa][otro]', remote: 'otro', type: 'search' },
					{ local: 'cotizacion[empresa][otro2]', remote: 'otro2', type: 'text' },
					{ local: 'cotizacion[empresa][otro3]', remote: 'otro3', type: 'email' },
				],
				data: [
					entity: 'Cotizacion',
					filter: 'nombre_completo',
					relationship: function() {
						return {
							key: 'Empresa'
							value: $()
						}
					}
				],
				response: function() {},
				change: function() {},
				select: function() {}
				renderItem: function(ul,item)
			}

			*/

      // unaBase.toolbox.form.autocomplete
      autocomplete: function(params) {
        if ($('input[name="' + params.fields[0].local + '"]').length > 0)
          $('input[name="' + params.fields[0].local + '"]')
            .autocomplete({
              source: function(request, response) {
                var dataParams = {
                  q: request.term,
                  filter:
                    typeof params.data.filter != "undefined"
                      ? params.data.filter
                      : undefined
                };
                if (typeof params.data.relationship != "undefined")
                  $.extend(dataParams, dataParams, params.data.relationship());

                if (typeof params.data.otherParams != "undefined")
                  $.extend(dataParams, dataParams, params.data.otherParams);

                $.ajax({
                  url:
                    "/4DACTION/_V3_" +
                    "get" +
                    params.data.entity +
                    (typeof params.data.relationship != "undefined"
                      ? "By" + params.data.relationship().key
                      : ""),
                  dataType: "json",
                  data: dataParams,
                  async: false, // test
                  success: function(data) {
                    response(
                      $.map(data.rows, function(item) {
                        return item;
                      })
                    );
                  }
                });
              },
              delay: 0,
              minLength: 1,
              autoFocus: params.restrict,
              open: function() {
                $(this)
                  .removeClass("ui-corner-all")
                  .addClass("ui-corner-top");
              },
              close: function(event, ui) {
                $(this)
                  .removeClass("ui-corner-top")
                  .addClass("ui-corner-all");
              },
              focus: function(event, ui) {
                if (!params.restrict)
                  eval("$(this).val(ui.item." + params.fields[0].remote + ")");
                return false;
              },
              response: params.response,
              change: params.change,
              select: params.select
            })
            .data("ui-autocomplete")._renderItem = params.renderItem;
      }
    }
  },
  // unaBase.data
  data: {
    // unaBase.data.rut
    rut: {
      // unaBase.data.rut.validate
      validate: function(rut) {
        var rut = rut.toUpperCase();
        var rutx = rut.replace(/\./g, "");
        /*
				var serial = rut.substring(0, rut.length - 2);
				var k = serial.length - 1;
				var producto = [];
				for (var i = 2; i <= 7 && k >= 0; i++) {
					if (serial.charAt(k) != '.')
						producto.push(i * parseInt(serial.charAt(k)));
					else
						i--;
					k--;
					if (i == 7)
						i = 1;
				}
				var suma = 0;

				for (i = 0; i < producto.length; i++)
					suma+= producto[i];

				var dv = (function() { return (11 - (suma % 11) < 10)? (11 - (suma % 11)).toString() : 'K' })();

				return (rut.substring(rut.length - 1, rut.length) == dv)? true : false;
				*/
        if (rutx != "") {
          var count = 0;
          var count2 = 0;
          var factor = 2;
          var suma = 0;
          var sum = 0;
          var digito = 0;
          var arrRut = rutx.split("-");

          var rut = arrRut[0];
          var dvIn = arrRut[1];

          count2 = rut.length - 1;
          while (count < rut.length) {
            sum = factor * parseInt(rut.substr(count2, 1));
            suma = suma + sum;
            sum = 0;

            count = count + 1;
            count2 = count2 - 1;
            factor = factor + 1;

            if (factor > 7) {
              factor = 2;
            }
          }
          digito = 11 - (suma % 11);

          if (digito == 11) {
            digito = 0;
          }
          if (digito == 10) {
            digito = "K";
          }
          //form.dig.value = digito;

          if (digito == dvIn) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      },
      // unaBase.data.rut.format
      format: function(rut) {
        var filtered = rut.replace(/\./g, "").replace(/\-/g, "");
        serial = filtered.substring(0, filtered.length - 1);
        serial = parseInt(serial);
        serial = isNaN(serial) ? 0 : serial;
        serial = serial.toString();

        var formatted = "";
        var k = 0;
        for (var i = serial.length - 1; i >= 0; i--) {
          formatted = serial.charAt(i) + formatted;
          if ((k + 1) % 3 == 0 && i > 0) formatted = "." + formatted;
          k++;
        }

        var retval = "";
        if (formatted != "" && filtered != "")
          retval = formatted + "-" + filtered.charAt(filtered.length - 1);

        return retval;
      }
    }
  },
  // unaBase.email
  email: {
    // unaBase.email.notify
   
      notify: async function(
      to,
      template,
      document,
      index,
      title,
      extra,
      detail_uri,
      id_item,
      attach,
      userValidator,
      nameValidator,
      emailValidator,
      print_negocio,
      msgBody,
      isEjecutivoResponsable,
      moduleName,
      id_usuario_notificacion){
        console.warn("/////////////////////// proxy email");
        // const email = await import("./unabase/email.js?1");
        const email = import("./unabase/email.js?1");
        email.then(functions => {
          

          functions.notify(  to,
                template,
                document,
                index,
                title,
                extra,
                detail_uri,
                id_item,
                attach,
                userValidator,
                nameValidator,
                emailValidator,
                print_negocio,
                msgBody,
                isEjecutivoResponsable,
                moduleName,
                id_usuario_notificacion)
        })

      },


    // notify: function(
    //   to,
    //   template,
    //   document,
    //   index,
    //   title,
    //   extra,
    //   detail_uri,
    //   id_item,
    //   attach,
    //   userValidator,
    //   nameValidator,
    //   emailValidator,
    //   print_negocio,
    //   msgBody,
    //   isEjecutivoResponsable,
    //   moduleName,
    //   id_usuario_notificacion
    // ) {
      
    //   // verificacion para enviar adjunto el pdf del negocio, en el caso que este activado el parametro
    //   let isValidationRequest = false;
    //   if (template == "validation_request" && print_negocio) {
    //     isValidationRequest = true;
    //   }

    //   if (typeof attach == "undefined") attach = false;

    //   var sid = "";
    //   $.each($.cookie(), function(clave, valor) {
    //     if (clave == hash && valor.match(/UNABASE/g)) sid = valor;
    //   });

    //   if (typeof userValidator == "undefined" || isValidationRequest) {
    //     if ($("html > body.home > aside > div > div > h1").length == 0) {
    //       var from = v3_data_username;
    //     } else {
    //       var from = $("body > aside > div > div > h1").data("username");
    //     }

    //     if ($("html > body.home > aside > div > div > h1").length == 0) {
    //       var from_name = v3_data_username_name;
    //     } else {
    //       var from_name = $("html > body.home > aside > div > div > h1")
    //         .text()
    //         .capitalizeAllWords();
    //     }

    //     if ($("html > body.home > aside > div > div > h1").length == 0) {
    //       var from_email = v3_data_username_email;
    //     } else {
    //       var from_email = $("html > body.menu.home > aside > div > div > h1").data("email");
    //     }
    //   } else {
    //     var from = userValidator;
    //     var from_name = nameValidator;
    //     var from_email = emailValidator;
    //   }

    //   var to_name;
    //   var to_email;
    //   var subject;
    //   var allow_email;

    //   $.ajax({
    //     url: "/4DACTION/_V3_getUsuario",
    //     data: {
    //       id: to
    //     },
    //     dataType: "json",
    //     async: false,
    //     success: function(data) {
    //       var current = data.rows[0];
    //       to_name = (
    //         current.nombres.trim() +
    //         " " +
    //         current.ap_pat.trim()
    //       ).trim();
    //       //to_name = to_name.capitalizeAllWords();
    //       to_email = current.email;
    //       allow_email = current.allow_email;
    //     }
    //   });

    //   var sendMsg = function(
    //     to_name,
    //     document,
    //     index,
    //     title,
    //     from_name,
    //     extra,
    //     detail_uri,
    //     id_item,
    //     print_negocio,
    //     msgBody,
    //     isEjecutivoResponsable,
    //     moduleName
    //   ) {
    //     var retval;
    //     $.ajax({
    //       url: "/v3/views/email/" + template + ".shtml",
    //       dataType: "html",
    //       async: false,
    //       success: function(data) {
    //         retval = $("<div>").html(data);
    //       }
    //     });
    //     retval.find("[data-to-name]").html(to_name);
    //     retval.find("[data-document]").html(document);
    //     if (typeof msgBody !== "undefined") {
    //       retval.find("[data-content]").html(msgBody(index));
    //     }

    //     retval.find("[data-index]").html(index);
    //     retval.find("[data-title]").html(title);
    //     retval.find("[data-from-name]").html(from_name);
    //     retval.find("[data-extra]").html(extra);

    //     retval
    //       .find("[data-recipient]")
    //       .html(
    //         isEjecutivoResponsable ? "eres responsable" : "has sido copiado"
    //       );

    //     if (id_usuario_notificacion) {
    //       retval
    //         .find("[data-unsubscribe]")
    //         .attr(
    //           "href",
    //           window.location.origin +
    //             "/4DACTION/_V3_disableNotify?id=" +
    //             id_usuario_notificacion
    //         );
    //     } else {
    //       retval
    //         .find("[data-unsubscribe]")
    //         .closest("span")
    //         .remove();
    //     }

    //     // --ini-- agregado 18-11-16 / gin (seccion observacicones en fxr cuando el usuario solicitante tiene fxr pendientes)
    //     if (document == "Rendición de fondos") {
    //       $.ajax({
    //         url: "/4DACTION/_V3_getInfoFxrValidacion",
    //         data: {
    //           id: id_item
    //         },
    //         dataType: "json",
    //         async: false,
    //         success: function(dato) {
    //           if (dato.cantidad == 0) {
    //             var obs =
    //               '<span style="margin:5px!important;padding:2px;display:inline-block;font-weight:bold;">Ninguna.</span>';
    //             retval.find(".observacionval").html(obs);
    //           } else {
    //             if (dato.cantidad == 1) {
    //               var obs =
    //                 '<span style="margin:5px!important;background-color:orange!important;padding:2px;display:inline-block;font-weight:bold;">El solicitante (' +
    //                 dato.solicitante +
    //                 ") cuenta con (1) Rendición pendiente.</span>";
    //               retval.find(".observacionval").html(obs);
    //             } else {
    //               var obs =
    //                 '<span style="margin:5px!important;background-color:orange!important;padding:2px;display:inline-block;font-weight:bold;">El solicitante (' +
    //                 dato.solicitante +
    //                 ") cuenta con (" +
    //                 dato.cantidad +
    //                 ") Rendiciones pendientes.";
    //               retval.find(".observacionval").html(obs);
    //             }
    //             if (dato.cantidad < 6) {
    //               $.each(dato.rows, function(key, item) {
    //                 var uri =
    //                   "http://" +
    //                   window.location.hostname +
    //                   ":" +
    //                   window.location.port +
    //                   "/4DACTION/wbienvenidos#" +
    //                   detail_uri +
    //                   "?id=" +
    //                   item.id;
    //                 retval
    //                   .find(".rendiciones ul")
    //                   .append(
    //                     "<li>Fxr Nro. " +
    //                       item.folio +
    //                       ", para revisar <a href=" +
    //                       uri +
    //                       ">haz clic aquí.</a></li>"
    //                   );
    //               });
    //             } else {
    //               var uri =
    //                 "http://" +
    //                 window.location.hostname +
    //                 ":" +
    //                 window.location.port +
    //                 "/4DACTION/wbienvenidos#compras/list_rendiciones.shtml";
    //               retval
    //                 .find(".rendiciones ul")
    //                 .append(
    //                   "<li>Para revisar la lista de pendientes, <a href=" +
    //                     uri +
    //                     ">ingresar aquí.</a></li>"
    //                 );
    //             }
    //           }
    //         }
    //       });
    //     } else {
    //       retval.find(".fxr").hide();
    //     }
    //     // --fin-- agregado 18-11-16 / gin (seccion observacicones en fxr cuando el usuario solicitante tiene fxr pendientes)

    //     retval
    //       .find("[data-href]")
    //       .prop(
    //         "href",
    //         "http://" +
    //           window.location.hostname +
    //           ":" +
    //           window.location.port +
    //           "/4DACTION/wbienvenidos#" +
    //           detail_uri +
    //           "?id=" +
    //           id_item
    //       );
    //     subject = retval.find("[data-subject]").text();
    //     var now = new Date();
    //     retval
    //       .find("[data-date]")
    //       .html(
    //         now.getDate() + "-" + (now.getMonth() + 1) + "-" + now.getFullYear()
    //       );
    //     retval
    //       .find("[data-time]")
    //       .html(
    //         ("0" + now.getHours()).slice(-2) +
    //           ":" +
    //           ("0" + now.getMinutes()).slice(-2) +
    //           ":" +
    //           ("0" + now.getSeconds()).slice(-2)
    //       );
    //       if(id_item === null){
    //         retval.find("#contentLink").remove();
    //       }
    //     return retval.html();
    //   };

    //   if (allow_email) {
    //     var msg = sendMsg(
    //       to_name,
    //       document,
    //       index,
    //       title,
    //       from_name,
    //       extra,
    //       detail_uri,
    //       id_item,
    //       print_negocio,
    //       msgBody,
    //       isEjecutivoResponsable,
    //       moduleName
    //     );

    //     var nameFile = "";
    //     var from_module_name = "";
    //     if (moduleName == "compras") {
    //       if (document == "Orden de Compra") {
    //         from_module_name = "OC_";
    //       } else {
    //         from_module_name = "FXR_";
    //       }
    //     }
    //     if (moduleName == "rendiciones") {
    //       from_module_name = "FXR_";
    //     }
    //     if (moduleName == "cotizaciones" || moduleName == "negocios") {
    //       from_module_name = "COT_";
    //     }
    //     var nameFile2 =
    //       $("section.sheet").length > 0
    //         ? $("section.sheet").data("record-name") + "_"
    //         : from_module_name;

    //     // pdf notificación conversión negocio a cotización
    //     if (nameFile2 == "undefined_") {
    //       nameFile2 = "COT_";
    //     }

    //     var id_neg_gasto = 0;
    //     var folio_neg_gasto = "";
    //     var mostrar_pdf_negocio_en_email_gasto = false;

    //     if (
    //       typeof compras != "undefined" &&
    //       ($('html > body.menu.home > aside > div > div > ul > li[data-name="gastos"].active')
    //         .length > 0 ||
    //         $(
    //           'html > body.menu.home > aside > div > div > ul > li[data-name="rendiciones"].active'
    //         ).length > 0)
    //     ) {
    //       nameFile = compras.tipoGasto;
    //       if (compras.tipoGasto == "FXR") {
    //         // nameFile2 = "Rendicion_de_fondos_";
    //         nameFile2 = file_name_oficial_fxr;
    //       } else {
    //         // nameFile2 = "Orden_de_compra_";
    //         nameFile2 = file_name_oficial_oc;
    //       }

    //       id_neg_gasto = compras.id_nv_negocio;
    //       folio_neg_gasto = compras.folio_negocio;
    //       mostrar_pdf_negocio_en_email_gasto = compras.mostrar_pdf_negocio;
    //     }

    //     //if ($('#main-container').length > 0 || $('section.sheet').length > 0) {
    //       let previewState = template === 'validation_request' ? 'true': 'false'

    //     if ($("html > body.home > aside > div > div > h1").length > 0) {
    //       var moduleName = $("section.sheet").data("module")
    //         ? $("section.sheet").data("module")
    //         : "cotizaciones";
    //       var url_print_normal =
    //         "http://" +
    //         nodejs_public_ipaddr +
    //         ":" +
    //         nodejs_port +
    //         "/download/?download=true&entity=" +
    //         moduleName +
    //         "&entitytwo=" +
    //         nameFile +
    //         "&id=" +
    //         id_item +
    //         "&folio=" +
    //         (typeof index != "undefined" ? index : "S/N") +
    //         "&sid=" +
    //         unaBase.sid.encoded() +
    //         "&preview="+previewState+"&nullified=false&port=" +
    //         window.location.port;
    //     } else {
    //       // error en entity
    //       var url_print_normal =
    //         "http://" +
    //         nodejs_public_ipaddr +
    //         ":" +
    //         nodejs_port +
    //         "/download/?download=true&entity=" +
    //         moduleName +
    //         "&entitytwo=" +
    //         moduleName +
    //         "&id=" +
    //         id_item +
    //         "&folio=" +
    //         (typeof index != "undefined" ? index : "S/N") +
    //         "&sid=" +
    //         unaBase.sid.encoded() +
    //         "&preview="+previewState+"&nullified=false&port=" +
    //         window.location.port;
    //     }

    //     var url_print_extendida =
    //       "http://" +
    //       nodejs_public_ipaddr +
    //       ":" +
    //       nodejs_port +
    //       "/print/?entity=negocios&id=" +
    //       $("#main-container").data("id") +
    //       "&folio=" +
    //       (typeof $("#main-container").data("index") != "undefined"
    //         ? $("#main-container").data("index")
    //         : "S/N") +
    //       "&sid=" +
    //       unaBase.sid.encoded() +
    //       "&nullified=" +
    //       $("#main-container").data("readonly") +
    //       "&horizontal=true&port=" +
    //       window.location.port +
    //       "&hostname=" +
    //       window.location.origin;

    //     if (!attach) {
    //       if (typeof msgBody !== "undefined") {
    //         var attachments = [
    //           {
    //             cid: "empresa.jpg",
    //             url:
    //               "http://" +
    //               window.location.hostname +
    //               ":" +
    //               window.location.port +
    //               "/4DACTION/logo_empresa_web"
    //           }
    //         ];
    //       } else {
    //         var attachments = [
    //           {
    //             cid: "logo.png",
    //             url:
    //               "http://" +
    //               window.location.hostname +
    //               ":" +
    //               window.location.port +
    //               "/v3/design/html/body.menu/nav/h1.png"
    //           },
    //           {
    //             cid: "empresa.jpg",
    //             url:
    //               "http://" +
    //               window.location.hostname +
    //               ":" +
    //               window.location.port +
    //               "/4DACTION/logo_empresa_web"
    //           }
    //         ];
    //       }
    //     } else {
    //       if (typeof msgBody !== "undefined") {
    //         var attachments = [
    //           {
    //             cid: "empresa.jpg",
    //             url:
    //               "http://" +
    //               window.location.hostname +
    //               ":" +
    //               window.location.port +
    //               "/4DACTION/logo_empresa_web"
    //           },
    //           {
    //             // cid: ((typeof print_negocio == 'undefined')? nameFile2 : 'cotizacion_interna_') + ((typeof index != 'undefined')? index : 'S_N') + '.pdf',
    //             cid:
    //               (typeof print_negocio == "undefined"
    //                 ? nameFile2
    //                 : file_name_internal_cot) +
    //               (typeof index != "undefined" ? index : "S_N") +
    //               ".pdf",
    //             url:
    //               typeof print_negocio == "undefined"
    //                 ? url_print_normal
    //                 : url_print_extendida
    //           }
    //         ];
    //         $.extend(attachments, attachments, attach);
    //       } else {
    //         // pdf del negocio asociado a al gasto
    //         var url_negocio_gasto = "";
    //         let url_cotizacion_validar = "";
    //         if (id_neg_gasto > 0 && isValidationRequest) {
    //           url_negocio_gasto =
    //             "http://" +
    //             nodejs_public_ipaddr +
    //             ":" +
    //             nodejs_port +
    //             "/print/?entity=negocios&id=" +
    //             id_neg_gasto +
    //             "&folio=" +
    //             folio_neg_gasto +
    //             "&sid=" +
    //             unaBase.sid.encoded() +
    //             "&nullified=" +
    //             $("#main-container").data("readonly") +
    //             "&horizontal=true&hostname=" +
    //             window.location.origin;


    //         }
            
    //         if (mostrar_pdf_negocio_en_email_gasto && url_negocio_gasto != "" ) {
    //           var attachments = [
    //             {
    //               cid: "logo.png",
    //               url:
    //                 "http://" +
    //                 window.location.hostname +
    //                 ":" +
    //                 window.location.port +
    //                 "/v3/design/html/body.menu/nav/h1.png"
    //             },
    //             {
    //               cid: "empresa.jpg",
    //               url:
    //                 "http://" +
    //                 window.location.hostname +
    //                 ":" +
    //                 window.location.port +
    //                 "/4DACTION/logo_empresa_web"
    //             },
    //             {
    //               cid:
    //                 (typeof print_negocio == "undefined"
    //                   ? nameFile2
    //                   : file_name_internal_cot) +
    //                 (typeof index != "undefined" ? index : "S_N") +
    //                 ".pdf",
    //               url:
    //                 typeof print_negocio == "undefined"
    //                   ? url_print_normal
    //                   : url_print_extendida
    //             },
    //             {
    //               cid: "Negocio_nro_" + folio_neg_gasto + ".pdf",
    //               url: url_negocio_gasto
    //             }
    //           ];
    //         } else {
    //           var attachments = [
    //             {
    //               cid: "logo.png",
    //               url:
    //                 "http://" +
    //                 window.location.hostname +
    //                 ":" +
    //                 window.location.port +
    //                 "/v3/design/html/body.menu/nav/h1.png"
    //             },
    //             {
    //               cid: "empresa.jpg",
    //               url:
    //                 "http://" +
    //                 window.location.hostname +
    //                 ":" +
    //                 window.location.port +
    //                 "/4DACTION/logo_empresa_web"
    //             },
                
    //             {
    //               cid:
    //                 (typeof print_negocio == "undefined"
    //                   ? nameFile2
    //                   : file_name_internal_cot) +
    //                 (typeof index != "undefined" ? index : "S_N") +
    //                 "ext.pdf",
    //               url: url_print_normal
    //             }
    //           ];
    //           if(isValidationRequest){
    //             attachments.push({
    //               cid:
    //                 (typeof print_negocio == "undefined"
    //                   ? nameFile2
    //                   : file_name_internal_cot) +
    //                 (typeof index != "undefined" ? index : "S_N") +
    //                 ".pdf",
    //               url: url_print_extendida
    //               // url:
    //               //   typeof print_negocio == "undefined"
    //               //     ? url_print_normal
    //               //     : url_print_extendida
    //             })
    //           }

    //         }

    //         if (typeof attachments != "undefined") {
    //           //$.extend(attachments, attachments, attach);
    //           for (var i = 0; i < attach.length; i++) {
    //             attachments.push(attach[i]);
    //           }
    //         } else {
    //           var attachments = [
    //             {
    //               cid: "logo.png",
    //               url:
    //                 "http://" +
    //                 window.location.hostname +
    //                 ":" +
    //                 window.location.port +
    //                 "/v3/design/html/body.menu/nav/h1.png"
    //             },
    //             {
    //               cid: "empresa.jpg",
    //               url:
    //                 "http://" +
    //                 window.location.hostname +
    //                 ":" +
    //                 window.location.port +
    //                 "/4DACTION/logo_empresa_web"
    //             }
    //           ];
    //           $.extend(attachments, attachments, attach);
    //         }
    //       }
    //     }

    //     /*console.log('');
				// console.log($('section.sheet').data('module'));*/

      
    //     $.ajax({
    //       url:
    //         "http://" +
    //         nodejs_public_ipaddr +
    //         ":" +
    //         nodejs_port +
    //         "/generic-email/",
    //       data: {
    //         sid: sid,
    //         to: to_email,
    //         subject: subject,
    //         msg: msg,
    //         attachments: JSON.stringify(attachments),
    //         from: from_email,
    //         username: from,
    //         port: window.location.port
    //       },
    //       type: "GET",
    //       dataType: "jsonp",
    //       success: function(data) {},
    //       error: function(data) {}
    //     });
     
    //   }
    // },
    data: () => {
      return JSON.parse(localStorage.getItem("emailData"));
    }
  },
  // unaBase.inbox
  inbox: {
    // unaBase.inbox.send
    send: function(params, callback) {
      if(typeof params.notifyId !== "undefined"){
        
        $.ajax({
          url: "/4DACTION/_V3_getUsuarioNotifyBySubject",
          data: {
            subject: params.subject,
            notifyId: params.notifyId
          },
          dataType: "json",
          success: function(data) {
            if (params.current_username != undefined) {
              var current_username = params.current_username;
            } else {
              if ($("body > aside > div > div > h1").data("username") == undefined) {
                var current_username = v3_data_username;
              } else {
                var current_username = $("body > aside > div > div > h1").data(
                  "username"
                );
              }
            }


            var template = "notify";
            switch (params.template) {
              case "notify_modificacion_cotizacion":
                template = "notify_modificacion_cotizacion";
                params.subject =
                  "Notificación de cambio en cotización Nº " + params.index;
                break;
              case "notify_modificacion_negocio":
                template = "notify_modificacion_negocio";
                params.subject =
                  "Notificación de cambio en negocio Nº " + params.index;
                break;
            }

            for (var i = 0; i < data.rows.length; i++) {
              //unaBase.email.notify(username, 'notify', record_name, index, text, null, 'compras/content.shtml', $('section.sheet').data('id'));

           
                if (data.rows[i].id != current_username) {
                   
                      unaBase.email.notify(
                        data.rows[i].id,
                        template,
                        params.subject,
                        params.index,
                        undefined,
                        undefined,
                        href,
                        params.id,
                        params.attach,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        params.msgBody,
                        undefined,
                        params.href.split("/")[3],
                        data.rows[i].subscription_id
                      );
                    
                
              }
            }
     

            if (typeof callback != "undefined") callback();
          },
          error: function(data) {
            console.log(data);
          }
        });
      }else{   
        var data = {};
        data.to = params.to;
        data.text = params.text;
        data.subject = params.subject;
        data.tag = params.tag;
        
        switch (params.into) {
          case "viewport":
            data.action =
              params.into +
              ":" +
              params.href +
              ":" +
              (typeof params.standalone != undefined
                ? params.standalone
                  ? "standalone"
                  : ""
                : "");
            break;
          case "dialog":
            data.action = params.into + ":" + params.href + ":" + params.size;
            break;
          case "iframe":
            data.action = params.into + ":" + params.href;
            break;
          case "blank":
            data.action = params.into + ":" + params.href;
            break;
        }

        $.ajax({
          url: "/4DACTION/_V3_setInbox",
          data: data,
          dataType: "json",
          success: function(data) {
            if (typeof params.to == "undefined" || params.tag == "avisos") {
              if (params.href !== undefined) {
                var href = params.href.split("?")[0].split("/v3/views/")[1]
                  ? params.href.split("?")[0].split("/v3/views/")[1]
                  : "ot.shtml";
                var id = params.href.split("?id=")[1];
              } else {
                var href, id;
              }

              // forzar adjunto si es notificación de validación aceptada
              if (params.subject.toLowerCase().indexOf("aceptó validar") !== -1) {
                params.attach = true;
              }

              // extraer folio desde asunto si no viene definido por parámetro
              if (params.index == undefined) {
                var parts = params.subject.split(" ");
                for (var i = 0, len = parts.length; i < len; i++) {
                  if (parts[i] == "Nº") {
                    params.index = parts[i + 1];
                    break;
                  }
                }
              }
              $.ajax({
                url: "/4DACTION/_V3_getUsuarioNotifyBySubject",
                data: {
                  subject: params.subject,
                  module: params.href.split("/")[3]
                    ? params.href.split("/")[3]
                    : "ot",
                  id: id
                },
                dataType: "json",
                success: function(data) {
                  if (params.current_username != undefined) {
                    var current_username = params.current_username;
                  } else {
                    if ($("body > aside > div > div > h1").data("username") == undefined) {
                      var current_username = v3_data_username;
                    } else {
                      var current_username = $("body > aside > div > div > h1").data(
                        "username"
                      );
                    }
                  }

                  //$.each(data.rows, function(row) {

                  var template = "notify";
                  switch (params.template) {
                    case "notify_modificacion_cotizacion":
                      template = "notify_modificacion_cotizacion";
                      params.subject =
                        "Notificación de cambio en cotización Nº " + params.index;
                      break;
                    case "notify_modificacion_negocio":
                      template = "notify_modificacion_negocio";
                      params.subject =
                        "Notificación de cambio en negocio Nº " + params.index;
                      break;
                  }

                  var forma_pago = $('input[name="forma_pago[descripcion]"]')
                    .length
                    ? $('input[name="forma_pago[descripcion]"]').val()
                    : "";

                  for (var i = 0; i < data.rows.length; i++) {
                    //unaBase.email.notify(username, 'notify', record_name, index, text, null, 'compras/content.shtml', $('section.sheet').data('id'));

                    if (
                      !(
                        data.rows[i].id.toUpperCase() == "OQUINCHEL" &&
                        forma_pago != "AL DIA"
                      )
                    ) {
                      if (data.rows[i].id != current_username) {
                        if (typeof params.ejecutivo_responsable !== "undefined") {
                          if (
                            params.ejecutivo_responsable.login !== data.rows[i].id
                          ) {
                            unaBase.email.notify(
                              data.rows[i].id,
                              template,
                              params.subject,
                              params.index,
                              undefined,
                              undefined,
                              href,
                              id,
                              params.attach,
                              undefined,
                              undefined,
                              undefined,
                              undefined,
                              params.msgBody,
                              undefined,
                              params.href.split("/")[3],
                              data.rows[i].subscription_id
                            );
                          }
                        } else {
                          unaBase.email.notify(
                            data.rows[i].id,
                            template,
                            params.subject,
                            params.index,
                            undefined,
                            undefined,
                            href,
                            id,
                            params.attach,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            params.msgBody,
                            undefined,
                            params.href.split("/")[3],
                            data.rows[i].subscription_id
                          );
                        }
                      }
                    }
                  }
                  //});
                  if (typeof params.ejecutivo_responsable !== "undefined") {
                    if (params.ejecutivo_responsable.login != current_username) {
                      unaBase.email.notify(
                        params.ejecutivo_responsable.login,
                        template,
                        params.subject,
                        params.index,
                        undefined,
                        undefined,
                        href,
                        id,
                        params.attach,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        params.msgBody,
                        true,
                        params.href.split("/")[3]
                      );
                    }
                  }

                  if (typeof callback != "undefined") callback();
                },
                error: function(data) {
                  console.log(data);
                }
              });
            }
          },
          error: function(data) {
            console.log(data);
          }
        });
      }

    }
  },
  // unaBase.history
  history: {
    _stack: {
      back: [],
      forward: []
    },
    _last: {},
    save: function(url, type, skip_history) {
      if (typeof skip_history == "undefined") {
        unaBase.history._stack.back.push({
          url: url,
          standalone: type
        });
      }
      unaBase.history._last = {
        url: url,
        standalone: type
      };
    },
    back: function(cb) {
      
      unaBase.history._stack.forward.push(unaBase.history._stack.back.pop());
      var record =
        unaBase.history._stack.back[unaBase.history._stack.back.length - 1];
      unaBase.history._last = record;
      unaBase.loadInto.viewport(record.url, undefined, record.standalone, true);
      if (typeof cb !== "undefined") {
        cb();
      }
    },
    forward: function() {
      var record = unaBase.history._stack.forward.pop();
      unaBase.history._stack.back.push(record);
      unaBase.history._last = record;
      unaBase.loadInto.viewport(record.url, undefined, record.standalone, true);
    },
    current: function() {
      //return unaBase.history._stack.back[unaBase.history._stack.back.length - 1];
      return unaBase.history._last;
    }
  },
  files: {
    // unaBase.files.upload
    upload: function(params) {}
  },
  // unaBase.log
  // log: {
  //   // unaBase.log.save
  //   save: function(text, modulo, index, id, descripcion_larga) {
  //     $.ajax({
  //       url: "/4DACTION/_V3_setLogsFromWeb",
  //       type: "POST",
  //       dataType: "json",
  //       data: {
  //         id: id !== undefined ? id : 0,
  //         folio: index,
  //         descripcion: text,
  //         modulo: modulo,
  //         descripcion_larga:
  //           descripcion_larga !== undefined ? descripcion_larga : ""
  //       },
  //       async: false
  //     }).done(function(data) {
  //       if (!data.success) {
  //         toastr.error(NOTIFY.get("ERROR_RECORD_READONLY"));
  //       }
  //     });
  //   }
  // },
  contacto: {
    // unaBase.contacto.getById
    getById: function(id) {
      var datos = {};
      $.ajax({
        url: "/4DACTION/_V3_getContactoById",
        data: {
          id: id
        },
        dataType: "json",
        async: false,
        success: function(data) {
          datos = data;
        },
        error: function(data) {
          toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
        }
      });
      return datos;
    },
    set: function(contacto) {
      $.ajax({
        url: "/4DACTION/_V3_setContacto",
        dataType: "json",
        type: "POST",
        data: contacto,
        async: false
      }).done(function(data) {
        if (data.success) {
          toastr.success(
            "Datos del " +
              contacto.labelMsg.toLowerCase() +
              " actualizados correctamente."
          );
        } else {
          toastr.error(NOTIFY.get("ERROR_RECORD_READONLY"));
        }
      });
    }
  }
};

(async () => {
  const log = await import("./unabase/log.js");
  Object.assign(unaBase, log);
  // const email = await import("./unabase/email.js?1");
  // Object.assign(unaBase, email);
  // const history = await import("./unabase/history.js");
  // Object.assign(unaBase, history);

})();
