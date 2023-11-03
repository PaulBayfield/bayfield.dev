var markers = [];
var filter = 'tout';
var cluster = null;
var openInfoWindow = null;
var currentSearch = null;
var geocoder = null;
var editable = false;
var editMode = false;


// Fonction qui initialise la carte
function initMap(lat, lng, edit) {
    // Création de la carte
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 9,
        center: new google.maps.LatLng(lat, lng),
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeControl: true,
    });

    editable = edit;
    editMode = edit;

    // Création d'une instance de Geocoder
    geocoder = new google.maps.Geocoder();

    // Ajout de la barre de recherche
    const input = document.getElementById("pac-input");
    const autocomplete = new google.maps.places.Autocomplete(input, {
        fields: ["place_id", "geometry", "name", "formatted_address"],
    });
    autocomplete.bindTo("bounds", map);

    // Création de l'infowindow
    autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();

        if (!place.place_id) {return;}
        
        if (currentSearch) {
            currentSearch.setMap(null);
            currentSearch = null;
        }

        if (openInfoWindow) {
            openInfoWindow.close();
        }

        geocoder.geocode({ placeId: place.place_id })
        .then(({ results }) => {
            // Création du marqueur
            var infoWindow = new google.maps.InfoWindow();
            var infowindowContent = document.getElementById("infowindow-content").cloneNode(true);
            var marker = new google.maps.Marker({
                map: map,
                icon: 'https://bayfield.dev/static/map/map/images/tout.svg',
            });
            marker.setPlace({
                placeId: place.place_id,
                location: results[0].geometry.location,
            });
            marker.setVisible(true);
            marker.addListener("click", () => {
                infoWindow.open(map, marker);
            });
            
            // Affichage de l'infowindow
            infowindowContent.children["place-name"].textContent = place.name;
            infowindowContent.children["place-address"].textContent = results[0].formatted_address;
            infoWindow.setContent(infowindowContent);
            infoWindow.open(map, marker);

            // Zoom sur le marqueur
            map.setZoom(11);
            map.setCenter(results[0].geometry.location);

            openInfoWindow = infoWindow;
            currentSearch = marker;
        })
        .catch((e) => console.log(e));
    });

    // Ajout du listener pour ajouter un marqueur
    google.maps.event.addListener(map, 'click', function (event) {
        placeMarker(map, event.latLng);
    });

    return map;
}

// Fonction qui ajoute un marqueur à la carte
function placeMarker(map, location) {
    if (!editable) return;
    if (!editMode) return;

    if (currentSearch) {
        currentSearch.setMap(null);
        currentSearch = null;
    }

    if (openInfoWindow) {
        openInfoWindow.close();
    }

    let description = prompt("Description du lieu:");
    if (description === null) return;

    let type = prompt("Type (Monument, Maison, Musee, Zoo, Parc, Ville, Gite, Restaurant):", "Monument").toLowerCase();
    if (type === null) return;

    $.post("/add", { lat: location.lat, lng: location.lng, description, type })
    .done(function () {
        var marker = new google.maps.Marker({
            position: location,
            map: map,
            icon: `https://bayfield.dev/static/map/map/images/${type}.svg`,
        });

        marker.type = type;

        if (filter !== type && filter !== 'tout') {
            marker.setVisible(false);
            alert("Le marqueur a été ajouté mais il n'est pas visible car il ne correspond pas au filtre actuel.");
        }

        markers.push(marker);

        addInfoWindow(map, marker, description, type);

        cluster.clearMarkers();
        cluster.addMarkers(markers);
    })
    .fail(function (error) {
        alert(error.responseText);
    });
}

// Fonction qui ajoute une infowindow à un marqueur
function addInfoWindow(map, marker, message) {
    message = "<strong>" + message + "</strong>";

    var infoWindow = new google.maps.InfoWindow({
        content: message,
    });

    google.maps.event.addListener(marker, 'click', function () {
        if (currentSearch) {
            currentSearch.setMap(null);
            currentSearch = null;
        }

        if (openInfoWindow) {
            openInfoWindow.close();
        }

        if (marker.geocoded) {
            infoWindow.open(map, marker);
            return;
        } else {
            geocoder.geocode({ 'location': marker.position }, function (results, status) {
                if (status === 'OK' && results[0]) {
                    var formattedAddress = results[0].formatted_address;
                    message += "<br><br>" + formattedAddress;
                    infoWindow.setContent(message);
                    infoWindow.open(map, marker);
                } else {
                    infoWindow.setContent(message);
                    infoWindow.open(map, marker);
                }
    
                openInfoWindow = infoWindow;
                marker.geocoded = true;
            });
        }

        map.panTo(this.getPosition());
        map.setZoom(12);
    });
}

// Fonction qui filtre les marqueurs
function filterMarkers(category) {
    document.getElementById('filter-image').src = 'https://bayfield.dev/static/map/map/images/' + category + '.svg';

    var visible = [];
    for (let i = 0; i < markers.length; i++) {
        if (markers[i].type === category || category === 'tout') {
            markers[i].setVisible(true);
            visible.push(markers[i]);
        }
        else {
            markers[i].setVisible(false);
        }
    }

    filter = category;

    cluster.clearMarkers();
    cluster.addMarkers(visible);

    if (!editable && visible.length === 0 && (category == 'maison' || category == 'gite' || category == 'restaurant')) {
        if (window.confirm("Cette catégorie est privée. Connectez-vous pour y accéder.\n\nSe connecter ?")) {
            window.location.href='/login';
        };
    }
}

// Fonction qui crée un cluster
function createCluster(map, markers) {
    const svg = window.btoa(`
        <svg fill="#f7eb66" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
        <circle cx="120" cy="120" opacity="1" r="70" />
        <circle cx="120" cy="120" opacity=".6" r="90" />
        <circle cx="120" cy="120" opacity=".3" r="110" />
        <circle cx="120" cy="120" opacity=".2" r="130" />
        <circle cx="120" cy="120" opacity=".1" r="140" />
        </svg>`);

    const renderer = {
        render: ({ count, position }) =>
            new google.maps.Marker({
            label: { text: String(count), color: "#263184", fontSize: "14px", fontWeight: "600" },
            icon: {
                url: `data:image/svg+xml;base64,${svg}`,
                scaledSize: new google.maps.Size(45, 45),
                },
            position,
            zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
        })
    };

    cluster = new markerClusterer.MarkerClusterer({
        map,
        markers,
        renderer,
    });
}

// Fonction qui active/désactive le mode édition
function toggleEdit() {
    if (editable) {
        editMode = !editMode;

        let editImg = document.getElementById('edit-img');

        if (editMode) {
            editImg.src = 'https://bayfield.dev/static/map/map/images/person.png';
        } else {
            editImg.src = 'https://bayfield.dev/static/map/map/images/edit.png';
        }
    } else  {
        if (window.confirm("Vous n'êtes pas autorisé à effectuer cette action.\n\nSe connecter ?")) {
            window.location.href='/login';
        };
    }
}

window.markers = markers;
window.initMap = initMap;
window.addInfoWindow = addInfoWindow;
window.filterMarkers = filterMarkers;
window.createCluster = createCluster;
window.toggleEdit = toggleEdit;
