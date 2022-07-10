import * as React from "react";

import { SearchResult } from "../../utils/search";
import { HighlightRegion } from "../Linear/SeqBlock/LinearFind";
import { Coor, InputRefFuncType } from "../common";

interface CircularFindProps {
  center: Coor;
  findCoor: (index: number, radius: number, rotate?: boolean) => Coor;
  generateArc: (args: {
    arrowFWD?: boolean;
    arrowREV?: boolean;
    innerRadius: number;
    largeArc: boolean;
    length: number;
    offset?: number;
    outerRadius: number;
    // see svg.arc large-arc-flag
    sweepFWD?: boolean;
  }) => string;
  getRotation: (index: number) => string;
  highlightedRegions: HighlightRegion[];
  inputRef: InputRefFuncType;
  lineHeight: number;
  onUnmount: unknown;
  radius: number;
  rotateCoor: (coor: Coor, degrees: number) => Coor;
  search: SearchResult[];
  seq: string;
  seqLength: number;
  totalRows: number;
}

export const CircularFind = (props: CircularFindProps) => {
  const { seqLength, search, radius, lineHeight, getRotation, generateArc, inputRef, highlightedRegions } = props;
  const threshold = seqLength >= 200 ? search.length / seqLength <= 0.02 : true;
  const searchArcs = search.map(s => (
    <CircularFindArc
      key={JSON.stringify(s)}
      direction={s.direction}
      end={s.end}
      fillStyle={"rgba(255, 251, 7, 0.5)"}
      generateArc={generateArc}
      getRotation={getRotation}
      inputRef={inputRef}
      lineHeight={lineHeight}
      radius={radius}
      seqLength={seqLength}
      start={s.start}
    />
  ));

  const highlightArcs = highlightedRegions.map(({ start, end, color }) => (
    <CircularFindArc
      key={JSON.stringify({ end, start })}
      direction={1}
      end={end}
      fillStyle={color || "rgba(0, 251, 7, 0.5)"}
      generateArc={generateArc}
      getRotation={getRotation}
      inputRef={inputRef}
      lineHeight={lineHeight}
      radius={radius}
      seqLength={seqLength}
      start={start}
    />
  ));
  return (
    <g className="la-vz-circular-search-results">
      {threshold && searchArcs}
      {highlightArcs}
    </g>
  );
};

/**
 * Create an SVG `path` element that highlights the search result
 */
export const CircularFindArc = (props: {
  direction: -1 | 1;
  end: number;
  fillStyle: string;
  generateArc: (args: {
    arrowFWD?: boolean;
    arrowREV?: boolean;
    innerRadius: number;
    largeArc: boolean;
    length: number;
    offset?: number;
    outerRadius: number;
    // see svg.arc large-arc-flag
    sweepFWD?: boolean;
  }) => string;
  getRotation: (index: number) => string;
  inputRef: InputRefFuncType;
  lineHeight: number;
  radius: number;
  seqLength: number;
  start: number;
}) => {
  const { radius, lineHeight, seqLength, getRotation, generateArc, inputRef, start, direction, fillStyle } = props;

  let { end } = props;
  // crosses the zero index
  if (end < start) {
    end += seqLength;
  }

  const resultLength = Math.abs(end - start);
  const findPath = generateArc({
    innerRadius: radius - lineHeight / 2,
    largeArc: resultLength > seqLength / 2,
    length: resultLength,
    outerRadius: radius + lineHeight / 2,
    sweepFWD: true,
  });

  const resultStyle = {
    cursor: "pointer",
    fill: fillStyle,
    shapeRendering: "auto",
    stroke: "rgba(0, 0, 0, 0.5)",
    strokeWidth: 1,
  };

  const id = `${start}${end}${direction}${start}`;

  return (
    <path
      key={id}
      ref={inputRef(id, {
        end: end,
        ref: id,
        start: start,
        type: "FIND",
      })}
      d={findPath}
      id={id}
      transform={getRotation(start)}
      {...resultStyle}
    />
  );
};
