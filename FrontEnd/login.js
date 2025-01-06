document.getElementById("login-form").addEventListener("submit", async function (event) {
    event.preventDefault(); 
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
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

function afficherMessageErreur(message) {
    let messageErreur = document.getElementById("error-message");
    messageErreur.style.display = "block";
    messageErreur.textContent = message;
}