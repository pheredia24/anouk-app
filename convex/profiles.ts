import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("profiles").collect();
  },
});

export const get = query({
  args: { id: v.id("profiles") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    avatarUrl: v.string(),
    hardMode: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("profiles", {
      name: args.name,
      avatarUrl: args.avatarUrl,
      hardMode: args.hardMode,
    });
  },
});

export const toggleHardMode = mutation({
  args: { id: v.id("profiles") },
  handler: async (ctx, args) => {
    const profile = await ctx.db.get(args.id);
    if (!profile) throw new Error("Profile not found");
    
    await ctx.db.patch(args.id, {
      hardMode: !profile.hardMode,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("profiles"),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    hardMode: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const profile = await ctx.db.get(id);
    if (!profile) throw new Error("Profile not found");
    
    await ctx.db.patch(id, updates);
  },
});
