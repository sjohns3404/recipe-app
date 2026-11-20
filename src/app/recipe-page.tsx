import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { TouchableOpacity, View, StyleSheet, Text, FlatList } from "react-native";
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
    const { currentUser, id } = useLocalSearchParams<{ currentUser: string, id: string }>();

    useEffect(() => {
        const getRecipes = async () => {
            if(!currentUser) {
                router.navigate("/home");
            }

            const recipes = await AsyncStorage.getItem("recipe-list-" + currentUser);

            if (recipes) {
            const recipeList = JSON.parse(recipes);
            setRecipeList(recipeList);
            } else {
                alert("failed to load recipes");
            }
        }

        getRecipes();
    }, [currentUser]);


    return (
        <>
        <View>
            <TouchableOpacity onPress={() => console.log(recipeList)}>
                <Text>Press me Daddy</Text>
            </TouchableOpacity>
        </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {

    },
});