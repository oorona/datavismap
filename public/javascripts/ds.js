
var data = new Map();
var curData = [];
var initYear =2000;
var selectCountries = new Map();
const lifeExpCode='SP.DYN.LE00.IN';
const healthExpCode='SH.XPD.CHEX.PC.CD';
const outPocketCode='SH.XPD.OOPC.PC.CD';
const infantCode='SP.DYN.IMRT.IN';
const neonatalCode='SH.DYN.NMRT';
const countryColor=0;
const incomeColor=1;
const regionColor=2;
const selectedSize=12;
const regularSize=7



var curColor = incomeColor;
var initSetY = lifeExpCode;
var initSetX = healthExpCode;



var curYear;
var startYear=initYear;
var curSetY;
var curSetX;
var curLabelX;
var curLabelY;
var initDraw =true;
var duration;

var xScale;
var yScale;
var xAxis;
var yAxis
const xPosArray=5;
const yPosArray=6;
const yearsPos=5;
const excludeFlagPos=4;


const svgWidth =800;
const svgHeight =400;
const svgMessWidth=200;
const svgMessHeight=50;
const svgLegWidth=200;
const svgLegHeight=150

const paddingLeft =40;
const paddingRight =15;
const paddingTop =10;
const paddingBottom =30;

const durationSet=5000;
const durationYear=200;
const durationSelect=300;
const legHeight = 20;
const legSpace =5;


var countryList=[];

var countryColorScale = d3.scaleOrdinal(d3.schemeCategory10);

var incomeColorScale = d3.scaleOrdinal()
    .domain(["Low income","Lower middle income","Upper middle income","High income","Selected"])
    .range(["#f0f9e8","#bae4bc","#7bccc4","#2b8cbe","#e41a1c"]);

var regionColorScale = d3.scaleOrdinal()
    .domain(["East Asia & Pacific","Europe & Central Asia","Latin America & Caribbean","Middle East & North Africa","North America","South Asia","Sub-Saharan Africa",'Selected'])
    .range(["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854" ,"#ffd92f" ,"#e5c494","#e41a1c"])


var colorScales =[];

colorScales[countryColor]=countryColorScale;
colorScales[incomeColor]=incomeColorScale;
colorScales[regionColor]=regionColorScale;

var colorScale=colorScales[1];

var scales = new Map();

scale = d3.scaleLog()
    .domain( [3, 10000])
    .range([paddingLeft, svgWidth-paddingRight]);

scales.set(healthExpCode,scale);

scale = d3.scaleLinear()
    .domain( [35,90])
    .range([svgHeight-paddingBottom, paddingTop ]);
scales.set(lifeExpCode,scale);

scale = d3.scaleLog()
    .domain( [1,2500])
    .range([svgHeight-paddingBottom, paddingTop ]);
scales.set(outPocketCode,scale);

scale = d3.scaleLinear()
    .domain( [0,60])
    .range([svgHeight-paddingBottom, paddingTop ]);
scales.set(neonatalCode,scale);

scale = d3.scaleLinear()
    .domain( [0,150])
    .range([svgHeight-paddingBottom, paddingTop ]);
scales.set(infantCode,scale);

console.log('Start');



var svg = d3.select('#svgchart').append('svg')
    .attr('viewBox','0 0 '+svgWidth+' '+ svgHeight)
    .attr('preserveAspectRatio','xMidYMid');
    //.classed('svgchart',true);

var control = d3.select('#controls');

var svgmessage = control.select("#messages")
    .append('svg')
    .attr('viewBox','0 0 '+svgMessWidth+' '+ svgMessHeight)
    .attr('preserveAspectRatio','xMidYMid')
    .classed('svgtype',true);

var label=svgmessage.append("text")
    .attr("class", "message")
    .attr("text-anchor", "end")
    .attr('fill','black')
    .attr("x", svgMessWidth)
    .attr("y", 50);

var slider=d3.select("#yearSlider")

var svglegend = control.select("#legend")
    .append('svg')
    .attr('viewBox','0 0 '+svgLegWidth+' '+ legHeight*colorScale.domain().length)
    .attr('preserveAspectRatio','xMidYMid')
    .classed('svgtype',true);


var legend=svglegend
    .selectAll("g")
    .data(colorScale.domain())
    .enter()
    .append('g')
    .filter(function(d) {
        return d !=='Selected'
    })
    .attr('class', 'legend')
    .attr('transform', function(d, i) {
        let x = 0;
        let y = i * legHeight ;
        return 'translate(' + x + ',' + y + ')';
    });

legend.append('rect')
    .attr('width', legHeight)
    .attr('height', legHeight)
    .style('fill', colorScale)
    .style('stroke', colorScale);

legend.append('text')
    .attr('x', legHeight + legSpace)
    .attr('y', legHeight - legSpace)
    .text(function(d) {
        return d;
    });


var countries = control.select("#countryList");
    //.append('select')
    //.attr('id','countrySelect');


function createCountryList(){
    for ( let [k, v] of data ) {
        if (v[excludeFlagPos]) {
            countryList.push([k, v[1]]);
        }
    }
    d3.select('#countrySelect')
        .selectAll('option')
        .data(countryList)
        .enter()
        .append('option')
        .attr('value',function (d){
            return d[0];
        })
        .text(function (d){
            return d[1];
        });

    countries.on("change",function(d){
        console.log(d);
    });

}
function updateLegend(legendId){
    console.log("Update Legend");
    curColor=legendId;
    colorScale=colorScales[curColor];
    svglegend.selectAll("g").remove();
    control.select('#legend').select('svg').remove();

    svglegend = control.select("#legend")
        .append('svg')
        .attr('viewBox','0 0 '+svgLegWidth+' '+ legHeight*colorScale.domain().length)
        .attr('preserveAspectRatio','xMidYMid')

    legend=svglegend
        .selectAll("g")
        .data(colorScale.domain())
        .enter()
        .append('g')
        .filter(function(d) {
            return d !=='Selected'
        })
        .attr('class', 'legend')
        .attr('transform', function(d, i) {
            let x = 0;
            let y = i * legHeight ;
            return 'translate(' + x + ',' + y + ')';
        });

    legend.append('rect')
        .attr('width', legHeight)
        .attr('height', legHeight)
        .style('fill', colorScale)
        .style('stroke', colorScale);

    legend.append('text')
        .attr('x', legHeight + legSpace)
        .attr('y', legHeight - legSpace)
        .text(function(d) {
            return d;
        });
    startYear=curYear;
    drawData(curYear,curSetX,curSetY);
}

function updateXAxis(dataSetX){
    xScale = scales.get(dataSetX);
    xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(12, d3.format(",d"));

    svg.select('#xscale').remove();
    svg.select('#xlabel').remove();


    svg.append('g')
        .attr('id','xscale')
        .attr('class','xaxis')
        .attr("transform", "translate(0,"+(svgHeight-paddingBottom)+")")
        .call(xAxis);
    console.log("X Axis recreated");
    curLabelX=data.values().next().value[yearsPos].get(dataSetX)[1];

    // Add an x-axis label.
    svg.append("text")
        .attr("id", "xlabel")
        .attr("class","xaxis")
        .attr("text-anchor", "end")
        .attr("x", svgWidth-paddingRight)
        .attr("y", svgHeight )
        .text(curLabelX);
}

function updateYAxis(dataSetY){

    yScale = scales.get(dataSetY);
    yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(12, d3.format(",d"));

    svg.select('#yscale').remove();
    svg.select('#ylabel').remove();


    console.log('remove Axis Y');

    svg.append('g').call(yAxis)
        .attr('id','yscale')
        .attr('class','yaxis')
        .attr("transform", "translate("+paddingLeft+",0)");

    curLabelY=data.values().next().value[yearsPos].get(dataSetY)[1];

    // Add a y-axis label.
    svg.append("text")
        .attr("id", "ylabel")
        .attr("class","yaxis")
        .attr("text-anchor", "end")
        .attr("x", -paddingTop)
        .attr("y", 2)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text(curLabelY);
    console.log("Y Axis recreated");
}

function getData(year, dataSetX, dataSetY){
    let dataArray= [];
    let countryArray;
    for ( let [k, v] of data ){
        if(v[excludeFlagPos]) {
            countryArray = [];
            countryArray.push(k);
            countryArray.push(v[1]);
            countryArray.push(v[2]);
            countryArray.push(v[3]);
            countryArray.push(year);
            let datX=v[yearsPos].get(dataSetX)[0][year%2000];
            let datY=v[yearsPos].get(dataSetY)[0][year%2000];
            countryArray.push(datX);
            countryArray.push(datY);
            dataArray.push(countryArray)
        }
    }
    return dataArray;
}

function colorDef(d) {
    let colorD;

    //console.log(d[2]+ d[3]);
    if (curColor == countryColor) {
        colorD = d[0];

    }
    else if( curColor == incomeColor) {
        colorD = d[2];
        //colorD='Selected'
    }
    else if (curColor == regionColor) {
        colorD = d[3];
    }
    //console.log("after switch "+curColor);

    //colorD='Selected';
    if (selectCountries.has(d[0])){
        //console.log(d);
        console.log(d[0]+ "->>>>>>>>>>>>>>>>>>>>>>>>>>> Selected");
        colorD='Selected';
    }
    //console.log(colorD)
    return colorD;

}

function selectCountry( countryCode){
    console.log("selecting "+countryCode);
    selectCountries.set(countryCode,true);
    startYear=curYear;
    drawData(curYear,curSetX,curSetY);
}
function unSelectCountry( countryCode){
    selectCountries.delete(countryCode);
}

function clearCountySelection(){
    selectCountries = new Map();
    startYear=curYear;
    drawData(curYear,curSetX,curSetY);

}

function transitionData(dataSetX,dataSetY){
    drawData(2000,dataSetX,dataSetY,durationSet);
}

function updateYearLabel(year){
    label.text(year);
   // console.log(slider);
    slider.attr('value',year);

}

function drawData(year,dataSetX,dataSetY, customDur= 0){
    if ( year !== curYear || dataSetX !== curSetX || dataSetY !== curSetY ) {

        console.log("diferent values");
        curData = getData(year, dataSetX, dataSetY);
        //console.log(curData);
        if ( year !== curYear ) {
            duration = durationYear * Math.abs(curYear - year);
            //console.log(control);
            //label.text(year);
            updateYearLabel(year);
        }
        if (dataSetX !== curSetX) {
            updateXAxis(dataSetX);
            console.log("X Axis updated");
           // duration=durationSet;
        }
        if (dataSetY !== curSetY) {
            updateYAxis(dataSetY);
            console.log("Y Axis updated");
            //duration=durationSet;
        }
        if (customDur !== 0){
            duration=customDur;
        }
        startYear=curYear;
        curYear = year;
        curSetX = dataSetX;
        curSetY = dataSetY;
    }

    console.log(colorScale.domain());
    if (initDraw) {
        console.log("First Draw");
        var countries = svg.append("g")
            .attr("class", "countries")
            .selectAll(".country")
            .data(curData)
            .enter()
            .append("circle")
            .attr("class", "country")
            .attr('cx', function(d){
                return xScale(d[xPosArray]);
            })
            .attr('cy', function(d){
                return yScale(d[yPosArray]);
            })
            .attr('r',function(d){
                return selectCountries.has(d[0])? selectedSize:regularSize;
            })
            .attr('id',function(d){
                return d[0];
            })
            .style("stroke", function(d){
                return colorScale(colorDef(d));
            })
            .on("mouseover", function(d) {
                d3.select(this).attr('r',selectedSize)
                    .transition()
                    .duration(durationSelect);
                x =parseFloat(d3.select(this).attr('cx'));
                y =parseFloat(d3.select(this).attr('cy'));
                console.log(x,y);
                d3.select('#tooltip')
                    .style('left',x+"px")
                    .style('top',y+"px")
                    .style('display','block')
                    .text(d[1]);
            })
            .on("mouseout", function(d) {
                if (!selectCountries.has(d[0])) {
                d3.select(this).attr('r', regularSize)
                    .transition()
                    .duration(durationSelect);
                }
                d3.select( '#tooltip' )
                    .style( 'display', 'none' )

            })
            ;



        /*countries.append("title")
            .text(function(d) {
                return d[1];
            });*/

        svg.append('g')
            .attr("class","countryLabels")
            .selectAll('#countryLabels')
            .data(curData)
            .enter()
            .append('text')
            .text (function (d){
                if ( selectCountries.has(d[0]) ){
                    return d[0];
                }
            })
            .attr('x', function(d){
                return xScale(d[xPosArray]);
            })
            .attr('y', function(d){
                return yScale(d[yPosArray]);
            })
            .attr('class',"countryLabel");
        initDraw=false;
    }
    else {
        console.log('Updating Graph');

        let t =d3.transition()
            .duration(duration)
            .tween("year", function (d){
                //   console.log(d);
                var inter =d3.interpolateRound(startYear,year);
                return function(t){
                    updateYearLabel(inter(t));
                }
            });

        svg.selectAll('circle')
            .data(curData)
            .transition(t)
            .attr('cx', function(d){
                return xScale(d[xPosArray]);
            })
            .attr('cy', function(d){
                return yScale(d[yPosArray]);
            })
            .attr('r',function(d){
                return selectCountries.has(d[0])? selectedSize:regularSize;
            })
            .style("stroke", function(d){
                return colorScale(colorDef(d));
            })
            .style("fill", function(d){
            //return '#e41a1c';
            return selectCountries.has(d[0])? '#e41a1c':'none';
            });

        svg.selectAll('.countryLabel')
            .data(curData)
            .transition(t)
            .attr('x', function(d){
                return xScale(d[xPosArray]);
            })
            .attr('y', function(d){
                return yScale(d[yPosArray]);
            })
            .text (function (d){
                if ( selectCountries.has(d[0]) ){
                    return d[0];
                }
            });

    }

}

function transformData(d){
    let codeMap;
    let country;
    let tArray =[];
    for (let i=0; i <d.length; i++ ){
        let elem = d[i];
        //console.log("Processing "+ elem.CCode + ' '+ elem.SCode)
        codeMap = new Map();
        if (!data.has(elem.CCode)) {
            country = [];
            country[0]=elem.CCode;
            country[1]=elem.CName;
            country[2]=elem.IGroup;
            country[3]=elem.Region;
            codeMap.set(elem.SCode,[elem.Years,elem.SName]);
            tArray = codeMap.get(elem.SCode)[0];
            country[excludeFlagPos]=true;
            for ( let i=0; i<tArray.length;i++ ){
                if (tArray[i] ===""){
                    country[excludeFlagPos]=false;
                    break;
                }
            }
            country[yearsPos]=codeMap;
            data.set(elem.CCode,country);
        }
        else{
            codeMap = data.get(elem.CCode)[yearsPos];
            if (!codeMap.has(elem.SCode)) {
                codeMap.set(elem.SCode,[elem.Years,elem.SName]);
                tArray = codeMap.get(elem.SCode)[0];
                for ( let i=0; i<tArray.length;i++ ){
                    if (tArray[i] ===""){
                        data.get(elem.CCode)[excludeFlagPos]=false;
                        break;
                    }
                }
                data.get(elem.CCode)[yearsPos]=codeMap;
            }
            else{
                console.log("Error Duplicate data "+ elem.CCode + ' '+ elem.SCode)
            }
        }
    }
    //console.log(data);
}

d3.json ("./data/wditablearray.json").then(function(d) {

    transformData(d);
  //  selectCountry('USA');
    drawData(initYear,initSetX,initSetY);
    createCountryList();
    //updateLegend();
    // console.log(curData);
    //console.log(data);
    //console.log(countryList);
   // selectCountry('USA');
    //console.log(curData[160]);
    //selectCountry('MEX');
   //rawData(initYear,initSetX,infantCode);
    //unSelectCountry('MEX');

});