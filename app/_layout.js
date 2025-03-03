// // app/_layout.js
// import { Tabs } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";
// import { PhysicsProvider } from './context/_PhysicsContext'; // or the correct relative path


// export default function Layout() {
//     return (
//         <PhysicsProvider>
//         <Tabs
//             screenOptions={({ route }) => ({
//                 tabBarIcon: ({ focused, color, size }) => {
//                     let iconName;
//                     switch (route.name) {
//                         case 'index':
//                             iconName = focused ? 'basketball' : 'basketball-outline';
//                             break;
//                         case 'physics':
//                             iconName = focused ? 'speedometer' : 'speedometer-outline';
//                             break;
//                         case 'appearance':
//                             iconName = focused ? 'color-palette' : 'color-palette-outline';
//                             break;
//                         case 'thankyou':
//                             iconName = focused ? 'heart' : 'heart-outline';
//                             break;
//                         default:
//                             iconName = 'help-circle-outline';
//                     }
//                     return <Ionicons name={iconName} size={size} color={color} />;
//                 },
//             })}
//         >
//             <Tabs.Screen name="index" options={{ title: "Ball" }} />
//             <Tabs.Screen name="physics" options={{ title: "Physics" }} />
//             <Tabs.Screen name="appearance" options={{ title: "Appearance" }} />
//             <Tabs.Screen name="thankyou" options={{ title: "Thank You" }} />
//         </Tabs>
//         </PhysicsProvider>
//     );
// }

// app/_layout.js
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PhysicsProvider } from './context/_PhysicsContext'; // adjust path if needed

export default function Layout() {
    return (
        <PhysicsProvider>
            <Tabs screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    switch (route.name) {
                        case 'index':
                            iconName = focused ? 'basketball' : 'basketball-outline';
                            break;
                        case 'physics':
                            iconName = focused ? 'speedometer' : 'speedometer-outline';
                            break;
                        default:
                            iconName = 'help-circle-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}>
                {/* Our two tabs: index.js for Ball, physics.js for Physics tab */}
                <Tabs.Screen name="index" options={{ title: "Ball" }} />
                <Tabs.Screen name="physics" options={{ title: "Physics" }} />
            </Tabs>
        </PhysicsProvider>
    );
}
