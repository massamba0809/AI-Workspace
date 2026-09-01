/* =========================================================
   AI WORKSPACE — script.js
   Les modules de la zone principale sont générés dynamiquement
   en fonction de l'élément du menu sélectionné.
   ========================================================= */

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
        case "prediction":
            renderPrediction();
            break;
        case "historique":
            renderHistorique();
            break;
        default:
            renderAVenir(name);
    }
}

navItems.forEach(btn => {
    btn.addEventListener("click", () => goToView(btn.dataset.view));
});

/* ---------------------------------------------------------
   PARTIE 7 — GESTION DE L'HISTORIQUE (localStorage)
   --------------------------------------------------------- */
const STORAGE_KEY = "ai-workspace-historique";

function getHistorique() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
        return [];
    }
}

function saveHistorique(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function ajouterHistorique(service, entree, resultat) {
    const list = getHistorique();
    list.unshift({
        id: Date.now() + Math.random().toString(16).slice(2),
        service,
        entree,
        resultat,
        date: new Date().toLocaleString("fr-FR"),
    });
    saveHistorique(list);
}

function tronquer(str, n) {
    if (!str) return "";
    return str.length > n ? str.slice(0, n) + "…" : str;
}

/* ---------------------------------------------------------
   VUE PAR DÉFAUT : TABLEAU DE BORD (provisoire)
   --------------------------------------------------------- */
function renderDashboard() {
    mainContent.innerHTML = `
    <p class="view-subtitle">Bienvenue sur votre espace de travail intelligent.</p>

    <div class="stat-grid">
      <div class="stat-card">
        <span class="stat-card__label">Nombre de jeux de données</span>
        <span class="stat-card__value">24</span>
        <span class="stat-card__delta">+3 ce mois-ci</span>
      </div>
      <div class="stat-card">
        <span class="stat-card__label">Nombre de requêtes</span>
        <span class="stat-card__value">1,256</span>
        <span class="stat-card__delta">+18% ce mois-ci</span>
      </div>
      <div class="stat-card">
        <span class="stat-card__label">Nombre de modèles disponibles</span>
        <span class="stat-card__value">12</span>
        <span class="stat-card__delta">+2 ce mois-ci</span>
      </div>
      <div class="stat-card">
        <span class="stat-card__label">Utilisateurs actifs</span>
        <span class="stat-card__value">8</span>
        <span class="stat-card__delta">+2 ce mois-ci</span>
      </div>
      <div class="stat-card">
        <span class="stat-card__label">Tâches exécutées</span>
        <span class="stat-card__value">342</span>
        <span class="stat-card__delta">+22% ce mois-ci</span>
      </div>
    </div>

    <div class="panel-grid">
      <div class="panel">
        <div class="panel__header">
          <h2 class="panel__title">Requêtes par jour</h2>
          <select class="panel__select">
            <option>7 derniers jours</option>
            <option>30 derniers jours</option>
          </select>
        </div>
        ${lineChartMarkup()}
      </div>

      <div class="panel">
        <h2 class="panel__title">Répartition des requêtes par service</h2>
        ${donutChartMarkup()}
      </div>
    </div>

    <div class="panel-grid">
      <div class="panel">
        <h2 class="panel__title">Activité récente</h2>
        <table class="table">
          <thead><tr><th>Activité</th><th>Service</th><th>Utilisateur</th><th>Date</th></tr></thead>
          <tbody>
            <tr><td>Résumé du document_projet.pdf</td><td>Résumé de texte</td><td>Admin User</td><td>21/05/2024 14:32</td></tr>
            <tr><td>Classification de sentiments</td><td>Classification</td><td>Admin User</td><td>21/05/2024 14:21</td></tr>
            <tr><td>Traduction FR → EN</td><td>Traduction</td><td>Admin User</td><td>21/05/2024 14:15</td></tr>
            <tr><td>Discussion sur l'IA générative</td><td>Chat</td><td>Admin User</td><td>21/05/2024 14:05</td></tr>
            <tr><td>Génération d'idées de projet</td><td>Idées</td><td>Admin User</td><td>13/05/2024 13:50</td></tr>
          </tbody>
        </table>
        <a class="panel__link" data-view="historique">Voir tout l'historique</a>
      </div>

      <div class="panel">
        <h2 class="panel__title">Modèles populaires</h2>
        <table class="table">
          <thead><tr><th>Modèle</th><th>Utilisations</th></tr></thead>
          <tbody>
            <tr><td>mistral-7b-instruct</td><td>532</td></tr>
            <tr><td>gpt-4-turbo</td><td>389</td></tr>
            <tr><td>llama-3-8b</td><td>256</td></tr>
            <tr><td>bert-base-uncased</td><td>179</td></tr>
            <tr><td>google-translate-v1</td><td>142</td></tr>
          </tbody>
        </table>
        <a class="panel__link" href="#">Voir tous les modèles</a>
      </div>
    </div>
  `;

    const lienHistorique = mainContent.querySelector('.panel__link[data-view="historique"]');
    if (lienHistorique) {
        lienHistorique.addEventListener("click", e => {
            e.preventDefault();
            goToView("historique");
        });
    }
}

function lineChartMarkup() {
    const jours = ["15 Mai", "16 Mai", "17 Mai", "18 Mai", "19 Mai", "20 Mai", "21 Mai"];
    const valeurs = [150, 200, 160, 225, 260, 285, 310];
    const maxY = 350;
    const w = 460, h = 200, padL = 30, padB = 24, padT = 10;
    const stepX = (w - padL - 10) / (valeurs.length - 1);
    const points = valeurs.map((v, i) => {
        const x = padL + i * stepX;
        const y = padT + (h - padT - padB) * (1 - v / maxY);
        return `${x},${y}`;
    }).join(" ");

    const grille = [0, 100, 200, 300].map(v => {
        const y = padT + (h - padT - padB) * (1 - v / maxY);
        return `<line x1="${padL}" y1="${y}" x2="${w - 5}" y2="${y}" stroke="var(--line)" stroke-width="1"/>
            <text x="2" y="${y + 4}" font-size="9" fill="var(--ink-soft)">${v}</text>`;
    }).join("");

    const labels = jours.map((j, i) => {
        const x = padL + i * stepX;
        return `<text x="${x}" y="${h - 4}" font-size="9" fill="var(--ink-soft)" text-anchor="middle">${j}</text>`;
    }).join("");

    const dots = valeurs.map((v, i) => {
        const x = padL + i * stepX;
        const y = padT + (h - padT - padB) * (1 - v / maxY);
        return `<circle cx="${x}" cy="${y}" r="3" fill="var(--accent)"/>`;
    }).join("");

    return `
    <svg viewBox="0 0 ${w} ${h}" class="line-chart">
      ${grille}
      <polyline points="${points}" fill="none" stroke="var(--accent)" stroke-width="2"/>
      ${dots}
      ${labels}
    </svg>
  `;
}

function donutChartMarkup() {
    const services = [
        { label: "Chat", pct: 38, color: "var(--accent)" },
        { label: "Résumé de texte", pct: 22, color: "#8A6D4B" },
        { label: "Classification", pct: 18, color: "#6B5B95" },
        { label: "Traduction", pct: 12, color: "#C9A97E" },
        { label: "Autres", pct: 10, color: "#B7AFA0" },
    ];

    let cumule = 0;
    const segments = services.map(s => {
        const debut = cumule;
        cumule += s.pct;
        return `${s.color} ${debut}% ${cumule}%`;
    }).join(", ");

    const legende = services.map(s => `
    <div class="legend-row">
      <span class="legend-dot" style="background:${s.color}"></span>
      <span class="legend-label">${s.label}</span>
      <span class="legend-pct">${s.pct}%</span>
    </div>
  `).join("");

    return `
    <div class="donut-layout">
      <div class="donut" style="background:conic-gradient(${segments})"></div>
      <div class="legend">${legende}</div>
    </div>
  `;
}

/* ---------------------------------------------------------
   VUES PAS ENCORE CONSTRUITES
   --------------------------------------------------------- */
function renderAVenir(name) {
    mainContent.innerHTML = `
    <div class="panel">
      <h2 class="panel__title">Module « ${VIEW_TITLES[name]} »</h2>
      <p>Ce module sera construit dans une prochaine partie.</p>
    </div>
  `;
}

/* ---------------------------------------------------------
   PARTIE 3 — RÉSUMÉ DE TEXTE
   --------------------------------------------------------- */
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

        ajouterHistorique("Résumé de texte", texte, resultat);
    });
}

// Simulation : garde les deux premières phrases du texte
function resumerTexte(texte) {
    const phrases = texte.split(/(?<=[.!?])\s+/).filter(Boolean);
    if (phrases.length <= 2) return texte.trim();
    return phrases.slice(0, 2).join(" ") + " […]";
}

/* ---------------------------------------------------------
   PARTIE 4 — TRADUCTION
   --------------------------------------------------------- */
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

        ajouterHistorique("Traduction", texte, resultat);
    });
}

// Simulation : préfixe le texte avec la langue cible choisie
function traduireTexte(texte, langue) {
    return `[${langue}] ${texte}`;
}

/* ---------------------------------------------------------
   PARTIE 5 — CHAT IA
   --------------------------------------------------------- */
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

            ajouterHistorique("Chat", message, reponse);
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

/* ---------------------------------------------------------
   PARTIE 6 — PRÉDICTION
   --------------------------------------------------------- */
function renderPrediction() {
    mainContent.innerHTML = `
    <p class="view-subtitle">Estimez une prédiction fictive à partir de quelques informations.</p>

    <div class="card-form">
      <label class="field-label" for="predAge">Âge</label>
      <input type="number" id="predAge" min="0" placeholder="Ex : 27">

      <label class="field-label" for="predRevenu">Revenu mensuel (FCFA)</label>
      <input type="number" id="predRevenu" min="0" placeholder="Ex : 250000">

      <label class="field-label" for="predVille">Ville</label>
      <input type="text" id="predVille" placeholder="Ex : Dakar">

      <button class="btn btn--primary" id="predBtn">Prédire</button>

      <div class="result-box" id="predResult" hidden>
        <h3 class="result-box__title">Prédiction</h3>
        <p id="predOutput"></p>
      </div>
    </div>
  `;

    document.getElementById("predBtn").addEventListener("click", () => {
        const age = document.getElementById("predAge").value;
        const revenu = document.getElementById("predRevenu").value;
        const ville = document.getElementById("predVille").value.trim();

        if (!age || !revenu || !ville) {
            alert("Merci de renseigner l'âge, le revenu et la ville.");
            return;
        }

        const resultat = predireProfil(age, revenu, ville);
        document.getElementById("predOutput").textContent = resultat;
        document.getElementById("predResult").hidden = false;

        ajouterHistorique("Prédiction", `Âge ${age}, Revenu ${revenu}, Ville ${ville}`, resultat);
    });
}

// Simulation : calcule un score fictif à partir des 3 champs
function predireProfil(age, revenu, ville) {
    const score = (Number(age) * 0.3 + Number(revenu) / 10000 + ville.length * 2) % 100;
    const label = score > 60 ? "Profil à fort potentiel" : score > 30 ? "Profil intermédiaire" : "Profil à surveiller";
    return `${label} — score simulé : ${score.toFixed(1)}/100`;
}

/* ---------------------------------------------------------
   PARTIE 7 — VUE HISTORIQUE
   --------------------------------------------------------- */
function renderHistorique() {
    mainContent.innerHTML = `
    <p class="view-subtitle">Retrouvez, recherchez ou supprimez vos requêtes précédentes.</p>

    <div class="historique-toolbar">
      <input type="search" id="historiqueSearch" placeholder="Rechercher dans l'historique…">
      <button class="btn btn--danger" id="historiqueClear">Vider l'historique</button>
    </div>

    <table class="table" id="historiqueTable">
      <thead>
        <tr><th>Service</th><th>Entrée</th><th>Résultat</th><th>Date</th><th></th></tr>
      </thead>
      <tbody></tbody>
    </table>
    <p class="empty-hint" id="historiqueVide">Aucune requête enregistrée pour l'instant.</p>
  `;

    dessinerHistorique();

    document.getElementById("historiqueSearch").addEventListener("input", e => {
        dessinerHistorique(e.target.value);
    });

    document.getElementById("historiqueClear").addEventListener("click", () => {
        if (!confirm("Vider tout l'historique ? Cette action est irréversible.")) return;
        saveHistorique([]);
        dessinerHistorique();
    });
}

function dessinerHistorique(filtre = "") {
    const tbody = document.querySelector("#historiqueTable tbody");
    const vide = document.getElementById("historiqueVide");
    const list = getHistorique().filter(item => {
        const cible = `${item.service} ${item.entree} ${item.resultat}`.toLowerCase();
        return cible.includes(filtre.toLowerCase());
    });

    tbody.innerHTML = "";
    vide.hidden = list.length > 0;

    list.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${item.service}</td>
      <td>${tronquer(item.entree, 60)}</td>
      <td>${tronquer(item.resultat, 60)}</td>
      <td>${item.date}</td>
      <td><button class="row-delete" data-id="${item.id}">Supprimer</button></td>
    `;
        tbody.appendChild(tr);
    });

    tbody.querySelectorAll(".row-delete").forEach(btn => {
        btn.addEventListener("click", () => {
            saveHistorique(getHistorique().filter(item => item.id !== btn.dataset.id));
            dessinerHistorique(filtre);
        });
    });
}

/* ---------------------------------------------------------
   INITIALISATION
   --------------------------------------------------------- */
renderDashboard();