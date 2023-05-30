(function showStates() {
  var width = 960;
  var height = 500;
  var projection = d3.geo.albersUsa().scale([1000]);
  var path = d3.geo.path().projection(projection);

  var color = d3.scale.linear().range(["#ff7a7a", "#f50000"]);

  var svg = d3
    .select("#states")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  var div = d3
    .select("#states")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  d3.json("shootings.json", function (data) {
    d3.json("states.json", function (json) {
      for (var i = 0; i < data.length; i++) {
        var totalVictims = 0;
        for (var j = 0; j < json.features.length; j++) {
          var jsonState = json.features[j].properties.name;
          var dataState = data[i].location.split(",")[1];
          if (dataState.trim() === jsonState.trim()) {
            totalVictims += data[i].total_victims;
            json.features[j].properties.totalVictims = totalVictims;
          }
        }
      }

      color.domain([0, 1]);
      svg
        .selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("stroke", "#fff")
        .style("stroke-width", "1")
        .style("fill", function (d) {
          var value = d.properties.totalVictims;
          if (value) {
            return color(value);
          } else {
            return "rgb(213,222,217)";
          }
        })
        .on("mouseover", function (d) {
          div.transition().duration(200).style("opacity", 0.9);
          div
            .text(
              d.properties.name + "Total victims: " + d.properties.totalVictims
            )
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY - 28 + "px");
        })
        .on("mouseout", function (d) {
          div.transition().duration(500).style("opacity", 0);
        });
    });
  });
})();
