//initial variables
var height = 500;
var width = 1000;
var margin = 40;

// Date range and parser
var startDate = new Date(2015,1,1);
var endDate = new Date(2016,11,30);
var parseTime = d3.timeParse("%d-%b-%y");

//initialize Y axis
var y = d3.scaleLinear()
	.domain([0,0])
	.range([margin,height-margin]);
		
// TIME SCALE - X AXIS
var timeScale = d3.scaleTime()
	.domain([startDate,endDate])
	.range([margin,width-margin]);

// COLOR SCALE
var colors = d3.scaleOrdinal(d3.schemeCategory20);

// Axis units
var axisSelection = true;

var svg;

function initVis() {
	
	//CANVAS
	svg = d3.select("#mainChart")
		.append("svg")
		.attr("width", width + width/5)
		.attr("height", height);

	// X AXIS + LABEL
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate("+margin+","+(500-margin)+")")
		.call(d3.axisBottom(timeScale)
			.ticks(d3.timeMonth.every(2)));

	svg.append("text")
		.attr("class", "axis-label")
		.attr("y", 495)
		.attr("x",0 + (width / 2))
		.style("text-anchor", "middle")
		.text("Time");

	// Y AXIS + LABEL
	svg.append("g")
		.attr("class", "axis")
		.attr("class", "yaxis")
		.attr("transform", "translate("+margin*2+",0)")
		.call(d3.axisLeft(y));

	svg.append("text")
		.attr("transform", "rotate(90)")
		.attr("class", "axis-label")
		.attr("id", "yaxisLabel")
		.attr("y", -5)
		.attr("x",0 + (500 / 2))
		.style("text-anchor", "middle")
		.text("Dollars");
	
	//clipPath
	svg.append("clipPath")
		.attr("id", "clipper")
		.append("rect")
		.attr("x", margin*2)
		.attr("y", margin)
		.attr("width", width-2*margin)
		.attr("height", height-margin*2);
		
	//axis selectors
	svg.append("rect")
		.attr("x", 35)
		.attr("y", 10)
		.attr("width", 50)
		.attr("height", 18)
		.attr("rx", 5)
		.attr("ry", 5)
		.attr("fill", "black")
		.attr("class", "axisButtons")
		.on("mousedown", function(){changeAxis(true);});
		
	svg.append("text")
		.attr("x", 60)
		.attr("y", 23)
		.attr("text-anchor", "middle")
		.attr("class", "axisButtonText")
		.text("Dollars")
		.on("mousedown", function(){changeAxis(true);});
		
	svg.append("rect")
		.attr("x", 90)
		.attr("y", 10)
		.attr("width", 80)
		.attr("height", 18)
		.attr("rx", 5)
		.attr("ry", 5)
		.attr("fill", "black")
		.attr("class", "axisButtons")
		.on("mousedown", function(){changeAxis(false);});
		
	svg.append("text")
		.attr("x", 130)
		.attr("y", 23)
		.attr("text-anchor", "middle")
		.attr("class", "axisButtonText")
		.text("Percentages")
		.on("mousedown", function(){changeAxis(false);});
}

//RENDER
function renderVis(plotData) {
	
	//find the max value in the whole nested array
	maxValue = d3.max(plotData, function(d){
		return d3.max(d.values, function(g){ return +g.value; });
		});
	
	//New Y Scale
	var newY = d3.scaleLinear()
		.domain([(maxValue*1.1),0])
		.range([margin,height-margin]);
		
	//rescale Y Axis
	svg.selectAll('.yaxis')
		.transition()
		.duration(1000)
		.call(d3.axisLeft(newY));	
	
	//function to construct each line in the path
	//d.key and d.value are time and expenditure values from the .nest() structure
	var line = d3.line()
		.curve(d3.curveBasis)
		.x(function(d) {return margin + timeScale(parseTime(d.key));})
		.y(function(d) {return newY(+d.value);});
	
	//data join with key from nest() as key
	var spendLines = svg.selectAll('.spendLine').data(plotData, function(d) { return d.key;});
		
	spendLines.exit()
		.transition()
		.duration(500)
		.style("opacity", 0)
		.remove();
		
	//generate the paths;
	//use line(d.values) to drill down to values of nested data
	spendLines.enter()
		.append("path")
		.attr("class", "spendLine")
		.attr("stroke", function(d) { return colors(d.key)})
		.attr("stroke-width", 3)
		.attr("clip-path", "url(#clipper)")
		.attr("d", function(d) {return line(d.values);})
		.on("mouseover", function(d){
                    document.getElementById("details").innerHTML = d.key;
                })
                .on("mouseout", function(){ document.getElementById("details").innerHTML = "&nbsp;"; })
		.style("opacity", 0)
		.transition()
		.duration(500)
		.style("opacity", 1);
				
	spendLines
		.transition()
		.duration(1000)
		.attr("d", function(d){ return line(d.values);});
		
		
	//LABELS DATA JOIN
	var spendLabelRectangles = svg.selectAll('.spendLabelRectangles').data(plotData, function(d) { return d.key;});
	
	spendLabelRectangles.exit().remove();
	
	spendLabelRectangles.enter()
		.append("rect")
		.attr("x", width + 10)
		.attr("y", function(d,i){return 20*i;})
		.attr("width", 15)
		.attr("height", 15)
		.attr("class", "spendLabelRectangles")
		.attr("fill", function(d) { return colors(d.key);})
		.attr("opacity", 0)
		.transition()
		.duration(500)
		.attr("opacity", 1);
		
	spendLabelRectangles
		.transition()
		.duration(500)
		.attr("x", width + 10)
		.attr("y", function(d,i){return 20*i;});
		
	
	var spendLabels = svg.selectAll('.spendLabels').data(plotData, function(d) { return d.key;});

	spendLabels.exit().remove();
	
	spendLabels.enter()
		.append("text")
		.attr("x", width + 35)
		.attr("y", function(d,i){return 20*i + 13;})
		.attr("class", "spendLabels")
		.text(function(d){return d.key;})
		.attr("opacity", 0)
		.transition()
		.duration(500)
		.attr("opacity", 1);
		
	spendLabels
		.transition()
		.duration(500)
		.attr("x", width + 35)
		.attr("y", function(d,i){return 20*i + 13;});
		
}

function renderPie2(subcat_data, filterOption) {
	var width = 360;
    var height = 360;
    var radius = Math.min(width, height) / 2;
    var donutWidth = 75;
    var legendRectSize = 18;  // size of the coloured squares
	var legendSpacing = 4;
    var color = d3.scaleOrdinal(d3.schemeCategory20b);

    var svg = d3.select('#pievis_container')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + (width / 2) +
        ',' + (height / 2) + ')');

	svg.append("g")
		.attr("class", "slices");
	svg.append("g")
		.attr("class", "labelName");
	svg.append("g")
		.attr("class", "labelValue");
	svg.append("g")
		.attr("class", "lines");

	var pie = d3.pie()
		.value(function(d) {
			return d.value;
		});
		//.sort(function(d) { return d.key; });

	var arc = d3.arc()
		.outerRadius(radius * 0.8)
		.innerRadius(radius * 0.4);

	var outerArc = d3.arc()
		.innerRadius(radius * 0.9)
		.outerRadius(radius * 0.9);

	var legendRectSize = (radius * 0.05);
	var legendSpacing = radius * 0.02;

	var piedata = pie(subcat_data);
	//console.log(piedata);


	var div = d3.select("#pievis_container").append("div").attr("class", "toolTip");

	svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	//	var colorRange = d3.scale.category20();
	//var color = d3.scaleOrdinal(d3.schemeCategory20);
	//		.range(colorRange.range());

	/* ------- PIE SLICES -------*/
	//var slice = svg.select(".slices").selectAll("path.slice")
        //.data(pie(subcat_data), function(d){ return d.label });
    //slice.enter()
        //.insert("path")
        //.style("fill", function(d) { return color(d.label); })
        //.attr("class", "slice");

    //if i move this so slice and .append are diff lines, the tool tip stops working?? 
    var slice = svg.selectAll('path').data(piedata, function(d) { return d.data.key; })	    
    	.enter()
	    .append('path')
	    .attr('d', function(d) {return arc(d);})  //svg has something called d for path 
	    .attr('fill', function(d) {
	      return color(d.data.key);
	    });

    slice
        .transition().duration(1000)
        .attrTween("d", function(d) {   
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                return arc(interpolate(t));
            };
        })
    slice
        .on("mousemove", function(d){
        	//console.log(d.data.key);
            div.style("left", d3.event.pageX+10+"px");
            div.style("top", d3.event.pageY-25+"px");
            div.style("display", "inline-block");
            div.html((d.data.key)+"<br>"+ "$" + parseInt(d.data.value.toFixed(0)).toLocaleString());
        });
    slice
        .on("mouseout", function(d){
            div.style("display", "none");
        });

    slice.exit()
    	.transition()
    	.style("opacity", 0)
        .remove();

    var legend = svg.selectAll('.legend')
        .data(color.domain())
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) {
            var height = legendRectSize + legendSpacing;
            var offset =  height * color.domain().length / 2;
            var horz = -3 * legendRectSize;
            var vert = i * height - offset;
            return 'translate(' + horz + ',' + vert + ')';
        });

    legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', color)
        .style('stroke', color);

    legend.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text(function(d) { return d;
          });
//text labels 
    /* ------- SLICE TO TEXT POLYLINES -------*/
    var polyline = svg.select(".lines").selectAll("polyline")
        .data(pie(subcat_data), function(d){ return d.data.key });

	polyline.enter()
		.append("polyline")
		.style("opacity", 0)
		.each(function(d) {
			this._current = d;
		});

    polyline.transition().duration(1000)
        .attrTween("points", function(d){
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                return [arc.centroid(d2), outerArc.centroid(d2), pos];
            };
        });

    polyline.exit()
        .remove();

};

/* 
function labelsProcessor(selection){
	
	var filteredData = expendData.filter(function(d){return d.cand_name == selection});
	filteredData.sort(function(a,b){ return parseTime(a.date) - parseTime(b.date);});
	
	plotData = d3.nest()
		.key(function(d){ return d.category; })
		.key(function(d){return d.date;})
		.rollup(function(leaves){ 
			var spendSum = d3.sum(leaves, function(g){ 
			return g.expend; });
			return spendSum;
		})
		.entries(filteredData);
		
	renderVis(plotData);
} */

function getChecked(){

	//get candidate selections
	var candBoxes = document.getElementsByClassName("renderBox");
	var selections = [];
	for (i=0; i<candBoxes.length; i++) {
		if (candBoxes[i].checked){
			selections.push(candBoxes[i].value);
		}
	}
	
	//get party selections
	var partyBoxes = document.getElementsByClassName("partyBox");
	partySelections = [];
	for (i=0; i<partyBoxes.length; i++) {
		if (partyBoxes[i].checked){
			partySelections.push(partyBoxes[i].value);
		}
	}
	
	//get category selection
	var filterOption = document.getElementById("filterSelect").value;
	return {selections: selections, partySelections: partySelections, filterOption: filterOption};

}

function justChecked(BoxJustChecked){

	totalchecked = document.querySelectorAll('input[type="checkbox"]:checked').length;

	if (totalchecked == 0){
		console.log("none selected")
		//no candidates/party selected, clear page of all pie charts 
	}
	else{
		//check if change was selecting another candidate or unchecking
		var checkedID = document.getElementById(BoxJustChecked);
		if (checkedID.checked){
			//selections = BoxJustChecked;
		}
		else{
			//delete graph of unchecked option
		}
		var userChange = checkedID.value;
		console.log(userChange)
	}

	//console.log(partySelections)
	
	//get category selection
	var filterOption = document.getElementById("filterSelect").value;

}

function filterChanged(category){
	//filter changed, update pie charts
}

function filterForPie(selections, partySelections, filterOption){
	//Sort by date - otherwise lines double back on eachother
	//because dates are plotted out of order
	data = expendData.sort(function(a,b){ return parseTime(a.date) - parseTime(b.date);});
	
	// filter on the selected category, unless total
	if(filterOption != 'Total'){
		data = data.filter(function(d){ return d.category == filterOption; });
	}
	
	//filter - keep if d.cand_name has an index in array of selected candidates
	var filteredData = data.filter(function(d){ 
			return selections.indexOf(d.cand_name) > -1;
	});
	
	//filter - keep if d.cand_name has an index in array of selected candidates
	//filter is like nested for loop -- returns true/false
	var filteredData = filteredData.filter(function(d){ return d.expend != 0;});
		if(partySelections != []){
		//filter for parties
		var partyFilter = data.filter(function(d){ 
				return partySelections.indexOf(d.party) > -1;
		});
		
		//nest party data--creating party total expend data for sep party total line --allows us to select total	
			//data by party, sub category for pie chart 
		piepartyData = d3.nest()  
			.key(function(d){ return d.party;})
			.key(function(d){ return d.category;})
			.key(function(d){ return d.label;})
			.rollup(function(leaves){ 
				var spendSum = d3.sum(leaves, function(g){ 
				return g.expend; });
				return spendSum;
			})
			.entries(partyFilter);	
	}

	var pieData = [];
	//console.log(pieData.length);
	//**GET DATA FOR PIE CHART (PARTY LEVEL STUFF ABOVE)
	pieData = d3.nest()  //takes json data and nests it by groups 
		.key(function(d){ return d.cand_name; }) //key is a function that goes with nest--group data by candidate first so we don't have to 
		//search thru each row every time we change candidate and can instead pull out a candidate's chunk
		.key(function(d){return d.category;})
		.key(function(d){return d.label;})  //pie chart data
		.rollup(function(leaves){  //.rollup accesses the tree values/leaves for the purpose of summing up
			var spendSum = d3.sum(leaves, function(g){ 
			return g.expend; });
			return spendSum;
		})
		.entries(filteredData);
	//console.log(pieData.length);
	pieData = pieData.concat(piepartyData);

	//if selected totals --calculate totals by summing up each subcategory and creating new JS obj
	if (filterOption == "Total"){
		var totaldata = [];	
		for (var i = 0; i < pieData[0].values.length; i++){
			categorytotal = 0;
			for (var j=0; j<pieData[0].values[i].values.length; j++){
				//sum subcategory totals
				categorytotal += pieData[0].values[i].values[j].value;
				//need to reset category total and save as key
			}			
			//totaldata[pieData[0].values[i].key] = categorytotal;
				var cat_totaldata = {};
				cat_totaldata["key"] = pieData[0].values[i].key;
				//console.log(pieData[0].values[i].key);
				//console.log(categorytotal);
				cat_totaldata["value"] = categorytotal;
				totaldata.push(cat_totaldata);
		}		 
	}

	var subcat_data = [];	
 	//go thru candidate expenditures, nested by category and subcat
 	//get values 
 	//can use pieData[0] here b/c newest added category is always on top/first in array
	for(var i=0; i < pieData[0].values.length; i++){ 
		if (pieData[0].values[i].key == filterOption){
			for (var j=0; j < pieData[0].values[i].values.length; j++){
				subcat_data.push(pieData[0].values[i].values[j]);
				//console.log(pieData[0].values[i].values[j]);
			}		
		}		
		else if (filterOption == "Total"){
			//console.log("total selected");
			subcat_data = totaldata;
		}
	}

	renderPie2(subcat_data, filterOption);

}

function candidateProcessor(){

	var checked = getChecked();
	var selections = checked.selections;
	var partySelections = checked.partySelections;
	var filterOption = checked.filterOption;
	//console.log(selections);

	filterForPie(selections, partySelections, filterOption);
	//Sort by date - otherwise lines double back on eachother
	//because dates are plotted out of order
	data = expendData.sort(function(a,b){ return parseTime(a.date) - parseTime(b.date);});
	
	// filter on the selected category, unless total
	if(filterOption != 'Total'){
		data = data.filter(function(d){ return d.category == filterOption; });
	}
	
	//filter - keep if d.cand_name has an index in array of selected candidates
	var filteredData = data.filter(function(d){ 
			return selections.indexOf(d.cand_name) > -1;
	});
	
	//filter - keep if d.cand_name has an index in array of selected candidates
	//filter is like nested for loop -- returns true/false
	var filteredData = filteredData.filter(function(d){ return d.expend != 0;});
	
	//Nest the data 
	//returns [{'key': 'candidateName', 'values': [ {'key': date, 'value': 'expenditure'}, {etc.}]}]
	plotData = d3.nest()
		.key(function(d){return d.cand_name;})
		.sortKeys(d3.ascending)
		.key(function(d){return d.date;})
		.rollup(function(leaves){ 
			var spendSum = d3.sum(leaves, function(g){ 
			if(axisSelection == true){
				return g.expend; 
			}
			else {
				return ((g.expend / candidateSums[g.cand_name]) * 100);
			}
			});
			return spendSum;
		})
		.entries(filteredData);
	
	//if select Dem/Repub party --get party level aggregate data

	if(partySelections != []){
		//filter for parties
		var partyFilter = data.filter(function(d){ 
				return partySelections.indexOf(d.party) > -1;
		});
		
		//nest party data--creating party total expend data for sep party total line --allows us to select total
		partyData = d3.nest()
			.key(function(d){ return d.party;})
			.sortKeys(d3.ascending)
			.key(function(d){return d.date;})
			.rollup(function(leaves){ 
				var spendSum = d3.sum(leaves, function(g){ 
			if(axisSelection == true){
				return g.expend; 
			}
			else {
				return ((g.expend / candidateSums[g.party]) * 100);
			}
			});
				return spendSum;
			})
			.entries(partyFilter);		
			
	}

	plotData = plotData.concat(partyData);
	
	renderVis(plotData);

}

function featuresRender(selection) {
	if(selection.checked == true){
		var featureLineData = features;
	}
	else {
		var featureLineData = [];
	}
	
	var featureLines = svg.selectAll(".featureLine").data(featureLineData);
	
	featureLines.enter().append('line')
			.attr("x1", function(d){ return margin + timeScale(parseTime(d.date));})
			.attr("y1", height-margin)
			.attr("x2", function(d){ return margin + timeScale(parseTime(d.date));})
			.attr("y2", margin)
			.attr("stroke-dasharray", "7, 3")
			.attr("stroke-width", 1)
			.attr("stroke", "black")
			.attr("class", "featureLine")
			.on("mouseover", function(d){document.getElementById("details").innerHTML = d.feature;})
            .on("mouseout", function(){ document.getElementById("details").innerHTML = "&nbsp;"; });
		/*	
	svg.selectAll(".featureText").data(featureLineData).append("text")
		.attr("transform", "rotate(90)")
		.attr("y", 100)
		.attr("x", function(d){ return margin + timeScale(parseTime(d.date));})
		.attr("class", "featureText")
		.style("text-anchor", "middle")
		.text(function(d){ return d.feature;});
			*/
	featureLines.exit().remove();
	
}
	
//empty the checkboxes	
function resetBoxes() {
	var boxes = document.getElementsByClassName("renderBox");
	for(var i=0; i<boxes.length; i++){
		boxes[i].checked = false;
	}
	var partyBoxes = document.getElementsByClassName("partyBox");
	for(var i=0; i<partyBoxes.length; i++){
		partyBoxes[i].checked = false;
	}
	candidateProcessor();

}

function changeAxis(input){
	axisSelection = input;
	
	if(axisSelection == true){
		svg.selectAll("#yaxisLabel").text("Dollars");
	}
	else {
		svg.selectAll("#yaxisLabel").text("% of Total");
	}
	
	candidateProcessor();
}
