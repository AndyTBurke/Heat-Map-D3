import * as d3 from "https://cdn.skypack.dev/d3@7.6.1";

fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
  .then(res => res.json())
  .then(data => renderChart(data))

function handleMouseOver(event) {
  const date = new Date(event.target.dataset.year, event.target.dataset.month)
  const temp = event.target.dataset.temp
  
  document.getElementById("tooltip").style.visibility = "visible"
  document.getElementById("tooltip").setAttribute("data-year", event.target.dataset.year)
  document.getElementById("tooltip").style.top = `${event.pageY - 120}px`
  document.getElementById("tooltip").style.left = `${event.pageX + 20}px`
  document.getElementById("tooltip").innerHTML = `<h2>${date.toLocaleString(undefined, {year: 'numeric', month: 'long'})}</h2><h3>${Math.round(temp*100)/100}°C</h3>`
}

function handleMouseOut() {
  document.getElementById("tooltip").style.visibility = "hidden"
}

function getRectColor(temp) {
  return temp < 3.5 ? "#053061" :
          temp < 4.5 ? "#2166ac" : 
          temp < 5.5 ? "#4393c3" :
          temp < 6.5 ? "#92c5de" :
          temp < 7.5 ? "#d1e5f0" :
          temp < 8.5 ? "#f7f7f7" :
          temp < 9.5 ? "#fddbc7" :
          temp < 10.5 ? "#f4a582" :
          temp < 11.5 ? "#d6604d" :
          temp < 12.5 ? "#b2182b" : "#67001f"
  
}
        
function renderChart(data) {
  const svgHeight = 500
  const svgWidth = 1500
  const padding = 50
  
  const minX = new Date(d3.min(data.monthlyVariance.map(item => item.year)), 0)
  const maxX = new Date(d3.max(data.monthlyVariance.map(item => item.year)), 0)
  const minY = 0
  const maxY = 11
  
  const xScale = d3.scaleTime()
                   .domain([minX, maxX])
                   .range([padding, svgWidth - padding])
  const yScale = d3.scaleLinear()
                   .domain([maxY, minY])
                   .range([svgHeight - padding, padding])
  const xAxis = d3.axisBottom(xScale)
  const yAxis = d3.axisLeft(yScale)
                  .tickValues([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
                  .tickFormat((d, i) => ['January', 'February', 'March', 'April', 'May', 
                                         'June', 'July', 'August', 'September', 'October',
                                         'November', 'December'][i]); 
  
  const baseTemperature = data.baseTemperature
  
  const svg = d3.select("#graph-node")
                .append("svg")
                .attr("width", svgWidth)
                .attr("height", svgHeight)
  
  svg.selectAll("rect")
     .data(data.monthlyVariance)
     .enter()
     .append("rect")
     .attr("x", d => xScale(new Date(d.year, 0)))
     .attr("y", d => yScale(d.month - 1) - 35/2)
     .attr("height", 35)
     .attr("width", 5)
     .attr("class", "cell")
     .attr("data-month", d => d.month - 1)
     .attr("data-year", d => d.year)
     .attr("data-temp", d => d.variance + baseTemperature)
     .attr("fill", d => getRectColor(d.variance + baseTemperature))
     .on("mouseover", (e) => handleMouseOver(e))
     .on("mouseout", (e) => handleMouseOut())
  
  svg.append("g")
    .attr("transform", `translate(2.5, ${svgHeight - padding + 35/2})`)
    .attr("id", "x-axis")
    .call(xAxis)
  
  svg.append("g")
    .attr("transform", `translate(${padding}, 0)`)
    .attr("id", "y-axis")
    .style("font-size", "8.5")
    .call(yAxis)
  
  renderLegend()
}

function renderLegend() {
    
    const colorUnits = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  
    const svgHeight = 70
    const svgWidth = 350
    const padding = 10
    const xScale = d3.scaleLinear()
                   .domain([2.5, 13.5])
                   .range([padding, svgWidth - padding - 20])
    const xAxis = d3.axisBottom(xScale)
                    .tickFormat(d => `${d}°C`)
  
    const svg = d3.select("#legend")
                .append("svg")
                .attr("width", svgWidth)
                .attr("height", svgHeight)
    
     svg.selectAll("rect")
        .data(colorUnits)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d))
        .attr("width", 25)
        .attr("height", 40)
        .attr("fill", d => getRectColor(d - .1))
  
    svg.append("g")
      .attr("transform", `translate(12.5, ${svgHeight - padding - 10})`)
      .call(xAxis)
}