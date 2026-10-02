import { StyleSheet, View, Text, Pressable } from "react-native";

export default function SubmitButton() {
    return (
        <View style={styles.buttonContainer}>
            <Pressable style={styles.button} onPress={() => alert("Submitted")}>
                <Text style={styles.text}>Submit</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        marginTop: 35,
        width: 100,
        height: 50,
        marginHorizontal: 20,
        alignContent: "center",
        justifyContent: "center",
    },
    button: {
        backgroundColor: "#f9ca24",
        borderRadius: 12,
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
    },
    text: {
        color: "#fff",
        fontSize: 18,
        fontFamily: "Monospace"
    },
});