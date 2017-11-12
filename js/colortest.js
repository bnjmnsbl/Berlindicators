var color = d3.scaleLinear().domain(0.00, 15.00);

color.range(["white", "red"]);

console.log(color(12));