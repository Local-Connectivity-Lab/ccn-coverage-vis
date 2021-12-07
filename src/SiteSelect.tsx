import React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { MultiSelect } from 'react-multi-select-component';
import 'fontsource-roboto';
import sites from './sites.json';

const options = sites.map(({ name }) => ({ label: name, value: name }));

interface SidebarProps {
  selectedSites: SidebarOption[];
  setSelectedSites: React.Dispatch<React.SetStateAction<SidebarOption[]>>;
  loading: boolean;
}

const SiteSelect = (props: SidebarProps) => {
  return (
    <Box mb={2}>
      <Typography variant='overline'>Select Sites</Typography>
      <MultiSelect
        options={options}
        value={props.selectedSites}
        onChange={props.setSelectedSites}
        labelledBy='Select'
        disabled={props.loading}
      />
    </Box>
  );
};

export default SiteSelect;
