/*      PAGE ACCUEIL       */

// Déclaration des variables
const inputName = document.querySelector('#inputName');
const userName = document.querySelector('#userName');
const goButton = document.querySelector('#buttonStart');
const pageAccueil = document.querySelector('#page_accueil');
const pageCarte = document.querySelector('#page_carte');

// Fonction pour afficher le nom de l'utilisateur
const ChangeUserName = (input, output) => {
	output.innerHTML = input;
}

// Récupérer les lettres tapées par l'utilisateur pour son nom
inputName.addEventListener('keyup', evt => ChangeUserName(evt.target.value, userName));

// Fonction pour changer de page
const AccueilToCarte = evt => {
    evt.preventDefault();
	pageAccueil.classList.add('page-goOut');
	pageCarte.classList.remove('page-inactive');
}

// Change de page + Démarre la musique quand on clique sur "Go"
goButton.addEventListener('click', evt => {
    AccueilToCarte(evt);
    /*document.querySelector('audio').autoplay = "true";*/
    document.querySelector('audio').play();
});



/*      PAGE CARTE      */

// Déclaration des variables
const cross = document.querySelectorAll('.closed_cross');
const countDown = document.querySelector('#countDown');

// Fonction pour afficher le décompte depuis 5
const CountDownFrom5 = element =>{
    setTimeout(function(){element.innerHTML = "4";}, 1000);
    setTimeout(function(){element.innerHTML = "3";}, 2000);
    setTimeout(function(){element.innerHTML = "2";}, 3000);
    setTimeout(function(){element.innerHTML = "1";}, 4000);
}

// Fonction pour raffraichir la page
const Refresh = element => {
    element.location.reload();
}

// Fonction pour ouvrir les popups de région
const OpenPopup = (evt, index) => {
    const popup = document.querySelector(`#${index}`);
    evt.preventDefault();
    const cur = popup;
    cur.classList.add('popup-active');
    document.querySelector('#blackBG').style.display = "block";
    
    // Si le popup "Centre" est ouvert, on lance le décompte + le raffraichissement de page
    if (index === "popupCentre"){
        CountDownFrom5(countDown);
        setTimeout(Refresh, 5000, document);
    }
}

// Fonction pour fermer les popups de région
const ClosePopup = evt => {
    evt.preventDefault();
    const cur = document.querySelector('.popup-active');
    cur.classList.remove('popup-active');
    document.querySelector('#blackBG').style.display = "none";
    }

// Ajout d'un événement sur chacune des croix de chaque popup
for (var i = 0; i < cross.length; i++){  
    cross[i].addEventListener('click', evt => ClosePopup(evt));  
}

// Fonction pour déclarer l'API
const LoadingMap = () => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiaW1hY3Ryb3R0ZXIiLCJhIjoiY2pwazZ1NzdqMDBlajN3bzZudXYxOGtyMCJ9.jD0WGzpc-JqWoAehTGBouQ';
    var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/imactrotter/cjpmh7pll0nde2rmcyi8ftdn0',
    center: [2.2, 46.3],
    zoom: 5
    });

    map.on('load', 'markers-map', evt => {
        evt.resize(); 
    });
    
    // Récupération des infos de chaque marqueurs de la carte
    var features = map.queryRenderedFeatures({ layers: ['markers-map'] });

    // Associer à chaque marqueur un index pour ouvrir le bon popup de région
    map.on('click', 'markers-map', (evt, index) => {
        if (evt.features[0].properties.title === "Nord") index = "popupNord";
        if (evt.features[0].properties.title === "Sud-Ouest") index = "popupSudOuest";
        if (evt.features[0].properties.title === "Est") index = "popupEst";
        if (evt.features[0].properties.title === "Bretagne") index = "popupBretagne";
        if (evt.features[0].properties.title === "Sud-Est") index = "popupSudEst";
        if (evt.features[0].properties.title === "Corse") index = "popupCorse";
        if (evt.features[0].properties.title === "IMAC") index = "popupIMAC";
        if (evt.features[0].properties.title === "Centre") index = "popupCentre";

        OpenPopup(evt, index);
    });

    // La souris se transforme quand elle passe au dessus d'un marqueur
    map.on('mouseenter', 'markers-map', function () {
        map.getCanvas().style.cursor = 'pointer';
    });

    // La souris redevient normale quand elle n'est plus au dessus d'un marqueur
    map.on('mouseleave', 'markers-map', function () {
        map.getCanvas().style.cursor = '';
    });
}

// Fonction permettant de charger la map 10ms après avoir appuyé sur "Go"
// Cela permet de laisser le conteneur se charger entièrement avant que la carte ne charge
goButton.addEventListener('click', evt => setTimeout(LoadingMap, 10));