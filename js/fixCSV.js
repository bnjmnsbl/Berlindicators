var lookup = {};


function fixCSV() {

	
	d3.csv("data/IndexInd.csv", function(data) {
		
		data.forEach(function(d) {
	
				d.Nummer = +(d.Nummer); 
				d.EW = +(d.EW);
				d.S1 = +(d.S1.replace(/,/g, '.'));
				d.S2 = +(d.S2.replace(/,/g, '.'));
				d.S3 = +(d.S3.replace(/,/g, '.'));
				d.S4 = +(d.S4.replace(/,/g, '.'));
				d.D1 = +(d.D1.replace(/,/g, '.'));
				d.D2 = +(d.D2.replace(/,/g, '.'));
				d.D3 = +(d.D3.replace(/,/g, '.'));
				d.D4 = +(d.D4.replace(/,/g, '.'));
		})
	var temp = JSON.stringify(data);
	console.dir(temp);
	})

}

fixCSV();

