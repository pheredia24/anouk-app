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