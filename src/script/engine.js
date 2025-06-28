const emojes = [
  "src/image/bulba-2.png", "src/image/bulba-2.png",
  "src/image/char.png", "src/image/char.png",
  "src/image/squirtle.png", "src/image/squirtle.png",
  "src/image/pika.png", "src/image/pika.png",
  "src/image/dratini.png", "src/image/dratini.png",
  "src/image/jiggly.png", "src/image/jiggly.png",
  "src/image/chansey.png", "src/image/chansey.png",
  "src/image/ditto.png", "src/image/ditto.png"
];

let openCard = [];
let backgroundAudio = null;

const state = {
  view: {
    timeLeft: document.querySelector("#time-left"),
    playerScore: document.querySelector("#player-score"),
  },
  values: {
    currentTimer: 60,
    currentScore: 0,
  },
  actions: {
    countDownTimerId: null,
  },
};

// Embaralhar emojis
let shuffleEmojes = emojes.sort(() => (Math.random() > 0.5 ? 2 : -1));

// Criar as cartas
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

// Tocar o áudio de fundo
function playsound(audioName) {
  backgroundAudio = new Audio(`./src/audio/${audioName}.m4a`);
  backgroundAudio.volume = 0.0;
  backgroundAudio.loop = true;

  backgroundAudio.play().then(() => {
    setTimeout(() => {
      backgroundAudio.volume = 0.2;
    }, 500);
  }).catch(() => {
    console.warn("Autoplay bloqueado. Som será ativado ao clicar.");
  });
}

// Parar som
function stopSound() {
  if (backgroundAudio) {
    backgroundAudio.pause();
    backgroundAudio.currentTime = 0;
  }
}

// Contador regressivo
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

// pontuação
function playerScoreCount(isMatch) {
  if (isMatch) {
    state.values.currentScore +=5;
  } else {
    state.values.currentScore = Math.max(0, state.values.currentScore - 1); // Impede score negativo
  }

  state.view.playerScore.textContent = state.values.currentScore;
}

// Verificar se as cartas combinam
function checkMatch() {
  const isMatch = openCard[0].innerHTML === openCard[1].innerHTML;

  if (isMatch) {
    openCard[0].classList.add("boxMatch");
    openCard[1].classList.add("boxMatch");
  } else {
    openCard[0].classList.remove("boxOpen");
    openCard[1].classList.remove("boxOpen");
  }

  playerScoreCount(isMatch); // Atualiza score com base no resultado

  openCard = [];

  if (document.querySelectorAll(".boxMatch").length === emojes.length) {
    const winner = document.getElementById("winner");
    winner.classList.add("show");
    winner.textContent = "Você Ganhou!";
    clearInterval(state.actions.countDownTimerId);
    stopSound();
  }
}

// Início
window.addEventListener("DOMContentLoaded", () => {
  playsound("page");

  // Se autoplay falhar, ativa ao primeiro clique do usuário
  document.body.addEventListener("click", () => {
    if (backgroundAudio && backgroundAudio.paused) {
      backgroundAudio.play();
    }
  }, { once: true });

  // Iniciar o timer
  state.actions.countDownTimerId = setInterval(countDown, 1000);
});
