import React, { useState } from 'react';
import { GameState, StoryLevel, GeneratedContent } from './types';
import { generateStory, generateStoryImage } from './services/gemini';
import { Button } from './components/Button';
import { LoadingSpinner } from './components/LoadingSpinner';
import { BookOpen, ChevronRight, RefreshCw, Star, Play, Sparkles, CheckCircle2, Users, ArrowRight } from 'lucide-react';

const CREATION_LEVELS: StoryLevel[] = [
  {
    id: "create-1",
    chapterTitle: "A Criação",
    stepLabel: "Dia 1",
    title: "Luz e Escuridão",
    bibleVerseReference: "Gênesis 1:3-5",
    defaultDescription: "No começo estava tudo escuro... Então Deus disse: Haja Luz!",
    promptContext: "Separation of light and darkness, first day of creation, contrast between bright light and deep space void",
    color: "from-gray-900 to-blue-900"
  },
  {
    id: "create-2",
    chapterTitle: "A Criação",
    stepLabel: "Dia 2",
    title: "Céu e Águas",
    bibleVerseReference: "Gênesis 1:6-8",
    defaultDescription: "Deus separou as águas e criou o lindo céu azul!",
    promptContext: "Separation of waters above and waters below, fluffy clouds, blue sky, ocean horizon",
    color: "from-blue-700 to-cyan-400"
  },
  {
    id: "create-3",
    chapterTitle: "A Criação",
    stepLabel: "Dia 3",
    title: "Terra e Plantas",
    bibleVerseReference: "Gênesis 1:9-13",
    defaultDescription: "Surgiu a terra seca, cheia de árvores, flores e frutas gostosas.",
    promptContext: "Dry land appearing from ocean, beautiful garden, colorful flowers, giant trees, fruits, paradise nature",
    color: "from-green-800 to-emerald-500"
  },
  {
    id: "create-4",
    chapterTitle: "A Criação",
    stepLabel: "Dia 4",
    title: "Sol, Lua e Estrelas",
    bibleVerseReference: "Gênesis 1:14-19",
    defaultDescription: "Luzes no céu! O Sol para o dia, a Lua e as estrelas para a noite.",
    promptContext: "Sun shining bright, moon glowing, sparkling stars in the galaxy, cosmic beauty",
    color: "from-indigo-900 to-purple-800"
  },
  {
    id: "create-5",
    chapterTitle: "A Criação",
    stepLabel: "Dia 5",
    title: "Pássaros e Peixes",
    bibleVerseReference: "Gênesis 1:20-23",
    defaultDescription: "Peixinhos nadando no mar e pássaros voando felizes no céu.",
    promptContext: "Underwater sea life, colorful fish, whales, birds flying in the sky, eagles, parrots, dynamic nature",
    color: "from-teal-700 to-blue-500"
  },
  {
    id: "create-6",
    chapterTitle: "A Criação",
    stepLabel: "Dia 6",
    title: "Animais e Humanos",
    bibleVerseReference: "Gênesis 1:24-31",
    defaultDescription: "Leões, ovelhas, e a obra prima de Deus: o ser humano!",
    promptContext: "Wild animals, lions, elephants, sheep, and a happy human family (Adam and Eve) in a garden",
    color: "from-orange-700 to-yellow-500"
  },
  {
    id: "create-7",
    chapterTitle: "A Criação",
    stepLabel: "Dia 7",
    title: "O Descanso",
    bibleVerseReference: "Gênesis 2:1-3",
    defaultDescription: "Tudo estava perfeito. Deus viu que era muito bom e descansou.",
    promptContext: "Peaceful garden, beautiful sunset, harmony, rest, golden hour light, serene atmosphere",
    color: "from-rose-500 to-pink-400"
  }
];

const DESCENDANTS_LEVELS: StoryLevel[] = [
  {
    id: "fam-1",
    chapterTitle: "Primeiras Famílias",
    stepLabel: "Família",
    title: "Adão e Eva",
    bibleVerseReference: "Gênesis 4:1-2",
    defaultDescription: "Fora do jardim, a primeira família começou a crescer com amor.",
    promptContext: "Adam and Eve with their children, prehistoric simple clothing, tending to the earth, family love, ancient near east setting but cute cartoon",
    color: "from-amber-700 to-orange-500"
  },
  {
    id: "fam-2",
    chapterTitle: "Primeiras Famílias",
    stepLabel: "Filho",
    title: "Sete: Um Novo Começo",
    bibleVerseReference: "Gênesis 4:25",
    defaultDescription: "Um novo filho trouxe alegria e esperança para todos!",
    promptContext: "Biblical character Seth as a happy child/young man, symbol of hope, peaceful ancient landscape, sunrise",
    color: "from-emerald-700 to-teal-500"
  },
  {
    id: "fam-3",
    chapterTitle: "Primeiras Famílias",
    stepLabel: "Amigo",
    title: "Enoque: Amigo de Deus",
    bibleVerseReference: "Gênesis 5:24",
    defaultDescription: "Enoque era tão amigo de Deus que um dia foi morar no céu sem morrer.",
    promptContext: "Enoch walking on a path of light towards the clouds, holding hands with a glowing divine presence (symbolic), magical, spiritual",
    color: "from-violet-800 to-fuchsia-500"
  },
  {
    id: "fam-4",
    chapterTitle: "Primeiras Famílias",
    stepLabel: "Vovô",
    title: "Matusalém: O Mais Velho",
    bibleVerseReference: "Gênesis 5:27",
    defaultDescription: "Imagine ter quase mil anos! Matusalém foi o vovô mais velho do mundo.",
    promptContext: "Methuselah as a very old but strong wise man with a super long white beard, counting many birthday cakes or candles, funny and cute",
    color: "from-slate-700 to-gray-400"
  },
  {
    id: "fam-5",
    chapterTitle: "Primeiras Famílias",
    stepLabel: "Herói",
    title: "Noé: O Homem Justo",
    bibleVerseReference: "Gênesis 6:8-9",
    defaultDescription: "No meio de tanta gente, Noé amava a Deus e era muito especial.",
    promptContext: "Noah standing proudly maybe holding a blueprint or tool, foreshadowing an ark in background, rainbow colors hint, righteous man",
    color: "from-blue-800 to-indigo-500"
  }
];

type ChapterType = 'CREATION' | 'DESCENDANTS';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [currentChapter, setCurrentChapter] = useState<ChapterType>('CREATION');
  const [levelIndex, setLevelIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState<GeneratedContent | null>(null);
  
  // Cache using story ID as key
  const [cache, setCache] = useState<Record<string, GeneratedContent>>({});

  const levels = currentChapter === 'CREATION' ? CREATION_LEVELS : DESCENDANTS_LEVELS;
  const currentLevel = levels[levelIndex];

  const startGame = () => {
    setCurrentChapter('CREATION');
    setLevelIndex(0);
    setGameState(GameState.PLAYING);
    setContent(null);
  };

  const startNextChapter = () => {
    setCurrentChapter('DESCENDANTS');
    setLevelIndex(0);
    setGameState(GameState.PLAYING);
    setContent(null);
  }

  const handleCreate = async () => {
    if (cache[currentLevel.id]) {
      setContent(cache[currentLevel.id]);
      return;
    }

    setIsLoading(true);
    try {
      const [story, image] = await Promise.all([
        generateStory(currentLevel.title, currentLevel.promptContext),
        generateStoryImage(currentLevel.title, currentLevel.promptContext)
      ]);

      const newContent = { storyText: story, imageUrl: image };
      setCache(prev => ({ ...prev, [currentLevel.id]: newContent }));
      setContent(newContent);
    } catch (error) {
      console.error("Oops", error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextLevel = () => {
    if (levelIndex < levels.length - 1) {
      setLevelIndex(prev => prev + 1);
      setContent(null); 
    } else {
      // Finished current chapter
      if (currentChapter === 'CREATION') {
        setGameState(GameState.CHAPTER_COMPLETE);
      } else {
        setGameState(GameState.GAME_COMPLETED);
      }
    }
  };

  const renderMenu = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-900 via-purple-900 to-slate-900 text-white p-4">
      <div className="max-w-md w-full text-center space-y-8 animate-fade-in">
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/20 shadow-2xl">
          <BookOpen className="w-20 h-20 mx-auto text-yellow-400 mb-4" />
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 mb-2 font-Fredoka">
            Gênesis
          </h1>
          <h2 className="text-2xl font-bold text-blue-200 mb-6">A Aventura da Bíblia</h2>
          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            Descubra como tudo começou e conheça as primeiras famílias do mundo!
          </p>
          <Button onClick={startGame} variant="accent" fullWidth className="text-2xl py-6">
            <Play className="w-8 h-8 fill-current" />
            Começar
          </Button>
        </div>
      </div>
    </div>
  );

  const renderGame = () => (
    <div className={`min-h-screen flex flex-col transition-colors duration-1000 bg-gradient-to-br ${currentLevel.color}`}>
      {/* Header */}
      <div className="p-4 flex justify-between items-center bg-black/20 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="bg-white/20 p-2 rounded-full">
            <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
          </div>
          <div className="flex flex-col">
             <span className="text-xs uppercase tracking-wider opacity-80">{currentLevel.chapterTitle}</span>
             <span className="font-bold text-xl drop-shadow-md">{currentLevel.stepLabel}</span>
          </div>
        </div>
        <div className="text-sm font-medium opacity-80 bg-black/30 px-3 py-1 rounded-full whitespace-nowrap">
          {currentLevel.bibleVerseReference}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-black text-center mb-6 text-white drop-shadow-lg leading-tight">
          {currentLevel.title}
        </h2>

        {/* The Card */}
        <div className="w-full bg-white rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-500 border-4 border-white/30">
          
          {isLoading ? (
            <div className="h-64 md:h-96 flex items-center justify-center bg-slate-800">
              <LoadingSpinner message="Lendo a Bíblia..." />
            </div>
          ) : content ? (
            // Created State
            <div className="relative group">
              <div className="h-64 md:h-96 w-full relative bg-slate-800 overflow-hidden">
                {content.imageUrl ? (
                  <img 
                    src={content.imageUrl} 
                    alt={currentLevel.title} 
                    className="w-full h-full object-cover animate-fade-in transition-transform duration-1000 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400">
                    Imagem indisponível
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                 <p className="text-lg md:text-xl font-medium leading-relaxed drop-shadow-md">
                   {content.storyText}
                 </p>
              </div>
            </div>
          ) : (
            // Before Creation State
            <div className="h-64 md:h-96 flex flex-col items-center justify-center bg-slate-900 text-white p-8 text-center space-y-6">
              <p className="text-xl md:text-2xl text-gray-400 italic font-light">
                "{currentLevel.defaultDescription}"
              </p>
              <Sparkles className="w-12 h-12 text-white/20 animate-pulse" />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="mt-8 w-full max-w-md space-y-4">
          {!content && !isLoading && (
            <Button onClick={handleCreate} variant="accent" fullWidth className="text-2xl animate-bounce">
              <Sparkles className="w-6 h-6" />
              Revelar História
            </Button>
          )}

          {content && (
            <Button onClick={nextLevel} variant="primary" fullWidth className="text-xl">
              Próximo
              <ChevronRight className="w-6 h-6" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Progress Dots */}
      <div className="p-6 flex justify-center gap-2">
        {levels.map((lvl, idx) => (
          <div 
            key={lvl.id}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              idx === levelIndex ? 'bg-white scale-150' : 
              idx < levelIndex ? 'bg-yellow-400' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );

  // Screen between Creation and Descendants
  const renderChapterComplete = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-rose-500 to-orange-600 text-white p-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl text-center space-y-8 animate-fade-in border border-white/30">
        <Star className="w-24 h-24 text-yellow-300 mx-auto animate-spin-slow" />
        <div>
          <h2 className="text-4xl font-black mb-2">Maravilhoso!</h2>
          <p className="text-xl text-white/90">
            Você viu como o mundo foi criado. Mas a história continua!
          </p>
        </div>
        
        <div className="bg-black/20 p-6 rounded-xl">
          <p className="mb-4 font-bold text-lg">Próxima Fase:</p>
          <div className="flex items-center justify-center gap-3 text-2xl font-black text-yellow-300">
             <Users className="w-8 h-8" />
             As Primeiras Famílias
          </div>
        </div>

        <Button onClick={startNextChapter} variant="accent" fullWidth className="text-xl py-5">
           Continuar Aventura
           <ArrowRight className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );

  const renderGameCompleted = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-teal-500 to-green-600 text-white p-4">
       <div className="max-w-md w-full bg-white/95 backdrop-blur-xl text-slate-800 p-8 rounded-3xl shadow-2xl text-center space-y-6 animate-fade-in border-4 border-yellow-400">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-4xl font-black text-green-600">Parabéns!</h2>
          <p className="text-xl text-slate-600">
            Você completou toda a aventura de Gênesis!
          </p>
          <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
            <p className="font-bold text-yellow-800">"Estes são as gerações do céu e da terra..."</p>
            <p className="text-sm text-yellow-600 mt-1">Gênesis 2:4</p>
          </div>
          <div className="pt-4">
            <Button onClick={startGame} variant="primary" fullWidth>
              <RefreshCw className="w-5 h-5" />
              Jogar do Início
            </Button>
          </div>
       </div>
    </div>
  );

  return (
    <>
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      
      {gameState === GameState.MENU && renderMenu()}
      {gameState === GameState.PLAYING && renderGame()}
      {gameState === GameState.CHAPTER_COMPLETE && renderChapterComplete()}
      {gameState === GameState.GAME_COMPLETED && renderGameCompleted()}
    </>
  );
}
