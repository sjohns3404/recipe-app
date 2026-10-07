import { Text, View, StyleSheet } from "react-native";
import { useState } from "react";
import InputBox from "@/app/components/input-box";
import SubmitButton from "@/app/components/submit-button";
import { Link } from "expo-router";

const API_URL = "http://192.168.1.25:8000/login/";

export default function LoginScreen() {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9\-]+\.[a-zA-Z]{2,}$/;
  const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const [togglePassword, setTogglePassword] = useState<boolean>(true);

  // State for email and password values and validity
  const [emailData, setEmailData] = useState({text: "", isValid: false});
  const [passwordData, setPasswordData] = useState({text: "", isValid: false});
  
  const [failedCredentials, setFailedCredentials] = useState<string>("");


  // Function to receive Validation change and do something with it idk yet
  const handleEmailValidation = (isValid: boolean, text: string) => {
    setEmailData({isValid, text});
  }

  const handlePasswordValidation = (isValid: boolean, text: string) => {
    setPasswordData({isValid, text});
  }

  const isDataValid = passwordData.isValid && emailData.isValid;

  // Will be used when I implement show password option
  function toggleShowPassword(showPassword: boolean) {
    setTogglePassword(!showPassword);
  }

  async function pressSubmit() {
    if (!isDataValid) {
      setFailedCredentials("Email or password is incorrect");
      return;
    }

    setFailedCredentials("");
    try {
      const response = await fetch (API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailData.text.toLowerCase(),
          password: passwordData.text,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Success:", data);
      } else {
        setFailedCredentials(data.detail || "Log in failed");
      }
    } catch(error) {
      console.error("Network error:", error);
      setFailedCredentials("Unable to join network");
    }
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
            onChangeValidation={handlePasswordValidation}
          />
        </View>
        <View>
          <Link href="/sign-in"> 
            <Text style={styles.text}>Don't have an account? </Text>
            <Text style={styles.button}>Sign up</Text>
          </Link>
        </View>
        <SubmitButton isEnabled={isDataValid} onPress={pressSubmit}/>
        <Text style={styles.failedText}>{failedCredentials}</Text>
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
    fontSize: 14,
  },
  failedText: {
    marginTop: "2%",
    color: "#db4b4b",
    fontFamily: "Sans-serif",
    fontSize: 12,
  },
  button: {
    fontSize: 14,
    fontFamily: "Sans serif",
    textDecorationLine: "underline",
    color: "#000",
  },
});
