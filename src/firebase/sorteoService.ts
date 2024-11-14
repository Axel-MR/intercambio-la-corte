// SorteoService.ts
import { db } from './firebaseConfig';  // Asegúrate de importar correctamente tu configuración de Firestore
import { doc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';

// Crear un nuevo sorteo
export const crearSorteo = async (nombre: string, usuario: any) => {
  try {
    const nuevoParticipante = {
      userId: usuario.uid,
      username: usuario.username,
      amigoSecretoId: null,
      estado: true,
    };

    const nuevoSorteo = {
      createdAd: new Date(),
      estado: 'en espera',
      nombre,
      participantes: [nuevoParticipante], // Se inicia con un solo participante (el creador)
    };

    const sorteoRef = doc(db, 'sorteos', nombre); // Aquí usamos el nombre como ID del documento, pero puedes usar otro ID único.

    // Crear el documento del sorteo en Firestore
    await setDoc(sorteoRef, nuevoSorteo);

    console.log("Sorteo creado correctamente con el participante");
  } catch (error) {
    console.error("Error al crear el sorteo:", error);
  }
};

// Agregar un nuevo participante a un sorteo existente
export const agregarParticipante = async (nombreSorteo: string, usuario: any) => {
  try {
    const nuevoParticipante = {
      userId: usuario.uid,
      username: usuario.username,
      amigoSecretoId: null,
      estado: true,
    };

    const sorteoRef = doc(db, 'sorteos', nombreSorteo);

    // Agregar el nuevo participante al arreglo de participantes del sorteo
    await updateDoc(sorteoRef, {
      participantes: arrayUnion(nuevoParticipante),
    });

    console.log("Participante agregado al sorteo");
  } catch (error) {
    console.error("Error al agregar participante:", error);
  }
};
