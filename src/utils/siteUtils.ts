import { components } from '@/types/api';

export const siteToSchema = (site: Site): components['schemas']['Site'] => {
  return {
    identity: site.identity,
    name: site.name,
    latitude: site.latitude,
    longitude: site.longitude,
    status: siteStatusToSchema(site.status),
    address: site.address,
    cell_ids: site.cell_id,
    color: site.color,
    boundaries: site.boundary,
  };
};

export const siteToNewSiteRequest = (site: Site): components['schemas']['NewSiteRequest'] => {
  return {
    name: site.name,
    latitude: site.latitude,
    longitude: site.longitude,
    status: siteStatusToNewSiteRequestSchema(site.status),
    address: site.address,
    cell_ids: site.cell_id,
    color: site.color,
    boundaries: site.boundary,
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

export const siteStatusToNewSiteRequestSchema = (
  siteStatus: SiteStatus,
): components['schemas']['NewSiteRequest']['status'] => {
  if (siteStatus === 'unknown') {
    throw new Error(`Invalid site status: ${siteStatus}`);
  } else {
    return siteStatus as components['schemas']['NewSiteRequest']['status'];
  }
};
