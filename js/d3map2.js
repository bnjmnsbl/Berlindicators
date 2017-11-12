/* To DOS:

nicer font
Headline
Legend
position dropdown

join csv to topojson on the fly (i.e. like this: http://bl.ocks.org/phil-pedruco/7557092)
use colorbrewer ordinal scale (i.e. like this: http://bl.ocks.org/phil-pedruco/7557092)



*/

var width = 720,
	height = 550;
	
var projection = d3.geoMercator()
		.scale(50000)
		.center([13.403528,52.540212])
		.translate([width / 2, height / 2 - 50 ]),

	path = d3.geoPath()
		.projection(projection),

	color = d3.scaleLinear().range(["white", "red"]),

	tooltip = d3.select('body').append('div')
		.attr("class", "tooltip")
		.style("opacity", 0)
		.style('z-index', '10');


var lookup = {};

var IndicatorKeys = ["S1", "S2", "S3", "S4", "D1", "D2", "D3", "D4" ];
var IndicatorNames = ["Anteil Arbeitslose (SGBII und III)", "Anteil Langzeitarbeitslose", "Anteil Transferbezieher (SGB II und XII)", "Anteil Transferbezieher (SGB II) unter 15 Jahre", "Veränderung Anteil Arbeitslose (SGBII und III)", "Veränderung Anteil Langzeitarbeitslose", "Veränderung Anteil Transferbezieher (SGB II und XII)", "Veränderung Anteil Transferbezieher (SGB II) unter 15 Jahre"];	
var activeInd = 0;

var dropdownMenu = d3.select("#dropdownMenu");
		
	dropdownMenu
		.append("select")
		.selectAll("option")
		.data(IndicatorKeys)
		.enter()
		.append("option")
		.attr("value", function(d) {
			return d;
		})
		.text(function(d) {
			
			return IndicatorNames[IndicatorKeys.indexOf(d)];
		})

var svg = d3.select('#vis')
		.append('svg')
		.style('width', width + 'px')
		.style('height', height + 'px')
		.append('g');	

function loadFiles() {
	d3.queue()
	.defer(d3.json, 'data/PLR-topo.json')
	.defer(d3.csv, 'data/IndexInd.csv')
	.await(updateMap)
}

function updateMap(error, geodata, csvdata) {
	
	// Fix CSV data
	csvdata.forEach(function(d) {
				
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

		// CREATE LOOKUP OBJECT
	for (var i = 0; i < csvdata.length; i++) {
		lookup[csvdata[i].Nummer] = csvdata[i];
	}

	lookup.getAverage = function(key) { //this works but is still unused
		return (this["0"][key]);
	}


	color.domain([d3.min(csvdata, function(d) {return d[IndicatorKeys[activeInd]]}), d3.max(csvdata, function(d) {return d[IndicatorKeys[activeInd]]})]);

	
	function createTop3(columns) {
/*
	var fields = [];
	var sortedArr = csvdata.features.sort(function(x, y) {
		return d3.descending(x.properties[IndicatorKeys[i]], y.properties[IndicatorKeys[i]])
	}).slice(0,3)
*/
	var top3Arr = csvdata.sort(function(a,b) {return a[IndicatorKeys[activeInd]]-b[IndicatorKeys[activeInd]]}).slice(csvdata.length-3, csvdata.length).reverse();
	

	d3.select('#topList')
    .selectAll('table')
    .remove();

    var top3 = d3.select('#topList')
	    .append('table')
	   
	var thead = top3.append('thead');
	var tbody = top3.append('tbody');

	thead
		.append('th')
		.text("Planungsraum");
		
	thead
		.append('th')
		.text("%");		
	
	var rows = tbody.selectAll('tr')
		.data(top3Arr)
		.enter()
		.append('tr')
			.on('mouseover', function() {
				d3.select(this).style('background-color', 'yellow');
				d3.select
			})
			.on('mouseout', function() {d3.select(this).style('background-color', 'white');})
	var cells = rows.selectAll('td')
		.data(function(row){
			return columns.map(function(column) {
				return {column: column, value: row[column]};
			});
		})
		.enter()
		.append('td')
			.text(function(d) {return d.value; });

		return top3;

	}

	createTop3(["Name", IndicatorKeys[activeInd]]);
	
		d3.select("g")
			.selectAll("path")
			.remove()

		var map = svg.selectAll("path")
		.data(topojson.feature(geodata, geodata.objects.Planungsraum).features)
		.enter()
		.append("path")
		.attr("d", path)
		.style("stroke", "#fff")
		.style("stroke-width", "0.5")
		.style("fill", function(d) {
			d.properties.SCHLUESSEL = +(d.properties.SCHLUESSEL);
			
			return color(lookup[d.properties.SCHLUESSEL].S1);
			
		})
		.on('mouseover', function(d) {
			tooltip.transition()
				.duration(100)
				.style("opacity", .9);

			tooltip.html("<span class='year'>" + lookup[d.properties.SCHLUESSEL].Name + ": " + (lookup[d.properties.SCHLUESSEL].S1))//(d.properties[IndicatorKeys[activeInd]]==0 ? "keine Daten" : d.properties[IndicatorKeys[activeInd]] + "%"))
				.style("left", (d3.event.pageX) + "px")
				.style("top", (d3.event.pageY) + "px");

			d3.select(this)
				.style("stroke-width", "2.5");
		})
		 .on("mouseout", function(d) {       
            tooltip.transition()        
                .duration(500)      
                .style("opacity", 0);   

        	d3.select(this)
				.style("stroke-width", "0.5");
        });
	};



	/*/Legend
 	d3.select('#legend')
        .selectAll('ul')
        .remove();
    
    // build the map legend
    var legend = d3.select('#legend')
        .append('ul')
        .attr('class', 'list-inline');

    var keys = legend.selectAll('li.key')
        .data(color.range());

    var legend_items = ["Low", "", "", "", "", "", "", "", "High"];

    keys.enter().append('li')
        .attr('class', 'key')
        .style('border-top-color', String)
        .text(function (d, i) {
            return legend_items[i];
        });

*/


loadFiles()
// Dropdown event listener
dropdownMenu.on('change', function(){
	
	var selectedIndicator = d3.select(this)
       	.select("select")
       	.property("value");

   	activeInd = IndicatorKeys.indexOf(selectedIndicator);
   	loadFiles();
	});
