import { Text, View, StyleSheet } from "react-native";
import InputBox from "@/app/components/input-box";
import SubmitButton from "@/app/components/submit-button";
import { Link } from "expo-router";

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Log In</Text>
        <View style={styles.fieldContainer}>
          <Text style={styles.text}>Email</Text>
          <InputBox input="Enter your email"/>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.text}>Password</Text>
          <InputBox input="Enter your password"/>
        </View>
        <View>
          <Link href="/sign-in" style={styles.button}>
            Sign up
          </Link>
        </View>
        <SubmitButton />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#a29bfe",
    alignItems: "center",
    justifyContent: "center",
  },
  loginContainer: {
    width: "90%",
    height: "70%",
    maxWidth: 500,
    maxHeight: 800,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  fieldContainer: {
    width: "70%",
    maxWidth: 300,
    marginBottom: 16,
  },
  loginText: {
    marginBottom: "20%",
    fontFamily: "Sans serif",
    fontSize: 36,
    fontWeight: "bold",
  },
  text: {
    color: "#000",
    fontFamily: "Sans-serif",
  },
  button: {
    fontSize: 14,
    fontFamily: "Sans serif",
    textDecorationLine: "underline",
    color: "#000",
  },
});
