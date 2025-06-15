const emojes = [
  "src/image/ditto.png", "src/image/ditto.png",
  "src/image/bulba-2.png", "src/image/bulba-2.png",
  "src/image/char.png", "src/image/char.png",
  "src/image/squirtle.png", "src/image/squirtle.png",
  "src/image/pika.png", "src/image/pika.png",
  "src/image/dratini.png", "src/image/dratini.png",
  "src/image/jiggly.png", "src/image/jiggly.png",
  "src/image/chansey.png", "src/image/chansey.png",
];

let openCard = [];
let backgroundAudio = null; // Agora será usada corretamente

const state = {
  view: {
    timeLeft: document.querySelector("#time-left"),
  },
  values: {
    currentTimer: 60,
  },
  actions: {
    countDownTimerId: null,
  },
};

// Embaralhar
let shuffleEmojes = emojes.sort(() => (Math.random() > 0.5 ? 2 : -1));

// Criar cartas
for (let i = 0; i < shuffleEmojes.length; i++) {
  let box = document.createElement("div");
  box.className = "item";

  let img = document.createElement("img");
  img.src = shuffleEmojes[i];
  img.alt = "emoji image";
  img.style.width = "100%";

  box.appendChild(img);
  box.onclick = handClick;

  document.querySelector(".game").appendChild(box);
}

// Tocar áudio ao iniciar
function playsound(audioName) {
  backgroundAudio = new Audio(`./src/audio/${audioName}.m4a`); // <- agora está certo
  backgroundAudio.volume = 0.0;
  backgroundAudio.loop = true;

  backgroundAudio.play().then(() => {
    setTimeout(() => {
      backgroundAudio.volume = 0.1;
    }, 500);
  }).catch((err) => {
    console.warn("Autoplay bloqueado. Som será ativado ao clicar.");
  });
}

// Parar áudio
function stopSound() {
  if (backgroundAudio) {
    backgroundAudio.pause();
    backgroundAudio.currentTime = 0;
  }
}

// Timer regressivo
function countDown() {
  state.values.currentTimer--;
  state.view.timeLeft.textContent = state.values.currentTimer;

  if (state.values.currentTimer <= 0) {
    clearInterval(state.actions.countDownTimerId);
    stopSound();

    const losse = document.getElementById("losse");
    losse.classList.add("show");
    losse.textContent = "Você Perdeu!";
  }
}

// Clique nas cartas
function handClick() {
  if (openCard.length < 2) {
    this.classList.add("boxOpen");
    openCard.push(this);
  }

  if (openCard.length === 2) {
    setTimeout(checkMatch, 500);
  }
}

// Verifica se há combinação
function checkMatch() {
  if (openCard[0].innerHTML === openCard[1].innerHTML) {
    openCard[0].classList.add("boxMatch");
    openCard[1].classList.add("boxMatch");
  } else {
    openCard[0].classList.remove("boxOpen");
    openCard[1].classList.remove("boxOpen");
  }

  openCard = [];

  if (document.querySelectorAll(".boxMatch").length === emojes.length) {
    const winner = document.getElementById("winner");
    winner.classList.add("show");
    winner.textContent = "Você Ganhou!";
    clearInterval(state.actions.countDownTimerId);
    stopSound(); // Para o som ao vencer
  }
}

// Início do jogo
window.addEventListener("DOMContentLoaded", () => {
  playsound("page"); // Inicia som de fundo
  state.actions.countDownTimerId = setInterval(countDown, 1000);
});
