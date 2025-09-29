# 🎓 Système de Gestion Scolaire (School Management System) 🚀

Une application web complète et moderne pour la gestion d'un établissement scolaire.
Ce projet **full-stack (MERN)** permet de gérer les **étudiants, enseignants, classes, matières et notes** avec un système d’authentification basé sur les rôles.

---

## ✨ Aperçu Visuel

L’accent a été mis sur :

* Un **design professionnel**
* Une **expérience utilisateur fluide**
* Des **animations subtiles** pour une interface moderne et agréable

| Page de Connexion            | Tableau de Bord (Admin)      | Bulletin de Classe           | Saisie des Notes             |
| ---------------------------- | ---------------------------- | ---------------------------- | ---------------------------- |
| ![](https://i.imgur.com/...) | ![](https://i.imgur.com/...) | ![](https://i.imgur.com/...) | ![](https://i.imgur.com/...) |

---

## 📋 Fonctionnalités Clés

Le système est conçu autour de **trois rôles principaux** : **Administrateur**, **Enseignant**, et **Étudiant**.

### 🔑 Pour l’Administrateur

* **Tableau de Bord Complet** : Vue d’ensemble avec statistiques clés (étudiants, enseignants, classes).
* **Gestion des Étudiants** : CRUD complet (Créer, Lire, Mettre à jour, Supprimer).
* **Gestion des Enseignants** : CRUD complet.
* **Gestion des Classes** : CRUD complet avec assignation d’un professeur principal.
* **Gestion des Matières** : CRUD complet.
* **Gestion des Utilisateurs** : Réinitialisation sécurisée des mots de passe.
* **Création de Comptes Automatisée** : Lors de l’ajout d’un étudiant ou enseignant, un compte est généré automatiquement.

### 👨‍🏫 Pour l’Enseignant

* **Portail de Saisie des Notes** : Sélection d’une classe via une interface interactive.
* **Grille de Saisie Intuitive** : Ajout et mise à jour des notes.
* **Consultation des Résultats** : Accès aux bulletins complets des classes.
* **Export PDF** : Téléchargement des bulletins (individuels ou globaux).

### 👨‍🎓 Pour l’Étudiant

* **Tableau de Bord Simplifié** : Vue personnelle du bulletin de notes.
* **Consultation des Moyennes** : Notes par matière et moyenne générale.
* **Export PDF** : Téléchargement de son relevé de notes.

---

## 🛠️ Technologies Utilisées

### 🎨 Frontend

* React.js (Hooks & Context API)
* React Router (navigation)
* Material-UI (MUI)
* Framer Motion (animations)
* Axios (requêtes HTTP)
* jsPDF & jsPDF-Autotable (PDF)
* React-Icons

### ⚙️ Backend

* Node.js & Express.js
* MongoDB + Mongoose
* JWT (authentification)
* Bcrypt.js (hachage des mots de passe)
* Dotenv (variables d’environnement)

---

## 🔧 Installation et Lancement

### 1. Prérequis

* **Node.js** (v14+)
* **npm**
* **MongoDB** (local ou MongoDB Atlas)

### 2. Cloner le projet

```bash
git clone https://github.com/zakariaghrib/school-management-system
cd school-management-system
```

### 3. Configuration du Backend

```bash
cd server
npm install
```

Créer un fichier **`.env`** dans `/server` :

```env
MONGO_URI=votre_chaine_de_connexion_mongodb
JWT_SECRET=un_secret_complexe_pour_jwt
```

Lancer le serveur (avec nodemon) :

```bash
npm run dev
```

Le backend est disponible sur **[http://localhost:5000](http://localhost:5000)**

### 4. Configuration du Frontend

```bash
cd client
npm install
npm start
```

Le frontend est disponible sur **[http://localhost:3000](http://localhost:3000)**

---

## 📂 Structure du Projet

```
/  
├── client/         # Application Frontend (React)  
│   ├── public/  
│   └── src/  
│       ├── components/  
│       ├── context/  
│       ├── pages/  
│       └── services/  
└── server/         # Application Backend (Node.js/Express)  
    ├── config/  
    ├── controllers/  
    ├── middleware/  
    ├── models/  
    └── routes/  
```

---

## 🚀 Améliorations Futures

* Notifications en temps réel (Socket.io)
* Gestion des emplois du temps
* Chat intégré (enseignants ↔ étudiants ↔ administration)
* Tableau de bord analytique avancé

---

## 📜 Licence

Ce projet est sous licence **MIT** – libre à utiliser et mod
