/* To DOS:

nicer font
Headline
Legend
position dropdown


*/

var width = 720,
	height = 550;
	count = 4;

var projection = d3.geoMercator()
		.scale(50000)
		.center([13.403528,52.540212])
		.translate([width / 2, height / 2 - 50 ]),

	path = d3.geoPath()
		.projection(projection),

		color = d3.scaleLinear().range(["white", "red"]).domain(0.00, 15.00),

		tooltip = d3.select('body').append('div')
		.attr("class", "tooltip")
		.style("opacity", 0)
		.style('z-index', '10');

/*d3.queue()
	.defer(d3.json, 'data/combined.geojson')
	.await(visualize)*/

var IndicatorKeys = ["S1", "S2", "S3", "S4", "D1", "D2", "D3", "D4"];
var IndicatorNames = ["Anteil Arbeitslose (SGBII und III)", "Anteil Langzeitarbeitslose", "Anteil Transferbezieher (SGB II und XII)", "Anteil Transferbezieher (SGB II) unter 15 Jahre", "Veränderung Anteil Arbeitslose (SGBII und III)", "Veränderung Anteil Langzeitarbeitslose", "Veränderung Anteil Transferbezieher (SGB II und XII)", "Veränderung Anteil Transferbezieher (SGB II) unter 15 Jahre"];	

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

function updateMap(i) {
	
	d3.json('data/combined.geojson', function(err, data) {

	var indexArr = [];
	data.features.forEach(function(d) {
		indexArr.push(d.properties[IndicatorKeys[i]]);
	})

	color.domain([d3.min(indexArr), d3.max(indexArr)])
	
	
	function createTop3(columns) {

	var fields = [];
	var sortedArr = data.features.sort(function(x, y) {
		return d3.descending(x.properties[IndicatorKeys[i]], y.properties[IndicatorKeys[i]])
	}).slice(0,3)


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

	thead.append('th').text("%");		
	var rows = tbody.selectAll('tr')
		.data(sortedArr)
		.enter()
		.append('tr')

	var cells = rows.selectAll('td')
		.data(function(row){
			return columns.map(function(column) {
				return {column: column, value: row.properties[column]};
			});
		})
		.enter()
		.append('td')
			.text(function(d) {return d.value; });

		return top3;

	}

	createTop3(["Name", IndicatorKeys[i]]);

		d3.select("g")
			.selectAll("path")
			.remove()

		var map = svg.selectAll("path")
		.data(data.features)
		.enter()
		.append("path")
		.attr("d", path)
		.style("stroke", "#fff")
		.style("stroke-width", "0.5")
		.style("fill", function(d) {
			return color(d.properties[IndicatorKeys[i]]);
		})
		.on('mouseover', function(d) {
			tooltip.transition()
				.duration(100)
				.style("opacity", .9);

			tooltip.html("<span class='year'>" + d.properties.Name + ": " + (d.properties[IndicatorKeys[i]]==0 ? "keine Daten" : d.properties[IndicatorKeys[i]] + "%"))
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
	});



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
}

updateMap(0)
// Dropdown event listener
dropdownMenu.on('change', function(){
	
	var selectedIndicator = d3.select(this)
       	.select("select")
       	.property("value");
   	updateMap(IndicatorKeys.indexOf(selectedIndicator))
	});
