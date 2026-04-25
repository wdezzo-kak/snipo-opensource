## Why

Build an open-source, privacy-first Chrome extension alternative to Snipo for active learning. The original Snipo extension uses insecure patterns (fetch interception, React internal state access) that violate modern MV3 security practices. This MVP creates a secure foundation with Coursera as primary target and YouTube as secondary.

## What Changes

- Create extension scaffolding with Vite + Vue 3 + TypeScript
- Implement Coursera platform detection via DOM (NOT React internal state)
- Implement YouTube platform detection via player API
- Build side panel UI for note-taking
- Create local Markdown generation matching original Snipo format
- Register 9 keyboard shortcuts

## Capabilities

### New Capabilities
- `extension-scaffolding`: MV3 Chrome extension project structure with Vue 3, TypeScript, Vite
- `platform-detection`: URL-based detection with DOM metadata extraction
- `coursera-adapter`: Coursera-specific data extraction (course title, modules, video)
- `youtube-adapter`: YouTube-specific data extraction (video ID, title, channel)
- `note-taking`: Timestamped note capture with Markdown format generation
- `keyboard-shortcuts`: 9 configurable hotkeys for video control

### Modified Capabilities
- None (first version)

## Impact

- New project: Chrome extension in `src/` directory
- Dependencies: Vue 3, Pinia, Dexie.js, vite-plugin-mv3
- Manifest V3 with specific host permissions for coursera.org and youtube.com