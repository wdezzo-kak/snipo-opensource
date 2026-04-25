# Guide: How to Explore Snipo Extension with Chrome DevTools MCP

Use these prompts to analyze the Snipo extension step by step:

---

## Phase 1: Analyze the Website

**Prompt:**
```
Open https://snipo.io and:
1. Take a snapshot of the homepage
2. Look for sign up / login buttons
3. Check the navigation menu (Pricing, Features, etc.)
4. List all API calls made when loading the page
```

---

## Phase 2: Analyze Authentication

**Prompt:**
```
On https://snipo.io:
1. Navigate to the login page
2. Take a snapshot showing login form
3. If there's a "Sign in with Google" or OAuth button, identify the OAuth endpoint
4. Check network requests for any API calls
```

---

## Phase 3: Analyze Extension on YouTube

**Prompt:**
```
Navigate to https://www.youtube.com/watch?v=dQw4w9WgXcQ (or any video)
1. Take a snapshot of the page
2. Look for any Snipo UI elements (buttons, popups, sidebars)
3. Check the console for any errors or messages from the extension
4. Look for any injected HTML elements (check DevTools Elements panel)
```

---

## Phase 4: Extract Storage Data

**Prompt:**
```
With the Snipo extension installed and YouTube open:
1. Go to chrome://extensions/
2. Find Snipo and click "Service Worker" 
3. In the console, run: chrome.storage.local.get(null, console.log)
4. Report what data is stored locally
```

---

## Phase 5: Capture API Calls

**Prompt:**
```
On YouTube with Snipo active:
1. Perform these actions:
   - Take a timestamp note
   - Take a screenshot
   - Open the extension popup
2. For each action, list the network requests made to snipo.io
3. Show the request body and response for each
```

---

## Phase 6: Analyze Notion Integration

**Prompt:**
```
Navigate to https://notion.so and:
1. Open a workspace (or create test page)
2. Check for any Snipo UI elements or injection
3. Check console for any errors related to Snipo
```

---

## Phase 7: Map Subscription/Features

**Prompt:**
```
On the Snipo website:
1. Go to Pricing page
2. List all subscription tiers
3. List features for each tier
4. Check for any API calls related to subscriptions
```

---

## Complete Exploration Prompt (All-in-One)

```
I want to fully understand the Snipo Chrome extension. Please:

1. Open https://snipo.io and analyze:
   - Website structure, auth flow, pricing
   - All API endpoints used

2. On YouTube (https://youtube.com):
   - How the extension appears/works
   - What UI elements it injects
   - What data it captures
   - Network requests it makes

3. Check extension storage:
   - Run: chrome.storage.local.get(null, console.log)
   - Explain the data structure

4. Document:
   - All API endpoints with method, URL, request/response
   - Authentication flow
   - Data storage structure
   - Key features and how they work

Output a comprehensive technical report.
```

---

## Expected Output Format

After exploration, I'll produce:

```
┌─────────────────────────────────────────────────────┐
│              SNIPO EXTENSION ANALYSIS               │
├─────────────────────────────────────────────────────┤
│ API ENDPOINTS                                       │
│ POST /api/v3/auth/login     → User auth            │
│ GET  /api/v3/decks          → List flashcard decks │
│ POST /api/v3/deck/{id}/cards → Save cards          │
├─────────────────────────────────────────────────────┤
│ LOCAL STORAGE                                       │
│ {                                                   │
│   "snipo_token": "abc123...",                      │
│   "snipo_user": {...},                             │
│   "snipo_decks": [...],                            │
│   "snipo_settings": {...}                          │
│ }                                                   │
├─────────────────────────────────────────────────────┤
│ EXTENSION WORKFLOW                                  │
│ 1. User logs in → token stored                     │
│ 2. On YouTube → content script loads               │
│ 3. User clicks "Add Note" → captures timestamp     │
│ 4. Note saved to chrome.storage.local               │
│ 5. Sync to backend on next opportunity             │
└─────────────────────────────────────────────────────┘
```
