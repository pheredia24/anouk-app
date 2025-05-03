import { ConvexClient } from "convex/browser";

const DEV_CONVEX_URL = "https://brazen-tern-652.convex.cloud";

async function cleanupOrphanedExercises() {
    console.log('Starting cleanup of orphaned exercises...');
    const client = new ConvexClient(DEV_CONVEX_URL);
    
    try {
        // Get all exercises and sentences
        const exercises = await client.query("exercises:list");
        const sentences = await client.query("sentences:listAll");
        
        // Create a Set of sentence IDs for faster lookup
        const sentenceIds = new Set(sentences.map(s => s._id));
        
        // Find orphaned exercises
        const orphanedExercises = exercises.filter(exercise => !sentenceIds.has(exercise.sentenceId));
        
        if (orphanedExercises.length === 0) {
            console.log('No orphaned exercises found!');
            process.exit(0);
        }

        console.log(`Found ${orphanedExercises.length} orphaned exercises. Deleting...`);
        
        // Delete orphaned exercises
        for (const exercise of orphanedExercises) {
            try {
                await client.mutation("exercises:deleteExercise", { id: exercise._id });
                console.log(`Deleted exercise ${exercise._id} (linked to missing sentence ${exercise.sentenceId})`);
            } catch (error) {
                console.error(`Failed to delete exercise ${exercise._id}:`, error);
            }
        }
        
        console.log('\nCleanup completed successfully!');
    } catch (error) {
        console.error('Error during cleanup:', error);
        process.exit(1);
    }
    
    process.exit(0);
}

cleanupOrphanedExercises().catch(error => {
    console.error('Failed to run cleanup:', error);
    process.exit(1);
}); 