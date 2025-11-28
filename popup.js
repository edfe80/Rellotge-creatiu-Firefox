// popup.js

// Obtenir referències del DOM
const botoColor = document.getElementById('colorBtn');
const botoFons  = document.getElementById('fonsBtn');
const botoHora  = document.getElementById('horaBtn');
const marcRellotge = document.getElementById('rellotgeFrame');

// Eniva missatges a l'iframe del rellotge
function enviarMissatge(accio, dades = {}) {
  marcRellotge.contentWindow.postMessage({ action: accio, data: dades }, "*");
}

// Canvi de paleta de colors dels anells
botoColor.addEventListener('click', () => {
  enviarMissatge('toggleColor');

  // Indicació visual temporal
  botoColor.classList.add('active-temporary');
  setTimeout(() => botoColor.classList.remove('active-temporary'), 220);
});

// Canvi de fons
botoFons.addEventListener('click', () => {
  enviarMissatge('toggleBackground');
});

// Mostrar o amagar l’hora digital
botoHora.addEventListener('click', () => {
  const actiu = botoHora.getAttribute('data-active') === 'true';
  botoHora.setAttribute('data-active', !actiu);

  botoHora.textContent = !actiu
    ? 'Amaga hora digital'
    : 'Mostra hora digital';

  enviarMissatge('toggleHora');
});

// Rebre estat actual del rellotge
window.addEventListener('message', (ev) => {
  const missatge = ev.data;
  if (!missatge || missatge.type !== 'state') return;

});
