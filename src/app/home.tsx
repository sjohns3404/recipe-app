import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Dedicated Recipe Card Component for testing
function RecipeCard({ id, handleCardClick }: { id: number; handleCardClick: () => void }) {
  return (
    <TouchableOpacity style={styles.card} onPress={handleCardClick}>
      <Text style={styles.cardTitle}>Template Recipe #{id}</Text>
      <Text style={styles.cardSubtitle}>Tap to view details</Text>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const [recipes, setRecipes] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Navigation functions
  function goToNextPage() {
    return setCurrentPage(currentPage + 1);
  }

  function goToPrevPage() {
    return setCurrentPage(currentPage - 1);
  }

  function goToPageNum(pageNum: number) {
    return setCurrentPage(pageNum);
  }

  function renderRecipes() {
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIdx = startIdx + ITEMS_PER_PAGE;
    const currentRecipes = recipes.slice(startIdx, endIdx);

    return (
        <FlatList
            data={currentRecipes}
            keyExtractor={(item) => item.toString()}
            renderItem={({item}) => <RecipeCard id={item} handleCardClick={handleClickRecipe} />}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
        />
    );
  }

  function renderPageControls() {
    const totalPages = Math.ceil(recipes.length / ITEMS_PER_PAGE);

    return (
        <>
            <TouchableOpacity
                onPress={goToPrevPage}
                disabled={currentPage === 1}
            >
                <Text>Previous</Text>
            </TouchableOpacity>

            {
                Array.from({length: totalPages}, 
                    (v, i) => (
                        <TouchableOpacity
                            key={i}
                            onPress={ () => goToPageNum(i + 1)}
                        >
                            <Text>{i + 1}</Text>
                        </TouchableOpacity>
                    )
                )
            }
            
            <TouchableOpacity
                onPress={goToNextPage}
                disabled={currentPage === totalPages}
            >
                <Text>Next</Text>
            </TouchableOpacity>
        </>
    )
  }

  const handleClickRecipe = () => {
    console.log("Clicked recipe!");
  }

  const handleLogout = async () => {
    try {
        await AsyncStorage.removeItem("userToken");
        router.replace("/");
    } catch(error) {
        console.error("Failed to logout", error);
    }
  };

  const handleAddRecipe = () => {
    setRecipes((prev) => [...prev, prev.length + 1]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleLogout} style={styles.topLeftLogout}>
        <Text style={styles.logoutText}>← Log Out</Text>
      </TouchableOpacity>

      {recipes.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.subtleText}>No recipes yet.</Text>
        </View>
      ) : (
        <>
            {renderRecipes()}
            {renderPageControls()}
        </>
        
      )}

      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={handleAddRecipe} style={styles.minimalButton}>
          <Text style={styles.buttonText}>+ Add Recipe</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
   
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  topLeftLogout: {
    position: 'absolute',
    top: 30,
    left: 20,
    zIndex: 10,
    paddingVertical: 4,
  },
  logoutText: {
    color: '#b2bec3',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    flexGrow: 1,
    paddingTop: 10,
  },
  card: {
    width: '100%',
    maxWidth: 550,
    padding: 16,
    marginVertical: 6,
    backgroundColor: '#fafafa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3436',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#b2bec3',
    marginTop: 4,
  },
  subtleText: {
    color: '#b2bec3',
    fontSize: 16,
    fontWeight: '400',
  },
  bottomContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 10,
  },
  minimalButton: {
    width: '40%',
    maxWidth: 200,
    paddingVertical: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#dfe6e9',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  buttonText: {
    color: '#636e72',
    fontSize: 14,
    fontWeight: '500',
  },
});