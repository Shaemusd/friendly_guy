// _PhysicsContext.js
import React, { createContext, useState } from 'react';

export const PhysicsContext = createContext();

export function PhysicsProvider({ children }) {
    // Committed values that BallScreen will actually use
    const [gravity, setGravity] = useState(0.65);
    const [ballSize, setBallSize] = useState(100);
    const [friction, setFriction] = useState(0.2);
    const [bounciness, setBounciness] = useState(0.8);

    // Start at 1 => ensures an initial spawn
    const [physicsVersion, setPhysicsVersion] = useState(1);

    function commitPhysicsChanges() {
        setPhysicsVersion(prev => prev + 1);
    }

    return (
        <PhysicsContext.Provider
            value={{
                gravity, setGravity,
                ballSize, setBallSize,
                friction, setFriction,
                bounciness, setBounciness,
                physicsVersion,
                commitPhysicsChanges,
                    physicsVersion,
                // you might also export a commit function that increments it:
                commitPhysicsChanges: () => setPhysicsVersion(prev => prev + 1),

            }}
        >
            {children}
        </PhysicsContext.Provider>
    );
}
