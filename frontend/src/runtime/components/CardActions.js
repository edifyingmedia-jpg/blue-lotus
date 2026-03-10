import React from "react";

const CardActions = ({
  align = "flex-end",
  gap = 8,
  style = {},
  children,
  ...props
}) => {
  const baseStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: align,
    gap: gap,
    width: "100%",
    paddingTop: 8,
    ...style,
  };

  return (
    <div style={baseStyle} {...props}>
      {children}
    </div>
  );
};

export default CardActions;
