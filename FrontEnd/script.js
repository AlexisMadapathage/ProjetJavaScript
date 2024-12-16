const URL = "http://localhost:5678/api/works";
const gallery = document.querySelector(".gallery");
const filtersContainer = document.getElementById("filtres");
let projetsGlobaux = [];

fetchProjets();

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

function createArray() {
    return [
        { id: "all", name: "Tous" },
        { id: 1, name: "Objets" },
        { id: 2, name: "Appartements" },
        { id: 3, name: "Hotels & Restaurants" },
    ];
}

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


async function filtrerProjets(categoryId) {
        const projetsFiltres = categoryId === "all"
            ? projetsGlobaux
            : projetsGlobaux.filter(projet => projet.categoryId === parseInt(categoryId));

        afficherProjets(projetsFiltres);
}

creerBtnFiltres();