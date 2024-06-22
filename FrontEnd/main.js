
///////////////////////////////////////////////////////////////////
//  Récupération des travaux via l'API et création des filtres  //
///////////////////////////////////////////////////////////////////

// 1. Initialisation des variables ************************************************************************************

const gallery = document.querySelector(".gallery");
let works = [];

// 2. Fonctions "getWorks" et "createGallery" pour récupérer et afficher les works et récréer une galerie ************************************************

const getWorks = async () => {
    try {

    const response = await fetch('http://localhost:5678/api/works');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    works = await response.json(); 
    console.log('Works after fetching:', works); // Affiche les works récupérés 

    // Appel de la fonction "createGallery pour afficher les travaux dans la galerie" avec les données works
    createGallery(works);
} catch (error) {
    console.error("Erreur lors de la récupération des travaux, error");
}
};
    

const createGallery = (works) => {
    gallery.innerHTML = '';  // Vider la galerie existante
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
};

getWorks();


// 3. Fonction updateGallery pour mettre à jour la galerie avec des travaux filtrés *********************************************************************

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

// 4. Fonction getFiltered pour récupérer les catégories et créer les boutons de filtres ****************************************************************************

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
    const allCategoriesButton = document.createElement('button');

    allCategoriesButton.textContent = 'Tous';
    allCategoriesButton.id = 'all-categories';
    categoriesMenu.appendChild(allCategoriesButton);

    // Ajout un gestionnaire d'événements pour le bouton "Tous les travaux"
    allCategoriesButton.addEventListener('click', () => {
    // Appel de la fonction updateGallery avec tous les travaux
    console.log('All button clicked', allCategoriesButton);

    updateGallery(works);
});


    // création des des boutons filtres dans le DOM
    categories.forEach(category => {
        const categoryElement = document.createElement('div')
        categoryElement.innerHTML = 
        `<button id="${category.id}"> ${category.name}</button>`;
        categoriesMenu.appendChild(categoryElement);
    
    // Ajout d'un gestionnaire d'événements pour filtrer la galerie par catégorie
    categoryElement.addEventListener('click', () => {
        const filteredWorks = works.filter(work => work.categoryId === category.id);
        updateGallery(filteredWorks);
        console.log('Filtered works:', filteredWorks); 
    
    // filter parcourt chaque élément de works.Pour chaque work, il vérifie si work.category est égal à category.id. Si cette condition est vraie, work est ajouté au nouveau tableau filteredWorks. Si la condition est fausse, work est ignoré. La fonction updateGallery est appelée avec filteredWorks comme argument. updateGallery prend ce tableau de travaux filtrés et met à jour le contenu de l'élément gallery pour afficher seulement ces travaux.
        });
    });
}
getFiltered();



////////////////////////////////////////////////////////////////////
// Création de la navbar dynamique au niveau de la page d'accueil //
////////////////////////////////////////////////////////////////////


// Vérifier si l'utilisateur est connecté , en vérifiant la présence du token dans le localStorage
const isLoggedIn = localStorage.getItem("token") !== null;
// const token =  localStorage.getItem("token");
// // Stockage du token dans le localStorage
// localStorage.setItem("token", token);
console.log("Token enregistré dans le localStorage:",localStorage.getItem("token"))



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

//////////////////////////////////////////////////////////////
// Modification du bouton "login" en "logout" en mode admin //
//////////////////////////////////////////////////////////////

const authLink = document.getElementById("authLink");

if (isLoggedIn) {
    authLink.textContent = "logout";
    authLink.href = "#"; //Empêche la navigation lors du clic sur logout
} else {
    authLink.textContent = "login";
    authLink.href = "file:///Users/nicolasmeyer/Desktop/Meyer_Nicolas_6_ArchitecteBluel_052024%20/FrontEnd/login.html";
}

authLink.addEventListener("click", (event) => {
    if (isLoggedIn) {
        event.preventDefault();
        localStorage.removeItem("token");
        authLink.textContent = "login";
        authLink.href = "file:///Users/nicolasmeyer/Desktop/Meyer_Nicolas_6_ArchitecteBluel_052024%20/FrontEnd/login.html"
        location.reload();
    }
});

//////////////////////////////////////////////////
// Suppression des boutons filtre en mode admin //
//////////////////////////////////////////////////

    // Sélection de la section des boutons filtres
    const filtersSection = document.querySelector(".categories-menu");

    // Vérification si l'utilisateur est connecté
    if (isLoggedIn) {
        // Si l'utilisateur est connecté, masquer la section des boutons filtres
        filtersSection.style.display = 'none';
    

    // Ajout d'une marge entre le titre "Mes projets" et la galerie
    const maMargeProjetTitleGalerieAdmin = document.querySelector("#portfolio h2");
    maMargeProjetTitleGalerieAdmin.style.marginBottom = '65px'; 

} else {
    // Si l'utilisateur n'est pas connecté, s'assurer que la marge est supprimée
    const maMargeProjetTitleGalerieAdmin = document.querySelector("#portfolio h2");
    maMargeProjetTitleGalerieAdmin.style.marginBottom = '0';
}


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
//    Création des modales vue "Galerie" et vue "Ajout photos"    //  
/////////////////////////////////////////////////////////////////////

// Sélection des éléments communs aux modales
const openModaleButton = document.getElementById("edit-button");
const addProjectButton = document.querySelector(".js-modale-projet");

// Sélection des éléments spécifiques à la vue "Galerie photo"
const modale = document.getElementById("modale");
// const modaleTitleGallery = document.querySelector("ModaleTitleGallery");
const projectsContainer = document.querySelector(".js-admin-projet");
const closeModaleButton1 = document.querySelector(".js-modale1-close");

// Sélection des éléments spécifiques à la vue "Ajout photos"
const modaleAddProjet = document.getElementById("modaleAddProjet");
// const modaleTitleAdd = document.querySelector(".ModaleTitleAdd");
const closeModaleButton2 = document.querySelector(".js-modale2-close");
const addPhotoFormElement = document.getElementById("addPhotoForm");


// Fonction "openModale" pour ouvrir la modale vue "Galerie photo"
const openModale = () => {
    modale.style.display = "flex";
    modale.setAttribute("aria-hidden", "false");  // L'élément est visible et accessible aux utilisateurs de lecteurs d'écran.
    console.log("Modale Galerie ouverte");
};
// Ecouteurs d'événements : ouverture de la modale vue "Galerie"
openModaleButton.addEventListener('click', openModale);

// Fonction "openAddPhotoModale" pour ouvrir la modale vue "Ajouter une photo"
const openAddPhotoModale = () => {
    modale.style.display = "none";
    modaleAddProjet.style.display = "flex";
    modaleAddProjet.setAttribute("aria-hidden", "false");
    console.log("Modale Ajout photo ouverte"); 
};

// Écouteurs d'événements : ouverture de la modale vue "Ajout photos"
addProjectButton.addEventListener("click", openAddPhotoModale);

// Fonction "closeModale" pour fermer les modale
const closeModale = () => {
    modale.style.display = "none";
    modaleAddProjet.style.display = "none";
    modale.setAttribute("aria-hidden", "true")
    modaleAddProjet.setAttribute("aria-hidden", "true");
    };

    
// Ecouteurs d'évènement : fermeture au bouton de la modale vue "Galerie"
closeModaleButton1.addEventListener('click', (event) => {
    event.preventDefault();
    closeModale();
});
// Ecouteurs d'évènement pour la fermeture de la modale "Galerie photo" lorsque l'utilisateur clique en dehors du contenu de la modale.
modale.addEventListener('click', (event) => {
    if (event.target === modale) {
        closeModale();
    }
});

// Écouteurs d'événements : fermeture au bouton de la modale vue "Ajout photos"
closeModaleButton2.addEventListener('click', (event) => {
    event.preventDefault();
    closeModale();
});
// Écouteurs d'événements pour la fermeture de la modale (Ajout photos) lorsque l'utilisateur clique en dehors du contenu de la modale.
    modaleAddProjet.addEventListener('click', (event) => {
        if (event.target === modaleAddProjet) {
            closeModale();
        }
    });

///////////////////////////////////////////////////
// Gestion dynamique de la modale "Galerie photo" 
//////////////////////////////////////////////////

// 1. Fonction "addPhotos": ajouter des photos dans la modale "Galerie photo"

    const addPhotos = (photos) => {
        projectsContainer.innerHTML = ''; // Vider le conteneur avant d'ajouter les nouvelles photos
        photos.forEach(photo => {
            const photoElement = document.createElement("div");
            photoElement.innerHTML = `<img src="${photo.imageUrl}" alt="${photo.title}">
            <div class="delete-icon">&times;</div>`;

        
            // Création de l'icone delete en dynamique
            const deleteIcon = document.createElement("i");
            deleteIcon.classList.add("fas", "fa-trash-can");
            

            // Fonction "deleteWork" pour supprimer un work via l'API
            const deleteWork = async(photoId) => {
                const response = await fetch (`http://localhost:5678/api/works/${photoId}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}` // Token d'identification
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            };
        
            // Création de la variable "index" pour mettre à jour la galerie avec le bon positionnement des photos supprimées
            const index = photos.findIndex(work => work.id === parseInt(photoId));
            if (index !== -1) {
                photos.splice(index, 1);
                createGallery(photos);
            }
        
            }; 
// Suppression des works coté serveur en cliquant sur l'icone Delete
deleteIcon.addEventListener("click", async () => {
    const photoId = photo.id;
    try {
        await deleteWork(photoId);
        console.log(`Le travail avec l'ID ${photoId} a été supprimé avec succès.`);
projectsContainer.removeChild(photoElement); // Supprime également l'élément HTML de la galerie
} catch (error) {
    console.error(error.message);
    }
});
              // Définition des éléments deleIcon et photoElement
              photoElement.appendChild(deleteIcon);
              projectsContainer.appendChild(photoElement);
        });
    };
 
// Initialisation de la page
const initializePage = async () => {
    addPhotos(works); // Appeler addPhotos après avoir récupéré les travaux
};
initializePage();


///////////////////////////////////////////////////
// Gestion dynamique de la modale "Ajout photos" 
//////////////////////////////////////////////////


// 1. Sélection du bouton pour ajouter un projet
const btnAddProject = document.querySelector(".js-modale2-projet");
btnAddProject.addEventListener("click", addPhotoForm);

const photoTitleInput = document.getElementById('photoTitle');
const photoCategoryInput = document.getElementById('photoCategory');


// Ajout des écouteurs d'événements aux champs "titre" et "catégorie"
photoTitleInput.addEventListener('input', checkInputs);
photoCategoryInput.addEventListener('input', checkInputs);

// Fonction pour vérifier les champs et mettre à jour la couleur du bouton en fonction
function checkInputs() {
    const photoTitle = photoTitleInput.value.trim();
    const photoCategory = photoCategoryInput.value.trim();

    if (photoTitle !== "" && (photoCategory === "1" || photoCategory === "2" || photoCategory === "3")) {
        btnAddProject.style.backgroundColor = "#1d6154";
    } else {
        btnAddProject.style.backgroundColor = ""; // Remettre à la couleur par défaut si les conditions ne sont pas remplies
    }
}

// 2. Chargement de l'image

const photoInput = document.getElementById('photoUrl');
const photoPreview = document.getElementById('photoPreview');

// Ajout d'un écouteur d'événement sur le changement de l'input de fichier
photoInput.addEventListener('change', function(event) {
    console.log("Contenu de photoInput :", photoInput.fileList);
    // Vérifier si un fichier a été sélectionné avant de tenter de le lire
    if (photoInput.files && photoInput.files[0]) {
      const reader = new FileReader();
  
      // Lorsque le lecteur a fini de lire le fichier, Cette propriété permet de définir une fonction de rappel qui sera exécutée lorsque le fichier aura été complètement lu.
      reader.onload = function(e) {
        photoPreview.src = e.target.result; // Définir l'aperçu de l'image avec les données du fichier, contient le contenu du fichier lu, qui est une URL de données dans ce cas.
        photoPreview.style.display = 'block'; // Afficher l'aperçu de l'image
      };
  
      // Lire le fichier en tant que URL de données
      reader.readAsDataURL(photoInput.files[0]);
    }
  }); 

// 3. Fonction "addPhotoForm" pour ajouter un projet
async function addPhotoForm(event) {
    event.preventDefault();

    const photoFile = document.getElementById('photoUrl').files[0];
    const photoTitle = document.getElementById('photoTitle').value;
    const photoCategory = document.getElementById('photoCategory').value;

    console.log('Photo File:', photoFile);
    console.log('Photo Title:', photoTitle);
    console.log('Photo Category:', photoCategory);

if (photoTitle === "" || photoCategory === ""|| photoFile === undefined) {
    alert("Merci de remplir tous les champs");
    return;
 } else if (photoCategory !== "1" && photoCategory !== "2" && photoCategory !== "3") {
    alert("Merci de spécifier une catégorie : 1, 2 ou 3");
    return;
 } else {

    try { // Si toutes les vérifications sont réussies, création d'un objet FormData contenant les données du formulaire
        const formData = new FormData();
        formData.append('image', photoFile);
        formData.append('title', photoTitle);
        formData.append('category', photoCategory);

        console.log('FormData object created:', formData);

        const response = await fetch("http://localhost:5678/api/works", {
            method : "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }, // Utilisation du token d'authentification depuis localStorage
            body: formData,
        });

        if (response.ok) {
            const responseData = await response.json();
            works.push(responseData);
            // Ajout de responseData à la fin du tableau works
            console.log("Photo uploadée avec succès", responseData);
            // Ajouter la nouvelle photo à la galerie
            addPhotos(works);
            createGallery(works);

            // Réinitialiser le formulaire aprés soumission
            addPhotoFormElement.reset();

    
        } else {
            const errorData = await response.json();
            console.log("Erreur lors de l'upload de la photo:", errorData);
        }
    } catch (error) {
        console.error("Erreur lors de l'upload de la photo:", error);
    };
};
};



// Retour à la page d'accueil au clic de la flêche returnLink

const returnLink = document.querySelector(".js-modale-return");

returnLink.addEventListener('click', function(event) {
    event.preventDefault();

    console.log('Flèche de retour cliquée');

    window.location.href = 'file:///Users/nicolasmeyer/Desktop/Meyer_Nicolas_6_ArchitecteBluel_052024%20/FrontEnd/index.html'; 
});
