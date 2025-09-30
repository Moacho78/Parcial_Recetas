import React, { useState } from "react";
import { uploadImageToCloudinary } from "../services/uploadService"; 
import {
    View,
    TextInput,
    Text,
    ScrollView,
    Switch,
    StyleSheet,
    TouchableOpacity,
    Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { addReceta } from "../services/recetasService";

export default function CrearReceta({ navigation }) {
    const [titulo, setTitulo] = useState("");
    const [ingredientes, setIngredientes] = useState("");
    const [instrucciones, setInstrucciones] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [visible, setVisible] = useState(true);
    const [imageUri, setImageUri] = useState(null);
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
        });
        console.log("Resultado de imagen pickeada", result);
        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setImage(uri);
        }
    };

    const uploadImage = async () => {
        if (!image) return;
        setUploading(true);

        try {
            const url = await uploadImageToCloudinary(image);
            console.log("Imagen subida con éxito:", url);
            // Aquí puedes guardar la url en tu formulario o en la DB
            setImageUri(url);
        } catch (error) {
            console.log("Error:", error);
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        try {
            const ingredientesArray = ingredientes
                .split(",")
                .map((i) => i.trim())
                .filter((i) => i.length > 0);

            // Subir imagen si existe
            let url = null;
            if (image) {
                url = await uploadImageToCloudinary(image);
                setImageUri(url);
            }

            // Guardar receta en Firestore con la URL de la imagen
            const recetaId = await addReceta(
                {
                    titulo,
                    ingredientes: ingredientesArray,
                    instrucciones,
                    videoUrl,
                    visible,
                    userId: "123abc",
                    urlImage: url, 
                }
            );

            navigation.navigate("RecipeDetails", {
                mealId: recetaId,
                fromFirestore: true,
            });
        } catch (error) {
            console.error("Error al guardar receta:", error);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Crear Nueva Receta</Text>

            <TextInput
                placeholder="Título"
                value={titulo}
                onChangeText={setTitulo}
                style={styles.input}
            />
            <TextInput
                placeholder="Ingredientes separados por coma"
                value={ingredientes}
                onChangeText={setIngredientes}
                style={styles.input}
            />
            <TextInput
                placeholder="Instrucciones"
                value={instrucciones}
                onChangeText={setInstrucciones}
                multiline
                style={[styles.input, { height: 100 }]}
            />
            <TextInput
                placeholder="Video URL (opcional)"
                value={videoUrl}
                onChangeText={setVideoUrl}
                style={styles.input}
            />

            {/* Switch Público/Privado */}
            <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>¿Receta pública?</Text>
                <Switch value={visible} onValueChange={setVisible} />
            </View>

            {/* Imagen seleccionada */}
            {imageUri && (
                <Image
                    source={{ uri: imageUri }}
                    style={styles.imagePreview}
                    resizeMode="cover"
                />
            )}

            <TouchableOpacity style={styles.button} onPress={pickImage}>
                <Text style={styles.buttonText}> Elegir imagen</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, { backgroundColor: "#ff6347" }]}
                onPress={handleSave}
            >
                <Text style={styles.buttonText}> Guardar Receta</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: "#fff" },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 25,
        color: "#ff6347",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
        backgroundColor: "#fafafa",
    },
    switchContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
        paddingVertical: 10,
    },
    switchLabel: { fontSize: 16, fontWeight: "500", color: "#333" },
    imagePreview: {
        width: "100%",
        height: 180,
        borderRadius: 10,
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#ff6347",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 15,
    },
    buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
