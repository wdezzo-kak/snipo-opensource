chrome.runtime.onInstalled.addListener(() => {
  console.log('Snipo Open installed')
})

chrome.commands.onCommand.addListener((command) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0]
    if (!tab?.id) return

    switch (command) {
      case 'time':
        chrome.tabs.sendMessage(tab.id, { type: 'ADD_NOTE' })
        break
      case 'screen':
        chrome.tabs.sendMessage(tab.id, { type: 'SCREENSHOT' })
        break
      case 'pause':
        chrome.tabs.sendMessage(tab.id, { type: 'TOGGLE_PLAY' })
        break
      case 'back5s':
        chrome.tabs.sendMessage(tab.id, { type: 'SEEK', seconds: -5 })
        break
      case 'skip5s':
        chrome.tabs.sendMessage(tab.id, { type: 'SEEK', seconds: 5 })
        break
      case 'speed-inc':
        chrome.tabs.sendMessage(tab.id, { type: 'SPEED_INC' })
        break
      case 'speed-dec':
        chrome.tabs.sendMessage(tab.id, { type: 'SPEED_DEC' })
        break
      case 'transcript':
        chrome.tabs.sendMessage(tab.id, { type: 'TOGGLE_TRANSCRIPT' })
        break
      case 'clip':
        chrome.tabs.sendMessage(tab.id, { type: 'CLIP' })
        break
    }
  })
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PLATFORM_DETECTED') {
    chrome.storage.local.set({ currentVideo: message.payload })
  }
})