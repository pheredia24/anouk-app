/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as exercises from "../exercises.js";
import type * as http from "../http.js";
import type * as profiles from "../profiles.js";
import type * as scripts_importAnecdotes from "../scripts/importAnecdotes.js";
import type * as scripts_importClassicAndFavouriteSentences from "../scripts/importClassicAndFavouriteSentences.js";
import type * as scripts_runImport from "../scripts/runImport.js";
import type * as sentences from "../sentences.js";
import type * as userProgress from "../userProgress.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  exercises: typeof exercises;
  http: typeof http;
  profiles: typeof profiles;
  "scripts/importAnecdotes": typeof scripts_importAnecdotes;
  "scripts/importClassicAndFavouriteSentences": typeof scripts_importClassicAndFavouriteSentences;
  "scripts/runImport": typeof scripts_runImport;
  sentences: typeof sentences;
  userProgress: typeof userProgress;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
