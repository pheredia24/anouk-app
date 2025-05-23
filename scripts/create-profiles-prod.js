import { ConvexClient } from "convex/browser";

const PROD_CONVEX_URL = "https://wandering-bird-460.convex.cloud";

const profiles = [
    { name: 'Clau', emoji: '👑' },
    { name: 'Falero', emoji: '🐍' },
    { name: 'Javs', emoji: '🥃' },
    { name: 'Ame', emoji: '🦬' },
    { name: 'Paula', emoji: '🦈' },
    { name: 'Alex', emoji: '🇨🇦' },
    { name: 'Lucas', emoji: '🇵🇪' },
    { name: 'Almu', emoji: '🎻' },
    { name: 'Guille', emoji: '🔬' },
    { name: 'Toño', emoji: '🩻' },
    { name: 'Pablo', emoji: '🏄‍♂️' },
    { name: 'Juli', emoji: '🎷' },
    { name: 'Anouk', emoji: '🌿' },
    { name: 'Juan', emoji: '💨' },
    { name: 'Clara', emoji: '🥨' },
    { name: 'Jaime', emoji: '🎸' },
    { name: 'Nerea', emoji: '🏂' },
    { name: 'Manuela', emoji: '🐈' },
    { name: 'Irene', emoji: '🎼' }
];

async function createProfiles() {
    console.log('Creating profiles in production environment...');
    const client = new ConvexClient(PROD_CONVEX_URL);
    
    for (const profile of profiles) {
        try {
            await client.mutation('profiles:create', {
                name: profile.name,
                avatarUrl: `/avatars/${profile.name.toLowerCase()}.png`,
                hardMode: false,
            });
            console.log(`Created profile for ${profile.name}`);
        } catch (error) {
            console.error(`Error creating profile for ${profile.name}:`, error);
        }
    }
    
    console.log('All profiles created successfully in production!');
    process.exit(0);
}

createProfiles().catch(error => {
    console.error('Failed to create profiles:', error);
    process.exit(1);
}); 