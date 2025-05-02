export const LANGUAGES = {
  source: "English",
  target: "Spanish",
};

export const UI_STRINGS = {
  welcome: {
    title: "¡Bienvenida a Anouk's Spanish Journey!",
    subtitle: "Start your Spanish adventure today!",
    startButton: "¡Vamos!",
  },
  exercise: {
    instructions: {
      lecture: "Translate this sentence to Spanish:",
      audio: "Listen and select the correct Spanish words:",
    },
    feedback: {
      correct: "¡Excelente!",
      incorrect: "¡Inténtalo de nuevo!",
    },
  },
  profile: {
    select: "Choose your profile",
    create: "Create new profile",
  },
};

// Styling constants
export const COLORS = {
  primary: "#58CC02",    // Green
  secondary: "#1CB0F6",  // Blue
  error: "#FF4B4B",      // Red
  surface: "#F0F0F0",    // Light gray
};

export const DIFFICULTY_LEVELS = {
  BEGINNER: 1,
  INTERMEDIATE: 2,
  ADVANCED: 3,
} as const;

export const SENTENCE_TYPE_INTROS = {
  anecdote: "Un recuerdo bonito que tengo con Anouk es…",
  classic_sentence: "En el grupo usamos esta expresión para decir…",
  favourite_sentence: "La palabra que esta persona cree que Anouk debe conocer es…",
} as const;

export type SentenceType = keyof typeof SENTENCE_TYPE_INTROS; 