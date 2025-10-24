// src/components/JapaneseQuizPage.tsx

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Define a estrutura de cada etapa do quiz
interface QuizStep {
  id: number;
  text: string;
  audio: string; // Caminho do arquivo de áudio
  options?: string[]; // Opções de resposta (ausente na etapa final)
  delay: number; // Delay em segundos para habilitar botões
  isFinal?: boolean; // Marca se é a última etapa (mensagem final)
}

// Conteúdo do Quiz
const quizSteps: QuizStep[] = [
  {
    id: 1,
    text: "Iremos agora personalizar sua jornada no Japonês, irei te fazer 3 perguntas, a primeira é: Qual é sua MAIOR dificuldade com japonês?",
    audio: "/audio/jp/quiz1.mp3",
    options: [
      "Os 3 alfabetos - hiragana, katakana e kanji são demais!",
      "Pronúncia - sons que não existem em português.",
      "Gramática invertida - verbo no final, partículas...",
      "Sou completamente iniciante e não conheço nenhum desses termos."
    ],
    delay: 11
  },
  {
    id: 2,
    text: "Como você se sente mais a vontade para estudar Japonês?",
    audio: "/audio/jp/quiz2.mp3",
    options: [
      "Com filmes e série do Japão",
      "Com cenas de animes",
      "Mangá no idioma original",
      "Conteúdo variado (cultura, notícias, dia a dia)" // Refinado
    ],
    delay: 4
  },
  {
    id: 3,
    text: "Qual seu principal foco inicial no aprendizado?", // Refinado
    audio: "/audio/jp/quiz3.mp3",
    options: [
      "Falar e entender (conversação com IA).", // Refinado
      "Ler e escrever (foco na escrita).", // Refinado
      "Quero tudo! Tenho tempo para focar nos dois." // Refinado
    ],
    delay: 3
  },
  {
    id: 4,
    text: "Perfeito, estou montando um cronograma de estudo para você, se você estudar todos os dias em 9 meses você estará assistindo e até falando Japonês perfeitamente!",
    audio: "/audio/jp/quiz4.mp3",
    delay: 13,
    isFinal: true
  }
];

const JapaneseQuizPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [buttonsEnabled, setButtonsEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null); // Ref para controlar o áudio

  const currentStep = quizSteps[currentStepIndex];

  // Efeito para tocar áudio e controlar timer dos botões
  useEffect(() => {
    setButtonsEnabled(false); // Desabilita botões ao mudar de etapa

    // Para o áudio anterior, se estiver tocando
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Toca o novo áudio
    const audio = new Audio(currentStep.audio);
    audioRef.current = audio; // Guarda a referência
    audio.play().catch(e => console.error("Erro ao tocar áudio do quiz:", e));

    // Timer para habilitar botões
    const timer = setTimeout(() => {
      setButtonsEnabled(true);
    }, currentStep.delay * 1000); // Converte segundos para milissegundos

    // Limpa o timer e para o áudio se o componente desmontar ou a etapa mudar
    return () => {
      clearTimeout(timer);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [currentStepIndex]); // Executa sempre que a etapa mudar

  const handleNextStep = () => {
    if (currentStep.isFinal) {
      localStorage.setItem('hasCompletedJpQuiz', 'true'); // Marca como concluído
      navigate('/jp/home'); // Navega para a home
    } else {
      setCurrentStepIndex(prevIndex => prevIndex + 1); // Avança para a próxima pergunta
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="relative bg-gray-900 border border-purple-500 text-white rounded-lg shadow-xl max-w-lg w-full animate-fade-in text-center p-8">

        {/* Texto da Etapa */}
        <h2 className="text-2xl font-semibold mb-8 text-gray-200">
          {currentStep.text}
        </h2>

        {/* Botões de Resposta (se não for a etapa final) */}
        {!currentStep.isFinal && currentStep.options && (
          <div className="space-y-4">
            {currentStep.options.map((option, index) => (
              <button
                key={index}
                onClick={handleNextStep}
                disabled={!buttonsEnabled}
                className={`w-full font-medium py-3 px-6 rounded-lg transition-all duration-300 ease-in-out text-lg
                  ${buttonsEnabled
                    ? 'bg-purple-600 hover:bg-purple-700 text-white cursor-pointer transform hover:scale-105'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed filter grayscale'
                  }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {/* Botão Iniciar (apenas na etapa final) */}
        {currentStep.isFinal && (
          <button
            onClick={handleNextStep}
            disabled={!buttonsEnabled}
            className={`w-full font-bold py-4 px-8 rounded-lg transition-all duration-300 ease-in-out text-xl mt-6
              ${buttonsEnabled
                ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer transform hover:scale-105'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed filter grayscale'
              }`}
          >
            Iniciar
          </button>
        )}
      </div>
    </div>
  );
};

export default JapaneseQuizPage;