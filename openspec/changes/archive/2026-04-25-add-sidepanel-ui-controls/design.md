## Context

The Snipo extension sidepanel currently provides only note-taking functionality. Users can add timestamped notes but have no way to control video playback, toggle transcripts, or take screenshots from the sidepanel UI. Keyboard shortcuts exist but are not discoverable.

The sidepanel should be the primary interface for video learning controls. Three features are needed:
1. **Play/Pause button** - Toggle video playback state
2. **Transcript toggle** - Show/hide transcript overlay on video pages
3. **Screenshot button** - Capture current video frame

Current architecture:
- `content.ts` - Runs on YouTube/Coursera, handles platform detection and video controls via message passing
- `adapters/` - Platform-specific logic for YouTube and Coursera
- `Sidepanel.vue` - Vue component for the sidepanel UI
- Communication via `chrome.runtime.sendMessage` between sidepanel and content scripts

## Goals / Non-Goals

**Goals:**
- Add Play/Pause button with dynamic icon reflecting video state
- Add Transcript toggle button to show/hide transcript overlay
- Add Screenshot button to capture video frame and save as note
- Maintain clean separation between UI (sidepanel) and video control (content script)
- Use existing message passing infrastructure

**Non-Goals:**
- Full transcript storage and search (future feature)
- Video speed controls (already has keyboard shortcut, can add UI later)
- Seek buttons (can add later if needed)

## Decisions

### 1. Sidepanel state management
- Add `isPlaying` and `isTranscriptVisible` refs to Sidepanel.vue
- Use `setInterval` polling every 500ms to sync video state when sidepanel is open
- Simpler than trying to maintain bidirectional state between page and sidepanel

### 2. Screenshot implementation
- Use Canvas API to capture video frame: draw video to canvas, export as PNG
- Store screenshot as base64 data URL in note content (prefix with "📷 ")
- No external dependencies needed

### 3. Transcript approach
- YouTube: Use YouTube's transcript API endpoint or inject transcript elements
- Coursera: Look for transcript/caption elements in the page
- Show transcript as floating overlay on the video page (injected via content script)
- Toggle visibility via CSS class injection

### 4. Message protocol
Keep existing message types but add new ones:
- `GET_PLAY_STATE` - Returns boolean for playing state
- `TOGGLE_TRANSCRIPT` - Triggers transcript injection/removal
- `SCREENSHOT` - Captures and returns image data URL

## Risks / Trade-offs

- [Risk] Sidepanel polling may impact performance → [Mitigation] Use efficient checks, stop polling when tab loses focus
- [Risk] YouTube transcript API may change → [Mitigation] Graceful fallback to no transcript available
- [Risk] Screenshot captures black frame if video is paused → [Mitigation] Brief note to user, or auto-play briefly