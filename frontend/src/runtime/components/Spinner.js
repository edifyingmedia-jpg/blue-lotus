import React, { useEffect } from "react";
import useActionHandler from "../engine/useActionHandler";

const Spinner = ({
  size = "32px",
  thickness = "3px",
  color = "#7f5af0",
  speed = "0.8s",
  className = "",
  style = {},
  action,
}) => {
  const handleAction = useActionHandler(action);

  // Trigger action when spinner mounts (loading started)
  useEffect(() => {
    if (action) handleAction();
  }, []);

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        border: `${thickness} solid rgba(255,255,255,0.15)`,
        borderTop: `${thickness} solid ${color}`,
        borderRadius: "50%",
        animation: `spin ${speed} linear infinite`,
        ...style,
      }}
    >
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Spinner;
