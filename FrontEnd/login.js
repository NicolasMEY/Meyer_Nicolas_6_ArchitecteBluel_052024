// 1. Initialisation des variables dans le scope globale 
const form = document.querySelector("#login-form");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
console.log(password, email, form);


// 2. Ajout d'un écouteur d'événements sur le formulaire et prévention de l'action par défaut :

form.addEventListener("submit", async (event) => {

    event.preventDefault(); // Empêche l'envoi du formulaire par défaut qui est de recharger la page lorsqu'il est soumis.
    // Les fonctions callback permettent de passer des fonctions en tant qu'arguments pour être exécutées ultérieurement, ce qui est particulièrement utile pour gérer des opérations asynchrones. Elles jouent un rôle crucial dans la gestion des événements et des opérations asynchrones 
  

// 3. Envoi de la requête HTTP POST :
  
    try {
      const response = await fetch("http://localhost:5678/api/users/login", { 
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: email.value, password: password.value })
      });
    //   cela signifie que vous prenez un objet JavaScript (dans ce cas, un objet contenant les valeurs de l'email et du mot de passe) et vous le transformez en une chaîne JSON.Cela est souvent utilisé lors de l'envoi de données à un serveur via une requête HTTP, où le corps de la requête doit être une chaîne JSON.

// 4. Traitement de la réponse :

      if (response.ok) {
        const data = await response.json()
        console.log("Token récupéré de la réponse :", data.token);
        localStorage.setItem("token", data.token);
        console.log("Token stocké dans le localStorage :", localStorage.getItem("token"));
        window.location.href = "./index.html"; // Redirige vers la page d'accueil en cas de succès
      } else {
        document.getElementById("error-message").textContent = "Informations d'identification incorrectes.";
        document.getElementById("error-message").style = "display: flex;justify-content: center; margin-bottom: 35px; color: red; font-weight: bold;";
      }
// 5. Gestion des erreurs :

    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      // Gérer l'erreur
    }
  });

//   try {
//     // Bloc de code à tester pour des erreurs
//   } catch (error) {
//     // Bloc de code à exécuter si une erreur se produit
//   }





