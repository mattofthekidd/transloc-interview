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
try {
    if(!fs.existsSync(file)) {
        fs.createReadStream(file)
        .pipe(parse())
        .on('data', data => {
            //I like to build it into a temporary variable
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
            fs.writeFileSync("./public/data/points.geojson", JSON.stringify(results));
        })
    } 
    else {
        console.log("File already exists and does not need to be generated.");
    }
} catch(err) {
    console.error(err);
}



