let selectedLat;
let selectedLng;
let placeName;

var place = {
  selectedLat: selectedLat,
  selectedLng: selectedLng,
  placeName: placeName,
};

function initAutocomplete() {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 40.8517746, lng: 14.2681244 },
    zoom: 13,
    mapTypeId: "roadmap",
  });
  // Create the search box and link it to the UI element.
  const input = document.getElementById("pac-input");
  const searchBox = new google.maps.places.SearchBox(input);

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  // Bias the SearchBox results towards current map's viewport.
  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds());
  });

  let markers = [];

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach((marker) => {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    const bounds = new google.maps.LatLngBounds();

    places.forEach((place, index) => {
      if (place === searchBox.getPlaces()[index]) {
        if (!place.geometry || !place.geometry.location) {
          console.log("Returned place contains no geometry");
          return;
        }

        // Ottieni le coordinate del luogo selezionato
        const selectedLocation = place.geometry.location;
        selectedLat = selectedLocation.lat();
        selectedLng = selectedLocation.lng();
        placeName = place.name;

        const icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25),
        };

        // Create a marker for each place.
        markers.push(
          new google.maps.Marker({
            map,
            icon,
            title: place.name,
            position: place.geometry.location,
          })
        );
        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      }
    });
    map.fitBounds(bounds);
  });
}

window.initAutocomplete = initAutocomplete;

module.exports = place;
