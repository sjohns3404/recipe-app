import { useState } from "react";
import { Text, TextInput, StyleSheet } from "react-native";

type Props = {
    input: string;
    secureTextEntry?: boolean;
    pattern?: RegExp;
    errorMessage?: string;
    onChangeValidation?: (isValid: boolean, text: string) => void;
};

export default function InputBox({
    input,
    secureTextEntry = false,
    pattern,
    errorMessage = "",
    onChangeValidation
}: Props) {
    const [text, onChangeText] = useState<string>("");
    const [isValid, setIsValid] = useState<boolean>(false);
    const [isTouched, setIsTouched] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string>("");

    

    const handleChange = (value: string) => {
        // On first letter typed set red border to true
        if (!isTouched) {
            setIsTouched(true); 
        }

        onChangeText(value);

        // Evaluate regex pattern if provided
        const validPattern = pattern ? (value.length > 0 && pattern.test(value)) : true;
        setIsValid(validPattern);

        if (validPattern) {
            setErrorMsg("");
        } else {
            setErrorMsg(errorMessage);
        }

        // Pass validity status and current text back to LoginScreen
        if (onChangeValidation) {
            onChangeValidation(validPattern, value);
        }
    };

    const showErrorBorder = !isValid && isTouched;
 
    return (
        <>
            <TextInput
                style={[
                    styles.textContainer,
                    showErrorBorder && styles.errorBorder
                ]}
                onChangeText={handleChange}
                value={text}
                placeholder={input}
                placeholderTextColor={"#000"}
                maxLength={40}
                secureTextEntry={secureTextEntry}
            />
            <Text style={styles.errorText}>{errorMsg}</Text>
        </>
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
    errorBorder: {
        borderColor: "#db4b4b",
    },
    errorText: {
        color: "#db4b4b",
        fontFamily: "Sans-serif",
        fontSize: 12,
    }
});