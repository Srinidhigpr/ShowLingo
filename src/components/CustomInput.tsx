import {
  Box,
  InputBaseComponentProps,
  SxProps,
  TextField,
} from "@mui/material";
import { FC, memo } from "react";

interface CustomInputProps {
  placeholder: string;
  sx?: SxProps;
  boxSx?: SxProps;
  onChange?: (value: string | number) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  onClick?: () => void;
  error?: string;
  value?: string;
  type?: string;
  inputProps?: InputBaseComponentProps;
  disabled?: boolean;
  readOnly?: boolean;
}

export const CustomInput: FC<CustomInputProps> = memo(
  ({
    placeholder,
    sx,
    onChange,
    onBlur,
    onFocus,
    value,
    error,
    type = "text",
    inputProps,
    onClick,
    disabled = false,
    boxSx,
  }) => {
    const handleFocus = () => {
      onFocus?.();
    };

    const handleBlur = () => {
      onBlur?.();
    };

    const handleClick = () => {
      onClick?.();
    };

    const handleOnChange = (value: string | number) => {
      onChange?.(value);
    };

    return (
      <Box sx={{ display: "flex", flexDirection: "column", ...boxSx }}>
        <TextField
          disabled={disabled}
          inputProps={inputProps}
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "#4261af",
              "& fieldset": {
                borderColor: "#4261af",
              },
              "&:hover fieldset": {
                borderColor: "#4261af",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#4261af",
              },
            },
            "& .MuiInputLabel-root": {
              color: "#4261af",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#4261af",
            },
            ...sx,
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={(e) => handleOnChange(e.target.value)}
          onClick={handleClick}
          value={value}
          type={type}
          label={placeholder}
          variant="outlined"
          error={!!error}
          helperText={error}
        />
      </Box>
    );
  }
);
