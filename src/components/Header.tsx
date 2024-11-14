"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Importamos useRouter para redireccionar
import headerImage from '../images/logo.png';
import clickedLogoImage from '../images/logo_clic.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGavel, faRightFromBracket, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { useUserStore } from '../store/useUserStore';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase/firebaseConfig';  // Asegúrate de importar db para usar Firestore
import { doc, getDoc } from 'firebase/firestore';  // Importar las funciones necesarias para Firestore
import Link from 'next/link'; // Importamos Link para navegación
import { faElevator, faGifts } from '@fortawesome/free-solid-svg-icons'; // Importa los íconos

const Header: React.FC = () => {
  const { user } = useUserStore();
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [isZooming, setIsZooming] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null); // Estado para almacenar el username
  const [role, setRole] = useState<string | null>(null); // Estado para almacenar el rol
  const router = useRouter(); // Instanciamos el router

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Obtener el username y el rol desde Firestore cuando el usuario se autentica
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          // Referencia al documento del usuario en Firestore
          const userRef = doc(db, 'usuarios', user.uid); // Aquí se usa el UID del usuario
          const docSnap = await getDoc(userRef);
          
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUsername(userData.username); // Almacena el nombre de usuario en el estado
            setRole(userData.role); // Almacena el rol del usuario
          } else {
            console.log('No se encontró el usuario');
          }
        } catch (error) {
          console.error('Error al obtener el nombre de usuario:', error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleLogoClick = (): void => {
    setIsClicked(true);
    setTimeout(() => setIsZooming(true), 100);
    setTimeout(() => setIsZooming(false), 800);
    setTimeout(() => setIsClicked(false), 1500);
  };

  const clearUser = useUserStore((state) => state.clearUser);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      clearUser();
      router.push('/login'); // Redirige al login después de cerrar sesión
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleLogin = () => {
    router.push('/login'); // Redirige a la página de login
  };

  return (
    <header className="flex flex-col lg:flex-row items-center justify-between bg-[#222222] p-4 lg:p-6 w-full box-border">
      <div className="flex flex-col lg:flex-row items-center justify-between w-full">
        {/* Columna de los enlaces */}
        <div className="flex flex-col lg:flex-row items-center justify-start lg:space-x-4 space-y-2 lg:space-y-0">
          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center text-white hover:text-gray-300 transition-colors"
            >
              <FontAwesomeIcon icon={faRightFromBracket} className="mr-2" />
              Cerrar sesión
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="flex items-center text-white hover:text-gray-300 transition-colors"
            >
              <FontAwesomeIcon icon={faRightToBracket} className="mr-2" />
              Iniciar sesión
            </button>
          )}

          {/* Enlaces de sorteos y lista de deseos */}
          <div className="flex items-center space-x-4 mt-2">
            {/* Ícono de elevador a la izquierda de Sorteos */}
            <Link href="/sorteo" className="text-white hover:text-gray-300 transition-colors flex items-center">
              <FontAwesomeIcon icon={faElevator} className="mr-2" /> {/* Ícono de elevador */}
              Sorteos
            </Link>

            {/* Ícono de regalos a la izquierda de Lista de deseos */}
            <Link href="../listaDeDeseos" className="text-white hover:text-gray-300 transition-colors flex items-center">
              <FontAwesomeIcon icon={faGifts} className="mr-2" /> {/* Ícono de regalos */}
              Lista de deseos
            </Link>
          </div>
        </div>

        {/* Contenedor centrado para "INTERCAMBIO", logo e "CORTESIANO" */}
        <div className="flex items-center justify-center space-x-2 lg:space-x-4">
          <h1 className="font-['Pirata_One'] text-white text-center lg:text-left mb-2 lg:mb-0 text-xl lg:text-2xl">
            INTERCAMBIO
          </h1>

          <Image 
            src={isClicked ? clickedLogoImage : headerImage} 
            alt="Header Logo" 
            width={60} 
            height={50} 
            className={`${isZooming ? 'logo-zoom' : 'logo'} cursor-pointer`} 
            onClick={handleLogoClick} 
          />

          <h1 className="font-['Pirata_One'] text-white text-center lg:text-left mb-2 lg:mb-0 text-xl lg:text-2xl">
            CORTESIANO
          </h1>
        </div>

        {/* Información de usuario (nombre y rol) */}
        <div className="flex items-center">
          <h1 className="font-['Pirata_One'] text-white text-center lg:text-right mb-2 lg:mb-0 text-base lg:text-xl">
            {user ? (
              <>
                ¡Hola, {username || user.email}!
                {role === 'admin' && (
                  <span className="text-yellow-500 ml-4">¡Eres Administrador!</span>
                )}
              </>
            ) : (
              '¡Bienvenido!'
            )}
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
