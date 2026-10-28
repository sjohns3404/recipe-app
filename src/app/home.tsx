import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const recipes: any[] = [];

  const handleLogout = async () => {
    try {
        await AsyncStorage.removeItem("userToken");

        router.replace("/");
    } catch(error) {
        console.error("Failed to logout", error);
    }
  }

  return (
    <View style={styles.container}>
      {recipes.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.subtleText}>No recipes yet.</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.minimalButton}>
            <Text style={styles.buttonText}>+ Add Recipe</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View />
      )}
    </View>
  );
}
   
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateContainer: {
    alignItems: 'center',
  },
  subtleText: {
    color: '#b2bec3',
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 16,
  },
  minimalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#dfe6e9',
  },
  buttonText: {
    color: '#636e72',
    fontSize: 14,
    fontWeight: '500',
  },
}) ;