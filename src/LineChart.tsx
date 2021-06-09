import React, { useEffect } from 'react';
import * as d3 from 'd3';
import data1 from './data-small.json';
import * as aq from 'arquero';
import { op } from 'arquero';
import { constants } from 'fs';

interface LineChartProps {}

const LineChart = ({}: LineChartProps) => {
  useEffect(() => {
    const measurements = data1.map(d => {
      return {
        ...d,
        timestamp: new Date(d.timestamp.substring(0, 10)),
      };
    });

    const aqTable = aq
      .fromArrow(aq.toArrow(measurements))
      .groupby(['timestamp', 'site'])
      .rollup({ avgPing: (d: any) => op.mean(d.ping) })
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

    const margin = {
      left: 20,
      bottom: 20,
      right: 60,
      top: 10,
    };

    const height = width * 0.5;
    // const last = array => array[array.length - 1];
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const xScale = d3
      .scaleTime()
      .domain(
        d3
          .extent(aggData2, d => d.Date)
          .map(date => {
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

    // data parser
    const parseLineData = (data: any) => {
      const output: any[] = [];

      let i = 0;
      const colNames = new Set<any>();
      data.forEach((d: any) => Object.keys(d).forEach(dd => colNames.add(dd)));
      console.log(colNames);
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
      // for (let col of [...colNames.values()]) {
      //   if (col !== 'date') {
      //     let o = {
      //       key: col,
      //       light: colors[col].light,
      //       dark: colors[col].dark,
      //       data: [],
      //     };

      //     for (let i0 = 0, l0 = data.length; i0 < l0; i0++) {
      //       let d0 = data[i0];

      //       if (d0[col]) {
      //         o.data.push({
      //           date: d0.date,
      //           value: d0[col],
      //         });
      //       }
      //     }
      //     output.push(o);
      //   }
      //   i++;
      // }

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

    const data = parseData(aggData2.sort((a, b) => (a.Date < b.Date ? -1 : 1)));
    const lineData = parseLineData(data);

    // ----------------------------------------- CHART --------------------------------------------------
    const svg = d3.select('#line-chart');

    svg.attr('width', width).attr('height', height);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    g.append('g')
      .call(xAxisGenerator)
      .attr('transform', `translate(0, ${chartHeight})`);

    g.append('g').call(yAxisGenerator);

    g.selectAll('.line')
      .data(lineData)
      .enter()
      .append('path')
      .attr('d', d => lineGenerator(d.data))
      .style('fill', 'none')
      .style('stroke', d => d.light)
      .style('stroke-width', 2)
      .style('stroke-linejoin', 'round');
  }, []);
  return (
    <div>
      <svg id='line-chart'></svg>
    </div>
  );
};

export default LineChart;
