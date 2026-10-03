import { Text, View, StyleSheet } from "react-native";
import { useState } from "react";
import InputBox from "@/app/components/input-box";
import SubmitButton from "@/app/components/submit-button";
import { Link } from "expo-router";

export default function LoginScreen() {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9\-]+\.[a-zA-Z]{2,}$/;
  const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const [togglePassword, setTogglePassword] = useState<boolean>(true);
  const [passwordReqs, showPasswordReqs] = useState<boolean>(false);

  // Function to receive Validation change and do something with it idk yet
  const handleEmailValidation = (isValid: boolean, text: string) => {
    if (isValid) { console.log(text); }
  }

  // Will be used when I implement show password option
  function toggleShowPassword(showPassword: boolean) {
    setTogglePassword(!showPassword);
  }

  return (
    <View style={styles.container}>
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Log In</Text>
        <View style={styles.fieldContainer}>
          <Text style={styles.text}>Email</Text>
          <InputBox 
            pattern={emailPattern} 
            input="Enter your email"
            onChangeValidation={handleEmailValidation}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.text}>Password</Text>
          <InputBox
            pattern={passwordPattern}
            secureTextEntry={togglePassword}
            input="Enter your password"
            errorMessage="Password needs at least 8 characters, a capital letter, a number, and special character."
          />
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
    marginBottom: "5%",
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
