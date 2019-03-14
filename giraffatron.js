// first, grab the data and remember to parse it
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
  if (this.readyState === 4 && this.status === 200) {
		abc(JSON.parse(this.responseText));
  }
};
xhr.open('GET', 'countries.geo.json?x=' + Math.random(), true);
xhr.send()

function abc(borders) {

	// feature ids should be integers
	// 'age' is just some value between 0 and 100, and will be used to style the map
	for (var i = 0; i < borders.features.length; i++) {
		borders.features[i].properties.id = borders.features[i].id;
		borders.features[i].properties.age = Math.random()*100;
		borders.features[i].id = i + 1;
		console.log(borders.features[i]);
	}

	// display the map
	mapboxgl.accessToken = 'pk.eyJ1IjoicnRob21hc2lhbiIsImEiOiJjamY5NWt1MWIwZXBxMnFxb3N6NHphdHN3In0.p80Ttn1Zyoaqk-pXjMV8XA';
	var map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/mapbox/dark-v9', // other choices: light-v9; dark-v9; streets-v10
		center: [-95.7129, 37.0902], // Hamilton, ON [-79.8711, 43.2557], US [-95.7129, 37.0902]
		zoom: 3
	});

	map.on('load', function(e) {
		map.addLayer({
			id: 'borders',
			type: 'fill',
			source: {
				type: 'geojson',
				data: borders
			},
			layout: {},
			paint: {
				'fill-color': {
					"property": "age",
					"stops": [
						[0, 'blue'],
						[50, 'green'],
						[100, 'orange']
					]
				}, 	
				'fill-opacity': 0.35
			}
		});	
	});
}