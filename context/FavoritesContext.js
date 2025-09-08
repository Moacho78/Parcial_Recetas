import React, { createContext, useState } from "react";

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);

    const addFavorite = (dish) => {
        // Evitar duplicados
        if (!favorites.find((fav) => fav.idMeal === dish.idMeal)) {
            setFavorites([...favorites, dish]);
        }
    };

    const removeFavorite = (idMeal) => {
        setFavorites(favorites.filter((fav) => fav.idMeal !== idMeal));
    };

    return (
        <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};