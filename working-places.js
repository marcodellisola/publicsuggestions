const{ place } = require('./js/maps.js');
let places = [];

const clickListener = document.getElementById("addPlace");
clickListener.addEventListener("click", addPlace);

function addPlace() {
console.log(place.selectedLat, place.selectedLng, place.placeName);
  const placeLat = place.selectedLat;
  const placeLng = place.selectedLng;
  const name = place.placeName;
  // Assicurati che il valore non sia vuoto
  if (placeLat !== null && placeLng !== null && name !== null) {

    const place = {
        name: name,
        lat: placeLat,
        lng: placeLng
      };

    places.push(place);

    console.log("Array attuale:", places);

    updateList();
  }
}

function updateList() {
  const placeList = document.getElementById("placeList");
  placeList.innerHTML = ""; // Cancella la lista precedente

  for (let i = 0; i < places.length; i++) {
    const listItem = document.createElement("li");
    listItem.textContent = places[i].name;
    var button = document.createElement("button");
    button.onclick = removePlace;
    button.textContent = "Remove";
    listItem.appendChild(button);
    placeList.appendChild(listItem);
  }
}

function removePlace() {
  // Ottieni il valore da un campo di input o da un altro elemento HTML
  const placeToRemove = document.getElementById("placeToRemove").value;

  // Cerca l'indice del valore nell'array
  const indexToRemove= valoreArray.indexOf(placeToRemove);

  if (indexToRemove !== -1) {
    // Rimuovi il valore dall'array
    places.splice(indexToRemove, 1);

    // Aggiorna la visualizzazione dell'array
    updateList();

    // Puoi anche mostrare un messaggio di conferma o gestire altre azioni necessarie
    console.log("Valore rimosso:", placeToRemove);
  } else {
    // Il valore non è stato trovato nell'array
    console.log("Valore non trovato nell'array:", placeToRemove);
  }
}
