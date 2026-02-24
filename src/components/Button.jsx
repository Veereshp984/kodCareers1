import React from "react";

const VARIANTS = {
  primary: "btn btn--primary",
  secondary: "btn btn--secondary"
};

export function Button({ variant = "primary", type = "button", children, ...rest }) {
  const className = VARIANTS[variant] || VARIANTS.primary;

  return (
    <button type={type} className={className} {...rest}>
      {children}
    </button>
  );
}

