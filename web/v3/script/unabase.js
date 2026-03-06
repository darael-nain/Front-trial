/* API de UnaBase */


// unaBase
var unaBase = {
  params: {},
  getParams: () => {
    axios(window.location.origin + "/4DACTION/_V3_GetParamsJson").then(res => {
      unaBase.params = res.data;
    }).catch(err => {
      console.warn("error getting params");
    });
  },
  doc: {},
  // unaBase.getFilters()
  getFilters: () => {
    return $("#search").serializeAnything(true);
  },
  //unaBase.sid
  sid: {
    //unaBase.sid.encoded
    encoded: () => {
      let sid = "";
      $.each($.cookie(), function (clave, valor) {
        if (clave == hash && valor.match(/UNABASE/g)) sid = valor;
      });
      return encodeURIComponent(sid);
    },
    raw: () => {
      let sid = "";
      $.each($.cookie(), function (clave, valor) {
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
    clearCallback() {
      unaBase.save.callback = null;
    }
  },
  print: {
    url(params) {
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
      $.each($.cookie(), function (clave, valor) {
        if (valor.match(/UNABASE/g)) sid += valor;
      });
      // var query = url.parse(req.url, true, true).query;
      // var hostname = req.headers.referer.replace(/\/4DACTION\/(.*)/g, '');
      var hostname = params.hostname;
      let aliasfiles = params.aliasfiles;
      console.log(`entra a print ${params.entity}`);
      let native = uVar.nativePrint ? '_native' : '';
      // console.log(url.parse(req.url, true, true));
      // console.log('Generating a PDF of ' + query.entity + ' ' + query.id + ', this may take a while.');

      let viewUrl;


      // console.log(query.formch + " --- " + query.entity + " --- "+query);
      if (params.entity == "pagos") {
        if (params.form == "boucher") {
          params.aliasfiles = "PAGO_";
          // var viewUrl = hostname + '/v3/views/' + params.entity + '/'+ params.form + '.shtml?id=' + params.id + '&sid=' + sid + '&preview=' + params.preview + '&nullified=' + params.nullified;
          viewUrl = `${hostname}/v3/views/${params.entity}/${params.form}${native}.shtml?id=${params.id}&sid=${sid}&preview=${params.preview}&nullified=${params.nullified}`;
        } else {
          params.aliasfiles = "PAGO_";
          // var viewUrl = hostname + '/v3/views/' + params.entity + '/'+ params.form + '.shtml?id=' + params.id + '&sid=' + sid + '&preview=' + params.preview + '&nullified=' + params.nullified;
          viewUrl = `${hostname}/v3/views/${params.entity}/${params.form}${native}.shtml?id=${params.id}&sid=${sid}&preview=${params.preview}&nullified=${params.nullified}`;
        }
      } else {
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
      printFrame.src = viewUrl;
      return viewUrl;
    },
    set_deprecated(data) {
      //unaBase.print.set        
      // deprecated  

      let params = {
        entity: data.entity,
        aliasfiles: $("section.sheet").data("tipogasto"),
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
    unset() {
      //unaBase.print.unset
      let printFrame = document.querySelector('iframe[name="printFrame"]');
      printFrame.src = '';
    }
  },
  // current: {},
  currency: {
    uf: {
      get() { },
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
    set: function (functor, time) {
      var id = setInterval(functor, time);
      unaBase.interval._stack.push(id);
    },
    clearAll: function () {
      while (unaBase.interval._stack.length > 0) {
        clearInterval(unaBase.interval._stack.pop());
      }
    }
  },
  // unaBase.changeControl
  changeControl: {
    // init: function () {
    //   unaBase.changeControl.hasChange = false;
    //   
    //   $("#viewport").live(
    //     "change.changeControl",
    //     "input, textarea, select",
    //     function (event) {
    //       
    //       if (event.originalEvent !== undefined) {
    //         unaBase.changeControl.hasChange = true;
    //         // unaBase.changeControl.isSaved = false;
    //         event.stopPropagation();
    //         $(event.target).unbind("change.changeControl");
    //       }
    //     }
    //   );
    // },
    init: function () {

      unaBase.changeControl.hasChange = false;

      // Almacenar valores originales
      $("#viewport").find("input, textarea, select").each(function () {
        $(this).data('original-value', $(this).val());
      });

      $("#viewport").on("change.changeControl", "input, textarea, select", function (event) {
        var originalValue = $(this).data('original-value') || "";
        var currentValue = $(this).val();

        // Verificar si el valor ha cambiado realmente

        if (currentValue !== originalValue) {
          unaBase.changeControl.hasChange = true;
          $(this).data('original-value', currentValue); // Actualizar el valor original
        }

        event.stopPropagation();
      });
    },



    query: function () {
      return unaBase.changeControl.hasChange;
    }
  },
  // unaBase.ui
  ui: {
    isBlocked: false,
    isLoaded: false,
    // unaBase.ui.block
    block: function () {
      // const jumpGameCanvas = document.getElementById('jumpGameCanvas');
      // const jumpGameContext = jumpGameCanvas.getContext('2d');
      // const jumpGameResetButton = document.getElementById('jumpGameResetButton');

      // // Crear el worker
      // const worker = new Worker('/v3/script/jumpGameWorker.js');

      // worker.onmessage = function (e) {
      //   const data = e.data;
      //   if (data.type === 'draw') {
      //     draw(data.state);
      //   } else if (data.type === 'gameOver') {
      //     jumpGameContext.font = "30px Arial";
      //     jumpGameContext.fillText("Game Over", 300, 100);
      //     jumpGameResetButton.style.display = 'block';
      //   }
      // };

      // function draw(state) {
      //   jumpGameContext.clearRect(0, 0, jumpGameCanvas.width, jumpGameCanvas.height);
      //   jumpGameContext.fillStyle = '#333';
      //   jumpGameContext.fillRect(state.dino.x, state.dino.y, state.dino.width, state.dino.height);
      //   jumpGameContext.fillStyle = '#888';
      //   state.obstacles.forEach(obstacle => {
      //     jumpGameContext.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      //   });
      // }

      // const resetGame = () => {
      //   jumpGameResetButton.style.display = 'none';
      //   worker.postMessage({ type: 'reset' });
      // }

      // jumpGameResetButton.addEventListener('click', resetGame);

      // document.addEventListener('keydown', (e) => {
      //   if (e.code === 'Space') {
      //     worker.postMessage({ type: 'jump' });
      //   }
      // });
      const facts = [
        "¿Sabías que el primer largometraje de animación de la historia fue 'El Apóstol', realizado en 1917 en Argentina?",
        "La película 'Titanic' fue la primera película de Hollywood que tuvo un presupuesto que superó los 200 millones de dólares.",
        "El director Alfred Hitchcock hizo un cameo en cada una de sus películas.",
        "La escena de la ducha en 'Psicosis' tardó 7 días en filmarse y consta de más de 70 ángulos de cámara diferentes.",
        "La industria del cine en India, conocida como Bollywood, produce alrededor de 1,000 películas al año, más que cualquier otro país en el mundo.",
        "El primer uso conocido de efectos especiales en una película fue en 1895 por Alfred Clark en 'The Execution of Mary, Queen of Scots'.",
        "La película muda 'Wings' (1927) fue la primera en ganar el Premio de la Academia a la Mejor Película.",
        "El color se introdujo por primera vez en las películas a tiempo completo en la película 'El mundo a color' en 1917.",
        "La frase 'En serio, no me llama así' nunca fue dicha por Sherlock Holmes en los libros de Arthur Conan Doyle, pero es famosa por las adaptaciones cinematográficas.",
        "El récord de la película con más tomas de una escena se lo lleva 'El resplandor', con 127 tomas para la escena del bate de béisbol.",
        "El largometraje 'El nacimiento de una nación' de 1915 fue el primero en tener una duración de más de dos horas.",
        "Pixar tardó casi 29 horas en renderizar un solo cuadro para la película 'Monstruos University' debido a la complejidad de los personajes y efectos.",
        "El actor James Cameron escribió el guion de 'The Terminator' basándose en un sueño febril que tuvo en Roma.",
        "La película 'Parásito' de Bong Joon-ho fue la primera película en idioma no inglés en ganar el Oscar a la Mejor Película en 2020.",
        "El lobo utilizado en 'El lobo de Wall Street' no es real, sino una creación CGI.",
        "En 'Piratas del Caribe', Johnny Depp improvisó la línea icónica 'Savvy?', que no estaba en el guion original.",
        "La famosa escena del espejo en 'Taxi Driver' fue improvisada por Robert De Niro.",
        "La película 'Boyhood' de Richard Linklater fue filmada intermitentemente durante 12 años para capturar el envejecimiento real de su actor principal.",
        "En 'Toy Story 2', la escena de borrado accidental de Woody fue inspirada por un incidente real donde Pixar casi pierde la película debido a un comando de computadora erróneo.",
        "La famosa línea 'You talkin' to me?' de Robert De Niro en 'Taxi Driver' también fue improvisada y no estaba en el guion original.",
        "Pixar desarrolló su propio software de animación llamado RenderMan, que ha sido usado por estudios como Marvel y DreamWorks.",
        "El famoso sonido del sable láser de Star Wars fue creado combinando el zumbido de un proyector viejo y el golpeteo de un cable contra un poste.",
        "Walt Disney recibió un Oscar especial por Blancanieves: una estatuilla grande y siete pequeñas, por ser el primer largometraje animado de la historia.",
        "Las campañas publicitarias ganadoras en Cannes Lions a menudo tienen presupuestos pequeños, pero ideas creativas enormes.",
        "El personaje de Gollum en El Señor de los Anillos fue uno de los primeros en combinar captura de movimiento avanzada con animación 3D realista.",
        "La película 'The Social Network' ganó el Oscar a mejor montaje, a pesar de tener muchas escenas con personajes hablando sentados.",
        "La famosa escena del helicóptero en 'Apocalypse Now' fue filmada sin permiso del ejército y usaron helicópteros reales prestados por Filipinas.",
        "Las campañas creativas más premiadas suelen tener componentes sociales o de impacto real, más allá del producto.",
        "La película 'Mad Max: Fury Road' ganó 6 premios Oscar, la mayoría por diseño de producción, edición y vestuario: pilares de la creatividad visual.",
        "Durante años, las marcas no podían usar el término 'Super Bowl' en sus anuncios, por derechos legales, así que usaban frases como 'El gran juego'.",
        "El comercial de Apple 'Think Different' homenajeó a íconos creativos como Einstein, Gandhi y Picasso, y nunca mostró el producto.",
        "La animación 'Spider-Man: Into the Spider-Verse' utilizó técnicas visuales innovadoras como animar algunos personajes a diferentes fps para destacar su estilo.",
        "La creatividad en publicidad no siempre es costosa: el anuncio viral de Dollar Shave Club costó solo $4,500 y transformó la empresa.",
        "Muchas películas ganadoras de diseño de producción usan esquemas de color simbólicos que comunican emociones sin que el espectador lo note.",
        "El logo de DreamWorks fue creado originalmente como un dibujo en papel, y la idea del niño en la luna vino de Steven Spielberg.",
        "Los efectos visuales de 'Inception' combinaron CGI y sets reales giratorios para las escenas del pasillo que se inclinaba.",
        "En el cine, los directores suelen usar el color rojo para enfocar la atención del espectador, especialmente en escenas clave.",
        "Los tráilers modernos están diseñados por agencias externas especializadas en captar la atención en los primeros 5 segundos.",
        "Muchos anuncios virales no se enfocan en vender directamente, sino en contar historias humanas que generan conexión emocional.",
        "Hollywood tiene consultores de marca que revisan guiones para incluir productos estratégicamente, práctica conocida como product placement.",
        "En 'Avatar', cada minuto de metraje tomó aproximadamente 47 horas en renderizar debido a la complejidad visual de Pandora.",
        "La campaña 'Share a Coke' de Coca-Cola aumentó las ventas por primera vez en más de una década al personalizar botellas con nombres.",
        "La banda sonora de 'Psicosis', compuesta solo con cuerdas, fue tan efectiva que Hitchcock duplicó el presupuesto del compositor como agradecimiento.",
        "El logo de Universal Studios ha evolucionado 13 veces desde 1914 para reflejar cambios en la tecnología y la estética cinematográfica.",
        "La película 'Gravity' ganó el Oscar por mejores efectos visuales, a pesar de que casi todo el film fue grabado en pantalla verde con CGI completo.",
        "Un comercial tailandés sobre gratitud y solidaridad de una compañía telefónica se volvió viral globalmente sin mostrar el producto hasta el final.",
        "El actor Andy Serkis revolucionó la industria con su actuación de Gollum y luego como César en 'El Planeta de los Simios', empujando los límites de la captura de movimiento.",
        "Steven Spielberg filmó y editó un cortometraje a los 12 años, que fue proyectado en un cine local: se llamaba 'Escape to Nowhere'.",
        "El primer comercial de Apple Macintosh en 1984 solo fue emitido una vez por televisión, durante el Super Bowl, y cambió el marketing digital para siempre.",
        "Algunos directores como Wes Anderson usan simetría y paletas de color como parte de su lenguaje visual creativo, reconocido a nivel mundial.",
        "La animación de 'Up' ganó el Oscar en parte por su emotiva introducción, que cuenta una historia de vida sin diálogos en solo 4 minutos.",
        "En 'The Revenant', el director Alejandro G. Iñárritu insistió en grabar solo con luz natural, lo que extendió el rodaje varios meses.",
        "La agencia DDB creó en los 60s la icónica campaña 'Think Small' para Volkswagen, considerada una de las mejores campañas publicitarias de todos los tiempos.",
        "El tráiler de 'El resplandor' fue prohibido inicialmente por mostrar demasiado 'sangre', aunque en realidad solo usaron agua teñida.",
        "Netflix utiliza algoritmos de inteligencia artificial para diseñar sus miniaturas personalizadas, aumentando el porcentaje de clics por usuario.",
        "La campaña 'Real Beauty Sketches' de Dove fue vista más de 114 millones de veces en su primer mes, convirtiéndose en el video publicitario más viral del mundo en 2013.",
        "La película 'Sin City' fue grabada completamente sobre fondos verdes, y todos los escenarios fueron agregados digitalmente en postproducción.",
        "Los colores pastel en películas como 'La La Land' fueron usados intencionalmente para evocar nostalgia por el cine clásico.",
        "Algunas agencias publicitarias usan neurociencia para medir reacciones cerebrales a comerciales antes de aprobarlos.",
        "La técnica de 'match cut' usada en '2001: Odisea del espacio', donde un hueso lanzado se convierte en una nave, es uno de los cortes más estudiados en escuelas de cine."
      ];


      let currentFactIndex = 0;
      let factInterval;

      function showRandomFact() {
        if (factInterval) clearInterval(factInterval);
        const randomIndex = Math.floor(Math.random() * facts.length);
        document.getElementById('curiousFact').innerText = facts[randomIndex];
        factInterval = setInterval(showRandomFact, 20000);
      }





      if (!unaBase.ui.isBlocked) {
        console.debug("Blocking UI");
        //$('html > body.menu.home >  div.loader')[0].style.display = 'block';
        $("div.loader")[0].style.display = "";
        console.debug("UI blocked!");
        toastr.clear();
        $("[data-help]").each(function () {
          $(this).qtip("hide");
          //$(this).qtip('disable');
        });
        //$('html > body.menu.home').css('cursor', 'progress');
        $("html").css("cursor", "progress");
        unaBase.ui.isBlocked = true;
        // Cambiar cada 10 segundos
        showRandomFact();
      }
    },
    // unaBase.ui.unblock
    unblock: function () {
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
        try {
          $("div.loader")[0].style.display = "none";

        } catch (err) {
          console.log(err);
        }
        console.debug("UI unblocked!");
      }
    },
    // unaBase.ui.expandable
    expandable: {
      // unaBase.ui.expandable._reset
      _reset: function () {
        $("button.expand").unbind("click");
      },
      // unaBase.ui.expandable.init
      init: function () {
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
          $("button.expand.active").each(function () {
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
          $("button.expand.active").each(function () {
            $(this).triggerHandler("click");
            $(this).button("option", {
              icons: {
                primary: "ui-icon-triangle-1-n"
              },
              caption: "Contraer"
            });
          });

        $("button.expand.opened").each(function () {
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
            $(".exclude-from-template").each(function () {
              $(this).remove();
            });
      },
      // unaBase.ui.expandable._expandContent
      _expandContent: function () {
        var element = this;
        $(this)
          .siblings(".expandable")
          .toggle(0, function () {
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
  init: function () {
    $(".tooltip").tooltipster();

    //$('html > body.menu.home > section > div.loader').hide();
    $("div.loader").hide();
    $("html > body.menu.home > section > h1").hide();

    $(window).bindWithDelay(
      "resize",
      function () {
        unaBase._resize.body();
        unaBase._resize.iframe();
        unaBase._resize.viewport();
      },
      1000,
      true
    );

    $("html > body.menu > section > header").hide();

    $("#search > fieldset").hide();
    $("#search > button").click(function () {
      $("#search > fieldset").toggle(400, "easeInOutExpo");
      $("#search > button").toggleClass("active");
      $("#search > button").removeClass("enabled");
    });

    $("#search > label, html > body.menu > section > header > nav *").click(
      function (event) {
        $("#search > fieldset").hide(400, "easeInOutExpo");
        $("#search > button").removeClass("active");
      }
    );

    $("html > body.menu > footer > article.chat").hide();

    $("html > body.menu > footer > button").click(function () {
      $("html > body.menu > footer > article.chat").toggle();
    });

    $("html > body.menu > footer > article.chat > header").click(function () {
      $(this)
        .parent()
        .hide();
    });

    $("#iframe > iframe").load(function () {
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

    $("html").on("click", "*", function (event) {
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
    body: function () {
      var height = parseInt($(window).height());
      $("html > body.menu.home").height(height);
    },
    // unaBase._resize.iframe
    iframe: function () {
      var height = parseInt($(window).height()) - 130;
      $("#iframe > iframe")
        .parent()
        .height(height);
    },
    // unaBase._resize.viewport
    viewport: function () {
      // Obtén la altura total del viewport (ventana del navegador)
      var windowHeight = $(window).height();
      // Calcula la altura ocupada por los elementos superiores e inferiores
      var headerHeight = $("#newheader").outerHeight(true) || 0; // Altura del header principal
      var mainSectionPadding = parseInt($(".main-section").css("padding-top") || 0) +
        parseInt($(".main-section").css("padding-bottom") || 0); // Padding del main-section
      var fullHeightHeader = $(".full-height.header-btns").outerHeight(true) || 0; // Altura del header adicional
      var footerHeight = $("footer.footer-page").outerHeight(true) || 0; // Altura del footer
      // Calcula la altura disponible para el viewport
      var viewportHeight = (windowHeight - 40) - (headerHeight + mainSectionPadding + fullHeightHeader + footerHeight);
      // Ajusta la altura del viewport
      $("#viewport").css("height", viewportHeight + "px");

      // Configuración adicional si el elemento tiene `.fht-table-init`
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
    init: function (dialog) {
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
      $("[data-help]").each(function () {
        $(this).qtip("hide");
        $(this).qtip("disable");
      });
    },
    ready: function (skip_history, href) {
      // if (typeof skip_history != 'undefined' && $('#search').css('display') != 'none')
      if (typeof skip_history != "undefined" && $("#search").is(":visible")) {
        unaBase.toolbox.search.restore();
      }

      // $.ajax({
      //   url: "/4DACTION/_V3_getTooltip",
      //   data: {
      //     path: href
      //   },
      //   dataType: "json",
      //   success: function (data) {
      //     if (typeof data.success != "undefined") {
      //       $().toasty("hideAll");
      //       $().toasty({
      //         title: data.title,
      //         message: data.text,
      //         autoHide: data.time,
      //         position: "tr"
      //       });
      //     }
      //   }
      // });
    },
    // unaBase.loadInto.iframe
    iframe: function (href = "") {
      if (typeof href != 'undefined') {

        if (href == "")
          href = unaBase.links(event.currentTarget.dataset.link) + `?sid=${unaBase.sid.encoded()}&hostn=${location.origin}`

        href += href.includes('?') ? `&v=${Math.random() + Math.random()}` : '?' + `v=${Math.random() + Math.random()}`
      }

      const link = event.currentTarget.dataset.link
      if (link == "vx") {
        window.open('https://app.unabase.cc', '_blank');
        return
      }


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
    viewport: function (href, title, standalone, skip_history, varData) {
      try {
        href += href.includes('?') ? `&v=${Math.random() + Math.random()}` : '?' + `v=${Math.random() + Math.random()}`
        unaBase.save.clearCallback();

        unaBase.doc = {};
        unaBase.print.unset();
        uVar.data = null;
        //$('#viewport').trigger('load');
        try {
          if (typeof Intercom != "undefined") Intercom("update");
        } catch (err) {
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
        //if (typeof skip_history == 'undefined')
        unaBase.history.save(href, standalone, skip_history);
        unaBase.ui.block()
        $.ajax({
          type: "GET",
          url: href,
          dataType: "html",
          cache: false
        }).done(function (html) {

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
          // if (
          //   typeof window.Chat !== "undefined" &&
          //   uVar.enableChatOnline &&
          //   uVar.enableSocket
          // ) {
          //   window.Chat.ping();
          // }

          //REAPER OPTIMIZACION TEST NO DESCOMENTAR
          // setTimeout(function() {
          //   unaBase.ui.unblock();
          // }, 500);
        });
        if (typeof varData !== "undefined") {
          uVar.data = varData;
        }
      } catch (ex) {
        console.log('viewport: ', ex)
      }
    },
    // unaBase.loadInto.dialog
    // verificar dialog duplicado en linea 276
    dialog: function (href, title, size, iframe, back_url, aboveLoader = false, moduloO, otra1, otra2) {
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
      let from = ''

      if (href.includes("from")) {
        // Obtener la parte de la cadena después de "from="
        var queryString = href.split("from=")[1];

        // Obtener el valor de la variable "from"
        from = queryString.split("&")[0];

      }


      switch (size) {

        case "x-small":
          width = 240;
          height = 180;
          break;
        case "xm-small":
          width = 480;
          height = 150;
          break;
        case "xm2-small":
          width = 480;
          height = 300;
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
          width = from == 'oc' ? 1000 : 850;
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
        case "medium-large":
          width = 750;
          height = 490;
          break;
      }
      if (!iframe) {

        unaBase.ui.block();
        $.ajax({
          url: href,
          success: function (data) {
            unaBase.loadInto._dialog = true;

            if (title === null) {
              $(data).each(function () {
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
										<input class="search-dialog" autocomplete="off" type="search" name="q" placeholder="Ingrese datos clave..." >	\
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
                  beforeClose: function (event, ui) {

                    if (moduloO) {
                      if (moduloO == "DTC") {
                        if (dtc.data.estado !== undefined && dtc.data.estado == "POR EMITIR") {
                          $.ajax({
                            url: "/4DACTION/_V3_borrar_comprobante",
                            data: {
                              "id": dtc.id,
                              "tipo": "DTC"
                            },
                            dataType: "json",
                            success: function (data) {
                              // if (typeof event.isTrigger == "undefined") {
                              //   unaBase.history.back();
                              // }
                            },
                            error: function (xhr, text, error) {
                              toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                            }
                          });

                        }
                      }
                      if (moduloO == "EGRESOS") {
                        if (payment.estado !== undefined && payment.estado == "POR EMITIR") {

                          $.ajax({
                            url: "/4DACTION/_V3_borrar_comprobante",
                            data: {
                              "id": payment.id,
                              "tipo": "OP"
                            },
                            dataType: "json",
                            success: function (data) {
                              // if (typeof event.isTrigger == "undefined") {
                              //   unaBase.history.back();
                              // }
                            },
                            error: function (xhr, text, error) {
                              // toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                            }
                          });

                        }
                      }

                      if (moduloO == "DTV") {
                        if (dtv.estado !== undefined && dtv.estado == "POR EMITIR") {

                          $.ajax({
                            url: "/4DACTION/_V3_borrar_comprobante",
                            data: {
                              "id": dtv.id,
                              "tipo": "DTV"
                            },
                            dataType: "json",
                            success: function (data) {
                              // if (typeof event.isTrigger == "undefined") {
                              //   unaBase.history.back();
                              // }
                            },
                            error: function (xhr, text, error) {
                              // toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                            }
                          });

                        }
                      }

                      if (moduloO == "INGRESO") {
                        if (otra1 !== undefined && otra2 == "Pendiente") {


                          $.ajax({
                            url: "/4DACTION/_V3_removeDocIngreso",
                            data: {
                              "id": otra1,
                              "tipo": "INGRESO"
                            },
                            dataType: "json",
                            success: function (data) {
                              // if (typeof event.isTrigger == "undefined") {
                              //   unaBase.history.back();
                              // }
                            },
                            error: function (xhr, text, error) {
                              // toastr.error(NOTIFY.get("ERROR_INTERNAL"));
                            }
                          });

                        }
                      }
                    }

                    var target, retval;
                    if (!unaBase.toolbox.dialogDestroying) {
                      target = element.find('li[data-name^="cancel"] > button');

                      if (target.length == 1) target.click();
                      // verificar !
                      retval = !target.length == 1;
                    } else retval = true;
                    return retval;
                  },
                  close: function (event, ui) {

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
            if (typeof back_url != "undefined" && back_url !== false) {
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
                .click(function () {
                  unaBase.loadInto.dialog(back_url);
                });
              $("#dialog-menu > ul").prepend(back_button);

            }

            unaBase.ui.unblock();

            if (aboveLoader) setAboveLoader();
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
        element.find("iframe").load(function (event) {
          unaBase.ui.unblock();
        });
        element
          .dialog({
            modal: true,
            width: width,
            height: height,
            title: title,
            scrollbars: false,
            close: function (event, ui) {

              element.remove();
              unaBase.toolbox.dialog = false;
              unaBase.toolbox.dialogDestroying = false;
            }
          })
          .dialog("open")
          .css("overflow", "hidden");

        if (aboveLoader) setAboveLoader();
      }

    },
    // unaBase.loadInto._refresh
    _refresh: function (href) {
      $("html > body.menu > header > button.access").hide();

      // Actualizar barra de menú con la URL actual.
      var busqueda = /views\/[0-9a-zA-Z_\-]+/.exec(href);
      var modulo;
      // verificar modulo ya declarado
      if (busqueda) {
        var modulo = busqueda[0];

        $("html > body > aside > div > div > ul > li").each(function () {
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

          $("html > body > aside > div > div > ul > li").each(function () {
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

    reload: function () {
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
    init: function () {
      firstSearch = false;

      unaBase.toolbox.destroy();
      if (!unaBase.toolbox.dialog) $(".toolbox").hide();
    },
    // unaBase.toolbox.destroy
    destroy: function () {
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
      init: function (params) {

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

        if (params.entity == 'Cotizacion') {
          //search = document.querySelector('.containerModal .bodyModal')
        }



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
              case "new_date": {
                if (params.filters[i].range) {
                  var label = $(`<label title="${params.filters[i].caption}" class="date"></label>`);

                  // Agregar botón de filtro de fecha
                  label.append(
                    `<button class="filter date">${params.filters[i].caption}</button>`
                  );

                  var date = new Date();
                  var currentDay = date.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' }); // Formato "dd-mm-yyyy"
                  var currentMonth = `${date.getFullYear()}-${sprintf("%02d", (date.getMonth() + 1).toString())}`; // Formato "yyyy-mm"
                  var currentYear = date.getFullYear();

                  // Verificar si se debe establecer un valor por defecto
                  var inputValue = "";
                  if (params.filters[i].currentDay) {
                    inputValue = currentDay; // Establecer el valor como la fecha actual
                  } else if (params.filters[i].currentMonth) {
                    inputValue = currentMonth; // Establecer el valor como el mes actual
                  } else if (params.filters[i].currentYear) {
                    inputValue = currentYear; // Establecer el valor como el año actual
                  }

                  // Añadir el input con el valor predeterminado
                  label.append(
                    `<input autocomplete="off" placeholder="dd-mm-yyyy" type="text" name="${params.filters[i].name}" value="${inputValue}" style="width: 100px; margin-left: 4px">`
                  );

                  // Botón para quitar el filtro
                  label.append(
                    `<button class="clear date">Quitar filtro ${params.filters[i].caption}</button>`
                  );

                  filters.append(label);

                  (function (name, filters) {
                    // Inicializar el botón de calendario
                    filters.find(".filter.date")
                      .button({
                        text: false,
                        icons: { primary: "ui-icon-calendar" }
                      })
                      .unbind("click")
                      .click(function (event) {
                        // Aquí puedes agregar la funcionalidad para el clic del botón
                      });

                    // Inicializar el botón para borrar la fecha
                    filters.find("button.clear.date")
                      .button({
                        text: false,
                        icons: { primary: "ui-icon-circle-close" }
                      })
                      .unbind("click")
                      .click(function (event) {
                        $(event.target).closest("label").find("input").val("");
                        $(event.target).closest("label").find("input").data("changed", true);
                        advancedSearch();
                      });

                    // Inicializar el datepicker
                    filters.find(`[name="${name}"]`).datepicker({
                      dateFormat: "dd-mm-yy",
                      monthNames: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                      dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
                      dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
                      dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
                      onSelect: function () {
                        advancedSearch();
                      }
                    });
                  })(params.filters[i].name, filters);
                }
                break;
              }

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

                  (function (name, filters) {
                    filters
                      .find(".filter.date")
                      .button({
                        text: false,
                        icons: {
                          primary: "ui-icon-calendar"
                        }
                      })
                      .unbind("click")
                      .click(function (event) {
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
                      .click(function (event) {
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
                      onSelect: function (event) {
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
                for (var y = currentYear + 1; y >= currentYear - 10; y--) {
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
                filter.bind("change", function (event) {
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
              case "new_select":

                filters.append(
                  `<label class="" title="${params.filters[i].caption}" style="margin-right: 10px;"><div class="custom-select-wrapper">
                  <div class="custom-select-new select_custom_${params.filters[i].name}">
                      <div class="custom-select-text">${params.filters[i].caption}</div>
                      <div class="custom-select-icon"><i class="fa-solid fa-angle-down"></i></div>
                  </div>
                  <div class="custom-select-dropdown custom-select-dropdown_${params.filters[i].name}">
                      
                  </div>
              </div>
              </label>`
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
                  action: function (event) {
                    var buttonObject = $(event.target).closest("button");
                    var dataSource = buttonObject.data("source");
                    var url =
                      "/v3/script/multiselect.shtml?datasource=" + dataSource;
                    buttonObject.data("url", url);
                    buttonObject.tooltipster({
                      content: function () {
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
                    .click(function (event) {
                      $(event.target)
                        .closest("label")
                        .find("input")
                        .val("");
                    });

                  optionsNode
                    .find("button.clear.date")
                    .last()
                    .click(function (event) {
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
                      onSelect: function (event) {
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
                      onSelect: function (event) {
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

                buttons.find("button.search-button").click(function () {
                  //$('button.show.' + params.filters[i].name).closest('label').show();
                  advancedSearch();
                });

                buttons.find("button.close-button").click(function () {
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
                  .bind("change", function (event) {
                    var name = $(event.target).val();
                    if (name == "none") {
                      optionsNode.find("li").hide();
                      optionsNode
                        .find("li")
                        .find("input")
                        .each(function (key, item) {
                          $(item).val("");
                        });
                    } else {
                      optionsNode
                        .find('li:not([data-name="' + name + '"])')
                        .hide();
                      optionsNode
                        .find('li:not([data-name="' + name + '"])')
                        .find("input")
                        .each(function (key, item) {
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
                  .click(function (event) {
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
              case "select":
                var selectContainer = $('<label class="select" title="' + params.filters[i].caption + '"></label>');
                var selectElement = $('<select name="' + params.filters[i].name + '" type="select"></select>');

                for (j in unaBase.money) {
                  var option = $('<option value="' + unaBase.money[j].codigo + '">' + unaBase.money[j].nombre + '</option>');

                  if (unaBase.money[j].selected) {
                    option.prop('selected', true);
                  }

                  selectElement.append(option);
                }

                function handleSelectChange() {

                  advancedSearch();
                }

                selectElement.change(handleSelectChange);

                selectContainer.append(selectElement);
                filters.append(selectContainer);
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
        var updateSearchFilter = function (event) {
          //if (event.isTrigger != 3) {
          var areChecked = false;
          var checkboxes = search.find('input[type="checkbox"]');

          if (checkboxes.length > 1) {
            checkboxes.each(function () {
              areChecked |= $(this).prop("checked");
            });
            if (areChecked) advancedSearch();
          } else advancedSearch();
          //}
        };
        search
          .find('input:not([type="search"]):not(.prevent-search)')
          .unbind("change")
          .bind("change", function (event) {
            if (event.isTrigger != 3) updateSearchFilter(event);
          });

        search
          .find('input:not([type="search"]):not(.prevent-search)')
          .unbind("update")
          .bind("update", updateSearchFilter);


        let globalClickHandler = null;
        let allSelects = [];
        const closeAllDropdowns = (currentDropdown) => {
          allSelects.forEach(({ dropdown, select }) => {
            if (dropdown !== currentDropdown) {
              dropdown.style.display = 'none';
              select.classList.remove('custom-select-dropdown-active');
              select.classList.remove('custom-select-open');
            }
          });
        }
        const setGlobalClickHandler = (dropdown, select) => {
          globalClickHandler = function (event) {
            // Si el clic no fue dentro del select o del dropdown
            if (!select.contains(event.target) && !dropdown.contains(event.target)) {
              dropdown.style.display = 'none';
              select.classList.remove('custom-select-dropdown-active');
              select.classList.remove('custom-select-open');
            }
          };

          // Agrega el nuevo manejador de eventos
          document.addEventListener('click', globalClickHandler);
        }

        const setupSelectElement = (selectElement, dropdown, caption) => {
          selectElement.addEventListener('click', (event) => {
            const isOpen = dropdown.style.display === 'block';
            closeAllDropdowns(isOpen ? null : dropdown);
            dropdown.style.display = isOpen ? 'none' : 'block';
            selectElement.classList.toggle('custom-select-dropdown-active');
            selectElement.classList.toggle('custom-select-open', !isOpen);
            event.stopPropagation();
          });
        };

        const populateDropdown = (dropdown, rows, name, caption) => {
          dropdown.innerHTML = '';
          const optionDefault = document.createElement('div');
          optionDefault.classList.add('custom-select-option');
          optionDefault.textContent = 'Sin filtro';
          optionDefault.dataset.value = '';
          optionDefault.dataset.name = '';
          dropdown.appendChild(optionDefault);

          rows.forEach(optionData => {
            const optionElement = document.createElement('div');
            optionElement.classList.add('custom-select-option');
            optionElement.textContent = optionData.text;
            optionElement.dataset.value = optionData.id;
            optionElement.dataset.name = name;
            dropdown.appendChild(optionElement);
          });
        };

        const setupDropdownOptions = (dropdown, selectElement, caption) => {
          dropdown.querySelectorAll('.custom-select-option').forEach(optionElement => {
            optionElement.addEventListener('click', (event) => {
              if (event.target.dataset.value === '') {
                selectElement.querySelector('.custom-select-text').innerText = caption;
                selectElement.dataset.value = '';
                selectElement.dataset.name = '';
              } else {
                selectElement.querySelector('.custom-select-text').innerText = event.target.innerText;
                selectElement.dataset.value = event.target.dataset.value;
                selectElement.dataset.name = event.target.dataset.name;
              }

              dropdown.style.display = 'none';
              selectElement.classList.remove('custom-select-dropdown-active');
              advancedSearch();
              event.stopPropagation();
            });
          });
        };


        for (var i in params.filters) {
          if (params.filters[i].type == "autocomplete") {
            (function (filter) {
              $("#autocomplete_" + filter.name).autocomplete({
                source: function (request, response) {
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
                      success: function (data) {
                        data.rows.unshift(dataset);
                        response(
                          $.map(data.rows, function (item) {
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
                      $.map(filter.dataObject, function (item) {
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
                response: function (event, ui) {
                  $(this).data("value", null);
                },
                focus: function (event, ui) {
                  $(this).val(ui.item.label);
                  return false;
                },
                select: function (event, ui) {
                  if (ui.item.value === null) $(this).val("");
                  else $(this).val(ui.item.label);
                  $(this).data("value", ui.item.value);
                  //$(this).trigger('change');

                  //$(this).parentTo('fieldset').find('[name="q"]').trigger('keypress');
                  advancedSearch();
                  //$('#search').find('[name="q"]').trigger('keypress');
                  return false;
                },
                open: function () {
                  $(this)
                    .removeClass("ui-corner-all")
                    .addClass("ui-corner-top");
                },
                close: function () {
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
                .click(function () {

                  $("#autocomplete_" + filter.name)
                    .autocomplete("search", "@")
                    .focus();
                });
            })(params.filters[i]);
          }

          if (params.filters[i].type === "new_select") {
            const filter = params.filters[i];

            if (typeof filter.dataSource !== "undefined") {
              const data = { q: '' };
              $.ajax({
                url: `/4DACTION/_V3_${filter.dataSource}`,
                dataType: "json",
                data: data,
                success: (data) => {
                  const selectElement = document.querySelector(`.select_custom_${filter.name}`);
                  const dropdown = document.querySelector(`.custom-select-dropdown_${filter.name}`);
                  allSelects.push({ select: selectElement, dropdown: dropdown });

                  setupSelectElement(selectElement, dropdown, filter.caption);
                  populateDropdown(dropdown, data.rows, filter.name, filter.caption);
                  setupDropdownOptions(dropdown, selectElement, filter.caption);
                  setGlobalClickHandler(dropdown, selectElement);
                }
              });
            } else {
              const selectElement = document.querySelector(`.select_custom_${filter.name}`);
              const dropdown = document.querySelector(`.custom-select-dropdown_${filter.name}`);
              allSelects.push({ select: selectElement, dropdown: dropdown });

              setupSelectElement(selectElement, dropdown, filter.caption);
              populateDropdown(dropdown, filter.dataObject, filter.name, filter.caption);
              setupDropdownOptions(dropdown, selectElement, filter.caption);
              setGlobalClickHandler(dropdown, selectElement);
            }
          }




        }



        search
          .find('input[type="checkbox"]:not(.prevent-search)')
          .change(function (event) {
            var areChecked = false;
            search.find('input[type="checkbox"]').each(function (key, item) {
              areChecked |= $(item).prop("checked");
            });
            if (!areChecked) {
              event.stopPropagation();
              search.find('input[type="checkbox"]').each(function (key, item) {
                $(item).prop("checked", true);
              });
              $(this).triggerHandler("change");
            }
          });

        search.find('input[type="radio"]').change(function (event) {
          event.stopPropagation();
          search.find('input[type="radio"]').each(function (key, item) {
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
        search.find("> fieldset > button:first-of-type").click(function () {
          advancedSearch();
          $(this)
            .parent()
            .toggle();
          search.find("> button").removeClass("active");
          search.find("> button").addClass("enabled");
        });

        search.find("> fieldset > button:last-of-type").click(function () {
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
            .bind("mousedown", function (event) {
              //event.metaKey = true;
            })
            .selectable({
              filter: "tr",
              distance: 0,
              stop: function (event, ui) {
                $(event.target)
                  .children(".ui-selected")
                  .not(":first")
                  .removeClass("ui-selected");
              }
            });

        var formatCurrency = function () {
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

        // Variables de paginacion
        var lastQuery = "";
        var lastSortBy = null;
        var lastSortOrder = null;
        var lastAdvancedFilter = {};
        var lastQuery2 = "";

        var listHeight = parseInt($(window).height()) - 200;
        var appendResult = function (
          pageNumber,
          query,
          sortBy,
          sortOrder,
          advancedFilter,
          query2
        ) {
          if (!unaBase.toolbox.search.initialized) return false;

          lastQuery = query;
          lastSortBy = sortBy;
          lastSortOrder = sortOrder;
          lastAdvancedFilter = advancedFilter || {};
          lastQuery2 = query2;
          var ajaxParams = {
            page: pageNumber,
            results: vResults ? vResults : Math.round(listHeight / 5),
            q: query,
            q2: query2
          };
          ;
          if ((params.entity === "Negocio") | (params.entity === "Compras") | (params.entity === "Dtc") | (params.entity === "dtv") | (params.entity === "Contacto") | (params.entity === "comprobantes")) {
            ajaxParams.results = 40
          }

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
            .each(function () {
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
            beforeSend: function () {
              viewport
                .find(
                  "table.results" +
                  (typeof params.container != "undefined"
                    ? "." + params.container
                    : "")
                )
                .hide();
              var div = $(
                `
                <div class="unique-overlay">
                    <div class="unique-loading-container">
                        <div class="unique-spinner"></div>
                        <div class="unique-loading-text">Cargando</div>
                    </div>
                </div>
                `
              );
              viewport.prepend(div);
              $("p.not_found_msg").hide();
            },
            complete: function () {
              viewport.find("div.unique-overlay").remove();
              viewport
                .find(
                  "table.results" +
                  (typeof params.container != "undefined"
                    ? "." + params.container
                    : "")
                )
                .show();

              // Guardado de ítems de búsqueda con checkboxes
              // console.log(
              //   "Después de ejecutar búsqueda, se añaden los ítems con checkboxes al principio de los resultados."
              // );

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
          }).done(function (data) {
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
                msg = `<div class="no-data-results" style="display: flex;"><svg
                width="80px"
                viewBox="0 0 72 66"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M58.892 52.4505V57.6984C58.892 61.7544 55.9331 65.1189 52.0575 65.755C51.6245 65.8261 51.1794 65.8631 50.7266 65.8631H11.0349C8.11682 65.8631 5.31807 64.7426 3.2538 62.7557C1.16743 60.7471 0 58.0209 0 55.1804V1.61067C0 0.721117 0.721209 0 1.61142 0H44.1759C45.065 0 45.7862 0.721117 45.7862 1.61067C45.7862 1.61067 45.7862 11.0012 45.7862 22.1273H63.8357C65.5642 22.1273 67.1668 22.6649 68.4866 23.5813C70.6106 25.0554 72 27.5114 72 30.2919V50.8398C72 51.7294 71.2788 52.4505 70.3897 52.4505H58.892ZM45.7862 57.873V58.1102C45.879 60.6437 48.0692 62.6402 50.7233 62.6416H50.7266C51.0027 62.6416 51.2722 62.6193 51.5362 62.5761C53.881 62.1911 55.6702 60.1532 55.6702 57.6984V30.2919C55.6702 28.434 56.291 26.7208 57.3358 25.3487H45.7829V57.6984C45.7829 57.7568 45.784 57.8151 45.7862 57.873ZM63.8357 25.3487H63.8346C61.1054 25.3487 58.892 27.5619 58.892 30.2919V49.229H68.7782V30.2919C68.7782 28.6077 67.9366 27.1204 66.6499 26.2276C65.8514 25.6731 64.8816 25.3487 63.8357 25.3487ZM42.5645 58.1349V3.22144H3.22176V55.1804C3.22176 57.152 4.04018 59.0407 5.48816 60.4349C6.95933 61.8506 8.95512 62.6416 11.0349 62.6416H44.1538C43.1985 61.3856 42.6175 59.8475 42.5656 58.1848C42.5656 58.1682 42.5645 58.1516 42.5645 58.1349Z"
                  fill="#98a2b3"
                />
                <g id="face">
                  <path
                    id="mouth"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M31.3929 26.9916C31.4712 27.5298 31.2839 28.0957 30.8444 28.48C30.1563 29.0817 29.1093 29.0118 28.5075 28.3238C27.3731 27.026 25.6573 26.189 23.7325 26.1269C21.8078 26.189 20.092 27.026 18.9576 28.3238C18.3557 29.0118 17.3088 29.0817 16.6206 28.48C16.1812 28.0957 15.9938 27.5298 16.0722 26.9916C16.1176 26.6873 16.247 26.3918 16.4639 26.1433C18.19 24.1699 20.7983 22.8783 23.7325 22.8138C26.6668 22.8783 29.274 24.1699 31.0011 26.1433C31.218 26.3918 31.3474 26.6873 31.3929 26.9916Z"
                    fill="#98a2b3"
                  />
                  <path
                    id="eyeLeft"
                    d="M15.7961 18.4814C17.1026 18.4814 18.1618 17.4223 18.1618 16.1158C18.1618 14.8093 17.1026 13.7501 15.7961 13.7501C14.4896 13.7501 13.4305 14.8093 13.4305 16.1158C13.4305 17.4223 14.4896 18.4814 15.7961 18.4814Z"
                    fill="#98a2b3"
                  />
                  <path
                    id="eyeRight"
                    d="M32.3688 18.4815C33.6753 18.4815 34.7344 17.4224 34.7344 16.1159C34.7344 14.8094 33.6753 13.7503 32.3688 13.7503C31.0623 13.7503 30.0032 14.8094 30.0032 16.1159C30.0032 17.4224 31.0623 18.4815 32.3688 18.4815Z"
                    fill="#98a2b3"
                  />
                </g>
                <path
                  d="M10.3803 48.6207C11.6021 48.6207 12.5926 47.6302 12.5926 46.4083C12.5926 45.1865 11.6021 44.196 10.3803 44.196C9.15843 44.196 8.16791 45.1865 8.16791 46.4083C8.16791 47.6302 9.15843 48.6207 10.3803 48.6207Z"
                  fill="#98a2b3"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M37.8973 45.4749C37.8973 44.8258 37.3705 44.2996 36.7221 44.2996H18.0553C17.4059 44.2996 16.879 44.8258 16.879 45.4749C16.879 46.0574 16.879 46.7591 16.879 47.3416C16.879 47.9908 17.4059 48.5169 18.0553 48.5169C21.7388 48.5169 33.0376 48.5169 36.7221 48.5169C37.3705 48.5169 37.8973 47.9908 37.8973 47.3416V45.4749Z"
                  fill="#98a2b3"
                />
                <path
                  d="M10.3803 57.4565C11.6021 57.4565 12.5926 56.466 12.5926 55.2441C12.5926 54.0223 11.6021 53.0318 10.3803 53.0318C9.15843 53.0318 8.16791 54.0223 8.16791 55.2441C8.16791 56.466 9.15843 57.4565 10.3803 57.4565Z"
                  fill="#98a2b3"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M37.8973 54.3108C37.8973 53.6617 37.3705 53.1355 36.7221 53.1355H18.0553C17.4059 53.1355 16.879 53.6617 16.879 54.3108C16.879 54.8933 16.879 55.595 16.879 56.1775C16.879 56.8267 17.4059 57.3528 18.0553 57.3528C21.7388 57.3528 33.0376 57.3528 36.7221 57.3528C37.3705 57.3528 37.8973 56.8267 37.8973 56.1775V54.3108Z"
                  fill="#98a2b3"
                />
              </svg><span>NO SE ENCONTRÓ NINGÚN RESULTADO. <br> ES POSIBLE QUE LA INFORMACIÓN QUE ESTÁS BUSCANDO CORRESPONDA A UNA FECHA ANTERIOR.</span></div>`
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


              if (params.entity == 'Dtc') {
                unaBase.impuestos_dtc = data.impuestos_dtc
              }

              // console.log(window.Chat.locked);
              const containerClass = typeof params.container !== "undefined" ? "." + params.container : "";
              const tableSelector = `table.results${containerClass} > tbody`;
              const $tbody = viewport.find(tableSelector);
              $tbody.empty();
              data.rows.forEach((row, i) => {
                const id = row.id;
                const tableSelector = `table.results${containerClass} > tbody`;
                const rowSelector = `${tableSelector} tr[data-id="${id}"]`;

                // Agregar fila a la tabla
                $tbody.append(params.row.html(i, data.rows));
              });


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
                .bind("click", function (event) {
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
                  .each(function () {
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

              function renderPagination(pageInfo, recordsInfo) {
                console.log(recordsInfo);
                var current = pageInfo.current;
                var last = pageInfo.last;

                var $container = viewport.find("#pagination");
                if ($container.length === 0) $container = $("#pagination");
                if ($container.length === 0) return;

                var html = "";

                // Helper para crear un botón del paginador
                function pageLink(page, text, cssClass, disabled) {
                  if (disabled) {
                    html += '<span class="disabled ' + (cssClass || "") + '">' + text + "</span>";
                  } else if (page === current && !cssClass) {
                    html += '<span class="current">' + text + "</span>";
                  } else {
                    html +=
                      '<a href="#" data-page="' +
                      page +
                      '" class="' +
                      (cssClass || "") +
                      '">' +
                      text +
                      "</a>";
                  }
                }

                let noPaging = last <= 1;

                pageLink(1, "|<", "first", noPaging || current === 1);
                pageLink(current - 1, "<", "prev", noPaging || current === 1);

                var maxVisible = 7;
                var start = Math.max(1, current - 3);
                var end = Math.min(last, current + 3);

                if (start > 1) {
                  pageLink(1, "1");
                  if (start > 2) html += "<span>...</span>";
                }

                for (var i = start; i <= end; i++) {
                  pageLink(i, i.toString());
                }

                if (end < last) {
                  if (end < last - 1) html += "<span>...</span>";
                  pageLink(last, last.toString());
                }

                pageLink(current + 1, ">", "next", noPaging || current === last);
                pageLink(last, ">|", "last", noPaging || current === last);

                if (recordsInfo) {
                  html +=
                    '<span style="margin-left:10px;">' +
                    "Mostrando " +
                    (recordsInfo.from + 1) +
                    "–" +
                    (recordsInfo.to + 1) +
                    " de " +
                    recordsInfo.total +
                    "</span>";
                }
                $container.html(html);
              }

              if (data.page && data.records) {
                renderPagination(data.page, data.records);
              } else {
                viewport.find("#pagination").html("");
              }
              viewport.off("click", "#pagination a[data-page]");
              viewport.on("click", "#pagination a[data-page]", function (e) {
                e.preventDefault();
                var page = parseInt($(this).data("page"), 10);
                if (!isNaN(page)) {
                  appendResult(page, lastQuery, lastSortBy, lastSortOrder, lastAdvancedFilter, lastQuery2);
                }
              });
            }

            if (typeof params.callback != "undefined") params.callback(data);

            viewport
              .find("th[data-sort-by]")
              .unbind("click")
              .bind("click", function (event) {
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

            //console.log("Finaliza búsqueda");

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
          }).fail((jqXHR, textStatus, errorThrown) => {
            toastr.error(`Error al obtener el listado. Comuniquese con soporte`);
          });
          // }
          unaBase.ui.unblock();
        };

        var loadResults = function (disable_selected) {

          // Guardado de ítems de búsqueda con checkboxes
          // console.log(
          //   "Antes de ejecutar búsqueda, se guardan ítems con checkboxes."
          // );

          if (!disable_selected) {
            $("table.results")
              .find("tbody")
              .find("tr")
              .each(function (key, item) {
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
          handleScroll: function (page, container, doneCallback) {
            setTimeout(function () {
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

        var advancedSearch = function (disable_selected) {

          
          executeSearch = () => {

            unaBase.ui.block();

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
            search.find("input, .multiple button, button.multiple, select, .custom-select-new").each(function (key, item) {
              var filterName, newFilter = {};

              if ($(item).hasClass('custom-select-new')) {

                // Manejar el select personalizado
                filterName = item.dataset.name
                var selectedValue = item.dataset.value
                newFilter[filterName] = selectedValue;
              } else {
                // Lógica para otros tipos de elementos
                filterName = $(item).prop("name") || $(item).data("name");

                if ($(item).attr("type")) {
                  switch ($(item).attr("type")) {
                    case "checkbox":
                      if ($(item).prop("checked")) {
                        newFilter[filterName] = true;
                      }
                      break;
                    case "search":
                      newFilter[filterName] = $(item).data('value');
                      break;
                    default:
                      newFilter[filterName] = $(item).val();
                  }
                } else {
                  newFilter[filterName] = $(item).data('value');
                }
              }

              // Extender el filtro avanzado con el nuevo filtro
              $.extend(
                unaBase.toolbox.search.advancedFilter,
                unaBase.toolbox.search.advancedFilter,
                newFilter
              );
            });

            // Si no tiene definido un row, no listar resultados

            if (typeof params.row != "undefined") {
              loadResults(disable_selected);
              // Al presionar el boton volver y no hay nada en la pila
              unaBase.toolbox.search.backResult = false
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
              unaBase.ui.unblock();
            }, 1000);
          };



          if (!stopAutoSearch || !firstSearch) {
            executeSearch();
            firstSearch = true;
          }
        };


        unaBase.toolbox.search._advancedSearch = advancedSearch;

        // Si no tiene definido un row, no paginar el listado
        // if (typeof params.row != "undefined") {

        // } else {
        //   
        //   params.callback(unaBase.toolbox.search.advancedFilter);
        // }

        var searchHandler = function (event) {
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
            } else {

              //params.callback(unaBase.toolbox.search.advancedFilter);
            }
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


        //TESTTTT
        if (unaBase.toolbox.search.backResult) {
          advancedSearch();
        }



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
        $('#search [name="q"]').on("keydown", function (event) {
          if (event.keyCode === 13) {
            setTimeout(() => {
              executeSearch();

            }, 500);
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

            searchCheckbox.addEventListener("click", function () {
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

      newInit: function (params) {

        // ── ESTADO INTERNO ─────────────────────────────────────────
        const state = {
          page: 1,
          sortBy: null,
          sortOrder: null,
          filter: {},          // filtros activos
          q: '',          // término de búsqueda libre (va al servidor)
          lastData: null,        // última respuesta del servidor
        };

        // ── REFERENCIAS DOM ────────────────────────────────────────
        const $viewport = $('#viewport');
        const $tbody = $viewport.find('table.results tbody');
        const $pagination = $('#pagination');
        const drawer = document.getElementById('filterDrawer');
        const drawerBody = document.getElementById('drawerBody');

        if (!drawer || !drawerBody) { console.warn('newInit: drawer no encontrado'); return; }

        // Fechas helper
        const today = new Date();
        const currentMonth = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0');
        const currentYear = String(today.getFullYear());

        // ══════════════════════════════════════════════════════════
        // 1. RENDERIZAR FILTROS EN EL DRAWER
        // ══════════════════════════════════════════════════════════
        drawerBody.innerHTML = '';

        const groupOrder = ['Fechas', 'Estado', 'Clasificación', 'Negocio y origen'];
        const groupMap = {
          month: 'Fechas',
          new_date: 'Fechas',
          checkbox: 'Estado',
          new_select: 'Clasificación',
          autocomplete: 'Negocio y origen',
        };

        // Agrupar filtros
        const groups = {};
        groupOrder.forEach(g => { groups[g] = []; });
        params.filters.forEach(f => {
          const g = groupMap[f.type] || 'Otros';
          if (!groups[g]) groups[g] = [];
          groups[g].push(f);
        });

        Object.entries(groups).forEach(([groupName, filters]) => {
          if (!filters.length) return;

          const section = document.createElement('div');
          section.className = 'filter-group-section';
          section.innerHTML = `<div class="filter-group-label">${groupName}</div>`;

          filters.forEach(filter => {
            switch (filter.type) {

              // ── MONTH — picker único año/mes (sin rango) ────
              case 'month': {
                if (!filter.range) break;

                const yearNow = today.getFullYear();
                const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

                const defM = filter.currentMonth ? today.getMonth() : -1;
                const defY = (filter.currentMonth || filter.currentYear) ? yearNow : null;

                // ── Construir picker ─────────────────────────
                const buildPicker = (suffix) => {
                  const wrap = document.createElement('div');
                  wrap.className = 'ymp-wrap';

                  const pState = { year: defY, month: defM };

                  // Input oculto para _collectFilters
                  const hidden = document.createElement('input');
                  hidden.type = 'hidden';
                  hidden.className = 'ni-filter';
                  // Sin sufijo → nombre limpio (ej: created_at); con sufijo → created_at_from
                  const inputName = suffix ? `${filter.name}_${suffix}` : filter.name;
                  hidden.name = inputName;
                  hidden.dataset.filterName = inputName;
                  // Exponer reset para _niResetFilters
                  hidden.dataset.defY = defY !== null ? String(defY) : '';
                  hidden.dataset.defM = String(defM);

                  const syncHidden = () => {
                    if (pState.year === null) { hidden.value = ''; return; }
                    if (pState.month === -1) { hidden.value = String(pState.year); return; }
                    hidden.value = `${pState.year}-${String(pState.month + 1).padStart(2, '0')}`;
                  };
                  syncHidden();

                  // ── Trigger ──────────────────────────────────
                  const trigger = document.createElement('button');
                  trigger.type = 'button';
                  trigger.className = 'ymp-trigger';
                  trigger.innerHTML = `
              <i class="fas fa-calendar-alt" style="font-size:11px;opacity:.55"></i>
              <span class="ymp-label"></span>`;

                  const updateLabel = () => {
                    const lbl = trigger.querySelector('.ymp-label');
                    if (pState.year === null) {
                      lbl.textContent = 'Todos los períodos';
                      trigger.classList.remove('ymp-has-value');
                    } else if (pState.month === -1) {
                      lbl.textContent = String(pState.year);
                      trigger.classList.add('ymp-has-value');
                    } else {
                      lbl.textContent = MONTHS[pState.month].slice(0, 3) + ' ' + pState.year;
                      trigger.classList.add('ymp-has-value');
                    }
                  };
                  updateLabel();

                  // ── Dropdown — montado en body (portal) para escapar
                  //    del overflow:hidden del drawer y del z-index del overlay ──
                  const dropdown = document.createElement('div');
                  dropdown.className = 'ymp-dropdown';
                  dropdown.style.display = 'none';
                  document.body.appendChild(dropdown);  // ← portal

                  // ─ Vista AÑO ─────────────────────────────────
                  const yearView = document.createElement('div');
                  yearView.className = 'ymp-view';

                  const yHeader = document.createElement('div');
                  yHeader.className = 'ymp-header';

                  const yPrev = document.createElement('button');
                  yPrev.type = 'button'; yPrev.className = 'ymp-nav'; yPrev.innerHTML = '‹';
                  const yNext = document.createElement('button');
                  yNext.type = 'button'; yNext.className = 'ymp-nav'; yNext.innerHTML = '›';
                  const yTitle = document.createElement('span');
                  yTitle.className = 'ymp-title'; yTitle.textContent = 'Año';

                  yHeader.append(yPrev, yTitle, yNext);

                  const yGrid = document.createElement('div');
                  yGrid.className = 'ymp-grid';
                  let yearBase = defY !== null ? defY - 4 : yearNow - 4;

                  const renderYears = () => {
                    yGrid.innerHTML = '';
                    for (let y = yearBase; y < yearBase + 9; y++) {
                      const b = document.createElement('button');
                      b.type = 'button'; b.className = 'ymp-cell';
                      b.textContent = y;
                      if (y === pState.year) b.classList.add('ymp-selected');
                      if (y === yearNow) b.classList.add('ymp-today');
                      b.addEventListener('click', (e) => {
                        e.stopPropagation();
                        pState.year = y;
                        yearView.style.display = 'none';
                        monthView.style.display = '';
                        renderMonths();
                      });
                      yGrid.appendChild(b);
                    }

                    // ── Todos los años: limpia año y mes → sin filtro de fecha ──
                    const allYearsBtn = document.createElement('button');
                    allYearsBtn.type = 'button';
                    allYearsBtn.className = 'ymp-all-months';   // reutiliza estilo teal
                    allYearsBtn.textContent = 'Todos los años';
                    // Destacar si ya está en modo "sin filtro"
                    if (pState.year === null) allYearsBtn.classList.add('ymp-all-active');
                    allYearsBtn.addEventListener('click', (e) => {
                      e.stopPropagation();
                      pState.year = null;
                      pState.month = -1;
                      syncHidden();
                      updateLabel();
                      closeDD();
                    });
                    yGrid.appendChild(allYearsBtn);
                  };
                  renderYears();

                  yPrev.addEventListener('click', (e) => { e.stopPropagation(); yearBase -= 9; renderYears(); });
                  yNext.addEventListener('click', (e) => { e.stopPropagation(); yearBase += 9; renderYears(); });
                  yearView.append(yHeader, yGrid);

                  // ─ Vista MES ─────────────────────────────────
                  const monthView = document.createElement('div');
                  monthView.className = 'ymp-view';
                  monthView.style.display = 'none';

                  const mHeader = document.createElement('div');
                  mHeader.className = 'ymp-header';

                  const mBack = document.createElement('button');
                  mBack.type = 'button'; mBack.className = 'ymp-nav'; mBack.innerHTML = '‹';
                  const mPrev = document.createElement('button');  // ← año anterior
                  mPrev.type = 'button'; mPrev.className = 'ymp-nav'; mPrev.innerHTML = '‹';
                  const mNext = document.createElement('button');
                  mNext.type = 'button'; mNext.className = 'ymp-nav'; mNext.innerHTML = '›';
                  const mTitle = document.createElement('span');
                  mTitle.className = 'ymp-title ymp-year-title';

                  // Header mes: ‹(volver años)  ‹(año ant)  2024  ›(año sig)
                  const mHeaderLeft = document.createElement('div');
                  mHeaderLeft.style.cssText = 'display:flex;align-items:center;gap:4px;';
                  const mBackLabel = document.createElement('button');
                  mBackLabel.type = 'button';
                  mBackLabel.className = 'ymp-nav';
                  mBackLabel.title = 'Ver años';
                  mBackLabel.innerHTML = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m15 18-6-6 6-6"/></svg>`;

                  const mNavRight = document.createElement('div');
                  mNavRight.style.cssText = 'display:flex;align-items:center;gap:4px;';
                  const mYearPrev = document.createElement('button');
                  mYearPrev.type = 'button'; mYearPrev.className = 'ymp-nav'; mYearPrev.innerHTML = '‹';
                  mYearPrev.title = 'Año anterior';
                  const mYearNext = document.createElement('button');
                  mYearNext.type = 'button'; mYearNext.className = 'ymp-nav'; mYearNext.innerHTML = '›';
                  mYearNext.title = 'Año siguiente';
                  mNavRight.append(mYearPrev, mYearNext);

                  mHeader.append(mBackLabel, mTitle, mNavRight);

                  const mGrid = document.createElement('div');
                  mGrid.className = 'ymp-grid ymp-month-grid';

                  const renderMonths = () => {
                    mTitle.textContent = String(pState.year);
                    mGrid.innerHTML = '';
                    MONTHS.forEach((name, idx) => {
                      const b = document.createElement('button');
                      b.type = 'button'; b.className = 'ymp-cell';
                      b.textContent = name;
                      if (idx === pState.month) b.classList.add('ymp-selected');
                      if (idx === today.getMonth() && pState.year === yearNow) b.classList.add('ymp-today');
                      b.addEventListener('click', (e) => {
                        e.stopPropagation();
                        pState.month = idx;
                        syncHidden(); updateLabel(); closeDD();
                      });
                      mGrid.appendChild(b);
                    });
                    // Opción: todo el año
                    const allBtn = document.createElement('button');
                    allBtn.type = 'button'; allBtn.className = 'ymp-all-months';
                    allBtn.textContent = 'Todo el año';
                    allBtn.addEventListener('click', (e) => {
                      e.stopPropagation();
                      pState.month = -1; syncHidden(); updateLabel(); closeDD();
                    });
                    mGrid.appendChild(allBtn);
                  };

                  mBackLabel.addEventListener('click', (e) => {
                    e.stopPropagation();
                    monthView.style.display = 'none';
                    yearView.style.display = '';
                    renderYears();
                  });
                  mYearPrev.addEventListener('click', (e) => {
                    e.stopPropagation();
                    pState.year--; renderMonths();
                  });
                  mYearNext.addEventListener('click', (e) => {
                    e.stopPropagation();
                    pState.year++; renderMonths();
                  });
                  monthView.append(mHeader, mGrid);

                  // ─ Botón Limpiar ─────────────────────────────
                  const clearBtn = document.createElement('button');
                  clearBtn.type = 'button'; clearBtn.className = 'ymp-clear';
                  clearBtn.textContent = 'Limpiar';
                  clearBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    pState.year = null; pState.month = -1;
                    syncHidden(); updateLabel();
                    yearView.style.display = ''; monthView.style.display = 'none';
                    renderYears(); closeDD();
                  });

                  dropdown.append(yearView, monthView, clearBtn);

                  // ── Posicionar dropdown (portal en body) ──────
                  const positionDD = () => {
                    const rect = trigger.getBoundingClientRect();
                    const ddW = 264;
                    const ddH = dropdown.offsetHeight || 320;
                    let top = rect.bottom + 6;
                    let left = rect.left;
                    // No salirse por la derecha
                    if (left + ddW > window.innerWidth - 8) left = window.innerWidth - ddW - 8;
                    // No salirse por abajo → abrir hacia arriba
                    if (top + ddH > window.innerHeight - 8) top = rect.top - ddH - 6;
                    dropdown.style.top = top + 'px';
                    dropdown.style.left = left + 'px';
                  };

                  const closeDD = () => {
                    dropdown.style.display = 'none';
                    trigger.classList.remove('ymp-open');
                  };

                  // ── Abrir / cerrar ────────────────────────────
                  trigger.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const isOpen = dropdown.style.display !== 'none';
                    // Cerrar todos los demás
                    document.querySelectorAll('.ymp-dropdown').forEach(d => {
                      if (d !== dropdown) d.style.display = 'none';
                    });
                    document.querySelectorAll('.ymp-trigger.ymp-open').forEach(t => {
                      if (t !== trigger) t.classList.remove('ymp-open');
                    });
                    if (isOpen) {
                      closeDD();
                    } else {
                      yearView.style.display = ''; monthView.style.display = 'none';
                      renderYears();
                      dropdown.style.display = 'block';
                      trigger.classList.add('ymp-open');
                      positionDD();  // posicionar después de hacer visible (offsetHeight real)
                    }
                  });

                  // Cerrar al hacer click fuera
                  document.addEventListener('click', (e) => {
                    if (!wrap.contains(e.target) && !dropdown.contains(e.target)) closeDD();
                  });

                  // Reposicionar si el drawer hace scroll
                  drawerBody.addEventListener('scroll', () => {
                    if (dropdown.style.display !== 'none') positionDD();
                  });

                  // Exponer reset externo (usado por _niResetFilters)
                  wrap._ympReset = () => {
                    pState.year = defY;
                    pState.month = defM;
                    syncHidden();
                    updateLabel();
                    closeDD();
                  };

                  wrap.append(trigger, hidden);  // dropdown va en body (portal)
                  return wrap;
                };

                // ── Layout: un único picker sin rango ─────────────
                const item = _makeFilterItem(filter.caption, '');
                const row = document.createElement('div');
                row.className = 'ymp-row ymp-row-single';
                row.appendChild(buildPicker(''));   // sin sufijo → nombre limpio
                item.appendChild(row);
                section.appendChild(item);
                break;
              }

              // ── NEW_DATE range ───────────────────────────────
              case 'new_date': {
                if (!filter.range) break;
                const item = _makeFilterItem(filter.caption, `
            <div class="date-range-row">
              <input type="date" class="drawer-input no-icon ni-filter"
                name="${filter.name}_from" data-filter-name="${filter.name}_from">
              <div class="date-range-sep">→</div>
              <input type="date" class="drawer-input no-icon ni-filter"
                name="${filter.name}_to" data-filter-name="${filter.name}_to">
            </div>`);
                section.appendChild(item);
                break;
              }

              // ── CHECKBOX → pills ─────────────────────────────
              case 'checkbox': {
                const pillColorMap = {
                  'Por revisar': 'pill-porrevisar',
                  'Por asignar': 'pill-porasignar',
                  'Por pagar': 'pill-porpagar',
                  'Pagado': 'pill-pagado',
                  'Emitida': 'pill-emitida',
                  'Nulo': 'pill-nulo',
                };

                const item = document.createElement('div');
                item.className = 'filter-item';
                const pillsWrap = document.createElement('div');
                pillsWrap.className = 'estado-pills';

                (filter.options || []).forEach(opt => {
                  const cls = pillColorMap[opt.caption] || '';
                  const isChecked = !!opt.value;

                  // Pill como div — sin <label> nativo para evitar doble toggle
                  const pill = document.createElement('div');
                  pill.className = `estado-pill ${cls}${isChecked ? ' checked' : ''}`;
                  pill.innerHTML = `<span class="pill-dot"></span>${opt.caption}`;

                  // Input oculto — solo para que _collectFilters() lo lea
                  const cb = document.createElement('input');
                  cb.type = 'checkbox';
                  cb.className = 'ni-filter';
                  cb.name = opt.name || filter.name;
                  cb.dataset.filterName = opt.name || filter.name;
                  cb.dataset.caption = opt.caption;
                  cb.checked = isChecked;
                  cb.style.display = 'none';
                  pill.appendChild(cb);

                  // Un solo listener: toggle manual sin ambigüedad
                  pill.addEventListener('click', function () {
                    cb.checked = !cb.checked;
                    this.classList.toggle('checked', cb.checked);
                  });

                  pillsWrap.appendChild(pill);
                });

                item.appendChild(pillsWrap);
                section.appendChild(item);
                break;
              }

              // ── NEW_SELECT → <select> nativo ─────────────────
              case 'new_select': {
                const sel = document.createElement('select');
                sel.className = 'drawer-select ni-filter';
                sel.name = filter.name;
                sel.dataset.filterName = filter.name;
                sel.innerHTML = `<option value="">— ${filter.caption} —</option>`;

                const item = _makeFilterItem(filter.caption, '');
                item.appendChild(sel);
                section.appendChild(item);

                const populate = rows => {
                  rows.forEach(r => {
                    const o = document.createElement('option');
                    o.value = r.id; o.textContent = r.text;
                    sel.appendChild(o);
                  });
                };

                if (filter.dataSource) {
                  $.ajax({
                    url: `/4DACTION/_V3_${filter.dataSource}`,
                    dataType: 'json', data: { q: '' },
                    success: d => populate(d.rows || [])
                  });
                } else if (filter.dataObject) {
                  populate(filter.dataObject);
                }
                break;
              }

              // ── AUTOCOMPLETE ─────────────────────────────────
              case 'autocomplete': {
                const uid = `ni-auto-${filter.name}`;
                const item = _makeFilterItem(filter.caption, `
            <div class="filter-input-wrap">
              <i class="fas fa-search fi-icon"></i>
              <input type="search" id="${uid}"
                class="drawer-input ni-filter"
                name="${filter.name}"
                data-filter-name="${filter.name}"
                placeholder="${filter.caption}..."
                autocomplete="off">
            </div>`);
                section.appendChild(item);

                requestAnimationFrame(() => {
                  const $inp = $(`#${uid}`);
                  $inp.autocomplete({
                    minLength: 1, autoFocus: false,
                    source: (req, res) => {
                      const sinFiltro = { id: null, text: 'Sin filtro' };
                      const mapItem = r => ({ label: r.text, value: r.id });
                      if (filter.dataSource) {
                        $.ajax({
                          url: `/4DACTION/_V3_${filter.dataSource}`,
                          dataType: 'json', data: { q: req.term },
                          success: d => {
                            d.rows.unshift(sinFiltro);
                            res(d.rows.map(mapItem));
                          }
                        });
                      } else {
                        const obj = [sinFiltro, ...(filter.dataObject || [])];
                        res(obj
                          .filter(r => r.text.toLowerCase().includes(req.term.toLowerCase()) || req.term === '@')
                          .map(mapItem)
                        );
                      }
                    },
                    select: (e, ui) => {
                      $inp.val(ui.item.value === null ? '' : ui.item.label);
                      $inp.data('value', ui.item.value);
                      return false;
                    },
                    focus: (e, ui) => { $inp.val(ui.item.label); return false; }
                  });
                });
                break;
              }

            } // end switch
          }); // end filters.forEach

          drawerBody.appendChild(section);
        }); // end groups

        // Helper: crea un .filter-item con label + innerHTML
        function _makeFilterItem(caption, innerHtml) {
          const div = document.createElement('div');
          div.className = 'filter-item';
          div.innerHTML = `<div class="filter-item-label">${caption}</div>${innerHtml}`;
          return div;
        }

        // ══════════════════════════════════════════════════════════
        // 2. CICLO AJAX PROPIO
        // ══════════════════════════════════════════════════════════
        function _load(page) {
          state.page = page || 1;

          // Construir parámetros desde el estado interno
          const ajaxParams = {
            page: state.page,
            results: 40,
            q: state.q,   // término libre → servidor (igual que init viejo)
          };

          // Sort
          if (state.sortBy) { ajaxParams.sort_by = state.sortBy; }
          if (state.sortOrder) { ajaxParams.sort_order = state.sortOrder; }

          // Filtros activos
          Object.assign(ajaxParams, state.filter);

          unaBase.ui.block();
          $viewport.find('div.unique-overlay').remove();
          $viewport.prepend(`
      <div class="unique-overlay">
        <div class="unique-loading-container">
          <div class="unique-spinner"></div>
          <div class="unique-loading-text">Cargando</div>
        </div>
      </div>`);

          $.ajax({
            url: params.url(),
            type: 'GET',
            data: ajaxParams,
            dataType: 'json',
            cache: false,
          })
            .done(data => {
              state.lastData = data;
              _renderRows(data);
              _renderPagination(data.page, data.records);

              if (data.entity === 'Dtc') {
                unaBase.impuestos_dtc = data.impuestos_dtc;
              }

              // Callback del caller (tooltips, KPIs, etc.)
              if (typeof params.callback === 'function') params.callback(data);

              if (unaBase.toolbox.search.newSearch) {
                if (unaBase.toolbox.search.lastSearchNotify)
                  unaBase.toolbox.search.lastSearchNotify.remove();
                unaBase.toolbox.search.lastSearchNotify = toastr.info(
                  data.records.total > 0
                    ? `Se encontró un total de ${data.records.total} resultado${data.records.total > 1 ? 's' : ''}.`
                    : 'No se encontró ningún resultado.',
                  'Resultados de búsqueda'
                );
                unaBase.toolbox.search.newSearch = false;
              }
            })
            .fail(() => {
              toastr.error('Error al obtener el listado. Comuníquese con soporte.');
            })
            .always(() => {
              $viewport.find('div.unique-overlay').remove();
              unaBase.ui.unblock();
            });
        }

        // ── Renderizar filas ──────────────────────────────────────
        function _renderRows(data) {
          $tbody.empty();

          if (!data.rows || data.rows.length === 0) {
            $viewport.find('div.no-results').remove();
            $viewport.find('table.results').hide();
            $viewport.prepend(`
        <div style="margin:auto;font-size:14px;margin-top:3em;text-align:center;
          font-weight:bold;text-transform:uppercase;padding-top:10px;" class="no-results">
          <p class="not_found_msg" style="color:#1dba8e;">
            NO SE ENCONTRÓ NINGÚN RESULTADO. VERIFIQUE LOS FILTROS.
          </p>
        </div>`);
            return;
          }

          $viewport.find('div.no-results').remove();
          $viewport.find('table.results').show();

          data.rows.forEach((row, i) => {
            $tbody.append(params.row.html(i, data.rows));
          });

          // Bind click de filas (ir a detalle)
          $tbody.find('tr').off('click').on('click', function (e) {
            // El click en td[data-goto] lo maneja el handler del padre
          });

          // Format currency
          $viewport.find('table.results .currency').formatCurrency({
            region: 'es-CL',
            decimalSymbol: ',', digitGroupSymbol: '.',
            roundToDecimalPlace: currency.decimals,
            symbol: `<span class="symbol">${currency.symbol}</span>`,
            positiveFormat: currency.is_right ? '%n%s' : '%s%n',
            negativeFormat: currency.is_right ? '-%n%s' : '-%s%n',
          });
        }

        // ── Renderizar paginación ─────────────────────────────────
        function _renderPagination(pageInfo, recordsInfo) {
          if (!pageInfo) { $pagination.html(''); return; }

          const cur = pageInfo.current;
          const last = pageInfo.last;
          let html = '';

          const btn = (page, text, cls, disabled) => {
            if (disabled) {
              html += `<span class="disabled ${cls || ''}">${text}</span>`;
            } else if (page === cur && !cls) {
              html += `<span class="current">${text}</span>`;
            } else {
              html += `<a href="#" data-page="${page}" class="${cls || ''}">${text}</a>`;
            }
          };

          const noPaging = last <= 1;
          btn(1, '|<', 'first', noPaging || cur === 1);
          btn(cur - 1, '<', 'prev', noPaging || cur === 1);

          const start = Math.max(1, cur - 3);
          const end = Math.min(last, cur + 3);

          if (start > 1) { btn(1, '1'); if (start > 2) html += '<span>...</span>'; }
          for (let i = start; i <= end; i++) btn(i, String(i));
          if (end < last) { if (end < last - 1) html += '<span>...</span>'; btn(last, String(last)); }

          btn(cur + 1, '>', 'next', noPaging || cur === last);
          btn(last, '>|', 'last', noPaging || cur === last);

          if (recordsInfo) {
            html += `<span style="margin-left:10px;">
        Mostrando ${recordsInfo.from + 1}–${recordsInfo.to + 1} de ${recordsInfo.total}
      </span>`;
          }

          $pagination.html(html);
        }

        // ── Sort de columnas ──────────────────────────────────────
        $viewport.off('click', 'th[data-sort-by]').on('click', 'th[data-sort-by]', function (e) {
          const $th = $(this);
          const sortBy = $th.data('sort-by');

          // Toggle order
          let newOrder = 'desc';
          if (state.sortBy === sortBy) {
            newOrder = state.sortOrder === 'desc' ? 'asc' : 'desc';
          }

          // Update visual state
          $viewport.find('th[data-sort-by]')
            .removeClass('sort-order-asc sort-order-desc')
            .removeData('sort-order');
          $th.addClass(`sort-order-${newOrder}`).data('sort-order', newOrder);

          state.sortBy = sortBy;
          state.sortOrder = newOrder;
          state.page = 1;

          unaBase.toolbox.search.newSearch = true;
          _load(1);
        });

        // ── Click paginación ──────────────────────────────────────
        $viewport.off('click', '#pagination a[data-page]')
          .on('click', '#pagination a[data-page]', function (e) {
            e.preventDefault();
            const page = parseInt($(this).data('page'), 10);
            if (!isNaN(page)) _load(page);
          });

        // ══════════════════════════════════════════════════════════
        // 3. RECOLECTAR FILTROS DEL DRAWER Y EJECUTAR BÚSQUEDA
        // ══════════════════════════════════════════════════════════
        function _collectFilters() {
          const f = {};
          drawerBody.querySelectorAll('.ni-filter').forEach(el => {
            const name = el.dataset.filterName || el.name;
            if (!name) return;

            if (el.type === 'checkbox') {
              if (el.checked) f[name] = true;
            } else if (el.type === 'search') {
              // autocomplete — usar data('value') como id real
              const val = $(el).data('value');
              if (val != null && val !== '') f[name] = val;
            } else {
              if (el.value !== '') f[name] = el.value;
            }
          });
          return f;
        }

        function _niExecuteSearch() {
          state.filter = _collectFilters();
          state.page = 1;
          unaBase.toolbox.search.newSearch = true;
          _load(1);
          _niUpdateBadge();
          _niRenderTags();
          closeDrawer();
        }

        // ── Reset ─────────────────────────────────────────────────
        function _niResetFilters() {
          // Resetear pickers YMP primero (tienen estado interno propio)
          drawerBody.querySelectorAll('.ymp-wrap').forEach(wrap => {
            if (typeof wrap._ympReset === 'function') wrap._ympReset();
          });

          drawerBody.querySelectorAll('.ni-filter').forEach(el => {
            const name = el.dataset.filterName || el.name;
            const baseName = name ? name.replace(/_from$|_to$/, '') : '';
            const filterDef = params.filters.find(f => f.name === baseName);

            if (el.type === 'checkbox') {
              // Restaurar valor por defecto definido en params
              let defVal = false;
              if (filterDef && filterDef.options) {
                const opt = filterDef.options.find(o => (o.name || filterDef.name) === name);
                if (opt) defVal = !!opt.value;
              }
              el.checked = defVal;
              el.closest('.estado-pill')?.classList.toggle('checked', defVal);
            } else if (el.type === 'search') {
              el.value = ''; $(el).data('value', null);
            } else if (el.tagName === 'SELECT') {
              el.selectedIndex = 0;
            } else {
              // month inputs — restaurar currentMonth si aplica
              el.value = (filterDef && filterDef.currentMonth) ? currentMonth : '';
            }
          });

          state.filter = {};
          state.page = 1;
          unaBase.toolbox.search.newSearch = true;
          _load(1);
          _niUpdateBadge();
          _niRenderTags();
        }

        // ══════════════════════════════════════════════════════════
        // 4. BADGE + TAGS EN TOOLBAR
        // ══════════════════════════════════════════════════════════
        function _niUpdateBadge() {
          let count = 0;
          drawerBody.querySelectorAll('.ni-filter').forEach(el => {
            if (el.type === 'checkbox' && el.checked) count++;
            else if (el.type !== 'checkbox' && el.value) count++;
          });
          const badge = document.getElementById('filtrosBadge');
          const btn = document.getElementById('btnFiltros');
          if (badge) { badge.textContent = count; badge.classList.toggle('visible', count > 0); }
          if (btn) { btn.classList.toggle('active', count > 0); }
        }

        function _niRenderTags() {
          const container = document.getElementById('activeFilterTags');
          const btnClear = document.getElementById('btnClearAll');
          if (!container) return;
          container.innerHTML = '';

          const tags = [];
          drawerBody.querySelectorAll('.ni-filter').forEach(el => {
            const name = el.dataset.filterName || el.name;
            let label = '', displayVal = '';

            if (el.type === 'checkbox') {
              if (!el.checked) return;
              label = el.dataset.caption || name;
              displayVal = '✓';
            } else if (el.type === 'search') {
              displayVal = el.value; if (!displayVal) return;
              label = el.closest('.filter-item')?.querySelector('.filter-item-label')?.textContent?.trim() || name;
            } else {
              displayVal = el.value; if (!displayVal) return;
              label = el.closest('.filter-item')?.querySelector('.filter-item-label')?.textContent?.trim() || name;
              if (el.tagName === 'SELECT' && el.selectedIndex > 0) {
                displayVal = el.options[el.selectedIndex].text;
              }
            }
            tags.push({ name, label, displayVal });
          });

          if (btnClear) btnClear.style.display = tags.length ? '' : 'none';

          tags.slice(0, 5).forEach(({ name, label, displayVal }) => {
            const tag = document.createElement('div');
            tag.className = 'filter-tag';
            tag.innerHTML = `<span>${label}: <strong>${displayVal}</strong></span>
        <button class="filter-tag-remove" title="Quitar filtro">✕</button>`;
            tag.querySelector('.filter-tag-remove').addEventListener('click', () => {
              const el = drawerBody.querySelector(`[data-filter-name="${name}"]`);
              if (el) {
                if (el.type === 'checkbox') {
                  el.checked = false;
                  el.closest('.estado-pill')?.classList.remove('checked');
                } else if (el.type === 'hidden') {
                  // YMP picker — usar _ympReset para limpiar estado interno
                  el.closest('.ymp-wrap')?._ympReset?.();
                } else {
                  el.value = '';
                  if (el.type === 'search') $(el).data('value', null);
                }
              }
              _niExecuteSearch();
            });
            container.appendChild(tag);
          });

          if (tags.length > 5) {
            const more = document.createElement('div');
            more.className = 'filter-tag';
            more.textContent = `+${tags.length - 5} más`;
            container.appendChild(more);
          }
        }

        // ══════════════════════════════════════════════════════════
        // 4b. BUSCADOR TSB — integrado con el servidor (igual que init)
        // ══════════════════════════════════════════════════════════
        (function _tsbInit() {
          const tsbInput = document.getElementById('tsbInput');
          const tsbClear = document.getElementById('tsbClear');
          if (!tsbInput) return;

          let _debounce = null;
          let _highlight = null; // última query resaltada

          // ── Normalizar (tildes, lower) ─────────────────────────
          const norm = s =>
            String(s || '').toLowerCase()
              .normalize('NFD').replace(/[\u0300-\u036f]/g, '');

          // ── Resaltar coincidencias en celdas visibles ──────────
          const applyHighlight = query => {
            _highlight = query;
            const $cells = $viewport.find('table.results tbody tr td:not(:first-child)');
            $cells.each(function () {
              const orig = this.dataset.origText;
              if (!orig) return;
              if (!query) { this.textContent = orig; return; }
              const esc = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
              const regex = new RegExp(`(${esc})`, 'gi');
              this.innerHTML = orig.replace(regex, '<mark class="tsb-mark">$1</mark>');
            });
          };

          // Cachear texto plano de celdas (una vez por carga de filas)
          const cacheOriginals = () => {
            $viewport.find('table.results tbody tr td').each(function () {
              if (!this.dataset.origText) this.dataset.origText = this.textContent;
            });
          };

          // Reaplicar highlight después de cada _load (observer en tbody)
          const tbody = $viewport.find('table.results tbody')[0];
          if (tbody) {
            new MutationObserver(() => {
              // Limpiar caché de celdas nuevas
              tbody.querySelectorAll('td').forEach(td => delete td.dataset.origText);
              cacheOriginals();
              if (_highlight) applyHighlight(_highlight);
              _updateTsbCount();
            }).observe(tbody, { childList: true });
          }

          // ── Contador en toolbar ────────────────────────────────
          const _updateTsbCount = () => {
            const el = document.getElementById('result-count-toolbar');
            if (!el) return;
            const total = $viewport.find('table.results tbody tr').length;
            el.textContent = `${total} documento${total !== 1 ? 's' : ''}`;
            el.style.color = '';
          };

          // ── Ejecutar búsqueda en servidor ──────────────────────
          const _tsbSearch = () => {
            const q = tsbInput.value.trim();
            tsbClear.classList.toggle('tsb-clear-visible', q.length > 0);

            if (q === state.q) return;          // sin cambios reales
            state.q = q;
            state.page = 1;
            unaBase.toolbox.search.newSearch = true;
            _load(1);                           // dispara AJAX con q en ajaxParams
          };

          // ── Debounce 400ms mientras escribe (igual que init viejo) ─
          tsbInput.addEventListener('input', () => {
            clearTimeout(_debounce);
            _debounce = setTimeout(_tsbSearch, 400);
          });

          // ── Enter → búsqueda inmediata ─────────────────────────
          tsbInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              clearTimeout(_debounce);
              _tsbSearch();
            }
            if (e.key === 'Escape') {
              tsbInput.value = '';
              clearTimeout(_debounce);
              state.q = '';
              tsbClear.classList.remove('tsb-clear-visible');
              applyHighlight('');
              // No relanzar AJAX si ya estaba vacío
              if (state.q !== '') _load(1);
              tsbInput.blur();
            }
          });

          // ── Botón ✕ limpiar ────────────────────────────────────
          tsbClear.addEventListener('click', () => {
            tsbInput.value = '';
            tsbClear.classList.remove('tsb-clear-visible');
            if (state.q !== '') {
              state.q = '';
              state.page = 1;
              unaBase.toolbox.search.newSearch = true;
              _load(1);
            }
            applyHighlight('');
            tsbInput.focus();
          });

          // ── Ctrl/Cmd+F → foco al buscador ─────────────────────
          document.addEventListener('keydown', e => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
              if (!['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
                e.preventDefault();
                tsbInput.focus();
                tsbInput.select();
              }
            }
          });

          // Después de cada _load, reaplicar highlight si hay término activo
          // Wrapped via MutationObserver en tbody (ya registrado arriba)
          // y también expuesto para llamada manual si se necesita
          window._tsbApplyHighlight = () => {
            cacheOriginals();
            applyHighlight(state.q);
          };
        })();

        // ══════════════════════════════════════════════════════════
        // 5. EXPONER AL SCOPE GLOBAL (botones HTML onclick)
        // ══════════════════════════════════════════════════════════
        window._niApply = _niExecuteSearch;
        window._niReset = _niResetFilters;
        window.clearAllFilters = function () { _niResetFilters(); closeDrawer(); };

        // ══════════════════════════════════════════════════════════
        // 6. CARGA INICIAL
        // ══════════════════════════════════════════════════════════
        // Recopilar defaults (por pagar: true, fecha emisión: mes actual, etc.)
        state.filter = _collectFilters();
        unaBase.toolbox.search.newSearch = true;
        _niUpdateBadge();
        _load(1);

      },
      initList: function (params) {

        // Guardado de ítems de búsqueda con checkboxes
        // var selectedItems = [];
        // var selectedItemsLength = 0;

        // if (params.hideSearchBox) {
        //   $('input[name="q"]')
        //     .closest("label")
        //     .hide();
        // } else {
        //   $('input[name="q"]')
        //     .closest("label")
        //     .show();
        // }
        // unaBase.toolbox.search.destroy();
        // var search = unaBase.toolbox.dialog
        //   ? $("#dialog-search")
        //   : $("#search");

        // unaBase.toolbox.search.initialized = true;
        // unaBase.toolbox.search.q = "";
        // unaBase.toolbox.search.q2 = "";
        // unaBase.toolbox.search.pageScroll = null;
        // unaBase.toolbox.search.newSearch = true;
        // if (!unaBase.toolbox.dialog) {
        //   unaBase.toolbox.search.advancedFilter = {};
        // }



        // if (
        //   unaBase.toolbox.search.savedSearch === null ||
        //   unaBase.toolbox.search.savedSearch == "q=" ||
        //   unaBase.toolbox.dialog
        // ) {
        //   unaBase.toolbox.search._disabled = false;
        // }
        // //unaBase.toolbox.search.username = $('body > aside > div > div > h1').data('username');

        // search.find("> label > input").val("");
        // search.show();

        // search.find("> fieldset").hide();
        // search.find("> button").removeClass("active");
        // search.find("> button").removeClass("enabled");

        // search
        //   .find("> label:nth-of-type(2)")
        //   .nextAll()
        //   .remove();
        // var filters = search;
        // search.append(
        //   '<div class="checkboxes" style="display: inline-block; margin-top: 5px;"></div>'
        // );

        // for (var i in params.filters) {

        //   if (params.filters[i].caption != "") {
        //     switch (params.filters[i].type) {
        //       case "new_date": {
        //         if (params.filters[i].range) {
        //           var label = $(`<label title="${params.filters[i].caption}" class="date"></label>`
        //           );
        //           label.append(
        //             '<button class="filter date">' +
        //             params.filters[i].caption +
        //             "</button>"
        //           );
        //           var date = new Date();
        //           var currentMonth =
        //             date.getFullYear() +
        //             "-" +
        //             sprintf("%02d", (date.getMonth() + 1).toString());
        //           var currentYear = date.getFullYear();
        //           // verificar date ya definido

        //           if (
        //             typeof params.filters[i].currentYear != "undefined" &&
        //             params.filters[i].currentYear
        //           ) {

        //             label.append(
        //               '<input autocomplete="off"  placeholder="0000-00" type="text" name="' +
        //               params.filters[i].name +
        //               '" value="' +
        //               currentYear +
        //               '" style="width: 60px; margin-left: 4px">'
        //             );
        //           }
        //           else {

        //             label.append(
        //               '<input autocomplete="off"  placeholder="0000-00" type="text" name="' +
        //               params.filters[i].name +
        //               '" style="width: 60px; margin-left: 4px">'
        //             );
        //           }

        //           label.append(
        //             '<button class="clear date">Quitar filtro ' +
        //             params.filters[i].caption +
        //             "</button>"
        //           );

        //           filters.append(label);
        //           (function (name, filters) {
        //             filters
        //               .find(".filter.date")
        //               .button({
        //                 text: false,
        //                 icons: {
        //                   primary: "ui-icon-calendar"
        //                 }
        //               })
        //               .unbind("click")
        //               .click(function (event) {

        //               });

        //             filters
        //               .find("button.clear.date")
        //               .button({
        //                 text: false,
        //                 icons: {
        //                   primary: "ui-icon-circle-close"
        //                 }
        //               })
        //               .unbind("click")
        //               .click(function (event) {
        //                 $(event.target)
        //                   .closest("label")
        //                   .find("input")
        //                   .val("");
        //                 // $(event.target).closest('label').find('input').data('changed', false);
        //                 $(event.target)
        //                   .closest("label")
        //                   .find("input")
        //                   .data("changed", true);
        //                 advancedSearch();
        //               });

        //             filters.find('[name="' + name + '"]').datepicker({
        //               dateFormat: "dd-mm-yy",
        //               monthNames: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        //               dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        //               dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Juv', 'Vie', 'Sáb'],
        //               dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
        //               onSelect: function () {
        //                 //- saveAsync();
        //                 advancedSearch();
        //               }
        //             });
        //           })(params.filters[i].name, filters);
        //         }
        //         break;
        //       }
        //       case "month":
        //         if (params.filters[i].range) {
        //           //filters+= '<span class="title">' + params.filters[i].caption + '</span>';
        //           //filters+= '<label class="half-width"><span>Desde</span><input type="month" name="' + params.filters[i].name + '_from"></label>';
        //           //filters+= '<label class="half-width"><span>Hasta</span><input type="month" name="' + params.filters[i].name + '_to"></label>';

        //           var label = $(
        //             '<label title="' +
        //             params.filters[i].caption +
        //             '" class="date"></label>'
        //           );
        //           label.append(
        //             '<button class="filter date">' +
        //             params.filters[i].caption +
        //             "</button>"
        //           );
        //           var date = new Date();
        //           var currentMonth =
        //             date.getFullYear() +
        //             "-" +
        //             sprintf("%02d", (date.getMonth() + 1).toString());
        //           var currentYear = date.getFullYear();
        //           // verificar date ya definido
        //           if (params.filters[i].currentMonth) {
        //             var date = new Date();
        //             label.append(
        //               '<input autocomplete="off" placeholder="0000-00" type="text" name="' +
        //               params.filters[i].name +
        //               '" value="' +
        //               currentMonth +
        //               '" style="width: 40px; margin-left: 4px">'
        //             );
        //           } else {
        //             if (
        //               typeof params.filters[i].currentYear != "undefined" &&
        //               params.filters[i].currentYear
        //             )
        //               label.append(
        //                 '<input autocomplete="off"  placeholder="0000-00" type="text" name="' +
        //                 params.filters[i].name +
        //                 '" value="' +
        //                 currentYear +
        //                 '" style="width: 40px; margin-left: 4px">'
        //               );
        //             else
        //               label.append(
        //                 '<input autocomplete="off"  placeholder="0000-00" type="text" name="' +
        //                 params.filters[i].name +
        //                 '" style="width: 40px; margin-left: 4px">'
        //               );
        //           }
        //           label.append(
        //             '<button class="clear date">Quitar filtro ' +
        //             params.filters[i].caption +
        //             "</button>"
        //           );

        //           filters.append(label);

        //           (function (name, filters) {
        //             filters
        //               .find(".filter.date")
        //               .button({
        //                 text: false,
        //                 icons: {
        //                   primary: "ui-icon-calendar"
        //                 }
        //               })
        //               .unbind("click")
        //               .click(function (event) {
        //                 $(event.target)
        //                   .closest("label")
        //                   .find('[name="' + name + '"]')
        //                   .monthpicker("show");
        //                 //var id = filters.find('[name="' + name + '"]').attr('id');
        //               });

        //             filters
        //               .find("button.clear.date")
        //               .button({
        //                 text: false,
        //                 icons: {
        //                   primary: "ui-icon-circle-close"
        //                 }
        //               })
        //               .unbind("click")
        //               .click(function (event) {
        //                 $(event.target)
        //                   .closest("label")
        //                   .find("input")
        //                   .val("");
        //                 // $(event.target).closest('label').find('input').data('changed', false);
        //                 $(event.target)
        //                   .closest("label")
        //                   .find("input")
        //                   .data("changed", true);
        //                 advancedSearch();
        //               });

        //             filters.find('[name="' + name + '"]').monthpicker({
        //               changeMonth: true,
        //               changeYear: true,
        //               yearRange: "c-10:c+3",
        //               onSelect: function (event) {
        //                 filters.find("button.clear.date").show();
        //                 //filters.find('[name="' + name + '"]').trigger('change');
        //                 //filters.find('[name="' + name + '"]').trigger('keydown');
        //                 advancedSearch();
        //               }
        //             });
        //           })(params.filters[i].name, filters);
        //         } else {
        //           //filters+= '<label><span>' + params.filters[i].caption + '</span><input type="month" name="' + params.filters[i].name + '"></label>';
        //         }
        //         break;
        //       case "year":
        //         var label = $(
        //           '<label title="' +
        //           params.filters[i].caption +
        //           '" class="date"></label>'
        //         );
        //         label.append(
        //           '<button class="filter date">' +
        //           params.filters[i].caption +
        //           "</button>"
        //         );
        //         var date = new Date();
        //         var currentMonth =
        //           date.getFullYear() +
        //           "-" +
        //           sprintf("%02d", (date.getMonth() + 1).toString());
        //         var currentYear = date.getFullYear();

        //         // if (params.filters[i].currentMonth) {
        //         // 	var date = new Date();
        //         // 	label.append('<input placeholder="0000-00" type="text" name="' + params.filters[i].name + '" value="'+ currentMonth +'" style="width: 40px; margin-left: 4px">');
        //         // }else{
        //         // 	if (typeof params.filters[i].currentYear != 'undefined' && params.filters[i].currentYear)
        //         // 		label.append('<input placeholder="0000-00" type="text" name="' + params.filters[i].name + '" value="'+ currentYear +'" style="width: 40px; margin-left: 4px">');
        //         // 	else
        //         // 		label.append('<input placeholder="0000-00" type="text" name="' + params.filters[i].name + '" style="width: 40px; margin-left: 4px">');
        //         // }
        //         label.append(
        //           '<select name="' +
        //           params.filters[i].name +
        //           '" style="width: 60px; margin-left: 20px;">'
        //         );
        //         var filter = label.find(
        //           '[name="' + params.filters[i].name + '"]'
        //         );
        //         for (var y = currentYear + 1; y >= currentYear - 10; y--) {
        //           filter.append(
        //             '<option value="' +
        //             y +
        //             '"' +
        //             (y == currentYear ? " selected" : "") +
        //             ">" +
        //             y +
        //             "</option>"
        //           );
        //         }
        //         filter.bind("change", function (event) {
        //           advancedSearch();
        //         });

        //         filters.append(label);

        //         // (function(name, filters) {
        //         //
        //         // 	filters.find('.filter.date').button({
        //         // 		text: false,
        //         // 		icons: {
        //         // 			primary: 'ui-icon-calendar'
        //         //
        //         // 		}
        //         // 	}).unbind('click').click(function(event) {
        //         // 		$(event.target).closest('label').find('[name="' + name + '"]').monthpicker('show');
        //         // 	});
        //         //
        //         // 	filters.find('[name="' + name + '"]').monthpicker({
        //         // 		changeMonth: false,
        //         // 		changeYear: true,
        //         // 		yearRange: 'c-10:c+3',
        //         // 		onSelect: function(event) {
        //         // 			//filters.find('button.clear.date').show();
        //         // 			//filters.find('[name="' + name + '"]').trigger('change');
        //         // 			//filters.find('[name="' + name + '"]').trigger('keydown');
        //         // 			advancedSearch();
        //         // 		}
        //         // 	});
        //         // })(params.filters[i].name, filters);

        //         break;
        //       case "checkbox":
        //         //filters+= '<span class="title">' + params.filters[i].caption + '</span>';
        //         //for (j in params.filters[i].options) {
        //         //	filters+= '<label class="checkbox">' + params.filters[i].options[j].caption + ' <input type="checkbox" name="' + ((params.filters[i].options[j].name)? params.filters[i].options[j].name : params.filters[i].name ) + '" value="true"' + ((params.filters[i].options[j].value)? ' checked' : '') + '></label>';
        //         //}

        //         for (j in params.filters[i].options) {
        //           if (params.filters[i].options[j].name != "") {
        //             // if(params.filters[i].options[j].name != "" && typeof params.filters[i].options[j].name != "undefined"){
        //             filters
        //               .find(".checkboxes")
        //               .append(
        //                 '<label style="margin-right: 10px;"><input type="checkbox" name="' +
        //                 (params.filters[i].options[j].name
        //                   ? params.filters[i].options[j].name
        //                   : params.filters[i].name) +
        //                 '" value="true"' +
        //                 (params.filters[i].options[j].value
        //                   ? " checked"
        //                   : "") +
        //                 "> " +
        //                 params.filters[i].options[j].caption +
        //                 "</label>"
        //               );

        //             // }
        //           }
        //         }
        //         break;
        //       case "radio":
        //         //filters+= '<span class="title">' + params.filters[i].caption + '</span>';
        //         //for (j in params.filters[i].options) {
        //         //	filters+= '<label class="checkbox">' + params.filters[i].options[j].caption + ' <input type="checkbox" name="' + ((params.filters[i].options[j].name)? params.filters[i].options[j].name : params.filters[i].name ) + '" value="true"' + ((params.filters[i].options[j].value)? ' checked' : '') + '></label>';
        //         //}

        //         for (j in params.filters[i].options) {
        //           filters
        //             .find(".checkboxes")
        //             .append(
        //               '<label style="margin-right: 10px;"><input class="' +
        //               (params.filters[i].preventSearch
        //                 ? "prevent-search"
        //                 : "") +
        //               '" type="radio" name="' +
        //               (params.filters[i].options[j].name
        //                 ? params.filters[i].options[j].name
        //                 : params.filters[i].name) +
        //               '" value="true"' +
        //               (params.filters[i].options[j].value ? " checked" : "") +
        //               "> " +
        //               params.filters[i].options[j].caption +
        //               "</label>"
        //             );
        //         }
        //         break;
        //       case "text":
        //         //filters+= '<label><span>' + params.filters[i].caption + '</span><input type="text" name="' + params.filters[i].name + '"></label>';
        //         break;
        //       case "autocomplete":
        //         //filters+= '<label><span>' + params.filters[i].caption + '</span><input id="autocomplete_' + params.filters[i].name + '" type="search" name="' + params.filters[i].name + '"><button class="show ' + params.filters[i].name + '"></button></label>';
        //         filters.append(
        //           '<label class="autocomplete" title="' +
        //           params.filters[i].caption +
        //           '" style="margin-right: 10px;"><span>' +
        //           params.filters[i].caption +
        //           '</span><input style="width: 80px;border-radius: none; margin-right: 2px;" id="autocomplete_' +
        //           params.filters[i].name +
        //           '" type="search" name="' +
        //           params.filters[i].name +
        //           '" placeholder="' +
        //           params.filters[i].caption +
        //           '"><button style="height: 22px;" class="show ' +
        //           params.filters[i].name +
        //           ' boton"></button></label>'
        //         );
        //         break;
        //       case "new_select":
        //         filters.append(
        //           `<label class="" title="${params.filters[i].caption}" style="margin-right: 10px;"><div class="custom-select-wrapper">
        //           <div class="custom-select-new select_custom_${params.filters[i].name}">
        //               <div class="custom-select-text">${params.filters[i].caption}</div>
        //               <div class="custom-select-icon"><i class="fa-solid fa-angle-down"></i></div>
        //           </div>
        //           <div class="custom-select-dropdown custom-select-dropdown_${params.filters[i].name}">

        //           </div>
        //       </div>
        //       </label>`
        //         );
        //         break;
        //       case "multiple":
        //         //filters.append('<label class="autocomplete" title="'+ params.filters[i].caption + '" style="margin-right: 10px;"><span>' + params.filters[i].caption + '</span><input style="width: 80px;border-radius: none; margin-right: 2px;" id="autocomplete_' + params.filters[i].name + '" type="search" name="' + params.filters[i].name + '" placeholder="' + params.filters[i].caption + '"><button style="height: 22px;" class="show ' + params.filters[i].name + ' boton"></button></label>');

        //         // test
        //         var button = {
        //           name: params.filters[i].name,
        //           icons: {
        //             primary: "ui-icon-search",
        //             secondary: "ui-icon-triangle-1-s"
        //           },
        //           caption: params.filters[i].caption,
        //           action: function (event) {
        //             var buttonObject = $(event.target).closest("button");
        //             var dataSource = buttonObject.data("source");
        //             var url =
        //               "/v3/script/multiselect.shtml?datasource=" + dataSource;
        //             buttonObject.data("url", url);
        //             buttonObject.tooltipster({
        //               content: function () {
        //                 var styles = {
        //                   width: "300px",
        //                   backgroundColor: "white"
        //                 };
        //                 var htmlObject = $("<div>");
        //                 htmlObject.css(styles);
        //                 htmlObject.load(url);
        //                 return htmlObject;
        //               },
        //               interactive: true,
        //               interactiveTolerance: 5000,
        //               trigger: "click",
        //               position: "bottom",
        //               theme: "tooltipster-custom-theme"
        //               //interactiveAutoClose: true
        //             });
        //             buttonObject.tooltipster("show");
        //           }
        //         };

        //         //filters.append('<label class="autocomplete" title="'+ params.filters[i].caption + '" style="margin-right: 10px;"><span>' + params.filters[i].caption + '</span><input style="width: 80px;border-radius: none; margin-right: 2px;" id="autocomplete_' + params.filters[i].name + '" type="search" name="' + params.filters[i].name + '" placeholder="' + params.filters[i].caption + '"><button style="height: 22px;" class="show ' + params.filters[i].name + ' boton"></button></label>');
        //         button_container = $(
        //           '<label class="autocomplete multiple" title="' +
        //           params.filters[i].caption +
        //           '"><button data-name="' +
        //           params.filters[i].name +
        //           '" data-source="' +
        //           params.filters[i].dataSource +
        //           '">' +
        //           button.caption +
        //           "</button></label>"
        //         );
        //         button_container
        //           .find("button")
        //           .button({
        //             icons:
        //               typeof button.icon != "undefined"
        //                 ? {
        //                   primary: button.icon
        //                 }
        //                 : button.icons
        //           })
        //           .click(button.action);
        //         filters.append(button_container);

        //         break;
        //       case "date_advanced":
        //         var hiddenDiv = $(
        //           '<div data-name="' +
        //           params.filters[i].name +
        //           '" style="display: none;"></div>'
        //         );

        //         var optionsNode = $("<ul></ul>");
        //         for (
        //           var j = 0, len = params.filters[i].options.length;
        //           j < len;
        //           j++
        //         ) {
        //           var optionNode = $(
        //             '\
        // 						<li data-name="' +
        //             params.filters[i].options[j].name +
        //             '" style="font-size: 12px; margin-bottom: 5px; margin-right: 5px; display: inline-block; border: 1px solid lightgrey; border-radius: 5px;">				\
        // 							<label>																				\
        // 								<!--<span																			\
        // 									style="display: block; margin-bottom: 2px;">								\
        // 									' +
        //             params.filters[i].options[j].caption +
        //             '</span>	-->						\
        // 								<label style="width: 101px; margin-left: 2px; margin-right: 2px;				\
        // 									border: 1px solid lightgrey; display: inline-block; padding-top: 1px;		\
        // 									border-radius: 5px; background-color: white; padding-bottom: 1px;			\
        // 									padding-left: 1px;">														\
        // 									<button class="filter date ui-button ui-widget ui-state-default				\
        // 										ui-corner-all ui-button-icon-only" role="button" aria-disabled="false"	\
        // 										style="width: 24px; height: 21px;">										\
        // 										<span class="ui-button-icon-primary ui-icon ui-icon-calendar"></span>	\
        // 										<span class="ui-button-text"></span>									\
        // 									</button>																	\
        // 									<input style="width: 40px; margin-left: 4px; font-size: 10px;" type="text"	\
        // 										name="' +
        //             params.filters[i].options[j].name +
        //             '_from">					\
        // 									<button style="width: 24px; height: 21px;" class="clear date ui-button		\
        // 										ui-widget ui-state-default ui-corner-all ui-button-icon-only"			\
        // 										role="button" aria-disabled="false"	title="Quitar filtro">				\
        // 										<span class="ui-button-icon-primary ui-icon								\
        // 											ui-icon-circle-close"></span>										\
        // 										<span class="ui-button-text"></span>									\
        // 									</button>																	\
        // 								</label>																		\
        // 								<label style="width: 101px; margin-left: 2px; margin-right: 2px;				\
        // 									border: 1px solid lightgrey; display: inline-block; padding-top: 1px;		\
        // 									border-radius: 5px; background-color: white; padding-bottom: 1px;			\
        // 									padding-left: 1px;">														\
        // 									<button class="filter date ui-button ui-widget ui-state-default				\
        // 										ui-corner-all ui-button-icon-only" role="button" aria-disabled="false"	\
        // 										style="width: 24px; height: 21px;">										\
        // 										<span class="ui-button-icon-primary ui-icon ui-icon-calendar"></span>	\
        // 										<span class="ui-button-text"></span>									\
        // 									</button>																	\
        // 									<input style="width: 40px; margin-left: 4px; font-size: 10px;" type="text"	\
        // 										name="' +
        //             params.filters[i].options[j].name +
        //             '_to">					\
        // 									<button style="width: 24px; height: 21px;" class="clear date ui-button		\
        // 										ui-widget ui-state-default ui-corner-all ui-button-icon-only"			\
        // 										role="button" aria-disabled="false"	title="Quitar filtro">				\
        // 										<span class="ui-button-icon-primary ui-icon								\
        // 											ui-icon-circle-close"></span>										\
        // 										<span class="ui-button-text"></span>									\
        // 									</button>																	\
        // 								</label>																		\
        // 							</label>																			\
        // 						</li>																					\
        // 					'
        //           );

        //           optionsNode
        //             .find("button.clear.date")
        //             .first()
        //             .click(function (event) {
        //               $(event.target)
        //                 .closest("label")
        //                 .find("input")
        //                 .val("");
        //             });

        //           optionsNode
        //             .find("button.clear.date")
        //             .last()
        //             .click(function (event) {
        //               $(event.target)
        //                 .closest("label")
        //                 .find("input")
        //                 .val("");
        //             });

        //           optionNode
        //             .find(
        //               '[name="' + params.filters[i].options[j].name + '_from"]'
        //             )
        //             .monthpicker({
        //               changeMonth: true,
        //               changeYear: true,
        //               yearRange: "c-10:c+3",
        //               onSelect: function (event) {
        //                 //filters.find('button.clear.date').show();
        //                 //advancedSearch();
        //               }
        //             });
        //           optionNode
        //             .find(
        //               '[name="' + params.filters[i].options[j].name + '_to"]'
        //             )
        //             .monthpicker({
        //               changeMonth: true,
        //               changeYear: true,
        //               yearRange: "c-10:c+3",
        //               onSelect: function (event) {
        //                 //filters.find('button.clear.date').show();
        //                 //advancedSearch();
        //               }
        //             });

        //           if (!params.filters[i].options[j].default) optionNode.hide();

        //           optionsNode.append(optionNode);
        //         }
        //         /*
        //         var searchButton = $('<button class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary" role="button" aria-disabled="false"><span class="ui-button-icon-primary ui-icon ui-icon-search"></span><span class="ui-button-text">Aplicar búsqueda</span></button>');
        //         searchButton.click(function() {
        //           //filters.find('div[data-name="' + params.filters[i].name + '"]').hide();
        //           $('button.show.' + params.filters[i].name).closest('label').show();
        //           advancedSearch();
        //         });

        //         var closeButton = $('<button class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary" role="button" aria-disabled="false"><span class="ui-button-icon-primary ui-icon ui-icon-triangle-1-n"></span><span class="ui-button-text">Menos</span></button>');
        //         closeButton.click(function() {
        //           //filters.find('div[data-name="' + params.filters[i].name + '"]').hide();
        //           //$('button.show.' + params.filters[i].name).closest('label').show();
        //           // esconder buscador y aplicar busqueda normal
        //           advancedSearch();
        //         });
        //         //optionsNode.append(searchButton);
        //         optionsNode.append(searchButton).append(closeButton);
        //         */

        //         var buttons = $(
        //           '\
        // 					<div style="display: inline-block;">\
        // 						<button class="search-button ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary" role="button" aria-disabled="false"><span class="ui-button-icon-primary ui-icon ui-icon-search"></span><span class="ui-button-text">Aplicar búsqueda</span></button>\
        // 						<button class="close-button ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary" role="button" aria-disabled="false"><span class="ui-button-icon-primary ui-icon ui-icon-triangle-1-n"></span><span class="ui-button-text">Menos</span></button>\
        // 						<button><span>dummy</span></button>\
        // 					</div>\
        // 				'
        //         );

        //         buttons.find("button.search-button").click(function () {
        //           //$('button.show.' + params.filters[i].name).closest('label').show();
        //           advancedSearch();
        //         });

        //         buttons.find("button.close-button").click(function () {
        //           $('div[data-name="' + params.filters[i].name + '"]')
        //             .find("select")
        //             .val("none")
        //             .trigger("change"); // cancelar filtro más
        //           $('div[data-name="' + params.filters[i].name + '"]').hide(); // ocultar div
        //           $("button.show." + params.filters[i].name)
        //             .closest("label")
        //             .show(); // mostrar botón busqueda más

        //           advancedSearch();
        //         });

        //         buttons.appendTo(optionsNode);

        //         var htmlObject = $('<div style="margin-top: 10px;">');

        //         var selectorNode = $("<select></select>");
        //         selectorNode.append(
        //           $('<option value="none selected">Ninguna</option>')
        //         );
        //         for (
        //           var j = 0, len = params.filters[i].options.length;
        //           j < len;
        //           j++
        //         ) {
        //           selectorNode.append(
        //             $(
        //               '<option value="' +
        //               params.filters[i].options[j].name +
        //               '">' +
        //               params.filters[i].options[j].caption +
        //               "</option>"
        //             )
        //           );
        //         }
        //         selectorNode
        //           .bind("change", function (event) {
        //             var name = $(event.target).val();
        //             if (name == "none") {
        //               optionsNode.find("li").hide();
        //               optionsNode
        //                 .find("li")
        //                 .find("input")
        //                 .each(function (key, item) {
        //                   $(item).val("");
        //                 });
        //             } else {
        //               optionsNode
        //                 .find('li:not([data-name="' + name + '"])')
        //                 .hide();
        //               optionsNode
        //                 .find('li:not([data-name="' + name + '"])')
        //                 .find("input")
        //                 .each(function (key, item) {
        //                   $(item).val("");
        //                 });

        //               if (defaultValue != "") {
        //                 var index = fastArrayObjectSearch(
        //                   params.filters[i].options,
        //                   "name",
        //                   name
        //                 );
        //                 if (index != -1) {
        //                   var currentMonth =
        //                     date.getFullYear() +
        //                     "-" +
        //                     sprintf("%02d", (date.getMonth() + 1).toString());
        //                   var currentYear = date.getFullYear();
        //                   var defaultValue = "";
        //                   if (params.filters[i].options[index].currentMonth) {
        //                     defaultValue = currentMonth;
        //                   }
        //                   if (params.filters[i].options[index].currentYear) {
        //                     defaultValue = currentYear;
        //                   }
        //                   optionsNode
        //                     .find('li[data-name="' + name + '"]')
        //                     .find('[name="' + name + '_from"]')
        //                     .val(defaultValue);
        //                   optionsNode
        //                     .find('li[data-name="' + name + '"]')
        //                     .find('[name="' + name + '_to"]')
        //                     .val(defaultValue);
        //                 }
        //               }

        //               optionsNode.find('li[data-name="' + name + '"]').show();
        //             }
        //           })
        //           .trigger("change");

        //         htmlObject.append(selectorNode);
        //         htmlObject.append(optionsNode);

        //         hiddenDiv.append(htmlObject);

        //         filters
        //           .find('div[data-name="' + params.filters[i].name + '"]')
        //           .remove();
        //         filters.append(hiddenDiv);

        //         button_container = $(
        //           '<label style="position: relative; top: -2px;" title="' +
        //           params.filters[i].caption +
        //           '"><button class="show ' +
        //           params.filters[i].name +
        //           '"></button></label>'
        //         );
        //         button_container
        //           .find("button")
        //           .button({
        //             icons: {
        //               primary: "ui-icon-search",
        //               secondary: "ui-icon-triangle-1-s"
        //             },
        //             label: params.filters[i].caption
        //           })
        //           .click(function (event) {
        //             hiddenDiv.toggle();

        //             $(event.target)
        //               .closest("label")
        //               .hide();
        //             // cambiar tag del boton segun abierto o cerrado

        //             if (!hiddenDiv.is(":hidden")) {
        //               var index = fastArrayObjectSearch(
        //                 params.filters[i].options,
        //                 "default",
        //                 true
        //               );
        //               if (index != -1) {
        //                 filters
        //                   .find(
        //                     'div[data-name="' + params.filters[i].name + '"]'
        //                   )
        //                   .find("select")
        //                   .val(params.filters[i].options[index].name)
        //                   .change();
        //               }
        //             } else {
        //               filters
        //                 .find('div[data-name="' + params.filters[i].name + '"]')
        //                 .find("select")
        //                 .val("none")
        //                 .change();
        //             }
        //           });
        //         filters.append(button_container);
        //         break;
        //       case "select":
        //         var selectContainer = $('<label class="select" title="' + params.filters[i].caption + '"></label>');
        //         var selectElement = $('<select name="' + params.filters[i].name + '" type="select"></select>');

        //         for (j in unaBase.money) {
        //           var option = $('<option value="' + unaBase.money[j].codigo + '">' + unaBase.money[j].nombre + '</option>');

        //           if (unaBase.money[j].selected) {
        //             option.prop('selected', true);
        //           }

        //           selectElement.append(option);
        //         }

        //         function handleSelectChange() {

        //           advancedSearch();
        //         }

        //         selectElement.change(handleSelectChange);

        //         selectContainer.append(selectElement);
        //         filters.append(selectContainer);
        //         break;

        //       default:
        //         //filters+= '<label><span>' + params.filters[i].caption + '</span><input type="text" name="' + params.filters[i].name + '"></label>';
        //         break;
        //     }
        //   }
        // }

        // search.find("> fieldset > label").remove();
        // search.find("> fieldset > span").remove();

        // if (!params.hideSearchBox && params.doubleSearch) {
        //   $('input[name="q2"]')
        //     .closest("label")
        //     .show();
        //   if (params.secondarySearchCaption) {
        //     $('input[name="q2"]').attr(
        //       "placeholder",
        //       params.secondarySearchCaption
        //     );
        //   }
        // } else {
        //   $('input[name="q2"]')
        //     .closest("label")
        //     .hide();
        // }

        // var updateSearchFilter = function (event) {
        //   //if (event.isTrigger != 3) {
        //   var areChecked = false;
        //   var checkboxes = search.find('input[type="checkbox"]');

        //   if (checkboxes.length > 1) {
        //     checkboxes.each(function () {
        //       areChecked |= $(this).prop("checked");
        //     });
        //     if (areChecked) advancedSearch();
        //   } else advancedSearch();
        //   //}
        // };
        // search
        //   .find('input:not([type="search"]):not(.prevent-search)')
        //   .unbind("change")
        //   .bind("change", function (event) {
        //     if (event.isTrigger != 3) updateSearchFilter(event);
        //   });

        // search
        //   .find('input:not([type="search"]):not(.prevent-search)')
        //   .unbind("update")
        //   .bind("update", updateSearchFilter);


        // let globalClickHandler = null;
        // let allSelects = [];


        let inputsOptions = {};
        for (var i in params.filters) {
          if (params.filters[i].type === "ub-select") {
            const filter = params.filters[i];
            if (typeof filter.dataSource !== "undefined") {
              const data = { q: '' };
              $.ajax({
                url: `/4DACTION/_V3_${filter.dataSource}`,
                dataType: "json",
                async: false,
                data: data,
                success: function (data) {
                  inputsOptions[filter.name] = data.rows.map(item => ({ name: item.text, id: item.id }));
                }
              });
            } else {
              inputsOptions[filter.name] = filter.dataObject.map(item => ({ name: item.text, id: item.id }));
            }
          }
        }

        const inputs = Object.keys(inputsOptions);

        inputs.forEach((i) => {
          params.loadFilters(i, inputsOptions)
        });


        const appendResult = (
          pageNumber,
          query,
          sortBy,
          sortOrder,
          advancedFilter,
          query2
        ) => {

          // if (!unaBase.toolbox.search.initialized) return false;

          var sortParams = {};
          // viewport.find('table > thead > tr > th').each(function() {
          // viewport
          //   .find(
          //     "table.results" +
          //     (typeof params.container != "undefined"
          //       ? "." + params.container
          //       : "") +
          //     " > thead > tr > th"
          //   )
          //   .each(function () {
          //     if (typeof $(this).data("sort-order") != "undefined") {
          //       sortParams = {
          //         sort_by: $(this).data("sort-by"),
          //         sort_order: $(this).data("sort-order")
          //       };
          //       return false;
          //     }
          //   });

          // $.extend(ajaxParams, ajaxParams, sortParams);

          // $.extend(ajaxParams, ajaxParams, advancedFilter);

          // var cantRegistrosEncontrados = 0;
          // if (typeof params.data != "undefined")
          //   $.extend(ajaxParams, params.data);
          // //if (typeof unaBase.toolbox.search._disabled == "undefined" || (typeof unaBase.toolbox.search._disabled != "undefined" && unaBase.toolbox.search._disabled == false))  {
          // unaBase.ui.block();
          const bodyList = document.querySelector('.containerBox__table .containerBox__table-items')
          if (bodyList) {
            bodyList.innerHTML = ''
          }

          // Función para obtener los valores de los filtros
          const getFilterValues = () => {
            const filterValues = {};

            // Obtener todos los elementos de filtro en el modal
            const filterButtons = document.querySelectorAll('.CustomModal__body-group-input button.inputFilter');

            filterButtons.forEach(button => {
              const filterId = button.id.replace('Btn', ''); // Obtener el ID del filtro sin 'Btn'
              const filterValueElement = document.getElementById(filterId);

              if (filterValueElement && filterValueElement.style.display !== 'none') {
                filterValues[filterId] = filterValueElement.dataset.id;
              }
            });

            // Obtener todos los valores de los filtros de fecha
            const dateFilters = document.querySelectorAll('.calendar');
            dateFilters.forEach(dateFilter => {
              const selectedDate = dateFilter.querySelector('.selectedDate');
              filterValues[dateFilter.id] = `${selectedDate.dataset.date}`;
            });

            // Obtener todos los valores de los filtros de checkbox
            const checkboxGroups = document.querySelectorAll('.CustomModal__body-group');

            checkboxGroups.forEach(group => {
              const checkboxes = group.querySelectorAll('.CustomModal__body-group-options-container input[type="checkbox"]');

              checkboxes.forEach(checkbox => {
                // Guardar el estado de cada checkbox directamente en filterValues
                filterValues[checkbox.name] = checkbox.checked;
              });
            });

            return filterValues;
          };



          var listHeight = parseInt($(window).height()) - 200;
          // Función para agregar los valores de los filtros a ajaxParams
          const addFiltersToAjaxParams = () => {
            const filterValues = getFilterValues();

            const ajaxParams = {
              page: pageNumber,
              results: vResults ? vResults : Math.round(listHeight / 5),
              q: query,
              q2: query2,
              estado_en_proceso: true,
              ...filterValues // Agregar los valores de los filtros
            };

            return ajaxParams;
          }

          // Ejemplo de uso
          const ajaxParams = addFiltersToAjaxParams();

          $.ajax({
            url: params.url(),
            type: "GET",
            data: ajaxParams,
            dataType: "json",
            cache: "false",
            beforeSend: function () {
              // Mostrar el spinner
              document.querySelector('.spinner-container').style.display = 'block';
              // viewport
              //   .find(
              //     "table.results" +
              //     (typeof params.container != "undefined"
              //       ? "." + params.container
              //       : "")
              //   )
              //   .hide();
              // var div = $(
              //   `
              //   <div class="unique-overlay">
              //       <div class="unique-loading-container">
              //           <div class="unique-spinner"></div>
              //           <div class="unique-loading-text">Cargando</div>
              //       </div>
              //   </div>
              //   `
              // );
              // viewport.prepend(div);
              // $("p.not_found_msg").hide();
            },
            complete: function () {
              // Ocultar el spinner
              document.querySelector('.spinner-container').style.display = 'none';
              // viewport.find("div.unique-overlay").remove();
              // viewport
              //   .find(
              //     "table.results" +
              //     (typeof params.container != "undefined"
              //       ? "." + params.container
              //       : "")
              //   )
              //   .show();
              // var selectedItemsTemp = selectedItems;
              // while (selectedItems.length > 0) {
              //   var item = selectedItems.pop();
              //   var id_item = item.data("id");
              //   if (
              //     $('[name="selected_one"]')
              //       .closest("tbody")
              //       .find('tr[data-id="' + id_item + '"]').length != 0
              //   ) {
              //     $('[name="selected_one"]')
              //       .closest("tbody")
              //       .find('tr[data-id="' + id_item + '"]')
              //       .remove();
              //   }
              //   $('[name="selected_one"]')
              //     .closest("tbody")
              //     .prepend(item);
              // }
              // selectedItems = selectedItemsTemp;

              // // agregado el 20-10-16 - gin
              // if (cantRegistrosEncontrados == 0 && selectedItemsLength == 0) {
              //   viewport.find("table.results").hide();
              // }
            }
          }).done(function (data) {

            // var module = $('html > body > aside > div > div > ul > li[class="active"]').data(
            //   "name"
            // );
            // cantRegistrosEncontrados = data.records.total + selectedItemsLength;

            // if (data.records.total > 0 || selectedItemsLength > 0) {
            //   viewport.find("div.no-results").remove();
            //   // viewport.find('table' + ).show();
            //   viewport
            //     .find(
            //       "table.results" +
            //       (typeof params.container != "undefined"
            //         ? "." + params.container
            //         : "")
            //     )
            //     .show();
            //   // viewport.find('table.results').show();
            //   $("label.date").css("border", "0");
            // } else {
            //   // viewport.find('table').hide();
            //   viewport
            //     .find(
            //       "table.results" +
            //       (typeof params.container != "undefined"
            //         ? "." + params.container
            //         : "")
            //     )
            //     .hide();
            //   viewport.find("div.no-results").remove();

            //   var div =
            //     '<div style="margin: auto; font-size:14px; margin-top: 3em; text-align: center; font-weight: bold; text-transform: uppercase; padding-top: 10px;" class="no-results"><p class="not_found_msg" style="margin: 140px 5px 100px 5px; color: #00a972"></p></div>';

            //   let today = new Date().toLocaleDateString().replace(/\//g, "-");
            //   let todayDate = parseInt(today.slice(0, 2));
            //   let divIndex = div.indexOf("</p>");
            //   if (
            //     todayDate < 5 &&
            //     $('input[name="fecha_asignacion"]').val() != ""
            //   ) {
            //     let msg =
            //       "NO SE ENCONTRÓ NINGÚN RESULTADO. <br> ES POSIBLE QUE LA INFORMACIÓN QUE ESTÁS BUSCANDO CORRESPONDA A UNA FECHA ANTERIOR.";
            //     div = div.slice(0, divIndex) + msg + div.slice(divIndex);
            //     $("label.date").css("border", "4px solid #00a972");
            //   } else {
            //     let msg =
            //       "NO SE ENCONTRÓ NINGÚN RESULTADO. VERIFIQUE LOS FILTROS.";
            //     div = div.slice(0, divIndex) + msg + div.slice(divIndex);
            //   }

            //   viewport.prepend(div);
            // }

            // //params.totales(data);

            // if (unaBase.toolbox.search.lastSearchNotify)
            //   unaBase.toolbox.search.lastSearchNotify.remove();

            // // unaBase.toolbox.search.lastSearchNotify = toastr.info( ((data.records.total > 0)? 'Se encontró un total de ' + data.records.total  + ((data.records.total > 1)? ' ' + params.inflection.plural : ' ' + params.inflection.singular) : 'No se encontró ' + params.inflection.none + ' ' + params.inflection.singular ) + ((unaBase.toolbox.search.q)? ' conteniendo el término \"' + unaBase.toolbox.search.q + '\"' : '') + '.' , 'Resultados de búsqueda');
            // if (unaBase.toolbox.search.newSearch)
            //   unaBase.toolbox.search.lastSearchNotify = toastr.info(
            //     (data.records.total > 0
            //       ? "Se encontró un total de " +
            //       data.records.total +
            //       (data.records.total > 1
            //         ? " " + "resultados"
            //         : " " + "resultado")
            //       : "No se encontró ningún resultado") +
            //     (unaBase.toolbox.search.q
            //       ? ' conteniendo el término "' +
            //       unaBase.toolbox.search.q +
            //       '"'
            //       : "") +
            //     ".",
            //     "Resultados de búsqueda"
            //   );
            // unaBase.toolbox.search.newSearch = false;

            //if(data.to != -1) {
            if (data.records.to != -1) {
              params.renderTableItems(data.rows)
              if (data.totales) {
                params.metrics(data.totales)
              }
              if (data.rows.length == 0) {
                // Si hay registros en memoria, ponerlos en la lista
                // var selectedItemsTemp = selectedItems;
                // while (selectedItems.length > 0) {
                //   var item = selectedItems.pop();
                //   var id_item = item.data("id");
                //   if (
                //     $("table.results")
                //       .find("tbody")
                //       .find('tr[data-id="' + id_item + '"]').length != 0
                //   ) {
                //     $("table.results")
                //       .find("tbody")
                //       .find('tr[data-id="' + id_item + '"]')
                //       .remove();
                //   }
                //   $("table.results")
                //     .find("tbody")
                //     .prepend(item);
                // }
                // selectedItems = selectedItemsTemp;

              }

              // viewport.find('table > tbody > tr').unbind('click').bind('click', function(event) {



              // viewport
              //   .find(
              //     "table.results" +
              //     (typeof params.container != "undefined"
              //       ? "." + params.container
              //       : "") +
              //     " > tbody > tr"
              //   )
              //   .unbind("click")
              //   .bind("click", function (event) {
              //     //if (event.srcElement.localName != 'input' && event.srcElement.className != 'picture' && event.srcElement.localName != 'div') {
              //     if ($(this).data("locked-by") === undefined) {
              //       if (
              //         typeof $(event.target).data("disabled") == "undefined" &&
              //         event.target.localName != "input" &&
              //         event.target.className != "ui-button-text" &&
              //         typeof params.detail != "undefined"
              //       ) {
              //         if (
              //           params.detail.url($(this).data("id")).search(":") == -1
              //         ) {
              //           if (typeof params.detail.iframe != "undefined") {
              //             if (params.detail.iframe)
              //               unaBase.loadInto.iframe(
              //                 params.detail.url($(this).data("id"))
              //               );
              //             else {
              //               if (params.detail.dialog)
              //                 unaBase.loadInto.dialog(
              //                   params.detail.url($(this).data("id")),
              //                   undefined,
              //                   params.detail.size
              //                 );
              //               else
              //                 unaBase.loadInto.viewport(
              //                   params.detail.url(
              //                     $(this).data("id"),
              //                     $(this).data("doc")
              //                   )
              //                 );
              //             }
              //           } else {
              //             if (params.detail.external)
              //               window.open(params.detail.url($(this).data("id")));
              //             else
              //               unaBase.loadInto.viewport(
              //                 params.detail.url($(this).data("id"))
              //               );
              //           }
              //         } else {
              //           var href = params.detail
              //             .url($(this).data("id"))
              //             .split(":");
              //           switch (href[0]) {
              //             case "blank":
              //               window.open(href[1]);
              //               break;
              //             case "iframe":
              //               unaBase.loadInto.iframe(href[1]);
              //               break;
              //             case "viewport":
              //               var standalone = href[2] == "standalone";
              //               unaBase.loadInto.viewport(
              //                 href[1],
              //                 null,
              //                 standalone
              //               );
              //               break;
              //             case "dialog":
              //               unaBase.loadInto.dialog(href[1], null, href[2]);
              //               break;
              //           }
              //         }
              //       }
              //     } else
              //       alert(
              //         "Este documento está siendo modificado por " +
              //         $(this)
              //           .data("locked-by")
              //           .capitalizeAllWords() +
              //         "\n\n\n\n" +
              //         "Para trabajar en él, debes solicitar a la persona que salga del mismo."
              //       );
              //   });

              // var registros = viewport.find('table > tbody').find('tr').length;
              // var registros = viewport
              //   .find(
              //     "table.results" +
              //     (typeof params.container != "undefined"
              //       ? "." + params.container
              //       : "") +
              //     " > tbody"
              //   )
              //   .find("tr").length;

              if (data.records.to == data.records.total - 1) {
                // //viewport.find('table > thead').show();
                // var colspan = 0;
                // // viewport.find('table > thead > tr > *').each(function() {
                // viewport
                //   .find(
                //     "table.results" +
                //     (typeof params.container != "undefined"
                //       ? "." + params.container
                //       : "") +
                //     " > thead > tr > *"
                //   )
                //   .each(function () {
                //     colspan += $(this).prop("colspan");
                //   });
                // colspan--;
                // // viewport.find('table > tfoot').html(
                // // 	'<tr><th colspan="' + colspan + '">Registros encontrados</th><td class="number">' + data.records.total + '</td></tr>'
                // // );
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

              //formatCurrency();
            }

            if (typeof params.callback != "undefined") params.callback(data);

            // viewport
            //   .find("th[data-sort-by]")
            //   .unbind("click")
            //   .bind("click", function (event) {
            //     var current = $(event.target);
            //     var that = this;
            //     $(this)
            //       .closest("tr")
            //       .find("th[data-sort-by]")
            //       .not(current)
            //       .removeData("sort-order");
            //     $(that)
            //       .closest("tr")
            //       .find("th[data-sort-by]")
            //       .not(current)
            //       .removeClass("sort-order-asc")
            //       .removeClass("sort-order-desc");
            //     if (
            //       typeof current.data("sort-order") == "undefined" &&
            //       typeof current.data("sort-default") != "undefined"
            //     ) {
            //       switch (current.data("sort-default")) {
            //         case "asc":
            //           current.data("sort-order", "desc");
            //           break;
            //         case "desc":
            //           current.data("sort-order", "asc");
            //           break;
            //       }
            //     }
            //     if (typeof current.data("sort-order") == "undefined") {
            //       current.data("sort-order", "desc");
            //       current
            //         .removeClass("sort-order-asc")
            //         .addClass("sort-order-desc");
            //     } else {
            //       if (current.data("sort-order") == "asc") {
            //         current.data("sort-order", "desc");
            //         current
            //           .removeClass("sort-order-asc")
            //           .addClass("sort-order-desc");
            //       } else {
            //         current.data("sort-order", "asc");
            //         current
            //           .removeClass("sort-order-desc")
            //           .addClass("sort-order-asc");
            //       }
            //     }

            //     updateSearchFilter(event);
            //   });

            // //console.log("Finaliza búsqueda");

            // // alert("final");
            // $("#search")
            //   .find("*")
            //   .prop("disabled", false);
            $("body > aside")
              .find("*")
              .prop("disabled", false)
              .css("cursor", "auto")
              .css("pointer-events", "auto");
            unaBase.ui.unblock();
          });
          // }
          unaBase.ui.unblock();
        };

        const loadResults = () => {

          // Guardado de ítems de búsqueda con checkboxes
          // console.log(
          //   "Antes de ejecutar búsqueda, se guardan ítems con checkboxes."
          // );

          // if (!disable_selected) {
          //   $("table.results")
          //     .find("tbody")
          //     .find("tr")
          //     .each(function (key, item) {
          //       if (
          //         $(item)
          //           .find('[name="selected_one"]')
          //           .is(":checked")
          //       ) {
          //         selectedItems.push($(item).clone(true, true));
          //       }
          //     });
          // }

          // selectedItemsLength = selectedItems.length;

          // //viewport.find('table:not(.items)' + ((typeof params.container != 'undefined')? '.' + params.container : '') + ' > tbody').find('tr').remove();
          // viewport
          //   .find(
          //     "table.results" +
          //     (typeof params.container != "undefined"
          //       ? "." + params.container
          //       : "") +
          //     " > tbody"
          //   )
          //   .find("tr")
          //   .remove();
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
          // unaBase.toolbox.search.pageScroll = i;
          // unaBase.ui.unblock();
        };

        const advancedSearch = () => {


          executeSearch = () => {

            unaBase.ui.block();

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

            // Si no tiene definido un row, no listar resultados

            if (typeof params.row != "undefined") {
              loadResults();
              // Al presionar el boton volver y no hay nada en la pila
              unaBase.toolbox.search.backResult = false
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
              unaBase.ui.unblock();
            }, 1000);
          };



          if (!stopAutoSearch || !firstSearch) {
            executeSearch();
          }
        };
        params.init(advancedSearch)
        params.setApplyFiltersCallback(advancedSearch);


        //unaBase.toolbox.search._advancedSearch = advancedSearch

        if (typeof params.row != "undefined") {
          loadResults();
          // Al presionar el boton volver y no hay nada en la pila
          unaBase.toolbox.search.backResult = false
        };

        // var searchHandler = function (event) {
        //   var manual = $('#search [name="q"]').data("manual");

        //   var prevQuery = unaBase.toolbox.search.q;
        //   var prevQuery2 = unaBase.toolbox.search.q2;
        //   unaBase.toolbox.search.q = search
        //     .find('> label:first-of-type > input[type="search"]')
        //     .val()
        //     .replace(/^\s+/g, "")
        //     .trim();
        //   if (params.doubleSearch) {
        //     unaBase.toolbox.search.q2 = search
        //       .find('> label:nth-of-type(2) > input[type="search"]')
        //       .val()
        //       .replace(/^\s+/g, "")
        //       .trim();
        //   }
        //   if (
        //     prevQuery != unaBase.toolbox.search.q ||
        //     prevQuery2 != unaBase.toolbox.search.q2 ||
        //     manual == true
        //   ) {

        //     unaBase.toolbox.search.newSearch = true;
        //     // Si no tiene definido un row, no listar resultados

        //     if (typeof params.row != "undefined") {
        //       if (!stopAutoSearch) {
        //         loadResults();
        //       }
        //     } else {

        //       //params.callback(unaBase.toolbox.search.advancedFilter);
        //     }
        //   }

        //   $('#search [name="q"]').removeData("manual");
        //   $('#search [name="q2"]').removeData("manual");
        // };

        // if (!search.hasClass("bound")) {
        //   search
        //     .bindWithDelay("keydown", searchHandler, 500)
        //     .bind("search", searchHandler)
        //     .addClass("bound");
        // }


        // //TESTTTT
        // if (unaBase.toolbox.search.backResult) {
        //   advancedSearch();
        // }



        // if (!unaBase.toolbox.search._disabled) {
        //   advancedSearch();
        // }



        // // Mover checkboxes al final del contenedor de búsqueda
        // var checkboxes = search.find("div.checkboxes");
        // var clonedCheckboxes = checkboxes.clone(true, true);
        // checkboxes.remove();
        // $("<br>").appendTo(search);
        // clonedCheckboxes.appendTo(search);
        // // addSearchByBtn()
        // $('#search [name="q"]').on("keydown", function (event) {
        //   if (event.keyCode === 13) {
        //     setTimeout(() => {
        //       executeSearch();

        //     }, 500);
        //   }
        // });

        // if (params.searchOff) {
        //   // let searchQ = document.querySelector('input[name="q"]');
        //   let searchCheckbox = document.querySelector(
        //     'input[name="searchCheckbox"]'
        //   );
        //   // if(searchCheckbox === null){
        //   // searchQ.insertAdjacentHTML('beforebegin', `<input type="checkbox" name="searchCheckbox">`);
        //   // }
        //   stopAutoSearch = vSearchOff;
        //   if (vSearchOff) {
        //     searchCheckbox.style.display = "";
        //   }
        //   setTimeout(() => {
        //     searchCheckbox.checked = vSearchOff;
        //     if (!vSearchOff) {
        //       document.querySelector(
        //         'li[data-name="searchOff"]'
        //       ).style.display = "none";
        //     }

        //     searchCheckbox.addEventListener("click", function () {
        //       let isChecked = this.checked;
        //       stopAutoSearch = isChecked;
        //       // if (isChecked){
        //       document.querySelector(
        //         'li[data-name="searchOff"]'
        //       ).style.display = isChecked ? "inline-block" : "none";
        //       // }
        //     });


        //   }, 200);
        // } else {
        //   stopAutoSearch = false;
        //   let searchCheckbox = document.querySelector(
        //     'input[name="searchCheckbox"]'
        //   );
        //   searchCheckbox.style.display = "none";
        // }
      },
      // unaBase.toolbox.search.save
      save: function () {

        unaBase.toolbox.search._disabled = true;
        console.debug("set search disabled to true");

        unaBase.toolbox.search.savedSearch = $("#search").serializeAnything();
        $("#search")
          .find(".ui-autocomplete-input")
          .each(function () {
            if ($(this).data("value") != null)
              unaBase.toolbox.search.savedSearch +=
                "&" +
                encodeURIComponent($(this).attr("name") + "-data-value") +
                "=" +
                encodeURIComponent($(this).data("value"));
          });
      },
      // unaBase.toolbox.search.saveDialog
      saveDialog: function () {
        unaBase.toolbox.search.savedDialogSearch = $(
          "#dialog-search"
        ).serializeAnything();
        $("#dialog-search")
          .find(".ui-autocomplete-input")
          .each(function () {
            if ($(this).data("value") != null)
              unaBase.toolbox.search.savedDialogSearch +=
                "&" +
                encodeURIComponent($(this).attr("name") + "-data-value") +
                "=" +
                encodeURIComponent($(this).data("value"));
          });
      },
      // unaBase.toolbox.search.restore
      restore: function () {
        var viewport = unaBase.toolbox.dialog
          ? $("#dialog-viewport")
          : $("#viewport");
        var searchData = [];
        if (unaBase.toolbox.search.savedSearch) {
          $.each(unaBase.toolbox.search.savedSearch.split("&"), function () {
            var parts = this.split("=");
            searchData[parts[0]] = parts[1];
          });
        }
        unaBase.toolbox.search.savedSearch = null;

        var searchBox = $("#search");

        searchBox.find("input").each(function () {
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
        setTimeout(function () {
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
      restoreDialog: function () {
        var viewport = $("#dialog-viewport");
        var searchData = [];
        $.each(unaBase.toolbox.search.savedDialogSearch.split("&"), function () {
          var parts = this.split("=");
          searchData[parts[0]] = parts[1];
        });

        unaBase.toolbox.search.savedDialogSearch = null;

        var searchBox = $("#dialog-search");

        searchBox.find("input").each(function () {
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
        setTimeout(function () {
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
      destroy: function () {
        var search = unaBase.toolbox.dialog
          ? $("#dialog-search")
          : $("#search");
        if (!unaBase.loadInto._dialog) {

          unaBase.toolbox.search.initialized = undefined;
          unaBase.toolbox.search.q = "";
          unaBase.toolbox.search.pageScroll = null;
          unaBase.toolbox.search.newSearch = false;
          //unaBase.toolbox.search.advancedFilter = undefined;

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
        selector.click(function () {

          console.log(this);
        });
      },
      // unaBase.toolbox.menu.checkExit       check back if the document is not saved
      checkExit: function (event, callback) {
        if (typeof event.isTrigger == "undefined") {

          if (unaBase.changeControl.query() && $("#search").is(":hidden")) {
            // confirm(MSG.get("CONFIRM_EXIT_UNSAVED")).done(callback);
            confirm("Salir sin guardar?")
              .done(function (data) {

                callback(data)
              });
            // if (unaBase.back.callback) {
            //   unaBase.back.callback();
            // }
          }
          else callback(true);
        } else callback(true);
      },
      destroy: function () {
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
      buttons: function (list) {
        var menu = unaBase.toolbox.dialog ? $("#dialog-menu") : $("#menu");

        menu.find("[data-name]").hide();
        $.each(list, function (key, item) {
          menu.find('[data-name="' + item + '"]').show();
        });
      }
    },
    // unaBase.toolbox.form
    // TODO: cambir a unabase.widget o similar, migrando también los archivos que hacen referencia a éste
    form: {

      autocomplete: function (params) {

        if ($('input[name="' + params.fields[0].local + '"]').length > 0)
          $('input[name="' + params.fields[0].local + '"]')
            .autocomplete({
              source: function (request, response) {
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
                  success: function (data) {

                    response(
                      $.map(data.rows, function (item) {
                        return item;
                      })
                    );
                  }
                });
              },
              delay: 0,
              minLength: 1,
              autoFocus: params.restrict,
              open: function () {
                $(this)
                  .removeClass("ui-corner-all")
                  .addClass("ui-corner-top");
              },
              close: function (event, ui) {
                $(this)
                  .removeClass("ui-corner-top")
                  .addClass("ui-corner-all");
              },
              focus: function (event, ui) {

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
      validate: function (rut) {
        var rut = rut.toUpperCase();
        var rutx = rut.replace(/\./g, "");

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
      format: function (rut) {
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
    async simpleNotify({ from, to, subject, html }) {
      try {
        const res = await axios.post(nodeUrl + '/email/simple', {
          from,
          to,
          subject,
          html,
          hostname: window.location.origin
        });

        if (res.data.success) {
          console.log('Correo enviado correctamente');
        } else {
          console.error('Fallo al enviar el correo:', res.data.message);
        }
      } catch (err) {
        console.error('Error enviando correo:', err.response?.data?.message || err.message);
      }
    },

    notify: async function (
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
      id_usuario_notificacion) {
      // const email = await import("./unabase/email.js?1");
      const email = import("./unabase/email.js?" + String(Math.random + 1234));
      email.then(functions => {


        functions.notify(to,
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
      });

    },
    data: () => {
      return JSON.parse(localStorage.getItem("emailData"));
    }
  },
  // unaBase.inbox
  inbox: {
    // unaBase.inbox.send
    send: function (params, callback) {
      if (typeof params.notifyId !== "undefined") {

        $.ajax({
          url: "/4DACTION/_V3_getUsuarioNotifyBySubject",
          async: false,
          data: {
            subject: params.subject,
            notifyId: params.notifyId
          },
          dataType: "json",
          success: function (data) {
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
          error: function (data) {
            console.log(data);
          }
        });
      } else {
        var data = {};
        data.to = params.to;
        data.text = params.text;
        data.subject = params.subject;
        data.tag = params.tag;

        switch (params.into) {
          case "viewport":
            data.action = params.into + ":" + params.href + ":" + (typeof params.standalone != undefined ? params.standalone ? "standalone" : "" : "");
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
          async: false,
          dataType: "json",
          success: function (data) {
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
                  async: false,
                  module: params.href.split("/")[3]
                    ? params.href.split("/")[3]
                    : "ot",
                  id: id
                },
                dataType: "json",
                success: function (data) {
                  if (params.current_username != undefined) {
                    var current_username = params.current_username;
                  } else {
                    if ($("body > aside > div > div > h1").data("username") == undefined) {
                      var current_username = v3_data_username ? v3_data_username : v3_data_username
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

                  var forma_pago = $('input[name="forma_pago[descripcion]"]')
                    .length
                    ? $('input[name="forma_pago[descripcion]"]').val()
                    : "";

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
                        id,
                        params.attach,
                        current_username,
                        current_username,
                        data.rows[i].email,
                        undefined,
                        params.msgBody,
                        undefined,
                        params.href.split("/")[3],
                        data.rows[i].subscription_id
                      );
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
                error: function (data) {
                  console.log(data);
                }
              });
            }
          },
          error: function (data) {
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
    save: function (url, type, skip_history) {
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

    // Pruebas con el nuevo
    back: function (cb) {
      // Mover el último registro de 'back' a 'forward'
      if (unaBase.history._stack.back.length > 0) {
        unaBase.history._stack.forward.push(unaBase.history._stack.back.pop());
      }

      let record = {};

      // Determinar el registro actual a cargar
      if (unaBase.history._stack.back.length > 0) {
        record = unaBase.history._stack.back[unaBase.history._stack.back.length - 1];
      } else {

        let forward = unaBase.history._stack.forward[0];
        const reemplazarURL = (url) => {
          const mapeoReemplazos = {
            compras: "list_compras.shtml",
            negocios: "list.shtml",
            dtc: "list.shtml",
            dtv: "list.shtml",
            cotizaciones: "list.shtml",
            cobros: "list.shtml",
            pagos: "list.shtml",
            comprobantes: "index.shtml",
            presupuestos: "list.shtml",
            contactos: "index.shtml",
            catalogo: "index.shtml",
            usuarios: "listado.shtml",
            reportes: "index.shtml",
            logs: "index.shtml",
            ajustes: "index.shtml",
            configuracion: "index.shtml"
          };

          const regex = /\/v3\/views\/([^\/]+)\/([^?]+)/;
          let match = url.match(regex);

          if (match) {
            const palabra = match[1];
            const reemplazo = mapeoReemplazos[palabra];

            if (reemplazo) {
              return url.replace(match[2], reemplazo);
            }
          }

          return url;
        }

        // Redirigir a 'list.shtml' si no hay registros en 'back'
        record.url = reemplazarURL(forward.url)
        record.standalone = false;
        unaBase.toolbox.search.backResult = true
        unaBase.loadInto.viewport(record.url, '', record.standalone);
        return;
      }

      unaBase.history._last = record;

      // Cargar la vista con el registro actual
      unaBase.loadInto.viewport(record.url, '', record.standalone, true);

      // Ejecutar el callback si existe
      if (typeof cb === "function") {
        cb();
      }
    },


    // Antiguo back
    // back: function (cb) {

    //   let record ={}
    //   unaBase.history._stack.forward.push(unaBase.history._stack.back.pop());

    //   if( unaBase.history._stack.back.length>0)
    //      record = unaBase.history._stack.back[unaBase.history._stack.back.length - 1];
    //   else{
    //     record =  unaBase.history._stack.forward[0]
    //   }

    //   unaBase.history._last = record;
    //   //unaBase.loadInto.viewport(record.url, undefined, record.standalone);
    //   unaBase.loadInto.viewport(record.url, '', record.standalone, true);
    //   if (typeof cb !== "undefined") {
    //     cb();
    //   }
    // },






    forward: function () {
      var record = unaBase.history._stack.forward.pop();
      unaBase.history._stack.back.push(record);
      unaBase.history._last = record;
      unaBase.loadInto.viewport(record.url, undefined, record.standalone, true);
    },
    current: function () {
      //return unaBase.history._stack.back[unaBase.history._stack.back.length - 1];
      return unaBase.history._last;
    }
  },
  files: {
    // unaBase.files.upload
    upload: function (params) { }
  },
  contacto: {
    // unaBase.contacto.getById
    getById: function (id) {
      var datos = {};
      $.ajax({
        url: "/4DACTION/_V3_getContactoById",
        data: {
          id: id
        },
        dataType: "json",
        async: false,
        success: function (data) {
          datos = data;
        },
        error: function (data) {
          toastr.error(NOTIFY.get("ERROR_INTERNAL", "Error"));
        }
      });
      return datos;
    },
    set: function (contacto) {
      $.ajax({
        url: "/4DACTION/_V3_setContacto",
        dataType: "json",
        type: "POST",
        data: contacto,
        async: false
      }).done(function (data) {
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
  },
  begin: {
    getTipoDocumentoByNv: async (id) => {
      let config = {

        method: 'get',
        url: `https://${window.location.host}/4DACTION/_V3_getTipoDocumento?sid=${unaBase.sid.encoded()}&q=&id_nv=${id}&valido=false`,

      };

      try {
        let res = await axios(config);
        unaBase.tipoDocumentos = res.data.rows
        return res;
      } catch (err) {
        throw err;
      }



    },
    setUtilities: () => {

      let getInfo = async () => {

        let config = {

          method: 'get',
          url: `https://${window.location.host}/4DACTION/_light_get_server_info?sid=${unaBase.sid.encoded()}`,

        };

        try {

          let res = await axios(config);
          unaBase.accounting_mode = res.data.accounting_mode
          unaBase.vista_proyectos = res.data.vista_proyectos
          unaBase.sepDecimal = res.data.sepDecimal;
          unaBase.reaperMode = res.data.reaper_mode;
          unaBase.separate_sc = res.data.separate_sc;
          unaBase.print_dtvs = res.data.print_dtvs;
          unaBase.print_compras = res.data.print_compras;
          unaBase.defaulCurrencyCode = res.data.default_currency_code;
          unaBase.no_cant_subcosto_manual = res.data.no_cant_subcosto_manual
          unaBase.items_venta_nulo = res.data.items_venta_nulo
          unaBase.new_currency_mode = res.data.new_currency_mode
          unaBase.serverInfo = res.data
          return res;
        } catch (err) {
          throw err;
        }

      }

      const getMoney = async () => {
        try {
          const url = `https://${window.location.host}/4DACTION/_force_getMoney`;
          const res = await axios.get(url);
          let money = res.data.row.sort((a, b) => b.default - a.default);
          unaBase.money = money;
          unaBase.moneyDefault = money.find(v => v.default)
          localStorage.setItem('defaultMoney', JSON.stringify(unaBase.moneyDefault))
        } catch (err) {
          throw err;
        }
      };

      const getCatalogo = async () => {
        try {
          const url = `https://${window.location.host}/4DACTION/_light_getProducto?all_records=true`;
          const res = await axios.get(url);
          unaBase.catalogo = res.data.rows;
        } catch (err) {
          throw err;
        }
      };

      const getParametros = async () => {
        try {
          const url = `https://${window.location.host}/4DACTION/_light_getParameters`;
          const res = await axios.get(url);
          unaBase.parametros = res.data;
          localStorage.setItem('parametros', JSON.stringify(res.data))
        } catch (err) {
          throw err;
        }
      };

      getInfo();
      getMoney();
      //getCatalogo();
      getParametros();

      //Para impuestos multiples dtc
      unaBase.impuestos_dtc = []

    }
  },
  utilities: {
    getFilter: (selector, hasData) => {
      let toReturn = [];
      let container = document.querySelector(selector);
      if (!container) return "";

      let customSelects = container.querySelectorAll('.custom-select-new');


      customSelects.forEach(select => {
        let name = select.dataset.name;
        let value = select.dataset.value;
        if (name) {
          toReturn.push(encodeURIComponent(name) + "=" + encodeURIComponent(value));
        }
      });

      return toReturn.join("&");
    },
    toUrl: (path) => {
      let baseUrl = window.location.origin + window.location.pathname;
      window.open(baseUrl + path);
    },
    limpiarUrl: () => {
      function limpiarURL(url) {
        const urlObj = new URL(url);
        return `${urlObj.origin}${urlObj.pathname}`;
      }

      // Obtener la URL actual
      const urlActual = window.location.href;
      // Limpiar la URL actual
      const urlLimpia = limpiarURL(urlActual);
      // Cambiar la URL en la barra de direcciones sin recargar la página
      history.pushState({}, '', urlLimpia);
    },
    transformNumber: (n, mode, end = false, defecto = false) => {
      let resp;
      let sepDec;
      if (!defecto)
        sepDec = ",";
      else
        sepDec = unaBase.sepDecimal;


      if (n == "") {
        resp = "0"
      } else {
        if (mode == "int") {
          //Dato tipo number a string formateado
          n = parseFloat(n)
          if (sepDec == ",")
            resp = String(new Intl.NumberFormat("de-DE", {
              maximumFractionDigits: 4,
            }).format(n))
          else
            resp = String(new Intl.NumberFormat().format(n))


        } else if (mode == "view") {
          //Dato tipo string a string formateado

          if (sepDec == ",") {
            if (n.slice(-1) != "," || end || n.includes(",") == false) {
              // if (n.includes(sepDec) == false || end) {
              if (n.slice(-1) != "0" || end || n.includes(",") == false) {

                n = n.replaceAll(".", "");
                n = n.replaceAll(",", ".");
                resp = String(new Intl.NumberFormat('de-DE', {
                  maximumFractionDigits: 4,
                }).format(n))
              } else
                resp = n

            } else
              resp = n

          } else {
            if (n.slice(-1) != "." || end) {
              n = n.replaceAll(",", "");
              n = n.replaceAll(".", ",");
              resp = String(new Intl.NumberFormat('de-DE', {
                maximumFractionDigits: 4,
              }).format(n))
            } else
              resp = n
          }




          if (resp == "NaN")
            resp = "0"

        } else if (mode == "format-all") {
          resp = unaBase.utilities.transformNumber(n.replace(/[^0-9,]/g, '').replace(/,/g, '.'), 'view')
        } else if (mode == "format-end") {
          //CULAQUIER TIPO A STRING
          //PARA MANDAR 4D
          n = String(n).replaceAll(".", "");
          resp = n
        } else {
          //Dato tipo string a number para calculo
          if (typeof n === 'string') {
            if (sepDec == ",") {

              n = n.replaceAll(".", "");
              n = n.replaceAll(",", ".");
              resp = parseFloat(n)
            } else {

              n = n.replaceAll(",", "");
              n = n.replaceAll(".", ",");
              resp = parseFloat(n)
            }
          } else {
            resp = n;
          }


        }
      }

      return resp;

    },
    handleMontoInput(e) {
      const input = e.target;
      const val = input.value;

      // Caso especial: escribir solo coma o punto
      if (val === "," || val === ".") {
        input.dataset.raw = val;
        return;
      }

      // Guardar valor "raw" (sin formatear)
      input.dataset.raw = val;

      // Formatear usando tu función
      input.value = unaBase.utilities.transformNumber(val, "view");
    },
    getUserByPermiso: async (id_permiso) => {
      const url = `https://${window.location.host}/4DACTION/_force_getUsuarioByPermiso?id=${id_permiso}`;
      const res = await axios.get(url);
      return res
    },
    getItemByNv: async () => {
      const url = `${location.origin}/4DACTION/_V3_getItemByCotizacion?${$('section.sheet').data('id')}`
      const res = await axios.get(url);
      nv.items = res.data.rows
    },
    formatNumber: (nStr) => {
      nStr += "";
      const x = nStr.split(".");
      let x1 = x[0];
      const x2 = x.length > 1 ? "." + x[1] : "";
      const rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1)) {
        x1 = x1.replace(rgx, "$1" + "." + "$2");
      }
      return x1 + x2;
    },
    general: {
      formater: (a) => {
        a.value = unaBase.utilities.transformNumber(a.value, 'view')

      },
      format: {
        set: (b) => {
          b.addEventListener('keyup', unaBase.utilities.general.format.continuousFormater)
          b.addEventListener('change', unaBase.utilities.general.format.continuousFormater)
        },
        continuousFormater: (e) => {
          e.currentTarget.value = unaBase.utilities.transformNumber(e.currentTarget.value, 'view', e.type != 'keyup' ? true : false)
        },
        formatAntiSII: (n) => n - Math.trunc(n) > 0 ? n + 1 : n

      },
      focusNumber: (n) => {

        n.currentTarget.focus();
        n.currentTarget.select();
        n.preventDefault()
      },
      fileActions: {
        viewAttachment: (type) => {
          const url = "/4DACTION/_V3_getUpload?index=Pago|" + payment.id;
          unaBase.loadInto.dialog(url, 'Archivo adjunto', 'large', true);
        },
        triggerFileUpload: (type) => {
          if (type === 'payment') {
            document.querySelector('input[name="resumen[pago][attachment]"]').click();
          }
        },
        handleFileChange: (selector, fileType, indexPrefix) => {

          const input = selector[0]
          input.addEventListener('change', function () {

            unaBase.ui.block();
            const file = input.files[0];
            if (file.type !== fileType) {
              const nameFile = file.name;
              const data = new FormData();
              data.append('file', file);
              data.append('filename', nameFile);
              data.append('index', indexPrefix);

              $.ajax({
                url: '/4DACTION/_V3_setUpload',
                type: 'POST',
                contentType: false,
                data: data,
                dataType: 'json',
                processData: false,
                cache: false,
                success: function (data) {
                  toastr.success('Archivo cargado con éxito!');
                  payment.attached_file = nameFile;
                  document.querySelector('.file-upload-container .file-text').textContent = nameFile
                  unaBase.ui.unblock();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                  console.error('Error al cargar el archivo:', errorThrown);
                  toastr.error('Hubo un error al cargar el archivo.');
                  unaBase.ui.unblock();
                }
              });
            } else {
              toastr.warning('Formato de archivo no permitido');
              unaBase.ui.unblock();
            }
          });
        }
      }

    },
    reduceImage: (ev) => {

      const MAX_WIDTH = 2048;
      const MAX_HEIGHT = 2048;
      const MIME_TYPE = "image/jpeg";
      const QUALITY = 0.7;

      return new Promise((resolve, reject) => {
        const file = ev.files[0]; // get the file
        const blobURL = URL.createObjectURL(file);
        const img = new Image();
        img.src = blobURL;
        img.onerror = function () {
          URL.revokeObjectURL(this.src);
          // Handle the failure properly
          console.log("Cannot load image");
        };
        img.onload = function () {
          URL.revokeObjectURL(this.src);
          const [newWidth, newHeight] = calculateSize(img, MAX_WIDTH, MAX_HEIGHT);
          const canvas = document.createElement("canvas");
          canvas.width = newWidth;
          canvas.height = newHeight;
          // const ctx = canvas.getContext("2d");
          // ctx.drawImage(img, 0, 0, newWidth, newHeight);
          let imgTo = {}
          canvas.toBlob(
            (blob) => {


              blob.name = file.name
              resolve(blob);
            },
            MIME_TYPE,
            QUALITY
          );

        };
      });


      function calculateSize(img, maxWidth, maxHeight) {
        let width = img.width;
        let height = img.height;

        // calculate the width and height, constraining the proportions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        return [width, height];
      }

      // Utility functions for demo purpose

      function displayInfo(label, file) {
        const p = document.createElement('p');
        p.innerText = `${label} - ${readableBytes(file.size)}`;
        document.getElementById('root').append(p);
      }

      function readableBytes(bytes) {
        const i = Math.floor(Math.log(bytes) / Math.log(1024)),
          sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
      }
    },
    sendNotificacion: async (type) => {
      try {
        axios.post(`${nodeUrl}/cambios-negocio`, {
          hostname: window.location.hostname,
          Current_username: current_username,
          docId: unaBase.doc.id
        })
          .then(function (response) {
            console.log('Respuesta recibida:', response.data);

            if (response.success) {
              console.log("Notificación enviada exitosamente");
            } else {
              console.error("Error al enviar notificación:", response.error);
            }
          })
      } catch (error) {
        console.error("Error al enviar notificación:", error);
      }
    },

    saveDataMongo: (type, payload = null) => {
      let dataToSend = {
        hostname: window.location.hostname,
        data: null
      };
      //url roma = https://roma.unabase.cc/app/
      // test local = http://localhost:3000/app/
      let url = ' ';
      if (type === 'dtv') {
        dataToSend.data = dtv.data;
        url = "/send-dtv-server-info"
      }
      if (type === 'nv') {
        dataToSend.data = params.data();
        url = "/send-negocio-server-info"
      }
      if (type === 'nv-items') {
        dataToSend.data = items;
        dataToSend.fk = params.data().id;
        url = "/send-negocio-items"
      }

      if (type === 'Cotizacion') {
        dataToSend.data = payload;
        url = "/incomes/create"
      }
      
      axios.post(nodeUrl + url, dataToSend)
        .then(function (response) {
          console.log('Respuesta recibida:', response.data);
        })
        .catch(function (error) {
          console.error('Error en la solicitud:', error);
        });
    },

    saveDataSap: async (type) => {
      let dataCopy = {
        type: type,
        hostname: location.hostname,
        sid: unaBase.sid.encoded()
      };

      let url = `https://devbase.unabase.com/node/upload-sap`;

      // Cargar datos según el tipo
      switch (type) {
        case 'dtc':
          const items = dtc.items.get(dtc.id);
          dtc.items.load(items);
          Object.assign(dataCopy, dtc.data, { items: items.rows });
          break;
        case 'dtv':
          Object.assign(dataCopy, dtv.data);
          break;
        case 'compras':
          Object.assign(dataCopy, compras.data);
          break;
        case 'pagos':
          payment.doc = 'FXR';
          Object.assign(dataCopy, payment.data);
          break;
        case 'cobro':
          Object.assign(dataCopy, cobro);
          break;
        case 'nv':
          Object.assign(dataCopy, unaBase.doc);
          dataCopy.type = "nv";
          break;
        default:
          console.warn('Tipo no soportado:', type);
          return;
      }

      // Validar las condiciones para cambiar la URL, utilizando encadenamiento opcional para evitar errores
      ;
      const isFXR = dataCopy?.doc === 'FXR' || dataCopy?.from === 'FXR' || dataCopy?.origen_modulo === 'FXR' || dataCopy?.from === 'rendiciones';

      toastr.success('Estamos enviando tus datos a SAP. Por favor, espera un momento.');

      setTimeout(async function () {
        // Cambiar la URL si se cumple alguna condición
        if (isFXR) {
          url = `https://devbase.unabase.com/node/upload-sap-fxr`;
        }

        // Validar casos donde no se debe enviar datos
        // if (dataCopy?.from === 'OC') {
        //   return;
        // }

        try {
          console.log('Enviando a SAP:', dataCopy);

          // Realizar la solicitud POST
          const response = await axios.post(url, { data: dataCopy });

          // Validar la respuesta
          if (!response.data.success) {
            toastr.warning(response.data.message);
            return;
          }

          // Actualizar el ID de SAP según el tipo
          if (response.data.resultado && response.data.resultado.DocEntry) {
            switch (type) {
              case 'dtc':
                dtc.data.id_sap = response.data.resultado.DocEntry;
                break;
              case 'compras':
                compras.data.id_sap = response.data.resultado.DocEntry;
                break;
              case 'nv':
                unaBase.doc.id_sap = response.data.resultado.DocEntry;
                break;
              default:
                break;
            }
          }

          toastr.success('Documento guardado en SAP');
          console.log('Respuesta recibida:', response);
        } catch (error) {
          console.error('Error en la solicitud:', error);
          toastr.error('Error al guardar el documento en SAP. Por favor, inténtelo nuevamente.');
        }

        // Continuar con el resto del código que dependa de la URL
      }, 2000); // Espera de 2 segundos
    }
    ,
    updateIncomeVx: async (type) => {
      const baseUrl = unaBase.links('rome_local')
      let dataCopy = { type };
      let url = `${baseUrl}/incomes/updateFromV3`;

      switch (type) {
        case 'OC':
        case 'Compras':
          dataCopy = { ...dataCopy, id: compras.id, hostname: location.origin };
          dataCopy.type = "OC";
          break;
        case 'FXR':
          dataCopy = { ...dataCopy, id: compras.id, hostname: location.origin };
          break;
        case 'dtc':
          dataCopy = { ...dataCopy, id: dtc.id, hostname: location.origin };
          break;
        case 'pagos':
          dataCopy = { ...dataCopy, id: payment.id, hostname: location.origin };
          break;
        default:
          url = ''; // Asegúrate de manejar el caso default si es necesario
          break;
      }

      if (url) {
        const dataToSend = { data: { ...dataCopy, sid: unaBase.sid.encoded() } };

        try {
          await axios.post(url, dataToSend);
        } catch (error) {
          console.error('Error en la solicitud:', error);
        }
      } else {
        console.log('Tipo no válido para actualizar ingresos:', type);
      }
    },
  },
  links: (_l) => {
    switch (_l) {
      case 'task':
        return 'https://tasks.unabase.com/taskBay'
        break;
      case 'rome':
        return 'https://roma.unabase.cc/v1'
        break;
      case 'rome_local':
        return 'http://localhost:5000/v1'
        break;
      case 'vx':
        return 'https://app.unabase.cc';
        break;
      default:
        break;
    }

  }
};



//REAPER


//-----------------------   Variables   --------------------------
//----------------------------------------------------------------
unaBase.sepDecimal = "";





(async () => {
  const log = await import("./unabase/log.js");
  Object.assign(unaBase, log);

  //REAPER
  unaBase.begin.setUtilities();
})();
