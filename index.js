const PORT = process.env.PORT || 5000

var http = require('http');
var fs = require('fs');

http.createServer(function (req, res) {
    fs.readFile('main.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    })
}).listen(PORT);



// var mapboxgl = require('node_modules/mapbox-gl/dist/mapbox-gl.js');

// mapboxgl.accessToken = 'pk.eyJ1IjoibWF0dG9mdGhla2lkZCIsImEiOiJja2tkY3JkbnMxOGg2Mm5yMXM5NXh0NHJvIn0.K9SZJvVIB-OqdXad0Kf9tg';
// var map = new mapboxgl.Map({
//   container: '#mapDiv',
//   style: 'mapbox://styles/mapbox/streets-v11'
// });

// var mapboxgl = require('node_modules/mapbox-gl/dist/mapbox-gl.js');

// mapboxgl.accessToken = 'pk.eyJ1IjoibWF0dG9mdGhla2lkZCIsImEiOiJja2tkY3JkbnMxOGg2Mm5yMXM5NXh0NHJvIn0.K9SZJvVIB-OqdXad0Kf9tg';
// var map = new mapboxgl.Map({
//   container: 'mapDiv',
//   style: 'mapbox://styles/mapbox/streets-v11'
// });
