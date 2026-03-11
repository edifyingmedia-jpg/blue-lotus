import React from 'react';

const BuilderSkeleton = () => {
  const containerStyle = {
    display: 'flex',
    width: '100%',
    height: '100vh',
  };

  const sidebarStyle = {
    width: '20%',
    borderRight: '1px solid #ccc',
    padding: '1rem',
    boxSizing: 'border-box',
  };

  const canvasStyle = {
    flexGrow: 1,
    padding: '1rem',
    boxSizing: 'border-box',
    textAlign: 'center',
  };

  const rightSidebarStyle = {
    width: '20%',
    borderLeft: '1px solid #ccc',
    padding: '1rem',
    boxSizing: 'border-box',
  };

  return (
    <div style={containerStyle}>
      <div style={sidebarStyle}>
        <h2>Components</h2>
      </div>
      <div style={canvasStyle}>
        <h2>Canvas</h2>
      </div>
      <div style={rightSidebarStyle}>
        <h2>Properties</h2>
      </div>
    </div>
  );
};

export default BuilderSkeleton;
