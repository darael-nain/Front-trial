// <div class="modal" tabindex="-1" role="dialog">
//   <div class="modal-dialog" role="document">
//     <div class="modal-content">
//       <div class="modal-header">
//         <h5 class="modal-title">Modal title</h5>
//         <button type="button" class="close" data-dismiss="modal" aria-label="Close">
//           <span aria-hidden="true">&times;</span>
//         </button>
//       </div>
//       <div class="modal-body">
//         <p>Modal body text goes here.</p>
//       </div>
//       <div class="modal-footer">
//         <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
//         <button type="button" class="btn btn-primary">Save changes</button>
//       </div>
//     </div>
//   </div>
// </div>

var modal = {
  init: () => {
    let modal = document.createElement("div");
    modal.classList.add("modal");
    modal.tabindex = "-1";
    modal.role = "dialog";
    modal.innerHTML = `
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"></h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Cerrar">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
          </div>
          <div class="modal-footer">
          
          </div>
        </div>
      </div>`;
      document.querySelector("body").appendChild(modal);
  },
  create: id => {
    let modal = document.createElement("div");
    modal.classList.add("modal");
    modal.tabindex = "-1";
    modal.role = "dialog";
    modal.id = id;
    modal.innerHTML = `
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"></h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Cerrar">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
          </div>
          <div class="modal-footer">
          
          </div>
        </div>
      </div>`;
      document.querySelector("body").appendChild(modal);
  },
  set: data => {
    let modal = document.querySelector(`div.modal#${data.id}`);
    let title = modal.querySelector(".modal-title");
    let header = modal.querySelector(".modal-header");
    let body = modal.querySelector(".modal-body");
    let footer= modal.querySelector(".modal-footer");

    title.innerHTML = data.title;
    body.innerHTML = data.body;
    footer.innerHTML = data.footer;
    modal.id = data.id;
    body.hidden = data.body === ""
    if(data.body === ""){
      header.style.border = 0;
      footer.style.border = 0;

    }
    data.script(modal);

  }
}


// $(document).ready(function(){
//   modal.init();
// });

