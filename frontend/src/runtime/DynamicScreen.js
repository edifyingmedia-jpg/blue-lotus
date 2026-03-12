import React from "react";
import resolveComponent from "../resolverComponents";

export default function DynamicScreen({ screen }) {
  if (!screen || !screen.components) return null;

  return (
    <>
      {screen.components.map((node, index) => {
        const Component = resolveComponent(node.type);
        if (!Component) return null;

        return <Component key={index} {...node.props} />;
      })}
    </>
  );
}
