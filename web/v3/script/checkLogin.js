
checkLogin.func = () => {
  return fetch("/node/users/isAuth", {
    credentials: "include",
    cache: "no-store"
  }).then(async r => {
    if (!r.ok) return { success: false };
    return r.json();
  });
};


checkLogin.set = (func, time, alert) => {
	uvar.checkLogin.interval = setInterval(() => {
		func().then(data => {
			if (!data.success) {
				unaBase.ui.block();
				if (alert) {
					alert("Tu sesion ha caducado");
				}
				window.location.href = "/login/login.shtml";
			}
		}).catch(err => {
			console.warn(err);
		});
	}, time);
}

checkLogin.clearInterval = () => {
	clearInterval(uvar.checkLogin.interval);
}