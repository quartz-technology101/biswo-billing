import React, { useMemo } from "react";
import { motion } from "framer-motion";

function Button(props) {
  const {
    children,
    size = "",
    block = false,
    half = false,
    outlined = false,
    secondary = false,
    success = false,
    danger = false,
    changeColor = false,
    disabled = false,
    roundedSmall = false,
    active = false,
    inActive = false,
  } = props;

  const buttonClasses = useMemo(() => {
    let defaultClasses =
      "rounded-lg font-title text-white flex flex-row items-center justify-center";

    if (block) {
      defaultClasses += " block w-full ";
    }

    if (half) {
      defaultClasses += " w-1/2 ";
    }

    if (roundedSmall) {
      defaultClasses +=
        " rounded-lg h-8 px-2 text-[12px] sm:text-sm sm:h-9 sm:px-4 ";
    }

    if (disabled) {
      defaultClasses += " opacity-50 cursor-not-allowed ";
    }

    if (active) {
      defaultClasses += " opacity-100 cursor-not-allowed ";
    }

    if (inActive) {
      defaultClasses += " opacity-50 cursor-pointer ";
    }

    if (size === "sm") {
      defaultClasses += " text-sm h-8 px-2 ";
    } else {
      defaultClasses += " h-12 px-4 ";
    }

    if (outlined) {
      if (secondary) {
        defaultClasses += " border-gray-400 border text-gray-600";
      } else if (success) {
        defaultClasses += " border-green-600 border text-green-500";
      } else if (danger) {
        defaultClasses += " border-red-500 border text-red-500";
      } else
        defaultClasses +=
          " primary-self-text border-[rgb(15 78 128 / 83%)] border ";
    } else {
      if (secondary) {
        defaultClasses += " bg-gray-400 ";
      } else if (success) {
        defaultClasses += " bg-green-600 ";
      } else if (danger) {
        defaultClasses += " bg-red-500 ";
      } else if (changeColor) {
        defaultClasses += ` bg-[${changeColor}] `;
      } else defaultClasses += " primary-background-color ";
    }

    return defaultClasses;
  }, [
    block,
    danger,
    outlined,
    secondary,
    size,
    success,
    changeColor,
    half,
    disabled,
    roundedSmall,
    active,
    inActive,
  ]);

  return (
    <motion.button
      whileHover={{
        scale: size === "sm" ? 1.02 : 1.04,
        transition: {
          type: "spring",
          damping: 15,
          duration: 0.1,
        },
      }}
      whileTap={{ scale: 0.9 }}
      type="button"
      className={buttonClasses}
      style={changeColor ? { backgroundColor: changeColor } : {}}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export default Button;
