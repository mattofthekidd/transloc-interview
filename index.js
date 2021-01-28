
const express = require('express');
const path = require('path')
var app = express();

const PORT = process.env.PORT || 5000

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + "/index.html"));
})
app.listen(PORT);
