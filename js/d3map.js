var width = 400,
	height = 400,
	
	color = d3.scaleLinear().range(["white", "red"]).domain(0.00, 15.00);

	svg = d3.select('#chart')
		.append('svg')
		
	projection = d3.geoMercator()
		.scale(40000)
		.center([13.403528,52.540212])
		.translate([width / 2 + 5, height / 2 - 50]),

	path = d3.geoPath()
		.projection(projection),

	tooltip = d3.select('body').append('div')
		.attr("class", "tooltip")
		.style("opacity", 0)
		.style('z-index', '10'),

	zoom = d3.zoom()
		.scaleExtent([1, 8])
		.on('zoom', zoomed),

	g = svg.append('g');

d3.json('data/combined.geojson', function(err, data) {
	
	var S1Arr = []
	data.features.forEach(function(d) {
		S1Arr.push(d.properties.S1);
	})
	color.domain([d3.min(S1Arr), d3.max(S1Arr)])


	g.selectAll("path")
		.data(data.features)
		.enter()
		.append("path")
		.attr("d", path)
		.style("stroke", "#fff")
		.style("stroke-width", "0.5")
		.style("fill", function(d) {
			return color(d.properties.S1);
		})
		.on('mouseover', function(d) {
			tooltip.transition()
				.duration(100)
				.style("opacity", .9);


			tooltip.html("<span class='year'>" + d.properties.Name + ": " + (d.properties.S1==0 ? "keine Daten" : d.properties.S1 + "%"))
				.style("left", (d3.event.pageX) + "px")
				.style("top", (d3.event.pageY) + "px");
		})
		 .on("mouseout", function(d) {       
            tooltip.transition()        
                .duration(500)      
                .style("opacity", 0);   
        });
})

function zoomed() {
  g.style("stroke-width", 1 / d3.event.transform.k + "px");
  // g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"); // not in d3 v4
  g.attr("transform", d3.event.transform); // updated for d3 v4
}
svg.call(zoom);


