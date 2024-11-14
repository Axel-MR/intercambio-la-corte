'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import logo_00 from '../images/logo_00.png'

interface AnimatedLogoProps {
  className?: string
}

export default function AnimatedLogo({ className = '' }: AnimatedLogoProps) {
  const [currentLogo, setCurrentLogo] = useState(logo_00)
  const timeoutId = useRef<NodeJS.Timeout | null>(null)
  const [availableLogos, setAvailableLogos] = useState<number[]>(Array.from({ length: 25 }, (_, i) => i + 1))

  // Limpiar timeout al desmontar el componente
  useEffect(() => {
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current)
      }
    }
  }, [])

  // Función para manejar el clic en el logo
  const handleLogoClick = () => {
    if (availableLogos.length === 0) {
      // Reiniciar la lista de logos cuando todos hayan sido mostrados
      setAvailableLogos(Array.from({ length: 25 }, (_, i) => i + 1))
    }

    // Elegir un logo aleatorio
    const randomIndex = Math.floor(Math.random() * availableLogos.length)
    const logoNumber = availableLogos[randomIndex]

    // Verificar si logoNumber es válido
    if (logoNumber !== undefined) {
      try {
        // Cargar la imagen dinámicamente
        const newLogo = require(`../images/logo_${logoNumber < 10 ? '0' : ''}${logoNumber}.png`)
        setCurrentLogo(newLogo.default)

        // Eliminar el logo elegido de la lista de logos disponibles
        setAvailableLogos((prev) => prev.filter((num) => num !== logoNumber))

        // Limpiar el timeout previo, si existe
        if (timeoutId.current) {
          clearTimeout(timeoutId.current)
        }

        // Volver al logo inicial después de 5 segundos
        timeoutId.current = setTimeout(() => {
          setCurrentLogo(logo_00)
          timeoutId.current = null
        }, 5000)
      } catch (error) {
        console.error("Error cargando la imagen:", error)
      }
    } else {
      console.warn("El número de logo es undefined, por lo que no se puede cargar la imagen.")
    }
  }

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ height: 'auto', padding: 0, margin: 0 }}
    >
      <Image
        src={currentLogo}
        alt="Animated Logo"
        onClick={handleLogoClick}
        className="cursor-pointer"
        style={{ maxHeight: '100%', objectFit: 'contain' }}
      />
    </div>
  )
}
