// 🎯 Hangman тоглоомын бүрэн ажиллагаатай, оюутны хэв маягтай хувилбар

let correctLetters = [];
let wrongGuesses = 0;
let maxWrong = 6;
let score = 0;
let taahUg = "";
let tsag = null; // Глобал таймер хувьсагч

// 🍪 Cookie хадгалах функцүүд
function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie =
    name + "=" + value + ";expires=" + d.toUTCString() + ";path=/";
}

function getCookie(name) {
  const cname = name + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookies = decodedCookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    let c = cookies[i].trim();
    if (c.indexOf(cname) === 0) return c.substring(cname.length);
  }
  return null;
}

// 🕹️ Тоглоом эхлүүлэх (nicknameFromCookie true бол өмнөх cookie-г ашиглана)
function togloom_ehluuleh(nicknameFromCookie = null) {
  let nickname;
  if (nicknameFromCookie) {
    nickname = nicknameFromCookie;
  } else {
    nickname = document.getElementById("nickname").value.trim();
    if (!nickname) return showAlert("Нэрээ оруулна уу!");
    setCookie("nickname", nickname, 1);
  }

  document.getElementById("Nuur_huudas").style.display = "none";
  document.getElementById("game-over-heseg").style.display = "none";
  document.getElementById("leaderboard-heseg").style.display = "none";
  document.getElementById("togloomiin-undsen-heseg").style.display = "block";

  score = 0;
  document.getElementById("toglogchiin_ner").textContent =
    "Тоглогч: " + nickname;
  document.getElementById("toglogchiin_onoo").textContent = "Оноо: 0";

  if (tsag) clearInterval(tsag); // өмнөх таймерийг зогсооно
  let seconds = 60;
  const timeElement = document.getElementById("uldsen_hugatsaa");
  timeElement.textContent = "01:00";
  tsag = setInterval(() => {
    seconds--;
    let min = Math.floor(seconds / 60);
    let sec = seconds % 60;
    if (sec < 10) sec = "0" + sec;
    if (min < 10) min = "0" + min;
    timeElement.textContent = `${min}:${sec}`;
    if (seconds <= 0) {
      clearInterval(tsag);
      showAlert("Хугацаа дууслаа!");
      togloom_duuslaa(score);
    }
  }, 1000);

  ehlehShineUg();
}

// 🔤 Үсэг дарахад дуудагдана
function taahUseg(letter, btn) {
  if (btn.disabled) return;
  btn.disabled = true;

  const taahDiv = document.getElementById("taah_ugnii_heseg");
  if (taahUg.includes(letter)) {
    [...taahUg].forEach((ltr, i) => {
      if (ltr === letter) {
        correctLetters[i] = letter;
        taahDiv.children[i].textContent = letter;
      }
    });
    score += 10;
    document.getElementById("toglogchiin_onoo").textContent = "Оноо: " + score;

    if (correctLetters.join("") === taahUg) {
      setTimeout(() => {
        showAlert("Та энэ үгийг таалаа! Дараагийн үг...");
        ehlehShineUg();
      }, 300);
    }
  } else {
    wrongGuesses++;
    haruulahHeseg(wrongGuesses);
    if (wrongGuesses >= maxWrong) {
      setTimeout(() => {
        showAlert("Буруу таалт хэтэрлээ!");
        togloom_duuslaa(score);
      }, 300);
    }
  }
}

// 🆕 Шинэ үг эхлүүлэх функц
function ehlehShineUg() {
  wrongGuesses = 0;
  const random = words[Math.floor(Math.random() * words.length)];
  taahUg = random.word;
  correctLetters = Array(taahUg.length).fill("");
  document.getElementById("hint").textContent = "Таах үг: " + random.hint;

  const taahDiv = document.getElementById("taah_ugnii_heseg");
  taahDiv.innerHTML = "";
  for (let i = 0; i < taahUg.length; i++) {
    const box = document.createElement("div");
    box.classList.add("letter-box");
    taahDiv.appendChild(box);
  }

  const keyboard = document.getElementById("keyboard");
  keyboard.innerHTML = "";

  // ✅ Монгол цагаан толгойн keyboard layout (35 үсэг)
  const keyboardRows = [
    ["ф", "ц", "у", "ж", "э", "н", "г", "ш", "щ", "з", "к", "ъ", "ү"],
    ["й", "ы", "б", "ө", "а", "х", "р", "о", "л", "д", "п", "е"],
    ["я", "ч", "ё", "с", "м", "и", "т", "ь", "в", "ю", "х"],
  ];

  keyboardRows.forEach((rowLetters) => {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("key-row");

    rowLetters.forEach((ch) => {
      const btn = document.createElement("button");
      btn.textContent = ch.toUpperCase();
      btn.disabled = false;
      btn.addEventListener("click", () => taahUseg(ch.toUpperCase(), btn));
      rowDiv.appendChild(btn);
    });

    keyboard.appendChild(rowDiv);
  });

  const parts = [
    "tolgoi",
    "body",
    "left-arm",
    "right-arm",
    "left-leg",
    "right-leg",
  ];
  parts.forEach((id) => {
    const elem = document.getElementById(id);
    if (elem) elem.classList.add("hidden");
  });
}

function haruulahHeseg(n) {
  const parts = [
    "tolgoi",
    "body",
    "left-arm",
    "right-arm",
    "left-leg",
    "right-leg",
  ];
  const elem = document.getElementById(parts[n - 1]);
  if (elem) elem.classList.remove("hidden");
}

function togloom_duuslaa(score) {
  if (tsag) clearInterval(tsag);
  document.getElementById("togloomiin-undsen-heseg").style.display = "none";
  document.getElementById("game-over-heseg").style.display = "block";
  document.getElementById("final-score").textContent = "Таны оноо: " + score;

  const nickname = getCookie("nickname");
  if (nickname) saveToLeaderboard(nickname, score);
}

function saveToLeaderboard(nickname, score) {
  let topPlayers = JSON.parse(localStorage.getItem("leaderboard")) || [];
  topPlayers.push({ name: nickname, score: score });
  topPlayers.sort((a, b) => b.score - a.score);
  topPlayers = topPlayers.slice(0, 10);
  localStorage.setItem("leaderboard", JSON.stringify(topPlayers));

  if (
    topPlayers.slice(0, 5).some((p) => p.name === nickname && p.score === score)
  ) {
    document.getElementById("high-score-message").classList.remove("hidden");
  }
}

// 🎯 Leaderboard харах товч

document
  .getElementById("show-leaderboard-game")
  .addEventListener("click", showLeaderboard);
document
  .getElementById("show-leaderboard-over")
  .addEventListener("click", showLeaderboard);

function showLeaderboard() {
  document.getElementById("Nuur_huudas").style.display = "none";
  document.getElementById("togloomiin-undsen-heseg").style.display = "none";
  document.getElementById("game-over-heseg").style.display = "none";
  document.getElementById("leaderboard-heseg").classList.remove("hidden");
  document.getElementById("leaderboard-heseg").style.display = "block";

  const board = document.getElementById("leaderboard");
  board.innerHTML = "";

  const players = JSON.parse(localStorage.getItem("leaderboard")) || [];
  players.forEach((player, i) => {
    const div = document.createElement("div");
    div.textContent = `${i + 1}. ${player.name} - ${player.score} оноо`;
    board.appendChild(div);
  });
}

// 🔁 Дахин тоглох, буцах товч

document.getElementById("back-to-game").addEventListener("click", () => {
  document.getElementById("leaderboard-heseg").style.display = "none";
  document.getElementById("togloomiin-undsen-heseg").style.display = "block";
});

document.getElementById("dahin_togloh").addEventListener("click", () => {
  const nickname = getCookie("nickname");
  if (nickname) {
    document.getElementById("game-over-heseg").style.display = "none";
    togloom_ehluuleh(nickname);
  } else {
    window.location.reload();
  }
});

// ⚠️ Зөөлөн анхааруулга үзүүлэх функц
function showAlert(msg, duration = 2000) {
  const alertBox = document.getElementById("alert-box");
  alertBox.textContent = msg;
  alertBox.style.display = "block";

  setTimeout(() => {
    alertBox.style.display = "none";
  }, duration);
}
