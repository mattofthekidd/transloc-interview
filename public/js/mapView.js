
mapboxgl.accessToken = 'pk.eyJ1IjoibWF0dG9mdGhla2lkZCIsImEiOiJja2tkY3JkbnMxOGg2Mm5yMXM5NXh0NHJvIn0.K9SZJvVIB-OqdXad0Kf9tg';
var map = new mapboxgl.Map({
    container: 'mapDiv',
    style: 'mapbox://styles/mapbox/dark-v10', // stylesheet location
    center: [118, 24], // starting position [lng, lat]
    zoom: 5 // starting zoom
});
//TODO: this will be an issue if the geojson isn't generated yet I think.
var coords = map.getBounds();

// console.log(coords._sw, coords._ne)
map.on('load', function () {
    map.addSource("points", {
        type: 'geojson',
        data: `/bounds?topLng=${coords._ne.lng}&topLat=${coords._ne.lat}&btmLng=${coords._sw.lng}&btmLat=${coords._sw.lat}`
        // data: 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson'
    });
    map.addLayer({
        id: "netHeat",
        type: "heatmap",
        source: "points",
        maxzoom: 10,
        paint: {
            'heatmap-weight': {
                property: 'dbh',
                type: 'exponential',
                stops: [
                    [1, 0],
                    [62, 1]
                ]
            },
            'heatmap-intensity': {
                stops: [
                    [11, 1],
                    [15, 3]
                ]
            },
            'heatmap-color': [
                'interpolate',
                ['linear'],
                ['heatmap-density'],
                0, 'rgba(236,222,239,0)',
                0.2, 'rgb(208,209,230)',
                0.4, 'rgb(166,189,219)',
                0.6, 'rgb(103,169,207)',
                0.8, 'rgb(28,144,153)'
            ],
            // increase radius as zoom increases
            'heatmap-radius': {
                stops: [
                    [11, 15],
                    [15, 20]
                ]
            },    // decrease opacity to transition into the circle layer
            'heatmap-opacity': {
                default: 1,
                stops: [
                    [14, 1],
                    [15, 0]
                ]
            },
        }
    });
});
map.on("dragend", event => {
    console.log("mouseup");
    // console.log(map);
    // let temp = `/bounds?topLng=${coords._ne.lng}&topLat=${coords._ne.lat}&btmLng=${coords._sw.lng}&btmLat=${coords._sw.lat}`;
    // console.log(temp)
    map.getSource('points').setData(`/bounds?topLng=${coords._ne.lng}&topLat=${coords._ne.lat}&btmLng=${coords._sw.lng}&btmLat=${coords._sw.lat}`);
    console.log(map.getSource('points'))
})