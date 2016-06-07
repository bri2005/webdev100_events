var googleAPIKey = "AIzaSyCcaaXYqpPCR9Bupo5Xev2mKNJiv85ozms";
var map;
var myEvents = [];
var googleMapMarkers = [];

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    //default to Long Island City!
    center: {lat: 40.7446840, lng: -73.9502360},
    zoom: 15
  });
  var infoWindow = new google.maps.InfoWindow({map: map});

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      //infoWindow.setPosition(pos);
      //infoWindow.setContent('Location found.');
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  loadEvents();
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}


/*
 * Get the json file from Google Geo
 */

function Convert_LatLng_To_Address(event, address, callback) {
    url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&sensor=false&key=" + googleAPIKey;
    console.log(url);

    jQuery.getJSON(url, function (json) {
      console.log("JSON returned is "+JSON.stringify(json));
      Create_Address(event, json, callback);
    });        
}

//Code to get a lat/long from an address..
var latitude;
var longitude;

/*
* Create an address out of the json    
*/
function Create_Address(event, json, callback) {
    
    if (!check_status(json)) // If the json file's status is not ok, then return
      return 0;
    latitude = json["results"][0]["geometry"]["location"]["lat"];
    longitude = json["results"][0]["geometry"]["location"]["lng"];
    
    console.log("Latitude: " + latitude);
    console.log("Longitude: " + longitude);

    var result = "The latitude is " + latitude + " and longitude is " + longitude;

    var imageURL = "";

    console.log("Event type is "+event.tag);

    //add a marker icon based on the event type
    switch (event.tag.toLowerCase()) {
        case "drinking":
          imageURL = "img/beer.png";
          break;
        case "art":
          imageURL = "img/art.png";
          break;
        case "food":
          imageURL = "img/food.png";
          break;
        case "music":
          imageURL = "img/music.png";
          break;
        case "theater":
          imageURL = "img/theater.png";
          break;
        default:
          imageURL = "img/music.png";
          break;
    }

    console.log("Event icon will be "+imageURL);

    addMarker(event.id, { lat: latitude, lng: longitude}, map, imageURL);
    
    console.log (result); 
}

/* 
 * Check if the json data from Google Geo is valid 
 */
function check_status(json) {
    if (json["status"] == "OK") return true;
    console.log("Something wrong with the JSON..");

    return false;
}


function addToEvents(event) {
  console.log("Adding to events: "+event.id + ": "+event.title);
  myEvents.push(event);
}


//return back HTML that will draw the table
function writeTable(eventsList) {

    console.log("writeTable called - length: "+eventsList.length);
    var tableHTML = "";
    for (i=0; i<eventsList.length; i++) {
        tableHTML = "<tr>";
        tableHTML = tableHTML + "<td>" + eventsList[i].id + "</td>";
        tableHTML = tableHTML + "<td>" + eventsList[i].title + "</td>";
        tableHTML = tableHTML + "<td>" + eventsList[i].description + "</td>";
        tableHTML = tableHTML + "<td>" + eventsList[i].startTime + "</td>";
        tableHTML = tableHTML + "<td>" + eventsList[i].endTime + "</td>";
        tableHTML = tableHTML + "</tr>";

        console.log("TableHTML: "+tableHTML);
        $("#eventsTable tbody").append(tableHTML);
    }
    console.log("TableHTML: "+tableHTML);
}

function lookupAddresses(events) {
          for (i=0; i<events.length; i++) {

              //$("#eventsTextbox").text($("#eventsTextbox").text() + myEvents[i].title);
              address = events[i].address1 + " " + events[i].address2 + " " + events[i].address3;
              console.log("Looking up address: "+address);
              Convert_LatLng_To_Address(events[i], address, alertLatLng);      
          }
}


function loadEvents() {

      //load dummy data for now...from MongoDB later!

      //check whether cookies file already has data, if not load JSON file into cookie
      var eventsJSON = Cookies.get("events");
      //var eventsJSON;

      if (eventsJSON == undefined) {

        console.log("Events cookie empty, reading from file and writing cookie.."); 
        eventsJSON = "data/dummy_events.json";

        //read from JSON and add to events array
        $.getJSON( eventsJSON, function( data ) {
          $.each(data, function(i, item) {
              console.log("Adding event: "+data[i].id);
               addToEvents(data[i]);
          });

          lookupAddresses(myEvents);
          writeTable(myEvents);   

          //set the events cookie for later use
          Cookies.set("events", JSON.stringify(myEvents));
          console.log("Cookie written..");
        })
        .done(function() { console.log("JSON events list parsed OK") })
        .fail(function(jqXHR, textStatus, errorThrown) { alert('getJSON request failed! ' + textStatus + errorThrown); })
        .always(function() { console.log("JSON events list parsing finished"); });   

      }

      else {

        console.log("Events cookie found:"); 
        console.log(eventsJSON);

        eventsJSON = eventsJSON.replace(/\n/g,"");
        eventsJSON = eventsJSON.replace(/\[\"/g,"[");
        eventsJSON = eventsJSON.replace(/\"\]/g,"]");
        eventsJSON = eventsJSON.replace(/\"\{/g,"{");

        console.log("Cookie after cleanup: "+eventsJSON);

        //remove line breaks
        var events = JSON.parse(eventsJSON);  

        //add to events
        for (var i=0; i<events.length; i++) {
          addToEvents(events[i]);  
        }

        //lookup the addresses
        lookupAddresses(myEvents);

        //draw a table on the page
        writeTable(myEvents);     
      }

}

function alertLatLng() {
      var result = "The latitude is " + latitude + " and longitude is " + longitude;
      addMarker({ lat: latitude, lng: longitude}, map);
      console.log (result); 
}

// add marker to the map
function addMarker(id, location, map) {
  // Add the marker at the clicked location, and add the next-available label
  // from the array of alphabetical characters.
  var marker = new google.maps.Marker({
    position: location,
    label: id,
    map: map
  });

}

// add marker to the map
function addMarker(event, location, map, imageURL) {

  //resize icon
  var icon = {
    url: imageURL, // url
    scaledSize: new google.maps.Size(30, 30), // scaled size
};

  // Add the marker at the clicked location, and add the next-available label
  // from the array of alphabetical characters.
  var marker = new google.maps.Marker({
    position: location,
    map: map,
    icon: icon,
    label: event.tag
  });

  //add marker to the markers array
  googleMapMarkers.push(marker);

}



    