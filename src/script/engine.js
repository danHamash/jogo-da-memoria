const emojes = [
    "🤢",
    "🤢",
    "🤞",
    "🤞",
    "👽",
    "👽",
    "🤑",
    "🤑",
    "🤩",
    "🤩",
    "😎",
    "😎",
    "😮",
    "😮",
    "🤯",
    "🤯",
];
let openCard = [];


let shuffleEmojes = emojes.sort(() => (Math.random() > 0.5) ? 2 : -1);

for (let i = 0; i < emojes.length; i++) {
    let box = document.createElement("div");
    box.className = "item";
    box.innerHTML = shuffleEmojes[i];
    box.onclick = handClick;
    document.querySelector(".game").appendChild(box);
}

function handClick() {
    if (openCard.length < 2) {
        this.classList.add("boxOpen");
        openCard.push(this);
    }

    if (openCard.length == 2) {
        setTimeout(checkMatch, 500);
    }
}

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
    }
}

