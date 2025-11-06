# Infinite Canvas - Credit Cards

An infinite scrolling canvas displaying credit card images in a grid layout.

## Quick Start

Due to browser security restrictions, you need to run a local web server instead of opening the HTML file directly.

### Option 1: Using Python (Recommended)

```bash
python3 server.py
```

Then open your browser and go to: `http://localhost:8000`

### Option 2: Using Python's built-in server

```bash
python3 -m http.server 8000
```

Then open your browser and go to: `http://localhost:8000`

### Option 3: Using Node.js (if you have it installed)

```bash
npx http-server -p 8000
```

Then open your browser and go to: `http://localhost:8000`

## Features

- Infinite scrolling canvas (20x20 grid)
- Smooth scrolling in all directions (including diagonal)
- White background
- Images cycle through all 8 credit card images from the Assets folder

## File Structure

```
allcreditcards/
├── index.html      # Main HTML file
├── styles.css      # Styling
├── script.js       # JavaScript logic
├── server.py       # Local server script
├── Assets/         # Image folder
│   └── *.png       # Credit card images
└── README.md       # This file
```

