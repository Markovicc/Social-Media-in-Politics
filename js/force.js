


var width =1300;
    height =1100;

var svg1 = d3.select("#force").append("svg")
    .attr("width", width)
    .attr("height", height);

var color = d3.scaleOrdinal(['firebrick', 'green', 'plum','navy'] );

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) {return d.node; }).distance(50))
    .force("charge", d3.forceManyBody().strength(-4))
    .force("center", d3.forceCenter(width / 2, height / 2));

d3.json("data/graph_data.json", function(error, graph) {
  if (error) throw error;

  var link = svg1.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
    .attr("stroke-width", 0.1);

  var node = svg1.append("g")
      .attr("class", "nodes")
    .selectAll("g")
    .data(graph.nodes)
    .enter().append("g");

  var circles = node.append("circle")
      .attr("r", function(d) { return d.weight/35+3; })
      .attr("fill", function(d) { return color(d.group); })
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));



  node.append("title")
      .text(function(d) { return d.node; });

  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
        });
  }
});

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}
