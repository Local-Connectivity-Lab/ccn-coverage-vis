import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { MultiSelect } from "react-multi-select-component";
import { DEVICE_OPTIONS } from "../utils/config";
import "fontsource-roboto";

interface SidebarProps {
  selectedDevices: DeviceOption[];
  setSelectedDevices: React.Dispatch<React.SetStateAction<DeviceOption[]>>;
  loading: boolean;
}

const DeviceSelect = (props: SidebarProps) => {
  const siteOptions = DEVICE_OPTIONS.map(({ label, value }) => ({
    label: value,
    value: value,
  }));
  return (
    <Box mb={2} style={{ zIndex: 1450 }}>
      <Typography variant="overline">Display markers</Typography>
      <MultiSelect
        options={siteOptions}
        value={props.selectedDevices}
        onChange={props.setSelectedDevices}
        labelledBy="Select"
        disabled={props.loading}
      />
    </Box>
  );
};

export default DeviceSelect;
