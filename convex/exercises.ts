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

export const create = mutation({
  args: {
    sentenceId: v.id("sentences"),
    mode: v.union(v.literal("lecture"), v.literal("audio")),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("exercises", args);
  },
});

export const deleteExercise = mutation({
  args: {
    id: v.id("exercises"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
