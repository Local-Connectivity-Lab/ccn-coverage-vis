import React, { useState } from "react";
import Typography from '@material-ui/core/Typography';
import MultiSelect from "react-multi-select-component";
import 'fontsource-roboto';

const Example = () => {
  const options = [
    { label: "David-TCN", value: "dtcn" },
    { label: "Filipino Community Center", value: "fcc" },
    { label: "SURGEtacoma", value: "stac" },
    { label: "Hillside Church Kent", value: "hck" },
    { label: "University Heights Center", value: "uhc" },
    { label: "Skyway Library", value: "slib" },
    { label: "Garfield High School", value: "ghs" },
    { label: "Franklin High School", value: "fhs" },
    { label: "ALTSpace", value: "alts" },
    { label: "Oareao OCC Masjid", value: "oom" },
  ];

  const [selected, setSelected] = useState([]);

  return (
    <div>
      <Typography variant="overline">
        Select Sites
      </Typography>
      {/* <p>DEBUG</p>
      <p>{JSON.stringify(selected)}</p> */}
      <MultiSelect
        options={options}
        value={selected}
        onChange={setSelected}
        labelledBy="Select"
      />
    </div>
  );
};

export default Example;