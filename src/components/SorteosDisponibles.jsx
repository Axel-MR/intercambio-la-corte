import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck,faSleigh  } from '@fortawesome/free-solid-svg-icons';
import pepeSilla from '../images/pepe_silla.png';
import { db, auth } from '../firebase/firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, doc, query, where, onSnapshot } from 'firebase/firestore';
import Modal from './Modal';

const NotificationModal = ({ show, onClose, message }) => {
  if (!show) return null;

  return (
    <Modal onClose={onClose}>
      <div className="p-4">
        <p className="text-white">{message}</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-[#7c2e1b] text-white rounded-md font-bold hover:bg-[#ee3f3f] transition-colors"
        >
          Cerrar
        </button>
      </div>
    </Modal>
  );
};

const SorteosDisponibles = () => {
  const [sorteos, setSorteos] = useState([]);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [participaciones, setParticipaciones] = useState({});
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      console.log('Current user:', currentUser?.email);
      setUser(currentUser);
      if (currentUser) {
        checkParticipaciones(currentUser.uid);
        try {
          const usuariosRef = collection(db, 'usuarios');
          const q = query(usuariosRef, where('email', '==', currentUser.email));
          const snapshot = await getDocs(q);
          if (!snapshot.empty) {
            const userData = snapshot.docs[0].data();
            const isUserAdmin = userData.role === 'admin';
            console.log('User role:', userData.role);
            console.log('Is admin:', isUserAdmin);
            setIsAdmin(isUserAdmin);
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
        }
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const sorteosRef = collection(db, 'sorteos');
    const unsubscribe = onSnapshot(sorteosRef, (snapshot) => {
      const sorteosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSorteos(sorteosData);
    });

    return () => unsubscribe();
  }, []);

  const checkParticipaciones = async (userId) => {
    try {
      const participantesRef = collection(db, 'participantes');
      const q = query(participantesRef, where('userId', '==', userId));
      const snapshot = await getDocs(q);

      const participacionesData = {};
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        participacionesData[data.sorteoId] = {
          id: doc.id,
          ...data
        };
      });
      setParticipaciones(participacionesData);
    } catch (error) {
      console.error('Error al verificar participaciones:', error);
    }
  };

  const cambiarEstadoSorteo = async (sorteoId, nuevoEstado) => {
    try {
      const sorteoRef = doc(db, 'sorteos', sorteoId);
      await updateDoc(sorteoRef, {
        estado: nuevoEstado
      });
      setModalMessage(`Estado del sorteo cambiado a: ${nuevoEstado}`);
      setShowModal(true);
    } catch (error) {
      console.error('Error al cambiar el estado del sorteo:', error);
      setModalMessage('Error al cambiar el estado del sorteo');
      setShowModal(true);
    }
  };

  const verAmigoSecreto = async (amigoSecretoId) => {
    if (!amigoSecretoId) {
      setModalMessage("Aún no tienes un amigo secreto asignado.");
      setShowModal(true);
      return;
    }

    try {
      const usuariosRef = collection(db, 'usuarios');
      const q = query(usuariosRef, where('__name__', '==', amigoSecretoId));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const amigoSecreto = snapshot.docs[0].data();
        setModalMessage(`Jsjsj no es cierto, Tu amigo secreto es: ${amigoSecreto.username || 'Usuario sin nombre'}`);
      } else {
        setModalMessage('No se encontró la información del amigo secreto.');
      }
      setShowModal(true);
    } catch (error) {
      console.error('Error al obtener amigo secreto:', error);
      setModalMessage('Error al obtener la información del amigo secreto');
      setShowModal(true);
    }
  };

  const unirseASorteo = async (sorteoId) => {
    if (!user) {
      setModalMessage('Inicia sesión para unirte al sorteo');
      setShowModal(true);
      return;
    }
  
    const sorteo = sorteos.find((sorteo) => sorteo.id === sorteoId);
    
    if (sorteo.estado !== 'Disponible') {
      setModalMessage('Este sorteo no está disponible para inscripciones');
      setShowModal(true);
      return;
    }

    try {
      if (participaciones[sorteoId]) {
        setModalMessage('Ya estás inscrito en este sorteo');
        setShowModal(true);
        return;
      }

      const usuariosRef = collection(db, 'usuarios');
      const usuarioQuery = query(usuariosRef, where('email', '==', user.email));
      const usuarioSnapshot = await getDocs(usuarioQuery);

      let nombreInscrito = 'Usuario sin nombre';
      let username = '';

      if (!usuarioSnapshot.empty) {
        const usuarioData = usuarioSnapshot.docs[0].data();
        username = usuarioData.username || 'Usuario sin nombre';
        nombreInscrito = username;
      }

      const participante = {
        amigoSecretoId: null,
        asignedDate: null,
        disponible: true,
        inscripcionDate: new Date(),
        participacionConfirmado: true,
        sorteoId,
        userId: user.uid,
        nombreInscrito,
        username
      };

      await addDoc(collection(db, 'participantes'), participante);
      checkParticipaciones(user.uid);
      setModalMessage('¡Te has unido al sorteo exitosamente!');
      setShowModal(true);
    } catch (error) {
      console.error('Error al unirse al sorteo:', error);
      setModalMessage('Hubo un error al unirte al sorteo. Por favor, intenta de nuevo.');
      setShowModal(true);
    }
  };
  const asignarAmigoSecreto = async (sorteoId) => {
    if (!user) {
      setModalMessage('Inicia sesión para obtener tu amigo secreto');
      setShowModal(true);
      return;
    }
  
    const sorteo = sorteos.find((s) => s.id === sorteoId);
    if (sorteo.estado !== 'Listo') {
      setModalMessage('El sorteo aún no está listo para asignar amigos secretos');
      setShowModal(true);
      return;
    }
  
    try {
      const participantesRef = collection(db, 'participantes');
      const q = query(participantesRef, where('sorteoId', '==', sorteoId), where('disponible', '==', true));
      const snapshot = await getDocs(q);
  
      const participantesDisponibles = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
  
      if (participantesDisponibles.length === 0) {
        setModalMessage('No hay participantes disponibles para asignar como amigo secreto.');
        setShowModal(true);
        return;
      }
  
      const participanteActual = participaciones[sorteoId];
      if (!participanteActual) {
        setModalMessage('No estás inscrito en este sorteo.');
        setShowModal(true);
        return;
      }
  
      if (participanteActual.amigoSecretoId) {
        setModalMessage('Ya tienes un amigo secreto asignado.');
        setShowModal(true);
        return;
      }
  
      const participantesDisponiblesSinUsuarioActual = participantesDisponibles.filter(p => p.userId !== user.uid);
      const randomIndex = Math.floor(Math.random() * participantesDisponiblesSinUsuarioActual.length);
      const amigoSecreto = participantesDisponiblesSinUsuarioActual[randomIndex];
  
      const participanteDocRef = doc(db, 'participantes', participanteActual.id);
      await updateDoc(participanteDocRef, {
        amigoSecretoId: amigoSecreto.userId,
        asignedDate: new Date()
      });
  
      const amigoSecretoDocRef = doc(db, 'participantes', amigoSecreto.id);
      await updateDoc(amigoSecretoDocRef, {
        disponible: false
      });
  
      checkParticipaciones(user.uid);
      setModalMessage('¡Me informan que te tocó un pendejo ¿Quién será?!');
      setShowModal(true);
    } catch (error) {
      console.error('Error al asignar amigo secreto:', error);
      setModalMessage('Error al asignar el amigo secreto');
      setShowModal(true);
    }
  };
  
  const ListaParticipantes = ({ sorteoId }) => {
      const [participantes, setParticipantes] = useState([]);
      const [loading, setLoading] = useState(true);
  
      useEffect(() => {
        const fetchParticipantes = async () => {
          try {
            const participantesRef = collection(db, 'participantes');
            const q = query(participantesRef, where('sorteoId', '==', sorteoId));
            const snapshot = await getDocs(q);
            const participantesData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setParticipantes(participantesData);
          } catch (error) {
            console.error('Error al obtener participantes:', error);
          } finally {
            setLoading(false);
          }
        };
  
        fetchParticipantes();
      }, [sorteoId]);
  
      if (loading) return <p className="text-white">Cargando participantes...</p>;
  
      return (
        <ul className="list-disc ml-6">
          {participantes.length === 0 ? (
            <li className="text-white">No hay participantes inscritos.</li>
          ) : (
            participantes.map((participante) => (
              <li key={participante.id} className="text-white">
                {participante.nombreInscrito}
              </li>
            ))
          )}
        </ul>
      );
    };
    
    const amigos = [
      'Mende', 'Theo', 'Sebastián', 'Eugenio Derbez', 'El wey de Calendulas',
      'TownGameplays', 'AMLO', 'Clauida Sheinbau', 'Marco (El que huele feo)', 'Mexivergas',
      'Wereverwero', 'LuisitoRey', 'Crisscross', 'AlexSintek', 'Doomentio', 'Octavio Paz',
      'Crish Chan', 'Plutarco Elias C.', 'Walter Esau', 'Muerto Andaluz', 'Memo Aponte',
      'Adolfo López Mateos', 'Homero Chino', 'Cacaniel', 'Osama B Laden', 'Federiquito P.luche',
      'Renegul', 'Link femboy', 'Angie', 'La chiquiVieja', 'La Palida', 'Ten Shin Han',
      'Goku ssj10', 'Sergio Andrade', 'Glora Trevi', 'Roberto Carlos', 'Carlos Marxxxs',
      'Josefina Vasques Mota', 'Cuadri', 'Pelusa Caligari', 'Oppo Reno 10', 'El hijo del rey',
      'Luis Miguel', 'Vicente Fernandez', 'Hittler'
    ];
    

    const obtenerAmigoAleatorio = () => {
      const indiceAleatorio = Math.floor(Math.random() * amigos.length);
      return amigos[indiceAleatorio];
    };
    


  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 animate-fadeIn">
        <Image 
          src={pepeSilla} 
          alt="Imagen de pepe_silla" 
          width={50} 
          height={50} 
          className="animate-float"
        />
        <h2 className="font-markazi text-3xl text-[#222222]">
          Sorteos Disponibles
        </h2>
      </div>

      {sorteos.map((sorteo) => {
        const participacion = participaciones[sorteo.id] || {};
        return (
          <div key={sorteo.id} className="bg-[#222222] p-6 rounded-lg shadow-md text-white animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">{sorteo.nombre}</h3>
            </div>
            
            <p className="mb-2">Descripción: {sorteo.descripcion}</p>
            <p className="mb-2">
              Fecha de creación: {sorteo.createdAt && new Date(sorteo.createdAt.toDate()).toLocaleDateString()}
            </p>
            <p className="mb-2">Estado: {sorteo.estado || 'Disponible'}</p>
            <p className="mb-4">Participantes:</p>
            <ListaParticipantes sorteoId={sorteo.id} />
            
            {participacion.amigoSecretoId ? (
              <div className="flex gap-2 items-center">
                <button
      onClick={() => verAmigoSecreto(participacion.amigoSecretoId)}
      className="px-4 py-2 bg-[#7c2e1b] text-white rounded-md font-bold hover:bg-[#ee3f3f] transition-colors"
    >
      {obtenerAmigoAleatorio()} es tu amigo Secreto
    </button>
                <FontAwesomeIcon icon={faCircleCheck} className="text-[#1DB954]" size="lg" />
              </div>
            ) : sorteo.estado === 'Listo' && participacion.id ? (
              <button
                onClick={() => asignarAmigoSecreto(sorteo.id)}
                className="px-4 py-2 bg-[#7c2e1b] text-white rounded-md font-bold hover:bg-[#ee3f3f] transition-colors"
              >
                Obtener Amigo Secreto
              </button>
            ) : sorteo.estado === 'Disponible' && !participacion.id ? (
              <button
  onClick={() => unirseASorteo(sorteo.id)}
  className="mt-4 px-4 py-2 bg-[#7c2e1b] text-white rounded-md font-bold hover:bg-[#ee3f3f] transition-colors flex items-center gap-2"
>
  <FontAwesomeIcon icon={faSleigh} />
  Unirse al sorteo
</button>
            ) : null}
    
            {isAdmin && (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => cambiarEstadoSorteo(sorteo.id, 'Disponible')}
                  className={`px-4 py-2 text-white rounded-md font-bold transition-colors ${
                    sorteo.estado === 'Disponible' 
                      ? 'bg-blue-800 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                  disabled={sorteo.estado === 'Disponible'}
                >
                  Marcar Disponible
                </button>
                <button
                  onClick={() => cambiarEstadoSorteo(sorteo.id, 'Listo')}
                  className={`px-4 py-2 text-white rounded-md font-bold transition-colors ${
                    sorteo.estado === 'Listo'
                      ? 'bg-green-800 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                  disabled={sorteo.estado === 'Listo'}
                >
                  Marcar Listo
                </button>
              </div>
            )}
          </div>
        );
      })}
      
      <NotificationModal
        show={showModal}
        onClose={() => setShowModal(false)}
        message={modalMessage}
      />
    </div>
  );
};

export default SorteosDisponibles;