import React from "react";
import { TextField, TextFieldProps } from "formik-mui";
import { PasswordTextField } from "./PasswordTextField";
import { makeStyles, styled } from "@mui/styles";

const useStyles = makeStyles({
  styling: {
    width: "100%"
  },
  input: {}
});

const CssTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#5B93D9"
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#5B93D9"
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    "& fieldset": {
      borderColor: "rgba(128, 128, 128, 0.3)",
      borderWidth: "1.5px"
    },
    "&:hover fieldset": {
      borderColor: "#5B93D9"
    },
    "&.Mui-focused fieldset": {
      borderColor: "#5B93D9",
      boxShadow: "0 0 0 3px rgba(91, 147, 217, 0.12)"
    }
  }
});

type InputProps = TextFieldProps;

export const InputTextField: React.FC<InputProps> = ({
  className,
  ...props
}) => {
  const classes = useStyles();
  const fieldProps = {
    ...props,
    className: `${classes.styling} ${className}`
  };

  const passwordFieldProps = {
    ...props,
    className: `${classes.input}`
  };

  if (props.type === "password") {
    return <PasswordTextField {...passwordFieldProps} />;
  }

  return <CssTextField {...fieldProps} />;
};
