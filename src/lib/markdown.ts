function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function formatUrlWithTimestamp(url: string, seconds: number): string {
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}t=${Math.floor(seconds)}s`
}

export function generateMarkdown(
  videoTitle: string,
  videoUrl: string,
  notes: Array<{ timestamp: number; content: string }>,
  metadata?: { channelName?: string; duration?: number }
): string {
  const lines: string[] = [
    `# ${videoTitle}`,
    '',
    `Finished: No`,
    `Link: ${videoUrl}`,
    `Status: To Learn`,
    `Tags: ${metadata?.channelName ?? ''}`,
    `Total Videos: 1`,
    `Video Duration: ${metadata?.duration ? formatTimestamp(metadata.duration) : '00:00'}`,
    ''
  ]

  for (const note of notes) {
    const ts = formatTimestamp(note.timestamp)
    const url = formatUrlWithTimestamp(videoUrl, note.timestamp)
    lines.push(`[${ts}](${url})`)
    lines.push(note.content)
    lines.push('')
  }

  return lines.join('\n')
}

export function parseTimestamp(url: string): number {
  const match = url.match(/[?&]t=(\d+)/)
  return match ? parseInt(match[1], 10) : 0
}