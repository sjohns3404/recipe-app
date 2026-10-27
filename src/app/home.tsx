import { Text, View, StyleSheet } from "react-native";
import { useState } from "react";

export default function HomeScreen() {
    const [recipes, setRecipes] = useState([]);

    return (
        <View style={styles.container}>
            <Text>You have no recipes yet</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
})