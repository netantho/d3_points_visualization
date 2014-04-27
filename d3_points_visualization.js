var tooltip = d3.select("body")
  .append("div")
  .style("position", "absolute")
  .style("z-index", "10")
  .style("margin-left", "200px")
  .style("visibility", "hidden")
  .text('')

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 1200 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(d3.behavior.zoom().scaleExtent([1, 8]).on("zoom", zoom));

var rect = svg.append("rect")
  .attr("class", "overlay")
  .attr("width", width)
  .attr("height", height);

function zoom() {
  svg.selectAll("circle").attr("transform",
    "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  svg.selectAll("circle").attr("r", 5/d3.event.scale)
}

render('datasets/5k_cluster_label.tsv');

function update_tooltip(tooltip, text) {
     d3.select("div").html(text)
}

function render(file) {
  console.log(file);

  var x = d3.scale.linear()
    .domain([-0.5, 0.5])
    .range([0, width]);

  var y = d3.scale.linear()
      .domain([0.5, -0.5])
      .range([0, height]);

  var color = d3.scale.category10();

  d3.tsv(file, function(error, data) {

    console.log(error);
    console.log(data);

    d3.select("body").transition();

    svg.selectAll("circle").remove();

    svg.selectAll("circle")
        .data(data)
      .enter().append("circle")
        .attr("r", 5)
        .attr("cx", function(d) { return x(d.x); })
        .attr("cy", function(d) { return y(d.y); })
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ");";
        })
        .style("fill", function(d) { return color(d.cluster); })
        .on("mouseover", function(d) {
          var cluster = '';
          var label = '';
          if (typeof d.cluster !== "undefined") {
            cluster = d.cluster;
          }
          if (typeof d.label !== "undefined") {
            label = d.label;
          }
          update_tooltip(tooltip, d.cluster + '<br>' + label);
          return tooltip.style("visibility", "visible");
        })
        .on("mouseout", function() {
          update_tooltip(tooltip, '');
          return tooltip.style("visibility", "hidden");
        });

  });
  d3.select("span.title").html(file);
}
