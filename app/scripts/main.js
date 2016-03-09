/*eslint-env browser, jquery, node*/
/*global ko, google*/
var beers = [
  {name: "Linden Street Brewery", lat: 37.7994396, lng: -122.2882671, phone: "+15102518898"},
  {name: "Pacific Coast Brewing Co", lat: 37.801542, lng: -122.2764502, phone: "+15108362739"},
  {name: "Diving Dog Brewhouse", lat: 37.8077394, lng: -122.2720127, phone: "+15103061914"},
  {name: "Beer Revolution", lat: 37.797173, lng: -122.2784187, phone: "+15104522337"},
  {name: "The Trappist", lat: 37.8005888, lng: -122.2763285, phone: "+15102388900"},
  {name: "Drake’s Dealership", lat: 37.8126375, lng: -122.2686281, phone: "+15108336649"},
  {name: "Lost & Found", lat: 37.8101617, lng: -122.271404, phone: "+15107632040"},
  {name: "Woods Bar & Brewery", lat: 37.807009, lng: -122.2726781, phone: "+15107618617"},
  {name: "Independent Brewing Co.", lat: 37.796432, lng: -122.2734581, phone: "+15106982337"},
  {name: "Ale Industries", lat: 37.776209, lng: -122.2303851, phone: "+19254705280"}
];

var Location = function(data){
  "use strict";
  this.name = ko.observable(data.name);
  this.lat = ko.observable(data.lat);
  this.lng = ko.observable(data.lng);
  this.phone = ko.observable(data.phone);
  this.stars = ko.observable("");
  this.desc = ko.observable("");
  this.address0 = ko.observable("");
  this.address1 = ko.observable("");
  this.address2 = ko.observable("");
  this.address3 = ko.observable("");
  this.display_phone = ko.observable("");
};



function loadScript() {
  "use strict";
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyB82oaqh1VTxwsHD3XH5ZjFi5CFMBFQdvE" + "&callback=initialize";
  script.onerror = function(){
    console.log("Google maps could not be loaded" );
  };

  document.body.appendChild(script);
}



var ViewModel = function(){
  "use strict";
  var self = this;
  var selectedIcon = "http://www.google.com/mapfiles/marker.png",
        unselectedIcon = "http://www.google.com/mapfiles/marker_green.png",
        selectedColor = "red",
        unselectedColor = "green";

  //Create an array of all Locations
  self.beerList = ko.observableArray([]);
  var arrayOfMarkers = [];

  self.filter = ko.observable("");
  self.currentLocation = ko.observable("Oakland, CA");

  beers.forEach(function(beerItem){
    self.beerList.push(new Location(beerItem));
  });

  this.drawMap = function() {
    var mapOptions = {
        zoom: 14,
        center: new google.maps.LatLng(37.796432, -122.2734581),
        mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_RIGHT
    }
    };
    var map = new google.maps.Map(document.getElementsByClassName("map-canvas")[0], mapOptions);

    var i;
    for (i = 0; i < self.beerList().length; i++) {

        var contentString = "<div id=\"content\">" +
          "<h2 class=\"infoName\">" + self.beerList()[i].name() + "</h2>" +
          "<div>" + self.beerList()[i].stars() + "</div>" +
          "<div>" + self.beerList()[i].desc() + "</div>" +
          "<div>" + self.beerList()[i].address0() + "</div>" +
          "<div>" + self.beerList()[i].address1() + "</div>" +
          "<div>" + self.beerList()[i].address2() + "</div>" +
          "<div>" + self.beerList()[i].address3() + "</div>" +
          "<div>" + self.beerList()[i].display_phone() + "</div>" +
          "</div>";
        var infowindow = new google.maps.InfoWindow({content: contentString});

        var currentLatLng = new google.maps.LatLng(self.beerList()[i].lat(), self.beerList()[i].lng());
        var marker = new google.maps.Marker({
            position: currentLatLng,
            map: map,
            title: self.beerList()[i].name(),
            icon: unselectedIcon
        });

        arrayOfMarkers.push(marker);

    google.maps.event.addListener(marker, "click", self.markerReset);
    google.maps.event.addListener(infowindow, "closeclick", self.markerReset);

    google.maps.event.addListener(marker, "click", (function(marker, contentString, infoWindow){
            return function(){
                infowindow.setContent(contentString);
                infowindow.open(map, this);
                self.currentLocation(this.title);
                marker.setIcon(selectedIcon);
            };
        })(marker, contentString, infowindow));
    } //end for loop

  };

  self.markerReset = function(){
    for (var i = 0; i < arrayOfMarkers.length; i++){
      arrayOfMarkers[i].setIcon(unselectedIcon);

      $("h3").css("color", unselectedColor);
    }
  };

  self.stringStartsWith = function (string, startsWith) {
        string = string || "";
        if (startsWith.length > string.length){
        return false; }
        return string.substring(0, startsWith.length) === startsWith;
    };

    self.filteredItems = ko.computed(function() {
      var filter = self.filter().toLowerCase();
      if (!filter) {
        return self.beerList();
      } else {
          return ko.utils.arrayFilter(self.beerList(), function(Location) {
              return self.stringStartsWith(Location.name().toLowerCase(), filter);
          });
      }
    }, self.beerList, arrayOfMarkers);

        self.filteredMarkers = ko.computed(function() {
      for (var k = 0; k < self.filteredItems().length; k++) {
        for (var i = 0; i < arrayOfMarkers.length; i++) {
          if (arrayOfMarkers[i].title === self.filteredItems()[k].name()) {
            arrayOfMarkers[i].setVisible(true);
          } else {
            arrayOfMarkers[i].setVisible(false);
          }
        }
      }
      var filter = self.filter().toLowerCase();
      if (!filter) {
        for (var j = 0; j < arrayOfMarkers.length; j++){
          arrayOfMarkers[j].setVisible(true);
        }
      }
    }, self.filteredItems, arrayOfMarkers);

    self.selectBeer = function(data, event) {
        self.markerReset();
        var selectedMarker;
        var nameClicked = $(event.target).text();
        for (var i = 0; i < self.beerList().length; i++){
            if (nameClicked === self.beerList()[i].name()) {
              selectedMarker = arrayOfMarkers[i];
              arrayOfMarkers[i].setIcon(selectedIcon);
              self.currentLocation(nameClicked);
            }
        }
        $(event.target).css("color", selectedColor);
        google.maps.event.trigger(selectedMarker, "click");
    };

  self.drawMap();

};  //ViewModel

function initialize(){
   "use strict";
    ko.applyBindings(new ViewModel());
}

window.onload = loadScript;

// Request API access: http://www.yelp.com/developers/getting_started/api_access
var Yelp = require('yelp');

var yelp = new Yelp({
  consumer_key: 'qFWyVzFIKPXKkGvIb9GguQ',
  consumer_secret: 'mCB7OIoZbSBYBCSSiCRXNvLh_bQ',
  token: 'Jh7AVi2oGw1oNuVo1qiZHg4iYv9lb2ba',
  token_secret: '3DR3IHfnLAJ_M-t6kjUJOsl4cG4'
});

// See http://www.yelp.com/developers/documentation/v2/search_api
yelp.search({ term: 'food', location: 'Montreal' })
.then(function (data) {
  "use strict";
  console.log(data);
})
.catch(function (err){
  "use strict";
  console.error(err);
});

// See http://www.yelp.com/developers/documentation/v2/business
yelp.business('yelp-san-francisco')
  .then(console.log)
  .catch(console.error);

yelp.phoneSearch({ phone: '+15555555555' })
  .then(console.log)
  .catch(console.error);

// A callback based API is also available:
yelp.business('yelp-san-francisco', function(err, data) {
  "use strict";
  if (err){ return console.log("error"); }
  console.log(data);
});
