const spinnerContainer = document.querySelector('.spinner-container');

const spinners = [
  '<span class="loaderCustom"></span>',
];

function getRandomSpinner() {
  const randomIndex = Math.floor(Math.random() * spinners.length);
  return spinners[randomIndex];
}

function showRandomSpinner() {
  const spinnerHTML = getRandomSpinner();
  spinnerContainer.innerHTML = spinnerHTML;
}


showRandomSpinner();
