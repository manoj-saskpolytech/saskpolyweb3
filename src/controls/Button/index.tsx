import * as React from 'react';
import Button from '@mui/material/Button';

// Logic to execute the hideWhen logic
export default function CustomButton(props: any) {
  const {
    id,
    onClick,
    hideWhen,
    children,
    ...otherProps
  } = props;

  // Conditionally render the button based on hideWhen logic
  if (!(hideWhen && hideWhen())) {
    return (
      <Button
        type={onClick ? 'button' : 'submit'} // Material-UI Button doesn't use a "Save" type, typically use "submit" or "button"
        id={id}
        // cursor="pointer"
        onClick={onClick}
        {...otherProps}
      >
        {children}
      </Button>
    );
  }
  return null;
}
