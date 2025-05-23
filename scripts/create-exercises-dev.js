import { ConvexClient } from "convex/browser";

const DEV_CONVEX_URL = "https://brazen-tern-652.convex.cloud";

async function createExercises() {
    console.log('Creating exercises in development environment...');
    const client = new ConvexClient(DEV_CONVEX_URL);
    
    // Get all sentences
    const sentences = await client.query("sentences:listAll");
    console.log(`Found ${sentences.length} sentences`);

    // Delete existing exercises to avoid duplicates
    const existingExercises = await client.query("exercises:list");
    for (const exercise of existingExercises) {
        await client.mutation("exercises:deleteExercise", { id: exercise._id });
    }
    console.log('Cleared existing exercises');

    // Create one combined exercise per sentence
    console.log('\nCreating combined exercises...');
    for (let i = 0; i < sentences.length; i++) {
        const sentence = sentences[i];
        const order = i + 1;
        
        await client.mutation("exercises:create", {
            sentenceId: sentence._id,
            mode: "audio_and_lecture",
            order: order
        });
        console.log(`Created combined exercise for "${sentence.text}" (order: ${order})`);
    }
    
    console.log('\nAll exercises created successfully in development!');
    process.exit(0);
}

createExercises().catch(error => {
    console.error('Failed to create exercises:', error);
    process.exit(1);
}); 