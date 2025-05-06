import { query, mutation } from "./_generated/server";
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

export const create = mutation({
  args: {
    text: v.string(),
    translation: v.string(),
    audioUrl: v.optional(v.string()),
    distractorWords: v.optional(v.array(v.string())),
    explanation: v.optional(v.string()),
    explanationTranslated: v.optional(v.string()),
    addedBy: v.optional(v.string()),
    blankWordIndices: v.optional(v.array(v.number())),
    type: v.optional(v.union(
      v.literal("anecdote"),
      v.literal("classic_sentence"),
      v.literal("favourite_sentence")
    )),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("sentences", {
      ...args,
      lastModified: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("sentences"),
    text: v.string(),
    translation: v.string(),
    audioUrl: v.optional(v.string()),
    distractorWords: v.optional(v.array(v.string())),
    explanation: v.optional(v.string()),
    explanationTranslated: v.optional(v.string()),
    blankWordIndices: v.optional(v.array(v.number())),
    type: v.optional(v.union(
      v.literal("anecdote"),
      v.literal("classic_sentence"),
      v.literal("favourite_sentence")
    )),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    return await ctx.db.patch(id, {
      ...rest,
      lastModified: Date.now(),
    });
  },
});

export const getRecentSentences = query({
  handler: async (ctx) => {
    const sentences = await ctx.db
      .query("sentences")
      .withIndex("by_lastModified")
      .order("desc")
      .take(10);
    return sentences;
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

// Backfill lastModified field for existing sentences
export const backfillLastModified = mutation({
  handler: async (ctx) => {
    const sentences = await ctx.db.query("sentences").collect();
    
    for (const sentence of sentences) {
      if (!sentence.lastModified) {
        await ctx.db.patch(sentence._id, {
          lastModified: Date.now(),
        });
      }
    }
  },
});
