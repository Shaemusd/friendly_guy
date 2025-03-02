// app/appearance.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function AppearanceScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Appearance Screen</Text>
            {/* Add controls for ball size, color, and navigation to face selection/details */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    title: { fontSize: 24 },
});
