import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Matter from 'matter-js';

// Get screen dimensions.
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Renderer for the ball (circle).
const Circle = ({ body, size, color }) => {
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
        borderRadius: size[0] / 2,
        backgroundColor: color,
      }}
    />
  );
};

// Renderer for the floor and walls (rectangle).
const Rectangle = ({ body, size, color }) => {
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
};

// PhysicsSystem updates Matter.js engine on each frame.
const PhysicsSystem = (entities, { time }) => {
  Matter.Engine.update(entities.physics.engine, time.delta);
  return entities;
};

// TouchSystem applies a directional force based on touch position.
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

      // If touch is within the ball, calculate a force vector.
      if (distance <= radius) {
        const forceX = ballX - touchX;
        const forceY = ballY - touchY;
        const magnitude = Math.sqrt(forceX * forceX + forceY * forceY);
        const normX = magnitude > 0 ? forceX / magnitude : 0;
        const normY = magnitude > 0 ? forceY / magnitude : 0;
        const forceMagnitude = 0.05; // Tweak this value for sensitivity.

        Matter.Body.applyForce(
          ball.body,
          ball.body.position,
          { x: normX * forceMagnitude, y: normY * forceMagnitude }
        );
      }
    }
  });
  return entities;
};

export default function App() {
  const [running, setRunning] = useState(true);

  // Create a Matter.js engine and world.
  const engine = Matter.Engine.create({ enableSleeping: false });
  const world = engine.world;
  world.gravity.y = 1; // Normal gravity.

  // Create the ball.
  const ball = Matter.Bodies.circle(200, 100, 30, {
    restitution: 0.8,
    label: 'ball',
  });

  // Define floor position a bit above the bottom (leaving space for nav).
  const floorY = SCREEN_HEIGHT - 80; // Adjust this value as needed.
  const floor = Matter.Bodies.rectangle(SCREEN_WIDTH / 2, floorY, SCREEN_WIDTH, 20, {
    isStatic: true,
    label: 'floor',
  });

  // Define wall thickness.
  const wallThickness = 20;
  // Left wall: positioned so that its right edge is flush with the left side.
  const leftWall = Matter.Bodies.rectangle(-wallThickness / 2, SCREEN_HEIGHT / 2, wallThickness, SCREEN_HEIGHT, {
    isStatic: true,
    label: 'leftWall',
  });
  // Right wall: positioned so that its left edge is flush with the right side.
  const rightWall = Matter.Bodies.rectangle(SCREEN_WIDTH + wallThickness / 2, SCREEN_HEIGHT / 2, wallThickness, SCREEN_HEIGHT, {
    isStatic: true,
    label: 'rightWall',
  });

  // Add the bodies to the world.
  Matter.World.add(world, [ball, floor, leftWall, rightWall]);

  // Define the entities for GameEngine.
  const entities = {
    physics: { engine, world },
    ball: { body: ball, size: [60, 60], color: 'green', renderer: Circle },
    floor: { body: floor, size: [SCREEN_WIDTH, 20], color: 'brown', renderer: Rectangle },
    leftWall: { body: leftWall, size: [wallThickness, SCREEN_HEIGHT], color: 'grey', renderer: Rectangle },
    rightWall: { body: rightWall, size: [wallThickness, SCREEN_HEIGHT], color: 'grey', renderer: Rectangle },
  };

  return (
    <View style={styles.container}>
      <GameEngine
        style={styles.gameContainer}
        systems={[PhysicsSystem, TouchSystem]}
        entities={entities}
        running={running}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gameContainer: { flex: 1, backgroundColor: '#fff' },
});
