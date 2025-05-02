import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  sentences: defineTable({
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
  }),

  exercises: defineTable({
    sentenceId: v.id("sentences"),
    mode: v.union(
      v.literal("lecture"),
      v.literal("audio"),
      v.literal("audio_and_lecture"),
      v.literal("select_one_word"),
      v.literal("fill_in_blank")
    ),
    order: v.number(),
  }).index("by_order", ["order"]),

  profiles: defineTable({
    name: v.string(),
    avatarUrl: v.string(),
    hardMode: v.boolean(),
  }),

  userProgress: defineTable({
    profileId: v.id("profiles"),
    exerciseId: v.id("exercises"),
    completed: v.boolean(),
    completedAt: v.number(),
  })
    .index("by_profile", ["profileId"])
    .index("by_profile_and_exercise", ["profileId", "exerciseId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
