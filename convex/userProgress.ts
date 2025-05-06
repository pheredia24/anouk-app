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

export const getAnalytics = query({
  args: {},
  handler: async (ctx) => {
    // Get all completions
    const completions = await ctx.db.query("userProgress")
      .filter(q => q.eq(q.field("completed"), true))
      .collect();

    // Get all profiles
    const profiles = await ctx.db.query("profiles").collect();

    // Count completions per profile
    const completionsPerProfile = profiles.map(profile => {
      const count = completions.filter(c => c.profileId === profile._id).length;
      return {
        profileId: profile._id,
        name: profile.name,
        avatarUrl: profile.avatarUrl,
        completions: count,
      };
    }).filter(profile => profile.completions > 0); // Only include profiles with completions

    const allExercises = await ctx.db.query("exercises").collect();

    // Total completed exercises
    const totalCompletions = completions.length;

    // Get daily completions for the last 30 days
    const now = Date.now();
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
    
    const dailyCompletions = completions
      .filter(progress => progress.completedAt >= thirtyDaysAgo)
      .reduce((acc, progress) => {
        const date = new Date(progress.completedAt).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    // Fill in missing days with zero completions
    const dailyData = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(now - (i * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
      dailyData.unshift({
        date,
        completions: dailyCompletions[date] || 0
      });
    }

    // Most recent completions
    const recentCompletions = completions
      .sort((a, b) => b.completedAt - a.completedAt)
      .slice(0, 10);

    // Get exercise details for recent completions
    const recentCompletionsWithDetails = await Promise.all(
      recentCompletions.map(async (completion) => {
        const profile = profiles.find(p => p._id === completion.profileId);
        const exercise = allExercises.find(e => e._id === completion.exerciseId);
        const sentence = exercise 
          ? await ctx.db.get(exercise.sentenceId)
          : null;

        return {
          ...completion,
          profileName: profile?.name || "Unknown",
          profileAvatarUrl: profile?.avatarUrl,
          exerciseMode: exercise?.mode || "unknown",
          sentence: sentence?.text || "Unknown",
          translation: sentence?.translation || "Unknown"
        };
      })
    );

    // Completions by exercise mode
    const completionsByMode = completions.reduce((acc, progress) => {
      const exercise = allExercises.find(e => e._id === progress.exerciseId);
      if (exercise) {
        acc[exercise.mode] = (acc[exercise.mode] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      totalCompletions,
      completionsPerProfile,
      recentCompletionsWithDetails,
      completionsByMode,
      dailyData
    };
  },
}); 