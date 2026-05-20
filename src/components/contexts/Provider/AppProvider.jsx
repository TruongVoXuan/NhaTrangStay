import React from "react"
import  { AuthProvider } from "../AuthContext";
import { FavoriteProvider } from "../FavoriteContext";

export const AppProvider = ({ children }) => {
    return (
        <AuthProvider>
            <FavoriteProvider>
                {children}
            </FavoriteProvider>
        </AuthProvider>
    );
}