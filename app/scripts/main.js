/*global ko*/
/*global google*/
function ViewModel() {
  "use strict";
  var self = this;

  self.beer = ko.observableArray([
    {
      name: "Linden Street Brewery",
      lat: 37.7994396,
      lng: -122.2899073
    },
    {
      name: "The Beer Shed",
      lat: 37.7995263,
      lng: -122.2898785
    },
    {
      name: "Diving Dog Brewhouse",
      lat: 37.8077394,
      lng: -122.2720127
    },
    {
      name: "Beer Revolution",
      lat: 37.797173,
      lng: -122.2784187
    },
    {
      name: "The Trappist",
      lat: 37.8005888,
      lng: -122.2763285
    },
    {
      name: "Drake’s Dealership",
      lat: 37.8126375,
      lng: -122.2686281
    },
    {
      name: "Lost & Found",
      lat: 37.8126362,
      lng: -122.283949
    },
    {
      name: "Woods Bar & Brewery",
      lat: 37.807009,
      lng: -122.2726781
    },
    {
      name: "Independent Brewing Company",
      lat: 37.796432,
      lng: -122.2734581
    },
    {
      name: "Ale Industries",
      lat: 37.776209,
      lng: -122.2303851
      }
  ]);
}

ko.applyBindings(new ViewModel()); // This makes Knockout get to work

//Create the map and markers
var map;
function initMap() {
  "use strict";
  map = new google.maps.Map(document.getElementById("map"), {
    center: {lat: 37.8070047, lng: -122.2718144},
    zoom: 15
  });
  var myLatLng = {lat: 37.8070047, lng: -122.2718144};
  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map
  });
  function toggleBounce() {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }
  }
  marker.addListener("click", toggleBounce);
  marker.setMap(map);
}

