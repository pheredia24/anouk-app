# Bealingo Template

A template for creating a language learning web application with React, Vite, and Convex. This template is based on a French learning app but can be customized for any language pair.

## Features

- 🎯 Exercise-based learning with two modes:
  - `lecture`: Translation exercises with word chips
  - `audio`: Audio comprehension with word chips
- 👨‍👩‍👧‍👦 Multiple user profiles without authentication
- 🔄 Progress tracking and restoration
- 🌍 Bilingual explanations
- 🎉 Interactive feedback with animations and sound effects
- 📱 Mobile-first responsive design

## Tech Stack

- **Frontend**: React + Vite
  - UI: shadcn/ui + Tailwind CSS
  - State: Zustand (local) + Convex hooks (server)
  - Animations: Canvas confetti
- **Backend**: Convex Functions & Database
- **Hosting**: Vercel (frontend) + Convex Cloud (backend)
- **Audio**: Supabase Storage (optional)

## Quick Start

1. **Use this template**
   ```bash
   # Clone the repository
   git clone https://github.com/yourusername/bealingo-template.git my-language-app
   cd my-language-app

   # Install dependencies
   npm install
   ```

2. **Set up your backend**
   ```bash
   # Install Convex CLI if you haven't already
   npm install -g convex

   # Login to Convex
   npx convex login

   # Initialize your Convex project
   npx convex init
   ```

3. **Configure environment variables**
   ```bash
   # Copy the environment template
   cp .env.example .env

   # Add your credentials:
   # - CONVEX_DEPLOYMENT (from Convex dashboard)
   # - SUPABASE_URL and SUPABASE_ANON_KEY (if using audio features)
   ```

4. **Customize for your language**
   - Update `convex/sentences.ts` with your own phrases
   - Modify UI text in `src/lib/constants.ts`
   - Adjust styling in `tailwind.config.js`

5. **Start development**
   ```bash
   npm run dev
   ```

## Project Structure

```
my-language-app/
├── src/                      # Frontend source code
│   ├── components/           # React components
│   │   ├── exercise/        # Exercise-related components
│   │   └── ui/             # shadcn UI components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities and store
│   └── App.tsx             # Main app component
├── convex/                   # Backend code
│   ├── schema.ts           # Database schema
│   ├── sentences.ts        # Sentence operations
│   ├── exercises.ts        # Exercise operations
│   ├── profiles.ts         # Profile management
│   └── userProgress.ts     # Progress tracking
├── public/                   # Static assets
└── sounds/                   # Sound effects
```

## Customization Guide

### 1. Language Configuration
Edit `src/lib/constants.ts` to set up your language pair:
```typescript
export const LANGUAGES = {
  source: "English",
  target: "Spanish", // or any language
};
```

### 2. Exercise Content
Modify `convex/sentences.ts` to add your own content:
```typescript
export const sentences = [
  {
    source: "Hello",
    target: "Hola",
    difficulty: 1,
  },
  // Add more sentences
];
```

### 3. Styling
The app uses a customized version of shadcn/ui. Modify these files to match your brand:
- `tailwind.config.js`: Colors and theme
- `components.json`: UI component configuration

### 4. Audio Features (Optional)
If you want to include audio:
1. Set up a Supabase project
2. Create a storage bucket
3. Upload audio files matching your sentence IDs
4. Configure environment variables

## Deployment

1. **Frontend (Vercel)**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Deploy
   vercel
   ```

2. **Backend (Convex)**
   ```bash
   # Deploy Convex functions
   npx convex deploy
   ```

## Environment Variables

Create a `.env` file with:
```
CONVEX_DEPLOYMENT=your_deployment_id
CONVEX_URL=your_convex_url

# If using audio features:
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_BUCKET_NAME=your_bucket_name

# Optional:
ADMIN_PASSWORD=your_admin_password
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this template for your own language learning projects.

## Support

If you find this template helpful, please give it a star ⭐️

For issues and feature requests, please use the GitHub issues page.
