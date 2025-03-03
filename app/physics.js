// physics.js
import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import Slider from '@react-native-community/slider';
import { PhysicsContext } from './context/_PhysicsContext';

export default function PhysicsScreen() {
    const {
        gravity, setGravity,
        ballSize, setBallSize,
        friction, setFriction,
        bounciness, setBounciness,
        commitPhysicsChanges
    } = useContext(PhysicsContext);

    // Keep local slider states so changes aren’t immediate in context
    const [localGravity, setLocalGravity] = useState(gravity);
    const [localFriction, setLocalFriction] = useState(friction);
    const [localBounciness, setLocalBounciness] = useState(bounciness);

    const handleOk = () => {
        // Only apply changes to context on OK
        setGravity(localGravity);
        setFriction(localFriction);
        setBounciness(localBounciness);

        // Then increment physicsVersion => re-spawn
        commitPhysicsChanges();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Physics Controls</Text>

            <Text style={styles.label}>Gravity: {localGravity.toFixed(2)}</Text>
            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1}
                step={0.05}
                value={localGravity}
                onValueChange={setLocalGravity}
            />

        

            <Text style={styles.label}>Friction: {localFriction.toFixed(2)}</Text>
            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1}
                step={0.05}
                value={localFriction}
                onValueChange={setLocalFriction}
            />

            <Text style={styles.label}>Bounciness: {localBounciness.toFixed(2)}</Text>
            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1}
                step={0.05}
                value={localBounciness}
                onValueChange={setLocalBounciness}
            />

            <Button title="OK" onPress={handleOk} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, padding: 20,
        justifyContent: 'center',
        backgroundColor: '#f7f7f7'
    },
    header: {
        fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center'
    },
    label: {
        fontSize: 16, marginTop: 10, textAlign: 'center'
    },
    slider: {
        width: 250, height: 40, alignSelf: 'center'
    }
});
