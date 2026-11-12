import {StyleSheet, View, TextInput} from "react-native";
import { useState } from "react";

type Props = {
    input: string;
    validateUrl: (value: string) => {
        isSafe: boolean;
        sanitizedUrl: string;
    };
    onSubmit: (sanitizedUrl: string) => void;
}

export default function SearchBar({
    input,
    validateUrl,
    onSubmit
}: Props) {
    const [text, setText] = useState<string>("");
    const [isSafe, setIsSafe] = useState<boolean>(false);
    const [sanitizedUrl, setSanitizedUrl] = useState<string>("");

    const handleChange = (value: string) => {
        setText(value);

        const v = validateUrl(value);
        setIsSafe(v.isSafe);
        setSanitizedUrl(v.sanitizedUrl);
    }

    const handleEnterPress = () => {
        if (isSafe) {
            onSubmit(sanitizedUrl);
        }
    }

    return (
        <TextInput 
            style={styles.textContainer} 
            maxLength={2000}
            value={text}
            placeholder={input}
            placeholderTextColor="#000"
            onChangeText={handleChange}
            keyboardType="url"
            onSubmitEditing={handleEnterPress}

            editable={true}
            selectTextOnFocus={false}
        />
    );
}

const styles = StyleSheet.create({
    textContainer: {
        fontFamily: "Sans-serif",
        borderRadius: 10,
        padding: 5,
        borderColor: "#000",
        borderWidth: 2,
        width: "100%",
        color: "#000",
        height: 40,
    },
});