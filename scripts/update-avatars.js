import puppeteer from 'puppeteer';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const avatarsToUpdate = [
    { name: 'Irene', emoji: '👘' },
    { name: 'Lucas', emoji: '🚵‍♂️' }
];

async function updateAvatars() {
    const templatePath = join(__dirname, '../public/avatars/avatar-template.html');
    const template = await fs.readFile(templatePath, 'utf8');

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Set viewport to match the avatar size
    await page.setViewport({ width: 400, height: 400 });
    
    for (const profile of avatarsToUpdate) {
        console.log(`Generating avatar for ${profile.name}...`);
        
        // Create temporary HTML file with the emoji
        const html = template.replace('EMOJI_PLACEHOLDER', profile.emoji);
        const tempHtmlPath = join(__dirname, '../public/avatars', `${profile.name.toLowerCase()}-temp.html`);
        await fs.writeFile(tempHtmlPath, html);
        
        // Load the HTML file
        await page.goto(`file://${tempHtmlPath}`);
        
        // Wait a bit for rendering
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Take screenshot
        const pngPath = join(__dirname, '../public/avatars', `${profile.name.toLowerCase()}.png`);
        await page.screenshot({
            path: pngPath,
            omitBackground: true
        });
        
        // Remove the temporary HTML file
        await fs.unlink(tempHtmlPath);
        
        console.log(`Generated avatar for ${profile.name}`);
    }
    
    await browser.close();
    console.log('All avatars updated successfully!');
}

updateAvatars().catch(error => {
    console.error('Failed to update avatars:', error);
    process.exit(1);
}); 