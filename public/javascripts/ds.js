
var data = new Map();
var curData = [];
console.log('Start');
var svg = d3.select('#chart').append('svg')
    .attr('viewBox','0 0 800 400')
    .attr('preserveAspectRatio','xMidYMid')
    .classed('svgtype',true);




var xScale = d3.scaleLog()
    .domain( [10,10000])
    .range([0,800]);

var yScale = d3.scaleLinear()
    .domain( [0,100])
    .range([0,400]);

var xAxis = d3.axisBottom()
    .scale(xScale);
    //.ticks(12, d3.format(",d"));
var yAxis = d3.axisLeft()
    .scale(yScale);
    //.ticks(12, d3.format(",d"));

svg.append('g').call(xAxis);
svg.append('g').call(yAxis);


function getDataYear(year, data1, data2){
    let dataArray= [];
    let countryArray = [];
    for ( let [k, v] of data ){
            countryArray = [];
            countryArray.push(k);
            let dat1=v[5].get(data1)[year];
            let dat2=v[5].get(data2)[year];
            if ( dat1 == "" ) {
                dat1=0;
            }
            if ( dat2 == "" ) {
                dat2=0;
            }
            countryArray.push(dat1);
            countryArray.push(dat2);
            dataArray.push(countryArray);
    }
    return dataArray;
}

d3.json ("./data/wditablearray.json").then(function(d) {
   let codeMap;
   let country;
    for (let i=0; i <d.length; i++ ){
        let elem = d[i];
        //console.log("Processing "+ elem.CCode + ' '+ elem.SCode)
        if (!data.has(elem.CCode)) {
            codeMap = new Map();
            country = [];
            codeMap.set(elem.SCode,elem.Years);
            country[0]=elem.CCode;
            country[1]=elem.CName;
            country[2]=elem.IGroup;
            country[3]=elem.Region;
            country[4]=elem.SName;
            country[5]=codeMap;
            data.set(elem.CCode,country);
        }
        else{
             codeMap = new Map();
             codeMap = data.get(elem.CCode)[5];
             if (!codeMap.has(elem.SCode)) {
                 codeMap.set(elem.SCode,elem.Years);
                 data.get(elem.CCode)[5]=codeMap;
             }
             else{
                 console.log("Error Duplicate data "+ elem.CCode + ' '+ elem.SCode)
             }
        }
    }
    console.log(data);
    curData = getDataYear(0,'SH.XPD.CHEX.PC.CD','SP.DYN.LE00.IN');
    console.log(curData);
    svg.selectAll('circle')
        .data(curData)
        .enter()
        .append('circle')
        .attr('cx', function(d){
            return xScale(d[1]);
        })
        .attr('cy', function(d){
            return yScale(d[2]);
        })
        .attr('r',10);


    curData = getDataYear(15,'SH.XPD.CHEX.PC.CD','SP.DYN.LE00.IN');

    svg.selectAll('circle')
        .data(curData)
        .transition()
        .delay(function(d){
            return d[0]=='USA' ? 2000 : 0;
        })
        .duration(1000)
        .attr('cx', function(d){
            return xScale(d[1]);
        })
        .attr('cy', function(d){
            return yScale(d[2]);
        })
        .attr('r',10);
});