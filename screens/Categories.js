import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList } from "react-native";
import React, { useState, useEffect } from "react";



export default function CategoriesScreen({ navigation, route }) {

    const [dishes, setDishes] = useState([]);
    const { category } = route.params;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        findDishes();
    }, []);

    const findDishes = async () => {
        try {
            const response = await fetch(
                `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
            );
            const data = await response.json();
            setDishes(data.meals);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };



    return (
        <View>
            <FlatList
                data={dishes}
                keyExtractor={(item) => item.idMeal}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => navigation.navigate("RecipeDetails", { mealId: item.idMeal })}
                    >
                        <Image source={{ uri: item.strMealThumb }} style={styles.image} />
                        <Text style={styles.text}>{item.strMeal}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        margin: 10,
        borderRadius: 10,
        overflow: "hidden",
        elevation: 3,
    },
    image: { width: "100%", height: 150 },
    text: { position: "absolute", bottom: 10, left: 10, color: "#fff", fontSize: 20, fontWeight: "bold" },
});
