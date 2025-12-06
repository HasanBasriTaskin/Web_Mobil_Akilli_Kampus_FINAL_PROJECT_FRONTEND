import React from 'react';
import { TextField } from '@mui/material';
import { useController } from 'react-hook-form';

const TextInput = ({ control, name, label, type = 'text', ...props }) => {
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
      label={label}
      type={type}
      error={!!error}
      helperText={error?.message}
      fullWidth
      margin="normal"
      {...props}
    />
  );
};

export default TextInput;

