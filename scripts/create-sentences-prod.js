import { ConvexClient } from "convex/browser";
import fs from 'fs/promises';
import { parse } from 'csv-parse/sync';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROD_CONVEX_URL = "https://wandering-bird-460.convex.cloud";

async function createSentences() {
    console.log('Creating sentences in production environment...');
    const client = new ConvexClient(PROD_CONVEX_URL);
    
    // Read and parse the CSV file
    const csvPath = path.join(__dirname, '../prep/Spanish_Words_Dataset__with_English_text_column_.csv');
    const csvContent = await fs.readFile(csvPath, 'utf-8');
    const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true
    });

    // Create sentences
    for (const record of records) {
        try {
            const sentence = {
                text: record.text,
                translation: record.translation,
                audioUrl: record.audioUrl || undefined,
                distractorWords: record.distractorWords ? record.distractorWords.split(',') : undefined,
                explanation: record.explanation || undefined,
                explanationTranslated: record.explanationTranslated || undefined,
                addedBy: record.addedBy || undefined,
            };

            await client.mutation('sentences:create', sentence);
            console.log(`Created sentence: "${sentence.text}" -> "${sentence.translation}" (Added by: ${sentence.addedBy || 'unknown'})`);
        } catch (error) {
            console.error(`Error creating sentence "${record.text}":`, error);
        }
    }
    
    console.log('All sentences created successfully in production!');
    process.exit(0);
}

createSentences().catch(error => {
    console.error('Failed to create sentences:', error);
    process.exit(1);
}); 