import React from "react";

const TagList = ({
  tags = [],
  gap = 8,
  direction = "row", // "row" or "column"
  style = {},
  renderTag, // optional custom renderer
  ...props
}) => {
  const baseStyle = {
    display: "flex",
    flexDirection: direction,
    flexWrap: "wrap",
    gap: gap,
    width: "100%",
    ...style,
  };

  return (
    <div style={baseStyle} {...props}>
      {tags.map((tag, i) =>
        renderTag ? (
          renderTag(tag, i)
        ) : (
          <span
            key={i}
            style={{
              padding: "4px 8px",
              borderRadius: 8,
              background: "rgba(255, 255, 255, 0.1)",
              fontSize: 12,
              color: "white",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            {tag}
          </span>
        )
      )}
    </div>
  );
};

export default TagList;
