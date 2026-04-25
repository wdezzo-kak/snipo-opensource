import { BaseAdapter, type TranscriptSegment } from './base'
import type { VideoMetadata } from '../lib/db'

export class YouTubeAdapter extends BaseAdapter {
  name = 'youtube'

  detect(): boolean {
    return window.location.hostname.includes('youtube.com')
  }

  getMetadata(): VideoMetadata | null {
    const urlParams = new URLSearchParams(window.location.search)
    const videoId = urlParams.get('v') ?? 'unknown'

    const title = this.getVideoTitle()
    const channel = this.getChannelName()
    const duration = this.getDuration()

    return {
      id: crypto.randomUUID(),
      platform: 'youtube',
      courseId: videoId,
      courseTitle: channel,
      videoId,
      videoTitle: title,
      videoUrl: window.location.href,
      channelName: channel,
      duration
    }
  }

  getVideoElement(): HTMLVideoElement | null {
    return document.querySelector('video')
  }

  play(): void {
    const video = this.getVideoElement()
    if (video) {
      video.play()
    } else {
      this.executePlayerCommand('playVideo')
    }
  }

  pause(): void {
    const video = this.getVideoElement()
    if (video) {
      video.pause()
    } else {
      this.executePlayerCommand('pauseVideo')
    }
  }

  seek(seconds: number): void {
    const video = this.getVideoElement()
    if (video) {
      video.currentTime += seconds
    } else {
      const currentTime = this.getCurrentTime()
      this.executePlayerCommand('seekTo', currentTime + seconds)
    }
  }

  setSpeed(rate: number): void {
    const video = this.getVideoElement()
    if (video) {
      video.playbackRate = rate
    } else {
      this.executePlayerCommand('setPlaybackRate', rate)
    }
  }

  getCurrentTime(): number {
    const video = this.getVideoElement()
    if (video) return video.currentTime
    const player = this.getPlayer()
    return player?.getCurrentTime?.() ?? 0
  }

  isPlaying(): boolean {
    const video = this.getVideoElement()
    if (video) return !video.paused
    const player = this.getPlayer() as { getPlayerState?: () => number } | null
    return player?.getPlayerState?.() === 1
  }

  async getTranscript(): Promise<TranscriptSegment[]> {
    const videoId = new URLSearchParams(window.location.search).get('v')
    if (!videoId) {
      console.log('Snipo YouTube: No video ID found')
      return []
    }

    console.log('Snipo YouTube: Fetching transcript for video:', videoId)

    try {
      const response = await fetch(`https://youtubetranscript.com/?v=${videoId}`)
      if (!response.ok) {
        console.log('Snipo YouTube: External transcript API failed, trying internal API')
        return this.getTranscriptInternal(videoId)
      }

      const html = await response.text()
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')
      const segments: TranscriptSegment[] = []
      const duration = this.getDuration() ?? Infinity

      doc.querySelectorAll('text').forEach((el, index, all) => {
        const start = parseFloat(el.getAttribute('start') ?? '0')
        const text = el.textContent?.trim() ?? ''
        if (text) {
          const nextStart = index + 1 < all.length
            ? parseFloat(all[index + 1].getAttribute('start') ?? '0')
            : duration
          segments.push({ start, end: nextStart, text })
        }
      })

      console.log('Snipo YouTube: Got', segments.length, 'transcript segments')
      return segments
    } catch (e) {
      console.log('Snipo YouTube: Error fetching transcript:', e)
      return this.getTranscriptInternal(videoId)
    }
  }

  private async getTranscriptInternal(videoId: string): Promise<TranscriptSegment[]> {
    try {
      const response = await fetch(`https://www.youtube.com/api/timedtext?v=${videoId}&fmt=json3`)
      if (!response.ok) {
        console.log('Snipo YouTube: Internal API also failed')
        return []
      }

      const data = await response.json()
      const segments: TranscriptSegment[] = []

      if (data?.events) {
        data.events.forEach((event: { tStartMs?: number; dDurationMs?: number; segs?: Array<{ utf8: string }> }) => {
          if (event.segs) {
            const start = (event.tStartMs ?? 0) / 1000
            const end = start + ((event.dDurationMs ?? 0) / 1000)
            event.segs.forEach(seg => {
              const text = seg.utf8?.trim()
              if (text) {
                segments.push({ start, end, text })
              }
            })
          }
        })
      }

      console.log('Snipo YouTube: Internal API got', segments.length, 'segments')
      return segments
    } catch (e) {
      console.log('Snipo YouTube: Internal API error:', e)
      return []
    }
  }

  private getPlayer(): unknown {
    try {
      const w = window as Record<string, unknown>
      const yt = w.yt
      if (yt && typeof yt === 'object') {
        const player = (yt as Record<string, unknown>).player
        if (player && typeof player === 'object') {
          const getPlayer = (player as Record<string, () => unknown>).getPlayer
          if (getPlayer) return getPlayer()
        }
      }
      const ytdPlayer = document.querySelector('ytd-player')
      if (ytdPlayer) return (ytdPlayer as Record<string, () => unknown>).getPlayer?.()
    } catch {}
    return null
  }

  private executePlayerCommand(method: string, ...args: unknown[]): void {
    const player = this.getPlayer() as Record<string, (...args: unknown[]) => void>
    if (player?.[method]) {
      player[method](...args)
    }
  }

  private getVideoTitle(): string {
    const el = document.querySelector('h1.ytd-video-primary-info-renderer')
      ?? document.querySelector('yt-formatted-string.ytd-video-owner-renderer')
      ?? document.querySelector('title')
    return el?.textContent?.trim()?.replace(' - YouTube', '') ?? document.title.replace(' - YouTube', '')
  }

  private getChannelName(): string {
    const el = document.querySelector('#channel-name a')
      ?? document.querySelector('ytd-channel-name a')
      ?? document.querySelector('#owner-name')
    return el?.textContent?.trim() ?? 'YouTube'
  }

  private getDuration(): number | undefined {
    const video = this.getVideoElement()
    if (video && video.duration) return video.duration
    const player = this.getPlayer() as { getDuration?: () => number } | null
    return player?.getDuration?.()
  }
}