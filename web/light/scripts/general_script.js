let general = {
  params: {
    nodeUrl: localStorage.getItem("nodeUrl"),
    currentdate: localStorage.getItem("currentdate"),
    hostnameUrl: window.location.origin
  },
  other: {

    addZero: (i) => {
      if (i < 10) {
        i = '0' + i;
      }
      return i;
    },


  }
}



let getInfo = async () => {
  let config = {

    method: 'get',
    url: `https://${window.location.host}/4DACTION/_light_get_server_info?sid=${sid()}`,

  };
  try {
    let res = await axios(config);
    general.params.info = res
    return res;
  } catch (err) {
    throw err;
  }

}


function sid() {

  // var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    // if (c.indexOf(name) == 0) {
    if (c.match(/UNABASE/g)) {
      return c.substring(c.indexOf("UNABASE"));
    }
  }
  return "";
}

const isConnected = (ref) => {
  getInfo()
    .then(res => {

      if (!res.data.logged_in) {
        location.href = `${window.location.origin}`;
      }



    });

}

