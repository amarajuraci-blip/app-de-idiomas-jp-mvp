import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SectionTitle from './SectionTitle';
import ModuleCard from './ModuleCard';
import { languageModules } from '../data/modules'; // Verifique se este caminho está correto
import FirstTimeModal from './FirstTimeModal';
import WarningModal from './WarningModal'; // Importar o WarningModal

const LanguageSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [isFirstTimeModalOpen, setIsFirstTimeModalOpen] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false); // Estado para o modal de aviso

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

  // Modificar handleModuleClick para incluir verificação do quiz e modal de aviso
  const handleModuleClick = (languageCode: string) => {
    if (languageCode === 'jp') {
      // Verifica se o quiz já foi feito
      if (localStorage.getItem('hasCompletedJpQuiz')) {
        navigate('/jp/home'); // Vai para a home se já fez
      } else {
        navigate('/jp/quiz'); // Vai para o quiz se é a primeira vez
      }
    } else {
      setIsWarningModalOpen(true); // Abre o modal de aviso para outros idiomas
    }
  };

  // Função para fechar o modal de aviso
  const handleCloseWarningModal = () => {
    setIsWarningModalOpen(false);
  };

  // Separa o módulo de japonês dos outros
  const japaneseModule = languageModules.find(module => module.code === 'jp');
  const otherModules = languageModules.filter(module => module.code !== 'jp');

  return (
    <>
      <FirstTimeModal isOpen={isFirstTimeModalOpen} onClose={handleCloseFirstTimeModal} />
      {/* Renderizar o WarningModal */}
      <WarningModal isOpen={isWarningModalOpen} onClose={handleCloseWarningModal} />

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
              onClick={() => handleModuleClick(japaneseModule.code)} // Chama handleModuleClick
              className="mb-8 cursor-pointer group"
            >
              <img
                src="/images/visual/capajpfull.webp" // Imagem horizontal
                alt={japaneseModule.title}
                className="w-full h-auto object-contain rounded-lg shadow-md group-hover:scale-[1.02] transition-transform duration-300 border-2 border-purple-200 hover:border-purple-400"
              />
            </div>
          )}

          {/* Renderiza os outros módulos na grade */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
            {otherModules.map((module) => (
              <div key={module.id} onClick={() => handleModuleClick(module.code)}> {/* Chama handleModuleClick */}
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