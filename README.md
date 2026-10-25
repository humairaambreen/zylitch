# Zylitch (Next.js + React)

A modern, high-performance port of the **Zylitch** creative agency portfolio website, built with **Next.js (App Router)**, **React 19**, **GSAP Flip**, and **Lenis**.

## Key Features Preserved

- **Pastel Pink Aesthetics**: Handcrafted design tokens (`--pink-bg`, `--pink-primary`, `--pink-deep`, etc.) and typography using **Satoshi** & **General Sans**.
- **Longcat Spinner**: 30-segment animated circular walking cat loading screen that synchronizes with video metadata before smoothly fading away.
- **Directional Paw Trail Cursor**: Custom cursor that tracks mouse movement angle (`atan2`), triggers walking paw prints while moving, and settles into resting paws when idle.
- **Horizontal Smooth Scroll**: Powered by **Lenis** with alternating vertical offsets for gallery cards.
- **GSAP Flip Transitions**: Seamless morph animation from horizontal gallery cards to the center-stage detail presentation without video reloading or aspect-ratio distortion.
- **Split Typography Animations**: Top & bottom titles split into characters with clipping reveals and differential blend modes; description text blocks split into animated lines.
- **Zero Video Cropping**: Aspect-ratio preserving fitting algorithm (`getFitSize`) that calculates optimal container dimensions dynamically across all device sizes.

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
npm run start
```

## Project Structure

```
zylitch-next/
├── public/
│   └── assets/              # Video portfolio assets
├── src/
│   ├── app/
│   │   ├── globals.css      # Custom styles, animations, variables, cursor & loader
│   │   ├── layout.tsx       # Root layout & SVG symbols
│   │   └── page.tsx         # Main page orchestrator
│   ├── components/
│   │   ├── Gallery.tsx      # (Optional standalone modular export)
│   │   ├── Loader.tsx       # 30-segment Longcat loading screen
│   │   ├── Navbar.tsx       # Glassmorphism navigation bar
│   │   ├── PawCursor.tsx    # Direction-following paw cursor
│   │   ├── PortfolioExperience.tsx # GSAP Flip + Lenis horizontal scroll experience
│   │   └── SplitText.tsx    # Character & line splitting components
│   └── data/
│       └── portfolio.ts     # Portfolio projects data source
└── package.json
```
