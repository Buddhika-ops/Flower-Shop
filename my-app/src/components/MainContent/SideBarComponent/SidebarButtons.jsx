import React from 'react';

function SidebarButtons(props) {
  return (
    <div>
      <button
        type="button"
        className="flex items-center w-full gap-3 px-4 py-3 text-gray-700 transition-colors duration-300 bg-gray-100 rounded-md hover:bg-gray-300 hover:rounded-md"
        onClick={props.onClick}
        aria-label={props.label}
      >
        <div className="flex items-center justify-center w-6 h-6">
          {/* render icon node if provided (lucide-react), otherwise fallback to img src */}
          {React.isValidElement(props.icon) ? (
            props.icon
          ) : (
            <img src={props.icon} alt={props.label} />
          )}
        </div>
        {props.label}
      </button>
    </div>
  );
}

export default SidebarButtons;
