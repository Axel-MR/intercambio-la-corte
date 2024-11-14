'use client';

import Image from 'next/image';
import listaDeDeseosImg from '../../images/list_de_deseos.jpg'; // Imagen de fondo
import listaDeDeseosLogo from '../../images/lista_de_deseos_logo.png'; // Imagen del logo
import Header from '../../components/Header';
import WishList from '../../components/WishList';

const ListasDeDeseos = () => {
  const listas = [
    { titulo: "Luis", id: "id_Luis" },
    { titulo: "Nathashit", id: "id_Natashit" },
    { titulo: "Jhon Beta", id: "id_JhonBeta" },
    { titulo: "Perberti", id: "id_Perberti" },
    { titulo: "Axel", id: "id_Axel" },
    { titulo: "Tonyking11", id: "id_Tonyking11" },
    { titulo: "Daniel Beta", id: "id_DanielBeta" },
    { titulo: "Emiliano", id: "id_Emiliano" },
    { titulo: "Neftaweed", id: "id_Neftaweed" }
  ];

  return (
    <div className="min-h-screen relative">
      {/* Contenedor para la imagen con opacidad */}
      <div className="absolute top-0 left-0 w-full h-full z-[-1] opacity-50">
        <Image
          src={listaDeDeseosImg}
          alt="Lista de Deseos"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
      </div>
      <Header />

      {/* Título principal con el logo de la lista de deseos */}
      <div className="text-center mt-16">
        <Image
          src={listaDeDeseosLogo}
          alt="Logo Lista de Deseos"
          width={400}  // Ajusta el tamaño según sea necesario
          height={200} // Ajusta el tamaño según sea necesario
          className="mx-auto" // Centra la imagen
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-4 sm:mx-8 md:mx-12 lg:mx-16 mt-8">
        {listas.map((lista) => {
          // Verificamos si cada lista tiene las propiedades necesarias
          if (!lista || !lista.id || !lista.titulo) {
            return <div key={lista.id} className="text-red-500">Error: Datos inválidos para esta lista</div>;
          }
          return <WishList key={lista.id} titulo={lista.titulo} sorteoId={lista.id} />;
        })}
      </div>
    </div>
  );
};

export default ListasDeDeseos;
