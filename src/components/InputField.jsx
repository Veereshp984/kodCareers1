import React from "react";

export function InputField({
  id,
  label,
  hint,
  type = "text",
  ...rest
}) {
  return (
    <div className="field">
      {label && (
        <label className="field__label" htmlFor={id}>
          {label}
        </label>
      )}
      <input id={id} type={type} className="field__input" {...rest} />
      {hint && <p className="field__hint">{hint}</p>}
    </div>
  );
}

