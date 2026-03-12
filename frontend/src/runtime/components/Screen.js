import React, { useEffect } from "react";
import ScreenContainer from "./components/ScreenContainer";
import useActionHandler from "./engine/useActionHandler";
import resolveComponent from "./engine/resolveComponent";

const Screen = ({
  screen,
  data = {},
  onEvent = () => {},
  style = {},
  ...props
}) => {
  if (!screen) return null;

  const handleAction = useActionHandler(screen.action);

  // Run screen-level action on mount
  useEffect(() => {
    if (screen.action) handleAction();
  }, [screen]);

  const renderComponent = (component, index) => {
    const Resolved = resolveComponent(component.type);
    if (!Resolved) {
      console.warn("Unknown component type:", component.type);
      return null;
    }

    return (
      <Resolved
        key={index}
        {...component.props}
        data={data}
        onEvent={onEvent}
      />
    );
  };

  return (
    <ScreenContainer
      padding={screen.padding ?? 20}
      scroll={screen.scroll ?? true}
      background={screen.background ?? "transparent"}
      style={style}
      {...props}
    >
      {Array.isArray(screen.components) &&
        screen.components.map(renderComponent)}
    </ScreenContainer>
  );
};

export default Screen;
