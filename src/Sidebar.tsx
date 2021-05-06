import React from 'react';
import Typography from '@material-ui/core/Typography';
import MultiSelect from 'react-multi-select-component';
import 'fontsource-roboto';
import sites from './sites.json';

const options = sites.map(({ name }) => ({ label: name, value: name }));

interface SidebarProps {
  selectedSites: SidebarOption[];
  setSelectedSites: React.Dispatch<React.SetStateAction<SidebarOption[]>>;
}

const Sidebar = (props: SidebarProps) => {
  return (
    <div>
      <Typography variant='overline'>Select Sites</Typography>
      <MultiSelect
        options={options}
        value={props.selectedSites}
        onChange={props.setSelectedSites}
        labelledBy='Select'
      />
    </div>
  );
};

export default Sidebar;
