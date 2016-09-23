var GoogleMaps = {};


GoogleMaps.initialize = function () {
    var wishes = [];
    var myLatlng = new google.maps.LatLng(29.549503, -95.3887303);
    var mapOptions = {
        center: { lat: 37.6, lng: -95.665 },
        zoom: 5,
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: 'Coder Camps!!! JavaScript Kick!!'
    });
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "api/About", false);
    xhr.onload = function () {
        var data = JSON.parse(this.response);
        for (var l in data) {
            //var loc = {}
            //loc.city = data[l].city
            //loc.state = data[l].state;
            wishes.push(data[l].city + "," + data[l].state);
        }
    };

    xhr.send();
    var markers = function () {
        geocoder = new google.maps.Geocoder();
        for (var i in wishes) {
            geocoder.geocode({ 'address': wishes[i] }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    //map.setCenter(results[0].geometry.location);
                    var marker = new google.maps.Marker({
                        map: map,
                        position: results[0].geometry.location
                    });
                } else {
                    alert('Geocode was not successful for the following reason: ' + status);
                }
            });
        }
    }
    markers();
}