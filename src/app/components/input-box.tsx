import { useState } from "react";
import { TextInput, StyleSheet } from "react-native";

type Props = {
    input: string;
}

export default function InputBox({input}: Props) {
    const [text, onChangeText] = useState<string>("");
 
    return (
        <TextInput
            style={styles.textBox}
            onChangeText={onChangeText}
            placeholder={input}
            placeholderTextColor={"#000"}
            maxLength={40}
        />
    );
}

const styles = StyleSheet.create({
    textBox: {
        padding: 5,
        borderColor: "#000",
        borderWidth: 2,
        margin: 10,
        width: 250,
        color: "#000",
        height: 40,
    }
});