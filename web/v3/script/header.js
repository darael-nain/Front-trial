const header = document.querySelector(".headerUnabase");
const button = document.querySelector(".headerUnabase__settings");
const modal = document.querySelector(".headerUnabase__modal");
const iconDown = document.getElementById("icon-down");
let extend = false
let isHovering = false;

const showModal = () => {
    isHovering = true;
    modal.classList.add('visible');
    iconDown.style.transform = 'rotate(180deg)';
    button.style.color = 'var(--bg-primary)';
};

const hideModal = () => {
    isHovering = false;
    setTimeout(() => {
        if (!isHovering) {
            modal.classList.remove('visible');
            iconDown.style.transform = 'rotate(0)';
            button.style.color = 'var(--black)';
        }
    }, 300);
};

const maxHeader = () => {
    extend = !extend
    if(extend) {
        header.style.padding = "0px 20px 0px 100px";
        header.style.transition = "0.5s";
    } else {
        header.style.padding = "0px 20px 0px 220px";
        header.style.transition = "0.3s";
    }
  };

button.addEventListener('mouseenter', showModal);
modal.addEventListener('mouseenter', showModal);

button.addEventListener('mouseleave', hideModal);
modal.addEventListener('mouseleave', hideModal);

button.addEventListener('click', showModal);

const toggle = document.getElementById("header-toggle")
toggle.addEventListener('click', maxHeader)