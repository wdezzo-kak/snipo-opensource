# Product Requirements Document (PRD): Open-Source Snipo Alternative

## 1. Project Overview
An open-source, privacy-first Chrome Extension for active learning. It enables users to take synchronized notes, capture transcripts, and generate AI-powered study materials (flashcards/quizzes) from major educational platforms (Coursera, YouTube, Udemy, BiliBili, etc.) and sync them directly to Notion via a Markdown-first approach.

### Core Objectives
- **Active Learning:** Transform passive video watching into active note-taking.
- **Platform Agnostic (Future):** Support Coursera, YouTube, Vimeo, Skillshare, Udemy, BiliBili.
- **Notion Integration:** Filesystem-first Markdown export that is native-compatible with Notion.
- **AI-Powered Study:** Generate flashcards and quizzes from captured transcripts.
- **Security First:** Use modern MV3 security practices - no fetch interception, no remote code execution.

---

## 2. Technical Stack
Modern MV3 approach with security-first design:
- **Framework:** Vue.js 3 + TypeScript
- **Build Tool:** Vite (with vite-plugin-mv3 for extension bundling)
- **State Management:** Pinia
- **Browser API:** Chrome Extension Manifest V3
- **Storage:** 
  - Local: `chrome.storage.local` + IndexedDB (via Dexie.js)
  - Cloud (Future): Node.js/Express backend with PostgreSQL/Prisma
- **Authentication:** `chrome.identity` API for secure OAuth flows (NOT fetch interception)
- **Error Tracking:** Sentry (optional)

### Security Requirements (MV3)
- All code bundled in extension - NO remote code execution
- Use `chrome.identity` API for OAuth - NO `window.fetch` interception
- CSP configured in manifest.json
- Limited host permissions (specific domains, not `<all_urls>`)
- `web_accessible_resources` restricted to specific origins
- NO `eval()`, NO `new Function()` with external data
- Use `activeTab` permission instead of host permissions when possible

---

## 3. Functional Requirements (v0.1 - v0.2 Scope)

### 3.1. Platform Detection & Data Extraction
The extension detects platforms via URL matching and extracts metadata via DOM APIs (NOT React internal state).

#### 3.1.1. Coursera (Priority 1)
- **Detection:** URL pattern `https://*.coursera.org/*`
- **Metadata:** 
  - Query DOM selectors for course title, progress, modules
  - Use `data-testid` attributes and ARIA labels as fallbacks
  - Video element: `document.querySelector('video')` for playback control
- **Transcripts:** Scrape transcript text from DOM elements

#### 3.1.2. YouTube (Priority 2)
- **Detection:** URL pattern `https://*.youtube.com/*`
- **Metadata:** 
  - Use `ytInitialPlayerResponse` from page source or `window.getPlayerResponse()`
  - DOM: title from `yt-core` metadata elements
- **Transcripts:** YouTube transcript API or caption tracks from video player

### 3.2. Note-Taking Engine (Markdown-First)
- **Timestamped Notes:** Click a button or use a hotkey to capture the current video time with a text note.
- **Format (from original):** 
  ```
  # Video Title

  Finished: No
  Link: https://...
  Status: To Learn
  Tags: ChannelName
  Total Videos: 1
  Video Duration: 00:13:08

  [5:33](https://...&t=333s)
  Note text at timestamp...
  ```
  - **Frontmatter:** Simple key-value pairs (NOT YAML - matches original export)
  - **Body:** `[MM:SS](URL?t=SS)` timestamp link followed by note text
- **Screenshots:** Capture video frame using Canvas API, optional Base64 encoding

### 3.3. UI/UX Components
- **Side Panel:** Persistent Vue-powered sidebar for note-taking and transcript viewing.
- **Popup App:** Settings and account management.
- **Overlay UI:** In-video buttons.
- **Settings:** Web-accessible resources securely managed for injected elements.

### 3.4. Keyboard Shortcuts (Hotkeys)
Replicate the original 9 commands:
1. `mod+shift+k`: Timestamp Note
2. `mod+shift+,`: Take Screenshot
3. `mod+shift+space`: Pause/Play Video
4. `mod+shift+8`: Seek Backward (5s)
5. `mod+shift+9`: Seek Forward (5s)
6. `mod+shift+0`: Increase Speed
7. `mod+shift+7`: Decrease Speed
8. `mod+shift+.`: Toggle Transcript
9. `mod+shift+y`: Capture Video Clip

---

## 4. Integration & Sync Requirements

### 4.1. Notion Integration (Filesystem-First / Markdown)
- **Mechanism:** Generate `.md` files matching original Snipo format
- **Sync:** Users can import markdown files directly into Notion
- **Automated Sync (Future):** Use Notion Markdown API to create/update pages
- **Authentication:** User tokens via `chrome.identity` flow or manual token entry

### 4.2. Backend Service (Future - v0.5)
- **User Auth:** JWT-based authentication
- **Note Sync:** API for syncing local data

### 4.3. AI Features (Future - v0.4)
- **Provider:** Support local (Ollama) and cloud (OpenAI/Anthropic) APIs
- **Logic:** Feed transcript segments to LLM to generate Q&A pairs

---

## 5. Non-Functional Requirements
- **Offline First:** All notes saved locally as Markdown files; sync happens in background
- **Security First (MV3):**
  - Use `chrome.identity` API for OAuth - NOT fetch interception
  - All code bundled in extension - no remote code execution
  - Minimal permissions - specific domain host permissions only
  - No React internal state access - use DOM APIs only
- **Open Source:** Modular "Platform Adapter" architecture for easy extension

---

## 6. Roadmap (Updated)

### v0.1.0 - MVP (Coursera Focus)
- [ ] Extension scaffolding with Vite + Vue 3
- [ ] Coursera platform detection via DOM
- [ ] Basic side panel UI
- [ ] Local markdown generation
- [ ] Keyboard shortcuts

### v0.2.0 - YouTube Support
- [ ] YouTube platform detection
- [ ] Video metadata extraction
- [ ] Full keyboard shortcuts
- [ ] Folder hierarchy for exports

### v0.3.0 (Future) - Notion Sync
- [ ] Notion API integration
- [ ] Automated markdown import to Notion

### v0.4.0 (Future) - AI Features
- [ ] AI Flashcard generation
- [ ] Deck management

### v0.5.0 (Future) - More Platforms
- [ ] Vimeo support
- [ ] Skillshare support
- [ ] Udemy support
- [ ] BiliBili support
- [ ] Self-hostable backend + Multi-device sync
