  let general = {
    params:{

      nodeUrl:     localStorage.getItem("nodeUrl" ),
      currentdate: localStorage.getItem("currentdate" ),
      hostnameUrl: window.location.origin,
      sepDecimal : localStorage.getItem("sepDecimal"),
      formatCurrencyCode: localStorage.getItem("formatCurrencyCode"),

    },
    other:{

      addZero:(i)=> {
        if (i < 10) {
            i = '0' + i;
        }
        return i;
      },

     
    },
  }