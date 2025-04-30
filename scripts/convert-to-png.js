import puppeteer from 'puppeteer';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const avatarsDir = join(__dirname, '../public/avatars');

async function convertToPng() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Set viewport to match the avatar size
    await page.setViewport({ width: 400, height: 400 });
    
    // Get all HTML files
    const files = await fs.readdir(avatarsDir);
    const htmlFiles = files.filter(file => file.endsWith('.html') && file !== 'avatar-template.html');
    
    for (const htmlFile of htmlFiles) {
        const htmlPath = join(avatarsDir, htmlFile);
        const pngPath = join(avatarsDir, htmlFile.replace('.html', '.png'));
        
        // Load the HTML file
        await page.goto(`file://${htmlPath}`);
        
        // Wait a bit for rendering
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Take screenshot
        await page.screenshot({
            path: pngPath,
            omitBackground: true
        });
        
        // Remove the HTML file
        await fs.unlink(htmlPath);
        
        console.log(`Converted ${htmlFile} to PNG`);
    }
    
    // Remove the template file
    await fs.unlink(join(avatarsDir, 'avatar-template.html'));
    
    await browser.close();
    console.log('All avatars converted to PNG successfully!');
}

convertToPng().catch(console.error); 