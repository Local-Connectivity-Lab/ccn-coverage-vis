import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Select from 'react-select';
import '@fontsource/roboto';

interface SidebarProps {
  selectedSites: SiteOption[];
  setSelectedSites: React.Dispatch<React.SetStateAction<SiteOption[]>>;
  loading: boolean;
  allSites: Site[];
}

const SiteSelect = (props: SidebarProps) => {
  const siteOptions = props.allSites.map(({ name, status }) => ({
    label: name,
    value: name,
    status: status
  }));
  
  return (
    <Box mb={3}>
      <Typography variant='overline'>Select Sites</Typography>
      <Select
        isMulti
        options={siteOptions}
        value={props.selectedSites}
        onChange={(selected) => props.setSelectedSites(selected as SiteOption[])}
        isDisabled={props.loading}
        placeholder="Select..."
      />
    </Box>
  );
};

export default SiteSelect;