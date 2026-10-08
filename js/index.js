// ----- SÉLECTEURS -----
const scoreDisplay = document.querySelector(".game__counter");
const countDown = document.querySelector(".game__countdown");
const countDownDisplay = document.querySelector(".game__time");
const containerBubbles = document.querySelector(".game__bubbles");
const scoreEndDisplay = document.querySelector(".game-over");
const counterEnd = document.querySelector(".game-over__counter");
const cursor = document.querySelector(".cursor");
const header = document.querySelector(".game__header");
const restart = document.querySelector(".game-over__restart");

// ----- VARIABLES DE JEU -----
let isSoundPlayed = false;
let currentScore = 0;
let bubbleCreationInterval = 1500;
let gameDuration = 60000;
let gameIsOver = false;

// ----- FONCTIONS UTILITAIRES -----

// Générer un nombre aléatoire entier entre min et max (pour la taille et la couleur des bulles)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Jouer le petit son quand on clique sur une bulle
const bubbleSound = () => {
  const audio = new Audio();
  audio.src = "./assets/bubble-sound.mp3";
  audio.play();
};

// Jouer le son d’alerte quand il reste peu de temps
const ringSound = () => {
  const audio = new Audio();
  audio.src = "./assets/ring-sound.mp3";
  audio.play();
};

// ----- GESTION DU CURSEUR PERSONNALISÉ -----

// Masquer le curseur personnalisé quand on passe sur le header (pour utiliser le curseur normal)
header.addEventListener("mouseenter", () => {
  cursor.style.display = "none";
  document.body.style.cursor = "default";
});

// Réafficher le curseur personnalisé quand on quitte le header
header.addEventListener("mouseleave", () => {
  cursor.style.display = "block";
  cursor.style.left = "-100px";
  cursor.style.top = "-100px";
});

// Masquer le curseur personnalisé quand on passe sur l’écran de fin
scoreEndDisplay.addEventListener("mouseenter", () => {
  cursor.style.display = "none";
  document.body.style.cursor = "default";
});

// Réafficher le curseur personnalisé quand on quitte l’écran de fin
scoreEndDisplay.addEventListener("mouseleave", () => {
  cursor.style.display = "block";
  cursor.style.left = "-100px";
  cursor.style.top = "-100px";
});

// Faire suivre le curseur personnalisé avec le mouvement de la souris
window.addEventListener("pointermove", (e) => {
  cursor.style.left = e.pageX + "px";
  cursor.style.top = e.pageY + "px";
});

// ----- LOGIQUE DU JEU -----

// Incrémenter le score de 1 et mettre à jour l’affichage
const incrementScore = () => {
  scoreDisplay.innerText = ++currentScore;
};

// Gérer quand on clique sur une bulle : score + son + suppression de la bulle
const bubbleClick = (event) => {
  if (!gameIsOver) {
    const clickedBubble = event.target;
    incrementScore();
    bubbleSound();
    clickedBubble.remove();
  }
};

// Créer une nouvelle bulle avec taille, couleur et position aléatoires, et la faire monter
const createBubble = () => {
  if (gameIsOver) return;

  const screenWidth = window.innerWidth;
  const randomBubbleSize = getRandomInt(10, 20);
  const bubbleColor = getRandomInt(0, 255);

  const bubbleElement = document.createElement("div");
  bubbleElement.classList = "bubble";
  bubbleElement.style.setProperty("--bubbleColorRed", bubbleColor);
  bubbleElement.style.setProperty("--bubbleSize", randomBubbleSize + "vw");
  bubbleElement.style.left =
    Math.floor(Math.random() * (screenWidth - randomBubbleSize ** 2)) + "px";
  bubbleElement.style.animation = "bubbleMove 15s ease-out";

  containerBubbles.appendChild(bubbleElement);
  bubbleElement.addEventListener("pointerdown", bubbleClick);

  // Enlever la bulle quand son animation est finie
  bubbleElement.addEventListener("animationend", () => {
    bubbleElement.remove();
  });

  // Rendre le jeu plus difficile en faisant apparaître les bulles plus vite selon le score du joueur
  if (currentScore > 5 && currentScore <= 10) {
    bubbleCreationInterval -= 100;
  } else if (currentScore > 10 && currentScore < 15) {
    bubbleCreationInterval -= 100;
  } else if (currentScore >= 15) {
    bubbleCreationInterval = 500;
  }

  // Plannifier la création de la prochaine bulle
  setTimeout(createBubble, bubbleCreationInterval);
};

// Lancer la première bulle après un petit délai
setTimeout(createBubble, bubbleCreationInterval);

// ----- COMPTE À REBOURS ET FIN DE PARTIE -----

// Mettre à jour l’affichage du temps restant et déclenche le son d’alerte à 10 secondes de la fin
const updateCountdown = (remainingTime) => {
  const seconds = Math.ceil(remainingTime / 1000);
  countDown.innerText = seconds + "s";

  if (seconds <= 10 && !isSoundPlayed) {
    countDownDisplay.style.color = "red";
    ringSound();
    isSoundPlayed = true;
  }
};

// Indiquer la partie comme comme terminée (plus de bulles, fin de la boucle)
const stopGame = () => {
  gameIsOver = true;
};

// Sauvegarder l'instant T où le jeu a commencé (pour calculer le temps écoulé)
const gameStartTime = Date.now();

// Mettre à jour le temps et afficher l’écran de fin quand la partie est terminée
const gameLoop = () => {
  if (!gameIsOver) {
    const elapsedTime = Date.now() - gameStartTime;
    const remainingTime = gameDuration - elapsedTime;

    updateCountdown(remainingTime);

    if (remainingTime <= 0) {
      stopGame();
      scoreEndDisplay.style.display = "flex";
      counterEnd.innerText = currentScore + " points";
    }
  }

  requestAnimationFrame(gameLoop);
};

// ----- DÉMARRAGE -----
gameLoop();

// ----- REDÉMARRAGE DE LA PARTIE -----
// Redémarrer la partie quand on clique sur "RECOMMENCE"
restart.addEventListener("click", () => {
  location.reload();
});
