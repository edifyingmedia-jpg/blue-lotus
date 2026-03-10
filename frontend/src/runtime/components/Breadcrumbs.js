import React from "react";

const Breadcrumbs = ({
  items = [], // [{ label: "Home", onClick: () => {} }]
  separator = "›",
  color = "white",
  activeColor = "cyan",
  gap = 8,
  style = {},
  ...props
}) => {
  const containerStyle = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: gap,
    width: "100%",
    fontSize: 14,
    ...style,
  };

  const itemStyle = (isLast) => ({
    cursor: isLast ? "default" : "pointer",
    color: isLast ? activeColor : color,
    opacity: isLast ? 1 : 0.8,
    transition: "opacity 0.2s ease",
  });

  const sepStyle = {
    opacity: 0.5,
    color,
  };

  return (
    <div style={containerStyle} {...props}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;

        return (
          <React.Fragment key={i}>
            <span
              style={itemStyle(isLast)}
              onClick={!isLast ? item.onClick : undefined}
            >
              {item.label}
            </span>

            {!isLast && <span style={sepStyle}>{separator}</span>}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Breadcrumbs;
