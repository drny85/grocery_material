import React from "react";
import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  FormHelperText,
  ListItemText,

} from "@material-ui/core";

export default function Select(props) {
  const { name, label, value, error = null, onChange, width, options, currents, ...others } = props;
  return (
    <FormControl
      style={{ width: width ? width : '100%' }}
      variant="outlined"
      {...(error && { error: true })}
    >
      <InputLabel>{label}</InputLabel>
      <MuiSelect label={label} name={name} value={value} onChange={onChange} {...others}>
        <MenuItem value="">None</MenuItem>
        {options.map((item) => (
          <MenuItem className='capitalize' key={item.id || item} value={item.id || item}>

            <ListItemText primary={item.name || item} />

          </MenuItem>
        ))}
      </MuiSelect>
      { error && <FormHelperText>{error}</FormHelperText>}
    </FormControl >
  );
}
