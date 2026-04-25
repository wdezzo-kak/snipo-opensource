import { BaseAdapter } from './base'
import type { VideoMetadata } from '../lib/db'

export class CourseraAdapter extends BaseAdapter {
  name = 'coursera'

  detect(): boolean {
    return window.location.hostname.includes('coursera.org')
  }

  getMetadata(): VideoMetadata | null {
    const pathMatch = window.location.pathname.match(/\/learn\/([^\/]+)/)
    const courseSlug = pathMatch?.[1] ?? 'unknown'
    
    const titleEl = document.querySelector('[data-testid="course-title"]') 
      ?? document.querySelector('h1')
    
    const courseTitle = titleEl?.textContent?.trim() ?? 'Untitled Course'

    return {
      id: crypto.randomUUID(),
      platform: 'coursera',
      courseId: courseSlug,
      courseTitle,
      videoId: this.getCurrentVideoId(),
      videoTitle: this.getCurrentVideoTitle(),
      videoUrl: window.location.href
    }
  }

  getVideoElement(): HTMLVideoElement | null {
    return document.querySelector('video')
  }

  private getCurrentVideoId(): string {
    const path = window.location.pathname
    const match = path.match(/\/lecture\/([^\/]+)/)
    return match?.[1] ?? 'unknown'
  }

  private getCurrentVideoTitle(): string {
    const titleEl = document.querySelector('[data-testid="lecture-title"]')
      ?? document.querySelector('[class*="title"]')
    return titleEl?.textContent?.trim() ?? 'Untitled Lecture'
  }
}