# User Workflow: Open-Source Learning Extension

## Step 1: Installation & Initial Setup
1. **Installation:** Install the extension from Chrome Web Store or load unpacked directory
2. **Onboarding:** Extension opens settings page (popup)
3. **Configuring Notion (Optional):** Enter Notion Internal Integration Token and select target database
4. **Permissions:** Grant host permissions for supported domains only:
   - `https://*.coursera.org/*`
   - `https://*.youtube.com/*`

---

## Step 2: Platform Detection
1. **Navigation:** Navigate to Coursera course or YouTube video
2. **Detection:** Extension detects via content script at `document_start`
   - URL pattern matching against manifest matches
   - Platform adapter auto-loaded
3. **Sidebar Activation:** Snipo sidebar toggle appears in browser side panel
4. **Context Lock:** Extension locks to current video/course via DOM metadata extraction

### Coursera DOM Detection (NOT React internal state)
```
// Safe approach - query DOM
const title = document.querySelector('[data-testid="course-title"]')?.textContent
const courseId = window.location.pathname.match(/\/learn\/([^\/]+)/)?.[1]
const video = document.querySelector('video')
```

### YouTube Detection
```
// YouTube embeds player data in page
const videoId = new URLSearchParams(window.location.search).get('v')
const title = document.title.replace(' - YouTube', '')
```

---

## Step 3: Taking a Note (User Actions)
1. **Trigger:** Press keyboard shortcut or click inject button
2. **Capture:**
   - **Timestamp:** `video.currentTime` → format as `MM:SS`
   - **Context:** Video title, module/section name
   - **Transcript (Optional):** Current transcript segment
   - **Screenshot (Optional):** Canvas API frame capture
3. **UI Feedback:** Note appears instantly in side panel for editing

### Keyboard Shortcuts (9 Commands)
| Shortcut | Action |
|---------|--------|
| `mod+shift+k` | Add timestamp note |
| `mod+shift+,` | Screenshot |
| `mod+shift+space` | Play/Pause |
| `mod+shift+8` | Seek back 5s |
| `mod+shift+9` | Seek forward 5s |
| `mod+shift+0` | Increase speed |
| `mod+shift+7` | Decrease speed |
| `mod+shift+.` | Toggle transcript |
| `mod+shift+y` | Capture video clip |

---

## Step 4: Storage & Markdown Generation
1. **Local Save:** Note saved to `chrome.storage.local` immediately
2. **File Output:** `[Title].md` file generated/updated

### Output Format (matches original Snipo)
```markdown
# Video Title

Finished: No
Link: https://platform.com/watch?v=xxx
Status: To Learn
Tags: ChannelName
Total Videos: 1
Video Duration: 00:13:08

[5:33](https://...&t=333s)
First note at this timestamp...

[7:02](https://...&t=422s)
Second note...
```

### Folder Hierarchy
```
/Snipo/
├── Coursera/
│   └── [Course Name]/
│       └── [Module Name]/
│           └── [Lecture Name].md
└── YouTube/
    └── [Channel Name]/
        └── [Video Name].md
```

---

## Step 5: Notion Sync (Optional - v0.3+)
1. **Manual Export:** Download .md file, import to Notion directly
2. **Automated Sync (Future):**
   - Click "Sync to Notion" in sidebar
   - API creates/updates Notion page via Markdown API
   - UI shows success checkmark
