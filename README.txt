# Rellotge Creatiu – Extensió per a Firefox 

**Rellotge Creatiu** desenvolupat amb [p5.js](https://p5js.org/). Està pensada per funcionar com a finestra emergent (popup) dins del navegador Firefox.

## Funcionalitats

- Possibilitat d'alternar entre dues paletes de colors.
- Opció per canviar el fons d’estrelles (petites o grans i brillants).
- Activar l'hora digital.
- Interfície construïda amb elements del DOM i estil CSS personalitzat.

## Mida del canvas

- Original: `550×550 px`
- Adaptat: `360×260 px`
- Escalat aplicat: `scale(0.436)`

## Requisits

- Firefox (amb suport per Manifest V3)

## Estructura del projecte

rellotge-extensio/
manifest.json
popup.html
popup.js
popup.css
rellotge/
- sketch.js
- p5.min.js
- PressStart2P-Regular.ttf
icon1.png
icon2.png


## Comunicació

Els botons de la interfície envien missatges a l'iframe mitjançant `postMessage()`, i el rellotge respon amb l'estat actual.

