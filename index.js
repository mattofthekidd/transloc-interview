//I'm still pretty novice with nodejs
const express = require('express');
const path = require('path')
const fs = require('fs');
const parse = require('csv-parser');
var app = express();
const results = [
    {
        "type": "FeatureCollection",
        "features": [],
    }
];

const PORT = process.env.PORT || 5000;
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + "/index.html"));
})
app.listen(PORT);

const file = "./public/data/GeoLite2-City-Blocks-IPv4.csv";
// https://www.npmjs.com/package/csv-parser
// used a library to save time. 
fs.createReadStream(file)
    .pipe(parse())
    .on('data', data => {
        let temp = {
            "type": "Feature",
            "properties": {
                "network": data.network,
                "dbh": 1
            },
            "geometry": {
                "type": "Point",
                "coordinates": [data.latitude, data.longitude]
            }
        }
        results[0]["features"].push(temp)
    })
    .on('end', () => {
        // console.log(results[0]["features"])
    })

    /*
    {
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [125.6, 10.1]
  },
  "properties": {
    "name": "Dinagat Islands"
  }
}
    */
