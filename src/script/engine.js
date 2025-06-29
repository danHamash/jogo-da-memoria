const allEmojes = [
  "src/image/bulba-2.png",
  "src/image/char.png",
  "src/image/squirtle.png",
  "src/image/pika.png",
  "src/image/dratini.png",
  "src/image/jiggly.png",
  "src/image/chansey.png",
  "src/image/ditto.png",
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/54.png",
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/32.png",
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/44.png",
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/139.png",
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/199.png",
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/201.png",
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/204.png",
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/207.png",
];

let openCard = [];
let backgroundAudio = null;
let selectedEmojes = [];
let currentDifficulty = null;

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

function startGame(difficulty) {
  currentDifficulty = difficulty;

  document.getElementById("difficulty-screen").style.display = "none";
  document.querySelector(".game-container").style.display = "flex";
  document.getElementById("toggle-scores").style.display = "none";
  document.getElementById("record-list-container").style.display = "none";

  const gameBoard = document.querySelector(".game");
  gameBoard.className = `game ${difficulty}`;
  gameBoard.innerHTML = "";

  let pairs;
  switch (difficulty) {
    case "easy":
      dificuldadeTraduzida = "Fácil";
      pairs = 8;
      break;
    case "medium":
      dificuldadeTraduzida = "Média";
      pairs = 12;
      break;
    case "hard":
      dificuldadeTraduzida = "Difícil";
      pairs = allEmojes.length;
      break;
    default:
      dificuldadeTraduzida = difficulty;
  }

  selectedEmojes = allEmojes.slice(0, pairs);
  let emojes = [...selectedEmojes, ...selectedEmojes];
  let shuffleEmojes = emojes.sort(() => Math.random() - 0.5);

  shuffleEmojes.forEach((src) => {
    let box = document.createElement("div");
    box.className = "item";

    let img = document.createElement("img");
    img.src = src;
    img.alt = "emoji";
    img.style.width = "100%";

    box.appendChild(img);
    box.onclick = handClick;

    gameBoard.appendChild(box);
  });

  playsound("page");
  state.values.currentTimer = 60;
  state.values.currentScore = 0;
  state.view.timeLeft.textContent = 60;
  state.view.playerScore.textContent = 0;
  state.actions.countDownTimerId = setInterval(countDown, 1000);
}

function playsound(audioName) {
  backgroundAudio = new Audio(`./src/audio/${audioName}.m4a`);
  backgroundAudio.volume = 0.0;
  backgroundAudio.loop = true;

  backgroundAudio
    .play()
    .then(() => {
      setTimeout(() => {
        backgroundAudio.volume = 0.2;
      }, 500);
    })
    .catch(() => {
      console.warn("Autoplay bloqueado.");
    });
}

function stopSound() {
  if (backgroundAudio) {
    backgroundAudio.pause();
    backgroundAudio.currentTime = 0;
  }
}

function countDown() {
  state.values.currentTimer--;
  state.view.timeLeft.textContent = state.values.currentTimer;

  if (state.values.currentTimer <= 0) {
    clearInterval(state.actions.countDownTimerId);
    stopSound();
    document.getElementById("losse").classList.add("show");
    document.getElementById("losse").textContent = "Você Perdeu!";
  }
}

function handClick() {
  if (openCard.length < 2) {
    this.classList.add("boxOpen");
    openCard.push(this);
  }

  if (openCard.length === 2) {
    setTimeout(checkMatch, 500);
  }
}

function playerScoreCount(isMatch) {
  if (isMatch) {
    state.values.currentScore += 5;
  } else {
    state.values.currentScore = Math.max(0, state.values.currentScore - 1);
  }

  state.view.playerScore.textContent = state.values.currentScore;
}

function checkMatch() {
  const isMatch = openCard[0].innerHTML === openCard[1].innerHTML;

  if (isMatch) {
    openCard[0].classList.add("boxMatch");
    openCard[1].classList.add("boxMatch");
  } else {
    openCard[0].classList.remove("boxOpen");
    openCard[1].classList.remove("boxOpen");
  }

  playerScoreCount(isMatch);
  openCard = [];

  if (document.querySelectorAll(".boxMatch").length === selectedEmojes.length * 2) {
    clearInterval(state.actions.countDownTimerId);
    stopSound();
    document.getElementById("winner").classList.add("show");
    document.getElementById("winner").textContent = "Você Ganhou!";

    salvarPontuacoes(state.values.currentScore, dificuldadeTraduzida);
  }
}

function salvarPontuacoes(score, difficulty) {
  let history = JSON.parse(localStorage.getItem("scoreHistory")) || [];
  history.push({ score, difficulty });
  history = history.sort((a, b) => b.score - a.score).slice(0, 10);
  localStorage.setItem("scoreHistory", JSON.stringify(history));
  mostrarListaDePontuacoes();
}

function mostrarListaDePontuacoes() {
  const listaContainer = document.getElementById("record-list");
  listaContainer.innerHTML = "";

  const history = JSON.parse(localStorage.getItem("scoreHistory")) || [];
  const ordenado = history.sort((a, b) => b.score - a.score);

  if (ordenado.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Nenhuma pontuação registrada ainda.";
    listaContainer.appendChild(li);
    return;
  }

  ordenado.forEach(({ score, difficulty }, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}º lugar - ${score} pontos (${difficulty})`;
    listaContainer.appendChild(li);
  });
}

function carregarPontuacoes() {
  mostrarListaDePontuacoes();
}

document.getElementById("toggle-scores").addEventListener("click", () => {
  const container = document.getElementById("record-list-container");
  const isHidden = container.style.display === "none";
  container.style.display = isHidden ? "block" : "none";
  if (isHidden) mostrarListaDePontuacoes();
});

document.getElementById("clear-scores").addEventListener("click", () => {
  localStorage.removeItem("scoreHistory");
  mostrarListaDePontuacoes();
});

window.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", () => {
    if (backgroundAudio && backgroundAudio.paused) {
      backgroundAudio.play();
    }
  }, { once: true });

  carregarPontuacoes();
  document.getElementById("toggle-scores").style.display = "inline-block";
});
