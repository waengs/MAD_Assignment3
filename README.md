# Feature Showcase

A React web application showcasing three working feature concepts: **Text Filtering**, **Speech Synthesis**, and **Video Playback** — with full multi-language support.

🌐 **Live Demo:** [https://waengs.github.io/MAD_Assignment3/](https://waengs.github.io/MAD_Assignment3/)

---

## ✨ Features

### 🔍 Text Filter
Compares **three profanity-filtering libraries** side by side:

| Library | Description |
|---------|-------------|
| [`bad-words`](https://www.npmjs.com/package/bad-words) | Simple word-list based replacement |
| [`@2toad/profanity`](https://www.npmjs.com/package/@2toad/profanity) | Regex-based detection & replacement |
| [`obscenity`](https://www.npmjs.com/package/obscenity) | NLP-inspired, highly customizable |

- Enter any text, click **Filter Text**
- All three libraries process it simultaneously
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
The entire UI can be switched between **6 languages** using the dropdown in the top-right corner:

| Language | Code |
|----------|------|
| English | `en` |
| Español | `es` |
| Français | `fr` |
| Bahasa Indonesia | `id` |
| 日本語 | `ja` |
| العربية | `ar` |

Arabic automatically switches the layout to **RTL** (right-to-left).

---

## 🛠 Tech Stack

| Tool | Purpose |
|------|---------|
| [React](https://react.dev) + [Vite](https://vite.dev) | UI framework & build tool |
| [react-use](https://github.com/streamich/react-use) | `useSpeech`, `useVideo` hooks |
| [bad-words](https://www.npmjs.com/package/bad-words) | Profanity filter #1 |
| [@2toad/profanity](https://www.npmjs.com/package/@2toad/profanity) | Profanity filter #2 |
| [obscenity](https://www.npmjs.com/package/obscenity) | Profanity filter #3 |
| [i18next](https://www.i18next.com) + [react-i18next](https://react.i18next.com) | Internationalization |
| [i18next-browser-languagedetector](https://github.com/i18next/i18next-browser-languageDetector) | Auto-detect browser language |

---

## 🚀 Running Locally

**Prerequisites:** Node.js 18+ and npm

```bash
# 1. Clone the repo
git clone https://github.com/waengs/MAD_Assignment3.git
cd MAD_Assignment3

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## 📦 Building for Production

```bash
npm run build
```

The built files will be output to the `dist/` folder.

---

## 🌐 Deployment (GitHub Pages)

This project is automatically deployed to GitHub Pages via **GitHub Actions** on every push to `main`.

### Manual Setup (one-time)
1. Go to your repo → **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Push to `main` — the workflow will build and deploy automatically

The live site will be available at:
```
https://waengs.github.io/MAD_Assignment3/
```

---

## 📁 Project Structure

```
src/
├── main.jsx              # Entry point
├── App.jsx               # Root component with tab navigation
├── i18n.js               # i18next setup with all 6 language translations
├── index.css             # Global styles (dark glassmorphism theme)
└── components/
    ├── Navbar.jsx         # Tab bar + language switcher
    ├── TextFilterPanel.jsx  # Profanity filter comparison panel
    ├── SpeechPanel.jsx    # useSpeech demo panel
    └── VideoPanel.jsx     # useVideo demo panel
```

---

## 📝 Assignment Notes

This app was built as **MAD Assignment 3** to demonstrate working concepts using:
- NPM packages for text content moderation
- GitHub-based React hooks from `react-use`
- Browser-native Web Speech API
- Internationalization with `react-i18next`
