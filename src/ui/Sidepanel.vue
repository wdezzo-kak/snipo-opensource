<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useNotesStore } from '../stores/notes'
import { generateMarkdown } from '../lib/markdown'

const store = useNotesStore()
const newNoteContent = ref('')
const isExporting = ref(false)
const isPlaying = ref(false)
const isCapturingScreenshot = ref(false)
const addNoteError = ref('')
const showNoVideoWarning = ref(false)
const captureMessage = ref('')

let pollingInterval: ReturnType<typeof setInterval> | null = null

const TARGET_DOMAINS = ['coursera.org', 'youtube.com']

function isTargetDomain(url: string): boolean {
  try {
    const hostname = new URL(url).hostname
    return TARGET_DOMAINS.some(domain => hostname.includes(domain))
  } catch {
    return false
  }
}

async function getCurrentTab(): Promise<chrome.tabs.Tab | null> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  return tab ?? null
}

async function validateCurrentTab(): Promise<boolean> {
  const tab = await getCurrentTab()
  if (!tab?.id) {
    showNoVideoWarning.value = true
    return false
  }
  if (!tab.url || !isTargetDomain(tab.url)) {
    showNoVideoWarning.value = true
    return false
  }
  return true
}

onMounted(async () => {
  const isValid = await validateCurrentTab()
  if (!isValid) return

  const stored = await chrome.storage.local.get('currentVideo')
  if (stored.currentVideo) {
    console.log('Sidepanel: Setting video from storage:', stored.currentVideo.videoTitle)
    store.setCurrentVideo(stored.currentVideo)
  }
  startPolling()
})

onUnmounted(() => {
  stopPolling()
})

function startPolling() {
  pollingInterval = setInterval(syncVideoState, 500)
}

function stopPolling() {
  if (pollingInterval) {
    clearInterval(pollingInterval)
    pollingInterval = null
  }
}

async function syncVideoState() {
  try {
    const tab = await getCurrentTab()
    if (!tab?.id) return
    const state = await chrome.tabs.sendMessage(tab.id, { type: 'GET_PLAY_STATE' })
    if (typeof state === 'boolean') isPlaying.value = state
  } catch (err) {
    console.error('Sidepanel: Error syncing play state:', err)
  }
}

async function togglePlay() {
  addNoteError.value = ''
  captureMessage.value = ''
  const tab = await getCurrentTab()
  if (!tab?.id) return

  try {
    await chrome.tabs.sendMessage(tab.id, { type: isPlaying.value ? 'PAUSE' : 'PLAY' })
    isPlaying.value = !isPlaying.value
  } catch (err) {
    console.error('Sidepanel: Error toggling play:', err)
  }
}

async function captureTranscriptSegment() {
  addNoteError.value = ''
  captureMessage.value = ''
  const tab = await getCurrentTab()
  if (!tab?.id) return

  console.log('Sidepanel: Capturing transcript...')
  try {
    const timestamp = await chrome.tabs.sendMessage(tab.id, { type: 'GET_TIMESTAMP' })
    const segment = await chrome.tabs.sendMessage(tab.id, { type: 'GET_CURRENT_SEGMENT' })

    console.log('Sidepanel: Got response:', segment)
    if (segment && typeof segment === 'string') {
      await store.addNote(`📝 ${segment}`, timestamp ?? 0)
      captureMessage.value = 'Transcript captured!'
    } else {
      console.log('Sidepanel: No segment found')
      addNoteError.value = 'No transcript available'
    }
  } catch (err) {
    console.error('Sidepanel: Error capturing transcript:', err)
    addNoteError.value = 'Failed to capture transcript'
  }
}

async function takeScreenshot() {
  addNoteError.value = ''
  captureMessage.value = ''
  const tab = await getCurrentTab()
  if (!tab?.id) return

  isCapturingScreenshot.value = true
  try {
    const screenshotData = await chrome.tabs.sendMessage(tab.id, { type: 'SCREENSHOT' })
    if (screenshotData) {
      const timestamp = await chrome.tabs.sendMessage(tab.id, { type: 'GET_TIMESTAMP' })
      await store.addNote(`📷 [Screenshot]`, timestamp ?? 0)
      captureMessage.value = 'Screenshot captured!'
    } else {
      addNoteError.value = 'Failed to capture screenshot'
    }
  } catch (err) {
    console.error('Sidepanel: Error taking screenshot:', err)
    addNoteError.value = 'Screenshot failed'
  } finally {
    isCapturingScreenshot.value = false
  }
}

async function addNote() {
  addNoteError.value = ''
  if (!newNoteContent.value.trim()) {
    addNoteError.value = 'Please enter a note'
    return
  }

  const tab = await getCurrentTab()
  if (!tab?.id) return

  try {
    const timestamp = await chrome.tabs.sendMessage(tab.id, { type: 'GET_TIMESTAMP' })
    await store.addNote(newNoteContent.value, timestamp ?? 0)
    newNoteContent.value = ''
  } catch (err) {
    console.error('Sidepanel: Error adding note:', err)
    addNoteError.value = 'Failed to add note'
  }
}

async function exportMarkdown() {
  if (!store.currentVideo || store.notes.length === 0) return
  isExporting.value = true

  try {
    const markdown = generateMarkdown(
      store.currentVideo.videoTitle,
      store.currentVideo.videoUrl,
      store.notes.map(n => ({ timestamp: n.timestamp, content: n.content })),
      { channelName: store.currentVideo.channelName, duration: store.currentVideo.duration }
    )

    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${store.currentVideo.videoTitle}.md`
    a.click()
    URL.revokeObjectURL(url)
  } catch (err) {
    console.error('Sidepanel: Error exporting:', err)
  } finally {
    isExporting.value = false
  }
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
</script>

<template>
  <div class="sidepanel">
    <header class="header">
      <h1>Snipo Open</h1>
      <div class="action-buttons">
        <button @click="togglePlay" :title="isPlaying ? 'Pause' : 'Play'" class="action-btn play-btn">
          {{ isPlaying ? '⏸' : '▶' }}
        </button>
        <button @click="captureTranscriptSegment" title="Capture current transcript" class="action-btn transcript-btn">
          📝
        </button>
        <button @click="takeScreenshot" title="Take Screenshot" class="action-btn screenshot-btn" :disabled="isCapturingScreenshot">
          📷
        </button>
      </div>
    </header>

    <section v-if="showNoVideoWarning" class="no-video-warning">
      <p>Open this sidepanel while on a YouTube or Coursera video page.</p>
    </section>

    <section v-else-if="store.currentVideo" class="video-info">
      <h2>{{ store.currentVideo.videoTitle }}</h2>
      <p class="channel">{{ store.currentVideo.channelName ?? store.currentVideo.courseTitle }}</p>
    </section>

    <section v-else class="video-info">
      <p class="no-video">No video detected. Navigate to a video page.</p>
    </section>

    <section class="notes">
      <h3>Notes</h3>
      <div v-if="store.isLoading" class="loading">Loading...</div>
      <div v-else-if="store.notes.length === 0" class="no-notes">No notes yet. Add your first note below!</div>
      <ul v-else class="note-list">
        <li v-for="note in store.notes" :key="note.id" class="note">
          <span class="timestamp">{{ formatTime(note.timestamp) }}</span>
          <p class="content">{{ note.content }}</p>
        </li>
      </ul>
    </section>

    <section class="add-note">
      <textarea
        v-model="newNoteContent"
        placeholder="Add a note... (Ctrl+Enter to save)"
        @keydown.ctrl.enter="addNote"
      ></textarea>
      <button @click="addNote" :disabled="!newNoteContent.trim()">Add Note</button>
      <div v-if="addNoteError" class="error">{{ addNoteError }}</div>
      <div v-if="captureMessage" class="success">{{ captureMessage }}</div>
    </section>

    <section class="actions">
      <button @click="exportMarkdown" :disabled="isExporting || store.notes.length === 0">
        {{ isExporting ? 'Exporting...' : 'Export Markdown' }}
      </button>
    </section>
  </div>
</template>

<style>
.sidepanel {
  padding: 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header h1 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f3f4;
  transition: background 0.2s;
}

.action-btn:hover {
  background: #e8eaed;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn.active {
  background: #e8f0fe;
  color: #1a73e8;
}

.video-info {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.video-info h2 {
  font-size: 14px;
  margin: 0 0 4px;
}

.channel {
  font-size: 12px;
  color: #666;
  margin: 0;
}

.no-video, .no-video-warning, .no-notes {
  font-size: 13px;
  color: #666;
  text-align: center;
  padding: 12px;
}

.no-video-warning {
  background: #fff3cd;
  border-radius: 4px;
  margin-bottom: 16px;
}

.notes {
  margin-bottom: 16px;
}

.notes h3 {
  font-size: 14px;
  margin: 0 0 8px;
}

.note-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.note {
  padding: 8px;
  margin-bottom: 8px;
  background: #f5f5f5;
  border-radius: 4px;
}

.timestamp {
  font-size: 11px;
  color: #1a73e8;
  font-weight: 500;
}

.note .content {
  font-size: 13px;
  margin: 4px 0 0;
}

.add-note {
  margin-bottom: 16px;
}

.add-note textarea {
  width: 100%;
  min-height: 60px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  resize: vertical;
  margin-bottom: 8px;
}

.add-note button {
  width: 100%;
  padding: 8px 16px;
  background: #1a73e8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-note button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.error {
  color: #d93025;
  font-size: 12px;
  margin-top: 4px;
}

.success {
  color: #34a853;
  font-size: 12px;
  margin-top: 4px;
}

.actions button {
  width: 100%;
  padding: 8px 16px;
  background: #34a853;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.actions button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.loading {
  font-size: 12px;
  color: #666;
  text-align: center;
}
</style>