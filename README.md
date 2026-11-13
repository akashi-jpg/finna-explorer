# Finna Explorer

A React web app for searching Finnish libraries, archives and museums using
the [Finna API](https://api.finna.fi), and saving interesting records to a
personal collection.

**Live demo:** https:///akashi-jpg.github.io/finna-explorer/

## Features

- **Search**: find books, photos and other records by keyword
- **Record details**: view one record's information and add it to your collection
- **My collection**: saved records (stored in the browser's localStorage) with a chart of items by format

## Tech stack

- React + Vite
- react-router-dom (routing, HashRouter for GitHub Pages)
- Bootstrap + react-bootstrap (styling and UI components)
- Recharts (chart)
- Finna API (no API key required)

## Running locally

Requires [Node.js](https://nodejs.org/).

```bash
git clone https://github.com//akashi-jpg/finna-explorer.git
cd finna-explorer
npm install
npm run dev
```

Then open the address shown in the terminal (usually http://localhost:5173/).

## Deployment

```bash
npm run deploy
```

This builds the app and publishes the `dist` folder to the `gh-pages` branch.

## Author

Your Name, Web Development course final project