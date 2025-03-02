// app/physics.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function PhysicsScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Physics Screen</Text>
            {/* Add your sliders/controls for gravity, velocity, etc. */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    title: { fontSize: 24 },
});
