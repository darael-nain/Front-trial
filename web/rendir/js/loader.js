
let loading = {
		start: () => {
			let container = document.querySelector("div.container");
			container.style.display = "none";
			let loader = document.querySelector(".loader");
			loader.style.display = "";
			loader.classList.add("d-flex");

		},
		init: () => {	
			let container = document.querySelector("div.container");
			if(!document.querySelector(".loader")){
				console.log(" ----- init loader  ---");
				// document.querySelector("body").style.cursor = "wait";
				let loader = document.createElement("div");
				loader.classList.add("spinner-grow","text-success");
				loader.role = "status";
				loader.style.width = "10rem";
				loader.style.height = "10rem";
				loader.innerHTML = `<span class="sr-only">Cargando...</span>`;
				let loaderContainer = document.createElement("div");
				loaderContainer.classList.add("loader", "justify-content-center", "align-items-center");
				loaderContainer.style["text-align"] = "center";
				loaderContainer.style["z-index"] = 9999999;
				loaderContainer.style["font-size"] = "10rem";
				loaderContainer.style["height"] = "-webkit-fill-available";
				// loaderContainer.style["position"] = "absolute";
				// loaderContainer.style["top"] = "50%";

				loaderContainer.appendChild(loader);

				container.parentNode.appendChild(loaderContainer);
				loaderContainer.style.display = "none";

			}
		},
		stop: (timer=500) => {
			setTimeout(() => {
				let container = document.querySelector("div.container");
				container.style.display = "";
				let loader = document.querySelector(".loader");
				loader.style.display = "none";
				loader.classList.remove("d-flex");

			}, timer);
		}
	}

$(document).ready(function(){
	loading.init();
});