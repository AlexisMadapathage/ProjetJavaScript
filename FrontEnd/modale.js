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
        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }
        const travaux = await response.json();

        const modaleGallery = document.querySelector(".modale-gallery");
        console.log("Avant vidage :", modaleGallery.innerHTML); // Log avant vidage
        modaleGallery.innerHTML = ""; // Vide le conteneur avant d'ajouter les images
        console.log("Après vidage :", modaleGallery.innerHTML); // Log après vidage

        travaux.forEach(travail => {
            const figure = document.createElement("figure");
            const img = document.createElement("img");
            const deleteButton = document.createElement("button");

            img.src = travail.imageUrl;
            img.alt = travail.title;
            figure.classList.add("gallery-item");

            deleteButton.classList.add("delete-button");
            deleteButton.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
            deleteButton.addEventListener("click", () => supprimerPhoto(travail.id, figure));

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
function supprimerPhoto(photoId, figureElement) {
    fetch("http://localhost:5678/api/works/" + photoId, {
        method: "DELETE",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        }
    })

        .then(function (response) {
            if (response.ok) {
                console.log("Photo supprimée avec succès !");
                figureElement.remove(); // Supprime l'élément du DOM
            } else {
                console.error("Erreur lors de la suppression de la photo :", response.status);
                alert("Erreur lors de la suppression de la photo.");
            }
        })
        .catch(function (error) {
            console.error("Erreur lors de la requête de suppression :", error);
            alert("Une erreur est survenue. Veuillez réessayer.");
        });
}

// Initialisation à la charge de la page
document.addEventListener("DOMContentLoaded", () => {
    const btnModifier = document.getElementById("modifier-button");

    // Création de la modale uniquement une fois
    creerModale();

    btnModifier.addEventListener("click", () => {
        afficherModale();
    });
});

// Fonction principale pour créer la première modale 
function creerModale() {
    // Création des éléments principaux
    const modaleOverlay = document.createElement("div");
    const modale = document.createElement("div");
    const closeButton = document.createElement("span");
    const modaleContent = document.createElement("div");
    const galleryView = document.createElement("div");

    // Ajout des classes
    modaleOverlay.classList.add("modale-overlay");
    modale.classList.add("modale");
    closeButton.classList.add("close-button");
    modaleContent.classList.add("modale-content");
    galleryView.classList.add("gallery-view", "active");

    // Contenu des éléments HTML
    closeButton.innerHTML = "&times;"; // Symbole de fermeture
    galleryView.innerHTML = `
    <h2>Galerie photo</h2>
    <div class="modale-gallery"></div> <!-- Conteneur pour les images -->
    <div class="trait"></div>
    <button class="btn-ajouter-photo">Ajouter une photo</button>
`;

    // Organisation de la structure
    modaleContent.appendChild(galleryView); // Vue galerie
    modale.appendChild(closeButton); // Bouton de fermeture
    modale.appendChild(modaleContent); // Contenu de la modale
    modaleOverlay.appendChild(modale); // Ajout de la modale à l'overlay
    document.body.appendChild(modaleOverlay); // Ajout au DOM

    // Gestion de la fermeture de la modale
    closeButton.addEventListener("click", fermerModale);
    modaleOverlay.addEventListener("click", (event) => {
        if (event.target === modaleOverlay && !event.target.closest(".modale")) {
            fermerModale();
        }
    });

    // Gestion de l'ouverture de la deuxième modale (formulaire)
    const btnAjouterPhoto = modale.querySelector(".btn-ajouter-photo");
    if (btnAjouterPhoto) {
        console.log("Bouton 'Ajouter une photo' trouvée :", btnAjouterPhoto);
        btnAjouterPhoto.addEventListener("click", () => {
            console.log("Clic sur Ajouter une photo");
            afficherFormulaireModale();
        });
    } else {
        console.error("Bouton 'Ajouter une photo' non trouvé.")
    }
}

// Fonction pour afficher la deuxième modale (formulaire d'ajout de photo)
function afficherFormulaireModale() {
    // Création des éléments principaux 
    console.log("La fonction afficherFormulaireModale est appelée");
    const formOverlay = document.createElement("div");
    const formModale = document.createElement("div");
    const backButton = document.createElement("span");
    const closeButton = document.createElement("span");
    const formContent = document.createElement("div");

    // Ajout des classes
    formOverlay.classList.add("form-overlay");
    formModale.classList.add("form-modale");
    backButton.classList.add("back-button");
    closeButton.classList.add("close-button");
    formContent.classList.add("form-content");

    // Contenu des éléments HTML
    backButton.innerHTML = `<i class="fa-solid fa-arrow-left"></i>`;
    closeButton.innerHTML = "&times;";
    formContent.innerHTML = `
        <h2>Ajout photo</h2>
        <form id="ajout-photo-form" class="ajout-photo-form">
        <div class="photo-upload">
        <label for"photo-input" class="photo-label">
        <span class ="photo-placeholder">
            <i class="fa-regular fa-image"></i>
            <span class="photo-text">+ Ajouter photo</span>
        </span>
            <input type="file" id="photo-input" accept="image/*" required />
            </label>
            <div class="photo-preview hidden">
                <img id="photo-preview-img" alt="Aperçu de l'image" />
            </div>
            <p class="photo-info">jpg, png, : 4mo max</p>
        </div>
        <div class="form-group">
                <label for="photo-title">Titre</label>
                <input type="text" id="photo-title" placeholder="" required />
        </div>
        <div class="form-group">
                <label for="photo-category">Catégorie</label>
                <select id="photo-category" required>
                </select>
            </div>
        <div class="trait-form"></div>
        <div class="message-container"></div>
            <button type="submit" class="btn-valider-photo">Valider</button>
        </form>
    `;

    const photoInput = formContent.querySelector("#photo-input");
    const photoPlaceholder = formContent.querySelector(".photo-placeholder");
    const photoPreviewContainer = formContent.querySelector(".photo-preview");
    const photoPreviewImg = formContent.querySelector("#photo-preview-img");

    // Écouteur d'événement pour afficher l'aperçu de l'image sélectionnée
    photoInput.addEventListener("change", () => {
        const file = photoInput.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                photoPreviewImg.src = event.target.result; // Charge l'image dans l'élément <img>
                photoPlaceholder.style.display = "none"; // Masque le placeholder et l'input
                photoInput.style.display = "none";
                photoPreviewContainer.classList.remove("hidden"); // Affiche le conteneur de l'aperçu
            };
            reader.readAsDataURL(file); // Lit le fichier sélectionné
        } else {
            // Si aucun fichier n’est sélectionné, on réaffiche le placeholder
            photoPlaceholder.style.display = "flex";
            photoInput.style.display = "block";
            photoPreviewContainer.classList.add("hidden");
        }
    });

    // Organisation de la strucure 
    formModale.appendChild(backButton);
    formModale.appendChild(closeButton);
    formModale.appendChild(formContent);
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

    // Ajout des catégories dans le menu déroulant
    const categories = [
        { id: 0, name: "-- Tous --" },
        { id: 1, name: "Objets" },
        { id: 2, name: "Appartements" },
        { id: 3, name: "Hotels & Restaurants" },
    ];
    const categorySelect = formContent.querySelector("#photo-category");
    categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;

        if (category.name === "Tous") {
            option.selected = true;
            option.disabled = true;
        }

        categorySelect.appendChild(option);
    });


    // Gestion de la soumission du formulaire
    const form = formContent.querySelector("#ajout-photo-form");
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        console.log("Formulaire soumis");
        await ajouterPhoto();
        document.body.removeChild(formOverlay);
        chargerImagesModale();
    });
}

// Fonction pour ajouter une photo (API)
async function ajouterPhoto() {
    const photoInput = document.getElementById("photo-input");
    const titleInput = document.getElementById("photo-title");
    const categorySelect = document.getElementById("photo-category");
    const messageContainer = document.querySelector(".message-container");

    // Réinitialise le message avant chaque soumission
    messageContainer.textContent = "";
    messageContainer.classList.remove("success", "error");

    if (!photoInput.files[0] || !titleInput.value || !categorySelect.value) {
        messageContainer.textContent = "Veuillez remplir tous les champs du formulaire.";
        messageContainer.classList.add("error");
        return;
    }

    const formData = new FormData();
    formData.append("image", photoInput.files[0]);
    formData.append("title", titleInput.value);
    formData.append("category", categorySelect.value);

    try {
        const response = await fetch(URL, {
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
            document.getElementById("ajout-photo-form").reset();
            document.querySelector(".photo-preview").classList.add("hidden");
            document.querySelector(".photo-placeholder").style.display = "flex";

            // Ajoute dynamiquement la nouvelle image dans la galerie
            ajouterProjetDansGalerie(newProjet); // Appelle une fonction pour mettre à jour le DOM

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

function ajouterProjetDansGalerie(projet) {
    const modaleGallery = document.querySelector(".modale-gallery");

    // Crée les éléments nécessaires pour afficher le projet
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const deleteButton = document.createElement("button");

    img.src = projet.imageUrl; // URL de l'image du projet
    img.alt = projet.title;    // Texte alternatif
    figure.classList.add("gallery-item");

    deleteButton.classList.add("delete-button");
    deleteButton.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
    deleteButton.addEventListener("click", () => supprimerPhoto(projet.id, figure));

    // Ajoute l'image et le bouton de suppression à la figure
    figure.appendChild(img);
    figure.appendChild(deleteButton);

    // Ajoute la figure à la galerie
    modaleGallery.appendChild(figure);
}