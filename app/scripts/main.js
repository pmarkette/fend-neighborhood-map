var beers = [
  {name: "Linden Street Brewery", lat: 37.7994396, lng: -122.2882671},
  {name: "The Beer Shed", lat: 37.7995263, lng: -122.2898785},
  {name: "Diving Dog Brewhouse", lat: 37.8077394, lng: -122.2720127},
  {name: "Beer Revolution", lat: 37.797173, lng: -122.2784187},
  {name: "The Trappist", lat: 37.8005888, lng: -122.2763285},
  {name: "Drake’s Dealership", lat: 37.8126375, lng: -122.2686281},
  {name: "Lost & Found", lat: 37.8101617, lng: -122.271404},
  {name: "Woods Bar & Brewery", lat: 37.807009, lng: -122.2726781},
  {name: "Independent Brewing Co.", lat: 37.796432, lng: -122.2734581},
  {name: "Ale Industries", lat: 37.776209, lng: -122.2303851}
];

var Location = function(data){
    this.name = ko.observable(data.name);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);
};

function initialize(){
   "use strict";
    ko.applyBindings(new viewModel());
}

function loadScript() {
  "use strict";
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyB82oaqh1VTxwsHD3XH5ZjFi5CFMBFQdvE" + "&callback=initialize";
  script.onerror = function(){
    alert("Oops! Google maps could not be loaded, please try again later." );
  };

  document.body.appendChild(script);
}



var viewModel = function(){
  var self = this;

  var selectedIcon = 'http://www.google.com/mapfiles/marker.png',
        unselectedIcon = 'http://www.google.com/mapfiles/marker_green.png',
        selectedColor = 'red',
        unselectedColor = 'green';

  self.beerList = ko.observableArray([]);
  var arrayOfMarkers = [];

  self.filter = ko.observable("");
  self.currentLocation = ko.observable("Oakland, CA");

  beers.forEach(function(placeItem){
    self.beerList.push(new Location(placeItem));
  });

  this.drawMap = function() {
    var mapOptions = {
        zoom: 13,
        center: new google.maps.LatLng(37.8067098, -122.2807331),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementsByClassName('map-canvas')[0], mapOptions);

    var i;
    for (i = 0; i < self.beerList().length; i++) {

        var contentString = "<div id=\"content\">" + "<h3>" + self.beerList()[i].name() + "</h3>" + "</div>";
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
    }

  };

  self.markerReset = function(){
    for (var i = 0; i < arrayOfMarkers.length; i++){
      arrayOfMarkers[i].setIcon(unselectedIcon);

      $("h3").css("color", unselectedColor);
    }
  };

  self.stringStartsWith = function (string, startsWith) {
        string = string || "";
        if (startsWith.length > string.length)
        return false;
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

};  //viewModel

window.onload = loadScript;
