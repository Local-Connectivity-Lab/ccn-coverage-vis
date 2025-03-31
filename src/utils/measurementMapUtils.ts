export const UNITS = {
  dbm: 'dBm',
  ping: 'ms',
  download_speed: 'Mbps',
  upload_speed: 'Mbps',
} as const;

export const MULTIPLIERS = {
  dbm: 1,
  ping: 1,
  download_speed: 1,
  upload_speed: 1,
} as const;

export const MAP_TYPE_CONVERT = {
  dbm: 'Signal Strength',
  ping: 'Ping',
  download_speed: 'Download Speed',
  upload_speed: 'Upload Speed',
} as const;
