# React + Vite

## Overview

**BasicSpotifyClone** is a role-based music streaming platform that allows two types of users: Listeners and Artists. The application is built with a modern, glassmorphic UI matching premium audio streaming experiences. It interfaces with a robust backend to handle secure user authentication, role management, and multimedia processing.

## 🌟 Key Features

- **Role-Based Access Control**: 
  - **Listeners (Users)**: Can browse the global library and play uploaded music tracks via an integrated, persistent audio player.
  - **Artists (Creators)**: Gain access to a dedicated "Studio" dashboard where they can seamlessly upload their new tracks and custom cover art.
- **Persistent Audio Player**: A globally accessible bottom-bar player to manage track playback without interrupting browsing.
- **State-of-the-Art Aesthetic**: Features a beautiful dark mode UI powered by pure CSS, utilizing glassmorphism, fluid micro-animations, and responsive layout grids.
- **Secure File Handling**: Full integration with the backend `multer` and `imagekit/cloud` setup to predictably upload both audio binaries and thumbnail images.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), React Router DOM, Axios for API requests, Lucide-React for modern iconography.
- **Backend (Linked)**: Node.js, Express, MongoDB (Mongoose), JWT Auth, Multer.
- **Styling**: Custom CSS focused on minimal, premium UX patterns.
