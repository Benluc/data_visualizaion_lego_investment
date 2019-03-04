// gridlines inspired by  https://bl.ocks.org/d3noob/c506ac45617cf9ed39337f99f8511218
// regression line inspired by https://bl.ocks.org/HarryStevens/be559bed98d662f69e68fc8a7e0ad097

function scatterPlot() {

  /**********************************************/
  /* Defining and initializing global Variables */
  /**********************************************/
  var m = [10, 16, 55, 74], // margins
      w = 480 - m[1] - m[3], // width
      h = 480 - m[0] - m[2], // height
      xcol = 0, // active x column
      ycol = 1, // active y column
      data = [];

  var t = d3.transition().duration(750);

  var svg, plot, dimensions, extents;

  // create scales
  var xScale = d3.scaleLinear().range([0, w]),
    yScale = d3.scaleLinear().range([h, 0]);

  var xAxis, yAxis;

  // color scale
  var color = {
    "Vintage themes": "#17becf",
    "Technical": "#8c564b",
    "Racing": "#00ee99",
    "Pre-school": "#7f7f7f",
    "Modern day": "#9467bd",
    "Model making": "#c5b0d5",
    "Miscellaneous": "#555555",
    "Licensed": "#bcbd22",
    "Junior": "#e377c2",
    "Historical": "#dbdb8d",
    "Girls": "#ffbb78",
    "Educational": "#ff7f0e",
    "Constraction": "#f7b6d2",
    "Basic": "#c49c94",
    "Action/Adventure": "#e7ba52",
  };

  var xAxisGroup, yAxisGroup, lg, dataBrush, 
    regressionLine = true,
    grid = true,
    groupColor = false,
    xGrid, yGrid, xLabel, yLabel;
  

  // Define the div for the tooltip
  var div = d3.select("body").append("div")
    .attr("class", "circleTooltip")
    .style("opacity", 0);

  // Setting up the skeleton of the scatterpo
  svg = d3.select("#scatter").append("svg")
    .attr("width", w + m[1] + m[3])
    .attr("height", h + m[0] + m[2]);

  plot = svg.append("g")
    .attr("class", "scatterPlot")
    .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

  xAxisGroup = svg.append('g')
    .attr("class", "xText")
    .attr('transform', 'translate(' + m[3] + ',' + (m[0] + h) + ')')

  yAxisGroup = svg.append('g')
    .attr('transform', 'translate(' + m[3] + ',' + m[0] + ')')


  // Create scatteplot 
  function scatter() {
    scatter.setDimension();
    scatter.update();
  };

  // Set the dimensions axis with there min and max value
  scatter.setDimension = function () {

    dimensions = [$("#xAxis").val(), $("#yAxis").val()];

    extents = _(dimensions)
      .map(function (col) {
        return [d3.min(data, function (d) {
          return parseFloat(d[col]);
        }), d3.max(data, function (d) {
          return parseFloat(d[col]);
        })]
      });
  }

  // On axis change update the scatterplot
  scatter.changeDimension = function () {
    scatter.setDimension();
    scatter.update();
  }
 // Onchange update the regression line visibility
  scatter.updateRegressionLine = function () {
    if (regressionLine) {
      d3.select(".regression").style("display", "none");
      regressionLine = false;
    } else {
      d3.select(".regression").style("display", null);
      regressionLine = true;
    }
  }
 // Onchange update the grid line visibility
  scatter.updateGrid = function () {
    if (grid) {
      d3.select(".xGrid").style("display", "none");
      d3.select(".yGrid").style("display", "none");
      grid = false;
    } else {
      d3.select(".xGrid").style("display", null);
      d3.select(".yGrid").style("display", null);
      grid = true;
    }
  }
  // Onchange update the color
  scatter.updateColor = function () {
    if (groupColor) {

      update = svg.selectAll('circle').attr("fill", "black")
      groupColor = false;
    } else {
      update = svg.selectAll('circle').attr("fill", function (d) {
        return color[d.themeGroup];
      })
      groupColor = true;
    }
  }
  // Onchange update the opacity
  scatter.updateOpacity = function (opacity) {
    update = svg.selectAll('circle').style("opacity", opacity / 100);
  }



  // gridlines in x axis function
  function make_x_gridlines() {
    return d3.axisBottom(xScale)
      .ticks(10)
  }

  // gridlines in y axis function
  function make_y_gridlines() {
    return d3.axisLeft(yScale)
      .ticks(10)
  }

  // Assignement of variables and values
  function getUnits(key) {
    switch (key) {
      case "USRetailPrice":
        return "$";
        break;
      case "avgSellPrice":
        return "$";
        break;
      case "profit":
        return "$"
        break;
      case "profitability":
        return "%";
        break;
      case "age":
        return "year";
        break;
      case "parts":
        return "number";
        break;
      case "weight":
        return "g";
        break;
      case "boxSize":
        return "cm^3";
        break;
      case "minifigs":
        return "number";
        break;
      case "offersByTotal":
        return "number";
        break;
      case "wantedByTotal":
        return "number";
        break;
      default:
        break;
    }
  }

  // Linked to the brush events of the parallel coordinates
  // Updates the scatterplot elements while brushing
  scatter.show = function (shown) {
    dataBrush = shown;
    // update circle elements
    update = svg.selectAll('circle')
      .style("display", function (d) {
        return shown.indexOf(d) > -1 ? null : "none";
      });

    // remove old regression line
    plot.select(".regression").remove();
    // create new regression line
    if(shown.length > 1){
    lg = calcLinear(shown, dimensions[0], dimensions[1], "x", "y", d3.min(shown, function (d) {
      return d[dimensions[xcol]];
    }), d3.max(shown, function (d) {
      return d[dimensions[ycol]];
    }));

    var regLine = plot.append("line")
      .attr("class", "regression")
      .attr("x1", xScale(lg.ptA.x))
      .attr("x2", xScale(lg.ptB.x))
      .attr("y1", yScale(lg.ptA.y))
      .attr("y2", yScale(lg.ptB.y));
    
      if (regressionLine) {
        regLine.style('display', null);
      } else {
        regLine.style('display', 'none');
      }
    }
  };
  

  scatter.update = function () {
    
    // Update Scales
    xScale.domain(d3.extent(extents[[xcol]]));
    yScale.domain(d3.extent(extents[[ycol]]));
    
    // Update x axis
    xAxis = d3.axisBottom(xScale);
    xAxisGroup.transition(t).call(xAxis).selectAll("text")
      .attr("y", "10")
      .attr("x", "5")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-20)");

    // Update y axis
    yAxis = d3.axisLeft(yScale);
    yAxisGroup.transition(t).call(yAxis);

     // Remove the grid lines if exist
     if (xGrid) {
      xGrid.remove();
    }
    if (yGrid) {
      yGrid.remove();
    }
    // Create the grid lines
    xGrid = plot.append('g')
      .attr("class", "xGrid grid")
      .call(make_x_gridlines()
        .tickSize(-h)
        .tickFormat("")
      )
      .attr("transform", "translate(0," + h + ")");

    yGrid = plot.append("g")
      .attr("class", "yGrid grid")
      .call(make_y_gridlines()
        .tickSize(-w)
        .tickFormat("")
      );
    if (!grid) {
      d3.select(".xGrid").style("display", "none");
      d3.select(".yGrid").style("display", "none");
    }

    /***********************************************/
    /* The location where D3's magic happens       */ 
    /* JOIN, ENTER, EXIT, UPDATE                   */
    /********************************************* */  

    
    // JOIN new data with old elements
    update = plot.selectAll('circle')
      .data(data); // dataSync ? dataSync : data

    // ENTER new elements present in new data
    update.enter().append('circle')
      .style("opacity", 0.2)
      .attr("fill", function (d) {
        if (groupColor) {
          return color[d.themeGroup];
        } else {
          return "black";
        }
      })
      .attr("cx", function (d) {
        return xScale(d[dimensions[xcol]]);
      })
      .attr("cy", function (d) {
        return yScale(d[dimensions[ycol]]);
      })
      .attr("r", 2)
      // While Hovering show Tooltip
      .on("mouseover", function (d) {
        //console.log(dimensions[ycol]);
        d3.select(this)
          .transition()
          .duration(300)
          .attr('r', 8)
          .attr('stroke-width', 1);
        div.transition()
          .duration(300)
          .style("opacity", .9);
        div.html("<strong>setNum: </strong>" + d.set_num + "<br/>" +
            "<strong>name: </strong>" + d.name + "<br/>" +
            "<strong>released: </strong>" + d.year + "<br/>" +
            "<strong>profit: </strong>" + d.profit + " (" + d.avgSellPrice + " - " + d.USRetailPrice + ")<br/>" +
            "<strong>themeGroup: </strong>" + d.themeGroup + "<br/>" +
            "<strong>theme: </strong>" + d.theme + "<br/>" +
            "<strong>subTheme: </strong>" + d.subtheme + "<br/>" +
            "<strong>" +dimensions[xcol]+ ": </strong>" + d[dimensions[xcol]] + " (" + getUnits(dimensions[xcol]) + ")<br/>" +
            "<strong>" +dimensions[ycol]+ ": </strong>" + d[dimensions[ycol]] + " (" + getUnits(dimensions[ycol]) + ")<br/>" 
          )
          .style("left", (d3.event.pageX + 14) + "px")
          .style("top", (d3.event.pageY - 40) + "px");
        })
        .on("mouseout", function (d) {
            if (d3.select(this).style("stroke") != "black") {
              d3.select(this)
                .transition()
                //.delay(500)
                .duration(400)
                .attr('r', 2)
                .attr('stroke-width', 1)
            } 
            div.transition()
              //.delay(500)
              .duration(400)
              .style("opacity", 0);
          })
        // Mark element so it is easy to see
        .on("click", function (d) {
          if (d.clicked) {
            d3.select(this)
              .transition()
              .duration(300)
              .attr('r', 2)
              .attr('stroke-width', 1)
              .style('stroke', null);
            d3.select(this).data(d.clicked = false);
          } else {
            d3.select(this).style("stroke", "black").attr("r", 8);
            d3.select(this).data(d.clicked = true);
          }
      });
    // EXIT old elements not present in new data
    update.exit().remove();

    // AND UPDATE old elements present in new data
    update
      .transition(t)
      .attr("cx", function (d) {
        return xScale(d[dimensions[xcol]]);
      })
      .attr("cy", function (d) {
        return yScale(d[dimensions[ycol]]);
      });

   



    // Remove old regression line
    plot.select(".regression").remove();
    // Make sure that calcLinear is getting the right data after brushing
    if(!dataBrush){
      dataBrush = data;
    }
    // Create new regression line
    lg = calcLinear(dataBrush, dimensions[0], dimensions[1], "x", "y", d3.min(data, function (d) {
      return d[dimensions[xcol]];
    }), d3.max(dataBrush, function (d) {

      return d[dimensions[ycol]];

    }));

    var regLine = plot.append("line")
      .attr("class", "regression")
      .attr("x1", xScale(lg.ptA.x))
      .attr("y1", yScale(lg.ptA.y))
      .attr("x2", xScale(lg.ptB.x))
      .attr("y2", yScale(lg.ptB.y));

    if (regressionLine) {
      regLine.style('display', null);
    } else {
      regLine.style('display', 'none');
    }

    // Remove old Labels if exist
    if (xLabel) {
      xLabel.remove();
    }
    if (yLabel) {
      yLabel.remove();
    }

    // Create new Labels
    xLabel = plot.append("text")
      .attr("class", "x axis-label")
      .attr("x", w / 2)
      .attr("y", h + 50)
      .attr("font-size", "16px")
      .attr("text-anchor", "middle")
      .text(dimensions[0] + " (" + getUnits(dimensions[0]) + ")");

    yLabel = plot.append("text")
      .attr("class", "y axis-label")
      .attr("x", -(h / 2))
      .attr("y", -60)
      .attr("font-size", "16px")
      .attr('text-anchor', "middle")
      .attr('transform', 'rotate(-90)')
      .text(dimensions[1] + " (" + getUnits(dimensions[1]) + ")");
  };

  // Binds the data submitted from the parallel coordinates
  scatter.data = function (small) {
    if (!arguments.length) return data;
    data = small;
    return scatter;
  };

  return scatter;
};




function calcLinear(data, xDimension, yDimension, x, y, minX, minY) {
  
 // Source:
 // https://bl.ocks.org/HarryStevens/be559bed98d662f69e68fc8a7e0ad097


  // Get just the points
  var pts = [];


  for (var key in data) {

    if (data.hasOwnProperty(key)) {


      var obj = {};

      obj.x = +data[key][xDimension];
      obj.y = +data[key][yDimension];
      obj.mult = obj.x * obj.y;
      pts.push(obj);
    }
  }

  // Let n = the number of data points
  var n = pts.length;


  // Let a equal n times the summation of all x-values multiplied by their corresponding y-values
  // Let b equal the sum of all x-values times the sum of all y-values
  // Let c equal n times the sum of all squared x-values
  // Let d equal the squared sum of all x-values
  var sum = 0;
  var xSum = 0;
  var ySum = 0;
  var sumSq = 0;
  pts.forEach(function (pt) {
    sum += pt.mult;
    xSum += pt.x;

    ySum += pt.y;
    sumSq += (pt.x * pt.x);
  });
  //console.log(pts);
  var a = sum * n;
  var b = xSum * ySum;
  var c = sumSq * n;
  var d = xSum * xSum;



  // Plug the values that you calculated for a, b, c, and d into the following equation to calculate the slope
  // slope = m = (a - b) / (c - d)
  var m = (a - b) / (c - d);

  /////////////
  //INTERCEPT//
  /////////////
  // Let e equal the sum of all y-values
  var e = ySum;

  // Let f equal the slope times the sum of all x-values
  var f = m * xSum;

  // Plug the values you have calculated for e and f into the following equation for the y-intercept
  // y-intercept = q = (e - f) / n
  var q = (e - f) / n;

  // Print the equation below the chart
  /* document.getElementsByClassName("equation")[0].innerHTML = "y = " + m.toFixed(2) + "x + " + b.toFixed(2);
  document.getElementsByClassName("equation")[1].innerHTML = "x = ( y - " + b + " ) / " + m; */

  // return an object of two points
  // each point is an object with an x and y coordinate
  return {
    ptA: {
      x: minX,
      y: m * minX + q
    },
    ptB: {
      y: minY,
      x: (minY - q) / m
    }
  };

}
