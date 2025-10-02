// RecipesScreen.js
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput
} from "react-native";
import { filterRecetasPublicas } from "../services/services";

export default function RecipesScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [random, setRandom] = useState([]);


  // 👉 Función que busca primero en Firestore y luego en la API
  const searchMeals = async () => {
    if (!query) return;

    try {
      // 1. Buscar en Firestore
      const recetasFirestore = await filterRecetasPublicas(query);

      if (recetasFirestore.length > 0) {
        setResults(recetasFirestore);
        return;
      }

      // 2. Si no hay resultados en Firestore, buscar en TheMealDB
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
      );
      const data = await res.json();

      setResults(data.meals || []);
    } catch (err) {
      console.error("Error en búsqueda:", err);
      setResults([]);
    }
  };

  // Llamada al API
  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "https://www.themealdb.com/api/json/v1/1/categories.php"
      );
      const data = await response.json();
      setCategories(data.categories);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("Category", {
          category: item.strCategory,
          description: item.strCategoryDescription,
        })
      }
    >
      <Image source={{ uri: item.strCategoryThumb }} style={styles.image} />
      <View style={styles.overlay}>
        <Text style={styles.text}>{item.strCategory}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderMeal = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("RecipeDetails", { mealId: item.idMeal ?? item.id , fromFirestore: true})
      }
    >
      <Image
        source={{ uri: item.strMealThumb ?? item.urlImage }}
        style={styles.image}
      />
      <View style={styles.overlay}>
        <Text style={styles.text}>{item.strMeal ?? item.titulo}</Text>
      </View>
    </TouchableOpacity>
  );


  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#ff6347" />
      </View>
    );
  }

  // Generar receta random
  const randomRecipe = async () => {
    try {
      const response = await fetch(
        "https://www.themealdb.com/api/json/v1/1/random.php"
      );
      const data = await response.json();

      const meal = data.meals[0]; // ⬅️ accede al primer elemento
      setRandom(meal); // ⬅️ guarda la receta en estado

      // Ahora navega cuando ya tienes el idMeal disponible
      navigation.navigate("RecipeDetails", { mealId: meal.idMeal });
    } catch (error) {
      console.error("Error al obtener receta aleatoria:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Recipes</Text>

        <View style={styles.randomWrapper}>
          <TouchableOpacity
            style={styles.randomButton}
            onPress={() => navigation.navigate("Favorite")}
          >
            <Ionicons name="star" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Buscador */}
      <TextInput
        style={styles.input}
        placeholder="Buscar receta..."
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={searchMeals}
      />

      {/* Resultados de búsqueda */}
      {results.length > 0 ? (
        <>
          <View style={styles.resultsHeader}>
            <Text style={styles.subHeader}>Resultados</Text>
            <TouchableOpacity
              onPress={() => {
                setResults([]); // Limpia los resultados
                setQuery(""); // Limpia la barra de búsqueda
              }}
            >
              <Ionicons name="close" size={28} color="#ff6347" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={results}
            keyExtractor={(item) => item.id ?? item.idMeal}  // 👈 usa id de Firestore o idMeal de la API
            renderItem={renderMeal}
            showsVerticalScrollIndicator={false}
          />
        </>
      ) : query !== "" ? (
        <Text style={styles.noResults}>No se encontraron recetas</Text>
      ) : null}

      {/* Categorías */}
      <Text style={styles.subHeader}>Categorías</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.idCategory}
        renderItem={renderCategory}
        showsVerticalScrollIndicator={false}
      />

      {/* FABs */}
      <TouchableOpacity style={styles.fabRight} onPress={randomRecipe}>
        <Ionicons name="dice" size={28} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.fabLeft}
        onPress={() => navigation.navigate("CrearReceta")}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 15,
    textAlign: "left",
  },
  randomWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  randomButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ff6347",
    justifyContent: "center",
    alignItems: "center",
  },
  subHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 5,
  },
  closeButton: {
    fontSize: 20,
    color: "#ff6347",
    paddingHorizontal: 10,
    fontWeight: "bold",
  },
  card: {
    marginBottom: 15,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    backgroundColor: "#000",
  },
  image: {
    width: "100%",
    height: 150,
  },
  overlay: {
    position: "absolute",
    bottom: 10,
    left: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  noResults: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
  },
  randomText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
  fabRight: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#ff6347",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  fabLeft: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "#ff6347",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});

