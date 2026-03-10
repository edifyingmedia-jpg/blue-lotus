import React, { useState, useRef, useEffect } from "react";

const Menu = ({
  items = [], // [{ label, onClick, danger }]
  width = 180,
  radius = 10,
  background = "rgba(0,0,0,0.85)",
  color = "white",
  separatorColor = "rgba(255,255,255,0.1)",
  style = {},
  trigger, // element to click to open
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const toggle = () => setOpen(!open);

  // Close when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const containerStyle = {
    position: "relative",
    display: "inline-block",
    ...style,
  };

  const menuStyle = {
    position: "absolute",
    top: "100%",
    right: 0,
    width,
    marginTop: 8,
    background,
    borderRadius: radius,
    padding: 8,
    boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
    zIndex: 1000,
  };

  const itemStyle = (danger) => ({
    padding: "8px 12px",
    borderRadius: radius - 4,
    cursor: "pointer",
    color: danger ? "red" : color,
    background: "transparent",
    transition: "background 0.15s ease",
  });

  const itemHover = {
    background: "rgba(255,255,255,0.08)",
  };

  return (
    <div style={containerStyle} ref={ref} {...props}>
      <div onClick={toggle}>{trigger}</div>

      {open && (
        <div style={menuStyle}>
          {items.map((item, i) => {
            if (item === "separator") {
              return (
                <div
                  key={i}
                  style={{
                    height: 1,
                    background: separatorColor,
                    margin: "6px 0",
                  }}
                />
              );
            }

            return (
              <div
                key={i}
                style={itemStyle(item.danger)}
                onClick={() => {
                  setOpen(false);
                  item.onClick && item.onClick();
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = itemHover.background)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                {item.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Menu;
