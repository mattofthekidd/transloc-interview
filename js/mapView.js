 
import mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"

mapboxgl.accessToken = 'pk.eyJ1IjoibWF0dG9mdGhla2lkZCIsImEiOiJja2tkY3JkbnMxOGg2Mm5yMXM5NXh0NHJvIn0.K9SZJvVIB-OqdXad0Kf9tg';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    center: [-74.5, 40], // starting position [lng, lat]
    zoom: 9 // starting zoom
});