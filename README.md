# ToDoList-Project

Une application complète de gestion des tâches comprenant un backend en Node.js et un frontend en React avec Next.js.

---

## 🚀 Fonctionnalités

- Gestion des utilisateurs (authentification sécurisée)
- Gestion des groupes et des tâches
- Interface moderne et réactive grâce à TailwindCSS et Framer Motion
- API REST robuste avec Express.js et Sequelize

---

## 📂 Structure du projet

- **Backend** : Situé dans le dossier `todo-backend`
- **Frontend** : Situé dans le dossier `todo-frontend`

---

## ⚙️ Installation et exécution

### 1. **Backend**
Navigate dans le répertoire `todo-backend` pour installer les dépendances et lancer le serveur.

```bash
cd todo-backend
npm install
npm run dev
```
L'API backend sera disponible sur http://localhost:3000 par défaut




# 🌟 Frontend : ToDoList-Project

L'interface utilisateur de l'application ToDoList est développée avec **React** et **Next.js** pour offrir une expérience fluide, 
moderne et réactive. Le design est enrichi avec **TailwindCSS**, des icônes élégantes (**Heroicons** et **Lucide React**), 
et des animations dynamiques via **Framer Motion**.

---

## 📂 Structure du frontend

Le frontend est organisé de manière modulaire pour une gestion simple et évolutive :

- **`/src/components`** : Contient les composants réutilisables (ex. : `Task`, `TaskForm`, `Sidebar`).
- **`/src/pages`** : Gestion des pages avec le système de routage de Next.js.
- **`/src/styles`** : Fichiers CSS globaux personnalisés, y compris la configuration TailwindCSS.
- **`/public`** : Ressources publiques (icônes, images, etc.).

---

## ⚙️ Installation et configuration

Suivez les étapes ci-dessous pour configurer et exécuter le frontend.

### 1. Installer les dépendances principales
Installez **Next.js** et toutes les dépendances nécessaires au projet :

```bash
npm install next@latest
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init

# Pour le hachage et l'authentification
npm install bcryptjs jsonwebtoken cookies-next

# Pour les animations
npm install framer-motion

# Pour les icônes
npm install lucide-react @heroicons/react

```

🚀 Lancer l'application
Après avoir installé et configuré toutes les dépendances, démarrez le serveur de développement avec :

```bash
npm run dev
```
L'application sera accessible sur http://localhost:3001.
