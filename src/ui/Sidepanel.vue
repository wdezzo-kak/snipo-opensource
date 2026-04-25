<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useNotesStore } from '../stores/notes'
import { generateMarkdown } from '../lib/markdown'

const store = useNotesStore()
const newNoteContent = ref('')
const isExporting = ref(false)

onMounted(async () => {
  const stored = await chrome.storage.local.get('currentVideo')
  if (stored.currentVideo) {
    store.setCurrentVideo(stored.currentVideo)
  }
})

async function addNote() {
  const time = await chrome.tabs.query({ active: true, currentWindow: true })
  if (!time[0]?.id) return
  
  const timestamp = await chrome.tabs.sendMessage(time[0].id, { type: 'GET_TIMESTAMP' })
  await store.addNote(newNoteContent.value, timestamp)
  newNoteContent.value = ''
}

async function exportMarkdown() {
  if (!store.currentVideo || store.notes.length === 0) return
  isExporting.value = true
  
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
  isExporting.value = false
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
    </header>
    
    <section v-if="store.currentVideo" class="video-info">
      <h2>{{ store.currentVideo.videoTitle }}</h2>
      <p class="channel">{{ store.currentVideo.channelName }}</p>
    </section>
    
    <section class="notes">
      <h3>Notes</h3>
      <div v-if="store.isLoading" class="loading">Loading...</div>
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
        placeholder="Add a note..."
        @keydown.ctrl.enter="addNote"
      ></textarea>
      <button @click="addNote" :disabled="!newNoteContent">Add Note</button>
    </section>
    
    <section class="actions">
      <button @click="exportMarkdown" :disabled="isExporting">
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

.header h1 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px;
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

.actions button {
  width: 100%;
  padding: 8px 16px;
  background: #34a853;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.loading {
  font-size: 12px;
  color: #666;
}
</style>