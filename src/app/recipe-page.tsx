import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { TouchableOpacity, ScrollView, View, StyleSheet, Text, FlatList } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Recipe = {
    id: number,
    name: string,
    ingredients: string[],
    instructions: string[],
    url: string,
};

export default function RecipePage() {
    const [recipeList, setRecipeList] = useState<Recipe[]>([]);
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const { currentUser, id } = useLocalSearchParams<{ currentUser: string, id: string }>();

    useEffect(() => {
        const getRecipes = async () => {
            if(!currentUser) {
                router.navigate("/home");
                return;
            }

            const stored = await AsyncStorage.getItem("recipe-list-" + currentUser);

            if (!stored) {
                alert("failed to load recipes");
                setRecipeList([]);
                setRecipe(null);
                return;
            }

            const parsed: Recipe[] = JSON.parse(stored || "");
            setRecipeList(parsed);

            const recipe = parsed.find((r) => r.id.toString() === id) ?? null;
            setRecipe(recipe);
        }

        getRecipes();

    }, [currentUser, id]);

    console.log(typeof(recipe?.instructions))

    return (
        <>
        <SafeAreaProvider>
            <ScrollView>
                <SafeAreaView>
                    <Text style={styles.title}>
                        {recipe?.name ?? "empty name"}
                    </Text>
                </SafeAreaView>
                <SafeAreaView>
                    <FlatList
                        data={recipe?.ingredients}
                        renderItem={({item}) => 
                            <Text style={styles.ingredientText}>{"- " + item}</Text>
                        }
                        scrollEnabled={false}
                    >
                    </FlatList>
                </SafeAreaView>
                <SafeAreaView>
                    <Text style={styles.instructionText}>
                        {recipe?.instructions}
                    </Text>
                </SafeAreaView>
            </ScrollView>
        </SafeAreaProvider>
        </>
    );
}

const styles = StyleSheet.create({
    title: {
        marginLeft: "2%",
        fontFamily: "Sans-serif",
        fontSize: 24,
        fontWeight: "bold",
        fontStyle: "normal",
        color: "#636e72",
    },
    ingredientText: {
        marginLeft: "2%",
        marginRight: "2%",
        fontFamily: "Sans-serif",
        fontSize: 18,
        fontStyle: "normal",
    },
    instructionText: {
        marginLeft: "2%",
        marginRight: "2%",
        fontFamily: "Sans-serif",
        fontSize: 18,
        fontStyle: "normal",
    },
});