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
  isPlaying(): boolean
  getTranscript(): Promise<TranscriptSegment[]>
  getCurrentSegment(currentTime: number): Promise<string | null>
}

export interface TranscriptSegment {
  start: number
  end: number
  text: string
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

  isPlaying(): boolean {
    const video = this.getVideoElement()
    return video ? !video.paused : false
  }

  getTranscript(): Promise<TranscriptSegment[]> {
    return Promise.resolve([])
  }

  async getCurrentSegment(currentTime: number): Promise<string | null> {
    const segments = await this.getTranscript()
    if (segments.length === 0) return null

    const segment = segments.find((s, i) => {
      const nextStart = segments[i + 1]?.start ?? Infinity
      return currentTime >= s.start && currentTime < nextStart
    })

    return segment?.text ?? null
  }
}