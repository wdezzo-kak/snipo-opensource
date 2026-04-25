import Dexie, { type Table } from 'dexie'

export interface Note {
  id?: number
  platform: 'coursera' | 'youtube'
  courseId: string
  courseTitle: string
  videoTitle: string
  videoUrl: string
  timestamp: number
  content: string
  createdAt: Date
}

export interface VideoMetadata {
  id: string
  platform: 'coursera' | 'youtube'
  courseId: string
  courseTitle: string
  videoId: string
  videoTitle: string
  videoUrl: string
  channelName?: string
  duration?: number
}

export class SnipoDB extends Dexie {
  notes!: Table<Note>
  videos!: Table<VideoMetadata>

  constructor() {
    super('SnipoDB')
    this.version(1).stores({
      notes: '++id, platform, courseId, videoTitle, createdAt',
      videos: '++id, platform, courseId, videoId'
    })
  }
}

export const db = new SnipoDB()