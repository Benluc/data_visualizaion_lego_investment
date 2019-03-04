// bubble Matrix inspired by http://bl.ocks.org/alandunning/51c76ec99c3ffee2fde6923ac14a4dd4

function bubbleMatrix() {
    
    /**********************************************/
    /* Defining and initializing global Variables */
    /**********************************************/
    var margin = {
        top: 10,
        right: 20,
        bottom: 20,
        left: 74
    };
    var width = 480 - margin.left - margin.right;
    var height = 445 - margin.top - margin.bottom;

    var xScale = d3.scaleBand().rangeRound([0, width]);
    var yScale = d3.scaleBand().rangeRound([height, 0]);

    var data = [],
        cData;  // converted Data

    var xMin, xMax, xMean;
    var yMin, yMax, yMean;
    var xDim, yDim;
    var grpNames;
    var bandWidthFactorCircle, bandWidthFactorText;
    var areaDomains = [];
    var rows, cells, circles, text;

    var t = d3.transition().duration(750);

    var xAxisGroup, yAxisGroup;

    // Setting up the skeleton of the bubble chart
    var svg = d3.select("#bubbleMatrix")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var plot = svg.append("g")
        .attr("class", "plot")
        .attr("transform", "translate(" + margin.top + "," + margin.bottom + ")");

    xAxisGroup = svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")");

    yAxisGroup = svg.append("g")
        .attr("class", "y axis");

    var area = d3.scalePow().exponent(0.5);

    // Create bubble chart
    function bMatrix() {
        bMatrix.setAreaScale();
        bMatrix.setDimension();
    }

    // Linked to the brush events of the parallel coordinates
    // Updates the bubble chart elements while brushing
    bMatrix.show = function (shown) {
        data = shown;
        if (data.length > 0) {
            bMatrix.setDimension();
        }
    }

    bMatrix.setAreaScale = function () {
        var keys = _.keys(data[0]);

        keys.forEach(element => {

            var scale = {
                name: element,
                min: d3.min(data, d => {
                    return d[element]
                }),
                max: d3.max(data, d => {
                    return d[element]
                }),
            }
            areaDomains.push(scale);
        });

    }
    // Setting up the needed variables
    bMatrix.setDimension = function () {

        xDim = $("#xAxis").val();
        yDim = $("#yAxis").val();

        xMin = d3.min(data, d => {
            return d[xDim];
        });
        xMax = d3.max(data, d => {
            return d[xDim];
        });
        xMean = d3.mean(data, d => {
            return d[xDim];
        });
        xMedian = d3.median(data, d => {
            return d[xDim];
        });
        xSum = d3.sum(data, d => {
            return d[xDim];
        });

        yMin = d3.min(data, d => {
            return d[yDim];
        });
        yMax = d3.max(data, d => {
            return d[yDim];
        });
        yMean = d3.mean(data, d => {
            return d[yDim];
        });
        yMedian = d3.median(data, d => {
            return d[yDim];
        });
        ySum = d3.sum(data, d => {
            return d[yDim];
        });


        var objxDomain = areaDomains.find(o => o.name === xDim);
        var objyDomain = areaDomains.find(o => o.name === yDim);

        // Setting up the data structure
        if (xDim == yDim) {
            cData = [{
                dim: yDim,
                groups: [{
                        name: 'min',
                        value: yMin,
                        min: yMin,
                        max: yMax,
                        aDomainMin: objyDomain.min,
                        aDomainMax: objyDomain.max
                    },
                    {
                        name: 'average',
                        value: yMean,
                        min: yMin,
                        max: yMax,
                        aDomainMin: objyDomain.min,
                        aDomainMax: objyDomain.max
                    },
                    /* {name:'median', value:yMedian, min:yMin, max:yMax, aDomainMin:objyDomain.min, aDomainMax:objyDomain.max},  */
                    {
                        name: 'max',
                        value: yMax,
                        min: yMin,
                        max: yMax,
                        aDomainMin: objyDomain.min,
                        aDomainMax: objyDomain.max
                    },

                    /* {name:'sum', value:ySum, min:yMin, max:yMax, aDomainMin:objyDomain.min, aDomainMax:objyDomain.max} */
                ]
            }];
            sameDim = true;
            bandWidthFactorCircle = 2.25;
            bandWidthFactorText = 4;

        } else {

            cData = [{
                    dim: yDim,
                    groups: [{
                            name: 'min',
                            value: yMin,
                            min: yMin,
                            max: yMax,
                            aDomainMin: objyDomain.min,
                            aDomainMax: objyDomain.max
                        },
                        {
                            name: 'average',
                            value: yMean,
                            min: yMin,
                            max: yMax,
                            aDomainMin: objyDomain.min,
                            aDomainMax: objyDomain.max
                        },
                        /* {name:'median', value:yMedian, min:yMin, max:yMax, aDomainMin:objyDomain.min, aDomainMax:objyDomain.max}, */
                        {
                            name: 'max',
                            value: yMax,
                            min: yMin,
                            max: yMax,
                            aDomainMin: objyDomain.min,
                            aDomainMax: objyDomain.max
                        },

                        /*  {name:'sum', value:ySum, min:yMin, max:yMax, aDomainMin:objyDomain.min, aDomainMax:objyDomain.max} */
                    ]
                },
                {
                    dim: xDim,
                    groups: [{
                            name: 'min',
                            value: xMin,
                            min: xMin,
                            max: xMax,
                            aDomainMin: objxDomain.min,
                            aDomainMax: objxDomain.max
                        },

                        {
                            name: 'average',
                            value: xMean,
                            min: xMin,
                            max: xMax,
                            aDomainMin: objxDomain.min,
                            aDomainMax: objxDomain.max
                        },
                        /* {name:'median', value:xMedian, min:xMin, max:xMax, aDomainMin:objxDomain.min, aDomainMax:objxDomain.max}, */
                        {
                            name: 'max',
                            value: xMax,
                            min: xMin,
                            max: xMax,
                            aDomainMin: objxDomain.min,
                            aDomainMax: objxDomain.max
                        },

                        /*  {name:'sum', value:xSum, min:xMin, max:xMax, aDomainMin:objxDomain.min, aDomainMax:objxDomain.max} */
                    ]
                }
            ];
            bandWidthFactorCircle = 2.5;
            bandWidthFactorText = -4;
        }

        grpNames = ['min', 'average' /* ,'median' */ , 'max'];

        bMatrix.update();
    }
    /***********************************************/
    /* The location where D3's magic happens       */ 
    /* JOIN, ENTER, EXIT, UPDATE                   */
    /********************************************* */  
    bMatrix.update = function () {
        // Update scales
        xScale.domain(grpNames);
        yScale.domain(cData.map(function (d) {
            return d.dim;
        }));

        // Update axis
        var xAxisCall = d3.axisBottom(xScale);
        xAxisGroup.transition(t).call(xAxisCall);

        var yAxisCall = d3.axisLeft(yScale);
        yAxisGroup.transition(t).call(yAxisCall);

        // JOIN new data with old row elements
        rows = plot.selectAll(".row")
            .data(cData, d => d.dim);
        // EXIT old row elements not present in new data
        rows.exit().remove()

        // ENTER new row elements present in new data
        rows = rows
            .enter()
            .append("g")
            .attr("class", "row")
            // UPDATE old row elements present in new data
            .merge(rows)

            .attr("transform", function (d) {
                return "translate(0," + yScale(d.dim) + ")";
            })

            // JOIN new data with old cell elements        
            cells = rows.selectAll(".cell")
                .data(d => {
                    return d.groups
                })

            // EXIT old row elements not present in new data
            cells.exit().remove()

            // ENTER new cell elements present in new data
            cells = cells
                .enter()
                .append("g")
                .attr("class", "cell")
                // UPDATE old cell elements present in new data
                .merge(cells)
                .attr("transform", function (d, i) {
                    return "translate(" + i * xScale.bandwidth() + ",0)";
                })

                // JOIN new data with old circle elements
                circles = cells.selectAll('circle')
                    .data(d => [d])

                // ENTER new circle elements present in new data
                circles.enter()
                    .append("circle")
                    .attr("cx", xScale.bandwidth() / 2.25)
                    // UPDATE old circle elements present in new data
                    .merge(circles)
                    .attr("class", function (d) {
                        return d.name
                    })
                    .style('fill', '#929292')
                    .transition(t)
                    .attr("cy", yScale.bandwidth() / bandWidthFactorCircle)
                    .attr("r", function (d, i) {
                            return area.domain([d.aDomainMin, d.aDomainMax])
                                .range([25, 60])(d.value);
                        }
                    );

                // JOIN new data with old text elements
                text = cells.selectAll('text').data(d => [d])

                // ENTER new text elements present in new data
                text.enter()
                    .append("text")
                    .attr("text-anchor", "middle")
                    .style("fill", "#ffffff")
                    .attr("dx", xScale.bandwidth() / 2.25)
                    // UPDATE old text elements present in new data
                    .merge(text)
                    .transition(t)
                    .attr("dy", (yScale.bandwidth() / 2.25) + bandWidthFactorText) // .attr("dy", yScale.bandwidth() + 14)
                    .text(function (d) {
                        return d.value.toFixed(2);
                    });
    }
    // Binds the data submitted from the parallel coordinates
    bMatrix.data = function (d) {
        if (!arguments.length) return data;
        data = d;
        return bMatrix;
    };

    return bMatrix;
}