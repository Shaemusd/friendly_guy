// app/ball.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, AppState, Dimensions } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Matter from 'matter-js';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const Circle = ({ body, size, color }) => {
    const x = body.position.x - size[0] / 2;
    const y = body.position.y - size[1] / 2;
    return (
        <View style={{ position: 'absolute', left: x, top: y, width: size[0], height: size[1], borderRadius: size[0] / 2, backgroundColor: color }} />
    );
};

const Rectangle = ({ body, size, color }) => {
    const x = body.position.x - size[0] / 2;
    const y = body.position.y - size[1] / 2;
    return (
        <View style={{ position: 'absolute', left: x, top: y, width: size[0], height: size[1], backgroundColor: color }} />
    );
};

const PhysicsSystem = (entities, { time }) => {
    Matter.Engine.update(entities.physics.engine, time.delta);
    return entities;
};

const TouchSystem = (entities, { touches }) => {
    touches.filter(t => t.type === 'press').forEach(t => {
        const ball = entities.ball;
        if (ball && ball.body) {
            const touchX = t.event.pageX;
            const touchY = t.event.pageY;
            const ballX = ball.body.position.x;
            const ballY = ball.body.position.y;
            const radius = ball.size[0] / 2;

            const dx = touchX - ballX;
            const dy = touchY - ballY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= radius) {
                const forceX = ballX - touchX;
                const forceY = ballY - touchY;
                const magnitude = Math.sqrt(forceX * forceX + forceY * forceY);
                const normX = magnitude > 0 ? forceX / magnitude : 0;
                const normY = magnitude > 0 ? forceY / magnitude : 0;
                const forceMagnitude = 0.05;
                Matter.Body.applyForce(ball.body, ball.body.position, { x: normX * forceMagnitude, y: normY * forceMagnitude });
            }
        }
    });
    return entities;
};

export default function BallScreen() {
    const [running, setRunning] = useState(true);
    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            setRunning(nextAppState === 'active');
        });
        return () => subscription.remove();
    }, []);

    const engine = Matter.Engine.create({ enableSleeping: false });
    const world = engine.world;
    world.gravity.y = 0.25;

    const ball = Matter.Bodies.circle(200, 100, 50, { restitution: 0.8, label: 'ball' });
    const floorY = SCREEN_HEIGHT - 80;
    const floor = Matter.Bodies.rectangle(SCREEN_WIDTH / 2, floorY, SCREEN_WIDTH, 20, { isStatic: true, label: 'floor' });
    const wallThickness = 20;
    const leftWall = Matter.Bodies.rectangle(-wallThickness / 2, SCREEN_HEIGHT / 2, wallThickness, SCREEN_HEIGHT, { isStatic: true, label: 'leftWall' });
    const rightWall = Matter.Bodies.rectangle(SCREEN_WIDTH + wallThickness / 2, SCREEN_HEIGHT / 2, wallThickness, SCREEN_HEIGHT, { isStatic: true, label: 'rightWall' });

    Matter.World.add(world, [ball, floor, leftWall, rightWall]);

    const entities = {
        physics: { engine, world },
        ball: { body: ball, size: [100, 100], color: 'green', renderer: Circle },
        floor: { body: floor, size: [SCREEN_WIDTH, 20], color: 'brown', renderer: Rectangle },
        leftWall: { body: leftWall, size: [wallThickness, SCREEN_HEIGHT], color: 'grey', renderer: Rectangle },
        rightWall: { body: rightWall, size: [wallThickness, SCREEN_HEIGHT], color: 'grey', renderer: Rectangle },
    };

    return (
        <View style={styles.container}>
            <GameEngine style={styles.gameContainer} systems={[PhysicsSystem, TouchSystem]} entities={entities} running={running} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    gameContainer: { flex: 1, backgroundColor: '#fff' },
});
