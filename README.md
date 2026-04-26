# Kanban Board

A lightweight, dependency-free Kanban board built with vanilla HTML, CSS, and JavaScript. Drag cards between columns, edit them inline, and your board is automatically saved to your browser.

![Stack](https://img.shields.io/badge/stack-HTML%20%7C%20CSS%20%7C%20JS-blue)
![Dependencies](https://img.shields.io/badge/dependencies-none-brightgreen)

## Features

- **Drag & drop** — Move cards between columns, reorder within a column (uses midpoint detection for natural placement)
- **Inline editing** — Click any card to rename. Enter or click-away to save
- **Add / delete tasks** — `+` button on each column header, `×` on each card
- **Auto-save** — All changes persist to `localStorage`; refreshing keeps your board
- **Live counts** — Each column header shows the number of tasks
- **Responsive layout** — 4 columns on desktop, 2 on tablet, 1 stacked on mobile
- **Modern UI** — Glassmorphism, color-coded columns, smooth animations
- **Accessible** — Keyboard-friendly, `aria-label`s on icon buttons, respects `prefers-reduced-motion`

## Columns

| Column | Color |
|---|---|
| Backlog | Amber |
| In Progress | Blue |
| Complete | Green |
| Rejected | Red |

## Getting Started

No build step, no install — just open the file.

```bash
# Clone or download the repo, then open index.html in a browser.
```

Or serve it with any static file server:

```bash
# Python
python -m http.server 8000

# Node (npx)
npx serve .
```

Then visit `http://localhost:8000`.

## Project Structure

```
Kanban Board/
├── index.html    # Markup and column structure
├── style.css     # Theme, layout, responsive breakpoints
├── script.js     # Drag/drop, persistence, CRUD logic
└── README.md
```

## How It Works

- **Persistence** — On every change (add, edit, delete, drop) the board state is serialized as `{ backlog: [...], progress: [...], complete: [...], reject: [...] }` and written to `localStorage` under the key `kanban-board-data`.
- **Drag positioning** — `getDragAfterElement` in [script.js](script.js) walks the cards in the target column and inserts the dragged card before the first one whose vertical midpoint is below the cursor.
- **Editing** — Cards use `contenteditable` on a `<span>` so editing feels like typing into a card, not a form field.

## Responsive Breakpoints

| Width | Layout |
|---|---|
| > 1024px | 4 columns side-by-side |
| ≤ 1024px | 2 × 2 grid |
| ≤ 640px  | Single stacked column |

On touch devices, delete buttons stay visible (no hover state to rely on).

## Resetting the Board

Open the browser dev tools console and run:

```js
localStorage.removeItem("kanban-board-data");
location.reload();
```

## Browser Support

Modern evergreen browsers (Chrome, Firefox, Edge, Safari). Uses CSS Grid, `backdrop-filter`, the HTML5 Drag & Drop API, and `localStorage`.

## License

MIT — free to use, modify, and learn from.
