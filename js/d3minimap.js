var width = 400,
	height = 350;
	count = 4;


var fields = ["S1", "S2", "S3", "S4"];

var projection = d3.geoMercator()
		.scale(30000)
		.center([13.403528,52.540212])
		.translate([width / 2 , height / 2 - 50 ]),

	path = d3.geoPath()
		.projection(projection),

		color = d3.scaleLinear().range(["white", "red"]).domain(0.00, 15.00),

		tooltip = d3.select('body').append('div')
		.attr("class", "tooltip")
		.style("opacity", 0)
		.style('z-index', '10');

		

d3.queue()
	.defer(d3.json, 'data/combined.geojson')
	.await(visualize)

function visualize(error, data) {
	
	var dropdownMenu = d3.select("#dropdownMenu");

	var visWrapper = d3.select('#vis');
	var IndicatorNames = ["Anteil Arbeitslose (SGBII und III)", "Anteil Langzeitarbeitslose", "Anteil Transferbezieher (SGB II und XII)", "Anteil Transferbezieher (SGB II) unter 15 Jahre"]

	dropdownMenu
		.append("select")
		.selectAll("option")
		.data(fields)
		.enter()
		.append("option")
		.attr("value", function(d) {
			return d;
		})
		.text(function(d) {
			return d;
		})	


	for (i=0; i<count; i++) {

		var legend = IndicatorNames[i];
		
		var wrapper = visWrapper
			.append('div')
			.style('width', width + 'px')
			.style('height', height + 'px');
			
		
		createMap(wrapper, legend, data, i)
	}
}

function createMap(wrapper, legend, data, i) {

	var IndicatorKeys = ["S1", "S2", "S3", "S4"]

	wrapper.append('p')
		.text(legend)
		.attr('class', 'legend');

	var indexArr = []
	data.features.forEach(function(d) {
		indexArr.push(d.properties[IndicatorKeys[i]]);
	})
	color.domain([d3.min(indexArr), d3.max(indexArr)])
	
	
	var svg = wrapper.append('svg')
		
		svg.selectAll("path")
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
		})
		 .on("mouseout", function(d) {       
            tooltip.transition()        
                .duration(500)      
                .style("opacity", 0);   
        });
}

