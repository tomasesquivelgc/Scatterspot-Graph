const width = 800;
const height = 400;
const marginTop = 20;
const marginRight = 20;
const marginBottom = 30;
const marginLeft = 60;

// Create the SVG container.
const svg = d3.create("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("margin-top", marginTop)
  .attr("margin-right", marginRight)
  .attr("margin-bottom", marginBottom)
  .attr("margin-left", marginLeft);


var tooltip = d3
  .select('.visHolder')
  .append('div')
  .attr('id', 'tooltip');

function onMouseMove(event) {
  // Get mouse coordinates relative to the page
  const x = event.clientX;
  const y = event.clientY;
  const dataDate = event.target.getAttribute('data-date');
  const dataTime = new Date(event.target.getAttribute('data-time'));
  const dataTimeMinutes = dataTime.getMinutes();
  const dataTimeSeconds = dataTime.getSeconds();
  const dataName = event.target.getAttribute('name');
  const dataOrigin = event.target.getAttribute('origin');
  const dataDoping = event.target.getAttribute('data-doping');
  const dopingInfo = dataDoping !== "" ? `<br>${dataDoping}` : "";

  // Use the x and y coordinates to position the tooltip
  tooltip.style('left', x - 150 + "px") // Adjust the offset as needed
    .style('top', y + "px") // Adjust the offset as needed
    .style('opacity', 1)
    .attr('data-year', dataDate)
    .html(`${dataName}: ${dataOrigin}<br>Year: ${dataDate}<br>Time: ${dataTimeMinutes}:${dataTimeSeconds < 10 ? '0' : ''}${dataTimeSeconds}<br>${dopingInfo}`);
}

// Function to hide the tooltip on mouseout
function onMouseOut() {
  tooltip.style('opacity', 0);
}

// Convert seconds to milliseconds for Date object creation
function secondsToMilliseconds(seconds) {
  return seconds * 1000;
}

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
  .then(data => {
    const minX = d3.min(data, d => d.Year);
    const maxX = d3.max(data, d => d.Year);
    const minY = d3.min(data, d => secondsToMilliseconds(d.Seconds)); // Convert seconds to milliseconds
    const maxY = d3.max(data, d => secondsToMilliseconds(d.Seconds)); // Convert seconds to milliseconds

    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -200)
      .attr('y', 10)
      .text('Time in Minutes');

    // Declare the x (horizontal position) scale as a time scale.
    const x = d3.scaleTime()
      .domain([new Date(minX - 1, 1, 1), new Date(maxX + 1, 1, 1)]) // Specify the domain as dates
      .range([marginLeft, width - marginRight]);

    // Declare the y (vertical position) scale.
    const y = d3.scaleTime() // Use scaleTime for Date objects
      .domain([minY - 10000, maxY]) // Adjust the domain as needed
      .range([height - marginBottom, marginTop]);

    // Add the x-axis.
    svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .attr("id", "x-axis")
      .call(d3.axisBottom(x).ticks(d3.timeYear.every(2))); // Display year ticks

    // Add the y-axis.
    svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .attr("id", "y-axis")
      .call(d3.axisLeft(y)
        .tickFormat(d3.timeFormat("%M:%S")) // Format ticks as "MM:SS"
      );

    // Add the data points.
    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("name", d => d.Name)
      .attr("origin", d => d.Nationality)
      .attr("data-doping", d => d.Doping)
      .attr("data-xvalue", d => d.Year)
      .attr("data-yvalue", d => new Date(secondsToMilliseconds(d.Seconds))) // Convert seconds to Date object
      .attr("data-date", d => d.Year)
      .attr("data-time", d => new Date(secondsToMilliseconds(d.Seconds))) // Convert seconds to Date object
      .attr("cx", d => x(new Date(d.Year, 1, 1))) // Convert year to a Date object
      .attr("cy", d => y(new Date(secondsToMilliseconds(d.Seconds)))) // Convert seconds to Date object
      .attr("r", 6)
      .attr("fill", d => d.Doping ? "red" : "green")
      .on('mousemove', onMouseMove)
      .on('mouseout', onMouseOut);

    // Add the legend.
    const legend = svg.append("g")
      .attr("id", "legend");

    legend.append("rect")
      .attr("x", width - 220)
      .attr("y", height - 100)
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", "red");

    legend.append("rect")
      .attr("x", width - 220)
      .attr("y", height - 70)
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", "green");

    legend.append("text")
      .attr("x", width - 200)
      .attr("y", height - 85)
      .text("Riders with doping allegations");

    legend.append("text")
      .attr("x", width - 200)
      .attr("y", height - 55)
      .text("No doping allegations");
    
    // Append the SVG element.
    container.append(svg.node());
  })
  .catch(error => {
    console.error("Error fetching data:", error);
  });
