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

var locations = {
  'type': 'FeatureCollection',
	// features is an array, and in this case there is only one element
  'features': [
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point', // the geometry type of this element is a point
        'coordinates': [-79.8711, 43.2557]
      },
      'properties': {
        'city': 'Hamilton',
        'state': 'Ontario',
        'country': 'Canada' // we don't need to add a properties element to the 'features'
      }
    }
  ]
}

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
		for (var j = 0; j < countries.length; j++) {
			if (borders.features[i].properties.id === countries[j][0]) {
				let coor = [];
				coor.push(countries[j][1]);
				coor.push(countries[j][2]);
				borders.features[i].properties.center = coor;
			}	
		}	
		borders.features[i].id = i + 1;
		//console.log(borders.features[i]);
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

		// add the data to your map as a layer 
		map.addLayer({
			id: 'Hamilton',
			type: 'circle',
		
			// add a geojson source containing the data you want to incorporate
			source: {
				type: 'geojson',
				data: locations
			},
			'layout': {
				'visibility': 'none'
			},
			paint: {
				'circle-radius': {
				base: 7,
				stops: [[4, 7.25], [12, 14]] // circles get bigger between z3 and z14
				},
			'circle-color': '#FF6EC7',
			'circle-opacity': 0.6
			}
		});		
		
		
	});

	var toggleableLayerIds = [ 'nonsense', 'gdp', 'Hamilton' ];
	 
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
	
	// maybe i have to do this for each layer?
	
	map.on('click', 'nonsense', function(e) {
		var arr = e.features;
		for (var i = 0; i < arr.length; i++) {
			var feature = arr[i];
			console.log(feature);
			
			var name = feature.properties.name;
			var age = feature.properties.age;
			let center = JSON.parse(feature.properties.center);  // if i dont do this, js thinks center is a string!!
			console.log(center);

			new mapboxgl.Popup()
				.setLngLat([center[0], center[1]])  // how to get to the center of the country?
				.setHTML('<h4>' + name + '</h4><p>ROLL: ' + Math.floor(age*100)/100 + '</p>')
				.addTo(map);
	
		}
	});
	
	map.on('click', 'gdp', function(e) {
		var arr = e.features;
		for (var i = 0; i < arr.length; i++) {
			var feature = arr[i];
			//console.log(feature);
			
			var name = feature.properties.name;
			var gdp = feature.properties.gdp;
			console.log(gdp);
			var x = '';
			if (gdp > 1000000) {
				x = Math.floor((gdp/1000000)*100)/100 + ' trillion';
			} else if (gdp > 10000) {
				x = Math.floor((gdp/1000)) + ' billion';
			} else {
				x = Math.floor((gdp/1000)*10)/10 + ' billion';
			}
			
			let center = JSON.parse(feature.properties.center);  // if i dont do this, js thinks center is a string!!
			//console.log(center);

			new mapboxgl.Popup()
				.setLngLat([center[0], center[1]])  // how to get to the center of the country?
				.setHTML('<h4>' + name + '</h4><p>GDP: ' + x + '</p>')
				.addTo(map);
	
		}
	});
	
	map.on('click', 'Hamilton', function(e) {
		if (e.features.length > 0) {
			for (var i = 0; i < e.features.length; i++) {
				var feature = e.features[i];
				console.log(feature);
				
				new mapboxgl.Popup()
					.setLngLat([-79.8711, 43.2557])  // how to get to the center of the country?
					.setHTML('<h4>Woo.</h4><p>This is where I live.</p>')
					.addTo(map);				
				
			}
		}
	});
	
}