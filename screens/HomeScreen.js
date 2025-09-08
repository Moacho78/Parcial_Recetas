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


export default function RecipesScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [random, setRandom] = useState([]);

  const searchMeals = () => {
    if (!query) return;
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
      .then((res) => res.json())
      .then((data) => setResults(data.meals || []))
      .catch((err) => console.error(err));
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
      onPress={() => navigation.navigate("RecipeDetails", { mealId: item.idMeal })}
    >
      <Image source={{ uri: item.strMealThumb }} style={styles.image} />
      <View style={styles.overlay}>
        <Text style={styles.text}>{item.strMeal}</Text>
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
      const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
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
      <Text style={styles.header}>Recipes</Text>

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
            <TouchableOpacity onPress={() => {
              setResults([]);  // Limpia los resultados
              setQuery('');     // Limpia la barra de búsqueda
            }}>
              <Ionicons name="close" size={28} color="#ff6347" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={results}
            keyExtractor={(item) => item.idMeal}
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
      {/* FAB - Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={randomRecipe}>
        <Ionicons name="dice" size={28} color="#fff" />
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
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 15,
    textAlign: "center",
  },
  subHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  closeButton: {
    fontSize: 20,
    color: '#ff6347',
    paddingHorizontal: 10,
    fontWeight: 'bold',
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
  randomWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  randomText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "bold",
    color: '#333',
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: '#ff6347', // 
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 }
  }
});
