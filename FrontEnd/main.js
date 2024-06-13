
///////////////////////////////////////////////////////////////////
//  Récupération des travaux via l'API et création des filtres  //
///////////////////////////////////////////////////////////////////

// 1. Initialisation des variables dans le scope globale ********************************************************

const gallery = document.querySelector(".gallery");
let works = [];

// 2. Fonction getWorks pour récupérer et afficher les travaux (works) **********************************************************************

const getWorks = async () => {
    const response = await fetch('http://localhost:5678/api/works');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // la variable works contiendra les données de la réponse de l'API au format JSON.
    works = await response.json(); 
    console.log('Works after fetching:', works); // Affiche les works récupérés 
    createGallery(works);
    // Appel de la fonction "createGallery pour afficher les travaux dans la galerie" avec les données works
}

// Variable "createGallery" permet de recréer une galerie
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
}

/////////// Variable createGallery à rappeler !!!!!!

// 3. Fonction getFiltered pour récupérer les catégories et créer les boutons de filtres ****************************************************************************

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
        // console.log('Category button clicked:', category.name); 
        // console.log('Category ID:', category.id); 
        // console.log('Works:', works); 
        const filteredWorks = works.filter(work => work.categoryId === category.id);
        updateGallery(filteredWorks);
        console.log('Filtered works:', filteredWorks); 
    
    // filter parcourt chaque élément de works.Pour chaque work, il vérifie si work.category est égal à category.id.Si cette condition est vraie, work est ajouté au nouveau tableau filteredWorks.Si la condition est fausse, work est ignoré. La fonction updateGallery est appelée avec filteredWorks comme argument.updateGallery prend ce tableau de travaux filtrés et met à jour le contenu de l'élément gallery pour afficher seulement ces travaux.
        });
    });
}


// 4. Fonction updateGallery pour mettre à jour la galerie avec des travaux filtrés *********************************************************************

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

//La méthode filter est utilisée pour créer un nouveau tableau contenant uniquement les éléments qui satisfont une condition spécifique.


///////////////////////////////////////////////////////////////////
// Création de la navbar dynamique au niveau de la page d'accueil//
///////////////////////////////////////////////////////////////////

// Vérifier si l'utilisateur est connecté , en vérifiant la présence du token dans le localStorage
const isLoggedIn = localStorage.getItem("token") !== null;
console.log(localStorage.getItem("token"))


// Après avoir reçu le token du serveur en réponse à la soumission du formulaire de connexion
// const token = "votre_token";

// // Stockage du token dans le localStorage
// localStorage.setItem("token", token);

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


//////////////////////////////////////////////////
// Suppression des boutons filtre en mode admin //
//////////////////////////////////////////////////

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
        // addPhotoForm.style.display = "none"; // Réinitialise le formulaire pour la prochaine ouverture ====> Est ce que je dois le garder ? ou remplacer par une fonction reset du genre : 
        // function resetForms() {
        // addPhotoForm.reset();
        //  }
        //  resetForms();
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

// Fonction "addPhotos": ajouter des photos dans la modale "Galerie photo"
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
                createGallery(photos); // ou addPhotos ?
            }
        
            // Suppression des works coté serveur en cliquant sur l'icone Delete
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

            // Définition des éléments deleIcon et photoElement
            photoElement.appendChild(deleteIcon);
            projectsContainer.appendChild(photoElement);
            }; 
        });
    };
 
// Initialisation de la page
const initializePage = async () => {
    await getWorks();
    await getFiltered();
    addPhotos(works); // Appeler addPhotos après avoir récupéré les travaux
};
initializePage();

///////////////////////////////////////////////////
// Gestion dynamique de la modale "Ajout photos" 
//////////////////////////////////////////////////

// 1. Sélection du bouton pour ajouter un projet
const btnAddProject = document.querySelector(".js-modale2-projet");
btnAddProject.addEventListener("click", addPhotoForm);

// 2. Fonction "addPhotoForm" pour ajouter un projet
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
    alert("Merci de spécifier une catégorie de 1, 2 ou 3 valide");
    return;
    
 } else {
    // Changer la couleur du bouton valider
    btnAddProject.style.backgroundColor = "#1d6154"

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
            console.log("Photo uploadée avec succès", responseData);
            // Ajouter la nouvelle photo à la galerie
            addPhotos(responseData);

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
