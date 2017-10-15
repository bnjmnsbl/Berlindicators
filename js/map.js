var map = L.map('mymap').setView([52.48, 13.36], 11);
var attr = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'  
var tileURL = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'	 	 
  		
  		
  	L.tileLayer(tileURL, { attribution: attr,
      maxZoom: 17,
      minZoom: 9
    }).addTo(map);

var customLayer = L.geoJson(null, {
    style: function(feature) {
        return { 
        	color: '#000000',
         	weight: 1
         }
    },
    onEachFeature: function(feature, layer) {
          layer.bindPopup(feature.properties.name);
          layer.on('mouseover', function(e) {
            this.openPopup();
          });
          layer.on('mouseout', function (e) {
            this.closePopup();
          })
    }
});

/*
var runLayer = omnivore.kml('data/LOR-PR.kml', null, customLayer)
 runLayer.addTo(map);
 
*/

var geojsonLayer = new L.GeoJSON.AJAX('data/combined.geojson', {
    style: function(feature) {
        return { 
          color: '#000000',
          weight: 1
         }
    },
     onEachFeature: function(feature, layer) {
          layer.bindPopup(feature.properties.Name + ": " + feature.properties.EW);
          layer.on('mouseover', function(e) {
            this.openPopup();
          });
          layer.on('mouseout', function (e) {
            this.closePopup();
          })
    }

  });
geojsonLayer.addTo(map);
  