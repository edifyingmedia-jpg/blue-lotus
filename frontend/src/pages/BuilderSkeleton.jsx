import React from 'react';

const BuilderSkeleton = () => {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Left sidebar */}
      <div
        style={{
          width: '20%',
          borderRight: '1px solid #ccc',
          padding: '1rem',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <h2>Components</h2>
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            border: '1px solid #eee',
            padding: '0.5rem',
          }}
        >
          {/* Scrollable list container */}
        </div>
      </div>
      {/* Center canvas area */}
      <div
        style={{
          flex: 1,
          padding: '1rem',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <h2>Canvas</h2>
        <div
          style={{
            flex: 1,
            border: '1px dashed #aaa',
            marginTop: '0.5rem',
            padding: '1rem',
          }}
        >
          {/* Canvas preview region */}
        </div>
      </div>
      {/* Right sidebar */}
      <div
        style={{
          width: '25%',
          borderLeft: '1px solid #ccc',
          padding: '1rem',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <h2>Properties</h2>
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            border: '1px solid #eee',
            padding: '0.5rem',
          }}
        >
          {/* Scrollable properties panel */}
        </div>
      </div>
    </div>
  );
};

export default BuilderSkeleton;

