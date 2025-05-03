import { ConvexClient } from "convex/browser";

const DEV_CONVEX_URL = "https://brazen-tern-652.convex.cloud";

async function capitalizeClassicDistractors() {
    console.log('Capitalizing distractor words for classic sentences in development environment...');
    const client = new ConvexClient(DEV_CONVEX_URL);
    
    // Get all sentences
    const sentences = await client.query("sentences:listAll");
    const classicSentences = sentences.filter(sentence => 
        sentence.type === 'classic_sentence' && 
        sentence.distractorWords && 
        sentence.distractorWords.length > 0
    );
    
    console.log(`Found ${classicSentences.length} classic sentences with distractor words`);

    // Update each classic sentence
    for (const sentence of classicSentences) {
        const capitalizedDistractors = sentence.distractorWords.map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        );

        if (JSON.stringify(capitalizedDistractors) !== JSON.stringify(sentence.distractorWords)) {
            await client.mutation("sentences:update", {
                id: sentence._id,
                text: sentence.text,
                translation: sentence.translation,
                distractorWords: capitalizedDistractors,
                explanation: sentence.explanation,
                explanationTranslated: sentence.explanationTranslated,
                type: sentence.type,
                blankWordIndices: sentence.blankWordIndices
            });
            console.log(`Updated distractors for sentence: "${sentence.text}"`);
            console.log(`  Old distractors: ${sentence.distractorWords.join(', ')}`);
            console.log(`  New distractors: ${capitalizedDistractors.join(', ')}`);
        } else {
            console.log(`Skipping sentence "${sentence.text}" - distractors already properly capitalized`);
        }
    }
    
    console.log('\nFinished capitalizing distractor words for classic sentences!');
    process.exit(0);
}

capitalizeClassicDistractors().catch(error => {
    console.error('Failed to capitalize distractor words:', error);
    process.exit(1);
}); 