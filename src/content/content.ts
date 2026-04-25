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
      return adapter
    }
  }
  return null
}

function initialize(): void {
  currentAdapter = detectPlatform()
  if (currentAdapter) {
    currentMetadata = currentAdapter.getMetadata()
    chrome.runtime.sendMessage({
      type: 'PLATFORM_DETECTED',
      payload: currentMetadata
    })
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize)
} else {
  initialize()
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  switch (message.type) {
    case 'GET_METADATA':
      sendResponse(currentMetadata)
      break
    case 'GET_TIMESTAMP':
      sendResponse(currentAdapter?.getCurrentTime() ?? 0)
      break
    case 'PLAY':
      currentAdapter?.play()
      sendResponse(true)
      break
    case 'PAUSE':
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
  }
  return true
})