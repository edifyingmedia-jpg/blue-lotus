import React from 'react';

const BuilderSkeleton = () => {
  const containerStyle = {
    display: 'flex',
    width: '100%',
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: '#0a0a0a',
  };

  const sidebarStyle = {
    width: '340px',
    minWidth: '340px',
    backgroundColor: '#111111',
    boxShadow: '0 0 10px 2px rgba(0,255,255,0.4), 0 0 20px 4px rgba(128,0,128,0.3), 0 0 30px 6px rgba(255,105,180,0.2)',
    color: '#ffffff',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
  };

  const workspaceStyle = {
    flexGrow: 1,
    backgroundColor: '#0a0a0a',
    color: '#ffffff',
    padding: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div style={containerStyle}>
      <aside style={sidebarStyle}>
        {/* Sidebar content */}
      </aside>
      <main style={workspaceStyle}>
        {/* Workspace content */}
      </main>
    </div>
  );
};

export default BuilderSkeleton;
