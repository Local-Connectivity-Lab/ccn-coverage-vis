export const API_URL: string = ''; // Compatible with `docker compose`.
// export const API_URL: string = 'http://localhost:3000';  // Compatible with ccn-coverage `api` running on the same host as `vis`.
// export const API_URL: string = 'https://coverage.seattlecommunitynetwork.org';  // For testing only.

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
