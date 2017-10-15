var width = 400,
	height = 350;
	count = 4;

var projection = d3.geoMercator()
		.scale(30000)
		.center([13.403528,52.540212])
		.translate([width / 2 , height / 2 - 50 ]),

	path = d3.geoPath()
		.projection(projection),

		color = d3.scaleLinear().range(["white", "red"]).domain(0.00, 15.00);

d3.queue()
	.defer(d3.json, 'data/combined.geojson')
	.await(visualize)

function visualize(error, data) {
	var visWrapper = d3.select('#vis');
	
	for (i=0; i<count; i++) {
		console.log(visWrapper);
		var legend = "Map Nr. " + (i+1);
		
		var wrapper = visWrapper
			.append('div')
			.style('width', width + 'px')
			.style('height', height + 'px');
			
		
		createMap(wrapper, legend, data)
	}
}

function createMap(wrapper, legend, data) {
	wrapper.append('p')
		.text(legend)
		.attr('class', 'legend');

	var S1Arr = []
	data.features.forEach(function(d) {
		S1Arr.push(d.properties.S1);
	})
	color.domain([d3.min(S1Arr), d3.max(S1Arr)])
	
	
	var svg = wrapper.append('svg')
		

		svg.selectAll("path")
		.data(data.features)
		.enter()
		.append("path")
		.attr("d", path)
		.style("stroke", "#fff")
		.style("stroke-width", "0.5")
		.style("fill", function(d) {
			return color(d.properties.S1);
		})
}