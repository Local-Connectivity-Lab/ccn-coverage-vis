import { components } from '@/types/api';

export const siteToSchema = (site: Site): components['schemas']['Site'] => {
  return {
    name: site.name,
    latitude: site.latitude,
    longitude: site.longitude,
    status: siteStatusToSchema(site.status),
    address: site.address,
    cell_id: site.cell_id,
    color: site.color,
    boundary: site.boundary,
  };
};

export const siteStatusToSchema = (
  siteStatus: SiteStatus,
): components['parameters']['SiteStatus'] => {
  if (siteStatus === 'unknown') {
    throw new Error(`Invalid site status: ${siteStatus}`);
  } else {
    return siteStatus as components['parameters']['SiteStatus'];
  }
};
