import React, { useState, useEffect, useContext } from "react";
import * as constants from "../../../../../utils/Constants";
import "./LineChart.css";
import * as d3 from "d3";
import { Context } from "../../../../../store/appContext";

const margin = { top: 40, right: 80, bottom: 60, left: 50 };
const width = 960 - margin.left - margin.right;
const height = 280 - margin.top - margin.bottom;
const color = "#000";

const LineChart = () => {
  const { store, actions } = useContext(Context);
  const [activeIndex, setActiveIndex] = useState(null);
  const [date0, setDate0] = useState(null);
  const [date1, setDate1] = useState(null);
  const [data, setData] = useState([]);
  const [dataInit, setDataInit] = useState(false);

  useEffect(() => {
    console.log(data);
    console.log(data.length);
    console.log(dataInit);
  }, [data]);

  useEffect(() => {
    let date = actions.getStoreDate0();
    if (date !== undefined) setDate0(date);
  }, [store.lineChart.date0]);

  useEffect(() => {
    let date = actions.getStoreDate1();
    if (date !== undefined) setDate1(date);
  }, [store.lineChart.date1]);

  useEffect(() => {
    if (date0 !== null && date1 !== null) {
      setDataInit(true);
      d3.csv(
        `${constants.ENDPOINT_URL.LOCAL}/api/getNumberOfCallsMade/${date0}/${date1}`
      ).then((d) => {
        const parseDate = d3.timeParse("%Y%m%d");
        d.forEach((i) => {
          i.date = parseDate(i.date);
          i.data = Number(i.data);
        });
        setData(d);
      });
    }
    return () => undefined;
  }, [date0, date1]);

  const yMinValue = d3.min(data, (d) => d.data),
    yMaxValue = d3.max(data, (d) => d.data);

  const getX = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.date))
    .range([0, width]);

  const getY = d3
    .scaleLinear()
    .domain([0, yMaxValue + 2])
    .range([height, 0]);

  const getXAxis = (ref) => {
    const xAxis = d3.axisBottom(getX).ticks(data.length - 1);
    d3.select(ref).call(xAxis.tickFormat(d3.timeFormat("%m/%d")));
  };

  const getYAxis = (ref) => {
    const yAxis = d3
      .axisLeft(getY)
      .tickSize(-width)
      .tickPadding(7)
      .tickFormat(d3.format("d"))
      .ticks(yMaxValue + 2);
    d3.select(ref).call(yAxis);
  };

  const linePath = d3
    .line()
    .x((d) => getX(d.date))
    .y((d) => getY(d.data))
    .curve(d3.curveMonotoneX)(data);

  const areaPath = d3
    .area()
    .x((d) => getX(d.date))
    .y0((d) => getY(d.data))
    .y1(() => getY(0))
    .curve(d3.curveMonotoneX)(data);

  if (date0 !== null && date1 !== null && data.length !== 0 && dataInit) {
    return (
      <div className="wrapper">
        <svg
          viewBox={`0 0 ${width + margin.left + margin.right} ${
            height + margin.top + margin.bottom
          }`}
        >
          <g className="axis" ref={getYAxis} />
          <g
            className="axis xAxis"
            ref={getXAxis}
            transform={`translate(0,${height})`}
          />
          <path fill={color} d={areaPath} opacity={0.3} />
          <path strokeWidth={3} fill="none" stroke={color} d={linePath} />

          <text
            transform={"rotate(-90)"}
            x={0 - height / 2}
            y={0 - margin.left}
            dy="1em"
          >
            {"Calls made"}
          </text>
          <text x={width / 2} y={0 - margin.top / 2} text-anchor="middle">
            {"Number of Calls Made"}
          </text>

          {data.map((item, index) => {
            return (
              <g
                key={index}
                onMouseOver={() => setActiveIndex(index)}
                className={"node"}
              >
                <text
                  fill="#666"
                  x={getX(item.date)}
                  y={getY(item.data) - 20}
                  textAnchor="middle"
                >
                  {index === activeIndex ? item.data : ""}
                </text>
                <circle
                  cx={getX(item.date)}
                  cy={getY(item.data)}
                  r={index === activeIndex ? 6 : 4}
                  fill={color}
                  strokeWidth={index === activeIndex ? 2 : 0}
                  stroke="#fff"
                  style={{ transition: "ease-out .1s" }}
                />
              </g>
            );
          })}
        </svg>
      </div>
    );
  } else if (data.length === 0 && dataInit) {
    return (
      <div>
        <p className="line-chart-text">No calls made within these dates.</p>
      </div>
    );
  } else {
    return (
      <div>
        <p className="line-chart-text">Dates not selected.</p>
      </div>
    );
  }
};

export default LineChart;
