const BASE_URL = "http://localhost:5678/api"; // URL de base pour l'API
const URL_WORKS = `${BASE_URL}/works`; // Endpoint pour les travaux
const URL_CATEGORIES = `${BASE_URL}/categories`; // Endpoint pour les catégories

const gallery = document.querySelector(".gallery");
const filtersContainer = document.getElementById("filtres");
let projetsGlobaux = [];

// Verfication de l'existence du token//
const token = localStorage.getItem("token");

if (token) {
    creerAdminBar();
    const adminBar = document.getElementById("admin-bar")
    adminBar.classList.remove("hidden");

    creerBtnModifier();
    const btnProjets = document.getElementById("modifier-button");
    btnProjets.classList.remove("hidden")

    // Change le lien de "login" en "logout"
    const loginLien = document.getElementById("login");
    loginLien.textContent = "logout";
    loginLien.removeAttribute("href");
    loginLien.addEventListener("click", logout);
}

// Fonction pour cacher les filtres si l'utilisateur est connecté
function gererAffichageFiltres() {
    if (token) {
        // Cache les filtres
        filtersContainer.style.display = "none";
    } else {
        // Affiche les filtres
        filtersContainer.style.display = "flex";
    }
}

// Chargement initial
fetchProjets(); // Récupère les projets depuis l'API
creerBtnFiltres();
gererAffichageFiltres(); // Appelle la fonction au chargement de la page

// Fonction pour récupérer les projets via l'API
async function fetchProjets() {
    try {
        // Effectue une requête GET vers l'URL
        const response = await fetch(URL_WORKS);
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }
        projetsGlobaux = await response.json();
        afficherProjets(projetsGlobaux);
    } catch (error) {
        console.error("Erreur lors de la récupération des projets :", error);
    }
}

// Fonction pour afficher les projets dans la galerie
function afficherProjets(projets) {
    gallery.innerHTML = "";

    for (let i = 0; i < projets.length; i++) {

        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const figcaption = document.createElement("figcaption");

        img.src = projets[i].imageUrl;
        img.alt = projets[i].title;

        figcaption.textContent = projets[i].title;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    }
}

async function fetchCategories() {
    try {
        const response = await fetch(URL_CATEGORIES); // URL de l'API
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }
        const categories = await response.json();
        return categories; // Retourne la liste des catégories uniques
    } catch (error) {
        console.error("Erreur lors de la récupération des catégories :", error);
        return []; // Retourne un tableau vide en cas d'erreur
    }
}

// Fonction pour créer les boutons de filtres 
async function creerBtnFiltres() {
    const categories = await fetchCategories(); // Récupère les catégories via l'API

    // Ajoute un bouton "Tous" manuellement pour afficher tous les projets
    const boutonTous = document.createElement("button");
    boutonTous.textContent = "Tous";
    boutonTous.classList.add("filter-button", "active"); // Par défaut, le bouton "Tous" est actif
    boutonTous.dataset.categoryId = "all";
    filtersContainer.appendChild(boutonTous);

    boutonTous.addEventListener("click", () => {
        document.querySelectorAll(".filter-button").forEach((btn) => btn.classList.remove("active"));
        boutonTous.classList.add("active");
        filtrerProjets("all");
    });

    // Génère les boutons pour chaque catégorie
    categories.forEach((categorie) => {
        const bouton = document.createElement("button");
        bouton.textContent = categorie.name;
        bouton.classList.add("filter-button");
        bouton.dataset.categoryId = categorie.id; // Ajoute l'ID de la catégorie comme attribut data
        filtersContainer.appendChild(bouton);

        // Ajoute un événement pour filtrer les projets en fonction de la catégorie
        bouton.addEventListener("click", () => {
            document.querySelectorAll(".filter-button").forEach((btn) => btn.classList.remove("active"));
            bouton.classList.add("active");
            filtrerProjets(categorie.id);
        });
    });
}

// Fonction pour filtrer projets selon catégorie
async function filtrerProjets(categoryId) {
    const projetsFiltres = categoryId === "all"
        ? projetsGlobaux
        : projetsGlobaux.filter(projet => projet.categoryId === parseInt(categoryId));

    afficherProjets(projetsFiltres);
}

// Fonction pour créer la barre d'administration
function creerAdminBar() {
    const adminBar = document.createElement("div")
    const adminText = document.createElement("p")
    const adminContainer = document.createElement("div");

    adminBar.id = "admin-bar";
    adminBar.classList.add("hidden"); // Cache la barre par défaut
    adminText.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> Mode édition'
    adminContainer.classList.add("admin-container");

    adminContainer.appendChild(adminText);
    adminBar.appendChild(adminContainer);

    document.body.insertBefore(adminBar, document.body.firstChild); // Insère la barre au début du body
}

// Fonction pour créer le bouton "Modifier"
function creerBtnModifier() {
    const titleProjets = document.querySelector("#portfolio h2");
    const btnProjets = document.createElement("button");

    btnProjets.id = "modifier-button";
    btnProjets.classList.add("hidden");
    btnProjets.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> Modifier';

    titleProjets.appendChild(btnProjets);

    // Ajoute un événement pour ouvrir la modale lorsqu'on clique sur le bouton
    btnProjets.addEventListener("click", () => {
    });
}

function logout() {
    localStorage.removeItem("token");
    window.location.reload();
}