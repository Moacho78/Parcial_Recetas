import { collection, query, where, orderBy, limit, startAfter, getDocs, addDoc } from 'firebase/firestore';
import { db } from './firebaseconfig';

// Filtrado y ordenación
const filterRecetasPublicas = async () => {
  const recetasRef = collection(db, 'recetas');
  const q = query(
    recetasRef,
    where('visible', '==', 'true')
  );

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    console.log(doc.id, ' => ', doc.data());
  });
};


export const addReceta = async (recetaData) => {
  try {
    const docRef = await addDoc(collection(db, "recetas"), recetaData);
    console.log("Receta añadida con ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error añadiendo receta: ", e);
    throw e;
  }
};


const filterRecetasPrivadas = async () => {
  const recetasRef = collection(db, 'recetas');
  const q = query(
    recetasRef,
    where('visible', '==', 'false')
  );

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    console.log(doc.id, ' => ', doc.data());
  });

}
//COMENTARIOS SERVICES 
export const addComentario = async (comentarioData) => {
  try {
    const docRef = await addDoc(collection(db, "comentarios"), comentarioData);
    console.log("Comentario añadido con ID: ", docRef.id, "Asociado a la receta: ", comentarioData.id_plato);
    return docRef.id;
  } catch (e) {
    console.error("Error añadiendo comentario: ", e);
    throw e;
  }
};

// Filtrado y ordenación
export const filterComentariosPorReceta = async (plato_id) => {
  try {
    const comentariosRef = collection(db, 'comentarios');
    const q = query(comentariosRef, where('id_plato', '==', plato_id), orderBy('createdAt', 'desc'));

    const querySnapshot = await getDocs(q);

    const comentarios = querySnapshot.docs.map(doc => {
      const data = doc.data();

      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(), // Normaliza la fecha
      };
    });

    return comentarios;
  } catch (error) {
    console.error('Error al obtener comentarios:', error);
    return []; // Devuelve un arreglo vacío si falla
  }
};







