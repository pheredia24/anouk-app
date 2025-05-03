import { ConvexClient } from "convex/browser";

const DEV_CONVEX_URL = "https://brazen-tern-652.convex.cloud";

async function updateSpecificAvatars() {
    console.log('Updating specific avatars in development environment...');
    const client = new ConvexClient(DEV_CONVEX_URL);
    
    // Get all profiles
    const profiles = await client.query("profiles:list");
    
    // Find Irene and Lucas's profiles
    const ireneProfile = profiles.find(p => p.name === 'Irene');
    const lucasProfile = profiles.find(p => p.name === 'Lucas');

    if (ireneProfile) {
        try {
            await client.mutation("profiles:update", {
                id: ireneProfile._id,
                name: ireneProfile.name,
                avatarUrl: `https://api.dicebear.com/7.x/emoji/svg?seed=Irene&emoji=👘`,
                hardMode: ireneProfile.hardMode
            });
            console.log('Updated Irene\'s avatar');
        } catch (error) {
            console.error('Failed to update Irene\'s avatar:', error);
        }
    } else {
        console.log('Could not find Irene\'s profile');
    }

    if (lucasProfile) {
        try {
            await client.mutation("profiles:update", {
                id: lucasProfile._id,
                name: lucasProfile.name,
                avatarUrl: `https://api.dicebear.com/7.x/emoji/svg?seed=Lucas&emoji=🚵‍♂️`,
                hardMode: lucasProfile.hardMode
            });
            console.log('Updated Lucas\'s avatar');
        } catch (error) {
            console.error('Failed to update Lucas\'s avatar:', error);
        }
    } else {
        console.log('Could not find Lucas\'s profile');
    }
    
    console.log('\nFinished updating avatars!');
    process.exit(0);
}

updateSpecificAvatars().catch(error => {
    console.error('Failed to update avatars:', error);
    process.exit(1);
}); 