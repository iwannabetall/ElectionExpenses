//initial variables
var height = 500;
var width = 1000;
var margin = 40;

var GenElectCand = ["Hillary Clinton", "Jill Stein", "Donald Trump", "Gary Johnson", "Evan McMullin"]
// Date range and parser
var startDate = new Date(2015,1,1);
var endDate = new Date(2016,12,1);
var parseTime = d3.timeParse("%d-%b-%y");

//initialize Y axis
var y = d3.scaleLinear()
	.domain([0,0])
	.range([margin,height-margin]);
		
// TIME SCALE - X AXIS
var timeScale = d3.scaleTime()
	.domain([startDate,endDate])
	.range([0,width-margin*2]);

// COLOR SCALE
var colors = d3.scaleOrdinal()
	.range(["#ff2b02", "#5ec2ff", "#af57fd", "#70cf35", "#239572", "#df08fd", "#d4a7f5", "#d25a8d", "#d85d46", "#f508b4", "#798c20", "#ff1964", "#19d380", "#0fccd6", "#b0bf8d", "#cfba0c", "#be5bcf", "#f9a1a2", "#2b85e3", "#fda60d", "#92807e", "#4b8da0", "#b07652", "#c46e10", "#6c75fc", "#b6b6d7", "#e8ae61"]);
	
pieColors = d3.scaleOrdinal(d3.schemeCategory20);

// Axis units
var yAxisSelection = 'dollars';
var timeSelection = 'campaign';

//data
var expendData = expendDataMonthly;

var svg,
	g,
	labelg;

//initial variables
//var boxedpieheight = 150;
var boxedpiewidth = 850;
var boxedpiemargin = 40;

function initVis() {
	
	//CANVAS
	svg = d3.select("#mainChart")
		.append("svg")
		.attr("width", width + width/5)
		.attr("height", height + 15);
		
	g = svg.append("g")
			.attr("transform", "translate("+margin*2+", 0)");
			
	labelg = svg.append("g")
			.attr("transform", "translate(0," +5+")");

	// X AXIS + LABEL
	g.append("g")
		.attr("class", "axis")
		.attr("class", "xaxis")
		.attr("transform", "translate(0,"+(height-margin)+")")
		.call(d3.axisBottom(timeScale)
			.ticks(d3.timeMonth.every(2)));

	svg.append("text")
		.attr("class", "axis-label")
		.attr("y", 495)
		.attr("x",0 + (width / 2))
		.style("text-anchor", "middle")
		.text("Time");

	// Y AXIS + LABEL
	g.append("g")
		.attr("class", "axis")
		.attr("class", "yaxis")
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
	g.append("clipPath")
		.attr("id", "clipper")
		.append("rect")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", width-margin)
		.attr("height", height-margin);
		
	//Y Axis Selectors
	svg.append("rect")
		.attr("x", 35)
		.attr("y", 8)
		.attr("width", 50)
		.attr("height", 18)
		.attr("rx", 5)
		.attr("ry", 5)
		.attr("fill", "black")
		.attr("class", "axisButtons")
		.on("mousedown", function(){changeAxis('dollars');});
		
	svg.append("text")
		.attr("x", 60)
		.attr("y", 21)
		.attr("text-anchor", "middle")
		.attr("class", "axisButtonText")
		.text("Dollars")
		.on("mousedown", function(){changeAxis('dollars');});
		
	svg.append("rect")
		.attr("x", 90)
		.attr("y", 8)
		.attr("width", 80)
		.attr("height", 18)
		.attr("rx", 5)
		.attr("ry", 5)
		.attr("fill", "black")
		.attr("class", "axisButtons")
		.on("mousedown", function(){changeAxis('percentages');});
		
	svg.append("text")
		.attr("x", 130)
		.attr("y", 21)
		.attr("text-anchor", "middle")
		.attr("class", "axisButtonText")
		.text("Percentages")
		.on("mousedown", function(){changeAxis('percentages');});

	//X Axis Selectors
	svg.append("rect")
		.attr("x", 197)
		.attr("y", 8)
		.attr("width", 97)
		.attr("height", 18)
		.attr("rx", 5)
		.attr("ry", 5)
		.attr("fill", "black")
		.attr("class", "axisButtons")
		.on("mousedown", function(){changeAxis('campaign');});
		
	svg.append("text")
		.attr("x", 245)
		.attr("y", 21)
		.attr("text-anchor", "middle")
		.attr("class", "axisButtonText")
		.text("Whole Campaign")
		.on("mousedown", function(){changeAxis('campaign');});
	
	//2016 button
	svg.append("rect")
		.attr("x", 300)
		.attr("y", 8)
		.attr("width", 40)
		.attr("height", 18)
		.attr("rx", 5)
		.attr("ry", 5)
		.attr("fill", "black")
		.attr("class", "axisButtons")
		.on("mousedown", function(){changeAxis('2016');});
		
	svg.append("text")
		.attr("x", 320)
		.attr("y", 21)
		.attr("text-anchor", "middle")
		.attr("class", "axisButtonText")
		.text("2016")
		.on("mousedown", function(){changeAxis('2016');});
		
	//General Election button
	svg.append("rect")
		.attr("x", 345)
		.attr("y", 8)
		.attr("width", 90)
		.attr("height", 18)
		.attr("rx", 5)
		.attr("ry", 5)
		.attr("fill", "black")
		.attr("class", "axisButtons")
		.on("mousedown", function(){changeAxis('general');});
		
	svg.append("text")
		.attr("x", 390)
		.attr("y", 21)
		.attr("text-anchor", "middle")
		.attr("class", "axisButtonText")
		.text("General Election")
		.on("mousedown", function(){changeAxis('general');});
		
	
}

//RENDER
function renderVis(plotData) {
	
	//find the max value in the whole nested array
	maxValue = d3.max(plotData, function(d){
		//function(g) returns the values of nested array (total expend on a day)
		return d3.max(d.values, function(g){ return +g.value; });
		});
	
	//New Y Scale
	var newY = d3.scaleLinear()
		.domain([(maxValue *1.1),0])
		.range([margin,height-margin]);	
	
	//rescale Y Axis and check features
	featuresRender();
	
	//function to construct each line in the path
	//d.key and d.value are time and expenditure values from the .nest() structure
	var line = d3.line()
		.curve(d3.curveMonotoneX)
		.x(function(d) {return timeScale(parseTime(d.key));})
		.y(function(d) {return newY(+d.value);});
	
	//data join with key from nest() as key
	var spendLines = g.selectAll('.spendLine').data(plotData, function(d) { return d.key;});
		
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
		.attr("id", function(d){ return d.key.split(",", 1)[0] + "SpendLine";})
		.attr("d", function(d) {return line(d.values);})
		.on("mouseover", function(d){ 
			var targetLabel = document.getElementById(d.key.split(",", 1)[0]+"SpendBackground").setAttribute("opacity", 1);
			})
		.on("mouseout", function(d){ 
			var targetLabel = document.getElementById(d.key.split(",", 1)[0]+"SpendBackground").setAttribute("opacity", 0);
			})
		.style("opacity", 0)
		.transition()
		.duration(500)
		.style("opacity", 1);
				
	spendLines
		.transition()
		.duration(1000)
		.attr("d", function(d){ return line(d.values);});
		
	rescaleAxes(newY);
		
	//LABELS DATA JOIN
	var spendLabelBackground = labelg.selectAll('.spendLabelBackground').data(plotData, function(d) { return d.key;});
	
	spendLabelBackground.exit().remove();
	
	spendLabelBackground.enter()
		.append("rect")
		.attr("x", width + 7)
		.attr("y", function(d,i){return 22*i - 3;})
		.attr("width", 190)
		.attr("height", 21)
		.attr("class", "spendLabelBackground")
		.attr("fill", "none")
		.attr("stroke", "#222")
		.attr("stroke-width", 2)
		.attr("id", function(d){ return d.key.split(",", 1)[0] + "SpendBackground";})
		.on("mouseover", function(d){ 
			document.getElementById(d.key.split(",", 1)[0]+"SpendLine").setAttribute("stroke-width", 5);
			})
		.on("mouseout", function(d){ 
			document.getElementById(d.key.split(",", 1)[0]+"SpendLine").setAttribute("stroke-width", 3);
			})
		.attr("opacity", 0);
		
	spendLabelBackground
		.transition()
		.duration(500)
		.attr("x", width + 7)
		.attr("y", function(d,i){return 22*i - 3;});
	
	var spendLabelRectangles = labelg.selectAll('.spendLabelRectangles').data(plotData, function(d) { return d.key;});
	
	spendLabelRectangles.exit().remove();
	
	spendLabelRectangles.enter()
		.append("rect")
		.attr("x", width + 10)
		.attr("y", function(d,i){return 22*i;})
		.attr("width", 15)
		.attr("height", 15)
		.attr("class", "spendLabelRectangles")
		.attr("id", function(d){ return d.key.split(",", 1)[0] + "SpendRectangle";})
		.attr("fill", function(d) { return colors(d.key);})
		.on("mouseover", function(d){ 
			document.getElementById(d.key.split(",", 1)[0]+"SpendLine").setAttribute("stroke-width", 5);
			})
		.on("mouseout", function(d){ 
			document.getElementById(d.key.split(",", 1)[0]+"SpendLine").setAttribute("stroke-width", 3);
			})
		.attr("opacity", 0)
		.transition()
		.duration(500)
		.attr("opacity", 1);
		
	spendLabelRectangles
		.transition()
		.duration(500)
		.attr("x", width + 10)
		.attr("y", function(d,i){return 22*i;});
		
	
	var spendLabels = labelg.selectAll('.spendLabels').data(plotData, function(d) { return d.key;});

	spendLabels.exit().remove();
	
	spendLabels.enter()
		.append("text")
		.attr("x", width + 35)
		.attr("y", function(d,i){return 22*i + 13;})
		.attr("class", "spendLabels")
		.attr("id", function(d){ return d.key.split(",", 1)[0] + "SpendLabel";})
		.on("mouseover", function(d){ 
			document.getElementById(d.key.split(",", 1)[0]+"SpendLine").setAttribute("stroke-width", 5);
			})
		.on("mouseout", function(d){ 
			document.getElementById(d.key.split(",", 1)[0]+"SpendLine").setAttribute("stroke-width", 3);
			})
		.text(function(d){return d.key;})
		.attr("opacity", 0)
		.transition()
		.duration(500)
		.attr("opacity", 1);
		
	spendLabels
		.transition()
		.duration(500)
		.attr("x", width + 35)
		.attr("y", function(d,i){return 22*i + 13;});
		
}

function TotalCatExpend(subcat_data){

	var totalspent = 0; //total spent by a candidate in 
	for (i=0; i<subcat_data.length; i++){
		totalspent += subcat_data[i].value;
	}
	return totalspent;
	//return {key: selections, value: totalspent};
}

function gettotalchecked(){
	var count = document.querySelectorAll('input[type="checkbox"]:checked').length;
	var featureid = document.getElementById("features");
	if (featureid.checked == true){
		count = count - 1;
	}
	return count;
}

function BoxedPie(subcat_data, filterOption, selections, Total_Selected_Expend, NoDataCount) {
	
	var totalspent = 0;

	//find the total expend in the nested array
	var CandidateTotalExpend = d3.max(subcat_data, function(d){
		totalspent += d.value;
		return totalspent;
		});
	//scale to percent of total expenditure (scale boxes in x direction)
	var CandBoxProportion = d3.scaleLinear()
		.domain([0,CandidateTotalExpend])
		.range([0,1]);	

	//scale in y direction 	
	var CombinedTotalSpend = Total_Selected_Expend.reduce(function(a, b) { return a + b; }, 0); //sum up candidate totals for scaling
	//what proportion of total selected candidates did they represent
	var CandidateProportion = d3.scaleLinear()
		.domain([0, CombinedTotalSpend])
		.range([0, 1]);

	//var TotalOfSelected = TotalCatExpend(Total_Selected_Expend, filterOption, selections)
	//console.log(TotalOfSelected);
	
	var totalchecked = gettotalchecked();  //get total checked
	totalchecked = totalchecked - NoDataCount;
	var CandTot = TotalCatExpend(subcat_data); 	
	var boxedpieheight = CandidateProportion(CandTot)*100*(totalchecked);
	
	var svg = d3.select('#pievis_container')
      .append('svg')
      .attr('width', boxedpiewidth)
      .attr('height', 20+boxedpieheight)
      .attr("y",function(d){ 
			//var totalchecked = totalchecked();  //get total checked
        	return 50+boxedpieheight/100;
        })
      .attr('class', 'boxedpie')
      .attr('id', selections + "_piegraph")
      .append('g');

      	//initialize tooltips
	var tip = d3.tip()
		.attr("class", "d3-tip")
		.html(function(d) { return (d.key)+"<br>"+ "$" + parseInt(d.value.toFixed(0)).toLocaleString();});
		
	svg.call(tip);
	//var div = d3.select("#pievis_container").append("div").attr("class", "toolTip");

	//svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    //if i move this so slice and .append are diff lines, the tool tip stops working?? 
    var piebox = svg.selectAll('#pievis_container').data(subcat_data, function(d) { return d.key; });
	
	var boxloc = 0;
	var runningtotal = 0;

    piebox.enter()
		.append('rect')
		.attr("x", function(d,i){ 
			runningtotal += CandBoxProportion(d.value);   //running tally of how many boxes/% of total
			boxloc = runningtotal - CandBoxProportion(d.value); //shift location of box to the left edge
			return boxloc*600; })
        .attr("y",function(){ 
        	//divide by 100 b/c y axis is backwards and higher #s => lower on svg
        	return boxedpieheight/100;
        })
        .attr("height", function(){ 
			return boxedpieheight;
        })
        .attr("width", function(d){ return CandBoxProportion(d.value)*600; })
		.attr('class',function(d) { return d.key;})		
		.attr('fill', function(d) {return pieColors(d.key);})
		.attr('id', function(d){ return d.key + "_" + selections;}) 
		.style('opacity', 0.7)
		.on("mouseover", function(d){
			tip.show(d);
			//bold, magnify the legend text
			var el = document.getElementById(d.key + "_pielegendtext");
			el.style.fontWeight = 'bold';
			el.style.textDecoration = 'underline';
			el.style.fontSize = '115%';	

			var cl = document.getElementsByClassName(d.key);
			for (i=0; i<cl.length; i++){
				cl[i].style.opacity = '1';
			}					
			//use the method above instead of the one below -- setattribute is less reliable according to Stackoverflow
			//document.getElementById(d.key + "_pielegendtext").setAttribute("style","fontWeight=normal");
		}) 
		.on("mouseout", function(d){ tip.hide(d);
			var el = document.getElementById(d.key + "_pielegendtext");
			el.style.fontWeight = 'normal';
			el.style.textDecoration = 'none';
			el.style.fontSize = '100%';
			var cl = document.getElementsByClassName(d.key);
			for (i=0; i<cl.length; i++){
				cl[i].style.opacity = '0.7';
			}					
		}

		);
    //slice.transition().duration(1000);

    piebox.exit()
    	.transition()
    	.style("opacity", 0)
        .remove();

    //label plot w/candidate name--add text after appending 

    // or mouseover legend will block out name when opacity is 1
    svg.append("text")
    	.attr("x", 700)
    	.attr("y", function(){ 
    		if(boxedpieheight < 40){
    			return boxedpieheight + 12;
    		}
    		else{ return boxedpieheight/2;}
    	})
    	.attr("text-anchor", "middle")
    	.style("font-size", "14px")
    	//.style("opacity", 0.7)
    	//.style("text-decoration", "underline")
    	.text(function(){ 
    		var M = 1000000; //Million
    		var K = 1000; //thousands
    		console.log(CandTot)
    		if (Math.round(CandTot*10/M)/10 >= 1 && Math.round(CandTot/M) < 10){
    			//*10 /10 gets the decimal to the 10ths place for some reason
    			var PrintedAmt = Math.round(CandTot*10/M)/10;
    			return selections + " ($" + PrintedAmt + "M)";
    		}
    		else if (Math.round(CandTot/M) >= 10){
    			var PrintedAmt = Math.round(CandTot/M);    		
    			return selections + " ($" + PrintedAmt + "M)";
    		}
    		else if (Math.round(CandTot*10/K)/10 < 10){
			//round to decimal if under 10k
    			var PrintedAmt = Math.round(CandTot*10/K)/10;
    			return selections + " ($" + PrintedAmt + "k)"; 
    		}
    		else if (Math.round(CandTot*10/K)/10 >= 10){
			//round to integer if > 10k
    			var PrintedAmt = Math.round(CandTot/K);
    			return selections + " ($" + PrintedAmt + "k)"; 
    		}
    		else { return selections + " ($" + CandTot + ")"; }
    	});
    			

    var categorycount = pieColors.domain().length;

	//console.log(pieColors.domain().length);	
		
	var legendbox = d3.select('#pievis_legend')
		.attr('width', 240)
		.attr('height', 30 * categorycount);

	//console.log(pieColors.domain());
	var legend = d3.select('#pievis_legend').selectAll('.pieLabel').data(pieColors.domain(), function(d){return d;});
	
	legend.enter()    
		.append("rect")
		.attr("class", "pieLabel")
		.attr("x", 5)
		.attr("y", function(d,i){ return 30*i;})
        .attr('width', 20)  //size of legend box 
        .attr('height', 20)
        .attr('id',function(d) { return d + "_pielegend";}) //d not d.key b/c data here is piecolors.domain which is array of categories 
//        .attr('display', flex)
  //      .attr('flex-direction', column)
        .style('fill', function(d){return pieColors(d)})
        .style('stroke', function(d){return pieColors(d)});

	legend.exit().remove();
		
	var legendText = d3.select('#pievis_legend').selectAll('.pieLabelText').data(pieColors.domain(), function(d){return d;});
		//pieColors.domain() = subcategories
	legendText.enter().append('text')
        .attr('x', 30)
        .attr('y', function(d,i){return (30*i) + 15;})  //?????
		.attr("class", "pieLabelText")
		.attr('id',function(d) { return d + "_pielegendtext";})
		.on("mouseover", function(d){ 
			//on mouseover of category, ie minibox
			//miniboxes = categories--individual squares w/in a candidate's plot
			var miniboxes = document.getElementsByClassName(d);  
			var svgselect = d3.selectAll('.boxedpie');  //svg canvas
			//if minibox DNE, then it needs to be 0 or the order gets off 
			//id of svg canvas 
			//for each box pie selected
			var mini_id_cand = []
			var SVGID_Cand = []

			//get list of candidates for which we have boxes of a particular category for
			for (j=0; j<miniboxes.length; j++){					
				var mini_id = miniboxes[j].getAttribute("id")
				mini_id_cand.push(mini_id.split("_")[1]) 
			}
			//get list of candidates for which we have graphs for 
			for (i=0; i<svgselect.size(); i++){
				var SVGID = svgselect.nodes()[i].id
				SVGID_Cand.push(SVGID.split("_")[0])
			}

			//if equal number of candidates and category boxes, then every candidate has data for that category

			if (mini_id_cand.length == SVGID_Cand.length)
			{
				for (i=0; i<SVGID_Cand.length; i++)
				{							
				//get dim of category's box and make another rectangle on top that's a little bigger
					var minih = miniboxes[i].getAttribute("height");
					var miniw = miniboxes[i].getAttribute("width");
					var minix = miniboxes[i].getAttribute("x");
					var miniy = miniboxes[i].getAttribute("y");
					var minifill = miniboxes[i].getAttribute("fill");
	 
					var highlightbox = d3.select(svgselect.nodes()[i])
						.append('rect')
						.attr('height', +minih + 8)
						.attr('width', +miniw + 8)
						.attr('x', minix)
						.attr('y', miniy)
						.attr('class', 'highlight')
						.attr('fill', minifill);
					}
				}
			else
			{
				//if a minibox DNE, a candidate doesn't have data, then need to set dim to 0 or the order gets off 
				for (i=0; i<SVGID_Cand.length; i++)
				{				
					//check if candidate has a particular category
					var index = mini_id_cand.indexOf(SVGID_Cand[i])

					if (index >= 0)  //indexOf returns -1 if not in array
						{
						var minih = miniboxes[index].getAttribute("height");
						var miniw = miniboxes[index].getAttribute("width");
						var minix = miniboxes[index].getAttribute("x");
						var miniy = miniboxes[index].getAttribute("y");
						var minifill = miniboxes[index].getAttribute("fill");
		 
						var highlightbox = d3.select(svgselect.nodes()[i])
							.append('rect')
							.attr('height', +minih + 8)
							.attr('width', +miniw + 8)
							.attr('x', minix)
							.attr('y', miniy)
							.attr('class', 'highlight')
							.attr('fill', minifill);
						}			
					else 
					{
						var minih = 0;
						var miniw = 0;
						var minix = 0;
						var miniy = 0;
						var minifill = 'black';
		 
						var highlightbox = d3.select(svgselect.nodes()[i])
							.append('rect')
							.attr('height', +minih)
							.attr('width', +miniw)
							.attr('x', minix)
							.attr('y', miniy)
							.attr('class', 'highlight')
							.attr('fill', minifill);	
							}
						}
				}					
			
			//document.getElementById(d).setAttribute("height", +document.getElementById(d).getAttribute("height") * 1.2);
			//document.getElementById(d).setAttribute("height", +document.getElementById(d).getAttribute("width") * 1.2);
			})
		.on("mouseout", function(d){ 
			//get element by id only selects first one -- we want to highlight all when hover over legend
			var miniboxes = document.getElementsByClassName(d);
			var selectmini = d3.selectAll('.'+d)
			for(i=0; i<miniboxes.length; i++){
				var miniselect = d3.selectAll('.highlight');
				for (i=0; i<miniselect.size(); i++){
					miniselect.nodes()[i].remove();
				}				
			} 
			//document.getElementById(d).setAttribute("style","opacity: 0.5");
			})
        .text(function(d) { return d;});
	
	legendText.exit().remove();
		
}

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

function removePieChart(selections){
	var DoesPieExist = !!document.getElementById(selections + "_piegraph")	
	if (DoesPieExist == true){
		//if pie chart exists
		//select svg element by id and delete it 
		document.getElementById(selections + "_piegraph").remove();	
	}
	else{
		return;

	}
	
}

var Total_Selected_Expend =[];

function justChecked(BoxJustChecked){

	//use this function for pie charts 
		//check if change was selecting another candidate or unchecking
	var checkedID = document.getElementById(BoxJustChecked);
	var filterOption = document.getElementById("filterSelect").value;

	if (checkedID.checked == false){
		removePieChart(BoxJustChecked);
	}
	//resize pie chart every time 
	filterChanged(filterOption)

}

function filterPartyPieData(selections, filterOption){
	data = expendData.sort(function(a,b){ return parseTime(a.date) - parseTime(b.date);});
	
	// filter on the selected category, unless total
	if(filterOption != 'Total'){
		data = data.filter(function(d){ return d.category == filterOption; });
	}
	
	if((selections == "Democratic Party") || (selections == "Republican Party"))
	{
	//filter for parties
		var partyFilter = data.filter(function(d){ 
			return selections.indexOf(d.party) > -1;
		});
		//IF NO DATA for a category, return false 
		if(partyFilter.length == 0){
			console.log("no data")
			return false;	
		}
		//nest party data--creating party total expend data for sep party total line --allows us to select total	
			//data by party, sub category for pie chart 
		piepartyData = d3.nest()  
			.key(function(d){ return d.party;})
			.key(function(d){ return d.category;})
			.sortKeys(d3.ascending)
			.key(function(d){ return d.label;})
			.rollup(function(leaves){ 
				var spendSum = d3.sum(leaves, function(g)
				{ 
				return g.expend; 
				});
			
				return spendSum;
			})
			.entries(partyFilter);	

	}

	//if selected totals --calculate total expenditures by summing up each subcategory and creating new JS obj
	if (filterOption == "Total"){
		var totaldata = CalcTotals(piepartyData);
		var subcat_data = totaldata;
	}
	else{
	//go thru candidate expenditures, nested by category and subcat--do not need for party level data
 	//get values  
		var subcat_data = GetSubcatValues(piepartyData, filterOption);
	} 

	return {subcat_data: subcat_data, filterOption: filterOption, selections: selections}
	
}

function filterChanged(filterOption){

	var Total_Selected_Expend =[];  //reset total counter 

	pieColors = d3.scaleOrdinal(d3.schemeCategory20);
	
	//filter changed, update pie charts
	//find which candidates are checked 
	var checked = getChecked();
	var selections = checked.selections;
	var partySelections = checked.partySelections;
	//var filterOption = checked.filterOption;
	var allchecked = selections.concat(partySelections);
	//allchecked.push(selections)
	//allchecked.push(partySelections)

	var selectionswithdata = allchecked;
	var CandidateTotalExpend;
	var AllFilteredPieData = [];
	var NoDataCount = 0;

	d3.selectAll(".pieLabel").remove();
	d3.selectAll(".pieLabelText").remove();
	//iterate backwards because splicing will mess up indices b/c it will return array w/varying size
	for (var i=selections.length-1; i >=0; i--){
		removePieChart(selections[i]);
		FilteredPieData = filterForPie(selections[i], [], filterOption);
		//if no data, remove filter if one person selected, quit function
		if (FilteredPieData == false){
			selectionswithdata.splice(i,1);  //remove candidate with no data
			NoDataCount++; 
			alert("No data for " + selections[i] + " for " + filterOption);
			//console.log(selectionswithdata.length)
			//console.log(selectionswithdata)
			//if if last candidate had no data, remove legend
			if (selectionswithdata.length == 0){
				//console.log('remove legend')
				d3.selectAll(".pieLabel").remove();
				d3.selectAll(".pieLabelText").remove();
				//document.getElementById(selections[i]).checked = false;			
			}					
			continue;
		}
		else{
			//has data, get total 
			CandidateTotalExpend = TotalCatExpend(FilteredPieData.subcat_data, FilteredPieData.selections)
			Total_Selected_Expend.push(CandidateTotalExpend);
			AllFilteredPieData.push(FilteredPieData);
			//has data, create pie chart 
			//renderPie2(FilteredPieData.subcat_data, FilteredPieData.filterOption, FilteredPieData.selections);	
			//BoxedPie(FilteredPieData.subcat_data, FilteredPieData.filterOption, FilteredPieData.selections,Total_Selected_Expend);	
		} 

	}

	for (var i=0; i<partySelections.length; i++){
		removePieChart(partySelections[i]);
		FilteredPieData = filterPartyPieData(partySelections[i], filterOption);

		if (FilteredPieData == false){
			return;
		}
		else{
			CandidateTotalExpend = TotalCatExpend(FilteredPieData.subcat_data, FilteredPieData.selections)
			Total_Selected_Expend.push(CandidateTotalExpend);
			AllFilteredPieData.push(FilteredPieData);
		//renderPie2(FilteredPieData.subcat_data, FilteredPieData.filterOption, FilteredPieData.selections);
			//BoxedPie(FilteredPieData.subcat_data, FilteredPieData.filterOption, FilteredPieData.selections,Total_Selected_Expend);	
		}
	}
	//console.log(AllFilteredPieData)
	//console.log(FilteredPieData.subcat_data)

	for (var i=0; i<AllFilteredPieData.length; i++){
		BoxedPie(AllFilteredPieData[i].subcat_data, AllFilteredPieData[i].filterOption, AllFilteredPieData[i].selections,Total_Selected_Expend, NoDataCount);	
	}

}

function GetSubcatValues(pieData, filterOption){
	var subcat_data = [];	
	//if not total
 	//go thru candidate expenditures, nested by category and subcat--do not need for party level data
 	//get values 
 	//can use pieData[0] here b/c newest added category is always on top/first in array
	for(var i=0; i < pieData[0].values.length; i++){ 
		if (pieData[0].values[i].key == filterOption){
			for (var j=0; j < pieData[0].values[i].values.length; j++){
				subcat_data.push(pieData[0].values[i].values[j]);
				//console.log(pieData[0].values[i].values[j]);
			}		
		}		
	}
	
	return subcat_data;
}

function CalcTotals(pieData){
	//pieData here is nested to subcategory level for party/candidate.  eg to level of airfare within travel 
	//calculate total per category (eg travel) by summing each sub category for pie chart
	var totaldata = [];	
	for (var i = 0; i < pieData[0].values.length; i++)
	{
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
	
	return totaldata;

}	

function filterForPie(selections, partySelections, filterOption){
	
	//console.log(filterOption);
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
	
	//IF NO DATA for a category, return false 
	if(filteredData.length == 0){
		return false;	
	}

	var filteredData = filteredData.filter(function(d){ return d.expend != 0;});
	
	var pieData = [];
	//console.log(pieData.length);
	//using data log of every expense, take the selection and find the average expenses per sub category per label for selected candidate
	//**GET DATA FOR PIE CHART (PARTY LEVEL STUFF ABOVE)
	pieData = d3.nest()  //takes json data and nests it by groups 
		.key(function(d){ return d.cand_name; }) //key is a function that goes with nest--group data by candidate first so we don't have to 
		//search thru each row every time we change candidate and can instead pull out a candidate's chunk
		.key(function(d){return d.category;})
		.sortKeys(d3.ascending)
		.key(function(d){return d.label;})    //pie chart data
		.rollup(function(leaves){  //.rollup accesses the tree values/leaves for the purpose of summing up
			var spendSum = d3.sum(leaves, function(g){ 
			return g.expend; });
			return spendSum;
		})
		.entries(filteredData);
	//pieData = pieData.concat(piepartyData);

	//if selected totals --calculate totals by summing up each subcategory and creating new JS obj
	if (filterOption == "Total"){
		totaldata = CalcTotals(pieData);
		var subcat_data = totaldata;
	}
	else{
		var subcat_data = GetSubcatValues(pieData, filterOption);
	}

 	//go thru candidate expenditures, nested by category and subcat--do not need for party level data
 	//get values 

 	return {subcat_data: subcat_data, filterOption: filterOption, selections: selections};

}

function candidateProcessor(){

	var checked = getChecked();
	var selections = checked.selections;
	var partySelections = checked.partySelections;
	var filterOption = checked.filterOption;
	var GenElect = document.getElementsByClassName("renderBox")
	//console.log(selections);
	
	/*//weekly or monthly data
	if(xAxisSelection == '2016'){
		expendData = expendDataBiweekly;
	}
	else{
		expendData = expendDataMonthly;
	}*/

	//filterForPie(selections, partySelections, filterOption);
	if(timeSelection == "general"){
		expendData = expendDataMonthly.filter(function(d){return parseTime(d.date) > parseTime("25-Jul-16")});
	}
	else if(timeSelection == "2016"){
		expendData = expendDataMonthly.filter(function(d){return parseTime(d.date) > parseTime("01-Dec-15")});
	}
	else{
		expendData = expendDataMonthly;
	}
	
	//Sort by date - otherwise lines double back on eachother
	//because dates are plotted out of order
	var filteredData = expendData.sort(function(a,b){ return parseTime(a.date) - parseTime(b.date);});
	
	// filter on the selected category, unless total
	if(filterOption != 'Total'){
		filteredData = filteredData.filter(function(d){ return d.category == filterOption; });
	}
	
	//filter - keep if d.cand_name has an index in array of selected candidates
	//filter is like nested for loop -- returns true/false
	filteredData = filteredData.filter(function(d){ return d.expend != 0;});
	
	//filter - keep if d.cand_name has an index in array of selected candidates
	var plotData = filteredData.filter(function(d){ 
			return selections.indexOf(d.cand_name) > -1;
	});
	
	//Nest the data 
	//returns [{'key': 'candidateName', 'values': [ {'key': date, 'value': 'expenditure'}, {etc.}]}]
	plotData = d3.nest()
		.key(function(d){return d.cand_name;})
		.sortKeys(d3.ascending)
		.key(function(d){return d.date;})
		.rollup(function(leaves){ 
			var spendSum = d3.sum(leaves, function(g){ 
			if(yAxisSelection == 'dollars'){
				return g.expend; 
			}
			else {
				return ((g.expend / candidateSums[g.cand_name]) * 100);
			}
			});
			return spendSum;
		})
		.entries(plotData);
	
	//if select Dem/Repub party --get party level aggregate data
	if(partySelections != []){
		//filter for parties
		var partyFilter = filteredData.filter(function(d){ 
				return partySelections.indexOf(d.party) > -1;
		});
		
		//nest party data--creating party total expend data for sep party total line --allows us to select total
		partyData = d3.nest()
			.key(function(d){ return d.party;})
			.sortKeys(d3.ascending)
			.key(function(d){return d.date;})
			.rollup(function(leaves){ 
				var spendSum = d3.sum(leaves, function(g){ 
			if(yAxisSelection == 'dollars'){
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

function featuresRender() {
	var featureSelection = document.getElementById("features");
	
	
	//initialize tooltips
	var tip = d3.tip()
		.attr("class", "d3-tip")
		.offset([-10, 0])
		.html(function(d) { return d['feature']; });
		
	svg.call(tip);
	
	//grab features
	if(featureSelection.checked == true){
		var featureLineData = features;
	}
	else {
		var featureLineData = [];
	}
	
	//plot feature lines
	var featureLines = g.selectAll(".featureLine").data(featureLineData, function(d){return d['feature'];});
	
	featureLines.enter().append('line')
			.attr("x1", function(d){ 
			return timeScale(parseTime(d.date));
			console.log(timeScale(parseTime(d.date)));
			})
			.attr("y1", height-margin)
			.attr("x2", function(d){ return timeScale(parseTime(d.date));})
			.attr("y2", margin)
			.attr("stroke-dasharray", "7, 3")
			.attr("stroke-width", 1)
			.attr("stroke", "black")
			.attr("class", "featureLine")
			.attr("clip-path", "url(#clipper)")
			.style("opacity", 0)
			.transition()
			.duration(500)
			.style("opacity", 1);
			
	featureLines.exit()
		.style("opacity", 1)
		.transition()
		.duration(500)
		.style("opacity", 0)
		.remove();
	
	featureLines.transition()
		.duration(1000)
		.attr("x1", function(d){ return timeScale(parseTime(d.date));})
		.attr("y1", height-margin)
		.attr("x2", function(d){ return timeScale(parseTime(d.date));})
		.attr("y2", margin);
	
	//plot feature rectangles
	var featureRects = g.selectAll(".featureRect").data(featureLineData, function(d){ return d['feature'];});
	
	featureRects.enter().append('rect')
		.attr("x", function(d){ return (timeScale(parseTime(d.date))) - 5;})
		.attr("y", margin - 10)
		.attr("width", 10)
		.attr("height", 10)
		.attr("fill", "black")
		.attr("class", "featureRect")
		.attr("clip-path", "url(#clipper)")
		.on("mouseover", function(d){tip.show(d);})
		.on("mouseout", function(d){tip.hide(d);})
		.style("opacity", 0)
		.transition()
		.duration(500)
		.style("opacity", 1);
	
	featureRects.exit()
		.style("opacity", 1)
		.transition()
		.duration(500)
		.style("opacity", 0)
		.remove();
	
	featureRects.transition()
		.duration(1000)
		.attr("x", function(d){ return (timeScale(parseTime(d.date))) - 5;});
}
	
//empty the checkboxes	
function resetBoxes() {
	var boxes = document.getElementsByClassName("renderBox");
	for(var i=0; i<boxes.length; i++){
		if(boxes[i].checked == true){
			//if checked, uncheck and remove pie graph
			boxes[i].checked = false;
			removePieChart(boxes[i].id);
			//console.log(boxes[i].id)
		}		
	}
	var partyBoxes = document.getElementsByClassName("partyBox");
	for(var i=0; i<partyBoxes.length; i++){
		if(partyBoxes[i].checked == true){
			//if checked, uncheck and remove pie graph
			partyBoxes[i].checked = false;
			removePieChart(partyBoxes[i].id);
			//console.log(partyBoxes[i].id)
		}
	}

		//reset category filter
	//document.getElementById("features").checked = false;

	//reset category filter
	document.getElementById("filterSelect").value = "Total";
	document.getElementById("features").checked = false;
	
	d3.selectAll(".pieLabel").remove();
	d3.selectAll(".pieLabelText").remove();
	inputChange('grow');
	/*document.getElementsByClassName("pieLabelText").forEach(function(d){
		d.remove();
	});*/

	//document.getElementById("pieLegendContainer").remove();
	//document.getElementById("pieVis_legend").remove();
	//renderVis()
	candidateProcessor();
}

//switch from percentage to dollars
function changeAxis(input){
	var checked = getChecked();
	var selections = checked.selections;
	var partySelections = checked.partySelections;
	var filterOption = checked.filterOption;	
	var allchecked = selections.concat(partySelections);
	//var GenElect = document.getElementsByClassName("renderBox")

	if(input == 'dollars'){
		svg.selectAll("#yaxisLabel").text("Dollars");
		yAxisSelection = input;
	}
	else if(input == 'percentages'){
		svg.selectAll("#yaxisLabel").text("% of Total");
		yAxisSelection = input;
	}
	else if(input == 'campaign'){
		startDate = new Date(2015,1,1);
		endDate = new Date(2016,12,1);
		timeScale = d3.scaleTime()
			.domain([startDate,endDate])
			.range([0,width-margin*2]);
		timeSelection = input;
		inputChange('grow');
	}
	else if(input == '2016'){
		startDate = new Date(2015,12,1);
		endDate = new Date(2016,12,1);
		timeScale = d3.scaleTime()
			.domain([startDate,endDate])
			.range([0,width-margin*2]);
		timeSelection = input;
		inputChange('grow');
	}
	else if(input == 'general'){
		startDate = new Date(2016,7,1);
		endDate = new Date(2016,11,15);
		timeScale = d3.scaleTime()
			.domain([startDate,endDate])
			.range([0,width-margin*2]);
		timeSelection = input;
		inputChange('shrink');
	}
	
	//remove all box pie charts 
	//var RemoveTheseBoxpies = document.getElementsByClassName("boxedpie")
	//why did this work and not the line above??
	var RemoveTheseBoxpies = d3.selectAll(".boxedpie").nodes() 
	
	for (i=0; i<RemoveTheseBoxpies.length;i++){
		RemoveTheseBoxpies[i].remove()
	}
	
	//rerender the visualization
	candidateProcessor();
	filterChanged(filterOption);
}

function rescaleAxes(newY){
	
	//rescale Y Axis
	g.selectAll('.yaxis')
		.transition()
		.duration(1000)
		.call(d3.axisLeft(newY));
	
	if(timeSelection == 'general'){
		g.selectAll('.xaxis')
			.transition()
			.duration(1000)
			.call(d3.axisBottom(timeScale)
			.ticks(d3.timeWeek.every(1)));
		
	}
	else if(timeSelection == '2016'){
		g.selectAll('.xaxis')
			.transition()
			.duration(1000)
			.call(d3.axisBottom(timeScale)
			.ticks(d3.timeMonth.every(1)));
				
	}
	else{
		g.selectAll('.xaxis')
			.transition()
			.duration(1000)
			.call(d3.axisBottom(timeScale)
			.ticks(d3.timeMonth.every(2)));
	}
	
}	

function inputChange(move){
	if(move == 'shrink'){
		var selectedInput = d3.selectAll(".prelimInput");
		var selectedLabels = d3.selectAll(".prelimLabel");
		
		selectedInput.property("checked", false);
		var filterOption = document.getElementById("filterSelect").value;
		filterChanged(filterOption);
		
		selectedInput.style("display", "none");
		console.log(selectedInput);
		
		selectedLabels.style("display", "none");
	}
	else{
		var selectedInput = d3.selectAll(".prelimInput").style("display", "inline-block");
		var selectedLabes = d3.selectAll(".prelimLabel").style("display", "inline-block");
	}
}	