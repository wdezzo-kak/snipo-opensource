## 1. Project Setup

- [x] 1.1 Initialize Vite + Vue 3 + TypeScript project
- [x] 1.2 Add vite-plugin-mv3 and configure bundling
- [x] 1.3 Set up Chrome extension manifest.json (MV3)
- [x] 1.4 Configure side panel entry point
- [x] 1.5 Set up Dexie.js for IndexedDB
- [x] 1.6 Verify empty shell builds and loads in Chrome

## 2. Core Extension Structure

- [x] 2.1 Create Pop and Pinia stores
- [x] 2.2 Set up background service worker
- [x] 2.3 Configure content scripts with URL matching
- [x] 2.4 Create platform adapter base class
- [x] 2.5 Set up web accessible resources

## 3. Coursera Adapter

- [x] 3.1 Implement Coursera URL detection
- [x] 3.2 Extract course title from DOM
- [x] 3.3 Extract course ID/slug from URL
- [x] 3.4 Extract module list from sidebar
- [x] 3.5 Get video element reference
- [x] 3.6 Implement playback controls (play/pause/seek/speed)

## 4. YouTube Adapter

- [x] 4.1 Implement YouTube URL detection
- [x] 4.2 Extract video ID from URL
- [x] 4.3 Extract title from page/player
- [x] 4.4 Extract channel name
- [x] 4.5 Get YouTube player reference
- [x] 4.6 Implement playback controls via player API

## 5. Note-Taking System

- [x] 5.1 Create note data model
- [x] 5.2 Implement timestamp capture
- [x] 5.3 Create Markdown generator (Snipo format)
- [x] 5.4 Implement local storage with Dexie.js
- [x] 5.5 Create folder hierarchy logic

## 6. Side Panel UI

- [x] 6.1 Build Vue side panel component
- [x] 6.2 Display current video metadata
- [x] 6.3 Create note list view
- [x] 6.4 Add note editor component
- [x] 6.5 Show Markdown preview

## 7. Keyboard Shortcuts

- [x] 7.1 Register all 9 shortcuts in manifest
- [x] 7.2 Implement command handlers in background
- [x] 7.3 Add message passing to content scripts
- [x] 7.4 Test shortcuts work across contexts

## 8. Testing & Polish

- [x] 8.1 Test Coursera full flow
- [x] 8.2 Test YouTube full flow
- [x] 8.3 Verify Markdown export format
- [x] 8.4 Test side panel on both platforms
- [x] 8.5 Verify keyboard shortcuts