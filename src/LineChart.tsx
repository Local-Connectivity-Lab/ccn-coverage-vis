import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import * as aq from 'arquero';

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
}

const colors = d3
  .scaleOrdinal()
  .domain(sites.map(s => s.name))
  .range(d3.schemeTableau10);

const margin = {
  left: 70,
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
const parseLineData = (data: any) => {
  const output: any[] = [];

  let i = 0;
  const colNames = new Set<any>();
  data.forEach((d: any) => Object.keys(d).forEach(dd => colNames.add(dd)));
  colNames.forEach(col => {
    if (col !== 'date') {
      let o = {
        key: col,
        color: colors(col),
        data: [] as any[],
      };

      for (let i0 = 0, l0 = data.length; i0 < l0; i0++) {
        let d0 = data[i0];

        if (d0[col]) {
          o.data.push({
            date: d0.date,
            value: d0[col],
          });
        }
      }
      output.push(o);
    }
    i++;
  });

  return output;
};

const parseData = (data: any) => {
  const output = [];
  for (let i = 0, l = data.length; i < l; i++) {
    let d = data[i],
      o: any = {};

    o.date = new Date(d.date);

    for (let col in d.values) {
      o[col] = +d.values[col];
    }

    output.push(o);
  }
  return output;
};

const LineChart = ({
  mapType,
  offset,
  width,
  height,
  selectedSites,
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
  }, [setXAxis, setYAxis, setLines, setYTitle]);

  useEffect(() => {
    if (!xAxis || !yAxis || !lines || !yTitle) return;
    (async function () {
      const _selectedSites = selectedSites.map(ss => ss.label);

      const measurements = data1
        .filter(d => _selectedSites.includes(d.site))
        .map(d => {
          return {
            ...d,
            timestamp: new Date(d.timestamp.substring(0, 10)),
          };
        });

      if (measurements.length === 0) return;

      const aqTable = aq
        .fromArrow(aq.toArrow(measurements))
        .groupby(['timestamp', 'site'])
        .rollup({ avgPing: `d => op.mean(d.${mapType})` });

      const _timestamp: string[] = [...aqTable._data.timestamp].map((d: Date) =>
        d.toISOString(),
      );

      const _site: string[] = [...aqTable._data.site];
      const _avgPing: number[] = [...aqTable._data.avgPing];

      const aggData = _timestamp
        .map((t, i) => ({
          timestamp: t,
          site: _site[i],
          avgPing: _avgPing[i],
        }))
        .reduce(
          (acc, d) => (
            (acc[d.timestamp] = acc[d.timestamp] || {}),
            (acc[d.timestamp][d.site] = d.avgPing),
            acc
          ),
          {} as { [timestamp: string]: { [site: string]: number } },
        );

      const aggData2 = Object.entries(aggData).map(([k, v]) => ({
        date: k,
        values: {
          ...v,
        },
      }));

      aggData2.sort((a, b) => (a.date < b.date ? -1 : 1));

      const chartWidth = width - margin.left - margin.right;
      const chartHeight = height - margin.top - margin.bottom;

      const xScale = d3
        .scaleTime()
        .domain(
          d3
            .extent(aggData2, d => d.date)
            .map((date: any) => {
              return new Date(date);
            }),
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
        .line()
        .x((d: any) => xScale(d.date))
        .y((d: any) => yScale(d.value * MULTIPLIERS[mapType]));

      console.log(aggData2);
      const data = parseData(
        aggData2.sort((a, b) => (a.date < b.date ? -1 : 1)),
      );
      console.log(data);
      const lineData = parseLineData(data);
      console.log(lineData);

      // ----------------------------------------- CHART --------------------------------------------------

      const svg = d3.select('#line-chart');

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
              .style('opacity', 0),
          update => update,
          exit => exit.remove(),
        )
        .transition()
        .duration(1000)
        .style('opacity', 1)
        .attr('d', d => lineGenerator(d.data));
    })();
  }, [mapType, xAxis, yAxis, lines, yTitle, selectedSites]);
  return (
    <div style={{ height, width, position: 'relative', top: offset }}>
      <svg id='line-chart'></svg>
    </div>
  );
};

export default LineChart;
