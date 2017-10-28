/* This script is used to combine the GeoJSON of LOR-PR with the CSV from Index.CSV
	I used this upfront to have a workable dataset, no need to include it in your site. 
*/	 

d3.queue()
	.defer(d3.csv, '../data/IndexInd.csv')
	.defer(d3.json, '../data/LOR-PR.geojson')
	.await(combine);

function combine(error, index, geo) {
	if (error) {console.log(error);}


	geo.features.forEach(function(d) {
		delete d.properties.description;
		for (var i = 0; i < index.length; i++) {
			if (d.properties.Name === index[i].Name) {
				//console.log (d.properties.Name + " has a match at Nr " + i)
				d.properties.EW = index[i].EW;
				d.properties.S1 = +(index[i].S1.replace(/,/g, '.'));
				d.properties.S2 = +(index[i].S2.replace(/,/g, '.'));
				d.properties.S3 = +(index[i].S3.replace(/,/g, '.'));
				d.properties.S4 = +(index[i].S4.replace(/,/g, '.'));
				d.properties.D1 = +(index[i].D1.replace(/,/g, '.'));
				d.properties.D2 = +(index[i].D2.replace(/,/g, '.'));
				d.properties.D3 = +(index[i].D3.replace(/,/g, '.'));
				d.properties.D4 = +(index[i].D4.replace(/,/g, '.'));
			
			}

		}

	})
	var temp = JSON.stringify(geo);
}
