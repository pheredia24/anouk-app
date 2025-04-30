import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

const templatePath = join(__dirname, '../public/avatars/avatar-template.html');
const template = await fs.readFile(templatePath, 'utf8');

// Create avatars directory if it doesn't exist
const avatarsDir = join(__dirname, '../public/avatars');
try {
    await fs.mkdir(avatarsDir, { recursive: true });
} catch (error) {
    if (error.code !== 'EEXIST') throw error;
}

// Generate HTML files for each profile
for (const profile of profiles) {
    const html = template.replace('EMOJI_PLACEHOLDER', profile.emoji);
    const htmlPath = join(avatarsDir, `${profile.name.toLowerCase()}.html`);
    await fs.writeFile(htmlPath, html);
}

console.log('Avatar HTML files generated successfully!'); 