## Why

The Snipo extension sidepanel currently lacks video control buttons. Users can only add timestamp notes but cannot play/pause videos, toggle transcripts, or take screenshots directly from the sidepanel. The sidepanel should provide full control over video learning features without requiring keyboard shortcuts.

## What Changes

- Add **Play/Pause button** to the sidepanel header with dynamic icon showing video state
- Add **Transcript toggle button** to show/hide video transcripts on supported platforms
- Add **Screenshot button** to capture the current video frame and save to notes
- Connect sidepanel buttons to existing content script message handlers
- Add new message handlers in content script for transcript and screenshot functionality

## Capabilities

### New Capabilities

- `sidepanel-controls`: Controls for Play/Pause, Transcript Toggle, and Screenshot in the sidepanel UI
- `video-transcript`: Fetch and display video transcripts for YouTube and Coursera
- `video-screenshot`: Capture video frames as screenshots attached to notes

### Modified Capabilities

- (none)

## Impact

- **Modified**: `src/ui/Sidepanel.vue` - Add action buttons and state management
- **Modified**: `src/content/content.ts` - Add TOGGLE_TRANSCRIPT and SCREENSHOT message handlers
- **Modified**: `src/adapters/youtube.ts` - Add transcript fetching and injection
- **Modified**: `src/adapters/coursera.ts` - Add transcript fetching and injection
- **New**: Screenshot capture logic using Canvas API