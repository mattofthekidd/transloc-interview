
mapboxgl.accessToken = 'pk.eyJ1IjoibWF0dG9mdGhla2lkZCIsImEiOiJja2tkY3JkbnMxOGg2Mm5yMXM5NXh0NHJvIn0.K9SZJvVIB-OqdXad0Kf9tg';
var map = new mapboxgl.Map({
    container: 'mapDiv',
    style: 'mapbox://styles/mapbox/dark-v10',
    center: [-75, 40],
    zoom: 10
});
map.on('load', function () {
var coords = map.getBounds();

    map.addSource("points", {
        type: 'geojson',
        data: `/bounds?topLng=${coords._ne.lng}&topLat=${coords._ne.lat}&btmLng=${coords._sw.lng}&btmLat=${coords._sw.lat}`
    });
    map.addLayer({
        id: "netHeat",
        type: "heatmap",
        source: "points",
        maxzoom: 20,
        paint: {
            'heatmap-weight': {
                property: '.5',
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
                0.8, 'rgb(28,144,153)',
                1, 'rgb(139, 0, 0)'
            ],
            'heatmap-radius': {
                stops: [
                    [14, 15],
                    [15, 60]
                ]
            }
        }
    });
});
// map.on("zoom", event => {
//     console.log(map.getZoom())
// })
map.on("dragend", event => {
    var coords = map.getBounds();
    map.getSource('points').setData(`/bounds?topLng=${coords._ne.lng}&topLat=${coords._ne.lat}&btmLng=${coords._sw.lng}&btmLat=${coords._sw.lat}`);
})
