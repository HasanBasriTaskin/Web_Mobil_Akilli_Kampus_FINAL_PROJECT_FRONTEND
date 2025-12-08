import React from 'react';
import { TextField, MenuItem } from '@mui/material';
import { useController } from 'react-hook-form';

const SelectInput = ({ control, name, label, options = [], displayEmpty, ...props }) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue: '',
  });

  return (
    <TextField
      {...field}
      select
      label={label}
      error={!!error}
      helperText={error?.message}
      fullWidth
      margin="normal"
      displayEmpty={displayEmpty}
      {...props}
    >
      {displayEmpty && (
        <MenuItem value="">
          <em>Seçiniz...</em>
        </MenuItem>
      )}
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default SelectInput;

