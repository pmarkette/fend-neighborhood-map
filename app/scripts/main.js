// Here's my data model
var ViewModel = function(first, last) {
"use strict";
    this.firstName = ko.observable(first);
    this.lastName = ko.observable(last);
    this.fullName = ko.computed(function() {
        // Knockout tracks dependencies automatically. It knows that fullName depends on firstName and lastName, because these get called when evaluating fullName.
        return this.firstName() + " " + this.lastName();
    }, this);
};

ko.applyBindings(new ViewModel("Planet", "Earth")); // This makes Knockout get to work

//Create the map and markers
var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.8070047, lng: -122.2718144},
    zoom: 15
  });
  var myLatLng = {lat: 37.8070047, lng: -122.2718144};
  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    title: 'The Woods'
  });
  function toggleBounce() {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }
  }
  marker.addListener('click', toggleBounce);
  marker.setMap(map);
}

