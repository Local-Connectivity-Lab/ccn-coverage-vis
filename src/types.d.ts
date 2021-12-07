type SidebarOption = {
  label: string;
  value: string;
};

type SiteStatus = 'active' | 'confirmed' | 'in-conversation';

type Site = {
  name: string;
  latitude: number;
  longitude: number;
  status: SiteStatus;
  address: string;
};

type Measurement = {
  latitude: number;
  longitude: number;
  timestamp: string;
  upload_speed: number;
  download_speed: number;
  data_since_last_report: number;
  ping: number;
  site: string;
  device_id: number;
};

