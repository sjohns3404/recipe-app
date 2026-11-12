import {StyleSheet, View, TextInput} from "react-native";

type Props = {
    input: string;
    safeURL: boolean;
    pattern?: RegExp;
    onSearch: () => void;
}

export default function SearchBar({
    input,
    safeURL = false,
    pattern,
    onSearch
}: Props) {
    return (
        <TextInput style={styles.textContiner}></TextInput>
    );
}

const styles = StyleSheet.create({
    textContiner: {
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