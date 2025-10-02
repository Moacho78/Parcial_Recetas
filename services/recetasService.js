import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebaseconfig";

export const addReceta = async (recetaData) => {
    try {
        const docRef = await addDoc(collection(db, "recetas"), {
            ...recetaData,
            createdAt: serverTimestamp(),
        });

        return docRef.id;
    } catch (e) {
        console.error("Error añadiendo receta: ", e);
        throw e;
    }
};