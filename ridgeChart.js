<!- Populated by ridgeChart js ->

<div id="ridgeChart"></div>

<script src="https://d3js.org/d3.v4.js"></script>


<script>
// set the dimensions and margins of the graph
var marginRidge = {top: 80, right: 0, bottom: 20, left:0},
    widthRidge = 400- marginRidge.left - marginRidge.right,
    heightRidge = 400 - marginRidge.top - marginRidge.bottom;

// append the svg object to the body of the page
var svg = d3.select("#ridgeChart")
  .append("svg")
    .attr("width", widthRidge + marginRidge.left + marginRidge.right) //widthRidge + marginRidge.left + marginRidge.right
    .attr("height", heightRidge + marginRidge.top + marginRidge.bottom) //heightRidge + marginRidge.top + marginRidge.bottom
  .append("g")
    .attr("transform",
          "translate(" + marginRidge.left + "," + marginRidge.top + ")");

//read data
d3.csv("https://raw.githubusercontent.com/zonination/perceptions/master/probly.csv", function(data) {

  // Get the different categories and count them
  var categories = ["Almost Certainly", "Very Good Chance", "We Believe", "Likely", "About Even", "Little Chance", "Chances Are Slight", "Almost No Chance" ]
  
  var n = categories.length

  // Compute the mean of each group
  allMeans = []
  for (i in categories){
    currentGroup = categories[i]
    mean = d3.mean(data, function(d) { return +d[currentGroup] })
    allMeans.push(mean)
  }

  // Create a color scale using these means.
  var myColor = d3.scaleSequential()
    .domain([0,100])
    .interpolator(d3.interpolate('rgb(0,0,0)','rgb(62,0,372)')); //*******************************************************************************

  // Add X axis
  var x = d3.scaleLinear()
    .domain([-10, 120])
    .range([ 0, widthRidge ]);
  svg.append("g")
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + heightRidge + ")")
    .call(d3.axisBottom(x).tickValues([0,25, 50, 75, 100]).tickSize(-heightRidge) )
    .select(".domain").remove()

  // Add X axis label:
  /*svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height + 40)
      .text("Probability (%)");*/

  // Create a Y scale for densities
  var y = d3.scaleLinear()
    .domain([0, 0.25])
    .range([ heightRidge, 0]);

  // Create the Y axis for names
  var yName = d3.scaleBand()
    .domain(categories)
    .range([0, heightRidge])
    .paddingInner(1)
  /*svg.append("g")
    .call(d3.axisLeft(yName).tickSize(0))
    .select(".domain").remove()*/

  // Compute kernel density estimation for each column:
  var kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(40)) // increase this 40 for more accurate density.
  var allDensity = []
  for (i = 0; i < n; i++) {
      key = categories[i]
      density = kde( data.map(function(d){  return d[key]; }) )
      allDensity.push({key: key, density: density})
  }

  // Add areas
  svg.selectAll("areas")
    .data(allDensity)
    .enter()
    .append("path")
      .attr("transform", function(d){return("translate(0," + (yName(d.key)-heightRidge) +")" )})
      .attr("fill", function(d){
        grp = d.key ;
        index = categories.indexOf(grp)
        value = allMeans[index]
        return myColor( value  )
      })
      .datum(function(d){return(d.density)})
      .attr("opacity", 0.7)
      .attr("stroke", "#000")
      .attr("stroke-width", 0.1)
      .attr("d",  d3.line()
          .curve(d3.curveBasis)
          .x(function(d) { return x(d[0]); })
          .y(function(d) { return y(d[1]); })
      )

})

// This is what I need to compute kernel density estimation
function kernelDensityEstimator(kernel, X) {
  return function(V) {
    return X.map(function(x) {
      return [x, d3.mean(V, function(v) { return kernel(x - v); })];
    });
  };
}
function kernelEpanechnikov(k) {
  return function(v) {
    return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
  };
}




</script>
