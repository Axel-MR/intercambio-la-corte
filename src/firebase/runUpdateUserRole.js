import { updateUserRole } from './updateUserRole.js';

// ID del usuario y nuevo rol (puedes cambiar estos valores según necesites)
const userId = 'JfMVf8xVQAUqU94R3tbzoReHNOW2';
const newRole = 'admin';

updateUserRole(userId, newRole)
  .then(() => {
    console.log('Actualización de rol completada.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error al actualizar el rol:', error);
    process.exit(1);
  });