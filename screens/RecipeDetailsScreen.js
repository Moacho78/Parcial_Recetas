import React, { useEffect, useState, useContext } from "react";
import {getRecetaById} from "../services/services";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Alert
} from "react-native";
import { WebView } from "react-native-webview";
import { FavoritesContext } from "../context/FavoritesContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebaseconfig";

export default function RecipeDetails({ route }) {
  const { mealId, fromFirestore } = route.params;
  const [meal, setMeal] = useState(null);
  const { addFavorite, removeFavorite, favorites } = useContext(FavoritesContext);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);


  useEffect(() => {
    if (fromFirestore) {
      // Receta creada por el usuario en Firestore
      const fetchFirestoreMeal = async () => {
        const docRef = doc(db, "recetas", mealId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setMeal({ id: docSnap.id, ...docSnap.data() }); // usamos id en lugar de idMeal
        }
      };
      fetchFirestoreMeal();
    } else {
      // Receta de la API externa
      fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .then((res) => res.json())
        .then((data) => setMeal(data.meals[0]));
    }
  }, [mealId]);

  useEffect(() => {
    if (!meal) return; // Asegurar que meal no sea null antes de acceder a meal.idMeal

    const mostrarComentarios = async () => {
      const comentarios = await filterComentariosPorReceta(meal.idMeal);
      setComments(comentarios);
    };

    mostrarComentarios();
  }, [meal]);

  if (!meal) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#ff6347" />
        <Text>Cargando receta...</Text>
      </View>
    );
  }

  // Normalizamos el ID dependiendo de la fuente
  const recipeId = fromFirestore ? meal.id : meal.idMeal;
  const isFavorite = favorites.some((fav) =>
    fromFirestore ? fav.id === recipeId : fav.idMeal === recipeId
  );

  // Ingredientes (Firestore o API)
  const getIngredients = () => {
    if (meal.ingredientes) {
      return meal.ingredientes;
    }
    let ingredients = [];
    for (let i = 1; i <= 20; i++) {
      if (meal[`strIngredient${i}`]) {
        ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
      }
    }
    return ingredients;
  };

  //Funciones para agregrar comentario nuevo y ver los existentes
  const handleCommentSubmit = async () => {
    if (!commentText.trim()) {
      Alert.alert('No puedes enviar un comentario vacio, por favor escribe un comentario.')
      return;
    }

    const newComment = {
      text: commentText,
      author: 'Usuario', // nombre del usuario que agregó el comentario
      createdAt: serverTimestamp(),
      id_plato: meal.idMeal // Relaciona el comentario con la receta
    };

    try {
      await addComentario(newComment);
      setComments([...comments, newComment]); // agregar al estado local (opcional) o se puede cambiar la lógica para que se haga una consulta en tiempo real
      setCommentText('');
    } catch (error) {
      console.error('Error al agregar comentario:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: meal.urlImage || meal.strMealThumb }}
        style={styles.image}
      />
      <Text style={styles.title}>{meal.titulo || meal.strMeal}</Text>
      <Text style={styles.category}>{meal.strCategory || ""}</Text>

      {/* Botón favoritos */}
      <TouchableOpacity
        style={[styles.favoriteButton, isFavorite ? styles.remove : styles.add]}
        onPress={() =>
          isFavorite
            ? removeFavorite(recipeId)
            : addFavorite(fromFirestore ? { ...meal, id: recipeId } : meal)
        }
      >
        <Text style={styles.favoriteText}>
          {isFavorite ? "Quitar de favoritos ✖️" : "Agregar a favoritos ⭐"}
        </Text>
      </TouchableOpacity>

      {/* Ingredientes */}
      <Text style={styles.sectionTitle}>Ingredients</Text>
      {getIngredients().map((item, index) => (
        <Text key={index} style={styles.ingredient}>
          🍴 {item}
        </Text>
      ))}

      {/* Instrucciones */}
      <Text style={styles.sectionTitle}>Preparation</Text>
      <Text style={styles.instructions}>
        {meal.instrucciones || meal.strInstructions}
      </Text>

      {/* Video */}
      {(meal.videoUrl || meal.strYoutube) && (
        <>
          <Text style={styles.sectionTitle}>Video Tutorial</Text>
          <View style={styles.videoContainer}>
            <WebView
              style={styles.video}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              source={{
                uri: (meal.videoUrl || meal.strYoutube).replace("watch?v=", "embed/"),
              }}
            />
          </View>
        </>
      )}

      {/*Comentarios*/}
      <Text style={styles.sectionTitle}>Comentarios</Text>

      {/*Lista de comentarios existentes*/}
      {comments.length > 0 ? (
        comments.map((comment, index) => (
          <View key={index} style={styles.commentContainer}>
            <Text style={styles.commentAuthor}>{comment.author}</Text>
            <Text style={styles.commentText}>{comment.text}</Text>
            <Text style={styles.commentDate}>
              {
                comment.createdAt
                  ? (comment.createdAt.toDate
                    ? comment.createdAt.toDate().toLocaleDateString()
                    : new Date(comment.createdAt).toLocaleDateString())
                  : "Fecha desconocida"
              }
            </Text>
          </View>
        ))
      ) : (
        <Text style={styles.commentsText}>No hay comentarios aún.</Text>
      )}

      {/*Crear nuevo comentario*/}
      <TextInput
        style={styles.commentsInput}
        placeholder="Escribe tu comentario..."
        value={commentText}
        onChangeText={setCommentText}
        multiline
      />

      <TouchableOpacity onPress={handleCommentSubmit} style={styles.commentsButton}>
        <Text style={styles.commentsButtonText}>Enviar comentario</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 15 },
  image: { width: "100%", height: 200, borderRadius: 12, marginBottom: 15 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  category: { fontSize: 18, color: "gray", marginBottom: 10, textAlign: "center" },
  favoriteButton: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
  },
  add: { backgroundColor: "#ff6347" },
  remove: { backgroundColor: "#ff6347" },
  favoriteText: { color: "#fff", fontWeight: "bold", fontSize: 18, lineHeight: 22 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginTop: 25, marginBottom: 5 },
  ingredient: { fontSize: 16, marginVertical: 10 },
  instructions: {
    marginTop: 20,
    fontSize: 15,
    textAlign: "justify",
    lineHeight: 22,
    marginVertical: 40,
  },
  videoContainer: {
    height: 220,
    marginTop: 10,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 0,
  },
  video: { flex: 1 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
});
