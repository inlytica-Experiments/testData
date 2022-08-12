<!- Populated by bubbleChart js ->

<div id="bubbleChart2"></div>

<script src="https://d3js.org/d3.v4.js"></script>

<script>
    // set the dimensions and margins of the graph

        var widthBubble = 400; //- marginBubble.left - marginBubble.right,
        var heightBubble = 400;//- marginBubble.top - marginBubble.bottom;
        
        //var width = window.innerWidth, height = window.innerHeight; 
        var sizeDivisor = 175; 
        var nodePadding = .25;
    
        var bubbleChart2 = d3.select("#bubbleChart2")
            .append("svg")
            .attr("width", widthBubble)
            .attr("height", heightBubble);
    
        var color = d3.scaleOrdinal(["rgb(62,0,372)","rgb(54,0,324)","rgb(46,0,276)","rgb(38,0,228)","rgb(30,0,180)","rgb(22,0,132)","rgb(14,0,84)","rgb(6,0,36)","rgb(0,0,0)"]);
        
        //(["rgb(0,0,0)", "rgb(6,0,36)", "rgb(14,0,84)","rgb(22,0,132)","rgb(30,0,180)","rgb(38,0,228)","rgb(46,0,276)","rgb(54,0,324)","rgb(62,0,372)"]); //"#66c2a5"
    
        var simulation = d3.forceSimulation()
            .force("forceX", d3.forceX().strength(.1).x(widthBubble * .5))
            .force("forceY", d3.forceY().strength(.1).y(heightBubble * .5))
            .force("center", d3.forceCenter().x(widthBubble * .5).y(heightBubble * .5))
            .force("charge", d3.forceManyBody().strength(-15));
    
        d3.csv("https://raw.githubusercontent.com/inlytica-Experiments/testData/main/bubbleData.csv", types, function(error,graph){
          if (error) throw error;
    
          // sort the nodes so that the bigger ones are at the back
          graph = graph.sort(function(a,b){ return b.size - a.size; });
    
          //update the simulation based on the data
          simulation
              .nodes(graph)
              .force("collide", d3.forceCollide().strength(.5).radius(function(d){ return d.radius + nodePadding; }).iterations(1))
              .on("tick", function(d){
                node
                    .attr("cx", function(d){ return d.x; })
                    .attr("cy", function(d){ return d.y; })
              });
    
          var node = bubbleChart2.append("g")
              .attr("class", "node")
            .selectAll("circle")
            .data(graph)
            .enter().append("circle")
              .attr("r", function(d) { return d.radius; })
              .attr("fill", function(d) { return color(d.continent); })
              .attr("cx", function(d){ return d.x; })
              .attr("cy", function(d){ return d.y; })
              .call(d3.drag()
                  .on("start", dragstarted)
                  .on("drag", dragged)
                  .on("end", dragended));
    
        });
    
        function dragstarted(d) {
          if (!d3.event.active) simulation.alphaTarget(.03).restart();
          d.fx = d.x;
          d.fy = d.y;
        }
    
        function dragged(d) {
          d.fx = d3.event.x;
          d.fy = d3.event.y;
        }
    
        function dragended(d) {
          if (!d3.event.active) simulation.alphaTarget(.03);
          d.fx = null;
          d.fy = null;
        }
    
        function types(d){
          d.gdp = +d.gdp;
          d.size = +d.gdp / sizeDivisor;
          d.size < 3 ? d.radius = 3 : d.radius = d.size;
          return d;
        }
    
</script>
