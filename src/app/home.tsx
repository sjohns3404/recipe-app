import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Dedicated Recipe Card Component for testing
function RecipeCard({ name, handleCardClick }: { name: string; handleCardClick: () => void }) {
  return (
    <TouchableOpacity style={styles.card} onPress={handleCardClick}>
      <Text style={styles.cardTitle}>{name}</Text>
      <Text style={styles.cardSubtitle}>Tap to view details</Text>
    </TouchableOpacity>
  );
}

// Recipe object
type Recipe = {
    id: number,
    name: string,
};

export default function HomeScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
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
            keyExtractor={(item) => item.id.toString()}
            renderItem={({item}) => <RecipeCard name={item.name} handleCardClick={handleClickRecipe} />}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
        />
    );
  }

  function renderPageControls() {
    const totalPages = Math.ceil(recipes.length / ITEMS_PER_PAGE);

    return (
        <View style={styles.pageNavContainer}>
            <TouchableOpacity
                style={styles.pageButton}
                onPress={goToPrevPage}
                disabled={currentPage === 1}
            >
                <Text>Previous</Text>
            </TouchableOpacity>

            {
                Array.from({length: totalPages}, 
                    (v, i) => (
                        <TouchableOpacity
                            style={styles.pageButton}
                            key={i}
                            onPress={ () => goToPageNum(i + 1)}
                        >
                            <Text>{i + 1}</Text>
                        </TouchableOpacity>
                    )
                )
            }
            
            <TouchableOpacity
                style={styles.pageButton}
                onPress={goToNextPage}
                disabled={currentPage === totalPages}
            >
                <Text>Next</Text>
            </TouchableOpacity>
        </View>
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
    setRecipes((prev) => [
            ...prev, 
            {
                id: Date.now(), 
                name: `Template recipe #${prev.length + 1}`
            }
        ]);
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
            {renderPageControls()}
            {renderRecipes()}
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
    top: 40,
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
  pageNavContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignContent: "center",
    maxWidth: 480,
    width: "100%",
    paddingVertical: 10,
    marginTop: 8,
  },
  pageButton: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "black",
  },
});