var ViewModel = function () {
  //initial data
  var map;
  var locations = [{
      title: 'Arkan',
      location: {
        lat: 30.021184,
        lng: 31.003384
      }
    },
    {
      title: 'Galleria',
      location: {
        lat: 30.017356,
        lng: 31.000895
      }
    },
    {
      title: 'Nile University',
      location: {
        lat: 30.012153,
        lng: 30.986132
      }
    },
    {
      title: 'Mall of Arabia',
      location: {
        lat: 30.006764,
        lng: 30.973472
      }
    },
    {
      title: '6th of October Educational City',
      location: {
        lat: 29.997063,
        lng: 31.013641
      }
    }


  ];
  var largeInfowindow = new google.maps.InfoWindow();
  this.markers = [];
  this.LiveLocations = ko.observableArray();
  this.filteredField = ko.observable("");

  //make the info window when click a marker
  function populateInfoWindow(marker, infowindow) {

    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      // Clear the infowindow content to give the streetview time to load.
      infowindow.setContent('');
      infowindow.marker = marker;
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function () {
        infowindow.marker = null;
      });
    }

    client_id = "2PAZUDN2GMMEMOX4WYXW4I4TS43AIIZZDESYQQC1YYKT5YJS";
    client_secret = "X3O4F2JIX0SLCSXSNPGBLDO4BHKTLZBJQRIVLBGMC4XF3DDC";
    var base_url = 'https://api.foursquare.com/v2/';
    var endpointSearch = 'venues/search?ll=';
    var endpointQuery = '&query='
    var title = marker.title;
    //get the title of the marker,replace spaces with %20 and convert all to lowercase
    var query = marker.title.toLocaleLowerCase().replace(/ /g, '%20');
    //lat and lng of the current marker 
    var params = marker.getPosition().lat() + ',' +
      marker.getPosition().lng();
    var key = '&client_id=' + client_id +
      '&client_secret=' + client_secret + '&v=' + '20140626';
    // the url to send request for the information of the current marker
    var url = base_url + endpointSearch + params + endpointQuery + query + key;
    $.getJSON(url)
      .done(function (marker) {
        var response = marker.response.venues[0];
        self.street = response.location.formattedAddress[0];
        self.city = response.location.formattedAddress[1];
        //store the data in html form
        self.infowindowContent = '<div>' +
          '<h2>' + title + '<h2>' +
          '<h3> Address: </h3>' +
          '<p>' + self.street + '</p>' +
          '<p>' + self.city + '</p>' +
          '</div>';
        // add the data to the info window 
        infowindow.setContent(self.infowindowContent);

      }).fail(function (error) {
        alert("there is a problem while sending fourquare request");
      });
    //open the info window
    infowindow.open(map, marker);

  };
  // filter the listed locations
  this.filter = function () {
    //clear the list which appear on the view
    this.LiveLocations.removeAll();
    //compare the locations list with user input
    for (var i = 0; i < locations.length; i++) {

      if (locations[i].title.toLocaleLowerCase().includes(this.filteredField().toLocaleLowerCase())) {
        // add the correct elements to the list
        this.LiveLocations.push(this.markers[i]);
      }
    }
    this.hideFilteredListings();


  };
  //hide undesired markers on the map
  this.hideFilteredListings = function () {
    // hide all markers 
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
    // show the markers that include the user input
    for (var i = 0; i < this.LiveLocations().length; i++) {
      if (this.markers.includes(this.LiveLocations()[i])) {
        this.markers[i].setMap(map);
      }
    }
  };
  // animate markers on select
  this.toggleBounce = function () {
    this.setAnimation(google.maps.Animation.BOUNCE);
    //stop the animation after a time
    setTimeout((function () {
      this.setAnimation(null);
    }).bind(this), 2000);
    populateInfoWindow(this, largeInfowindow);

  };
  this.initMap = function () {


    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: 30.016066,
        lng: 31.014143
      },
      zoom: 13,

      mapTypeControl: false
    });

    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {
      // Get the position from the location array.
      this.position = locations[i].location;
      this.title = locations[i].title;
      // Create a marker per location, and put into markers array.
      this.marker = new google.maps.Marker({
        position: this.position,
        title: this.title,
        animation: google.maps.Animation.DROP,
        id: i
      });

      // Push the marker to our array of markers.

      this.markers.push(this.marker);
      // function to call populateInfoWindow window and pass paramaters 
      function callinfo() {
        populateInfoWindow(this, largeInfowindow);
      }
      // animate the marker on click
      this.marker.addListener('click', function () {
        if (this.getAnimation() !== null) {
          this.setAnimation(null);
        } else {
          this.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout((function () {
            this.setAnimation(null);
          }).bind(this), 2000);
        }
      });
      //call info window on click
      this.marker.addListener('click', callinfo);
      // show marker on map
      this.marker.setMap(map);
    }
    // add all markers to a list appear on the view
    for (var i = 0; i < this.markers.length; i++) {
      this.LiveLocations.push(this.markers[i]);
    }

  };

  //call the main function to initialize the map
  this.initMap();

}
function gotERROR(){
  aler("can't load Google map");
}
function bind() {
  ko.applyBindings(new ViewModel());
}