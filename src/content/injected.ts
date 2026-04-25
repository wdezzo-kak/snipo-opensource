// Injected script for platform-specific UI modifications
// This runs in the context of the web page

function injectUI(): void {
  const platform = detectPlatform()
  if (!platform) return

  const button = document.createElement('button')
  button.className = 'snipo-open-btn'
  button.textContent = '📝 Snipo'
  button.title = 'Add note with Snipo Open'
  
  Object.assign(button.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: '999999',
    padding: '8px 16px',
    background: '#1a73e8',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  })

  button.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'ADD_NOTE' })
    chrome.sidePanel.open()
  })

  document.body.appendChild(button)
}

function detectPlatform(): string | null {
  const hostname = window.location.hostname
  if (hostname.includes('coursera.org')) return 'coursera'
  if (hostname.includes('youtube.com')) return 'youtube'
  return null
}

if (document.readyState === 'complete') {
  injectUI()
} else {
  window.addEventListener('load', injectUI)
}