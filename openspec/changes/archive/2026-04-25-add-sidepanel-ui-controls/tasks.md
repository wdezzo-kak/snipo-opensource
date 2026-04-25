## 1. Update Sidepanel UI

- [x] 1.1 Add `isPlaying` ref and polling state to Sidepanel.vue
- [x] 1.2 Add Play/Pause button with dynamic icon (▶/⏸) next to header
- [x] 1.3 Add Transcript toggle button with icon
- [x] 1.4 Add Screenshot button with camera icon
- [x] 1.5 Implement click handlers that send messages via `chrome.tabs.sendMessage`
- [x] 1.6 Add polling to sync video state every 500ms when sidepanel is open
- [x] 1.7 Add CSS styles for action buttons section

## 2. Update Content Script Message Handlers

- [x] 2.1 Add `GET_PLAY_STATE` handler returning boolean
- [x] 2.2 Add `TOGGLE_TRANSCRIPT` handler to toggle transcript overlay
- [x] 2.3 Add `SCREENSHOT` handler to capture video frame as base64 PNG
- [x] 2.4 Refactor TOGGLE_PLAY command from background to use PLAY/PAUSE

## 3. Update YouTube Adapter

- [x] 3.1 Add `getTranscript()` method to fetch YouTube transcript data
- [x] 3.2 Add `injectTranscript()` method to show transcript overlay
- [x] 3.3 Add `removeTranscript()` method to hide transcript overlay
- [x] 3.4 Add `isPlaying()` method to check video play state

## 4. Update Coursera Adapter

- [x] 4.1 Add `getTranscript()` method to fetch Coursera transcript
- [x] 4.2 Add `injectTranscript()` method to show transcript overlay
- [x] 4.3 Add `removeTranscript()` method to hide transcript overlay
- [x] 4.4 Add `isPlaying()` method to check video play state

## 5. Update Base Adapter

- [x] 5.1 Add `getTranscript()`, `injectTranscript()`, `removeTranscript()`, `isPlaying()` stubs

## 6. Test and Build

- [x] 6.1 Test Play/Pause button on YouTube
- [x] 6.2 Test Play/Pause button on Coursera
- [x] 6.3 Test Transcript toggle on YouTube
- [x] 6.4 Test Screenshot capture
- [x] 6.5 Run `npm run build` to rebuild extension