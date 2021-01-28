'use strict'
const mapboxgl = require('mapbox-gl');
const PORT = process.env.PORT || 5000;
const results = [];

// https://www.npmjs.com/package/csv-parser
// used a library to save time. 
function loader() {
    const fs = require('fs');
    const parse = require('csv-parser');
    const file = "./public/data/GeoLite2-City-Blocks-IPv4.csv";

    try {
        if (!!fs.existsSync(file)) {
            //We have no cached version to use but we have the original document still
            //Format the csv into an appropriate format for later filtering.
            fs.createReadStream(file)
                .pipe(parse())
                .on('data', data => {
                    if (!results[Math.floor(data.longitude)]) {
                        results[Math.floor(data.longitude)] = [];
                    }
                    results[Math.floor(data.longitude)].push([data.longitude, data.latitude])
                })
                .on('end', () => {
                    console.log("Parsing complete.");
                })
        }
        else {
            //Something wonky happened
            throw err;
        }
    } catch (err) {
        console.error(err);
    }
}

function getPointsHelper(bounds, arr, floor) {
    for (let i = 0; i < results[floor].length; i++) {
        let point = new mapboxgl.LngLat(results[floor][i][0], results[floor][i][1]);
        if (bounds.contains(point)) {
            arr["features"].push({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": results[floor][i]
                }
            });
        }
    }
    return arr;
}

function getPoints(topLng, topLat, btmLng, btmLat) {
    var bounds = new mapboxgl.LngLatBounds(
        new mapboxgl.LngLat(btmLng, btmLat),
        new mapboxgl.LngLat(topLng, topLat)
    );
    let arr = {
        "type": "FeatureCollection",
        "features": [],
    };
    let topFloor = Math.floor(topLng);
    let btmFloor = Math.floor(btmLng);
    if (topFloor != btmFloor) {
        arr = getPointsHelper(bounds, arr, btmFloor);
    }
    arr = getPointsHelper(bounds, arr, topFloor);
    return arr;
}

//In a function because it looks nicer this way.
function startServer() {
    const express = require('express');
    const path = require('path');
    var app = express();
    app.use(express.static(path.join(__dirname + "/public")))
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname + "/public/index.html"));
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