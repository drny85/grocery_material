import React from "react";
import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  FormHelperText,
  ListItemText,
  Checkbox,
} from "@material-ui/core";

export default function Select(props) {
  const { name, label, value, error = null, onChange, width, multiple = false, options, currents, ...others } = props;

  return (
    <FormControl
      style={{ width: width ? width : '100%' }}
      variant="outlined"
      {...(error && { error: true })}
    >
      <InputLabel>{label}</InputLabel>
      <MuiSelect label={label} name={name} value={value} multiple={multiple} onChange={onChange} {...others}>
        <MenuItem value="">None</MenuItem>
        {options.map((item) => (
          <MenuItem className='capitalize' key={item.id || item._id} value={item.id || item._id}>
            {multiple ? (<><Checkbox checked={currents && currents.indexOf(item.name || item.id) > -1} />
              <ListItemText primary={item.title || item.name} />)</>) : (item.title || item.name)}



          </MenuItem>
        ))}
      </MuiSelect>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}
