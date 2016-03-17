/*eslint-env browser, jquery, node*/
/*global ko, google, OAuth*/
"use strict";
var beers = [
  {name: "Linden Street Brewery", lat: 37.7994985, lng: -122.2879045, phone: "+15102518898"},
  {name: "Pacific Coast Brewing Co", lat: 37.8015344, lng: -122.2741712, phone: "+15108362739"},
  {name: "Diving Dog Brewhouse", lat: 37.8076629, lng: -122.2696182, phone: "+15103061914"},
  {name: "Beer Revolution", lat: 37.7971749, lng: -122.2762197, phone: "+15104522337"},
  {name: "The Trappist", lat: 37.8005481, lng: -122.2741687, phone: "+15102388900"},
  {name: "Drake’s Dealership", lat: 37.8125182, lng: -122.2661527, phone: "+15108336649"},
  {name: "Lost & Found", lat: 37.8101575, lng: -122.2691598, phone: "+15107632040"},
  {name: "Woods Bar & Brewery", lat: 37.8070162, lng: -122.2705888, phone: "+15107618617"},
  {name: "Independent Brewing Co.", lat: 37.7964226, lng: -122.2712658, phone: "+15106982337"},
  {name: "Ale Industries", lat: 37.7762289, lng: -122.2281795, phone: "+19254705280"}
];

var Location = function(data){
  this.name = ko.observable(data.name);
  this.lat = ko.observable(data.lat);
  this.lng = ko.observable(data.lng);
  this.phone = ko.observable(data.phone);
  this.stars = ko.observable();
  this.desc = ko.observable();
  this.address0 = ko.observable();
  this.address1 = ko.observable();
  this.address2 = ko.observable();
  this.displayPhone = ko.observable();
};



function loadScript() {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyB82oaqh1VTxwsHD3XH5ZjFi5CFMBFQdvE" + "&callback=initialize";
  script.onerror = function(){
    alert("Google maps could not be loaded" );
  };

  document.body.appendChild(script);
}



var ViewModel = function(){
  var self = this;
  var selectedIcon = "https://www.google.com/mapfiles/marker.png",
        unselectedIcon = "https://www.google.com/mapfiles/marker_green.png",
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

    for (var i = 0; i < self.beerList().length; i++) {
        //Yelp OAuth Example with Javascript: https://gist.github.com/kennygfunk/c24c8a2ea71c9ce7f4fc
        var auth = {
        //
        // Update with your auth tokens.
        //
        consumerKey: "qFWyVzFIKPXKkGvIb9GguQ",
        consumerSecret: "mCB7OIoZbSBYBCSSiCRXNvLh_bQ",
        accessToken: "W5N9KRmGnciuZenun9HOVsGY2UHy2sja",
        // This example is a proof of concept, for how to use the Yelp v2 API with javascript.
        // You wouldn't actually want to expose your access token secret like this in a real application.
        accessTokenSecret: "ErBWeQIdAGrL9MlGE2m6nUxG2IM",
        serviceProvider: {
        signatureMethod: "HMAC-SHA1"
        }
      };
      var phoneNum = self.beerList()[i].phone();
      var accessor = {
        consumerSecret: auth.consumerSecret,
        tokenSecret: auth.accessTokenSecret
      };
      var parameters = [];
      parameters.push(["phone", phoneNum]);
      parameters.push(["callback", "cb"]);
      parameters.push(["oauth_consumer_key", auth.consumerKey]);
      parameters.push(["oauth_consumer_secret", auth.consumerSecret]);
      parameters.push(["oauth_token", auth.accessToken]);
      parameters.push(["oauth_signature_method", "HMAC-SHA1"]);
      var message = {
        "action": "https://api.yelp.com/v2/phone_search",
        "method": "GET",
        "parameters": parameters
      };
      OAuth.setTimestampAndNonce(message);
      OAuth.SignatureMethod.sign(message, accessor);
      var parameterMap = OAuth.getParameterMap(message.parameters);
      parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature);

      //closure to apply yelp data to the observable array
      (function(i) {
          $.ajax({
            "url": message.action,
            "data": parameterMap,
            "cache": true,
            "dataType": "jsonp",
            //'jsonpCallback' : 'cb',
            "success": function(data, textStats, XMLHttpRequest) {
              self.beerList()[i].stars(data.businesses[0].rating_img_url);
              self.beerList()[i].desc(data.businesses[0].snippet_text);
              self.beerList()[i].address0(data.businesses[0].location.display_address[0]);
              self.beerList()[i].address1(data.businesses[0].location.display_address[1]);
              self.beerList()[i].address2(data.businesses[0].location.display_address[2]);
              self.beerList()[i].displayPhone(data.businesses[0].display_phone);

              var contentString = "<div id=\"content\">" +
                "<h2 class=\"infoName\">" + self.beerList()[i].name() + "</h2>" +
                "<div><img src=\"" + self.beerList()[i].stars() + "\" /></div>" +
                "<div>" + self.beerList()[i].desc() + "</div>" +
                "<div>" + self.beerList()[i].address0() + "</div>" +
                "<div>" + self.beerList()[i].address1() + "</div>" +
                "<div>" + self.beerList()[i].address2() + "</div>" +
                "<div>" + self.beerList()[i].displayPhone() + "</div>" +
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
            }
          });
        })(i); //end closure
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
          return ko.utils.arrayFilter(self.beerList(), function(BeerLoc) {
              return self.stringStartsWith(BeerLoc.name().toLowerCase(), filter);
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
  console.log(self.beerList());

};  //ViewModel

function initialize(){
    ko.applyBindings(new ViewModel());
}

window.onload = loadScript;

