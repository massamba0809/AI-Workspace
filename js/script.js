

const mainContent = document.getElementById("mainContent");
const viewTitle = document.getElementById("viewTitle");
const navItems = document.querySelectorAll(".nav-item");

const VIEW_TITLES = {
    dashboard: "Tableau de bord",
    chat: "Chat",
    resume: "Résumé de texte",
    classification: "Classification",
    traduction: "Traduction",
    prediction: "Prédiction",
    historique: "Historique",
};

/* ---------------------------------------------------------
   NAVIGATION : bascule entre les modules
   --------------------------------------------------------- */
function goToView(name) {
    navItems.forEach(btn => btn.classList.toggle("is-active", btn.dataset.view === name));
    viewTitle.textContent = VIEW_TITLES[name] || "";

    switch (name) {
        case "dashboard":
            renderDashboard();
            break;
        case "resume":
            renderResume();
            break;
        case "traduction":
            renderTraduction();
            break;
        case "chat":
            renderChat();
            break;
        default:
            renderAVenir(name);
    }
}

navItems.forEach(btn => {
    btn.addEventListener("click", () => goToView(btn.dataset.view));
});


function renderDashboard() {
    mainContent.innerHTML = `
    <p class="view-subtitle">Bienvenue sur votre espace de travail intelligent.</p>
    <div class="panel">
      <h2 class="panel__title">À propos de ce tableau de bord</h2>
      <p>Les statistiques détaillées (requêtes, activité récente) seront branchées
      sur l'historique réel une fois le module Historique construit.</p>
    </div>
  `;
}


function renderAVenir(name) {
    mainContent.innerHTML = `
    <div class="panel">
      <h2 class="panel__title">Module « ${VIEW_TITLES[name]} »</h2>
      <p>Ce module sera construit dans une prochaine partie.</p>
    </div>
  `;
}

function renderResume() {
    mainContent.innerHTML = `
    <p class="view-subtitle">Collez un texte long, obtenez-en un résumé simulé.</p>

    <div class="card-form">
      <label class="field-label" for="resumeInput">Texte à résumer</label>
      <textarea id="resumeInput" rows="8" placeholder="Collez ou saisissez votre texte ici…"></textarea>
      <button class="btn btn--primary" id="resumeBtn">Résumer</button>

      <div class="result-box" id="resumeResult" hidden>
        <h3 class="result-box__title">Résumé</h3>
        <p id="resumeOutput"></p>
      </div>
    </div>
  `;

    document.getElementById("resumeBtn").addEventListener("click", () => {
        const input = document.getElementById("resumeInput");
        const texte = input.value.trim();
        if (!texte) { input.focus(); return; }

        const resultat = resumerTexte(texte);
        document.getElementById("resumeOutput").textContent = resultat;
        document.getElementById("resumeResult").hidden = false;
    });
}

// Simulation : garde les deux premières phrases du texte
function resumerTexte(texte) {
    const phrases = texte.split(/(?<=[.!?])\s+/).filter(Boolean);
    if (phrases.length <= 2) return texte.trim();
    return phrases.slice(0, 2).join(" ") + " […]";
}

function renderTraduction() {
    mainContent.innerHTML = `
    <p class="view-subtitle">Traduisez un texte vers la langue de votre choix (simulation).</p>

    <div class="card-form">
      <label class="field-label" for="traductionInput">Texte à traduire</label>
      <textarea id="traductionInput" rows="6" placeholder="Saisissez votre texte…"></textarea>

      <label class="field-label" for="traductionLangue">Langue cible</label>
      <select id="traductionLangue">
        <option value="Anglais">Anglais</option>
        <option value="Espagnol">Espagnol</option>
        <option value="Wolof">Wolof</option>
        <option value="Arabe">Arabe</option>
        <option value="Allemand">Allemand</option>
      </select>

      <button class="btn btn--primary" id="traductionBtn">Traduire</button>

      <div class="result-box" id="traductionResult" hidden>
        <h3 class="result-box__title">Traduction</h3>
        <p id="traductionOutput"></p>
      </div>
    </div>
  `;

    document.getElementById("traductionBtn").addEventListener("click", () => {
        const input = document.getElementById("traductionInput");
        const texte = input.value.trim();
        const langue = document.getElementById("traductionLangue").value;
        if (!texte) { input.focus(); return; }

        const resultat = traduireTexte(texte, langue);
        document.getElementById("traductionOutput").textContent = resultat;
        document.getElementById("traductionResult").hidden = false;
    });
}

// Simulation : préfixe le texte avec la langue cible choisie
function traduireTexte(texte, langue) {
    return `[${langue}] ${texte}`;
}


const REPONSES_SIMULEES = [
    "C'est une excellente question, laissez-moi y réfléchir.",
    "D'après mes données simulées, la réponse serait oui.",
    "Je n'ai pas assez d'informations, pouvez-vous préciser ?",
    "Voici une piste : essayez de reformuler votre demande.",
    "Intéressant ! Voulez-vous que je développe ce point ?",
];

function renderChat() {
    mainContent.innerHTML = `
    <div class="chat-page">
      <div class="chat-scroll" id="chatMessages">
        ${chatMessageMarkup("bot", "Bonjour ! Posez-moi une question, je vous répondrai (réponse simulée).")}
      </div>

      <form class="chat-composer" id="chatForm">
        <textarea id="chatInput" rows="1" placeholder="Écrivez votre message…" autocomplete="off"></textarea>
        <button type="submit" class="chat-send-btn" aria-label="Envoyer">↑</button>
      </form>
    </div>
  `;

    const chatMessages = document.getElementById("chatMessages");
    const chatInput = document.getElementById("chatInput");

    chatInput.addEventListener("input", () => {
        chatInput.style.height = "auto";
        chatInput.style.height = Math.min(chatInput.scrollHeight, 160) + "px";
    });

    chatInput.addEventListener("keydown", e => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            document.getElementById("chatForm").requestSubmit();
        }
    });

    document.getElementById("chatForm").addEventListener("submit", e => {
        e.preventDefault();
        const message = chatInput.value.trim();
        if (!message) return;

        chatMessages.insertAdjacentHTML("beforeend", chatMessageMarkup("user", message));

        chatInput.value = "";
        chatInput.style.height = "auto";
        chatMessages.scrollTop = chatMessages.scrollHeight;

        setTimeout(() => {
            const reponse = REPONSES_SIMULEES[Math.floor(Math.random() * REPONSES_SIMULEES.length)];
            chatMessages.insertAdjacentHTML("beforeend", chatMessageMarkup("bot", reponse));
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 350);
    });
}

function chatMessageMarkup(role, texte) {
    const avatar = role === "bot" ? "IA" : "Moi";
    return `
    <div class="chat-message chat-message--${role}">
      <span class="chat-avatar chat-avatar--${role}">${avatar}</span>
      <div class="chat-message__body">${texte}</div>
    </div>
  `;
}


renderDashboard();