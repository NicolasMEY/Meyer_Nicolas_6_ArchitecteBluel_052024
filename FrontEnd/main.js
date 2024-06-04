
///////////////////////////////////////////////////////////////////
// Récupération des travaux via l'API et création des filtres    //
///////////////////////////////////////////////////////////////////


// 1. Initialisation des variables dans le scope globale ********************************************

const gallery = document.querySelector(".gallery");
let works = [];


// 2. Fonction pour récupérer et afficher les travaux (works) **********************************


// La fonction déclarée et asynchrone getWorks envoie une requête HTTP GET (avec fetch) à l'URL spécifiée, attend la réponse, vérifie si la réponse est correcte, et en cas d'erreur, lève une exception avec un message d'erreur approprié. 
// L'utilisation de await avant fetch signifie que la fonction va attendre que la promesse soit résolue avant de continuer. Cela signifie que le code attend la réponse de l'API,
// Le nom response utilisé dans ce contexte n'est pas choisi au hasard. Il est communément utilisé pour représenter l'objet retourné par la fonction fetch() lorsqu'elle effectue une requête HTTP. 


const getWorks = async () => {
    const response = await fetch('http://localhost:5678/api/works');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // la variable works contiendra les données de la réponse de l'API au format JSON.
    works = await response.json(); 
    // pas besoin de définir la variable works
    console.log('Works after fetching:', works); // Affiche les travaux récupérés dans la console


// permet de recréer une gallerie en fonction des choix, genre de filtre sur la modale
    // const createGallery = (works) => {
    //     gallery.innerHTML = ''; // Vider la galerie existante
    // }

    works.forEach (work => {
        console.log('Processing work:', work);
        const workElement = document.createElement('div');
        workElement.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}">
            <div class="work-info">
                <figcaption>${work.title}</figcaption>
            </div> `;
        gallery.appendChild(workElement);
    });
    // Ajouter des photos à la galerie au chargement de la page
// addPhotos(works);
}



// 3. Fonction pour récupérer les catégories et créer les boutons de filtres **************

const getFiltered = async () => {
    const response = await fetch ('http://localhost:5678/api/categories')
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
 
    const categories = await response.json();
    console.log('Categories:', categories);


    // initialisation de la variables pour les boutons par catégories
    const categoriesMenu = document.querySelector('.categories-menu');



    
    // Initialisation de la variable pour le bouton "Tous les travaux"
    // const allCategoriesButton = document.getElementById('all-categories');
    const allCategoriesButton = document.createElement('button');
    allCategoriesButton.textContent = 'Tous';
    allCategoriesButton.id = 'all-categories';
    categoriesMenu.appendChild(allCategoriesButton);


    // Ajouter un gestionnaire d'événements pour le clic sur le bouton "Tous les travaux"
    allCategoriesButton.addEventListener('click', () => {
    // Appeler la fonction updateGallery avec tous les travaux
    console.log('All button clicked', allCategoriesButton);
    updateGallery(works);

// categoriesMenu.appendChild(allCategoriesButton);
});

categories.forEach(category => {
    const categoryElement = document.createElement('div')
    categoryElement.innerHTML = 
    `<button id="${category.id}"> ${category.name}</button>`;
    categoriesMenu.appendChild(categoryElement);
    
    

// Ajoutez un gestionnaire d'événements pour filtrer la galerie par catégorie
categoryElement.addEventListener('click', () => {
    // Exemple de logique pour filtrer les travaux
    console.log('Category button clicked:', category.name); 
    console.log('Category ID:', category.id); // Affiche l'ID de la catégorie
    console.log('Works:', works); // Affiche tous les travaux pour vérifier leur structure
    const filteredWorks = works.filter(work => work.categoryId === category.id);
    updateGallery(filteredWorks);
    console.log('Filtered works:', filteredWorks); 
    
    
    
// filter parcourt chaque élément de works.Pour chaque work, il vérifie si work.category est égal à category.id.Si cette condition est vraie, work est ajouté au nouveau tableau filteredWorks.Si la condition est fausse, work est ignoré.

// La fonction updateGallery est appelée avec filteredWorks comme argument.
// updateGallery prend ce tableau de travaux filtrés et met à jour le contenu de l'élément gallery pour afficher seulement ces travaux.
        });
    });
}


// 4. Fonction pour mettre à jour la galerie avec des travaux filtrés ******************


// Fonction updateGallery :
// Utilise la variable gallery existante pour mettre à jour le contenu de la galerie avec les travaux filtrés.
// filteredWorks est une convention courante et descriptive pour nommer des variables qui contiennent des données filtrées.La méthode filter est utilisée pour créer un nouveau tableau contenant uniquement les éléments qui satisfont une condition spécifique.

const updateGallery = (filteredWorks) => {
    gallery.innerHTML = ''; // Vider la galerie existante
    filteredWorks.forEach(work => {
        const workElement = document.createElement('div');
        workElement.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}">
            <div class="work-info">
                <figcaption>${work.title}</figcaption>
            </div>
        `;
        gallery.appendChild(workElement);
    });
    
}

//     workElement.innerHTML définit le contenu HTML intérieur du div créé
//     La chaîne de caractères entre les backticks (`) est un template literal qui permet d'inclure des expressions JavaScript en utilisant ${expression}.
//     Il boucle sur chaque élément du tableau works.
// Pour chaque élément work :
// Il crée un nouvel élément div.
// Il définit le contenu HTML de ce div pour inclure une image et une légende utilisant les propriétés imageUrl et title de l'élément work.
// Il ajoute ce div au conteneur gallery dans le DOM.



// 5. Appels des fonctions pour initialiser l'affichage ********************************


// // Appeler la fonction getWorks pour récupérer les travaux et les afficher initialement
// getWorks().then(() => {
// // Appeler getFiltered pour générer le menu des catégories après avoir récupéré les travaux
// getFiltered();
// });







///////////////////////////////////////////////////////////////////
// Création de la navbar dynamique au niveau de la page d'accueil//
///////////////////////////////////////////////////////////////////

// Vérifier si l'utilisateur est connecté , en vérifiant la présence du token dans le localStorage
const isLoggedIn = localStorage.getItem("token") !== null;
console.log(localStorage.getItem("token"))


// Après avoir reçu le token du serveur en réponse à la soumission du formulaire de connexion
const token = "votre_token"; 

// Stockage du token dans le localStorage
localStorage.setItem("token", token);

// création de la navbar en JavaScript
console.log("isLoggedIn:", isLoggedIn);
function createNavbar(isLoggedIn) {
    // créer les élements de la navbar
    const navbar = document.createElement("div")
    navbar.classList.add("navbar");
  
    const logo = document.createElement("i")
    logo.classList.add("fas", "fa-pen-to-square");
  
    const modeEdition = document.createElement("span");
    modeEdition.textContent = "Mode édition";
  
  // Ajouter les élements de la navbar
  navbar.appendChild(logo);
  navbar.appendChild(modeEdition);
  
  if (isLoggedIn) {
    navbar.style.display = "flex";
    console.log("Navbar should be visible");
  } else {
    navbar.style.display = "none"
    console.log("Navbar should be hidden");
  }
  
  // Retourner la navbar créée
  return navbar;
}
  
  // Sélectionner le conteneur de la navbar
  const navbarContainer = document.getElementById("navbarContainer");
  
  // Créer la navbar et l'ajouter au conteneur
  navbarContainer.appendChild(createNavbar(isLoggedIn));


/////////////////////////////////////////////////
// Suppression des boutons filtre en mode admin //
/////////////////////////////////////////////////

    // Sélection de la section des boutons filtres
    const filtersSection = document.querySelector(".categories-menu");

    // Vérification si l'utilisateur est connecté
    if (isLoggedIn) {
        // Si l'utilisateur est connecté, masquer la section des boutons filtres
        filtersSection.style.display = 'none';
    }

    // Ajout d'une marge entre le titre "Mes projets" et la galerie
    const maMargeProjetTitleGalerieAdmin = document.querySelector("#portfolio h2");
    maMargeProjetTitleGalerieAdmin.style.marginBottom = '65px'; 





///////////////////////////////////////////////////////////////////////
// Création du bouton "modifier" sur la page d'accueil en mode admin //  
///////////////////////////////////////////////////////////////////////

  // créer le bouton modifier en mode édition
  if (isLoggedIn) {
    const editButton = document.createElement("button");
    editButton.id = "edit-button";
    editButton.classList.add("edit-mode-button");

    // ajouter l'icone du bouton
    const editIcon = document.createElement("i");
    editIcon.classList.add("fas", "fa-pen-to-square");

    // Ajouter l'icône à gauche du texte du bouton "Modifier"
    editButton.appendChild(editIcon);

    // ajouter le texte du bouton
    const buttonText = document.createTextNode("Modifier");
    editButton.appendChild(buttonText);

    // positionner le bouton à la droite du titre h2 "mes projets"
    const mesProjetsTitle = document.querySelector("#portfolio h2");
    mesProjetsTitle.style.display = "flex";
    mesProjetsTitle.style.justifyContent = "center";
    mesProjetsTitle.appendChild(editButton);
  }







/////////////////////////////////////////////////////////////////////
//    Création de la modale vue "Galerie" et vue "Ajout photos"    //  
/////////////////////////////////////////////////////////////////////

    // Sélection des éléments communs aux modales
    
    const openModaleButton = document.getElementById("edit-button");
    const closeModaleButton = document.querySelector(".js-modale-close");
    const addProjectButton = document.querySelector(".js-modale-projet");
    // Sélection des éléments spécifiques à la vue "Galerie photo"
    const modale = document.getElementById("modale");
    const modaleTitleGallery = document.querySelector("ModaleTitleGallery");
    const projectsContainer = document.querySelector(".js-admin-projets");
    // Sélection des éléments spécifiques à la vue "Ajout photos"
    const modaleAddProjet = document.getElementById("modaleAddProjet");
    const modaleTitleAdd = document.querySelector(".ModaleTitleAdd");
    const addPhotoForm = document.querySelector("#addPhotoForm");


    // Fonction pour ouvrir la modale vue "Galerie photo"
    const openModale = () => {
        modale.style.display = "flex";
        projectsContainer.styl.display = "flex"
        modaleTitleGallery.style.display = "flex";
        modale.setAttribute("aria-hidden", "false");  
    };

    // Fonction pour ouvrir la modale vue "Ajouter une photo"
    const openAddPhotoModale = () => {
        modale.style.display = "none";
        modaleAddProjet.style.display = "flex";
        modaleTitleAdd.style.display = "flex";
        addPhotoForm.style.display = "flex";
        modaleAddProjet.setAttribute("aria-hidden", "false");
    };

    // Fonction pour fermer la modale
    const closeModale = () => {
        modale.style.display = "none";
        modaleAddProjet.style.display = "none";
        modale.setAttribute("aria-hidden", "true")
        modaleAddProjet.setAttribute("aria-hidden", "true");
        addPhotoForm.style.display = "none"; // Réinitialise le formulaire pour la prochaine ouverture
    };

    // Fermeture de la modale lorsque l'utilisateur clique en dehors du contenu de la modale.
    modale.addEventListener('click', (event) => {
        if (event.target === modale) {
            closeModale();
        }
        if (event.target === modaleAddProjet) {
            closeModale();
        }
    });

    // Fonction pour ajouter des photos dans la galerie
    const addPhotos = (photos) => {
        photos.forEach(photo => {
            const photoElement = document.createElement("div");
            photoElement.innerHTML = `<img src="${photo.imageUrl}" alt="${photo.title}">
            <div class="delete-icon">&times;</div>`;
            

///////////////////////////////////////////////////////////////////////////:

    // Création de l'icone Delete en dynamique
    const deleteIcon = document.createElement("i")
    deleteIcon.classList.add("fas", "fa-trash-can");
    // deleteIcon.style.position = "absolute";

    // Suppression VISUELLE html de la photo en cliquant sur l'icone Delete sans supprimer les données coté serveur
    deleteIcon.addEventListener('click', () => {
        projectsContainer.removeChild(photoElement);
    });
            photoElement.appendChild(deleteIcon);
            projectsContainer.appendChild(photoElement);
        });
};

// Fonction pour supprimer un work via l'API
/* const deleteWork = async(photoId) => {
    const response = await fetch (`http://localhost:5678/api/works/${photoId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
    };
}

// Appel de la fonction pour supprimer les works coté serveur
deleteIcon.addEventListener("click", async () => {
    const photoId = photo.id;
    try {
        await deleteWork(photoId);
        console.log(`Le travail avec l'ID ${photoId} a été supprimé avec succès.`);
projectsContainer.removeChild(photoElement); // Supprimez également l'élément HTML de la galerie
} catch (error) {
    console.error(error.message);
    }
});
*/


// Écouteurs d'événements : ouverture de la modale vue "Galerie"
openModaleButton.addEventListener('click', openModale);
closeModaleButton.addEventListener('click', (event) => {
    event.preventDefault();
    closeModale();
});
// Écouteurs d'événements : ouverture de la modale vue "Ajout photos"
addProjectButton.addEventListener("click", openAddPhotoModale);
closeModaleButton.addEventListener('click', (event) => {
    event.preventDefault();
    closeModale();
});



// Initialisation de la page
const initializePage = async () => {
    await getWorks();
    await getFiltered();
    addPhotos(works); // Appeler addPhotos après avoir récupéré les travaux
};
initializePage();







// en cliquant sur le bouton ajouter photo de la première modale : 
// "modale-wrapper" est maintenu, 

// "addphotoform" qui apparait, 

// <h2>Galerie photo</h2> et
// <div class="galleryMod js-admin-projets"></div> disparaissent




  

