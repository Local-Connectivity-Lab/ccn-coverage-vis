const ENV_API_URL: string = 'REACT_APP__API_URL';
export const SCRAPER_URL: string = '' + 
  (process.env['SCAPER_URL'] == null
    ? 'http://localhost:8000'
    : process.env['SCRAPER_URL']);
/**
 * The value should be:
 * - When developing frontend only: 'https://coverage.seattlecommunitynetwork.org'.
 * - When developing with local backend: 'http://localhost:3000'.
 * - On production: ''.
 */
export const API_URL: string =
  '' +
  (process.env[ENV_API_URL] == null
    ? 'https://coverage.seattlecommunitynetwork.org'
    : process.env[ENV_API_URL]);

export const DEVICE_OPTIONS: DeviceOption[] = [
  {
    label: 'Low Gain CPE',
    value: 'CPEL',
  },
  {
    label: 'High Gain CPE',
    value: 'CPEH',
  },
  {
    label: 'LG-G8',
    value: 'LGG8',
  },
  {
    label: 'Pixel 4',
    value: 'Pixel4',
  },
  {
    label: 'Android',
    value: 'Android',
  },
];
