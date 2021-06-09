import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';

import { MapType } from './MapSelectionRadio';
import data1 from './data-small.json';

import sites from './sites.json';
import { API, MULTIPLIERS } from './MeasurementMap';
import fetchToJson from './utils/fetch-to-json';

interface LineChartProps {
  mapType: MapType;
  offset: number;
  width: number;
  height: number;
  selectedSites: SidebarOption[];
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const colors = d3
  .scaleOrdinal()
  .domain(sites.map(s => s.name))
  .range(d3.schemeTableau10);

const margin = {
  left: 50,
  bottom: 20,
  right: 0,
  top: 20,
};

const mapTypeConvert = {
  ping: 'Ping (ms)',
  upload_speed: 'Upload Speed (Gbps)',
  download_speed: 'Download Speed (Gbps)',
};

// data parser
const parseLineData = (
  data: {
    date: string;
    values: {
      [site: string]: number;
    };
  }[],
) => {
  const output: {
    key: string;
    color: string;
    data: { date: Date; value: number }[];
  }[] = [];

  let i = 0;
  const colNames = new Set<string>();
  data.forEach(d => Object.keys(d.values).forEach(dd => colNames.add(dd)));
  colNames.forEach(col => {
    if (col !== 'date') {
      const o = {
        key: col,
        color: colors(col) + '',
        data: [] as { date: Date; value: number }[],
      };

      for (let i0 = 0, l0 = data.length; i0 < l0; i0++) {
        let d0 = data[i0];

        if (d0.values[col]) {
          o.data.push({
            date: new Date(d0.date),
            value: d0.values[col],
          });
        }
      }
      output.push(o);
    }
    i++;
  });

  return output;
};

const LineChart = ({
  mapType,
  offset,
  width,
  height,
  selectedSites,
  setLoading,
}: LineChartProps) => {
  const [xAxis, setXAxis] =
    useState<d3.Selection<SVGGElement, unknown, HTMLElement, any>>();
  const [yAxis, setYAxis] =
    useState<d3.Selection<SVGGElement, unknown, HTMLElement, any>>();
  const [lines, setLines] =
    useState<d3.Selection<SVGGElement, unknown, HTMLElement, any>>();
  const [yTitle, setYTitle] =
    useState<d3.Selection<SVGTextElement, unknown, HTMLElement, any>>();

  useEffect(() => {
    const svg = d3.select('#line-chart');
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    setXAxis(g.append('g'));
    setYAxis(g.append('g'));
    setLines(g.append('g'));
    setYTitle(
      g.append('g').attr('transform', 'translate(0,10)').append('text'),
    );
    g.append('g').attr('transform', 'translate(0,0)').append('text');
    setLoading(false);
  }, [setXAxis, setYAxis, setLines, setYTitle, setLoading]);

  useEffect(() => {
    if (!xAxis || !yAxis || !lines || !yTitle) return;
    (async function () {
      setLoading(true);
      const _selectedSites = selectedSites.map(ss => ss.label);

      const aggData2: {
        date: string;
        values: {
          [site: string]: number;
        };
      }[] = await fetchToJson(
        API +
          'lineSummary?' +
          new URLSearchParams([
            ['mapType', mapType],
            ['selectedSites', _selectedSites.join(',')],
          ]),
      );

      const chartWidth = width - margin.left - margin.right;
      const chartHeight = height - margin.top - margin.bottom;

      const xScale = d3
        .scaleTime()
        .domain(
          d3
            .extent(aggData2, d => new Date(d.date))
            .map((d?: Date) => d ?? new Date(0)),
        )
        .range([0, chartWidth]);

      const yScale = d3
        .scaleLinear()
        .domain([
          0,
          (d3.max(aggData2, d => Math.max(...Object.values(d.values))) ?? 1) *
            MULTIPLIERS[mapType],
        ])
        .range([chartHeight, 0]);

      const xAxisGenerator = d3.axisBottom(xScale);

      const yAxisGenerator = d3.axisLeft(yScale);

      const lineGenerator = d3
        .line<{ date: Date; value: number }>()
        .x(d => xScale(d.date))
        .y(d => yScale(d.value * MULTIPLIERS[mapType]));

      const lineData = parseLineData(aggData2);

      // ----------------------------------------- CHART --------------------------------------------------

      const svg = d3.select('#line-chart');
      const tooltip = d3
        .select('#line-tooltip')
        .style('position', 'absolute')
        .style('background-color', 'white')
        .style('border', 'solid')
        .style('border-width', '2px')
        .style('border-radius', '3px')
        .style('padding', '3px')
        .style('font-size', 'small')
        .style('opacity', 1)
        .style('display', 'none');

      svg.attr('width', width).attr('height', height);

      xAxis
        .attr('transform', `translate(0, ${chartHeight})`)
        .transition()
        .duration(1000)
        .call(xAxisGenerator);

      yAxis.transition().duration(1000).call(yAxisGenerator);

      yTitle
        .attr('x', 3)
        .attr('font-size', 12)
        .attr('text-anchor', 'start')
        .attr('font-weight', 'bold')
        .text(mapTypeConvert[mapType]);

      lines
        .selectAll('.line')
        .data(lineData, (d: any) => d.key)
        .join(
          enter =>
            enter
              .append('path')
              .attr('d', d => lineGenerator(d.data))
              .attr('class', 'line')
              .style('fill', 'none')
              .style('stroke', d => d.color)
              .style('stroke-width', 2)
              .style('stroke-linejoin', 'round')
              .style('opacity', 0)
              .on('mouseover', function (event, d) {
                tooltip.style('display', 'inline').html(d.key);
                console.log('over');
              })
              .on('mousemove', function (event, d) {
                tooltip
                  .html(d.key)
                  .style('left', event.pageX + 10 + 'px')
                  .style('top', event.pageY + 20 + 'px');
                console.log('move');
              })
              .on('mouseout', function (event, d) {
                // tooltip.style('opacity', 0);
                // console.log('out');
              }),
          update => update,
          exit => exit.remove(),
        )
        .transition()
        .duration(1000)
        .style('opacity', 1)
        .attr('d', d => lineGenerator(d.data));
      setLoading(false);
    })();
  }, [mapType, xAxis, yAxis, lines, yTitle, selectedSites]);
  return (
    <>
      <div style={{ height, width, position: 'relative', top: offset }}>
        <svg id='line-chart'></svg>
      </div>
      <div id='line-tooltip' style={{ position: 'absolute', opacity: 0 }}></div>
    </>
  );
};

export default LineChart;
