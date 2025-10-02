import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { filterRecetasPrivadas } from "../services/services";


export default function RecetaPrivada({ navigation }) {

    const [recetaPri, setRecetaPri] = useState([]);

    useEffect(() => {
        const mostrarRecetas = async () => {
            const id = await AsyncStorage.getItem('userId');
            const recetas = await filterRecetasPrivadas(id);
            setRecetaPri(recetas);
        };
        mostrarRecetas();
    }, []);

    return (
        <View>
            <FlatList
                data={recetaPri}
                keyExtractor={(item) => item.idMeal ?? item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => navigation.navigate("RecipeDetails", { mealId: item.idMeal ?? item.id, fromFireStore: true })}
                    >
                        <Image source={{ uri: item.strMealThumb ?? item.urlImage }} style={styles.image} />
                        <Text style={styles.text}>{item.strMeal ?? item.titulo}</Text>
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