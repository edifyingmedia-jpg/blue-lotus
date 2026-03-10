// frontend/src/runtime/components/UI/Buttons.jsx

import React from "react";

const baseClasses =
  "px-4 py-2 rounded-md font-medium transition-all duration-200 cursor-pointer";

export const PrimaryButton = ({ label, onClick }) => (
  <button
    className={`${baseClasses} bg-cyan-500 hover:bg-cyan-400 text-black`}
    onClick={onClick}
  >
    {label}
  </button>
);

export const SecondaryButton = ({ label, onClick }) => (
  <button
    className={`${baseClasses} bg-slate-700 hover:bg-slate-600 text-white`}
    onClick={onClick}
  >
    {label}
  </button>
);

export const GhostButton = ({ label, onClick }) => (
  <button
    className={`${baseClasses} border border-cyan-400 text-cyan-300 hover:bg-cyan-900/30`}
    onClick={onClick}
  >
    {label}
  </button>
);

export const DangerButton = ({ label, onClick }) => (
  <button
    className={`${baseClasses} bg-red-500 hover:bg-red-400 text-white`}
    onClick={onClick}
  >
    {label}
  </button>
);

export default {
  PrimaryButton,
  SecondaryButton,
  GhostButton,
  DangerButton,
};
