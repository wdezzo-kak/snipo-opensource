const TARGET_DOMAINS = ['coursera.org', 'youtube.com']

function isTargetDomain(url: string): boolean {
  try {
    const hostname = new URL(url).hostname
    return TARGET_DOMAINS.some(domain => hostname.includes(domain))
  } catch {
    return false
  }
}

chrome.runtime.onInstalled.addListener(() => {
  console.log('Snipo Open installed')
})

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && !isTargetDomain(changeInfo.url)) {
    chrome.sidePanel.close({ tabId })
    chrome.storage.local.remove('currentVideo')
  }
})

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId)
    if (tab.url && !isTargetDomain(tab.url)) {
      chrome.sidePanel.close({ tabId: activeInfo.tabId })
    }
  } catch {}
})

chrome.commands.onCommand.addListener(async (command) => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
  const tab = tabs[0]
  if (!tab?.id) return

  if (!isTargetDomain(tab.url ?? '')) {
    console.log('Command ignored: not on target domain')
    return
  }

  switch (command) {
    case 'time':
      chrome.tabs.sendMessage(tab.id, { type: 'ADD_NOTE' })
      break
    case 'screen':
      chrome.tabs.sendMessage(tab.id, { type: 'SCREENSHOT' })
      break
    case 'pause': {
      const isPlaying = await chrome.tabs.sendMessage(tab.id, { type: 'GET_PLAY_STATE' })
      chrome.tabs.sendMessage(tab.id, { type: isPlaying ? 'PAUSE' : 'PLAY' })
      break
    }
    case 'transcript':
      chrome.tabs.sendMessage(tab.id, { type: 'TOGGLE_TRANSCRIPT' })
      break
  }
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PLATFORM_DETECTED') {
    chrome.storage.local.set({ currentVideo: message.payload })
  }
  if (message.type === 'OPEN_SIDEPANEL') {
    if (sender.tab?.id && isTargetDomain(sender.tab.url ?? '')) {
      chrome.sidePanel.open({ tabId: sender.tab.id })
    }
  }
  return true
})