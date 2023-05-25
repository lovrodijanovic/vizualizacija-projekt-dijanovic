var projection = d3.geo.albers();
var path = d3.geo.path().projection(projection);

var margin = { top: 0, right: 0, bottom: 0, left: 0 },
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

var svg = d3
  .select("#vis")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tooltip = d3
  .select("#vis")
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "1px")
  .style("border-radius", "5px")
  .style("padding", "10px");

var mouseover = function (d) {
  tooltip.style("opacity", 1);
};

var mousemove = function (d) {
  tooltip
    .html("Total victims: " + d.total_victims)
    .style("left", d3.mouse(this)[0] + 90 + "px")
    .style("top", d3.mouse(this)[1] + "px");
};

var mouseleave = function (d) {
  tooltip.transition().duration(100).style("opacity", 0);
};

d3.json("us.json", function (error, us) {
  var statesData = topojson.feature(us, us.objects.states);
  svg
    .selectAll("path.state")
    .data(statesData.features)
    .enter()
    .append("path")
    .classed("state", true)
    .attr("d", path)
    .style("fill", "gray")
    .style("stroke", "black")
    .style("stroke-width", 0.2)
    .style("fill-opacity", 0.2);
});

d3.json("shootings.json", function (error, shooting) {
  svg
    .append("g")
    .selectAll(".shooting")
    .data(shooting)
    .enter()
    .append("circle")
    .attr("class", "shooting")
    .attr("r", 7)
    .attr("cx", function (d) {
      var coords = projection([d.longitude, d.latitude]);
      return coords[0];
    })
    .attr("cy", function (d) {
      var coords = projection([d.longitude, d.latitude]);
      return coords[1];
    })
    .style("fill", "red")
    .style("opacity", 0.3)
    .style("stroke", "white")
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);
});
