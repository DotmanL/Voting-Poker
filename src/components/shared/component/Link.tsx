import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Link as UILink, LinkProps as UILinkProps } from "@mui/material";

type LinkProps = {
  to: string;
} & UILinkProps;

export const Link: React.FC<LinkProps> = ({
  children,
  className,
  ...props
}) => (
  <UILink
    style={{ margin: "0px 0px", textDecoration: "none" }}
    component={RouterLink}
    className={className}
    {...props}
  >
    {children}
  </UILink>
);
