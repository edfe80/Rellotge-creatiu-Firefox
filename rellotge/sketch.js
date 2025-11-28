// -------------------------------
// Rellotge creatiu

// --- Variables globals ---
let textAutoria = "Rellotge creatiu – Eduard Dausà Ferrer";
let textVisible = "";

// Estrelles per simular l'espai
let estrelles = [];
let numEstrelles = 200;

// Colors dels anells
let colorsAnells = [];
let paletaColors = [];

// Tipografia
let mevaFont;

let velocitatRotacio = 0; 

// Estats persistents per a l’extensió Firefox
let paletaIndex = 0;    // Canviar de paletes
let modeFons = 0;       // Estrelles petites / grans
let mostraHora = false; // Activar hora digital

// --- Configuració ---
async function setup() {

  // Canvas reduït i centrat per al popup de Firefox
  createCanvas(360, 260);

  angleMode(DEGREES);

  // Carregar la font
  try {
    mevaFont = await loadFont("PressStart2P-Regular.ttf");
    textFont(mevaFont);
  } catch(e) {
    // Si no es pot carregar, fem servir monospace
    textFont("monospace");
  }

  // Recuperem estat guardat
  let s;
  s = getItem("paletaIndex"); if (s !== null) paletaIndex = s;
  s = getItem("modeFons"); if (s !== null) modeFons = s;
  s = getItem("mostraHora"); if (s !== null) mostraHora = s;

  // Crear estrelles amb posició i moviment aleatori
  for (let i = 0; i < numEstrelles; i++) {
    estrelles.push({
      x: random(-width / 2, width / 2),
      y: random(-height / 2, height / 2),
      mida: random(1, 3),
      alpha: random(50, 255),
      velocitat: random(0.1, 0.5)
    });
  }

  // Paleta de colors
  paletaColors = [
    color(135, 206, 250, 180), // blau cel
    color(255, 182, 193, 180), // rosa suau
    color(144, 238, 144, 180), // verd clar
    color(221, 160, 221, 180), // lila
    color(255, 255, 153, 180)  // groc pàl·lid
  ];

  // Assigno colors als anells 
  // Només tres anells (hores, minuts, segons)
  colorsAnells = [
    random(paletaColors),
    random(paletaColors),
    random(paletaColors)
  ];

  // Aplicar paleta inicial
  aplicarPaleta();

  // Tornar a generar estrelles mode 1
  generarEstrelles();

  // Rebre missatges del popup
  window.addEventListener("message", (ev) => {
    if (!ev.data) return;
    const msg = ev.data;

    if (msg.action === "toggleColor") toggleColorPalette();
    else if (msg.action === "toggleBackground") toggleBackground();
    else if (msg.action === "toggleHora") toggleHoraDigital();
    else if (msg.action === "requestState") enviarEstatAlPopup();
  });

  // Enviem estat al popup
  enviarEstatAlPopup();
}

function draw() {
  background(0); // Fons negre

  translate(width / 2, height / 2);

  // Escalar proporcionalment al disseny original (550px)
  translate(0, -15);
  scale(0.436);

  // Variables del temps
  let hores = hour() % 12;
  let minuts = minute();
  let segons = second();

  // Dibuixar elements
  dibuixaEstrelles();
  dibuixaAnells();
  dibuixaBoletes(hores, minuts, segons);

  // Hora digital
  resetMatrix();
  if (mostraHora) {
    dibuixaHoraDigital();
  } else {
    dibuixaTextAutoria();
  }

  // Actualitzar cada segon
  if (frameCount % 60 === 0) {
    actualitzaColors();
    actualitzaText();
  }
}

// --- Funcions ---

// Estrelles de fons
function dibuixaEstrelles() {
  noStroke();
  for (let e of estrelles) {
    fill(255, e.alpha);
    ellipse(e.x, e.y, e.mida);
    e.alpha += e.velocitat;
    if (e.alpha > 255 || e.alpha < 50) e.velocitat *= -1;
  }
}

// Anells concèntrics
function dibuixaAnells() {
  strokeWeight(4);
  noFill();

  // NOU-C: 3 anells en lloc de 5
  stroke(colorsAnells[0]);
  ellipse(0, 0, 480, 480);

  stroke(colorsAnells[1]);
  ellipse(0, 0, 385, 385);

  stroke(colorsAnells[2]);
  ellipse(0, 0, 300, 300);
}

// Boletes que representen segons, minuts i hores
function dibuixaBoletes(hores, minuts, segons) {

  // Segons
  let angleSegons = map(segons, 0, 60, 0, 360);
  let xSegons = cos(angleSegons - 90) * 240;
  let ySegons = sin(angleSegons - 90) * 240;
  fill(80, 120, 255);
  noStroke();
  ellipse(xSegons, ySegons, 40);

  // Minuts
  let angleMinuts = map(minuts, 0, 60, 0, 360);

  // Posició anell 
  let xMinuts = cos(angleMinuts - 90) * 187.5;
  let yMinuts = sin(angleMinuts - 90) * 187.5;

  fill(100, 255, 180);
  ellipse(xMinuts, yMinuts, 35);

  // Hores
  let angleHores = map(hores + minuts / 60, 0, 12, 0, 360);

  // Coincidència amb l'anell interior
  let xHores = cos(angleHores - 90) * 150;
  let yHores = sin(angleHores - 90) * 150;

  fill(255, 120, 120);
  ellipse(xHores, yHores, 30);

  // Inicials ED dins de les boletes
  textSize(12);
  textStyle(BOLD);
  fill(255);
  textAlign(CENTER, CENTER);
  text("ED", xSegons, ySegons);
}

// Text d’autoria 
function dibuixaTextAutoria() {
  textSize(14);
  fill(255);
  textAlign(CENTER, CENTER);
  text(textVisible, width / 2, height - 10);
}

// Hora digital
function dibuixaHoraDigital() {
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(18);
  let ara = new Date();
  let h = nf(ara.getHours(), 2);
  let m = nf(ara.getMinutes(), 2);
  let s = nf(ara.getSeconds(), 2);
  text(`${h}:${m}:${s}`, width / 2, height - 10);
}

// Colors canvien cada segon dins de la paleta
function actualitzaColors() {
  for (let i = 0; i < colorsAnells.length; i++) {
    colorsAnells[i] = color(
      red(colorsAnells[i]),
      green(colorsAnells[i]),
      blue(colorsAnells[i]),
      random(150, 255)
    );
  }
}

// Text lletra a lletra
function actualitzaText() {
  if (textVisible.length < textAutoria.length) {
    textVisible += textAutoria[textVisible.length];
  }
}

// FUNCIONS AFEGIDES PER A L’EXTENSIÓ FIREFOX

// Genera estrelles segons mode de fons
function generarEstrelles() {
  estrelles = [];
  let total = modeFons ? numEstrelles * 0.6 : numEstrelles;

  for (let i = 0; i < total; i++) {
    estrelles.push({
      x: random(-width / 2, width / 2),
      y: random(-height / 2, height / 2),
      mida: modeFons ? random(2, 5) : random(1, 3),
      alpha: random(50, 255),
      velocitat: random(0.1, 0.5)
    });
  }
}

// Aplicar paleta alternativa/original
function aplicarPaleta() {
  if (paletaIndex === 0) {
    colorsAnells[0] = paletaColors[0];
    colorsAnells[1] = paletaColors[1];
    colorsAnells[2] = paletaColors[2];
  } else {
    colorsAnells[0] = color(255, 140, 0, 200);
    colorsAnells[1] = color(255, 100, 100, 200);
    colorsAnells[2] = color(255, 220, 120, 200);
  }
}

// Canvia la paleta de colors
function toggleColorPalette() {
  paletaIndex = (paletaIndex + 1) % 2;
  aplicarPaleta();
  storeItem("paletaIndex", paletaIndex);
  enviarEstatAlPopup();
}

// Canvia tipus de fons
function toggleBackground() {
  modeFons = modeFons ? 0 : 1;
  generarEstrelles();
  storeItem("modeFons", modeFons);
  enviarEstatAlPopup();
}

// Ensenya / ocultar hora digital
function toggleHoraDigital() {
  mostraHora = !mostraHora;
  storeItem("mostraHora", mostraHora);
  enviarEstatAlPopup();
}

// Guardar valor
function storeItem(clau, valor) {
  try {
    localStorage.setItem(clau, JSON.stringify(valor));
  } catch(e){}
}

// Carregar valor
function getItem(clau) {
  try {
    let v = localStorage.getItem(clau);
    return v ? JSON.parse(v) : null;
  } catch(e){
    return null;
  }
}

// Enviar estat al popup
function enviarEstatAlPopup() {
  try {
    parent.postMessage({
      type: "state",
      paletaIndex,
      modeFons,
      mostraHora
    }, "*");
  } catch(e){}
}
