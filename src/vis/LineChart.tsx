import React, { useEffect, useState } from "react";
import * as d3 from "d3";

import { MapType } from "./MapSelectionRadio";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";

import { MULTIPLIERS } from "./MeasurementMap";
import { solveDisplayOptions } from "./DisplaySelection";
import { API_URL } from "../utils/config";
import fetchToJson from "../utils/fetch-to-json";
import Loading from "../Loading";

interface LineChartProps {
  mapType: MapType;
  offset: number;
  width: number;
  height: number;
  selectedSites: SiteOption[];
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  allSites: Site[];
  timeFrom: Date;
  timeTo: Date;
  setDisplayOptions: React.Dispatch<React.SetStateAction<DisplayOption[]>>;
  displayOptions: DisplayOption[];
}

const margin = {
  left: 40,
  bottom: 25,
  right: 12,
  top: 12,
};

const mapTypeConvert = {
  dbm: "Signal Strength (dB)",
  ping: "Ping (ms)",
  upload_speed: "Upload Speed (Mbps)",
  download_speed: "Download Speed (Mbps)",
};

const LineChart = ({
  mapType,
  offset,
  width,
  height,
  selectedSites,
  setLoading,
  loading,
  allSites,
  timeFrom,
  timeTo,
  setDisplayOptions,
  displayOptions,
}: LineChartProps) => {
  const [xAxis, setXAxis] =
    useState<d3.Selection<SVGGElement, unknown, HTMLElement, any>>();
  const [yAxis, setYAxis] =
    useState<d3.Selection<SVGGElement, unknown, HTMLElement, any>>();
  const [lines, setLines] =
    useState<d3.Selection<SVGGElement, unknown, HTMLElement, any>>();
  const [yTitle, setYTitle] =
    useState<d3.Selection<SVGTextElement, unknown, HTMLElement, any>>();
  const [lineSummary, setLineSummary] = useState<any>();
  useEffect(() => {
    const svg = d3.select("#line-chart");
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    setXAxis(g.append("g"));
    setYAxis(g.append("g"));
    setLines(g.append("g"));
    setYTitle(
      g.append("g").attr("transform", "translate(0,10)").append("text")
    );
    g.append("g").attr("transform", "translate(0,0)").append("text");
    setLoading(false);
  }, [setXAxis, setYAxis, setLines, setYTitle, setLoading]);
  useEffect(() => {
    (async () => {
      const _selectedSites = selectedSites.map((ss) => ss.label);
      if (selectedSites.length === 0) {
        return;
      }
      const _lineSummary = await fetchToJson(
        API_URL +
          "/api/lineSummary?" +
          new URLSearchParams([
            ["mapType", mapType],
            ["selectedSites", _selectedSites.join(",")],
            ["timeFrom", timeFrom.toISOString()],
            ["timeTo", timeTo.toISOString()],
          ])
      );
      setLineSummary(_lineSummary);
    })();
  }, [mapType, selectedSites, timeFrom, timeTo]);
  useEffect(() => {
    if (!xAxis || !yAxis || !lines || !yTitle || !lineSummary) return;
    (async function () {
      setLoading(true);
      let colors: { [name: string]: string } = {};
      for (let site of allSites) {
        colors[site.name] = site.color ?? "#000000";
      }
      const data: {
        site: string;
        values: { date: Date; value: number }[];
      }[] = lineSummary.map((d: any) => ({
        site: d.site,
        values: d.values.map((v: any) => ({
          date: new Date(v.date),
          value: v.value,
        })),
      }));

      const chartWidth = width - margin.left - margin.right;
      const chartHeight = height - margin.top - margin.bottom;

      const flat = data.map((a) => a.values).flat();
      const xScale = d3
        .scaleTime()
        .domain(
          d3
            .extent(flat, (d) => new Date(d.date))
            .map((d?: Date) => d ?? new Date(0))
        )
        .range([0, chartWidth]);
      let yScale: any;
      if (mapType === "dbm") {
        yScale = d3
          .scaleLinear()
          .domain([
            (d3.max(flat, (d) => d.value) ?? 1) * MULTIPLIERS[mapType],
            (d3.min(flat, (d) => d.value) ?? 1) * MULTIPLIERS[mapType],
          ])
          .range([0, chartHeight]);
      } else {
        yScale = d3
          .scaleLinear()
          .domain([
            0,
            (d3.max(flat, (d) => d.value) ?? 1) * MULTIPLIERS[mapType],
          ])
          .range([chartHeight, 0]);
      }

      const xAxisGenerator = d3.axisBottom(xScale);

      const yAxisGenerator = d3.axisLeft(yScale);

      const lineGenerator = d3
        .line<{ date: Date; value: number }>()
        .x((d) => xScale(d.date))
        .y((d) => yScale(d.value * MULTIPLIERS[mapType]));

      // ----------------------------------------- CHART --------------------------------------------------

      const svg = d3.select("#line-chart");
      const tooltip = d3
        .select("#line-tooltip")
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border-radius", "4px")
        .style(
          "box-shadow",
          "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)"
        )
        .style("padding", "4px")
        .style("font-size", "small")
        .style("opacity", 1)
        .style("display", "none");

      svg.attr("width", width).attr("height", height);

      xAxis
        .attr("transform", `translate(0, ${chartHeight})`)
        .style("user-select", "none")
        .transition()
        .duration(0)
        .call(xAxisGenerator);

      yAxis
        .style("user-select", "none")
        .transition()
        .duration(0)
        .call(yAxisGenerator);

      yTitle
        .attr("x", 3)
        .style("user-select", "none")
        .attr("font-size", 12)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(mapTypeConvert[mapType]);

      lines
        .selectAll(".line")
        .data(data, (d: any) => d.site)
        .join(
          (enter) =>
            enter
              .append("path")
              .attr("d", (d) =>
                lineGenerator(d.values.map(({ date }) => ({ date, value: 0 })))
              )
              .attr("class", "line")
              .style("fill", "none")
              .style("stroke", (d) => colors[d.site] + "")
              .style("stroke-width", 2)
              .style("stroke-linejoin", "round")
              .style("opacity", 0)
              .on("mouseover", (_, d) =>
                tooltip.style("display", "inline").html(d.site)
              )
              .on("mousemove", (event, d) =>
                tooltip
                  .html(
                    d.site +
                      "<br>" +
                      d.values[
                        Math.floor(
                          d.values.length *
                            ((event.offsetX - margin.left) / chartWidth)
                        )
                      ].value.toFixed(2)
                  )
                  .style("left", event.offsetX - 120 + "px")
                  .style("top", event.offsetY - 50 + "px")
              )
              .on("mouseout", () => tooltip.style("display", "none")),
          (update) => update,
          (exit) => exit.remove()
        )
        .transition()
        .duration(500)
        .style("opacity", 1)
        .attr("d", (d) => lineGenerator(d.values));
      setLoading(false);
    })();
  }, [
    mapType,
    xAxis,
    yAxis,
    lines,
    yTitle,
    height,
    setLoading,
    width,
    selectedSites,
    allSites,
    lineSummary,
    timeFrom,
    timeTo,
  ]);

  return (
    <>
      <div
        id="line-close"
        style={{ position: "absolute", right: 10, top: 10, zIndex: 1600 }}
      >
        <IconButton
          onClick={() => {
            setDisplayOptions(
              solveDisplayOptions(displayOptions, "displayGraph", false)
            );
          }}
        >
          <VisibilityOffIcon></VisibilityOffIcon>
        </IconButton>
      </div>
      <div style={{ height, width, position: "relative", top: offset }}>
        <svg id="line-chart"></svg>
        <Loading
          left={width / 2}
          top={height / 2}
          size={70}
          loading={loading}
        />
      </div>
      <div id="line-tooltip" style={{ position: "absolute", opacity: 0 }}></div>
    </>
  );
};

export default LineChart;
