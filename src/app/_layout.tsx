import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: "Login Page" }} />
            <Stack.Screen name="home" options={{ title: "Home Page" }} />
            <Stack.Screen name="sign-in" options={{ title: "Sign up Page" }} />
        </Stack>
    )
}