import React, { Component } from "react";
import * as d3 from "d3";

const width = 650;
const height = 650;

class AirTemperature extends Component {
  state = {
    slices: [], // array of svg path commands, each = one day
    typeAnnotations: []
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { data, range } = nextProps;
    if (!data) return {};

    const radiusScale = d3
      .scaleLinear()
      .domain([d3.min(data, d => d.min), d3.max(data, d => d.max)])
      .range([0, width / 2]);

    const colorScale = d3
      .scaleSequential()
      .domain(d3.extent(data, d => d.avg))
      .interpolator(d3.interpolateRdYlBu);

    // get the angle for each slice
    // 2PI / 365
    const perSliceAngle = (2 * Math.PI) / data.length;

    const arcGenerator = d3.arc();
    const slices = data.map((d, i) => {
      const path = arcGenerator({
        startAngle: i * perSliceAngle,
        endAngle: (i + 1) * perSliceAngle,
        innerRadius: radiusScale(d.min),
        outerRadius: radiusScale(d.max)
      });
      // slice should be colored if there's no sol range
      // or if the slice is within the sol range
      const isColored =
        !range.length || (range[0] <= d.sol && d.sol <= range[1]);
      return {
        path,
        fill: isColored ? colorScale(d.avg) : "#ccc"
      };
    });

    const typeAnnotations = [50, 100, 125, 150, 200].map(type => {
      return {
        r: radiusScale(type),
        type
      };
    });

    return { slices, typeAnnotations };
  }

  render() {
    return (
      <svg width={width} height={height}>
        <g transform={`translate(${width / 2}, ${height / 2})`}>
          {this.state.slices.map((d, i) => (
            <path key={i} d={d.path} fill={d.fill} />
          ))}

          {this.state.typeAnnotations.map((d, i) => (
            <g key={i}>
              <circle r={d.r} fill="none" stroke="#999" />
              <text y={-d.r - 2} textAnchor="middle">
                {d.type}℉
              </text>
            </g>
          ))}
        </g>
      </svg>
    );
  }
}

export default AirTemperature;
