import { mutation } from "../_generated/server";
import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { v } from "convex/values";

interface ImportResult {
  message: string;
  results: Id<"sentences">[];
}

export const runAnecdotesImport = mutation({
  args: {},
  returns: v.object({
    message: v.string(),
    results: v.array(v.id("sentences"))
  }),
  handler: async (ctx): Promise<ImportResult> => {
    // @ts-ignore - Internal mutation reference typing issue
    return await ctx.runMutation(internal.scripts.importAnecdotes, {});
  },
});

export const runClassicAndFavouriteSentencesImport = mutation({
  args: {},
  returns: v.object({
    message: v.string(),
    results: v.array(v.id("sentences"))
  }),
  handler: async (ctx): Promise<ImportResult> => {
    // @ts-ignore - Internal mutation reference typing issue
    return await ctx.runMutation(internal.scripts.importClassicAndFavouriteSentences, {});
  },
}); 