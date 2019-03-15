// first, grab the data and remember to parse it
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
  if (this.readyState === 4 && this.status === 200) {
		abc(JSON.parse(this.responseText));
  }
};
xhr.open('GET', 'countries.geojson?x=' + Math.random(), true);
xhr.send()

// im grabbing data from 2018gdpdata.js which contains an array called gdp and is an array of arrays

function abc(borders) {

	// feature ids should be integers
	// 'age' is just some value between 0 and 100, and will be used to style the map
	for (var i = 0; i < borders.features.length; i++) {
		borders.features[i].properties.id = borders.features[i].id;
		borders.features[i].properties.age = Math.random()*100;
		
		for (var j = 0; j < gdp.length; j++) {
			if (borders.features[i].properties.id === gdp[j][0]) {
				borders.features[i].properties.gdp = gdp[j][1];
			}	
		}	
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
		
		// nonsense
		map.addLayer({
			id: 'nonsense',
			type: 'fill',
			source: {
				type: 'geojson',
				data: borders
			},
			layout: {
				'visibility': 'visible'
			},
			paint: {
				'fill-color': {
					"property": "age", // this color scheme is based on the age property
					"stops": [
						[0, 'blue'],
						[50, 'green'],
						[100, 'orange']
					]
				}, 	
				'fill-opacity': 0.35
			}
		});	
		
		// gdp
		map.addLayer({
			id: 'gdp',
			type: 'fill',
			source: {
				type: 'geojson',
				data: borders
			},
			layout: {
				'visibility': 'none'  // i only want the first layer to be visible when the map loads
			},
			paint: {
				'fill-color': {
					"property": "gdp", // this color scheme is based on the gdp property
					"stops": [
						[0, 'rgba(255, 0, 0, 0)'],
						[2513000, 'rgba(255, 0, 0, 130)'],
						[20513000, 'rgba(255, 0, 0, 255)']
					]
				}, 	
				'fill-opacity': 0.35
			}
		});	
		
	});

	var toggleableLayerIds = [ 'nonsense', 'gdp' ];
	 
	for (var i = 0; i < toggleableLayerIds.length; i++) {
		var id = toggleableLayerIds[i];
		var a = document.createElement('a');
		a.href = '#';
		// i only want the first button to be active when the map loads to mirror the first layer which is visible
		if (i === 0) {
			a.className = 'active';
		}
		a.textContent = id;
		 
		a.addEventListener('click', function(e) {
			var clickedLayer = this.textContent;
			e.preventDefault();
			e.stopPropagation();
		 
			var visibility = map.getLayoutProperty(clickedLayer, 'visibility');
		 
			// this is good because it leaves open the possibility of multiple layers being visible at the same time
			if (visibility === 'visible') {
				map.setLayoutProperty(clickedLayer, 'visibility', 'none');
				this.className = '';
			} else {
				this.className = 'active';
				map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
			}
		});
		 
		var layers = document.getElementById('menu');
		layers.appendChild(a);
	}
	
}