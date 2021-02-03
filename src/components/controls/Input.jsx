
import React from 'react'
import { TextField } from '@material-ui/core';

export default function Input({ name, label, value, error = null, onChange, textColor = null, fontSize = 18, focus = false, ...others }) {


    return (
        <TextField
            variant="outlined"

            label={label}
            autoFocus={focus}
            inputProps={{ style: { color: textColor ? textColor : 'black', fontSize: fontSize } }}
            name={name}

            value={value}
            onChange={onChange}
            {...others}
            {...(error && { error: true, helperText: error })}
        />
    )
}