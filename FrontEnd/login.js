// Définition de l'URL de l'API pour la connexion
const LOGIN_URL = "http://localhost:5678/api/users/login";

// Ajout d'un événement de soumission au formulaire de connexion
document.getElementById("login-form").addEventListener("submit", async function (event) {
    event.preventDefault(); 

    // Récupère les valeurs saisies dans les champs email et mot de passe
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        // Envoie une requête POST à l'API pour effectuer une connexion
        const response = await fetch(LOGIN_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" }, // Indique que le corps de la requête est au format JSON
            body: JSON.stringify({ email, password }) // Convertit les données saisies en chaîne JSON
        });

        if (response.ok) {
            const data = await response.json(); // Récupère les données JSON envoyées par l'API
            localStorage.setItem("token", data.token); 
            window.location.href = "index.html"; 
        } else {
            afficherMessageErreur("Email ou mot de passe incorrect.");
        }
    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        afficherMessageErreur("Une erreur est survenue. Veuillez réessayer plus tard.");
    }
});

// Fonction pour afficher un message d'erreur à l'utilisateur
function afficherMessageErreur(message) {
    let messageErreur = document.getElementById("error-message");
    messageErreur.style.display = "block"; // Rend le message visible
    messageErreur.textContent = message;
}