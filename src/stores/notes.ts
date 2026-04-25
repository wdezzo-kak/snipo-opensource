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
      console.log('NotesStore: Setting current video:', video.videoTitle)
      this.currentVideo = video
      await this.loadNotes()
    },

    async loadNotes() {
      if (!this.currentVideo) {
        console.log('NotesStore: No current video, skipping load')
        return
      }
      console.log('NotesStore: Loading notes for videoId:', this.currentVideo.videoId)
      this.isLoading = true
      this.notes = []

      try {
        const allNotes = await db.notes.toArray()
        this.notes = allNotes.filter(note =>
          note.videoUrl === this.currentVideo?.videoUrl ||
          (note.videoTitle === this.currentVideo?.videoTitle &&
           note.courseId === this.currentVideo?.courseId)
        )
        console.log('NotesStore: Loaded', this.notes.length, 'notes')
      } catch (error) {
        console.error('NotesStore: Error loading notes:', error)
      } finally {
        this.isLoading = false
      }
    },

    async addNote(content: string, timestamp: number) {
      if (!this.currentVideo) {
        console.error('NotesStore: Cannot add note - no current video')
        return
      }
      if (!content.trim()) {
        console.error('NotesStore: Cannot add note - empty content')
        return
      }

      console.log('NotesStore: Adding note:', content.substring(0, 30))

      try {
        const note: Note = {
          platform: this.currentVideo.platform,
          courseId: this.currentVideo.courseId,
          courseTitle: this.currentVideo.courseTitle,
          videoTitle: this.currentVideo.videoTitle,
          videoUrl: this.currentVideo.videoUrl,
          timestamp,
          content: content.trim(),
          createdAt: new Date()
        }
        await db.notes.add(note)
        console.log('NotesStore: Note added successfully')
        await this.loadNotes()
      } catch (error) {
        console.error('NotesStore: Error adding note:', error)
      }
    },

    async deleteNote(id: number) {
      try {
        await db.notes.delete(id)
        await this.loadNotes()
      } catch (error) {
        console.error('NotesStore: Error deleting note:', error)
      }
    }
  }
})