import { Text, View, StyleSheet } from "react-native";
import InputBox from "@/app/components/input-box";
import SubmitButton from "@/app/components/submit-button";

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.fieldContainer}>
        <Text>Email</Text>
        <InputBox input="Enter your email"/>
      </View>
      <View style={styles.fieldContainer}>
        <Text>Password</Text>
        <InputBox input="Enter your password"/>
      </View>
      <SubmitButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  fieldContainer: {
    width: "60%",
    maxWidth: 300,
    marginBottom: 16,
  },
});
