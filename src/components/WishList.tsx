"use client"; // Directiva para indicar que el componente es del lado del cliente

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { db } from '../firebase/firebaseConfig'; // Asegúrate de que la ruta sea correcta
import { doc, getDoc, setDoc } from 'firebase/firestore';

const WishList = ({ titulo, sorteoId }) => {
  const [texto, setTexto] = useState('');
  const [isEditable, setIsEditable] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // Expresión regular para detectar URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  // Función para detectar y envolver URLs en enlaces interactivos
  const formatTextoConLinks = (texto) => {
    return texto.replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank" class="text-blue-500 hover:underline">${url}</a>`;
    });
  };

  // Obtén el texto desde Firestore cuando el componente se monta
  useEffect(() => {
    const fetchTexto = async () => {
      try {
        const docRef = doc(db, 'configuracion', sorteoId); 
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setTexto(docSnap.data().texto || '');
        } else {
          console.log('No se encontró el documento, creándolo...');
          await setDoc(docRef, { texto: '' });
          setTexto('');
        }
      } catch (error) {
        console.error('Error al obtener el texto desde Firestore:', error);
      }
    };

    if (sorteoId) {
      fetchTexto();
    }
  }, [sorteoId]); // Vuelve a ejecutar la consulta si el sorteoId cambia

  const toggleEditable = () => {
    setIsEditable(!isEditable);
  };

  const guardarTexto = async () => {
    try {
      const docRef = doc(db, 'configuracion', sorteoId); 
      await setDoc(docRef, { texto });
      console.log('Texto guardado en Firestore:', texto);
      setIsEditable(false);
      setShowNotification(true);

      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    } catch (error) {
      console.error('Error al guardar el texto en Firestore:', error);
    }
  };

  return (
    <div className="space-y-8 w-full mx-auto">
      {showNotification && (
        <div className="fixed top-4 right-4 bg-[#d06522] text-white p-2 rounded-md shadow-md z-50">
          ¡Actualizado: Te rugieron las tripas con esa petición!
        </div>
      )}

      <h2 className="font-markazi text-3xl text-black text-center relative">
        <span className="absolute inset-0 text-white text-shadow">{titulo}</span>
        {titulo}
      </h2>

      <div className="bg-[#222222] rounded-xl p-4 text-white w-full max-w-2xl mx-auto">
        {isEditable ? (
          <div className="relative">
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 bg-white text-black resize-none max-h-[400px] h-[400px] overflow-y-auto"
            />
          </div>
        ) : (
          <div
            className="w-full rounded-md p-2 bg-white text-black overflow-y-auto overflow-x-auto max-h-[400px] h-[400px]" // Barra de desplazamiento vertical y horizontal
            dangerouslySetInnerHTML={{ __html: formatTextoConLinks(texto) }}
          />
        )}
        <div className="flex justify-between mt-4">
          {isEditable ? (
            <button 
              onClick={guardarTexto}
              className="px-4 py-2 bg-white text-black rounded-md font-bold flex items-center hover:bg-gray-200 transition-colors"
            >
              Guardar
              <FontAwesomeIcon icon={faFloppyDisk} className="ml-2 text-[#5b2d22] text-xl" />
            </button>
          ) : (
            <button 
              onClick={toggleEditable}
              className="px-4 py-2 bg-white text-[#7c2e1b] rounded-md font-bold flex items-center hover:bg-gray-200 transition-colors"
            >
              Editar
              <FontAwesomeIcon icon={faPenToSquare} className="ml-2 text-[#7c2e1b] text-xl" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishList;
