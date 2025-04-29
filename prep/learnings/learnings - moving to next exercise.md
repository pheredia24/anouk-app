# Debugging & Refactoring Learnings

1. **Sort Data Before Indexing**  
   - Always order your data (by `order` in this case) before using `findIndex` or direct indexing to avoid mismatches.

2. **Wait for Data to Load**  
   - In effects, guard against empty arrays. Only run restore logic once actual data is available.

3. **Accurate Restore Flag Logic**  
   - Don’t set your “ran once” flag until you’ve either restored or confirmed nothing to restore.

4. **Strategic Logging**  
   - Place logs at:
     - Data-fetch start/end (Convex query & hook)
     - Effect entry and exit points
     - Before and after key state changes (`findIndex`, `setCurrentIndex`)

5. **Keep Components Lean**  
   - Push data-fetch and state-math into hooks (`useExerciseData`)
   - Keep component focused on UI and flow.

These guidelines help catch off-by-one bugs and ensure predictable state restoration.
