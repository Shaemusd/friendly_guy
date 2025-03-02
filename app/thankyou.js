// app/thankyou.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ThankYouScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Thank You!</Text>
            <Text>Thanks for playing my app.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    title: { fontSize: 24 },
});
