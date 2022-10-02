import React from "react";
import { makeStyles, styled } from "@mui/styles";
import { TextField, TextFieldProps } from "formik-mui";
import { PasswordTextField } from "./PasswordTextField";

const useStyles = makeStyles({
  styling: {
    width: "100%"
  },
  input: {}
});

const CssTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#67A3EE"
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#67A3EE"
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#67A3EE"
    },
    "&:hover fieldset": {
      borderColor: "#67A3EE"
    },
    "&.Mui-focused fieldset": {
      borderColor: "#67A3EE"
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
