//I'm still pretty novice with nodejs
const express = require('express');
const path = require('path')
var app = express();

const fs = require('fs');
const parse = require('csv-parser');
const results = [
    {
        "type": "FeatureCollection",
        "features": [],
    }
];

console.log(__dirname)
console.log(path.join(__dirname))

const file = "./public/data/GeoLite2-City-Blocks-IPv4.csv";
// https://www.npmjs.com/package/csv-parser
// used a library to save time. 
try {
    if(!fs.existsSync("./points.geojson")) {
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
            results[0]["features"].push(temp)
        })
        .on('end', () => {
            fs.writeFileSync("./points.geojson", JSON.stringify(results));
        })
    } 
    else {
        console.log("File already exists and does not need to be generated.");
    }
} catch(err) {
    console.error(err);
}


const PORT = process.env.PORT || 5000;
app.use(express.static(path.join(__dirname + "/public")))
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + "/public/index.html"));
})
app.get('/request?top=&bot=')
// app.get('/', function(req, res) {
//     res.sendFile("./trees.geojson");
// })
app.listen(PORT);




