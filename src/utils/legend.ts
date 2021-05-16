import * as d3 from 'd3';
import { createCanvas } from 'node-canvas';

export default function legend({
  color,
  title,
  tickFormat,
}: {
  color: d3.ScaleSequential<string, never>;
  title: string;
  tickFormat: any;
}) {
  const tickSize = 6;
  const width = 25;
  const height = 600;
  const marginTop = 40;
  const marginRight = 0;
  const marginBottom = 30;
  const marginLeft = 0;
  const ticks = height / 64;

  const svg = d3
    .select<SVGElement, unknown>('#map-legend')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height].join(' '))
    .style('overflow', 'visible')
    .style('display', 'block');

  svg.selectAll('*').remove();

  let tickAdjust = (
    g: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>,
  ) => g.selectAll('.tick line').attr('x1', width - marginRight - marginLeft);
  let x = Object.assign(
    color
      .copy()
      .interpolator(d3.interpolateRound(marginTop, height - marginBottom)),
    {
      range() {
        return [height - marginBottom, marginTop];
      },
    },
  );

  svg
    .append('image')
    .attr('x', marginLeft)
    .attr('y', marginTop)
    .attr('width', width - marginLeft - marginRight)
    .attr('height', height - marginTop - marginBottom)
    .attr('preserveAspectRatio', 'none')
    .attr('xlink:href', ramp(color.interpolator()).toDataURL());

  const n = Math.round(ticks + 1);
  const tickValues = d3
    .range(n)
    .map(i => d3.quantile(color.domain(), i / (n - 1)) ?? NaN);
  if (typeof tickFormat !== 'function') {
    tickFormat = d3.format(tickFormat === undefined ? ',f' : tickFormat);
  }

  svg
    .append('g')
    .attr('transform', `translate(${marginLeft},${0})`)
    .call(
      d3
        .axisLeft(x)
        .ticks(ticks, typeof tickFormat === 'string' ? tickFormat : undefined)
        .tickFormat(typeof tickFormat === 'function' ? tickFormat : undefined)
        .tickSize(tickSize)
        .tickValues(tickValues),
    )
    .call(tickAdjust)
    .call(g => g.select('.domain').remove())
    .call(g =>
      g
        .append('text')
        .attr('y', marginTop - 6)
        .attr('x', width - marginRight - marginLeft - 2)
        .attr('fill', 'currentColor')
        .attr('text-anchor', 'begin')
        .attr('font-weight', 'bold')
        .attr('class', 'title')
        .text(title),
    );

  return svg.node();
}

function ramp(color: (t: number) => string, n = 256) {
  const canvas = createCanvas(1, n);
  const context = canvas.getContext('2d');

  for (let i = 0; i < n; ++i) {
    context.fillStyle = color(i / (n - 1));
    context.fillRect(0, i, 1, 1);
  }

  return canvas;
}
