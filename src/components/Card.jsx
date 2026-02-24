import React from "react";

export function Card({ children, ...rest }) {
  return (
    <section className="card" {...rest}>
      {children}
    </section>
  );
}

