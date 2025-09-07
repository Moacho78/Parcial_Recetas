import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview"; 

export default function RecipeDetailsScreen({ route }) {
    const { mealId } = route.params;
    const [meal, setMeal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        fetchRecipe();
    }, []);

    const fetchRecipe = async () => {
        try {
            const response = await fetch(
                `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
            );
            const data = await response.json();
            setMeal(data.meals[0]);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const getIngredients = () => {
        let ingredients = [];
        for (let i = 1; i <= 20; i++) {
            if (meal[`strIngredient${i}`]) {
                ingredients.push(
                    `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
                );
            }
        }
        return ingredients;
    };

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#FF6347" />
                <Text>Cargando receta...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: meal.strMealThumb }} style={styles.image} />
            <Text style={styles.title}>{meal.strMeal}</Text>

            {/* Botón de Favoritos */}
            <TouchableOpacity 
                style={styles.favoriteButton} 
                onPress={() => setIsFavorite(!isFavorite)}
            >
                <Text style={styles.favoriteText}>
                    {isFavorite ? "❌ Quitar de favoritos" : "⭐ Agregar a favoritos"}
                </Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Ingredients</Text>
            {getIngredients().map((ingredient, index) => (
                <Text key={index} style={styles.ingredient}>
                    🍴 {ingredient}
                </Text>
            ))}

            <Text style={styles.sectionTitle}>Preparation</Text>
            <Text style={styles.instructions}>{meal.strInstructions}</Text>

            {meal.strYoutube ? (
                <>
                    <Text style={styles.sectionTitle}>Video Tutorial</Text>
                    <View style={styles.videoContainer}>
                        <WebView
                            style={styles.video}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            source={{ uri: meal.strYoutube.replace("watch?v=", "embed/") }}
                        />
                    </View>
                </>
            ) : null}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 15,
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: "100%",
        height: 200,
        borderRadius: 12,
        marginBottom: 15,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
        fontFamily: "serif",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 15,
        marginBottom: 5,
        fontFamily: "serif",
    },
    ingredient: {
        fontSize: 16,
        marginVertical: 2,
    },
    instructions: {
        fontSize: 15,
        textAlign: "justify",
        marginVertical: 10,
        lineHeight: 22,
    },
    videoContainer: {
        height: 220,
        marginTop: 10,
        borderRadius: 10,
        overflow: "hidden",
        marginBottom: 75,
    },
    video: {
        flex: 1,
    },
    favoriteButton: {
        backgroundColor: "#FF6347",
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
        marginVertical: 10,
    },
    favoriteText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
});

