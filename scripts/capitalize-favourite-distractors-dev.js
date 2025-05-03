import { ConvexClient } from "convex/browser";

const DEV_CONVEX_URL = "https://brazen-tern-652.convex.cloud";

async function capitalizeFavouriteDistractors() {
    console.log('Capitalizing first word of distractor words for favourite sentences in development environment...');
    const client = new ConvexClient(DEV_CONVEX_URL);
    
    // Get all sentences
    const sentences = await client.query("sentences:listAll");
    const favouriteSentences = sentences.filter(sentence => 
        sentence.type === 'favourite_sentence' && 
        sentence.distractorWords && 
        sentence.distractorWords.length > 0
    );
    
    console.log(`Found ${favouriteSentences.length} favourite sentences with distractor words`);

    // Update each favourite sentence
    for (const sentence of favouriteSentences) {
        const capitalizedDistractors = sentence.distractorWords.map(phrase => {
            // Split the phrase into words
            const words = phrase.split(' ');
            // Capitalize only the first word, leave the rest unchanged
            if (words.length > 0) {
                words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
            }
            return words.join(' ');
        });

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
    
    console.log('\nFinished capitalizing distractor words for favourite sentences!');
    process.exit(0);
}

capitalizeFavouriteDistractors().catch(error => {
    console.error('Failed to capitalize distractor words:', error);
    process.exit(1);
}); 