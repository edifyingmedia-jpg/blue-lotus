import React from "react";

const ListItem = ({
  title = "",
  subtitle = "",
  left = null,
  right = null,
  gap = 12,
  padding = 12,
  style = {},
  ...props
}) => {
  const containerStyle = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: padding,
    gap: gap,
    width: "100%",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    ...style,
  };

  const textStyle = {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  };

  const titleStyle = {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  };

  const subtitleStyle = {
    fontSize: 13,
    opacity: 0.7,
    color: "white",
  };

  return (
    <div style={containerStyle} {...props}>
      {left && <div>{left}</div>}

      <div style={textStyle}>
        {title && <div style={titleStyle}>{title}</div>}
        {subtitle && <div style={subtitleStyle}>{subtitle}</div>}
      </div>

      {right && <div>{right}</div>}
    </div>
  );
};

export default ListItem;
