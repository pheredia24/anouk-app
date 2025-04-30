## Product Requirements Document — "Mini Duolingo" Anouk's Birthday App  
*Updated 30 April 2025*  

---

### 1 . Goal  
Deliver a lightweight, mobile‑first web application that helps our friend Anouk practise Spanish using the funny phrases we already collected.  
The app must:

* present each exercise one at a time, in order;  
* track progress for several *profiles* (no authentication);  
* provide a desktop‑only admin page for sorting and editing exercises.

**All on‑screen copy must be in Spanish** (except the sentences being translated).  
Code, comments and documentation remain in English.

---

### 2 . Functional Scope  

#### 2.1 Screens  

| Screen | Purpose & behaviour | Key French copy |
|--------|---------------------|-----------------|
| **Splash** | Shows logo → fades to a single CTA. | Button : **« Comenzar »** |
| **Welcome** | Shows welcome message | Button : **« ¡Vamos! »** |
| **Profile selection** | Lists family profiles (avatar + name). | Title : **« ¿Quién anda ahí? »** |
| **Exercise** | Displays one exercise, records answer, shows either success message with explanation or correction, then "Next" if the solution is correct | Buttons : **« Enviar »**, **« Siguiente »**|
| **Admin (desktop)** | Drag‑and‑drop to reorder, edit form for every exercise. Protected by a single password. | Buttons : **« Guardar cambios »**, **« Añadir un ejercicio »** |

#### 2.2 Exercise Types  

| ID | Name | Prompt to user | Interaction |
|----|-----------|---------------|-------------|
| `lecture` | Lecture | English sentence is shown. | Tap chips to build the Spanish sentence in order. |
| `audio`   | Audio   | English audio auto-plays (with Replay). | Tap chips to build the Spanish sentence in order. |

*Hard Mode* (profile toggle) is planned for a future update. It will replace the chips with a blank input where the user types the sentence.

#### 2.3 User Flow  

    Splash → "Commencer"
    - Welcome Screen
    → Profile selection  
    → Fetch next exercise (by `order`)  
    → User answers → fuzzy auto‑correction → result screen  
    → Save progress → "Suivant"  
    → Repeat until last exercise → Show full list of sentences at the end.

---

### 3 . Product Rules  

| # | Rule | Acceptance criteria |
|---|------|---------------------|
| 1 | No external authentication | Profile list lives in Convex; user only *selects* a profile. |
| 2 | Mobile‑first | Designed for width ≤ 390 px; stretches gracefully to 768 px. |
| 3 | 100 % French UI | All static copy in French; only exercise sentences may be Spanish/English. |

---

### 4 . Data Model (Convex)  

    // see original prompt for full types
    Sentence      // base phrase + audio + distractors
    Exercise      // sentence_id, mode, order
    Profile       // name, avatar_url
    UserProgress  // profile_id, exercise_id, completed, completed_at

Key points  

* One **Exercise** record per sentence × mode.
* `order` controls global sequence; admin page edits it.  
* `distractor_words` optional — if null, only true words appear in chips.  

---

### 5 . UX Details  

* **Progress bar**: "Exercice X / Y".  
* **Chip UI**:  
  * Words shuffled with any distractors; rendered as shadcn "badge" components.  
  * Tap‑to‑append.  
* **Hard Mode toggle**: Persistently visible in Exercise screen.  
* **Audio replay**: icon button "volume_up".  
* **Error feedback**:  
  * Show correct answer with incorrect tokens red, correct ones green.  
  * Toast "Très bien !" or "Presque !" before "Suivant".  

---

### 6 . Architecture & Technology  

| Layer | Stack & libraries |
|-------|------------------|
| Frontend | React + Vite • shadcn/ui (Tailwind) • Zustand (local state) • React Query (Convex hooks) |
| Backend  | Convex Functions & database |
| Hosting  | Vercel (frontend static) • Convex Cloud |
| Audio    | Static files hosted on Supabase storage, played via HTML5 `<audio>` |
| Feedback | Canvas confetti for celebrations • Custom sound effects for correct/incorrect answers |
| Tests    | Playwright (mobile viewport) for happy path and fuzzy-match regression |

---

### 7 . UI Details

* **Palette** : `duo-green #58CC02` (primary), `duo-blue #1CB0F6` (links), `duo-red #FF4B4B` (errors), light grey `#F0F0F0` for surfaces.  
* **Fonts** : display → `Baloo 2 800` (fallback for Feather); body → `Nunito Sans 400/600`.  
* **Shapes** : 16 px base grid, `border-radius: 1rem` on cards, `9999px` on chips; shadow `0 2px 4px rgb(0 0 0 / 6 %)`.  
* **Motion** : 200 ms ease-out on hover; "pop" (`scale(1.05 → 1)`) on correct answer.  
* **shadcn tweaks** :  
  * Button → `rounded-full bg-[#58CC02] text-white hover:bg-[#89E219]`  
  * Word chip → `rounded-full bg-white shadow px-3 py-1 text-gray-700`

---

### 8 . Additional Features Implemented

* **Bilingual Explanations**: Support for both French and Spanish explanations with language toggle
* **Sound Effects**: Audio feedback for correct/incorrect answers
* **Progress Restoration**: Automatic restoration of user progress on page refresh
* **Exercise Flow**: Optimized state management to prevent exercise skipping and maintain proper progression
* **Accessibility**: ARIA labels and proper semantic HTML throughout the application
* **Celebration Effects**: Confetti animation on correct answers
* **Error Handling**: Toast notifications for user feedback
* **Responsive Design**: Mobile-first implementation with proper desktop support

### 9 . Planned Future Updates

* Implementation of Hard Mode with text input
* Admin panel for exercise management and reordering
* Enhanced progress analytics
* Performance optimizations for audio preloading

---

**End of PRD**
