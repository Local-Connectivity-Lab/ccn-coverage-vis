import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { MultiSelect } from 'react-multi-select-component';
import '@fontsource/roboto';

interface SidebarProps {
  selectedSites: SiteOption[];
  setSelectedSites: React.Dispatch<React.SetStateAction<SiteOption[]>>;
  loading: boolean;
  allSites: Site[];
}

const SiteSelect = (props: SidebarProps) => {
  const siteOptions = props.allSites.map(({ name }) => ({
    label: name,
    value: name,
  }));
  return (
    <Box mb={2}>
      <Typography variant='overline'>Select Sites</Typography>
      <MultiSelect
        options={siteOptions}
        value={props.selectedSites}
        onChange={props.setSelectedSites}
        labelledBy='Select'
        disabled={props.loading}
      />
    </Box>
  );
};

export default SiteSelect;
