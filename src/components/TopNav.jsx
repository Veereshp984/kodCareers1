import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/saved", label: "Saved" },
  { to: "/settings", label: "Settings" }
];

export function TopNav() {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <nav className="topnav">
      <div className="topnav__inner">
        <div className="topnav__brand">Job Notification App</div>
        <button
          type="button"
          className="topnav__toggle"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          <span className="topnav__toggle-icon" aria-hidden="true" />
        </button>
        <div className={`topnav__links${open ? " topnav__links--open" : ""}`}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `topnav__link${isActive ? " topnav__link--active" : ""}`
              }
              onClick={closeMenu}
              end
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}

