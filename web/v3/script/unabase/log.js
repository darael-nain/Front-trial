export const log = {
    // unaBase.log.save
    save: function(text, modulo, index, id, descripcion_larga) {
      $.ajax({
        url: "/4DACTION/_V3_setLogsFromWeb",
        type: "POST",
        dataType: "json",
        data: {
          id: id !== undefined ? id : 0,
          folio: index,
          descripcion: text,
          modulo: modulo,
          descripcion_larga: descripcion_larga !== undefined ? descripcion_larga : ""
        },
        async: false
      }).done(function(data) {
        if (!data.success) {
          toastr.error(NOTIFY.get("ERROR_RECORD_READONLY"));
        }
      });
    }
  }

  // export const save = function(text, modulo, index, id, descripcion_larga) {
  //     $.ajax({
  //       url: "/4DACTION/_V3_setLogsFromWeb",
  //       type: "POST",
  //       dataType: "json",
  //       data: {
  //         id: id !== undefined ? id : 0,
  //         folio: index,
  //         descripcion: text,
  //         modulo: modulo,
  //         descripcion_larga: descripcion_larga !== undefined ? descripcion_larga : ""
  //       },
  //       async: false
  //     }).done(function(data) {
  //       if (!data.success) {
  //         toastr.error(NOTIFY.get("ERROR_RECORD_READONLY"));
  //       }
  //     });
  //   }
  // 