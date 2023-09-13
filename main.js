const width = 800;
const height = 400;
const marginTop = 20;
const marginRight = 20;
const marginBottom = 30;
const marginLeft = 40;


// Create the SVG container.
const svg = d3.create("svg")
  .attr("width", width)
  .attr("height", height);

var tooltip = d3
  .select('.visHolder')
  .append('div')
  .attr('id', 'tooltip');

  function onMouseMove(event) {
    // Get mouse coordinates relative to the page
    const x = event.clientX;
    const y = event.clientY;
    const dataDate = event.target.getAttribute('data-date');
    const dataGDP = event.target.getAttribute('data-gdp');
  
    // Use the x and y coordinates to position the tooltip
    tooltip.style('left', x-170+"px") // Adjust the offset as needed
           .style('top', y-10+"px") // Adjust the offset as needed
           .style('opacity', 1)
           .attr('data-date', dataDate)
           .html(`Date: ${dataDate}<br>GDP: $${dataGDP} Billion`);
  }
      
// Function to hide the tooltip on mouseout
function onMouseOut() {
    tooltip.style('opacity', 0);
}

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
  .then(data => {
    const minX = d3.min(data, d => d.Year);
    const maxX = d3.max(data, d => d.Year);
    const minY = d3.min(data, d => d.Seconds);
    const maxY = d3.max(data, d => d.Seconds);
    console.log(minX, maxX, minY, maxY);

    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -200)
      .attr('y', 80)
      .text('Time in Minutes');

    // Declare the x (horizontal position) scale.
    const x = d3.scaleLinear()
        .domain([minX, maxX])
        .range([marginLeft, width - marginRight]);

        // Declare the y (vertical position) scale.
    const y = d3.scaleLinear()
        .domain([minY, maxY])
        .range([height - marginBottom, marginTop]);

    // Add the x-axis.
    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .attr("id", "x-axis")
        .call(d3.axisBottom(x));

    // Add the y-axis.
    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .attr("id", "y-axis")
        .call(d3.axisLeft(y)
    .tickFormat(d => {
      const minutes = Math.floor(d / 60);
      const seconds = d % 60;
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      })
    );
    
    // Append the SVG element.
    container.append(svg.node());
  })
  .catch(error => {
    console.error("Error fetching data:", error);
});

