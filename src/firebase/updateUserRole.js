import { db } from './firebaseConfig.js';
import { doc, updateDoc } from 'firebase/firestore';

export async function updateUserRole(userId, newRole) {
  try {
    const userRef = doc(db, 'usuarios', userId);

    await updateDoc(userRef, {
      role: newRole,
    });

    console.log(`El rol del usuario ${userId} ha sido actualizado a ${newRole}.`);
  } catch (error) {
    console.error('Error al actualizar el rol:', error);
    throw error;
  }
}