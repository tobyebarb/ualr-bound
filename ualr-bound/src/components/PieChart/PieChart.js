import React, { useEffect } from 'react';
import * as d3 from 'd3';

const PieChart = (props) => {
  const {
    data,
    outerRadius,
    innerRadius,
  } = props;

  const margin = {
    top: 50, right: 50, bottom: 50, left: 50,
  };

  const width = 2 * outerRadius + margin.left + margin.right;
  const height = 2 * outerRadius + margin.top + margin.bottom;

  const colorScale = d3     
    .scaleSequential()      
    .interpolator(d3.interpolateCool)      
    .domain([0, data.length]);

  useEffect(() => {
    drawChart();
  }, [data]);

  function drawChart() {
    // Remove the old svg
    d3.select('#pie-container')
      .select('svg')
      .remove();

    // Create new svg
    const svg = d3
      .select('#pie-container')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const arcGenerator = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    const pieGenerator = d3
      .pie()
      .padAngle(0)
      .value((d) => d.value);

    const tooldiv = d3.select("#pie-container")
      .append("div")
      .style("visibility", "hidden")
      .style("position", "absolute")
      .style("background-color", "gray")


    const arc = svg
      .selectAll()
      .data(pieGenerator(data))
      .enter();

    // Append arcs
    arc
      .append('path')
      .attr('d', arcGenerator)
      .style('fill', (_, i) => colorScale(i))
      .style('stroke', '#ffffff')
      .style('stroke-width', 0)
      .on("mouseover", (e,d) => {
          console.log(e)
          console.log(d)
          tooldiv.style("visibility", "visible")
            .text(`${d.data.value}`)
      })
      .on("mousemove", (e,d) =>{
          tooldiv.style("top", ((e.pageY-50) + "px"))
            .style("left", ((e.pageX-150) + "px"))
      })
      .on("mouseout", () => {
          tooldiv.style("visibility", "hidden")
      });

    // Append text labels
    arc
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .text((d) => d.data.label)
      .style('fill', "white")
      .attr('transform', (d) => {
        const [x, y] = arcGenerator.centroid(d);
        return `translate(${x}, ${y})`;
      });
  }    

  return <div id="pie-container" />;
}

export default PieChart;