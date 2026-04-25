import { BaseAdapter, type TranscriptSegment } from './base'
import type { VideoMetadata } from '../lib/db'

export class CourseraAdapter extends BaseAdapter {
  name = 'coursera'

  detect(): boolean {
    return window.location.hostname.includes('coursera.org')
  }

  getMetadata(): VideoMetadata | null {
    const pathMatch = window.location.pathname.match(/\/learn\/([^\/]+)/)
    const courseSlug = pathMatch?.[1] ?? 'unknown'

    const courseTitle = this.getCourseTitle()
    const videoTitle = this.getVideoTitle()

    return {
      id: crypto.randomUUID(),
      platform: 'coursera',
      courseId: courseSlug,
      courseTitle,
      videoId: this.getCurrentVideoId(),
      videoTitle,
      videoUrl: window.location.href
    }
  }

  getVideoElement(): HTMLVideoElement | null {
    return document.querySelector('video')
  }

  play(): void {
    const video = this.getVideoElement()
    if (video) video.play()
  }

  pause(): void {
    const video = this.getVideoElement()
    if (video) video.pause()
  }

  isPlaying(): boolean {
    const video = this.getVideoElement()
    return video ? !video.paused : false
  }

  async getTranscript(): Promise<TranscriptSegment[]> {
    const video = this.getVideoElement()
    const duration = video?.duration ?? Infinity
    const segments: TranscriptSegment[] = []

    const cues = document.querySelectorAll('cue')
    if (cues.length > 0) {
      cues.forEach((cue, index, all) => {
        const start = parseFloat((cue as HTMLElement).dataset.start ?? cue.getAttribute('start') ?? '0')
        const text = cue.textContent?.trim() ?? ''
        if (text) {
          const nextStart = index + 1 < all.length
            ? parseFloat((all[index + 1] as HTMLElement).dataset.start ?? all[index + 1].getAttribute('start') ?? '0')
            : duration
          segments.push({ start, end: nextStart, text })
        }
      })
      return segments
    }

    const transcriptEl = document.querySelector('[class*="transcript"]')
    if (transcriptEl) {
      const items = transcriptEl.querySelectorAll('[class*="segment"], [class*="cue"]')
      items.forEach((item, index) => {
        const text = item.textContent?.trim()
        if (text) {
          segments.push({ start: index * 3, end: (index + 1) * 3, text })
        }
      })
    }

    return segments
  }

  private getCurrentVideoId(): string {
    const path = window.location.pathname
    const match = path.match(/\/lecture\/([^\/]+)/)
    return match?.[1] ?? 'unknown'
  }

  private getCourseTitle(): string {
    const selectors = [
      '[data-testid="course-title"]',
      '.course-title',
      '.rc-DesktopHeader-courseName',
      'h1[class*="course"]',
      '.c-ph-header-title',
      '.rc-HeaderCourseTitle',
      'h1'
    ]
    for (const sel of selectors) {
      const el = document.querySelector(sel)
      if (el?.textContent?.trim()) return el.textContent.trim()
    }
    const breadcrumb = document.querySelector('[class*="breadcrumb"] [class*="item"]:last-child')
    return breadcrumb?.textContent?.trim() ?? 'Coursera Course'
  }

  private getVideoTitle(): string {
    const selectors = [
      '[data-testid="lecture-title"]',
      '.lecture-title',
      '[class*="lecture-title"]',
      '[class*="video-title"]',
      '.rc-Video-playerTitle',
      'h1[class*="lecture"]',
      '.rc-ItemHeader-title',
      '.rc-TopicTitle',
      'h1'
    ]
    for (const sel of selectors) {
      const el = document.querySelector(sel)
      if (el?.textContent?.trim()) return el.textContent.trim()
    }
    return document.title.split('|')[0].trim() ?? 'Video'
  }
}