## Context

Building a Chrome extension MVP for active learning with Coursera (primary) and YouTube (secondary) support. The original Snipo uses insecure patterns - we will use modern MV3 security practices.

**Current State:**
- Original codebase analyzed at `originalcodebase/`
- PRD and workflow defined in project root
- No existing extension code in this project

**Constraints:**
- Must use Manifest V3
- All code bundled in extension - no remote execution
- No fetch interception for OAuth
- No React internal state access - DOM APIs only

## Goals / Non-Goals

**Goals:**
- Extension scaffolding with Vite + Vue 3 + TypeScript
- Coursera detection via DOM selectors and URL parsing
- YouTube detection via embedded player data
- Side panel UI with note-taking
- Local Markdown file generation
- 9 keyboard shortcuts

**Non-Goals:**
- Notion API sync (v0.3)
- AI flashcard generation (v0.4)
- Additional platforms (v0.5)
- Cloud backend

## Decisions

### 1. Build Tool: Vite over Webpack
**Choice:** Vite with vite-plugin-mv3
**Rationale:** Faster dev server, simpler config, better HMR for extension development

### 2. Storage: Dexie.js over raw IndexedDB
**Choice:** Dexie.js for IndexedDB abstraction
**Rationale:** Cleaner API, TypeScript support, well-maintained

### 3. Platform Detection: URL Matching + Adapter Pattern
**Choice:** Content script loads per URL pattern, platform adapter handles extraction
**Rationale:** Clean separation, easily extensible to new platforms

### 4. Data Format: Original Snipo Format
**Choice:** Match original export format exactly
**Rationale:** User migration path, Notion import compatibility

### 5. Keyboard Shortcuts: Chrome Commands API
**Choice:** Use `commands` in manifest.json
**Rationale:** Built-in, works in all contexts, user-configurable

## Risks / Trade-offs

**[Risk] Coursera DOM changes frequently**
→ **Mitigation:** Use multiple selectors, data-testid attributes, class names as fallbacks

**[Risk] YouTube player API changes**
→ **Mitigation:** Check ytInitialPlayerResponse AND DOM fallback

**[Risk] Side panel vs popup state management**
→ **Mitigation:** Use chrome.storage as source of truth, not component state

**[Risk] Hotkeys may conflict with site shortcuts**
→ **Mitigation:** Document conflicts, allow user reconfiguration