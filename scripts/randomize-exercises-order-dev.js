import { ConvexClient } from "convex/browser";

const DEV_CONVEX_URL = "https://brazen-tern-652.convex.cloud";

async function randomizeExercisesOrder() {
    console.log('Randomizing exercise order in development environment...');
    const client = new ConvexClient(DEV_CONVEX_URL);
    
    // Get all exercises
    const exercises = await client.query("exercises:list");
    console.log(`Found ${exercises.length} exercises to randomize`);

    // Create array of indices and shuffle it
    const shuffledIndices = Array.from({ length: exercises.length }, (_, i) => i);
    for (let i = shuffledIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledIndices[i], shuffledIndices[j]] = [shuffledIndices[j], shuffledIndices[i]];
    }

    // Update each exercise with its new order
    console.log('\nUpdating exercise orders...');
    for (let i = 0; i < exercises.length; i++) {
        const exercise = exercises[i];
        const newOrder = shuffledIndices[i];
        
        try {
            await client.mutation("exercises:updateOrder", {
                id: exercise._id,
                order: newOrder
            });
            console.log(`Updated exercise for sentence "${exercise.sentenceId}" from order ${exercise.order} to ${newOrder}`);
        } catch (error) {
            console.error(`Failed to update order for exercise ${exercise._id}:`, error);
        }
    }
    
    console.log('\nFinished randomizing exercise order!');
    process.exit(0);
}

randomizeExercisesOrder().catch(error => {
    console.error('Failed to randomize exercises:', error);
    process.exit(1);
}); 