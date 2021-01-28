//I'm still pretty novice with nodejs
const express = require('express');
const path = require('path')
var app = express();
const request = require('request');

const fs = require('fs');
const parse = require('csv-parser');
const results = [];

// console.log(__dirname)
// console.log(path.join(__dirname))

const file = "./public/data/GeoLite2-City-Blocks-IPv4.csv";
// https://www.npmjs.com/package/csv-parser
// used a library to save time. 
try {
    if (!fs.existsSync("./points.geojson")) {
        fs.createReadStream(file)
            .pipe(parse())
            .on('data', data => {
                //I like to build it into a temporary variable
                let temp = {
                    "type": "Feature",
                    "properties": {
                        "dbh": 1
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [data.longitude, data.latitude]
                    }
                }
                results.push(temp)
            })
            .on('end', () => {
                fs.writeFileSync("./points.geojson", JSON.stringify(results));
            })
    }
    else {
        console.log("File already exists and does not need to be generated.");
    }
} catch (err) {
    console.error(err);
}


const PORT = process.env.PORT || 5000;
app.use(express.static(path.join(__dirname + "/public")))
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + "/public/index.html"));
})
app.get('/request?top=&btm=', (req, res) => {
    if (!req.query.top || !req.query.btm) {
        console.error("No query sent");
    }
    else {
        console.log(req.query.topLng, req.query.topLat, req.query.btmLng, req.query.btmLat);
        res.send(getPoints(req.query.topLng, req.query.topLat, req.query.btmLng, req.query.btmLat));
    }
})
app.listen(PORT);


function getPoints(topLng, topLat, btmLng, btmLat) {
    var arr = [{
        "type": "FeatureCollection",
        "features": [],
    }];
    arr[0]["features"] = results.filter(
        point => {
            point[0] <= topLng &&
                point[0] >= btmLng &&
                point[1] <= topLat &&
                point[1] >= btmLat
        }
    );
    console.log(arr);
    return arr;
}



