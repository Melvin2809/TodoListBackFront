import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar"; // Importez votre composant Sidebar
import { getCookie } from "cookies-next";

const Profile = () => {
  const [user, setUser] = useState(null); // Stocke les données utilisateur
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = getCookie("authToken"); // Récupérer le token JWT

      try {
        const response = await fetch("http://localhost:3001/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.message || "Erreur lors de la récupération du profil.");
          return;
        }

        const data = await response.json();
        setUser(data); // Mettre à jour les données utilisateur
      } catch (err) {
        setError("Une erreur est survenue. Veuillez réessayer.");
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenu principal */}
      <div className="flex-1 p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-semibold text-gray-700 mb-6">Mon Profil</h1>
        
        {error ? (
          <div className="text-red-500 text-lg">{error}</div>
        ) : user ? (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-800">Nom d'utilisateur :</h2>
              <p className="text-gray-600">{user.username}</p>
            </div>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-800">Numéro de téléphone :</h2>
              <p className="text-gray-600">{user.phone}</p>
            </div>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-800">Date de naissance :</h2>
              <p className="text-gray-600">{new Date(user.dateOfBirth).toLocaleDateString()}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">Chargement...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
