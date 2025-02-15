// Fonction pour afficher la première modale
function afficherModale() {
    const modaleOverlay = document.querySelector(".modale-overlay");
    if (modaleOverlay) {
        modaleOverlay.style.display = "flex"; // Affiche la modale
        chargerImagesModale();
    }
}

// Fonction pour fermer la première modale
function fermerModale() {
    const modaleOverlay = document.querySelector(".modale-overlay");
    if (modaleOverlay) {
        modaleOverlay.style.display = "none"; // Cache la modale
    }
}

// Fonction pour charger les images dans la modale (galerie photo)
async function chargerImagesModale() {
    try {
        const response = await fetch(URL_WORKS);
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }
        const travaux = await response.json();

        const modaleGallery = document.querySelector(".modale-gallery");
        modaleGallery.innerHTML = ""; // Vide le conteneur avant d'ajouter les images

        travaux.forEach(travail => {
            const figure = document.createElement("figure");
            const img = document.createElement("img");
            const deleteButton = document.createElement("button");

            img.src = travail.imageUrl;
            img.alt = travail.title;
            figure.classList.add("gallery-item");

            deleteButton.classList.add("delete-button");
            deleteButton.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
            deleteButton.addEventListener("click", (e) => {
                e.preventDefault();
                supprimerPhoto(travail.id, figure);
            });

            figure.appendChild(img);
            figure.appendChild(deleteButton);
            modaleGallery.appendChild(figure);
        });
    } catch (error) {
        console.error("Erreur lors du chargement des images dans la modale :", error);
        const modaleGallery = document.querySelector(".modale-gallery");
        modaleGallery.innerHTML = `<p>Impossible de charger les images. Veuillez réessayer.</p>`;
    }
}

// Fonction pour supprimer une photo
function supprimerPhoto(photoId) {
    fetch(`${URL_WORKS}/${photoId}`, {
        method: "DELETE",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        }
    })
        .then((response) => {
            if (response.ok) {
                const figureToRemove = document.querySelector('[data-id="${photoId}"]');
                if (figureToRemove) {
                    figureToRemove.remove();
                }
            }
        })
        .catch((error) => {
            console.error("Erreur lors de la requête de suppression :", error);
            alert("Une erreur est survenue. Veuillez réessayer.");
        });
}

const btnModifier = document.getElementById("modifier-button");

// Création de la modale uniquement une fois
creerModale();

btnModifier.addEventListener("click", () => {
    afficherModale();
});

// Fonction principale pour créer la première modale 
function creerModale() {
    // Création des éléments principaux
    const modaleOverlay = document.createElement("div");
    const modale = document.createElement("div");
    const closeButton = document.createElement("span");
    const modaleContent = document.createElement("div");
    //const galleryView = document.createElement("div");

    // Ajout des classes
    modaleOverlay.classList.add("modale-overlay");
    modale.classList.add("modale");
    closeButton.classList.add("close-button");
    modaleContent.classList.add("modale-content");
    //galleryView.classList.add("gallery-view", "active");

    // Contenu des éléments HTML
    closeButton.innerHTML = "&times;"; // Symbole de fermeture

    // Récupère le contenu du template pour la galerie
    const galleryTemplate = document.getElementById("gallery-template");
    modaleContent.appendChild(galleryTemplate.content.cloneNode(true));

    // Organisation de la structure
    modale.appendChild(closeButton);
    modale.appendChild(modaleContent);
    modaleOverlay.appendChild(modale);
    document.body.appendChild(modaleOverlay);

    // Gestion de la fermeture de la modale
    closeButton.addEventListener("click", fermerModale);
    modaleOverlay.addEventListener("click", (event) => {
        if (event.target === modaleOverlay) {
            fermerModale();
        }
    });

    // Gestion de l'ouverture de la deuxième modale (formulaire)
    const btnAjouterPhoto = modale.querySelector(".btn-ajouter-photo");
    if (btnAjouterPhoto) {
        btnAjouterPhoto.addEventListener("click", afficherFormulaireModale);
    };
}

async function fetchCategories() {
    try {
        const response = await fetch(URL_WORKS); // Utilise la même URL de l'API pour obtenir les projets
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }
        const travaux = await response.json(); // Récupère tous les travaux
        // Extraire les catégories uniques depuis les travaux
        const categories = [];
        travaux.forEach((travail) => {
            const category = travail.category; // Catégorie imbriquée dans chaque travail
            if (!categories.some((cat) => cat.id === category.id)) {
                categories.push(category); // Ajoute la catégorie si elle n'existe pas déjà
            }
        });
        return categories; // Retourne les catégories uniques
    } catch (error) {
        console.error("Erreur lors de la récupération des catégories :", error);
        return []; // Retourne un tableau vide en cas d'erreur
    }
}

async function afficherFormulaireModale() {
    // Création des éléments principaux 
    const formOverlay = document.createElement("div");
    const formModale = document.createElement("div");
    const backButton = document.createElement("span");
    const closeButton = document.createElement("span");

    // Ajout des classes
    formOverlay.classList.add("form-overlay");
    formModale.classList.add("form-modale");
    backButton.classList.add("back-button");
    closeButton.classList.add("close-button");

    // Contenu des éléments HTML
    backButton.innerHTML = `<i class="fa-solid fa-arrow-left"></i>`;
    closeButton.innerHTML = "&times;";

    // Récupère le contenu du template pour le formulaire
    const formTemplate = document.getElementById("form-template");
    formModale.appendChild(formTemplate.content.cloneNode(true));

    // Sélectionne les éléments injectés
    const photoInput = formModale.querySelector("#photo-input");
    const photoPlaceholder = formModale.querySelector(".photo-placeholder");
    const photoPreviewContainer = formModale.querySelector(".photo-preview");
    const photoPreviewImg = formModale.querySelector("#photo-preview-img");

    // Ajout des catégories dans le menu déroulant via l'API
    const categorySelect = formModale.querySelector("#photo-category");
    try {
        categorySelect.innerHTML = ""; // Nettoie la liste

        // Ajout de l'option par défaut "-- Tous --"
        const defaultOption = document.createElement("option");
        defaultOption.value = "all";
        defaultOption.textContent = "-- Tous --";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        categorySelect.appendChild(defaultOption);

        const categories = await fetchCategories(); // Récupère les catégories via l'API
        if (categories.length === 0) {
            const noCategoryOption = document.createElement("option");
            noCategoryOption.value = "";
            noCategoryOption.textContent = "Aucune catégorie disponible";
            noCategoryOption.disabled = true;
            categorySelect.appendChild(noCategoryOption);
        } else {
            categories.forEach((category) => {
                const option = document.createElement("option");
                option.value = category.id;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error("Erreur lors de l'ajout des catégories :", error);
    }

    // Écouteur d'événement pour afficher l'aperçu de l'image sélectionnée
    photoInput.addEventListener("change", () => {
        const file = photoInput.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                photoPreviewImg.src = event.target.result;
                photoPlaceholder.style.display = "none";
                photoInput.style.display = "none";
                photoPreviewContainer.classList.remove("hidden");
            };
            reader.readAsDataURL(file);
        } else {
            photoPlaceholder.style.display = "flex";
            photoInput.style.display = "block";
            photoPreviewContainer.classList.add("hidden");
        }
    });

    // Organisation de la structure 
    formModale.appendChild(backButton);
    formModale.appendChild(closeButton);
    formOverlay.appendChild(formModale);
    document.body.appendChild(formOverlay);

    // Gestion de clic sur la flèche pour revenir à la première modale
    backButton.addEventListener("click", () => {
        document.body.removeChild(formOverlay);
        afficherModale();
    });

    // Gestion de la fermeture de la deuxième modale
    closeButton.addEventListener("click", () => {
        document.body.removeChild(formOverlay);
    });

    formOverlay.addEventListener("click", (event) => {
        if (event.target === formOverlay) {
            document.body.removeChild(formOverlay);
        }
    });

    // Gestion de la soumission du formulaire
    const form = formModale.querySelector("#ajout-photo-form");
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        await ajouterPhoto();
        afficherModale(); // Réouvre la modale galerie
        //chargerImagesModale();
    });
}


// Fonction pour ajouter une photo (API)
async function ajouterPhoto() {
    const formModale = document.querySelector(".form-modale");
    const photoInput = formModale.querySelector("#photo-input");
    const titleInput = formModale.querySelector("#photo-title");
    const categorySelect = formModale.querySelector("#photo-category");
    const messageContainer = formModale.querySelector(".message-container");

    // Réinitialise le message avant chaque soumission
    messageContainer.textContent = "";
    messageContainer.classList.remove("success", "error");

    if (!photoInput.files[0] || !titleInput.value || !categorySelect.value) {
        messageContainer.textContent = "Veuillez remplir tous les champs du formulaire.";
        messageContainer.classList.add("error");
        return;
    }

    // Crée une instance de l'objet FormData, utilisé pour construire un ensemble de paires clé-valeur
    // représentant les données du formulaire à envoyer à l'API.
    const formData = new FormData();
    formData.append("image", photoInput.files[0]);
    formData.append("title", titleInput.value);
    formData.append("category", categorySelect.value);

    try {
        const response = await fetch(URL_WORKS, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: formData,
        });

        if (response.ok) {
            const newProjet = await response.json(); // Récupère le projet ajouté via l’API
            messageContainer.textContent = "Photo ajoutée avec succès !";
            messageContainer.classList.add("success");

            // Réinitialise le formulaire après l'ajout
            formModale.querySelector("#ajout-photo-form").reset();
            formModale.querySelector(".photo-preview").classList.add("hidden");
            formModale.querySelector(".photo-placeholder").style.display = "flex";

            // Ajoute dynamiquement la nouvelle image dans les deux galeries
            //ajouterProjetDansGalerie(newProjet);
            //ajouterProjetDansSite(newProjet);

            // Fermer la modale formulaire et rouvrir la modale galerie
            document.body.removeChild(formModale.closest(".form-overlay")); // Ferme la modale formulaire

            // Rester sur la modale galerie
            const modaleOverlay = document.querySelector(".modale-overlay");
            if (modaleOverlay) {
                modaleOverlay.style.display = "flex"; // Rouvre ou reste sur la modale galerie
                chargerImagesModale(); // Recharge les images pour inclure la nouvelle photo
            }

            ajouterProjetDansGalerie(projet);
            ajouterProjetDansSite(projet);

        } else {
            const errorText = await response.text();
            console.error("Erreur lors de l'ajout de la photo :", errorText);
            messageContainer.textContent = "Erreur lors de l'ajout de la photo.";
            messageContainer.classList.add("error");
        }
    } catch (error) {
        console.error("Erreur lors de l'ajout de la photo :", error);
        messageContainer.textContent = "Une erreur est survenue. Veuillez réessayer.";
        messageContainer.classList.add("error");
    }
}

//fonction affichant un nouveau projet directement dans la première modale
function ajouterProjetDansGalerie(projet) {
    const modaleGallery = document.querySelector(".modale-gallery");

    // Crée les éléments nécessaires pour afficher le projet
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";

    img.src = projet.imageUrl;
    img.alt = projet.title;
    figure.classList.add("gallery-item");

    deleteButton.classList.add("delete-button");
    deleteButton.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
    deleteButton.addEventListener("click", function (event) {
        event.preventDefault();
        supprimerPhoto(projet.id, figure);
    });

    // Ajoute l'image et le bouton de suppression à la figure
    figure.appendChild(img);
    figure.appendChild(deleteButton);

    // Ajoute la figure à la galerie
    modaleGallery.appendChild(figure);
}

//fonction affichant un nouveau projet directement dans la galerie principale du site web
function ajouterProjetDansSite(projet) {
    const gallery = document.querySelector(".gallery");

    // Crée les éléments nécessaires pour afficher le projet
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");

    img.src = projet.imageUrl;
    img.alt = projet.title;
    figcaption.textContent = projet.title;

    // Ajoute l'image et la légende à la figure
    figure.appendChild(img);
    figure.appendChild(figcaption);

    // Ajoute la figure à la galerie principale
    gallery.appendChild(figure);
}