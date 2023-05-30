(function showShootings() {
  var width = 960;
  var height = 500;
  var projection = d3.geo.albersUsa().scale([1000]);
  var path = d3.geo.path().projection(projection);

  var svg = d3
    .select("#shootings")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  var div = d3
    .select("#shootings")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  d3.json("states.json", function (states) {
    svg
      .selectAll("path")
      .data(states.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("stroke", "#fff")
      .style("stroke-width", "1")
      .style("fill", "rgb(213,222,217)");
  });

  d3.json("shootings.json", function (shooting) {
    svg
      .append("g")
      .selectAll("shooting")
      .data(shooting)
      .enter()
      .append("circle")
      .attr("class", "shooting")
      .attr("cx", function (d) {
        var coords = projection([d.longitude, d.latitude]);
        return coords[0];
      })
      .attr("cy", function (d) {
        var coords = projection([d.longitude, d.latitude]);
        return coords[1];
      })
      .attr("r", function (d) {
        return Math.sqrt(d.total_victims) * 1.3;
      })
      .style("fill", "red")
      .style("opacity", 0.3)
      .style("stroke", "white")
      .on("mouseover", function (d) {
        div.transition().duration(200).style("opacity", 0.9);
        div
          .text("Fsadsad")
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY - 28 + "px");
      })
      .on("mouseout", function (d) {
        div.transition().duration(500).style("opacity", 0);
      });
  });
})();
