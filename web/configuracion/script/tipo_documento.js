const miMarco = document.getElementById('mi-marco');
const loaderDiv = document.querySelector('.loader');

const getCookieValue = (cookieName) => {
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');
  const cookieValue = cookieArray.find(cookie => cookie.includes(cookieName));
  return cookieValue ? cookieValue.substring(cookieValue.indexOf(cookieName)) : '';
}

const toTypeDocRedirect = () => {
  const frame = document.getElementById("mi-marco");
  const url = window.origin;
  const newUrl = url.substring(8, url.length);
  const sidValue = getCookieValue('UNABASE');
  const redirectUrl = `https://dev-panel.herokuapp.com/type-document?from=v3&user=soporte&hostname=${newUrl}&sid=${sidValue}`;
  
  frame.src = redirectUrl;
  frame.style.height = window.innerHeight + "px";
  
  frame.addEventListener('load', () => {
    loaderDiv.style.display = 'none';
    frame.style.display = 'block';
  });
}

window.addEventListener('DOMContentLoaded', () => {
  toTypeDocRedirect();
});