//I'm still pretty novice with nodejs
const express = require('express');
const path = require('path');
var app = express();
const request = require('request');

const fs = require('fs');
const parse = require('csv-parser');
var results = [];

// console.log(__dirname)
// console.log(path.join(__dirname))

const file = "./public/data/GeoLite2-City-Blocks-IPv4.csv";
const geo = "./public/data/points.geojson";
// https://www.npmjs.com/package/csv-parser
// used a library to save time. 
try {
    if (!fs.existsSync(geo)) {
        fs.createReadStream(file)
            .pipe(parse())
            .on('data', data => {
                //I like to build it into a temporary variable
                let temp = {
                    "type": "Feature",
                    "properties": {
                        "dbh": '1'
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [data.longitude, data.latitude]
                    }
                }
                results.push(temp)
            })
            .on('end', () => {
                fs.writeFileSync(geo, JSON.stringify(results));
            })
    }
    else {
        results = (JSON.parse(fs.readFileSync(geo)));
        // console.log("else", results)
        console.log("File already exists and does not need to be generated.");
    }
} catch (err) {
    console.error(err);
}




const PORT = process.env.PORT || 5000;
app.use(express.static(path.join(__dirname + "/public")))
app.get('/', (req, res) => {
    // if(!req.query) {
    //     console.log(req.query)
    // }
    res.sendFile(path.join(__dirname + "/public/index.html"));
    console.log("site loaded?")
})
app.get('/bounds', (req, res) => {
    if (!req.query.topLng || !req.query.topLat 
        || !req.query.btmLng || !req.query.btmLat) {
        console.error("No query sent");
    }
    else {
        console.log(req.query.topLng, req.query.topLat, req.query.btmLng, req.query.btmLat);
        res.send(getPoints(req.query.topLng, req.query.topLat, req.query.btmLng, req.query.btmLat));
    }
})
app.listen(PORT);


function getPoints(topLng, topLat, btmLng, btmLat) {
    // console.log("getPoints")
    const arr = [{
        "type": "FeatureCollection",
        "features": [],
    }];
    // arr[0]["features"]
    // console.log(results)
    for(let i = 0; i < 15; i++) {
        let point  = results[i].geometry.coordinates;
        // console.log(results[i].geometry.coordinates)
        // console.log("coords: ", topLng, btmLng, topLat, btmLat);
        // console.log(point[0] , ", ", point[1])
        if(point[0] <= topLng &&
            point[0] >= btmLng &&
            point[1] <= topLat &&
            point[1] >= btmLat) {
                // console.log("who hurt you?")
                arr[0]["features"].push(results[i]);
            }
    }

    // console.log(arr);
    return arr[0];
}



