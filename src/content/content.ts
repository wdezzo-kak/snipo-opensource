import { CourseraAdapter } from '../adapters/coursera'
import { YouTubeAdapter } from '../adapters/youtube'
import type { PlatformAdapter } from '../adapters/base'
import type { VideoMetadata } from '../lib/db'

let currentAdapter: PlatformAdapter | null = null
let currentMetadata: VideoMetadata | null = null

function detectPlatform(): PlatformAdapter | null {
  const adapters: PlatformAdapter[] = [
    new CourseraAdapter(),
    new YouTubeAdapter()
  ]

  for (const adapter of adapters) {
    if (adapter.detect()) {
      console.log('Snipo: Platform detected:', adapter.name)
      return adapter
    }
  }
  console.log('Snipo: No platform detected')
  return null
}

function initialize(): void {
  currentAdapter = detectPlatform()
  if (currentAdapter) {
    currentMetadata = currentAdapter.getMetadata()
    console.log('Snipo: Metadata initialized:', currentMetadata?.videoTitle)
    chrome.runtime.sendMessage({
      type: 'PLATFORM_DETECTED',
      payload: currentMetadata
    }).catch(err => console.error('Snipo: Failed to send PLATFORM_DETECTED:', err))
  } else {
    console.log('Snipo: No adapter found for this page')
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize)
} else {
  initialize()
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log('Snipo: Message received:', message.type)

  try {
    switch (message.type) {
      case 'GET_METADATA':
        sendResponse(currentMetadata)
        break
      case 'GET_TIMESTAMP':
        sendResponse(currentAdapter?.getCurrentTime() ?? 0)
        break
      case 'GET_PLAY_STATE': {
        const video = currentAdapter?.getVideoElement()
        const isPlaying = video ? !video.paused : false
        console.log('Snipo: Play state:', isPlaying)
        sendResponse(isPlaying)
        break
      }
      case 'PLAY':
        console.log('Snipo: Play command received')
        currentAdapter?.play()
        sendResponse(true)
        break
      case 'PAUSE':
        console.log('Snipo: Pause command received')
        currentAdapter?.pause()
        sendResponse(true)
        break
      case 'SEEK':
        currentAdapter?.seek(message.seconds)
        sendResponse(true)
        break
      case 'SET_SPEED':
        currentAdapter?.setSpeed(message.rate)
        sendResponse(true)
        break
      case 'TOGGLE_TRANSCRIPT':
      case 'GET_CURRENT_SEGMENT': {
        console.log('Snipo: Capturing current transcript segment...')
        const currentTime = currentAdapter?.getCurrentTime() ?? 0
        const getSegment = currentAdapter?.getCurrentSegment(currentTime)
        if (getSegment) {
          getSegment.then(segment => {
            console.log('Snipo: Segment captured:', segment)
            sendResponse(segment)
          })
        } else {
          sendResponse(null)
        }
        break
      }
      case 'SCREENSHOT': {
        console.log('Snipo: Screenshot command received')
        const video = currentAdapter?.getVideoElement()
        if (video && video.videoWidth > 0 && video.videoHeight > 0) {
          const canvas = document.createElement('canvas')
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          const ctx = canvas.getContext('2d')
          if (ctx) {
            ctx.drawImage(video, 0, 0)
            const dataUrl = canvas.toDataURL('image/png')
            console.log('Snipo: Screenshot captured, length:', dataUrl.length)
            sendResponse(dataUrl)
          } else {
            console.log('Snipo: Failed to get canvas context')
            sendResponse(null)
          }
        } else {
          console.log('Snipo: No video element or video has no dimensions')
          sendResponse(null)
        }
        break
      }
      default:
        console.log('Snipo: Unknown message type:', message.type)
        sendResponse({ error: 'Unknown message type' })
    }
  } catch (error) {
    console.error('Snipo: Error handling message:', error)
    sendResponse({ error: String(error) })
  }

  return true
})