
// FETCH THE GEOGRAPHIC COORDINATED WHICH MAKE UP EACH COUNTRYS BORDERS
let geojson = fetch('countries.geojson?x=' + Math.random()).then(r => r.json());

// FETCH GDP DATA
let gdp2019 = fetch('gdp_2019.json?x=' + Math.random()).then(r => r.json());

// FETCH REGION DATA
let region1 = fetch('region1.json?x=' + Math.random()).then(r => r.json());
let region2 = fetch('region2.json?x=' + Math.random()).then(r => r.json());
let region3 = fetch('region3.json?x=' + Math.random()).then(r => r.json());

// LISTEN FOR ALL THE DATA TO BE FETCHED
Promise.all([geojson, gdp2019, region1, region2, region3]).then(r => {

  let geojson = r[0];
  let gdp2019 = r[1];
  let region1 = r[2];
  let region2 = r[3];
  let region3 = r[4];
  
  // NOW THAT WE HAVE ALL THE DATA, LETS MODIFY THE GEOJSON
  for (var i = 0; i < geojson.features.length; i++) {
    for (var j = 0; j < gdp2019.data.length; j++) { //or ADM0_A3
      //console.log(geojson.features[i].properties.ISO_A3);
      if (geojson.features[i].properties.ADM0_A3 === gdp2019.data[j].id) {
        
        geojson.features[i].properties.id = gdp2019.data[j].id;
        geojson.features[i].properties.gdp = gdp2019.data[j].val;
        geojson.features[i].properties.r1 = region1.data[j].val + Math.random()*100-50;
        geojson.features[i].properties.r2 = region2.data[j].val + Math.random()*100-50;
        geojson.features[i].properties.r3 = region3.data[j].val + Math.random()*0.5-0.25;
      }
    }
  }
  return geojson;
  
}).then((r) => {
  
  // r is the geojson object with all the mods weve made
  console.log(r);

  // DISPLAY THE MAP
  mapboxgl.accessToken = 'pk.eyJ1IjoicnRob21hc2lhbiIsImEiOiJjamY5NWt1MWIwZXBxMnFxb3N6NHphdHN3In0.p80Ttn1Zyoaqk-pXjMV8XA';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v9', // other choices: light-v9; dark-v9; streets-v10
    center: [-95.7129, 37.0902], // Hamilton, ON [-79.8711, 43.2557], US [-95.7129, 37.0902]
    zoom: 3
  });
  
 	map.on('load', function(e) {
  
    // gdp
    map.addLayer({
      id: 'gdp2019',
      type: 'fill',
      source: {
        type: 'geojson',
        data: r
      },
      layout: {
        'visibility': 'none'  // VISIBILITY
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
    
    // region1: continent
    map.addLayer({
      id: 'region1',
      type: 'fill',
      source: {
        type: 'geojson',
        data: r
      },
      layout: {
        'visibility': 'visible' // VISIBILITY
      },
      paint: {
        'fill-color': {
          "property": "r1", // this color scheme is based on the age property
          "stops": [
            [0, 'rgba(0, 0, 0, 0)'],
            [1000, 'rgba(120, 255, 120, 255)'],
            [2000, 'rgba(255, 170, 255, 255)'],
            [3000, 'rgba(255, 200, 0, 255)'],
            [4000, 'rgba(255, 120, 120, 255)'],
            [5000, 'rgba(120, 120, 255, 255)'],
            [6000, 'rgba(255, 255, 120, 255)'],
            [7000, 'rgba(51, 51, 51, 255)']
          ]
        }, 	
      'fill-opacity': 0.35
      }
    });
    
    // region2: not sure yet
    map.addLayer({
      id: 'region2',
      type: 'fill',
      source: {
        type: 'geojson',
        data: r
      },
      layout: {
        'visibility': 'none' // VISIBILITY
      },
      paint: {
        'fill-color': {
          "property": "r2", // this color scheme is based on the age property
          "stops": [
            [0, 'rgba(0, 0, 0, 0)'],
            [1000, 'rgba(120, 255, 120, 255)'],
            [2000, 'rgba(255, 200, 255, 255)'],
            [3000, 'rgba(255, 200, 0, 255)'],
            [4000, 'rgba(120, 120, 255, 255)'],
            [6000, 'rgba(255, 120, 120, 255)'],
            [7000, 'rgba(255, 200, 0, 255)']
          ]
        }, 	
      'fill-opacity': 0.35
      }
    });	
    
    // regions 3: geographic region
    map.addLayer({
      id: 'region3',
      type: 'fill',
      source: {
        type: 'geojson',
        data: r
      },
      layout: {
        'visibility': 'none' // VISIBILITY
      },
      paint: {
        'fill-color': {
          "property": "r3", // this color scheme is based on the age property
          "stops": [
            [0, 'rgba(0, 0, 0, 0)'],
            [1, 'rgba(120, 255, 120, 255)'],
            [2, 'rgba(255, 200, 255, 255)'],
            [3, 'rgba(255, 200, 0, 255)'],
            [4, 'rgba(120, 120, 255, 255)'],
            [6, 'rgba(255, 120, 120, 255)'],
            [7, 'rgba(255, 200, 0, 255)']
          ]
        }, 	
      'fill-opacity': 0.35
      }
    });	
  
  });
  
  
  
  let removeLayersButton = document.getElementById('removeLayers');
  removeLayers.addEventListener('click', function() {
    
    // get all layers
    let layers = ['gdp2019', 'region1', 'region2', 'region3'];

    for (let i = 0; i < layers.length; i++) {
      let visibility = map.getLayoutProperty(layers[i], 'visibility');
      if (visibility === 'visible') {
        map.setLayoutProperty(layers[i], 'visibility', 'none');
      }
    }
  });
 
  let layerIdArray = document.getElementsByClassName('layerId');
  for (let i = 0; i < layerIdArray.length; i++) {
    let layerIdEl = layerIdArray[i];
    
    console.log(layerIdEl);
    
    layerIdEl.addEventListener('click', function() {
    
      let layerId = layerIdEl.id;
      let visibility = map.getLayoutProperty(layerId, 'visibility');
      if (visibility === 'visible') {
        map.setLayoutProperty(layerId, 'visibility', 'none');
      } else {
        map.setLayoutProperty(layerId, 'visibility', 'visible');
      }
      
    });
    
  }

   
});
  





/*


// im grabbing data from 2018gdpdata.js which contains an array called gdp and is an array of arrays
var locations = {
  'type': 'FeatureCollection',
	// features is an array, and in this case there is only one element
  'features': [
    {
      'type': 'Feature',
			'id': 1,
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
    
		// regions 3: geographic region
		map.addLayer({
			id: 'region3',
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
		


		// Hamilton 
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
			'circle-opacity': ["case", ["boolean", ["feature-state", "click"], false], 0.8, 0.4]
			}
		});
		
		



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
	
	var popup = new mapboxgl.Popup({
		closeButton: false,
		closeOnClick: false
	});
	
	map.on('mouseenter', 'Hamilton', function(e) {
		if (e.features.length > 0) {
			for (var i = 0; i < e.features.length; i++) {
				var feature = e.features[i];
				var x = map.getFeatureState({source: 'Hamilton', id: feature.id});
				
				if (x.click === true) {
					map.setFeatureState({source: 'Hamilton', id: feature.id}, { click: false});
				} else {
          map.setFeatureState({source: 'Hamilton', id: feature.id}, { click: true});
				}
				
				popup.setLngLat([-79.8711, 43.2557])  // how to get to the center of the country?
					.setHTML('<h3>Woo.</h3><p>This is where I live.</p>')
					.addTo(map);					
			}
		}
	});
	
	map.on('mouseleave', 'Hamilton', function() {
		map.getCanvas().style.cursor = '';
		popup.remove();
	});
	
}

*/