type SidebarOption = {
  label: string;
  value: string;
  status: SiteStatus;
};

type Cell = {
  x: int;
  y: int;
}

type DisplayOption = {
  label: string;
  name: string;
  checked: boolean;
};

type SiteStatus = 'active' | 'confirmed' | 'in-conversation';

type AdminPage = 'users' | 'edit-site' | 'edit-data';

type UserRow = {
  identity: string,
  email: string
  firstName: string,
  lastName: string,
  isEnabled: boolean,
  issueDate: Date,
  registered: boolean,
  qrCode: string
}

type Site = {
  name: string;
  latitude: number;
  longitude: number;
  status: SiteStatus;
  address: string;
  cell_id: string[];
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
