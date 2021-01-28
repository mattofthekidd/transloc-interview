//I'm still pretty novice with nodejs
const express = require('express');
const path = require('path');
var app = express();
const mapboxgl = require('mapbox-gl');

const fs = require('fs');
const parse = require('csv-parser');
const PORT = process.env.PORT || 5000;
var results = [];
const file = "./public/data/GeoLite2-City-Blocks-IPv4.csv";
const geoJson = "./public/data/points.geojson";

// https://www.npmjs.com/package/csv-parser
// used a library to save time. 
function loader() {
    try {
        if (!fs.existsSync(geoJson)) {
            //Format the csv into an appropriate format for later filtering.
            fs.createReadStream(file)
                .pipe(parse())
                .on('data', data => {
                    let temp = {
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [data.longitude, data.latitude]
                        }
                    }
    else {
        results = (JSON.parse(fs.readFileSync(geo)));
        console.log("File already exists and does not need to be generated.");
                console.log("no geojson present so one has been generated.")
        }
        else {
            results = (JSON.parse(fs.readFileSync(geoJson)));
            console.log("geojson file already exists and does not need to be generated.");
        }
    } catch (err) {
        console.error(err);
    }
} catch (err) {
    console.error(err);
}


const PORT = process.env.PORT || 5000;
app.use(express.static(path.join(__dirname + "/public")))
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + "/public/index.html"));
    console.log("site loaded?")
app.get('/bounds', (req, res) => {
    }
//I'd like to get this a little more streamlined or even find some method of grouping data.
//Avoiding that for now as I'm not sure what would make meaningful groupings that wouldn't also
// increase runtime by adding a bunch of new loops.
function getPoints(topLng, topLat, btmLng, btmLat) {
    var bounds = new mapboxgl.LngLatBounds(
        new mapboxgl.LngLat(btmLng, btmLat),
        new mapboxgl.LngLat(topLng, topLat)
    );

    const arr = {
        "type": "FeatureCollection",
        "features": [],
    };
    //I hate this but it needs to check every record everytime we want an update.
    //Theoretically grouping the IPs by the whole number in longitude and latitude 
    //  and then checking that against the bounds.
    for (let i = 0; i < results.length; i++) {
        let point = new mapboxgl.LngLat(results[i].geometry.coordinates[0], results[i].geometry.coordinates[1]);

        if (bounds.contains(point)) {
            arr["features"].push(results[i]);
        }
    }
    return arr;
}

//In a function because it looks nicer this way.
function startServer() {
    app.use(express.static(path.join(__dirname + "/public")))
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname + "/public/index.html"));
        console.log("site loaded?")
    })
    app.get('/bounds', (req, res) => {
        if (!req.query.topLng || !req.query.topLat
            || !req.query.btmLng || !req.query.btmLat) {
            console.error("No query sent");
        }
        else {
            //For ease of implementation I split these all up while sending them around.
            // In a perfect world I'd send it as a proper JSON but I saw some funny
            //  business when I left them grouped and having them seperate makes it very clear
            // (in my mind) what they are each for.
            res.send(getPoints(req.query.topLng, req.query.topLat, req.query.btmLng, req.query.btmLat));
        }
    })
    app.listen(PORT);
}

loader();
startServer();