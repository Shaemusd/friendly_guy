// app/appearance.js
import React, { useState, useContext } from 'react';
import { View, Text, Button } from 'react-native';
import { AppearanceContext } from './context/_AppearanceContext';


export default function AppearanceScreen() {
    // local states for color picks
    const [localBallColor, setLocalBallColor] = useState('#00ff00');
    const [localBackgroundColor, setLocalBackgroundColor] = useState('#ffffff');
    const [localFaceIndex, setLocalFaceIndex] = useState(0);

    // read the setters from context
    const {
        setBallColor,
        setBackgroundColor,
        setFaceIndex,
        // etc. if you have a commit function or anything else
    } = useContext(AppearanceContext);

    // 1) Add this function:
    const handleOK = () => {
        // copies the local user picks into the context
        setBallColor(localBallColor);
        setBackgroundColor(localBackgroundColor);
        setFaceIndex(localFaceIndex);
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Appearance Settings</Text>

            <Text>Pick Ball Color</Text>
            <Button title="Green Ball" onPress={() => setLocalBallColor('#00ff00')} />
            <Button title="Blue Ball" onPress={() => setLocalBallColor('#0000ff')} />
            <Button title="Red Ball" onPress={() => setLocalBallColor('#ff0000')} />

            <Text>Pick Background Color</Text>
            <Button title="White BG" onPress={() => setLocalBackgroundColor('#ffffff')} />
            <Button title="Gray BG" onPress={() => setLocalBackgroundColor('#cccccc')} />
            <Button title="Black BG" onPress={() => setLocalBackgroundColor('#000000')} />

            <Text>Pick a Face</Text>
            <Button title="Face 0" onPress={() => setLocalFaceIndex(0)} />
            <Button title="Face 1" onPress={() => setLocalFaceIndex(1)} />
            <Button title="Face 2" onPress={() => setLocalFaceIndex(2)} />

            <Button title="OK" onPress={handleOK} />
        </View>
    );
}
