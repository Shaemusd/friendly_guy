// _AppearanceContext.js
import React, { createContext, useState } from 'react';

export const AppearanceContext = createContext();

export function AppearanceProvider({ children }) {
    // The final (committed) values the Ball screen will use:
    const [ballColor, setBallColor] = useState('#00ff00');
    const [backgroundColor, setBackgroundColor] = useState('#ffffff');
    const [faceIndex, setFaceIndex] = useState(0);

    return (
        <AppearanceContext.Provider value={{
            ballColor, setBallColor,
            backgroundColor, setBackgroundColor,
            faceIndex, setFaceIndex
        }}>
            {children}
        </AppearanceContext.Provider>
    );
}
