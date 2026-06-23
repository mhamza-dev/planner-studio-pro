import React, { ReactNode, useState } from "react";

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
}

const Tooltip = ({
  children,
  content,
  side = "right",
}: TooltipProps) => {
  const [visible, setVisible] = useState(false);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}

      {visible && (
        <div
          className={`
            absolute z-50
            ${positionClasses[side]}
            whitespace-nowrap
            rounded-md
            bg-black
            px-2
            py-1
            text-xs
            text-white
            shadow-lg
          `}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
