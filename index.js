'use strict'

const mapboxgl = require('mapbox-gl');

const PORT = process.env.PORT || 5000;
const results = [];
// const geoJson = "./public/data/points.json";

// https://www.npmjs.com/package/csv-parser
// used a library to save time. 
function loader() {
    const fs = require('fs');
    const parse = require('csv-parser');
    const file = "./public/data/GeoLite2-City-Blocks-IPv4.csv";

    try {
        // if (fs.existsSync(geoJson)) {
        //         // we have an unzipped verson we can load
        //         // let x = JSON.parse(fs.readFileSync(geoJson));
        //         results = JSON.parse(fs.readFileSync(geoJson));
        //         console.log("Processed file already exists and does not need to be generated.");
        // }
        if (!!fs.existsSync(file)) {
            //We have no cached version to use but we have the original document still
            //Format the csv into an appropriate format for later filtering.
            fs.createReadStream(file)
                .pipe(parse())
                .on('data', data => {
                    // let temp = {
                    //     "type": "Feature",
                    //     "geometry": {
                    //         "type": "Point",
                    //         "coordinates": [data.longitude, data.latitude]
                    //     }
                    // }
                    if (!results[Math.floor(data.longitude)]) {
                        results[Math.floor(data.longitude)] = [];
                    }
                    results[Math.floor(data.longitude)].push([data.longitude, data.latitude])
                })
                .on('end', () => {
                    console.log("Parsing complete.")
                    // fs.writeFileSync(geoJson, JSON.stringify(results));
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

//I'd like to get this a little more streamlined or even find some method of grouping data.
//Avoiding that for now as I'm not sure what would make meaningful groupings that wouldn't also
// increase runtime by adding a bunch of new loops.
function getPoints(topLng, topLat, btmLng, btmLat) {
    var bounds = new mapboxgl.LngLatBounds(
        new mapboxgl.LngLat(btmLng, btmLat),
        new mapboxgl.LngLat(topLng, topLat)
    );

    let arr = {
        "type": "FeatureCollection",
        "features": [],
    };
    //I hate this but it needs to check every record everytime we want an update.
    //Theoretically grouping the IPs by the whole number in longitude and latitude 
    //  and then checking that against the bounds.
    let topFloor = Math.floor(topLng);
    let btmFloor = Math.floor(btmLng);
    if (topFloor != btmFloor) {
        for (let i = 0; i < results[btmFloor].length; i++) {
            let point = new mapboxgl.LngLat(results[btmFloor][i][0], results[btmFloor][i][1]);
            if (bounds.contains(point)) {
                arr["features"].push({
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": results[btmFloor][i]
                    }
                });
            }
        }
    }
    for (let i = 0; i < results[topFloor].length; i++) {
        let point = new mapboxgl.LngLat(results[topFloor][i][0], results[topFloor][i][1]);
        if (bounds.contains(point)) {
            arr["features"].push({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": results[topFloor][i]
                }
            });
        }
    }
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