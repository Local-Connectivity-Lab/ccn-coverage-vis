import React, { useEffect } from 'react';
import * as d3 from 'd3';
import data from './data-small.json';

interface LineChartProps {
}

const LineChart = ({ colorDomain, title, width }: LineChartProps) => {

  useEffect(() => {
    
  }, []);
  return (<div>
      <svg id='line-chart'></svg>
  </div>);
};

export default LineChart;
