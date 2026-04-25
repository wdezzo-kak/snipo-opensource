import { defineStore } from 'pinia'
import { db, type Note, type VideoMetadata } from '../lib/db'

interface NotesState {
  currentVideo: VideoMetadata | null
  notes: Note[]
  isLoading: boolean
}

export const useNotesStore = defineStore('notes', {
  state: (): NotesState => ({
    currentVideo: null,
    notes: [],
    isLoading: false
  }),

  actions: {
    async setCurrentVideo(video: VideoMetadata) {
      this.currentVideo = video
      await this.loadNotes()
    },

    async loadNotes() {
      if (!this.currentVideo) return
      this.isLoading = true
      this.notes = await db.notes
        .where('videoId')
        .equals(this.currentVideo.videoId)
        .toArray()
      this.isLoading = false
    },

    async addNote(content: string, timestamp: number) {
      if (!this.currentVideo) return
      const note: Note = {
        platform: this.currentVideo.platform,
        courseId: this.currentVideo.courseId,
        courseTitle: this.currentVideo.courseTitle,
        videoTitle: this.currentVideo.videoTitle,
        videoUrl: this.currentVideo.videoUrl,
        timestamp,
        content,
        createdAt: new Date()
      }
      await db.notes.add(note)
      await this.loadNotes()
    },

    async deleteNote(id: number) {
      await db.notes.delete(id)
      await this.loadNotes()
    }
  }
})