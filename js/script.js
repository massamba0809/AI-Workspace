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
        default:
            renderAVenir(name);
    }
}

navItems.forEach(btn => {
    btn.addEventListener("click", () => goToView(btn.dataset.view));
});

/* ---------------------------------------------------------
   VUE PAR DÉFAUT : TABLEAU DE BORD (provisoire)
   --------------------------------------------------------- */
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
    });
}

// Simulation : garde les deux premières phrases du texte
function resumerTexte(texte) {
    const phrases = texte.split(/(?<=[.!?])\s+/).filter(Boolean);
    if (phrases.length <= 2) return texte.trim();
    return phrases.slice(0, 2).join(" ") + " […]";
}

/* ---------------------------------------------------------
   INITIALISATION
   --------------------------------------------------------- */
renderDashboard();