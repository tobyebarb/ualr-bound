import React, { useContext, useEffect, useState } from "react";
import * as d3 from "d3";
import { Context } from "../../store/appContext";

const PieChart = (props) => {
  const { store, actions } = useContext(Context);
  const { data, outerRadius, innerRadius } = props;
  const [screenWidth, setScreenWidth] = useState(store.window.width);

  const margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50,
  };

  const width = 4 * outerRadius + margin.left + margin.right;
  const height = outerRadius + margin.top + margin.bottom;

  const colorScale = d3
    .scaleSequential()
    .interpolator(d3.interpolateCool)
    .domain([0, data.length]);

  useEffect(() => {
    drawChart();
  }, [data]);

  useEffect(() => {
    setScreenWidth(store.window.width);
    drawChart();
  }, [store.window]);

  function drawChart() {
    // Remove the old svg
    d3.select("#pie-container").select("svg").remove();

    // Create new svg
    const svg = d3
      .select("#pie-container")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const arcGenerator = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    const pieGenerator = d3
      .pie()
      .padAngle(0)
      .value((d) => d.value);

    const tooldiv = d3
      .select("#pie-container")
      .append("div")
      .style("visibility", "hidden")
      .style("position", "absolute")
      .style("background-color", "gray");

    const arc = svg.selectAll().data(pieGenerator(data)).enter();

    // Append arcs
    arc
      .append("path")
      .attr("d", arcGenerator)
      .style("fill", (_, i) => colorScale(i))
      .style("stroke", "#ffffff")
      .style("stroke-width", 0)
      .on("mouseover", (e, d) => {
        tooldiv.style("visibility", "visible").text(`${d.data.value}`);
      })
      .on("mousemove", (e, d) => {
        tooldiv
          .style("top", e.pageY + "px")
          .style(
            "left",
            screenWidth > 2000
              ? e.pageX - width + "px"
              : e.pageX - screenWidth + screenWidth * 0.82 + "px"
          );
      })
      .on("mouseout", () => {
        tooldiv.style("visibility", "hidden");
      });

    // Append text labels
    arc
      .append("text")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .text((d) => d.data.label)
      .style("fill", "white")
      .attr("transform", (d) => {
        const [x, y] = arcGenerator.centroid(d);
        return `translate(${2 * x}, ${y})`;
      });
  }

  return <div id="pie-container" />;
};

export default PieChart;
