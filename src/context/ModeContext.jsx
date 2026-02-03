import React, { useState } from "react";

// Context બનાવ્યું
const ModeContext = React.createContext({
    mode: "light",
    toggleMode: () => {},
});

export const ModeContextProvider = (props) => {
    const [mode, setMode] = useState("light");

    const toggleMode = () => {
        if (mode === "light") {
            setMode("dark");
        } else {
            setMode("light");
        }
    };

    return (
        <ModeContext.Provider value={{ mode: mode, toggleMode: toggleMode }}>
            {props.children}
        </ModeContext.Provider>
    );
};

export default ModeContext;