var mapCanvas = document.getElementById('map');
var myLatitude;
var myLongitude;
var myLatLng;
var latit;
var longit;
var locations = [
    ['Ragazzi', 53.201472, -6.111626, ['<div class="info_content">' + '<h3>Galway</h3>' + '<p>Galway Girl from here!</p>' + '</div>']],
    ['McDonalds', 53.200543, -6.111079, ['<div>' + '<h3>Cork</h3>' + '<p>This is Cork Boeee!</p>' + '</div>']],
    ['clement pekoe', 53.341539, -6.262766, ['<div>' + '<h3>Cork</h3>' + '<p>This is Cork Boeee!</p>' + '</div>']]
];
var map;
var marker;
var directionsService;
var directionsDisplay;

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(initMap, showError);
    } else {
        mapCanvas.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function initMap(myCoords) {
    myLatitude = myCoords.coords.latitude;
    myLongitude = myCoords.coords.longitude;
    myLatLng = {
        lat: myLatitude,
        lng: myLongitude
    };
    map = new google.maps.Map(mapCanvas, {
        center: {
            lat: myLatitude,
            lng: myLongitude
        },
        zoom: 15,
        mapTypeId: 'roadmap'
    });

    var bounds = new google.maps.LatLngBounds();

    var myLocation = new google.maps.Marker({
        position: {
            lat: myLatitude,
            lng: myLongitude
        },
        map: map,
        title: 'my location'
    });

    plotLocations(locations);
}

var plotLocations;
plotLocations = function(locations) {

    for (var i = 0; i < locations.length; ++i) {
        var position = new google.maps.LatLng(locations[i][1], locations[i][2]);
        marker = new google.maps.Marker({
            position: position,
            map: map,
            title: locations[i][0]
        });

        // Display multiple markers on a map
        var infoWindow = new google.maps.InfoWindow(),
            marker, i;

        // Allow each marker to have an info window
        // google.maps.event.addListener(marker, 'click', (function(marker, i) {
        //     return function() {
        //         infoWindow.setContent(locations[i][3].toString());
        //         infoWindow.open(map, marker);
        //         latit = marker.getPosition().lat();
        //         longit = marker.getPosition().lng();
        //     };
        // })(marker, i));

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                alert(locations[i][0].toString());
                // infoWindow.setContent(locations[i][3].toString());
                // infoWindow.open(map, marker);
                // latit = marker.getPosition().lat();
                // longit = marker.getPosition().lng();
            };
        })(marker, i));

        marker.addListener('click', function() {
            directionsService = new google.maps.DirectionsService;
            directionsDisplay = new google.maps.DirectionsRenderer;
            directionsService.route({
                origin: myLatLng,
                destination: {
                    lat: latit,
                    lng: longit
                },
                travelMode: 'WALKING'
            }, function(response, status) {
                if (status === 'OK') {
                    directionsDisplay.setDirections(response);
                    directionsDisplay.setMap(map);
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            });
        });

    }
    map.fitBounds(bounds);
};


function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            mapCanvas.innerHTML = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            mapCanvas.innerHTML = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            mapCanvas.innerHTML = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            mapCanvas.innerHTML = "An unknown error occurred.";
            break;
    }
}
