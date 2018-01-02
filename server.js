var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var path = require('path');
var firebase = require('firebase');

// Init firebase connection
var fb = firebase.initializeApp({
  apiKey:         "AIzaSyBKn3vdfTGJahh1oVnzxjYN6ofaMDufkeA",
  databaseURL:    "https://geolocation-firebase.firebaseio.com/",
});

// Handler requests to the web server
function handler (request, response) {
  console.log('request starting...');
	var filePath = '.' + request.url;
	if (filePath == './')
		filePath = './index.html';
  
  // Check file type for response headers
	var extension = path.extname(filePath);
	var contentType = 'text/html';
	switch (extension) {
		case '.js':
			contentType = 'text/javascript';
			break;
		case '.css':
			contentType = 'text/css';
			break;
	}
  
  // Check if static file exists
	fs.exists(filePath, function(exists) {
		if (exists) {
			fs.readFile(filePath, function(error, content) {
				if (error) {
					response.writeHead(500);
					response.end();
				}
				else {
					response.writeHead(200, { 'Content-Type': contentType });
					response.end(content, 'utf-8');
				}
			});
		}
		else {
			response.writeHead(404);
			response.end();
		}
	});
}

app.listen(process.env.PORT || 3000);
console.log('Server running at https://nameless-lake-37951.herokuapp.com/');

// Set socket event listeners on connection
io.on('connection', function (socket) {
  socket.on('new-data', function (data) {
    saveToFirebase(data);
  });
})

// Listen for updates on Firebase databse
var positiosRef = firebase.database().ref('positions');
positiosRef.on('value', function(snapshot) {
  io.emit('data-update', snapshot.val());
});

// Receive a new position and saves it to Firebse's database
function saveToFirebase(pos) {
  // Get a key for a new Post.
  var newPosKey = firebase.database().ref().child('positions').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/positions/' + newPosKey] = pos;

  return firebase.database().ref().update(updates);
}
