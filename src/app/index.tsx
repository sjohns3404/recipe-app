import { Text, View, StyleSheet } from "react-native";
import InputBox from "@/app/components/input-box";

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <InputBox input="Enter your email"/>
      <InputBox input="Enter your password"/>
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
});
