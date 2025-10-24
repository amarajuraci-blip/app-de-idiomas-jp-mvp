import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SectionTitle from './SectionTitle'; // Correto
import ModuleCard from './ModuleCard'; // Correto
import { languageModules } from '../data/modules'; // Corrigido
import FirstTimeModal from './FirstTimeModal'; // Correto

const LanguageSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [isFirstTimeModalOpen, setIsFirstTimeModalOpen] = useState(false);

  useEffect(() => {
    const hasSeenWarning = localStorage.getItem('hasSeenSoundWarning');
    if (!hasSeenWarning) {
      setIsFirstTimeModalOpen(true);
    } else {
      const audio = new Audio('/audio/narrations/efeito/idioma.mp3');
      audio.play().catch(error => console.error("Erro ao tocar áudio de idioma:", error));
    }
  }, []);

  const handleCloseFirstTimeModal = () => {
    localStorage.setItem('hasSeenSoundWarning', 'true');
    setIsFirstTimeModalOpen(false);
    const audio = new Audio('/audio/narrations/efeito/idioma.mp3');
    audio.play().catch(error => console.error("Erro ao tocar áudio de idioma:", error));
  };

  const handleModuleClick = (languageCode: string) => {
    navigate(`/${languageCode}/home`);
  };

  // Separa o módulo de japonês dos outros
  const japaneseModule = languageModules.find(module => module.code === 'jp');
  const otherModules = languageModules.filter(module => module.code !== 'jp');

  return (
    <>
      <FirstTimeModal isOpen={isFirstTimeModalOpen} onClose={handleCloseFirstTimeModal} />

      <div className="min-h-screen bg-black flex flex-col justify-center">
        <div className="container mx-auto px-4 py-16 max-w-6xl text-center">
          <SectionTitle align="center">
            Escolha seu Idioma para Começar
          </SectionTitle>

          <p className="text-gray-400 -mt-8 mb-12">Selecione o idioma que você deseja estudar.</p>

          {/* Renderiza o módulo de japonês separadamente no topo */}
          {japaneseModule && (
            <div
              key={japaneseModule.id}
              onClick={() => handleModuleClick(japaneseModule.code)}
              className="mb-8 cursor-pointer group" // Adiciona margem inferior e cursor
            >
              {/* Usando uma tag img diretamente para a imagem horizontal */}
              <img
                src="/images/visual/capajpfull.webp" // Nova imagem horizontal
                alt={japaneseModule.title}
                className="w-full h-auto object-contain rounded-lg shadow-md group-hover:scale-[1.02] transition-transform duration-300 border-2 border-purple-200 hover:border-purple-400" // Estilos para a imagem
              />
               {/* Opcional: Adicionar título abaixo da imagem se desejar */}
               {/* <h3 className="text-white font-semibold text-lg mt-2">{japaneseModule.title}</h3> */}
            </div>
          )}

          {/* Renderiza os outros módulos na grade */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
            {otherModules.map((module) => (
              <div key={module.id} onClick={() => handleModuleClick(module.code)}>
                <ModuleCard
                  moduleNumber={module.id}
                  title={module.title}
                  imageUrl={module.imageUrl} // Imagem vertical original
                  sectionType="course"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default LanguageSelectionPage;