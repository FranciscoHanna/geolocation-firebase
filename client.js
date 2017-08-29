var socket = io.connect('https://nameless-lake-37951.herokuapp.com/');

// Receive database updates
socket.on('data-update', function (data) {
  console.log(data);
});

var result = document.getElementById("result");

if(navigator.geolocation)
  navigator.geolocation.getCurrentPosition(showPosition, showError);
else
  result.innerHTML = "Geolocation is not supported by this browser.";

// Show position
function showPosition(position) {
  var pos = {
    "date":             new Date(position.timestamp).toISOString(),
    "latitude":         position.coords.latitude,
    "longitude":        position.coords.longitude,
    "altitude":         position.coords.altitude,
    "accuracy":         position.coords.accuracy,
    "altitudeAccuracy": position.coords.altitudeAccuracy,
    "heading":          position.coords.heading,
    "speed":            position.coords.speed
  };
  
  result.innerHTML = 
  "Date: " +  pos.date + "<br><br>" + 
  "Latitude: " + pos.latitude + "<br>" + 
  "Longitude: " + pos.longitude + "<br>" +
  "Altitude: " + pos.altitude + "<br><br>" +
  "Accuracy: " + pos.accuracy + "<br>" +
  "Altitude Accuracy: " + pos.altitudeAccuracy + "<br><br>" +
  "Heading: " + pos.heading + "<br>" +
  "Speed: " + pos.speed;
  socket.emit('new-data', pos);
}

// Geolocation API error handler
function showError(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
    result.innerHTML = "User denied the request for Geolocation."
    break;
    case error.POSITION_UNAVAILABLE:
    result.innerHTML = "Location information is unavailable."
    break;
    case error.TIMEOUT:
    result.innerHTML = "The request to get user location timed out."
    break;
    case error.UNKNOWN_ERROR:
    result.innerHTML = "An unknown error occurred."
    break;
  }
}