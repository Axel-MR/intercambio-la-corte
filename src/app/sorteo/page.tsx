"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Header from '../../components/Header';
import Carousel from '../../components/carrusel';
import Reglas from '../../components/Reglas';
import SorteosDisponibles from '../../components/SorteosDisponibles';
import ListaDeDeseosPage from '../../app/listaDeDeseos/page';
import CrearSorteo from '@/components/CrearSorteo';
import regalos from '../../images/regalos.png';
import AnimatedLogo from '../../components/AnimatedLogo';
import { auth, db } from '../../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation'; // Esto es correcto

interface UserData {
  role?: string;
  email: string;
  username?: string;
}

export default function Sorteo() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();  // Mover aquí la declaración de router

  useEffect(() => {
    const checkUserRole = async (uid: string) => {
      try {
        console.log('Checking role for user:', uid);
        
        const userRef = doc(db, 'usuarios', uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data() as UserData;
          console.log('User data:', userData);
          console.log('User role:', userData.role);
          
          const adminStatus = userData.role?.toLowerCase() === 'admin';
          console.log('Is admin?', adminStatus);
          
          setIsAdmin(adminStatus);
        } else {
          console.log('User document does not exist');
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error checking user role:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('Auth state changed. User:', user.uid);
        checkUserRole(user.uid);
      } else {
        console.log('No user logged in');
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5b2d22]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Columna Izquierda (en escritorio) */}
          <div className="w-full lg:w-1/3 space-y-8">
            {isAdmin && (
              <CrearSorteo isAdmin={isAdmin} />
            )}

            <SorteosDisponibles />
            <Reglas titulo="Reglas📜" sorteoId="id_reglas"/>
            <button 
              onClick={() => router.push('/listaDeDeseos')}
              className="w-full px-4 py-2 mt-4 bg-white text-[#7c2e1b] rounded-md font-bold border border-[#7c2e1b] hover:bg-gray-200 transition-colors"
            >
              Ir a Lista de Deseos
            </button>
          </div>

          {/* Separador vertical */}
          <div className="hidden lg:block w-px bg-gray-300" />
          
          {/* Columna Derecha */}
          <div className="w-full lg:w-2/3 space-y-8">
            <div className="relative p-8 rounded-xl overflow-hidden mb-16">
              <Image
                src={regalos}
                alt="Imagen de regalos"
                layout="fill"
                objectFit="cover"
                className="opacity-50 sm:w-1/2 lg:w-full"
              />
              <div className="relative z-10">
                <h1 className="font-noto-serif text-4xl md:text-5xl text-[#5b2d22] text-center">
                  INTERCAMBIO CORTESIANO
                </h1>
                <h2 className="font-noto-serif text-3xl md:text-4xl text-[#7c2e1b] text-center mt-4">
                  Quinta edición
                </h2>
                <p className="text-lg md:text-xl text-center mt-4">
                  Festejamos la quinta edición del intercambio navideño en la corte. Para participar, únete al sorteo disponible a tu izquierda y espera a que esté disponible la opción de "sortear nombres" para obtener a tu amigo secreto. Recuerda tomar captura de pantalla por si lo necesitas en el futuro. ¡Buena suerte!
                </p>
              </div>
            </div>
            
           
            <Carousel />
          

            <AnimatedLogo></AnimatedLogo>
         
         
          </div>
        </div>
      </div>
    </div>
  );
}
