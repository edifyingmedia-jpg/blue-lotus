import React from "react";

const ScreenContainer = ({
  children,
  scroll = true,
  padding = 20,
  maxWidth = 900,
  center = false,
  background = "transparent",
  safeTop = true,
  safeBottom = true,
  style = {},
  ...props
}) => {
  const containerStyle = {
    width: "100%",
    minHeight: "100vh",
    background,
    display: "flex",
    justifyContent: center ? "center" : "flex-start",
    ...style,
  };

  const innerStyle = {
    width: "100%",
    maxWidth,
    padding,
    paddingTop: safeTop ? padding + 20 : padding,
    paddingBottom: safeBottom ? padding + 20 : padding,
    boxSizing: "border-box",
  };

  if (scroll) {
    return (
      <div style={containerStyle} {...props}>
        <div
          style={{
            ...innerStyle,
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle} {...props}>
      <div style={innerStyle}>{children}</div>
    </div>
  );
};

export default ScreenContainer;
