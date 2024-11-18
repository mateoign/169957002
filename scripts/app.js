function assignment9(){
    var batting_file="clean_batting.csv";
    var pitching_file="clean_pitching.csv";
    var bp_file = 'birth_places.csv'
    showing_batters(batting_file);
    showing_pitchers(pitching_file);
    showing_bp(bp_file)
    vis1(bp_file)
    vis2(batting_file)
    vis3(pitching_file)
    vis4(pitching_file)
    vis5(batting_file)
}

var showing_batters=function(batting_file){
    d3.csv(batting_file, d3.autoType).then(function(data){
        console.log(data)
    });
}

var showing_pitchers=function(pitching_file){
    d3.csv(pitching_file, d3.autoType).then(function(data){
        console.log(data)
    })
}

var showing_bp=function(bp_file){
    d3.csv(bp_file, d3.autoType).then(function(data){
        console.log(data)
    });
}

var vis1=function(bp_file){
    
    //reading data
    d3.csv(bp_file).then(data=>{
        var margin = {top: 40, right: 30, bottom: 30, left: 100},
        width = 1000 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

        var svg = d3.select("#v1_plot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
    
        
    
        var rScale = d3.scaleSqrt()
            .domain(d3.extent(data, d=>d.count))
            .range([3, 3.5]);

        const projection = d3.geoNaturalEarth1()
            .scale(180);
        const pathgeo = d3.geoPath().projection(projection); 
        const mappy = d3.json("world.json");
        mappy.then(function(map){
                svg.selectAll("path")
                    .data(map.features)
                    .enter().append("path")
                    .attr("d", pathgeo)
                    .style('fill', 'teal')

                    var tooltip = d3.select("#v1_plot")
                    .append("div")
                    .style("opacity", 0)
                    .attr("class", "tooltip")
                    .style("background-color", "white")
                    .style("border", "solid")
                    .style("border-width", "2px")
                    .style("border-radius", "5px")
                    .style("padding", "5px")
                    
                    var mouseover = function(d) {
                        tooltip.style("opacity", 1)
                      }
                    var mousemove = function(e, d) {
                        tooltip
                          .html("The exact value of<br>" +d.country+ " is: " + parseFloat(d.count))
                          .style("left", (d3.pointer(e, this)))
                          .style("top", (d3.pointer(e, this)))
                      }
                    var mouseleave = function(d) {
                        tooltip.style("opacity", 0)
                      }
                
                      svg.selectAll("circle")
                      .data(data)
                      .enter()
                      .append("circle")
                      .attr("r", function(d) {
                          return rScale(d.count)
                      })
                      .attr("fill","blue")
                      .attr("transform", function(d) {
                          return "translate(" + projection([d.longitude, d.latitude]) + ")";
                      })
                      .on("mouseover", mouseover)
                  .on("mousemove", mousemove)
                  .on("mouseleave", mouseleave)
        var sscale = svg.append("g")
        .attr("class", "scale")
        .attr("transform", "translate(20,20)");
        
        var scalesize = 10;
        var scalespacing = 40; 

        var sdata = [5, 300, 10000];
        var labels = ["5", "300", '10000+']; 

        sscale.selectAll(".legend-item")
            .data(sdata)
            .enter()
            .append("circle")
            .attr("class", "legend-item")
            .attr("cx", scalesize)
            .attr("cy", function(d, i) { return i * (scalesize + scalespacing); })
            .attr("r", function(d) { return rScale(d); })
            .attr("fill", 'blue')
            .attr("stroke", "black")
            .attr("stroke-width", "2");

        sscale.selectAll(".legend-label")
            .data(labels)
            .enter()
            .append("text")
            .attr("class", "legend-label")
            .attr("x", scalesize * 5)
            .attr("y", function(d, i) { return i * (scalesize + scalespacing); })
            .attr("dy", "0.35em")
            .style("font-size", "10px") 
            .text(function(d) { return d; });

        
        
        svg.append("text")
            .attr("x", width/2)
            .attr("y", -3)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text("Count of MLB Players from Around the World");  
    })
})
}
//
var vis2=function(batting_file){
    d3.csv(batting_file).then(data=>{
    var margin = {top: 40, right: 30, bottom: 30, left: 100},
    width = 600 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;
    eligble_hitters = d3.filter(data, d=>(d['OBP']>.340)&&(d['SLG']>.4)&&(d['HR']>30))
    potential_hof = ['Judge', 'Machado', 'Trout']
    var svg = d3.select("#v2_plot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
   
    var x = d3.scaleLinear()
    .range([ 0, width])
    .domain(d3.extent(data, d=>d['SLG']))
    ;

    svg.append("g")
    .attr('class', 'xAxis')
    .call(d3.axisBottom(x))
    .attr("transform", "translate(0," + (height) + ")");

    var y = d3.scaleLinear()
    .range([ height, 0 ])
    .domain(d3.extent(data, d=>d['OBP']))

    svg.append("g")
    .call(d3.axisLeft(y))
    .attr('class', 'yAxis'); 
    
    circles = svg.selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d=>x(d.SLG))
    .attr("cy", d=>y(d['OBP']))
    .attr('r', 3)  
    .style('fill', function(d){
        if(d.Name.includes('Ohtani')){
            return 'red'
        }
    })
    
    svg.append("text")
        .attr("x", width/2)
        .attr("y", -3)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("On Base Percentage and Slugging");    
    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width/2)
        .attr("y", (height+margin.top-10))
        .text("Slugging")
        .style("font-size", "12px")
    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 0-(margin.left-10))
        .style("font-size", "12px")
        .attr("transform", "rotate(-90)")
        .text("On Base Percentage");
   
    var radio = d3.select('#radio_q2')
    .on("change", function(d){
        y.domain(d3.extent(eligble_hitters, d=>d.SLG))
        x.domain(d3.extent(eligble_hitters, d=>d.OBP))
        svg.selectAll("g.xAxis")
            .transition()
            .call(d3.axisBottom(x)).duration(100)
        svg.selectAll("g.yAxis")
            .transition()
            .call(d3.axisLeft(y)).duration(100)
        svg.selectAll("dot").transition()
        circles.data(eligble_hitters).transition()
            .duration(100)
            .attr("cx", d=>x(d.SLG))
            .attr("cy", d=>y(d.OBP))
            
    })
})
vis3=function(filePath){
    d3.csv(filePath, d3.autoType).then(function(data){
        
        var margin = {top: 40, right: 30, bottom: 30, left: 100},
        width = 600 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;
        eligble_pitchers = d3.filter(data, d=>(d['ERA+']>170)&&(d['GS']>5))
        var svg = d3.select("#v3_plot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
        var players = [... new Set(d3.map(eligble_pitchers, d=>d.Name))].sort()

        var x = d3.scaleBand()
				.domain(players)
				.rangeRound([0,width])
				.paddingInner(0.1);
        svg.append("g")
                .attr('class', 'xAxis')
                .call(d3.axisBottom(x))
                .attr("transform", "translate(0," + (height) + ")")
                .selectAll("text")  
                .style("text-anchor", "middle")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-8)")
        
        var y = d3.scaleLinear()
                .domain([0,d3.max(eligble_pitchers, d=>d['ERA+'])])
                .range([height, 0]);

        svg.append("g")
                .call(d3.axisLeft(y))
                .attr('class', 'yAxis');  

        svg.selectAll("rect")
                .data(eligble_pitchers)
                .enter()
                .append("rect")
                .attr("x", function(d) { return x(d.Name); })
                .attr("y", function(d) { return y(d['ERA+']); })
                .attr("height", function(d) { return height-y(d['ERA+']);})
                .attr("width",x.bandwidth())
                .style('fill', function(d){
                    if(d.Name.includes('Ohtani')){
                        return 'red'
                    }
                })
        svg.append("text")
                .attr("x", width/2)
                .attr("y", -3)
                .attr("text-anchor", "middle")
                .style("font-size", "16px")
                .text("ERA+ for Pitchers with at least 5 Starts and atleast 150 Innings Pitched");    
        svg.append("text")
                .attr("class", "x label")
                .attr("text-anchor", "end")
                .attr("x", width/2)
                .attr("y", (height+margin.top-10))
                .text("Starting Pitchers")
                .style("font-size", "12px")
        svg.append("text")
                .attr("class", "y label")
                .attr("text-anchor", "end")
                .attr("y", 0-(margin.left-10))
                .style("font-size", "12px")
                .attr("transform", "rotate(-90)")
                .text("ERA+");
    })
    vis4=function(filePath){
        d3.csv(filePath, d3.autoType).then(function(data){
            var margin = {top: 40, right: 30, bottom: 50, left: 50},
            width = 600 - margin.left - margin.right,
            height = 450 - margin.top - margin.bottom;
            var svg = d3.select("#v4_plot")
            .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");
          
        var angels = d3.filter(data, d=>d.Tm == 'LAA')
        var players = d3.map(angels, d=> d.Name)
        
        var x = d3.scaleBand()
				.domain(players)
				.rangeRound([0,width])
				.paddingInner(0.1);

        svg.append("g")
                .attr('class', 'xAxis')
                .call(d3.axisBottom(x))
                .attr("transform", "translate(0," + (height) + ")")
                .selectAll("text")  
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-8)")
              
        
        var y = d3.scaleLinear()
                .domain([0,(d3.max(angels, d=>d.FIP)+d3.max(angels, d=>d.WHIP))])
                .range([height, 0]);

        svg.append("g")
                .call(d3.axisLeft(y))
                .attr('class', 'yAxis');  
        let keys = ['FIP', 'WHIP']
        var stacked  = d3.stack().keys(keys)(angels);
        let colors = d3.scaleOrdinal().domain(keys).range(['blue','red'])
        var rects = svg.append('g').selectAll('g')
			.data(stacked)
			.enter().append("g")
            .attr('fill', function(d){return colors(d.key)})
            .selectAll('rect')
            .data(function(d) { return d; })
            .enter().append("rect")
			.attr("x", function(d) { return x(d.data.Name); })
			.attr("y", function(d) { return y(d[1]); })
			.attr("height", function(d) { return y(d[0]) - y(d[1]);})
        	.attr("width",x.bandwidth());
        svg.append("text")
            .attr("x", width/2)
            .attr("y", 10)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text("FIP and WHIP of Angels Starting Pitchers"); 
        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width/2)
            .attr("y", height+margin.bottom/2)
            .text("Starting Pitchers")
            .style("font-size", "12px")
        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "middle")
            .attr("y", 0-margin.left/2)
            .style("font-size", "12px")
            .attr("transform", "rotate(-90)")
            .text("WHIP+FIP");
        var sscale = svg.append("g")
            .attr("class", "scale")
            .attr("transform", "translate(20,20)");
        
        var scalesize = 10;
        var scalespacing = 5;
        var sdata = ['FIP', 'WHIP'];
        var labels = ["Fielding Independent Pitching", "Walks plus Hits per Innings Pitched"];

        sscale.selectAll(".legend-item")
            .data(sdata)
            .enter()
            .append("circle")
            .attr("class", "legend-item")
            .attr("cx", scalesize)
            .attr("cy", function(d, i) { return i * (scalesize + scalespacing); })
            .attr("r", function(d) { return 5; })
            .attr("fill", d=>colors(d))
            .attr("stroke", "black")
            .attr("stroke-width", "2");

        sscale.selectAll(".legend-label")
            .data(labels)
            .enter()
            .append("text")
            .attr("class", "legend-label")
            .attr("x", scalesize+10)
            .attr("y", function(d, i) { return i * (scalesize + scalespacing); })
            .attr("dy", "0.35em")
            .style("font-size", "10px") 
            .text(function(d) { return d; });

        })
        
    }
    vis5=function(filePath){
        d3.csv(filePath, d3.autoType).then(function(data){
            var margin = {top: 40, right: 30, bottom: 50, left: 50},
            width = 600 - margin.left - margin.right,
            height = 450 - margin.top - margin.bottom;
            var svg = d3.select("#v5_plot")
            .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");
            groupedData = Array.from(d3.group(data, d => d.Lg)).map(([key, values]) => {
                const sortedValues = values.map(d => parseFloat(d['OPS+'])).sort(d3.ascending);
                const q1 = d3.quantile(sortedValues, 0.25);
                const median = d3.quantile(sortedValues, 0.5);
                const q3 = d3.quantile(sortedValues, 0.75);
                const interQuantileRange = q3 - q1;
                const min = q1 - 1.5 * interQuantileRange;
                const max = q3 + 1.5 * interQuantileRange;

                return {
                    Lg: key,
                    q1,
                    median,
                    q3,
                    interQuantileRange,
                    min,
                    max,
                    sortedValues
                };
                
            });
            var leagues = [... new Set(d3.map(data, d=>d.Lg))].sort()
            var x = d3.scaleBand()
            .range([ 0, width ])
            .domain(leagues)
            .paddingInner(1)
            .paddingOuter(.5)
            svg.append("g")
                .attr('class', 'xAxis')
                .call(d3.axisBottom(x))
                .attr("transform", "translate(0," + (height) + ")")
                .selectAll("text")  
                .style("text-anchor", "middle")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
            var y = d3.scaleLinear()
                .domain(d3.extent(data, d=>d['OPS+']))
                .range([height, 0])
            svg.append("g").call(d3.axisLeft(y))
            svg
            .selectAll("vertLines")
            .data(groupedData)
            .enter()
            .append("line")
            .attr("x1", function(d){return(x(d.Lg))})
            .attr("x2", function(d){return(x(d.Lg))})
            .attr("y1", function(d){return(y(d.min))})
            .attr("y2", function(d){return(y(d.max))})
            .attr("stroke", "black")
            .style("width", 40)
            var boxWidth = 100
            svg
            .selectAll("boxes")
            .data(groupedData)
            .enter()
            .append("rect")
                .attr("x", function(d){return(x(d.Lg)-boxWidth/2)})
                .attr("y", function(d){return(y(d.q3))})
                .attr("height", function(d){return(y(d.q1)-y(d.q3))})
                .attr("width", boxWidth )
                .attr("stroke", "black")
                .style("fill", "#69b3a2")

            svg
            .selectAll("medianLines")
            .data(groupedData)
            .enter()
            .append("line")
                .attr("x1", function(d){return(x(d.Lg)-boxWidth/2) })
                .attr("x2", function(d){return(x(d.Lg)+boxWidth/2) })
                .attr("y1", function(d){return(y(d.median))})
                .attr("y2", function(d){return(y(d.median))})
                .attr("stroke", "black")
                .style("width", 80)
            svg.append("text")
                .attr("x", width/2)
                .attr("y", -3)
                .attr("text-anchor", "middle")
                .style("font-size", "16px")
                .text("OPS+ for Both Leagues");    
            svg.append("text")
                .attr("class", "x label")
                .attr("text-anchor", "middle")
                .attr("x", width/2)
                .attr("y", (height+margin.top-10))
                .text("Leagues and the MLB")
                .style("font-size", "12px")
            svg.append("text")
                .attr("class", "y label")
                .attr("text-anchor", "end")
                .attr("y", 0-(margin.left-10))
                .style("font-size", "12px")
                .attr("transform", "rotate(-90)")
                .text("OPS+");
        })
}}}
