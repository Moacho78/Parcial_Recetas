import axios from "axios";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dfaqsp0j1/image/upload";
const UPLOAD_PRESET = "Tiendas Dione";

export const uploadImageToCloudinary = async (imageUri) => {
    try {
        // Crea FormData 
        let formData = new FormData();
        formData.append("file", {
            uri: imageUri,
            type: "image/jpeg", // puede ser image/png, depende del archivo
            name: "upload.jpg"
        });
        formData.append("upload_preset", UPLOAD_PRESET);

        const response = await axios.post(CLOUDINARY_URL, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });

        return response.data.secure_url; // devuelve la URL de la imagen
    } catch (error) {
        console.error("Error subiendo imagen:", error);
        throw error;
    }
};