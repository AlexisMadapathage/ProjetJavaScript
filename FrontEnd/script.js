const URL = "http://localhost:5678/api/works";
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

    const loginLien = document.getElementById("login");
    loginLien.textContent = "logout";
    loginLien.removeAttribute("href");
    loginLien.addEventListener("click", logout);
}

// Chargement initial
fetchProjets();
creerBtnFiltres();

// Fonction pour récupérer les projets via l'API
async function fetchProjets() {
    try {
        const response = await fetch(URL);
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

// Fonction pour créer les catégories de boutons 
function createArray() {
    return [
        { id: "all", name: "Tous" },
        { id: 1, name: "Objets" },
        { id: 2, name: "Appartements" },
        { id: 3, name: "Hotels & Restaurants" },
    ];
}

// Fonction pour créer les boutons de filtres 
function creerBtnFiltres() {
    const categories = createArray();

    categories.forEach(categorie => {
        const bouton = document.createElement("button");
        bouton.textContent = categorie.name;
        bouton.classList.add("filter-button");
        bouton.dataset.categoryId = categorie.id;
        filtersContainer.appendChild(bouton);

        bouton.addEventListener("click", () => {
            document.querySelectorAll(".filter-button").forEach(btn => btn.classList.remove("active"));
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
    adminBar.classList.add("hidden");
    adminText.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> Mode édition'
    adminContainer.classList.add("admin-container");

    adminContainer.appendChild(adminText);
    adminBar.appendChild(adminContainer);

    document.body.insertBefore(adminBar, document.body.firstChild);
}

// Fonction pour créer le bouton "Modifier"
function creerBtnModifier() {
    const titleProjets = document.querySelector("#portfolio h2");
    const btnProjets = document.createElement("button");

    btnProjets.id = "modifier-button";
    btnProjets.classList.add("hidden");
    btnProjets.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> Modifier';

    titleProjets.appendChild(btnProjets);

    btnProjets.addEventListener("click", () => {
        console.log("Ouverture de la modale !");
    });
}

function logout() {
    localStorage.removeItem("token");
    window.location.reload();
}