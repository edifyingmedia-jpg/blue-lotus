import React from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function BuilderLayout({ children }) {
  return (
    <div className="builder-layout">
      <TopBar />
      <div className="builder-body">
        <Sidebar />
        <div className="builder-content">
          {children}
        </div>
      </div>
    </div>
  );
}
