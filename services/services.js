
import { db } from './firebaseconfig';
import { collection, query, where, orderBy, startAt, endAt, getDocs } from "firebase/firestore";

export const filterRecetasPublicas = async (tituloReceta) => {
  const recetasRef = collection(db, "recetas");

  const q = query(
    recetasRef,
    where("visible", "==", true),
    orderBy("titulo"),
    startAt(tituloReceta),
    endAt(tituloReceta + "\uf8ff") // búsqueda "like"
  );

  const querySnapshot = await getDocs(q);

  const recetas = [];
  querySnapshot.forEach((doc) => {
    recetas.push({ id: doc.id, ...doc.data() });
  });

  console.log(recetas);
  return recetas;
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

//Buscar receta por id
export const getRecetaById = async (recetaId) => {
  try {
    const docRef = doc(db, "recetas", recetaId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
    console.log("No existe la receta con ese ID");
      return null;
    }
  } catch (error) {
    console.error("Error al obtener la receta:", error);
    throw error;

  }
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
  const filterComentariosPorReceta = async (plato_id) => {
    const recetasRef = collection(db, 'comentarios');
    const q = query(
      recetasRef,
      where('id_plato', '==', 'plato_id')
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, ' => ', doc.data());
    });


  };







