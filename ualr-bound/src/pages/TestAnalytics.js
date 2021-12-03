import React, { useState, useEffect } from "react";
import { scaleBand, scaleLinear, max } from "d3"



const visualAnalytics = () => {

    //const [data, setData] = useState(null);

    const width = 250;
    const height = 250;

    let data = [
        {
            color: "blue",
            favorite: "335"
        },
        {
            color: "green",
            favorite: "254"
        },
        {
            color: "red",
            favorite: "426"
        },
    ]

    const yScale = scaleBand()
        .domain(data.map(d=> d.color))
        .range([0, height])

    const xScale = scaleLinear()
        .domain([0, max(data, d => d.favorite)])
        .range([0, width])

    return (
        <svg width={width} height={height}>
            {data.map(d => 
                <rect 
                x={0} 
                y={yScale(d.color)} 
                width={xScale(d.favorite)} 
                height={yScale.bandwidth()}/>)}
        </svg>
    )


}

export default visualAnalytics;
