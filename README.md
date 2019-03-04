# data_visualizaion_lego_investment

The project is part of a bachelor thesis about the potential of interactive data visualization for decision-making in alternative investment opportunities. The example of lego investment was to find out to what extent visualization can help to gain insights from a large amount of data. The data presented was extracted from bricklink.com and brickset.com from June 4, 2018 to June 8, 2018. Due to data errors and missing data, the presented data represents approximately 25% of the total dataset of Lego Sets. The Lego sets shown are from the years 1966-2017. A point in the scatter plot and a complete line in the parallel coordinates represents a Lego Set.

For lack of data visualization experience, I opted for an explorative visualization approach to gain basic knowledge myself. The technical implementation is based to a large extent on the JavaScript library D3.js by Mike Bostock and should therefore be mentioned at this point. I hope the use of this tool is fun and leads to interesting insights.

# Protoype Usage

https://benluc.github.io/data_visualization_lego_investment/

A point in the scatter plot or a line in the parallel coordinates represents one specific Lego Set.

Using the parallel coordinates, the displayed data can be filtered by their variables. Click and drag a selection area on a variable axis. It's worth mentioning that you can drag and drop the position of the axes to better understand relationships between neighboring variables. The selection can be overridden by clicking above or below the selection area.

Above the scatterplot is a control area. On the left side the currently displayed number of observations is shown. To the right of this one can project different variables onto the x or y axis of the scatterplot. Furthermore, readability can be improved by displaying or hiding the regression line, line raster, color by topic group and opacity of the data points.

When hovering over a data point in the scatter plot, detailed information is shown, like the set number or the name. By clicking on a data point, it is marked and can be detected more easily with changes of the scatterplot. Click again to remove the markup.

The bubble chart indicates the minimum, average, and maximum values of a variable for each axis.

