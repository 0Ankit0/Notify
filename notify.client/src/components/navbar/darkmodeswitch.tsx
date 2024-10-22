import React from "react";
import { useTheme as useNextTheme } from "next-themes";
import { MoonIcon } from "../icons/navbar/moon-icon";
import { SunIcon } from "../icons/navbar/sun-icon";

export const DarkModeSwitch = () => {
  const { setTheme, resolvedTheme } = useNextTheme();

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="p-2 focus:outline-none"
      style={{ background: "none", border: "none" }}
    >
      {resolvedTheme === "dark" ? <MoonIcon /> : <SunIcon />}
    </button>
  );
};
