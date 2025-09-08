import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList } from "react-native";
import React, { useContext } from "react";
import { FavoritesContext } from "../context/FavoritesContext";

export default function FavoritesScreen({ navigation }) {
    const { favorites } = useContext(FavoritesContext);

    if (!favorites || favorites.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No tienes favoritos aún.</Text>
            </View>
        );
    }

    return (
        <View>
            <FlatList
                data={favorites}
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
    text: {
        position: "absolute",
        bottom: 10,
        left: 10,
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    emptyText: {
        fontSize: 18,
        color: "gray",
        textAlign: "center",
    },
});