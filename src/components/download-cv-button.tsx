import React from 'react';
import { FiDownload } from 'react-icons/fi';
import PrimaryButton from './primary-button';

export default function DownloadCVButton() {
  const handleDownload = () => {
    // Aquí puedes agregar la lógica para descargar el CV
    // Por ejemplo, abrir un enlace o descargar un archivo
    const link = document.createElement('a');
    link.href = '/cv.pdf'; // Cambia esta ruta a la ubicación real de tu CV
    link.download = 'CV.pdf';
    link.click();
  };

  return (
    <PrimaryButton onClick={handleDownload} icon={FiDownload} iconPosition="right">
      Descargar CV
    </PrimaryButton>
  );
}
