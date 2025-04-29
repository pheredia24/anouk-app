import { query } from "./_generated/server";
import { v } from "convex/values";
import { DIFFICULTY_LEVELS } from "../src/lib/constants";

export const get = query({
  args: { id: v.id("sentences") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("sentences").collect();
  },
});

export type Sentence = {
  id?: string;
  source: string;
  target: string;
  difficulty: number;
  tags?: string[];
  audioUrl?: string;
  notes?: string;
};

// Example sentences - replace with your own content
export const sentences: Sentence[] = [
  {
    source: "Hello",
    target: "Hola",
    difficulty: DIFFICULTY_LEVELS.BEGINNER,
    tags: ["greetings"],
  },
  {
    source: "How are you?",
    target: "¿Cómo estás?",
    difficulty: DIFFICULTY_LEVELS.BEGINNER,
    tags: ["greetings", "questions"],
  },
  {
    source: "I would like a coffee, please",
    target: "Quisiera un café, por favor",
    difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
    tags: ["food", "restaurant"],
  },
  {
    source: "What time is the next train?",
    target: "¿A qué hora es el próximo tren?",
    difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
    tags: ["transport", "questions"],
  },
  {
    source: "I have been living here for three years",
    target: "He vivido aquí durante tres años",
    difficulty: DIFFICULTY_LEVELS.ADVANCED,
    tags: ["personal", "time"],
  },
];

// Helper function to get sentences by difficulty
export const getSentencesByDifficulty = (difficulty: number) => {
  return sentences.filter(sentence => sentence.difficulty === difficulty);
};

// Helper function to get sentences by tag
export const getSentencesByTag = (tag: string) => {
  return sentences.filter(sentence => sentence.tags?.includes(tag));
};
