import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const saveProgress = mutation({
  args: {
    profileId: v.id("profiles"),
    exerciseId: v.id("exercises"),
  },
  handler: async (ctx, args) => {
    // Check if progress already exists
    const existing = await ctx.db
      .query("userProgress")
      .withIndex("by_profile_and_exercise", (q) =>
        q.eq("profileId", args.profileId).eq("exerciseId", args.exerciseId)
      )
      .unique();

    if (existing) {
      return existing._id;
    }

    // Create new progress
    const progressId = await ctx.db.insert("userProgress", {
      profileId: args.profileId,
      exerciseId: args.exerciseId,
      completed: true,
      completedAt: Date.now(),
    });

    return progressId;
  },
});

export const getLastCompletedExercise = query({
  args: {
    profileId: v.id("profiles"),
  },
  handler: async (ctx, args) => {
    console.log("[getLastCompletedExercise] profileId:", args.profileId);
    const progress = await ctx.db
      .query("userProgress")
      .withIndex("by_profile", (q) => q.eq("profileId", args.profileId))
      .order("desc")
      .first();

    if (!progress) return null;

    const exercise = await ctx.db.get(progress.exerciseId);
    console.log("[getLastCompletedExercise] exercise:", exercise);
    return exercise;
  },
});

export const hasCompletedAllExercises = query({
  args: {
    profileId: v.id("profiles"),
  },
  handler: async (ctx, args) => {
    // Get total number of exercises
    const totalExercises = await ctx.db.query("exercises").collect();
    
    // Get completed exercises for this profile
    const completedExercises = await ctx.db
      .query("userProgress")
      .withIndex("by_profile", (q) => q.eq("profileId", args.profileId))
      .collect();

    return completedExercises.length >= totalExercises.length;
  },
}); 