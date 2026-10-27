import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";

export default function RootLayout() {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        async function checkSession() {
            try {
                const token = await AsyncStorage.getItem("userToken");
                
                const currentSegment = segments[0] as any;

                if (token && (!currentSegment || currentSegment === "index")) {
                    router.replace("/home");
                }
            } catch (e) {
                console.error("Failed to load session", e);
            } finally {
                setIsLoading(false);
            }
        }

        checkSession();
    }, [segments]);

    if (isLoading) {
        return (
            <View style={{ 
                flex: 1, 
                justifyContent: "center", 
                alignItems: "center", 
                backgroundColor: "#a29bfe" 
            }}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    return (
        <Stack
            screenOptions={{
                headerShown: false,     
            }} 
        >
            <Stack.Screen name="index" options={{ title: "Login Page" }}/>
            <Stack.Screen name="home" options={{ title: "Home Page" }}/>
            <Stack.Screen name="sign-in" options={{ title: "Sign up Page" }}/>
        </Stack>
    );
}