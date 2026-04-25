# Snipo Open

An open-source, privacy-first Chrome Extension for active learning. Alternative to Snipo with modern MV3 security practices.

## Features

- **Platform Support**: Coursera, YouTube
- **Note-Taking**: Timestamped notes with Markdown export
- **Keyboard Shortcuts**: 9 configurable hotkeys
- **Security**: MV3 compliant - no fetch interception, all code bundled

## Development

```bash
npm install
npm run build
```

## Load Extension

1. Open `chrome://extensions`
2. Enable Developer mode
3. Click "Load unpacked"
4. Select the `snipo-opensource` directory

## Project Structure

```
snipo-opensource/
├── src/
│   ├── adapters/     # Platform adapters
│   ├── background/   # Service worker
│   ├── content/     # Content scripts
│   ├── lib/         # DB, utilities
│   ├── stores/      # Pinia stores
│   └── ui/          # Vue components
├── dist/            # Built extension
├── manifest.json    # MV3 manifest
└── vite.config.ts   # Build config
```

## License

MIT