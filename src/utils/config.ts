/**
 * The value should be:
 * - When developing frontend only: 'https://coverage.seattlecommunitynetwork.org'.
 * - When developing with local backend: 'http://localhost:3000'.
 * - On production: ''.
 */
export const API_URL: string = import.meta.env.DEV
  ? String(
      `http://${import.meta.env.VITE_ENV_API_URL}:${import.meta.env.VITE_PORT}`,
    )
  : '';

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
