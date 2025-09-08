import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "./screens/HomeScreen";
import CategoriesScreen from "./screens/Categories";
import RecipeDetailsScreen from "./screens/RecipeDetailsScreen";
import FavoritesScreen from "./screens/Favorites";

// Importamos el provider
import { FavoritesProvider } from "./context/FavoritesContext";

const Stack = createStackNavigator();

export default function App() {
  return (
    <FavoritesProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="GastroGo" component={HomeScreen} />
          <Stack.Screen name="Category" component={CategoriesScreen} />
          <Stack.Screen name="RecipeDetails" component={RecipeDetailsScreen} />
          <Stack.Screen name="Favorite" component={FavoritesScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </FavoritesProvider>
  );
}