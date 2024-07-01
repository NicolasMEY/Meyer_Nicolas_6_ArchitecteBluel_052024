
/////////////////////////////////////////////////////////////////
//  RECUPERATION DES TRAVAUX VIA L'API & CREATION DES FILTRES 
/////////////////////////////////////////////////////////////////

// 1. Initialisation des variables

const gallery = document.querySelector(".gallery");
let works = [];
let categories = [];

// 2. Fonctions "getWorks" pour récupérer les works

const getWorks = async () => {
    try {

    const response = await fetch('http://localhost:5678/api/works');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    works = await response.json(); 
    console.log('Works after fetching:', works); // Affiche les works récupérés 

    // Appel de la fonction "createGallery pour afficher les travaux dans la galerie" avec les données works ainsi que la galerie de la modale 1
    createGallery(works);
    addPhotos(works)
} catch (error) {
    console.error("Erreur lors de la récupération des travaux, error");
}
};


// 3. Fonctions "getCategories" pour récupérer les catégories

const getCategories = async () => {
    const response = await fetch('http://localhost:5678/api/categories')
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    categories = await response.json();
    console.log('Categories:', categories);
    // Appel de selectCategories après avoir récupéré les catégories
    selectCategories();
}

// 3.2 Fonctions "selectCategories" pour afficher les catégories dans l'input de la modale 2
const selectCategories = () => {
    const photoCategory = document.getElementById('photoCategory');
    photoCategory.innerHTML = '';

// 3.3 Création de l'option "choisissez une catégorie"
const defaultOption = document.createElement('option');
defaultOption.value = '';
defaultOption.textContent = 'Choisissez une catégorie';
photoCategory.appendChild(defaultOption);

// 3.4 Ajout des autres catégories récupérées vie l'API
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        photoCategory.appendChild(option);
    });
}

// Sélection de l'élément select
const photoCategorySelect = document.getElementById('photoCategory');

// Écouter l'événement de changement de valeur
photoCategorySelect.addEventListener('change', function() {
    if (this.value !== '') {
        this.classList.add('open'); // Ajouter la classe 'open' lorsque le select est ouvert
    } else {
        this.classList.remove('open'); // Retirer la classe 'open' lorsque le select est fermé
    }
});
getCategories();

// 4. Fonctions "createGallery" pour afficher les works et récréer une galerie 

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

// 5. Fonction updateGallery pour mettre à jour la galerie avec des travaux filtrés 

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

// 6. Fonction getFiltered pour récupérer les catégories et créer les boutons filtre 

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

    // création des boutons filtres dans le DOM
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
        });
    });
}
getFiltered();



//////////////////////////////////////////////////////////////////////
// CREATION DE LA NAVBAR EN DYNAMIQUE AU NIVEAU DE LA PAGE D'ACCUEIL
//////////////////////////////////////////////////////////////////////

// Vérifier si l'utilisateur est connecté , en vérifiant la présence du token dans le localStorage
const isLoggedIn = localStorage.getItem("token") !== null;
//const token =  localStorage.getItem("token");

// // Stockage du token dans le localStorage
//localStorage.setItem("token", token);
console.log("Token enregistré dans le localStorage:",localStorage.getItem("token"))



// création de la navbar en JavaScript
console.log("isLoggedIn:", isLoggedIn);
function createNavbar(isLoggedIn) {

    // créer les élements div, i et span de la navbar
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



///////////////////////////////////
//  MODIFICATIONS EN MODE ADMIN
///////////////////////////////////


// 1. Modification du bouton "login" en "logout" en mode admin

const authLink = document.getElementById("authLink");

if (isLoggedIn) {
    authLink.textContent = "logout";
    authLink.href = "#"; //Empêche la navigation lors du clic sur logout
} else {
    authLink.textContent = "login";
    authLink.href = "login.html";
}

authLink.addEventListener("click", (event) => {
    if (isLoggedIn) {
        event.preventDefault();
        localStorage.removeItem("token");
        authLink.textContent = "login";
        authLink.href = "login.html"
        location.reload();
    }
});


// 2. Suppression des boutons filtre en mode admin 

    // Sélection de la section des boutons filtres
    const filtersSection = document.querySelector(".categories-menu");

    // Vérification si l'utilisateur est connecté et le cas échéant >>> masquer la section des boutons filtre
    if (isLoggedIn) {
        filtersSection.style.display = 'none';
    
    // Ajout d'une marge entre le titre "Mes projets" et la galerie
    const maMargeProjetTitleGalerieAdmin = document.querySelector("#portfolio h2");
    maMargeProjetTitleGalerieAdmin.style.marginBottom = '65px'; 

} else {
    // Si l'utilisateur n'est pas connecté, s'assurer que la marge est supprimée
    const maMargeProjetTitleGalerieAdmin = document.querySelector("#portfolio h2");
    maMargeProjetTitleGalerieAdmin.style.marginBottom = '0';
}



// 3. Création du bouton "modifier" sur la page d'accueil en mode admin

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



////////////////////////////////////////////////////////////////////
//    CREATION DES MODALES 1 VUE "GALERIE" & 2 VUE "AJOUT PHOTOS"   
////////////////////////////////////////////////////////////////////


// Sélection des éléments communs aux modales
const openModaleButton = document.getElementById("edit-button");
const addProjectButton = document.querySelector(".js-modale-projet");

// Sélection des éléments spécifiques à la vue "Galerie photo"
const modale = document.getElementById("modale");
const projectsContainer = document.querySelector(".js-admin-projet");
const closeModaleButton1 = document.querySelector(".js-modale1-close");

// Sélection des éléments spécifiques à la vue "Ajout photos"
const modaleAddProjet = document.getElementById("modaleAddProjet");
const closeModaleButton2 = document.querySelector(".js-modale2-close");
const addPhotoFormElement = document.getElementById("addPhotoForm");

// 1. Ouverture des modales

// Fonction "openModale" pour ouvrir la modale 1 vue "Galerie photo"

const openModale = () => {
    modale.style.display = "flex";
    modale.setAttribute("aria-hidden", "false");  // L'élément est visible et accessible aux utilisateurs de lecteurs d'écran.
    console.log("Modale Galerie ouverte");
};
// Ecouteurs d'événements : ouverture de la modale vue "Galerie"
openModaleButton.addEventListener('click', openModale);


// Fonction "openAddPhotoModale" pour ouvrir la modale 2 vue "Ajout photos"

const openAddPhotoModale = () => {
    modale.style.display = "none";
    modaleAddProjet.style.display = "flex";
    modaleAddProjet.setAttribute("aria-hidden", "false");
    console.log("Modale Ajout photo ouverte"); 
};
// Écouteurs d'événements : ouverture de la modale 2 vue "Ajout photos"
addProjectButton.addEventListener("click", openAddPhotoModale);


// 2. fermeture des modales

// Fonction "closeModale" pour fermer les modale
const closeModale = () => {
    modale.style.display = "none";
    modaleAddProjet.style.display = "none";
    modale.setAttribute("aria-hidden", "true")
    modaleAddProjet.setAttribute("aria-hidden", "true");
    };

    
// Ecouteurs d'évènement : fermeture au bouton de la modale 1 vue "Galerie"
closeModaleButton1.addEventListener('click', (event) => {
    event.preventDefault();
    closeModale();
});
// Ecouteurs d'évènement pour la fermeture lorsque l'utilisateur clique en dehors du contenu de la modale.
modale.addEventListener('click', (event) => {
    if (event.target === modale) {
        closeModale();
    }
});


// Réinitialiser le formulaire lors de la fermeture de la modale 2 avec la fonction resetFormAndUI
function resetFormAndUI() {
    addPhotoFormElement.reset(); 
    photoPreview.src = '#';
    photoPreview.style.display = 'none';
    document.querySelector('.form-group-photo i') .style.display = 'block'; // Masquer l'icone de l'appareil photo
    document.querySelector('.form-group-photo label') .style.display = 'flex';// Masquer le texte "Ajouter une photo"
    document.querySelector('.form-group-photo p') .style.display = 'block';// Supprimer la bordure de la zone de l'input
    }
// Écouteurs d'événements : fermeture au bouton de la modale 2 vue "Ajout photos"
closeModaleButton2.addEventListener('click', (event) => {
    event.preventDefault();
    closeModale();
    resetFormAndUI(); // Appel de la fonction de réinitialisation
});
// Écouteurs d'événements pour la fermeture lorsque l'utilisateur clique en dehors du contenu de la modale.
    modaleAddProjet.addEventListener('click', (event) => {
        if (event.target === modaleAddProjet) {
            closeModale();
            resetFormAndUI(); // Appel de la fonction de réinitialisation
        }
    });



/////////////////////////////////////////////////////
// GESTION DYNAMIQUE DE LA MODALE 1 "GALERIE PHOTO" 
////////////////////////////////////////////////////


// 1. Fonction "addPhotos": ajouter des photos dans la modale "Galerie photo"

    const addPhotos = (photos) => {
        projectsContainer.innerHTML = ''; // Vider le conteneur avant d'ajouter les nouvelles photos

        photos.forEach(photo => {
            const photoElement = document.createElement("div");
            photoElement.innerHTML = `<img src="${photo.imageUrl}" alt="${photo.title}" class="photo-item">
            <div class="delete-icon">&times;</div>`;

            projectsContainer.appendChild(photoElement);
        
            // Création de l'icone delete en dynamique
            const deleteIcon = document.createElement("i");
            deleteIcon.classList.add("fas", "fa-trash-can");
            
            // Fonction "deleteWork" pour supprimer un work via l'API
            const deleteWork = async(photoId) => {
                const response = await fetch (`http://localhost:5678/api/works/${photoId}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!response.ok) {
                throw new Error(`La suppression de la photo a échoué -  status: ${response.status}`);
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
 
// // Initialisation de la page
// const initializePage = async () => {
//     addPhotos(works); // Appeler addPhotos après avoir récupéré les travaux
// };
// initializePage();



////////////////////////////////////////////////////
// GESTION DYNAMIQUE DE LA MODALE 2 "AJOUT PHOTOS"
///////////////////////////////////////////////////


// 1. Bouton d'ajout et input titre et catégorie

// Sélection de la variable btnAddProject pour ajouter un projet + écoute de l'évènement au clic
const btnAddProject = document.querySelector(".js-modale2-projet");


btnAddProject.addEventListener("click", addPhotoForm);


// Sélection des variables photoTitleInput et CategoryInput + leurs écoutes à l'input
const photoTitleInput = document.getElementById('photoTitle');
const photoCategoryInput = document.getElementById('photoCategory');

photoTitleInput.addEventListener('input', checkInputs);
photoCategoryInput.addEventListener('input', checkInputs);


// Fonction checkInput pour vérifier les champs et mettre à jour la couleur du bouton si tout est ok
function checkInputs() {
    const photoTitle = photoTitleInput.value.trim();
    const photoCategory = photoCategoryInput.value.trim();

    if (photoTitle !== "" && (photoCategory === "1" || photoCategory === "2" || photoCategory === "3")) {
        btnAddProject.style.backgroundColor = "#1d6154";
        btnAddProject.addEventListener('mouseover', function() {
                btnAddProject.style.backgroundColor = "#0e2f28"; // Changer la couleur de fond en noir au survol
        });
        btnAddProject.addEventListener('mouseleave', function() {
                btnAddProject.style.backgroundColor = "#1d6154"; // Revenir à la couleur intitiale sans survol
        });
        document.getElementById("error-message2").style = "display: none;";
    } else {
        btnAddProject.style.backgroundColor = "";
            document.getElementById("error-message2").textContent = "Veuillez remplir tous les champs.";
            document.getElementById("error-message2").style = "display: flex;justify-content: center; color: red; font-weight: bold; padding-top: 20px; margin-bottom: -15px;";
    }
}

// 2. Chargement de l'image

// Sélection des variables photoInput et photoPreview pour charger la photo + écoute de l'évènement au changement de l'input de fichier
const photoInput = document.getElementById('photoUrl');
const photoPreview = document.getElementById('photoPreview');

photoInput.addEventListener('change', function(event) {
    console.log("Contenu de photoInput :", photoInput.fileList);
    // Vérifier si un fichier a été sélectionné avant de tenter de le lire
    if (photoInput.files && photoInput.files[0]) {
      const reader = new FileReader();
  
      // Lorsque le lecteur a fini de lire le fichier >>> fonction de rappel qui sera exécutée lorsque le fichier aura été complètement lu.
      reader.onload = function(e) {
        photoPreview.src = e.target.result; // Aperçu de l'image avec les données du fichier, contient le contenu du fichier lu, qui est une URL de données dans ce cas.
        photoPreview.style.display = 'block'; // Afficher l'aperçu de l'image
        // Supprimer i, label et p lors du chargement de l'image
        document.querySelector(".form-group-photo i").style.display = 'none'; // Masquer l'icône de l'appareil photo
        document.querySelector(".form-group-photo label").style.display = 'none';// Masquer le texte "Ajouter une photo"
        document.querySelector(".form-group-photo p").style.display = 'none';// Supprimer la bordure de la zone de l'input
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

/*if (photoTitle === "" || photoCategory === ""|| photoFile === undefined) {
    errorMessage.textContent = "Merci de remplir tous les champs.";
    errorMessage.style.display = 'block'; // Afficher le message d'erreur
    return;
 } else if (photoCategory !== "1" && photoCategory !== "2" && photoCategory !== "3") {
    errorMessage.textContent = "Merci de spécifier une catégorie : 1, 2 ou 3.";
    errorMessage.style.display = 'block'; // Afficher le message d'erreur
    return;
 } else {
    errorMessage.style.display = 'none'; // Masquer le message d'erreur en cas de succès
    // Si toutes les vérifications sont réussies, création d'un objet FormData contenant les données du formulaire*/
    try { 
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
            errorMessage.textContent = "Erreur lors de l'upload de la photo.";
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        console.error("Erreur lors de l'upload de la photo:", error);
        errorMessage.textContent = "Une erreur est survenue lors de l'upload de la photo.";
        errorMessage.style.display = 'block';
    };
};



// 4. Retour à la modale 1 au clic de la flêche returnLink de la modale 2

const returnLink = document.querySelector(".js-modale-return");


returnLink.addEventListener('click', function(event) {
    event.preventDefault();

    console.log('Flèche de retour cliquée'); // permet de laisser le temps de charger le console.log suivant
    console.log('Redirection vers la modale 1...');

    // Masquer la modale 2
    modaleAddProjet.style.display = 'none';
    modaleAddProjet.setAttribute("aria-hidden", "true");

    // Afficher la modale 1
    modale.style.display = 'flex';
    modale.setAttribute("aria-hidden", "false"); 
});


