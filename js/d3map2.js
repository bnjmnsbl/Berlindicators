/* To DOS:

nicer font
Headline
Legend
position dropdown

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
	
geodata.objects.Planungsraum.geometries.forEach(function(d) {
	d.properties.SCHLUESSEL = +(d.properties.SCHLUESSEL)	

	csvdata.forEach(function(e) {
	
		if (d.properties.SCHLUESSEL === +(e.Nummer)){
			
			d.properties.Name = e.Name;	
			d.properties.EW = +(e.EW);
			d.properties.S1 = +(e.S1.replace(/,/g, '.'));
			d.properties.S2 = +(e.S2.replace(/,/g, '.'));
			d.properties.S3 = +(e.S3.replace(/,/g, '.'));
			d.properties.S4 = +(e.S4.replace(/,/g, '.'));
			d.properties.D1 = +(e.D1.replace(/,/g, '.'));
			d.properties.D2 = +(e.D2.replace(/,/g, '.'));
			d.properties.D3 = +(e.D3.replace(/,/g, '.'));
			d.properties.D4 = +(e.D4.replace(/,/g, '.'));
			}
		})
	});

	color.domain(
		[d3.min(geodata.objects.Planungsraum.geometries, function(d) {
			return d.properties[IndicatorKeys[activeInd]];
		}), 
		d3.max(geodata.objects.Planungsraum.geometries, function(d) {
			return d.properties[IndicatorKeys[activeInd]]
		})
		]
		);


	function createTop3(columns) {

	var top3Arr = geodata.objects.Planungsraum.geometries.sort(function(a,b) {return a.properties[IndicatorKeys[activeInd]]-b.properties[IndicatorKeys[activeInd]]}).slice(geodata.objects.Planungsraum.geometries.length-3, geodata.objects.Planungsraum.geometries.length).reverse();

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
				return {column: column, value: row.properties[column]};
			});
		})
		.enter()
		.append('td')
			.text(function(d) {return d.value; });
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
						
			return color(d.properties[IndicatorKeys[activeInd]]);
			
		})
		.on('mouseover', function(d) {
			tooltip.transition()
				.duration(100)
				.style("opacity", .9);

			tooltip.html("<span class='year'>" + d.properties.Name + ": " + (d.properties[IndicatorKeys[activeInd]]==0 ? "keine Daten" : d.properties[IndicatorKeys[activeInd]] + "%"))
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
