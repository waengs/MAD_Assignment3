# Feature Showcase

A React web application showcasing three working feature concepts: **Text Filtering**, **Speech Synthesis**, and **Video Playback** — with English and Bahasa Indonesia language support.

🌐 **Live Demo:** [https://waengs.github.io/MAD_Assignment3/](https://waengs.github.io/MAD_Assignment3/)

---

## ✨ Features

### 🔍 Text Filter
Compares **four profanity-filtering configurations** side by side:

| Library | Description |
|---------|-------------|
| [`bad-words`](https://www.npmjs.com/package/bad-words) | Simple word-list based replacement |
| [`@2toad/profanity`](https://www.npmjs.com/package/@2toad/profanity) | Regex-based detection & replacement |
| [`obscenity`](https://www.npmjs.com/package/obscenity) | NLP-inspired, highly customizable (English) |
| `obscenity (EN + ID)` | obscenity + custom Indonesian bad word list |

- Enter any text, click **Filter Text**
- All four configurations process it simultaneously
- Results shown side by side with censored words highlighted in red
- Word count shown per library

---

### 🔊 Speech Synthesis (`useSpeech`)
Powered by the [`react-use`](https://github.com/streamich/react-use) `useSpeech` hook and the Web Speech API:

- Choose from all voices available in your browser
- Adjust **Pitch**, **Rate**, and **Volume** with live sliders
- **Play / Pause / Resume / Stop** controls
- Animated waveform while speaking

---

### 🎬 Video Player (`useVideo`)
Powered by the [`react-use`](https://github.com/streamich/react-use) `useVideo` hook:

- **Drag & drop** or click to upload any local video file (MP4, WebM, OGG)
- Custom playback controls: Play, Pause, Mute, Volume
- Seek bar for scrubbing through the video
- Live state display: current time, duration, play/mute status

---

### 🌍 Translations (`react-i18next`)
The entire UI can be switched between **English** and **Bahasa Indonesia** using the dropdown in the top-right corner. The app automatically detects your browser's language on first load.

| Language | Code |
|----------|------|
| English | `en` |
| Bahasa Indonesia | `id` |

---

## 🚀 Getting Started

There are two ways to access this app — through the **live website** or by running it **locally on your own machine**.

### Option 1 — Access the Live Website

The easiest way. No installation required — just open the link in any modern browser:

👉 **[https://waengs.github.io/MAD_Assignment3/](https://waengs.github.io/MAD_Assignment3/)**

The site is hosted on GitHub Pages and is always up to date with the latest version of the `main` branch.

---

### Option 2 — Run Locally on Your Machine

Running locally lets you explore and modify the source code. You will need **Node.js** and **Git** installed first.

**Prerequisites:**
- [Node.js](https://nodejs.org/) version 18 or newer (includes npm)
- [Git](https://git-scm.com/)

**Steps:**

**1. Download the project from GitHub**

Open a terminal (Command Prompt or PowerShell on Windows) and run:

```bash
git clone https://github.com/waengs/MAD_Assignment3.git
```

This creates a folder called `MAD_Assignment3` containing all the project files. Navigate into it:

```bash
cd MAD_Assignment3
```

**2. Install dependencies**

The project uses several npm packages (React, react-use, i18next, etc.). Install them all with:

```bash
npm install
```

This may take a minute the first time. You will see a `node_modules` folder appear — this is normal.

**3. Start the development server**

```bash
npm run dev
```

Vite will start a local server. You will see output like:

```
  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open **http://localhost:5173** in your browser and the app will load. The server supports **hot reload** — any changes you make to the source files will appear in the browser instantly without needing to refresh.

**4. Stop the server**

Press `Ctrl + C` in the terminal to stop the development server.

---

### Other Useful Commands

```bash
# Auto-translate English strings to Indonesian using MyMemory API
npm run translate

# Build the app for production (outputs to dist/ folder)
npm run build

# Preview the production build locally
npm run preview
```

---

## 🛠 Tech Stack

| Tool | Purpose |
|------|---------|
| [React](https://react.dev) + [Vite](https://vite.dev) | UI framework & build tool |
| [react-use](https://github.com/streamich/react-use) | `useSpeech`, `useVideo` hooks |
| [bad-words](https://www.npmjs.com/package/bad-words) | Profanity filter #1 |
| [@2toad/profanity](https://www.npmjs.com/package/@2toad/profanity) | Profanity filter #2 |
| [obscenity](https://www.npmjs.com/package/obscenity) | Profanity filter #3 (+ custom Indonesian list) |
| [i18next](https://www.i18next.com) + [react-i18next](https://react.i18next.com) | Internationalisation |
| [i18next-browser-languagedetector](https://github.com/i18next/i18next-browser-languageDetector) | Auto-detect browser language |

---

## 🌐 Deployment (GitHub Pages)

This project is automatically deployed to GitHub Pages via **GitHub Actions** on every push to `main`. No manual steps are needed after the initial setup.

### One-Time Setup
1. Go to your repo on GitHub → **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Push any commit to `main` — the workflow will build and deploy automatically

The live site will be available at:
```
https://waengs.github.io/MAD_Assignment3/
```

---

## 📁 Project Structure

```
src/
├── main.jsx                 # Entry point
├── App.jsx                  # Root component with tab navigation
├── i18n.js                  # i18next setup — imports locale JSON files
├── index.css                # Global styles (dark glassmorphism theme)
├── locales/
│   ├── en.json              # English strings (source of truth)
│   └── id.json              # Indonesian strings (auto-generated or manual)
└── components/
    ├── Navbar.jsx            # Tab bar + language switcher
    ├── TextFilterPanel.jsx   # Profanity filter comparison panel
    ├── SpeechPanel.jsx       # useSpeech demo panel
    └── VideoPanel.jsx        # useVideo demo panel

scripts/
└── translate.js             # Auto-translation script (MyMemory API)

.github/
└── workflows/
    └── deploy.yml           # GitHub Actions — builds and deploys to Pages
```

---

## 📝 Assignment Notes

This app was built as **MAD Assignment 3** to demonstrate working concepts using:
- NPM packages for text content moderation (`bad-words`, `@2toad/profanity`, `obscenity`)
- GitHub-based React hooks from `react-use` (`useSpeech`, `useVideo`)
- Browser-native Web Speech API for text-to-speech
- Internationalisation with `react-i18next` and JSON locale files
- Automated translation via the MyMemory free API
- CI/CD deployment via GitHub Actions to GitHub Pages
