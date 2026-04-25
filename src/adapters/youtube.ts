import { BaseAdapter } from './base'
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
    this.executePlayerCommand('playVideo')
  }

  pause(): void {
    this.executePlayerCommand('pauseVideo')
  }

  seek(seconds: number): void {
    const currentTime = this.getCurrentTime()
    this.executePlayerCommand('seekTo', currentTime + seconds)
  }

  setSpeed(rate: number): void {
    this.executePlayerCommand('setPlaybackRate', rate)
  }

  getCurrentTime(): number {
    const player = this.getPlayer()
    return player?.getCurrentTime?.() ?? this.getVideoElement()?.currentTime ?? 0
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
    return el?.textContent?.trim() ?? document.title.replace(' - YouTube', '')
  }

  private getChannelName(): string {
    const el = document.querySelector('#channel-name')
      ?? document.querySelector('ytd-channel-name')
    return el?.textContent?.trim() ?? 'Unknown Channel'
  }

  private getDuration(): number | undefined {
    const player = this.getPlayer()?.() as { getDuration?: () => number } | null
    return player?.getDuration?.()
  }
}