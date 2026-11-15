import React, { useState, useEffect } from 'react'; import { Modal, View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { router } from "expo-router";
import { BlurView } from "expo-blur";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SearchBar from "@/app/components/search-bar";

function RecipeCard({
  id,
  name, 
  handleCardClick, 
  onDelete 
}: {
  id: number;
  name: string; 
  handleCardClick: () => void; 
  onDelete: (id: number) => void; 
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={handleCardClick}>
      <View style={{ flex: 1, marginRight: 10 }}>
        <Text style={styles.cardTitle} numberOfLines={1}>{name}</Text>
        <Text style={styles.cardSubtitle}>Tap to view details</Text>
      </View>

      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={(e) => {
          e.stopPropagation();
          onDelete(id);
        }}
      >
        <Text style={styles.deleteButtonText}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

// Recipe object template
type Recipe = {
    id: number,
    name: string,
    ingredients: string[],
    instructions: string[],
    url: string,
};

const API_URL = "http://192.168.1.25:8000/recipe/";

export default function HomeScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<string>("");

  type UrlValidationResult = {
    isSafe: boolean;
    sanitizedUrl: string;
  };
  
  // Loads in recipes directly after rendering component
  useEffect(() => {
    const loadStoredRecipes = async () => {
      try {
        const userEmail = await AsyncStorage.getItem("logged_in_user");
        const user = userEmail?.split("@")[0] ?? 'guest' + Date.now();
        setCurrentUser(user);

        const storedData = await AsyncStorage.getItem("recipe-list-" + user);
        if (storedData) {
          const parsedRecipes = JSON.parse(storedData);
          if (Array.isArray(parsedRecipes)) {
            setRecipes(parsedRecipes);
          } else {
            console.log("Found corrupted non-array data in storage");
            setRecipes([]);
            await AsyncStorage.removeItem("recipe-list-" + user);
          }
        }
      } catch (error) {
        console.error("Failed to load stored recipes:", error);
      }
    };
    loadStoredRecipes();
  }, []);

  const validateUrl = (input: string): UrlValidationResult => {
    const trimmed = input.trim();
    const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/;

    if (trimmed.toLowerCase().startsWith("javascript:") || trimmed.toLowerCase().startsWith("data:")) {
        return { isSafe: false, sanitizedUrl: '' };
    }

    let finalUrl = trimmed;
    const isValidFormat = urlRegex.test(finalUrl)

    return {
        isSafe: isValidFormat,
        sanitizedUrl: isValidFormat ? finalUrl : ''
    };
  };

  const handleUrlSubmit = async (cleanUrl: string) => {
    const isDuplicate = recipes.some((recipe) => recipe.url === cleanUrl);

    if (isDuplicate) {
      alert("This recipe is already in your library!");
      return;
    }
    
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cleanUrl: cleanUrl,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Successfully found recipe", data.Title);
        const newRecipe: Recipe = {
          id: Date.now(),
          name: data.Title,
          ingredients: data.Ingredients,
          instructions: data.Instructions,
          url: cleanUrl
        }

        const updatedRecipes = [...recipes, newRecipe];

        try {

          await AsyncStorage.setItem(
            "recipe-list-" + currentUser, 
            JSON.stringify(updatedRecipes)
          );

          setRecipes(updatedRecipes);
        } catch (error) {
          console.error("Failed to store your recipe locally:", error);
          alert("Could not save your recipe locally");
        }
      } else {
        console.log(data.detail);
      }
    } catch (error) {
      console.error("Network error:", error);
      console.log("Unable to connect to server.");
    }

    setShowModal(false);
  };

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
            renderItem={({item}) => 
              <RecipeCard
                id={item.id}
                name={item.name} 
                handleCardClick={handleClickRecipe} 
                onDelete={deleteRecipe}
              />}
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

  const deleteRecipe = async (id: number) => {
    const userToken = "recipe-list-" + currentUser;
    try {
      const updatedRecipes = recipes.filter((recipe) => recipe.id !== id)
      const storageKey = "recipe-list-" + currentUser;

      await AsyncStorage.setItem(storageKey, JSON.stringify(updatedRecipes));
      setRecipes(updatedRecipes);
      
      console.log(`Deleted recipe with id: ${id}`);
    } catch (error) {
      console.error("Failed to delete recipe locally:", error);
      alert("Could not delete your recipe.");
    }
  }

  const handleLogout = async () => {
    try {
        await AsyncStorage.removeItem("userToken");
        await AsyncStorage.removeItem("logged_in_user");
        router.replace("/");
    } catch(error) {
        console.error("Failed to logout", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleLogout} style={styles.topLeftLogout}>
        <Text style={styles.logoutText}>← Log Out</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => {
            setShowModal(!showModal);
        }}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <SearchBar
                        input={"Enter the recipe URL"}
                        validateUrl={validateUrl}
                        onSubmit={handleUrlSubmit}
                    />
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => setShowModal(!showModal)}>
                        <Text style={styles.buttonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
      </Modal>
      
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
        <TouchableOpacity onPress={() => setShowModal(true)} style={styles.minimalButton}>
          <Text style={styles.buttonText}>+ Add Recipe</Text>
        </TouchableOpacity>
      </View>

      { showModal && (
        <BlurView
            intensity={20}
            tint="dark"
            style={StyleSheet.absoluteFill}
        />
      )}

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
  centeredView: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 160,
    alignItems: "center",
  },
  modalView: {
    width: "90%",
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    height: "20%",
    maxWidth: 500,
    maxHeight: 250,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
  topRightSearch: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
    paddingVertical: 4,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dfe6e9',
    justifyContent: "center",
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#ff7675',
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 16,
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
  button: {
    width: "30%",
    height: "60%",
    maxHeight: 50,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#dfe6e9",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
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
    maxWidth: 550,
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