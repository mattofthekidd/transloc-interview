# transloc-interview

Start by getting a basic project setup.
Next install the packages I'll likely need.

After going though tutorials on getting nodejs setup I got my script and style into seperate files how I like.

I've taken care to only include npm packages actively being used.

After seeing that leaflet was another method of doing a map with a heatmap I decided to remove it in favor of mapbox-gl which I had gained some familiarity with.

I let my program create a geojson to use in both the current and later runs.

I didn't spend much time playing with the heatmap settings. Once it was clearly drawing correctly and was loading after dragging it around I left it pretty much as-is.

I tried to get the map to properly fill the webpage but it was already having enough issues rendering the heatmap so I didn't dwell on it.

I thought about having it load new points on zoom but decided that it would likely just make it even slower and possibly make it harder to inspect specific points.

I'd have included information like the network IP and radius of accuracy but the geojson was already too big to be opened manually. (It literally crashes VS Code everytime I open it.)