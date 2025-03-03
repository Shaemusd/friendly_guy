// app/index.js (BallScreen)
import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, AppState, Dimensions } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Matter from 'matter-js';
import { PhysicsContext } from './context/_PhysicsContext.js'; // Import from your actual path
import { AppearanceContext } from './context/_PhysicsContext.js'; // Import from your actual path

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function BallScreen() {
    // 1) Read physics parameters from context
    const { gravity, ballSize, friction, bounciness } = useContext(PhysicsContext);

    // Keep your existing state for running + container offset
    const [running, setRunning] = useState(true);
    const [containerOffsetY, setContainerOffsetY] = useState(0);

    console.log('BallScreen context:', { gravity, ballSize, friction, bounciness });


    // Listen for app state changes
    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            setRunning(nextAppState === 'active');
        });
        return () => subscription.remove();
    }, []);


    
    // 2) Create or recreate the engine & world
    const [engine] = useState(() => Matter.Engine.create({ enableSleeping: false }));
    const [world] = useState(() => engine.world);

    // Apply context-based gravity
    world.gravity.y = gravity;

    // 3) Create the ball with context-based size, friction, bounciness
    const ballRadius = ballSize / 2;
    const ball = Matter.Bodies.circle(200, 100, ballRadius, {
        label: 'ball',
        restitution: bounciness, // "bounciness" from context
        friction: friction,      // friction from context
    });

    // 4) Create floor, walls, etc.
    const floorHeight = 50;
    const floorY = SCREEN_HEIGHT - 80 - (floorHeight / 2) - 20;
    const floor = Matter.Bodies.rectangle(
        SCREEN_WIDTH / 2,
        floorY,
        SCREEN_WIDTH,
        floorHeight,
        { isStatic: true, label: 'floor' }
    );

    const wallThickness = 20;
    const leftWall = Matter.Bodies.rectangle(
        -wallThickness / 2,
        SCREEN_HEIGHT / 2,
        wallThickness,
        SCREEN_HEIGHT,
        { isStatic: true, label: 'leftWall' }
    );
    const rightWall = Matter.Bodies.rectangle(
        SCREEN_WIDTH + wallThickness / 2,
        SCREEN_HEIGHT / 2,
        wallThickness,
        SCREEN_HEIGHT,
        { isStatic: true, label: 'rightWall' }
    );

    // Add everything to the world
    Matter.World.add(world, [ball, floor, leftWall, rightWall]);

    // 5) Build your entities object
    const entities = {
        physics: { engine, world },
        ball: {
            body: ball,
            size: [ballSize, ballSize],
            color: 'green',
            renderer: Circle
        },
        floor: {
            body: floor,
            size: [SCREEN_WIDTH, floorHeight],
            color: 'brown',
            renderer: Rectangle
        },
        leftWall: {
            body: leftWall,
            size: [wallThickness, SCREEN_HEIGHT],
            color: 'grey',
            renderer: Rectangle
        },
        rightWall: {
            body: rightWall,
            size: [wallThickness, SCREEN_HEIGHT],
            color: 'grey',
            renderer: Rectangle
        },
    };



    
    // 6) Render the GameEngine as before
    return (
        <View style={styles.container}>
            <View
                style={{ flex: 1 }}
                onLayout={(event) => {
                    const { y } = event.nativeEvent.layout;
                    console.log('Container layout Y offset:', y);
                    setContainerOffsetY(y);
                }}
            >
                <GameEngine
                    style={styles.gameContainer}
                    systems={[
                        (entities, args) => PhysicsSystem(entities, args),
                        (entities, args) => TouchSystem(entities, args, containerOffsetY)
                    ]}
                    entities={entities}
                    running={running}
                />
            </View>
        </View>
    );
}








// The same Circle, Rectangle, PhysicsSystem, TouchSystem
function Circle({ body, size, color }) {
    const x = body.position.x - size[0] / 2;
    const y = body.position.y - size[1] / 2;
    return (
        <View style={{
            position: 'absolute',
            left: x,
            top: y,
            width: size[0],
            height: size[1],
            borderRadius: size[0] / 2,
            backgroundColor: color
        }} />
    );
}
function Rectangle({ body, size, color }) {
    const x = body.position.x - size[0] / 2;
    const y = body.position.y - size[1] / 2;
    return (
        <View
            style={{
                position: 'absolute',
                left: x,
                top: y,
                width: size[0],
                height: size[1],
                backgroundColor: color,
            }}
        />
    );
}

function PhysicsSystem(entities, { time }) {
    if (!entities.physics) return entities;
    Matter.Engine.update(entities.physics.engine, time.delta);
    return entities;
}

// The “touchy function” remains
function TouchSystem(entities, { touches }, offsetY) {
    const knownOffset = 75;
    touches.filter(t => t.type === 'press').forEach(t => {
        const ball = entities.ball;
        if (ball && ball.body) {
            const touchX = t.event.pageX;
            const touchY = t.event.pageY - offsetY - knownOffset;

            const ballX = ball.body.position.x;
            const ballY = ball.body.position.y;

            const dx = touchX - ballX;
            const dy = touchY - ballY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= ball.size[0] / 2) {
                const forceX = ballX - touchX;
                const forceY = ballY - touchY;
                const magnitude = Math.sqrt(forceX * forceX + forceY * forceY);
                const normX = magnitude > 0 ? forceX / magnitude : 0;
                const normY = magnitude > 0 ? forceY / magnitude : 0;
                const forceMagnitude = 0.2;
                Matter.Body.applyForce(
                    ball.body,
                    ball.body.position,
                    { x: normX * forceMagnitude, y: normY * forceMagnitude }
                );
            }
        }
    });
    return entities;
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    gameContainer: { flex: 1, backgroundColor: '#fff' },
});


