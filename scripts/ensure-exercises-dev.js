import { ConvexClient } from "convex/browser";

const DEV_CONVEX_URL = "https://brazen-tern-652.convex.cloud";

async function ensureExercisesExist() {
    console.log('Checking sentences for missing exercises in development environment...');
    const client = new ConvexClient(DEV_CONVEX_URL);
    
    // Get all sentences and exercises
    const sentences = await client.query("sentences:listAll");
    const exercises = await client.query("exercises:list");
    
    console.log(`Found ${sentences.length} sentences and ${exercises.length} exercises`);

    // Create a map of sentence IDs that have exercises
    const sentencesWithExercises = new Set(
        exercises.map(exercise => exercise.sentenceId)
    );

    // Find sentences without exercises
    const sentencesWithoutExercises = sentences.filter(
        sentence => !sentencesWithExercises.has(sentence._id)
    );

    console.log(`Found ${sentencesWithoutExercises.length} sentences without any exercises`);

    // Create select_one_word exercises for sentences that don't have any
    for (const sentence of sentencesWithoutExercises) {
        try {
            await client.mutation("exercises:create", {
                sentenceId: sentence._id,
                mode: "select_one_word"
            });
            console.log(`Created select-one-word exercise for sentence: "${sentence.text}"`);
        } catch (error) {
            console.error(`Failed to create exercise for sentence "${sentence.text}":`, error);
        }
    }
    
    if (sentencesWithoutExercises.length === 0) {
        console.log('\nAll sentences already have at least one exercise!');
    } else {
        console.log(`\nCreated ${sentencesWithoutExercises.length} new select-one-word exercises`);
    }
    
    process.exit(0);
}

ensureExercisesExist().catch(error => {
    console.error('Failed to check and create exercises:', error);
    process.exit(1);
}); 