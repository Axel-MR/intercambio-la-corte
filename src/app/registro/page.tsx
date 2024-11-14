"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebaseConfig';
import logo_00 from '../../images/logo_00.png';
import { useRouter } from 'next/navigation';
import AnimatedLogo from '@/components/AnimatedLogo';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentLogo, setCurrentLogo] = useState(logo_00);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, "usuarios", uid), {
        username,
        email,
        createdAt: new Date(),
        role: 'invitado',
        status: true
      });

      setSuccess('Recuerda tu contrasña, bastardo.');
      setError('');

      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      setError('Error en el registro: ' + (err as Error).message);
      setSuccess('');
    }
  };



  return (
<div className="flex justify-center items-center min-h-screen bg-[#6e6769] relative sm:pt-40 pt-48">

      <div className="relative w-full max-w-md p-8 pt-16 rounded-xl bg-[#222222] shadow-lg text-white text-center ">
     
      <div className="absolute left-1/2 transform -translate-x-1/2 -top-40 translate-y-2 sm:mt-20 md:mt-0">
  <AnimatedLogo className="custom-logo-size" />
</div>

        <h2 className="text-2xl mb-6">Registro</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block mb-1 text-sm">
              Nombre o apodo claro
              <span className="block text-gray-400 text-xs mt-1">
                No te pongas El Wero cuando eres Axel o Neftalí
              </span>
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-2 rounded-md border border-gray-600 bg-black text-white placeholder-white placeholder-opacity-70"
              placeholder="Ingresa tu nombre o apodo"
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-1 text-sm">Correo</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 rounded-md border border-gray-600 bg-black text-white"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 text-sm">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 rounded-md border border-gray-600 bg-black text-white"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-white text-[#5b2d22] rounded-md text-xl font-bold hover:bg-gray-200 transition-colors"
          >
            Registrarse
          </button>

          {/* Texto para LOGIN */}
          <p style={{ marginTop: '1.5rem', fontSize: '1rem' }}>
            ¿Ya tienes cuenta, naco y estúpido?{' '}
            <span
              onClick={() => router.push('/login')}
              style={{
                color: '#ffcc00',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              !Puchale aquí¡
            </span>
          </p>
        </form>

        {success && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white py-2 px-4 rounded-md shadow-lg">
            {success}
          </div>
        )}
        
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}
