import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("exercises")
      .withIndex("by_order")
      .order("asc")
      .collect();
  },
});

export const getMaxOrder = query({
  args: {},
  handler: async (ctx) => {
    const exercises = await ctx.db
      .query("exercises")
      .withIndex("by_order")
      .order("desc")
      .take(1);
    
    return exercises.length > 0 ? exercises[0].order : -1;
  },
});

export const create = mutation({
  args: {
    sentenceId: v.id("sentences"),
    mode: v.union(
      v.literal("lecture"),
      v.literal("audio"),
      v.literal("audio_and_lecture"),
      v.literal("select_one_word"),
      v.literal("fill_in_blank")
    ),
  },
  handler: async (ctx, args) => {
    // Get the current max order
    const exercises = await ctx.db
      .query("exercises")
      .withIndex("by_order")
      .order("desc")
      .take(1);
    
    const nextOrder = exercises.length > 0 ? exercises[0].order + 1 : 0;

    // Create the exercise with the next order
    return await ctx.db.insert("exercises", {
      ...args,
      order: nextOrder,
    });
  },
});

export const deleteExercise = mutation({
  args: { id: v.id("exercises") },
  handler: async (ctx, args) => {
    const exercise = await ctx.db.get(args.id);
    if (!exercise) throw new Error("Exercise not found");
    await ctx.db.delete(args.id);
  },
});

export const updateOrder = mutation({
  args: {
    id: v.id("exercises"),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { order: args.order });
  },
});

export const updateMode = mutation({
  args: {
    id: v.id("exercises"),
    mode: v.union(
      v.literal("lecture"),
      v.literal("audio"),
      v.literal("audio_and_lecture"),
      v.literal("select_one_word"),
      v.literal("fill_in_blank")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { mode: args.mode });
  },
});

export const randomizeOrder = mutation({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    // Get all exercises
    const exercises = await ctx.db.query("exercises").collect();
    
    // Create array of indices and shuffle it
    const shuffledIndices = Array.from({ length: exercises.length }, (_, i) => i);
    for (let i = shuffledIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledIndices[i], shuffledIndices[j]] = [shuffledIndices[j], shuffledIndices[i]];
    }

    // Update each exercise with its new order
    for (let i = 0; i < exercises.length; i++) {
      const exercise = exercises[i];
      await ctx.db.patch(exercise._id, { order: shuffledIndices[i] });
    }

    return exercises.length;
  },
});

export const cleanupOrphaned = mutation({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    // Get all exercises and sentences
    const exercises = await ctx.db.query("exercises").collect();
    const sentences = await ctx.db.query("sentences").collect();
    
    // Create a Set of sentence IDs for faster lookup
    const sentenceIds = new Set(sentences.map(s => s._id));
    
    // Find and delete orphaned exercises
    let deletedCount = 0;
    for (const exercise of exercises) {
      if (!sentenceIds.has(exercise.sentenceId)) {
        await ctx.db.delete(exercise._id);
        deletedCount++;
      }
    }
    
    return deletedCount;
  },
});

export const getRecentExercises = query({
  handler: async (ctx) => {
    const exercises = await ctx.db
      .query("exercises")
      .order("desc")
      .take(10);

    // Fetch associated sentences
    const exercisesWithSentences = await Promise.all(
      exercises.map(async (exercise) => {
        const sentence = await ctx.db.get(exercise.sentenceId);
        return {
          ...exercise,
          sentence
        };
      })
    );

    return exercisesWithSentences;
  },
});