
import React from 'react'
import { TextField } from '@material-ui/core';

export default function Input({ name, label, value, error = null, onChange, textColor = null, startAdornment = null, endAdornment = null, fontSize = 18, disabled = false, focus = false, ...others }) {


    return (
        <TextField
            variant="outlined"
            InputProps={{ startAdornment: startAdornment && startAdornment, endAdornment: endAdornment && endAdornment }}
            label={label}
            autoFocus={focus}
            inputProps={{ style: { color: textColor ? textColor : 'black', fontSize: fontSize } }}

            name={name}
            disabled={disabled}

            value={value}
            onChange={onChange}
            {...others}
            {...(error && { error: true, helperText: error })}
        />
    )
}