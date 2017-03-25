var mapCanvas = document.getElementById('map');
var myLatitude;
var myLongitude;
var myLatLng;
var latit;
var longit;

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
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    myLatLng = {
        lat: myLatitude,
        lng: myLongitude
    };
    var map = new google.maps.Map(mapCanvas, {
        center: {lat: myLatitude, lng: myLongitude},
        zoom: 15,
        mapTypeId: 'roadmap'
    });

    var bounds = {
        north: myCoords.coords.latitude + .010,
        south: myCoords.coords.latitude - .010,
        east: myCoords.coords.longitude + .010,
        west: myCoords.coords.longitude - .010
    };


    var myLocation = new google.maps.Marker({
        position: {lat: myLatitude, lng: myLongitude},
        map: map,
        title: 'my location'
    });

    // map.addListener('center_changed', function(){
    //     window.setTimeout(function(){
    //         map.panTo(marker.getPosition());
    //     }, 3000);
    // });

    // myLocation.addListener('click', function () {
    //     map.setZoom(8);
    //     map.setCenter(myLocation.getPosition());
    // });


    var locations = [
        ['Ragazzi', 53.201472, -6.111626],
        ['McDonalds', 53.200543, -6.111079]
    ];

    var infoWindowContent = [
        ['<div class="info_content">' +
        '<h3>Galway</h3>' +
        '<p>Galway Girl from here!</p>' + '</div>'
        ],
        ['<div>' +
        '<h3>Cork</h3>' +
        '<p>This is Cork Boeee!</p>' + '</div>'
        ]
    ];


    // Display multiple markers on a map
    var infoWindow = new google.maps.InfoWindow(),
        marker, i;

    for (var i = 0; i < locations.length; ++i) {
        var position = new google.maps.LatLng(locations[i][1], locations[i][2]);
        var marker = new google.maps.Marker({
            position: position,
            map: map,
            title: locations[i][0]
        });


        // Allow each marker to have an info window
        google.maps.event.addListener(marker, 'click', (function (marker, i) {
            return function () {
                infoWindow.setContent(infoWindowContent[i][0]);
                infoWindow.open(map, marker);
                latit = marker.getPosition().lat();
                longit = marker.getPosition().lng();
            }
        })(marker, i));

        marker.addListener('click', function () {
            directionsService.route({
                origin: myLatLng,
                destination: {
                    lat: latit,
                    lng: longit
                },
                travelMode: 'WALKING'
            }, function (response, status) {
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
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            mapCanvas.innerHTML = "User denied the request for Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            mapCanvas.innerHTML = "Location information is unavailable."
            break;
        case error.TIMEOUT:
            mapCanvas.innerHTML = "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            mapCanvas.innerHTML = "An unknown error occurred."
            break;
    }
}




