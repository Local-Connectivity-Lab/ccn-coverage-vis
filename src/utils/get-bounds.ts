import * as L from 'leaflet';

type GetBoundsParams = {
  map: L.Map;
  center: [number, number];
  minLat: number;
  minLon: number;
  maxLat: number;
  maxLon: number;
  width: number;
  height: number;
};

export default function getBounds({
  map,
  center,
  minLat,
  minLon,
  maxLat,
  maxLon,
  width,
  height,
}: GetBoundsParams) {
  const { x, y } = map.project(center);

  const _bottomleft = map.project([minLat, minLon]);
  const bottomleft: [number, number] = [
    Math.floor(Math.min(x - width / 2, _bottomleft.x - width / 10)),
    Math.ceil(Math.max(y + height / 2, _bottomleft.y + height / 10)),
  ];

  const _topright = map.project([maxLat, maxLon]);
  const topright: [number, number] = [
    Math.ceil(Math.max(x + width / 2, _topright.x + width / 10)),
    Math.floor(Math.min(y - height / 2, _topright.y - height / 10)),
  ];

  const sw = map.unproject(bottomleft);
  const ne = map.unproject(topright);

  const bounds = L.latLngBounds(sw, ne);
  map
    .setMaxBounds(bounds)
    .on('drag', () => map.panInsideBounds(bounds, { animate: false }));

  return {
    width: topright[0] - bottomleft[0],
    height: bottomleft[1] - topright[1],
    left: bottomleft[0],
    top: topright[1],
  };
}
