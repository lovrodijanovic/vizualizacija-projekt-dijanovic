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
        var fatalities = 0;
        var injured = 0;
        var cases;
        for (var j = 0; j < json.features.length; j++) {
          var jsonState = json.features[j].properties.name;
          var dataState = data[i].location.split(",")[1];
          if (dataState.trim() === jsonState.trim()) {
            totalVictims += data[i].total_victims;
            json.features[j].properties.totalVictims = totalVictims;
            fatalities += data[i].fatalities;
            json.features[j].properties.fatalities = fatalities;
            injured += data[i].injured;
            json.features[j].properties.injured = injured;
            cases = data[i].case;
            json.features[j].properties.cases = cases;
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
            .html(
              "<span class='tooltip-text-bold'>" +
                d.properties.name +
                "<br><br>" +
                "Total victims: " +
                d.properties.totalVictims +
                "<br>" +
                "Fatalities: " +
                d.properties.fatalities +
                "<br>" +
                "Injured: " +
                d.properties.injured +
                "<br>" +
                "Case: " +
                d.properties.cases
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
