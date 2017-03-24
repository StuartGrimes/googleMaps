var mapCanvas = document.getElementById('map');
var myLatitude;
var myLongitude;

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

    myLocation.addListener('click', function () {
        map.setZoom(8);
        map.setCenter(myLocation.getPosition());
    });

    var locations = [
        ['Ragazzi', 53.201472, -6.111626],
        ['McDonadls', 53.200543, -6.111079]
    ];

    for (var i = 0; i < locations.length; ++i) {
        var position = new google.maps.LatLng(locations[i][1], locations[i][2]);
        var marker = new google.maps.Marker({
            position: position,
            map: map,
            title: locations[i][0]
        });
        var easy = marker.position;
        marker.addListener('click', function () {
            var destination;
            // destination = {lat: 53.200543, lng: -6.111079};
            // destination = "McDonalds, Bray, Co. Wicklow"
            // destination = position;
            destination = easy;
            var origin;
            // origin = "1 Rectory Slopes, Herbert Road, Bray";
            // origin = this.latlng;
            origin = {lat: myLatitude, lng: myLongitude};
            ClickEventHandler(map, origin, destination).bind(this);
        });
    }

    /**
     * @constructor
     */
    var ClickEventHandler = function (map, origin, destination) {
        this.origin = origin;
        this.destination = destination;
        alert(JSON.stringify(origin, null, 4));
        alert(JSON.stringify(destination, null, 4));
        this.map = map;
        this.directionsService = new google.maps.DirectionsService;
        this.directionsDisplay = new google.maps.DirectionsRenderer;

        // this.placesService = new google.maps.places.PlacesService(map);
        // this.infowindow = new google.maps.InfoWindow;
        // this.infowindowContent = document.getElementById('infowindow-content');
        // this.infowindow.setContent(this.infowindowContent);
        var me = this;
        this.directionsService.route({
            origin: this.origin,
            destination: this.destination,
            travelMode: 'WALKING'
        }, function (response, status) {
            if (status === 'OK') {
                me.directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
        this.directionsDisplay.setMap(map);
    };

    // ClickEventHandler.prototype.handleClick = function(event) {
    //     console.log('You clicked on: ' + event.latLng);
    //     // If the event has a placeId, use it.
    //     if (event.placeId) {
    //         console.log('You clicked on place:' + event.placeId);
    //
    //         // Calling e.stop() on the event prevents the default info window from
    //         // showing.
    //         // If you call stop here when there is no placeId you will prevent some
    //         // other map click event handlers from receiving the event.
    //         event.stop();
    //
    //         this.getPlaceInformation(event.placeId);
    //     }
    // };

    // ClickEventHandler.prototype.calculateAndDisplayRoute = function(placeId) {
    //     var me = this;
    //     this.directionsService.route({
    //         origin: this.origin,
    //         destination: {placeId: placeId},
    //         travelMode: 'WALKING'
    //     }, function(response, status) {
    //         if (status === 'OK') {
    //             me.directionsDisplay.setDirections(response);
    //         } else {
    //             window.alert('Directions request failed due to ' + status);
    //         }
    //     });
    // };

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




