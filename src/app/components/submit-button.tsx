import { StyleSheet, View, Text, Pressable } from "react-native";

type Props = {
    isDisabled: boolean;
    onPress: () => void;
}

export default function SubmitButton({isDisabled, onPress}: Props) {
    return (
        <View style={styles.buttonContainer}>
            <Pressable style={styles.button} onPress={onPress}>
                <Text style={styles.text}>Submit</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        width: 100,
        height: 50,
        marginTop: 20,
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
        fontFamily: "Sans-serif"
    },
});