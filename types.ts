export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  CHAPTER_COMPLETE = 'CHAPTER_COMPLETE',
  GAME_COMPLETED = 'GAME_COMPLETED',
  ERROR = 'ERROR'
}

export interface StoryLevel {
  id: string;
  chapterTitle: string; // e.g., "A Criação"
  stepLabel: string;    // e.g., "Dia 1" or "Parte 1"
  title: string;
  bibleVerseReference: string;
  defaultDescription: string;
  promptContext: string;
  color: string;
}

export interface GeneratedContent {
  storyText: string;
  imageUrl: string | null;
}
