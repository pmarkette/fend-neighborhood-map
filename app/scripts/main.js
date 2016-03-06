/*global ko*/
/*global google*/
var model = [
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
      name: "Independent Brewing Co.",
      lat: 37.796432,
      lng: -122.2734581
    },
    {
      name: "Ale Industries",
      lat: 37.776209,
      lng: -122.2303851
      }
  ];
function ViewModel() {
  "use strict";
  var self = this;
  self.beer = ko.observableArray(model);
  self.selectListItem = function() {
  var clickName = self.beer.name;
    console.log(clickName);
      };
}
ko.applyBindings(new ViewModel()); // This makes Knockout get to work

//Create the map and markers
var map;
function initMap() {
  "use strict";
  map = new google.maps.Map(document.getElementById("map"), {
    center: {lat: 37.8067098, lng: -122.2807331},
    zoom: 13
  });

  var len = model.length;
  for (var i = 0; i < len; i++) {
    var curName = model[i].name;
    var lat = model[i].lat;
    var lng = model[i].lng;
    var curLatLng = {lat, lng};
    var curMarker = new google.maps.Marker({
      position: curLatLng,
      animation: google.maps.Animation.DROP,
      title: curName,
      map: map
    });
    curMarker.setMap(map);
    var infowindow = new google.maps.InfoWindow({
      content: curName//contentString
    });
    curMarker.addListener("click", toggleBounce);
    curMarker.addListener("click", addInfoWindow);
  } //end for

  function toggleBounce() {
    if (this.getAnimation() !== null) {
      this.setAnimation(null);
    } else {
      this.setAnimation(google.maps.Animation.BOUNCE);
    }
  }
  function addInfoWindow() {
    infowindow.open(map, this);
  }
}

