import React from 'react';
import { TextField, MenuItem } from '@material-ui/core';
import { useField, useFormikContext } from 'formik';

const SelectWrapper = ({
  name,
  options,
  ...otherProps
}) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = evt => {
    const { value } = evt.target;
    setFieldValue(name, value);
  };

  const configSelect = {
    ...field,
    ...otherProps,
    select: true,
    variant: 'outlined',
    fullWidth: true,
    onChange: handleChange
  };

  if (meta && meta.touched && meta.error) {
    configSelect.error = true;
    configSelect.helperText = meta.error;
  }

  return (
    <TextField {...configSelect} style={{ width: 200 }}>
      <MenuItem value="">
        <em>None</em>
      </MenuItem>
      {options.map((item) => {
        return (
          <MenuItem key={item.id} id={item.id} value={item.id}>
            {item.name}
          </MenuItem>
        )
      })}

    </TextField>
  );
};

export default SelectWrapper;