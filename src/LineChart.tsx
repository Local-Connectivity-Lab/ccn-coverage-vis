import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as aq from 'arquero';
import { op } from 'arquero';
import { constants } from 'fs';

import { MapType } from './MapSelectionRadio';
import data1 from './data-small.json';
import { ExitStatus, updateLanguageServiceSourceFile } from 'typescript';

interface LineChartProps {
  mapType: MapType;
  offset: number;
  width: number;
  height: number;
}

const colors = {
  SURGEtacoma: {
    light: '#fb9a99',
    dark: '#e31a1c',
  },
  'Filipino Community Center': {
    light: '#a6cee3',
    dark: '#1f78b4',
  },
  'David-TCN': {
    light: '#fdbf6f',
    dark: '#ff7f00',
  },
};

const margin = {
  left: 70,
  bottom: 20,
  right: 0,
  top: 20,
};

const mapTypeConvert = {
  ping: 'Ping (ms)',
  upload_speed: 'Upload Speed (Mb/s)',
  download_speed: 'Download Speed (Mb/s)',
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

        // @ts-ignore
        light: colors[col].light,

        // @ts-ignore
        dark: colors[col].dark,
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
      o: any = {},
      s = d.Date.split('/'),
      yyyy = +s[0],
      mm = s[1] - 1,
      dd = +s[2];

    o.date = new Date(yyyy, mm, dd);

    for (let col in d) {
      if (col !== 'Date') {
        o[col] = +d[col];
      }
    }

    output.push(o);
  }

  // print(output);
  return output;
};

const LineChart = ({ mapType, offset, width, height }: LineChartProps) => {
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

    const measurements = data1.map(d => {
      return {
        ...d,
        timestamp: new Date(d.timestamp.substring(0, 10)),
      };
    });

    const aqTable = aq
      .fromArrow(aq.toArrow(measurements))
      .groupby(['timestamp', 'site'])
      .rollup({ avgPing: `d => op.mean(d.${mapType})` })
      .orderby('timestamp');

    const _timestamp = [...aqTable._data.timestamp].map(
      d =>
        `${d.getFullYear()}/${d.getMonth() > 8 ? '' : '0'}${d.getMonth() + 1}/${
          d.getDate() > 9 ? '' : '0'
        }${d.getDate()}`,
    );

    const _site = [...aqTable._data.site];
    const _avgPing = [...aqTable._data.avgPing];

    const aggData = _timestamp
      .map((t, i) => ({
        timestamp: t,
        site: _site[i],
        avgPing: _avgPing[i],
      }))
      .reduce(
        (acc: any, d: any) => (
          (acc[d.timestamp] = acc[d.timestamp] || {}),
          (acc[d.timestamp][d.site] = d.avgPing),
          acc
        ),
        {},
      );

    const aggData2 = Object.entries(aggData).map(([k, v]) => ({
      Date: k,
      // @ts-ignore
      ...v,
    }));

    // constants for config graphs
    const max_date = d3.max(measurements, d => d.timestamp);
    const min_date = d3.min(measurements, d => d.timestamp);
    const max_upload = d3.max(measurements, (d: any) => d.upload_speed);
    const min_upload = d3.min(measurements, (d: any) => d.upload_speed);

    d3.max(aggData2, d =>
      Math.max(
        d['SURGEtacoma'],
        d['Filipino Community Center'],
        d['David-TCN'],
      ),
    );

    aggData2.sort((a, b) => (a.Date < b.Date ? -1 : 1));

    // const width = 600;
    // const height = width * 0.5;
    // const last = array => array[array.length - 1];
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const xScale = d3
      .scaleTime()
      .domain(
        d3
          .extent(aggData2, d => d.Date)
          .map((date: any) => {
            const [y, m, d] = date.split('/');
            return new Date(+y, +m - 1, +d);
          }),
      )
      .range([0, chartWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(aggData2, (d: any) =>
          Math.max(
            d['SURGEtacoma'],
            d['Filipino Community Center'],
            d['David-TCN'],
          ),
        ) ?? 1,
      ])
      .range([chartHeight, 0]);

    const xAxisGenerator = d3.axisBottom(xScale);

    const yAxisGenerator = d3.axisLeft(yScale);

    const lineGenerator = d3
      .line()
      .x((d: any) => xScale(d.date))
      .y((d: any) => yScale(d.value));

    const data = parseData(aggData2.sort((a, b) => (a.Date < b.Date ? -1 : 1)));
    const lineData = parseLineData(data);

    // ----------------------------------------- CHART --------------------------------------------------

    const svg = d3.select('#line-chart');

    svg.attr('width', width).attr('height', height);

    xAxis
      .attr('transform', `translate(0, ${chartHeight})`)
      .transition()
      .duration(1000)
      .call(xAxisGenerator);

    yAxis
      // .attr('transform', `translate(0,0)`)
      // .call(d3.axisLeft((d:string) => mapType))
      // .call(g => g.select('.domain').remove())
      .transition()
      .duration(1000)
      .call(yAxisGenerator);
    // .call(g =>
    //   g
    //     .select('.tick:last-of-type text')
    //     // .clone()
    //     .attr('x', 3)
    //     .attr('text-anchor', 'start')
    //     .attr('font-weight', 'bold')
    //     .text(mapType),
    // );

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
            .style('stroke', d => d.light)
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
  }, [mapType, xAxis, yAxis, lines, yTitle]);

  // // ------------------------------------hover-----------------------------
  // (function hover(svg, path) {

  //   if ("ontouchstart" in document) svg
  //       .style("-webkit-tap-highlight-color", "transparent")
  //       .on("touchmove", moved)
  //       .on("touchstart", entered)
  //       .on("touchend", left)
  //   else svg
  //       .on("mousemove", moved)
  //       .on("mouseenter", entered)
  //       .on("mouseleave", left);

  //   const dot = svg.append("g")
  //       .attr("display", "none");

  //   dot.append("circle")
  //       .attr("r", 2.5);

  //   dot.append("text")
  //       .attr("font-family", "sans-serif")
  //       .attr("font-size", 10)
  //       .attr("text-anchor", "middle")
  //       .attr("y", -8);

  //   function moved(event) {
  //     event.preventDefault();
  //     const pointer = d3.pointer(event, this);
  //     const xm = x.invert(pointer[0]);
  //     const ym = y.invert(pointer[1]);
  //     const i = d3.bisectCenter(data.dates, xm);
  //     const s = d3.least(data.series, d => Math.abs(d.values[i] - ym));
  //     path.attr("stroke", d => d === s ? null : "#ddd").filter(d => d === s).raise();
  //     dot.attr("transform", `translate(${x(data.dates[i])},${y(s.values[i])})`);
  //     dot.select("text").text(s.name);
  //   }

  //   function entered() {
  //     path.style("mix-blend-mode", null).attr("stroke", "#ddd");
  //     dot.attr("display", null);
  //   }

  //   function left() {
  //     path.style("mix-blend-mode", "multiply").attr("stroke", null);
  //     dot.attr("display", "none");
  //   }
  // });
  // // ------------------------------------hover ends---------------------------
  return (
    <div style={{ height, width, position: 'relative', top: offset }}>
      <svg id='line-chart'></svg>
    </div>
  );
};

export default LineChart;
