'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig';

import Image from 'next/image';
import logo from '../../images/logo.png';

import { useUserStore } from '../../store/useUserStore';
import AnimatedLogo from '@/components/AnimatedLogo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>(''); // Estado para mostrar el error
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Resetear error antes de hacer el intento de login

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const { email: userEmail, uid } = userCredential.user;

      setUser({ email: userEmail, uid });

      // Redirige a la página de sorteo solo si el login es exitoso
      router.push('/sorteo');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);

      // Mostrar mensaje de error personalizado
      setError('Escribe bien, cabrón baboso');

      // Elimina el mensaje de error después de 3 segundos
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      paddingTop: '7rem',
      backgroundColor: '#6e6769' 
    }}>
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        maxWidth: '500px', 
        padding: '2rem', 
        borderRadius: '12px', 
        backgroundColor: '#222222', 
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)', 
        color: '#fff', 
        textAlign: 'center',
        margin: '1rem'
      }}>
       <div className="absolute left-1/2 transform -translate-x-1/2 -top-40 translate-y-2 sm:mt-20 md:mt-0">
    <AnimatedLogo className="custom-logo-size" />
  </div>
        
        <h2 style={{ marginTop:'2rem', marginBottom: '1rem', fontSize: '1.5rem' }}>INTERCAMBIO CORTESIANO</h2>
        <p style={{ marginBottom: '2rem', fontSize: '1.2rem' }}>5ta edición</p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1rem' }}>Correo</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ 
                width: '100%', 
                padding: '0.5rem', 
                borderRadius: '6px', 
                border: '1px solid #ccc', 
                backgroundColor: 'black'
              }}
            />
          </div>
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1rem' }}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ 
                width: '100%', 
                padding: '0.5rem', 
                borderRadius: '6px', 
                border: '1px solid #ccc', 
                backgroundColor: 'black'
              }}
            />
          </div>
          <button type="submit" style={{ 
            width: '100%', 
            padding: '0.75rem', 
            backgroundColor: '#ffffff', 
            color: '#5b2d22', 
            border: 'none', 
            borderRadius: '6px', 
            cursor: 'pointer',
            fontSize: '1.2 rem',
            fontWeight: 'bold' 
          }}>
            Iniciar sesión
          </button>
        </form>

        {/* Mostrar mensaje de error solo si hay un error */}
        {error && (
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            backgroundColor: '#ff4d4d',
            color: '#fff',
            borderRadius: '6px',
            fontSize: '1rem'
          }}>
            {error}
          </div>
        )}

        {/* Texto para registro */}
        <p style={{ marginTop: '1.5rem', fontSize: '1rem' }}>
          ¿No tienes una cuenta pedazo de basura?{' '}
          <span 
            onClick={() => router.push('/registro')}
            style={{ 
              color: '#ffcc00', 
              cursor: 'pointer', 
              textDecoration: 'underline' 
            }}
          >
            !Puchale aquí¡
          </span>
        </p>
      </div>
    </div>
  );
}
