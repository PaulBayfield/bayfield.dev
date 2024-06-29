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
        mapId: "MAP_ID",
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

        closeMenu();

        geocoder.geocode({ placeId: place.place_id })
        .then(({ results }) => {
            // Création du marqueur
            var infoWindow = new google.maps.InfoWindow();
            var infowindowContent = document.getElementById("infowindow-content-default").cloneNode(true);
            // Changement de l'ID
            infowindowContent.id = "infowindow-content";
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

    let type = prompt("Type (Monument, Maison, Musee, Zoo, Parc, Ville, Aéroport, Gite, Restaurant):", "Monument").toLowerCase();
    if (type === null) return;

    $.post("/add", { lat: location.lat, lng: location.lng, description, type })
    .done(function () {
        var marker = new google.maps.Marker({
            position: location,
            map: map,
            icon: `https://bayfield.dev/static/map/map/images/${type}.svg`,
        });

        marker.iconType = type;

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

    marker.addListener("click", ({ domEvent, latLng }) => {
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

        map.panTo(latLng);
        map.setZoom(12);
    });
}

// Fonction qui filtre les marqueurs
function filterMarkers(category) {
    document.getElementById('filter-image').src = 'https://bayfield.dev/static/map/map/images/' + category + '.svg';

    var visible = [];
    for (let i = 0; i < markers.length; i++) {
        if (markers[i].iconType === category || category === 'tout') {
            markers[i].map = map;
            visible.push(markers[i]);
        }
        else {
            markers[i].map = null;
        }
    }

    filter = category;

    cluster.clearMarkers();
    cluster.addMarkers(visible);
    closeMenu();

    if (!editable && visible.length === 0 && (category == 'maison' || category == 'gite' || category == 'restaurant')) {
        if (window.confirm("Cette catégorie est privée. Connectez-vous pour y accéder.\n\nSe connecter ?")) {
            window.location.href='/login';
        };
    }
}

// Fermeture du menu
function closeMenu() {
    const header = $("#header");
    $("body").removeClass('noscroll');
    isOpen = false;
    header.removeClass("active");
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
function toggleEdit(check = false) {
    if (editable || check) {
        if (!check) {
            editMode = !editMode;
        }

        const editImgPerson = document.getElementById('edit-img-person');
        const editImgEdit = document.getElementById('edit-img-edit');

        const editImgPersonText = document.getElementById('edit-img-person-text');
        const editImgEditText = document.getElementById('edit-img-edit-text');

        if (editMode) {
            editImgPerson.style.display = '';
            editImgEdit.style.display = 'none';

            editImgPersonText.style.display = '';
            editImgEditText.style.display = 'none';
        } else {
            editImgPerson.style.display = 'none';
            editImgEdit.style.display = '';

            editImgPersonText.style.display = 'none';
            editImgEditText.style.display = '';
        }
    } else  {
        if (window.confirm("Vous n'êtes pas autorisé à effectuer cette action. Unique les administrateurs peuvent ajouter des marqueurs.\n\nSe connecter ?")) {
            window.location.href='http://bayfield.dev/login?redirect=map';
        };
    }
}

// Changement du style de la carte
function toggleStyle(map, mode) {
    if (mode === 'dark') {
        map.setOptions({ styles: [
            { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
            {
                featureType: "administrative.locality",
                elementType: "labels.text.fill",
                stylers: [{ color: "#d59563" }],
            },
            {
                featureType: "poi",
                elementType: "labels.text.fill",
                stylers: [{ color: "#d59563" }],
            },
            {
                featureType: "poi.park",
                elementType: "geometry",
                stylers: [{ color: "#263c3f" }],
            },
            {
                featureType: "poi.park",
                elementType: "labels.text.fill",
                stylers: [{ color: "#6b9a76" }],
            },
            {
                featureType: "road",
                elementType: "geometry",
                stylers: [{ color: "#38414e" }],
            },
            {
                featureType: "road",
                elementType: "geometry.stroke",
                stylers: [{ color: "#212a37" }],
            },
            {
                featureType: "road",
                elementType: "labels.text.fill",
                stylers: [{ color: "#9ca5b3" }],
            },
            {
                featureType: "road.highway",
                elementType: "geometry",
                stylers: [{ color: "#746855" }],
            },
            {
                featureType: "road.highway",
                elementType: "geometry.stroke",
                stylers: [{ color: "#1f2835" }],
            },
            {
                featureType: "road.highway",
                elementType: "labels.text.fill",
                stylers: [{ color: "#f3d19c" }],
            },
            {
                featureType: "transit",
                elementType: "geometry",
                stylers: [{ color: "#2f3948" }],
            },
            {
                featureType: "transit.station",
                elementType: "labels.text.fill",
                stylers: [{ color: "#d59563" }],
            },
            {
                featureType: "water",
                elementType: "geometry",
                stylers: [{ color: "#17263c" }],
            },
            {
                featureType: "water",
                elementType: "labels.text.fill",
                stylers: [{ color: "#515c6d" }],
            },
            {
                featureType: "water",
                elementType: "labels.text.stroke",
                stylers: [{ color: "#17263c" }],
            },
            {
                featureType: "administrative",
                elementType: "geometry",
                stylers: [{ color: "#2f3948" }],
            },
            {
                featureType: "administrative",
                elementType: "labels.text.fill",
                stylers: [{ color: "#d59563" }],
            },
            {
                featureType: "administrative",
                elementType: "labels.text.stroke",
                stylers: [{ color: "#17263c" }],
            },
          ] 
        });
    } else {
        map.setOptions({ styles: [] });
    }
}


window.markers = markers;
window.initMap = initMap;
window.addInfoWindow = addInfoWindow;
window.filterMarkers = filterMarkers;
window.createCluster = createCluster;
window.toggleEdit = toggleEdit;
