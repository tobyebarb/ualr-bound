import React, { useState, useEffect } from "react";
import * as d3 from "d3";
import { AxisBottom } from "../components/LineChart/AxisBottom";
import { AxisLeft } from "../components/LineChart/AxisLeft";
import { Marks } from "../components/LineChart/Marks";

const TestAnalytics = () => {
  
  const width = 960;
  const height = 500;
  const margin = { top: 20, right: 20, bottom: 65, left: 220 }
  const xAxisLabelOffset = 50;

  let data = [
    {
      color: "blue",
      favorite: 251
    },
    {
      color: "green",
      favorite: 175
    }

  ]

  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.left - margin.right;

  const siFormat = d3.format('.2s')
  const xAxisTickFormat = tickValue => siFormat(tickValue).replace('G', 'B')

  const xValue = d => d.color;
  const yValue = d => d.favorite;

  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, xValue))
    .range([0, innerWidth])

  const yScale = d3.scaleLinear()
    .domain(d3.extent(data, yValue))
    .range([0, innerHeight])


  return (
    <svg width={width} height={height}>
      <g transform={'translate(${margin.left},${margin.top})'}>
        <AxisBottom
          xScale={xScale}
          innerHeight={innerHeight}
          tickFormat={xAxisTickFormat}
        />
        <AxisLeft
          yScale={yScale}
        />
        <text
          className="axis-label"
          x={innerWidth / 2}
          y={innerHeight + xAxisLabelOffset}
          textAnchor="middle"
        >
          Iris
        </text>
        <Marks
          data={data}
          xScale={xScale}
          yScale={yScale}
          xValue={xValue}
          yValue={yValue}
        />
      </g>
    </svg>
  );

};

export default TestAnalytics