// Importa las funciones que necesitas de los SDKs de Firebase
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Importa Firestore

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA9FkM4R8rZF9Rl6Waxnlbfx1jvQbBXPN4",
  authDomain: "intercambio-cortesiano-20f6c.firebaseapp.com",
  projectId: "intercambio-cortesiano-20f6c",
  storageBucket: "intercambio-cortesiano-20f6c.firebasestorage.app",
  messagingSenderId: "495098342626",
  appId: "1:495098342626:web:df4d3982bc2f43d27a82bb"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta la instancia de auth y db para ser usadas en otras partes del proyecto
export const auth = getAuth(app);
export const db = getFirestore(app);
