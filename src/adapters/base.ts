import type { VideoMetadata } from '../lib/db'

export interface PlatformAdapter {
  name: string
  detect(): boolean
  getMetadata(): VideoMetadata | null
  getVideoElement(): HTMLVideoElement | null
  play(): void
  pause(): void
  seek(seconds: number): void
  setSpeed(rate: number): void
  getCurrentTime(): number
}

export abstract class BaseAdapter implements PlatformAdapter {
  abstract name: string

  abstract detect(): boolean
  abstract getMetadata(): VideoMetadata | null
  abstract getVideoElement(): HTMLVideoElement | null

  play(): void {
    const video = this.getVideoElement()
    if (video) video.play()
  }

  pause(): void {
    const video = this.getVideoElement()
    if (video) video.pause()
  }

  seek(seconds: number): void {
    const video = this.getVideoElement()
    if (video) video.currentTime += seconds
  }

  setSpeed(rate: number): void {
    const video = this.getVideoElement()
    if (video) video.playbackRate = rate
  }

  getCurrentTime(): number {
    const video = this.getVideoElement()
    return video?.currentTime ?? 0
  }
}